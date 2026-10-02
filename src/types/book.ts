export type BlockType =
  | 'heading' | 'paragraph' | 'list' | 'table' | 'keyvalue' | 'image'
  | 'orgchart' | 'committee' | 'stafflist';

interface BaseBlock {
  id: string;
}
export interface HeadingBlock extends BaseBlock { type: 'heading'; text: string }
export interface ParagraphBlock extends BaseBlock { type: 'paragraph'; text: string }
export interface ListBlock extends BaseBlock { type: 'list'; ordered: boolean; items: string[] }
export interface TableBlock extends BaseBlock { type: 'table'; columns: string[]; rows: string[][] }
export interface KeyValueBlock extends BaseBlock { type: 'keyvalue'; pairs: { key: string; value: string }[] }
export interface ImageBlock extends BaseBlock { type: 'image'; src: string; caption: string }

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
}

/** Ahli jawatankuasa: rujukan guru, rujukan jawatan (automatik) atau teks bebas. */
export type MemberRef =
  | { kind: 'teacher'; id: string }
  | { kind: 'position'; value: string }
  | { kind: 'text'; value: string };
export interface CommitteeRow { id: string; role: string; members: MemberRef[] }
export interface CommitteeBlock extends BaseBlock { type: 'committee'; title: string; rows: CommitteeRow[] }

export interface StaffListBlock extends BaseBlock {
  type: 'stafflist';
  title: string;
  columns: string[];
  showPhoto: boolean;
  /** Tapis: medan + nilai yang dibenarkan (kosong = semua) */
  filterField: string;
  filterValues: string[];
}

/** Blok dalaman (tidak boleh ditambah pengguna): baris isi kandungan. */
export interface TocRowsBlock extends BaseBlock {
  type: 'tocrows';
  rows: { level: 0 | 1 | 2; title: string; page: number }[];
}

export type Block =
  | HeadingBlock | ParagraphBlock | ListBlock | TableBlock | KeyValueBlock | ImageBlock
  | OrgChartBlock | CommitteeBlock | StaffListBlock;
export type AnyBlock = Block | TocRowsBlock;

/** Jenis paparan halaman isi (layout). */
export type SectionLayout = 'standard' | 'twocol' | 'open' | 'notes';

export interface SectionContent {
  title: string;
  /** Dipaparkan sebagai lencana di jalur tajuk (cth. "SESI PAGI") */
  subtitle: string;
  layout: SectionLayout;
  blocks: Block[];
  updatedAt: number | null;
}

/** Struktur kandungan: bahagian utama → tajuk → subtajuk. */
export interface OutlineTopic { id: string; children: string[] }
export interface OutlinePart {
  id: string;
  title: string;
  /** Teks kecil di halaman partition (cth. nama penyelaras) */
  note: string;
  divider: boolean;
  topics: OutlineTopic[];
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
