import { createElement, useEffect, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Block, SectionContent } from '@/types/book';
import BlockView from '@/components/book/BlockView';
import { bookSections } from '@/config/sections';
import { contentHeightMm, contentWidthMm, pageGeometry } from '@/templates/bpps';
import { useBookStore } from '@/stores/bookStore';
import { useUiStore } from '@/stores/uiStore';

/**
 * Penomboran halaman automatik. Setiap blok diukur sekali (cache ikut objek blok) dalam
 * bekas tersembunyi selebar ruang kandungan. Semua saiz halaman menggunakan unit cqw,
 * jadi nisbah tinggi/lebar sama pada mana-mana saiz paparan atau cetakan.
 */

export interface Segment { blockId: string; from: number; to: number }
export type PagePlan =
  | { kind: 'cover'; number: null }
  | { kind: 'toc'; number: number; entries: { id: string; title: string; page: number }[] }
  | { kind: 'divider'; number: number; sectionId: string }
  | { kind: 'content'; number: number; sectionId: string; segments: Segment[]; part: number; parts: number };

interface Measured { overhead: number; units: number[] }

const HOST_PX = 1000; // lebar halaman dalam bekas pengukur
const pxPerMm = HOST_PX / pageGeometry.width;
// Margin keselamatan 5%: garisan nipis dibundarkan ke >=1px pada paparan kecil.
const available = contentHeightMm * pxPerMm * 0.95;

let cache = new WeakMap<Block, Measured>();
let host: HTMLDivElement | null = null;

function getHost(): HTMLDivElement {
  if (host && document.body.contains(host)) return host;
  const wrap = document.createElement('div');
  wrap.className = 'book-page-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  Object.assign(wrap.style, { position: 'absolute', left: '-20000px', top: '0', width: `${HOST_PX}px`, visibility: 'hidden' });
  // Tipografi diwarisi daripada .book-page, jadi pengukur mesti berada di dalamnya.
  const page = document.createElement('div');
  page.className = 'book-page bp-measure';
  host = document.createElement('div');
  host.className = 'bp-content';
  host.style.width = `${contentWidthMm * pxPerMm}px`;
  page.appendChild(host);
  wrap.appendChild(page);
  document.body.appendChild(wrap);
  return host;
}

function measure(block: Block): Measured {
  const hit = cache.get(block);
  if (hit) return hit;
  const h = getHost();
  h.innerHTML = renderToStaticMarkup(createElement(BlockView, { block }));
  const root = h.firstElementChild as HTMLElement | null;
  const units = Array.from(h.querySelectorAll<HTMLElement>('.u')).map((el) => el.getBoundingClientRect().height);
  const total = root ? root.getBoundingClientRect().height : 0;
  const m = { overhead: Math.max(0, total - units.reduce((a, b) => a + b, 0)), units };
  h.innerHTML = '';
  cache.set(block, m);
  return m;
}

/** Pecahkan blok-blok satu bahagian kepada halaman. */
export function paginateSection(sec: SectionContent): Segment[][] {
  const pages: Segment[][] = [[]];
  let used = 0;
  let lastHeading: { seg: Segment; h: number } | null = null;

  for (const block of sec.blocks) {
    const m = measure(block);
    m.units.forEach((h, i) => {
      let page = pages[pages.length - 1];
      let last = page[page.length - 1];
      let extra = last?.blockId === block.id ? 0 : m.overhead;
      if (used + extra + h > available && page.length > 0) {
        // Tajuk tidak boleh tertinggal seorang di hujung halaman.
        const carry = lastHeading && last === lastHeading.seg ? lastHeading : null;
        if (carry) page.pop();
        page = [];
        pages.push(page);
        used = 0;
        if (carry && pages[pages.length - 2].length > 0) {
          page.push(carry.seg);
          used = carry.h;
        } else if (carry) {
          pages[pages.length - 2].push(carry.seg); // halaman hanya ada tajuk: kekalkan
        }
        last = page[page.length - 1];
        extra = m.overhead;
      }
      if (last?.blockId === block.id) last.to = i + 1;
      else page.push({ blockId: block.id, from: i, to: i + 1 });
      used += extra + h;
      lastHeading = block.type === 'heading' ? { seg: page[page.length - 1], h: extra + h } : null;
    });
  }
  return pages.filter((p, i) => p.length > 0 || i === 0);
}

/** Pelan penuh buku: kulit, isi kandungan, partition dan halaman isi bernombor. */
export function useBookPlan(): PagePlan[] {
  const sections = useBookStore((s) => s.sections);
  const version = useUiStore((s) => s.layoutVersion);
  const bumpLayout = useUiStore((s) => s.bumpLayout);

  // Ukur semula selepas fon web dimuatkan.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive && !fontsSettled) {
        fontsSettled = true;
        cache = new WeakMap();
        bumpLayout();
      }
    });
    return () => { alive = false; };
  }, [bumpLayout]);

  return useMemo(() => {
    void version;
    const order = bookSections.filter((b) => b.id !== 'kulit' && sections[b.id]);
    const plan: PagePlan[] = [{ kind: 'cover', number: null }];
    const toc: Extract<PagePlan, { kind: 'toc' }> = { kind: 'toc', number: 1, entries: [] };
    plan.push(toc);
    for (const b of order) {
      const sec = sections[b.id];
      toc.entries.push({ id: b.id, title: sec.title, page: plan.length });
      if (sec.divider) plan.push({ kind: 'divider', number: plan.length, sectionId: b.id });
      const pages = paginateSection(sec);
      pages.forEach((segments, part) =>
        plan.push({ kind: 'content', number: plan.length, sectionId: b.id, segments, part, parts: pages.length }),
      );
    }
    return plan;
  }, [sections, version]);
}

let fontsSettled = false;
