/* Halaman Pengenalan (daripada PDF "A-PENGENALAN (MS 4-17)") dikekalkan sebagai IMEJ seperti asal.
 * Header & footer lama pada imej telah dibuang (public/pengenalan/isi-XX.jpg = kandungan sahaja);
 * header, footer dan nombor halaman dijana oleh sistem (ContentFrame). */
import type { SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

const BASE = import.meta.env.BASE_URL;
const SUB = 'PENGENALAN';
const pageImg = (title: string, file: string): SectionContent => ({
  title, subtitle: SUB, layout: 'standard', updatedAt: null,
  blocks: [{ id: uid(), type: 'image', src: `${BASE}pengenalan/${file}`, caption: '', frameFill: true }],
});

export const partPengenalanSections = (): Record<string, SectionContent> => ({
  'b-rukun-negara': pageImg('RUKUN NEGARA & FALSAFAH PENDIDIKAN KEBANGSAAN', 'isi-03.jpg'),
  'b-aku-janji': pageImg('SURAT AKU JANJI', 'isi-04.jpg'),
  'b-ikrar': pageImg('IKRAR PERKHIDMATAN AWAM & IKRAR INTEGRITI', 'isi-06.jpg'),
  'b-spi': pageImg('SURAT PEKELILING IKHTISAS', 'isi-13.jpg'),
  'b-visi-kpm': pageImg('VISI DAN MISI KPM', 'isi-14.jpg'),
});
