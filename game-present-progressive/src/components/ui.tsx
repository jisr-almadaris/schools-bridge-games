import { useMemo } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Be } from "../game/data";
import { seeded } from "../game/utils";
import Diver from "./Diver";
import type { Mood, Pose } from "./Diver";

/* ---------------- Stage: host diver + activity ---------------- */
export type Speech = { text: ReactNode; tone?: "hint" | "good" | "info"; id?: string | number } | null;

export function Stage({
  pose,
  mood,
  speech,
  hostExtra,
  children,
}: {
  pose: Pose;
  mood: Mood;
  speech?: Speech;
  hostExtra?: ReactNode;
  children: ReactNode;
}) {
  const sk = speech ? String(speech.id ?? (typeof speech.text === "string" ? speech.text : "s")) : "none";
  return (
    <div className="stage">
      <div className="stage-host">
        <div className="speech-slot">
          {speech && (
            <div key={sk} className={`speech ${speech.tone ?? ""} anim-pop-in`}>
              {speech.text}
            </div>
          )}
        </div>
        <div className="relative">
          <Diver className="host-diver" pose={pose} mood={mood} bob bubbles={pose === "swim"} />
          {hostExtra}
        </div>
      </div>
      <div className="stage-main">{children}</div>
    </div>
  );
}

/* ---------------- Sentence (colour coded) ---------------- */
export function Sentence({
  subject,
  be,
  verb,
  split,
  labels,
  pulseKey = 0,
  end = ".",
  fresh,
  className,
  style,
}: {
  subject: string;
  be: Be | null;
  verb: string;
  split?: boolean;
  labels?: boolean;
  pulseKey?: number;
  end?: string;
  fresh?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const hasIng = verb.endsWith("ing");
  const base = hasIng ? verb.slice(0, -3) : verb;
  const subj = (
    <span key={`s${pulseKey}`} className={`inline-block ${split ? "chunk chunk-subj" : "w-subj"} ${pulseKey ? "subj-pulse" : ""}`}>
      {subject}
    </span>
  );
  const beEl = be ? (
    <span className={`inline-block ${split ? "chunk chunk-be" : "w-be"} ${fresh ? "anim-pop-in" : ""}`}>{be}</span>
  ) : (
    <span className="blank">?</span>
  );
  const verbEl = (
    <span className={`inline-block ${split ? "chunk chunk-ing" : "w-verb"}`}>
      {base}
      <span className="ing-mark">{hasIng ? "ing" : ""}</span>
    </span>
  );
  if (split) {
    const part = (el: ReactNode, label: string) => (
      <span className="inline-flex flex-col items-center gap-1">
        {el}
        {labels && (
          <span className="font-bold" style={{ fontFamily: "var(--font-ar)", fontSize: "0.34em", direction: "rtl", opacity: 0.95 }}>
            {label}
          </span>
        )}
      </span>
    );
    return (
      <div className={`sentence ${className ?? ""}`} style={style}>
        {part(subj, "الفاعل")}
        <span className="sep" />
        {part(beEl, "am / is / are")}
        <span className="sep" />
        {part(verbEl, "الفعل + ing")}
      </div>
    );
  }
  return (
    <div className={`sentence ${className ?? ""}`} style={style}>
      {subj}
      {beEl}
      <span className="inline-block">
        {verbEl}
        {end}
      </span>
    </div>
  );
}

/* ---------------- Rule row: He / She / It → IS ---------------- */
export function RuleRow({ subjects, be, className, style }: { subjects: string[]; be: string; className?: string; style?: CSSProperties }) {
  return (
    <div className={`sentence ${className ?? ""}`} style={style}>
      {subjects.map((s, i) => (
        <span key={s} className="inline-flex items-center gap-[0.25em]">
          <span className="chunk chunk-subj">{s}</span>
          {i < subjects.length - 1 && <span className="opacity-80">/</span>}
        </span>
      ))}
      <span className="px-1 text-[#fde68a]">→</span>
      <span className="chunk chunk-be">{be}</span>
    </div>
  );
}

/* ---------------- Effects ---------------- */
export function SparkleBurst({ count = 12, seed = 1, className }: { count?: number; seed?: number; className?: string }) {
  const items = useMemo(() => {
    const r = seeded(seed);
    const cols = ["#fde68a", "#ffffff", "#f9a8d4", "#a5f3fc"];
    return Array.from({ length: count }, () => ({
      x: r() * 100,
      y: r() * 100,
      s: 14 + r() * 22,
      d: r() * 0.6,
      c: cols[Math.floor(r() * cols.length)],
    }));
  }, [count, seed]);
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.s,
            color: p.c,
            textShadow: `0 0 10px ${p.c}`,
            animation: `k-sparkle 1.2s ease-out ${p.d}s both`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

export function BubbleBurst({ count = 10, seed = 2, className }: { count?: number; seed?: number; className?: string }) {
  const items = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, () => ({
      x: 30 + r() * 40,
      s: 8 + r() * 16,
      d: r() * 0.5,
      dur: 1.2 + r() * 1,
      sx: (r() - 0.5) * 120,
    }));
  }, [count, seed]);
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {items.map((b, i) => (
        <span
          key={i}
          className="amb-bubble"
          style={
            {
              left: `${b.x}%`,
              bottom: "30%",
              width: b.s,
              height: b.s,
              "--sx": `${b.sx}px`,
              animation: `k-rise-short ${b.dur}s ease-out ${b.d}s both`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function PopBurst({ size, text = "POP! ✨" }: { size: string; text?: string }) {
  const drops = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className="pointer-events-none relative" style={{ width: size, height: size }}>
      <span
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{ width: "100%", height: "100%", border: "4px solid rgba(255,255,255,.95)", animation: "k-burst-ring .6s ease-out forwards" }}
      />
      {drops.map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <span
            key={a}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={
              {
                width: 12,
                height: 12,
                background: "radial-gradient(circle at 30% 30%, #fff, #a5f3fc)",
                "--dx": `${Math.cos(rad) * 90}px`,
                "--dy": `${Math.sin(rad) * 90}px`,
                animation: "k-droplet .65s ease-out forwards",
              } as CSSProperties
            }
          />
        );
      })}
      <span
        className="font-en absolute left-1/2 top-1/2 whitespace-nowrap font-bold"
        style={{
          transform: "translate(-50%,-50%)",
          fontSize: "clamp(22px, 4.4vmin, 42px)",
          color: "#fef9c3",
          textShadow: "0 3px 0 #7c3aed, 0 0 16px #fde68a",
          animation: "k-pop-in .4s both",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ---------------- progress dots ---------------- */
export function StepDots({ icons, current }: { icons: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2" dir="rtl">
      {icons.map((ic, i) => (
        <span key={i} className={`step-dot ${i < current ? "done" : i === current ? "now" : ""}`}>
          {i < current ? "✓" : ic}
        </span>
      ))}
    </div>
  );
}

export function NextButton({ label, onClick, attention }: { label: string; onClick: () => void; attention?: boolean }) {
  return (
    <button
      type="button"
      className={`btn-primary anim-pop-in ${attention ? "anim-attention" : ""}`}
      style={{ fontSize: "clamp(18px, 3.4vmin, 30px)" }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
