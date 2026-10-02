import type { MemberRef, StaffListBlock } from '@/types/book';
import type { FieldValue, StaffField, Teacher } from '@/types/staff';
import { F_NAME, F_POSITION } from '@/types/staff';
import type { SchoolProfile } from '@/types/school';

/**
 * Konteks data untuk penjanaan automatik halaman (pangkalan data guru + profil sekolah).
 * Dihantar sebagai prop kepada BlockView supaya pengukur halaman (render statik) dan
 * paparan biasa menggunakan data yang sama.
 */
export interface BookCtx {
  fields: StaffField[];
  teachers: Teacher[];
  profile: SchoolProfile;
}

export const valueText = (v: FieldValue | undefined): string => (Array.isArray(v) ? v.join(', ') : v ?? '');
export const nameOf = (t: Teacher) => valueText(t.values[F_NAME]) || '(Tanpa nama)';
export const positionOf = (t: Teacher) => valueText(t.values[F_POSITION]);

/** Kedudukan hierarki: ikut susunan pilihan medan jawatan. */
export function rankOf(ctx: BookCtx, t: Teacher): number {
  const opts = ctx.fields.find((f) => f.id === F_POSITION)?.options ?? [];
  const i = opts.indexOf(positionOf(t));
  return i < 0 ? opts.length : i;
}

export function sortTeachers(ctx: BookCtx, list: Teacher[]): Teacher[] {
  return [...list].sort((a, b) => rankOf(ctx, a) - rankOf(ctx, b) || nameOf(a).localeCompare(nameOf(b), 'ms'));
}

export const byPosition = (ctx: BookCtx, position: string, session = '') =>
  sortTeachers(
    ctx,
    ctx.teachers.filter((t) => positionOf(t) === position && (!session || valueText(t.values.sesi) === session)),
  );

export interface ResolvedMember { name: string; position: string; photo: string }

export function resolveMembers(ctx: BookCtx, refs: MemberRef[]): ResolvedMember[] {
  const out: ResolvedMember[] = [];
  for (const r of refs) {
    if (r.kind === 'text') out.push({ name: r.value, position: '', photo: '' });
    else if (r.kind === 'teacher') {
      const t = ctx.teachers.find((x) => x.id === r.id);
      if (t) out.push({ name: nameOf(t), position: positionOf(t), photo: t.photo });
    } else {
      const list = byPosition(ctx, r.value);
      if (list.length) list.forEach((t) => out.push({ name: nameOf(t), position: positionOf(t), photo: t.photo }));
      else out.push({ name: `[ ${r.value.toUpperCase()} ]`, position: r.value, photo: '' });
    }
  }
  return out;
}

export function staffRows(ctx: BookCtx, b: StaffListBlock): Teacher[] {
  const list = b.filterField && b.filterValues.length
    ? ctx.teachers.filter((t) => {
        const v = t.values[b.filterField];
        const vals = Array.isArray(v) ? v : [v ?? ''];
        return vals.some((x) => b.filterValues.includes(x));
      })
    : ctx.teachers;
  if (b.sort === 'abjad') return [...list].sort((x, y) => nameOf(x).localeCompare(nameOf(y), 'ms'));
  if (b.sort === 'pentadbir') {
    const admins = new Set(ctx.fields.find((f) => f.id === F_POSITION)?.options.slice(0, 6) ?? []);
    const r = (t: Teacher) => (admins.has(positionOf(t)) ? rankOf(ctx, t) : 99);
    return [...list].sort((x, y) => r(x) - r(y) || nameOf(x).localeCompare(nameOf(y), 'ms'));
  }
  return sortTeachers(ctx, list);
}

/**
 * Token dalam teks yang diganti secara automatik:
 * {{nama_sekolah}} {{nama_pendek}} {{tahun}} {{jumlah_guru}} {{jawatan:Guru Besar}} {{bilangan:sesi=Pagi}}
 */
export function resolveTokens(text: string, ctx: BookCtx): string {
  if (!text.includes('{{')) return text;
  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (all, expr: string) => {
    const [key, arg = ''] = expr.split(/:(.*)/s).map((s) => s.trim());
    switch (key) {
      case 'nama_sekolah': return ctx.profile.fullName;
      case 'nama_pendek': return ctx.profile.shortName;
      case 'tahun': return String(ctx.profile.year);
      case 'jumlah_guru': return String(ctx.teachers.length);
      case 'jawatan': {
        const names = byPosition(ctx, arg).map(nameOf);
        return names.length ? names.join(', ') : `[ ${arg.toUpperCase()} ]`;
      }
      case 'bilangan': {
        const [field, value] = arg.split('=').map((s) => s.trim());
        return String(ctx.teachers.filter((t) => {
          const v = t.values[field];
          return Array.isArray(v) ? v.includes(value) : v === value;
        }).length);
      }
      default: return all;
    }
  });
}

/** Token yang dicadangkan dalam penyunting. */
export const tokenHelp: { token: string; label: string }[] = [
  { token: '{{nama_sekolah}}', label: 'Nama sekolah' },
  { token: '{{tahun}}', label: 'Tahun' },
  { token: '{{jawatan:Guru Besar}}', label: 'Nama Guru Besar' },
  { token: '{{jawatan:GPK Pentadbiran}}', label: 'Nama GPK Pentadbiran' },
  { token: '{{jumlah_guru}}', label: 'Jumlah guru' },
  { token: '{{bilangan:sesi=Pagi}}', label: 'Bilangan guru sesi pagi' },
];
