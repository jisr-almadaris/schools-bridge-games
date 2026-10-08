import React from "react";

/* ============================================================
   Color palette for items
   ============================================================ */
export type ColorName =
  | "red" | "blue" | "yellow" | "green" | "purple" | "pink" | "orange" | "teal" | "brown";

const PALETTE: Record<ColorName, { main: string; dark: string; light: string }> = {
  red: { main: "#ef4444", dark: "#b91c1c", light: "#fca5a5" },
  blue: { main: "#3b82f6", dark: "#1e40af", light: "#93c5fd" },
  yellow: { main: "#facc15", dark: "#a16207", light: "#fef08a" },
  green: { main: "#22c55e", dark: "#15803d", light: "#86efac" },
  purple: { main: "#a855f7", dark: "#6b21a8", light: "#d8b4fe" },
  pink: { main: "#ec4899", dark: "#9d174d", light: "#f9a8d4" },
  orange: { main: "#f97316", dark: "#9a3412", light: "#fdba74" },
  teal: { main: "#14b8a6", dark: "#0f766e", light: "#5eead4" },
  brown: { main: "#a16207", dark: "#713f12", light: "#d6a955" },
};

export type ItemType = "house" | "car" | "tree" | "flower" | "pencil" | "bag" | "book";

/* Native viewBox dimensions for each item drawing */
const DIMS: Record<ItemType, { w: number; h: number }> = {
  house: { w: 110, h: 100 },
  car: { w: 150, h: 72 },
  tree: { w: 96, h: 130 },
  flower: { w: 72, h: 130 },
  pencil: { w: 26, h: 130 },
  bag: { w: 96, h: 112 },
  book: { w: 84, h: 110 },
};

/* ============================================================
   Item drawings (each drawn in its native viewBox, origin 0,0)
   ============================================================ */
function drawHouse(c: (typeof PALETTE)["red"]) {
  return (
    <g>
      {/* chimney */}
      <rect x="82" y="8" width="12" height="26" rx="2" fill={c.dark} />
      {/* roof */}
      <path d="M55 0 L110 42 L0 42 Z" fill={c.dark} />
      <path d="M55 8 L100 42 L10 42 Z" fill={c.main} opacity="0.35" />
      {/* body */}
      <rect x="8" y="42" width="94" height="58" rx="3" fill={c.main} />
      <rect x="8" y="42" width="94" height="8" fill="#000" opacity="0.12" />
      {/* door */}
      <rect x="45" y="62" width="22" height="38" rx="10" fill={c.dark} />
      <circle cx="61" cy="84" r="2.4" fill="#fde68a" />
      {/* windows */}
      <rect x="17" y="56" width="20" height="18" rx="3" fill="#bae6fd" stroke="#fff" strokeWidth="2.5" />
      <line x1="27" y1="56" x2="27" y2="74" stroke="#fff" strokeWidth="2" />
      <rect x="74" y="56" width="20" height="18" rx="3" fill="#bae6fd" stroke="#fff" strokeWidth="2.5" />
      <line x1="84" y1="56" x2="84" y2="74" stroke="#fff" strokeWidth="2" />
    </g>
  );
}

function drawCar(c: (typeof PALETTE)["red"]) {
  return (
    <g>
      {/* cabin */}
      <path d="M35 28 Q42 4 75 4 Q108 4 116 28 Z" fill={c.main} />
      <path d="M44 26 Q50 10 73 10 L73 26 Z" fill="#bae6fd" stroke="#fff" strokeWidth="2" />
      <path d="M79 26 L79 10 Q100 10 108 26 Z" fill="#bae6fd" stroke="#fff" strokeWidth="2" />
      {/* body */}
      <rect x="2" y="26" width="146" height="26" rx="12" fill={c.main} />
      <rect x="2" y="40" width="146" height="12" rx="6" fill={c.dark} opacity="0.5" />
      {/* lights */}
      <circle cx="10" cy="35" r="4.5" fill="#fde68a" />
      <circle cx="140" cy="35" r="4.5" fill="#fecaca" />
      {/* wheels */}
      <circle cx="38" cy="54" r="15" fill="#1f2937" />
      <circle cx="38" cy="54" r="7" fill="#9ca3af" />
      <circle cx="38" cy="54" r="2.6" fill="#374151" />
      <circle cx="112" cy="54" r="15" fill="#1f2937" />
      <circle cx="112" cy="54" r="7" fill="#9ca3af" />
      <circle cx="112" cy="54" r="2.6" fill="#374151" />
    </g>
  );
}

function drawTree(c: (typeof PALETTE)["red"]) {
  return (
    <g>
      {/* trunk */}
      <path d="M43 128 L45 74 L51 74 L53 128 Z" fill="#92400e" />
      <path d="M47 92 L34 78 L37 75 L48 86 Z" fill="#92400e" />
      {/* foliage layers */}
      <circle cx="48" cy="34" r="30" fill={c.main} />
      <circle cx="26" cy="52" r="22" fill={c.main} />
      <circle cx="70" cy="52" r="22" fill={c.main} />
      <circle cx="48" cy="58" r="24" fill={c.main} />
      <circle cx="38" cy="30" r="12" fill={c.light} opacity="0.55" />
      <circle cx="64" cy="44" r="8" fill={c.dark} opacity="0.3" />
      <circle cx="30" cy="60" r="7" fill={c.dark} opacity="0.3" />
    </g>
  );
}

function drawFlower(c: (typeof PALETTE)["red"]) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <g>
      {/* stem */}
      <path d="M34 128 Q38 90 36 52" stroke="#16a34a" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* leaves */}
      <path d="M36 96 Q12 88 10 70 Q34 72 38 90 Z" fill="#22c55e" />
      <path d="M37 110 Q60 104 64 86 Q40 86 36 104 Z" fill="#16a34a" />
      {/* petals */}
      <g transform="translate(36 34)">
        {petals.map((a) => (
          <ellipse key={a} cx="0" cy="-19" rx="11" ry="19" fill={c.main} stroke={c.dark} strokeWidth="1.5" transform={`rotate(${a})`} />
        ))}
        <circle cx="0" cy="0" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <circle cx="-3.5" cy="-3.5" r="3" fill="#fde68a" />
      </g>
    </g>
  );
}

function drawPencil(c: (typeof PALETTE)["red"]) {
  return (
    <g>
      {/* eraser */}
      <rect x="4" y="0" width="18" height="12" rx="4" fill="#f9a8d4" />
      <rect x="4" y="10" width="18" height="7" fill="#94a3b8" />
      {/* body */}
      <rect x="4" y="17" width="18" height="86" fill={c.main} />
      <rect x="10" y="17" width="6" height="86" fill={c.light} opacity="0.8" />
      {/* wood + tip */}
      <path d="M4 103 L22 103 L13 130 Z" fill="#fcd9a0" />
      <path d="M9.5 117 L16.5 117 L13 130 Z" fill="#334155" />
    </g>
  );
}

function drawBag(c: (typeof PALETTE)["red"]) {
  return (
    <g>
      {/* handle */}
      <path d="M32 14 Q48 -8 64 14" stroke={c.dark} strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="4" y="14" width="88" height="94" rx="20" fill={c.main} />
      <rect x="4" y="14" width="88" height="20" rx="10" fill={c.dark} opacity="0.4" />
      {/* front pocket */}
      <rect x="20" y="54" width="56" height="44" rx="14" fill={c.light} />
      <rect x="20" y="54" width="56" height="12" rx="6" fill={c.dark} opacity="0.35" />
      <circle cx="48" cy="74" r="5" fill={c.dark} />
      {/* zipper line */}
      <line x1="14" y1="44" x2="82" y2="44" stroke="#fff" strokeWidth="3" strokeDasharray="5 4" opacity="0.8" />
    </g>
  );
}

function drawBook(c: (typeof PALETTE)["red"]) {
  return (
    <g>
      {/* pages */}
      <rect x="12" y="4" width="68" height="102" rx="4" fill="#fef9c3" />
      {/* cover */}
      <rect x="4" y="0" width="70" height="104" rx="5" fill={c.main} />
      <rect x="4" y="0" width="14" height="104" rx="5" fill={c.dark} />
      {/* decoration */}
      <rect x="26" y="16" width="40" height="26" rx="5" fill="#fff" opacity="0.85" />
      <line x1="28" y1="56" x2="66" y2="56" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <line x1="28" y1="68" x2="60" y2="68" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <line x1="28" y1="80" x2="64" y2="80" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <path d="M30 20 l4 8 -8 0 z" fill={c.main} transform="translate(14 8)" />
      <circle cx="46" cy="29" r="7" fill={c.light} />
    </g>
  );
}

const DRAW: Record<ItemType, (c: (typeof PALETTE)["red"]) => React.ReactNode> = {
  house: drawHouse,
  car: drawCar,
  tree: drawTree,
  flower: drawFlower,
  pencil: drawPencil,
  bag: drawBag,
  book: drawBook,
};

/* ============================================================
   Scene: renders a group of items bottom-aligned, sized by `h`
   ============================================================ */
export interface SceneItem {
  type: ItemType;
  color: ColorName;
  /** display height inside the scene (max ~170) */
  h: number;
  label?: string;
}

export function Scene({ items, className }: { items: SceneItem[]; className?: string }) {
  const GAP = 34;
  const BASE_Y = 190;
  const LABEL_Y = 222;
  const scaled = items.map((it) => {
    const d = DIMS[it.type];
    const s = it.h / d.h;
    return { ...it, sw: d.w * s, sh: it.h, s };
  });
  const totalW = scaled.reduce((a, b) => a + b.sw, 0) + GAP * (items.length - 1);
  const VBW = Math.max(totalW + 40, 320);
  let x = (VBW - totalW) / 2;
  const placed = scaled.map((it) => {
    const px = x;
    x += it.sw + GAP;
    return { ...it, x: px };
  });

  return (
    <svg viewBox={`0 0 ${VBW} 240`} className={className} role="img">
      {/* ground line */}
      <rect x="0" y={BASE_Y + 2} width={VBW} height="5" rx="2.5" fill="#0f766e" opacity="0.25" />
      {placed.map((it, i) => (
        <g key={i}>
          <ellipse cx={it.x + it.sw / 2} cy={BASE_Y + 5} rx={it.sw / 2 + 6} ry="7" fill="#134e4a" opacity="0.18" />
          <g transform={`translate(${it.x} ${BASE_Y - it.sh}) scale(${it.s})`}>
            {DRAW[it.type](PALETTE[it.color])}
          </g>
          <text
            x={it.x + it.sw / 2}
            y={LABEL_Y}
            textAnchor="middle"
            fontSize="20"
            fontWeight="800"
            fill={PALETTE[it.color].dark}
            fontFamily="'Baloo Bhaijaan 2', Cairo, sans-serif"
            direction="ltr"
          >
            {it.label ?? it.color}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
   Ship
   ============================================================ */
export function Ship({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 190" className={className} role="img" aria-label="سفينة">
      {/* masts */}
      <rect x="104" y="10" width="6" height="110" rx="3" fill="#78350f" />
      <rect x="52" y="42" width="5" height="80" rx="2.5" fill="#78350f" />
      {/* sails */}
      <path d="M110 14 Q178 44 112 96 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" />
      <path d="M104 24 Q48 50 102 92 Z" fill="#a78bfa" stroke="#7c3aed" strokeWidth="3" />
      <path d="M56 46 Q22 68 54 104 Z" fill="#5eead4" stroke="#0d9488" strokeWidth="3" />
      {/* flag */}
      <path d="M110 10 L142 18 L110 26 Z" fill="#f43f5e" />
      {/* hull */}
      <path d="M18 122 L202 122 L178 162 Q110 174 42 162 Z" fill="#92400e" />
      <path d="M18 122 L202 122 L196 134 L26 134 Z" fill="#b45309" />
      <circle cx="70" cy="145" r="6" fill="#fde68a" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="110" cy="147" r="6" fill="#fde68a" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="150" cy="145" r="6" fill="#fde68a" stroke="#78350f" strokeWidth="2.5" />
      {/* waves */}
      <path d="M2 168 Q22 158 42 168 T82 168 T122 168 T162 168 T202 168 T220 166" stroke="#22d3ee" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M12 182 Q32 172 52 182 T92 182 T132 182 T172 182 T212 182" stroke="#67e8f9" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ============================================================
   Map island graphic
   ============================================================ */
export function IslandGraphic({ tint, className }: { tint: string; className?: string }) {
  return (
    <svg viewBox="0 0 140 100" className={className}>
      {/* sand */}
      <ellipse cx="70" cy="78" rx="64" ry="22" fill="#fde68a" />
      <ellipse cx="70" cy="74" rx="56" ry="18" fill="#fcd34d" />
      {/* grass mound */}
      <ellipse cx="70" cy="66" rx="40" ry="14" fill={tint} />
      {/* palm */}
      <path d="M66 66 Q64 40 72 24" stroke="#92400e" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M72 24 Q88 16 100 26 Q84 28 74 28 Z" fill="#16a34a" />
      <path d="M72 24 Q56 14 44 24 Q60 27 70 28 Z" fill="#22c55e" />
      <path d="M72 24 Q78 8 92 8 Q82 20 74 26 Z" fill="#15803d" />
      <path d="M72 24 Q64 8 52 6 Q60 18 70 26 Z" fill="#22c55e" />
      <circle cx="70" cy="30" r="4.5" fill="#a16207" />
      <circle cx="78" cy="32" r="4.5" fill="#a16207" />
    </svg>
  );
}

/* ============================================================
   Star icon
   ============================================================ */
export function StarIcon({ className, filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M12 1.8 L15 8.2 L22.2 9.2 L17 14.1 L18.3 21.3 L12 17.8 L5.7 21.3 L7 14.1 L1.8 9.2 L9 8.2 Z"
        fill={filled ? "url(#goldStar)" : "#cbd5e1"}
        stroke={filled ? "#b45309" : "#94a3b8"}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="goldStar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}
