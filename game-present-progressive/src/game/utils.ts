import { useCallback, useEffect, useId, useRef } from "react";

/** setTimeout scheduler that auto-clears on unmount */
export function useTimeouts() {
  const ids = useRef<number[]>([]);
  useEffect(() => {
    const list = ids.current;
    return () => {
      list.forEach((id) => window.clearTimeout(id));
      list.length = 0;
    };
  }, []);
  return useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    ids.current.push(id);
    return id;
  }, []);
}

/** unique, url()-safe ids for SVG gradients */
export function useSvgIds() {
  const raw = useId();
  const p = "g" + raw.replace(/[^a-zA-Z0-9]/g, "");
  return useCallback((n: string) => `${p}-${n}`, [p]);
}

export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------------- flying pearl → HUD counter ---------------- */
let pearlTarget: HTMLElement | null = null;
export function setPearlTarget(el: HTMLElement | null) {
  pearlTarget = el;
}
export function pearlTargetPoint() {
  const r = pearlTarget?.getBoundingClientRect();
  if (!r) return { x: window.innerWidth - 80, y: 40 };
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function rectCenter(r: DOMRect | null | undefined) {
  if (!r) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

export function flyPearl(
  from: { x: number; y: number },
  to: { x: number; y: number } | null,
  onDone?: () => void,
  opts: { size?: number; delay?: number; duration?: number } = {}
) {
  const dest = to ?? pearlTargetPoint();
  const size = opts.size ?? 48;
  try {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      left: `${from.x - size / 2}px`,
      top: `${from.y - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      zIndex: "90",
      pointerEvents: "none",
      opacity: "0",
      background: "radial-gradient(circle at 32% 28%, #ffffff 0 16%, #fdf2f8 32%, #f5d0fe 62%, #c4b5fd 100%)",
      boxShadow: "0 0 18px #fff, 0 0 38px rgba(244,114,182,.85), 0 0 60px rgba(94,234,212,.5)",
    } as Partial<CSSStyleDeclaration>);
    document.body.appendChild(el);
    const dx = dest.x - from.x;
    const dy = dest.y - from.y;
    const midY = Math.min(dy, 0) * 0.5 - 90;
    const anim = el.animate(
      [
        { transform: "translate(0,0) scale(0.3)", opacity: 0 },
        { transform: "translate(0,-36px) scale(1.3)", opacity: 1, offset: 0.2 },
        { transform: `translate(${dx * 0.5}px, ${midY}px) scale(1)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.55)`, opacity: 0.95 },
      ],
      {
        duration: opts.duration ?? 1150,
        delay: opts.delay ?? 0,
        easing: "cubic-bezier(.45,.05,.4,1)",
        fill: "forwards",
      }
    );
    anim.onfinish = () => {
      el.remove();
      onDone?.();
    };
  } catch {
    window.setTimeout(() => onDone?.(), 300);
  }
}
