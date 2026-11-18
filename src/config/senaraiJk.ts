/* Halaman jawatankuasa setiap unit:
 *  1. Senarai Jawatankuasa Unit (dijana daripada turutan halaman dalam struktur buku) — susunan halaman = susunan senarai;
 *  2. setiap halaman jawatankuasa = senarai ahli + BIDANG TUGAS dalam halaman yang sama. */
import type { Block, OutlinePart, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { BIDANG_TUGAS } from '@/config/bidangTugas';

/** [ID halaman senarai, ID bahagian, nama unit] */
export const SENARAI_JK: [string, string, string][] = [
  ['pp-senarai-jk', 'p-pentadbiran', 'Pengurusan & Pentadbiran'],
  ['k-jk-unit', 'p-kurikulum', 'Kurikulum'],
  ['hem-jk', 'p-hem', 'Hal Ehwal Murid'],
  ['kk-khas', 'p-koku', 'Kokurikulum'],
];
export const SENARAI_JK_IDS = SENARAI_JK.map(([id]) => id);

const hasTugas = (s: SectionContent) => s.blocks.some((b) => b.type === 'heading' && /TUGAS/i.test(b.text));
/** Halaman jawatankuasa: bertajuk "JAWATANKUASA …" (bukan Induk / carta) dan mengandungi senarai ahli (jawatankuasa atau jadual). */
export const isJkPage = (s: SectionContent | undefined) =>
  !!s && /^(JAWATANKUASA|PENGURUSAN PANITIA)/i.test(s.title) && !/INDUK|CARTA/i.test(s.title) && s.blocks.some((b) => b.type === 'committee' || b.type === 'table');

/** Blok Bidang Tugas lalai bagi halaman yang belum mempunyainya. */
export const tugasBlocks = (id: string): Block[] => {
  const items = BIDANG_TUGAS[id];
  return items ? [{ id: uid(), type: 'heading', text: 'BIDANG TUGAS' }, { id: uid(), type: 'list', ordered: true, items: [...items] }] : [];
};

/** Senarai jawatankuasa unit mengikut turutan halaman dalam bahagian (selepas halaman senarai itu sendiri). */
export function senaraiItems(partId: string, outline: OutlinePart[], sections: Record<string, SectionContent>): string[] {
  const part = outline.find((p) => p.id === partId);
  if (!part) return [];
  return part.topics.flatMap((t) => [t.id, ...t.children]).filter((id) => !SENARAI_JK_IDS.includes(id) && isJkPage(sections[id])).map((id) => sections[id].title);
}

export const senaraiSection = (unit: string, items: string[], base?: SectionContent): SectionContent => ({
  title: `SENARAI JAWATANKUASA UNIT ${unit.toUpperCase()}`,
  subtitle: '',
  layout: 'standard',
  updatedAt: base?.updatedAt ?? null,
  ...(base?.review ? { review: base.review } : {}),
  blocks: [
    { id: uid(), type: 'paragraph', align: 'justify', text: `Jawatankuasa di bawah Unit ${unit} disenaraikan mengikut turutan berikut. Halaman jawatankuasa dalam buku ini disusun mengikut turutan yang sama, dan setiap jawatankuasa dipaparkan bersama **Bidang Tugas** dalam halaman yang sama.` },
    { id: uid(), type: 'table', style: 'navy', numbered: true, columns: ['JAWATANKUASA'], rows: items.map((t) => [t]) },
  ],
});

/** Lengkapkan kandungan lalai: Bidang Tugas pada halaman jawatankuasa + halaman Senarai Jawatankuasa setiap unit. */
export function jawatankuasaSections(all: Record<string, SectionContent>, outline: OutlinePart[]): Record<string, SectionContent> {
  const out: Record<string, SectionContent> = {};
  for (const id of Object.keys(BIDANG_TUGAS)) {
    const s = all[id];
    if (s && !hasTugas(s)) out[id] = { ...s, blocks: [...s.blocks, ...tugasBlocks(id)] };
  }
  const merged = { ...all, ...out };
  for (const [id, partId, unit] of SENARAI_JK) out[id] = senaraiSection(unit, senaraiItems(partId, outline, merged));
  return out;
}
