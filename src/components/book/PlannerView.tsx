import type { PlannerBlock, PlannerDay } from '@/types/book';
import { importantDates, isHolidayKind, unitColor, unitShort } from '@/lib/planner';

const MONTHS = ['JANUARI', 'FEBRUARI', 'MAC', 'APRIL', 'MEI', 'JUN', 'JULAI', 'OGOS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DISEMBER'];
const MON_SHORT = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
const WEEKDAYS = ['ISNIN', 'SELASA', 'RABU', 'KHAMIS', 'JUMAAT', 'SABTU', 'AHAD'];
const HOLIDAY_LABEL: Record<string, string> = { umum: 'Kelepasan Am', perayaan: 'Perayaan KPM', sekolah: 'Cuti Persekolahan' };
const TODO_LINES = 7;
const RELIEF_ROWS = 6;
const NOTE_LINES = 5;
const MAX_ACTS = 4;
/** Label minggu persekolahan: M01, M02 … M44. */
const wkLabel = (w: string) => (/^\d+$/.test(w) ? `M${w.padStart(2, '0')}` : w);

/** Satu kotak hari dalam grid planner. */
function DayCell({ x, units }: { x: PlannerDay; units: string[] }) {
  const hol = isHolidayKind(x.kind);
  const acts = x.acts.slice(0, x.label ? MAX_ACTS - 1 : MAX_ACTS);
  const more = x.acts.length - acts.length;
  return (
    <div className={`pl-day${x.kind ? ` pl-${x.kind}` : ''}${x.dow === 0 || x.dow === 6 ? ' pl-wkend' : ''}`}>
      <span className="pl-num">{x.d}</span>
      {x.label && <p className={`pl-label${hol ? '' : ' pl-event'}`}>{x.label}</p>}
      {acts.map((a, i) => (
        <p key={i} className="pl-act" style={{ ['--uc' as string]: unitColor(units[a.u] ?? '', a.u) }}>{a.t}</p>
      ))}
      {more > 0 && <p className="pl-more">+{more} lagi</p>}
    </div>
  );
}

/**
 * Planner guru sehalaman sebulan: grid bulanan (Isnin dahulu) dengan nombor minggu persekolahan, hari cuti berwarna
 * dan aktiviti unit daripada Takwim Induk; di bawahnya tarikh penting, senarai tugasan, jadual guru ganti (relief) & catatan.
 */
export function PlannerView({ block }: { block: PlannerBlock }) {
  const p = block.plan;
  const m = block.month;
  if (!p) return <div className="bp-block u"><p className="bp-empty">Planner {MONTHS[m]}: tiada Takwim Induk untuk bulan ini.</p></div>;
  const first = p.days[0];
  const lead = first ? (first.dow + 6) % 7 : 0;
  const cells: (PlannerDay | null)[] = [...Array.from({ length: lead }, () => null), ...p.days];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const mp = [...new Set(p.days.map((x) => x.week).filter(Boolean))];
  const dates = importantDates(p);
  const todo = (block.todo ?? []).filter((t) => t.trim());
  const usedUnits = p.units.map((u, i) => ({ u, i })).filter(({ i }) => p.days.some((x) => x.acts.some((a) => a.u === i)));

  return (
    <div className="bp-block u pl" data-rows={weeks.length}>
      <div className="pl-top">
        <div className="pl-month"><span>{MONTHS[m]}</span><b>{p.year}</b></div>
        <div className="pl-meta">
          {mp.length > 0 && <p className="pl-mp">Minggu persekolahan <b>{wkLabel(mp[0])}{mp.length > 1 ? ` – ${wkLabel(mp[mp.length - 1])}` : ''}</b></p>}
          <p className="pl-legend">
            {(['umum', 'perayaan', 'sekolah'] as const).map((k) => <span key={k} className={`pl-key pl-${k}`}>{HOLIDAY_LABEL[k]}</span>)}
            {usedUnits.map(({ u, i }) => <span key={u} className="pl-key pl-unit" style={{ ['--uc' as string]: unitColor(u, i) }}>{unitShort(u)}</span>)}
          </p>
        </div>
      </div>

      <div className="pl-grid">
        <div className="pl-head"><span className="pl-wk">MG</span>{WEEKDAYS.map((d, i) => <span key={d} className={i >= 5 ? 'pl-wkend' : ''}>{d}</span>)}</div>
        {weeks.map((w, wi) => {
          const wk = w.find((x) => x?.week)?.week ?? '';
          return (
            <div key={wi} className="pl-row">
              <span className="pl-wk">{wk ? wkLabel(wk) : ''}</span>
              {w.map((x, i) => (x ? <DayCell key={i} x={x} units={p.units} /> : <div key={i} className="pl-day pl-out" />))}
            </div>
          );
        })}
      </div>

      <div className="pl-bottom">
        <section className="pl-box">
          <h4>TARIKH PENTING</h4>
          {dates.length ? (
            <ul className="pl-dates">
              {dates.slice(0, 7).map((d, i) => (
                <li key={i} className={d.kind ? `pl-${d.kind}` : 'pl-event'}>
                  <b>{d.from === d.to ? d.from : `${d.from} – ${d.to}`} {MON_SHORT[m]}</b><span>{d.label}</span>
                </li>
              ))}
              {dates.length > 7 && <li className="pl-more">+{dates.length - 7} lagi dalam Takwim Induk</li>}
            </ul>
          ) : <p className="pl-none">Tiada cuti / acara seluruh sekolah bulan ini.</p>}
        </section>
        <section className="pl-box" data-f="todo">
          <h4>SENARAI TUGASAN</h4>
          <ul className="pl-todo">
            {Array.from({ length: Math.max(TODO_LINES, todo.length) }, (_, i) => <li key={i}><span className="pl-check" />{todo[i] ?? ''}</li>)}
          </ul>
        </section>
        <section className="pl-box">
          <h4>GURU GANTI (RELIEF)</h4>
          <table className="pl-relief">
            <thead><tr><th>TARIKH</th><th>MASA</th><th>KELAS</th><th>MATA PELAJARAN</th></tr></thead>
            <tbody>{Array.from({ length: RELIEF_ROWS }, (_, i) => <tr key={i}><td /><td /><td /><td /></tr>)}</tbody>
          </table>
        </section>
        <section className="pl-box" data-f="notes">
          <h4>CATATAN</h4>
          {block.notes?.trim() ? <p className="pl-notes">{block.notes}</p> : null}
          <div className="pl-lines">{Array.from({ length: block.notes?.trim() ? 2 : NOTE_LINES }, (_, i) => <span key={i} />)}</div>
        </section>
      </div>
    </div>
  );
}
