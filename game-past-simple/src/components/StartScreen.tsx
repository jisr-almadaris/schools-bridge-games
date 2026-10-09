import { useState } from "react";
import { Btn, Character, Sparkles } from "./ui";
import { GAME_TITLE_AR, GAME_TITLE_EN, INITIATIVE, INITIATIVE_TAGLINE } from "../data";
import { unlockAudio } from "../audio";

export default function StartScreen({
  savedName,
  hasProgress,
  onStart,
  onContinue,
}: {
  savedName: string;
  hasProgress: boolean;
  onStart: (name: string) => void;
  onContinue: () => void;
}) {
  const [name, setName] = useState(savedName);
  const [err, setErr] = useState(false);

  const start = () => {
    unlockAudio();
    if (!name.trim()) {
      setErr(true);
      return;
    }
    onStart(name.trim());
  };

  return (
    <div className="museum-bg relative min-h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[#171644]/70 via-[#2a2760]/55 to-[#171644]/85" />
      <Sparkles count={26} />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-8">
        {/* هوية المبادرة - الأولوية البصرية الأولى */}
        <div className="anim-pop w-full max-w-3xl rounded-3xl border-4 border-[#f7c948] bg-gradient-to-l from-[#4b2f8f] to-[#6a48bf] px-5 py-5 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-[#ffe08a] drop-shadow">{INITIATIVE}</h1>
          <p className="mt-3 text-base sm:text-xl lg:text-2xl font-bold leading-relaxed text-white">{INITIATIVE_TAGLINE}</p>
        </div>

        <div className="mt-6 flex w-full max-w-5xl flex-col items-center gap-6 lg:flex-row lg:justify-between">
          <div className="anim-fade-up delay-2 flex-1 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-[0_4px_0_#4b2f8f]">{GAME_TITLE_AR}</h2>
            <p className="en mt-2 text-2xl sm:text-3xl font-bold text-[#7fe3d8]">{GAME_TITLE_EN}</p>

            <div className="glass mx-auto mt-6 w-full max-w-md rounded-3xl border-2 border-[#f7c948]/70 p-5 shadow-2xl">
              <label className="block text-lg font-extrabold text-[#4b2f8f]">اسم الطالبة 👧🏻</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErr(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && start()}
                placeholder="اكتبي اسمكِ هنا…"
                className="mt-2 w-full rounded-2xl border-2 border-[#b9a4e6] bg-white px-4 py-3 text-center text-xl font-bold text-[#2a2760] outline-none focus:border-[#7c5cc4] focus:ring-4 focus:ring-[#b9a4e6]/50"
                maxLength={30}
              />
              {err && <p className="mt-2 text-sm font-bold text-rose-600">اكتبي اسمكِ أولًا 😊</p>}
              <Btn onClick={start} className="mt-4 w-full text-2xl">
                ابدئي الجولة ✨
              </Btn>
              {hasProgress && (
                <Btn onClick={onContinue} variant="teal" className="mt-3 w-full">
                  متابعة جولتي السابقة ⏳
                </Btn>
              )}
            </div>
          </div>

          <div className="anim-fade-up delay-3 flex-shrink-0">
            <Character size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
