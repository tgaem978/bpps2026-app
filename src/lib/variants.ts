/* Varian paparan blok mengikut jirannya (cth. kad selepas tajuk VISI, bulan kalendar padat).
 * Dikira dengan cara yang SAMA oleh pengukur penomboran dan oleh paparan, supaya tinggi yang diukur = tinggi sebenar. */
import type { AnyBlock, TableBlock } from '@/types/book';

/** Tajuk yang dipaparkan sebagai reben berpusat diikuti kad (gaya Visi / Misi / Objektif). */
export const PANEL_HEADINGS = /^(VISI|MISI|MOTO|MOTTO|SLOGAN|OBJEKTIF|MATLAMAT|FALSAFAH|PIAGAM PELANGGAN|TEMA|IKRAR)\b/i;

/** Jadual kalendar bulanan (lajur I S R K J S A). */
export const isCalendarTable = (b: AnyBlock | undefined): b is TableBlock =>
  !!b && b.type === 'table' && b.columns.length === 7 && b.columns.map((c) => c.trim().toUpperCase()).join('') === 'ISRKJSA';

/** Teks yang seluruhnya "[ … ]" = ruang untuk diisi (placeholder). */
export const PLACEHOLDER = /^\[\s+([^\]\n]+?)\s+\]$/;
export const isPlaceholder = (text: string) => PLACEHOLDER.test(text.trim());
export const placeholderLabel = (text: string) => text.trim().match(PLACEHOLDER)?.[1] ?? text;

export type BlockVariant = '' | 'panel' | 'panel-soft' | 'cal' | 'cal-head';

/**
 * - 'panel'      : perenggan pendek selepas tajuk panel → kad navy (pernyataan visi / misi / moto);
 * - 'panel-soft' : senarai / maklumat / teks panjang selepas tajuk panel → kad cerah berbingkai emas;
 * - 'cal-head'   : nama bulan di atas jadual kalendar; 'cal' : jadual kalendar itu sendiri.
 */
export function blockVariants(blocks: AnyBlock[]): BlockVariant[] {
  return blocks.map((b, i): BlockVariant => {
    const prev = blocks[i - 1];
    const next = blocks[i + 1];
    if (isCalendarTable(b)) return 'cal';
    if (b.type === 'heading' && isCalendarTable(next)) return 'cal-head';
    if (prev?.type === 'heading' && PANEL_HEADINGS.test(prev.text.trim())) {
      if (b.type === 'paragraph') return b.text.length <= 320 ? 'panel' : 'panel-soft';
      if (b.type === 'list' || b.type === 'keyvalue') return 'panel-soft';
    }
    return '';
  });
}
