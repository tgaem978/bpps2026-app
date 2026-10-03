import { LayoutTemplate, ListTree, Settings2, UsersRound } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useNavigationStore } from '@/stores/navigationStore';
import StaffSettings from './settings/StaffSettings';
import OutlineSettings from './settings/OutlineSettings';
import MasterSettings from './settings/MasterSettings';

const tabs = [
  { id: 'umum', label: 'Umum', icon: Settings2 },
  { id: 'guru', label: 'Pangkalan Data Guru', icon: UsersRound },
  { id: 'kandungan', label: 'Struktur Kandungan', icon: ListTree },
  { id: 'master', label: 'Master Layout', icon: LayoutTemplate },
];

function General() {
  const { compactMode, setCompactMode } = useSettingsStore();
  return (
    <div className="max-w-2xl rounded-lg border border-border bg-surface p-6 shadow-card">
      <label className="flex items-center justify-between gap-4 text-sm font-medium">
        <span>
          Mod padat
          <span className="block text-xs font-normal text-muted">Kurangkan jarak ruang kerja supaya lebih banyak kandungan kelihatan. Disimpan dalam pelayar anda.</span>
        </span>
        <input type="checkbox" className="h-5 w-5" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} />
      </label>
    </div>
  );
}

export default function SettingsPage() {
  const tab = useNavigationStore((s) => s.settingsTab);
  const setTab = useNavigationStore((s) => s.setSettingsTab);
  return (
    <div className="mx-auto max-w-7xl">
      <h2 className="font-display text-2xl font-bold">Tetapan</h2>
      <div role="tablist" className="mt-4 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${active ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text'}`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        {tab === 'guru' ? <StaffSettings /> : tab === 'kandungan' ? <OutlineSettings /> : tab === 'master' ? <MasterSettings /> : <General />}
      </div>
    </div>
  );
}
