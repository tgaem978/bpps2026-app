import { ArrowDown, ArrowUp, CornerDownRight, FilePlus2, FolderPlus, PenLine, Plus, Trash2 } from 'lucide-react';
import { useBookStore } from '@/stores/bookStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { navigate } from '@/lib/router';
import { layoutOptions } from '@/templates/master';

const field = 'w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm';
const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2';
const iconBtn = 'rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30';

function TopicRow({ id, partId, level, index, count, partOptions }: {
  id: string; partId: string; level: 1 | 2; index: number; count: number; partOptions: { id: string; title: string }[];
}) {
  const sec = useBookStore((s) => s.sections[id]);
  const { updateSection, moveTopic, removeTopic, moveTopicToPart, addTopic } = useBookStore();
  const setActive = useNavigationStore((s) => s.setActiveSection);
  if (!sec) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1.5 rounded-md py-1 ${level === 2 ? 'pl-8' : ''}`}>
      {level === 2 ? <CornerDownRight size={15} className="shrink-0 text-muted" /> : <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
      <input
        className={`${field} min-w-[12rem] flex-1 ${level === 1 ? 'font-semibold' : ''}`}
        value={sec.title}
        onChange={(e) => updateSection(id, { title: e.target.value })}
        aria-label={level === 1 ? 'Tajuk' : 'Subtajuk'}
      />
      <span className="hidden rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted md:inline">{layoutOptions.find((o) => o.id === sec.layout)?.label}</span>
      <button className={iconBtn} disabled={index === 0} onClick={() => moveTopic(id, -1)} aria-label="Naik"><ArrowUp size={15} /></button>
      <button className={iconBtn} disabled={index === count - 1} onClick={() => moveTopic(id, 1)} aria-label="Turun"><ArrowDown size={15} /></button>
      {level === 1 && (
        <>
          <button className={iconBtn} onClick={() => addTopic(partId, id)} title="Tambah subtajuk" aria-label="Tambah subtajuk"><Plus size={15} /></button>
          <select className="rounded-md border border-border bg-surface px-1.5 py-1 text-xs" value={partId} onChange={(e) => moveTopicToPart(id, e.target.value)} aria-label="Pindah ke bahagian">
            {partOptions.map((p, i) => <option key={p.id} value={p.id}>→ {i + 1}. {p.title}</option>)}
          </select>
        </>
      )}
      <button className={iconBtn} onClick={() => { setActive(id); navigate('/'); }} title="Sunting kandungan" aria-label="Sunting kandungan"><PenLine size={15} /></button>
      <button
        className={`${iconBtn} hover:!text-red-600`}
        onClick={() => window.confirm(`Padam "${sec.title}"${level === 1 ? ' berserta subtajuknya' : ''} dan kandungannya?`) && removeTopic(id)}
        aria-label="Padam"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

/** Struktur kandungan: bahagian utama → tajuk → subtajuk. Panel navigasi & isi kandungan mengikut susunan ini. */
export default function OutlineSettings() {
  const { outline, addPart, updatePart, removePart, movePart, addTopic } = useBookStore();
  const partOptions = outline.map((p) => ({ id: p.id, title: p.title }));
  return (
    <div className="grid gap-4">
      <div>
        <h3 className="font-display text-lg font-bold">Struktur Kandungan</h3>
        <p className="text-sm text-muted">
          Susun pecahan utama, tajuk dan subtajuk. Panel navigasi kiri, halaman partition dan Isi Kandungan dijana automatik mengikut susunan ini.
        </p>
      </div>
      {outline.map((part, pi) => (
        <section key={part.id} className="rounded-lg border border-border bg-surface shadow-card">
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-2 p-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-fg">{pi + 1}</span>
            <input className={`${field} min-w-[12rem] flex-1 font-display font-bold uppercase`} value={part.title} onChange={(e) => updatePart(part.id, { title: e.target.value })} aria-label="Nama bahagian utama" />
            <label className="flex items-center gap-1.5 text-xs font-medium">
              <input type="checkbox" checked={part.divider} onChange={(e) => updatePart(part.id, { divider: e.target.checked })} /> Partition
            </label>
            <button className={iconBtn} disabled={pi === 0} onClick={() => movePart(part.id, -1)} aria-label="Naik"><ArrowUp size={15} /></button>
            <button className={iconBtn} disabled={pi === outline.length - 1} onClick={() => movePart(part.id, 1)} aria-label="Turun"><ArrowDown size={15} /></button>
            <button
              className={`${iconBtn} hover:!text-red-600`}
              onClick={() => window.confirm(`Padam bahagian "${part.title}" berserta semua tajuknya?`) && removePart(part.id)}
              aria-label="Padam bahagian"
            >
              <Trash2 size={15} />
            </button>
            {part.divider && (
              <input
                className={`${field} basis-full text-xs`}
                placeholder="Catatan partition (cth. nama penyelaras, atau {{jawatan:GPK Kokurikulum}})"
                value={part.note}
                onChange={(e) => updatePart(part.id, { note: e.target.value })}
                aria-label="Catatan partition"
              />
            )}
          </div>
          <div className="grid gap-0.5 p-3">
            {part.topics.length === 0 && <p className="py-2 text-sm text-muted">Belum ada tajuk.</p>}
            {part.topics.map((t, ti) => (
              <div key={t.id}>
                <TopicRow id={t.id} partId={part.id} level={1} index={ti} count={part.topics.length} partOptions={partOptions} />
                {t.children.map((c, ci) => (
                  <TopicRow key={c} id={c} partId={part.id} level={2} index={ci} count={t.children.length} partOptions={partOptions} />
                ))}
              </div>
            ))}
            <button className={`${btn} mt-2 justify-self-start`} onClick={() => addTopic(part.id)}><FilePlus2 size={15} /> Tambah tajuk</button>
          </div>
        </section>
      ))}
      <button className={`${btn} justify-self-start`} onClick={addPart}><FolderPlus size={15} /> Tambah bahagian utama</button>
    </div>
  );
}
