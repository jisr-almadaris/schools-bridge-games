import { useEffect, useState, type ReactNode } from "react";
import Hero, { type Pose } from "../components/Hero";
import { Candle, Dust, Fog, GrandClock, HotelRoomShell, Mirror, NightWindow, Runes } from "../components/Scenery";
import { SecretTip, Strategy, WordBadge } from "../components/UI";
import QuestionView, { type Theme } from "../engine/Questions";
import { sfx } from "../audio";
import { ROOMS, WORD_INFO, type RoomDef } from "../data";
import type { Progress } from "../store";
import { useTimeline } from "./Elevator";

type Fx = "none" | "solved" | "effect" | "box" | "revealed";
const THEME: Record<RoomDef["id"], Theme> = { mirror: "mirror", storm: "storm", secret: "drawer", time: "clock" };

/* ---------------- backdrops ---------------- */
function Backdrop({ room, fx, children }: { room: RoomDef; fx: Fx; children?: ReactNode }) {
  if (room.id === "mirror") return (
    <HotelRoomShell wall="#1f3a5e" floor="#1a2a4a">
      {[8, 26, 74, 92].map((l, i) => <Mirror key={i} className="absolute! hidden sm:block" style={{ position: "absolute", left: `${l}%`, top: `${14 + (i % 2) * 6}%`, width: "7%", height: "22%", transform: "translateX(-50%)" }} />)}
      <Candle style={{ left: "18%", top: "44%" }} purple /><Candle style={{ right: "18%", top: "40%", animationDelay: "-2s" }} />
      <Runes count={8} />
      {children}<Fog /><Dust color="#b9e8ff" />
    </HotelRoomShell>
  );
  if (room.id === "storm") return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1/2" style={{ background: "linear-gradient(180deg,#ffb84d 0%,#e0664a 45%,#6e1a3d 100%)" }}>
        <div className="absolute left-[20%] top-[14%] w-[22vmin] aspect-square rounded-full anim-spin" style={{ background: "radial-gradient(circle,#fff6c9,#ffd35c 50%,rgba(255,211,92,0) 70%)", animationDuration: "30s" }} />
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2" style={{ background: "linear-gradient(180deg,#1b1440 0%,#2a2a5e 50%,#140c2e 100%)" }}>
        {[...Array(26)].map((_, i) => <span key={i} className="absolute w-px bg-blue-200/50" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 60}%`, height: 30, animation: `dust ${0.8 + (i % 4) * 0.2}s linear infinite reverse`, transform: "rotate(12deg)" }} />)}
        <div className="absolute right-[14%] top-[8%] text-6xl opacity-80">🌧️</div>
        <NightWindow className="right-[6%] top-[26%] w-[24%] h-[30%] hidden sm:block" flashDelay={1} />
      </div>
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2" style={{ background: "linear-gradient(180deg,transparent,#ffd35c,transparent)", boxShadow: "0 0 20px #ffd35c" }} />
      <div className="absolute inset-x-0 bottom-0 h-[24%] floor-gloss" />
      <div className="lightning-flash" style={{ animation: "lightning 9s linear 2s infinite" }} />
      {fx === "effect" && <div className="lightning-flash" style={{ animation: "lightning 1.2s linear" }} />}
      {children}<Fog /><Dust count={14} />
    </div>
  );
  if (room.id === "secret") return (
    <HotelRoomShell wall="#1e0f33" floor="#140a24">
      <div className="absolute inset-x-[4%] top-[12%] h-[52%] grid grid-cols-8 gap-1.5 opacity-70">
        {[...Array(40)].map((_, i) => <div key={i} className="rounded-sm flex items-center justify-center" style={{ background: "linear-gradient(180deg,#5a2410,#3d180a)", border: "1px solid #7a5217" }}><span className="w-3 h-1 rounded-full bg-amber-400/70" /></div>)}
      </div>
      <div className="absolute inset-0 pointer-events-none transition-all duration-1000" style={{ background: fx !== "none" ? "radial-gradient(ellipse at 60% 30%, rgba(255,207,122,.35), transparent 70%)" : "radial-gradient(ellipse at 60% 20%, rgba(255,207,122,.22), rgba(5,2,20,.55) 55%)", zIndex: 5 }} />
      <div className="absolute left-[60%] top-0 flex flex-col items-center z-10">
        <div className="w-0.5 h-[10vh] bg-amber-700" />
        <div className="w-16 h-8 rounded-t-full" style={{ background: "linear-gradient(180deg,#c8952e,#7a5217)" }} />
        <div className="w-6 h-6 rounded-full -mt-2" style={{ background: "#fff3c4", boxShadow: "0 0 40px 20px rgba(255,207,122,.6)" }} />
      </div>
      <Runes count={6} />
      {children}<Fog /><Dust color="#ff9fd0" count={18} />
    </HotelRoomShell>
  );
  return (
    <HotelRoomShell wall="#1b2350" floor="#141a3a">
      {[[6, 14, 60], [88, 12, 50], [16, 52, 44], [80, 48, 70], [48, 8, 40]].map(([l, t, s], i) => (
        <div key={i} className={`absolute text-amber-400/70 ${i % 2 ? "anim-spinRev" : "anim-spin"}`} style={{ left: `${l}%`, top: `${t}%`, fontSize: s }}>⚙️</div>
      ))}
      {[[22, 18], [70, 22], [36, 30]].map(([l, t], i) => (
        <div key={i} className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full hidden sm:block" style={{ left: `${l}%`, top: `${t}%`, background: "#f7ecd4", border: "4px solid #9fb8ff" }}>
          <div className="absolute left-1/2 top-1/2 w-0.5 h-[40%] bg-[#3b1f6e] origin-top anim-spin" style={{ animationDuration: `${3 + i}s` }} />
        </div>
      ))}
      <Runes count={6} />
      {children}<Fog /><Dust color="#9fb8ff" count={18} />
    </HotelRoomShell>
  );
}

/* ---------------- stage props per room ---------------- */
function StageProp({ room, fx, onOpen }: { room: RoomDef; fx: Fx; onOpen: () => void }) {
  const orb = (
    <button onClick={onOpen} className="absolute left-1/2 -translate-x-1/2 top-[30%] w-[min(22vw,110px)] aspect-square rounded-full anim-pop anim-glow z-20 flex items-center justify-center text-4xl"
      style={{ background: `radial-gradient(circle,#fff,${WORD_INFO[room.word].color} 45%,rgba(0,0,0,0) 72%)` }}>🔮</button>
  );
  if (room.id === "mirror") return (
    <div className="absolute right-[4%] bottom-[6%] w-[58%] h-[82%] flex items-end justify-center gap-[4%]">
      {[0, 1].map((i) => (
        <Mirror key={i} shake={fx === "solved" || fx === "effect"} className="w-[42%] h-[88%] transition-transform duration-700" style={{ transform: fx === "solved" ? `translateX(${i ? -12 : 12}%)` : undefined }}>
          <div className="text-4xl sm:text-5xl anim-float">{i ? "🎾" : "🏊‍♀️"}</div>
          {i === 1 && (fx === "effect" || fx === "box" || fx === "revealed") && (
            <svg viewBox="0 0 100 160" className="absolute inset-0 w-full h-full pointer-events-none"><path d="M50 20 L42 60 L58 80 L40 120 L52 150 M42 60 L20 70 M58 80 L85 90 M40 120 L22 135" stroke="#fff" strokeWidth="2.5" fill="none" strokeDasharray="300" style={{ animation: "crack 1s ease-out forwards" }} /></svg>
          )}
          {i === 1 && fx === "box" && <button onClick={onOpen} className="absolute bottom-[12%] text-5xl anim-pop anim-glow z-20">🎁</button>}
        </Mirror>
      ))}
      {fx === "revealed" && orb}
    </div>
  );
  if (room.id === "storm") return (
    <div className="absolute right-[6%] bottom-[8%] w-[54%] h-[76%]">
      <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg,#4a1a2e,#2a0f1c)", border: "5px solid #ffd35c" }}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl" style={{ background: "radial-gradient(circle,#ffd35c,#6e1a3d 70%)" }}>
          {fx === "box" && <button onClick={onOpen} className="anim-pop anim-glow">⚡</button>}
        </div>
        <div className="absolute inset-y-0 left-0 w-1/2 transition-transform duration-1000 flex items-center justify-center text-5xl" style={{ background: "linear-gradient(90deg,#6e1a3d,#4a1a2e)", borderRight: "2px solid #ffd35c", transform: fx === "box" || fx === "revealed" ? "translateX(-100%)" : "none" }}>☀️</div>
        <div className="absolute inset-y-0 right-0 w-1/2 transition-transform duration-1000 flex items-center justify-center text-5xl" style={{ background: "linear-gradient(270deg,#2a2a5e,#1b1440)", borderLeft: "2px solid #ffd35c", transform: fx === "box" || fx === "revealed" ? "translateX(100%)" : "none" }}>🌧️</div>
      </div>
      {fx === "revealed" && orb}
    </div>
  );
  if (room.id === "secret") return (
    <div className="absolute right-[6%] bottom-[8%] w-[54%] h-[70%] flex items-end justify-center">
      <div className="relative w-[80%] h-[45%] rounded-t-lg" style={{ background: "linear-gradient(180deg,#5a2410,#3d180a)", border: "3px solid #c8952e" }}>
        <div className="absolute -top-[60%] left-1/2 -translate-x-1/2 w-[80%] aspect-[2/1] flex" style={{ perspective: 600 }}>
          <div className="w-1/2 h-full rounded-l-md" style={{ background: "#f7ecd4", border: "3px solid #6e1a3d", transformOrigin: "100% 50%", transition: "transform 1.2s", transform: fx === "effect" || fx === "box" || fx === "revealed" ? "rotateY(0)" : "rotateY(90deg)" }} />
          <div className="w-1/2 h-full rounded-r-md flex items-center justify-center text-3xl" style={{ background: fx === "none" || fx === "solved" ? "#6e1a3d" : "#f7ecd4", border: "3px solid #6e1a3d" }}>
            {fx === "box" ? <button onClick={onOpen} className="anim-pop anim-glow">✨</button> : fx === "none" || fx === "solved" ? "📕" : "📜"}
          </div>
        </div>
      </div>
      {fx === "revealed" && orb}
    </div>
  );
  return (
    <div className="absolute right-[10%] bottom-[6%] w-[36%] h-[88%]">
      <GrandClock className="inset-0" stopped={fx === "effect"} reverse={fx === "box"} />
      {fx === "effect" && <div className="absolute -top-2 inset-x-0 text-center cinzel text-lg text-blue-200 anim-fadeIn" dir="ltr">TICK... TICK... ...</div>}
      {fx === "box" && (
        <button onClick={onOpen} className="absolute left-1/2 -translate-x-1/2 top-[8%] w-[min(20vw,96px)] aspect-square rounded-full flex items-center justify-center text-4xl sm:text-5xl anim-pop anim-glow"
          style={{ zIndex: 30, background: "radial-gradient(circle,#fff,#9fb8ff 45%,rgba(159,184,255,0) 72%)" }}>✨</button>
      )}
      {fx === "revealed" && orb}
    </div>
  );
}

/* ---------------- main room ---------------- */
export default function Room({ p, index, onStep, onSolved, onReward, onExit }: { p: Progress; index: number; onStep: (s: number) => void; onSolved: (id: string, first: boolean) => void; onReward: () => void; onExit: () => void }) {
  const room = ROOMS[index];
  const at = useTimeline();
  const step = Math.min(p.roomStep, room.steps.length - 1);
  const cur = room.steps[step];
  const [fx, setFx] = useState<Fx>("none");
  const [pose, setPose] = useState<Pose>("walk");
  const [x, setX] = useState(6);

  useEffect(() => { at(60, () => setX(24)); at(1900, () => setPose("look")); sfx(room.id === "storm" ? "thunder" : room.id === "mirror" ? "mirror" : room.id === "time" ? "tick" : "book"); }, []);
  useEffect(() => { if (cur.kind !== "reward") setFx("none"); }, [step]);

  const solved = (id: string, first: boolean) => {
    onSolved(id, first);
    setPose("happy"); at(1800, () => setPose("idle"));
    if (cur.kind === "discover") {
      setFx("solved");
      sfx(room.id === "mirror" ? "mirror" : room.id === "storm" ? "thunder" : room.id === "time" ? "gears" : "rune");
    }
  };
  const next = () => onStep(step + 1);

  const startReward = () => {
    setFx("effect"); setPose("surprise");
    if (room.id === "mirror") sfx("crack");
    if (room.id === "storm") sfx("thunder");
    if (room.id === "secret") sfx("book");
    if (room.id === "time") { sfx("tick"); at(900, () => sfx("tick")); }
    at(room.id === "time" ? 2200 : 1500, () => { setFx("box"); setPose("look"); if (room.id === "time") sfx("gears"); if (room.id === "storm") sfx("drawer"); });
  };
  const openBox = () => { if (fx !== "box") return; sfx("rune"); at(300, () => sfx("sparkle")); setFx("revealed"); setPose("happy"); onReward(); };

  const info = WORD_INFO[room.word];
  const actionLabel = { mirror: "انظري إلى المرآة 🪞", storm: "المسي الجدار الغامض ⚡", secret: "اقتربي من الكتاب القديم 📖", time: "استمعي إلى الساعة ⏰" }[room.id];

  return (
    <div className="absolute inset-0">
      <Backdrop room={room} fx={fx} />
      <div className="absolute inset-0 pt-[92px] md:pt-[76px] flex flex-col lg:flex-row" style={{ zIndex: 20 }}>
        {/* stage */}
        <div className="relative h-[32vh] sm:h-[36vh] lg:h-auto lg:w-[42%] shrink-0">
          <div className="absolute top-1 right-2 left-2 lg:top-4 flex justify-center">
            <div className="rounded-full px-4 py-1 text-center font-extrabold text-amber-100 text-sm sm:text-lg" style={{ background: "rgba(20,10,50,.75)", border: `2px solid ${info.color}` }}>{room.icon} {room.nameAr} <span className="en text-xs opacity-70">{room.nameEn}</span></div>
          </div>
          <StageProp room={room} fx={cur.kind === "reward" ? fx : fx === "solved" ? "solved" : "none"} onOpen={openBox} />
          <Hero x={x} bottom="4%" size="clamp(110px,26vh,300px)" pose={pose} holding={fx === "revealed" ? "rune" : "key"} />
        </div>
        {/* panel */}
        <div className="flex-1 min-h-0 overflow-y-auto scroll-thin px-2 pb-3 sm:px-4 lg:py-6 flex justify-center items-start lg:items-center">
          <div key={step} className="glass rounded-3xl p-3 sm:p-5 w-full max-w-2xl anim-fadeUp">
            {(cur.kind === "discover" || cur.kind === "q") && (
              <QuestionView q={cur.q} theme={THEME[room.id]} onSolved={(f) => solved(cur.q.id, f)} onContinue={next} />
            )}
            {cur.kind === "explain" && (
              <div className="flex flex-col items-center text-center gap-3">
                <div className="text-sm text-violet-200">سر الغرفة انكشف… 🔓</div>
                <WordBadge w={room.word} big className="anim-pop text-4xl" />
                <div className="text-xl sm:text-2xl font-extrabold text-white">{room.explain.ar}</div>
                <div className="en text-lg sm:text-xl text-amber-200">{room.explain.en}</div>
                {room.explain.visual && (
                  <div className="flex flex-col items-center gap-0.5 en font-bold">
                    {room.explain.visual.map((v, i) => (<div key={i} className="flex flex-col items-center"><span className="px-4 py-1 rounded-xl" style={{ background: i === 1 ? "rgba(62,232,216,.15)" : "rgba(20,10,50,.6)", color: i === 1 ? info.color : "#fff", border: `1.5px solid ${info.color}66` }}>{v}</span>{i < room.explain.visual!.length - 1 && <span className="text-amber-300">↓</span>}</div>))}
                  </div>
                )}
                <div className="text-3xl">{room.explain.exampleEmoji}</div>
                <div className="en text-lg sm:text-2xl bg-black/30 rounded-2xl px-4 py-2">
                  {room.explain.example[0]}<b style={{ color: info.color, textShadow: `0 0 10px ${info.color}` }}>{room.explain.example[1]}</b>{room.explain.example[2]}
                </div>
                <SecretTip>{room.word} = {info.ar} {info.icon}</SecretTip>
                <div className="w-full max-w-md"><Strategy compact /></div>
                <button onClick={() => { sfx("sparkle"); next(); }} className="btn-gold rounded-2xl px-6 py-3 text-lg">جاهزة للتحدي ✨</button>
              </div>
            )}
            {cur.kind === "reward" && (
              <div className="flex flex-col items-center text-center gap-3">
                {fx === "none" && (<>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-100">أحسنتِ! الغرفة تريد أن تكافئكِ… 👀</div>
                  <button onClick={startReward} className="btn-gold rounded-2xl px-6 py-3 text-lg anim-glow">{actionLabel}</button>
                </>)}
                {fx === "effect" && <div className="text-xl font-bold text-violet-100 anim-fadeIn">{room.rewardAr}</div>}
                {fx === "box" && (<>
                  <div className="text-xl font-bold text-amber-100 anim-pop">شيء يلمع! اضغطي عليه ✨</div>
                  <button onClick={openBox} className="btn-gold rounded-2xl px-6 py-3 text-lg anim-glow">اكشفي السر المخفي 🔮</button>
                </>)}
                {fx === "revealed" && (
                  <div className="flex flex-col items-center gap-3 anim-pop w-full">
                    <div className="cinzel text-xl sm:text-2xl font-extrabold gold-text" dir="ltr">🔮 SECRET RUNE #{index + 1}</div>
                    <WordBadge w={room.word} big />
                    <SecretTip>{room.runeTip}</SecretTip>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="rounded-2xl p-2" style={{ background: "rgba(20,10,50,.6)", border: "2px solid #3ee8d8" }}>
                        <div className="cinzel text-xs text-teal-200" dir="ltr">CODE DIGIT</div>
                        <div className="cinzel text-4xl font-extrabold text-teal-200 glow-text">{room.digit}</div>
                      </div>
                      <div className="rounded-2xl p-2" style={{ background: "rgba(20,10,50,.6)", border: `2px solid ${info.color}` }}>
                        <div className="text-3xl anim-glow">🗝️</div>
                        <div className="cinzel text-sm font-extrabold" style={{ color: info.color }} dir="ltr">{room.key}</div>
                      </div>
                    </div>
                    <div className="cinzel text-lg sm:text-2xl text-amber-100" dir="ltr">FINAL CODE: {p.digits.map((d) => d ?? "?").join(" • ")}</div>
                    <button onClick={() => { sfx("sparkle"); onExit(); }} className="btn-gold rounded-2xl px-6 py-3 text-lg">{index < 3 ? "عودي إلى الممر 🚪" : "عودي إلى الممر… شيء ما ينتظركِ 👀"}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
