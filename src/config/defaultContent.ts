import type { Block, CommitteeRow, CoverContent, MemberRef, OrgLevel, OutlinePart, SectionContent, SectionLayout } from '@/types/book';
import { uid } from '@/lib/blocks';
import { templateAssets } from '@/templates/bpps';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { F_NAME, F_POSITION, F_SESSION } from '@/types/staff';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const tbl = (columns: string[], rows: string[][]): Block => ({ id: uid(), type: 'table', columns, rows });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });

const pos = (...values: string[]): MemberRef[] => values.map((value) => ({ kind: 'position', value }));
const txt = (value: string): MemberRef[] => [{ kind: 'text', value }];
const row = (role: string, members: MemberRef[]): CommitteeRow => ({ id: uid(), role, members });
const committee = (title: string, rows: CommitteeRow[]): Block => ({ id: uid(), type: 'committee', title, rows });
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
  { id: 'p-maklumat', title: 'MAKLUMAT AM', note: '', divider: true, topics: [{ id: 'kata-aluan', children: [] }, { id: 'maklumat-sekolah', children: [] }] },
  {
    id: 'p-pentadbiran', title: 'PENTADBIRAN SEKOLAH', note: '{{jawatan:Guru Besar}}', divider: true,
    topics: [
      { id: 'carta-organisasi', children: [] },
      { id: 'pentadbiran', children: [] },
      { id: 'senarai-guru', children: [] },
      { id: 'jk-pengurusan', children: [] },
    ],
  },
  { id: 'p-kurikulum', title: 'PENGURUSAN KURIKULUM', note: '{{jawatan:GPK Pentadbiran}}', divider: true, topics: [{ id: 'kurikulum', children: ['jk-kurikulum'] }] },
  { id: 'p-hem', title: 'PENGURUSAN HAL EHWAL MURID', note: '{{jawatan:GPK Hal Ehwal Murid}}', divider: true, topics: [{ id: 'hem', children: ['jk-hem'] }] },
  { id: 'p-koku', title: 'PENGURUSAN KOKURIKULUM', note: '{{jawatan:GPK Kokurikulum}}', divider: true, topics: [{ id: 'kokurikulum', children: ['jk-koku'] }] },
  { id: 'p-pkhas', title: 'PENDIDIKAN KHAS (PPKI)', note: '{{jawatan:GPK Pendidikan Khas}}', divider: true, topics: [{ id: 'pendidikan-khas', children: [] }] },
  { id: 'p-prasekolah', title: 'PRASEKOLAH', note: '', divider: true, topics: [{ id: 'prasekolah', children: [] }] },
  { id: 'p-takwim', title: 'KALENDAR & TAKWIM SEKOLAH', note: '', divider: true, topics: [{ id: 'takwim', children: [] }] },
  { id: 'p-lampiran', title: 'LAMPIRAN', note: '', divider: true, topics: [{ id: 'lampiran', children: [] }, { id: 'catatan', children: [] }] },
];

/** Kandungan contoh (BPPS 2026 SKBTS). Semua boleh disunting; nama dijana daripada Pangkalan Data Guru. */
export const defaultSections = (): Record<string, SectionContent> => ({
  'kata-aluan': section('KATA ALUAN', 'GURU BESAR', [
    p('Assalamualaikum Warahmatullahi Wabarakatuh dan Salam Sejahtera.'),
    p('Alhamdulillah, syukur ke hadrat Ilahi kerana dengan limpah dan izin-Nya, kita dapat menyempurnakan Buku Panduan Pengurusan Sekolah (BPPS) Tahun {{tahun}} iaitu BPPS {{nama_sekolah}}. Sekalung tahniah saya ucapkan kepada Jawatankuasa Buku Pengurusan yang telah bertungkus-lumus memastikan dokumen penting ini dapat disiapkan sebagai panduan rasmi kita bersama.'),
    p('Buku Pengurusan ini bukan sekadar naskhah pentadbiran, tetapi ia adalah kompas yang menterjemahkan hala tuju, visi, dan misi sekolah selaras dengan aspirasi Kementerian Pendidikan Malaysia (KPM). Fokus kita pada tahun ini kekal memacu kemenjadian murid melalui pendekatan "Anak yang Baik lagi Cerdik" (ABC) serta penerapan nilai Karamah Insaniah.'),
    p('Sebagai nakhoda sekolah ini, saya menyeru seluruh warga pendidik dan anggota kumpulan pelaksana (AKP) untuk terus bergerak sederap dalam satu pasukan yang utuh. Marilah kita jadikan buku ini sebagai rujukan utama dalam melaksanakan amanah yang dipertanggungjawabkan dengan penuh integriti, dedikasi, dan profesionalisme.'),
    p('"BERKHIDMAT UNTUK NEGARA"'),
    kv([['Nama', '{{jawatan:Guru Besar}}'], ['Jawatan', 'Guru Besar, {{nama_sekolah}}']]),
  ]),
  'maklumat-sekolah': section('MAKLUMAT SEKOLAH', '', [
    h('Profil Sekolah'),
    kv([
      ['Nama Sekolah', '{{nama_sekolah}}'],
      ['Kod Sekolah', 'WBA0080'],
      ['Alamat', 'Jalan Bandar Tasik Selatan, 57000 Kuala Lumpur'],
      ['E-mel', 'wba0080@moe-dl.edu.my'],
      ['Sesi Persekolahan', 'Pagi dan Petang'],
      ['Bilangan Guru', '{{jumlah_guru}}'],
    ]),
    h('Visi'),
    p('Pendidikan Berkualiti Insan Terdidik Negara Sejahtera.'),
    h('Misi'),
    p('Melestarikan Sistem Pendidikan yang Berkualiti untuk Membangunkan Potensi Individu bagi Memenuhi Aspirasi Negara.'),
    h('Piagam Pelanggan'),
    ul(['Memberi layanan mesra dan profesional.', 'Menyediakan persekitaran pembelajaran yang selamat dan kondusif.']),
  ]),
  'carta-organisasi': section('CARTA ORGANISASI INDUK', '', [
    {
      id: uid(), type: 'orgchart', title: 'CARTA ORGANISASI INDUK PENGURUSAN SEKOLAH', session: '',
      levels: [
        level('Guru Besar', [GB]),
        level('Guru Penolong Kanan', [PKP, PKHEM, PKKO, PKPTG, PKPK]),
        level('Penyelaras', ['Guru Penyelaras Bestari', 'Guru Perpustakaan dan Media', 'Guru Data', 'Guru Bimbingan dan Kaunseling', 'Guru Prasekolah'], 'group'),
      ],
    },
  ], 'open'),
  pentadbiran: section('BARISAN PENTADBIR', '', [
    { id: uid(), type: 'stafflist', title: '', columns: [F_NAME, F_POSITION, F_SESSION, 'telefon'], showPhoto: true, filterField: F_POSITION, filterValues: [...ADMIN_POSITIONS] },
  ]),
  'senarai-guru': section('SENARAI GURU', '', [
    { id: uid(), type: 'stafflist', title: '', columns: [F_NAME, F_POSITION, F_SESSION, 'opsyen'], showPhoto: false, filterField: '', filterValues: [] },
  ]),
  'jk-pengurusan': section('JAWATANKUASA PENGURUSAN SEKOLAH', '', [
    committee('JAWATANKUASA PENGURUSAN SEKOLAH', [
      row('Pengerusi', pos(GB)),
      row('Naib Pengerusi', pos(PKP)),
      row('Penolong Naib Pengerusi', pos(PKHEM, PKKO, PKPTG, PKPK)),
      row('Setiausaha', []),
      row('Ahli Jawatankuasa', pos('Guru Penyelaras Bestari', 'Guru Data', 'Guru Perpustakaan dan Media')),
    ]),
  ]),
  kurikulum: section('PENGURUSAN KURIKULUM', '', [
    h('Objektif'),
    ul(['Meningkatkan pencapaian akademik murid.', 'Memastikan PdP berkualiti mengikut DSKP.', 'Memperkasakan Pentaksiran Bilik Darjah (PBD) dan PLC.'], true),
    h('Ketua Panitia'),
    tbl(['Mata Pelajaran', 'Ketua Panitia'], [['Bahasa Melayu', ''], ['Bahasa Inggeris', ''], ['Matematik', ''], ['Sains', '']]),
  ]),
  'jk-kurikulum': section('JAWATANKUASA KURIKULUM', '', [
    committee('JAWATANKUASA KURIKULUM SEKOLAH', [
      row('Pengerusi', pos(GB)),
      row('Naib Pengerusi', pos(PKP)),
      row('Setiausaha', []),
      row('Ahli Jawatankuasa', txt('Semua Ketua Panitia Mata Pelajaran')),
    ]),
  ]),
  hem: section('PENGURUSAN HAL EHWAL MURID', '', [
    h('Fokus Utama'),
    ul(['Disiplin murid', 'Kebajikan dan biasiswa', 'Kesihatan dan keselamatan', 'Bimbingan dan kaunseling']),
    h('Peraturan Am Murid'),
    ul(['Hadir ke sekolah sebelum 7.30 pagi.', 'Memakai pakaian seragam yang lengkap dan kemas.', 'Menghormati guru dan rakan.'], true),
  ]),
  'jk-hem': section('JAWATANKUASA INDUK HEM', '', [
    committee('JAWATANKUASA INDUK UNIT HAL EHWAL MURID', [
      row('Pengerusi', pos(GB)),
      row('Timbalan Pengerusi', pos(PKHEM)),
      row('Naib Pengerusi', pos(PKP, PKKO, PKPTG, PKPK)),
      row('Setiausaha HEM', []),
      row('Unit Bimbingan dan Kaunseling', pos('Guru Bimbingan dan Kaunseling')),
    ]),
  ]),
  kokurikulum: section('PENGURUSAN KOKURIKULUM', '', [
    tbl(['Kategori', 'Aktiviti', 'Guru Penasihat'], [
      ['Unit Beruniform', 'Pengakap', ''],
      ['Kelab & Persatuan', 'Kelab Sains', ''],
      ['Sukan & Permainan', 'Bola Sepak', ''],
    ]),
    p('Hari kokurikulum: setiap Rabu, 2.00 petang hingga 3.30 petang.'),
  ]),
  'jk-koku': section('JAWATANKUASA KOKURIKULUM', '', [
    committee('JAWATANKUASA INDUK KOKURIKULUM', [
      row('Pengerusi', pos(GB)),
      row('Timbalan Pengerusi', pos(PKKO)),
      row('Naib Pengerusi', pos(PKP, PKHEM, PKPTG, PKPK)),
      row('Setiausaha', []),
      row('Ahli Jawatankuasa', txt('Semua Guru Penasihat Unit Beruniform, Kelab & Persatuan, Sukan & Permainan')),
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
  takwim: section('KALENDAR & TAKWIM SEKOLAH', '', [
    tbl(['Tarikh', 'Aktiviti', 'Unit'], [
      ['12 Jan 2026', 'Hari Pertama Persekolahan', 'Pentadbiran'],
      ['', 'Mesyuarat Agung PIBG', 'Pentadbiran'],
      ['', 'Kejohanan Olahraga Tahunan', 'Kokurikulum'],
      ['', 'Hari Anugerah Cemerlang', 'Kurikulum'],
    ]),
  ]),
  lampiran: section('LAMPIRAN', '', [
    ul(['Lampiran A: Borang Cuti Guru', 'Lampiran B: Borang Kebenaran Keluar Murid'], false),
  ]),
  catatan: section('CATATAN', '', [], 'notes'),
});

/** Kandungan kosong untuk tajuk/subtajuk baharu. */
export const newSection = (title: string): SectionContent => section(title, '', []);
