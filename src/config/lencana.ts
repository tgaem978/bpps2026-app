/* Halaman LENCANA SEKOLAH: lencana berpenanda nombor (1-9) + maksud setiap elemen, warna dan bentuk.
 * Tafsiran ialah DRAF berdasarkan simbolisme lazim lencana sekolah — sila sahkan dengan rekod rasmi sekolah. */
import type { Block, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

const BASE = import.meta.env.BASE_URL;
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });

/** Kedudukan penanda (peratus lebar / tinggi imej lencana yang dipotong) — sepadan dengan BIL. jadual elemen. */
export const LENCANA_PINS = [
  { n: 1, x: 10.4, y: 13.3 }, { n: 2, x: 27.6, y: 17.6 }, { n: 3, x: 59.9, y: 28.8 },
  { n: 4, x: 26.4, y: 52.1 }, { n: 5, x: 50, y: 84.5 }, { n: 6, x: 23.1, y: 65.1 },
  { n: 7, x: 1.6, y: 49.5 }, { n: 8, x: 74.2, y: 34 }, { n: 9, x: 4.9, y: 81.9 },
];

const ELEMEN: [string, string][] = [
  ['Gerbang hijau & nama sekolah', 'Pintu masuk ke alam ilmu dan kejayaan; identiti dan kesepaduan warga SKBTS.'],
  ['Angka tahun 2001', 'Penanda sejarah sekolah — mengingatkan asal-usul dan perjalanan SKBTS.'],
  ['Obor (api merah)', 'Semangat membara menimba ilmu dan cahaya yang menerangi jalan kecemerlangan.'],
  ['Buku terbuka', 'Ilmu sebagai teras pendidikan; sekolah ialah gedung ilmu yang sentiasa terbuka.'],
  ['Simbol atom', 'Sains, teknologi dan inovasi (STEM) serta kemahiran berfikir aras tinggi.'],
  ['Dua atlet berlari', 'Sukan dan kokurikulum — murid yang sihat, cergas dan seimbang (JERI).'],
  ['Dua tiang gerbang', 'Asas yang kukuh: kepimpinan, guru dan ibu bapa yang menyokong murid.'],
  ['Perisai biru & kuning', 'Perlindungan dan keseimbangan — perpaduan bertemu kecemerlangan.'],
  ['Reben hijau bermoto', 'Moto "Berwawasan, Tekun, Bersemangat" — pegangan setiap warga sekolah.'],
];

const WARNA: [string, string, string][] = [
  ['#38B74F', 'HIJAU', 'Kesuburan, keharmonian dan pertumbuhan ilmu'],
  ['#DF2028', 'MERAH', 'Keberanian, semangat juang dan kesungguhan'],
  ['#07285D', 'BIRU TUA', 'Perpaduan, ketenangan dan keyakinan diri'],
  ['#FFF100', 'KUNING', 'Kedaulatan, kemuliaan dan kecemerlangan'],
  ['#FFFFFF', 'PUTIH', 'Kesucian hati, keikhlasan dan kejujuran'],
];

export function lencanaSection(): SectionContent {
  return {
    title: 'LENCANA SEKOLAH',
    subtitle: '',
    layout: 'standard',
    updatedAt: null,
    blocks: [
      {
        id: uid(), type: 'image', src: `${BASE}content/logo-skbts-lencana.png`, caption: '', height: 82, pins: LENCANA_PINS,
        aside: [
          { title: 'FALSAFAH LENCANA', tone: 'navy', text: 'SKBTS ialah gerbang ilmu yang berdiri di atas asas yang kukuh. Ilmu, semangat, sains dan sukan disatukan untuk melahirkan murid yang **berwawasan, tekun dan bersemangat** — **SKBTS: School of Champions**.' },
          { title: 'BENTUK LENCANA', tone: 'soft', text: '**Gerbang bertiang** — pintu masuk ke dunia ilmu yang terbuka kepada semua murid.\n**Perisai** — perlindungan, ketahanan dan maruah warga sekolah.\n**Reben melengkung** — ikatan dan penyatuan warga sekolah di bawah satu moto.' },
        ],
      },
      h('ELEMEN LENCANA'),
      { id: uid(), type: 'table', style: 'navy', numbered: true, columns: ['ELEMEN', 'MAKSUD'], rows: ELEMEN.map(([e, m]) => [`**${e}**`, m]), colWidths: [30, 70], colAlign: ['left', 'left'] },
      h('WARNA LENCANA'),
      // satu lajur bagi setiap warna: petak warna + maksud (padat, sebaris)
      { id: uid(), type: 'table', style: 'navy', numbered: false, columns: WARNA.map(([, n]) => n), rows: [WARNA.map(([c, , m]) => `[[warna:${c}]]\n${m}`)], colAlign: WARNA.map(() => 'center' as const) },
    ],
  };
}
