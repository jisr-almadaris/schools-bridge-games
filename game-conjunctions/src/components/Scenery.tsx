import { useMemo, type CSSProperties, type ReactNode } from "react";

const rand = (seed: number) => { const x = Math.sin(seed * 999) * 10000; return x - Math.floor(x); };

export function Dust({ count = 26, color }: { count?: number; color?: string }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: rand(i + 1) * 100, dur: 9 + rand(i + 7) * 12, delay: -rand(i + 3) * 20, size: 2 + rand(i + 11) * 5, dx: (rand(i + 5) - 0.5) * 120,
  })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 15 }}>
      {items.map((d, i) => (
        <span key={i} className="dust" style={{ left: `${d.left}%`, width: d.size, height: d.size, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`, ["--dx" as string]: `${d.dx}px`, background: color ? `radial-gradient(circle, ${color}, transparent)` : undefined } as CSSProperties} />
      ))}
    </div>
  );
}

export function Fog({ style }: { style?: CSSProperties }) {
  return <div className="fog" style={{ zIndex: 18, ...style }} />;
}

const RUNE_CHARS = ["ᚠ", "ᚱ", "ᛟ", "ᛉ", "✧", "ᚨ", "ᛞ", "☽", "ᛗ", "✦", "ᚹ", "ᛜ"];
export function Runes({ count = 8, area = { top: 5, bottom: 55 } }: { count?: number; area?: { top: number; bottom: number } }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => ({
    ch: RUNE_CHARS[i % RUNE_CHARS.length], left: 4 + rand(i + 20) * 92, top: area.top + rand(i + 40) * (area.bottom - area.top), size: 16 + rand(i + 60) * 22, dur: 5 + rand(i + 80) * 6, delay: -rand(i + 90) * 10,
  })), [count, area.top, area.bottom]);
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
      {items.map((r, i) => <span key={i} className="rune" style={{ left: `${r.left}%`, top: `${r.top}%`, fontSize: r.size, animationDuration: `${r.dur}s`, animationDelay: `${r.delay}s` }}>{r.ch}</span>)}
    </div>
  );
}

export function NightWindow({ className = "", style, flashDelay = 0 }: { className?: string; style?: CSSProperties; flashDelay?: number }) {
  return (
    <div className={`absolute overflow-hidden ${className}`} style={{ borderRadius: "999px 999px 8px 8px", border: "6px solid #c8952e", boxShadow: "0 0 0 4px #3d0f24, 0 0 40px rgba(185,163,255,.35), inset 0 0 30px rgba(0,0,0,.5)", background: "linear-gradient(180deg,#1b0f45 0%,#4a2590 60%,#8a4fc9 100%)", ...style }}>
      <div className="absolute rounded-full" style={{ width: "34%", aspectRatio: "1", right: "14%", top: "14%", background: "radial-gradient(circle at 35% 35%, #fffbe6, #f4dca0 60%, #d7b76a)", boxShadow: "0 0 30px #fff3c4" }} />
      {[...Array(9)].map((_, i) => (
        <span key={i} className="absolute rounded-full bg-white anim-twinkle" style={{ width: 3, height: 3, left: `${10 + rand(i + 3) * 80}%`, top: `${8 + rand(i + 9) * 50}%`, animationDelay: `${rand(i) * 3}s` }} />
      ))}
      {/* silhouettes of hills / trees */}
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[30%]"><path d="M0 40 L0 22 Q15 10 30 20 Q45 30 60 16 Q78 4 100 18 L100 40 Z" fill="#1a0d33" /></svg>
      <div className="lightning-flash" style={{ animation: `lightning 13s linear ${flashDelay}s infinite` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 48%, #c8952e 48%, #c8952e 52%, transparent 52%), linear-gradient(0deg, transparent 58%, #c8952e 58%, #c8952e 61%, transparent 61%)" }} />
    </div>
  );
}

export function Candle({ style, className = "", purple }: { style?: CSSProperties; className?: string; purple?: boolean }) {
  return (
    <div className={`absolute anim-float pointer-events-none ${className}`} style={{ zIndex: 12, ...style }}>
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-8 w-16 h-16 rounded-full" style={{ background: `radial-gradient(circle, ${purple ? "rgba(185,120,255,.55)" : "rgba(255,207,122,.5)"}, transparent 70%)` }} />
        <div style={{ width: 10, height: 18, borderRadius: "50% 50% 40% 40%", background: purple ? "radial-gradient(circle at 50% 70%, #fff, #c9a0ff 50%, #7b3fe0)" : "radial-gradient(circle at 50% 70%, #fff, #ffd98a 50%, #ff8a2a)", animation: "flame .5s ease-in-out infinite", transformOrigin: "50% 100%" }} />
        <div style={{ width: 14, height: 38, borderRadius: 3, background: "linear-gradient(90deg,#e8dcc8,#fffaf0,#d9c9ae)" }} />
      </div>
    </div>
  );
}

export function Painting({ className = "", style, follow, kind = "cat" }: { className?: string; style?: CSSProperties; follow?: boolean; kind?: "cat" | "owl" | "lady" }) {
  const pupilAnim: CSSProperties = follow ? { animation: "eyesFollow 3s ease-in-out infinite alternate" } : { animation: "eyes 6s ease-in-out infinite" };
  const bg = kind === "owl" ? "#2c4a5e" : kind === "lady" ? "#5e2c48" : "#3a2c5e";
  return (
    <div className={`absolute ${className}`} style={{ zIndex: 4, ...style }}>
      <svg viewBox="0 0 80 100" className="w-full h-full" style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,.5))" }}>
        <rect x="2" y="2" width="76" height="96" rx="6" fill="#c8952e" stroke="#fff0b3" strokeWidth="2" />
        <rect x="9" y="9" width="62" height="82" rx="3" fill={bg} />
        {kind === "cat" && (<>
          <path d="M20 90 Q40 58 60 90 Z" fill="#6e1a3d" />
          <path d="M22 40 L26 22 L34 32 Z M58 40 L54 22 L46 32 Z" fill="#8a8aa8" />
          <circle cx="40" cy="44" r="19" fill="#9a9ab8" />
          <path d="M36 54 Q40 58 44 54" stroke="#3a2c5e" strokeWidth="1.6" fill="none" />
          <circle cx="54" cy="42" r="6" fill="none" stroke="#f2c95c" strokeWidth="1.4" />
        </>)}
        {kind === "owl" && (<>
          <ellipse cx="40" cy="58" rx="22" ry="28" fill="#8a6a4a" />
          <path d="M22 34 L28 24 L34 32 Z M58 34 L52 24 L46 32 Z" fill="#6a4a2a" />
          <path d="M37 52 L40 58 L43 52 Z" fill="#f2c95c" />
        </>)}
        {kind === "lady" && (<>
          <path d="M18 90 Q40 56 62 90 Z" fill="#3b1f6e" />
          <circle cx="40" cy="42" r="16" fill="#f3d0b4" />
          <path d="M22 44 Q22 18 40 20 Q58 18 58 44 Q54 30 40 30 Q26 30 22 44 Z" fill="#2a1512" />
          <path d="M35 52 Q40 55 45 52" stroke="#7a2244" strokeWidth="1.6" fill="none" />
        </>)}
        <circle cx="33" cy="42" r="5.5" fill="#fff" />
        <circle cx="47" cy="42" r="5.5" fill="#fff" />
        <g style={pupilAnim}>
          <circle cx="33" cy="42" r="2.6" fill="#140c2e" />
          <circle cx="47" cy="42" r="2.6" fill="#140c2e" />
        </g>
      </svg>
    </div>
  );
}

export function Chandelier({ style, className = "" }: { style?: CSSProperties; className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`} style={{ zIndex: 6, ...style }}>
      <svg viewBox="0 0 160 110" className="w-full h-full anim-float" style={{ animationDuration: "7s" }}>
        <line x1="80" y1="0" x2="80" y2="30" stroke="#c8952e" strokeWidth="3" />
        <path d="M20 60 Q80 100 140 60" stroke="#f2c95c" strokeWidth="5" fill="none" />
        <path d="M40 50 Q80 75 120 50" stroke="#c8952e" strokeWidth="4" fill="none" />
        <circle cx="80" cy="36" r="10" fill="#f2c95c" />
        {[20, 50, 80, 110, 140].map((x, i) => (
          <g key={x}>
            <rect x={x - 4} y={i % 2 ? 46 : 52} width="8" height="14" fill="#fffaf0" />
            <ellipse cx={x} cy={i % 2 ? 40 : 46} rx="4" ry="7" fill="#ffd98a" style={{ animation: "flame .6s infinite", transformOrigin: "center", transformBox: "fill-box" }} />
            <circle cx={x} cy={i % 2 ? 42 : 48} r="14" fill="rgba(255,207,122,.25)" />
          </g>
        ))}
        {[35, 65, 95, 125].map((x) => <path key={x} d={`M${x} 70 l4 10 l-4 10 l-4 -10 z`} fill="#b9e8ff" opacity=".8" />)}
      </svg>
    </div>
  );
}

export function GrandClock({ className = "", style, stopped, reverse }: { className?: string; style?: CSSProperties; stopped?: boolean; reverse?: boolean }) {
  const handAnim = (d: number): CSSProperties => ({ transformBox: "view-box", transformOrigin: "50px 42px", animation: reverse ? "handsBack 1.6s ease-in-out" : stopped ? "none" : `spin ${d}s linear infinite` });
  return (
    <div className={`absolute ${className}`} style={{ zIndex: 5, ...style }}>
      <svg viewBox="0 0 100 220" className="w-full h-full" style={{ filter: "drop-shadow(0 10px 14px rgba(0,0,0,.5))" }}>
        <path d="M20 10 Q50 -6 80 10 L84 210 L16 210 Z" fill="#4a1a2e" stroke="#c8952e" strokeWidth="3" />
        <circle cx="50" cy="42" r="26" fill="#f7ecd4" stroke="#f2c95c" strokeWidth="4" />
        {[...Array(12)].map((_, i) => <line key={i} x1="50" y1="19" x2="50" y2="23" stroke="#3b1f6e" strokeWidth="2" transform={`rotate(${i * 30} 50 42)`} />)}
        <line x1="50" y1="42" x2="50" y2="26" stroke="#3b1f6e" strokeWidth="3" strokeLinecap="round" style={handAnim(40)} />
        <line x1="50" y1="42" x2="50" y2="31" stroke="#6e1a3d" strokeWidth="4" strokeLinecap="round" style={handAnim(240)} />
        <circle cx="50" cy="42" r="3" fill="#c8952e" />
        <rect x="30" y="80" width="40" height="110" rx="6" fill="#1b0f33" stroke="#c8952e" strokeWidth="2" />
        <g style={{ transformBox: "view-box", transformOrigin: "50px 84px", animation: stopped ? "none" : "headTilt 2s ease-in-out infinite" }}>
          <line x1="50" y1="84" x2="50" y2="160" stroke="#f2c95c" strokeWidth="2" />
          <circle cx="50" cy="165" r="10" fill="#f2c95c" />
        </g>
      </svg>
    </div>
  );
}

export function Mirror({ className = "", style, children, shake, tint = "#b9e8ff" }: { className?: string; style?: CSSProperties; children?: ReactNode; shake?: boolean; tint?: string }) {
  return (
    <div className={`relative ${className}`} style={{ animation: shake ? "mirrorWobble .25s linear 4" : undefined, ...style }}>
      <div className="absolute inset-0" style={{ borderRadius: "50% 50% 14px 14px / 30% 30% 14px 14px", border: "7px solid #c8952e", boxShadow: "0 0 0 3px #fff0b3, 0 0 30px rgba(185,232,255,.35), inset 0 0 30px rgba(255,255,255,.3)", background: `linear-gradient(135deg, ${tint}55, #3b1f6e 60%, ${tint}33)` }} />
      <div className="absolute inset-[7px] overflow-hidden" style={{ borderRadius: "50% 50% 8px 8px / 30% 30% 8px 8px" }}>
        <div className="absolute inset-0 shimmer opacity-40" />
      </div>
      <div className="relative h-full flex flex-col items-center justify-center p-3 text-center">{children}</div>
    </div>
  );
}

export function Bookshelf({ className = "", style, flying }: { className?: string; style?: CSSProperties; flying?: boolean }) {
  const colors = ["#6e1a3d", "#2f7f86", "#c8952e", "#3b1f6e", "#7c5cd6", "#1f5e8f", "#8a3d1f"];
  return (
    <div className={`absolute ${className}`} style={{ zIndex: 4, ...style }}>
      <div className="w-full h-full rounded-md p-2 flex flex-col justify-around" style={{ background: "#2a1020", border: "4px solid #c8952e", boxShadow: "inset 0 0 20px #000" }}>
        {[0, 1, 2].map((r) => (
          <div key={r} className="flex items-end gap-[3px] h-[28%] border-b-4" style={{ borderColor: "#7a5217" }}>
            {colors.map((c, i) => <div key={i} style={{ background: c, width: `${9 + ((i + r) % 3) * 2}%`, height: `${70 + ((i * 7 + r * 5) % 30)}%`, borderRadius: 2, boxShadow: "inset -2px 0 0 rgba(0,0,0,.3)" }} />)}
          </div>
        ))}
      </div>
      {flying && <div className="absolute top-2 left-2 text-3xl" style={{ animation: "bookFly 2.6s ease-in-out forwards" }}><span style={{ display: "inline-block", animation: "flap .3s infinite" }}>📖</span></div>}
    </div>
  );
}

/** Common hotel interior: wallpaper, wainscot, glossy floor */
export function HotelRoomShell({ wall = "#2a1452", floor = "#1a0d33", children, floorHeight = "26%" }: { wall?: string; floor?: string; children?: ReactNode; floorHeight?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 wallpaper" style={{ backgroundColor: wall }} />
      <div className="absolute left-0 right-0 wainscot" style={{ bottom: floorHeight, height: "14%" }} />
      <div className="absolute left-0 right-0 bottom-0 floor-gloss" style={{ height: floorHeight, background: `linear-gradient(180deg, ${floor}, #0b0620)` }} />
      {children}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(5,2,20,.7) 100%)", zIndex: 16 }} />
    </div>
  );
}

export function Burst({ count = 36, emojis = ["✨", "⭐", "🗝️", "📜", "💫"] }: { count?: number; emojis?: string[] }) {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => {
    const a = rand(i + 1) * Math.PI * 2; const d = 120 + rand(i + 2) * 320;
    return { e: emojis[i % emojis.length], bx: Math.cos(a) * d, by: Math.sin(a) * d - 120, delay: rand(i + 3) * 0.6, size: 18 + rand(i + 4) * 22 };
  }), [count, emojis]);
  return (
    <div className="absolute left-1/2 top-1/2 pointer-events-none" style={{ zIndex: 40 }}>
      {items.map((p, i) => (
        <span key={i} className="absolute" style={{ fontSize: p.size, animation: `burst 2.2s ease-out ${p.delay}s both`, ["--bx" as string]: `${p.bx}px`, ["--by" as string]: `${p.by}px` } as CSSProperties}>{p.e}</span>
      ))}
    </div>
  );
}
