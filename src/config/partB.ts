/* Dijana daripada "v3_B-PENGENALAN_SEKOLAH_21_JAN" & "DRAF2_TAKWIM_2026_SKBTS" (BPPS 2026 SKBTS). */
import type { SectionContent } from '@/types/book';

const BASE = import.meta.env.BASE_URL;

/** Imej kandungan berada dalam public/content (laluan '@@/' diganti dengan BASE_URL). */
export const partBSections = (): Record<string, SectionContent> => JSON.parse(JSON.stringify(PB).split('@@/').join(BASE));

const PB: Record<string, SectionContent> = {
 "b-rukun-negara": {
  "title": "RUKUN NEGARA & FALSAFAH PENDIDIKAN KEBANGSAAN",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "759b8609bc9c",
    "type": "heading",
    "text": "RUKUN NEGARA"
   },
   {
    "id": "1881c369be67",
    "type": "paragraph",
    "text": "Maka kami rakyat Malaysia berikrar akan menumpukan seluruh tenaga dan usaha kami untuk mencapai cita-cita tersebut berdasarkan atas prinsip-prinsip yang berikut :"
   },
   {
    "id": "1d0cbb8b4f61",
    "type": "list",
    "ordered": true,
    "items": [
     "Kepercayaan Kepada Tuhan",
     "Kesetiaan Kepada Raja dan Negara",
     "Keluhuran Perlembagaan",
     "Kedaulatan Undang-Undang",
     "Kesopanan dan Kesusilaan"
    ]
   },
   {
    "id": "b9301eafd952",
    "type": "heading",
    "text": "FALSAFAH PENDIDIKAN KEBANGSAAN"
   },
   {
    "id": "d8bcf1541484",
    "type": "paragraph",
    "text": "Pendidikan di Malaysia adalah suatu usaha berterusan ke arah memperkembangkan lagi potensi individu secara menyeluruh dan bersepadu untuk mewujudkan insan yang seimbang dan harmonis dari segi intelek, rohani, emosi, dan jasmani berdasarkan kepercayaan dan kepatuhan kepada Tuhan. Usaha ini adalah bagi melahirkan rakyat Malaysia yang berilmu pengetahuan, berketerampilan, berakhlak mulia, bertanggungjawab dan berkeupayaan mencapai kesejanteraan diri serta memberikan sumbangan terhadap keharmonian dan kemakmuran masyarakat dan negara."
   },
   {
    "id": "178fe838afcb",
    "type": "heading",
    "text": "TATASUSILA PROFESION KEGURUAN"
   },
   {
    "id": "51315bec3886",
    "type": "paragraph",
    "text": "Kami, guru-guru Malaysia, yakin bahawa tujuan utama pendidikan ialah berusaha menuju ke arah pembentukan warganegara yang berilmu, yang taat setia, yang bertanggungjawab dan berkebolehan, yang menyedari betapa pentingnya usaha menuju ke arah kebenaran dan ke arah pencapaian hasrat yang gemilang, dan yang percaya demokrasi, kebebasan perseorangan dan Prinsip-Prinsip Rukun Negara.\n\nMelalui pendidikan, masyarakat dapat membantu anak mudanya memahami kebudayaan mereka, memperolehi pengetahuan yang telah terkumpul sejak berzaman, dan menyediakan mereka untuk menghadapi cabaran pada masa hadapan. Dengan menyedari betapa besarnya tanggungjawab membimbing anak muda untuk mencapai kemajuan sepenuh-penuhnya, maka dengan ini kami menerima tatasusila berikut sebagai panduan untuk membolehkan kami menyempurnakan profesion kami ke taraf kesusilaan yang setinggi-tingginya"
   }
  ],
  "updatedAt": null
 },
 "b-aku-janji": {
  "title": "SURAT AKU JANJI",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "399e7446ad49",
    "type": "image",
    "src": "@@/content/surat-aku-janji.png",
    "caption": "",
    "height": 205
   }
  ],
  "updatedAt": null
 },
 "b-ikrar": {
  "title": "IKRAR PERKHIDMATAN AWAM",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "9659f1878df0",
    "type": "heading",
    "text": "IKRAR PERKHIDMATAN AWAM"
   },
   {
    "id": "cf5e300cd5ff",
    "type": "paragraph",
    "text": "Kami yang telah dilantik berkhidmat dengan kerajaan Malaysia membuat ikrar di sini bahawa semasa dan selagi kami berkhidmat dengan Kerajaan, kami akan patuh dengan mengamalkan teras-teras perkhidmatan semasa menjalankan tugas. Ke arah ini kami :"
   },
   {
    "id": "ae6ac4caa0d3",
    "type": "list",
    "ordered": true,
    "items": [
     "Berazam meningkatkan mutu perkhidmatan",
     "Bekerja dengan penuh tanggungjawab",
     "Berusaha mengikis sikap mementingkan diri sendiri",
     "Berkhidmat dengan penuh muhibah dan kemesraan",
     "Bekerja ke arah memajukan pemikiran rakyat dan pembangunan negara",
     "Bekerjasama dalam membanteras kelemahan dan musuh-musuh negara",
     "Berpegang teguh kepada ajaran agama."
    ]
   },
   {
    "id": "0e0a53b2c0ad",
    "type": "heading",
    "text": "IKRAR INTEGRITI PERKHIDMATAN AWAM"
   },
   {
    "id": "26fe3f658df1",
    "type": "paragraph",
    "text": "Kami, pegawai awam Malaysia, dengan sepenuh dan rela hati berikrar mempertahankan dan memperkukuhkan integrity perkhidmatan awam dengan mencegah dan membenteras segala bentuk rasuah, salah guna kuasa dan penyelewengan melalui tindakan yang berikut :"
   },
   {
    "id": "6c670362a53b",
    "type": "table",
    "columns": [
     "IKRAR",
     "TINDAKAN"
    ],
    "rows": [
     [
      "PERTAMA",
      "Berusaha memupuk dan mengamalkan nilai-nilai membenci rasuah."
     ],
     [
      "KEDUA",
      "Menutup semua ruang dan peluang yang memdedahkan kepada amalan rasuah"
     ],
     [
      "KETIGA",
      "Bertindak tegas terhadap mereka yang melanggar undang-undang, peraturan dan etika jabatan"
     ],
     [
      "KEEMPAT",
      "Bekerjasama sepenuhnya dengan mana-mana pihak untuk memerangi sebarang perlakuan jenayah rasuah"
     ],
     [
      "KELIMA",
      "Bertindak tegas terhadap mereka yang cuba menggugat integriti dan imej pegawai awam; dan"
     ],
     [
      "KEENAM",
      "Mematuhi sepenuhnya kod etika jabatan dan mengamalkan nilai-nilai murni yang berteraskan ajaran agama dalam melaksanakan tugas."
     ]
    ],
    "style": "navy",
    "numbered": false,
    "firstCol": "gold"
   }
  ],
  "updatedAt": null
 },
 "b-fokus": {
  "title": "FOKUS PENGURUSAN PENDIDIKAN",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "a76c581654a7",
    "type": "table",
    "columns": [
     "BIDANG FOKUS PENGURUSAN PENDIDIKAN"
    ],
    "rows": [
     [
      "Pengetua Dan Guru Besar Yang Berkesan"
     ],
     [
      "Sekolah Yang Berkesan"
     ],
     [
      "Guru Yang Profesional"
     ],
     [
      "Kurikulum Yang Relevan"
     ],
     [
      "Sistem Penilaian Dan Peperiksaan"
     ],
     [
      "Pembinaan Infrastruktur Sokongan Pengajaran Dan Pembelajaran"
     ],
     [
      "Pembinaan Institusi Perancangan Dan Penyelidikan"
     ],
     [
      "Pembinaan Sistem Institusi Perlaksanaan Dan Pemantauan Yang Berkesan : Sistem Pentadbiran"
     ],
     [
      "Pembangunan Staf Yang Komprehensif"
     ],
     [
      "Pembinaan Hubungan Luar Dan Masyarakat"
     ]
    ],
    "style": "navy",
    "numbered": true
   }
  ],
  "updatedAt": null
 },
 "b-ithink": {
  "title": "KBAT: PETA PEMIKIRAN i-THINK",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "0d77d27f3439",
    "type": "paragraph",
    "text": "Lapan Proses Pemikiran dibangunkan melalui alat berfikir visual, iaitu Peta Pemikiran yang memudahkan murid-murid dalam memahami konsep, menganalisis masalah dan mencari penyelesaian."
   },
   {
    "id": "e7808b387ed5",
    "type": "table",
    "columns": [
     "PETA PEMIKIRAN",
     "PROSES PEMIKIRAN"
    ],
    "rows": [
     [
      "Peta Bulatan",
      "Mendefinisi Ikut Konteks"
     ],
     [
      "Peta Buih",
      "Menerangkan Dengan Adjektif"
     ],
     [
      "Peta Buih Berganda",
      "Membanding Beza"
     ],
     [
      "Peta Pokok",
      "Membuat Pengelasan"
     ],
     [
      "Peta Dakap",
      "Hubungan Bahagian"
     ],
     [
      "Peta Alir",
      "Menyusun Secara Urutan"
     ],
     [
      "Peta Pelbagai Alir",
      "Sebab Dan Akibat"
     ],
     [
      "Peta Titi",
      "Hubungan Yang Sama"
     ]
    ],
    "style": "navy",
    "numbered": true
   }
  ],
  "updatedAt": null
 },
 "b-5c": {
  "title": "PAK-21: KEMAHIRAN 5C",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "a5e1fbcd3fae",
    "type": "heading",
    "text": "KEMAHIRAN-KEMAHIRAN YANG PERLU DITERAPKAN OLEH GURU ABAD KE-21"
   },
   {
    "id": "f2aa7ea1dcd7",
    "type": "image",
    "src": "@@/content/kemahiran-5c.png",
    "caption": "",
    "height": 46
   },
   {
    "id": "e8990a213a00",
    "type": "table",
    "columns": [
     "KEMAHIRAN",
     "HURAIAN"
    ],
    "rows": [
     [
      "Pemikiran Kreatif",
      "Pemikiran kreatif adalah kecekapan menggunakan minda untuk menghasilkan idea yang baru, asli, luar biasa, pelbagai, dan bernilai. Komponen pemikiran kreatif juga termasuk kebolehan seseorang berfikir secara kreatif dan inovatif dalam menyelesaikan masalah."
     ],
     [
      "Pemikiran Kritis",
      "Pemikiran kritis adalah sebahagian daripada kemahiran berfikir yang dapat membantu manusia menyelesaikan sesuatu masalah dengan berkesan dan menyesuaikan diri dengan persekitaran.\n\nManusia mempunyai kecenderungan untuk menggunakan proses kognitif apabila berhadapan dengan sesuatu keaadaan atau masalah, tetapi tidak atau kurang mempunyai kemahiran untuk mengaplikasikan kecenderungan tersebut"
     ],
     [
      "Kolaborasi",
      "Kolaborasi adalah satu proses yang melibatkan kerjasama oleh beberapa individu dalam satu kumpulan atau pasukan untuk mencapai hasil yang diiginkan dan sekaligus melahirkan kepercayaan antara ahli-ahli yang terlibat.\n\nPendek kata, kolaborasi merupakan satu bentuk kerjasama yang melibatkan dua atau sekelompok individu dalam melengkapkan sesuatu aktiviti atau menyelesaikan sesuatu permasalahan"
     ],
     [
      "Komunikasi",
      "Kemahiran Komunikasi adalah penting dalam proses Penyampaian maklumat, perkongsian pendapat dan interaksi antara dua pihak. Dengan adanya kemahiran Komunikasi yang berkesan, perkongsian maklumat menjadi lebih mudah dan afektif"
     ],
     [
      "Perwatakan",
      "Watak adalah satu corak tingkah laku, fikiran dan perasaan berdasarkan prinsip-prinsip kekuatan moral dan integriti. Perwatakan yang baik adalah perkara yang paling berharga yang boleh dimiliki oleh seseorang kerana ia mencermin jati diri dan sahsiah peribadi"
     ]
    ],
    "style": "navy",
    "numbered": true
   }
  ],
  "updatedAt": null
 },
 "b-aspirasi": {
  "title": "ASPIRASI PENDIDIKAN",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "7d756cd8cd79",
    "type": "heading",
    "text": "5 ASPIRASI SISTEM PENDIDIKAN"
   },
   {
    "id": "9ab66ff07e64",
    "type": "table",
    "columns": [
     "ASPIRASI",
     "SASARAN / HURAIAN"
    ],
    "rows": [
     [
      "Akses",
      "100% enrolmen merentas semua peringkat pendidikan daripada prasekolah hingga menengah atas menjelang tahun 2022"
     ],
     [
      "Kualiti",
      "Negara dalam kelompok sepertiga teratas dengan pentaksiran antarabangsa seperti TIMSS dan PISA dalam tempoh 15 tahun"
     ],
     [
      "Ekuiti",
      "50% pengurangan dalam jurang pencapaian ( bandar – luar bandar, sosioekonomi, gender ) menjelang tahun 2020"
     ],
     [
      "Perpaduan",
      "Sistem pendidikan yang menawarkan perkongsian pengalaman dan nilai kepada kanak-kanak dengan menghargai kepelbagaian"
     ],
     [
      "Kecekapan",
      "Sistem yang memaksimumkan keberhasilan murid mengikut peruntukan sedia ada"
     ]
    ],
    "style": "navy",
    "numbered": true
   },
   {
    "id": "f2a313e08f8a",
    "type": "heading",
    "text": "6 ASPIRASI MURID"
   },
   {
    "id": "c5c22c91a7d5",
    "type": "list",
    "ordered": true,
    "items": [
     "Pengetahuan",
     "Identiti Nasional",
     "Kemahiran Memimpin",
     "Kemahiran Dwibahasa",
     "Etika Dan Kerohanian",
     "Kemahiran Berfikir"
    ]
   }
  ],
  "updatedAt": null
 },
 "b-dpd": {
  "title": "DASAR PENDIDIKAN DIGITAL",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "ec482ad634aa",
    "type": "paragraph",
    "text": "Dasar Pendidikan Digital (DPD) digubal bagi memacu transformasi pendidikan negara selaras dengan keperluan era digital, Revolusi Perindustrian Ke-4 dan Ke-5 (4IR & 5IR), serta pengalaman PdPR semasa pandemik COVID-19. Dasar ini menjadi panduan menyeluruh untuk merapatkan jurang digital dan memastikan pendidikan berkualiti, inklusif serta berdaya saing."
   },
   {
    "id": "21c0ea512afd",
    "type": "keyvalue",
    "pairs": [
     {
      "key": "Matlamat",
      "value": "Melahirkan generasi fasih digital yang mampu menggunakan teknologi digital secara beretika, bertanggungjawab, kreatif dan inovatif dalam pembelajaran serta kehidupan seharian"
     }
    ]
   },
   {
    "id": "5741a63b65bf",
    "type": "heading",
    "text": "OBJEKTIF"
   },
   {
    "id": "a835cabd39b7",
    "type": "list",
    "ordered": true,
    "items": [
     "Membangunkan kemenjadian murid melalui penguasaan kompetensi digital.",
     "Mengupayakan pendidik dan pemimpin pendidikan dengan kemahiran digital.",
     "Memperkukuh infrastruktur, infostruktur dan kandungan digital pendidikan.",
     "Mengoptimumkan penglibatan rakan strategik dalam ekosistem pendidikan digital."
    ]
   },
   {
    "id": "d724d776a5e5",
    "type": "heading",
    "text": "ENAM TERAS DASAR PENDIDIKAN DIGITAL"
   },
   {
    "id": "0eb5fce01320",
    "type": "table",
    "columns": [
     "TERAS",
     "HURAIAN"
    ],
    "rows": [
     [
      "Murid Fasih Digital",
      "Murid berkeupayaan menggunakan teknologi secara kreatif, kritis dan beretika."
     ],
     [
      "Pendidik Kompeten Digital",
      "Guru berkemahiran mengintegrasikan teknologi dalam PdP secara berkesan."
     ],
     [
      "Budaya Kepemimpinan Digital Berwawasan",
      "Pemimpin sekolah memacu perubahan dan inovasi digital."
     ],
     [
      "Pengupayaan Infrastruktur dan Infostruktur",
      "Akses peranti, Internet dan sistem digital yang mantap dan selamat."
     ],
     [
      "Kandungan Digital Berkualiti",
      "Sumber pembelajaran digital yang relevan, interaktif dan mudah diakses."
     ],
     [
      "Rakan Strategik yang Komited",
      "Kerjasama dengan ibu bapa, komuniti, agensi awam dan sektor swasta."
     ]
    ],
    "style": "navy",
    "numbered": true
   },
   {
    "id": "295bca521a1b",
    "type": "paragraph",
    "text": "**Dasar Pendidikan Digital merupakan asas penting ke arah sistem pendidikan Malaysia yang fleksibel, inklusif dan mampan, bagi memastikan murid dan pendidik bersedia menghadapi cabaran masa depan digital serta menyokong aspirasi negara MADANI.**"
   }
  ],
  "updatedAt": null
 },
 "b-ts25": {
  "title": "PROGRAM TRANSFORMASI SEKOLAH 2025 (TS25)",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "0f9ebed4f74d",
    "type": "paragraph",
    "text": "Program Transformasi Sekolah 2025 (TS25) merupakan inisiatif Kementerian Pendidikan Malaysia untuk meningkatkan kemenjadian murid dan kualiti sekolah melalui pengurusan, kepimpinan serta pedagogi PdP yang berkesan, selaras dengan Pelan Pembangunan Pendidikan Malaysia (PPPM) 2013–2025, ke arah melahirkan modal insan unggul."
   },
   {
    "id": "a87aa0a9438a",
    "type": "image",
    "src": "@@/content/ts25-elemen.png",
    "caption": "Elemen kemenjadian murid dan sekolah berkualiti",
    "height": 62
   },
   {
    "id": "80bc9e756153",
    "type": "heading",
    "text": "LATAR BELAKANG TS25"
   },
   {
    "id": "ac3e938045db",
    "type": "paragraph",
    "text": "Mesyuarat Majlis Ekonomi Bil. 2/2015 yang dipengerusikan oleh YAB Perdana Menteri pada 19 Januari 2015, telah meluluskan cadangan pelaksanaan TS25 KPM."
   },
   {
    "id": "fc01da3353c1",
    "type": "heading",
    "text": "MATLAMAT"
   },
   {
    "id": "0c99d91e1987",
    "type": "list",
    "ordered": true,
    "items": [
     "Memantapkan kepimpinan sekolah",
     "Memaksimumkan potensi guru dan murid menerusi peningkatan kualiti pembelajaran dan pengajaran",
     "Mengukuhkan pelibatan ibubapa, komuniti dan pihak berkepentingan demi kejayaan murid"
    ]
   },
   {
    "id": "10c8b70bb5e1",
    "type": "heading",
    "text": "OBJEKTIF"
   },
   {
    "id": "3645793c6e2e",
    "type": "list",
    "ordered": true,
    "items": [
     "Mengaplikasi konsep dan amalan PdP terbaik.",
     "Membangunkan kepakaran dalaman melalui latihan yang komprehensif dan berstruktur kepada pembimbing pedagogi serta pembimbing kepimpinan.",
     "Membangunkan persekitaran pembelajaran yang berkesan dengan mengutamakan kemenjadian murid."
    ]
   },
   {
    "id": "8e1609ee24da",
    "type": "heading",
    "text": "ASAS PELAKSANAAN"
   },
   {
    "id": "89b4c0f3d7a9",
    "type": "list",
    "ordered": false,
    "items": [
     "Disokong kepimpinan yang berkualiti / berwawasan",
     "Komitmen komuniti yang padu",
     "Persekitaran pembelajaran yang menyeronokkan",
     "Guru yang kompeten dan beraspirasi tinggi"
    ]
   }
  ],
  "updatedAt": null
 },
 "b-spi": {
  "title": "SURAT PEKELILING IKHTISAS",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "eb892a57976e",
    "type": "table",
    "columns": [
     "NO. SPI",
     "PERKARA"
    ],
    "rows": [
     [
      "Bil. 2 / 1981",
      "Ketetapan Masa di Sekolah-Sekolah"
     ],
     [
      "Bil. 3 / 1981",
      "Penggunaan Waktu Tidak Mengajar / Waktu Luang (Free Periods) Oleh Guru-guru"
     ],
     [
      "Bil. 4 / 1986",
      "Panitia Mata Pelajaran"
     ],
     [
      "Bil. 3 / 1987",
      "Penyeliaan Pengajaran Pembelajaran di Dalam Kelas Oleh Pengetua / Guru Besar Sekolah"
     ],
     [
      "Bil. 3 / 1999",
      "Penyediaan rekod pengajaran dan pembelajaran"
     ],
     [
      "Bil. 7 / 2001",
      "Garis Panduan Pakaian Guru Ketika Bertugas di Sekolah"
     ],
     [
      "Bil. 7 / 2003",
      "Kuasa Guru Merotan Murid"
     ],
     [
      "Bil. 8 / 2016",
      "Pelaksanaan Kurikulum Standard Sekolah Rendah Secara Berperingkat-peringkat Mulai Tahun 2017"
     ],
     [
      "Bil. 9 / 2016",
      "Pelaksanaan Kurikulum Standard Sekolah Menengah Secara Berperingkat-peringkat Mulai Tahun 2017"
     ],
     [
      "Bil. 3 / 2017",
      "Garis Panduan Nilai dan Etika Penggunaan Media Sosial Bagi Guru dan Murid"
     ],
     [
      "Bil. 2 / 2022",
      "Garis Panduan Pelaksanaan Peraturan-Peraturan Pendidikan (Penggal, Hari dan Cuti Sekolah) 1998 (Pindaan) 2021"
     ],
     [
      "Bil. 2 / 2022",
      "Pelaksanaan Penandaan Opsyen Mata Pelajaran Guru Bagi Sekolah Bawah Kementerian Pendidikan Malaysia"
     ],
     [
      "Bil. 3 / 2023",
      "Pemerkasaan Pentaksiran Berasaskan Sekolah Mulai Sesi Akademik 2022/2023"
     ],
     [
      "Bil. 4 / 2023",
      "Garis Panduan Undangan atau Lawatan Orang Kenamaan dan Ahli Politik ke Institusi Pendidikan Bawah KPM"
     ],
     [
      "Bil. 9 / 2023",
      "Garis Panduan Lawatan Murid Sekolah Bawah Kementerian Pendidikan Malaysia Mulai Tahun 2023"
     ],
     [
      "Bil. 11 / 2023",
      "Garis Panduan Nilai dan Etika Penggunaan Media Sosial KPM"
     ],
     [
      "Bil. 2 / 2025",
      "Garis panduan penyediaan e-rph kpm"
     ],
     [
      "Bil. 3 / 2025",
      "Garis Panduan Pemakaian Lencana Jalur Gemilang Pada\nPakaian Seragam Murid di Institusi Pendidikan Bawah KPM"
     ]
    ],
    "style": "navy",
    "numbered": true
   },
   {
    "id": "7756609255c4",
    "type": "paragraph",
    "text": "Imbas kod QR atau layari **ezy.la/RPM-SPI** untuk senarai penuh Surat Pekeliling Ikhtisas."
   }
  ],
  "updatedAt": null
 },
 "b-visi-kpm": {
  "title": "VISI DAN MISI KPM",
  "subtitle": "PENGENALAN",
  "layout": "standard",
  "blocks": [
   {
    "id": "bf4409b81ea3",
    "type": "image",
    "src": "@@/content/logo-kpm.png",
    "caption": "",
    "height": 40
   },
   {
    "id": "e1a139484acc",
    "type": "keyvalue",
    "pairs": [
     {
      "key": "Visi KPM",
      "value": "Pendidikan Berkualiti, Insan Terdidik, Negara Sejahtera."
     },
     {
      "key": "Misi KPM",
      "value": "Melestarikan Sistem Pendidikan Yang Berkualiti Untuk Membangunkan Potensi Individu Bagi Memenuhi Aspirasi Negara."
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "b-sejarah": {
  "title": "SEJARAH PENUBUHAN SEKOLAH",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "e8879e283e6a",
    "type": "heading",
    "text": "PERMULAAN DAN PEMBINAAN"
   },
   {
    "id": "5cc3ad5192c9",
    "type": "paragraph",
    "text": "Sekolah Kebangsaan Bandar Tasik Selatan (SKBTS) merupakan sebuah institusi pendidikan yang terletak di kawasan strategik pembangunan pesat Bandar Tasik Selatan, Kuala Lumpur. Pembinaan sekolah ini dimulakan selaras dengan keperluan mendesak masyarakat setempat ekoran pertambahan penduduk yang mendadak di kawasan perumahan Bandar Tasik Selatan dan kawasan sekitarnya pada penghujung tahun 90-an. Sekolah ini dibina di atas sebidang tanah yang luas bagi menampung kapasiti murid yang besar, merangkumi blok pentadbiran, blok akademik, dan kemudahan asas yang lengkap."
   },
   {
    "id": "37b510f5ba27",
    "type": "heading",
    "text": "TARIKH BEROPERASI DAN PERASMIAN"
   },
   {
    "id": "0864602c05c5",
    "type": "paragraph",
    "text": "SK Bandar Tasik Selatan mula beroperasi secara rasmi pada **1 Januari 2004**. Pada peringkat awal penubuhannya, sekolah ini hanya menerima bilangan murid yang kecil sebelum jumlahnya meningkat saban tahun sehingga menjadi salah satu sekolah gred A di bawah Pejabat Pendidikan Daerah (PPD) Bangsar/Pudu. Visi awal penubuhannya adalah untuk menjadi pusat kecemerlangan pendidikan bagi komuniti setempat, menyediakan akses pendidikan yang saksama bagi anak-anak di kawasan sekitar Sungai Besi dan Bandar Tasik Selatan."
   }
  ],
  "updatedAt": null
 },
 "b-latar": {
  "title": "LATAR BELAKANG SEKOLAH",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "8667363fef39",
    "type": "heading",
    "text": "PRASARANA DAN KEMUDAHAN"
   },
   {
    "id": "2de6c493a190",
    "type": "paragraph",
    "text": "Sekolah ini dilengkapi dengan infrastruktur moden bagi menyokong proses Pengajaran dan Pembelajaran (PdP) serta pembangunan bakat murid. Antara kemudahan yang tersedia termasuklah:\n\n**Blok Akademik & Pentadbiran:** Menempatkan bilik-bilik darjah dan ruang kerja yang kondusif.\n**Makmal Komputer & Bilik Sains:** Dilengkapi peralatan bagi menyokong literasi teknologi dan saintifik.\n**Pusat Sumber Sekolah (PSS):** Menjadi nadi ilmu bagi meningkatkan budaya membaca murid.\n**Dewan Besar:** Ruang utama bagi penganjuran majlis rasmi dan perhimpunan mingguan.\n**Padang Sekolah:** Ruang untuk aktiviti fizikal dan sukan padang.\n**Gelanggang Terbuka Serba Guna:** Kemudahan ini membolehkan pelbagai jenis sukan bergelanggang seperti badminton, sepak takraw, dan bola keranjang berlangsung dengan lebih efektif, sekali gus menjadi hub pembangunan atlet muda sekolah.\n**Pemerkasaan Teknologi Digital (Smart Classroom):** Hasil komitmen tinggi warga SKBTS melalui **Program Kutipan Sumbangan Ceriathon** anjuran PIBG, sekolah kini dilengkapi dengan kemudahan **Smart Whiteboard** di bilik-bilik khas serta pemasangan **Smart TV** di setiap bilik darjah. Kemudahan ini membolehkan PdP dijalankan secara interaktif selaras dengan transformasi pendidikan digital."
   },
   {
    "id": "571da3a9c140",
    "type": "heading",
    "text": "PROGRAM PENDIDIKAN KHAS INTEGRASI (PPKI)"
   },
   {
    "id": "99aeacd2f474",
    "type": "paragraph",
    "text": "Salah satu keistimewaan SK Bandar Tasik Selatan adalah keberadaan Program Pendidikan Khas Integrasi (PPKI). Program ini membuktikan komitmen sekolah terhadap pendidikan inklusif, di mana murid-berkeperluan pendidikan khas (MBPK) diberikan peluang belajar dalam persekitaran yang menyokong. PPKI di SKBTS memfokuskan kepada kemahiran pengurusan diri dan pembangunan potensi individu melalui bimbingan guru-guru pendidikan khas yang berdedikasi."
   },
   {
    "id": "4373b2eefa85",
    "type": "heading",
    "text": "SESI PERSEKOLAHAN: PAGI DAN PETANG"
   },
   {
    "id": "4756097d4c54",
    "type": "paragraph",
    "text": "Ekoran kepadatan penduduk, SK Bandar Tasik Selatan beroperasi dalam dua sesi. Pengurusan dua sesi ini menuntut penyelarasan yang mantap dari aspek pentadbiran dan pengurusan ruang. Di bawah pimpinan Guru Besar dan barisan Penolong Kanan, sekolah berjaya mengekalkan prestasi yang stabil walaupun menguruskan jumlah murid yang besar."
   },
   {
    "id": "76b3ef5c1cba",
    "type": "heading",
    "text": "PENCAPAIAN DAN HALA TUJU"
   },
   {
    "id": "a18469ebc204",
    "type": "paragraph",
    "text": "Sepanjang beroperasi, SK Bandar Tasik Selatan telah melahirkan ramai murid yang berjaya dalam bidang akademik dan kokurikulum. Sekolah sering terlibat aktif dalam pertandingan sukan dan unit beruniform di peringkat daerah mahupun negeri. Dengan moto sekolah yang menekankan kecemerlangan, warga SKBTS terus komited untuk melahirkan modal insan yang seimbang dari segi intelek, rohani, emosi, dan jasmani (JERI)."
   },
   {
    "id": "494f1c898f8f",
    "type": "heading",
    "text": "HUBUNGAN DENGAN KOMUNITI"
   },
   {
    "id": "8fcd0d906d38",
    "type": "paragraph",
    "text": "Kejayaan SKBTS didorong oleh hubungan erat antara pihak sekolah dengan Persatuan Ibu Bapa dan Guru (PIBG). Sokongan padu melalui inisiatif seperti Ceriathon membuktikan kerjasama \"Smart Partnership\" ini membuahkan hasil dalam menambah baik prasarana sekolah demi keselesaan murid. Sekolah ini terus berdiri teguh sebagai mercu tanda pendidikan di Bandar Tasik Selatan, mendepani cabaran pendidikan abad ke-21 dengan penuh optimis."
   }
  ],
  "updatedAt": null
 },
 "b-logo": {
  "title": "LOGO SEKOLAH",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "742dda62ec5c",
    "type": "image",
    "src": "@@/content/logo-skbts.png",
    "caption": "",
    "height": 150
   }
  ],
  "updatedAt": null
 },
 "b-visi-sekolah": {
  "title": "VISI, MISI, SLOGAN & MOTO SEKOLAH",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "d00f062f9852",
    "type": "heading",
    "text": "VISI SEKOLAH"
   },
   {
    "id": "d3a387127fc5",
    "type": "paragraph",
    "text": "SKBTS Unggul dalam Melahirkan Modal Insan Beradab, Berilmu, dan Berdaya Saing"
   },
   {
    "id": "27297260d086",
    "type": "heading",
    "text": "MISI SEKOLAH"
   },
   {
    "id": "69273e4106dd",
    "type": "paragraph",
    "text": "Membangunkan potensi murid secara menyeluruh melalui pembentukan nilai adab yang tinggi, penguasaan ilmu yang tuntas dan penyerlahan bakat yang unggul demi melahirkan modal insan yang berdaya saing."
   },
   {
    "id": "4a2028fb918e",
    "type": "heading",
    "text": "SLOGAN & MOTO"
   },
   {
    "id": "e0701e173b82",
    "type": "paragraph",
    "text": "**SKBTS: SCHOOL OF CHAMPIONS**\n“Satu Tekad, Menuju Puncak”"
   }
  ],
  "updatedAt": null
 },
 "b-matlamat": {
  "title": "MATLAMAT STRATEGIK",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "971c3bacdaa7",
    "type": "paragraph",
    "text": "Untuk merealisasikan Visi dan Misi di atas serta slogan \"School of Champions\", warga SKBTS bertekad mencapai:"
   },
   {
    "id": "c7c6675f298e",
    "type": "table",
    "columns": [
     "MATLAMAT",
     "HURAIAN"
    ],
    "rows": [
     [
      "JUARA ADAB",
      "Melahirkan murid yang memiliki karamah insaniah, berdisiplin tinggi, dan mengamalkan nilai-nilai murni dalam kehidupan seharian."
     ],
     [
      "JUARA ILMU",
      "Memastikan 100% murid arus perdana menguasai kemahiran 3M (Membaca, Menulis, Mengira) sebelum melangkah ke sekolah menengah dan mencapai kecemerlangan akademik melalui pemanfaatan teknologi digital."
     ],
     [
      "JUARA BAKAT",
      "Mencungkil dan menggilap potensi murid dalam bidang sukan, seni, dan kokurikulum agar mampu bersaing di peringkat tertinggi."
     ],
     [
      "JUARA KEHADIRAN",
      "Memastikan penglibatan aktif murid dengan sasaran 91% kehadiran tahunan melalui persekitaran sekolah yang ceria dan kondusif."
     ]
    ],
    "style": "navy",
    "numbered": false,
    "firstCol": "gold"
   }
  ],
  "updatedAt": null
 },
 "b-lagu": {
  "title": "LAGU SEKOLAH",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "779c8f5a86c3",
    "type": "heading",
    "text": "GEMILANG SEKOLAHKU"
   },
   {
    "id": "a874005dc936",
    "type": "paragraph",
    "text": "Sekolah Kebangsaan\nBandar Tasik Selatan\nSuasananya indah\nMenjadi kebanggaan\n\nSatu tekad keazaman\nDengan penuh keyakinan\nTekun semangat berwawasan\nDemi nusa dan bangsa\n\nUsaha dalam pelajaran\nGiat dalam kesukanan\nCapai semua kemenangan\nItulah perjuangan kita\n\nTaat kepada Tuhan\nHormati guru dan rakan\nDengar nasihat ibu bapa\nMenjadi insan mulia\n\nUsaha dalam pelajaran\nGiat dalam kesukanan\nCapai semua kemenangan\nItulah perjuangan kita\n\nMenyahut seruan negara\nKe arah sekolah jaya\nDalam era kemajuan\nCapai wawasan kita\n\nDalam era kemajuan\nCapai wawasan kita",
    "align": "center"
   },
   {
    "id": "cec04dbe9671",
    "type": "image",
    "src": "@@/content/qr-lagu.jpg",
    "caption": "Audio lagu: bit.ly/laguSKBTS2024",
    "height": 26
   }
  ],
  "updatedAt": null
 },
 "b-pelan": {
  "title": "PELAN SEKOLAH",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "23db7de08d4c",
    "type": "image",
    "src": "@@/content/pelan-kelas.jpg",
    "caption": "Pelan Kelas SK Bandar Tasik Selatan 2026",
    "height": 175
   }
  ],
  "updatedAt": null
 },
 "b-pelan-kecemasan": {
  "title": "PELAN KECEMASAN SEKOLAH",
  "subtitle": "MAKLUMAT SEKOLAH",
  "layout": "standard",
  "blocks": [
   {
    "id": "2de34c7171a7",
    "type": "image",
    "src": "@@/content/pelan-kecemasan.jpg",
    "caption": "Pelan Laluan Kecemasan SK Bandar Tasik Selatan",
    "height": 175
   }
  ],
  "updatedAt": null
 },
 "t-kalendar": {
  "title": "KALENDAR 2026",
  "subtitle": "",
  "layout": "twocol",
  "blocks": [
   {
    "id": "fc6ec042a275",
    "type": "heading",
    "text": "JANUARI"
   },
   {
    "id": "cc290d39fda0",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "",
      "1",
      "2",
      "3",
      "4"
     ],
     [
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
     ],
     [
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18"
     ],
     [
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25"
     ],
     [
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "23a673d1ba9e",
    "type": "heading",
    "text": "FEBRUARI"
   },
   {
    "id": "f38a5a988dac",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "",
      "",
      "",
      "",
      "1"
     ],
     [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8"
     ],
     [
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15"
     ],
     [
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22"
     ],
     [
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "2dbf538a9084",
    "type": "heading",
    "text": "MAC"
   },
   {
    "id": "613ed6d3f2ce",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "",
      "",
      "",
      "",
      "1"
     ],
     [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8"
     ],
     [
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15"
     ],
     [
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22"
     ],
     [
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29"
     ],
     [
      "30",
      "31",
      "",
      "",
      "",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "cec23cf92071",
    "type": "heading",
    "text": "APRIL"
   },
   {
    "id": "283a91ab1d22",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "1",
      "2",
      "3",
      "4",
      "5"
     ],
     [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
     ],
     [
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19"
     ],
     [
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26"
     ],
     [
      "27",
      "28",
      "29",
      "30",
      "",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "7a77ef0ff0ad",
    "type": "heading",
    "text": "MEI"
   },
   {
    "id": "7898121fffca",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "",
      "",
      "1",
      "2",
      "3"
     ],
     [
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10"
     ],
     [
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17"
     ],
     [
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24"
     ],
     [
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31"
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "a44a00d26df3",
    "type": "heading",
    "text": "JUN"
   },
   {
    "id": "4f91a17babfb",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7"
     ],
     [
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14"
     ],
     [
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21"
     ],
     [
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28"
     ],
     [
      "29",
      "30",
      "",
      "",
      "",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "da023d990c8f",
    "type": "heading",
    "text": "JULAI"
   },
   {
    "id": "d1c638d1983e",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "1",
      "2",
      "3",
      "4",
      "5"
     ],
     [
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
     ],
     [
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19"
     ],
     [
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26"
     ],
     [
      "27",
      "28",
      "29",
      "30",
      "31",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "4bf9466ad0a0",
    "type": "heading",
    "text": "OGOS"
   },
   {
    "id": "ae41c243f181",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "",
      "",
      "",
      "1",
      "2"
     ],
     [
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
     ],
     [
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16"
     ],
     [
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23"
     ],
     [
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30"
     ],
     [
      "31",
      "",
      "",
      "",
      "",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "457d191900f8",
    "type": "heading",
    "text": "SEPTEMBER"
   },
   {
    "id": "b614d0315e12",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6"
     ],
     [
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13"
     ],
     [
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20"
     ],
     [
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27"
     ],
     [
      "28",
      "29",
      "30",
      "",
      "",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "4acf9aa15f56",
    "type": "heading",
    "text": "OKTOBER"
   },
   {
    "id": "5bc77ca77bf7",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "",
      "1",
      "2",
      "3",
      "4"
     ],
     [
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11"
     ],
     [
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18"
     ],
     [
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25"
     ],
     [
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "dc88ba0f059f",
    "type": "heading",
    "text": "NOVEMBER"
   },
   {
    "id": "cc50aa061d5a",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "",
      "",
      "",
      "",
      "",
      "1"
     ],
     [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8"
     ],
     [
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15"
     ],
     [
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22"
     ],
     [
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29"
     ],
     [
      "30",
      "",
      "",
      "",
      "",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "5edde0775260",
    "type": "heading",
    "text": "DISEMBER"
   },
   {
    "id": "204726b7b44b",
    "type": "table",
    "columns": [
     "I",
     "S",
     "R",
     "K",
     "J",
     "S",
     "A"
    ],
    "rows": [
     [
      "",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6"
     ],
     [
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13"
     ],
     [
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20"
     ],
     [
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27"
     ],
     [
      "28",
      "29",
      "30",
      "31",
      "",
      "",
      ""
     ]
    ],
    "style": "navy",
    "numbered": false
   }
  ],
  "updatedAt": null
 },
 "t-cuti": {
  "title": "CUTI PERAYAAN TAHUN 2026",
  "subtitle": "",
  "layout": "standard",
  "blocks": [
   {
    "id": "7a8b30ba5508",
    "type": "heading",
    "text": "TAMBAHAN CUTI PERAYAAN YANG DIPERUNTUKKAN OLEH KPM"
   },
   {
    "id": "34421371af83",
    "type": "table",
    "columns": [
     "CUTI PERAYAAN",
     "KUMPULAN A",
     "KUMPULAN B",
     "CATATAN"
    ],
    "rows": [
     [
      "TAHUN BARU CINA 17.02.2026 (Selasa) Dan 18.02.2026 (Rabu)",
      "15.02.2026\n( Ahad )\n16.02.2026\n( Isnin )\n19.02.2026\n( Khamis )",
      "16.02.2026\n( Isnin )\n19.02.2026\n( Khamis )\n20.02.2026\n( Jumaat )",
      "Tiga (3) Hari Cuti Tambahan KPM\nuntuk Kumpulan A\nDan\nKumpulan B"
     ],
     [
      "HARI RAYA AIDILFITRI 21.03.2026 (Sabtu) Dan 22.03.2026 (Ahad)",
      "19.03.2026\n( Khamis )",
      "19.03.2026\n( Khamis )\n20.03.2026\n( Jumaat )",
      "Satu (1) Hari Cuti\nTambahan KPM untuk Kumpulan A\ndan\nDua (2) Hari Cuti\nTambahan KPM untuk Kumpulan B"
     ],
     [
      "HARI DEEPAVALI 08.11.2026 (Ahad) (Kecuali Negeri Sarawak)",
      "09.11.2026\n( Isnin )",
      "10.11.2026\n( Selasa )\n* Semua Negeri Kumpulan B Kecuali Negeri Sarawak\n09.11.2026\n( Isnin )\n* Negeri Sarawak Sahaja",
      "Satu (1) Hari Cuti\nTambahan KPM untuk Kumpulan A dan Kumpulan B\nSatu (1) Hari Cuti\nTambahan KPM"
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "3fa9db883e32",
    "type": "heading",
    "text": "CATATAN"
   },
   {
    "id": "7e2754bb61f5",
    "type": "table",
    "columns": [
     "PERAYAAN",
     "TARIKH"
    ],
    "rows": [
     [
      "Perayaan Hari Raya Aidilfitri",
      "21 & 22 Mac 2026\n(Dalam Cuti Penggal 1, Tahun 2026)"
     ],
     [
      "Pesta Kaamatan\n(Sabah dan Wilayah Persekutuan Labuan sahaja)",
      "30 & 31 Mei 2026\n(Dalam Cuti Pertengahan Tahun 2026)"
     ],
     [
      "Perayaan Hari Gawai Dayak\n( Sarawak sahaja )",
      "01 & 02 Jun 2026\n(Dalam Cuti Pertengahan Tahun 2026)"
     ],
     [
      "Perayaan Hari Krismas",
      "25 Disember 2026\n(Dalam Cuti Akhir Persekolahan Tahun 2026)"
     ]
    ],
    "style": "navy",
    "numbered": false
   }
  ],
  "updatedAt": null
 },
 "t-akademik": {
  "title": "KALENDAR AKADEMIK TAHUN 2026",
  "subtitle": "KUMPULAN B",
  "layout": "standard",
  "blocks": [
   {
    "id": "d2537f0c60e8",
    "type": "table",
    "columns": [
     "PENGGAL",
     "MULA",
     "AKHIR",
     "JUMLAH HARI",
     "JUMLAH MINGGU"
    ],
    "rows": [
     [
      "PENGGAL 1",
      "12.01.2026",
      "31.01.2026",
      "15",
      "10"
     ],
     [
      "",
      "01.02.2026",
      "28.02.2026",
      "15",
      ""
     ],
     [
      "",
      "01.03.2026",
      "20.03.2026",
      "13",
      ""
     ],
     [
      "",
      "**CUTI PENGGAL I**",
      "**21.03.2026 - 29.03.2026**",
      "9",
      "1"
     ],
     [
      "",
      "30.03.2026",
      "31.03.2026",
      "2",
      "8"
     ],
     [
      "",
      "01.04.2026",
      "30.04.2026",
      "22",
      ""
     ],
     [
      "",
      "01.05.2026",
      "22.05.2026",
      "15",
      ""
     ],
     [
      "",
      "**CUTI PERTENGAHAN TAHUN**",
      "**23.05.2026 - 07.06.2026**",
      "16",
      "2"
     ],
     [
      "PENGGAL 2",
      "08.06.2026",
      "30.06.2026",
      "16",
      "12"
     ],
     [
      "",
      "01.07.2026",
      "31.07.2026",
      "23",
      ""
     ],
     [
      "",
      "01.08.2026",
      "28.08.2026",
      "19",
      ""
     ],
     [
      "",
      "**CUTI PENGGAL II**",
      "**29.08.2026 - 06.09.2026**",
      "9",
      "1"
     ],
     [
      "",
      "07.09.2026",
      "30.09.2026",
      "17",
      "13"
     ],
     [
      "",
      "01.10.2026",
      "31.10.2026",
      "22",
      ""
     ],
     [
      "",
      "01.11.2026",
      "30.11.2026",
      "19",
      ""
     ],
     [
      "",
      "01.12.2026",
      "04.12.2026",
      "4",
      ""
     ],
     [
      "",
      "**CUTI AKHIR TAHUN**",
      "**05.12.2026 – 31.12.2026**",
      "27",
      "4"
     ]
    ],
    "style": "navy",
    "numbered": false
   },
   {
    "id": "ff160d63155b",
    "type": "paragraph",
    "text": "Sekolah-sekolah di negeri Johor, Melaka, Negeri Sembilan, Pahang, Perak, Perlis, Pulau Pinang, Sabah, Sarawak, Selangor, Wilayah Persekutuan Kuala Lumpur, Wilayah Persekutuan Labuan dan Wilayah Persekutuan Putrajaya."
   }
  ],
  "updatedAt": null
 },
 "takwim-01": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "JANUARI",
  "layout": "standard",
  "blocks": [
   {
    "id": "e394a2cb2da3",
    "type": "takwim",
    "title": "JANUARI",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Jan 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "2 Jan 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "3 Jan 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "4 Jan 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "5 Jan 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "6 Jan 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "7 Jan 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Orientasi Tahun 1 / Prasekolah / PPKI Mesyuarat Guru (1) / Mesyuarat Kurikulum (1) / Mesyuarat Transisi Tahun 1 / Mesyuarat Induk Hal Ehwal Murid (1) / Mesyuarat Induk Kokurikulum (1) / BAGUSKeceriaan Kelas"
     },
     {
      "week": "",
      "date": "8 Jan 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Mesyuarat Semua Panitia /Mesyuarat PPKI Bil 1/2026"
     },
     {
      "week": "",
      "date": "9 Jan 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Gotong Royong Persiapan Keceriaan Kelas"
     },
     {
      "week": "",
      "date": "10 Jan 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "11 Jan 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "1",
      "date": "12 Jan 2026",
      "day": "Isnin",
      "cells": [
       "",
       "Program Transisi Tahun 1 - bermula\n- Minggu Riang Ria Sekolahku",
       "Jom Datang Ke Sekolah 'Datang Dengan Harapan, Pulang Dengan Kejayaan'",
       "",
       ""
      ]
     },
     {
      "week": "1",
      "date": "13 Jan 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Minggu Riang Ria Sekolahku",
       "- Sudut Mini Booth Bertema (HEM) ' Adab Dulu Baru Ilmu '",
       "",
       "Minggu Riang Ria Sekolahku PPKI"
      ]
     },
     {
      "week": "1",
      "date": "14 Jan 2026",
      "day": "Rabu",
      "cells": [
       "",
       "Minggu Riang Ria Sekolahku",
       "Slot Taklimat Disiplin & Peraturan Sekolah",
       "",
       "Minggu Riang Ria Sekolahku PPKI"
      ]
     },
     {
      "week": "1",
      "date": "15 Jan 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Minggu Riang Ria Sekolahku",
       "Sesi Motivasi UBK - Anak Baik Lagi Cerdik & Sahsiah Terpuji",
       "",
       "Minggu Riang Ria Sekolahku PPKI"
      ]
     },
     {
      "week": "1",
      "date": "16 Jan 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "Minggu Riang Ria Sekolahku",
       "",
       "",
       "Minggu Riang Ria Sekolahku PPKI"
      ]
     },
     {
      "week": "",
      "date": "17 Jan 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "18 Jan 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "2",
      "date": "19 Jan 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "2",
      "date": "20 Jan 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Orientasi Tahun 4",
       "Penyerahan Bantuan Awal Persekolahan (BAP)",
       "",
       ""
      ]
     },
     {
      "week": "2",
      "date": "21 Jan 2026",
      "day": "Rabu",
      "cells": [
       "",
       "Orientasi Tahun 4",
       "",
       "KOKO Ke1 - Mesyuarat Agung KP/UB/SP",
       ""
      ]
     },
     {
      "week": "2",
      "date": "22 Jan 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Orientasi Tahun 4",
       "Mesyuarat J/K Induk HEM Bil.1",
       "",
       "Bimbingan berkelompok 1 PPDBP (PKPK)"
      ]
     },
     {
      "week": "2",
      "date": "23 Jan 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "Kebajikan Kasih HEM - Sumbangan Beg / Buku Tulis (BackToSchool) dari pihak luar",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "24 Jan 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       "Taklimat Ibu Bapa (Program Pendidikan Inklusif , RPI,PAPR)"
      ]
     },
     {
      "week": "",
      "date": "25 Jan 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "3",
      "date": "26 Jan 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "Program Kebersihan & Keceriaan Kelas",
       "",
       ""
      ]
     },
     {
      "week": "3",
      "date": "27 Jan 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Program: Tandas Bersih dan Ceria",
       "",
       ""
      ]
     },
     {
      "week": "3",
      "date": "28 Jan 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "-Tempoh Latihan Pemimpin Kecil (Pengawas) -Pemilihan Ketua Kelas & Penolong",
       "KOKO Ke-2 KP",
       ""
      ]
     },
     {
      "week": "3",
      "date": "29 Jan 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "BENGKEL PENYELARASAN JU RPI (PKPK)"
      ]
     },
     {
      "week": "3",
      "date": "30 Jan 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "Program RMT -Pemantauan Kualiti Makanan",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "31 Jan 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-02": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "FEBRUARI",
  "layout": "standard",
  "blocks": [
   {
    "id": "bab729daf1bd",
    "type": "takwim",
    "title": "FEBRUARI",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Feb 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Hari Wilayah / Hari Thaipusam"
     },
     {
      "week": "",
      "date": "2 Feb 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Berganti Sempena Hari Wilayah / Hari Thaipusam"
     },
     {
      "week": "4",
      "date": "3 Feb 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       "PLC- Prasidang RPI murid baharu"
      ]
     },
     {
      "week": "4",
      "date": "4 Feb 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-2 SP",
       ""
      ]
     },
     {
      "week": "4",
      "date": "5 Feb 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "-Sudut Kelas: 'Sahsiah Terbaik Bulanan'\n-Galakan Rekod Amalan Baik",
       "",
       "Program LiPs Siri 1 PPDBP (GPKI BM)"
      ]
     },
     {
      "week": "4",
      "date": "6 Feb 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "Majlis Penutup Program Transisi Tahun 1",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "7 Feb 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "8 Feb 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "5",
      "date": "9 Feb 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "5",
      "date": "10 Feb 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "-5 Minit Bicara Disiplin",
       "",
       "Suai Kenal Inklusif,Pelantikan Rakan Inklusif"
      ]
     },
     {
      "week": "5",
      "date": "11 Feb 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-2 UB",
       "Perjumpaan Kokurikulum"
      ]
     },
     {
      "week": "5",
      "date": "12 Feb 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "- Sudut Mini Booth Bertema (HEM) 'Hentikan Buli dan Salahlaku'",
       "",
       "Bengkel Rancangan Pendidikan Individu"
      ]
     },
     {
      "week": "5",
      "date": "13 Feb 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "14 Feb 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "15 Feb 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "6",
      "date": "16 Feb 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Tambahan KPM Sempena Tahun Baru Cina"
     },
     {
      "week": "6",
      "date": "17 Feb 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Tahun Baru Cina"
     },
     {
      "week": "6",
      "date": "18 Feb 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Tahun Baru Cina"
     },
     {
      "week": "6",
      "date": "19 Feb 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Tambahan KPM Sempena Tahun Baru Cina / Awal Ramadan 1447H"
     },
     {
      "week": "6",
      "date": "20 Feb 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Tambahan KPM Sempena Tahun Baru Cina"
     },
     {
      "week": "",
      "date": "21 Feb 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "22 Feb 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "7",
      "date": "23 Feb 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "7",
      "date": "24 Feb 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Ihya Ramadhan dan Bulan Panitia Pendidikan Islam (bermula)",
       "",
       "",
       "Program Ihya Ramadhan (bermula)"
      ]
     },
     {
      "week": "7",
      "date": "25 Feb 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-3 KP / SP",
       ""
      ]
     },
     {
      "week": "7",
      "date": "26 Feb 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "7",
      "date": "27 Feb 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "28 Feb 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       "Mesyuarat AJK Biro Pendidikan Khas"
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-03": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "MAC",
  "layout": "standard",
  "blocks": [
   {
    "id": "e14052367aab",
    "type": "takwim",
    "title": "MAC",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Mac 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "8",
      "date": "2 Mac 2026",
      "day": "Isnin",
      "cells": [
       "Penilaian Kendiri (SK@S) - bermula",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "8",
      "date": "3 Mac 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "-5 Minit Bicara Disiplin\n-5 Minit PPDA",
       "",
       ""
      ]
     },
     {
      "week": "8",
      "date": "4 Mac 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-3 UB / KOKO Ke-4 KP",
       ""
      ]
     },
     {
      "week": "8",
      "date": "5 Mac 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "8",
      "date": "6 Mac 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "7 Mac 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Hari Nuzul Quran"
     },
     {
      "week": "",
      "date": "8 Mac 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "9",
      "date": "9 Mac 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       "Program LiPs Siri 2 PPDBP (PKPK & GPKI BM)"
      ]
     },
     {
      "week": "9",
      "date": "10 Mac 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "9",
      "date": "11 Mac 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-4 SP / UB",
       ""
      ]
     },
     {
      "week": "9",
      "date": "12 Mac 2026",
      "day": "Khamis",
      "cells": [
       "Mesyuarat JK PBPPP Pertama",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "9",
      "date": "13 Mac 2026",
      "day": "Jumaat",
      "cells": [
       "Penilaian Kendiri (SK@S) - berakhir",
       "",
       "Kebajikan Kasih HEM - Sumbangan Pakaian Raya dari sumbangan pihak luar",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "14 Mac 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "15 Mac 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "10",
      "date": "16 Mac 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "Perhimpunan Bulanan Kokurikulum - TKRS",
       ""
      ]
     },
     {
      "week": "10",
      "date": "17 Mac 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Penutup Ihya Ramadhan dan Bulan Panitia Pendidikan Islam",
       "",
       "",
       "Penutup Ihya Ramadhan PPKI"
      ]
     },
     {
      "week": "10",
      "date": "18 Mac 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "-",
       ""
      ]
     },
     {
      "week": "",
      "date": "19 Mac 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Tambahan KPM Sempena Hari Raya Aidilfitri"
     },
     {
      "week": "",
      "date": "20 Mac 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Tambahan KPM Sempena Hari Raya Aidilfitri"
     },
     {
      "week": "",
      "date": "21 Mac 2026",
      "day": "Sabtu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1 / Hari Raya Aidilfitri"
     },
     {
      "week": "",
      "date": "22 Mac 2026",
      "day": "Ahad",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1 / Hari Raya Aidilfitri"
     },
     {
      "week": "",
      "date": "23 Mac 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1"
     },
     {
      "week": "",
      "date": "24 Mac 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1"
     },
     {
      "week": "",
      "date": "25 Mac 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1"
     },
     {
      "week": "",
      "date": "26 Mac 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1"
     },
     {
      "week": "",
      "date": "27 Mac 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1"
     },
     {
      "week": "",
      "date": "28 Mac 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1"
     },
     {
      "week": "",
      "date": "29 Mac 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 1"
     },
     {
      "week": "",
      "date": "30 Mac 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "31 Mac 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "- Sudut Mini Booth Bertema (HEM) 'Sayangi Buku Teks Anda'",
       "",
       ""
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-04": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "APRIL",
  "layout": "standard",
  "blocks": [
   {
    "id": "21b489f2c4ed",
    "type": "takwim",
    "title": "APRIL",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "11",
      "date": "1 Apr 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-5 SP",
       "Kursus Kejurulatihan Olahraga PK Bangsar/Pudu"
      ]
     },
     {
      "week": "11",
      "date": "2 Apr 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "Kursus Kejurulatihan Olahraga PK Bangsar/Pudu"
      ]
     },
     {
      "week": "11",
      "date": "3 Apr 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "Kursus Kepimpinan (Dalaman) Pemimpin-Pemimpin Kecil",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "4 Apr 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "5 Apr 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "12",
      "date": "6 Apr 2026",
      "day": "Isnin",
      "cells": [
       "Pencerapan Kali Pertama - bermula",
       "",
       "",
       "",
       "Minggu Autisme Pencerapan Pertama (Kendiri) Bimbinganberkelompok Bil2-JUSukan"
      ]
     },
     {
      "week": "12",
      "date": "7 Apr 2026",
      "day": "Selasa",
      "cells": [
       "",
       "SEGAK Fasa 1 / BMI 5 - 9T Fasa 1",
       "",
       "",
       "Minggu Autisme"
      ]
     },
     {
      "week": "12",
      "date": "8 Apr 2026",
      "day": "Rabu",
      "cells": [
       "",
       "SEGAK Fasa 1 / BMI 5 - 9T Fasa 1",
       "",
       "KOKO Ke-5 UB",
       "Minggu Autisme"
      ]
     },
     {
      "week": "12",
      "date": "9 Apr 2026",
      "day": "Khamis",
      "cells": [
       "",
       "SEGAK Fasa 1 / BMI 5 - 9T Fasa 1",
       "Sambutan Hari Raya Aidilfitri Peringkat Sekolah (Bersama Murid) / RIMUP",
       "",
       "Sambutan Hari Raya & Hari lahir"
      ]
     },
     {
      "week": "12",
      "date": "10 Apr 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "SEGAK Fasa 1 / BMI 5 - 9T Fasa 1",
       "",
       "",
       "Minggu Autisme"
      ]
     },
     {
      "week": "",
      "date": "11 Apr 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "12 Apr 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "13",
      "date": "13 Apr 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "Perhimpunan Bulanan Kokurikulum- PPKK",
       "Bengkel Guru Data Pkhas BIL. 1 (Guru Data)"
      ]
     },
     {
      "week": "13",
      "date": "14 Apr 2026",
      "day": "Selasa",
      "cells": [
       "",
       "SEGAK Fasa 1 / BMI 5 - 9T Fasa 1",
       "",
       "",
       "Mesyuarat JPKS bil 1/2026"
      ]
     },
     {
      "week": "13",
      "date": "15 Apr 2026",
      "day": "Rabu",
      "cells": [
       "",
       "SEGAK Fasa 1 / BMI 5 - 9T Fasa 1",
       "",
       "KOKO Ke-5 KP",
       "Perjumpaan Kokurikulum Beruniform -2 1M1S -1 \"KLITC dan eNilam"
      ]
     },
     {
      "week": "13",
      "date": "16 Apr 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "KLITC dan eNilam"
      ]
     },
     {
      "week": "13",
      "date": "17 Apr 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "Majlis Penyampaian Watikah Pemimpin Kecil",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "18 Apr 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "19 Apr 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "14",
      "date": "20 Apr 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "14",
      "date": "21 Apr 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Ziarah Cakna",
       "",
       "Bengkel Penyediaan Bahan Jadual Visual"
      ]
     },
     {
      "week": "14",
      "date": "22 Apr 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-5 SP",
       "Perjumpaan Kokurikulum Beruniform -3 Kelab-2 Bengkel Penyediaan Bahan Jadual Visual"
      ]
     },
     {
      "week": "14",
      "date": "23 Apr 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "14",
      "date": "24 Apr 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "25 Apr 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Mesyuarat Guru (2) / Mesyuarat Kurikulum (2) / Mesyuarat HEM (2) / Mesyuarat KOKO (2) / TOWNHALL"
     },
     {
      "week": "",
      "date": "26 Apr 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "15",
      "date": "27 Apr 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "15",
      "date": "28 Apr 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Program PPDA Booth Bertema HEM (Pencegahan Anti-Dadah)",
       "",
       ""
      ]
     },
     {
      "week": "15",
      "date": "29 Apr 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO ke-6 KP",
       "Perjumpaan Kokurikulum Beruniform -4 1M1S -2"
      ]
     },
     {
      "week": "15",
      "date": "30 Apr 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-05": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "MEI",
  "layout": "standard",
  "blocks": [
   {
    "id": "8007d60f405a",
    "type": "takwim",
    "title": "MEI",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Mei 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Hari Pekerja"
     },
     {
      "week": "",
      "date": "2 Mei 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "3 Mei 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "16",
      "date": "4 Mei 2026",
      "day": "Isnin",
      "cells": [
       "Penghantaran Keberhasilan PBPPP Pertama - bermula",
       "",
       "Pemeriksaan Kesihatan PPKI & Pra Sekolah",
       "",
       "Bimbingan berkelompok Bil. 3 PPDBP"
      ]
     },
     {
      "week": "16",
      "date": "5 Mei 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Tahun 1&Tahun 6",
       "",
       ""
      ]
     },
     {
      "week": "16",
      "date": "6 Mei 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Tahun 1&Tahun 6",
       "KOKO Ke-6 UB",
       "Perjumpaan Kokurikulum Beruniform -5 Kelab -3"
      ]
     },
     {
      "week": "16",
      "date": "7 Mei 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Tahun 1&Tahun 6",
       "",
       "Mesyuarat PPKI Bil 2/2026"
      ]
     },
     {
      "week": "16",
      "date": "8 Mei 2026",
      "day": "Jumaat",
      "cells": [
       "Penghantaran Keberhasilan PBPPP Pertama - berakhir",
       "",
       "Pemeriksaan Kesihatan Tahun 1&Tahun 6",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "9 Mei 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Merentas Desa"
     },
     {
      "week": "",
      "date": "10 Mei 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "17",
      "date": "11 Mei 2026",
      "day": "Isnin",
      "cells": [
       "",
       "Minggu Panitia Bahasa Inggeris",
       "",
       "Perhimpunan Bulanan Kokurikulum- PPIM",
       ""
      ]
     },
     {
      "week": "17",
      "date": "12 Mei 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Minggu Panitia Bahasa Inggeris",
       "5 Minit Bicara Disiplin",
       "",
       "STEM Fun Learning SK JPWPKL"
      ]
     },
     {
      "week": "17",
      "date": "13 Mei 2026",
      "day": "Rabu",
      "cells": [
       "",
       "Minggu Panitia Bahasa Inggeris",
       "",
       "KOKO Ke-7 KP",
       "Perjumpaan Kokurikulum Beruniform -6 1M1S -3"
      ]
     },
     {
      "week": "17",
      "date": "14 Mei 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Minggu Panitia Bahasa Inggeris",
       "",
       "",
       "Program Sokongan 1 (Rekreasi & Riadah)"
      ]
     },
     {
      "week": "17",
      "date": "15 Mei 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "Minggu Panitia Bahasa Inggeris",
       "",
       "",
       "Mesyuarat Perdana Biro Pkhas 2026"
      ]
     },
     {
      "week": "",
      "date": "16 Mei 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "17 Mei 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "18",
      "date": "18 Mei 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       "Bengkel Bahan Bantu Mengarajar STEM SR"
      ]
     },
     {
      "week": "18",
      "date": "19 Mei 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "18",
      "date": "20 Mei 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-7 UB",
       "Perjumpaan Kokurikulum Beruniform -7 Kelab -4"
      ]
     },
     {
      "week": "18",
      "date": "21 Mei 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "Bimbingan Berkelompok Pendidikan Khas Bil. 2"
      ]
     },
     {
      "week": "18",
      "date": "22 Mei 2026",
      "day": "Jumaat",
      "cells": [
       "Pencerapan Kali Pertama - berakhir",
       "",
       "Sambutan Hari Guru Peringkat Sekolah",
       "",
       "Sambutan Hari Guru"
      ]
     },
     {
      "week": "",
      "date": "23 Mei 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "24 Mei 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "25 Mei 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "26 Mei 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "27 Mei 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal / Hari Raya Haji"
     },
     {
      "week": "",
      "date": "28 Mei 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal / Hari Raya Haji"
     },
     {
      "week": "",
      "date": "29 Mei 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "30 Mei 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "31 Mei 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal / Hari Wesak"
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-06": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "JUN",
  "layout": "standard",
  "blocks": [
   {
    "id": "0b7da4dfcff2",
    "type": "takwim",
    "title": "JUN",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Jun 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal / Hari Keputeraan YDP Agong / Cuti Ganti Hari Wesak"
     },
     {
      "week": "",
      "date": "2 Jun 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "3 Jun 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "4 Jun 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "5 Jun 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "6 Jun 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "",
      "date": "7 Jun 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Pertengahan Penggal"
     },
     {
      "week": "19",
      "date": "8 Jun 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "19",
      "date": "9 Jun 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       "Kejohanan Mini Olahraga Pendidikan Khas Peringkat Daerah Bangsar/Pudu"
      ]
     },
     {
      "week": "19",
      "date": "10 Jun 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "",
       "Kejohanan Mini Olahraga Pendidikan Khas Peringkat Daerah Bangsar/Pudu"
      ]
     },
     {
      "week": "19",
      "date": "11 Jun 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "Program Sokongan 2 (Boling & Mobiliti Pasaraya)"
      ]
     },
     {
      "week": "19",
      "date": "12 Jun 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "-Pengisian Borang Tahun 6 Ke Sekolah Menengah",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "13 Jun 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "Cadangan Tarikh Gotong Royong Madani / Perdana",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "14 Jun 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "15 Jun 2026",
      "day": "Isnin",
      "cells": [
       "Pengisian Skor PBPPP Pertama",
       "",
       "",
       "Perhimpunan Bulanan Kokurikulum- PPT",
       ""
      ]
     },
     {
      "week": "",
      "date": "16 Jun 2026",
      "day": "Selasa",
      "cells": [
       "Pengisian Skor PBPPP Pertama",
       "",
       "- Sudut Mini Booth Bertema (HEM)",
       "",
       ""
      ]
     },
     {
      "week": "20",
      "date": "17 Jun 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Awal Muharram 1448H"
     },
     {
      "week": "20",
      "date": "18 Jun 2026",
      "day": "Khamis",
      "cells": [
       "Pengisian Skor PBPPP Pertama",
       "",
       "",
       "",
       "Hari Urus Diri 1"
      ]
     },
     {
      "week": "20",
      "date": "19 Jun 2026",
      "day": "Jumaat",
      "cells": [
       "Pengisian Skor PBPPP Pertama",
       "",
       "",
       "",
       "Hari Urus Diri 2"
      ]
     },
     {
      "week": "",
      "date": "20 Jun 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "21 Jun 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "21",
      "date": "22 Jun 2026",
      "day": "Isnin",
      "cells": [
       "",
       "Ujian Pertengahan Sesi Akademik (UPSA)",
       "",
       "",
       ""
      ]
     },
     {
      "week": "21",
      "date": "23 Jun 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Ujian Pertengahan Sesi Akademik (UPSA)",
       "",
       "",
       ""
      ]
     },
     {
      "week": "21",
      "date": "24 Jun 2026",
      "day": "Rabu",
      "cells": [
       "",
       "Ujian Pertengahan Sesi Akademik (UPSA)",
       "",
       "",
       "Perjumpaan Kokurikulum Beruniform -9 Kelab -5"
      ]
     },
     {
      "week": "21",
      "date": "25 Jun 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Ujian Pertengahan Sesi Akademik (UPSA)",
       "",
       "",
       "Bengkel Pemantapan Penulisan Intervensi RPI"
      ]
     },
     {
      "week": "21",
      "date": "26 Jun 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "Ujian Pertengahan Sesi Akademik (UPSA)",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "27 Jun 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       "Mesyuarat AJK Biro Pendidikan Khas"
      ]
     },
     {
      "week": "",
      "date": "28 Jun 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "29 Jun 2026",
      "day": "Isnin",
      "cells": [
       "",
       "MINGGU STEM",
       "",
       "LATIHAN SUKAN",
       "\"Perjumpaan Kokurikulum Beruniform -10 1M1S-5"
      ]
     },
     {
      "week": "",
      "date": "30 Jun 2026",
      "day": "Selasa",
      "cells": [
       "",
       "MINGGU STEM",
       "",
       "LATIHAN SUKAN",
       ""
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-07": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "JULAI",
  "layout": "standard",
  "blocks": [
   {
    "id": "f49b40c8bf2f",
    "type": "takwim",
    "title": "JULAI",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "22",
      "date": "1 Jul 2026",
      "day": "Rabu",
      "cells": [
       "",
       "MINGGU STEM",
       "",
       "LATIHAN SUKAN / KOKO Ke-7 SP",
       "\"Perjumpaan Kokurikulum Beruniform -11 Kelab -6"
      ]
     },
     {
      "week": "22",
      "date": "2 Jul 2026",
      "day": "Khamis",
      "cells": [
       "",
       "MINGGU STEM",
       "Ceramah Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "22",
      "date": "3 Jul 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "MINGGU STEM",
       "",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "",
      "date": "4 Jul 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "5 Jul 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "23",
      "date": "6 Jul 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "23",
      "date": "7 Jul 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "23",
      "date": "8 Jul 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN / KOKO Ke-8 SP",
       "Perjumpaan Kokurikulum Beruniform -12 1M1S -6"
      ]
     },
     {
      "week": "23",
      "date": "9 Jul 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "23",
      "date": "10 Jul 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "",
      "date": "11 Jul 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "12 Jul 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       "Karnival Ko_kurikulum Pend. Khas Kebangsaan"
      ]
     },
     {
      "week": "24",
      "date": "13 Jul 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "Perhimpunan Bulanan Kokurikulum- BSM",
       "2026 Latihan Sukan"
      ]
     },
     {
      "week": "24",
      "date": "14 Jul 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "24",
      "date": "15 Jul 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN / KOKO Ke-9 SP",
       "Perjumpaan Kokurikulum Beruniform -13 Kelab -7"
      ]
     },
     {
      "week": "24",
      "date": "16 Jul 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "24",
      "date": "17 Jul 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "Pemeriksaan Kesihatan Gigi",
       "LATIHAN SUKAN",
       "Latihan Sukan"
      ]
     },
     {
      "week": "",
      "date": "18 Jul 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "19 Jul 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "25",
      "date": "20 Jul 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "PRA KEJOHANAN",
       "PRA KEJOHANAN Bengkel Data Kebolehpasaran Bangsar/Pudu"
      ]
     },
     {
      "week": "25",
      "date": "21 Jul 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "PRA KEJOHANAN",
       "PRA KEJOHANAN"
      ]
     },
     {
      "week": "25",
      "date": "22 Jul 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "PRA KEJOHANAN / KOKO Ke-10 SP",
       "PRA KEJOHANAN"
      ]
     },
     {
      "week": "25",
      "date": "23 Jul 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "SUKANEKA TAHAP 1,PRA SEKOLAH DAN PPKI",
       "SUKANEKA TAHAP 1,PRA SEKOLAH DAN PPKI"
      ]
     },
     {
      "week": "25",
      "date": "24 Jul 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "25 Jul 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Kejohanan Olahraga Tahunan"
     },
     {
      "week": "",
      "date": "26 Jul 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "26",
      "date": "27 Jul 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Peristiwa (1) / Kejohanan Olahraga Pend. Khas MSSWPKL 2026"
     },
     {
      "week": "26",
      "date": "28 Jul 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       "Kejohanan Olahraga Pend. Khas MSSWPKL 2026"
      ]
     },
     {
      "week": "26",
      "date": "29 Jul 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-8 UB",
       "Perjumpaan Kokurikulum Kelab & 1M1S -8 Kejohanan Olahraga Pend. Khas MSSWPKL 2027"
      ]
     },
     {
      "week": "26",
      "date": "30 Jul 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "Kejohanan Olahraga Pend. Khas MSSWPKL 2028"
      ]
     },
     {
      "week": "26",
      "date": "31 Jul 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-08": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "OGOS",
  "layout": "standard",
  "blocks": [
   {
    "id": "f37f712c7007",
    "type": "takwim",
    "title": "OGOS",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Ogos 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "2 Ogos 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "27",
      "date": "3 Ogos 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "27",
      "date": "4 Ogos 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "27",
      "date": "5 Ogos 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-9 KP",
       "Perjumpaan Kokurikulum Kelab & 1M1S -9"
      ]
     },
     {
      "week": "27",
      "date": "6 Ogos 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Dialog Prestasi Bersama KP (Fasa 1)",
       "",
       "",
       "Bimbingan Hari Inspirasi Pendidikan Khas Bil. 1"
      ]
     },
     {
      "week": "27",
      "date": "7 Ogos 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "8 Ogos 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "9 Ogos 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "28",
      "date": "10 Ogos 2026",
      "day": "Isnin",
      "cells": [
       "",
       "Minggu Panitia Bahasa Melayu",
       "",
       "Perhimpunan Bulanan Kokurikulum- TKRS",
       ""
      ]
     },
     {
      "week": "28",
      "date": "11 Ogos 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Minggu Panitia Bahasa Melayu",
       "-Ziarah Cakna\n- Kaunseling (Intervensi Berkala)",
       "",
       ""
      ]
     },
     {
      "week": "28",
      "date": "12 Ogos 2026",
      "day": "Rabu",
      "cells": [
       "",
       "Minggu Panitia Bahasa Melayu",
       "",
       "KOKO Ke-9 UB",
       "Perjumpaan Kokurikulum Kelab & 1M1S -10"
      ]
     },
     {
      "week": "28",
      "date": "13 Ogos 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Minggu Panitia Bahasa Melayu",
       "",
       "",
       "Program sokongan 3 (Boling & Membeli belah)"
      ]
     },
     {
      "week": "28",
      "date": "14 Ogos 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "Minggu Panitia Bahasa Melayu",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "15 Ogos 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       "Karnival Kebolehpasaran MBPK"
      ]
     },
     {
      "week": "",
      "date": "16 Ogos 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "29",
      "date": "17 Ogos 2026",
      "day": "Isnin",
      "cells": [
       "",
       "Pelancaran Sambutan Bulan Kebangsaan (Kelab Rukun Negara dan Panitia Sejarah)",
       "",
       "",
       "Mesyuarat PPKI Bil 3/2026"
      ]
     },
     {
      "week": "29",
      "date": "18 Ogos 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Pertandingan Keceriaan Kelas Bertema Patriotik",
       "",
       "Bengkel DATAPINTAR Pend. Khas (Literasi & Numerasi dan PBD)"
      ]
     },
     {
      "week": "29",
      "date": "19 Ogos 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-10 KP",
       "Perjumpaan Kokurikulum Kelab & 1M1S -11"
      ]
     },
     {
      "week": "29",
      "date": "20 Ogos 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Hari Bicara Akademik Bersama Ibu Bapa/Penjaga (Fasa 1)",
       "",
       "",
       "Dialog Akademik Bersama Ibu Bapa/Penjaga PPKI (Fasa 1)"
      ]
     },
     {
      "week": "29",
      "date": "21 Ogos 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "22 Ogos 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "23 Ogos 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "24 Ogos 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "30",
      "date": "25 Ogos 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Maulidur Rasul"
     },
     {
      "week": "30",
      "date": "26 Ogos 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-11 KP",
       "Perjumpaan Kokurikulum Kelab & 1M1S -12"
      ]
     },
     {
      "week": "30",
      "date": "27 Ogos 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "Latihan Kebakaran (Fire Drill) Fasa I",
       "",
       ""
      ]
     },
     {
      "week": "30",
      "date": "28 Ogos 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "29 Ogos 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "",
      "date": "30 Ogos 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "",
      "date": "31 Ogos 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2 / Hari Kebangsaan"
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-09": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "SEPTEMBER",
  "layout": "standard",
  "blocks": [
   {
    "id": "231994567d03",
    "type": "takwim",
    "title": "SEPTEMBER",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Sep 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "",
      "date": "2 Sep 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "",
      "date": "3 Sep 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "",
      "date": "4 Sep 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "",
      "date": "5 Sep 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "",
      "date": "6 Sep 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Penggal 2"
     },
     {
      "week": "31",
      "date": "7 Sep 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "31",
      "date": "8 Sep 2026",
      "day": "Selasa",
      "cells": [
       "Pencerapan Kedua",
       "",
       "",
       "",
       "Pencerapan ke2 Semakan buku latihan"
      ]
     },
     {
      "week": "31",
      "date": "9 Sep 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "KOKO Ke-10 UB",
       "Bimbingan Hari Inspirasi Pendidikan Khas Bil. 2"
      ]
     },
     {
      "week": "31",
      "date": "10 Sep 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "11 Sep 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "Perkhemahan Perdana Unit Beruniform",
       "Perkhemahan dan Kem Jati Diri PPKI"
      ]
     },
     {
      "week": "",
      "date": "12 Sep 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "Perkhemahan Perdana Unit Beruniform",
       "Perkhemahan dan Kem Jati Diri PPKI"
      ]
     },
     {
      "week": "",
      "date": "13 Sep 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "Perkhemahan Perdana Unit Beruniform",
       ""
      ]
     },
     {
      "week": "",
      "date": "14 Sep 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "Perhimpunan Bulanan Kokurikulum- PPKK",
       ""
      ]
     },
     {
      "week": "",
      "date": "15 Sep 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "32",
      "date": "16 Sep 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Hari Malaysia"
     },
     {
      "week": "32",
      "date": "17 Sep 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Penutup Bulan Kebangsaan (Kelab Rukun Negara dan Panitia Sejarah)",
       "Pertandingan Keceriaan Kelas Bertema Kelas Patriotik (Sesi Penjurian)",
       "",
       "Sambutan Bulan Kebangsaan Lawatan Sosial (Melaka)"
      ]
     },
     {
      "week": "32",
      "date": "18 Sep 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "19 Sep 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "20 Sep 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "33",
      "date": "21 Sep 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       "Bimbingan Hari Inspirasi Pendidikan Khas Bil. 3"
      ]
     },
     {
      "week": "33",
      "date": "22 Sep 2026",
      "day": "Selasa",
      "cells": [
       "",
       "SEGAK Fasa 2 / BMI5 - 9 T Fasa 2",
       "",
       "",
       "Karnival Mahabbah Pend. Khas JPWPKL 2026"
      ]
     },
     {
      "week": "33",
      "date": "23 Sep 2026",
      "day": "Rabu",
      "cells": [
       "",
       "SEGAK Fasa 2 / BMI5 - 9 T Fasa 2",
       "",
       "KOKO Ke-12 KP",
       "Karnival Mahabbah Pend. Khas JPWPKL 2027"
      ]
     },
     {
      "week": "33",
      "date": "24 Sep 2026",
      "day": "Khamis",
      "cells": [
       "",
       "SEGAK Fasa 2 / BMI5 - 9 T Fasa 2",
       "",
       "",
       "Karnival Mahabbah Pend. Khas JPWPKL 2028"
      ]
     },
     {
      "week": "33",
      "date": "25 Sep 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "SEGAK Fasa 2 / BMI5 - 9 T Fasa 2",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "26 Sep 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Mesyuarat Guru (3) / Mesyuarat Kurikulum (3) / Mesyuarat HEM (3) / Mesyuarat KOKO (3)"
     },
     {
      "week": "",
      "date": "27 Sep 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "34",
      "date": "28 Sep 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "34",
      "date": "29 Sep 2026",
      "day": "Selasa",
      "cells": [
       "",
       "SEGAK Fasa 2 / BMI5 - 9 T Fasa 2",
       "- Sudut Mini Booth Bertema (HEM) 'Keselamatan 3K'",
       "",
       "Hari Inspirasi Pend. Khas Bangsar/Pudu"
      ]
     },
     {
      "week": "34",
      "date": "30 Sep 2026",
      "day": "Rabu",
      "cells": [
       "",
       "SEGAK Fasa 2 / BMI5 - 9 T Fasa 2",
       "",
       "KOKO Ke-12 SP",
       "Hari Inspirasi Pend. Khas Bangsar/Pudu"
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-10": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "OKTOBER",
  "layout": "standard",
  "blocks": [
   {
    "id": "11807a1f0596",
    "type": "takwim",
    "title": "OKTOBER",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Okt 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "2 Okt 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "3 Okt 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "4 Okt 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "35",
      "date": "5 Okt 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "35",
      "date": "6 Okt 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       "Bengkel Guru Data Pend. Khas Bil.2 PPDBP"
      ]
     },
     {
      "week": "35",
      "date": "7 Okt 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "",
       "Program Sokongan 4 (Berkuda)"
      ]
     },
     {
      "week": "35",
      "date": "8 Okt 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "35",
      "date": "9 Okt 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "Sambutan Hari Kanak-Kanak Peringkat Sekolah Anjuran HEM dan UBK",
       "",
       "Sambutan hari Kanak-kanak PPKi"
      ]
     },
     {
      "week": "",
      "date": "10 Okt 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "11 Okt 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "36",
      "date": "12 Okt 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "Perhimpunan Bulanan Kokurikulu- PPIM",
       "Minggu Pend khas"
      ]
     },
     {
      "week": "36",
      "date": "13 Okt 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       "Minggu Pend khas"
      ]
     },
     {
      "week": "36",
      "date": "14 Okt 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "",
       "Minggu Pend khas"
      ]
     },
     {
      "week": "36",
      "date": "15 Okt 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "Minggu Pend khas (Usahawan Cilik) Bimbingan Berkelompok bil 3 PKPK Bangsar Pudu"
      ]
     },
     {
      "week": "36",
      "date": "16 Okt 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       "Minggu Pend khas"
      ]
     },
     {
      "week": "",
      "date": "17 Okt 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Hari Sukan Negara (HSN)"
     },
     {
      "week": "",
      "date": "18 Okt 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "37",
      "date": "19 Okt 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "Cadangan Latihan Kebakaran (Fire Drill) Fasa II",
       "",
       ""
      ]
     },
     {
      "week": "37",
      "date": "20 Okt 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Minggu Ulangkaji UASA",
       "",
       "",
       "Mesyuarat JPKS bil 2/2026"
      ]
     },
     {
      "week": "37",
      "date": "21 Okt 2026",
      "day": "Rabu",
      "cells": [
       "",
       "Minggu Ulangkaji UASA",
       "",
       "",
       ""
      ]
     },
     {
      "week": "37",
      "date": "22 Okt 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Minggu Ulangkaji UASA",
       "",
       "",
       "Program sokongan 5 (memanah)"
      ]
     },
     {
      "week": "37",
      "date": "23 Okt 2026",
      "day": "Jumaat",
      "cells": [
       "Pencerapan Kali Kedua",
       "Minggu Ulangkaji UASA",
       "",
       "",
       "Pencerapan Kali Ke 2 berkahir"
      ]
     },
     {
      "week": "",
      "date": "24 Okt 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       "Hari Keluarga PPKI & Sambutan Hari Lahir Fasa 2"
      ]
     },
     {
      "week": "",
      "date": "25 Okt 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "38",
      "date": "26 Okt 2026",
      "day": "Isnin",
      "cells": [
       "",
       "Ujian Akhir Sesi Akademik (UASA)",
       "",
       "",
       "Ujian Akhir Sesi Akademik (UASA) Tahap 2"
      ]
     },
     {
      "week": "38",
      "date": "27 Okt 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Ujian Akhir Sesi Akademik (UASA)",
       "",
       "",
       "Ujian Akhir Sesi Akademik (UASA) Tahap 3"
      ]
     },
     {
      "week": "38",
      "date": "28 Okt 2026",
      "day": "Rabu",
      "cells": [
       "",
       "Ujian Akhir Sesi Akademik (UASA)",
       "",
       "",
       "Ujian Akhir Sesi Akademik (UASA) Tahap 4"
      ]
     },
     {
      "week": "38",
      "date": "29 Okt 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Ujian Akhir Sesi Akademik (UASA)",
       "",
       "",
       "Ujian Akhir Sesi Akademik (UASA) Tahap 5"
      ]
     },
     {
      "week": "38",
      "date": "30 Okt 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "Ujian Akhir Sesi Akademik (UASA)",
       "",
       "",
       "Ujian Akhir Sesi Akademik (UASA) Tahap 6"
      ]
     },
     {
      "week": "",
      "date": "31 Okt 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-11": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "NOVEMBER",
  "layout": "standard",
  "blocks": [
   {
    "id": "34de495f1d7e",
    "type": "takwim",
    "title": "NOVEMBER",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "",
      "date": "1 Nov 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "39",
      "date": "2 Nov 2026",
      "day": "Isnin",
      "cells": [
       "Penghantaran Keberhasilan PBPPP Kedua - bermula",
       "",
       "",
       "",
       "Team Building PKPK Bangsar/Pudu"
      ]
     },
     {
      "week": "39",
      "date": "3 Nov 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "39",
      "date": "4 Nov 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "39",
      "date": "5 Nov 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       "Program Sokongan 6"
      ]
     },
     {
      "week": "39",
      "date": "6 Nov 2026",
      "day": "Jumaat",
      "cells": [
       "Penghantaran Keberhasilan PBPPP Kedua - berakhir",
       "",
       "Jamuan Kelas Akhir Tahun & Sambutan Hari Lahir",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "7 Nov 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "8 Nov 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Hari Deepavali"
     },
     {
      "week": "",
      "date": "9 Nov 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Ganti Hari Deepavali"
     },
     {
      "week": "",
      "date": "10 Nov 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Pemberian KPM"
     },
     {
      "week": "40",
      "date": "11 Nov 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "",
       "Mesyuarat PPKI Bil 4/2026"
      ]
     },
     {
      "week": "40",
      "date": "12 Nov 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "40",
      "date": "13 Nov 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "14 Nov 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "Majlis Apresiasi Tahun 6",
       "",
       "",
       "",
       "Fiesta Ria PPKI & Apresiasi"
      ]
     },
     {
      "week": "",
      "date": "15 Nov 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "41",
      "date": "16 Nov 2026",
      "day": "Isnin",
      "cells": [
       "Pengisian Skor PBPPP Kedua",
       "",
       "Minggu Pemulangan Buku Teks (SPBT)",
       "Perhimpunan Bulanan Kokurikulum- PPT",
       ""
      ]
     },
     {
      "week": "41",
      "date": "17 Nov 2026",
      "day": "Selasa",
      "cells": [
       "Pengisian Skor PBPPP Kedua",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "41",
      "date": "18 Nov 2026",
      "day": "Rabu",
      "cells": [
       "Pengisian Skor PBPPP Kedua",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "41",
      "date": "19 Nov 2026",
      "day": "Khamis",
      "cells": [
       "Pengisian Skor PBPPP Kedua",
       "Hari Bicara Akademik Bersama Ibu Bapa/Penjaga",
       "",
       "",
       "Dialog Akademik Bersama Ibu Bapa/Penjaga"
      ]
     },
     {
      "week": "41",
      "date": "20 Nov 2026",
      "day": "Jumaat",
      "cells": [
       "Pengisian Skor PBPPP Kedua",
       "(F 2)",
       "",
       "",
       "(F 2)"
      ]
     },
     {
      "week": "",
      "date": "21 Nov 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "22 Nov 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "42",
      "date": "23 Nov 2026",
      "day": "Isnin",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "42",
      "date": "24 Nov 2026",
      "day": "Selasa",
      "cells": [
       "",
       "Dialog Prestasi Akademik Bersama KP (Fasa 2)",
       "",
       "",
       ""
      ]
     },
     {
      "week": "42",
      "date": "25 Nov 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "Majlis Apresiasi Prasekolah",
       "Majlis Anugerah Kokurikulum",
       ""
      ]
     },
     {
      "week": "42",
      "date": "26 Nov 2026",
      "day": "Khamis",
      "cells": [
       "",
       "",
       "Majlis Apresiasi Hal Ehwal Murid (Anugerah Kehadiran Penuh)",
       "",
       ""
      ]
     },
     {
      "week": "42",
      "date": "27 Nov 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "Raptai Penuh MAKEM",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "28 Nov 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Majlis Apresiasi Kemenjadian Murid (MAKEM)"
     },
     {
      "week": "",
      "date": "29 Nov 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "30 Nov 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Peristiwa (2)"
     }
    ]
   }
  ],
  "updatedAt": null
 },
 "takwim-12": {
  "title": "TAKWIM INDUK SKBTS 2026",
  "subtitle": "DISEMBER",
  "layout": "standard",
  "blocks": [
   {
    "id": "18195467996f",
    "type": "takwim",
    "title": "DISEMBER",
    "columns": [
     "PENTADBIRAN",
     "KURIKULUM",
     "HAL EHWAL MURID",
     "KOKURIKULUM",
     "PPKI"
    ],
    "rows": [
     {
      "week": "43",
      "date": "1 Dis 2026",
      "day": "Selasa",
      "cells": [
       "",
       "",
       "Penyusunan Fail Murid (Kelas Sesi 2027)",
       "",
       ""
      ]
     },
     {
      "week": "43",
      "date": "2 Dis 2026",
      "day": "Rabu",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "43",
      "date": "3 Dis 2026",
      "day": "Khamis",
      "cells": [
       "",
       "Kenaikan Kelas Sesi Akademik 2027",
       "Kemaskini data akhir tahun MOEIS",
       "",
       ""
      ]
     },
     {
      "week": "43",
      "date": "4 Dis 2026",
      "day": "Jumaat",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ]
     },
     {
      "week": "",
      "date": "5 Dis 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "6 Dis 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "7 Dis 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "8 Dis 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "9 Dis 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "10 Dis 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "11 Dis 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "12 Dis 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "13 Dis 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "14 Dis 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "15 Dis 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "16 Dis 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "17 Dis 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "18 Dis 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "19 Dis 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "20 Dis 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "21 Dis 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "22 Dis 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "23 Dis 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "24 Dis 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "25 Dis 2026",
      "day": "Jumaat",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026 / Hari Krismas"
     },
     {
      "week": "",
      "date": "26 Dis 2026",
      "day": "Sabtu",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "27 Dis 2026",
      "day": "Ahad",
      "kind": "weekend",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Cuti Sekolah Akhir Sesi Akademik 2026"
     },
     {
      "week": "",
      "date": "28 Dis 2026",
      "day": "Isnin",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Mesyuarat Guru (1) & Mesyurat Induk Kurikulum (1) / Meyuarat Orientasi 2027"
     },
     {
      "week": "",
      "date": "29 Dis 2026",
      "day": "Selasa",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Mesyuarat Induk HEM (1) & Mesyuarat Induk Kokurikulum (1) 2027"
     },
     {
      "week": "",
      "date": "30 Dis 2026",
      "day": "Rabu",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Gotong - Royong Keceriaan Kelas"
     },
     {
      "week": "",
      "date": "31 Dis 2026",
      "day": "Khamis",
      "kind": "holiday",
      "cells": [
       "",
       "",
       "",
       "",
       ""
      ],
      "span": "Orientasi Tahun 1 & Prasekolah Sesi Akademik 2027"
     }
    ]
   }
  ],
  "updatedAt": null
 }
};
