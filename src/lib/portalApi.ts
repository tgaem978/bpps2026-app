/* Klien API Portal Kemas Kini (pelayan: worker/index.ts). */
import type { AdminOverview, Decision, EditionMeta, HealthInfo, PortalState, PortalUnit, Submission, SubmissionSummary, UnitInput } from '@/types/portal';
import type { SectionContent } from '@/types/book';
import { useBookStore } from '@/stores/bookStore';
import { useProjectStore } from '@/stores/projectStore';
import { useStaffStore } from '@/stores/staffStore';
import { useMasterStore } from '@/stores/masterStore';
import { allIds } from '@/lib/outline';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface Session { token: string; exp: number }
const ADMIN_KEY = 'bpps-portal-admin';
const UNIT_KEY = 'bpps-portal-unit';

const readSession = (key: string): Session | null => {
  try {
    const s = JSON.parse(localStorage.getItem(key) ?? 'null') as Session | null;
    return s && s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
};
const writeSession = (key: string, s: Session | null) => {
  try {
    if (s) localStorage.setItem(key, JSON.stringify(s));
    else localStorage.removeItem(key);
  } catch {
    /* storan disekat - sesi kekal dalam memori sahaja */
  }
};

async function call<T>(path: string, opts: { method?: string; body?: unknown; session?: string } = {}): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.session) {
    const s = readSession(opts.session);
    if (s) headers.authorization = `Bearer ${s.token}`;
  }
  let res: Response;
  try {
    res = await fetch(path, { method: opts.method ?? 'GET', headers, body: opts.body === undefined ? undefined : JSON.stringify(opts.body) });
  } catch {
    throw new ApiError(0, 'Tiada sambungan ke pelayan. Semak internet anda.');
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Laluan /api tidak dikendalikan (cth. dibuka melalui `vite` tanpa pelayan) → index.html dikembalikan.
    throw new ApiError(res.status || 502, 'Pelayan portal tidak tersedia di alamat ini.');
  }
  if (!res.ok) {
    if (res.status === 401 && opts.session) writeSession(opts.session, null);
    throw new ApiError(res.status, (data as { error?: string } | null)?.error ?? `Ralat ${res.status}`);
  }
  return data as T;
}

/* ------------------------------------------------------------------ umum */
export const health = () => call<HealthInfo>('/api/health');

/* ------------------------------------------------------------------ pentadbir */
export const adminSession = () => readSession(ADMIN_KEY);
export const adminLogout = () => writeSession(ADMIN_KEY, null);
export async function adminLogin(password: string) {
  const s = await call<Session>('/api/admin/login', { method: 'POST', body: { password } });
  writeSession(ADMIN_KEY, s);
  return s;
}
const admin = <T,>(path: string, method = 'GET', body?: unknown) => call<T>(`/api/admin/${path}`, { method, body, session: ADMIN_KEY });

export const overview = () => admin<AdminOverview>('overview');
export const createUnit = (input: UnitInput) => admin<PortalUnit>('units', 'POST', input);
export const updateUnit = (id: string, patch: Partial<UnitInput> & { regenerate?: boolean }) => admin<PortalUnit>(`units/${id}`, 'PATCH', patch);
export const deleteUnit = (id: string) => admin<{ ok: true }>(`units/${id}`, 'DELETE');
export const getSubmission = (id: string) => admin<Submission>(`submissions/${id}`);
export const decide = (id: string, decisions: Record<string, Decision | null>) => admin<SubmissionSummary>(`submissions/${id}`, 'PATCH', { decisions });
export const deleteSubmission = (id: string) => admin<{ ok: true }>(`submissions/${id}`, 'DELETE');
export const patchEditionSections = (sections: Record<string, SectionContent>) => admin<{ ok: true }>('edition/sections', 'PATCH', { sections });

/** Gambar data URL yang besar tidak diperlukan oleh portal (kulit/logo) - buang untuk menjimatkan saiz. */
const lean = (src: string) => (src.startsWith('data:') ? '' : src);
const BATCH_CHARS = 300_000;

function batches<T>(items: T[]): T[][] {
  const out: T[][] = [];
  let cur: T[] = [];
  let size = 0;
  for (const it of items) {
    const n = JSON.stringify(it).length;
    if (cur.length && size + n > BATCH_CHARS) {
      out.push(cur);
      cur = [];
      size = 0;
    }
    cur.push(it);
    size += n;
  }
  if (cur.length) out.push(cur);
  return out;
}

/** Terbitkan buku semasa (halaman dalam struktur, guru, master, profil) ke portal secara berkelompok. */
export async function publishEdition(onProgress?: (done: number, total: number) => void): Promise<number> {
  const { cover, sections, outline } = useBookStore.getState();
  const profile = useProjectStore.getState().profile;
  const { fields, teachers } = useStaffStore.getState();
  const master = useMasterStore.getState().overrides;
  const ids = allIds(outline).filter((id) => sections[id]);
  const secBatches = batches(ids.map((id) => [id, sections[id]] as const));
  const staffBatches = batches(teachers);
  const total = secBatches.length + staffBatches.length + 2;
  let done = 0;
  const tick = () => onProgress?.(++done, total);

  const { ver } = await admin<{ ver: string }>('publish/begin', 'POST');
  tick();
  for (const b of secBatches) {
    await admin('publish/sections', 'POST', { ver, sections: Object.fromEntries(b) });
    tick();
  }
  for (const [index, b] of staffBatches.entries()) {
    await admin('publish/teachers', 'POST', { ver, index, teachers: b });
    tick();
  }
  const meta: EditionMeta & { sectionIds: string[]; teacherBatches: number; teacherCount: number } = {
    year: profile.year, publishedAt: 0, profile, cover: { ...cover, image: lean(cover.image), logo: lean(cover.logo) }, outline, master,
    staffFields: fields, sectionIds: ids, teacherBatches: staffBatches.length, teacherCount: teachers.length,
  };
  const { publishedAt } = await admin<{ publishedAt: number }>('publish/commit', 'POST', { ver, meta });
  tick();
  return publishedAt;
}

/* ------------------------------------------------------------------ unit (portal) */
export const unitSession = () => readSession(UNIT_KEY);
export const unitLogout = () => writeSession(UNIT_KEY, null);
export async function unitLogin(code: string) {
  const s = await call<Session & { unit: { id: string; name: string } }>('/api/portal/login', { method: 'POST', body: { code } });
  writeSession(UNIT_KEY, { token: s.token, exp: s.exp });
  return s;
}
export const portalState = () => call<PortalState>('/api/portal/state', { session: UNIT_KEY });
export const portalSubmit = (body: { submittedBy: string; note: string; sections: Record<string, SectionContent>; base: Record<string, number | null> }) =>
  call<SubmissionSummary>('/api/portal/submit', { method: 'POST', body, session: UNIT_KEY });

/** Pautan akses unit (kod dalam serpihan # supaya tidak direkod dalam log pelayan). */
export const unitLink = (code: string) => `${window.location.origin}/portal#${code}`;
