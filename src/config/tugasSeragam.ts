/* Bidang Tugas seragam: perenggan berbaris (satu tugas satu baris) ditukar kepada format yang sama dengan Bidang Tugas lain —
 * subtajuk tebal / ayat pengenalan sebagai perenggan, dan tugas sebagai senarai bernombor. */
import type { Block, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

export const TUGAS_IDS = ['bidang-tugas-guru', 'bidang-tugas-akp'];
const isSub = (l: string) => /^\*\*[^*]+\*\*$/.test(l) || /:-?\s*$/.test(l);

/** Satu perenggan berbaris → [perenggan subtajuk / pengenalan] + [senarai bernombor] berselang-seli. */
export function perengganKeSenarai(text: string): Block[] {
  const out: Block[] = [];
  let items: string[] = [];
  const flush = () => { if (items.length) out.push({ id: uid(), type: 'list', ordered: true, items }); items = []; };
  for (const raw of text.split('\n')) {
    const l = raw.trim();
    if (!l || l === '.') { flush(); continue; }
    if (isSub(l)) { flush(); out.push({ id: uid(), type: 'paragraph', align: 'left', text: /^\*\*/.test(l) ? l : `**${l}**` }); continue; }
    const sub = l.match(/^[-–•]\s*(.+)$/) ?? l.match(/^[A-E]\)\s*(.+)$/);
    if (sub && items.length) { items[items.length - 1] += `\n${String.fromCharCode(97 + (items[items.length - 1].split('\n').length - 1))}) ${sub[1]}`; continue; }
    items.push(l.replace(/^\d+\.\s*/, '').replace(/^[-–•]\s*/, ''));
  }
  flush();
  return out;
}

export function seragamTugas(sec: SectionContent): SectionContent {
  return {
    ...sec,
    blocks: sec.blocks.flatMap((b) => (b.type === 'paragraph' && b.text.split('\n').filter((x) => x.trim()).length > 1 ? perengganKeSenarai(b.text) : [b])),
  };
}

export const tugasSections = (all: Record<string, SectionContent>): Record<string, SectionContent> =>
  Object.fromEntries(TUGAS_IDS.filter((id) => all[id]).map((id) => [id, seragamTugas(all[id])]));
