/* Takwim Tahunan setiap unit = sumber Takwim Induk Sekolah.
 * Kandungan lalai: aktiviti setiap lajur Takwim Induk 2026 dipindahkan ke takwim unit masing-masing;
 * Takwim Induk kemudiannya berpaut (lajur unit dijana automatik). */
import type { Block, SectionContent, TableBlock, TakwimBlock } from '@/types/book';
import { uid } from '@/lib/blocks';
import { MONTH_FULL, extractColumn, monthOf, parseTarikh } from '@/lib/takwimLink';

const COLS = ['BULAN', 'TARIKH', 'PROGRAM / AKTIVITI', 'TINDAKAN'];
const WIDTHS = [14, 15, 46, 25];
export const MASTER_IDS = Array.from({ length: 12 }, (_, i) => `takwim-${String(i + 1).padStart(2, '0')}`);

const note = (unit: string, col: string): Block => ({
  id: uid(), type: 'paragraph', align: 'justify',
  text: `Takwim ini diisi dan dikemas kini oleh **Unit ${unit}**. Setiap aktiviti yang bertarikh dimuatkan secara automatik ke dalam **Takwim Induk Sekolah** (lajur ${col}). Tarikh boleh ditulis seperti "13 Jan", "13 - 16 Jan" atau "21.1.2026".`,
});
const table = (rows: string[][]): TableBlock => ({
  id: uid(), type: 'table', style: 'navy', numbered: false, columns: [...COLS], rows, colWidths: [...WIDTHS], colAlign: ['left', 'center', 'left', 'left'],
});
const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');

/** Bina semula takwim unit & tandakan Takwim Induk sebagai berpaut. */
export function takwimUnitSections(all: Record<string, SectionContent>): Record<string, SectionContent> {
  const masters = MASTER_IDS.map((id) => all[id]?.blocks.find((b): b is TakwimBlock => b.type === 'takwim')).filter((b): b is TakwimBlock => !!b);
  if (!masters.length) return {};
  const rows = (col: string) => extractColumn(masters, col).map((r) => [...r, '']);
  const out: Record<string, SectionContent> = {};
  const page = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: '', layout: 'standard', blocks, updatedAt: null });

  out['pp-takwim'] = page('TAKWIM TAHUNAN UNIT PENGURUSAN & PENTADBIRAN 2026', [note('Pengurusan & Pentadbiran', 'PENTADBIRAN'), table(rows('PENTADBIRAN'))]);
  out['hx-takwim'] = page('TAKWIM TAHUNAN UNIT HAL EHWAL MURID 2026', [note('Hal Ehwal Murid', 'HAL EHWAL MURID'), table(rows('HAL EHWAL MURID'))]);

  // Kurikulum: aktiviti bertarikh daripada Takwim Induk + TINDAKAN daripada senarai aktiviti tahunan sedia ada
  const kOld = all['k-takwim']?.blocks.find((b): b is TableBlock => b.type === 'table');
  const kRows = rows('KURIKULUM');
  const used = new Set<number>();
  if (kOld) {
    for (const r of kRows) {
      const i = kOld.rows.findIndex((o, j) => !used.has(j) && (norm(o[0]).includes(norm(r[2])) || norm(r[2]).includes(norm(o[0]))));
      if (i >= 0) { used.add(i); r[3] = kOld.rows[i][1] ?? ''; }
    }
    kOld.rows.forEach((o, j) => { if (!used.has(j) && o[0]?.trim()) kRows.push(['', '', o[0], o[1] ?? '']); });
  }
  if (all['k-takwim']) out['k-takwim'] = { ...all['k-takwim'], title: 'TAKWIM TAHUNAN UNIT KURIKULUM 2026', blocks: [note('Kurikulum', 'KURIKULUM'), table(kRows)] };

  // Kokurikulum: jadual aktiviti di atas; jadual perjumpaan & perhimpunan sedia ada dikekalkan
  if (all['kk-takwim']) out['kk-takwim'] = { ...all['kk-takwim'], blocks: [note('Kokurikulum', 'KOKURIKULUM'), { id: uid(), type: 'heading', text: 'TAKWIM AKTIVITI KOKURIKULUM' }, table(rows('KOKURIKULUM')), ...all['kk-takwim'].blocks] };

  // PPKI: aktiviti Takwim Induk + aktiviti takwim PPKI sedia ada yang belum tersenarai
  const pOld = all['pk-takwim']?.blocks.find((b): b is TableBlock => b.type === 'table');
  const pRows = rows('PPKI');
  if (pOld) {
    // aktiviti takwim PPKI lama ditambah hanya jika tiada aktiviti Takwim Induk pada tarikh yang sama (elak ulangan ejaan berbeza)
    const have = new Set(pRows.map((r) => norm(r[2])));
    const busy = new Set<string>();
    let pm = -1;
    for (const r of pRows) { if (r[0]) pm = monthOf(r[0]); parseTarikh(r[1], pm).forEach((x) => busy.add(`${x.m}-${x.d}`)); }
    let month = '';
    for (const o of pOld.rows) {
      if (o[0]?.trim()) month = o[0].trim();
      const days = parseTarikh(o[1] ?? '', monthOf(month));
      if (o[2]?.trim() && !have.has(norm(o[2])) && !days.some((x) => busy.has(`${x.m}-${x.d}`))) pRows.push([month, o[1] ?? '', o[2], '']);
    }
    // susun ikut tarikh; label BULAN hanya pada baris pertama setiap bulan
    const first = (r: string[], m: number) => { const x = parseTarikh(r[1], m)[0]; return x ? x.m * 40 + x.d : m * 40 + 39; };
    let cm = -1;
    const keyed = pRows.map((r) => { if (r[0]) cm = monthOf(r[0]); return { r, k: first(r, cm), m: cm }; });
    keyed.sort((a, b) => a.k - b.k);
    let last = -1;
    pRows.splice(0, pRows.length, ...keyed.map(({ r, m }) => { const out = [m !== last && m >= 0 ? MONTH_FULL[m] : '', r[1], r[2], r[3]]; last = m; return out; }));
  }
  if (all['pk-takwim']) out['pk-takwim'] = { ...all['pk-takwim'], blocks: [note('Pendidikan Khas', 'PPKI'), table(pRows)] };

  // Takwim Induk: berpaut; lajur unit dikosongkan (diisi automatik daripada takwim unit)
  for (const id of MASTER_IDS) {
    const sec = all[id];
    if (!sec) continue;
    out[id] = { ...sec, blocks: sec.blocks.map((b) => (b.type === 'takwim' ? { ...b, linked: true, rows: b.rows.map((r) => ({ ...r, cells: r.cells.map(() => '') })) } : b)) };
  }
  return out;
}
