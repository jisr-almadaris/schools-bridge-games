import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { ArrangeItem, Be, FillQ, SceneKind } from "../game/data";
import { hostFor } from "../game/data";
import { sfx } from "../game/sfx";
import { useTimeouts } from "../game/utils";
import ActionScene from "../components/ActionScene";
import BigOctopus from "../components/BigOctopus";
import Clam from "../components/Clam";
import type { ClamColor } from "../components/Clam";
import type { Mood, Pose } from "../components/Diver";
import { Turtle } from "../components/sea/Creatures";
import { BubbleBurst, NextButton, PopBurst, Sentence, SparkleBurst, Stage } from "../components/ui";
import type { Speech } from "../components/ui";

export interface GameProps {
  onSolved: (origin: DOMRect | null, firstTry: boolean) => void;
  canNext: boolean;
  onNext: () => void;
  nextLabel: string;
  badge?: ReactNode;
}

const BES: Be[] = ["am", "is", "are"];
const PRAISE = ["أحسنتِ! ✨", "رائع! 🌟", "ممتاز! 💎", "مذهل! 🪸"];
const SENT_SIZE = "clamp(30px, 6.2vmin, 62px)";

function Friend() {
  return (
    <div className="anim-bob pointer-events-none absolute" style={{ left: "-46%", bottom: "6%", width: "64%" }}>
      <Turtle className="w-full" />
    </div>
  );
}

function hostState(scene: SceneKind, solved: boolean, wrong: boolean): { pose: Pose; mood: Mood } {
  const h = hostFor(scene);
  return { pose: solved ? "cheer" : h.pose, mood: solved ? "joy" : wrong ? "think" : "happy" };
}

function sayBubble(scene: SceneKind, id: string): Speech {
  const h = hostFor(scene);
  return h.say ? { text: <span className="font-en">{h.say}</span>, id } : null;
}

function hintFor(subject: string, n: number): Speech {
  return {
    text: (
      <>
        قريبة! 💡 انظري إلى <b className="font-en">{subject}</b>.
      </>
    ),
    tone: "hint",
    id: `w${n}`,
  };
}

/* ====================== 1) AM / IS / ARE bubbles ====================== */
export function BubbleChoice({ q, onSolved, canNext, onNext, nextLabel, badge }: GameProps & { q: FillQ }) {
  const schedule = useTimeouts();
  const [wrong, setWrong] = useState<Be | null>(null);
  const [wrongN, setWrongN] = useState(0);
  const [popped, setPopped] = useState<Be | null>(null);
  const [solved, setSolved] = useState(false);
  const tries = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const h = hostFor(q.scene);
  const hs = hostState(q.scene, solved, !!wrong);

  useEffect(() => {
    [250, 560, 870].forEach((ms) => schedule(() => sfx.bubble(0.12), ms));
  }, [schedule]);

  const pick = (b: Be) => {
    if (popped) return;
    tries.current += 1;
    if (b === q.be) {
      setPopped(b);
      setWrong(null);
      sfx.pop();
      schedule(() => {
        setSolved(true);
        sfx.success();
      }, 420);
      schedule(() => onSolved(panelRef.current?.getBoundingClientRect() ?? null, tries.current === 1), 1300);
    } else {
      setWrong(b);
      setWrongN((n) => n + 1);
      sfx.tryAgain();
    }
  };

  const speech: Speech = solved ? { text: PRAISE[0], tone: "good" } : wrong ? hintFor(q.subject, wrongN) : sayBubble(q.scene, "say");

  return (
    <Stage pose={hs.pose} mood={hs.mood} speech={speech} hostExtra={h.friend ? <Friend /> : undefined}>
      {badge}
      <div className="chip anim-float-in">🫧 اختاري الفقاعة الصحيحة!</div>
      <div className="flex flex-wrap items-center justify-center gap-[3vmin]">
        {h.window && <ActionScene kind={q.scene} tag={q.subject} size="clamp(120px, 22vmin, 250px)" />}
        <div ref={panelRef} className="bubble-panel relative px-[4.5vmin] py-[2vmin]">
          <Sentence subject={q.subject} be={solved ? q.be : null} verb={q.verb} pulseKey={wrongN} fresh style={{ fontSize: SENT_SIZE }} />
          {solved && <SparkleBurst count={14} seed={4} />}
        </div>
      </div>
      <div dir="ltr" className="flex items-end justify-center gap-[5vmin]" style={{ minHeight: "clamp(100px, 19vmin, 180px)" }}>
        {BES.map((b, i) => (
          <div key={b} className="anim-rise-in" style={{ animationDelay: `${0.15 + i * 0.3}s` }}>
            <div
              className="anim-bob"
              style={{ animationDelay: `${i * 0.5}s`, opacity: solved && b !== q.be ? 0.3 : 1, transition: "opacity .4s" }}
            >
              {popped === b ? (
                <PopBurst size="clamp(92px, 17vmin, 160px)" />
              ) : (
                <button
                  key={wrong === b ? `w${wrongN}` : b}
                  type="button"
                  className={`choice-bubble ${wrong === b ? "anim-shake" : ""}`}
                  style={{ fontSize: "clamp(28px, 5.4vmin, 50px)" }}
                  onClick={() => pick(b)}
                  disabled={solved}
                  aria-label={b}
                >
                  {b.toUpperCase()}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {canNext && <NextButton label={nextLabel} onClick={onNext} attention />}
    </Stage>
  );
}

/* ====================== 2) Open the right shell ====================== */
const SHELL_COLORS: ClamColor[] = ["pink", "lavender", "aqua"];

export function ShellChoice({ q, onSolved, canNext, onNext, nextLabel, badge }: GameProps & { q: FillQ }) {
  const schedule = useTimeouts();
  const [opened, setOpened] = useState<Be | null>(null);
  const [wrong, setWrong] = useState<Be | null>(null);
  const [wrongN, setWrongN] = useState(0);
  const [solved, setSolved] = useState(false);
  const tries = useRef(0);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const h = hostFor(q.scene);
  const hs = hostState(q.scene, solved, !!wrong);

  const pick = (b: Be) => {
    if (opened) return;
    tries.current += 1;
    if (b === q.be) {
      setOpened(b);
      setWrong(null);
      sfx.shellOpen();
      schedule(() => {
        setSolved(true);
        sfx.success();
      }, 850);
      schedule(() => onSolved(refs.current[b]?.getBoundingClientRect() ?? null, tries.current === 1), 1600);
    } else {
      setWrong(b);
      setWrongN((n) => n + 1);
      sfx.tryAgain();
    }
  };

  const speech: Speech = solved ? { text: PRAISE[1], tone: "good" } : wrong ? hintFor(q.subject, wrongN) : sayBubble(q.scene, "say");

  return (
    <Stage pose={hs.pose} mood={hs.mood} speech={speech} hostExtra={h.friend ? <Friend /> : undefined}>
      {badge}
      <div className="chip anim-float-in">🐚 افتحي الصدفة الصحيحة!</div>
      <div className="flex flex-wrap items-center justify-center gap-[3vmin]">
        {h.window && <ActionScene kind={q.scene} tag={q.subject} size="clamp(120px, 22vmin, 250px)" />}
        <div className="bubble-panel relative px-[4.5vmin] py-[2vmin]">
          <Sentence
            subject={q.subject}
            be={solved ? q.be : null}
            verb={q.verb}
            pulseKey={wrongN}
            fresh
            end={solved ? ". ⭐" : "."}
            style={{ fontSize: SENT_SIZE }}
          />
          {solved && <SparkleBurst count={14} seed={7} />}
        </div>
      </div>
      <div dir="ltr" className="flex items-end justify-center gap-[4vmin]">
        {BES.map((b, i) => (
          <div
            key={b}
            ref={(el) => {
              refs.current[b] = el;
            }}
            className="anim-pop-in relative"
            style={{ animationDelay: `${i * 0.15}s`, opacity: solved && b !== q.be ? 0.45 : 1, transition: "opacity .4s" }}
          >
            <div key={wrong === b ? `w${wrongN}` : "n"} className={wrong === b ? "anim-shake" : ""}>
              <Clam
                open={opened === b}
                color={SHELL_COLORS[i]}
                label={b.toUpperCase()}
                onClick={solved ? undefined : () => pick(b)}
                className="w-[clamp(96px,18vmin,190px)]"
              />
            </div>
            {opened === b && (
              <>
                <SparkleBurst count={12} seed={i + 3} />
                <BubbleBurst count={10} seed={i + 9} />
              </>
            )}
          </div>
        ))}
      </div>
      {canNext && <NextButton label={nextLabel} onClick={onNext} attention />}
    </Stage>
  );
}

/* ====================== 3) Arrange the bubbles ====================== */
export function ArrangeBubbles({ items, onSolved, canNext, onNext, nextLabel, badge }: GameProps & { items: ArrangeItem[] }) {
  const schedule = useTimeouts();
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"watch" | "build">("watch");
  const [slots, setSlots] = useState<(number | null)[]>([null, null, null]);
  const [status, setStatus] = useState<"idle" | "wrong" | "right">("idle");
  const [wrongN, setWrongN] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const mistakes = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const item = items[idx];
  const h = hostFor(item.scene);

  useEffect(() => {
    const t = schedule(() => {
      setPhase("build");
      sfx.bubbles(3);
    }, 1900);
    return () => window.clearTimeout(t);
  }, [idx, schedule]);

  const tapWord = (wi: number) => {
    if (status !== "idle" || phase !== "build") return;
    const pos = slots.indexOf(null);
    if (pos === -1 || slots.includes(wi)) return;
    const next = [...slots];
    next[pos] = wi;
    setSlots(next);
    sfx.bubble(0.14);
    if (!next.includes(null)) {
      const ok = next.every((w, k) => item.scrambled[w as number] === item.words[k]);
      schedule(() => {
        if (ok) {
          setStatus("right");
          sfx.success();
          schedule(() => {
            if (idx < items.length - 1) {
              setIdx(idx + 1);
              setSlots([null, null, null]);
              setStatus("idle");
              setPhase("watch");
            } else {
              setAllDone(true);
              onSolved(rowRef.current?.getBoundingClientRect() ?? null, mistakes.current === 0);
            }
          }, 1700);
        } else {
          mistakes.current += 1;
          setStatus("wrong");
          setWrongN((n) => n + 1);
          sfx.tryAgain();
          schedule(() => {
            setSlots([null, null, null]);
            setStatus("idle");
          }, 1100);
        }
      }, 250);
    }
  };

  const tapSlot = (pos: number) => {
    if (status !== "idle" || slots[pos] === null) return;
    const next = [...slots];
    next[pos] = null;
    setSlots(next);
    sfx.bubble(0.1);
  };

  const speech: Speech =
    status === "right"
      ? { text: PRAISE[idx % PRAISE.length], tone: "good", id: `r${idx}` }
      : status === "wrong"
        ? { text: "قريبة! 💡 ابدئي بالفاعل، ثم am / is / are، ثم الفعل + ing", tone: "hint", id: `w${wrongN}` }
        : phase === "watch"
          ? { text: "👀 شاهدي أولًا…", id: `watch${idx}` }
          : sayBubble(item.scene, `say${idx}`);

  return (
    <Stage
      pose={status === "right" ? "cheer" : h.pose}
      mood={status === "right" ? "joy" : status === "wrong" ? "think" : "happy"}
      speech={speech}
      hostExtra={h.friend ? <Friend /> : undefined}
    >
      {badge}
      <div key={`chip-${phase}-${idx}`} className="chip anim-float-in">
        {phase === "watch" ? "👀 شاهدي أولًا… ماذا يحدث الآن؟" : "🫧 رتّبي الفقاعات لتكوّني الجملة"}
      </div>
      {h.window && <ActionScene key={`sc${idx}`} kind={item.scene} size="clamp(140px, 24vmin, 270px)" />}
      <div
        key={`row${idx}-${wrongN}`}
        ref={rowRef}
        dir="ltr"
        className={`relative flex flex-wrap items-center justify-center gap-[2vmin] ${status === "wrong" ? "anim-shake" : ""}`}
      >
        {slots.map((wi, k) =>
          wi === null ? (
            <div key={`e${k}`} className="slot">
              <span className="font-en text-xl opacity-40">{k + 1}</span>
            </div>
          ) : (
            <button
              key={`f${k}-${wi}`}
              type="button"
              className={`word-bubble anim-pop-in ${status === "right" ? "locked" : ""}`}
              onClick={() => tapSlot(k)}
            >
              {item.scrambled[wi]}
            </button>
          )
        )}
        <span className="font-en font-bold" style={{ fontSize: "clamp(30px, 6vmin, 56px)", opacity: status === "right" ? 1 : 0.35 }}>
          .
        </span>
        {status === "right" && <SparkleBurst count={14} seed={idx + 20} />}
      </div>
      <div dir="ltr" className="flex flex-wrap items-center justify-center gap-[3vmin]" style={{ minHeight: "clamp(74px, 13vmin, 120px)" }}>
        {phase === "build" &&
          item.scrambled.map((w, wi) => (
            <div key={`${idx}-${wi}`} className="anim-rise-in" style={{ animationDelay: `${wi * 0.18}s` }}>
              <div className="anim-bob" style={{ animationDelay: `${wi * 0.4}s` }}>
                <button
                  type="button"
                  className="word-bubble"
                  style={{ visibility: slots.includes(wi) ? "hidden" : "visible" }}
                  onClick={() => tapWord(wi)}
                >
                  {w}
                </button>
              </div>
            </div>
          ))}
      </div>
      {items.length > 1 && (
        <div className="flex gap-2" style={{ fontSize: 18 }}>
          {items.map((_, i) => (
            <span key={i} className={`pearl-dot ${i < idx || allDone ? "on" : ""}`} />
          ))}
        </div>
      )}
      {canNext && <NextButton label={nextLabel} onClick={onNext} attention />}
    </Stage>
  );
}

/* ====================== 4) Octopus challenge ====================== */
export function OctopusChallenge({ q, onSolved, canNext, onNext, nextLabel, badge }: GameProps & { q: FillQ }) {
  const schedule = useTimeouts();
  const [mood, setMood] = useState<"idle" | "happy" | "no">("idle");
  const [picked, setPicked] = useState<Be | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [solved, setSolved] = useState(false);
  const tries = useRef(0);
  const octoRef = useRef<HTMLDivElement>(null);
  const h = hostFor(q.scene);

  const pick = (b: Be) => {
    if (solved) return;
    tries.current += 1;
    setPicked(b);
    if (b === q.be) {
      setMood("happy");
      setSolved(true);
      sfx.success();
      sfx.bubbles(6);
      schedule(() => onSolved(octoRef.current?.getBoundingClientRect() ?? null, tries.current === 1), 1400);
    } else {
      setMood("no");
      setShakeKey((k) => k + 1);
      sfx.tryAgain();
    }
  };

  const speech: Speech = solved
    ? { text: "أحسنتِ! الأخطبوط سعيد 🐙✨", tone: "good" }
    : mood === "no"
      ? { text: "حاولي مرة أخرى 💪", tone: "hint", id: `n${shakeKey}` }
      : sayBubble(q.scene, "say");

  return (
    <Stage
      pose={solved ? "cheer" : h.pose}
      mood={solved ? "joy" : mood === "no" ? "think" : "wow"}
      speech={speech}
      hostExtra={h.friend ? <Friend /> : undefined}
    >
      {badge}
      <div className="chip anim-float-in">🐙 تحدي الأخطبوط! اضغطي على الذراع الصحيحة</div>
      <div className="flex flex-wrap items-center justify-center gap-[3vmin]">
        {h.window && <ActionScene kind={q.scene} tag={q.subject} size="clamp(100px, 17vmin, 200px)" />}
        <div className="bubble-panel relative px-[4vmin] py-[1.6vmin]">
          <Sentence
            subject={q.subject}
            be={solved ? q.be : null}
            verb={q.verb}
            pulseKey={shakeKey}
            fresh
            style={{ fontSize: "clamp(28px, 5.6vmin, 56px)" }}
          />
          {solved && <SparkleBurst count={12} seed={8} />}
        </div>
      </div>
      <div ref={octoRef} className="relative" style={{ width: "min(92%, 44vmin, 500px)" }}>
        <BigOctopus mood={mood} picked={picked} correct={q.be} onPick={pick} shakeKey={shakeKey} className="anim-pop-in w-full" />
        {mood === "no" && !solved && (
          <div key={shakeKey} className="absolute left-1/2 -translate-x-1/2" style={{ top: "80%", zIndex: 2 }}>
            <div className="speech hint up anim-pop-in" style={{ whiteSpace: "nowrap" }}>
              انظري إلى <b className="font-en">{q.subject}</b> 💡
            </div>
          </div>
        )}
        {solved && (
          <>
            <BubbleBurst count={14} seed={5} />
            <SparkleBurst count={16} seed={6} />
          </>
        )}
      </div>
      {canNext && <NextButton label={nextLabel} onClick={onNext} attention />}
    </Stage>
  );
}

/* ====================== 5) Watch the scene & choose ====================== */
export function SceneChoice({
  scene,
  options,
  answer,
  onSolved,
  canNext,
  onNext,
  nextLabel,
  badge,
}: GameProps & { scene: SceneKind; options: string[]; answer: number }) {
  const schedule = useTimeouts();
  const [show, setShow] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [wrongN, setWrongN] = useState(0);
  const [solved, setSolved] = useState(false);
  const tries = useRef(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    schedule(() => {
      setShow(true);
      sfx.bubbles(3);
    }, 2300);
  }, [schedule]);

  const pick = (i: number) => {
    if (solved) return;
    tries.current += 1;
    if (i === answer) {
      setSolved(true);
      setWrong(null);
      sfx.success();
      schedule(() => onSolved(boxRef.current?.getBoundingClientRect() ?? null, tries.current === 1), 1300);
    } else {
      setWrong(i);
      setWrongN((n) => n + 1);
      sfx.tryAgain();
    }
  };

  const speech: Speech = solved
    ? { text: PRAISE[2], tone: "good" }
    : wrong !== null
      ? { text: "قريبة! 💡 انظري جيدًا: مَن في المشهد؟ وماذا يفعل؟", tone: "hint", id: `w${wrongN}` }
      : { text: show ? "أيّ جملة تصف المشهد؟ 🤔" : "👀 شاهدي المشهد…", id: show ? "q" : "watch" };

  return (
    <Stage pose={solved ? "cheer" : "float"} mood={solved ? "joy" : wrong !== null ? "think" : "wow"} speech={speech}>
      {badge}
      <div className="chip anim-float-in">🎬 شاهدي المشهد… ثم اختاري الجملة التي تصفه</div>
      <div ref={boxRef} className="relative">
        <ActionScene kind={scene} size="clamp(150px, 27vmin, 300px)" />
        {solved && <SparkleBurst count={14} seed={9} />}
      </div>
      <div className="flex flex-col items-center gap-[1.5vmin]" style={{ minHeight: "clamp(150px, 27vmin, 260px)" }}>
        {show &&
          options.map((o, i) => {
            const [s, b, v] = o.replace(".", "").split(" ");
            return (
              <button
                key={wrong === i ? `w${wrongN}` : `o${i}`}
                type="button"
                className={`option-pill anim-float-in ${wrong === i ? "anim-shake" : ""} ${solved && i === answer ? "good" : ""}`}
                style={{ animationDelay: `${i * 0.15}s`, opacity: solved && i !== answer ? 0.4 : 1 }}
                onClick={() => pick(i)}
              >
                <Sentence subject={s} be={b as Be} verb={v} end={solved && i === answer ? ". ⭐" : "."} style={{ fontSize: "clamp(22px, 4.3vmin, 42px)" }} />
              </button>
            );
          })}
      </div>
      {canNext && <NextButton label={nextLabel} onClick={onNext} attention />}
    </Stage>
  );
}
