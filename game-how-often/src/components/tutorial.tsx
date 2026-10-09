import { useState } from 'react';
import { EnglishLine, Ltr } from './visuals';
import { sfx } from '../lib/audio';

export default function Tutorial({ name, onDone }: { name: string; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const next = () => { sfx.click(); if (step < 4) setStep(step + 1); else onDone(); };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex items-center justify-center gap-2" dir="ltr">
        {[0,1,2,3,4].map(i => (
          <div key={i} className={`h-2.5 rounded-full transition-all ${i <= step ? 'w-10 bg-gradient-to-r from-cyan-300 to-amber-300' : 'w-4 bg-white/15'}`} />
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-cyan-300/30 bg-gradient-to-b from-[#0e1a42] to-[#080f28] p-5 shadow-2xl sm:p-8">
        {step === 0 && (
          <div className="animate-bounce-in text-center">
            <div className="text-xs font-black tracking-widest text-amber-300" dir="ltr">LESSON 01 • WHAT DOES HOW OFTEN MEAN?</div>
            <div dir="ltr" className="font-en mx-auto mt-3 w-fit rounded-2xl border-2 border-cyan-300 bg-[#050b1e] px-6 py-3 text-3xl font-bold text-cyan-200 shadow-[0_0_30px_rgba(46,123,255,.5)] sm:text-4xl">HOW OFTEN?</div>
            <p className="mt-4 text-lg font-bold text-white">نسأل بها عن <span className="text-amber-300">تكرار حدوث الشيء</span></p>
            <p className="text-cyan-100/80">كم مرة؟ / ما مدى تكرار حدوث الشيء؟</p>
            <div className="mx-auto mt-4 max-w-md rounded-2xl border border-white/15 bg-black/30 p-4">
              <EnglishLine className="text-xl text-amber-200">How often do you walk in the park?</EnglishLine>
              <div className="mt-3 grid grid-cols-7 gap-1" dir="ltr">
                {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((d,i)=>(
                  <div key={d} className={`rounded-lg border p-1 text-center ${i%2===0?'border-emerald-300/60 bg-emerald-400/15':'border-white/10 bg-white/5'}`}>
                    <div className="text-[9px] font-black text-white/60">{d}</div>
                    <div className="text-lg">{i%2===0?'🚶‍♀️':'·'}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm font-bold text-emerald-300">HOW OFTEN? ← asks about frequency 🔁</div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-bounce-in">
            <div className="text-center text-xs font-black tracking-widest text-amber-300" dir="ltr">LESSON 02 • DO / DOES — قاعدة السؤال</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2" dir="ltr">
              <div className="rounded-2xl border-2 border-cyan-300 bg-cyan-400/10 p-4 text-center shadow-[0_0_25px_rgba(34,230,214,.3)]">
                <div className="font-en text-2xl font-black text-cyan-200">DO LINE ⚙️</div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {['I','YOU','WE','THEY'].map(p=><span key={p} className="font-en rounded-xl bg-cyan-300 px-3 py-1 font-black text-[#060d24]">{p}</span>)}
                </div>
                <EnglishLine className="mt-3 rounded-lg bg-black/40 p-2 text-[15px] text-cyan-100">How often DO you walk?</EnglishLine>
              </div>
              <div className="rounded-2xl border-2 border-fuchsia-400 bg-fuchsia-400/10 p-4 text-center shadow-[0_0_25px_rgba(232,121,249,.3)]">
                <div className="font-en text-2xl font-black text-fuchsia-200">DOES LINE ⚙️</div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {['HE','SHE','IT'].map(p=><span key={p} className="font-en rounded-xl bg-fuchsia-300 px-3 py-1 font-black text-[#060d24]">{p}</span>)}
                </div>
                <EnglishLine className="mt-3 rounded-lg bg-black/40 p-2 text-[15px] text-fuchsia-100">How often DOES she walk?</EnglishLine>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-3 text-center text-sm font-bold text-amber-100">
              <Ltr><span className="font-en">I / YOU / WE / THEY → DO</span></Ltr>
              <span className="mx-2">•</span>
              <Ltr><span className="font-en">HE / SHE / IT → DOES</span></Ltr>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-bounce-in text-center">
            <div className="text-xs font-black tracking-widest text-amber-300" dir="ltr">LESSON 03 • QUESTION FORMULA — تركيب السؤال</div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5" dir="ltr">
              {['HOW OFTEN','DO / DOES','SUBJECT','BASE VERB','EXTRA','?'].map((c,i)=>(
                <div key={c} className="animate-pop" style={{ animationDelay: `${i*0.12}s` }}>
                  <div className={`font-en rounded-xl border-2 px-3 py-2 text-sm font-black ${i===0?'border-amber-300 bg-amber-300/20 text-amber-200':i===5?'border-red-300 bg-red-400/20 text-red-200':'border-cyan-300 bg-cyan-400/15 text-cyan-100'}`}>{c}</div>
                  {i<5 && <span className="text-cyan-400">➜</span>}
                </div>
              ))}
            </div>
            <div className="mx-auto mt-4 max-w-lg space-y-2">
              <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 p-3"><EnglishLine className="text-lg text-emerald-100">How often do you walk in the park?</EnglishLine></div>
              <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 p-3"><EnglishLine className="text-lg text-emerald-100">How often does she play tennis?</EnglishLine></div>
              <div className="rounded-xl border border-red-300/40 bg-red-400/10 p-3 text-sm">
                <div className="flex items-center justify-center gap-2 font-bold" dir="ltr"><span className="font-en text-emerald-300">Does she play? ✓</span><span className="font-en text-red-300">Does she plays? ✕</span></div>
                <div className="mt-1 font-bold text-red-100">بعد DOES نستخدم الفعل الأساسي بدون s ⚠️</div>
                <div className="font-en text-xs text-white/60" dir="ltr">After DOES → BASE VERB</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-bounce-in text-center">
            <div className="text-xs font-black tracking-widest text-amber-300" dir="ltr">LESSON 04 • ANSWER FORMULA — تركيب الإجابة</div>
            <div className="mt-4 flex flex-wrap justify-center gap-2" dir="ltr">
              {['SUBJECT','FREQUENCY','VERB','EXTRA'].map((c)=>(
                <div key={c} className="font-en rounded-xl border-2 border-purple-300 bg-purple-400/15 px-4 py-2 font-black text-purple-100">{c}</div>
              ))}
            </div>
            <div className="my-2 text-purple-300" dir="ltr">▼</div>
            <div className="mx-auto max-w-lg space-y-2">
              <div className="rounded-xl bg-black/40 p-3"><EnglishLine className="text-lg text-amber-100">I <span className="rounded bg-amber-300 px-1 text-black">usually</span> walk after school.</EnglishLine></div>
              <div className="rounded-xl bg-black/40 p-3"><EnglishLine className="text-lg text-amber-100">She <span className="rounded bg-amber-300 px-1 text-black">sometimes</span> plays tennis.</EnglishLine></div>
            </div>
            <div className="mt-3 rounded-2xl border border-purple-300/40 bg-purple-400/10 p-3 font-bold text-purple-100">
              كلمة التكرار تأتي <span className="text-amber-300">قبل الفعل</span> غالبًا
              <div dir="ltr" className="font-en mt-1 text-sm text-white/70">Subject → Frequency Word → Verb</div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-bounce-in text-center">
            <div className="text-xs font-black tracking-widest text-amber-300" dir="ltr">LESSON 05 • FREQUENCY WORDS — دليل بصري فقط</div>
            <div className="mx-auto mt-4 max-w-md space-y-2" dir="ltr">
              {[
                { w: 'ALWAYS', p: 100, ar: 'دائمًا', c: 'from-emerald-400 to-emerald-500' },
                { w: 'USUALLY', p: 75, ar: 'عادةً', c: 'from-sky-400 to-blue-500' },
                { w: 'SOMETIMES', p: 40, ar: 'أحيانًا', c: 'from-amber-300 to-orange-400' },
                { w: 'RARELY', p: 10, ar: 'نادرًا', c: 'from-orange-400 to-red-400' },
                { w: 'NEVER', p: 0, ar: 'أبدًا', c: 'from-slate-400 to-slate-600' },
              ].map((r, i) => (
                <div key={r.w} className="animate-pop flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 p-2" style={{ animationDelay: `${i*0.1}s` }}>
                  <span className={`font-en w-28 rounded-lg bg-gradient-to-r ${r.c} px-2 py-1 text-sm font-black text-white`}>{r.w}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full bg-gradient-to-r ${r.c}`} style={{ width: `${r.p}%` }} /></div>
                  <span className="font-en w-10 text-xs font-bold text-white/70">{r.p}%</span>
                  <span className="w-14 text-sm font-bold text-amber-200">{r.ar}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-white/15 bg-white/5 p-2 text-xs font-bold text-white/70">النسب مجرد دليل بصري 👀 — اللعبة عن بناء الجمل وليس حفظ الأرقام!</div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-1 text-sm font-bold text-emerald-200">جاهزة يا {name || 'بطلتنا'}؟ لنُشغّل الوحدات! ⚡</div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs text-white/40" dir="ltr">{step + 1} / 5</div>
          <button onClick={next} className="group rounded-2xl bg-gradient-to-l from-amber-300 to-orange-400 px-8 py-3 font-black text-[#231303] shadow-[0_0_25px_rgba(245,197,66,.5)] transition hover:scale-105 active:scale-95">
            {step === 4 ? '⚡ افتحي المختبر!' : 'التالي ⬅'}
          </button>
        </div>
      </div>
    </div>
  );
}
