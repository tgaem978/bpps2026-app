/* KURIKULUM PERSEKOLAHAN 2027 (KP2027) — sub-bahagian Maklumat Am.
 * Satu halaman = satu infografik, dilukis dengan gaya & tema sistem (bukan imej luar).
 * Semua teks dipetik daripada bahan rasmi Kementerian Pendidikan Malaysia:
 * "Kurikulum Persekolahan 2027" (portal KPM — https://www.moe.gov.my/kurikulum-persekolahan-2027).
 * Infografik asal KPM disimpan dalam public/content/kp2027/ sebagai rujukan. */
import type { InfographicBlock, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

const BASE = import.meta.env.BASE_URL;
export const KP2027_URL = 'https://www.moe.gov.my/kurikulum-persekolahan-2027';
const SUMBER = 'Sumber: Kementerian Pendidikan Malaysia, **Kurikulum Persekolahan 2027** (portal rasmi KPM).';

export const KP2027_IDS = ['ma-kp2027', 'ma-kp2027-2', 'ma-kp2027-3', 'ma-kp2027-4', 'ma-kp2027-5'] as const;

const ig = (b: Omit<InfographicBlock, 'id' | 'type'>): InfographicBlock => ({ id: uid(), type: 'infographic', source: SUMBER, ...b });
const sec = (b: InfographicBlock): SectionContent => ({ title: 'KURIKULUM PERSEKOLAHAN 2027', subtitle: 'KP2027', layout: 'standard', updatedAt: null, blocks: [b] });

export function kp2027Sections(): Record<string, SectionContent> {
  return {
    'ma-kp2027': sec(ig({
      variant: 'goals', kicker: 'KP2027 · 01', title: 'MATLAMAT KURIKULUM PERSEKOLAHAN 2027',
      intro: 'KP2027 dilaksanakan secara berperingkat bermula sesi 2027 dengan matlamat melahirkan **Insan Sejahtera**.',
      center: 'INSAN SEJAHTERA',
      items: [
        { label: '', text: 'Mengamalkan **kehidupan yang seimbang** dalam segala aspek kehidupan.' },
        { label: '', text: 'Membudayakan **pembelajaran sepanjang hayat**.' },
        { label: '', text: 'Menghargai **perpaduan** dan keharmonian serta **menghormati kepelbagaian**.' },
        { label: '', text: 'Menjadi **warganegara yang beradab dan bertanggungjawab**.' },
        { label: '', text: '**Berdaya saing** pada peringkat global.' },
      ],
    })),
    'ma-kp2027-2': sec(ig({
      variant: 'framework', kicker: 'KP2027 · 02', title: 'KERANGKA KURIKULUM PERSEKOLAHAN 2027',
      intro: 'Kerangka KP2027 meletakkan **Insan Sejahtera** di tengah, dikelilingi teras **Adab, Pengetahuan dan Kemahiran**, tujuh elemen, serta komponen **Kandungan, Pedagogi dan Pentaksiran**.',
      center: 'INSAN\nSEJAHTERA',
      inner: ['ADAB', 'PENGETAHUAN', 'KEMAHIRAN'],
      ring: ['KANDUNGAN', 'PEDAGOGI', 'PENTAKSIRAN'],
      items: [
        { label: 'Pembelajaran Sepanjang Hayat', text: '' },
        { label: 'Perkembangan Diri', text: '' },
        { label: 'Komunikasi', text: '' },
        { label: 'Tanggungjawab', text: '' },
        { label: 'Fasih Digital', text: '' },
        { label: 'Literasi Pelbagai', text: '' },
        { label: 'Kemahiran Berfikir', text: '' },
      ],
      notes: [
        { label: 'Teras', text: 'Adab · Pengetahuan · Kemahiran' },
        { label: '7 Elemen', text: 'Pembelajaran Sepanjang Hayat · Perkembangan Diri · Komunikasi · Tanggungjawab · Fasih Digital · Literasi Pelbagai · Kemahiran Berfikir' },
        { label: 'Komponen', text: 'Kandungan · Pedagogi · Pentaksiran' },
      ],
    })),
    'ma-kp2027-3': sec(ig({
      variant: 'stages', kicker: 'KP2027 · 03', title: 'TAHAP PERSEKOLAHAN DAN FOKUS KURIKULUM 2027',
      intro: 'Setiap tahap persekolahan mempunyai fokus tersendiri — dan **pembentukan karakter** merentasi semua tahap.',
      items: [
        { label: 'PRASEKOLAH', note: '', text: 'Kemahiran **berkomunikasi, bersosialisasi** dan **pembentukan karakter**.' },
        { label: 'TAHAP 1', note: 'Tahun 1 & Tahun 2', text: 'Penguasaan **literasi dan numerasi** serta **pembentukan karakter**.' },
        { label: 'TAHAP 2', note: 'Tahun 3 & Tahun 4', text: 'Aplikasi **kemahiran, pengetahuan dan nilai** serta **pembentukan karakter**.' },
        { label: 'TAHAP 3', note: 'Tahun 5 & Tahun 6', text: 'Kemahiran **menganalisis dan menghasilkan inovasi** serta **pembentukan karakter**.' },
        { label: 'MENENGAH RENDAH', note: 'Tingkatan 1 – 3', text: 'Meneroka pelbagai bidang ilmu dan didorong **mengenali minat dan potensi diri** termasuk **perkembangan bakat** serta **pembentukan karakter**.' },
        { label: 'MENENGAH ATAS', note: 'Tingkatan 4 & 5', text: 'Mengikuti laluan **bidang yang ingin diceburi ke peringkat pengajian tinggi** dan **pembentukan karakter**.' },
      ],
    })),
    'ma-kp2027-4': sec(ig({
      variant: 'approaches', kicker: 'KP2027 · 04', title: 'PENDEKATAN BAHARU DALAM KURIKULUM PERSEKOLAHAN 2027',
      intro: 'KP2027 menggabungkan kurikulum **berasaskan standard** dan **berorientasikan kompetensi**, melalui tiga pendekatan baharu.',
      items: [
        {
          label: 'Pembentukan Karakter', icon: 'heart',
          text: 'Membentuk individu yang dapat menyumbang kepada pembentukan **warganegara Malaysia yang sejahtera**.\nBerfokuskan kepada **pembelajaran sosioemosi** agar murid bersedia dan berfikiran positif dalam pembelajaran.\nBermula dari **prasekolah sehingga ke peringkat menengah atas**.\nPelaksanaan melalui **slot masa yang khusus** dalam jadual waktu.',
        },
        {
          label: 'Penekanan kepada Literasi dan Numerasi', icon: 'abc',
          text: 'Memastikan murid seawal persekolahan menguasai kemahiran asas **membaca, menulis dan mengira (3M)**.\n**Intervensi awal** akan diberikan bagi membantu murid yang menghadapi masalah menguasai kemahiran literasi dan numerasi.\nMeningkatkan kesediaan mengikuti pembelajaran pada tahap seterusnya.',
        },
        {
          label: 'Kelas Pembelajaran Bersepadu', icon: 'puzzle',
          text: 'Bermula di **sekolah rendah** dan dimasukkan dalam jadual waktu.\nPendekatan PdP yang **menggabungkan kandungan dan kemahiran dari pelbagai disiplin ilmu** ke arah pengalaman pembelajaran bermakna.\nPembelajaran murid menjadi lebih **holistik, relevan dan berhubung kait dengan dunia sebenar**.',
        },
      ],
    })),
    'ma-kp2027-5': sec(ig({
      variant: 'timeline', kicker: 'KP2027 · 05', title: 'GARIS MASA PELAKSANAAN KURIKULUM PERSEKOLAHAN 2027',
      intro: 'KP2027 dilaksanakan secara berperingkat. Pada sesi 2027, murid **Prasekolah** dan **Tahun 1** di SK Bandar Tasik Selatan mula mengikuti kurikulum baharu.',
      items: [
        { label: '2025', text: '**Penyebaran Kurikulum**' },
        { label: '2026', text: '**Pelaksanaan Kurikulum Prasekolah**' },
        { label: '2027', text: '**Pelaksanaan Kurikulum**\nPrasekolah 2027\nTahun 1\nTingkatan 1' },
      ],
      qr: `${BASE}content/kp2027/qr-kp2027-kpm.png`,
      qrLabel: 'Imbas untuk dokumen & maklumat rasmi KP2027 — moe.gov.my/kurikulum-persekolahan-2027',
    })),
  };
}
