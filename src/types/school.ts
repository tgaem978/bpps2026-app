/** Tema reka bentuk buku: 'klasik' (header/footer imej asal 2026) atau 'biru-emas' (navy & emas, gaya pelan bangunan - edisi 2027). */
export type BookTheme = 'klasik' | 'biru-emas';

export interface SchoolProfile {
  fullName: string;
  shortName: string;
  year: number;
  projectCode: string;
  logo?: string;
  theme?: BookTheme;
  /** Edisi salinan bagi tahun yang sama (cth. "2" → BPPS 2026(2)); tiada = edisi utama tahun itu. */
  edition?: string;
}
