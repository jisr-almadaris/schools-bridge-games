import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { announce, sfx } from "../audio";
import type { ChoiceQ, ErrorQ, MatchQ, MovieQ, OrderQ, PictureQ, Question, Scene, SortQ } from "../data";
import Girl from "./Girl";
import { CorrectCtx, DragPiece, En, QuestionFrame, Sentence, hit, useAnswer, type Status } from "./ui";

interface QP<T> {
  q: T;
  step: string;
  title: string;
  tone?: string;
  onDone: () => void;
  onCorrect?: () => void;
}

function useTimers() {
  const T = useRef<number[]>([]);
  useEffect(() => () => T.current.forEach((t) => window.clearTimeout(t)), []);
  return (ms: number, fn: () => void) => T.current.push(window.setTimeout(fn, ms));
}

/* ---------------------------------- Prompts ---------------------------------- */
function MissingTicket({ word, fill, state }: { word: string; fill: string | null; state: Status }) {
  return (
    <div className="flex justify-center">
      <div dir="ltr" className="en shine relative rounded-2xl px-6 py-3 bg-gradient-to-br from-[#fff2a8] to-gold text-[#5a2a00] text-3xl sm:text-4xl font-bold border-2 border-dashed border-[#a0522d]/60 flex items-center gap-3 shadow-[0_8px_30px_rgba(255,190,60,0.4)]">
        🎟️ {word} →
        <span
          className={cn(
            "rounded-xl px-3 min-w-[3ch] text-center",
            !fill && "bg-white/60 text-[#a0522d]",
            fill && state === "correct" && "bg-turq/80 text-navy",
            fill && state === "wrong" && "bg-rose-300 shake"
          )}
        >
          {fill || "?"}
        </span>
      </div>
    </div>
  );
}

function ChoicePrompt({ q, fill, state }: { q: ChoiceQ; fill: string | null; state: Status }) {
  return (
    <div className="space-y-2">
      {q.ask && <p className="text-center text-lav font-bold text-base sm:text-lg">{q.ask}</p>}
      {q.mode === "sentence" ? null : q.mode === "missing" ? (
        <MissingTicket word={q.prompt} fill={fill} state={state} />
      ) : (
        <Sentence prompt={q.prompt} fill={fill} state={state} className="text-3xl sm:text-5xl" />
      )}
    </div>
  );
}

/* ---------------------------------- 🎢 Coaster ---------------------------------- */
let coasterAnnounced = false;
const SUPPORTS: [number, number][] = [
  [88, 70],
  [70, 70],
  [56, 58.5],
  [50, 41],
  [40, 22],
  [30, 41],
  [25, 59],
  [12, 71],
];

function CoasterQ({ q, step, title, tone, onDone }: QP<ChoiceQ>) {
  const { status, submit } = useAnswer(q.id);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "board" | "count" | "ride" | "back">("idle");
  const [count, setCount] = useState(3);
  const [wrong, setWrong] = useState<{ o: string; k: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const at = useTimers();

  const choose = (o: string) => {
    if (phase !== "idle" || status === "correct") return;
    if (o !== q.answer) {
      setWrong({ o, k: Date.now() });
      submit(false);
      return;
    }
    setWrong(null);
    setLoaded(o);
    setPhase("board");
    sfx.clunk();
    if (!coasterAnnounced) {
      coasterAnnounced = true;
      void announce(["Ready? Let's go!"], 2400);
    }
    at(750, () => {
      setPhase("count");
      setCount(3);
      sfx.count();
    });
    at(1450, () => {
      setCount(2);
      sfx.count();
    });
    at(2150, () => {
      setCount(1);
      sfx.count();
    });
    at(2850, () => {
      setPhase("ride");
      sfx.go();
      sfx.whoosh();
    });
    at(6000, () => {
      setPhase("back");
      sfx.stamp();
      submit(true, true);
      window.setTimeout(() => sfx.success(), 200);
    });
  };

  const riding = phase === "ride" || phase === "back";
  return (
    <QuestionFrame
      title={title}
      step={step}
      tone={tone}
      hint={q.hint}
      status={status}
      praise={q.praise}
      rule={q.rule}
      full={q.full}
      wrongTip={q.wrongTip}
      onContinue={onDone}
      prompt={<ChoicePrompt q={q} fill={loaded ?? wrong?.o ?? null} state={phase !== "idle" ? "correct" : wrong ? "wrong" : "idle"} />}
    >
      <div className="relative h-60 sm:h-72 rounded-3xl bg-gradient-to-b from-[#141a52] via-[#1b1760] to-[#2a1a66] overflow-hidden border border-white/10">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="absolute w-1 h-1 rounded-full bg-white twinkle" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 45}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
        {q.scene && (
          <div className="absolute top-2 right-2 z-10 w-28 h-24 sm:w-40 sm:h-32 rounded-xl p-1 bg-gradient-to-br from-gold to-orange-400 shadow-[0_0_20px_rgba(255,207,74,0.5)]">
            <div className="w-full h-full rounded-lg bg-[#151a52] overflow-hidden">
              <SceneArt scene={q.scene} size={62} />
            </div>
          </div>
        )}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {SUPPORTS.map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2={x} y2={100} stroke="#3a2a88" strokeWidth="5" vectorEffect="non-scaling-stroke" />
          ))}
          <polyline points="100,70 60,70 44,24 36,20 22,70 -40,72" fill="none" stroke={riding ? "#ffcf4a" : "#ff6fb5"} strokeWidth="7" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <polyline points="100,73 60,73 44,27 36,23 22,73 -40,75" fill="none" stroke="#1b8f95" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <polyline points="100,70 60,70 44,24 36,20 22,70 -40,72" fill="none" stroke={riding ? "#ffcf4a" : "#ff6fb5"} strokeWidth="18" opacity="0.18" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <div dir="ltr" className="absolute top-3 left-3 en rounded-xl bg-pink-500/90 px-3 py-1 font-bold text-sm sm:text-lg shadow-lg">GERUND COASTER 🎢</div>

        {/* girl waiting on the platform */}
        {!loaded && (
          <div className="absolute z-10" style={{ left: "56%", top: "70%", transform: "translate(-50%,-100%)" }}>
            <Girl pose="point" prop="ticket" size={64} flip />
          </div>
        )}

        {/* the cart */}
        <div
          ref={cartRef}
          key={phase === "back" ? "back" : "cart"}
          className={cn("absolute z-20", phase === "ride" && "coaster-ride", phase === "back" && "coaster-return")}
          style={{ left: "78%", top: "70%", transform: "translate(-50%,-100%)" }}
        >
          <div key={wrong?.k} className={cn("relative", wrong && "shake")}>
            {loaded && (
              <div className="absolute -top-[52px] left-1/2 -translate-x-1/2 pop-in">
                <Girl pose={riding ? "ride" : "sit"} size={56} />
              </div>
            )}
            <div
              className={cn(
                "relative w-32 sm:w-44 h-14 sm:h-16 rounded-2xl bg-gradient-to-b from-gold to-orange-400 border-4 flex items-center justify-center transition-all",
                dragging ? "border-turq shadow-[0_0_30px_rgba(62,230,214,0.9)] scale-110" : "border-white/70 shadow-[0_0_24px_rgba(255,207,74,0.6)]"
              )}
            >
              <span dir="ltr" className={cn("en font-bold uppercase text-[#4a1d00]", loaded ? "text-lg sm:text-2xl" : "text-sm sm:text-base opacity-60")}>
                {loaded || "⬇ DROP HERE"}
              </span>
              <div className="absolute -top-3 left-3 right-3 h-2.5 rounded-full bg-lav border border-white origin-left transition-transform duration-500" style={{ transform: loaded ? "rotate(0deg)" : "rotate(-50deg)" }} />
            </div>
            <div className="flex justify-between px-4 -mt-2">
              <span className="w-6 h-6 rounded-full bg-navy border-4 border-lav" />
              <span className="w-6 h-6 rounded-full bg-navy border-4 border-lav" />
            </div>
            {phase === "back" && (
              <div className="stamp absolute -top-16 -left-10 w-20 h-20 rounded-full border-4 border-pink-500 text-pink-500 bg-white/90 flex items-center justify-center text-center shadow-xl">
                <span className="en font-bold text-sm leading-tight">{q.stamp || "GERUND ✓"}</span>
              </div>
            )}
          </div>
        </div>

        {phase === "count" && (
          <div key={count} className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <span className="en text-8xl font-bold text-gold neon-gold pop-in">{count}</span>
          </div>
        )}
        {phase === "ride" && (
          <div className="absolute inset-x-0 top-3 z-30 flex flex-col items-center gap-1 pointer-events-none">
            <span className="en text-4xl sm:text-5xl font-bold text-gold neon-gold pop-in">🎢 WHOOSH!</span>
            <span dir="ltr" className="en text-xl sm:text-3xl font-bold bg-navy/70 rounded-2xl px-4 py-1 fade-up" style={{ animationDelay: "0.8s" }}>
              {q.full}
            </span>
          </div>
        )}
      </div>

      <p className="text-center text-lav mt-3 font-bold">اسحبي الكلمة الصحيحة إلى عربة الأفعوانية 🎢 (أو اضغطي عليها)</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 mt-3" dir="ltr">
        {q.options.map((o, i) => (
          <div key={o} className="flex flex-col items-center">
            <div className="h-16 sm:h-20 flex items-end">
              {loaded !== o && (
                <div key={wrong?.o === o ? wrong.k : 0} className={cn(wrong?.o === o && "shake")}>
                  <DragPiece
                    disabled={phase !== "idle" || status === "correct"}
                    onTap={() => choose(o)}
                    onDrop={(x, y) => (hit(cartRef.current, x, y) ? choose(o) : sfx.click())}
                    onDragState={setDragging}
                    className={cn(
                      "en uppercase text-xl sm:text-3xl font-bold px-5 sm:px-8 py-3 sm:py-4 rounded-2xl border-2 bg-gradient-to-b from-[#4b3aa6] to-[#2a1a66] border-lav/60 hover:border-gold shadow-lg",
                      wrong?.o === o && "border-rose-400"
                    )}
                  >
                    {o}
                  </DragPiece>
                </div>
              )}
            </div>
            <div className="w-full h-3 mt-2 rounded-full" style={{ background: "repeating-linear-gradient(90deg,#ff6fb5 0 18px,#3a2a88 18px 26px)" }} />
            <span className="en text-xs text-white/50 mt-1">TRACK {i + 1}</span>
          </div>
        ))}
      </div>
    </QuestionFrame>
  );
}

/* ---------------------------------- 🎡 Ferris wheel ---------------------------------- */
const CABIN = ["#ff6fb5", "#3ee6d6", "#ffcf4a", "#c7b8ff"];
function WheelQ({ q, step, title, tone, onDone }: QP<ChoiceQ>) {
  const { status, submit } = useAnswer(q.id);
  const [pick, setPick] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ o: string; k: number } | null>(null);
  const rimRef = useRef<SVGGElement>(null);
  const gRefs = useRef<(HTMLDivElement | null)[]>([]);
  const speed = useRef(14);
  const N = 8;
  const optAt = (i: number) => {
    const step = N / q.options.length;
    const k = q.options.findIndex((_, j) => Math.round(j * step) === i);
    return k >= 0 ? k : -1;
  };

  useEffect(() => {
    let a = -60;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed.current += (14 - speed.current) * Math.min(1, dt * 0.7);
      a = (a + speed.current * dt) % 360;
      rimRef.current?.setAttribute("transform", `rotate(${a} 150 150)`);
      for (let i = 0; i < N; i++) {
        const el = gRefs.current[i];
        if (!el) continue;
        const ang = ((a + (i * 360) / N) * Math.PI) / 180;
        el.style.left = `${50 + 37 * Math.cos(ang)}%`;
        el.style.top = `${50 + 37 * Math.sin(ang)}%`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    sfx.creak();
    return () => cancelAnimationFrame(raf);
  }, []);

  const lit = status === "correct";
  const choose = (o: string) => {
    if (lit) return;
    if (o === q.answer) {
      setPick(o);
      setWrong(null);
      speed.current = 170;
      sfx.creak();
      submit(true);
    } else {
      setWrong({ o, k: Date.now() });
      submit(false);
    }
  };

  return (
    <QuestionFrame
      title={title}
      step={step}
      tone={tone}
      hint={q.hint}
      status={status}
      praise={q.praise}
      rule={q.rule}
      full={q.full}
      wrongTip={q.wrongTip}
      onContinue={onDone}
      prompt={<ChoicePrompt q={q} fill={pick ?? wrong?.o ?? null} state={lit ? "correct" : wrong ? "wrong" : "idle"} />}
    >
      <div className="relative mx-auto w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] mb-12 mt-2">
        <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full overflow-visible">
          <path d="M70,330 L150,150 L230,330" stroke="#6d5bd0" strokeWidth="9" fill="none" />
          <g ref={rimRef}>
            {lit && <circle cx="150" cy="150" r="111" fill="none" stroke="#ffcf4a" strokeWidth="20" opacity="0.3" />}
            <circle cx="150" cy="150" r="111" fill="none" stroke="#c7b8ff" strokeWidth="5" />
            <circle cx="150" cy="150" r="90" fill="none" stroke="#8f78f0" strokeWidth="2" />
            {Array.from({ length: N }).map((_, i) => {
              const a = (i / N) * Math.PI * 2;
              return <line key={i} x1="150" y1="150" x2={150 + Math.cos(a) * 111} y2={150 + Math.sin(a) * 111} stroke="#8f78f0" strokeWidth="3" />;
            })}
            {Array.from({ length: 32 }).map((_, i) => {
              const a = (i / 32) * Math.PI * 2;
              return (
                <circle
                  key={"b" + i}
                  cx={150 + Math.cos(a) * 111}
                  cy={150 + Math.sin(a) * 111}
                  r="3.5"
                  fill={lit ? "#fff6c9" : CABIN[i % 4]}
                  className="bulb"
                  style={{ animationDelay: `${(i % 4) * 0.2}s`, animationDuration: lit ? "0.4s" : undefined }}
                />
              );
            })}
          </g>
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-navy border-4 border-gold flex items-center justify-center shadow-[0_0_24px_rgba(255,207,74,0.6)]">
          <span className="en text-xl sm:text-2xl font-bold text-gold neon-gold">{q.keyWord}</span>
        </div>
        {Array.from({ length: N }).map((_, i) => {
          const k = optAt(i);
          const o = k >= 0 ? q.options[k] : null;
          const chosen = o && pick === o;
          return (
            <div key={i} ref={(el) => void (gRefs.current[i] = el)} className="absolute z-20" style={{ transform: "translate(-50%, 0)" }}>
              <div className="mx-auto w-1 h-3 bg-lav" />
              {o ? (
                <button
                  key={wrong?.o === o ? wrong.k : 0}
                  onClick={() => choose(o)}
                  disabled={lit}
                  className={cn(
                    "relative en whitespace-nowrap text-base sm:text-xl font-bold px-3 sm:px-4 py-2 sm:py-3 rounded-b-3xl rounded-t-xl border-2 transition-colors",
                    "bg-gradient-to-b from-teal-400 to-cyan-700 border-white/80 shadow-[0_0_16px_rgba(62,230,214,0.6)] hover:brightness-125",
                    wrong?.o === o && "shake !from-rose-400 !to-rose-700",
                    chosen && "!from-gold !to-orange-400 text-[#4a1d00] glow-pulse"
                  )}
                >
                  {chosen && (
                    <span className="absolute -top-11 left-1/2 -translate-x-1/2 pop-in">
                      <Girl pose="wave" size={40} />
                    </span>
                  )}
                  {q.icons?.[k] ? `${q.icons[k]} ` : "💊 "}
                  {o}
                </button>
              ) : (
                <div className="w-10 h-8 sm:w-12 sm:h-10 rounded-b-2xl rounded-t-md border-2 border-white/50" style={{ background: CABIN[i % 4] }} />
              )}
            </div>
          );
        })}
      </div>
    </QuestionFrame>
  );
}

/* ---------------------------------- 🎈 Balloons ---------------------------------- */
const BAL = ["#ff6fb5", "#3ee6d6", "#ffcf4a"];
function BalloonQ({ q, step, title, tone, onDone }: QP<ChoiceQ>) {
  const { status, submit } = useAnswer(q.id);
  const [popped, setPopped] = useState<string | null>(null);
  const [wobble, setWobble] = useState<{ o: string; k: number } | null>(null);
  const wide = q.mode === "sentence";
  const choose = (o: string) => {
    if (status === "correct" || popped) return;
    if (o === q.answer) {
      setPopped(o);
      sfx.pop();
      window.setTimeout(() => submit(true), 380);
    } else {
      setWobble({ o, k: Date.now() });
      submit(false);
    }
  };
  return (
    <QuestionFrame
      title={title}
      step={step}
      tone={tone}
      hint={q.hint}
      status={status}
      praise={q.praise}
      rule={q.rule}
      full={q.full}
      wrongTip={q.wrongTip}
      onContinue={onDone}
      prompt={<ChoicePrompt q={q} fill={status === "correct" ? q.answer : wobble?.o ?? null} state={status === "correct" ? "correct" : wobble ? "wrong" : "idle"} />}
    >
      {!q.ask && <p className="text-center text-lav font-bold mb-2">فرقعي البالون الصحيح! 🎈</p>}
      <div className="relative flex justify-center items-end gap-2 sm:gap-8 h-72 sm:h-80 pt-10 rounded-3xl bg-gradient-to-b from-transparent to-[#2a1a66]/60">
        {q.options.map((o, i) => (
          <div key={o} className="drift" style={{ animationDelay: `${-i * 1.3}s`, animationDuration: `${3.4 + i * 0.7}s` }}>
            <button onClick={() => choose(o)} className="relative focus:outline-none block" aria-label={o}>
              <div key={wobble?.o === o ? wobble.k : 0} className={cn(wobble?.o === o && "shake", popped === o && "popped")}>
                <svg viewBox={wide ? "0 0 160 200" : "0 0 120 190"} className={cn("h-auto drop-shadow-[0_0_18px_rgba(255,255,255,0.25)]", wide ? "w-[9.4rem] sm:w-56" : "w-24 sm:w-32")}>
                  <ellipse cx={wide ? 80 : 60} cy="64" rx={wide ? 76 : 54} ry="62" fill={BAL[i % 3]} />
                  <ellipse cx={wide ? 50 : 40} cy="36" rx="12" ry="18" fill="#fff" opacity="0.35" />
                  <path d={wide ? "M74 124 h12 l-6 9z" : "M54 122 h12 l-6 9z"} fill={BAL[i % 3]} />
                  <path d={wide ? "M80 133 q-10 20 4 36 q10 12 -2 30" : "M60 131 q-10 20 4 36 q10 12 -2 23"} stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
                <span
                  dir="ltr"
                  className={cn("en absolute left-0 right-0 text-center font-bold text-[#1b1044] px-3 leading-tight", wide ? "top-[20%] text-sm sm:text-xl" : "top-[22%] sm:top-[24%] text-lg sm:text-2xl")}
                >
                  {o}
                </span>
              </div>
              {popped === o && <span className="absolute top-6 left-1/2 -translate-x-1/2 en text-4xl font-bold text-gold neon-gold pop-in whitespace-nowrap">POP! 🎈✨</span>}
            </button>
          </div>
        ))}
        <div className="absolute bottom-0 left-1 sm:left-3 pointer-events-none">
          <Girl pose={status === "correct" ? "clap" : "look"} prop={status === "correct" ? undefined : "balloon"} size={72} />
        </div>
      </div>
    </QuestionFrame>
  );
}

/* ---------------------------------- 🎟️ Ticket choice ---------------------------------- */
function ChoiceTicketQ({ q, step, title, tone, onDone }: QP<ChoiceQ>) {
  const { status, submit } = useAnswer(q.id);
  const [pick, setPick] = useState<string | null>(null);
  const sentence = q.mode === "sentence";
  const choose = (o: string) => {
    if (status === "correct") return;
    setPick(o);
    const ok = o === q.answer;
    submit(ok);
    if (!ok) window.setTimeout(() => setPick(null), 900);
  };
  return (
    <QuestionFrame
      title={title}
      step={step}
      tone={tone}
      hint={q.hint}
      status={status}
      praise={q.praise}
      rule={q.rule}
      full={q.full}
      wrongTip={q.wrongTip}
      onContinue={onDone}
      prompt={<ChoicePrompt q={q} fill={sentence ? null : pick} state={status} />}
    >
      <div className={cn("flex justify-center gap-4 sm:gap-6 py-4", sentence ? "flex-col sm:flex-row items-center" : "flex-wrap")}>
        {q.options.map((o) => (
          <button
            key={o}
            dir="ltr"
            onClick={() => choose(o)}
            disabled={status === "correct"}
            className={cn(
              "relative en font-bold rounded-2xl text-[#4a1d00] bg-gradient-to-br from-[#fff2a8] to-gold border-2 border-dashed border-[#a0522d]/60 transition-all hover:-translate-y-1 hover:rotate-[-2deg] shadow-[0_8px_24px_rgba(255,190,60,0.35)]",
              sentence ? "text-xl sm:text-2xl px-6 py-4" : "text-2xl sm:text-3xl px-10 py-5",
              pick === o && status === "wrong" && "shake !from-rose-200 !to-rose-400",
              pick === o && status === "correct" && "glow-pulse"
            )}
          >
            🎟️ {o}
          </button>
        ))}
      </div>
    </QuestionFrame>
  );
}

/* ---------------------------------- Scenes ---------------------------------- */
export function SceneArt({ scene, small, size }: { scene: Scene; small?: boolean; size?: number }) {
  return (
    <div dir="ltr" className="h-full w-full">
      <SceneInner scene={scene} s={size ?? (small ? 90 : 120)} />
    </div>
  );
}

function SceneInner({ scene, s }: { scene: Scene; s: number }) {
  if (scene === "read")
    return (
      <div className="relative flex items-end justify-center h-full">
        <span className="absolute top-2 right-6 text-3xl twinkle">✨</span>
        <span className="absolute top-8 left-8 text-2xl twinkle" style={{ animationDelay: "1s" }}>
          💖
        </span>
        <Girl pose="read" size={s} />
      </div>
    );
  if (scene === "soccer")
    return (
      <div className="relative flex items-end justify-center gap-2 h-full">
        <svg viewBox="0 0 100 70" className="w-20 sm:w-28 mb-3">
          <rect x="5" y="5" width="90" height="60" fill="none" stroke="#fff" strokeWidth="4" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={5 + i * 12} y1="5" x2={5 + i * 12} y2="65" stroke="#fff5" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={"h" + i} x1="5" y1={5 + i * 12} x2="95" y2={5 + i * 12} stroke="#fff5" />
          ))}
        </svg>
        <span className="text-4xl sm:text-5xl float mb-2">⚽</span>
        <Girl pose="point" variant="boy" size={s} flip />
        <span className="absolute top-2 right-4 text-2xl">⭐</span>
      </div>
    );
  if (scene === "swim")
    return (
      <div className="relative h-full flex items-end justify-center overflow-hidden rounded-xl">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-b from-cyan-400/70 to-blue-700/80" />
        <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="absolute inset-x-0 bottom-[60%] w-full h-6">
          <path d="M0,15 Q25,0 50,15 T100,15 T150,15 T200,15 T250,15 T300,15 V30 H0Z" fill="#67e8f9" />
        </svg>
        <div className="relative flex gap-4 mb-8 text-5xl sm:text-6xl">
          <span className="float">🏊‍♀️</span>
          <span className="float" style={{ animationDelay: "0.8s" }}>
            🏊
          </span>
        </div>
        <span className="absolute top-2 left-4 text-3xl">☀️</span>
      </div>
    );
  if (scene === "wantplay")
    return (
      <div className="relative flex items-end justify-center gap-3 h-full">
        <Girl pose="point" size={s} />
        <svg viewBox="0 0 80 130" className="w-16 sm:w-24 mb-1">
          <path d="M8 20 Q40 0 72 20 V128 H8Z" fill="#6d5bd0" stroke="#ffcf4a" strokeWidth="3" />
          <rect x="16" y="28" width="48" height="36" rx="4" fill="#0b0f3a" stroke="#3ee6d6" strokeWidth="2" />
          <path d="M40 36 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1z" fill="#ffcf4a" className="twinkle" />
          <rect x="12" y="72" width="56" height="16" rx="3" fill="#3a1f73" />
          <line x1="28" y1="80" x2="28" y2="70" stroke="#fff" strokeWidth="3" />
          <circle cx="28" cy="68" r="4" fill="#ff6fb5" />
          <circle cx="46" cy="80" r="3.5" fill="#3ee6d6" />
          <circle cx="56" cy="80" r="3.5" fill="#ffcf4a" />
          <text x="40" y="112" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="Fredoka" fontWeight="700">
            PLAY
          </text>
        </svg>
        <div className="absolute top-2 left-[22%] rounded-full bg-white text-navy px-3 py-1 text-lg sm:text-xl float shadow-lg">🎮 ⭐?</div>
      </div>
    );
  return (
    <div className="relative flex items-end justify-center gap-1 h-full">
      <Girl pose="draw" size={s} />
      <svg viewBox="0 0 100 130" className="w-[45%] max-w-[7rem] mb-1">
        <line x1="20" y1="130" x2="40" y2="10" stroke="#c08457" strokeWidth="5" />
        <line x1="80" y1="130" x2="60" y2="10" stroke="#c08457" strokeWidth="5" />
        <rect x="10" y="15" width="80" height="62" rx="3" fill="#fff" stroke="#c08457" strokeWidth="4" />
        <circle cx="30" cy="35" r="9" fill="#ffcf4a" />
        <path d="M14 72 L40 45 L58 62 L70 50 L86 72Z" fill="#3ee6d6" />
        <path d="M50 30 q8 -10 16 0 q8 -10 16 0 q0 10 -16 20 q-16 -10 -16 -20z" fill="#ff6fb5" />
      </svg>
      <span className="absolute top-2 right-6 text-2xl twinkle">🎨</span>
    </div>
  );
}

/* ---------------------------------- 🍿 Cinema screen shell ---------------------------------- */
function CinemaShell({ children, lit, open = true, caption }: { children: ReactNode; lit?: boolean; open?: boolean; caption?: string }) {
  return (
    <div className="relative rounded-3xl bg-[#140b33] p-3 sm:p-4 border border-white/10 overflow-hidden">
      <div className="bulb-row flex justify-center gap-3 mb-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-gold" />
        ))}
      </div>
      <div
        className={cn(
          "relative mx-2 sm:mx-6 min-h-[11rem] sm:min-h-[13rem] rounded-xl bg-gradient-to-b from-[#2b2a6e] to-[#151a52] border-4 transition-all overflow-hidden",
          lit ? "border-gold shadow-[0_0_50px_rgba(255,207,74,0.8)] brightness-125" : "border-white/30 shadow-[0_0_40px_rgba(199,184,255,0.25)]"
        )}
      >
        {children}
        <div className={cn("curtain curtain-l absolute inset-y-0 left-0 w-1/2 z-20", open && "open")} />
        <div className={cn("curtain curtain-r absolute inset-y-0 right-0 w-1/2 z-20", open && "open")} />
      </div>
      {caption && <p className="text-center text-sm sm:text-base text-lav mt-2 font-bold">{caption}</p>}
      <div className="flex items-end justify-center gap-3 mt-1">
        <div className="w-10 h-8 rounded-t-xl bg-rose-900/80" />
        <Girl pose="sit" prop="popcorn" size={52} />
        <div className="w-10 h-8 rounded-t-xl bg-rose-900/80" />
        <div className="w-10 h-8 rounded-t-xl bg-rose-900/80 hidden sm:block" />
      </div>
    </div>
  );
}

/* ---------------------------------- 🎬 Movie (explanation) ---------------------------------- */
function MovieView({ step, title, tone, onDone }: QP<MovieQ>) {
  const [open, setOpen] = useState(false);
  const [scene, setScene] = useState(0);
  const [reveal, setReveal] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => {
      setOpen(true);
      sfx.curtain();
    }, 700);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!open) return;
    setReveal(0);
    sfx.projector();
    const ts = [1100, 2100, 3100, 3700].map((ms, i) =>
      window.setTimeout(() => {
        setReveal(i + 1);
        if (i < 3) sfx.click();
      }, ms)
    );
    return () => ts.forEach((t) => window.clearTimeout(t));
  }, [open, scene]);

  const S = [
    { art: "read" as Scene, sent: <>I <b className="text-pink-300">enjoy</b> <b className="text-turq">reading</b>. 📖</>, a: "ENJOY", b: "READING", bc: "text-turq", name: "GERUND", form: "verb + ing" },
    { art: "wantplay" as Scene, sent: <>I <b className="text-pink-300">want</b> <b className="text-gold">to play</b>. 🎮</>, a: "WANT", b: "TO PLAY", bc: "text-gold", name: "INFINITIVE", form: "to + verb" },
  ];
  const cur = S[scene];

  return (
    <section className="glass w-full max-w-3xl rounded-[28px] overflow-hidden fade-up">
      <header className={cn("flex items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-gradient-to-l", tone)}>
        <h2 className="display text-xl sm:text-2xl truncate">{title}</h2>
        <span className="en text-xs sm:text-sm bg-white/15 rounded-full px-2.5 py-0.5 shrink-0">{step}</span>
      </header>
      <div className="px-4 sm:px-6 py-4">
        <p className="text-center text-lav font-bold mb-2">🎬 الفيلم يبدأ… شاهدي الفرق!</p>
        <CinemaShell open={open} lit={scene === 2 && reveal >= 3} caption={scene < 2 ? `المشهد ${scene + 1} 🎞️` : "المقارنة 🎞️"}>
          {scene < 2 ? (
            <div key={scene} className="grid grid-cols-[40%_60%] h-full min-h-[11rem] sm:min-h-[13rem]">
              <div className="h-full min-h-[11rem]">
                <SceneArt scene={cur.art} size={96} />
              </div>
              <div dir="ltr" className="flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 text-center">
                {reveal >= 1 && <p className="en text-xl sm:text-3xl font-semibold pop-in">{cur.sent}</p>}
                {reveal >= 2 && (
                  <div className="en font-bold leading-tight pop-in">
                    <p className="text-pink-300 text-lg sm:text-2xl">{cur.a}</p>
                    <p className="text-white/70">↓</p>
                    <p className={cn("text-lg sm:text-2xl", cur.bc)}>{cur.b}</p>
                  </div>
                )}
                {reveal >= 3 && (
                  <p className="en rounded-full bg-gold/20 border border-gold px-3 py-0.5 text-base sm:text-xl font-bold text-gold pop-in">
                    🎬 {cur.name} · {cur.form}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div dir="ltr" className="p-3 sm:p-5 grid grid-cols-2 gap-2 sm:gap-4 text-center min-h-[11rem] content-center">
              <div className="rounded-2xl bg-pink-500/15 border border-pink-400/60 p-2 sm:p-3 pop-in">
                <p className="en text-lg sm:text-2xl font-semibold">
                  I <span className="text-pink-300">enjoy</span> <span className="text-turq">playing</span>.
                </p>
                {reveal >= 2 && <p className="en mt-2 text-base sm:text-xl font-bold text-turq pop-in">ENJOY → -ING</p>}
              </div>
              <div className="rounded-2xl bg-teal-400/15 border border-turq/60 p-2 sm:p-3 pop-in" style={{ animationDelay: ".3s" }}>
                <p className="en text-lg sm:text-2xl font-semibold">
                  I <span className="text-pink-300">want</span> <span className="text-gold">to play</span>.
                </p>
                {reveal >= 2 && <p className="en mt-2 text-base sm:text-xl font-bold text-gold pop-in">WANT → TO + VERB</p>}
              </div>
              {reveal >= 3 && <p className="col-span-2 en text-2xl sm:text-3xl font-bold text-gold neon-gold pop-in">🎬 🎮 🎬</p>}
            </div>
          )}
        </CinemaShell>
        <div className="flex justify-center mt-4 min-h-[3.5rem]">
          {reveal >= 4 &&
            (scene < 2 ? (
              <button className="btn-main text-lg pop-in" onClick={() => { sfx.click(); setScene(scene + 1); }}>
                {scene === 0 ? "المشهد التالي 🎬" : "قارني بينهما ⚖️"}
              </button>
            ) : (
              <button className="btn-main text-lg pop-in" onClick={() => { sfx.click(); onDone(); }}>
                إلى ألعاب السينما 🍿
              </button>
            ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Order (cinema) ---------------------------------- */
function OrderQView({ q, step, title, tone, onDone }: QP<OrderQ>) {
  const { status, submit } = useAnswer(q.id);
  const [slots, setSlots] = useState<(string | null)[]>(q.answer.map(() => null));
  const [shakeK, setShakeK] = useState(0);
  const used = slots.filter(Boolean) as string[];
  const pool = q.words.filter((w) => !used.includes(w));

  const place = (w: string) => {
    if (status === "correct") return;
    sfx.click();
    const idx = slots.findIndex((x) => x === null);
    if (idx < 0) return;
    const next = [...slots];
    next[idx] = w;
    setSlots(next);
    if (next.every(Boolean)) {
      window.setTimeout(() => {
        const ok = next.every((x, i) => x === q.answer[i]);
        if (ok) {
          submit(true, true);
          sfx.fanfare();
        } else {
          submit(false);
          setShakeK((k) => k + 1);
          window.setTimeout(() => setSlots(q.answer.map(() => null)), 900);
        }
      }, 300);
    }
  };
  const unplace = (i: number) => {
    if (status === "correct" || !slots[i]) return;
    sfx.click();
    const next = [...slots];
    next[i] = null;
    setSlots(next);
  };
  const ok = status === "correct";
  return (
    <QuestionFrame title={title} step={step} tone={tone} hint={q.hint} status={status} praise={q.praise} rule={q.rule} full={q.full} wrongTip={q.wrongTip} onContinue={onDone}>
      <CinemaShell lit={ok} caption={q.sceneCaption}>
        <div className="h-44 sm:h-52">
          <SceneArt scene={q.scene} />
        </div>
        {ok && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-navy/40">
            <p className="en text-3xl sm:text-5xl font-bold text-gold neon-gold pop-in text-center">🎬 PERFECT SENTENCE!</p>
          </div>
        )}
      </CinemaShell>

      <p className="text-center text-lav mt-4 font-bold">رتّبي البطاقات لتكوين الجملة 🎬 (اضغطي على البطاقة)</p>
      <div key={shakeK} dir="ltr" className={cn("flex flex-wrap justify-center gap-2 sm:gap-3 mt-3", status === "wrong" && shakeK > 0 && "shake")}>
        {slots.map((w, i) => (
          <button
            key={i}
            onClick={() => unplace(i)}
            className={cn(
              "en min-w-[90px] sm:min-w-[120px] h-14 sm:h-16 rounded-2xl border-2 border-dashed text-2xl sm:text-3xl font-bold transition-all",
              w ? "border-solid border-gold bg-gold/15 text-gold" : "border-white/30 text-white/30",
              ok && "border-turq bg-turq/15 text-turq"
            )}
          >
            {w || i + 1}
          </button>
        ))}
        <span className="en text-3xl self-end font-bold">.</span>
      </div>
      <div dir="ltr" className="flex flex-wrap justify-center gap-3 mt-4 min-h-[4rem]">
        {pool.map((w) => (
          <button
            key={w}
            onClick={() => place(w)}
            className="en text-2xl sm:text-3xl font-bold px-6 py-3 rounded-2xl bg-gradient-to-b from-[#6d5bd0] to-[#3a1f73] border-2 border-lav/60 hover:-translate-y-1 hover:border-gold transition-all shadow-lg pop-in"
          >
            {w}
          </button>
        ))}
      </div>
    </QuestionFrame>
  );
}

/* ---------------------------------- 🕵️‍♀️ Find the mistake ---------------------------------- */
function ErrorQView({ q, step, title, tone, onDone }: QP<ErrorQ>) {
  const { status, submit } = useAnswer(q.id);
  const [found, setFound] = useState(false);
  const [bad, setBad] = useState<{ i: number; k: number } | null>(null);
  const [fixed, setFixed] = useState<string | null>(null);
  const ok = status === "correct";
  const tap = (i: number) => {
    if (ok || found) return;
    if (i === q.wrong) {
      setFound(true);
      setBad(null);
      sfx.secret();
    } else {
      setBad({ i, k: Date.now() });
      submit(false);
    }
  };
  const fix = (f: string) => {
    if (ok) return;
    if (f === q.fix) {
      setFixed(f);
      submit(true);
    } else {
      setBad({ i: -2, k: Date.now() });
      submit(false);
    }
  };
  return (
    <QuestionFrame title={title} step={step} tone={tone} hint={q.hint} status={status} praise={q.praise} rule={q.rule} full={q.full} wrongTip={q.wrongTip} onContinue={onDone}>
      <p className="text-center text-lg sm:text-xl font-extrabold">
        {!found ? "🕵️‍♀️ في الجملة خطأ واحد! اضغطي على الجزء الخطأ" : ok ? "✨ أصلحتِ الجملة!" : "🔎 وجدتِه! اختاري التصحيح"}
      </p>
      {q.scene && (
        <div className="mx-auto mt-3 w-56 sm:w-72 h-32 sm:h-40 rounded-2xl p-1.5 bg-gradient-to-br from-turq to-lav">
          <div className="w-full h-full rounded-xl bg-[#151a52] overflow-hidden">
            <SceneArt scene={q.scene} size={84} />
          </div>
        </div>
      )}
      <div dir="ltr" className="flex flex-wrap justify-center items-end gap-2 sm:gap-3 mt-5">
        {q.tokens.map((t, i) => {
          const isWrong = i === q.wrong;
          return (
            <button
              key={i + (bad?.i === i ? String(bad.k) : "")}
              onClick={() => tap(i)}
              className={cn(
                "en text-2xl sm:text-4xl font-bold px-3 sm:px-4 py-2 rounded-2xl border-2 transition-all",
                "border-white/20 bg-white/5 hover:border-gold hover:bg-white/10",
                bad?.i === i && "shake border-rose-400",
                isWrong && found && !fixed && "border-rose-400 bg-rose-500/20 text-rose-200 line-through decoration-4",
                isWrong && fixed && "border-turq bg-turq/20 text-turq neon-turq no-underline"
              )}
            >
              {isWrong && fixed ? fixed : t}
            </button>
          );
        })}
        <span className="en text-3xl sm:text-4xl font-bold">{q.end}</span>
      </div>
      {found && !ok && (
        <div key={bad?.i === -2 ? bad.k : 0} className={cn("flex justify-center gap-3 mt-5 pop-in", bad?.i === -2 && "shake")} dir="ltr">
          {q.fixes.map((f) => (
            <button key={f} onClick={() => fix(f)} className="en text-2xl sm:text-3xl font-bold px-6 py-3 rounded-2xl bg-gradient-to-b from-turq to-teal-700 border-2 border-white/70 hover:-translate-y-1 transition-all shadow-lg">
              ✏️ {f}
            </button>
          ))}
        </div>
      )}
    </QuestionFrame>
  );
}

/* ---------------------------------- 🔗 Match pairs ---------------------------------- */
const PAIR_COLORS = ["border-pink-400 bg-pink-500/25", "border-turq bg-teal-400/25", "border-gold bg-amber-400/25"];
function MatchQView({ q, step, title, tone, onDone }: QP<MatchQ>) {
  const { status, submit } = useAnswer(q.id);
  const rights = [...q.pairs.map((p) => p[1])].reverse();
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, string>>({});
  const [bad, setBad] = useState(0);
  const doneR = Object.values(done);

  useEffect(() => {
    if (!selL || !selR) return;
    const good = q.pairs.some(([l, r]) => l === selL && r === selR);
    if (good) {
      const next = { ...done, [selL]: selR };
      setDone(next);
      if (Object.keys(next).length === q.pairs.length) submit(true);
      else sfx.success();
    } else {
      setBad(Date.now());
      submit(false);
    }
    setSelL(null);
    setSelR(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selL, selR]);

  const colorOf = (l: string) => PAIR_COLORS[q.pairs.findIndex((p) => p[0] === l) % PAIR_COLORS.length];
  const leftOfR = (r: string) => Object.keys(done).find((l) => done[l] === r);

  return (
    <QuestionFrame title={title} step={step} tone={tone} hint={q.hint} status={status} praise={q.praise} rule={q.rule} full={q.full} wrongTip={q.wrongTip} onContinue={onDone}>
      <p className="text-center text-lav font-bold">اضغطي على كلمة ثم على الكلمة التي تناسبها 🔗</p>
      <div key={bad} dir="ltr" className={cn("grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 items-center mt-5", bad > 0 && "shake")}>
        <div className="flex flex-col gap-3">
          {q.pairs.map(([l]) => (
            <button
              key={l}
              disabled={!!done[l]}
              onClick={() => {
                sfx.click();
                setSelL(l);
              }}
              className={cn(
                "en text-2xl sm:text-3xl font-bold py-3 rounded-2xl border-2 transition-all",
                done[l] ? colorOf(l) : "bg-gradient-to-b from-[#fff2a8] to-gold text-[#4a1d00] border-white/70",
                selL === l && "ring-4 ring-turq scale-105"
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 text-3xl">
          {q.pairs.map(([l]) => (
            <span key={l} className={cn("h-[60px] flex items-center transition-all", done[l] ? "opacity-100 text-gold" : "opacity-30")}>
              ↔
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {rights.map((r) => {
            const l = leftOfR(r);
            return (
              <button
                key={r}
                disabled={doneR.includes(r)}
                onClick={() => {
                  sfx.click();
                  setSelR(r);
                }}
                className={cn(
                  "en text-2xl sm:text-3xl font-bold py-3 rounded-2xl border-2 transition-all",
                  l ? colorOf(l) : "bg-gradient-to-b from-[#6d5bd0] to-[#3a1f73] border-lav/60",
                  selR === r && "ring-4 ring-turq scale-105"
                )}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
    </QuestionFrame>
  );
}

/* ---------------------------------- Picture ---------------------------------- */
function PictureQView({ q, step, title, tone, onDone }: QP<PictureQ>) {
  const { status, submit } = useAnswer(q.id);
  const [pick, setPick] = useState<string | null>(null);
  const choose = (o: string) => {
    if (status === "correct") return;
    setPick(o);
    const ok = o === q.answer;
    submit(ok);
    if (!ok) window.setTimeout(() => setPick(null), 900);
  };
  return (
    <QuestionFrame title={title} step={step} tone={tone} hint={q.hint} status={status} praise={q.praise} rule={q.rule} full={q.full} wrongTip={q.wrongTip} onContinue={onDone}>
      <p className="text-center text-lav font-bold mb-3">انظري إلى الصورة… واختاري الجملة الأنسب 🖼️</p>
      <div className="mx-auto w-64 sm:w-80 h-48 sm:h-56 rounded-2xl p-2 bg-gradient-to-br from-gold to-orange-400 shadow-[0_0_30px_rgba(255,207,74,0.4)]">
        <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#2b2a6e] to-[#151a52] overflow-hidden">
          <SceneArt scene={q.scene} small />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
        {q.options.map((o) => (
          <button
            key={o}
            dir="ltr"
            onClick={() => choose(o)}
            disabled={status === "correct"}
            className={cn(
              "en text-2xl sm:text-3xl font-semibold px-6 py-4 rounded-2xl border-2 border-lav/60 bg-white/10 hover:bg-white/20 transition-all",
              pick === o && status === "wrong" && "shake border-rose-400 bg-rose-500/20",
              pick === o && status === "correct" && "border-turq bg-turq/20 glow-pulse"
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </QuestionFrame>
  );
}

/* ---------------------------------- Sort ---------------------------------- */
function SortQView({ q, step, title, tone, onDone }: QP<SortQ>) {
  const { status, submit } = useAnswer(q.id);
  const [placed, setPlaced] = useState<Record<string, "ger" | "inf">>({});
  const [sel, setSel] = useState<string | null>(null);
  const [bad, setBad] = useState<{ z: string; k: number } | null>(null);
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const drop = (word: string, zone: "ger" | "inf") => {
    if (status === "correct" || placed[word]) return;
    const card = q.cards.find((c) => c.word === word);
    if (!card) return;
    setSel(null);
    if (card.zone === zone) {
      const next = { ...placed, [word]: zone };
      setPlaced(next);
      if (Object.keys(next).length === q.cards.length) submit(true);
      else sfx.success();
    } else {
      setBad({ z: zone, k: Date.now() });
      submit(false);
    }
  };
  const zones: { id: "ger" | "inf"; title: string; sub: string; icon: string; cls: string }[] = [
    { id: "ger", title: "GERUND / -ING", sub: "verb + ing", icon: "🎢", cls: "from-pink-500/30 to-fuchsia-700/30 border-pink-400" },
    { id: "inf", title: "INFINITIVE / TO + VERB", sub: "to + verb", icon: "🎡", cls: "from-teal-400/30 to-cyan-700/30 border-turq" },
  ];
  const pool = q.cards.filter((c) => !placed[c.word]);
  return (
    <QuestionFrame title={title} step={step} tone={tone} hint={q.hint} status={status} praise={q.praise} rule={q.rule} full={q.full} wrongTip={q.wrongTip} onContinue={onDone}>
      <p className="text-center text-lav font-bold">اسحبي البطاقة إلى المكان المناسب ✋ (أو اضغطي عليها ثم على المكان)</p>
      <div dir="ltr" className="flex flex-wrap justify-center gap-3 sm:gap-4 my-5 min-h-[4.5rem]">
        {pool.map((c) => (
          <DragPiece
            key={c.word}
            onTap={() => {
              sfx.click();
              setSel(sel === c.word ? null : c.word);
            }}
            onDrop={(x, y) => {
              const z = (["ger", "inf"] as const).find((id) => hit(zoneRefs.current[id], x, y, 0));
              if (z) drop(c.word, z);
            }}
            className={cn(
              "en uppercase text-2xl sm:text-4xl font-bold px-6 sm:px-8 py-3 rounded-2xl bg-gradient-to-b from-gold to-orange-400 text-[#4a1d00] border-4 border-white/70 shadow-lg",
              sel === c.word && "ring-4 ring-turq -translate-y-1"
            )}
          >
            {c.word}
          </DragPiece>
        ))}
        {pool.length === 0 && <span className="text-3xl self-center">✨🎉✨</span>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="ltr">
        {zones.map((z) => {
          const inside = q.cards.filter((c) => placed[c.word] === z.id);
          return (
            <div
              key={z.id + (bad?.z === z.id ? bad.k : "")}
              ref={(el) => void (zoneRefs.current[z.id] = el)}
              onClick={() => sel && drop(sel, z.id)}
              className={cn(
                "rounded-3xl border-2 border-dashed bg-gradient-to-b p-4 min-h-[150px] text-center transition-all",
                z.cls,
                sel && "border-solid cursor-pointer hover:scale-[1.02]",
                bad?.z === z.id && "shake"
              )}
            >
              <div className="text-4xl">{z.icon}</div>
              <p className="en text-xl sm:text-2xl font-bold">{z.title}</p>
              <p className="en text-white/70">{z.sub}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {inside.map((c) => (
                  <span key={c.word} className="en uppercase text-2xl font-bold px-5 py-2 rounded-xl bg-white text-[#2a1450] pop-in">
                    {c.word} ✓
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-3 text-sm text-white/60">
        <En>enjoy</En> 🎟️ · <En>want</En> ⭐ · <En>hope</En> ⭐
      </p>
    </QuestionFrame>
  );
}

function Inner(props: QP<Question>) {
  const { q } = props;
  switch (q.type) {
    case "coaster":
      return <CoasterQ {...props} q={q} />;
    case "wheel":
      return <WheelQ {...props} q={q} />;
    case "balloon":
      return <BalloonQ {...props} q={q} />;
    case "choice":
      return <ChoiceTicketQ {...props} q={q} />;
    case "order":
      return <OrderQView {...props} q={q} />;
    case "picture":
      return <PictureQView {...props} q={q} />;
    case "sort":
      return <SortQView {...props} q={q} />;
    case "error":
      return <ErrorQView {...props} q={q} />;
    case "match":
      return <MatchQView {...props} q={q} />;
    case "movie":
      return <MovieView {...props} q={q} />;
  }
}

export function QuestionView(props: QP<Question>) {
  return (
    <CorrectCtx.Provider value={props.onCorrect}>
      <Inner {...props} />
    </CorrectCtx.Provider>
  );
}
