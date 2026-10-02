import type { Block, BlockType } from '@/types/book';

export const uid = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const blockLabels: Record<BlockType, string> = {
  heading: 'Tajuk',
  paragraph: 'Perenggan',
  list: 'Senarai',
  table: 'Jadual',
  keyvalue: 'Maklumat',
  image: 'Gambar',
};

export function createBlock(type: BlockType): Block {
  const id = uid();
  switch (type) {
    case 'heading': return { id, type, text: 'Tajuk baharu' };
    case 'paragraph': return { id, type, text: '' };
    case 'list': return { id, type, ordered: false, items: [''] };
    case 'table': return { id, type, columns: ['Lajur 1', 'Lajur 2'], rows: [['', '']] };
    case 'keyvalue': return { id, type, pairs: [{ key: '', value: '' }] };
    case 'image': return { id, type, src: '', caption: '' };
  }
}

/** Blok dianggap berisi jika ada sekurang-kurangnya satu teks bukan kosong. */
export function blockHasContent(b: Block): boolean {
  switch (b.type) {
    case 'heading':
    case 'paragraph': return b.text.trim() !== '';
    case 'list': return b.items.some((i) => i.trim() !== '');
    case 'table': return b.rows.some((r) => r.some((c) => c.trim() !== ''));
    case 'keyvalue': return b.pairs.some((p) => p.value.trim() !== '');
    case 'image': return b.src !== '';
  }
}

export function readImageFile(file: File, maxBytes = 1_500_000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Fail mesti imej.'));
    if (file.size > maxBytes) return reject(new Error('Imej terlalu besar (maks 1.5 MB).'));
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Gagal membaca fail.'));
    r.readAsDataURL(file);
  });
}
