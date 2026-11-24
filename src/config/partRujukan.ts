/* Susunan & halaman baharu mengikut senarai KANDUNGAN dokumen rujukan "Buku Pengurusan & Takwim" (PDF).
 * Hanya tajuk, susunan dan struktur halaman diambil; nama orang dalam rujukan (sekolah lain) TIDAK digunakan.
 * Ruang yang belum ada data dibiarkan kosong untuk diisi (boleh disunting sepenuhnya dalam editor).
 * Halaman sedia ada yang tiada padanan dalam rujukan dikekalkan di tempatnya (tidak dipadam). */
import type { Block, CommitteeRow, MemberRef, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { partKKSections } from '@/config/partKK';
import { partHemSections } from '@/config/partHEM';
import { hemIntroTopic, kokuIntroTopic } from '@/config/unitPengenalan';
import { KURI_UNIT_PAGES } from '@/config/bidangTugas';
import { DASAR_HEM, DASAR_HEM_2, DASAR_KURI, JADUAL_PONTENG, TUGAS_HEM, TUGAS_KURI, teks } from '@/config/teksRujukan';

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


/* ---------------------------------------------------------------- Carta Organisasi Induk unit
 * Format seragam semua unit: Pengerusi (Guru Besar) → Timbalan Pengerusi (GPK unit) → Naib Pengerusi (GPK lain)
 * → Setiausaha → penyelaras / ketua (nama diisi automatik daripada Pangkalan Data Guru). */
const tch = (...ids: string[]): MemberRef[] => ids.map((id) => ({ kind: 'teacher', id }));
const st = (role: string, ...ids: string[]): CommitteeRow => ({ id: uid(), role, members: tch(...ids), stack: ids.length > 1 });
const grp = (role: string): CommitteeRow => ({ id: uid(), role, members: [], group: true });
/** Blok carta unit: barisan pentadbir + baris unit; dipadatkan supaya muat satu halaman. */
export const unitChart = (unit: string, rows: CommitteeRow[]): Block => ({
  id: uid(), type: 'committee', title: '', display: 'chart', focus: unit, onePage: true, rows: [...adminRows(unit), ...rows],
});
const CARTA_KURI = (): CommitteeRow[] => [
  st('Setiausaha Kurikulum', 't31', 't91'), st('Setiausaha Pentaksiran', 't51'), st('Setiausaha PBD', 't90'),
  grp('Ketua Panitia'),
  st('Bahasa Melayu', 't43'), st('Bahasa Inggeris', 't15'), st('Bahasa Arab', 't110'), st('Matematik', 't49'),
  st('Sains', 't7'), st('Reka Bentuk Teknologi', 't29'), st('Sejarah', 't39'), st('Pendidikan Islam', 't65'),
  st('Pendidikan Moral', 't72'), st('Pend. Jasmani & Kesihatan', 't45'), st('Pendidikan Muzik', 't71'), st('Pendidikan Seni Visual', 't107'),
  grp('Guru Penyelaras'),
  st('ICT & Jadual Waktu', 't8'), st('Data & SK@S', 't64'), st('Pemulihan Khas', 't78'), st('Program Transisi', 't111'), st('ADNI', 't17'),
];
const CARTA_HEM = (): CommitteeRow[] => [
  st('Setiausaha Hal Ehwal Murid', 't68', 't106'),
  grp('Guru Penyelaras Unit'),
  st('Bimbingan & Kaunseling', 't70', 't105'), st('Disiplin & SSDM', 't55', 't83'), st('Pengawas Sekolah', 't19', 't81'), st('Data Murid (IDME)', 't51', 't85'),
  st('Kebajikan, BAP & KWAPM', 't29', 't28'), st('Kesihatan & Rawatan', 't67', 't95'), st('Keselamatan', 't65', 't88'), st('Kebersihan & Keceriaan', 't68', 't78'),
  st('Kantin & RMT', 't18', 't34'), st('SPBT & Kedai Buku', 't46', 't9'), st('Pencegahan Dadah (PPDa)', 't39', 't79'), st('Program Susu Sekolah', 't48', 't114'),
];
const CARTA_KOKU = (): CommitteeRow[] => [
  st('Setiausaha Kokurikulum', 't62'), st('Setiausaha Sukan', 't23'),
  st('Naib Setiausaha Kokurikulum', 't40', 't77'), st('Naib Setiausaha Sukan', 't47', 't85'),
  grp('Penyelaras Unit (Pagi / Petang)'),
  st('Unit Beruniform', 't25', 't92'), st('Kelab & Persatuan', 't24', 't97'), st('Sukan & Permainan', 't26', 't99'),
];

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
  { ...topic('ma-kp2027', 'ma-kp2027-2', 'ma-kp2027-3', 'ma-kp2027-4', 'ma-kp2027-5'), tocChildren: false }, // Kurikulum Persekolahan 2027: 5 infografik sehalaman
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
  { ...topic('ma-simulasi', 'ma-simulasi-2'), tocChildren: false }, // satu entri dalam Isi Kandungan (rujukan hlm. 22)
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

/** Simulasi Jadual Waktu: dikekalkan SAMA seperti dokumen rujukan (hlm. 22-23) sebagai imej (kandungan sahaja; pengepala/nombor halaman dijana sistem). */
const BASE = import.meta.env.BASE_URL;
const simImg = (file: string): SectionContent => sec('SIMULASI JADUAL WAKTU SEKOLAH', '', [
  { id: uid(), type: 'image', src: `${BASE}simulasi/${file}`, caption: '', frameFill: true },
]);

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
/** Halaman jawatankuasa Kurikulum: barisan pentadbir (automatik) + ahli daripada jawatankuasa unit sedia ada, atau ruang kosong; Bidang Tugas mengikut rujukan. */
const kuriPage = (id: string, title: string, unit: string, src?: CommitteeBlock): SectionContent => {
  const rows: CommitteeRow[] = src ? [...adminRows(unit), ...src.rows.map((row) => ({ ...row, id: uid() }))] : [...adminRows(unit), ...blankRows()];
  const block: CommitteeBlock = { id: uid(), type: 'committee', title: '', rows, ...(src?.showPosition === false ? { showPosition: false } : {}) };
  const tugas = TUGAS_KURI[id] ?? [];
  return sec(title, '', [block, ...(tugas.length ? [h('Bidang Tugas'), ul(tugas, true)] : [])]);
};

/** Tambah Bidang Tugas (rujukan) pada halaman Kurikulum sedia ada. */
const withTugas = (base: SectionContent, tugas: string[]): SectionContent => ({
  ...base, blocks: [...base.blocks.map(cloneBlock), h('Bidang Tugas'), ul(tugas, true)], updatedAt: null,
});

export const kurikulumTopics = (): OutlineTopic[] => [
  topic('k-dasar', 'k-visi', 'k-objektif', 'k-pengenalan'),
  topic('kx-carta-induk'),
  // Jawatankuasa Induk → Senarai Jawatankuasa Unit → setiap jawatankuasa mengikut turutan senarai (ahli + bidang tugas sehalaman)
  topic('k-jk-induk', 'k-jk-unit'),
  topic('kx-jk-petang'),
  topic('kx-jk-prasekolah'),
  topic('k-panitia', 'k-ketua-panitia'),
  ...KURI_HALAMAN.slice(2).map(([id]) => topic(id)),
  ...KURI_UNIT_PAGES.map(([id]) => topic(id)),
  topic('k-bidang-tugas', 'k-bilik-khas'),
  topic('k-takwim'),
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

/** Turutan jawatankuasa HEM = turutan Senarai Jawatankuasa Unit HEM (hem-jk). */
export const HEM_JK_ORDER = ['hx-bk', 'hx-disiplin', 'hx-data', 'hx-bantuan-kerajaan', 'hx-bantuan-ehsan', 'hx-pss', 'hx-kantin', 'hx-rmt', 'hx-spbt', 'hx-kedai',
  'hx-3k-bersih', 'hx-3k-sihat', 'hx-3k-selamat', 'hx-ppda', 'hx-ssdm', 'hx-penempatan', 'hx-orientasi', 'hx-lokar', 'hx-fizikal', 'hx-aset'];
export const hemOrder = (): OutlineTopic[] => [
  hemIntroTopic(),
  topic('hx-carta'),
  topic('hem-jk-induk', 'hem-jk'),
  ...HEM_JK_ORDER.map((id) => topic(id)),
  topic('hx-takwim'),
];

/** Bidang Tugas HEM mengikut rujukan; jika rujukan tiada, kekalkan Bidang Tugas sedia ada sekolah. */
const tg = (id: string, fallback: Block[] = []): Block[] => (TUGAS_HEM[id] ? teks(TUGAS_HEM[id]) : fallback);
const hemKosong = (id: string, title: string): SectionContent =>
  sec(title, '', [committee([...adminRows(PKHEM), ...blankRows()]), ...(TUGAS_HEM[id] ? [h('Bidang Tugas'), ...teks(TUGAS_HEM[id])] : [])]);

const hemHalaman = (): Record<string, SectionContent> => ({
  'hx-data': hemPage('JAWATANKUASA DATA HEM (IDME / APDM / SMPK)', [hb('hem-jk-2')[1]], tg('hx-data')),
  'hx-disiplin': hemPage('JAWATANKUASA DISIPLIN & PENGAWAS', [hb('hem-jk-1')[1], hb('hem-jk-2')[0]], tg('hx-disiplin', hb('hem-tugas-1'))),
  'hx-bk': hemPage('JAWATANKUASA BIMBINGAN & KAUNSELING', [hb('hem-jk-1')[0]], tg('hx-bk', hb('hem-tugas-2'))),
  'hx-ppda': hemPage('JAWATANKUASA PENDIDIKAN PENCEGAHAN DADAH (PPDa)', [hb('hem-jk-8')[0]], tg('hx-ppda')),
  'hx-spbt': hemPage('JAWATANKUASA SKIM PINJAMAN BUKU TEKS (SPBT)', [hb('hem-jk-6')[1], hb('hem-jk-6')[0]], tg('hx-spbt', hb('hem-tugas-6'))),
  'hx-kantin': hemPage('JAWATANKUASA KANTIN', [hb('hem-jk-4')[1]], tg('hx-kantin', hb('hem-tugas-5'))),
  'hx-kedai': hemPage('JAWATANKUASA KEDAI BUKU', [hb('hem-jk-9')[1]], tg('hx-kedai')),
  'hx-3k-bersih': hemPage('JAWATANKUASA 3K (KEBERSIHAN & KECERIAAN SEKOLAH DAN TANDAS)', [hb('hem-jk-7')[0]], tg('hx-3k-bersih', hb('hem-tugas-7', 2))),
  // COMBI (Pencegahan Denggi) ialah tambahan sekolah - dikekalkan selepas Bidang Tugas rujukan
  'hx-3k-sihat': hemPage('JAWATANKUASA 3K (KESIHATAN & RAWATAN)', [hb('hem-jk-7')[1], hb('hem-jk-10')[0]], [...tg('hx-3k-sihat', hb('hem-tugas-3')), ...hb('hem-tugas-4', 3)]),
  'hx-3k-selamat': hemPage('JAWATANKUASA 3K (KESELAMATAN, BENCANA & PERHUBUNGAN SEKOLAH)', [hb('hem-jk-8')[1]], tg('hx-3k-selamat', hb('hem-tugas-7', 0, 2))),
  'hx-bantuan-kerajaan': hemPage('JAWATANKUASA BANTUAN KERAJAAN (BAP / KWAPM / EMK / TAKAFUL)', [hb('hem-jk-3')[1]], tg('hx-bantuan-kerajaan', hb('hem-tugas-4', 0, 3))),
  'hx-bantuan-ehsan': hemPage('JAWATANKUASA BANTUAN EHSAN', [hb('hem-jk-3')[0], hb('hem-jk-9')[0]]),
  'hx-rmt': hemPage('JAWATANKUASA RANCANGAN MAKANAN TAMBAHAN (RMT)', [hb('hem-jk-5')[0]], hb('hem-tugas-8')),
  'hx-pss': hemPage('JAWATANKUASA PROGRAM SUSU SEKOLAH (PSS)', [hb('hem-jk-4')[0]]),
  ...Object.fromEntries(HEM_KOSONG.map(([id, title]) => [id, hemKosong(id, title)])),
});

/* ----- Kokurikulum ----- */
export const kokuOrder = (): OutlineTopic[] => [
  kokuIntroTopic(),
  topic('kx-carta-koku'),
  // Jawatankuasa Induk → Senarai Jawatankuasa Unit → setiap jawatankuasa (guru penasihat menyusul jawatankuasanya)
  topic('kk-jk-induk', 'kk-khas'),
  topic('kk-jk-03', 'kk-jk-02', 'kk-jk-04', 'kk-jk-05'),
  topic('kk-jk-11', 'kk-jk-10', 'kk-jk-12', 'kk-jk-13'),
  topic('kk-jk-07', 'kk-jk-06', 'kk-jk-08', 'kk-jk-09'),
  topic('kk-pembangunan-sukan'),
  topic('kk-khas-1'), topic('kk-khas-2'), topic('kk-khas-3'), topic('kk-khas-4'), topic('kk-khas-5'),
  topic('kk-pasukan-1', 'kk-pasukan-2', 'kk-pasukan-3'),
  topic('kk-rumah-sukan', 'kk-rumah-biru', 'kk-rumah-hijau', 'kk-rumah-kuning', 'kk-rumah-merah', 'kk-rumah-ungu'),
  topic('kk-tugas'),
  topic('kk-perhimpunan'),
  topic('kk-takwim'),
];

const MONTHS_FULL = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];

/** Semua ID tajuk/subtajuk Kurikulum, HEM dan Kokurikulum dalam struktur lalai. */
export const unitTopicIds = (): string[] => [...kurikulumTopics(), ...hemOrder(), ...kokuOrder()].flatMap((t) => [t.id, ...t.children]);
/** Bahagian yang Isi Kandungannya hanya menyenaraikan tajuk aras 1 (mengikut dokumen rujukan). */
export const FLAT_TOC_PARTS = ['p-kurikulum', 'p-hem', 'p-koku'];

export const pentadbiranExtra = 'pp-bilik-khas';

/** Semua ID halaman baharu (migrasi: halaman baharu yang belum disunting dimuat semula). */
export const partRujukanSections = (): Record<string, SectionContent> => {
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
    'ma-simulasi': simImg('isi-22.png'),
    'ma-simulasi-2': simImg('isi-23.png'),

    'pp-bilik-khas': sec('PENYELARAS BILIK-BILIK KHAS', '', [
      tbl(['BILIK KHAS', 'PENYELARAS SESI PAGI', 'PENYELARAS SESI PETANG'], BILIK_KHAS.map((b) => [b, '', '']), { colWidths: [40, 30, 30], colAlign: ['left', 'left', 'left'] }),
    ]),

    'k-dasar': sec('KETETAPAN DASAR UNIT KURIKULUM', '', teks(DASAR_KURI)),
    'k-jk-induk': withTugas(partKKSections()['k-jk-induk'], TUGAS_KURI['k-jk-induk']),
    'k-panitia': withTugas(partKKSections()['k-panitia'], TUGAS_KURI['k-panitia']),
    'kx-carta-induk': sec('CARTA ORGANISASI JAWATANKUASA INDUK KURIKULUM', '', [unitChart(PKP, CARTA_KURI())], 'open'),
    // jawatankuasa unit sedia ada yang telah dipadankan ke halamannya sendiri tidak diulang di sini
    'k-jk-unit': sec('SENARAI JAWATANKUASA UNIT KURIKULUM', '', []), // senarai dijana daripada turutan halaman (senaraiJk.ts)
    'hem-dasar': sec('KETETAPAN DASAR UNIT HAL EHWAL MURID', '', [
      ...teks(DASAR_HEM),
      tbl(JADUAL_PONTENG.columns, JADUAL_PONTENG.rows, { colWidths: [22, 39, 39], colAlign: ['left', 'center', 'center'] }),
      ...teks(DASAR_HEM_2),
    ]),
    'hem-jk-induk': { ...H['hem-jk-induk'], blocks: [...H['hem-jk-induk'].blocks.map(cloneBlock), h('Bidang Tugas'), ...teks(TUGAS_HEM['hem-jk-induk'])], updatedAt: null },
    'hx-carta': sec('CARTA ORGANISASI JAWATANKUASA HAL EHWAL MURID', '', [unitChart(PKHEM, CARTA_HEM())], 'open'),
    'kx-carta-koku': sec('CARTA ORGANISASI UNIT KOKURIKULUM', '', [unitChart(PKKO, CARTA_KOKU())], 'open'),
    'kk-perhimpunan': sec('JADUAL PERHIMPUNAN BULANAN UNIT BERUNIFORM', '', [
      tbl(['BULAN', 'TARIKH', 'UNIT BERUNIFORM', 'GURU PENASIHAT'], MONTHS_FULL.map((m) => [m, '', '', '']), { colWidths: [20, 20, 30, 30], colAlign: ['left', 'center', 'left', 'left'] }),
    ]),
    ...hemHalaman(),
  };
  for (const [id, title, unit, needle] of KURI_HALAMAN) out[id] = kuriPage(id, title, unit, needle ? unitJk(needle) : undefined);
  for (const [id, title, needle] of KURI_UNIT_PAGES) out[id] = kuriPage(id, title, PKP, unitJk(needle));
  return out;
};
