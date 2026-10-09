import { useCallback, useEffect, useRef, useState } from 'react';

export interface Progress {
  name: string;
  /** next station index (0-5). 6 = all six planets visited */
  current: number;
  stars: number;
  score: number;
  challengeDone: boolean;
  finishedAt: string | null;
}

const KEY = 'wh-space-adventure-v1';

export const newProgress = (name = ''): Progress => ({
  name,
  current: 0,
  stars: 0,
  score: 0,
  challengeDone: false,
  finishedAt: null,
});

function clampInt(v: unknown, min: number, max: number) {
  const n = typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : min;
  return Math.min(max, Math.max(min, n));
}

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Progress> | null;
    if (!p || typeof p.name !== 'string') return null;
    return {
      name: p.name,
      current: clampInt(p.current, 0, 6),
      stars: clampInt(p.stars, 0, 6),
      score: clampInt(p.score, 0, 100),
      challengeDone: !!p.challengeDone,
      finishedAt: typeof p.finishedAt === 'string' ? p.finishedAt : null,
    };
  } catch {
    return null;
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const isLandscape = () =>
  typeof window !== 'undefined' && window.innerWidth > window.innerHeight && window.innerWidth >= 640;

export function useLandscape() {
  const [v, setV] = useState(isLandscape);
  useEffect(() => {
    const h = () => setV(isLandscape());
    window.addEventListener('resize', h);
    window.addEventListener('orientationchange', h);
    return () => {
      window.removeEventListener('resize', h);
      window.removeEventListener('orientationchange', h);
    };
  }, []);
  return v;
}

/** setTimeout helper that auto-clears on unmount */
export function useTimers() {
  const ids = useRef<number[]>([]);
  useEffect(
    () => () => {
      ids.current.forEach((id) => clearTimeout(id));
      ids.current = [];
    },
    [],
  );
  return useCallback((fn: () => void, ms: number) => {
    ids.current.push(window.setTimeout(fn, ms));
  }, []);
}
