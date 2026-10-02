import type { Block } from '@/types/book';
import { kvPairs, listItems, paragraphParts, unitCount } from '@/lib/units';

/**
 * Papar blok (atau julat unit [from, to) bagi blok yang dipecah merentas halaman).
 * Setiap unit diberi kelas `u` - pengukur halaman membaca tingginya.
 */
export default function BlockView({ block, from = 0, to }: { block: Block; from?: number; to?: number }) {
  const end = to ?? unitCount(block);
  switch (block.type) {
    case 'heading':
      return <div className="bp-block"><h3 className="bp-heading u">{block.text}</h3></div>;
    case 'paragraph':
      return (
        <div className="bp-block">
          {paragraphParts(block.text).slice(from, end).map((t, i) => <p key={i} className="bp-para u">{t}</p>)}
        </div>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <div className="bp-block bp-list-wrap">
          <Tag className={`bp-list ${block.ordered ? 'list-decimal' : 'list-disc'}`} start={block.ordered ? from + 1 : undefined}>
            {listItems(block.items).slice(from, end).map((it, i) => <li key={i} className="u">{it}</li>)}
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
                <th className="bp-num">BIL.</th>
                {block.columns.map((c, i) => <th key={i}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {block.rows.slice(from, end).map((r, ri) => (
                <tr key={ri} className="u">
                  <td className="bp-num">{from + ri + 1}</td>
                  {block.columns.map((_, ci) => <td key={ci}>{r[ci] ?? ''}</td>)}
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
                <dt>{p.key}</dt>
                <dd><span className="bp-kv-colon">:</span>{p.value || ' '}</dd>
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
            {block.caption && <figcaption>{block.caption}</figcaption>}
          </figure>
        </div>
      );
  }
}
