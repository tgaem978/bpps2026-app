/* Bahagian PRASEKOLAH - struktur lengkap seperti bahagian unit lain (pengenalan, visi/misi, carta, maklumat kelas,
 * rutin harian, bidang tugas, takwim). Barisan pentadbir & guru prasekolah diisi automatik daripada Pangkalan Data Guru;
 * ruang lain (nama kelas, bilangan murid, masa rutin, tarikh) dibiarkan kosong untuk diisi melalui penjana atau Portal Kemas Kini.
 * Teks pengenalan/visi/tugas ialah cadangan berasaskan KSPK dan boleh disunting sepenuhnya. */
import type { Block, CommitteeRow, MemberRef, OutlineTopic, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';

const [GB, PKP, PKHEM, PKKO, PKPTG] = ADMIN_POSITIONS;
const GURU_PRA = 'Guru Prasekolah';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const ul = (items: string[], ordered = true): Block => ({ id: uid(), type: 'list', ordered, items });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });
const tbl = (columns: string[], rows: string[][], opts: Partial<Extract<Block, { type: 'table' }>> = {}): Block => ({
  id: uid(), type: 'table', style: 'navy', numbered: false, columns, rows, ...opts,
});
const pos = (...values: string[]): MemberRef[] => values.map((value) => ({ kind: 'position', value }));
const r = (role: string, members: MemberRef[] = []): CommitteeRow => ({ id: uid(), role, members });
const sec = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: '', layout: 'standard', blocks, updatedAt: null });

export const BULAN = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];

/** Takwim ringkas: [bulan, tarikh, program] - program sedia ada daripada Takwim Induk; baris lain kosong untuk diisi. */
const PROGRAM_PRA: Record<string, [string, string][]> = {
  JANUARI: [['7 Jan', 'Orientasi Murid Prasekolah (bersama Orientasi Tahun 1 & PPKI)'], ['', 'Taklimat Ibu Bapa / Penjaga Murid Prasekolah']],
  FEBRUARI: [['', 'Pentaksiran Awal Murid Prasekolah']],
  MEI: [['4 Mei', 'Pemeriksaan Kesihatan Murid PPKI & Prasekolah']],
  JULAI: [['23 Jul', 'Sukaneka Tahap 1, Prasekolah dan PPKI']],
  OKTOBER: [['', 'Pentaksiran Akhir & Laporan Perkembangan Murid Prasekolah']],
  NOVEMBER: [['25 Nov', 'Majlis Apresiasi Prasekolah']],
  DISEMBER: [['31 Dis', 'Orientasi Tahun 1 & Prasekolah Sesi Akademik Baharu']],
};

const takwimRows = (): string[][] =>
  BULAN.flatMap((b) => {
    const items = PROGRAM_PRA[b] ?? [['', '']];
    return items.map(([tarikh, prog], i) => [i === 0 ? b : '', tarikh, prog, '']);
  });

export const prasekolahTopics = (): OutlineTopic[] => [
  { id: 'prasekolah', children: ['pra-visi', 'pra-carta', 'pra-kelas', 'pra-rutin', 'pra-tugas', 'pra-takwim'] },
];

export const partPrasekolahSections = (): Record<string, SectionContent> => ({
  prasekolah: sec('PENGENALAN PRASEKOLAH', [
    p('Kelas prasekolah {{nama_pendek}} dikendalikan berdasarkan Kurikulum Standard Prasekolah Kebangsaan (KSPK) bagi murid berumur empat hingga enam tahun. Pendidikan prasekolah memberi penekanan kepada pembelajaran melalui bermain, perkembangan menyeluruh murid dari aspek jasmani, emosi, rohani, intelek dan sosial, serta kesediaan murid untuk memasuki Tahun 1.'),
    p('Pengurusan prasekolah diselaras oleh Unit Kurikulum di bawah {{jawatan:GPK Pentadbiran}} (Penolong Kanan Pentadbiran) dengan kerjasama Guru Prasekolah, Pembantu Pengurusan Murid (PPM) dan ibu bapa / penjaga.'),
    h('MAKLUMAT PRASEKOLAH'),
    kv([
      ['Penyelaras Prasekolah', ''],
      ['Guru Prasekolah', `{{jawatan:${GURU_PRA}}}`],
      ['Bilangan Guru Prasekolah', `{{bilangan:jawatan=${GURU_PRA}}}`],
      ['Bilangan Kelas', ''],
      ['Bilangan Murid', ''],
      ['Pembantu Pengurusan Murid', ''],
      ['Waktu Persekolahan', ''],
    ]),
  ]),
  'pra-visi': sec('VISI, MISI & OBJEKTIF PRASEKOLAH', [
    h('VISI'),
    p('Murid prasekolah yang ceria, sihat, berakhlak mulia dan bersedia sepenuhnya untuk ke Tahun 1.'),
    h('MISI'),
    p('Menyediakan pendidikan awal kanak-kanak yang berkualiti melalui pembelajaran berasaskan bermain dalam persekitaran yang selamat, kondusif dan menyeronokkan.'),
    h('OBJEKTIF'),
    ul([
      'Melaksanakan Kurikulum Standard Prasekolah Kebangsaan (KSPK) dengan berkesan mengikut tunjang pembelajaran.',
      'Membina asas kemahiran literasi, numerasi dan komunikasi murid.',
      'Memupuk nilai murni, sahsiah dan disiplin diri sejak awal.',
      'Mengembangkan potensi murid secara menyeluruh dari aspek jasmani, emosi, rohani, intelek dan sosial.',
      'Menjalin kerjasama erat dengan ibu bapa / penjaga dan komuniti dalam pendidikan murid.',
      'Menyediakan murid untuk peralihan yang lancar ke Tahun 1.',
    ]),
  ]),
  'pra-carta': sec('CARTA ORGANISASI PRASEKOLAH', [
    {
      id: uid(), type: 'committee', title: '', display: 'chart', focus: PKP,
      rows: [
        r('Pengerusi', pos(GB)),
        r('Timbalan Pengerusi', pos(PKP)),
        r('Naib Pengerusi', pos(PKHEM, PKKO, PKPTG)),
        r('Penyelaras Prasekolah', [{ kind: 'teacher', id: 't69' }]),
        r('Guru Prasekolah', pos(GURU_PRA)),
        { id: uid(), role: 'Pembantu Pengurusan Murid', members: [{ kind: 'teacher', id: 't118' }, { kind: 'teacher', id: 't119' }], stack: true },
      ],
    },
  ]),
  'pra-kelas': sec('MAKLUMAT KELAS & GURU PRASEKOLAH', [
    tbl(['NAMA KELAS', 'SESI', 'GURU PRASEKOLAH', 'PEMBANTU PENGURUSAN MURID', 'LELAKI', 'PEREMPUAN', 'JUMLAH'], [
      ['', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['**JUMLAH**', '', '', '', '', '', ''],
    ], { colWidths: [16, 10, 24, 24, 9, 9, 8] }),
    h('MAKLUMAT HUBUNGAN'),
    kv([['No. Telefon Kelas / Guru', ''], ['Waktu Ketibaan Murid', ''], ['Waktu Bersurai', ''], ['Catatan', '']]),
  ]),
  'pra-rutin': sec('JADUAL RUTIN HARIAN PRASEKOLAH', [
    p('Rutin harian disusun mengikut keperluan KSPK. Isikan masa mengikut jadual waktu kelas prasekolah sekolah ini.'),
    tbl(['MASA', 'RUTIN / AKTIVITI'], [
      ['', 'Ketibaan & sambutan murid, pemeriksaan kesihatan ringkas'],
      ['', 'Perhimpunan pagi / bacaan doa / aktiviti pagi (kalendar, cuaca, perbualan)'],
      ['', 'Aktiviti fizikal / Perkembangan Fizikal dan Estetika'],
      ['', 'Komunikasi Bahasa Melayu / Bahasa Inggeris'],
      ['', 'Rehat & makan (amalan kebersihan diri)'],
      ['', 'Sains dan Teknologi / Matematik Awal'],
      ['', 'Kerohanian, Sikap dan Nilai (Pendidikan Islam / Pendidikan Moral)'],
      ['', 'Kemanusiaan / aktiviti kreativiti dan bermain'],
      ['', 'Rumusan, refleksi & persediaan bersurai'],
      ['', 'Bersurai (diserahkan kepada ibu bapa / penjaga)'],
    ], { colWidths: [22, 78] }),
  ]),
  'pra-tugas': sec('BIDANG TUGAS GURU & PEMBANTU PENGURUSAN MURID PRASEKOLAH', [
    h('Guru Prasekolah'),
    ul([
      'Merancang dan melaksanakan PdP mengikut Kurikulum Standard Prasekolah Kebangsaan (KSPK).',
      'Melaksanakan pentaksiran prasekolah dan merekod perkembangan murid secara berterusan.',
      'Mengurus pendaftaran, rekod kehadiran dan data murid prasekolah.',
      'Menyediakan persekitaran pembelajaran yang selamat, ceria dan kondusif termasuk sudut pembelajaran.',
      'Mengurus inventori peralatan, bahan PdP dan aset kelas prasekolah.',
      'Memastikan pengurusan makanan murid dan amalan kebersihan dilaksanakan dengan baik.',
      'Berhubung dengan ibu bapa / penjaga tentang perkembangan murid dan aktiviti kelas.',
      'Menyediakan laporan prasekolah yang diperlukan oleh pihak sekolah, PPD dan JPN.',
    ]),
    h('Pembantu Pengurusan Murid (PPM) Prasekolah'),
    ul([
      'Membantu guru dalam aktiviti PdP, penyediaan bahan dan pengurusan bilik darjah.',
      'Menjaga keselamatan murid semasa ketibaan, rehat, aktiviti luar dan bersurai.',
      'Membantu murid dalam urus diri seperti makan, ke tandas dan kebersihan diri.',
      'Menyediakan, menghidang dan mengurus makanan murid serta kebersihan ruang makan.',
      'Memastikan kebersihan dan kekemasan kelas serta peralatan prasekolah.',
      'Melaksanakan tugas lain yang diarahkan oleh Guru Prasekolah dan pentadbir.',
    ]),
  ]),
  'pra-takwim': sec('TAKWIM TAHUNAN PRASEKOLAH', [
    tbl(['BULAN', 'TARIKH', 'PROGRAM / AKTIVITI', 'TINDAKAN'], takwimRows(), { colWidths: [16, 14, 48, 22] }),
  ]),
});
