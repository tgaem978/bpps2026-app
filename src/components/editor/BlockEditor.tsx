import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, X } from 'lucide-react';
import type { Block } from '@/types/book';
import { blockLabels, readImageFile } from '@/lib/blocks';
import { useUiStore } from '@/stores/uiStore';
import { tokenHelp } from '@/lib/resolve';
import { CommitteeEditor, OrgChartEditor, StaffListEditor } from './StaffBlockEditors';
import { TakwimEditor } from './TakwimEditor';
import FmtBar from './FmtBar';
import TableEditor from './TableEditor';

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
      return (
        <div className="grid gap-1.5">
          <FmtBar value={block} defaultAlign="left" noBold noIndent onChange={(patch) => onChange({ ...block, ...patch })} />
          <input className={`${field} font-semibold`} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} aria-label="Teks tajuk" />
        </div>
      );

    case 'paragraph':
      return (
        <div className="grid gap-1.5">
          <FmtBar value={block} defaultAlign="justify" onChange={(patch) => onChange({ ...block, ...patch })} />
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
          <FmtBar value={block} defaultAlign="left" onChange={(patch) => onChange({ ...block, ...patch })} />
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

    case 'table':
      return <TableEditor block={block} onChange={onChange} />;

    case 'keyvalue':
      return (
        <div className="grid gap-2">
          <FmtBar value={block} defaultAlign="left" onChange={(patch) => onChange({ ...block, ...patch })} />
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
          <div className="flex flex-wrap items-center gap-2">
            <input className={`${field} flex-1`} placeholder="Kapsyen (pilihan)" value={block.caption} onChange={(e) => onChange({ ...block, caption: e.target.value })} aria-label="Kapsyen" />
            <label className="flex items-center gap-1 text-xs text-muted">
              Saiz
              <select className="rounded-md border border-border bg-surface px-2 py-1 text-xs" value={block.height ?? 70} onChange={(e) => onChange({ ...block, height: Number(e.target.value) })}>
                <option value={45}>Kecil</option>
                <option value={70}>Sederhana</option>
                <option value={120}>Besar</option>
                <option value={200}>Satu halaman</option>
              </select>
            </label>
          </div>
        </div>
      );
    case 'orgchart':
      return <OrgChartEditor block={block} onChange={onChange} />;
    case 'committee':
      return <CommitteeEditor block={block} onChange={onChange} />;
    case 'stafflist':
      return <StaffListEditor block={block} onChange={onChange} />;
    case 'takwim':
      return <TakwimEditor block={block} onChange={onChange} />;
  }
}
