/** Halaman bernombor ganjil atau genap yang dipantulkan kiri-kanan (tajuk kanan, nombor kiri).
 *  Tukar 'even' ↔ 'odd' untuk menukar keseluruhan buku sekali gus. */
export type MirrorParity = 'odd' | 'even';
export const MIRROR_PAGES = 'even' as MirrorParity as string;
export const isMirrored = (n: number | undefined): boolean => {
  if (n === undefined) return false;
  const odd = MIRROR_PAGES === 'odd';
  return odd ? n % 2 === 1 : n % 2 === 0;
};
