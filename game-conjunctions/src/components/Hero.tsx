import type { CSSProperties } from "react";

export type Pose = "idle" | "walk" | "look" | "surprise" | "happy" | "reach" | "hold";
export type Prop = "card" | "key" | "rune" | "keys" | null;

interface Props {
  pose?: Pose;
  facing?: 1 | -1;
  holding?: Prop;
  x?: number;        // % from left
  bottom?: string;   // css bottom
  size?: string;     // css height
  className?: string;
  style?: CSSProperties;
  hidden?: boolean;
}

const vb = (x: number, y: number): CSSProperties => ({ transformBox: "view-box", transformOrigin: `${x}px ${y}px` });

export default function Hero({ pose = "idle", facing = 1, holding = null, x = 50, bottom = "8%", size = "clamp(150px, 34vh, 330px)", className = "", style, hidden }: Props) {
  const mouth =
    pose === "surprise" ? <ellipse cx="60" cy="80" rx="4" ry="5" fill="#7a2244" /> :
    pose === "happy" ? <path d="M50 76 Q60 90 70 76 Z" fill="#7a2244" stroke="#7a2244" strokeWidth="1.5" strokeLinejoin="round" /> :
    pose === "look" ? <path d="M55 79 Q60 81 65 78" stroke="#7a2244" strokeWidth="2.4" fill="none" strokeLinecap="round" /> :
    <path d="M52 77 Q60 85 68 77" stroke="#7a2244" strokeWidth="2.6" fill="none" strokeLinecap="round" />;
  const browY = pose === "surprise" ? 47 : 51;

  return (
    <div
      className={`char-wrap absolute pointer-events-none ${className}`}
      style={{ left: `${x}%`, bottom, height: size, aspectRatio: "120 / 220", transform: `translateX(-50%)`, opacity: hidden ? 0 : 1, zIndex: 20, ...style }}
    >
      <div style={{ width: "100%", height: "100%", transform: `scaleX(${facing})`, transition: "transform .3s" }}>
        <svg viewBox="0 0 120 220" className={`char ${pose} w-full h-full overflow-visible`} style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,.45))" }}>
          <defs>
            <linearGradient id="dress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b9a3ff" />
              <stop offset="1" stopColor="#7c5cd6" />
            </linearGradient>
            <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a2a1f" />
              <stop offset="1" stopColor="#2a1512" />
            </linearGradient>
            <radialGradient id="skin" cx=".45" cy=".4" r=".7">
              <stop offset="0" stopColor="#ffe3cc" />
              <stop offset="1" stopColor="#f3bf9a" />
            </radialGradient>
            <radialGradient id="glowOrb">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".4" stopColor="#3ee8d8" />
              <stop offset="1" stopColor="#3ee8d8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="60" cy="214" rx="30" ry="5" fill="rgba(0,0,0,.35)" />
          <g className="char-body">
            {/* back hair */}
            <path d="M24 60 Q22 120 34 138 L86 138 Q98 120 96 60 Z" fill="url(#hair)" />
            {/* legs */}
            <g className="leg-a" style={vb(52, 150)}>
              <rect x="47" y="150" width="10" height="44" rx="4" fill="#fff4ea" />
              <path d="M44 192 h16 v8 q0 5 -5 5 h-13 q-4 0 -3 -5 z" fill="#6e1a3d" />
            </g>
            <g className="leg-b" style={vb(68, 150)}>
              <rect x="63" y="150" width="10" height="44" rx="4" fill="#fff4ea" />
              <path d="M60 192 h16 v8 q0 5 -5 5 h-10 q-4 0 -4 -5 z" fill="#6e1a3d" />
            </g>
            {/* arm left */}
            <g className="arm-a" style={vb(38, 106)}>
              <path d="M33 104 q5 -4 10 0 l-1 40 q-4 3 -8 0 z" fill="#8e70e6" />
              <circle cx="38" cy="148" r="6" fill="url(#skin)" />
            </g>
            {/* dress */}
            <path d="M40 100 Q60 92 80 100 L96 162 Q60 172 24 162 Z" fill="url(#dress)" />
            <path d="M24 162 Q60 172 96 162" stroke="#f2c95c" strokeWidth="3" fill="none" />
            <path d="M28 150 Q60 158 92 150" stroke="#3ee8d8" strokeWidth="1.5" fill="none" opacity=".7" strokeDasharray="3 4" />
            {/* collar / cape */}
            <path d="M38 100 Q60 116 82 100 Q76 94 60 94 Q44 94 38 100 Z" fill="#6e1a3d" />
            <circle cx="60" cy="112" r="3.2" fill="#f2c95c" />
            <circle cx="60" cy="124" r="2.6" fill="#f2c95c" />
            <path d="M44 132 l2 4 l4 1 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -1 z" fill="#f2c95c" opacity=".9" />
            {/* arm right (holding) */}
            <g className="arm-b" style={vb(82, 106)}>
              <path d="M77 104 q5 -4 10 0 l-1 40 q-4 3 -8 0 z" fill="#8e70e6" />
              <circle cx="82" cy="148" r="6" fill="url(#skin)" />
              {holding === "card" && (
                <g transform="translate(74 146) rotate(-8)">
                  <rect width="22" height="15" rx="2" fill="#f2c95c" stroke="#fff3c4" />
                  <text x="11" y="10" fontSize="7" textAnchor="middle" fill="#3b1f6e">✨</text>
                </g>
              )}
              {holding === "key" && (
                <g transform="translate(80 144)" className="anim-glow">
                  <circle cx="4" cy="4" r="5" fill="none" stroke="#f2c95c" strokeWidth="2.5" />
                  <rect x="8" y="3" width="14" height="2.6" fill="#f2c95c" />
                  <rect x="18" y="5" width="2.4" height="4" fill="#f2c95c" />
                </g>
              )}
              {holding === "rune" && <circle cx="84" cy="140" r="10" fill="url(#glowOrb)" className="anim-glow" />}
              {holding === "keys" && (
                <g transform="translate(76 136)" className="anim-glow">
                  {["#3ee8d8", "#ffd35c", "#ff9fd0", "#9fb8ff"].map((c, i) => (
                    <g key={c} transform={`rotate(${-30 + i * 20} 6 10)`}>
                      <circle cx="6" cy="4" r="3.5" fill="none" stroke={c} strokeWidth="2" />
                      <rect x="5" y="7" width="2" height="12" fill={c} />
                    </g>
                  ))}
                </g>
              )}
            </g>
            {/* head */}
            <g className="head">
              <rect x="54" y="88" width="12" height="10" fill="#f3bf9a" />
              <circle cx="60" cy="62" r="31" fill="url(#skin)" />
              {/* bangs */}
              <path d="M28 62 Q26 26 60 26 Q94 26 92 62 Q86 44 72 40 Q66 50 52 46 Q40 44 34 52 Q30 56 28 62 Z" fill="url(#hair)" />
              <path d="M30 60 Q26 84 30 98" stroke="#2a1512" strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d="M90 60 Q94 84 90 98" stroke="#2a1512" strokeWidth="7" fill="none" strokeLinecap="round" />
              {/* bow */}
              <g transform="translate(80 30)">
                <path d="M0 0 L-12 -9 L-12 9 Z" fill="#6e1a3d" />
                <path d="M0 0 L12 -9 L12 9 Z" fill="#6e1a3d" />
                <circle r="4" fill="#f2c95c" />
              </g>
              {/* eyebrows */}
              <path d={`M42 ${browY} q6 -3 12 0`} stroke="#3a1d16" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d={`M66 ${browY} q6 -3 12 0`} stroke="#3a1d16" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              {/* eyes */}
              <g className="eyes">
                {pose === "happy" ? (
                  <>
                    <path d="M42 64 q6 -8 12 0" stroke="#2a1540" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <path d="M66 64 q6 -8 12 0" stroke="#2a1540" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <ellipse cx="48" cy="63" rx="7" ry={pose === "surprise" ? 9 : 8} fill="#fff" />
                    <ellipse cx="72" cy="63" rx="7" ry={pose === "surprise" ? 9 : 8} fill="#fff" />
                    <g className="pupils">
                      <circle cx="49" cy="64" r="4.6" fill="#3b1f6e" />
                      <circle cx="73" cy="64" r="4.6" fill="#3b1f6e" />
                      <circle cx="50.5" cy="62" r="1.6" fill="#fff" />
                      <circle cx="74.5" cy="62" r="1.6" fill="#fff" />
                    </g>
                  </>
                )}
              </g>
              <ellipse cx="40" cy="75" rx="5" ry="3" fill="#ff9fb0" opacity=".6" />
              <ellipse cx="80" cy="75" rx="5" ry="3" fill="#ff9fb0" opacity=".6" />
              {mouth}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
