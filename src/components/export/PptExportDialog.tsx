import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileDown, Loader2, X } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useBookStore } from '@/stores/bookStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useBookPlan, type PagePlan } from '@/lib/pagination';
import { locate } from '@/lib/outline';
import { PageView } from '@/components/book/BookPages';
import { exportPagesToPptx, type PptMode } from '@/lib/pptx';

type Scope = 'all' | 'part' | 'topic' | 'pages';

/** "4, 10-12" → set nombor halaman (0 = kulit). */
export function parsePages(input: string): Set<number> {
  const out = new Set<number>();
  for (const raw of input.split(/[,;\s]+/)) {
    const m = raw.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) continue;
    const a = Number(m[1]);
    const b = m[2] ? Number(m[2]) : a;
    for (let n = Math.min(a, b); n <= Math.max(a, b) && n - Math.min(a, b) < 2000; n++) out.add(n);
  }
  return out;
}

const field = 'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm';

/** Dialog muat turun PowerPoint: keseluruhan buku, satu bahagian utama, satu tajuk atau julat halaman. */
export default function PptExportDialog() {
  const open = useUiStore((s) => s.pptOpen);
  const setOpen = useUiStore((s) => s.setPptOpen);
  const toast = useUiStore((s) => s.toast);
  const outline = useBookStore((s) => s.outline);
  const sections = useBookStore((s) => s.sections);
  const activeId = useNavigationStore((s) => s.activeSectionId);
  const plan = useBookPlan();

  const [scope, setScope] = useState<Scope>('all');
  const [partId, setPartId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [pages, setPages] = useState('');
  const [mode, setMode] = useState<PptMode>('native');
  const [busy, setBusy] = useState<{ done: number; total: number } | null>(null);
  const [rendering, setRendering] = useState<PagePlan[] | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  // Lalai ikut tajuk yang sedang disunting.
  useEffect(() => {
    if (!open) return;
    const loc = activeId ? locate(outline, activeId) : undefined;
    setPartId(loc?.partId ?? outline[0]?.id ?? '');
    const topic = loc ? (loc.parentId ?? loc.id) : outline[0]?.topics[0]?.id ?? '';
    setTopicId(topic);
    if (loc) setScope('topic');
  }, [open, activeId, outline]);

  const topics = useMemo(
    () => outline.flatMap((p) => p.topics.map((t) => ({ id: t.id, part: p.title, title: sections[t.id]?.title ?? t.id, ids: [t.id, ...t.children] }))),
    [outline, sections],
  );

  const selected = useMemo(() => {
    if (scope === 'all') return plan;
    if (scope === 'part') {
      return plan.filter((p) => (p.kind === 'divider' && p.partId === partId) || (p.kind === 'content' && locate(outline, p.sectionId)?.partId === partId));
    }
    if (scope === 'topic') {
      const ids = new Set(topics.find((t) => t.id === topicId)?.ids ?? []);
      return plan.filter((p) => p.kind === 'content' && ids.has(p.sectionId));
    }
    const nums = parsePages(pages);
    return plan.filter((p) => (p.kind === 'cover' ? nums.has(0) : nums.has(p.number)));
  }, [scope, plan, partId, topicId, pages, outline, topics]);

  // Selepas halaman dipasang di luar skrin, tangkap setiap satu dan bina fail .pptx.
  useEffect(() => {
    if (!rendering) return;
    let cancelled = false;
    (async () => {
      try {
        await document.fonts?.ready;
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const host = hostRef.current;
        if (!host) return;
        const wraps = Array.from(host.querySelectorAll<HTMLElement>('.book-page-wrap'));
        const label = scope === 'all' ? 'Penuh'
          : scope === 'part' ? outline.find((p) => p.id === partId)?.title ?? 'Bahagian'
            : scope === 'topic' ? sections[topicId]?.title ?? 'Tajuk' : `Halaman ${pages}`;
        await exportPagesToPptx(wraps, label, (done, total) => !cancelled && setBusy({ done, total }), mode);
        if (!cancelled) {
          toast(`Fail PowerPoint dimuat turun (${wraps.length} slaid).`);
          setOpen(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) toast(`Gagal menjana PowerPoint: ${(e as Error).message}`, 'error');
      } finally {
        if (!cancelled) {
          setRendering(null);
          setBusy(null);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [rendering]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const start = () => {
    if (!selected.length) return;
    setBusy({ done: 0, total: selected.length });
    setRendering(selected);
  };
  const close = () => !busy && setOpen(false);

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" onClick={close}>
        <div role="dialog" aria-modal="true" aria-labelledby="ppt-title" className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-card" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 id="ppt-title" className="font-display text-lg font-bold">Muat turun PowerPoint</h2>
              <p className="text-xs text-muted">Satu halaman A4 = satu slaid potret, mengikut reka letak pratonton.</p>
            </div>
            <button className="rounded-md p-1.5 text-muted hover:bg-surface-2" onClick={close} aria-label="Tutup"><X size={18} /></button>
          </div>

          <fieldset className="grid gap-2 text-sm" disabled={!!busy}>
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Pilih kandungan</legend>
            <label className="flex items-center gap-2"><input type="radio" name="ppt-scope" checked={scope === 'all'} onChange={() => setScope('all')} /> Keseluruhan buku</label>

            <label className="flex items-center gap-2"><input type="radio" name="ppt-scope" checked={scope === 'part'} onChange={() => setScope('part')} /> Bahagian utama</label>
            {scope === 'part' && (
              <select className={field} value={partId} onChange={(e) => setPartId(e.target.value)} aria-label="Bahagian utama">
                {outline.map((p, i) => <option key={p.id} value={p.id}>{i + 1}. {p.title}</option>)}
              </select>
            )}

            <label className="flex items-center gap-2"><input type="radio" name="ppt-scope" checked={scope === 'topic'} onChange={() => setScope('topic')} /> Tajuk (bersama subtajuk)</label>
            {scope === 'topic' && (
              <select className={field} value={topicId} onChange={(e) => setTopicId(e.target.value)} aria-label="Tajuk">
                {outline.map((p) => (
                  <optgroup key={p.id} label={p.title}>
                    {topics.filter((t) => t.part === p.title).map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </optgroup>
                ))}
              </select>
            )}

            <label className="flex items-center gap-2"><input type="radio" name="ppt-scope" checked={scope === 'pages'} onChange={() => setScope('pages')} /> Halaman tertentu</label>
            {scope === 'pages' && (
              <div className="grid gap-1">
                <input className={field} value={pages} onChange={(e) => setPages(e.target.value)} placeholder="cth. 4, 50-55" aria-label="Nombor halaman" />
                <span className="text-xs text-muted">Nombor seperti di kaki halaman (0 = kulit). Jumlah halaman: {plan.length - 1}.</span>
              </div>
            )}
          </fieldset>

          <fieldset className="mt-4 grid gap-1.5 text-sm" disabled={!!busy}>
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Format slaid</legend>
            <label className="flex items-start gap-2">
              <input type="radio" name="ppt-mode" className="mt-1" checked={mode === 'native'} onChange={() => setMode('native')} />
              <span><b>Boleh disunting</b> - teks, jadual, bentuk dan gambar sebagai objek PowerPoint; tajuk dalam placeholder Slide Master.</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="ppt-mode" className="mt-1" checked={mode === 'image'} onChange={() => setMode('image')} />
              <span><b>Gambar</b> - rupa tepat seperti pratonton (tidak boleh disunting).</span>
            </label>
          </fieldset>

          <div className="mt-5 flex items-center justify-between gap-3">
            <span className="text-sm text-muted">
              {busy ? `Menjana slaid ${busy.done}/${busy.total}…` : `${selected.length} halaman dipilih`}
            </span>
            <button
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-fg hover:opacity-90 disabled:opacity-50"
              disabled={!selected.length || !!busy}
              onClick={start}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />} Muat turun .pptx
            </button>
          </div>
        </div>
      </div>
      {rendering && createPortal(
        <div ref={hostRef} aria-hidden="true" style={{ position: 'fixed', left: -12000, top: 0, width: 794, pointerEvents: 'none' }}>
          {rendering.map((p) => <PageView key={p.key} page={p} />)}
        </div>,
        document.body,
      )}
    </>
  );
}
