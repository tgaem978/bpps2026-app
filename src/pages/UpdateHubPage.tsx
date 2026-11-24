import { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Send, UsersRound } from 'lucide-react';
import { navigate } from '@/lib/router';
import { useProjectStore } from '@/stores/projectStore';
import { adminSession, health as fetchHealth, overview, type ApiError } from '@/lib/portalApi';
import type { AdminOverview, HealthInfo } from '@/types/portal';
import { ConnectionStep, EditionStep, PublishStep, card } from '@/components/portal/HubCards';
import { UnitsStep } from '@/components/portal/UnitsStep';
import { InboxStep } from '@/components/portal/InboxStep';

/**
 * Portal Kemas Kini (pentadbir): edisi tahunan baharu, sambungan pelayan, terbit buku ke portal,
 * unit + pautan akses, dan peti masuk kiriman unit (semak & terima ke dalam buku).
 */
export default function UpdateHubPage() {
  const year = useProjectStore((s) => s.profile.year);
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [healthError, setHealthError] = useState('');
  const [loggedIn, setLoggedIn] = useState(() => !!adminSession());
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    if (!adminSession()) {
      setLoggedIn(false);
      return;
    }
    setLoading(true);
    setErr('');
    try {
      setData(await overview());
    } catch (e) {
      const ex = e as ApiError;
      if (ex.status === 401) setLoggedIn(false);
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth().then(setHealth, (e) => setHealthError((e as Error).message));
  }, []);
  useEffect(() => {
    if (loggedIn && health?.configured) void load();
  }, [loggedIn, health, load]);

  const ready = loggedIn && health?.configured && !healthError;

  return (
    <div className="mx-auto grid max-w-4xl gap-5">
      <section className="pt-hero relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 text-white shadow-card md:flex-row md:items-center">
        <div className="self-start rounded-lg border border-[#C9A13B]/60 bg-white/10 p-3 text-[#E8C766]"><Send size={32} aria-hidden /></div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8C766]">Portal Kemas Kini</p>
          <h2 className="pt-display mt-1 text-3xl leading-tight">Kumpul kemas kini BPPS {year} daripada setiap unit</h2>
          <p className="mt-1 text-sm opacity-85">
            Setiausaha Unit mengisi dan mengemas kini halaman unit masing-masing melalui pautan portal. Kiriman masuk ke peti masuk di bawah; anda semak, terima atau tolak, dan buku dikemas kini secara automatik.
          </p>
        </div>
        <a className="inline-flex items-center gap-1.5 self-start rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium hover:bg-white/20" href="/portal" target="_blank" rel="noreferrer">
          <ExternalLink size={15} /> Buka portal
        </a>
      </section>

      <EditionStep />
      <ConnectionStep
        health={health}
        healthError={healthError}
        loggedIn={loggedIn}
        onLogin={() => setLoggedIn(true)}
        onLogout={() => { setLoggedIn(false); setData(null); }}
      />

      {ready && err && !data && <p className={`${card} text-sm text-red-600`}>{err}</p>}
      {ready && data && (
        <>
          <PublishStep edition={data.edition} onPublished={load} />
          <UnitsStep units={data.units} setUnits={(units) => setData({ ...data, units })} />
          <InboxStep submissions={data.submissions} setSubmissions={(submissions) => setData({ ...data, submissions })} onRefresh={load} refreshing={loading} />
        </>
      )}

      <section className={`${card} flex flex-col gap-3 md:flex-row md:items-center`}>
        <div className="self-start rounded-lg bg-[#0B2A5B] p-2.5 text-[#E8C766]"><UsersRound size={22} aria-hidden /></div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Selepas kiriman diterima</p>
          <h3 className="font-display text-lg font-bold">Data Induk Guru dikemas kini automatik</h3>
          <p className="text-sm text-muted">Bidang tugas setiap guru (Pentadbiran, Kurikulum, HEM, Kokurikulum, PPKI, Prasekolah, Lain-lain) disusun semula daripada halaman buku yang telah diterima.</p>
        </div>
        <button className="inline-flex items-center gap-1.5 self-start rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-2" onClick={() => navigate('/data-induk')}>Buka Data Induk Guru</button>
      </section>
    </div>
  );
}
