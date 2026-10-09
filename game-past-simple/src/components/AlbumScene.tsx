import { useState } from "react";
import { ORDER_SENTENCES } from "../data";
import { Btn, Character, Instruction, Panel } from "./ui";
import { OrderQuestion } from "./Questions";

export default function AlbumScene({
  onSolved,
  onDone,
}: {
  onSolved: (firstTry: boolean) => void;
  onDone: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const finished = idx >= ORDER_SENTENCES.length;

  if (finished) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_0_#4b2f8f]">ألبوم الذكريات 📖✨</h2>
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
          <Character size="sm" />
          <Panel className="max-w-xl">
            <p className="text-2xl font-black text-[#4b2f8f]">رتبتِ كل الجمل! ⭐</p>
            <div className="en mt-3 space-y-2 text-xl font-bold text-[#2a2760]" dir="ltr">
              {ORDER_SENTENCES.map((s) => (
                <div key={s.id} className="rounded-xl bg-[#f3eefc] px-3 py-2">
                  {s.emoji} {s.answer.join(" ")}.
                </div>
              ))}
            </div>
            <p className="mt-4 text-lg font-bold text-[#7c5cc4]">الآن… إلى القاعة الأخيرة ✨</p>
          </Panel>
        </div>
        <Btn onClick={onDone} className="text-2xl">
          قاعة الذكرى الأخيرة ✨
        </Btn>
      </div>
    );
  }

  const q = ORDER_SENTENCES[idx];
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_0_#4b2f8f]">ألبوم الذكريات 📖</h2>
      <Instruction>رتبي الجملة.</Instruction>
      <div className="flex gap-2">
        {ORDER_SENTENCES.map((s, i) => (
          <span key={s.id} className={`grid h-9 w-9 place-items-center rounded-full text-lg font-black ${i < idx ? "bg-[#2fbfb0] text-white" : i === idx ? "bg-[#f7c948] text-[#4b2f8f]" : "bg-white/40 text-white"}`}>
            {i < idx ? "✓" : i + 1}
          </span>
        ))}
      </div>
      <OrderQuestion key={q.id} q={q} onSolved={onSolved} onNext={() => setIdx((i) => i + 1)} />
    </div>
  );
}
