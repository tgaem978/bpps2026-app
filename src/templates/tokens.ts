/**
 * Design tokens - diekstrak daripada Master PPTX (final DRAF 1 - BPPS2026 SKBTS).
 * Semua gaya visual dibaca daripada sini melalui CSS variables - jangan hard-code di komponen.
 */
export interface DesignTokens {
  colors: {
    primary: string; primaryFg: string; accent: string; bg: string; surface: string;
    surface2: string; border: string; text: string; muted: string; sidebar: string; sidebarFg: string;
  };
  /** Warna halaman buku mengikut template PPTX */
  book: { navy: string; frame: string; gold: string; sand: string; cyan: string; ink: string; rowAlt: string };
  typography: {
    fontHeading: string; fontBody: string;
    sizes: { xs: string; sm: string; base: string; lg: string; xl: string; xxl: string };
  };
  spacing: { xs: string; sm: string; md: string; lg: string; xl: string };
  radius: { sm: string; md: string; lg: string };
  shadows: { card: string; overlay: string };
  page: { widthMm: number; heightMm: number; orientation: 'portrait' | 'landscape' };
}

export const designTokens: DesignTokens = {
  colors: {
    primary: '#004358', primaryFg: '#ffffff', accent: '#f0a52c', bg: '#eef2f4',
    surface: '#ffffff', surface2: '#f5f8f9', border: '#d6dfe3', text: '#1b1d1c',
    muted: '#5b6b74', sidebar: '#003645', sidebarFg: '#e3edf0',
  },
  book: { navy: '#004358', frame: 'rgba(45,68,91,.8)', gold: '#FFBA4B', sand: '#E5BE7B', cyan: '#00AED5', ink: '#1B1D1C', rowAlt: '#F2F5F7' },
  typography: {
    fontHeading: '"Poppins", "Segoe UI", Arial, sans-serif',
    fontBody: '"Inter", "Segoe UI", Arial, sans-serif',
    sizes: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.5rem', xxl: '2rem' },
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2.5rem' },
  radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' },
  shadows: { card: '0 1px 3px rgba(15,23,42,.08), 0 1px 2px rgba(15,23,42,.06)', overlay: '0 10px 30px rgba(15,23,42,.25)' },
  // Saiz slaid template: 7556500 x 10693400 EMU = A4 potret
  page: { widthMm: 210, heightMm: 297, orientation: 'portrait' },
};

export function applyTokens(t: DesignTokens, root: HTMLElement = document.documentElement): void {
  const set = (k: string, v: string) => root.style.setProperty(k, v);
  const c = t.colors;
  set('--color-primary', c.primary); set('--color-primary-fg', c.primaryFg); set('--color-accent', c.accent);
  set('--color-bg', c.bg); set('--color-surface', c.surface); set('--color-surface-2', c.surface2);
  set('--color-border', c.border); set('--color-text', c.text); set('--color-muted', c.muted);
  const b = t.book;
  set('--book-navy', b.navy); set('--book-frame', b.frame); set('--book-gold', b.gold); set('--book-sand', b.sand);
  set('--book-cyan', b.cyan); set('--book-ink', b.ink); set('--book-row-alt', b.rowAlt);
  set('--color-sidebar', c.sidebar); set('--color-sidebar-fg', c.sidebarFg);
  set('--font-heading', t.typography.fontHeading); set('--font-body', t.typography.fontBody);
  set('--radius-sm', t.radius.sm); set('--radius-md', t.radius.md); set('--radius-lg', t.radius.lg);
  set('--shadow-card', t.shadows.card); set('--shadow-overlay', t.shadows.overlay);
  set('--page-ratio', String(t.page.heightMm / t.page.widthMm));
  (Object.keys(t.spacing) as (keyof DesignTokens['spacing'])[]).forEach((k) => set(`--space-${k}`, t.spacing[k]));
}
