import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { appStorage } from '@/lib/storage';
import { useProjectStore } from '@/stores/projectStore';
import { masterDefaults, type MasterProps, type PageType } from '@/templates/master';

interface MasterState {
  overrides: Partial<Record<PageType, Partial<MasterProps>>>;
  set: <K extends keyof MasterProps>(type: PageType, key: K, value: MasterProps[K]) => void;
  resetType: (type: PageType) => void;
  replaceAll: (o: MasterState['overrides']) => void;
}

export const useMasterStore = create<MasterState>()(
  persist(
    (set) => ({
      overrides: {},
      set: (type, key, value) => set((s) => ({ overrides: { ...s.overrides, [type]: { ...s.overrides[type], [key]: value } } })),
      resetType: (type) => set((s) => {
        const { [type]: _drop, ...rest } = s.overrides;
        return { overrides: rest };
      }),
      replaceAll: (overrides) => set({ overrides: overrides ?? {} }),
    }),
    { name: 'bpps2026-master', version: 1, storage: appStorage() },
  ),
);

/** Tema buku edisi aktif (nilai lalai Master bergantung pada tema). */
export const currentTheme = () => useProjectStore.getState().profile.theme ?? 'klasik';

export const resolveMaster = (type: PageType, overrides: MasterState['overrides'], theme: string = currentTheme()): MasterProps => ({
  ...masterDefaults(type, theme),
  ...overrides[type],
});

export function useMaster(type: PageType): MasterProps {
  const o = useMasterStore((s) => s.overrides[type]);
  const theme = useProjectStore((s) => s.profile.theme ?? 'klasik');
  return { ...masterDefaults(type, theme), ...o };
}
