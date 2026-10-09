import { starPath, useUid } from './SpaceArt';

/**
 * Cartoon rocket. The viewBox ends at the fins, the flame renders below it
 * (overflow visible) so the rocket always "stands" on the ground correctly.
 */
export function Rocket({
  flame = false,
  pilot = false,
  className = '',
}: {
  flame?: boolean;
  pilot?: boolean;
  className?: string;
}) {
  const u = useUid();
  return (
    <svg viewBox="0 0 140 196" className={`rocket ${flame ? 'has-flame' : ''} ${className}`} role="img" aria-label="صاروخ">
      <defs>
        <linearGradient id={`${u}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ddd6fe" />
          <stop offset=".45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id={`${u}n`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <g className="r-flame">
        <path d="M50 180 Q70 266 90 180 Z" fill="#fb923c" />
        <path d="M57 180 Q70 240 83 180 Z" fill="#fde047" />
        <path d="M63 180 Q70 214 77 180 Z" fill="#fff7ed" />
      </g>
      <path d="M40 124 Q14 150 14 182 Q14 192 22 190 L44 176 Z" fill="#ec4899" />
      <path d="M100 124 Q126 150 126 182 Q126 192 118 190 L96 176 Z" fill="#ec4899" />
      <path d="M70 6 C100 30 108 86 104 176 L36 176 C32 86 40 30 70 6 Z" fill={`url(#${u}b)`} stroke="#c4b5fd" strokeWidth="2" />
      <path d="M70 6 C84 17 93 32 97 50 L43 50 C47 32 56 17 70 6 Z" fill={`url(#${u}n)`} />
      <path d="M37 146 L103 146 L104 160 L36 160 Z" fill="#a78bfa" />
      <path d="M64 150 h12 v40 q-6 6 -12 0 z" fill="#db2777" />
      <rect x="48" y="174" width="44" height="10" rx="4" fill="#6d28d9" />
      <circle cx="70" cy="92" r="23" fill="#7c3aed" />
      <circle cx="70" cy="92" r="17" fill={pilot ? '#c7d2fe' : '#1e1b4b'} />
      {pilot ? (
        <g>
          <circle cx="70" cy="95" r="13" fill="#f9a8d4" />
          <ellipse cx="70" cy="97.5" rx="9.5" ry="9" fill="#ffe1cf" />
          <circle cx="66.5" cy="97" r="1.7" fill="#3b1f5c" />
          <circle cx="73.5" cy="97" r="1.7" fill="#3b1f5c" />
          <path d="M67.5 100.5 q2.5 2.5 5 0" stroke="#be185d" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <circle cx="64" cy="86" r="5" fill="#fff" opacity=".35" />
      )}
      <path d="M58 80 A16 16 0 0 1 72 76" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7" />
      <path d={starPath(70, 131, 8, 3.6)} fill="#fbbf24" />
    </svg>
  );
}
