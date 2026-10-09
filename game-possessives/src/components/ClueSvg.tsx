interface Props {
  name: string;
  className?: string;
}

// Large, clear, colorful SVG clue objects (not emoji).
export default function ClueSvg({ name, className = "" }: Props) {
  const common = { className, viewBox: "0 0 120 120", xmlns: "http://www.w3.org/2000/svg" as const };
  switch (name) {
    case "book":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="bk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7c3aed" />
              <stop offset="1" stopColor="#4338ca" />
            </linearGradient>
          </defs>
          <path d="M18 26c14-8 30-8 42 0 12-8 28-8 42 0v66c-14-8-30-8-42 0-12-8-28-8-42 0Z" fill="url(#bk)" stroke="#fbbf24" strokeWidth="3" />
          <path d="M60 26v66" stroke="#fbbf24" strokeWidth="3" />
          <path d="M28 40h22M28 52h22M70 40h22M70 52h22" stroke="#e9d5ff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f472b6" />
              <stop offset="1" stopColor="#db2777" />
            </linearGradient>
          </defs>
          <path d="M40 44c0-14 6-22 20-22s20 8 20 22" fill="none" stroke="#fbbf24" strokeWidth="5" />
          <rect x="26" y="44" width="68" height="56" rx="12" fill="url(#bg1)" stroke="#fbbf24" strokeWidth="3" />
          <circle cx="60" cy="70" r="9" fill="#fde68a" />
        </svg>
      );
    case "hat":
      return (
        <svg {...common}>
          <ellipse cx="60" cy="86" rx="46" ry="12" fill="#1f2937" stroke="#fbbf24" strokeWidth="3" />
          <path d="M36 82V50c0-13 10-22 24-22s24 9 24 22v32Z" fill="#374151" stroke="#fbbf24" strokeWidth="3" />
          <rect x="36" y="70" width="48" height="10" fill="#0d9488" />
        </svg>
      );
    case "ball":
      return (
        <svg {...common}>
          <defs>
            <radialGradient id="bl" cx="0.4" cy="0.35">
              <stop offset="0" stopColor="#5eead4" />
              <stop offset="1" stopColor="#0d9488" />
            </radialGradient>
          </defs>
          <circle cx="60" cy="60" r="40" fill="url(#bl)" stroke="#fbbf24" strokeWidth="3" />
          <path d="M60 20l12 20-12 14-12-14Z" fill="#312e81" />
          <path d="M100 60l-22 6-6-18 14-12Z" fill="#312e81" opacity=".7" />
          <path d="M20 60l22 6 6-18-14-12Z" fill="#312e81" opacity=".7" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...common}>
          <g transform="rotate(45 60 60)">
            <rect x="40" y="16" width="40" height="70" rx="4" fill="#fbbf24" stroke="#b45309" strokeWidth="3" />
            <rect x="40" y="16" width="40" height="12" fill="#f472b6" />
            <path d="M40 86l20 20 20-20Z" fill="#fde68a" stroke="#b45309" strokeWidth="3" />
            <path d="M52 98l8 8 8-8Z" fill="#1f2937" />
          </g>
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="cr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M18 76h84l-8-20-14-14H40L26 56l-8 4Z" fill="url(#cr)" stroke="#fbbf24" strokeWidth="3" />
          <path d="M44 42h30l10 14H36Z" fill="#bae6fd" />
          <circle cx="38" cy="82" r="12" fill="#1f2937" stroke="#fbbf24" strokeWidth="3" />
          <circle cx="86" cy="82" r="12" fill="#1f2937" stroke="#fbbf24" strokeWidth="3" />
        </svg>
      );
    case "cup":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="cp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fda4af" />
              <stop offset="1" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          <path d="M32 34h44v40c0 12-10 22-22 22s-22-10-22-22Z" fill="url(#cp)" stroke="#fbbf24" strokeWidth="3" />
          <path d="M76 44h12a10 10 0 0 1 0 24h-8" fill="none" stroke="#fbbf24" strokeWidth="4" />
          <ellipse cx="54" cy="34" rx="22" ry="7" fill="#fff1f2" />
        </svg>
      );
    case "chest":
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="ch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#6d28d9" />
            </linearGradient>
          </defs>
          <path d="M20 50c0-12 18-18 40-18s40 6 40 18v6H20Z" fill="url(#ch)" stroke="#fbbf24" strokeWidth="3" />
          <rect x="20" y="56" width="80" height="40" rx="4" fill="#7c3aed" stroke="#fbbf24" strokeWidth="3" />
          <rect x="52" y="60" width="16" height="24" rx="3" fill="#fbbf24" />
          <circle cx="60" cy="70" r="4" fill="#1f2937" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="40" fill="#7c3aed" stroke="#fbbf24" strokeWidth="3" />
          <text x="60" y="72" textAnchor="middle" fontSize="34" fill="#fff">?</text>
        </svg>
      );
  }
}
