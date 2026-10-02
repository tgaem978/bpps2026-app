import type { Block, CoverContent, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { templateAssets } from '@/templates/bpps';

const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text });
const ul = (items: string[], ordered = false): Block => ({ id: uid(), type: 'list', ordered, items });
const tbl = (columns: string[], rows: string[][]): Block => ({ id: uid(), type: 'table', columns, rows });
const kv = (pairs: [string, string][]): Block => ({ id: uid(), type: 'keyvalue', pairs: pairs.map(([key, value]) => ({ key, value })) });

const section = (title: string, subtitle: string, blocks: Block[], divider = true, dividerNote = ''): SectionContent => ({
  title, subtitle, divider, dividerNote, blocks, updatedAt: null,
});

export const defaultCover = (): CoverContent => ({
  image: templateAssets.cover,
  title: 'BUKU PENGURUSAN SEKOLAH',
  subtitle: 'SESI AKADEMIK 2026',
  motto: 'BERWAWASAN | TEKUN | BERSEMANGAT',
  address: 'Jalan Bandar Tasik Selatan, 57000 Kuala Lumpur',
  logo: '',
  updatedAt: null,
});

/** Kandungan contoh untuk setiap bahagian buku (kecuali KULIT). Boleh disunting sepenuhnya. */
export const defaultSections = (): Record<string, SectionContent> => ({
  'kata-aluan': section('KATA ALUAN', 'GURU BESAR', [
    p('Assalamualaikum warahmatullahi wabarakatuh dan Salam Sejahtera.'),
    p('Syukur ke hadrat Ilahi kerana dengan izin-Nya Buku Panduan Pengurusan Sekolah 2026 ini berjaya diterbitkan. Buku ini menjadi rujukan utama warga sekolah dalam melaksanakan tugas dengan cekap, teratur dan berkesan.'),
    p('Saya menyeru semua warga sekolah agar menghayati visi dan misi sekolah serta bersama-sama memacu kecemerlangan murid.'),
    kv([['Nama', ''], ['Jawatan', 'Guru Besar']]),
  ], false),
  'maklumat-sekolah': section('MAKLUMAT SEKOLAH', '', [
    h('Profil Sekolah'),
    kv([
      ['Kod Sekolah', ''],
      ['Alamat', ''],
      ['No. Telefon', ''],
      ['E-mel', ''],
      ['Gred Sekolah', ''],
      ['Bilangan Murid', ''],
      ['Bilangan Guru', ''],
    ]),
    h('Visi'),
    p('Pendidikan Berkualiti Insan Terdidik Negara Sejahtera.'),
    h('Misi'),
    p('Melestarikan Sistem Pendidikan yang Berkualiti untuk Membangunkan Potensi Individu bagi Memenuhi Aspirasi Negara.'),
    h('Piagam Pelanggan'),
    ul(['Memberi layanan mesra dan profesional.', 'Menyediakan persekitaran pembelajaran yang selamat dan kondusif.']),
  ]),
  pentadbiran: section('PENGURUSAN PENTADBIRAN', '', [
    h('Barisan Pentadbir'),
    tbl(['Jawatan', 'Nama'], [
      ['Guru Besar', ''],
      ['Penolong Kanan Pentadbiran', ''],
      ['Penolong Kanan HEM', ''],
      ['Penolong Kanan Kokurikulum', ''],
      ['Penolong Kanan Pendidikan Khas', ''],
    ]),
    h('Jawatankuasa Utama'),
    ul(['Jawatankuasa Pengurusan Sekolah', 'Jawatankuasa Kewangan', 'Jawatankuasa Keselamatan']),
  ], true, '[ NAMA PK PENTADBIRAN ]'),
  kurikulum: section('PENGURUSAN KURIKULUM', '', [
    h('Objektif'),
    ul(['Meningkatkan pencapaian akademik murid.', 'Memastikan PdP berkualiti mengikut DSKP.'], true),
    h('Ketua Panitia'),
    tbl(['Mata Pelajaran', 'Ketua Panitia'], [['Bahasa Melayu', ''], ['Bahasa Inggeris', ''], ['Matematik', ''], ['Sains', '']]),
  ], true, '[ NAMA PK PENTADBIRAN ]'),
  hem: section('PENGURUSAN HAL EHWAL MURID', '', [
    h('Fokus Utama'),
    ul(['Disiplin murid', 'Kebajikan dan biasiswa', 'Kesihatan dan keselamatan', 'Bimbingan dan kaunseling']),
    h('Peraturan Am Murid'),
    ul(['Hadir ke sekolah sebelum 7.30 pagi.', 'Memakai pakaian seragam yang lengkap dan kemas.', 'Menghormati guru dan rakan.'], true),
  ], true, '[ NAMA PKHEM ]'),
  kokurikulum: section('PENGURUSAN KOKURIKULUM', '', [
    tbl(['Kategori', 'Aktiviti', 'Guru Penasihat'], [
      ['Unit Beruniform', 'Pengakap', ''],
      ['Kelab & Persatuan', 'Kelab Sains', ''],
      ['Sukan & Permainan', 'Bola Sepak', ''],
    ]),
    p('Hari kokurikulum: setiap Rabu, 2.00 petang hingga 3.30 petang.'),
  ], true, '[ NAMA PKKO ]'),
  'pendidikan-khas': section('PENDIDIKAN KHAS', 'PPKI', [
    p('Program ini menyediakan pendidikan yang inklusif dan bersesuaian dengan keperluan murid berkeperluan pendidikan khas (MBPK).'),
    kv([['Bilangan Murid', ''], ['Bilangan Guru', ''], ['Bilangan Kelas', '']]),
  ], true, '[ NAMA PKPPKI ]'),
  prasekolah: section('PRASEKOLAH', '', [
    p('Kelas prasekolah dikendalikan berdasarkan Kurikulum Standard Prasekolah Kebangsaan (KSPK).'),
    kv([['Bilangan Kelas', ''], ['Guru Prasekolah', ''], ['Pembantu Pengurusan Murid', '']]),
  ]),
  takwim: section('KALENDAR & TAKWIM SEKOLAH', '', [
    tbl(['Tarikh', 'Aktiviti', 'Unit'], [
      ['12 Jan 2026', 'Hari Pertama Persekolahan', 'Pentadbiran'],
      ['', 'Mesyuarat Agung PIBG', 'Pentadbiran'],
      ['', 'Kejohanan Olahraga Tahunan', 'Kokurikulum'],
      ['', 'Hari Anugerah Cemerlang', 'Kurikulum'],
    ]),
  ]),
  lampiran: section('LAMPIRAN', '', [
    ul(['Lampiran A: Borang Cuti Guru', 'Lampiran B: Borang Kebenaran Keluar Murid'], false),
  ]),
});
