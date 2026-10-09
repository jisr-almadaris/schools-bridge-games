import { useMemo, useState, DragEvent } from "react";
import { ChoiceQ, MatchQ, OrderQ } from "../data";
import { Btn, MemoryFrame, Panel } from "./ui";
import { sfx, speak } from "../audio";
import { cn } from "../utils/cn";

type Common = {
  onSolved: (firstTry: boolean) => void; // يُستدعى مرة واحدة عند الحل
  onNext: () => void;
  nextLabel?: string;
  extraFeedback?: React.ReactNode;
};

/* ---------- زر المساعدة ---------- */
function HintBox({ hint }: { hint: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <Btn variant="white" onClick={() => setOpen((o) => !o)} className="px-4 py-2 text-base">
        مساعدة 💡
      </Btn>
      {open && (
        <div className="anim-pop max-w-md rounded-2xl border-2 border-[#f7c948] bg-[#fff8dc] px-4 py-2 text-base sm:text-lg font-bold text-[#5a3d00]">
          {hint}
        </div>
      )}
    </div>
  );
}

function Feedback({ ok, text }: { ok: boolean; text: React.ReactNode }) {
  return (
    <div
      className={cn(
        "anim-pop mx-auto max-w-xl rounded-2xl px-5 py-3 text-lg sm:text-xl font-black shadow",
        ok ? "bg-[#d5f7ef] text-[#0b5f55] border-2 border-[#2fbfb0]" : "bg-[#fff1f4] text-[#9c2a52] border-2 border-[#f4a2bd]",
      )}
    >
      {text}
    </div>
  );
}

/* =========================================================
   1) اختيار الفعل الصحيح
   ========================================================= */
export function ChoiceQuestion({ q, onSolved, onNext, nextLabel = "التالي ⏭", extraFeedback }: Common & { q: ChoiceQ }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [tries, setTries] = useState(0);
  const [shake, setShake] = useState(false);

  const choose = (opt: string) => {
    if (solved) return;
    setPicked(opt);
    if (opt === q.answer) {
      setSolved(true);
      sfx.success();
      speak(`${q.before} ${q.answer} ${q.after}`);
      onSolved(tries === 0);
    } else {
      setTries((t) => t + 1);
      sfx.wrong();
      setShake(true);
      setTimeout(() => setShake(false), 450);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {q.image && (
        <div className={cn("transition-all duration-500", solved ? "rotate-[-2deg] scale-105" : "grayscale-[30%]")}>
          <MemoryFrame src={q.image} size="md" active={solved} />
        </div>
      )}
      <Panel className="w-full max-w-2xl">
        <p className="en text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed text-[#2a2760]">
          {q.before}{" "}
          <span
            className={cn(
              "inline-block min-w-[6rem] rounded-xl border-b-4 px-3",
              solved ? "border-[#2fbfb0] bg-[#d5f7ef] text-[#0b5f55]" : "border-[#7c5cc4] bg-[#ede7f6] text-[#7c5cc4]",
              shake && "anim-shake",
            )}
          >
            {solved ? q.answer : picked && picked !== q.answer ? picked : "___"}
          </span>{" "}
          {q.after}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          {q.options.map((opt) => {
            const isAns = opt === q.answer;
            const state = solved ? (isAns ? "ok" : "dim") : picked === opt ? "bad" : "idle";
            return (
              <button
                key={opt}
                type="button"
                onClick={() => choose(opt)}
                disabled={solved}
                className={cn(
                  "en word-card min-w-[8rem] rounded-2xl border-4 px-6 py-3 text-2xl sm:text-3xl font-bold transition-all cursor-pointer",
                  state === "idle" && "border-[#b9a4e6] bg-white text-[#4b2f8f] hover:-translate-y-1 hover:border-[#7c5cc4] shadow-lg",
                  state === "ok" && "border-[#2fbfb0] bg-[#d5f7ef] text-[#0b5f55] scale-110 shadow-xl",
                  state === "bad" && "border-[#f4a2bd] bg-[#fff1f4] text-[#9c2a52]",
                  state === "dim" && "border-gray-200 bg-gray-100 text-gray-400",
                )}
              >
                {opt}
                {state === "ok" && " ⭐"}
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3">
          {!solved && picked && picked !== q.answer && (
            <Feedback
              ok={false}
              text={
                <>
                  حاولي مرة أخرى 💡 الكلمة هي <span className="en text-[#4b2f8f]">{q.timeWord}</span>… نحن نتحدث عن الماضي.
                </>
              }
            />
          )}
          {solved && (
            <>
              <Feedback
                ok
                text={
                  <>
                    ممتاز! ⭐ <span className="en">{q.why}</span>
                  </>
                }
              />
              {extraFeedback}
              <div className="flex flex-wrap justify-center gap-3">
                <Btn variant="teal" onClick={() => speak(`${q.before} ${q.answer} ${q.after}`)}>
                  🔊 استمعي
                </Btn>
                <Btn onClick={onNext}>{nextLabel}</Btn>
              </div>
            </>
          )}
          {!solved && <HintBox hint={q.hint} />}
        </div>
      </Panel>
    </div>
  );
}

/* =========================================================
   2) ترتيب الجملة (نقر أو سحب)
   ========================================================= */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function OrderQuestion({ q, onSolved, onNext, nextLabel = "التالي ⏭", extraFeedback }: Common & { q: OrderQ }) {
  const initial = useMemo(() => {
    const s = shuffle(q.words.map((w, i) => ({ id: i, w })));
    // تأكد ألا تكون مرتبة مسبقًا
    const same = s.every((x, i) => x.w === q.answer[i]);
    return same ? [...s].reverse() : s;
  }, [q]);
  const [bank, setBank] = useState(initial);
  const [placed, setPlaced] = useState<{ id: number; w: string }[]>([]);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [tries, setTries] = useState(0);
  const [dragId, setDragId] = useState<number | null>(null);

  const moveToPlaced = (id: number, index?: number) => {
    if (solved) return;
    setWrong(false);
    const fromBank = bank.find((x) => x.id === id);
    if (fromBank) {
      setBank((b) => b.filter((x) => x.id !== id));
      setPlaced((p) => {
        const copy = [...p];
        copy.splice(index ?? copy.length, 0, fromBank);
        return copy;
      });
      sfx.tick();
      return;
    }
    // إعادة ترتيب داخل الجملة
    const fromPlaced = placed.find((x) => x.id === id);
    if (fromPlaced) {
      setPlaced((p) => {
        const without = p.filter((x) => x.id !== id);
        const idx = index === undefined ? without.length : Math.min(index, without.length);
        without.splice(idx, 0, fromPlaced);
        return without;
      });
      sfx.tick();
    }
  };

  const moveToBank = (id: number) => {
    if (solved) return;
    setWrong(false);
    const item = placed.find((x) => x.id === id);
    if (!item) return;
    setPlaced((p) => p.filter((x) => x.id !== id));
    setBank((b) => [...b, item]);
    sfx.tick();
  };

  const check = () => {
    const ok = placed.length === q.answer.length && placed.every((x, i) => x.w === q.answer[i]);
    if (ok) {
      setSolved(true);
      sfx.success();
      speak(q.answer.join(" ") + ".");
      onSolved(tries === 0);
    } else {
      setTries((t) => t + 1);
      setWrong(true);
      sfx.wrong();
    }
  };

  const onDragStart = (e: DragEvent, id: number) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(id));
  };
  const onDropArea = (e: DragEvent, index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    const id = dragId ?? Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(id)) moveToPlaced(id, index);
    setDragId(null);
  };
  const onDropBank = (e: DragEvent) => {
    e.preventDefault();
    const id = dragId ?? Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(id)) moveToBank(id);
    setDragId(null);
  };

  const cardBase =
    "en word-card cursor-pointer rounded-2xl border-4 px-4 py-2 text-xl sm:text-2xl font-bold shadow-lg transition-all select-none";

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Panel className="w-full max-w-3xl">
        <div className="text-2xl font-black text-[#4b2f8f]">
          رتبي الجملة 🧩 <span className="text-3xl">{q.emoji}</span>
        </div>
        <p className="mt-1 text-sm font-bold text-[#7c5cc4]">اسحبي البطاقات أو اضغطي عليها</p>

        {/* منطقة الجملة */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropArea(e)}
          className={cn(
            "en mt-4 flex min-h-[5.5rem] flex-wrap items-center justify-center gap-3 rounded-2xl border-4 border-dashed p-3 transition-colors",
            solved ? "border-[#2fbfb0] bg-[#d5f7ef]" : wrong ? "border-[#f4a2bd] bg-[#fff1f4] anim-shake" : "border-[#b9a4e6] bg-[#f3eefc]",
          )}
        >
          {placed.length === 0 && <span className="text-lg text-[#9d8bc9]">Drop words here ⬇</span>}
          {placed.map((item, i) => (
            <div
              key={item.id}
              draggable={!solved}
              onDragStart={(e) => onDragStart(e, item.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropArea(e, i)}
              onClick={() => moveToBank(item.id)}
              className={cn(
                cardBase,
                solved ? "border-[#2fbfb0] bg-white text-[#0b5f55]" : "border-[#7c5cc4] bg-white text-[#4b2f8f] hover:border-rose-300",
              )}
            >
              {item.w}
            </div>
          ))}
          {solved && <span className="text-2xl">.</span>}
        </div>

        {/* بنك الكلمات - بطاقات كصور صغيرة من الألبوم */}
        {!solved && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropBank}
            className="mt-4 flex min-h-[5rem] flex-wrap items-center justify-center gap-3 rounded-2xl bg-[#4b2f8f]/10 p-3"
            dir="ltr"
          >
            {bank.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => onDragStart(e, item.id)}
                onClick={() => moveToPlaced(item.id)}
                className={cn(cardBase, "border-[#f7c948] bg-gradient-to-b from-white to-[#fff3cc] text-[#4b2f8f] hover:-translate-y-1 hover:rotate-1")}
                style={{ boxShadow: "0 6px 0 #c9962b, 0 10px 20px rgba(0,0,0,0.2)" }}
              >
                <span className="mr-1 text-base">🖼️</span>
                {item.w}
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {wrong && !solved && (
            <Feedback ok={false} text={<>حاولي مرة أخرى 💡 اضغطي على كلمة لإرجاعها، وفكري: من فعل؟ ماذا فعل؟ متى؟</>} />
          )}
          {solved && (
            <>
              <Feedback
                ok
                text={
                  <>
                    رائع! ⭐ <span className="en">{q.why}</span>
                  </>
                }
              />
              {extraFeedback}
              <div className="flex flex-wrap justify-center gap-3">
                <Btn variant="teal" onClick={() => speak(q.answer.join(" ") + ".")}>
                  🔊 استمعي
                </Btn>
                <Btn onClick={onNext}>{nextLabel}</Btn>
              </div>
            </>
          )}
          {!solved && (
            <div className="flex flex-wrap items-start justify-center gap-3">
              <Btn variant="violet" onClick={check} disabled={placed.length !== q.words.length}>
                تحققي ✔
              </Btn>
              <HintBox hint={q.hint} />
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}

/* =========================================================
   3) مطابقة بسيطة
   ========================================================= */
export function MatchQuestion({ q, onSolved, onNext, nextLabel = "التالي ⏭", extraFeedback }: Common & { q: MatchQ }) {
  const rights = useMemo(() => shuffle(q.pairs.map((p) => p.past)), [q]);
  const [selBase, setSelBase] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [badPair, setBadPair] = useState<string | null>(null);
  const [showWrong, setShowWrong] = useState(false);
  const [tries, setTries] = useState(0);
  const solved = Object.keys(matched).length === q.pairs.length;

  const clickPast = (past: string) => {
    if (!selBase || solved) return;
    const pair = q.pairs.find((p) => p.base === selBase);
    if (pair && pair.past === past) {
      const next = { ...matched, [selBase]: past };
      setMatched(next);
      setSelBase(null);
      setShowWrong(false);
      sfx.sparkle();
      speak(`${pair.base}, ${pair.past}`);
      if (Object.keys(next).length === q.pairs.length) {
        sfx.success();
        onSolved(tries === 0);
      }
    } else {
      setTries((t) => t + 1);
      setBadPair(past);
      setShowWrong(true);
      sfx.wrong();
      setTimeout(() => setBadPair(null), 500);
    }
  };

  const usedPasts = new Set(Object.values(matched));

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Panel className="w-full max-w-2xl">
        <div className="text-2xl font-black text-[#4b2f8f]">طابقي الفعل 🔗</div>
        <p className="mt-1 text-sm font-bold text-[#7c5cc4]">اضغطي على الفعل، ثم على شكله في الماضي</p>
        <div className="en mt-4 grid grid-cols-2 gap-4 sm:gap-8" dir="ltr">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-[#c9962b]">TODAY ☀️</div>
            {q.pairs.map((p) => {
              const done = !!matched[p.base];
              return (
                <button
                  key={p.base}
                  type="button"
                  disabled={done}
                  onClick={() => {
                    setSelBase(p.base);
                    sfx.click();
                  }}
                  className={cn(
                    "rounded-2xl border-4 px-4 py-3 text-xl sm:text-2xl font-bold transition-all cursor-pointer",
                    done
                      ? "border-[#2fbfb0] bg-[#d5f7ef] text-[#0b5f55]"
                      : selBase === p.base
                        ? "border-[#f7c948] bg-[#fff3cc] text-[#4b2f8f] scale-105 shadow-xl"
                        : "border-[#b9a4e6] bg-white text-[#4b2f8f] hover:border-[#7c5cc4]",
                  )}
                >
                  {p.emoji} {p.base}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-[#4b2f8f]">YESTERDAY 🌙</div>
            {rights.map((past) => {
              const done = usedPasts.has(past);
              return (
                <button
                  key={past}
                  type="button"
                  disabled={done}
                  onClick={() => clickPast(past)}
                  className={cn(
                    "rounded-2xl border-4 px-4 py-3 text-xl sm:text-2xl font-bold transition-all cursor-pointer",
                    done
                      ? "border-[#2fbfb0] bg-[#d5f7ef] text-[#0b5f55]"
                      : badPair === past
                        ? "border-[#f4a2bd] bg-[#fff1f4] text-[#9c2a52] anim-shake"
                        : "border-[#b9a4e6] bg-white text-[#4b2f8f] hover:border-[#7c5cc4]",
                  )}
                >
                  {past} {done && "⭐"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {showWrong && !solved && <Feedback ok={false} text={<>حاولي مرة أخرى 💡 فكري في شكل الفعل عندما نتحدث عن الماضي ⏳</>} />}
          {!solved && !showWrong && selBase && (
            <p className="text-base font-bold text-[#7c5cc4]">
              اخترتِ <span className="en">{selBase}</span> — الآن اضغطي على شكله في الماضي 🌙
            </p>
          )}
          {solved && (
            <>
              <Feedback
                ok
                text={
                  <>
                    رائع! ⭐ <span className="en">{q.why}</span>
                  </>
                }
              />
              {extraFeedback}
              <Btn onClick={onNext}>{nextLabel}</Btn>
            </>
          )}
          {!solved && <HintBox hint={q.hint} />}
        </div>
      </Panel>
    </div>
  );
}
