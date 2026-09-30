import { useProjectStore } from '@/stores/projectStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { bookSections } from '@/config/sections';

export default function StatusBar() {
  const profile = useProjectStore((s) => s.profile);
  const activeId = useNavigationStore((s) => s.activeSectionId);
  const active = bookSections.find((b) => b.id === activeId);

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between gap-3 border-t border-border bg-surface px-3 text-xs text-muted">
      <span className="truncate">{profile.projectCode}</span>
      <span className="hidden truncate sm:inline">Bahagian: {active ? active.label : '-'}</span>
      <span>Tahun {profile.year} · Phase 01</span>
    </footer>
  );
}
