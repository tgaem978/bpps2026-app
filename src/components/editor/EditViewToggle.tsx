import { useState } from 'react';
import { FileText, LayoutTemplate } from 'lucide-react';

export type EditView = 'halaman' | 'borang';
const KEY = 'bpps-edit-view';
const read = (): EditView => { try { return localStorage.getItem(KEY) === 'borang' ? 'borang' : 'halaman'; } catch { return 'halaman'; } };

/** Pilihan cara menyunting (diingati dalam pelayar ini): terus pada paparan halaman, atau borang blok. */
export function useEditView(): [EditView, (v: EditView) => void] {
  const [v, setV] = useState<EditView>(read);
  return [v, (x) => { try { localStorage.setItem(KEY, x); } catch { /* storan disekat */ } setV(x); }];
}

export function EditViewToggle({ value, onChange }: { value: EditView; onChange: (v: EditView) => void }) {
  const opt = (v: EditView, label: string, Icon: typeof FileText) => (
    <button
      onClick={() => onChange(v)}
      aria-pressed={value === v}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${value === v ? 'bg-primary text-primary-fg shadow' : 'text-muted hover:text-text'}`}
    >
      <Icon size={15} aria-hidden /> {label}
    </button>
  );
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="Cara menyunting">
      {opt('halaman', 'Sunting di halaman', LayoutTemplate)}
      {opt('borang', 'Borang', FileText)}
    </div>
  );
}
