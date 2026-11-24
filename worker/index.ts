/**
 * Pelayan Portal Kemas Kini BPPS (Cloudflare Workers + Durable Object berasaskan SQLite).
 *
 * - Aset statik (penjana & portal) dihidangkan oleh Workers Assets; hanya /api/* sampai ke sini (run_worker_first).
 * - Semua data disimpan dalam SATU Durable Object ("bpps"): edisi yang diterbitkan, unit + kod akses, kiriman unit.
 * - Pentadbir log masuk dengan kata laluan rahsia ADMIN_PASSWORD (Cloudflare: Settings → Variables and Secrets).
 * - Unit log masuk dengan kod akses; hanya boleh menghantar kiriman bagi halaman unit sendiri.
 *
 * Reka bentuk menjimatkan CPU (pelan percuma): edisi diterbitkan berperingkat (kelompok kecil) dan disimpan sebagai
 * rentetan JSON mentah setiap halaman; respons portal dicantum tanpa menghurai semula keseluruhan buku.
 */
import { DurableObject } from 'cloudflare:workers';
import type { Decision, EditionMeta, PortalUnit, SubmissionSummary, UnitInput } from '../src/types/portal';
import { submissionStatus, unitSectionIds } from '../src/types/portal';

export interface Env {
  ASSETS: Fetcher;
  PORTAL: DurableObjectNamespace<PortalStore>;
  ADMIN_PASSWORD?: string;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const stub = env.PORTAL.get(env.PORTAL.idFromName('bpps'));
      return stub.fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

/* ------------------------------------------------------------------ pembantu */

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
/** Respons JSON yang telah dicantum sebagai rentetan (tanpa JSON.stringify semula). */
const rawJson = (body: string) => new Response(body, { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromB64url = (s: string) => atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
const sha256 = async (s: string) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(s)));

/** Perbandingan masa tetap. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = [...bytes].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]);
  return `${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}-${chars.slice(8, 12).join('')}`;
}
const normCode = (c: string) => c.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(.{4})(?=.)/g, '$1-');
const newId = () => b64url(crypto.getRandomValues(new Uint8Array(9)));

const SECTION_LAYOUTS = new Set(['standard', 'twocol', 'open', 'notes']);
const BLOCK_TYPES = new Set(['heading', 'paragraph', 'list', 'table', 'keyvalue', 'image', 'orgchart', 'orgtree', 'committee', 'stafflist', 'takwim']);

/** Semakan bentuk kandungan halaman yang dihantar unit (kandungan disemak pentadbir sebelum diterima). */
function checkSection(id: string, v: unknown): void {
  const s = v as Record<string, unknown>;
  if (!s || typeof s !== 'object') throw new HttpError(400, `Halaman ${id} tidak sah.`);
  if (typeof s.title !== 'string' || typeof s.subtitle !== 'string') throw new HttpError(400, `Tajuk halaman ${id} tidak sah.`);
  if (typeof s.layout !== 'string' || !SECTION_LAYOUTS.has(s.layout)) throw new HttpError(400, `Jenis halaman ${id} tidak sah.`);
  if (!Array.isArray(s.blocks) || s.blocks.length > 400) throw new HttpError(400, `Blok halaman ${id} tidak sah.`);
  for (const b of s.blocks as Record<string, unknown>[]) {
    if (!b || typeof b !== 'object' || typeof b.id !== 'string' || typeof b.type !== 'string' || !BLOCK_TYPES.has(b.type)) {
      throw new HttpError(400, `Blok dalam halaman ${id} tidak sah.`);
    }
  }
}

async function readBody<T>(request: Request, maxBytes: number): Promise<T> {
  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError(413, `Data terlalu besar (maks ${(maxBytes / 1_000_000).toFixed(0)} MB). Kecilkan gambar atau hantar beberapa halaman sahaja.`);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, 'Data JSON tidak sah.');
  }
}

/* ------------------------------------------------------------------ token */

interface TokenPayload { r: 'a' | 'u'; exp: number; ph?: string; uid?: string; cv?: number }
const ADMIN_TTL = 12 * 3600_000;
const UNIT_TTL = 30 * 24 * 3600_000;

/* ------------------------------------------------------------------ Durable Object */

const CHUNK = 100_000; // aksara setiap nilai storan
/** Maklumat edisi yang disimpan: + senarai ID halaman dan bilangan kelompok/rekod guru. */
type StoredMeta = EditionMeta & { sectionIds: string[]; teacherBatches: number; teacherCount: number };
type Store = DurableObjectStorage;

export class PortalStore extends DurableObject<Env> {
  private failures = new Map<string, { n: number; until: number }>();
  private keyPromise: Promise<CryptoKey> | null = null;

  private get store(): Store {
    return this.ctx.storage;
  }

  /* ---------- storan rentetan berpecah (nilai besar dipecah kepada beberapa kunci) */
  private async putStr(key: string, value: string) {
    await this.delStr(key);
    if (value.length <= CHUNK) {
      await this.store.put(key, value);
      return;
    }
    const n = Math.ceil(value.length / CHUNK);
    const entries: Record<string, unknown> = { [key]: { __chunks: n } };
    for (let i = 0; i < n; i++) entries[`${key}#${i}`] = value.slice(i * CHUNK, (i + 1) * CHUNK);
    await this.putMany(entries);
  }
  private async getStrs(keys: string[]): Promise<Map<string, string>> {
    const out = new Map<string, string>();
    const chunked: [string, number][] = [];
    for (let i = 0; i < keys.length; i += 128) {
      const got = await this.store.get<unknown>(keys.slice(i, i + 128));
      for (const [k, v] of got) {
        if (typeof v === 'string') out.set(k, v);
        else if (v && typeof v === 'object' && '__chunks' in v) chunked.push([k, (v as { __chunks: number }).__chunks]);
      }
    }
    for (const [k, n] of chunked) {
      const parts = await this.getStrs(Array.from({ length: n }, (_, i) => `${k}#${i}`));
      out.set(k, Array.from({ length: n }, (_, i) => parts.get(`${k}#${i}`) ?? '').join(''));
    }
    return out;
  }
  private async getStr(key: string) {
    return (await this.getStrs([key])).get(key) ?? null;
  }
  private async delStr(key: string) {
    const v = await this.store.get<unknown>(key);
    if (v && typeof v === 'object' && '__chunks' in v) {
      const n = (v as { __chunks: number }).__chunks;
      await this.deleteMany(Array.from({ length: n }, (_, i) => `${key}#${i}`));
    }
    await this.store.delete(key);
  }
  private async putMany(entries: Record<string, unknown>) {
    const all = Object.entries(entries);
    for (let i = 0; i < all.length; i += 128) await this.store.put(Object.fromEntries(all.slice(i, i + 128)));
  }
  private async deleteMany(keys: string[]) {
    for (let i = 0; i < keys.length; i += 128) await this.store.delete(keys.slice(i, i + 128));
  }
  private async deletePrefix(prefix: string) {
    const keys = [...(await this.store.list({ prefix })).keys()];
    await this.deleteMany(keys);
  }

  /* ---------- token */
  private hmacKey(): Promise<CryptoKey> {
    if (!this.keyPromise) {
      this.keyPromise = (async () => {
        let secret = await this.store.get<string>('meta:secret');
        if (!secret) {
          secret = b64url(crypto.getRandomValues(new Uint8Array(32)));
          await this.store.put('meta:secret', secret);
        }
        return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
      })();
    }
    return this.keyPromise;
  }
  private async sign(p: TokenPayload) {
    const body = b64url(enc.encode(JSON.stringify(p)));
    const sig = b64url(await crypto.subtle.sign('HMAC', await this.hmacKey(), enc.encode(body)));
    return `${body}.${sig}`;
  }
  private async verify(token: string): Promise<TokenPayload | null> {
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;
    const expect = b64url(await crypto.subtle.sign('HMAC', await this.hmacKey(), enc.encode(body)));
    if (!safeEqual(expect, sig)) return null;
    try {
      const p = JSON.parse(fromB64url(body)) as TokenPayload;
      return p.exp > Date.now() ? p : null;
    } catch {
      return null;
    }
  }
  private bearer(request: Request) {
    const h = request.headers.get('authorization') ?? '';
    return h.startsWith('Bearer ') ? h.slice(7) : '';
  }
  private async passwordHash() {
    const pw = this.env.ADMIN_PASSWORD;
    return pw ? (await sha256(`bpps:${pw}`)).slice(0, 16) : null;
  }
  private async requireAdmin(request: Request) {
    const ph = await this.passwordHash();
    if (!ph) throw new HttpError(503, 'Portal belum dikonfigurasi: tetapkan rahsia ADMIN_PASSWORD dalam Cloudflare.');
    const p = await this.verify(this.bearer(request));
    if (!p || p.r !== 'a' || p.ph !== ph) throw new HttpError(401, 'Sesi Pentadbir Sistem tamat. Sila log masuk semula.');
  }
  private async requireUnit(request: Request): Promise<PortalUnit> {
    const p = await this.verify(this.bearer(request));
    if (!p || p.r !== 'u' || !p.uid) throw new HttpError(401, 'Sesi tamat. Sila masukkan kod akses semula.');
    const unit = await this.store.get<PortalUnit>(`unit:${p.uid}`);
    if (!unit || !unit.active || unit.codeVer !== p.cv) throw new HttpError(401, 'Kod akses telah ditukar atau unit tidak aktif. Minta pautan baharu daripada Pentadbir Sistem.');
    return unit;
  }

  /* ---------- had cubaan log masuk */
  private throttle(request: Request) {
    const ip = request.headers.get('cf-connecting-ip') ?? 'local';
    const f = this.failures.get(ip);
    if (f && f.n >= 8 && f.until > Date.now()) throw new HttpError(429, 'Terlalu banyak cubaan. Cuba lagi selepas 15 minit.');
    return {
      fail: () => {
        const cur = this.failures.get(ip);
        const fresh = !cur || cur.until < Date.now();
        this.failures.set(ip, { n: fresh ? 1 : cur!.n + 1, until: Date.now() + 15 * 60_000 });
      },
      ok: () => this.failures.delete(ip),
    };
  }

  /* ---------- edisi */
  private async currentVersion() {
    return (await this.store.get<string>('ed:current')) ?? null;
  }
  private async editionMeta(): Promise<{ ver: string; meta: StoredMeta } | null> {
    const ver = await this.currentVersion();
    if (!ver) return null;
    const raw = await this.getStr(`ed:${ver}:meta`);
    return raw ? { ver, meta: JSON.parse(raw) } : null;
  }

  /* ---------- kiriman */
  private async summaries(): Promise<SubmissionSummary[]> {
    const list = await this.store.list<SubmissionSummary>({ prefix: 'subidx:' });
    return [...list.values()].sort((a, b) => b.createdAt - a.createdAt);
  }

  /* ------------------------------------------------------------------ penghala */
  async fetch(request: Request): Promise<Response> {
    try {
      return await this.route(request);
    } catch (e) {
      if (e instanceof HttpError) return json({ error: e.message }, e.status);
      console.error(e);
      return json({ error: 'Ralat pelayan. Cuba lagi.' }, 500);
    }
  }

  private async route(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '');
    const m = request.method;
    const seg = path.split('/').slice(2); // ['admin', 'units', ':id']

    if (path === '/api/health' && m === 'GET') {
      const ed = await this.editionMeta();
      return json({ ok: true, configured: !!this.env.ADMIN_PASSWORD, edition: ed ? { year: ed.meta.year, publishedAt: ed.meta.publishedAt } : null });
    }

    /* ----- pentadbir */
    if (path === '/api/admin/login' && m === 'POST') {
      const ph = await this.passwordHash();
      if (!ph) throw new HttpError(503, 'Portal belum dikonfigurasi: tetapkan rahsia ADMIN_PASSWORD dalam Cloudflare.');
      const t = this.throttle(request);
      const { password } = await readBody<{ password?: string }>(request, 10_000);
      const given = (await sha256(`bpps:${password ?? ''}`)).slice(0, 16);
      if (!safeEqual(given, ph)) {
        t.fail();
        throw new HttpError(401, 'Kata laluan salah.');
      }
      t.ok();
      const exp = Date.now() + ADMIN_TTL;
      return json({ token: await this.sign({ r: 'a', exp, ph }), exp });
    }

    if (seg[0] === 'admin') {
      await this.requireAdmin(request);
      return this.adminRoute(request, seg.slice(1), m);
    }

    /* ----- portal unit */
    if (path === '/api/portal/login' && m === 'POST') {
      const t = this.throttle(request);
      const { code } = await readBody<{ code?: string }>(request, 10_000);
      const uid = code ? await this.store.get<string>(`code:${normCode(code)}`) : undefined;
      const unit = uid ? await this.store.get<PortalUnit>(`unit:${uid}`) : undefined;
      if (!unit || !unit.active) {
        t.fail();
        throw new HttpError(401, 'Kod akses tidak sah atau unit tidak aktif.');
      }
      t.ok();
      const exp = Date.now() + UNIT_TTL;
      return json({ token: await this.sign({ r: 'u', exp, uid: unit.id, cv: unit.codeVer }), exp, unit: { id: unit.id, name: unit.name } });
    }
    if (path === '/api/portal/state' && m === 'GET') return this.portalState(await this.requireUnit(request));
    if (path === '/api/portal/submit' && m === 'POST') return this.portalSubmit(request, await this.requireUnit(request));

    throw new HttpError(404, 'Laluan tidak dijumpai.');
  }

  /* ------------------------------------------------------------------ pentadbir */
  private async adminRoute(request: Request, seg: string[], m: string): Promise<Response> {
    const [a, b] = seg;

    if (a === 'overview' && m === 'GET') {
      const ed = await this.editionMeta();
      const units = [...(await this.store.list<PortalUnit>({ prefix: 'unit:' })).values()].sort((x, y) => x.createdAt - y.createdAt);
      return json({
        edition: ed ? { year: ed.meta.year, publishedAt: ed.meta.publishedAt, sections: ed.meta.sectionIds.length, teachers: ed.meta.teacherCount ?? 0 } : null,
        units,
        submissions: await this.summaries(),
      });
    }

    /* Terbit edisi berperingkat: begin → sections (berkelompok) → teachers (berkelompok) → commit. */
    if (a === 'publish') {
      if (b === 'begin' && m === 'POST') {
        const ver = newId();
        await this.store.put('ed:staging', ver);
        return json({ ver });
      }
      const body = await readBody<{ ver: string; sections?: Record<string, unknown>; teachers?: unknown[]; index?: number; meta?: StoredMeta }>(request, 4_000_000);
      const staging = await this.store.get<string>('ed:staging');
      if (!body.ver || body.ver !== staging) throw new HttpError(409, 'Penerbitan lain sedang berjalan atau telah tamat. Cuba terbitkan semula.');
      if (b === 'sections' && m === 'POST') {
        for (const [id, sec] of Object.entries(body.sections ?? {})) await this.putStr(`ed:${body.ver}:sec:${id}`, JSON.stringify(sec));
        return json({ ok: true });
      }
      if (b === 'teachers' && m === 'POST') {
        await this.putStr(`ed:${body.ver}:staff:${body.index ?? 0}`, JSON.stringify(body.teachers ?? []));
        return json({ ok: true });
      }
      if (b === 'commit' && m === 'POST') {
        if (!body.meta || !Array.isArray(body.meta.outline) || !Array.isArray(body.meta.sectionIds)) throw new HttpError(400, 'Maklumat edisi tidak lengkap.');
        const meta = { ...body.meta, publishedAt: Date.now() };
        await this.putStr(`ed:${body.ver}:meta`, JSON.stringify(meta));
        const old = await this.currentVersion();
        await this.store.put('ed:current', body.ver);
        await this.store.delete('ed:staging');
        if (old && old !== body.ver) await this.deletePrefix(`ed:${old}:`);
        return json({ publishedAt: meta.publishedAt });
      }
    }

    /* Kemas kini beberapa halaman dalam edisi semasa (cth. selepas kiriman diterima). */
    if (a === 'edition' && b === 'sections' && m === 'PATCH') {
      const ed = await this.editionMeta();
      if (!ed) throw new HttpError(409, 'Tiada edisi diterbitkan.');
      const { sections } = await readBody<{ sections: Record<string, unknown> }>(request, 4_000_000);
      const ids = new Set(ed.meta.sectionIds);
      for (const [id, sec] of Object.entries(sections ?? {})) {
        await this.putStr(`ed:${ed.ver}:sec:${id}`, JSON.stringify(sec));
        ids.add(id);
      }
      await this.putStr(`ed:${ed.ver}:meta`, JSON.stringify({ ...ed.meta, sectionIds: [...ids] }));
      return json({ ok: true });
    }

    /* Unit & kod akses */
    if (a === 'units' && !b && m === 'POST') {
      const input = await readBody<UnitInput>(request, 50_000);
      const unit: PortalUnit = {
        id: newId(), name: String(input.name ?? '').trim() || 'Unit', coordinator: String(input.coordinator ?? '').trim(),
        partIds: Array.isArray(input.partIds) ? input.partIds.map(String) : [], sectionIds: Array.isArray(input.sectionIds) ? input.sectionIds.map(String) : [],
        code: newCode(), codeVer: 1, active: input.active !== false, createdAt: Date.now(), updatedAt: Date.now(),
      };
      await this.store.put({ [`unit:${unit.id}`]: unit, [`code:${unit.code}`]: unit.id });
      return json(unit);
    }
    if (a === 'units' && b) {
      const unit = await this.store.get<PortalUnit>(`unit:${b}`);
      if (!unit) throw new HttpError(404, 'Unit tidak dijumpai.');
      if (m === 'DELETE') {
        await this.store.delete([`unit:${b}`, `code:${unit.code}`]);
        return json({ ok: true });
      }
      if (m === 'PATCH') {
        const input = await readBody<Partial<UnitInput> & { regenerate?: boolean }>(request, 50_000);
        const next: PortalUnit = {
          ...unit,
          ...(input.name !== undefined ? { name: String(input.name).trim() || unit.name } : {}),
          ...(input.coordinator !== undefined ? { coordinator: String(input.coordinator).trim() } : {}),
          ...(Array.isArray(input.partIds) ? { partIds: input.partIds.map(String) } : {}),
          ...(Array.isArray(input.sectionIds) ? { sectionIds: input.sectionIds.map(String) } : {}),
          ...(input.active !== undefined ? { active: !!input.active } : {}),
          updatedAt: Date.now(),
        };
        if (input.regenerate) {
          await this.store.delete(`code:${unit.code}`);
          next.code = newCode();
          next.codeVer = unit.codeVer + 1;
          await this.store.put(`code:${next.code}`, next.id);
        }
        await this.store.put(`unit:${unit.id}`, next);
        return json(next);
      }
    }

    /* Kiriman */
    if (a === 'submissions' && b) {
      const sum = await this.store.get<SubmissionSummary>(`subidx:${b}`);
      if (!sum) throw new HttpError(404, 'Kiriman tidak dijumpai.');
      if (m === 'GET') {
        const keys = sum.sectionIds.map((id) => `sub:${b}:sec:${id}`);
        const raw = await this.getStrs(keys);
        const base = (await this.store.get<Record<string, number | null>>(`sub:${b}:base`)) ?? {};
        const secs = sum.sectionIds.filter((id) => raw.has(`sub:${b}:sec:${id}`)).map((id) => `${JSON.stringify(id)}:${raw.get(`sub:${b}:sec:${id}`)}`);
        return rawJson(`{${JSON.stringify(sum).slice(1, -1)},"base":${JSON.stringify(base)},"sections":{${secs.join(',')}}}`);
      }
      if (m === 'PATCH') {
        const { decisions } = await readBody<{ decisions: Record<string, Decision> }>(request, 50_000);
        const next: SubmissionSummary = { ...sum, decisions: { ...sum.decisions } };
        for (const [id, d] of Object.entries(decisions ?? {})) {
          if (!sum.sectionIds.includes(id)) continue;
          if (d === 'diterima' || d === 'ditolak') next.decisions[id] = d;
          else if ((d as unknown) === null) delete next.decisions[id];
        }
        next.reviewedAt = Date.now();
        await this.store.put(`subidx:${b}`, next);
        return json(next);
      }
      if (m === 'DELETE') {
        await this.deletePrefix(`sub:${b}:`);
        await this.store.delete(`subidx:${b}`);
        return json({ ok: true });
      }
    }

    throw new HttpError(404, 'Laluan tidak dijumpai.');
  }

  /* ------------------------------------------------------------------ portal unit */
  private async portalState(unit: PortalUnit): Promise<Response> {
    const ed = await this.editionMeta();
    if (!ed) throw new HttpError(409, 'Pentadbir Sistem belum menerbitkan buku ke portal. Cuba lagi kemudian.');
    const editable = unitSectionIds(unit, ed.meta.outline);
    const mine = (await this.summaries()).filter((s) => s.unitId === unit.id);
    // Halaman yang telah dihantar tetapi belum diputuskan - kiriman terbaharu dahulu.
    const pending = new Map<string, { submissionId: string; at: number }>();
    for (const s of mine) for (const id of s.sectionIds) if (!s.decisions[id] && !pending.has(id)) pending.set(id, { submissionId: s.id, at: s.createdAt });
    const pendingRaw = await this.getStrs([...pending].map(([id, p]) => `sub:${p.submissionId}:sec:${id}`));
    const secKeys = ed.meta.sectionIds.map((id) => `ed:${ed.ver}:sec:${id}`);
    const secRaw = await this.getStrs(secKeys);
    const staffRaw = await this.getStrs(Array.from({ length: ed.meta.teacherBatches }, (_, i) => `ed:${ed.ver}:staff:${i}`));
    const teachers = [...staffRaw.values()].map((s) => s.slice(1, -1)).filter((s) => s.trim()).join(',');
    const sections = ed.meta.sectionIds.filter((id) => secRaw.has(`ed:${ed.ver}:sec:${id}`)).map((id) => `${JSON.stringify(id)}:${secRaw.get(`ed:${ed.ver}:sec:${id}`)}`);
    const pend = [...pending]
      .filter(([id, p]) => pendingRaw.has(`sub:${p.submissionId}:sec:${id}`))
      .map(([id, p]) => `${JSON.stringify(id)}:{"submissionId":${JSON.stringify(p.submissionId)},"at":${p.at},"content":${pendingRaw.get(`sub:${p.submissionId}:sec:${id}`)}}`);
    const { sectionIds: _ids, teacherBatches: _tb, teacherCount: _tc, ...meta } = ed.meta;
    const unitInfo = { id: unit.id, name: unit.name, coordinator: unit.coordinator, sectionIds: editable };
    return rawJson(
      `{"unit":${JSON.stringify(unitInfo)},"history":${JSON.stringify(mine.slice(0, 30))},"pending":{${pend.join(',')}},` +
        `"edition":{"meta":${JSON.stringify(meta)},"teachers":[${teachers}],"sections":{${sections.join(',')}}}}`,
    );
  }

  private async portalSubmit(request: Request, unit: PortalUnit): Promise<Response> {
    const ed = await this.editionMeta();
    if (!ed) throw new HttpError(409, 'Tiada edisi diterbitkan.');
    const body = await readBody<{ submittedBy?: string; note?: string; sections?: Record<string, unknown>; base?: Record<string, number | null> }>(request, 8_000_000);
    const allowed = new Set(unitSectionIds(unit, ed.meta.outline));
    const entries = Object.entries(body.sections ?? {});
    if (!entries.length) throw new HttpError(400, 'Tiada halaman untuk dihantar.');
    if (entries.length > 120) throw new HttpError(400, 'Terlalu banyak halaman dalam satu kiriman.');
    const submittedBy = String(body.submittedBy ?? '').trim().slice(0, 120);
    if (!submittedBy) throw new HttpError(400, 'Sila isi nama penghantar.');
    for (const [id, sec] of entries) {
      if (!allowed.has(id)) throw new HttpError(403, `Halaman ${id} bukan di bawah unit ${unit.name}.`);
      checkSection(id, sec);
    }
    const id = `${Date.now().toString(36)}-${newId().slice(0, 6)}`;
    const sum: SubmissionSummary = {
      id, unitId: unit.id, unitName: unit.name, submittedBy, note: String(body.note ?? '').trim().slice(0, 2000), year: ed.meta.year,
      createdAt: Date.now(), sectionIds: entries.map(([sid]) => sid),
      titles: Object.fromEntries(entries.map(([sid, s]) => [sid, String((s as { title: string }).title).slice(0, 200)])),
      decisions: {},
    };
    for (const [sid, sec] of entries) await this.putStr(`sub:${id}:sec:${sid}`, JSON.stringify(sec));
    const base: Record<string, number | null> = {};
    for (const [sid] of entries) base[sid] = typeof body.base?.[sid] === 'number' ? body.base[sid]! : null;
    await this.store.put(`sub:${id}:base`, base);
    // Kiriman lama unit ini bagi halaman yang sama dan belum diputuskan → digantikan.
    for (const old of await this.summaries()) {
      if (old.unitId !== unit.id) continue;
      const hit = old.sectionIds.filter((sid) => !old.decisions[sid] && sum.sectionIds.includes(sid));
      if (!hit.length) continue;
      const next = { ...old, decisions: { ...old.decisions } };
      for (const sid of hit) next.decisions[sid] = 'diganti';
      await this.store.put(`subidx:${old.id}`, next);
    }
    await this.store.put(`subidx:${id}`, sum);
    return json({ ...sum, status: submissionStatus(sum) });
  }
}
