import { useState } from 'react';
import { ImagePlus, RotateCcw, Trash2 } from 'lucide-react';
import { useMasterStore, resolveMaster } from '@/stores/masterStore';
import { useUiStore } from '@/stores/uiStore';
import { fonts, masterDefaults, masterSchema, pageTypes, type MasterKey, type MasterProps, type PageType, type PropDef } from '@/templates/master';
import { readImageFile, uid } from '@/lib/blocks';
import { useBookCtx, useBookPlan } from '@/lib/pagination';
import { ContentFrame, CoverPage, NotesPanels, PageView } from '@/components/book/BookPages';
import BlockView from '@/components/book/BlockView';
import type { Block } from '@/types/book';

const field = 'w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm';
const smallBtn = 'inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-2';

const sampleBlocks: Block[] = [
  { id: uid(), type: 'heading', text: 'Contoh Tajuk Kecil' },
  { id: uid(), type: 'paragraph', text: 'Contoh perenggan untuk melihat fon, saiz dan jarak baris. Perubahan pada master layout dikenakan kepada semua halaman jenis ini dalam buku.' },
  { id: uid(), type: 'keyvalue', pairs: [{ key: 'Guru Besar', value: '{{jawatan:Guru Besar}}' }, { key: 'Sekolah', value: '{{nama_sekolah}}' }] },
  { id: uid(), type: 'table', columns: ['Perkara', 'Catatan'], rows: [['Contoh baris 1', 'Teks'], ['Contoh baris 2', 'Teks']] },
  { id: uid(), type: 'list', ordered: false, items: ['Item senarai pertama', 'Item senarai kedua'] },
];

function PropEditor({ type, def, m }: { type: PageType; def: PropDef; m: MasterProps }) {
  const set = useMasterStore((s) => s.set);
  const toast = useUiStore((s) => s.toast);
  const value = m[def.key];
  const dflt = masterDefaults(type)[def.key];
  const changed = value !== dflt;
  const put = (v: MasterProps[MasterKey]) => set(type, def.key, v as never);

  let control;
  switch (def.kind) {
    case 'image':
      control = (
        <div className="flex items-center gap-2">
          <div className="flex h-12 w-20 items-center justify-center overflow-hidden rounded border border-border bg-[repeating-conic-gradient(#eef1f3_0_25%,#fff_0_50%)] bg-[length:10px_10px]">
            {value ? <img src={String(value)} alt="" className="max-h-full max-w-full object-contain" /> : <span className="text-[10px] text-muted">tiada</span>}
          </div>
          <label className={`${smallBtn} cursor-pointer`}>
            <ImagePlus size={13} /> Ganti
            <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try { put(await readImageFile(f, 1_500_000)); } catch (err) { toast((err as Error).message, 'error'); }
            }} />
          </label>
          {value && <button className={smallBtn} onClick={() => put('')} aria-label="Buang imej"><Trash2 size={13} /></button>}
        </div>
      );
      break;
    case 'color':
      control = (
        <div className="flex items-center gap-2">
          <input type="color" className="h-8 w-10 cursor-pointer rounded border border-border" value={String(value).slice(0, 7)} onChange={(e) => put(e.target.value.toUpperCase())} aria-label={def.label} />
          <input className={`${field} w-28 font-mono text-xs`} value={String(value)} onChange={(e) => put(e.target.value)} aria-label={`${def.label} (hex)`} />
        </div>
      );
      break;
    case 'size':
      control = (
        <div className="flex items-center gap-2">
          <input type="range" className="flex-1 accent-[var(--color-primary)]" min={def.min} max={def.max} step={def.step} value={Number(value)} onChange={(e) => put(Number(e.target.value))} aria-label={def.label} />
          <input type="number" className={`${field} w-20`} min={def.min} max={def.max} step={def.step} value={Number(value)} onChange={(e) => put(Number(e.target.value))} aria-label={`${def.label} (nilai)`} />
        </div>
      );
      break;
    case 'font':
      control = (
        <select className={field} value={String(value)} onChange={(e) => put(e.target.value)} style={{ fontFamily: fonts[String(value)] }} aria-label={def.label}>
          {Object.keys(fonts).map((f) => <option key={f} value={f} style={{ fontFamily: fonts[f] }}>{f}</option>)}
        </select>
      );
      break;
    case 'text':
      control = <input className={field} value={String(value)} onChange={(e) => put(e.target.value)} placeholder={def.hint} aria-label={def.label} />;
      break;
    case 'toggle':
      control = (
        <button
          role="switch"
          aria-checked={Boolean(value)}
          aria-label={def.label}
          onClick={() => put(!value)}
          className={`relative h-6 w-11 rounded-full transition ${value ? 'bg-primary' : 'bg-border'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
      );
      break;
  }
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-1.5 text-xs font-medium">
        {changed && <span className="h-1.5 w-1.5 rounded-full bg-accent" title="Diubah daripada template" />}
        <span className="flex-1">{def.label}</span>
        {changed && <button className="text-[11px] text-muted hover:text-primary" onClick={() => put(dflt)}>asal</button>}
      </div>
      {control}
      {def.hint && def.kind === 'text' && <p className="text-[11px] text-muted">Token: {def.hint}</p>}
    </div>
  );
}

function Sample({ type }: { type: PageType }) {
  const plan = useBookPlan();
  const ctx = useBookCtx();
  if (type === 'cover') return <CoverPage forceGenerated />;
  const page = plan.find((p) => (type === 'toc' ? p.kind === 'toc' : type === 'divider' ? p.kind === 'divider' : p.kind === 'content' && p.layout === type));
  if (page) return <PageView page={page} />;
  return (
    <ContentFrame pt={type} title="CONTOH HALAMAN" number={1}>
      {sampleBlocks.map((b) => <BlockView key={b.id} block={b} ctx={ctx} />)}
      {type === 'notes' && <NotesPanels count={3} />}
    </ContentFrame>
  );
}

/** Master layout: sunting gaya setiap jenis halaman - perubahan dikenakan kepada semua halaman jenis itu. */
export default function MasterSettings() {
  const [type, setType] = useState<PageType>('standard');
  const overrides = useMasterStore((s) => s.overrides);
  const resetType = useMasterStore((s) => s.resetType);
  const m = resolveMaster(type, overrides);
  const defs = masterSchema[type];
  const groups = [...new Set(defs.map((d) => d.group))];
  const changes = (t: PageType) => Object.keys(overrides[t] ?? {}).length;

  return (
    <div className="grid gap-4">
      <div>
        <h3 className="font-display text-lg font-bold">Master Layout</h3>
        <p className="text-sm text-muted">Pilih jenis halaman dan ubah placeholder, imej, teks, warna, fon dan jadual. Perubahan dikenakan kepada <b>semua</b> halaman jenis tersebut.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {pageTypes.map((p) => (
          <button
            key={p.id}
            onClick={() => setType(p.id)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-left transition ${type === p.id ? 'border-primary bg-primary text-primary-fg' : 'border-border bg-surface hover:bg-surface-2'}`}
            aria-pressed={type === p.id}
          >
            <span className="block text-sm font-semibold">{p.label}{changes(p.id) > 0 && <span className="ml-1.5 rounded-full bg-accent px-1.5 text-[10px] text-sidebar">{changes(p.id)}</span>}</span>
            <span className={`block text-[11px] ${type === p.id ? 'opacity-80' : 'text-muted'}`}>{p.desc}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="grid content-start gap-4">
          {groups.map((g) => (
            <fieldset key={g} className="grid gap-3 rounded-lg border border-border bg-surface p-4 shadow-card sm:grid-cols-2">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-primary">{g}</legend>
              {defs.filter((d) => d.group === g).map((d) => <PropEditor key={d.key} type={type} def={d} m={m} />)}
            </fieldset>
          ))}
          <button
            className="inline-flex items-center gap-1.5 justify-self-start rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
            onClick={() => window.confirm('Kembalikan semua gaya jenis halaman ini kepada template asal?') && resetType(type)}
          >
            <RotateCcw size={15} /> Set semula jenis ini
          </button>
        </div>
        <div className="xl:sticky xl:top-0 xl:self-start">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Pratonton langsung</p>
          <div className="mx-auto max-w-sm"><Sample type={type} /></div>
        </div>
      </div>
    </div>
  );
}
