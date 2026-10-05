/* Halaman Pengenalan daripada PDF "A-PENGENALAN (MS 4-17)": dipaparkan sebagai halaman penuh supaya reka bentuk asal (jadual, infografik) kekal. */
import type { SectionContent } from '@/types/book';

const BASE = import.meta.env.BASE_URL;

const page = (title: string, no: string): SectionContent => ({
  title,
  subtitle: 'PENGENALAN',
  layout: 'standard',
  blocks: [{ id: `pengenalan-${no}`, type: 'image', src: `${BASE}pengenalan/pg-${no}.jpg`, caption: '', fullPage: true }],
  updatedAt: null,
});

export const partPengenalanSections = (): Record<string, SectionContent> => ({
  'b-rukun-negara': page('RUKUN NEGARA & FALSAFAH PENDIDIKAN KEBANGSAAN', '03'),
  'b-aku-janji': page('SURAT AKU JANJI', '04'),
  'b-teras': page('TERAS PERKHIDMATAN AWAM & BUDAYA KERJA SEKOLAH', '05'),
  'b-ikrar': page('IKRAR PERKHIDMATAN AWAM & IKRAR INTEGRITI', '06'),
  'b-fokus': page('FOKUS PENGURUSAN PENDIDIKAN', '07'),
  'b-ithink': page('KBAT: PETA PEMIKIRAN i-THINK', '08'),
  'b-5c': page('PAK-21: KEMAHIRAN 5C', '09'),
  'b-aspirasi': page('ASPIRASI PENDIDIKAN', '10'),
  'b-dpd': page('DASAR PENDIDIKAN DIGITAL', '11'),
  'b-ts25': page('PROGRAM TRANSFORMASI SEKOLAH 2025 (TS25)', '12'),
  'b-spi': page('SURAT PEKELILING IKHTISAS', '13'),
  'b-visi-kpm': page('VISI DAN MISI KPM', '14'),
});
