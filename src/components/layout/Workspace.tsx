import { useRoute } from '@/lib/router';
import WelcomePage from '@/pages/WelcomePage';
import ProjectPage from '@/pages/ProjectPage';
import SettingsPage from '@/pages/SettingsPage';
import PreviewPage from '@/pages/PreviewPage';
import SectionEditorPage from '@/pages/SectionEditorPage';
import { useNavigationStore } from '@/stores/navigationStore';
import { useSettingsStore } from '@/stores/settingsStore';

export default function Workspace() {
  const route = useRoute();
  const activeId = useNavigationStore((s) => s.activeSectionId);
  const compact = useSettingsStore((s) => s.compactMode);

  let content;
  if (route === '/project') content = <ProjectPage />;
  else if (route === '/settings') content = <SettingsPage />;
  else if (route === '/preview') content = <PreviewPage />;
  else content = activeId ? <SectionEditorPage key={activeId} id={activeId} /> : <WelcomePage />;

  return (
    <main id="workspace" className={`min-h-0 flex-1 overflow-y-auto ${compact ? 'p-3 md:p-4' : 'p-4 md:p-8'}`}>
      {content}
    </main>
  );
}
