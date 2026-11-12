/* Grafik asal tema "Biru Navy & Emas" (SVG; dilukis untuk projek ini - garis pelan bangunan sekolah, ikon bahagian & ikon maklumat). */
import {
  Building2, BookOpen, CalendarDays, FileText, Hash, HeartHandshake, Landmark, Mail, MapPin, Network, Phone, School, Shapes, Trophy,
  UserRound, UsersRound, Clock, GraduationCap, Layers, Target, Flag, type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

const NAVY = '#0B2A5B';
const GOLD = '#C9A13B';

/** Bangunan sekolah gaya pelan (blueprint): blok tengah berbumbung, dua sayap, kanopi pintu, tiang bendera, pokok & garisan panduan. */
export function BuildingArt({ className = '' }: { className?: string }) {
  const win = (x: number, y: number, cols: number, rows: number, w = 9, h = 8, gx = 4, gy = 6) => {
    const out: ReactNode[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const X = x + c * (w + gx), Y = y + r * (h + gy);
        out.push(<g key={`${x}-${y}-${r}-${c}`}><rect x={X} y={Y} width={w} height={h} /><line x1={X + w / 2} y1={Y} x2={X + w / 2} y2={Y + h} /></g>);
      }
    return out;
  };
  const tree = (cx: number, base: number, r: number) => (
    <g key={`t${cx}`}>
      <circle cx={cx} cy={base - r * 1.9} r={r} />
      <circle cx={cx - r * 0.55} cy={base - r * 1.45} r={r * 0.7} />
      <circle cx={cx + r * 0.6} cy={base - r * 1.4} r={r * 0.65} />
      <line x1={cx} y1={base - r * 0.9} x2={cx} y2={base} />
    </g>
  );
  return (
    <svg viewBox="0 0 400 190" className={className} aria-hidden fill="none" stroke={NAVY} strokeWidth={1.1} strokeLinejoin="round" strokeLinecap="round">
      {/* garisan panduan pelan */}
      <g stroke="#7FA2D6" strokeWidth={0.5} strokeDasharray="3 3">
        <line x1="0" y1="168" x2="400" y2="168" />
        <line x1="200" y1="0" x2="200" y2="190" />
        <path d="M60 168 L200 120 L340 168" />
        <circle cx="200" cy="96" r="78" />
      </g>
      {/* sayap kiri */}
      <rect x="40" y="88" width="104" height="80" fill="#fff" />
      <line x1="40" y1="96" x2="144" y2="96" />
      {win(48, 104, 7, 4)}
      {/* sayap kanan */}
      <rect x="256" y="88" width="104" height="80" fill="#fff" />
      <line x1="256" y1="96" x2="360" y2="96" />
      {win(264, 104, 7, 4)}
      {/* blok tengah */}
      <rect x="144" y="66" width="112" height="102" fill="#fff" />
      <path d="M136 66 L200 40 L264 66 Z" fill="#fff" />
      <path d="M150 66 L200 46 L250 66" stroke={GOLD} />
      <circle cx="200" cy="56" r="5" stroke={GOLD} />
      {win(154, 76, 6, 3, 10, 9, 6, 7)}
      {/* kanopi & pintu */}
      <path d="M170 140 L230 140 L236 146 L164 146 Z" fill="#fff" />
      <rect x="182" y="146" width="36" height="22" />
      <line x1="200" y1="146" x2="200" y2="168" />
      <line x1="172" y1="146" x2="172" y2="168" /><line x1="228" y1="146" x2="228" y2="168" />
      {/* tangga */}
      <path d="M176 168 L224 168 M172 172 L228 172 M168 176 L232 176" />
      {/* tiang bendera */}
      <line x1="122" y1="168" x2="122" y2="60" />
      <path d="M122 60 L142 64 L122 70 Z" fill={GOLD} stroke={GOLD} />
      {[tree(22, 168, 9), tree(378, 168, 9), tree(10, 168, 6), tree(390, 168, 6)]}
      <line x1="0" y1="168" x2="400" y2="168" strokeWidth={1.3} />
    </svg>
  );
}

/** Ikon bulatan pembahagi mengikut bahagian. */
const PART_ICONS: Record<string, LucideIcon> = {
  'p-maklumat': School, 'p-pentadbiran': Network, 'p-kurikulum': BookOpen, 'p-hem': UsersRound, 'p-koku': Trophy,
  'p-takwim': CalendarDays, 'p-pkhas': HeartHandshake, 'p-prasekolah': Shapes, 'p-lampiran': FileText,
};
export const partIcon = (partId: string): LucideIcon => PART_ICONS[partId] ?? FileText;

/** Ikon kad maklumat (Maklumat Sekolah dsb.) mengikut kata kunci perkara. */
const KV_ICONS: [RegExp, LucideIcon][] = [
  [/e-?mel|email/i, Mail],
  [/tel|faks|telefon/i, Phone],
  [/alamat|lokasi|koordinat/i, MapPin],
  [/kod/i, Hash],
  [/nama sekolah|sekolah/i, Building2],
  [/guru|staf|akp|pentadbir|penyelaras|ketua|pengerusi/i, UserRound],
  [/murid|pelajar|bilangan|jumlah|enrolmen/i, UsersRound],
  [/sesi|waktu|masa|tarikh/i, Clock],
  [/kurikulum|akademik|ikhtisas|opsyen|gred/i, GraduationCap],
  [/kelas|bilik|blok/i, Layers],
  [/visi|misi|matlamat|objektif|kpi|sasaran/i, Target],
  [/ppd|jpn|kementerian|parlimen|dun|jabatan/i, Landmark],
];
export function kvIcon(key: string): LucideIcon {
  return KV_ICONS.find(([re]) => re.test(key))?.[1] ?? Flag;
}

/** Tajuk yang dipaparkan sebagai kad navy (gaya Visi / Misi). */
export const PANEL_HEADINGS = /^(VISI|MISI|MOTO|SLOGAN|OBJEKTIF|MATLAMAT|FALSAFAH|PIAGAM PELANGGAN)\b/i;
