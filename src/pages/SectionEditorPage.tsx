import { BookOpen, ChevronLeft, ChevronRight, Eye, EyeOff, ImagePlus, Plus, RotateCcw, Settings2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { iconFor } from '@/config/sections';
import { flattenOutline, locate } from '@/lib/outline';
import { layoutOptions } from '@/templates/master';
import { navigate } from '@/lib/router';
import { useBookStore } from '@/stores/bookStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';
import { blockLabels, readImageFile } from '@/lib/blocks';
import type { BlockType } from '@/types/book';
import BlockEditor, { field } from '@/components/editor/BlockEditor';
import { SectionPages } from '@/components/book/BookPages';
import { templateAssets } from '@/templates/bpps';

const addable: BlockType[] = ['heading', 'paragraph', 'list', 'table', 'keyvalue', 'image', 'orgchart', 'committee', 'stafflist'];
const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2';

export default function SectionEditorPage({ id }: { id: string }) {
  const [showPreview, setShowPreview] = useState(true);
  const resetSection = useBookStore((s) => s.resetSection);
  const outline = useBookStore((s) => s.outline);
  const sections = useBookStore((s) => s.sections);
  const setActive = useNavigationStore((s) => s.setActiveSection);
  const setSettingsTab = useNavigationStore((s) => s.setSettingsTab);
  const toast = useUiStore((s) => s.toast);

  const order = ['kulit', ...flattenOutline(outline).map((e) => e.id)];
  const idx = order.indexOf(id);
  if (idx < 0) return null;
  const loc = locate(outline, id);
  const part = outline.find((p) => p.id === loc?.partId);
  const parentTitle = loc?.parentId ? sections[loc.parentId]?.title : undefined;
  const titleOf = (x: string) => (x === 'kulit' ? 'Muka Hadapan' : sections[x]?.title || 'Tanpa tajuk');
  const meta = { label: titleOf(id) };
  const prev = order[idx - 1] ? { id: order[idx - 1], label: titleOf(order[idx - 1]) } : undefined;
  const next = order[idx + 1] ? { id: order[idx + 1], label: titleOf(order[idx + 1]) } : undefined;
  const Icon = id === 'kulit' ? BookOpen : iconFor(id);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="rounded-md bg-primary p-2 text-primary-fg"><Icon size={20} aria-hidden /></span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-wider text-accent">
              {part ? `${outline.indexOf(part) + 1}. ${part.title}` : 'Kulit buku'}{parentTitle ? ` › ${parentTitle}` : ''}
            </p>
            <h2 className="truncate font-display text-xl font-bold md:text-2xl">{meta.label}</h2>
          </div>
        </div>
        <button className={btn} onClick={() => setShowPreview((v) => !v)}>
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="hidden sm:inline">{showPreview ? 'Sembunyi pratonton' : 'Tunjuk pratonton'}</span>
        </button>
        {id !== 'kulit' && (
          <button className={btn} onClick={() => { setSettingsTab('kandungan'); navigate('/settings'); }} title="Susun bahagian, tajuk & subtajuk">
            <Settings2 size={16} /> <span className="hidden sm:inline">Struktur</span>
          </button>
        )}
        <button
          className={btn}
          onClick={() => {
            if (window.confirm(`Set semula bahagian ${meta.label} kepada kandungan asal? Perubahan anda akan hilang.`)) {
              resetSection(id);
              toast(`${meta.label} telah diset semula.`, 'info');
            }
          }}
        >
          <RotateCcw size={16} /> <span className="hidden sm:inline">Set semula</span>
        </button>
      </div>

      <div className={`grid gap-6 ${showPreview ? 'xl:grid-cols-2' : ''}`}>
        <div className="grid content-start gap-4">
          {id === 'kulit' ? <CoverForm /> : <SectionForm id={id} />}
        </div>
        {showPreview && (
          <div className="xl:sticky xl:top-0 xl:max-h-[calc(100vh-9rem)] xl:self-start xl:overflow-y-auto">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Pratonton langsung · A4</p>
            <div className="mx-auto grid max-w-md gap-4">
              <SectionPages id={id} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        {prev ? <button className={btn} onClick={() => setActive(prev.id)}><ChevronLeft size={16} /> <span className="max-w-[34vw] truncate">{prev.label}</span></button> : <span />}
        {next ? <button className={btn} onClick={() => setActive(next.id)}><span className="max-w-[34vw] truncate">{next.label}</span> <ChevronRight size={16} /></button> : <span />}
      </div>
    </div>
  );
}

function SectionForm({ id }: { id: string }) {
  const sec = useBookStore((s) => s.sections[id]);
  const { updateSection, addBlock, updateBlock, removeBlock, moveBlock } = useBookStore();
  if (!sec) return null;

  return (
    <>
      <div className="grid gap-3 rounded-lg border border-border bg-surface p-4 shadow-card sm:grid-cols-2">
        <label className="text-sm font-medium">
          Tajuk
          <input className={`${field} mt-1`} value={sec.title} onChange={(e) => updateSection(id, { title: e.target.value })} />
        </label>
        <label className="text-sm font-medium">
          Lencana tajuk <span className="font-normal text-muted">(pilihan, cth. SESI PAGI)</span>
          <input className={`${field} mt-1`} value={sec.subtitle} onChange={(e) => updateSection(id, { subtitle: e.target.value })} />
        </label>
        <div className="sm:col-span-2">
          <p className="text-sm font-medium">Jenis halaman</p>
          <div className="mt-1 grid gap-2 sm:grid-cols-4">
            {layoutOptions.map((o) => (
              <button
                key={o.id}
                onClick={() => updateSection(id, { layout: o.id })}
                className={`rounded-md border p-2 text-left text-xs transition ${sec.layout === o.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-surface-2'}`}
                aria-pressed={sec.layout === o.id}
              >
                <span className="block text-sm font-semibold">{o.label}</span>
                <span className="text-muted">{o.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {sec.blocks.length === 0 && (
        <p className="rounded-lg border-2 border-dashed border-border p-6 text-center text-sm text-muted">Tiada kandungan. Tambah blok di bawah.</p>
      )}
      {sec.blocks.map((b, i) => (
        <BlockEditor
          key={b.id}
          block={b}
          index={i}
          total={sec.blocks.length}
          onChange={(nb) => updateBlock(id, b.id, nb)}
          onRemove={() => removeBlock(id, b.id)}
          onMove={(d) => moveBlock(id, b.id, d)}
        />
      ))}

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-3">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Tambah</span>
        {addable.map((t) => (
          <button key={t} className={btn} onClick={() => addBlock(id, t)}>
            <Plus size={14} /> {blockLabels[t]}
          </button>
        ))}
      </div>
    </>
  );
}

function CoverForm() {
  const cover = useBookStore((s) => s.cover);
  const updateCover = useBookStore((s) => s.updateCover);
  const toast = useUiStore((s) => s.toast);

  return (
    <div className="grid gap-4 rounded-lg border border-border bg-surface p-4 shadow-card">
      <div className="text-sm font-medium">
        Reka bentuk muka hadapan
        <p className="mt-0.5 text-xs font-normal text-muted">
          Seperti template PPTX: muka hadapan ialah satu imej reka bentuk penuh (A4 potret). Muat naik reka bentuk anda sendiri,
          atau kosongkan untuk menjana kulit daripada teks di bawah.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {cover.image && <img src={cover.image} alt="" className="h-24 w-[68px] rounded border border-border object-cover" />}
          <label className={`${btn} cursor-pointer`}>
            <ImagePlus size={16} /> Muat naik reka bentuk
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                try { updateCover({ image: await readImageFile(f, 2_500_000) }); } catch (err) { toast((err as Error).message, 'error'); }
              }}
            />
          </label>
          {cover.image !== templateAssets.cover && (
            <button className={btn} onClick={() => updateCover({ image: templateAssets.cover })}><RotateCcw size={16} /> Guna kulit template</button>
          )}
          {cover.image && <button className={btn} onClick={() => updateCover({ image: '' })}><Trash2 size={16} /> Jana daripada teks</button>}
        </div>
      </div>
      <label className="text-sm font-medium">
        Tajuk buku
        <input className={`${field} mt-1`} value={cover.title} onChange={(e) => updateCover({ title: e.target.value })} />
      </label>
      <label className="text-sm font-medium">
        Subtajuk
        <input className={`${field} mt-1`} value={cover.subtitle} onChange={(e) => updateCover({ subtitle: e.target.value })} />
      </label>
      <label className="text-sm font-medium">
        Alamat sekolah
        <input className={`${field} mt-1`} value={cover.address} onChange={(e) => updateCover({ address: e.target.value })} />
      </label>
      <label className="text-sm font-medium">
        Moto <span className="font-normal text-muted">(juga dipaparkan di kaki setiap halaman)</span>
        <input className={`${field} mt-1`} value={cover.motto} onChange={(e) => updateCover({ motto: e.target.value })} />
      </label>
      <div className="text-sm font-medium">
        Logo sekolah
        <div className="mt-1 flex items-center gap-3">
          {cover.logo && <img src={cover.logo} alt="Logo" className="h-16 w-16 rounded-md border border-border object-contain" />}
          <label className={`${btn} cursor-pointer`}>
            <ImagePlus size={16} /> {cover.logo ? 'Tukar logo' : 'Muat naik logo'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                try { updateCover({ logo: await readImageFile(f, 800_000) }); } catch (err) { toast((err as Error).message, 'error'); }
              }}
            />
          </label>
          {cover.logo && <button className={btn} onClick={() => updateCover({ logo: '' })}><Trash2 size={16} /> Buang</button>}
        </div>
        <p className="mt-1 text-xs font-normal text-muted">Nama sekolah diambil daripada halaman Projek.</p>
      </div>
    </div>
  );
}
