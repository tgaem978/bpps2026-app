/**
 * Template halaman BPPS - geometri (mm, A4 potret 210x297) dan aset yang diekstrak
 * daripada PPTX "final DRAF 1 - BPPS2026 SKBTS" (slaid 7: halaman isi, slaid 2: partition,
 * slaid 1: muka hadapan). Aset disimpan dalam public/template/.
 */
const base = import.meta.env.BASE_URL;

export const templateAssets = {
  header: `${base}template/page-header.png`, // jalur tajuk: 0-37mm
  footer: `${base}template/page-footer.png`, // jalur kaki: 280-297mm
  pageBg: `${base}template/page-bg.svg`, // corak litar samar (slaid isi)
  divider: `${base}template/divider-bg.jpg`, // halaman partition penuh
  cover: `${base}template/cover-default.jpg`, // muka hadapan asal
};

export const pageGeometry = {
  width: 210,
  height: 297,
  /** Kotak bingkai kandungan (Group 3 dalam template): border 4.5pt #2D445B */
  frame: { left: 6, top: 40, right: 5, bottom: 21, border: 1.6, padding: 6 },
};

/** Tinggi ruang kandungan (mm) di dalam bingkai. */
export const contentHeightMm =
  pageGeometry.height - pageGeometry.frame.top - pageGeometry.frame.bottom - 2 * (pageGeometry.frame.border + pageGeometry.frame.padding);

/** Lebar ruang kandungan (mm) di dalam bingkai. */
export const contentWidthMm =
  pageGeometry.width - pageGeometry.frame.left - pageGeometry.frame.right - 2 * (pageGeometry.frame.border + pageGeometry.frame.padding);
