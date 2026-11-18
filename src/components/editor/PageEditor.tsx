import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MousePointerClick, Plus, X } from 'lucide-react';
import type { BlockType } from '@/types/book';
import { useBookStore } from '@/stores/bookStore';
import { blockLabels } from '@/lib/blocks';
import { PageEditCtx, SectionPages } from '@/components/book/BookPages';
import BlockEditor, { field } from './BlockEditor';

const addable: BlockType[] = ['heading', 'paragraph', 'list', 'table', 'keyvalue', 'image', 'committee', 'stafflist'];
const smallBtn = 'inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-xs font-medium hover:bg-surface-2';

interface Sel { bid: string; f: string | null }
interface Need { n: string; page: number; bid: string; f: string | null }

/**
 * Sunting terus dalam paparan halaman sebenar (WYSIWYG): klik mana-mana bahagian halaman → panel penyunting blok itu
 * dibuka dan kursor diletakkan pada medan yang diklik (sel jadual, item senarai, baris maklumat, peranan jawatankuasa).
 * Perubahan dipaparkan serta-merta pada halaman.
 */
export function PageEditor({ id }: { id: string }) {
  const sec = useBookStore((s) => s.sections[id]);
  const { updateSection, updateBlock, removeBlock, moveBlock, addBlock } = useBookStore();
  const [sel, setSel] = useState<Sel | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const pagesRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setSel(null), [id]);

  // Senarai medan perlu diisi (nombor panduan) pada halaman ini — pintasan ke medan.
  useLayoutEffect(() => {
    const root = pagesRef.current;
    if (!root) return;
    const pages = Array.from(root.querySelectorAll<HTMLElement>('.book-page'));
    const out: Need[] = [];
    pages.forEach((pg, pi) => pg.querySelectorAll<HTMLElement>('[data-n]').forEach((el) => {
      const bid = el.closest<HTMLElement>('[data-bid]')?.dataset.bid;
      if (bid) out.push({ n: el.dataset.n ?? '', page: pi + 1, bid, f: el.closest<HTMLElement>('[data-f]')?.dataset.f ?? null });
    }));
    const key = (x: Need[]) => x.map((y) => `${y.page}.${y.n}.${y.bid}.${y.f}`).join('|');
    setNeeds((prev) => (key(prev) === key(out) ? prev : out));
  });

  // Letakkan kursor pada medan yang diklik dalam panel penyunting.
  useEffect(() => {
    if (!sel) return;
    const t = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const hit = sel.f ? panel.querySelector<HTMLElement>(`[data-f="${sel.f}"]`) : null;
      const scope = hit ?? panel;
      // medan boleh fokus: elemen itu sendiri, atau (bagi baris jawatankuasa) pemilih ahli dahulu, kemudian ruang teks
      const el = hit?.matches('input, textarea, select') ? hit
        : scope.querySelector<HTMLElement>('select') && hit ? scope.querySelector<HTMLElement>('select')
        : scope.querySelector<HTMLElement>('textarea, input:not([type=checkbox]):not([type=file])');
      (hit ?? el)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el?.focus({ preventScroll: true });
      if (hit && !hit.matches('input, textarea, select')) { hit.classList.add('pe-flash'); window.setTimeout(() => hit.classList.remove('pe-flash'), 1200); }
    }, 60);
    return () => window.clearTimeout(t);
  }, [sel]);

  if (!sec) return null;
  const index = sel ? sec.blocks.findIndex((b) => b.id === sel.bid) : -1;
  const block = index >= 0 ? sec.blocks[index] : null;

  const onClick = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    const host = t.closest<HTMLElement>('[data-bid]');
    if (!host?.dataset.bid) return;
    setSel({ bid: host.dataset.bid, f: t.closest<HTMLElement>('[data-f]')?.dataset.f ?? null });
  };
  // Blok baharu terus dibuka dalam panel penyunting.
  const add = (t: BlockType) => {
    addBlock(id, t);
    const nb = useBookStore.getState().sections[id]?.blocks.at(-1);
    if (nb) setSel({ bid: nb.id, f: null });
  };
  const jump = (x: Need) => {
    setSel({ bid: x.bid, f: x.f });
    pagesRef.current?.querySelector(`[data-bid="${x.bid}"]`)?.firstElementChild?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  return (
    <div className={`grid gap-5 ${block && (block.type === 'takwim' || block.type === 'table') ? 'xl:grid-cols-[minmax(0,1fr)_600px]' : 'xl:grid-cols-[minmax(0,1fr)_420px]'}`}>
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs text-muted"><MousePointerClick size={14} /> Klik pada mana-mana bahagian halaman untuk menyunting terus. Medan merah bernombor perlu diisi.</p>
        <PageEditCtx.Provider value={{ selected: sel?.bid ?? null }}>
          <div ref={pagesRef} className="pe-on mx-auto grid max-w-[820px] gap-6" onClick={onClick}>
            <SectionPages id={id} />
          </div>
        </PageEditCtx.Provider>
      </div>

      <aside
        ref={panelRef}
        className={`${block ? 'fixed inset-x-0 bottom-0 z-30 max-h-[62vh] rounded-t-xl border-t shadow-2xl' : 'rounded-lg border shadow-card'} overflow-y-auto border-border bg-bg p-3 xl:sticky xl:inset-auto xl:top-20 xl:z-auto xl:max-h-[calc(100vh-6rem)] xl:self-start xl:rounded-lg xl:border xl:shadow-card`}
        aria-label="Panel penyunting"
      >
        {block ? (
          <div className="grid gap-3">
            <div className="flex items-center gap-2">
              <p className="flex-1 text-sm font-semibold">Sunting: {blockLabels[block.type]}</p>
              <button className="rounded-md p-1.5 text-muted hover:bg-surface-2" onClick={() => setSel(null)} aria-label="Tutup penyunting"><X size={16} /></button>
            </div>
            <BlockEditor
              block={block}
              index={index}
              total={sec.blocks.length}
              onChange={(nb) => updateBlock(id, block.id, nb)}
              onRemove={() => { if (window.confirm('Padam blok ini daripada halaman?')) { removeBlock(id, block.id); setSel(null); } }}
              onMove={(d) => moveBlock(id, block.id, d)}
            />
            <p className="text-[11px] text-muted">Perubahan dipaparkan serta-merta pada halaman. Klik bahagian lain untuk menyuntingnya.</p>
          </div>
        ) : (
          <div className="grid gap-4 text-sm">
            <div className="grid gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Tajuk halaman
                <input className={`${field} mt-1 font-semibold normal-case tracking-normal text-text`} value={sec.title} onChange={(e) => updateSection(id, { title: e.target.value })} />
              </label>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">Lencana tajuk <span className="font-normal normal-case">(pilihan)</span>
                <input className={`${field} mt-1 normal-case tracking-normal text-text`} value={sec.subtitle} onChange={(e) => updateSection(id, { subtitle: e.target.value })} />
              </label>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Panduan medan perlu diisi</p>
              {needs.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {needs.map((x) => (
                    <button key={`${x.page}-${x.n}`} onClick={() => jump(x)} className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#D9534F] px-2 text-xs font-bold text-white hover:brightness-110" title={`Halaman ${x.page}, medan ${x.n}`}>
                      {sec && needs.some((y) => y.page !== x.page) ? `${x.page}.${x.n}` : x.n}
                    </button>
                  ))}
                </div>
              ) : <p className="mt-1 text-xs text-muted">Tiada medan kosong pada halaman ini.</p>}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Tambah kandungan</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {addable.map((t) => <button key={t} className={smallBtn} onClick={() => add(t)}><Plus size={12} /> {blockLabels[t]}</button>)}
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
