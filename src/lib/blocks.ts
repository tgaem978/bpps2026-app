import type { Block, BlockType } from '@/types/book';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { F_NAME, F_POSITION, F_SESSION } from '@/types/staff';

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
  orgchart: 'Carta Organisasi',
  committee: 'Jawatankuasa',
  stafflist: 'Senarai Guru',
  takwim: 'Takwim Bulanan',
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
    case 'orgchart': return {
      id, type, title: 'CARTA ORGANISASI', session: '',
      levels: [
        { id: uid(), label: 'Guru Besar', positions: ['Guru Besar'], display: 'person' },
        { id: uid(), label: 'Penolong Kanan', positions: ADMIN_POSITIONS.slice(1), display: 'person' },
      ],
    };
    case 'committee': return {
      id, type, title: 'JAWATANKUASA',
      rows: [
        { id: uid(), role: 'Pengerusi', members: [{ kind: 'position', value: 'Guru Besar' }] },
        { id: uid(), role: 'Naib Pengerusi', members: [{ kind: 'position', value: 'GPK Pentadbiran' }] },
        { id: uid(), role: 'Setiausaha', members: [] },
        { id: uid(), role: 'Ahli Jawatankuasa', members: [] },
      ],
    };
    case 'stafflist': return {
      id, type, title: '', columns: [F_NAME, F_POSITION, F_SESSION], showPhoto: false, filterField: '', filterValues: [],
    };
    case 'takwim': return {
      id, type, title: 'BULAN', columns: ['PENTADBIRAN', 'KURIKULUM', 'HAL EHWAL MURID', 'KOKURIKULUM', 'PPKI'],
      rows: [{ week: '1', date: '', day: 'Isnin', cells: ['', '', '', '', ''] }],
    };
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
    case 'orgchart': return b.levels.some((l) => l.positions.length > 0);
    case 'committee': return b.rows.some((r) => r.members.length > 0);
    case 'stafflist': return b.columns.length > 0;
    case 'takwim': return b.rows.some((r) => (r.span ?? '').trim() !== '' || r.cells.some((c) => c.trim() !== ''));
  }
}

export function readImageFile(file: File, maxBytes = 1_500_000): Promise<string> {
  const mb = (maxBytes / 1_000_000).toFixed(1);
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Fail mesti imej.'));
    if (file.size > maxBytes) return reject(new Error(`Imej terlalu besar (maks ${mb} MB).`));
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('Gagal membaca fail.'));
    r.readAsDataURL(file);
  });
}

/**
 * Potong & kecilkan gambar kepada potret (lalai 4:5, 240x300) sebagai JPEG ringan,
 * supaya pangkalan data guru muat dalam storan pelayar.
 */
export function resizeImage(file: File, w = 240, h = 300, quality = 0.86): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Fail mesti imej.'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.max(w / img.width, h / img.height);
      const sw = w / scale;
      const sh = h / scale;
      const sx = (img.width - sw) / 2;
      const sy = Math.max(0, (img.height - sh) * 0.2); // kekalkan kepala dekat atas
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) return reject(new Error('Pelayar tidak menyokong kanvas.'));
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal membaca gambar.'));
    };
    img.src = url;
  });
}
