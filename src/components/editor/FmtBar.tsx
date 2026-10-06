import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, IndentDecrease, IndentIncrease, Italic, Underline } from 'lucide-react';
import type { TextAlign, TextFmt } from '@/types/book';
import { MAX_INDENT } from '@/lib/format';

const btn = 'inline-flex h-7 w-7 items-center justify-center rounded-md border text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30';
const on = 'border-primary bg-primary/10 text-primary';
const off = 'border-border';

const aligns: { v: TextAlign; label: string; Icon: typeof AlignLeft }[] = [
  { v: 'justify', label: 'Rata kiri-kanan', Icon: AlignJustify },
  { v: 'left', label: 'Rata kiri', Icon: AlignLeft },
  { v: 'center', label: 'Tengah', Icon: AlignCenter },
  { v: 'right', label: 'Rata kanan', Icon: AlignRight },
];

interface Props {
  value: TextFmt;
  /** Penjajaran lalai blok (dipaparkan aktif bila tiada pilihan). */
  defaultAlign: TextAlign;
  onChange: (patch: Partial<TextFmt>) => void;
  noBold?: boolean;
  noIndent?: boolean;
}

/** Bar alat format teks: penjajaran, tebal, senget, garis bawah dan inden. */
export default function FmtBar({ value, defaultAlign, onChange, noBold, noIndent }: Props) {
  const cur = value.align ?? defaultAlign;
  const indent = value.indent ?? 0;
  return (
    <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Format teks">
      {aligns.map(({ v, label, Icon }) => (
        <button key={v} type="button" title={label} aria-label={label} aria-pressed={cur === v} className={`${btn} ${cur === v ? on : off}`} onClick={() => onChange({ align: v === defaultAlign ? undefined : v })}>
          <Icon size={15} />
        </button>
      ))}
      <span className="mx-1 h-5 w-px bg-border" />
      {!noBold && (
        <button type="button" title="Tebal" aria-label="Tebal" aria-pressed={!!value.bold} className={`${btn} ${value.bold ? on : off}`} onClick={() => onChange({ bold: value.bold ? undefined : true })}><Bold size={15} /></button>
      )}
      <button type="button" title="Senget" aria-label="Senget" aria-pressed={!!value.italic} className={`${btn} ${value.italic ? on : off}`} onClick={() => onChange({ italic: value.italic ? undefined : true })}><Italic size={15} /></button>
      <button type="button" title="Garis bawah" aria-label="Garis bawah" aria-pressed={!!value.underline} className={`${btn} ${value.underline ? on : off}`} onClick={() => onChange({ underline: value.underline ? undefined : true })}><Underline size={15} /></button>
      {!noIndent && (
        <>
          <span className="mx-1 h-5 w-px bg-border" />
          <button type="button" title="Kurangkan inden" aria-label="Kurangkan inden" disabled={indent <= 0} className={`${btn} ${off}`} onClick={() => onChange({ indent: indent - 1 > 0 ? indent - 1 : undefined })}><IndentDecrease size={15} /></button>
          <button type="button" title="Tambah inden" aria-label="Tambah inden" disabled={indent >= MAX_INDENT} className={`${btn} ${off}`} onClick={() => onChange({ indent: indent + 1 })}><IndentIncrease size={15} /></button>
          {indent > 0 && <span className="text-[11px] text-muted">inden {indent}</span>}
        </>
      )}
    </div>
  );
}
