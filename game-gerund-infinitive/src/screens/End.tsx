import { reportCertificate } from "../bridge";
import { useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { narrate, sfx } from "../audio";
import { useGame } from "../store";
import { TOTAL_SCORED } from "../data";
import Girl from "../components/Girl";
import ParkGate from "../components/ParkGate";
import { TicketStamp } from "../components/ui";

export function Ending({ onCelebrate, setCaption }: { onCelebrate: (v: boolean) => void; setCaption: (l: string[] | null) => void }) {
  const { s, set } = useGame();
  const [phase, setPhase] = useState(0);
  const [fly, setFly] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (s.tickets < 3) set({ tickets: 3 });
    const t = timers.current;
    return () => {
      t.forEach((x) => {
        window.clearTimeout(x);
        window.clearInterval(x);
      });
      setCaption(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSequence = () => {
    setPhase(1);
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    later(() => {
      setFly(true);
      [0, 250, 500].forEach((d) => later(() => sfx.stamp(), 700 + d));
    }, 900);
    later(() => {
      setOpen(true);
      sfx.gate();
    }, 2600);
    later(() => {
      onCelebrate(true);
      sfx.fanfare();
      sfx.firework();
      timers.current.push(window.setInterval(() => sfx.firework(), 2400));
    }, 4000);
    later(() => {
      const lines = ["Congratulations!", "You completed the Gerund and Infinitive Adventure!"];
      setCaption(lines);
      const min = new Promise((r) => window.setTimeout(r, 4000));
      void Promise.all([narrate(lines), min]).then(() => setDone(true));
    }, 4600);
  };

  if (phase === 0)
    return <TicketStamp n={3} label="ضعي التذاكر في البوابة 🎟️🎟️🎟️" note={<p className="font-bold text-lav">أنهيتِ ليلة التحدي الكبير! 🎆</p>} onContinue={startSequence} />;

  return (
    <section className="w-full max-w-4xl flex flex-col items-center gap-2 pb-28">
      <ParkGate open={open} lit gears={open} className="max-w-[440px]" />
      <div className="flex items-end justify-center gap-3 sm:gap-6 -mt-2">
        <Girl pose={open ? "cheer" : fly ? "point" : "ticket"} size={100} />
        <div className="flex gap-1 sm:gap-2 h-16 items-center">
          {[1, 2, 3].map((n, i) => (
            <div
              key={n}
              className={cn(fly && "fly-ticket")}
              style={{ animationDelay: `${i * 0.25}s`, ["--tx" as string]: `${-140 + i * 50}px`, ["--ty" as string]: "10px" }}
            >
              <div className="en rounded-lg bg-gradient-to-br from-[#fff2a8] to-gold text-[#5a2a00] font-bold px-2 py-1 text-sm sm:text-base shadow-[0_0_14px_rgba(255,207,74,0.7)] border border-white">🎟️{n}</div>
            </div>
          ))}
        </div>
        <div className={cn("rounded-2xl px-3 py-3 border-2 bg-gradient-to-b from-[#1e2466] to-[#0b0f3a] text-center transition-all", open ? "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)]" : "border-turq/60")}>
          <p className="en text-xs sm:text-sm font-bold text-turq">TICKET SLOT</p>
          <div className="mx-auto mt-2 w-16 h-2 rounded-full bg-black" />
          <p className="en text-sm mt-2 font-bold">{open ? "🟢 OPEN" : fly ? "⏳ ..." : "🎟️ ×3"}</p>
        </div>
      </div>
      {done && (
        <div className="text-center pop-in mt-4">
          <p className="display text-4xl sm:text-6xl text-gold neon-gold">أحسنتِ يا {s.name}! 🎡✨</p>
          <button
            className="btn-main text-xl mt-5"
            onClick={() => {
              sfx.click();
              setCaption(null);
              set({ stage: "review" });
            }}
          >
            المراجعة النهائية 🧠
          </button>
        </div>
      )}
    </section>
  );
}

export function Review() {
  const { set, score } = useGame();
  const [left, setLeft] = useState(5);
  useEffect(() => {
    const t = window.setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <section className="w-full max-w-3xl glass rounded-[28px] p-5 sm:p-8 text-center fade-up">
      <h2 className="display text-3xl sm:text-4xl text-gold neon-gold">🧠 المراجعة النهائية</h2>
      <div dir="ltr" className="grid grid-cols-2 gap-3 sm:gap-6 mt-6">
        <div className="rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-pink-500/25 to-fuchsia-800/25 border-2 border-pink-400/60">
          <p className="text-5xl">🎢</p>
          <p className="en text-2xl sm:text-4xl font-bold mt-2">GERUND</p>
          <p className="en text-xl sm:text-2xl text-turq">verb + ing</p>
          <p className="en text-2xl sm:text-3xl mt-3 font-semibold">
            <span className="text-pink-300">enjoy</span> <span className="text-turq">playing</span>
          </p>
        </div>
        <div className="rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-teal-400/25 to-cyan-800/25 border-2 border-turq/60">
          <p className="text-5xl">🎡</p>
          <p className="en text-2xl sm:text-4xl font-bold mt-2">INFINITIVE</p>
          <p className="en text-xl sm:text-2xl text-gold">to + verb</p>
          <p className="en text-2xl sm:text-3xl mt-3 font-semibold">
            <span className="text-pink-300">want</span> <span className="text-gold">to play</span>
          </p>
        </div>
      </div>
      <div dir="ltr" className="mt-6 rounded-2xl bg-white/10 p-4 space-y-2 en text-xl sm:text-3xl font-bold">
        <p>
          ENJOY → <span className="text-turq">-ING</span>
        </p>
        <p>
          WANT / NEED / HOPE / PLAN → <span className="text-gold">TO + VERB</span>
        </p>
      </div>
      <button className="btn-main text-xl mt-6" disabled={left > 0} onClick={() => { sfx.fanfare(); reportCertificate(score, TOTAL_SCORED, "مدينة الألعاب"); set({ stage: "certificate" }); }}>
        {left > 0 ? `الشهادة جاهزة بعد ${left}… ⏳` : "استلمي شهادتكِ 🏆"}
      </button>
    </section>
  );
}

export function Certificate() {
  const { s, score, reset } = useGame();
  const date = new Date(s.finishedAt || Date.now()).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  const c = (n: number) => `${n}cqw`;
  return (
    <section className="w-full max-w-5xl flex flex-col items-center gap-5 fade-up">
      <div
        id="certificate"
        className="relative w-full aspect-[297/210] rounded-2xl overflow-hidden text-center text-white shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        style={{
          containerType: "inline-size",
          background: "radial-gradient(ellipse at 50% 0%, #3a1f73 0%, #1b1760 45%, #0b0f3a 100%)",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* stars */}
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} className="absolute text-white/60" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, fontSize: c(0.6 + (i % 3) * 0.3) }}>
            ✦
          </span>
        ))}
        {/* ferris wheel watermark */}
        <svg viewBox="0 0 200 200" className="absolute opacity-[0.12]" style={{ width: c(34), left: c(-6), bottom: c(-6) }}>
          <circle cx="100" cy="100" r="90" fill="none" stroke="#ffcf4a" strokeWidth="4" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <g key={i}>
                <line x1="100" y1="100" x2={100 + Math.cos(a) * 90} y2={100 + Math.sin(a) * 90} stroke="#ffcf4a" strokeWidth="2" />
                <circle cx={100 + Math.cos(a) * 90} cy={100 + Math.sin(a) * 90} r="8" fill="#ff6fb5" />
              </g>
            );
          })}
        </svg>
        <div className="absolute rounded-xl border-gold" style={{ inset: c(1.4), borderWidth: c(0.35), borderStyle: "solid", borderRadius: c(1.5) }} />
        <div className="absolute border-gold/60" style={{ inset: c(2.2), borderWidth: c(0.12), borderStyle: "solid", borderRadius: c(1.1) }} />
        {[
          ["🎡", { top: c(2.6), right: c(3) }],
          ["🎢", { top: c(2.6), left: c(3) }],
          ["🎈", { bottom: c(2.6), right: c(3) }],
          ["🎠", { bottom: c(2.6), left: c(3) }],
        ].map(([e, pos]) => (
          <span key={e as string} className="absolute" style={{ ...(pos as object), fontSize: c(4) }}>
            {e as string}
          </span>
        ))}

        <div className="relative h-full flex flex-col items-center justify-center" style={{ padding: `${c(4)} ${c(9)}`, gap: c(0.9) }}>
          <div className="rounded-full border border-gold/70 bg-gold/15 font-extrabold text-gold" style={{ fontSize: c(1.9), padding: `${c(0.3)} ${c(2)}` }}>
            مبادرة جسر المدارس 🌉
          </div>
          <h1 className="display text-gold neon-gold leading-tight" style={{ fontSize: c(4.4) }}>
            🏆 «شهادة بطلة مدينة الألعاب» 🎡✨
          </h1>
          <p className="font-bold text-lav" style={{ fontSize: c(1.9) }}>
            تُمنح هذه الشهادة للطالبة:
          </p>
          <p className="display text-white neon-pink" style={{ fontSize: c(5), lineHeight: 1.1 }}>
            {s.name}
          </p>
          <div className="bg-gradient-to-l from-transparent via-gold to-transparent" style={{ width: c(36), height: c(0.2) }} />
          <p className="font-bold" style={{ fontSize: c(1.8) }}>
            لإتمامها بنجاح مغامرة: <span className="text-gold">«مدينة الاختيارات السرّية – <bdi className="en">Gerund & Infinitive</bdi>»</span>
          </p>
          <p style={{ fontSize: c(1.7) }}>
            وإظهارها فهمًا مميزًا لاستخدام <bdi className="en font-bold text-turq">Gerund & Infinitive</bdi>.
          </p>
          <div className="flex items-center justify-center" style={{ gap: c(3), marginTop: c(0.6) }}>
            <div className="rounded-2xl bg-white/10 border border-lav/40" style={{ padding: `${c(0.6)} ${c(2)}` }}>
              <p className="text-lav" style={{ fontSize: c(1.3) }}>
                الدرجة
              </p>
              <p className="en font-bold text-gold" style={{ fontSize: c(2.4) }}>
                {score} / {TOTAL_SCORED}
              </p>
            </div>
            <div style={{ fontSize: c(3) }}>🎟️🎟️🎟️</div>
            <div className="rounded-2xl bg-white/10 border border-lav/40" style={{ padding: `${c(0.6)} ${c(2)}` }}>
              <p className="text-lav" style={{ fontSize: c(1.3) }}>
                التاريخ
              </p>
              <p className="font-bold text-gold" style={{ fontSize: c(1.9) }}>
                {date}
              </p>
            </div>
          </div>
          <div style={{ marginTop: c(0.8) }}>
            <p className="display text-gold" style={{ fontSize: c(2.2) }}>
              مبادرة جسر المدارس 🌉
            </p>
            <p className="text-lav font-bold" style={{ fontSize: c(1.45) }}>
              «جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 no-print">
        <button
          className="btn-main text-xl"
          onClick={() => {
            sfx.click();
            window.print();
          }}
        >
          🖨️ طباعة الشهادة / حفظ PDF
        </button>
        <button
          className="btn-ghost"
          onClick={() => {
            sfx.click();
            reset();
          }}
        >
          مغامرة جديدة 🔄
        </button>
      </div>
    </section>
  );
}
