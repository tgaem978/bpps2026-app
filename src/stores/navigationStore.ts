import { create } from 'zustand';

interface NavigationState {
  activeSectionId: string | null;
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  collapsedGroups: Record<string, boolean>;
  setActiveSection: (id: string | null) => void;
  toggleSidebar: () => void;
  setMobileOpen: (v: boolean) => void;
  toggleGroup: (id: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSectionId: null,
  sidebarCollapsed: false,
  mobileOpen: false,
  collapsedGroups: {},
  setActiveSection: (activeSectionId) => set({ activeSectionId }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  toggleGroup: (id) => set((s) => ({ collapsedGroups: { ...s.collapsedGroups, [id]: !s.collapsedGroups[id] } })),
}));
