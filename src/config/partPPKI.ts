/* Pendidikan Khas (PPKI): carta organisasi ditaip semula sebagai carta jawatankuasa boleh sunting (gambar diambil daripada
 * Pangkalan Data Guru) dan jadual nama. Menggantikan halaman imej daripada PDF. */
import type { Block, CommitteeRow, MemberRef, SectionContent } from '@/types/book';
import { uid } from '@/lib/blocks';
import { ADMIN_POSITIONS } from '@/config/defaultStaff';
import { member } from '@/config/partKoku';

const [GB, PKP, PKHEM, PKKO, PKPTG, PKPK] = ADMIN_POSITIONS;
const SUB = 'PPKI';

/** Ahli dipadankan dengan Pangkalan Data Guru; jawatan/tugas dalam carta dipaparkan sebagai nota. */
const who = (name: string, note?: string): MemberRef => {
  const m = member(name);
  if (!note) return m;
  return m.kind === 'teacher' ? { ...m, note } : { kind: 'text', value: `${name} (${note})` };
};
const row = (role: string, ...members: MemberRef[]): CommitteeRow => ({ id: uid(), role, members });
const posRow = (role: string, ...positions: string[]): CommitteeRow => ({ id: uid(), role, members: positions.map((value): MemberRef => ({ kind: 'position', value })) });
const chart = (rows: CommitteeRow[]): Block => ({ id: uid(), type: 'committee', title: '', display: 'chart', focus: PKPK, rows });
const h = (text: string): Block => ({ id: uid(), type: 'heading', text });
const tbl = (columns: string[], rows: string[][], numbered = true): Block => ({ id: uid(), type: 'table', style: 'navy', numbered, columns, rows });
const sec = (title: string, blocks: Block[]): SectionContent => ({ title, subtitle: SUB, layout: 'open', blocks, updatedAt: null });

export const partPpkiSections = (): Record<string, SectionContent> => ({
  'pk-jpks': sec('JAWATANKUASA PENDIDIKAN KHAS SEKOLAH (JPKS) 2026', [
    chart([
      posRow('Pengerusi', GB),
      posRow('Setiausaha & Penolong Kanan', PKKO, PKP, PKPK, PKHEM, PKPTG),
      row('Naib Setiausaha', who('TUAN NOREHAN BINTI RAJA OTHMAN')),
    ]),
    h('Ahli Jawatankuasa'),
    tbl(['NAMA', 'JAWATAN / TUGAS'], [
      ['ZURIFAH BINTI ABD RAHMAN', 'Guru Bimbingan Kaunseling'],
      ['SAIFUL NAZRI BIN ABDUL JABBAR', 'Ketua Guru Disiplin'],
      ["NURUL SYIFAA' BINTI ZAINOL", 'Penyelaras Pendidikan Inklusif'],
      ['HAPINI BINTI ABDUL WAHAB', 'Guru Pemulihan'],
      ['ROSLEEN BIN ABU BAKAR', 'Guru PJK'],
      ['MUHAMAD ALIF BIN KAMAL AFFANDI', 'Guru PJK'],
      ['SITI FAREZZA BINTI ABD MUIS', 'Guru Pendidikan Muzik'],
      ['NORLIANA BINTI MOHD NOR', 'Guru PSV'],
      ['ABG ABDULLAH BIN ABG JOSMANI', 'Pengerusi Biro PKhas'],
    ]),
  ]),
  'pk-carta': sec('CARTA ORGANISASI PROGRAM PENDIDIKAN KHAS INTEGRASI 2026', [
    chart([
      posRow('Pengerusi', GB),
      posRow('Penolong Kanan', PKKO, PKP, PKPK, PKHEM, PKPTG),
      row('Setiausaha Pentadbiran', who('TUAN NOREHAN BINTI RAJA OTHMAN')),
      row('Setiausaha Kurikulum', who('SITI AISYAH ILYANI BINTI BAHRI')),
      row('Setiausaha Hal Ehwal Murid', who('NORYATI BINTI NGAH')),
      row('Setiausaha Kokurikulum', who('MOHD HAIROS BIN DAUD')),
    ]),
    h('Guru Pendidikan Khas'),
    tbl(['NAMA', 'JAWATAN'], [
      ['WAN MARFUZA BT WAN MOHD FUAT', 'Guru Pendidikan Khas'],
      ['SITI AISAH BINTI ABD KHANI', 'Guru Pendidikan Khas'],
      ['WAN NOR AZIAN BT BIDUZODIN', 'Guru Pendidikan Khas'],
      ["NURUL SYIFAA' BINTI ZAINOL", 'Guru Pendidikan Khas'],
      ["SITI NOOREHAN BINTI SA'IM", 'Guru Pendidikan Khas'],
      ['MOHD MAZNI BIN MAHASAN', 'Guru Pendidikan Khas'],
      ['DELSIE ANAK DAWI', 'Guru Pendidikan Khas'],
      ['TUAN MOHD KHAIRI BIN TUAN SOH', 'Guru Pendidikan Islam'],
      ['NUR AQILAH BINTI KHALIT', 'Guru Pendidikan Islam'],
    ]),
    h('Pembantu Pengurusan Murid'),
    tbl(['NAMA', 'JAWATAN'], [
      ['NORHANA BINTI HAWARI', 'Pembantu Pengurusan Murid'],
      ['NOR HAZURA BINTI', 'Pembantu Pengurusan Murid'],
      ['NUR ASNIDA BINTI AHMAD SAZALI', 'Pembantu Pengurusan Murid'],
      ['NURUL AINI BINTI ZULRAHMAN', 'Pembantu Pengurusan Murid'],
      ['MOHAMMAD FAIZAL B MOHD NOR', 'Pembantu Pengurusan Murid'],
      ['MOHD ZAHRI BIN LONG', 'Pembantu Pengurusan Murid'],
    ]),
  ]),
  'pk-jk-induk': sec('JAWATANKUASA INDUK PROGRAM PENDIDIKAN KHAS INTEGRASI 2026', [
    chart([
      posRow('Pengerusi', GB),
      posRow('Naib Pengerusi', PKKO, PKP, PKPK, PKHEM, PKPTG),
      row('Setiausaha Pentadbiran', who('TUAN NOREHAN BINTI RAJA OTHMAN')),
      row('Setiausaha Kurikulum', who('SITI AISYAH ILYANI BINTI BAHRI')),
      row('Setiausaha Hal Ehwal Murid', who('NORYATI BINTI NGAH')),
      row('Setiausaha Kokurikulum', who('MOHD HAIROS BIN DAUD')),
    ]),
  ]),
});
