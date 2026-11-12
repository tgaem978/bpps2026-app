/* Ringkasan perubahan halaman (semasa → cadangan) dalam bentuk baris teks yang mudah dibaca oleh pentadbir. */
import type { Block, SectionContent } from '@/types/book';
import { blockLabels } from '@/lib/blocks';
import { resolveMembers, resolveTokens, type BookCtx } from '@/lib/resolve';

const clean = (s: string) => s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();

/** Teks boleh baca bagi satu blok (satu baris = satu perkara). */
export function blockLines(b: Block, ctx: BookCtx): string[] {
  const L = blockLabels[b.type];
  switch (b.type) {
    case 'heading': return [`${L}: ${clean(b.text)}`];
    case 'paragraph': return b.text.split(/\n+/).map(clean).filter(Boolean);
    case 'list': return b.items.map((i) => `• ${clean(i)}`);
    case 'keyvalue': return b.pairs.map((p) => `${clean(p.key)}: ${clean(resolveTokens(p.value, ctx))}`);
    case 'table': return [`${L}: ${b.columns.join(' | ')}`, ...b.rows.map((r) => r.map(clean).join(' | '))];
    case 'image': return [`${L}: ${b.caption || (b.src.startsWith('data:') ? 'gambar dimuat naik' : b.src.split('/').pop())}`];
    case 'committee': return [
      ...(b.title ? [`${L}: ${clean(b.title)}`] : []),
      ...b.rows.map((r) => `${r.role}: ${resolveMembers(ctx, r.members).map((m) => m.name + (m.note ? ` (${m.note})` : '')).join(', ') || '—'}`),
    ];
    case 'orgchart': return b.levels.map((l) => `${L} · ${l.label}: ${l.positions.join(', ')}`);
    case 'orgtree': return b.columns.flatMap((c) => c.boxes.map((x) => `${c.position} › ${x.title}: ${x.items.filter(Boolean).join(', ')}`));
    case 'stafflist': return [`${L}: ${b.filterValues.join(', ') || 'semua'} · ${b.columns.join(', ')}`];
    case 'takwim': return b.rows.filter((r) => (r.span ?? '').trim() || r.cells.some((c) => c.trim())).map((r) => `${r.date}: ${clean(r.span || r.cells.filter(Boolean).join(' / '))}`);
  }
}

export interface SectionDiff {
  titleChanged: boolean;
  added: string[];
  removed: string[];
  blocks: { added: number; removed: number; changed: number };
  identical: boolean;
}

/** Bandingkan dua versi halaman: baris yang ditambah / dibuang dan bilangan blok berubah. */
export function diffSections(cur: SectionContent | undefined, next: SectionContent, ctx: BookCtx): SectionDiff {
  const before = (cur?.blocks ?? []).flatMap((b) => blockLines(b, ctx));
  const after = next.blocks.flatMap((b) => blockLines(b, ctx));
  const count = (arr: string[]) => arr.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map<string, number>());
  const a = count(before);
  const b = count(after);
  const added: string[] = [];
  const removed: string[] = [];
  for (const [line, n] of b) for (let i = 0; i < n - (a.get(line) ?? 0); i++) added.push(line);
  for (const [line, n] of a) for (let i = 0; i < n - (b.get(line) ?? 0); i++) removed.push(line);
  const oldById = new Map((cur?.blocks ?? []).map((x) => [x.id, x]));
  const newIds = new Set(next.blocks.map((x) => x.id));
  const blocks = {
    added: next.blocks.filter((x) => !oldById.has(x.id)).length,
    removed: (cur?.blocks ?? []).filter((x) => !newIds.has(x.id)).length,
    changed: next.blocks.filter((x) => oldById.has(x.id) && JSON.stringify(oldById.get(x.id)) !== JSON.stringify(x)).length,
  };
  const titleChanged = (cur?.title ?? '') !== next.title || (cur?.subtitle ?? '') !== next.subtitle;
  const identical = !titleChanged && !blocks.added && !blocks.removed && !blocks.changed && (cur?.layout ?? 'standard') === next.layout;
  return { titleChanged, added, removed, blocks, identical };
}

/** Ringkasan pendek untuk senarai. */
export const diffLabel = (d: SectionDiff) =>
  d.identical
    ? 'Tiada perubahan'
    : [d.titleChanged && 'tajuk diubah', d.blocks.changed && `${d.blocks.changed} blok diubah`, d.blocks.added && `${d.blocks.added} blok baharu`, d.blocks.removed && `${d.blocks.removed} blok dibuang`]
        .filter(Boolean)
        .join(' · ') || 'Format diubah';

