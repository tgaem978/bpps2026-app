import { createElement, useEffect, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { AnyBlock, SectionLayout, TocRowsBlock } from '@/types/book';
import BlockView from '@/components/book/BlockView';
import { pageGeometry } from '@/templates/bpps';
import { applyMasterCss, type PageType } from '@/templates/master';
import { useBookStore } from '@/stores/bookStore';
import { useMasterStore, resolveMaster } from '@/stores/masterStore';
import { useStaffStore } from '@/stores/staffStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';
import type { BookCtx } from '@/lib/resolve';

/**
 * Penomboran halaman automatik. Setiap blok diukur dalam bekas tersembunyi yang
 * menggunakan gaya master jenis halaman yang sama (data-pt), selebar ruang kandungan.
 * Semua saiz menggunakan unit halaman (cqw), jadi nisbah sama pada skrin dan cetakan.
 */

export interface Segment { blockId: string; from: number; to: number; density?: number }
export type PagePlan =
  | { kind: 'cover'; key: string; number: null }
  | { kind: 'toc'; key: string; number: number; block: TocRowsBlock; from: number; to: number }
  | { kind: 'divider'; key: string; number: number; partId: string }
  | { kind: 'content'; key: string; number: number; sectionId: string; layout: SectionLayout; columns: Segment[][]; part: number; parts: number };

/** keep[i] = unit i mesti bersama unit seterusnya (tajuk, subtajuk, label kumpulan). */
interface Measured { overhead: number; units: number[]; keep: boolean[] }

const HOST_PX = 1000; // lebar halaman dalam bekas pengukur
const pxPerMm = HOST_PX / pageGeometry.width;
const COL_GAP_MM = 6;
// Margin keselamatan 5%: garisan nipis dibundarkan ke >=1px pada paparan kecil.
const SAFETY = 0.95;

/** Ruang kandungan (mm) untuk jenis halaman, mengambil kira ketebalan bingkai master. */
export function contentBox(frameWidthMm: number) {
  const f = pageGeometry.frame;
  const inset = 2 * (frameWidthMm + f.padding);
  return {
    width: pageGeometry.width - f.left - f.right - inset,
    height: pageGeometry.height - f.top - f.bottom - inset,
  };
}

const caches = new Map<string, WeakMap<AnyBlock, Measured>>();
const hosts = new Map<string, HTMLDivElement>();

function getHost(pt: PageType, widthMm: number): HTMLDivElement {
  const key = `${pt}|${widthMm.toFixed(2)}`;
  const hit = hosts.get(key);
  if (hit && document.body.contains(hit)) return hit;
  const wrap = document.createElement('div');
  wrap.className = 'book-page-wrap';
  wrap.setAttribute('aria-hidden', 'true');
  Object.assign(wrap.style, { position: 'absolute', left: '-20000px', top: '0', width: `${HOST_PX}px`, visibility: 'hidden' });
  // Tipografi diwarisi daripada .book-page[data-pt], jadi pengukur mesti berada di dalamnya.
  const page = document.createElement('div');
  page.className = 'book-page bp-measure';
  page.dataset.pt = pt;
  const host = document.createElement('div');
  host.className = 'bp-content';
  host.style.width = `${widthMm * pxPerMm}px`;
  page.appendChild(host);
  wrap.appendChild(page);
  document.body.appendChild(wrap);
  hosts.set(key, host);
  return host;
}

function measure(block: AnyBlock, ctx: BookCtx, pt: PageType, widthMm: number, sig: string, density = 0): Measured {
  const ckey = `${pt}|${widthMm.toFixed(2)}|${sig}|d${density}`;
  let cache = caches.get(ckey);
  if (!cache) caches.set(ckey, (cache = new WeakMap()));
  const hit = cache.get(block);
  if (hit) return hit;
  const h = getHost(pt, widthMm);
  h.innerHTML = renderToStaticMarkup(createElement(BlockView, { block, ctx, density }));
  const root = h.firstElementChild as HTMLElement | null;
  const els = Array.from(h.querySelectorAll<HTMLElement>('.u'));
  const units = els.map((el) => el.getBoundingClientRect().height);
  const keep = els.map((el) => el.classList.contains('kn'));
  const total = root ? root.getBoundingClientRect().height : 0;
  const m = { overhead: Math.max(0, total - units.reduce((a, b) => a + b, 0)), units, keep };
  h.innerHTML = '';
  cache.set(block, m);
  return m;
}

interface PaginateOpts { pt: PageType; widthMm: number; heightMm: number; columns: number; sig: string }

/** Pecahkan blok kepada halaman; setiap halaman mempunyai 1 atau 2 lajur segmen. */
export function paginate(blocks: AnyBlock[], ctx: BookCtx, o: PaginateOpts): Segment[][][] {
  const colW = o.columns > 1 ? (o.widthMm - COL_GAP_MM * (o.columns - 1)) / o.columns : o.widthMm;
  const available = o.heightMm * pxPerMm * SAFETY;
  const slots: Segment[][] = [[]];
  let used = 0;
  // Unit terakhir yang diletakkan, jika ia mesti bersama unit seterusnya.
  let lastKeep: { h: number; overhead: number } | null = null;

  /** Mula lajur/halaman baharu; unit "kekal bersama" terakhir (tajuk/subtajuk) dibawa sekali. */
  const newSlot = () => {
    let slot = slots[slots.length - 1];
    const last = slot[slot.length - 1];
    const only = slot.length === 1 && last.to - last.from === 1;
    let carry: Segment | null = null;
    if (lastKeep && last && !only) {
      carry = { blockId: last.blockId, from: last.to - 1, to: last.to, density: last.density };
      if (last.to - last.from > 1) last.to -= 1;
      else slot.pop();
    }
    slot = [];
    slots.push(slot);
    used = 0;
    if (carry && lastKeep) {
      slot.push(carry);
      used = lastKeep.overhead + lastKeep.h;
    }
  };
  const total = (m: Measured) => m.overhead + m.units.reduce((a, b) => a + b, 0);

  for (const block of blocks) {
    let m = measure(block, ctx, o.pt, colW, o.sig);
    let density = 0;
    if (block.type === 'table' || block.type === 'takwim') {
      // Satu jadual satu halaman jika boleh: padatkan sedikit jika perlu, dan mula di halaman baharu
      // jika ia muat sepenuhnya di sana tetapi tidak dalam baki ruang halaman semasa.
      if (total(m) > available) {
        for (const d of [1, 2]) {
          const md = measure(block, ctx, o.pt, colW, o.sig, d);
          if (total(md) <= available) { m = md; density = d; break; }
        }
      }
      const slot = slots[slots.length - 1];
      if (total(m) <= available && used + total(m) > available && slot.length > 0) {
        // Cuba padatkan supaya muat dalam baki ruang (kurang ruang kosong); jika tidak, mula halaman baharu.
        const room = available - used;
        const fit = [1, 2].filter((d) => d > density).map((d) => ({ d, md: measure(block, ctx, o.pt, colW, o.sig, d) })).find((x) => total(x.md) <= room);
        if (fit) { m = fit.md; density = fit.d; } else newSlot();
      }
    }
    m.units.forEach((h, i) => {
      let slot = slots[slots.length - 1];
      let last = slot[slot.length - 1];
      let extra = last?.blockId === block.id ? 0 : m.overhead;
      if (used + extra + h > available && slot.length > 0) {
        // Tajuk/subtajuk tidak boleh tertinggal seorang di hujung lajur/halaman: bawa bersama ke halaman baharu.
        // (Jika ia satu-satunya unit dalam lajur, ia kekal supaya lajur tidak kosong.)
        newSlot();
        slot = slots[slots.length - 1];
        last = slot[slot.length - 1];
        extra = last?.blockId === block.id ? 0 : m.overhead;
      }
      if (last?.blockId === block.id && last.to === i) last.to = i + 1;
      else slot.push({ blockId: block.id, from: i, to: i + 1, density: density || undefined });
      used += extra + h;
      lastKeep = m.keep[i] ? { h, overhead: m.overhead } : null;
    });
  }
  const pages: Segment[][][] = [];
  for (let i = 0; i < slots.length; i += o.columns) {
    const cols = slots.slice(i, i + o.columns);
    while (cols.length < o.columns) cols.push([]);
    pages.push(cols);
  }
  return pages.length ? pages : [Array.from({ length: o.columns }, () => [])];
}

let fontsVersion = 0;

/** Konteks data (pangkalan data guru + profil) untuk BlockView. */
export function useBookCtx(): BookCtx {
  const fields = useStaffStore((s) => s.fields);
  const teachers = useStaffStore((s) => s.teachers);
  const profile = useProjectStore((s) => s.profile);
  return useMemo(() => ({ fields, teachers, profile }), [fields, teachers, profile]);
}

/** Pelan penuh buku: kulit, isi kandungan, partition dan halaman isi bernombor. */
export function useBookPlan(): PagePlan[] {
  const sections = useBookStore((s) => s.sections);
  const outline = useBookStore((s) => s.outline);
  const overrides = useMasterStore((s) => s.overrides);
  const rev = useStaffStore((s) => s.rev);
  const ctx = useBookCtx();
  const version = useUiStore((s) => s.layoutVersion);
  const bumpLayout = useUiStore((s) => s.bumpLayout);

  // Ukur semula selepas fon web dimuatkan.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive && fontsVersion === 0) {
        fontsVersion = 1;
        bumpLayout();
      }
    });
    return () => { alive = false; };
  }, [bumpLayout]);

  return useMemo(() => {
    void version;
    applyMasterCss((t) => resolveMaster(t, overrides));
    const sigOf = (pt: PageType) => `${JSON.stringify(overrides[pt] ?? {})}|${rev}|${JSON.stringify(ctx.profile)}|${fontsVersion}`;
    const optsOf = (pt: PageType, columns = 1): PaginateOpts => {
      const m = resolveMaster(pt, overrides);
      const box = contentBox(m.showFrame ? m.frameWidth : 0);
      return { pt, widthMm: box.width, heightMm: box.height, columns, sig: sigOf(pt) };
    };

    // 1. Halaman isi setiap tajuk/subtajuk (belum bernombor)
    type Pending = Omit<Extract<PagePlan, { kind: 'content' }>, 'number'> | Omit<Extract<PagePlan, { kind: 'divider' }>, 'number'>;
    const body: Pending[] = [];
    const tocRows: TocRowsBlock['rows'] = [];
    const tocIndex: { row: number; at: number }[] = []; // baris TOC → indeks dalam body
    const pushSection = (id: string, level: 1 | 2) => {
      const sec = sections[id];
      if (!sec) return;
      tocRows.push({ level, title: sec.subtitle ? `${sec.title} — ${sec.subtitle}` : sec.title, page: 0 });
      tocIndex.push({ row: tocRows.length - 1, at: body.length });
      const layout = sec.layout ?? 'standard';
      const pages = paginate(sec.blocks, ctx, optsOf(layout, layout === 'twocol' ? 2 : 1));
      pages.forEach((columns, part) =>
        body.push({ kind: 'content', key: `${id}-${part}`, sectionId: id, layout, columns, part, parts: pages.length }),
      );
    };
    for (const part of outline) {
      tocRows.push({ level: 0, title: part.title, page: 0 });
      tocIndex.push({ row: tocRows.length - 1, at: body.length });
      if (part.divider) body.push({ kind: 'divider', key: `d-${part.id}`, partId: part.id });
      for (const t of part.topics) {
        pushSection(t.id, 1);
        t.children.forEach((c) => pushSection(c, 2));
      }
    }

    // 2. Isi kandungan (boleh lebih daripada satu halaman)
    const tocBlock: TocRowsBlock = { id: 'toc', type: 'tocrows', rows: tocRows };
    const tocPages = paginate([tocBlock], ctx, optsOf('toc'));
    const firstBody = 1 + tocPages.length; // kulit tidak bernombor; isi kandungan bermula 1
    for (const { row, at } of tocIndex) tocRows[row].page = firstBody + at;

    const plan: PagePlan[] = [{ kind: 'cover', key: 'cover', number: null }];
    tocPages.forEach((cols, i) => {
      const seg = cols[0][0];
      plan.push({ kind: 'toc', key: `toc-${i}`, number: i + 1, block: tocBlock, from: seg?.from ?? 0, to: seg?.to ?? 0 });
    });
    body.forEach((p, i) => plan.push({ ...p, number: firstBody + i } as PagePlan));
    return plan;
  }, [sections, outline, overrides, rev, ctx, version]);
}
