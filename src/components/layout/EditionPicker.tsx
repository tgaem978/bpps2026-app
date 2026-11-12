import { useEffect, useState } from 'react';
import { BookCopy, CalendarRange, Loader2 } from 'lucide-react';
import { editionYears, switchEdition, useEditions } from '@/lib/editions';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';

/** Pemilih edisi (tahun) di bar atas. */
export function EditionPicker() {
  const year = useProjectStore((s) => s.profile.year);
  const { saved, ready, refresh } = useEditions();
  const toast = useUiStore((s) => s.toast);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!ready) void refresh(); }, [ready, refresh]);
  const years = editionYears(saved, year);
  if (years.length < 2) return null;
  return (
    <label className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-sm font-medium" title="Pilih edisi (tahun) untuk disunting">
      {busy ? <Loader2 size={15} className="animate-spin" /> : <CalendarRange size={15} aria-hidden />}
      <span className="sr-only">Edisi</span>
      <select
        className="bg-transparent font-semibold outline-none"
        value={year}
        disabled={busy}
        onChange={async (e) => {
          setBusy(true);
          try {
            await switchEdition(Number(e.target.value));
            toast(`Kini menyunting edisi ${e.target.value}.`);
          } catch (err) {
            toast((err as Error).message, 'error');
          } finally {
            setBusy(false);
          }
        }}
      >
        {years.map((y) => <option key={y} value={y}>BPPS {y}</option>)}
      </select>
    </label>
  );
}

/** Pilih edisi sebelum mula menyunting (sekali bagi setiap sesi pelayar, jika ada lebih daripada satu edisi). */
export function EditionChooser() {
  const year = useProjectStore((s) => s.profile.year);
  const { saved, ready, refresh, chosen } = useEditions();
  const toast = useUiStore((s) => s.toast);
  const [busy, setBusy] = useState<number | null>(null);
  useEffect(() => { if (!ready) void refresh(); }, [ready, refresh]);
  const years = editionYears(saved, year);
  if (chosen || !ready || years.length < 2) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Pilih edisi">
      <div className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-primary p-2.5 text-primary-fg"><BookCopy size={22} aria-hidden /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Buku Panduan Pengurusan Sekolah</p>
            <h2 className="font-display text-xl font-bold">Pilih edisi</h2>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">Pilih tahun buku yang hendak disunting. Anda boleh menukar edisi bila-bila masa di bar atas.</p>
        <div className="mt-4 grid gap-2">
          {years.map((y) => (
            <button
              key={y}
              disabled={busy !== null}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left hover:border-primary ${y === year ? 'border-primary bg-primary/5' : 'border-border'}`}
              onClick={async () => {
                setBusy(y);
                try {
                  await switchEdition(y);
                } catch (err) {
                  toast((err as Error).message, 'error');
                  setBusy(null);
                }
              }}
            >
              <span className="font-display text-lg font-bold">BPPS {y}</span>
              <span className="text-xs text-muted">{busy === y ? <Loader2 size={16} className="animate-spin" /> : y === year ? 'Edisi terakhir dibuka' : ''}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
