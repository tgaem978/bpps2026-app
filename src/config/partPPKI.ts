/* Pendidikan Khas (PPKI): carta organisasi ditaip semula sebagai carta jawatankuasa boleh sunting (gambar diambil daripada
 * Pangkalan Data Guru) dan jadual nama. Menggantikan halaman imej daripada PDF. */
import type { Block, CommitteeRow, MemberRef, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { member } from '@/config/partKoku';

const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;
const SUB = 'PPKI';

/** Ahli dipadankan dengan Pangkalan Data Guru; jawatan/tugas dalam carta dipaparkan sebagai nota. */
const who = (name: string, note?: string): MemberRef => {
  const m = member(name);
  if (!note) return m;
  return m.kind === 'teacher' ? { ...m, note } : { kind: 'text', value: `${name} (${note})` };
};
const row = (role: string, ...members: MemberRef[]): CommitteeRow => ({ id: uid(), role, members });
const posRow = (role: string, ...positions: string[]): CommitteeRow => ({ id: uid(), role, members: positions.map((value): MemberRef => ({ kind: 'position', value })) });
const chart = (rows: CommitteeRow[]): Block => ({ id: uid(), type: 'committee', title: '', display: 'chart', focus: PKPK, rows });
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const tbl = (columns: string[], rows: string[][], numbered = true): Block => ({ id: uid(), type: 'table', style: 'navy', numbered, columns, rows });
const sec = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: SUB, layout: 'open', blocks, updatedAt: null });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[], ordered = true): Block => ({ id: uid(), type: 'list', ordered, items });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });
const std = (title: string, blocks: Block[]): SectionContent => ({ ...sec(title, blocks), layout: 'standard' });

/** Struktur bahagian PPKI: pengenalan → visi/misi → enrolmen → JPKS → carta → JK induk → bidang tugas → takwim. */
export const ppkiTopics = (): OutlineTopic[] => [
  { id: 'pendidikan-khas', children: ['pk-visi', 'pk-murid', 'pk-jpks', 'pk-carta', 'pk-jk-induk', 'pk-tugas', 'pk-takwim'] },
];

/** Program PPKI 2026 (lajur PPKI dalam Takwim Induk SKBTS 2026), disusun ikut bulan: [bulan, tarikh, program]. */
const TAKWIM_PPKI: [string, string, string][] = [
  ['JANUARI', '13 - 16 Jan', 'Minggu Riang Ria Sekolahku PPKI'],
  ['', '22 Jan', 'Bimbingan Berkelompok Bil. 1 PPDBP (PKPK)'],
  ['', '24 Jan', 'Taklimat Ibu Bapa (Program Pendidikan Inklusif, RPI, PAPR)'],
  ['', '29 Jan', 'Bengkel Penyelarasan JU RPI (PKPK)'],
  ['FEBRUARI', '3 Feb', 'PLC - Prasidang RPI Murid Baharu'],
  ['', '5 Feb', 'Program LiPs Siri 1 PPDBP (GPKI BM)'],
  ['', '10 Feb', 'Suai Kenal Inklusif & Pelantikan Rakan Inklusif'],
  ['', '12 Feb', 'Bengkel Rancangan Pendidikan Individu (RPI)'],
  ['', '24 Feb', 'Program Ihya Ramadhan (bermula)'],
  ['', '28 Feb', 'Mesyuarat AJK Biro Pendidikan Khas'],
  ['MAC', '9 Mac', 'Program LiPs Siri 2 PPDBP (PKPK & GPKI BM)'],
  ['', '17 Mac', 'Penutup Ihya Ramadhan PPKI'],
  ['APRIL', '1 - 2 Apr', 'Kursus Kejurulatihan Olahraga PK Bangsar/Pudu'],
  ['', '6 - 10 Apr', 'Minggu Autisme'],
  ['', '9 Apr', 'Sambutan Hari Raya & Hari Lahir'],
  ['', '13 Apr', 'Bengkel Guru Data Pendidikan Khas Bil. 1'],
  ['', '14 Apr', 'Mesyuarat JPKS Bil. 1'],
  ['', '15 - 16 Apr', 'KLITC dan eNILAM'],
  ['', '21 - 22 Apr', 'Bengkel Penyediaan Bahan Jadual Visual'],
  ['MEI', '4 Mei', 'Pemeriksaan Kesihatan PPKI & Prasekolah; Bimbingan Berkelompok Bil. 3 PPDBP'],
  ['', '7 Mei', 'Mesyuarat PPKI Bil. 2'],
  ['', '12 Mei', 'STEM Fun Learning SK JPWPKL'],
  ['', '14 Mei', 'Program Sokongan 1 (Rekreasi & Riadah)'],
  ['', '15 Mei', 'Mesyuarat Perdana Biro Pendidikan Khas'],
  ['', '18 Mei', 'Bengkel Bahan Bantu Mengajar STEM SR'],
  ['', '21 Mei', 'Bimbingan Berkelompok Pendidikan Khas Bil. 2'],
  ['', '22 Mei', 'Sambutan Hari Guru'],
  ['JUN', '9 - 10 Jun', 'Kejohanan Mini Olahraga Pendidikan Khas Peringkat Daerah Bangsar/Pudu'],
  ['', '11 Jun', 'Program Sokongan 2 (Boling & Mobiliti Pasar Raya)'],
  ['', '18 - 19 Jun', 'Hari Urus Diri'],
  ['', '25 Jun', 'Bengkel Pemantapan Penulisan Intervensi RPI'],
  ['', '27 Jun', 'Mesyuarat AJK Biro Pendidikan Khas'],
  ['JULAI', '2 - 17 Jul', 'Latihan Sukan'],
  ['', '12 Jul', 'Karnival Kokurikulum Pendidikan Khas Kebangsaan'],
  ['', '20 - 22 Jul', 'Pra Kejohanan; Bengkel Data Kebolehpasaran Bangsar/Pudu (20 Jul)'],
  ['', '23 Jul', 'Sukaneka Tahap 1, Prasekolah dan PPKI'],
  ['', '28 - 30 Jul', 'Kejohanan Olahraga Pendidikan Khas MSSWPKL'],
  ['OGOS', '6 Ogos', 'Bimbingan Hari Inspirasi Pendidikan Khas Bil. 1'],
  ['', '13 Ogos', 'Program Sokongan 3 (Boling & Membeli-belah)'],
  ['', '15 Ogos', 'Karnival Kebolehpasaran MBPK'],
  ['', '17 Ogos', 'Mesyuarat PPKI Bil. 3'],
  ['', '18 Ogos', 'Bengkel DATAPINTAR Pendidikan Khas (Literasi & Numerasi dan PBD)'],
  ['', '20 Ogos', 'Dialog Akademik Bersama Ibu Bapa / Penjaga PPKI (Fasa 1)'],
  ['SEPTEMBER', '8 Sep', 'Pencerapan Kali Ke-2 & Semakan Buku Latihan'],
  ['', '9 Sep', 'Bimbingan Hari Inspirasi Pendidikan Khas Bil. 2'],
  ['', '11 - 12 Sep', 'Perkhemahan dan Kem Jati Diri PPKI'],
  ['', '17 Sep', 'Sambutan Bulan Kebangsaan - Lawatan Sosial (Melaka)'],
  ['', '21 Sep', 'Bimbingan Hari Inspirasi Pendidikan Khas Bil. 3'],
  ['', '22 - 24 Sep', 'Karnival Mahabbah Pendidikan Khas JPWPKL'],
  ['', '29 - 30 Sep', 'Hari Inspirasi Pendidikan Khas Bangsar/Pudu'],
  ['OKTOBER', '6 Okt', 'Bengkel Guru Data Pendidikan Khas Bil. 2 PPDBP'],
  ['', '7 Okt', 'Program Sokongan 4 (Berkuda)'],
  ['', '9 Okt', 'Sambutan Hari Kanak-kanak PPKI'],
  ['', '12 - 16 Okt', 'Minggu Pendidikan Khas (Usahawan Cilik); Bimbingan Berkelompok Bil. 3 PKPK Bangsar/Pudu (15 Okt)'],
  ['', '20 Okt', 'Mesyuarat JPKS Bil. 2'],
  ['', '22 Okt', 'Program Sokongan 5 (Memanah)'],
  ['', '24 Okt', 'Hari Keluarga PPKI & Sambutan Hari Lahir Fasa 2'],
  ['NOVEMBER', '2 Nov', 'Team Building PKPK Bangsar/Pudu'],
  ['', '5 Nov', 'Program Sokongan 6'],
  ['', '11 Nov', 'Mesyuarat PPKI Bil. 4'],
  ['', '14 Nov', 'Fiesta Ria PPKI & Apresiasi'],
  ['', '19 - 20 Nov', 'Dialog Akademik Bersama Ibu Bapa / Penjaga PPKI (Fasa 2)'],
];

export const partPpkiSections = (): Record<string, SectionContent> => ({
  'pendidikan-khas': std('PENGENALAN PROGRAM PENDIDIKAN KHAS INTEGRASI', [
    p('Program Pendidikan Khas Integrasi (PPKI) {{nama_pendek}} menyediakan pendidikan yang inklusif dan bersesuaian dengan keperluan murid berkeperluan pendidikan khas (MBPK), ke arah kemenjadian murid dan kehidupan berdikari.'),
    p('PPKI diurus oleh {{jawatan:GPK Pendidikan Khas}} (Penolong Kanan Pendidikan Khas) dengan sokongan Jawatankuasa Pendidikan Khas Sekolah (JPKS), guru pendidikan khas, Pembantu Pengurusan Murid (PPM), ibu bapa / penjaga dan agensi berkaitan. Setiap murid mengikuti Rancangan Pendidikan Individu (RPI) yang disediakan berdasarkan tahap keupayaan murid.'),
    h('MAKLUMAT PROGRAM'),
    kv([
      ['Penyelaras / Penolong Kanan', '{{jawatan:GPK Pendidikan Khas}}'],
      ['Bilangan Guru Pendidikan Khas', '{{bilangan:jawatan=Guru Pendidikan Khas}}'],
      ['Bilangan Pembantu Pengurusan Murid', ''],
      ['Bilangan Kelas', ''],
      ['Bilangan Murid', ''],
      ['Kategori Murid', 'Masalah pembelajaran'],
    ]),
  ]),
  'pk-visi': std('VISI, MISI & OBJEKTIF PPKI', [
    h('VISI'),
    p('Murid berkeperluan pendidikan khas yang berilmu, berkemahiran, berakhlak mulia dan mampu hidup berdikari.'),
    h('MISI'),
    p('Menyediakan pendidikan yang berkualiti, inklusif dan bersesuaian dengan potensi setiap MBPK melalui Rancangan Pendidikan Individu (RPI), kerjasama ibu bapa / penjaga dan sokongan komuniti.'),
    h('OBJEKTIF'),
    ul([
      'Membantu MBPK menguasai kemahiran asas literasi dan numerasi mengikut tahap keupayaan masing-masing.',
      'Membangunkan kemahiran urus diri, sosial dan kebolehpasaran ke arah kehidupan berdikari.',
      'Melaksanakan dan memantau RPI bagi setiap murid secara berterusan.',
      'Menggalakkan penyertaan MBPK dalam aktiviti kokurikulum dan Program Pendidikan Inklusif.',
      'Memperkukuh jalinan kerjasama dengan ibu bapa / penjaga, PPD, JPN dan agensi luar.',
    ]),
  ]),
  'pk-murid': std('ENROLMEN MURID & KELAS PPKI', [
    tbl(['KELAS', 'GURU KELAS', 'PEMBANTU PENGURUSAN MURID', 'LELAKI', 'PEREMPUAN', 'JUMLAH'], [
      ...Array.from({ length: 6 }, () => ['', '', '', '', '', '']),
      ['**JUMLAH**', '', '', '', '', ''],
    ], false),
    h('Murid Program Pendidikan Inklusif'),
    tbl(['NAMA MURID', 'KELAS ARUS PERDANA', 'MATA PELAJARAN INKLUSIF', 'GURU PENYELARAS'], Array.from({ length: 4 }, () => ['', '', '', ''])),
  ]),
  'pk-tugas': std('BIDANG TUGAS PPKI', [
    h('Penolong Kanan Pendidikan Khas'),
    ul([
      'Merancang, menyelaras dan memantau pelaksanaan PPKI selaras dengan dasar dan garis panduan KPM.',
      'Menjadi setiausaha Jawatankuasa Pendidikan Khas Sekolah (JPKS) dan menyelaras mesyuarat PPKI.',
      'Mengurus pendaftaran, penempatan dan data MBPK termasuk dokumen pengesahan yang diperlukan.',
      'Memantau pelaksanaan RPI, PdP dan pentaksiran MBPK serta melaksanakan pencerapan guru.',
      'Mengurus peruntukan kewangan, aset dan perolehan PPKI mengikut peraturan.',
      'Menyelaras Program Pendidikan Inklusif bersama guru arus perdana.',
      'Menjalin hubungan dengan ibu bapa / penjaga, PPD, JPN dan agensi luar.',
    ]),
    h('Guru Pendidikan Khas'),
    ul([
      'Merancang dan melaksanakan PdP berdasarkan kurikulum pendidikan khas dan RPI murid.',
      'Menyediakan, melaksanakan dan menilai RPI bagi setiap murid di bawah jagaan.',
      'Melaksanakan pentaksiran dan merekod perkembangan murid secara berkala.',
      'Menjaga keselamatan, kebajikan dan disiplin murid sepanjang berada di sekolah.',
      'Berhubung dengan ibu bapa / penjaga tentang perkembangan murid.',
      'Melaksanakan tugas lain seperti guru kelas, guru bertugas dan aktiviti kokurikulum.',
    ]),
    h('Pembantu Pengurusan Murid (PPM)'),
    ul([
      'Membantu guru dalam aktiviti PdP dan pengurusan bilik darjah.',
      'Membantu murid dalam urus diri seperti makan, ke tandas dan kebersihan diri.',
      'Menjaga keselamatan murid semasa ketibaan, rehat, aktiviti luar dan bersurai.',
      'Menyediakan dan menyimpan bahan serta peralatan PdP.',
      'Membantu pengurusan makanan murid serta kebersihan kelas.',
      'Melaksanakan tugas lain yang diarahkan oleh Penolong Kanan Pendidikan Khas.',
    ]),
  ]),
  'pk-takwim': std('TAKWIM TAHUNAN PPKI', [
    tbl(['BULAN', 'TARIKH', 'PROGRAM / AKTIVITI'], TAKWIM_PPKI.map(([b, t, prog]) => [b, t, prog]), false),
  ]),
  'pk-jpks': sec('JAWATANKUASA PENDIDIKAN KHAS SEKOLAH (JPKS) 2026', [
    chart([
      posRow('Pengerusi', GB),
      posRow('Setiausaha & Penolong Kanan', PKKO, PKP, PKPK, PKHEM, PKPTG),
      row('Naib Setiausaha', who('TUAN NOREHAN BINTI RAJA OTHMAN')),
    ]),
    h('Ahli Jawatankuasa'),
    tbl(['NAMA', 'JAWATAN / TUGAS'], [
      ['ZURIFAH BINTI ABD RAHMAN', 'Guru Bimbingan Kaunseling'],
      ['SAIFUL NAZRI BIN ABDUL JABBAR', 'Ketua Guru Disiplin'],
      ["NURUL SYIFAA' BINTI ZAINOL", 'Penyelaras Pendidikan Inklusif'],
      ['HAPINI BINTI ABDUL WAHAB', 'Guru Pemulihan'],
      ['ROSLEEN BIN ABU BAKAR', 'Guru PJK'],
      ['MUHAMAD ALIF BIN KAMAL AFFANDI', 'Guru PJK'],
      ['SITI FAREZZA BINTI ABD MUIS', 'Guru Pendidikan Muzik'],
      ['NORLIANA BINTI MOHD NOR', 'Guru PSV'],
      ['ABG ABDULLAH BIN ABG JOSMANI', 'Pengerusi Biro PKhas'],
    ]),
  ]),
  'pk-carta': sec('CARTA ORGANISASI PROGRAM PENDIDIKAN KHAS INTEGRASI 2026', [
    chart([
      posRow('Pengerusi', GB),
      posRow('Penolong Kanan', PKKO, PKP, PKPK, PKHEM, PKPTG),
      row('Setiausaha Pentadbiran', who('TUAN NOREHAN BINTI RAJA OTHMAN')),
      row('Setiausaha Kurikulum', who('SITI AISYAH ILYANI BINTI BAHRI')),
      row('Setiausaha Hal Ehwal Murid', who('NORYATI BINTI NGAH')),
      row('Setiausaha Kokurikulum', who('MOHD HAIROS BIN DAUD')),
    ]),
    h('Guru Pendidikan Khas'),
    tbl(['NAMA', 'JAWATAN'], [
      ['WAN MARFUZA BT WAN MOHD FUAT', 'Guru Pendidikan Khas'],
      ['SITI AISAH BINTI ABD KHANI', 'Guru Pendidikan Khas'],
      ['WAN NOR AZIAN BT BIDUZODIN', 'Guru Pendidikan Khas'],
      ["NURUL SYIFAA' BINTI ZAINOL", 'Guru Pendidikan Khas'],
      ["SITI NOOREHAN BINTI SA'IM", 'Guru Pendidikan Khas'],
      ['MOHD MAZNI BIN MAHASAN', 'Guru Pendidikan Khas'],
      ['DELSIE ANAK DAWI', 'Guru Pendidikan Khas'],
      ['TUAN MOHD KHAIRI BIN TUAN SOH', 'Guru Pendidikan Islam'],
      ['NUR AQILAH BINTI KHALIT', 'Guru Pendidikan Islam'],
    ]),
    h('Pembantu Pengurusan Murid'),
    tbl(['NAMA', 'JAWATAN'], [
      ['NORHANA BINTI HAWARI', 'Pembantu Pengurusan Murid'],
      ['NOR HAZURA BINTI', 'Pembantu Pengurusan Murid'],
      ['NUR ASNIDA BINTI AHMAD SAZALI', 'Pembantu Pengurusan Murid'],
      ['NURUL AINI BINTI ZULRAHMAN', 'Pembantu Pengurusan Murid'],
      ['MOHAMMAD FAIZAL B MOHD NOR', 'Pembantu Pengurusan Murid'],
      ['MOHD ZAHRI BIN LONG', 'Pembantu Pengurusan Murid'],
    ]),
  ]),
  'pk-jk-induk': sec('JAWATANKUASA INDUK PROGRAM PENDIDIKAN KHAS INTEGRASI 2026', [
    chart([
      posRow('Pengerusi', GB),
      posRow('Naib Pengerusi', PKKO, PKP, PKPK, PKHEM, PKPTG),
      row('Setiausaha Pentadbiran', who('TUAN NOREHAN BINTI RAJA OTHMAN')),
      row('Setiausaha Kurikulum', who('SITI AISYAH ILYANI BINTI BAHRI')),
      row('Setiausaha Hal Ehwal Murid', who('NORYATI BINTI NGAH')),
      row('Setiausaha Kokurikulum', who('MOHD HAIROS BIN DAUD')),
    ]),
  ]),
});
