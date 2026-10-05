import type { AnyBlock, CommitteeBlock, OrgChartBlock } from '@/types/book';
import type { Teacher } from '@/types/staff';
import { kvPairs, listItems, paragraphParts, unitCount } from '@/lib/units';
import { byPosition, committeeChartLines, nameOf, resolveMembers, resolveTokens, staffRows, valueText, type BookCtx } from '@/lib/resolve';
import { arrangeFocus } from '@/lib/orgLayout';

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

type OcPerson = { name: string; position: string; photo: string };
type OcRow = { kind: 'person'; items: OcPerson[] } | { kind: 'group'; items: { position: string; people: Teacher[] }[] };

function OrgChart({ block, ctx }: { block: OrgChartBlock; ctx: BookCtx }) {
  const rows = block.levels.flatMap((lv): OcRow[] => {
    if (lv.display === 'group') {
      const groups = lv.positions.map((p) => ({ position: p, people: byPosition(ctx, p, block.session) }));
      return chunk(groups, 5).map((g) => ({ kind: 'group', items: g }));
    }
    const people = lv.positions.flatMap((p): OcPerson[] => {
      const list = byPosition(ctx, p, block.session);
      return list.length ? list.map((t) => ({ name: nameOf(t), position: p, photo: t.photo })) : [{ name: `[ ${p.toUpperCase()} ]`, position: p, photo: '' }];
    });
    return chunk(people, 5).map((g) => ({ kind: 'person', items: g }));
  }).map((r): OcRow => (r.kind === 'person' ? { ...r, items: arrangeFocus(r.items, block.focus).items } : r));

  return (
    <div className="bp-oc">
      {rows.map((r, ri) => {
        const n = r.items.length;
        return (
          <div key={ri} className={`bp-oc-row ${ri === 0 ? 'bp-oc-first' : ''} ${r.kind === 'person' && ri === 0 && n === 1 ? 'bp-oc-lead' : ''}`}>
            {ri > 0 && <span className="bp-oc-drop" />}
            {ri > 0 && n > 1 && <span className="bp-oc-bus" style={{ left: busInset(n, Math.max(n, 3)), right: busInset(n, Math.max(n, 3)) }} />}
            <div className="bp-oc-cards">
              {r.kind === 'person'
                ? r.items.map((m, i) => (
                    <div key={i} className={`bp-oc-card ${block.focus && m.position === block.focus && ri > 0 && n >= 3 ? 'bp-oc-focus' : ''}`} style={{ width: `${100 / Math.max(n, 3)}%` }}>
                      {ri > 0 && !(block.focus && m.position === block.focus && n >= 3) && <span className="bp-oc-stub" />}
                      <div className="bp-oc-photo">{m.photo ? <img src={m.photo} alt="" /> : <Avatar name={m.name} />}</div>
                      <div className="bp-oc-pill">
                        <p className="bp-oc-name">{m.name}</p>
                        <p className="bp-oc-pos">{m.position}</p>
                      </div>
                    </div>
                  ))
                : r.items.map((g, i) => (
                    <div key={i} className="bp-oc-card bp-oc-group" style={{ width: `${100 / Math.max(n, 3)}%` }}>
                      {ri > 0 && <span className="bp-oc-stub" />}
                      <div className="bp-oc-gbox">
                        <p className="bp-oc-gtitle">{g.position}</p>
                        {g.people.length
                          ? g.people.map((t) => <p key={t.id} className="bp-oc-gname">{nameOf(t)}</p>)
                          : <p className="bp-oc-gname bp-muted">—</p>}
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Jawatankuasa sebagai carta bergambar: aras demi aras, maksimum 5 kad sebaris (setiap baris = satu unit). */
function CommitteeChart({ block, ctx, from, to }: { block: CommitteeBlock; ctx: BookCtx; from: number; to: number }) {
  const t = (s: string) => resolveTokens(s, ctx);
  const lines = committeeChartLines(block, ctx).slice(from, to);
  return (
    <div className="bp-block">
      {block.title && <h3 className="bp-heading bp-cm-title">{t(block.title)}{from > 0 ? ' (samb.)' : ''}</h3>}
      <div className="bp-oc bp-cmc">
        {lines.map((ln0, li) => {
          const arr = arrangeFocus(ln0.cards, block.focus);
          const ln = arr.focusIndex >= 0 ? { ...ln0, cards: arr.items } : ln0;
          const n = ln.cards.length;
          const slots = Math.max(n, 4);
          // Penyambung hanya pada baris pertama setiap aras, dan bukan di atas halaman sambungan.
          const linked = ln.tierStart && li > 0;
          const cls = ['bp-oc-row', 'u', li === 0 ? 'bp-oc-first' : '', ln.lead ? 'bp-oc-lead' : '', ln.tierStart ? '' : 'bp-cmc-cont', ln.label ? 'bp-cmc-labelled' : ''];
          return (
            <div key={li} className={cls.filter(Boolean).join(' ')}>
              {linked && <span className="bp-oc-drop" />}
              {linked && n > 1 && <span className="bp-oc-bus" style={{ left: busInset(n, slots), right: busInset(n, slots) }} />}
              {ln.label && <p className="bp-cmc-label"><span>{t(ln.label)}</span></p>}
              <div className="bp-oc-cards">
                {ln.cards.map((c, i) => (
                  <div key={i} className={`bp-oc-card ${arr.focusIndex === i ? 'bp-oc-focus' : ''}`} style={{ width: ln.lead ? '60%' : `${100 / slots}%` }}>
                    {linked && arr.focusIndex !== i && <span className="bp-oc-stub" />}
                    {c.person ? (
                      <>
                        <div className="bp-oc-photo">{c.photo ? <img src={c.photo} alt="" /> : <Avatar name={c.name} />}</div>
                        <div className="bp-oc-pill">
                          <p className="bp-oc-name">{c.name}</p>
                          <p className="bp-oc-pos">{arr.focusIndex >= 0 ? c.position : t(c.role)}</p>
                        </div>
                        {c.note && <p className="bp-cmc-note">{c.note}</p>}
                      </>
                    ) : (
                      <div className="bp-cmc-box">
                        <p className="bp-oc-pos">{t(c.role)}</p>
                        <p className="bp-oc-name">{c.name}</p>
                      </div>
                    )}
                  </div>
                ))}
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
      return <div className="bp-block"><h3 className="bp-heading u kn">{parts[0]}</h3></div>;
    }
    case 'paragraph': {
      const parts = paragraphParts(block.text).slice(from, end);
      // Baris tebal sahaja (bukan ayat) = subtajuk: rapat dengan kandungan selepasnya dan tidak tertinggal di hujung halaman.
      const sub = parts.map((p) => /^\*\*[^*\n]{1,100}\*\*$/.test(p) && !/[.!?,;:]\*\*$/.test(p));
      return (
        <div className={`bp-block ${sub[sub.length - 1] ? 'bp-block-tight' : ''}`}>
          {parts.map((p, i) => <p key={i} className={`bp-para u ${sub[i] ? 'bp-subhead kn' : ''}`} style={block.align ? { textAlign: block.align } : undefined}><Rich text={t(p)} /></p>)}
        </div>
      );
    }
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <div className="bp-block bp-list-wrap">
          <Tag className={`bp-list ${block.ordered ? 'list-decimal' : 'list-disc'}`} start={block.ordered ? from + 1 : undefined}>
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
              {columnShares(block.columns, block.rows).map((f, i) => <col key={i} style={{ width: `${(f * (num ? 94 : 100)).toFixed(2)}%` }} />)}
            </colgroup>
            <thead>
              <tr>
                {num && <th className="bp-num">Bil.</th>}
                {block.columns.map((c, i) => <th key={i}>{t(c)}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.slice(from, end).map((r, ri) => (
                <tr key={ri} className="u">
                  {num && <td className="bp-num">{from + ri + 1}</td>}
                  {block.columns.map((_, ci) => <td key={ci} className={cellClass(ci)}><Rich text={t(r[ci] ?? '')} /></td>)}
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
                <dd>{t(p.value) || ' '}</dd>
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
    case 'committee': {
      if (block.display === 'chart') return <CommitteeChart block={block} ctx={ctx} from={from} to={end} />;
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
