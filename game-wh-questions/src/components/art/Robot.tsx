import { starPath, useUid } from './SpaceArt';

export type RobotMood = 'normal' | 'talk' | 'happy';

export function Robot({ mood = 'normal', className = '' }: { mood?: RobotMood; className?: string }) {
  const u = useUid();
  return (
    <svg viewBox="0 0 100 124" className={`robot is-${mood} ${className}`} role="img" aria-label="الروبوت المساعد">
      <defs>
        <linearGradient id={`${u}h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a5f3fc" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id={`${u}j`}>
          <stop offset="0" stopColor="#fef08a" />
          <stop offset="1" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="r-jet" cx="50" cy="112" rx="11" ry="10" fill={`url(#${u}j)`} />
      <line x1="50" y1="20" x2="50" y2="9" stroke="#a78bfa" strokeWidth="3.5" strokeLinecap="round" />
      <circle className="r-bulb" cx="50" cy="7" r="5.5" fill="#fbbf24" />
      <rect x="9" y="33" width="9" height="20" rx="4.5" fill="#a78bfa" />
      <rect x="82" y="33" width="9" height="20" rx="4.5" fill="#a78bfa" />
      <g className="r-armL">
        <path d="M31 80 q-12 3 -15 14" stroke="#a78bfa" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="15.5" cy="95" r="5.5" fill="#f9a8d4" />
      </g>
      <g className="r-armR">
        <path d="M69 80 q12 3 15 14" stroke="#a78bfa" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="84.5" cy="95" r="5.5" fill="#f9a8d4" />
      </g>
      <rect x="30" y="72" width="40" height="30" rx="13" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="2" />
      <path d={starPath(50, 88, 7, 3.2)} fill="#f472b6" />
      <rect x="15" y="19" width="70" height="52" rx="21" fill={`url(#${u}h)`} stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
      <rect x="23" y="27" width="54" height="36" rx="14" fill="#1e1b4b" />
      {mood === 'happy' ? (
        <g stroke="#67e8f9" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M33 47 q6 -8 12 0" />
          <path d="M55 47 q6 -8 12 0" />
        </g>
      ) : (
        <g className="r-eyes" fill="#67e8f9">
          <ellipse cx="39" cy="44" rx="5.5" ry="7" />
          <ellipse cx="61" cy="44" rx="5.5" ry="7" />
          <circle cx="41" cy="41" r="1.8" fill="#fff" />
          <circle cx="63" cy="41" r="1.8" fill="#fff" />
        </g>
      )}
      <path
        d={mood === 'normal' ? 'M44 55 q6 4 12 0' : 'M43 54 q7 7 14 0'}
        stroke="#f9a8d4"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
