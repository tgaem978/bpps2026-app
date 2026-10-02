import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Block, BlockType, CoverContent, SectionContent } from '@/types/book';
import { defaultCover, defaultSections } from '@/config/defaultContent';
import { createBlock } from '@/lib/blocks';

interface BookState {
  cover: CoverContent;
  sections: Record<string, SectionContent>;
  lastSavedAt: number | null;
  updateCover: (patch: Partial<CoverContent>) => void;
  updateSection: (id: string, patch: Partial<Pick<SectionContent, 'title' | 'subtitle'>>) => void;
  addBlock: (id: string, type: BlockType) => void;
  updateBlock: (id: string, blockId: string, block: Block) => void;
  removeBlock: (id: string, blockId: string) => void;
  moveBlock: (id: string, blockId: string, dir: -1 | 1) => void;
  resetSection: (id: string) => void;
  resetAll: () => void;
  replaceAll: (cover: CoverContent, sections: Record<string, SectionContent>) => void;
  markSaved: () => void;
}

const now = () => Date.now();

export const useBookStore = create<BookState>()(
  persist(
    (set) => {
      const editBlocks = (id: string, fn: (blocks: Block[]) => Block[]) =>
        set((s) => {
          const sec = s.sections[id];
          if (!sec) return s;
          return { sections: { ...s.sections, [id]: { ...sec, blocks: fn(sec.blocks), updatedAt: now() } } };
        });

      return {
        cover: defaultCover(),
        sections: defaultSections(),
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
            const j = i + dir;
            if (i < 0 || j < 0 || j >= b.length) return b;
            const next = [...b];
            [next[i], next[j]] = [next[j], next[i]];
            return next;
          }),
        resetSection: (id) =>
          set((s) => {
            if (id === 'kulit') return { cover: defaultCover() };
            const d = defaultSections()[id];
            return d ? { sections: { ...s.sections, [id]: d } } : s;
          }),
        resetAll: () => set({ cover: defaultCover(), sections: defaultSections(), lastSavedAt: null }),
        replaceAll: (cover, sections) => set({ cover, sections: { ...defaultSections(), ...sections }, lastSavedAt: now() }),
        markSaved: () => set({ lastSavedAt: now() }),
      };
    },
    {
      name: 'bpps2026-book',
      version: 1,
      // Bahagian baharu yang ditambah selepas data disimpan tetap muncul.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<BookState>;
        return { ...current, ...p, sections: { ...current.sections, ...(p.sections ?? {}) } };
      },
    },
  ),
);
