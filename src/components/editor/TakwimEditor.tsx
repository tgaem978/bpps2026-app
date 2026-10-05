import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import type { TakwimBlock, TakwimRow } from '@/types/book';

const cell = 'w-full resize-none rounded border border-border bg-surface px-1.5 py-1 text-xs';
const iconBtn = 'rounded-md p-1 text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30';
const smallBtn = 'inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-2';
const rowsOf = (t: string) => Math.max(1, t.split('\n').length);

/** Penyunting takwim bulanan: satu baris sehari; acara/cuti seluruh sekolah merentas semua unit. */
export function TakwimEditor({ block, onChange }: { block: TakwimBlock; onChange: (b: TakwimBlock) => void }) {
  const n = block.columns.length;
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
      <p className="text-[11px] text-muted">Jenis baris: Hujung minggu (kuning) atau Cuti (kelabu). Tandakan "Seluruh sekolah" untuk teks yang merentas semua unit.</p>
      <div className="overflow-x-auto">
        <div className="grid min-w-[720px] gap-1">
          {block.rows.map((r, i) => (
            <div key={i} className={`grid items-start gap-1 rounded p-1 ${r.kind === 'weekend' ? 'bg-amber-50' : r.kind === 'holiday' ? 'bg-slate-100' : ''}`}
              style={{ gridTemplateColumns: `2.5rem 5.5rem 4.5rem 6.5rem 1fr auto` }}>
              <input className={cell} value={r.week} onChange={(e) => setRow(i, { week: e.target.value })} aria-label={`Minggu baris ${i + 1}`} placeholder="M" />
              <input className={cell} value={r.date} onChange={(e) => setRow(i, { date: e.target.value })} aria-label={`Tarikh baris ${i + 1}`} placeholder="Tarikh" />
              <input className={cell} value={r.day} onChange={(e) => setRow(i, { day: e.target.value })} aria-label={`Hari baris ${i + 1}`} placeholder="Hari" />
              <div className="grid gap-0.5">
                <select className={cell} value={r.kind ?? ''} onChange={(e) => setRow(i, { kind: (e.target.value || undefined) as TakwimRow['kind'] })} aria-label={`Jenis baris ${i + 1}`}>
                  <option value="">Hari sekolah</option>
                  <option value="weekend">Hujung minggu</option>
                  <option value="holiday">Cuti</option>
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
                    <textarea key={ci} className={cell} rows={rowsOf(r.cells[ci] ?? '')} value={r.cells[ci] ?? ''}
                      onChange={(e) => setRow(i, { cells: block.columns.map((__, k) => (k === ci ? e.target.value : r.cells[k] ?? '')) })}
                      aria-label={`${block.columns[ci]} baris ${i + 1}`} />
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
