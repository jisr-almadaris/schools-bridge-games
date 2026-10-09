interface Props {
  type: string;
  className?: string;
}

// A small cute person illustration (SVG, not emoji).
function Person({
  x = 60,
  bodyFill = "#f472b6",
  hairFill = "#3b2f2f",
  girl = true,
  scale = 1,
}: {
  x?: number;
  bodyFill?: string;
  hairFill?: string;
  girl?: boolean;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} 60) scale(${scale})`}>
      {/* body */}
      {girl ? (
        <path d="M-22 44 C-22 8 22 8 22 44 Z" fill={bodyFill} />
      ) : (
        <rect x="-16" y="4" width="32" height="40" rx="10" fill={bodyFill} />
      )}
      {/* legs for boy */}
      {!girl && (
        <>
          <rect x="-12" y="40" width="9" height="14" rx="3" fill="#334155" />
          <rect x="3" y="40" width="9" height="14" rx="3" fill="#334155" />
        </>
      )}
      {/* head */}
      <circle cx="0" cy="-16" r="16" fill="#ffe0bd" />
      {/* hair */}
      <path
        d={
          girl
            ? "M-17 -16 C-17 -38 17 -38 17 -16 C17 -24 12 -30 0 -30 C-12 -30 -17 -24 -17 -16 Z"
            : "M-16 -18 C-16 -34 16 -34 16 -18 C10 -26 -10 -26 -16 -18 Z"
        }
        fill={hairFill}
      />
      {/* eyes */}
      <circle cx="-6" cy="-16" r="2.4" fill="#1f2937" />
      <circle cx="6" cy="-16" r="2.4" fill="#1f2937" />
      {/* smile */}
      <path d="M-6 -9 Q0 -4 6 -9" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

export default function PronounIcon({ type, className = "" }: Props) {
  const common = {
    className,
    viewBox: "0 0 120 120",
    xmlns: "http://www.w3.org/2000/svg" as const,
  };
  switch (type) {
    case "mine":
      return (
        <svg {...common}>
          <Person x={60} bodyFill="#f472b6" girl />
          {/* star badge = "me / mine" */}
          <path
            d="M60 24 l3.5 7 7.7 1 -5.6 5.4 1.3 7.6 -6.9 -3.6 -6.9 3.6 1.3 -7.6 -5.6 -5.4 7.7 -1 Z"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "yours":
      return (
        <svg {...common}>
          <Person x={64} bodyFill="#14b8a6" girl />
          {/* pointing arrow toward "you" */}
          <path d="M8 60 L34 60" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
          <path d="M30 52 L40 60 L30 68 Z" fill="#fbbf24" />
        </svg>
      );
    case "his":
      return (
        <svg {...common}>
          <Person x={60} bodyFill="#3b82f6" hairFill="#1f2937" girl={false} />
        </svg>
      );
    case "hers":
      return (
        <svg {...common}>
          <Person x={60} bodyFill="#d946ef" hairFill="#7c2d12" girl />
        </svg>
      );
    case "ours":
      return (
        <svg {...common}>
          <Person x={40} bodyFill="#10b981" girl scale={0.85} />
          <Person x={80} bodyFill="#3b82f6" hairFill="#1f2937" girl={false} scale={0.85} />
        </svg>
      );
    case "theirs":
      return (
        <svg {...common}>
          <Person x={32} bodyFill="#f59e0b" girl scale={0.72} />
          <Person x={60} bodyFill="#ef4444" hairFill="#1f2937" girl={false} scale={0.72} />
          <Person x={88} bodyFill="#8b5cf6" girl scale={0.72} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <Person x={60} girl />
        </svg>
      );
  }
}
