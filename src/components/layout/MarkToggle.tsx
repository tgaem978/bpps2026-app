import { Highlighter } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';

/** Hidup/matikan tanda "medan perlu diisi" (merah pastel + TAMBAH MAKLUMAT + nombor) pada paparan halaman. */
export function MarkToggle({ className = '', label = 'Tanda medan kosong' }: { className?: string; label?: string }) {
  const on = useUiStore((s) => s.markEmpty);
  const set = useUiStore((s) => s.setMarkEmpty);
  return (
    <button
      onClick={() => set(!on)}
      aria-pressed={on}
      title={on ? 'Sembunyikan tanda medan yang perlu diisi' : 'Tandakan medan yang perlu diisi (merah pastel, bernombor)'}
      className={`${className} ${on ? '!border-[#E9A2A2] !bg-[#FDECEC] !text-[#B23A3A]' : ''}`}
    >
      <Highlighter size={16} aria-hidden /> <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
