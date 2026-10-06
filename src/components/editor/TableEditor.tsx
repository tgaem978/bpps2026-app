import { useRef, type PointerEvent as RPE } from 'react';
import { GripHorizontal, Minus, Plus, X } from 'lucide-react';
import type { TableBlock, TextAlign } from '@/types/book';
import { columnShares } from '@/components/book/BlockView';
import FmtBar from './FmtBar';

const iconBtn = 'rounded-md p-1 text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30 disabled:hover:bg-transparent';
const smallBtn = 'inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-2';
const MIN_W = 6; // peratus
const DATA = 0.88; // bahagian lebar jadual untuk lajur data (selebihnya lajur tindakan)
const PAGE_MM = 170; // anggaran lebar kandungan halaman (mm) untuk menukar piksel kepada mm
const r1 = (n: number) => Math.round(n * 10) / 10;
const alignOrder: (TextAlign | undefined)[] = [undefined, 'left', 'center', 'right', 'justify'];
const alignLabel: Record<string, string> = { auto: 'auto', left: 'kiri', center: 'tengah', right: 'kanan', justify: 'k-k' };

/** Seret pada elemen: panggil onMove dengan anjakan (px) sejak mula. */
function startDrag(e: RPE, onMove: (dx: number, dy: number) => void) {
  e.preventDefault();
  e.stopPropagation();
  const el = e.currentTarget as HTMLElement;
  el.setPointerCapture(e.pointerId);
  const sx = e.clientX;
  const sy = e.clientY;
  const move = (ev: PointerEvent) => onMove(ev.clientX - sx, ev.clientY - sy);
  const up = () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}

export default function TableEditor({ block, onChange }: { block: TableBlock; onChange: (b: TableBlock) => void }) {
  const tableRef = useRef<HTMLTableElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const n = block.columns.length;

  /** Lebar lajur semasa (peratus, jumlah 100). */
  const widths = (): number[] => {
    if (block.colWidths && block.colWidths.length === n) return block.colWidths;
    const sh = columnShares(block.columns, block.rows);
    const sum = sh.reduce((a, b) => a + b, 0) || 1;
    return sh.map((v) => r1((v / sum) * 100));
  };
  const setWidths = (w: number[]) => onChange({ ...block, colWidths: w.map(r1) });

  /** Pindahkan `d` peratus antara lajur i dan jirannya (j). */
  const transfer = (base: number[], i: number, j: number, d: number) => {
    const pair = base[i] + base[j];
    const a = Math.max(MIN_W, Math.min(pair - MIN_W, base[i] + d));
    const next = [...base];
    next[i] = a;
    next[j] = pair - a;
    return next;
  };
  const nudge = (ci: number, d: number) => {
    const j = ci < n - 1 ? ci + 1 : ci - 1;
    if (j < 0) return;
    setWidths(transfer(widths(), ci, j, d));
  };
  const dragCol = (ci: number, e: RPE) => {
    const base = widths();
    const tw = (tableRef.current?.getBoundingClientRect().width ?? 400) * DATA;
    startDrag(e, (dx) => setWidths(transfer(base, ci, ci + 1, (dx / tw) * 100)));
  };

  const heights = () => block.rows.map((_, i) => block.rowHeights?.[i] ?? 0);
  const setRowH = (ri: number, mm: number) => {
    const h = heights();
    h[ri] = mm <= 0 ? 0 : Math.min(120, r1(mm));
    onChange({ ...block, rowHeights: h.some((v) => v > 0) ? h : undefined });
  };
  const pxPerMm = () => (tableRef.current?.getBoundingClientRect().width ?? 460) / PAGE_MM;
  const currentMm = (ri: number) => block.rowHeights?.[ri] || r1((rowRefs.current[ri]?.getBoundingClientRect().height ?? 30) / pxPerMm());
  const dragRow = (ri: number, e: RPE) => {
    const base = currentMm(ri);
    const k = pxPerMm();
    startDrag(e, (_dx, dy) => setRowH(ri, base + dy / k));
  };

  const setCell = (r: number, c: number, v: string) =>
    onChange({ ...block, rows: block.rows.map((row, ri) => (ri === r ? block.columns.map((_, ci) => (ci === c ? v : row[ci] ?? '')) : row)) });
  const cycleAlign = (ci: number) => {
    const cur = block.colAlign?.[ci];
    const nxt = alignOrder[(alignOrder.indexOf(cur) + 1) % alignOrder.length];
    const arr = block.columns.map((_, i) => (i === ci ? nxt : block.colAlign?.[i]));
    onChange({ ...block, colAlign: arr.some(Boolean) ? arr : undefined });
  };
  const w = widths();
  const resized = !!block.colWidths || !!block.rowHeights;

  return (
    <div className="grid gap-2">
      <label className="flex flex-wrap items-center gap-2 text-xs text-muted">
        Gaya jadual
        <select className="rounded-md border border-border bg-surface px-2 py-1 text-xs" value={block.style ?? 'navy'} onChange={(e) => onChange({ ...block, style: e.target.value as 'navy' | 'gold' })}>
          <option value="navy">Biru gelap + lajur BIL emas</option>
          <option value="gold">Kepala emas</option>
        </select>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={block.numbered ?? block.style !== 'gold'} onChange={(e) => onChange({ ...block, numbered: e.target.checked })} /> Lajur BIL
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={block.firstCol === 'gold'} onChange={(e) => onChange({ ...block, firstCol: e.target.checked ? 'gold' : undefined })} /> Lajur pertama emas
        </label>
      </label>
      <FmtBar value={block} defaultAlign="center" onChange={(patch) => onChange({ ...block, ...patch })} />
      <p className="text-[11px] text-muted">
        Seret garis pemisah antara tajuk lajur untuk melaraskan lebar, atau guna butang +/−. Seret pemegang di hujung baris (⋮⋮) atau guna +/− untuk tinggi baris. Format di atas untuk teks dalam sel; butang pada tajuk lajur menetapkan penjajaran lajur. Guna **teks** untuk huruf tebal.
      </p>
      <div className="overflow-x-auto" style={{ containerType: 'inline-size' }}>
        <table ref={tableRef} className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            {w.map((v, i) => <col key={i} style={{ width: `${(v * DATA).toFixed(2)}%` }} />)}
            <col style={{ width: `${((1 - DATA) * 100).toFixed(0)}%` }} />
          </colgroup>
          <thead>
            <tr>
              {block.columns.map((col, ci) => (
                <th key={ci} className="relative border border-border bg-surface-2 p-1 align-top">
                  <input
                    className="w-full rounded bg-transparent px-1 py-1 font-semibold"
                    value={col}
                    onChange={(e) => onChange({ ...block, columns: block.columns.map((x, j) => (j === ci ? e.target.value : x)) })}
                    aria-label={`Nama lajur ${ci + 1}`}
                  />
                  <div className="mt-0.5 flex flex-wrap items-center justify-between gap-0.5">
                    <div className="flex items-center">
                      <button className={iconBtn} title="Kecilkan lajur" aria-label="Kecilkan lajur" onClick={() => nudge(ci, -2)}><Minus size={12} /></button>
                      <span className="min-w-[2.2rem] text-center text-[10px] font-normal text-muted">{Math.round(w[ci])}%</span>
                      <button className={iconBtn} title="Besarkan lajur" aria-label="Besarkan lajur" onClick={() => nudge(ci, 2)}><Plus size={12} /></button>
                    </div>
                    <button className="rounded border border-border px-1 text-[10px] font-normal text-muted hover:bg-surface" title="Penjajaran lajur (tekan untuk tukar)" onClick={() => cycleAlign(ci)}>
                      {alignLabel[block.colAlign?.[ci] ?? 'auto']}
                    </button>
                    {n > 1 && (
                      <button
                        className={iconBtn}
                        onClick={() => onChange({ ...block, columns: block.columns.filter((_, j) => j !== ci), rows: block.rows.map((r) => r.filter((_, j) => j !== ci)), colWidths: undefined, colAlign: block.colAlign?.filter((_, j) => j !== ci) })}
                        aria-label="Buang lajur"
                      ><X size={12} /></button>
                    )}
                  </div>
                  {ci < n - 1 && (
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Seret untuk laras lebar lajur ${ci + 1}`}
                      className="absolute -right-1 top-0 z-10 h-full w-2.5 cursor-col-resize touch-none rounded bg-primary/0 hover:bg-primary/40 active:bg-primary/60"
                      onPointerDown={(e) => dragCol(ci, e)}
                    />
                  )}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} ref={(el) => { rowRefs.current[ri] = el; }} style={block.rowHeights?.[ri] ? { height: `calc(${block.rowHeights[ri]} * 100cqw / ${PAGE_MM})` } : undefined}>
                {block.columns.map((_, ci) => (
                  <td key={ci} className="border border-border p-0 align-top">
                    <textarea
                      className="block h-full w-full resize-none bg-transparent px-2 py-1.5"
                      rows={Math.max(1, (row[ci] ?? '').split('\n').length)}
                      value={row[ci] ?? ''}
                      onChange={(e) => setCell(ri, ci, e.target.value)}
                      aria-label={`Baris ${ri + 1} lajur ${ci + 1}`}
                    />
                  </td>
                ))}
                <td className="pl-1 align-top">
                  <div className="flex flex-col items-center">
                    <button className={iconBtn} onClick={() => onChange({ ...block, rows: block.rows.filter((_, j) => j !== ri), rowHeights: block.rowHeights?.filter((_, j) => j !== ri) })} aria-label="Buang baris"><X size={13} /></button>
                    <button className={iconBtn} title="Tinggikan baris" aria-label="Tinggikan baris" onClick={() => setRowH(ri, currentMm(ri) + 2)}><Plus size={12} /></button>
                    <button className={iconBtn} title="Rendahkan baris" aria-label="Rendahkan baris" onClick={() => setRowH(ri, currentMm(ri) - 2)}><Minus size={12} /></button>
                    <span
                      role="separator"
                      aria-orientation="horizontal"
                      aria-label={`Seret untuk laras tinggi baris ${ri + 1}`}
                      title="Seret ke atas/bawah untuk tinggi baris"
                      className="cursor-row-resize touch-none rounded p-1 text-muted hover:bg-surface-2"
                      onPointerDown={(e) => dragRow(ri, e)}
                    ><GripHorizontal size={14} /></span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={smallBtn} onClick={() => onChange({ ...block, rows: [...block.rows, block.columns.map(() => '')] })}><Plus size={13} /> Baris</button>
        <button className={smallBtn} onClick={() => onChange({ ...block, columns: [...block.columns, `Lajur ${n + 1}`], rows: block.rows.map((r) => [...r, '']), colWidths: undefined, colAlign: block.colAlign ? [...block.colAlign, undefined] : undefined })}><Plus size={13} /> Lajur</button>
        {resized && <button className={smallBtn} onClick={() => onChange({ ...block, colWidths: undefined, rowHeights: undefined })}>Set semula saiz (auto)</button>}
      </div>
    </div>
  );
}
