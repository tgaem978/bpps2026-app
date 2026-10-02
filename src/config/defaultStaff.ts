import type { StaffField, Teacher } from '@/types/staff';
import { F_NAME, F_POSITION, F_SESSION, F_TASK } from '@/types/staff';
import { partAStaff } from './partA';

const base = import.meta.env.BASE_URL;

/**
 * Kategori jawatan - susunan = hierarki (digunakan untuk carta organisasi & isihan).
 * "Jawatan" (tugas) pula ialah teks bebas seperti dalam dokumen, cth. "GURU KELAS 5 USM / SU B. INGGERIS".
 */
export const POSITIONS = [
  'Guru Besar',
  'GPK Pentadbiran',
  'GPK Hal Ehwal Murid',
  'GPK Kokurikulum',
  'GPK Petang',
  'GPK Pendidikan Khas',
  'Guru Penyelaras Bestari',
  'Guru Perpustakaan dan Media',
  'Guru Data',
  'Guru Bimbingan dan Kaunseling',
  'Guru Akademik',
  'Guru Prasekolah',
  'Guru Pendidikan Khas',
  'Guru Pemulihan',
  'Ketua Pembantu Tadbir',
  'Penolong Akauntan',
  'Pembantu Tadbir',
  'Pembantu Pengurusan Murid',
  'Pembantu Khidmat Am',
];

/** Guru Besar + GPK. */
export const ADMIN_POSITIONS = POSITIONS.slice(0, 6);
/** Anggota Kumpulan Pelaksana (AKP). */
export const AKP_POSITIONS = POSITIONS.slice(14);

export const defaultFields = (): StaffField[] => [
  { id: F_NAME, label: 'Nama', type: 'text', options: [], locked: true },
  { id: F_POSITION, label: 'Kategori Jawatan', type: 'select', options: [...POSITIONS], locked: true },
  { id: F_TASK, label: 'Jawatan', type: 'text', options: [] },
  { id: F_SESSION, label: 'Sesi', type: 'select', options: ['Pagi', 'Petang'] },
  { id: 'gred', label: 'Gred', type: 'select', options: ['DG 9', 'DG 10', 'DG 12', 'DG 13', 'DG 14', 'N1', 'N2', 'N3', 'H1', 'W5'] },
  {
    id: 'opsyen',
    label: 'Opsyen',
    type: 'multi',
    options: [...new Set([
      'B. MELAYU', 'B. INGGERIS', 'MATEMATIK', 'SAINS', 'PEND. ISLAM', 'P. MORAL', 'SEJARAH', 'PJK', 'PSV', 'MUZIK', 'RBT', 'B. ARAB',
      'B. CINA', 'B. TAMIL', 'PEND. KHAS', 'PRA SEKOLAH', 'KAUNSELING', 'PEMULIHAN', ...partAStaff.flatMap((s) => s.opsyen),
    ])],
  },
  { id: 'telefon', label: 'No. Tel', type: 'phone', options: [] },
];

/** Data awal: senarai guru & AKP SK Bandar Tasik Selatan (BPPS 2026, Bahagian A). */
export const defaultTeachers = (): Teacher[] =>
  partAStaff.map((s, i) => ({
    id: `t${i + 1}`,
    photo: s.photo ? `${base}staff/${s.photo}.jpg` : '',
    values: {
      [F_NAME]: s.nama, [F_POSITION]: s.kategori, [F_TASK]: s.tugas, [F_SESSION]: s.sesi, gred: s.gred, opsyen: s.opsyen, telefon: '',
    },
  }));
