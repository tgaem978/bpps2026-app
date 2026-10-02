import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';
import type { BookExport } from '@/types/book';
import type { SchoolProfile } from '@/types/school';

function download(filename: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportJson(): void {
  const { cover, sections } = useBookStore.getState();
  const profile = useProjectStore.getState().profile;
  const data: BookExport = { app: 'bpps2026', version: 1, exportedAt: new Date().toISOString(), profile, cover, sections };
  download(`${profile.projectCode || 'bpps2026'}.json`, JSON.stringify(data, null, 2), 'application/json');
  useUiStore.getState().toast('Fail projek (.json) dimuat turun.');
}

export async function importJson(file: File): Promise<void> {
  const data = JSON.parse(await file.text()) as Partial<BookExport>;
  if (data.app !== 'bpps2026' || !data.cover || !data.sections) throw new Error('Fail ini bukan fail projek BPPS 2026 yang sah.');
  useBookStore.getState().replaceAll(data.cover, data.sections);
  if (data.profile && typeof data.profile === 'object') useProjectStore.getState().updateProfile(data.profile as Partial<SchoolProfile>);
}

/** Pasang buku penuh dalam #print-root, kemudian buka dialog cetak (Simpan sebagai PDF). */
export function printBook(): void {
  const ui = useUiStore.getState();
  ui.setPrinting(true);
  const done = () => {
    useUiStore.getState().setPrinting(false);
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  // Tunggu render + imej sebelum mencetak.
  window.setTimeout(() => window.print(), 300);
}

/** Data disimpan automatik ke localStorage; ini mengesahkan simpanan dan merekod masa. */
export function saveNow(): void {
  useBookStore.getState().markSaved();
  useUiStore.getState().toast('Semua perubahan disimpan dalam pelayar ini.');
}
