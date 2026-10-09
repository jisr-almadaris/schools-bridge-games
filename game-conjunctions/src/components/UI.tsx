import { useEffect, useState, type ReactNode } from "react";
import { hotelVoice, isMuted, onMute, setMuted, sfx } from "../audio";
import { ROOMS, WORD_INFO, type Word } from "../data";
import type { Progress } from "../store";

/* ---------- voice + subtitle ---------- */
const subs = new Set<(t: string) => void>();
export function speak(text: string) {
  hotelVoice(text);
  subs.forEach((s) => s(text));
}
export function VoiceSubtitle() {
  const [line, setLine] = useState<string | null>(null);
  useEffect(() => {
    let t: number;
    const fn = (s: string) => { setLine(s); clearTimeout(t); t = window.setTimeout(() => setLine(null), 4200); };
    subs.add(fn);
    return () => { subs.delete(fn); clearTimeout(t); };
  }, []);
  if (!line) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-[80] pointer-events-none anim-fadeUp px-3 w-full max-w-xl">
      <div className="glass rounded-2xl px-5 py-3 text-center flex items-center justify-center gap-3">
        <span className="text-2xl">🎙️</span>
        <span className="en text-lg sm:text-xl text-amber-100 italic glow-text">“{line}”</span>
      </div>
    </div>
  );
}

/* ---------- word chip ---------- */
export function WordBadge({ w, big, className = "" }: { w: Word; big?: boolean; className?: string }) {
  const info = WORD_INFO[w];
  return (
    <span className={`en inline-flex items-center gap-1 rounded-xl font-bold ${big ? "px-4 py-1.5 text-2xl sm:text-3xl" : "px-2.5 py-0.5 text-lg"} ${className}`}
      style={{ background: "rgba(20,10,50,.75)", color: info.color, border: `2px solid ${info.color}`, boxShadow: `0 0 16px ${info.color}66` }}>
      {w} <span>{info.icon}</span>
    </span>
  );
}

/* ---------- HUD ---------- */
export function HUD({ p, onBook, showCode }: { p: Progress; onBook: () => void; showCode: boolean }) {
  const [muted, setM] = useState(isMuted());
  useEffect(() => onMute(setM), []);
  return (
    <div className="absolute top-0 inset-x-0 z-[60] px-2 sm:px-4 pt-2 no-print pointer-events-none">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={() => { setMuted(!muted); if (muted) sfx("sparkle"); }} className="btn-ghost rounded-full w-11 h-11 sm:w-12 sm:h-12 text-xl" aria-label="sound">{muted ? "🔇" : "🔊"}</button>
          <button onClick={onBook} className="btn-gold rounded-full px-3 sm:px-4 h-11 sm:h-12 text-sm sm:text-base whitespace-nowrap">كتاب الأسرار 📖✨</button>
        </div>
        <div className="hidden md:flex pointer-events-auto rounded-full px-5 py-1.5 items-center gap-2" style={{ background: "linear-gradient(90deg,rgba(110,26,61,.85),rgba(59,31,110,.85))", border: "2px solid #f2c95c", boxShadow: "0 0 20px rgba(242,201,92,.35)" }}>
          <span className="font-extrabold text-amber-100 text-lg">مبادرة جسر المدارس</span><span className="text-xl">🌉</span>
        </div>
        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          {showCode && (
            <div className="glass rounded-xl px-2.5 py-1 flex items-center gap-2" dir="ltr">
              <span className="cinzel text-[10px] sm:text-xs text-amber-200">FINAL CODE</span>
              <span className="cinzel text-base sm:text-xl font-extrabold tracking-wider text-amber-100">
                {p.digits.map((d, i) => <span key={i} className={d !== null ? "glow-text anim-pop inline-block" : "opacity-50"}>{d ?? "?"}{i < 3 ? " • " : ""}</span>)}
              </span>
            </div>
          )}
          <div className="flex gap-1" dir="ltr">
            {p.gotCard && <span title="GUEST CARD 2468" className="glass rounded-lg px-1.5 py-0.5 text-[10px] sm:text-xs cinzel text-amber-200">🎫 2468</span>}
            {showCode && ROOMS.map((r, i) => (
              <span key={r.id} title={r.key} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm ${p.keys[i] ? "anim-pop" : "opacity-30 grayscale"}`} style={{ background: "rgba(20,10,50,.8)", border: `2px solid ${p.keys[i] ? WORD_INFO[r.word].color : "#555"}`, boxShadow: p.keys[i] ? `0 0 10px ${WORD_INFO[r.word].color}` : undefined }}>🗝️</span>
            ))}
          </div>
        </div>
      </div>
      <div className="md:hidden flex justify-center -mt-1">
        <div className="rounded-full px-3 py-0.5 text-xs font-bold text-amber-100" style={{ background: "rgba(59,31,110,.85)", border: "1.5px solid #f2c95c" }}>مبادرة جسر المدارس 🌉</div>
      </div>
    </div>
  );
}

/* ---------- keypad ---------- */
export function Keypad({ title, subtitle, hint, code, onSuccess, errorText }: { title: string; subtitle?: ReactNode; hint?: ReactNode; code: string; onSuccess: () => void; errorText: string }) {
  const [entry, setEntry] = useState("");
  const [state, setState] = useState<"idle" | "error" | "ok">("idle");
  const press = (k: string) => {
    if (state === "ok") return;
    if (state === "error") setState("idle");
    if (k === "del") { sfx("beep"); setEntry((e) => e.slice(0, -1)); return; }
    if (k === "ok") {
      if (entry === code) { setState("ok"); sfx("granted"); window.setTimeout(onSuccess, 1300); }
      else { setState("error"); sfx("buzz"); window.setTimeout(() => setEntry(""), 700); }
      return;
    }
    if (entry.length >= 4) return;
    sfx("beep"); setEntry((e) => e + k);
  };
  const col = state === "error" ? "#ff5a8a" : state === "ok" ? "#3ee8a0" : "#3ee8d8";
  return (
    <div className={`glass rounded-3xl p-4 sm:p-5 w-[min(92vw,340px)] anim-pop ${state === "error" ? "anim-shake" : ""}`} style={{ borderColor: col }}>
      <div className="cinzel text-center text-lg sm:text-xl font-extrabold text-amber-200 mb-1" dir="ltr">🔐 {title}</div>
      {subtitle && <div className="text-center text-sm sm:text-base text-violet-100 mb-2">{subtitle}</div>}
      {hint}
      <div className="flex justify-center gap-2 my-3" dir="ltr">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center cinzel text-3xl font-extrabold" style={{ background: "#0b0620", border: `2px solid ${col}`, color: col, boxShadow: `inset 0 0 12px ${col}55, 0 0 10px ${col}55` }}>{entry[i] ?? ""}</div>
        ))}
      </div>
      <div className="h-7 text-center font-bold" style={{ color: col }}>
        {state === "error" && errorText}
        {state === "ok" && <span className="cinzel" dir="ltr">🟢 ACCESS GRANTED</span>}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-1" dir="ltr">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "del", "0", "ok"].map((k) => (
          <button key={k} onClick={() => press(k)} className={`h-12 sm:h-14 rounded-xl text-xl sm:text-2xl font-extrabold cinzel ${k === "ok" ? "btn-gold" : "opt text-amber-50"}`}>{k === "del" ? "⌫" : k === "ok" ? "✓" : k}</button>
        ))}
      </div>
    </div>
  );
}

/* ---------- strategy ---------- */
export function Strategy({ compact }: { compact?: boolean }) {
  const rows: [string, string, Word][] = [["➕", "Addition", "AND"], ["⚡", "Contrast", "BUT"], ["💡", "Reason", "BECAUSE"], ["⏰", "Time", "WHEN"]];
  return (
    <div className={`rounded-2xl ${compact ? "p-2" : "p-3"} text-center`} style={{ background: "rgba(62,232,216,.08)", border: "1.5px dashed rgba(62,232,216,.6)" }}>
      <div className="cinzel text-amber-200 font-bold" dir="ltr">IDEA 1 + IDEA 2</div>
      <div className="font-extrabold text-violet-100 mb-1">ما العلاقة؟ 🤔</div>
      <div className="grid grid-cols-2 gap-1.5" dir="ltr">
        {rows.map(([i, e, w]) => <div key={w} className="en text-sm sm:text-base rounded-lg py-1" style={{ background: "rgba(20,10,50,.6)", color: WORD_INFO[w].color }}>{i} {e} → <b>{w}</b></div>)}
      </div>
    </div>
  );
}

export function SecretTip({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl px-3 py-2 flex items-center gap-2 anim-fadeUp" style={{ background: "linear-gradient(90deg,rgba(110,26,61,.6),rgba(59,31,110,.6))", border: "1.5px solid #f2c95c" }}>
      <span className="text-2xl">🔮</span>
      <div className="text-sm sm:text-base"><b className="text-amber-200">سر من أسرار الفندق: </b>{children}</div>
    </div>
  );
}

export function Feedback({ ok, rule, hint, onContinue }: { ok: boolean; rule?: string; hint?: string; onContinue?: () => void }) {
  if (!ok) return (
    <div className="anim-shake rounded-2xl px-4 py-3 text-center font-bold text-base sm:text-lg" style={{ background: "rgba(255,90,140,.15)", border: "2px solid #ff7aa2", color: "#ffd1e0" }}>
      {hint} <div className="text-sm font-normal mt-1 opacity-90">حاولي مرة أخرى ✨</div>
    </div>
  );
  return (
    <div className="anim-pop rounded-2xl px-4 py-3 text-center" style={{ background: "rgba(62,232,216,.15)", border: "2px solid #3ee8d8" }}>
      <div className="text-lg sm:text-xl font-extrabold text-teal-100">✨ أحسنتِ! اكتشفتِ العلاقة.</div>
      {rule && <div className="en text-base sm:text-lg text-amber-100 mt-1" dir="auto">{rule}</div>}
      {onContinue && <button onClick={() => { sfx("sparkle"); onContinue(); }} className="btn-gold rounded-2xl px-6 py-2.5 mt-3 text-lg">متابعة الاستكشاف 🗝️</button>}
    </div>
  );
}

/* ---------- secrets book ---------- */
const PAGES: { w?: Word; title: string; ar: string; ex?: string }[] = [
  { w: "AND", title: "AND ➕", ar: "إضافة / أفكار متشابهة", ex: "I swim and play tennis." },
  { w: "BUT", title: "BUT ⚡", ar: "اختلاف / تعارض", ex: "I can run, but I can't swim." },
  { w: "BECAUSE", title: "BECAUSE 💡", ar: "سبب — يجيب عن: لماذا؟", ex: "I stayed home because I was tired." },
  { w: "WHEN", title: "WHEN ⏰", ar: "وقت — يجيب عن: متى؟", ex: "I sleep when I am tired." },
  { title: "كيف أختار؟ 🤔", ar: "" },
];
export function SecretsBook({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);
  useEffect(() => { sfx("book"); }, []);
  const go = (d: number) => { sfx("book"); setPage((p) => Math.max(0, Math.min(PAGES.length - 1, p + d))); };
  const pg = PAGES[page];
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 anim-fadeIn" style={{ background: "rgba(5,2,20,.8)", backdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-2xl anim-pop">
        <div className="absolute -inset-2 rounded-[28px]" style={{ background: "linear-gradient(135deg,#6e1a3d,#3d0f24)", border: "3px solid #c8952e", boxShadow: "0 0 60px rgba(242,201,92,.3)" }} />
        <div className="relative parchment rounded-3xl p-5 sm:p-8 min-h-[400px] flex flex-col" style={{ backgroundImage: "radial-gradient(ellipse at 30% 20%, #fffaf0 0%, #f7ecd4 60%, #ead6ac 100%)" }}>
          <div className="absolute top-3 left-4 text-2xl opacity-60">✦</div>
          <div className="absolute bottom-3 right-4 text-2xl opacity-60">☽</div>
          <div className="text-center ruqaa text-2xl sm:text-3xl text-[#6e1a3d] mb-1">📖✨ كتاب الأسرار</div>
          <div className="text-center text-xs text-[#7a5217] mb-4">صفحة {page + 1} من {PAGES.length}</div>
          <div key={page} className="flex-1 flex flex-col items-center justify-center text-center gap-3 anim-fadeUp">
            {pg.w ? (<>
              <div className="text-6xl sm:text-7xl">{WORD_INFO[pg.w].icon}</div>
              <div className="en text-4xl sm:text-5xl font-bold" style={{ color: "#3b1f6e" }}>{pg.title}</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#6e1a3d]">{pg.ar}</div>
              <div className="en text-xl sm:text-2xl bg-white/70 rounded-2xl px-4 py-2 border-2 border-[#c8952e]">{pg.ex}</div>
            </>) : (
              <div className="w-full max-w-md space-y-2">
                <div className="text-3xl font-extrabold text-[#6e1a3d] mb-2">{pg.title}</div>
                {([["➕ إضافة؟", "AND"], ["⚡ اختلاف؟", "BUT"], ["💡 لماذا؟", "BECAUSE"], ["⏰ متى؟", "WHEN"]] as [string, Word][]).map(([a, w]) => (
                  <div key={w} className="flex items-center justify-between bg-white/70 rounded-xl px-4 py-2 border-2 border-[#c8952e] text-xl font-bold">
                    <span>{a}</span><span className="text-[#c8952e]">←</span><span className="en text-[#3b1f6e]">{w}</span>
                  </div>
                ))}
                <div className="text-base text-[#3b1f6e] mt-3 font-bold">🔮 قبل اختيار الكلمة، اسألي نفسك: «ما العلاقة بين الفكرتين؟»</div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-5 gap-2">
            <button disabled={page === 0} onClick={() => go(-1)} className="rounded-xl px-4 py-2 font-bold bg-[#3b1f6e] text-amber-100 disabled:opacity-30">→ السابق</button>
            <div className="flex gap-1.5">{PAGES.map((_, i) => <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i === page ? "#6e1a3d" : "#c8952e66" }} />)}</div>
            <button disabled={page === PAGES.length - 1} onClick={() => go(1)} className="rounded-xl px-4 py-2 font-bold bg-[#3b1f6e] text-amber-100 disabled:opacity-30">التالي ←</button>
          </div>
          <button onClick={() => { sfx("book"); onClose(); }} className="btn-gold rounded-2xl px-5 py-3 mt-4 text-lg self-center">أغلق الكتاب وأعود للفندق 🗝️</button>
        </div>
      </div>
    </div>
  );
}

export function SceneFade({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0 anim-fadeIn">{children}</div>;
}
