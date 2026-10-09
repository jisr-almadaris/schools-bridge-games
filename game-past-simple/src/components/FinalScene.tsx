import { useState } from "react";
import { FINAL_QUESTIONS } from "../data";
import { Character, Instruction } from "./ui";
import { ChoiceQuestion, MatchQuestion, OrderQuestion } from "./Questions";

const LABELS: Record<string, string> = {
  choice: "اختاري الفعل الصحيح.",
  order: "رتبي الجملة.",
  match: "طابقي الفعل.",
};

export default function FinalScene({
  startIndex,
  onIndexChange,
  onSolved,
  onDone,
}: {
  startIndex: number;
  onIndexChange: (i: number) => void;
  onSolved: (firstTry: boolean) => void;
  onDone: () => void;
}) {
  const [idx, setIdx] = useState(Math.min(startIndex, FINAL_QUESTIONS.length - 1));
  const q = FINAL_QUESTIONS[idx];
  const isLast = idx === FINAL_QUESTIONS.length - 1;

  const next = () => {
    if (isLast) onDone();
    else {
      const n = idx + 1;
      setIdx(n);
      onIndexChange(n);
    }
  };

  const common = {
    onSolved,
    onNext: next,
    nextLabel: isLast ? "افتحي القاعة الأخيرة 🏆" : "التالي ⏭",
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-black text-[#ffe08a] drop-shadow-[0_3px_0_#4b2f8f]">قاعة الذكرى الأخيرة ✨</h2>
      <div className="flex items-center gap-2">
        {FINAL_QUESTIONS.map((fq, i) => (
          <span
            key={fq.id}
            className={`grid h-9 w-9 place-items-center rounded-full text-lg font-black ${i < idx ? "bg-[#2fbfb0] text-white" : i === idx ? "bg-[#f7c948] text-[#4b2f8f]" : "bg-white/40 text-white"}`}
          >
            {i < idx ? "✓" : i + 1}
          </span>
        ))}
      </div>
      <Instruction>{LABELS[q.kind]}</Instruction>
      <div className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
        <Character size="sm" className="hidden lg:block" />
        <div className="w-full max-w-3xl">
          {q.kind === "choice" && <ChoiceQuestion key={q.id} q={q} {...common} />}
          {q.kind === "order" && <OrderQuestion key={q.id} q={q} {...common} />}
          {q.kind === "match" && <MatchQuestion key={q.id} q={q} {...common} />}
        </div>
      </div>
    </div>
  );
}
