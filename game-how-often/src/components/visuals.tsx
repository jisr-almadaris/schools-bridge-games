import React from 'react';

/* ---------- Reusable Gear SVG ---------- */
export function Gear({ size = 80, className = '', color = '#2e7bff', slow = false, reverse = false, fast = false }: { size?: number; className?: string; color?: string; slow?: boolean; reverse?: boolean; fast?: boolean }) {
  const anim = fast ? 'animate-spin-turbine' : reverse ? 'animate-spin-rev' : slow ? 'animate-spin-slower' : 'animate-spin-slow2';
  return (
    <div className={`${anim} ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <g fill={color} stroke="#0a1430" strokeWidth="2">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x="42" y="2" width="16" height="20" rx="3" transform={`rotate(${i * 45} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="32" />
          <circle cx="50" cy="50" r="14" fill="#0a1430" stroke={color} strokeWidth="3" />
          <circle cx="50" cy="50" r="5" fill={color} />
        </g>
      </svg>
    </div>
  );
}

export function InitiativeBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-[#f5c542]/50 bg-gradient-to-l from-[#f5c542]/15 to-[#ff7a1a]/10 px-4 py-1.5 backdrop-blur ${compact ? 'text-xs' : 'text-sm'}`}>
      <span className="text-lg">🌉</span>
      <span className="font-extrabold text-[#f5c542]">مبادرة جسر المدارس</span>
    </div>
  );
}

export function TopBar({ name, power, chips, muted, onMute, onManual }: { name: string; power: number; chips: (number | null)[]; muted: boolean; onMute: () => void; onManual: () => void }) {
  return (
    <div className="sticky top-0 z-40 border-b border-cyan-400/20 bg-[#060d24]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-2">
        <InitiativeBadge compact />
        <div className="hidden items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-cyan-100 sm:flex">
          <span>👧</span><span className="font-bold">{name || 'بطلة الآلة'}</span>
        </div>
        <div className="flex flex-1 items-center gap-2" dir="ltr">
          <span className="text-[11px] font-bold text-cyan-200">POWER {power}%</span>
          <div className="h-2.5 min-w-[80px] flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-amber-300 transition-all duration-1000" style={{ width: `${power}%` }} />
          </div>
          <span>⚡</span>
        </div>
        <div className="flex items-center gap-1" dir="ltr">
          <span className="text-[10px] font-bold text-amber-200">MASTER CODE:</span>
          {chips.map((c, i) => (
            <span key={i} className={`flex h-7 w-7 items-center justify-center rounded-lg border text-sm font-black ${c !== null ? 'border-amber-300 bg-amber-300/20 text-amber-200 animate-glow' : 'border-white/20 bg-white/5 text-white/30'}`}>
              {c !== null ? c : '•'}
            </span>
          ))}
        </div>
        <button onClick={onManual} className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-100 hover:bg-cyan-400/20">📘 MANUAL</button>
        <button onClick={onMute} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm">{muted ? '🔇' : '🔊'}</button>
      </div>
    </div>
  );
}

/* ---------- FREQ robot ---------- */
export function FreqBot({ message, mood = 'happy', small = false }: { message?: React.ReactNode; mood?: 'happy' | 'think' | 'wow' | 'sad' | 'cheer'; small?: boolean }) {
  const face = mood === 'wow' ? '😲' : mood === 'think' ? '🤔' : mood === 'sad' ? '🥺' : mood === 'cheer' ? '🤩' : '😊';
  return (
    <div className={`flex items-start gap-2 ${small ? '' : ''}`}>
      <div className={`relative shrink-0 ${small ? 'h-14 w-14' : 'h-20 w-20'} animate-floaty`}>
        <div className={`absolute inset-0 rounded-2xl border-2 border-cyan-300 bg-gradient-to-b from-[#1b2a5e] to-[#0d1738] shadow-[0_0_25px_rgba(34,230,214,.5)]`}>
          <div className="absolute -top-2 left-1/2 h-4 w-1 -translate-x-1/2 bg-cyan-300" />
          <div className="absolute -top-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-amber-300 animate-blink" />
          <div className="absolute inset-x-1 top-2 flex justify-center gap-1">
            <div className="flex h-6 w-11 items-center justify-center gap-1 rounded-lg bg-[#050b1e]">
              <span className="h-2 w-2 rounded-full bg-cyan-300 animate-blink" />
              <span className="text-sm">{face}</span>
              <span className="h-2 w-2 rounded-full bg-cyan-300 animate-blink" />
            </div>
          </div>
          <div className="absolute bottom-1 inset-x-0 text-center text-[10px] font-black tracking-widest text-cyan-300" dir="ltr">FREQ 🤖</div>
        </div>
        <div className="absolute -bottom-1 left-1/2 h-2 w-10 -translate-x-1/2 rounded-full bg-cyan-400/40 blur-[4px]" />
      </div>
      {message && (
        <div className="max-w-[320px] flex-1 rounded-2xl rounded-tr-sm border border-cyan-300/40 bg-[#0d1a3d]/95 p-3 text-[13px] leading-6 text-cyan-50 shadow-xl backdrop-blur">
          <div className="mb-1 flex items-center gap-1 text-[10px] font-black text-cyan-300" dir="ltr"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-blink" /> FREQ • مساعد الآلة</div>
          <div>{message}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- Cartoon girl ---------- */
export function Girl({ action = 'idle', label }: { action?: 'idle' | 'walk' | 'press' | 'pull' | 'happy' | 'wow' | 'place'; label?: string }) {
  const anim = action === 'walk' ? 'animate-walk' : action === 'happy' ? 'animate-bob' : action === 'wow' ? 'animate-shake' : 'animate-floaty2';
  return (
    <div className="flex flex-col items-center">
      <div className={`${anim} relative`}>
        <div className="text-[64px] leading-none drop-shadow-[0_6px_16px_rgba(139,92,246,.5)]">
          {action === 'happy' ? '🙆‍♀️' : action === 'wow' ? '😲' : action === 'press' ? '🙋‍♀️' : action === 'pull' ? '🙆‍♀️' : action === 'place' ? '👧' : '👧'}
        </div>
        <div className="absolute -right-2 top-2 rounded-full bg-purple-500/90 px-1.5 py-0.5 text-[10px] text-white shadow">
          {action === 'walk' ? '🚶‍♀️' : action === 'press' ? '🔘' : action === 'pull' ? '🦾' : action === 'happy' ? '🎉' : action === 'wow' ? '✨' : '⚙️'}
        </div>
      </div>
      {label && <div className="mt-1 rounded-full bg-purple-500/20 px-2 py-0.5 text-[11px] font-bold text-purple-200">{label}</div>}
    </div>
  );
}

/* ---------- Power up overlay ---------- */
export function PowerUpOverlay({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#050b1e]/40" />
      {[0, 1, 2].map(i => <div key={i} className="animate-ring absolute h-52 w-52 rounded-full border-4 border-amber-300" style={{ animationDelay: `${i * 0.15}s` }} />)}
      <div className="animate-bounce-in relative rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-[#1a1440] to-[#060d24] px-10 py-8 text-center shadow-[0_0_80px_rgba(245,197,66,.6)]">
        <div className="text-5xl">⚡</div>
        <div className="font-display mt-2 text-4xl font-black text-amber-300 drop-shadow" dir="ltr">{text}</div>
        {sub && <div className="mt-2 text-lg font-bold text-cyan-100">{sub}</div>}
        <div className="mt-2 text-xs text-white/60" dir="ltr">GEARS ✓ TUBES ✓ CORE ✓</div>
      </div>
    </div>
  );
}

/* ---------- Machine stage background ---------- */
export function MachineShell({ power, active, rumbling, children, coreLit = true }: { power: number; active: boolean; rumbling?: boolean; children: React.ReactNode; coreLit?: boolean }) {
  const lit = active;
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-[#0a1430] via-[#0b1230] to-[#060a20] shadow-[0_0_60px_rgba(46,123,255,.25)] ${rumbling ? 'animate-rumble' : ''}`}>
      {/* ceiling pipes */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-4 pt-2 opacity-80" dir="ltr">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex flex-col items-center">
            <div className={`h-10 w-5 rounded-b-xl border border-cyan-300/50 ${lit ? 'bg-cyan-400/20' : 'bg-white/5'}`} />
            <div className={`steam-puff h-3 w-3 rounded-full ${lit ? 'bg-cyan-200/70' : 'bg-white/10'}`} style={{ animationDelay: `${i * 0.6}s` }} />
          </div>
        ))}
      </div>
      {/* side gears */}
      <div className="pointer-events-none absolute left-1 top-16 opacity-70"><Gear size={64} color={lit ? '#2e7bff' : '#2a3a66'} slow /></div>
      <div className="pointer-events-none absolute right-1 top-28 opacity-70"><Gear size={52} color={lit ? '#8b5cf6' : '#2a3a66'} reverse /></div>
      <div className="pointer-events-none absolute bottom-20 left-2 opacity-50"><Gear size={44} color={lit ? '#22e6d6' : '#22305a'} slow /></div>
      {/* lamps */}
      <div className="absolute inset-x-0 top-0 flex justify-center gap-3 pt-1" dir="ltr">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`h-2.5 w-2.5 rounded-full ${lit ? (i % 2 ? 'bg-emerald-400 animate-blink-slow' : 'bg-amber-300 animate-glow') : 'bg-red-500/60 animate-blink'}`} style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      {/* floor grid */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(46,123,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(46,123,255,.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* CORE behind */}
      <div className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 opacity-30">
        <div className={`h-40 w-40 rounded-full border-4 ${lit && coreLit ? 'border-cyan-300 animate-core bg-[radial-gradient(circle,#22e6d6_0%,#2e7bff_40%,transparent_70%)]' : 'border-white/10 bg-white/5'}`} />
      </div>
      <div className="relative z-10 p-3 sm:p-5">{children}</div>
      {/* bottom power bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 px-4 py-2" dir="ltr">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest text-cyan-200">HABIT CORE • {power}%</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-300 to-amber-300 transition-all duration-1000" style={{ width: `${power}%` }} />
          </div>
          <span className="text-sm">{power >= 100 ? '💎⚡⚡⚡⚡' : power >= 75 ? '⚡⚡⚡' : power >= 50 ? '⚡⚡' : power >= 25 ? '⚡' : '💤'}</span>
        </div>
      </div>
    </div>
  );
}

export function Ltr({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span dir="ltr" className={`ltr-isolate inline-block ${className}`}>{children}</span>;
}

export function EnglishLine({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div dir="ltr" className={`ltr-isolate font-en font-semibold tracking-wide ${className}`} style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
      {children}
    </div>
  );
}
