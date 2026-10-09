import type { CSSProperties } from "react";
import { useSvgIds } from "../../game/utils";

type Base = { className?: string; style?: CSSProperties };

/* ---------------- Branching (staghorn) coral ---------------- */
const BRANCHES = [
  "M100 218 L100 150 L68 112 L58 58",
  "M100 150 L136 106 L142 48",
  "M68 112 L34 88 L26 50",
  "M136 106 L170 84 L178 44",
  "M100 150 L103 72 L96 30",
];
const TIPS = [
  [58, 58],
  [142, 48],
  [26, 50],
  [178, 44],
  [96, 30],
];
export function BranchCoral({
  c1 = "#ff6f9f",
  c2 = "#ffc2d6",
  glow,
  className,
  style,
}: Base & { c1?: string; c2?: string; glow?: boolean }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 200 220" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      {glow && (
        <>
          <defs>
            <radialGradient id={id("g")}>
              <stop offset="0" stopColor={c2} stopOpacity="0.75" />
              <stop offset="1" stopColor={c1} stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="120" rx="125" ry="115" fill={`url(#${id("g")})`} />
        </>
      )}
      <g stroke={c1} strokeWidth="21" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {BRANCHES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g stroke={c2} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" transform="translate(-4 0)">
        {BRANCHES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      {TIPS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7.5" fill={c2} />
      ))}
      {[
        [84, 132],
        [120, 126],
        [62, 90],
        [150, 90],
        [100, 100],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fff" opacity="0.55" />
      ))}
    </svg>
  );
}

/* ---------------- Sea fan ---------------- */
export function FanCoral({ c1 = "#a78bfa", c2 = "#ede9fe", glow, className, style }: Base & { c1?: string; c2?: string; glow?: boolean }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 200 200" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <radialGradient id={id("f")} cx="0.5" cy="0.85" r="0.9">
          <stop offset="0" stopColor={c2} />
          <stop offset="0.35" stopColor={c1} />
          <stop offset="1" stopColor={c1} />
        </radialGradient>
        <radialGradient id={id("g")}>
          <stop offset="0" stopColor={c2} stopOpacity="0.7" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <ellipse cx="100" cy="100" rx="120" ry="110" fill={`url(#${id("g")})`} />}
      <path d="M100 198 L100 150" stroke={c1} strokeWidth="13" strokeLinecap="round" />
      <path
        d="M100 160 Q22 152 18 92 Q14 40 56 24 Q100 4 144 24 Q186 40 182 92 Q178 152 100 160 Z"
        fill={`url(#${id("f")})`}
        opacity="0.95"
      />
      <g stroke={c2} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M100 158 L100 16" />
        <path d="M100 150 Q70 110 42 44" />
        <path d="M100 150 Q130 110 158 44" />
        <path d="M100 150 Q52 130 24 88" />
        <path d="M100 150 Q148 130 176 88" />
        <path d="M58 38 Q80 58 100 58 Q120 58 142 38" />
        <path d="M34 80 Q70 100 100 96 Q130 100 166 80" />
        <path d="M44 122 Q72 134 100 130 Q128 134 156 122" />
      </g>
      {[
        [36, 58],
        [72, 22],
        [128, 22],
        [164, 58],
        [176, 110],
        [24, 110],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={c2} />
      ))}
    </svg>
  );
}

/* ---------------- Brain coral ---------------- */
export function BrainCoral({ c1 = "#fdba74", c2 = "#ea580c", className, style }: Base & { c1?: string; c2?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <path d="M8 118 Q8 18 100 12 Q192 18 192 118 Z" fill={c1} stroke={c2} strokeWidth="3" />
      <g stroke={c2} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7">
        <path d="M30 100 Q40 70 60 80 Q80 90 90 60 Q100 40 120 55 Q140 70 160 50" />
        <path d="M24 116 Q50 96 70 106 Q95 118 110 92 Q125 70 150 86 Q170 98 182 80" />
        <path d="M50 48 Q70 34 90 40 Q110 28 130 34 Q150 28 162 44" />
      </g>
      <ellipse cx="72" cy="38" rx="30" ry="10" fill="#fff" opacity="0.28" />
    </svg>
  );
}

/* ---------------- Tube coral ---------------- */
export function TubeCoral({ colors = ["#fbbf24", "#f472b6", "#a78bfa"], glow, className, style }: Base & { colors?: string[]; glow?: boolean }) {
  const tubes = [
    { x: 14, h: 110, w: 30, c: colors[0] },
    { x: 46, h: 170, w: 34, c: colors[1] },
    { x: 84, h: 140, w: 30, c: colors[2] },
    { x: 116, h: 92, w: 28, c: colors[0] },
  ];
  return (
    <svg viewBox="0 0 160 200" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      {tubes.map((t, i) => (
        <g key={i}>
          {glow && <ellipse cx={t.x + t.w / 2} cy={200 - t.h + 6} rx={t.w} ry="16" fill={t.c} opacity="0.35" />}
          <rect x={t.x} y={200 - t.h} width={t.w} height={t.h} rx={t.w / 2.5} fill={t.c} stroke="rgba(0,0,0,.18)" strokeWidth="2" />
          <ellipse cx={t.x + t.w / 2} cy={200 - t.h + 7} rx={t.w / 2 - 3} ry="6" fill="rgba(60,10,80,.45)" />
          <rect x={t.x + 5} y={200 - t.h + 16} width="5" height={t.h - 28} rx="2.5" fill="#fff" opacity="0.32" />
        </g>
      ))}
    </svg>
  );
}

/* ---------------- Anemone ---------------- */
export function Anemone({ c1 = "#f472b6", c2 = "#fbcfe8", className, style }: Base & { c1?: string; c2?: string }) {
  const tents = Array.from({ length: 11 }, (_, i) => -75 + i * 15);
  return (
    <svg viewBox="0 0 180 150" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      {tents.map((deg, i) => (
        <g
          key={i}
          className="dv-g"
          style={{
            transformOrigin: "90px 112px",
            transform: `rotate(${deg}deg)`,
          }}
        >
          <g
            className="dv-g"
            style={{
              transformOrigin: "90px 112px",
              animation: `k-tent ${1.4 + (i % 3) * 0.3}s ease-in-out ${i * 0.12}s infinite alternate`,
            }}
          >
            <path d="M90 112 Q82 82 92 56" stroke={c1} strokeWidth="11" fill="none" strokeLinecap="round" />
            <circle cx="92" cy="55" r="6.5" fill={c2} />
          </g>
        </g>
      ))}
      <path d="M48 146 Q50 110 90 106 Q130 110 132 146 Z" fill={c1} stroke="rgba(0,0,0,.15)" strokeWidth="2" />
      <path d="M60 140 Q64 118 90 114" stroke="#fff" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Seaweed ---------------- */
export function Seaweed({
  c1 = "#34d399",
  c2 = "#a7f3d0",
  glow,
  className,
  style,
}: Base & { c1?: string; c2?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 70 260" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <path
        d="M34 260 Q14 222 30 182 Q46 142 28 102 Q12 62 32 10 Q50 62 40 102 Q56 142 42 182 Q30 222 44 260 Z"
        fill={c1}
        stroke="rgba(0,0,0,.12)"
        strokeWidth="2"
      />
      <path d="M38 252 Q26 216 36 182 Q46 144 33 104 Q22 66 32 26" stroke={c2} strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M40 200 Q60 186 64 160 Q50 176 38 180 Z" fill={c1} />
      <path d="M30 140 Q8 126 6 102 Q20 118 32 122 Z" fill={c1} />
      {glow && (
        <>
          <circle cx="32" cy="14" r="9" fill={c2} opacity="0.9" />
          <circle cx="64" cy="160" r="6" fill={c2} opacity="0.9" />
          <circle cx="6" cy="102" r="6" fill={c2} opacity="0.9" />
        </>
      )}
    </svg>
  );
}

export function SeaGrass({ c = "#2dd4bf", className, style }: Base & { c?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      {[
        "M20 120 Q14 80 26 30",
        "M38 120 Q44 70 34 14",
        "M58 120 Q52 76 64 22",
        "M78 120 Q86 80 76 34",
        "M98 120 Q92 88 104 44",
      ].map((d, i) => (
        <path key={i} d={d} stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" opacity={0.85 - (i % 2) * 0.15} />
      ))}
    </svg>
  );
}

/* ---------------- Rocks & cave ---------------- */
export function Rock({ c1 = "#8b8fd6", c2 = "#4f539b", className, style }: Base & { c1?: string; c2?: string }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 220 130" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <linearGradient id={id("r")} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <path d="M8 128 Q0 80 40 60 Q60 20 110 26 Q160 18 188 56 Q220 80 212 128 Z" fill={`url(#${id("r")})`} />
      <path d="M44 62 Q70 46 96 58" stroke="#fff" opacity="0.22" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="60" r="7" fill="#5eead4" opacity="0.55" />
      <circle cx="162" cy="70" r="5" fill="#5eead4" opacity="0.45" />
      <circle cx="70" cy="96" r="6" fill="#000" opacity="0.08" />
    </svg>
  );
}

export function RockCave({ c1 = "#8b8fd6", c2 = "#4f539b", inner = "#10244f", className, style }: Base & { c1?: string; c2?: string; inner?: string }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 320 240" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <linearGradient id={id("r")} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <radialGradient id={id("c")} cx="0.5" cy="0.7" r="0.7">
          <stop offset="0" stopColor={inner} />
          <stop offset="1" stopColor="#1e1b4b" />
        </radialGradient>
      </defs>
      <path d="M0 240 Q-6 120 60 70 Q120 10 200 30 Q280 40 310 120 Q330 190 320 240 Z" fill={`url(#${id("r")})`} />
      <path d="M86 240 Q88 146 150 136 Q214 146 218 240 Z" fill={`url(#${id("c")})`} />
      <path d="M70 84 Q120 40 180 46" stroke="#fff" strokeWidth="9" opacity="0.18" fill="none" strokeLinecap="round" />
      <circle cx="250" cy="90" r="10" fill="#5eead4" opacity="0.5" />
      <circle cx="266" cy="106" r="7" fill="#5eead4" opacity="0.4" />
      <circle cx="40" cy="170" r="8" fill="#f9a8d4" opacity="0.5" />
    </svg>
  );
}

/* ---------------- Shells ---------------- */
export function Scallop({ c1 = "#fbcfe8", c2 = "#f472b6", className, style }: Base & { c1?: string; c2?: string }) {
  return (
    <svg viewBox="0 0 100 96" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <path
        d="M50 88 Q30 70 10 42 Q8 20 22 14 Q30 4 40 10 Q50 2 60 10 Q70 4 78 14 Q92 20 90 42 Q70 70 50 88 Z"
        fill={c1}
        stroke={c2}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <g stroke={c2} strokeWidth="2.5" opacity="0.8" strokeLinecap="round">
        <path d="M50 86 L22 16 M50 86 L40 10 M50 86 L60 10 M50 86 L78 16 M50 86 L90 40 M50 86 L10 40" />
      </g>
      <path d="M38 84 L50 94 L62 84 L60 96 L40 96 Z" fill={c2} />
    </svg>
  );
}

export function OpenOyster({ glow, className, style }: Base & { glow?: boolean }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 120 90" className={className} style={{ overflow: "visible", ...style }} aria-hidden>
      <defs>
        <radialGradient id={id("p")} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.5" stopColor="#fdf2f8" />
          <stop offset="1" stopColor="#c4b5fd" />
        </radialGradient>
      </defs>
      <path d="M8 44 Q10 4 60 2 Q110 4 112 44 Q60 34 8 44 Z" fill="#fce7f3" stroke="#c084fc" strokeWidth="2.5" />
      <path d="M30 40 L24 14 M48 36 L44 8 M72 36 L76 8 M90 40 L96 14" stroke="#e9d5ff" strokeWidth="2" />
      <path d="M6 50 Q60 40 114 50 Q108 86 60 88 Q12 86 6 50 Z" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2.5" />
      <ellipse cx="60" cy="52" rx="44" ry="9" fill="#fdf4ff" />
      {glow && <circle cx="60" cy="44" r="24" fill="#fff" opacity="0.35" />}
      <circle cx="60" cy="46" r="11" fill={`url(#${id("p")})`} />
      <ellipse cx="56" cy="42" rx="3.5" ry="2.2" fill="#fff" />
    </svg>
  );
}

/* ---------------- Sand floor & far reef silhouettes ---------------- */
export function SandFloor({ c1 = "#f6dfb8", c2 = "#d9a98f", dots = "#ffffff", className, style }: Base & { c1?: string; c2?: string; dots?: string }) {
  const id = useSvgIds();
  return (
    <svg viewBox="0 0 1000 120" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={id("s")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      <path d="M0 40 Q120 12 260 34 Q420 58 560 30 Q720 6 860 32 Q940 44 1000 30 L1000 120 L0 120 Z" fill={`url(#${id("s")})`} />
      <path d="M0 62 Q160 44 320 64 Q480 84 640 60 Q820 40 1000 60" stroke="#fff" strokeOpacity="0.25" strokeWidth="4" fill="none" />
      {[80, 210, 330, 470, 610, 700, 820, 930].map((x, i) => (
        <circle key={i} cx={x} cy={70 + (i % 3) * 14} r={2.5 + (i % 2)} fill={dots} opacity="0.45" />
      ))}
    </svg>
  );
}

export function FarReef({ color = "rgba(30,64,175,.35)", className, style }: Base & { color?: string }) {
  return (
    <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className={className} style={style} aria-hidden>
      <path
        d="M0 300 L0 190 Q40 150 70 180 L80 120 Q90 100 100 125 L110 170 Q160 120 210 170 Q240 110 270 150 L280 90 Q292 70 302 95 L310 150 Q360 130 400 180 Q450 120 500 160 L515 110 Q528 88 540 112 L550 165 Q610 130 660 170 Q700 120 740 155 L752 100 Q764 80 776 104 L786 160 Q840 130 880 170 Q930 140 1000 180 L1000 300 Z"
        fill={color}
      />
    </svg>
  );
}
