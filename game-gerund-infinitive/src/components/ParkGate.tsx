import { cn } from "../utils/cn";

function Gear({ size = 60, color = "#ffcf4a", spin, rev }: { size?: number; color?: string; spin?: boolean; rev?: boolean }) {
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={cn(spin && (rev ? "gear-spin-rev" : "gear-spin"))}>
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x="-7" y="-48" width="14" height="18" rx="3" fill={color} transform={`rotate(${i * 36})`} />
      ))}
      <circle r="34" fill={color} />
      <circle r="14" fill="#1b1760" />
      <circle r="6" fill={color} />
    </svg>
  );
}

export default function ParkGate({
  open,
  lit,
  gears,
  className,
  title = "ADVENTURE PARK",
  sub = "🎡 Gerund & Infinitive 🎢",
}: {
  open: boolean;
  lit: boolean;
  gears?: boolean;
  className?: string;
  title?: string;
  sub?: string;
}) {
  return (
    <div className={cn("relative w-[min(88vw,520px)] aspect-[1.2] select-none", className)}>
      {/* opening glow */}
      <div className="absolute left-[17%] right-[17%] top-[26%] bottom-0 rounded-t-[999px] overflow-hidden" style={{ perspective: "900px" }}>
        <div
          className="absolute inset-0 transition-all duration-[1500ms]"
          style={{
            background: open
              ? "radial-gradient(circle at 50% 70%, #fff6c9 0%, #ffcf4a 25%, #ff6fb5 55%, #3a1f73 100%)"
              : "linear-gradient(#141a52, #0b0f3a)",
          }}
        />
        {open && (
          <div className="absolute inset-0 flex items-end justify-center gap-3 pb-6 text-4xl sm:text-5xl fade-up">
            <span className="float">🎡</span>
            <span className="float" style={{ animationDelay: ".5s" }}>
              🎢
            </span>
            <span className="float" style={{ animationDelay: "1s" }}>
              🎠
            </span>
          </div>
        )}
        {(["l", "r"] as const).map((side) => (
          <div
            key={side}
            className="absolute top-0 bottom-0 w-1/2 transition-transform duration-[1800ms] ease-in-out"
            style={{
              [side === "l" ? "left" : "right"]: 0,
              transformOrigin: side === "l" ? "left center" : "right center",
              transform: open ? `rotateY(${side === "l" ? 105 : -105}deg)` : "rotateY(0)",
              background: "repeating-linear-gradient(90deg, #2a1a66 0 14px, #ffcf4a 14px 18px), linear-gradient(#3a1f73,#1b1760)",
              backgroundBlendMode: "normal",
              borderLeft: side === "r" ? "3px solid #ffcf4a" : undefined,
              borderRight: side === "l" ? "3px solid #ffcf4a" : undefined,
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.6)",
            }}
          >
            <div className="absolute top-[18%] left-0 right-0 h-2 bg-gold/90" />
            <div className="absolute bottom-[18%] left-0 right-0 h-2 bg-gold/90" />
          </div>
        ))}
        {!open && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-navy border-4 border-gold flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,207,74,0.6)]">
            🔒
          </div>
        )}
      </div>

      {/* towers */}
      {(["left-0", "right-0"] as const).map((pos, i) => (
        <div key={pos} className={cn("absolute bottom-0 w-[18%] h-[78%]", pos)}>
          <div className="absolute -top-[20%] left-[-10%] right-[-10%] h-[22%]" style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)", background: "linear-gradient(#ff6fb5,#b83280)" }} />
          <div className="absolute -top-[26%] left-1/2 -translate-x-1/2 text-lg">🚩</div>
          <div className="absolute inset-0 rounded-t-md bg-gradient-to-b from-[#6d5bd0] to-[#2a1a66] border-2 border-lav/40">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[46%] aspect-[0.7] rounded-t-full bg-navy border-2 border-gold/60" style={{ boxShadow: lit ? "0 0 18px #ffcf4a, inset 0 0 12px #ffcf4a" : undefined, background: lit ? "#ffcf4a" : undefined }} />
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2">
              <Gear size={46} spin={gears} rev={i === 1} color={lit ? "#ffcf4a" : "#8f78f0"} />
            </div>
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2">
              <Gear size={30} spin={gears} rev={i === 0} color={lit ? "#3ee6d6" : "#6d5bd0"} />
            </div>
          </div>
        </div>
      ))}

      {/* arch sign */}
      <div className="absolute top-[6%] left-[12%] right-[12%] h-[22%]">
        <div
          className={cn(
            "absolute inset-0 rounded-t-[999px] rounded-b-2xl border-4 flex flex-col items-center justify-center transition-all duration-1000",
            lit ? "bg-gradient-to-b from-[#ff6fb5] to-[#8f2a8f] border-gold shadow-[0_0_40px_rgba(255,111,181,0.7)]" : "bg-[#2a1a66] border-lav/40"
          )}
        >
          <p className={cn("en font-bold text-base sm:text-3xl leading-none tracking-wide text-center", lit ? "text-white neon-gold" : "text-white/50")}>{title}</p>
          <p className={cn("en text-[10px] sm:text-sm font-semibold mt-1", lit ? "text-gold" : "text-white/40")}>{sub}</p>
        </div>
        <div className="bulb-row absolute -bottom-3 left-2 right-2 flex justify-between">
          {Array.from({ length: 13 }).map((_, i) => (
            <span key={i} className={cn("w-2.5 h-2.5 rounded-full", lit ? "bg-gold shadow-[0_0_8px_#ffcf4a]" : "bg-white/20 !animate-none")} />
          ))}
        </div>
      </div>
    </div>
  );
}
