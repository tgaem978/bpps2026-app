import type { Block, CoverContent, OutlinePart, SectionContent, SectionLayout } from '@/types/book';
import { uid } from '@/lib/blocks';
import { templateAssets } from '@/templates/bpps';
import { AKP_POSITIONS } from '@/config/defaultStaff';
import { F_NAME, F_POSITION, F_SESSION, F_TASK } from '@/types/staff';
import { partASections } from '@/config/partA';
import { partKKSections } from '@/config/partKK';
import { partBSections } from '@/config/partB';
import { partPengenalanSections } from '@/config/partPengenalan';
import { partKokuSections, ppkiChildren } from '@/config/partKoku';
import { partHemSections } from '@/config/partHEM';
import { partPpkiSections } from '@/config/partPPKI';
import { partMaklumatSections } from '@/config/partMaklumat';
import { partPentadbiranSections, pentadbiranTopics } from '@/config/partPentadbiran';
import { OVERRIDES, REMOVED_IDS, hemOrder, kokuOrder, kurikulumTopics, maklumatAmTopics, partRujukanSections, unitTopicIds } from '@/config/partRujukan';

const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });


const section = (title: string, subtitle: string, blocks: Block[], layout: SectionLayout = 'standard'): SectionContent => ({
  title, subtitle, layout, blocks, updatedAt: null,
});

export const defaultCover = (): CoverContent => ({
  image: templateAssets.cover,
  title: 'BUKU PENGURUSAN SEKOLAH',
  subtitle: 'SESI AKADEMIK 2026',
  motto: 'BERWAWASAN | TEKUN | BERSEMANGAT',
  address: 'Jalan Bandar Tasik Selatan, 57000 Kuala Lumpur',
  logo: '',
  updatedAt: null,
});

/** Struktur kandungan lalai: bahagian utama → tajuk → subtajuk (ID tajuk = ID kandungan). */
export const defaultOutline = (): OutlinePart[] => [
  {
    id: 'p-maklumat', title: 'MAKLUMAT AM', note: '{{nama_pendek}}', divider: true,
    topics: maklumatAmTopics(),
  },
  {
    id: 'p-pentadbiran', title: 'PENGURUSAN & PENTADBIRAN', note: '{{jawatan:Guru Besar}}', divider: true,
    topics: pentadbiranTopics(),
  },
  {
    id: 'p-kurikulum', title: 'PENGURUSAN KURIKULUM', note: '{{jawatan:GPK Pentadbiran}}', divider: true, tocChildren: false,
    topics: kurikulumTopics(),
  },
  { id: 'p-hem', title: 'PENGURUSAN HAL EHWAL MURID', note: '{{jawatan:GPK Hal Ehwal Murid}}', divider: true, tocChildren: false, topics: hemOrder() },
  {
    id: 'p-koku', title: 'PENGURUSAN KOKURIKULUM', note: '{{jawatan:GPK Kokurikulum}}', divider: true, tocChildren: false,
    topics: kokuOrder(),
  },
  {
    id: 'p-takwim', title: 'TAKWIM SEKOLAH 2026', note: '', divider: true,
    topics: [
      { id: 't-kalendar', children: [] },
      { id: 'takwim-01', children: ['takwim-02', 'takwim-03', 'takwim-04', 'takwim-05', 'takwim-06', 'takwim-07', 'takwim-08', 'takwim-09', 'takwim-10', 'takwim-11', 'takwim-12'] },
    ],
  },
  { id: 'p-pkhas', title: 'PENDIDIKAN KHAS (PPKI)', note: '{{jawatan:GPK Pendidikan Khas}}', divider: true, topics: [{ id: 'pendidikan-khas', children: ppkiChildren }] },
  { id: 'p-prasekolah', title: 'PRASEKOLAH', note: '', divider: true, topics: [{ id: 'prasekolah', children: [] }] },
  { id: 'p-lampiran', title: 'LAMPIRAN', note: '', divider: true, topics: [{ id: 'lampiran', children: [] }, { id: 'catatan', children: [] }] },
];

/** Kandungan contoh (BPPS 2026 SKBTS). Semua boleh disunting; nama dijana daripada Pangkalan Data Guru. */
const staffList = (filterField: string, filterValues: string[], sort: 'hierarki' | 'pentadbir' | 'abjad', withOption = true): Block => ({
  id: uid(), type: 'stafflist', title: '', showPhoto: false, filterField, filterValues, sort,
  columns: withOption ? [F_NAME, F_TASK, 'gred', 'opsyen', 'telefon'] : [F_NAME, F_TASK, 'gred', 'telefon'],
});

const baseSections = (): Record<string, SectionContent> => ({
  ...partASections(),
  ...partPentadbiranSections(),
  ...partKKSections(),
  ...partBSections(),
  ...partMaklumatSections(),
  ...partPengenalanSections(),
  ...partKokuSections(),
  ...partHemSections(),
  ...partPpkiSections(),
  ...partRujukanSections(),
  'maklumat-sekolah': section('PROFIL SEKOLAH', 'MAKLUMAT SEKOLAH', [
    kv([
      ['Nama Sekolah', '{{nama_sekolah}}'],
      ['Kod Sekolah', 'WBA0080'],
      ['Alamat', 'Jalan Bandar Tasik Selatan, 57000 Kuala Lumpur'],
      ['E-mel', 'wba0080@moe-dl.edu.my'],
      ['Sesi Persekolahan', 'Pagi dan Petang'],
      ['Bilangan Guru', '{{jumlah_guru}}'],
    ]),
  ]),
  'senarai-pagi': section('SENARAI NAMA GURU & AKP', 'GURU SESI PAGI', [staffList(F_SESSION, ['Pagi'], 'pentadbir')]),
  'senarai-petang': section('SENARAI NAMA GURU & AKP', 'GURU SESI PETANG', [staffList(F_SESSION, ['Petang'], 'pentadbir')]),
  'senarai-akp': section('SENARAI NAMA GURU & AKP', 'AKP', [staffList(F_POSITION, [...AKP_POSITIONS], 'hierarki', false)]),
  'pendidikan-khas': section('PENDIDIKAN KHAS', 'PPKI', [
    p('Program ini menyediakan pendidikan yang inklusif dan bersesuaian dengan keperluan murid berkeperluan pendidikan khas (MBPK), ke arah kemenjadian murid dan kehidupan berdikari.'),
    kv([['Penyelaras', '{{jawatan:GPK Pendidikan Khas}}'], ['Bilangan Murid', ''], ['Bilangan Kelas', '']]),
  ]),
  prasekolah: section('PRASEKOLAH', '', [
    p('Kelas prasekolah dikendalikan berdasarkan Kurikulum Standard Prasekolah Kebangsaan (KSPK).'),
    kv([['Guru Prasekolah', '{{jawatan:Guru Prasekolah}}'], ['Bilangan Kelas', ''], ['Pembantu Pengurusan Murid', '']]),
  ]),
  lampiran: section('LAMPIRAN', '', [
    ul(['Lampiran A: Borang Cuti Guru', 'Lampiran B: Borang Kebenaran Keluar Murid'], false),
  ]),
  catatan: section('CATATAN', '', [], 'notes'),
});

/** Kandungan lalai: halaman Pengenalan yang tidak perlu dipadam; tajuk/lencana mengikut susunan Maklumat Am. */
export const defaultSections = (): Record<string, SectionContent> => {
  const all = baseSections();
  for (const id of REMOVED_IDS) delete all[id];
  for (const [id, patch] of Object.entries(OVERRIDES)) if (all[id]) all[id] = { ...all[id], ...patch };
  // Kurikulum / HEM / Kokurikulum: tiada lencana kecil (lencana = nama bahagian) dan tajuk Isi Kandungan sama dengan rujukan.
  for (const id of unitTopicIds()) if (all[id]) all[id] = { ...all[id], subtitle: '' };
  return all;
};

/** Kandungan kosong untuk tajuk/subtajuk baharu. */
export const newSection = (title: string): SectionContent => section(title, '', []);
