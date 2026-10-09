import { useEffect, useState } from 'react';
import { audio } from '../audio';
import { Scene, Girl, Bubble, BigButton, Announcer, RuleCard, Passport, StampScene, StampInfo } from '../components/ui';
import { AirportScreen, DeparturesBoard, LiveAirport, PronounGallery, Sign } from '../components/airport';
import { ActivityRunner } from '../components/activities';
import { airportQuestions } from '../data';

type Phase = 'enter' | 'welcome' | 'pronouns' | 'rule' | 'quiz' | 'control' | 'stamp' | 'gate' | 'boarding' | 'bridge';

export const STAMP_1: StampInfo = { text: 'Present Simple ✓', sub: 'READY TO FLY', color: '#0f766e', rot: -12 };

export function AirportScene({ name, stamps, addStamp, addScore, onDone }: { name: string; stamps: StampInfo[]; addStamp: (s: StampInfo) => void; addScore: (n: number) => void; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [ann, setAnn] = useState<string | null>(null);
  const [showMsg, setShowMsg] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    audio.ambience('airport');
    audio.wheels(2.5, 0.1);
    audio.footsteps(6, 0.35);
    const t = setTimeout(() => {
      setPhase('welcome');
      setAnn('Welcome to the world of Present Simple!');
      audio.announce('Good morning, dear traveler. Welcome to the world of Present Simple! We wish you a wonderful trip.', () => setShowMsg(true));
    }, 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'rule') {
      setAnn('Remember: with he, she, and it, add S to the verb.');
      audio.announce('Remember: with he, she, and it, add S to the verb.');
    }
    if (phase === 'boarding') {
      setAnn('Your flight is now boarding.');
      audio.announce('Attention please. Flight P S one zero one to Present Simple is now boarding at gate seven. Your flight is now boarding.', () => setGateOpen(true));
    }
    if (phase === 'bridge') {
      audio.footsteps(8, 0.4);
      audio.wheels(3, 0.06);
      const t = setTimeout(() => { audio.stopAmbience(); onDone(); }, 4200);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  const isControl = phase === 'control' || phase === 'stamp';
  const isGate = phase === 'gate' || phase === 'boarding';
  const bg = isControl ? '/schools-bridge-games/game-present-simple/img/passport-desk.jpg' : phase === 'bridge' ? '/schools-bridge-games/game-present-simple/img/jetbridge.jpg' : isGate ? '/schools-bridge-games/game-present-simple/img/airport.jpg' : '/schools-bridge-games/game-present-simple/img/departures.jpg';
  const label = isControl ? 'المحطة 2: Passport Control 🛂' : isGate ? 'المحطة 2: بوابة الصعود Gate 7 ✈️' : phase === 'bridge' ? 'الصعود إلى الطائرة ✈️' : 'المحطة 2: صالة المغادرة ✈️';

  return (
    <Scene bg={bg} overlay="from-indigo-950/45 via-transparent to-transparent">
      {!isControl && phase !== 'bridge' && <LiveAirport />}
      {/* Hanging signs make the place obvious */}
      <div className="absolute top-14 left-2 md:left-6 flex flex-col gap-1.5 z-10">
        {isControl ? <Sign arrow="🛂">PASSPORT CONTROL</Sign> : isGate ? <><Sign arrow="✈">GATE 7 · PS-101</Sign><Sign arrow="→">BOARDING</Sign></> : phase === 'bridge' ? <Sign arrow="✈">BOARDING · PS-101</Sign> : <><Sign>DEPARTURES</Sign><Sign arrow="↑">PASSPORT CONTROL</Sign><Sign arrow="→">GATES 1-10</Sign></>}
      </div>
      {!isControl && phase !== 'bridge' && <DeparturesBoard className="absolute top-14 right-2 md:right-6 w-52 md:w-72 z-10 hidden sm:block" />}

      {phase === 'stamp' && (
        <StampScene name={name} stamps={stamps} newStamp={STAMP_1} title="تم اجتياز المحطة! ✈️" onDone={() => { addStamp(STAMP_1); setPhase('gate'); }} />
      )}
      <div className="text-center mb-2 mt-1">
        <span className="bg-white/90 rounded-full px-4 py-1.5 font-black text-indigo-900 shadow">{label}</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-end justify-center gap-4 pt-8">
        {/* Girl standing on the floor */}
        <div className={`relative shrink-0 order-2 lg:order-1 self-end ${phase === 'enter' ? 'anim-slide-in' : ''} ${phase === 'bridge' ? 'anim-walk-away' : ''}`}>
          <Girl className="h-52 md:h-72 lg:h-96" />
          {phase === 'welcome' && showMsg && <Bubble className="absolute -top-6 -right-6 md:-right-16 text-base md:text-lg">مرحبًا بكِ في رحلتكِ مع Present Simple! ✈️</Bubble>}
          {phase === 'control' && <div className="absolute top-1/3 -right-10 rotate-12 w-16 h-20 rounded-md bg-gradient-to-br from-indigo-800 to-violet-900 border-2 border-amber-300 text-amber-200 text-[9px] font-black flex items-center justify-center text-center shadow-xl" dir="ltr">✈️<br />PASSPORT</div>}
          {phase === 'bridge' && <Bubble className="absolute -top-6 -right-10 text-base">مرحبًا! 👋</Bubble>}
        </div>

        <div className="w-full max-w-2xl order-1 lg:order-2 flex flex-col items-center gap-4 lg:self-center">
          {ann && (phase === 'welcome' || phase === 'rule' || phase === 'boarding') && <Announcer text={ann} />}

          {phase === 'welcome' && (
            <AirportScreen header="WELCOME ✈️" className="max-w-lg">
              <div dir="ltr" className="text-center text-2xl md:text-4xl font-black text-indigo-900">WELCOME TO<br /><span className="text-violet-600">PRESENT SIMPLE</span> ✈️</div>
              {showMsg && <div className="text-center mt-4 anim-pop"><BigButton color="gold" onClick={() => setPhase('pronouns')}>اضغطي للمتابعة ➜</BigButton></div>}
            </AirportScreen>
          )}

          {phase === 'pronouns' && (
            <AirportScreen header="INFORMATION · WHO DOES THE ACTION? 👀">
              <div className="text-center font-black text-indigo-900 text-lg md:text-xl mb-3">الضمائر: من يقوم بالفعل؟ 👀</div>
              <PronounGallery />
              <div className="flex justify-center gap-4 mt-3 text-sm font-black">
                <span className="text-teal-700">🟩 الفعل كما هو</span><span className="text-rose-600">🟥 نضيف s</span>
              </div>
              <div className="text-center mt-4"><BigButton onClick={() => setPhase('rule')}>التالي ➜</BigButton></div>
            </AirportScreen>
          )}

          {phase === 'rule' && (
            <AirportScreen header="FLIGHT INFORMATION · PRESENT SIMPLE ✈️">
              <RuleCard />
              <div dir="ltr" className="grid grid-cols-2 gap-3 mt-4 text-center">
                <div className="bg-white rounded-2xl p-3 border border-teal-200">
                  <div className="text-3xl md:text-4xl font-black text-indigo-900">I <span className="text-teal-600">play</span>.</div>
                  <div className="text-sm text-indigo-500 font-bold mt-1">We read. · They travel.</div>
                </div>
                <div className="bg-white rounded-2xl p-3 border border-rose-200">
                  <div className="text-3xl md:text-4xl font-black text-indigo-900">She <span className="text-teal-600">play<span className="text-rose-500 underline text-4xl md:text-5xl">s</span></span>.</div>
                  <div className="text-sm text-indigo-500 font-bold mt-1">He reads. · He travels.</div>
                </div>
              </div>
              <div dir="ltr" className="mt-4 mx-auto w-fit bg-[#0b1a3a] text-white rounded-xl px-5 py-2 text-center font-black">
                <div className="text-rose-300 text-lg">He • She • It</div>
                <div className="text-amber-300 text-3xl">S ⭐</div>
              </div>
              <div className="text-center mt-4"><BigButton onClick={() => setPhase('quiz')}>لنجرب! ✨</BigButton></div>
            </AirportScreen>
          )}

          {phase === 'quiz' && (
            <ActivityRunner title="أنشطة المطار" questions={airportQuestions} onScore={addScore} onFinish={() => setPhase('control')} />
          )}

          {phase === 'control' && (
            <div className="anim-pop flex flex-col items-center gap-3">
              <Bubble>موظفة الجوازات: أهلًا بكِ! جوازكِ من فضلك 🛂</Bubble>
              <Passport name={name} stamps={stamps} />
              <BigButton color="gold" onClick={() => setPhase('stamp')}>قدّمي الجواز 🛂</BigButton>
            </div>
          )}

          {isGate && (
            <div className="anim-pop flex flex-col items-center gap-3 w-full">
              {/* Gate screen */}
              <div dir="ltr" className="w-full max-w-md bg-[#0b1a3a] rounded-xl border-4 border-slate-600 p-3 text-center shadow-2xl">
                <div className="text-amber-300 font-black tracking-widest text-sm">GATE 7</div>
                <div className="text-white font-black text-xl">PS-101 → PRESENT SIMPLE</div>
                <div className={`font-black text-sm mt-1 ${phase === 'boarding' ? 'text-emerald-300 animate-pulse' : 'text-sky-300'}`}>{phase === 'boarding' ? 'NOW BOARDING' : 'ON TIME · 12A'}</div>
              </div>
              {/* Gate doors */}
              <div className="relative w-full max-w-md h-24 rounded-xl overflow-hidden border-4 border-slate-500 bg-cover bg-center" style={{ backgroundImage: 'url(/schools-bridge-games/game-present-simple/img/jetbridge.jpg)' }}>
                <div className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-slate-300 to-slate-200 border-r border-slate-400 ${gateOpen ? 'anim-gate-l' : ''}`} />
                <div className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-300 to-slate-200 border-l border-slate-400 ${gateOpen ? 'anim-gate-r' : ''}`} />
                {!gateOpen && <div className="absolute inset-0 flex items-center justify-center font-black text-slate-700 text-xl" dir="ltr">🚪 GATE 7</div>}
              </div>
              {/* Boarding pass */}
              <div dir="ltr" className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-indigo-200 flex">
                <div className="flex-1 p-3 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                  <div className="text-xs font-bold opacity-80">BOARDING PASS ✈️</div>
                  <div className="font-black text-lg truncate" dir="rtl">{name}</div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs font-bold">
                    <div><div className="opacity-70">FROM</div><div className="text-base">HOME</div></div>
                    <div><div className="opacity-70">TO</div><div className="text-base">PS ✓</div></div>
                    <div><div className="opacity-70">SEAT</div><div className="text-base">12A</div></div>
                  </div>
                </div>
                <div className="w-24 p-2 border-l-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-indigo-800">
                  <div className="text-xs font-bold">GATE</div><div className="text-3xl font-black">7</div>
                </div>
              </div>
              {phase === 'gate' && <BigButton onClick={() => setPhase('boarding')}>انتظري نداء الصعود 🎙️</BigButton>}
              {phase === 'boarding' && gateOpen && <BigButton color="gold" onClick={() => setPhase('bridge')}>البوابة مفتوحة! اصعدي الطائرة ✈️</BigButton>}
            </div>
          )}

          {phase === 'bridge' && <Bubble className="anim-pop">المضيفة: Welcome aboard! 👋 تفضّلي</Bubble>}
        </div>
      </div>
    </Scene>
  );
}
