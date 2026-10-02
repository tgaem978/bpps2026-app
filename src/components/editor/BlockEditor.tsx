import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import type { Block } from '@/types/book';
import { blockLabels, readImageFile } from '@/lib/blocks';
import { useUiStore } from '@/stores/uiStore';
import { tokenHelp } from '@/lib/resolve';
import { CommitteeEditor, OrgChartEditor, StaffListEditor } from './StaffBlockEditors';

export const field = 'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm';
const iconBtn = 'rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30 disabled:hover:bg-transparent';
const smallBtn = 'inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-2';

interface Props {
  block: Block;
  index: number;
  total: number;
  onChange: (b: Block) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}

export default function BlockEditor({ block, index, total, onChange, onRemove, onMove }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">{blockLabels[block.type]}</span>
        <div className="flex items-center">
          <button className={iconBtn} disabled={index === 0} onClick={() => onMove(-1)} aria-label="Naik"><ArrowUp size={15} /></button>
          <button className={iconBtn} disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Turun"><ArrowDown size={15} /></button>
          <button className={`${iconBtn} hover:!text-red-600`} onClick={onRemove} aria-label="Padam blok"><Trash2 size={15} /></button>
        </div>
      </div>
      <div className="p-3">
        <Body block={block} onChange={onChange} />
      </div>
    </div>
  );
}

function Body({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const toast = useUiStore((s) => s.toast);

  switch (block.type) {
    case 'heading':
      return <input className={`${field} font-semibold`} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} aria-label="Teks tajuk" />;

    case 'paragraph':
      return (
        <div className="grid gap-1.5">
          <textarea
            className={`${field} min-h-[96px] resize-y`}
            value={block.text}
            placeholder="Tulis perenggan di sini… (baris kosong = perenggan baharu)"
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            aria-label="Teks perenggan"
          />
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted">
            <span>Sisip automatik:</span>
            {tokenHelp.map((tk) => (
              <button
                key={tk.token}
                title={tk.token}
                className="rounded-full border border-border px-2 py-0.5 hover:border-primary hover:text-primary"
                onClick={() => onChange({ ...block, text: `${block.text}${block.text && !block.text.endsWith(' ') ? ' ' : ''}${tk.token}` })}
              >
                {tk.label}
              </button>
            ))}
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="grid gap-2">
          <label className="flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" checked={block.ordered} onChange={(e) => onChange({ ...block, ordered: e.target.checked })} />
            Senarai bernombor
          </label>
          {block.items.map((it, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 pt-2.5 text-right text-xs text-muted">{block.ordered ? `${i + 1}.` : '•'}</span>
              {/* textarea supaya baris kecil (a), b)…) dalam item tidak hilang; Enter = item baharu, Shift+Enter = baris baharu */}
              <textarea
                className={`${field} resize-none`}
                rows={Math.max(1, it.split('\n').length)}
                value={it}
                onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => (j === i ? e.target.value : x)) })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const items = [...block.items];
                    items.splice(i + 1, 0, '');
                    onChange({ ...block, items });
                    const row = e.currentTarget.parentElement;
                    requestAnimationFrame(() => (row?.nextElementSibling?.querySelector('textarea') as HTMLTextAreaElement | null)?.focus());
                  }
                }}
                aria-label={`Item ${i + 1}`}
              />
              <button className={iconBtn} onClick={() => onChange({ ...block, items: block.items.filter((_, j) => j !== i) })} aria-label="Buang item"><X size={15} /></button>
            </div>
          ))}
          <button className={`${smallBtn} justify-self-start`} onClick={() => onChange({ ...block, items: [...block.items, ''] })}><Plus size={13} /> Item</button>
        </div>
      );

    case 'table': {
      const setCell = (r: number, c: number, v: string) =>
        onChange({ ...block, rows: block.rows.map((row, ri) => (ri === r ? block.columns.map((_, ci) => (ci === c ? v : row[ci] ?? '')) : row)) });
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
            <span className="hidden sm:inline">· Guna **teks** untuk huruf tebal · Enter = baris baharu dalam sel</span>
          </label>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {block.columns.map((col, ci) => (
                    <th key={ci} className="border border-border bg-surface-2 p-1">
                      <div className="flex items-center gap-1">
                        <input
                          className="w-full min-w-[90px] rounded bg-transparent px-1 py-1 font-semibold"
                          value={col}
                          onChange={(e) => onChange({ ...block, columns: block.columns.map((x, j) => (j === ci ? e.target.value : x)) })}
                          aria-label={`Nama lajur ${ci + 1}`}
                        />
                        {block.columns.length > 1 && (
                          <button
                            className={iconBtn}
                            onClick={() => onChange({ ...block, columns: block.columns.filter((_, j) => j !== ci), rows: block.rows.map((r) => r.filter((_, j) => j !== ci)) })}
                            aria-label="Buang lajur"
                          ><X size={13} /></button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri}>
                    {block.columns.map((_, ci) => (
                      <td key={ci} className="border border-border p-0">
                        <textarea
                          className="block w-full min-w-[90px] resize-none bg-transparent px-2 py-1.5"
                          rows={Math.max(1, (row[ci] ?? '').split('\n').length)}
                          value={row[ci] ?? ''}
                          onChange={(e) => setCell(ri, ci, e.target.value)}
                          aria-label={`Baris ${ri + 1} lajur ${ci + 1}`}
                        />
                      </td>
                    ))}
                    <td className="pl-1">
                      <button className={iconBtn} onClick={() => onChange({ ...block, rows: block.rows.filter((_, j) => j !== ri) })} aria-label="Buang baris"><X size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-2">
            <button className={smallBtn} onClick={() => onChange({ ...block, rows: [...block.rows, block.columns.map(() => '')] })}><Plus size={13} /> Baris</button>
            <button className={smallBtn} onClick={() => onChange({ ...block, columns: [...block.columns, `Lajur ${block.columns.length + 1}`], rows: block.rows.map((r) => [...r, '']) })}><Plus size={13} /> Lajur</button>
          </div>
        </div>
      );
    }

    case 'keyvalue':
      return (
        <div className="grid gap-2">
          {block.pairs.map((pair, i) => (
            <div key={i} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] items-start gap-2">
              <input className={`${field} font-medium`} placeholder="Perkara" value={pair.key} onChange={(e) => onChange({ ...block, pairs: block.pairs.map((p, j) => (j === i ? { ...p, key: e.target.value } : p)) })} aria-label={`Perkara ${i + 1}`} />
              <textarea className={`${field} resize-y`} rows={Math.max(1, pair.value.split('\n').length)} placeholder="Butiran" value={pair.value} onChange={(e) => onChange({ ...block, pairs: block.pairs.map((p, j) => (j === i ? { ...p, value: e.target.value } : p)) })} aria-label={`Butiran ${i + 1}`} />
              <button className={iconBtn} onClick={() => onChange({ ...block, pairs: block.pairs.filter((_, j) => j !== i) })} aria-label="Buang baris"><X size={15} /></button>
            </div>
          ))}
          <button className={`${smallBtn} justify-self-start`} onClick={() => onChange({ ...block, pairs: [...block.pairs, { key: '', value: '' }] })}><Plus size={13} /> Baris</button>
        </div>
      );

    case 'image':
      return (
        <div className="grid gap-2">
          {block.src ? (
            <div className="relative">
              <img src={block.src} alt="" className="max-h-48 rounded-md border border-border" />
              <button className={`${smallBtn} mt-2`} onClick={() => onChange({ ...block, src: '' })}><Trash2 size={13} /> Buang gambar</button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center gap-1 rounded-md border-2 border-dashed border-border p-6 text-sm text-muted hover:bg-surface-2">
              <ImagePlus size={22} />
              Pilih gambar (maks 1.5 MB)
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (!f) return;
                  try { onChange({ ...block, src: await readImageFile(f) }); } catch (err) { toast((err as Error).message, 'error'); }
                }}
              />
            </label>
          )}
          <input className={field} placeholder="Kapsyen (pilihan)" value={block.caption} onChange={(e) => onChange({ ...block, caption: e.target.value })} aria-label="Kapsyen" />
        </div>
      );
    case 'orgchart':
      return <OrgChartEditor block={block} onChange={onChange} />;
    case 'committee':
      return <CommitteeEditor block={block} onChange={onChange} />;
    case 'stafflist':
      return <StaffListEditor block={block} onChange={onChange} />;
  }
}
