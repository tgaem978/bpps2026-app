/* Istilah carta organisasi & jawatankuasa induk diseragamkan:
 *  - tajuk: "CARTA ORGANISASI UNIT/PROGRAM …" dan "JAWATANKUASA INDUK UNIT/PROGRAM …" (tanpa tahun);
 *  - barisan pentadbir: Pengerusi (Guru Besar) → Timbalan Pengerusi (GPK unit) → Naib Pengerusi (GPK lain, tanpa nombor). */
import type { CommitteeRow, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { member } from '@/config/partKoku';

const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;

/** [ID halaman, tajuk seragam, GPK unit (Timbalan Pengerusi)] */
export const CARTA_SERAGAM: [string, string, string][] = [
  ['pp-carta-pusat-sumber', 'CARTA ORGANISASI PUSAT SUMBER SEKOLAH', PKP],
  ['kx-carta-induk', 'CARTA ORGANISASI UNIT KURIKULUM', PKP],
  ['k-jk-induk', 'JAWATANKUASA INDUK UNIT KURIKULUM', PKP],
  ['hx-carta', 'CARTA ORGANISASI UNIT HAL EHWAL MURID', PKHEM],
  ['hem-jk-induk', 'JAWATANKUASA INDUK UNIT HAL EHWAL MURID', PKHEM],
  ['kx-carta-koku', 'CARTA ORGANISASI UNIT KOKURIKULUM', PKKO],
  ['kk-pembangunan-sukan', 'JAWATANKUASA PEMBANGUNAN SUKAN SEKOLAH', PKKO],
  ['kk-jk-induk', 'JAWATANKUASA INDUK UNIT KOKURIKULUM', PKKO],
  ['pk-jpks', 'JAWATANKUASA PENDIDIKAN KHAS SEKOLAH (JPKS)', PKPK],
  ['pk-carta', 'CARTA ORGANISASI PROGRAM PENDIDIKAN KHAS INTEGRASI', PKPK],
  ['pk-jk-induk', 'JAWATANKUASA INDUK PROGRAM PENDIDIKAN KHAS INTEGRASI', PKPK],
  ['pra-carta', 'CARTA ORGANISASI PRASEKOLAH', PKP],
];

const ADMIN_ROLE = /^(pengerusi|timbalan pengerusi|naib pengerusi(\s*\d+|\s+[ivx]+)?|penolong kanan|setiausaha\s*&\s*penolong kanan)$/i;
const isAdminRow = (r: CommitteeRow) => ADMIN_ROLE.test(r.role.trim()) && !r.group;

const adminRows = (unit: string): CommitteeRow[] => [
  { id: uid(), role: 'Pengerusi', members: [{ kind: 'position', value: GB }] },
  { id: uid(), role: 'Timbalan Pengerusi', members: [{ kind: 'position', value: unit }] },
  { id: uid(), role: 'Naib Pengerusi', members: [PKP, PKHEM, PKKO, PKPTG, PKPK].filter((x) => x !== unit).map((value) => ({ kind: 'position' as const, value })) },
];

/** Seragamkan satu halaman carta / jawatankuasa induk (tajuk + barisan pentadbir; ahli lain tidak diubah). */
export function seragamCarta(id: string, sec: SectionContent): SectionContent {
  const spec = CARTA_SERAGAM.find(([x]) => x === id);
  if (!spec) return sec;
  const [, title, unit] = spec;
  return {
    ...sec,
    title,
    subtitle: '',
    blocks: sec.blocks.map((b) => {
      if (b.type !== 'committee' || b.display !== 'chart') return b;
      const lead = b.rows.findIndex((r) => !isAdminRow(r));
      const rest = lead < 0 ? [] : b.rows.slice(lead);
      // tajuk dalaman yang mengulang tajuk halaman dibuang
      return { ...b, title: /^JAWATANKUASA INDUK/i.test(b.title) ? '' : b.title, focus: unit, rows: [...adminRows(unit), ...rest] };
    }),
  };
}

export const seragamSections = (all: Record<string, SectionContent>): Record<string, SectionContent> => ({
  ...Object.fromEntries(CARTA_SERAGAM.filter(([id]) => all[id]).map(([id]) => [id, seragamCarta(id, all[id])])),
  ...Object.fromEntries(JK_JADUAL_IDS.filter((id) => all[id]).map((id) => [id, jadualKeJk(CARTA_SERAGAM.some(([x]) => x === id) ? seragamCarta(id, all[id]) : all[id], PKKO, member)])),
});

/** GPK unit lalai mengikut bahagian (Timbalan Pengerusi jawatankuasa). */
const PART_UNIT: Record<string, string> = { 'p-pentadbiran': PKP, 'p-kurikulum': PKP, 'p-hem': PKHEM, 'p-koku': PKKO, 'p-pkhas': PKPK, 'p-prasekolah': PKP };
const GPK_NAME: [RegExp, string][] = [[/ZALE[NH]A/i, PKP], [/HASRE/i, PKHEM], [/RIZAL/i, PKKO], [/VINCENT/i, PKPTG], [/SYAHIDA/i, PKPK]];
const isGB = (r: CommitteeRow | undefined) => !!r && /^pengerusi$/i.test(r.role.trim()) && r.members.some((m) => (m.kind === 'position' && m.value === GB) || (m.kind === 'teacher' && m.id === 't1') || (m.kind === 'text' && /SHAMSUKAMAL/i.test(m.value)));

/**
 * Semua halaman jawatankuasa: barisan pentadbir diseragamkan seperti carta — Pengerusi (Guru Besar), Timbalan Pengerusi
 * (GPK unit; dikekalkan jika sudah ditetapkan) dan Naib Pengerusi (GPK lain, satu baris tanpa nombor). Ahli lain tidak diubah.
 */
export function seragamJk(all: Record<string, SectionContent>, outline: { id: string; topics: { id: string; children: string[] }[] }[]): Record<string, SectionContent> {
  const out: Record<string, SectionContent> = {};
  for (const part of outline) {
    const fallback = PART_UNIT[part.id];
    if (!fallback) continue;
    for (const id of part.topics.flatMap((t) => [t.id, ...t.children])) {
      const sec = all[id];
      if (!sec || CARTA_SERAGAM.some(([x]) => x === id)) continue;
      let changed = false;
      const blocks = sec.blocks.map((b) => {
        if (b.type !== 'committee' || !isGB(b.rows[0])) return b;
        const lead = b.rows.findIndex((r) => !isAdminRow(r));
        const admin = lead < 0 ? b.rows : b.rows.slice(0, lead);
        const tim = admin.find((r) => /^timbalan pengerusi$/i.test(r.role.trim()))?.members[0];
        const unit = !tim ? fallback : tim.kind === 'position' ? tim.value : tim.kind === 'teacher' ? ([PKP, PKHEM, PKKO, PKPTG, PKPK][Number(tim.id.slice(1)) - 2] ?? fallback) : GPK_NAME.find(([re]) => re.test(tim.value))?.[1] ?? fallback;
        const std = adminRows(unit);
        const same = admin.length === 3 && admin.every((r, i) => r.role === std[i].role && JSON.stringify(r.members) === JSON.stringify(std[i].members));
        if (same) return b;
        changed = true;
        return { ...b, rows: [...std, ...(lead < 0 ? [] : b.rows.slice(lead))] };
      });
      if (changed) out[id] = { ...sec, blocks };
    }
  }
  return out;
}

/** Jawatankuasa yang ditulis sebagai jadual JAWATAN | NAMA (Kokurikulum) → format jawatankuasa seragam. */
export const JK_JADUAL_IDS = ['kk-pembangunan-sukan', 'kk-khas-1', 'kk-khas-2', 'kk-khas-3', 'kk-khas-4', 'kk-khas-5'];
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s(/-])([a-z])/g, (_m, a: string, b: string) => a + b.toUpperCase()).replace(/\bAjk\b/, 'AJK').replace(/\b1m1s\b/i, '1M1S');
const ADMIN_TXT = /^(PENGERUSI|TIMBALAN PENGERUSI|NAIB PENGERUSI)/i;

export function jadualKeJk(sec: SectionContent, unit: string, toMember: (name: string) => CommitteeRow['members'][number]): SectionContent {
  const ti = sec.blocks.findIndex((b) => b.type === 'table' && b.columns.length === 2 && /JAWATAN/i.test(b.columns[0]) && /NAMA/i.test(b.columns[1]));
  if (ti < 0) return sec;
  const t = sec.blocks[ti];
  if (t.type !== 'table') return sec;
  const rows: CommitteeRow[] = [];
  let admin = false;
  for (const [role0, name0] of t.rows) {
    const role = (role0 ?? '').trim();
    const name = (name0 ?? '').trim();
    if (role) admin = ADMIN_TXT.test(role);
    if (admin || !name) continue;
    // nota dalam kurungan (cth. "(PAJSK)") dikekalkan sebagai nota tugas; jawatan pentadbir dalam kurungan dibuang
    const note = name.match(/\(([^)]+)\)\s*$/)?.[1] ?? '';
    const bare = name.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const m = toMember(bare);
    const ref = m.kind === 'teacher' && note && !/GPK|GURU BESAR/i.test(note) ? { ...m, note } : m;
    const r = role ? titleCase(role.replace(/\s*\(.*\)$/, '')) : rows[rows.length - 1]?.role ?? 'Ahli Jawatankuasa';
    const last = rows[rows.length - 1];
    if (!role && last) last.members.push(ref);
    else if (last && last.role === r) last.members.push(ref);
    else rows.push({ id: uid(), role: r, members: [ref] });
  }
  const block = { id: uid(), type: 'committee' as const, title: '', rows: [...adminRows(unit), ...rows] };
  return { ...sec, blocks: sec.blocks.map((b, i) => (i === ti ? block : b)) };
}
