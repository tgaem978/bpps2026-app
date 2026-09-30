import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SchoolProfile } from '@/types/school';
import { defaultSchoolProfile } from '@/config/schoolProfile';

interface ProjectState {
  profile: SchoolProfile;
  updateProfile: (patch: Partial<SchoolProfile>) => void;
  resetProfile: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      profile: defaultSchoolProfile,
      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      resetProfile: () => set({ profile: defaultSchoolProfile }),
    }),
    { name: 'bpps2026-project' },
  ),
);
