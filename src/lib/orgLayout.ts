/** Susunan pentadbir pada carta organisasi (templat PPKI): pentadbir yang terlibat berada di tengah. */
export const ADMIN_ORDER = ['GPK Kokurikulum', 'GPK Pentadbiran', 'GPK Hal Ehwal Murid', 'GPK Petang', 'GPK Pendidikan Khas'];

/**
 * Jika semua kad dalam satu aras ialah pentadbir dan `focus` ada di antaranya, kad `focus` diletakkan di tengah;
 * pentadbir lain mengikut susunan lalai di kiri dan kanan. Jika tidak, susunan asal dikekalkan.
 */
export function arrangeFocus<T extends { position: string }>(items: T[], focus?: string): { items: T[]; focusIndex: number } {
  if (!focus || items.length < 3) return { items, focusIndex: -1 };
  if (!items.every((c) => ADMIN_ORDER.includes(c.position))) return { items, focusIndex: -1 };
  const f = items.find((c) => c.position === focus);
  if (!f) return { items, focusIndex: -1 };
  const others = items
    .filter((c) => c !== f)
    .sort((a, b) => ADMIN_ORDER.indexOf(a.position) - ADMIN_ORDER.indexOf(b.position));
  const mid = Math.ceil(others.length / 2);
  return { items: [...others.slice(0, mid), f, ...others.slice(mid)], focusIndex: mid };
}

/** Hanya Guru Besar dan pentadbir (GPK) dipaparkan sebagai kad bergambar; ahli lain sebagai kad nama. */
export const isLeader = (position: string) => position === 'Guru Besar' || ADMIN_ORDER.includes(position);
