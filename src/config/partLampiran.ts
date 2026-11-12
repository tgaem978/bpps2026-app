/* Bahagian LAMPIRAN - borang-borang am sekolah sebagai halaman boleh cetak (jadual berbingkai dengan ruang menulis).
 * Kandungan borang ialah templat am dan boleh disunting / ditambah dalam penjana. */
import type { Block, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
/** Borang: lajur PERKARA + ruang BUTIRAN kosong (tinggi baris tetap supaya ada ruang menulis). */
const borang = (items: string[], rowMm = 9): Block => ({
  id: uid(), type: 'table', style: 'navy', numbered: false, columns: ['PERKARA', 'BUTIRAN'],
  rows: items.map((x) => [x, '']), colWidths: [36, 64], rowHeights: items.map(() => rowMm), firstCol: 'gold',
});
const log = (columns: string[], rows: number, widths: number[]): Block => ({
  id: uid(), type: 'table', style: 'navy', numbered: true, columns,
  rows: Array.from({ length: rows }, () => columns.map(() => '')), colWidths: widths, rowHeights: Array.from({ length: rows }, () => 9),
});
const sec = (title: string, blocks: Block[], subtitle = 'LAMPIRAN'): SectionContent => ({ title, subtitle, layout: 'standard', blocks, updatedAt: null });

export const LAMPIRAN = [
  ['lamp-a', 'LAMPIRAN A', 'BORANG PERMOHONAN CUTI GURU'],
  ['lamp-b', 'LAMPIRAN B', 'BORANG KEBENARAN KELUAR MURID'],
  ['lamp-c', 'LAMPIRAN C', 'BUKU REKOD PERGERAKAN GURU KELUAR KAWASAN SEKOLAH'],
] as const;

export const lampiranTopics = (): OutlineTopic[] => [
  { id: 'lampiran', children: LAMPIRAN.map(([id]) => id) },
  { id: 'catatan', children: [] },
];

export const partLampiranSections = (): Record<string, SectionContent> => ({
  lampiran: sec('SENARAI LAMPIRAN', [
    p('Borang-borang berikut boleh disalin atau dicetak daripada buku ini untuk kegunaan warga {{nama_pendek}}. Borang asal juga boleh diperoleh daripada pejabat sekolah.'),
    ul(LAMPIRAN.map(([, kod, tajuk]) => `${kod}: ${tajuk}`)),
  ], ''),
  'lamp-a': sec('BORANG PERMOHONAN CUTI GURU', [
    h('BAHAGIAN A: MAKLUMAT PEMOHON'),
    borang(['Nama', 'Jawatan / Gred', 'Jenis Cuti (CRK / Cuti Sakit / Lain-lain)', 'Tarikh Cuti (Dari - Hingga)', 'Bilangan Hari', 'Sebab / Tujuan', 'Alamat & No. Telefon Semasa Bercuti', 'Kelas / Tugas yang Perlu Diganti', 'Tandatangan Pemohon & Tarikh']),
    h('BAHAGIAN B: KEPUTUSAN PENTADBIR'),
    borang(['Diluluskan / Tidak Diluluskan', 'Ulasan', 'Tandatangan & Cop Guru Besar', 'Tarikh']),
  ]),
  'lamp-b': sec('BORANG KEBENARAN KELUAR MURID', [
    h('BAHAGIAN A: MAKLUMAT MURID'),
    borang(['Nama Murid', 'Kelas', 'Tarikh', 'Masa Keluar', 'Masa Kembali (jika berkenaan)', 'Sebab Keluar']),
    h('BAHAGIAN B: MAKLUMAT PENJAGA / PENGAMBIL'),
    borang(['Nama Penjaga / Pengambil', 'No. Kad Pengenalan', 'Hubungan dengan Murid', 'No. Telefon', 'Tandatangan Penjaga / Pengambil']),
    h('BAHAGIAN C: PENGESAHAN SEKOLAH'),
    borang(['Guru Kelas / Guru Bertugas (Nama & Tandatangan)', 'Pengesahan Pentadbir (Nama & Tandatangan)']),
  ]),
  'lamp-c': sec('BUKU REKOD PERGERAKAN GURU KELUAR KAWASAN SEKOLAH', [
    p('Guru yang perlu keluar dari kawasan sekolah semasa waktu persekolahan hendaklah merekodkan pergerakan dan mendapatkan kebenaran pentadbir terlebih dahulu.'),
    log(['TARIKH', 'NAMA GURU', 'MASA KELUAR', 'MASA MASUK', 'TUJUAN', 'TANDATANGAN', 'PENGESAHAN PENTADBIR'], 14, [12, 22, 10, 10, 18, 13, 15]),
  ]),
});
