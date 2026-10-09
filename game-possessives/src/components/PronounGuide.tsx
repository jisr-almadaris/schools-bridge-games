import { useEffect, useState } from "react";
import { PRONOUNS } from "../data";
import PronounIcon from "./PronounIcon";
import { audio } from "../audio";

interface Props {
  open: boolean;
  focus: string; // pronoun key or "all"
  fromCase: boolean; // show "return to case" button
  onClose: () => void;
}

// دفتر المحققة 📖 — a visual, interactive grammar reference.
// Explains the RULE with an illustration + example, without ever
// stating "the answer is X".
export default function PronounGuide({ open, focus, fromCase, onClose }: Props) {
  const startIndex = Math.max(
    0,
    PRONOUNS.findIndex((p) => p.key === focus),
  );
  const [idx, setIdx] = useState(startIndex === -1 ? 0 : startIndex);

  useEffect(() => {
    if (open) {
      const i = PRONOUNS.findIndex((p) => p.key === focus);
      setIdx(i === -1 ? 0 : i);
    }
  }, [open, focus]);

  if (!open) return null;
  const p = PRONOUNS[idx];

  const go = (n: number) => {
    audio.click();
    setIdx((prev) => (prev + n + PRONOUNS.length) % PRONOUNS.length);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 p-5 text-slate-800 shadow-2xl anim-pop">
        {/* header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-indigo-900">📖 دفتر المحققة</h2>
            <p className="text-xs font-bold text-slate-500">
              تعلّمي القاعدة… واستنتجي الإجابة بنفسكِ 🔎
            </p>
          </div>
          <button
            onClick={() => {
              audio.click();
              onClose();
            }}
            className="rounded-full bg-indigo-900 px-3 py-1 text-sm font-bold text-white"
          >
            ✕
          </button>
        </div>

        {/* tabs */}
        <div dir="ltr" className="mt-3 flex flex-wrap justify-center gap-1.5">
          {PRONOUNS.map((pr, i) => (
            <button
              key={pr.key}
              onClick={() => {
                audio.click();
                setIdx(i);
              }}
              className={`font-en rounded-full px-3 py-1 text-sm font-bold transition ${
                i === idx
                  ? `bg-gradient-to-l ${pr.grad} text-white shadow`
                  : "bg-white/70 text-slate-600 hover:bg-white"
              }`}
            >
              {pr.word}
            </button>
          ))}
        </div>

        {/* main card */}
        <div
          key={p.key}
          className={`mt-4 rounded-3xl bg-gradient-to-br ${p.grad} p-1 shadow-lg anim-pop`}
        >
          <div className="rounded-[20px] bg-white/95 p-5 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-slate-50 shadow-inner ring-4 ring-white anim-float">
              <PronounIcon type={p.key} className="h-24 w-24" />
            </div>

            <div className="font-en mt-3 text-4xl font-black text-slate-800">{p.word}</div>
            <div className="mt-1 text-lg font-black text-purple-700">{p.meaningAr}</div>

            <div className="mx-auto mt-3 max-w-sm rounded-2xl bg-slate-900 p-3">
              <div className="text-[11px] font-bold text-teal-300">مثال إنجليزي</div>
              <div className="font-en mt-0.5 text-xl font-bold text-white">{p.example}</div>
              <div className="mt-1 text-sm font-bold text-amber-200">{p.exampleAr}</div>
            </div>

            <div className="mt-3 rounded-2xl bg-amber-100 p-3 text-sm font-bold leading-relaxed text-amber-900 ring-1 ring-amber-300">
              💡 {p.ruleAr}
            </div>

            <div dir="ltr" className="mt-2 text-xs font-bold text-slate-500">
              <span className="font-en">{p.owner}</span> ({p.ownerAr}) →{" "}
              <span className="font-en text-purple-700">{p.word}</span>
            </div>
          </div>
        </div>

        {/* nav */}
        <div dir="ltr" className="mt-3 flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-indigo-800 shadow hover:bg-white"
          >
            ‹ السابق
          </button>
          <span className="text-xs font-bold text-slate-500">
            {idx + 1} / {PRONOUNS.length}
          </span>
          <button
            onClick={() => go(1)}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-black text-indigo-800 shadow hover:bg-white"
          >
            التالي ›
          </button>
        </div>

        {/* return / close button */}
        <button
          onClick={() => {
            audio.click();
            onClose();
          }}
          className="mt-4 w-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-600 px-6 py-3 text-lg font-black text-white shadow-lg transition hover:scale-[1.02] active:scale-95"
        >
          {fromCase ? "فهمت، أعود للقضية 🔎" : "إغلاق الدفتر ✅"}
        </button>
      </div>
    </div>
  );
}
