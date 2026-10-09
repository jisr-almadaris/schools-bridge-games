import { useEffect, useState } from 'react';
import { Girl } from './ui';

/* ---------- Animated Departures board ---------- */
const ROWS = [
  ['PS 101', 'PRESENT SIMPLE', 'GATE 7', 'BOARDING'],
  ['BA 214', 'LONDON', 'GATE 3', 'ON TIME'],
  ['TK 771', 'ISTANBUL', 'GATE 5', 'ON TIME'],
  ['EK 902', 'DUBAI', 'GATE 1', 'GO TO GATE'],
];
export function DeparturesBoard({ className = '', title = 'DEPARTURES ✈️' }: { className?: string; title?: string }) {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2500); return () => clearInterval(t); }, []);
  const time = new Date();
  return (
    <div dir="ltr" className={`bg-[#0b1a3a] rounded-xl border-4 border-amber-500/70 shadow-2xl p-2 md:p-3 text-[10px] md:text-xs font-mono ${className}`}>
      <div className="flex justify-between text-amber-300 font-black tracking-widest text-xs md:text-sm border-b border-amber-500/40 pb-1 mb-1">
        <span>{title}</span><span>{String(time.getHours()).padStart(2, '0')}:{String(time.getMinutes()).padStart(2, '0')}</span>
      </div>
      {ROWS.map((r, i) => {
        const status = i === 0 && tick % 2 ? 'NOW BOARDING' : r[3];
        return (
          <div key={i} className="grid grid-cols-[1fr_2fr_1fr_1.4fr] gap-1 py-0.5 text-sky-100">
            <span className="text-amber-200">{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span>
            <span className={`${status.includes('BOARD') ? 'text-emerald-300' : 'text-sky-300'} transition`}>{status}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Hanging airport signs ---------- */
export function Sign({ children, arrow = '→', className = '' }: { children: React.ReactNode; arrow?: string; className?: string }) {
  return (
    <div dir="ltr" className={`inline-flex items-center gap-2 bg-[#0b1a3a] text-amber-300 font-black rounded-md px-3 py-1 border-2 border-amber-400/60 shadow-lg text-xs md:text-sm tracking-wider ${className}`}>
      <span>{children}</span><span className="text-white">{arrow}</span>
    </div>
  );
}

/* ---------- Living background: walking travelers + slow plane ---------- */
export function LiveAirport({ plane = true, walkers = true }: { plane?: boolean; walkers?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {plane && <div className="absolute text-3xl md:text-5xl opacity-90 anim-taxi" style={{ top: '22%' }}>✈️</div>}
      {walkers && (
        <>
          <div className="absolute bottom-[26%] text-3xl md:text-4xl opacity-70 anim-walker" style={{ animationDuration: '26s' }}>🧍‍♂️🧳</div>
          <div className="absolute bottom-[24%] text-2xl md:text-3xl opacity-60 anim-walker-rev" style={{ animationDuration: '34s', animationDelay: '-12s' }}>🧳🧍‍♀️</div>
        </>
      )}
    </div>
  );
}

/* ---------- Airport information screen frame (lessons are shown inside it) ---------- */
export function AirportScreen({ header = 'INFORMATION ✈️', children, className = '' }: { header?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      {/* mounting bar */}
      <div className="mx-auto w-24 h-3 bg-slate-500 rounded-b" />
      <div className="bg-[#0b1a3a] rounded-2xl p-2 md:p-3 border-4 border-slate-600 shadow-2xl">
        <div dir="ltr" className="flex items-center justify-between px-2 pb-2 text-amber-300 font-black tracking-widest text-xs md:text-sm">
          <span>{header}</span>
          <span className="flex gap-1"><i className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><i className="w-2 h-2 rounded-full bg-amber-400" /></span>
        </div>
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl p-3 md:p-5">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Pronouns shown with travel-scene characters ---------- */
const PRONOUNS = [
  { en: 'I', ar: 'أنا', tip: 'المسافرة نفسها', group: 1, visual: 'girl' },
  { en: 'You', ar: 'أنتِ / أنت', tip: 'تتحدث إلى الموظف أمامها', group: 1, visual: 'girl+🧑‍✈️' },
  { en: 'We', ar: 'نحن', tip: 'المسافرة مع صديقتها', group: 1, visual: 'girl+👧🏻' },
  { en: 'They', ar: 'هم / هنّ', tip: 'مجموعة مسافرين', group: 1, visual: '🧑‍🦱🧕🏻👨🏽‍🦳👩🏻' },
  { en: 'He', ar: 'هو', tip: 'مسافر واحد', group: 2, visual: '🧑🏻‍💼🧳' },
  { en: 'She', ar: 'هي', tip: 'مسافرة واحدة', group: 2, visual: '🧕🏻🧳' },
  { en: 'It', ar: 'شيء واحد', tip: 'الطائرة أو الحقيبة', group: 2, visual: '✈️' },
];
export function PronounGallery() {
  const render = (v: string) => {
    if (v === 'girl') return <Girl className="h-20" shadow={false} />;
    if (v.startsWith('girl+')) return <div className="flex items-end gap-1"><Girl className="h-20" shadow={false} /><span className="text-5xl">{v.slice(5)}</span></div>;
    return <span className="text-4xl md:text-5xl tracking-tighter">{v}</span>;
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {PRONOUNS.map((p, i) => (
        <div key={p.en} className={`anim-pop rounded-2xl p-2 md:p-3 border-2 flex flex-col items-center text-center ${p.group === 1 ? 'bg-teal-50 border-teal-300' : 'bg-rose-50 border-rose-300'} ${p.en === 'It' ? 'md:col-start-4' : ''}`} style={{ animationDelay: `${i * 0.12}s` }}>
          <div className="h-20 flex items-end justify-center">{render(p.visual)}</div>
          <div dir="ltr" className={`text-2xl md:text-3xl font-black mt-1 ${p.group === 1 ? 'text-teal-700' : 'text-rose-600'}`}>{p.en}</div>
          <div className="font-black text-indigo-900">{p.ar}</div>
          <div className="text-[11px] text-indigo-500 font-bold">{p.tip}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Realistic rubber stamp tool (SVG) ---------- */
export function StampTool({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden>
      <defs>
        <linearGradient id="wood" x1="0" x2="1"><stop offset="0" stopColor="#7c3a12" /><stop offset=".5" stopColor="#b5651d" /><stop offset="1" stopColor="#6b2f0e" /></linearGradient>
        <linearGradient id="rub" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#334155" /><stop offset="1" stopColor="#0f172a" /></linearGradient>
      </defs>
      <ellipse cx="60" cy="22" rx="26" ry="16" fill="url(#wood)" />
      <rect x="44" y="22" width="32" height="50" rx="8" fill="url(#wood)" />
      <rect x="20" y="70" width="80" height="26" rx="8" fill="url(#wood)" />
      <rect x="14" y="94" width="92" height="22" rx="6" fill="url(#rub)" />
      <rect x="14" y="112" width="92" height="10" rx="3" fill="#7f1d1d" />
      <rect x="18" y="122" width="84" height="6" rx="2" fill="#dc2626" opacity=".9" />
    </svg>
  );
}

/* ---------- Ink stamp impression ---------- */
export function InkStamp({ text, sub, color, rot = -12, size = 1, animate = false }: { text: string; sub?: string; color: string; rot?: number; size?: number; animate?: boolean }) {
  return (
    <div className={`ink-stamp ${animate ? 'anim-stamp-in' : ''}`} style={{ color, transform: `rotate(${rot}deg) scale(${size})` }} dir="ltr">
      <div className="ink-ring">
        <div className="ink-inner">
          <div className="ink-top">✈ ARRIVED ✈</div>
          <div className="ink-main">{text}</div>
          {sub && <div className="ink-sub">{sub}</div>}
          <div className="ink-date">{new Date().toLocaleDateString('en-GB')}</div>
        </div>
      </div>
    </div>
  );
}
