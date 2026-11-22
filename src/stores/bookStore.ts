import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Block, BlockType, CoverContent, OutlinePart, OutlineTopic, ReviewMark, SectionContent } from '@/types/book';
import { kokuTopics, ppkiChildren } from '@/config/partKoku';
import { HEM_TUGAS_ORDER, hemIds, hemTopics } from '@/config/partHEM';
import { PLANNER_IDS, defaultCover, defaultOutline, defaultSections, newSection, plannerTopic } from '@/config/defaultContent';
import { PROGRAM_KHAS } from '@/config/partPentadbiran';
import { pentadbiranTopics } from '@/config/partPentadbiran';
import { ppkiTopics } from '@/config/partPPKI';
import { prasekolahTopics } from '@/config/partPrasekolah';
import { lampiranTopics } from '@/config/partLampiran';
import { KOKU_MERGED, PPKI_PAGES, UNIT_INTRO_IDS, hemIntroTopic, kokuIntroTopic, ppkiIntroTopics } from '@/config/unitPengenalan';
import { FLAT_TOC_PARTS, OVERRIDES, REMOVED_IDS, partRujukanSections, unitTopicIds } from '@/config/partRujukan';
import { createBlock, uid } from '@/lib/blocks';
import { BIDANG_TUGAS, KURI_UNIT_PAGES } from '@/config/bidangTugas';
import { MASTER_IDS } from '@/config/takwimUnit';
import { dutyRosterSections, hasAcademic, markTakwimRows } from '@/config/kalendarAkademik';
import { SENARAI_JK, senaraiItems, senaraiSection, tugasBlocks } from '@/config/senaraiJk';
import { allIds } from '@/lib/outline';
import { defaultForYear } from '@/lib/rollover';
import { appStorage } from '@/lib/storage';
import { useProjectStore } from '@/stores/projectStore';

interface BookState {
  cover: CoverContent;
  sections: Record<string, SectionContent>;
  outline: OutlinePart[];
  lastSavedAt: number | null;
  updateCover: (patch: Partial<CoverContent>) => void;
  updateSection: (id: string, patch: Partial<Omit<SectionContent, 'blocks' | 'updatedAt'>>) => void;
  addBlock: (id: string, type: BlockType) => void;
  updateBlock: (id: string, blockId: string, block: Block) => void;
  removeBlock: (id: string, blockId: string) => void;
  moveBlock: (id: string, blockId: string, dir: -1 | 1) => void;
  resetSection: (id: string) => void;
  // Struktur kandungan
  addPart: () => string;
  updatePart: (id: string, patch: Partial<Omit<OutlinePart, 'id' | 'topics'>>) => void;
  removePart: (id: string) => void;
  movePart: (id: string, dir: -1 | 1) => void;
  addTopic: (partId: string, parentId?: string) => string;
  removeTopic: (id: string) => void;
  moveTopic: (id: string, dir: -1 | 1) => void;
  moveTopicToPart: (id: string, partId: string) => void;
  resetAll: () => void;
  replaceAll: (cover: CoverContent, sections: Record<string, SectionContent>, outline?: OutlinePart[]) => void;
  /** Tanda semakan edisi tahunan ('kulit' = muka hadapan). */
  setReview: (id: string, status: ReviewMark['status'], by?: string) => void;
  /** Ganti kandungan satu halaman (cth. kemas kini diterima daripada Portal) dan tandakan siap disemak. */
  applySection: (id: string, content: SectionContent, by: string) => void;
  /** Ganti seluruh buku (edisi tahunan baharu). */
  setEdition: (data: Pick<BookState, 'cover' | 'sections' | 'outline'>) => void;
  markSaved: () => void;
}

const now = () => Date.now();
const swap = <T,>(arr: T[], i: number, j: number) => {
  if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

type Data = Pick<BookState, 'cover' | 'sections' | 'outline'>;

/** Gabung data tersimpan/import dengan nilai lalai supaya medan & bahagian baharu sentiasa wujud. */
function normalize<T extends Data>(current: T, p: Partial<Data>): T {
  const defs = defaultSections();
  const outline = p.outline ?? current.outline;
  const sections: Record<string, SectionContent> = { ...current.sections };
  for (const [id, sec] of Object.entries(p.sections ?? {})) {
    sections[id] = { ...(defs[id] ?? current.sections[id] ?? newSection('')), ...sec };
    if (!sections[id].layout) sections[id].layout = 'standard';
  }
  for (const id of allIds(outline)) if (!sections[id]) sections[id] = defs[id] ?? newSection('TAJUK BAHARU');
  return { ...current, ...p, outline, cover: { ...defaultCover(), ...(p.cover ?? current.cover) }, sections };
}

/**
 * v4: kandungan sebenar Kurikulum & Kokurikulum menggantikan tajuk contoh; lajur emas jadual menjadi pilihan tersurat.
 * Tajuk contoh lama yang telah disunting dikekalkan dan diletakkan semula dalam bahagian yang sepadan.
 */
function migrateV4(p: Partial<BookState>) {
  const defs = defaultOutline();
  const kept = (id: string) => !!p.sections?.[id];
  if (p.outline) {
    const stale: Record<string, string[]> = { 'p-kurikulum': ['kurikulum', 'jk-kurikulum'], 'p-koku': ['kokurikulum', 'jk-koku'] };
    p.outline = p.outline.map((part) => {
      const ids = part.topics.flatMap((t) => [t.id, ...t.children]);
      const old = stale[part.id];
      const def = defs.find((d) => d.id === part.id);
      if (!old || !def || !ids.every((id) => old.includes(id))) return part;
      const edited = part.topics.filter((t) => kept(t.id)).map((t) => ({ ...t, children: t.children.filter(kept) }));
      return { ...part, topics: [...def.topics.map((t) => ({ ...t, children: [...t.children] })), ...edited] };
    });
  }
  const outline = p.outline ?? defs;
  // Tajuk lama yang disunting tetapi tiada dalam struktur → letak semula (bukan hilang).
  const home: Record<string, string> = { pentadbiran: 'p-pentadbiran', kurikulum: 'p-kurikulum', 'jk-kurikulum': 'p-kurikulum', kokurikulum: 'p-koku', 'jk-koku': 'p-koku' };
  const present = new Set(allIds(outline));
  const lost = Object.keys(p.sections ?? {}).filter((id) => id !== 'kulit' && !present.has(id));
  if (lost.length) {
    p.outline = outline.map((part, i) => {
      const mine = lost.filter((id) => (home[id] && outline.some((x) => x.id === home[id]) ? home[id] === part.id : i === outline.length - 1));
      return mine.length ? { ...part, topics: [...part.topics, ...mine.map((id) => ({ id, children: [] }))] } : part;
    });
  }
  // Sebelum v4, jadual biru gelap tanpa lajur BIL sentiasa berlajur pertama emas.
  for (const sec of Object.values(p.sections ?? {})) {
    for (const b of sec.blocks ?? []) {
      if (b.type === 'table' && b.numbered === false && b.style !== 'gold' && !b.firstCol) b.firstCol = 'gold';
    }
  }
}

/** v7: Pengurusan Kokurikulum baharu (maklumat asas + halaman jawatankuasa PDF) dan carta PPKI di bawah Pendidikan Khas. */
function migrateV7(p: Partial<BookState>) {
  const part = p.outline?.find((x) => x.id === 'p-koku');
  if (part) {
    const old = ['ko-beruniform', 'ko-unit-beruniform', 'ko-kelab', 'ko-unit-kelab', 'ko-sukan', 'ko-unit-sukan'];
    const ids = part.topics.flatMap((t) => [t.id, ...t.children]);
    if (!ids.some((id) => id.startsWith('kk-'))) {
      const untouched = old.every((id) => !p.sections?.[id] || p.sections[id].updatedAt === null);
      part.topics = untouched ? kokuTopics() : [...kokuTopics(), ...part.topics];
    }
  }
  const khas = p.outline?.find((x) => x.id === 'p-pkhas')?.topics.find((t) => t.id === 'pendidikan-khas');
  if (khas) for (const id of ppkiChildren) if (!khas.children.includes(id)) khas.children.push(id);
  if (p.sections) for (const id of Object.keys(p.sections)) if ((id.startsWith('kk-') || id.startsWith('pk-')) && p.sections[id].updatedAt === null) delete p.sections[id];
}

/** v8: bahagian Kokurikulum dilengkapkan (aluan, tugas, takwim, pasukan sukan, rumah sukan, JK khas). */
function migrateV8(p: Partial<BookState>) {
  const part = p.outline?.find((x) => x.id === 'p-koku');
  if (part) {
    const ids = part.topics.flatMap((t) => [t.id, ...t.children]);
    const allDefault = ids.length > 0 && ids.every((id) => id.startsWith('kk-'));
    const untouched = ids.every((id) => !p.sections?.[id] || p.sections[id].updatedAt === null);
    if (allDefault && untouched) part.topics = kokuTopics();
    else for (const t of kokuTopics()) if (!ids.includes(t.id)) part.topics.push(t);
  }
  if (p.sections) for (const id of Object.keys(p.sections)) if (id.startsWith('kk-') && p.sections[id].updatedAt === null) delete p.sections[id];
}

/** v9: Pengurusan Hal Ehwal Murid baharu (kandungan Buku Pengurusan 2026 – sub-unit HEM) menggantikan tajuk contoh. */
function migrateV9(p: Partial<BookState>) {
  const part = p.outline?.find((x) => x.id === 'p-hem');
  if (part) {
    const ids = part.topics.flatMap((t) => [t.id, ...t.children]);
    const old = ['hem', 'jk-hem'];
    const untouched = ids.every((id) => !p.sections?.[id] || p.sections[id].updatedAt === null);
    if (ids.every((id) => old.includes(id)) && untouched) part.topics = hemTopics();
    else if (!ids.some((id) => id.startsWith('hem-'))) part.topics = [...hemTopics(), ...part.topics];
  }
  if (p.sections) for (const id of [...hemIds(), 'hem', 'jk-hem']) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
}

/** v10: halaman imej (Pengenalan, PPKI, pembahagi/pasukan/rumah Kokurikulum, pelan sekolah) diganti kandungan teks boleh sunting. */
function migrateV10(p: Partial<BookState>) {
  const ids = [
    'b-rukun-negara', 'b-aku-janji', 'b-teras', 'b-ikrar', 'b-fokus', 'b-ithink', 'b-5c', 'b-aspirasi', 'b-dpd', 'b-ts25', 'b-spi', 'b-visi-kpm',
    'b-pelan', 'b-pelan-kecemasan', 'b-visi-sekolah', 'pk-jpks', 'pk-carta', 'pk-jk-induk',
    'kk-jk-02', 'kk-jk-06', 'kk-jk-10', 'kk-pasukan-1', 'kk-pasukan-2', 'kk-pasukan-3',
    'kk-rumah-biru', 'kk-rumah-hijau', 'kk-rumah-kuning', 'kk-rumah-merah', 'kk-rumah-ungu',
  ];
  if (p.sections) for (const id of ids) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
}

/** v11: halaman Pengenalan kembali sebagai imej (kandungan sahaja) dalam header/footer sistem. */
function migrateV11(p: Partial<BookState>) {
  const ids = ['b-rukun-negara', 'b-aku-janji', 'b-teras', 'b-ikrar', 'b-fokus', 'b-ithink', 'b-5c', 'b-aspirasi', 'b-dpd', 'b-ts25', 'b-spi', 'b-visi-kpm'];
  if (p.sections) for (const id of ids) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
}

/** v13: JK Unit HEM semuanya dahulu, kemudian Bidang Tugas (susunan asal); Bidang Tugas disusun ikut turutan JK berkaitan. */
function migrateV13(p: Partial<BookState>) {
  const part = p.outline?.find((x) => x.id === 'p-hem');
  if (!part || !part.topics.some((t) => t.id === 'hem-jk')) return;
  const jkTopic = part.topics.find((t) => t.id === 'hem-jk')!;
  const oldTugas = part.topics.find((t) => t.id === 'hem-tugas');
  const all = [...jkTopic.children, ...(oldTugas?.children ?? [])];
  const isTugas = (id: string) => id.startsWith('hem-tugas-');
  const tugasIds = all.filter(isTugas);
  const jkIds = all.filter((id) => !isTugas(id));
  const tugas = [...HEM_TUGAS_ORDER.filter((id) => tugasIds.includes(id)), ...tugasIds.filter((id) => !HEM_TUGAS_ORDER.includes(id))];
  jkTopic.children = jkIds;
  const rest = part.topics.filter((t) => t.id !== 'hem-tugas');
  const at = rest.findIndex((t) => t.id === 'hem-jk');
  rest.splice(at + 1, 0, { id: 'hem-tugas', children: tugas });
  part.topics = rest;
  // halaman pengenalan Bidang Tugas & JK Induk lalai (belum disunting) dimuat semula dengan kandungan baharu
  if (p.sections) for (const id of ['hem-tugas', 'hem-jk-induk']) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
}

/** v14: carta JK Induk HEM - kad unit (nama pagi/petang), nama ringkas; halaman lalai dimuat semula. */
function migrateV14(p: Partial<BookState>) {
  if (p.sections && p.sections['hem-jk-induk'] && p.sections['hem-jk-induk'].updatedAt === null) delete p.sections['hem-jk-induk'];
}

/**
 * v6: halaman Pengenalan kini daripada PDF (halaman penuh). Bahagian Pengenalan yang belum disunting diganti
 * dengan kandungan lalai baharu; tajuk "Teras Perkhidmatan Awam & Budaya Kerja Sekolah" ditambah.
 */
function migrateV6(p: Partial<BookState>) {
  const ids = ['b-rukun-negara', 'b-aku-janji', 'b-teras', 'b-ikrar', 'b-fokus', 'b-ithink', 'b-5c', 'b-aspirasi', 'b-dpd', 'b-ts25', 'b-spi', 'b-visi-kpm'];
  if (p.sections) {
    for (const id of ids) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
  }
  const part = p.outline?.find((x) => x.id === 'p-maklumat');
  if (part && !part.topics.some((t) => t.id === 'b-teras')) {
    const at = part.topics.findIndex((t) => t.id === 'b-aku-janji');
    const topic = { id: 'b-teras', children: [] as string[] };
    if (at >= 0) part.topics.splice(at + 1, 0, topic);
    else part.topics.push(topic);
  }
}

/**
 * v5: Bahagian B (Pengenalan & Maklumat Sekolah) dan Takwim Induk sebenar. Bahagian lama yang belum diubah
 * strukturnya digantikan; bahagian Maklumat Sekolah ditambah selepas Pengenalan.
 */
function migrateV5(p: Partial<BookState>) {
  if (!p.outline) return; // tiada struktur tersimpan → struktur lalai baharu digunakan
  const defs = defaultOutline();
  const def = (id: string) => defs.find((d) => d.id === id)!;
  const kept = (id: string) => !!p.sections?.[id];
  const swapIfUntouched = (partId: string, old: string[]) => {
    const part = p.outline!.find((x) => x.id === partId);
    if (!part) return false;
    const ids = part.topics.flatMap((t) => [t.id, ...t.children]);
    if (!ids.every((id) => old.includes(id))) return false;
    const fresh = new Set(def(partId).topics.flatMap((t) => [t.id, ...t.children]));
    const extra = part.topics.filter((t) => kept(t.id) && !fresh.has(t.id) && t.id !== 'maklumat-sekolah');
    part.topics = [...def(partId).topics.map((t) => ({ ...t, children: [...t.children] })), ...extra];
    part.title = def(partId).title;
    return true;
  };
  swapIfUntouched('p-maklumat', ['kata-aluan', 'maklumat-sekolah']);
  const takwimSwapped = swapIfUntouched('p-takwim', ['takwim']);
  if (!p.outline.some((x) => x.id === 'p-sekolah') && defs.some((d) => d.id === 'p-sekolah')) {
    const present = new Set(p.outline.flatMap((x) => x.topics.flatMap((t) => [t.id, ...t.children])));
    // Profil sekolah dipindah ke bahagian Maklumat Sekolah
    p.outline = p.outline.map((x) => ({ ...x, topics: x.topics.filter((t) => t.id !== 'maklumat-sekolah') }));
    present.delete('maklumat-sekolah');
    const sekolah = { ...def('p-sekolah'), topics: def('p-sekolah').topics.filter((t) => !present.has(t.id)).map((t) => ({ ...t, children: [] })) };
    const at = p.outline.findIndex((x) => x.id === 'p-maklumat');
    p.outline.splice(at >= 0 ? at + 1 : 0, 0, sekolah);
  }
  if (takwimSwapped) {
    // susunan dokumen: Pengenalan → Maklumat Sekolah → Kalendar & Takwim → Pentadbiran ...
    const i = p.outline.findIndex((x) => x.id === 'p-takwim');
    const [t] = p.outline.splice(i, 1);
    const at = p.outline.findIndex((x) => x.id === 'p-sekolah');
    p.outline.splice(at + 1, 0, t);
  }
}

/**
 * v15: Bahagian Pentadbiran menjadi "PENGURUSAN & PENTADBIRAN" mengikut tajuk dokumen rujukan (carta struktur, JK, jadual).
 * Struktur lama yang belum diubah susunannya diganti; tajuk lama yang telah disunting (carta induk, JK pengurusan) dikekalkan.
 */
function migrateV15(p: Partial<BookState>) {
  const part = p.outline?.find((x) => x.id === 'p-pentadbiran');
  if (!part) return;
  const old = ['carta-organisasi', 'senarai-pagi', 'senarai-petang', 'senarai-akp', 'jk-pengurusan', 'panduan-am', 'akuan', 'bidang-tugas-guru', 'bidang-tugas-akp', 'guru-kelas', 'kumpulan-bertugas', 'jadual-bertugas-1', 'jadual-bertugas-2', 'jadual-bertugas-ppki'];
  const have = new Set(part.topics.flatMap((t) => [t.id, ...t.children]));
  const edited = (id: string) => !!p.sections?.[id] && p.sections[id].updatedAt !== null;
  if ([...have].every((id) => old.includes(id))) {
    const topics = pentadbiranTopics();
    for (const id of ['carta-organisasi', 'jk-pengurusan']) if (have.has(id) && edited(id)) topics.push({ id, children: [] });
    part.topics = topics;
    if (part.title === 'PENTADBIRAN SEKOLAH') part.title = 'PENGURUSAN & PENTADBIRAN';
  } else {
    // Struktur sudah diubah pengguna: hanya tambah tajuk baharu yang belum ada.
    const present = new Set((p.outline ?? []).flatMap((x) => x.topics.flatMap((t) => [t.id, ...t.children])));
    for (const t of pentadbiranTopics()) if (!present.has(t.id)) part.topics.push({ id: t.id, children: t.children.filter((c) => !present.has(c)) });
  }
  if (p.sections) for (const id of ['carta-organisasi', 'jk-pengurusan']) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
}

/**
 * v16: Susunan mengikut senarai KANDUNGAN dokumen rujukan (Maklumat Am → Pentadbiran → Kurikulum → HEM → Kokurikulum → Takwim).
 * Halaman Pengenalan yang tidak perlu dipadam. Struktur baharu menggantikan struktur lama; tajuk lama yang telah disunting
 * (atau tajuk/bahagian tambahan pengguna) TIDAK dipadam - diletakkan di hujung bahagian asal. Halaman lalai yang berubah
 * tajuk/susunan dimuat semula (hanya jika belum disunting).
 */
function migrateV16(p: Partial<BookState>) {
  const edited = (id: string) => !!p.sections?.[id] && p.sections[id].updatedAt !== null;
  const defs = defaultOutline();
  const old = p.outline;
  if (p.sections) {
    const refresh = [...REMOVED_IDS, ...Object.keys(OVERRIDES), ...Object.keys(partRujukanSections()), 'maklumat-sekolah', 'b-rukun-negara', 'b-ikrar', 'b-aku-janji', 'b-spi', 'b-visi-kpm'];
    for (const id of refresh) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
    for (const id of REMOVED_IDS) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
  }
  if (!old) return; // tiada struktur tersimpan → struktur lalai baharu digunakan
  const fresh = new Set(defs.flatMap((d) => d.topics.flatMap((t) => [t.id, ...t.children])));
  const removed = new Set(REMOVED_IDS);
  // Tajuk lama yang tiada dalam struktur baharu: kekalkan jika disunting atau bukan tajuk lalai yang dipadam.
  const leftovers: { part: string; id: string; children: string[] }[] = [];
  for (const part of old) {
    const home = part.id === 'p-sekolah' ? 'p-maklumat' : part.id;
    for (const t of part.topics) {
      const kids = t.children.filter((c) => !fresh.has(c) && (edited(c) || !removed.has(c)));
      if (!fresh.has(t.id) && (edited(t.id) || !removed.has(t.id))) leftovers.push({ part: home, id: t.id, children: kids });
      else if (kids.length) leftovers.push(...kids.map((c) => ({ part: home, id: c, children: [] as string[] })));
    }
  }
  const result = defs.map((d) => ({ ...d, topics: d.topics.map((t) => ({ ...t, children: [...t.children] })) }));
  for (const lf of leftovers) {
    if (removed.has(lf.id) && !edited(lf.id)) continue;
    const target = result.find((x) => x.id === lf.part) ?? result.find((x) => x.id === 'p-lampiran')!;
    target.topics.push({ id: lf.id, children: lf.children });
  }
  // Bahagian tambahan pengguna (ID bukan lalai) dikekalkan di hujung.
  for (const part of old) if (!result.some((x) => x.id === part.id) && part.id !== 'p-sekolah') result.push(part);
  // Tajuk lalai yang dipadam tetapi telah disunting: kekal dalam Maklumat Am.
  p.outline = result;
}

/**
 * v17: (1) halaman "Guru & Anggota Kumpulan Pelaksana" bergambar selepas Kata Pengantar dipadam;
 * (2) Kurikulum, HEM dan Kokurikulum mengikut senarai KANDUNGAN rujukan (satu jawatankuasa = satu tajuk/halaman, Isi Kandungan rata).
 * Halaman lama yang telah disunting (atau ditambah pengguna) TIDAK dipadam - dikekalkan sebagai halaman sambungan di hujung bahagian.
 * Halaman lalai yang belum disunting dimuat semula dengan tajuk/kandungan baharu.
 */
function migrateV17(p: Partial<BookState>) {
  const edited = (id: string) => !!p.sections?.[id] && p.sections[id].updatedAt !== null;
  if (p.sections) {
    delete p.sections['ma-guru-pelaksana'];
    const fresh = new Set(unitTopicIds());
    for (const id of Object.keys(p.sections)) if ((fresh.has(id) || REMOVED_IDS.includes(id)) && p.sections[id].updatedAt === null) delete p.sections[id];
  }
  if (!p.outline) return; // tiada struktur tersimpan → struktur lalai baharu digunakan
  const defs = defaultOutline();
  const knownDefault = new Set([...Object.keys(defaultSections()), ...REMOVED_IDS]);
  p.outline = p.outline.map((part) => {
    if (part.id === 'p-maklumat') {
      return { ...part, topics: part.topics.filter((t) => t.id !== 'ma-guru-pelaksana').map((t) => ({ ...t, children: t.children.filter((c) => c !== 'ma-guru-pelaksana') })) };
    }
    if (!FLAT_TOC_PARTS.includes(part.id)) return part;
    const def = defs.find((d) => d.id === part.id);
    if (!def) return part;
    const freshIds = new Set(def.topics.flatMap((t) => [t.id, ...t.children]));
    const leftovers = part.topics.flatMap((t) => [t.id, ...t.children]).filter((id) => !freshIds.has(id) && (edited(id) || !knownDefault.has(id)));
    const topics = def.topics.map((t) => ({ ...t, children: [...t.children] }));
    if (leftovers.length && topics.length) topics[topics.length - 1].children.push(...leftovers);
    return { ...part, topics, tocChildren: false };
  });
}

/** v18: Simulasi Jadual Waktu = halaman rujukan (imej). Halaman lalai yang belum disunting dimuat semula; satu entri Isi Kandungan. */
function migrateV18(p: Partial<BookState>) {
  if (p.sections) for (const id of ['ma-simulasi', 'ma-simulasi-2']) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
  if (p.outline) p.outline = p.outline.map((part) => (part.id !== 'p-maklumat' ? part : { ...part, topics: part.topics.map((t) => (t.id === 'ma-simulasi' ? { ...t, tocChildren: false } : t)) }));
}

/**
 * v19: bahagian PPKI, Prasekolah dan Lampiran dilengkapkan (visi/misi, enrolmen, carta, rutin, bidang tugas, takwim, borang).
 * Halaman baharu ditambah pada bahagian berkenaan tanpa mengubah susunan pengguna; halaman pengenalan lalai yang belum disunting dimuat semula.
 */
function migrateV19(p: Partial<BookState>) {
  if (p.sections) for (const id of ['pendidikan-khas', 'prasekolah', 'lampiran']) if (p.sections[id] && p.sections[id].updatedAt === null) delete p.sections[id];
  if (!p.outline) return;
  const present = new Set(allIds(p.outline));
  const merge = (partId: string, defs: OutlineTopic[]) => {
    const part = p.outline!.find((x) => x.id === partId);
    if (!part) return;
    for (const def of defs) {
      const cur = part.topics.find((t) => t.id === def.id);
      if (cur) {
        const extra = cur.children.filter((c) => !def.children.includes(c));
        cur.children = [...def.children.filter((c) => cur.children.includes(c) || !present.has(c)), ...extra];
      } else if (!present.has(def.id)) {
        part.topics.push({ id: def.id, children: def.children.filter((c) => !present.has(c)) });
      }
    }
  };
  merge('p-pkhas', ppkiTopics());
  merge('p-prasekolah', prasekolahTopics());
  merge('p-lampiran', lampiranTopics());
}

/**
 * v20: halaman pengenalan HEM, Kokurikulum & PPKI diseragamkan dengan format Unit Kurikulum (dasar → visi & misi → objektif &
 * matlamat → pengenalan/KPI). Halaman yang belum disunting dimuat semula; dalam edisi tahun baharu, halaman yang belum disunting
 * sejak edisi dicipta (updatedAt = masa cipta edisi) diganti dengan kandungan baharu yang digulung ke tahun edisi.
 */
/** v21: Carta Organisasi Induk unit dilengkapkan (format seragam, keahlian penuh) — halaman yang belum disunting dimuat semula. */
const CARTA_UNIT_IDS = ['kx-carta-induk', 'hx-carta', 'kx-carta-koku', 'pra-carta'];
/**
 * v24: Kalendar Akademik rasmi tahun edisi (cth. 2027, Kumpulan B — WP Kuala Lumpur): Kalendar Akademik, Cuti Perayaan &
 * Kelepasan Am, Minggu Akademik dan Kalendar berserlah dijana semula (jika belum disunting); Takwim Induk ditanda baris cuti.
 */
/** v25 (`marksOnly`): jenis hari cuti Takwim Induk diperincikan (kelepasan am / perayaan KPM / cuti persekolahan) — sumber serlahan Kalendar. */
function migrateV24(p: Partial<BookState>, marksOnly = false) {
  if (!p.sections) return;
  const year = useProjectStore.getState().profile.year;
  if (!hasAcademic(year)) return;
  const stamp = p.cover?.updatedAt ?? null;
  const defs = defaultSections();
  const untouched = (sec: SectionContent | undefined) => !sec || (sec.review?.status !== 'siap' && (sec.updatedAt === null || (stamp !== null && sec.updatedAt === stamp)));
  const done: ReviewMark = { year, status: 'siap', by: `Kalendar Akademik KPM ${year}`, at: Date.now() };
  for (const id of marksOnly ? [] : ['t-akademik', 't-cuti', 'ma-minggu-akademik', 't-kalendar']) {
    const old = p.sections[id];
    if (!defs[id] || !untouched(old)) continue;
    p.sections[id] = { ...defaultForYear(id, defs[id], year), updatedAt: old?.updatedAt ?? stamp, review: done };
  }
  for (const id of MASTER_IDS) {
    const sec = p.sections[id];
    if (!sec) continue;
    p.sections[id] = { ...sec, blocks: sec.blocks.map((b) => {
      if (b.type !== 'takwim') return b;
      const m = MONTHS_UP.indexOf(b.title.trim().toUpperCase());
      return m < 0 ? b : { ...b, rows: markTakwimRows(b.rows, year, m) };
    }) };
  }
}
const MONTHS_UP = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];

/** v26: bahagian baharu PLANNER GURU (satu halaman sebulan) selepas Takwim Sekolah. */
function migrateV26(p: Partial<BookState>) {
  if (!p.sections) return;
  const year = useProjectStore.getState().profile.year;
  const stamp = p.cover?.updatedAt ?? null;
  const defs = defaultSections();
  for (const id of PLANNER_IDS) {
    if (p.sections[id] || !defs[id]) continue;
    p.sections[id] = { ...defaultForYear(id, defs[id], year), ...(year > 2026 && stamp !== null ? { updatedAt: stamp } : {}) };
  }
  if (p.outline && !p.outline.some((x) => x.id === 'p-planner' || x.topics.some((t) => t.id === PLANNER_IDS[0]))) {
    const tk = p.outline.find((x) => x.id === 'p-takwim');
    if (tk) tk.topics.push(plannerTopic());
  }
}

/** v29: jadual guru bertugas (dijana v28) ditanda automatik — ketua bertugas mengikut halaman Kumpulan Guru Bertugas. */
function migrateV29(p: Partial<BookState>) {
  if (!p.sections || !hasAcademic(useProjectStore.getState().profile.year)) return;
  for (const id of ['jadual-bertugas-1', 'jadual-bertugas-2', 'jadual-bertugas-ppki']) {
    const sec = p.sections[id];
    if (!sec) continue;
    const t = sec.blocks.find((b) => b.type === 'table');
    // hanya jadual yang sudah mengikut kalendar tahun ini (lebar lajur v28) — jadual suntingan manual tidak diubah
    if (t && t.type === 'table' && t.auto === undefined && (t.colWidths?.join() === '10,6,12,10,22,22,18' || t.colWidths?.join() === '12,7,15,66')) {
      p.sections[id] = { ...sec, blocks: sec.blocks.map((b) => (b === t ? { ...t, auto: true } : b)) };
    }
  }
}

/** v28: Jadual Kumpulan Guru Bertugas & PPKI dijana mengikut kalendar rasmi tahun edisi (jika belum disunting). */
function migrateV28(p: Partial<BookState>) {
  if (!p.sections) return;
  const year = useProjectStore.getState().profile.year;
  if (!hasAcademic(year)) return;
  const stamp = p.cover?.updatedAt ?? null;
  const untouched = (sec: SectionContent | undefined) => !!sec && sec.review?.status !== 'siap' && (sec.updatedAt === null || (stamp !== null && sec.updatedAt === stamp));
  for (const [id, sec] of Object.entries(dutyRosterSections(p.sections, year))) {
    if (untouched(p.sections[id])) p.sections[id] = { ...sec, updatedAt: p.sections[id].updatedAt };
  }
}

/**
 * v27: Planner Guru menjadi tajuk ketiga di bawah Takwim Sekolah (bukan bahagian sendiri);
 * nama program khas setiap unit diisi pada Pengurusan Program Khas Sekolah (nama penyelaras dikosongkan untuk diisi unit).
 */
function migrateV27(p: Partial<BookState>) {
  if (p.outline) {
    const pl = p.outline.find((x) => x.id === 'p-planner');
    const tk = p.outline.find((x) => x.id === 'p-takwim');
    if (pl && tk) {
      for (const t of pl.topics) if (!tk.topics.some((x) => x.id === t.id)) tk.topics.push(t.id === PLANNER_IDS[0] ? { ...t, tocChildren: false } : t);
      p.outline = p.outline.filter((x) => x.id !== 'p-planner');
    }
  }
  if (!p.sections) return;
  for (const [id, unit] of [['pp-program-kurikulum', 'UNIT KURIKULUM'], ['pp-program-hem', 'UNIT HAL EHWAL MURID'], ['pp-program-koku', 'UNIT KOKURIKULUM']] as const) {
    const sec = p.sections[id];
    if (!sec) continue;
    p.sections[id] = { ...sec, blocks: sec.blocks.map((b) => {
      if (b.type !== 'table' || b.columns[0] !== 'NAMA PROGRAM' || b.rows.some((r) => (r[0] ?? '').trim())) return b;
      return { ...b, numbered: true, colWidths: [50, 16, 34], colAlign: ['left', 'center', 'center'], rows: b.rows.map((r, i) => [PROGRAM_KHAS[unit][i] ?? '', ...r.slice(1)]) };
    }) };
  }
}

/** Susun semula topik bahagian mengikut struktur lalai; halaman lalai yang dibuang pengguna kekal dibuang (kecuali `added`),
 * halaman tambahan pengguna dikekalkan di hujung bahagian. */
function reshapeParts(outline: OutlinePart[], partIds: string[], added: string[]) {
  const def = defaultOutline();
  for (const partId of partIds) {
    const part = outline.find((x) => x.id === partId);
    const dpart = def.find((x) => x.id === partId);
    if (!part || !dpart) continue;
    const had = new Set(part.topics.flatMap((t) => [t.id, ...t.children]));
    const keep = (id: string) => had.has(id) || added.includes(id);
    const topics: OutlineTopic[] = dpart.topics.filter((t) => keep(t.id)).map((t) => ({ ...t, children: t.children.filter(keep) }));
    const placed = new Set(topics.flatMap((t) => [t.id, ...t.children]));
    // topik lalai yang dibuang tetapi anaknya masih ada: anak menjadi topik sendiri
    dpart.topics.filter((t) => !keep(t.id)).forEach((t) => t.children.filter((c) => keep(c) && !placed.has(c)).forEach((c) => { topics.push({ id: c, children: [] }); placed.add(c); }));
    for (const t of part.topics) for (const id of [t.id, ...t.children]) if (!placed.has(id)) { topics.push({ id, children: [] }); placed.add(id); }
    part.topics = topics;
  }
}

/**
 * v23: Takwim Induk berpaut — setiap unit menyunting Takwim Tahunan Unit (sumber); lajur unit Takwim Induk dijana automatik.
 * Takwim unit / Takwim Induk yang belum disunting dimuat semula; yang telah disunting dikekalkan (Takwim Induk ditanda berpaut).
 */
function migrateV23(p: Partial<BookState>) {
  if (!p.sections) return;
  const year = useProjectStore.getState().profile.year;
  const stamp = p.cover?.updatedAt ?? null;
  const defs = defaultSections();
  const untouched = (sec: SectionContent | undefined) => !sec || (sec.review?.status !== 'siap' && (sec.updatedAt === null || (stamp !== null && sec.updatedAt === stamp)));
  const NEW = ['pp-takwim', 'hx-takwim'];
  for (const id of ['pp-takwim', 'hx-takwim', 'k-takwim', 'kk-takwim', 'pk-takwim', ...MASTER_IDS]) {
    const old = p.sections[id];
    if (!defs[id]) continue;
    if (untouched(old)) {
      if (old && MASTER_IDS.includes(id) && stamp !== null && year > 2026) {
        // Takwim Induk edisi baharu: baris tarikh sudah dijana untuk tahun ini — hanya tandakan berpaut
        p.sections[id] = { ...old, blocks: old.blocks.map((b) => (b.type === 'takwim' ? { ...b, linked: true } : b)) };
        continue;
      }
      const base = defaultForYear(id, defs[id], year);
      p.sections[id] = old
        ? { ...base, updatedAt: old.updatedAt, ...(old.review ? { review: old.review } : {}) }
        : { ...base, ...(year > 2026 && stamp !== null ? { updatedAt: stamp, review: { year, status: 'perlu' as const } } : {}) };
    } else if (old && MASTER_IDS.includes(id)) {
      p.sections[id] = { ...old, blocks: old.blocks.map((b) => (b.type === 'takwim' ? { ...b, linked: true } : b)) };
    }
  }
  if (p.outline) reshapeParts(p.outline, ['p-pentadbiran', 'p-kurikulum', 'p-hem', 'p-koku'], NEW);
}

/**
 * v22: halaman jawatankuasa setiap unit disusun mengikut Senarai Jawatankuasa Unit, setiap jawatankuasa disertakan
 * BIDANG TUGAS (halaman sama) dan jawatankuasa unit Kurikulum dipecah kepada halaman sendiri.
 * Suntingan pengguna dikekalkan: halaman yang telah disunting hanya ditambah Bidang Tugas jika belum ada.
 */
function migrateV22(p: Partial<BookState>) {
  if (!p.sections) return;
  const year = useProjectStore.getState().profile.year;
  const stamp = p.cover?.updatedAt ?? null;
  const defs = defaultSections();
  const untouched = (sec: SectionContent | undefined) => !sec || (sec.review?.status !== 'siap' && (sec.updatedAt === null || (stamp !== null && sec.updatedAt === stamp)));
  const fresh = (id: string, old?: SectionContent): SectionContent => ({
    ...defaultForYear(id, defs[id], year),
    updatedAt: old?.updatedAt ?? (year > 2026 ? stamp : null),
    ...(old?.review ? { review: old.review } : year > 2026 && stamp !== null ? { review: { year, status: 'perlu' as const } } : {}),
  });
  // halaman baharu
  const NEW = [...KURI_UNIT_PAGES.map(([id]) => id), 'pp-senarai-jk'];
  for (const id of NEW) if (!p.sections[id] && defs[id]) p.sections[id] = fresh(id);
  // Bidang Tugas pada halaman jawatankuasa yang belum mempunyainya
  for (const id of Object.keys(BIDANG_TUGAS)) {
    const sec = p.sections[id];
    if (sec && !sec.blocks.some((b) => b.type === 'heading' && /TUGAS/i.test(b.text))) p.sections[id] = { ...sec, blocks: [...sec.blocks, ...tugasBlocks(id)] };
  }
  // struktur: turutan halaman jawatankuasa mengikut senarai (halaman tambahan pengguna dikekalkan di hujung bahagian)
  if (p.outline) {
    reshapeParts(p.outline, ['p-pentadbiran', 'p-kurikulum', 'p-hem', 'p-koku'], NEW);
    // halaman senarai yang belum disunting dijana semula mengikut turutan & tajuk semasa
    for (const [id, partId, unit] of SENARAI_JK) {
      const old = p.sections[id];
      if (!untouched(old)) continue;
      const items = senaraiItems(partId, p.outline, p.sections);
      const base = senaraiSection(unit, items, old);
      p.sections[id] = old ? base : { ...base, ...(year > 2026 && stamp !== null ? { updatedAt: stamp, review: { year, status: 'perlu' as const } } : {}) };
    }
  }
}

function migrateV21(p: Partial<BookState>) {
  if (!p.sections) return;
  const year = useProjectStore.getState().profile.year;
  const stamp = p.cover?.updatedAt ?? null;
  const defs = defaultSections();
  for (const id of CARTA_UNIT_IDS) {
    const old = p.sections[id];
    if (!old || !defs[id] || old.review?.status === 'siap') continue;
    if (old.updatedAt === null) { delete p.sections[id]; continue; }
    if (stamp !== null && old.updatedAt === stamp) p.sections[id] = { ...defaultForYear(id, defs[id], year), updatedAt: old.updatedAt, ...(old.review ? { review: old.review } : {}) };
  }
}

function migrateV20(p: Partial<BookState>) {
  const year = useProjectStore.getState().profile.year;
  const stamp = p.cover?.updatedAt ?? null;
  const untouched = (id: string) => {
    const sec = p.sections?.[id];
    if (!sec) return true;
    if (sec.review?.status === 'siap') return false;
    return sec.updatedAt === null || (stamp !== null && sec.updatedAt === stamp);
  };
  const defs = defaultSections();
  if (p.sections) {
    for (const id of UNIT_INTRO_IDS) {
      if (!untouched(id) || !defs[id]) continue;
      const old = p.sections[id];
      if (!old || old.updatedAt === null) { delete p.sections[id]; continue; } // dimuat semula daripada lalai
      p.sections[id] = { ...defaultForYear(id, defs[id], year), updatedAt: old.updatedAt, ...(old.review ? { review: old.review } : {}) };
    }
    // halaman baharu dalam edisi bertarikh: cipta terus (digulung ke tahun edisi, bertanda perlu dikemas kini)
    for (const id of ['kk-objektif', 'pk-dasar', 'pk-objektif']) {
      if (p.sections[id] || stamp === null || year <= 2026) continue;
      p.sections[id] = { ...defaultForYear(id, defs[id], year), updatedAt: stamp, review: { year, status: 'perlu' } };
    }
    for (const id of Object.keys(p.sections)) {
      const sec = p.sections[id];
      if ((id.startsWith('pk-') || id === 'pendidikan-khas') && sec.subtitle === 'PPKI') p.sections[id] = { ...sec, subtitle: '' };
    }
  }
  if (!p.outline) return;
  const merged = new Set(KOKU_MERGED.filter((id) => untouched(id)));
  const reshape = (partId: string, intro: OutlineTopic) => {
    const part = p.outline!.find((x) => x.id === partId);
    if (!part) return;
    const all = part.topics.flatMap((t) => [t.id, ...t.children]);
    const want = new Set([intro.id, ...intro.children]);
    const extras = all.filter((id) => !want.has(id) && !merged.has(id));
    const first = part.topics.findIndex((t) => t.id === intro.id);
    const rest = part.topics.filter((_t, i) => i !== first).map((t) => ({ ...t, children: t.children.filter((c) => !want.has(c) && !merged.has(c)) })).filter((t) => !want.has(t.id) && !merged.has(t.id));
    const leftover = extras.filter((id) => !rest.some((t) => t.id === id || t.children.includes(id)));
    part.topics = [{ id: intro.id, children: [...intro.children, ...leftover] }, ...rest];
  };
  reshape('p-hem', hemIntroTopic());
  reshape('p-koku', kokuIntroTopic());
  const pk = p.outline.find((x) => x.id === 'p-pkhas');
  if (pk) {
    const fresh = ppkiIntroTopics();
    const freshIds = new Set(fresh.flatMap((t) => [t.id, ...t.children]));
    const extras = pk.topics.flatMap((t) => [t.id, ...t.children]).filter((id) => !freshIds.has(id));
    pk.topics = [...fresh.filter((t) => t.children.length || PPKI_PAGES.includes(t.id)), ...extras.map((id) => ({ id, children: [] }))];
    pk.tocChildren = false;
  }
}

export const useBookStore = create<BookState>()(
  persist(
    (set) => {
      const editBlocks = (id: string, fn: (blocks: Block[]) => Block[]) =>
        set((s) => {
          const sec = s.sections[id];
          if (!sec) return s;
          return { sections: { ...s.sections, [id]: { ...sec, blocks: fn(sec.blocks), updatedAt: now() } } };
        });
      const mapParts = (fn: (p: OutlinePart) => OutlinePart) => set((s) => ({ outline: s.outline.map(fn) }));

      return {
        cover: defaultCover(),
        sections: defaultSections(),
        outline: defaultOutline(),
        lastSavedAt: null,
        updateCover: (patch) => set((s) => ({ cover: { ...s.cover, ...patch, updatedAt: now() } })),
        updateSection: (id, patch) =>
          set((s) => (s.sections[id] ? { sections: { ...s.sections, [id]: { ...s.sections[id], ...patch, updatedAt: now() } } } : s)),
        addBlock: (id, type) => editBlocks(id, (b) => [...b, createBlock(type)]),
        updateBlock: (id, blockId, block) => editBlocks(id, (b) => b.map((x) => (x.id === blockId ? block : x))),
        removeBlock: (id, blockId) => editBlocks(id, (b) => b.filter((x) => x.id !== blockId)),
        moveBlock: (id, blockId, dir) =>
          editBlocks(id, (b) => {
            const i = b.findIndex((x) => x.id === blockId);
            return swap(b, i, i + dir);
          }),
        resetSection: (id) =>
          set((s) => {
            const year = useProjectStore.getState().profile.year;
            const review = id === 'kulit' ? s.cover.review : s.sections[id]?.review;
            if (id === 'kulit') return { cover: { ...defaultCover(), ...(review ? { review } : {}) } };
            const def = defaultSections()[id];
            // Dalam edisi tahun baharu, kandungan asal digulung ke tahun semasa (bukan kandungan 2026).
            const d = def
              ? defaultForYear(id, def, year)
              : { ...newSection(s.sections[id]?.title ?? ''), layout: s.sections[id]?.layout ?? 'standard' };
            return { sections: { ...s.sections, [id]: { ...d, ...(review ? { review, updatedAt: now() } : {}) } } };
          }),

        addPart: () => {
          const id = `p-${uid()}`;
          set((s) => ({ outline: [...s.outline, { id, title: 'BAHAGIAN BAHARU', note: '', divider: true, topics: [] }] }));
          return id;
        },
        updatePart: (id, patch) => mapParts((p) => (p.id === id ? { ...p, ...patch } : p)),
        removePart: (id) =>
          set((s) => {
            const part = s.outline.find((p) => p.id === id);
            const drop = new Set(part ? part.topics.flatMap((t) => [t.id, ...t.children]) : []);
            return { outline: s.outline.filter((p) => p.id !== id), sections: Object.fromEntries(Object.entries(s.sections).filter(([k]) => !drop.has(k))) };
          }),
        movePart: (id, dir) => set((s) => {
          const i = s.outline.findIndex((p) => p.id === id);
          return { outline: swap(s.outline, i, i + dir) };
        }),
        addTopic: (partId, parentId) => {
          const id = uid();
          set((s) => ({
            sections: { ...s.sections, [id]: newSection(parentId ? 'SUBTAJUK BAHARU' : 'TAJUK BAHARU') },
            outline: s.outline.map((p) =>
              p.id !== partId ? p : {
                ...p,
                topics: parentId
                  ? p.topics.map((t) => (t.id === parentId ? { ...t, children: [...t.children, id] } : t))
                  : [...p.topics, { id, children: [] }],
              }),
          }));
          return id;
        },
        removeTopic: (id) =>
          set((s) => {
            const drop = new Set([id]);
            const outline = s.outline.map((p) => ({
              ...p,
              topics: p.topics
                .filter((t) => {
                  if (t.id !== id) return true;
                  t.children.forEach((c) => drop.add(c));
                  return false;
                })
                .map((t) => ({ ...t, children: t.children.filter((c) => c !== id) })),
            }));
            return { outline, sections: Object.fromEntries(Object.entries(s.sections).filter(([k]) => !drop.has(k))) };
          }),
        moveTopic: (id, dir) =>
          mapParts((p) => {
            const i = p.topics.findIndex((t) => t.id === id);
            if (i >= 0) return { ...p, topics: swap(p.topics, i, i + dir) };
            return {
              ...p,
              topics: p.topics.map((t) => {
                const j = t.children.indexOf(id);
                return j >= 0 ? { ...t, children: swap(t.children, j, j + dir) } : t;
              }),
            };
          }),
        moveTopicToPart: (id, partId) =>
          set((s) => {
            const topic = s.outline.flatMap((p) => p.topics).find((t) => t.id === id);
            if (!topic) return s;
            return {
              outline: s.outline.map((p) => {
                const topics = p.topics.filter((t) => t.id !== id);
                return p.id === partId ? { ...p, topics: [...topics, topic] } : { ...p, topics };
              }),
            };
          }),
        resetAll: () => set({ cover: defaultCover(), sections: defaultSections(), outline: defaultOutline(), lastSavedAt: null }),
        replaceAll: (cover, sections, outline) =>
          set((s) => ({ ...normalize(s, { cover, sections, ...(outline ? { outline } : {}) }), lastSavedAt: now() })),
        markSaved: () => set({ lastSavedAt: now() }),
        setReview: (id, status, by = 'Penjana') =>
          set((s) => {
            const year = useProjectStore.getState().profile.year;
            const mark: ReviewMark = { year, status, ...(status === 'siap' ? { by, at: now() } : {}) };
            if (id === 'kulit') return { cover: { ...s.cover, review: mark } };
            const sec = s.sections[id];
            return sec ? { sections: { ...s.sections, [id]: { ...sec, review: mark } } } : s;
          }),
        applySection: (id, content, by) =>
          set((s) => {
            const year = useProjectStore.getState().profile.year;
            const base = s.sections[id];
            return {
              sections: {
                ...s.sections,
                [id]: {
                  title: content.title ?? base?.title ?? '',
                  subtitle: content.subtitle ?? base?.subtitle ?? '',
                  layout: content.layout ?? base?.layout ?? 'standard',
                  blocks: Array.isArray(content.blocks) ? content.blocks : base?.blocks ?? [],
                  updatedAt: now(),
                  review: { year, status: 'siap', by, at: now() },
                },
              },
            };
          }),
        setEdition: (data) => set({ cover: data.cover, sections: data.sections, outline: data.outline, lastSavedAt: now() }),
      };
    },
    {
      name: 'bpps2026-book',
      storage: appStorage(),
      version: 29,
      migrate: (persisted, version) => {
        const p = persisted as Partial<BookState>;
        // Bahagian yang belum pernah disunting diganti dengan kandungan lalai baharu (prefill).
        if (version < 5 && p.sections) {
          p.sections = Object.fromEntries(Object.entries(p.sections).filter(([, sec]) => sec.updatedAt !== null));
        }
        if (version < 4) migrateV4(p);
        if (version < 5) migrateV5(p);
        if (version < 6) migrateV6(p);
        if (version < 7) migrateV7(p);
        if (version < 8) migrateV8(p);
        if (version < 9) migrateV9(p);
        if (version < 10) migrateV10(p);
        if (version < 11) migrateV11(p);
        if (version < 13) migrateV13(p);
        if (version < 14) migrateV14(p);
        if (version < 15) migrateV15(p);
        if (version < 16) migrateV16(p);
        if (version < 17) migrateV17(p);
        if (version < 18) migrateV18(p);
        if (version < 19) migrateV19(p);
        if (version < 20) migrateV20(p);
        if (version < 21) migrateV21(p);
        if (version < 22) migrateV22(p);
        if (version < 23) migrateV23(p);
        if (version < 24) migrateV24(p);
        if (version < 25) migrateV24(p, true);
        if (version < 26) migrateV26(p);
        if (version < 27) migrateV27(p);
        if (version < 28) migrateV28(p);
        if (version < 29) migrateV29(p);
        return p as BookState;
      },
      merge: (persisted, current) => normalize(current, (persisted ?? {}) as Partial<Data>),
    },
  ),
);
