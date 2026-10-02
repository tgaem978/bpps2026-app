import type { Block } from '@/types/book';

export default function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="bp-heading">{block.text}</h3>;
    case 'paragraph':
      return block.text.trim() ? <p className="bp-para">{block.text}</p> : null;
    case 'list': {
      const items = block.items.filter((i) => i.trim() !== '');
      if (!items.length) return null;
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`bp-list ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </Tag>
      );
    }
    case 'table':
      return (
        <table className="bp-table">
          <thead>
            <tr>
              <th className="bp-num">Bil.</th>
              {block.columns.map((c, i) => <th key={i}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((r, ri) => (
              <tr key={ri}>
                <td className="bp-num">{ri + 1}</td>
                {block.columns.map((_, ci) => <td key={ci}>{r[ci] ?? ''}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case 'keyvalue':
      return (
        <dl className="bp-kv">
          {block.pairs.filter((p) => p.key.trim() || p.value.trim()).map((p, i) => (
            <div key={i}>
              <dt>{p.key}</dt>
              <dd>{p.value || '—'}</dd>
            </div>
          ))}
        </dl>
      );
    case 'image':
      return block.src ? (
        <figure className="bp-figure">
          <img src={block.src} alt={block.caption || 'Gambar'} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      ) : null;
  }
}
