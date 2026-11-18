/* Halaman pengenalan setiap unit (HEM, Kokurikulum, PPKI) diseragamkan SEPENUHNYA dengan format Unit Kurikulum:
 *   1. KETETAPAN DASAR UNIT …   - seksyen bernombor (1. LATAR BELAKANG, 2. OBJEKTIF, 3. DASAR, …), setiap seksyen tajuk + senarai
 *   2. VISI DAN MISI UNIT …     - satu blok maklumat: Visi, Misi, Motto, KPI Sekolah, Matlamat, Objektif
 *   3. OBJEKTIF DAN MATLAMAT UNIT … - dua tajuk panel (kad navy)
 *   4. PENGENALAN UNIT …        - KEY PERFORMANCE INDICATOR (KPI) UNIT …
 * Kandungan diambil daripada halaman sedia ada (tiada teks sekolah dibuang); ruang tanpa data = "[ … ]" untuk diisi. */
import type { Block, KeyValueBlock, ListBlock, OutlineTopic, ParagraphBlock, SectionContent, TableBlock } from '@/types/book';
import { uid } from '@/lib/blocks';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[]): Block => ({ id: uid(), type: 'list', ordered: false, items });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });
const sec = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: '', layout: 'standard', blocks, updatedAt: null });
const clone = <T extends Block>(b: T): T => ({ ...JSON.parse(JSON.stringify(b)), id: uid() });

const paras = (s?: SectionContent) => (s?.blocks ?? []).filter((b): b is ParagraphBlock => b.type === 'paragraph').map((b) => b.text);
const lists = (s?: SectionContent) => (s?.blocks ?? []).filter((b): b is ListBlock => b.type === 'list');
const lines = (items: string[]) => items.map((x) => x.trim()).filter(Boolean).join('\n');
const bullets = (items: string[]) => items.map((x) => `• ${x.trim()}`).join('\n');
const KPI_ISI = '**KPI 1**\n[ SASARAN KPI 1 ]\n\n**KPI 2**\n[ SASARAN KPI 2 ]\n\n**KPI 3**\n[ SASARAN KPI 3 ]';
const PENGANTAR_OBJ = 'Penetapan dasar ini digariskan atas tujuan berikut:';

/** Seksyen dasar: tajuk bernombor + kandungan. */
type Seksyen = { tajuk: string; isi: Block[] };
const bina = (s: Seksyen[]): Block[] =>
  s.flatMap((x, i) => [h(`${i + 1}. ${x.tajuk}`), ...x.isi.map((b) => {
    // subtajuk "4.1 Nama" dinombor semula ikut nombor seksyen baharu
    if (b.type === 'heading') return { ...b, text: b.text.replace(/^\d+\.\d+(\s*-\s*\d+\.\d+)?/, (m) => m.replace(/\d+\.(\d+)/g, `${i + 1}.$1`)) };
    return b;
  })]);

/** Pecah blok dasar sedia ada kepada seksyen mengikut tajuk aras atas "N. TAJUK". */
function seksyenDaripada(blocks: Block[]): Seksyen[] {
  const out: Seksyen[] = [];
  for (const b of blocks) {
    const m = b.type === 'heading' ? b.text.match(/^\d+\.\s+(.+)$/) : null;
    if (m) out.push({ tajuk: m[1].trim().toUpperCase(), isi: [] });
    else if (out.length) out[out.length - 1].isi.push(clone(b));
  }
  return out;
}

const halamanVisi = (unitPenuh: string, kunci: string, d: { visi: string; misi: string; motto?: string; matlamat: string; objektif: string }) =>
  sec(`VISI DAN MISI UNIT ${unitPenuh}`, [kv([
    [`Visi ${kunci}`, d.visi],
    [`Misi ${kunci}`, d.misi],
    [`Motto ${kunci}`, d.motto ?? ''],
    [`KPI ${kunci} Sekolah 2026`, ''],
    [`Matlamat ${kunci}`, d.matlamat],
    [`Objektif ${kunci}`, d.objektif],
  ])]);

const halamanObjektif = (unitPenuh: string, objektif: string, matlamat: string) =>
  sec(`OBJEKTIF DAN MATLAMAT UNIT ${unitPenuh}`, [h(`OBJEKTIF UNIT ${unitPenuh}`), p(objektif), h(`MATLAMAT UNIT ${unitPenuh}`), p(matlamat)]);

const halamanKpi = (tajuk: string, unitPenuh: string) => sec(tajuk, [h(`KEY PERFORMANCE INDICATOR (KPI) UNIT ${unitPenuh}`), p(KPI_ISI)]);

/* ------------------------------------------------------------------ HEM */
function hem(all: Record<string, SectionContent>): Record<string, SectionContent> {
  const U = 'HAL EHWAL MURID';
  const sek = seksyenDaripada(all['hem-dasar']?.blocks ?? []);
  const ambil = (re: RegExp) => { const i = sek.findIndex((s) => re.test(s.tajuk)); return i >= 0 ? sek.splice(i, 1)[0] : undefined; };
  const akta = ambil(/AKTA/);
  const latar = ambil(/LATAR BELAKANG/);
  const objektif = ambil(/^OBJEKTIF/);
  const misi = lists(all['hem-visi-misi'])[0]?.items ?? [];
  const objSec = all['hem-objektif'];
  const teras = (objSec?.blocks.find((b): b is TableBlock => b.type === 'table')?.rows ?? []).map((r) => `${r[0]} – ${r[1]}`);
  const [objPengantar = '', matlamat = ''] = paras(objSec);
  const objektifTeks = [objPengantar, bullets(teras)].filter(Boolean).join('\n');
  return {
    'hem-dasar': sec(`KETETAPAN DASAR UNIT ${U}`, bina([
      { tajuk: 'LATAR BELAKANG', isi: [...(latar?.isi ?? []), ...paras(all['hem-pengenalan']).map(p)] },
      { tajuk: 'OBJEKTIF', isi: [p(PENGANTAR_OBJ), ...(objektif?.isi ?? []).filter((b) => b.type !== 'paragraph')] },
      ...sek,
      ...(akta ? [{ tajuk: 'PETIKAN AKTA PENDIDIKAN 1996 (AKTA 550)', isi: akta.isi }] : []),
    ])),
    'hem-visi-misi': halamanVisi(U, 'HEM', {
      visi: 'Pendidikan Berkualiti Insan Terdidik Negara Sejahtera',
      misi: lines(misi),
      matlamat,
      objektif: lines(teras.length ? [objPengantar, ...teras] : [objPengantar]),
    }),
    'hem-objektif': halamanObjektif(U, objektifTeks, matlamat),
    'hem-pengenalan': halamanKpi(`PENGENALAN UNIT ${U}`, U),
  };
}

/* ------------------------------------------------------------------ Kokurikulum */
function koku(all: Record<string, SectionContent>): Record<string, SectionContent> {
  const U = 'KOKURIKULUM';
  const dasar = lists(all['kk-dasar'])[0]?.items ?? [];
  const peng = all['kk-pengenalan']?.blocks ?? [];
  const iKandungan = peng.findIndex((b) => b.type === 'heading' && /kandungan/i.test(b.text));
  const takrif = peng.slice(0, iKandungan < 0 ? peng.length : iKandungan).filter((b) => b.type === 'paragraph').map(clone);
  const akta = iKandungan < 0 ? [] : peng.slice(iKandungan + 1).map((b) => (b.type === 'list' ? { ...clone(b), ordered: false } : clone(b)));
  const vm = all['kk-visi-misi']?.blocks ?? [];
  const lepasTajuk = (re: RegExp) => { const i = vm.findIndex((b) => b.type === 'heading' && re.test(b.text)); return vm[i + 1]; };
  const visi = (lepasTajuk(/^visi/i) as ParagraphBlock | undefined)?.text.replace(/^["“]|["”]$/g, '') ?? '';
  const misi = (lepasTajuk(/^misi/i) as ListBlock | undefined)?.items ?? [];
  const objektif = (lepasTajuk(/^objektif/i) as ListBlock | undefined)?.items ?? [];
  const matlamat = (lepasTajuk(/^matlamat/i) as ListBlock | undefined)?.items ?? [];
  const piagam = all['kk-piagam']?.blocks ?? [];
  const iStrategi = piagam.findIndex((b) => b.type === 'heading' && /strategi/i.test(b.text));
  const piagamList = lists({ ...all['kk-piagam'], blocks: piagam.slice(0, iStrategi < 0 ? piagam.length : iStrategi) } as SectionContent)[0]?.items ?? [];
  const strategi = iStrategi < 0 ? [] : piagam.slice(iStrategi + 1).map((b) => (b.type === 'list' ? { ...clone(b), ordered: false } : clone(b)));
  const pelaksanaan = lists(all['kk-strategi'])[0]?.items ?? [];
  return {
    'kk-dasar': sec(`KETETAPAN DASAR UNIT ${U}`, bina([
      { tajuk: 'LATAR BELAKANG', isi: takrif },
      { tajuk: 'OBJEKTIF', isi: [p(PENGANTAR_OBJ), ul(objektif)] },
      { tajuk: 'DASAR', isi: [ul(dasar)] },
      { tajuk: 'AKTA, PEKELILING DAN PERUNDANGAN', isi: akta },
      { tajuk: 'STRATEGI', isi: strategi },
      { tajuk: 'STRATEGI PELAKSANAAN', isi: [ul(pelaksanaan)] },
      { tajuk: 'PIAGAM PELANGGAN', isi: [ul(piagamList)] },
    ].filter((s) => s.isi.length))),
    'kk-visi-misi': halamanVisi(U, 'Kokurikulum', { visi: `“${visi}”`, misi: lines(misi), matlamat: lines(matlamat), objektif: lines(objektif) }),
    'kk-objektif': halamanObjektif(U, bullets(objektif), bullets(matlamat)),
    'kk-pengenalan': halamanKpi(`PENGENALAN UNIT ${U}`, U),
  };
}

/* ------------------------------------------------------------------ PPKI */
function ppki(all: Record<string, SectionContent>): Record<string, SectionContent> {
  const U = 'PENDIDIKAN KHAS INTEGRASI';
  const peng = all['pendidikan-khas'];
  const vis = all['pk-visi']?.blocks ?? [];
  const lepasTajuk = (re: RegExp) => { const i = vis.findIndex((b) => b.type === 'heading' && re.test(b.text)); return vis[i + 1]; };
  const visi = (lepasTajuk(/^visi/i) as ParagraphBlock | undefined)?.text ?? '';
  const misi = (lepasTajuk(/^misi/i) as ParagraphBlock | undefined)?.text ?? '';
  const objektif = (lepasTajuk(/^objektif/i) as ListBlock | undefined)?.items ?? [];
  const matlamat = 'Setiap murid berkeperluan pendidikan khas (MBPK) mencapai sasaran Rancangan Pendidikan Individu (RPI) masing-masing serta bersedia untuk menjalani kehidupan berdikari.';
  const maklumat = peng?.blocks.find((b): b is KeyValueBlock => b.type === 'keyvalue');
  return {
    'pk-dasar': sec(`KETETAPAN DASAR PROGRAM ${U}`, bina([
      { tajuk: 'LATAR BELAKANG', isi: paras(peng).map(p) },
      { tajuk: 'OBJEKTIF', isi: [p(PENGANTAR_OBJ), ul(objektif)] },
      { tajuk: 'DASAR', isi: [ul([
        'Pengurusan PPKI adalah selaras dengan Akta Pendidikan 1996, Peraturan-Peraturan Pendidikan (Pendidikan Khas) 2013 serta surat pekeliling dan garis panduan KPM yang berkuat kuasa.',
        'Penempatan murid ke PPKI dibuat berdasarkan pengesahan pengamal perubatan dan prosedur pendaftaran yang ditetapkan.',
        'Setiap murid PPKI mempunyai Rancangan Pendidikan Individu (RPI) yang disediakan, dilaksanakan dan dinilai secara berkala.',
        'PdP dan pentaksiran dilaksanakan mengikut kurikulum pendidikan khas dan tahap keupayaan murid.',
      ])] },
      { tajuk: 'MESYUARAT', isi: [ul([
        'Jawatankuasa Pendidikan Khas Sekolah (JPKS) bermesyuarat sekurang-kurangnya dua (2) kali setahun.',
        'Mesyuarat PPKI diadakan sekurang-kurangnya empat (4) kali setahun mengikut takwim.',
        'Minit mesyuarat disediakan dan diedarkan selewat-lewatnya dua (2) minggu selepas mesyuarat.',
      ])] },
      { tajuk: 'RANCANGAN PENDIDIKAN INDIVIDU (RPI)', isi: [ul([
        'RPI murid baharu disediakan dalam tempoh yang ditetapkan selepas pendaftaran bersama ibu bapa / penjaga.',
        'Pencapaian sasaran RPI dipantau dan dikemas kini sekurang-kurangnya setiap penggal.',
      ])] },
      { tajuk: 'PROGRAM PENDIDIKAN INKLUSIF', isi: [ul([
        'Murid yang berpotensi ditempatkan dalam Program Pendidikan Inklusif mengikut kesesuaian mata pelajaran.',
        'Guru arus perdana dan guru pendidikan khas bekerjasama dalam perancangan dan pemantauan murid inklusif.',
      ])] },
      { tajuk: 'KESELAMATAN DAN KEBAJIKAN MURID', isi: [ul([
        'Keselamatan murid diutamakan semasa ketibaan, PdP, rehat, aktiviti luar dan bersurai.',
        'Ibu bapa / penjaga dimaklumkan dengan segera tentang sebarang insiden yang melibatkan murid.',
      ])] },
    ])),
    'pk-visi': halamanVisi(U, 'PPKI', { visi, misi, matlamat, objektif: lines(objektif) }),
    'pk-objektif': halamanObjektif(U, bullets(objektif), matlamat),
    'pendidikan-khas': halamanKpi(`PENGENALAN PROGRAM ${U}`, U),
    // Maklumat program (penyelaras, bilangan guru/kelas/murid) dialih ke halaman enrolmen
    ...(maklumat && all['pk-murid'] ? { 'pk-murid': { ...all['pk-murid'], blocks: [h('MAKLUMAT PROGRAM'), clone(maklumat), ...all['pk-murid'].blocks] } } : {}),
  };
}

/** ID halaman pengenalan yang diseragamkan (untuk migrasi). */
export const UNIT_INTRO_IDS = ['hem-dasar', 'hem-visi-misi', 'hem-objektif', 'hem-pengenalan', 'kk-dasar', 'kk-visi-misi', 'kk-objektif', 'kk-pengenalan', 'pk-dasar', 'pk-visi', 'pk-objektif', 'pendidikan-khas', 'pk-murid'];
/** Halaman Kokurikulum yang kandungannya digabung ke dalam Ketetapan Dasar. */
export const KOKU_MERGED = ['kk-piagam', 'kk-strategi'];
export const PPKI_PAGES = ['pk-murid', 'pk-jpks', 'pk-carta', 'pk-jk-induk', 'pk-tugas', 'pk-takwim'];

/** Topik pertama (pengenalan) setiap unit - susunan sama dengan Kurikulum: dasar → visi & misi → objektif & matlamat → pengenalan (KPI). */
export const hemIntroTopic = (): OutlineTopic => ({ id: 'hem-dasar', children: ['hem-visi-misi', 'hem-objektif', 'hem-pengenalan', 'hem-aluan'] });
export const kokuIntroTopic = (): OutlineTopic => ({ id: 'kk-dasar', children: ['kk-visi-misi', 'kk-objektif', 'kk-pengenalan', 'kk-aluan', 'kk-polisi-spi', 'kk-polisi', 'kk-polisi-2'] });
export const ppkiIntroTopics = (): OutlineTopic[] => [
  { id: 'pk-dasar', children: ['pk-visi', 'pk-objektif', 'pendidikan-khas'] },
  ...PPKI_PAGES.map((id) => ({ id, children: [] })),
];

/** Halaman pengenalan seragam, dibina daripada kandungan lalai sedia ada. */
export function unitPengenalanSections(all: Record<string, SectionContent>): Record<string, SectionContent> {
  return { ...hem(all), ...koku(all), ...ppki(all) };
}
