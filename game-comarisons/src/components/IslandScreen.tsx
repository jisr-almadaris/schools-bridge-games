import { useState } from "react";
import { Scene, StarIcon } from "../graphics";
import type { IslandData } from "../data";
import { sound } from "../sound";

export default function IslandScreen({
  island,
  islandIdx,
  onComplete,
}: {
  island: IslandData;
  islandIdx: number;
  onComplete: (correct: number, total: number) => void;
}) {
  const [phase, setPhase] = useState<"lesson" | "quiz" | "star">("lesson");
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const q = island.questions[qIdx];
  const total = island.questions.length;
  const isFinal = islandIdx === 4;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) {
      sound.correct();
      setCorrectCount((c) => c + 1);
    } else {
      sound.wrong();
    }
  };

  const next = () => {
    sound.click();
    if (qIdx + 1 < total) {
      setQIdx(qIdx + 1);
      setSelected(null);
      setShowHint(false);
    } else {
      setPhase("star");
      setTimeout(() => sound.star(), 350);
    }
  };

  /* ---------------- Star / completion overlay ---------------- */
  if (phase === "star") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-10 text-center">
        <div className="animate-pop w-full rounded-[2rem] bg-white/95 p-8 shadow-2xl ring-4 ring-yellow-300">
          <div className="animate-star-burst mx-auto w-fit">
            <StarIcon className="h-36 w-36 drop-shadow-[0_6px_18px_rgba(245,158,11,0.6)]" />
          </div>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-purple-800">
            رائع! حصلتِ على نجمة! ⭐
          </h2>
          <p className="mt-2 text-xl font-bold text-teal-700">
            أكملتِ {island.name} {island.emoji}
          </p>
          <p className="mt-2 rounded-2xl bg-violet-100 px-4 py-3 text-lg font-bold text-violet-800">
            نتيجتك في هذه الجزيرة: {correctCount} من {total} ✅
          </p>
          <button
            onClick={() => {
              sound.click();
              onComplete(correctCount, total);
            }}
            className="mt-5 w-full rounded-2xl bg-gradient-to-l from-teal-400 to-emerald-500 px-6 py-4 text-xl font-extrabold text-white shadow-lg transition hover:scale-[1.03] active:scale-95"
          >
            {isFinal ? "عرض شاشة الإنجاز! 🏆" : "الإبحار إلى الجزيرة التالية 🚢"}
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Lesson phase ---------------- */
  if (phase === "lesson") {
    return (
      <div className="mx-auto w-full max-w-3xl px-3 pb-10">
        <div className={`animate-slide-up mt-2 rounded-3xl bg-gradient-to-l ${island.gradient} p-1 shadow-2xl`}>
          <div className="rounded-[1.4rem] bg-white/95 p-5 sm:p-8">
            <div className="text-center">
              <span className="text-5xl">{island.emoji}</span>
              <h2 className="font-display mt-1 text-3xl font-extrabold text-purple-900 sm:text-4xl">{island.name}</h2>
              <p className="text-lg font-bold text-teal-600" dir="ltr">{island.subtitle}</p>
            </div>

            <h3 className="mt-5 rounded-2xl bg-violet-100 px-4 py-2 text-center text-xl font-extrabold text-violet-900 sm:text-2xl">
              {island.lesson.title}
            </h3>

            <ul className="mt-4 space-y-3">
              {island.lesson.points.map((p, i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl bg-sky-50 px-4 py-3 ring-1 ring-sky-200">
                  <span className="mt-0.5 text-xl">🌟</span>
                  <div>
                    <p className="text-base font-bold text-slate-800 sm:text-lg">{p.ar}</p>
                    {p.en && (
                      <p className="mt-1 w-fit rounded-lg bg-amber-100 px-3 py-1 text-lg font-extrabold text-amber-800" dir="ltr">
                        {p.en}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* word table for words island */}
            {island.lesson.table && (
              <div className="mt-5 overflow-hidden rounded-2xl ring-2 ring-violet-300">
                <table className="w-full text-center" dir="ltr">
                  <tbody>
                    {island.lesson.table.map((row, ri) => (
                      <tr key={ri} className={ri === 0 ? "bg-gradient-to-l from-violet-600 to-purple-600 text-white" : ri % 2 ? "bg-violet-50" : "bg-white"}>
                        {row.map((cell, ci) => (
                          <td key={ci} className={`px-2 py-2.5 text-sm font-extrabold sm:text-lg ${ri === 0 ? "" : ci === 0 ? "text-sky-700" : ci === 1 ? "text-teal-700" : "text-purple-700"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* illustration */}
            <div className="mt-5 rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-100 p-3 ring-2 ring-teal-200">
              <Scene items={island.lesson.scene} className="mx-auto w-full max-w-xl" />
            </div>

            {/* example sentence */}
            <div className="mt-4 rounded-2xl bg-gradient-to-l from-amber-300 to-yellow-300 p-4 text-center shadow-inner">
              <p className="text-xl font-extrabold text-purple-900 sm:text-2xl" dir="ltr">
                {island.lesson.example.en}
              </p>
              <p className="mt-1 text-base font-bold text-purple-800">{island.lesson.example.ar}</p>
            </div>

            <button
              onClick={() => {
                sound.click();
                setPhase("quiz");
              }}
              className="mt-6 w-full rounded-2xl bg-gradient-to-l from-fuchsia-500 to-purple-600 px-6 py-4 text-2xl font-extrabold text-white shadow-lg shadow-purple-500/40 transition hover:scale-[1.02] active:scale-95"
            >
              {isFinal ? "ابدئي التحدي النهائي! 🔥" : "هيا إلى الأسئلة! 🎯"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Quiz phase ---------------- */
  const answered = selected !== null;
  const isCorrect = selected === q.correct;

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-10">
      <div className="animate-slide-up mt-2 rounded-3xl bg-white/95 p-5 shadow-2xl ring-4 ring-white/50 sm:p-7">
        {/* progress */}
        <div className="flex items-center justify-between gap-3">
          <span className={`rounded-full bg-gradient-to-l ${island.gradient} px-4 py-1.5 text-sm font-extrabold text-white sm:text-base`}>
            {island.emoji} {island.name}
          </span>
          <span className="rounded-full bg-violet-100 px-4 py-1.5 text-sm font-extrabold text-violet-800 sm:text-base">
            السؤال {qIdx + 1} من {total}
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-l from-teal-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${((qIdx + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>

        <p className="mt-4 text-lg font-extrabold text-slate-800 sm:text-xl">{q.prompt}</p>

        {/* scene */}
        <div className="mt-3 rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-100 p-3 ring-2 ring-teal-200">
          <Scene items={q.scene} className="mx-auto w-full max-w-xl" />
        </div>

        {/* sentence */}
        <p className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-center text-xl font-extrabold text-indigo-900 ring-2 ring-indigo-200 sm:text-2xl" dir="ltr">
          {q.sentence}
        </p>

        {/* options */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {q.options.map((opt, i) => {
            let cls = "bg-gradient-to-b from-violet-500 to-purple-600 text-white hover:scale-[1.04] active:scale-95 shadow-lg shadow-purple-400/40";
            if (answered) {
              if (i === q.correct) cls = "bg-gradient-to-b from-emerald-400 to-green-600 text-white ring-4 ring-emerald-300 scale-[1.04]";
              else if (i === selected) cls = "bg-gradient-to-b from-rose-400 to-red-600 text-white opacity-90";
              else cls = "bg-slate-200 text-slate-500";
            }
            return (
              <button
                key={i}
                dir="ltr"
                disabled={answered}
                onClick={() => choose(i)}
                className={`rounded-2xl px-4 py-4 text-xl font-extrabold transition ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* hint button */}
        {!answered && (
          <div className="mt-4">
            <button
              onClick={() => {
                sound.click();
                setShowHint((h) => !h);
              }}
              className="rounded-2xl bg-gradient-to-l from-amber-300 to-yellow-400 px-5 py-2.5 text-lg font-extrabold text-amber-900 shadow transition hover:scale-105 active:scale-95"
            >
              الدليل الذكي 💡
            </button>
            {showHint && (
              <p className="animate-pop mt-3 rounded-2xl border-r-8 border-amber-400 bg-amber-50 px-4 py-3 text-base font-bold text-amber-900 sm:text-lg">
                💡 {q.hint}
              </p>
            )}
          </div>
        )}

        {/* feedback */}
        {answered && (
          <div
            className={`animate-pop mt-4 rounded-2xl p-4 ring-2 ${
              isCorrect ? "bg-emerald-50 ring-emerald-300" : "bg-rose-50 ring-rose-300"
            }`}
          >
            <p className={`text-xl font-extrabold ${isCorrect ? "text-emerald-700" : "text-rose-700"}`}>
              {isCorrect ? "🎉 أحسنتِ! إجابة صحيحة!" : "💪 لا بأس، ستنجحين في المرة القادمة!"}
            </p>
            <p className="mt-2 text-base font-bold leading-relaxed text-slate-700 sm:text-lg">{q.explain}</p>
            <button
              onClick={next}
              className="mt-4 w-full rounded-2xl bg-gradient-to-l from-sky-500 to-blue-600 px-6 py-3.5 text-xl font-extrabold text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
            >
              {qIdx + 1 < total ? "السؤال التالي ⬅️" : "إنهاء الجزيرة والحصول على النجمة ⭐"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
