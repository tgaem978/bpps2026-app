import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Block, BlockType, CoverContent, OutlinePart, SectionContent } from '@/types/book';
import { kokuTopics, ppkiChildren } from '@/config/partKoku';
import { defaultCover, defaultOutline, defaultSections, newSection } from '@/config/defaultContent';
import { createBlock, uid } from '@/lib/blocks';
import { allIds } from '@/lib/outline';

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
  if (!p.outline.some((x) => x.id === 'p-sekolah')) {
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
            if (id === 'kulit') return { cover: defaultCover() };
            const d = defaultSections()[id] ?? { ...newSection(s.sections[id]?.title ?? ''), layout: s.sections[id]?.layout ?? 'standard' };
            return { sections: { ...s.sections, [id]: d } };
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
      };
    },
    {
      name: 'bpps2026-book',
      version: 7,
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
        return p as BookState;
      },
      merge: (persisted, current) => normalize(current, (persisted ?? {}) as Partial<Data>),
    },
  ),
);
