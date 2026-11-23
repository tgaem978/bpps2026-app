/**
 * Pembetulan data sekali-jalan bagi SEMUA edisi dalam pelayar ini (edisi aktif + pustaka IndexedDB).
 * Setiap pembetulan dijalankan sekali sahaja (bendera dalam localStorage) dan selamat diulang.
 */
import { useBookStore } from '@/stores/bookStore';
import { useStaffStore } from '@/stores/staffStore';
import { lencanaSection } from '@/config/lencana';
import { getEdition, putEdition, useEditions, type EditionSnapshot } from '@/lib/editions';
import type { SectionContent } from '@/types/book';
import type { Teacher } from '@/types/staff';

const FLAG = 'bpps-pembetulan-2026-11-23';

/** Nama GPK Pentadbiran: ZALENA → ZALEHA BINTI YUSOH (kekalkan huruf besar/kecil). */
const fixText = (s: string) =>
  s
    .replace(/Zalena(?=\s+(?:binti|bt\.?)\s+yusoh)/gi, (m) => (m === m.toUpperCase() ? 'ZALEHA' : 'Zaleha'))
    .replace(/mula beroperasi secara rasmi pada \*\*1 Januari 2004\*\*/g, 'mula dibuka pada tahun **2001**');

const deepFix = <T,>(v: T): T => JSON.parse(fixText(JSON.stringify(v))) as T;

function fixSections(sections: Record<string, SectionContent>): Record<string, SectionContent> {
  const out = deepFix(sections);
  // Halaman Lencana Sekolah diganti dengan versi baharu (lencana berpenanda, elemen, bentuk & warna).
  if (out['b-logo']) out['b-logo'] = lencanaSection();
  return out;
}
const fixTeachers = (t: Teacher[]) => deepFix(t);

export async function runDataFixes() {
  try {
    if (localStorage.getItem(FLAG)) return;
  } catch {
    return;
  }
  // Edisi aktif
  const book = useBookStore.getState();
  useBookStore.setState({ sections: fixSections(book.sections) });
  useStaffStore.setState({ teachers: fixTeachers(useStaffStore.getState().teachers) });
  // Edisi lain dalam pustaka
  try {
    const { refresh } = useEditions.getState();
    await refresh();
    for (const { year } of useEditions.getState().saved) {
      const snap = await getEdition(year);
      if (!snap) continue;
      const fixed: EditionSnapshot = {
        ...snap,
        book: { ...snap.book, sections: fixSections(snap.book.sections) },
        staff: { ...snap.staff, teachers: fixTeachers(snap.staff.teachers) },
      };
      await putEdition(fixed);
    }
  } catch {
    /* IndexedDB tiada — edisi aktif sudah dibetulkan */
  }
  try {
    localStorage.setItem(FLAG, '1');
  } catch {
    /* abaikan */
  }
}
