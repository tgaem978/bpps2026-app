/**
 * Eksport PowerPoint BOLEH DISUNTING: setiap halaman yang telah dipaparkan (DOM) ditukar kepada objek
 * PowerPoint asli mengikut kedudukan sebenar - kotak teks, jadual, bentuk, garis dan gambar.
 * Jalur kepala/kaki, bingkai dan tajuk diletakkan dalam Slide Master (satu bagi setiap jenis halaman),
 * dengan tajuk sebagai placeholder, jadi reka letak boleh diubah sekali untuk semua slaid.
 */
import type PptxGenJS from 'pptxgenjs';

type Pptx = InstanceType<typeof PptxGenJS>;
type Slide = ReturnType<Pptx['addSlide']>;
type Run = { text: string; options: Record<string, unknown> };
interface Box { x: number; y: number; w: number; h: number }

export const SLIDE_W = 8.27;
export const SLIDE_H = 11.69;

/* ---------------------------------------------------------------- warna & unit */
function color(css: string): { hex: string; alpha: number } | null {
  const m = css.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = '1'] = m[1].split(/[\s,/]+/).filter(Boolean);
  const alpha = parseFloat(a);
  if (alpha <= 0.02) return null;
  const hex = [r, g, b].map((v) => Math.round(parseFloat(v)).toString(16).padStart(2, '0')).join('').toUpperCase();
  return { hex, alpha };
}
const transparency = (alpha: number) => Math.round((1 - alpha) * 100);
const firstFont = (family: string) => family.split(',')[0].replace(/["']/g, '').trim() || 'Arial';

/* ---------------------------------------------------------------- gambar */
const imgCache = new Map<string, Promise<string>>();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error(`Gambar gagal dimuat: ${src.slice(0, 60)}`));
    im.src = src;
  });
}

/** Rasterkan imej ke PNG/JPEG pada saiz kotak (dengan object-fit cover jika perlu). */
async function raster(src: string, wPx: number, hPx: number, cover: boolean, jpeg: boolean, circle = false, top = false): Promise<string> {
  const key = `${src}|${Math.round(wPx)}|${Math.round(hPx)}|${cover}|${circle}|${top}`;
  let p = imgCache.get(key);
  if (!p) {
    p = (async () => {
      const im = await loadImage(src);
      const cw = Math.max(1, Math.round(wPx));
      const ch = Math.max(1, Math.round(hPx));
      const c = document.createElement('canvas');
      c.width = cw;
      c.height = ch;
      const g = c.getContext('2d')!;
      if (jpeg) { g.fillStyle = '#fff'; g.fillRect(0, 0, cw, ch); }
      if (circle) { g.beginPath(); g.arc(cw / 2, ch / 2, Math.min(cw, ch) / 2, 0, Math.PI * 2); g.clip(); }
      const iw = im.naturalWidth || cw;
      const ih = im.naturalHeight || ch;
      if (cover) {
        const s = Math.max(cw / iw, ch / ih);
        const sw = cw / s;
        const sh = ch / s;
        g.drawImage(im, (iw - sw) / 2, top ? 0 : (ih - sh) / 2, sw, sh, 0, 0, cw, ch);
      } else g.drawImage(im, 0, 0, cw, ch);
      return jpeg ? c.toDataURL('image/jpeg', 0.9) : c.toDataURL('image/png');
    })();
    imgCache.set(key, p);
  }
  return p;
}

const svgToSrc = (svg: SVGElement) => {
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(clone.outerHTML)}`;
};

/* ---------------------------------------------------------------- penukar satu halaman */
class PageConverter {
  private readonly k: number;
  private readonly origin: DOMRect;
  private readonly ops: (() => Promise<void> | void)[] = [];

  constructor(private readonly page: HTMLElement, private readonly slide: Slide, private readonly skip: Set<Element>, private readonly noDecor: Set<Element>) {
    this.origin = innerRect(page);
    this.k = SLIDE_W / this.origin.width;
  }

  /** px skrin → inci slaid */
  box(r: DOMRect, inset?: { t: number; r: number; b: number; l: number }): Box {
    const left = r.left - this.origin.left + (inset?.l ?? 0);
    const top = r.top - this.origin.top + (inset?.t ?? 0);
    const w = r.width - (inset ? inset.l + inset.r : 0);
    const h = r.height - (inset ? inset.t + inset.b : 0);
    return { x: left * this.k, y: top * this.k, w: Math.max(0.01, w * this.k), h: Math.max(0.01, h * this.k) };
  }
  pt = (px: number) => px * this.k * 72;

  async run() {
    this.noDecor.add(this.page); // latar & sempadan halaman (skrin) bukan sebahagian slaid
    this.walk(this.page);
    for (const op of this.ops) await op();
  }

  private visible(el: Element, cs: CSSStyleDeclaration) {
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 0.5 || r.height < 0.5) return false;
    const o = this.origin;
    return r.right > o.left && r.left < o.right && r.bottom > o.top && r.top < o.bottom;
  }

  private walk(el: Element) {
    if (this.skip.has(el)) return;
    const cs = getComputedStyle(el);
    if (!this.visible(el, cs)) return;
    const tag = el.tagName.toLowerCase();
    if (tag === 'img') return this.image(el as HTMLImageElement, cs);
    if (tag === 'svg') return this.svg(el as SVGElement);
    if (tag === 'table') {
      this.table(el as HTMLTableElement);
      el.querySelectorAll('img, svg').forEach((m) => this.walk(m));
      return;
    }
    if (el.classList.contains('bp-badge')) return this.badge(el as HTMLElement, cs);
    if (!this.noDecor.has(el)) this.decor(el as HTMLElement, cs);
    if (this.isTextLeaf(el)) this.text(el as HTMLElement, cs);
    for (const c of Array.from(el.children)) if (!isInline(c)) this.walk(c);
  }

  /** Latar, sempadan dan garis elemen. */
  private decor(el: HTMLElement, cs: CSSStyleDeclaration) {
    const r = el.getBoundingClientRect();
    const fill = color(cs.backgroundColor);
    const sides = (['Top', 'Right', 'Bottom', 'Left'] as const).map((s) => ({
      w: cs.getPropertyValue(`border-${s.toLowerCase()}-style`) === 'none' ? 0 : parseFloat(cs.getPropertyValue(`border-${s.toLowerCase()}-width`)) || 0,
      c: color(cs.getPropertyValue(`border-${s.toLowerCase()}-color`)),
    }));
    const uniform = sides.every((s) => s.w > 0 && s.c && s.w === sides[0].w && s.c.hex === sides[0].c!.hex);
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    const ring = el.classList.contains('bp-oc-photo') || el.classList.contains('bp-thumb');
    if (!fill && !uniform && !sides.some((s) => s.w > 0 && s.c) && !ring) return;
    const slide = this.slide;
    const b = this.box(r);
    const name = el.className && typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName;
    if (el.classList.contains('bp-oc-photo')) {
      // Bingkai bulat berganda mengikut warna tema (emas + biru gelap) dan latar putih untuk gambar
      const mm = (this.origin.right - this.origin.left) / 210;
      const gold = hexVar(this.page, '--m-accent') ?? 'C99A2E';
      const navy = hexVar(this.page, '--m-head-bg') ?? '1F3A5F';
      const ringAt = (exp: number, wpt: number, col: string) => {
        const e = exp * mm;
        slide.addShape('ellipse', {
          ...this.box(new DOMRect(r.left - e, r.top - e, r.width + 2 * e, r.height + 2 * e)),
          objectName: 'Bingkai gambar', fill: { type: 'none' }, line: { color: col, width: wpt },
        } as never);
      };
      ringAt(2.45, 1.6, navy);
      ringAt(1.15, 2.3, gold);
      slide.addShape('ellipse', { ...b, objectName: name, fill: { color: 'FFFFFF' }, line: { type: 'none' } } as never);
      return;
    }
    if (fill || uniform || ring) {
      const lw = uniform ? sides[0].w : 0;
      // garis PowerPoint dilukis di tengah sempadan: anjak setengah tebal ke dalam
      const half = lw / 2;
      const bb = uniform ? this.box(r, { t: half, r: half, b: half, l: half }) : b;
      const accent = ring ? hexVar(this.page, '--m-accent') : null;
      slide.addShape(radius > 1 ? 'roundRect' : 'rect', {
        ...bb,
        objectName: name,
        fill: fill ? { color: fill.hex, transparency: transparency(fill.alpha) } : { type: 'none' },
        line: uniform ? { color: sides[0].c!.hex, width: this.pt(lw) } : ring && accent ? { color: accent, width: 1.2 } : { type: 'none' },
        rectRadius: radius > 1 ? Math.min(0.5, (radius / Math.min(r.width, r.height))) : undefined,
      } as never);
    }
    if (!uniform) {
      // sempadan sebelah sahaja (cth. garis bawah baris, jalur kiri peranan) → segi empat nipis
      const [t, rt, bt, lt] = sides;
      const px = (v: number) => v;
      const bars: [DOMRect | Box, { hex: string; alpha: number } | null][] = [];
      if (t.w > 0) bars.push([{ x: r.left - this.origin.left, y: r.top - this.origin.top, width: r.width, height: px(t.w) } as never, t.c]);
      if (bt.w > 0) bars.push([{ x: r.left - this.origin.left, y: r.bottom - this.origin.top - bt.w, width: r.width, height: bt.w } as never, bt.c]);
      if (lt.w > 0) bars.push([{ x: r.left - this.origin.left, y: r.top - this.origin.top, width: lt.w, height: r.height } as never, lt.c]);
      if (rt.w > 0) bars.push([{ x: r.right - this.origin.left - rt.w, y: r.top - this.origin.top, width: rt.w, height: r.height } as never, rt.c]);
      for (const [bx, c] of bars) {
        if (!c) continue;
        const v = bx as unknown as { x: number; y: number; width: number; height: number };
        slide.addShape('rect', {
          x: v.x * this.k, y: v.y * this.k, w: Math.max(0.005, v.width * this.k), h: Math.max(0.005, v.height * this.k),
          fill: { color: c.hex, transparency: transparency(c.alpha) }, line: { type: 'none' }, objectName: `${name}-garis`,
        } as never);
      }
    }
  }

  private isTextLeaf(el: Element) {
    return Array.from(el.childNodes).some((n) => (n.nodeType === Node.TEXT_NODE && n.textContent!.trim()) || (n instanceof Element && isInline(n) && n.textContent!.trim()) || (n instanceof HTMLBRElement));
  }

  /** Larian teks (tebal/warna) daripada nod sebaris. */
  private runs(el: Element, cs: CSSStyleDeclaration): Run[] {
    const pre = /pre/.test(cs.whiteSpace);
    const upper = cs.textTransform === 'uppercase';
    const out: Run[] = [];
    const push = (text: string, s: CSSStyleDeclaration) => {
      let t = pre ? text.replace(/[ \t]+/g, ' ') : text.replace(/\s+/g, ' ');
      if (upper || s.textTransform === 'uppercase') t = t.toUpperCase();
      const lines = t.split('\n');
      lines.forEach((line, i) => {
        const opts: Record<string, unknown> = {};
        if (parseInt(s.fontWeight) >= 600 !== parseInt(cs.fontWeight) >= 600) opts.bold = parseInt(s.fontWeight) >= 600;
        if (s.fontStyle === 'italic') opts.italic = true;
        const c = color(s.color);
        if (c && s !== cs) opts.color = c.hex;
        if (s !== cs && s.fontSize !== cs.fontSize) opts.fontSize = this.pt(parseFloat(s.fontSize));
        if (i < lines.length - 1) opts.breakLine = true;
        out.push({ text: line, options: opts });
      });
    };
    const before = getComputedStyle(el, '::before').content;
    if (before && before !== 'none' && before !== 'normal' && /^["']/.test(before)) push(before.slice(1, -1) + ' ', cs);
    const visit = (node: Node, s: CSSStyleDeclaration) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) push(n.textContent ?? '', s);
        else if (n instanceof HTMLBRElement) { if (out.length) out[out.length - 1].options.breakLine = true; }
        else if (n instanceof Element && isInline(n)) visit(n, getComputedStyle(n));
      });
    };
    visit(el, cs);
    // buang ruang di hujung baris & larian kosong
    for (const r of out) if (r.options.breakLine) r.text = r.text.replace(/\s+$/, '');
    if (out.length) { out[0].text = out[0].text.replace(/^\s+/, ''); out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, ''); }
    return out.filter((r, i) => r.text || r.options.breakLine || i === out.length - 1);
  }

  private textOpts(cs: CSSStyleDeclaration) {
    const c = color(cs.color);
    const fs = parseFloat(cs.fontSize);
    const lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight);
    const align = cs.textAlign === 'center' ? 'center' : cs.textAlign === 'right' || cs.textAlign === 'end' ? 'right' : cs.textAlign === 'justify' ? 'justify' : 'left';
    const ls = parseFloat(cs.letterSpacing);
    return {
      fontFace: firstFont(cs.fontFamily),
      fontSize: Math.max(4, +this.pt(fs).toFixed(1)),
      color: c?.hex ?? '000000',
      bold: parseInt(cs.fontWeight) >= 600,
      italic: cs.fontStyle === 'italic',
      underline: /underline/.test(cs.textDecorationLine) ? { style: 'sng' } : undefined,
      align,
      lineSpacing: +this.pt(lh).toFixed(1),
      charSpacing: ls ? +this.pt(ls).toFixed(2) : undefined,
      margin: 0,
      valign: 'top',
      fit: 'none',
      wrap: true,
    } as Record<string, unknown>;
  }

  private contentBox(el: HTMLElement, cs: CSSStyleDeclaration) {
    const n = (v: string) => parseFloat(v) || 0;
    return this.box(el.getBoundingClientRect(), {
      t: n(cs.paddingTop) + n(cs.borderTopWidth), r: n(cs.paddingRight) + n(cs.borderRightWidth),
      b: n(cs.paddingBottom) + n(cs.borderBottomWidth), l: n(cs.paddingLeft) + n(cs.borderLeftWidth),
    });
  }

  /** Ruang tambahan supaya perbezaan metrik fon PowerPoint tidak memaksa baris baharu. */
  private slack(b: Box, align: unknown): Box {
    if (align === 'justify') return b; // teks rata kiri-kanan mesti kekal selebar asal
    const extra = Math.min(0.25, b.w * 0.04);
    if (align === 'center') return { ...b, x: b.x - extra / 2, w: b.w + extra };
    if (align === 'right') return { ...b, x: b.x - extra, w: b.w + extra };
    return { ...b, w: b.w + extra };
  }

  private text(el: HTMLElement, cs: CSSStyleDeclaration) {
    const runs = this.runs(el, cs);
    if (!runs.some((r) => r.text.trim())) return;
    const o = this.textOpts(cs);
    let b = this.contentBox(el, cs);
    if (cs.display.includes('flex') && cs.alignItems === 'center') o.valign = 'middle';
    if (el.tagName === 'LI') {
      // penanda senarai: guna bulet/nombor PowerPoint di dalam ruang lekukan
      const list = el.parentElement!;
      const lb = list.getBoundingClientRect();
      const indentPx = el.getBoundingClientRect().left - lb.left + (parseFloat(cs.paddingLeft) || 0);
      const ordered = list.tagName === 'OL';
      const index = Array.from(list.children).indexOf(el) + ((list as HTMLOListElement).start || 1);
      b = { ...b, x: lb.left * this.k - this.origin.left * this.k, w: b.w + indentPx * this.k };
      runs[0].options.bullet = ordered ? { type: 'number', numberStartAt: index, indent: this.pt(indentPx) } : { indent: this.pt(indentPx) };
    }
    this.slide.addText(runs as never, { ...this.slack(b, o.align), ...o, objectName: (typeof el.className === 'string' && el.className.split(' ')[0]) || el.tagName } as never);
  }

  private badge(el: HTMLElement, cs: CSSStyleDeclaration) {
    const r = el.getBoundingClientRect();
    const b = this.box(r);
    const inner = getComputedStyle(el, '::before');
    const fill = color(inner.backgroundColor) ?? { hex: '004358', alpha: 1 };
    // Segi empat selari condong seperti lencana dokumen asal (garis putih 3pt).
    this.slide.addShape('custGeom' as never, {
      ...b, objectName: 'Lencana',
      fill: { color: fill.hex }, line: { color: 'FFFFFF', width: 3 },
      points: [{ x: 0, y: 0 }, { x: b.w * 0.8638, y: 0 }, { x: b.w, y: b.h }, { x: b.w * 0.1362, y: b.h }, { close: true }],
    } as never);
    const o = this.textOpts(cs);
    this.slide.addText(this.runs(el, cs) as never, { ...b, ...o, align: 'center', valign: 'middle', objectName: 'Teks lencana' } as never);
  }

  private image(el: HTMLImageElement, cs: CSSStyleDeclaration) {
    const r = el.getBoundingClientRect();
    // potong pada sempadan halaman (imej latar/jalur boleh melimpah sedikit)
    const o = this.origin;
    const L = Math.max(r.left, o.left); const T = Math.max(r.top, o.top);
    const R = Math.min(r.right, o.right); const B = Math.min(r.bottom, o.bottom);
    if (R - L < 1 || B - T < 1) return;
    const clipped = R - L < r.width - 1 || B - T < r.height - 1;
    const b = this.box(new DOMRect(L, T, R - L, B - T));
    const cover = cs.objectFit === 'cover';
    const scale = Math.min(4, 1800 / Math.max(r.width, 1));
    const circle = /%$/.test(cs.borderTopLeftRadius) && parseFloat(cs.borderTopLeftRadius) >= 40;
    const top = /\s0%$|top$/.test(cs.objectPosition.trim());
    const jpeg = !circle && (/\.jpe?g($|\?)/i.test(el.currentSrc || el.src) || el.src.startsWith('data:image/jpeg'));
    this.ops.push(async () => {
      try {
        let data = await raster(el.currentSrc || el.src, r.width * scale, r.height * scale, cover, jpeg, circle, top);
        if (clipped) data = await cropData(data, (L - r.left) / r.width, (T - r.top) / r.height, (R - L) / r.width, (B - T) / r.height, jpeg);
        this.slide.addImage({ data, ...b, objectName: el.alt || 'Gambar' } as never);
      } catch (e) { console.warn(e); }
    });
  }

  private svg(el: SVGElement) {
    const r = el.getBoundingClientRect();
    const b = this.box(r);
    const src = svgToSrc(el);
    this.ops.push(async () => {
      try { this.slide.addImage({ data: await raster(src, r.width * 4, r.height * 4, false, false), ...b, objectName: 'Gambar' } as never); } catch (e) { console.warn(e); }
    });
  }

  /** Jadual HTML → jadual PowerPoint asli (lebar lajur, tinggi baris, warna, sempadan & teks). */
  private table(t: HTMLTableElement) {
    const rows = Array.from(t.rows).filter((tr) => getComputedStyle(tr).display !== 'none');
    if (!rows.length) return;
    const tb = this.box(t.getBoundingClientRect());
    const first = rows.reduce((a, tr) => (tr.cells.length > a.cells.length ? tr : a), rows[0]);
    const colW = Array.from(first.cells).map((c) => c.getBoundingClientRect().width * this.k);
    const data = rows.map((tr) => Array.from(tr.cells).map((td) => {
      const cs = getComputedStyle(td);
      const n = (v: string) => parseFloat(v) || 0;
      const side = (s: string) => {
        const w = cs.getPropertyValue(`border-${s}-style`) === 'none' ? 0 : n(cs.getPropertyValue(`border-${s}-width`));
        const c = color(cs.getPropertyValue(`border-${s}-color`));
        return w > 0 && c ? { type: 'solid', pt: +this.pt(w).toFixed(2), color: c.hex } : { type: 'none' };
      };
      const fill = color(cs.backgroundColor);
      const o = this.textOpts(cs);
      const runs = this.cellRuns(td, cs);
      return {
        text: runs.length ? runs : '',
        options: {
          ...o,
          lineSpacing: undefined,
          valign: cs.verticalAlign === 'top' ? 'top' : cs.verticalAlign === 'bottom' ? 'bottom' : 'middle',
          fill: fill ? { color: fill.hex } : undefined,
          border: [side('top'), side('right'), side('bottom'), side('left')],
          margin: [n(cs.paddingTop), n(cs.paddingRight), n(cs.paddingBottom), n(cs.paddingLeft)].map((v) => +(v * this.k).toFixed(3)),
          colspan: td.colSpan > 1 ? td.colSpan : undefined,
          rowspan: td.rowSpan > 1 ? td.rowSpan : undefined,
        },
      };
    }));
    const rowH = rows.map((tr) => tr.getBoundingClientRect().height * this.k);
    this.slide.addTable(data as never, { x: tb.x, y: tb.y, w: tb.w, colW, rowH, autoPage: false, objectName: 'Jadual' } as never);
  }

  /** Teks sel: gabungkan semua keturunan teks (termasuk div/span dalam sel) mengikut baris. */
  private cellRuns(td: HTMLElement, cs: CSSStyleDeclaration): Run[] {
    const out: Run[] = [];
    const blocks: Element[] = [];
    const collect = (el: Element) => {
      if (el.tagName === 'IMG' || el.tagName === 'svg') return;
      if (this.isTextLeaf(el)) blocks.push(el);
      for (const c of Array.from(el.children)) if (!isInline(c)) collect(c);
    };
    collect(td);
    blocks.forEach((b, i) => {
      const rs = this.runs(b, b === td ? cs : getComputedStyle(b));
      if (b !== td) {
        const bcs = getComputedStyle(b);
        const c = color(bcs.color);
        rs.forEach((r) => {
          if (r.options.bold === undefined && parseInt(bcs.fontWeight) >= 600 !== parseInt(cs.fontWeight) >= 600) r.options.bold = parseInt(bcs.fontWeight) >= 600;
          if (!r.options.color && c) r.options.color = c.hex;
          if (!r.options.fontSize && bcs.fontSize !== cs.fontSize) r.options.fontSize = +this.pt(parseFloat(bcs.fontSize)).toFixed(1);
        });
      }
      if (i < blocks.length - 1 && rs.length) rs[rs.length - 1].options.breakLine = true;
      out.push(...rs);
    });
    return out;
  }
}

/** Nilai CSS variable warna (#rrggbb) → hex tanpa '#'. */
function hexVar(el: Element, name: string): string | null {
  const v = getComputedStyle(el).getPropertyValue(name).trim();
  const m = v.match(/^#([0-9a-f]{6})$/i) ?? v.match(/^#([0-9a-f]{3})$/i);
  if (!m) return null;
  return (m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]).toUpperCase();
}

/** Kawasan halaman tanpa sempadan paparan skrin. */
function innerRect(page: HTMLElement): DOMRect {
  const r = page.getBoundingClientRect();
  return new DOMRect(r.left + page.clientLeft, r.top + page.clientTop, page.clientWidth, page.clientHeight);
}

function isInline(el: Element) {
  const d = getComputedStyle(el).display;
  return d === 'inline' || d === 'contents';
}

async function cropData(data: string, fx: number, fy: number, fw: number, fh: number, jpeg: boolean) {
  const im = await loadImage(data);
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(im.width * fw));
  c.height = Math.max(1, Math.round(im.height * fh));
  c.getContext('2d')!.drawImage(im, im.width * fx, im.height * fy, c.width, c.height, 0, 0, c.width, c.height);
  return jpeg ? c.toDataURL('image/jpeg', 0.9) : c.toDataURL('image/png');
}

/* ---------------------------------------------------------------- master & eksport */
interface MasterParts { name: string; skip: Element[]; noDecor: Element[] }

/** Bina Slide Master bagi jenis halaman ini (jalur kepala/kaki, latar, bingkai, placeholder tajuk). */
async function ensureMaster(pptx: Pptx, page: HTMLElement, made: Map<string, string>): Promise<MasterParts> {
  const pt = page.dataset.pt ?? 'standard';
  const header = page.querySelector<HTMLImageElement>(':scope > .bp-header-img');
  const footer = page.querySelector<HTMLImageElement>(':scope > .bp-footer-img');
  const bg = page.querySelector<HTMLImageElement>(':scope > .bp-bg-img');
  const full = page.querySelector<HTMLImageElement>(':scope > .bp-full-img');
  const frame = page.querySelector<HTMLElement>(':scope > .bp-frame');
  const title = page.querySelector<HTMLElement>('.bp-title');
  const skip: Element[] = [header, footer, bg, full, title].filter((x): x is HTMLImageElement | HTMLElement => !!x);
  const sig = [pt, header?.src, footer?.src, bg?.src, full?.src, frame ? getComputedStyle(frame).borderTopColor + getComputedStyle(frame).borderTopWidth : ''].join('|');
  const existing = made.get(sig);
  const noDecor: Element[] = frame ? [frame] : [];
  if (existing) return { name: existing, skip, noDecor };

  const base = `BPPS ${({ cover: 'Kulit', toc: 'Isi Kandungan', divider: 'Partition', standard: 'Halaman Isi', twocol: 'Dua Lajur', open: 'Tajuk Sahaja', notes: 'Catatan' } as Record<string, string>)[pt] ?? pt}`;
  const same = [...made.values()].filter((v) => v === base || v.startsWith(`${base} (`)).length;
  const name = same ? `${base} (${same + 1})` : base;
  const o = innerRect(page);
  const k = SLIDE_W / o.width;
  const objects: unknown[] = [];
  const imgObj = async (im: HTMLImageElement, jpeg: boolean) => {
    const r = im.getBoundingClientRect();
    const L = Math.max(r.left, o.left); const T = Math.max(r.top, o.top);
    const R = Math.min(r.right, o.right); const B = Math.min(r.bottom, o.bottom);
    const scale = Math.min(3, 2000 / r.width);
    let data = await raster(im.currentSrc || im.src, r.width * scale, r.height * scale, getComputedStyle(im).objectFit === 'cover', jpeg);
    if (R - L < r.width - 1 || B - T < r.height - 1) data = await cropData(data, (L - r.left) / r.width, (T - r.top) / r.height, (R - L) / r.width, (B - T) / r.height, jpeg);
    objects.push({ image: { data, x: (L - o.left) * k, y: (T - o.top) * k, w: (R - L) * k, h: (B - T) * k } });
  };
  if (full) await imgObj(full, true);
  if (bg) await imgObj(bg, false);
  if (header) await imgObj(header, false);
  if (footer) await imgObj(footer, false);
  if (frame) {
    const cs = getComputedStyle(frame);
    const r = frame.getBoundingClientRect();
    const w = parseFloat(cs.borderTopWidth) || 0;
    const c = color(cs.borderTopColor);
    const f = color(cs.backgroundColor);
    if (w && c) {
      objects.push({ rect: {
        x: (r.left - o.left + w / 2) * k, y: (r.top - o.top + w / 2) * k, w: (r.width - w) * k, h: (r.height - w) * k,
        fill: f ? { color: f.hex, transparency: transparency(f.alpha) } : { type: 'none' }, line: { color: c.hex, width: w * k * 72 },
      } });
    }
  }
  if (title) {
    const box = page.querySelector<HTMLElement>('.bp-title-box') ?? title;
    const r = box.getBoundingClientRect();
    const cs = getComputedStyle(title);
    const c = color(cs.color);
    objects.push({ placeholder: {
      options: {
        name: 'title', type: 'title', x: (r.left - o.left) * k, y: (r.top - o.top) * k, w: (r.width + 4) * k, h: r.height * k,
        fontFace: firstFont(cs.fontFamily), fontSize: 24, bold: true, color: c?.hex ?? '000000', align: 'center', valign: 'middle', margin: 0,
      },
      text: '',
    } });
  }
  pptx.defineSlideMaster({ title: name, background: { color: 'FFFFFF' }, objects } as never);
  made.set(sig, name);
  return { name, skip, noDecor };
}

/** Eksport halaman sebagai slaid PowerPoint yang boleh disunting. */
export async function buildNativePptx(pptx: Pptx, wraps: HTMLElement[], onProgress: (done: number, total: number) => void) {
  const masters = new Map<string, string>();
  for (let i = 0; i < wraps.length; i++) {
    const page = wraps[i].querySelector<HTMLElement>('.book-page');
    if (!page) continue;
    const m = await ensureMaster(pptx, page, masters);
    const slide = pptx.addSlide({ masterName: m.name });
    const title = page.querySelector<HTMLElement>('.bp-title');
    if (title && m.skip.includes(title)) {
      const cs = getComputedStyle(title);
      const k = SLIDE_W / innerRect(page).width;
      const text = cs.textTransform === 'uppercase' ? title.innerText.toUpperCase() : title.innerText;
      // Tajuk: warna & saiz seperti halaman, bayang sangat lembut
      const size = +(parseFloat(cs.fontSize) * k * 72).toFixed(1);
      const ink = color(cs.color)?.hex ?? '102A36';
      slide.addText([{ text, options: { fontSize: size, bold: true, color: ink, charSpacing: +(size * 0.015).toFixed(2) } }] as never, {
        placeholder: 'title', fontSize: size, bold: true, color: ink,
        lineSpacingMultiple: 1.0,
        shadow: { type: 'outer', angle: 90, blur: 1.5, offset: 0.6, color: '102A36', opacity: 0.2 },
      } as never);
    }
    await new PageConverter(page, slide, new Set(m.skip), new Set(m.noDecor)).run();
    onProgress(i + 1, wraps.length);
  }
}
