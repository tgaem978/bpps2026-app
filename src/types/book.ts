export type BlockType =
  | 'heading' | 'paragraph' | 'list' | 'table' | 'keyvalue' | 'image'
  | 'orgchart' | 'orgtree' | 'committee' | 'stafflist' | 'takwim' | 'planner';

interface BaseBlock {
  id: string;
}
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
/** Tetapan teks: penjajaran, tebal, senget, garis bawah dan inden (aras, 1 aras = 7 mm). */
export interface TextFmt { align?: TextAlign; bold?: boolean; italic?: boolean; underline?: boolean; indent?: number }
export interface HeadingBlock extends BaseBlock, TextFmt { type: 'heading'; text: string }
export interface ParagraphBlock extends BaseBlock, TextFmt { type: 'paragraph'; text: string }
export interface ListBlock extends BaseBlock, TextFmt { type: 'list'; ordered: boolean; items: string[] }
/** Gaya jadual dokumen BPPS: 'navy' (kepala biru gelap, lajur BIL emas) atau 'gold' (kepala emas). */
export type TableStyle = 'navy' | 'gold';
export interface TableBlock extends BaseBlock, TextFmt {
  type: 'table'; columns: string[]; rows: string[][]; style?: TableStyle;
  /** Lebar setiap lajur data (peratus daripada lebar jadual; jumlah 100). Tiada = auto. */
  colWidths?: number[];
  /** Tinggi minimum setiap baris data (mm); 0 = auto. */
  rowHeights?: number[];
  /** Penjajaran ikut lajur (mengatasi penjajaran jadual); tiada = auto. */
  colAlign?: (TextAlign | undefined)[];
  /** Lajur BIL automatik (lalai: ya untuk gaya biru gelap). */
  numbered?: boolean;
  /** Lajur pertama berlatar emas (cth. jadual kumpulan bertugas). */
  firstCol?: 'gold';
  /** Jadual berpaut (cth. jadual guru bertugas): dijana automatik semasa paparan. */
  auto?: boolean;
}
export interface KeyValueBlock extends BaseBlock, TextFmt { type: 'keyvalue'; pairs: { key: string; value: string }[] }
export interface ImageBlock extends BaseBlock {
  type: 'image'; src: string; caption: string;
  /** Tinggi maksimum gambar (mm); lalai 70. */
  height?: number;
  /** Gambar mengisi satu halaman A4 penuh tanpa bingkai/tajuk BPPS (cth. halaman Pengenalan daripada PDF). */
  fullPage?: boolean;
  /** Gambar mengisi bingkai kandungan satu halaman (header & footer sistem kekal) — halaman Pengenalan. */
  frameFill?: boolean;
  /** Penanda bernombor di atas gambar (x, y = peratus lebar / tinggi gambar), cth. elemen lencana. */
  pins?: { n: number; x: number; y: number }[];
  /** Panel teks di sebelah kanan gambar (cth. falsafah & bentuk lencana). */
  aside?: { title: string; text: string; tone?: 'navy' | 'soft' }[];
}

/** Satu aras carta organisasi: diisi automatik daripada guru yang memegang jawatan tersebut. */
export interface OrgLevel {
  id: string;
  label: string;
  positions: string[];
  /** 'person' = kad bergambar seorang demi seorang; 'group' = satu kad per jawatan berserta senarai nama */
  display: 'person' | 'group';
}
export interface OrgChartBlock extends BaseBlock {
  type: 'orgchart';
  title: string;
  levels: OrgLevel[];
  /** Tapis ikut sesi ('' = semua) */
  session: string;
  /** Jawatan pentadbir yang diletakkan di tengah (templat carta PPKI), cth. 'GPK Hal Ehwal Murid'. */
  focus?: string;
  /** Nama pada kad: lalai tanpa bin/binti/a/l/a/p; `false` = kekalkan nama penuh. */
  cleanNames?: boolean;
}

/** Kotak dalam carta struktur: tajuk (huruf besar) + senarai titik pilihan (cth. "PENTADBIRAN AM" + bidang tugas). */
export interface OrgTreeBox { id: string; title: string; items: string[] }
/** Satu lajur carta struktur: kad bergambar pentadbir (automatik daripada Pangkalan Data Guru) + kotak di bawahnya. */
export interface OrgTreeColumn { id: string; position: string; boxes: OrgTreeBox[] }
/**
 * Carta struktur (format carta "Pengurusan & Pentadbiran"): Guru Besar di atas (kotak sisi pilihan, cth. PIBG),
 * pentadbir sebagai lajur, dan di bawah setiap pentadbir kotak-kotak unit/bidang tugas yang boleh disunting.
 */
export interface OrgTreeBlock extends BaseBlock {
  type: 'orgtree';
  title: string;
  /** Jawatan di puncak carta (lalai Guru Besar). */
  root: string;
  /** Kotak sisi yang bersambung kepada puncak (cth. PIBG). */
  side: string[];
  columns: OrgTreeColumn[];
  /** Nama pada kad: lalai tanpa bin/binti/a/l/a/p; `false` = kekalkan nama penuh. */
  cleanNames?: boolean;
}

/** Ahli jawatankuasa: rujukan guru (dengan nota tugas pilihan), rujukan jawatan (automatik) atau teks bebas. */
export type MemberRef =
  | { kind: 'teacher'; id: string; note?: string }
  | { kind: 'position'; value: string }
  | { kind: 'text'; value: string };
/** group = baris label kumpulan tanpa ahli (cth. "Ketua Guru Penasihat"). */
export interface CommitteeRow {
  id: string; role: string; members: MemberRef[]; group?: boolean;
  /** Carta bergambar: semua ahli baris ini dipaparkan dalam SATU kad (tajuk = peranan, nama disusun ke bawah). */
  stack?: boolean;
}
export interface CommitteeBlock extends BaseBlock {
  type: 'committee'; title: string; rows: CommitteeRow[];
  /** 'list' = senarai peranan (lalai); 'chart' = carta bergambar mengikut aras */
  display?: 'list' | 'chart';
  /** Papar kategori jawatan di sebelah nama (lalai: ya) */
  showPosition?: boolean;
  /** Carta bergambar: lalai buang bin/binti/a/l/a/p daripada nama pada kad; `false` = kekalkan nama penuh. */
  cleanNames?: boolean;
  /** Carta bergambar: mesti muat dalam SATU halaman (dipadatkan automatik jika perlu). */
  onePage?: boolean;
  /** Carta bergambar: jawatan pentadbir yang diletakkan di tengah aras pentadbir, cth. 'GPK Kokurikulum'. */
  focus?: string;
}

export interface StaffListBlock extends BaseBlock {
  type: 'stafflist';
  title: string;
  columns: string[];
  showPhoto: boolean;
  /** Tapis: medan + nilai yang dibenarkan (kosong = semua) */
  filterField: string;
  filterValues: string[];
  /** 'hierarki' = ikut susunan kategori jawatan; 'pentadbir' = pentadbir dahulu, lain ikut abjad; 'abjad' */
  sort?: 'hierarki' | 'pentadbir' | 'abjad';
}

export type TakwimDayKind = 'weekend' | 'holiday' | 'umum' | 'perayaan' | 'sekolah';

/** Takwim bulanan: baris harian dengan lajur unit; baris cuti/acara sekolah boleh merentas semua unit. */
export interface TakwimRow {
  week: string;
  date: string;
  day: string;
  /**
   * 'weekend' = Sabtu/Ahad; 'umum' = cuti kelepasan am; 'perayaan' = cuti perayaan tambahan KPM;
   * 'sekolah' = cuti persekolahan (penggal / pertengahan / akhir tahun); 'holiday' = cuti (umum, tanpa jenis).
   * Jenis cuti di sini juga menentukan serlahan warna halaman Kalendar.
   */
  kind?: TakwimDayKind;
  /** Teks merentas semua lajur unit (cuti / aktiviti seluruh sekolah) */
  span?: string;
  cells: string[];
}
export interface TakwimBlock extends BaseBlock {
  type: 'takwim'; title: string; columns: string[]; rows: TakwimRow[];
  /** Takwim Induk berpaut: lajur unit diisi automatik daripada Takwim Tahunan setiap unit (lihat lib/takwimLink.ts). */
  linked?: boolean;
}

/** Satu hari dalam Planner (dijana daripada Takwim Induk; tidak disimpan). */
export interface PlannerDay {
  d: number; dow: number; week: string;
  kind?: TakwimDayKind;
  /** Keterangan cuti / acara seluruh sekolah. */
  label?: string;
  /** Aktiviti unit: u = indeks lajur unit Takwim Induk. */
  acts: { u: number; t: string }[];
}
export interface PlannerMonth { year: number; month: number; units: string[]; days: PlannerDay[] }
/**
 * Planner guru bulanan (satu halaman sebulan): kalendar dengan hari cuti & aktiviti unit (automatik daripada Takwim Induk),
 * tarikh penting, senarai tugasan, jadual guru ganti (relief) dan catatan.
 */
export interface PlannerBlock extends BaseBlock {
  type: 'planner';
  /** Bulan 0-11. */
  month: number;
  /** Senarai tugasan (satu baris satu tugasan); baris kosong dicetak untuk ditulis tangan. */
  todo?: string[];
  /** Catatan bulan ini. */
  notes?: string;
  /** Data bulan (dijana semasa paparan daripada Takwim Induk; tidak disimpan). */
  plan?: PlannerMonth;
}

/** Blok dalaman (tidak boleh ditambah pengguna): baris isi kandungan. */
export interface TocRowsBlock extends BaseBlock {
  type: 'tocrows';
  rows: { level: 0 | 1 | 2; title: string; page: number; no?: number }[];
}

export type Block =
  | HeadingBlock | ParagraphBlock | ListBlock | TableBlock | KeyValueBlock | ImageBlock
  | OrgChartBlock | OrgTreeBlock | CommitteeBlock | StaffListBlock | TakwimBlock | PlannerBlock;
export type AnyBlock = Block | TocRowsBlock;

/** Jenis paparan halaman isi (layout). */
export type SectionLayout = 'standard' | 'twocol' | 'open' | 'notes';

/**
 * Status semakan bagi edisi tahunan baharu (cth. edisi 2027 disalin daripada 2026).
 * 'perlu' = halaman perlu dikemas kini untuk tahun tersebut; 'siap' = telah disemak / dikemas kini.
 */
export interface ReviewMark {
  year: number;
  status: 'perlu' | 'siap';
  /** Siapa yang menandakan siap (cth. "Penjana" atau "Portal · Unit HEM (Cikgu Ali)"). */
  by?: string;
  at?: number;
}

export interface SectionContent {
  title: string;
  /** Dipaparkan sebagai lencana di jalur tajuk (cth. "SESI PAGI") */
  subtitle: string;
  layout: SectionLayout;
  blocks: Block[];
  updatedAt: number | null;
  /** Status kemas kini edisi tahunan (tiada = tiada semakan diperlukan). */
  review?: ReviewMark;
}

/** Struktur kandungan: bahagian utama → tajuk → subtajuk. */
export interface OutlineTopic {
  id: string; children: string[];
  /** `false` = subtajuk topik ini tidak disenaraikan dalam Isi Kandungan (halaman sambungan bertajuk sama). */
  tocChildren?: boolean;
}
export interface OutlinePart {
  id: string;
  title: string;
  /** Teks kecil di halaman partition (cth. nama penyelaras) */
  note: string;
  divider: boolean;
  topics: OutlineTopic[];
  /** `false` = subtajuk (halaman sambungan) tidak disenaraikan dalam Isi Kandungan; hanya tajuk aras 1 (cth. Kurikulum, HEM, Kokurikulum). */
  tocChildren?: boolean;
}

export interface CoverContent {
  /** Reka bentuk kulit penuh (imej). Kosong = kulit dijana daripada teks. */
  image: string;
  title: string;
  subtitle: string;
  motto: string;
  address: string;
  logo: string;
  updatedAt: number | null;
  review?: ReviewMark;
}

export interface BookExport {
  app: 'bpps2026';
  version: 1 | 2;
  exportedAt: string;
  profile: unknown;
  cover: CoverContent;
  sections: Record<string, SectionContent>;
  outline?: OutlinePart[];
  staff?: unknown;
  master?: unknown;
}
