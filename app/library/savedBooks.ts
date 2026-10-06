import { useMemo, useSyncExternalStore } from 'react';

// BookActions.tsx er key er sathe hubuhu mile thakte hobe
export const READ_KEY = 'bookvive:read';
export const WISHLIST_KEY = 'bookvive:wishlist';

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('bookvive', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('bookvive', callback);
  };
};

const readRaw = (key: string) => {
  try {
    return localStorage.getItem(key) ?? '[]';
  } catch {
    return '[]';
  }
};

// Browser e page load hoye gele true (server e false)
export const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

// Save kora boi er id er list
export const useSavedIds = (key: string): number[] => {
  const raw = useSyncExternalStore(subscribe, () => readRaw(key), () => '[]');
  return useMemo(() => {
    try {
      return JSON.parse(raw) as number[];
    } catch {
      return [];
    }
  }, [raw]);
};

export const removeSaved = (key: string, id: number) => {
  try {
    const ids = JSON.parse(readRaw(key)) as number[];
    localStorage.setItem(key, JSON.stringify(ids.filter((x) => x !== id)));
  } catch {}
  window.dispatchEvent(new Event('bookvive'));
};