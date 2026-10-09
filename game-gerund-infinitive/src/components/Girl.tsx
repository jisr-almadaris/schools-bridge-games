import { cn } from "../utils/cn";

export type Pose = "idle" | "walk" | "wave" | "look" | "point" | "ticket" | "cheer" | "sit" | "ride" | "read" | "draw" | "clap";
export type Prop = "popcorn" | "balloon" | "ticket";

interface Props {
  pose?: Pose;
  prop?: Prop;
  size?: number | string;
  flip?: boolean;
  variant?: "girl" | "boy";
  className?: string;
}

const SKIN = "#f6c9a4";
const HAIR = "#3b2143";

export default function Girl({ pose = "idle", prop, size = 160, flip, variant = "girl", className }: Props) {
  const seated = pose === "sit" || pose === "ride" || pose === "read" || pose === "draw";
  const boy = variant === "boy";
  const jacket = boy ? "#3ee6d6" : "#b9a4ff";
  const jacketDark = boy ? "#1fb5a8" : "#8f78f0";
  const skirt = boy ? "#2b3a8f" : "#ff6fb5";
  const happy = pose === "cheer" || pose === "wave" || pose === "ride" || pose === "clap";

  return (
    <div
      className={cn("inline-block select-none pointer-events-none", pose, prop && `hold-${prop}`, className)}
      style={{ width: size, transform: flip ? "scaleX(-1)" : undefined }}
    >
      <svg viewBox="0 0 120 210" width="100%" style={{ overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id={`jk-${variant}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={jacket} />
            <stop offset="1" stopColor={jacketDark} />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="204" rx="30" ry="5" fill="rgba(0,0,0,0.3)" />
        <g className="g-all">
          <g className="g-body">
            {/* Legs */}
            {seated ? (
              <g>
                <rect x="44" y="158" width="13" height="22" rx="6" fill="#26306e" />
                <rect x="63" y="158" width="13" height="22" rx="6" fill="#26306e" />
                <ellipse cx="50" cy="182" rx="9" ry="5" fill="#fff" />
                <ellipse cx="70" cy="182" rx="9" ry="5" fill="#fff" />
              </g>
            ) : (
              <>
                <g className="limb leg-l" style={{ transformOrigin: "52px 158px" }}>
                  <rect x="46" y="156" width="12" height="38" rx="5" fill="#26306e" />
                  <path d="M42 194 q0 -7 9 -7 h7 v8 h-16z" fill="#fff" />
                  <rect x="42" y="193" width="16" height="3" rx="1.5" fill="#ff6fb5" />
                </g>
                <g className="limb leg-r" style={{ transformOrigin: "68px 158px" }}>
                  <rect x="62" y="156" width="12" height="38" rx="5" fill="#26306e" />
                  <path d="M62 194 v-8 h7 q9 0 9 7z" fill="#fff" />
                  <rect x="62" y="193" width="16" height="3" rx="1.5" fill="#ff6fb5" />
                </g>
              </>
            )}

            {/* Back arm (left) */}
            <g className="limb arm-l" style={{ transformOrigin: "35px 93px" }}>
              <rect x="29" y="88" width="12" height="46" rx="6" fill={`url(#jk-${variant})`} />
              <rect x="29" y="126" width="12" height="5" rx="2" fill="#ffcf4a" />
              <circle cx="35" cy="137" r="6" fill={SKIN} />
            </g>

            {/* Skirt / shorts */}
            {boy ? (
              <path d="M38 132 h44 l3 28 h-20 l-5 -12 l-5 12 h-20z" fill={skirt} />
            ) : (
              <path d="M36 130 L84 130 L94 166 Q60 172 26 166 Z" fill={skirt} />
            )}
            {!boy && <path d="M30 160 Q60 166 90 160" stroke="#ffd1e8" strokeWidth="2" fill="none" />}

            {/* Jacket */}
            <path d="M40 86 Q60 78 80 86 L84 138 Q60 142 36 138 Z" fill={`url(#jk-${variant})`} />
            <path d="M60 84 L60 139" stroke={jacketDark} strokeWidth="2" />
            <path d="M50 84 L60 100 L70 84" fill="#fff" opacity="0.9" />
            {/* star badge */}
            <path d="M71 106 l2.2 4.4 4.8 .7 -3.5 3.4 .8 4.8 -4.3 -2.3 -4.3 2.3 .8 -4.8 -3.5 -3.4 4.8 -.7z" fill="#ffcf4a" />
            <rect x="36" y="134" width="48" height="5" rx="2.5" fill="#ffcf4a" />

            {/* Head */}
            <g className="g-head">
              {!boy && (
                <g className="sway" style={{ animationDuration: "2.2s" }}>
                  <path d="M84 36 Q108 46 100 92 Q96 104 88 96 Q96 70 80 48 Z" fill={HAIR} />
                </g>
              )}
              <circle cx="60" cy="50" r={boy ? 30 : 32} fill={HAIR} />
              <rect x="54" y="74" width="12" height="12" rx="4" fill={SKIN} />
              <circle cx="60" cy="54" r="27" fill={SKIN} />
              {boy ? (
                <>
                  <path d="M33 48 Q36 20 62 22 Q86 22 88 46 Q76 34 60 36 Q44 36 33 48Z" fill={HAIR} />
                  <path d="M30 40 Q60 10 90 40 L92 44 Q60 30 28 44Z" fill="#ff6fb5" />
                  <rect x="56" y="18" width="8" height="5" rx="2" fill="#ffcf4a" />
                </>
              ) : (
                <>
                  <path d="M33 52 Q30 22 60 20 Q90 22 87 52 Q80 36 66 34 Q60 44 44 42 Q38 46 33 52Z" fill={HAIR} />
                  <path d="M34 36 Q60 14 86 36" stroke="#ff6fb5" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="M84 28 l2.6 5.2 5.7 .8 -4.1 4 1 5.7 -5.2 -2.7 -5.1 2.7 1 -5.7 -4.2 -4 5.7 -.8z" fill="#ffcf4a" stroke="#fff3" />
                </>
              )}
              <circle cx="33" cy="58" r="4" fill={SKIN} />
              <circle cx="87" cy="58" r="4" fill={SKIN} />
              <ellipse className="eye" cx="49" cy="56" rx="3.8" ry="4.8" fill="#2a1450" />
              <ellipse className="eye" cx="71" cy="56" rx="3.8" ry="4.8" fill="#2a1450" />
              <circle cx="50.3" cy="54.2" r="1.3" fill="#fff" />
              <circle cx="72.3" cy="54.2" r="1.3" fill="#fff" />
              <path d="M44 48 q5 -3 10 0 M66 48 q5 -3 10 0" stroke={HAIR} strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <circle cx="42" cy="65" r="4.5" fill="#ff8fc4" opacity="0.45" />
              <circle cx="78" cy="65" r="4.5" fill="#ff8fc4" opacity="0.45" />
              {happy ? (
                <path d="M51 65 Q60 77 69 65 Z" fill="#b8325f" stroke="#7a1d3f" strokeWidth="1" />
              ) : (
                <path d="M52 66 Q60 73 68 66" stroke="#b8325f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Book held in front for reading */}
            {pose === "read" && (
              <g>
                <path d="M38 110 L60 116 L82 110 L82 134 L60 140 L38 134 Z" fill="#ff6fb5" />
                <path d="M41 112 L59 117 L59 136 L41 131 Z" fill="#fff" />
                <path d="M79 112 L61 117 L61 136 L79 131 Z" fill="#fff" />
                <path d="M44 118 l12 3 M44 123 l12 3 M64 121 l12 -3 M64 126 l12 -3" stroke="#c7b8ff" strokeWidth="1.5" />
              </g>
            )}

            {/* Front arm (right) */}
            <g
              className="limb arm-r"
              style={{
                transformOrigin: "85px 93px",
                ...(pose === "read" ? { transform: "rotate(40deg)" } : pose === "draw" ? { transform: "rotate(-70deg)" } : {}),
              }}
            >
              <rect x="79" y="88" width="12" height="46" rx="6" fill={`url(#jk-${variant})`} />
              <rect x="79" y="126" width="12" height="5" rx="2" fill="#ffcf4a" />
              <circle cx="85" cy="137" r="6" fill={SKIN} />
              {(pose === "ticket" || prop === "ticket") && (
                <g>
                  <rect x="76" y="140" width="30" height="16" rx="3" fill="#ffcf4a" stroke="#fff6c9" strokeWidth="1.5" />
                  <circle cx="76" cy="148" r="3" fill="#8f78f0" />
                  <circle cx="106" cy="148" r="3" fill="#8f78f0" />
                  <text x="91" y="151.5" fontSize="7" textAnchor="middle" fill="#7a3b00" fontWeight="700">
                    ★
                  </text>
                </g>
              )}
              {pose === "draw" && (
                <g>
                  <rect x="83" y="138" width="4" height="20" rx="2" fill="#ffcf4a" />
                  <path d="M83 158 h4 l-2 6z" fill="#ff6fb5" />
                </g>
              )}
            </g>

            {/* Popcorn bucket held in front */}
            {prop === "popcorn" && (
              <g>
                <circle cx="52" cy="116" r="6" fill="#fff8dc" />
                <circle cx="60" cy="112" r="7" fill="#fff3c4" />
                <circle cx="68" cy="116" r="6" fill="#fff8dc" />
                <circle cx="56" cy="110" r="4" fill="#ffe08a" />
                <circle cx="65" cy="109" r="4" fill="#fff8dc" />
                <path d="M46 118 h28 l-4 28 h-20z" fill="#fff" />
                <path d="M51 118 l2 28 M60 118 v28 M69 118 l-2 28" stroke="#ff4d6d" strokeWidth="4" />
                <circle cx="48" cy="130" r="5" fill={SKIN} />
              </g>
            )}
            {/* Balloon held up */}
            {prop === "balloon" && (
              <g className="sway" style={{ animationDuration: "2.6s" }}>
                <path d="M100 52 Q96 20 108 -4" stroke="#fff" strokeWidth="1.5" fill="none" />
                <ellipse cx="110" cy="-26" rx="17" ry="21" fill="#ff6fb5" />
                <ellipse cx="104" cy="-34" rx="5" ry="8" fill="#fff" opacity="0.4" />
                <path d="M106 -5 h8 l-4 5z" fill="#ff6fb5" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
