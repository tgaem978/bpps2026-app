import type { AnyBlock } from '@/types/book';
import { staffRows, type BookCtx } from '@/lib/resolve';

/**
 * Setiap blok dipecah kepada "unit" yang boleh dipindah ke halaman seterusnya:
 * perenggan → per perenggan kecil, senarai → per item, jadual → per baris, jawatankuasa → per peranan.
 */
export const paragraphParts = (text: string) => text.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
export const listItems = (items: string[]) => items.filter((i) => i.trim() !== '');
export const kvPairs = (pairs: { key: string; value: string }[]) => pairs.filter((p) => p.key.trim() || p.value.trim());

export function unitCount(b: AnyBlock, ctx: BookCtx): number {
  switch (b.type) {
    case 'heading': return b.text.trim() ? 1 : 0;
    case 'paragraph': return paragraphParts(b.text).length;
    case 'list': return listItems(b.items).length;
    case 'table': return b.rows.length;
    case 'keyvalue': return kvPairs(b.pairs).length;
    case 'image': return b.src ? 1 : 0;
    case 'orgchart': return b.levels.length ? 1 : 0;
    case 'committee': return b.rows.length;
    case 'stafflist': return staffRows(ctx, b).length || 1;
    case 'tocrows': return b.rows.length;
  }
}
