import { useState } from "react";
import { MEMORIES, OPEN_MEMORY, SECRETS } from "../data";
import { Btn, Character, Instruction, MemoryFrame, Panel, SecretCard } from "./ui";
import { ChoiceQuestion } from "./Questions";
import { sfx, speak } from "../audio";

const GALLERY = MEMORIES.slice(0, 3);

export default function HallScene({
  onSolved,
  onDone,
}: {
  onSolved: (firstTry: boolean) => void;
  onDone: () => void;
}) {
  const [mode, setMode] = useState<"gallery" | "activity">("gallery");
  const [active, setActive] = useState<string | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [doneIds, setDoneIds] = useState<string[]>([]);

  const activeMem = GALLERY.find((m) => m.id === active);

  const openMemory = (id: string) => {
    setActive(id);
    sfx.sparkle();
    const m = GALLERY.find((x) => x.id === id);
    if (m) speak(m.sentence);
    if (!seen.includes(id)) setSeen((s) => [...s, id]);
  };

  /* ---------- الجزء الأول: مشاهدة الذكريات ---------- */
  if (mode === "gallery") {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_0_#4b2f8f]">قاعة الأمس ⏳</h2>
        <Instruction>اضغطي على الذكرى.</Instruction>

        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end">
          <Character size="sm" className="order-2 lg:order-1" />
          <div className="order-1 flex flex-wrap justify-center gap-5 lg:order-2">
            {GALLERY.map((m, i) => (
              <MemoryFrame
                key={m.id}
                src={m.image}
                size="md"
                active={active === m.id}
                onClick={() => openMemory(m.id)}
                className={`anim-pop delay-${i + 1} ${active === m.id ? "" : "anim-floaty"}`}
                caption={
                  <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-black text-[#4b2f8f]">
                    {m.emoji} {seen.includes(m.id) ? "✓" : "؟"}
                  </span>
                }
              />
            ))}
          </div>
        </div>

        {activeMem && (
          <Panel key={activeMem.id} className="anim-pop max-w-xl">
            <p className="en text-2xl sm:text-3xl font-bold text-[#2a2760]">
              <mark className="rounded-lg bg-[#ffe08a] px-2 py-0.5 text-[#4b2f8f]">{activeMem.timeWord}</mark>
              {activeMem.sentence.slice(activeMem.timeWord.length).split(activeMem.verb)[0]}
              <mark className="rounded-lg bg-[#7fe3d8] px-2 py-0.5 text-[#0b3f3a]">{activeMem.verb}</mark>
              {activeMem.sentence.split(activeMem.verb)[1]}
            </p>
            <p className="mt-3 text-lg sm:text-xl font-black text-[#7c5cc4]">
              <span className="en">{activeMem.verb}</span> = {activeMem.explain.split("= ")[1]}
            </p>
            <Btn variant="teal" onClick={() => speak(activeMem.sentence)} className="mt-3">
              🔊 استمعي مرة أخرى
            </Btn>
          </Panel>
        )}

        {seen.length >= 3 && (
          <Btn onClick={() => setMode("activity")} className="anim-pop text-2xl">
            نشاط: افتحي الذكرى ✨
          </Btn>
        )}
        {seen.length < 3 && <p className="text-white/90 font-bold">شاهدتِ {seen.length} من 3 ذكريات</p>}
      </div>
    );
  }

  /* ---------- الجزء الثاني: نشاط افتحي الذكرى ---------- */
  const allDone = doneIds.length === OPEN_MEMORY.length;

  if (openIdx !== null) {
    const q = OPEN_MEMORY[openIdx];
    return (
      <div className="flex flex-col items-center gap-4">
        <Instruction>اختاري الفعل الصحيح.</Instruction>
        <ChoiceQuestion
          key={q.id}
          q={q}
          onSolved={onSolved}
          nextLabel="أعود إلى الإطارات 🖼️"
          onNext={() => {
            setDoneIds((d) => (d.includes(q.id) ? d : [...d, q.id]));
            setOpenIdx(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_3px_0_#4b2f8f]">افتحي الذكرى ✨</h2>
      <Instruction>{allDone ? "أكملتِ كل الذكريات! ⭐" : "اختاري إطارًا لتفتحي الذكرى."}</Instruction>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end">
        <Character size="sm" className="order-2 lg:order-1" />
        <div className="order-1 flex flex-wrap justify-center gap-5 lg:order-2">
          {OPEN_MEMORY.map((q, i) => {
            const done = doneIds.includes(q.id);
            return (
              <MemoryFrame
                key={q.id}
                src={done ? q.image : undefined}
                emoji={done ? undefined : "🔒"}
                size="md"
                onClick={done ? undefined : () => setOpenIdx(i)}
                className={`anim-pop delay-${i + 1} ${done ? "" : "anim-floaty"}`}
                caption={
                  <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-black text-[#4b2f8f]">
                    {done ? `${q.emoji} ✓ ${q.answer}` : `ذكرى ${i + 1}`}
                  </span>
                }
              />
            );
          })}
        </div>
      </div>

      {allDone && (
        <>
          <SecretCard text={SECRETS[1]} />
          <Btn onClick={onDone} className="anim-pop text-2xl">
            إلى آلة الزمن ⏳✨
          </Btn>
        </>
      )}
    </div>
  );
}
