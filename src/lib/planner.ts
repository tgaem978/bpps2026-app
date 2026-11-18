/* Planner guru bulanan: data setiap hari dijana daripada Takwim Induk (selepas lajur unit dipautkan daripada takwim unit),
 * supaya hari cuti & aktiviti sekolah hanya dikemas kini di satu tempat. */
import type { PlannerDay, PlannerMonth, SectionContent, TakwimBlock } from '@/types/book';
import { monthOf } from '@/lib/takwimLink';

const HOLIDAY = new Set(['umum', 'perayaan', 'sekolah', 'holiday']);
export const isHolidayKind = (k?: string) => !!k && HOLIDAY.has(k);

/** Warna unit (lajur Takwim Induk). */
export const UNIT_COLORS: Record<string, string> = {
  PENTADBIRAN: '#0B2A5B',
  KURIKULUM: '#1E7A46',
  'HAL EHWAL MURID': '#C2410C',
  KOKURIKULUM: '#0E7C86',
  PPKI: '#B0306F',
};
const FALLBACK = ['#0B2A5B', '#1E7A46', '#C2410C', '#0E7C86', '#B0306F', '#6B4E16'];
export const unitColor = (name: string, i: number) => UNIT_COLORS[name.trim().toUpperCase()] ?? FALLBACK[i % FALLBACK.length];
/** Label pendek unit untuk petunjuk. */
export const unitShort = (name: string) => ({ 'HAL EHWAL MURID': 'HEM', KOKURIKULUM: 'KOKU', PENTADBIRAN: 'PENTADBIRAN', KURIKULUM: 'KURIKULUM', PPKI: 'PPKI' } as Record<string, string>)[name.trim().toUpperCase()] ?? name;

function monthPlan(b: TakwimBlock, m: number, fallbackYear: number): PlannerMonth {
  const year = Number(b.rows.find((r) => /(19|20)\d\d/.test(r.date))?.date.match(/(19|20)\d\d/)?.[0] ?? fallbackYear);
  const days: PlannerDay[] = b.rows.map((r) => {
    const d = Number(r.date.match(/\d{1,2}/)?.[0] ?? 0);
    const acts = r.span !== undefined && isHolidayKind(r.kind) ? [] : b.columns.flatMap((_, u) => (r.cells[u] ?? '').split('\n').map((t) => t.replace(/^\s*[-•]\s*/, '').trim()).filter(Boolean).map((t) => ({ u, t })));
    return { d, dow: new Date(Date.UTC(year, m, d)).getUTCDay(), week: r.week, ...(r.kind && r.kind !== 'weekend' ? { kind: r.kind } : r.kind === 'weekend' ? { kind: r.kind } : {}), ...(r.span?.trim() ? { label: r.span.trim() } : {}), acts };
  }).filter((x) => x.d > 0);
  return { year, month: m, units: [...b.columns], days };
}

let memo: { masters: SectionContent[]; planners: SectionContent[]; out: Record<string, SectionContent> } | null = null;

/** Isikan data bulan (plan) pada blok Planner daripada Takwim Induk bulan yang sama. */
export function linkPlannerSections(sections: Record<string, SectionContent>, fallbackYear: number): Record<string, SectionContent> {
  const plannerIds = Object.keys(sections).filter((id) => sections[id].blocks.some((b) => b.type === 'planner'));
  if (!plannerIds.length) return sections;
  const masterIds = Object.keys(sections).filter((id) => sections[id].blocks.some((b) => b.type === 'takwim'));
  const masters = masterIds.map((id) => sections[id]);
  const planners = plannerIds.map((id) => sections[id]);
  if (memo && memo.masters.length === masters.length && memo.masters.every((s, i) => s === masters[i]) && memo.planners.length === planners.length && memo.planners.every((s, i) => s === planners[i])) {
    return { ...sections, ...memo.out };
  }
  const byMonth = new Map<number, TakwimBlock>();
  for (const sec of masters) for (const b of sec.blocks) {
    if (b.type !== 'takwim') continue;
    const m = monthOf(b.title.trim().split(/\s+/)[0] ?? '');
    if (m >= 0 && !byMonth.has(m)) byMonth.set(m, b);
  }
  const out: Record<string, SectionContent> = {};
  for (const id of plannerIds) {
    const sec = sections[id];
    out[id] = {
      ...sec,
      blocks: sec.blocks.map((b) => {
        if (b.type !== 'planner') return b;
        const t = byMonth.get(b.month);
        const plan: PlannerMonth = t ? monthPlan(t, b.month, fallbackYear) : emptyMonth(fallbackYear, b.month);
        return { ...b, plan };
      }),
    };
  }
  memo = { masters, planners, out };
  return { ...sections, ...out };
}

function emptyMonth(year: number, m: number): PlannerMonth {
  const n = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
  return { year, month: m, units: [], days: Array.from({ length: n }, (_, i) => { const dow = new Date(Date.UTC(year, m, i + 1)).getUTCDay(); return { d: i + 1, dow, week: '', ...(dow === 0 || dow === 6 ? { kind: 'weekend' as const } : {}), acts: [] }; }) };
}

/** Tarikh penting bulan ini: hari cuti / acara seluruh sekolah berturutan digabung ("6 – 14 · CUTI PENGGAL 1"). */
export function importantDates(p: PlannerMonth): { from: number; to: number; label: string; kind?: string }[] {
  const out: { from: number; to: number; label: string; kind?: string }[] = [];
  for (const x of p.days) {
    if (!x.label) continue;
    const last = out[out.length - 1];
    if (last && last.label === x.label && last.to === x.d - 1) last.to = x.d;
    else out.push({ from: x.d, to: x.d, label: x.label, kind: x.kind });
  }
  return out;
}
