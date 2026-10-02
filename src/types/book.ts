export type BlockType = 'heading' | 'paragraph' | 'list' | 'table' | 'keyvalue' | 'image';

interface BaseBlock {
  id: string;
  type: BlockType;
}
export interface HeadingBlock extends BaseBlock { type: 'heading'; text: string }
export interface ParagraphBlock extends BaseBlock { type: 'paragraph'; text: string }
export interface ListBlock extends BaseBlock { type: 'list'; ordered: boolean; items: string[] }
export interface TableBlock extends BaseBlock { type: 'table'; columns: string[]; rows: string[][] }
export interface KeyValueBlock extends BaseBlock { type: 'keyvalue'; pairs: { key: string; value: string }[] }
export interface ImageBlock extends BaseBlock { type: 'image'; src: string; caption: string }

export type Block = HeadingBlock | ParagraphBlock | ListBlock | TableBlock | KeyValueBlock | ImageBlock;

export interface SectionContent {
  title: string;
  subtitle: string;
  blocks: Block[];
  updatedAt: number | null;
}

export interface CoverContent {
  title: string;
  subtitle: string;
  motto: string;
  address: string;
  logo: string;
  updatedAt: number | null;
}

export interface BookExport {
  app: 'bpps2026';
  version: 1;
  exportedAt: string;
  profile: unknown;
  cover: CoverContent;
  sections: Record<string, SectionContent>;
}
