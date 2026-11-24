/**
 * Pembetulan data sekali-jalan bagi SEMUA edisi dalam pelayar ini (edisi aktif + pustaka IndexedDB).
 * Setiap pembetulan mempunyai bendera sendiri dalam localStorage dan selamat diulang.
 */
import { useBookStore } from '@/stores/bookStore';
import { useStaffStore } from '@/stores/staffStore';
import { useProjectStore } from '@/stores/projectStore';
import { lencanaSection } from '@/config/lencana';
import { KP2027_IDS, kp2027Sections } from '@/config/kp2027';
import { editionIdOf, getEdition, putEdition, useEditions, type EditionId } from '@/lib/editions';
import type { OutlinePart, SectionContent } from '@/types/book';
import type { Teacher } from '@/types/staff';

interface Data { sections: Record<string, SectionContent>; outline: OutlinePart[]; teachers: Teacher[] }
interface Fix { flag: string; apply: (d: Data, id: EditionId) => Data }

/** Nama GPK Pentadbiran: ZALENA → ZALEHA BINTI YUSOH (kekalkan huruf besar/kecil); sejarah: dibuka 2001. */
const fixText = (s: string) =>
  s
    .replace(/Zalena(?=\s+(?:binti|bt\.?)\s+yusoh)/gi, (m) => (m === m.toUpperCase() ? 'ZALEHA' : 'Zaleha'))
    .replace(/mula beroperasi secara rasmi pada \*\*1 Januari 2004\*\*/g, 'mula dibuka pada tahun **2001**');
const deepFix = <T,>(v: T): T => JSON.parse(fixText(JSON.stringify(v))) as T;

const FIXES: Fix[] = [
  {
    flag: 'bpps-pembetulan-2026-11-23',
    apply: (d) => {
      const sections = deepFix(d.sections);
      // Halaman Lencana Sekolah diganti dengan versi baharu (lencana berpenanda, elemen, bentuk & warna).
      if (sections['b-logo']) sections['b-logo'] = lencanaSection();
      return { ...d, sections, teachers: deepFix(d.teachers) };
    },
  },
  {
    // Sub-bahagian Kurikulum Persekolahan 2027 di bawah Maklumat Am (selepas Visi & Misi KPM):
    // 5 infografik sehalaman bergaya sistem (menggantikan versi galeri imej sebelum ini).
    // Edisi arkib 2026 tidak diubah supaya penomboran halaman buku 2026 kekal.
    flag: 'bpps-kp2027-infografik-2026-11-24',
    apply: (d, id) => {
      if (id === 2026) return d;
      const isKp = (x: string) => x.startsWith('ma-kp2027');
      const outline = d.outline.map((part) => {
        const topics = part.topics.filter((t) => !isKp(t.id));
        if (part.id !== 'p-maklumat') return { ...part, topics };
        const at = topics.findIndex((t) => t.id === 'b-visi-kpm');
        topics.splice(at >= 0 ? at + 1 : topics.length, 0, { id: KP2027_IDS[0], children: KP2027_IDS.slice(1), tocChildren: false });
        return { ...part, topics };
      });
      const sections = Object.fromEntries(Object.entries(d.sections).filter(([k]) => !isKp(k)));
      return { ...d, outline, sections: { ...sections, ...kp2027Sections() } };
    },
  },
];

const done = (f: string) => {
  try { return !!localStorage.getItem(f); } catch { return true; }
};

export async function runDataFixes() {
  const todo = FIXES.filter((f) => !done(f.flag));
  if (!todo.length) return;
  const run = (d: Data, id: EditionId) => todo.reduce((acc, f) => f.apply(acc, id), d);
  // Edisi aktif
  const { sections, outline } = useBookStore.getState();
  const activeId = editionIdOf(useProjectStore.getState().profile);
  const a = run({ sections, outline, teachers: useStaffStore.getState().teachers }, activeId);
  useBookStore.setState({ sections: a.sections, outline: a.outline });
  useStaffStore.setState({ teachers: a.teachers });
  // Edisi lain dalam pustaka
  try {
    await useEditions.getState().refresh();
    for (const { year } of useEditions.getState().saved) {
      const snap = await getEdition(year);
      if (!snap) continue;
      const r = run({ sections: snap.book.sections, outline: snap.book.outline, teachers: snap.staff.teachers }, snap.year);
      await putEdition({ ...snap, book: { ...snap.book, sections: r.sections, outline: r.outline }, staff: { ...snap.staff, teachers: r.teachers } });
    }
  } catch {
    /* IndexedDB tiada — edisi aktif sudah dibetulkan */
  }
  for (const f of todo) {
    try { localStorage.setItem(f.flag, '1'); } catch { /* abaikan */ }
  }
}
