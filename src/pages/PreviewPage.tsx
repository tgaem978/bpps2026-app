import { Download, Presentation, Printer } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { FullBook } from '@/components/book/BookPages';
import { exportJson, printBook } from '@/lib/exporter';

const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2';

export default function PreviewPage() {
  const setPptOpen = useUiStore((s) => s.setPptOpen);
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold">Pratonton Buku</h2>
          <p className="text-sm text-muted">Paparan penuh BPPS mengikut template - A4 potret, bernombor automatik.</p>
        </div>
        <button className={btn} onClick={exportJson}><Download size={16} /> JSON</button>
        <button className={btn} onClick={() => setPptOpen(true)}><Presentation size={16} /> PowerPoint</button>
        <button className={`${btn} !border-primary !bg-primary !text-primary-fg hover:opacity-90`} onClick={printBook}>
          <Printer size={16} /> Eksport PDF
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <FullBook />
      </div>
    </div>
  );
}
