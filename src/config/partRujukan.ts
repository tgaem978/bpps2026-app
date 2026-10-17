/* Susunan & halaman baharu mengikut senarai KANDUNGAN dokumen rujukan "Buku Pengurusan & Takwim" (PDF).
 * Hanya tajuk, susunan dan struktur halaman diambil; nama orang dalam rujukan (sekolah lain) TIDAK digunakan.
 * Ruang yang belum ada data dibiarkan kosong untuk diisi (boleh disunting sepenuhnya dalam editor).
 * Halaman sedia ada yang tiada padanan dalam rujukan dikekalkan di tempatnya (tidak dipadam). */
import type { Block, CommitteeRow, MemberRef, OrgTreeBox, OrgTreeColumn, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { partKKSections } from '@/config/partKK';
import { partHemSections } from '@/config/partHEM';
import { partKokuSections } from '@/config/partKoku';

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
export const REMOVED_IDS = ['b-teras', 'b-fokus', 'b-ithink', 'b-5c', 'b-aspirasi', 'b-dpd', 'b-ts25', 'ma-guru-pelaksana',
  // HEM: JK Unit & Bidang Tugas lama digabungkan ke halaman jawatankuasa mengikut rujukan (satu jawatankuasa = satu halaman)
  ...Array.from({ length: 10 }, (_, i) => `hem-jk-${i + 1}`), 'hem-tugas', ...Array.from({ length: 8 }, (_, i) => `hem-tugas-${i + 1}`)];

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
  // Kurikulum / HEM / Kokurikulum: tajuk sama dengan senarai KANDUNGAN rujukan
  'k-jk-induk': { title: 'JAWATANKUASA INDUK KURIKULUM' },
  'k-panitia': { title: 'PENGURUSAN PANITIA MATA PELAJARAN' },
  'kk-dasar': { title: 'KETETAPAN DASAR UNIT KOKURIKULUM' },
  'kk-pembangunan-sukan': { title: 'CARTA ORGANISASI JAWATANKUASA PEMBANGUNAN SUKAN SEKOLAH' },
  'kk-jk-induk': { title: 'JAWATANKUASA PENGURUSAN INDUK KOKURIKULUM' },
  'kk-jk-02': { title: 'GURU PENASIHAT UNIT BERUNIFORM' },
  'kk-jk-10': { title: 'GURU PENASIHAT UNIT SUKAN & PERMAINAN' },
  'kk-jk-06': { title: 'GURU PENASIHAT KELAB & PERSATUAN' },
  'kk-pasukan-1': { title: 'JURULATIH & PENGURUS PASUKAN SEKOLAH' },
  'kk-pasukan-2': { title: 'JURULATIH & PENGURUS PASUKAN SEKOLAH (2)' },
  'kk-pasukan-3': { title: 'JURULATIH & PENGURUS PASUKAN SEKOLAH (3)' },
  'kk-rumah-sukan': { title: 'GURU RUMAH SUKAN' },
  'kk-tugas': { title: 'AGIHAN TUGAS KOKURIKULUM' },
};

export const maklumatAmTopics = (): OutlineTopic[] => [
  topic('ma-peribadi'),
  topic('kata-aluan'),
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


/* ---------------------------------------------------------------- Kurikulum / HEM / Kokurikulum
 * Setiap tajuk dalam senarai KANDUNGAN rujukan = SATU tajuk aras 1 (satu jawatankuasa = satu halaman, termasuk bidang tugasnya).
 * Halaman sambungan & halaman tambahan sekolah ini yang tiada dalam rujukan dikekalkan sebagai subtajuk di bawah tajuk berkaitan
 * dan TIDAK disenaraikan dalam Isi Kandungan (OutlinePart.tocChildren = false).
 */
type CommitteeBlock = Extract<Block, { type: 'committee' }>;
const cloneBlock = <T extends Block>(b: T): T => ({ ...JSON.parse(JSON.stringify(b)), id: uid() });

/* ----- Kurikulum ----- */
const KK_UNIT = partKKSections()['k-jk-unit'].blocks.filter((b): b is CommitteeBlock => b.type === 'committee');
const unitJk = (needle: string) => KK_UNIT.find((b) => b.title.includes(needle));
/** [id, tajuk, GPK Timbalan Pengerusi, kata kunci jawatankuasa unit sedia ada yang dipadankan (jika ada)] - mengikut turutan rujukan. */
const KURI_HALAMAN: [string, string, string, string | null][] = [
  ['kx-jk-petang', 'JAWATANKUASA PENGURUSAN GURU PETANG', PKPTG, null],
  ['kx-jk-prasekolah', 'JAWATANKUASA PENGURUSAN PRASEKOLAH', PKP, 'PRASEKOLAH'],
  ['kx-jk-pbd', 'JAWATANKUASA PENGURUSAN PENTAKSIRAN BERASASKAN SEKOLAH (PBD) DAN KURIKULUM STANDARD SEKOLAH RENDAH (KSSR)', PKP, 'PENTAKSIRAN BERASASKAN SEKOLAH'],
  ['kx-jk-pbd-bd', 'JAWATANKUASA PENTAKSIRAN BILIK DARJAH (PBD)', PKP, null],
  ['kx-jk-data', 'JAWATANKUASA DATA SEKOLAH', PKP, null],
  ['kx-jk-jadual', 'JAWATANKUASA JADUAL WAKTU DAN GURU GANTI', PKP, 'JADUAL WAKTU'],
  ['kx-jk-kbat', 'JAWATANKUASA KBAT, i-THINK & ISPPK', PKP, null],
  ['kx-jk-pemulihan', 'JAWATANKUASA PENGURUSAN PEMULIHAN (WIRA BESTARI)', PKP, null],
  ['kx-jk-hip', 'JAWATANKUASA PENGURUSAN HIGHLY IMMERSIVE PROGRAM (HIP)', PKP, null],
  ['kx-jk-tema', 'JAWATANKUASA PENDEKATAN BERTEMA', PKP, null],
  ['kx-jk-delima', 'JAWATANKUASA DELIMA (DIGITAL EDUCATIONAL LEARNING INITIATIVE MALAYSIA)', PKP, 'DELIMA'],
  ['kx-jk-pidato', 'JAWATANKUASA SUDUT PIDATO (SPEAKER’S CORNER)', PKP, null],
  ['kx-jk-buku-kerja', 'JAWATANKUASA SEMAKAN BUKU KERJA', PKP, null],
  ['kx-jk-guru-muda', 'JAWATANKUASA GURU MUDA', PKP, 'GURU MUDA'],
  ['kx-jk-akademik', 'JAWATANKUASA PROGRAM PENINGKATAN AKADEMIK', PKP, 'KECEMERLANGAN AKADEMIK'],
  ['kx-jk-intervensi', 'JAWATANKUASA INTERVENSI TAHUN 1', PKP, 'INTERVENSI TAHUN 1'],
  ['kx-jk-celik-jawi', 'JAWATANKUASA PROGRAM CELIK JAWI', PKP, null],
];
/** Halaman jawatankuasa Kurikulum: barisan pentadbir (automatik) + ahli daripada jawatankuasa unit sedia ada, atau ruang kosong. */
const kuriPage = (title: string, unit: string, src?: CommitteeBlock): SectionContent => {
  const rows: CommitteeRow[] = src ? [...adminRows(unit), ...src.rows.map((row) => ({ ...row, id: uid() }))] : [...adminRows(unit), ...blankRows()];
  const block: CommitteeBlock = { id: uid(), type: 'committee', title: '', rows, ...(src?.showPosition === false ? { showPosition: false } : {}) };
  return sec(title, '', [block]);
};

export const kurikulumTopics = (): OutlineTopic[] => [
  topic('k-dasar', 'k-visi', 'k-objektif', 'k-pengenalan'),
  topic('kx-carta-induk'),
  topic('k-jk-induk'),
  topic('kx-jk-petang'),
  topic('kx-jk-prasekolah'),
  topic('k-panitia', 'k-ketua-panitia'),
  ...KURI_HALAMAN.slice(2, -1).map(([id]) => topic(id)),
  // halaman tambahan sekolah (tiada dalam rujukan) - sambungan di hujung bahagian, tidak dalam Isi Kandungan
  topic('kx-jk-celik-jawi', 'k-jk-unit', 'k-bidang-tugas', 'k-bilik-khas', 'k-takwim'),
];

/* ----- Hal Ehwal Murid ----- */
const H = partHemSections();
const hb = (id: string, from = 0, to?: number): Block[] => H[id].blocks.slice(from, to);
/** Halaman jawatankuasa HEM: jawatankuasa (sedia ada) + Bidang Tugas berkaitan dalam halaman yang sama. */
const hemPage = (title: string, committees: Block[], tugas: Block[] = []): SectionContent =>
  sec(title, '', [...committees.map(cloneBlock), ...(tugas.length ? [h('BIDANG TUGAS'), ...tugas.map(cloneBlock)] : [])]);

/** Halaman HEM yang belum ada data: barisan pentadbir + ruang kosong. */
const HEM_KOSONG: [string, string][] = [
  ['hx-lokar', 'JAWATANKUASA LOKAR'],
  ['hx-fizikal', 'JAWATANKUASA PEMBANGUNAN FIZIKAL'],
  ['hx-penempatan', 'JAWATANKUASA PENEMPATAN MURID KE TINGKATAN 1 / SEK KAA / SEKOLAH BERASRAMA PENUH'],
  ['hx-orientasi', 'JAWATANKUASA ORIENTASI TAHUN 1 & PRASEKOLAH'],
  ['hx-ssdm', 'JAWATANKUASA SSDM / MURID CICIR / LAPORAN PONTENG / AMALAN BAIK'],
  ['hx-aset', 'JAWATANKUASA ASET ALIH KERAJAAN'],
];
const HEM_UNIT = ['Bimbingan dan Kaunseling', 'Disiplin dan Pengawas', 'Data HEM (IDME / APDM / SMPK)', 'Kantin dan Kedai Buku', 'SPBT', 'RMT / PSS', 'Kebersihan, Kesihatan dan Keselamatan (3K)', 'Bantuan Kerajaan / Ehsan', 'PPDa'];

export const hemOrder = (): OutlineTopic[] => [
  topic('hem-dasar', 'hem-pengenalan', 'hem-visi-misi', 'hem-objektif', 'hem-aluan'),
  topic('hx-carta'),
  topic('hem-jk-induk', 'hem-jk'),
  topic('hx-data'), topic('hx-disiplin'), topic('hx-bk'), topic('hx-ppda'), topic('hx-spbt'), topic('hx-kantin'), topic('hx-kedai'),
  topic('hx-3k-bersih'), topic('hx-3k-sihat'), topic('hx-3k-selamat'),
  topic('hx-bantuan-kerajaan'), topic('hx-bantuan-ehsan'), topic('hx-rmt'), topic('hx-pss'),
  ...HEM_KOSONG.map(([id]) => topic(id)),
];

const hemHalaman = (): Record<string, SectionContent> => ({
  'hx-data': hemPage('JAWATANKUASA DATA HEM (IDME / APDM / SMPK)', [hb('hem-jk-2')[1]]),
  'hx-disiplin': hemPage('JAWATANKUASA DISIPLIN & PENGAWAS', [hb('hem-jk-1')[1], hb('hem-jk-2')[0]], hb('hem-tugas-1')),
  'hx-bk': hemPage('JAWATANKUASA BIMBINGAN & KAUNSELING', [hb('hem-jk-1')[0]], hb('hem-tugas-2')),
  'hx-ppda': hemPage('JAWATANKUASA PENDIDIKAN PENCEGAHAN DADAH (PPDa)', [hb('hem-jk-8')[0]]),
  'hx-spbt': hemPage('JAWATANKUASA SKIM PINJAMAN BUKU TEKS (SPBT)', [hb('hem-jk-6')[1], hb('hem-jk-6')[0]], hb('hem-tugas-6')),
  'hx-kantin': hemPage('JAWATANKUASA KANTIN', [hb('hem-jk-4')[1]], hb('hem-tugas-5')),
  'hx-kedai': hemPage('JAWATANKUASA KEDAI BUKU', [hb('hem-jk-9')[1]]),
  'hx-3k-bersih': hemPage('JAWATANKUASA 3K (KEBERSIHAN & KECERIAAN SEKOLAH DAN TANDAS)', [hb('hem-jk-7')[0]], hb('hem-tugas-7', 2)),
  'hx-3k-sihat': hemPage('JAWATANKUASA 3K (KESIHATAN & RAWATAN)', [hb('hem-jk-7')[1], hb('hem-jk-10')[0]], [...hb('hem-tugas-3'), ...hb('hem-tugas-4', 3)]),
  'hx-3k-selamat': hemPage('JAWATANKUASA 3K (KESELAMATAN, BENCANA & PERHUBUNGAN SEKOLAH)', [hb('hem-jk-8')[1]], hb('hem-tugas-7', 0, 2)),
  'hx-bantuan-kerajaan': hemPage('JAWATANKUASA BANTUAN KERAJAAN (BAP / KWAPM / EMK / TAKAFUL)', [hb('hem-jk-3')[1]], hb('hem-tugas-4', 0, 3)),
  'hx-bantuan-ehsan': hemPage('JAWATANKUASA BANTUAN EHSAN', [hb('hem-jk-3')[0], hb('hem-jk-9')[0]]),
  'hx-rmt': hemPage('JAWATANKUASA RANCANGAN MAKANAN TAMBAHAN (RMT)', [hb('hem-jk-5')[0]], hb('hem-tugas-8')),
  'hx-pss': hemPage('JAWATANKUASA PROGRAM SUSU SEKOLAH (PSS)', [hb('hem-jk-4')[0]]),
  ...Object.fromEntries(HEM_KOSONG.map(([id, title]) => [id, jkPage(title, '', PKHEM)])),
});

/* ----- Kokurikulum ----- */
export const kokuOrder = (): OutlineTopic[] => [
  topic('kk-dasar', 'kk-aluan', 'kk-pengenalan', 'kk-visi-misi', 'kk-piagam', 'kk-strategi', 'kk-polisi-spi', 'kk-polisi', 'kk-polisi-2'),
  topic('kx-carta-koku'),
  topic('kk-pembangunan-sukan'),
  topic('kk-jk-induk'),
  topic('kk-jk-02', 'kk-jk-03', 'kk-jk-04', 'kk-jk-05'),
  topic('kk-jk-10', 'kk-jk-11', 'kk-jk-12', 'kk-jk-13'),
  topic('kk-jk-06', 'kk-jk-07', 'kk-jk-08', 'kk-jk-09'),
  topic('kk-pasukan-1', 'kk-pasukan-2', 'kk-pasukan-3'),
  topic('kk-rumah-sukan', 'kk-rumah-biru', 'kk-rumah-hijau', 'kk-rumah-kuning', 'kk-rumah-merah', 'kk-rumah-ungu'),
  topic('kk-tugas'),
  // halaman tambahan sekolah (tiada dalam rujukan) - sambungan di hujung bahagian, tidak dalam Isi Kandungan
  topic('kk-perhimpunan', 'kk-khas', 'kk-khas-1', 'kk-khas-2', 'kk-khas-3', 'kk-khas-4', 'kk-khas-5', 'kk-takwim'),
];

const listOf = (id: string): string[] => {
  const b = partKokuSections()[id]?.blocks.find((x) => x.type === 'list');
  return b && b.type === 'list' ? b.items : [];
};
const MONTHS_FULL = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];

/** Semua ID tajuk/subtajuk Kurikulum, HEM dan Kokurikulum dalam struktur lalai. */
export const unitTopicIds = (): string[] => [...kurikulumTopics(), ...hemOrder(), ...kokuOrder()].flatMap((t) => [t.id, ...t.children]);
/** Bahagian yang Isi Kandungannya hanya menyenaraikan tajuk aras 1 (mengikut dokumen rujukan). */
export const FLAT_TOC_PARTS = ['p-kurikulum', 'p-hem', 'p-koku'];

export const pentadbiranExtra = 'pp-bilik-khas';

/** Semua ID halaman baharu (migrasi: halaman baharu yang belum disunting dimuat semula). */
export const partRujukanSections = (): Record<string, SectionContent> => {
  const used = KURI_HALAMAN.map(([, , , needle]) => needle).filter((n): n is string => !!n);
  const out: Record<string, SectionContent> = {
    'ma-peribadi': peribadi(),
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

    'k-dasar': sec('KETETAPAN DASAR UNIT KURIKULUM', '', [
      p('Ketetapan dasar Unit Kurikulum merangkumi visi dan misi, objektif dan matlamat serta pengenalan unit pada halaman-halaman berikut. Tambah ketetapan dasar tambahan unit pada halaman ini.'),
      ul(['Visi dan Misi Unit Kurikulum', 'Objektif dan Matlamat Unit Kurikulum', 'Pengenalan Unit Kurikulum dan Pentadbiran Sekolah']),
    ]),
    'kx-carta-induk': sec('CARTA ORGANISASI JAWATANKUASA INDUK KURIKULUM', '', [{
      id: uid(), type: 'committee', title: '', display: 'chart', focus: PKP, onePage: true,
      rows: [
        r('Pengerusi', pos(GB)), r('Naib Pengerusi', pos(PKP, PKHEM, PKKO, PKPTG, PKPK)),
        r('Setiausaha Kurikulum'),
        { id: uid(), role: 'Ketua Panitia', members: [], group: true },
        r('Bahasa'), r('Sains & Matematik'), r('Pendidikan Islam / Moral'), r('Pendidikan Jasmani & Kesenian'),
      ],
    }], 'open'),
    // jawatankuasa unit sedia ada yang telah dipadankan ke halamannya sendiri tidak diulang di sini
    'k-jk-unit': sec('JAWATANKUASA UNIT KURIKULUM', '', partKKSections()['k-jk-unit'].blocks.filter((b) => b.type !== 'committee' || !used.some((n) => b.title.includes(n)))),
    'hem-dasar': sec('KETETAPAN DASAR UNIT HAL EHWAL MURID', '', [
      p('Ketetapan dasar Unit Hal Ehwal Murid merangkumi pengenalan, misi, objektif dan matlamat unit pada halaman-halaman berikut. Tambah ketetapan dasar tambahan unit pada halaman ini.'),
      ul(['Pengenalan Unit Hal Ehwal Murid', 'Misi Unit Hal Ehwal Murid', 'Objektif dan Matlamat Unit Hal Ehwal Murid']),
    ]),
    'hx-carta': sec('CARTA ORGANISASI JAWATANKUASA HAL EHWAL MURID', '', [{
      id: uid(), type: 'orgtree', title: '', root: GB, side: [],
      columns: [col(PKHEM, [box('UNIT HAL EHWAL MURID', HEM_UNIT)])],
    }], 'open'),
    'kx-carta-koku': sec('CARTA ORGANISASI UNIT KOKURIKULUM', '', [{
      id: uid(), type: 'orgtree', title: '', root: GB, side: [],
      columns: [col(PKKO, [box('UNIT BERUNIFORM', listOf('kk-jk-02')), box('UNIT SUKAN & PERMAINAN', listOf('kk-jk-10')), box('KELAB & PERSATUAN', listOf('kk-jk-06'))])],
    }], 'open'),
    'kk-perhimpunan': sec('JADUAL PERHIMPUNAN BULANAN UNIT BERUNIFORM', '', [
      tbl(['BULAN', 'TARIKH', 'UNIT BERUNIFORM', 'GURU PENASIHAT'], MONTHS_FULL.map((m) => [m, '', '', '']), { colWidths: [20, 20, 30, 30], colAlign: ['left', 'center', 'left', 'left'] }),
    ]),
    ...hemHalaman(),
  };
  for (const [id, title, unit, needle] of KURI_HALAMAN) out[id] = kuriPage(title, unit, needle ? unitJk(needle) : undefined);
  return out;
};
