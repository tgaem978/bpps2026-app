/* Pelan sekolah ditaip semula sebagai jadual boleh sunting (menggantikan imej pelan daripada PDF).
 * Disalin daripada "Pelan Kelas / Pelan Laluan Kecemasan SK Bandar Tasik Selatan 2025" – sila semak kelas dan bilik sebelum cetak. */
import type { Block, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';

const SUB = 'MAKLUMAT SEKOLAH';
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const p = (text: string): Block => ({ id: uid(), type: 'paragraph', text, align: 'justify' });
const tbl = (columns: string[], rows: string[][]): Block => ({ id: uid(), type: 'table', style: 'navy', numbered: false, columns, rows });
const sec = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: SUB, layout: 'standard', blocks, updatedAt: null });

export const partMaklumatSections = (): Record<string, SectionContent> => ({
  'b-pelan': sec('PELAN SEKOLAH', [
    p('Pelan Kelas SK Bandar Tasik Selatan 2026 — kedudukan kelas dan bilik mengikut blok bangunan.'),
    h('Blok Hadapan (Atas)'),
    tbl(['TINGKAT / BARISAN', 'KELAS / BILIK'], [
      ['Tingkat atas (1)', '2 USM / 5 USM; 2 UM / 5 UM; 1 UM / 4 UM; 1 USM / 4 USM; Bilik Disiplin; Bilik Muzik'],
      ['Tingkat atas (2)', '1 UKM / 4 UKM; 1 UPM / 4 UPM; 1 UTM / 4 UTM; 1 UIAM / 4 UIAM; 1 UUM / 4 UUM; 1 UPSI / 4 UPSI'],
      ['Tingkat bawah (1)', 'Stor SPBT; Bilik B&K; Bilik Guru 2; Pusat Sumber; Bilik Media; Bilik Snozelen'],
      ['Tingkat bawah (2)', 'Kedai Buku; BOSD; Bilik PPKI; Dapur PPKI'],
      ['Berhampiran', 'Pra Sekolah (2 kelas); Taman Permainan Pra Sekolah; Bilik PPKI; Parking Khas; Taman; Pondok; Pos Pengawal; Pintu Pagar Utama'],
    ]),
    h('Blok Kiri'),
    tbl(['BAHAGIAN', 'KELAS / BILIK'], [
      ['Kelas', '2 UKM / 5 UKM; 2 UPM / 5 UPM; 2 UTM / 5 UTM; 2 UIAM / 5 UIAM'],
      ['Bilik', 'Makmal Sains 1; Makmal Sains 2; Bilik Guru 1; Bilik JQAF; Bilik Pemulihan; Bilik PSV; Bilik SU Peperiksaan; Bilik Akses; Stor Bagus; Stor PA; Dewan Terbuka; Astaka'],
    ]),
    h('Blok Bawah'),
    tbl(['BARISAN', 'KELAS / BILIK'], [
      ['Barisan atas', 'BWL; BWP; Surau; Bilik RBT; Stor Sukan; Bilik Kesihatan'],
      ['Barisan tengah', 'Pejabat Pentadbiran; Bilik Mesyuarat; Makmal Komputer'],
      ['Kelas', '2 UUM / 5 UUM; 2 UPSI / 5 UPSI; 3 UPSI / 6 UPSI; 3 UUM / 6 UUM; 3 UIAM / 6 UIAM; 3 UM / 6 UM; 3 UKM / 6 UKM; 3 UTM / 6 UTM; 3 UPM / 6 UPM; 3 USM / 6 USM'],
    ]),
    h('Kemudahan Lain'),
    tbl(['KEMUDAHAN', 'LOKASI'], [
      ['Kantin', 'Sebelah kanan bawah'],
      ['Bilik Pam Air', 'Sebelah kantin'],
      ['Gelanggang Bola Tampar', 'Tengah, berhampiran blok kiri'],
      ['Pili Bomba', 'Dua lokasi: sebelah kiri dan kanan kawasan tengah'],
      ['Pintu Pagar Padang', 'Sebelah kiri bawah'],
    ]),
  ]),
  'b-pelan-kecemasan': sec('PELAN KECEMASAN SEKOLAH', [
    p('Semasa kecemasan, semua warga sekolah hendaklah keluar dari kelas dan bilik melalui laluan terdekat menuju ke **Tempat Berkumpul Kecemasan**, iaitu kawasan lapang di tengah sekolah.'),
    tbl(['PERKARA', 'MAKLUMAT'], [
      ['Tempat Berkumpul Kecemasan', 'Kawasan lapang di tengah sekolah'],
      ['Pili Bomba', 'Dua lokasi: sebelah kiri dan kanan kawasan tengah'],
      ['Pintu pagar', 'Pintu Pagar Utama dan Pintu Pagar Padang'],
    ]),
  ]),
});
