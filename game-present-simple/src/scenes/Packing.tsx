import { useEffect, useState } from 'react';
import { audio } from '../audio';
import { Scene, Girl, Bubble, BigButton } from '../components/ui';
import { ActivityRunner } from '../components/activities';
import { packingQuestions } from '../data';

const ITEMS = [
  { id: 'clothes', emoji: '👕', en: 'T-shirt', ar: 'قميص' },
  { id: 'book', emoji: '📘', en: 'Book', ar: 'كتاب' },
  { id: 'water', emoji: '🧴', en: 'Water bottle', ar: 'زجاجة ماء' },
  { id: 'glasses', emoji: '🕶️', en: 'Sunglasses', ar: 'نظارة' },
  { id: 'shoes', emoji: '👟', en: 'Shoes', ar: 'حذاء' },
  { id: 'passport', emoji: '🛂', en: 'Passport', ar: 'جواز سفر' },
];

const EXAMPLES = [
  { en: 'I go to school', key: 'every day', emoji: '🏫', ar: 'كل يوم' },
  { en: 'I play', key: 'every afternoon', emoji: '⚽', ar: 'كل عصر' },
  { en: 'I travel', key: 'every summer', emoji: '✈️', ar: 'كل صيف' },
];

type Phase = 'pack' | 'lesson' | 'quiz' | 'close' | 'leave';

export function PackingScene({ onDone, addScore }: { onDone: () => void; addScore: (n: number) => void }) {
  const [packed, setPacked] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>('pack');
  const [over, setOver] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const pack = (id: string) => {
    if (packed.includes(id)) return;
    audio.pop();
    setPacked(p => [...p, id]);
    setSelected(null);
  };
  const allPacked = packed.length === ITEMS.length;

  useEffect(() => {
    if (phase === 'close') {
      audio.zip();
      const t = setTimeout(() => { setPhase('leave'); audio.wheels(2.5); audio.footsteps(6, 0.35); }, 1400);
      return () => clearTimeout(t);
    }
    if (phase === 'leave') {
      const t = setTimeout(onDone, 3800);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <Scene bg="/schools-bridge-games/game-present-simple/img/room.jpg">
      {/* travel props pinned in the room */}
      <div className="absolute top-16 left-3 md:left-8 flex flex-col gap-2 pointer-events-none opacity-95">
        <div dir="ltr" className="bg-white rounded-md shadow-lg border border-indigo-200 px-3 py-1.5 rotate-[-6deg] text-[10px] md:text-xs font-black text-indigo-800">🎫 TICKET · PS-101 · GATE 7</div>
        <div dir="ltr" className="bg-gradient-to-br from-indigo-800 to-violet-900 rounded-md shadow-lg border border-amber-300 px-3 py-1.5 rotate-[4deg] text-[10px] md:text-xs font-black text-amber-200">✈️ PASSPORT</div>
        <div className="text-4xl md:text-5xl rotate-[-4deg]">🗺️</div>
      </div>
      {/* airport arrival transition */}
      {phase === 'leave' && (
        <div className="fixed inset-0 z-40 anim-wipe flex flex-col items-center justify-center gap-4" style={{ animationDelay: '1.2s', backgroundImage: 'url(/schools-bridge-games/game-present-simple/img/departures.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-indigo-950/40" />
          <div className="relative bg-[#0b1a3a] border-4 border-amber-400 rounded-2xl px-8 py-4 text-amber-300 font-black text-3xl md:text-5xl tracking-widest shadow-2xl anim-pop" style={{ animationDelay: '1.8s' }} dir="ltr">DEPARTURES ✈️</div>
          <div className="relative text-white font-black text-xl md:text-2xl anim-pop" style={{ animationDelay: '2.1s' }}>وصلنا إلى المطار! 🧳</div>
        </div>
      )}
      <div className="text-center mb-2">
        <span className="bg-white/90 rounded-full px-4 py-1.5 font-black text-indigo-900 shadow">المحطة 1: جهزي حقيبتكِ للرحلة 🧳</span>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-end justify-center gap-4">
        {/* Girl standing on the floor */}
        <div className={`relative shrink-0 self-end transition-all duration-[2500ms] ease-in-out ${phase === 'leave' ? 'translate-x-[-120vw]' : ''}`}>
          <Girl className="h-64 md:h-96" flip={phase === 'leave'} />
          {phase === 'close' && <Bubble className="absolute -top-8 -right-8 text-base">جاهزة! أغلق الحقيبة وآخذ الجواز 🛂</Bubble>}
          {phase === 'leave' && <Bubble className="absolute -top-8 -right-8 text-base">إلى المطار! ✈️</Bubble>}
        </div>

        {/* Main panel */}
        <div className="w-full max-w-2xl lg:self-center">
          {phase === 'pack' && (
            <div className="bg-white/90 backdrop-blur rounded-3xl p-4 md:p-6 shadow-2xl border-4 border-indigo-200">
              <div className="text-center text-xl md:text-2xl font-black text-indigo-900">اسحبي الأغراض إلى الحقيبة 🧳</div>
              <div className="text-center text-indigo-500 font-bold text-sm mt-1">(أو اضغطي على الغرض ثم على الحقيبة)</div>

              <div className="flex flex-wrap justify-center gap-3 mt-4" dir="rtl">
                {ITEMS.filter(i => !packed.includes(i.id)).map(i => (
                  <button
                    key={i.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('text/plain', i.id)}
                    onClick={() => { audio.click(); setSelected(selected === i.id ? null : i.id); }}
                    className={`cursor-grab active:cursor-grabbing flex flex-col items-center bg-indigo-50 rounded-2xl px-3 py-2 border-2 shadow hover:-translate-y-1 transition ${selected === i.id ? 'border-amber-400 ring-4 ring-amber-200 scale-110' : 'border-indigo-200'}`}
                  >
                    <span className="text-4xl md:text-5xl">{i.emoji}</span>
                    <span dir="ltr" className="text-base font-black text-indigo-900 mt-1">{i.en}</span>
                    <span className="text-[11px] font-bold text-indigo-500">{i.ar}</span>
                  </button>
                ))}
              </div>

              {/* Suitcase */}
              <div
                onDragOver={e => { e.preventDefault(); setOver(true); }}
                onDragLeave={() => setOver(false)}
                onDrop={e => { e.preventDefault(); setOver(false); pack(e.dataTransfer.getData('text/plain')); }}
                onClick={() => selected && pack(selected)}
                className={`mt-5 mx-auto w-full max-w-md rounded-3xl border-4 p-3 transition relative ${over || selected ? 'border-amber-400 bg-amber-50 scale-[1.02]' : 'border-teal-500 bg-teal-50'}`}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-t-xl bg-teal-600 border-4 border-teal-700 border-b-0" />
                <div className="rounded-2xl bg-gradient-to-b from-teal-200 to-teal-300 min-h-[120px] flex flex-wrap items-center justify-center gap-2 p-2 border-2 border-dashed border-teal-500">
                  {packed.length === 0 && <span className="text-teal-700 font-bold text-lg">🧳 الحقيبة فارغة… أضيفي الأغراض!</span>}
                  {packed.map(id => <span key={id} className="text-4xl anim-pop">{ITEMS.find(i => i.id === id)!.emoji}</span>)}
                </div>
                <div className="text-center font-black text-teal-800 mt-2">{packed.length} / {ITEMS.length}</div>
              </div>

              {allPacked && (
                <div className="text-center mt-4 anim-pop">
                  <BigButton color="gold" onClick={() => setPhase('lesson')}>الحقيبة جاهزة! التالي ➜</BigButton>
                </div>
              )}
            </div>
          )}

          {phase === 'lesson' && (
            <div className="bg-white/95 backdrop-blur rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-violet-200 anim-pop">
              <h2 className="text-center text-3xl md:text-4xl font-black text-violet-700" dir="ltr">Present Simple</h2>
              <div className="text-center text-indigo-900 font-black text-xl">المضارع البسيط</div>
              <p className="text-center mt-3 text-lg md:text-xl font-bold text-indigo-800">نستخدم <span className="text-violet-600" dir="ltr">Present Simple</span> عندما نتحدث عن أشياء نفعلها <span className="text-amber-600">عادةً</span> أو <span className="text-amber-600">تتكرر</span> 🔁</p>
              <div className="grid gap-3 mt-4">
                {EXAMPLES.map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gradient-to-l from-indigo-50 to-white rounded-2xl p-3 border-2 border-indigo-100 anim-pop" style={{ animationDelay: `${i * 0.2}s` }}>
                    <span className="text-5xl">{ex.emoji}</span>
                    <div dir="ltr" className="text-xl md:text-2xl font-black text-indigo-900">
                      {ex.en} <span className="bg-amber-200 text-amber-900 px-2 rounded-lg">{ex.key}</span>.
                    </div>
                    <span className="mr-auto text-indigo-500 font-bold text-sm">{ex.ar} 🔁</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-5"><BigButton onClick={() => setPhase('quiz')}>فهمت! لنجرب ✨</BigButton></div>
            </div>
          )}

          {phase === 'quiz' && (
            <ActivityRunner title="تمرين سريع" questions={packingQuestions} onScore={addScore} onFinish={() => setPhase('close')} />
          )}

          {(phase === 'close' || phase === 'leave') && (
            <div className="flex justify-center">
              <div className="anim-pop bg-white/90 rounded-3xl px-8 py-5 shadow-2xl border-4 border-teal-300 text-center">
                <div className="text-6xl">{phase === 'close' ? '🧳' : '🛂🧳'}</div>
                <div className="text-2xl font-black text-teal-800 mt-2">{phase === 'close' ? 'تُغلق الحقيبة… 🔒' : 'ننطلق إلى المطار! ✈️'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Scene>
  );
}
