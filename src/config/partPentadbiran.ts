/* Bahagian Pengurusan & Pentadbiran: tajuk & subtajuk mengikut dokumen rujukan "ii. PENTADBIRAN DAN PENGURUSAN" (PDF).
 * Hanya struktur halaman (tajuk, subtajuk, susunan lajur, senarai peranan/bidang tugas) yang diambil daripada rujukan;
 * semua nama dalam rujukan (sekolah lain) TIDAK digunakan. Pentadbir & guru diisi automatik daripada Pangkalan Data Guru SKBTS
 * (mengikut jawatan), dan ruang yang belum ditetapkan dibiarkan kosong untuk diisi (boleh disunting sepenuhnya).
 * Tajuk sedia ada (Senarai Guru & AKP, Guru Kelas, Kumpulan Guru Bertugas, Panduan Am, Akuan, Bidang Tugas) kekal di tempatnya. */
import type { Block, CommitteeRow, MemberRef, OrgTreeBox, OrgTreeColumn, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS, AKP_POSITIONS } from '@/config/defaultStaff';
import { partAStaff } from '@/config/partA';

const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;

/* ---------------------------------------------------------------- pembantu */
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const tbl = (columns: string[], rows: string[][], opts: Partial<Extract<Block, { type: 'table' }>> = {}): Block => ({
  id: uid(), type: 'table', style: 'navy', numbered: true, columns, rows, ...opts,
});
const sec = (title: string, subtitle: string, blocks: Block[], layout: SectionContent['layout'] = 'standard'): SectionContent => ({
  title, subtitle, layout, blocks, updatedAt: null,
});

const pos = (...values: string[]): MemberRef[] => values.map((value) => ({ kind: 'position', value }));
const txt = (...values: string[]): MemberRef[] => values.map((value) => ({ kind: 'text', value }));
/** Baris jawatankuasa; tanpa ahli = ruang kosong untuk diisi. */
const r = (role: string, members: MemberRef[] = []): CommitteeRow => ({ id: uid(), role, members });
const blanks = (...roles: string[]): CommitteeRow[] => roles.map((role) => r(role));
const committee = (rows: CommitteeRow[]): Block => ({ id: uid(), type: 'committee', title: '', rows });

const box = (title: string, items: string[] = []): OrgTreeBox => ({ id: uid(), title, items });
const col = (position: string, boxes: OrgTreeBox[]): OrgTreeColumn => ({ id: uid(), position, boxes });

/** Guru (bukan AKP) mengikut Pangkalan Data Guru. */
const teacherNames = (): string[] => partAStaff.filter((s) => !AKP_POSITIONS.includes(s.kategori)).map((s) => s.nama);

/* ---------------------------------------------------------------- carta */
const PENTADBIRAN_4 = ['Peribadi', 'Perjawatan', 'Perkhidmatan', 'Pentadbiran Data', 'Perangkaan Sekolah', 'Penyeliaan Guru dan Kakitangan'];
const PENTADBIRAN_HEM = ['Perkhidmatan dan Pentadbiran', 'Penyeliaan Guru dan Kakitangan', 'Keceriaan', 'Kelengkapan Fizikal Sekolah'];
const KP = ['Bahasa Melayu', 'Bahasa Inggeris', 'Matematik', 'Sains', 'Pendidikan Agama Islam', 'Bahasa Arab', 'Pendidikan Moral', 'Pendidikan Jasmani dan Kesihatan', 'Pendidikan Muzik', 'Pendidikan Seni Visual', 'Sejarah', 'Reka Bentuk dan Teknologi'];

const cartaSekolah = (): Block => ({
  id: uid(), type: 'orgtree', title: '', root: GB, side: ['PIBG'],
  columns: [
    col(PKP, [
      box('BIDANG PENTADBIRAN', PENTADBIRAN_4),
      box('BIDANG TUGAS', ['Panitia Mata Pelajaran', 'Jadual Waktu', 'Penyeliaan dan Pencerapan', 'PSS', 'TV/Radio Pendidikan', 'Pentaksiran / Penilaian / Peperiksaan', 'Laporan PPD/JPN/KPM', 'Bimbingan dan Pemulihan', 'Takwim', 'PROTIM', 'PATS', 'PLBS', 'Headcount', 'Data', 'Makmal Komputer', 'MBMMBI', 'KSSR', 'Pentaksiran', 'SPS', 'DELIMa, SKPMg2, NKRA']),
    ]),
    col(PKHEM, [
      box('BIDANG PENTADBIRAN', PENTADBIRAN_HEM),
      box('BIDANG TUGAS', ['Penyeliaan dan Pencerapan', 'Disiplin Murid dan Sekolah Selamat', 'Kantin & Kedai Buku', 'Bimbingan dan Kaunseling', 'SPBT / RMT / Projek Susu Sekolah', 'Pengurusan Aset Alih Kerajaan', 'Aduan', 'Pendaftaran, Pengesahan dan Penempatan Murid', 'Keselamatan dan Kehadiran Murid', 'SSDM, SMM, RIMUP, APDM, SISTEK, SISMAKAN', 'Program 3K', 'Program Bebas Denggi', 'Kesihatan & Kebajikan', 'Penyeliaan Pengawal Keselamatan', 'Program Nasionalisma / Kemerdekaan', 'Penyeliaan Pekerja Pembersihan', 'SPS']),
    ]),
    col(PKKO, [
      box('BIDANG PENTADBIRAN', PENTADBIRAN_HEM),
      box('BIDANG TUGAS', ['Penyeliaan dan Pencerapan', 'Kelab dan Persatuan', 'Badan Beruniform', 'Kawasan dan Bangunan', 'Kelengkapan Sekolah', 'Kebersihan dan Keceriaan', 'Perhubungan', 'Lawatan', 'Ko-Akademik', 'KATMO', 'PAJSK', 'SPS', 'Sukan Tahunan', 'Pembangunan Sukan', '1M1S', 'Sukan Negara']),
      box('KAKITANGAN SOKONGAN', ['Ketua Pembantu Tadbir', 'Penolong Akauntan', 'Pembantu Tadbir', 'Pembantu Pengurusan Murid', 'Pembantu Khidmat Am']),
    ]),
    col(PKPTG, [
      box('BIDANG PENTADBIRAN', PENTADBIRAN_4),
      box('BIDANG TUGAS', ['Penyeliaan dan Pencerapan', 'Jadual Waktu', 'PSS', 'TVI / Radio Pendidikan', 'Pentaksiran / Penilaian / Peperiksaan', 'Bimbingan dan Pemulihan', 'Takwim', 'SPS', 'SPBT', 'Penyeliaan Pengawal Keselamatan', 'Program Nasionalisma / Kemerdekaan', 'Penyeliaan Pekerja Pembersihan']),
    ]),
    col(PKPK, [
      box('BIDANG PENTADBIRAN', ['Pentadbiran dan Pengurusan PPKI', 'Penyeliaan Guru dan Kakitangan PPKI']),
      box('BIDANG TUGAS', ['Penyeliaan dan Pencerapan', 'Kurikulum PPKI', 'Hal Ehwal Murid PPKI', 'Kokurikulum PPKI', 'Program Pendidikan Inklusif', 'Pentaksiran Murid Berkeperluan Pendidikan Khas']),
    ]),
  ],
});

const cartaPentadbiran = (): Block => ({
  id: uid(), type: 'orgtree', title: '', root: GB, side: [],
  columns: [
    col(PKP, [
      box('SETIAUSAHA KURIKULUM'),
      box('SETIAUSAHA JADUAL WAKTU'),
      box('PUSAT SUMBER SEKOLAH'),
      box('PENTADBIRAN AM', ['Perancangan', 'Kewangan', 'Staf', 'Pencerapan', 'Penganggaran Bekalan', 'Daftar Kedatangan', 'Perhubungan Awam', 'Cuti Staf', 'Gaji', 'Jadual Waktu Kelas dan Persendirian', 'Prasekolah']),
      box('KETUA PANITIA', KP),
    ]),
    col(PKHEM, [
      box('SETIAUSAHA HAL EHWAL MURID'),
      box('PENTADBIRAN AM', ['Daftar Murid Tahun 1 dan Prasekolah', 'Daftar Kedatangan Murid', 'Sijil Surat Akuan', 'Penempatan Murid Tingkatan 1', 'Perpindahan Murid', 'Pergigian dan Kesihatan Murid', 'Guru Bertugas Mingguan', 'Keselamatan Bangunan', 'Pengawal Keselamatan', 'Pekerja Kebersihan', 'Prasekolah']),
      box('KETUA UNIT', ['Disiplin', 'Pengawas', 'Kedai Buku', 'SPBT', 'RMT', '3K', 'Kebajikan', 'KWAMP', 'Inventori', 'Perabot', 'PPDA', 'SMM', 'Lokar']),
    ]),
    col(PKKO, [
      box('SETIAUSAHA KOKURIKULUM'),
      box('KO-AKADEMIK'),
      box('PENTADBIRAN AM', ['Lawatan', 'Perhimpunan', 'Majlis Sekolah', 'Pertandingan', 'Perkhemahan', 'Papan Kenyataan', 'Sambutan dan Perayaan', 'Prasekolah']),
      box('PENYELARAS UNIT', ['Badan Beruniform', 'Kelab & Persatuan', 'Sukan & Permainan', 'Program 1M1S', 'RIMUP']),
      box('KAKITANGAN SOKONGAN', ['Pembantu Tadbir', 'Pembantu Khidmat Am', 'Pembantu Pengurusan Murid']),
      box('SETIAUSAHA SEKOLAH'),
      box('GURU MEDIA PUBLISITI'),
      box('GURU BIMBINGAN DAN KAUNSELING'),
    ]),
    col(PKPTG, [
      box('SETIAUSAHA PK PETANG'),
      box('PENTADBIRAN AM', ['Perancangan', 'Kewangan', 'Staf', 'Pencerapan', 'Penganggaran Bekalan', 'Daftar Kedatangan', 'Perhubungan Awam', 'Cuti Staf', 'Gaji', 'Jadual Waktu Kelas dan Persendirian', 'Pemulihan']),
      box('PENILAIAN DAN PENTAKSIRAN', ['KBAT', 'SAPS', 'DELIMa', 'i-Think']),
    ]),
    col(PKPK, [
      box('SETIAUSAHA PENTADBIRAN PPKI'),
      box('SETIAUSAHA KURIKULUM PPKI'),
      box('SETIAUSAHA HAL EHWAL MURID PPKI'),
      box('SETIAUSAHA KOKURIKULUM PPKI'),
    ]),
  ],
});

/** Carta JK Induk Pusat Sumber (carta bergambar jawatankuasa). */
const cartaPusatSumber = (): Block => ({
  id: uid(), type: 'committee', title: '', display: 'chart', onePage: true,
  rows: [
    r('Pengerusi', pos(GB)),
    r('Timbalan Pengerusi', pos(PKP)),
    r('Naib Pengerusi 1', pos(PKHEM)),
    r('Naib Pengerusi 2', pos(PKKO)),
    r('Naib Pengerusi 3', pos(PKPTG)),
    r('Naib Pengerusi 4', pos(PKPK)),
    r('Penyelaras', pos('Guru Perpustakaan dan Media')),
    r('Setiausaha', txt('[ SETIAUSAHA ]')),
    { id: uid(), role: 'Ahli Jawatankuasa', members: txt('[ NAMA AHLI ]', '[ NAMA AHLI ]', '[ NAMA AHLI ]'), stack: true },
    { id: uid(), role: 'Unit & Bidang', members: [], group: true },
    { id: uid(), role: 'Kurikulum', members: txt('Semua Ketua Panitia', 'Hal Ehwal Murid', 'Kokurikulum', 'Guru Program NILAM'), stack: true },
    { id: uid(), role: 'Perpustakaan', members: txt('APD / ASTRO', 'Bahan Bantu Belajar', 'Pameran & Bacaan', 'Perkembangan Staf', 'Bank Soalan', 'ICT'), stack: true },
    { id: uid(), role: 'SPBT', members: txt('Wakil PIBG'), stack: true },
  ],
});

/* ---------------------------------------------------------------- jawatankuasa */
/** Lencana kosong = lencana bahagian (PENGURUSAN & PENTADBIRAN), seperti jalur tajuk dokumen rujukan. */
const SUB_JK = '';
/** Barisan pentadbir yang sama bagi semua jawatankuasa: dijana automatik daripada jawatan. */
const adminRows = (): CommitteeRow[] => [
  r('Pengerusi', pos(GB)),
  r('Timbalan Pengerusi', pos(PKP)),
  r('Naib Pengerusi 1', pos(PKHEM)),
  r('Naib Pengerusi 2', pos(PKKO)),
  r('Naib Pengerusi 3', pos(PKPTG)),
  r('Naib Pengerusi 4', pos(PKPK)),
];
const jk = (title: string, rows: CommitteeRow[], tugas: string[] = []): SectionContent =>
  sec(title, SUB_JK, [committee([...adminRows(), ...rows]), ...(tugas.length ? [h('Bidang Tugas'), ul(tugas, true)] : [])]);

const kpRows = (): CommitteeRow[] => KP.map((k) => r(`KP ${k.replace('Pendidikan Jasmani dan Kesihatan', 'PJK').replace('Reka Bentuk dan Teknologi', 'RBT')}`));
const SU_ROWS = ['Setiausaha Sekolah', 'Setiausaha Kurikulum', 'Setiausaha Hal Ehwal Murid', 'Setiausaha Kokurikulum'];

const JK_IDS = [
  'pp-jk-tertinggi', 'pp-jk-pentadbiran', 'pp-jk-mesyuarat', 'pp-jk-kewangan', 'pp-jk-buku', 'pp-jk-maklumat', 'pp-jk-ts25',
  'pp-jk-staf', 'pp-jk-skpm', 'pp-jk-tatatertib', 'pp-jk-papan', 'pp-jk-bk', 'pp-jk-kajian', 'pp-jk-mentor', 'pp-jk-pusat-sumber',
  'pp-jk-nilam', 'pp-jk-siar', 'pp-jk-pibg',
];

/* ---------------------------------------------------------------- program khas */
const programTable = (): Block =>
  tbl(['NAMA PROGRAM', 'JAWATAN', 'NAMA GURU'], Array.from({ length: 10 }, () => ['', 'PENYELARAS', '']), { numbered: false, colWidths: [42, 18, 40] });
const programPage = (unit: string, rows: CommitteeRow[]): SectionContent =>
  sec('PENGURUSAN PROGRAM KHAS SEKOLAH', unit, [committee(rows), programTable()]);

/* ---------------------------------------------------------------- jadual guru */
const MONTHS = ['JAN', 'FEB', 'MAC', 'APR', 'MEI', 'JUN', 'JUL', 'OGO', 'SEP', 'OKT', 'NOV', 'DIS'];

export const pentadbiranTopics = (): OutlineTopic[] => [
  { id: 'pp-carta-sekolah', children: ['pp-carta-pentadbiran', 'pp-carta-pusat-sumber'] },
  { id: 'senarai-pagi', children: ['senarai-petang', 'senarai-akp'] },
  { id: 'pp-delima', children: [] },
  { id: 'guru-kelas', children: [] },
  { id: 'pp-jk-tertinggi', children: JK_IDS.slice(1) },
  { id: 'pp-pencerapan', children: ['pp-erph', 'pp-pencerapan-guru', 'pp-semakan-hasil'] },
  { id: 'pp-program-kurikulum', children: ['pp-program-hem', 'pp-program-koku'] },
  { id: 'kumpulan-bertugas', children: ['jadual-bertugas-1', 'jadual-bertugas-2', 'jadual-bertugas-ppki'] },
  { id: 'panduan-am', children: [] },
  { id: 'akuan', children: [] },
  { id: 'bidang-tugas-guru', children: [] },
  { id: 'bidang-tugas-akp', children: [] },
];

/** ID tajuk baharu bahagian ini (untuk migrasi: padam yang belum disunting bila dimuat semula). */
export const pentadbiranIds = (): string[] => Object.keys(partPentadbiranSections());

export const partPentadbiranSections = (): Record<string, SectionContent> => ({
  /* 1. Carta organisasi */
  'pp-carta-sekolah': sec('CARTA ORGANISASI SEKOLAH', '', [cartaSekolah()], 'open'),
  'pp-carta-pentadbiran': sec('CARTA ORGANISASI PENTADBIRAN DAN PENGURUSAN', '', [cartaPentadbiran()], 'open'),
  'pp-carta-pusat-sumber': sec('CARTA ORGANISASI JAWATANKUASA INDUK PUSAT SUMBER', '', [cartaPusatSumber()], 'open'),

  /* 2. ID DELIMa guru */
  'pp-delima': sec('ID DELIMa GURU', '', [
    tbl(['NAMA GURU', 'E-MEL DELIMa MOE'], teacherNames().map((n) => [n, '']), { colWidths: [50, 50], colAlign: ['left', 'left'] }),
  ]),

  /* 3. Jawatankuasa */
  'pp-jk-tertinggi': jk('JAWATANKUASA PENGURUSAN TERTINGGI SEKOLAH', [], [
    'Bertanggungjawab dalam peningkatan kurikulum, sahsiah murid dan kokurikulum serta memastikan pelaksanaannya selaras dengan dasar Kementerian Pendidikan Malaysia',
    'Bertanggungjawab dalam pengurusan pentadbiran dan kewangan sekolah',
    'Menghadiri mesyuarat pengurusan tertinggi sekurang-kurangnya 4 kali setahun',
    'Membimbing kakitangan akademik dan sokongan dalam menjalankan tugas',
    'Lain-lain tugas seperti yang terdapat dalam Pekeliling Ikhtisas Kementerian Pendidikan Malaysia',
  ]),
  'pp-jk-pentadbiran': jk('JAWATANKUASA PENTADBIRAN DAN STAF SOKONGAN', [
    r('Setiausaha', pos('Ketua Pembantu Tadbir')),
    r('Ahli Jawatankuasa', pos('Penolong Akauntan', 'Pembantu Tadbir', 'Pembantu Pengurusan Murid', 'Pembantu Khidmat Am')),
  ]),
  'pp-jk-mesyuarat': jk('JAWATANKUASA PENGURUSAN MESYUARAT GURU', [r('Setiausaha')], [
    'Mengadakan mesyuarat guru sekurang-kurangnya 4 kali setahun',
    'Membuat panggilan mesyuarat kepada semua guru sebelum mengadakan mesyuarat',
    'Menyiapkan minit mesyuarat selepas seminggu mesyuarat diadakan',
    'Mengedarkan minit mesyuarat kepada semua guru',
    'Menyerahkan minit mesyuarat ke pejabat untuk fail sekolah',
  ]),
  'pp-jk-kewangan': jk('JAWATANKUASA PENGURUSAN KEWANGAN & AKAUN SEKOLAH', [
    r('Setiausaha', pos('Penolong Akauntan')),
    ...kpRows(),
    r('Guru Media', pos('Guru Perpustakaan dan Media')),
    r('Penyelaras Prasekolah', pos('Guru Prasekolah')),
    r('Guru Bimbingan', pos('Guru Bimbingan dan Kaunseling')),
    r('Pegawai Aset'),
  ], [
    'Memastikan segala perbelanjaan mengikut arahan jabatan',
    'Merekod dan mengemaskini segala perbelanjaan yang dilakukan',
    'Menghadiri mesyuarat kewangan sekurang-kurangnya 4 kali setahun',
    'Memastikan segala butiran perbelanjaan adalah benar',
    'Menyediakan anggaran perbelanjaan tahunan dan menyediakan minit mesyuarat berkenaan',
  ]),
  'pp-jk-buku': jk('JAWATANKUASA BUKU PENGURUSAN & TAKWIM SEKOLAH', [
    r('Penyelaras', []),
    ...blanks(...SU_ROWS, 'Penolong PK Petang', 'Penolong Setiausaha Kurikulum', 'Penolong Setiausaha Hal Ehwal Murid', 'Penolong Setiausaha Kokurikulum'),
  ], [
    'Mengadakan mesyuarat untuk membincangkan reka bentuk dan kandungan Buku Pengurusan bagi tahun {{tahun}}',
    'Mengumpulkan bahan-bahan untuk Buku Pengurusan {{tahun}} (termasuk lampiran)',
    'Membuat semakan terakhir dan bacaan terakhir (proof reading)',
    'Memastikan buku dicetak dan dijilidkan sebelum Mesyuarat Guru Bil. 1 {{tahun}} diadakan',
  ]),
  'pp-jk-maklumat': jk('JAWATANKUASA PENGURUSAN MAKLUMAT SEKOLAH', [
    r('Setiausaha', pos('Guru Data')),
    ...blanks(...SU_ROWS, 'Setiausaha Sukan'),
    r('Guru Media', pos('Guru Perpustakaan dan Media')),
    ...blanks('Guru Disiplin', 'Guru SPBT', 'Pegawai Aset'),
    r('Guru Bimbingan & Kaunseling', pos('Guru Bimbingan dan Kaunseling')),
    ...kpRows(),
    r('Penyelaras Pemulihan', pos('Guru Pemulihan')),
    r('Penyelaras Prasekolah', pos('Guru Prasekolah')),
    ...blanks('Penyelaras Tahun 1', 'Penyelaras Tahun 2', 'Penyelaras Tahun 3', 'Penyelaras Tahun 4', 'Penyelaras Tahun 5', 'Penyelaras Tahun 6', 'Semua Guru Kelas'),
    r('Ketua Pembantu Tadbir', pos('Ketua Pembantu Tadbir')),
  ]),
  'pp-jk-ts25': jk('JAWATANKUASA PROGRAM TRANSFORMASI SEKOLAH (TS25)', [
    ...blanks('Penyelaras', 'Setiausaha', 'Setiausaha Hal Ehwal Murid', 'Setiausaha Kokurikulum', 'Ahli Jawatankuasa', 'MLT'),
    r('Semua Guru', txt('Semua Guru')),
  ], [
    'Memantapkan kepimpinan sekolah',
    'Memaksimumkan potensi guru dan murid menerusi peningkatan kualiti Pembelajaran dan Pengajaran',
    'Mengukuhkan penglibatan ibu bapa, komuniti dan pihak berkepentingan demi kejayaan murid',
    'Merancang pembangunan dan peningkatan akademik sekolah',
    'Membuat perancangan strategik, taktikal, operasi dan takwim sekolah',
    'Melaksanakan penilaian PSO peringkat sekolah',
    'Mengemaskini carta-carta Pelan Strategik/Taktikal dan Operasi sekolah',
    'Melaksanakan arahan dan tugasan yang diberikan oleh Guru Besar dari semasa ke semasa',
  ]),
  'pp-jk-staf': jk('JAWATANKUASA PERKEMBANGAN STAF (LADAP) & PLC', [
    ...blanks('Penyelaras', 'Ahli Jawatankuasa'),
    r('Semua Ketua Panitia', txt('Semua Ketua Panitia')),
  ], [
    'Merancang dan melaksanakan program kemajuan staf',
    'Meningkatkan kecekapan dalam mengurus sumber',
    'Membuat penilaian program, latihan dan menjalankan tindakan susulan',
    'Penyediaan dokumentasi',
    'Menghadiri mesyuarat latihan personel sekurang-kurangnya 4 kali setahun',
  ]),
  'pp-jk-skpm': jk('JAWATANKUASA PENGURUSAN SKPM KUALITI @ SEKOLAH', [
    r('Setiausaha', pos('Guru Data')),
    ...blanks(...SU_ROWS, 'Setiausaha Sukan', 'Setiausaha Peperiksaan Dalaman'),
    r('Semua Ketua Panitia', txt('Semua Ketua Panitia')),
    r('Ketua-ketua Unit Kurikulum / HEM / Kokurikulum', txt('Ketua-ketua Unit Kurikulum / HEM / Kokurikulum')),
  ], [
    'Membuat penilaian/penarafan kendiri status kedudukan sekolah berdasarkan elemen-elemen yang ditetapkan',
    'Mengaudit semua elemen tersebut selari dengan penilaian yang telah dibuat',
    'Mencadang dan menyemak semula program-program penambahbaikan',
    'Menghadiri mesyuarat SKPMg2 sekurang-kurangnya 4 kali setahun',
    'Membuat rumusan tentang penilaian tersebut',
    'Menjalankan tugas-tugas lain yang berkaitan dari semasa ke semasa',
  ]),
  'pp-jk-tatatertib': jk('JAWATANKUASA LEMBAGA TATATERTIB SEKOLAH', [r('Setiausaha', pos('Ketua Pembantu Tadbir'))], [
    'Merangka dan menentukan dasar disiplin dan peraturan sekolah selaras dengan perintah am yang mesti dipatuhi oleh guru dan kakitangan bukan guru',
    'Mengeluarkan surat amaran kepada guru dan kakitangan bukan guru yang bermasalah',
    'Mengambil tindakan ke atas guru dan kakitangan bukan guru yang melanggar disiplin walaupun telah diberi amaran mengikut SOP',
    'Mengadakan mesyuarat dan menyediakan minit mesyuarat berkaitan disiplin guru dan kakitangan bukan guru',
    'Menyediakan laporan guru dan kakitangan bukan guru yang bermasalah kepada pihak PPD/JPN',
  ]),
  'pp-jk-papan': jk('JAWATANKUASA PAPAN KENYATAAN', [
    r('Penyelaras'),
    r('Semua Ketua Panitia', txt('Semua Ketua Panitia')),
    r('Semua Ketua Unit HEM', txt('Semua Ketua Unit HEM')),
    r('Semua Ketua Unit Kokurikulum', txt('Semua Ketua Unit Kokurikulum')),
    r('Semua Ketua Unit Sukan', txt('Semua Ketua Unit Sukan')),
  ]),
  'pp-jk-bk': jk('JAWATANKUASA BIMBINGAN & KAUNSELING', [
    r('Penyelaras', pos('Guru Bimbingan dan Kaunseling')),
    ...blanks('Guru Disiplin', 'Guru Pengawas Sekolah', 'Kebajikan'),
  ]),
  'pp-jk-kajian': jk('JAWATANKUASA KAJIAN TINDAKAN & AMALAN TERBAIK', [
    r('Setiausaha', pos('Guru Pemulihan')),
    r('Semua Ketua Panitia', txt('Semua Ketua Panitia')),
    r('Semua Ketua Unit HEM', txt('Semua Ketua Unit HEM')),
    r('Semua Ketua Unit Kokurikulum', txt('Semua Ketua Unit Kokurikulum')),
  ]),
  'pp-jk-mentor': jk('JAWATANKUASA MENTOR MENTEE', [
    r('Mentor', txt('Pentadbir')),
    r('Mentee', txt('Rujuk Senarai Pencerapan')),
  ]),
  'pp-jk-pusat-sumber': jk('JAWATANKUASA PUSAT SUMBER SEKOLAH', [
    r('Penyelaras', pos('Guru Perpustakaan dan Media')),
    ...blanks('Bahan Bantu Belajar', 'APD / ASTRO', 'Komputer / ICT', 'Perkembangan Staf', 'Ahli Jawatankuasa'),
    r('Semua Ketua Panitia', txt('Semua Ketua Panitia')),
  ]),
  'pp-jk-nilam': jk('JAWATANKUASA ANUGERAH NILAM', [...blanks('Penyelaras', 'Ahli Jawatankuasa')]),
  'pp-jk-siar': jk('JAWATANKUASA TEKNIKAL DAN SIAR RAYA', [...blanks('Penyelaras', 'Ahli Jawatankuasa')]),
  'pp-jk-pibg': sec('JAWATANKUASA PERSATUAN IBU BAPA DAN GURU', SUB_JK, [
    committee([
      r('Penasihat', pos(GB)),
      ...blanks('Yang Di Pertua PIBG', 'Naib Yang Dipertua PIBG', 'Setiausaha', 'Bendahari'),
      ...Array.from({ length: 5 }, (_, i) => r(`AJK Ibu Bapa ${i + 1}`)),
      ...Array.from({ length: 6 }, (_, i) => r(`AJK Guru ${i + 1}`)),
      r('Setiausaha PIBKS'),
    ]),
  ]),

  /* 4. Jadual pencerapan, eRPH, semakan hasil kerja murid */
  'pp-pencerapan': sec('JADUAL PENCERAPAN 2026', '', [
    ul([
      'Pencerapan akan dijalankan sebanyak 2 kali setahun (sekali bagi setiap penggal).',
      'Pencerapan kali ke-2 dalam satu penggal akan dijalankan sekiranya markah pencerapan berada di tahap yang rendah.',
      'Guru-guru diminta bersedia dari semasa ke semasa untuk dicerap pada bila-bila masa.',
    ]),
    tbl(
      ['PENTADBIR', 'NAMA GURU'],
      [GB, PKP, PKHEM, PKKO, PKPTG, PKPK].map((position) => [
        `{{jawatan:${position}}}\n(${position.replace('GPK ', 'PK ')})`,
        Array.from({ length: Math.ceil(teacherNames().length / 6) }, (_, i) => `${i + 1}.`).join('\n'),
      ]),
      { numbered: false, colWidths: [38, 62], colAlign: ['center', 'left'] },
    ),
  ]),
  'pp-erph': sec('JADUAL PENGHANTARAN eRPH 2026', '', [
    p('Isikan kod pentadbir yang menyemak eRPH guru pada bulan berkenaan: GB, PKP, PKHEM, PKKO, PKPTG atau PKPK.'),
    tbl(['NAMA GURU', ...MONTHS], teacherNames().map((n) => [n, ...MONTHS.map(() => '')]), {
      colWidths: [34, ...MONTHS.map(() => 66 / 12)], colAlign: ['left', ...MONTHS.map(() => 'center' as const)],
    }),
  ]),
  'pp-pencerapan-guru': sec('JADUAL PENCERAPAN GURU 2026', '', [
    tbl(['NAMA GURU', 'PENTADBIR', 'PENCERAPAN KENDIRI', 'PENCERAPAN PERTAMA', 'PENCERAPAN KEDUA'], teacherNames().map((n) => [n, '', '', '', '']), {
      colWidths: [34, 18, 16, 16, 16], colAlign: ['left', 'center', 'center', 'center', 'center'],
    }),
  ]),
  'pp-semakan-hasil': sec('JADUAL SEMAKAN HASIL KERJA MURID 2026', '', [
    tbl(['NAMA GURU', 'SEMAKAN HASIL KERJA MURID', 'JAWATANKUASA MATA PELAJARAN', 'SEMAKAN PENGGAL 1', 'SEMAKAN PENGGAL 2'], teacherNames().map((n) => [n, '', '', '', '']), {
      colWidths: [32, 18, 18, 16, 16], colAlign: ['left', 'center', 'center', 'center', 'center'],
    }),
  ]),

  /* 5. Pengurusan program khas sekolah */
  'pp-program-kurikulum': programPage('UNIT KURIKULUM', [
    r('Pengerusi', pos(GB)), r('Timbalan Pengerusi', pos(PKP)),
    r('Naib Pengerusi', pos(PKHEM, PKKO, PKPTG, PKPK)),
  ]),
  'pp-program-hem': programPage('UNIT HAL EHWAL MURID', [
    r('Pengerusi', pos(GB)), r('Timbalan Pengerusi', pos(PKHEM)),
    r('Naib Pengerusi', pos(PKP, PKKO, PKPTG, PKPK)),
  ]),
  'pp-program-koku': programPage('UNIT KOKURIKULUM', [
    r('Pengerusi', pos(GB)), r('Timbalan Pengerusi', pos(PKKO)),
    r('Naib Pengerusi', pos(PKP, PKHEM, PKPTG, PKPK)),
  ]),
});
