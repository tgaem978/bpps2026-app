import { useRoute } from '@/lib/router';
import WelcomePage from '@/pages/WelcomePage';
import ProjectPage from '@/pages/ProjectPage';
import SettingsPage from '@/pages/SettingsPage';
import SectionPlaceholder from '@/pages/SectionPlaceholder';
import { useNavigationStore } from '@/stores/navigationStore';

export default function Workspace() {
  const route = useRoute();
  const activeId = useNavigationStore((s) => s.activeSectionId);

  let content;
  if (route === '/project') content = <ProjectPage />;
  else if (route === '/settings') content = <SettingsPage />;
  else content = activeId ? <SectionPlaceholder id={activeId} /> : <WelcomePage />;

  return (
    <main id="workspace" className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">
      {content}
    </main>
  );
}
