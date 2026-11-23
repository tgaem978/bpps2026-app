import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { exportJson } from '@/lib/exporter';
import { defaultForYear, rolloverBook, rolloverSection, swapYear, type RolloverSummary } from '@/lib/rollover';
import { defaultCover, defaultSections } from '@/config/defaultContent';
import { useMasterStore } from '@/stores/masterStore';
import { allIds } from '@/lib/outline';
import { flattenOutline } from '@/lib/outline';
import { getEdition, putEdition, snapshotActive, useEditions } from '@/lib/editions';
import { templateAssets } from '@/templates/bpps';

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
  useEditions.getState().markChosen();
  await putEdition(snapshotActive());
  exportJson(`arkib-${from}`);
  const { data, summary } = rolloverBook({ cover, sections, outline }, from, to);
  // Edisi baharu menggunakan tema Biru Navy & Emas; kulit imej templat 2026 (tahun tertera pada imej) diganti kulit dijana daripada teks.
  if (data.cover.image === templateAssets.cover) data.cover = { ...data.cover, image: '' };
  setEdition(data);
  updateProfile({ year: to, projectCode: profile.projectCode.split(String(from)).join(String(to)), theme: 'biru-emas' });
  await putEdition(snapshotActive());
  await useEditions.getState().refresh();
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

/** Halaman bertarikh: dalam salinan ke tahun lain, versi asal tahun itu (kalendar, cuti, minggu, takwim, jadual bertugas …) digunakan. */
const DATED_IDS = /^(t-akademik|t-cuti|ma-minggu-akademik|t-kalendar|takwim-\d+|k-takwim|pp-takwim|hx-takwim|kk-takwim|pk-takwim|pra-takwim|jadual-bertugas-.+|kk-perhimpunan|pp-erph|pp-pencerapan-guru|pp-semakan-hasil|pp-pencerapan)$/;

/**
 * Edisi salinan, cth. BPPS 2026(2): SEMUA kandungan edisi aktif (teks, halaman, struktur, jadual, carta, jawatankuasa, staf)
 * disalin ke tahun `toYear`, tahun dalam teks ditukar, dan halaman bertarikh menggunakan tarikh asal tahun itu.
 * Reka bentuk (tema, kulit, header/footer & warna master) diambil daripada edisi utama tahun itu.
 */
export async function createContentCopy(toYear: number): Promise<{ id: string; pages: number }> {
  const { cover, sections, outline, setEdition } = useBookStore.getState();
  const profile = useProjectStore.getState().profile;
  const from = profile.year;
  const base = await getEdition(toYear);
  const saved = useEditions.getState().saved.map((e) => String(e.year));
  let n = 2;
  while (saved.includes(`${toYear}-${n}`)) n++;
  const id = `${toYear}-${n}`;
  useEditions.getState().markChosen();
  await putEdition(snapshotActive());

  const defs = defaultSections();
  const ids = new Set(allIds(outline));
  const out: typeof sections = {};
  for (const [sid, sec] of Object.entries(sections)) {
    const def = DATED_IDS.test(sid) && defs[sid] ? defaultForYear(sid, defs[sid], toYear) : null;
    const s = def ?? rolloverSection(sid, sec, from, toYear).section;
    const { review: _r, ...rest } = s;
    out[sid] = { ...rest, updatedAt: Date.now() };
  }
  const outl = outline.map((p) => ({ ...p, title: swapYear(p.title, from, toYear), note: swapYear(p.note, from, toYear) }));
  const baseCover = base?.book.cover ?? { ...defaultCover(), image: templateAssets.cover };
  void cover;
  setEdition({ cover: { ...baseCover, updatedAt: Date.now() }, sections: out, outline: outl });
  useMasterStore.getState().replaceAll(((base?.master ?? {}) as never));
  useProjectStore.setState({
    profile: { ...profile, year: toYear, edition: String(n), theme: base?.profile.theme ?? 'klasik', projectCode: (base?.profile.projectCode ?? profile.projectCode.split(String(from)).join(String(toYear))) },
  });
  await putEdition(snapshotActive());
  await useEditions.getState().refresh();
  return { id, pages: ids.size };
}
