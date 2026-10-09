import { useEffect, useState, type CSSProperties } from "react";
import Hero, { type Pose } from "../components/Hero";
import { Burst, Candle, Dust, Fog, Runes } from "../components/Scenery";
import { speak, Strategy, WordBadge } from "../components/UI";
import QuestionView from "../engine/Questions";
import { sfx } from "../audio";
import { FINAL, ROOMS, WORD_INFO, type Word } from "../data";
import type { Progress } from "../store";
import { useTimeline } from "./Elevator";

const WORDS: Word[] = ["AND", "BUT", "BECAUSE", "WHEN"];

function SuiteBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 30%, #5a2f9e 0%, #2a1452 45%, #0b0620 100%)" }}>
      {/* stars ceiling */}
      {[...Array(40)].map((_, i) => <span key={i} className="absolute rounded-full bg-amber-100 anim-twinkle" style={{ width: 2, height: 2, left: `${(i * 41) % 100}%`, top: `${(i * 17) % 40}%`, animationDelay: `${(i % 6) * 0.5}s` }} />)}
      {/* floating doors */}
      {[[8, 18, "#2f7f86"], [84, 14, "#6e1a3d"], [72, 44, "#3b1f6e"], [14, 50, "#7a5217"]].map(([l, t, c], i) => (
        <div key={i} className="absolute w-[6%] min-w-[34px] aspect-[1/2] rounded-t-full anim-floatR" style={{ left: `${l}%`, top: `${t}%`, background: `linear-gradient(135deg,${c},#140c2e)`, border: "3px solid #f2c95c", animationDelay: `${-i * 1.5}s`, boxShadow: "0 0 20px rgba(242,201,92,.4)" }}>
          <div className="absolute right-[18%] top-1/2 w-1.5 h-1.5 rounded-full bg-amber-300" />
        </div>
      ))}
      {/* handless clocks */}
      {[[28, 10], [64, 8], [90, 36]].map(([l, t], i) => (
        <div key={i} className="absolute w-10 h-10 sm:w-14 sm:h-14 rounded-full anim-float" style={{ left: `${l}%`, top: `${t}%`, background: "#f7ecd4", border: "4px solid #9fb8ff", opacity: 0.8, animationDelay: `${-i}s` }}>
          {[...Array(12)].map((_, k) => <span key={k} className="absolute left-1/2 top-1/2 w-0.5 h-1.5 bg-[#3b1f6e]" style={{ transform: `rotate(${k * 30}deg) translateY(-160%)` }} />)}
        </div>
      ))}
      {/* floating books & mirrors */}
      {[["📚", 40, 14], ["📖", 56, 22], ["🪞", 4, 34], ["📜", 94, 58], ["🕯️", 36, 40]].map(([e, l, t], i) => (
        <span key={i} className="absolute text-3xl sm:text-4xl anim-floatR" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${-i * 1.2}s`, filter: "drop-shadow(0 0 10px rgba(185,163,255,.8))" }}>{e}</span>
      ))}
      <Candle style={{ left: "22%", top: "30%" }} purple /><Candle style={{ right: "24%", top: "26%", animationDelay: "-2s" }} />
      <Candle style={{ left: "48%", top: "6%", animationDelay: "-1s" }} purple /><Candle style={{ right: "8%", top: "70%", animationDelay: "-3s" }} />
      <Runes count={12} area={{ top: 5, bottom: 70 }} />
      {/* glossy floor */}
      <div className="absolute inset-x-0 bottom-0 h-[26%]" style={{ background: "linear-gradient(180deg, rgba(185,163,255,.35), #1b0f33 30%, #0b0620)", borderTop: "2px solid rgba(242,201,92,.6)" }}>
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(90deg, rgba(242,201,92,.08) 0 2px, transparent 2px 70px)" }} />
        <div className="absolute inset-0 shimmer opacity-20" />
      </div>
      <Fog /><Dust count={34} />
    </div>
  );
}

export function Chest({ lit, open, keysIn }: { lit: number; open?: boolean; keysIn?: boolean }) {
  const all = lit >= 6;
  return (
    <div className="relative w-full h-full" style={{ filter: all ? "drop-shadow(0 0 30px #f2c95c)" : "drop-shadow(0 10px 20px rgba(0,0,0,.6))" }}>
      {/* lid */}
      <div className="absolute inset-x-0 top-0 h-[38%] rounded-t-[50%] origin-bottom" style={{ background: "linear-gradient(180deg,#8a3d7a,#4a1a4e)", border: "4px solid #f2c95c", animation: open ? "lidOpen 2.2s ease-in-out forwards" : undefined, transformOrigin: "50% 100%", zIndex: 2 }}>
        <div className="absolute inset-x-[46%] inset-y-0 bg-[#f2c95c]" />
        <div className="absolute inset-0 flex items-center justify-center cinzel text-[9px] sm:text-xs font-extrabold text-amber-200 tracking-wider" dir="ltr">THE FOUR SECRETS</div>
      </div>
      {open && <div className="absolute inset-x-[10%] top-[20%] h-[30%] rounded-full" style={{ background: "radial-gradient(ellipse,#fff3c4,rgba(242,201,92,0) 70%)", animation: "fadeIn 1s 1s both" }} />}
      {/* body */}
      <div className="absolute inset-x-0 bottom-0 h-[64%] rounded-b-xl" style={{ background: "linear-gradient(180deg,#6e1a3d,#3d0f24)", border: "4px solid #f2c95c" }}>
        <div className="absolute inset-y-0 left-[46%] right-[46%] bg-[#f2c95c]" />
        <div className="absolute inset-x-[6%] top-[10%] flex justify-between" dir="ltr">
          {WORDS.map((w, i) => (
            <span key={w} className="w-[20%] aspect-square rounded-full flex items-center justify-center text-sm sm:text-xl transition-all duration-700" style={{ background: lit > i ? `radial-gradient(circle,#fff,${WORD_INFO[w].color})` : "#2a0f1c", border: `2px solid ${lit > i ? "#fff" : "#7a5217"}`, boxShadow: lit > i ? `0 0 16px ${WORD_INFO[w].color}` : undefined, opacity: lit > i ? 1 : 0.55 }}>{WORD_INFO[w].icon}</span>
          ))}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[12%] w-[22%] aspect-[4/5] rounded-lg flex items-center justify-center text-lg sm:text-2xl transition-all duration-700" style={{ background: lit >= 5 ? "radial-gradient(circle,#fff3c4,#f2c95c)" : "#7a5217", border: "2px solid #fff0b3", boxShadow: lit >= 5 ? "0 0 22px #f2c95c" : undefined }}>{open || keysIn ? "🔓" : "🔒"}</div>
      </div>
    </div>
  );
}

function Stones() {
  return (
    <>
      {WORDS.map((w, i) => (
        <div key={w} className="absolute w-10 h-10 sm:w-14 sm:h-14 rounded-2xl rotate-45 flex items-center justify-center anim-float" style={{ left: `${[6, 24, 70, 88][i]}%`, bottom: `${[40, 62, 62, 40][i]}%`, background: `radial-gradient(circle,#fff,${WORD_INFO[w].color} 60%)`, boxShadow: `0 0 26px ${WORD_INFO[w].color}`, animationDelay: `${-i * 0.8}s`, zIndex: 6 }}>
          <span className="-rotate-45 text-lg sm:text-2xl">{WORD_INFO[w].icon}</span>
        </div>
      ))}
    </>
  );
}

export default function Suite({ p, onStep, onSolved, onFinish }: { p: Progress; onStep: (s: number) => void; onSolved: (id: string, first: boolean) => void; onFinish: () => void }) {
  const at = useTimeline();
  const step = p.suiteStep;
  const [pose, setPose] = useState<Pose>("walk");
  const [x, setX] = useState(8);
  const [lit, setLit] = useState(step);
  const [fin, setFin] = useState<"none" | "orbit" | "click" | "open" | "card">(step >= FINAL.length ? "orbit" : "none");

  useEffect(() => {
    at(60, () => setX(20));
    at(1900, () => setPose("look"));
    if (step === 0) at(800, () => speak("Welcome to the Secret Suite."));
  }, []);

  useEffect(() => {
    if (fin !== "orbit") return;
    setLit(6); setPose("surprise"); sfx("rune");
    at(2400, () => { setFin("click"); [0, 1, 2, 3].forEach((i) => at(i * 300, () => sfx("click"))); });
    at(3900, () => { setFin("open"); sfx("creak"); at(900, () => sfx("finale")); setPose("happy"); });
    at(6800, () => { setFin("card"); sfx("sparkle"); speak("Congratulations! You are the master of the four secrets."); });
  }, [fin]);

  const q = FINAL[Math.min(step, FINAL.length - 1)];
  const solved = (first: boolean) => {
    onSolved(q.id, first);
    setLit(step + 1); sfx(step + 1 >= 5 ? "keyLock" : "rune");
    setPose("happy"); at(1600, () => setPose("idle"));
  };
  const next = () => {
    const n = step + 1; onStep(n);
    if (n >= FINAL.length) setFin("orbit");
  };
  const finale = fin !== "none";

  return (
    <div className="absolute inset-0">
      <SuiteBackdrop />
      {!finale ? (
        <div className="absolute inset-0 pt-[92px] md:pt-[76px] flex flex-col lg:flex-row" style={{ zIndex: 20 }}>
          <div className="relative h-[32vh] sm:h-[36vh] lg:h-auto lg:w-[42%] shrink-0">
            <div className="absolute top-1 inset-x-2 flex justify-center z-10">
              <div className="rounded-full px-4 py-1 font-extrabold text-amber-100 text-sm sm:text-lg" style={{ background: "rgba(20,10,50,.75)", border: "2px solid #f2c95c" }}>👁️ الجناح 13 <span className="cinzel text-xs opacity-80">THE SECRET SUITE</span></div>
            </div>
            <Stones />
            <div className="absolute left-[58%] -translate-x-1/2 bottom-[8%] w-[min(40vw,230px)] aspect-[5/4]"><Chest lit={lit} /></div>
            <Hero x={x} bottom="4%" size="clamp(110px,25vh,290px)" pose={pose} holding="keys" />
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scroll-thin px-2 pb-3 sm:px-4 lg:py-6 flex justify-center items-start lg:items-center">
            <div key={step} className="glass rounded-3xl p-3 sm:p-5 w-full max-w-2xl anim-fadeUp">
              <div className="flex items-center justify-between mb-2">
                <span className="cinzel text-amber-200 font-bold" dir="ltr">FINAL CHALLENGE {step + 1} / {FINAL.length}</span>
                <div className="flex gap-1" dir="ltr">{FINAL.map((_, i) => <span key={i} className="w-3 h-3 rounded-full" style={{ background: i < lit ? "#f2c95c" : "rgba(255,255,255,.2)", boxShadow: i < lit ? "0 0 8px #f2c95c" : undefined }} />)}</div>
              </div>
              {step === 0 && <div className="mb-3"><Strategy compact /></div>}
              <QuestionView q={q} theme="suite" onSolved={solved} onContinue={next} />
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 pt-[70px] flex flex-col items-center justify-center" style={{ zIndex: 20 }}>
          <Stones />
          <div className="relative w-[min(70vw,340px)] aspect-[5/4] mt-[8vh]">
            <Chest lit={6} open={fin === "open" || fin === "card"} keysIn={fin !== "orbit"} />
            {fin === "orbit" && ROOMS.map((r, i) => (
              <span key={r.id} className="absolute left-1/2 top-1/2 -ml-4 -mt-4 text-3xl" style={{ animation: `orbit 2.2s linear infinite`, animationDelay: `${-i * 0.55}s`, ["--r" as string]: "min(38vw,190px)", filter: `drop-shadow(0 0 10px ${WORD_INFO[r.word].color})` } as CSSProperties}>🗝️</span>
            ))}
            {fin === "click" && <div className="absolute inset-x-0 -top-10 text-center cinzel text-3xl text-amber-200 anim-pop" dir="ltr">CLICK!</div>}
            {(fin === "open" || fin === "card") && <Burst count={44} />}
          </div>
          <Hero x={18} bottom="4%" size="clamp(110px,25vh,280px)" pose={pose} holding={fin === "orbit" ? "keys" : null} />
          {fin === "card" && (
            <div className="absolute inset-0 z-40 flex items-center justify-center p-3 overflow-y-auto">
              <div className="anim-rise w-[min(94vw,520px)] rounded-3xl p-5 text-center my-auto" style={{ background: "linear-gradient(160deg,#fff3c4,#f2c95c 40%,#c8952e)", border: "4px solid #fff", boxShadow: "0 0 80px rgba(242,201,92,.9), 0 0 0 6px #3b1f6e" }}>
                <div className="text-4xl">🏆✨</div>
                <div className="magic-title text-xl sm:text-3xl font-black text-[#3b1f6e]">MASTER OF THE FOUR SECRETS</div>
                <div className="text-2xl sm:text-3xl font-black text-[#6e1a3d] mt-2">أحسنتِ يا {p.name}! ✨</div>
                <div className="text-lg font-bold text-[#3b1f6e]">اكتشفتِ أسرار الفندق الأربعة.</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {WORDS.map((w) => <div key={w} className="rounded-xl bg-[#1b0f33] py-2 flex items-center justify-center gap-2"><WordBadge w={w} /><span className="text-amber-100 font-bold">{WORD_INFO[w].ar}</span></div>)}
                </div>
                <button onClick={() => { sfx("finale"); onFinish(); }} className="mt-4 rounded-2xl px-6 py-3 text-xl font-extrabold text-amber-100" style={{ background: "linear-gradient(180deg,#5a2f9e,#3b1f6e)", border: "2px solid #fff3c4" }}>استلمي شهادتكِ 🏆</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
