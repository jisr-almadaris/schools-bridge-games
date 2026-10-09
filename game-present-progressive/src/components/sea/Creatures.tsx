import type { CSSProperties } from "react";
import { useSvgIds } from "../../game/utils";

type Base = { className?: string; style?: CSSProperties };

export function starPath(cx: number, cy: number, R: number, r: number, n = 5) {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / n) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)} `;
  }
  return d + "Z";
}

/* ---------------- Fish ---------------- */
export function Fish({
  c1 = "#fde047",
  c2 = "#f97316",
  fin = "#fb7185",
  stripe,
  flip,
  glow,
  chomp,
  className,
  style,
}: Base & { c1?: string; c2?: string; fin?: string; stripe?: string; flip?: boolean; glow?: boolean; chomp?: boolean }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 120 80" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <linearGradient id={id("b")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <radialGradient id={id("g")}>
          <stop offset="0" stopColor={c1} stopOpacity="0.55" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={flip ? "translate(120 0) scale(-1 1)" : undefined}>
        {glow && <ellipse cx="62" cy="40" rx="70" ry="48" fill={`url(#${id("g")})`} />}
        <g className="dv-g" style={{ transformOrigin: "38px 40px", animation: "k-tail .42s ease-in-out infinite alternate" }}>
          <path d="M40 40 Q22 22 6 15 Q15 40 6 65 Q22 58 40 40 Z" fill={fin} />
          <path d="M34 40 Q20 30 12 26 M34 40 Q20 50 12 54" stroke="#fff" strokeWidth="2" opacity="0.35" fill="none" />
        </g>
        <path d="M50 18 Q64 -1 86 14 Z" fill={fin} />
        <path d="M58 62 Q66 77 80 64 Z" fill={fin} opacity="0.9" />
        <ellipse cx="66" cy="40" rx="38" ry="25" fill={`url(#${id("b")})`} />
        {stripe && (
          <>
            <path d="M54 19 Q47 40 54 61" stroke={stripe} strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M77 17 Q71 40 77 63" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
          </>
        )}
        <ellipse cx="62" cy="51" rx="26" ry="8" fill="#fff" opacity="0.2" />
        <ellipse cx="60" cy="27" rx="16" ry="5" fill="#fff" opacity="0.35" />
        <path d="M64 44 Q55 55 69 54 Z" fill={fin} opacity="0.95" />
        <circle cx="86" cy="34" r="9.5" fill="#fff" />
        <circle cx="88" cy="34.5" r="5.8" fill="#1e1b4b" />
        <circle cx="90" cy="31.8" r="2.1" fill="#fff" />
        <ellipse cx="90" cy="47" rx="5" ry="3" fill="#ff8fab" opacity="0.7" />
        {chomp ? (
          <ellipse className="fill-box" cx="100" cy="46" rx="3.5" ry="3" fill="#7c2d12" style={{ animation: "k-glow .5s ease-in-out infinite" }} />
        ) : (
          <path d="M99 43 Q103 46 99 49" stroke="#7c2d12" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}

/* ---------------- Sea turtle ---------------- */
export function Turtle({ eating, flip, className, style }: Base & { eating?: boolean; flip?: boolean }) {
  const id = useSvgIds();
  const skin = "#8ff0b4";
  return (
    <svg viewBox="0 0 180 115" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <radialGradient id={id("s")} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#a7f3d0" />
          <stop offset="0.55" stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </radialGradient>
      </defs>
      <g transform={flip ? "translate(180 0) scale(-1 1)" : undefined}>
        <g className="dv-g" style={{ transformOrigin: "58px 70px", animation: "k-flipper 1.3s ease-in-out infinite alternate-reverse" }}>
          <path d="M60 68 Q38 90 18 98 Q40 104 68 80 Z" fill="#5fd99a" stroke="#15803d" strokeWidth="1.5" />
        </g>
        <path d="M30 62 Q14 64 8 57 Q18 52 32 55 Z" fill={skin} stroke="#15803d" strokeWidth="1.5" />
        <g className="dv-g" style={{ transformOrigin: "128px 60px", animation: eating ? "k-munch .55s ease-in-out infinite" : undefined }}>
          <path d="M118 50 Q134 42 146 46 L144 66 Q130 68 118 64 Z" fill={skin} />
          <ellipse cx="150" cy="52" rx="21" ry="18" fill={skin} stroke="#15803d" strokeWidth="1.5" />
          <circle cx="146" cy="40" r="2.2" fill="#4ade80" />
          <circle cx="140" cy="48" r="1.8" fill="#4ade80" />
          <circle cx="157" cy="45" r="6.2" fill="#fff" />
          <circle cx="158.6" cy="45.5" r="4" fill="#1e1b4b" />
          <circle cx="160" cy="43.6" r="1.5" fill="#fff" />
          <ellipse cx="160" cy="57" rx="4.5" ry="2.6" fill="#ff8fab" opacity="0.75" />
          {eating ? (
            <>
              <ellipse cx="168" cy="58" rx="3.5" ry="3" fill="#14532d" />
              <path d="M168 58 Q182 50 186 62 Q176 70 168 60 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.2" />
            </>
          ) : (
            <path d="M161 59 Q165 62 169 57" stroke="#14532d" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
        </g>
        <path d="M30 64 Q85 88 134 62 Q90 74 30 64 Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
        <path d="M26 64 Q30 14 82 12 Q132 14 138 62 Q84 76 26 64 Z" fill={`url(#${id("s")})`} stroke="#065f46" strokeWidth="2.5" />
        <g fill="#6ee7b7" stroke="#065f46" strokeWidth="1.8" opacity="0.85">
          <path d="M64 26 L82 20 L100 26 L102 44 L82 52 L62 44 Z" />
          <path d="M40 40 L58 34 L60 52 L44 60 L34 56 Z" />
          <path d="M106 34 L124 40 L130 56 L118 62 L104 52 Z" />
        </g>
        <path d="M44 24 Q70 12 100 16" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.35" />
        <g className="dv-g" style={{ transformOrigin: "112px 66px", animation: "k-flipper 1.3s ease-in-out infinite alternate" }}>
          <path d="M106 64 Q118 94 100 108 Q130 100 124 66 Z" fill="#6ee7a8" stroke="#15803d" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
}

/* ---------------- Jellyfish ---------------- */
export function Jellyfish({
  c1 = "#f9a8d4",
  c2 = "#c084fc",
  glow,
  className,
  style,
}: Base & { c1?: string; c2?: string; glow?: boolean }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 100 150" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <radialGradient id={id("b")} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.35" stopColor={c1} stopOpacity="0.9" />
          <stop offset="1" stopColor={c2} stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id={id("g")}>
          <stop offset="0" stopColor={c1} stopOpacity="0.6" />
          <stop offset="1" stopColor={c2} stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <circle cx="50" cy="50" r="62" fill={`url(#${id("g")})`} />}
      <g className="dv-g" style={{ transformOrigin: "50px 58px", animation: "k-jl-tent 1.6s ease-in-out infinite alternate" }}>
        <g stroke={c2} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85">
          <path d="M24 58 Q18 80 26 100 Q32 120 24 140" />
          <path d="M40 60 Q46 84 38 104 Q32 124 40 146" />
          <path d="M60 60 Q54 84 62 104 Q68 124 60 146" />
          <path d="M76 58 Q82 80 74 100 Q68 120 76 140" />
        </g>
        <path d="M44 60 Q38 80 48 96 Q56 110 50 124 Q62 108 56 92 Q50 78 56 60 Z" fill={c1} opacity="0.75" />
      </g>
      <path
        d="M8 58 Q8 8 50 8 Q92 8 92 58 Q84 64 76 58 Q68 66 58 59 Q50 66 42 59 Q32 66 24 58 Q16 64 8 58 Z"
        fill={`url(#${id("b")})`}
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
      <ellipse cx="32" cy="26" rx="12" ry="6.5" fill="#fff" opacity="0.55" transform="rotate(-30 32 26)" />
      <circle cx="39" cy="40" r="3.6" fill="#3b0764" />
      <circle cx="61" cy="40" r="3.6" fill="#3b0764" />
      <circle cx="40.2" cy="38.8" r="1.2" fill="#fff" />
      <circle cx="62.2" cy="38.8" r="1.2" fill="#fff" />
      <ellipse cx="32" cy="47" rx="4" ry="2.4" fill="#ff6fa1" opacity="0.6" />
      <ellipse cx="68" cy="47" rx="4" ry="2.4" fill="#ff6fa1" opacity="0.6" />
      <path d="M45 46 Q50 51 55 46" stroke="#3b0764" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Starfish ---------------- */
export function Starfish({ c = "#fb923c", face, className, style }: Base & { c?: string; face?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <path d={starPath(50, 52, 44, 19)} fill={c} stroke={c} strokeWidth="9" strokeLinejoin="round" />
      <path d={starPath(50, 52, 36, 15)} fill="#fff" opacity="0.18" />
      {[
        [50, 22],
        [78, 42],
        [67, 76],
        [33, 76],
        [22, 42],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fff" opacity="0.7" />
      ))}
      {face && (
        <>
          <circle cx="43" cy="50" r="3.4" fill="#431407" />
          <circle cx="57" cy="50" r="3.4" fill="#431407" />
          <circle cx="44" cy="49" r="1.1" fill="#fff" />
          <circle cx="58" cy="49" r="1.1" fill="#fff" />
          <path d="M45 57 Q50 61 55 57" stroke="#431407" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ---------------- Small peeking octopus ---------------- */
export function SmallOctopus({ className, style }: Base) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 140 130" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <radialGradient id={id("h")} cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f5d0fe" />
          <stop offset="0.5" stopColor="#c084fc" />
          <stop offset="1" stopColor="#9333ea" />
        </radialGradient>
      </defs>
      <g className="dv-g" style={{ transformOrigin: "112px 92px", animation: "k-tent 0.9s ease-in-out infinite alternate" }}>
        <path d="M104 92 Q128 84 128 60 Q128 48 136 46" stroke="#a855f7" strokeWidth="12" fill="none" strokeLinecap="round" />
      </g>
      <path d="M30 96 Q20 118 8 120 M50 100 Q48 120 40 128 M90 100 Q92 120 100 128" stroke="#a855f7" strokeWidth="12" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="62" rx="46" ry="42" fill={`url(#${id("h")})`} />
      <ellipse cx="54" cy="38" rx="14" ry="8" fill="#fff" opacity="0.4" transform="rotate(-25 54 38)" />
      <circle cx="84" cy="36" r="5" fill="#e9d5ff" />
      <circle cx="96" cy="50" r="3.5" fill="#e9d5ff" />
      <ellipse cx="56" cy="66" rx="9" ry="11" fill="#fff" />
      <ellipse cx="84" cy="66" rx="9" ry="11" fill="#fff" />
      <circle cx="58" cy="68" r="6" fill="#2e1065" />
      <circle cx="86" cy="68" r="6" fill="#2e1065" />
      <circle cx="60" cy="65.5" r="2.2" fill="#fff" />
      <circle cx="88" cy="65.5" r="2.2" fill="#fff" />
      <ellipse cx="44" cy="82" rx="7" ry="4" fill="#f472b6" opacity="0.6" />
      <ellipse cx="96" cy="82" rx="7" ry="4" fill="#f472b6" opacity="0.6" />
      <path d="M62 84 Q70 91 78 84" stroke="#581c87" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Tiny fish school (background) ---------------- */
export function FishSchool({ color = "#cffafe", className, style }: Base & { color?: string }) {
  const pts = [
    [10, 22],
    [34, 8],
    [36, 34],
    [58, 18],
    [62, 42],
    [86, 28],
    [84, 6],
    [108, 16],
  ];
  return (
    <svg viewBox="0 0 130 54" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      {pts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M0 0 Q9 -6 18 0 Q9 6 0 0 Z M1 0 L-6 -5 L-6 5 Z" fill={color} />
        </g>
      ))}
    </svg>
  );
}

/* ---------------- Pearl ---------------- */
export function Pearl({ golden, className, style }: Base & { golden?: boolean }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <radialGradient id={id("p")} cx="0.34" cy="0.3" r="0.75">
          {golden ? (
            <>
              <stop offset="0" stopColor="#fffbea" />
              <stop offset="0.3" stopColor="#fde68a" />
              <stop offset="0.7" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#b45309" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.35" stopColor="#fdf2f8" />
              <stop offset="0.75" stopColor="#f5d0fe" />
              <stop offset="1" stopColor="#a78bfa" />
            </>
          )}
        </radialGradient>
        <radialGradient id={id("g")}>
          <stop offset="0.45" stopColor={golden ? "#fde68a" : "#ffffff"} stopOpacity="0.9" />
          <stop offset="1" stopColor={golden ? "#f59e0b" : "#f0abfc"} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${id("g")})`} />
      <circle cx="50" cy="50" r="30" fill={`url(#${id("p")})`} />
      <ellipse cx="40" cy="38" rx="9" ry="6" fill="#fff" opacity="0.9" transform="rotate(-30 40 38)" />
      <path d="M30 60 Q46 74 66 62" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}
