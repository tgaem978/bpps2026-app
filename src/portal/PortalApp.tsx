/**
 * Portal Kemas Kini untuk penyelaras unit (/portal#KOD).
 * Buku yang diterbitkan pentadbir dimuat ke dalam stor (memori sahaja - lihat lib/storage.ts), supaya penyunting
 * dan pratonton A4 yang sama dengan penjana boleh digunakan. Hanya halaman unit sendiri boleh disunting dan dihantar.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, CircleAlert, Clock, Eye, EyeOff, History, KeyRound, Loader2, LogOut, RotateCcw, Send, X,
} from 'lucide-react';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useStaffStore } from '@/stores/staffStore';
import { useMasterStore } from '@/stores/masterStore';
import { useUiStore } from '@/stores/uiStore';
import { health, portalState, portalSubmit, unitLogin, unitLogout, unitSession, type ApiError } from '@/lib/portalApi';
import { applyTokens, designTokens } from '@/templates/tokens';
import { BuildingArt } from '@/components/book/themeArt';
import { submissionStatus, type PortalState } from '@/types/portal';
import type { SectionContent } from '@/types/book';
import { SectionForm } from '@/pages/SectionEditorPage';
import { MasterStyles, SectionPages } from '@/components/book/BookPages';
import { MarkToggle } from '@/components/layout/MarkToggle';
import { Toaster } from '@/components/layout/Overlays';

const btn = 'inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2 disabled:opacity-50';
const btnPrimary = 'inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg hover:opacity-90 disabled:opacity-50';
/** Butang utama emas (di atas jalur navy). */
const btnGold = 'pt-gold inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-bold disabled:opacity-45';
const btnGhost = 'inline-flex items-center justify-center gap-1.5 rounded-md border border-white/25 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10';

/** Identiti portal: Biru Navy & Emas (selaras dengan tema buku edisi 2027). */
const portalTokens = {
  ...designTokens,
  colors: {
    ...designTokens.colors,
    primary: '#0B2A5B', primaryFg: '#ffffff', accent: '#C9A13B', bg: '#EEF2F9', surface: '#ffffff', surface2: '#F3F6FB',
    border: '#D3DCEA', text: '#141C2B', muted: '#5A6578', sidebar: '#0B2A5B', sidebarFg: '#E8EEF8',
  },
};
const field = 'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm';
const fmtTime = (t: number) => new Date(t).toLocaleString('ms-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** Kandungan yang dibandingkan (tanpa cap masa / tanda semakan). */
const essence = (s?: SectionContent) => (s ? JSON.stringify([s.title, s.subtitle, s.layout, s.blocks]) : '');
const draftKey = (unitId: string) => `bpps-portal-draft:${unitId}`;
const readDrafts = (unitId: string): Record<string, SectionContent> => {
  try {
    return JSON.parse(localStorage.getItem(draftKey(unitId)) ?? '{}') as Record<string, SectionContent>;
  } catch {
    return {};
  }
};
const writeDrafts = (unitId: string, drafts: Record<string, SectionContent>) => {
  try {
    if (Object.keys(drafts).length) localStorage.setItem(draftKey(unitId), JSON.stringify(drafts));
    else localStorage.removeItem(draftKey(unitId));
  } catch {
    /* storan penuh / disekat: draf kekal dalam memori sehingga dihantar */
  }
};
const NAME_KEY = 'bpps-portal-name';

type Phase = { kind: 'login'; error?: string } | { kind: 'loading' } | { kind: 'ready'; state: PortalState } | { kind: 'error'; message: string };

export default function PortalApp() {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });

  const load = useCallback(async () => {
    setPhase({ kind: 'loading' });
    try {
      const state = await portalState();
      hydrate(state);
      setPhase({ kind: 'ready', state });
    } catch (e) {
      const ex = e as ApiError;
      if (ex.status === 401) setPhase({ kind: 'login', error: ex.message });
      else setPhase({ kind: 'error', message: ex.message });
    }
  }, []);

  useEffect(() => {
    applyTokens(portalTokens);
    document.body.classList.add('portal-be');
    document.title = 'Portal Kemas Kini BPPS';
    const code = decodeURIComponent(window.location.hash.replace(/^#/, '')).trim();
    if (code) {
      // Kod dalam pautan: log masuk terus, kemudian buang kod daripada bar alamat.
      window.history.replaceState(null, '', window.location.pathname);
      unitLogin(code).then(load, (e) => setPhase({ kind: 'login', error: (e as Error).message }));
    } else if (unitSession()) void load();
    else setPhase({ kind: 'login' });
  }, [load]);

  return (
    <div className="min-h-full bg-bg">
      <MasterStyles />
      <Toaster />
      {phase.kind === 'loading' && (
        <div className="flex min-h-screen items-center justify-center gap-2 text-muted"><Loader2 className="animate-spin" size={20} /> Memuatkan…</div>
      )}
      {phase.kind === 'login' && <Login error={phase.error} onDone={load} />}
      {phase.kind === 'error' && (
        <Centered>
          <CircleAlert size={32} className="mx-auto text-amber-600" aria-hidden />
          <p className="mt-3 text-center font-semibold">{phase.message}</p>
          <div className="mt-4 flex justify-center gap-2">
            <button className={btn} onClick={load}><RotateCcw size={15} /> Cuba lagi</button>
            <button className={btn} onClick={() => { unitLogout(); setPhase({ kind: 'login' }); }}><LogOut size={15} /> Tukar kod</button>
          </div>
        </Centered>
      )}
      {phase.kind === 'ready' && <Workspace state={phase.state} reload={load} onLogout={() => { unitLogout(); setPhase({ kind: 'login' }); }} />}
    </div>
  );
}

/** Masukkan edisi yang diterbitkan + kiriman tertunda + draf tempatan ke dalam stor. */
function hydrate(state: PortalState) {
  const { meta, teachers, sections } = state.edition;
  const merged: Record<string, SectionContent> = { ...sections };
  for (const [id, p] of Object.entries(state.pending)) merged[id] = { ...p.content, review: sections[id]?.review };
  for (const [id, d] of Object.entries(readDrafts(state.unit.id))) if (state.unit.sectionIds.includes(id)) merged[id] = d;
  useProjectStore.setState({ profile: meta.profile });
  useMasterStore.setState({ overrides: (meta.master ?? {}) as never });
  useStaffStore.setState((s) => ({ fields: meta.staffFields, teachers, rev: s.rev + 1 }));
  useBookStore.setState({ cover: meta.cover, outline: meta.outline, sections: merged });
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center p-4"><div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-card">{children}</div></div>;
}

function Login({ error, onDone }: { error?: string; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(error ?? '');
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => { health().then((h) => setYear(h.edition?.year ?? null), () => undefined); }, []);
  const base = import.meta.env.BASE_URL;
  return (
    <div className="pt-login flex min-h-screen items-center justify-center p-4">
      <span className="pt-corner pt-corner-l" aria-hidden />
      <span className="pt-corner pt-corner-r" aria-hidden />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-surface shadow-[0_20px_50px_rgba(11,42,91,.25)]">
        <div className="pt-hero px-6 pb-6 pt-7 text-center text-white">
          <div className="flex justify-center gap-4">
            <img src={`${base}content/logo-kpm.png`} alt="" className="h-12 w-auto" />
            <img src={`${base}content/logo-skbts.png`} alt="" className="h-12 w-auto" />
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#E8C766]">Buku Panduan Pengurusan Sekolah</p>
          <h1 className="pt-display mt-1 text-4xl leading-none">PORTAL KEMAS KINI</h1>
          {year && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="pt-display text-xl italic text-[#C9A13B]">///</span>
              <span className="pt-pill"><span>SESI AKADEMIK</span> <b>{year}</b></span>
              <span className="pt-display text-xl italic text-[#C9A13B]">///</span>
            </div>
          )}
        </div>
        <div className="px-6 pb-6 pt-5">
          <p className="text-sm text-muted">Masukkan kod akses unit anda (diberi oleh pentadbir), atau buka pautan penuh yang dikongsi melalui WhatsApp / e-mel.</p>
          <form
            className="mt-4 grid gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setErr('');
              try {
                await unitLogin(code);
                onDone();
              } catch (ex) {
                setErr((ex as Error).message);
                setBusy(false);
              }
            }}
          >
            <label className="text-sm font-semibold text-primary">
              Kod akses
              <input className={`${field} mt-1 py-3 text-center font-mono text-lg uppercase tracking-[0.25em]`} value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXX-XXXX-XXXX" autoComplete="off" autoCapitalize="characters" />
            </label>
            <button className={`${btnPrimary} py-3`} disabled={busy || code.replace(/[^a-z0-9]/gi, '').length < 8}>{busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Masuk ke portal unit</button>
            {err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          </form>
          <BuildingArt className="mx-auto mt-5 w-full max-w-[300px] opacity-25" />
        </div>
      </div>
    </div>
  );
}

type Status = 'diubah' | 'dihantar' | 'perlu' | 'siap' | 'asal';
const statusLabel: Record<Status, [string, string]> = {
  diubah: ['Belum dihantar', 'bg-amber-500/15 text-amber-700'],
  dihantar: ['Menunggu semakan', 'bg-primary/10 text-primary'],
  perlu: ['Perlu dikemas kini', 'bg-red-500/10 text-red-700'],
  siap: ['Siap', 'bg-green-600/10 text-green-700'],
  asal: ['', ''],
};

function Workspace({ state, reload, onLogout }: { state: PortalState; reload: () => void; onLogout: () => void }) {
  const { unit, edition, pending } = state;
  const sections = useBookStore((s) => s.sections);
  const outline = useBookStore((s) => s.outline);
  const profile = useProjectStore((s) => s.profile);
  const [active, setActive] = useState(unit.sectionIds[0] ?? '');
  const [showPreview, setShowPreview] = useState(() => window.innerWidth >= 1280);
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  /** Asas perbandingan bagi setiap halaman: versi tertunda (jika ada) atau versi diterbitkan. */
  const baseline = useMemo(() => {
    const out: Record<string, SectionContent | undefined> = {};
    for (const id of unit.sectionIds) out[id] = pending[id]?.content ?? edition.sections[id];
    return out;
  }, [unit.sectionIds, pending, edition.sections]);

  const changed = unit.sectionIds.filter((id) => essence(sections[id]) !== essence(baseline[id]));

  // Simpan draf (halaman yang diubah) dalam pelayar ini supaya tidak hilang jika halaman ditutup.
  useEffect(() => {
    writeDrafts(unit.id, Object.fromEntries(changed.map((id) => [id, sections[id]])));
  }, [unit.id, sections, changed.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusOf = (id: string): Status => {
    if (changed.includes(id)) return 'diubah';
    if (pending[id]) return 'dihantar';
    const r = edition.sections[id]?.review;
    if (r && r.year === edition.meta.year) return r.status === 'siap' ? 'siap' : 'perlu';
    return 'asal';
  };

  // Kumpulan mengikut bahagian & tajuk untuk senarai halaman.
  const groups = useMemo(() => outline
    .map((p) => ({ part: p, ids: p.topics.flatMap((t) => [t.id, ...t.children]).filter((id) => unit.sectionIds.includes(id)) }))
    .filter((g) => g.ids.length), [outline, unit.sectionIds]);
  const isChild = (id: string) => outline.some((p) => p.topics.some((t) => t.children.includes(id)));
  const idx = unit.sectionIds.indexOf(active);
  const go = (id: string) => {
    setActive(id);
    setMenuOpen(false);
    topRef.current?.scrollIntoView({ block: 'start' });
  };
  const revert = (id: string) => {
    if (!window.confirm('Buang perubahan yang belum dihantar bagi halaman ini?')) return;
    const b = baseline[id];
    if (b) useBookStore.setState((s) => ({ sections: { ...s.sections, [id]: b } }));
  };
  const counts = { perlu: unit.sectionIds.filter((id) => statusOf(id) === 'perlu').length, dihantar: Object.keys(pending).length };

  const list = (label: string) => (
    <nav aria-label={label} className="grid gap-3">
      {groups.map((g) => (
        <div key={g.part.id}>
          <p className="px-2 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">{g.part.title}</p>
          <ul>
            {g.ids.map((id) => {
              const st = statusOf(id);
              return (
                <li key={id}>
                  <button
                    onClick={() => go(id)}
                    aria-current={id === active ? 'page' : undefined}
                    className={`flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-[13px] ${isChild(id) ? 'pl-6' : 'pl-2'} ${id === active ? 'bg-primary/10 font-semibold text-primary' : 'hover:bg-surface-2'}`}
                  >
                    <span className="min-w-0 flex-1 truncate">{sections[id]?.title || 'Tanpa tajuk'}</span>
                    {st !== 'asal' && <span className={`h-2 w-2 shrink-0 rounded-full ${st === 'diubah' ? 'bg-amber-500' : st === 'dihantar' ? 'bg-primary' : st === 'perlu' ? 'bg-red-500' : 'bg-green-600'}`} title={statusLabel[st][0]} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="pt-header sticky top-0 z-20 flex flex-wrap items-center gap-2 px-3 py-2.5 text-white md:px-5">
        <img src={`${import.meta.env.BASE_URL}content/logo-skbts.png`} alt="" className="hidden h-9 w-auto sm:block" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E8C766]">Portal Kemas Kini · BPPS {edition.meta.year}</p>
          <h1 className="pt-display truncate text-lg leading-tight md:text-xl">{unit.name.toUpperCase()} <span className="font-medium text-white/60">· {profile.shortName.toUpperCase()}</span></h1>
        </div>
        <MarkToggle className={btnGhost} label="Medan kosong" />
        <button className={btnGhost} onClick={() => setShowHistory(true)}><History size={15} /> <span className="hidden sm:inline">Sejarah</span></button>
        <button className={btnGold} disabled={!changed.length} onClick={() => setSending(true)}>
          <Send size={15} /> Hantar{changed.length ? ` (${changed.length})` : ''}
        </button>
        <button className={btnGhost} onClick={onLogout} aria-label="Log keluar"><LogOut size={15} /></button>
      </header>

      <div className="mx-auto flex w-full max-w-[1500px] flex-1 gap-5 p-3 md:p-5">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-border bg-surface p-2 shadow-card">{list('Halaman unit')}</div>
        </aside>

        <main className="min-w-0 flex-1" ref={topRef}>
          <div className="pt-welcome mb-4 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <div className="p-4 text-sm">
              <p className="pt-display text-lg text-primary">Selamat datang{unit.coordinator ? `, ${unit.coordinator}` : ''}</p>
              <p className="mt-1 text-muted">
                Sunting halaman unit anda untuk <b className="text-text">BPPS {edition.meta.year}</b>, kemudian tekan <b className="text-text">Hantar</b>. Pentadbir akan menyemak sebelum kemas kini dimasukkan ke dalam buku. Perubahan disimpan sementara dalam pelayar ini sehingga dihantar.
              </p>
            </div>
            <div className="grid grid-cols-2 border-t border-border sm:grid-cols-4">
              {([
                [unit.sectionIds.length, 'Halaman unit', 'text-primary'],
                [counts.perlu, 'Perlu dikemas kini', 'text-red-700'],
                [changed.length, 'Belum dihantar', 'text-amber-700'],
                [counts.dihantar, 'Menunggu semakan', 'text-[#2E63B0]'],
              ] as const).map(([n, label, tone]) => (
                <div key={label} className="border-border px-4 py-3 [&:not(:last-child)]:border-r">
                  <div className={`pt-display text-3xl leading-none ${tone}`}>{n}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</div>
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-surface-2">
              <div className="h-full bg-gradient-to-r from-[#B8902F] to-[#E8C766]" style={{ width: `${unit.sectionIds.length ? Math.round(((unit.sectionIds.length - counts.perlu) / unit.sectionIds.length) * 100) : 0}%` }} />
            </div>
          </div>

          {/* Pemilih halaman (telefon / tablet) */}
          <div className="mb-3 lg:hidden">
            <button className={`${btn} w-full justify-between`} onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen}>
              <span className="truncate">{sections[active]?.title ?? 'Pilih halaman'}</span> <ChevronDown size={16} className={menuOpen ? 'rotate-180' : ''} />
            </button>
            {menuOpen && <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-surface p-2 shadow-card">{list('Pilih halaman unit')}</div>}
          </div>

          {active && sections[active] ? (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-lg font-bold md:text-xl">{sections[active].title}</h2>
                  {statusOf(active) !== 'asal' && <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusLabel[statusOf(active)][1]}`}>{statusLabel[statusOf(active)][0]}</span>}
                </div>
                {changed.includes(active) && <button className={btn} onClick={() => revert(active)}><RotateCcw size={15} /> Buang perubahan</button>}
                <button className={btn} onClick={() => setShowPreview((v) => !v)}>{showPreview ? <EyeOff size={15} /> : <Eye size={15} />} Pratonton</button>
              </div>
              {pending[active] && !changed.includes(active) && (
                <p className="mb-3 flex items-center gap-2 rounded-md bg-primary/5 px-3 py-2 text-xs text-primary"><Clock size={14} /> Versi ini telah dihantar pada {fmtTime(pending[active].at)} dan menunggu semakan pentadbir. Anda masih boleh mengubah dan menghantar semula.</p>
              )}
              <div className={`grid gap-5 ${showPreview ? 'xl:grid-cols-2' : ''}`}>
                <div className="grid content-start gap-4">
                  <SectionForm id={active} compact />
                </div>
                {showPreview && (
                  <div className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Pratonton · A4</p>
                    <div className="mx-auto grid max-w-md gap-4"><SectionPages id={active} /></div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                {idx > 0 ? <button className={btn} onClick={() => go(unit.sectionIds[idx - 1])}><ArrowLeft size={15} /> <span className="max-w-[30vw] truncate">{sections[unit.sectionIds[idx - 1]]?.title}</span></button> : <span />}
                {idx < unit.sectionIds.length - 1 ? <button className={btn} onClick={() => go(unit.sectionIds[idx + 1])}><span className="max-w-[30vw] truncate">{sections[unit.sectionIds[idx + 1]]?.title}</span> <ArrowRight size={15} /></button> : <span />}
              </div>
            </>
          ) : (
            <p className="rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted">Tiada halaman untuk unit ini. Hubungi pentadbir.</p>
          )}
        </main>
      </div>

      {sending && <SendDialog state={state} changed={changed} onClose={() => setSending(false)} onSent={() => { setSending(false); reload(); }} />}
      {showHistory && <HistoryDialog state={state} onClose={() => setShowHistory(false)} />}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-surface p-5 shadow-card sm:rounded-xl">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="flex-1 font-display text-lg font-bold">{title}</h2>
          <button className="rounded-md p-1.5 text-muted hover:bg-surface-2" onClick={onClose} aria-label="Tutup"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SendDialog({ state, changed, onClose, onSent }: { state: PortalState; changed: string[]; onClose: () => void; onSent: () => void }) {
  const sections = useBookStore((s) => s.sections);
  const toast = useUiStore((s) => s.toast);
  const [pick, setPick] = useState<string[]>(changed);
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? state.unit.coordinator);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  return (
    <Modal title="Hantar kemas kini" onClose={onClose}>
      <p className="text-sm text-muted">Halaman yang dipilih akan dihantar kepada pentadbir untuk disemak.</p>
      <ul className="mt-3 grid gap-1">
        {changed.map((id) => (
          <li key={id}>
            <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-surface-2">
              <input type="checkbox" checked={pick.includes(id)} onChange={(e) => setPick(e.target.checked ? [...pick, id] : pick.filter((x) => x !== id))} />
              <span className="truncate">{sections[id]?.title}</span>
            </label>
          </li>
        ))}
      </ul>
      <label className="mt-3 block text-sm font-medium">
        Nama penghantar
        <input className={`${field} mt-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama anda" />
      </label>
      <label className="mt-3 block text-sm font-medium">
        Catatan kepada pentadbir <span className="font-normal text-muted">(pilihan)</span>
        <textarea className={`${field} mt-1 min-h-[72px]`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth. Ahli JK dikemas kini mengikut mesyuarat unit 5 Jan." />
      </label>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button className={btn} onClick={onClose}>Batal</button>
        <button
          className={btnPrimary}
          disabled={busy || !pick.length || !name.trim()}
          onClick={async () => {
            setBusy(true);
            setErr('');
            try {
              const payload = Object.fromEntries(pick.map((id) => [id, sections[id]]));
              const base = Object.fromEntries(pick.map((id) => [id, state.edition.sections[id]?.updatedAt ?? null]));
              await portalSubmit({ submittedBy: name.trim(), note, sections: payload, base });
              try { localStorage.setItem(NAME_KEY, name.trim()); } catch { /* abaikan */ }
              // Draf halaman yang dihantar dibuang; versi dihantar menjadi asas baharu.
              const drafts = readDrafts(state.unit.id);
              for (const id of pick) delete drafts[id];
              writeDrafts(state.unit.id, drafts);
              toast(`${pick.length} halaman dihantar. Terima kasih!`);
              onSent();
            } catch (e) {
              setErr((e as Error).message);
              setBusy(false);
            }
          }}
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Hantar {pick.length} halaman
        </button>
      </div>
    </Modal>
  );
}

function HistoryDialog({ state, onClose }: { state: PortalState; onClose: () => void }) {
  const chip = { diterima: 'text-green-700', ditolak: 'text-red-700', diganti: 'text-muted' } as const;
  return (
    <Modal title="Sejarah kiriman" onClose={onClose}>
      {state.history.length === 0 ? (
        <p className="text-sm text-muted">Belum ada kiriman.</p>
      ) : (
        <ul className="grid gap-2">
          {state.history.map((h) => (
            <li key={h.id} className="rounded-md border border-border p-3 text-sm">
              <p className="font-semibold">{fmtTime(h.createdAt)} · {h.submittedBy} <span className="text-xs font-normal text-muted">({submissionStatus(h) === 'selesai' ? 'selesai' : 'menunggu semakan'})</span></p>
              <ul className="mt-1 grid gap-0.5 text-xs">
                {h.sectionIds.map((id) => (
                  <li key={id} className="flex gap-2">
                    <span className="min-w-0 flex-1 truncate">{h.titles[id] ?? id}</span>
                    <span className={h.decisions[id] ? chip[h.decisions[id]] : 'text-primary'}>
                      {h.decisions[id] === 'diterima' ? <><CheckCircle2 size={12} className="inline" /> Diterima</> : h.decisions[id] === 'ditolak' ? 'Ditolak' : h.decisions[id] === 'diganti' ? 'Diganti' : 'Menunggu'}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
