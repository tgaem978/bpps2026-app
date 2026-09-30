import {
  BookOpen, Building2, CalendarDays, FileStack, GraduationCap, HeartHandshake,
  Users, Flag, Accessibility, Baby, FileText, Settings as SettingsIcon, FolderKanban,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Bahagian buku kekal di '/' dengan activeSection */
  path: '/' | '/project' | '/settings';
}
export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const bookSections: NavItem[] = [
  { id: 'kulit', label: 'KULIT', icon: BookOpen, path: '/' },
  { id: 'kata-aluan', label: 'KATA ALUAN', icon: FileText, path: '/' },
  { id: 'maklumat-sekolah', label: 'MAKLUMAT SEKOLAH', icon: Building2, path: '/' },
  { id: 'pentadbiran', label: 'PENTADBIRAN', icon: Users, path: '/' },
  { id: 'kurikulum', label: 'KURIKULUM', icon: GraduationCap, path: '/' },
  { id: 'hem', label: 'HEM', icon: HeartHandshake, path: '/' },
  { id: 'kokurikulum', label: 'KOKURIKULUM', icon: Flag, path: '/' },
  { id: 'pendidikan-khas', label: 'PENDIDIKAN KHAS', icon: Accessibility, path: '/' },
  { id: 'prasekolah', label: 'PRASEKOLAH', icon: Baby, path: '/' },
  { id: 'takwim', label: 'TAKWIM SEKOLAH', icon: CalendarDays, path: '/' },
  { id: 'lampiran', label: 'LAMPIRAN', icon: FileStack, path: '/' },
];

export const navGroups: NavGroup[] = [
  { id: 'buku', label: 'Bahagian Buku', items: bookSections },
  {
    id: 'aplikasi',
    label: 'Aplikasi',
    items: [
      { id: 'project', label: 'PROJEK', icon: FolderKanban, path: '/project' },
      { id: 'settings', label: 'TETAPAN', icon: SettingsIcon, path: '/settings' },
    ],
  },
];
