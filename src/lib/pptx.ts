import { useProjectStore } from '@/stores/projectStore';

// A4 potret dalam inci (sama seperti dokumen PPTX asal BPPS).
const W = 8.27;
const H = 11.69;

/**
 * Satu halaman A4 = satu slaid potret.
 * - 'native' (lalai): objek PowerPoint boleh disunting - teks, jadual, bentuk, gambar, Slide Master + placeholder tajuk.
 * - 'image': setiap halaman ditangkap sebagai imej resolusi tinggi (rupa tepat); teks dalam nota penceramah.
 * Pustaka dimuatkan hanya bila diperlukan (tidak membesarkan muatan awal aplikasi).
 */
export type PptMode = 'native' | 'image';

export async function exportPagesToPptx(wraps: HTMLElement[], label: string, onProgress: (done: number, total: number) => void, mode: PptMode = 'native') {
  if (!wraps.length) throw new Error('Tiada halaman untuk dieksport.');
  const [{ default: PptxGenJS }, { toJpeg, getFontEmbedCSS }, native] = await Promise.all([import('pptxgenjs'), import('html-to-image'), import('./pptxNative')]);
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'A4P', width: W, height: H });
  pptx.layout = 'A4P';
  const school = useProjectStore.getState().profile.shortName;
  pptx.company = school;
  pptx.title = `BPPS 2026 - ${label}`;

  const safe = label.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (mode === 'native') {
    onProgress(0, wraps.length);
    await native.buildNativePptx(pptx, wraps, onProgress);
    await pptx.writeFile({ fileName: `BPPS2026 - ${safe}.pptx` });
    return;
  }

  // CSS fon web dibenamkan sekali sahaja, kemudian diguna semula untuk setiap halaman.
  const fontEmbedCSS = await getFontEmbedCSS(wraps[0]).catch(() => '');
  const pixelRatio = Math.max(1, 1754 / wraps[0].getBoundingClientRect().width); // ~210 dpi
  onProgress(0, wraps.length);
  for (let i = 0; i < wraps.length; i++) {
    const el = wraps[i];
    const data = await toJpeg(el, { quality: 0.92, pixelRatio, backgroundColor: '#ffffff', fontEmbedCSS, cacheBust: false });
    const slide = pptx.addSlide();
    slide.addImage({ data, x: 0, y: 0, w: W, h: H });
    const text = el.innerText.replace(/\n{3,}/g, '\n\n').trim();
    if (text) slide.addNotes(text.slice(0, 20000));
    onProgress(i + 1, wraps.length);
  }
  await pptx.writeFile({ fileName: `BPPS2026 - ${safe} (gambar).pptx` });
}
