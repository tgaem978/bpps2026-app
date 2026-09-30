import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Workspace from './Workspace';
import StatusBar from './StatusBar';

export default function AppShell() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <Workspace />
        <StatusBar />
      </div>
    </div>
  );
}
