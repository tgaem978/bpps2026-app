import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Workspace from './Workspace';
import StatusBar from './StatusBar';
import { PrintRoot, Toaster } from './Overlays';
import PptExportDialog from '@/components/export/PptExportDialog';
import { MasterStyles } from '@/components/book/BookPages';
import { saveNow } from '@/lib/exporter';

export default function AppShell() {
  // Ctrl/Cmd + S = Simpan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveNow();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <Workspace />
        <StatusBar />
      </div>
      <MasterStyles />
      <Toaster />
      <PrintRoot />
      <PptExportDialog />
    </div>
  );
}
