import { useState } from 'react';
import { EnglishLine, FreqBot } from './visuals';
import { sfx } from '../lib/audio';

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function MasterLock({ code, onUnlock }: { code: number[]; onUnlock: () => void }) {
  const [entry, setEntry] = useState<string>('');
  const [err, setErr] = useState(false);
  const press = (k: string) => {
    sfx.keypad();
    if (k === 'back') { setEntry(e => e.slice(0, -1)); return; }
    if (k === 'ok') {
      if (entry === code.join('')) { sfx.lock(); sfx.powerup(); onUnlock(); }
      else { sfx.alarm(); setErr(true); setTimeout(() => setErr(false), 600); setEntry(''); }
      return;
    }
    if (entry.length < 4) setEntry(e => e + k);
  };
  return (
    <div className="mx-auto max-w-md text-center">
      <FreqBot message={<>غرفة التحكم السرية! 🔐 أدخلي الكود المكوّن من 4 أرقام الذي جمعتِه من الوحدات. انظري أعلى الشاشة: <span className="font-en" dir="ltr">MASTER CODE</span></>} mood="wow" />
      <div className={`mt-4 rounded-3xl border-2 ${err ? 'animate-shake border-red-400' : 'border-amber-300/60'} bg-gradient-to-b from-[#151032] to-[#080d24] p-5 shadow-[0_0_40px_rgba(245,197,66,.25)]`}>
        <div className="text-sm font-black tracking-widest text-amber-300" dir="ltr">🔐 SECRET CONTROL PANEL</div>
        <div className="mt-3 flex justify-center gap-2" dir="ltr">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="font-en flex h-14 w-12 items-center justify-center rounded-xl border-2 border-cyan-300 bg-black text-3xl font-black text-cyan-200">{entry[i] ?? '·'}</div>
          ))}
        </div>
        <div className="mx-auto mt-4 grid max-w-[240px] grid-cols-3 gap-2" dir="ltr">
          {['1','2','3','4','5','6','7','8','9','back','0','ok'].map(k => (
            <button key={k} onClick={() => press(k)} className={`font-en rounded-xl border py-3 text-xl font-black transition active:scale-90 ${k === 'ok' ? 'border-emerald-300 bg-emerald-400/25 text-emerald-100' : 'border-white/20 bg-white/5 text-white hover:bg-white/15'}`}>
              {k === 'back' ? '⌫' : k === 'ok' ? '✓' : k}
            </button>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-white/40" dir="ltr">CODE IS LTR • ● ● ● ●</div>
      </div>
    </div>
  );
}

const FREQ_OPTS = ['always', 'usually', 'sometimes', 'rarely', 'never'];

export default function MasterMode({ onWin }: { onWin: () => void }) {
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState<React.ReactNode>(<>وضع الماستر! 7 تحديات نهائية — كل إجابة تُشغّل نظامًا في الآلة! ⚡</>);
  const [mood, setMood] = useState<'happy' | 'think' | 'cheer' | 'wow'>('happy');
  const [systems, setSystems] = useState<string[]>([]);
  const [blastIdx, setBlastIdx] = useState(0);
  const [q2belt, setQ2belt] = useState<string[]>(() => shuffle(['How often', 'does', 'she', 'play', 'tennis', '?']));
  const [q2slots, setQ2slots] = useState<string[]>([]);
  const [f5belt, setF5belt] = useState<string[]>(() => shuffle(['tennis', 'sometimes', 'She', 'plays']));
  const [f5slots, setF5slots] = useState<string[]>([]);
  const [f7q, setF7q] = useState<string[]>([]);
  const [f7a, setF7a] = useState<string[]>([]);
  const [f7beltQ] = useState<string[]>(() => shuffle(['How often', 'does', 'Lina', 'walk', 'in the park', '?']));
  const [f7beltA] = useState<string[]>(() => shuffle(['Lina', 'usually', 'walks', 'in the park.']));
  const [f7phase, setF7phase] = useState<'q' | 'a'>('q');

  const powerSystem = (name: string, next: number, extra?: React.ReactNode) => {
    sfx.powerup(); sfx.zap();
    setSystems(s => [...s, name]);
    setMood('cheer');
    setMsg(<><b>⚡ {name} ✓</b> {extra} الطاقة تتدفق في الآلة!</>);
    setTimeout(() => { setStep(next); setMood('happy'); }, 1900);
  };

  const fail = (hint: React.ReactNode) => { sfx.error(); setMood('think'); setMsg(<>{hint}</>); };

  const BLASTS = [{ p: 'HE', ok: 'DOES' }, { p: 'WE', ok: 'DO' }];

  return (
    <div className="space-y-3">
      <FreqBot message={msg} mood={mood} />
      {/* systems lit */}
      <div className="flex flex-wrap justify-center gap-1.5" dir="ltr">
        {['GEARS', 'TUBES', 'SCANNER', 'TURBINE', 'CALENDAR', 'SENTENCE', 'CORE'].map(s => (
          <span key={s} className={`font-en rounded-full border px-2.5 py-1 text-[10px] font-black ${systems.includes(s) ? 'border-emerald-300 bg-emerald-400/20 text-emerald-200 animate-glow' : 'border-white/15 bg-white/5 text-white/30'}`}>{systems.includes(s) ? `${s} ✓` : s}</span>
        ))}
      </div>

      {step === 0 && (
        <div className="animate-bounce-in rounded-2xl border border-cyan-300/40 bg-black/40 p-5 text-center">
          <div className="text-xs font-black tracking-widest text-cyan-300" dir="ltr">FINAL 1 • PRONOUN BLAST 💥 {blastIdx + 1}/2</div>
          <div className="font-en mx-auto mt-3 w-fit rounded-2xl border-2 border-amber-300 bg-amber-300/10 px-10 py-4 text-4xl font-black text-amber-200" dir="ltr">{BLASTS[blastIdx].p}</div>
          <div className="mt-4 flex justify-center gap-3" dir="ltr">
            {(['DO', 'DOES'] as const).map(o => (
              <button key={o} onClick={() => {
                if (o === BLASTS[blastIdx].ok) {
                  sfx.zap();
                  if (blastIdx === 0) { setBlastIdx(1); setMsg(<>أصبتِها! 💥 واحدة أخرى بسرعة!</>); }
                  else powerSystem('GEARS', 1, <>التروس تدور بأقصى سرعة!</>);
                } else fail(<>من هو الفاعل؟ <span className="font-en" dir="ltr">He → DOES</span> • <span className="font-en" dir="ltr">We → DO</span></>);
              }} className="font-en rounded-2xl border-2 border-cyan-300 bg-cyan-400/15 px-10 py-3 text-2xl font-black text-cyan-100 hover:scale-105 active:scale-95">{o}</button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4">
          <div className="text-center text-xs font-black tracking-widest text-cyan-300" dir="ltr">FINAL 2 • BUILD THE QUESTION 🧩</div>
          <div className="mt-2 min-h-[60px] rounded-xl border-2 border-cyan-300/50 bg-[#050b1e] p-2" dir="ltr">
            <div className="flex flex-wrap gap-1.5" dir="ltr" style={{ direction: 'ltr' }}>
              {q2slots.length === 0 && <span className="w-full text-center text-sm text-white/30">— tap to place —</span>}
              {q2slots.map((s, i) => <button key={i} dir="ltr" onClick={() => { sfx.click(); setQ2slots(v => v.filter((_, k) => k !== i)); setQ2belt(b => [...b, s]); }} className="font-en rounded-lg border border-cyan-200/70 bg-[#22346e] px-3 py-1.5 font-bold text-cyan-50">{s}</button>)}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2 rounded-xl bg-[#0b1430] p-2" dir="ltr">
            {q2belt.map((c, i) => <button key={`${c}-${i}`} dir="ltr" onClick={() => { sfx.click(); setQ2belt(b => b.filter((_, k) => k !== i)); setQ2slots(v => [...v, c]); }} className="font-en rounded-lg border-2 border-amber-200/70 bg-[#2a2358] px-3 py-1.5 font-bold text-amber-100">{c}</button>)}
          </div>
          <button onClick={() => {
            const ans = ['How often', 'does', 'she', 'play', 'tennis', '?'];
            if (q2slots.length === ans.length && q2slots.every((s, i) => s.toLowerCase() === ans[i].toLowerCase())) powerSystem('TUBES', 2, <>الطاقة تمر في الأنابيب الزجاجية!</>);
            else fail(<>ابدئي بـ <span className="font-en" dir="ltr">HOW OFTEN</span> ثم <span className="font-en" dir="ltr">DO/DOES</span>… 🧩</>);
          }} className="mt-2 w-full rounded-2xl bg-gradient-to-l from-amber-300 to-orange-400 py-3 font-black text-black">⚡ ASSEMBLE</button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-bounce-in rounded-2xl border border-red-300/40 bg-black/30 p-5 text-center">
          <div className="text-xs font-black tracking-widest text-red-300" dir="ltr">FINAL 3 • FIX IT 🛠️</div>
          <div className="mx-auto mt-3 max-w-md rounded-xl bg-black/50 p-3" dir="ltr">
            <EnglishLine className="text-lg text-white">How often does he <span className="rounded bg-red-400/30 px-1 text-red-200 line-through">walks</span> in the park?</EnglishLine>
          </div>
          <div className="mt-2 text-sm font-bold text-white">اضغطي التصحيح الصحيح:</div>
          <div className="mt-2 flex justify-center gap-2" dir="ltr">
            {['walk', 'walks', 'walked'].map(o => (
              <button key={o} dir="ltr" onClick={() => o === 'walk' ? powerSystem('SCANNER', 3, <><span className="font-en" dir="ltr">After DOES → base verb ✓</span></>) : fail(<>بعد <span className="font-en" dir="ltr">DOES</span> نستخدم الفعل الأساسي بدون s! ⚠️</>)} className="font-en rounded-xl border-2 border-white/20 bg-white/5 px-6 py-2.5 text-lg font-bold text-white hover:border-emerald-300">{o}</button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4 text-center">
          <div className="text-xs font-black tracking-widest text-white/60" dir="ltr">FINAL 4 • READ THE CLUE 🔍</div>
          <div className="mx-auto mt-2 max-w-xs rounded-xl bg-[#111a3a] p-2" dir="ltr">
            <div className="font-en text-xs font-black text-white/60">FREQUENCY: 0%</div>
            <div className="mt-1 h-3 rounded-full bg-white/10"><div className="h-full w-[2%] rounded-full bg-slate-300" /></div>
          </div>
          <div className="mx-auto mt-2 max-w-md rounded-xl bg-white/[.06] p-3" dir="ltr"><EnglishLine className="text-lg text-white">I ___ forget to feed my pet. 🐶</EnglishLine></div>
          <div className="mt-2 flex flex-wrap justify-center gap-2" dir="ltr">
            {FREQ_OPTS.map(o => <button key={o} onClick={() => o === 'never' ? powerSystem('TURBINE', 4) : fail(<>اقرئي الدليل: <span className="font-en" dir="ltr">0%</span> تعني…؟ 🔍</>)} className="font-en rounded-xl border-2 border-slate-300/50 bg-[#1a2450] px-4 py-2 font-bold text-slate-100">{o}</button>)}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4">
          <div className="text-center text-xs font-black tracking-widest text-purple-300" dir="ltr">FINAL 5 • BUILD THE ANSWER 🏗️</div>
          <div className="mt-1 text-center text-sm font-bold text-white">She plays tennis on some days. 🎾</div>
          <div className="mt-2 min-h-[56px] rounded-xl border-2 border-purple-300/50 bg-[#050b1e] p-2" dir="ltr">
            <div className="flex flex-wrap gap-1.5" dir="ltr">{f5slots.map((s, i) => <button key={i} dir="ltr" onClick={() => { sfx.click(); setF5slots(v => v.filter((_, k) => k !== i)); setF5belt(b => [...b, s]); }} className="font-en rounded-lg border border-amber-200 bg-amber-200/15 px-3 py-1.5 font-bold text-amber-100">{s}</button>)}</div>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2" dir="ltr">
            {f5belt.map((c, i) => <button key={`${c}-${i}`} dir="ltr" onClick={() => { sfx.click(); setF5belt(b => b.filter((_, k) => k !== i)); setF5slots(v => [...v, c]); }} className="font-en rounded-lg border-2 border-purple-200/60 bg-[#2b1f5e] px-3 py-1.5 font-bold text-purple-50">{c}</button>)}
          </div>
          <button onClick={() => {
            const ans = ['She', 'sometimes', 'plays', 'tennis'];
            if (f5slots.length === 4 && f5slots.every((s, i) => s.toLowerCase() === ans[i].toLowerCase())) powerSystem('CALENDAR', 5);
            else fail(<>الترتيب: <span className="font-en" dir="ltr">Subject → Frequency → Verb</span> 🏗️</>);
          }} className="mt-2 w-full rounded-2xl bg-gradient-to-l from-purple-400 to-fuchsia-400 py-3 font-black text-black">🔥 BUILD IT!</button>
        </div>
      )}

      {step === 5 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4 text-center">
          <div className="text-xs font-black tracking-widest text-emerald-300" dir="ltr">FINAL 6 • WEEK MACHINE 📅</div>
          <div className="mx-auto mt-2 max-w-sm rounded-xl bg-[#111a3a] p-3" dir="ltr">
            <div className="font-en text-sm font-black text-white">HE PLAYS FOOTBALL ⚽ — twice!</div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {['M','T','W','T','F','S','S'].map((_, i) => <div key={i} className={`rounded-lg border p-1 text-center text-lg ${i === 1 || i === 5 ? 'border-emerald-300 bg-emerald-400/20' : 'border-white/10 bg-white/5 opacity-40'}`}>{i === 1 || i === 5 ? '⚽' : '·'}</div>)}
            </div>
          </div>
          <div className="mx-auto mt-2 max-w-md rounded-xl bg-white/[.06] p-3" dir="ltr"><EnglishLine className="text-white">How often does he play football?</EnglishLine></div>
          <div className="mt-2 flex flex-wrap justify-center gap-2" dir="ltr">
            {['Once a week.', 'Twice a week.', 'Three times a week.'].map(o => (
              <button key={o} dir="ltr" onClick={() => o.startsWith('Twice') ? powerSystem('SENTENCE', 6, <>مرتين في الأسبوع! ⚽⚽</>) : fail(<>عُدّي كرات القدم في التقويم… كم مرة؟ 🔍</>)} className="font-en rounded-xl border-2 border-white/20 bg-white/5 px-4 py-2 font-bold text-white hover:border-emerald-300">{o}</button>
            ))}
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="animate-bounce-in rounded-2xl border border-amber-300/50 bg-gradient-to-b from-[#1a1440] to-[#080d24] p-4">
          <div className="text-center text-xs font-black tracking-widest text-amber-300" dir="ltr">FINAL 7 • FULL POWER 💎 {f7phase === 'q' ? 'QUESTION 1/2' : 'ANSWER 2/2'}</div>
          <div className="mt-1 text-center text-sm font-bold text-white">Lina walks in the park on most days. 🌳</div>
          {f7phase === 'q' ? (
            <>
              <div className="mt-2 min-h-[56px] rounded-xl border-2 border-cyan-300/50 bg-black/50 p-2" dir="ltr">
                <div className="flex flex-wrap gap-1.5" dir="ltr">{f7q.map((s, i) => <button key={i} dir="ltr" onClick={() => { sfx.click(); setF7q(v => v.filter((_, k) => k !== i)); }} className="font-en rounded-lg border border-cyan-200 bg-[#22346e] px-2.5 py-1 text-sm font-bold text-cyan-50">{s}</button>)}</div>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5" dir="ltr">
                {f7beltQ.filter(c => !f7q.includes(c)).map((c, i) => <button key={`${c}-${i}`} dir="ltr" onClick={() => { sfx.click(); setF7q(v => [...v, c]); }} className="font-en rounded-lg border-2 border-amber-200/60 bg-[#2a2358] px-2.5 py-1 text-sm font-bold text-amber-100">{c}</button>)}
              </div>
              <button onClick={() => {
                const ans = ['How often', 'does', 'Lina', 'walk', 'in the park', '?'];
                if (f7q.length === ans.length && f7q.every((s, i) => s.toLowerCase() === ans[i].toLowerCase())) { sfx.success(); setF7phase('a'); setMsg(<>السؤال مثالي! ✨ الآن ابنِ الإجابة… الدليل: <b>most days</b> تعني…؟</>); }
                else fail(<>السؤال: <span className="font-en" dir="ltr">How often + does + Lina + walk…?</span> تذكري: بعد DOES فعل أساسي!</>);
              }} className="mt-2 w-full rounded-2xl bg-gradient-to-l from-amber-300 to-orange-400 py-3 font-black text-black">1️⃣ تأكيد السؤال</button>
            </>
          ) : (
            <>
              <div className="mt-2 min-h-[56px] rounded-xl border-2 border-purple-300/50 bg-black/50 p-2" dir="ltr">
                <div className="flex flex-wrap gap-1.5" dir="ltr">{f7a.map((s, i) => <button key={i} dir="ltr" onClick={() => { sfx.click(); setF7a(v => v.filter((_, k) => k !== i)); }} className="font-en rounded-lg border border-amber-200 bg-amber-200/15 px-2.5 py-1 text-sm font-bold text-amber-100">{s}</button>)}</div>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5" dir="ltr">
                {f7beltA.filter(c => !f7a.includes(c)).map((c, i) => <button key={`${c}-${i}`} dir="ltr" onClick={() => { sfx.click(); setF7a(v => [...v, c]); }} className="font-en rounded-lg border-2 border-purple-200/60 bg-[#2b1f5e] px-2.5 py-1 text-sm font-bold text-purple-50">{c}</button>)}
              </div>
              <button onClick={() => {
                const ans = ['Lina', 'usually', 'walks', 'in the park.'];
                if (f7a.length === ans.length && f7a.every((s, i) => s.toLowerCase() === ans[i].toLowerCase())) {
                  sfx.core(); setSystems(s => [...s, 'CORE']);
                  setMood('cheer'); setMsg(<>💎 FULL POWER!!! كل الآلة تعمل معًا!!!</>);
                  setTimeout(() => onWin(), 2300);
                } else fail(<>الإجابة: <span className="font-en" dir="ltr">Lina + usually + walks…</span> — معظم الأيام = usually! 💎</>);
              }} className="mt-2 w-full rounded-2xl bg-gradient-to-l from-cyan-300 via-amber-300 to-fuchsia-400 py-3 font-black text-black animate-marquee">💎 FULL POWER — تأكيد الإجابة!</button>
            </>
          )}
        </div>
      )}

      <div className="text-center text-xs font-bold text-white/40" dir="ltr">MASTER {Math.min(step + 1, 7)} / 7</div>
    </div>
  );
}
