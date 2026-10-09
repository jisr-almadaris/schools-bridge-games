import { memo } from "react";
import { cn } from "../utils/cn";

function rand(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}
const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: rand(i + 1) * 1600,
  y: rand(i + 50) * 420,
  r: rand(i + 100) * 1.8 + 0.5,
  d: rand(i + 200) * 3,
}));
const COLORS = ["#ffcf4a", "#ff6fb5", "#3ee6d6", "#c7b8ff"];
// starts below the ground (hidden), climbs, drops and leaves the screen → "disappears and comes back"
const COASTER = "M760,900 C900,760 960,330 1060,330 C1160,330 1150,600 1240,600 C1320,600 1330,250 1440,250 C1540,250 1560,560 1720,560";

const Wheel = ({ boost }: { boost: number }) => {
  const cx = 420,
    cy = 390,
    r = 250;
  const gondolas = 12;
  return (
    <g className="park-layer">
      <path d={`M${cx - 150},800 L${cx},${cy} L${cx + 150},800`} stroke="#6d5bd0" strokeWidth="14" fill="none" />
      <path d={`M${cx - 110},800 L${cx},${cy} L${cx + 110},800`} stroke="#4b3aa6" strokeWidth="8" fill="none" />
      {boost >= 1 && <circle cx={cx} cy={cy} r={r + 30} fill="none" stroke="#ffcf4a" strokeWidth="50" opacity="0.14" className="twinkle" />}
      <g className="wheel-spin" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <circle cx={cx} cy={cy} r={r} stroke="#c7b8ff" strokeWidth="6" fill="none" />
        <circle cx={cx} cy={cy} r={r - 30} stroke="#8f78f0" strokeWidth="3" fill="none" />
        <circle className="glow" cx={cx} cy={cy} r={r} stroke={boost >= 1 ? "#ffcf4a" : "#ff6fb5"} strokeWidth={boost >= 1 ? 26 : 16} fill="none" opacity={boost >= 1 ? 0.35 : 0.18} />
        {Array.from({ length: gondolas }).map((_, i) => {
          const a = (i / gondolas) * Math.PI * 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="#8f78f0" strokeWidth="3" />;
        })}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          return (
            <circle
              key={i}
              className="bulb glow"
              cx={cx + Math.cos(a) * r}
              cy={cy + Math.sin(a) * r}
              r={boost >= 1 ? 7 : 5}
              fill={COLORS[i % 4]}
              style={{ animationDelay: `${(i % 6) * 0.2}s` }}
            />
          );
        })}
        {Array.from({ length: gondolas }).map((_, i) => {
          const a = (i / gondolas) * Math.PI * 2;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          const c = COLORS[i % 4];
          return (
            <g key={"g" + i} transform={`translate(${x},${y})`}>
              <g className="gondola">
                <line x1="0" y1="0" x2="0" y2="16" stroke="#c7b8ff" strokeWidth="3" />
                <path d="M-24,16 h48 l-6,34 h-36z" fill={c} />
                <rect x="-18" y="22" width="36" height="12" rx="3" fill={boost >= 1 ? "#fff6c9" : "#1b1760"} opacity="0.7" />
                <path d="M-26,16 h52" stroke="#fff" strokeWidth="3" />
              </g>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="26" fill="#ffcf4a" />
        <circle cx={cx} cy={cy} r="12" fill="#ff6fb5" />
      </g>
    </g>
  );
};

const Car = ({ c }: { c: string }) => (
  <>
    <rect x="-20" y="-26" width="40" height="22" rx="6" fill={c} />
    <circle cx="-10" cy="-4" r="5" fill="#1b1760" />
    <circle cx="10" cy="-4" r="5" fill="#1b1760" />
    <circle cx="-6" cy="-32" r="6" fill="#f6c9a4" />
    <circle cx="8" cy="-31" r="6" fill="#3b2143" />
    <path d="M-12,-40 l-4,-10 M12,-40 l4,-10" stroke="#f6c9a4" strokeWidth="3" strokeLinecap="round" />
  </>
);

const Coaster = ({ boost }: { boost: number }) => (
  <g className="park-layer">
    {[900, 960, 1020, 1060, 1100, 1160, 1220, 1280, 1340, 1400, 1440, 1480, 1540].map((x, i) => (
      <line key={i} x1={x} y1={800} x2={x} y2={330 + (i % 3) * 90} stroke="#2e2378" strokeWidth="6" />
    ))}
    <path d={COASTER} stroke="#3ee6d6" strokeWidth="9" fill="none" />
    <path d={COASTER} stroke="#1b8f95" strokeWidth="3" fill="none" transform="translate(0,10)" />
    <path className="glow" d={COASTER} stroke="#3ee6d6" strokeWidth={boost >= 2 ? 34 : 22} fill="none" opacity={boost >= 2 ? 0.3 : 0.15} />
    <path id="coasterPath" d={COASTER} fill="none" stroke="none" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <Car c={COLORS[(i + 1) % 4]} />
        <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" begin={`${-i * 0.2}s`}>
          <mpath href="#coasterPath" />
        </animateMotion>
      </g>
    ))}
    {boost >= 2 &&
      [0, 1, 2, 3].map((i) => (
        <g key={"fast" + i}>
          <Car c={COLORS[i % 4]} />
          <animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" begin={`${1.2 - i * 0.09}s`}>
            <mpath href="#coasterPath" />
          </animateMotion>
        </g>
      ))}
  </g>
);

const Carousel = ({ boost }: { boost: number }) => {
  const x = 800,
    y = 800;
  return (
    <g className={cn("park-layer", boost >= 3 && "boost-carousel")}>
      {boost >= 3 && <ellipse cx={x} cy={y - 120} rx="200" ry="150" fill="#ff6fb5" opacity="0.14" className="twinkle" />}
      <path d={`M${x - 150},${y - 190} L${x},${y - 280} L${x + 150},${y - 190} Z`} fill="#ff6fb5" />
      {[-3, -1, 1, 3].map((k) => (
        <path key={k} d={`M${x},${y - 280} L${x + k * 37.5 - 18},${y - 190} L${x + k * 37.5 + 18},${y - 190} Z`} fill="#ffe0f0" opacity="0.8" />
      ))}
      <circle cx={x} cy={y - 288} r="10" fill="#ffcf4a" />
      <rect x={x - 155} y={y - 196} width="310" height="18" rx="6" fill="#ffcf4a" />
      {Array.from({ length: 11 }).map((_, i) => (
        <circle key={i} className="bulb glow" cx={x - 140 + i * 28} cy={y - 187} r="4" fill="#fff" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
      <rect x={x - 6} y={y - 178} width="12" height="160" fill="#c7b8ff" />
      {/* horses orbit around the centre pole (front view of a rotation) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} className="orbit" style={{ animationDelay: `${-i * 1.28}s` }}>
          <line x1={x} y1={y - 178} x2={x} y2={y - 30} stroke="#ffcf4a" strokeWidth="3" />
          <g className="horse" style={{ animationDelay: `${i * 0.4}s` }}>
            <path d={`M${x - 26},${y - 90} q10 -18 34 -12 l10 -14 q8 6 4 16 l-8 12 q0 16 -8 22 h-28 q-10 -8 -4 -24z`} fill={i % 2 ? "#fff" : "#c7b8ff"} />
            <rect x={x - 18} y={y - 60} width="4" height="18" fill="#fff" />
            <rect x={x + 6} y={y - 60} width="4" height="18" fill="#fff" />
          </g>
        </g>
      ))}
      <ellipse cx={x} cy={y - 16} rx="170" ry="20" fill="#3a1f73" />
      <ellipse cx={x} cy={y - 22} rx="160" ry="14" fill="#8f78f0" />
    </g>
  );
};

const Cinema = ({ boost }: { boost: number }) => (
  <g className="park-layer">
    {boost >= 5 && <rect x="10" y="520" width="270" height="290" rx="20" fill="#ffcf4a" opacity="0.12" className="twinkle" />}
    <rect x="30" y="560" width="230" height="240" fill="#2a1a66" />
    <rect x="20" y="540" width="250" height="40" rx="6" fill="#ff6fb5" />
    <text x="145" y="569" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff" fontFamily="Fredoka">
      CINEMA
    </text>
    {Array.from({ length: 12 }).map((_, i) => (
      <circle key={i} className="bulb glow" cx={30 + i * 21} cy={588} r="4" fill="#ffcf4a" style={{ animationDelay: `${(i % 2) * 0.5}s` }} />
    ))}
    <rect x="60" y="610" width="170" height="80" rx="6" fill="#0b0f3a" stroke="#ffcf4a" strokeWidth="3" />
    <text x="145" y="660" textAnchor="middle" fontSize="30" fill="#ffcf4a">
      🍿🎬
    </text>
    <rect x="115" y="720" width="60" height="80" rx="4" fill="#ffcf4a" opacity="0.85" />
  </g>
);

const Booths = ({ boost }: { boost: number }) => (
  <g className="park-layer">
    {boost >= 5 && (
      <g className="twinkle">
        <rect x="960" y="600" width="620" height="210" rx="30" fill="#ffcf4a" opacity="0.1" />
      </g>
    )}
    {/* popcorn kiosk */}
    <g>
      <rect x="1000" y="700" width="120" height="100" rx="6" fill="#fff" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={1000 + i * 20} y="700" width="10" height="100" fill="#ff4d6d" />
      ))}
      <path d="M990 700 Q1060 660 1130 700 Z" fill="#ff4d6d" />
      <rect x="1010" y="645" width="100" height="26" rx="8" fill="#0b0f3a" stroke={boost >= 5 ? "#fff6c9" : "#ffcf4a"} strokeWidth="2" />
      <text className="neon" x="1060" y="664" textAnchor="middle" fontSize="16" fontWeight="700" fill="#ffcf4a" fontFamily="Fredoka">
        POPCORN
      </text>
      <text x="1060" y="760" textAnchor="middle" fontSize="34">
        🍿
      </text>
    </g>
    {/* ticket booth */}
    <g>
      <rect x="1180" y="660" width="130" height="140" fill="#3a1f73" />
      <path d="M1165 660 L1245 610 L1325 660 Z" fill="#ffcf4a" />
      <rect x="1200" y="690" width="90" height="50" rx="6" fill="#3ee6d6" opacity={boost >= 5 ? 1 : 0.8} />
      <text x="1245" y="722" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0b0f3a" fontFamily="Fredoka">
        TICKETS
      </text>
      <text x="1245" y="780" textAnchor="middle" fontSize="28">
        🎟️
      </text>
    </g>
    {/* game booth */}
    <g>
      <rect x="1390" y="650" width="170" height="150" fill="#2a1a66" />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M${1380 + i * 32} 650 l16 -34 l16 34 z`} fill={i % 2 ? "#ff6fb5" : "#fff"} />
      ))}
      <text className="neon" style={{ animationDelay: "-2s" }} x="1475" y="600" textAnchor="middle" fontSize="24" fontWeight="700" fill="#3ee6d6" fontFamily="Fredoka">
        GAMES
      </text>
      <circle cx="1475" cy="720" r="34" fill="#fff" />
      <circle cx="1475" cy="720" r="24" fill="#ff6fb5" />
      <circle cx="1475" cy="720" r="13" fill="#fff" />
      <circle cx="1475" cy="720" r="5" fill="#ff6fb5" />
    </g>
    {/* balloon cart */}
    <g className="sway" style={{ animationDuration: "4s" }}>
      <line x1="620" y1="800" x2="600" y2="690" stroke="#fff" strokeWidth="1.5" />
      <line x1="620" y1="800" x2="630" y2="680" stroke="#fff" strokeWidth="1.5" />
      <line x1="620" y1="800" x2="655" y2="700" stroke="#fff" strokeWidth="1.5" />
      <ellipse cx="600" cy="675" rx="18" ry="22" fill="#ff6fb5" />
      <ellipse cx="630" cy="662" rx="18" ry="22" fill="#3ee6d6" />
      <ellipse cx="656" cy="686" rx="18" ry="22" fill="#ffcf4a" />
    </g>
    {/* neon FUN sign */}
    <g>
      <line x1="300" y1="800" x2="300" y2="610" stroke="#2e2378" strokeWidth="6" />
      <rect x="250" y="580" width="100" height="40" rx="10" fill="#0b0f3a" stroke="#ff6fb5" strokeWidth="3" />
      <text className="neon" style={{ animationDelay: "-1s" }} x="300" y="608" textAnchor="middle" fontSize="24" fontWeight="700" fill="#ff6fb5" fontFamily="Fredoka">
        FUN ✦
      </text>
    </g>
  </g>
);

const Skyline = () => (
  <g className="park-layer" opacity="0.9">
    {/* far cartoon castle & domes */}
    <path d="M520,700 V600 h20 v-20 h14 v20 h20 v-20 h14 v20 h20 V700Z" fill="#221a5e" />
    <path d="M560,580 l14,-40 l14,40z" fill="#2c2270" />
    <path d="M980,700 v-90 q50,-70 100,0 v90z" fill="#221a5e" />
    <path d="M1030,540 v-30" stroke="#ffcf4a" strokeWidth="2" />
    <path d="M1030,510 l18,6 l-18,6z" fill="#ff6fb5" />
    <path d="M1560,700 v-120 h30 v-30 l20,-30 l20,30 v30 h30 v120z" fill="#221a5e" />
    {[
      [548, 640],
      [590, 640],
      [1020, 640],
      [1045, 640],
      [1600, 620],
      [1630, 620],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="8" height="12" rx="2" fill="#ffcf4a" opacity="0.7" className="twinkle" style={{ animationDelay: `${i * 0.7}s` }} />
    ))}
  </g>
);

const LightString = ({ d, n, y0 }: { d: string; n: number; y0: (t: number) => [number, number] }) => (
  <g>
    <path d={d} stroke="#c7b8ff44" strokeWidth="1.5" fill="none" />
    {Array.from({ length: n }).map((_, i) => {
      const [x, y] = y0(i / (n - 1));
      return <circle key={i} className="bulb glow" cx={x} cy={y} r="3.5" fill={COLORS[i % 4]} style={{ animationDelay: `${(i % 4) * 0.3}s` }} />;
    })}
  </g>
);

const Lights = () => (
  <g>
    <path d="M0,40 Q200,130 400,60 T800,60 T1200,60 T1600,40" stroke="#c7b8ff55" strokeWidth="2" fill="none" />
    {Array.from({ length: 40 }).map((_, i) => {
      const t = i / 39;
      const x = t * 1600;
      const y = 50 + Math.abs(Math.sin(t * Math.PI * 4)) * 45;
      return <circle key={i} className="bulb glow" cx={x} cy={y} r="5" fill={COLORS[i % 4]} style={{ animationDelay: `${(i % 5) * 0.25}s` }} />;
    })}
    {/* low strings between booths */}
    <LightString d="M270,590 Q450,650 620,640" n={12} y0={(t) => [270 + t * 350, 590 + Math.sin(t * Math.PI) * 50 + t * 50 - t * 40]} />
    <LightString d="M1120,650 Q1250,700 1390,640" n={10} y0={(t) => [1120 + t * 270, 650 + Math.sin(t * Math.PI) * 45 - t * 10]} />
  </g>
);

const VISITORS = [
  { dur: 70, delay: 0, s: 1, rev: false, b: "" },
  { dur: 55, delay: -20, s: 0.7, rev: false, b: "#ff6fb5" },
  { dur: 80, delay: -35, s: 1.05, rev: true, b: "" },
  { dur: 62, delay: -50, s: 0.75, rev: true, b: "#3ee6d6" },
  { dur: 90, delay: -10, s: 0.95, rev: false, b: "" },
  { dur: 75, delay: -60, s: 0.68, rev: true, b: "#ffcf4a" },
];
const Visitors = () => (
  <g>
    {VISITORS.map((v, i) => (
      <g key={i} className={cn("visitor", v.rev && "rev")} style={{ animationDuration: `${v.dur}s`, animationDelay: `${v.delay}s` }}>
        <g transform={`translate(0,838) scale(${v.s})`}>
          <g className="visitor-bob" style={{ animationDelay: `${i * 0.13}s` }}>
            <circle cx="0" cy="-58" r="9" fill="#0a0726" />
            <path d="M-11,-47 h22 l4,30 h-30z" fill="#0a0726" />
            <rect x="-9" y="-18" width="7" height="18" rx="3" fill="#0a0726" />
            <rect x="2" y="-18" width="7" height="18" rx="3" fill="#0a0726" />
            {v.b && (
              <>
                <line x1="12" y1="-40" x2="18" y2="-95" stroke="#ffffff66" />
                <ellipse cx="18" cy="-108" rx="10" ry="13" fill={v.b} opacity="0.85" />
              </>
            )}
          </g>
        </g>
      </g>
    ))}
  </g>
);

const BALLOONS = [
  { x: 180, c: "#ff6fb5", d: 0 },
  { x: 700, c: "#3ee6d6", d: 5 },
  { x: 1100, c: "#ffcf4a", d: 9 },
  { x: 1500, c: "#c7b8ff", d: 3 },
  { x: 950, c: "#ff6fb5", d: 13 },
];
const FLY = Array.from({ length: 16 }, (_, i) => ({ x: 60 + i * 97, c: COLORS[i % 4], d: (i % 5) * 0.9 }));

interface BgProps {
  lit?: boolean;
  fast?: boolean;
  boost?: number;
  cam?: boolean;
}
function ParkBackgroundInner({ lit = true, fast = false, boost = 0, cam = false }: BgProps) {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", !lit && "park-dim", fast && "fast")} aria-hidden>
      <div className={cn("cam absolute inset-0", cam && "cam-zoom")}>
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
          <defs>
            <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#060927" />
              <stop offset="0.45" stopColor="#151a5c" />
              <stop offset="0.8" stopColor="#3a1f73" />
              <stop offset="1" stopColor="#6b3d9a" />
            </linearGradient>
            <radialGradient id="moonGlow">
              <stop offset="0" stopColor="#fff6d6" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beam" x1="0" x2="0" y1="1" y2="0">
              <stop offset="0" stopColor="#c7b8ff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#c7b8ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="1600" height="900" fill="url(#sky)" />
          {STARS.map((s, i) => (
            <circle key={i} className="twinkle" cx={s.x} cy={s.y} r={s.r} fill="#fff" style={{ animationDelay: `${s.d}s` }} />
          ))}
          <circle cx="1380" cy="140" r="120" fill="url(#moonGlow)" />
          <circle cx="1380" cy="140" r="46" fill="#fff4cf" />
          <circle cx="1398" cy="128" r="40" fill="#151a5c" opacity="0.9" />
          <g className="glow">
            <path className="searchlight" d="M640,820 L560,0 L720,0 Z" fill="url(#beam)" />
            <path className="searchlight" style={{ animationDelay: "-3s" }} d="M1180,820 L1100,0 L1260,0 Z" fill="url(#beam)" />
          </g>
          <Skyline />
          <path d="M0,700 Q200,620 420,680 T860,660 T1300,680 T1600,650 V900 H0Z" fill="#1a1250" className="park-layer" />
          <Wheel boost={boost} />
          <Coaster boost={boost} />
          <Carousel boost={boost} />
          <Cinema boost={boost} />
          <Booths boost={boost} />
          {BALLOONS.map((b, i) => (
            <g key={i} className="bg-balloon" style={{ animationDelay: `${-b.d}s` }}>
              <ellipse cx={b.x} cy={930} rx="16" ry="20" fill={b.c} opacity="0.85" />
              <line x1={b.x} y1={950} x2={b.x + 4} y2={990} stroke="#fff8" />
            </g>
          ))}
          <rect x="0" y="800" width="1600" height="100" fill="#120c3d" />
          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={i} className="bulb glow" cx={40 + i * 80} cy={812} r="3" fill="#ffcf4a" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
          <Visitors />
          {boost >= 4 &&
            FLY.map((b, i) => (
              <g key={"fly" + i} className="fly-up" style={{ animationDelay: `${b.d}s`, animationDuration: `${5 + (i % 4)}s` }}>
                <ellipse cx={b.x} cy={900} rx="18" ry="23" fill={b.c} />
                <line x1={b.x} y1={923} x2={b.x + 3} y2={965} stroke="#fff9" />
              </g>
            ))}
          <Lights />
        </svg>
        <FarFireworks />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(11,15,58,0.15), rgba(6,9,39,0.65))" }} />
    </div>
  );
}
export const ParkBackground = memo(ParkBackgroundInner);

/** Occasional small bursts far in the sky – not all the time. */
const FAR = [
  { x: 72, y: 16, c: "#ffcf4a", d: 3 },
  { x: 22, y: 12, c: "#3ee6d6", d: 8 },
  { x: 55, y: 8, c: "#ff6fb5", d: 12.5 },
];
function FarFireworks() {
  return (
    <div className="park-layer absolute inset-0 pointer-events-none">
      {FAR.map((f, i) => (
        <div key={i} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.c }}>
          {Array.from({ length: 12 }).map((_, k) => (
            <span key={k} className="fw-far" style={{ ["--r" as string]: `${k * 30}deg`, ["--d" as string]: `${34 + (k % 2) * 10}px`, animationDelay: `${f.d}s` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

const FW = [
  { x: 15, y: 20, c: "#ffcf4a", d: 0 },
  { x: 80, y: 18, c: "#ff6fb5", d: 0.6 },
  { x: 50, y: 12, c: "#3ee6d6", d: 1.1 },
  { x: 30, y: 35, c: "#c7b8ff", d: 1.5 },
  { x: 70, y: 32, c: "#ffcf4a", d: 0.3 },
  { x: 90, y: 40, c: "#3ee6d6", d: 0.9 },
];
export function Fireworks({ count = 6 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {FW.slice(0, count).map((f, i) => (
        <div key={i} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%`, color: f.c }}>
          {Array.from({ length: 16 }).map((_, k) => (
            <span
              key={k}
              className="fw-spark"
              style={{ ["--r" as string]: `${k * 22.5}deg`, ["--d" as string]: `${70 + (k % 3) * 18}px`, animationDelay: `${f.d}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
