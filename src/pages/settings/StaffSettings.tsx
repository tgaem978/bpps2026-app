import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Camera, ChevronDown, ClipboardPaste, Lock, Pencil, Plus, RotateCcw, Search, SlidersHorizontal, Trash2, UserPlus, X } from 'lucide-react';
import { useStaffStore } from '@/stores/staffStore';
import { useUiStore } from '@/stores/uiStore';
import type { FieldType, FieldValue, StaffField, Teacher } from '@/types/staff';
import { F_NAME, F_POSITION, F_SESSION } from '@/types/staff';
import { resizeImage } from '@/lib/blocks';
import { nameOf, positionOf, sortTeachers, valueText } from '@/lib/resolve';
import { useProjectStore } from '@/stores/projectStore';
import { Avatar } from '@/components/book/BlockView';

const field = 'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm';
const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2';
const primaryBtn = 'inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary px-3 py-1.5 text-sm font-medium text-primary-fg hover:opacity-90';
const iconBtn = 'rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30';

const typeLabels: Record<FieldType, string> = {
  text: 'Teks',
  select: 'Senarai juntai bawah (satu pilihan)',
  multi: 'Kotak semak (banyak pilihan)',
  phone: 'Nombor telefon',
};

/** Input untuk satu medan - jenis menentukan kawalan (teks, juntai bawah, kotak semak). */
export function FieldInput({ f, value, onChange }: { f: StaffField; value: FieldValue | undefined; onChange: (v: FieldValue) => void }) {
  const addOption = useStaffStore((s) => s.addOption);
  const askNew = () => {
    const o = window.prompt(`Pilihan baharu untuk "${f.label}":`)?.trim();
    if (o) addOption(f.id, o);
    return o;
  };
  if (f.type === 'select') {
    const v = valueText(value);
    return (
      <select
        className={field}
        value={v}
        onChange={(e) => {
          if (e.target.value === '__new') {
            const o = askNew();
            if (o) onChange(o);
          } else onChange(e.target.value);
        }}
        aria-label={f.label}
      >
        <option value="">— Pilih —</option>
        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        {v && !f.options.includes(v) && <option value={v}>{v}</option>}
        <option value="__new">＋ Tambah pilihan baharu…</option>
      </select>
    );
  }
  if (f.type === 'multi') {
    const vals = Array.isArray(value) ? value : value ? [value] : [];
    return (
      <details className="group relative">
        <summary className={`${field} flex min-h-[38px] cursor-pointer list-none flex-wrap items-center gap-1 py-1.5`} aria-label={f.label}>
          {vals.length === 0 && <span className="text-muted">— Pilih —</span>}
          {vals.map((v) => <span key={v} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{v}</span>)}
          <ChevronDown size={14} className="ml-auto shrink-0 text-muted transition group-open:rotate-180" />
        </summary>
        <div className="absolute z-20 mt-1 max-h-64 w-full min-w-[14rem] overflow-y-auto rounded-md border border-border bg-surface p-2 shadow-lg">
          {f.options.map((o) => (
            <label key={o} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-surface-2">
              <input type="checkbox" checked={vals.includes(o)} onChange={(e) => onChange(e.target.checked ? [...vals, o] : vals.filter((x) => x !== o))} />
              {o}
            </label>
          ))}
          <button
            className="mt-1 w-full rounded px-2 py-1 text-left text-sm font-medium text-primary hover:bg-surface-2"
            onClick={(e) => {
              e.preventDefault();
              const o = askNew();
              if (o) onChange([...vals, o]);
            }}
          >
            ＋ Tambah pilihan baharu…
          </button>
        </div>
      </details>
    );
  }
  return (
    <input
      className={field}
      type={f.type === 'phone' ? 'tel' : 'text'}
      inputMode={f.type === 'phone' ? 'tel' : undefined}
      placeholder={f.type === 'phone' ? '01X-XXX XXXX' : ''}
      value={valueText(value)}
      onChange={(e) => onChange(e.target.value)}
      aria-label={f.label}
    />
  );
}

function FieldManager() {
  const { fields, addField, updateField, removeField, moveField, addOption, renameOption, removeOption } = useStaffStore();
  const [draft, setDraft] = useState<Record<string, string>>({});
  return (
    <div className="grid gap-3 rounded-lg border border-border bg-surface-2 p-4">
      <div>
        <h4 className="font-semibold">Urus Medan Maklumat</h4>
        <p className="text-xs text-muted">Tambah, buang atau ubah medan dan pilihan bila-bila masa. Susunan pilihan <b>Jawatan</b> menentukan hierarki carta organisasi & isihan senarai.</p>
      </div>
      {fields.map((f, i) => (
        <div key={f.id} className="rounded-md border border-border bg-surface p-3">
          <div className="flex flex-wrap items-center gap-2">
            <input className={`${field} min-w-[10rem] flex-1 py-1.5 font-medium`} value={f.label} onChange={(e) => updateField(f.id, { label: e.target.value })} aria-label="Nama medan" />
            <select className={`${field} w-auto py-1.5`} value={f.type} disabled={f.locked} onChange={(e) => updateField(f.id, { type: e.target.value as FieldType })} aria-label="Jenis medan">
              {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button className={iconBtn} disabled={i === 0} onClick={() => moveField(f.id, -1)} aria-label="Naik"><ArrowUp size={15} /></button>
            <button className={iconBtn} disabled={i === fields.length - 1} onClick={() => moveField(f.id, 1)} aria-label="Turun"><ArrowDown size={15} /></button>
            {f.locked ? (
              <span className="p-1.5 text-muted" title="Medan teras - digunakan oleh penjana automatik"><Lock size={15} /></span>
            ) : (
              <button className={`${iconBtn} hover:!text-red-600`} onClick={() => window.confirm(`Buang medan "${f.label}" dan semua datanya?`) && removeField(f.id)} aria-label="Buang medan"><Trash2 size={15} /></button>
            )}
          </div>
          {(f.type === 'select' || f.type === 'multi') && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {f.options.map((o) => (
                <span key={o} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs">
                  <button
                    title="Klik untuk menamakan semula"
                    onClick={() => {
                      const n = window.prompt('Nama baharu pilihan:', o)?.trim();
                      if (n && n !== o) renameOption(f.id, o, n);
                    }}
                  >
                    {o}
                  </button>
                  <button onClick={() => removeOption(f.id, o)} aria-label={`Buang ${o}`} className="text-muted hover:text-red-600"><X size={11} /></button>
                </span>
              ))}
              <form
                className="inline-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  const v = (draft[f.id] ?? '').trim();
                  if (v) addOption(f.id, v);
                  setDraft({ ...draft, [f.id]: '' });
                }}
              >
                <input className="w-36 rounded-l-full border border-border bg-surface px-2 py-0.5 text-xs" placeholder="Pilihan baharu" value={draft[f.id] ?? ''} onChange={(e) => setDraft({ ...draft, [f.id]: e.target.value })} aria-label="Pilihan baharu" />
                <button className="rounded-r-full border border-l-0 border-border bg-surface px-2 text-xs font-medium text-primary hover:bg-surface-2" type="submit">Tambah</button>
              </form>
            </div>
          )}
        </div>
      ))}
      <button className={`${btn} justify-self-start`} onClick={() => addField({ label: 'Medan baharu', type: 'text', options: [] })}><Plus size={15} /> Tambah medan</button>
    </div>
  );
}

/** Tampal daripada Excel/Google Sheets: Tab atau koma, ikut susunan medan atau baris tajuk. */
function PasteImport({ onDone }: { onDone: () => void }) {
  const { fields, addTeachers } = useStaffStore();
  const toast = useUiStore((s) => s.toast);
  const [text, setText] = useState('');
  const rows = useMemo(() => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return [];
    const split = (l: string) => (l.includes('\t') ? l.split('\t') : l.split(',')).map((c) => c.trim());
    const first = split(lines[0]).map((c) => c.toLowerCase());
    const header = first.some((c) => fields.some((f) => f.label.toLowerCase() === c));
    const order = header ? first.map((c) => fields.find((f) => f.label.toLowerCase() === c)?.id ?? '') : fields.map((f) => f.id);
    return (header ? lines.slice(1) : lines).map((l) => {
      const cells = split(l);
      const values: Record<string, FieldValue> = {};
      order.forEach((fid, i) => {
        const f = fields.find((x) => x.id === fid);
        if (!f || cells[i] === undefined || cells[i] === '') return;
        values[fid] = f.type === 'multi' ? cells[i].split(/[;/]/).map((s) => s.trim()).filter(Boolean) : cells[i];
      });
      return values;
    }).filter((v) => valueText(v[F_NAME]));
  }, [text, fields]);

  return (
    <div className="grid gap-2 rounded-lg border border-border bg-surface-2 p-4">
      <h4 className="font-semibold">Tampal Senarai Guru</h4>
      <p className="text-xs text-muted">
        Salin terus daripada Excel / Google Sheets (atau CSV). Satu guru setiap baris, lajur ikut susunan: <b>{fields.map((f) => f.label).join(' · ')}</b>.
        Baris pertama boleh jadi tajuk lajur. Pilihan berbilang dipisah dengan “;”. Pilihan baharu ditambah secara automatik.
      </p>
      <textarea className={`${field} min-h-[140px] font-mono text-xs`} value={text} onChange={(e) => setText(e.target.value)} placeholder={'AHMAD BIN ALI\tGuru Akademik\tPagi\tMatematik;Sains\t012-3456789'} />
      <div className="flex flex-wrap items-center gap-2">
        <button className={primaryBtn} disabled={!rows.length} onClick={() => { addTeachers(rows); toast(`${rows.length} guru ditambah.`); setText(''); onDone(); }}>
          <ClipboardPaste size={15} /> Import {rows.length || ''} guru
        </button>
        <button className={btn} onClick={onDone}>Batal</button>
      </div>
    </div>
  );
}

function TeacherRow({ t, open, onToggle }: { t: Teacher; open: boolean; onToggle: () => void }) {
  const { fields, setValue, updateTeacher, removeTeacher } = useStaffStore();
  const toast = useUiStore((s) => s.toast);
  const name = nameOf(t);
  const summaryFields = fields.filter((f) => f.id !== F_NAME && f.id !== F_POSITION);
  return (
    <div className={`rounded-lg border bg-surface shadow-card transition ${open ? 'border-primary' : 'border-border'}`}>
      <div className="flex items-center gap-3 p-3">
        <label className="group relative h-[60px] w-12 shrink-0 cursor-pointer overflow-hidden rounded-md ring-1 ring-border" title="Muat naik / tukar gambar">
          {t.photo ? <img src={t.photo} alt="" className="h-full w-full object-cover" /> : <Avatar name={name} />}
          <span className="absolute inset-0 hidden items-center justify-center bg-black/45 text-white group-hover:flex"><Camera size={16} /></span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try { updateTeacher(t.id, { photo: await resizeImage(f) }); } catch (err) { toast((err as Error).message, 'error'); }
            }}
          />
        </label>
        <button className="min-w-0 flex-1 text-left" onClick={onToggle}>
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted">
            <span className="font-medium text-primary">{positionOf(t) || 'Tiada jawatan'}</span>
            {summaryFields.map((f) => {
              const v = valueText(t.values[f.id]);
              return v ? <span key={f.id}> · {v}</span> : null;
            })}
          </p>
        </button>
        <button className={iconBtn} onClick={onToggle} aria-label={open ? 'Tutup' : 'Sunting'} aria-expanded={open}>{open ? <ChevronDown size={16} className="rotate-180" /> : <Pencil size={15} />}</button>
        <button className={`${iconBtn} hover:!text-red-600`} onClick={() => window.confirm(`Padam ${name}?`) && removeTeacher(t.id)} aria-label="Padam guru"><Trash2 size={15} /></button>
      </div>
      {open && (
        <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <label key={f.id} className={`text-xs font-semibold uppercase tracking-wide text-muted ${f.id === F_NAME ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
              {f.label}
              <div className="mt-1 font-normal normal-case tracking-normal text-text">
                <FieldInput f={f} value={t.values[f.id]} onChange={(v) => setValue(t.id, f.id, f.id === F_NAME && typeof v === 'string' ? v.toUpperCase() : v)} />
              </div>
            </label>
          ))}
          {t.photo && (
            <div className="flex items-end">
              <button className={btn} onClick={() => updateTeacher(t.id, { photo: '' })}><X size={14} /> Buang gambar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StaffSettings() {
  const { fields, teachers, addTeacher, reset } = useStaffStore();
  const profile = useProjectStore((s) => s.profile);
  const toast = useUiStore((s) => s.toast);
  const [q, setQ] = useState('');
  const [pos, setPos] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [panel, setPanel] = useState<'' | 'fields' | 'paste'>('');
  const positions = fields.find((f) => f.id === F_POSITION)?.options ?? [];
  const sessionField = fields.find((f) => f.id === F_SESSION);
  const ctx = { fields, teachers, profile };

  const list = sortTeachers(ctx, teachers).filter((t) => {
    if (pos && positionOf(t) !== pos) return false;
    if (!q) return true;
    const hay = Object.values(t.values).map((v) => valueText(v)).join(' ').toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <h3 className="font-display text-lg font-bold">Pangkalan Data Guru</h3>
          <p className="text-sm text-muted">
            {teachers.length} guru
            {sessionField?.options.map((o) => ` · ${teachers.filter((t) => valueText(t.values[F_SESSION]) === o).length} ${o.toLowerCase()}`)}
            . Data ini menjana carta organisasi, jawatankuasa, senarai guru & teks automatik dalam BPPS.
          </p>
        </div>
        <button className={primaryBtn} onClick={() => { const id = addTeacher({ [F_NAME]: '' }); setOpenId(id); }}><UserPlus size={15} /> Tambah guru</button>
        <button className={btn} onClick={() => setPanel(panel === 'paste' ? '' : 'paste')}><ClipboardPaste size={15} /> Tampal senarai</button>
        <button className={btn} onClick={() => setPanel(panel === 'fields' ? '' : 'fields')}><SlidersHorizontal size={15} /> Urus medan</button>
        <button
          className={btn}
          onClick={() => { if (window.confirm('Set semula pangkalan data kepada data asal BPPS SKBTS? Semua perubahan guru akan hilang.')) { reset(); toast('Pangkalan data diset semula.', 'info'); } }}
          title="Set semula"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {panel === 'fields' && <FieldManager />}
      {panel === 'paste' && <PasteImport onDone={() => setPanel('')} />}

      <div className="flex flex-wrap gap-2">
        <div className="relative min-w-[14rem] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className={`${field} pl-9`} placeholder="Cari nama, jawatan, opsyen, telefon…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari guru" />
        </div>
        <select className={`${field} w-auto`} value={pos} onChange={(e) => setPos(e.target.value)} aria-label="Tapis jawatan">
          <option value="">Semua jawatan</option>
          {positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="grid gap-2">
        {list.map((t) => <TeacherRow key={t.id} t={t} open={openId === t.id} onToggle={() => setOpenId(openId === t.id ? null : t.id)} />)}
        {list.length === 0 && <p className="rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted">Tiada guru sepadan.</p>}
      </div>
    </div>
  );
}
