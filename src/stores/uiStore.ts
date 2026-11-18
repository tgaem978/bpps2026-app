import { create } from 'zustand';

export interface Toast {
  id: number;
  message: string;
  kind: 'success' | 'error' | 'info';
}

interface UiState {
  toasts: Toast[];
  printing: boolean;
  /** Dialog muat turun PowerPoint */
  pptOpen: boolean;
  setPptOpen: (v: boolean) => void;
  /** Dinaikkan untuk memaksa ukuran semula halaman (cth. selepas fon dimuatkan) */
  layoutVersion: number;
  bumpLayout: () => void;
  toast: (message: string, kind?: Toast['kind']) => void;
  dismiss: (id: number) => void;
  setPrinting: (v: boolean) => void;
  /** Tanda medan kosong / perlu diisi pada paparan halaman (skrin sahaja). */
  markEmpty: boolean;
  setMarkEmpty: (v: boolean) => void;
}

const readMark = () => { try { return localStorage.getItem('bpps-mark-empty') !== '0'; } catch { return true; } };

let seq = 0;

export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  printing: false,
  pptOpen: false,
  setPptOpen: (pptOpen) => set({ pptOpen }),
  layoutVersion: 0,
  bumpLayout: () => set((s) => ({ layoutVersion: s.layoutVersion + 1 })),
  toast: (message, kind = 'success') => {
    const id = ++seq;
    set((s) => ({ toasts: [...s.toasts, { id, message, kind }] }));
    window.setTimeout(() => get().dismiss(id), 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  setPrinting: (printing) => set({ printing }),
  markEmpty: readMark(),
  setMarkEmpty: (markEmpty) => {
    try { localStorage.setItem('bpps-mark-empty', markEmpty ? '1' : '0'); } catch { /* storan disekat */ }
    set({ markEmpty });
  },
}));
