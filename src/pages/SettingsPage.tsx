import { useSettingsStore } from '@/stores/settingsStore';

export default function SettingsPage() {
  const { compactMode, setCompactMode } = useSettingsStore();
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-6 shadow-card">
      <h2 className="font-display text-2xl font-bold">Tetapan</h2>
      <label className="mt-6 flex items-center justify-between gap-4 text-sm font-medium">
        <span>
          Mod padat
          <span className="block text-xs font-normal text-muted">Pilihan disimpan dalam pelayar anda.</span>
        </span>
        <input type="checkbox" className="h-5 w-5" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} />
      </label>
      <p className="mt-6 text-xs text-muted">Tetapan lanjutan akan ditambah dalam phase seterusnya.</p>
    </div>
  );
}
