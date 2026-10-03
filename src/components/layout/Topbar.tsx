import { Download, Eye, Menu, Presentation, Save, Settings } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useProjectStore } from '@/stores/projectStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { APP_NAME } from '@/config/schoolProfile';
import { navigate } from '@/lib/router';
import { printBook, saveNow } from '@/lib/exporter';

const btn =
  'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2';

export default function Topbar() {
  const fullName = useProjectStore((s) => s.profile.fullName);
  const setMobileOpen = useNavigationStore((s) => s.setMobileOpen);
  const setPptOpen = useUiStore((s) => s.setPptOpen);

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
        <button onClick={saveNow} title="Simpan (Ctrl+S)" aria-label="Simpan" className={btn}>
          <Save size={16} aria-hidden /> <span className="hidden lg:inline">Simpan</span>
        </button>
        <button onClick={() => navigate('/preview')} title="Pratonton buku penuh" aria-label="Pratonton" className={btn}>
          <Eye size={16} aria-hidden /> <span className="hidden lg:inline">Pratonton</span>
        </button>
        <button onClick={() => setPptOpen(true)} title="Muat turun PowerPoint (.pptx)" aria-label="Muat turun PPT" className={btn}>
          <Presentation size={16} aria-hidden /> <span className="hidden lg:inline">PPT</span>
        </button>
        <button onClick={printBook} title="Eksport ke PDF" aria-label="Eksport PDF" className={`${btn} !border-primary !bg-primary !text-primary-fg hover:opacity-90`}>
          <Download size={16} aria-hidden /> <span className="hidden lg:inline">Eksport PDF</span>
        </button>
        <button onClick={() => navigate('/settings')} aria-label="Tetapan" className={btn}>
          <Settings size={16} aria-hidden /> <span className="hidden lg:inline">Tetapan</span>
        </button>
      </div>
    </header>
  );
}
