import type { ReactNode } from 'react';
import { bookSections } from '@/config/sections';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import BlockView from './BlockView';

/** Satu halaman buku (A4 landskap mengikut designTokens.page). Saiz fon diskala ikut lebar halaman. */
export function PageFrame({ children, number, plain }: { children: ReactNode; number?: number; plain?: boolean }) {
  const profile = useProjectStore((s) => s.profile);
  return (
    <div className="book-page-wrap">
      <article className="book-page">
        {!plain && (
          <header className="bp-header">
            <span>{profile.shortName}</span>
            <span>BPPS {profile.year}</span>
          </header>
        )}
        {plain ? children : <div className="bp-body">{children}</div>}
        {!plain && (
          <footer className="bp-footer">
            <span>{profile.projectCode}</span>
            {number !== undefined && <span>{number}</span>}
          </footer>
        )}
      </article>
    </div>
  );
}

export function CoverPage() {
  const cover = useBookStore((s) => s.cover);
  const profile = useProjectStore((s) => s.profile);
  return (
    <PageFrame plain>
      <div className="bp-cover">
        <div className="bp-cover-band" />
        {cover.logo ? <img src={cover.logo} alt="Logo sekolah" className="bp-cover-logo" /> : <div className="bp-cover-logo bp-cover-logo-empty">LOGO</div>}
        <p className="bp-cover-subtitle">{cover.subtitle}</p>
        <h1 className="bp-cover-title">{cover.title}</h1>
        <p className="bp-cover-school">{profile.fullName.toUpperCase()}</p>
        {cover.address && <p className="bp-cover-address">{cover.address}</p>}
        {cover.motto && <p className="bp-cover-motto">&ldquo;{cover.motto}&rdquo;</p>}
      </div>
    </PageFrame>
  );
}

export function SectionPage({ id, number }: { id: string; number?: number }) {
  const sec = useBookStore((s) => s.sections[id]);
  if (!sec) return null;
  return (
    <PageFrame number={number}>
      <div className="bp-section-head">
        <h2>{sec.title}</h2>
        {sec.subtitle && <p>{sec.subtitle}</p>}
      </div>
      {sec.blocks.map((b) => <BlockView key={b.id} block={b} />)}
    </PageFrame>
  );
}

export function TocPage() {
  const sections = useBookStore((s) => s.sections);
  const content = bookSections.filter((b) => b.id !== 'kulit');
  return (
    <PageFrame number={1}>
      <div className="bp-section-head"><h2>KANDUNGAN</h2></div>
      <ol className="bp-toc">
        {content.map((b, i) => (
          <li key={b.id}>
            <span>{sections[b.id]?.title ?? b.label}</span>
            <span className="bp-toc-dots" />
            <span>{i + 2}</span>
          </li>
        ))}
      </ol>
    </PageFrame>
  );
}

/** Keseluruhan buku: kulit, kandungan dan semua bahagian. */
export function FullBook() {
  const content = bookSections.filter((b) => b.id !== 'kulit');
  return (
    <>
      <CoverPage />
      <TocPage />
      {content.map((b, i) => <SectionPage key={b.id} id={b.id} number={i + 2} />)}
    </>
  );
}
