import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { sfx } from "../audio";
import { useGame } from "../store";
import { PARK_TIPS, SECRETS } from "../data";
import Girl from "./Girl";

/** Lets a screen react (e.g. light up the park) the moment a question is solved. */
export const CorrectCtx = createContext<(() => void) | undefined>(undefined);

export const En = ({ children, className }: { children: ReactNode; className?: string }) => (
  <span dir="ltr" className={cn("en", className)}>
    {children}
  </span>
);

/** Renders "I enjoy ___ books." with the key word highlighted and the blank filled. */
export function Sentence({ prompt, fill, state = "idle", className }: { prompt: string; fill?: string | null; state?: "idle" | "wrong" | "correct"; className?: string }) {
  const [before, after] = prompt.split("___");
  const words = before.trimEnd().split(" ");
  const key = words.pop() || "";
  return (
    <p dir="ltr" className={cn("en font-semibold leading-snug text-center", className)}>
      <span>{words.join(" ")} </span>
      <span className="text-pink-300 neon-pink">{key}</span>{" "}
      <span
        className={cn(
          "inline-block min-w-[4.5ch] px-2 mx-1 rounded-xl border-b-4 transition-all",
          !fill && "border-dashed border-white/50 text-white/40",
          fill && state === "correct" && "border-turq text-turq neon-turq bg-turq/10",
          fill && state === "wrong" && "border-rose-400 text-rose-300 bg-rose-500/10 shake",
          fill && state === "idle" && "border-gold text-gold"
        )}
      >
        {fill || "___"}
      </span>
      <span>{after}</span>
    </p>
  );
}

export type Status = "idle" | "wrong" | "correct";

export function useAnswer(qid: string) {
  const { record } = useGame();
  const [status, setStatus] = useState<Status>("idle");
  const [tries, setTries] = useState(0);
  const submit = (ok: boolean, quiet = false) => {
    record(qid, ok);
    if (ok) {
      setStatus("correct");
      if (!quiet) sfx.success();
    } else {
      setStatus("wrong");
      setTries((t) => t + 1);
      sfx.retry();
    }
  };
  return { status, tries, submit, setStatus };
}

interface FrameProps {
  title: ReactNode;
  step?: string;
  hint: string;
  status: Status;
  praise: string;
  rule: string;
  full: string;
  onContinue: () => void;
  children: ReactNode;
  prompt?: ReactNode;
  tone?: string;
  wrongTip?: string;
}
export function QuestionFrame({ title, step, hint, status, praise, rule, full, onContinue, children, prompt, tone = "from-pink-500/30 to-violet-600/30", wrongTip }: FrameProps) {
  const [showHint, setShowHint] = useState(false);
  const onCorrect = useContext(CorrectCtx);
  useEffect(() => {
    if (status === "correct") {
      setShowHint(false);
      onCorrect?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  return (
    <section className="glass w-full max-w-3xl rounded-[28px] overflow-hidden fade-up">
      <header className={cn("flex items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-gradient-to-l", tone)}>
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="display text-xl sm:text-2xl truncate">{title}</h2>
          {step && <span className="en text-xs sm:text-sm bg-white/15 rounded-full px-2.5 py-0.5 shrink-0">{step}</span>}
        </div>
        <button
          onClick={() => {
            sfx.click();
            setShowHint((v) => !v);
          }}
          className="btn-ghost text-sm sm:text-base shrink-0 !bg-gold/20 !border-gold/60"
        >
          تلميح 💡
        </button>
      </header>
      {showHint && (
        <div className="mx-4 sm:mx-6 mt-3 rounded-2xl bg-gold/15 border border-gold/50 px-4 py-3 text-amber-100 pop-in flex gap-2 items-start">
          <span className="text-2xl">💡</span>
          <p className="text-base sm:text-lg font-bold leading-relaxed">{hint}</p>
        </div>
      )}
      <div className="px-4 sm:px-6 pt-4 pb-5">
        {prompt && <div className="mb-3">{prompt}</div>}
        {children}
        <div className="min-h-[3rem] mt-4">
          {status === "wrong" && (
            <div className="rounded-2xl bg-violet-400/15 border border-lav/40 px-4 py-3 text-center pop-in">
              <p className="text-lg sm:text-xl font-extrabold">قريبة! 💡 راجعي التذكرة السرية.</p>
              {wrongTip && <p className="text-lg font-bold text-gold mt-1">{wrongTip}</p>}
              <p className="text-sm text-lav mt-1">جرّبي مرة أخرى… أنتِ تقتربين! (يمكنكِ الضغط على «تلميح 💡»)</p>
            </div>
          )}
          {status === "correct" && (
            <div className="relative rounded-2xl bg-gradient-to-l from-turq/20 to-emerald-400/10 border border-turq/60 px-4 py-4 text-center pop-in">
              <div className="absolute -top-16 left-2 sm:left-4 hidden sm:block">
                <Girl pose="clap" size={70} />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold">
                <bdi>{praise}</bdi>
              </p>
              <p dir="ltr" className="en text-2xl sm:text-3xl font-bold text-white mt-2">
                {full}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
                <span dir="ltr" className="en rounded-full bg-gold/20 border border-gold/60 text-gold px-4 py-1 font-semibold">
                  {rule}
                </span>
                <button
                  className="btn-main text-lg"
                  onClick={() => {
                    sfx.click();
                    onContinue();
                  }}
                >
                  متابعة 🎟️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Modal({ open, onClose, children, wide }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-navy/70 backdrop-blur-sm no-print" onClick={onClose}>
      <div
        className={cn("glass rounded-[28px] w-full max-h-[92vh] overflow-y-auto pop-in", wide ? "max-w-4xl" : "max-w-xl")}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function GoldenTicket({ n, small, className }: { n: number; small?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "relative shine rounded-2xl text-[#5a2a00] bg-gradient-to-br from-[#fff2a8] via-gold to-[#f59e0b] border-2 border-[#fff6c9] shadow-[0_10px_40px_rgba(255,190,60,0.5)]",
        small ? "px-4 py-2" : "px-8 py-6",
        className
      )}
    >
      <span className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-night" />
      <span className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-night" />
      <div className="border-2 border-dashed border-[#a0522d]/50 rounded-xl px-4 py-3 text-center">
        <p className={cn("en font-bold tracking-wider", small ? "text-lg" : "text-3xl sm:text-4xl")}>🎟️ GOLDEN TICKET {n}</p>
        {!small && <p className="en text-sm sm:text-base font-semibold opacity-80 mt-1">Gerund & Infinitive Adventure Park</p>}
        {!small && <p className="text-lg mt-1">⭐ ⭐ ⭐</p>}
      </div>
    </div>
  );
}

export function TicketStamp({ n, onContinue, label, note }: { n: number; onContinue: () => void; label: string; note?: ReactNode }) {
  const [stamped, setStamped] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => {
      setStamped(true);
      sfx.stamp();
      window.setTimeout(() => sfx.success(), 250);
    }, 900);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <section className="w-full max-w-3xl flex flex-col items-center text-center fade-up">
      <p className="display text-2xl sm:text-3xl text-lav mb-4">🎉 مبروك! حصلتِ على</p>
      <div className="flex items-end gap-2 sm:gap-6">
        <div className="relative pop-in">
          <GoldenTicket n={n} />
          {stamped && (
            <div className="stamp absolute -top-6 -left-4 sm:-left-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[5px] border-pink-500 text-pink-500 bg-white/85 flex flex-col items-center justify-center shadow-xl">
              <span className="en font-bold text-2xl leading-none">STAMP!</span>
              <span className="text-2xl">✔</span>
            </div>
          )}
        </div>
        <Girl pose={stamped ? "cheer" : "ticket"} size={110} className="hidden sm:inline-block" />
      </div>
      {note && <div className="mt-6 text-lg">{note}</div>}
      <button className="btn-main text-lg mt-6" disabled={!stamped} onClick={onContinue}>
        {label}
      </button>
    </section>
  );
}

export function SecretTicket({ id, onOpened, opened: initiallyOpen }: { id: number; onOpened?: () => void; opened?: boolean }) {
  const [open, setOpen] = useState(!!initiallyOpen);
  const s = SECRETS[id];
  if (!open)
    return (
      <button
        onClick={() => {
          sfx.secret();
          setOpen(true);
          onOpened?.();
        }}
        className="glow-pulse float rounded-3xl px-8 py-6 bg-gradient-to-br from-[#2a1a66] to-[#0b0f3a] border-2 border-gold/70 text-center"
      >
        <div className="text-5xl mb-2">🔐</div>
        <p className="en text-2xl font-bold text-gold neon-gold">SECRET TICKET</p>
        <p className="text-base mt-1 text-lav">اضغطي لفتح السرّ ✨</p>
      </button>
    );
  return (
    <div className="unlock-open relative rounded-3xl px-6 py-5 bg-gradient-to-br from-[#3a1f73] to-[#141a52] border-2 border-turq/70 text-center max-w-md w-full shadow-[0_0_40px_rgba(62,230,214,0.35)]">
      <p className="en text-lg font-bold text-gold">🔐 SECRET TICKET #{id}</p>
      <div className="mx-auto my-3 inline-flex items-center gap-3 rounded-2xl bg-black/40 border-2 border-gold px-5 py-2 glow-pulse">
        <span className="en text-lg font-bold text-lav">CODE:</span>
        <span className="en text-5xl font-bold text-gold neon-gold">{s.code}</span>
      </div>
      <p className="text-sm text-lav mb-2">احتفظي بهذا الرقم… سيفتح بوابة سرية لاحقًا 🔒 (ستجدينه أعلى الشاشة)</p>
      <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
        <p className="en text-sm font-bold text-gold mb-1">SECRET GRAMMAR TIP 💡</p>
        <p dir="ltr" className="en text-2xl sm:text-3xl font-bold">
          <span className="text-pink-300 neon-pink">{s.word}</span> → <span className="text-turq neon-turq">{s.form}</span>
        </p>
        <p className="en text-2xl mt-1">
          {s.ex} {s.em}
        </p>
      </div>
    </div>
  );
}

export function Caption({ lines }: { lines: string[] | null }) {
  if (!lines) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-2xl pop-in no-print">
      <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3 border-gold/50">
        <span className="text-3xl">🎙️</span>
        <div dir="ltr" className="en text-left">
          {lines.map((l) => (
            <p key={l} className="text-lg sm:text-2xl font-semibold text-gold neon-gold leading-snug">
              “{l}”
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Pointer drag (mouse + touch) ---------------------------- */
export function hit(el: HTMLElement | null, x: number, y: number, pad = 24) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
}

export function DragPiece({
  children,
  className,
  onDrop,
  onTap,
  disabled,
  onDragState,
}: {
  children: ReactNode;
  className?: string;
  onDrop: (x: number, y: number) => void;
  onTap: () => void;
  disabled?: boolean;
  onDragState?: (dragging: boolean) => void;
}) {
  const st = useRef({ sx: 0, sy: 0, drag: false, id: -1 });
  const [pos, setPos] = useState({ x: 0, y: 0, on: false });
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn("touch-none select-none", pos.on ? "z-40 scale-110 cursor-grabbing" : "cursor-grab transition-transform", className)}
      style={{ transform: pos.on ? `translate(${pos.x}px, ${pos.y}px) scale(1.08)` : undefined, position: "relative" }}
      onPointerDown={(e) => {
        if (disabled) return;
        st.current = { sx: e.clientX, sy: e.clientY, drag: false, id: e.pointerId };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const s = st.current;
        if (s.id !== e.pointerId) return;
        const dx = e.clientX - s.sx;
        const dy = e.clientY - s.sy;
        if (!s.drag && Math.hypot(dx, dy) > 8) {
          s.drag = true;
          onDragState?.(true);
        }
        if (s.drag) setPos({ x: dx, y: dy, on: true });
      }}
      onPointerUp={(e) => {
        const s = st.current;
        if (s.id !== e.pointerId) return;
        st.current.id = -1;
        if (s.drag) {
          onDrop(e.clientX, e.clientY);
          onDragState?.(false);
        } else onTap();
        setPos({ x: 0, y: 0, on: false });
      }}
      onPointerCancel={() => {
        st.current.id = -1;
        onDragState?.(false);
        setPos({ x: 0, y: 0, on: false });
      }}
    >
      {children}
    </button>
  );
}

/* ---------------------------- Neon park tip (one fact per appearance) ---------------------------- */
export function ParkTip({ index, className }: { index: number; className?: string }) {
  const t = PARK_TIPS[((index % PARK_TIPS.length) + PARK_TIPS.length) % PARK_TIPS.length];
  const label = index % 2 === 0 ? "🎡 DID YOU KNOW?" : "🎟️ PARK TIP";
  return (
    <div className={cn("relative rounded-2xl border-2 border-turq/80 bg-[#0b0f3a]/85 px-4 py-3 text-center shadow-[0_0_24px_rgba(62,230,214,0.45)]", className)}>
      <div className="bulb-row absolute -top-1.5 left-4 right-4 flex justify-between">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-turq" />
        ))}
      </div>
      <p className="en text-sm font-bold text-pink-300 neon-pink neon">{label}</p>
      <p dir="ltr" className="en text-xl sm:text-2xl font-bold text-gold neon-gold">
        {t.rule}
      </p>
      <p dir="ltr" className="en text-base sm:text-lg text-white/90">
        {t.ex}
      </p>
    </div>
  );
}

/* ---------------------------- 🎟️ Choices map ---------------------------- */
export function ChoiceMap() {
  return (
    <div className="text-center">
      <p className="display text-3xl sm:text-4xl text-gold neon-gold">🎟️ «خريطة الاختيارات»</p>
      <div dir="ltr" className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
        <div className="rounded-3xl p-4 bg-gradient-to-b from-pink-500/25 to-fuchsia-900/25 border-2 border-pink-400/70">
          <p className="en text-2xl sm:text-3xl font-bold">GERUND 🎢</p>
          <p className="en text-xl text-turq font-semibold">verb + ing</p>
          <div className="en text-lg sm:text-xl mt-2 space-y-0.5">
            <p>
              <span className="text-pink-300">enjoy</span> → <span className="text-turq">playing</span>
            </p>
            <p>
              <span className="text-pink-300">finish</span> → <span className="text-turq">reading</span>
            </p>
            <p>
              <span className="text-pink-300">keep</span> → <span className="text-turq">trying</span>
            </p>
          </div>
        </div>
        <div className="rounded-3xl p-4 bg-gradient-to-b from-teal-400/25 to-cyan-900/25 border-2 border-turq/70">
          <p className="en text-2xl sm:text-3xl font-bold">INFINITIVE 🎡</p>
          <p className="en text-xl text-gold font-semibold">to + verb</p>
          <div className="en text-lg sm:text-xl mt-2 space-y-0.5">
            <p>
              <span className="text-pink-300">want</span> → <span className="text-gold">to play</span>
            </p>
            <p>
              <span className="text-pink-300">need</span> → <span className="text-gold">to study</span>
            </p>
            <p>
              <span className="text-pink-300">hope</span> → <span className="text-gold">to win</span>
            </p>
            <p>
              <span className="text-pink-300">plan</span> → <span className="text-gold">to visit</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-3 text-right">
        <div className="rounded-2xl p-3 bg-pink-500/10 border border-pink-300/40">
          <p className="font-extrabold">💗 تلميح للتذكّر:</p>
          <p className="text-sm sm:text-base mt-1 leading-relaxed">
            <En className="font-bold text-pink-200">enjoy / like / love</En> غالبًا نراها مع <En className="text-turq font-bold">-ing</En> عند الحديث عن أشياء نستمتع بها أو نحبها.
          </p>
          <p className="text-sm mt-2 text-pink-100/80 leading-relaxed">
            ⭐ وتذكّري: <En>like</En> و<En>love</En> يمكن أن يأتي بعدهما أكثر من تركيب صحيح، لذلك لا تعامليهما كقاعدة مطلقة.
          </p>
        </div>
        <div className="rounded-2xl p-3 bg-teal-400/10 border border-turq/40">
          <p className="font-extrabold">🌟 الرغبة / الحاجة / الخطة:</p>
          <p className="text-sm sm:text-base mt-1">
            <En className="font-bold text-cyan-200">want · need · hope · plan</En> غالبًا تساعدنا على تذكّر <En className="text-gold font-bold">to + verb</En>
          </p>
          <div dir="ltr" className="en text-sm sm:text-base mt-1 text-left sm:text-center">
            I want to play. · I need to study. · I hope to win. · I plan to visit.
          </div>
        </div>
      </div>
      <p className="mt-3 inline-block rounded-full bg-gold/15 border border-gold/50 px-4 py-1.5 text-sm sm:text-base font-bold text-amber-100">
        «هذه إشارات تساعدكِ على التذكر، وليست معنى Gerund أو Infinitive نفسه.»
      </p>
    </div>
  );
}

export function InitiativeHero({ compact }: { compact?: boolean }) {
  return (
    <div className="text-center">
      <p className={cn("display neon-gold text-gold leading-tight", compact ? "text-3xl sm:text-4xl" : "text-5xl sm:text-7xl")}>مبادرة جسر المدارس 🌉</p>
      <p className={cn("mt-3 font-bold text-lav leading-relaxed", compact ? "text-base sm:text-lg" : "text-lg sm:text-2xl")}>
        «جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»
      </p>
    </div>
  );
}
