import { ChevronLeft, ChevronRight, Eye, EyeOff, ImagePlus, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { bookSections } from '@/config/sections';
import { useBookStore } from '@/stores/bookStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { useUiStore } from '@/stores/uiStore';
import { blockLabels, readImageFile } from '@/lib/blocks';
import type { BlockType } from '@/types/book';
import BlockEditor, { field } from '@/components/editor/BlockEditor';
import { CoverPage, SectionPage } from '@/components/book/BookPages';

const addable: BlockType[] = ['heading', 'paragraph', 'list', 'table', 'keyvalue', 'image'];
const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2';

export default function SectionEditorPage({ id }: { id: string }) {
  const meta = bookSections.find((s) => s.id === id);
  const [showPreview, setShowPreview] = useState(true);
  const resetSection = useBookStore((s) => s.resetSection);
  const setActive = useNavigationStore((s) => s.setActiveSection);
  const toast = useUiStore((s) => s.toast);
  if (!meta) return null;

  const idx = bookSections.findIndex((s) => s.id === id);
  const prev = bookSections[idx - 1];
  const next = bookSections[idx + 1];
  const Icon = meta.icon;
  const number = id === 'kulit' ? undefined : idx + 1;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="rounded-md bg-primary p-2 text-primary-fg"><Icon size={20} aria-hidden /></span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Bahagian {idx + 1} / {bookSections.length}</p>
            <h2 className="truncate font-display text-xl font-bold md:text-2xl">{meta.label}</h2>
          </div>
        </div>
        <button className={btn} onClick={() => setShowPreview((v) => !v)}>
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          <span className="hidden sm:inline">{showPreview ? 'Sembunyi pratonton' : 'Tunjuk pratonton'}</span>
        </button>
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
          <div className="xl:sticky xl:top-0 xl:self-start">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Pratonton langsung</p>
            {id === 'kulit' ? <CoverPage /> : <SectionPage id={id} number={number} />}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        {prev ? <button className={btn} onClick={() => setActive(prev.id)}><ChevronLeft size={16} /> {prev.label}</button> : <span />}
        {next ? <button className={btn} onClick={() => setActive(next.id)}>{next.label} <ChevronRight size={16} /></button> : <span />}
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
          Tajuk bahagian
          <input className={`${field} mt-1`} value={sec.title} onChange={(e) => updateSection(id, { title: e.target.value })} />
        </label>
        <label className="text-sm font-medium">
          Subtajuk
          <input className={`${field} mt-1`} value={sec.subtitle} onChange={(e) => updateSection(id, { subtitle: e.target.value })} />
        </label>
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
        Moto
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
