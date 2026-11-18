import { useRef } from 'react';
import { Move, RotateCcw } from 'lucide-react';
import type { PhotoFrame } from '@/types/staff';
import { DEFAULT_FRAME, ZOOM_MAX, ZOOM_MIN, frameOf, useFramedPhoto } from '@/lib/photoFrame';

const btn = 'inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium hover:bg-bg';

/**
 * Laras kedudukan gambar dalam bulatan carta organisasi: seret gambar untuk mengalih muka ke tengah,
 * gunakan peluncur untuk zum. Pratonton = rupa sebenar dalam carta (bingkai emas).
 */
export function PhotoFrameEditor({ src, frame, onChange }: { src: string; frame?: PhotoFrame; onChange: (f: PhotoFrame | undefined) => void }) {
  const f = frameOf(frame);
  const shown = useFramedPhoto(src, f);
  const drag = useRef<{ x: number; y: number; f: PhotoFrame } | null>(null);
  const set = (patch: Partial<PhotoFrame>) => onChange({ ...f, ...patch });
  const clamp = (v: number) => Math.min(1, Math.max(0, +v.toFixed(3)));
  const isDefault = f.zoom === DEFAULT_FRAME.zoom && f.x === DEFAULT_FRAME.x && f.y === DEFAULT_FRAME.y;

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-bg/60 p-3 sm:col-span-2 lg:col-span-3">
      <div
        className="relative h-28 w-28 shrink-0 cursor-grab touch-none select-none rounded-full p-[7px] shadow active:cursor-grabbing"
        style={{ background: 'linear-gradient(155deg,#F5E3A3 0%,#C9A13B 55%,#B8902F 100%)' }}
        title="Seret untuk mengalih kedudukan muka"
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, f }; }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          // seret ke kanan = gambar bergerak ke kanan = fokus ke kiri (skala: 1 lebar pratonton ≈ 1/zum imej)
          const k = 1 / (112 * d.f.zoom);
          onChange({ ...d.f, x: clamp(d.f.x - (e.clientX - d.x) * k), y: clamp(d.f.y - (e.clientY - d.y) * k) });
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
      >
        <img src={shown} alt="" draggable={false} className="h-full w-full rounded-full border-2 border-white object-cover" />
      </div>
      <div className="grid min-w-[200px] flex-1 gap-2 text-xs">
        <p className="flex items-center gap-1.5 font-semibold text-text"><Move size={14} /> Kedudukan gambar dalam bulatan carta</p>
        <label className="grid grid-cols-[70px_1fr] items-center gap-2 text-muted">Zum
          <input type="range" min={ZOOM_MIN} max={ZOOM_MAX} step={0.05} value={f.zoom} onChange={(e) => set({ zoom: +e.target.value })} />
        </label>
        <label className="grid grid-cols-[70px_1fr] items-center gap-2 text-muted">Mendatar
          <input type="range" min={0} max={1} step={0.01} value={f.x} onChange={(e) => set({ x: +e.target.value })} />
        </label>
        <label className="grid grid-cols-[70px_1fr] items-center gap-2 text-muted">Menegak
          <input type="range" min={0} max={1} step={0.01} value={f.y} onChange={(e) => set({ y: +e.target.value })} />
        </label>
        <p className="text-muted">Seret gambar atau gunakan peluncur. Muka sebaiknya di tengah, dengan sedikit ruang di atas kepala.</p>
        {!isDefault && <button className={`${btn} justify-self-start`} onClick={() => onChange(undefined)}><RotateCcw size={13} /> Kedudukan lalai</button>}
      </div>
    </div>
  );
}
