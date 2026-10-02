import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import type { CommitteeBlock, MemberRef, OrgChartBlock, StaffListBlock } from '@/types/book';
import { useStaffStore } from '@/stores/staffStore';
import { F_POSITION } from '@/types/staff';
import { nameOf, positionOf } from '@/lib/resolve';
import { uid } from '@/lib/blocks';

export const field = 'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm';
const iconBtn = 'rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30';
const smallBtn = 'inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-2';
const chip = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs';

const swap = <T,>(arr: T[], i: number, j: number) => {
  if (j < 0 || j >= arr.length) return arr;
  const n = [...arr];
  [n[i], n[j]] = [n[j], n[i]];
  return n;
};

function usePositions() {
  return useStaffStore((s) => s.fields.find((f) => f.id === F_POSITION)?.options ?? []);
}

/** Pilih beberapa jawatan sebagai cip. */
function PositionPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const positions = usePositions();
  return (
    <div className="flex flex-wrap gap-1.5">
      {value.map((p) => (
        <span key={p} className={`${chip} border-primary/30 bg-primary/5 text-primary`}>
          {p}
          <button onClick={() => onChange(value.filter((x) => x !== p))} aria-label={`Buang ${p}`}><X size={12} /></button>
        </span>
      ))}
      <select
        className="rounded-full border border-dashed border-border bg-surface px-2 py-1 text-xs"
        value=""
        onChange={(e) => e.target.value && onChange([...value, e.target.value])}
        aria-label="Tambah jawatan"
      >
        <option value="">+ Jawatan</option>
        {positions.filter((p) => !value.includes(p)).map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}

export function OrgChartEditor({ block, onChange }: { block: OrgChartBlock; onChange: (b: OrgChartBlock) => void }) {
  const sessions = useStaffStore((s) => s.fields.find((f) => f.id === 'sesi')?.options ?? []);
  const setLevel = (i: number, patch: Partial<OrgChartBlock['levels'][number]>) =>
    onChange({ ...block, levels: block.levels.map((l, j) => (j === i ? { ...l, ...patch } : l)) });
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input className={field} placeholder="Tajuk carta (pilihan)" value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} aria-label="Tajuk carta" />
        <select className={field} value={block.session} onChange={(e) => onChange({ ...block, session: e.target.value })} aria-label="Tapis sesi">
          <option value="">Semua sesi</option>
          {sessions.map((s) => <option key={s} value={s}>Sesi {s}</option>)}
        </select>
      </div>
      <p className="text-xs text-muted">Nama & gambar diambil automatik daripada <b>Tetapan → Pangkalan Data Guru</b> mengikut jawatan.</p>
      {block.levels.map((l, i) => (
        <div key={l.id} className="rounded-md border border-border bg-surface-2 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-fg">{i + 1}</span>
            <input className={`${field} py-1.5`} value={l.label} onChange={(e) => setLevel(i, { label: e.target.value })} aria-label="Nama aras" />
            <select className={`${field} w-auto py-1.5`} value={l.display} onChange={(e) => setLevel(i, { display: e.target.value as 'person' | 'group' })} aria-label="Gaya paparan">
              <option value="person">Kad bergambar</option>
              <option value="group">Kotak senarai nama</option>
            </select>
            <button className={iconBtn} disabled={i === 0} onClick={() => onChange({ ...block, levels: swap(block.levels, i, i - 1) })} aria-label="Naik"><ArrowUp size={14} /></button>
            <button className={iconBtn} disabled={i === block.levels.length - 1} onClick={() => onChange({ ...block, levels: swap(block.levels, i, i + 1) })} aria-label="Turun"><ArrowDown size={14} /></button>
            <button className={iconBtn} onClick={() => onChange({ ...block, levels: block.levels.filter((_, j) => j !== i) })} aria-label="Buang aras"><X size={14} /></button>
          </div>
          <PositionPicker value={l.positions} onChange={(positions) => setLevel(i, { positions })} />
        </div>
      ))}
      <button
        className={`${smallBtn} justify-self-start`}
        onClick={() => onChange({ ...block, levels: [...block.levels, { id: uid(), label: `Aras ${block.levels.length + 1}`, positions: [], display: 'group' }] })}
      >
        <Plus size={13} /> Aras
      </button>
    </div>
  );
}

function MemberChips({ refs, onChange }: { refs: MemberRef[]; onChange: (r: MemberRef[]) => void }) {
  const teachers = useStaffStore((s) => s.teachers);
  const positions = usePositions();
  const label = (r: MemberRef) => {
    if (r.kind === 'text') return r.value;
    if (r.kind === 'position') return `${r.value} (auto)`;
    const t = teachers.find((x) => x.id === r.id);
    return t ? nameOf(t) : '(guru dibuang)';
  };
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {refs.map((r, i) => (
        <span
          key={i}
          className={`${chip} ${r.kind === 'position' ? 'border-accent/50 bg-accent/10 text-text' : r.kind === 'text' ? 'border-border bg-surface-2' : 'border-primary/30 bg-primary/5 text-primary'}`}
          title={r.kind === 'position' ? 'Dijana automatik daripada pangkalan data mengikut jawatan' : undefined}
        >
          {label(r)}
          <button onClick={() => onChange(refs.filter((_, j) => j !== i))} aria-label="Buang ahli"><X size={12} /></button>
        </span>
      ))}
      <select
        className="max-w-[12rem] rounded-full border border-dashed border-border bg-surface px-2 py-1 text-xs"
        value=""
        onChange={(e) => {
          const v = e.target.value;
          e.target.value = '';
          if (!v) return;
          if (v === '__text') {
            const txt = window.prompt('Teks ahli (cth. "Semua Ketua Panitia"):')?.trim();
            if (txt) onChange([...refs, { kind: 'text', value: txt }]);
          } else if (v.startsWith('p:')) onChange([...refs, { kind: 'position', value: v.slice(2) }]);
          else onChange([...refs, { kind: 'teacher', id: v.slice(2) }]);
        }}
        aria-label="Tambah ahli"
      >
        <option value="">+ Ahli</option>
        <optgroup label="Ikut jawatan (automatik)">
          {positions.map((p) => <option key={p} value={`p:${p}`}>{p}</option>)}
        </optgroup>
        <optgroup label="Guru">
          {teachers.map((t) => <option key={t.id} value={`t:${t.id}`}>{nameOf(t)}{positionOf(t) ? ` — ${positionOf(t)}` : ''}</option>)}
        </optgroup>
        <option value="__text">Teks bebas…</option>
      </select>
    </div>
  );
}

const roles = ['Pengerusi', 'Timbalan Pengerusi', 'Naib Pengerusi', 'Setiausaha', 'Penolong Setiausaha', 'Bendahari', 'Ahli Jawatankuasa', 'Penyelaras'];

export function CommitteeEditor({ block, onChange }: { block: CommitteeBlock; onChange: (b: CommitteeBlock) => void }) {
  const setRow = (i: number, patch: Partial<CommitteeBlock['rows'][number]>) =>
    onChange({ ...block, rows: block.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  return (
    <div className="grid gap-3">
      <input className={`${field} font-semibold`} placeholder="Tajuk jawatankuasa" value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} aria-label="Tajuk jawatankuasa" />
      <datalist id="cm-roles">{roles.map((r) => <option key={r} value={r} />)}</datalist>
      {block.rows.map((r, i) => (
        <div key={r.id} className="grid gap-2 rounded-md border border-border p-2.5 sm:grid-cols-[11rem_1fr_auto]">
          <input className={`${field} py-1.5 font-medium`} list="cm-roles" value={r.role} onChange={(e) => setRow(i, { role: e.target.value })} aria-label="Peranan" />
          <MemberChips refs={r.members} onChange={(members) => setRow(i, { members })} />
          <div className="flex items-start">
            <button className={iconBtn} disabled={i === 0} onClick={() => onChange({ ...block, rows: swap(block.rows, i, i - 1) })} aria-label="Naik"><ArrowUp size={14} /></button>
            <button className={iconBtn} disabled={i === block.rows.length - 1} onClick={() => onChange({ ...block, rows: swap(block.rows, i, i + 1) })} aria-label="Turun"><ArrowDown size={14} /></button>
            <button className={iconBtn} onClick={() => onChange({ ...block, rows: block.rows.filter((_, j) => j !== i) })} aria-label="Buang peranan"><X size={14} /></button>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <button className={smallBtn} onClick={() => onChange({ ...block, rows: [...block.rows, { id: uid(), role: 'Ahli Jawatankuasa', members: [] }] })}><Plus size={13} /> Peranan</button>
        <span className="text-xs text-muted">Ahli "(auto)" dikemas kini sendiri bila Pangkalan Data Guru berubah.</span>
      </div>
    </div>
  );
}

export function StaffListEditor({ block, onChange }: { block: StaffListBlock; onChange: (b: StaffListBlock) => void }) {
  const fields = useStaffStore((s) => s.fields);
  const filterField = fields.find((f) => f.id === block.filterField);
  return (
    <div className="grid gap-3">
      <input className={field} placeholder="Tajuk (pilihan)" value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} aria-label="Tajuk senarai" />
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">Lajur</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          <label className="flex items-center gap-1.5">
            <input type="checkbox" checked={block.showPhoto} onChange={(e) => onChange({ ...block, showPhoto: e.target.checked })} /> Foto
          </label>
          {fields.map((f) => (
            <label key={f.id} className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={block.columns.includes(f.id)}
                onChange={(e) => onChange({ ...block, columns: e.target.checked ? fields.map((x) => x.id).filter((id) => id === f.id || block.columns.includes(id)) : block.columns.filter((c) => c !== f.id) })}
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-[12rem_1fr]">
        <select className={field} value={block.filterField} onChange={(e) => onChange({ ...block, filterField: e.target.value, filterValues: [] })} aria-label="Tapis ikut medan">
          <option value="">Semua guru</option>
          {fields.filter((f) => f.type === 'select' || f.type === 'multi').map((f) => <option key={f.id} value={f.id}>Tapis: {f.label}</option>)}
        </select>
        {filterField && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {filterField.options.map((o) => (
              <label key={o} className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={block.filterValues.includes(o)}
                  onChange={(e) => onChange({ ...block, filterValues: e.target.checked ? [...block.filterValues, o] : block.filterValues.filter((v) => v !== o) })}
                />
                {o}
              </label>
            ))}
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm">
        Susunan
        <select className={`${field} w-auto`} value={block.sort ?? 'hierarki'} onChange={(e) => onChange({ ...block, sort: e.target.value as StaffListBlock['sort'] })}>
          <option value="pentadbir">Pentadbir dahulu, kemudian ikut abjad</option>
          <option value="hierarki">Ikut hierarki kategori jawatan</option>
          <option value="abjad">Ikut abjad nama</option>
        </select>
      </label>
      <p className="text-xs text-muted">Senarai dijana automatik daripada Pangkalan Data Guru.</p>
    </div>
  );
}
