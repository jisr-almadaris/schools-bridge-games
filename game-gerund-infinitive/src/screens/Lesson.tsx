import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { sfx } from "../audio";
import { useGame } from "../store";
import Girl from "../components/Girl";
import { SceneArt } from "../components/questions";
import { ChoiceMap, TicketStamp } from "../components/ui";
import { useScene } from "../scene";

function Board({ tag, tone, children }: { tag: string; tone: "pink" | "turq"; children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative w-full rounded-[28px] p-5 sm:p-8 glass border-2 text-center",
        tone === "pink" ? "border-pink-400/80 shadow-[0_0_50px_rgba(255,111,181,0.35)]" : "border-turq/80 shadow-[0_0_50px_rgba(62,230,214,0.35)]"
      )}
    >
      <div className="bulb-row absolute -top-2 left-8 right-8 flex justify-between">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={cn("w-2.5 h-2.5 rounded-full", tone === "pink" ? "bg-pink-300" : "bg-turq")} />
        ))}
      </div>
      <p className="text-lav font-bold mb-1">{tag}</p>
      {children}
    </div>
  );
}

const Step = ({ d, children, className }: { d: number; children: ReactNode; className?: string }) => (
  <div className={cn("fade-up", className)} style={{ animationDelay: `${d}s` }}>
    {children}
  </div>
);

export default function Lesson() {
  const { s, set } = useGame();
  const { travel } = useScene();
  const step = s.lessonStep;
  const next = (n: number) => {
    sfx.click();
    set({ lessonStep: n });
  };

  if (step >= 4)
    return (
      <TicketStamp
        n={1}
        label="افتحي منطقة الألعاب 🎢"
        note={<p className="font-bold text-lav">فهمتِ الفرق بين GERUND و INFINITIVE! 🎉</p>}
        onContinue={() => {
          sfx.chime();
          travel("toHub", { tickets: Math.max(s.tickets, 1), stage: "hub" });
        }}
      />
    );

  if (step === 3)
    return (
      <section className="w-full max-w-4xl flex flex-col items-center gap-3 fade-up">
        <div className="glass rounded-[28px] p-4 sm:p-7 w-full relative">
          <div className="absolute -top-10 left-4 hidden sm:block">
            <Girl pose="point" size={80} flip />
          </div>
          <ChoiceMap />
          <div className="flex justify-center gap-3 mt-5">
            <button className="btn-ghost" onClick={() => next(2)}>
              → السابق
            </button>
            <button className="btn-main text-lg" onClick={() => next(4)}>
              فهمت! 🎟️
            </button>
          </div>
        </div>
      </section>
    );

  return (
    <section key={step} className="w-full max-w-5xl flex items-center gap-4 lg:gap-8">
      <div className="hidden md:block shrink-0">
        <Girl pose={step === 2 ? "look" : "point"} size={150} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-center display text-2xl sm:text-3xl text-gold neon-gold mb-4 fade-up">🔐 بوابة الأسرار</p>

        {step === 0 && (
          <Board tag="اللوح الأول" tone="pink">
            <Step d={0.1}>
              <p className="en text-4xl sm:text-6xl font-bold neon-pink">🎟️ GERUND</p>
              <p dir="ltr" className="en text-2xl sm:text-4xl mt-2">
                verb <span className="text-turq neon-turq">+ ing</span>
              </p>
            </Step>
            <Step d={0.9}>
              <p dir="ltr" className="en text-3xl sm:text-5xl font-bold mt-6">
                I <span className="text-pink-300 bg-pink-500/15 rounded-xl px-2">enjoy</span> <span className="text-turq bg-turq/15 rounded-xl px-2">playing</span>. 🎮
              </p>
            </Step>
            <Step d={1.8}>
              <p dir="ltr" className="en text-2xl sm:text-3xl mt-6 inline-block rounded-2xl bg-white/10 px-5 py-2">
                <span className="text-pink-300">enjoy</span> → <span className="text-turq">verb + ing</span>
              </p>
            </Step>
            <Step d={2.6}>
              <p className="text-lav mt-5 font-bold">مثال آخر:</p>
              <p dir="ltr" className="en text-2xl sm:text-4xl font-semibold mt-1">
                I <span className="text-pink-300">enjoy</span> <span className="text-turq">reading</span>. 📖
              </p>
            </Step>
            <Step d={3.2}>
              <button className="btn-main text-lg mt-6" onClick={() => next(1)}>
                التالي ✨
              </button>
            </Step>
          </Board>
        )}

        {step === 1 && (
          <Board tag="اللوح الثاني" tone="turq">
            <Step d={0.1}>
              <p className="en text-4xl sm:text-6xl font-bold neon-turq">🎟️ INFINITIVE</p>
              <p dir="ltr" className="en text-2xl sm:text-4xl mt-2">
                <span className="text-gold neon-gold">to +</span> verb
              </p>
            </Step>
            <Step d={0.9}>
              <p dir="ltr" className="en text-3xl sm:text-5xl font-bold mt-6">
                I <span className="text-pink-300 bg-pink-500/15 rounded-xl px-2">want</span> <span className="text-gold bg-gold/15 rounded-xl px-2">to play</span>. 🎮
              </p>
            </Step>
            <Step d={1.8}>
              <p dir="ltr" className="en text-2xl sm:text-3xl mt-6 inline-block rounded-2xl bg-white/10 px-5 py-2">
                <span className="text-pink-300">want</span> → <span className="text-gold">to + verb</span>
              </p>
            </Step>
            <Step d={2.6}>
              <p className="text-lav mt-5 font-bold">مثال آخر:</p>
              <p dir="ltr" className="en text-2xl sm:text-4xl font-semibold mt-1">
                I <span className="text-pink-300">want</span> <span className="text-gold">to read</span>. 📖
              </p>
            </Step>
            <Step d={3.2}>
              <div className="flex justify-center gap-3 mt-6">
                <button className="btn-ghost" onClick={() => next(0)}>
                  → السابق
                </button>
                <button className="btn-main text-lg" onClick={() => next(2)}>
                  التالي ✨
                </button>
              </div>
            </Step>
          </Board>
        )}

        {step === 2 && (
          <div className="glass rounded-[28px] p-4 sm:p-7 text-center">
            <p className="display text-2xl sm:text-3xl">⚖️ المقارنة</p>
            <div dir="ltr" className="grid grid-cols-2 gap-3 sm:gap-6 mt-4">
              <Step d={0.1} className="rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-pink-500/25 to-fuchsia-800/20 border border-pink-400/60">
                <p className="en text-xl sm:text-3xl font-bold">🎢 GERUND</p>
                <p className="en text-xl sm:text-3xl mt-2">
                  <span className="text-pink-300">enjoy</span> + <span className="text-turq">playing</span>
                </p>
                <p className="en text-white/70 sm:text-xl mt-1">verb + ing</p>
              </Step>
              <Step d={0.5} className="rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-teal-400/25 to-cyan-800/20 border border-turq/60">
                <p className="en text-xl sm:text-3xl font-bold">🎡 INFINITIVE</p>
                <p className="en text-xl sm:text-3xl mt-2">
                  <span className="text-pink-300">want</span> + <span className="text-gold">to play</span>
                </p>
                <p className="en text-white/70 sm:text-xl mt-1">to + verb</p>
              </Step>
            </div>
            <Step d={1.1}>
              <div className="mx-auto mt-5 w-64 sm:w-80 h-36 sm:h-44 rounded-2xl p-1.5 bg-gradient-to-br from-turq to-lav">
                <div className="w-full h-full rounded-xl bg-[#151a52] overflow-hidden">
                  <SceneArt scene="swim" />
                </div>
              </div>
              <p className="text-sm text-lav mt-2">صورة واحدة… والاختلاف فقط في شكل الفعل بعد الكلمة 👀</p>
            </Step>
            <Step d={1.7}>
              <div dir="ltr" className="grid grid-cols-2 gap-3 sm:gap-6 mt-4">
                <p className="en text-xl sm:text-3xl font-semibold">
                  I <span className="text-pink-300">enjoy</span> <span className="text-turq">swimming</span>.
                </p>
                <p className="en text-xl sm:text-3xl font-semibold">
                  I <span className="text-pink-300">want</span> <span className="text-gold">to swim</span>.
                </p>
              </div>
            </Step>
            <Step d={2.3}>
              <div className="flex justify-center gap-3 mt-6">
                <button className="btn-ghost" onClick={() => next(1)}>
                  → السابق
                </button>
                <button className="btn-main text-lg" onClick={() => next(3)}>
                  🗺️ خريطة الاختيارات
                </button>
              </div>
            </Step>
          </div>
        )}
      </div>
    </section>
  );
}
