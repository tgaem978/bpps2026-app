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

/* ---- Halaman penuh daripada PDF (halaman 2–13) ---- */
const pdfPage = (no: string, title: string): SectionContent => ({
  title, subtitle: 'KOKURIKULUM', layout: 'standard', updatedAt: null,
  blocks: [{ id: `kokurikulum-${no}`, type: 'image', src: `${BASE}kokurikulum/pg-${no}.jpg`, caption: '', fullPage: true }],
});
const ppkiPage = (file: string, title: string): SectionContent => ({
  title, subtitle: 'PPKI', layout: 'standard', updatedAt: null,
  blocks: [{ id: `ppki-${file}`, type: 'image', src: `${BASE}ppki/${file}.jpg`, caption: '', fullPage: true }],
});

export const kokuTopics = (): OutlineTopic[] => [
  { id: 'kk-pengenalan', children: [] },
  { id: 'kk-visi-misi', children: [] },
  { id: 'kk-piagam', children: [] },
  { id: 'kk-dasar', children: [] },
  { id: 'kk-strategi', children: [] },
  { id: 'kk-polisi-spi', children: ['kk-polisi', 'kk-polisi-2'] },
  { id: 'kk-jk-induk', children: [] },
  { id: 'kk-jk-02', children: ['kk-jk-03', 'kk-jk-04', 'kk-jk-05'] },
  { id: 'kk-jk-06', children: ['kk-jk-07', 'kk-jk-08', 'kk-jk-09'] },
  { id: 'kk-jk-10', children: ['kk-jk-11', 'kk-jk-12', 'kk-jk-13'] },
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
  'kk-jk-02': pdfPage('02', 'BADAN BERUNIFORM'),
  'kk-jk-03': pdfPage('03', 'JAWATANKUASA BADAN BERUNIFORM'),
  'kk-jk-04': pdfPage('04', 'PENGAKAP, KADET REMAJA & BULAN SABIT MERAH'),
  'kk-jk-05': pdfPage('05', 'PUTERI ISLAM & PANDU PUTERI ISLAM'),
  'kk-jk-06': pdfPage('06', 'KELAB & PERSATUAN'),
  'kk-jk-07': pdfPage('07', 'JAWATANKUASA KELAB & PERSATUAN'),
  'kk-jk-08': pdfPage('08', 'KELAB BAHASA & PENDIDIKAN ISLAM'),
  'kk-jk-09': pdfPage('09', 'KEBUDAYAAN, STEM, LESTARI ALAM & LAIN-LAIN'),
  'kk-jk-10': pdfPage('10', 'SUKAN & PERMAINAN'),
  'kk-jk-11': pdfPage('11', 'JAWATANKUASA SUKAN & PERMAINAN'),
  'kk-jk-12': pdfPage('12', 'BOLA BALING, JARING, OLAHRAGA & BOLA SEPAK'),
  'kk-jk-13': pdfPage('13', 'BOLA TAMPAR, SEPAK TAKRAW & RAGBI'),
  'pk-jpks': ppkiPage('jpks', 'JAWATANKUASA PENDIDIKAN KHAS SEKOLAH (JPKS) 2026'),
  'pk-carta': ppkiPage('carta', 'CARTA ORGANISASI PROGRAM PENDIDIKAN KHAS INTEGRASI 2026'),
  'pk-jk-induk': ppkiPage('induk', 'JAWATANKUASA INDUK PROGRAM PENDIDIKAN KHAS INTEGRASI 2026'),
});
