import type { AnyBlock, CommitteeBlock, OrgChartBlock, OrgTreeBlock } from '@/types/book';
import type { Teacher } from '@/types/staff';
import { kvPairs, listItems, paragraphParts, unitCount } from '@/lib/units';
import { byPosition, chartName, chartRole, committeeChartLines, nameOf, resolveMembers, resolveTokens, staffRows, valueText, type BookCtx } from '@/lib/resolve';
import { arrangeFocus, isLeader } from '@/lib/orgLayout';
import { fmtStyle } from '@/lib/format';

/** Siluet potret elegan bila tiada gambar. */
export function Avatar({ name }: { name: string }) {
  const initials = name.replace(/\b(BIN|BINTI|BT|A\/L|A\/P)\b/gi, ' ').replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('');
  return (
    <svg viewBox="0 0 80 100" className="bp-avatar" aria-hidden>
      <rect width="80" height="100" fill="#E6ECF0" />
      <circle cx="40" cy="38" r="17" fill="#B9C6CF" />
      <path d="M8 100c3-22 16-33 32-33s29 11 32 33z" fill="#B9C6CF" />
      {initials && <text x="40" y="44" textAnchor="middle" fontSize="15" fontFamily="Poppins, sans-serif" fontWeight="600" fill="#004358">{initials}</text>}
    </svg>
  );
}

/** Teks dengan **tebal** (format dokumen BPPS). */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p))}</>;
}

const chunk = <T,>(arr: T[], n: number) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

/** Kedudukan bas penyambung: dari tengah kad pertama ke tengah kad terakhir (kad selebar 100/slots %, berpusat). */
const busInset = (n: number, slots: number) => `${(100 - (n * 100) / slots) / 2 + 50 / slots}%`;

/**
 * Nama pentadbir (kad bergambar) dipaparkan SATU baris jika muat: anggaran lebar huruf besar tebal (~0.74 em/huruf) berbanding
 * lebar dalam kad (mm). Saiz nama diseragamkan dalam satu baris kad (skala sepunya, tidak kurang 82%); nama yang masih
 * tidak muat pada skala itu dibalut dua baris pada saiz yang sama.
 */
const CONTENT_MM = 192;
const MIN_SCALE = 0.82;
interface NameFit { one: boolean; scale: number }
function rowNameFit(names: string[], slotMm: number, lead: boolean): NameFit[] {
  const basePt = lead ? 8.6 : 6.6;
  const inner = (lead ? Math.min(slotMm - 2.4, 56) : slotMm - 2.4) - 3.4;
  const raw = names.map((n) => Math.min(1, inner / Math.max(1, n.length * 0.74 * basePt * 0.3528)));
  const common = Math.min(1, ...raw.filter((r) => r >= MIN_SCALE));
  return raw.map((r) => ({ one: r >= MIN_SCALE, scale: common }));
}

/**
 * Satu bahasa visual untuk semua kad carta (organisasi & jawatankuasa):
 *  - kad bergambar (Guru Besar & pentadbir): gambar bulat separuh bertindih pada tepi atas kad;
 *  - kad nama (semua ahli lain, kumpulan penyelaras): kad yang sama tanpa gambar.
 * Susunan teks sentiasa: JAWATAN (label kecil) → NAMA (tebal) → keterangan kecil (jika ada).
 */
function Card({ role, names, sub, note, leader, photo, who, fit }: { role: string; names: string[]; sub?: string; note?: string; leader?: boolean; photo?: string; who?: string; fit?: NameFit }) {
  return (
    <div className={`bp-card ${leader ? 'bp-card-leader' : 'bp-card-plain'}${names.length > 1 ? ' bp-card-multi' : ''}`}>
      {leader && <div className="bp-oc-photo">{photo ? <img src={photo} alt="" /> : <Avatar name={who ?? names[0] ?? ''} />}</div>}
      <p className="bp-card-role">{chartRole(role)}</p>
      <div className="bp-card-names">
        {names.length ? names.map((nm, k) => <p key={k} className={`bp-card-name${leader && fit?.one ? ' bp-one' : ''}`} style={leader && fit && fit.scale < 1 ? { fontSize: `calc(var(--oc-name) * ${fit.scale.toFixed(3)})` } : undefined}>{nm}</p>) : <p className="bp-card-name bp-card-empty">—</p>}
      </div>
      {sub && <p className="bp-card-sub">{chartRole(sub)}</p>}
      {note && <p className="bp-card-note">{note}</p>}
    </div>
  );
}

type OcPerson = { name: string; position: string; photo: string };
type OcRow = { kind: 'person'; items: OcPerson[] } | { kind: 'group'; items: { position: string; people: Teacher[] }[] };

function OrgChart({ block, ctx }: { block: OrgChartBlock; ctx: BookCtx }) {
  const full = block.cleanNames === false;
  const rows = block.levels.flatMap((lv): OcRow[] => {
    if (lv.display === 'group') {
      const groups = lv.positions.map((p) => ({ position: p, people: byPosition(ctx, p, block.session) }));
      return chunk(groups, 5).map((g) => ({ kind: 'group', items: g }));
    }
    const people = lv.positions.flatMap((p): OcPerson[] => {
      const list = byPosition(ctx, p, block.session);
      return list.length ? list.map((t) => ({ name: chartName(nameOf(t), full), position: p, photo: t.photo })) : [{ name: `[ ${p.toUpperCase()} ]`, position: p, photo: '' }];
    });
    return chunk(people, 5).map((g) => ({ kind: 'person', items: g }));
  }).map((r): OcRow => (r.kind === 'person' ? { ...r, items: arrangeFocus(r.items, block.focus).items } : r));

  return (
    <div className="bp-oc">
      {rows.map((r, ri) => {
        const n = r.items.length;
        const slots = Math.max(n, 3);
        const fits = r.kind === 'person' ? rowNameFit(r.items.map((m) => m.name), CONTENT_MM / slots, ri === 0 && n === 1) : [];
        return (
          <div key={ri} className={`bp-oc-row ${ri === 0 ? 'bp-oc-first' : ''} ${r.kind === 'person' && ri === 0 && n === 1 ? 'bp-oc-lead' : ''}`}>
            {ri > 0 && <span className="bp-oc-drop" />}
            {ri > 0 && n > 1 && <span className="bp-oc-bus" style={{ left: busInset(n, slots), right: busInset(n, slots) }} />}
            <div className="bp-oc-cards">
              {r.kind === 'person'
                ? r.items.map((m, i) => {
                    const focus = !!block.focus && m.position === block.focus && ri > 0 && n >= 3;
                    return (
                      <div key={i} className={`bp-oc-card ${focus ? 'bp-oc-focus' : ''}`} style={{ width: `${100 / slots}%` }}>
                        {ri > 0 && <span className="bp-oc-stub" />}
                        <Card role={m.position} names={[m.name]} leader={isLeader(m.position)} photo={m.photo} who={m.name} fit={fits[i]} />
                      </div>
                    );
                  })
                : r.items.map((g, i) => (
                    <div key={i} className="bp-oc-card" style={{ width: `${100 / slots}%` }}>
                      {ri > 0 && <span className="bp-oc-stub" />}
                      <Card role={g.position} names={g.people.map((t) => chartName(nameOf(t), full))} />
                    </div>
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Carta struktur (format carta "Pengurusan & Pentadbiran"): puncak (Guru Besar, kotak sisi pilihan seperti PIBG), pentadbir sebagai
 * lajur kad bergambar, dan kotak unit / bidang tugas di bawah setiap pentadbir. Garis penyambung & kad sama seperti carta lain.
 */
function OrgTree({ block, ctx }: { block: OrgTreeBlock; ctx: BookCtx }) {
  const t = (s: string) => resolveTokens(s, ctx);
  const full = block.cleanNames === false;
  const person = (position: string): OcPerson => {
    const tch = byPosition(ctx, position)[0];
    return tch ? { name: chartName(nameOf(tch), full), position, photo: tch.photo } : { name: `[ ${position.toUpperCase()} ]`, position, photo: '' };
  };
  const root = person(block.root);
  const cols = block.columns.map((c) => ({ c, p: person(c.position) }));
  const n = cols.length;
  const slots = Math.max(n, 3);
  const fits = rowNameFit(cols.map((x) => x.p.name), CONTENT_MM / slots, false);
  const rootFit = rowNameFit([root.name], CONTENT_MM, true)[0];
  const side = block.side.map((x) => x.trim()).filter(Boolean);
  return (
    <div className="bp-oc bp-ot">
      <div className="bp-oc-row bp-oc-first bp-oc-lead bp-ot-top">
        <div className="bp-oc-cards">
          <div className="bp-oc-card" style={{ width: '100%' }}>
            <Card role={root.position} names={[root.name]} leader photo={root.photo} who={root.name} fit={rootFit} />
          </div>
        </div>
        {side.length > 0 && (
          <>
            <span className="bp-ot-sideline" />
            <div className="bp-ot-side">{side.map((x, i) => <p key={i} className="bp-ot-sidebox">{chartRole(t(x))}</p>)}</div>
          </>
        )}
      </div>
      {n > 0 && (
        <div className="bp-oc-row">
          <span className="bp-oc-drop" />
          {n > 1 && <span className="bp-oc-bus" style={{ left: busInset(n, slots), right: busInset(n, slots) }} />}
          <div className="bp-oc-cards bp-ot-cols">
            {cols.map(({ c, p }, i) => (
              <div key={c.id} className="bp-oc-card bp-ot-col" style={{ width: `${100 / slots}%` }}>
                <span className="bp-oc-stub" />
                <Card role={p.position} names={[p.name]} leader photo={p.photo} who={p.name} fit={fits[i]} />
                {c.boxes.map((b) => {
                  const items = b.items.map((x) => x.trim()).filter(Boolean);
                  return (
                    <div key={b.id} className="bp-ot-boxwrap">
                      <span className="bp-ot-link" />
                      <div className="bp-ot-box">
                        {b.title.trim() && <p className={`bp-ot-title${items.length ? ' bp-ot-title-sep' : ''}`}>{chartRole(t(b.title))}</p>}
                        {items.length > 0 && <ul className="bp-ot-list">{items.map((it, k) => <li key={k}>{t(it)}</li>)}</ul>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Jawatankuasa sebagai carta bergambar: aras demi aras, maksimum 5 kad sebaris (setiap baris = satu unit). */
function CommitteeChart({ block, ctx, from, to, density = 0 }: { block: CommitteeBlock; ctx: BookCtx; from: number; to: number; density?: number }) {
  const t = (s: string) => resolveTokens(s, ctx);
  const lines = committeeChartLines(block, ctx).slice(from, to);
  return (
    <div className={`bp-block${density ? ` bp-dense-${density}` : ''}`}>
      {block.title && <h3 className="bp-heading bp-cm-title">{t(block.title)}{from > 0 ? ' (samb.)' : ''}</h3>}
      <div className="bp-oc bp-cmc">
        {lines.map((ln0, li) => {
          const arr = arrangeFocus(ln0.cards, block.focus);
          const ln = arr.focusIndex >= 0 ? { ...ln0, cards: arr.items } : ln0;
          const n = ln.cards.length;
          const slots = Math.max(n, 4);
          // Penyambung hanya pada baris pertama setiap aras, dan bukan di atas halaman sambungan.
          const linked = ln.tierStart && li > 0;
          const fits = rowNameFit(ln.cards.map((c) => c.name), ln.lead ? CONTENT_MM * 0.6 : CONTENT_MM / slots, ln.lead);
          const cls = ['bp-oc-row', 'u', li === 0 ? 'bp-oc-first' : '', ln.lead ? 'bp-oc-lead' : '', ln.tierStart ? '' : 'bp-cmc-cont', ln.label ? 'bp-cmc-labelled' : ''];
          return (
            <div key={li} className={cls.filter(Boolean).join(' ')}>
              {linked && <span className="bp-oc-drop" />}
              {linked && n > 1 && <span className="bp-oc-bus" style={{ left: busInset(n, slots), right: busInset(n, slots) }} />}
              {ln.label && <p className="bp-cmc-label"><span>{chartRole(t(ln.label))}</span></p>}
              <div className="bp-oc-cards">
                {ln.cards.map((c, i) => {
                  const leader = c.person && isLeader(c.position);
                  const role = t(c.role);
                  return (
                    <div key={i} className={`bp-oc-card ${arr.focusIndex === i ? 'bp-oc-focus' : ''}`} style={{ width: ln.lead ? '60%' : `${100 / slots}%` }}>
                      {linked && <span className="bp-oc-stub" />}
                      <Card
                        role={role}
                        names={c.names ?? [c.name]}
                        leader={leader}
                        photo={c.photo}
                        who={c.name}
                        fit={fits[i]}
                        sub={leader && c.position && role.toLowerCase() !== c.position.toLowerCase() ? c.position : undefined}
                        note={c.note}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Papar blok (atau julat unit [from, to) bagi blok yang dipecah merentas halaman).
 * Setiap unit diberi kelas `u` - pengukur halaman membaca tingginya.
 */
/** Lebar lajur jadual ikut kandungan (baris terpanjang setiap lajur), supaya jadual kemas dan seimbang. */
const plain = (t: string) => t.replace(/\*\*/g, '');
const longestLine = (t: string) => Math.max(0, ...plain(t).split('\n').map((l) => l.trim().length));
const longestWord = (t: string) => Math.max(0, ...plain(t).split(/\s+/).map((w) => w.length));

/** Panjang baris terpanjang setiap lajur (untuk lebar & penjajaran). */
export function columnStats(columns: string[], rows: string[][]) {
  return columns.map((c, ci) => ({
    line: Math.max(0, ...rows.map((r) => longestLine(r[ci] ?? ''))),
    word: Math.max(longestWord(c) * 0.9, ...rows.map((r) => longestWord(r[ci] ?? ''))),
  }));
}

/** Lebar lajur jadual ikut kandungan, supaya jadual kemas dan seimbang; perkataan/tarikh tidak dipecah. */
export function columnShares(columns: string[], rows: string[][]): number[] {
  const stats = columnStats(columns, rows);
  const w = stats.map(({ line, word }) => Math.pow(Math.max(5, Math.min(46, line), word * 1.2), 0.8));
  const sum = w.reduce((a, b) => a + b, 0) || 1;
  const share = w.map((x) => x / sum);
  // Lebar minimum supaya perkataan terpanjang (cth. tarikh 15.02.2026) tidak dipecah: ~1.9mm/aksara + ruang sel, daripada ~180mm.
  const min = stats.map(({ word }) => Math.min(0.4, (word * 1.9 + 3) / 180));
  const short = share.map((v, i) => Math.max(0, min[i] - v));
  const need = short.reduce((a, b) => a + b, 0);
  if (!need) return share;
  const spare = share.reduce((a, v, i) => a + (short[i] ? 0 : Math.max(0, v - min[i])), 0) || 1;
  return share.map((v, i) => (short[i] ? min[i] : v - (Math.max(0, v - min[i]) / spare) * need));
}

/**
 * density: 0 = biasa, 1-2 = jadual dipadatkan (fon & ruang sel lebih kecil) supaya muat satu halaman.
 */
export default function BlockView({ block, ctx, from = 0, to, density = 0 }: { block: AnyBlock; ctx: BookCtx; from?: number; to?: number; density?: number }) {
  const dense = density ? ` bp-dense-${density}` : '';
  const end = to ?? unitCount(block, ctx);
  const t = (s: string) => resolveTokens(s, ctx);
  switch (block.type) {
    case 'heading': {
      // "TAHUN 1 | NAMA" → dua bar bersebelahan seperti dokumen
      const parts = t(block.text).split(/\s+\|\s+/);
      if (parts.length > 1) {
        return (
          <div className="bp-block">
            <div className="bp-heading-split u kn">{parts.map((p, i) => <h3 key={i} className="bp-heading">{p}</h3>)}</div>
          </div>
        );
      }
      return <div className="bp-block"><h3 className="bp-heading u kn" style={fmtStyle({ ...block, bold: undefined })}>{parts[0]}</h3></div>;
    }
    case 'paragraph': {
      const parts = paragraphParts(block.text).slice(from, end);
      // Baris tebal sahaja (bukan ayat) = subtajuk: rapat dengan kandungan selepasnya dan tidak tertinggal di hujung halaman.
      const sub = parts.map((p) => /^\*\*[^*\n]{1,100}\*\*$/.test(p) && !/[.!?,;:]\*\*$/.test(p));
      return (
        <div className={`bp-block ${sub[sub.length - 1] ? 'bp-block-tight' : ''}`}>
          {parts.map((p, i) => <p key={i} className={`bp-para u ${sub[i] ? 'bp-subhead kn' : ''}`} style={fmtStyle(block)}><Rich text={t(p)} /></p>)}
        </div>
      );
    }
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <div className="bp-block bp-list-wrap">
          <Tag className={`bp-list ${block.ordered ? 'list-decimal' : 'list-disc'}`} start={block.ordered ? from + 1 : undefined} style={fmtStyle(block)}>
            {listItems(block.items).slice(from, end).map((it, i) => <li key={i} className="u"><Rich text={t(it)} /></li>)}
          </Tag>
        </div>
      );
    }
    case 'table': {
      const num = block.numbered ?? block.style !== 'gold';
      const firstGold = block.firstCol === 'gold';
      // Lajur pertama rata kiri bagi jadual biru gelap bernombor; lajur berayat panjang rata kiri; selainnya di tengah.
      const stats = columnStats(block.columns, block.rows);
      const cellClass = (ci: number) => (firstGold && ci === 0 ? 'bp-num' : (ci === 0 && num && block.style !== 'gold') || stats[ci].line > 34 ? 'bp-l' : 'bp-c');
      return (
        <div className={`bp-block bp-table-wrap${dense}`}>
          <table className={`bp-table ${block.style === 'gold' ? 'bp-table-gold' : ''}`}>
            <colgroup>
              {num && <col className="bp-num-col" />}
              {(block.colWidths && block.colWidths.length === block.columns.length ? block.colWidths.map((w) => w / 100) : columnShares(block.columns, block.rows)).map((f, i) => <col key={i} style={{ width: `${(f * (num ? 94 : 100)).toFixed(2)}%` }} />)}
            </colgroup>
            <thead>
              <tr>
                {num && <th className="bp-num">Bil.</th>}
                {block.columns.map((c, i) => <th key={i}>{t(c)}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.slice(from, end).map((r, ri) => (
                <tr key={ri} className="u" style={block.rowHeights?.[from + ri] ? { height: `calc(var(--mm) * ${block.rowHeights[from + ri]})` } : undefined}>
                  {num && <td className="bp-num">{from + ri + 1}</td>}
                  {block.columns.map((_, ci) => <td key={ci} className={cellClass(ci)} style={fmtStyle({ ...block, align: block.colAlign?.[ci] ?? block.align }, { pad: true })}><Rich text={t(r[ci] ?? '')} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'keyvalue':
      return (
        <div className="bp-block">
          <dl className="bp-kv">
            {kvPairs(block.pairs).slice(from, end).map((p, i) => (
              <div key={i} className="u">
                <dt>{t(p.key)}</dt>
                <dd style={fmtStyle(block)}>{t(p.value) || ' '}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case 'image':
      return (
        <div className="bp-block">
          <figure className="bp-figure u">
            <img src={block.src} alt={block.caption || 'Gambar'} style={block.height ? { height: `calc(var(--mm) * ${block.height})` } : undefined} />
            {block.caption && <figcaption>{t(block.caption)}</figcaption>}
          </figure>
        </div>
      );
    case 'orgchart':
      return (
        <div className="bp-block">
          <div className="u">
            {block.title && <h3 className="bp-heading">{t(block.title)}</h3>}
            <OrgChart block={block} ctx={ctx} />
          </div>
        </div>
      );
    case 'orgtree':
      return (
        <div className={`bp-block${dense}`}>
          <div className="u">
            {block.title && <h3 className="bp-heading">{t(block.title)}</h3>}
            <OrgTree block={block} ctx={ctx} />
          </div>
        </div>
      );
    case 'committee': {
      if (block.display === 'chart') return <CommitteeChart block={block} ctx={ctx} from={from} to={end} density={density} />;
      const showPos = block.showPosition !== false;
      return (
        <div className="bp-block">
          {block.title && <h3 className="bp-heading bp-cm-title">{t(block.title)}{from > 0 ? ' (samb.)' : ''}</h3>}
          <div className="bp-cm">
            {block.rows.slice(from, end).map((r) => {
              if (r.group) return <div key={r.id} className="bp-cm-group u kn"><span>{t(r.role)}</span></div>;
              const members = resolveMembers(ctx, r.members);
              return (
                <div key={r.id} className="bp-cm-row u">
                  <div className="bp-cm-role">{t(r.role)}</div>
                  <div className="bp-cm-members">
                    {members.length === 0 && <span className="bp-muted">—</span>}
                    {members.map((m, i) => {
                      const side = m.note || (showPos ? m.position : '');
                      return (
                        <div key={i} className="bp-cm-m">
                          <span className="bp-cm-name">{m.name}</span>
                          {side && <span className="bp-cm-pos">{side}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    case 'takwim': {
      const rows = block.rows.slice(from, end);
      // lajur MINGGU bergabung (rowspan) bagi baris berturutan minggu yang sama dalam halaman ini
      const span = rows.map((r, i) => {
        if (!r.week || (i > 0 && rows[i - 1].week === r.week)) return 0;
        let n = 1;
        while (i + n < rows.length && rows[i + n].week === r.week) n++;
        return n;
      });
      const short = (d: string) => d.replace(/\s+20\d\d$/, '');
      return (
        <div className={`bp-block bp-table-wrap bp-takwim-wrap${dense}`}>
          <table className="bp-table bp-takwim">
            <colgroup>
              <col style={{ width: '6%' }} /><col style={{ width: '9%' }} /><col style={{ width: '9%' }} />
              {block.columns.map((_, i) => <col key={i} style={{ width: `${76 / Math.max(1, block.columns.length)}%` }} />)}
            </colgroup>
            <thead>
              <tr><th className="bp-tk-month" colSpan={3 + block.columns.length}>{t(block.title)}{from > 0 ? ' (samb.)' : ''}</th></tr>
              <tr className="bp-tk-head"><th>Minggu</th><th>Tarikh</th><th>Hari</th>{block.columns.map((c, i) => <th key={i}>{t(c)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className={`u ${r.kind ? `bp-tk-${r.kind}` : ''}`}>
                  {(span[i] > 0 || !r.week) && <td className="bp-tk-week" rowSpan={span[i] || 1}>{r.week}</td>}
                  <td className="bp-tk-date">{short(r.date)}</td>
                  <td className="bp-tk-day">{r.day}</td>
                  {r.span !== undefined
                    ? <td className="bp-tk-span" colSpan={block.columns.length}><Rich text={t(r.span)} /></td>
                    : block.columns.map((_, ci) => <td key={ci}><Rich text={t(r.cells[ci] ?? '')} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'stafflist': {
      const rows = staffRows(ctx, block);
      const cols = block.columns.map((id) => ctx.fields.find((f) => f.id === id)).filter((f): f is NonNullable<typeof f> => !!f);
      return (
        <div className="bp-block bp-table-wrap">
          {block.title && <h3 className="bp-heading">{t(block.title)}</h3>}
          <table className="bp-table bp-staff">
            <colgroup>
              <col className="bp-num-col" />
              {block.showPhoto && <col className="bp-photo-col" />}
              {cols.map((c) => <col key={c.id} className={c.id === 'nama' ? 'bp-name-col' : undefined} />)}
            </colgroup>
            <thead>
              <tr>
                <th className="bp-num">Bil.</th>
                {block.showPhoto && <th>Foto</th>}
                {cols.map((c) => <th key={c.id}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr className="u"><td className="bp-num">—</td><td colSpan={cols.length + (block.showPhoto ? 1 : 0)} className="bp-muted">Tiada guru sepadan dalam Pangkalan Data Guru.</td></tr>}
              {rows.slice(from, end).map((tch, i) => (
                <tr key={tch.id} className="u">
                  <td className="bp-num">{from + i + 1}</td>
                  {block.showPhoto && <td className="bp-photo-cell"><div className="bp-thumb">{tch.photo ? <img src={tch.photo} alt="" /> : <Avatar name={nameOf(tch)} />}</div></td>}
                  {cols.map((c) => <td key={c.id} className={c.id === 'nama' ? 'bp-l' : c.id === 'tugas' ? 'bp-c bp-small' : 'bp-c'}>{valueText(tch.values[c.id])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'tocrows':
      return (
        <div className="bp-block bp-table-wrap">
          <table className="bp-toc">
            <tbody>
              {block.rows.slice(from, end).map((r, i) => (
                <tr key={i} className={`u bp-toc-l${r.level}`}>
                  <td><span className="bp-toc-text">{r.title}</span></td>
                  <td className="bp-toc-page">{r.page}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
