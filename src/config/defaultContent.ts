import type { Block, CommitteeRow, CoverContent, MemberRef, OrgLevel, OutlinePart, SectionContent, SectionLayout } from '@/types/book';
import { uid } from '@/lib/blocks';
import { templateAssets } from '@/templates/bpps';
import { ADMIN_POSITIONS, AKP_POSITIONS } from '@/config/defaultStaff';
import { F_NAME, F_POSITION, F_SESSION, F_TASK } from '@/types/staff';
import { partASections } from '@/config/partA';
import { partKKSections } from '@/config/partKK';
import { partBSections } from '@/config/partB';
import { partPengenalanSections } from '@/config/partPengenalan';
import { kokuTopics, partKokuSections, ppkiChildren } from '@/config/partKoku';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });

const pos = (...values: string[]): MemberRef[] => values.map((value) => ({ kind: 'position', value }));
const row = (role: string, members: MemberRef[]): CommitteeRow => ({ id: uid(), role, members });
const committee = (title: string, rows: CommitteeRow[]): Block => ({ id: uid(), type: 'committee', title, rows });
const chartCommittee = (title: string, focus: string, rows: CommitteeRow[]): Block => ({ id: uid(), type: 'committee', title, rows, display: 'chart', focus });
const level = (label: string, positions: string[], display: OrgLevel['display'] = 'person'): OrgLevel => ({ id: uid(), label, positions, display });

const section = (title: string, subtitle: string, blocks: Block[], layout: SectionLayout = 'standard'): SectionContent => ({
  title, subtitle, layout, blocks, updatedAt: null,
});

const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;

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
    id: 'p-maklumat', title: 'PENGENALAN', note: '', divider: true,
    topics: ['kata-aluan', 'b-rukun-negara', 'b-aku-janji', 'b-teras', 'b-ikrar', 'b-fokus', 'b-ithink', 'b-5c', 'b-aspirasi', 'b-dpd', 'b-ts25', 'b-spi', 'b-visi-kpm']
      .map((id) => ({ id, children: [] })),
  },
  {
    id: 'p-sekolah', title: 'MAKLUMAT SEKOLAH', note: '{{nama_pendek}}', divider: true,
    topics: ['b-sejarah', 'b-latar', 'maklumat-sekolah', 'b-logo', 'b-visi-sekolah', 'b-matlamat', 'b-lagu', 'b-pelan', 'b-pelan-kecemasan']
      .map((id) => ({ id, children: [] })),
  },
  {
    id: 'p-takwim', title: 'KALENDAR & TAKWIM SEKOLAH', note: '', divider: true,
    topics: [
      { id: 't-kalendar', children: [] },
      { id: 't-cuti', children: [] },
      { id: 't-akademik', children: [] },
      { id: 'takwim-01', children: ['takwim-02', 'takwim-03', 'takwim-04', 'takwim-05', 'takwim-06', 'takwim-07', 'takwim-08', 'takwim-09', 'takwim-10', 'takwim-11', 'takwim-12'] },
    ],
  },
  {
    id: 'p-pentadbiran', title: 'PENTADBIRAN SEKOLAH', note: '{{jawatan:Guru Besar}}', divider: true,
    topics: [
      { id: 'carta-organisasi', children: [] },
      { id: 'senarai-pagi', children: [] },
      { id: 'senarai-petang', children: [] },
      { id: 'senarai-akp', children: [] },
      { id: 'jk-pengurusan', children: [] },
      { id: 'panduan-am', children: [] },
      { id: 'akuan', children: [] },
      { id: 'bidang-tugas-guru', children: [] },
      { id: 'bidang-tugas-akp', children: [] },
      { id: 'guru-kelas', children: [] },
      { id: 'kumpulan-bertugas', children: ['jadual-bertugas-1', 'jadual-bertugas-2', 'jadual-bertugas-ppki'] },
    ],
  },
  {
    id: 'p-kurikulum', title: 'PENGURUSAN KURIKULUM', note: '{{jawatan:GPK Pentadbiran}}', divider: true,
    topics: [
      { id: 'k-visi', children: [] },
      { id: 'k-objektif', children: [] },
      { id: 'k-pengenalan', children: [] },
      { id: 'k-panitia', children: [] },
      { id: 'k-bidang-tugas', children: [] },
      { id: 'k-jk-induk', children: ['k-ketua-panitia', 'k-jk-unit', 'k-bilik-khas'] },
      { id: 'k-takwim', children: [] },
    ],
  },
  { id: 'p-hem', title: 'PENGURUSAN HAL EHWAL MURID', note: '{{jawatan:GPK Hal Ehwal Murid}}', divider: true, topics: [{ id: 'hem', children: ['jk-hem'] }] },
  {
    id: 'p-koku', title: 'PENGURUSAN KOKURIKULUM', note: '{{jawatan:GPK Kokurikulum}}', divider: true,
    topics: kokuTopics(),
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

export const defaultSections = (): Record<string, SectionContent> => ({
  ...partASections(),
  ...partKKSections(),
  ...partBSections(),
  ...partPengenalanSections(),
  ...partKokuSections(),
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
  'carta-organisasi': section('CARTA ORGANISASI INDUK PENTADBIRAN', 'PENTADBIRAN SEKOLAH', [
    {
      id: uid(), type: 'orgchart', title: 'CARTA ORGANISASI INDUK PENTADBIRAN SEKOLAH', session: '',
      levels: [
        level('Guru Besar', [GB]),
        level('Guru Penolong Kanan', [PKP, PKHEM, PKKO, PKPTG, PKPK]),
        level('Penyelaras', ['Guru Penyelaras Bestari', 'Guru Perpustakaan dan Media', 'Guru Data', 'Guru Bimbingan dan Kaunseling', 'Guru Prasekolah'], 'group'),
      ],
    },
  ], 'open'),
  'senarai-pagi': section('SENARAI NAMA GURU & AKP', 'GURU SESI PAGI', [staffList(F_SESSION, ['Pagi'], 'pentadbir')]),
  'senarai-petang': section('SENARAI NAMA GURU & AKP', 'GURU SESI PETANG', [staffList(F_SESSION, ['Petang'], 'pentadbir')]),
  'senarai-akp': section('SENARAI NAMA GURU & AKP', 'AKP', [staffList(F_POSITION, [...AKP_POSITIONS], 'hierarki', false)]),
  'jk-pengurusan': section('JAWATANKUASA PENGURUSAN SEKOLAH', '', [
    committee('JAWATANKUASA PENGURUSAN SEKOLAH', [
      row('Pengerusi', pos(GB)),
      row('Naib Pengerusi', pos(PKP)),
      row('Penolong Naib Pengerusi', pos(PKHEM, PKKO, PKPTG, PKPK)),
      row('Setiausaha', []),
      row('Ahli Jawatankuasa', pos('Guru Penyelaras Bestari', 'Guru Data', 'Guru Perpustakaan dan Media')),
    ]),
  ]),
  hem: section('PENGURUSAN HAL EHWAL MURID', '', [
    h('Fokus Utama'),
    ul(['Disiplin murid', 'Kebajikan dan biasiswa', 'Kesihatan dan keselamatan', 'Bimbingan dan kaunseling']),
    h('Peraturan Am Murid'),
    ul(['Hadir ke sekolah sebelum 7.30 pagi.', 'Memakai pakaian seragam yang lengkap dan kemas.', 'Menghormati guru dan rakan.'], true),
  ]),
  'jk-hem': section('JAWATANKUASA INDUK HEM', '', [
    chartCommittee('JAWATANKUASA INDUK UNIT HAL EHWAL MURID', PKHEM, [
      row('Pengerusi', pos(GB)),
      row('Naib Pengerusi', pos(PKP, PKHEM, PKKO, PKPTG, PKPK)),
      row('Setiausaha HEM', []),
      row('Unit Bimbingan dan Kaunseling', pos('Guru Bimbingan dan Kaunseling')),
    ]),
  ]),
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

/** Kandungan kosong untuk tajuk/subtajuk baharu. */
export const newSection = (title: string): SectionContent => section(title, '', []);
