/**
 * Pustaka edisi: setiap tahun (2026, 2027, …) disimpan sebagai salinan lengkap dalam IndexedDB pelayar ini
 * (buku, Pangkalan Data Guru, master, profil). Edisi aktif berada dalam stor biasa (localStorage); menukar edisi
 * menyimpan edisi aktif ke pustaka dahulu, kemudian memuatkan edisi yang dipilih.
 * IndexedDB digunakan kerana dua buku lengkap (dengan foto guru) boleh melebihi had localStorage.
 */
import { create } from 'zustand';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useStaffStore } from '@/stores/staffStore';
import { useMasterStore } from '@/stores/masterStore';
import type { CoverContent, OutlinePart, SectionContent } from '@/types/book';
import type { StaffField, Teacher } from '@/types/staff';
import type { SchoolProfile } from '@/types/school';

/** Kunci edisi dalam pustaka: tahun (edisi utama) atau "2026-2" (salinan). */
export type EditionId = number | string;
export const editionIdOf = (p: SchoolProfile): EditionId => (p.edition ? `${p.year}-${p.edition}` : p.year);
/** Label paparan: 2026, 2026(2) … */
export const editionLabel = (id: EditionId) => (typeof id === 'string' && id.includes('-') ? id.replace(/-(.+)$/, '($1)') : String(id));
const yearOfId = (id: EditionId) => (typeof id === 'number' ? id : Number(String(id).split('-')[0]));
const sortIds = (a: EditionId, b: EditionId) => yearOfId(b) - yearOfId(a) || String(a).localeCompare(String(b));

export interface EditionSnapshot {
  /** Kunci pustaka (nama medan dikekalkan untuk keserasian): tahun atau id salinan. */
  year: EditionId;
  savedAt: number;
  profile: SchoolProfile;
  book: { cover: CoverContent; sections: Record<string, SectionContent>; outline: OutlinePart[] };
  staff: { fields: StaffField[]; teachers: Teacher[] };
  master: unknown;
}

const DB = 'bpps-edisi';
const STORE = 'edisi';

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'year' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('IndexedDB tidak tersedia.'));
  });
}
async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const req = fn(d.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Ralat storan edisi.'));
  });
}

export const getEdition = (year: EditionId) => tx<EditionSnapshot | undefined>('readonly', (s) => s.get(year));
export const putEdition = (snap: EditionSnapshot) => tx('readwrite', (s) => s.put(snap));
export const deleteEdition = (year: EditionId) => tx('readwrite', (s) => s.delete(year));
async function listSaved(): Promise<{ year: EditionId; savedAt: number }[]> {
  const all = await tx<EditionSnapshot[]>('readonly', (s) => s.getAll());
  return all.map((e) => ({ year: e.year, savedAt: e.savedAt }));
}

/** Salinan edisi aktif (stor semasa). */
export function snapshotActive(): EditionSnapshot {
  const { cover, sections, outline } = useBookStore.getState();
  const { fields, teachers } = useStaffStore.getState();
  const profile = useProjectStore.getState().profile;
  return {
    year: editionIdOf(profile), savedAt: Date.now(), profile,
    book: JSON.parse(JSON.stringify({ cover, sections, outline })),
    staff: JSON.parse(JSON.stringify({ fields, teachers })),
    master: JSON.parse(JSON.stringify(useMasterStore.getState().overrides)),
  };
}

function load(snap: EditionSnapshot) {
  useBookStore.getState().replaceAll(snap.book.cover, snap.book.sections, snap.book.outline);
  useStaffStore.getState().replaceAll(snap.staff.fields, snap.staff.teachers);
  useMasterStore.getState().replaceAll((snap.master ?? {}) as never);
  useProjectStore.setState({ profile: snap.profile });
}

const SESSION_KEY = 'bpps-edisi-dipilih';
const chosenInSession = () => {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return true; }
};

interface EditionListState {
  /** Tahun dalam pustaka (tidak termasuk edisi aktif jika belum disimpan). */
  saved: { year: EditionId; savedAt: number }[];
  ready: boolean;
  /** Edisi telah dipilih dalam sesi pelayar ini (pemilih permulaan tidak dipaparkan lagi). */
  chosen: boolean;
  markChosen: () => void;
  refresh: () => Promise<void>;
}
export const useEditions = create<EditionListState>((set) => ({
  saved: [],
  ready: false,
  chosen: chosenInSession(),
  markChosen: () => {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* abaikan */ }
    set({ chosen: true });
  },
  refresh: async () => {
    try {
      set({ saved: (await listSaved()).sort((a, b) => sortIds(a.year, b.year)), ready: true });
    } catch {
      set({ saved: [], ready: true });
    }
  },
}));

/** Semua tahun yang boleh dipilih (pustaka + edisi aktif), terbaharu dahulu. */
export function editionYears(saved: { year: EditionId }[], active: EditionId): EditionId[] {
  return [...new Set([active, ...saved.map((e) => e.year)])].sort(sortIds);
}
/** Id edisi aktif. */
export const activeEditionId = () => editionIdOf(useProjectStore.getState().profile);

/** Simpan edisi aktif ke pustaka. */
export async function saveActiveEdition() {
  await putEdition(snapshotActive());
  await useEditions.getState().refresh();
}

/** Tukar ke edisi lain: edisi aktif disimpan dahulu, kemudian edisi pilihan dimuatkan. */
export async function switchEdition(year: EditionId) {
  useEditions.getState().markChosen();
  const active = activeEditionId();
  if (String(year) === String(active)) return;
  const target = await getEdition(year);
  if (!target) throw new Error(`Edisi ${editionLabel(year)} tiada dalam pelayar ini.`);
  await putEdition(snapshotActive());
  load(target);
  await useEditions.getState().refresh();
}
