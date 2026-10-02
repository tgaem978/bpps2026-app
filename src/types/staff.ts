/** Jenis medan pangkalan data guru. */
export type FieldType = 'text' | 'select' | 'multi' | 'phone';

export interface StaffField {
  id: string;
  label: string;
  type: FieldType;
  /** Pilihan untuk 'select' / 'multi'. Susunan pilihan jawatan = susunan hierarki. */
  options: string[];
  /** Medan teras tidak boleh dibuang (sistem bergantung padanya). */
  locked?: boolean;
}

export type FieldValue = string | string[];

export interface Teacher {
  id: string;
  /** URL atau data URL gambar (potret 4:5) */
  photo: string;
  values: Record<string, FieldValue>;
}

/** ID medan teras yang digunakan oleh penjana automatik. */
export const F_NAME = 'nama';
export const F_POSITION = 'jawatan';
export const F_SESSION = 'sesi';
export const F_TASK = 'tugas';
