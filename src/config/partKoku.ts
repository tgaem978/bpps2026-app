/* Bahagian Pengurusan Kokurikulum: maklumat asas (slaid 1–11 "LATEST_KOKURIKULUM_V3"), jawatankuasa induk (carta templat PPKI)
 * dan halaman jawatankuasa unit daripada PDF "JAWATANKUASA KOKURIKULUM v2" (halaman penuh). */
import type { Block, CommitteeRow, MemberRef, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { partAStaff } from '@/config/partA';

const BASE = import.meta.env.BASE_URL;
const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const sec = (title: string, subtitle: string, blocks: Block[], layout: SectionContent['layout'] = 'standard'): SectionContent => ({
  title, subtitle, layout, blocks, updatedAt: null,
});

/* ---- Padanan nama → guru (ejaan boleh berbeza sedikit) ---- */
const squash = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, '');
const words = (s: string) => new Set(s.toUpperCase().replace(/[^A-Z ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !['BIN', 'BINTI', 'BT'].includes(w)));
function member(name: string): MemberRef {
  const target = squash(name);
  let i = partAStaff.findIndex((s) => squash(s.nama) === target);
  if (i < 0) {
    const tw = words(name);
    let best = 0;
    partAStaff.forEach((s, idx) => {
      const sw = words(s.nama);
      let hit = 0;
      tw.forEach((w) => { if (sw.has(w)) hit++; });
      const score = hit / Math.max(tw.size, sw.size, 1);
      if (score > best) { best = score; i = idx; }
    });
    if (best < 0.7) i = -1;
  }
  return i >= 0 ? { kind: 'teacher', id: `t${i + 1}` } : { kind: 'text', value: name };
}
const row = (role: string, ...names: string[]): CommitteeRow => ({ id: uid(), role, members: names.map(member) });
const posRow = (role: string, ...positions: string[]): CommitteeRow => ({
  id: uid(), role, members: positions.map((value): MemberRef => ({ kind: 'position', value })),
});

/* ---- Jawatankuasa & senarai ahli unit: disalin terus daripada PDF "JAWATANKUASA KOKURIKULUM v2" (rujukan terkini) ----
 * Nama ditulis sebagai teks seperti dalam PDF (ejaan & tanda (K) ketua dikekalkan), bukan dipadankan ke Pangkalan Data Guru.
 * Ketua unit ditebalkan dengan penanda **nama** (disokong Rich dalam sel jadual). */
const txt = (...v: string[]): MemberRef[] => v.map((value) => ({ kind: 'text', value }));
const cmRow = (role: string, ...names: string[]): CommitteeRow => ({ id: uid(), role, members: txt(...names) });

/** Barisan JK yang sama bagi ketiga-tiga unit; hanya Penyelaras / Pen. Penyelaras berbeza. */
const jkUnit = (title: string, pen: [string, string], penPen: [string, string]): Block => ({
  id: uid(), type: 'committee', title,
  rows: [
    cmRow('Pengerusi', 'SHAMSUKAMAL BIN ANIFAR'),
    cmRow('Naib Pengerusi I', 'MUHAMMAD RIZAL BIN CHE DIN'),
    cmRow('Naib Pengerusi II', 'ZALEHA BINTI YUSOH'),
    cmRow('Naib Pengerusi III', 'HASRE ADHA BIN MOHD HASSAN'),
    cmRow('Naib Pengerusi IV', 'VINCENT NATHAN A/L IRATHAYA SAMI'),
    cmRow('Naib Pengerusi V', 'SYAHIDA BINTI MOHAMED MOKHTAR'),
    cmRow('Setiausaha', 'WAN NOOR HILWANI BINTI WAN MOHAMED'),
    cmRow('Naib Setiausaha I', 'NURASYAHIRA BINTI BASIRUN'),
    cmRow('Naib Setiausaha II', 'FATIMAH BINTI AB LATIF'),
    cmRow('Penyelaras', ...pen),
    cmRow('Pen. Penyelaras', ...penPen),
    cmRow('Ahli Jawatankuasa', 'SEMUA GURU PENASIHAT'),
  ],
});

/** Jadual senarai nama (dipusatkan seperti PDF). Ketua: nama bertanda (K)/(P), atau baris pertama jika `boldFirst`. */
const nameTable = (columns: string[], rows: string[][], boldFirst: boolean): Block => ({
  id: uid(), type: 'table', style: 'navy', numbered: false, align: 'center', columns,
  rows: rows.map((r, ri) => r.map((c) => (c && ((boldFirst && ri === 0) || /\((K|P)\)/.test(c)) ? `**${c}**` : c))),
});

/** Satu unit: tajuk + jadual dua lajur (sesi pagi / petang). */
const unitSesi = (name: string, pagi: string[], petang: string[], boldFirst = false): Block[] => {
  const n = Math.max(pagi.length, petang.length);
  return [h(name), nameTable(['SESI PAGI', 'SESI PETANG'], Array.from({ length: n }, (_, i) => [pagi[i] ?? '', petang[i] ?? '']), boldFirst)];
};

/** Beberapa unit tanpa sesi yang bersebelahan: nama unit menjadi kepala lajur. */
const unitSebelah = (names: string[], lists: string[][]): Block =>
  nameTable(names, Array.from({ length: Math.max(...lists.map((l) => l.length)) }, (_, i) => lists.map((l) => l[i] ?? '')), false);

/* ---- Halaman pembahagi (tajuk sahaja) daripada PDF ---- */
const pdfPage = (no: string, title: string): SectionContent => ({
  title, subtitle: 'KOKURIKULUM', layout: 'standard', updatedAt: null,
  blocks: [{ id: `kokurikulum-${no}`, type: 'image', src: `${BASE}kokurikulum/pg-${no}.jpg`, caption: '', fullPage: true }],
});
const ppkiPage = (file: string, title: string): SectionContent => ({
  title, subtitle: 'PPKI', layout: 'standard', updatedAt: null,
  blocks: [{ id: `ppki-${file}`, type: 'image', src: `${BASE}ppki/${file}.jpg`, caption: '', fullPage: true }],
});

const img = (file: string, caption: string, height?: number): Block => ({ id: uid(), type: 'image', src: `${BASE}kokurikulum/${file}`, caption, height });
const tbl = (columns: string[], rows: string[][]): Block => ({ id: uid(), type: 'table', style: 'navy', numbered: false, columns, rows });
const ADMINS: string[][] = [
  ['PENGERUSI', 'SHAMSUKAMAL BIN ANIFAR (GURU BESAR)'],
  ['NAIB PENGERUSI', 'MUHAMMAD RIZAL BIN CHE DIN (GPK KOKURIKULUM)'],
  ['', 'ZALEHA BINTI YUSOH (GPK PENTADBIRAN)'],
  ['', 'HASRE ADHA BIN MOHD HASSAN (GPK HEM)'],
  ['', 'VINCENT NATHAN A/L IRATHAYA SAMI (GPK PETANG)'],
  ['', 'SYAHIDA BINTI MOHAMED MOKHTAR (GPK PPKI)'],
];
const khas = (title: string, rest: string[][]): SectionContent => sec(title, 'JAWATANKUASA KHAS KOKURIKULUM', [tbl(['JAWATAN', 'NAMA'], [...ADMINS, ...rest])]);
const SUKAN_JK: string[][] = [
  ['PENGERUSI (GURU BESAR)', 'SHAMSUKAMAL BIN ANIFAR'],
  ['TIMBALAN PENGERUSI (GPK KOKURIKULUM)', 'MUHAMMAD RIZAL BIN CHE DIN'],
  ['NAIB PENGERUSI I (GPK PENTADBIRAN)', 'ZALEHA BINTI YUSOH'],
  ['NAIB PENGERUSI II (GPK HEM)', 'HASRE ADHA BIN MOHD HASSAN'],
  ['NAIB PENGERUSI III (GPK PETANG)', 'VINCENT NATHAN A/L IRATHAYA SAMI'],
  ['NAIB PENGERUSI IV (GPK PPKI)', 'SYAHIDA BINTI MOHAMED MOKHTAR'],
  ['SETIAUSAHA SUKAN & 1M1S', 'MUHAMAD ALIFF BIN KAMAL AFFANDI'],
  ['NAIB SETIAUSAHA SUKAN 1 & 1M1S', 'SAHRULLIZAM BIN LIAS'],
  ['NAIB SETIAUSAHA SUKAN 2 & 1M1S', 'MOHD ZULFADLI BIN YUSOF'],
];
const rumah = (nama: string, key: string): SectionContent => sec(`RUMAH ${nama}`, 'RUMAH SUKAN', [
  h('Sesi Pagi'), img(`rumah-${key}-pagi.png`, '', 100),
  h('Sesi Petang'), img(`rumah-${key}-petang.png`, '', 100),
]);

export const kokuTopics = (): OutlineTopic[] => [
  { id: 'kk-aluan', children: [] },
  { id: 'kk-pengenalan', children: [] },
  { id: 'kk-visi-misi', children: [] },
  { id: 'kk-piagam', children: [] },
  { id: 'kk-dasar', children: [] },
  { id: 'kk-strategi', children: [] },
  { id: 'kk-polisi-spi', children: ['kk-polisi', 'kk-polisi-2'] },
  { id: 'kk-jk-induk', children: [] },
  { id: 'kk-tugas', children: [] },
  { id: 'kk-jk-02', children: ['kk-jk-03', 'kk-jk-04', 'kk-jk-05'] },
  { id: 'kk-jk-06', children: ['kk-jk-07', 'kk-jk-08', 'kk-jk-09'] },
  { id: 'kk-jk-10', children: ['kk-jk-11', 'kk-jk-12', 'kk-jk-13'] },
  { id: 'kk-pembangunan-sukan', children: ['kk-pasukan-1', 'kk-pasukan-2', 'kk-pasukan-3'] },
  { id: 'kk-rumah-sukan', children: ['kk-rumah-biru', 'kk-rumah-hijau', 'kk-rumah-kuning', 'kk-rumah-merah', 'kk-rumah-ungu'] },
  { id: 'kk-khas', children: ['kk-khas-1', 'kk-khas-2', 'kk-khas-3', 'kk-khas-4', 'kk-khas-5'] },
  { id: 'kk-takwim', children: [] },
];


export const ppkiChildren = ['pk-jpks', 'pk-carta', 'pk-jk-induk'];

export const partKokuSections = (): Record<string, SectionContent> => ({
  'kk-pengenalan': sec('PENGENALAN UNIT KOKURIKULUM', 'KOKURIKULUM', [
    h('Takrif / Definisi Kokurikulum'),
    p('Warta Kerajaan bertarikh 28 Disember 1967, No. 5652 (Peraturan Kursus Pengajian) Sekolah 1956, mendefinisikan kokurikulum sebagai kegiatan kumpulan, manakala Warta Kerajaan bertarikh 31 Disember 1997, Jilid 41, No. 26, Tambahan No. 94, Perundangan P.U. (A) 531, Akta Pendidikan 1996, Peraturan-Peraturan (Kurikulum Kebangsaan) mendefinisikan kokurikulum seperti yang berikut: "kegiatan kokurikulum" ertinya apa-apa kegiatan yang dirancang lanjutan daripada proses pengajaran dan pembelajaran dalam bilik darjah yang memberikan murid peluang untuk menambah, mengukuh dan mengamalkan pengetahuan, kemahiran dan nilai yang dipelajari di bilik darjah.'),
    h('Kandungan Kegiatan Kokurikulum / Akta, Pekeliling dan Perundangan'),
    p('Kegiatan kokurikulum di sekolah kerajaan dan bantuan kerajaan akan mengandungi yang berikut:'),
    ul(['Penyertaan dalam sukan dan permainan', 'Penyertaan dalam persatuan dan kelab', 'Penyertaan dalam badan beruniform', 'Penyertaan lain sebagaimana ditentukan oleh Menteri']),
    p('Rujuk Sub Peraturan 3(3) dalam Peraturan-peraturan Pendidikan (Kurikulum Kebangsaan) 1997 yang diterbitkan sebagai P.U. (A) 531/97.'),
    p('Sebagai sebahagian daripada kurikulum kebangsaan, maka pelaksanaan kokurikulum di sekolah adalah wajib (rujuk seksyen 18, Akta Pendidikan 1996). Kegagalan atau keengganan melaksanakan kegiatan kokurikulum di sekolah adalah satu kesalahan dan apabila disabitkan boleh didenda tidak melebihi lima ribu ringgit atau penjara tidak melebihi enam bulan atau kedua-duanya. (Rujuk sub seksyen 135(1) Akta Pendidikan 1996, Akta 550)'),
    p('Jika kesalahan itu dilakukan berterusan, maka apabila disabitkan sedemikian, seseorang itu dikenakan hukuman denda harian yang tidak melebihi lima ratus ringgit sebagai tambahan kepada apa-apa penalti lain yang boleh dikenakan kepadanya di bawah akta ini berkenaan dengan kesalahan itu, bagi setiap hari kesalahan itu dilakukan. (Rujuk sub seksyen 135(2) Akta 550)'),
    p('Penyertaan murid dalam aktiviti kokurikulum adalah wajib. Sehubungan itu, kehadiran murid dalam aktiviti kokurikulum mestilah direkodkan. (Rujuk Surat Pekeliling Ikhtisas Bil. 2/1986, KP(BS)8591/Jld. 11(41) bertarikh 15 Januari 1986)'),
  ]),
  'kk-visi-misi': sec('VISI, MISI, OBJEKTIF & MATLAMAT', 'KOKURIKULUM', [
    h('Visi Unit Kokurikulum'),
    p('"Menjana kecemerlangan kokurikulum agar dapat bersaing di peringkat sekolah, daerah, negeri dan peringkat kebangsaan."'),
    h('Misi Unit Kokurikulum'),
    ul(['Mencungkil bakat dan kecemerlangan murid agar boleh bersaing di peringkat sekolah, daerah, negeri dan kebangsaan dalam semua aspek kokurikulum.', 'Menerapkan nilai-nilai positif tentang aktiviti kokurikulum di kalangan murid.', 'Menerapkan kefahaman yang jelas dan betul tentang tujuan kokurikulum di sekolah.', 'Menjadikan kokurikulum sebagai gedung mendidik minda ke arah pembentukan disiplin yang cemerlang.']),
    h('Objektif Unit Kokurikulum'),
    ul(['Mencungkil dan mengembangkan bakat, kebolehan dan kemahiran murid dalam sukan, permainan, unit beruniform serta persatuan dan kelab.', 'Mengasah minat, hobi atau kegemaran murid secara terancang, berhalatuju, sistematik dan bermanfaat.', 'Membantu, memastikan dan menaikkan imej sekolah di peringkat zon, daerah, negeri dan kebangsaan.', 'Membentuk murid yang berdisiplin dan mementingkan nilai kerjasama melalui aktiviti kokurikulum.']),
    h('Matlamat Unit Kokurikulum'),
    ul(['Merealisasikan matlamat yang terkandung dalam Falsafah Pendidikan Kebangsaan untuk melahirkan murid yang seimbang dalam aspek intelek, rohani, emosi dan jasmani.', 'Menyediakan ruang dan peluang kepada murid untuk mengembangkan bakat, minat dan potensi diri dalam semua bidang yang diceburi.']),
  ]),
  'kk-piagam': sec('PIAGAM PELANGGAN & STRATEGI', 'KOKURIKULUM', [
    h('Piagam Pelanggan Unit Kokurikulum'),
    ul(['Memastikan kegiatan kokurikulum merentasi kurikulum.', 'Menjadikan kokurikulum asas disiplin diri.', 'Memastikan murid dapat mengembangkan bakat daripada aktiviti yang dilakukan.', 'Melahirkan murid yang cerdas, aktif dan berketrampilan.', 'Melatih murid untuk membentuk karisma dan sikap bertanggungjawab.', 'Menjadikan murid lebih ceria dan bersedia.']),
    h('Strategi Unit Kokurikulum'),
    p('Untuk mencapai matlamat yang telah ditetapkan, beberapa strategi pelaksanaan perlu diikuti:'),
    ul([
      'Kegiatan kokurikulum dan akademik yang telah dijadualkan hendaklah seimbang. Aktiviti kokurikulum yang dirancang perlu bersesuaian dengan kurikulum.',
      'Pihak sekolah dari semasa ke semasa perlu menambah bilangan persatuan/kelab, sukan dan unit beruniform untuk memberi peluang kepada murid melibatkan diri secara aktif, sama ada secara individu atau kumpulan.',
      'Setiap murid diwajibkan menganggotai sekurang-kurangnya 3 aktiviti, iaitu satu daripada persatuan/kelab, satu daripada sukan/permainan dan satu daripada pasukan unit pakaian seragam.',
      'Setiap persatuan/kelab, sukan dan unit beruniform perlu merancang dengan teliti, menarik, kreatif dan berfaedah bagi aktiviti yang akan dijalankan. Aktiviti perlu dipelbagaikan seperti lawatan, khidmat masyarakat, latihan, kursus dan pertandingan, meliputi aktiviti rutin dan developmental.',
      'Bilangan perjumpaan sekurang-kurangnya 12 kali setahun dan setiap perjumpaan dipenuhi pelbagai aktiviti selama 2 jam (12 kali x 2 jam).',
      'Penglibatan, perkembangan, kemajuan dan pencapaian murid dalam kegiatan kokurikulum perlu dinilai dan direkodkan. Penghargaan hendaklah diberi kepada murid yang aktif dan banyak memberi sumbangan serta mengharumkan nama sekolah, sebagai insentif dan inspirasi kepada murid lain.',
      'Kehadiran murid dalam kokurikulum perlulah 80% atau sekurang-kurangnya 10 kali, bagi membolehkan menerima sijil atau dicatat rekod penglibatan kokurikulum dalam sijil berhenti sekolah/surat akuan.',
    ], true),
  ]),
  'kk-dasar': sec('DASAR UNIT KOKURIKULUM SEKOLAH', 'KOKURIKULUM', [
    ul([
      'Dasar kokurikulum sekolah adalah selaras dengan dasar sekolah.',
      'Aktiviti kokurikulum adalah sebahagian daripada kurikulum sekolah.',
      'Pelaksanaan aktiviti kokurikulum di sekolah adalah wajib.',
      'Setiap murid (Tahun 3 hingga 6) wajib menyertai ketiga-tiga unit kokurikulum, iaitu satu kelab sukan/permainan, satu badan beruniform, dan satu persatuan akademik atau kelab bukan akademik.',
      'Murid diwajibkan menyertai aktiviti 1 Murid 1 Sukan (1M1S) dan program kokurikulum yang dianjurkan oleh pihak sekolah.',
      'Hari Rabu pada setiap minggu merupakan hari kokurikulum.',
      'Pada hari Rabu, murid diwajibkan memakai pakaian seragam lengkap, T-shirt badan beruniform atau T-shirt Khas Kokurikulum sekolah.',
      'Penyelaras unit berkenaan bertanggungjawab menyelaraskan perjalanan aktiviti pada hari tersebut.',
      'Waktu pelaksanaan aktiviti kokurikulum ialah 10.30 pagi hingga 12.00 tengah hari (sesi petang) dan 1.30 petang hingga 3.30 petang (sesi pagi). Murid tidak dibenarkan pulang sehingga tamat aktiviti kokurikulum.',
      'Murid yang melanggar peraturan yang ditetapkan atau sengaja ponteng aktiviti kokurikulum akan dikenakan tindakan tegas, selaras dengan peraturan sekolah.',
      'Guru penasihat perlu berada tepat pada jam 10.30 pagi (sesi petang) dan 1.30 petang (sesi pagi) untuk melaksanakan program kokurikulum seperti yang dirancang dan bertanggungjawab terhadap murid sepanjang aktiviti berjalan.',
      'Guru tidak dibenarkan mengadakan jadual pengiliran hari bertugas untuk setiap aktiviti kokurikulum.',
      'Aktiviti yang telah dijalankan hendaklah dilaporkan dalam Google Form yang disediakan.',
      'Laporan aktiviti perlu diisi setiap kali selepas aktiviti untuk semakan.',
      'PK Kokurikulum, PK HEM, Guru Kanan Mata Pelajaran dan penyelaras unit kokurikulum bertanggungjawab menyelia dan memantau perjalanan aktiviti kokurikulum pada setiap minggu.',
    ], true),
  ]),
  'kk-strategi': sec('STRATEGI PELAKSANAAN UNIT KOKURIKULUM', 'KOKURIKULUM', [
    ul([
      'Matlamat gerak kerja kokurikulum yang dikehendaki ialah penyertaan oleh setiap murid di sekolah kerajaan atau bantuan kerajaan. Setiap murid hendaklah mengambil bahagian sekurang-kurangnya dalam satu gerak kerja badan beruniform, satu kegiatan persatuan atau kelab dan satu kegiatan sukan atau permainan. (Rujuk Subperkara 5.1, Surat Pekeliling Ikhtisas Bil. 1/1985, KP(BS)8591/Jld. 11(29) bertarikh 2 Januari 1985)',
      'Penyertaan semua guru adalah dikehendaki bagi memastikan keberkesanan pelaksanaan gerak kerja kokurikulum di sekolah. (Rujuk Subperkara 5.2, Surat Pekeliling Ikhtisas Bil. 1/1985)',
      'Sekolah yang kurang kemudahan hendaklah menggalakkan murid mengambil bahagian dalam kerja amal untuk masyarakat setempat, bergotong-royong memperbaiki kawasan sekolah, dan pelbagai gerak kerja yang menekankan perpaduan kaum, ketatanegaraan, moral dan sebagainya yang sesuai bagi pendidikan menyeluruh dan pembentukan keperibadian. (Rujuk Subperkara 5.3, Surat Pekeliling Ikhtisas Bil. 1/1985)',
      'Pelaksanaan kegiatan kokurikulum hendaklah berasaskan prinsip penyertaan beramai-ramai tanpa unsur diskriminasi atau paksaan dan yang bercanggah dengan dasar Pendidikan Kebangsaan dan Perlembagaan Negara. (Rujuk Surat Pekeliling Ikhtisas Bil. 16/2000, KP(BS)8591/Jld. XVI(16) bertarikh 13 November 2000)',
      'Penyertaan murid dalam aktiviti kokurikulum adalah wajib dan kehadiran mestilah direkodkan. (Rujuk Surat Pekeliling Ikhtisas Bil. 1/1986, KP(BS)8591/Jld. 11(41) bertarikh 15 Januari 1986)',
      'Kegiatan kokurikulum boleh juga dilaksanakan dengan menggunakan penglibatan dan kepakaran anggota masyarakat setempat. (Rujuk Subperkara 5.2.3, Surat Pekeliling Ikhtisas Bil. 4/1985, KP.8591-11(32) bertarikh 2 Februari 1985)',
    ], true),
  ]),
  'kk-polisi-spi': sec('POLISI KESELAMATAN UNIT KOKURIKULUM', 'KOKURIKULUM', [
    p('Polisi ini harus dibaca bersama surat pekeliling ikhtisas berikut:'),
    {
      id: uid(), type: 'table', style: 'navy', numbered: false, columns: ['SURAT PEKELILING IKHTISAS', 'PERKARA'],
      rows: [
        ['Bil. 1/1989', 'Penyertaan Pelajar Dalam Kegiatan Sukan Di Sekolah'],
        ['Bil. 8/1996', 'Penyertaan Pelajar Dalam Pertandingan Kejohanan Sukan Anjuran Persatuan Atau Badan Induk Sukan'],
        ['Bil. 3/1995', 'Perlaksanaan Skim Takaful Kemalangan Diri Berkelompok Bagi Semua Pelajar Sekolah Kerajaan Dan Bantuan Kerajaan'],
        ['Bil. 25/1998 dan Bil. 3/1979', 'Pendidikan Jasmani'],
        ['Bil. 24/1988', 'Penglibatan Guru dan Murid Dalam Aktiviti Pasukan Pakaian Seragam Anjuran Agensi Kerajaan Dan Pertubuhan Bukan Kerajaan'],
        ['Bil. 25/1988', 'Perlaksanaan Pelajaran Pendidikan Jasmani Dan Pendidikan Kesihatan'],
        ['Bil. 9/2000 dan Bil. 1/1995', 'Panduan Keselamatan Diri Pelajar Semasa Pengajaran Pendidikan Jasmani Dan Kesihatan serta Kegiatan Kokurikulum Dan Sukan Di Luar Kawasan Sekolah'],
      ],
    },
    p('Catatan: Sila rujuk Polisi Keselamatan Kokurikulum Sekolah untuk mendapatkan keterangan lebih terperinci.'),
  ]),
  'kk-polisi': sec('POLISI KESELAMATAN: PENGENALAN & PERANAN', 'KOKURIKULUM', [
    h('Pengenalan'),
    p('Aktiviti kokurikulum merupakan sebarang aktiviti yang dijalankan di luar kelas yang tidak melibatkan waktu pembelajaran.'),
    h('Rasional'),
    p('SK Bandar Tasik Selatan bertanggungjawab menyediakan iklim sekolah yang selamat semasa aktiviti kokurikulum dijalankan. Warga sekolah terdedah dengan isu keselamatan fizikal dan semasa penggunaan peralatan sukan. Pengawasan yang rapi diperlukan sepanjang aktiviti dijalankan.'),
    h('Objektif'),
    ul(['Memastikan kegiatan ini bergerak selaras dengan matlamat yang telah ditetapkan oleh Kementerian Pendidikan Malaysia.', 'Mengelakkan berlakunya kemalangan semasa kokurikulum dijalankan.', 'Mendisiplinkan diri dalam melaksanakan aktiviti kokurikulum.', 'Memastikan pengurusan peralatan dan diri murid mengikut tatacara yang disediakan.']),
    h('Peranan Murid'),
    ul(['Melaporkan taraf kesihatan diri kepada guru.', 'Mengikut arahan guru/jurulatih sepanjang aktiviti dijalankan.', 'Melaporkan dengan segera sebarang masalah yang timbul sepanjang aktiviti dijalankan.', 'Mengikuti aktiviti yang dijalankan dengan mengutamakan aspek keselamatan.']),
    h('Peranan Jurulatih / Guru'),
    ul(['Memberikan kesedaran dan kefahaman kepada murid tentang pentingnya keselamatan diri semasa aktiviti kokurikulum melalui poster, perhimpunan mingguan, ceramah, bengkel, pengajaran dan pembelajaran dalam kelas, serta edaran.', 'Menerima aduan murid dan mengambil tindakan susulan.', 'Merekod semua aduan bagi sebarang insiden atau mereka yang disyaki mempunyai niat jahat.', 'Memaklumkan kepada ibu bapa dan pihak berkenaan.', 'Memanfaatkan sepenuhnya Jawatankuasa Permuafakatan, Jawatankuasa Keselamatan dan PIBG dalam merancang langkah keselamatan murid semasa aktiviti kokurikulum.']),
  ]),
  'kk-polisi-2': sec('POLISI KESELAMATAN: IBU BAPA, POLISI & LAPORAN', 'KOKURIKULUM', [
    h('Peranan Ibu Bapa dan Penjaga'),
    ul(['Mengambil tahu aktiviti kokurikulum yang diikuti oleh anak/jagaan masing-masing.', 'Meneliti dan mengisi borang yang disediakan oleh pihak sekolah yang berkaitan dengan aktiviti yang dijalankan.', 'Menandatangani borang pengesahan kebenaran untuk menjalankan aktiviti.', 'Menyediakan bahan keperluan anak/jagaan sepanjang aktiviti dijalankan.', 'Mengenal pasti jurulatih/guru yang menguruskan aktiviti dan menyimpan nombor telefon jurulatih/guru berkenaan dan pihak sekolah.']),
    h('Polisi'),
    ul(['Memastikan warga SK Bandar Tasik Selatan tertakluk kepada Peraturan Polisi Keselamatan Kegiatan Kokurikulum.', 'Pegawai yang bertugas semasa aktiviti kokurikulum bertanggungjawab memastikan semua polisi, peraturan dan langkah keselamatan diikuti sepenuhnya.', 'Segala kemalangan yang berlaku harus disusuli dengan tindakan segera mengikut peraturan yang telah ditetapkan.', 'Sekiranya berlaku sebarang kemalangan, laporan mesti dibuat kepada pegawai atau sekolah.', 'Semua murid dilindungi melalui Skim Takaful Kemalangan Diri Berkelompok (rujuk Surat Pekeliling Ikhtisas Bil. 3/1995).', 'Polisi keselamatan kegiatan kokurikulum diketahui oleh semua warga sekolah melalui penyebaran maklumat dan taklimat rasmi.']),
    h('Laporan Keselamatan, Kecederaan dan Kemalangan'),
    p('Sebarang kecederaan, kemalangan dan kematian yang berlaku di sekolah, terutamanya semasa pelaksanaan kokurikulum, perlu dilaporkan dalam bentuk dokumentasi yang jelas dan kemas supaya mudah dijadikan bahan rujukan. Guru penasihat persatuan/kelab perlu dengan segera membuat laporan dalam buku laporan khas yang disediakan oleh pihak sekolah. Antara maklumat penting yang perlu dimasukkan:'),
    ul(['Nama murid dan individu yang terlibat', 'Tarikh, tempat dan masa kecederaan/kemalangan berlaku', 'Bentuk kecederaan pada murid', 'Nama guru yang membuat laporan', 'Tahap kecederaan dan kemalangan', 'Tindakan lanjut oleh guru berkenaan', 'Tandatangan dokumen laporan', 'Pengesahan laporan oleh Guru Besar atau pegawai bertanggungjawab']),
  ]),
  'kk-jk-induk': sec('JAWATANKUASA INDUK UNIT KOKURIKULUM', 'SESI 2026', [{
    id: uid(), type: 'committee', title: '', display: 'chart', focus: PKKO,
    rows: [
      posRow('Pengerusi', GB),
      posRow('Naib Pengerusi', PKPK, PKKO, PKPTG, PKP, PKHEM),
      row('Setiausaha Kokurikulum', 'WAN NOOR HILWANI BINTI WAN MOHAMED'),
      row('Setiausaha Sukan', 'MUHAMAD ALIFF BIN KAMAL AFFANDI'),
      row('Naib Setiausaha Kokurikulum 1', 'NURASYAHIRA BINTI BASIRUN'),
      row('Naib Setiausaha Kokurikulum 2', 'FATIMAH BINTI AB LATIF'),
      row('Naib Setiausaha Sukan 1', 'SAHRULLIZAM BIN LIAS'),
      row('Naib Setiausaha Sukan 2', 'MOHD ZULFADLI BIN YUSOF'),
      row('Penyelaras Unit Beruniform (Pagi)', 'MUHAMMAD IZWAN BIN HALIM'),
      row('Penyelaras Kelab Persatuan (Pagi)', 'MUHAMMAD HAFIZ BIN YUSOF'),
      row('Penyelaras Sukan Permainan (Pagi)', 'MUHAMMAD SHAFIQ BIN HAZMAN'),
      row('Penyelaras Unit Beruniform (Petang)', 'NOOR HAMIMI BINTI ABDUL AZIZ'),
      row('Penyelaras Kelab Persatuan (Petang)', 'NUR INSYIRAH NAJWA BINTI OTHMAN'),
      row('Penyelaras Sukan Permainan (Petang)', 'NUR FATIN UMMAIRAQ BINTI ABDUL HALIM'),
    ],
  }], 'open'),
  'kk-aluan': sec('KATA-KATA ALUAN PENOLONG KANAN KOKURIKULUM', 'KOKURIKULUM', [
    p('Assalamualaikum warahmatullahi wabarakatuh dan salam sejahtera.'),
    p('Syukur ke hadrat Allah SWT kerana dengan limpah kurnia-Nya, Buku Pengurusan Unit Kokurikulum SK Bandar Tasik Selatan bagi sesi 2026 dapat disiapkan.'),
    p('Kokurikulum ialah lanjutan proses pengajaran dan pembelajaran dalam bilik darjah yang memberi peluang kepada murid untuk menambah, mengukuh dan mengamalkan pengetahuan, kemahiran dan nilai yang dipelajari. Melalui penyertaan dalam badan beruniform, kelab dan persatuan serta sukan dan permainan, murid dilatih menjadi insan yang seimbang dari segi intelek, rohani, emosi dan jasmani selaras dengan Falsafah Pendidikan Kebangsaan.'),
    p('Buku ini memuatkan maklumat asas, dasar, strategi pelaksanaan, polisi keselamatan, struktur jawatankuasa serta takwim kegiatan Unit Kokurikulum sebagai panduan kepada semua guru penasihat dan penyelaras. Saya berharap semua pihak dapat melaksanakan tanggungjawab dengan penuh komitmen, kerjasama dan keikhlasan bagi merealisasikan visi unit kita.'),
    p('Sekian, terima kasih.'),
    p('{{jawatan:GPK Kokurikulum}}\nPenolong Kanan Kokurikulum\nSK Bandar Tasik Selatan'),
  ]),
  'kk-tugas': sec('TUGAS-TUGAS JAWATANKUASA KOKURIKULUM', 'KOKURIKULUM', [
    tbl(['JAWATAN', 'TUGAS UTAMA'], [
      ['PENGERUSI (GURU BESAR)', 'Mengetuai dan menyelaras pelaksanaan kokurikulum sekolah. Meluluskan perancangan, program dan peruntukan. Memastikan pematuhan polisi, peraturan dan surat pekeliling KPM.'],
      ['NAIB PENGERUSI (PENTADBIR)', 'Membantu pengerusi memantau dan menyelia pelaksanaan kokurikulum. Mempengerusikan mesyuarat semasa ketiadaan pengerusi. Menyelia pelaksanaan aktiviti mengikut sesi dan bidang tugas masing-masing.'],
      ['SETIAUSAHA KOKURIKULUM / SUKAN', 'Menyedia agenda, minit mesyuarat dan surat-menyurat. Menyimpan rekod keahlian, kehadiran dan pencapaian murid. Menyediakan takwim, laporan aktiviti dan laporan tahunan.'],
      ['NAIB SETIAUSAHA', 'Membantu setiausaha dalam pengurusan data, dokumentasi dan pelaporan, serta menggantikan setiausaha apabila perlu.'],
      ['PENYELARAS UNIT (PAGI / PETANG)', 'Menyelaras perjalanan aktiviti kokurikulum setiap hari Rabu. Memantau kehadiran guru penasihat dan murid. Mengumpul laporan aktiviti dan melaporkan sebarang masalah kepada setiausaha dan penolong kanan.'],
      ['KETUA GURU PENASIHAT', 'Mengetuai perancangan dan pelaksanaan aktiviti unit, kelab, persatuan atau sukan. Menyelaras guru penasihat dan menyediakan laporan unit.'],
      ['GURU PENASIHAT', 'Merancang dan melaksanakan sekurang-kurangnya 12 perjumpaan setahun. Hadir tepat pada masa yang ditetapkan, merekod kehadiran, menilai penglibatan murid, mengisi laporan aktiviti dan mengutamakan keselamatan murid.'],
    ]),
  ]),
  'kk-pembangunan-sukan': sec('JAWATANKUASA PEMBANGUNAN SUKAN 2026', 'SUKAN & PERMAINAN', [tbl(['JAWATAN', 'NAMA'], SUKAN_JK)]),
  'kk-pasukan-1': sec('SENARAI JURULATIH PASUKAN SUKAN (1)', 'SUKAN & PERMAINAN', [img('pasukan-1.png', 'Bil. 1 hingga 5. (K) = ketua jurulatih.', 225)]),
  'kk-pasukan-2': sec('SENARAI JURULATIH PASUKAN SUKAN (2)', 'SUKAN & PERMAINAN', [img('pasukan-2.png', 'Bil. 6 hingga 12. (K) = ketua jurulatih.', 225)]),
  'kk-pasukan-3': sec('SENARAI JURULATIH PASUKAN SUKAN (3)', 'SUKAN & PERMAINAN', [img('pasukan-3.png', 'Suara Emas dan Ragbi.', 150), img('pasukan-4.png', 'Silat & Taekwondo.', 45)]),
  'kk-rumah-sukan': sec('JAWATANKUASA RUMAH SUKAN 2026', 'RUMAH SUKAN', [tbl(['JAWATAN', 'NAMA'], SUKAN_JK)]),
  'kk-rumah-biru': rumah('BIRU', 'biru'),
  'kk-rumah-hijau': rumah('HIJAU', 'hijau'),
  'kk-rumah-kuning': rumah('KUNING', 'kuning'),
  'kk-rumah-merah': rumah('MERAH', 'merah'),
  'kk-rumah-ungu': rumah('UNGU', 'ungu'),
  'kk-khas': sec('SENARAI JAWATANKUASA KHAS KOKURIKULUM', 'KOKURIKULUM', [
    ul(['Jawatankuasa Penilaian iKeps, SEGAK & PAJSK', 'Jawatankuasa 1M1S', 'Jawatankuasa Majlis Anugerah Kecemerlangan Kokurikulum', 'Jawatankuasa Merentas Desa', 'Jawatankuasa Pendidikan Luar dan Lawatan'], true),
  ]),
  'kk-khas-1': khas('JAWATANKUASA PENILAIAN iKeps, SEGAK & PAJSK', [
    ['PENYELARAS', 'WAN NOOR HILWANI BINTI WAN MOHAMED (PAJSK)'],
    ['PENYELARAS', 'MUHAMAD ALIFF BIN KAMAL AFFANDI (iKeps)'],
    ['PENYELARAS', 'ROSLEEN BIN ABU BAKAR (SEGAK)'],
    ['AJK', 'SEMUA PENYELARAS UNIT'], ['', 'SEMUA KETUA UNIT'], ['', 'SEMUA GURU KELAS'], ['', 'SEMUA GURU'],
  ]),
  'kk-khas-2': khas('JAWATANKUASA 1M1S', [
    ['SETIAUSAHA', 'MUHAMAD ALIFF BIN KAMAL AFFANDI'], ['NAIB SETIAUSAHA', 'SAHRULLIZAM BIN LIAS'],
    ['AJK', 'ROSLEEN BIN ABU BAKAR'], ['', 'MOHD ZULFADLI BIN YUSOF'], ['', 'FATIMAH BINTI AB LATIF'], ['', 'NURASYAHIRA BINTI BASIRUN'],
  ]),
  'kk-khas-3': khas('JAWATANKUASA MAJLIS ANUGERAH KECEMERLANGAN KOKURIKULUM', [
    ['SETIAUSAHA', 'NURASYAHIRA BINTI BASIRUN'], ['NAIB SETIAUSAHA', 'WAN NOOR HILWANI BINTI WAN MOHAMED'], ['', 'FATIMAH BINTI AB LATIF'],
    ['AJK', "NUR IZZAH 'ATIRAH BINTI HUDALLAH"], ['', 'FATIMAH BINTI AB LATIF'], ['', 'PENYELARAS UNIT'], ['', 'KETUA UNIT'], ['', 'GURU KELAS'],
  ]),
  'kk-khas-4': khas('JAWATANKUASA MERENTAS DESA', [
    ['SETIAUSAHA', 'MUHAMAD ALIFF BIN KAMAL AFFANDI'], ['NAIB SETIAUSAHA', 'SAHRULLIZAM BIN LIAS'], ['', 'MOHD ZULFADLI BIN YUSOF'],
    ['AJK', 'MOHD ARIF BIN AHMAD THARMIZI'], ['', 'KHIRUL AMIR BIN ABU HASAN'], ['', 'RAHANA BINTI MOHAMAD KHATIB'], ['', 'SITI NOR AINIYAH BINTI RIDAWI'],
  ]),
  'kk-khas-5': khas('JAWATANKUASA PENDIDIKAN LUAR DAN LAWATAN', [
    ['SETIAUSAHA', 'NURASYAHIRA BINTI BASIRUN'], ['NAIB SETIAUSAHA', 'WAN NOOR HILWANI BINTI WAN MOHAMED'],
    ['AJK', 'ANDREW ANAK ENTIPAN'], ['', 'MUHAMMAD HAZWAN BIN MD TAIB'], ['', 'RAHANA BINTI MOHAMAD KHATIB'], ['', 'HAPINI BINTI ABDULL WAHAB'],
  ]),
  'kk-takwim': sec('TAKWIM TAHUNAN UNIT KOKURIKULUM 2026', 'KOKURIKULUM', [
    h('Jadual Perjumpaan Kokurikulum'),
    p('Sesi petang: 10.30 pagi hingga 12.00 tengah hari. Sesi pagi: 1.30 petang hingga 3.30 petang.'),
    tbl(['BIL. PERJUMPAAN', 'KELAB & PERSATUAN', 'SUKAN & PERMAINAN'], [
      ['1', '21.1.2026', '21.1.2026'], ['2', '28/01/2026', '04/02/2026'], ['3', '25/02/2026', '25/02/2026'],
      ['4', '04/03/2026', '11/03/2026'], ['5', '15/04/2026', '01/04/2026'], ['6', '29/04/2026', '22.4.2026'],
      ['7', '13/05/2026', '01/07/2026'], ['8', '10/06/2026', '08/07/2026'], ['9', '5.8.2026', '15/07/2026'],
    ]),
    h('Tarikh Perhimpunan Kokurikulum'),
    tbl(['BULAN', 'TARIKH', 'PENGELOLA'], [
      ['JANUARI', '12 Januari 2026', '-'], ['FEBRUARI', '16 Februari 2026', 'Cuti tambahan Tahun Baru Cina'],
      ['MAC', '16 Mac 2026', 'TUNAS KADET REMAJA SEKOLAH'], ['APRIL', '13 April 2026', 'PASUKAN PENGAKAP KANAK-KANAK'],
      ['MEI', '11 Mei 2026', 'PERGERAKAN PUTERI ISLAM MALAYSIA'], ['JUN', '15 Jun 2026', 'PANDU PUTERI TUNAS'],
      ['JULAI', '13 Julai 2026', 'BULAN SABIT MERAH MALAYSIA'], ['OGOS', '10 Ogos 2026', 'TUNAS KADET REMAJA SEKOLAH'],
      ['SEPTEMBER', '14 September 2026', 'PASUKAN PENGAKAP KANAK-KANAK'], ['OKTOBER', '12 Oktober 2026', 'PERGERAKAN PUTERI ISLAM MALAYSIA'],
      ['NOVEMBER', '16 November 2026', 'PANDU PUTERI TUNAS'],
    ]),
    h('Peraturan Perhimpunan'),
    ul([
      'Perhimpunan hendaklah dianjurkan pada hari pertama minggu ketiga setiap bulan (SPI 8/2007).',
      'Guru pemimpin menyelia perjalanan perhimpunan pagi Isnin seperti biasa dengan mengikut ketetapan pelaksanaan perbarisan hormat semua badan beruniform.',
      'Guru pemimpin menyusun murid dalam perbarisan.',
      'Setiap perhimpunan badan beruniform mestilah didokumentasikan.',
      'Setiap murid dan guru pemimpin amat digalakkan memakai uniform lengkap.',
      'Pasukan badan beruniform yang bertugas pada minggu berkenaan digalakkan membuat satu persembahan mengenai keistimewaan / kekuatan badan beruniform masing-masing.',
    ], true),
  ]),
  'kk-jk-02': pdfPage('02', 'BADAN BERUNIFORM'),
  'kk-jk-03': sec("JAWATANKUASA BADAN BERUNIFORM", 'KOKURIKULUM', [
    jkUnit('JAWATANKUASA BADAN BERUNIFORM', ['MUHAMMAD IZWAN BIN HALIM', 'NOOR HAMIMI BINTI ABDUL AZIZ'], ['NUR IZZAH ‘ATIRAH BINTI HUDALLAH', 'NOR SUZERA BINTI ZAHARI']),
  ]),
  'kk-jk-04': sec("PENGAKAP, KADET REMAJA & BULAN SABIT MERAH", 'KOKURIKULUM', [
    ...unitSesi("PENGAKAP KANAK-KANAK", ["ROHAZLINDA BINTI ISSAHAK", "MOHD ARIF BIN AHMAD THARMIZI", "MOHD ZAHIR BIN RAMLI", "MUHAMAD ALIFF BIN KAMAL AFFANDI", "MUHAMMAD HAFIZ BIN YUSOF", "NORAZAH BINTI AB AZIZ @ HAMID", "NUR SAHIRA BINTI MOHD SOIB", "ROSLEEN BIN ABU BAKAR", "NORLAILI BINTI MUHAMMAD", "SHAIFUL NAZRI BIN ABDUL JABBAR"], ["MOHD HAMDI FARKHAN BIN SALEHHUDDIN", "ABOL IBNUL EQKWAM BIN ZOLKIFLI", "ANDREW ANAK ENTIPAN", "DARSHINII GUNASAGARAN", "MOHD SHAKIR BIN ESUAN", "MOHD ZULFADLI BIN YUSOF", "MUHAMMAD HAZWAN BIN MD TAIB", "NUR FATIN UMMAIRAQ BINTI ABDUL HALIM", "SITI NOR AINIYAH BINTI RIDAWI"], true),
    ...unitSesi("TUNAS KADET REMAJA SEKOLAH", ["NURAZIRA BINTI ABDULL HALIM", "BHARATHI USHA A/P MARTHEVEERAN", "KAMARUNZAMAN BIN ADAM", "MASLINA BT JAMIYOU@HAJI ABDULLAH", "MUHAMMAD SHAFIQ BIN HAZMAN", "SARAH AQILAH BINTI JAMALULAIL", "NURASYAHIRA BINTI BASIRUN", "TENGKU M. AIMAN BIN TENGKU M. FAUZAN", "ZAIDI BIN OTHMAN"], ["MUSAFARUDIN BIN OTHMAN", "MUHD AZIZI BIN AHMAD SHAMSUL MA’ARIF", "NORSABRINA BINTI HASSAN", "NUR IZRIN FARAH HANI BINTI ISMAIL", "RAJA NUR SAZLIN BINTI RAJA SAFWAN", "ROSNAYA BT MAT ISA", "SALME BINTI SENIK", "SITI FAREZZA BINTI ABD MUIS"], true),
    ...unitSesi("BULAN SABIT MERAH MALAYSIA", ["NOR FAKHIRA BINTI JALALUDDIN", "ABDUL JALIL BIN MAT", "ABDULLAH MUHAIMIN BIN AHAMAD", "AISAH BINTI SH'ARI", "GRACE ANNE", "HAREENA A/P N.SIVAGANESE", "RAHANA BINTI MOHAMAD KHATIB", "SAHRULLIZAM BIN LIAS", "YAACOB BIN ISMAIL", "ZURIFAH BINTI ABD.RAHMAN"], ["AZMI BIN MOHAMAD @ ALIAS (PEN)", "AHMAD IZHAM BIN ABD GHANI", "ALIF HAZIM BIN NAJIB", "HAPINI BINTI ABDULL WAHAB", "KHIRUL AMIR BIN ABU HASAN", "MUHAMMAD HAFIZ BIN MOHD BASRI", "NOOR ILLI BINTI ELAS", "SURINA BINTI MALEK", "THIVANY A/P MANOGARAN"], true),
  ]),
  'kk-jk-05': sec("PUTERI ISLAM & PANDU PUTERI ISLAM", 'KOKURIKULUM', [
    ...unitSesi("PERGERAKAN PUTERI ISLAM MALAYSIA", ["YETTE SURIANE BINTI MOHD BAHARUDDIN", "FAATIMATUZZAHRAH BINTI HALIMUDIN", "FAIZAH BINTI MOHD SAHAT", "NORASHIKIN BINTI AZIZ", "NORASSKIN BT MOHAMED", "NORMALIZA BINTI RAMLI", "SALEHA BINTI MOHAMED YUSOF", "SITI 'AISYAH BINTI JAMALUDIN", "SITI SUHAILI BINTI ISMAIL", "WAN NOOR HILWANI BINTI WAN MOHAMED"], ["SITI HAJAR BINTI AB HADI", "HUSNA AMIRA BINTI ISMAIL", "KHARAINE BINTI CHE IBRAHIM", "NORAZLIZA BINTI ISMAIL", "NORBAZRIANA BINTI BADRI", "NUR INSYIRAH NAJWA BINTI OTHMAN", "SITI NORLIANA BINTI MOHD NOR", "SITI RAFIDAH BINTI ABD RAHMAN", "ZAHRAH BINTI MOHAMAD DAHLAN"], true),
    ...unitSesi("PANDU PUTERI ISLAM MALAYSIA", ["NORIDAYU BINTI NORDIN", "FARAH NUR IMANIAH BINTI MOHD SHUKRI", "NOORAZILA BINTI ABDULLAH", "NORLAILA BINTI MOHD SALLEH", "RUZANA BINTI AHMAD", "SUGANIYA A/P ARNACHALAM", "ZATUSY SYAMAM BINTI SHARUDDIN", "ZIRWATUL RAFIDAH BINTI RAHIM", "ZALIFAH BINTI MOHD ZAWAWI", "ZULATUL AZRINA BINTI ZULKEFLI"], ["SHAREENA FATIHAH BINTI SHARIN", "FATIMAH BINTI AB LATIF", "HAWA SYAHIRAH BINTI MOHD SAID", "NASIHA BINTI MOHD SHARIF", "SINNTHU A/P PONNUSAMY", "SITI MAZURA BINTI SHAIKH MUSTAFA", "ZUBAIDAH BINTI DAUD KAIYIN"], true),
  ]),
  'kk-jk-06': pdfPage('06', 'KELAB & PERSATUAN'),
  'kk-jk-07': sec("JAWATANKUASA KELAB & PERSATUAN", 'KOKURIKULUM', [
    jkUnit('JAWATANKUASA KELAB & PERSATUAN', ['MUHAMMAD HAFIZ BIN YUSOF', 'NUR INSYIRAH NAJWA BINTI OTHMAN'], ['HAREENA A/P N.SIVAGANESE', 'SITI NOR AINIYAH BINTI RIDAWI']),
  ]),
  'kk-jk-08': sec("KELAB BAHASA & PENDIDIKAN ISLAM", 'KOKURIKULUM', [
    ...unitSesi("BAHASA MELAYU", ["MASLINA BT JAMIYOU@HAJI ABDULLAH (K)", "NORASSKIN BT MOHAMED", "RAHANA BINTI MOHAMAD KHATIB", "ROSLEEN BIN ABU BAKAR", "ROHAZLINDA BINTI ISSAHAK"], ["SURINA BINTI MALEK (K)", "KHIRUL AMIR BIN ABU HASAN", "MOHD ZULFADLI BIN YUSOF", "MUHAMMAD HAZWAN BIN MD TAIB", "NASIHA BINTI MOHD SHARIF", "NOR SUZERA BINTI ZAHARI", "SITI NORLIANA BINTI MOHD NOR"], false),
    ...unitSesi("BAHASA INGGERIS", ["GRACE ANNE(K)", "AISAH BINTI SH'ARI", "BHARATHI USHA A/P MARTHEVEERAN", "NORAZAH BINTI AB AZIZ @ HAMID", "NURAZIRA BINTI ABDULL HALIM", "SUGANIYA A/P ARNACHALAM"], ["THIVANY A/P MANOGARAN (K)", "DARSHINII GUNASAGARAN", "NORSABRINA BINTI HASSAN", "SINNTHU A/P PONNUSAMY", "SITI FAREZZA BINTI ABD MUIS", "AHMAD IZHAM BIN ABD GHANI", "MUHD AZIZI BIN AHMAD SHAMSUL MA’ARIF"], false),
    ...unitSesi("BAHASA ARAB", ["SITI SUHAILI BINTI ISMAIL (K)", "YAACOB BIN ISMAIL", "ZALIFAH BINTI MOHD ZAWAWI", "MUHAMMAD SHAFIQ BIN HAZMAN", "NOORAZILA BINTI ABDULLAH"], ["ZUBAIDAH BINTI DAUD KAIYIN (K)", "ALIF HAZIM BIN NAJIB", "FATIMAH BINTI AB LATIF", "HUSNA AMIRA BINTI ISMAIL", "KHARAINE BINTI CHE IBRAHIM", "ROSNAYA BT MAT ISA", "SITI RAFIDAH BINTI ABD RAHMAN"], false),
    ...unitSesi("PENDIDIKAN ISLAM", ["KAMARUNZAMAN BIN ADAM (K)", "NORMALIZA BINTI RAMLI", "NUR IZZAH ‘ATIRAH BINTI HUDALLAH", "NORIDAYU BINTI NORDIN", "SITI 'AISYAH BINTI JAMALUDIN"], ["NORBAZRIANA BINTI BADRI (K)", "AZMI BIN MOHAMAD @ ALIAS", "HAWA SYAHIRAH BINTI MOHD SAID", "NORAZLIZA BINTI ISMAIL", "NUR FATIN UMMAIRAQ BINTI ABDUL HALIM", "SALME BINTI SENIK", "SITI HAJAR BINTI AB HADI"], false),
  ]),
  'kk-jk-09': sec("KEBUDAYAAN, STEM, LESTARI ALAM & LAIN-LAIN", 'KOKURIKULUM', [
    ...unitSesi("KEBUDAYAAN & KESENIAN", ["MOHD ZAHIR BIN RAMLI (K)", "SARAH AQILAH BINTI JAMALULAIL", "FARAH NUR IMANIAH BINTI MOHD SHUKRI", "RUZANA BINTI AHMAD", "TENGKU M. AIMAN BIN TENGKU M. FAUZAN"], ["NUR IZRIN FARAH HANI BINTI ISMAIL (P)", "ABOL IBNUL EQKWAM BIN ZOLKIFLI", "NOOR HAMIMI BINTI ABDUL AZIZ", "RAJA NUR SAZLIN BINTI RAJA SAFWAN", "SHAREENA FATIHAH BINTI SHARIN", "SITI MAZURA BINTI SHAIKH MUSTAFA", "ZAHRAH BINTI MOHAMAD DAHLAN"], false),
    ...unitSesi("STEM", ["ABDUL JALIL BIN MAT (K)", "FAIZAH BINTI MOHD SAHAT", "SALEHA BINTI MOHAMED YUSOF", "SAHRULLIZAM BIN LIAS", "ZAIDI BIN OTHMAN"], ["NOOR ILLI BINTI ELAS (K)", "ANDREW ANAK ENTIPAN", "HAPINI BINTI ABDULL WAHAB", "MOHD HAMDI FARKHAN BIN SALEHHUDDIN", "MOHD SHAKIR BIN ESUAN", "MUHAMMAD HAFIZ BIN MOHD BASRI", "MUSAFARUDIN BIN OTHMAN"], false),
    unitSebelah(["LESTARI ALAM", "RUKUN NEGARA"], [["NORASHIKIN BINTI AZIZ (K)", "YETTE SURIANE BINTI MOHD BAHARUDDIN", "NURASYAHIRA BINTI BASIRUN", "ZULATUL AZRINA BINTI ZULKEFLI"], ["ABDULLAH MUHAIMIN BIN AHAMAD (K)", "ZIRWATUL RAFIDAH BINTI RAHIM", "NUR SAHIRA BINTI MOHD SOIB", "MUHAMAD ALIFF BIN KAMAL AFFANDI"]]),
    unitSebelah(["CYBERKIDS", "PENCEGAHAN JENAYAH"], [["FAATIMATUZZAHRAH BINTI HALIMUDIN (K)", "NUR FAKHIRA BINTI JALALUDDIN", "NORLAILA BINTI MOHD SALLEH", "NORLAILI BINTI MUHAMMAD", "ZURIFAH BINTI ABD.RAHMAN"], ["MOHD ARIF BIN AHMAD THARMIZI (K)", "SHAIFUL NAZRI BIN ABDUL JABBAR", "ZATUSY SYAMAM BINTI SHARUDDIN", "MUHAMMAD IZWAN BIN HALIM"]]),
  ]),
  'kk-jk-10': pdfPage('10', 'SUKAN & PERMAINAN'),
  'kk-jk-11': sec("JAWATANKUASA SUKAN & PERMAINAN", 'KOKURIKULUM', [
    jkUnit('JAWATANKUASA SUKAN & PERMAINAN', ['MUHAMMAD SHAFIQ BIN HAZMAN', 'NUR FATIN UMMAIRAQ BINTI ABDUL HALIM'], ['RUZANA BINTI AHMAD', 'ZAHRAH BINTI MOHAMAD DAHLAN']),
  ]),
  'kk-jk-12': sec("BOLA BALING, JARING, OLAHRAGA & BOLA SEPAK", 'KOKURIKULUM', [
    ...unitSesi("BOLA BALING", ["AISAH BINTI SH'ARI (K)", "BHARATHI USHA A/P MARTHEVEERAN", "GRACE ANNE", "ABDULLAH MUHAIMIN BIN AHAMAD", "ZIRWATUL RAFIDAH BINTI RAHIM", "SALEHA BINTI MOHAMED YUSOF", "ZURIFAH BINTI ABD.RAHMAN", "SUGANIYA A/P ARNACHALAM"], ["ABOL IBNUL EQKWAM BIN ZOLKIFLI (K)", "ROSNAYA BT MAT ISA", "MUHAMMAD HAFIZ BIN MOHD BASRI", "NUR INSYIRAH NAJWA BINTI OTHMAN", "NOOR HAMIMI BINTI ABDUL AZIZ", "NORAZLIZA BINTI ISMAIL", "MOHD HAMDI FARKHAN BIN SALEHHUDDIN", "MUHAMMAD HAZWAN BIN MD TAIB"], false),
    ...unitSesi("BOLA JARING", ["FARAH NUR IMANIAH BINTI MOHD SHUKRI (K)", "NORLAILA BINTI MOHD SALLEH", "SITI 'AISYAH BINTI JAMALUDIN", "NORLAILI BINTI MUHAMMAD", "NOORAZILA BINTI ABDULLAH", "RAHANA BINTI MOHAMAD KHATIB", "ZATUSY SYAMAM BINTI SHARUDDIN"], ["SITI FAREZZA BINTI ABD MUIS (K)", "SURINA BINTI MALEK", "RAJA NUR SAZLIN BINTI RAJA SAFWAN", "SALME BINTI SENIK", "SITI RAFIDAH BINTI ABD RAHMAN", "NORBAZRIANA BINTI BADRI", "HUSNA AMIRA BINTI ISMAIL", "NOR SUZERA BINTI ZAHARI"], false),
    ...unitSesi("OLAHRAGA", ["SAHRULLIZAM BIN LIAS (K)", "NORASSKIN BT MOHAMED", "KAMARUNZAMAN BIN ADAM", "NUR FAKHIRA BINTI JALALUDDIN", "NUR SAHIRA BINTI MOHD SOIB", "TENGKU MOHAMMAD AIMAN BIN TENGKU M. FAUZAN", "MASLINA BT JAMIYOU @HAJI ABDULLAH"], ["NASIHA BINTI MOHD SHARIF (K)", "NUR IZRIN FARAH HANI BINTI ISMAIL", "HAPINI BINTI ABDULL WAHAB", "KHIRUL AMIR BIN ABU HASAN", "ZUBAIDAH BINTI DAUD KAIYIN", "DARSHINII GUNASAGARAN", "KHARAINE BINTI CHE IBRAHIM", "MUSAFARUDIN BIN OTHMAN"], false),
    ...unitSesi("BOLA SEPAK", ["MOHD ARIF BIN AHMAD THARMIZI (K)", "MOHD ZAHIR BIN RAMLI", "FAIZAH BINTI MOHD SAHAT", "HAREENA A/P N.SIVAGANESE", "ROHAZLINDA BINTI ISSAHAK", "MUHAMMAD HAFIZ BIN YUSOF", "NORASHIKIN BINTI AZIZ"], ["ANDREW ANAK ENTIPAN (K)", "FATIMAH BINTI AB LATIF", "MOHD SHAKIR BIN ESUAN", "THIVANY A/P MANOGARAN", "NORSABRINA BINTI HASSAN", "SITI MAZURA BINTI SHAIKH MUSTAFA", "SITI NORLIANA BINTI MOHD NOR", "MOHD ZULFADLI BIN YUSOF", "MUHD AZIZI BIN AHMAD SHAMSUL MA’ARIF"], false),
  ]),
  'kk-jk-13': sec("BOLA TAMPAR, SEPAK TAKRAW & RAGBI", 'KOKURIKULUM', [
    ...unitSesi("BOLA TAMPAR", ["ZULATUL AZRINA BINTI ZULKEFLI (K)", "YETTE SURIANE BINTI MOHD BAHARUDDIN", "ABDUL JALIL BIN MAT", "ZAIDI BIN OTHMAN", "MUHAMMAD IZWAN BIN HALIM", "FAATIMATUZZAHRAH BINTI HALIMUDIN", "NUR IZZAH ‘ATIRAH BINTI HUDALLAH"], ["AHMAD IZHAM BIN ABD GHANI (K)", "SITI HAJAR BINTI AB HADI", "NOOR ILLI BINTI ELAS", "SHAREENA FATIHAH BINTI SHARIN", "ALIF HAZIM BIN NAJIB", "SINNTHU A/P PONNUSAMY", "SITI NOR AINIYAH BINTI RIDAWI", "HAWA SYAHIRAH BINTI MOHD SAID", "AZMI BIN MOHAMAD @ ALIAS"], false),
    unitSebelah(["SEPAK TAKRAW", "RAGBI"], [["ROSLEEN BIN ABU BAKAR", "ZALIFAH BINTI MOHD ZAWAWI", "SARAH AQILAH BINTI JAMALULAIL", "YAACOB BIN ISMAIL", "SITI SUHAILI BINTI ISMAIL", "NORMALIZA BINTI RAMLI"], ["MUHAMAD ALIFF BIN KAMAL AFFANDI (K)", "NORAZAH BINTI AB AZIZ @ HAMID", "NURAZIRA BINTI ABDULL HALIM", "SHAIFUL NAZRI BIN ABDUL JABBAR", "NORIDAYU BINTI NORDIN", "NURASYAHIRA BINTI BASIRUN"]]),
  ]),
  'pk-jpks': ppkiPage('jpks', 'JAWATANKUASA PENDIDIKAN KHAS SEKOLAH (JPKS) 2026'),
  'pk-carta': ppkiPage('carta', 'CARTA ORGANISASI PROGRAM PENDIDIKAN KHAS INTEGRASI 2026'),
  'pk-jk-induk': ppkiPage('induk', 'JAWATANKUASA INDUK PROGRAM PENDIDIKAN KHAS INTEGRASI 2026'),
});
