import type { OutlinePart } from '@/types/book';

export interface FlatEntry { id: string; level: 1 | 2; partId: string; parentId?: string }

/** Senarai rata semua tajuk & subtajuk mengikut susunan buku. */
export function flattenOutline(outline: OutlinePart[]): FlatEntry[] {
  const out: FlatEntry[] = [];
  for (const part of outline) {
    for (const t of part.topics) {
      out.push({ id: t.id, level: 1, partId: part.id });
      for (const c of t.children) out.push({ id: c, level: 2, partId: part.id, parentId: t.id });
    }
  }
  return out;
}

export const allIds = (outline: OutlinePart[]) => flattenOutline(outline).map((e) => e.id);

export function locate(outline: OutlinePart[], id: string): FlatEntry | undefined {
  return flattenOutline(outline).find((e) => e.id === id);
}
