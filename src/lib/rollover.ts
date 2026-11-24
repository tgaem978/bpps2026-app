/**
 * Edisi tahunan baharu (cth. 2026 → 2027): buku disalin, tahun ditukar, halaman bertarikh dijana semula / dikosongkan
 * dan setiap halaman ditandakan "perlu dikemas kini". Fungsi tulen (tiada kesan sampingan) supaya boleh diuji.
 */
import type { Block, CoverContent, OutlinePart, ReviewMark, SectionContent, TableBlock, TakwimBlock, TakwimRow } from '@/types/book';
import { allIds } from '@/lib/outline';
import { academicSection, dutyRosterSections, hasAcademic, legendBlock, markGrid, markTakwimRows } from '@/config/kalendarAkademik';

/** Tahun kandungan lalai dalam kod (src/config/*). */
export const BASE_YEAR = 2026;

export const MONTHS = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];
const MON_SHORT = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
/** Hari dalam Bahasa Melayu, indeks = Date.getUTCDay() (0 = Ahad). */
const DAYS = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];

/* ------------------------------------------------------------------ tahun dalam teks */

/**
 * Tukar tahun edisi dalam teks: "2026" → "2027" dan "2025/2026" → "2026/2027".
 * Tarikh penuh (cth. 12.01.2026, 21/1/2026) TIDAK diubah kerana hari bulannya berbeza tahun hadapan.
 */
export function swapYear(text: string, from: number, to: number): string {
  if (!text || !text.includes(String(from))) return text;
  const re = new RegExp(`(\\b${from - 1}\\s*/\\s*)?(?<!\\d[./-]\\d{1,2}[./-])\\b${from}\\b(\\s*/\\s*${to}\\b)?`, 'g');
  return text.replace(re, (_m, pre?: string, post?: string) => (post ? `${to}/${to + 1}` : pre ? `${from}/${to}` : String(to)));
}

function swapBlock(b: Block, from: number, to: number): Block {
  const y = (t: string) => swapYear(t, from, to);
  switch (b.type) {
    case 'heading':
    case 'paragraph': return { ...b, text: y(b.text) };
    case 'list': return { ...b, items: b.items.map(y) };
    case 'keyvalue': return { ...b, pairs: b.pairs.map((p) => ({ key: y(p.key), value: y(p.value) })) };
    case 'table': return { ...b, columns: b.columns.map(y), rows: b.rows.map((r) => r.map(y)) };
    case 'image': return { ...b, caption: y(b.caption) };
    case 'committee': return { ...b, title: y(b.title), rows: b.rows.map((r) => ({ ...r, role: y(r.role) })) };
    case 'orgchart': return { ...b, title: y(b.title) };
    case 'orgtree': return { ...b, title: y(b.title) };
    case 'stafflist': return { ...b, title: y(b.title) };
    case 'takwim': return { ...b, title: y(b.title), rows: b.rows.map((r) => ({ ...r, span: r.span === undefined ? undefined : y(r.span), cells: r.cells.map(y) })) };
    case 'planner': return { ...b, todo: [], notes: '' }; // tugasan & catatan peribadi tidak dibawa ke tahun baharu
    case 'infographic': return b; // nama kurikulum (cth. KP2027) bukan tahun edisi — tidak ditukar
  }
}

/* ------------------------------------------------------------------ halaman bertarikh */

/** Grid kalendar bulanan (Isnin dahulu), sama format dengan halaman KALENDAR. */
export function monthGrid(year: number, month: number): string[][] {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay(); // 0 = Ahad
  const lead = (first + 6) % 7; // Isnin = 0
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = [...Array.from({ length: lead }, () => ''), ...Array.from({ length: days }, (_, i) => String(i + 1))];
  while (cells.length % 7) cells.push('');
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}

/** Baris harian takwim bulanan untuk tahun baharu: tarikh & hari dijana, Sabtu/Ahad ditanda hujung minggu, sel kosong. */
export function takwimRows(year: number, month: number, units: number): TakwimRow[] {
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: days }, (_, i) => {
    const dow = new Date(Date.UTC(year, month, i + 1)).getUTCDay();
    const row: TakwimRow = { week: '', date: `${i + 1} ${MON_SHORT[month]} ${year}`, day: DAYS[dow], cells: Array.from({ length: units }, () => '') };
    if (dow === 0 || dow === 6) row.kind = 'weekend';
    return row;
  });
}

const monthIndex = (label: string) => MONTHS.indexOf(label.trim().toUpperCase());

const DAY_RE = '(?:Isnin|Selasa|Rabu|Khamis|Jumaat|Sabtu|Ahad)';
const MON_RE = '(?:Januari|Jan|Februari|Feb|Mac|April|Apr|Mei|Jun|Julai|Jul|Ogos|September|Sept?|Oktober|Okt|November|Nov|Disember|Dis)';
const DATE_PATTERNS = [
  /\b\d{1,2}\s*[./-]\s*\d{1,2}\s*[./-]\s*(?:19|20)\d{2}\b/g,
  new RegExp(`\\b\\d{1,2}(?:\\s*(?:-|–|&|dan)\\s*\\d{1,2})?\\s+${MON_RE}\\b(?:\\s+(?:19|20)\\d{2})?`, 'gi'),
  new RegExp(`\\(\\s*${DAY_RE}\\s*\\)`, 'gi'),
];

const hasDate = (cell: string) => DATE_PATTERNS.some((re) => { re.lastIndex = 0; return re.test(cell); });

/** Buang tarikh daripada sel (label dikekalkan, cth. "TAHUN BARU CINA 17.02.2026 (Selasa)" → "TAHUN BARU CINA"). Sel tanpa tarikh tidak diubah. */
export function stripDates(cell: string): string {
  if (!hasDate(cell)) return cell;
  let out = cell;
  for (const re of DATE_PATTERNS) out = out.replace(re, ' ');
  out = out
    .split('\n')
    .map((ln) => ln.replace(/\(\s*\)/g, ' ').replace(/\s{2,}/g, ' ').replace(/^(?:\s|[-–&,;:]|\bdan\b|\bhingga\b)+|(?:\s|[-–&,;:]|\bdan\b|\bhingga\b)+$/gi, '').trim())
    .filter((ln) => /[\p{L}]/u.test(ln.replace(/\*/g, '')))
    .join('\n');
  return out;
}

/** Peraturan pengosongan jadual bagi halaman bertarikh (ID kandungan lalai). */
interface ClearRule {
  /** Kosongkan lajur yang tajuknya sepadan. */
  cols?: RegExp;
  /** Buang tarikh dalam semua sel (label dikekalkan); sel nombor sahaja dikosongkan. */
  strip?: boolean;
  /** Lajur pertama dibuang tarikhnya; lajur lain dikosongkan. */
  labelsOnly?: boolean;
}
export const DATE_PAGES: Record<string, ClearRule> = {
  't-akademik': { strip: true },
  't-cuti': { labelsOnly: true },
  'ma-minggu-akademik': { cols: /^(TARIKH|CATATAN)$/i },
  'jadual-bertugas-1': { cols: /^TARIKH$/i },
  'jadual-bertugas-2': { cols: /^TARIKH$/i },
  'jadual-bertugas-ppki': { cols: /^TARIKH$/i },
  'pp-erph': { cols: /^(JAN|FEB|MAC|APR|MEI|JUN|JUL|OGO|OGOS|SEP|OKT|NOV|DIS)$/i },
  'pp-pencerapan-guru': { cols: /^PENCERAPAN/i },
  'pp-semakan-hasil': { cols: /^SEMAKAN PENGGAL/i },
  'kk-perhimpunan': { cols: /^TARIKH$/i },
  'kk-takwim': { cols: /^TARIKH$/i, strip: true },
  'k-takwim': { cols: /^TARIKH$/i },
  'pp-takwim': { cols: /^TARIKH$/i },
  'hx-takwim': { cols: /^TARIKH$/i },
  'pk-takwim': { cols: /^TARIKH$/i },
  'pra-takwim': { cols: /^TARIKH$/i },
};

function clearTable(b: TableBlock, rule: ClearRule): TableBlock {
  const rows = b.rows.map((r) =>
    r.map((cell, ci) => {
      if (rule.cols && rule.cols.test(b.columns[ci] ?? '')) return '';
      if (rule.labelsOnly) return ci === 0 ? stripDates(cell) : '';
      if (rule.strip) {
        // bilangan hari/minggu bergantung pada tarikh; nombor lain (cth. BIL. PERJUMPAAN) dikekalkan
        if (/JUMLAH|HARI|MINGGU/i.test(b.columns[ci] ?? '') && /^\s*\**\s*\d+\s*\**\s*$/.test(cell)) return '';
        return stripDates(cell);
      }
      return cell;
    }),
  );
  return { ...b, rows };
}

/* ------------------------------------------------------------------ satu halaman / seluruh buku */

export interface SectionRollover { section: SectionContent; regenerated: boolean; cleared: boolean }

/** Gulung satu halaman ke tahun baharu (tanpa tanda semakan). */
export function rolloverSection(id: string, sec: SectionContent, from: number, to: number): SectionRollover {
  // Halaman kalendar rasmi tahun baharu (jika data tersedia): dijana sepenuhnya.
  // Halaman Kurikulum Persekolahan 2027: nama kurikulum, bukan tahun edisi — kekal tanpa diubah.
  if (id.startsWith('ma-kp2027')) return { section: sec, regenerated: false, cleared: false };
  const gen = academicSection(id, sec, to);
  if (gen) return { section: gen, regenerated: true, cleared: false };
  let regenerated = false;
  let cleared = false;
  const rule = DATE_PAGES[id];
  let lastMonth = -1;
  const blocks = sec.blocks.map((b0) => {
    let b = swapBlock(b0, from, to);
    if (b.type === 'heading') {
      const m = monthIndex(b.text);
      if (m >= 0) lastMonth = m;
    }
    if (b.type === 'table' && b.columns.length === 7 && b.columns.join('') === 'ISRKJSA' && lastMonth >= 0) {
      b = { ...b, rows: markGrid(monthGrid(to, lastMonth), to, lastMonth) };
      regenerated = true;
    } else if (b.type === 'takwim') {
      const m = monthIndex(b.title);
      if (m >= 0) {
        b = { ...(b as TakwimBlock), rows: markTakwimRows(takwimRows(to, m, b.columns.length), to, m) };
        regenerated = true;
      }
    } else if (b.type === 'table' && rule) {
      const next = clearTable(b, rule);
      if (JSON.stringify(next.rows) !== JSON.stringify(b.rows)) cleared = true;
      b = next;
    }
    return b;
  });
  // Kalendar berserlah: petunjuk warna di hujung halaman
  const legend = regenerated && hasAcademic(to) && blocks.some((b) => b.type === 'table' && b.columns.join('') === 'ISRKJSA') && !blocks.some((b) => (b.type === 'list' && b.items.some((x) => x.includes('[[cal:'))) || (b.type === 'paragraph' && b.text.includes('[[cal:')));
  const out = legend ? [...blocks, legendBlock(to)] : blocks;
  return { section: { ...sec, title: swapYear(sec.title, from, to), subtitle: swapYear(sec.subtitle, from, to), blocks: out }, regenerated, cleared };
}

export interface BookData { cover: CoverContent; sections: Record<string, SectionContent>; outline: OutlinePart[] }
export interface RolloverSummary { from: number; to: number; pages: number; regenerated: string[]; cleared: string[] }

/** Cipta edisi tahun `to` daripada buku tahun `from`. Semua halaman dalam struktur ditandakan "perlu dikemas kini". */
export function rolloverBook(data: BookData, from: number, to: number, at = Date.now()): { data: BookData; summary: RolloverSummary } {
  const review: ReviewMark = { year: to, status: 'perlu' };
  const ids = new Set(allIds(data.outline));
  const regenerated: string[] = [];
  const cleared: string[] = [];
  const sections: Record<string, SectionContent> = {};
  for (const [id, sec] of Object.entries(data.sections)) {
    const res = rolloverSection(id, sec, from, to);
    if (res.regenerated) regenerated.push(id);
    if (res.cleared) cleared.push(id);
    // updatedAt ditetapkan supaya migrasi akan datang tidak menggantikan kandungan edisi baharu dengan kandungan lalai 2026.
    sections[id] = { ...res.section, updatedAt: at, ...(ids.has(id) ? { review: { ...review } } : {}) };
  }
  const outline = data.outline.map((p) => ({ ...p, title: swapYear(p.title, from, to), note: swapYear(p.note, from, to) }));
  const cover: CoverContent = {
    ...data.cover,
    title: swapYear(data.cover.title, from, to),
    subtitle: swapYear(data.cover.subtitle, from, to),
    updatedAt: at,
    review: { ...review },
  };
  // Jadual guru bertugas mengikut kalendar rasmi tahun baharu (jika tersedia)
  for (const [id, sec] of Object.entries(dutyRosterSections(sections, to))) {
    sections[id] = sec;
    if (!regenerated.includes(id)) regenerated.push(id);
  }
  return { data: { cover, sections, outline }, summary: { from, to, pages: ids.size + 1, regenerated, cleared } };
}

/** Kandungan lalai (tahun BASE_YEAR) digulung ke tahun edisi semasa - digunakan oleh "Set semula" dalam edisi baharu. */
export function defaultForYear(id: string, sec: SectionContent, year: number): SectionContent {
  let out = sec;
  for (let y = BASE_YEAR; y < year; y++) out = rolloverSection(id, out, y, y + 1).section;
  return out;
}
