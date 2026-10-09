import { useEffect, useState } from 'react';
import { audio } from '../audio';
import { Scene, Girl, Bubble, BigButton, Passport, StampScene, StampInfo, INITIATIVE, SLOGAN } from '../components/ui';
import { ActivityRunner } from '../components/activities';
import { InkStamp, Sign } from '../components/airport';
import { finalQuestions, MAX_SCORE } from '../data';

type Phase = 'exit' | 'stamp' | 'challenge' | 'done' | 'certificate';
export const STAMP_2: StampInfo = { text: 'Journey Completed ✓', sub: 'PRESENT SIMPLE ✈️', color: '#be123c', rot: 8 };

export function ArrivalScene({ name, stamps, addStamp, addScore, score, onRestart, onFinished, onCertificate }: { name: string; stamps: StampInfo[]; addStamp: (s: StampInfo) => void; addScore: (n: number) => void; score: number; onRestart: () => void; onFinished: () => void; onCertificate: () => void }) {
  const [phase, setPhase] = useState<Phase>('exit');

  useEffect(() => {
    audio.ambience('airport');
    audio.wheels(2.5, 0.08);
    audio.footsteps(6, 0.35);
  }, []);
  useEffect(() => {
    if (phase === 'done') { audio.stopAmbience(); audio.celebrate(); onFinished(); }
  }, [phase, onFinished]);

  const pct = Math.round((score / MAX_SCORE) * 100);
  const date = new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  if (phase === 'certificate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-violet-800 to-sky-700 p-4 pt-16 print:p-0 print:bg-white print:pt-0">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <div id="certificate" dir="rtl" className="w-full bg-[#fffdf5] rounded-3xl shadow-2xl border-[10px] border-double border-amber-400 p-6 md:p-10 text-center relative overflow-hidden print:shadow-none print:rounded-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-sky-100 opacity-60" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-violet-100 opacity-60" />
            <div className="relative">
              <div className="text-2xl md:text-3xl font-black text-indigo-900">{INITIATIVE}</div>
              <div className="text-sm md:text-base font-bold text-indigo-600 mt-1">«{SLOGAN}»</div>
              <div className="my-4 h-1 w-40 mx-auto bg-gradient-to-l from-amber-300 via-amber-500 to-amber-300 rounded" />
              <h1 className="text-3xl md:text-5xl font-black text-violet-700">شهادة المسافرة المتميزة ✈️</h1>
              <p className="mt-5 text-lg md:text-xl font-bold text-indigo-800">تُمنح هذه الشهادة للطالبة:</p>
              <div className="mt-2 text-4xl md:text-5xl font-black text-indigo-950 border-b-4 border-amber-300 inline-block px-6 pb-1">{name}</div>
              <p className="mt-5 text-lg md:text-xl font-bold text-indigo-800">لإتمامها بنجاح مغامرة:</p>
              <div className="text-2xl md:text-3xl font-black text-violet-700 mt-1">«رحلتي مع <span dir="ltr">Present Simple</span>»</div>
              <p className="mt-3 text-base md:text-lg font-bold text-indigo-700">وإظهارها فهمًا مميزًا لقاعدة <span dir="ltr" className="text-violet-600">Present Simple</span> 🌟</p>
              <div className="flex flex-wrap justify-center gap-6 mt-6 text-indigo-900 font-black">
                <div className="bg-amber-50 rounded-2xl px-5 py-2 border border-amber-200">الدرجة: <span className="text-2xl text-emerald-700">{score} / {MAX_SCORE}</span> ({pct}%)</div>
                <div className="bg-sky-50 rounded-2xl px-5 py-2 border border-sky-200">التاريخ: {date}</div>
              </div>
              <div className="flex justify-center gap-3 mt-6" dir="ltr">
                {stamps.map((s, i) => <InkStamp key={i} text={s.text} sub={s.sub} color={s.color} rot={s.rot} size={0.9} />)}
              </div>
              <div className="mt-6 text-3xl">✈️ 🧳 🛂 🌉</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 print:hidden">
            <BigButton color="gold" onClick={() => window.print()}>طباعة الشهادة / حفظ PDF 🖨️</BigButton>
            <BigButton color="white" onClick={() => setPhase('done')}>رجوع ↩</BigButton>
            <BigButton color="teal" onClick={onRestart}>رحلة جديدة 🔁</BigButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Scene bg="/schools-bridge-games/game-present-simple/img/arrival.jpg" overlay="from-indigo-950/30 via-transparent to-transparent">
      {phase === 'stamp' && (
        <StampScene name={name} stamps={stamps} newStamp={STAMP_2} title="Present Simple Journey Completed ✓" onDone={() => { addStamp(STAMP_2); setPhase('challenge'); }} />
      )}
      <div className="absolute top-14 left-2 md:left-6 flex flex-col gap-1.5 z-10">
        <Sign arrow="🛬">ARRIVALS</Sign>
        <Sign arrow="🧳">BAGGAGE CLAIM · BELT 3</Sign>
      </div>
      {/* baggage carousel */}
      {phase !== 'done' && (
        <div className="absolute bottom-4 right-3 md:right-8 w-56 md:w-80 z-10 pointer-events-none">
          <div dir="ltr" className="text-[10px] md:text-xs font-black text-white bg-[#0b1a3a] w-fit px-2 py-0.5 rounded-t border border-amber-400/60">BELT 3 · PS-101</div>
          <div className="h-12 md:h-14 rounded-full border-4 border-slate-500 bg-slate-700 overflow-hidden relative anim-belt" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#334155 0 40px,#475569 40px 80px)' }}>
            <div className="absolute inset-0 flex items-center gap-6 md:gap-10 px-4 text-2xl md:text-3xl anim-walker-rev" style={{ animationDuration: '14s' }}>🧳 🎒 🧳 👜 🧳</div>
          </div>
        </div>
      )}
      <div className="text-center mb-2">
        <span className="bg-white/90 rounded-full px-4 py-1.5 font-black text-indigo-900 shadow">المحطة 5: الوصول Arrivals 🛬🎉</span>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row items-end justify-center gap-4">
        <div className={`relative shrink-0 self-end ${phase === 'exit' ? 'anim-slide-in' : ''}`}>
          <Girl className="h-56 md:h-80 lg:h-96" />
          {phase === 'done' && <div className="absolute -top-4 -left-4 text-5xl anim-bob">🎉</div>}
        </div>

        <div className="w-full max-w-2xl flex flex-col items-center gap-4 lg:self-center">
          {phase === 'exit' && (
            <div className="anim-pop flex flex-col items-center gap-3">
              <Bubble>وصلنا! 🛬 خرجت المسافرة بحقيبتها… بقي الختم الأخير في الجواز 🛂</Bubble>
              <BigButton color="gold" onClick={() => setPhase('stamp')}>الختم النهائي ✨</BigButton>
            </div>
          )}

          {phase === 'challenge' && (
            <>
              <Bubble className="text-base">تحدٍّ صغير قبل الاحتفال 🌟 خمسة أسئلة سهلة!</Bubble>
              <ActivityRunner title="التحدي النهائي" questions={finalQuestions} onScore={addScore} onFinish={() => setPhase('done')} />
            </>
          )}

          {phase === 'done' && (
            <div className="anim-pop bg-white/95 backdrop-blur rounded-3xl p-5 md:p-7 shadow-2xl border-4 border-amber-300 text-center w-full">
              <div className="text-3xl md:text-4xl font-black text-violet-700">وصلتِ بنجاح! ✈️🎉</div>
              <p className="mt-2 text-lg md:text-xl font-bold text-indigo-900">أحسنتِ يا {name}! أكملتِ رحلتكِ وتعلمتِ <span dir="ltr" className="text-violet-600">Present Simple</span>!</p>
              <div className="flex justify-center my-4"><Passport name={name} stamps={stamps} /></div>
              <div className="text-indigo-900 font-black">الدرجة: <span className="text-emerald-700 text-2xl">{score} / {MAX_SCORE}</span> ⭐</div>
              <div className="mt-4 bg-indigo-50 rounded-2xl p-3 border border-indigo-100">
                <div className="text-xl md:text-2xl font-black text-indigo-900">{INITIATIVE}</div>
                <div className="text-sm md:text-base font-bold text-indigo-600 mt-1">«{SLOGAN}»</div>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-5">
                <BigButton color="gold" onClick={() => { onCertificate(); setPhase('certificate'); }}>شهادة المسافرة المتميزة 🏅</BigButton>
                <BigButton color="white" onClick={onRestart}>رحلة جديدة 🔁</BigButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
}
