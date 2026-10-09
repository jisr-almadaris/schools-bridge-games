import { useEffect, useState } from "react";
import { GAME_TITLE_AR, INITIATIVE, INITIATIVE_TAGLINE, MEMORIES } from "../data";
import { Btn, Character, Clock, Confetti, MemoryFrame, Panel } from "./ui";
import { sfx } from "../audio";

export default function DoneScene({
  name,
  score,
  total,
  collected,
  onRestart,
  onCertificate,
}: {
  name: string;
  score: number;
  total: number;
  collected: string[];
  onRestart: () => void;
  onCertificate: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const degree = Math.round((score / total) * 100);
  const mems = MEMORIES.filter((m) => collected.includes(m.id));
  const date = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  useEffect(() => {
    sfx.door();
    const t = setTimeout(() => {
      setOpened(true);
      sfx.celebrate();
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  if (!opened) {
    return (
      <div className="relative mx-auto h-[60vh] w-full max-w-3xl overflow-hidden rounded-t-[10rem] border-8 border-[#c9962b] bg-[#2a2760]/60 shadow-2xl">
        <div className="absolute inset-0 grid place-items-center text-center">
          <Clock size={200} />
        </div>
        <div className="door-left open absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-[#5a3aa8] to-[#7c5cc4]">
          <div className="absolute inset-4 rounded-t-[8rem] border-4 border-[#f7c948]/70" />
        </div>
        <div className="door-right open absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-[#5a3aa8] to-[#7c5cc4]">
          <div className="absolute inset-4 rounded-t-[8rem] border-4 border-[#f7c948]/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <Confetti />

      {!showCert && (
        <>
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-10">
            <Character size="md" />
            <div className="anim-pop anim-glow rounded-full">
              <Clock size={200} />
            </div>
          </div>

          <div className="anim-pop">
            <h2 className="text-3xl sm:text-5xl font-black text-[#ffe08a] drop-shadow-[0_3px_0_#4b2f8f]">«أحسنتِ يا {name}! ⏳✨»</h2>
            <p className="mt-2 text-xl sm:text-2xl font-black text-white drop-shadow">
              «أكملتِ جولتكِ في متحف الذكريات وتعلمتِ <span className="en">Past Simple</span>!»
            </p>
          </div>

          {/* الذكريات المجموعة */}
          <div className="flex flex-wrap justify-center gap-4">
            {mems.map((m, i) => (
              <MemoryFrame
                key={m.id}
                src={m.image}
                size="sm"
                className={`anim-pop delay-${i + 1}`}
                caption={<span className="en rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-[#4b2f8f]">{m.emoji} {m.label}</span>}
              />
            ))}
          </div>

          {/* المراجعة الأخيرة */}
          <Panel className="anim-pop max-w-xl">
            <h3 className="text-2xl font-black text-[#4b2f8f]">مراجعة أخيرة ⭐</h3>
            <div className="en mt-3 grid grid-cols-2 gap-3 text-xl sm:text-2xl font-bold" dir="ltr">
              <div className="rounded-xl bg-[#fff3cc] p-3 text-[#4b2f8f]">Yesterday → Past</div>
              <div className="rounded-xl bg-[#d5f7ef] p-3 text-[#0b5f55]">
                play → play<span className="ed">ed</span>
              </div>
              <div className="rounded-xl bg-[#e4dcf7] p-3 text-[#4b2f8f]">
                go → <span className="text-[#e0457b]">went</span>
              </div>
              <div className="rounded-xl bg-[#ffe1ec] p-3 text-[#9c2a52]">I / She / They → played ⭐</div>
            </div>
            <p className="mt-4 text-lg font-bold text-[#7c5cc4]">
              الدرجة: <span className="en text-2xl text-[#4b2f8f]">{degree} / 100</span>
            </p>
          </Panel>

          <div className="rounded-3xl border-4 border-[#f7c948] bg-gradient-to-l from-[#4b2f8f] to-[#6a48bf] px-6 py-4 shadow-2xl">
            <div className="text-2xl sm:text-3xl font-black text-[#ffe08a]">{INITIATIVE}</div>
            <div className="mt-1 text-base sm:text-lg font-bold text-white">{INITIATIVE_TAGLINE}</div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Btn onClick={() => { setShowCert(true); onCertificate(); sfx.sparkle(); }} className="text-2xl">
              شهادتي 🏆
            </Btn>
            <Btn variant="ghost" onClick={onRestart}>
              جولة جديدة 🔄
            </Btn>
          </div>
        </>
      )}

      {showCert && (
        <>
          {/* ---------- الشهادة ---------- */}
          <div
            id="certificate"
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-[#fffdf7] p-6 sm:p-10 text-center shadow-2xl"
            style={{ aspectRatio: "297/200" }}
          >
            <div className="pointer-events-none absolute inset-3 rounded-2xl border-[6px] border-[#c9962b]" />
            <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-[#7c5cc4]" />
            <div className="pointer-events-none absolute left-8 top-8 text-4xl">⏳</div>
            <div className="pointer-events-none absolute right-8 top-8 text-4xl">✨</div>
            <div className="pointer-events-none absolute bottom-8 left-8 text-4xl">🖼️</div>
            <div className="pointer-events-none absolute bottom-8 right-8 text-4xl">⭐</div>

            <div className="relative flex h-full flex-col items-center justify-between py-2">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#4b2f8f]">{INITIATIVE}</div>
                <div className="mt-1 text-sm sm:text-base font-bold text-[#7c5cc4]">{INITIATIVE_TAGLINE}</div>
              </div>

              <div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#c9962b]">شهادة مستكشفة الزمن ⏳✨</h2>
                <p className="mt-3 text-base sm:text-xl font-bold text-[#2a2760]">تُمنح هذه الشهادة للطالبة:</p>
                <p className="mt-1 text-3xl sm:text-5xl font-black text-[#4b2f8f]">{name}</p>
                <p className="mt-2 text-base sm:text-xl font-bold text-[#2a2760]">لإتمامها بنجاح مغامرة:</p>
                <p className="text-lg sm:text-2xl font-black text-[#7c5cc4]">
                  «{GAME_TITLE_AR.replace(" ⏳✨", "")} – <span className="en">Past Simple</span>»
                </p>
                <p className="mt-1 text-sm sm:text-lg font-bold text-[#2a2760]">
                  وإظهارها فهمًا مميزًا لقاعدة <span className="en">Past Simple</span>.
                </p>
              </div>

              <div className="flex w-full items-end justify-between px-6 text-sm sm:text-lg font-black text-[#2a2760]">
                <div>
                  التاريخ: <span className="text-[#4b2f8f]">{date}</span>
                </div>
                <div className="text-4xl">🏆</div>
                <div>
                  الدرجة: <span className="en text-[#4b2f8f]">{degree} / 100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="no-print flex flex-wrap justify-center gap-3">
            <Btn onClick={() => window.print()} className="text-xl">
              🖨️ طباعة الشهادة / حفظ PDF
            </Btn>
            <Btn variant="white" onClick={() => setShowCert(false)}>
              رجوع ⬅
            </Btn>
            <Btn variant="ghost" onClick={onRestart}>
              جولة جديدة 🔄
            </Btn>
          </div>
        </>
      )}
    </div>
  );
}
