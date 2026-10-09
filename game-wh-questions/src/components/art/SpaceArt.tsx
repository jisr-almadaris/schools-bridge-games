import { useId } from 'react';
import type { WhKey } from '../../data/content';

export const useUid = () => useId().replace(/[^a-zA-Z0-9_-]/g, '');

export function starPath(cx: number, cy: number, R: number, r: number, n = 5) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    d += `${i === 0 ? 'M' : 'L'}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }
  return d + 'Z';
}

function gearPath(cx: number, cy: number, ro: number, ri: number, teeth: number) {
  const pts: string[] = [];
  const step = (Math.PI * 2) / (teeth * 2);
  for (let i = 0; i < teeth * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a1 = i * step - step / 2.4;
    const a2 = i * step + step / 2.4;
    pts.push(
      `${(cx + r * Math.cos(a1)).toFixed(1)} ${(cy + r * Math.sin(a1)).toFixed(1)}`,
      `${(cx + r * Math.cos(a2)).toFixed(1)} ${(cy + r * Math.sin(a2)).toFixed(1)}`,
    );
  }
  return `M${pts.join(' L')}Z`;
}

const GEAR_SMALL = gearPath(60, 60, 21, 15, 8);
const GEAR_BIG = gearPath(60, 60, 56, 43, 10);

export function Earth({ className = '' }: { className?: string }) {
  const u = useUid();
  const continents = (
    <g fill="#4ade80" stroke="#16a34a" strokeWidth="2">
      <path d="M30 62 q14 -18 34 -8 q10 8 4 20 q-6 10 -18 8 q-8 14 -20 5 q-10 -9 0 -25z" />
      <path d="M100 44 q22 -10 34 6 q8 12 -4 18 q-12 4 -16 16 q-4 12 -16 4 q-8 -10 -2 -22 q0 -14 4 -22z" />
      <path d="M58 118 q18 -6 26 8 q6 14 -6 26 q-10 10 -20 0 q-8 -12 0 -34z" />
      <path d="M140 110 q14 -4 20 8 q4 10 -6 14 q-10 2 -14 -6 q-4 -10 0 -16z" />
      <path d="M170 60 q12 -4 18 6 q4 10 -8 12 q-10 0 -10 -18z" />
    </g>
  );
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}o`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset=".55" stopColor="#2563eb" />
          <stop offset="1" stopColor="#1e3a8a" />
        </radialGradient>
        <radialGradient id={`${u}a`} cx="50%" cy="50%" r="50%">
          <stop offset=".8" stopColor="#7dd3fc" stopOpacity=".55" />
          <stop offset="1" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}s`} cx="30%" cy="28%" r="85%">
          <stop offset=".55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#0b1030" stopOpacity=".55" />
        </radialGradient>
        <clipPath id={`${u}c`}>
          <circle cx="100" cy="100" r="84" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#${u}a)`} />
      <circle cx="100" cy="100" r="84" fill={`url(#${u}o)`} />
      <g clipPath={`url(#${u}c)`}>
        <g className="earth-spin">
          {continents}
          <g transform="translate(200 0)">{continents}</g>
        </g>
        <g fill="#fff" opacity=".75">
          <path d="M20 90 q20 -10 40 0 q-20 8 -40 0z" />
          <path d="M110 140 q24 -10 48 0 q-24 8 -48 0z" />
          <path d="M120 30 q16 -8 32 0 q-16 6 -32 0z" />
        </g>
      </g>
      <circle cx="100" cy="100" r="84" fill={`url(#${u}s)`} />
    </svg>
  );
}

export function Moon({ className = '' }: { className?: string }) {
  const u = useUid();
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}m`} cx="36%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#dfe3f5" />
          <stop offset="1" stopColor="#9aa1c6" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="57" fill="#e0e7ff" opacity=".16" />
      <circle cx="60" cy="60" r="48" fill={`url(#${u}m)`} />
      <g fill="#b9bfdc">
        <circle cx="44" cy="46" r="9" />
        <circle cx="76" cy="70" r="11" />
        <circle cx="72" cy="38" r="5" />
        <circle cx="46" cy="78" r="6" />
        <circle cx="88" cy="52" r="3.5" />
      </g>
      <g fill="#fff" opacity=".5">
        <circle cx="42" cy="44" r="4" />
        <circle cx="73" cy="67" r="5" />
      </g>
    </svg>
  );
}

export function Satellite() {
  return (
    <svg viewBox="0 0 150 80" aria-hidden="true">
      <rect x="4" y="26" width="44" height="28" rx="4" fill="#60a5fa" stroke="#1e40af" strokeWidth="3" />
      <path d="M26 26 V54 M4 40 H48" stroke="#1e40af" strokeWidth="2" />
      <rect x="102" y="26" width="44" height="28" rx="4" fill="#60a5fa" stroke="#1e40af" strokeWidth="3" />
      <path d="M124 26 V54 M102 40 H146" stroke="#1e40af" strokeWidth="2" />
      <rect x="48" y="37" width="54" height="6" fill="#cbd5e1" />
      <rect x="58" y="22" width="34" height="36" rx="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="3" />
      <circle cx="75" cy="40" r="7" fill="#f472b6" />
      <path d="M75 22 V10" stroke="#94a3b8" strokeWidth="3" />
      <circle cx="75" cy="8" r="5" fill="#fbbf24" className="sat-blink" />
    </svg>
  );
}

type PlanetKind = WhKey | 'final' | 'decoA' | 'decoB';

export function PlanetArt({ kind, className = '' }: { kind: PlanetKind; className?: string }) {
  const u = useUid();
  const gid = `${u}g`;
  const G = (a: string, b: string, c: string) => (
    <radialGradient id={gid} cx="35%" cy="30%" r="78%">
      <stop offset="0" stopColor={a} />
      <stop offset=".55" stopColor={b} />
      <stop offset="1" stopColor={c} />
    </radialGradient>
  );
  const clip = (
    <clipPath id={`${u}c`}>
      <circle cx="60" cy="60" r="40" />
    </clipPath>
  );
  const body = <circle cx="60" cy="60" r="40" fill={`url(#${gid})`} />;
  const rim = <circle cx="60" cy="60" r="40" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="2" />;
  const ringBack = (color: string, rot: number) => (
    <g transform={`rotate(${rot} 60 60)`}>
      <path d="M4 60 A56 15 0 0 1 116 60" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" opacity=".7" />
    </g>
  );
  const ringFront = (color: string, rot: number) => (
    <g transform={`rotate(${rot} 60 60)`}>
      <path d="M4 60 A56 15 0 0 0 116 60" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
    </g>
  );

  switch (kind) {
    case 'what':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>
            {G('#fff7cc', '#fbbf24', '#b45309')}
            {clip}
          </defs>
          {ringBack('#fde68a', -16)}
          {body}
          <g clipPath={`url(#${u}c)`} fill="none" strokeLinecap="round">
            <path d="M16 48 Q60 38 104 48" stroke="#f59e0b" strokeWidth="7" opacity=".5" />
            <path d="M16 72 Q60 82 104 72" stroke="#fff" strokeWidth="5" opacity=".3" />
          </g>
          {rim}
          {ringFront('#fde68a', -16)}
        </svg>
      );
    case 'where':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>{G('#ffffff', '#d5daf0', '#8088b3')}</defs>
          {body}
          <g fill="#aeb5d6">
            <circle cx="46" cy="48" r="9" />
            <circle cx="74" cy="70" r="10" />
            <circle cx="72" cy="40" r="5" />
            <circle cx="48" cy="76" r="5" />
          </g>
          <g fill="#fff" opacity=".45">
            <circle cx="44" cy="46" r="4" />
            <circle cx="72" cy="67" r="4.5" />
          </g>
          {rim}
        </svg>
      );
    case 'when':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>{G('#ffedd5', '#fb923c', '#c2410c')}</defs>
          {body}
          <circle cx="60" cy="60" r="19" fill="#fff7ed" stroke="#9a3412" strokeWidth="3.5" />
          <path d="M60 44 v3 M60 73 v3 M44 60 h3 M73 60 h3" stroke="#9a3412" strokeWidth="2.5" strokeLinecap="round" />
          <path className="ck-hr" d="M60 60 V50" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" />
          <path className="ck-min" d="M60 60 H72" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="60" r="2.5" fill="#7c2d12" />
          <path d={starPath(14, 22, 7, 3)} fill="#fde68a" />
          <path d={starPath(106, 98, 6, 2.6)} fill="#fde68a" />
          {rim}
        </svg>
      );
    case 'who':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>{G('#ffe4e6', '#f87171', '#b91c1c')}</defs>
          {body}
          {[
            [44, 52],
            [75, 47],
            [60, 76],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="9" fill="#ffe1cf" />
              <circle cx={x - 3} cy={y - 1} r="1.4" fill="#3b1f5c" />
              <circle cx={x + 3} cy={y - 1} r="1.4" fill="#3b1f5c" />
              <path d={`M${x - 3} ${y + 3} q3 3 6 0`} stroke="#be185d" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          ))}
          {rim}
        </svg>
      );
    case 'why':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>{G('#faf5ff', '#c084fc', '#7e22ce')}</defs>
          {body}
          <circle cx="60" cy="54" r="15" fill="#fde047" />
          <path d="M54 66 h12 v7 q-6 4 -12 0z" fill="#e9d5ff" stroke="#7e22ce" strokeWidth="1.5" />
          <path d="M55 54 q5 6 10 0" stroke="#f59e0b" strokeWidth="2" fill="none" />
          <path d="M60 33 v-5 M42 44 l-4 -3 M78 44 l4 -3 M40 60 h-5 M80 60 h5" stroke="#fef9c3" strokeWidth="2.5" strokeLinecap="round" />
          {rim}
        </svg>
      );
    case 'how':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>{G('#e0f2fe', '#60a5fa', '#1d4ed8')}</defs>
          {ringBack('#67e8f9', 14)}
          {body}
          <g className="gear-in">
            <path d={GEAR_SMALL} fill="#fff" opacity=".88" />
            <circle cx="60" cy="60" r="6" fill="#3b82f6" />
          </g>
          {rim}
          {ringFront('#67e8f9', 14)}
        </svg>
      );
    case 'final':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>
            <radialGradient id={gid} cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor="#fffbeb" />
              <stop offset=".5" stopColor="#fcd34d" />
              <stop offset="1" stopColor="#f59e0b" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#fde68a" opacity=".2" />
          <path d={starPath(60, 63, 50, 23)} fill={`url(#${gid})`} stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="50" cy="60" r="3.6" fill="#78350f" />
          <circle cx="70" cy="60" r="3.6" fill="#78350f" />
          <path d="M52 70 q8 7 16 0" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'decoA':
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>{G('#fce7f3', '#f472b6', '#9d174d')}</defs>
          {ringBack('#fbcfe8', 20)}
          {body}
          {rim}
          {ringFront('#fbcfe8', 20)}
        </svg>
      );
    case 'decoB':
    default:
      return (
        <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
          <defs>{G('#ccfbf1', '#2dd4bf', '#0f766e')}</defs>
          {body}
          <circle cx="48" cy="50" r="7" fill="#99f6e4" opacity=".7" />
          <circle cx="72" cy="72" r="9" fill="#0d9488" opacity=".5" />
          {rim}
        </svg>
      );
  }
}

export function BigStar({ className = '' }: { className?: string }) {
  const u = useUid();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${u}s`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#fffbeb" />
          <stop offset=".55" stopColor="#fde047" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
      <path d={starPath(50, 54, 46, 21)} fill={`url(#${u}s)`} stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="41" cy="52" r="3.4" fill="#78350f" />
      <circle cx="59" cy="52" r="3.4" fill="#78350f" />
      <circle cx="42.2" cy="50.8" r="1.1" fill="#fff" />
      <circle cx="60.2" cy="50.8" r="1.1" fill="#fff" />
      <path d="M44 61 q6 6 12 0" stroke="#78350f" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="35" cy="59" rx="4" ry="2.5" fill="#fb7185" opacity=".5" />
      <ellipse cx="65" cy="59" rx="4" ry="2.5" fill="#fb7185" opacity=".5" />
    </svg>
  );
}

export function Crystal() {
  return (
    <svg viewBox="0 0 40 60" aria-hidden="true">
      <path d="M20 2 L34 20 L27 58 L13 58 L6 20 Z" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 2 L20 58 M6 20 L34 20" stroke="#fff" strokeWidth="1.5" opacity=".6" />
    </svg>
  );
}

export function ClockTower() {
  return (
    <svg viewBox="0 0 44 96" aria-hidden="true">
      <rect x="19" y="40" width="6" height="56" rx="3" fill="#9a3412" />
      <circle cx="22" cy="24" r="20" fill="#fff7ed" stroke="#c2410c" strokeWidth="4" />
      <path d="M22 8 v4 M22 36 v4 M6 24 h4 M34 24 h4" stroke="#c2410c" strokeWidth="2.5" strokeLinecap="round" />
      <path className="ct-hr" d="M22 24 V14" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" />
      <path className="ct-min" d="M22 24 H33" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="24" r="2.5" fill="#7c2d12" />
    </svg>
  );
}

export function Bulb() {
  return (
    <svg viewBox="0 0 40 60" aria-hidden="true" className="bulb-svg">
      <circle cx="20" cy="20" r="16" fill="#fde047" />
      <path d="M13 34 h14 v8 h-14z" fill="#e9d5ff" />
      <path d="M13 44 h14 v6 q-7 5 -14 0z" fill="#c4b5fd" />
      <path d="M15 20 q5 7 10 0" stroke="#f59e0b" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function GearArt({ color = '#bfdbfe' }: { color?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <path d={GEAR_BIG} fill={color} stroke="#1e40af" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="60" cy="60" r="15" fill="#1e3a8a" />
    </svg>
  );
}
