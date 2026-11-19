import { isMirrored } from '../../config/layout';
import { createContext, useContext, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { useBookStore } from '@/stores/bookStore';
import { useUiStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { useMaster, useMasterStore, resolveMaster } from '@/stores/masterStore';
import { applyMasterCss, fonts, type PageType } from '@/templates/master';
import { applyTheme, useBookCtx, useBookPlan, useSections, type PagePlan, type Segment } from '@/lib/pagination';
import { BuildingArt, partIcon } from './themeArt';
import { resolveTokens, type BookCtx } from '@/lib/resolve';
import { locate } from '@/lib/outline';
import type { Block } from '@/types/book';
import { blockVariants } from '@/lib/variants';
import type { FillerKind } from '@/lib/pagination';
import BlockView from './BlockView';
import { fitPt, widthOf } from '@/lib/fit';

/** Gaya master semua jenis halaman sebagai CSS variables dalam <head>. */
export function MasterStyles() {
  const overrides = useMasterStore((s) => s.overrides);
  const theme = useProjectStore((s) => s.profile.theme);
  const mark = useUiStore((st) => st.markEmpty);
  applyMasterCss((t) => resolveMaster(t, overrides));
  applyTheme(theme);
  if (typeof document !== 'undefined' && document.documentElement.dataset.mark !== 'off') document.documentElement.dataset.mark = mark ? '1' : '0';
  return null;
}

const useTheme = () => useProjectStore((s) => s.profile.theme ?? 'klasik');

/** Halaman A4 potret. Saiz dalam unit --mm/--pt (diskala ikut lebar halaman). */
function Sheet({ pt, children, className = '' }: { pt: PageType; children: ReactNode; className?: string }) {
  return (
    <div className="book-page-wrap">
      <article className={`book-page ${className}`} data-pt={pt}>{children}</article>
    </div>
  );
}

function useFooterText(template: string, ctx: BookCtx) {
  const motto = useBookStore((s) => s.cover.motto);
  // Tahun dalam teks kaki sentiasa tahun edisi (cth. teks kaki tersuai "TAHUN 2026" dalam buku 2027 → "TAHUN 2027").
  return resolveTokens(template.replace(/\{\{\s*motto\s*\}\}/g, motto), ctx).replace(/\b(?:19|20)\d{2}\b/g, String(ctx.profile.year));
}

const FOOT_FONT = '"Arial Narrow", "Liberation Sans Narrow", "Roboto Condensed", Arial, sans-serif';
const CONNECTORS = new Set(['DAN', 'DI', 'KE', 'DARI', 'YANG', 'UNTUK', 'DENGAN', 'ATAU', '&', 'SERTA', 'BAGI', 'PADA', 'DALAM']);

/** Pecah tajuk halaman: 1-2 patah perkataan = satu baris; 3 atau lebih = dua baris seimbang (tidak berakhir pada kata sambung). */
export function splitTitle(title: string, font: string): string[] {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 2) return [words.join(' ')];
  const w = (t: string) => widthOf(t, font);
  let best = 1, bestScore = Infinity;
  for (let k = 1; k < words.length; k++) {
    const a = words.slice(0, k).join(' '), b = words.slice(k).join(' ');
    let score = Math.max(w(a), w(b));
    if (CONNECTORS.has(words[k - 1].toUpperCase())) score += 1000;
    if (score < bestScore) { bestScore = score; best = k; }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

/** Templat halaman isi (BPPS 05 dan variasinya): jalur tajuk, bingkai, jalur kaki. */
type FrameProps = { pt: PageType; title: string; badge?: string; number?: number; children: ReactNode; zoom?: number; partNo?: number; flow?: boolean };
export function ContentFrame(props: FrameProps) {
  return useTheme() === 'biru-emas' ? <BeContentFrame {...props} /> : <KlasikContentFrame {...props} />;
}

function KlasikContentFrame({ pt, title, badge, number, children }: FrameProps) {
  const m = useMaster(pt);
  const ctx = useBookCtx();
  const footer = useFooterText(m.footerText, ctx);
  // Tajuk berpusat dalam kanvas putih kiri (90mm x 11.7mm); lencana sentiasa ada pada imej header (teks lalai "BPPS <tahun>").
  const badgeText = badge || resolveTokens('BPPS {{tahun}}', ctx);
  const titleLines = splitTitle(m.titleUpper ? title.toUpperCase() : title, fonts[m.titleFont]);
  const titlePt = Math.min(...titleLines.map((ln) => fitPt(ln, fonts[m.titleFont], 99, 11 / titleLines.length, m.titleSize, 1.02, 8, 1, 900)));
  const badgePt = fitPt(badgeText.toUpperCase(), fonts[m.titleFont], 54, 5.5, m.badgeSize, 1, 7, 1, 800);
  const footText = footer.trim();
  // Susun atur cermin automatik: halaman genap = nombor di kanan / tajuk di kiri (asal); halaman ganjil = dipantulkan (nombor di kiri / tajuk di kanan).
  const mirror = isMirrored(number);
  const numPt = number !== undefined ? fitPt(String(number), fonts['Montserrat'], 12, 5, 15, 1, 8, 1, 800) : 21;
  const footPt = fitPt(footText.toUpperCase(), FOOT_FONT, 145, 6.2, m.footerSize, 1, 7, 1, 700);
  return (
    <Sheet pt={pt} className={`bp-content-page bp-pt-${pt}${mirror ? ' bp-mirror' : ''}`}>
      {m.showBg && m.bgImage && <img className="bp-bg-img" src={m.bgImage} alt="" />}
      {m.headerImage && <img className="bp-header-img" src={m.headerImage} alt="" />}
      <div className="bp-title-box">
        <h2 className="bp-title" style={{ fontSize: `calc(var(--pt) * ${titlePt})` }}>
          {titleLines.map((ln, i) => <span key={i} className="bp-title-line">{ln}</span>)}
        </h2>
      </div>
      <div className="bp-badge-txt" style={{ fontSize: `calc(var(--pt) * ${badgePt})` }}>{badgeText}</div>
      <div className="bp-frame">
        <div className="bp-content">{children}</div>
      </div>
      {m.footerImage && <img className="bp-footer-img" src={m.footerImage} alt="" />}
      <div className="bp-footer-text">
        {footText && <div className="bp-foot-title" style={{ fontSize: `calc(var(--pt) * ${footPt})` }}>{footText}</div>}
        {m.showPageNo && number !== undefined && <div className="bp-page-no" style={{ fontSize: `calc(var(--pt) * ${numPt})` }}>{number}</div>}
      </div>
    </Sheet>
  );
}

/** Templat BPPS 03: halaman partition bagi bahagian utama. */
export function DividerPage({ partId }: { partId: string }) {
  return useTheme() === 'biru-emas' ? <BeDividerPage partId={partId} /> : <KlasikDividerPage partId={partId} />;
}

function KlasikDividerPage({ partId }: { partId: string }) {
  const part = useBookStore((s) => s.outline.find((p) => p.id === partId));
  const m = useMaster('divider');
  const ctx = useBookCtx();
  if (!part) return null;
  const note = resolveTokens(part.note, ctx);
  const titlePt = fitPt(m.titleUpper ? part.title.toUpperCase() : part.title, fonts[m.titleFont], 104, note ? 28 : 36, m.titleSize, 1.04, 7, 3);
  return (
    <Sheet pt="divider" className="bp-divider">
      <img className="bp-full-img" src={m.bgImage} alt="" />
      <div className="bp-divider-box">
        <h2 className="bp-divider-title" style={{ fontSize: `calc(var(--pt) * ${titlePt})` }}>{part.title}</h2>
        {note && <p className="bp-divider-note">{note}</p>}
      </div>
    </Sheet>
  );
}

/** Templat BPPS 01: muka hadapan - imej reka bentuk penuh, atau dijana daripada teks. */
export function CoverPage({ forceGenerated = false }: { forceGenerated?: boolean }) {
  const theme = useTheme();
  const hasImage = useBookStore((s) => !!s.cover.image);
  if (theme === 'biru-emas' && (forceGenerated || !hasImage)) return <BeCoverPage />;
  return <KlasikCoverPage forceGenerated={forceGenerated} />;
}

function KlasikCoverPage({ forceGenerated = false }: { forceGenerated?: boolean }) {
  const cover = useBookStore((s) => s.cover);
  const profile = useProjectStore((s) => s.profile);
  const m = useMaster('cover');
  if (cover.image && !forceGenerated) {
    return (
      <Sheet pt="cover" className="bp-cover">
        <img className="bp-full-img bp-cover-img" src={cover.image} alt="Muka hadapan" />
      </Sheet>
    );
  }
  return (
    <Sheet pt="cover" className="bp-cover">
      <img className="bp-full-img" src={m.bgImage} alt="" />
      <div className="bp-cover-top">
        {cover.logo && <img src={cover.logo} alt="Logo sekolah" className="bp-cover-logo" />}
        <p className="bp-cover-school">{profile.fullName.toUpperCase()}</p>
        {cover.address && <p className="bp-cover-address">{cover.address}</p>}
      </div>
      <div className="bp-divider-box bp-cover-box">
        <p className="bp-cover-subtitle">{cover.subtitle}</p>
        <h1 className="bp-cover-title">{cover.title}</h1>
      </div>
      {cover.motto && <p className="bp-cover-motto">{cover.motto}</p>}
    </Sheet>
  );
}

function TocPage({ page }: { page: Extract<PagePlan, { kind: 'toc' }> }) {
  const m = useMaster('toc');
  const ctx = useBookCtx();
  return (
    <ContentFrame pt="toc" title={m.pageTitle || 'ISI KANDUNGAN'} number={page.number}>
      <BlockView block={page.block} ctx={ctx} from={page.from} to={page.to} />
      {page.filler && <Filler kind={page.filler} />}
    </ContentFrame>
  );
}

function Segments({ segments, byId, ctx, variants }: { segments: Segment[]; byId: Map<string, Block>; ctx: BookCtx; variants?: Map<string, string> }) {
  const edit = useContext(PageEditCtx);
  return (
    <>
      {segments.map((s) => {
        const b = byId.get(s.blockId);
        if (!b) return null;
        const view = <BlockView key={`${s.blockId}-${s.from}`} block={b} ctx={ctx} from={s.from} to={s.to} density={s.density} variant={variants?.get(s.blockId)} grow={s.grow} />;
        // Mod sunting halaman: pembalut tanpa kotak (display: contents) untuk mengenal pasti blok yang diklik.
        return edit ? <div key={`${s.blockId}-${s.from}`} className={`contents${edit.selected === b.id ? ' pe-sel' : ''}`} data-bid={b.id}>{view}</div> : view;
      })}
    </>
  );
}

function SectionContentPage({ page }: { page: Extract<PagePlan, { kind: 'content' }> }) {
  const sec = useSections()[page.sectionId];
  const outline = useBookStore((s) => s.outline);
  const partIdx = outline.findIndex((p) => p.id === locate(outline, page.sectionId)?.partId);
  const partTitle = outline[partIdx]?.title;
  const partNo = partIdx >= 0 ? partIdx + 1 : undefined;
  const m = useMaster(page.layout);
  const ctx = useBookCtx();
  if (!sec) return null;
  const lead = sec.blocks[0];
  if (lead && lead.type === 'image' && lead.fullPage) {
    return (
      <Sheet pt={page.layout} className="bp-fullpage">
        <img className="bp-full-img" src={lead.src} alt={sec.title} />
      </Sheet>
    );
  }
  if (lead && lead.type === 'image' && lead.frameFill) {
    return (
      <ContentFrame pt={page.layout} title={sec.title || m.pageTitle} badge={sec.subtitle || partTitle || undefined} number={page.number} partNo={partNo} flow={false}>
        <img className="bp-fill-img" src={lead.src} alt={sec.title} />
      </ContentFrame>
    );
  }
  const byId = new Map(sec.blocks.map((b) => [b.id, b]));
  const vs = blockVariants(sec.blocks);
  const variants = new Map(sec.blocks.map((b, i) => [b.id, vs[i]]));
  const empty = page.columns.every((c) => c.length === 0);
  const title = sec.title || m.pageTitle;
  return (
    <ContentFrame pt={page.layout} title={title} badge={sec.subtitle || partTitle || undefined} number={page.number} zoom={page.zoom} partNo={partNo}>
      {page.layout === 'twocol' ? (
        <div className="bp-cols">
          {page.columns.map((c, i) => <div key={i} className="bp-col"><Segments segments={c} byId={byId} ctx={ctx} variants={variants} /></div>)}
        </div>
      ) : (
        <Segments segments={page.columns[0]} byId={byId} ctx={ctx} variants={variants} />
      )}
      {page.layout === 'notes' && page.part === page.parts - 1 && <NotesPanels count={empty ? 5 : 3} />}
      {empty && page.layout !== 'notes' && !page.filler && <p className="bp-empty">Tiada kandungan.</p>}
      {page.filler && <Filler kind={page.filler} />}
    </ContentFrame>
  );
}

/** Pengisi baki halaman: panel catatan bergaris, atau ilustrasi bangunan (halaman akhir Isi Kandungan). */
export function Filler({ kind }: { kind: FillerKind }) {
  if (kind === 'art') return <div className="be-fill be-fill-art" aria-hidden><BuildingArt /></div>;
  return (
    <div className="be-fill be-fill-notes">
      <div className="be-fill-head"><span>CATATAN</span></div>
      <div className="be-fill-lines" />
      <BuildingArt className="be-fill-mark" />
    </div>
  );
}

/** Panel "AKTIVITI : / CATATAN" seperti halaman Catatan dalam dokumen BPPS. */
export function NotesPanels({ count }: { count: number }) {
  return (
    <div className="bp-notes">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bp-np">
          <div className="bp-np-line">AKTIVITI :</div>
          <div className="bp-np-box">CATATAN</div>
        </div>
      ))}
    </div>
  );
}

function PageBody({ page }: { page: PagePlan }) {
  switch (page.kind) {
    case 'cover': return <CoverPage />;
    case 'toc': return <TocPage page={page} />;
    case 'divider': return <DividerPage partId={page.partId} />;
    case 'content': return <SectionContentPage page={page} />;
  }
}

/** Satu halaman buku. Pembalut `display: contents` membawa kunci halaman (cth. "hx-lokar-0") untuk ujian & carian. */
/** Mod sunting halaman (WYSIWYG): blok yang dipilih ditonjolkan; blok dibalut supaya klik boleh dikenal pasti. */
export const PageEditCtx = createContext<{ selected: string | null } | null>(null);

/** Halaman borang (diisi dengan tangan selepas dicetak): ruang kosong tidak ditanda "perlu diisi". */
const FORM_PAGE = /^(lamp-|ma-peribadi|akuan|catatan|t-kalendar)/;
/** Medan kosong / ruang isian yang perlu diisi (ditanda pada skrin sahaja, tidak dicetak / dieksport). */
export const NEED_SELECTOR = '.bp-ph, .bp-ph-in, .bp-kv-blank, .bp-cm-blank, .bp-card-empty, .bp-td-blank';

export function PageView({ page }: { page: PagePlan }) {
  const ref = useRef<HTMLDivElement>(null);
  const form = page.kind === 'content' && FORM_PAGE.test(page.sectionId);
  // Bilangan medan perlu diisi → cip di bucu halaman (CSS: [data-need]).
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('.book-page');
    if (!el) return;
    const list = form ? [] : Array.from(el.querySelectorAll<HTMLElement>(NEED_SELECTOR));
    list.forEach((x, i) => { const v = String(i + 1); if (x.dataset.n !== v) x.dataset.n = v; });
    const n = String(list.length);
    if (list.length) { if (el.dataset.need !== n) el.dataset.need = n; } else if (el.dataset.need) delete el.dataset.need;
  });
  return <div ref={ref} className="contents" data-page-key={page.key} data-form={form ? '' : undefined}><PageBody page={page} /></div>;
}

/** Halaman-halaman satu tajuk (pratonton dalam editor); partition disertakan untuk tajuk pertama bahagian. */
export function SectionPages({ id }: { id: string }) {
  const plan = useBookPlan();
  const outline = useBookStore((s) => s.outline);
  if (id === 'kulit') return <>{plan.filter((p) => p.kind === 'cover').map((p) => <PageView key={p.key} page={p} />)}</>;
  const loc = locate(outline, id);
  const part = outline.find((p) => p.id === loc?.partId);
  const isFirst = part?.topics[0]?.id === id;
  const pages = plan.filter((p) => (p.kind === 'content' && p.sectionId === id) || (isFirst && p.kind === 'divider' && p.partId === part?.id));
  return <>{pages.map((p) => <PageView key={p.key} page={p} />)}</>;
}

/** Keseluruhan buku mengikut pelan halaman. */
export function FullBook() {
  const plan = useBookPlan();
  return <>{plan.map((p) => <PageView key={p.key} page={p} />)}</>;
}

export function usePageCount(): number {
  return useBookPlan().length;
}

/* ================================================================== Tema "Biru Navy & Emas" (edisi 2027)
 * Gaya: navy + emas, latar kertas pelan (grid), jalur pepenjuru di bucu, bangunan sekolah garis pelan.
 * Geometri bingkai kandungan SAMA dengan tema klasik (src/templates/bpps.ts) supaya penomboran tidak berubah. */

const BASE_URL = import.meta.env.BASE_URL;
const two = (n: number) => String(n).padStart(2, '0');

/** Jalur pepenjuru navy + emas di bucu atas (kiri & kanan). */
function BeCorners() {
  return (
    <>
      <svg className="be-corner be-corner-l" viewBox="0 0 60 60" aria-hidden>
        <path d="M0 0 H34 L0 34 Z" fill="#0B2A5B" />
        <path d="M40 0 H46 L0 46 V40 Z" fill="#C9A13B" />
        <path d="M52 0 H55 L0 55 V52 Z" fill="#0B2A5B" />
      </svg>
      <svg className="be-corner be-corner-r" viewBox="0 0 60 60" aria-hidden>
        <path d="M60 0 V22 L38 0 Z" fill="#0B2A5B" />
        <path d="M32 0 H27 L60 33 V28 Z" fill="#C9A13B" />
      </svg>
    </>
  );
}

/** Pecah tajuk bahagian: "PENGURUSAN HAL EHWAL MURID" → pre "PENGURUSAN", utama "HAL EHWAL MURID"; "(PPKI)" / tahun → baris kecil. */
function splitPartTitle(title: string) {
  let main = title.toUpperCase().trim();
  let pre = '';
  let sub = '';
  const tail = main.match(/^(.*?)\s*(\([^)]*\)|\b(?:19|20)\d{2})$/);
  if (tail && tail[1]) { main = tail[1]; sub = tail[2]; }
  const p = main.match(/^(PENGURUSAN(?:\s*&)?)\s+(.+)$/);
  if (p) { pre = p[1]; main = p[2]; }
  return { pre, main, sub };
}

function BeContentFrame({ pt, title, badge, number, children, zoom, partNo, flow = true }: FrameProps) {
  const m = useMaster(pt);
  const ctx = useBookCtx();
  const footer = useFooterText(m.footerText, ctx);
  const badgeText = (badge || resolveTokens('BPPS {{tahun}}', ctx)).toUpperCase();
  const lines = splitTitle(title.toUpperCase(), fonts['Montserrat']);
  const titlePt = Math.min(...lines.map((ln) => fitPt(ln, fonts['Montserrat'], 100, 10.5 / lines.length, 15, 1.04, 7, 1, 900)));
  const badgePt = fitPt(badgeText, fonts['Montserrat'], 44, 4.6, 8, 1, 5.5, 1, 800);
  const mirror = isMirrored(number);
  const footText = footer.trim().toUpperCase();
  const footPt = fitPt(footText, FOOT_FONT, 150, 5, 8.5, 1, 6, 1, 700);
  return (
    <Sheet pt={pt} className={`bp-content-page bp-pt-${pt} be-page${mirror ? ' be-mirror' : ''}`}>
      <svg className="be-head-art" viewBox="0 0 210 18.5" preserveAspectRatio="none" aria-hidden>
        <path d="M0 0 H124 L114 18.5 H0 Z" fill="#0B2A5B" />
        <path d="M0 16.6 H115 L114 18.5 H0 Z" fill="#C9A13B" />
        <path d="M127 0 H132 L122 18.5 H117 Z" fill="#C9A13B" />
        <path d="M135 0 H137 L127 18.5 H125 Z" fill="#0B2A5B" />
      </svg>
      {partNo !== undefined && <div className="be-partno"><span>{two(partNo)}</span></div>}
      <div className="be-title" style={{ fontSize: `calc(var(--pt) * ${titlePt})` }}>
        {lines.map((ln, i) => <span key={i}>{ln}</span>)}
      </div>
      <div className="be-badge" style={{ fontSize: `calc(var(--pt) * ${badgePt})` }}><span>{badgeText}</span></div>
      <div className="bp-frame">
        <div className="bp-content">
          {flow ? <div className={`bp-flow${zoom && zoom !== 1 ? ' bp-z' : ''}`} style={zoom && zoom !== 1 ? ({ '--z': zoom } as CSSProperties) : undefined}>{children}</div> : children}
        </div>
      </div>
      <svg className="be-foot-art" viewBox="0 0 210 11.33" preserveAspectRatio="none" aria-hidden>
        <rect x="0" y="0.6" width="210" height="10.73" fill="#0B2A5B" />
        <rect x="0" y="0" width="210" height="0.6" fill="#C9A13B" />
        {mirror ? <path d="M0 0.6 H30 L24 11.33 H0 Z" fill="#C9A13B" /> : <path d="M180 0.6 H210 V11.33 H174 Z" fill="#C9A13B" />}
        {mirror ? <path d="M33 0.6 H35 L29 11.33 H27 Z" fill="#C9A13B" /> : <path d="M175 0.6 H177 L171 11.33 H169 Z" fill="#C9A13B" />}
      </svg>
      {footText && <div className="be-foot-text" style={{ fontSize: `calc(var(--pt) * ${footPt})` }}>{footText}</div>}
      {m.showPageNo && number !== undefined && <div className="be-page-no">{number}</div>}
    </Sheet>
  );
}

function BeDividerPage({ partId }: { partId: string }) {
  const outline = useBookStore((s) => s.outline);
  const profile = useProjectStore((s) => s.profile);
  const ctx = useBookCtx();
  const idx = outline.findIndex((p) => p.id === partId);
  const part = outline[idx];
  if (!part) return null;
  const { pre, main, sub } = splitPartTitle(part.title);
  const Icon = partIcon(part.id);
  const mainPt = fitPt(main, fonts['Roboto Condensed'], 125, 17, 44, 1, 16, 1, 800);
  const note = resolveTokens(part.note, ctx);
  return (
    <Sheet pt="divider" className="be-divider">
      <BeCorners />
      <div className="be-dv-label"><span>BAHAGIAN</span></div>
      <div className="be-dv-no">{two(idx + 1)}</div>
      <div className="be-dv-banner">
        {pre && <span className="be-dv-pre">{pre}</span>}
        <span className="be-dv-main" style={{ fontSize: `calc(var(--pt) * ${mainPt})` }}>{main}</span>
        {sub && <span className="be-dv-sub">{sub}</span>}
      </div>
      <p className="be-dv-line">BUKU PENGURUSAN SEKOLAH · SESI AKADEMIK {profile.year}</p>
      {note && <p className="be-dv-note">{note}</p>}
      <div className="be-dv-icon">
        <span className="be-dv-ring" />
        <span className="be-dv-cross-h" />
        <span className="be-dv-cross-v" />
        <span className="be-dv-disc"><Icon strokeWidth={1.4} /></span>
      </div>
      <div className="be-tabs">
        {outline.map((p, i) => <span key={p.id} className={i === idx ? 'on' : ''}>{two(i + 1)}</span>)}
      </div>
      <div className="be-dv-foot">
        <span>BUKU PENGURUSAN SEKOLAH {profile.year}</span>
        <span>{profile.shortName.toUpperCase()}</span>
      </div>
    </Sheet>
  );
}

function BeCoverPage() {
  const cover = useBookStore((s) => s.cover);
  const info = useBookStore((s) => s.sections['maklumat-sekolah']);
  const profile = useProjectStore((s) => s.profile);
  const ctx = useBookCtx();
  const kv = (re: RegExp) => {
    for (const b of info?.blocks ?? []) if (b.type === 'keyvalue') for (const p of b.pairs) if (re.test(p.key)) return resolveTokens(p.value, ctx);
    return '';
  };
  const name = profile.fullName.toUpperCase();
  const pm = name.match(/^(SEKOLAH (?:KEBANGSAAN|JENIS KEBANGSAAN(?: \([A-Z]\))?|MENENGAH(?: KEBANGSAAN)?|RENDAH))\s+(.+)$/);
  const schoolPre = pm ? pm[1] : '';
  const schoolMain = pm ? pm[2] : name;
  const title = cover.title.toUpperCase().trim();
  const tm = title.match(/^(BUKU)\s+(.+)$/);
  const ym = cover.subtitle.match(/^(.*?)\s*((?:19|20)\d{2})\s*$/);
  const motto = cover.motto.split(/\s*[|•·]\s*/).filter(Boolean);
  const schoolPt = fitPt(schoolMain, fonts['Roboto Condensed'], 178, 20, 50, 1, 16, 1, 800);
  const titlePt = fitPt(tm ? tm[2] : title, fonts['Roboto Condensed'], 186, 24, 62, 1, 18, 1, 800);
  return (
    <Sheet pt="cover" className="be-cover">
      <BeCorners />
      <div className="be-cv-logos">
        <img src={`${BASE_URL}content/logo-kpm.png`} alt="Kementerian Pendidikan Malaysia" />
        <img src={cover.logo || `${BASE_URL}content/logo-skbts.png`} alt="Logo sekolah" />
      </div>
      <p className="be-cv-kpm">KEMENTERIAN PENDIDIKAN MALAYSIA</p>
      {schoolPre && <p className="be-cv-pre">{schoolPre}</p>}
      <h2 className="be-cv-school" style={{ fontSize: `calc(var(--pt) * ${schoolPt})` }}>{schoolMain}</h2>
      <div className="be-cv-rule" />
      {tm && <p className="be-cv-buku">{tm[1]}</p>}
      <h1 className="be-cv-title" style={{ fontSize: `calc(var(--pt) * ${titlePt})` }}>{tm ? tm[2] : title}</h1>
      <div className="be-cv-pill">
        <span className="be-cv-slash">///</span>
        <span className="be-cv-pill-box"><span className="be-cv-sesi">{(ym ? ym[1] : cover.subtitle).toUpperCase()}</span>{ym && <b>{ym[2]}</b>}</span>
        <span className="be-cv-slash">///</span>
      </div>
      {motto.length > 0 && <p className="be-cv-motto">{motto.map((w, i) => <span key={i}>{i > 0 && <i>✦</i>}{w.toUpperCase()}</span>)}</p>}
      <BuildingArt className="be-cv-art" />
      <div className="be-cv-foot">
        <div><small>KOD SEKOLAH</small><span>{kv(/kod/i) || '—'}</span></div>
        <div className="be-cv-foot-mid"><small>ALAMAT</small><span>{cover.address}</span></div>
        <div><small>E-MEL</small><span>{kv(/e-?mel/i) || '—'}</span></div>
      </div>
    </Sheet>
  );
}
