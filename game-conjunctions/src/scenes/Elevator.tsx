import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Hero from "../components/Hero";
import { Dust, Runes } from "../components/Scenery";
import { Keypad, speak } from "../components/UI";
import { sfx } from "../audio";
import { FINAL_CODE, ROOMS, WORD_INFO } from "../data";
import type { Progress } from "../store";

function useTimeline() {
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };
}
export { useTimeline };

const doorPanel = (side: "l" | "r"): CSSProperties => ({
  background: `linear-gradient(${side === "l" ? 90 : 270}deg, #6b4612, #d4a445 40%, #f7dc8a 55%, #a87628)`,
  boxShadow: "inset 0 0 20px rgba(0,0,0,.45)",
});

function DecoPattern() {
  return (
    <svg viewBox="0 0 50 200" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-60">
      <path d="M25 20 L45 60 L25 100 L5 60 Z M25 100 L45 140 L25 180 L5 140 Z" fill="none" stroke="#5a3a0a" strokeWidth="2" />
      <circle cx="25" cy="60" r="6" fill="#3b1f6e" stroke="#fff0b3" />
      <circle cx="25" cy="140" r="6" fill="#3b1f6e" stroke="#fff0b3" />
    </svg>
  );
}

/** Brass elevator door seen from the lobby / corridor */
export function ElevatorDoor({ open, lit, gears, className = "", style, slow }: { open?: boolean; lit?: boolean; gears?: boolean; className?: string; style?: CSSProperties; slow?: boolean }) {
  const t = slow ? "2.4s" : "1.2s";
  return (
    <div className={`absolute ${className}`} style={{ zIndex: 8, ...style }}>
      {/* eye gem */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-[14%] w-[34%] aspect-[2/1] flex items-center justify-center rounded-t-full" style={{ background: "linear-gradient(180deg,#e8c068,#7a5217)", border: "3px solid #fff0b3" }}>
        <div className={`w-[42%] aspect-square rounded-full flex items-center justify-center ${lit ? "anim-turq" : ""}`} style={{ background: "radial-gradient(circle,#b8fff7,#3ee8d8 50%,#0c6b64)", boxShadow: "0 0 20px #3ee8d8" }}>
          <div className="w-[35%] aspect-square rounded-full bg-[#0b0620]" style={{ animation: "eyes 5s ease-in-out infinite" }} />
        </div>
      </div>
      {/* frame */}
      <div className="absolute inset-0 rounded-t-[40%] p-[6%]" style={{ background: "linear-gradient(90deg,#7a5217,#f2c95c,#7a5217)", boxShadow: lit ? "0 0 50px rgba(62,232,216,.8), 0 0 0 4px #3b1f6e" : "0 0 30px rgba(242,201,92,.35), 0 0 0 4px #3b1f6e" }}>
        <div className="relative w-full h-full rounded-t-[38%] overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 30%, #ffe3a8, #c88a3a 50%, #3b1f10)" }}>
          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden" style={{ ...doorPanel("l"), transition: `transform ${t} ease-in-out`, transform: open ? "translateX(-100%)" : "none" }}><DecoPattern /></div>
          <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden" style={{ ...doorPanel("r"), transition: `transform ${t} ease-in-out`, transform: open ? "translateX(100%)" : "none" }}><DecoPattern /></div>
        </div>
      </div>
      {/* runes around */}
      {lit && ["ᚠ", "ᛟ", "✦", "ᚱ", "ᛉ", "☽"].map((r, i) => (
        <span key={i} className="rune anim-pop" style={{ fontSize: 22, left: i < 3 ? "-18%" : "106%", top: `${15 + (i % 3) * 28}%`, animation: "none", opacity: 1 }}>{r}</span>
      ))}
      {gears && (<>
        <div className="absolute -left-[22%] bottom-[4%] text-4xl" style={{ animation: "gearSpin 1.5s linear infinite" }}>⚙️</div>
        <div className="absolute -right-[22%] bottom-[14%] text-3xl" style={{ animation: "gearSpin 1.2s linear infinite reverse" }}>⚙️</div>
      </>)}
    </div>
  );
}

/** interior of the elevator */
function Interior({ floor, dark, gold, doorsOpen, slow, shadows, runes, children, flicker }: { floor: string; dark?: boolean; gold?: boolean; doorsOpen?: boolean; slow?: boolean; shadows?: boolean; runes?: boolean; children?: ReactNode; flicker?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(90deg,#3d0f24,#6e1a3d 20%,#5a1633 80%,#3d0f24)" }}>
      {/* wood panels */}
      <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 3px, transparent 3px 120px)" }} />
      <div className="absolute inset-x-0 top-0 h-[10%] brass opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-[16%]" style={{ background: "repeating-linear-gradient(45deg,#2a1020 0 20px,#3b1f30 20px 40px)", borderTop: "5px solid #c8952e" }} />
      {/* floor indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[11%] w-[min(40vw,220px)] aspect-[2/1] rounded-t-full flex items-end justify-center pb-2" style={{ background: "linear-gradient(180deg,#f2c95c,#7a5217)", border: "3px solid #fff0b3", zIndex: 9 }}>
        <div key={floor} className="cinzel text-3xl sm:text-5xl font-extrabold px-4 rounded-lg" style={{ background: "#0b0620", color: gold ? "#f2c95c" : "#3ee8d8", textShadow: `0 0 14px ${gold ? "#f2c95c" : "#3ee8d8"}`, animation: "ledFloor .3s ease-out" }}>{floor}</div>
      </div>
      {/* doors (back) */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[16%] w-[min(56vw,420px)] h-[56%] overflow-hidden rounded-t-xl" style={{ border: "6px solid #c8952e", background: "radial-gradient(ellipse at 50% 40%, #b9a3ff, #3b1f6e 60%, #140c2e)", zIndex: 5 }}>
        {doorsOpen && <div className="absolute inset-0 flex items-end justify-center pb-6 text-5xl anim-fadeIn">🕯️ ✨ 🚪 ✨ 🕯️</div>}
        {(["l", "r"] as const).map((s) => (
          <div key={s} className={`absolute inset-y-0 ${s === "l" ? "left-0" : "right-0"} w-1/2`} style={{ ...doorPanel(s), transition: `transform ${slow ? 2.6 : 1.2}s ease-in-out`, transform: doorsOpen ? `translateX(${s === "l" ? -100 : 100}%)` : "none" }}>
            <div className="absolute top-[12%] inset-x-[18%] h-[34%] rounded-t-full overflow-hidden" style={{ background: "linear-gradient(180deg,#2a1a5e,#4a2590)", border: "3px solid #5a3a0a" }}>
              {shadows && <div className="absolute top-[20%] w-10 h-16 rounded-t-full bg-black/80" style={{ animation: `shadowPass 1.4s linear ${s === "l" ? 0 : 0.6}s 2` }} />}
            </div>
            <DecoPattern />
          </div>
        ))}
      </div>
      {runes && <Runes count={10} area={{ top: 10, bottom: 70 }} />}
      {children}
      {dark && <div className="absolute inset-0 transition-opacity duration-500" style={{ background: "rgba(3,1,12,.9)", zIndex: 25 }} />}
      {gold && <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(242,201,92,.35), rgba(185,120,255,.25) 60%, transparent)", zIndex: 24, animation: "twinkle 1.2s ease-in-out infinite" }} />}
      {flicker && <div className="absolute inset-0 bg-black pointer-events-none" style={{ zIndex: 26, animation: "candlesOut 0.9s linear 1 forwards" }} />}
      <Dust count={14} />
    </div>
  );
}

function Panel({ lit, extra13, onPress13, shake, locks }: { lit?: number; extra13?: boolean; onPress13?: () => void; shake?: boolean; locks?: boolean[] }) {
  return (
    <div className={`absolute right-[4%] sm:right-[8%] top-[30%] w-[min(22vw,130px)] rounded-2xl p-2 flex flex-col items-center gap-2 ${shake ? "anim-panelShake" : ""}`} style={{ background: "linear-gradient(180deg,#e8c068,#8a5b12)", border: "3px solid #fff0b3", boxShadow: "0 10px 30px rgba(0,0,0,.5)", zIndex: 30 }}>
      {locks && (
        <div className="grid grid-cols-2 gap-1 w-full">
          {locks.map((l, i) => <div key={i} className="aspect-square rounded-md flex items-center justify-center text-lg" style={{ background: "#2a1020", border: `2px solid ${l ? WORD_INFO[ROOMS[i].word].color : "#5a3a0a"}`, boxShadow: l ? `0 0 12px ${WORD_INFO[ROOMS[i].word].color}` : undefined }}>{l ? "🗝️" : "🔒"}</div>)}
        </div>
      )}
      {extra13 && (
        <button onClick={onPress13} className="w-full rounded-xl py-2 anim-pop anim-glow" style={{ background: "radial-gradient(circle,#fff3c4,#f2c95c 50%,#7a3fd6)", border: "3px solid #fff" }}>
          <div className="cinzel text-2xl font-extrabold text-[#3b1f6e]">✨13✨</div>
          <div className="cinzel text-[9px] sm:text-[11px] font-bold text-[#3b1f6e]">SECRET SUITE</div>
        </button>
      )}
      {[4, 3, 2, 1].map((n) => (
        <div key={n} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cinzel font-extrabold text-xl" style={{ background: lit === n ? "radial-gradient(circle,#b8fff7,#3ee8d8)" : "radial-gradient(circle,#fff3c4,#c8952e)", color: "#3b1f6e", border: "2px solid #5a3a0a", boxShadow: lit === n ? "0 0 16px #3ee8d8" : "inset 0 -3px 0 rgba(0,0,0,.3)" }}>{n}</div>
      ))}
    </div>
  );
}

/* ---------------- first ride ---------------- */
export function ElevatorRide({ onArrive }: { onArrive: () => void }) {
  const at = useTimeline();
  const [floor, setFloor] = useState("L");
  const [lit, setLit] = useState<number | undefined>();
  const [pose, setPose] = useState<"reach" | "look" | "surprise" | "idle">("idle");
  const [fx, setFx] = useState({ flicker: false, shadows: false, runes: false, open: false });
  useEffect(() => {
    at(500, () => { setPose("reach"); sfx("beep"); setLit(4); });
    at(1200, () => { setPose("look"); sfx("gears"); });
    at(1800, () => setFloor("1"));
    at(2300, () => { setFx((f) => ({ ...f, flicker: true })); sfx("tick"); });
    at(2900, () => setFloor("2"));
    at(3300, () => { setFx((f) => ({ ...f, shadows: true })); sfx("whoosh"); setPose("surprise"); });
    at(4000, () => { setFloor("3"); setFx((f) => ({ ...f, runes: true })); sfx("rune"); setPose("look"); });
    at(5100, () => setFloor("4"));
    at(5600, () => { sfx("elevator"); setFx((f) => ({ ...f, open: true })); setPose("idle"); });
  }, []);
  return (
    <Interior floor={floor} doorsOpen={fx.open} flicker={fx.flicker} shadows={fx.shadows} runes={fx.runes}>
      <Panel lit={lit} />
      <Hero x={40} bottom="10%" pose={pose} holding="card" size="clamp(170px,40vh,360px)" />
      {fx.open && (
        <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 z-40 anim-fadeUp">
          <button onClick={() => { sfx("sparkle"); onArrive(); }} className="btn-gold rounded-2xl px-6 py-3 text-lg sm:text-xl">اخرجي إلى الممر السحري 🚪</button>
        </div>
      )}
    </Interior>
  );
}

/* ---------------- secret floor 13 ---------------- */
export function SecretElevator({ p, onArrive }: { p: Progress; onArrive: () => void }) {
  const at = useTimeline();
  const [phase, setPhase] = useState<"in" | "dark" | "glow" | "fly" | "found" | "code" | "up" | "arrive" | "open">("in");
  const [flown, setFlown] = useState([false, false, false, false]);
  const [floor, setFloor] = useState("4");
  useEffect(() => {
    at(1300, () => { setPhase("dark"); sfx("thump"); });
    at(1900, () => sfx("tick")); at(2700, () => sfx("tick"));
    at(3500, () => { setPhase("glow"); sfx("rune"); });
    at(4600, () => setPhase("fly"));
    [0, 1, 2, 3].forEach((i) => at(5100 + i * 420, () => { setFlown((f) => f.map((v, j) => (j === i ? true : v))); sfx("click"); }));
    at(7200, () => { setPhase("found"); sfx("thunder"); window.setTimeout(() => { sfx("sparkle"); speak("You found the hidden floor."); }, 700); });
  }, []);
  const startAscend = () => {
    setPhase("up");
    const floors = ["5", "6", "7", "8", "9", "10", "11", "12"];
    floors.forEach((f, i) => at(600 + i * 520, () => { setFloor(f); sfx("tick"); }));
    const t = 600 + floors.length * 520;
    at(t, () => setFloor("…"));
    at(t + 1400, () => { setFloor("13"); sfx("elevator"); setPhase("arrive"); });
    at(t + 2600, () => { setPhase("open"); sfx("creak"); });
  };
  const keyColors = ROOMS.map((r) => WORD_INFO[r.word].color);
  const lockPos = [[80, 34], [88, 34], [80, 42], [88, 42]];
  return (
    <Interior floor={floor} dark={phase === "dark" || phase === "glow" || phase === "fly"} gold={phase === "up" || phase === "arrive" || phase === "open"} doorsOpen={phase === "open"} slow runes={phase === "found" || phase === "up"}>
      <Panel lit={phase === "in" ? 4 : undefined} extra13={["found", "code"].includes(phase)} onPress13={() => { sfx("ding"); setPhase("code"); }} shake={phase === "found"} locks={phase === "in" ? undefined : flown} />
      <Hero x={36} bottom="10%" pose={phase === "dark" ? "look" : phase === "glow" || phase === "fly" ? "hold" : phase === "found" ? "surprise" : phase === "open" ? "happy" : "idle"} holding={phase === "fly" || flown.some(Boolean) ? null : "keys"} size="clamp(170px,40vh,360px)" style={{ zIndex: 27, filter: phase === "glow" ? "drop-shadow(0 0 20px #f2c95c)" : undefined }} />
      {(phase === "glow" || phase === "fly") && <div className="absolute z-[28] rounded-full anim-glow" style={{ left: "38%", top: "46%", width: 90, height: 90, background: "radial-gradient(circle,rgba(242,201,92,.9),transparent 70%)" }} />}
      {phase === "fly" && keyColors.map((c, i) => (
        <span key={i} className="absolute z-[31] text-3xl" style={{ left: flown[i] ? `${lockPos[i][0]}%` : "40%", top: flown[i] ? `${lockPos[i][1]}%` : "52%", transition: "left .6s ease-in, top .6s ease-in, transform .6s", transform: flown[i] ? "scale(.6) rotate(360deg)" : "none", filter: `drop-shadow(0 0 10px ${c})`, opacity: flown[i] ? 0 : 1 }}>🗝️</span>
      ))}
      {phase === "dark" && <div className="absolute inset-0 z-[29] flex items-center justify-center cinzel text-3xl text-violet-200/80 tracking-[.4em] anim-fadeIn" dir="ltr">TICK… TICK…</div>}
      {phase === "found" && (
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-40 glass rounded-2xl px-5 py-3 text-center anim-pop">
          <div className="text-lg sm:text-xl font-extrabold text-amber-100">ظهر زر لم يكن موجودًا! 👀</div>
          <div className="text-violet-100">اضغطي الزر السحري <b className="cinzel">13</b></div>
        </div>
      )}
      {phase === "code" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 anim-fadeIn p-2">
          <Keypad title="FINAL ACCESS CODE" code={FINAL_CODE} subtitle="استخدمي الأرقام التي اكتشفتِها داخل الغرف." errorText="راجعي الرموز التي جمعتِها 🔮"
            hint={<div className="flex justify-center gap-1.5" dir="ltr">{p.digits.map((d, i) => <span key={i} className="flex flex-col items-center rounded-lg px-2 py-1" style={{ background: "rgba(20,10,50,.7)", border: `1.5px solid ${keyColors[i]}` }}><span className="text-xs">{WORD_INFO[ROOMS[i].word].icon}</span><span className="cinzel text-xl font-extrabold" style={{ color: keyColors[i] }}>{d}</span></span>)}</div>}
            onSuccess={() => startAscend()} />
        </div>
      )}
      {phase === "open" && (
        <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 z-40 anim-fadeUp">
          <button onClick={() => { sfx("sparkle"); onArrive(); }} className="btn-gold rounded-2xl px-6 py-3 text-lg sm:text-xl">ادخلي الجناح السري 👁️✨</button>
        </div>
      )}
    </Interior>
  );
}
