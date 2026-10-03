import type { ReactNode } from 'react';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useMaster, useMasterStore, resolveMaster } from '@/stores/masterStore';
import { applyMasterCss, fonts, type PageType } from '@/templates/master';
import { useBookCtx, useBookPlan, type PagePlan, type Segment } from '@/lib/pagination';
import { resolveTokens, type BookCtx } from '@/lib/resolve';
import { locate } from '@/lib/outline';
import type { Block } from '@/types/book';
import BlockView from './BlockView';
import { fitPt } from '@/lib/fit';

/** Gaya master semua jenis halaman sebagai CSS variables dalam <head>. */
export function MasterStyles() {
  const overrides = useMasterStore((s) => s.overrides);
  applyMasterCss((t) => resolveMaster(t, overrides));
  return null;
}

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
  return resolveTokens(template.replace(/\{\{\s*motto\s*\}\}/g, motto), ctx);
}

/** Templat halaman isi (BPPS 05 dan variasinya): jalur tajuk, bingkai, jalur kaki. */
export function ContentFrame({ pt, title, badge, number, children }: { pt: PageType; title: string; badge?: string; number?: number; children: ReactNode }) {
  const m = useMaster(pt);
  const ctx = useBookCtx();
  const footer = useFooterText(m.footerText, ctx);
  // Tajuk rata kiri dari garis bingkai (7mm) hingga 97mm (ada lencana) / 121mm, berpusat menegak dalam jalur putih; lencana 99-161mm.
  const titleW = badge ? 89 : 113;
  const titlePt = fitPt(m.titleUpper ? title.toUpperCase() : title, fonts[m.titleFont], titleW, 17, m.titleSize, 1.08, 7, 2, 700);
  const badgePt = badge ? fitPt(badge.toUpperCase(), fonts[m.titleFont], 42, 8.5, m.badgeSize, 1.05, 6, 1) : 0;
  return (
    <Sheet pt={pt} className={`bp-content-page bp-pt-${pt}`}>
      {m.showBg && m.bgImage && <img className="bp-bg-img" src={m.bgImage} alt="" />}
      {m.headerImage && <img className="bp-header-img" src={m.headerImage} alt="" />}
      <div className={`bp-title-box ${badge ? 'bp-has-badge' : ''}`}>
        <h2 className="bp-title" style={{ fontSize: `calc(var(--pt) * ${titlePt})` }}>{title}</h2>
      </div>
      {badge && <span className="bp-badge" style={{ fontSize: `calc(var(--pt) * ${badgePt})` }}>{badge}</span>}
      <div className="bp-frame">
        <div className="bp-content">{children}</div>
      </div>
      {m.footerImage && <img className="bp-footer-img" src={m.footerImage} alt="" />}
      <div className="bp-footer-text">
        <span>{footer}</span>
        {m.showPageNo && number !== undefined && <span className="bp-page-no">{number}</span>}
      </div>
    </Sheet>
  );
}

/** Templat BPPS 03: halaman partition bagi bahagian utama. */
export function DividerPage({ partId }: { partId: string }) {
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
    </ContentFrame>
  );
}

function Segments({ segments, byId, ctx }: { segments: Segment[]; byId: Map<string, Block>; ctx: BookCtx }) {
  return (
    <>
      {segments.map((s) => {
        const b = byId.get(s.blockId);
        return b ? <BlockView key={`${s.blockId}-${s.from}`} block={b} ctx={ctx} from={s.from} to={s.to} density={s.density} /> : null;
      })}
    </>
  );
}

function SectionContentPage({ page }: { page: Extract<PagePlan, { kind: 'content' }> }) {
  const sec = useBookStore((s) => s.sections[page.sectionId]);
  const m = useMaster(page.layout);
  const ctx = useBookCtx();
  if (!sec) return null;
  const byId = new Map(sec.blocks.map((b) => [b.id, b]));
  const empty = page.columns.every((c) => c.length === 0);
  const title = sec.title || m.pageTitle;
  return (
    <ContentFrame pt={page.layout} title={title} badge={sec.subtitle || undefined} number={page.number}>
      {page.layout === 'twocol' ? (
        <div className="bp-cols">
          {page.columns.map((c, i) => <div key={i} className="bp-col"><Segments segments={c} byId={byId} ctx={ctx} /></div>)}
        </div>
      ) : (
        <Segments segments={page.columns[0]} byId={byId} ctx={ctx} />
      )}
      {page.layout === 'notes' && page.part === page.parts - 1 && <NotesPanels count={empty ? 5 : 3} />}
      {empty && page.layout !== 'notes' && <p className="bp-empty">Tiada kandungan.</p>}
    </ContentFrame>
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

export function PageView({ page }: { page: PagePlan }) {
  switch (page.kind) {
    case 'cover': return <CoverPage />;
    case 'toc': return <TocPage page={page} />;
    case 'divider': return <DividerPage partId={page.partId} />;
    case 'content': return <SectionContentPage page={page} />;
  }
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
