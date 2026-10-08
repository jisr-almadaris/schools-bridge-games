import { StarIcon } from "../graphics";
import { INITIATIVE } from "../data";
import { sound } from "../sound";

export default function Certificate({
  name,
  finalScore,
  stars,
  date,
  onBack,
}: {
  name: string;
  finalScore: number;
  stars: number;
  date: string;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl px-3 pb-10">
      {/* actions (hidden in print) */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          onClick={() => {
            sound.click();
            window.print();
          }}
          className="rounded-2xl bg-gradient-to-l from-amber-400 to-yellow-500 px-7 py-3.5 text-xl font-extrabold text-purple-900 shadow-lg transition hover:scale-105 active:scale-95"
        >
          🖨️ طباعة الشهادة / حفظ PDF
        </button>
        <button
          onClick={() => {
            sound.click();
            onBack();
          }}
          className="rounded-2xl bg-white/90 px-7 py-3.5 text-xl font-extrabold text-purple-800 shadow-lg ring-2 ring-purple-300 transition hover:scale-105 active:scale-95"
        >
          ⬅️ رجوع
        </button>
      </div>

      {/* Certificate */}
      <div
        id="certificate-print"
        dir="rtl"
        className="animate-pop mt-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-100 via-purple-50 to-sky-100 p-3 shadow-2xl sm:p-4"
      >
        <div className="rounded-[1.6rem] border-8 border-double border-amber-400 bg-gradient-to-b from-white via-violet-50 to-teal-50 px-4 py-8 text-center sm:px-10 sm:py-10">
          {/* header */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl">🏅</span>
            <h2 className="font-display bg-gradient-to-l from-amber-500 via-yellow-600 to-amber-500 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              شهادة إنجاز
            </h2>
            <span className="text-4xl sm:text-5xl">🏅</span>
          </div>
          <p className="mt-2 text-base font-bold text-purple-700 sm:text-lg">
            رحلة إلى جزر المقارنات — Comparative & Superlative 🚢
          </p>

          <div className="mx-auto mt-5 h-1 w-48 rounded-full bg-gradient-to-l from-transparent via-amber-400 to-transparent" />

          <p className="mt-6 text-lg font-bold text-slate-700 sm:text-xl">تُمنح هذه الشهادة للطالبة المتميزة</p>
          <p className="font-display mt-3 text-4xl font-extrabold text-purple-900 sm:text-6xl">{name}</p>

          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-relaxed text-slate-700 sm:text-lg">
            لإتمامها بنجاح رحلة الجزر الخمس وتعلّمها قاعدتي المقارنة والتفضيل في اللغة الإنجليزية
            بكل حماس واجتهاد 🌟
          </p>

          {/* stars */}
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="h-9 w-9 sm:h-11 sm:w-11" filled={i < stars} />
            ))}
          </div>

          {/* score & date */}
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-4">
            <div className="min-w-40 rounded-2xl bg-purple-100 px-6 py-3 ring-2 ring-purple-300">
              <p className="text-sm font-bold text-purple-600">درجة التحدي النهائي</p>
              <p className="font-display text-3xl font-extrabold text-purple-900">{finalScore} / 8</p>
            </div>
            <div className="min-w-40 rounded-2xl bg-teal-100 px-6 py-3 ring-2 ring-teal-300">
              <p className="text-sm font-bold text-teal-700">تاريخ الإنجاز</p>
              <p className="font-display text-2xl font-extrabold text-teal-900">{date}</p>
            </div>
          </div>

          <div className="mx-auto mt-7 h-1 w-48 rounded-full bg-gradient-to-l from-transparent via-amber-400 to-transparent" />

          {/* initiative */}
          <p className="mt-5 text-xl font-extrabold text-amber-600">{INITIATIVE.title}</p>
          <p className="mt-1 text-sm font-bold text-slate-600 sm:text-base">{INITIATIVE.motto}</p>
        </div>
      </div>
    </div>
  );
}
