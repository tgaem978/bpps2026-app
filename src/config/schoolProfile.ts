import type { SchoolProfile } from '@/types/school';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'BPPS 2026 Generator';
export const APP_SUBTITLE = 'Buku Panduan Pengurusan Sekolah 2026';

export const defaultSchoolProfile: SchoolProfile = {
  fullName: 'Sekolah Kebangsaan Bandar Tasik Selatan',
  shortName: 'SK Bandar Tasik Selatan',
  year: 2026,
  projectCode: import.meta.env.VITE_PROJECT_ID || 'BPPS2026-SKBTS',
};
