import { createPortal } from 'react-dom';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { FullBook } from '@/components/book/BookPages';

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const tone = { success: 'text-green-600', error: 'text-red-600', info: 'text-primary' };

export function Toaster() {
  const { toasts, dismiss } = useUiStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-10 right-4 z-50 grid gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.kind];
        return (
          <div key={t.id} className="pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm shadow-card">
            <Icon size={18} className={`mt-0.5 shrink-0 ${tone[t.kind]}`} aria-hidden />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Tutup" className="text-muted hover:text-text"><X size={16} /></button>
          </div>
        );
      })}
    </div>
  );
}

/** Buku penuh dipasang di luar #root hanya semasa mencetak. */
export function PrintRoot() {
  const printing = useUiStore((s) => s.printing);
  const el = document.getElementById('print-root');
  if (!printing || !el) return null;
  return createPortal(<FullBook />, el);
}
