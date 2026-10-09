import { useEffect, useRef, useState } from "react";
import { sfx } from "../game/sfx";
import { setPearlTarget, useTimeouts } from "../game/utils";
import Diver from "./Diver";
import { BranchCoral, FanCoral, FarReef, Seaweed } from "./sea/Corals";
import { Fish } from "./sea/Creatures";
import { Bubbles, LightRays, Plankton } from "./sea/OceanScene";
import { RuleRow, Sentence } from "./ui";

/* ======================= HUD ======================= */
export function HUD({
  pearls,
  zoneLabel,
  game,
  showBadge = true,
  muted,
  onToggleMute,
  onGuide,
  bump,
}: {
  pearls: number;
  zoneLabel?: string;
  game: boolean;
  showBadge?: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onGuide: () => void;
  bump: number;
}) {
  return (
    <div className="hud pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="hud-row">
        <div className="hud-start">
          {game && (
            <div
              key={bump}
              ref={(el) => {
                if (el) setPearlTarget(el);
              }}
              className={`hud-pill pointer-events-auto ${bump ? "anim-count-bump" : ""}`}
              title="اللآلئ"
            >
              <span>💎</span>
              <span className="font-en font-bold ltr">{pearls}/5</span>
              <span className="hidden items-center gap-1 sm:flex" style={{ fontSize: 13 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={`pearl-dot ${i < pearls ? "on" : ""}`} />
                ))}
              </span>
            </div>
          )}
          {game && zoneLabel && (
            <span className="hidden lg:inline-flex">
              <span className="hud-pill">{zoneLabel}</span>
            </span>
          )}
        </div>
        {showBadge ? <div className="hud-badge pointer-events-auto">مبادرة جسر المدارس 🌉</div> : <div />}
        <div className="hud-end">
          {game && (
            <button type="button" className="btn-glass hud-btn pointer-events-auto" onClick={onGuide}>
              دليل الغواصة 📘🤿
            </button>
          )}
          <button
            type="button"
            className="btn-glass hud-btn hud-sound pointer-events-auto"
            onClick={onToggleMute}
            aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
            title={muted ? "تشغيل الصوت" : "كتم الصوت"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================= Diver's guide (3 pages) ======================= */
export function Guide({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);
  const tabs = ["🫧 NOW", "am · is · are", "verb + ing"];
  const go = (p: number) => {
    setPage(p);
    sfx.bubble(0.12);
  };
  return (
    <div
      className="anim-fade-in fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: "radial-gradient(circle at 50% 40%, rgba(14,116,144,.6), rgba(3,15,45,.85))" }}
    >
      <Bubbles count={12} seed={77} />
      <div className="guide-book anim-pop-in">
        <div className="guide-head">دليل الغواصة 📘🤿</div>
        <div className="guide-tabs">
          {tabs.map((t, i) => (
            <button key={t} type="button" className={`guide-tab font-en ${i === page ? "on" : ""}`} onClick={() => go(i)}>
              {t}
            </button>
          ))}
        </div>
        <div className="guide-page">
          {page === 0 && (
            <div key="p0" className="anim-float-in flex flex-col items-center gap-[1.4vmin] text-center">
              <div className="font-en font-bold" style={{ fontSize: "clamp(40px, 9vmin, 88px)", textShadow: "0 0 24px rgba(255,255,255,.6)" }}>
                NOW 🫧
              </div>
              <div className="gold-text font-en font-bold" style={{ fontSize: "clamp(26px, 5.4vmin, 52px)" }}>
                Present Progressive
              </div>
              <div className="font-extrabold" style={{ fontSize: "clamp(22px, 4.4vmin, 42px)" }}>
                شيء يحدث الآن.
              </div>
            </div>
          )}
          {page === 1 && (
            <div key="p1" className="anim-float-in flex flex-col items-center gap-[1.8vmin]" style={{ fontSize: "clamp(24px, 5vmin, 48px)" }}>
              <RuleRow subjects={["I"]} be="am" />
              <RuleRow subjects={["He", "She", "It"]} be="is" />
              <RuleRow subjects={["You", "We", "They"]} be="are" />
            </div>
          )}
          {page === 2 && (
            <div key="p2" className="anim-float-in flex flex-col items-center gap-[1.2vmin]">
              <div className="sentence" style={{ fontSize: "clamp(32px, 6.6vmin, 64px)" }}>
                verb + <span className="ing-mark">ing</span>
              </div>
              <div className="flex flex-col items-center gap-1" style={{ fontSize: "clamp(22px, 4.2vmin, 40px)" }}>
                {[
                  ["play", "play"],
                  ["read", "read"],
                  ["eat", "eat"],
                ].map(([a, b]) => (
                  <div key={a} className="sentence">
                    <span className="w-verb">{a}</span>
                    <span className="text-[#fde68a]">→</span>
                    <span className="w-verb">
                      {b}
                      <span className="ing-mark">ing</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-3 font-extrabold" style={{ fontSize: "clamp(20px, 3.8vmin, 36px)" }}>
                <span>مثال:</span>
                <Sentence subject="She" be="is" verb="playing" style={{ fontSize: "1.15em" }} />
              </div>
            </div>
          )}
        </div>
        <div className="guide-nav">
          <button type="button" className="btn-glass px-4 py-1" disabled={page === 0} onClick={() => go(Math.max(0, page - 1))}>
            ➡ السابق
          </button>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`pearl-dot ${i === page ? "on" : ""}`} style={{ fontSize: 14 }} />
            ))}
          </div>
          <button type="button" className="btn-glass px-4 py-1" disabled={page === 2} onClick={() => go(Math.min(2, page + 1))}>
            التالي ⬅
          </button>
        </div>
        <button type="button" className="btn-teal" style={{ fontSize: "clamp(18px, 3.4vmin, 28px)" }} onClick={onClose}>
          أعود للغوص 🌊
        </button>
      </div>
    </div>
  );
}

/* ======================= Coral secrets ======================= */
export function SecretCoral({
  found,
  onOpen,
  className,
  hint,
}: {
  found: boolean;
  onOpen: () => void;
  className?: string;
  hint?: string;
}) {
  return (
    <button type="button" onClick={onOpen} className={`secret-coral ${className ?? ""}`} aria-label="سر المرجان">
      <span
        className="anim-glow pointer-events-none absolute rounded-full"
        style={{
          inset: "-24%",
          background: "radial-gradient(circle, rgba(253,230,138,.9), rgba(244,114,182,.38) 45%, transparent 70%)",
          opacity: found ? 0.3 : 1,
        }}
      />
      <BranchCoral c1="#ffc94d" c2="#fff6cc" glow className="relative block h-full w-full" />
      {!found && (
        <>
          <span className="anim-twinkle pointer-events-none absolute" style={{ top: "-10%", right: "2%", fontSize: "clamp(18px, 3vmin, 30px)" }}>
            ✨
          </span>
          <span className="secret-bulb">💡</span>
        </>
      )}
      {hint && !found && <span className="secret-hint anim-hint-float">{hint}</span>}
    </button>
  );
}

export function SecretCard({ text, onClose }: { text: string; onClose: () => void }) {
  const arabic = /[\u0600-\u06FF]/.test(text);
  return (
    <div className="anim-fade-in fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(3,20,55,.5)" }} onClick={onClose}>
      <div className="secret-card anim-pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto -mt-[14%] mb-1" style={{ width: "clamp(80px, 14vmin, 130px)" }}>
          <BranchCoral c1="#ffc94d" c2="#fff6cc" glow className="block w-full" />
        </div>
        <div className="font-extrabold" style={{ fontSize: "clamp(26px, 5vmin, 44px)" }}>
          <span className="gold-text">سر المرجان</span> 🪸💡
        </div>
        <div
          dir={arabic ? "rtl" : "ltr"}
          className={`my-3 font-extrabold ${arabic ? "" : "font-en"}`}
          style={{ fontSize: arabic ? "clamp(20px, 3.8vmin, 34px)" : "clamp(28px, 5.6vmin, 52px)", lineHeight: 1.6 }}
        >
          {text}
        </div>
        <button type="button" className="btn-teal" style={{ fontSize: "clamp(18px, 3.2vmin, 26px)" }} onClick={onClose}>
          رائع! ✨
        </button>
      </div>
    </div>
  );
}

/* ======================= Swim transition between zones ======================= */
export function SwimTransition({ to, onMid, onDone }: { to: "bay" | "depths"; onMid: () => void; onDone: () => void }) {
  const schedule = useTimeouts();
  const mid = useRef(onMid);
  const done = useRef(onDone);
  useEffect(() => {
    sfx.whoosh();
    sfx.bubbles(6);
    schedule(() => sfx.whoosh(), 1500);
    schedule(() => mid.current(), 2650);
    schedule(() => done.current(), 3300);
  }, [schedule]);
  const down = to === "depths";
  const title = down ? "✨ الأعماق المضيئة" : "🐚 خليج اللؤلؤ";
  const sub = down ? "أجمل مكان في البحر… هيا نغوص أعمق!" : "هيا نجمع اللآلئ! 💎";

  return (
    <div
      className="fixed inset-0 z-30 overflow-hidden"
      style={{
        animation: "k-overlay 3.3s ease-in-out both",
        background: down
          ? "linear-gradient(180deg, #1b86c2 0%, #283a8e 55%, #2d2272 100%)"
          : "linear-gradient(180deg, #2bb8d8 0%, #1f8fc6 55%, #2a64b2 100%)",
      }}
    >
      <LightRays tint={down ? "233,213,255" : "255,255,255"} />
      {down && <Plankton count={40} seed={8} />}
      {down ? (
        <div className="absolute inset-x-0 top-0" style={{ height: "200%", animation: "k-slide-y 3.3s linear both" }}>
          {[6, 22, 40, 58, 76, 92].map((t, i) => (
            <div
              key={t}
              className="absolute"
              style={{
                top: `${t}%`,
                left: i % 2 ? undefined : "-3%",
                right: i % 2 ? "-3%" : undefined,
                height: "18%",
                aspectRatio: i % 3 === 0 ? "70/260" : "1/1",
                opacity: 0.85,
              }}
            >
              {i % 3 === 0 ? (
                <Seaweed c1={i % 2 ? "#a78bfa" : "#2dd4bf"} c2="#f5d0fe" glow className="block h-full w-full" />
              ) : i % 3 === 1 ? (
                <FanCoral c1={i % 2 ? "#f0abfc" : "#818cf8"} c2="#fdf4ff" glow className="block h-full w-full" />
              ) : (
                <BranchCoral c1={i % 2 ? "#5eead4" : "#f472b6"} c2="#fdf4ff" glow className="block h-full w-full" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="absolute inset-y-0" style={{ left: "-100%", width: "200%", animation: "k-slide-x 3.3s linear both" }}>
          <FarReef className="absolute bottom-0 left-0 h-[34%] w-1/2" color="rgba(40,70,170,.45)" />
          <FarReef className="absolute bottom-0 left-1/2 h-[34%] w-1/2" color="rgba(40,70,170,.45)" />
          {[4, 16, 30, 44, 56, 70, 84, 96].map((l, i) => (
            <div key={l} className="absolute bottom-0" style={{ left: `${l}%`, height: i % 2 ? "26%" : "20%", aspectRatio: i % 2 ? "200/220" : "1/1" }}>
              {i % 2 ? (
                <BranchCoral c1={["#ff6f9f", "#fbbf24", "#c084fc", "#fb7185"][i % 4]} className="block h-full w-full" />
              ) : (
                <FanCoral c1={["#a78bfa", "#f472b6", "#fb923c", "#818cf8"][i % 4]} className="block h-full w-full" />
              )}
            </div>
          ))}
        </div>
      )}
      <Bubbles count={26} seed={31} />
      {[
        { top: "20%", d: 0.2, c1: "#fde047", c2: "#f97316" },
        { top: "70%", d: 0.9, c1: "#a5f3fc", c2: "#6366f1" },
      ].map((f, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{ top: f.top, width: "clamp(50px, 7vw, 110px)", animation: `k-swim-r 2.4s linear ${f.d}s 1 both` }}
        >
          <Fish c1={f.c1} c2={f.c2} className="w-full" />
        </div>
      ))}
      <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2">
        <div className="anim-bob-soft">
          <div style={{ transform: down ? "rotate(180deg)" : "none" }}>
            <Diver pose={down ? "dive" : "swim"} className="w-[min(20vw,28vh,230px)]" bubbles={!down} />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 flex justify-center px-4" style={{ top: "calc(var(--hud-h) + 2vh)" }}>
        <div className="bubble-panel px-8 py-3 text-center" style={{ animation: "k-title-card 3.3s ease-in-out both" }}>
          <div className="font-extrabold" style={{ fontSize: "clamp(30px, 6vmin, 60px)" }}>
            {title}
          </div>
          <div className="font-bold" style={{ fontSize: "clamp(16px, 3vmin, 28px)" }}>
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}
