import { useState } from "react";
import { Ship } from "../graphics";
import { INITIATIVE } from "../data";
import { sound } from "../sound";

export default function Welcome({
  savedName,
  onStart,
}: {
  savedName: string;
  onStart: (name: string) => void;
}) {
  const [name, setName] = useState(savedName);
  const [sailing, setSailing] = useState(false);
  const [shake, setShake] = useState(false);

  const go = () => {
    if (!name.trim()) {
      setShake(true);
      sound.wrong();
      setTimeout(() => setShake(false), 900);
      return;
    }
    sound.click();
    sound.setMuted(sound.muted); // starts music if not muted
    sound.ship();
    setSailing(true);
    setTimeout(() => onStart(name.trim()), 2600);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-violet-600 via-purple-500 to-sky-400">
      {/* sun + clouds */}
      <div className="absolute left-8 top-8 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 shadow-[0_0_60px_20px_rgba(253,224,71,0.5)]" />
      <div className="absolute right-[12%] top-16 h-8 w-32 rounded-full bg-white/70 blur-[1px] animate-floaty" />
      <div className="absolute left-[30%] top-28 h-6 w-24 rounded-full bg-white/50 blur-[1px] animate-floaty" style={{ animationDelay: "1.2s" }} />
      <div className="absolute right-[35%] top-6 h-7 w-28 rounded-full bg-white/60 blur-[1px] animate-floaty" style={{ animationDelay: "0.6s" }} />
      {/* sparkles */}
      {["10%", "25%", "70%", "85%", "50%"].map((l, i) => (
        <div key={i} className="absolute animate-sparkle text-2xl" style={{ left: l, top: `${12 + i * 7}%`, animationDelay: `${i * 0.4}s` }}>
          ✨
        </div>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-10 text-center">
        <div className="animate-pop rounded-3xl bg-white/15 px-6 py-2 text-lg font-bold text-yellow-200 backdrop-blur-sm ring-2 ring-yellow-300/40">
          مغامرة تعليمية بحرية ممتعة 🌊
        </div>
        <h1 className="font-display mt-4 animate-slide-up text-4xl font-extrabold leading-tight text-white drop-shadow-[0_4px_12px_rgba(76,29,149,0.6)] sm:text-6xl">
          رحلة إلى جزر المقارنات
        </h1>
        <p className="mt-3 animate-slide-up text-lg font-bold text-violet-100 sm:text-2xl" style={{ animationDelay: "0.15s" }}>
          تعلّمي Comparative & Superlative عبر خمس جزر ساحرة! 🏝️
        </p>

        {/* Ship */}
        <div className={sailing ? "animate-sail-away mt-4" : "animate-bob mt-4"}>
          <Ship className="h-44 w-56 drop-shadow-2xl sm:h-56 sm:w-72" />
        </div>

        {/* Name card */}
        {!sailing && (
          <div
            className={`mt-2 w-full max-w-md animate-slide-up rounded-3xl bg-white/95 p-6 shadow-2xl ring-4 ring-yellow-300/70 ${shake ? "animate-wiggle" : ""}`}
            style={{ animationDelay: "0.3s" }}
          >
            <label className="mb-3 block text-xl font-extrabold text-purple-800">
              ما اسمك أيتها البطلة؟ 👧
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="اكتبي اسمك هنا..."
              className="w-full rounded-2xl border-4 border-violet-300 bg-violet-50 px-4 py-3 text-center text-xl font-bold text-purple-900 outline-none transition focus:border-teal-400 focus:bg-white"
            />
            <button
              onClick={go}
              className="mt-4 w-full rounded-2xl bg-gradient-to-l from-teal-400 to-emerald-500 px-6 py-4 text-2xl font-extrabold text-white shadow-lg shadow-teal-500/40 transition hover:scale-[1.03] hover:shadow-xl active:scale-95"
            >
              {savedName ? "أكملي رحلتك! 🚢" : "انطلقي في الرحلة! 🚢"}
            </button>
          </div>
        )}
        {sailing && (
          <p className="animate-pop mt-6 text-2xl font-extrabold text-white drop-shadow-lg">
            أبحري يا {name.trim()}... الجزر في انتظارك! 🌟
          </p>
        )}
      </div>

      {/* waves */}
      <div className="relative z-0 h-28 overflow-hidden">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute bottom-0 h-full w-[200%] animate-wave-slow">
          <path d="M0,40 C120,80 240,0 360,40 C480,80 600,0 720,40 C840,80 960,0 1080,40 C1200,80 1320,0 1440,40 L1440,120 L0,120 Z" fill="#0ea5e9" opacity="0.7" />
        </svg>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute bottom-0 h-full w-[200%] animate-wave">
          <path d="M0,60 C120,100 240,20 360,60 C480,100 600,20 720,60 C840,100 960,20 1080,60 C1200,100 1320,20 1440,60 L1440,120 L0,120 Z" fill="#0284c7" />
        </svg>
      </div>

      {/* Initiative footer */}
      <footer className="relative z-10 bg-gradient-to-l from-sky-700 to-blue-800 px-4 py-4 text-center">
        <p className="text-lg font-extrabold text-yellow-300">{INITIATIVE.title}</p>
        <p className="mt-1 text-sm font-semibold text-sky-100">{INITIATIVE.motto}</p>
      </footer>
    </div>
  );
}
