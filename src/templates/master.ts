import { templateAssets } from './bpps';
import type { SectionLayout } from '@/types/book';

/**
 * Master layout: setiap jenis halaman mempunyai set gaya sendiri. Nilai disimpan sebagai
 * "override" di atas nilai lalai template; perubahan pada satu jenis halaman dikenakan
 * kepada SEMUA halaman jenis itu melalui CSS variables pada .book-page[data-pt="…"].
 */
export type PageType = 'cover' | 'toc' | 'divider' | SectionLayout;

export const pageTypes: { id: PageType; label: string; desc: string }[] = [
  { id: 'cover', label: 'Muka Hadapan (dijana)', desc: 'BPPS 01 - kulit yang dijana daripada teks' },
  { id: 'toc', label: 'Isi Kandungan', desc: 'BPPS 02 - senarai bahagian, tajuk & subtajuk' },
  { id: 'divider', label: 'Partition', desc: 'BPPS 03 - pemisah bahagian utama' },
  { id: 'standard', label: 'Halaman Isi', desc: 'BPPS 05 - tajuk + bingkai kandungan' },
  { id: 'twocol', label: 'Dua Lajur', desc: 'BPPS 08/11 - kandungan dalam dua lajur' },
  { id: 'open', label: 'Tajuk Sahaja', desc: 'BPPS 09 - tajuk tanpa bingkai, ruang terbuka' },
  { id: 'notes', label: 'Catatan', desc: 'BPPS 10 - halaman bergaris untuk catatan' },
];

export const layoutOptions: { id: SectionLayout; label: string; desc: string }[] = [
  { id: 'standard', label: 'Halaman Isi', desc: 'Satu lajur dalam bingkai (lalai)' },
  { id: 'twocol', label: 'Dua Lajur', desc: 'Sesuai untuk senarai panjang & kokurikulum' },
  { id: 'open', label: 'Tajuk Sahaja', desc: 'Tanpa bingkai - untuk carta & gambar besar' },
  { id: 'notes', label: 'Catatan', desc: 'Baki halaman diisi garisan untuk menulis' },
];

export interface MasterProps {
  headerImage: string; footerImage: string; bgImage: string; showBg: boolean;
  titleFont: string; titleSize: number; titleColor: string; titleUpper: boolean;
  badgeBg: string; badgeColor: string; badgeSize: number;
  showFrame: boolean; frameColor: string; frameWidth: number; frameBg: string;
  bodyFont: string; bodySize: number; lineHeight: number; textColor: string; accentColor: string;
  headingBg: string; headingColor: string; headingAccent: string; headingSize: number;
  tableHeadBg: string; tableHeadColor: string; tableAccent: string; rowAlt: string; tableSize: number;
  numBg: string; numColor: string; tableBorder: string; panelColor: string;
  footerText: string; footerColor: string; footerSize: number; showPageNo: boolean;
  pageTitle: string; tocPartBg: string; ruleColor: string; ruleGap: number;
  noteSize: number; noteColor: string; schoolColor: string; subtitleColor: string; mottoColor: string;
}
export type MasterKey = keyof MasterProps;

export const fonts: Record<string, string> = {
  'Poppins': '"Poppins", "Segoe UI", Arial, sans-serif',
  'Montserrat': '"Montserrat", "Segoe UI", Arial, sans-serif',
  'Playfair Display': '"Playfair Display", Georgia, serif',
  'Source Sans 3': '"Source Sans 3", "Segoe UI", Arial, sans-serif',
  'Inter': '"Inter", "Segoe UI", Arial, sans-serif',
  'Lato': '"Lato", "Segoe UI", Arial, sans-serif',
  'Roboto Condensed': '"Roboto Condensed", "Arial Narrow", Arial, sans-serif',
  'Arial Narrow': '"Arial Narrow", "Roboto Condensed", Arial, sans-serif',
  'Lora': '"Lora", Georgia, serif',
  'Merriweather': '"Merriweather", Georgia, serif',
  'Arial': 'Arial, Helvetica, sans-serif',
};

/** Nilai lalai = dokumen sebenar "BPPS 2026 - Bahagian A Pentadbiran Sekolah" (v10). */
const contentBase: MasterProps = {
  headerImage: templateAssets.header, footerImage: templateAssets.footer, bgImage: templateAssets.pageBg, showBg: true,
  // Tajuk: Poppins Bold 24pt, berpusat, hitam
  titleFont: 'Poppins', titleSize: 22, titleColor: '#102A36', titleUpper: true,
  // Lencana: Poppins Bold 12.8pt, teks #F6F6F4 atas #004358, bingkai putih
  badgeBg: '#004358', badgeColor: '#F6F6F4', badgeSize: 12.8,
  // Bingkai: 4.5pt #2D445B (80%)
  showFrame: true, frameColor: '#56697C', frameWidth: 1.6, frameBg: '#FFFFFF',
  // Isi: Arial Narrow 11pt, justify, jarak baris tunggal
  bodyFont: 'Arial Narrow', bodySize: 11, lineHeight: 1.15, textColor: '#000000', accentColor: '#CB8200',
  // Bar tajuk kecil: Poppins Bold 12pt putih atas #004358, garis #E5BE7B
  headingBg: '#004358', headingColor: '#FFFFFF', headingAccent: '#E5BE7B', headingSize: 12,
  // Jadual: kepala #004257 teks putih (Arial Narrow Bold 11pt), lajur BIL #CB8200, garisan #D9D9D9; gaya emas #FFBA4B
  tableHeadBg: '#004257', tableHeadColor: '#FFFFFF', tableAccent: '#FFBA4B', rowAlt: '#FFFFFF', tableSize: 11,
  numBg: '#CB8200', numColor: '#FFFFFF', tableBorder: '#D9D9D9', panelColor: '#FFBA4B',
  footerText: '', footerColor: '#FFFFFF', footerSize: 7.5, showPageNo: true,
  pageTitle: '', tocPartBg: '#004358', ruleColor: '#C9D4DC', ruleGap: 8,
  noteSize: 14, noteColor: '#22313B', schoolColor: '#004358', subtitleColor: '#004358', mottoColor: '#004358',
};

export function masterDefaults(type: PageType): MasterProps {
  switch (type) {
    case 'toc': return { ...contentBase, pageTitle: 'ISI KANDUNGAN' };
    case 'notes': return { ...contentBase, pageTitle: 'CATATAN' };
    case 'open': return { ...contentBase, showFrame: false };
    // Partition: Poppins Bold 50pt (dikecilkan automatik supaya muat kotak)
    case 'divider': return { ...contentBase, bgImage: templateAssets.divider, titleSize: 50, titleColor: '#000000', titleFont: 'Poppins' };
    case 'cover': return { ...contentBase, bgImage: templateAssets.divider, titleSize: 20, titleColor: '#000000', titleFont: 'Poppins' };
    default: return { ...contentBase };
  }
}

export type PropKind = 'image' | 'color' | 'size' | 'font' | 'text' | 'toggle';
export interface PropDef { key: MasterKey; label: string; kind: PropKind; group: string; min?: number; max?: number; step?: number; hint?: string }

const g = { img: 'Imej', title: 'Tajuk Halaman', body: 'Teks Isi', head: 'Tajuk Kecil (bar)', table: 'Jadual', frame: 'Bingkai', foot: 'Kaki Halaman', text: 'Teks Placeholder', special: 'Khas' };

const contentDefs: PropDef[] = [
  { key: 'headerImage', label: 'Jalur tajuk', kind: 'image', group: g.img },
  { key: 'footerImage', label: 'Jalur kaki', kind: 'image', group: g.img },
  { key: 'bgImage', label: 'Corak latar', kind: 'image', group: g.img },
  { key: 'showBg', label: 'Papar corak latar', kind: 'toggle', group: g.img },
  { key: 'titleFont', label: 'Fon', kind: 'font', group: g.title },
  { key: 'titleSize', label: 'Saiz maksimum (pt)', kind: 'size', group: g.title, min: 9, max: 32, step: 0.5 },
  { key: 'titleColor', label: 'Warna', kind: 'color', group: g.title },
  { key: 'titleUpper', label: 'Huruf besar', kind: 'toggle', group: g.title },
  { key: 'badgeBg', label: 'Lencana: latar', kind: 'color', group: g.title },
  { key: 'badgeColor', label: 'Lencana: teks', kind: 'color', group: g.title },
  { key: 'badgeSize', label: 'Lencana: saiz (pt)', kind: 'size', group: g.title, min: 7, max: 18, step: 0.2 },
  { key: 'bodyFont', label: 'Fon', kind: 'font', group: g.body },
  { key: 'bodySize', label: 'Saiz (pt)', kind: 'size', group: g.body, min: 7, max: 16, step: 0.5 },
  { key: 'lineHeight', label: 'Jarak baris', kind: 'size', group: g.body, min: 1.1, max: 2.2, step: 0.05 },
  { key: 'textColor', label: 'Warna teks', kind: 'color', group: g.body },
  { key: 'accentColor', label: 'Warna aksen (penanda, bingkai foto)', kind: 'color', group: g.body },
  { key: 'headingBg', label: 'Latar', kind: 'color', group: g.head },
  { key: 'headingColor', label: 'Teks', kind: 'color', group: g.head },
  { key: 'headingAccent', label: 'Garis tepi', kind: 'color', group: g.head },
  { key: 'headingSize', label: 'Saiz (pt)', kind: 'size', group: g.head, min: 7, max: 16, step: 0.5 },
  { key: 'tableHeadBg', label: 'Kepala: latar', kind: 'color', group: g.table },
  { key: 'tableHeadColor', label: 'Kepala: teks', kind: 'color', group: g.table },
  { key: 'tableAccent', label: 'Kepala gaya emas: latar', kind: 'color', group: g.table },
  { key: 'numBg', label: 'Lajur BIL: latar', kind: 'color', group: g.table },
  { key: 'numColor', label: 'Lajur BIL: teks', kind: 'color', group: g.table },
  { key: 'tableBorder', label: 'Garisan jadual', kind: 'color', group: g.table },
  { key: 'rowAlt', label: 'Baris berselang', kind: 'color', group: g.table },
  { key: 'tableSize', label: 'Saiz teks (pt)', kind: 'size', group: g.table, min: 7, max: 14, step: 0.5 },
  { key: 'showFrame', label: 'Papar bingkai', kind: 'toggle', group: g.frame },
  { key: 'frameColor', label: 'Warna', kind: 'color', group: g.frame },
  { key: 'frameWidth', label: 'Ketebalan (mm)', kind: 'size', group: g.frame, min: 0.2, max: 4, step: 0.1 },
  { key: 'frameBg', label: 'Latar dalam bingkai', kind: 'color', group: g.frame },
  { key: 'footerText', label: 'Teks kaki', kind: 'text', group: g.foot, hint: '{{motto}}, {{nama_sekolah}}, {{tahun}}' },
  { key: 'footerColor', label: 'Warna', kind: 'color', group: g.foot },
  { key: 'footerSize', label: 'Saiz (pt)', kind: 'size', group: g.foot, min: 5, max: 12, step: 0.5 },
  { key: 'showPageNo', label: 'Papar nombor halaman', kind: 'toggle', group: g.foot },
];

export const masterSchema: Record<PageType, PropDef[]> = {
  standard: contentDefs,
  twocol: contentDefs,
  open: contentDefs,
  toc: [
    { key: 'pageTitle', label: 'Tajuk halaman', kind: 'text', group: g.text },
    { key: 'tocPartBg', label: 'Latar baris bahagian utama', kind: 'color', group: g.special },
    ...contentDefs,
  ],
  notes: [
    { key: 'pageTitle', label: 'Tajuk halaman (jika tiada tajuk bahagian)', kind: 'text', group: g.text },
    { key: 'panelColor', label: 'Warna panel catatan', kind: 'color', group: g.special },
    ...contentDefs,
  ],
  divider: [
    { key: 'bgImage', label: 'Imej latar partition', kind: 'image', group: g.img },
    { key: 'titleFont', label: 'Fon tajuk', kind: 'font', group: g.title },
    { key: 'titleSize', label: 'Saiz tajuk maksimum (pt)', kind: 'size', group: g.title, min: 12, max: 60, step: 0.5 },
    { key: 'titleColor', label: 'Warna tajuk', kind: 'color', group: g.title },
    { key: 'titleUpper', label: 'Huruf besar', kind: 'toggle', group: g.title },
    { key: 'noteSize', label: 'Saiz catatan (pt)', kind: 'size', group: g.title, min: 7, max: 18, step: 0.5 },
    { key: 'noteColor', label: 'Warna catatan', kind: 'color', group: g.title },
  ],
  cover: [
    { key: 'bgImage', label: 'Imej latar', kind: 'image', group: g.img },
    { key: 'titleFont', label: 'Fon tajuk', kind: 'font', group: g.title },
    { key: 'titleSize', label: 'Saiz tajuk (pt)', kind: 'size', group: g.title, min: 12, max: 36, step: 0.5 },
    { key: 'titleColor', label: 'Warna tajuk', kind: 'color', group: g.title },
    { key: 'subtitleColor', label: 'Warna subtajuk', kind: 'color', group: g.title },
    { key: 'schoolColor', label: 'Warna nama sekolah', kind: 'color', group: g.title },
    { key: 'mottoColor', label: 'Warna moto', kind: 'color', group: g.title },
  ],
};

/** CSS variables untuk satu jenis halaman. Saiz dalam pt/mm diubah kepada unit halaman (--pt/--mm). */
export function masterCss(type: PageType, m: MasterProps): string {
  const font = (f: string) => fonts[f] ?? fonts['Source Sans 3'];
  const vars: Record<string, string> = {
    '--m-title-font': font(m.titleFont),
    '--m-title-size': `calc(var(--pt) * ${m.titleSize})`,
    '--m-title-color': m.titleColor,
    '--m-title-case': m.titleUpper ? 'uppercase' : 'none',
    '--m-badge-bg': m.badgeBg,
    '--m-badge-color': m.badgeColor,
    '--m-badge-size': `calc(var(--pt) * ${m.badgeSize})`,
    '--m-num-bg': m.numBg,
    '--m-num-color': m.numColor,
    '--m-table-border': m.tableBorder,
    '--m-panel': m.panelColor,
    '--m-frame-color': m.showFrame ? m.frameColor : 'transparent',
    '--m-frame-width': `calc(var(--mm) * ${m.showFrame ? m.frameWidth : 0})`,
    '--m-frame-bg': m.showFrame ? m.frameBg : 'transparent',
    '--m-body-font': font(m.bodyFont),
    '--m-body-size': `calc(var(--pt) * ${m.bodySize})`,
    '--m-line-height': String(m.lineHeight),
    '--m-text': m.textColor,
    '--m-accent': m.accentColor,
    '--m-head-bg': m.headingBg,
    '--m-head-color': m.headingColor,
    '--m-head-accent': m.headingAccent,
    '--m-head-size': `calc(var(--pt) * ${m.headingSize})`,
    '--m-th-bg': m.tableHeadBg,
    '--m-th-color': m.tableHeadColor,
    '--m-th-accent': m.tableAccent,
    '--m-row-alt': m.rowAlt,
    '--m-table-size': `calc(var(--pt) * ${m.tableSize})`,
    '--m-foot-color': m.footerColor,
    '--m-foot-size': `calc(var(--pt) * ${m.footerSize})`,
    '--m-toc-part': m.tocPartBg,
    '--m-rule-color': m.ruleColor,
    '--m-rule-gap': `calc(var(--mm) * ${m.ruleGap})`,
    '--m-note-size': `calc(var(--pt) * ${m.noteSize})`,
    '--m-note-color': m.noteColor,
    '--m-school-color': m.schoolColor,
    '--m-subtitle-color': m.subtitleColor,
    '--m-motto-color': m.mottoColor,
  };
  return `.book-page[data-pt="${type}"]{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}`;
}

/** Pasang CSS master ke <head> secara serentak (sebelum pengukur halaman membaca saiz). */
export function applyMasterCss(resolve: (t: PageType) => MasterProps): void {
  if (typeof document === 'undefined') return;
  const css = pageTypes.map((p) => masterCss(p.id, resolve(p.id))).join('\n');
  let el = document.getElementById('bpps-master-css') as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = 'bpps-master-css';
    document.head.appendChild(el);
  }
  if (el.textContent !== css) el.textContent = css;
}
