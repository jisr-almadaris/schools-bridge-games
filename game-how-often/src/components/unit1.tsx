import { useMemo, useState } from 'react';
import { FreqBot } from './visuals';
import { sfx } from '../lib/audio';

const DO_SET = ['I', 'YOU', 'WE', 'THEY'];
const DOES_SET = ['HE', 'SHE', 'IT'];

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Unit1({ onComplete }: { onComplete: () => void }) {
  const [pool, setPool] = useState<string[]>(() => shuffle(['SHE', 'THEY', 'I', 'HE', 'WE', 'IT', 'YOU']));
  const [placed, setPlaced] = useState<Record<string, 'DO' | 'DOES'>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [shakeBall, setShakeBall] = useState<string | null>(null);
  const [freqMsg, setFreqMsg] = useState<React.ReactNode>(<>اختاري كرة ضمير ثم وجّهيها إلى المسار الصحيح! <span className="font-en" dir="ltr">DO ⚙️ or DOES ⚙️?</span></>);
  const [freqMood, setFreqMood] = useState<'happy' | 'think' | 'wow' | 'sad' | 'cheer'>('happy');
  const [bonusStep, setBonusStep] = useState(0); // 0 sorting, 1 bonus1, 2 bonus2, 3 done
  const [bonusAns, setBonusAns] = useState<string | null>(null);

  const doneCount = Object.keys(placed).length;
  const sortingDone = doneCount === 7;

  const sendTo = (line: 'DO' | 'DOES') => {
    if (!selected || sortingDone) return;
    const correct = (DO_SET.includes(selected) && line === 'DO') || (DOES_SET.includes(selected) && line === 'DOES');
    if (correct) {
      sfx.zap(); sfx.gear();
      setPlaced(p => ({ ...p, [selected]: line }));
      setPool(p => p.filter(x => x !== selected));
      setSelected(null);
      setFreqMood('cheer');
      const left = 7 - (Object.keys(placed).length + 1);
      setFreqMsg(left === 0 ? <>مذهل! كل الكرات في مكانها 🎉 التوربين يستعد للدوران...</> : <>أحسنتِ! ⚡ بقي <b>{left}</b> كرات. استمري!</>);
      if (left === 0) {
        setTimeout(() => { sfx.powerup(); setBonusStep(1); setFreqMsg(<>مكافأة التوربين! 🎁 أكملي الفراغ:</>); setFreqMood('happy'); }, 1200);
      }
    } else {
      sfx.error(); sfx.alarm();
      setShakeBall(selected);
      setFreqMood('think');
      setFreqMsg(<>فكّري في المجموعة: <span className="font-en font-black text-cyan-200" dir="ltr">I / You / We / They</span> أم <span className="font-en font-black text-fuchsia-200" dir="ltr">He / She / It</span>؟ حاولي مجددًا 💪</>);
      setTimeout(() => setShakeBall(null), 500);
    }
  };

  const answerBonus = (ans: 'DO' | 'DOES') => {
    const ok = (bonusStep === 1 && ans === 'DOES') || (bonusStep === 2 && ans === 'DO');
    if (ok) {
      sfx.success();
      setBonusAns(ans);
      setFreqMood('cheer');
      setFreqMsg(bonusStep === 1 ? <>صحيح! <span className="font-en" dir="ltr">she → DOES ✓</span> بقي سؤال واحد!</> : <>رائع! <span className="font-en" dir="ltr">they → DO ✓</span> التوربين يعمل بكامل الطاقة!</>);
      setTimeout(() => {
        setBonusAns(null);
        if (bonusStep === 1) setBonusStep(2);
        else { setBonusStep(3); onComplete(); }
      }, 1100);
    } else {
      sfx.error();
      setFreqMood('think');
      setFreqMsg(<>من هو الفاعل؟ <span className="font-en" dir="ltr">I/You/We/They → DO</span> • <span className="font-en" dir="ltr">He/She/It → DOES</span> 🤔</>);
    }
  };

  const doBalls = useMemo(() => Object.entries(placed).filter(([, v]) => v === 'DO'), [placed]);
  const doesBalls = useMemo(() => Object.entries(placed).filter(([, v]) => v === 'DOES'), [placed]);

  if (bonusStep >= 1 && bonusStep <= 2) {
    const isShe = bonusStep === 1;
    return (
      <div className="space-y-3">
        <FreqBot message={freqMsg} mood={freqMood} />
        {/* turbine spinning behind */}
        <div className="rounded-2xl border border-emerald-300/30 bg-black/30 p-4 text-center" dir="ltr">
          <div className="font-en text-xs font-black tracking-widest text-emerald-300">TURBINE SPINNING… ⚙️⚙️⚙️</div>
          <div className="mt-1 flex justify-center gap-2 text-3xl">
            <span className="animate-spin-turbine inline-block">⚙️</span>
            <span className="animate-spin-rev inline-block">⚙️</span>
            <span className="animate-spin-turbine inline-block">⚙️</span>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-300/40 bg-gradient-to-b from-[#151032] to-[#0a0f2a] p-5 text-center">
          <div className="text-sm font-black text-amber-300">🔥 BONUS — أكملي بكلمة واحدة</div>
          <div className="mx-auto mt-3 max-w-md rounded-2xl bg-black/40 p-4" dir="ltr">
            <div className="font-en text-xl font-bold text-white">
              How often <span className="mx-1 inline-block min-w-[64px] rounded-lg border-2 border-dashed border-amber-300 px-2 text-amber-200">{bonusAns ?? '___'}</span> {isShe ? 'she' : 'they'} {isShe ? 'walk' : 'play'}?
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-3" dir="ltr">
            {(['DO', 'DOES'] as const).map(o => (
              <button key={o} onClick={() => answerBonus(o)} className="font-en rounded-2xl border-2 border-cyan-300 bg-cyan-400/15 px-10 py-3 text-2xl font-black text-cyan-100 shadow-lg transition hover:scale-105 active:scale-95">{o}</button>
            ))}
          </div>
          <div className="mt-2 text-xs text-white/50" dir="ltr">{bonusStep} / 2</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <FreqBot message={freqMsg} mood={freqMood} />
      <div className="flex items-center justify-between text-xs font-black">
        <span className="rounded-full bg-white/10 px-3 py-1 text-cyan-100" dir="ltr">SORTED {doneCount} / 7</span>
        <span className="rounded-full bg-amber-300/15 px-3 py-1 text-amber-200">وجّهي كل كرة لمسارها ⚙️</span>
      </div>

      {/* pool */}
      <div className="rounded-2xl border border-white/15 bg-black/30 p-3">
        <div className="mb-2 text-center text-xs font-bold text-white/60">كرات الضمائر المختلطة — اضغطي كرة ثم اضغطي المسار</div>
        <div className="flex flex-wrap justify-center gap-2" dir="ltr">
          {pool.length === 0 && <div className="py-2 text-emerald-300 font-bold">✓ كل الكرات تم توجيهها!</div>}
          {pool.map(p => (
            <button
              key={p}
              onClick={() => { sfx.pop(); setSelected(p); }}
              className={`font-en word-chip rounded-full border-2 px-5 py-2.5 text-lg font-black shadow-lg ${selected === p ? 'scale-110 border-amber-300 bg-gradient-to-b from-amber-200 to-orange-300 text-black shadow-[0_0_25px_rgba(245,197,66,.7)]' : 'border-cyan-200/60 bg-gradient-to-b from-[#1c2c63] to-[#0d1738] text-cyan-100'} ${shakeBall === p ? 'animate-shake border-red-400' : ''}`}
            >{p}</button>
          ))}
        </div>
      </div>

      {/* two lines */}
      <div className="grid gap-3 sm:grid-cols-2" dir="ltr">
        <button onClick={() => sendTo('DO')} className="group overflow-hidden rounded-2xl border-2 border-cyan-300 bg-gradient-to-b from-cyan-500/20 to-[#0a1430] p-3 text-center transition hover:border-cyan-200 hover:bg-cyan-400/20 active:scale-[.98]">
          <div className="font-en text-xl font-black text-cyan-200">DO ⚙️</div>
          <div className="font-en text-[11px] text-cyan-300/70">I • YOU • WE • THEY ?</div>
          <div className="conveyor-belt mt-2 flex min-h-[64px] flex-wrap items-center justify-center gap-1.5 rounded-xl bg-black/40 p-2">
            {doBalls.length === 0 && <span className="text-xs text-white/30">— empty lane —</span>}
            {doBalls.map(([k]) => <span key={k} className="font-en animate-pop rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-[#060d24]">{k}</span>)}
          </div>
          <div className="mt-1 text-2xl"><span className="animate-spin-med inline-block">⚙️</span></div>
        </button>
        <button onClick={() => sendTo('DOES')} className="group overflow-hidden rounded-2xl border-2 border-fuchsia-400 bg-gradient-to-b from-fuchsia-500/20 to-[#0a1430] p-3 text-center transition hover:border-fuchsia-200 hover:bg-fuchsia-400/20 active:scale-[.98]">
          <div className="font-en text-xl font-black text-fuchsia-200">DOES ⚙️</div>
          <div className="font-en text-[11px] text-fuchsia-300/70">HE • SHE • IT ?</div>
          <div className="conveyor-belt mt-2 flex min-h-[64px] flex-wrap items-center justify-center gap-1.5 rounded-xl bg-black/40 p-2">
            {doesBalls.length === 0 && <span className="text-xs text-white/30">— empty lane —</span>}
            {doesBalls.map(([k]) => <span key={k} className="font-en animate-pop rounded-full bg-fuchsia-300 px-3 py-1 text-sm font-black text-[#060d24]">{k}</span>)}
          </div>
          <div className="mt-1 text-2xl"><span className="animate-spin-med inline-block">⚙️</span></div>
        </button>
      </div>
      <div className="text-center text-[11px] text-white/40">تلميح: اضغطي الكرة أولًا لتحديدها ✨ ثم اختاري المسار</div>
    </div>
  );
}
