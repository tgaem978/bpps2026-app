import AppShell from '@/components/layout/AppShell';
import { runDataFixes } from '@/lib/dataFixes';

// Pembetulan data sekali-jalan bagi semua edisi dalam pelayar ini (nama GPK, sejarah, lencana).
void runDataFixes();

export default function App() {
  return <AppShell />;
}
