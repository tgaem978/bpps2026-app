import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
    { name: 'bpps2026-master', version: 1 },
  ),
);

export const resolveMaster = (type: PageType, overrides: MasterState['overrides']): MasterProps => ({
  ...masterDefaults(type),
  ...overrides[type],
});

export function useMaster(type: PageType): MasterProps {
  const o = useMasterStore((s) => s.overrides[type]);
  return { ...masterDefaults(type), ...o };
}
