import { CheckCircle2, CircleAlert, RotateCcw } from 'lucide-react';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';

const fmt = (t?: number) => (t ? new Date(t).toLocaleString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');

/** Jalur status kemas kini edisi tahunan di atas penyunting halaman ('kulit' = muka hadapan). */
export default function ReviewBanner({ id }: { id: string }) {
  const review = useBookStore((s) => (id === 'kulit' ? s.cover.review : s.sections[id]?.review));
  const coverImage = useBookStore((s) => (id === 'kulit' ? s.cover.image : ''));
  const setReview = useBookStore((s) => s.setReview);
  const year = useProjectStore((s) => s.profile.year);
  if (!review || review.year !== year) return null;

  if (review.status === 'siap') {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/5 px-4 py-2.5 text-sm">
        <CheckCircle2 size={18} className="shrink-0 text-green-600" aria-hidden />
        <span className="flex-1">
          <b>Siap disemak untuk {year}</b>
          {review.by && <span className="text-muted"> · {review.by}</span>}
          {review.at && <span className="text-muted"> · {fmt(review.at)}</span>}
        </span>
        <button className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium hover:bg-surface-2" onClick={() => setReview(id, 'perlu')}>
          <RotateCcw size={13} /> Buka semula
        </button>
      </div>
    );
  }
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm">
      <CircleAlert size={18} className="shrink-0 text-amber-600" aria-hidden />
      <span className="min-w-0 flex-1">
        <b>Perlu dikemas kini untuk edisi {year}.</b>{' '}
        <span className="text-muted">
          {id === 'kulit' && coverImage
            ? `Reka bentuk muka hadapan ialah imej - jika tahun ${year - 1} tertera pada imej, muat naik reka bentuk ${year} atau jana kulit daripada teks.`
            : 'Semak nama, tarikh dan maklumat halaman ini, kemudian tandakan siap.'}
        </span>
      </span>
      <button className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg hover:opacity-90" onClick={() => setReview(id, 'siap')}>
        <CheckCircle2 size={14} /> Tandakan siap
      </button>
    </div>
  );
}
