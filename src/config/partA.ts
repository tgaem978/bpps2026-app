/* Dijana daripada "v10_C-PENTADBIRAN_SEKOLAH" (BPPS 2026 SKBTS, Bahagian A). */
import type { SectionContent } from '@/types/book';

export const partASections = (): Record<string, SectionContent> => JSON.parse(JSON.stringify(PART_A));

/** Senarai guru & AKP (tanpa nombor telefon - diimport berasingan oleh sekolah). */
export const partAStaff: { nama: string; kategori: string; tugas: string; sesi: string; gred: string; opsyen: string[]; photo: string }[] = [
 {
  "nama": "SHAMSUKAMAL BIN ANIFAR",
  "kategori": "Guru Besar",
  "tugas": "GURU BESAR",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": "gb"
 },
 {
  "nama": "ZALEHA BINTI YUSOH",
  "kategori": "GPK Pentadbiran",
  "tugas": "GPK PENTADBIRAN",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": "pk-pentadbiran"
 },
 {
  "nama": "HASRE ADHA BIN MOHD HASSAN",
  "kategori": "GPK Hal Ehwal Murid",
  "tugas": "GPK HEM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "MATEMATIK"
  ],
  "photo": "pk-hem"
 },
 {
  "nama": "MUHAMMAD RIZAL BIN CHE DIN",
  "kategori": "GPK Kokurikulum",
  "tugas": "GPK KOKURIKULUM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "SAINS"
  ],
  "photo": "pk-koku"
 },
 {
  "nama": "VINCENT NATHAN A/L IRATHAYA SAMI",
  "kategori": "GPK Petang",
  "tugas": "GPK PETANG",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": "pk-petang"
 },
 {
  "nama": "SYAHIDA BINTI MOHAMED MOKHTAR",
  "kategori": "GPK Pendidikan Khas",
  "tugas": "GPK PEND. KHAS",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "MATEMATIK",
   "M. PEMBELAJARAN"
  ],
  "photo": "pk-pkhas"
 },
 {
  "nama": "ABDUL JALIL BIN MAT",
  "kategori": "Guru Akademik",
  "tugas": "KP SAINS",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "B. MELAYU",
   "SAINS"
  ],
  "photo": ""
 },
 {
  "nama": "ABDULLAH MUHAIMIN BIN AHAMAD",
  "kategori": "Guru Penyelaras Bestari",
  "tugas": "PENYELARAS BESTARI/ KETUA JADUAL WAKTU",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "KAJIAN SOSIAL"
  ],
  "photo": ""
 },
 {
  "nama": "AISAH BINTI SH’ARI",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 USM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "BHARATHI USHA A/P MARTHEVEERAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 6 UPSI/ SU B. INGGERIS",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "DELSIE ANAK DAWI",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "FAATIMATUZZAHRAH BINTI HALIMUDIN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 UTM",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "FAIZAH BINTI MOHD SAHAT",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 UPM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "SAINS"
  ],
  "photo": ""
 },
 {
  "nama": "FARAH NUR IMANIAH BINTI MOHD SHUKRI",
  "kategori": "Guru Prasekolah",
  "tugas": "GURU PRASEKOLAH SAYANGKU",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PRA SEKOLAH"
  ],
  "photo": ""
 },
 {
  "nama": "GRACE ANNE",
  "kategori": "Guru Akademik",
  "tugas": "KP B. INGGERIS",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "HAREENA A/P N. SIVAGANESE",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 UUM",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "KAMARUNZAMAN BIN ADAM",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS ADNI",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "MASLINA BINTI JAMIYOU@HJ ABDULLAH",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 6 UIAM/ SU P. MUZIK/ PLRS KANTIN",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU",
   "MUZIK"
  ],
  "photo": ""
 },
 {
  "nama": "MOHD ARIF BIN AHMAD THARMIZI",
  "kategori": "Guru Akademik",
  "tugas": "GURU PENGAWAS/ PENYELARAS TAHUN 5",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "SEJARAH"
  ],
  "photo": ""
 },
 {
  "nama": "MOHD HAIROS BIN DAUD",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "MOHD MAZNI BIN MAHASAN",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "MOHD ZAHIR BIN RAMLI",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 UM",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "MUHAMAD ALIFF BIN KAMAL AFFANDI",
  "kategori": "Guru Akademik",
  "tugas": "PLRS TAHUN 4/ SU SUKAN/ PEG. PEMERIKSA ASET",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "MUHAMMAD HAFIZ BIN YUSOF",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 UPSI",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "MUHAMMAD IZWAN BIN HALIM",
  "kategori": "Guru Akademik",
  "tugas": "PEGAWAI ASET",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "MUHAMMAD SHAFIQ BIN HAZMAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 UTM/ PEN. JADUAL WAKTU 2",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NOORAZILA BINTI ABDULLAH",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 UPSI/ PLRS BOSD",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NOR IDAYU BINTI NORDIN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 6 UTM/ PLRS KWAM/BAP/ PEN. PEGI ASET",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NORASHIKIN BINTI AZIZ",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 UKM/ KP RBT/ PLRS KEBAJIKAN",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "KEM. HIDUP"
  ],
  "photo": ""
 },
 {
  "nama": "NORASSKIN BINTI MOHAMED",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 UIAM/ SU PANITIA RBT",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "KEM. HIDUP"
  ],
  "photo": ""
 },
 {
  "nama": "NORAZAH BINTI AB AZIZ @ HAMID",
  "kategori": "Guru Akademik",
  "tugas": "SU KURIKULUM/ SU PSO",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "MATEMATIK"
  ],
  "photo": ""
 },
 {
  "nama": "NORLAILA BINTI MOHD SALLEH",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS SPSK/ AJK PSO",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "NORLAILI BINTI MUHAMMAD",
  "kategori": "Guru Akademik",
  "tugas": "CUTI SAKIT BERPANJANGAN",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "NORMALIZA BINTI RAMLI",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS RMT",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NORYATI BINTI NGAH",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "NUR AQILAH BINTI KHALIT",
  "kategori": "Guru Akademik",
  "tugas": "GURU P. ISLAM",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "P. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NUR FAKHIRA BINTI JAMALUDDIN",
  "kategori": "Guru Bimbingan dan Kaunseling",
  "tugas": "GURU BIMBINGAN",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "UBK"
  ],
  "photo": ""
 },
 {
  "nama": "NUR IZZAH ‘ATIRAH BINTI HUDALLAH",
  "kategori": "Guru Akademik",
  "tugas": "GURU P. ISLAM",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "P. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NUR SAHIRA BINTI MOHD SOIB",
  "kategori": "Guru Akademik",
  "tugas": "KP SEJARAH",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "KAJIAN SOSIAL"
  ],
  "photo": ""
 },
 {
  "nama": "NURASYAHIRA BINTI BASIRUN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 USM",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "SEJARAH"
  ],
  "photo": ""
 },
 {
  "nama": "NURAZIRA BINTI ABDULL HALIM",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 6 UUM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "NURUL SYIFAA’ BINTI ZAINOL",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "RAHANA BINTI MOHAMAD KHATIB",
  "kategori": "Guru Akademik",
  "tugas": "KP BAHASA MELAYU",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "ROHAZLINDA BINTI ISSAHAK",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS TAHUN 6/ PENYELARAS TGKT. 1",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "ROSLEEN BIN ABU BAKAR",
  "kategori": "Guru Akademik",
  "tugas": "KP PJPK",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. JASMANI"
  ],
  "photo": ""
 },
 {
  "nama": "RUZANA BINTI AHMAD",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS SPBT",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "SAHRULLIZAM BIN LIAS",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 UIAM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "SAINS"
  ],
  "photo": ""
 },
 {
  "nama": "SARAH AQILAH BINTI JAMALULAIL",
  "kategori": "Guru Akademik",
  "tugas": "GPM/ PLRS PROGRAM SUSU SEKOLAH",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "PEND. SENI"
  ],
  "photo": ""
 },
 {
  "nama": "SALEHA BINTI MOHD YUSOF",
  "kategori": "Guru Akademik",
  "tugas": "KP MATEMATIK/ GK 6 UM/ PLRS STEM",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "MATEMATIK"
  ],
  "photo": ""
 },
 {
  "nama": "SITI AISAH BINTI ABD KHANI",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "SITI ‘AISYAH BINTI JAMALUDIN",
  "kategori": "Guru Akademik",
  "tugas": "SU PEPERIKSAAN/ PENYELARAS IDME",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "P. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "SITI AISYAH ILYANI BINTI BAHRI",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "SITI NOOREHAN BINTI SA’IM",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "SITI SUHAILI BINTI ISMAIL",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 UKM/ PENYELARAS TS25",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. ARAB"
  ],
  "photo": ""
 },
 {
  "nama": "SHAIFUL NAZRI BIN ABDUL JABBAR",
  "kategori": "Guru Akademik",
  "tugas": "KETUA UNIT DISIPLIN",
  "sesi": "Pagi",
  "gred": "DG 6",
  "opsyen": [
   "MATEMATIK"
  ],
  "photo": ""
 },
 {
  "nama": "SUGANIYA A/P ARNACHALAM",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 4 UM",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "MATEMATIK"
  ],
  "photo": ""
 },
 {
  "nama": "TENGKU MOHAMMAD AIMAN BIN TENGKU MOHAMMAD FAUZAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 6 UPM/ SU BAHASA MELAYU/ PENYELARAS BPPS",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "TUAN MOHD KHAIRI BIN TUAN SOH",
  "kategori": "Guru Akademik",
  "tugas": "GURU PENDIDIKAN ISLAM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "TUAN NOREHAN BINTI RAJA OTHMAN",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "WAN MARFUZA BINTI WAN MOHD FUAT",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "WAN NOR AZIAN BINTI BIDUZODIN",
  "kategori": "Guru Pendidikan Khas",
  "tugas": "GURU PPKI",
  "sesi": "Pagi",
  "gred": "DG 9",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "WAN NOOR HILWANI BT. WAN MOHAMED",
  "kategori": "Guru Akademik",
  "tugas": "SU KOKURIKULUM",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. ARAB"
  ],
  "photo": ""
 },
 {
  "nama": "YAACOB BIN ISMAIL",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 6 UKM/ SU B. ARAB/ PLRS. BAITULMAL",
  "sesi": "Pagi",
  "gred": "DG 10",
  "opsyen": [
   "B. ARAB"
  ],
  "photo": ""
 },
 {
  "nama": "YETTE SURIANE BT. MOHD BAHARUDDIN",
  "kategori": "Guru Data",
  "tugas": "GURU DATA/ SU SK@S",
  "sesi": "Pagi",
  "gred": "DG 6",
  "opsyen": [
   "SAINS"
  ],
  "photo": ""
 },
 {
  "nama": "ZAIDI BIN OTHMAN",
  "kategori": "Guru Akademik",
  "tugas": "KP PENDIDIKAN ISLAM/ PLRS. KESELAMATAN",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "ZALIFAH BINTI MOHD ZAWAWI",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 UUM/ SU SPLKPM",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "ZATUSY SYAMAM BINTI SHARUDDIN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 5 USM/ PENYELARAS RI(BI)",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "ZIRWATUL RAFIDAH BINTI RAHIM",
  "kategori": "Guru Akademik",
  "tugas": "SU HEM/ PEM. JADUAL WAKTU",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "ZULATUL AZRINA BINTI ZULKEFLI",
  "kategori": "Guru Prasekolah",
  "tugas": "GURU PRASEKOLAH MANJAKU",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "PRASEKOLAH"
  ],
  "photo": ""
 },
 {
  "nama": "ZURIFAH BINTI ABD RAHMAN",
  "kategori": "Guru Bimbingan dan Kaunseling",
  "tugas": "GURU BIMBINGAN",
  "sesi": "Pagi",
  "gred": "DG 12",
  "opsyen": [
   "UBK"
  ],
  "photo": ""
 },
 {
  "nama": "ABOL IBNUL EQKWAN BIN ZOLKIFLI",
  "kategori": "Guru Akademik",
  "tugas": "KP MUZIK",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "AHMAD IZHAM BIN ABD GHANI",
  "kategori": "Guru Akademik",
  "tugas": "KP P. MORAL",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "ALIF HAZIM BIN NAJIB",
  "kategori": "Guru Akademik",
  "tugas": "GURU P. ISLAM",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "MATEMATIK"
  ],
  "photo": ""
 },
 {
  "nama": "ANDREW ANAK ENTIPAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU MAKMAL 1",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "SAINS"
  ],
  "photo": ""
 },
 {
  "nama": "AZMI BIN MOHAMAD @ ALIAS",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS TAHUN 3 / NAIB BENDAHARI PIBG",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "DARSHINII A/P GUNASAGARAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 UKM",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "MATEMATIK",
   "M. PMBLJRN"
  ],
  "photo": ""
 },
 {
  "nama": "FATIMAH BINTI AB LATIF",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS TAHUN 2 / PENYELARAS KANTIN",
  "sesi": "Petang",
  "gred": "DG 12",
  "opsyen": [
   "B. MELAYU",
   "SAINS"
  ],
  "photo": ""
 },
 {
  "nama": "HAPINI BINTI ABDULL WAHAB",
  "kategori": "Guru Pemulihan",
  "tugas": "GURU PEMULIHAN / PENYELARAS KEBAJIKAN",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "KAJIAN SOSIAL"
  ],
  "photo": ""
 },
 {
  "nama": "HAWA SYAHIRAH BINTI MOHD SAID",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 1 USM / NAIB KP MATEMATIK / PPDA",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "HUSNA AMIRA BINTI ISMAIL",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 UM",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "KHARAINE BINTI CHE IBRAHIM",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 2 USM / PLRS PENGAWAS",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "KHIRUL AMIR BIN ABU HASAN",
  "kategori": "Guru Akademik",
  "tugas": "PEN. SU PEPERIKSAAN",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "MOHD HAMDI FARKHAN B. SALEHHUDDIN",
  "kategori": "Guru Akademik",
  "tugas": "GURU DISIPLIN PETANG",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "SAINS"
  ],
  "photo": ""
 },
 {
  "nama": "MOHD SHAKIR BIN ESUAN",
  "kategori": "Guru Akademik",
  "tugas": "GK 3 UIAM / PLRS KEBAJIKAN / GURU PENYELENGGARAAN",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "PRA SEKOLAH"
  ],
  "photo": ""
 },
 {
  "nama": "MOHD ZULFADLI BIN YUSOF",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS IDME HEM / PEG. PELUPUSAN ASET / NKP PJPK",
  "sesi": "Petang",
  "gred": "DG 12",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "MUHAMMAD HAFIZ BIN MOHD BASRI",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 UIAM",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "B. INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "MUHAMMAD HAZWAN BIN MD TAIB",
  "kategori": "Guru Akademik",
  "tugas": "PEGAWAI STOR / GURU LOKER MURID",
  "sesi": "Petang",
  "gred": "DG 12",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "MUHD AZIZI B. AHMAD SHAMSUL MA’ARIF",
  "kategori": "Guru Akademik",
  "tugas": "K. JADUAL WAKTU PTG / GURU ICT PTG / PLRS KESELAMATAN PTG",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU",
   "MUZIK"
  ],
  "photo": ""
 },
 {
  "nama": "MUSAFARUDIN BIN OTHMAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 UTM / SU PIBG",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "SEJARAH"
  ],
  "photo": ""
 },
 {
  "nama": "NASIHA BINTI MOHD SHARIF",
  "kategori": "Guru Akademik",
  "tugas": "SU PBD / NAIB SU PENTAKSIRAN / PEN. JADUAL WAKTU PETANG",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "NOOR ILLI BINTI ELAS",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 UUM / NAIB SU KURIKULUM",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "PEND. KHAS"
  ],
  "photo": ""
 },
 {
  "nama": "NOOR HAMIMI BINTI ABDUL AZIZ",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 1 UM",
  "sesi": "Petang",
  "gred": "DG 12",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "NOR BAZRIANA BINTI BADRI",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 UPM",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B. MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "NOR SUZERA BINTI ZAHARI",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 2 UPSI",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NORAZLIZA BINTI ISMAIL",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 2 UKM / PENYELARAS KESIHATAN",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "PEND. ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NORSABRINA BINTI HASSAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 2 UKM / SU MATEMATIK",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "MATEMATIK"
  ],
  "photo": ""
 },
 {
  "nama": "NUR INSYIRAH NAJWA BINTI OTHMAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU BEREDAR",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "P.ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "NUR IZRIN FARAH HANI BINTI ISMAIL",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 1 UPM / NKP B. INGGERIS",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B.INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "NUR FATIN UMMAIRAQ BT. ABDUL HALIM",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 1 UKM",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "P.ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "RAJA NUR SAZLIN BINTI RAJA SAFWAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 UTM / PLRS RMT",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "PEND.SENI VISUAL"
  ],
  "photo": ""
 },
 {
  "nama": "ROSNAYA BINTI MAT ISA",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 1 UUM / PENYELARAS BAITULMAL",
  "sesi": "Petang",
  "gred": "DG 7",
  "opsyen": [
   "P.ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "SALME BINTI SENIK",
  "kategori": "Guru Akademik",
  "tugas": "PENYELARAS SPBT / NKP P. ISLAM",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "P.ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "SHAREENA FATIHAH BINTI SHARIN",
  "kategori": "Guru Akademik",
  "tugas": "GURU BEREDAR",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "P.ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "SINNTHU A/P PONNUSAMY",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 3 USM",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "B.INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "SITI NOR AINIYAH BINTI RIDAWI",
  "kategori": "Guru Bimbingan dan Kaunseling",
  "tugas": "GURU BIMBINGAN",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "UBK"
  ],
  "photo": ""
 },
 {
  "nama": "SITI NORLIANA BINTI MOHD NOR",
  "kategori": "Guru Akademik",
  "tugas": "SU HEM / SU PSV",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "PSV"
  ],
  "photo": ""
 },
 {
  "nama": "SITI MAZURA BINTI SHAIKH MUSTAFA",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 1 UTM / KP PSV",
  "sesi": "Petang",
  "gred": "DG 12",
  "opsyen": [
   "B.INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "SITI FAREZZA BINTI ABD MUIS",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 1 UIAM / PENYELARAS BOSS",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B.INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "SITI HAJAR BINTI AB HADI",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 2 UM",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "P.ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "SITI RAFIDAH BINTI ABD RAHMAN",
  "kategori": "Guru Akademik",
  "tugas": "KP BAHASA ARAB",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B.ARAB"
  ],
  "photo": ""
 },
 {
  "nama": "SURINA BINTI MALEK",
  "kategori": "Guru Akademik",
  "tugas": "SU PEND. MORAL / PENYELARAS ORIENTASI TAHUN 1",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B.MELAYU"
  ],
  "photo": ""
 },
 {
  "nama": "THIVANY A/P MANOGARAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU KELAS 2 UPM",
  "sesi": "Petang",
  "gred": "DG 9",
  "opsyen": [
   "B.INGGERIS"
  ],
  "photo": ""
 },
 {
  "nama": "ZAHRAH BINTI MOHAMAD DAHLAN",
  "kategori": "Guru Akademik",
  "tugas": "GURU RMT / BILIK KHAS-SURAU",
  "sesi": "Petang",
  "gred": "DG 6",
  "opsyen": [
   "P.ISLAM"
  ],
  "photo": ""
 },
 {
  "nama": "ZUBAIDAH BINTI DAUD KAIYIN",
  "kategori": "Guru Akademik",
  "tugas": "GURU BANTU / BILIK KHAS-SURAU",
  "sesi": "Petang",
  "gred": "DG 10",
  "opsyen": [
   "B.ARAB"
  ],
  "photo": ""
 },
 {
  "nama": "WAN SULHA BINTI MAMAT",
  "kategori": "Ketua Pembantu Tadbir",
  "tugas": "KETUA PEMBANTU TADBIR",
  "sesi": "",
  "gred": "N3",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "KUNA LAKSHIMI A/P MAHDEVAN",
  "kategori": "Penolong Akauntan",
  "tugas": "PENOLONG AKAUNTAN",
  "sesi": "",
  "gred": "W5",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "NUR ATIRAH BINTI MOHAMED BUKHARY",
  "kategori": "Pembantu Tadbir",
  "tugas": "PEMBANTU TADBIR(P/O)",
  "sesi": "",
  "gred": "N1",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "SITI ROHANA BINTI GHANI",
  "kategori": "Pembantu Pengurusan Murid",
  "tugas": "PEMBANTU PENGURUSAN MURID PRA",
  "sesi": "",
  "gred": "N1",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "NOORSHAHRIDAH BINTI CHE MOHARAM (CTG)",
  "kategori": "Pembantu Pengurusan Murid",
  "tugas": "PEMBANTU PENGURUSAN MURID PRA",
  "sesi": "",
  "gred": "N1",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "NOOR HANA BINTI HAWARI",
  "kategori": "Pembantu Pengurusan Murid",
  "tugas": "PEMBANTU PENGURUSAN MURID PPKI",
  "sesi": "",
  "gred": "N2",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "NURUL AINI BINTI ZULRAHMAN",
  "kategori": "Pembantu Pengurusan Murid",
  "tugas": "PEMBANTU PENGURUSAN MURID PPKI",
  "sesi": "",
  "gred": "N2",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "MOHD ZAHRI BIN LONG",
  "kategori": "Pembantu Pengurusan Murid",
  "tugas": "PEMBANTU PENGURUSAN MURID PPKI",
  "sesi": "",
  "gred": "N2",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "NOOR HAZURA BINTI NORDIN",
  "kategori": "Pembantu Pengurusan Murid",
  "tugas": "PEMBANTU PENGURUSAN MURID PPKI",
  "sesi": "",
  "gred": "N2",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "MOHAMMAD FAIZAL BIN MOHD NOR",
  "kategori": "Pembantu Pengurusan Murid",
  "tugas": "PEMBANTU PENGURUSAN MURID PPKI",
  "sesi": "",
  "gred": "N2",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "MAZLAN BIN MUSTAFA",
  "kategori": "Pembantu Khidmat Am",
  "tugas": "PEMBANTU KHIDMAT AM",
  "sesi": "",
  "gred": "H1",
  "opsyen": [],
  "photo": ""
 },
 {
  "nama": "NORAKIMA BINTI MOHD JALANI",
  "kategori": "Pembantu Khidmat Am",
  "tugas": "PEMBANTU KHIDMAT AM",
  "sesi": "",
  "gred": "H1",
  "opsyen": [],
  "photo": ""
 }
];

const PART_A: Record<string, SectionContent> = {
 "panduan-am": {
  "title": "PANDUAN AM STAF SEKOLAH",
  "subtitle": "",
  "layout": "standard",
  "blocks": [
   {
    "id": "fd76788619c2",
    "type": "heading",
    "text": "ARAHAN AM"
   },
   {
    "id": "aa627f867eec",
    "type": "paragraph",
    "text": "Selaku pegawai kerajaan, guru adalah tertakluk kepada segala arahan yang terdapat dalam Perintah Am Kerajaan\n\nGuru dan staf sokongan sekolah dinasihatkan supaya membaca, memahami dan boleh mentafsirkan dengan tepat akan kandungan Perintah Am dan Arahan Perkhidmatan.\n\nGuru hendaklah menghayati tatasusila profesion keguruan dan menjunjungnya sebagai satu profesion dan bukan sebagai satu pekerjaan atau mata pencarian semata-mata.\n\nSemua guru dan staf sokongan hendaklah mengamalkan dan menghayati prinsip-prinsip Perkhidmatan Cemerlang.\n\nGuru hendaklah mengamal dan menghayati Falsafah dan Matlamat Pendidikan Negara.\n\nMeletakkan kepentingan murid dan sekolah lebih daripada kepentingan diri dalam menjalankan tugas.\n\nBertanggunjawab menjaga dan menjamin keselamatan murid dan harta benda sekolah ketika berada di sekolah.\n\nSentiasa mengamalkan kepimpinan yang berkesan dan dinamik serta cekap menjalankan tugas."
   },
   {
    "id": "a9f366a8e36e",
    "type": "heading",
    "text": "KEDATANGAN"
   },
   {
    "id": "0e7ecd380c92",
    "type": "paragraph",
    "text": "Kehadiran guru dan staf sokongan menggunakan Sistem Kedatangan Biometrik. (Rujukan: Garis Panduan Pelaksanaan Sistem Kehadiran Biometrik-ms 1 hinga 12)\n\nGuru dikehendaki berada di dalam kawasan sekolah sebelum sesi persekolahan bermula, sesi pagi 7.30 pagi dan sesi petang 12.00 tengah hari. Semua guru dan staf sokongan hendaklah “in” ketika sampai di sekolah dan “out” sebelum balik/ keluar dari kawasan sekolah. Waktu balik sesi pagi 1.30 tgh dan sesi petang 6.30 petang (Isnin) 6.00 petang (Selasa-Jumaat) serta mengikut ketetapan yang diberikan oleh pentadbir.\n\nGuru yang tidak dapat hadir atau terpaksa datang lewat hendaklah memberikan kenyataan dan sebab-sebab yang wajar. Guru mesti memberitahu pihak sekolah secepat mungkin supaya jadual waktu ganti dapat disediakan.\n\nSemua urusan peribadi guru hendaklah dibuat di luar waktu sekolah kecuali dalam keadaan kecemasan.\n\nGuru diwajibkan datang untuk menjayakan aktiviti kokurikulum, bengkel, mesyuarat dan pelbagai program akademik di luar masa yang ditetapkan.\n\nStatus Kehadiran guru atau staf sokongan, akan merekodkan status Late/Absent/Incomplete.\nWarna Kuning-(3 rekod dalam sebulan-late/absent/Incomplete)\nWarna Hijau –(2 rekod -late/absent/Incomplete)\nWarna Merah- (1 rekod-late/absent/incomplete)\n(Rujukan Carta Alir –ms. 43)"
   },
   {
    "id": "4e50326d8c22",
    "type": "heading",
    "text": "KELUAR WAKTU MENGAJAR"
   },
   {
    "id": "8ccbb6a4e02d",
    "type": "paragraph",
    "text": "Guru tidak dibenarkan meninggalkan kawasan sekolah atau bilik darjah dalam masa waktu mengajar kecuali jika ada sesuatu perkara yang tidak dapat dielakkan atau arahan Jabatan Pelajaran Negeri/Gabungan/Daerah dengan syarat mendapat kebenaran daripada Guru Besar/Penolong Kanan.\n\nGuru dikehendaki mengisi dan menulis di dalam Buku Rekod Pergerakan Guru. Dapatkan kebenaran Guru Besar/Penolong Kanan sebelum keluar.\n\nSebelum meninggalkan sekolah, guru diminta meninggalkan kerja bertulis untuk pelajar melalui Guru Penyelaras Aliran atau Ketua Panitia. Rujukan MMI-Melindungi Masa Instruksional/Pembelajaran, KPM 2013-meningkatkan pembelajaran murid secara berkesan di sekolah. “Kembali Kepada Yang asas, Pemimpin Instruksional, Guru Mengajar dan Murid Belajar”"
   },
   {
    "id": "f7450417b6ed",
    "type": "heading",
    "text": "CUTI (PERINTAH AM BAB C)"
   },
   {
    "id": "accf932f76e5",
    "type": "paragraph",
    "text": "**4.1. Cuti Rehat**\n4.1.1. Mengikut Surat Pekeliling Kementerian Pelajaran KP (PP) 0046. SJ / A / (30) bertarikh 24 Disember 1993, guru berkelayakan mendapat cuti penggal sekolah untuk menggantikan cuti rehat. Tetapi guru boleh dipanggil bertugas oleh Guru Besar tidak melebihi ﻿separuh daripada ﻿jumlah cuti sesuatu tahun untuk menjalankan tugas-tugas seharian selain daripada tugas mengajar.\n4.1.2. Permohonan Cuti Rehat: Pekeliling Perkhidmatan – Am42-Pin.2/91 adalah berkaitan.\n\n**4.2. Cuti Sakit**\n4.2.1. Berjumlah tidak boleh melebihi 180 hari dalam satu tahun kalendar bagi pegawai yang menerima rawatan sebagai pesakit dalam di hospital/klinik swasta.\n4.2.2. Jumlah cuti sakit sama ada berasaskan sijil sakit swasta atau sijil sakit kerajaan adalah tidak melebihi 180 hari dalam satu tahun kalendar, di mana 90 hari pertama boleh diluluskan oleh Ketua Jabatan dan 90 hari seterusnya hendaklah diluluskan oleh Ketua Setiausaha.\n\n**4.3 Cuti Tanpa Gaji**\n4.3.1. Mengikut Perintah Am, Cuti Tanpa Gaji boleh dipohon atas sebab-sebab persendirian yang mustahak.\n4.3.2. Cuti Tanpa Gaji daripada kakitangan bukan guru boleh diberi selepas habis semua cuti rehatnya.\n4.3. 3. Kelayakan Cuti Tanpa Gaji ialah 30 hari bagi tiap-tiap genap tahun perkhidmatan tetapi tidak boleh melebihi 180 hari.\n4.3.4. Cuti Tanpa Gaji untuk tujuan keluar negeri hanya boleh diambil sekali dalam masa 4 tahun.\n4.3.5. Kelulusan Cuti Tanpa Gaji yang tidak melebihi 14 hari setahun adalah diluluskan oleh Pengarah Pelajaran Negeri. Cuti yang melebihi 15 hari diluluskan oleh Kementerian Pelajaran Malaysia. Borang permohonan hendaklah dihantar ke Jabatan Pelajaran Negeri 10 minggu sebelum tarikh bercuti.\n\n**4.4 Cuti Rehat Khas (CRK)**\n4.4.1. CRK ialah cuti bergaji penuh untuk guru sahaja.\n4.4.2. Cuti ini boleh diluluskan oleh Guru Besar hanya atas sebab-sebab kecemasan dan upacara agama bagi tempoh 10 atau 1 hari dalam setahun bergantung kepada bilangan tahun ﻿perkhidmatan.\n4.4.3. Kelulusan CRK adalah berdasarkan keperluan perkhidmatan selagi tidak menjejaskan PdPc.\n4.4.4. Permohonan Cuti Rehat Khas: Pekeliling Perkhidmatan Bil.3 tahun 2005 adalah berkaitan."
   },
   {
    "id": "9a0c07dc4eaa",
    "type": "heading",
    "text": "PEMAKAIAN GURU"
   },
   {
    "id": "8f7230555931",
    "type": "paragraph",
    "text": "Semua guru hendaklah berpakaian kemas (bertali leher bagi guru lelaki), Baju Batik pada hari Khamis dan Baju Kebangsaan pada hari Jumaat (Guru Islam) sesuai dengan profesion keguruan dan masyarakat timur seperti Ceraian UP.7.2.3 Etika Pakaian dan Penampilan Pegawai Awam.(ms49-68)\n\nPakaian berbentuk seluar dan baju tanpa lengan tidak dibenarkan bagi guru perempuan.\n\nGuru lelaki dikehendaki mempunyai potongan dan panjang rambut yang sesuai.\n\nGuru yang mengajar pendidikan jasmani dikehendaki memakai pakaian yang sesuai."
   },
   {
    "id": "7a38d6b146b9",
    "type": "heading",
    "text": "PENYEDIAAN DAN PENGHANTARAN REKOD PENGAJARAN DAN PEMBELAJARAN"
   },
   {
    "id": "a3e189c8808b",
    "type": "paragraph",
    "text": "Surat Siaran KPM Bil. 2 atahun 2025. Penyediaan RPH Secara Dalam Talian (e-RPH) Melalui Pelantar Digital Educational Learning Intiaive Malaysia (DELIMa) Bagi Kegunaan Guru Di Sekolah Bawah KPM, bertarikh 23 April 2025.\n\nRancangan Pelajaran Harian (RPH) adalah dokumen utama yang disediakan oleh guru berdasarkan Peraturan 8.Peraturan-Peraturan Pendidikan (Kurikulum Kebangsaan) 1997, Akta Pendidikan 1996 [Akta 550].\n\nSistem e-RPH KPM ini dibangunkan untuk memudahkan penyediaan, penyimpanan, pencerapan dan pemantauan RPH. KPM mengharapkan ia memudahkan guru menyediakan perancangan perancangan pengajaran harian secara lebih efisen dan sistematik.\n\nE-RPH ini mestilah dikemaskinikan dan sentiasa ada dengan guru ketika mengajar. Guru hendaklah mengikuti perancangan yang telah dibuat bagi waktu yang tertentu.\n\nE-RPH ini akan diperiksa pada bila-bila masa oleh Guru Besar, Nazir Sekolah, Pegawai-pegawai dari Kementerian Pelajaran, Jabatan Pelajaran Negeri dan Pegawai Pelajaran Daerah.\n\nPenyediaan e-RPH ini adalah juga mengikut SPI Bil.3/1999: Penyediaan Rekod Pengajaran dan Pembelajaran bertarikh 9 Mac 1999. e-RPH hendaklah mengandungi Rancangan Pelajaran Tahunan (RPT) dan Rancangan Pelajaran Harian (RPH)\n\nSelain daripada itu semua guru perlu menyediakan senarai nama murid setiap kelas yang diajar bagi memudahkan guru menilai dan menulis penguasaan murid dalam Pentaksiran Bilik Darjah.\n\ne-RPH dihantar kepada Guru Besar atau Penolong Kanan pada setiap hari Jumaat atau selewat-lewatnya pada hari Sabtu sebelum 10.00 pagi tiap-tiap minggu untuk disemak atau diperiksa oleh pentadbir.\n\nCara menulis Rekod Mengajar adalah seperti berikut :\nRekod harian bagi satu-satu matapelajaran yang diajar hendaklah mencatat kelas, waktu dan subjek, tajuk pelajaran dan muka surat buku teks yang digunakan, objektif, kemahiran, aktiviti dan catatan Refleksi, menyatakan berapa orang murid telah mencapai objektif pelajaran yang diajar.\nPenerangan lanjutan mengenai e-RPH akan diberikan dalam Mesyuarat AJK Kurikulum Sekolah dan mesyuarat-mesyuarat panitia matapelajaran.\n\nRancangan Pelajaran Harian (RPH) hendaklah diberikan pada mana-mana pegawai yang hendak menyelia dan mencerap sebelum P&P bermula. Ia merupakan satu dokumen rasmi yang penting dan akan dirujuk semasa penilaian prestasi guru dibuat."
   },
   {
    "id": "55fe68d7aca8",
    "type": "heading",
    "text": "MENGAJAR DALAM BILIK DARJAH"
   },
   {
    "id": "d6852cb59a7f",
    "type": "paragraph",
    "text": "Seluruh waktu mengajar itu mestilah digunakan sepenuhnya untuk menyampaikan bahan pelajaran dan membimbing murid dalam proses pembelajaran. Guru-guru dinasihatkan supaya tidak duduk semasa mengajar di dalam kelas.\n\nMemeriksa buku rampaian dan kertas jawapan murid tidak harus dilakukan dalam bilik darjah ketika mengajar melainkan untuk memberi bimbingan dan perhatian individu murid.\n\nTugas guru bukan sahaja menyampaikan bahan pelajaran tetapi juga mengawal kelas supaya tidak bising, memberi contoh teladan dan bimbingan kepada murid supaya menjadi warganegara yang berdisiplin dan berilmu dan mengembangkan potensi dan modal insan di kalangan murid.\n\nKerja bertulis dan kerja rumah mestilah diberi secukupnya bagi semua matapelajaran dalam satu-satu minggu. Jumlah kerja bertulis, latihan, ujian atau kerja rumah akan ditentukan dalam mesyuarat panitian mata pelajaran.\n\nSemua kerja murid mestilah disemak dan diperiksa dengan SEGERA dan NOTA yang diberi perlu disemak dan diperiksa . Tandatangan guru dan tarikh membuat semakan hendaklah dicatat dalam buku rampaian murid bagi setiap kerja semakan atau pemeriksaan yang dibuat. Selepas semakan berikan tanda kata-kata seperti Kerja yang kemas, Baik dan Usaha Lagi serta lain-lain yang memberikan kata positif pada murid.\n\nGuru yang menjalankan tugas/kerja ganti (relief) diminta mengajar matapelajaran yang terdapat pada jadual waktu atau mengajar mana tajuk yang berfaedah kepada pelajar . Sengaja duduk dalam kelas adalah TIDAK digalakkan .\n\nJangan benarkan pelajar meninggalkan kelas pada masa belajar tanpa sebab yang munasabah . Guru yang membenarkan murid-murid keluar kelas MESTILAH memberi KAD PAS atau TANDA NAMA guru berkenaan sebagai tanda mendapat kebenaran dari guru berkenaan untuk keluar kelas.\n\nSetiap orang guru mestilah menentukan bahawa bilangan murid dalam kelasnya adalah sama dengan bilangan yang tercatat di dalam Buku Kawalan Kelas.\n\nPengajaran dan pembelajaran hendaklah menarik dan berkesan. Guru hendaklah memastikan persediaan yang cukup telah dibuat dengan segala BBM yang sesuai serta strategi P & P yang berkesan."
   },
   {
    "id": "9fa079279ae0",
    "type": "heading",
    "text": "DISIPLIN GURU DAN STAF"
   },
   {
    "id": "b16fa11fa315",
    "type": "paragraph",
    "text": "Setiap guru dan staf sokongan hendaklah mempunyai displin diri yang tinggi. Jangan sekali-kali mengorbankan disiplin untuk menjadi popular dalam kalangan pelajar. Guru seumpama ini akan menjadi masalah besar kepada sekolah khasnya dalam usaha mendisiplinkan pelajar\n\nDisiplin pelajar di sekolah adalah tanggungjawab bersama setiap guru. Sebarang masalah yang berkaitan dengan disiplin pelajar mestilah diselesaikan bersama oleh guru-guru. Jangan bebankan masalah disiplin semata-mata kepada guru disiplin sahaja.\n\nKementerian Pelajaran melarang sama sekali guru-guru menjalankan sebarang HUKUMAN atau DERA kepada murid kecuali diturunkan kuasa oleh Guru Besar .\n\nHanya Guru Besar dan guru yang diberikan kebenaran, yang dibenarkan menjalankan hukuman atau dera kepada murid yang melanggar peraturan sekolah atau yang menimbulkan masalah disiplin.\n\nSemua kesalahan mestilah direkodkan ke dalam buku “DISIPLIN” yang disimpan di pejabat. Rekod ini akan dirujuk ketika menyediakan sijil berhenti dan surat akuan pelajar."
   },
   {
    "id": "6824e78e09fc",
    "type": "heading",
    "text": "MENGAWAL DISIPLIN MURID"
   },
   {
    "id": "9f13a16e049c",
    "type": "paragraph",
    "text": "Guru-guru kelas serta guru-guru mata pelajaran hendaklah merekod semua kesalahan murid dalam buku persediaan mengajar di ruangan catatan serta Borang Kawalan Kelas pada ruangan catatan kesalahan disiplin murid. Rekod ini adalah penting dalam hal disiplin.\n\n2. Sebagai panduan, aspek-aspek disiplin yang patut dikawal oleh semua guru adalah seperti berikut :\nKurang sopan, melawan guru / mencabar guru\nMencuri, menipu atau bercakap bohong\nMengugut, melawan atau memukul pengawas atau murid lain\nMemeras ugut murid lain melibatkan wang atau harta benda bernilai dan lain-lain seumpamanya\nMenipu tandatangan dan yang seumpamanya\nMenganggotai kumpulan haram atau kongsi gelap\nMeniru dalam perperiksaan (kecurangan akademik)\nKeluar dari bilik kelas di waktu belajar dan merayau-rayau dalam kawasan sekolah tanpa tujuan\nKelakuan tidak sopan semasa perhimpunan\nPergerakan murid dari kelas ke makmal, padang permainan, bilik sumber dan lain-Lain.\nTabiat kebersihan diri, kebersihan sekolah dan kelas\nMerosakkan harta benda sekolah\nMembuat bising dalam kelas dan mengganggu pembelajaran kelas lain\nBergaduh dan bertumbuk\nBerambut panjang\nPakaian yang tidak kemas\nBerjudi\nTerlibat dengan dadah\nMenghisap rokok\nPonteng dan lewat datang sekolah\nMembuat kenyataan akhbar dan sebagainya tanpa kebenaran\nSila rujuk buku peraturan sekolah\n\n3. Bagi mewujudkan disiplin sekolah yang baik supaya proses pengajaran dan pembelajaran dan proses sosialisasi dapat berjalan dengan lancar dan berkesan serta tidak terkeluar dari garis panduan yang telah ada, sila rujuk peraturan atau Pekeliling-pekeliling yang berikut :-\nSchool (General) Regulations 1951\nAssited School Institution (Management) Rules 1969\nEducation Institution (Exemption Orders) 1959\nSchool (Course of Studies) Regulations 1959\nSchool Curriculum 1969\nEducation (School Decipline) Regulations 1959\nSchool (Tour) Regulations 1958\nSchool (Magazines) Regulations 1968\nSchool (Societies) Regulations 1968\nEducation Institutions (Instruments of Managements Government) Rule 1963\nParent – Teacher Associations Rules 1973"
   },
   {
    "id": "d8717eb03bda",
    "type": "heading",
    "text": "PERHUBUNGAN BAIK SESAMA GURU"
   },
   {
    "id": "913044e346d8",
    "type": "paragraph",
    "text": "Guru sewajarnya memupuk hubungan peribadi dan professional yang baik dan sihat sesama guru dan sentiasa dapat mengawal tutur kata serta mewujudkan perasaan kekitaan.\n\nGuru TIDAK dibenarkan mempengaruhi atau memaksa pandangan, fahaman, pendapat, kepercayaan kepada guru, pelajar atau staf sokongan sekolah yang lain.\n\nPerhubungan yang berbentuk kumpulan yang berdasarkan kepada kaum, status sosial, ekonomi, kelulusan dan sebagainya adalah tidak dibenarkan sama sekali wujud di sekolah."
   },
   {
    "id": "665d43a5e746",
    "type": "heading",
    "text": "BILIK GURU"
   },
   {
    "id": "0f4415d79487",
    "type": "paragraph",
    "text": "Kebersihan dan keselamatan bilik guru adalah menjadi tanggunjawab SEMUA guru. Ini termasuk keselamatan harta benda di dalam bilik guru.\n\nGuru hendaklah berada di bilik guru semasa tidak mengajar di kelas. Masa ini hendaklah dianggap sebagai ‘non teaching period’ dan bukannya ‘free period’. Oleh itu guru hendaklah menggunakan masa tersebut di bilik guru untuk perkara-perkara berkaitan dengan pengajaran dan pembelajaran sahaja.\n\nGuru yang berada di bilik guru hendaklah sama-sama bertanggunjawab memastikan suasana yang sesuai dan tidak mengganggu ketenteraman mana-mana pihak."
   },
   {
    "id": "70120985bafa",
    "type": "heading",
    "text": "PERJAWATAN DAN PENGAJARAN"
   },
   {
    "id": "b390a8659b92",
    "type": "paragraph",
    "text": "Jikalau guru menghadapi sebarang masalah dalam bidang perjawatan, mereka boleh berurusan dengan Pembantu Tadbir atau Guru Besar. Guru yang menghadapi masalah di bidang pengajaran bolehlah berurusan dengan Guru Panitia, Penolong Kanan, atau Guru Besar."
   },
   {
    "id": "30d1544101b0",
    "type": "heading",
    "text": "KETETAPAN MASA"
   },
   {
    "id": "56ba585cbb1b",
    "type": "paragraph",
    "text": "Ketepatan masa guru adalah penting untuk menentukan disiplin dan dihormati oleh pelajar-pelajar.\n\nGuru-guru hendaklah masuk kelas dan meninggalkan kelas mengikut waktu . Guru adalah bertanggungjawab pada waktu guru itu sepatutnya berada di kelas; P & P hendaklah diberi keutamaan . Unsur-unsur lain bolehlah dibuat pada masa yang lain.\n\nGuru-guru tidak dibenarkan meninggalkan kelas ketika waktu mengajar . Kalau terpaksa meninggalkan kelas kerana kecemasan atau sebab yang penting, guru berkenaan dinasihatkan supaya memberi kerja secukupnya dan menentukan disiplin murid sekolah terkawal sebelum meninggalkan kelas.Sila maklumkan kepada rakan guru di kelas sebelah atau yang terhampir.\n\nKetua kelas patut dinasihatkan supaya mencari guru yang masih belum masuk kelas 5 minit selepas sesuatu waktu pembelajaran bermula belajar . Jika guru masih tidak dapat dicari, Penolong Kanan atau guru kanan mestilah diberitahu.\n\nGuru-guru mestilah menjadi CONTOH teladan dalam semua kegiatan sekolah termasuk ucapan-ucapan sekolah. Jika aktiviti kokurikulum itu bermula jam 2.00 petang misalnya, maka guru yang sepatutnya bertugas mestilah berada 10 minit sebelum jam 2.00 petang.\n\nSemua urusan aktiviti berkaitan dengan PPD, JPN serta Kementerian Pelajaran hendaklah diselesaikan dan pemakluman di hantar kepada pihak yang berkenaan, sebulan sebelum masa yang ditetapkan."
   },
   {
    "id": "aa6d36c467ba",
    "type": "heading",
    "text": "TUGAS-TUGAS GURU"
   },
   {
    "id": "3bbb771f3f1a",
    "type": "paragraph",
    "text": "Semua guru akan diberi tugas-tugas di bidang kurikulum, hal ehwal murid, kokurikulum, pentadbiran dan tugas-tugas khas dan penglibatan dalam pelbagai AJK sekolah. Semua guru mesti melaksanakan tugas-tugas tersebut dengan dedikasi, cekap dan bertanggungjawab.\n\nApabila diarahkan untuk melaksanakan sesuatu tugas atau arahan, misalnya menghadiri mesyuarat, pergi ke pejabat pelajaran atau ke sekolah lain, guru hendaklah mengambil tindakan sendiri. Guru yang diamanahkan / ditugaskan TIDAK boleh mengarahkan guru lain melaksanakannya tanpa kebenaran dan pengetahuan Guru Besar.\n\nTugas/Kerja ganti (relief work) hendaklah dilaksanakan bagi menggantikan guru-guru yang tidak hadir kerana sebab-sebab kesihatan atau menghadiri mesyuarat atau kursus bagi pihak sekolah atau menjalankan tugas-tugas rasmi yang diarahkan atau yang mendapat kebenaran dari JPWPKL atau Kementerian Pelajaran Malaysia seperti yang diwajibkan dalam PERINTAH AM dan Pekeliling-Pekeliling Perkhidmatan.\n\nTugas/Kerja guru ganti adalah RASMI, guru yang diarahkan untuk menjalankan tugas ganti adalah WAJIB dilaksanakan."
   },
   {
    "id": "2b5a1d99c6cd",
    "type": "heading",
    "text": "JADUAL WAKTU MENGAJAR"
   },
   {
    "id": "4d41bd66f5fa",
    "type": "paragraph",
    "text": "Guru Kelas hendaklah menyediakan SATU salinan Jadual Waktu Kelas dan Jadual Peribadi Guru Kelas untuk dipamerkan dalam kelas sendiri untuk rujukan murid dan rujukan pentadbir.\n\nGuru TIDAK dibenarkan mengubah atau meminda jadual waktu yang telah ditetapkan tanpa kebenaran Guru Besar dan Penolong Kanan."
   },
   {
    "id": "6163d1f9acf4",
    "type": "heading",
    "text": "KESELAMATAN HARTA BENDA SEKOLAH"
   },
   {
    "id": "e57c832255bd",
    "type": "paragraph",
    "text": "Semua guru dikehendaki memberi kerjasama sepenuhnya dalam menjaga keselamatan harta benda sekolah. Pelajar yang merosakkan harta benda sekolah sama ada dengan sengaja atau tidak hendaklah dibawa ke pengetahuan pihak pentadbir sekolah.\n\nKetua Panitia atau Ketua yang dikhaskan menjaga bilik-bilik khas hendaklah memastikan ada peraturan-peraturan mengenai penggunaan alat-alat serta menjaga keselamatan diri murid seperti makmal, bengkel, pusat sumber atau perpustakaan.\n\nSetiap bilik-bilik Khas mestilah ada buku catatan penggunaan bilik khas serta buku catatan keluar masuk alatan atau penggunaan alatan yang digunakan seperti Bilik PJPK( Stor Sukan) ."
   },
   {
    "id": "56945ed480f6",
    "type": "heading",
    "text": "PANDUAN AM"
   },
   {
    "id": "bbdb3717b893",
    "type": "paragraph",
    "text": "Sebagai penjawat awam yang berkhidmat di institusi pendidikan kerajaan, semua guru, khususnya warga Sekolah Kebangsaan Bandar Tasik Selatan dinasihatkan untuk mengambil maklum dan tindakan wajar berdasarkan Akta Pendidikan 1996 (Akta 550), Pemberitahuan Undang-undang Am (P.U.(A)) serta Surat Pekeliling Ikhtisas (SPI) yang berkaitan. Antara yang perlu diambil perhatian ialah:\n\n1. SPI Bil. 5/1998 bertarikh 25 Mac 1998 – Akta Pendidikan di Bawah Akta Pendidikan 1996.\n2. Warta Kerajaan P.U.(A) 531 fasal (8) bertarikh 31 Disember 1997 – Menyimpan dan Menyelenggara Buku Rekod Mengajar.\n3. SPI Bil. 6/1995 bertarikh 9 Mei 1985 – Peraturan Pakaian Guru di Sekolah.\n4. SPI Bil. 2/1981 bertarikh 25 Mac 1998 – Ketetapan Masa di Sekolah.\n5. SPI Bil. 3 / bertarikh 14 September 1981 – Penggunaan Waktu Tidak Mengajar (Free Period) Oleh Guru-guru.\n6. SPI Bil. 11/1978 bertarikh 23 Oktober 1978 – Hari Pelepasan Peristiwa P.U.326/62.\n7. SPI Bil. 4/1984 bertarikh 14 Jun 1984 – Perhimpunan Sekolah.\n8. SPI Bil. 12/1988 – Larangan Menjalankan Jualan Terus di sekolah-sekolah.\n9. SPI Bil. 8/1988 bertarikh 1 Mac 1988 – Keselamatan Diri Pelajar di Sekolah.\n10. SPI Bil. 1/1995 bertarikh 6 April 1995 – Keselamatan Diri Pelajar Semasa Pendidikan Jasmani dan Kokurikulum.\n11. SPI Bil. 7/1995 bertarikh 11 Oktober 1995 – Tatacara Mengenakan Tindakan dan Hukuman Terhadap Pelajar-pelajar Sekolah.\n12. SPI Bil. 8/2005 – Pelaksanaan Bekerja 5 hari seminggu.\n13. Surat Pekeliling Ikhtisas Bil.5/2019 Pelaksanaan Kurikulum Standard Sekolah Rendah (KSSR) (Semakan 2017) Pendidikan Seni Visual dan KSSR (Semakan 2017) Pendidikan muzik bagi menggantikan mata pelajaran Pendidikan Kesenian Mulai Tahun 2020.\n14. Surat Pekeliling Ikhtisas Bil.2/2010 Pelaksanaan Dasar Memartabatkan Bahasa Malaysia Memperkukuhkan Bahasa Inggeris (MBMMBI).\n15. Surat Pekeliling Ikhtisas Bil.12/2011 Pelaksanaan Dasar Memartabatkan Bahasa Malaysia Memperkukuhkan Bahasa Inggeris (MBMMBI).\n16. Surat Pekeliling Ikhtisas Bil.9/2010 Pelaksanaan Kurikulum Standard Prasekolah Kebangsaan\n17. Surat Pekeliling Ikhtisas Bil.1/2011 Penambahbaikan Sistem Pentaksiran Kebangsaan bagi Ujian Penilaian Sekolah Rendah Mulai 2011 (Pelaksanaan PBS)\n18. Surat Siaran KPPM Bil.4/2012 atau Surat Siaran KPM Bil.7/2012 Program Guru Penyayang.\n19. Surat Siaran KPPM KP(BPSH-SPSR)401/12/003(1) bertarikh 19 Julai 2012 Dasar Warga Emas Negara (DWEN).\n20. Surat Pekeliling Ikhtisas Bil.3/1999: Penyediaan Rekod Pengajaran dan Pembelajaran\n21. JPA.SARAAN (S)43/34 Jld.3(24) bertarikh 18 Februari 2022:Penambahbaikan Peraturan Pengesahan Sijil Sakit Swasta Yang Melebihi 15 Hari Bagi Rawatan Pesakit Luar Oleh Pegawai Perubatan Kerajaan."
   }
  ],
  "updatedAt": null
 },
 "akuan": {
  "title": "AKUAN PENERIMA MAKLUMAT & ARAHAN",
  "subtitle": "",
  "layout": "standard",
  "blocks": [
   {
    "id": "357e4c2c24b2",
    "type": "heading",
    "text": "AKUAN PENERIMAAN MAKLUMAT DAN ARAHAN"
   },
   {
    "id": "5570051a3312",
    "type": "paragraph",
    "text": "Saya, __________________________________________________________________________, pegawai yang sedang bertugas SK Bandar Tasik Selatan mengaku bahawa saya telah menerima maklumat dan arahan tentang pentadbiran dan pengurusan sekolah pada __________________ dan memahami segala maklumat yang disampaikan dan dinyatakan dalam Buku Panduan Pengurusan Sekolah Tahun 2026 serta akan mematuhi segala arahan yang diberikan.\n\nSaya juga berjanji akan berusaha dengn sepenuh-penuhnya menunaikan tanggungjawab saya dengan rajin dan bersungguh-sungguh serta mengekalkannya sejajar dengan kemajuan ikhtisas dan sosial serta sentiasa mengawasi diri supaya menjaga nama baik profesion perguruan.\n\nTandatangan : ……………………….………….\n\nJawatan : ………………………………….\n\nTarikh : …………………………………...\n\nDisahkan oleh : ……………………………………….\n(Tandatangan)\n\nNama : ………………………………………….\n(HURUF BESAR)\n\nJawatan : ………………………………………….\n\nTarikh : ………………………………………….\n\nCop Sekolah : …………………………………………."
   }
  ],
  "updatedAt": null
 },
 "bidang-tugas-guru": {
  "title": "BIDANG TUGAS",
  "subtitle": "GURU",
  "layout": "standard",
  "blocks": [
   {
    "id": "9cc791bc29d0",
    "type": "heading",
    "text": "GURU KELAS"
   },
   {
    "id": "dff0f900b561",
    "type": "paragraph",
    "text": "**Buku Teks, Biasiswa Dan Bantuan Skim Baucar Tuisyen (SBT)**\nMemastikan skim pinjaman buku teks diagih kepada pelajar yang layak dan memastikan buku-buku tersebut dibalut dan ditulis nama pelajar.\nMemulangkan buku teks pada tarikh yang ditetapkan dan menyenaraikan nama pelajar yang tidak memulangkan buku teks pada akhir tahun dan memberikan senarai itu kepada guru SPBT.\nMengenalpasti palajar yang layak mengikuti Skim Baucar Tuisyen serta menyimpan rekod pencapaian mereka.\n\n**Kutipan Bayaran Tambahan Sekolah Dan Sumbangan**\nMengutip bayaran tambahan sekolah pada awal tahun dan menggalakkan pelajar membayar semua bayaran tambahan  sekaligus.\nMengutip sumbangan tahunan PIBG.\nMengutip wang peperiksaan bagi kelas-kelas peperiksaan.\nMengeluarkan resit kepada pelajar bagi pembayaran yang dibuat.\nMenyerahkan wang kutipan sumbangan  PIBG kepada Bendahari PIBG.\n\n**Pendaftaran Murid Baharu**\nMenerima kemasukan pelajar baru dari PKHEM/Penyelaras Aliran.\nMendaftarkan pelajar baru ke dalam buku kemasukan pelajar dan mendapatkan nombor pendaftaran pelajar baru dari buku kemasukan pelajar daripada Penolong Kanan HEM.\nMenentukan penerimaan borang SPBT (sekiranya layak) dan sekolah yang terdahulu dan memastikan pelajar ini mendapat buku teks.\nMenyemak jika pelajar ini menerima sebarang bentuk biasiswa dan melaporkan kepada Penolong Kanan HEM.\nMenentukan fail kemajuan pelajar dari sekolah asal disertakan.\nMenentukan rumah sukan pelajar baru daripada Penolong Kanan KK.\nMengambil butir-butir diri yang diperlukan.\n\n**Murid Keluar / Berpindah**\nMenentukan borang SPBT dan Fail Kemajuan Murid dihantar ke pejabat.\nMenentukan hal-hal  pentaksiran telah disempurnakan bagi pelajar Tahun Enam.\nMenentukan buku teks lengkap untuk dibawa ke sekolah baru\nMenentukan penerimaan biasiswa dilaporkan kepada pejabat.\n\n**Pendaftaran Sukan, Permainan Dan Lain-lain**\nMenentukan setiap pelajar mempunyai rumah sukan.\nMemastikan setiap pelajar menyertai aktiviti kokurikulum dan menyerahkan senarai nama mereka mengikut persatuan, kelab dan badan beruniform yang dipilih kepada Penyelaras Kelab / Persatuan.\nMenggalakkan pelajar bergiat cergas dalam sukan dan juga aktiviti kokurikulum.\n\n**Guru Kaunselor Dan Guru Disiplin**\nMenjalankan tugas sebagai seorang guru kaunselor.\nMenjalankan tugas sebagai seorang guru disiplin."
   },
   {
    "id": "2b8b4f1a90f0",
    "type": "paragraph",
    "text": "**Pengurusan Dan Organisasi Kelas**\nMembentuk organisasi kelas yang terdiri daripada Ketua Darjah dan Penolong Ketua Darjah.  AJK Kebersihan dan AJK Keceriaan, memastikan AJK Kebersihan mengagihkan pelajar untuk membersihkan papan hitam, menyapu lantai, mengelap tingkap, mengemaskini papan kenyataan dan papan maklumat dari semasa ke semasa, menyediakan langsir dan bunga (jika perlu) untuk kelas.\nMenentukan perkara-perkara berikut DISEDIAKAN:-\nJadual Waktu Kelas\nJadual Tugas Harian\nPerabot seperti kerusi, meja, almari dan papan hitam diinventorikan\nMoto Kelas atau Cogan Kata Kelas\nAlatan pembersihan seperti penyapu, bakul sampah dan pengaut sampah.\nMenentukan kawat elektrik, kipas angin dan lampu baik dan selamat digunakan.\nMelaporkan perabot dan peralatan elektrik\nMembimbing organisasi kelas yang dilantik menjalankan tugas.\n\n**Jadual Kehadiran**\nMengisi kehadiran murid dalam sistem yang disediakan oleh Kementerian Pendidikan seawal waktu belajar dan sebelum masa yang telah ditetapkan oleh KPM.\nMemastikan Buku Kawalan kelas dikemaskini dan diisi oleh guru matapelajaran yang masuk ke kelas tersebut..\nBuku diambil dan dihantar di tempat yang ditetapkan.\nMenjamin keselamatan buku-buku tersebut.\n\n**Laporan Pelajaran (PBD/UASA), Sijil Berhenti Dan Sijil Penghargaan**\nMemastikan setiap pelajar mempunyai Fail Peribadi Murid dan salinan Laporan PBD, UPSA dan UASA serta Laporan Psikometrik hendaklah disimpan dalam fail tersebut.\nMengisi markah dan membuat laporan kemajuan akademik dan kokurikulum dalam sistem yang disediakan oleh Kementerian Pendidikan.\nMenyampaikan keputusan pentaksiran pelajar kepada ibu bapa mengikut tarikh yang ditetapkan.\nMenyedia dan mengisi “Mark Sheet” bagi setiap peperiksaan ,dikemaskini dan disimpan.\nMenyedia dan mengisi Sijil Berhenti dan sijil penghargaan dikeluarkan kepada para pelajar yang mewakili sekolah dalam pelbagai aktiviti dan kegiatan.\n\n**Masalah Pembelajaran, Kesihatan dan Disiplin Pelajar**\nMemberikan galakan, motivasi dan merangsangkan minat pelajar terhadap akademik.\nMenggalakkan pertandingan yang berbentuk akademik dan memberikan hadiah.\nSentiasa prihatin terhadap semua masalah pelajar.\nMelaporkan kepada Guru Bimbingan & Kaunseling jika terdapat kemerosotan pelajaran dalam kalangan pelajar.\nMelaporkan kepada Guru Bertugas jika terdapat pelajar yang menghadapi masalah kesihatan.\nMelaporkan kepada Guru Disiplin jika terdapat pelajar yang melanggar disiplin sekolah yang SERIUS.\nMelaporkan kes ponteng, pergaduhan atau kemalangan mengikut prosedur dengan;\nMendapatkan dan mengisi borang “Laporan Kes & Salah Laku Murid” yang dapat diperoleh dari pejabat.\nMenghantar satu salinan borang tersebut kepada ibu bapa"
   },
   {
    "id": "564c97604846",
    "type": "heading",
    "text": "GURU MATA PELAJARAN"
   },
   {
    "id": "8e63800186d1",
    "type": "paragraph",
    "text": "Memahami dan boleh mentafsirkan serta menghuraikan kandungan Dokumen Standard Kurikulum dan Pentaksiran mata pelajaran yang berkenaan.\nMemahami dan mematuhi Pekeliling-pekeliling dan arahan yang berkaitan dengan mata pelajaran yang diajar serta menentukan dan menetapkan matlamat yang harus dicapai, iaitu dari segi pengetahuan, kebolehan dan kemahiran yang harus dicapai di akhir penggal persekolahan.\nMenyediakan e-RPH yang dikemaskini dan menyerahkan kepada Guru Besar atau pentadbir pada masa yang ditetapkan.\nMenyediakan Rancangan Pengajaran Tahunan dan Harian bagi mata pelajaran yang diajar dan melaksanakan pengajarannya mengikut Rancangan Pengajaran yang disediakan.\nMenyedia dan memberikan kerja-kerja latihan yang cukup, memeriksa buku latihan pelajar dan memulangkan semula secepat mungkin.  Menyerahkan/menunjukkan buku latihan murid kepada Guru Besar wakilnya pada masa yang dikehendaki.\nMenjalankan pentaksiran sumatif kepada pelajar. Merekodkan soalan-soalan dan keputusan pentaksiran dalam Buku Rekod Mengajar.\nMengesan kelemahan pelajar dan menjalankan kelas pemulihan/bimbingan.\nMenjadi ahli dalam Panitia Mata Pelajaran, menghadiri serta mematuhi dan melaksanakan keputusan mesyuarat Panitia.\nGuru mata pelajaran harus menyedari dan menggunakan buku panduan yang dikeluarkan oleh Kementerian Pelajaran/Jabatan Pelajaran.\nMemastikan keselamatan pelajar di makmal/Bilik Khas/Bilik PPSMI/Bilik KH serta mengawasi penggunaan peralatan.\nMenghadiri mesyuarat/taklimat mengenai mata pelajaran yang berkenaan sama ada yang dikelolakan oleh Kementerian Pelajaran/Jabatan Pelajaran.  Menyampaikan semula maklumat kepada guru lain yang mengajar mata pelajaran yang sama.\nSentiasa mengikuti perkembangan dan pembaharuan tentang teknik mengajar bagi mata pelajaran berkenaan bagi meninggikan lagi prestasi dalam pengajaran dan pembelajaran.\nMelaporkan kepada Ketua Panitia tentang masalah pengajaran dan pembelajaran untuk tindakan selanjutnya.\nMenjaga keselamatan dan kebersihan alat-alat bantuan mengajar yang digunakan, memastikan bahawa alat-alat bantuan mengajar digunakan secara meluas. Bertanggungjawab dalam menambahkan alat bantuan mengajar bagi memperkayakan Pusat Sumber Sekolah.\nMengadakan sudut-sudut mata pelajaran berkenaan dalam kelas-kelas yang diajar.\nMembantu menguruskan Bank Soalan.\nMenjalankan tugas seorang kaunselor dan seorang guru disiplin.\nMenjalankan tugas yang diarahkan dari semasa ke semasa."
   },
   {
    "id": "4f951f750e0f",
    "type": "heading",
    "text": "GURU BERTUGAS MINGGUAN"
   },
   {
    "id": "1da8d489aa80",
    "type": "paragraph",
    "text": "Guru bertugas mingguan hendaklah datang sekurang-kurangnya 30 minit sebelum persekolahan bermula dan pulang sekurang-kurangnya 20 minit setelah sekolah berakhir.\nMemastikan bilik-bilik darjah telah disapu, sampah-sarap telah dibuang serta lampu dan kipas/tingkap telah ditutup setelah tamat persekolahan.\nMengawasi disiplin pelajar di luar waktu belajar seperti waktu rehat dan waktu sebelum loceng pertama dibunyikan, sekitar kawasan sekolah dan mengambil tindakan yang segera dan munasabah; jika perlu.\nMengawasi kebersihan bilik-bilik darjah, tandas, kantin, bilik-bilik khas dan kawasan sekolah.\nMemeriksa kebersihan makanan yang dijual di kantin sekolah.\nMenguruskan rawatan pelajar yang sakit dan menghantar mereka ke hospital/ke rumah.\nMengeluarkan surat kebenaran ke hospital dan merekodkan nama pelajar yang memohon.\nMengawasi pelajar menepati waktu datang dan pulang ke sekolah, masa rehat dan masa pertukaran guru.\nMenguruskan hal-hal bersabit dengan kehilangan barang-barang.\nMenentukan keselamatan pelajar di sekitar kawasan sekolah serta mengawasi harta benda sekolah.\nMencatatkan kegiatan-kegiatan sekolah seperti sukan, persatuan-persatuan, unit beruniform dan aktiviti-aktiviti lain yang dijalankan pada “PAPAN AKTIVITI”.\nMembuat catatan mengenai perkara-perkara penting yang berlaku sepanjang hari/minggu persekolahan ke dalam Buku Laporan Bertugas seperti:-\nkedatangan pelajar, guru dan staf sokongan pelajar ponteng, tidak hadir atau sakit\nlawatan-lawatan/pelawat dimaklumkan kepada Guru Besar\nUcapan/pengumuman-pengumuman dalam buku perkhimpunan\nLaporan kes ditulis di dalam buku / borang khas yang disediakan oleh sekolah.\nMembuat laporan di dalam Buku Laporan Bertugas yang disediakan dan kalau perlu laporkan terus kepada Guru Besar supaya tindakan segera dapat diambil.\nPerhimpunan Harian / Perhimpunan Rasmi :  PENYELARAS PERHIMPUNAN\nA) Memastikan semua guru dan pelajar menghadiri perhimpunan.\nB) Memastikan bendera-bendera, pembesar suara  telah disediakan.\nC) Memastikan pelajar telah beratur dengan senyap dan memberi perhatian.\nD) Skrip Doa, Ikrar dan Keset (CD) Lagu Kebangsaan/Kebesaran Negeri disediakan.\nE) Petugas Perhimpunan (MC) dimaklumkan.\n15. Menjalankan tugas-tugas yang diarahkan oleh Guru Besar dari semasa ke semasa."
   }
  ],
  "updatedAt": null
 },
 "bidang-tugas-akp": {
  "title": "BIDANG TUGAS",
  "subtitle": "AKP",
  "layout": "standard",
  "blocks": [
   {
    "id": "6969c6768205",
    "type": "heading",
    "text": "KETUA PEMBANTU TADBIR"
   },
   {
    "id": "2851f4691431",
    "type": "paragraph",
    "text": "Ketua Pembantu Tadbir bertanggungjawab kepada Guru Besar dalam tugas :\nMembantu Guru Besar mengurus Hal Ehwal Kewangan / Akaun Sekolah.\nMembantu Guru Besar mengurus hal-hal Perkhidmatan Perjawatan.\nMembantu Guru Besar mengurus hal Pentadbiran Sekolah.\nMenyelia semua staf sokongan sekolah termasuk Pembantu Pengurusan Murid (PPM).\nLain-lain tugas yang diarahkan dari semasa ke semasa."
   },
   {
    "id": "4dd3d283db5c",
    "type": "heading",
    "text": "PEMBANTU TADBIR [BAHAGIAN KEWANGAN]"
   },
   {
    "id": "f14f8ca41e85",
    "type": "paragraph",
    "text": "Pembantu Tadbir Bahagian Kewangan bertanggungjawab untuk menyediakan :\nTuntutan gaji dan elaun\nBiasiswa dan bantuan kerajaan\nTuntutan elaun lebih masa pekerja.\nTuntutan bantuan perkapita.\nPembayaran bil-bil.\n\nMengemaskini :\nBuku Tunai - Akaun Kerajaan\nAkaun SUWA\nAkaun Asrama (jika terlibat)\n\nMenguruskan:\nCek-cek.\nBayaran Tambahan dan Kira-kira yuran khas pelajar serta menyimpan slip bank.\nPesanan barang-barang keperluan pejabat.\nStok pejabat.\nMenjalankan tugas-tugas lain yang diarahkan oleh Guru Besar/Penolong Kanan dari semasa ke semasa."
   },
   {
    "id": "dae3398282e2",
    "type": "heading",
    "text": "PEMBANTU TADBIR [BAHAGIAN PENTADBIRAN PERKHIDMATAN]"
   },
   {
    "id": "cfc15c5fb7b7",
    "type": "paragraph",
    "text": "Pembantu Tadbir Bahagian Pentadbiran Perkhidmatan bertanggungjawab untuk menguruskan :\nBiasiswa Kecil Persekutuan (BKP), Bantuan Kebajikan Masyarakat dan lain-lain.\nPertukaran murid.\nPertukaran guru dan staf sokongan\nPengesahan jawatan, pencen, peperiksaan am kerajaan dan kursus induksi.\nSurat-surat dan rekod cuti guru/staf sokongan.\nBuku Biru/Permit mengajar guru.\nData murid, guru dan staf sokongan.\nMenjalankan tugas-tugas lain yang diarahkan oleh Guru Besar dan Penolong Kanan dari masa ke masa."
   },
   {
    "id": "b5a0611ee71c",
    "type": "heading",
    "text": "PEMBANTU KHIDMAT AM"
   },
   {
    "id": "1ae8ecc66812",
    "type": "paragraph",
    "text": "Pembantu Khidmat Am bertanggungjawab bagi :\nMengurus pengambilan surat-surat di PPD dan surat yang berkaitan dengan urusan sekolah atau yang diarahkan oleh Guru Besar dan Penolong-penolong Kanan.\nMengurus Kad Perakam Waktu Kehadiran Guru/Staf Sokongan.\nMencetak soalan-soalan peperiksaan dan siaran-siaran pejabat.\nMembantu Pembantu Tadbir dalam urusan bank seperti membayar bil dan lain-lain.\nMengambil dan meminitkan surat.\nMemasukkan surat-surat ke dalam fail dan mengedarkannya kepada guru/staf sokongan yang berkenaan.\nMengepos dan mengambil surat.\nMerekod dan mengawal semua stok masuk dan keluar peralatan pejabat.\nMengemaskini sistem fail.\nMengemas bilik Guru Besar dan bilik cetak.\nMenjalankan tugas-tugas lain yang diarahkan oleh Guru Besar dari semasa ke semasa."
   },
   {
    "id": "bcc92d26dcb1",
    "type": "heading",
    "text": "PEKERJA AM"
   },
   {
    "id": "07a358b9db4d",
    "type": "paragraph",
    "text": "Pekerja Am bertanggungjawab untuk menjaga kebersihan kawasan sekolah merangkumi kerja-kerja :\nMembersihkan kawasan sekolah termasuklah:\n- Membersihkan rumput yang dipotong dan membuangnya di tempat buangan sampah.\n- Menyapu sampah di kaki lima bangunan dan kawasan yang tidak berumput.\n- Membersihkan tandas, longkang dan stor.\nMenjaga dan menyelenggara peralatan-peralatan kerja seperti cangkul, penyodok dan sebagainya.\nMemastikan stok peralatan PRA sentiasa lengkap dan cukup.\nMenanam dan menjaga pokok-pokok bunga/pokok serta membuang rumput dipasu.\nMembantu menyediakan tempat persiapan bagi program-program upacara rasmi sekolah.\nMembaik pulih peralatan sekolah/perabot sekolah yang rosak.\nMemastikan peralatan sekolah, perabot tidak terbiar di merata tempat.\nMelaporkan kepada Guru Besar tentang kerosakan tandas, paip dan lain-lain untuk tindakan.\nMemadam segala grafiti/conteng pada dinding bangunan sekolah.\nMenjalankan tugas-tugas lain yang diarahkan oleh Guru Besar atau Penolong Kanan.\n\n."
   },
   {
    "id": "4a758a4b953d",
    "type": "heading",
    "text": "PENGAWAL KESELAMATAN"
   },
   {
    "id": "b9f26e13d642",
    "type": "paragraph",
    "text": "Pengawal Keselamatan bertanggungjawab terhadap hal-hal keselamatan sekolah termasuklah :\nMelaporkan diri ke sekolah sekurang-kurangnya sepuluh minit sebelum waktu bertugas seperti dijadualkan dan sentiasa berada di kawasan sekolah semasa bertugas.\nMembuat rondaan di dalam kawasan sekolah dari masa ke masa dan mengunci jam jaga jika ada.\nMembuat laporan mengenai keadaan sekolah seperti diperlukan dan menghubungi Guru Besar/polis dengan segera jika berlaku kecurian atau kecemasan.\nMemastikan semua bilik darjah dan bilk-bilik lain dikunci selepas waktu sekolah dan dibuka pada hari sekolah sebelum meninggalkan kawasan sekolah setelah bertugas.\nMemastikan semua pintu dikunci selepas waktu sekolah dan pada masa cuti am/cuti sekolah.\nMembuka pintu pagar pada hari sekolah apabila ada pelawat dan menutup pintu pagar jika tiada pelawat masuk.\nMemadam semua suis lampu dan kipas sebelum meninggalkan kawasan sekolah selepas bertugas.\nMemastikan tiada orang luar memasuki kawasan sekolah kecuali dengan kebenaran khas atau Guru Besar/pentadbir.\nMengawas murid jemputan yang terlibat dengan aktiviti-aktiviti ko-kurikulum di luar waktu persekolahan.\nMelaporkan dengan segera segala kes kecemasan kepada pihak berdan melaporkan kepada Guru Besar.\nMenjalankan tugas-tugas lain yang diarahkan oleh Guru Besar/wakilnya dari semasa ke semasa."
   }
  ],
  "updatedAt": null
 },
 "guru-kelas": {
  "title": "GURU KELAS DAN GURU BANTU",
  "subtitle": "",
  "layout": "standard",
  "blocks": [
   {
    "id": "01ae2d75d733",
    "type": "heading",
    "text": "TAHUN 1  |  SURINA BINTI MALEK"
   },
   {
    "id": "33f58739b1d9",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU"
    ],
    "rows": [
     [
      "NOOR HAMIMI BINTI ABDUL AZIZ",
      "1 UM",
      ""
     ],
     [
      "HAWA SYAHIRAH BINTI MOHD SAID",
      "1 USM",
      "NUR INSYIRAH NAJWA BINTI OTHMAN"
     ],
     [
      "NUR FATIN UMMAIRAQ BINTI ABDUL HALIM",
      "1 UKM",
      "ZUBAIDAH BINTI DAUD KAIYIN"
     ],
     [
      "NUR IZRIN FARAH HANI BINTI ISMAIL",
      "1 UPM",
      "NASIHA BINTI MOHD SHARIF"
     ],
     [
      "SITI MAZURA BINTI SHAIKH MUSTAFA",
      "1 UTM",
      "MUHAMMAD HAZWAN BIN MD TAIB"
     ],
     [
      "SITI FAREZZA BINTI ABD MUIS",
      "1 UIAM",
      "SITI RAFIDAH BINTI ABDUL RAHMAN"
     ],
     [
      "ROSNAYA BINTI MAT ISA",
      "1 UUM",
      "SURINA BINTI MALEK"
     ],
     [
      "SALME BINTI SENIK",
      "1 UPSI",
      "HAPINI BINTI ABD WAHAB"
     ]
    ],
    "style": "gold",
    "numbered": false
   },
   {
    "id": "ee4fc56b8269",
    "type": "heading",
    "text": "TAHUN 2  |  FATIMAH BINTI AB LATIF"
   },
   {
    "id": "5e5ecbe73e7a",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU"
    ],
    "rows": [
     [
      "SITI HAJAR BINTI AB HADI",
      "2 UM",
      "SITI NORLIANA BINTI MOHD NOR"
     ],
     [
      "KHARAINE BINTI CHE IBRAHIM",
      "2 USM",
      "MOHD ZULFADLI BIN YUSOF"
     ],
     [
      "NORAZLIZA BINTI ISMAIL",
      "2 UKM",
      "AHMAD IZHAM BIN ABD GHANI"
     ],
     [
      "THIVANY A/P MANOGARAN",
      "2 UPM",
      "SHAREENA FATIHAH BINTI SHARIN"
     ],
     [
      "NORSABRINA BINTI HASSAN",
      "2 UTM",
      ""
     ],
     [
      "MOHD SHAKIR BIN ESUAN",
      "2 UIAM",
      "MOHD HAMDI FARKHAN BIN SALEHHUDDIN"
     ],
     [
      "ALIF HAZIM BIN NAJIB",
      "2 UUM",
      "ANDREW ANAK ENTIPAN"
     ],
     [
      "NORSUZERA BINTI ZAHARI",
      "2 UPSI",
      ""
     ]
    ],
    "style": "gold",
    "numbered": false
   },
   {
    "id": "dac3da53f10a",
    "type": "heading",
    "text": "TAHUN 3  |  AZMI BIN MOHAMAD@ALIAS"
   },
   {
    "id": "7fbdc04fdebb",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU"
    ],
    "rows": [
     [
      "HUSNA AMIRA BINTI ISMAIL",
      "3 UM",
      "KHIRUL AMIR BIN ABU HASSAN"
     ],
     [
      "SINNTHU A/P PONNUSAMY",
      "3 USM",
      "MUHD AZIZI BIN AHMAD SHAMSUL MA’ARIF"
     ],
     [
      "DARSHINI A/P GUNASAGARAN",
      "3 UKM",
      "SITI NOR AINIYAH BINTI RIDAWI"
     ],
     [
      "NORBAZRIANA BINTI BADRI",
      "3 UPM",
      "FATIMAH BINTI AB LATIF"
     ],
     [
      "RAJA NUR SAZLIN BINTI RAJA SAFWAN",
      "3 UTM",
      "ZAHRAH BINTI MOHAMAD DAHLAN"
     ],
     [
      "MUHAMMAD HAFIZ BIN MOHD BASRI",
      "3 UIAM",
      "ABOL IBNUL EQKWAM BIN ZULKIFLI"
     ],
     [
      "NOOR ILLI BINTI ELAS",
      "3 UUM",
      "AZMI BIN MOHAMAD@ALIAS"
     ],
     [
      "MUSAFARUDIN BIN OTHMAN",
      "3 UPSI",
      ""
     ]
    ],
    "style": "gold",
    "numbered": false
   },
   {
    "id": "952b9e136664",
    "type": "heading",
    "text": "TAHUN 4  |  MUHAMMAD ALIFF BIN KAMAL AFFANDI"
   },
   {
    "id": "e55fd5aabc7d",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU"
    ],
    "rows": [
     [
      "SUGANIYA A/P ARNACHALAM",
      "4 UM",
      "MUHAMAD ALIFF BIN KAMAL AFFANDI"
     ],
     [
      "NURASYAHIRA BINTI BASIRUN",
      "4 USM",
      "SHAIFUL NAZRI BIN ABDUL JABBAR"
     ],
     [
      "NORASHIKIN BINTI AZIZ",
      "4 UKM",
      "SARAH AQILAH BINTI JAMALULAIL"
     ],
     [
      "FAIZAH BINTI MOHD SAHAT",
      "4 UPM",
      "ZAIDI BIN OTHMAN"
     ],
     [
      "FAATIMATUZZAHRAH BINTI HALIMUDIN",
      "4 UTM",
      "MUHAMMAD IZWAN BIN HALIM"
     ],
     [
      "NUR IZZAH ‘ATIRAH BINTI HUDALLAH",
      "4 UIAM",
      "RUZANA BINTI AHMAD"
     ],
     [
      "HAREENA A/P N.SIVAGANE",
      "4 UUM",
      "NUR IZZAH ‘ATIRAH BINTI HUDALLAH"
     ],
     [
      "MUHAMMAD HAFIZ BIN YUSOF",
      "4 UPSI",
      "ZURIFAH BINTI ABD RAHMAN"
     ]
    ],
    "style": "gold",
    "numbered": false
   },
   {
    "id": "203a7ac81b89",
    "type": "heading",
    "text": "TAHUN 5  |  MOHD ARIF BIN AHMAD TARMIZI"
   },
   {
    "id": "53407dc09dbc",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU"
    ],
    "rows": [
     [
      "MOHD ZAHIR BIN RAMLI",
      "5 UM",
      "SITI ‘AISYAH BINTI JAMALUDIN"
     ],
     [
      "AISAH BINTI SH’ARI",
      "5 USM",
      "ABDUL JALIL BIN MAT"
     ],
     [
      "SAHRULLIZAM BIN LIAS",
      "5 UKM",
      "GRACE ANNE"
     ],
     [
      "SITI SUHAILI BINTI ISMAIL",
      "5 UPM",
      "NORLAILA BINTI MOHD SALLEH"
     ],
     [
      "MUHAMMAD SHAFIQ BIN HAZMAN",
      "5 UTM",
      "ROSLEEN BIN ABU BAKAR"
     ],
     [
      "NORASSKIN BINTI MOHAMED",
      "5 UIAM",
      "ZIRWATUL RAFIDAH BINTI RAHIM"
     ],
     [
      "ZALIFAH BINTI MOHD ZAWAWI",
      "5 UUM",
      "NUR FAKHIRA BINTI JALALUDDIN"
     ],
     [
      "NOORAZILA BINTI ABDULLAH",
      "5 UPSI",
      "MOHD ARIF BIN AHMAD TARMIZI"
     ]
    ],
    "style": "gold",
    "numbered": false
   },
   {
    "id": "ce2937f9afe1",
    "type": "heading",
    "text": "TAHUN 6  |  ROHAZLINDA BINTI ISSAHAK"
   },
   {
    "id": "c1f874b20839",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU"
    ],
    "rows": [
     [
      "SALEHA BINTI MOHAMED YUSOF",
      "6 UM",
      "NORMALIZA BINTI RAMLI"
     ],
     [
      "ZATUSY SYAMAM BINTI SHARUDDIN",
      "6 USM",
      "ROHAZLINDA BINTI ISSAHAK"
     ],
     [
      "YAACOB BIN ISMAIL",
      "6 UKM",
      "NUR SAHIRA BINTI MOHD SOIB"
     ],
     [
      "TENGKU MOHAMMAD AIMAN BIN TENGKU MOHAMMAD FAUZAN",
      "6 UPM",
      "WAN NOOR HILWANI BINTI WAN MOHAMED"
     ],
     [
      "NORIDAYU BINTI NORDIN",
      "6 UTM",
      "ABDULLAH MUHAIMIN BIN AHAMAD"
     ],
     [
      "MASLINA BINTI JAMIYOU @ HJ ABDULLAH",
      "6 UIAM",
      "KAMARUNZAMAN BIN ADAM"
     ],
     [
      "NURAZIRA BINTI ABDULL HALIM",
      "6 UUM",
      "YETTE SURIANE BINTI MOHD BAHARUDDIN"
     ],
     [
      "BHARATHI USHA A/P MARTHEVEERAN",
      "6 UPSI",
      "RAHANA BINTI MOHAMAD KHATIB"
     ]
    ],
    "style": "gold",
    "numbered": false
   },
   {
    "id": "157b90d0d241",
    "type": "heading",
    "text": "PPKI"
   },
   {
    "id": "a8618ad17f33",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU / PPM"
    ],
    "rows": [
     [
      "SITI NOOREHAN BINTI MAT SA’IM",
      "5 MERCURY",
      "NOOR HANA BINTI HAWARI"
     ],
     [
      "WAN NOR AZIAN BINTI BIDUZODIN",
      "4 VENUS",
      "MOHAMMAD FAIZAL BIN MOHD NOR"
     ],
     [
      "NURUL SYIFAA’ BINTI ZAINOL",
      "4 EARTH",
      "MOHD ZAHRI BIN LONG"
     ],
     [
      "MOHD MAZNI BIN MAHASAN",
      "3 MARS",
      "NUR AQILAH BINTI KHALIT MOHAMMAD FAIZAL BIN MOHD NOR"
     ],
     [
      "TUAN MOHD KHAIRI BIN TUAN SOH",
      "2 JUPITER",
      "MOHD HAIROS BIN DAUD NURUL AINI BINTI ZULRAHMAN"
     ],
     [
      "SITI AISAH BINTI ABD KHANI",
      "2 SATURN",
      "SITI AISYAH ILYANI BINTI BAHRI NOOR HANA BINTI HAWARI"
     ],
     [
      "DELSIE ANAK DAWI",
      "1 URANUS",
      "TUAN NOREHAN BINTI RAJA OTHMAN NOOR HAZURA BINTI MAD NORDIN"
     ],
     [
      "WAN MARFUZA BINTI WAN MOHD FUAT",
      "1 NEPTUNE",
      "NORYATI BINTI NGAH NUR ASNIDA BINTI AHMAD SAZALI"
     ]
    ],
    "style": "gold",
    "numbered": false
   },
   {
    "id": "33d55451417f",
    "type": "heading",
    "text": "PRASEKOLAH"
   },
   {
    "id": "1f94248e8430",
    "type": "table",
    "columns": [
     "GURU KELAS",
     "KELAS",
     "GURU BANTU"
    ],
    "rows": [
     [
      "ZULATUL AZRINA BINTI ZULKELI",
      "PRA MANJAKU",
      "NOR LINAWATI BINTI ALI"
     ],
     [
      "FARAH NUR IMANIAH BINTI MOHD SHUKRI",
      "PRA SAYANGKU",
      "NOOR SHAHRIDAH BINTI MOHARAM"
     ]
    ],
    "style": "gold",
    "numbered": false
   }
  ],
  "updatedAt": null
 },
 "kumpulan-bertugas": {
  "title": "KUMPULAN GURU BERTUGAS",
  "subtitle": "",
  "layout": "standard",
  "blocks": [
   {
    "id": "aa805c176d55",
    "type": "table",
    "columns": [
     "KUMPULAN",
     "SESI PAGI",
     "SESI PETANG"
    ],
    "rows": [
     [
      "KUMPULAN 1",
      "ABDULLAH MUHAIMIN BIN AHAMAD\nMUHAMMAD IZWAN BIN HALIM\nSAHRULLIZAM BIN LIAS\nFAATIMATUZZAHRAH BINTI HALIMUDIN\nHAREENA A/P N. SIVAGANESE\nNOORAZILA BINTI ABDULLAH\nNORMALIZA BINTI RAMLI\nWAN NOOR HILWANI BT. WAN MOHAMED\nRAHANA BINTI MOHAMAD KHATIB",
      "MOHD HAMDI FARKHAN B. SALEHHUDDIN\nKHIRUL AMIR BIN ABU HASAN\nAHMAD IZHAM BIN ABD GHANI\nFATIMAH BINTI AB LATIF\nHAPINI BINTI ABDULL WAHAB\nNOOR ILLI BINTI ELAS\nNUR INSYIRAH NAJWA BINTI OTHMAN\nSHAREENA FATIHAH BINTI SHARIN\nZUBAIDAH BINTI DAUD KAIYIN"
     ],
     [
      "KUMPULAN 2",
      "MUHAMAD ALIFF BIN KAMAL AFFANDI\nZAIDI BIN OTHMAN\nTENGKU MOHAMMAD AIMAN\nZALIFAH BINTI MOHD ZAWAWI\nNURAZIRA BINTI ABDULL HALIM\nMASLINA BINTI JAMIYOU@HJ ABDULLAH\nFAIZAH BINTI MOHD SAHAT\nRUZANA BINTI AHMAD\nGRACE ANNE",
      "ALIF HAZIM BIN NAJIB\nANDREW ANAK ENTIPAN\nMOHD SHAKIR BIN ESUAN\nHUSNA AMIRA BINTI ISMAIL\nNOR SUZERA BINTI ZAHARI\nNORSABRINA BINTI HASSAN\nSALME BINTI SENIK\nSITI NORLIANA BINTI MOHD NOR\nZAHRAH BINTI MOHAMAD DAHLAN"
     ],
     [
      "KUMPULAN 3",
      "ABDUL JALIL BIN MAT\nMOHD ZAHIR BIN RAMLI\nMUHAMMAD HAFIZ BIN YUSOF\nNOR IDAYU BINTI NORDIN\nNORLAILA BINTI MOHD SALLEH\nNORASSKIN BINTI MOHAMED\nSARAH AQILAH BINTI JAMALULAIL\nSITI ‘AISYAH BINTI JAMALUDIN\nSUGANIYA A/P ARNACHALAM",
      "AZMI BIN MOHAMAD @ ALIAS\nMOHD ZULFADLI BIN YUSOF\nMUHD AZIZI B. AHMAD SHAMSUL MA’ARIF\nHAWA SYAHIRAH BINTI MOHD SAID\nKHARAINE BINTI CHE IBRAHIM\nNASIHA BINTI MOHD SHARIF\nNUR IZRIN FARAH HANI BINTI ISMAIL\nSITI FAREZZA BINTI ABD MUIS\nSURINA BINTI MALEK"
     ],
     [
      "KUMPULAN 4",
      "ROSLEEN BIN ABU BAKAR\nMUHAMMAD SHAFIQ BIN HAZMAN\nMOHD ARIF BIN AHMAD THARMIZI\nNURASYAHIRA BINTI BASIRUN\nYETTE SURIANE BT. M. BAHARUDDIN\nNORASHIKIN BINTI AZIZ\nROHAZLINDA BINTI ISSAHAK\nBHARATHI USHA A/P MARTHEVEERAN",
      "MUHAMMAD HAZWAN BIN MD TAIB\nNORAZLIZA BINTI ISMAIL\nRAJA NUR SAZLIN BINTI RAJA SAFWAN\nROSNAYA BINTI MAT ISA\nSINNTHU A/P PONNUSAMY\nSITI MAZURA BINTI SHAIKH MUSTAFA\nSITI RAFIDAH BINTI ABD RAHMAN\nTHIVANY A/P MANOGARAN"
     ],
     [
      "KUMPULAN 5",
      "KAMARUNZAMAN BIN ADAM\nYAACOB BIN ISMAIL\nAISAH BINTI SH’ARI\nNUR IZZAH ‘ATIRAH BINTI HUDALLAH\nNORAZAH BINTI AB AZIZ @ HAMID\nSITI SUHAILI BINTI ISMAIL\nSALEHA BINTI MOHD YUSOF\nZATUSY SYAMAM BINTI SHARUDDIN\nZIRWATUL RAFIDAH BINTI RAHIM",
      "ABOL IBNUL EQKWAN BIN ZOLKIFLI\nMUSAFARUDIN BIN OTHMAN\nMUHAMMAD HAFIZ BIN MOHD BASRI\nDARSHINII A/P GUNASAGARAN\nNOOR HAMIMI BINTI ABDUL AZIZ\nNOR BAZRIANA BINTI BADRI\nNUR FATIN UMMAIRAQ BT. ABDUL HALIM\nSITI HAJAR BINTI AB HADI"
     ]
    ],
    "style": "navy",
    "numbered": false
   }
  ],
  "updatedAt": null
 },
 "jadual-bertugas-1": {
  "title": "JADUAL KUMPULAN GURU BERTUGAS",
  "subtitle": "MINGGU 1-21",
  "layout": "standard",
  "blocks": [
   {
    "id": "e0ce9b724908",
    "type": "table",
    "columns": [
     "BULAN",
     "M",
     "TARIKH",
     "KUMPULAN",
     "KETUA (PAGI)",
     "KETUA (PETANG)",
     "CATATAN"
    ],
    "rows": [
     [
      "JANUARI",
      "M1",
      "12 - 16 Jan",
      "Kumpulan 1",
      "ABDULLAH MUHAIMIN BIN AHAMAD",
      "MOHD HAMDI FARKHAN B. SALEHHUDDIN",
      "SELAMAT DATANG & DISIPLIN MURID"
     ],
     [
      "",
      "M2",
      "19 - 23 Jan",
      "Kumpulan 2",
      "MUHAMAD ALIFF BIN KAMAL AFFANDI",
      "ALIF HAZIM BIN NAJIB",
      "KEBERSIHAN DIRI"
     ],
     [
      "",
      "M3",
      "26 - 30 Jan",
      "Kumpulan 3",
      "ABDUL JALIL BIN MAT",
      "AZMI BIN MOHAMAD @ ALIAS",
      "BERAKHLAK MULIA"
     ],
     [
      "FEBRUARI",
      "M4",
      "02 - 06 Feb",
      "Kumpulan 4",
      "ROSLEEN BIN ABU BAKAR",
      "MUHAMMAD HAZWAN BIN MD TAIB",
      "BERAZAM TINGGI & BERDISIPLIN"
     ],
     [
      "",
      "M5",
      "09 - 13 Feb",
      "Kumpulan 5",
      "KAMARUNZAMAN BIN ADAM",
      "ABOL IBNUL EQKWAN BIN ZOLKIFLI",
      "TONJOLKAN KEYAKINAN DALAM DIRI"
     ],
     [
      "",
      "M6",
      "16 - 20 Feb",
      "",
      "",
      "",
      ""
     ],
     [
      "",
      "M7",
      "23 - 27 Feb",
      "Kumpulan 1",
      "MUHAMMAD IZWAN BIN HALIM",
      "KHIRUL AMIR BIN ABU HASAN",
      "SIKAP SUKA MEMBACA DAN FAEDAHNYA"
     ],
     [
      "MAC",
      "M8",
      "02 - 06 Mac",
      "Kumpulan 2",
      "ZAIDI BIN OTHMAN",
      "ANDREW ANAK ENTIPAN",
      "AKHLAK MULIA"
     ],
     [
      "",
      "M9",
      "09 - 13 Mac",
      "Kumpulan 3",
      "MOHD ZAHIR BIN RAMLI",
      "MOHD ZULFADLI BIN YUSOF",
      "FAEDAH HIDUP BERSUKAN"
     ],
     [
      "",
      "M10",
      "16 - 20 Mac",
      "Kumpulan 4",
      "MUHAMMAD SHAFIQ BIN HAZMAN",
      "NORAZLIZA BINTI ISMAIL",
      "KESELAMATAN PENGGUNAAN BUKU SPBT"
     ],
     [
      "",
      "CP I",
      "23 - 27 Mac",
      "",
      "",
      "",
      ""
     ],
     [
      "APRIL",
      "M11",
      "30 Mac - 03 Apr",
      "Kumpulan 5",
      "YAACOB BIN ISMAIL",
      "MUSAFARUDIN BIN OTHMAN",
      "FAEDAH MENABUNG"
     ],
     [
      "",
      "M12",
      "06 - 10 Apr",
      "Kumpulan 1",
      "SAHRULLIZAM BIN LIAS",
      "AHMAD IZHAM BIN ABD GHANI",
      "PEMAKANAN SIHAT"
     ],
     [
      "",
      "M13",
      "13 - 17 Apr",
      "Kumpulan 2",
      "TENGKU MOHAMMAD AIMAN",
      "MOHD SHAKIR BIN ESUAN",
      "ULANGKAJI PELAJARAN"
     ],
     [
      "",
      "M14",
      "20 - 24 Apr",
      "Kumpulan 3",
      "MUHAMMAD HAFIZ BIN YUSOF",
      "MUHD AZIZI B. AHMAD SHAMSUL MA’ARIF",
      "MENEPATI MASA"
     ],
     [
      "MEI",
      "M15",
      "27 Apr - 01 Mei",
      "Kumpulan 4",
      "MOHD ARIF BIN AHMAD THARMIZI",
      "RAJA NUR SAZLIN BINTI RAJA SAFWAN",
      "MENGHORMATI DAN MENGHARGAI GURU"
     ],
     [
      "",
      "M16",
      "04 - 08 Mei",
      "Kumpulan 5",
      "AISAH BINTI SH’ARI",
      "MUHAMMAD HAFIZ BIN MOHD BASRI",
      "TANGGUNGJAWAB SEORANG MURID"
     ],
     [
      "",
      "M17",
      "11 - 15 Mei",
      "Kumpulan 1",
      "FAATIMATUZZAHRAH BINTI HALIMUDIN",
      "FATIMAH BINTI AB LATIF",
      "SEMANGAT PERPADUAN"
     ],
     [
      "",
      "M18",
      "18 - 22 Mei",
      "Kumpulan 2",
      "ZALIFAH BINTI MOHD ZAWAWI",
      "HUSNA AMIRA BINTI ISMAIL",
      "FAEDAH BERJIMAT CERMAT"
     ],
     [
      "",
      "CPT",
      "25 - 29 Mei",
      "",
      "",
      "",
      ""
     ],
     [
      "JUN",
      "CPT",
      "01 - 05 Jun",
      "",
      "",
      "",
      ""
     ],
     [
      "",
      "M19",
      "08 - 12 Jun",
      "Kumpulan 3",
      "NOR IDAYU BINTI NORDIN",
      "HAWA SYAHIRAH BINTI MOHD SAID",
      "SENTUHAN SELAMAT"
     ],
     [
      "",
      "M20",
      "15 - 19 Jun",
      "Kumpulan 4",
      "NURASYAHIRA BINTI BASIRUN",
      "ROSNAYA BINTI MAT ISA",
      "ADAB KETIKA DI DALAM KELAS"
     ],
     [
      "",
      "M21",
      "22 - 26 Jun",
      "Kumpulan 5",
      "NUR IZZAH ‘ATIRAH BINTI HUDALLAH",
      "DARSHINII A/P GUNASAGARAN",
      "MENGHORMATI WARGA SEKOLAH"
     ]
    ],
    "style": "navy",
    "numbered": false
   }
  ],
  "updatedAt": null
 },
 "jadual-bertugas-2": {
  "title": "JADUAL KUMPULAN GURU BERTUGAS",
  "subtitle": "MINGGU 22-43",
  "layout": "standard",
  "blocks": [
   {
    "id": "d8cb61c5dbc6",
    "type": "table",
    "columns": [
     "BULAN",
     "M",
     "TARIKH",
     "KUMPULAN",
     "KETUA (PAGI)",
     "KETUA (PETANG)",
     "CATATAN"
    ],
    "rows": [
     [
      "JULAI",
      "M22",
      "29 Jun - 03 Jul",
      "Kumpulan 1",
      "HAREENA A/P N. SIVAGANESE",
      "HAPINI BINTI ABDULL WAHAB",
      "SAYANGI KELUARGA"
     ],
     [
      "",
      "M23",
      "06 - 10 Jul",
      "Kumpulan 2",
      "NURAZIRA BINTI ABDULL HALIM",
      "NOR SUZERA BINTI ZAHARI",
      "MUHASABAH DIRI"
     ],
     [
      "",
      "M24",
      "13 - 17 Jul",
      "Kumpulan 3",
      "NORLAILA BINTI MOHD SALLEH",
      "KHARAINE BINTI CHE IBRAHIM",
      "SEMANGAT PATRIOTIK"
     ],
     [
      "",
      "M25",
      "20 - 24 Jul",
      "Kumpulan 4",
      "YETTE SURIANE BT. M. BAHARUDDIN",
      "SINNTHU A/P PONNUSAMY",
      "CINTA AKAN NEGARA"
     ],
     [
      "",
      "M26",
      "27 - 31 Jul",
      "Kumpulan 5",
      "NORAZAH BINTI AB AZIZ @ HAMID",
      "NOOR HAMIMI BINTI ABDUL AZIZ",
      "MENGHARGAI ALAM SEKITAR"
     ],
     [
      "OGOS",
      "M27",
      "03 - 07 Ogos",
      "Kumpulan 1",
      "NOORAZILA BINTI ABDULLAH",
      "NOOR ILLI BINTI ELAS",
      "SOPAN SANTUN TERHADAP GURU & RAKAN"
     ],
     [
      "",
      "M28",
      "10 - 14 Ogos",
      "Kumpulan 2",
      "MASLINA BINTI JAMIYOU@HJ ABDULLAH",
      "NORSABRINA BINTI HASSAN",
      "BUDAYA SENYUM & MEMBERI SALAM"
     ],
     [
      "",
      "M29",
      "17 - 21 Ogos",
      "Kumpulan 3",
      "NORASSKIN BINTI MOHAMED",
      "NASIHA BINTI MOHD SHARIF",
      "DISIPLIN DI KANTIN"
     ],
     [
      "",
      "M30",
      "24 - 28 Ogos",
      "Kumpulan 4",
      "NORASHIKIN BINTI AZIZ",
      "SITI MAZURA BINTI SHAIKH MUSTAFA",
      "JAUHI GEJALA NEGATIF"
     ],
     [
      "SEPTEMBER",
      "CP II",
      "31 Ogos - 04 Sep",
      "",
      "",
      "",
      ""
     ],
     [
      "",
      "M31",
      "07 - 11 Sep",
      "Kumpulan 5",
      "SITI SUHAILI BINTI ISMAIL",
      "NOR BAZRIANA BINTI BADRI",
      "BERSOPAN SANTUN SEMASA BERBICARA"
     ],
     [
      "",
      "M32",
      "14 - 18 Sep",
      "Kumpulan 1",
      "NORMALIZA BINTI RAMLI",
      "NUR INSYIRAH NAJWA BINTI OTHMAN",
      "KASIH SAYANG"
     ],
     [
      "",
      "M33",
      "21 - 25 Sep",
      "Kumpulan 2",
      "FAIZAH BINTI MOHD SAHAT",
      "SALME BINTI SENIK",
      "AKTIVITI SEMASA LAPANG"
     ],
     [
      "OKTOBER",
      "M34",
      "28 Sep - 02 Okt",
      "Kumpulan 3",
      "SARAH AQILAH BINTI JAMALULAIL",
      "NUR IZRIN FARAH HANI BINTI ISMAIL",
      "BIJAK TEKNOLOGI MAKLUMAT"
     ],
     [
      "",
      "M35",
      "05 - 09 Okt",
      "Kumpulan 4",
      "ROHAZLINDA BINTI ISSAHAK",
      "SITI RAFIDAH BINTI ABD RAHMAN",
      "KEBERSIHAN BILIK DARJAH"
     ],
     [
      "",
      "M36",
      "12 - 16 Okt",
      "Kumpulan 5",
      "SALEHA BINTI MOHD YUSOF",
      "NUR FATIN UMMAIRAQ BT. ABDUL HALIM",
      "HINDARI VANDALISME"
     ],
     [
      "",
      "M37",
      "19 - 23 Okt",
      "Kumpulan 1",
      "WAN NOOR HILWANI BT. WAN MOHAMED",
      "SHAREENA FATIHAH BINTI SHARIN",
      "BERSYUKUR"
     ],
     [
      "",
      "M38",
      "26 - 30 Okt",
      "Kumpulan 2",
      "RUZANA BINTI AHMAD",
      "SITI NORLIANA BINTI MOHD NOR",
      "SAYANGI KELUARGA"
     ],
     [
      "NOVEMBER",
      "M39",
      "02 - 06 Nov",
      "Kumpulan 3",
      "SITI ‘AISYAH BINTI JAMALUDIN",
      "SITI FAREZZA BINTI ABD MUIS",
      "RAJIN"
     ],
     [
      "",
      "M40",
      "09 - 13 Nov",
      "Kumpulan 4",
      "BHARATHI USHA A/P MARTHEVEERAN",
      "THIVANY A/P MANOGARAN",
      "MENGHORMATI KEPELBAGAIAN AGAMA"
     ],
     [
      "",
      "M41",
      "16 - 20 Nov",
      "Kumpulan 5",
      "ZATUSY SYAMAM BINTI SHARUDDIN",
      "SITI HAJAR BINTI AB HADI",
      "SOPAN SANTUN TERHADAP GURU & RAKAN"
     ],
     [
      "",
      "M42",
      "23 - 27 Nov",
      "Kumpulan 1",
      "RAHANA BINTI MOHAMAD KHATIB",
      "ZUBAIDAH BINTI DAUD KAIYIN",
      "BUDAYA SENYUM & MEMBERI SALAM"
     ],
     [
      "",
      "M43",
      "30 Nov - 04 Dis",
      "Kumpulan 2",
      "GRACE ANNE",
      "ZAHRAH BINTI MOHAMAD DAHLAN",
      "DISIPLIN DI KANTIN"
     ]
    ],
    "style": "navy",
    "numbered": false
   }
  ],
  "updatedAt": null
 },
 "jadual-bertugas-ppki": {
  "title": "JADUAL GURU BERTUGAS",
  "subtitle": "PPKI",
  "layout": "standard",
  "blocks": [
   {
    "id": "426c6278d4a9",
    "type": "table",
    "columns": [
     "BULAN",
     "M",
     "TARIKH",
     "GURU BERTUGAS"
    ],
    "rows": [
     [
      "JANUARI",
      "M1",
      "12 - 16 Jan",
      "Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani, Siti Noorehan Binti Mat Sa'im"
     ],
     [
      "",
      "M2",
      "19 - 23 Jan",
      "Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat, Nurul Syifaa' Bin Zainol"
     ],
     [
      "",
      "M3",
      "26 - 30 Jan",
      "Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman, Noryati Binti Ngah"
     ],
     [
      "FEBRUARI",
      "M4",
      "02 - 06 Feb",
      "Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi, Nur Aqilah Binti Khalit"
     ],
     [
      "",
      "M5",
      "09 - 13 Feb",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ],
     [
      "",
      "M6",
      "16 - 20 Feb",
      ""
     ],
     [
      "",
      "M7",
      "23 - 27 Feb",
      "Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat"
     ],
     [
      "MAC",
      "M8",
      "02 - 06 Mac",
      "Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman"
     ],
     [
      "",
      "M9",
      "09 - 13 Mac",
      "Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi"
     ],
     [
      "",
      "M10",
      "16 - 20 Mac",
      "Nur Aqilah Binti Khalit, Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud"
     ],
     [
      "",
      "CP I",
      "23 - 27 Mac",
      ""
     ],
     [
      "APRIL",
      "M11",
      "30 Mac - 03 Apr",
      "Siti Aisah Binti Abd Khani, Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan"
     ],
     [
      "",
      "M12",
      "06 - 10 Apr",
      "Wan Marfuza Binti Wan Mohd Fuat, Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh"
     ],
     [
      "",
      "M13",
      "13 - 17 Apr",
      "Tuan Norehan Binti Raja Othman, Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri"
     ],
     [
      "",
      "M14",
      "20 - 24 Apr",
      "Delsie Anak Dawi, Nur Aqilah Binti Khalit, Wan Nor Azian Bt Biduzodin"
     ],
     [
      "MEI",
      "M15",
      "27 Apr - 01 Mei",
      "Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani, Siti Noorehan Binti Mat Sa'im"
     ],
     [
      "",
      "M16",
      "04 - 08 Mei",
      "Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat, Nurul Syifaa' Binti Zainol"
     ],
     [
      "",
      "M17",
      "11 - 15 Mei",
      "Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman, Noryati Binti Ngah"
     ],
     [
      "",
      "M18",
      "18 - 22 Mei",
      "Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi, Nur Aqilah Binti Khalit"
     ],
     [
      "",
      "CPT",
      "25 - 29 Mei",
      ""
     ],
     [
      "JUN",
      "CPT",
      "01 - 05 Jun",
      ""
     ],
     [
      "",
      "M19",
      "08 - 12 Jun",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ],
     [
      "",
      "M20",
      "15 - 19 Jun",
      "Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat"
     ],
     [
      "",
      "M21",
      "22 - 26 Jun",
      "Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman"
     ],
     [
      "JULAI",
      "M22",
      "29 Jun - 03 Jul",
      "Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi"
     ],
     [
      "",
      "M23",
      "06 - 10 Jul",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ],
     [
      "",
      "M24",
      "13 - 17 Jul",
      "Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat"
     ],
     [
      "",
      "M25",
      "20 - 24 Jul",
      "Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman"
     ],
     [
      "",
      "M26",
      "27 - 31 Jul",
      "Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi"
     ],
     [
      "OGOS",
      "M27",
      "03 - 07 Ogos",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ],
     [
      "",
      "M28",
      "10 - 14 Ogos",
      "Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat"
     ],
     [
      "",
      "M29",
      "17 - 21 Ogos",
      "Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman"
     ],
     [
      "",
      "M30",
      "24 - 28 Ogos",
      "Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi"
     ],
     [
      "SEPTEMBER",
      "CP II",
      "31 Ogos - 04 Sep",
      ""
     ],
     [
      "",
      "M31",
      "07 - 11 Sep",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ],
     [
      "",
      "M32",
      "14 - 18 Sep",
      "Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat"
     ],
     [
      "",
      "M33",
      "21 - 25 Sep",
      "Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman"
     ],
     [
      "OKTOBER",
      "M34",
      "28 Sep - 02 Okt",
      "Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi"
     ],
     [
      "",
      "M35",
      "05 - 09 Okt",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ],
     [
      "",
      "M36",
      "12 - 16 Okt",
      "Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat"
     ],
     [
      "",
      "M37",
      "19 - 23 Okt",
      "Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman"
     ],
     [
      "",
      "M38",
      "26 - 30 Okt",
      "Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi"
     ],
     [
      "NOVEMBER",
      "M39",
      "02 - 06 Nov",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ],
     [
      "",
      "M40",
      "09 - 13 Nov",
      "Siti Noorehan Binti Mat Sa'im, Mohd Mazni Bin Mahasan, Wan Marfuza Binti Wan Mohd Fuat"
     ],
     [
      "",
      "M41",
      "16 - 20 Nov",
      "Nurul Syifaa' Binti Zainol, Tuan Mohd Khairi Bin Tuan Soh, Tuan Norehan Binti Raja Othman"
     ],
     [
      "",
      "M42",
      "23 - 27 Nov",
      "Noryati Binti Ngah, Siti Aisyah Ilyani Binti Bahri, Delsie Anak Dawi"
     ],
     [
      "",
      "M43",
      "30 Nov - 04 Dis",
      "Wan Nor Azian Bt Biduzodin, Mohd Hairos Bin Daud, Siti Aisah Binti Abd Khani"
     ]
    ],
    "style": "navy",
    "numbered": false
   }
  ],
  "updatedAt": null
 }
};
