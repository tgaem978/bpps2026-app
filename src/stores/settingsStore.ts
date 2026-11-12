import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { appStorage } from '@/lib/storage';

interface SettingsState {
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      compactMode: false,
      setCompactMode: (compactMode) => set({ compactMode }),
    }),
    { name: 'bpps2026-settings', storage: appStorage() },
  ),
);
