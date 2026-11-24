import { useState } from 'react';
import { ArrowDown, ArrowUp, Link2, Plus, X } from 'lucide-react';
import type { TakwimBlock, TakwimRow } from '@/types/book';
import { useBookStore } from '@/stores/bookStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { linkTakwimBlock, sourcesOf } from '@/lib/takwimLink';

const cell = 'w-full resize-none rounded border border-border bg-surface px-1.5 py-1 text-xs';
const iconBtn = 'rounded-md p-1 text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30';
const smallBtn = 'inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-2';
const rowsOf = (t: string) => Math.max(1, t.split('\n').length);

/** Jenis hari (sama dengan serlahan halaman Kalendar). */
const KINDS: [string, string][] = [
  ['', 'Hari sekolah'], ['weekend', 'Hujung minggu'], ['umum', 'Cuti kelepasan am'], ['perayaan', 'Cuti perayaan KPM'], ['sekolah', 'Cuti persekolahan'], ['holiday', 'Cuti (lain-lain)'],
];
const ROW_BG: Record<string, string> = { weekend: 'bg-amber-50', holiday: 'bg-slate-100', umum: 'bg-red-50', perayaan: 'bg-violet-50', sekolah: 'bg-sky-50' };
const isWeekendDay = (day: string) => /^(sabtu|ahad)$/i.test(day.trim());
const dayNo = (date: string) => Number(date.match(/\d{1,2}/)?.[0] ?? 0);

/** Tandakan julat tarikh (cth. cuti penggal) sekali gus: jenis hari + keterangan merentas semua unit. */
function RangeTool({ block, onChange }: { block: TakwimBlock; onChange: (b: TakwimBlock) => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [kind, setKind] = useState('sekolah');
  const [label, setLabel] = useState('');
  const apply = () => {
    const a = Number(from);
    const b = Number(to || from);
    if (!a || !b) return;
    onChange({
      ...block,
      rows: block.rows.map((r) => {
        const d = dayNo(r.date);
        if (d < Math.min(a, b) || d > Math.max(a, b)) return r;
        if (!kind) return { ...r, kind: isWeekendDay(r.day) ? 'weekend' : undefined, span: undefined };
        return { ...r, kind: kind as TakwimRow['kind'], ...(label.trim() ? { span: label.trim().toUpperCase() } : {}) };
      }),
    });
  };
  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface-2/50 p-2 text-xs">
      <p className="w-full font-semibold text-text">Tandakan julat tarikh (cth. cuti penggal, cuti perayaan)</p>
      <label className="grid gap-0.5 text-muted">Dari hari
        <input className={`${cell} w-16`} inputMode="numeric" value={from} onChange={(e) => setFrom(e.target.value.replace(/\D/g, ''))} placeholder="6" />
      </label>
      <label className="grid gap-0.5 text-muted">Hingga
        <input className={`${cell} w-16`} inputMode="numeric" value={to} onChange={(e) => setTo(e.target.value.replace(/\D/g, ''))} placeholder="14" />
      </label>
      <label className="grid gap-0.5 text-muted">Jenis
        <select className={`${cell} w-40`} value={kind} onChange={(e) => setKind(e.target.value)}>
          {KINDS.filter(([v]) => v !== 'weekend').map(([v, l]) => <option key={v} value={v}>{v ? l : 'Hari sekolah (buang cuti)'}</option>)}
        </select>
      </label>
      <label className="grid min-w-[10rem] flex-1 gap-0.5 text-muted">Keterangan (pilihan)
        <input className={cell} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="cth. CUTI PENGGAL 1 2027" disabled={!kind} />
      </label>
      <button className={smallBtn} onClick={apply} disabled={!from}>Tandakan</button>
    </div>
  );
}

/** Penyunting takwim bulanan: satu baris sehari; acara/cuti seluruh sekolah merentas semua unit. */
export function TakwimEditor({ block, onChange }: { block: TakwimBlock; onChange: (b: TakwimBlock) => void }) {
  const n = block.columns.length;
  const sections = useBookStore((s) => s.sections);
  const open = useNavigationStore((s) => s.setActiveSection);
  // Takwim Induk berpaut: aktiviti unit (automatik) dipaparkan baca-sahaja di bawah sel; sel = catatan tambahan pentadbir.
  const linked = block.linked ? linkTakwimBlock({ ...block, rows: block.rows.map((r) => ({ ...r, cells: r.cells.map(() => '') })) }, sections) : null;
  const srcCols = block.columns.map((c) => (block.linked ? sourcesOf(c) : []));
  const setRow = (i: number, patch: Partial<TakwimRow>) => onChange({ ...block, rows: block.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) });
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= block.rows.length) return;
    const rows = [...block.rows];
    [rows[i], rows[j]] = [rows[j], rows[i]];
    onChange({ ...block, rows });
  };
  return (
    <div className="grid gap-2">
      <div className="grid gap-2 sm:grid-cols-[12rem_1fr]">
        <input className={`${cell} py-1.5 text-sm font-semibold`} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} aria-label="Bulan" placeholder="Bulan" />
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {block.columns.map((c, i) => (
            <input key={i} className={cell} value={c} onChange={(e) => onChange({ ...block, columns: block.columns.map((x, j) => (j === i ? e.target.value : x)) })} aria-label={`Unit ${i + 1}`} />
          ))}
        </div>
      </div>
      {block.linked && (
        <div className="rounded-lg border border-[#C9A13B]/50 bg-[#FBF6E6] p-2.5 text-xs text-text">
          <p className="flex items-center gap-1.5 font-semibold"><Link2 size={14} /> Takwim Induk berpaut kepada Takwim Tahunan setiap unit</p>
          <p className="mt-1 text-muted">Aktiviti unit dimuatkan secara automatik (ditunjukkan dalam kotak biru di bawah setiap sel). Untuk menambah atau mengubah aktiviti, sunting takwim unit berkenaan:</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {[...new Set(srcCols.flat().map((x) => x.id))].filter((id) => sections[id]).map((id) => (
              <button key={id} className={smallBtn} onClick={() => open(id)}>{sections[id].title}</button>
            ))}
          </div>
          <p className="mt-1 text-muted">Sel dalam penyunting ini hanya untuk catatan tambahan Pentadbir Sistem; cuti / acara seluruh sekolah diurus di sini.</p>
        </div>
      )}
      <RangeTool block={block} onChange={onChange} />
      <p className="text-[11px] text-muted">Jenis hari: <b className="text-[#9B1C1C]">Kelepasan am</b> (merah), <b className="text-[#4C2A85]">Perayaan KPM</b> (ungu), <b className="text-[#0B4A6F]">Cuti persekolahan</b> (biru), hujung minggu (kuning). Warna yang sama dipaparkan pada halaman Kalendar secara automatik. Tandakan "Seluruh sekolah" untuk teks yang merentas semua unit.</p>
      <div className="overflow-x-auto">
        <div className="grid min-w-[720px] gap-1">
          {block.rows.map((r, i) => (
            <div key={i} data-f={`t${i}`} className={`grid items-start gap-1 rounded p-1 ${ROW_BG[r.kind ?? ''] ?? ''}`}
              style={{ gridTemplateColumns: `2.5rem 5.5rem 4.5rem 6.5rem 1fr auto` }}>
              <input className={cell} value={r.week} onChange={(e) => setRow(i, { week: e.target.value })} aria-label={`Minggu baris ${i + 1}`} placeholder="M" />
              <input className={cell} value={r.date} onChange={(e) => setRow(i, { date: e.target.value })} aria-label={`Tarikh baris ${i + 1}`} placeholder="Tarikh" />
              <input className={cell} value={r.day} onChange={(e) => setRow(i, { day: e.target.value })} aria-label={`Hari baris ${i + 1}`} placeholder="Hari" />
              <div className="grid gap-0.5">
                <select className={cell} value={r.kind ?? ''} onChange={(e) => setRow(i, { kind: (e.target.value || undefined) as TakwimRow['kind'] })} aria-label={`Jenis baris ${i + 1}`}>
                  {KINDS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                </select>
                <label className="flex items-center gap-1 text-[10px] text-muted">
                  <input type="checkbox" checked={r.span !== undefined} onChange={(e) => setRow(i, { span: e.target.checked ? r.cells.filter(Boolean).join(' / ') : undefined })} /> Seluruh sekolah
                </label>
              </div>
              {r.span !== undefined ? (
                <textarea className={cell} rows={rowsOf(r.span)} value={r.span} onChange={(e) => setRow(i, { span: e.target.value })} aria-label={`Acara seluruh sekolah baris ${i + 1}`} />
              ) : (
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                  {block.columns.map((_, ci) => (
                    <div key={ci} className="grid gap-0.5">
                      <textarea className={cell} rows={rowsOf(r.cells[ci] ?? '')} value={r.cells[ci] ?? ''}
                        onChange={(e) => setRow(i, { cells: block.columns.map((__, k) => (k === ci ? e.target.value : r.cells[k] ?? '')) })}
                        aria-label={`${block.columns[ci]} baris ${i + 1}`} placeholder={srcCols[ci].length ? 'Catatan tambahan' : ''} />
                      {linked?.rows[i]?.cells[ci] && (
                        <p className="whitespace-pre-line rounded bg-[#EAF1FB] px-1.5 py-1 text-[10.5px] leading-snug text-[#0B2A5B]" title="Daripada takwim unit (automatik)">{linked.rows[i].cells[ci]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex">
                <button className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Naik"><ArrowUp size={13} /></button>
                <button className={iconBtn} disabled={i === block.rows.length - 1} onClick={() => move(i, 1)} aria-label="Turun"><ArrowDown size={13} /></button>
                <button className={iconBtn} onClick={() => onChange({ ...block, rows: block.rows.filter((_, j) => j !== i) })} aria-label="Buang baris"><X size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className={`${smallBtn} justify-self-start`} onClick={() => onChange({ ...block, rows: [...block.rows, { week: block.rows[block.rows.length - 1]?.week ?? '', date: '', day: '', cells: block.columns.map(() => '') }] })}>
        <Plus size={13} /> Baris
      </button>
    </div>
  );
}
