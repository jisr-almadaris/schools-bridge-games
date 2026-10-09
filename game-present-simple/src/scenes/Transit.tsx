import { useEffect, useState } from 'react';
import { audio } from '../audio';
import { Scene, Girl, Bubble, BigButton, Announcer, RuleCard } from '../components/ui';
import { AirportScreen, DeparturesBoard, LiveAirport, Sign } from '../components/airport';
import { ActivityRunner } from '../components/activities';
import { transitQuestions } from '../data';

type Phase = 'enter' | 'review' | 'quiz' | 'done';

export function TransitScene({ addScore, onDone }: { addScore: (n: number) => void; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('enter');

  useEffect(() => {
    audio.ambience('airport');
    audio.wheels(2, 0.08);
    audio.footsteps(5, 0.35);
    const t = setTimeout(() => {
      setPhase('review');
      audio.announce('Welcome to the transit lounge. Time for a quick practice!', undefined, { volume: 0.8 });
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <Scene bg="/schools-bridge-games/game-present-simple/img/airport.jpg" overlay="from-indigo-950/45 via-transparent to-transparent">
      <LiveAirport />
      <div className="absolute top-14 left-2 md:left-6 flex flex-col gap-1.5 z-10">
        <Sign arrow="🔁">TRANSIT LOUNGE</Sign>
        <Sign arrow="→">CONNECTING FLIGHTS</Sign>
      </div>
      <DeparturesBoard title="CONNECTIONS ✈️" className="absolute top-14 right-2 md:right-6 w-52 md:w-72 z-10 hidden sm:block" />

      <div className="text-center mb-2 mt-1">
        <span className="bg-white/90 rounded-full px-4 py-1.5 font-black text-indigo-900 shadow">المحطة 4: صالة الترانزيت 🛄 تدريب متنوّع</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-end justify-center gap-4 pt-8">
        <div className={`relative shrink-0 order-2 lg:order-1 self-end ${phase === 'enter' ? 'anim-slide-in' : ''}`}>
          <Girl className="h-52 md:h-72 lg:h-96" />
          {phase === 'review' && <Bubble className="absolute -top-6 -right-6 text-base">استراحة قصيرة… ونتدرّب قليلًا 💪</Bubble>}
          {phase === 'done' && <Bubble className="absolute -top-6 -right-6 text-base">جاهزة للرحلة الأخيرة! ✈️</Bubble>}
        </div>

        <div className="w-full max-w-2xl order-1 lg:order-2 flex flex-col items-center gap-4 lg:self-center">
          {phase === 'review' && (
            <>
              <Announcer text="Time for a quick practice!" ar="تدريب سريع ومتنوّع 🌟" />
              <AirportScreen header="TRANSIT · QUICK REVIEW ✈️">
                <RuleCard />
                <div dir="ltr" className="grid grid-cols-3 gap-2 mt-3 text-center text-lg md:text-xl font-black text-indigo-900">
                  <div className="bg-white rounded-xl p-2">We <span className="text-teal-600">go</span>.</div>
                  <div className="bg-white rounded-xl p-2">It rain<span className="text-rose-500 underline">s</span>.</div>
                  <div className="bg-white rounded-xl p-2">He read<span className="text-rose-500 underline">s</span>.</div>
                </div>
                <div className="text-center mt-4"><BigButton onClick={() => setPhase('quiz')}>ابدئي التدريب ✨</BigButton></div>
              </AirportScreen>
            </>
          )}

          {phase === 'quiz' && (
            <ActivityRunner title="تدريب الترانزيت" questions={transitQuestions} onScore={addScore} onFinish={() => { setPhase('done'); audio.chime(); }} />
          )}

          {phase === 'done' && (
            <div className="anim-pop flex flex-col items-center gap-3">
              <Bubble>أحسنتِ! 🌟 أنهيتِ التدريب. الرحلة الأخيرة إلى الوجهة ✈️</Bubble>
              <BigButton color="gold" onClick={() => { audio.stopAmbience(); onDone(); }}>إلى الوصول 🛬</BigButton>
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
}
