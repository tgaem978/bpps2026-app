import { useState, type ReactNode } from 'react';
import { CalendarPlus, CheckCircle2, CloudUpload, KeyRound, Loader2, LogOut, Server, TriangleAlert } from 'lucide-react';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useUiStore } from '@/stores/uiStore';
import { computeReview, startNewEdition } from '@/lib/edition';
import { editionYears, switchEdition, useEditions } from '@/lib/editions';
import { adminLogin, adminLogout, publishEdition, type ApiError } from '@/lib/portalApi';
import type { AdminOverview, HealthInfo } from '@/types/portal';

export const card = 'rounded-lg border border-border bg-surface p-5 shadow-card';
export const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2 disabled:opacity-50';
export const btnPrimary = 'inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-fg hover:opacity-90 disabled:opacity-50';
export const field = 'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm';
export const fmtTime = (t?: number | null) =>
  t ? new Date(t).toLocaleString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

export function Step({ n, title, icon, children, right }: { n: number; title: string; icon: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <section className={card}>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-fg">{n}</span>
        <span className="text-primary">{icon}</span>
        <h3 className="min-w-0 flex-1 font-display text-lg font-bold">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  );
}

/** Langkah 1: edisi tahunan baharu (salin, tukar tahun, tanda semakan). */
export function EditionStep() {
  const { cover, sections, outline } = useBookStore();
  const year = useProjectStore((s) => s.profile.year);
  const toast = useUiStore((s) => s.toast);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const saved = useEditions((s) => s.saved);
  const review = computeReview(year, cover.review, outline, sections);
  const next = year + 1;
  const years = editionYears(saved, year);
  const latest = years[0];
  const nextExists = years.includes(next);

  return (
    <Step n={1} title={`Edisi ${review.total ? year : next}`} icon={<CalendarPlus size={20} aria-hidden />}>
      {review.total > 0 ? (
        <>
          <p className="text-sm">
            Edisi semasa: <b>BPPS {year}</b> (disalin daripada edisi {year - 1}). <b>{review.done}</b> daripada <b>{review.total}</b> halaman siap disemak.
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-green-600" style={{ width: `${Math.round((review.done / review.total) * 100)}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted">Halaman bertanda kuning dalam panel kiri perlu disemak. Kemas kini yang diterima daripada Portal ditandakan siap secara automatik.</p>
        </>
      ) : (
        <p className="text-sm text-muted">
          Buku ini ialah edisi <b className="text-text">{year}</b>. Cipta edisi {next} untuk mula mengumpul kemas kini daripada unit.
        </p>
      )}
      {years.length > 1 && (
        <p className="mt-3 text-sm">
          Edisi dalam pelayar ini: {years.map((y) => <b key={y} className={`mr-1.5 inline-block rounded px-1.5 ${y === year ? 'bg-primary text-primary-fg' : 'bg-surface-2'}`}>{y}</b>)}
          <span className="text-muted"> · tukar edisi melalui pemilih tahun di bar atas.</span>
        </p>
      )}
      {nextExists ? (
        <button
          className={`${btnPrimary} mt-4`}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try { await switchEdition(latest); toast(`Kini menyunting edisi ${latest}.`); } catch (e) { toast((e as Error).message, 'error'); } finally { setBusy(false); }
          }}
        >
          <CalendarPlus size={16} /> Edisi {next} sudah wujud - buka edisi {latest}
        </button>
      ) : !confirming ? (
        <button className={`${review.total ? btn : btnPrimary} mt-4`} onClick={() => setConfirming(true)}>
          <CalendarPlus size={16} /> Cipta edisi {next}
        </button>
      ) : (
        <div className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold">Cipta edisi {next} daripada edisi {year}?</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>Edisi {year} <b>kekal dalam sistem</b> (pelayar ini) dan boleh dipilih semula bila-bila masa melalui pemilih tahun. Fail sandaran .json juga dimuat turun.</li>
            <li>Semua kandungan disalin; tahun {year} ditukar kepada {next} pada tajuk dan teks.</li>
            <li>Kalendar {next} dan Takwim Induk (tarikh & hari) dijana semula; tarikh lain (kalendar akademik, cuti, minggu akademik, jadual bertugas, pencerapan, takwim unit) dikosongkan untuk diisi.</li>
            <li>Setiap halaman ditandakan <b>perlu dikemas kini</b>.</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={btnPrimary}
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const s = await startNewEdition();
                  setConfirming(false);
                  toast(`Edisi ${s.to} dicipta: ${s.pages} halaman perlu dikemas kini. Edisi ${s.from} disimpan dalam sistem.`);
                } catch (e) {
                  toast((e as Error).message, 'error');
                } finally {
                  setBusy(false);
                }
              }}
            >
              Ya, cipta edisi {next}
            </button>
            <button className={btn} onClick={() => setConfirming(false)}>Batal</button>
          </div>
        </div>
      )}
    </Step>
  );
}

/** Langkah 2: sambungan pelayan portal (log masuk pentadbir). */
export function ConnectionStep({ health, healthError, loggedIn, onLogin, onLogout }: {
  health: HealthInfo | null; healthError: string; loggedIn: boolean; onLogin: () => void; onLogout: () => void;
}) {
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  let body: ReactNode;
  if (healthError) {
    body = (
      <div className="flex gap-2 rounded-md border border-red-500/30 bg-red-500/5 p-3 text-sm">
        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-red-600" aria-hidden />
        <div>
          <p className="font-semibold">Pelayan portal tidak dapat dihubungi.</p>
          <p className="mt-1 text-muted">{healthError} Portal berfungsi pada alamat aplikasi yang dideploy di Cloudflare (Workers), atau secara tempatan melalui <code>npm run dev:api</code>.</p>
        </div>
      </div>
    );
  } else if (!health) {
    body = <p className="flex items-center gap-2 text-sm text-muted"><Loader2 size={16} className="animate-spin" /> Menyemak pelayan…</p>;
  } else if (!health.configured) {
    body = (
      <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
        <p className="font-semibold">Kata laluan pentadbir belum ditetapkan.</p>
        <p className="mt-1 text-muted">
          Di Cloudflare: <b>Workers &amp; Pages → bpps2026-app → Settings → Variables and Secrets → Add</b>, pilih jenis <b>Secret</b>, nama <code>ADMIN_PASSWORD</code>, dan masukkan kata laluan pilihan anda. Kemudian muat semula halaman ini.
        </p>
      </div>
    );
  } else if (loggedIn) {
    body = (
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <CheckCircle2 size={18} className="text-green-600" aria-hidden />
        <span className="flex-1">Disambungkan sebagai pentadbir.</span>
        <button className={btn} onClick={() => { adminLogout(); onLogout(); }}><LogOut size={15} /> Log keluar</button>
      </div>
    );
  } else {
    body = (
      <form
        className="flex flex-wrap items-start gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr('');
          try {
            await adminLogin(pw);
            setPw('');
            onLogin();
          } catch (ex) {
            setErr((ex as ApiError).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="min-w-[220px] flex-1 text-sm font-medium">
          Kata laluan pentadbir
          <input type="password" autoComplete="current-password" className={`${field} mt-1`} value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        <button className={`${btnPrimary} mt-6`} disabled={!pw || busy}>{busy ? <Loader2 size={15} className="animate-spin" /> : <KeyRound size={15} />} Log masuk</button>
        {err && <p className="w-full text-sm text-red-600">{err}</p>}
      </form>
    );
  }
  return <Step n={2} title="Sambungan pelayan portal" icon={<Server size={20} aria-hidden />}>{body}</Step>;
}

/** Langkah 3: terbitkan buku semasa ke portal. */
export function PublishStep({ edition, onPublished }: { edition: AdminOverview['edition']; onPublished: () => void }) {
  const sections = useBookStore((s) => s.sections);
  const coverAt = useBookStore((s) => s.cover.updatedAt);
  const year = useProjectStore((s) => s.profile.year);
  const toast = useUiStore((s) => s.toast);
  const [progress, setProgress] = useState<[number, number] | null>(null);
  const [err, setErr] = useState('');
  const lastLocal = Math.max(coverAt ?? 0, ...Object.values(sections).map((s) => s.updatedAt ?? 0));
  const stale = edition && lastLocal > edition.publishedAt;
  const yearMismatch = edition && edition.year !== year;

  return (
    <Step n={3} title="Terbitkan buku ke portal" icon={<CloudUpload size={20} aria-hidden />}>
      <p className="text-sm text-muted">
        Unit melihat dan menyunting salinan buku yang diterbitkan. Terbitkan semula selepas membuat perubahan besar dalam penjana (cth. selepas mencipta edisi baharu atau mengemas kini Pangkalan Data Guru).
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        {edition ? (
          <span>
            Di portal: <b>BPPS {edition.year}</b> · {edition.sections} halaman · {edition.teachers} guru · diterbitkan {fmtTime(edition.publishedAt)}
          </span>
        ) : (
          <span className="font-semibold text-amber-700">Belum diterbitkan.</span>
        )}
        {(stale || yearMismatch) && (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700">
            {yearMismatch ? `Penjana kini edisi ${year}` : 'Ada perubahan belum diterbitkan'}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          className={btnPrimary}
          disabled={!!progress}
          onClick={async () => {
            setErr('');
            setProgress([0, 1]);
            try {
              await publishEdition((d, t) => setProgress([d, t]));
              toast(`BPPS ${year} diterbitkan ke portal.`);
              onPublished();
            } catch (ex) {
              setErr((ex as Error).message);
            } finally {
              setProgress(null);
            }
          }}
        >
          {progress ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />} {edition ? 'Terbitkan semula' : 'Terbitkan sekarang'}
        </button>
        {progress && (
          <div className="h-2 w-48 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={progress[0]} aria-valuemax={progress[1]}>
            <div className="h-full bg-primary transition-all" style={{ width: `${(progress[0] / progress[1]) * 100}%` }} />
          </div>
        )}
      </div>
      {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
    </Step>
  );
}
