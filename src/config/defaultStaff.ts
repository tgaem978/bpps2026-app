import type { StaffField, Teacher } from '@/types/staff';
import { F_NAME, F_POSITION, F_SESSION } from '@/types/staff';

const base = import.meta.env.BASE_URL;

/** Susunan pilihan jawatan = susunan hierarki (digunakan untuk isihan & carta organisasi). */
export const POSITIONS = [
  'Guru Besar',
  'GPK Pentadbiran',
  'GPK Hal Ehwal Murid',
  'GPK Kokurikulum',
  'GPK Petang',
  'GPK Pendidikan Khas',
  'Guru Penyelaras Bestari',
  'Guru Perpustakaan dan Media',
  'Guru Data',
  'Guru Bimbingan dan Kaunseling',
  'Guru Akademik',
  'Guru Prasekolah',
  'Guru Pendidikan Khas',
  'Guru Pemulihan',
  'Pembantu Pengurusan Murid',
  'Pembantu Tadbir',
];

/** Senarai jawatan pentadbir (Guru Besar + GPK). */
export const ADMIN_POSITIONS = POSITIONS.slice(0, 6);

export const defaultFields = (): StaffField[] => [
  { id: F_NAME, label: 'Nama Penuh', type: 'text', options: [], locked: true },
  { id: F_POSITION, label: 'Jawatan', type: 'select', options: [...POSITIONS], locked: true },
  { id: F_SESSION, label: 'Sesi', type: 'select', options: ['Pagi', 'Petang'] },
  {
    id: 'opsyen',
    label: 'Opsyen',
    type: 'multi',
    options: [
      'Bahasa Melayu', 'Bahasa Inggeris', 'Matematik', 'Sains', 'Pendidikan Islam', 'Pendidikan Moral', 'Sejarah',
      'Pendidikan Jasmani & Kesihatan', 'Pendidikan Seni Visual', 'Pendidikan Muzik', 'Reka Bentuk & Teknologi',
      'Bahasa Arab', 'Bahasa Cina', 'Bahasa Tamil', 'Pendidikan Khas', 'Prasekolah', 'Bimbingan & Kaunseling', 'Pemulihan',
    ],
  },
  { id: 'telefon', label: 'No. Telefon', type: 'phone', options: [] },
];

const t = (id: string, name: string, position: string, session = '', photo = ''): Teacher => ({
  id,
  photo: photo ? `${base}staff/${photo}.jpg` : '',
  values: { [F_NAME]: name, [F_POSITION]: position, [F_SESSION]: session, opsyen: [], telefon: '' },
});

/** Data awal daripada BPPS 2026 SKBTS (carta organisasi induk). Boleh disunting sepenuhnya. */
export const defaultTeachers = (): Teacher[] => [
  t('gb', 'SHAMSUKAMAL BIN ANIFAR', 'Guru Besar', 'Pagi', 'gb'),
  t('pk-pentadbiran', 'ZALEHA BINTI YUSOH', 'GPK Pentadbiran', 'Pagi', 'pk-pentadbiran'),
  t('pk-hem', 'HASRE ADHA BIN MOHD HASSAN', 'GPK Hal Ehwal Murid', 'Pagi', 'pk-hem'),
  t('pk-koku', 'MUHAMMAD RIZAL BIN CHE DIN', 'GPK Kokurikulum', 'Pagi', 'pk-koku'),
  t('pk-petang', 'VINCENT NATHAN A/L IRATHAYA SAMI', 'GPK Petang', 'Petang', 'pk-petang'),
  t('pk-pkhas', 'SYAHIDA BINTI MOHAMED MOKHTAR', 'GPK Pendidikan Khas', 'Pagi', 'pk-pkhas'),
  t('g-bestari', 'ABDULLAH MUHAIMIN BIN AHAMAD', 'Guru Penyelaras Bestari'),
  t('g-pss', 'SARAH AQILAH BINTI JAMALULAIL', 'Guru Perpustakaan dan Media'),
  t('g-data', 'YETTE SURIANE BINTI MOHD BAHARUDDIN', 'Guru Data'),
  t('g-bk1', 'ZURIFAH BINTI ABD RAHMAN', 'Guru Bimbingan dan Kaunseling'),
  t('g-bk2', 'NUR FAKHIRA BINTI JALALUDDIN', 'Guru Bimbingan dan Kaunseling'),
  t('g-bk3', 'SITI NOR AINIYAH BINTI RIDAWI', 'Guru Bimbingan dan Kaunseling'),
  t('g-pra1', 'FARAH NUR IMANIAH BINTI MOHD SHUKRI', 'Guru Prasekolah'),
  t('g-pra2', 'ZULATUL AZRINA BINTI ZULKEFLI', 'Guru Prasekolah'),
];
