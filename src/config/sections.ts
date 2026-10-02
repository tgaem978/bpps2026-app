import {
  BookOpen, Building2, CalendarDays, FileStack, GraduationCap, HeartHandshake, Network, UsersRound, ClipboardList,
  Users, Flag, Accessibility, Baby, FileText, NotebookPen, Settings as SettingsIcon, FolderKanban, Eye,
  type LucideIcon,
} from 'lucide-react';

export type AppPath = '/project' | '/settings' | '/preview';

export interface AppNavItem { id: string; label: string; icon: LucideIcon; path: AppPath }

export const appNav: AppNavItem[] = [
  { id: 'preview', label: 'Pratonton Buku', icon: Eye, path: '/preview' },
  { id: 'project', label: 'Projek', icon: FolderKanban, path: '/project' },
  { id: 'settings', label: 'Tetapan', icon: SettingsIcon, path: '/settings' },
];

/** Ikon untuk tajuk lalai; tajuk baharu menggunakan ikon dokumen. */
const icons: Record<string, LucideIcon> = {
  kulit: BookOpen,
  'kata-aluan': FileText,
  'maklumat-sekolah': Building2,
  'carta-organisasi': Network,
  pentadbiran: Users,
  'senarai-guru': UsersRound,
  'jk-pengurusan': ClipboardList,
  kurikulum: GraduationCap,
  hem: HeartHandshake,
  kokurikulum: Flag,
  'pendidikan-khas': Accessibility,
  prasekolah: Baby,
  takwim: CalendarDays,
  lampiran: FileStack,
  catatan: NotebookPen,
};

export const iconFor = (id: string): LucideIcon => icons[id] ?? (id.startsWith('jk-') ? ClipboardList : FileText);
