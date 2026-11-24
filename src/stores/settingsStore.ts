import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { appStorage } from '@/lib/storage';

interface SettingsState {
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;
  /** Data Induk Guru: padanan nama rumah sukan lama (cth. warna) → nama rasmi (Aurora, Buana, …). */
  rumahMap: Record<string, string>;
  setRumahMap: (m: Record<string, string>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      compactMode: false,
      setCompactMode: (compactMode) => set({ compactMode }),
      rumahMap: {},
      setRumahMap: (rumahMap) => set({ rumahMap }),
    }),
    { name: 'bpps2026-settings', storage: appStorage() },
  ),
);
