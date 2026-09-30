import { ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { navGroups, type NavItem } from '@/config/sections';
import { useNavigationStore } from '@/stores/navigationStore';
import { useRoute, navigate } from '@/lib/router';

export default function Sidebar() {
  const { sidebarCollapsed, mobileOpen, collapsedGroups, activeSectionId, toggleSidebar, setMobileOpen, toggleGroup, setActiveSection } =
    useNavigationStore();
  const route = useRoute();

  const isActive = (item: NavItem) =>
    item.path === '/' ? route === '/' && activeSectionId === item.id : route === item.path;

  const select = (item: NavItem) => {
    if (item.path === '/') setActiveSection(item.id);
    navigate(item.path);
    setMobileOpen(false);
  };

  const slim = sidebarCollapsed && !mobileOpen;

  return (
    <>
      {mobileOpen && (
        <button aria-label="Tutup menu" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        aria-label="Navigasi utama"
        className={[
          'z-40 flex h-full shrink-0 flex-col bg-sidebar text-sidebar-fg transition-all duration-200',
          'fixed inset-y-0 left-0 w-72 md:static',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          slim ? 'md:w-16' : 'md:w-64',
        ].join(' ')}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
          {!slim && <span className="font-display text-lg font-bold tracking-wide">BPPS 2026</span>}
          <button
            onClick={toggleSidebar}
            aria-label={slim ? 'Kembangkan sidebar' : 'Kecilkan sidebar'}
            className="hidden rounded-md p-2 hover:bg-white/10 md:block"
          >
            {slim ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button onClick={() => setMobileOpen(false)} aria-label="Tutup menu" className="rounded-md p-2 hover:bg-white/10 md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {navGroups.map((g) => {
            const collapsed = !!collapsedGroups[g.id];
            return (
              <div key={g.id} className="mb-2">
                {!slim && (
                  <button
                    onClick={() => toggleGroup(g.id)}
                    aria-expanded={!collapsed}
                    className="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-fg/60 hover:text-sidebar-fg"
                  >
                    {g.label}
                    <ChevronDown size={14} className={`transition-transform ${collapsed ? '-rotate-90' : ''}`} />
                  </button>
                )}
                {(slim || !collapsed) && (
                  <ul>
                    {g.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item);
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => select(item)}
                            title={slim ? item.label : undefined}
                            aria-current={active ? 'page' : undefined}
                            className={[
                              'flex w-full items-center gap-3 border-l-4 px-4 py-2.5 text-left text-sm transition-colors',
                              slim ? 'justify-center px-0' : '',
                              active ? 'border-accent bg-white/10 font-semibold text-white' : 'border-transparent hover:bg-white/5',
                            ].join(' ')}
                          >
                            <Icon size={18} className="shrink-0" aria-hidden />
                            {!slim && <span className="truncate">{item.label}</span>}
                            {slim && <span className="sr-only">{item.label}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
