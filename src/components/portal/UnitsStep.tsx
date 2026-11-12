import { useState } from 'react';
import { Copy, Link2, Loader2, MessageCircle, Pencil, Plus, RefreshCw, Trash2, UsersRound, X } from 'lucide-react';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';
import { useBookCtx } from '@/lib/pagination';
import { resolveTokens } from '@/lib/resolve';
import { createUnit, deleteUnit, unitLink, updateUnit } from '@/lib/portalApi';
import { unitSectionIds, type PortalUnit, type UnitInput } from '@/types/portal';
import type { OutlinePart } from '@/types/book';
import { Step, btn, btnPrimary, field } from './HubCards';

/** "PENGURUSAN HAL EHWAL MURID" → "Hal Ehwal Murid". */
const unitName = (title: string) =>
  title.replace(/^PENGURUSAN\s+/i, '').toLowerCase().replace(/(^|[\s(&/-])(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase()).replace(/\(ppki\)/i, '(PPKI)');

/** Unit lalai: satu bagi setiap bahagian buku (kecuali Lampiran), penyelaras = nama dalam nota partition. */
export function defaultUnits(outline: OutlinePart[], note: (s: string) => string): UnitInput[] {
  return outline
    .filter((p) => p.id !== 'p-lampiran')
    .map((p) => ({
      name: unitName(p.title),
      coordinator: /\{\{\s*jawatan:/.test(p.note) ? note(p.note).replace(/^\[.*\]$/, '') : '',
      partIds: [p.id],
      sectionIds: [],
    }));
}

function ScopeEditor({ value, outline, sections, onChange }: {
  value: Pick<UnitInput, 'partIds' | 'sectionIds'>; outline: OutlinePart[]; sections: Record<string, { title: string }>;
  onChange: (v: Pick<UnitInput, 'partIds' | 'sectionIds'>) => void;
}) {
  const [extraPart, setExtraPart] = useState(outline[0]?.id ?? '');
  const part = outline.find((p) => p.id === extraPart);
  return (
    <div className="grid gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Bahagian penuh</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {outline.map((p) => {
            const on = value.partIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                onClick={() => onChange({ ...value, partIds: on ? value.partIds.filter((x) => x !== p.id) : [...value.partIds, p.id] })}
                className={`rounded-full border px-2.5 py-1 text-xs ${on ? 'border-primary bg-primary text-primary-fg' : 'border-border hover:bg-surface-2'}`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Tajuk tambahan (pilihan)</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {value.sectionIds.map((id) => (
            <span key={id} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs text-primary">
              {sections[id]?.title ?? id}
              <button type="button" onClick={() => onChange({ ...value, sectionIds: value.sectionIds.filter((x) => x !== id) })} aria-label="Buang"><X size={12} /></button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <select className="rounded-md border border-border bg-surface px-2 py-1 text-xs" value={extraPart} onChange={(e) => setExtraPart(e.target.value)} aria-label="Bahagian">
            {outline.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <select
            className="min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1 text-xs"
            value=""
            onChange={(e) => e.target.value && onChange({ ...value, sectionIds: [...value.sectionIds, e.target.value] })}
            aria-label="Tambah tajuk"
          >
            <option value="">+ Tambah tajuk daripada bahagian ini…</option>
            {part?.topics.flatMap((t) => [t.id, ...t.children]).filter((id) => !value.sectionIds.includes(id)).map((id) => (
              <option key={id} value={id}>{sections[id]?.title ?? id}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function UnitRow({ unit, onChanged, onRemoved }: { unit: PortalUnit; onChanged: (u: PortalUnit) => void; onRemoved: () => void }) {
  const outline = useBookStore((s) => s.outline);
  const sections = useBookStore((s) => s.sections);
  const year = useProjectStore((s) => s.profile.year);
  const toast = useUiStore((s) => s.toast);
  const [edit, setEdit] = useState<UnitInput | null>(null);
  const [busy, setBusy] = useState(false);
  const link = unitLink(unit.code);
  const count = unitSectionIds(unit, outline).length;
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try { await fn(); } catch (e) { toast((e as Error).message, 'error'); } finally { setBusy(false); }
  };
  const message = `Salam${unit.coordinator ? ` ${unit.coordinator}` : ''}. Sila kemas kini bahagian *${unit.name}* untuk Buku Panduan Pengurusan Sekolah ${year} melalui pautan ini:\n${link}\n\nKod akses: ${unit.code}`;

  return (
    <li className={`rounded-md border p-3 ${unit.active ? 'border-border' : 'border-dashed border-border opacity-70'}`}>
      {!edit ? (
        <>
          <div className="flex flex-wrap items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{unit.name} {!unit.active && <span className="text-xs font-normal text-muted">(tidak aktif)</span>}</p>
              <p className="text-xs text-muted">
                {unit.coordinator || 'Tiada nama penyelaras'} · {count} halaman ·{' '}
                {[...unit.partIds.map((id) => outline.find((p) => p.id === id)?.title ?? id), ...(unit.sectionIds.length ? [`+${unit.sectionIds.length} tajuk`] : [])].join(', ') || 'tiada bahagian'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button className={btn} disabled={busy} onClick={() => setEdit({ name: unit.name, coordinator: unit.coordinator, partIds: [...unit.partIds], sectionIds: [...unit.sectionIds], active: unit.active })}><Pencil size={14} /> Ubah</button>
              <button className={btn} disabled={busy} onClick={() => run(async () => onChanged(await updateUnit(unit.id, { active: !unit.active })))}>{unit.active ? 'Nyahaktif' : 'Aktifkan'}</button>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md bg-surface-2 px-2 py-1.5">
            <Link2 size={14} className="shrink-0 text-muted" aria-hidden />
            <code className="min-w-0 flex-1 truncate text-xs" title={link}>{link}</code>
            <button className={btn} onClick={() => navigator.clipboard?.writeText(link).then(() => toast('Pautan disalin.'), () => toast('Salin manual: ' + link, 'info'))}><Copy size={14} /> Salin</button>
            <a className={btn} href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>
            <button
              className={btn}
              disabled={busy}
              title="Kod lama tidak lagi sah"
              onClick={() => window.confirm(`Jana kod akses baharu untuk ${unit.name}? Pautan lama tidak lagi boleh digunakan.`) && run(async () => onChanged(await updateUnit(unit.id, { regenerate: true })))}
            >
              <RefreshCw size={14} /> Kod baharu
            </button>
          </div>
          <p className="mt-1 text-[11px] text-muted">Kod akses: <b className="font-mono">{unit.code}</b></p>
        </>
      ) : (
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-sm font-medium">Nama unit<input className={`${field} mt-1`} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
            <label className="text-sm font-medium">Penyelaras<input className={`${field} mt-1`} value={edit.coordinator} onChange={(e) => setEdit({ ...edit, coordinator: e.target.value })} /></label>
          </div>
          <ScopeEditor value={edit} outline={outline} sections={sections} onChange={(v) => setEdit({ ...edit, ...v })} />
          <div className="flex flex-wrap gap-2">
            <button className={btnPrimary} disabled={busy} onClick={() => run(async () => { onChanged(await updateUnit(unit.id, edit)); setEdit(null); })}>Simpan</button>
            <button className={btn} onClick={() => setEdit(null)}>Batal</button>
            <button
              className={`${btn} ml-auto text-red-600`}
              disabled={busy}
              onClick={() => window.confirm(`Padam unit ${unit.name}? Pautan unit ini tidak lagi boleh digunakan (kiriman sedia ada kekal).`) && run(async () => { await deleteUnit(unit.id); onRemoved(); })}
            >
              <Trash2 size={14} /> Padam unit
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/** Langkah 4: unit penyelaras & pautan akses. */
export function UnitsStep({ units, setUnits }: { units: PortalUnit[]; setUnits: (u: PortalUnit[]) => void }) {
  const outline = useBookStore((s) => s.outline);
  const sections = useBookStore((s) => s.sections);
  const ctx = useBookCtx();
  const toast = useUiStore((s) => s.toast);
  const [adding, setAdding] = useState<UnitInput | null>(null);
  const [busy, setBusy] = useState(false);

  const createDefaults = async () => {
    setBusy(true);
    try {
      const made: PortalUnit[] = [];
      for (const u of defaultUnits(outline, (s) => resolveTokens(s, ctx))) made.push(await createUnit(u));
      setUnits([...units, ...made]);
      toast(`${made.length} unit dicipta. Kongsi pautan setiap unit kepada penyelaras.`);
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Step
      n={4}
      title="Unit & pautan akses"
      icon={<UsersRound size={20} aria-hidden />}
      right={<button className={btn} onClick={() => setAdding({ name: '', coordinator: '', partIds: [], sectionIds: [] })}><Plus size={15} /> Tambah unit</button>}
    >
      <p className="text-sm text-muted">
        Setiap unit mendapat pautan dan kod akses sendiri. Penyelaras membuka pautan di telefon / komputer, menyunting halaman unitnya dan menghantar kemas kini kepada anda untuk disemak.
      </p>
      {units.length === 0 && !adding && (
        <div className="mt-3 rounded-md border-2 border-dashed border-border p-4 text-center">
          <p className="text-sm text-muted">Belum ada unit.</p>
          <button className={`${btnPrimary} mt-2`} disabled={busy} onClick={createDefaults}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Cipta unit lalai (satu bagi setiap bahagian)
          </button>
        </div>
      )}
      {adding && (
        <div className="mt-3 grid gap-3 rounded-md border border-primary/40 p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-sm font-medium">Nama unit<input className={`${field} mt-1`} value={adding.name} onChange={(e) => setAdding({ ...adding, name: e.target.value })} placeholder="cth. Unit Kokurikulum" /></label>
            <label className="text-sm font-medium">Penyelaras<input className={`${field} mt-1`} value={adding.coordinator} onChange={(e) => setAdding({ ...adding, coordinator: e.target.value })} placeholder="Nama penyelaras (pilihan)" /></label>
          </div>
          <ScopeEditor value={adding} outline={outline} sections={sections} onChange={(v) => setAdding({ ...adding, ...v })} />
          <div className="flex gap-2">
            <button
              className={btnPrimary}
              disabled={busy || !adding.name.trim() || (!adding.partIds.length && !adding.sectionIds.length)}
              onClick={async () => {
                setBusy(true);
                try {
                  setUnits([...units, await createUnit(adding)]);
                  setAdding(null);
                } catch (e) {
                  toast((e as Error).message, 'error');
                } finally {
                  setBusy(false);
                }
              }}
            >
              Cipta unit
            </button>
            <button className={btn} onClick={() => setAdding(null)}>Batal</button>
          </div>
        </div>
      )}
      {units.length > 0 && (
        <ul className="mt-3 grid gap-2">
          {units.map((u) => (
            <UnitRow key={u.id} unit={u} onChanged={(n) => setUnits(units.map((x) => (x.id === n.id ? n : x)))} onRemoved={() => setUnits(units.filter((x) => x.id !== u.id))} />
          ))}
        </ul>
      )}
    </Step>
  );
}
