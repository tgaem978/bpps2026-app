/* Susunan & halaman baharu mengikut senarai KANDUNGAN dokumen rujukan "Buku Pengurusan & Takwim" (PDF).
 * Hanya tajuk, susunan dan struktur halaman diambil; nama orang dalam rujukan (sekolah lain) TIDAK digunakan.
 * Ruang yang belum ada data dibiarkan kosong untuk diisi (boleh disunting sepenuhnya dalam editor).
 * Halaman sedia ada yang tiada padanan dalam rujukan dikekalkan di tempatnya (tidak dipadam). */
import type { Block, CommitteeRow, MemberRef, OrgTreeBox, OrgTreeColumn, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS, POSITIONS } from '@/config/defaultStaff';
import { F_NAME, F_POSITION, F_TASK } from '@/types/staff';

const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;

/* ---------------------------------------------------------------- pembantu */
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });
const tbl = (columns: string[], rows: string[][], opts: Partial<Extract<Block, { type: 'table' }>> = {}): Block => ({
  id: uid(), type: 'table', style: 'navy', numbered: false, columns, rows, ...opts,
});
const sec = (title: string, subtitle: string, blocks: Block[], layout: SectionContent['layout'] = 'standard'): SectionContent => ({
  title, subtitle, layout, blocks, updatedAt: null,
});
const pos = (...values: string[]): MemberRef[] => values.map((value) => ({ kind: 'position', value }));
const r = (role: string, members: MemberRef[] = []): CommitteeRow => ({ id: uid(), role, members });
const committee = (rows: CommitteeRow[]): Block => ({ id: uid(), type: 'committee', title: '', rows });
const box = (title: string, items: string[] = []): OrgTreeBox => ({ id: uid(), title, items });
const col = (position: string, boxes: OrgTreeBox[]): OrgTreeColumn => ({ id: uid(), position, boxes });
const topic = (id: string, ...children: string[]): OutlineTopic => ({ id, children });

/** Barisan pentadbir; `unit` = GPK yang menjadi Timbalan Pengerusi (yang lain Naib Pengerusi). */
const adminRows = (unit: string): CommitteeRow[] => [
  r('Pengerusi', pos(GB)),
  r('Timbalan Pengerusi', pos(unit)),
  r('Naib Pengerusi', pos(...[PKP, PKHEM, PKKO, PKPTG, PKPK].filter((x) => x !== unit))),
];
const blankRows = (ajk = 4): CommitteeRow[] => [
  r('Setiausaha'), r('Naib Setiausaha'), ...Array.from({ length: ajk }, (_, i) => r(`Ahli Jawatankuasa ${i + 1}`)),
];
const jkPage = (title: string, subtitle: string, unit: string, tugas: string[] = []): SectionContent =>
  sec(title, subtitle, [committee([...adminRows(unit), ...blankRows()]), ...(tugas.length ? [h('Bidang Tugas'), ul(tugas, true)] : [])]);


/* ---------------------------------------------------------------- 1. MAKLUMAT AM */
/** ID Pengenalan yang dipadam (tidak ada dalam senarai kekal). */
export const REMOVED_IDS = ['b-teras', 'b-fokus', 'b-ithink', 'b-5c', 'b-aspirasi', 'b-dpd', 'b-ts25'];

/** Tajuk/lencana baharu bagi halaman sedia ada (lencana kosong = lencana bahagian "MAKLUMAT AM"). */
export const OVERRIDES: Record<string, Partial<Pick<SectionContent, 'title' | 'subtitle'>>> = {
  'b-rukun-negara': { subtitle: '' },
  'b-visi-kpm': { title: 'VISI DAN MISI KEMENTERIAN PENDIDIKAN MALAYSIA', subtitle: '' },
  'b-aku-janji': { subtitle: '' },
  'b-ikrar': { subtitle: '' },
  'b-spi': { subtitle: '' },
  'maklumat-sekolah': { subtitle: '' },
  'b-sejarah': { subtitle: '' },
  'b-latar': { subtitle: '' },
  'b-visi-sekolah': { subtitle: '' },
  'b-matlamat': { subtitle: '' },
  'b-lagu': { title: 'LAGU SEKOLAH', subtitle: '' },
  'b-logo': { title: 'LENCANA SEKOLAH', subtitle: '' },
  'b-pelan': { title: 'PELAN KELAS DAN BILIK KHAS', subtitle: '' },
  'b-pelan-kecemasan': { title: 'PELAN PENGUNGSIAN BANGUNAN SEKOLAH', subtitle: '' },
  't-akademik': { title: 'KALENDAR AKADEMIK 2026', subtitle: '' },
  't-cuti': { title: 'CUTI PERAYAAN 2026', subtitle: '' },
};

export const maklumatAmTopics = (): OutlineTopic[] => [
  topic('ma-peribadi'),
  topic('kata-aluan'),
  topic('ma-guru-pelaksana'),
  topic('b-rukun-negara'),
  topic('b-visi-kpm'),
  topic('maklumat-sekolah', 'b-sejarah', 'b-latar', 'b-visi-sekolah', 'b-matlamat', 'b-lagu', 'b-logo'),
  topic('b-pelan'),
  topic('b-pelan-kecemasan'),
  topic('b-ikrar'),
  topic('b-aku-janji'),
  topic('b-spi'),
  topic('t-akademik'),
  topic('t-cuti'),
  topic('ma-minggu-akademik'),
  topic('ma-waktu'),
  topic('ma-simulasi', 'ma-simulasi-2'),
];

/** Minggu persekolahan 2026 (Kumpulan B) dijana daripada tarikh penggal dalam Kalendar Akademik 2026. */
const weekRows = (): string[][] => {
  const D = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d);
  const MS = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
  const fmt = (t: number) => { const x = new Date(t); return `${String(x.getUTCDate()).padStart(2, '0')} ${MS[x.getUTCMonth()]}`; };
  const terms: [number, number][] = [[D(2026, 1, 12), D(2026, 3, 16)], [D(2026, 3, 30), D(2026, 5, 18)], [D(2026, 6, 8), D(2026, 8, 24)], [D(2026, 9, 7), D(2026, 11, 30)]];
  const notes: [number, number, string][] = [
    [D(2026, 2, 16), D(2026, 2, 20), 'Tahun Baru Cina 17–18 Feb & cuti tambahan KPM'],
    [D(2026, 3, 16), D(2026, 3, 20), 'Hari Raya Aidilfitri (cuti tambahan KPM 19–20 Mac)'],
    [D(2026, 4, 27), D(2026, 5, 1), '1 Mei – Hari Pekerja'],
    [D(2026, 9, 14), D(2026, 9, 18), '16 Sep – Hari Malaysia'],
    [D(2026, 11, 9), D(2026, 11, 13), 'Deepavali – cuti tambahan KPM 10 Nov'],
  ];
  const out: string[][] = [];
  let n = 0;
  for (const [start, last] of terms) {
    for (let t = start; t <= last; t += 7 * 86400000) {
      n += 1;
      const note = notes.filter(([a]) => a === t).map(([, , s]) => s).join('; ');
      out.push([`MP${n}`, `MA${n}`, `${fmt(t)} – ${fmt(t + 4 * 86400000)}`, note]);
    }
  }
  return out;
};

const peribadi = (): SectionContent => sec('MAKLUMAT PERIBADI', '', [
  p('[ Tampal gambar berukuran pasport di sini ]'),
  kv([['Nama', ''], ['No. Kad Pengenalan', ''], ['No. Fail Peribadi', ''], ['Alamat Rumah', ''], ['No. Telefon', ''], ['Emel', ''], ['Nama Pasangan', ''], ['No. Telefon Pasangan', '']]),
  h('MAKLUMAT PERKHIDMATAN'),
  kv([['Ikhtisas Opsyen 1', ''], ['Ikhtisas Opsyen 2', ''], ['Gred Jawatan Semasa', ''], ['Tarikh Lantikan Pertama', ''], ['Tarikh Pengesahan Pertama', ''], ['Tarikh Khidmat Sekolah Semasa', ''], ['Tarikh Kenaikan Pangkat Semasa', '']]),
]);

const staffGroup = (field: string, values: string[]): Block => ({
  id: uid(), type: 'stafflist', title: '', showPhoto: true, filterField: field, filterValues: values, sort: 'hierarki', columns: [F_NAME, F_TASK],
});
const guruPelaksana = (): SectionContent => sec('GURU & ANGGOTA KUMPULAN PELAKSANA', '', [
  h('PENTADBIR'), staffGroup(F_POSITION, [...ADMIN_POSITIONS]),
  h('GURU'), staffGroup(F_POSITION, POSITIONS.slice(6, 14)),
  h('ANGGOTA KUMPULAN PELAKSANA'), staffGroup(F_POSITION, POSITIONS.slice(14)),
]);

const SIM_ROWS_T1: [string, string, string][] = [
  ['Bahasa Melayu', '192', '9'], ['Bahasa Inggeris', '160', '8'], ['Matematik', '112', '5'], ['Pendidikan Islam / Moral', '112', '6'], ['Sains', '48', '3'],
  ['Pendidikan Jasmani dan Kesihatan', '32', '3'], ['Pendidikan Seni Visual', '32', '2'], ['Pendidikan Muzik', '16', '1'], ['Bahasa Arab', '48', '3'],
  ['Tasmik', '32', '2'], ['Perhimpunan', '16', '1'],
];
const SIM_ROWS_T2: [string, string, string][] = [
  ['Bahasa Melayu', '160', '8'], ['Bahasa Inggeris', '160', '8'], ['Matematik', '112', '6'], ['Sains', '64', '4'], ['Pendidikan Islam / Moral', '112', '6'],
  ['Pendidikan Jasmani', '32', '2'], ['Pendidikan Kesihatan', '16', '1'], ['Pendidikan Seni Visual', '32', '2'], ['Pendidikan Muzik', '16', '1'],
  ['Reka Bentuk dan Teknologi', '32', '2'], ['Sejarah', '32', '2'], ['Bahasa Arab', '48', '3'], ['Tasmik', '32', '2'], ['Perhimpunan', '16', '1'],
];
const simTable = (rows: [string, string, string][]): Block => tbl(
  ['MATA PELAJARAN', 'MINIMUM JAM / TAHUN', 'WAKTU (PETAK) / MINGGU'],
  [...rows.map(([a, b, c]) => [a, b, c]), ['JUMLAH', String(rows.reduce((s, x) => s + +x[1], 0)), String(rows.reduce((s, x) => s + +x[2], 0))]],
  { numbered: true, colWidths: [52, 24, 24], colAlign: ['left', 'center', 'center'] },
);

/* ---------------------------------------------------------------- Pentadbiran & Pengurusan (tambahan) */
const BILIK_KHAS = ['Makmal Sains', 'Makmal Komputer', 'Pusat Sumber Sekolah', 'Bilik Bimbingan dan Kaunseling', 'Bilik Muzik', 'Bilik Pendidikan Seni Visual',
  'Bilik Reka Bentuk dan Teknologi (RBT)', 'Bilik Pemulihan', 'Bilik Kesihatan', 'Bilik Disiplin & Pengawas', 'Bilik Media', 'Surau', 'Dewan', 'Bilik SPBT / Stor Buku Teks'];

/* ---------------------------------------------------------------- Kurikulum (tambahan) */
const KURI_BAHARU: [string, string, string][] = [
  ['kx-jk-petang', 'JAWATANKUASA PENGURUSAN GURU PETANG', PKPTG],
  ['kx-jk-pbd', 'JAWATANKUASA PENGURUSAN PENTAKSIRAN BERASASKAN SEKOLAH (PBD) DAN KURIKULUM STANDARD SEKOLAH RENDAH (KSSR)', PKP],
  ['kx-jk-data', 'JAWATANKUASA DATA SEKOLAH', PKP],
  ['kx-jk-kbat', 'JAWATANKUASA KBAT, i-THINK & ISPPK', PKP],
  ['kx-jk-pemulihan', 'JAWATANKUASA PENGURUSAN PEMULIHAN (WIRA BESTARI)', PKP],
  ['kx-jk-hip', 'JAWATANKUASA PENGURUSAN HIGHLY IMMERSIVE PROGRAM (HIP)', PKP],
  ['kx-jk-tema', 'JAWATANKUASA PENDEKATAN BERTEMA', PKP],
  ['kx-jk-pidato', 'JAWATANKUASA SUDUT PIDATO (SPEAKER’S CORNER)', PKP],
  ['kx-jk-buku-kerja', 'JAWATANKUASA SEMAKAN BUKU KERJA', PKP],
  ['kx-jk-celik-jawi', 'JAWATANKUASA PROGRAM CELIK JAWI', PKP],
];

/* ---------------------------------------------------------------- HEM (tambahan) */
const HEM_BAHARU: [string, string][] = [
  ['hx-ssdm', 'JAWATANKUASA SSDM / MURID CICIR / LAPORAN PONTENG / AMALAN BAIK'],
  ['hx-lokar', 'JAWATANKUASA LOKAR'],
  ['hx-fizikal', 'JAWATANKUASA PEMBANGUNAN FIZIKAL'],
  ['hx-penempatan', 'JAWATANKUASA PENEMPATAN MURID KE TINGKATAN 1 / SEK KAA / SEKOLAH BERASRAMA PENUH'],
  ['hx-orientasi', 'JAWATANKUASA ORIENTASI TAHUN 1 & PRASEKOLAH'],
  ['hx-aset', 'JAWATANKUASA ASET ALIH KERAJAAN'],
];
const HEM_UNIT = ['Bimbingan dan Kaunseling', 'Disiplin dan Pengawas', 'Data HEM (MOEIS / IDME)', 'Kantin dan Kedai Buku', 'SPBT / BOSD', 'RMT / PSS', 'Kebersihan, Kesihatan dan Keselamatan (3K)', 'Bantuan Kerajaan / Ehsan', 'PPDa'];

/* ---------------------------------------------------------------- Kokurikulum (tambahan) */
const MONTHS_FULL = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];

/* ---------------------------------------------------------------- struktur */
export const kurikulumTopics = (): OutlineTopic[] => [
  topic('k-dasar', 'k-visi', 'k-objektif', 'k-pengenalan'),
  topic('kx-carta-induk'),
  topic('k-jk-induk', 'k-jk-unit'),
  topic('kx-jk-petang'),
  topic('k-panitia', 'k-ketua-panitia'),
  topic('kx-jk-pbd'), topic('kx-jk-data'), topic('kx-jk-kbat'), topic('kx-jk-pemulihan'), topic('kx-jk-hip'), topic('kx-jk-tema'),
  topic('kx-jk-pidato'), topic('kx-jk-buku-kerja'), topic('kx-jk-celik-jawi'),
  topic('k-bidang-tugas'),
  topic('k-bilik-khas'),
  topic('k-takwim'),
];

export const hemOrder = (base: OutlineTopic[]): OutlineTopic[] => {
  const get = (id: string) => base.find((t) => t.id === id) ?? topic(id);
  return [
    topic('hem-aluan'),
    topic('hem-dasar', 'hem-pengenalan', 'hem-visi-misi', 'hem-objektif'),
    topic('hx-carta'),
    topic('hem-jk-induk'),
    get('hem-jk'),
    ...HEM_BAHARU.map(([id]) => topic(id)),
    get('hem-tugas'),
  ];
};

export const kokuOrder = (): OutlineTopic[] => [
  topic('kk-aluan'), topic('kk-pengenalan'), topic('kk-visi-misi'), topic('kk-piagam'), topic('kk-dasar'), topic('kk-strategi'),
  topic('kk-polisi-spi', 'kk-polisi', 'kk-polisi-2'),
  topic('kk-jk-induk'),
  topic('kk-jk-02', 'kk-jk-03', 'kk-jk-04', 'kk-jk-05'),
  topic('kk-jk-10', 'kk-jk-11', 'kk-jk-12', 'kk-jk-13'),
  topic('kk-jk-06', 'kk-jk-07', 'kk-jk-08', 'kk-jk-09'),
  topic('kk-pembangunan-sukan', 'kk-pasukan-1', 'kk-pasukan-2', 'kk-pasukan-3'),
  topic('kk-rumah-sukan', 'kk-rumah-biru', 'kk-rumah-hijau', 'kk-rumah-kuning', 'kk-rumah-merah', 'kk-rumah-ungu'),
  topic('kk-tugas'),
  topic('kk-perhimpunan'),
  topic('kk-khas', 'kk-khas-1', 'kk-khas-2', 'kk-khas-3', 'kk-khas-4', 'kk-khas-5'),
  topic('kk-takwim'),
];

export const pentadbiranExtra = 'pp-bilik-khas';

/** Semua ID halaman baharu (migrasi: halaman baharu yang belum disunting dimuat semula). */
export const partRujukanSections = (): Record<string, SectionContent> => {
  const out: Record<string, SectionContent> = {
    'ma-peribadi': peribadi(),
    'ma-guru-pelaksana': guruPelaksana(),
    'ma-minggu-akademik': sec('MINGGU AKADEMIK 2026 (NEGERI KUMPULAN B)', '', [
      p('Minggu persekolahan (MP) dan minggu akademik (MA) sesi 2026 mengikut Kalendar Akademik. Tarikh ialah Isnin hingga Jumaat; semak catatan cuti dan tarikh peperiksaan (UASA) sebelum cetak.'),
      tbl(['MP', 'MA', 'TARIKH', 'CATATAN'], weekRows(), { colWidths: [10, 10, 28, 52], colAlign: ['center', 'center', 'center', 'left'] }),
    ]),
    'ma-waktu': sec('WAKTU PERSEKOLAHAN', '', [
      h('WAKTU PERSEKOLAHAN'),
      tbl(['HARI', 'SESI', 'MASA', 'KELAS'], ['ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT'].flatMap((d) => [[d, 'Pagi', '', ''], ['', 'Petang', '', '']]), { colWidths: [18, 16, 30, 36] }),
      h('WAKTU KEHADIRAN GURU'),
      tbl(['SESI', 'WAKTU MASUK', 'WAKTU KELUAR'], [['Pagi', '', ''], ['Petang', '', '']], { numbered: false }),
      h('SESI PEMBELAJARAN'),
      tbl(['SESI', 'LOCENG PERTAMA', 'LOCENG KEDUA'], [['Pagi', '', ''], ['Petang', '', '']]),
      h('MINGGU PERSEKOLAHAN'),
      tbl(['TAHAP', 'MINGGU PERSEKOLAHAN SESI 2026', 'MINGGU AKADEMIK SESI 2026'], [['Tahap 1', '', ''], ['Tahap 2', '', '']]),
    ]),
    'ma-simulasi': sec('SIMULASI JADUAL WAKTU SEKOLAH', 'TAHAP 1', [
      p('Contoh simulasi jadual waktu Sekolah Kebangsaan Tahap 1 (Tahun 1–3) berdasarkan jumlah minggu PdP setiap mata pelajaran setahun = 39 minggu; satu petak = 30 minit.'),
      simTable(SIM_ROWS_T1),
    ]),
    'ma-simulasi-2': sec('SIMULASI JADUAL WAKTU SEKOLAH', 'TAHAP 2', [
      p('Contoh simulasi jadual waktu Sekolah Kebangsaan Tahap 2 (Tahun 4–6) berdasarkan jumlah minggu PdP setiap mata pelajaran setahun = 39 minggu; satu petak = 30 minit.'),
      simTable(SIM_ROWS_T2),
    ]),

    'pp-bilik-khas': sec('PENYELARAS BILIK-BILIK KHAS', '', [
      tbl(['BILIK KHAS', 'PENYELARAS SESI PAGI', 'PENYELARAS SESI PETANG'], BILIK_KHAS.map((b) => [b, '', '']), { colWidths: [40, 30, 30], colAlign: ['left', 'left', 'left'] }),
    ]),

    'k-dasar': sec('KETETAPAN DASAR UNIT KURIKULUM', 'SESI 2026', [
      p('Ketetapan dasar Unit Kurikulum merangkumi visi dan misi, objektif dan matlamat serta pengenalan unit pada halaman-halaman berikut. Tambah ketetapan dasar tambahan unit pada halaman ini.'),
      ul(['Visi dan Misi Unit Kurikulum', 'Objektif dan Matlamat Unit Kurikulum', 'Pengenalan Unit Kurikulum dan Pentadbiran Sekolah']),
    ]),
    'kx-carta-induk': sec('CARTA ORGANISASI JAWATANKUASA INDUK KURIKULUM', 'SESI 2026', [{
      id: uid(), type: 'committee', title: '', display: 'chart', focus: PKP, onePage: true,
      rows: [
        r('Pengerusi', pos(GB)), r('Naib Pengerusi', pos(PKP, PKHEM, PKKO, PKPTG, PKPK)),
        r('Setiausaha Kurikulum'),
        { id: uid(), role: 'Ketua Panitia', members: [], group: true },
        r('Bahasa'), r('Sains & Matematik'), r('Pendidikan Islam / Moral'), r('Pendidikan Jasmani & Kesenian'),
      ],
    }], 'open'),
    'hem-dasar': sec('KETETAPAN DASAR UNIT HAL EHWAL MURID', 'HAL EHWAL MURID', [
      p('Ketetapan dasar Unit Hal Ehwal Murid merangkumi pengenalan, misi, objektif dan matlamat unit pada halaman-halaman berikut. Tambah ketetapan dasar tambahan unit pada halaman ini.'),
      ul(['Pengenalan Unit Hal Ehwal Murid', 'Misi Unit Hal Ehwal Murid', 'Objektif dan Matlamat Unit Hal Ehwal Murid']),
    ]),
    'hx-carta': sec('CARTA ORGANISASI JAWATANKUASA HAL EHWAL MURID', 'HAL EHWAL MURID', [{
      id: uid(), type: 'orgtree', title: '', root: GB, side: [],
      columns: [col(PKHEM, [box('UNIT HAL EHWAL MURID', HEM_UNIT)])],
    }], 'open'),
    'kk-perhimpunan': sec('JADUAL PERHIMPUNAN BULANAN UNIT BERUNIFORM', 'KOKURIKULUM', [
      tbl(['BULAN', 'TARIKH', 'UNIT BERUNIFORM', 'GURU PENASIHAT'], MONTHS_FULL.map((m) => [m, '', '', '']), { colWidths: [20, 20, 30, 30], colAlign: ['left', 'center', 'left', 'left'] }),
    ]),
  };
  for (const [id, title, unit] of KURI_BAHARU) out[id] = jkPage(title, 'SESI 2026', unit);
  for (const [id, title] of HEM_BAHARU) out[id] = jkPage(title, 'HAL EHWAL MURID', PKHEM);
  return out;
};

