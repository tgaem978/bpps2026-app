import { useSyncExternalStore } from 'react';

export type RoutePath = '/' | '/project' | '/settings';
const known: RoutePath[] = ['/', '/project', '/settings'];

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb);
  window.addEventListener('app:navigate', cb);
  return () => {
    window.removeEventListener('popstate', cb);
    window.removeEventListener('app:navigate', cb);
  };
}
const snapshot = () => window.location.pathname;

export function useRoute(): RoutePath {
  const p = useSyncExternalStore(subscribe, snapshot, () => '/');
  const clean = p.length > 1 ? p.replace(/\/+$/, '') : p;
  return (known as string[]).includes(clean) ? (clean as RoutePath) : '/';
}

export function navigate(path: RoutePath): void {
  if (window.location.pathname !== path) window.history.pushState({}, '', path);
  window.dispatchEvent(new Event('app:navigate'));
}
