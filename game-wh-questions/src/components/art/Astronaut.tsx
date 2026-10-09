import { starPath, useUid } from './SpaceArt';

export type Pose = 'idle' | 'walk' | 'wave' | 'point' | 'celebrate' | 'float';

/**
 * The main character: a cute girl astronaut in a modest white/purple/pink suit.
 * Poses are animated purely with CSS (see .astro rules in index.css).
 */
export function Astronaut({
  pose = 'idle',
  className = '',
  lowGravity = false,
}: {
  pose?: Pose;
  className?: string;
  lowGravity?: boolean;
}) {
  const u = useUid();
  const open = pose === 'celebrate' || pose === 'wave';
  return (
    <svg
      viewBox="0 0 200 270"
      className={`astro is-${pose} ${lowGravity ? 'lowgrav' : ''} ${className}`}
      role="img"
      aria-label="رائدة الفضاء"
    >
      <defs>
        <linearGradient id={`${u}suit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9e1ff" />
        </linearGradient>
        <radialGradient id={`${u}dome`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f0f9ff" />
          <stop offset="1" stopColor="#c7d2fe" />
        </radialGradient>
        <linearGradient id={`${u}hood`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbcfe8" />
          <stop offset="1" stopColor="#f9a8d4" />
        </linearGradient>
        <radialGradient id={`${u}glass`} cx="30%" cy="25%" r="80%">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset=".5" stopColor="#ffffff" stopOpacity=".04" />
          <stop offset="1" stopColor="#a5b4fc" stopOpacity=".25" />
        </radialGradient>
      </defs>

      <ellipse className="a-shadow" cx="100" cy="258" rx="42" ry="7" fill="#000" opacity=".25" />

      <g className="a-all">
        {/* space backpack + antenna */}
        <line x1="146" y1="138" x2="162" y2="104" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
        <circle className="a-antenna" cx="163" cy="101" r="6" fill="#f472b6" />
        <rect x="50" y="126" width="100" height="80" rx="24" fill="#a78bfa" />

        {/* legs */}
        <g className="a-legL">
          <rect x="72" y="190" width="24" height="46" rx="11" fill={`url(#${u}suit)`} stroke="#d8ccff" strokeWidth="2" />
          <rect x="66" y="228" width="34" height="20" rx="10" fill="#8b5cf6" />
          <rect x="70" y="231" width="14" height="5" rx="2.5" fill="#c4b5fd" opacity=".8" />
        </g>
        <g className="a-legR">
          <rect x="104" y="190" width="24" height="46" rx="11" fill={`url(#${u}suit)`} stroke="#d8ccff" strokeWidth="2" />
          <rect x="100" y="228" width="34" height="20" rx="10" fill="#8b5cf6" />
          <rect x="116" y="231" width="14" height="5" rx="2.5" fill="#c4b5fd" opacity=".8" />
        </g>

        {/* torso */}
        <rect x="58" y="126" width="84" height="78" rx="28" fill={`url(#${u}suit)`} stroke="#d8ccff" strokeWidth="2" />
        <rect x="68" y="134" width="8" height="50" rx="4" fill="#f9a8d4" />
        <rect x="124" y="134" width="8" height="50" rx="4" fill="#f9a8d4" />
        <circle cx="100" cy="158" r="13" fill="#f472b6" />
        <path d={starPath(100, 159, 9, 4)} fill="#fde047" strokeLinejoin="round" stroke="#fde047" strokeWidth="1" />
        <circle cx="86" cy="173" r="3" fill="#2dd4bf" />
        <circle cx="114" cy="173" r="3" fill="#fbbf24" />
        <rect x="60" y="182" width="80" height="10" rx="5" fill="#c4b5fd" />
        <rect x="92" y="180" width="16" height="14" rx="4" fill="#8b5cf6" />

        {/* arms */}
        <g className="a-armL">
          <rect x="42" y="132" width="22" height="52" rx="11" fill={`url(#${u}suit)`} stroke="#d8ccff" strokeWidth="2" />
          <rect x="42" y="166" width="22" height="8" rx="4" fill="#c4b5fd" />
          <circle cx="53" cy="186" r="12" fill="#f472b6" />
          <circle cx="49" cy="182" r="3" fill="#fbcfe8" opacity=".85" />
        </g>
        <g className="a-armR">
          <rect x="136" y="132" width="22" height="52" rx="11" fill={`url(#${u}suit)`} stroke="#d8ccff" strokeWidth="2" />
          <rect x="136" y="166" width="22" height="8" rx="4" fill="#c4b5fd" />
          <circle cx="147" cy="186" r="12" fill="#f472b6" />
          <circle cx="143" cy="182" r="3" fill="#fbcfe8" opacity=".85" />
        </g>

        {/* head + helmet */}
        <g className="a-head">
          <circle cx="100" cy="76" r="58" fill={`url(#${u}dome)`} />
          <circle cx="100" cy="82" r="45" fill={`url(#${u}hood)`} />
          <ellipse cx="100" cy="89" rx="33" ry="31" fill="#ffe1cf" />
          <path d={starPath(126, 55, 6.5, 2.8)} fill="#fde047" />
          <path d="M80 77 q6 -4 12 -1" stroke="#9d5c7b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M108 76 q6 -3 12 1" stroke="#9d5c7b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <g className="a-eyes">
            <ellipse cx="87" cy="90" rx="5.8" ry="7.2" fill="#3b1f5c" />
            <ellipse cx="113" cy="90" rx="5.8" ry="7.2" fill="#3b1f5c" />
            <circle cx="89.2" cy="87" r="2.3" fill="#fff" />
            <circle cx="115.2" cy="87" r="2.3" fill="#fff" />
            <circle cx="85.5" cy="93" r="1" fill="#fff" opacity=".8" />
            <circle cx="111.5" cy="93" r="1" fill="#fff" opacity=".8" />
            <path d="M81.5 85 l-3.5 -2.5" stroke="#3b1f5c" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M118.5 85 l3.5 -2.5" stroke="#3b1f5c" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <ellipse cx="78" cy="101" rx="6.5" ry="4" fill="#fb7185" opacity=".45" />
          <ellipse cx="122" cy="101" rx="6.5" ry="4" fill="#fb7185" opacity=".45" />
          {open ? (
            <g>
              <path d="M91 102 q9 12 18 0 z" fill="#e11d48" stroke="#be123c" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M95.5 107 q4.5 3 9 0" fill="#fb7185" />
            </g>
          ) : (
            <path d="M92.5 103 q7.5 7 15 0" stroke="#be185d" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          )}
          <circle cx="100" cy="76" r="58" fill={`url(#${u}glass)`} stroke="#ddd6fe" strokeWidth="5" />
          <path d="M60 58 A44 44 0 0 1 92 30" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".75" />
          <circle cx="57" cy="72" r="3.2" fill="#fff" opacity=".7" />
        </g>

        {/* neck ring */}
        <rect x="64" y="122" width="72" height="14" rx="7" fill="#8b5cf6" />
        <rect x="70" y="125" width="18" height="4" rx="2" fill="#c4b5fd" opacity=".8" />
      </g>
    </svg>
  );
}
