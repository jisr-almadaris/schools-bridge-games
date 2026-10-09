import { useState } from 'react';
import { EnglishLine, FreqBot } from './visuals';
import { sfx } from '../lib/audio';

const OPTIONS = ['always', 'usually', 'sometimes', 'rarely', 'never'];

export default function Unit3({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); // 0 A, 1 B, 2 C, 3 personal, 4 done
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [freqMsg, setFreqMsg] = useState<React.ReactNode>(<>الماسح الضوئي يعمل… اقرئي <b>الدليل المحايد</b> أولًا ثم اختاري الكلمة! 🔍</>);
  const [mood, setMood] = useState<'happy' | 'think' | 'cheer' | 'wow'>('happy');
  const [personalChoice, setPersonalChoice] = useState<string | null>(null);

  const choose = (opt: string) => {
    if (locked) return;
    sfx.click();
    if (stage === 0) {
      if (opt === 'never') {
        setPicked(opt); setLocked(true); sfx.success(); sfx.tube();
        setMood('cheer'); setFreqMsg(<>صحيح! <span className="font-en" dir="ltr">0% → NEVER ✓</span> النسبة كانت الدليل!</>);
        setTimeout(() => { setStage(1); setPicked(null); setLocked(false); setMood('happy'); setFreqMsg(<>تحدٍ جديد: اقرئي تقويم الأسبوع 📅 كم مرة يحدث النشاط؟</>); }, 2000);
      } else {
        sfx.error(); setMood('think');
        setFreqMsg(<>اقرئي الدليل أولًا: كم مرة يحدث النشاط؟ <span className="font-en" dir="ltr">FREQUENCY: 0%</span> تعني…؟ 🤔</>);
      }
    } else if (stage === 1) {
      if (opt === 'usually') {
        setPicked(opt); setLocked(true); sfx.success(); sfx.tube();
        setMood('cheer'); setFreqMsg(<>ممتاز! 5 من 7 أيام = أغلب الأيام = <span className="font-en" dir="ltr">usually ✓</span></>);
        setTimeout(() => { setStage(2); setPicked(null); setLocked(false); setMood('happy'); setFreqMsg(<>اقرئي الجملة الإنجليزية جيدًا… ماذا تعني <span className="font-en" dir="ltr">once in a while</span>؟ 📖</>); }, 2000);
      } else {
        sfx.error(); setMood('think');
        setFreqMsg(<>عُدّي علامات ✓ في التقويم… هل هي كل الأيام؟ أم أغلبها؟ أم مرة واحدة؟ 🔍</>);
      }
    } else if (stage === 2) {
      if (opt === 'rarely') {
        setPicked(opt); setLocked(true); sfx.success(); sfx.tube();
        setMood('cheer'); setFreqMsg(<>أحسنتِ! <span className="font-en" dir="ltr">once in a while = rarely ✓</span> (مرة من حين لآخر = نادرًا)</>);
        setTimeout(() => { setStage(3); setPicked(null); setLocked(false); setMood('happy'); setFreqMsg(<>الآن سؤال شخصي لكِ أنتِ! 💖 أي إجابة تختارينها صحيحة!</>); sfx.beep(); }, 2000);
      } else {
        sfx.error(); setMood('think');
        setFreqMsg(<>ماذا يعني <span className="font-en" dir="ltr">only once in a while</span>؟ هل هو كثير أم قليل جدًا؟ 💭</>);
      }
    } else if (stage === 3) {
      setPersonalChoice(opt); setPicked(opt); setLocked(true);
      sfx.cheer(); sfx.powerup();
      setMood('cheer');
      setFreqMsg(<>رائع! اخترتِ <span className="font-en font-black" dir="ltr">{opt}</span> — الآن لنبنِ جملتكِ الخاصة! 🎉</>);
      setTimeout(() => onComplete(), 2600);
    }
  };

  // Neutral button style — ALL identical (no color clues!)
  const btnClass = (opt: string) => {
    const base = 'font-en word-chip rounded-2xl border-2 px-4 py-3 text-lg font-bold transition active:scale-95 ';
    if (picked === opt && locked) return base + 'border-emerald-300 bg-emerald-400/25 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,.5)] scale-105';
    if (picked === opt) return base + 'border-white bg-white/20 text-white scale-105';
    return base + 'border-slate-300/50 bg-[#1a2450] text-slate-100 hover:border-white hover:bg-[#232f63]';
  };

  return (
    <div className="space-y-3">
      <FreqBot message={freqMsg} mood={mood} />

      {stage === 0 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4">
          <div className="mb-1 text-center text-xs font-black tracking-widest text-white/60" dir="ltr">SCANNER CHALLENGE A • NEUTRAL GAUGE</div>
          <div className="mx-auto max-w-sm rounded-xl border border-white/15 bg-[#111a3a] p-3" dir="ltr">
            <div className="flex justify-between text-[11px] font-black text-white/60"><span>FREQUENCY</span><span>0%</span></div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[2%] rounded-full bg-slate-300" /></div>
          </div>
          <div className="mx-auto mt-3 max-w-md rounded-2xl bg-white/[.06] p-4 text-center" dir="ltr">
            <EnglishLine className="text-xl text-white">I <span className="mx-1 inline-block min-w-[70px] rounded-lg border-2 border-dashed border-white/40 px-2 text-amber-200">{picked ?? '______'}</span> forget to feed my pet.</EnglishLine>
            <div className="mt-1 text-xs text-white/50">🐶 I love my pet! I feed him every single day.</div>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2" dir="ltr">
            {OPTIONS.map(o => <button key={o} onClick={() => choose(o)} className={btnClass(o)}>{o}</button>)}
          </div>
        </div>
      )}

      {stage === 1 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4">
          <div className="mb-1 text-center text-xs font-black tracking-widest text-white/60" dir="ltr">SCANNER CHALLENGE B • WEEK CALENDAR</div>
          <div className="mx-auto max-w-md rounded-xl border border-white/15 bg-[#111a3a] p-3" dir="ltr">
            <div className="font-en mb-2 text-center text-sm font-black text-white">WALK AFTER SCHOOL 🚶‍♀️</div>
            <div className="grid grid-cols-7 gap-1">
              {[
                { d: 'MON', on: true }, { d: 'TUE', on: true }, { d: 'WED', on: true }, { d: 'THU', on: true }, { d: 'FRI', on: false }, { d: 'SAT', on: true }, { d: 'SUN', on: false },
              ].map(x => (
                <div key={x.d} className="rounded-lg border border-white/15 bg-white/5 p-1 text-center">
                  <div className="text-[9px] font-black text-white/60">{x.d}</div>
                  <div className="text-xl">{x.on ? '✓' : '·'}</div>
                </div>
              ))}
            </div>
            <div className="mt-1 text-center text-[11px] text-white/50">5 days out of 7 — most days!</div>
          </div>
          <div className="mx-auto mt-3 max-w-md rounded-2xl bg-white/[.06] p-4 text-center" dir="ltr">
            <EnglishLine className="text-xl text-white">She <span className="mx-1 inline-block min-w-[70px] rounded-lg border-2 border-dashed border-white/40 px-2 text-amber-200">{picked ?? '______'}</span> walks after school.</EnglishLine>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2" dir="ltr">
            {OPTIONS.map(o => <button key={o} onClick={() => choose(o)} className={btnClass(o)}>{o}</button>)}
          </div>
        </div>
      )}

      {stage === 2 && (
        <div className="animate-bounce-in rounded-2xl border border-white/15 bg-black/30 p-4">
          <div className="mb-1 text-center text-xs font-black tracking-widest text-white/60" dir="ltr">SCANNER CHALLENGE C • READ THE CLUE</div>
          <div className="mx-auto max-w-md rounded-xl border border-white/15 bg-[#111a3a] p-4 text-center" dir="ltr">
            <div className="text-3xl">🎾👧</div>
            <EnglishLine className="mt-2 text-lg italic text-white">“Mona plays tennis only once in a while.”</EnglishLine>
          </div>
          <div className="mx-auto mt-3 max-w-md rounded-2xl bg-white/[.06] p-4 text-center" dir="ltr">
            <EnglishLine className="text-xl text-white">Mona <span className="mx-1 inline-block min-w-[70px] rounded-lg border-2 border-dashed border-white/40 px-2 text-amber-200">{picked ?? '______'}</span> plays tennis.</EnglishLine>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2" dir="ltr">
            {OPTIONS.map(o => <button key={o} onClick={() => choose(o)} className={btnClass(o)}>{o}</button>)}
          </div>
        </div>
      )}

      {stage === 3 && (
        <div className="animate-bounce-in rounded-2xl border border-pink-300/40 bg-gradient-to-b from-[#2a1440] to-[#120a2a] p-5 text-center">
          <div className="text-4xl">💖</div>
          <div className="mt-1 text-sm font-black tracking-widest text-pink-200" dir="ltr">PERSONAL QUESTION • ALL ANSWERS OK!</div>
          <div className="mx-auto mt-3 max-w-md rounded-2xl bg-black/40 p-4" dir="ltr">
            <EnglishLine className="text-xl text-white">How often do YOU read? 📚</EnglishLine>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2" dir="ltr">
            {OPTIONS.map(o => <button key={o} onClick={() => choose(o)} className={btnClass(o)}>{o}</button>)}
          </div>
          {personalChoice && (
            <div className="animate-bounce-in mt-3 rounded-xl border border-emerald-300/50 bg-emerald-400/10 p-3">
              <EnglishLine className="text-lg text-emerald-100">I {personalChoice} read. 📚✨</EnglishLine>
              <div className="mt-1 text-sm font-bold text-emerald-200">جملتكِ الخاصة رائعة! 🌟</div>
            </div>
          )}
          {!personalChoice && <div className="mt-2 text-xs text-white/50">اختاري ما يناسبكِ — لا توجد إجابة خاطئة هنا!</div>}
        </div>
      )}

      <div className="flex justify-center gap-1.5" dir="ltr">
        {[0,1,2,3].map(i => <div key={i} className={`h-2 rounded-full ${i <= stage ? 'w-8 bg-cyan-300' : 'w-3 bg-white/15'}`} />)}
      </div>
    </div>
  );
}
