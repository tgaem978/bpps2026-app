/**
 * Design tokens (PLACEHOLDER). Akan digantikan selepas Master PPTX dianalisis (PHASE 02).
 * Semua gaya visual dibaca daripada sini melalui CSS variables - jangan hard-code di komponen.
 */
export interface DesignTokens {
  colors: {
    primary: string; primaryFg: string; accent: string; bg: string; surface: string;
    surface2: string; border: string; text: string; muted: string; sidebar: string; sidebarFg: string;
  };
  typography: {
    fontHeading: string; fontBody: string;
    sizes: { xs: string; sm: string; base: string; lg: string; xl: string; xxl: string };
  };
  spacing: { xs: string; sm: string; md: string; lg: string; xl: string };
  radius: { sm: string; md: string; lg: string };
  shadows: { card: string; overlay: string };
  page: { widthMm: number; heightMm: number; marginMm: number; orientation: 'portrait' | 'landscape' };
}

export const designTokens: DesignTokens = {
  colors: {
    primary: '#1e3a8a', primaryFg: '#ffffff', accent: '#d97706', bg: '#f1f5f9',
    surface: '#ffffff', surface2: '#f8fafc', border: '#e2e8f0', text: '#0f172a',
    muted: '#64748b', sidebar: '#0f1f4d', sidebarFg: '#e2e8f0',
  },
  typography: {
    fontHeading: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    fontBody: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    sizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.5rem', xxl: '2rem' },
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2.5rem' },
  radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' },
  shadows: { card: '0 1px 3px rgba(15,23,42,.08), 0 1px 2px rgba(15,23,42,.06)', overlay: '0 10px 30px rgba(15,23,42,.25)' },
  page: { widthMm: 297, heightMm: 210, marginMm: 10, orientation: 'landscape' },
};

export function applyTokens(t: DesignTokens, root: HTMLElement = document.documentElement): void {
  const set = (k: string, v: string) => root.style.setProperty(k, v);
  const c = t.colors;
  set('--color-primary', c.primary); set('--color-primary-fg', c.primaryFg); set('--color-accent', c.accent);
  set('--color-bg', c.bg); set('--color-surface', c.surface); set('--color-surface-2', c.surface2);
  set('--color-border', c.border); set('--color-text', c.text); set('--color-muted', c.muted);
  set('--color-sidebar', c.sidebar); set('--color-sidebar-fg', c.sidebarFg);
  set('--font-heading', t.typography.fontHeading); set('--font-body', t.typography.fontBody);
  set('--radius-sm', t.radius.sm); set('--radius-md', t.radius.md); set('--radius-lg', t.radius.lg);
  set('--shadow-card', t.shadows.card); set('--shadow-overlay', t.shadows.overlay);
  (Object.keys(t.spacing) as (keyof DesignTokens['spacing'])[]).forEach((k) => set(`--space-${k}`, t.spacing[k]));
}
