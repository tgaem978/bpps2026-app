/* Istilah carta organisasi & jawatankuasa induk diseragamkan:
 *  - tajuk: "CARTA ORGANISASI UNIT/PROGRAM …" dan "JAWATANKUASA INDUK UNIT/PROGRAM …" (tanpa tahun);
 *  - barisan pentadbir: Pengerusi (Guru Besar) → Timbalan Pengerusi (GPK unit) → Naib Pengerusi (GPK lain, tanpa nombor). */
import type { CommitteeRow, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';

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

export const seragamSections = (all: Record<string, SectionContent>): Record<string, SectionContent> =>
  Object.fromEntries(CARTA_SERAGAM.filter(([id]) => all[id]).map(([id]) => [id, seragamCarta(id, all[id])]));
