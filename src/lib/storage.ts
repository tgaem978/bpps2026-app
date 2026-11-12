import { createJSONStorage, type StateStorage } from 'zustand/middleware';

/**
 * Mod Portal Kemas Kini (/portal): stor yang sama (buku, guru, master, profil) digunakan untuk menyunting dan pratonton,
 * tetapi datanya dimuat daripada pelayan dan TIDAK boleh menimpa data penjana dalam pelayar yang sama.
 * Oleh itu dalam mod portal storan dipegang dalam memori sahaja.
 */
export const PORTAL_MODE = typeof window !== 'undefined' && /^\/portal(\/|$)/.test(window.location.pathname);

const memory = new Map<string, string>();
const memoryStorage: StateStorage = {
  getItem: (k) => memory.get(k) ?? null,
  setItem: (k, v) => void memory.set(k, v),
  removeItem: (k) => void memory.delete(k),
};

/** Storan untuk zustand persist: localStorage dalam penjana, memori dalam portal. */
export const appStorage = () => createJSONStorage(() => (PORTAL_MODE ? memoryStorage : localStorage));
