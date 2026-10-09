import type { CSSProperties, ReactNode } from "react";
import { useSvgIds } from "../game/utils";

export type Pose = "stand" | "wave" | "dive" | "swim" | "float" | "cheer" | "read" | "play";
export type Mood = "happy" | "smile" | "wow" | "think" | "joy";

interface Props {
  pose?: Pose;
  mood?: Mood;
  className?: string;
  style?: CSSProperties;
  bob?: boolean;
  bubbles?: boolean;
}

type ArmCfg = { t?: string; a?: string };

const CFG: Record<Pose, { l: ArmCfg; r: ArmCfg; kick: "none" | "slow" | "fast" }> = {
  stand: { l: { t: "rotate(12deg)" }, r: { t: "rotate(-12deg)" }, kick: "none" },
  wave: { l: { t: "rotate(12deg)" }, r: { a: "k-wave-r 0.8s ease-in-out infinite" }, kick: "none" },
  dive: { l: { t: "rotate(168deg)" }, r: { t: "rotate(-168deg)" }, kick: "fast" },
  swim: { l: { t: "rotate(168deg)" }, r: { t: "rotate(-168deg)" }, kick: "fast" },
  float: {
    l: { a: "k-paddle-l 1.6s ease-in-out infinite alternate" },
    r: { a: "k-paddle-r 1.6s ease-in-out infinite alternate" },
    kick: "slow",
  },
  cheer: {
    l: { a: "k-cheer-l 0.45s ease-in-out infinite alternate" },
    r: { a: "k-cheer-r 0.45s ease-in-out infinite alternate" },
    kick: "slow",
  },
  read: { l: { t: "rotate(-6deg)" }, r: { t: "rotate(6deg)" }, kick: "slow" },
  play: { l: { t: "rotate(26deg)" }, r: { a: "k-tap-r 0.6s ease-in-out infinite alternate" }, kick: "slow" },
};

function star(cx: number, cy: number, R: number, r: number) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? R : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    d += `${i === 0 ? "M" : "L"}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)} `;
  }
  return d + "Z";
}

export default function Diver({ pose = "float", mood = "happy", className, style, bob = false, bubbles = false }: Props) {
  const id = useSvgIds();
  const u = (n: string) => `url(#${id(n)})`;
  const cfg = CFG[pose];
  const kickDur = cfg.kick === "fast" ? "0.32s" : "1.1s";
  const legL: CSSProperties = {
    transformOrigin: "96px 206px",
    animation: cfg.kick === "none" ? undefined : `k-kick-l ${kickDur} ease-in-out infinite alternate`,
  };
  const legR: CSSProperties = {
    transformOrigin: "124px 206px",
    animation: cfg.kick === "none" ? undefined : `k-kick-r ${kickDur} ease-in-out infinite alternate`,
  };
  const armL: CSSProperties = { transformOrigin: "82px 144px", transform: cfg.l.t, animation: cfg.l.a };
  const armR: CSSProperties = { transformOrigin: "138px 144px", transform: cfg.r.t, animation: cfg.r.a };
  const swim = pose === "swim";
  const eyesClosed = mood === "joy";

  const browL = mood === "wow" || mood === "think" ? "M83 57 Q92 50 101 55" : "M84 62 Q93 57 101 61";
  const browR =
    mood === "wow" ? "M119 55 Q128 50 137 57" : mood === "think" ? "M119 62 Q128 60 136 63" : "M119 61 Q127 57 136 62";

  const mouths: Record<Mood, ReactNode> = {
    happy: (
      <>
        <path d="M98 109 Q110 125 122 109 Z" fill="#9d174d" />
        <ellipse cx="110" cy="117.5" rx="6" ry="3.2" fill="#fb7185" />
      </>
    ),
    joy: (
      <>
        <path d="M96 108 Q110 129 124 108 Z" fill="#9d174d" />
        <ellipse cx="110" cy="119.5" rx="7" ry="3.6" fill="#fb7185" />
      </>
    ),
    smile: <path d="M100 111 Q110 119 120 111" stroke="#9d174d" strokeWidth="3" fill="none" strokeLinecap="round" />,
    wow: (
      <>
        <ellipse cx="110" cy="115" rx="6" ry="7.5" fill="#9d174d" />
        <ellipse cx="110" cy="119" rx="3.5" ry="2" fill="#fb7185" />
      </>
    ),
    think: <path d="M102 115 Q108 111 118 113" stroke="#9d174d" strokeWidth="3" fill="none" strokeLinecap="round" />,
  };

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <div className={bob ? "anim-bob-soft" : undefined}>
        <div
          style={{
            transform: swim ? "rotate(-78deg)" : "none",
            transition: "transform .6s cubic-bezier(.3,1.2,.5,1)",
          }}
        >
          <svg viewBox="0 0 220 320" width="100%" style={{ display: "block", overflow: "visible" }} aria-hidden>
            <defs>
              <linearGradient id={id("suit")} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5eead4" />
                <stop offset="0.45" stopColor="#14b8a6" />
                <stop offset="1" stopColor="#0e7490" />
              </linearGradient>
              <linearGradient id={id("suitV")} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5eead4" />
                <stop offset="1" stopColor="#0891b2" />
              </linearGradient>
              <radialGradient id={id("hood")} cx="0.35" cy="0.28" r="0.85">
                <stop offset="0" stopColor="#ffc2da" />
                <stop offset="0.5" stopColor="#f472b6" />
                <stop offset="1" stopColor="#be2a7c" />
              </radialGradient>
              <radialGradient id={id("skin")} cx="0.45" cy="0.38" r="0.75">
                <stop offset="0" stopColor="#ffeadb" />
                <stop offset="1" stopColor="#f5bf9c" />
              </radialGradient>
              <linearGradient id={id("tank")} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fef08a" />
                <stop offset="0.45" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#c2710c" />
              </linearGradient>
              <linearGradient id={id("fin")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#d8b4fe" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id={id("lens")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e0f7ff" stopOpacity="0.5" />
                <stop offset="1" stopColor="#67e8f9" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id={id("panel")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c4b5fd" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* oxygen tank (behind) */}
            <g>
              <rect x="131" y="112" width="36" height="96" rx="17" fill={u("tank")} stroke="#b45309" strokeWidth="2" />
              <rect x="138" y="121" width="7" height="76" rx="3.5" fill="#fff" opacity="0.5" />
              <rect x="131" y="150" width="36" height="9" fill="#7c3aed" />
              <rect x="142" y="100" width="14" height="14" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
              <circle cx="149" cy="97" r="6.5" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
            </g>

            {/* legs + fins */}
            <g className="dv-g" style={legL}>
              <rect x="85" y="196" width="22" height="62" rx="10" fill={u("suitV")} stroke="#0e7490" strokeWidth="1.5" />
              <rect x="85" y="232" width="22" height="7" fill="#f472b6" />
              <path
                d="M84 250 Q96 244 108 250 L112 298 Q106 306 99 300 Q91 308 83 300 Q76 305 70 296 Z"
                fill={u("fin")}
                stroke="#5b21b6"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M84 250 Q96 244 108 250 L109 262 Q96 257 83 262 Z" fill="#4c1d95" opacity="0.45" />
              <path d="M91 266 L84 296 M101 266 L103 297" stroke="#f5f3ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </g>
            <g className="dv-g" style={legR}>
              <rect x="113" y="196" width="22" height="62" rx="10" fill={u("suitV")} stroke="#0e7490" strokeWidth="1.5" />
              <rect x="113" y="232" width="22" height="7" fill="#f472b6" />
              <path
                d="M112 250 Q124 244 136 250 L150 296 Q144 305 137 300 Q129 308 121 300 Q114 306 108 298 Z"
                fill={u("fin")}
                stroke="#5b21b6"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M112 250 Q124 244 136 250 L137 262 Q124 257 111 262 Z" fill="#4c1d95" opacity="0.45" />
              <path d="M119 266 L117 297 M129 266 L136 296" stroke="#f5f3ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            </g>

            {/* torso — modest full wetsuit */}
            <path
              d="M76 140 Q110 126 144 140 L147 196 Q147 214 128 214 L92 214 Q73 214 73 196 Z"
              fill={u("suit")}
              stroke="#0e7490"
              strokeWidth="2"
            />
            <path d="M93 138 Q110 147 127 138 L123 178 Q110 186 97 178 Z" fill={u("panel")} />
            <path d={star(110, 161, 9, 4)} fill="#fde047" stroke="#f59e0b" strokeWidth="1" strokeLinejoin="round" />
            <path d="M86 139 L94 190 M134 139 L126 190" stroke="#6d28d9" strokeWidth="6" strokeLinecap="round" />
            <rect x="74" y="188" width="72" height="10" rx="5" fill="#6d28d9" />
            <rect x="103" y="185.5" width="14" height="15" rx="3.5" fill="#fcd34d" stroke="#b45309" strokeWidth="1.5" />
            <path d="M80 148 Q78 172 80 192" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.3" fill="none" />

            {/* arms */}
            <g className="dv-g" style={armL}>
              <rect x="72" y="136" width="20" height="58" rx="10" fill={u("suitV")} stroke="#0e7490" strokeWidth="1.5" />
              <rect x="72" y="184" width="20" height="7" rx="3.5" fill="#f472b6" />
              <circle cx="82" cy="199" r="10" fill={u("skin")} stroke="#e8a080" strokeWidth="1.2" />
            </g>
            <g className="dv-g" style={armR}>
              <rect x="128" y="136" width="20" height="58" rx="10" fill={u("suitV")} stroke="#0e7490" strokeWidth="1.5" />
              <rect x="128" y="184" width="20" height="7" rx="3.5" fill="#f472b6" />
              <circle cx="138" cy="199" r="10" fill={u("skin")} stroke="#e8a080" strokeWidth="1.2" />
            </g>

            {/* book (reading) */}
            {pose === "read" && (
              <g>
                <path
                  d="M110 170 Q93 159 74 162 L74 203 Q93 199 110 208 Q127 199 146 203 L146 162 Q127 159 110 170 Z"
                  fill="#7c3aed"
                  stroke="#4c1d95"
                  strokeWidth="2"
                />
                <path d="M110 170 Q95 162 79 164 L79 199 Q95 196 110 204 Z" fill="#fffaf0" />
                <path d="M110 170 Q125 162 141 164 L141 199 Q125 196 110 204 Z" fill="#fff7ed" />
                <g stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round">
                  <path d="M85 172 L104 176 M85 180 L104 184 M85 188 L100 191" />
                  <path d="M116 176 L135 172 M116 184 L135 180 M116 191 L131 188" />
                </g>
                <g className="dv-g" style={{ transformOrigin: "110px 186px", animation: "k-page 2.4s ease-in-out infinite" }}>
                  <path d="M110 170 Q123 163 137 165 L137 198 Q123 196 110 204 Z" fill="#fde7f3" stroke="#f9a8d4" strokeWidth="1" />
                </g>
                <circle cx="86" cy="199" r="9.5" fill={u("skin")} stroke="#e8a080" strokeWidth="1.2" />
                <circle cx="134" cy="199" r="9.5" fill={u("skin")} stroke="#e8a080" strokeWidth="1.2" />
              </g>
            )}

            {/* beach ball (playing) */}
            {pose === "play" && (
              <g className="dv-g" style={{ animation: "k-ball-bounce 1.2s ease-in-out infinite" }}>
                <circle cx="190" cy="108" r="17" fill="#fff" stroke="#1e3a8a" strokeWidth="1.5" />
                <path d="M190 91 A17 17 0 0 1 207 108 L190 108 Z" fill="#ef4444" />
                <path d="M190 125 A17 17 0 0 1 173 108 L190 108 Z" fill="#3b82f6" />
                <path d="M207 108 A17 17 0 0 1 190 125 L190 108 Z" fill="#facc15" />
                <circle cx="190" cy="108" r="4" fill="#fff" />
                <ellipse cx="183" cy="99" rx="5" ry="3" fill="#fff" opacity="0.7" />
              </g>
            )}

            {/* hood (modest swim hood covering hair & neck) */}
            <path d="M70 96 Q62 140 90 146 L130 146 Q158 140 150 96 Z" fill={u("hood")} />
            <circle cx="110" cy="80" r="58" fill={u("hood")} />
            <ellipse cx="84" cy="42" rx="20" ry="10" fill="#fff" opacity="0.32" transform="rotate(-28 84 42)" />
            <path
              d={star(152, 38, 11, 5)}
              fill="#fde047"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinejoin="round"
              transform="rotate(14 152 38)"
            />
            <circle cx="152" cy="38" r="2" fill="#f59e0b" />

            {/* face */}
            <ellipse cx="110" cy="90" rx="41" ry="42" fill={u("skin")} />
            <ellipse cx="110" cy="90" rx="43" ry="44" fill="none" stroke="#5eead4" strokeWidth="5" />
            <rect x="49" y="77" width="16" height="12" rx="4" fill="#0f766e" />
            <rect x="155" y="77" width="16" height="12" rx="4" fill="#0f766e" />

            <path d={browL} stroke="#8a5236" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d={browR} stroke="#8a5236" strokeWidth="2.8" fill="none" strokeLinecap="round" />

            {eyesClosed ? (
              <g stroke="#2e1a47" strokeWidth="3.6" fill="none" strokeLinecap="round">
                <path d="M85 88 Q93 78 101 88" />
                <path d="M119 88 Q127 78 135 88" />
              </g>
            ) : (
              <>
                <g className="dv-blink">
                  <ellipse cx="93" cy="85" rx="8.5" ry={mood === "wow" ? 11.5 : 10.5} fill="#2e1a47" />
                  <circle cx="96.3" cy="80.5" r="3.5" fill="#fff" />
                  <circle cx="90.4" cy="89.5" r="1.7" fill="#fff" />
                </g>
                <g className="dv-blink">
                  <ellipse cx="127" cy="85" rx="8.5" ry={mood === "wow" ? 11.5 : 10.5} fill="#2e1a47" />
                  <circle cx="130.3" cy="80.5" r="3.5" fill="#fff" />
                  <circle cx="124.4" cy="89.5" r="1.7" fill="#fff" />
                </g>
                <g stroke="#2e1a47" strokeWidth="2" strokeLinecap="round">
                  <path d="M85.5 79 L80.5 75.5 M85 83.5 L79.5 82" />
                  <path d="M134.5 79 L139.5 75.5 M135 83.5 L140.5 82" />
                </g>
              </>
            )}

            <ellipse cx="79" cy="106" rx="8" ry="5" fill="#ff8fab" opacity="0.65" />
            <ellipse cx="141" cy="106" rx="8" ry="5" fill="#ff8fab" opacity="0.65" />
            <path d="M107 100 Q110 103 113 100" stroke="#dc8f74" strokeWidth="2" fill="none" strokeLinecap="round" />
            {mouths[mood]}

            {/* diving goggles */}
            <path
              d="M72 72 Q110 60 148 72 Q157 76 154 90 Q151 106 136 106 Q124 106 117 99 Q110 94 103 99 Q96 106 84 106 Q69 106 66 90 Q63 76 72 72 Z"
              fill={u("lens")}
              stroke="#fbbf24"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path d="M78 83 L88 73.5" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
            <path d="M82 89 L85 86" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
            <path d="M131 79 L138 73.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

            {/* snorkel */}
            <path d="M63 92 Q50 92 50 78 L50 24" stroke="#0e7490" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M63 92 Q50 92 50 78 L50 24" stroke="#fde047" strokeWidth="7" fill="none" strokeLinecap="round" />
            <path d="M48 76 L48 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <rect x="43" y="12" width="14" height="14" rx="5" fill="#22d3ee" stroke="#0e7490" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      {bubbles && (
        <div
          className="pointer-events-none absolute"
          style={{ left: swim ? "2%" : "18%", top: swim ? "30%" : "-2%", width: 34, height: 34 }}
        >
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="amb-bubble"
              style={{
                width: 7 + (i % 3) * 5,
                height: 7 + (i % 3) * 5,
                left: (i * 9) % 24,
                bottom: 0,
                animation: `k-rise-short ${1.5 + i * 0.35}s ease-out ${i * 0.45}s infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
