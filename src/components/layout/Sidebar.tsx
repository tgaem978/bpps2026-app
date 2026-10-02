import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { appNav, iconFor, type AppNavItem } from '@/config/sections';
import { useNavigationStore } from '@/stores/navigationStore';
import { useRoute, navigate } from '@/lib/router';
import { useBookStore } from '@/stores/bookStore';
import { locate } from '@/lib/outline';

/** Panel navigasi: disusun automatik mengikut Struktur Kandungan (Tetapan), dengan kembang kucup. */
export default function Sidebar() {
  const { sidebarCollapsed, mobileOpen, collapsedGroups, activeSectionId, toggleSidebar, setMobileOpen, setGroup, setActiveSection } =
    useNavigationStore();
  const route = useRoute();
  const sections = useBookStore((s) => s.sections);
  const outline = useBookStore((s) => s.outline);
  const coverEdited = useBookStore((s) => s.cover.updatedAt !== null);
  const slim = sidebarCollapsed && !mobileOpen;
  const activeLoc = activeSectionId ? locate(outline, activeSectionId) : undefined;

  const openSection = (id: string) => {
    setActiveSection(id);
    navigate('/');
    setMobileOpen(false);
  };
  const openApp = (item: AppNavItem) => {
    navigate(item.path);
    setMobileOpen(false);
  };
  const isActive = (id: string) => route === '/' && activeSectionId === id;
  // Bahagian & tajuk induk yang aktif sentiasa terbuka
  const isCollapsed = (key: string, containsActive: boolean) => (key in collapsedGroups ? collapsedGroups[key] : !containsActive && key.startsWith('t:'));

  const itemCls = (active: boolean, level = 1) =>
    [
      'group flex w-full items-center gap-2.5 border-l-[3px] py-2 pr-3 text-left text-[13px] leading-snug transition-colors',
      slim ? 'justify-center px-0' : level === 2 ? 'pl-11' : 'pl-4',
      active ? 'border-accent bg-white/10 font-semibold text-white' : 'border-transparent text-sidebar-fg/85 hover:bg-white/5 hover:text-white',
    ].join(' ');

  return (
    <>
      {mobileOpen && <button aria-label="Tutup menu" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside
        aria-label="Navigasi utama"
        className={[
          'z-40 flex h-full shrink-0 flex-col bg-sidebar text-sidebar-fg transition-all duration-200',
          'fixed inset-y-0 left-0 w-72 md:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          slim ? 'md:w-16' : 'md:w-72',
        ].join(' ')}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-3">
          {!slim && (
            <button onClick={() => { setActiveSection(null); navigate('/'); setMobileOpen(false); }} className="text-left">
              <span className="block font-display text-[15px] font-bold tracking-wide text-white">BPPS 2026</span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-sidebar-fg/60">Buku Pengurusan Sekolah</span>
            </button>
          )}
          <button onClick={toggleSidebar} aria-label={slim ? 'Kembangkan sidebar' : 'Kecilkan sidebar'} className="hidden rounded-md p-2 hover:bg-white/10 md:block">
            {slim ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu" className="rounded-md p-2 hover:bg-white/10 md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <button onClick={() => openSection('kulit')} title={slim ? 'Kulit' : undefined} aria-current={isActive('kulit') ? 'page' : undefined} className={itemCls(isActive('kulit'))}>
            <BookOpen size={17} className="shrink-0" aria-hidden />
            {!slim && <span className="flex-1 truncate">Muka Hadapan</span>}
            {!slim && coverEdited && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-label="Telah disunting" />}
          </button>

          {outline.map((part, pi) => {
            const containsActive = activeLoc?.partId === part.id;
            const collapsed = isCollapsed(`p:${part.id}`, containsActive);
            if (slim) {
              return (
                <button
                  key={part.id}
                  title={part.title}
                  onClick={() => { toggleSidebar(); setGroup(`p:${part.id}`, false); }}
                  className={`mx-auto my-1 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${containsActive ? 'bg-accent text-sidebar' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {pi + 1}
                </button>
              );
            }
            return (
              <div key={part.id} className="mt-1">
                <button
                  onClick={() => setGroup(`p:${part.id}`, !collapsed)}
                  aria-expanded={!collapsed}
                  className="flex w-full items-center gap-2 px-4 pb-1.5 pt-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.14em] text-sidebar-fg/55 hover:text-sidebar-fg"
                >
                  <span className="flex h-4 min-w-4 items-center justify-center rounded bg-white/10 px-1 text-[9.5px] text-sidebar-fg/80">{pi + 1}</span>
                  <span className="flex-1 truncate">{part.title}</span>
                  <ChevronDown size={13} className={`shrink-0 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
                </button>
                {!collapsed && (
                  <ul>
                    {part.topics.map((t) => {
                      const Icon = iconFor(t.id);
                      const sec = sections[t.id];
                      const childActive = t.children.includes(activeSectionId ?? '');
                      const subCollapsed = isCollapsed(`t:${t.id}`, childActive || isActive(t.id));
                      return (
                        <li key={t.id}>
                          <div className="flex items-stretch">
                            <button onClick={() => openSection(t.id)} aria-current={isActive(t.id) ? 'page' : undefined} className={`${itemCls(isActive(t.id))} min-w-0 flex-1`}>
                              <Icon size={16} className="shrink-0 opacity-90" aria-hidden />
                              <span className="flex-1 truncate">{sec?.title || 'Tanpa tajuk'}</span>
                              {sec?.updatedAt && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-label="Telah disunting" />}
                            </button>
                            {t.children.length > 0 && (
                              <button
                                onClick={() => setGroup(`t:${t.id}`, !subCollapsed)}
                                aria-label={subCollapsed ? 'Kembangkan subtajuk' : 'Kucupkan subtajuk'}
                                aria-expanded={!subCollapsed}
                                className="px-2 text-sidebar-fg/60 hover:text-white"
                              >
                                <ChevronDown size={14} className={`transition-transform ${subCollapsed ? '-rotate-90' : ''}`} />
                              </button>
                            )}
                          </div>
                          {t.children.length > 0 && !subCollapsed && (
                            <ul className="relative before:absolute before:bottom-2 before:left-[26px] before:top-0 before:border-l before:border-white/15">
                              {t.children.map((c) => (
                                <li key={c}>
                                  <button onClick={() => openSection(c)} aria-current={isActive(c) ? 'page' : undefined} className={itemCls(isActive(c), 2)}>
                                    <span className="flex-1 truncate">{sections[c]?.title || 'Tanpa tajuk'}</span>
                                    {sections[c]?.updatedAt && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-label="Telah disunting" />}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 py-2">
          {appNav.map((item) => {
            const Icon = item.icon;
            const active = route === item.path;
            return (
              <button key={item.id} onClick={() => openApp(item)} title={slim ? item.label : undefined} aria-current={active ? 'page' : undefined} className={itemCls(active)}>
                <Icon size={17} className="shrink-0" aria-hidden />
                {!slim && <span className="flex-1 truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
