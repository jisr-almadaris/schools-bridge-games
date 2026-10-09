import React, { useEffect, useState } from 'react';
import { audio } from '../audio';
import { InkStamp, StampTool } from './airport';

export const INITIATIVE = 'مبادرة جسر المدارس 🌉';
export const SLOGAN = 'جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.';

/* ---------- Character (white background removed at runtime, same image everywhere) ---------- */
let cachedGirl: string | null = null;
export function useGirl() {
  const [src, setSrc] = useState<string>(cachedGirl ?? '/schools-bridge-games/game-present-simple/img/girl.png');
  useEffect(() => {
    if (cachedGirl) return;
    const img = new Image();
    img.src = '/schools-bridge-games/game-present-simple/img/girl.png';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height);
        const p = d.data;
        for (let i = 0; i < p.length; i += 4) {
          const r = p[i], g = p[i + 1], b = p[i + 2];
          const min = Math.min(r, g, b);
          if (min > 238) p[i + 3] = 0;
          else if (min > 215) p[i + 3] = Math.round(((238 - min) / 23) * 255);
        }
        ctx.putImageData(d, 0, 0);
        cachedGirl = c.toDataURL('image/png');
        setSrc(cachedGirl);
      } catch { /* keep original */ }
    };
  }, []);
  return src;
}

export function Girl({ className = '', style, flip = false, bob = false, shadow = true }: { className?: string; style?: React.CSSProperties; flip?: boolean; bob?: boolean; shadow?: boolean }) {
  const src = useGirl();
  return (
    <span className="relative inline-block">
      {shadow && <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[70%] h-[6%] rounded-[50%] bg-black/30 blur-sm" />}
      <img
        src={src}
        alt="المسافرة"
        draggable={false}
        className={`relative select-none pointer-events-none block ${bob ? 'anim-bob' : ''} ${className}`}
        style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
      />
    </span>
  );
}

/* ---------- Pronouns card ---------- */
export function PronounsCard() {
  const g1 = [['I', 'أنا'], ['You', 'أنتِ / أنتم'], ['We', 'نحن'], ['They', 'هم / هنّ']];
  const g2 = [['He', 'هو (ولد/رجل)'], ['She', 'هي (بنت/امرأة)'], ['It', 'هو/هي (شيء أو حيوان)']];
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-3">
        <div className="text-teal-700 font-black text-center mb-2">الفعل كما هو ✅</div>
        {g1.map(([en, ar]) => (
          <div key={en} className="flex items-center justify-between bg-white rounded-lg px-2 py-1 mb-1 text-sm md:text-base font-bold">
            <span className="text-indigo-900" dir="ltr">{en}</span><span className="text-indigo-500">{ar}</span>
          </div>
        ))}
      </div>
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3">
        <div className="text-rose-600 font-black text-center mb-2">نضيف <span dir="ltr" className="text-xl">s</span> ⭐</div>
        {g2.map(([en, ar]) => (
          <div key={en} className="flex items-center justify-between bg-white rounded-lg px-2 py-1 mb-1 text-sm md:text-base font-bold">
            <span className="text-indigo-900" dir="ltr">{en}</span><span className="text-indigo-500">{ar}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <div className="fixed top-2 inset-x-2 z-40 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto bg-white/90 backdrop-blur rounded-full px-4 py-1.5 shadow-lg border-2 border-amber-300 font-black text-indigo-900 text-sm md:text-base">
        {INITIATIVE}
      </div>
      <button
        onClick={onToggle}
        className="pointer-events-auto bg-white/90 backdrop-blur rounded-full w-11 h-11 shadow-lg border-2 border-indigo-200 text-xl flex items-center justify-center hover:scale-105 transition"
        aria-label="الصوت"
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}

/* ---------- Buttons ---------- */
export function BigButton({ children, onClick, color = 'indigo', className = '', disabled }: { children: React.ReactNode; onClick: () => void; color?: 'indigo' | 'gold' | 'teal' | 'white'; className?: string; disabled?: boolean }) {
  const c = {
    indigo: 'bg-gradient-to-l from-indigo-600 to-violet-600 text-white border-indigo-800',
    gold: 'bg-gradient-to-l from-amber-400 to-yellow-300 text-indigo-950 border-amber-600',
    teal: 'bg-gradient-to-l from-teal-500 to-cyan-500 text-white border-teal-700',
    white: 'bg-white text-indigo-800 border-indigo-200',
  }[color];
  return (
    <button
      disabled={disabled}
      onClick={() => { audio.click(); onClick(); }}
      className={`${c} ${className} px-7 py-3.5 rounded-2xl text-lg md:text-xl font-black shadow-[0_5px_0_0] shadow-black/20 border-b-4 active:translate-y-1 active:shadow-none transition disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

/* ---------- Speech bubble (announcer / message) ---------- */
export function Bubble({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`anim-pop bg-white/95 backdrop-blur rounded-3xl px-5 py-3 shadow-xl border-2 border-indigo-100 text-indigo-900 font-bold text-lg md:text-2xl text-center ${className}`}>
      {children}
    </div>
  );
}

export function Announcer({ text, ar }: { text: string; ar?: string }) {
  return (
    <div className="anim-pop bg-indigo-950/85 text-white rounded-2xl px-5 py-3 shadow-2xl border border-indigo-400/40 text-center">
      <div className="text-xs text-amber-300 font-bold mb-1">🎙️ Announcement</div>
      <div dir="ltr" className="text-lg md:text-2xl font-black tracking-wide">“{text}”</div>
      {ar && <div className="text-base md:text-lg font-bold mt-1 text-indigo-100">{ar}</div>}
    </div>
  );
}

/* ---------- Passport ---------- */
export interface StampInfo { text: string; sub?: string; color: string; rot: number }
export function Passport({ name, stamps, className = '', open = true, stamping }: { name: string; stamps: StampInfo[]; className?: string; open?: boolean; stamping?: StampInfo | null }) {
  if (!open) {
    return (
      <div className={`w-40 h-56 rounded-xl bg-gradient-to-br from-indigo-800 to-violet-900 shadow-2xl border-2 border-amber-300 flex flex-col items-center justify-center text-amber-200 ${className}`}>
        <div className="text-3xl">✈️</div>
        <div className="font-black text-sm mt-2">PASSPORT</div>
        <div className="text-xs mt-1 font-bold">جواز Present Simple</div>
      </div>
    );
  }
  const all = stamping ? [...stamps, stamping] : stamps;
  return (
    <div className={`relative w-[320px] max-w-full h-[230px] rounded-2xl bg-[#fdf8e7] shadow-2xl border-4 border-indigo-900 flex overflow-hidden ${className}`} dir="ltr">
      <div className="w-1/2 border-r-2 border-dashed border-indigo-300 p-3 flex flex-col items-center">
        <div className="text-[10px] tracking-widest text-indigo-700 font-black">PASSPORT</div>
        <div className="text-[10px] text-indigo-500 font-bold mb-1">جواز Present Simple ✈️</div>
        <div className="w-16 h-16 rounded-lg bg-indigo-100 border border-indigo-300 overflow-hidden flex items-end justify-center">
          <Girl className="w-14 mt-1" bob={false} style={{ objectFit: 'cover', objectPosition: 'top', height: '150%' }} />
        </div>
        <div className="mt-2 text-[10px] text-indigo-500 font-bold">Traveler / المسافرة</div>
        <div className="text-indigo-900 font-black text-base truncate max-w-full" dir="rtl">{name}</div>
        <div className="mt-auto text-[9px] text-indigo-400 font-mono">P&lt;PRESENT&lt;SIMPLE&lt;&lt;{'<'.repeat(10)}</div>
      </div>
      <div className="w-1/2 relative p-2 passport-page">
        <div className="text-[10px] text-indigo-400 font-black text-center">VISAS / الأختام</div>
        {all.map((s, i) => (
          <div key={i} className="absolute" style={{ top: 18 + i * 92, left: 6 + (i % 2) * 14 }}>
            <InkStamp text={s.text} sub={s.sub} color={s.color} rot={s.rot} size={0.62} animate={!!stamping && i === all.length - 1} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Stamp scene overlay (stamp rises then slams) ---------- */
export function StampScene({ name, stamps, newStamp, onDone, title }: { name: string; stamps: StampInfo[]; newStamp: StampInfo; onDone: () => void; title: string }) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0); // 0: open passport, 1: slamming, 2: done
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => { audio.stamp(); setPhase(2); }, 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 gap-5 overflow-hidden">
      <div className="text-amber-300 font-black tracking-widest text-sm md:text-base" dir="ltr">🛂 PASSPORT CONTROL</div>
      <div className={`relative ${phase === 2 ? 'anim-shake' : ''}`} style={{ transform: 'scale(1.15)', transformOrigin: 'center' }}>
        <div className="anim-open-passport">
          <Passport name={name} stamps={stamps} stamping={phase === 2 ? newStamp : null} />
        </div>
        {/* Real stamp tool: rises, then slams onto the page */}
        <div
          className={`absolute right-2 w-24 md:w-28 transition-all ease-in ${phase === 0 ? 'duration-700 -top-44 opacity-0' : phase === 1 ? 'duration-700 -top-40 opacity-100' : 'duration-150 top-[-10px] opacity-100 anim-stamp-fade'}`}
        >
          <StampTool className="w-full drop-shadow-2xl" />
        </div>
        {phase === 2 && <div className="absolute inset-0 pointer-events-none anim-ink-splash" />}
      </div>
      {phase === 2 && (
        <div className="anim-pop text-center">
          <div className="text-white text-3xl md:text-4xl font-black drop-shadow" dir="ltr">STAMP! 🔖</div>
          <div className="text-amber-300 text-2xl md:text-3xl font-black mt-2">{title}</div>
          <div className="mt-5"><BigButton color="gold" onClick={onDone}>التالي ✈️</BigButton></div>
        </div>
      )}
    </div>
  );
}

/* ---------- Traveler's Guide modal ---------- */
export function Guide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="anim-pop bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-amber-300 text-center">
        <h3 className="text-2xl font-black text-indigo-900 mb-3">دليل المسافرة 📘</h3>
        <p className="text-indigo-800 font-bold mb-4"><span className="text-violet-600" dir="ltr">Present Simple</span>: نتحدث به عن العادات والأشياء التي تتكرر.</p>
        <RuleCard />
        <div className="mt-3"><PronounsCard /></div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-lg font-black" dir="ltr">
          <div className="bg-white rounded-xl p-2 text-indigo-700">I <span className="text-teal-600">read</span>.</div>
          <div className="bg-white rounded-xl p-2 text-indigo-700">She read<span className="text-rose-500">s</span>.</div>
          <div className="bg-white rounded-xl p-2 text-indigo-700">They <span className="text-teal-600">travel</span>.</div>
          <div className="bg-white rounded-xl p-2 text-indigo-700">He travel<span className="text-rose-500">s</span>.</div>
        </div>
        <p className="mt-4 text-amber-700 font-black">تذكري ⭐ مع He / She / It نضيف غالبًا <span className="text-rose-500 text-2xl" dir="ltr">s</span>.</p>
        <div className="mt-5"><BigButton onClick={onClose}>فهمت، أعود إلى الرحلة ✈️</BigButton></div>
      </div>
    </div>
  );
}

export function RuleCard({ compact = false }: { compact?: boolean }) {
  return (
    <div dir="ltr" className={`grid grid-cols-2 gap-3 ${compact ? 'text-base' : 'text-lg md:text-xl'} font-black`}>
      <div className="bg-teal-50 border-2 border-teal-300 rounded-2xl p-3">
        <div className="text-teal-700">I / You / We / They</div>
        <div className="text-2xl md:text-3xl text-indigo-900 mt-1">→ play</div>
      </div>
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3">
        <div className="text-rose-600">He / She / It</div>
        <div className="text-2xl md:text-3xl text-indigo-900 mt-1">→ play<span className="text-rose-500 underline">s</span></div>
      </div>
    </div>
  );
}

/* ---------- Scene wrapper ---------- */
export function Scene({ bg, children, overlay = 'from-indigo-950/40 via-transparent to-transparent' }: { bg: string; children: React.ReactNode; overlay?: string }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-indigo-100" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className={`absolute inset-0 bg-gradient-to-t ${overlay} pointer-events-none`} />
      <div className="relative min-h-screen flex flex-col pt-16 pb-6 px-3 md:px-6">{children}</div>
    </div>
  );
}
