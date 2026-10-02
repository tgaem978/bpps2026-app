import { useProjectStore } from '@/stores/projectStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useBookStore } from '@/stores/bookStore';
import { bookSections } from '@/config/sections';

const time = (t: number) => new Date(t).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' });

export default function StatusBar() {
  const profile = useProjectStore((s) => s.profile);
  const activeId = useNavigationStore((s) => s.activeSectionId);
  const lastSavedAt = useBookStore((s) => s.lastSavedAt);
  const active = bookSections.find((b) => b.id === activeId);

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between gap-3 border-t border-border bg-surface px-3 text-xs text-muted">
      <span className="truncate">{profile.projectCode}</span>
      <span className="hidden truncate sm:inline">Bahagian: {active ? active.label : '-'}</span>
      <span className="truncate">
        <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500 align-middle" aria-hidden />
        Simpan automatik{lastSavedAt ? ` · ${time(lastSavedAt)}` : ''} · Tahun {profile.year}
      </span>
    </footer>
  );
}
