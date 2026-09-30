import { bookSections } from '@/config/sections';

export default function SectionPlaceholder({ id }: { id: string }) {
  const section = bookSections.find((s) => s.id === id);
  if (!section) return null;
  const Icon = section.icon;
  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-8 shadow-card">
      <div className="flex items-center gap-3">
        <Icon size={24} className="text-primary" aria-hidden />
        <h2 className="font-display text-2xl font-bold">{section.label}</h2>
      </div>
      <p className="mt-4 text-muted">Kandungan bahagian ini belum dibina. Editor akan ditambah dalam phase seterusnya.</p>
    </div>
  );
}
