import { linkKalendarSections, linkTakwimSections } from '@/lib/takwimLink';
import { linkPlannerSections } from '@/lib/planner';
import { createContext, createElement, useContext, useEffect, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { AnyBlock, SectionContent, SectionLayout, TocRowsBlock } from '@/types/book';
import BlockView from '@/components/book/BlockView';
import { pageGeometry } from '@/templates/bpps';
import { applyMasterCss, type PageType } from '@/templates/master';
import { useBookStore } from '@/stores/bookStore';
import { useMasterStore, resolveMaster } from '@/stores/masterStore';
import { useStaffStore } from '@/stores/staffStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';
import type { BookCtx } from '@/lib/resolve';
import { blockVariants } from '@/lib/variants';

/**
 * Penomboran halaman automatik. Setiap blok diukur dalam bekas tersembunyi yang
 * menggunakan gaya master jenis halaman yang sama (data-pt), selebar ruang kandungan.
 * Semua saiz menggunakan unit halaman (cqw), jadi nisbah sama pada skrin dan cetakan.
 */

/** h = tinggi semula jadi segmen (px pada skala pengukur, termasuk overhead); grow = tinggi sasaran (mm halaman) bila diregang. */
export interface Segment { blockId: string; from: number; to: number; density?: number; h?: number; grow?: number }
export type FillerKind = 'notes' | 'art';
export type PagePlan =
  | { kind: 'cover'; key: string; number: null }
  | { kind: 'toc'; key: string; number: number; block: TocRowsBlock; from: number; to: number; filler?: FillerKind }
  | { kind: 'divider'; key: string; number: number; partId: string }
  | { kind: 'content'; key: string; number: number; sectionId: string; layout: SectionLayout; columns: Segment[][]; part: number; parts: number; zoom?: number; filler?: FillerKind };

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

function measure(block: AnyBlock, ctx: BookCtx, pt: PageType, widthMm: number, sig: string, density = 0, zoom = 1, variant = ''): Measured {
  const ckey = `${pt}|${widthMm.toFixed(2)}|${sig}|d${density}|z${zoom}|v${variant}`;
  let cache = caches.get(ckey);
  if (!cache) caches.set(ckey, (cache = new WeakMap()));
  const hit = cache.get(block);
  if (hit) return hit;
  const h = getHost(pt, widthMm);
  // Zum kandungan: sama seperti .bp-flow.bp-z pada halaman sebenar (lebar kekal, semua saiz didarab --z).
  h.classList.toggle('bp-z', zoom !== 1);
  if (zoom !== 1) h.style.setProperty('--z', String(zoom)); else h.style.removeProperty('--z');
  h.innerHTML = renderToStaticMarkup(createElement(BlockView, { block, ctx, density, variant }));
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

interface PaginateOpts { pt: PageType; widthMm: number; heightMm: number; columns: number; sig: string; zoom?: number }

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
      carry = { blockId: last.blockId, from: last.to - 1, to: last.to, density: last.density, h: lastKeep.overhead + lastKeep.h };
      if (last.to - last.from > 1) { last.to -= 1; last.h = (last.h ?? 0) - lastKeep.h; }
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

  const zoom = o.zoom ?? 1;
  const variants = blockVariants(blocks);
  const ms = (block: AnyBlock, d: number, v: string) => measure(block, ctx, o.pt, colW, o.sig, d, zoom, v);
  for (const [bi, block] of blocks.entries()) {
    const variant = variants[bi];
    let m = ms(block, 0, variant);
    let density = 0;
    const onePageChart = block.type === 'orgtree' || (block.type === 'committee' && block.display === 'chart' && !!block.onePage);
    if (block.type === 'table' || block.type === 'takwim' || onePageChart) {
      // Satu jadual/carta satu halaman jika boleh: padatkan sedikit jika perlu, dan mula di halaman baharu
      // jika ia muat sepenuhnya di sana tetapi tidak dalam baki ruang halaman semasa.
      const levels = onePageChart ? [1, 2, 3] : [1, 2];
      if (total(m) > available) {
        for (const d of levels) {
          const md = ms(block, d, variant);
          density = d;
          m = md;
          if (total(md) <= available) break;
        }
        if (!onePageChart && total(m) > available) { m = ms(block, 0, variant); density = 0; }
      }
      const slot = slots[slots.length - 1];
      if (total(m) <= available && used + total(m) > available && slot.length > 0) {
        // Cuba padatkan supaya muat dalam baki ruang (kurang ruang kosong); jika tidak, mula halaman baharu.
        const room = available - used;
        const fit = levels.filter((d) => d > density).map((d) => ({ d, md: ms(block, d, variant) })).find((x) => total(x.md) <= room);
        if (fit) { m = fit.md; density = fit.d; } else newSlot();
      }
      if (onePageChart) {
        // Seluruh carta = satu segmen pada satu halaman (tidak dipecah).
        if (used + total(m) > available && slots[slots.length - 1].length > 0) newSlot();
        slots[slots.length - 1].push({ blockId: block.id, from: 0, to: m.units.length, density: density || undefined, h: total(m) });
        used += total(m);
        lastKeep = null;
        continue;
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
      if (last?.blockId === block.id && last.to === i) { last.to = i + 1; last.h = (last.h ?? 0) + h; }
      else slot.push({ blockId: block.id, from: i, to: i + 1, density: density || undefined, h: extra + h });
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

/* ------------------------------------------------------------------ Auto-imbang halaman (tema Biru Navy & Emas)
 * 1. Bahagian satu halaman yang jarang: kandungan dibesarkan (zum) setakat yang masih muat satu halaman.
 * 2. Baki ruang diagih kepada blok yang boleh diregang (baris jadual, kad maklumat, senarai) hingga had yang selesa.
 * 3. Jika masih banyak ruang, panel "Catatan" bergaris mengisi baki halaman. */
const ZOOMS = [1.06, 1.12, 1.18, 1.24, 1.3, 1.4, 1.5, 1.6, 1.75];
const FILLER_MIN_MM = 34;
/** Skala padat bagi halaman jawatankuasa yang melimpah sedikit (supaya ahli + bidang tugas sehalaman). */
const SHRINKS = [0.95, 0.9, 0.86, 0.82];
const isCommitteePage = (blocks: AnyBlock[]) => blocks.some((b) => b.type === 'committee' || b.type === 'table') && blocks.some((b) => b.type === 'heading' && /TUGAS/i.test(b.text));
const usedPx = (segs: Segment[]) => segs.reduce((a, s) => a + (s.h ?? 0), 0);
const CHARTS = new Set(['orgchart', 'orgtree']);
const isChart = (b: AnyBlock) => CHARTS.has(b.type) || (b.type === 'committee' && b.display === 'chart');
function zoomCap(blocks: AnyBlock[]): number {
  if (blocks.some((b) => b.type === 'planner')) return 1; // planner bersaiz tetap sehalaman
  if (blocks.length && blocks.every(isChart)) return 1.75;
  if (blocks.some((b) => b.type === 'table' || b.type === 'takwim' || b.type === 'stafflist' || isChart(b))) return 1.18;
  return 1.3;
}
/** Had regangan (mm) bagi satu segmen: setiap baris/kad boleh bertambah tinggi hingga had yang masih kemas. */
function growCapMm(b: AnyBlock | undefined, s: Segment): number {
  if (!b) return 0;
  const n = s.to - s.from;
  switch (b.type) {
    case 'table': return n * 6;
    case 'takwim': case 'stafflist': return n * 4;
    case 'keyvalue': return n * 6;
    case 'committee': return b.display === 'chart' ? 0 : n * 4;
    case 'list': return n * 2.2;
    case 'paragraph': return Math.max(0, n - 1) * 2.5;
    case 'image': return ((s.h ?? 0) / pxPerMm) * 0.6;
    default: return 0;
  }
}
function balancePage(segs: Segment[], byId: Map<string, AnyBlock>, availablePx: number, stretch: boolean): FillerKind | undefined {
  let slack = (availablePx - usedPx(segs)) / pxPerMm;
  if (slack < 8) return undefined;
  if (stretch) {
    const caps = segs.map((s) => growCapMm(byId.get(s.blockId), s));
    const cap = caps.reduce((a, b) => a + b, 0);
    const give = Math.min(slack - 2, cap);
    if (give > 1 && cap > 0) {
      segs.forEach((s, i) => { if (caps[i] > 0) s.grow = (s.h ?? 0) / pxPerMm + (give * caps[i]) / cap; });
      slack -= give;
    }
  }
  return slack >= FILLER_MIN_MM ? 'notes' : undefined;
}

let fontsVersion = 0;

/** Tema buku sebagai atribut <html data-book-theme> supaya pengukur halaman & paparan guna gaya yang sama. */
export function applyTheme(theme: string | undefined) {
  if (typeof document !== 'undefined') document.documentElement.dataset.bookTheme = theme ?? 'klasik';
}

/**
 * Gantian kandungan halaman untuk pratonton (cth. versi cadangan daripada Portal Kemas Kini dalam peti masuk).
 * Nilai mesti stabil (useMemo) supaya pelan buku tidak dikira semula setiap render.
 */
export const SectionOverride = createContext<Record<string, SectionContent> | null>(null);

/** Semua halaman buku, termasuk gantian pratonton (jika ada). */
export function useSections(): Record<string, SectionContent> {
  const store = useBookStore((s) => s.sections);
  const ov = useContext(SectionOverride);
  // Takwim Induk berpaut: lajur unit dijana daripada Takwim Tahunan setiap unit; serlahan Kalendar daripada jenis hari cuti Takwim Induk.
  const year = useProjectStore((s) => s.profile.year);
  return useMemo(() => linkPlannerSections(linkKalendarSections(linkTakwimSections(ov ? { ...store, ...ov } : store)), year), [store, ov, year]);
}

/** Konteks data (pangkalan data guru + profil) untuk BlockView. */
export function useBookCtx(): BookCtx {
  const fields = useStaffStore((s) => s.fields);
  const teachers = useStaffStore((s) => s.teachers);
  const profile = useProjectStore((s) => s.profile);
  return useMemo(() => ({ fields, teachers, profile }), [fields, teachers, profile]);
}

/** Pelan penuh buku: kulit, isi kandungan, partition dan halaman isi bernombor. */
export function useBookPlan(): PagePlan[] {
  const sections = useSections();
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
    applyTheme(ctx.profile.theme);
    const balance = ctx.profile.theme === 'biru-emas';
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
    const pushSection = (id: string, level: 1 | 2, inToc = true, bare = false) => {
      const sec = sections[id];
      if (!sec) return;
      if (inToc) {
        tocRows.push({ level, title: sec.subtitle && !bare ? `${sec.title} — ${sec.subtitle}` : sec.title, page: 0 });
        tocIndex.push({ row: tocRows.length - 1, at: body.length });
      }
      const layout = sec.layout ?? 'standard';
      const first = sec.blocks[0];
      const fullImg = first && first.type === 'image' && (first.fullPage || first.frameFill) ? first : null;
      const cols = layout === 'twocol' ? 2 : 1;
      const o = optsOf(layout, cols);
      let pages: Segment[][][] = fullImg ? [[[{ blockId: fullImg.id, from: 0, to: 1 }]]] : paginate(sec.blocks, ctx, o);
      let zoom = 1;
      const canBalance = balance && !fullImg && cols === 1 && layout !== 'notes';
      const available = o.heightMm * pxPerMm * SAFETY;
      if (canBalance && pages.length === 1 && usedPx(pages[0][0]) > 0 && usedPx(pages[0][0]) < available * 0.86) {
        const cap = zoomCap(sec.blocks);
        for (const z of ZOOMS) {
          if (z > cap) break;
          const p = paginate(sec.blocks, ctx, { ...o, zoom: z });
          if (p.length !== 1 || p[0][0].some((s) => s.density)) break;
          pages = p;
          zoom = z;
        }
      }
      // Jawatankuasa + Bidang Tugas mesti dalam SATU halaman: jika melimpah sedikit, padatkan seluruh halaman (hingga 82%).
      if (canBalance && pages.length === 2 && isCommitteePage(sec.blocks)) {
        for (const z of SHRINKS) {
          const p = paginate(sec.blocks, ctx, { ...o, zoom: z });
          if (p.length === 1) { pages = p; zoom = z; break; }
        }
      }
      const byId = new Map<string, AnyBlock>(sec.blocks.map((b) => [b.id, b]));
      pages.forEach((columns, part) => {
        const filler = canBalance ? balancePage(columns[0], byId, available, true) : undefined;
        body.push({ kind: 'content', key: `${id}-${part}`, sectionId: id, layout, columns, part, parts: pages.length, ...(zoom !== 1 ? { zoom } : {}), ...(filler ? { filler } : {}) });
      });
    };
    for (const part of outline) {
      tocRows.push({ level: 0, title: part.title, page: 0, no: outline.indexOf(part) + 1 });
      tocIndex.push({ row: tocRows.length - 1, at: body.length });
      if (part.divider) body.push({ kind: 'divider', key: `d-${part.id}`, partId: part.id });
      for (const t of part.topics) {
        // Topik berhalaman sambungan sama tajuk (cth. Planner Guru 12 bulan): satu entri tanpa lencana bulan.
        pushSection(t.id, 1, true, t.tocChildren === false && t.children.length > 0 && t.children.every((c) => sections[c]?.title === sections[t.id]?.title));
        t.children.forEach((c) => pushSection(c, 2, part.tocChildren !== false && t.tocChildren !== false));
      }
    }

    // 2. Isi kandungan (boleh lebih daripada satu halaman)
    const tocBlock: TocRowsBlock = { id: 'toc', type: 'tocrows', rows: tocRows };
    const tocPages = paginate([tocBlock], ctx, optsOf('toc'));
    const firstBody = 1 + tocPages.length; // kulit tidak bernombor; isi kandungan bermula 1
    for (const { row, at } of tocIndex) tocRows[row].page = firstBody + at;

    const plan: PagePlan[] = [{ kind: 'cover', key: 'cover', number: null }];
    const tocO = optsOf('toc');
    tocPages.forEach((cols, i) => {
      const seg = cols[0][0];
      const spare = (tocO.heightMm * pxPerMm * SAFETY - usedPx(cols[0])) / pxPerMm;
      plan.push({ kind: 'toc', key: `toc-${i}`, number: i + 1, block: tocBlock, from: seg?.from ?? 0, to: seg?.to ?? 0, ...(balance && spare >= 60 ? { filler: 'art' as const } : {}) });
    });
    body.forEach((p, i) => plan.push({ ...p, number: firstBody + i } as PagePlan));
    return plan;
  }, [sections, outline, overrides, rev, ctx, version]);
}
