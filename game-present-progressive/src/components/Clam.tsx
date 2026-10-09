import type { CSSProperties, KeyboardEvent } from "react";
import { useSvgIds } from "../game/utils";

export type ClamColor = "pink" | "lavender" | "aqua" | "peach" | "pearl";

const COLORS: Record<ClamColor, { c1: string; c2: string; c3: string; dark: string }> = {
  pink: { c1: "#ffe4ee", c2: "#ff9cc2", c3: "#ec4899", dark: "#9d174d" },
  lavender: { c1: "#f5edff", c2: "#c4b5fd", c3: "#8b5cf6", dark: "#5b21b6" },
  aqua: { c1: "#e3fcff", c2: "#8be9f5", c3: "#0ea5b7", dark: "#155e75" },
  peach: { c1: "#fff3e3", c2: "#fdc68a", c3: "#f59e0b", dark: "#9a3412" },
  pearl: { c1: "#ffffff", c2: "#f5d0fe", c3: "#a78bfa", dark: "#6d28d9" },
};

interface Props {
  open: boolean;
  color?: ClamColor;
  label?: string;
  labelSize?: number;
  pearl?: "white" | "golden" | "none";
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function Clam({
  open,
  color = "pink",
  label,
  labelSize = 44,
  pearl = "white",
  glow,
  className,
  style,
  onClick,
  ariaLabel,
}: Props) {
  const id = useSvgIds();
  const u = (n: string) => `url(#${id(n)})`;
  const c = COLORS[color];
  const golden = pearl === "golden";
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`relative ${onClick ? "clickable" : ""} ${className ?? ""}`}
      style={style}
      onClick={onClick}
      onKeyDown={onKey}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel ?? label}
    >
      {glow && !open && (
        <div
          className="anim-glow pointer-events-none absolute"
          style={{
            inset: "-14% -12% -6%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(253,230,138,.8), rgba(244,114,182,.35) 45%, transparent 70%)",
          }}
        />
      )}
      {open && pearl !== "none" && (
        <div className="pointer-events-none absolute" style={{ left: "50%", top: "36%", width: "175%", aspectRatio: "1", transform: "translate(-50%,-50%)" }}>
          <div
            className="anim-spin h-full w-full rounded-full"
            style={{
              background: golden
                ? "repeating-conic-gradient(from 0deg, rgba(253,230,138,.75) 0deg 9deg, rgba(253,230,138,0) 9deg 24deg)"
                : "repeating-conic-gradient(from 0deg, rgba(255,255,255,.55) 0deg 8deg, rgba(255,255,255,0) 8deg 24deg)",
              WebkitMaskImage: "radial-gradient(circle, #000 18%, transparent 62%)",
              maskImage: "radial-gradient(circle, #000 18%, transparent 62%)",
            }}
          />
        </div>
      )}
      <svg viewBox="0 -46 200 236" className="relative block w-full" style={{ overflow: "visible" }} aria-hidden>
        <defs>
          <linearGradient id={id("out")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.c1} />
            <stop offset="0.55" stopColor={c.c2} />
            <stop offset="1" stopColor={c.c3} />
          </linearGradient>
          <linearGradient id={id("bowl")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.c2} />
            <stop offset="1" stopColor={c.c3} />
          </linearGradient>
          <radialGradient id={id("inner")} cx="0.5" cy="0.6" r="0.7">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor="#fdf2f8" />
            <stop offset="1" stopColor={c.c2} />
          </radialGradient>
          <linearGradient id={id("irid")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fdf2f8" />
            <stop offset="0.35" stopColor="#e0f2fe" />
            <stop offset="0.65" stopColor="#f5d0fe" />
            <stop offset="1" stopColor="#fef3c7" />
          </linearGradient>
          <radialGradient id={id("pearl")} cx="0.34" cy="0.3" r="0.75">
            <stop offset="0" stopColor={golden ? "#fffbea" : "#ffffff"} />
            <stop offset="0.35" stopColor={golden ? "#fde68a" : "#fdf2f8"} />
            <stop offset="0.75" stopColor={golden ? "#f59e0b" : "#f5d0fe"} />
            <stop offset="1" stopColor={golden ? "#b45309" : "#a78bfa"} />
          </radialGradient>
          <radialGradient id={id("pglow")}>
            <stop offset="0.3" stopColor={golden ? "#fde68a" : "#ffffff"} stopOpacity="0.95" />
            <stop offset="1" stopColor={golden ? "#f59e0b" : "#f0abfc"} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* inner side of the lid (visible when open) */}
        <g
          className="dv-g"
          style={{
            transformOrigin: "100px 108px",
            transform: open ? "scaleY(1)" : "scaleY(0)",
            transition: open ? "transform .5s cubic-bezier(.3,1.6,.5,1) .18s" : "transform .2s ease-in",
          }}
        >
          <path
            d="M14 108 Q8 30 40 0 Q60 -22 100 -26 Q140 -22 160 0 Q192 30 186 108 Q100 94 14 108 Z"
            fill={u("irid")}
            stroke={c.c3}
            strokeWidth="3"
          />
          <g stroke={c.c2} strokeWidth="2.5" opacity="0.6" strokeLinecap="round">
            <path d="M100 100 L40 4 M100 100 L70 -16 M100 100 L100 -22 M100 100 L130 -16 M100 100 L160 4" />
          </g>
          {label && (
            <text
              x="100"
              y={36}
              textAnchor="middle"
              fontSize={labelSize * 0.8}
              fontWeight="700"
              fontFamily="Fredoka, 'Baloo Bhaijaan 2', sans-serif"
              fill="#fff"
              stroke={c.dark}
              strokeWidth="6"
              paintOrder="stroke"
              style={{ direction: "ltr" }}
            >
              {label}
            </text>
          )}
        </g>

        <ellipse cx="100" cy="112" rx="84" ry="15" fill={u("inner")} style={{ opacity: open ? 1 : 0, transition: "opacity .2s .12s" }} />

        {pearl !== "none" && (
          <g
            className="dv-g"
            style={{
              transformOrigin: "100px 102px",
              transform: open ? "scale(1)" : "scale(0)",
              transition: open ? "transform .55s cubic-bezier(.3,1.7,.5,1) .35s" : "transform .15s",
            }}
          >
            <circle cx="100" cy="100" r="34" fill={u("pglow")} />
            <circle cx="100" cy="100" r="18" fill={u("pearl")} />
            <ellipse cx="94" cy="93.5" rx="5.5" ry="3.5" fill="#fff" transform="rotate(-30 94 93.5)" />
          </g>
        )}

        {/* bottom shell */}
        <path
          d="M12 110 Q18 178 100 184 Q182 178 188 110 Q100 128 12 110 Z"
          fill={u("bowl")}
          stroke={c.dark}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <g stroke={c.c1} strokeWidth="3" opacity="0.55" strokeLinecap="round">
          <path d="M100 182 L30 116 M100 182 L55 121 M100 182 L80 124 M100 182 L100 125 M100 182 L120 124 M100 182 L145 121 M100 182 L170 116" />
        </g>
        <path d="M30 134 Q60 160 100 165" stroke="#fff" strokeWidth="5" opacity="0.3" fill="none" strokeLinecap="round" />

        {/* closed lid */}
        <g
          className="dv-g"
          style={{
            transformOrigin: "100px 116px",
            transform: open ? "scaleY(0)" : "scaleY(1)",
            transition: open ? "transform .2s ease-in" : "transform .35s cubic-bezier(.3,1.5,.5,1) .1s",
          }}
        >
          <path
            d="M12 112 Q6 70 24 52 Q28 38 44 38 Q50 26 66 28 Q76 17 100 19 Q124 17 134 28 Q150 26 156 38 Q172 38 176 52 Q194 70 188 112 Q100 130 12 112 Z"
            fill={u("out")}
            stroke={c.dark}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <g stroke={c.c3} strokeWidth="3" opacity="0.4" strokeLinecap="round">
            <path d="M100 120 L24 54 M100 120 L44 40 M100 120 L66 30 M100 120 L100 21 M100 120 L134 30 M100 120 L156 40 M100 120 L176 54" />
          </g>
          <ellipse cx="68" cy="50" rx="24" ry="9" fill="#fff" opacity="0.5" transform="rotate(-18 68 50)" />
          {label && (
            <text
              x="100"
              y={80 + labelSize * 0.34}
              textAnchor="middle"
              fontSize={labelSize}
              fontWeight="700"
              fontFamily="Fredoka, 'Baloo Bhaijaan 2', sans-serif"
              fill="#fff"
              stroke={c.dark}
              strokeWidth="7"
              paintOrder="stroke"
              style={{ direction: "ltr" }}
            >
              {label}
            </text>
          )}
        </g>
      </svg>
    </div>
  );
}
