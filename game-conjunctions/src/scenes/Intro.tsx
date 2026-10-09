import { bridgeStudentName } from "../bridge";
import { useEffect, useState, type ReactElement } from "react";
import Hero, { type Pose } from "../components/Hero";
import { Dust, Fog } from "../components/Scenery";
import { speak } from "../components/UI";
import { sfx, unlockAudio } from "../audio";
import { LobbyBackdrop, Desk } from "./Lobby";
import { useTimeline } from "./Elevator";

function NightSky() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 110%, #6d3fb5 0%, #3b1f6e 35%, #160f3a 70%, #0b0620 100%)" }}>
      {[...Array(60)].map((_, i) => (
        <span key={i} className="absolute rounded-full bg-white anim-twinkle" style={{ width: (i % 3) + 1, height: (i % 3) + 1, left: `${(i * 37) % 100}%`, top: `${(i * 53) % 60}%`, animationDelay: `${(i % 7) * 0.4}s` }} />
      ))}
      <div className="absolute right-[10%] top-[8%] w-[12vmin] h-[12vmin] rounded-full" style={{ background: "radial-gradient(circle at 35% 35%,#fffbe6,#f4dca0 60%,#d7b76a)", boxShadow: "0 0 60px #fff3c4, 0 0 120px rgba(185,163,255,.6)" }} />
      <div className="lightning-flash" style={{ animation: "lightning 11s linear 4s infinite" }} />
    </div>
  );
}

export function HotelExterior({ signOn, doorOpen }: { signOn?: boolean; doorOpen?: boolean }) {
  const win = (x: number, y: number, i: number) => (
    <rect key={`${x}-${y}`} x={x} y={y} width="26" height="38" rx="13" fill={i % 3 === 0 ? "#b98aff" : "#ffcf7a"} style={{ animation: `twinkle ${2 + (i % 5)}s ease-in-out ${(i % 4) * 0.5}s infinite` }} stroke="#c8952e" strokeWidth="2" />
  );
  const wins: ReactElement[] = []; let i = 0;
  for (const y of [220, 290, 360]) for (const x of [180, 230, 280, 490, 540, 590]) wins.push(win(x, y, i++));
  for (const y of [130, 200]) for (const x of [345, 387, 429]) wins.push(win(x, y, i++));
  return (
    <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a2a7a" /><stop offset="1" stopColor="#24123f" /></linearGradient>
        <radialGradient id="doorLight" cx=".5" cy=".6" r=".6"><stop offset="0" stopColor="#fff3c4" /><stop offset="1" stopColor="#ffb84d" /></radialGradient>
      </defs>
      <rect x="0" y="560" width="800" height="40" fill="#120a26" />
      {/* side towers */}
      <rect x="130" y="170" width="90" height="390" fill="url(#wall)" stroke="#1b0f33" strokeWidth="3" />
      <path d="M120 175 L175 70 L230 175 Z" fill="#6e1a3d" stroke="#c8952e" strokeWidth="3" />
      <rect x="580" y="170" width="90" height="390" fill="url(#wall)" stroke="#1b0f33" strokeWidth="3" />
      <path d="M570 175 L625 70 L680 175 Z" fill="#6e1a3d" stroke="#c8952e" strokeWidth="3" />
      <circle cx="175" cy="62" r="6" fill="#f2c95c" /><circle cx="625" cy="62" r="6" fill="#f2c95c" />
      {/* main body */}
      <rect x="170" y="200" width="460" height="360" fill="url(#wall)" stroke="#1b0f33" strokeWidth="3" />
      <rect x="165" y="195" width="470" height="12" fill="#c8952e" />
      {/* central tower */}
      <rect x="325" y="100" width="150" height="460" fill="url(#wall)" stroke="#1b0f33" strokeWidth="3" />
      <path d="M310 108 L400 10 L490 108 Z" fill="#6e1a3d" stroke="#c8952e" strokeWidth="3" />
      <circle cx="400" cy="70" r="20" fill="#f7ecd4" stroke="#f2c95c" strokeWidth="4" />
      <line x1="400" y1="70" x2="400" y2="56" stroke="#3b1f6e" strokeWidth="3" /><line x1="400" y1="70" x2="410" y2="70" stroke="#3b1f6e" strokeWidth="3" />
      {wins}
      {/* sign */}
      <g style={{ opacity: signOn ? 1 : 0.15, animation: signOn ? "signOn 1.4s ease-out forwards" : undefined }}>
        <rect x="290" y="405" width="220" height="34" rx="10" fill="#1b0f33" stroke="#f2c95c" strokeWidth="3" />
        <text x="400" y="428" textAnchor="middle" fontFamily="Cinzel Decorative, serif" fontSize="15" fontWeight="900" fill="#f2c95c">THE ENCHANTED HOTEL ✨</text>
      </g>
      {/* door */}
      <path d="M360 560 L360 480 Q400 440 440 480 L440 560 Z" fill="url(#doorLight)" />
      <g style={{ transformBox: "fill-box", transformOrigin: "0% 50%", transition: "transform 1.6s ease-in-out", transform: doorOpen ? "scaleX(.12)" : "none" }}>
        <path d="M362 560 L362 481 Q380 462 400 458 L400 560 Z" fill="#6e1a3d" stroke="#c8952e" strokeWidth="2" /><circle cx="392" cy="515" r="3" fill="#f2c95c" />
      </g>
      <g style={{ transformBox: "fill-box", transformOrigin: "100% 50%", transition: "transform 1.6s ease-in-out", transform: doorOpen ? "scaleX(.12)" : "none" }}>
        <path d="M400 458 Q420 462 438 481 L438 560 L400 560 Z" fill="#6e1a3d" stroke="#c8952e" strokeWidth="2" /><circle cx="408" cy="515" r="3" fill="#f2c95c" />
      </g>
      <path d="M355 560 L355 478 Q400 430 445 478 L445 560" fill="none" stroke="#f2c95c" strokeWidth="5" />
      {/* lanterns */}
      <circle cx="340" cy="490" r="8" fill="#ffcf7a" style={{ animation: "twinkle 2s infinite" }} /><circle cx="460" cy="490" r="8" fill="#ffcf7a" style={{ animation: "twinkle 2.4s infinite" }} />
      {/* steps */}
      <rect x="340" y="560" width="120" height="8" fill="#3b1f6e" /><rect x="330" y="568" width="140" height="8" fill="#2a1450" />
      {/* trees */}
      <path d="M40 560 Q60 440 80 560 Z M70 560 Q95 400 120 560 Z" fill="#1a0d33" /><path d="M700 560 Q725 420 750 560 Z M735 560 Q760 460 785 560 Z" fill="#1a0d33" />
    </svg>
  );
}

/* ---------------- title ---------------- */
export function Title({ savedName, onStart, onResume }: { savedName?: string; onStart: (name: string) => void; onResume: () => void }) {
  const [name, setName] = useState(bridgeStudentName());
  const [err, setErr] = useState(false);
  const go = () => {
    unlockAudio();
    if (!name.trim()) { setErr(true); sfx("wrong"); return; }
    sfx("ding"); onStart(name.trim());
  };
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-thin">
      <NightSky />
      <div className="absolute inset-x-0 bottom-0 h-[42vh] opacity-50 pointer-events-none"><HotelExterior signOn /></div>
      <Fog /><Dust count={30} />
      <div className="relative z-30 min-h-full flex flex-col items-center justify-center text-center px-4 py-8 gap-3">
        <div className="anim-fadeUp">
          <div className="text-5xl sm:text-7xl lg:text-8xl font-black gold-text leading-tight">مبادرة جسر المدارس 🌉</div>
          <div className="mt-3 text-lg sm:text-2xl font-bold text-violet-100 max-w-3xl">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</div>
        </div>
        <div className="w-40 h-px my-2" style={{ background: "linear-gradient(90deg,transparent,#f2c95c,transparent)" }} />
        <div className="anim-fadeUp" style={{ animationDelay: ".3s" }}>
          <div className="text-4xl sm:text-6xl font-black text-white glow-text">🏨✨ الفندق السحري</div>
          <div className="magic-title text-2xl sm:text-4xl gold-text mt-1">The Enchanted Hotel</div>
          <div className="mt-3 text-lg sm:text-2xl text-amber-100 font-bold">«أربعة أبواب… أربعة أسرار… ومصعد لا يظهر للجميع. 🔐»</div>
        </div>
        <div className="glass rounded-3xl p-4 sm:p-6 mt-3 w-full max-w-md anim-fadeUp" style={{ animationDelay: ".6s" }}>
          {savedName && (
            <div className="mb-4 pb-4 border-b border-amber-300/30">
              <div className="text-violet-100 mb-2">أهلًا بعودتكِ يا <b className="text-amber-200">{savedName}</b> ✨ الفندق يتذكركِ…</div>
              <button onClick={() => { unlockAudio(); sfx("ding"); onResume(); }} className="btn-gold w-full rounded-2xl py-3 text-xl">متابعة الرحلة 🗝️</button>
              <div className="text-xs text-violet-300 mt-2">أو ابدئي رحلة جديدة:</div>
            </div>
          )}
          <label className="block text-xl font-extrabold text-amber-100 mb-2">اكتبي اسمكِ</label>
          <input value={name} onChange={(e) => { setName(e.target.value); setErr(false); }} onKeyDown={(e) => e.key === "Enter" && go()} maxLength={24}
            className={`w-full rounded-2xl px-4 py-3 text-xl text-center font-bold bg-[#0b0620] text-white outline-none border-2 ${err ? "border-pink-400 anim-shake" : "border-amber-300/70 focus:border-teal-300"}`} placeholder="✨ اسمكِ هنا" />
          {err && <div className="text-pink-300 text-sm mt-1">الفندق يريد أن يعرف اسمكِ أولًا 👀</div>}
          <button onClick={go} className="btn-gold w-full rounded-2xl py-3 mt-3 text-2xl">ادخلي الفندق 🗝️</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- opening cinematic ---------------- */
export function Opening({ name, onDone }: { name: string; onDone: () => void }) {
  const at = useTimeline();
  const [ph, setPh] = useState(0);
  const [x, setX] = useState(18);
  const [pose, setPose] = useState<Pose>("walk");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [bell, setBell] = useState(0);
  const [doorsClosed, setDoorsClosed] = useState(false);
  useEffect(() => {
    sfx("chime");
    at(80, () => setX(50));
    at(2600, () => { setPh(1); sfx("sparkle"); });
    at(3400, () => { setPose("look"); });
    at(4000, () => { setPh(2); sfx("creak"); setPose("surprise"); });
    at(5500, () => { setPh(3); setPose("walk"); });
    at(6600, () => { setPh(4); setPose("idle"); setX(42); });
    at(7000, () => { setDoorsClosed(true); });
    at(7600, () => { sfx("thump"); setPose("surprise"); setFacing(-1); });
    at(8600, () => { setPose("look"); setFacing(1); });
    at(9600, () => { setPh(5); setBell(1); sfx("ding"); setPose("surprise"); });
    at(10400, () => { speak("Welcome to the Enchanted Hotel."); setPose("happy"); });
    at(13600, () => { speak("Four secrets are waiting for you."); setPh(6); setPose("idle"); });
  }, []);
  const outside = ph < 4;
  return (
    <div className="absolute inset-0 overflow-hidden">
      {outside ? (
        <>
          <NightSky />
          <div className="absolute inset-0" style={{ transformOrigin: "50% 88%", animation: "zoomHotel 5.6s ease-in-out forwards" }}>
            <div className="absolute inset-x-0 bottom-0 h-[92%]"><HotelExterior signOn={ph >= 1} doorOpen={ph >= 2} /></div>
            <Hero x={x} bottom="4%" size="clamp(70px,13vh,130px)" pose={pose} facing={1} style={{ transition: "left 2.6s linear, opacity .9s, transform .9s", opacity: ph >= 3 ? 0 : 1, transform: ph >= 3 ? "translateX(-50%) translateY(-6%) scale(.7)" : "translateX(-50%)" }} />
          </div>
          <Fog /><Dust count={18} />
          {ph >= 1 && ph < 3 && <div className="absolute top-[14%] inset-x-0 text-center magic-title text-3xl sm:text-5xl gold-text anim-pop z-30">THE ENCHANTED HOTEL ✨</div>}
          {ph === 2 && <div className="absolute bottom-[30%] inset-x-0 text-center cinzel text-2xl text-amber-200/90 anim-fadeUp z-30 tracking-widest">CREEEAK...</div>}
        </>
      ) : (
        <LobbyBackdrop extra={
          <div className="absolute left-[4%] sm:left-[20%] bottom-[18%] w-[min(30vw,220px)] h-[50vh]" style={{ zIndex: 7 }}>
            <div className="absolute inset-0 rounded-t-full" style={{ background: "radial-gradient(ellipse at 50% 70%,#ffe3a8,#8a4fc9)", border: "8px solid #c8952e" }} />
            <div className="absolute inset-[8px] rounded-t-full overflow-hidden flex">
              <div className="w-1/2 h-full" style={{ background: "linear-gradient(90deg,#3d0f24,#6e1a3d)", transformOrigin: "0 50%", transition: "transform 1s ease-in", transform: doorsClosed ? "none" : "perspective(600px) rotateY(-75deg)" }} />
              <div className="w-1/2 h-full" style={{ background: "linear-gradient(270deg,#3d0f24,#6e1a3d)", transformOrigin: "100% 50%", transition: "transform 1s ease-in", transform: doorsClosed ? "none" : "perspective(600px) rotateY(75deg)" }} />
            </div>
          </div>
        }>
          <Desk bellShake={bell} />
          <Hero x={x} bottom="5%" pose={pose} facing={facing} />
          {doorsClosed && ph === 4 && <div className="absolute left-[8%] sm:left-[22%] top-[26%] cinzel text-2xl text-amber-200 anim-pop z-30">THUMP.</div>}
          {ph >= 5 && (
            <div className="absolute top-[14%] left-1/2 -translate-x-1/2 z-40 glass rounded-3xl px-6 py-4 text-center anim-pop w-[min(92vw,560px)]">
              <div className="cinzel text-2xl text-amber-200">DING! 🛎️</div>
              <div className="text-xl sm:text-3xl font-extrabold text-white mt-1">مرحبًا يا <span className="gold-text">{name}</span>… الفندق كان ينتظركِ.</div>
              {ph >= 6 && (
                <div className="anim-fadeUp mt-3">
                  <div className="text-lg text-violet-100 mb-2">تقدمي إلى مكتب الاستقبال.</div>
                  <button onClick={() => { sfx("sparkle"); onDone(); }} className="btn-gold rounded-2xl px-6 py-3 text-xl">تقدمي إلى الاستقبال 🛎️</button>
                </div>
              )}
            </div>
          )}
        </LobbyBackdrop>
      )}
      <button onClick={onDone} className="absolute bottom-3 left-3 z-50 btn-ghost rounded-full px-4 py-2 text-sm">تخطي ⏭️</button>
    </div>
  );
}
