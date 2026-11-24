/* Infografik asli bertema sistem (satu halaman = satu infografik), cth. Kurikulum Persekolahan 2027.
 * Warna mengikut tema buku: navy & emas (2027) atau warna tema klasik. Teks menyokong **tebal**. */
import type { InfographicBlock } from '@/types/book';
import { Rich } from './BlockView';

const R = (t: string) => <Rich text={t} />;

/** Ikon ringkas (SVG garis) — dilukis sendiri, bukan imej luar. */
function Icon({ name }: { name: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'check': return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" {...p} /><path d="M7 12.5l3.2 3.2L17 9" {...p} /></svg>;
    case 'heart': return <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" {...p} /><path d="M9 11h6M12 8v6" {...p} /></svg>;
    case 'abc': return <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" {...p} /><path d="M6.5 15l2-6 2 6M7.2 13h2.6M13.5 9h2a1.5 1.5 0 0 1 0 3h-2v3h2.4a1.5 1.5 0 0 0 0-3" {...p} /></svg>;
    case 'puzzle': return <svg viewBox="0 0 24 24"><path d="M4 8h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4z" {...p} /></svg>;
    case 'people': return <svg viewBox="0 0 24 24"><circle cx="8" cy="7" r="2.4" {...p} /><circle cx="16" cy="7" r="2.4" {...p} /><path d="M3.5 19v-3a4.5 4.5 0 0 1 9 0v3M11.5 19v-3a4.5 4.5 0 0 1 9 0v3" {...p} /></svg>;
    default: return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" {...p} /></svg>;
  }
}

/** Lengkok anulus (darjah, 0 = atas, ikut jam). */
function arc(cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) {
  const pt = (r: number, a: number) => { const t = ((a - 90) * Math.PI) / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
  const big = a1 - a0 > 180 ? 1 : 0;
  const [x1, y1] = pt(r2, a0); const [x2, y2] = pt(r2, a1); const [x3, y3] = pt(r1, a1); const [x4, y4] = pt(r1, a0);
  return `M${x1},${y1} A${r2},${r2} 0 ${big} 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 ${big} 0 ${x4},${y4} Z`;
}
/** Laluan bulatan untuk teks melengkung (bahagian atas: ikut jam; bawah: lawan jam supaya teks tegak). */
function textArc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const pt = (a: number) => { const t = ((a - 90) * Math.PI) / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
  const mid = (((a0 + a1) / 2) % 360 + 360) % 360;
  const bottom = mid > 100 && mid < 260;
  const [x1, y1] = pt(bottom ? a1 : a0); const [x2, y2] = pt(bottom ? a0 : a1);
  return `M${x1},${y1} A${r},${r} 0 0 ${bottom ? 0 : 1} ${x2},${y2}`;
}

function Framework({ b }: { b: InfographicBlock }) {
  const outer = b.ring ?? [];
  const inner = b.inner ?? [];
  const els = b.items;
  const C = 150;
  const uid = b.id.replace(/[^a-z0-9]/gi, '');
  return (
    <div className="ig-fw">
      <svg viewBox="0 0 300 300" className="ig-wheel">
        {/* gelang luar: komponen kurikulum */}
        {outer.map((t, i) => {
          const a0 = (360 / outer.length) * i + 2; const a1 = (360 / outer.length) * (i + 1) - 2;
          return (
            <g key={`o${i}`}>
              <path d={arc(C, C, 122, 146, a0, a1)} className="ig-w-outer" />
              <path id={`${uid}o${i}`} d={textArc(C, C, 132, a0 + 4, a1 - 4)} fill="none" />
              <text className="ig-w-otext"><textPath href={`#${uid}o${i}`} startOffset="50%" textAnchor="middle">{t}</textPath></text>
            </g>
          );
        })}
        {/* gelang tengah: elemen / nilai */}
        {els.map((e, i) => {
          const n = els.length; const a0 = (360 / n) * i + 1; const a1 = (360 / n) * (i + 1) - 1;
          const mid = (a0 + a1) / 2; const t = ((mid - 90) * Math.PI) / 180; const r = 98;
          const lines = e.label.split(' '); // satu perkataan sebaris supaya muat dalam segmen
          return (
            <g key={`e${i}`}>
              <path d={arc(C, C, 74, 120, a0, a1)} className={`ig-w-seg ig-w-seg${i % 2}`} />
              <text x={C + r * Math.cos(t)} y={C + r * Math.sin(t) - (lines.length - 1) * 3.6} className="ig-w-etext" textAnchor="middle" dominantBaseline="middle">
                {lines.map((l, j) => <tspan key={j} x={C + r * Math.cos(t)} dy={j ? 7.4 : 0}>{l}</tspan>)}
              </text>
            </g>
          );
        })}
        {/* gelang dalam: teras */}
        {inner.map((t, i) => {
          const a0 = (360 / inner.length) * i + 3; const a1 = (360 / inner.length) * (i + 1) - 3;
          return (
            <g key={`i${i}`}>
              <path d={arc(C, C, 50, 72, a0, a1)} className="ig-w-inner" />
              <path id={`${uid}i${i}`} d={textArc(C, C, 59, a0, a1)} fill="none" />
              <text className="ig-w-itext"><textPath href={`#${uid}i${i}`} startOffset="50%" textAnchor="middle">{t}</textPath></text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={47} className="ig-w-core" />
        <svg x={C - 12} y={C - 34} width={24} height={24} viewBox="0 0 24 24" className="ig-w-ico"><Icon name="people" /></svg>
        {(b.center ?? '').split('\n').map((l, j) => <text key={j} x={C} y={C + 8 + j * 12} textAnchor="middle" className="ig-w-ctext">{l}</text>)}
      </svg>
      {b.notes?.length ? (
        <div className="ig-fw-legend">
          {b.notes.map((n, i) => <div key={i} className="ig-fw-note"><b>{n.label}</b><span>{R(n.text)}</span></div>)}
        </div>
      ) : null}
    </div>
  );
}

export function InfographicView({ block: b }: { block: InfographicBlock }) {
  return (
    <div className={`bp-block u ig ig-${b.variant}`}>
      <div className="ig-head">
        {b.kicker && <p className="ig-kicker">{b.kicker}</p>}
        <h2 className="ig-title">{b.title}</h2>
        {b.intro && <p className="ig-intro">{R(b.intro)}</p>}
      </div>

      {b.variant === 'goals' && (
        <div className="ig-goals">
          {b.center && <div className="ig-goal-badge"><span className="ig-goal-ico"><Icon name="people" /></span><b>{b.center}</b></div>}
          <ol className="ig-goal-list">
            {b.items.map((it, i) => (
              <li key={i} className={`ig-goal ig-goal${i % 2}`}>
                <span className="ig-goal-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="ig-goal-ck"><Icon name="check" /></span>
                <span className="ig-goal-tx">{R(it.text)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {b.variant === 'framework' && <Framework b={b} />}

      {b.variant === 'stages' && (
        <div className="ig-stairs" style={{ ['--n' as string]: b.items.length }}>
          {b.items.map((it, i) => (
            <div key={i} className="ig-step" style={{ ['--i' as string]: i }}>
              <div className="ig-step-card">{R(it.text)}</div>
              <div className="ig-step-bar">
                <span className="ig-step-dot" />
                <b>{it.label}</b>
                {it.note && <small>{it.note}</small>}
              </div>
            </div>
          ))}
        </div>
      )}

      {b.variant === 'approaches' && (
        <div className="ig-appr">
          {b.items.map((it, i) => (
            <div key={i} className="ig-ap">
              <div className="ig-ap-side"><span className="ig-ap-no">{i + 1}</span><span className="ig-ap-ico"><Icon name={it.icon ?? 'dot'} /></span></div>
              <div className="ig-ap-body">
                <h3>{it.label}</h3>
                <ul>{it.text.split('\n').filter((l) => l.trim()).map((l, j) => <li key={j}>{R(l)}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {b.variant === 'timeline' && (
        <div className="ig-tl">
          <div className="ig-tl-track">
            {b.items.map((it, i) => (
              <div key={i} className={`ig-tl-item${i === b.items.length - 1 ? ' ig-tl-now' : ''}`}>
                <span className="ig-tl-year">{it.label}</span>
                <span className="ig-tl-dot" />
                <div className="ig-tl-card">{it.text.split('\n').filter((l) => l.trim()).map((l, j) => <p key={j}>{R(l)}</p>)}</div>
              </div>
            ))}
          </div>
          {b.notes?.length ? (
            <div className="ig-tl-notes">
              {b.notes.map((n, i) => <div key={i} className="ig-tl-note"><b>{n.label}</b><span>{R(n.text)}</span></div>)}
            </div>
          ) : null}
        </div>
      )}

      {(b.qr || b.source) && (
        <div className="ig-foot">
          {b.qr && <img className="ig-qr" src={b.qr} alt="Kod QR" />}
          <div className="ig-foot-tx">
            {b.qrLabel && <b>{b.qrLabel}</b>}
            {b.source && <span>{R(b.source)}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
