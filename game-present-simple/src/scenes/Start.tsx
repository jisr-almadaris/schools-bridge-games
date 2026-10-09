import { useState } from 'react';
import { audio } from '../audio';
import { INITIATIVE, SLOGAN, Girl } from '../components/ui';
import { LiveAirport, Sign } from '../components/airport';

export function StartScene({ initialName, onStart }: { initialName: string; onStart: (name: string) => void }) {
  const [name, setName] = useState(initialName);
  const [err, setErr] = useState(false);
  const go = () => {
    if (!name.trim()) { setErr(true); audio.wrong(); return; }
    audio.init(); audio.click();
    onStart(name.trim());
  };
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundImage: 'url(/schools-bridge-games/game-present-simple/img/departures.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/35 via-transparent to-indigo-950/55" />
      <LiveAirport />
      {/* hanging airport signs */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 md:top-5 md:left-6">
        <Sign>DEPARTURES</Sign>
        <Sign arrow="↗">GATE 7</Sign>
      </div>
      <div className="absolute top-3 right-3 md:top-5 md:right-6"><Sign arrow="✈">PS AIRLINES · FLIGHT PS-101</Sign></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 pt-14 gap-4 text-center">
        <div className="anim-pop bg-white/95 backdrop-blur rounded-3xl px-6 py-5 shadow-2xl border-4 border-amber-300 max-w-2xl w-full">
          <h1 className="text-3xl md:text-5xl font-black text-indigo-900 leading-tight">{INITIATIVE}</h1>
          <p className="mt-3 text-base md:text-xl font-bold text-indigo-700">«{SLOGAN}»</p>
        </div>

        <div className="anim-pop flex flex-col md:flex-row items-end gap-4 md:gap-8" style={{ animationDelay: '.2s' }}>
          <div className="relative flex items-end gap-2">
            <Girl className="h-56 md:h-80" />
            {/* passport & boarding pass on the floor next to her */}
            <div className="hidden md:flex flex-col gap-1 mb-2 -ml-2">
              <div dir="ltr" className="w-24 bg-gradient-to-br from-indigo-800 to-violet-900 rounded-lg border-2 border-amber-300 text-amber-200 text-[10px] font-black p-2 rotate-[-8deg] shadow-xl">✈️ PASSPORT<br /><span className="text-[8px] opacity-80">Present Simple</span></div>
              <div dir="ltr" className="w-28 bg-white rounded-md border border-indigo-200 text-indigo-800 text-[9px] font-black p-1.5 rotate-[6deg] shadow-lg">BOARDING PASS<br />PS-101 · GATE 7 · 12A</div>
            </div>
          </div>
          <div className="bg-indigo-950/80 backdrop-blur rounded-3xl p-6 shadow-2xl border-2 border-indigo-300/40 max-w-md w-full">
            <h2 className="text-2xl md:text-4xl font-black text-white">«رحلتي مع <span className="text-amber-300" dir="ltr">Present Simple</span> ✈️🧳»</h2>
            <p dir="ltr" className="text-sky-200 font-bold text-lg mt-1">Present Simple Travel Adventure</p>
            <label className="block mt-5 text-white font-black text-xl">اكتبي اسمكِ 👧🏻</label>
            <input
              value={name}
              onChange={e => { setName(e.target.value); setErr(false); }}
              onKeyDown={e => e.key === 'Enter' && go()}
              placeholder="اسم المسافرة..."
              className={`mt-2 w-full rounded-2xl px-4 py-3 text-xl font-bold text-indigo-900 text-center outline-none border-4 ${err ? 'border-rose-400 anim-shake' : 'border-amber-300 focus:border-amber-400'}`}
            />
            {err && <div className="text-rose-300 font-bold mt-2">✋ اكتبي اسمكِ أولًا لتبدأ الرحلة</div>}
            <button onClick={go} className="mt-4 w-full bg-gradient-to-l from-amber-400 to-yellow-300 text-indigo-950 text-2xl font-black rounded-2xl py-4 shadow-[0_6px_0_0_#b45309] active:translate-y-1 active:shadow-none transition hover:brightness-105">
              ابدئي رحلتكِ ✈️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
