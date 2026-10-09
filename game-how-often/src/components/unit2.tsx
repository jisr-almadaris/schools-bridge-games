import { useState } from 'react';
import { EnglishLine, FreqBot } from './visuals';
import { sfx } from '../lib/audio';

type Puzzle = { id: number; chips: string[]; answer: string[]; hint: string; kind: 'build' | 'fix'; fixIndex?: number; fixReplace?: string };

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    chips: ['park', 'you', 'in the', 'walk', 'do', 'How often', '?'],
    answer: ['How often', 'do', 'you', 'walk', 'in the', 'park', '?'],
    hint: 'ابدئي بـ HOW OFTEN… ثم اختاري DO أو DOES.',
    kind: 'build',
  },
  {
    id: 2,
    chips: ['does', 'feed', 'How often', 'he', 'his pet', '?'],
    answer: ['How often', 'does', 'he', 'feed', 'his pet', '?'],
    hint: 'الفاعل he → يحتاج DOES + فعل أساسي!',
    kind: 'build',
  },
  {
    id: 3,
    chips: ['How often', 'does', 'she', 'plays', 'tennis', '?'],
    answer: ['How often', 'does', 'she', 'play', 'tennis', '?'],
    hint: '⚠️ MACHINE ERROR! بعد DOES نستخدم الفعل الأساسي بدون s.',
    kind: 'fix',
    fixIndex: 3,
    fixReplace: 'play',
  },
];

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Unit2({ onComplete }: { onComplete: () => void }) {
  const [pIdx, setPIdx] = useState(0);
  const [belt, setBelt] = useState<string[]>(() => shuffle(PUZZLES[0].chips));
  const [slots, setSlots] = useState<string[]>([]);
  const [freqMsg, setFreqMsg] = useState<React.ReactNode>(<>اسحبي القطع من السير إلى آلة التركيب بالترتيب الصحيح! ابدئي بـ <span className="font-en font-black text-amber-200" dir="ltr">HOW OFTEN</span> 🧩</>);
  const [mood, setMood] = useState<'happy' | 'think' | 'cheer' | 'wow'>('happy');
  const [assembling, setAssembling] = useState(false);
  const [builtSentence, setBuiltSentence] = useState<string | null>(null);
  const [fixMode, setFixMode] = useState(false);
  const [errorFlash, setErrorFlash] = useState(false);

  const puzzle = PUZZLES[pIdx];

  const resetFor = (idx: number) => {
    setBelt(shuffle(PUZZLES[idx].chips));
    setSlots([]);
    setBuiltSentence(null);
    setFixMode(false);
  };

  const addChip = (chip: string, bi: number) => {
    if (assembling || builtSentence) return;
    // fix puzzle: if slots empty, first load all chips into slots as printed sentence
    sfx.click();
    setBelt(b => b.filter((_, i) => i !== bi));
    setSlots(s => [...s, chip]);
  };
  const removeChip = (si: number) => {
    if (assembling || builtSentence) return;
    sfx.click();
    const c = slots[si];
    setSlots(s => s.filter((_, i) => i !== si));
    setBelt(b => [...b, c]);
  };

  const loadFixPrint = () => {
    // machine prints wrong sentence into slots
    setSlots([...puzzle.chips]);
    setBelt(puzzle.fixReplace ? [puzzle.fixReplace, 'jumps', 'played'] : []);
    setFixMode(true);
    setErrorFlash(true);
    sfx.alarm();
    setFreqMsg(<>🚨 <b>MACHINE ERROR!</b> اضغطي على القطعة الخاطئة لاستبدالها!</>);
    setMood('wow');
    setTimeout(() => setErrorFlash(false), 1200);
  };

  const fixChip = (si: number) => {
    if (!fixMode || puzzle.kind !== 'fix') return;
    if (si === puzzle.fixIndex) {
      sfx.zap(); sfx.clank();
      const ns = [...slots];
      ns[si] = puzzle.fixReplace!;
      setSlots(ns);
      setBelt([]);
      setBuiltSentence(ns.join(' ').replace(' ?', '?'));
      setMood('cheer');
      setFreqMsg(<>ممتاز! ⚡ <span className="font-en" dir="ltr">After DOES → base verb.</span> تذكري: <span className="font-en" dir="ltr">Does she play? ✓</span></>);
      setTimeout(() => advance(), 2200);
    } else {
      sfx.error();
      setFreqMsg(<>ليست هذه القطعة… ابحثي عن الفعل الذي بعد <span className="font-en" dir="ltr">DOES</span> 🔍</>);
      setMood('think');
    }
  };

  const assemble = () => {
    if (assembling || builtSentence) return;
    if (slots.length !== puzzle.answer.length) {
      sfx.error();
      setMood('think');
      setFreqMsg(<>{puzzle.hint} (وضعتِ {slots.length} من {puzzle.answer.length} قطع)</>);
      return;
    }
    const ok = slots.every((s, i) => s.toLowerCase() === puzzle.answer[i].toLowerCase());
    if (ok) {
      setAssembling(true);
      sfx.clank();
      setTimeout(() => sfx.clank(), 350);
      setTimeout(() => { sfx.zap(); sfx.tube(); }, 800);
      setTimeout(() => {
        setAssembling(false);
        const sent = puzzle.answer.join(' ').replace(' ?', '?');
        setBuiltSentence(sent);
        setMood('cheer');
        sfx.success();
        setFreqMsg(<>الآلة طبعت الجملة بنجاح! 🎉</>);
        setTimeout(() => advance(), 2300);
      }, 1300);
    } else {
      sfx.error();
      setMood('think');
      // smart hint
      if (slots[0]?.toLowerCase() !== 'how often') setFreqMsg(<>ابدئي بـ <span className="font-en font-black" dir="ltr">HOW OFTEN</span>… 🧩</>);
      else setFreqMsg(<>{puzzle.hint}</>);
    }
  };

  const advance = () => {
    if (pIdx < PUZZLES.length - 1) {
      const n = pIdx + 1;
      setPIdx(n);
      resetFor(n);
      setMood('happy');
      if (PUZZLES[n].kind === 'fix') {
        setFreqMsg(<>الآلة ستطبع جملة… لكن فيها عطل! 🛠️ راقبي جيدًا</>);
      } else {
        setFreqMsg(<>جملة جديدة على السير! ركّبيها بنفس الطريقة ⚙️</>);
      }
      sfx.steam();
    } else {
      onComplete();
    }
  };

  return (
    <div className="space-y-3">
      <FreqBot message={freqMsg} mood={mood} />
      <div className="flex items-center justify-between text-xs font-black">
        <span className="rounded-full bg-white/10 px-3 py-1 text-cyan-100" dir="ltr">ASSEMBLER {pIdx + 1} / 3</span>
        {puzzle.kind === 'fix'
          ? <span className="rounded-full bg-red-400/20 px-3 py-1 text-red-200">🛠️ FIX THE MACHINE</span>
          : <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-cyan-200">🧩 BUILD THE QUESTION</span>}
      </div>

      {puzzle.kind === 'fix' && slots.length === 0 && !builtSentence ? (
        <div className="rounded-2xl border border-red-300/40 bg-black/40 p-6 text-center">
          <div className="text-4xl">🖨️⚙️</div>
          <p className="mt-2 font-bold text-white">اضغطي الزر لتطبع الآلة الجملة</p>
          <button onClick={loadFixPrint} className="mt-3 rounded-2xl bg-gradient-to-l from-red-400 to-orange-400 px-8 py-3 font-black text-black shadow-lg transition hover:scale-105">🖨️ اطبعي الجملة</button>
        </div>
      ) : (
        <>
          {/* assembly slots LTR */}
          <div className={`rounded-2xl border-2 ${errorFlash ? 'animate-alarm border-red-400' : 'border-cyan-300/50'} bg-[#050b1e] p-3`} dir="ltr">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-en text-[11px] font-black tracking-widest text-cyan-300">ASSEMBLY CHAMBER ⬅ LEFT TO RIGHT</span>
              {assembling && <span className="font-en animate-blink text-xs font-bold text-amber-300">CLANK! CLANK! ZAP!</span>}
            </div>
            <div className="flex min-h-[64px] flex-wrap items-center gap-1.5 rounded-xl bg-white/[.04] p-2 ltr-isolate" dir="ltr" style={{ direction: 'ltr' }}>
              {slots.length === 0 && <span className="w-full text-center text-sm text-white/30">— tap chips from the belt to place here —</span>}
              {slots.map((s, i) => (
                <button
                  key={i}
                  onClick={() => (puzzle.kind === 'fix' && fixMode ? fixChip(i) : removeChip(i))}
                  className={`font-en word-chip animate-pop rounded-xl border px-3 py-2 text-[15px] font-bold ${puzzle.kind === 'fix' && fixMode && i === puzzle.fixIndex && errorFlash ? 'border-red-400 bg-red-400/25 text-red-100' : slots.length > 0 && puzzle.kind === 'fix' && fixMode ? 'border-amber-200/60 bg-amber-200/10 text-amber-100' : 'border-cyan-200/70 bg-gradient-to-b from-[#22346e] to-[#101c44] text-cyan-50'}`}
                  dir="ltr"
                >{s}</button>
              ))}
            </div>
            {builtSentence && (
              <div className="animate-bounce-in mt-2 rounded-xl border border-emerald-300/50 bg-emerald-400/10 p-3 text-center">
                <EnglishLine className="text-lg text-emerald-100">“{builtSentence}” ✓</EnglishLine>
                {puzzle.id === 3 && <div className="font-en mt-1 text-xs font-bold text-amber-200" dir="ltr">⚡ FREQ FACT: After DOES → base verb.</div>}
              </div>
            )}
          </div>

          {/* belt */}
          {!builtSentence && (
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0b1430]">
              <div className="conveyor-belt flex items-center gap-1 border-b border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black text-white/50" dir="ltr">● ● ● CONVEYOR ● ● ●</div>
              <div className="flex min-h-[64px] flex-wrap items-center justify-center gap-2 p-3" dir="ltr">
                {belt.length === 0 && <span className="text-xs text-white/30">belt empty</span>}
                {belt.map((c, i) => (
                  <button key={`${c}-${i}`} onClick={() => addChip(c, i)} className="font-en word-chip rounded-xl border-2 border-amber-200/70 bg-gradient-to-b from-[#2a2358] to-[#131036] px-4 py-2 text-[15px] font-bold text-amber-100 shadow-[0_4px_0_rgba(0,0,0,.4)] hover:border-amber-100" dir="ltr">{c}</button>
                ))}
              </div>
            </div>
          )}

          {puzzle.kind === 'build' && !builtSentence && (
            <button onClick={assemble} disabled={assembling} className={`w-full rounded-2xl px-6 py-3.5 text-lg font-black shadow-xl transition active:scale-95 ${assembling ? 'animate-rumble bg-orange-400 text-black' : 'bg-gradient-to-l from-amber-300 to-orange-400 text-[#231303] hover:scale-[1.01] shadow-[0_0_25px_rgba(245,197,66,.4)]'}`}>
              {assembling ? '⚙️ ASSEMBLING… CLANK! ZAP!' : '⚡ ASSEMBLE — ركّبي السؤال!'}
            </button>
          )}
          {puzzle.kind === 'fix' && fixMode && !builtSentence && (
            <div className="text-center text-sm font-bold text-amber-200">👆 اضغطي على القطعة الخاطئة <span className="font-en" dir="ltr">(plays)</span> لاستبدالها</div>
          )}
        </>
      )}
    </div>
  );
}
