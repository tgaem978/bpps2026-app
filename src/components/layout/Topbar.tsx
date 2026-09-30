import { Download, Eye, Menu, Save, Settings } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { APP_NAME } from '@/config/schoolProfile';
import { navigate } from '@/lib/router';

const btn =
  'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium';
const off = `${btn} text-muted disabled:cursor-not-allowed disabled:opacity-50`;

export default function Topbar() {
  const fullName = useProjectStore((s) => s.profile.fullName);
  const setMobileOpen = useNavigationStore((s) => s.setMobileOpen);
  const soon = 'Belum tersedia (phase seterusnya)';

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface px-3 md:px-4">
      <button onClick={() => setMobileOpen(true)} aria-label="Buka menu" className="rounded-md p-2 hover:bg-surface-2 md:hidden">
        <Menu size={20} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-sm font-bold leading-tight md:text-base">{APP_NAME.toUpperCase()}</h1>
        <p className="truncate text-xs text-muted">{fullName}</p>
      </div>
      <div className="flex items-center gap-2">
        <button disabled title={soon} aria-label="Save" className={off}>
          <Save size={16} aria-hidden /> <span className="hidden lg:inline">Save</span>
        </button>
        <button disabled title={soon} aria-label="Preview" className={off}>
          <Eye size={16} aria-hidden /> <span className="hidden lg:inline">Preview</span>
        </button>
        <button disabled title={soon} aria-label="Export" className={off}>
          <Download size={16} aria-hidden /> <span className="hidden lg:inline">Export</span>
        </button>
        <button onClick={() => navigate('/settings')} aria-label="Settings" className={`${btn} hover:bg-surface-2`}>
          <Settings size={16} aria-hidden /> <span className="hidden lg:inline">Settings</span>
        </button>
      </div>
    </header>
  );
}
