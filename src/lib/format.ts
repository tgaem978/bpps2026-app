import type { CSSProperties } from 'react';
import type { TextFmt } from '@/types/book';

/** 1 aras inden = 7 mm (diskala mengikut lebar halaman melalui --mm). */
export const INDENT_MM = 7;
export const MAX_INDENT = 6;

/** Gaya CSS bagi tetapan teks. `pad` = guna padding (sel jadual) dan bukannya margin. */
export function fmtStyle(f: TextFmt, o: { pad?: boolean } = {}): CSSProperties | undefined {
  const s: CSSProperties = {};
  if (f.align) s.textAlign = f.align;
  if (f.bold) s.fontWeight = 700;
  if (f.italic) s.fontStyle = 'italic';
  if (f.underline) s.textDecoration = 'underline';
  if (f.indent && f.indent > 0) {
    const v = `calc(var(--mm) * ${INDENT_MM * Math.min(f.indent, MAX_INDENT)})`;
    if (o.pad) s.paddingLeft = v;
    else s.marginLeft = v;
  }
  return Object.keys(s).length ? s : undefined;
}
