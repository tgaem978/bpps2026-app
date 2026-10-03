/**
 * Saiz fon (pt) terbesar ≤ maxPt supaya teks muat dalam kotak (mm) - digunakan untuk tajuk,
 * lencana dan partition (seperti kotak teks PPTX yang dikecilkan supaya muat).
 * Lebar perkataan diukur dengan fon sebenar (canvas); anggaran 0.66em jika tiada canvas.
 * Seperti dokumen BPPS, satu baris diutamakan jika muat pada ≥ 85% saiz maksimum.
 */
let ctx2d: CanvasRenderingContext2D | null | undefined;

function widthAt100(text: string, font: string): number {
  if (ctx2d === undefined) ctx2d = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  if (!ctx2d) return text.length * 66;
  ctx2d.font = `700 100px ${font}`;
  return ctx2d.measureText(text).width;
}

/** Lebar teks dalam mm pada saiz pt tertentu. */
const mmAt = (w100: number, pt: number) => (w100 / 100) * pt * 0.3528;

export function fitPt(text: string, font: string, widthMm: number, heightMm: number, maxPt: number, lineH = 1.08, minPt = 7, maxLines = 2): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return maxPt;
  const ww = words.map((w) => widthAt100(w, font));
  const space = widthAt100(' ', font) || 25;
  const full = widthAt100(text.trim(), font);
  const oneLine = (widthMm / ((full / 100) * 0.3528)) * 0.98;
  if (oneLine >= maxPt * 0.85 && oneLine * 0.3528 * lineH <= heightMm) return Math.min(maxPt, Math.floor(oneLine * 2) / 2);
  for (let pt = maxPt; pt >= minPt; pt -= 0.5) {
    const limit = widthMm * 0.98;
    let lines = 1;
    let cur = 0;
    let ok = true;
    for (const w of ww) {
      const wm = mmAt(w, pt);
      if (wm > limit) { ok = false; break; }
      const next = cur ? cur + mmAt(space, pt) + wm : wm;
      if (next > limit) { lines++; cur = wm; } else cur = next;
    }
    if (ok && lines <= maxLines && lines * pt * 0.3528 * lineH <= heightMm) return pt;
  }
  return minPt;
}
