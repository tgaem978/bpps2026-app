import type { CommitteeBlock, MemberRef, StaffListBlock } from '@/types/book';
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

export interface ResolvedMember { name: string; position: string; photo: string; note: string; person: boolean }

export function resolveMembers(ctx: BookCtx, refs: MemberRef[]): ResolvedMember[] {
  const out: ResolvedMember[] = [];
  const of = (t: Teacher, note = ''): ResolvedMember => ({ name: nameOf(t), position: positionOf(t), photo: t.photo, note, person: true });
  for (const r of refs) {
    if (r.kind === 'text') out.push({ name: r.value, position: '', photo: '', note: '', person: false });
    else if (r.kind === 'teacher') {
      const t = ctx.teachers.find((x) => x.id === r.id);
      if (t) out.push(of(t, r.note ?? ''));
    } else {
      const list = byPosition(ctx, r.value);
      if (list.length) list.forEach((t) => out.push(of(t)));
      else out.push({ name: `[ ${r.value.toUpperCase()} ]`, position: r.value, photo: '', note: '', person: true });
    }
  }
  return out;
}

/** Kad carta jawatankuasa dan barisnya (satu baris = satu unit penomboran). */
export interface ChartCard extends ResolvedMember { role: string }
export interface ChartLine { cards: ChartCard[]; label: string; tierStart: boolean; lead: boolean }

/** Aras carta: peranan berawalan sama berada pada aras yang sama (cth. semua "Ketua Panitia ..."). */
const tierKey = (role: string) => {
  const w = role.toLowerCase().replace(/[^a-z0-9@&.\s]/g, ' ').split(/\s+/).filter(Boolean);
  return ['naib', 'ketua', 'penolong', 'pen.', 'timbalan', 'ahli'].includes(w[0] ?? '') ? w.slice(0, 2).join(' ') : w[0] ?? '';
};

export function committeeChartLines(b: CommitteeBlock, ctx: BookCtx, perLine = 5): ChartLine[] {
  const tiers: { label: string; key: string; cards: ChartCard[] }[] = [];
  for (const r of b.rows) {
    if (r.group) {
      tiers.push({ label: r.role, key: '#group', cards: [] });
      continue;
    }
    const cards = resolveMembers(ctx, r.members).map((m) => ({ ...m, role: r.role }));
    if (!cards.length) continue;
    const k = tierKey(r.role);
    const cur = tiers[tiers.length - 1];
    if (cur && (cur.key === '#group' || cur.key === k)) cur.cards.push(...cards);
    else tiers.push({ label: '', key: k, cards });
  }
  const lines: ChartLine[] = [];
  tiers.forEach((tier, ti) => {
    const n = tier.cards.length;
    const count = Math.max(1, Math.ceil(n / perLine));
    const size = Math.max(1, Math.ceil(n / count));
    for (let i = 0; i < count; i++) {
      lines.push({ cards: tier.cards.slice(i * size, i * size + size), label: i === 0 ? tier.label : '', tierStart: i === 0, lead: ti === 0 && n === 1 });
    }
  });
  return lines;
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
  { token: '{{nama_pendek}}', label: 'Nama pendek sekolah' },
  { token: '{{tahun}}', label: 'Tahun' },
  { token: '{{jawatan:Guru Besar}}', label: 'Nama Guru Besar' },
  { token: '{{jawatan:GPK Pentadbiran}}', label: 'Nama GPK Pentadbiran' },
  { token: '{{jumlah_guru}}', label: 'Jumlah guru' },
  { token: '{{bilangan:sesi=Pagi}}', label: 'Bilangan guru sesi pagi' },
];
