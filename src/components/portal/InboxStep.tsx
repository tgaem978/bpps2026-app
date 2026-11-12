import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, Inbox, Loader2, RotateCcw, Trash2, TriangleAlert, X } from 'lucide-react';
import { useBookStore } from '@/stores/bookStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';
import { SectionOverride, useBookCtx } from '@/lib/pagination';
import { SectionPages } from '@/components/book/BookPages';
import { decide, deleteSubmission, getSubmission, patchEditionSections } from '@/lib/portalApi';
import { navigate } from '@/lib/router';
import { diffLabel, diffSections } from '@/lib/sectionDiff';
import { submissionStatus, type Decision, type Submission, type SubmissionSummary } from '@/types/portal';
import type { SectionContent } from '@/types/book';
import { Step, btn, btnPrimary, fmtTime } from './HubCards';
import { useProjectStore } from '@/stores/projectStore';

const statusChip: Record<ReturnType<typeof submissionStatus>, [string, string]> = {
  baru: ['Baru', 'bg-amber-500/15 text-amber-700'],
  separa: ['Separa', 'bg-primary/10 text-primary'],
  selesai: ['Selesai', 'bg-green-600/10 text-green-700'],
};
const decisionChip: Record<Decision, [string, string]> = {
  diterima: ['Diterima', 'bg-green-600/10 text-green-700'],
  ditolak: ['Ditolak', 'bg-red-500/10 text-red-700'],
  diganti: ['Diganti kiriman baharu', 'bg-surface-2 text-muted'],
};

/** Pratonton halaman dengan kandungan gantian (versi cadangan). */
function ProposedPages({ id, content }: { id: string; content: SectionContent }) {
  const value = useMemo(() => ({ [id]: content }), [id, content]);
  return (
    <SectionOverride.Provider value={value}>
      <SectionPages id={id} />
    </SectionOverride.Provider>
  );
}

function SectionReview({ sub, id, onDecide, busy }: { sub: Submission; id: string; onDecide: (id: string, d: Decision | null) => void; busy: boolean }) {
  const cur = useBookStore((s) => s.sections[id]);
  const ctx = useBookCtx();
  const setActive = useNavigationStore((s) => s.setActiveSection);
  const [preview, setPreview] = useState(false);
  const next = sub.sections[id];
  const diff = useMemo(() => (next ? diffSections(cur, next, ctx) : null), [cur, next, ctx]);
  const decision = sub.decisions[id];
  const base = sub.base[id];
  const conflict = !decision && cur && base != null && cur.updatedAt !== base;
  if (!next || !diff) return null;

  return (
    <li className="rounded-md border border-border p-3">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{next.title}{next.subtitle && <span className="font-normal text-muted"> · {next.subtitle}</span>}</p>
          <p className="text-xs text-muted">{diffLabel(diff)}</p>
        </div>
        {decision ? (
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${decisionChip[decision][1]}`}>{decisionChip[decision][0]}</span>
            {decision !== 'diganti' && (
              <button className={btn} disabled={busy} onClick={() => onDecide(id, null)} title="Batalkan keputusan (kandungan penjana tidak diubah semula)"><RotateCcw size={14} /> Batal</button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <button className={btn} onClick={() => setPreview((v) => !v)}>{preview ? <EyeOff size={14} /> : <Eye size={14} />} Pratonton</button>
            <button className={`${btn} text-red-700`} disabled={busy} onClick={() => onDecide(id, 'ditolak')}><X size={14} /> Tolak</button>
            <button className={btnPrimary} disabled={busy} onClick={() => onDecide(id, 'diterima')}><Check size={14} /> Terima</button>
          </div>
        )}
      </div>
      {conflict && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-500/10 px-2 py-1.5 text-xs text-amber-800">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
          Halaman ini telah diubah dalam penjana selepas diterbitkan ke portal. Menerima kiriman ini akan menggantikan perubahan tersebut - semak pratonton dahulu.
        </p>
      )}
      {!decision && (diff.added.length > 0 || diff.removed.length > 0) && (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-border bg-surface-2/60 p-2 font-mono text-[11.5px] leading-relaxed">
          {diff.removed.slice(0, 40).map((l, i) => <div key={`r${i}`} className="text-red-700"><span className="select-none">− </span>{l}</div>)}
          {diff.added.slice(0, 40).map((l, i) => <div key={`a${i}`} className="text-green-700"><span className="select-none">+ </span>{l}</div>)}
          {(diff.added.length > 40 || diff.removed.length > 40) && <div className="text-muted">… dan lagi (lihat pratonton)</div>}
        </div>
      )}
      {preview && !decision && (
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">Semasa (penjana)</p>
            <div className="grid gap-3">{cur ? <SectionPages id={id} /> : <p className="text-sm text-muted">Tiada.</p>}</div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-700">Cadangan (portal)</p>
            <div className="grid gap-3"><ProposedPages id={id} content={next} /></div>
          </div>
        </div>
      )}
      {decision === 'diterima' && (
        <button className="mt-1 text-xs text-primary underline" onClick={() => { setActive(id); navigate('/'); }}>Buka halaman dalam penyunting</button>
      )}
    </li>
  );
}

function SubmissionReview({ id, onBack, onUpdated }: { id: string; onBack: () => void; onUpdated: (s: SubmissionSummary | null) => void }) {
  const applySection = useBookStore((s) => s.applySection);
  const toast = useUiStore((s) => s.toast);
  const [sub, setSub] = useState<Submission | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const activeYear = useProjectStore((s) => s.profile.year);

  useEffect(() => {
    getSubmission(id).then(setSub, (e) => setErr((e as Error).message));
  }, [id]);

  const decideMany = async (ids: string[], d: Decision | null) => {
    if (!sub) return;
    setBusy(true);
    try {
      if (d === 'diterima') {
        const by = `Portal · ${sub.unitName} (${sub.submittedBy})`;
        for (const sid of ids) applySection(sid, sub.sections[sid], by);
        // Selaraskan salinan portal supaya unit melihat versi yang diterima.
        const synced = Object.fromEntries(ids.map((sid) => [sid, useBookStore.getState().sections[sid]]));
        await patchEditionSections(synced).catch(() => toast('Diterima dalam penjana, tetapi salinan portal belum dikemas kini - terbitkan semula.', 'info'));
      }
      const res = await decide(sub.id, Object.fromEntries(ids.map((sid) => [sid, d])));
      setSub({ ...sub, decisions: res.decisions, reviewedAt: res.reviewedAt });
      onUpdated(res);
      if (d === 'diterima') toast(`${ids.length} halaman dikemas kini dalam buku dan ditandakan siap.`);
      else if (d === 'ditolak') toast(`${ids.length} halaman ditolak.`, 'info');
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  };

  if (err) return <div><button className={btn} onClick={onBack}><ArrowLeft size={15} /> Kembali</button><p className="mt-3 text-sm text-red-600">{err}</p></div>;
  if (!sub) return <p className="flex items-center gap-2 text-sm text-muted"><Loader2 size={16} className="animate-spin" /> Memuatkan kiriman…</p>;
  const wrongYear = sub.year !== activeYear;
  const open = wrongYear ? [] : sub.sectionIds.filter((sid) => !sub.decisions[sid]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button className={btn} onClick={onBack}><ArrowLeft size={15} /> Peti masuk</button>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{sub.unitName} <span className="font-normal text-muted">· {sub.submittedBy} · {fmtTime(sub.createdAt)}</span></p>
        </div>
        {open.length > 0 && (
          <>
            <button className={`${btn} text-red-700`} disabled={busy} onClick={() => decideMany(open, 'ditolak')}><X size={14} /> Tolak semua</button>
            <button className={btnPrimary} disabled={busy} onClick={() => decideMany(open, 'diterima')}><Check size={14} /> Terima semua ({open.length})</button>
          </>
        )}
      </div>
      {wrongYear && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-800">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
          Kiriman ini untuk edisi {sub.year}, tetapi penjana sedang membuka edisi {activeYear}. Tukar ke edisi {sub.year} (pemilih tahun di bar atas) untuk menerima atau menolaknya.
        </p>
      )}
      {sub.note && <p className="mt-2 rounded-md bg-surface-2 px-3 py-2 text-sm"><b>Catatan:</b> {sub.note}</p>}
      <ul className="mt-3 grid gap-2">
        {sub.sectionIds.map((sid) => <SectionReview key={sid} sub={sub} id={sid} busy={busy || wrongYear} onDecide={(x, d) => decideMany([x], d)} />)}
      </ul>
      {open.length === 0 && (
        <div className="mt-3 flex justify-end">
          <button
            className={`${btn} text-red-700`}
            onClick={async () => {
              if (!window.confirm('Padam kiriman ini daripada pelayan? Kandungan yang telah diterima dalam buku tidak terjejas.')) return;
              try {
                await deleteSubmission(sub.id);
                onUpdated(null);
                onBack();
              } catch (e) {
                toast((e as Error).message, 'error');
              }
            }}
          >
            <Trash2 size={14} /> Padam kiriman
          </button>
        </div>
      )}
    </div>
  );
}

/** Langkah 5: peti masuk kiriman unit. */
export function InboxStep({ submissions, setSubmissions, onRefresh, refreshing }: {
  submissions: SubmissionSummary[]; setSubmissions: (s: SubmissionSummary[]) => void; onRefresh: () => void; refreshing: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'aktif' | 'semua'>('aktif');
  const shown = submissions.filter((s) => filter === 'semua' || submissionStatus(s) !== 'selesai');
  const waiting = submissions.filter((s) => submissionStatus(s) !== 'selesai').length;

  return (
    <Step
      n={5}
      title={`Peti masuk kiriman${waiting ? ` (${waiting})` : ''}`}
      icon={<Inbox size={20} aria-hidden />}
      right={!openId && (
        <div className="flex gap-1.5">
          <select className="rounded-md border border-border bg-surface px-2 py-1.5 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as 'aktif' | 'semua')} aria-label="Tapis kiriman">
            <option value="aktif">Belum selesai</option>
            <option value="semua">Semua</option>
          </select>
          <button className={btn} onClick={onRefresh} disabled={refreshing}>{refreshing ? <Loader2 size={15} className="animate-spin" /> : <RotateCcw size={15} />} Muat semula</button>
        </div>
      )}
    >
      {openId ? (
        <SubmissionReview
          id={openId}
          onBack={() => setOpenId(null)}
          onUpdated={(n) => setSubmissions(n ? submissions.map((s) => (s.id === n.id ? n : s)) : submissions.filter((s) => s.id !== openId))}
        />
      ) : shown.length === 0 ? (
        <p className="rounded-md border-2 border-dashed border-border p-4 text-center text-sm text-muted">
          {submissions.length ? 'Semua kiriman telah diputuskan.' : 'Belum ada kiriman daripada unit.'}
        </p>
      ) : (
        <ul className="grid gap-2">
          {shown.map((s) => {
            const st = submissionStatus(s);
            return (
              <li key={s.id}>
                <button className="flex w-full flex-wrap items-center gap-3 rounded-md border border-border p-3 text-left hover:border-primary" onClick={() => setOpenId(s.id)}>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${statusChip[st][1]}`}>{statusChip[st][0]}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{s.unitName} <span className="font-normal text-muted">· {s.submittedBy}</span></span>
                    <span className="block truncate text-xs text-muted">{s.sectionIds.map((id) => s.titles[id] ?? id).join(', ')}</span>
                  </span>
                  <span className="text-xs text-muted">{s.sectionIds.length} halaman · {fmtTime(s.createdAt)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Step>
  );
}
