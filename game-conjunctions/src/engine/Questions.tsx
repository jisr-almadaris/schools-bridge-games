import { useEffect, useRef, useState, type ReactNode, type PointerEvent as RPointerEvent } from "react";
import { sfx } from "../audio";
import { REL, WORD_INFO, wordHint, type Idea, type Question, type Relation, type Word } from "../data";
import { Feedback, WordBadge } from "../components/UI";

export type Theme = "mirror" | "storm" | "drawer" | "clock" | "suite";

/* ---------------- drag hook (pointer based: mouse + touch, plus tap-to-place) ---------------- */
function useDrag(onDrop: (item: string, zone: string) => void) {
  const cb = useRef(onDrop); cb.current = onDrop;
  const [ghost, setGhost] = useState<{ label: ReactNode; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const start = (item: string, label: ReactNode) => (e: RPointerEvent) => {
    const sx = e.clientX, sy = e.clientY; let moved = false;
    const move = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) moved = true;
      if (moved) { ev.preventDefault(); setGhost({ label, x: ev.clientX, y: ev.clientY }); }
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      setGhost(null);
      if (moved) {
        const el = document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-drop]") as HTMLElement | null;
        if (el?.dataset.drop) cb.current(item, el.dataset.drop);
        setSelected(null);
      } else { sfx("beep"); setSelected((s) => (s === item ? null : item)); }
    };
    window.addEventListener("pointermove", move, { passive: false }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  };
  const zoneClick = (zone: string) => () => { if (selected) { cb.current(selected, zone); setSelected(null); } };
  const ghostEl = ghost ? <div className="fixed z-[100] pointer-events-none" style={{ left: ghost.x, top: ghost.y, transform: "translate(-50%,-60%) scale(1.15)" }}>{ghost.label}</div> : null;
  return { start, zoneClick, ghostEl, selected, dragging: !!ghost };
}

/* ---------------- visual pieces ---------------- */
export function IdeaFrame({ idea, theme, merged, side, glow }: { idea: Idea; theme: Theme; merged?: boolean; side: "l" | "r"; glow?: boolean }) {
  const frame = {
    mirror: { borderRadius: "50% 50% 12px 12px / 35% 35% 12px 12px", border: "5px solid #c8952e", background: "linear-gradient(135deg,#b9e8ff44,#3b1f6e 60%,#b9e8ff22)" },
    storm: { borderRadius: 16, border: "4px solid " + (side === "l" ? "#ffd35c" : "#9fb8ff"), background: side === "l" ? "linear-gradient(180deg,#ffb84d55,#6e1a3d)" : "linear-gradient(180deg,#5a6a9a88,#1b1440)" },
    drawer: { borderRadius: 12, border: "4px solid #ff9fd0", background: "linear-gradient(180deg,#3b1f6e,#1b0f33)" },
    clock: { borderRadius: "50%", border: "5px solid #9fb8ff", background: "radial-gradient(circle,#2a2a5e,#140c2e)" },
    suite: { borderRadius: 18, border: "4px solid #f2c95c", background: "linear-gradient(160deg,#3b1f6e,#6e1a3d)" },
  }[theme];
  const shift = merged ? (side === "l" ? "translateX(18%)" : "translateX(-18%)") : "none";
  return (
    <div className="relative flex flex-col items-center justify-center text-center w-[36%] max-w-[170px] aspect-[4/5] p-2 transition-transform duration-700"
      style={{ ...frame, transform: shift, boxShadow: glow || merged ? "0 0 26px rgba(62,232,216,.8)" : "0 8px 20px rgba(0,0,0,.4)", aspectRatio: theme === "clock" ? "1" : undefined }}>
      <div className="text-4xl sm:text-5xl anim-float" style={{ animationDuration: side === "l" ? "3.5s" : "4.2s" }}>{idea.emoji}</div>
      <div className="en text-xs sm:text-sm font-semibold mt-1 text-violet-50 leading-tight">{idea.text}</div>
      {idea.label && <div className="text-[11px] sm:text-xs mt-1 px-2 rounded-full bg-black/30 text-amber-200">{idea.label}</div>}
    </div>
  );
}

export function Sentence({ parts, word, wrongWord, dropId, zoneClick, ready }: { parts: [string, string]; word?: Word | null; wrongWord?: boolean; dropId?: string; zoneClick?: () => void; ready?: boolean }) {
  const gap = word ? (
    <span className={`inline-block anim-pop px-2 rounded-lg font-bold ${wrongWord ? "wrong-glow" : ""}`} style={{ color: WORD_INFO[word].color, textShadow: `0 0 12px ${WORD_INFO[word].color}`, background: "rgba(20,10,50,.6)" }}>{word}{wrongWord ? "" : " ✨"}</span>
  ) : (
    <span data-drop={dropId} onClick={zoneClick} className={`drop-zone inline-block align-middle mx-1 min-w-[90px] h-9 rounded-lg ${ready ? "ready" : ""}`} style={{ borderBottom: "3px dashed #f2c95c", background: "rgba(242,201,92,.1)" }} />
  );
  return (
    <div className="en text-lg sm:text-2xl text-center leading-relaxed text-white font-semibold px-2 py-2 rounded-2xl" style={{ background: "rgba(10,6,30,.45)" }}>
      {parts[0] && <span>{parts[0]} </span>}{gap}<span> {parts[1]}</span>
    </div>
  );
}

function WordChip({ w, onPointerDown, sel, shake, placed }: { w: Word; onPointerDown?: (e: RPointerEvent) => void; sel?: boolean; shake?: boolean; placed?: boolean }) {
  const c = WORD_INFO[w].color;
  return (
    <button onPointerDown={onPointerDown} className={`chip en rounded-xl px-4 py-2 text-xl sm:text-2xl font-bold ${sel ? "sel" : ""} ${shake ? "anim-shake" : ""} ${placed ? "opacity-30 pointer-events-none" : ""}`}
      style={{ background: "linear-gradient(180deg,#3b1f6e,#1b0f33)", color: c, border: `2.5px solid ${c}`, boxShadow: `0 4px 0 #0b0620, 0 0 14px ${c}55` }}>
      {w}
    </button>
  );
}

function MiniClock({ spin }: { spin: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="46" fill="#f7ecd4" stroke="#9fb8ff" strokeWidth="6" />
      {[...Array(12)].map((_, i) => <line key={i} x1="50" y1="8" x2="50" y2="14" stroke="#3b1f6e" strokeWidth="3" transform={`rotate(${i * 30} 50 50)`} />)}
      <line x1="50" y1="50" x2="50" y2="18" stroke="#3b1f6e" strokeWidth="4" strokeLinecap="round" style={{ transformBox: "view-box", transformOrigin: "50px 50px", animation: `spin ${spin ? 0.6 : 8}s linear infinite` }} />
      <line x1="50" y1="50" x2="72" y2="50" stroke="#6e1a3d" strokeWidth="5" strokeLinecap="round" style={{ transformBox: "view-box", transformOrigin: "50px 50px", animation: `spin ${spin ? 2 : 60}s linear infinite` }} />
      <circle cx="50" cy="50" r="4" fill="#c8952e" />
    </svg>
  );
}

const shuffle = <T,>(a: T[]) => a.map((v) => [Math.random(), v] as const).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

/* ---------------- main engine ---------------- */
interface Props { q: Question; theme: Theme; onSolved: (firstTry: boolean) => void; onContinue: () => void }

export default function QuestionView({ q, theme, onSolved, onContinue }: Props) {
  const [solved, setSolved] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [rule, setRule] = useState<string>("");
  const mistakes = useRef(0);
  useEffect(() => { setSolved(false); setHint(null); mistakes.current = 0; }, [q.id]);

  const wrong = (h: string) => { mistakes.current++; sfx("wrong"); setHint(null); window.setTimeout(() => setHint(h), 10); };
  const win = (r: string) => { if (solved) return; setHint(null); setRule(r); setSolved(true); sfx("success"); window.setTimeout(() => sfx("sparkle"), 300); onSolved(mistakes.current === 0); };

  const body = (() => {
    switch (q.type) {
      case "relation": return <RelationQ q={q} theme={theme} solved={solved} wrong={wrong} win={win} />;
      case "choice": return <ChoiceQ q={q} theme={theme} solved={solved} wrong={wrong} win={win} />;
      case "drag": return <DragQ q={q} theme={theme} solved={solved} wrong={wrong} win={win} />;
      case "pairs": return <PairsQ q={q} solved={solved} wrong={wrong} win={win} />;
      case "drawers": return <DrawersQ q={q} solved={solved} wrong={wrong} win={win} />;
      case "fix": return <FixQ q={q} solved={solved} wrong={wrong} win={win} />;
      case "classify": return <ClassifyQ q={q} solved={solved} wrong={wrong} win={win} />;
      case "order": return <OrderQ q={q} theme={theme} solved={solved} wrong={wrong} win={win} />;
      case "match4": return <Match4Q q={q} solved={solved} wrong={wrong} win={win} />;
    }
  })();

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center text-lg sm:text-2xl font-extrabold text-amber-100">{q.prompt}</div>
      {body}
      {hint && !solved && <Feedback ok={false} hint={hint} />}
      {solved && <Feedback ok rule={rule} onContinue={onContinue} />}
    </div>
  );
}

type Sub<T> = { q: T; solved: boolean; wrong: (h: string) => void; win: (rule: string) => void; theme?: Theme };
type QOf<K extends Question["type"]> = Extract<Question, { type: K }>;

function RelationQ({ q, theme, solved, wrong, win }: Sub<QOf<"relation">>) {
  const [stage, setStage] = useState<"rel" | "word">("rel");
  const [picked, setPicked] = useState<Relation | null>(null);
  const [bad, setBad] = useState<string | null>(null);
  const opts = q.options ?? (["add", "contrast", "reason", "time"] as Relation[]);
  const pickRel = (r: Relation) => {
    if (solved) return;
    if (r === q.answer) {
      setPicked(r); sfx("rune");
      if (q.thenWord) setStage("word"); else win(WORD_INFO[q.reveal].rule);
    } else { setBad(r); wrong(REL[q.answer].hint); }
  };
  const pickWord = (w: Word) => {
    if (w === q.reveal) win(WORD_INFO[q.reveal].rule); else { setBad(w); wrong(wordHint(q.reveal)); }
  };
  return (
    <>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <IdeaFrame idea={q.ideas[0]} theme={theme!} side="l" merged={solved} />
        <div className="text-3xl sm:text-4xl font-bold text-amber-200 min-w-[2ch] text-center">{solved ? <span className="anim-pop inline-block">{WORD_INFO[q.reveal].icon}</span> : picked ? REL[picked].icon : "❔"}</div>
        <IdeaFrame idea={q.ideas[1]} theme={theme!} side="r" merged={solved} />
      </div>
      <Sentence parts={q.sentence} word={solved ? q.reveal : null} />
      {!solved && stage === "rel" && (
        <div className={`grid gap-2 ${opts.length > 2 ? "grid-cols-2" : "grid-cols-2"}`}>
          {opts.map((r) => (
            <button key={r} onClick={() => pickRel(r)} className={`opt rounded-2xl px-3 py-3 text-base sm:text-lg font-bold ${bad === r ? "wrong" : ""}`}>
              <span className="text-2xl">{REL[r].icon}</span> {REL[r].ar} <span className="en text-sm opacity-80 block">{REL[r].en}</span>
            </button>
          ))}
        </div>
      )}
      {!solved && stage === "word" && (
        <div className="anim-fadeUp">
          <div className="text-center text-violet-100 mb-2">العلاقة: <b>{REL[q.answer].icon} {REL[q.answer].ar}</b> — اختاري الكلمة السحرية:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {q.thenWord!.map((w) => <button key={w} onClick={() => pickWord(w)} className={bad === w ? "anim-shake" : ""}><WordBadge w={w} big /></button>)}
          </div>
        </div>
      )}
    </>
  );
}

function ChoiceQ({ q, solved, wrong, win }: Sub<QOf<"choice">>) {
  const [bad, setBad] = useState<number | null>(null);
  return (
    <>
      {q.context && (
        <div className="flex justify-center gap-3">
          {q.context.map((c, i) => <div key={i} className="glass rounded-2xl px-4 py-2 text-center"><div className="text-4xl">{c.emoji}</div><div className="en text-sm">{c.text}</div></div>)}
        </div>
      )}
      {q.ask && <div className="en text-xl sm:text-2xl text-center text-amber-100 font-bold">{q.ask}</div>}
      <div className="flex flex-col gap-2">
        {q.options.map((o, i) => (
          <button key={i} onClick={() => { if (solved) return; if (i === q.answer) win(q.rule); else { setBad(i); wrong(q.hint); } }}
            className={`opt en rounded-2xl px-4 py-3 text-lg sm:text-xl font-semibold ${solved && i === q.answer ? "right" : ""} ${bad === i && !solved ? "wrong" : ""}`}>
            {o} {solved && i === q.answer && "✓"}
          </button>
        ))}
      </div>
    </>
  );
}

function DragQ({ q, theme, solved, wrong, win }: Sub<QOf<"drag">>) {
  const [shakeW, setShakeW] = useState<Word | null>(null);
  const d = useDrag((item) => {
    const w = item as Word;
    if (solved) return;
    if (w === q.answer) { sfx("keyLock"); win(WORD_INFO[w].rule); }
    else { setShakeW(w); window.setTimeout(() => setShakeW(null), 500); wrong(wordHint(q.answer)); }
  });
  const isClock = q.target === "clock";
  return (
    <>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <IdeaFrame idea={q.ideas[0]} theme={theme!} side="l" merged={solved && !isClock} />
        <div data-drop="center" onClick={d.zoneClick("center")} className={`drop-zone shrink-0 flex items-center justify-center rounded-full ${!solved ? "ready" : ""}`}
          style={{ width: isClock ? "min(26vw,120px)" : "min(22vw,96px)", height: isClock ? "min(26vw,120px)" : "min(22vw,96px)", border: isClock ? "none" : "3px dashed #3ee8d8", background: isClock ? "transparent" : "rgba(62,232,216,.08)" }}>
          {isClock ? (
            <div className="relative w-full h-full"><MiniClock spin={solved} />{solved && <div className="absolute inset-0 flex items-center justify-center"><WordBadge w={q.answer} /></div>}</div>
          ) : solved ? <WordBadge w={q.answer} /> : <span className="text-2xl opacity-70">✨</span>}
        </div>
        <IdeaFrame idea={q.ideas[1]} theme={theme!} side="r" merged={solved && !isClock} />
      </div>
      <Sentence parts={q.sentence} word={solved ? q.answer : null} dropId="gap" zoneClick={d.zoneClick("gap")} ready={!!d.selected} />
      {!solved && (
        <>
          <div className="text-center text-sm text-violet-200">اسحبي الكلمة (أو اضغطيها ثم اضغطي المكان) 👆</div>
          <div className="flex flex-wrap justify-center gap-3">
            {q.bank.map((w) => <WordChip key={w} w={w} onPointerDown={d.start(w, <WordChip w={w} />)} sel={d.selected === w} shake={shakeW === w} />)}
          </div>
        </>
      )}
      {d.ghostEl}
    </>
  );
}

function PairsQ({ q, solved, wrong, win }: Sub<QOf<"pairs">>) {
  const [bad, setBad] = useState<number | null>(null);
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {q.pairs.map((p, i) => (
        <button key={i} onClick={() => { if (solved) return; if (i === q.answer) win(q.rule); else { setBad(i); wrong(q.hint); } }}
          className={`opt rounded-2xl p-3 flex sm:flex-col items-center justify-center gap-2 ${solved && i === q.answer ? "right" : ""} ${bad === i && !solved ? "wrong" : ""}`}>
          {p.map((idea, j) => (
            <div key={j} className="flex items-center gap-2 sm:flex-col">
              <span className="text-3xl">{idea.emoji}</span>
              <span className="en text-sm sm:text-base">{idea.text}</span>
              {j === 0 && <span className="text-amber-300 font-bold hidden sm:block">+</span>}
            </div>
          ))}
        </button>
      ))}
    </div>
  );
}

function DrawersQ({ q, solved, wrong, win }: Sub<QOf<"drawers">>) {
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState(false);
  const [bad, setBad] = useState<Word | null>(null);
  const openDrawer = (i: number) => {
    if (solved || found) return;
    sfx("drawer");
    setOpen((o) => (o.includes(i) ? o : [...o, i]));
    if (i === q.answer) {
      window.setTimeout(() => { sfx("rune"); setFound(true); if (!q.thenWord) win("BECAUSE = السبب 💡"); }, 400);
    } else wrong(q.hint);
  };
  return (
    <>
      <div className="text-center">
        <div className="en text-xl sm:text-2xl font-semibold">{q.base}</div>
        <div className="en text-2xl sm:text-3xl font-bold text-pink-200 mt-1 anim-float inline-block">{q.ask}</div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl" style={{ background: "linear-gradient(180deg,#4a1a2e,#2a0f1c)", border: "4px solid #c8952e", boxShadow: "inset 0 0 20px #000" }}>
        {q.drawers.map((d, i) => {
          const isOpen = open.includes(i); const right = i === q.answer;
          return (
            <button key={i} onClick={() => openDrawer(i)} className="relative rounded-xl overflow-hidden h-24 sm:h-28" style={{ background: "#1b0f15", border: "2px solid #7a5217" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-1" style={{ background: isOpen ? (right ? "radial-gradient(circle,#ffe89a,#c8952e)" : "#2a1a2a") : "transparent", color: right && isOpen ? "#3b1f6e" : "#f3eaff" }}>
                <span className="text-3xl">{isOpen ? d.emoji : ""}</span>
                <span className="en text-xs sm:text-sm font-bold leading-tight">{isOpen ? d.text : ""}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500" style={{ transform: isOpen ? "translateY(88%)" : "none", background: "linear-gradient(180deg,#8a3d1f,#5a2410)", borderTop: "3px solid #c8952e" }}>
                <span className="w-10 h-3 rounded-full" style={{ background: "#f2c95c", boxShadow: "0 0 8px #f2c95c" }} />
                <span className="absolute bottom-1 text-amber-200/70 text-sm">?</span>
              </div>
            </button>
          );
        })}
      </div>
      {found && q.thenWord && !solved && (
        <div className="anim-fadeUp">
          <Sentence parts={q.full} word={null} />
          <div className="text-center text-violet-100 my-2">وجدتِ السبب! 💡 أي كلمة تربط النتيجة بالسبب؟</div>
          <div className="flex justify-center gap-2 flex-wrap">
            {q.thenWord.map((w) => <button key={w} className={bad === w ? "anim-shake" : ""} onClick={() => { if (w === "BECAUSE") win("WHY? → BECAUSE 💡"); else { setBad(w); wrong(wordHint("BECAUSE")); } }}><WordBadge w={w} big /></button>)}
          </div>
        </div>
      )}
      {solved && (
        <>
          <Sentence parts={q.full} word="BECAUSE" />
          <div className="flex items-center justify-center gap-2 en font-bold text-base sm:text-lg" dir="ltr">
            <span className="px-3 py-1 rounded-lg bg-pink-900/50">WHY? 🤔</span><span>→</span><WordBadge w="BECAUSE" /><span>→</span><span className="px-3 py-1 rounded-lg bg-amber-900/50">REASON</span>
          </div>
        </>
      )}
    </>
  );
}

function FixQ({ q, solved, wrong, win }: Sub<QOf<"fix">>) {
  const [bad, setBad] = useState<Word | null>(null);
  return (
    <>
      <div className="flex justify-center gap-3 text-4xl"><span>🏃‍♀️✅</span><span>🏊‍♀️❌</span></div>
      <div className="en text-xl sm:text-3xl text-center font-semibold py-3 rounded-2xl" style={{ background: "rgba(10,6,30,.45)" }}>
        {q.tokens[0]}{" "}
        {solved ? <span className="anim-pop inline-block px-2 rounded-lg" style={{ color: WORD_INFO[q.answer].color, textShadow: `0 0 12px ${WORD_INFO[q.answer].color}` }}>{q.answer} ✨</span>
          : <span className="wrong-glow inline-block px-2 rounded-lg border-2 border-pink-400 line-through decoration-pink-400/70">{q.tokens[1]}</span>}{" "}
        {q.tokens[2]}
      </div>
      {!solved && <div className="text-center text-violet-100">اضغطي الكلمة الصحيحة لتستبدلي الكلمة اللامعة:</div>}
      {!solved && <div className="flex justify-center gap-2 flex-wrap">{q.options.map((w) => <button key={w} className={bad === w ? "anim-shake" : ""} onClick={() => { if (w === q.answer) { sfx("keyLock"); win(WORD_INFO[w].rule); } else { setBad(w); wrong("هل الفكرتان متشابهتان أم مختلفتان؟ ✅ و ❌ 👀"); } }}><WordBadge w={w} big /></button>)}</div>}
    </>
  );
}

function ClassifyQ({ q, solved, wrong, win }: Sub<QOf<"classify">>) {
  const [done, setDone] = useState<boolean[]>(q.items.map(() => false));
  const [bad, setBad] = useState<string | null>(null);
  const answer = (i: number, r: "time" | "reason") => {
    if (done[i] || solved) return;
    if (r === q.items[i].rel) {
      sfx("sparkle");
      const nd = done.map((d, j) => (j === i ? true : d)); setDone(nd);
      if (nd.every(Boolean)) win("WHEN = وقت ⏰ • BECAUSE = سبب 💡");
    } else { setBad(`${i}${r}`); wrong("انظري إلى الكلمة: when تخبرنا متى ⏰ … because تخبرنا لماذا 💡"); }
  };
  const hl = (t: string) => t.split(/(when|because)/).map((s, i) => (s === "when" || s === "because") ? <b key={i} style={{ color: s === "when" ? "#9fb8ff" : "#ff9fd0" }}>{s}</b> : <span key={i}>{s}</span>);
  return (
    <div className="flex flex-col gap-2">
      {q.items.map((it, i) => (
        <div key={i} className="rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-2" style={{ background: done[i] ? "rgba(62,232,216,.15)" : "rgba(10,6,30,.5)", border: `2px solid ${done[i] ? "#3ee8d8" : "rgba(185,163,255,.4)"}` }}>
          <div className="en flex-1 text-base sm:text-xl text-center sm:text-left">{hl(it.text)}</div>
          {done[i] ? <span className="text-lg font-bold text-teal-200">{it.rel === "time" ? "⏰ وقت" : "💡 سبب"} ✓</span> : (
            <div className="flex gap-2">
              <button onClick={() => answer(i, "time")} className={`opt rounded-xl px-3 py-2 font-bold ${bad === `${i}time` ? "wrong" : ""}`}>⏰ وقت</button>
              <button onClick={() => answer(i, "reason")} className={`opt rounded-xl px-3 py-2 font-bold ${bad === `${i}reason` ? "wrong" : ""}`}>💡 سبب</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OrderQ({ q, theme, solved, wrong, win }: Sub<QOf<"order">>) {
  const [pool] = useState(() => shuffle(q.tokens.map((t, i) => ({ t, i }))));
  const [built, setBuilt] = useState<number[]>([]);
  const add = (i: number) => {
    if (solved || built.includes(i)) return;
    sfx("beep");
    const nb = [...built, i]; setBuilt(nb);
    if (nb.length === q.tokens.length) {
      const words = nb.map((k) => q.tokens[k]);
      if (words.join("|") === q.answer.join("|")) { sfx("keyLock"); win(q.rule); }
      else window.setTimeout(() => { wrong(q.hint); setBuilt([]); }, 500);
    }
  };
  const isLink = (t: string) => ["and", "but", "because", "when"].includes(t.toLowerCase());
  return (
    <>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <IdeaFrame idea={q.ideas[0]} theme={theme!} side="l" merged={solved && !q.clock} />
        {q.clock && <div className="w-[min(24vw,110px)] aspect-square shrink-0"><MiniClock spin={solved} /></div>}
        <IdeaFrame idea={q.ideas[1]} theme={theme!} side="r" merged={solved && !q.clock} />
      </div>
      <div className="en min-h-[60px] rounded-2xl p-2 flex flex-wrap items-center justify-center gap-2 text-lg sm:text-2xl font-semibold" dir="ltr" style={{ background: "rgba(10,6,30,.5)", border: `2px dashed ${solved ? "#3ee8d8" : "#f2c95c"}` }}>
        {built.length === 0 && <span className="text-violet-300 text-base" dir="rtl">اضغطي القطع بالترتيب الصحيح…</span>}
        {built.map((k) => <span key={k} onClick={() => !solved && setBuilt(built.filter((b) => b !== k))} className="anim-pop px-2 py-1 rounded-lg cursor-pointer" style={{ color: isLink(q.tokens[k]) ? "#3ee8d8" : "#fff", background: isLink(q.tokens[k]) ? "rgba(62,232,216,.15)" : "transparent", textShadow: isLink(q.tokens[k]) ? "0 0 10px #3ee8d8" : undefined }}>{q.tokens[k]}</span>)}
      </div>
      {!solved && (
        <div className="flex flex-wrap justify-center gap-2" dir="ltr">
          {pool.map(({ t, i }) => (
            <button key={i} onClick={() => add(i)} className={`opt en rounded-xl px-4 py-2 text-lg sm:text-xl font-semibold ${built.includes(i) ? "opacity-25 pointer-events-none" : ""}`} style={isLink(t) ? { color: "#3ee8d8", borderColor: "#3ee8d8" } : undefined}>{t}</button>
          ))}
        </div>
      )}
    </>
  );
}

function Match4Q({ q, solved, wrong, win }: Sub<QOf<"match4">>) {
  const [placed, setPlaced] = useState<(Word | null)[]>(q.items.map(() => null));
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [bank] = useState<Word[]>(() => shuffle(q.items.map((i) => i.word)));
  const d = useDrag((item, zone) => {
    const idx = Number(zone.replace("row", "")); const w = item as Word;
    if (isNaN(idx) || placed[idx]) return;
    if (q.items[idx].word === w) {
      sfx("keyLock");
      const np = placed.map((p, j) => (j === idx ? w : p)); setPlaced(np);
      if (np.every(Boolean)) win("➕ AND • ⚡ BUT • 💡 BECAUSE • ⏰ WHEN");
    } else { setShakeRow(idx); window.setTimeout(() => setShakeRow(null), 500); wrong(REL[WORD_INFO[q.items[idx].word].rel].hint); }
  });
  return (
    <>
      <div className="flex flex-col gap-2">
        {q.items.map((it, i) => (
          <div key={i} data-drop={`row${i}`} onClick={d.zoneClick(`row${i}`)} className={`drop-zone en rounded-2xl p-2 sm:p-3 text-base sm:text-xl text-center font-semibold ${shakeRow === i ? "anim-shake" : ""} ${!placed[i] && d.selected ? "ready" : ""}`}
            style={{ background: placed[i] ? "rgba(62,232,216,.12)" : "rgba(10,6,30,.5)", border: `2px solid ${placed[i] ? WORD_INFO[placed[i]!].color : "rgba(185,163,255,.4)"}` }}>
            {it.before}{" "}
            {placed[i] ? <span className="anim-pop inline-block font-bold" style={{ color: WORD_INFO[placed[i]!].color }}>{WORD_INFO[placed[i]!].icon} {placed[i]}</span>
              : <span className="inline-block min-w-[80px] border-b-2 border-dashed border-amber-300 mx-1">&nbsp;</span>}{" "}
            {it.after}
          </div>
        ))}
      </div>
      {!solved && (
        <div className="flex flex-wrap justify-center gap-2">
          {bank.map((w) => <WordChip key={w} w={w} placed={placed.includes(w)} onPointerDown={d.start(w, <WordChip w={w} />)} sel={d.selected === w} />)}
        </div>
      )}
      {d.ghostEl}
    </>
  );
}
