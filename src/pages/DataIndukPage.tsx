import { useMemo, useState } from 'react';
import { Download, RefreshCw, Search, UsersRound } from 'lucide-react';
import { useBookStore } from '@/stores/bookStore';
import { useStaffStore } from '@/stores/staffStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useBookCtx, useSections } from '@/lib/pagination';
import { buildDataInduk, dataIndukCsv, jawatanOf, KOMPONEN, RUMAH_NAMES, type DataIndukRow, type Komponen } from '@/lib/dataInduk';
import { nameOf, sortTeachers, valueText } from '@/lib/resolve';
import { F_POSITION, F_SESSION } from '@/types/staff';
import { useProjectStore } from '@/stores/projectStore';

const fmtAt = (t: number | null) => (t ? new Date(t).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const th = 'border border-white/20 px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide';
const td = 'border border-border px-2 py-1.5 align-top text-xs';

/**
 * DATA INDUK GURU: senarai berjadual seperti Senarai Nama Guru + bidang tugas mengikut komponen.
 * Dijana automatik daripada kandungan buku semasa — setiap kiriman Portal Kemas Kini yang diterima mengemas kini jadual ini.
 */
export default function DataIndukPage() {
  const year = useProjectStore((s) => s.profile.year);
  const ctx = useBookCtx();
  const sections = useSections();
  const outline = useBookStore((s) => s.outline);
  const setValue = useStaffStore((s) => s.setValue);
  const rumahMap = useSettingsStore((s) => s.rumahMap);
  const setRumahMap = useSettingsStore((s) => s.setRumahMap);
  const [q, setQ] = useState('');
  const [sesi, setSesi] = useState('');
  const [guruOnly, setGuruOnly] = useState(true);

  const all = useMemo(() => {
    const rows = buildDataInduk(ctx, sections, outline, rumahMap);
    const order = new Map(sortTeachers(ctx, ctx.teachers).map((t, i) => [t.id, i]));
    return rows.sort((a, b) => (order.get(a.teacher.id) ?? 0) - (order.get(b.teacher.id) ?? 0));
  }, [ctx, sections, outline, rumahMap]);

  const isAkp = (r: DataIndukRow) => /Pembantu|Akauntan|Ketua Pembantu/i.test(valueText(r.teacher.values[F_POSITION]));
  const rows = all.filter((r) => (!guruOnly || !isAkp(r))
    && (!sesi || valueText(r.teacher.values[F_SESSION]) === sesi)
    && (!q || nameOf(r.teacher).toLowerCase().includes(q.toLowerCase())));

  // Rumah sukan lama (cth. warna) yang belum dipadankan dengan nama rasmi.
  const oldHouses = useMemo(() => {
    const set = new Set<string>();
    for (const sid of Object.keys(sections)) if (/^kk-rumah-/.test(sid) && /^RUMAH\s/i.test(sections[sid].title)) set.add(sections[sid].title.replace(/^RUMAH\s+/i, '').trim().toUpperCase());
    return [...set].filter((h) => !RUMAH_NAMES.some((n) => n.toUpperCase() === h));
  }, [sections]);

  const lastPortal = all.reduce<{ at: number; by: string } | null>((m, r) => (r.lastAt && (!m || r.lastAt > m.at) ? { at: r.lastAt, by: r.lastBy } : m), null);
  const withTugas = all.filter((r) => r.jumlah > 0).length;

  const cell = (r: DataIndukRow, k: Komponen) => {
    const list = r.tugas[k];
    if (k === 'rumah') return r.rumah ? <span className="font-semibold">{r.rumah}</span> : <span className="text-muted">—</span>;
    if (!list.length) return <span className="text-muted">—</span>;
    return <ul className="grid gap-0.5">{list.map((x, i) => <li key={i} className="leading-snug">• {x.text}</li>)}</ul>;
  };

  const exportCsv = () => {
    const cols = [
      { label: 'BIL', value: (r: DataIndukRow) => String(rows.indexOf(r) + 1) },
      { label: 'NAMA', value: (r: DataIndukRow) => nameOf(r.teacher) },
      { label: 'JAWATAN', value: (r: DataIndukRow) => jawatanOf(r.teacher) },
      { label: 'SESI', value: (r: DataIndukRow) => valueText(r.teacher.values[F_SESSION]) },
      { label: 'OPSYEN', value: (r: DataIndukRow) => valueText(r.teacher.values.opsyen) },
      { label: 'NO. TELEFON', value: (r: DataIndukRow) => valueText(r.teacher.values.telefon) },
      ...KOMPONEN.map((k) => ({ label: k.group ? `${k.group} - ${k.label}` : k.label, value: (r: DataIndukRow) => (k.id === 'rumah' ? r.rumah : r.tugas[k.id].map((x) => x.text).join('; ')) })),
      { label: 'JUMLAH TUGAS', value: (r: DataIndukRow) => String(r.jumlah) },
      { label: 'KEMAS KINI TERAKHIR', value: (r: DataIndukRow) => `${fmtAt(r.lastAt)}${r.lastBy ? ` (${r.lastBy})` : ''}` },
    ];
    const blob = new Blob([dataIndukCsv(rows, cols)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `Data-Induk-Guru-${year}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  return (
    <div className="mx-auto grid max-w-[1600px] gap-5" data-page="data-induk">
      <section className="pt-hero relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 text-white shadow-card md:flex-row md:items-center">
        <div className="self-start rounded-lg border border-[#C9A13B]/60 bg-white/10 p-3 text-[#E8C766]"><UsersRound size={32} aria-hidden /></div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E8C766]">Data Induk Guru · BPPS {year}</p>
          <h2 className="pt-display mt-1 text-3xl leading-tight">Bidang tugas setiap guru, dikemas kini automatik</h2>
          <p className="mt-1 text-sm opacity-85">
            Jadual ini dijana daripada halaman buku semasa. Setiap kali Pentadbir Sistem menerima kiriman Setiausaha Unit di Portal Kemas Kini, tugas guru dalam jawatankuasa, unit beruniform, kelab, sukan dan rumah sukan dikemas kini di sini serta-merta.
          </p>
        </div>
        <div className="grid shrink-0 gap-1 rounded-lg bg-white/10 px-4 py-3 text-sm">
          <span className="inline-flex items-center gap-1.5 text-[#E8C766]"><RefreshCw size={14} /> Automatik</span>
          <span><b className="text-xl">{withTugas}</b> / {all.length} guru & staf bertugas</span>
          <span className="text-xs opacity-80">Kemas kini terakhir: {lastPortal ? `${fmtAt(lastPortal.at)}${lastPortal.by ? ` · ${lastPortal.by}` : ''}` : '—'}</span>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-card">
        <label className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-2.5 top-2.5 text-muted" aria-hidden />
          <input className="w-full rounded-md border border-border bg-surface py-2 pl-8 pr-3 text-sm" placeholder="Cari nama guru…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari nama guru" />
        </label>
        <select className="rounded-md border border-border bg-surface px-3 py-2 text-sm" value={sesi} onChange={(e) => setSesi(e.target.value)} aria-label="Sesi">
          <option value="">Semua sesi</option><option value="Pagi">Sesi pagi</option><option value="Petang">Sesi petang</option>
        </select>
        <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={guruOnly} onChange={(e) => setGuruOnly(e.target.checked)} /> Guru sahaja (tanpa AKP)</label>
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface-2" onClick={exportCsv}><Download size={15} /> Muat turun Excel (CSV)</button>
      </div>

      {oldHouses.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <b>Padanan Rumah Sukan:</b>
          <span>Halaman rumah sukan masih menggunakan nama lama. Pilih nama rasmi bagi setiap rumah:</span>
          {oldHouses.map((h) => (
            <label key={h} className="inline-flex items-center gap-1.5">
              <span className="font-semibold">{h}</span> →
              <select className="rounded border border-amber-300 bg-white px-2 py-1" value={rumahMap[h] ?? ''} onChange={(e) => setRumahMap({ ...rumahMap, [h]: e.target.value })}>
                <option value="">(belum dipilih)</option>
                {RUMAH_NAMES.filter((n) => n !== 'Jingga').map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          ))}
          <span className="text-xs">Guru PPKI → Jingga (automatik).</span>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-card">
        <table className="w-full min-w-[1900px] border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0B2A5B] text-white">
              <th rowSpan={2} className={th}>Bil</th>
              <th rowSpan={2} className={`${th} min-w-[220px] text-left`}>Nama</th>
              <th rowSpan={2} className={`${th} min-w-[160px]`}>Jawatan</th>
              <th rowSpan={2} className={th}>Sesi</th>
              <th rowSpan={2} className={`${th} min-w-[110px]`}>Opsyen</th>
              <th rowSpan={2} className={`${th} min-w-[130px]`}>No. Telefon</th>
              {KOMPONEN.filter((k) => !k.group).slice(0, 3).map((k) => <th key={k.id} rowSpan={2} className={`${th} min-w-[200px]`}>{k.label}</th>)}
              <th colSpan={5} className={`${th} bg-[#163E7A]`}>Kokurikulum</th>
              {KOMPONEN.filter((k) => !k.group).slice(3).map((k) => <th key={k.id} rowSpan={2} className={`${th} min-w-[170px]`}>{k.label}</th>)}
              <th rowSpan={2} className={th}>Jumlah Tugas</th>
              <th rowSpan={2} className={`${th} min-w-[140px]`}>Kemas Kini Terakhir</th>
            </tr>
            <tr className="bg-[#163E7A] text-[#E8C766]">
              {KOMPONEN.filter((k) => k.group).map((k) => <th key={k.id} className={`${th} min-w-[160px]`}>{k.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.teacher.id} className={i % 2 ? 'bg-surface-2/40' : ''}>
                <td className={`${td} text-center`}>{i + 1}</td>
                <td className={`${td} font-semibold`}>{nameOf(r.teacher)}</td>
                <td className={td}>{jawatanOf(r.teacher)}</td>
                <td className={`${td} text-center`}>{valueText(r.teacher.values[F_SESSION]) || '—'}</td>
                <td className={td}>{valueText(r.teacher.values.opsyen) || '—'}</td>
                <td className={td}>
                  <input className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-xs hover:border-border focus:border-primary" value={valueText(r.teacher.values.telefon)} placeholder="+ No. telefon" aria-label={`No. telefon ${nameOf(r.teacher)}`} onChange={(e) => setValue(r.teacher.id, 'telefon', e.target.value)} />
                </td>
                {KOMPONEN.filter((k) => !k.group).slice(0, 3).map((k) => <td key={k.id} className={td}>{cell(r, k.id)}</td>)}
                {KOMPONEN.filter((k) => k.group).map((k) => <td key={k.id} className={`${td} bg-[#F6EBCB]/25`}>{cell(r, k.id)}</td>)}
                {KOMPONEN.filter((k) => !k.group).slice(3).map((k) => <td key={k.id} className={td}>{cell(r, k.id)}</td>)}
                <td className={`${td} text-center font-bold`}>{r.jumlah}</td>
                <td className={td}>{fmtAt(r.lastAt)}{r.lastBy && <span className="block text-[10px] text-muted">{r.lastBy}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Tugas dikesan daripada nama guru dalam jawatankuasa, jadual dan senarai setiap bahagian buku. No. telefon disimpan dalam Pangkalan Data Guru (Tetapan) dan boleh diisi terus di sini.</p>
    </div>
  );
}
