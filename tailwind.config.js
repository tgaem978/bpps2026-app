/** Warna/radius/shadow dibaca daripada CSS variables yang dijana oleh src/templates/tokens.ts */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-fg': 'var(--color-primary-fg)',
        accent: 'var(--color-accent)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        sidebar: 'var(--color-sidebar)',
        'sidebar-fg': 'var(--color-sidebar-fg)',
      },
      borderRadius: { md: 'var(--radius-md)', lg: 'var(--radius-lg)' },
      boxShadow: { card: 'var(--shadow-card)' },
      fontFamily: { sans: 'var(--font-body)', display: 'var(--font-heading)' },
    },
  },
  plugins: [],
};
