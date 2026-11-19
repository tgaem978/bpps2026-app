import { useEffect, useState } from 'react';
import type { PhotoFrame } from '@/types/staff';

/**
 * Bingkai gambar potret dalam bulatan carta: zum + titik fokus (pecahan 0-1 lebar/tinggi imej asal).
 * Lalai: zum 1.6 dengan fokus pada muka (40% tinggi imej), supaya muka (bukan latar) mengisi bulatan,
 * kepala tidak terlalu tinggi dan tidak terpotong.
 */
export const DEFAULT_FRAME: PhotoFrame = { zoom: 1.6, x: 0.5, y: 0.4 };
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 2.5;

export const frameOf = (f?: Partial<PhotoFrame> | null): PhotoFrame => ({ ...DEFAULT_FRAME, ...(f ?? {}) });

/** Tetingkap segi empat (piksel imej asal) bagi bingkai, dikepit dalam imej. */
export function frameWindow(w: number, h: number, f: PhotoFrame) {
  const side = Math.min(w, h) / Math.max(ZOOM_MIN, f.zoom);
  const cx = Math.min(w - side / 2, Math.max(side / 2, f.x * w));
  const cy = Math.min(h - side / 2, Math.max(side / 2, f.y * h));
  return { sx: cx - side / 2, sy: cy - side / 2, side };
}

const key = (src: string, f: PhotoFrame) => `${f.zoom.toFixed(3)}|${f.x.toFixed(3)}|${f.y.toFixed(3)}|${src}`;
const cache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

/** Hasil segera daripada cache (atau null jika belum dijana). */
export const framedCached = (src: string, f: PhotoFrame) => cache.get(key(src, f)) ?? null;

/** Jana gambar segi empat (480 px) mengikut bingkai; disimpan dalam cache supaya cetakan/PPTX serta-merta. */
export function framePhoto(src: string, f: PhotoFrame, size = 480): Promise<string> {
  const k = key(src, f);
  const hit = cache.get(k);
  if (hit) return Promise.resolve(hit);
  const wait = pending.get(k);
  if (wait) return wait;
  const job = new Promise<string>((resolve) => {
    const img = new Image();
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const { sx, sy, side } = frameWindow(img.naturalWidth, img.naturalHeight, f);
        const out = Math.min(size, Math.round(side * 1.5)) || size;
        const c = document.createElement('canvas');
        c.width = out;
        c.height = out;
        const ctx = c.getContext('2d');
        if (!ctx) return resolve(src);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
        const url = c.toDataURL('image/jpeg', 0.9);
        cache.set(k, url);
        resolve(url);
      } catch {
        resolve(src); // kanvas tercemar (imej luar tanpa CORS): guna imej asal
      } finally {
        pending.delete(k);
      }
    };
    img.onerror = () => { pending.delete(k); resolve(src); };
    img.src = src;
  });
  pending.set(k, job);
  return job;
}

/** Sumber gambar berbingkai untuk dipaparkan: imej asal sementara bingkai dijana. */
export function useFramedPhoto(src: string, frame?: Partial<PhotoFrame> | null): string {
  const f = frameOf(frame);
  const [url, setUrl] = useState(() => (src ? framedCached(src, f) ?? '' : ''));
  const k = src ? key(src, f) : '';
  useEffect(() => {
    if (!src) { setUrl(''); return; }
    let live = true;
    const hit = framedCached(src, f);
    if (hit) setUrl(hit);
    else void framePhoto(src, f).then((u) => { if (live) setUrl(u); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k]);
  return url || src;
}
