import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { exportJson } from '@/lib/exporter';
import { rolloverBook, type RolloverSummary } from '@/lib/rollover';
import { flattenOutline } from '@/lib/outline';
import { putEdition, snapshotActive, useEditions } from '@/lib/editions';

/**
 * Cipta edisi tahun hadapan daripada buku semasa:
 * 1. edisi semasa disimpan dalam pustaka edisi pelayar (boleh dipilih semula bila-bila masa) dan arkib .json dimuat turun sebagai sandaran;
 * 2. buku disalin, tahun ditukar, kalendar & takwim dijana semula untuk tahun baharu, tarikh lain dikosongkan;
 * 3. setiap halaman ditandakan "perlu dikemas kini"; edisi baharu menjadi edisi aktif.
 */
export async function startNewEdition(): Promise<RolloverSummary> {
  const { cover, sections, outline, setEdition } = useBookStore.getState();
  const { profile, updateProfile } = useProjectStore.getState();
  const from = profile.year;
  const to = from + 1;
  await putEdition(snapshotActive());
  exportJson(`arkib-${from}`);
  const { data, summary } = rolloverBook({ cover, sections, outline }, from, to);
  setEdition(data);
  updateProfile({ year: to, projectCode: profile.projectCode.split(String(from)).join(String(to)) });
  await putEdition(snapshotActive());
  await useEditions.getState().refresh();
  useEditions.getState().markChosen();
  return summary;
}

export interface ReviewProgress { year: number | null; total: number; done: number; pending: string[] }

/** Kemajuan semakan edisi semasa (kulit + semua halaman dalam struktur yang bertanda semakan tahun ini). */
export function reviewProgress(): ReviewProgress {
  const { cover, sections, outline } = useBookStore.getState();
  const year = useProjectStore.getState().profile.year;
  return computeReview(year, cover.review, outline, sections);
}

export function computeReview(
  year: number,
  coverReview: { year: number; status: string } | undefined,
  outline: Parameters<typeof flattenOutline>[0],
  sections: Record<string, { review?: { year: number; status: string } }>,
): ReviewProgress {
  const marks: [string, { year: number; status: string } | undefined][] = [['kulit', coverReview], ...flattenOutline(outline).map((e) => [e.id, sections[e.id]?.review] as [string, { year: number; status: string } | undefined])];
  const mine = marks.filter(([, r]) => r && r.year === year);
  if (!mine.length) return { year: null, total: 0, done: 0, pending: [] };
  return { year, total: mine.length, done: mine.filter(([, r]) => r!.status === 'siap').length, pending: mine.filter(([, r]) => r!.status !== 'siap').map(([id]) => id) };
}
