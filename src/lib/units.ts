import type { Block } from '@/types/book';

/**
 * Setiap blok dipecah kepada "unit" yang boleh dipindah ke halaman seterusnya:
 * perenggan → per perenggan kecil, senarai → per item, jadual → per baris, maklumat → per baris.
 */
export const paragraphParts = (text: string) => text.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
export const listItems = (items: string[]) => items.filter((i) => i.trim() !== '');
export const kvPairs = (pairs: { key: string; value: string }[]) => pairs.filter((p) => p.key.trim() || p.value.trim());

export function unitCount(b: Block): number {
  switch (b.type) {
    case 'heading': return b.text.trim() ? 1 : 0;
    case 'paragraph': return paragraphParts(b.text).length;
    case 'list': return listItems(b.items).length;
    case 'table': return b.rows.length;
    case 'keyvalue': return kvPairs(b.pairs).length;
    case 'image': return b.src ? 1 : 0;
  }
}
