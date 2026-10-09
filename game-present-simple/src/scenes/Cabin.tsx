import { useEffect, useState } from 'react';
import { audio } from '../audio';
import { Girl, Bubble, BigButton, Announcer, RuleCard, useGirl } from '../components/ui';
import { ActivityRunner } from '../components/activities';
import { planeQuestions } from '../data';

type Phase = 'aisle' | 'sit' | 'belt' | 'remember' | 'takeoff' | 'learn' | 'landing' | 'landed';

/* Window view: runway → sky */
function WindowView({ mode }: { mode: 'ground' | 'takeoff' | 'sky' | 'landing' }) {
  return (
    <div className="absolute overflow-hidden rounded-[28%/22%]" style={{ left: '19.5%', top: '24%', width: '24%', height: '31%' }}>
      <div className={`absolute inset-0 transition-all ease-in-out ${mode === 'takeoff' ? 'duration-[5000ms]' : mode === 'landing' ? 'duration-[4000ms]' : 'duration-700'}`}
        style={{ transform: mode === 'ground' || mode === 'landing' ? 'translateY(0)' : 'translateY(-55%)', height: '220%' }}>
        {/* sky part */}
        <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-sky-500 via-sky-300 to-sky-100">
          <div className="absolute top-[30%] left-[10%] text-2xl anim-cloud-fast">☁️</div>
          <div className="absolute top-[55%] left-[40%] text-3xl anim-cloud-fast" style={{ animationDelay: '-4s' }}>☁️</div>
          <div className="absolute top-[70%] left-[0%] text-xl anim-cloud-fast" style={{ animationDelay: '-7s' }}>☁️</div>
        </div>
        {/* ground part */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-b from-sky-200 via-emerald-200 to-emerald-400">
          <div className={`absolute inset-x-[20%] bottom-0 top-[35%] bg-slate-500 ${mode === 'takeoff' ? 'anim-runway' : ''}`} style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 14px, #fde68a 14px 20px)', backgroundSize: '4px 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          <div className="absolute top-[12%] left-[10%] w-[80%] h-[18%] bg-slate-200 rounded-t-lg" />
        </div>
      </div>
    </div>
  );
}

export function CabinScene({ addScore, onDone }: { addScore: (n: number) => void; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>('aisle');
  const [belted, setBelted] = useState(false);
  const [ann, setAnn] = useState<string | null>(null);
  const [annSub, setAnnSub] = useState<string | undefined>();
  const girlSrc = useGirl();

  useEffect(() => {
    audio.ambience('cabin');
    audio.footsteps(8, 0.45);
    const t = setTimeout(() => setPhase('sit'), 4200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'sit') {
      const t = setTimeout(() => {
        setPhase('belt');
        setAnn('Welcome aboard!'); setAnnSub('Please fasten your seat belt.');
        audio.announce('Welcome aboard. Please fasten your seat belt.', undefined, { volume: 0.55 });
      }, 1200);
      return () => clearTimeout(t);
    }
    if (phase === 'remember') {
      // Quiet review – text only, no voice
      setAnn('Remember!'); setAnnSub('He / She / It → +s ⭐');
      audio.chime();
    }
    if (phase === 'takeoff') {
      setAnn('Prepare for takeoff.'); setAnnSub(undefined);
      audio.announce('Prepare for takeoff.', () => { audio.ambience('engine'); audio.takeoff(); }, { volume: 0.5, chime: false });
      const t = setTimeout(() => { audio.ambience('cabin'); setPhase('learn'); setAnn(null); }, 9000);
      return () => clearTimeout(t);
    }
    if (phase === 'landing') {
      setAnn('We are preparing to land.'); setAnnSub(undefined);
      audio.announce('We are preparing to land.', () => { audio.landing(); }, { volume: 0.5 });
      const t = setTimeout(() => { setPhase('landed'); setAnn('Welcome to your destination!'); audio.chime(); }, 7500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const windowMode = phase === 'takeoff' ? 'takeoff' : phase === 'learn' ? 'sky' : phase === 'landing' ? 'landing' : phase === 'landed' ? 'ground' : 'ground';

  /* ---- Aisle walk ---- */
  if (phase === 'aisle') {
    return (
      <div className="min-h-screen relative overflow-hidden bg-slate-800" style={{ backgroundImage: 'url(/schools-bridge-games/game-present-simple/img/cabin.jpg)', backgroundSize: 'cover', backgroundPosition: 'center bottom' }}>
        <div className="absolute inset-x-0 bottom-0 flex justify-center anim-walk-aisle" style={{ transformOrigin: 'bottom center' }}>
          <img src={girlSrc} alt="" className="h-[60vh] drop-shadow-2xl" draggable={false} />
        </div>
        <div className="absolute top-14 left-3 bg-[#0b1a3a] text-amber-300 font-black text-xs md:text-sm rounded-md px-3 py-1 border-2 border-amber-400/60 shadow" dir="ltr">✈️ PS AIRLINES · WELCOME ABOARD</div>
        <div className="absolute top-16 inset-x-0 flex flex-col items-center gap-2">
          <span className="bg-white/90 rounded-full px-4 py-1.5 font-black text-indigo-900 shadow">المحطة 3: داخل الطائرة ☁️</span>
          <Bubble className="text-base">تمشي في الممر إلى مقعدها 12A بجانب النافذة 🪟</Bubble>
        </div>
      </div>
    );
  }

  /* ---- Seat view ---- */
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-700" style={{ backgroundImage: 'url(/schools-bridge-games/game-present-simple/img/cabin.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* cabin stays visible behind everything, softly dimmed */}
      <div className="absolute inset-0 bg-slate-900/45" />
      {/* flight attendant walking gently in the aisle */}
      <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2 text-4xl md:text-5xl anim-bob opacity-90 pointer-events-none" style={{ animationDuration: '5s' }}>👩‍✈️</div>
      <div className="absolute top-14 left-3 z-10 bg-[#0b1a3a] text-amber-300 font-black text-xs md:text-sm rounded-md px-3 py-1 border-2 border-amber-400/60 shadow" dir="ltr">
        {phase === 'takeoff' ? '🔔 FASTEN SEAT BELT · TAKEOFF' : phase === 'landing' ? '🔔 FASTEN SEAT BELT · LANDING' : phase === 'learn' ? '☁️ CRUISING · 35,000 FT' : '🔔 FASTEN SEAT BELT'}
      </div>
      <div className="absolute top-2 inset-x-0 text-center pt-12 z-10">
        <span className="bg-white/90 rounded-full px-4 py-1.5 font-black text-indigo-900 shadow">المحطة 3: داخل الطائرة ☁️ · مقعد 12A</span>
      </div>
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center gap-4 p-3 pt-24 lg:pt-16">
        {/* Seat panel with fixed aspect so overlays align */}
        <div className={`relative w-full max-w-[380px] lg:max-w-[440px] shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-300 ${phase === 'takeoff' ? 'anim-rumble' : ''}`} style={{ aspectRatio: '3 / 4', backgroundImage: 'url(/schools-bridge-games/game-present-simple/img/seat.jpg)', backgroundSize: 'cover' }}>
          <WindowView mode={windowMode} />
          {/* Girl sitting in the seat (upper body) */}
          <div className={`absolute overflow-hidden ${phase === 'sit' ? 'anim-sit' : ''}`} style={{ left: '-4%', top: '22%', width: '42%', height: '56%' }}>
            <Girl bob={false} className="w-full" style={{ transform: 'scaleX(-1)' }} />
          </div>
          {/* Seat belt overlay */}
          {belted && <div className="absolute anim-pop" style={{ left: '4%', top: '72%', width: '30%' }}>
            <div className="h-4 rounded bg-slate-600 border border-slate-800 rotate-[18deg] shadow" />
          </div>}
          {phase === 'belt' && !belted && (
            <button onClick={() => { audio.seatbelt(); setBelted(true); }} className="absolute anim-pulse-ring bg-amber-300 text-indigo-950 font-black rounded-full px-4 py-2 border-2 border-amber-500 shadow-xl" style={{ left: '30%', top: '84%' }}>
              اربطي الحزام 🔒
            </button>
          )}
          {/* Seat screen overlay label */}
          {phase === 'learn' && <div className="absolute rounded-md bg-indigo-900 text-white text-[10px] md:text-xs font-bold flex items-center justify-center" style={{ left: '59%', top: '37%', width: '19%', height: '14%' }}>
            <span dir="ltr">PS ✈️ Lesson</span>
          </div>}
          {(phase === 'sit') && <Bubble className="absolute bottom-3 inset-x-3 text-base">وصلت إلى مقعدها بجانب النافذة، وضعت حقيبتها، وجلست 💺</Bubble>}
          {phase === 'takeoff' && <Bubble className="absolute bottom-3 inset-x-3 text-base">✈️ الطائرة تقلع… انظري من النافذة! ☁️</Bubble>}
          {phase === 'landing' && <Bubble className="absolute bottom-3 inset-x-3 text-base">🛬 نستعد للهبوط…</Bubble>}
        </div>

        {/* Right column: announcements, activities (seat-back screen) */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-4">
          {ann && phase !== 'learn' && <Announcer text={ann} ar={annSub} />}

          {phase === 'belt' && belted && (
            <div className="anim-pop text-center">
              <Bubble className="mb-3 text-emerald-700">✅ تم ربط الحزام! رحلة سعيدة</Bubble>
              <BigButton onClick={() => setPhase('remember')}>اضغطي للمتابعة ➜</BigButton>
            </div>
          )}

          {phase === 'remember' && (
            <div className="anim-pop bg-white/95 rounded-3xl p-5 shadow-2xl border-4 border-indigo-200 w-full">
              <RuleCard />
              <div className="text-center mt-4"><BigButton color="gold" onClick={() => setPhase('takeoff')}>جاهزة للإقلاع! ✈️</BigButton></div>
            </div>
          )}

          {phase === 'learn' && (
            <div className="w-full">
              {/* Seat-back screen frame */}
              <div className="bg-slate-800 rounded-3xl p-3 shadow-2xl border-4 border-slate-600">
                <div className="flex items-center justify-between text-slate-300 text-xs font-bold px-2 pb-2" dir="ltr">
                  <span>✈️ PS Airlines · Seat 12A</span><span>☁️ 35,000 ft</span>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 p-3">
                  <SeatLesson addScore={addScore} onFinish={() => setPhase('landing')} />
                </div>
              </div>
            </div>
          )}

          {phase === 'landed' && (
            <div className="anim-pop text-center">
              <Bubble className="mb-3">🛬 هبطت الطائرة بسلام! وصلنا 🎉</Bubble>
              <BigButton color="gold" onClick={() => { audio.stopAmbience(); onDone(); }}>اخرجي من الطائرة 🧳</BigButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SeatLesson({ addScore, onFinish }: { addScore: (n: number) => void; onFinish: () => void }) {
  const [step, setStep] = useState<'rule' | 'quiz'>('rule');
  if (step === 'rule') return (
    <div className="anim-pop">
      <div className="text-center text-indigo-900 font-black text-xl mb-3">📺 درس على شاشة المقعد</div>
      <RuleCard compact />
      <div dir="ltr" className="grid grid-cols-2 gap-3 mt-3 text-center text-2xl md:text-3xl font-black text-indigo-900">
        <div className="bg-white rounded-xl p-2">They <span className="text-teal-600">play</span>.</div>
        <div className="bg-white rounded-xl p-2">She <span className="text-teal-600">play<span className="text-rose-500 underline">s</span></span>.</div>
      </div>
      <div className="text-center mt-4"><BigButton onClick={() => setStep('quiz')}>ابدئي الأنشطة ✨</BigButton></div>
    </div>
  );
  return <ActivityRunner title="أنشطة الطائرة" questions={planeQuestions} onScore={addScore} onFinish={onFinish} />;
}
