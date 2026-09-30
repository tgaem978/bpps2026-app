import { useProjectStore } from '@/stores/projectStore';

export default function ProjectPage() {
  const { profile, updateProfile, resetProfile } = useProjectStore();
  const field = 'mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm';

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-6 shadow-card">
      <h2 className="font-display text-2xl font-bold">Projek</h2>
      <p className="mt-1 text-sm text-muted">Profil sekolah untuk BPPS 2026.</p>
      <div className="mt-6 grid gap-4">
        <label className="text-sm font-medium">
          Nama penuh sekolah
          <input className={field} value={profile.fullName} onChange={(e) => updateProfile({ fullName: e.target.value })} />
        </label>
        <label className="text-sm font-medium">
          Nama pendek
          <input className={field} value={profile.shortName} onChange={(e) => updateProfile({ shortName: e.target.value })} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Tahun
            <input
              type="number"
              className={field}
              value={profile.year}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n) && n > 0) updateProfile({ year: n });
              }}
            />
          </label>
          <label className="text-sm font-medium">
            Kod projek
            <input className={`${field} bg-surface-2`} value={profile.projectCode} readOnly />
          </label>
        </div>
      </div>
      <button onClick={resetProfile} className="mt-6 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface-2">
        Set semula ke default
      </button>
    </div>
  );
}
