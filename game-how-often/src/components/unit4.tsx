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

type BuildPuzzle = { context: string; chips: string[]; answer: string[]; slotsLabels: string[] };

const BUILDS: BuildPuzzle[] = [
  { context: 'رتّبي الجملة في الفتحات الأربع 👇', chips: ['after school', 'usually', 'I', 'walk'], answer: ['I', 'usually', 'walk', 'after school'], slotsLabels: ['SUBJECT', 'FREQUENCY', 'VERB', 'EXTRA'] },
  { context: 'Sara plays tennis on some days. 🎾', chips: ['tennis', 'sometimes', 'She', 'plays'], answer: ['She', 'sometimes', 'plays', 'tennis'], slotsLabels: ['SUBJECT', 'FREQUENCY', 'VERB', 'EXTRA'] },
  { context: 'Weekly clue: almost every day 🐶', chips: ['usually', 'He', 'his pet', 'feeds'], answer: ['He', 'usually', 'feeds', 'his pet'], slotsLabels: ['SUBJECT', 'FREQUENCY', 'VERB', 'EXTRA'] },
];

export default function Unit4({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); // 0,1,2 builds, 3 reverse, 4 error smash
  const [belt, setBelt] = useState<string[]>(() => shuffle(BUILDS[0].chips));
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const [freqMsg, setFreqMsg] = useState<React.ReactNode>(<>محرك الجمل الضخم جاهز! ضعي كل قطعة في فتحتها: <span className="font-en" dir="ltr">Subject → Frequency → Verb → Extra</span> 🏗️</>);
  const [mood, setMood] = useState<'happy' | 'think' | 'cheer' | 'wow'>('happy');
  const [building, setBuilding] = useState(false);
  const [printed, setPrinted] = useState<string | null>(null);
  const [reversePicked, setReversePicked] = useState<string | null>(null);
  const [smashWords, setSmashWords] = useState<string[]>(['She', 'walks', 'usually', 'after school.']);
  const [smashPicked, setSmashPicked] = useState<number | null>(null);

  const puzzle = BUILDS[Math.min(stage, 2)];

  const placeChip = (chip: string, bi: number) => {
    if (building || printed) return;
    const emptyIdx = slots.findIndex(s => s === null);
    if (emptyIdx === -1) return;
    sfx.click();
    setBelt(b => b.filter((_, i) => i !== bi));
    setSlots(s => { const n = [...s]; n[emptyIdx] = chip; return n; });
  };
  const unplace = (si: number) => {
    if (building || printed) return;
    const c = slots[si]; if (!c) return;
    sfx.click();
    setSlots(s => { const n = [...s]; n[si] = null; return n; });
    setBelt(b => [...b, c]);
  };

  const buildIt = () => {
    if (slots.some(s => !s)) { sfx.error(); setMood('think'); setFreqMsg(<>املئي الفتحات الأربع أولًا! 🧩</>); return; }
    const ok = (slots as string[]).every((s, i) => s.toLowerCase() === puzzle.answer[i].toLowerCase());
    if (ok) {
      setBuilding(true); sfx.gear(); sfx.clank();
      setFreqMsg(<>⚙️ التروس تدور… الآلة تهتز…</>);
      setTimeout(() => { sfx.zap(); sfx.steam(); }, 800);
      setTimeout(() => {
        setBuilding(false);
        const sent = puzzle.answer.join(' ') + '.';
        setPrinted(sent.replace('..', '.'));
        sfx.success(); setMood('cheer');
        setFreqMsg(<>الآلة طبعت: 🎉</>);
        setTimeout(() => {
          if (stage < 2) {
            const n = stage + 1;
            setStage(n); setBelt(shuffle(BUILDS[n].chips)); setSlots([null, null, null, null]); setPrinted(null); setMood('happy');
            setFreqMsg(n === 1 ? <>سياق جديد! اقرئي الدليل ثم ابنِ الجملة 📖</> : <>آخر بناء! الدليل: <span className="font-en" dir="ltr">almost every day</span> تعني…؟ 🤔</>);
          } else {
            setStage(3); setPrinted(null); setMood('happy');
            setFreqMsg(<>تحدي معكوس! 🔄 اقرئي الجملة واختاري السؤال المطابق لها</>);
            sfx.beep();
          }
        }, 2300);
      }, 1300);
    } else {
      sfx.error(); setMood('think');
      setFreqMsg(<>ابحثي عن مكان كلمة التكرار: <span className="font-en" dir="ltr">Subject → Frequency → Verb</span> — أين يجب أن تكون؟ 🔍</>);
    }
  };

  const pickReverse = (id: string) => {
    if (reversePicked) return;
    if (id === 'A') {
      sfx.success(); setReversePicked(id); setMood('cheer');
      setFreqMsg(<>صحيح! <span className="font-en" dir="ltr">they → DO</span> + فعل أساسي <span className="font-en" dir="ltr">play ✓</span></>);
      setTimeout(() => { setStage(4); setReversePicked(null); setFreqMsg(<>🚨 خطأ في الطباعة! انقلي الكلمة إلى مكانها الصحيح بضغطتين! (اضغطي كلمتين للتبديل)</>); }, 2200);
    } else {
      sfx.error(); setMood('think');
      setFreqMsg(id === 'B'
        ? <>انظري للفاعل: <span className="font-en" dir="ltr">they</span> هل يأخذ <span className="font-en" dir="ltr">DO</span> أم <span className="font-en" dir="ltr">DOES</span>؟ 🤔</>
        : <>بعد <span className="font-en" dir="ltr">DO</span> هل نضيف <span className="font-en" dir="ltr">s</span> للفعل؟ تذكري القاعدة! ⚠️</>);
    }
  };

  const smashTap = (i: number) => {
    if (smashPicked === null) { sfx.click(); setSmashPicked(i); return; }
    if (smashPicked === i) { setSmashPicked(null); return; }
    const n = [...smashWords];
    [n[smashPicked], n[i]] = [n[i], n[smashPicked]];
    setSmashWords(n); setSmashPicked(null); sfx.gear();
    const target = ['She', 'usually', 'walks', 'after school.'];
    if (n.every((w, k) => w === target[k])) {
      sfx.success(); sfx.powerup(); setMood('cheer');
      setFreqMsg(<>مثالية! <span className="font-en" dir="ltr">She usually walks after school. ✓</span></>);
      setTimeout(() => onComplete(), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <FreqBot message={freqMsg} mood={mood} />
      <div className="flex items-center justify-between text-xs font-black">
        <span className="rounded-full bg-white/10 px-3 py-1 text-cyan-100" dir="ltr">ENGINE {Math.min(stage + 1, 5)} / 5</span>
        <span className="rounded-full bg-orange-400/15 px-3 py-1 text-orange-200">{stage <= 2 ? '🏗️ BUILD IT!' : stage === 3 ? '🔄 REVERSE CHALLENGE' : '🚨 ERROR SMASH'}</span>
      </div>

      {stage <= 2 && (
        <div className="rounded-2xl border border-purple-300/30 bg-black/30 p-3">
          <div className="mb-2 text-center text-sm font-bold text-purple-100">{puzzle.context}</div>
          {/* 4 slots LTR */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" dir="ltr">
            {slots.map((s, i) => (
              <div key={i} className="rounded-xl border border-purple-300/40 bg-[#0d1030] p-1.5 text-center">
                <div className="font-en text-[10px] font-black tracking-widest text-purple-300">{puzzle.slotsLabels[i]}</div>
                <button onClick={() => unplace(i)} className={`font-en mt-1 min-h-[44px] w-full rounded-lg border-2 px-2 py-1.5 text-[15px] font-bold ${s ? 'border-amber-200 bg-amber-200/15 text-amber-100' : 'border-dashed border-white/20 text-white/25'}`} dir="ltr">
                  {s ?? '···'}
                </button>
              </div>
            ))}
          </div>
          {/* belt */}
          {!printed && (
            <div className="mt-2 rounded-xl border border-white/15 bg-[#0b1430] p-2">
              <div className="conveyor-belt rounded-t-lg border-b border-white/10 bg-white/5 px-2 py-0.5 text-center text-[10px] font-black text-white/40" dir="ltr">● CONVEYOR ●</div>
              <div className="flex flex-wrap justify-center gap-2 p-2" dir="ltr">
                {belt.map((c, i) => <button key={`${c}-${i}`} onClick={() => placeChip(c, i)} className="font-en word-chip rounded-xl border-2 border-purple-200/70 bg-gradient-to-b from-[#2b1f5e] to-[#151036] px-4 py-2 font-bold text-purple-50" dir="ltr">{c}</button>)}
              </div>
            </div>
          )}
          {printed && (
            <div className="animate-bounce-in mt-2 rounded-xl border border-emerald-300/50 bg-emerald-400/10 p-3 text-center">
              <EnglishLine className="text-xl text-emerald-100">“{printed}” ✓</EnglishLine>
            </div>
          )}
          {!printed && (
            <button onClick={buildIt} className={`mt-2 w-full rounded-2xl px-6 py-3.5 text-lg font-black transition active:scale-95 ${building ? 'animate-rumble bg-orange-400 text-black' : 'bg-gradient-to-l from-orange-400 via-amber-300 to-orange-400 text-[#2a1200] shadow-[0_0_25px_rgba(255,122,26,.5)] hover:scale-[1.01]'}`}>
              {building ? '⚙️ BUILDING… RUMBLE! 💨' : '🔥 BUILD IT! — ابنِ الجملة!'}
            </button>
          )}
        </div>
      )}

      {stage === 3 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4">
          <div className="mx-auto max-w-md rounded-xl bg-purple-400/10 p-3 text-center" dir="ltr">
            <div className="text-[11px] font-black text-purple-200">GIVEN SENTENCE:</div>
            <EnglishLine className="text-xl text-white">They rarely play video games. 🎮</EnglishLine>
          </div>
          <div className="mt-2 text-center text-sm font-bold text-white">أي سؤال يطابق هذه الجملة؟</div>
          <div className="mx-auto mt-2 max-w-md space-y-2" dir="ltr">
            {[
              { id: 'A', t: 'How often do they play video games?' },
              { id: 'B', t: 'How often does they play video games?' },
              { id: 'C', t: 'How often do they plays video games?' },
            ].map(o => (
              <button key={o.id} onClick={() => pickReverse(o.id)} className={`font-en block w-full rounded-xl border-2 px-4 py-3 text-left font-semibold transition active:scale-[.98] ${reversePicked === o.id ? 'border-emerald-300 bg-emerald-400/20 text-emerald-100' : 'border-white/20 bg-white/5 text-white hover:border-cyan-300 hover:bg-cyan-400/10'}`} dir="ltr">
                <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 font-black">{o.id}</span>{o.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 4 && (
        <div className="animate-bounce-in rounded-2xl border border-red-300/40 bg-black/30 p-4 text-center">
          <div className="inline-flex animate-blink items-center gap-2 rounded-full bg-red-500/20 px-4 py-1 font-black text-red-200">🚨 ERROR! — الآلة طبعت ترتيبًا خاطئًا</div>
          <div className="mx-auto mt-3 flex max-w-lg flex-wrap justify-center gap-2 rounded-xl bg-white/[.05] p-4" dir="ltr">
            {smashWords.map((w, i) => (
              <button key={`${w}-${i}`} onClick={() => smashTap(i)} dir="ltr"
                className={`font-en word-chip rounded-xl border-2 px-4 py-2.5 text-lg font-bold ${smashPicked === i ? 'scale-110 border-amber-300 bg-amber-300 text-black' : w === 'usually' ? 'border-amber-300/70 bg-amber-300/15 text-amber-100' : 'border-white/25 bg-[#1a2450] text-white'}`}>
                {w}
              </button>
            ))}
          </div>
          <div className="mt-2 text-xs font-bold text-white/60">اضغطي كلمة ثم كلمة أخرى لتبديل مكانيهما — الهدف: <span className="font-en text-emerald-200" dir="ltr">She usually walks after school.</span></div>
        </div>
      )}
    </div>
  );
}
