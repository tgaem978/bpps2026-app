/* KURIKULUM PERSEKOLAHAN 2027 (KP2027) — sub-bahagian Maklumat Am.
 * Semua infografik diambil daripada bahan rasmi Kementerian Pendidikan Malaysia:
 * "Kurikulum Persekolahan 2027" (PDF, portal KPM — https://www.moe.gov.my/kurikulum-persekolahan-2027).
 * Hak cipta infografik milik KPM; digunakan sebagai rujukan dalaman sekolah tanpa diubah. */
import type { Block, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

const BASE = import.meta.env.BASE_URL;
const img = (n: string) => `${BASE}content/kp2027/kp2027-${n}.jpg`;
export const KP2027_URL = 'https://www.moe.gov.my/kurikulum-persekolahan-2027';
const SUMBER = 'Sumber: Kementerian Pendidikan Malaysia (KPM), Kurikulum Persekolahan 2027 — portal rasmi KPM.';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text });
const sec = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: 'KP2027', layout: 'standard', updatedAt: null, blocks });

export const KP2027_IDS = ['ma-kp2027', 'ma-kp2027-2'] as const;

export function kp2027Sections(): Record<string, SectionContent> {
  return {
    'ma-kp2027': sec('KURIKULUM PERSEKOLAHAN 2027', [
      p('**Kurikulum Persekolahan 2027 (KP2027)** dilaksanakan secara berperingkat oleh KPM bermula dengan **Prasekolah 2027, Tahun 1 dan Tingkatan 1 pada sesi 2027**. Matlamatnya ialah melahirkan **Insan Sejahtera** melalui kurikulum yang menggabungkan pendekatan berasaskan standard dan berorientasikan kompetensi.'),
      {
        id: uid(), type: 'image', src: img('matlamat'), caption: '', height: 84, cols: 2,
        gallery: [
          { src: img('matlamat'), caption: 'Matlamat KP2027' },
          { src: img('kerangka'), caption: 'Kerangka KP2027' },
          { src: img('tahap-fokus'), caption: 'Tahap Persekolahan & Fokus' },
          { src: img('garis-masa'), caption: 'Garis Masa Pelaksanaan' },
        ],
      },
      p(SUMBER),
    ]),
    'ma-kp2027-2': sec('KURIKULUM PERSEKOLAHAN 2027', [
      h('PENDEKATAN BAHARU DALAM KP2027'),
      {
        id: uid(), type: 'image', src: img('reka-bentuk'), caption: '', height: 78, cols: 2,
        gallery: [
          { src: img('reka-bentuk'), caption: 'Reka Bentuk Kurikulum' },
          { src: img('karakter'), caption: 'Pembentukan Karakter' },
          { src: img('literasi-numerasi'), caption: 'Penekanan Literasi & Numerasi' },
          { src: img('kelas-bersepadu'), caption: 'Kelas Pembelajaran Bersepadu' },
        ],
      },
      {
        id: uid(), type: 'image', src: `${BASE}content/kp2027/qr-kp2027-kpm.png`, caption: '', height: 30,
        aside: [{ title: 'IMBAS UNTUK MAKLUMAT RASMI KP2027', tone: 'navy', text: `Portal rasmi KPM — dokumen & infografik Kurikulum Persekolahan 2027:\n**${KP2027_URL.replace('https://', '')}**` }],
      },
      p(SUMBER),
    ]),
  };
}
