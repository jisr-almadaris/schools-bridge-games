import { INITIATIVE } from "../data";

interface Props {
  name: string;
  score: number;
  clues: number;
  onPrint: () => void;
  onBack: () => void;
}

export default function Certificate({ name, score, clues, onPrint, onBack }: Props) {
  const today = new Date().toLocaleDateString("ar-SA-u-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Certificate */}
        <div
          id="certificate"
          className="relative mx-auto overflow-hidden rounded-2xl bg-[#fbf6ea] text-slate-800 shadow-2xl"
          style={{ aspectRatio: "297 / 210" }}
        >
          {/* decorative frame */}
          <div className="absolute inset-3 rounded-xl border-[3px] border-amber-500/70" />
          <div className="absolute inset-5 rounded-lg border border-indigo-800/30" />
          {/* corner flourishes */}
          {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map(
            (p) => (
              <div
                key={p}
                className={`absolute ${p} h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-80`}
              />
            ),
          )}

          <div className="relative flex h-full flex-col items-center px-[6%] py-[4%] text-center">
            {/* Initiative banner - prominent */}
            <div className="flex w-full items-center justify-between gap-3">
              <div className="rounded-xl bg-gradient-to-l from-teal-600 to-indigo-700 px-4 py-2 text-white shadow-md">
                <div className="text-lg font-black sm:text-2xl">{INITIATIVE.name}</div>
              </div>
              <div className="text-4xl sm:text-6xl">🔎</div>
            </div>

            <h1 className="mt-2 text-2xl font-black text-indigo-900 sm:text-4xl">
              شهادة المحققة المتميّزة 🔎
            </h1>
            <div className="mx-auto mt-1 h-1 w-40 rounded bg-amber-500" />

            <p className="mt-3 text-sm text-slate-600 sm:text-lg">
              تُمنح هذه الشهادة بكل فخر للطالبة
            </p>
            <p className="mt-1 text-2xl font-black text-purple-800 sm:text-5xl">
              {name || "المحققة الصغيرة"}
            </p>

            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-700 sm:text-base">
              لإتمامها بنجاح مغامرة{" "}
              <span className="font-bold text-indigo-800">«لغز الممتلكات المفقودة»</span>{" "}
              <span className="font-en font-semibold">Possessive Pronouns Mystery</span>،
              وإظهارها مهاراتٍ مميّزة في الملاحظة والاستنتاج واستخدام{" "}
              <span className="font-en font-semibold">Possessive Pronouns</span>.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              <div className="rounded-lg bg-amber-100 px-4 py-2 shadow-sm ring-1 ring-amber-300">
                <div className="text-[10px] text-amber-700 sm:text-xs">الدرجة النهائية</div>
                <div className="text-lg font-black text-amber-800 sm:text-2xl">
                  {score} نقطة
                </div>
              </div>
              <div className="rounded-lg bg-teal-100 px-4 py-2 shadow-sm ring-1 ring-teal-300">
                <div className="text-[10px] text-teal-700 sm:text-xs">الأدلّة المكتشفة</div>
                <div className="text-lg font-black text-teal-800 sm:text-2xl">{clues} / 8</div>
              </div>
              <div className="rounded-lg bg-indigo-100 px-4 py-2 shadow-sm ring-1 ring-indigo-300">
                <div className="text-[10px] text-indigo-700 sm:text-xs">تاريخ الإنجاز</div>
                <div className="text-sm font-black text-indigo-800 sm:text-lg">{today}</div>
              </div>
            </div>

            {/* Initiative slogan - prominent at bottom */}
            <div className="mt-auto w-full rounded-xl bg-gradient-to-l from-indigo-800 via-purple-800 to-teal-800 px-4 py-2 text-white shadow-md">
              <p className="text-[11px] font-semibold sm:text-base">
                🌉 {INITIATIVE.slogan}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons (hidden on print) */}
        <div className="no-print mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={onPrint}
            className="rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-8 py-3 text-lg font-bold text-slate-900 shadow-lg transition hover:scale-105 active:scale-95"
          >
            🖨️ طباعة الشهادة / حفظ PDF
          </button>
          <button
            onClick={onBack}
            className="rounded-full bg-white/10 px-8 py-3 text-lg font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20"
          >
            ↩︎ العودة
          </button>
        </div>
      </div>
    </div>
  );
}
