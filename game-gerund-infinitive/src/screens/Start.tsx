import { bridgeStudentName } from "../bridge";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { initAudio, narrate, sfx, startMusic } from "../audio";
import { useGame } from "../store";
import { useScene } from "../scene";
import Girl from "../components/Girl";
import ParkGate from "../components/ParkGate";
import { InitiativeHero } from "../components/ui";

export function Intro() {
  const { s, set, reset } = useGame();
  const hasSave = !!s.name && !!s.resume && s.resume !== "intro" && s.resume !== "name";
  return (
    <section className="w-full max-w-4xl flex flex-col items-center text-center gap-6 py-6">
      <div className="fade-up">
        <InitiativeHero />
      </div>
      <div className="w-40 h-px bg-gradient-to-l from-transparent via-gold to-transparent fade-up" style={{ animationDelay: ".6s" }} />
      <div className="fade-up" style={{ animationDelay: "1s" }}>
        <p className="text-6xl sm:text-7xl mb-2 float">🎡</p>
        <h1 className="display text-4xl sm:text-6xl text-white neon-pink leading-tight">«مدينة الاختيارات السرّية»</h1>
        <p dir="ltr" className="en text-2xl sm:text-4xl font-bold mt-3 bg-gradient-to-l from-turq via-lav to-gold bg-clip-text text-transparent">
          Gerund & Infinitive Adventure Park
        </p>
      </div>
      <div className="flex items-end gap-4 fade-up" style={{ animationDelay: "1.6s" }}>
        <Girl pose="wave" size={120} />
      </div>
      <div className="flex flex-wrap justify-center gap-3 fade-up" style={{ animationDelay: "1.9s" }}>
        {hasSave ? (
          <>
            <button
              className="btn-main text-xl"
              onClick={() => {
                initAudio();
                sfx.chime();
                if (s.resume && s.resume !== "gate") startMusic();
                set({ stage: s.resume || "name", resume: undefined });
              }}
            >
              متابعة المغامرة يا {s.name} ✨
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                initAudio();
                sfx.click();
                reset();
              }}
            >
              بداية جديدة 🔄
            </button>
          </>
        ) : (
          <button
            className="btn-main text-xl glow-pulse"
            onClick={() => {
              initAudio();
              sfx.chime();
              set({ stage: "name" });
            }}
          >
            ابدئي المغامرة ✨
          </button>
        )}
      </div>
    </section>
  );
}

export function NameScreen() {
  const { s, set } = useGame();
  const [name, setName] = useState(s.name || bridgeStudentName());
  const go = () => {
    if (!name.trim()) return;
    sfx.success();
    set({ name: name.trim(), stage: "gate" });
  };
  return (
    <section className="glass rounded-[28px] w-full max-w-lg p-6 sm:p-8 text-center fade-up">
      <Girl pose="look" size={110} />
      <h2 className="display text-3xl sm:text-4xl text-gold neon-gold mt-2">ما اسمكِ أيتها المغامِرة؟ ✨</h2>
      <p className="text-lav mt-2">سيظهر اسمكِ على تذكرتكِ وشهادتكِ 🎟️</p>
      <input
        autoFocus
        value={name}
        maxLength={30}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
        placeholder="اكتبي اسمكِ هنا"
        className="mt-5 w-full rounded-2xl bg-navy/70 border-2 border-lav/50 focus:border-gold outline-none px-5 py-4 text-2xl text-center font-bold placeholder:text-white/30"
      />
      <button className="btn-main text-xl mt-5" disabled={!name.trim()} onClick={go}>
        إلى بوابة المدينة 🏰
      </button>
    </section>
  );
}

const CODE = "2468";
type GateStatus = "idle" | "denied" | "granted";

export function Gate({ onLights, setCaption }: { onLights: (v: boolean) => void; setCaption: (l: string[] | null) => void }) {
  const { travel } = useScene();
  const [arrived, setArrived] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<GateStatus>("idle");
  const [opening, setOpening] = useState(false);
  const [ready, setReady] = useState(false);
  const [entering, setEntering] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  useEffect(() => {
    later(() => setArrived(true), 2300);
    const t = timers.current;
    return () => {
      t.forEach((x) => window.clearTimeout(x));
      setCaption(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const press = useCallback(
    (d: string) => {
      if (status === "granted" || !arrived) return;
      initAudio();
      if (d === "back") {
        sfx.key();
        setCode((c) => c.slice(0, -1));
        setStatus("idle");
        return;
      }
      if (d === "clear") {
        sfx.key();
        setCode("");
        setStatus("idle");
        return;
      }
      if (code.length >= 4) return;
      sfx.key();
      const next = code + d;
      setCode(next);
      setStatus("idle");
      if (next.length === 4) {
        later(() => {
          if (next === CODE) {
            setStatus("granted");
            sfx.granted();
            later(() => {
              setOpening(true);
              sfx.gate();
              onLights(true);
            }, 900);
            later(() => {
              startMusic();
              const lines = ["Welcome to Gerund and Infinitive Adventure Park!", "Get ready to play and learn!"];
              setCaption(lines);
              const min = new Promise((r) => window.setTimeout(r, 4200));
              void Promise.all([narrate(lines), min]).then(() => setReady(true));
            }, 3000);
          } else {
            setStatus("denied");
            sfx.denied();
            later(() => setCode(""), 1000);
          }
        }, 250);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [code, status, arrived]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") press("back");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const enter = () => {
    sfx.click();
    setEntering(true);
    setCaption(null);
    later(() => travel("enter", { stage: "lesson", lessonStep: 0 }), 1100);
  };

  const pose = entering ? "walk" : !arrived ? "walk" : status === "granted" ? (ready ? "wave" : "cheer") : code.length ? "point" : "look";

  return (
    <section className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 pb-24">
      <div className="relative">
        <ParkGate open={opening} lit={status === "granted"} gears={opening} className={cn(entering && "transition-transform duration-[1600ms] scale-110")} />
        {/* the girl walking to the gate */}
        <div
          className="absolute bottom-0 z-10"
          style={{
            right: "50%",
            transform: entering ? "translate(50%, -10px) scale(0.55)" : arrived ? "translateX(50%)" : "translateX(-60vw)",
            opacity: entering ? 0 : 1,
            transition: entering ? "transform 1.5s ease-in, opacity 1.5s ease-in" : "transform 2.2s linear",
          }}
        >
          <Girl pose={pose} size={100} flip={!arrived} />
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div
          className={cn(
            "rounded-[28px] p-5 border-2 bg-gradient-to-b from-[#1e2466] to-[#0b0f3a] transition-all",
            status === "denied" && "shake border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.5)]",
            status === "granted" && "border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.6)]",
            status === "idle" && "border-turq/60 shadow-[0_0_30px_rgba(62,230,214,0.3)]"
          )}
        >
          <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-center">
            <p className="en text-2xl sm:text-3xl font-bold text-turq neon-turq">🔐 SECRET ACCESS</p>
            <p className="font-bold mt-1 text-lav">«أدخلي الرمز السري لفتح مدينة الألعاب»</p>
            <div dir="ltr" className="flex justify-center gap-3 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-12 h-14 rounded-xl border-2 flex items-center justify-center en text-3xl font-bold transition-all",
                    code[i] ? "border-gold text-gold bg-gold/10 shadow-[0_0_12px_rgba(255,207,74,0.5)]" : "border-white/20 text-white/20",
                    status === "granted" && "border-emerald-400 text-emerald-300 bg-emerald-400/10"
                  )}
                >
                  {code[i] ?? "•"}
                </div>
              ))}
            </div>
            <div className="h-16 mt-3 flex flex-col items-center justify-center">
              {status === "denied" && (
                <div className="pop-in">
                  <p className="en text-2xl font-bold text-rose-400">🔴 ACCESS DENIED</p>
                  <p className="font-bold">حاولي مرة أخرى 🔐</p>
                </div>
              )}
              {status === "granted" && <p className="en text-3xl font-bold text-emerald-300 pop-in">🟢 ACCESS GRANTED</p>}
              {status === "idle" && <p className="text-white/50 text-sm">{arrived ? "اضغطي على الأرقام 👇" : "✨ في الطريق إلى البوابة…"}</p>}
            </div>
          </div>
          {!ready ? (
            <div dir="ltr" className="grid grid-cols-3 gap-2.5 mt-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map((k) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  disabled={status === "granted" || !arrived}
                  className={cn(
                    "en h-14 sm:h-16 rounded-2xl text-2xl font-bold border transition-all active:scale-95 disabled:opacity-40",
                    k === "clear" || k === "back"
                      ? "bg-white/5 border-white/20 text-lav text-lg"
                      : "bg-gradient-to-b from-[#3a3f9a] to-[#232766] border-lav/30 hover:border-turq hover:shadow-[0_0_16px_rgba(62,230,214,0.5)]"
                  )}
                >
                  {k === "clear" ? "C" : k === "back" ? "⌫" : k}
                </button>
              ))}
            </div>
          ) : (
            <button className="btn-main w-full text-xl mt-4 glow-pulse" onClick={enter} disabled={entering}>
              ادخلي مدينة الألعاب ✨🎡
            </button>
          )}
          {!ready && status !== "granted" && (
            <div className="text-center mt-3">
              <button className="text-sm text-gold/80 underline underline-offset-4" onClick={() => setShowClue((v) => !v)}>
                تلميح الرمز 💡
              </button>
              {showClue && <p className="text-sm mt-1 text-amber-100 pop-in">أربعة أرقام زوجية تصاعدية تبدأ بـ 2 ✨</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
