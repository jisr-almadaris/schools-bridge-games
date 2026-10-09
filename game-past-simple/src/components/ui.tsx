import { ReactNode, useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { sfx } from "../audio";

/* ---------- الشخصية (تصميم واحد ثابت) ---------- */
export function Character({
  className,
  size = "md",
  animate = "bob",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: "bob" | "walk" | "none";
}) {
  const sizes = { sm: "h-40 sm:h-52", md: "h-56 sm:h-72 lg:h-80", lg: "h-72 sm:h-96 lg:h-[30rem]" };
  return (
    <div
      className={cn(
        "relative select-none pointer-events-none",
        animate === "bob" && "anim-bob",
        animate === "walk" && "anim-walk-in",
        className,
      )}
    >
      <div className="absolute inset-x-6 bottom-1 h-5 rounded-full bg-black/25 blur-md" />
      <img
        src="/schools-bridge-games/game-past-simple/images/character.png"
        alt="مستكشفة الزمن"
        className={cn("character-mask object-contain drop-shadow-[0_10px_20px_rgba(60,30,120,0.35)]", sizes[size])}
        draggable={false}
      />
    </div>
  );
}

/* ---------- زر كبير ---------- */
export function Btn({
  children,
  onClick,
  variant = "gold",
  className,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "gold" | "violet" | "teal" | "ghost" | "white";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const styles = {
    gold: "bg-gradient-to-b from-[#ffe08a] to-[#f2b632] text-[#4a2d00] shadow-[0_6px_0_#b8860b,0_12px_24px_rgba(0,0,0,0.25)] hover:brightness-105",
    violet: "bg-gradient-to-b from-[#9d7be0] to-[#6a48bf] text-white shadow-[0_6px_0_#4b2f8f,0_12px_24px_rgba(0,0,0,0.25)]",
    teal: "bg-gradient-to-b from-[#7fe3d8] to-[#2fbfb0] text-[#0b3f3a] shadow-[0_6px_0_#1f8f84,0_12px_24px_rgba(0,0,0,0.25)]",
    ghost: "bg-white/15 text-white border-2 border-white/40 backdrop-blur hover:bg-white/25",
    white: "bg-white text-[#4b2f8f] shadow-[0_6px_0_#c9b8ee,0_12px_24px_rgba(0,0,0,0.2)]",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        sfx.click();
        onClick?.();
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-lg sm:text-xl font-extrabold transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ---------- لوحة زجاجية ---------- */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "glass rounded-3xl border-2 border-[#f7c948]/60 p-5 sm:p-7 shadow-[0_20px_50px_rgba(20,15,60,0.45)] text-[#2a2760]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- إطار ذهبي لصورة ذكرى ---------- */
export function MemoryFrame({
  src,
  emoji,
  className,
  onClick,
  active,
  caption,
  size = "md",
}: {
  src?: string;
  emoji?: string;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  caption?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "w-32 sm:w-40", md: "w-44 sm:w-56 lg:w-64", lg: "w-60 sm:w-80 lg:w-96" };
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "gold-frame relative overflow-hidden bg-[#d9ccf0] transition-transform duration-300",
          sizes[size],
          onClick && "cursor-pointer hover:scale-105 hover:-rotate-1",
          active && "anim-wiggle ring-4 ring-[#ffe08a]",
        )}
        style={{ aspectRatio: "4/3" }}
      >
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#b9a4e6] to-[#7c5cc4] text-5xl sm:text-6xl">
            {emoji}
          </div>
        )}
        {onClick && !active && (
          <span className="absolute bottom-1 right-1 rounded-full bg-white/85 px-2 py-0.5 text-xs font-bold text-[#4b2f8f]">
            ✨
          </span>
        )}
      </button>
      {caption && <div className="text-center">{caption}</div>}
    </div>
  );
}

/* ---------- ساعة SVG ---------- */
export function Clock({ size = 180, back = false, className }: { size?: number; back?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={cn("drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]", className)}>
      <defs>
        <radialGradient id="clockFace" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#f3e6c4" />
        </radialGradient>
        <linearGradient id="clockRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe8a8" />
          <stop offset="50%" stopColor="#c9962b" />
          <stop offset="100%" stopColor="#ffe08a" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="url(#clockRim)" />
      <circle cx="100" cy="100" r="84" fill="url(#clockFace)" stroke="#b8860b" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x1 = 100 + Math.sin(a) * 72;
        const y1 = 100 - Math.cos(a) * 72;
        const x2 = 100 + Math.sin(a) * (i % 3 === 0 ? 60 : 66);
        const y2 = 100 - Math.cos(a) * (i % 3 === 0 ? 60 : 66);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4b2f8f" strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" />;
      })}
      <g style={{ transformOrigin: "100px 100px", transform: "rotate(60deg)" }}>
        <g className={cn("hand-hour", back && "back")} style={{ transformOrigin: "100px 100px" }}>
          <line x1="100" y1="100" x2="100" y2="55" stroke="#4b2f8f" strokeWidth="6" strokeLinecap="round" />
        </g>
      </g>
      <g style={{ transformOrigin: "100px 100px", transform: "rotate(200deg)" }}>
        <g className={cn("hand-min", back && "back")} style={{ transformOrigin: "100px 100px" }}>
          <line x1="100" y1="100" x2="100" y2="35" stroke="#2fbfb0" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
      <circle cx="100" cy="100" r="6" fill="#c9962b" />
    </svg>
  );
}

/* ---------- نجوم متلألئة ---------- */
export function Sparkles({ count = 18 }: { count?: number }) {
  const [stars] = useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 6 + Math.random() * 10,
      delay: Math.random() * 3,
    })),
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="anim-twinkle absolute text-[#ffe08a]"
          style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: s.size, animationDelay: `${s.delay}s` }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

/* ---------- كونفيتي ---------- */
export function Confetti({ count = 70 }: { count?: number }) {
  const [pieces] = useState(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      color: ["#f7c948", "#7fe3d8", "#b9a4e6", "#ff9ccf", "#ffe08a", "#7c5cc4"][i % 6],
    })),
  );
  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.left}%`, background: p.color, animationDelay: `${p.delay}s` }}
        />
      ))}
    </>
  );
}

/* ---------- نافذة منبثقة ---------- */
export function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171644]/70 p-3 backdrop-blur-sm" onClick={onClose}>
      <div
        className="anim-pop relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border-4 border-[#f7c948] bg-gradient-to-b from-[#f6f1ff] to-[#e9e0fb] p-5 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-black text-[#4b2f8f] shadow cursor-pointer"
          aria-label="إغلاق"
        >
          ✕
        </button>
        <h2 className="mb-4 text-center text-2xl sm:text-3xl font-black text-[#4b2f8f]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

/* ---------- شارة المبادرة ---------- */
export function InitiativeBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-full border-2 border-[#f7c948] bg-gradient-to-l from-[#4b2f8f] to-[#7c5cc4] px-4 py-1.5 text-sm sm:text-base font-extrabold text-[#ffe08a] shadow-lg",
        className,
      )}
    >
      مبادرة جسر المدارس 🌉
    </div>
  );
}

/* ---------- شريط تعليمات قصير ---------- */
export function Instruction({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto inline-block rounded-full bg-[#4b2f8f] px-5 py-1.5 text-base sm:text-lg font-bold text-[#ffe08a] shadow">
      {children}
    </div>
  );
}

/* ---------- سر من أسرار الزمن ---------- */
export function SecretCard({ text }: { text: string }) {
  return (
    <div className="anim-pop mx-auto max-w-xl rounded-2xl border-2 border-dashed border-[#c9962b] bg-[#fff8dc] px-4 py-3 text-center text-[#5a3d00] shadow">
      <div className="text-sm font-black text-[#c9962b]">سر من أسرار الزمن 💡</div>
      <div className="mt-1 text-base sm:text-lg font-bold">{text}</div>
    </div>
  );
}
