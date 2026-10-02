import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Block, BlockType, CoverContent, OutlinePart, SectionContent } from '@/types/book';
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
      version: 3,
      // v<3: bahagian yang belum pernah disunting diganti dengan kandungan lalai baharu (prefill).
      migrate: (persisted, version) => {
        const p = persisted as Partial<BookState>;
        if (version < 3 && p.sections) {
          p.sections = Object.fromEntries(Object.entries(p.sections).filter(([, sec]) => sec.updatedAt !== null));
        }
        return p as BookState;
      },
      merge: (persisted, current) => normalize(current, (persisted ?? {}) as Partial<Data>),
    },
  ),
);
