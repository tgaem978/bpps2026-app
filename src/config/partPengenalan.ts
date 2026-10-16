/* Halaman Pengenalan (daripada PDF "A-PENGENALAN (MS 4-17)") ditaip semula sebagai kandungan boleh sunting:
 * perenggan, senarai dan jadual mengikut gaya BPPS. Tiada gambar. */
import type { Block, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

const SUB = 'PENGENALAN';
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string, align: 'left' | 'center' | 'justify' = 'justify', bold = false): Block => ({ id: uid(), type: 'paragraph', text, align, ...(bold ? { bold: true } : {}) });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });
/** Jadual biru gelap; `numbered` = lajur BIL automatik. */
const tbl = (columns: string[], rows: string[][], numbered = false): Block => ({ id: uid(), type: 'table', style: 'navy', numbered, columns, rows });
const sec = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: SUB, layout: 'standard', blocks, updatedAt: null });

export const partPengenalanSections = (): Record<string, SectionContent> => ({
  'b-rukun-negara': sec('RUKUN NEGARA & FALSAFAH PENDIDIKAN KEBANGSAAN', [
    p('Maka kami rakyat Malaysia berikrar akan menumpukan seluruh tenaga dan usaha kami untuk mencapai cita-cita tersebut berdasarkan prinsip-prinsip yang berikut:'),
    tbl(['PRINSIP RUKUN NEGARA'], [['Kepercayaan kepada Tuhan'], ['Kesetiaan kepada Raja dan Negara'], ['Keluhuran Perlembagaan'], ['Kedaulatan Undang-Undang'], ['Kesopanan dan Kesusilaan']], true),
    h('Falsafah Pendidikan Kebangsaan'),
    p('Pendidikan di Malaysia adalah suatu usaha berterusan ke arah memperkembangkan lagi potensi individu secara menyeluruh dan bersepadu untuk mewujudkan insan yang seimbang dan harmonis dari segi intelek, rohani, emosi dan jasmani berdasarkan kepercayaan dan kepatuhan kepada Tuhan. Usaha ini adalah bagi melahirkan rakyat Malaysia yang berilmu pengetahuan, berketerampilan, berakhlak mulia, bertanggungjawab dan berkeupayaan mencapai kesejahteraan diri serta memberikan sumbangan terhadap keharmonian dan kemakmuran masyarakat dan negara.'),
    tbl(['UNSUR INSAN YANG SEIMBANG DAN HARMONIS'], [['Intelek'], ['Rohani'], ['Emosi'], ['Jasmani']], true),
    p('Kami, guru-guru Malaysia, yakin bahawa tujuan utama pendidikan ialah berusaha menuju ke arah pembentukan warganegara yang berilmu, yang taat setia, yang bertanggungjawab dan berkebolehan, yang menyedari betapa pentingnya usaha menuju ke arah kebenaran dan ke arah pencapaian hasrat yang gemilang, dan yang percaya demokrasi, kebebasan perseorangan dan Prinsip-Prinsip Rukun Negara.'),
    p('Melalui pendidikan, masyarakat dapat membantu anak mudanya memahami kebudayaan mereka, memperoleh pengetahuan yang telah terkumpul sejak berzaman, dan menyediakan mereka untuk menghadapi cabaran pada masa hadapan. Dengan menyedari betapa besarnya tanggungjawab membimbing anak muda untuk mencapai kemajuan sepenuh-penuhnya, maka dengan ini kami menerima tatasusila berikut sebagai panduan untuk membolehkan kami menyempurnakan profesion kami ke taraf kesusilaan yang setinggi-tingginya.'),
  ]),
  'b-aku-janji': sec('SURAT AKU JANJI', [
    p('**KEMENTERIAN PENDIDIKAN**', 'center'),
    p('Saya, ………………………………………………………… No. Kad Pengenalan …………………………………………\nberalamat di ……………………………………………………………………………………………………………………', 'left'),
    p('dengan sesungguhnya berjanji bahawa saya akan mematuhi peruntukan Peraturan-Peraturan Pegawai (Kelakuan dan Tatatertib) 1993, Perintah-Perintah Am, pekeliling dan surat pekeliling, peraturan dan arahan lain yang dikeluarkan dan dikuatkuasakan oleh Kerajaan dari semasa ke semasa sepanjang tempoh perkhidmatan saya dengan Kerajaan. Maka dengan itu saya berjanji, sebagaimana yang dikehendaki oleh peraturan 4 Peraturan-Peraturan Pegawai (Kelakuan dan Tatatertib) 1993, bahawa saya:'),
    ...[
      '(i) akan sentiasa taat kepada Yang di-Pertuan Agong, negara dan Kerajaan;',
      '(ii) akan sentiasa melaksanakan tugas saya sebagai pegawai dengan cermat, bersungguh-sungguh, cekap, jujur, amanah dan bertanggungjawab;',
      '(iii) tidak akan membelakangkan tugas awam demi kepentingan peribadi saya;',
      '(iv) tidak akan berkelakuan dengan cara yang mungkin menyebabkan kepentingan peribadi saya bercanggah dengan tugas awam saya;',
      '(v) tidak akan berkelakuan dengan cara yang boleh menimbulkan syak yang munasabah bahawa saya telah membiarkan kepentingan peribadi saya bercanggah dengan tugas rasmi saya sehingga menjejaskan kebergunaan saya sebagai pegawai;',
      '(vi) tidak akan menggunakan kedudukan saya sebagai pegawai bagi faedah diri saya sendiri;',
      '(vii) tidak akan berkelakuan dengan cara yang boleh memburukkan atau mencemarkan nama perkhidmatan awam;',
      '(viii) tidak akan membawa atau cuba membawa sebarang bentuk pengaruh atau tekanan luar untuk menyokong atau memajukan tuntutan saya atau tuntutan pegawai lain yang berhubungan dengan perkhidmatan awam; dan',
      '(ix) tidak akan ingkar perintah atau berkelakuan dengan cara yang boleh ditafsirkan sebagai ingkar perintah.',
    ].map((t): Block => ({ id: uid(), type: 'paragraph', text: t, align: 'justify', indent: 1 })),
    p('Saya sesungguhnya faham bahawa jika saya disabitkan kerana telah melanggar Aku Janji ini, saya boleh dikenakan tindakan tatatertib mengikut Peraturan-Peraturan Pegawai (Kelakuan dan Tatatertib) 1993.'),
    tbl(['TANDATANGAN PEGAWAI', 'JAWATAN PEGAWAI'], [['………………………………………', '………………………………………']]),
    p('Di hadapan saya,', 'center'),
    tbl(['TANDATANGAN KETUA JABATAN', 'NAMA DAN NO. KAD PENGENALAN KETUA JABATAN'], [['………………………………………', '………………………………………']]),
    tbl(['TARIKH', 'CAP RASMI JABATAN'], [['………………………………………', '………………………………………']]),
    p('**Nombor Rujukan:** ', 'left'),
  ]),
  'b-teras': sec('TERAS PERKHIDMATAN AWAM & BUDAYA KERJA SEKOLAH', [
    h('Teras Perkhidmatan Awam'),
    tbl(['TERAS'], [
      ['Bekerja dengan penuh tanggungjawab.'],
      ['Berusaha mengikis sikap mementingkan diri sendiri.'],
      ['Berkhidmat dengan penuh muhibah dan kemesraan.'],
      ['Bekerja ke arah memajukan pemikiran rakyat dan pembangunan negara.'],
      ['Berpegang teguh kepada ajaran agama.'],
      ['Bekerjasama membanteras kelemahan dan musuh-musuh negara.'],
    ], true),
    h('Budaya Kerja Sekolah'),
    tbl(['BUDAYA KERJA'], [
      ['Memahami dan menghayati:\n1.1 Falsafah Pendidikan Kebangsaan\n1.2 Falsafah, Matlamat dan Objektif Sekolah'],
      ['Memelihara dan mempertingkatkan imej Sekolah, Jabatan dan Kementerian Pelajaran setiap masa.'],
      ['Mementingkan mutu dan kesan pendidikan.'],
      ['Menentukan Objektif (setiap tugas).'],
      ['Mengamalkan kerja sepasukan secara bermesyuarat.'],
      ['Sentiasa bekerja dengan bersih, cekap dan amanah.'],
      ['Mengamalkan sikap jujur, ikhlas, amanah, serta adil.'],
      ['Mengamalkan perkhidmatan penyayang.'],
      ['Kepimpinan melalui teladan.'],
      ['Sentiasa memimpin dan menilai diri sendiri.'],
      ['Berusaha mempertingkatkan ilmu dan kemahiran.'],
      ['Kerja adalah ibadah.'],
    ], true),
  ]),
  'b-ikrar': sec('IKRAR PERKHIDMATAN AWAM & IKRAR INTEGRITI', [
    h('Ikrar Perkhidmatan Awam'),
    p('**Kami yang telah dilantik berkhidmat dengan kerajaan Malaysia membuat ikrar di sini bahawa semasa dan selagi kami berkhidmat dengan Kerajaan, kami akan patuh dengan mengamalkan teras-teras perkhidmatan semasa menjalankan tugas. Ke arah ini kami:**'),
    ul(['Berazam meningkatkan mutu perkhidmatan;', 'Bekerja dengan penuh tanggungjawab;', 'Berusaha mengikis sikap mementingkan diri sendiri;', 'Berkhidmat dengan penuh muhibah dan kemesraan;', 'Bekerja ke arah memajukan pemikiran rakyat dan pembangunan negara;', 'Bekerjasama dalam membanteras kelemahan dan musuh-musuh negara;', 'Berpegang teguh kepada ajaran agama.']),
    h('Ikrar Integriti Perkhidmatan Awam'),
    p('**Kami, pegawai awam Malaysia, dengan sepenuh dan rela hati berikrar mempertahankan dan memperkukuhkan integriti perkhidmatan awam dengan mencegah dan membenteras segala bentuk rasuah, salah guna kuasa dan penyelewengan melalui tindakan yang berikut:**'),
    kv([
      ['Pertama', 'Berusaha memupuk dan mengamalkan nilai-nilai membenci rasuah.'],
      ['Kedua', 'Menutup semua ruang dan peluang yang mendedahkan kepada amalan rasuah.'],
      ['Ketiga', 'Bertindak tegas terhadap mereka yang melanggar undang-undang, peraturan dan etika jabatan.'],
      ['Keempat', 'Bekerjasama sepenuhnya dengan mana-mana pihak untuk memerangi sebarang perlakuan jenayah rasuah.'],
      ['Kelima', 'Bertindak tegas terhadap mereka yang cuba menggugat integriti dan imej pegawai awam; dan'],
      ['Keenam', 'Mematuhi sepenuhnya kod etika jabatan dan mengamalkan nilai-nilai murni yang berteraskan ajaran agama dalam melaksanakan tugas.'],
    ]),
  ]),
  'b-fokus': sec('FOKUS PENGURUSAN PENDIDIKAN', [
    tbl(['FOKUS PENGURUSAN PENDIDIKAN'], [
      ['Pengetua dan Guru Besar yang Berkesan'], ['Sekolah yang Berkesan'], ['Guru yang Profesional'], ['Kurikulum yang Relevan'],
      ['Sistem Penilaian dan Peperiksaan'], ['Pembinaan Infrastruktur Sokongan Pengajaran dan Pembelajaran'],
      ['Pembinaan Institusi Perancangan dan Penyelidikan'], ['Pembinaan Sistem Institusi Perlaksanaan dan Pemantauan yang Berkesan: Sistem Pentadbiran'],
      ['Pembangunan Staf yang Komprehensif'], ['Pembinaan Hubungan Luar dan Masyarakat'],
    ], true),
  ]),
  'b-ithink': sec('KBAT: PETA PEMIKIRAN i-THINK', [
    tbl(['PETA PEMIKIRAN', 'KEGUNAAN'], [
      ['Peta Bulatan', 'Mendefinisi ikut konteks'], ['Peta Buih', 'Menerangkan dengan adjektif'], ['Peta Buih Berganda', 'Membanding beza'], ['Peta Pokok', 'Membuat pengelasan'],
      ['Peta Dakap', 'Hubungan bahagian'], ['Peta Alir', 'Menyusun secara urutan'], ['Peta Pelbagai Alir', 'Sebab dan akibat'], ['Peta Titi', 'Hubungan yang sama'],
    ], true),
    p('Lapan Proses Pemikiran dibangunkan melalui alat berfikir visual, iaitu Peta Pemikiran yang memudahkan murid-murid dalam memahami konsep, menganalisis masalah dan mencari penyelesaian.'),
  ]),
  'b-5c': sec('PAK-21: KEMAHIRAN 5C', [
    p('**Kemahiran-kemahiran yang perlu diterapkan oleh guru abad ke-21.**'),
    tbl(['KEMAHIRAN', 'PENERANGAN'], [
      ['Pemikiran Kreatif', 'Pemikiran kreatif adalah kecekapan menggunakan minda untuk menghasilkan idea yang baru, asli, luar biasa, pelbagai, dan bernilai. Komponen pemikiran kreatif juga termasuk kebolehan seseorang berfikir secara kreatif dan inovatif dalam menyelesaikan masalah.'],
      ['Pemikiran Kritis', 'Pemikiran kritis adalah sebahagian daripada kemahiran berfikir yang dapat membantu manusia menyelesaikan sesuatu masalah dengan berkesan dan menyesuaikan diri dengan persekitaran. Manusia mempunyai kecenderungan untuk menggunakan proses kognitif apabila berhadapan dengan sesuatu keadaan atau masalah, tetapi tidak atau kurang mempunyai kemahiran untuk mengaplikasikan kecenderungan tersebut.'],
      ['Kolaborasi', 'Kolaborasi adalah satu proses yang melibatkan kerjasama oleh beberapa individu dalam satu kumpulan atau pasukan untuk mencapai hasil yang diinginkan dan sekaligus melahirkan kepercayaan antara ahli-ahli yang terlibat. Pendek kata, kolaborasi merupakan satu bentuk kerjasama yang melibatkan dua atau sekelompok individu dalam melengkapkan sesuatu aktiviti atau menyelesaikan sesuatu permasalahan.'],
      ['Komunikasi', 'Kemahiran komunikasi adalah penting dalam proses penyampaian maklumat, perkongsian pendapat dan interaksi antara dua pihak. Dengan adanya kemahiran komunikasi yang berkesan, perkongsian maklumat menjadi lebih mudah dan efektif.'],
      ['Perwatakan', 'Watak adalah satu corak tingkah laku, fikiran dan perasaan berdasarkan prinsip-prinsip kekuatan moral dan integriti. Perwatakan yang baik adalah perkara yang paling berharga yang boleh dimiliki oleh seseorang kerana ia mencerminkan jati diri dan sahsiah peribadi.'],
    ], true),
  ]),
  'b-aspirasi': sec('ASPIRASI PENDIDIKAN', [
    h('5 Aspirasi Sistem Pendidikan'),
    tbl(['ASPIRASI', 'PENERANGAN'], [
      ['Akses', '100% enrolmen merentas semua peringkat pendidikan daripada prasekolah hingga menengah atas menjelang tahun 2022.'],
      ['Kualiti', 'Negara dalam kelompok sepertiga teratas dengan pentaksiran antarabangsa seperti TIMSS dan PISA dalam tempoh 15 tahun.'],
      ['Ekuiti', '50% pengurangan dalam jurang pencapaian (bandar–luar bandar, sosioekonomi, gender) menjelang tahun 2020.'],
      ['Perpaduan', 'Sistem pendidikan yang menawarkan perkongsian pengalaman dan nilai kepada kanak-kanak dengan menghargai kepelbagaian.'],
      ['Kecekapan', 'Sistem yang memaksimumkan keberhasilan murid mengikut peruntukan sedia ada.'],
    ], true),
    h('6 Aspirasi Murid'),
    tbl(['ASPIRASI MURID'], [['Pengetahuan'], ['Kemahiran Berfikir'], ['Kemahiran Memimpin'], ['Kemahiran Dwibahasa'], ['Etika dan Kerohanian'], ['Identiti Nasional']], true),
  ]),
  'b-dpd': sec('DASAR PENDIDIKAN DIGITAL', [
    p('Dasar Pendidikan Digital (DPD) digubal bagi memacu transformasi pendidikan negara selaras dengan keperluan era digital, Revolusi Perindustrian Ke-4 dan Ke-5 (4IR & 5IR), serta pengalaman PdPR semasa pandemik COVID-19. Dasar ini menjadi panduan menyeluruh untuk merapatkan jurang digital dan memastikan pendidikan berkualiti, inklusif serta berdaya saing.'),
    kv([['Matlamat', 'Melahirkan generasi fasih digital yang mampu menggunakan teknologi digital secara beretika, bertanggungjawab, kreatif dan inovatif dalam pembelajaran serta kehidupan seharian.']]),
    h('Objektif'),
    ul(['Membangunkan kemenjadian murid melalui penguasaan kompetensi digital.', 'Mengupayakan pendidik dan pemimpin pendidikan dengan kemahiran digital.', 'Memperkukuh infrastruktur, infostruktur dan kandungan digital pendidikan.', 'Mengoptimumkan penglibatan rakan strategik dalam ekosistem pendidikan digital.'], true),
    h('Enam Teras Dasar Pendidikan Digital'),
    tbl(['TERAS', 'PENERANGAN'], [
      ['Murid Fasih Digital', 'Murid berkeupayaan menggunakan teknologi secara kreatif, kritis dan beretika.'],
      ['Pendidik Kompeten Digital', 'Guru berkemahiran mengintegrasikan teknologi dalam PdP secara berkesan.'],
      ['Budaya Kepemimpinan Digital Berwawasan', 'Pemimpin sekolah memacu perubahan dan inovasi digital.'],
      ['Pengupayaan Infrastruktur dan Infostruktur', 'Akses peranti, Internet dan sistem digital yang mantap dan selamat.'],
      ['Kandungan Digital Berkualiti', 'Sumber pembelajaran digital yang relevan, interaktif dan mudah diakses.'],
      ['Rakan Strategik yang Komited', 'Kerjasama dengan ibu bapa, komuniti, agensi awam dan sektor swasta.'],
    ], true),
    p('**Dasar Pendidikan Digital merupakan asas penting ke arah sistem pendidikan Malaysia yang fleksibel, inklusif dan mampan, bagi memastikan murid dan pendidik bersedia menghadapi cabaran masa depan digital serta menyokong aspirasi Negara Madani.**', 'center'),
  ]),
  'b-ts25': sec('PROGRAM TRANSFORMASI SEKOLAH 2025 (TS25)', [
    p('Program Transformasi Sekolah 2025 (TS25) merupakan inisiatif Kementerian Pendidikan Malaysia untuk meningkatkan kemenjadian murid dan kualiti sekolah melalui pengurusan, kepimpinan serta pedagogi PdP yang berkesan, selaras dengan Pelan Pembangunan Pendidikan Malaysia (PPPM) 2013–2025, ke arah melahirkan modal insan unggul.'),
    p('**TS25 — Penggerak Pembelajaran Bermakna**', 'center'),
    h('Elemen Utama TS25'),
    ul(['Persekitaran pembelajaran yang menyeronokkan', 'Disokong kepimpinan yang berkualiti / berwawasan', 'Guru yang kompeten dan beraspirasi tinggi', 'Komitmen komuniti yang padu']),
    h('Latar Belakang TS25'),
    p('Mesyuarat Majlis Ekonomi Bil. 2/2015 yang dipengerusikan oleh YAB Perdana Menteri pada 19 Januari 2015, telah meluluskan cadangan pelaksanaan TS25 KPM.'),
    h('Objektif'),
    ul(['Mengaplikasi konsep dan amalan PdP terbaik.', 'Membangunkan kepakaran dalaman melalui latihan yang komprehensif dan berstruktur kepada pembimbing pedagogi serta pembimbing kepimpinan.', 'Membangunkan persekitaran pembelajaran yang berkesan dengan mengutamakan kemenjadian murid.']),
    h('Matlamat'),
    ul(['Memantapkan kepimpinan sekolah.', 'Memaksimumkan potensi guru dan murid menerusi peningkatan kualiti pembelajaran dan pengajaran.', 'Mengukuhkan pelibatan ibu bapa, komuniti dan pihak berkepentingan demi kejayaan murid.']),
    h('Elemen Kemenjadian Murid & Sekolah Berkualiti'),
    tbl(['ELEMEN', 'PERINCIAN'], [
      ['Pembelajaran Bermakna', 'Dokumen Standard; Persekitaran; Pengajaran dan Pentaksiran; Pedagogi'],
      ['Guru Berkualiti', ''],
      ['Pemimpin Berkesan', ''],
      ['Sokongan PIBG & Komuniti', ''],
    ], true),
  ]),
  'b-spi': sec('SURAT PEKELILING IKHTISAS', [
    tbl(['BIL. SPI', 'PERKARA'], [
      ['Bil. 2/1981', 'Ketetapan Masa di Sekolah-Sekolah'],
      ['Bil. 3/1981', 'Penggunaan Waktu Tidak Mengajar / Waktu Luang (Free Periods) Oleh Guru-guru'],
      ['Bil. 4/1986', 'Panitia Mata Pelajaran'],
      ['Bil. 3/1987', 'Penyeliaan Pengajaran Pembelajaran di Dalam Kelas Oleh Pengetua / Guru Besar Sekolah'],
      ['Bil. 3/1999', '**PENYEDIAAN REKOD PENGAJARAN DAN PEMBELAJARAN**'],
      ['Bil. 7/2001', 'Garis Panduan Pakaian Guru Ketika Bertugas di Sekolah'],
      ['Bil. 7/2003', 'Kuasa Guru Merotan Murid'],
      ['Bil. 8/2016', 'Pelaksanaan Kurikulum Standard Sekolah Rendah Secara Berperingkat-peringkat Mulai Tahun 2017'],
      ['Bil. 9/2016', 'Pelaksanaan Kurikulum Standard Sekolah Menengah Secara Berperingkat-peringkat Mulai Tahun 2017'],
      ['Bil. 3/2017', 'Garis Panduan Nilai dan Etika Penggunaan Media Sosial Bagi Guru dan Murid'],
      ['Bil. 2/2022', 'Garis Panduan Pelaksanaan Peraturan-Peraturan Pendidikan (Penggal, Hari dan Cuti Sekolah) 1998 (Pindaan) 2021'],
      ['Bil. 2/2022', 'Pelaksanaan Penandaan Opsyen Mata Pelajaran Guru Bagi Sekolah Bawah Kementerian Pendidikan Malaysia'],
      ['Bil. 3/2023', 'Pemerkasaan Pentaksiran Berasaskan Sekolah Mulai Sesi Akademik 2022/2023'],
      ['Bil. 4/2023', 'Garis Panduan Undangan atau Lawatan Orang Kenamaan dan Ahli Politik ke Institusi Pendidikan Bawah KPM'],
      ['Bil. 9/2023', 'Garis Panduan Lawatan Murid Sekolah Bawah Kementerian Pendidikan Malaysia Mulai Tahun 2023'],
      ['Bil. 11/2023', 'Garis Panduan Nilai dan Etika Penggunaan Media Sosial KPM'],
      ['Bil. 2/2025', '**GARIS PANDUAN PENYEDIAAN E-RPH KPM**'],
      ['Bil. 3/2025', 'Garis Panduan Pemakaian Lencana Jalur Gemilang Pada Pakaian Seragam Murid di Institusi Pendidikan Bawah KPM'],
    ]),
    p('Senarai penuh Surat Pekeliling Ikhtisas: **ezy.la/RPM-SPI**', 'left'),
  ]),
  'b-visi-kpm': sec('VISI DAN MISI KPM', [
    h('Visi KPM'),
    p('Pendidikan Berkualiti, Insan Terdidik, Negara Sejahtera.', 'center', true),
    h('Misi KPM'),
    p('Melestarikan Sistem Pendidikan Yang Berkualiti Untuk Membangunkan Potensi Individu Bagi Memenuhi Aspirasi Negara.', 'center', true),
  ]),
});
