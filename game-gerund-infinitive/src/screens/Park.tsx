import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { announce, initAudio, sfx } from "../audio";
import { useGame } from "../store";
import { useScene } from "../scene";
import { FINAL, FINAL_CODE, GAMES, SECRETS } from "../data";
import Girl from "../components/Girl";
import ParkGate from "../components/ParkGate";
import { codeDigits } from "../components/HUD";
import { QuestionView } from "../components/questions";
import { ChoiceMap, Modal, ParkTip, SecretTicket, TicketStamp } from "../components/ui";

const TONES: Record<string, string> = {
  coaster: "from-pink-500/40 to-fuchsia-700/40",
  wheel: "from-teal-400/40 to-cyan-700/40",
  balloon: "from-amber-400/40 to-orange-600/40",
  cinema: "from-violet-500/40 to-indigo-700/40",
};
const AWNING: Record<string, string> = {
  coaster: "#ff6fb5",
  wheel: "#3ee6d6",
  balloon: "#ffcf4a",
  cinema: "#c7b8ff",
};

export function Hub({ onKiosk }: { onKiosk: () => void }) {
  const { s } = useGame();
  const { travel } = useScene();
  const [stamp, setStamp] = useState(false);
  const [viewSecret, setViewSecret] = useState<number | null>(null);
  const [map, setMap] = useState(false);
  const allDone = s.gamesDone >= GAMES.length;

  if (stamp)
    return (
      <TicketStamp
        n={2}
        label="إلى آخر المدينة 🌌"
        note={<p className="font-bold text-lav">أنهيتِ كل ألعاب الملاهي! 🎢🎡🎈🍿</p>}
        onContinue={() => travel("toFinalGate", { tickets: Math.max(s.tickets, 2), stage: "finalIntro" })}
      />
    );

  return (
    <section className="w-full max-w-5xl fade-up">
      <div className="text-center mb-5">
        <h2 className="display text-3xl sm:text-5xl text-gold neon-gold">🎢 منطقة الألعاب</h2>
        <p className="text-lav font-bold mt-2">العبي الألعاب الأربع بالترتيب واجمعي التذاكر السرية 🔐</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {GAMES.map((g, i) => {
          const done = i < s.gamesDone;
          const open = i <= s.gamesDone;
          const current = i === s.gamesDone;
          return (
            <button
              key={g.id}
              disabled={!open}
              onClick={() => {
                sfx.click();
                travel("toGame", { stage: "game", activeGame: i, gameQ: 0, gameFinished: false }, g.id);
              }}
              className={cn(
                "relative rounded-[24px] pt-7 pb-4 px-3 sm:px-4 text-center border-2 transition-all bg-gradient-to-b overflow-visible",
                TONES[g.id],
                open ? "hover:-translate-y-1.5 border-white/30" : "opacity-45 grayscale border-white/10 cursor-not-allowed",
                current && "glow-pulse border-gold"
              )}
            >
              {/* booth awning */}
              <div
                className="absolute top-0 inset-x-0 h-5 rounded-t-[22px]"
                style={{ background: `repeating-linear-gradient(90deg, ${AWNING[g.id]} 0 16px, #ffffff 16px 32px)` }}
              />
              <div className="absolute top-5 inset-x-3 bulb-row flex justify-between">
                {Array.from({ length: 6 }).map((_, k) => (
                  <span key={k} className="w-1.5 h-1.5 rounded-full bg-gold" />
                ))}
              </div>
              <div className={cn("text-5xl sm:text-6xl mt-2", open && "float")} style={{ animationDelay: `${i * 0.3}s` }}>
                {g.icon}
              </div>
              <p className="display text-xl sm:text-2xl mt-2">{g.title}</p>
              <p className="en text-xs sm:text-sm text-white/70">{g.en}</p>
              <span
                className={cn(
                  "inline-block mt-3 rounded-full px-3 py-1 text-sm font-bold",
                  done ? "bg-emerald-400/25 text-emerald-200" : current ? "bg-gold text-[#4a1d00]" : "bg-white/10 text-white/60"
                )}
              >
                {done ? "✅ أُنجزت" : current ? "▶ العبي الآن" : "🔒 مقفلة"}
              </span>
              {current && (
                <div className="absolute -bottom-3 -left-3 sm:-left-5 pointer-events-none">
                  <Girl pose="point" prop="ticket" size={64} flip />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        <button
          onClick={() => {
            sfx.chime();
            setMap(true);
          }}
          className="rounded-[24px] p-4 text-right border-2 border-gold/70 bg-gradient-to-l from-amber-400/25 to-pink-600/25 hover:-translate-y-1 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,207,74,0.3)]"
        >
          <span className="text-4xl">🗺️</span>
          <span>
            <span className="block font-extrabold text-lg">🎟️ خريطة الاختيارات</span>
            <span className="block text-sm text-lav">كل القاعدة في لوحة واحدة ✨</span>
          </span>
        </button>
        <button
          onClick={() => {
            sfx.click();
            onKiosk();
          }}
          className="rounded-[24px] p-4 text-right border-2 border-pink-300/60 bg-gradient-to-l from-pink-500/25 to-violet-600/25 hover:-translate-y-1 transition-all flex items-center gap-3"
        >
          <span className="text-4xl">💗</span>
          <span>
            <span className="block font-extrabold text-lg">كشك التلميح الذكي</span>
            <span className="block text-sm text-lav">كيف أتذكر؟ 🤔 (اختياري)</span>
          </span>
        </button>
        <div className="rounded-[24px] p-4 border-2 border-gold/40 bg-navy/50">
          <p className="font-extrabold mb-2">🔐 تذاكري السرية</p>
          <div className="flex gap-2 justify-start" dir="ltr">
            {[1, 2, 3].map((n) => {
              const has = s.secrets.includes(n);
              return (
                <button
                  key={n}
                  disabled={!has}
                  onClick={() => {
                    sfx.secret();
                    setViewSecret(n);
                  }}
                  className={cn(
                    "en flex-1 h-14 rounded-xl text-sm font-bold border flex flex-col items-center justify-center leading-tight",
                    has ? "bg-gold/20 border-gold text-gold hover:scale-105 transition" : "bg-white/5 border-white/15 text-white/30"
                  )}
                >
                  {has ? (
                    <>
                      <span>🔓 #{n}</span>
                      <span className="text-lg">{SECRETS[n].code}</span>
                    </>
                  ) : (
                    "🔒"
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <ParkTip index={s.gamesDone + 2} />
      </div>

      {allDone && (
        <div className="text-center mt-6 pop-in">
          <button
            className="btn-main text-xl glow-pulse"
            onClick={() => {
              sfx.click();
              setStamp(true);
            }}
          >
            🎟️ استلمي التذكرة الذهبية 2
          </button>
        </div>
      )}

      <Modal open={viewSecret !== null} onClose={() => setViewSecret(null)}>
        <div className="p-6 flex flex-col items-center gap-4">
          {viewSecret !== null && <SecretTicket id={viewSecret} opened />}
          <button className="btn-main" onClick={() => setViewSecret(null)}>
            أعود إلى اللعبة 🎢
          </button>
        </div>
      </Modal>
      <Modal open={map} onClose={() => setMap(false)} wide>
        <div className="p-5 sm:p-7">
          <ChoiceMap />
          <div className="text-center mt-5">
            <button className="btn-main" onClick={() => setMap(false)}>
              أعود إلى اللعبة 🎢
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export function GameRunner() {
  const { s, set } = useGame();
  const { travel } = useScene();
  const g = GAMES[s.activeGame] ?? GAMES[0];
  const [secretOpen, setSecretOpen] = useState(g.secret === 0 || s.secrets.includes(g.secret));
  const title = g.id === "cinema" ? `${g.icon} ${g.title} · 🎬 MINI CINEMA` : `${g.icon} ${g.title}`;

  if (s.gameFinished)
    return (
      <section className="w-full max-w-2xl text-center flex flex-col items-center gap-5 fade-up">
        <Girl pose="cheer" size={110} />
        <h2 className="display text-3xl sm:text-4xl text-gold neon-gold">
          🎉 أنهيتِ {g.icon} {g.title}!
        </h2>
        {g.secret ? (
          <>
            <p className="text-lav font-bold">وجدتِ تذكرة سرية! 🔐✨ فيها رقم من الرمز النهائي</p>
            <SecretTicket
              id={g.secret}
              opened={secretOpen}
              onOpened={() => {
                setSecretOpen(true);
                if (!s.secrets.includes(g.secret)) set({ secrets: [...s.secrets, g.secret] });
              }}
            />
          </>
        ) : (
          <>
            <p className="text-lav font-bold">وجدتِ لافتة مضيئة في كشك البالونات! 🎈💡</p>
            <ParkTip index={0} className="w-full max-w-sm pop-in" />
          </>
        )}
        <button className="btn-main text-lg" disabled={!secretOpen} onClick={() => { sfx.click(); travel("toHub", { stage: "hub" }); }}>
          متابعة 🎟️
        </button>
      </section>
    );

  const q = g.questions[s.gameQ] ?? g.questions[0];
  return (
    <QuestionView
      key={q.id}
      q={q}
      title={title}
      tone={TONES[g.id]}
      step={`${s.gameQ + 1} / ${g.questions.length}`}
      onDone={() => {
        if (s.gameQ + 1 >= g.questions.length) {
          sfx.chime();
          set({ gameFinished: true, gamesDone: Math.max(s.gamesDone, s.activeGame + 1) });
        } else set({ gameQ: s.gameQ + 1 });
      }}
    />
  );
}

/* ------------------------------ 🔒 FINAL NIGHT ZONE gate ------------------------------ */
type GateStatus = "idle" | "denied" | "granted";

export function FinalIntro() {
  const { s } = useGame();
  const { setFx, travel } = useScene();
  const [arrived, setArrived] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<GateStatus>("idle");
  const [phase, setPhase] = useState<"lock" | "dark" | "lights" | "ready">("lock");
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const digits = codeDigits(s.secrets, s.gamesDone);

  useEffect(() => {
    later(() => setArrived(true), 1900);
    const t = timers.current;
    return () => t.forEach((x) => (window.clearTimeout(x), window.clearInterval(x)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const press = useCallback(
    (d: string) => {
      if (status === "granted" || !arrived) return;
      initAudio();
      if (d === "back" || d === "clear") {
        sfx.key();
        setCode((c) => (d === "back" ? c.slice(0, -1) : ""));
        setStatus("idle");
        return;
      }
      if (code.length >= 3) return;
      sfx.key();
      const next = code + d;
      setCode(next);
      setStatus("idle");
      if (next.length === 3) {
        later(() => {
          if (next === FINAL_CODE) {
            setStatus("granted");
            sfx.granted();
            later(() => {
              setPhase("dark");
              setFx({ blackout: true });
              sfx.powerDown();
            }, 1000);
            later(() => {
              setPhase("lights");
              setFx({ blackout: false, boost: 5, fireworks: true });
              sfx.powerUp();
              sfx.gate();
              sfx.firework();
              timers.current.push(window.setInterval(() => sfx.firework(), 2300));
            }, 2800);
            later(() => {
              sfx.fanfare();
              void announce(["Access granted!", "Welcome to the Final Night Challenge!"], 3600).then(() => setPhase("ready"));
            }, 3500);
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

  const opened = phase === "lights" || phase === "ready";
  const pose = !arrived ? "walk" : opened ? "cheer" : status === "granted" ? "clap" : code.length ? "point" : "look";

  return (
    <section className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 pb-24">
      <div className="relative">
        <ParkGate open={opened} lit={status === "granted" && phase !== "dark"} gears={opened} title="FINAL NIGHT ZONE" sub="🎆 Final Night Challenge 🎆" />
        <div
          className="absolute bottom-0 z-10"
          style={{ right: "50%", transform: arrived ? "translateX(50%)" : "translateX(-60vw)", transition: "transform 1.8s linear" }}
        >
          <Girl pose={pose} prop={!opened ? "ticket" : undefined} size={100} flip={!arrived} />
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div
          className={cn(
            "rounded-[28px] p-5 border-2 bg-gradient-to-b from-[#2a1a66] to-[#0b0f3a] transition-all",
            status === "denied" && "shake border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.5)]",
            status === "granted" && "border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.6)]",
            status === "idle" && "border-gold/70 shadow-[0_0_30px_rgba(255,207,74,0.3)]"
          )}
        >
          <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-center">
            <p className="en text-2xl sm:text-3xl font-bold text-gold neon-gold">🔒 FINAL NIGHT ZONE</p>
            <p className="font-bold mt-1 text-lav">«تحتاجين إلى رمز سري لفتح ليلة التحدي 🎆»</p>
            <div dir="ltr" className="flex justify-center gap-3 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-14 h-16 rounded-xl border-2 flex items-center justify-center en text-3xl font-bold transition-all",
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
              {status === "idle" && <p className="text-white/60 text-sm">{arrived ? "الرمز مخبّأ في تذاكركِ السرية 👇" : "✨ في الطريق إلى آخر المدينة…"}</p>}
            </div>
          </div>

          {/* collected secret tickets – no memorising needed */}
          {phase === "lock" && (
            <div className="mt-3 rounded-2xl bg-gold/10 border border-gold/40 p-3">
              <p className="text-sm font-bold text-center mb-2">🔐 تذاكركِ السرية</p>
              <div dir="ltr" className="flex justify-center gap-2">
                {digits.map((d, i) => (
                  <div key={i} className="en rounded-xl px-3 py-1.5 bg-gradient-to-br from-[#fff2a8] to-gold text-[#5a2a00] text-center shadow">
                    <p className="text-[10px] font-bold">SECRET #{i + 1}</p>
                    <p className="text-xl font-bold leading-none">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {phase !== "ready" ? (
            <div dir="ltr" className="grid grid-cols-3 gap-2.5 mt-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "back"].map((k) => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  disabled={status === "granted" || !arrived}
                  className={cn(
                    "en h-12 sm:h-14 rounded-2xl text-2xl font-bold border transition-all active:scale-95 disabled:opacity-40",
                    k === "clear" || k === "back"
                      ? "bg-white/5 border-white/20 text-lav text-lg"
                      : "bg-gradient-to-b from-[#4b3aa6] to-[#2a1a66] border-gold/30 hover:border-gold hover:shadow-[0_0_16px_rgba(255,207,74,0.5)]"
                  )}
                >
                  {k === "clear" ? "C" : k === "back" ? "⌫" : k}
                </button>
              ))}
            </div>
          ) : (
            <button
              className="btn-main w-full text-xl mt-4 glow-pulse"
              onClick={() => {
                sfx.click();
                travel("toFinal", { stage: "final", finalIndex: 0 });
              }}
            >
              ابدئي ليلة التحدي 🎯
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ 🎆 Final challenge ------------------------------ */
const FINAL_TITLES = ["✏️ أكملي الجملة", "✅ اختاري الجملة الصحيحة", "🕵️‍♀️ اكتشفي الخطأ", "🎬 رتّبي الجملة", "🗂️ صنّفي البطاقات", "🔗 طابقي الزوج"];
const BOOST_LABELS = ["🎡 أضاءت عجلة الملاهي!", "🎢 انطلقت الأفعوانية!", "🎠 دارت اللعبة الدوارة!", "🎈 طارت البالونات!", "✨ أضاءت كل الأكشاك!", "🎆 الألعاب النارية!"];
const BOOST_SFX = [sfx.creak, sfx.whoosh, sfx.chime, sfx.pop, sfx.powerUp, sfx.firework];

export function Final() {
  const { s, set } = useGame();
  const { setFx } = useScene();
  const i = Math.min(s.finalIndex, FINAL.length - 1);
  const q = FINAL[i];
  const [toast, setToast] = useState<number | null>(null);

  useEffect(() => {
    setFx({ boost: s.finalIndex });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (toast === null) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-3">
      <div className="flex items-center gap-2" dir="ltr">
        {FINAL.map((f, k) => (
          <span
            key={f.id}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center en text-sm font-bold border-2 transition-all",
              k < i ? "bg-gold text-[#4a1d00] border-white" : k === i ? "border-gold text-gold scale-110 shadow-[0_0_14px_rgba(255,207,74,0.7)]" : "border-white/20 text-white/40"
            )}
          >
            {k < i ? ["🎡", "🎢", "🎠", "🎈", "✨", "🎆"][k] : k + 1}
          </span>
        ))}
      </div>
      <p className="text-sm text-lav font-bold">كل إجابة صحيحة تُضيء لعبة في المدينة ✨</p>
      {toast !== null && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pop-in pointer-events-none">
          <div className="rounded-full px-6 py-2 bg-gradient-to-l from-gold to-pinky text-[#2a1450] font-extrabold text-lg sm:text-2xl shadow-[0_0_30px_rgba(255,207,74,0.7)] whitespace-nowrap">
            {BOOST_LABELS[toast]}
          </div>
        </div>
      )}
      <QuestionView
        key={q.id}
        q={q}
        title={FINAL_TITLES[i]}
        tone="from-amber-400/40 to-pink-600/40"
        step={`${i + 1} / ${FINAL.length}`}
        onCorrect={() => {
          setFx({ boost: i + 1 });
          setToast(i);
          window.setTimeout(() => BOOST_SFX[i]?.(), 350);
        }}
        onDone={() => {
          if (i + 1 >= FINAL.length) set({ stage: "ending", finishedAt: new Date().toISOString() });
          else set({ finalIndex: i + 1 });
        }}
      />
    </div>
  );
}
