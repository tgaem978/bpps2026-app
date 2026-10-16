/* Bahagian Pengurusan Hal Ehwal Murid (HEM): kandungan daripada "BUKU PENGURUSAN 2026 – SUB-UNIT HEM" (slaid 1–4, 6–16, 19–26).
 * Slaid 5 (carta organisasi), 17 (takwim) dan 18 (program berterusan) hanya imej dalam sumber, maka tidak dimasukkan.
 * Nama ahli jawatankuasa ditulis sebagai teks seperti dalam dokumen sumber (sama seperti bahagian Kokurikulum).
 * Ejaan telah disemak untuk kesilapan taip yang jelas sahaja; isi tidak diubah. */
import type { Block, CommitteeRow, MemberRef, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { member } from '@/config/partKoku';

const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;
const SUB = 'HAL EHWAL MURID';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const tbl = (columns: string[], rows: string[][]): Block => ({ id: uid(), type: 'table', style: 'navy', numbered: false, columns, rows });
const sec = (title: string, subtitle: string, blocks: Block[], layout: SectionContent['layout'] = 'standard'): SectionContent => ({
  title, subtitle, layout, blocks, updatedAt: null,
});

/* ---- Jawatankuasa unit: barisan pentadbir sama bagi semua unit; hanya setiausaha & AJK berbeza ---- */
const txt = (...v: string[]): MemberRef[] => v.map((value) => ({ kind: 'text', value }));
const cmRow = (role: string, ...names: string[]): CommitteeRow => ({ id: uid(), role, members: txt(...names) });

const jk = (title: string, setiausaha: string, naibSetiausaha: string | string[], ajk: string[], extra: [string, string[]][] = []): Block => ({
  id: uid(), type: 'committee', title,
  rows: [
    cmRow('Pengerusi', 'SHAMSUKAMAL BIN ANIFAR'),
    cmRow('Timbalan Pengerusi', 'HASRE ADHA BIN MOHD HASSAN'),
    cmRow('Naib Pengerusi I', 'ZALEHA BINTI YUSOH'),
    cmRow('Naib Pengerusi II', 'MUHAMMAD RIZAL BIN CHE DIN'),
    cmRow('Naib Pengerusi III', 'VINCENT NATHAN A/L IRATHAYA SAMI'),
    cmRow('Naib Pengerusi IV', 'SYAHIDA BINTI MOHAMED MOKHTAR'),
    cmRow('Setiausaha', setiausaha),
    ...([naibSetiausaha].flat().length ? [cmRow('Naib Setiausaha', ...[naibSetiausaha].flat())] : []),
    ...(ajk.length ? [cmRow('AJK', ...ajk)] : []),
    ...extra.map(([role, names]) => cmRow(role, ...names)),
  ],
});

/* ---- Jawatankuasa Induk (carta bergambar, dipadankan dengan Pangkalan Data Guru) ---- */
const posRow = (role: string, ...positions: string[]): CommitteeRow => ({
  id: uid(), role, members: positions.map((value): MemberRef => ({ kind: 'position', value })),
});

const INDUK: [string, string, string][] = [
  ['Guru Bimbingan dan Kaunseling', 'ZURIFAH BINTI ABD RAHMAN', 'NUR FAKHIRA BT JALALUDDIN'],
  ['', 'SITI NUR AINIYAH BINTI RIDAWI', ''],
  ['Unit Disiplin / SSDM', 'SHAIFUL NAZRI BIN ABD JABBAR', 'MOHD HAMDI FARKHAN BIN SALEHHUDDIN'],
  ['Unit Pengawas Sekolah', 'MOHD ARIF BIN AHMAD THARMIZI', 'KHARAINE BINTI CHE IBRAHIM'],
  ['GP Data dan MOEIS-IDME', "SITI 'AISYAH BINTI JAMALUDIN", 'MOHD ZULFADLI BIN YUSOF'],
  ['GP Kantin', 'MASLINA BINTI JAMIYOU @ HJ ABDULLAH', 'FATIMAH BINTI AB LATIF'],
  ['GP SPBT', 'RUZANA BT AHMAD', 'SALME BINTI SENIK'],
  ['GP BAP & KWAPM', 'NORIDAYU BINTI NORDIN', 'SITI NORLIANA MOHD NOR'],
  ['GP Kesihatan / Rawatan', 'ZATUSY SYAMAM BINTI SHARUDDIN', 'NORAZLIZA BINTI ISMAIL'],
  ['GP RMT', 'NORMALIZA BINTI RAMLI', 'RAJA NUR SAZLIN BINTI RAJA SAFWAN'],
  ['GP Keselamatan', 'ZAIDI BIN OTHMAN', "MUHD AZIZI BIN AHMAD SHAMSUL MA'ARIF"],
  ['GP Kebajikan Murid', 'NORASHIKIN BINTI AZIZ', 'MOHD SHAKIR BIN ESUAN'],
  ['GP Kebersihan dan Keceriaan', 'ZIRWATUL RAFIDAH RAHIM', 'HAPINI BINTI ABDULL WAHAB'],
  ['GP Pencegahan Anti Dadah (PPDA)', 'NUR SAHIRA BINTI MOHD SOIB', 'HAWA SYAHIRAH BINTI MOHD SAID'],
  ['GP Program Susu Sekolah (PSS)', 'SARAH AQILAH BINTI JAMALULAIL', 'ZUBAIDAH BINTI DAUD KAIYIN'],
  ['BOSD', 'NOORAZILA BINTI ABDULLAH', 'SITI FAREZZA BINTI ABD MUIS'],
  ['GP Kedai Buku Sekolah', "AISAH BINTI SH'ARI", 'AZMI BIN MOHAMAD@ALIAS'],
  ['GP Baitulmal', 'YAACOB BIN ISMAIL', 'ROSNAYA BINTI MAT ISA'],
  ['GP SSDM', 'MUHAMMAD IZWAN BIN HALIM', 'ROHAZLINDA BT ISSAHAK'],
];
/** Kad unit dalam carta induk: SATU kad bagi setiap unit - tajuk unit, nama sesi pagi, nama sesi petang (tiada jawatan lain). */
const stackRow = (role: string, ...names: string[]): CommitteeRow => ({ id: uid(), role, members: names.map(member), stack: true });
const indukUnitRows = (): CommitteeRow[] => {
  const units: { unit: string; names: string[] }[] = [];
  for (const [unit, a, b] of INDUK) {
    const names = [a, b].filter(Boolean);
    if (unit || !units.length) units.push({ unit, names });
    else units[units.length - 1].names.push(...names);
  }
  return units.map(({ unit, names }) => stackRow(unit, ...names));
};

/** Susunan halaman Bidang Tugas (ikut turutan JK Unit berkaitan). */
export const HEM_TUGAS_ORDER = ['hem-tugas-2', 'hem-tugas-1', 'hem-tugas-4', 'hem-tugas-5', 'hem-tugas-8', 'hem-tugas-6', 'hem-tugas-3', 'hem-tugas-7'];

export const hemTopics = (): OutlineTopic[] => [
  { id: 'hem-aluan', children: [] },
  { id: 'hem-pengenalan', children: [] },
  { id: 'hem-visi-misi', children: [] },
  { id: 'hem-objektif', children: [] },
  { id: 'hem-jk-induk', children: [] },
  { id: 'hem-jk', children: ['hem-jk-1', 'hem-jk-2', 'hem-jk-3', 'hem-jk-4', 'hem-jk-5', 'hem-jk-6', 'hem-jk-7', 'hem-jk-8', 'hem-jk-9', 'hem-jk-10'] },
  // Bidang Tugas disusun mengikut turutan JK Unit yang dipadankan:
  // Bimbingan (JK1) → Disiplin & Pengawas (JK1-2) → Kebajikan & COMBI (JK3/10) → Kantin (JK4) → RMT (JK5) → SPBT (JK6) → Kesihatan (JK7) → Keselamatan (JK8)
  { id: 'hem-tugas', children: [...HEM_TUGAS_ORDER] },
];


/** Semua ID kandungan HEM (termasuk subtajuk) – digunakan oleh migrasi. */
export const hemIds = (): string[] => [...hemTopics().flatMap((t) => [t.id, ...t.children]), 'hem-tugas'];

export const partHemSections = (): Record<string, SectionContent> => ({
  'hem-aluan': sec('KATA-KATA ALUAN PENOLONG KANAN HAL EHWAL MURID', SUB, [
    p('Assalamualaikum Warahmatullahi Wabarakatuh.'),
    p('Bersyukur kita ke hadrat Allah SWT dengan limpah kurnia serta izin-Nya, julung-julung kalinya Buku Pengurusan Sekolah bagi sesi 2026 dapat dihasilkan. Kandungannya yang disusun rapi akan dapat memberikan panduan kepada guru dan staf sekolah ini untuk melaksanakan tugas dan tanggungjawab dengan baik dan berkesan.'),
    p('Selama ini usaha gigih yang dijalankan oleh warga sekolah telah berjaya meletakkan sekolah ini sebagai salah sebuah sekolah cemerlang di negeri Kuala Lumpur. Tahniah dan syabas kepada semua Penolong Kanan, guru, staf, murid, PIBG dan ibu bapa yang memberikan sumbangan ke arah kecemerlangan sekolah.'),
    p('Selari dengan Pelan Pembangunan Pendidikan Malaysia, warga sekolah perlu bekerja sebagai satu pasukan dan memberikan komitmen terbaik untuk memenuhi matlamat yang ditetapkan agar segala usaha yang membuahkan kejayaan dan kecemerlangan memberi satu kepuasan kerja dalam profesion yang kita ceburi ini.'),
    p('Saya mengambil kesempatan ini untuk merakamkan setinggi-tinggi penghargaan dan terima kasih kepada jawatankuasa yang terlibat dalam menghasilkan Buku Pengurusan ini. Marilah kita memohon petunjuk daripada Allah SWT, mudah-mudahan segala usaha murni yang kita lakukan ini diberkati serta mendapat kejayaan dan keredaan-Nya jua.'),
    p('Akhir kata, kepada semua guru dan staf, selamat bertugas dan teruskan usaha gigih kita agar sekolah kita terus cemerlang dalam pelbagai bidang serta menjadi kebanggaan kita bersama.'),
    p('Sekian, Wassalam.'),
    p('Saya yang menjalankan amanah,\n\n{{jawatan:GPK Hal Ehwal Murid}}\nPenolong Kanan Hal Ehwal Murid\nSK Bandar Tasik Selatan'),
    p('“Pendidikan Berkualiti Insan Terdidik Negara Sejahtera”'),
  ]),
  'hem-pengenalan': sec('PENGENALAN UNIT HAL EHWAL MURID', SUB, [
    p('Unit Hal Ehwal Murid SK Bandar Tasik Selatan adalah salah satu unit yang bertanggungjawab membantu pihak sekolah untuk memperkembangkan potensi individu secara menyeluruh melalui pelbagai program dan aktiviti yang akan dijalankan sama ada di dalam dan di luar kawasan sekolah. Hal ini bertujuan untuk memberi sebanyak mungkin pendedahan dan pengalaman kepada setiap murid.'),
    p('Keseronokan murid datang dan berada di sekolah mempamerkan iklim sekolah yang harmoni dan kondusif. Situasi ini terhasil daripada hubungan yang baik antara warga sekolah yang terdiri daripada berbilang kaum, berlainan agama, budaya dan bahasa. Kesedaran individu untuk saling hormat-menghormati dengan rasa penuh tanggungjawab dapat menyediakan persekitaran yang selamat supaya proses pengajaran dan pembelajaran tidak terganggu.'),
    p('Unit Hal Ehwal Murid SK Bandar Tasik Selatan beriltizam memberikan perkhidmatan yang terbaik kepada warga sekolah dan memastikan budaya cemerlang terbina dalam setiap program dan aktiviti yang dijalankan.'),
  ]),
  'hem-visi-misi': sec('MISI UNIT HAL EHWAL MURID', SUB, [
    ul([
      'Mewujudkan perkhidmatan pendaftaran murid yang lengkap, cekap dan bersistematik.',
      'Menjadikan para murid SK Bandar Tasik Selatan bersahsiah tinggi, berketrampilan diri, berdisiplin tinggi serta dibanggai oleh semua pihak.',
      'Mewujudkan persekitaran sekolah yang kondusif, bersih, selamat, indah, ceria dan harmoni.',
      'Mewujudkan perkhidmatan kantin sekolah yang bersih, cekap dan mesra pelanggan.',
      'Mengurangkan salah laku dalam kalangan murid.',
      'Mengambil perhatian dan tindakan ke atas murid yang kurang bernasib baik.',
      'Mempertingkatkan tahap kepimpinan dan iltizam pengawas-pengawas sekolah dan ketua-ketua darjah.',
    ], true),
  ]),
  'hem-objektif': sec('OBJEKTIF & MATLAMAT UNIT HAL EHWAL MURID', SUB, [
    h('Objektif'),
    p('Objektif Unit Hal Ehwal Murid sekolah adalah berteraskan kepada Pelan Induk Pembangunan Pendidikan (PIPP), iaitu:'),
    tbl(['TERAS', 'FOKUS'], [
      ['Teras 1', 'Membina Negara Bangsa: memantapkan perpaduan dan integrasi nasional.'],
      ['Teras 2', 'Membangunkan Modal Insan: memperkasakan disiplin murid.'],
    ]),
    h('Matlamat'),
    p('Menggunakan kekuatan sumber manusia secara menyeluruh melalui budaya kerja profesional seiring dengan penghayatan budaya ilmu, pemuafakatan dengan komuniti dan agensi luar ke arah melahirkan warga sekolah yang cemerlang dan berketrampilan.'),
  ]),
  'hem-jk-induk': sec('JAWATANKUASA INDUK UNIT HAL EHWAL MURID', 'SESI 2026', [
    {
      id: uid(), type: 'committee', title: '', display: 'chart', focus: PKHEM, cleanNames: true, onePage: true,
      rows: [
        posRow('Pengerusi', GB),
        posRow('Naib Pengerusi', PKP, PKHEM, PKKO, PKPTG, PKPK),
        stackRow('Setiausaha Hal Ehwal Murid', 'ZIRWATUL RAFIDAH BINTI RAHIM', 'SITI NORLIANA BINTI MOHD NOR'),
        { id: uid(), role: 'Guru Penyelaras Unit', members: [], group: true },
        ...indukUnitRows(),
      ],
    },
  ], 'open'),
  'hem-jk': sec('JAWATANKUASA UNIT HAL EHWAL MURID', SUB, [
    ul([
      'Unit Bimbingan dan Kaunseling', 'Unit Disiplin', 'Unit Pengawas Sekolah', 'Unit Data Murid – MOEIS / IDME',
      'Unit Kebajikan Murid', 'Unit KWAPM / BAP', 'Unit Program Susu Sekolah (PSS)', 'Unit Pengurusan Kantin',
      'Unit Rancangan Makanan Tambahan (RMT)', 'Unit BOSD', 'Unit SPBT', 'Unit Kebersihan & Keceriaan',
      'Unit Kesihatan & Rawatan', 'Unit PPDA', 'Unit Keselamatan & Kecemasan', 'Unit Baitulmal',
      'Unit Kedai Buku Sekolah', 'Unit Pengurusan Pencegahan Denggi (COMBI)',
    ]),
  ]),
  'hem-jk-1': sec('BIMBINGAN & KAUNSELING / DISIPLIN', SUB, [
    jk('JAWATANKUASA UNIT BIMBINGAN DAN KAUNSELING', 'ZURIFAH BINTI ABD RAHMAN', ['NUR FAKHIRA BT JALALUDDIN', 'SITI NOR AINIYAH BINTI RIDAWI'],
       ['SHAIFUL NAZRI BIN ABD JABBAR', 'MOHD HAMDI FARKHAN BIN SALEHUDDIN'],
       [['Penyelaras Aliran Tahun 1–6', ['ZULATUL AZRINA BT ZULKIFLI', 'FARAH IMANIAH BT MOHD SHUKRI', 'WAN NOR AZIAN BINTI BIDUZODIN (PPKI)']]]),
    jk('JAWATANKUASA UNIT DISIPLIN', 'SHAIFUL NAZRI BIN ABD JABBAR', 'MOHD HAMDI FARKHAN BIN SALEHUDDIN',
      ['MUHAMMAD SHAFIQ BIN HAZMAN', 'RUZANA BT AHMAD', 'ZURIFAH BT ABD RAHMAN', 'NUR FAKHIRA BT JALALUDDIN', 'ABOL IBNUL EQWAM BIN ZOLKIFLI', 'SITI MAZURA BINTI SHAIKH MUSTAFA', 'SITI NOR AINIYAH BINTI RIDAWI', 'NUR FATIN UMMAIRAQ BINTI ABDUL HALIM', 'ALIF HAZIM BIN NAJIB', 'NOOR ILLI BINTI ELAS', 'SITI AISYAH ILYANI BIN BAHRI (PPKI)']),
  ]),
  'hem-jk-2': sec('PENGAWAS SEKOLAH / DATA MURID', SUB, [
    jk('JAWATANKUASA LEMBAGA PENGAWAS SEKOLAH', 'MOHD ARIF BIN AHMAD THARMIZI', 'KHARAINE BINTI CHE IBRAHIM',
      ['NURASYAHIRA BINTI BASIRUN', 'TENGKU MOHAMMAD AIMAN B TENGKU MOHAMMAD FAUZAN', 'YETTE SURIANE BINTI MOHD BAHARUDDIN', 'FAATIMATUZZAHRAH BINTI HALIMUDIN', 'HAREENA A/P N.SIVAGANESE', 'MUHAMMAD HAFIZ BIN MOHD BASRI', 'NASIHA BT MOHD SHARIF', 'KHIRUL AMIR BIN ABU HASAN', 'DELSIE ANAK DAWI (PPKI)']),
    jk('JAWATANKUASA PENYELARAS APLIKASI PANGKALAN DATA MURID (MOEIS / IDME) HEM', "SITI 'AISYAH BINTI JAMALUDIN", 'MOHD ZULFADLI BIN YUSOF',
      ['NASIHA BT MOHD SHARIF', 'GURU KELAS DAN PENYELARAS TAHUN']),
  ]),
  'hem-jk-3': sec('KEBAJIKAN MURID / KWAPM & BAP', SUB, [
    jk('JAWATANKUASA PENGURUSAN KEBAJIKAN MURID', 'NORASHIKIN BINTI AZIZ', 'MOHD SHAKIR BIN ESUAN',
      ['SITI HAJAR BINTI ABA HADI (DATA)', 'GURU KELAS', "SITI NOOREHAN BINTI SA'IM (PPKI)"]),
    jk('JAWATANKUASA PENYELARAS KUMPULAN WANG AMANAH PELAJAR MISKIN (KWAPM) & BANTUAN AWAL PERSEKOLAHAN (BAP)', 'NORIDAYU BINTI NORDIN', 'SITI NORLIANA BINTI MOHD NOR',
      ['GURU KELAS']),
  ]),
  'hem-jk-4': sec('PROGRAM SUSU SEKOLAH / KANTIN', SUB, [
    jk('JAWATANKUASA PENGURUSAN PROGRAM SUSU SEKOLAH (PSS)', 'SARAH AQILAH BT JAMALULAIL', 'ZUBAIDAH BINTI DAUD KAIYIN',
      ['FAIZAH BT MOHD SAHAT', 'NORMALIZA BINTI RAMLI', 'SUGANIYA A/P ARNACHALAM', 'DARSHINI A/P GUNASAGARAN', 'SURINA BINTI MALEK', 'SITI RAFIDAH BINTI ABD RAHMAN', 'TUAN NOREHAN BINTI RAJA OTHMAN (PPKI)']),
    jk('JAWATANKUASA PENGURUSAN KANTIN', 'MASLINA BINTI JAMIYOU @ HJ ABDULLAH', 'FATIMAH BINTI AB LATIF',
      ['KAMARUNZAMAN BIN ADAM', 'MUHAMAD ALIFF BIN KAMAL AFFANDI', 'RAHANA BINTI MOHAMAD KHATIB', 'TENGKU MOHAMMAD AIMAN BIN TENGKU MOHAMMAD FAUZAN', 'AHMAD IZHAM BIN ABD GHANI', 'MUSAFARUDIN BIN OTHMAN', 'NOR BAZRIANA BINTI BADRI', 'SITI AISAH BINTI ABD KHANI (PPKI)']),
  ]),
  'hem-jk-5': sec('RANCANGAN MAKANAN TAMBAHAN (RMT)', SUB, [
    jk('JAWATANKUASA PENGURUSAN RANCANGAN MAKANAN TAMBAHAN (RMT)', 'NORMALIZA BINTI RAMLI', 'RAJA NUR SAZLIN BINTI RAJA SAFWAN',
      ['NORLAILA BT SALLEH', 'NOORAZILA BT ABDULLAH', 'NORASSKIN BT MOHAMED', 'NORIDAYU BT NORDIN', "NUR IZZAH 'ATIRAH BINTI HUDALLAH", 'TUAN NOREHAN BINTI RAJA OTHMAN (PPKI)', 'HUSNA AMIRA BT ISMAIL', 'NUR INSYIRAH NAJWA BINTI OTHMAN', 'NOOR HAMIMI BINTI ABDUL AZIZ', 'THIVANY A/P MANOGARAN', 'NORSUZERA BT ZAHARI', 'HAWA SYAHIRAH BINTI MOHD SAID', 'SINNTHU A/P PONNUSAMY', 'ZAHRAH BINTI MOHAMAD DAHLAN']),
  ]),
  'hem-jk-6': sec('BOSD / SPBT', SUB, [
    jk('JAWATANKUASA PENGURUSAN BILIK OPERASI SPBT DAERAH (BOSD)', 'NOORAZILA BINTI ABDULLAH', 'SITI FAREZZA BINTI ABD MUIS', []),
    jk('JAWATANKUASA PENGURUSAN SKIM PINJAMAN BUKU TEKS (SPBT)', 'RUZANA BINTI AHMAD', 'SALME BINTI SENIK',
      ['ZALIFAH BT MOHD ZAWAWI', 'MUHAMMAD HAFIZ BIN YUSOF', 'MUHAMMAD IZWAN BIN HALIM', 'NUR AQILAH BINTI KHALIT', 'ZUBAIDAH BT DAUD KAIYIN', 'MUHAMMAD HAZWAN BIN MD TAIB', 'MOHD HAIROS BIN DAUD (PPKI)']),
  ]),
  'hem-jk-7': sec('KEBERSIHAN & KECERIAAN / KESIHATAN & RAWATAN', SUB, [
    jk('JAWATANKUASA PENGURUSAN UNIT KEBERSIHAN DAN KECERIAAN', 'HAPINI BINTI ABDULL WAHAB', 'ZIRWATUL RAFIDAH BINTI RAHIM',
      ['NURAZIRA BINTI ABDULL HALIM', 'NUR IZRIN FARAH HANI BINTI ISMAIL', 'GRACE ANNE', "NURUL SYIFAA' BINTI ZAINOL (PPKI)"]),
    jk('JAWATANKUASA PENGURUSAN KESIHATAN DAN RAWATAN MURID', 'NORAZLIZA BINTI ISMAIL', 'ZATUSY SYAMAM BINTI SHARUDDIN',
      ['SITI SUHAILI BT ISMAIL', 'WAN MARFUZA BINTI WAN MOHD FUAT (PPKI)']),
  ]),
  'hem-jk-8': sec('PPDA / KESELAMATAN & KECEMASAN', SUB, [
    jk('JAWATANKUASA PENGURUSAN PPDA (PENDIDIKAN PENCEGAHAN DADAH)', 'NUR SAHIRA BINTI MOHD SOIB', 'HAWA SYAHIRAH BINTI MOHD SAID',
      ['NUR FAKHIRA BINTI JALALUDDIN', 'ROSLEEN BIN ABU BAKAR', 'MOHD ZAHIR BIN RAMLI', 'AHMAD IZHAM BIN ABD GHANI', 'SITI NOR AINIYAH BINTI RIDAWI']),
    jk('JAWATANKUASA PENGURUSAN KESELAMATAN DAN KECEMASAN', 'ZAIDI BIN OTHMAN', "MUHD AZIZI BIN AHMAD SHAMSUL MA'ARIF",
      ['SAHRULLIZAM BIN LIAS', 'BHARATHI USHA A/P MARTHEVEERAN', 'NORAZAH BINTI AB AZIZ @ HAMID', 'ANDREW ANAK ENTIPAN', 'TUAN MOHD KHAIRI BIN TUAN SOH (PPKI)']),
  ]),
  'hem-jk-9': sec('BAITULMAL / KEDAI BUKU SEKOLAH', SUB, [
    jk('JAWATANKUASA PENGURUSAN BAITULMAL', 'YAACOB BIN ISMAIL', 'ROSNAYA BINTI MAT ISA', ['GURU KELAS DAN PENYELARAS TAHUN']),
    jk('JAWATANKUASA PENYELARAS KEDAI BUKU', "AISAH BT SH'ARI", 'AZMI B MOHAMAD @ ALIAS', ['GURU KELAS']),
  ]),
  'hem-jk-10': sec('PENCEGAHAN DENGGI (COMBI)', SUB, [
    jk('JAWATANKUASA UNIT PENGURUSAN PENCEGAHAN DENGGI (COMBI)', 'MUHAMMAD HAZWAN BIN MD TAIB', 'MUHAMMAD IZWAN BIN HALIM',
      ['SHAREENA FATIHAH BINTI SHARIN', 'ALIF HAZIM BIN NAJIB', 'MOHD MAZNI BIN MAHASAN (PPKI)']),
  ]),
  'hem-tugas': sec('BIDANG TUGAS UNIT HAL EHWAL MURID', 'GARIS PANDUAN & BIDANG TUGAS', [
    p('Garis panduan dan bidang tugas bagi setiap unit di bawah Hal Ehwal Murid sesi 2026:'),
    ul(['Bimbingan dan Kaunseling', 'Disiplin Sekolah dan Unit Pengawas', 'Kebajikan Murid, KWAPM / BAP, Skim Tabungan dan Takaful serta Pencegahan Denggi (COMBI)', 'Pengurusan Kantin', 'Pengurusan RMT', 'Skim Pinjaman Buku Teks (SPBT)', 'Kesihatan dan Rawatan', 'Unit Keselamatan serta Kecerian dan Kebersihan Sekolah'], true),
  ]),
  'hem-tugas-1': sec('BIDANG TUGAS: DISIPLIN & PENGAWAS', 'GARIS PANDUAN & BIDANG TUGAS', [
    h('Disiplin Sekolah (Guru Disiplin) dan Unit Pengawas'),
    ul([
      'Menyediakan Buku Peraturan Sekolah dan Carta Aliran Tindakan tatatertib murid.',
      'Membuat kajian dari semasa ke semasa bagi tujuan menyempurnakan pelaksanaan peraturan tatatertib murid.',
      'Membantu ahli lembaga pengawas melantik pengawas-pengawas serta membuat penilaian pengawas yang dilantik dari semasa ke semasa.',
      'Mengesyorkan tindakan tatatertib / disiplin tertentu atas kesalahan-kesalahan yang dilakukan oleh murid untuk pertimbangan Guru Besar.',
      'Menentukan syarat-syarat yang harus dipatuhi oleh seorang pengawas.',
      'Mengadakan mesyuarat tatatertib yang dibuat oleh sebarang badan lembaga di lingkungan sekolah sebelum dikuatkuasakan.',
      'Membantu Guru Besar merangka atau membuat peraturan-peraturan sekolah.',
      'Menentukan peraturan-peraturan sekolah dipatuhi sepanjang masa kegiatan / aktiviti dijalankan sama ada di dalam atau di luar sekolah.',
      'Menjadi penyelaras di antara guru dan Guru Besar dalam hal disiplin murid-murid.',
      'Melaporkan kepada pihak pentadbir mengenai murid-murid yang melanggar disiplin sekolah sebagai langkah terakhir dan membantu Guru Besar mengatasinya.',
      'Menjalankan hukuman disiplin sekiranya diwakilkan oleh Guru Besar.',
      'Membuat “Spot Check” atau pemeriksaan mengejut sebanyak 4 kali setahun.',
      'Menjadi Pegawai Perhubungan di antara pihak sekolah dengan ibu bapa / penjaga dalam menangani masalah disiplin.',
      'Membantu Guru Besar menimbulkan semangat kesetiaan, kekitaan dan kekeluargaan dalam kalangan murid-murid dan guru-guru dalam menyemai dan memupuk rasa kebanggaan kepada sekolah.',
      'Menerima laporan pengawas, guru-guru dan seterusnya mengenai masalah disiplin yang dilakukan oleh murid-murid dan mengambil tindakan yang sesuai.',
      'Bertanggungjawab ke atas imej sekolah dengan menentukan dan memastikan perlakuan murid-murid sesuai dengan peraturan sekolah dan kehendak masyarakat sekeliling.',
      'Berusaha menanam semangat patuh dan taat setia kepada peraturan sekolah serta mengamalkan prinsip-prinsip Rukun Negara.',
      'Menjalankan tugas yang diarahkan oleh Guru Besar.',
      'Mengadakan kempen hormat guru.',
      'Menjalankan rondaan untuk mengesan murid yang ponteng dan melanggar disiplin serta mengadakan “spot check”.',
      'Menyedia dan membekalkan data dan maklumat disiplin kepada Kementerian / PPD.',
      'Bersedia bertugas pada bila-bila masa terutama pada hari-hari yang difikirkan perlu. Memastikan semua pengawas sentiasa dalam keadaan berpakaian kemas dan bersih.',
    ], true),
  ]),
  'hem-tugas-2': sec('BIDANG TUGAS: BIMBINGAN & KAUNSELING', 'GARIS PANDUAN & BIDANG TUGAS', [
    ul([
      'Menyediakan rancangan tahunan program dan aktiviti perkhidmatan Bimbingan di sekolah.',
      'Mengenal pasti keperluan perkhidmatan Bimbingan dan Kaunseling sekolah melalui kajian keperluan, soal selidik, temu bual dan perbincangan dengan murid, guru, pentadbir, kakitangan sekolah, ibu bapa dan bukan murid.',
      'Merancang, mengawal selia dan mengemas kini inventori murid.',
      'Mengumpul, menyelia, menyebar maklumat Bimbingan dan Kaunseling kepada semua murid melalui sebarang media yang sesuai.',
      'Mengelola dan melaksanakan aktiviti Bimbingan Kelompok dan tunjuk ajar (instructional) yang merangsang perkembangan murid secara optimum.',
      'Merancang, melaksana, mengawal selia perkhidmatan bimbingan / kaunseling individu secara profesional dan beretika.',
      'Merancang, melaksana, mengawal selia aktiviti kemahiran belajar untuk semua murid.',
      'Merancang, melaksana, mengawal selia serta menilai program dan aktiviti selepas peperiksaan UASA.',
      'Merancang, melaksana, mengawal selia, menilai program dan aktiviti pendidikan pencegahan dadah, inhalan, rokok dan alkohol.',
      'Merancang, melaksana, mengawal selia, menilai program dan aktiviti perkhidmatan konsultasi serta rujukan, berhubung Bimbingan Kerjaya dan Pencegahan Dadah.',
      'Merancang, melaksana, mengawal selia, menilai program dan aktiviti konferens dengan ibu bapa, guru, kakitangan bukan guru, serta agensi kerajaan dan bukan kerajaan yang terlibat dalam proses pendidikan dan perkembangan murid.',
      'Membuat penilaian aktiviti, modul, instrumen, pendekatan dan sebagainya secara menyeluruh bagi meningkatkan mutu dan profesionalisme perkhidmatan Bimbingan di sekolah.',
      'Merancang, menyelaras dan menilai sumber dan bahan resos perkhidmatan Bimbingan di sekolah.',
      'Menjadi Urus Setia kepada Jawatankuasa Penyelaras Perkhidmatan Bimbingan di sekolah.',
      'Menjadi penggerak utama dalam program latihan dalaman bagi menyebarkan kefahaman dan peningkatan profesionalisme perkhidmatan Bimbingan dan Kaunseling di sekolah.',
      'Mengenal pasti dan merujuk murid, guru, kakitangan dan sesiapa sahaja yang memerlukan perkhidmatan kaunseling krisis.',
      'Menjadi pegawai perhubungan sekolah dengan agensi-agensi luar yang berkaitan.',
      'Menjadi ahli Jawatankuasa ex-officio dalam jawatankuasa kurikulum sekolah.',
      'Menjadi ahli Jawatankuasa dalam Majlis Perancangan Sekolah.',
      'Menjadi penyelaras dalam program mentor-mentor sekolah.',
      'Menjadi penyelaras dalam program-program pengembangan murid seperti kolokium, motivasi, kem jaya diri, kursus ketatanegaraan dan sebagainya.',
      'Menjadi penyelaras program-program yang dianjurkan oleh Unit Bimbingan dan Kaunseling, Jabatan Pendidikan Negeri.',
      'Melaksanakan tugas-tugas yang diarahkan oleh Ketua Jabatan dari semasa ke semasa.',
    ], true),
  ]),
  'hem-tugas-3': sec('BIDANG TUGAS: KESIHATAN & RAWATAN', 'GARIS PANDUAN & BIDANG TUGAS', [
    ul([
      'Menguruskan kemudahan rawatan murid dan memastikan program-program kesihatan murid dijalankan dengan sempurna seperti rekod kesihatan murid.',
      'Mengurus dan memastikan bilik rawatan dan peti ubat disediakan dan dilengkapi.',
      'Memastikan program-program kesihatan murid dijalankan dengan sempurna.',
      'Mengumpulkan dan menguruskan kad kesihatan dengan kerjasama guru kelas / penyelaras kelas.',
      'Menentukan semua murid sihat daripada penyakit-penyakit berjangkit semasa berada di sekolah.',
      'Jika terdapat laporan atau diketahui murid-murid sakit berjangkit berada di sekolah, hendaklah berikhtiar menghantarnya balik ke rumah atau ke hospital dan mengambil langkah-langkah keselamatan seterusnya.',
      'Berikhtiar mencegah murid-murid daripada menyimpan kutu di kepala.',
      'Menyelaras dan membereskan urusan-urusan pergigian dengan klinik gigi.',
      'Menjaga keselesaan dan kekemasan Bilik Sakit dan Klinik Gigi.',
      'Merancang dan mengadakan program kesihatan seperti lawatan, tayangan, ceramah-ceramah dan pameran kesihatan tentang penyalahgunaan dadah. Urusan ini boleh juga digabungkan dengan bahagian-bahagian lain seperti bimbingan dan kaunseling.',
      'Memastikan tiap-tiap bilik praktikal dan bilik sakit mempunyai kotak pertolongan cemas yang sentiasa lengkap pada setiap masa.',
      'Bertanggungjawab menguruskan pemeriksaan kesihatan / gigi oleh Jabatan Kesihatan. Menyelaras semua aktiviti kesihatan murid.',
      'Menyediakan jadual tugas bilik rawatan / rawatan murid yang memerlukan rawatan.',
      'Menjalankan daya usaha yang lain untuk kesihatan murid dan kesihatan umum, misalnya mencegah pembiakan nyamuk.',
      'Menguruskan murid-murid yang memerlukan rawatan. Bekerjasama dengan guru bertugas harian untuk mendapatkan rawatan doktor bagi murid sakit, demam atau kecederaan ringan dengan menghantar pulang, ke hospital atau klinik. Ibu bapa / penjaga murid mestilah diberitahu serta-merta. Anda adalah ibu bapa murid semasa berada di sekolah.',
    ], true),
    h('Menyelaras program dan aktiviti kesihatan, kebersihan murid dan sekolah'),
    ul([
      'Kebersihan diri murid-murid', 'Kebersihan pakaian murid', 'Bilik-bilik darjah', 'Bangunan dan kawasan sekolah',
      'Lain-lain bangunan seperti tandas, kantin dan sebagainya', 'Aktiviti kesihatan yang ditaja atau dianjurkan oleh Jabatan Kerajaan, Jabatan Kesihatan, agensi swasta dan NGO',
    ]),
    h('Buku Kesihatan'),
    ul([
      'Setiap murid wajib mempunyai Buku Rekod Kesihatan. Buku ini akan dibawa ke sekolah menengah.',
      'Bekerjasama dengan guru-guru kelas untuk menguruskan dan menyelaras kad kesihatan murid dan perkara-perkara yang berkaitan dengannya.',
      'Ukuran tinggi dan berat serta pemeriksaan mata hendaklah dibuat setiap tahun oleh guru kelas.',
      'Buku yang hilang mestilah diganti (laporan kepada GPK HEM).',
      'Menyimpan rekod dan menyediakan laporan berkala dan tahunan.',
    ], true),
  ]),
  'hem-tugas-4': sec('BIDANG TUGAS: KEBAJIKAN MURID & COMBI', 'GARIS PANDUAN & BIDANG TUGAS', [
    h('Kebajikan Murid, KWAPM / BAP, Skim Tabungan, Takaful'),
    p('Menyediakan borang permohonan, mengumpul data dan menyimpan rekod murid-murid yang telah dikenal pasti yang memerlukan bantuan khusus seperti murid miskin, kemalangan, kematian dan kecemasan / bencana.'),
    ul([
      'Merancang, mengurus dan menyelia program yang berkaitan dengan kebajikan murid seperti sumbangan kematian ibu bapa murid dan murid yang ditimpa kemalangan teruk; sumbangan yuran, pakaian dan alat tulis kepada murid yang tidak berkemampuan; dan sumbangan hari raya untuk anak-anak yatim dan fakir miskin.',
      'Mengurus, mengelola dan menyalurkan sumbangan derma daripada pihak kerajaan dan pihak individu seperti Bantuan KWAPM, Jabatan Kebajikan Masyarakat dan Pusat Zakat.',
      'Mengurus penyertaan Skim Insurans Murid dan Program Menabung.',
      'Merancang dan mengadakan projek untuk mengisi Tabung Kebajikan.',
      'Mengeluarkan bantuan dalam bentuk kewangan, pakaian, peralatan dan lain-lain.',
      'Menguruskan semua derma dan bantuan dalam / luar dari semasa ke semasa.',
      'Mengenal pasti badan kebajikan / individu / peristiwa malapetaka yang memerlukan bantuan kewangan / benda.',
      'Mengadakan daftar sumbangan dan daftar penerima yang dikemas kini dan disahkan oleh Guru Besar.',
      'Menubuhkan Tabung Kebajikan Murid.',
      'Menubuhkan Unit Hilang / Jumpa bagi murid yang tercicir persekolahan.',
      'Mengelakkan murid-murid melibatkan diri dalam aktiviti badan kebajikan luar.',
      'Menyediakan laporan di akhir tahun.',
    ], true),
    h('Pencegahan Denggi (COMBI)'),
    ul([
      'Merancang dan melaksanakan pelan tindakan pencegahan pembiakan nyamuk Aedes ke arah menjadikan kawasan sekolah sebagai kawasan bebas denggi.',
      'Memberi garis panduan kepada guru bagi menyelaras aktiviti pendidikan pencegahan denggi dan peranan murid sebagai agen perubahan di sekolah, rumah dan masyarakat.',
      'Menyebar maklumat tentang bahaya nyamuk Aedes dan demam denggi dalam pelbagai kaedah dan media.',
      'Melibatkan pihak luar seperti agensi kerajaan dan swasta dalam merancang serta melaksanakan program pencegahan denggi.',
      'Memantau dan melaporkan pelaksanaan Pendidikan Pencegahan Denggi di sekolah kepada Pejabat Pendidikan Daerah.',
      'Memantau, melapor dan merujuk kes-kes yang disyaki demam denggi kepada pihak berkenaan.',
      'Membuat laporan mingguan dan bulanan kepada PPD / GPK HEM.',
      'Melengkapkan Borang KD1 dan KD2 untuk pemantauan dan laporan ke PPD dan Pejabat Kesihatan Daerah.',
    ], true),
  ]),
  'hem-tugas-5': sec('BIDANG TUGAS: PENGURUSAN KANTIN', 'GARIS PANDUAN & BIDANG TUGAS', [
    ul([
      'Memastikan pengusaha kantin mematuhi peraturan dan pekeliling Kementerian Pendidikan / Kesihatan.',
      'Memastikan jenis-jenis makanan dan minuman yang dijual mengikut syarat perjanjian.',
      'Memastikan mutu makanan dan harga jualan berpatutan mengikut syarat-syarat perjanjian dan senarai harga dipamerkan.',
      'Memastikan makanan halal.',
      'Memastikan penyediaan dan peralatan yang digunakan bersih dan selamat serta menggunakan penyepit untuk mengambil makanan.',
      'Memastikan keadaan luar dan dalam kantin sentiasa bersih, kemas dan ceria.',
      'Memastikan semua pekerja kantin telah menjalani pemeriksaan kesihatan dan memiliki kad kesihatan yang sah.',
      'Memastikan pihak pengusaha kantin berada di premis supaya mudah dihubungi.',
      'Memastikan semua penjual dan kakitangan kantin sentiasa memakai apron, tutup kepala dan kemas mengikut pekeliling Kementerian Kesihatan.',
      'Memastikan semua makanan ditutup dengan tudung saji / kain muslin / disimpan dalam bekas yang bertutup.',
      'Memaklumkan kepada pihak pengusaha tentang hari-hari persekolahan.',
      'Memastikan murid dan guru mempunyai tempat duduk yang mencukupi, selamat dan sesuai.',
      'Memastikan makanan yang disediakan untuk harian mencukupi.',
      'Membuat laporan bulanan kepada Guru Besar / GPK HEM tentang prestasi kantin.',
      'Mengadakan mesyuarat jawatankuasa 3 kali setahun dan perbincangan dari semasa ke semasa.',
      'Membuat laporan mingguan di dalam buku / borang laporan kantin.',
      'Memastikan perkhidmatan dan layanan cepat dan mesra.',
      'Memastikan murid-murid beratur semasa membeli.',
    ], true),
    h('Keceriaan Kantin'),
    ul([
      'Mengadakan program keceriaan di persekitaran kantin.',
      'Memastikan setiap bahagian di kantin diselenggarakan dengan baik untuk menghasilkan kawasan kantin yang bersih, cantik dan menarik.',
      'Membantu dalam merancang dan meningkatkan kebersihan dan keceriaan kantin.',
      'Penasihat kepada pekerja-pekerja kantin dan Penyelia Kantin.',
      'Menjaga kebersihan keseluruhan bangunan dan kawasan kantin.',
    ]),
  ]),
  'hem-tugas-6': sec('BIDANG TUGAS: SKIM PINJAMAN BUKU TEKS', 'GARIS PANDUAN & BIDANG TUGAS', [
    h('Mesyuarat & Pembahagian Tugas'),
    ul([
      'Mengadakan mesyuarat Jawatankuasa Buku Teks dua kali, iaitu pada awal dan akhir tahun.',
      'Pembahagian tugas pagi dan petang; taklimat untuk guru kelas; pembahagian tugas pentadbiran.',
      'Buku stok (mengikut tahun): buku rosak / hilang.',
      'Pengedaran / pengumpulan: menubuhkan pasukan bertugas SPBT (murid).',
    ]),
    h('Borang Permohonan SPBT'),
    ul([
      'Mengedarkan borang kepada setiap murid.',
      'Borang yang lengkap dikumpulkan oleh guru kelas dan diserahkan kepada guru SPBT.',
    ]),
    h('Pesanan Buku'),
    ul([
      'Membuat pesanan pada pertengahan tahun melalui Biro Buku Teks.',
      'Mencadangkan pertukaran buku pada awal tahun.',
      'Membuat anggaran yang tepat untuk tahun berikutnya.',
      'Mengisi borang bermaklumat komputer dan menghantar mengikut jadual.',
    ]),
    h('Pengedaran'),
    ul([
      'Mengedar mengikut kelas dan menentukan tarikh pengedaran.',
      'Mengesan kelancaran pengedaran.',
      'Mendapatkan borang daripada murid yang baru masuk / bertukar sekolah.',
      'Memastikan setiap guru kelas telah mengagihkan buku pinjaman kepada murid yang layak.',
      'Memastikan semua guru darjah telah melengkapkan borang pinjaman SPBT / Borang G mengikut jadual.',
    ]),
    h('Pengurusan Rekod, Dokumen & Bilik SPBT'),
    ul([
      'Menyelenggarakan fail yang dikemas kini (mengikut darjah).',
      'Merekod buku stok yang dikemas kini (mengikut kelas).',
      'Menyediakan senarai tugas guru pengedaran / pengumpulan.',
      'Menyimpan rekod buku hapus kira, rosak dan hilang.',
      'Memastikan ada Bilik SPBT; mengurus dan menghiasi bilik operasi SPBT serta membuat peraturan penggunaan Bilik SPBT.',
      'Memastikan murid membalut buku SPBT, menjaga kebersihan, tidak mencontengnya serta menulis nama, kelas dan tahun di petak yang disediakan.',
      'Guru kelas perlu sentiasa memantau penggunaan buku teks.',
    ]),
    h('Pengurusan Pemulangan SPBT'),
    ul([
      'Menentukan tarikh pemulangan mengikut kelas.',
      'Menyediakan senarai kepada Guru Besar / HEM untuk memaklumkan tentang proses pemulangan: peratus rosak (mengenal pasti murid yang hilang buku dan menguruskan wang gantinya), peratus hapus kira (buku bantuan yang tidak diperlukan) dan kekurangan (buku mengikut subjek / kelas / tahun).',
    ]),
    h('Pengurusan Stok & Inventori'),
    ul([
      'Menguruskan surat-menyurat kepada Biro Buku Teks dan Jabatan Pendidikan.',
      'Menyimpan invois, bil dan pengesahan.',
      'Melengkapkan Buku Stok dan menyimpan dokumen dengan teratur dan selamat.',
      'Mengemas kini inventori SPBT.',
      'Mengisi borang maklumat kekurangan / kelebihan buku ke PPD.',
      'Memberi pinjaman buku-buku teks kepada guru-guru dan merekodkannya dalam buku teks.',
    ]),
  ]),
  'hem-tugas-7': sec('BIDANG TUGAS: KESELAMATAN & KEBERSIHAN', 'GARIS PANDUAN & BIDANG TUGAS', [
    h('Unit Keselamatan'),
    ul([
      'Merancang langkah-langkah keselamatan bersama Guru Besar.',
      'Bersama-sama dengan Guru Besar, merancang dan melaksanakan Latihan Mencegah Kebakaran / Latihan Kebakaran dan kegiatan-kegiatan seumpamanya 2 tahun sekali.',
      'Jurujual dikehendaki berurusan dahulu dengan pejabat dan mendapat kebenaran secara bertulis daripada Guru Besar untuk berjumpa guru-guru.',
      'Menyelaras program-program kebakaran, keselamatan, keceriaan, kebersihan dan program lain di peringkat sekolah.',
      'Memastikan langkah-langkah keselamatan murid semasa berada di sekolah dilaksanakan.',
      'Meletakkan tanda amaran “BAHAYA” di tempat-tempat yang berbahaya.',
      'Memastikan peraturan keselamatan ditampal di bilik-bilik khas, bilik darjah dan di dalam buku latihan murid.',
      'Merancang pergerakan lalu lintas murid dan kenderaan di tempat letak kenderaan pada masa majlis rasmi sekolah.',
      'Menetapkan laluan tertentu untuk murid bagi mengelakkan kesesakan.',
      'Merancang dan melaksanakan program keselamatan sepanjang tahun seperti keselamatan lalu lintas, keselamatan bangunan dan perabot, serta keselamatan di makmal, bengkel dan lain-lain bilik khas.',
      'Memastikan semua suis, alat elektrik dan pendawaian selamat.',
      'Memastikan alat pemadam api mencukupi, berfungsi dan boleh digunakan, sama ada jenis silinder atau tradisional (baldi dan pasir).',
      'Mengadakan latihan kecemasan / kebakaran / mengosongkan bangunan sekurang-kurangnya sekali sepenggal / semester / 2 kali setahun.',
      'Mengadakan kempen keselamatan jalan raya dan memastikan sistem lalu lintas di kawasan sekolah dan kawasan berhampiran selamat.',
      'Menyediakan ubat untuk pertolongan cemas.',
      'Mengadakan ceramah tentang kebakaran / keselamatan jalan raya dan pertolongan cemas.',
      'Menggalakkan skim perlindungan diri kepada murid.',
    ], true),
    h('Unit Keceriaan & Kebersihan Sekolah'),
    ul([
      'Mengadakan program keceriaan di persekitaran sekolah.',
      'Memastikan setiap bahagian kawasan di sekolah diselenggarakan dengan baik untuk menghasilkan kawasan sekolah yang bersih, cantik dan menarik.',
      'Membantu dalam merancang dan meningkatkan kebersihan dan keceriaan sekolah.',
      'Penasihat kepada pekerja-pekerja kebun sekolah dan pekerja am sekolah.',
      'Menjaga kebersihan keseluruhan bangunan dan kawasan sekolah.',
      'Menentukan dan mengagihkan tugas guru-guru dan murid semasa gotong-royong sekolah dijalankan.',
      'Menghubungi Majlis Daerah atau DBKL untuk memohon bantuan seperti lori sampah, tebang pokok dan pinjaman alat-alat bantuan.',
    ], true),
  ]),
  'hem-tugas-8': sec('BIDANG TUGAS: PENGURUSAN RMT', 'GARIS PANDUAN & BIDANG TUGAS', [
    ul([
      'Mengadakan mesyuarat Jawatankuasa RMT.',
      'Mengedarkan borang maklumat murid (RMT) kepada murid yang layak. Pemilihan murid RMT dibuat dengan bantuan guru-guru kelas berpandukan pendapatan penjaga dan bilangan adik-beradik.',
      'Menentukan murid-murid yang layak sahaja menerima bantuan RMT. Semua borang hendaklah disimpan untuk diaudit (Borang KP/RMT/C atau C1). Pengesahan borang hendaklah dilakukan oleh majikan, wakil rakyat, Pegawai Daerah, Ketua Kampung dan Pegawai Kanan Kerajaan Kategori A.',
      'Memilih menu yang dikeluarkan oleh Kementerian Pendidikan Malaysia. Sekolah dikehendaki memilih 10 jenis untuk digunakan sepanjang 2 minggu.',
      'Menyediakan jadual tugas guru mengawasi murid; guru yang bertugas mesti mencatat kedatangan murid dalam buku rekod kedatangan murid RMT.',
      'Mencari pengganti sekiranya peserta RMT tidak hadir ke sekolah. Memastikan semua murid RMT makan.',
      'Menyediakan surat kepada penjaga murid menyatakan bahawa anak jagaannya menyertai Program RMT.',
      'Memberi taklimat kepada murid-murid RMT mengapa mereka dipilih menyertai RMT, datang awal, ambil kedatangan, tarikh makan dan lain-lain.',
      'Membantu pihak kantin menyediakan makanan dan mengawasi murid makan di kantin.',
      'Memastikan makanan yang disediakan berpatutan dengan harga dan mengikut menu yang diberi.',
      'Membuat laporan RMT pada pertengahan tahun dan akhir tahun. Laporan ini hendaklah dihantar ke PPD / JPN. Mengemas kini buku kedatangan RMT seperti bilangan murid RMT hadir, peratus kehadiran dan lain-lain. Guru RMT menandatangani buku ini dan diserahkan kepada Guru Besar untuk dilihat dan ditandatangani.',
      'Mengira bilangan hari RMT pada semester 1 dan semester 2. Pembayaran kepada pihak kantin berdasarkan bilangan hari RMT.',
      'Membuat laporan / dokumentasi RMT pada akhir tahun.',
    ], true),
  ]),
});
