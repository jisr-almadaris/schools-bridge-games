import type { KeyboardEvent } from "react";
import type { Be } from "../game/data";
import { useSvgIds } from "../game/utils";

interface Props {
  mood: "idle" | "happy" | "no";
  picked: Be | null;
  correct: Be;
  onPick: (b: Be) => void;
  shakeKey: number;
  className?: string;
}

const SIGNS: { b: Be; x: number; y: number; rot: number }[] = [
  { b: "am", x: 80, y: 62, rot: -9 },
  { b: "is", x: 210, y: 44, rot: 0 },
  { b: "are", x: 340, y: 62, rot: 9 },
];

const TENTS = [
  { d: "M140 296 Q104 336 72 346 Q48 352 56 376", o: "140px 296px" },
  { d: "M176 316 Q164 360 142 380 Q130 394 148 398", o: "176px 316px" },
  { d: "M210 322 Q214 364 200 392", o: "210px 322px" },
  { d: "M244 316 Q256 360 278 380 Q290 394 272 398", o: "244px 316px" },
  { d: "M280 296 Q316 336 348 346 Q372 352 364 376", o: "280px 296px" },
];

export default function BigOctopus({ mood, picked, correct, onPick, shakeKey, className }: Props) {
  const id = useSvgIds();
  const u = (n: string) => `url(#${id(n)})`;
  const key = (b: Be) => (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick(b);
    }
  };

  return (
    <div className={`${className ?? ""} ${mood === "happy" ? "anim-attention" : ""}`}>
      <svg viewBox="0 0 420 410" className="block w-full" style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={id("head")} cx="0.38" cy="0.3" r="0.85">
            <stop offset="0" stopColor="#fbd0ff" />
            <stop offset="0.45" stopColor="#c084fc" />
            <stop offset="1" stopColor="#8b2fd9" />
          </radialGradient>
          <linearGradient id={id("sign")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#67e8f9" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={id("gold")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fef9c3" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* bottom tentacles */}
        {TENTS.map((t, i) => (
          <g
            key={i}
            className="dv-g"
            style={{ transformOrigin: t.o, animation: `k-tent ${1.8 + i * 0.25}s ease-in-out ${i * 0.2}s infinite alternate` }}
          >
            <path d={t.d} stroke="#a855f7" strokeWidth="28" fill="none" strokeLinecap="round" />
            <path d={t.d} stroke="#e9d5ff" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.55" />
          </g>
        ))}

        {/* arms holding signs */}
        <g stroke="#a855f7" strokeWidth="24" fill="none" strokeLinecap="round">
          <path d="M160 232 Q104 222 92 170 Q86 136 84 104" />
          <path d="M210 170 Q200 124 210 86" />
          <path d="M260 232 Q316 222 328 170 Q334 136 336 104" />
        </g>
        <g fill="#f5d0fe">
          {[
            [100, 192],
            [91, 160],
            [87, 132],
            [320, 192],
            [329, 160],
            [333, 132],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4.5" />
          ))}
        </g>

        {/* head */}
        <g
          key={shakeKey}
          style={{
            transformBox: "view-box",
            transformOrigin: "210px 250px",
            animation: mood === "no" ? "k-head-shake .75s ease-in-out" : undefined,
          }}
        >
          <ellipse cx="210" cy="236" rx="108" ry="98" fill={u("head")} />
          <ellipse cx="168" cy="170" rx="36" ry="16" fill="#fff" opacity="0.35" transform="rotate(-22 168 170)" />
          <g fill="#f5d0fe" opacity="0.6">
            <circle cx="150" cy="196" r="9" />
            <circle cx="262" cy="170" r="10" />
            <circle cx="284" cy="198" r="5" />
            <circle cx="236" cy="152" r="6" />
          </g>

          {mood === "happy" ? (
            <g stroke="#3b0764" strokeWidth="7" fill="none" strokeLinecap="round">
              <path d="M150 244 Q172 218 194 244" />
              <path d="M226 244 Q248 218 270 244" />
            </g>
          ) : (
            <>
              <g className="dv-blink">
                <ellipse cx="172" cy="238" rx="25" ry="29" fill="#fff" />
                <circle cx="176" cy="243" r="14" fill="#2e1065" />
                <circle cx="181" cy="236" r="5" fill="#fff" />
                <circle cx="170" cy="250" r="2.5" fill="#fff" />
              </g>
              <g className="dv-blink">
                <ellipse cx="248" cy="238" rx="25" ry="29" fill="#fff" />
                <circle cx="252" cy="243" r="14" fill="#2e1065" />
                <circle cx="257" cy="236" r="5" fill="#fff" />
                <circle cx="246" cy="250" r="2.5" fill="#fff" />
              </g>
              {mood === "no" && (
                <g stroke="#3b0764" strokeWidth="5" fill="none" strokeLinecap="round">
                  <path d="M150 198 Q170 190 190 202" />
                  <path d="M230 202 Q250 190 270 198" />
                </g>
              )}
            </>
          )}
          <ellipse cx="138" cy="280" rx="15" ry="9" fill="#f472b6" opacity="0.6" />
          <ellipse cx="282" cy="280" rx="15" ry="9" fill="#f472b6" opacity="0.6" />
          {mood === "happy" ? (
            <>
              <path d="M182 276 Q210 318 238 276 Z" fill="#701a75" />
              <ellipse cx="210" cy="298" rx="10" ry="5" fill="#fb7185" />
            </>
          ) : mood === "no" ? (
            <ellipse cx="210" cy="290" rx="8" ry="9" fill="#701a75" />
          ) : (
            <path d="M190 282 Q210 300 230 282" stroke="#701a75" strokeWidth="5" fill="none" strokeLinecap="round" />
          )}
        </g>

        {/* signs */}
        {SIGNS.map((s) => {
          const good = mood === "happy" && s.b === correct;
          const wrong = mood === "no" && picked === s.b;
          return (
            <g
              key={s.b}
              role="button"
              tabIndex={0}
              aria-label={s.b.toUpperCase()}
              className="oc-sign clickable"
              onClick={() => onPick(s.b)}
              onKeyDown={key(s.b)}
            >
              <g transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`}>
                <g key={wrong ? `w${shakeKey}` : "n"} className={wrong ? "anim-shake fill-box" : good ? "anim-attention fill-box" : undefined}>
                  <rect
                    x="-60"
                    y="-36"
                    width="120"
                    height="72"
                    rx="24"
                    fill={good ? u("gold") : u("sign")}
                    stroke={good ? "#b45309" : "#4338ca"}
                    strokeWidth="4"
                  />
                  <rect x="-50" y="-29" width="100" height="14" rx="7" fill="#fff" opacity="0.4" />
                  <text
                    x="0"
                    y="15"
                    textAnchor="middle"
                    fontSize="42"
                    fontWeight="700"
                    fontFamily="Fredoka, sans-serif"
                    fill={good ? "#4a2400" : "#fff"}
                    stroke={good ? "none" : "#312e81"}
                    strokeWidth="6"
                    paintOrder="stroke"
                    style={{ direction: "ltr" }}
                  >
                    {s.b.toUpperCase()}
                  </text>
                  <path d="M-16 42 Q0 24 16 42" stroke="#a855f7" strokeWidth="15" fill="none" strokeLinecap="round" />
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
