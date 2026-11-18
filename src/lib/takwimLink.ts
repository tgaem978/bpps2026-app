/* Takwim Induk berpaut: setiap unit menyunting TAKWIM TAHUNAN UNIT masing-masing (jadual BULAN | TARIKH | PROGRAM / AKTIVITI);
 * lajur unit dalam Takwim Induk Sekolah (takwim-01 … takwim-12) dijana secara automatik daripada jadual tersebut.
 * Baris cuti / acara seluruh sekolah (span) kekal diurus terus dalam Takwim Induk oleh pentadbir. */
import type { Block, SectionContent, TableBlock, TakwimBlock } from '@/types/book';

/** Lajur Takwim Induk → halaman sumber (takwim unit) dan awalan teks (jika perlu). */
export const TAKWIM_SOURCES: Record<string, { id: string; prefix?: string }[]> = {
  PENTADBIRAN: [{ id: 'pp-takwim' }],
  KURIKULUM: [{ id: 'k-takwim' }, { id: 'pra-takwim', prefix: 'Prasekolah: ' }],
  'HAL EHWAL MURID': [{ id: 'hx-takwim' }],
  KOKURIKULUM: [{ id: 'kk-takwim' }],
  PPKI: [{ id: 'pk-takwim' }],
};
export const TAKWIM_SOURCE_IDS = Object.values(TAKWIM_SOURCES).flat().map((s) => s.id);
export const sourcesOf = (column: string) => TAKWIM_SOURCES[column.trim().toUpperCase()] ?? [];

const MONTH_KEYS = ['jan', 'feb', 'mac', 'apr', 'mei', 'jun', 'jul', 'ogo', 'sep', 'okt', 'nov', 'dis'];
const ALT: Record<string, number> = { mar: 2, may: 4, aug: 7, oct: 9, dec: 11, ogs: 7 };
export const MONTH_SHORT = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'];
export const MONTH_FULL = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];

/** Indeks bulan (0-11) daripada nama bulan Melayu / Inggeris (penuh atau ringkas); -1 jika tiada. */
export function monthOf(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length < 3) return -1;
  const k = w.slice(0, 3);
  const i = MONTH_KEYS.indexOf(k);
  return i >= 0 ? i : ALT[k] ?? -1;
}

export interface DayRef { m: number; d: number }

/**
 * Tarikh dalam takwim unit → senarai hari. Contoh: "13 Jan", "13 - 16 Jan", "13 & 14 Jan", "28 Jan - 2 Feb",
 * "21.1.2026", "28/01/2026", "12 Januari 2026". Tanpa nama bulan → bulan daripada lajur BULAN.
 */
export function parseTarikh(text: string, fallbackMonth: number): DayRef[] {
  const t = text.replace(/\*\*/g, '').trim();
  if (!t) return [];
  const out: DayRef[] = [];
  // format nombor: 21.1.2026 / 28/01/2026 (boleh julat "21.1 - 23.1.2026")
  const num = [...t.matchAll(/(\d{1,2})[./-](\d{1,2})(?:[./-]\d{2,4})?/g)].map((x) => ({ d: +x[1], m: +x[2] - 1 })).filter((x) => x.m >= 0 && x.m < 12 && x.d >= 1 && x.d <= 31);
  if (num.length) {
    if (num.length === 2 && /\s[-–]\s|\bhingga\b/i.test(t)) return expand(num[0], num[1]);
    return num;
  }
  // format perkataan: token nombor & bulan mengikut turutan
  const tokens = [...t.matchAll(/(\d{1,2})|([A-Za-z]{3,})|([-–]|hingga|&|,|dan)/gi)];
  const parts: { d?: number; m?: number; sep?: string }[] = [];
  for (const x of tokens) {
    if (x[1]) parts.push({ d: +x[1] });
    else if (x[2]) { const m = monthOf(x[2]); if (m >= 0) parts.push({ m }); }
    else if (x[3]) parts.push({ sep: /[-–]|hingga/i.test(x[3]) ? '-' : ',' });
  }
  // beri bulan kepada setiap hari: bulan selepasnya, atau bulan sandaran
  const days: { d: number; m: number; range?: boolean }[] = [];
  let pendingRange = false;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.sep) { if (p.sep === '-' && days.length) pendingRange = true; continue; }
    if (p.d === undefined || p.d < 1 || p.d > 31) continue;
    const nextM = parts.slice(i + 1).find((q) => q.m !== undefined || q.d !== undefined);
    let m = nextM?.m ?? -1;
    if (m < 0) m = parts.slice(i + 1).find((q) => q.m !== undefined)?.m ?? fallbackMonth;
    days.push({ d: p.d, m, range: pendingRange });
    pendingRange = false;
  }
  for (let i = 0; i < days.length; i++) {
    const cur = days[i];
    if (cur.m < 0) continue;
    if (days[i + 1]?.range && days[i + 1].m >= 0) { out.push(...expand(cur, days[i + 1])); i++; continue; }
    out.push({ m: cur.m, d: cur.d });
  }
  return out;
}

function expand(a: DayRef, b: DayRef): DayRef[] {
  const out: DayRef[] = [];
  const y = 2001; // tahun bukan lompat; hanya untuk mengira hari
  let t = Date.UTC(y, a.m, a.d);
  let end = Date.UTC(y, b.m, b.d);
  if (end < t) end = Date.UTC(y + 1, b.m, b.d);
  for (let n = 0; t <= end && n < 62; n++, t += 86400000) { const dt = new Date(t); out.push({ m: dt.getUTCMonth(), d: dt.getUTCDate() }); }
  return out;
}

const isTakwimTable = (b: Block): b is TableBlock => b.type === 'table' && b.columns.some((c) => /TARIKH/i.test(c)) && b.columns.some((c) => /PROGRAM|AKTIVITI/i.test(c));

export interface Entry { t: string; inner: boolean }
/** Aktiviti bertarikh dalam satu halaman takwim unit: kunci "m-d" → senarai aktiviti (inner = hari tengah julat). */
export function unitEntries(sec: SectionContent | undefined, prefix = ''): Map<string, Entry[]> {
  const out = new Map<string, Entry[]>();
  if (!sec) return out;
  for (const b of sec.blocks) {
    if (!isTakwimTable(b)) continue;
    const ti = b.columns.findIndex((c) => /TARIKH/i.test(c));
    const pi = b.columns.findIndex((c) => /PROGRAM|AKTIVITI/i.test(c));
    const bi = b.columns.findIndex((c) => /BULAN/i.test(c));
    let month = -1;
    for (const r of b.rows) {
      if (bi >= 0 && (r[bi] ?? '').trim()) month = monthOf((r[bi] ?? '').trim().split(/\s+/)[0]);
      const what = (r[pi] ?? '').replace(/\*\*/g, '').trim();
      if (!what) continue;
      const days = parseTarikh(r[ti] ?? '', month);
      days.forEach(({ m, d }, i) => {
        const k = `${m}-${d}`;
        const list = out.get(k) ?? [];
        const inner = days.length >= 4 && i > 0 && i < days.length - 1; // julat panjang: hujung minggu di tengah dilangkau
        for (const line of what.split('\n').map((x) => x.trim()).filter(Boolean)) if (!list.some((e) => e.t === prefix + line)) list.push({ t: prefix + line, inner });
        out.set(k, list);
      });
    }
  }
  return out;
}

/** Hari bulan bagi baris Takwim Induk ("12 Jan 2026" → 12). */
const dayOfRow = (date: string) => { const x = date.match(/\d{1,2}/); return x ? +x[0] : -1; };

/** Takwim Induk dengan lajur unit diisi daripada takwim unit (teks manual dalam sel dikekalkan, tanpa ulangan). */
export function linkTakwimBlock(b: TakwimBlock, sections: Record<string, SectionContent>): TakwimBlock {
  const m = monthOf(b.title.trim().split(/\s+/)[0] ?? '');
  if (m < 0) return b;
  const perCol = b.columns.map((c) => sourcesOf(c).map((s) => unitEntries(sections[s.id], s.prefix)));
  if (perCol.every((x) => !x.length)) return b;
  return {
    ...b,
    rows: b.rows.map((r) => {
      const d = dayOfRow(r.date);
      if (d < 0) return r;
      const cells = b.columns.map((_, ci) => {
        const manual = (r.cells[ci] ?? '').split('\n').map((x) => x.trim()).filter(Boolean);
        // hari tengah julat tidak dipaparkan pada hujung minggu / cuti
        const linked = perCol[ci].flatMap((mp) => mp.get(`${m}-${d}`) ?? []).filter((e) => !(e.inner && r.kind)).map((e) => e.t);
        const all = [...manual];
        for (const x of linked) if (!all.some((y) => y.replace(/^-\s*/, '').toLowerCase() === x.toLowerCase())) all.push(x);
        return all.join('\n');
      });
      return { ...r, cells };
    }),
  };
}

let memo: { srcs: (SectionContent | undefined)[]; masters: SectionContent[]; out: Record<string, SectionContent> } | null = null;

/** Gantikan halaman Takwim Induk berpaut dengan versi yang lajur unitnya dijana (memo: objek sama jika sumber tidak berubah). */
export function linkTakwimSections(sections: Record<string, SectionContent>): Record<string, SectionContent> {
  const masterIds = Object.keys(sections).filter((id) => sections[id].blocks.some((b) => b.type === 'takwim' && b.linked));
  if (!masterIds.length) return sections;
  const srcs = TAKWIM_SOURCE_IDS.map((id) => sections[id]);
  const masters = masterIds.map((id) => sections[id]);
  let derived: Record<string, SectionContent>;
  if (memo && memo.srcs.length === srcs.length && memo.srcs.every((s, i) => s === srcs[i]) && memo.masters.length === masters.length && memo.masters.every((s, i) => s === masters[i])) {
    derived = memo.out;
  } else {
    derived = {};
    for (const id of masterIds) {
      const sec = sections[id];
      derived[id] = { ...sec, blocks: sec.blocks.map((b) => (b.type === 'takwim' && b.linked ? linkTakwimBlock(b, sections) : b)) };
    }
    memo = { srcs, masters, out: derived };
  }
  return { ...sections, ...derived };
}

/* ------------------------------------------------------------ ekstrak (kandungan lalai: Takwim Induk → takwim unit) */

/** Aktiviti satu lajur Takwim Induk → baris [BULAN, TARIKH, PROGRAM / AKTIVITI]; hari berturutan dengan aktiviti sama dijadikan julat. */
export function extractColumn(masters: TakwimBlock[], column: string): string[][] {
  const events: { m: number; d: number; text: string }[] = [];
  const off = new Set<number>(); // hujung minggu / cuti (julat boleh merentasinya)
  for (const b of masters) {
    const m = monthOf(b.title.trim().split(/\s+/)[0] ?? '');
    const ci = b.columns.findIndex((c) => c.trim().toUpperCase() === column);
    if (m < 0 || ci < 0) continue;
    for (const r of b.rows) {
      const d = dayOfRow(r.date);
      if (d < 0) continue;
      if (r.kind) off.add(Date.UTC(2001, m, d));
      for (const line of (r.cells[ci] ?? '').split('\n')) {
        const text = line.replace(/^\s*[-•]\s*/, '').trim();
        if (text) events.push({ m, d, text });
      }
    }
  }
  // gabung hari berturutan (boleh merentas hujung minggu / cuti) bagi aktiviti yang sama
  const key = (e: { m: number; d: number }) => Date.UTC(2001, e.m, e.d);
  const groups: { m: number; d: number; m2: number; d2: number; text: string }[] = [];
  for (const e of events) {
    // berturutan: hari esok, atau hanya hujung minggu / cuti di antaranya
    const next = (x: { m2: number; d2: number }) => {
      let t = key({ m: x.m2, d: x.d2 }) + 86400000;
      while (t < key(e) && off.has(t)) t += 86400000;
      return t === key(e);
    };
    const g = [...groups].reverse().find((x) => x.text.toLowerCase() === e.text.toLowerCase() && next(x));
    if (g) { g.m2 = e.m; g.d2 = e.d; } else groups.push({ m: e.m, d: e.d, m2: e.m, d2: e.d, text: e.text });
  }
  groups.sort((a, b) => key(a) - key(b));
  let last = -1;
  return groups.map((g) => {
    const date = g.m === g.m2 && g.d === g.d2 ? `${g.d} ${MONTH_SHORT[g.m]}`
      : g.m === g.m2 ? `${g.d} - ${g.d2} ${MONTH_SHORT[g.m]}` : `${g.d} ${MONTH_SHORT[g.m]} - ${g.d2} ${MONTH_SHORT[g.m2]}`;
    const month = g.m !== last ? MONTH_FULL[g.m] : '';
    last = g.m;
    return [month, date, g.text];
  });
}
