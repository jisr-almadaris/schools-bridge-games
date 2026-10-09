import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Hero, { type Pose } from "../components/Hero";
import { Candle, Chandelier, Dust, Fog, GrandClock, HotelRoomShell, NightWindow, Painting, Runes } from "../components/Scenery";
import { Keypad, speak } from "../components/UI";
import { sfx } from "../audio";
import { FIRST_CODE } from "../data";
import { ElevatorDoor, useTimeline } from "./Elevator";

export function LobbyBackdrop({ children, extra }: { children?: ReactNode; extra?: ReactNode }) {
  return (
    <HotelRoomShell>
      <NightWindow className="left-[3%] top-[10%] w-[13%] h-[38%] hidden sm:block" flashDelay={2} />
      <NightWindow className="right-[3%] top-[10%] w-[13%] h-[38%]" flashDelay={7} />
      <Chandelier className="left-1/2 -translate-x-1/2 top-0 w-[min(40vw,300px)] h-[20vh]" />
      <Painting className="left-[20%] top-[12%] w-[8%] min-w-[54px] aspect-[4/5]" kind="cat" />
      <Painting className="right-[20%] top-[14%] w-[7%] min-w-[48px] aspect-[4/5]" kind="lady" />
      <GrandClock className="left-[1%] bottom-[24%] w-[8%] min-w-[50px] h-[42%] hidden sm:block" />
      <Candle style={{ left: "30%", top: "30%" }} />
      <Candle style={{ right: "30%", top: "24%", animationDelay: "-2s" }} />
      <Candle style={{ left: "62%", top: "40%", animationDelay: "-1s" }} purple />
      <Runes count={7} area={{ top: 8, bottom: 55 }} />
      {extra}
      {children}
      <Fog />
      <Dust />
    </HotelRoomShell>
  );
}

/* ---------------- reception desk ---------------- */
export function Desk({ onBell, bellShake, bellPulse, cardDown = true }: { onBell?: () => void; bellShake?: number; bellPulse?: boolean; cardDown?: boolean }) {
  return (
    <>
      {/* key board on wall */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[46%] w-[min(46vw,380px)] h-[16vh] rounded-xl p-2 flex justify-around items-start" style={{ background: "linear-gradient(180deg,#4a1a2e,#2a0f1c)", border: "4px solid #c8952e", zIndex: 6 }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center" style={{ animation: `headTilt ${2.4 + (i % 3) * 0.7}s ease-in-out infinite`, transformOrigin: "50% 0" }}>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            <div className="w-px h-3 bg-amber-200" />
            <span className="text-lg sm:text-2xl" style={{ filter: "drop-shadow(0 0 4px #f2c95c)" }}>🗝️</span>
            <span className="text-[9px] cinzel text-amber-200">{101 + i}</span>
          </div>
        ))}
      </div>
      {/* counter */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[14%] w-[min(78vw,640px)] h-[26vh]" style={{ zIndex: 10 }}>
        <div className="absolute inset-x-0 top-0 h-[16%] rounded-t-lg" style={{ background: "linear-gradient(180deg,#f2c95c,#8a5b12)" }} />
        <div className="absolute inset-x-[2%] top-[16%] bottom-0" style={{ background: "linear-gradient(180deg,#6e1a3d,#3d0f24)", borderLeft: "4px solid #c8952e", borderRight: "4px solid #c8952e", boxShadow: "inset 0 10px 30px rgba(0,0,0,.5)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="magic-title text-amber-300/80 text-sm sm:text-xl tracking-widest">✦ RECEPTION ✦</div>
          </div>
          <div className="absolute left-[8%] right-[8%] bottom-[10%] h-[30%] rounded" style={{ border: "2px solid rgba(242,201,92,.4)" }} />
        </div>
        {/* items */}
        <div className="absolute left-[6%] -top-[46%] w-[10%]"><div className="relative h-20"><Candle style={{ left: 0, bottom: 0, animation: "none" }} /></div></div>
        <div className="absolute left-[22%] -top-[16%] w-[24%] aspect-[3/1] rounded" style={{ background: "linear-gradient(90deg,#3b1f6e,#5a2f9e 48%,#2a1450 52%,#3b1f6e)", border: "2px solid #c8952e", transform: "perspective(200px) rotateX(40deg)" }}>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs cinzel text-amber-200">GUESTS</div>
        </div>
        <button onClick={onBell} key={bellShake} className={`absolute left-[56%] -top-[40%] w-[16%] max-w-[90px] aspect-square ${bellShake ? "anim-bell" : ""} ${bellPulse ? "anim-glow" : ""}`} aria-label="bell" style={{ zIndex: 12 }}>
          <svg viewBox="0 0 60 50" className="w-full h-full">
            <ellipse cx="30" cy="46" rx="26" ry="4" fill="#7a5217" />
            <path d="M8 44 Q8 14 30 14 Q52 14 52 44 Z" fill="url(#bellG)" stroke="#fff0b3" strokeWidth="1.5" />
            <rect x="27" y="6" width="6" height="8" rx="2" fill="#c8952e" />
            <circle cx="30" cy="5" r="4" fill="#f2c95c" />
            <path d="M16 36 Q18 22 28 19" stroke="#fff" strokeWidth="2" fill="none" opacity=".6" />
            <defs><linearGradient id="bellG" x1="0" x2="1"><stop offset="0" stopColor="#a87628" /><stop offset=".5" stopColor="#ffe89a" /><stop offset="1" stopColor="#a87628" /></linearGradient></defs>
          </svg>
        </button>
        {cardDown && (
          <div className="absolute right-[10%] -top-[10%] w-[12%] aspect-[3/2] rounded-md anim-glow" style={{ background: "repeating-linear-gradient(45deg,#3b1f6e 0 6px,#6e1a3d 6px 12px)", border: "2px solid #f2c95c", transform: "perspective(200px) rotateX(45deg)" }} />
        )}
      </div>
    </>
  );
}

/* ---------------- reception scene ---------------- */
export function Reception({ name, onDone, onGotCard }: { name: string; onDone: () => void; onGotCard: () => void }) {
  const at = useTimeline();
  const [step, setStep] = useState<"walk" | "bell" | "book" | "fly" | "card">("walk");
  const [x, setX] = useState(6);
  const [pose, setPose] = useState<Pose>("walk");
  const [bell, setBell] = useState(0);
  useEffect(() => {
    at(60, () => setX(27));
    at(1900, () => { setPose("look"); setStep("bell"); });
  }, []);
  const ring = () => {
    if (step !== "bell") return;
    setBell((b) => b + 1); sfx("ding"); setPose("reach");
    at(900, () => { setStep("book"); sfx("book"); setPose("surprise"); });
    at(1500, () => sfx("sparkle"));
    at(4300, () => { setStep("fly"); sfx("whoosh"); });
    at(5500, () => { setStep("card"); sfx("rune"); setPose("hold"); onGotCard(); });
  };
  return (
    <LobbyBackdrop>
      <Desk onBell={ring} bellShake={bell} bellPulse={step === "bell"} cardDown={step === "walk" || step === "bell" || step === "book"} />
      <Hero x={x} bottom="5%" pose={pose} holding={step === "card" ? "card" : null} />
      {step === "bell" && (
        <div className="absolute top-[16%] left-1/2 -translate-x-1/2 z-40 glass rounded-2xl px-5 py-3 text-center anim-fadeUp">
          <div className="text-lg sm:text-2xl font-extrabold text-amber-100">مكتب الاستقبال فارغ… 👀</div>
          <div className="text-base sm:text-lg text-violet-100">اضغطي الجرس الذهبي 🛎️</div>
        </div>
      )}
      {step === "book" && (
        <div className="absolute inset-x-0 top-[14%] z-40 flex justify-center px-3 anim-pop">
          <div className="relative w-[min(92vw,560px)] aspect-[2/1.1] rounded-2xl flex" style={{ background: "linear-gradient(90deg,#f7ecd4,#fffaf0 48%,#d9c49a 50%,#fffaf0 52%,#f7ecd4)", border: "6px solid #6e1a3d", boxShadow: "0 0 60px rgba(242,201,92,.5)" }}>
            <div className="flex-1 flex flex-col items-center justify-center p-3 text-[#3b1f6e]">
              <div className="ruqaa text-lg sm:text-2xl text-[#6e1a3d]">كتاب النزلاء</div>
              <div className="text-4xl mt-2">📖</div>
              <div className="cinzel text-xs mt-2 opacity-70">Est. 1888</div>
            </div>
            <div className="flex-1 flex flex-col items-start justify-center gap-3 p-3 sm:p-5 text-[#3b1f6e]" dir="ltr">
              <div className="cinzel text-sm sm:text-xl font-extrabold" style={{ animation: "ink 1.4s steps(18) .5s both" }}>GUEST: <span className="text-[#6e1a3d]">{name}</span></div>
              <div className="cinzel text-sm sm:text-xl font-extrabold" style={{ animation: "ink 1.4s steps(18) 2s both" }}>ROOM ACCESS: <span className="text-[#b0213f]">LOCKED 🔐</span></div>
              <div className="text-2xl" style={{ animation: "fadeIn .5s 3s both" }}>✒️✨</div>
            </div>
          </div>
        </div>
      )}
      {step === "fly" && (
        <div className="absolute z-40 text-6xl" style={{ right: "25%", bottom: "38%", animation: "cardFly 1.2s ease-in-out forwards", ["--cx" as string]: "-30vw" } as CSSProperties}>🃏</div>
      )}
      {step === "card" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-3 bg-black/40 anim-fadeIn">
          <div className="w-[min(92vw,420px)] rounded-3xl p-5 text-center" style={{ animation: "flipIn .9s ease-out both", background: "linear-gradient(160deg,#fff3c4,#f2c95c 40%,#c8952e)", border: "4px solid #fff", boxShadow: "0 0 60px rgba(242,201,92,.8), 0 0 0 6px #3b1f6e" }}>
            <div className="cinzel text-2xl font-extrabold text-[#3b1f6e]" dir="ltr">✨ GUEST CARD ✨</div>
            <div className="text-sm text-[#6e1a3d] font-bold mt-1 en">{name}</div>
            <div className="my-3 rounded-2xl bg-[#1b0f33] py-3">
              <div className="cinzel text-sm text-amber-200" dir="ltr">FIRST CODE:</div>
              <div className="cinzel text-4xl sm:text-5xl font-extrabold text-[#3ee8d8] glow-text tracking-wider" dir="ltr">2 – 4 – 6 – 8</div>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#3b1f6e]">«احتفظي بالرمز… المصعد لا يستقبل أي نزيل.» 🔐</div>
            <button onClick={() => { sfx("sparkle"); onDone(); }} className="mt-4 rounded-2xl px-6 py-3 text-lg font-extrabold text-amber-100" style={{ background: "linear-gradient(180deg,#5a2f9e,#3b1f6e)", border: "2px solid #fff3c4" }}>اذهبي إلى المصعد 🛗</button>
          </div>
        </div>
      )}
    </LobbyBackdrop>
  );
}

/* ---------------- elevator code ---------------- */
export function ElevatorCode({ onEnter }: { onEnter: () => void }) {
  const at = useTimeline();
  const [x, setX] = useState(8);
  const [pose, setPose] = useState<Pose>("walk");
  const [state, setState] = useState<"walk" | "code" | "granted" | "open" | "in">("walk");
  useEffect(() => {
    at(60, () => setX(30));
    at(1900, () => { setPose("look"); setState("code"); });
  }, []);
  const granted = () => {
    setState("granted"); sfx("rune"); setPose("surprise");
    at(400, () => sfx("gears"));
    at(1600, () => { setState("open"); sfx("elevator"); speak("Access granted. The elevator is waiting for you."); setPose("happy"); });
    at(3600, () => { setPose("walk"); setX(50); });
    at(5400, () => { setState("in"); });
    at(6200, () => onEnter());
  };
  return (
    <LobbyBackdrop>
      <ElevatorDoor className="left-1/2 -translate-x-1/2 bottom-[18%] w-[min(40vw,300px)] h-[52vh]" open={state === "open" || state === "in"} lit={state !== "walk" && state !== "code"} gears={state === "granted"} />
      <Hero x={x} bottom={state === "in" ? "20%" : "5%"} pose={pose} holding="card" style={state === "in" ? { opacity: 0, transform: "translateX(-50%) scale(.7)" } : undefined} />
      {state === "code" && (
        <div className="absolute z-40 left-1/2 -translate-x-1/2 bottom-2 md:left-auto md:right-[4%] md:translate-x-0 md:top-1/2 md:-translate-y-1/2 md:bottom-auto scale-[.88] sm:scale-100 origin-bottom">
          <Keypad title="ENTER GUEST CODE" subtitle="أدخلي الرمز الموجود على بطاقة النزيل 🎫" code={FIRST_CODE} errorText="الرمز غير صحيح… حاولي مرة أخرى." onSuccess={granted} />
        </div>
      )}
    </LobbyBackdrop>
  );
}
