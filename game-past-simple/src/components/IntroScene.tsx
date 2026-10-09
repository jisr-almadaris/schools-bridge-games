import { useEffect, useState } from "react";
import { Btn, Character, Clock, Instruction, MemoryFrame, Panel, SecretCard } from "./ui";
import { sfx, speak } from "../audio";
import { SECRETS } from "../data";

/**
 * مشهد الدخول: الأبواب → الساعة → معنى Past Simple → اليوم/أمس → الشرح الأول بالصور.
 */
export default function IntroScene({ name, onDone }: { name: string; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [clockBack, setClockBack] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [memoryMode, setMemoryMode] = useState(false);

  // الأبواب
  useEffect(() => {
    if (step !== 0) return;
    const t1 = setTimeout(() => {
      setDoorsOpen(true);
      sfx.door();
    }, 700);
    const t2 = setTimeout(() => setStep(1), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step]);

  // الساعة ترجع للخلف
  useEffect(() => {
    if (step !== 1) return;
    const t1 = setTimeout(() => {
      setClockBack(true);
      sfx.clockBack();
    }, 600);
    const t2 = setTimeout(() => {
      setShowTitle(true);
      sfx.timeTravel();
    }, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step]);

  // الصورة تتحول إلى ذكرى
  useEffect(() => {
    if (step !== 3) return;
    setMemoryMode(false);
    const t = setTimeout(() => {
      setMemoryMode(true);
      sfx.sparkle();
      speak("Yesterday, I played football.");
    }, 1400);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step === 4) speak("Last night, she watched TV.");
  }, [step]);

  /* ---------- الخطوة 0: الأبواب ---------- */
  if (step === 0) {
    return (
      <div className="relative flex min-h-[70vh] flex-col items-center justify-center">
        <div className="relative h-[60vh] w-full max-w-3xl overflow-hidden rounded-t-[10rem] border-8 border-[#c9962b] bg-[#2a2760]/60 shadow-2xl">
          <div className="absolute inset-0 grid place-items-center">
            <div className="anim-walk-in text-center">
              <Character size="md" animate="none" />
              <p className="mt-2 text-xl font-black text-[#ffe08a]">أهلًا {name}! 🌟</p>
            </div>
          </div>
          <div className={`door-left absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-[#5a3aa8] to-[#7c5cc4] border-r-2 border-[#f7c948] ${doorsOpen ? "open" : ""}`}>
            <div className="absolute inset-4 rounded-t-[8rem] border-4 border-[#f7c948]/70" />
            <div className="absolute right-4 top-1/2 h-8 w-8 rounded-full bg-[#f7c948] shadow" />
          </div>
          <div className={`door-right absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-[#5a3aa8] to-[#7c5cc4] border-l-2 border-[#f7c948] ${doorsOpen ? "open" : ""}`}>
            <div className="absolute inset-4 rounded-t-[8rem] border-4 border-[#f7c948]/70" />
            <div className="absolute left-4 top-1/2 h-8 w-8 rounded-full bg-[#f7c948] shadow" />
          </div>
        </div>
        <p className="mt-4 text-2xl font-black text-white drop-shadow">أبواب المتحف تُفتح… ✨</p>
      </div>
    );
  }

  /* ---------- الخطوة 1: الساعة ---------- */
  if (step === 1) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-10">
          <Character size="md" />
          <div className="anim-pop">
            <Clock size={220} back={clockBack} />
          </div>
        </div>
        {clockBack && <p className="anim-pop text-3xl sm:text-4xl font-black text-[#ffe08a] drop-shadow">«لنرجع قليلًا إلى الماضي! ⏳»</p>}
        {showTitle && (
          <Panel className="anim-pop max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-black text-[#4b2f8f]">
              <span className="en">Past Simple</span> الماضي البسيط
            </h2>
            <p className="mt-3 text-lg sm:text-xl font-bold leading-relaxed">
              «نستخدم <span className="en text-[#7c5cc4]">Past Simple</span> لنتحدث عن شيء حدث وانتهى في الماضي.»
            </p>
            <Btn onClick={() => setStep(2)} className="mt-4">
              اضغطي للمتابعة ⏭
            </Btn>
          </Panel>
        )}
      </div>
    );
  }

  /* ---------- الخطوة 2: اليوم / أمس ---------- */
  if (step === 2) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <Instruction>كلمات الزمن ⏰</Instruction>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="anim-pop rounded-3xl border-4 border-white/70 bg-gradient-to-b from-[#fff9e6] to-[#ffe9b3] p-5 shadow-2xl">
            <div className="text-6xl">☀️</div>
            <div className="en mt-2 text-3xl font-black text-[#c9962b]">TODAY</div>
            <div className="text-2xl font-black text-[#2a2760]">اليوم</div>
            <div className="mt-1 text-sm font-bold text-[#7c5cc4]">الآن</div>
          </div>
          <div className="text-4xl font-black text-white">⬅️</div>
          <div className="anim-pop delay-2 anim-glow rounded-3xl border-4 border-[#f7c948] bg-gradient-to-b from-[#ede7f6] to-[#c9b8ee] p-5 shadow-2xl scale-110">
            <div className="text-6xl">🌙</div>
            <div className="en mt-2 text-3xl font-black text-[#4b2f8f]">YESTERDAY ⭐</div>
            <div className="text-2xl font-black text-[#2a2760]">أمس</div>
            <div className="mt-1 text-sm font-bold text-[#7c5cc4]">حدث وانتهى</div>
          </div>
        </div>
        <SecretCard text={SECRETS[0]} />
        <Btn onClick={() => setStep(3)}>اضغطي للمتابعة ⏭</Btn>
      </div>
    );
  }

  /* ---------- الخطوة 3: الشرح الأول ---------- */
  if (step === 3) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <Instruction>انظري كيف تصبح الصورة ذكرى ✨</Instruction>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
          <Character size="sm" />
          <div className={`transition-all duration-700 ${memoryMode ? "rotate-[-2deg]" : ""}`}>
            {memoryMode ? (
              <MemoryFrame src="/schools-bridge-games/game-past-simple/images/memory-football.jpg" size="lg" />
            ) : (
              <img src="/schools-bridge-games/game-past-simple/images/memory-football.jpg" alt="" className="w-60 sm:w-80 lg:w-96 rounded-2xl shadow-2xl" style={{ aspectRatio: "4/3", objectFit: "cover" }} />
            )}
          </div>
        </div>
        {memoryMode && (
          <Panel className="anim-pop max-w-xl">
            <p className="en text-2xl sm:text-3xl font-bold text-[#2a2760]">
              <mark className="rounded-lg bg-[#ffe08a] px-2 py-0.5 text-[#4b2f8f]">Yesterday</mark>, I{" "}
              <mark className="rounded-lg bg-[#7fe3d8] px-2 py-0.5 text-[#0b3f3a]">played</mark> football.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3 text-base font-bold">
              <span className="rounded-full bg-[#ffe08a] px-3 py-1 text-[#4b2f8f]">Yesterday = أمس ⏳</span>
              <span className="rounded-full bg-[#7fe3d8] px-3 py-1 text-[#0b3f3a]">played = لعبتُ (في الماضي)</span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Btn variant="teal" onClick={() => speak("Yesterday, I played football.")}>
                🔊 استمعي
              </Btn>
              <Btn onClick={() => setStep(4)}>اضغطي للمتابعة ⏭</Btn>
            </div>
          </Panel>
        )}
      </div>
    );
  }

  /* ---------- الخطوة 4: مثال ثانٍ ---------- */
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <Instruction>ذكرى أخرى 🖼️</Instruction>
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
        <Character size="sm" />
        <div className="anim-pop -rotate-1">
          <MemoryFrame src="/schools-bridge-games/game-past-simple/images/memory-tv.jpg" size="lg" />
        </div>
      </div>
      <Panel className="anim-pop max-w-xl">
        <p className="en text-2xl sm:text-3xl font-bold text-[#2a2760]">
          <mark className="rounded-lg bg-[#ffe08a] px-2 py-0.5 text-[#4b2f8f]">Last night</mark>, she{" "}
          <mark className="rounded-lg bg-[#7fe3d8] px-2 py-0.5 text-[#0b3f3a]">watched</mark> TV.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3 text-base font-bold">
          <span className="rounded-full bg-[#ffe08a] px-3 py-1 text-[#4b2f8f]">Last night = الليلة الماضية 🌙</span>
          <span className="rounded-full bg-[#7fe3d8] px-3 py-1 text-[#0b3f3a]">watched = شاهدت</span>
        </div>
        <p className="mt-4 text-2xl font-black text-[#4b2f8f]">«حدث وانتهى في الماضي ⏳»</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Btn variant="teal" onClick={() => speak("Last night, she watched TV.")}>
            🔊 استمعي
          </Btn>
          <Btn onClick={onDone}>ندخل قاعة الأمس 🖼️</Btn>
        </div>
      </Panel>
    </div>
  );
}
