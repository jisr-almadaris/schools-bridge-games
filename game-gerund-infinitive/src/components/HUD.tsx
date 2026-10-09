import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { initAudio, isMuted, onMuteChange, setMuted, sfx } from "../audio";
import { En, Modal } from "./ui";
import { GAMES, SECRETS } from "../data";

/** Digits of the Final Night code the student has uncovered so far ("?" if not yet). */
export function codeDigits(secrets: number[], gamesDone: number): string[] {
  return [1, 2, 3].map((n) => {
    const gi = GAMES.findIndex((g) => g.secret === n);
    // at the final gate every finished ride counts, so nobody gets stuck
    return secrets.includes(n) || (gamesDone >= GAMES.length && gi >= 0) ? SECRETS[n].code : "?";
  });
}

export function HUD({ tickets, showGuide, onGuide, code }: { tickets: number; showGuide: boolean; onGuide: () => void; code?: string[] | null }) {
  const [muted, setM] = useState(isMuted());
  useEffect(() => onMuteChange(setM), []);
  return (
    <div className="fixed top-0 inset-x-0 z-40 px-2 sm:px-4 pt-2 no-print">
      <div className="glass rounded-2xl flex items-center justify-between gap-2 px-2 sm:px-4 py-1.5 sm:py-2">
        <div className="shrink-0 rounded-full bg-gradient-to-l from-gold/25 to-pinky/25 border border-gold/60 px-2 sm:px-3 py-1 text-[11px] sm:text-base font-extrabold text-gold whitespace-nowrap">
          مبادرة جسر المدارس 🌉
        </div>
        <div className="flex items-center gap-1 sm:gap-2" dir="ltr" aria-label="golden tickets">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              title={`GOLDEN TICKET ${n}`}
              className={cn(
                "en relative flex items-center gap-1 rounded-lg px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-bold border transition-all",
                n <= tickets ? "bg-gradient-to-br from-[#fff2a8] to-gold text-[#5a2a00] border-white shadow-[0_0_14px_rgba(255,207,74,0.7)] pop-in" : "bg-white/5 text-white/35 border-white/15"
              )}
            >
              🎟️<span className="hidden sm:inline">{n}</span>
            </div>
          ))}
          {code && (
            <div
              title="Final Code"
              className="en ms-1 sm:ms-2 flex items-center gap-1 rounded-lg px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-bold border border-turq/60 bg-turq/10 text-turq shadow-[0_0_12px_rgba(62,230,214,0.35)]"
            >
              🔐<span className="hidden md:inline">Final Code:</span>
              <span className="tracking-wider sm:hidden">{code.join("")}</span>
              <span className="tracking-wider hidden sm:inline">{code.join(" • ")}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {showGuide && (
            <button
              onClick={() => {
                sfx.click();
                onGuide();
              }}
              className="btn-ghost text-xs sm:text-base !px-2.5 sm:!px-4"
            >
              <span className="hidden sm:inline">دليل الألعاب </span>📖🎡
            </button>
          )}
          <button
            onClick={() => {
              initAudio();
              setMuted(!muted);
            }}
            className="btn-ghost !px-2.5 text-base sm:text-lg"
            aria-label="sound"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function GuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="p-5 sm:p-7">
        <h2 className="display text-3xl sm:text-4xl text-center text-gold neon-gold">دليل مدينة الألعاب 📖🎡</h2>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="rounded-3xl p-5 bg-gradient-to-b from-pink-500/25 to-fuchsia-800/25 border border-pink-400/60 text-center">
            <p className="text-3xl">1️⃣ 🎢</p>
            <p className="en text-3xl font-bold mt-1">GERUND</p>
            <p className="en text-2xl text-turq font-semibold">verb + ing</p>
            <div className="mt-3 space-y-1 en text-xl">
              <p>
                <span className="text-pink-300">enjoy</span> <span className="text-turq">playing</span>
              </p>
              <p>
                <span className="text-pink-300">enjoy</span> <span className="text-turq">reading</span>
              </p>
            </div>
          </div>
          <div className="rounded-3xl p-5 bg-gradient-to-b from-teal-400/25 to-cyan-800/25 border border-turq/60 text-center">
            <p className="text-3xl">2️⃣ 🎡</p>
            <p className="en text-3xl font-bold mt-1">INFINITIVE</p>
            <p className="en text-2xl text-gold font-semibold">to + verb</p>
            <div className="mt-3 space-y-1 en text-xl">
              <p>
                <span className="text-pink-300">want</span> <span className="text-gold">to play</span>
              </p>
              <p>
                <span className="text-pink-300">need</span> <span className="text-gold">to study</span>
              </p>
              <p>
                <span className="text-pink-300">hope</span> <span className="text-gold">to win</span>
              </p>
            </div>
          </div>
          <div className="rounded-3xl p-5 bg-gradient-to-b from-amber-400/25 to-orange-700/25 border border-gold/60 text-center">
            <p className="text-3xl">3️⃣ 💡</p>
            <p className="display text-3xl mt-1">تذكّري</p>
            <div className="mt-3 space-y-3">
              <p dir="ltr" className="en text-xl font-bold">
                enjoy → <span className="text-turq">-ing</span>
              </p>
              <p dir="ltr" className="en text-lg font-bold leading-snug">
                want / need / hope / plan
                <br />→ <span className="text-gold">to + verb</span>
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <button className="btn-main text-lg" onClick={onClose}>
            أعود إلى اللعبة 🎢
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function KioskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} wide>
      <div className="p-5 sm:p-7">
        <p className="text-center text-lav font-bold">💗 كشك التلميح الذكي</p>
        <h2 className="display text-4xl text-center text-gold neon-gold mt-1">كيف أتذكر؟ 🤔</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-3xl p-5 bg-gradient-to-b from-pink-500/25 to-rose-900/25 border border-pink-400/60">
            <p className="text-2xl font-extrabold text-center">💗 الاستمتاع والإعجاب</p>
            <p dir="ltr" className="en text-2xl text-center text-pink-200 mt-2 font-bold">
              enjoy · like · love
            </p>
            <p className="text-center mt-2">
              غالبًا نراها مع: <En className="text-turq font-bold text-xl">verb + ing</En>
            </p>
            <div dir="ltr" className="en text-xl text-center mt-3 space-y-1">
              <p>I enjoy drawing. 🎨</p>
              <p>I like reading. 📖</p>
              <p>I love swimming. 🏊‍♀️</p>
            </div>
            <p className="text-sm text-pink-100/80 mt-4 leading-relaxed bg-black/20 rounded-xl p-3">
              «تذكري: هذه مساعدة للحفظ وليست قاعدة مطلقة؛ بعض الأفعال مثل <En>like</En> و<En>love</En> يمكن أن يأتي بعدها أكثر من شكل.»
            </p>
          </div>
          <div className="rounded-3xl p-5 bg-gradient-to-b from-teal-400/25 to-indigo-900/25 border border-turq/60">
            <p className="text-2xl font-extrabold text-center">⭐ الرغبة والحاجة والخطة</p>
            <p dir="ltr" className="en text-2xl text-center text-cyan-200 mt-2 font-bold">
              want · need · hope · plan
            </p>
            <p className="text-center mt-2">
              غالبًا نراها مع: <En className="text-gold font-bold text-xl">to + verb</En>
            </p>
            <div dir="ltr" className="en text-xl text-center mt-3 space-y-1">
              <p>I want to play. 🎮</p>
              <p>I need to study. 📚</p>
              <p>I hope to win. 🏆</p>
              <p>I plan to visit. 🗺️</p>
            </div>
            <p className="text-sm text-cyan-100/80 mt-4 leading-relaxed bg-black/20 rounded-xl p-3">«الرغبة أو الخطة أو الحاجة كثيرًا ما تساعدنا على تذكّر to + verb.»</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <button className="btn-main text-lg" onClick={onClose}>
            أعود إلى اللعبة 🎢
          </button>
        </div>
      </div>
    </Modal>
  );
}
