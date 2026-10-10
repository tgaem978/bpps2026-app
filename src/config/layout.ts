/** Halaman bernombor ganjil atau genap yang dipantulkan kiri-kanan (tajuk kanan, nombor kiri).
 *  Tukar 'even' ↔ 'odd' untuk menukar keseluruhan buku sekali gus. */
export const MIRROR_PAGES: 'odd' | 'even' = 'even';
export const isMirrored = (n: number | undefined) => n !== undefined && (MIRROR_PAGES === 'odd' ? n % 2 === 1 : n % 2 === 0);
