import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';
import { useStaffStore } from '@/stores/staffStore';
import { useMasterStore } from '@/stores/masterStore';
import type { StaffField, Teacher } from '@/types/staff';
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

/** Muat turun fail projek. `suffix` ditambah pada nama fail (cth. "arkib-2026"). */
export function exportJson(suffix = ''): void {
  const { cover, sections, outline } = useBookStore.getState();
  const profile = useProjectStore.getState().profile;
  const { fields, teachers } = useStaffStore.getState();
  const master = useMasterStore.getState().overrides;
  const data: BookExport = {
    app: 'bpps2026', version: 2, exportedAt: new Date().toISOString(), profile, cover, sections, outline, staff: { fields, teachers }, master,
  };
  download(`${profile.projectCode || 'bpps2026'}${suffix ? `-${suffix}` : ''}.json`, JSON.stringify(data, null, 2), 'application/json');
  if (!suffix) useUiStore.getState().toast('Fail projek (.json) dimuat turun.');
}

export async function importJson(file: File): Promise<void> {
  const data = JSON.parse(await file.text()) as Partial<BookExport>;
  if (data.app !== 'bpps2026' || !data.cover || !data.sections) throw new Error('Fail ini bukan fail projek BPPS 2026 yang sah.');
  useBookStore.getState().replaceAll(data.cover, data.sections, data.outline);
  const staff = data.staff as { fields?: StaffField[]; teachers?: Teacher[] } | undefined;
  if (staff?.fields && staff.teachers) useStaffStore.getState().replaceAll(staff.fields, staff.teachers);
  if (data.master && typeof data.master === 'object') useMasterStore.getState().replaceAll(data.master as never);
  if (data.profile && typeof data.profile === 'object') useProjectStore.getState().updateProfile(data.profile as Partial<SchoolProfile>);
}

/** Tunggu semua gambar dalam elemen selesai dimuat (atau gagal), dengan had masa. */
async function imagesReady(root: HTMLElement, timeoutMs = 20000) {
  const imgs = Array.from(root.querySelectorAll('img'));
  const one = (im: HTMLImageElement) => (im.complete && im.naturalWidth > 0 ? Promise.resolve() : (im.decode?.() ?? new Promise<void>((r) => { im.onload = im.onerror = () => r(); })).catch(() => undefined));
  await Promise.race([Promise.all(imgs.map(one)), new Promise((r) => setTimeout(r, timeoutMs))]);
}

let printing = false;

/**
 * Pasang buku penuh dalam #print-root, tunggu fon & SEMUA gambar (foto pentadbir, logo, carta) dimuat, kemudian buka dialog
 * cetak (Simpan sebagai PDF). Tajuk dokumen ditukar sementara supaya nama fail PDF lalai = "BPPS 2027 - <nama sekolah>".
 */
export async function printBook(): Promise<void> {
  if (printing) return;
  printing = true;
  const ui = useUiStore.getState();
  const { year, shortName } = useProjectStore.getState().profile;
  const prevTitle = document.title;
  ui.toast('Menyediakan PDF… sila tunggu sehingga dialog cetak dibuka.', 'info');
  ui.setPrinting(true);
  const done = () => {
    useUiStore.getState().setPrinting(false);
    document.title = prevTitle;
    printing = false;
    window.removeEventListener('afterprint', done);
  };
  window.addEventListener('afterprint', done);
  try {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await document.fonts?.ready;
    const root = document.getElementById('print-root');
    if (root) await imagesReady(root);
    document.title = `BPPS ${year} - ${shortName}`;
    window.print();
  } catch (e) {
    console.error(e);
    done();
  }
}

/** Data disimpan automatik ke localStorage; ini mengesahkan simpanan dan merekod masa. */
export function saveNow(): void {
  useBookStore.getState().markSaved();
  useUiStore.getState().toast('Semua perubahan disimpan dalam pelayar ini.');
}
