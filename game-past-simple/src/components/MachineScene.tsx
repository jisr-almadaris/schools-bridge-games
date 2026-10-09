import { useState } from "react";
import { IRREGULARS, SECRETS } from "../data";
import { Btn, Character, Instruction, Panel, SecretCard } from "./ui";
import { sfx, speak } from "../audio";
import { cn } from "../utils/cn";

const ED_VERBS = [
  { base: "play", emoji: "⚽" },
  { base: "watch", emoji: "📺" },
  { base: "visit", emoji: "👵" },
];

function Gear({ size, className, reverse }: { size: number; className?: string; reverse?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={cn(reverse ? "anim-spin-back" : "anim-spin-slow", className)}>
      <g fill="#f2b632" stroke="#b8860b" strokeWidth="2">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="44" y="2" width="12" height="20" rx="3" transform={`rotate(${i * 45} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="34" />
      </g>
      <circle cx="50" cy="50" r="12" fill="#7c5cc4" stroke="#4b2f8f" strokeWidth="3" />
    </svg>
  );
}

export default function MachineScene({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [idx, setIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);

  const current = ED_VERBS[idx];
  const allEdDone = outputs.length === ED_VERBS.length;

  const run = () => {
    if (running || !current) return;
    setRunning(true);
    sfx.machine();
    setTimeout(() => {
      setRunning(false);
      setOutputs((o) => [...o, current.base + "ed"]);
      sfx.sparkle();
      speak(`${current.base}. ${current.base}ed.`);
      setIdx((i) => i + 1);
    }, 1500);
  };

  /* ---------- الخطوة 0: الآلة ---------- */
  if (step === 0) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_0_#4b2f8f]">آلة الزمن ⏳✨</h2>
        <Instruction>{allEdDone ? "أحسنتِ! ⭐" : "ضعي الفعل في الآلة ثم شغّليها."}</Instruction>

        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:gap-10">
          <Character size="sm" />

          {/* الآلة */}
          <div
            className={cn(
              "relative w-full max-w-md rounded-[2rem] border-8 border-[#c9962b] bg-gradient-to-b from-[#6a48bf] to-[#3d2a80] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.5)]",
              running && "anim-glow",
            )}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-[#c9962b] bg-[#ffe08a] px-4 py-1 text-base font-black text-[#4b2f8f]">
              آلة الزمن
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Gear size={running ? 70 : 60} className={cn("transition-all", !running && "[animation-play-state:paused]")} />
              <Gear size={running ? 50 : 42} reverse className={cn(!running && "[animation-play-state:paused]")} />
              <span className={cn("text-5xl", running && "anim-spin-slow")}>⏳</span>
              <Gear size={running ? 50 : 42} className={cn(!running && "[animation-play-state:paused]")} />
            </div>

            {/* المدخل */}
            <div className="en mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl bg-[#171644]/60 p-3">
              <div className="rounded-xl bg-white px-3 py-3 text-2xl sm:text-3xl font-bold text-[#4b2f8f]">
                {current ? (
                  <>
                    <span className="mr-1 text-xl">{current.emoji}</span>
                    {current.base}
                  </>
                ) : (
                  "✓"
                )}
              </div>
              <div className="text-3xl text-[#ffe08a]">➜</div>
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl px-3 py-3 text-2xl sm:text-3xl font-bold",
                  running ? "bg-[#ffe08a]/40 text-white" : "bg-white text-[#0b5f55]",
                )}
              >
                {running ? (
                  <>
                    <span className="opacity-60">…</span>
                    <span className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent" style={{ animation: "lightSweep 0.8s linear infinite" }} />
                  </>
                ) : outputs.length ? (
                  <>
                    {outputs[outputs.length - 1].slice(0, -2)}
                    <span className="ed">ed</span> ⭐
                  </>
                ) : (
                  <span className="text-gray-300">?</span>
                )}
              </div>
            </div>

            {!allEdDone && (
              <Btn onClick={run} disabled={running} className="mt-4 w-full">
                {running ? "الآلة تعمل… ⚙️" : "شغّلي الآلة ⚡"}
              </Btn>
            )}

            {/* المخرجات */}
            {outputs.length > 0 && (
              <div className="en mt-4 flex flex-wrap justify-center gap-2">
                {outputs.map((o, i) => (
                  <span key={o} className="anim-pop rounded-full bg-white px-3 py-1 text-lg font-bold text-[#4b2f8f]">
                    {ED_VERBS[i].base} → {o.slice(0, -2)}
                    <span className="ed">ed</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {allEdDone && (
          <Panel className="anim-pop max-w-xl">
            <p className="text-xl sm:text-2xl font-black text-[#4b2f8f]">
              «مع كثير من الأفعال نضيف <span className="ed en">ed</span> عندما نتحدث عن الماضي.»
            </p>
            <div className="en mt-4 grid grid-cols-2 gap-3" dir="ltr">
              <div className="rounded-2xl bg-[#fff3cc] p-3">
                <div className="text-sm font-bold text-[#c9962b]">TODAY ☀️</div>
                <div className="text-2xl font-bold text-[#2a2760]">I play.</div>
              </div>
              <div className="rounded-2xl bg-[#e4dcf7] p-3">
                <div className="text-sm font-bold text-[#4b2f8f]">YESTERDAY 🌙</div>
                <div className="text-2xl font-bold text-[#2a2760]">
                  I play<span className="ed">ed</span>.
                </div>
              </div>
            </div>
            <Btn onClick={() => setStep(1)} className="mt-4">
              اضغطي للمتابعة ⏭
            </Btn>
          </Panel>
        )}
      </div>
    );
  }

  /* ---------- الخطوة 1: أفعال مميزة ---------- */
  if (step === 1) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-[#ffe08a] drop-shadow-[0_3px_0_#4b2f8f]">أفعال مميزة ⭐</h2>
        <Panel className="max-w-xl py-3">
          <p className="text-lg sm:text-xl font-black text-[#4b2f8f]">
            «بعض الأفعال لا نضيف لها <span className="ed en">ed</span>، بل يتغير شكلها.»
          </p>
        </Panel>
        <Instruction>اضغطي على البطاقة الذهبية لتقلبيها.</Instruction>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {IRREGULARS.map((v, i) => {
            const isFlipped = flipped.includes(v.base);
            return (
              <button
                key={v.base}
                type="button"
                onClick={() => {
                  if (!isFlipped) {
                    setFlipped((f) => [...f, v.base]);
                    sfx.album();
                    speak(`${v.base}, ${v.past}. ${v.yesterday}`);
                  } else speak(v.yesterday);
                }}
                className={cn(
                  "anim-pop relative min-h-[13rem] w-40 sm:w-48 cursor-pointer rounded-3xl border-4 p-4 text-center shadow-2xl transition-all hover:-translate-y-1",
                  `delay-${i + 1}`,
                  isFlipped
                    ? "border-[#2fbfb0] bg-gradient-to-b from-white to-[#d5f7ef]"
                    : "border-[#c9962b] bg-gradient-to-b from-[#ffe8a8] to-[#f2b632]",
                  v.base === "go" && "ring-4 ring-[#ffe08a]",
                )}
              >
                <div className="text-5xl">{v.emoji}</div>
                {isFlipped ? (
                  <div className="en anim-flip-in mt-2">
                    <div className="text-2xl font-bold text-[#4b2f8f]">
                      {v.base} → <span className="text-[#e0457b]">{v.past}</span>
                    </div>
                    <div className="mt-2 text-xs font-bold text-[#c9962b]">Today:</div>
                    <div className="text-sm font-semibold text-[#2a2760]">{v.today}</div>
                    <div className="mt-1 text-xs font-bold text-[#4b2f8f]">Yesterday:</div>
                    <div className="text-sm font-semibold text-[#2a2760]">
                      {v.yesterday.split(v.past)[0]}
                      <span className="text-[#e0457b] font-bold">{v.past}</span>
                      {v.yesterday.split(v.past)[1]}
                    </div>
                  </div>
                ) : (
                  <div className="en mt-3">
                    <div className="text-3xl font-bold text-[#4b2f8f]">{v.base}</div>
                    <div className="mt-2 text-2xl">→ ❓</div>
                    {v.base === "go" && <div className="mt-2 text-xs font-black text-[#4b2f8f]">ابدئي هنا ⭐</div>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {flipped.length >= IRREGULARS.length && (
          <>
            <div className="en anim-pop rounded-full bg-white px-6 py-2 text-2xl sm:text-3xl font-bold text-[#4b2f8f] shadow-xl">
              go → <span className="text-[#e0457b]">went</span> ⭐
            </div>
            <SecretCard text={SECRETS[2]} />
            <Btn onClick={() => setStep(2)} className="anim-pop">
              اضغطي للمتابعة ⏭
            </Btn>
          </>
        )}
        {flipped.length < IRREGULARS.length && <p className="font-bold text-white/90">قلبتِ {flipped.length} من 4 بطاقات</p>}
      </div>
    );
  }

  /* ---------- الخطوة 2: نفس الفعل مع الجميع ---------- */
  const pron = [
    { p: "I", e: "👧🏻" },
    { p: "She", e: "👩🏻" },
    { p: "They", e: "👨‍👩‍👧" },
  ];
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_0_#4b2f8f]">نفس الفعل مع الجميع! ⭐</h2>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
        <Character size="sm" />
        <Panel className="max-w-2xl">
          <div className="en grid grid-cols-3 gap-3" dir="ltr">
            {pron.map((x, i) => (
              <div key={x.p} className={cn("anim-pop rounded-2xl bg-[#f3eefc] p-3", `delay-${i + 1}`)}>
                <div className="text-4xl">{x.e}</div>
                <div className="text-2xl font-bold text-[#4b2f8f]">{x.p}</div>
                <div className="text-2xl">↓</div>
                <div className="rounded-xl bg-[#7fe3d8] px-2 py-1 text-xl sm:text-2xl font-bold text-[#0b3f3a]">
                  play<span className="ed">ed</span>
                </div>
              </div>
            ))}
          </div>
          <div className="en mt-4 space-y-1 text-xl sm:text-2xl font-bold text-[#2a2760]">
            <div>I played. &nbsp; She played. &nbsp; They played.</div>
          </div>
          <p className="mt-3 text-2xl font-black text-[#4b2f8f]">«نفس الفعل مع الجميع! ⭐»</p>
          <p className="mt-1 text-base font-bold text-[#7c5cc4]">
            I / You / He / She / We / They → <span className="en">played</span>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Btn variant="teal" onClick={() => speak("I played. She played. They played.")}>
              🔊 استمعي
            </Btn>
          </div>
        </Panel>
      </div>
      <SecretCard text={SECRETS[3]} />
      <Btn onClick={onDone} className="text-2xl">
        إلى ألبوم الذكريات 📖
      </Btn>
    </div>
  );
}
