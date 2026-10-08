import { useEffect } from "react";
import { StarIcon } from "../graphics";
import { INITIATIVE } from "../data";
import { sound } from "../sound";

const CONFETTI_COLORS = ["#a855f7", "#14b8a6", "#facc15", "#38bdf8", "#22c55e", "#ec4899"];

export default function Achievement({
  name,
  finalScore,
  totalCorrect,
  totalQuestions,
  stars,
  onCertificate,
  onRestart,
}: {
  name: string;
  finalScore: number;
  totalCorrect: number;
  totalQuestions: number;
  stars: number;
  onCertificate: () => void;
  onRestart: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => sound.fanfare(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl px-3 pb-10">
      {/* confetti */}
      {Array.from({ length: 26 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece pointer-events-none fixed top-0 z-0 h-3 w-2 rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDuration: `${3 + (i % 5)}s`,
            animationDelay: `${(i % 7) * 0.45}s`,
          }}
        />
      ))}

      <div className="animate-pop relative z-10 mt-4 rounded-[2rem] bg-white/95 p-6 text-center shadow-2xl ring-4 ring-yellow-300 sm:p-9">
        <div className="text-6xl">🏆</div>
        <h2 className="font-display mt-2 text-3xl font-extrabold text-purple-900 sm:text-4xl">
          مبروك يا {name}!
        </h2>
        <p className="mt-2 text-xl font-bold text-teal-700">
          أكملتِ رحلة جزر المقارنات كاملة! 🚢🏝️
        </p>

        {/* stars */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-star-burst" style={{ animationDelay: `${i * 0.2}s` }}>
              <StarIcon className="h-12 w-12 sm:h-14 sm:w-14" filled={i < stars} />
            </div>
          ))}
        </div>
        <p className="mt-1 text-lg font-extrabold text-amber-600">{stars} نجوم من 5 ⭐</p>

        {/* scores */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-b from-fuchsia-100 to-purple-100 p-4 ring-2 ring-purple-300">
            <p className="text-sm font-bold text-purple-700">درجة التحدي النهائي 🔥</p>
            <p className="font-display mt-1 text-4xl font-extrabold text-purple-900">
              {finalScore} <span className="text-xl">/ 8</span>
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-teal-100 to-emerald-100 p-4 ring-2 ring-teal-300">
            <p className="text-sm font-bold text-teal-700">مجموع الإجابات الصحيحة ✅</p>
            <p className="font-display mt-1 text-4xl font-extrabold text-teal-900">
              {totalCorrect} <span className="text-xl">/ {totalQuestions}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => {
              sound.click();
              onCertificate();
            }}
            className="rounded-2xl bg-gradient-to-l from-amber-400 to-yellow-500 px-6 py-4 text-xl font-extrabold text-purple-900 shadow-lg transition hover:scale-[1.03] active:scale-95"
          >
            شهادة الإنجاز 📜
          </button>
          <button
            onClick={() => {
              sound.click();
              onRestart();
            }}
            className="rounded-2xl bg-gradient-to-l from-sky-500 to-blue-600 px-6 py-4 text-xl font-extrabold text-white shadow-lg transition hover:scale-[1.03] active:scale-95"
          >
            رحلة جديدة 🔄
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-l from-violet-600 to-purple-700 px-4 py-4">
          <p className="text-lg font-extrabold text-yellow-300">{INITIATIVE.title}</p>
          <p className="mt-1 text-sm font-semibold text-violet-100">{INITIATIVE.motto}</p>
        </div>
      </div>
    </div>
  );
}
