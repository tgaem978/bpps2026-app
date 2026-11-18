/* Kalendar Akademik rasmi mengikut tahun (Kumpulan B — Wilayah Persekutuan Kuala Lumpur).
 * Digunakan semasa menjana edisi tahun berkenaan: Kalendar Akademik, Cuti Perayaan & Cuti Kelepasan Am, Minggu Akademik,
 * Kalendar (serlahan cuti) dan Takwim Induk (baris cuti / minggu persekolahan). */
import type { Block, SectionContent, TableBlock, TakwimRow } from '@/types/book';
import { uid } from '@/lib/blocks';

/** u = cuti kelepasan am (WP KL), p = cuti perayaan tambahan KPM, s = cuti persekolahan (penggal / pertengahan / akhir tahun). */
export type DayKind = 'u' | 'p' | 's';
export const DAY_KIND_LABEL: Record<DayKind, string> = {
  u: 'Cuti Kelepasan Am (WP Kuala Lumpur)',
  p: 'Cuti Perayaan Tambahan KPM (Kumpulan B)',
  s: 'Cuti Persekolahan',
};

interface Segment { rows: [string, string, number][]; total: number; weeks: number; brk: [string, string, string, number, number] }
interface AcademicYear {
  year: number;
  /** Penggal → segmen persekolahan (julat bulanan + jumlah) dan cuti selepasnya. */
  penggal: { label: string; segments: Segment[] }[];
  /** Cuti persekolahan sebelum sesi bermula (sambungan cuti akhir tahun sebelumnya). */
  preBreak?: [string, string, string];
  /** Cuti kelepasan am WP Kuala Lumpur: [tarikh, nama, catatan]; * = tertakluk pengisytiharan rasmi (kalendar Hijrah). */
  umum: [string, string, string?][];
  /** Cuti perayaan tambahan KPM bagi Kumpulan B: [tarikh, perayaan]. */
  perayaan: [string, string][];
  /** Jadual Cuti Perayaan (Kumpulan B): [perayaan + tarikh, tambahan KPM, catatan]. */
  perayaanTable: [string, string, string][];
  /** Catatan perayaan yang jatuh dalam cuti persekolahan. */
  catatan: [string, string][];
}

const Y2027: AcademicYear = {
  year: 2027,
  penggal: [
    {
      label: 'PENGGAL 1',
      segments: [
        { rows: [['04.01.2027', '31.01.2027', 20], ['01.02.2027', '28.02.2027', 14], ['01.03.2027', '05.03.2027', 5]], total: 39, weeks: 9, brk: ['CUTI PENGGAL 1', '06.03.2027', '14.03.2027', 9, 1] },
        { rows: [['15.03.2027', '31.03.2027', 13], ['01.04.2027', '30.04.2027', 22], ['01.05.2027', '21.05.2027', 10]], total: 45, weeks: 10, brk: ['CUTI PERTENGAHAN TAHUN', '22.05.2027', '06.06.2027', 16, 2] },
      ],
    },
    {
      label: 'PENGGAL 2',
      segments: [
        { rows: [['07.06.2027', '30.06.2027', 17], ['01.07.2027', '31.07.2027', 22], ['01.08.2027', '27.08.2027', 19]], total: 58, weeks: 12, brk: ['CUTI PENGGAL 2', '28.08.2027', '05.09.2027', 9, 1] },
        { rows: [['06.09.2027', '30.09.2027', 18], ['01.10.2027', '31.10.2027', 18], ['01.11.2027', '30.11.2027', 22], ['01.12.2027', '03.12.2027', 3]], total: 61, weeks: 13, brk: ['CUTI AKHIR PERSEKOLAHAN', '04.12.2027', '31.12.2027', 28, 4] },
      ],
    },
  ],
  preBreak: ['Cuti Akhir Persekolahan 2026', '01.01.2027', '03.01.2027'],
  umum: [
    ['01.01.2027', 'Tahun Baharu'],
    ['22.01.2027', 'Hari Thaipusam'],
    ['01.02.2027', 'Hari Wilayah Persekutuan'],
    ['06.02.2027', 'Tahun Baru Cina'],
    ['07.02.2027', 'Tahun Baru Cina (Hari Kedua)'],
    ['08.02.2027', 'Cuti Ganti Tahun Baru Cina'],
    ['24.02.2027', 'Nuzul Al-Quran', '*'],
    ['10.03.2027', 'Hari Raya Aidilfitri', '*'],
    ['11.03.2027', 'Hari Raya Aidilfitri (Hari Kedua)', '*'],
    ['01.05.2027', 'Hari Pekerja'],
    ['17.05.2027', 'Hari Raya Aidiladha', '*'],
    ['20.05.2027', 'Hari Wesak'],
    ['06.06.2027', 'Awal Muharram', '*'],
    ['07.06.2027', 'Hari Keputeraan Yang di-Pertuan Agong'],
    ['15.08.2027', 'Maulidur Rasul', '*'],
    ['16.08.2027', 'Cuti Ganti Maulidur Rasul', '*'],
    ['31.08.2027', 'Hari Kebangsaan'],
    ['16.09.2027', 'Hari Malaysia'],
    ['28.10.2027', 'Hari Deepavali'],
    ['25.12.2027', 'Hari Krismas'],
  ],
  perayaan: [
    ['05.02.2027', 'Tahun Baru Cina'], ['09.02.2027', 'Tahun Baru Cina'], ['10.02.2027', 'Tahun Baru Cina'], ['11.02.2027', 'Tahun Baru Cina'], ['12.02.2027', 'Tahun Baru Cina'],
    ['18.05.2027', 'Hari Raya Aidiladha'], ['19.05.2027', 'Hari Raya Aidiladha'],
    ['21.05.2027', 'Hari Wesak'],
    ['27.10.2027', 'Hari Deepavali'], ['29.10.2027', 'Hari Deepavali'],
  ],
  perayaanTable: [
    ['**TAHUN BARU CINA**\n06.02.2027 (Sabtu) dan\n07.02.2027 (Ahad)', '05.02.2027 (Jumaat)\n09.02.2027 (Selasa)\n10.02.2027 (Rabu)\n11.02.2027 (Khamis)\n12.02.2027 (Jumaat)', 'Lima (5) Hari Cuti Tambahan KPM untuk Kumpulan B\n(08.02.2027 ialah cuti ganti kelepasan am)'],
    ['**HARI RAYA AIDILFITRI**\n10.03.2027 (Rabu) dan\n11.03.2027 (Khamis)', '–', 'Dalam Cuti Penggal 1, Tahun 2027\n(tiada cuti tambahan KPM untuk Kumpulan B)'],
    ['**HARI RAYA AIDILADHA**\n17.05.2027 (Isnin)', '18.05.2027 (Selasa)\n19.05.2027 (Rabu)', 'Dua (2) Hari Cuti Tambahan KPM untuk Kumpulan B'],
    ['**HARI WESAK**\n20.05.2027 (Khamis)', '21.05.2027 (Jumaat)', 'Satu (1) Hari Cuti Tambahan KPM untuk Kumpulan B'],
    ['**HARI DEEPAVALI**\n28.10.2027 (Khamis)', '27.10.2027 (Rabu)\n29.10.2027 (Jumaat)', 'Dua (2) Hari Cuti Tambahan KPM untuk Kumpulan B\n(semua negeri Kumpulan B kecuali Sarawak)'],
  ],
  catatan: [
    ['Perayaan Hari Raya Aidilfitri', '10 & 11 Mac 2027\n(Dalam Cuti Penggal 1, Tahun 2027)'],
    ['Pesta Kaamatan\n(Sabah dan WP Labuan sahaja)', '30 & 31 Mei 2027\n(Dalam Cuti Pertengahan Tahun 2027)'],
    ['Perayaan Hari Gawai Dayak\n(Sarawak sahaja)', '01 & 02 Jun 2027\n(Dalam Cuti Pertengahan Tahun 2027)'],
    ['Perayaan Hari Krismas', '25 Disember 2027\n(Dalam Cuti Akhir Persekolahan Tahun 2027)'],
  ],
};

export const ACADEMIC: Record<number, AcademicYear> = { 2027: Y2027 };
export const hasAcademic = (year: number) => !!ACADEMIC[year];

/* ------------------------------------------------------------------ tarikh */
const DAYS = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
const MON_SHORT = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
const DAY_MS = 86400000;
const parse = (d: string) => { const [dd, mm, yy] = d.split('.').map(Number); return Date.UTC(yy, mm - 1, dd); };
const dow = (t: number) => new Date(t).getUTCDay();
const dayName = (d: string) => DAYS[dow(parse(d))];
const short = (t: number) => { const x = new Date(t); return `${String(x.getUTCDate()).padStart(2, '0')} ${MON_SHORT[x.getUTCMonth()]}`; };

export interface DayInfo { kind: DayKind; names: string[] }

/** Peta hari cuti setahun (kunci = UTC ms). Keutamaan: kelepasan am > perayaan KPM > cuti persekolahan. */
export function dayMap(year: number): Map<number, DayInfo> {
  const a = ACADEMIC[year];
  const out = new Map<number, DayInfo>();
  if (!a) return out;
  const rank: Record<DayKind, number> = { u: 3, p: 2, s: 1 };
  const put = (t: number, kind: DayKind, name: string) => {
    const cur = out.get(t);
    if (!cur) { out.set(t, { kind, names: [name] }); return; }
    if (!cur.names.includes(name)) cur.names.push(name);
    if (rank[kind] > rank[cur.kind]) cur.kind = kind;
  };
  const range = (from: string, to: string, name: string) => { for (let t = parse(from); t <= parse(to); t += DAY_MS) put(t, 's', name); };
  if (a.preBreak) range(a.preBreak[1], a.preBreak[2], a.preBreak[0]);
  for (const p of a.penggal) for (const s of p.segments) range(s.brk[1], s.brk[2], `${s.brk[0]} ${year}`);
  for (const [d, name] of a.perayaan) put(parse(d), 'p', `Cuti Tambahan KPM (${name})`);
  for (const [d, name] of a.umum) put(parse(d), 'u', name);
  return out;
}

/** Minggu persekolahan: [isnin, nombor MP]. */
function schoolWeeks(a: AcademicYear): [number, number][] {
  const out: [number, number][] = [];
  let n = 0;
  for (const p of a.penggal) for (const s of p.segments) {
    const start = parse(s.rows[0][0]);
    const last = parse(s.rows[s.rows.length - 1][1]);
    for (let t = start - ((dow(start) + 6) % 7) * DAY_MS; t <= last; t += 7 * DAY_MS) out.push([t, ++n]);
  }
  return out;
}

/* ------------------------------------------------------------------ halaman */
const tbl = (columns: string[], rows: string[][], opts: Partial<TableBlock> = {}): Block => ({ id: uid(), type: 'table', style: 'navy', numbered: false, columns, rows, ...opts });
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const STATES_B = 'Sekolah-sekolah di negeri Johor, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Wilayah Persekutuan Kuala Lumpur, Wilayah Persekutuan Labuan dan Wilayah Persekutuan Putrajaya.';

function akademik(a: AcademicYear, base: SectionContent): SectionContent {
  const rows: string[][] = [];
  let days = 0;
  let weeks = 0;
  for (const pg of a.penggal) {
    pg.segments.forEach((s, si) => {
      s.rows.forEach(([f, t, n], ri) => rows.push([si === 0 && ri === 0 ? pg.label : '', f, t, String(n), ri === 0 ? String(s.weeks) : '']));
      rows.push(['', '**JUMLAH HARI**', '', `**${s.total}**`, '']);
      rows.push(['', `**${s.brk[0]} ${a.year}**`, `**${s.brk[1]} - ${s.brk[2]}**`, String(s.brk[3]), String(s.brk[4])]);
      days += s.total;
      weeks += s.weeks;
    });
  }
  rows.push(['', '**JUMLAH HARI & MINGGU PERSEKOLAHAN**', '', `**${days}**`, `**${weeks}**`]);
  return {
    ...base,
    title: `KALENDAR AKADEMIK ${a.year}`,
    blocks: [
      h(`KUMPULAN B — WILAYAH PERSEKUTUAN KUALA LUMPUR`),
      tbl(['PENGGAL', 'MULA PERSEKOLAHAN', 'AKHIR PERSEKOLAHAN', 'JUMLAH HARI', 'JUMLAH MINGGU'], rows, { colWidths: [16, 30, 30, 12, 12], colAlign: ['left', 'center', 'center', 'center', 'center'] }),
      p(STATES_B),
    ],
  };
}

function cuti(a: AcademicYear, base: SectionContent): SectionContent {
  const umumRows = a.umum.map(([d, name, star]) => {
    const t = parse(d);
    const inBreak = dayMap(a.year).get(t);
    const note = dow(t) === 0 || dow(t) === 6 ? 'Hujung minggu' : inBreak && inBreak.names.some((n) => /^CUTI /.test(n)) ? 'Dalam cuti persekolahan' : '';
    return [d, dayName(d), `${name}${star ? ' *' : ''}`, note];
  });
  return {
    ...base,
    title: `CUTI PERAYAAN ${a.year}`,
    blocks: [
      h('TAMBAHAN CUTI PERAYAAN YANG DIPERUNTUKKAN OLEH KPM (KUMPULAN B)'),
      tbl(['CUTI PERAYAAN', 'TAMBAHAN CUTI KPM\nKUMPULAN B', 'CATATAN'], a.perayaanTable.map((r) => [...r]), { colWidths: [32, 28, 40], colAlign: ['left', 'center', 'left'] }),
      h('CATATAN'),
      tbl(['PERAYAAN', 'TARIKH'], a.catatan.map((r) => [...r]), { colWidths: [50, 50] }),
      h(`CUTI KELEPASAN AM ${a.year} — WILAYAH PERSEKUTUAN KUALA LUMPUR`),
      tbl(['TARIKH', 'HARI', 'CUTI KELEPASAN AM', 'CATATAN'], umumRows, { numbered: true, colWidths: [18, 14, 44, 24], colAlign: ['center', 'center', 'left', 'center'] }),
      p('* Tarikh berdasarkan kalendar Hijrah tertakluk kepada pengisytiharan rasmi (Penyimpan Mohor Besar Raja-Raja / Warta Kerajaan). Sila sahkan dengan senarai rasmi Jabatan Perdana Menteri sebelum dicetak.'),
    ],
  };
}

function minggu(a: AcademicYear, base: SectionContent): SectionContent {
  const map = dayMap(a.year);
  const rows = schoolWeeks(a).map(([mon, n]) => {
    const notes: string[] = [];
    for (let i = 0; i < 5; i++) {
      const t = mon + i * DAY_MS;
      const info = map.get(t);
      if (info && info.kind !== 's') notes.push(`${new Date(t).getUTCDate()} ${MON_SHORT[new Date(t).getUTCMonth()]} – ${info.names.join(' / ')}`);
    }
    return [`MP${n}`, `MA${n}`, `${short(mon)} – ${short(mon + 4 * DAY_MS)}`, notes.join('\n')];
  });
  return {
    ...base,
    title: `MINGGU AKADEMIK ${a.year} (NEGERI KUMPULAN B)`,
    blocks: [
      p(`Minggu persekolahan (MP) dan minggu akademik (MA) sesi ${a.year} mengikut Kalendar Akademik ${a.year} (Kumpulan B). Tarikh ialah Isnin hingga Jumaat; catatan menyenaraikan cuti kelepasan am WP Kuala Lumpur dan cuti perayaan tambahan KPM dalam minggu tersebut.`),
      tbl(['MP', 'MA', 'TARIKH', 'CATATAN'], rows, { colWidths: [10, 10, 28, 52], colAlign: ['center', 'center', 'center', 'left'] }),
    ],
  };
}

/** Halaman yang dijana sepenuhnya daripada data kalendar rasmi tahun berkenaan. */
export function academicSection(id: string, base: SectionContent, year: number): SectionContent | null {
  const a = ACADEMIC[year];
  if (!a) return null;
  if (id === 't-akademik') return akademik(a, base);
  if (id === 't-cuti') return cuti(a, base);
  if (id === 'ma-minggu-akademik') return minggu(a, base);
  return null;
}

/** Grid kalendar bulanan dengan kod serlahan: "8u" (kelepasan am), "9p" (perayaan KPM), "6s" (cuti persekolahan). */
export function markGrid(grid: string[][], year: number, month: number): string[][] {
  const map = dayMap(year);
  if (!map.size) return grid;
  return grid.map((r) => r.map((c) => {
    const d = Number(c);
    const info = d ? map.get(Date.UTC(year, month, d)) : undefined;
    return info ? `${d}${info.kind}` : c;
  }));
}

/** Petunjuk warna di hujung halaman Kalendar (satu perenggan padat supaya muat bersama 12 bulan). */
export const legendBlock = (_year: number): Block => ({
  id: uid(), type: 'paragraph', align: 'left',
  text: `**PETUNJUK:** [[cal:u]]Kelepasan Am  [[cal:p]]Perayaan KPM\n[[cal:s]]Cuti Persekolahan  [[cal:w]]Hujung minggu`,
});

/** Takwim Induk: baris cuti ditanda (merentas semua unit) dan nombor minggu persekolahan diisi. */
export function markTakwimRows(rows: TakwimRow[], year: number, month: number): TakwimRow[] {
  const a = ACADEMIC[year];
  if (!a) return rows;
  const map = dayMap(year);
  const weeks = schoolWeeks(a);
  return rows.map((r) => {
    const d = Number(r.date.match(/\d{1,2}/)?.[0] ?? 0);
    if (!d) return r;
    const t = Date.UTC(year, month, d);
    const wk = weeks.find(([mon]) => t >= mon && t < mon + 7 * DAY_MS);
    const info = map.get(t);
    const out: TakwimRow = { ...r, week: wk ? String(wk[1]) : '' };
    if (info) {
      out.kind = 'holiday';
      if (out.span === undefined && !r.cells.some((c) => c.trim())) out.span = info.names.join(' / ').toUpperCase();
    }
    return out;
  });
}
