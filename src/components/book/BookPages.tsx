import type { ReactNode } from 'react';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { templateAssets } from '@/templates/bpps';
import { useBookPlan, type PagePlan, type Segment } from '@/lib/pagination';
import BlockView from './BlockView';

/** Halaman A4 potret. Saiz fon dan kedudukan dalam unit --mm (diskala ikut lebar halaman). */
function Sheet({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="book-page-wrap">
      <article className={`book-page ${className}`}>{children}</article>
    </div>
  );
}

/** Templat BPPS 05: jalur tajuk, bingkai kandungan, jalur kaki dengan moto & nombor halaman. */
export function ContentFrame({ title, badge, number, children }: { title: string; badge?: string; number?: number; children: ReactNode }) {
  const motto = useBookStore((s) => s.cover.motto);
  const len = title.length;
  return (
    <Sheet className="bp-content-page">
      <img className="bp-header-img" src={templateAssets.header} alt="" />
      <div className="bp-title-box">
        <h2 className={`bp-title ${len > 34 ? 'bp-title-sm' : len > 22 ? 'bp-title-md' : ''}`}>{title}</h2>
        {badge && <span className="bp-badge">{badge}</span>}
      </div>
      <div className="bp-frame">
        <div className="bp-content">{children}</div>
      </div>
      <img className="bp-footer-img" src={templateAssets.footer} alt="" />
      <div className="bp-footer-text">
        <span>{motto}</span>
        {number !== undefined && <span className="bp-page-no">{number}</span>}
      </div>
    </Sheet>
  );
}

/** Templat BPPS 03: halaman partition. */
export function DividerPage({ id }: { id: string }) {
  const sec = useBookStore((s) => s.sections[id]);
  if (!sec) return null;
  const len = sec.title.length;
  return (
    <Sheet className="bp-divider">
      <img className="bp-full-img" src={templateAssets.divider} alt="" />
      <div className="bp-divider-box">
        <h2 className={`bp-divider-title ${len > 28 ? 'bp-divider-sm' : len > 16 ? 'bp-divider-md' : ''}`}>{sec.title}</h2>
        {sec.dividerNote && <p className="bp-divider-note">{sec.dividerNote}</p>}
      </div>
    </Sheet>
  );
}

/** Templat BPPS 01: muka hadapan - imej reka bentuk penuh, atau dijana daripada teks. */
export function CoverPage() {
  const cover = useBookStore((s) => s.cover);
  const profile = useProjectStore((s) => s.profile);
  if (cover.image) {
    return (
      <Sheet className="bp-cover">
        <img className="bp-full-img bp-cover-img" src={cover.image} alt="Muka hadapan" />
      </Sheet>
    );
  }
  return (
    <Sheet className="bp-cover">
      <img className="bp-full-img" src={templateAssets.divider} alt="" />
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
  return (
    <ContentFrame title="ISI KANDUNGAN" number={page.number}>
      <div className="bp-block bp-table-wrap">
        <table className="bp-table bp-toc">
          <colgroup><col className="bp-num-col" /><col /><col className="bp-toc-page" /></colgroup>
          <thead><tr><th className="bp-num">BIL.</th><th>PERKARA</th><th className="bp-num">MUKA SURAT</th></tr></thead>
          <tbody>
            {page.entries.map((e, i) => (
              <tr key={e.id}>
                <td className="bp-num">{i + 1}</td>
                <td>{e.title}</td>
                <td className="bp-num">{e.page}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentFrame>
  );
}

function SectionContentPage({ page }: { page: Extract<PagePlan, { kind: 'content' }> }) {
  const sec = useBookStore((s) => s.sections[page.sectionId]);
  if (!sec) return null;
  const byId = new Map(sec.blocks.map((b) => [b.id, b]));
  return (
    <ContentFrame title={sec.title} badge={sec.subtitle || undefined} number={page.number}>
      {page.segments.length === 0 && <p className="bp-empty">Tiada kandungan.</p>}
      {page.segments.map((s: Segment) => {
        const b = byId.get(s.blockId);
        return b ? <BlockView key={`${s.blockId}-${s.from}`} block={b} from={s.from} to={s.to} /> : null;
      })}
    </ContentFrame>
  );
}

export function PageView({ page }: { page: PagePlan }) {
  switch (page.kind) {
    case 'cover': return <CoverPage />;
    case 'toc': return <TocPage page={page} />;
    case 'divider': return <DividerPage id={page.sectionId} />;
    case 'content': return <SectionContentPage page={page} />;
  }
}

const pageKey = (p: PagePlan) => (p.kind === 'content' ? `${p.sectionId}-${p.part}` : p.kind === 'divider' ? `d-${p.sectionId}` : p.kind);

/** Halaman-halaman satu bahagian (pratonton dalam editor). */
export function SectionPages({ id }: { id: string }) {
  const plan = useBookPlan();
  const pages = id === 'kulit' ? plan.filter((p) => p.kind === 'cover') : plan.filter((p) => 'sectionId' in p && p.sectionId === id);
  return <>{pages.map((p) => <PageView key={pageKey(p)} page={p} />)}</>;
}

/** Keseluruhan buku mengikut pelan halaman. */
export function FullBook() {
  const plan = useBookPlan();
  return <>{plan.map((p) => <PageView key={pageKey(p)} page={p} />)}</>;
}

export function usePageCount(): number {
  return useBookPlan().length;
}
