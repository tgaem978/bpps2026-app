import type { AnyBlock, OrgChartBlock } from '@/types/book';
import type { Teacher } from '@/types/staff';
import { kvPairs, listItems, paragraphParts, unitCount } from '@/lib/units';
import { byPosition, nameOf, resolveMembers, resolveTokens, staffRows, valueText, type BookCtx } from '@/lib/resolve';

/** Siluet potret elegan bila tiada gambar. */
export function Avatar({ name }: { name: string }) {
  const initials = name.replace(/\b(BIN|BINTI|BT|A\/L|A\/P)\b/gi, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('');
  return (
    <svg viewBox="0 0 80 100" className="bp-avatar" aria-hidden>
      <rect width="80" height="100" fill="#E6ECF0" />
      <circle cx="40" cy="38" r="17" fill="#B9C6CF" />
      <path d="M8 100c3-22 16-33 32-33s29 11 32 33z" fill="#B9C6CF" />
      {initials && <text x="40" y="44" textAnchor="middle" fontSize="15" fontFamily="Poppins, sans-serif" fontWeight="600" fill="#004358">{initials}</text>}
    </svg>
  );
}

const chunk = <T,>(arr: T[], n: number) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

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
  });

  return (
    <div className="bp-oc">
      {rows.map((r, ri) => {
        const n = r.items.length;
        return (
          <div key={ri} className={`bp-oc-row ${ri === 0 ? 'bp-oc-first' : ''} ${r.kind === 'person' && ri === 0 && n === 1 ? 'bp-oc-lead' : ''}`}>
            {ri > 0 && <span className="bp-oc-drop" />}
            {ri > 0 && n > 1 && <span className="bp-oc-bus" style={{ left: `${50 / n}%`, right: `${50 / n}%` }} />}
            <div className="bp-oc-cards">
              {r.kind === 'person'
                ? r.items.map((m, i) => (
                    <div key={i} className="bp-oc-card" style={{ width: `${100 / Math.max(n, 3)}%` }}>
                      {ri > 0 && n > 1 && <span className="bp-oc-stub" />}
                      <div className="bp-oc-photo">{m.photo ? <img src={m.photo} alt="" /> : <Avatar name={m.name} />}</div>
                      <p className="bp-oc-pos">{m.position}</p>
                      <p className="bp-oc-name">{m.name}</p>
                    </div>
                  ))
                : r.items.map((g, i) => (
                    <div key={i} className="bp-oc-card bp-oc-group" style={{ width: `${100 / Math.max(n, 3)}%` }}>
                      {ri > 0 && n > 1 && <span className="bp-oc-stub" />}
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

/**
 * Papar blok (atau julat unit [from, to) bagi blok yang dipecah merentas halaman).
 * Setiap unit diberi kelas `u` - pengukur halaman membaca tingginya.
 */
export default function BlockView({ block, ctx, from = 0, to }: { block: AnyBlock; ctx: BookCtx; from?: number; to?: number }) {
  const end = to ?? unitCount(block, ctx);
  const t = (s: string) => resolveTokens(s, ctx);
  switch (block.type) {
    case 'heading':
      return <div className="bp-block"><h3 className="bp-heading u">{t(block.text)}</h3></div>;
    case 'paragraph':
      return (
        <div className="bp-block">
          {paragraphParts(block.text).slice(from, end).map((s, i) => <p key={i} className="bp-para u">{t(s)}</p>)}
        </div>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <div className="bp-block bp-list-wrap">
          <Tag className={`bp-list ${block.ordered ? 'list-decimal' : 'list-disc'}`} start={block.ordered ? from + 1 : undefined}>
            {listItems(block.items).slice(from, end).map((it, i) => <li key={i} className="u">{t(it)}</li>)}
          </Tag>
        </div>
      );
    }
    case 'table':
      return (
        <div className="bp-block bp-table-wrap">
          <table className="bp-table">
            <colgroup>
              <col className="bp-num-col" />
              {block.columns.map((_, i) => <col key={i} />)}
            </colgroup>
            <thead>
              <tr>
                <th className="bp-num">Bil.</th>
                {block.columns.map((c, i) => <th key={i}>{t(c)}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.slice(from, end).map((r, ri) => (
                <tr key={ri} className="u">
                  <td className="bp-num">{from + ri + 1}</td>
                  {block.columns.map((_, ci) => <td key={ci}>{t(r[ci] ?? '')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
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
            <img src={block.src} alt={block.caption || 'Gambar'} />
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
    case 'committee':
      return (
        <div className="bp-block">
          {block.title && <h3 className="bp-heading bp-cm-title">{t(block.title)}{from > 0 ? ' (samb.)' : ''}</h3>}
          <div className="bp-cm">
            {block.rows.slice(from, end).map((r) => {
              const members = resolveMembers(ctx, r.members);
              return (
                <div key={r.id} className="bp-cm-row u">
                  <div className="bp-cm-role">{t(r.role)}</div>
                  <div className="bp-cm-members">
                    {members.length === 0 && <span className="bp-muted">—</span>}
                    {members.map((m, i) => (
                      <div key={i} className="bp-cm-m">
                        <span className="bp-cm-name">{m.name}</span>
                        {m.position && <span className="bp-cm-pos">{m.position}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
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
                  {cols.map((c) => <td key={c.id} className={c.id === 'nama' ? 'bp-strong' : undefined}>{valueText(tch.values[c.id])}</td>)}
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
