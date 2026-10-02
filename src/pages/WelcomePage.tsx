import { ArrowRight, BookOpen, Eye, Printer, UsersRound } from 'lucide-react';
import { iconFor } from '@/config/sections';
import { flattenOutline } from '@/lib/outline';
import { useStaffStore } from '@/stores/staffStore';
import { usePageCount } from '@/components/book/BookPages';
import { useBookStore } from '@/stores/bookStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useProjectStore } from '@/stores/projectStore';
import { blockHasContent } from '@/lib/blocks';
import { navigate } from '@/lib/router';
import { printBook } from '@/lib/exporter';

const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2';

export default function WelcomePage() {
  const { cover, sections, outline } = useBookStore();
  const profile = useProjectStore((s) => s.profile);
  const teacherCount = useStaffStore((s) => s.teachers.length);
  const pageCount = usePageCount();
  const setActive = useNavigationStore((s) => s.setActiveSection);
  const setSettingsTab = useNavigationStore((s) => s.setSettingsTab);

  const coverFilled = cover.image ? 5 : [cover.title, cover.subtitle, cover.address, cover.motto, cover.logo].filter((x) => x.trim() !== '').length;
  const stats = [
    { id: 'kulit', label: 'Muka Hadapan', partId: '', level: 1, pct: Math.round((coverFilled / 5) * 100), edited: cover.updatedAt !== null, blocks: null as number | null },
    ...flattenOutline(outline).map((e) => {
      const sec = sections[e.id];
      const total = sec?.blocks.length ?? 0;
      const filled = sec?.blocks.filter(blockHasContent).length ?? 0;
      const pct = sec?.layout === 'notes' ? 100 : total ? Math.round((filled / total) * 100) : 0;
      return { id: e.id, label: sec?.title || 'Tanpa tajuk', partId: e.partId, level: e.level, pct, edited: !!sec?.updatedAt, blocks: total as number | null };
    }),
  ];
  const editedCount = stats.filter((s) => s.edited).length;
  const renderCard = (s: (typeof stats)[number], n: number) => {
    const Icon = s.id === 'kulit' ? BookOpen : iconFor(s.id);
    return (
      <button key={s.id} onClick={() => setActive(s.id)} className="group rounded-lg border border-border bg-surface p-4 text-left shadow-card transition hover:border-primary">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-surface-2 p-2 text-primary group-hover:bg-primary group-hover:text-primary-fg"><Icon size={18} aria-hidden /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">{s.level === 2 ? 'Subtajuk' : String(n).padStart(2, '0')}</p>
            <p className="truncate text-sm font-semibold">{s.label}</p>
          </div>
          {s.edited && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent">Disunting</span>}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.pct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-muted">{s.pct}% diisi{s.blocks !== null ? ` · ${s.blocks} blok` : ''}</p>
      </button>
    );
  };
  const overall = Math.round(stats.reduce((a, s) => a + s.pct, 0) / stats.length);

  return (
    <div className="mx-auto max-w-5xl">
      <section className="flex flex-col gap-6 rounded-lg bg-primary p-6 text-primary-fg shadow-card md:flex-row md:items-center md:p-8">
        <div className="self-start rounded-lg bg-white/10 p-4 md:self-auto"><BookOpen size={40} aria-hidden /></div>
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Selamat Datang</p>
          <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">BPPS {profile.year} Generator</h2>
          <p className="mt-1 opacity-80">{profile.fullName}</p>
        </div>
        <div className="text-center">
          <div className="font-display text-4xl font-bold">{overall}%</div>
          <div className="text-xs uppercase tracking-wider opacity-80">Kandungan diisi</div>
          <div className="mt-1 text-xs opacity-80">{editedCount} / {stats.length} tajuk disunting · {pageCount} halaman</div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <button className={btn} onClick={() => setActive('kulit')}>Mula menyunting <ArrowRight size={16} /></button>
        <button className={btn} onClick={() => navigate('/preview')}><Eye size={16} /> Pratonton buku</button>
        <button className={btn} onClick={printBook}><Printer size={16} /> Eksport PDF</button>
        <button className={btn} onClick={() => { setSettingsTab('guru'); navigate('/settings'); }}><UsersRound size={16} /> Pangkalan Data Guru ({teacherCount})</button>
      </div>

      {[{ id: '', title: 'Kulit Buku' }, ...outline].map((part, pi) => {
        const items = stats.filter((s) => s.partId === part.id);
        if (!items.length) return null;
        return (
          <section key={part.id || 'kulit'} className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              {pi > 0 && <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-fg">{pi}</span>}
              {part.title}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{items.map((s, i) => renderCard(s, i + 1))}</div>
          </section>
        );
      })}
      <p className="mt-6 text-xs text-muted md:hidden">Ketik ikon menu di penjuru kiri atas untuk membuka panel.</p>
    </div>
  );
}
