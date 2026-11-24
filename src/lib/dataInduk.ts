/**
 * DATA INDUK GURU — dijana automatik daripada kandungan buku semasa.
 * Setiap kali kiriman Setiausaha Unit diterima oleh Pentadbir Sistem (Portal Kemas Kini), halaman buku berubah
 * dan jadual ini dikira semula: nama guru dikesan dalam jawatankuasa, jadual dan senarai setiap bahagian,
 * lalu tugasnya disusun mengikut komponen (Pentadbiran, Kurikulum, HEM, Kokurikulum, PPKI, Prasekolah, Lain-lain).
 */
import type { Block, OutlinePart, SectionContent } from '@/types/book';
import type { Teacher } from '@/types/staff';
import { F_POSITION, F_TASK } from '@/types/staff';
import { byPosition, nameOf, resolveMembers, valueText, type BookCtx } from '@/lib/resolve';

export type Komponen = 'pentadbiran' | 'kurikulum' | 'hem' | 'uniform' | 'kelab' | 'sukan' | 'rumah' | 'kokuLain' | 'ppki' | 'prasekolah' | 'lain';

export const KOMPONEN: { id: Komponen; label: string; group?: string }[] = [
  { id: 'pentadbiran', label: 'PENTADBIRAN' },
  { id: 'kurikulum', label: 'KURIKULUM' },
  { id: 'hem', label: 'HEM' },
  { id: 'uniform', label: 'BADAN BERUNIFORM', group: 'KOKURIKULUM' },
  { id: 'kelab', label: 'KELAB & PERSATUAN', group: 'KOKURIKULUM' },
  { id: 'sukan', label: 'SUKAN & PERMAINAN', group: 'KOKURIKULUM' },
  { id: 'rumah', label: 'RUMAH SUKAN', group: 'KOKURIKULUM' },
  { id: 'kokuLain', label: 'JK KOKURIKULUM', group: 'KOKURIKULUM' },
  { id: 'ppki', label: 'PPKI' },
  { id: 'prasekolah', label: 'PRASEKOLAH' },
  { id: 'lain', label: 'LAIN-LAIN' },
];

/** Nama rumah sukan rasmi; Jingga untuk guru PPKI. */
export const RUMAH_NAMES = ['Aurora', 'Buana', 'Purnama', 'Samudera', 'Suria', 'Jingga'] as const;

export interface Tugas { text: string; section: string; updatedAt: number | null; by?: string }
export interface DataIndukRow {
  teacher: Teacher;
  tugas: Record<Komponen, Tugas[]>;
  rumah: string;
  jumlah: number;
  lastAt: number | null;
  lastBy: string;
}

const PART_KOMPONEN: Record<string, Komponen> = {
  'p-pentadbiran': 'pentadbiran', 'p-kurikulum': 'kurikulum', 'p-hem': 'hem', 'p-koku': 'kokuLain',
  'p-pkhas': 'ppki', 'p-prasekolah': 'prasekolah',
};

/** Sub-komponen Kokurikulum mengikut halaman. */
function kokuSub(id: string, title: string): Komponen {
  const t = title.toUpperCase();
  if (/^kk-rumah/.test(id) || /RUMAH SUKAN|^RUMAH /.test(t)) return 'rumah';
  if (/^kk-jk-0[2-5]$/.test(id) || /BERUNIFORM|PENGAKAP|KADET|PUTERI ISLAM|PANDU PUTERI|BULAN SABIT|TUNAS/.test(t)) return 'uniform';
  if (/^kk-jk-0[6-9]$/.test(id) || /KELAB|PERSATUAN/.test(t)) return 'kelab';
  if (/^kk-jk-1[0-3]$/.test(id) || /^kk-pasukan|^kk-pembangunan-sukan/.test(id) || /SUKAN|PERMAINAN|JURULATIH|BOLA|OLAHRAGA|TAKRAW|RAGBI/.test(t)) return 'sukan';
  return 'kokuLain';
}

/* ------------------------------------------------------------------ padanan nama */
const EQUIV: [RegExp, string][] = [[/\b(MOHD|MOHAMAD|MOHAMED|MUHAMAD|MUHAMMAD|MUHD|MD)\b/g, 'MUHAMMAD'], [/\b(BT|BTE|BINTI)\b\.?/g, ' '], [/\b(BIN|B)\b\.?/g, ' '], [/\bA\/[LP]\b/g, ' ']];
export function normName(n: string): string {
  let s = n.toUpperCase().replace(/\(.*?\)/g, ' ').replace(/[‘’'`.]/g, '').replace(/@/g, ' ');
  for (const [re, to] of EQUIV) s = s.replace(re, to);
  return s.replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ').trim();
}
const tokens = (n: string) => new Set(normName(n).split(' ').filter((w) => w.length > 1));

export function makeMatcher(teachers: Teacher[]) {
  const idx = teachers.map((t) => ({ t, n: normName(nameOf(t)), k: tokens(nameOf(t)) }));
  const exact = new Map(idx.map((x) => [x.n, x.t]));
  return (raw: string): Teacher | null => {
    const clean = raw.replace(/\*\*/g, '').replace(/\((K|KETUA|PENGERUSI|S\/U|SU)\)/gi, '').trim();
    if (clean.split(/\s+/).length < 2) return null;
    const n = normName(clean);
    if (!n) return null;
    const hit = exact.get(n);
    if (hit) return hit;
    const k = tokens(clean);
    let best: Teacher | null = null; let score = 0;
    for (const x of idx) {
      let inter = 0; k.forEach((w) => { if (x.k.has(w)) inter++; });
      const s = inter / Math.max(k.size, x.k.size);
      if (s > score) { score = s; best = x.t; }
    }
    return score >= 0.75 ? best : null;
  };
}

const NAME_SPLIT = (v: string) => v.replace(/\*\*/g, '').split(/\n|;|,(?=\s*[A-Z][A-Z'’ ]{4,})/).map((x) => x.replace(/^\s*(\d+[.)]|[-•])\s*/, '').trim()).filter(Boolean);
const title = (s: string) => s.replace(/\*\*/g, '').trim().toLowerCase().replace(/(^|[\s(/&-])([a-z])/g, (_m, a: string, b: string) => a + b.toUpperCase()).replace(/\bJk\b/g, 'JK').replace(/\bPpki\b/g, 'PPKI').replace(/\bHem\b/g, 'HEM');
const ROLE_HEAD = /JAWATAN|PERANAN|TUGAS|PASUKAN|UNIT|KELAB|PERSATUAN|RUMAH|BIDANG|KUMPULAN|KELAS|PANITIA|MATA PELAJARAN|AKTIVITI|PERKARA/i;

/** Rumah sukan → nama rasmi (padanan warna lama boleh ditetapkan pengguna). */
export function rumahName(raw: string, map: Record<string, string>): string {
  const r = raw.replace(/^RUMAH\s+/i, '').trim();
  const direct = RUMAH_NAMES.find((x) => x.toUpperCase() === r.toUpperCase());
  if (direct) return direct;
  return map[r.toUpperCase()] || title(r);
}

export function buildDataInduk(ctx: BookCtx, sections: Record<string, SectionContent>, outline: OutlinePart[], rumahMap: Record<string, string> = {}): DataIndukRow[] {
  const match = makeMatcher(ctx.teachers);
  const rows = new Map<string, DataIndukRow>();
  const empty = (): Record<Komponen, Tugas[]> => Object.fromEntries(KOMPONEN.map((k) => [k.id, []])) as unknown as Record<Komponen, Tugas[]>;
  for (const t of ctx.teachers) rows.set(t.id, { teacher: t, tugas: empty(), rumah: '', jumlah: 0, lastAt: null, lastBy: '' });

  const add = (t: Teacher | null, k: Komponen, text: string, sid: string, sec: SectionContent) => {
    if (!t) return;
    const row = rows.get(t.id)!;
    const list = row.tugas[k];
    const clean = text.replace(/\s+/g, ' ').trim();
    if (!clean || list.some((x) => x.text === clean)) return;
    const by = sec.review?.by;
    list.push({ text: clean, section: sid, updatedAt: sec.updatedAt, by });
    if (sec.updatedAt && (!row.lastAt || sec.updatedAt > row.lastAt)) { row.lastAt = sec.updatedAt; row.lastBy = by ?? ''; }
  };

  const posCount = new Map<string, { t: Teacher; k: Komponen; role: string; n: number; sec: SectionContent; sid: string }>();
  for (const part of outline) {
    const base: Komponen = PART_KOMPONEN[part.id] ?? 'lain';
    for (const topic of part.topics) {
      for (const sid of [topic.id, ...topic.children]) {
        const sec = sections[sid];
        if (!sec) continue;
        const k = base === 'kokuLain' ? kokuSub(sid, sec.title) : base;
        let context = title(sec.title);
        for (const b of sec.blocks as Block[]) {
          if (b.type === 'heading') { if (b.text.trim()) context = title(b.text.split('|')[0]); continue; }
          if (b.type === 'committee') {
            const ctxName = title(b.title || sec.title);
            for (const r of b.rows) {
              // Pentadbir (melalui jawatan): dikira dan diringkaskan supaya lajur tidak dipenuhi puluhan baris.
              for (const m of r.members) {
                if (m.kind !== 'position') continue;
                for (const t of byPosition(ctx, m.value)) {
                  const key = `${t.id}|${k}|${title(r.role)}`;
                  const e = posCount.get(key) ?? { t, k, role: title(r.role), n: 0, sec, sid };
                  e.n += 1; posCount.set(key, e);
                }
              }
              const refs = r.members.filter((m) => m.kind !== 'position');
              const named = resolveMembers(ctx, refs);
              for (const m of named) {
                const names = m.person ? [m.name] : NAME_SPLIT(m.name);
                for (const nm of names) add(match(nm), k, `${title(r.role)} · ${ctxName}`, sid, sec);
              }
            }
            continue;
          }
          if (b.type === 'table') {
            // Senarai rekod umum (cth. ID DELIMA, jadual eRPH) yang memuatkan hampir semua guru bukan bidang tugas.
            const hits = new Set(b.rows.flatMap((row) => row.flatMap((c) => NAME_SPLIT(c ?? '').map((nm) => match(nm)?.id).filter(Boolean))));
            if (hits.size > ctx.teachers.length * 0.45 && !/KELAS|BERTUGAS|RUMAH/i.test(`${sec.title} ${b.columns.join(' ')}`)) continue;
            const kelas = /GURU KELAS/i.test(`${sec.title} ${context}`) || b.columns.some((c) => /^KELAS$/i.test(c.trim()));
            const roleCol = b.columns.findIndex((c) => ROLE_HEAD.test(c) && !/NAMA|GURU/i.test(c));
            const rumahCol = b.columns.findIndex((c) => /RUMAH/i.test(c));
            for (const row of b.rows) {
              const role = roleCol >= 0 ? row[roleCol]?.replace(/\*\*/g, '').trim() : '';
              row.forEach((cell, ci) => {
                if (ci === roleCol || !cell) return;
                for (const nm of NAME_SPLIT(cell)) {
                  const t = match(nm);
                  if (!t) continue;
                  const ketua = /\((K|KETUA)\)/i.test(nm) ? 'Ketua · ' : '';
                  if (k === 'rumah') {
                    const r = rows.get(t.id)!;
                    const house = /^RUMAH\s/i.test(sec.title) ? sec.title : rumahCol >= 0 ? row[rumahCol] ?? '' : '';
                    if (!r.rumah && house.trim()) r.rumah = rumahName(house, rumahMap);
                    if (ketua) add(t, k, `Ketua Rumah${r.rumah ? ` ${r.rumah}` : ''}`, sid, sec);
                  } else if (kelas && role) add(t, k, `Guru Kelas ${role.toUpperCase()}`, sid, sec);
                  else add(t, k, `${ketua}${role && role.length < 60 ? `${title(role)} · ` : ''}${context}`, sid, sec);
                }
              });
            }
            continue;
          }
          if (b.type === 'list') {
            for (const it of b.items) for (const nm of NAME_SPLIT(it.replace(/^[^:]{2,40}:\s*/, ''))) add(match(nm), k, context, sid, sec);
          }
        }
      }
    }
  }

  for (const e of posCount.values()) add(e.t, e.k, `${e.role} · ${e.n} jawatankuasa`, e.sid, e.sec);

  // Rumah sukan: guru PPKI → Jingga jika tiada dalam senarai rumah lain.
  for (const r of rows.values()) {
    const pos = valueText(r.teacher.values[F_POSITION]);
    if (!r.rumah && /Pendidikan Khas/i.test(pos)) r.rumah = 'Jingga';
    r.jumlah = KOMPONEN.reduce((a, k) => a + r.tugas[k.id].length, 0);
  }
  return [...rows.values()];
}

/** Baris CSV (Excel) untuk muat turun. */
export function dataIndukCsv(rows: DataIndukRow[], cols: { label: string; value: (r: DataIndukRow) => string }[]): string {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return '﻿' + [cols.map((c) => esc(c.label)).join(','), ...rows.map((r) => cols.map((c) => esc(c.value(r))).join(','))].join('\r\n');
}

export const jawatanOf = (t: Teacher) => valueText(t.values[F_TASK]) || valueText(t.values[F_POSITION]);
