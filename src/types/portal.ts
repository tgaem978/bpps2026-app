/* Jenis data Portal Kemas Kini - dikongsi oleh penjana (pelayar) dan pelayan (worker/index.ts). */
import type { CoverContent, OutlinePart, SectionContent } from './book';
import type { SchoolProfile } from './school';
import type { StaffField, Teacher } from './staff';

/** Unit penyelaras yang boleh menghantar kemas kini bagi bahagian / halaman tertentu. */
export interface PortalUnit {
  id: string;
  name: string;
  /** Nama penyelaras (pilihan; dipaparkan dalam portal). */
  coordinator: string;
  /** Bahagian penuh (OutlinePart.id) - semua tajuk & subtajuk di dalamnya boleh disunting. */
  partIds: string[];
  /** Tajuk / subtajuk tambahan (ID kandungan) di luar bahagian di atas. */
  sectionIds: string[];
  /** Kod akses (pautan /portal#KOD). Hanya dipaparkan kepada pentadbir. */
  code: string;
  /** Dinaikkan apabila kod dijana semula - sesi lama tamat. */
  codeVer: number;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export type UnitInput = Pick<PortalUnit, 'name' | 'coordinator' | 'partIds' | 'sectionIds'> & { active?: boolean };

/** Maklumat edisi (selain halaman & guru). */
export interface EditionMeta {
  year: number;
  publishedAt: number;
  profile: SchoolProfile;
  cover: CoverContent;
  outline: OutlinePart[];
  master: unknown;
  staffFields: StaffField[];
}

/** Edisi lengkap seperti yang diterima oleh portal. */
export interface EditionSnapshot {
  meta: EditionMeta;
  teachers: Teacher[];
  sections: Record<string, SectionContent>;
}

/** Keputusan pentadbir bagi setiap halaman dalam kiriman. 'diganti' = digantikan oleh kiriman lebih baharu daripada unit yang sama. */
export type Decision = 'diterima' | 'ditolak' | 'diganti';

export interface SubmissionSummary {
  id: string;
  unitId: string;
  unitName: string;
  submittedBy: string;
  note: string;
  year: number;
  createdAt: number;
  sectionIds: string[];
  titles: Record<string, string>;
  decisions: Record<string, Decision>;
  reviewedAt?: number;
}

export interface Submission extends SubmissionSummary {
  sections: Record<string, SectionContent>;
  /** `updatedAt` halaman dalam edisi yang diterbitkan semasa unit mula menyunting (untuk mengesan konflik). */
  base: Record<string, number | null>;
}

export interface AdminOverview {
  edition: { year: number; publishedAt: number; sections: number; teachers: number } | null;
  units: PortalUnit[];
  submissions: SubmissionSummary[];
}

export interface PendingSection { submissionId: string; at: number; content: SectionContent }

export interface PortalState {
  unit: { id: string; name: string; coordinator: string; sectionIds: string[] };
  edition: EditionSnapshot;
  /** Halaman yang telah dihantar tetapi belum diputuskan pentadbir (unit meneruskan daripada versi ini). */
  pending: Record<string, PendingSection>;
  history: SubmissionSummary[];
}

export interface HealthInfo { ok: true; configured: boolean; edition: { year: number; publishedAt: number } | null }

/** ID halaman yang boleh disunting oleh unit, mengikut struktur edisi yang diterbitkan. */
export function unitSectionIds(unit: Pick<PortalUnit, 'partIds' | 'sectionIds'>, outline: OutlinePart[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const add = (id: string) => { if (!seen.has(id)) { seen.add(id); out.push(id); } };
  for (const part of outline) {
    const whole = unit.partIds.includes(part.id);
    for (const t of part.topics) {
      if (whole || unit.sectionIds.includes(t.id)) add(t.id);
      for (const c of t.children) if (whole || unit.sectionIds.includes(c) || unit.sectionIds.includes(t.id)) add(c);
    }
  }
  return out;
}

/** Status ringkas kiriman. */
export function submissionStatus(s: Pick<SubmissionSummary, 'sectionIds' | 'decisions'>): 'baru' | 'separa' | 'selesai' {
  const decided = s.sectionIds.filter((id) => s.decisions[id]).length;
  return decided === 0 ? 'baru' : decided < s.sectionIds.length ? 'separa' : 'selesai';
}
