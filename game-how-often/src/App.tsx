import { reportCertificate, bridgeStudentName } from "./bridge";
import { useEffect, useRef, useState } from 'react';
import { FreqBot, Gear, Girl, InitiativeBadge, MachineShell, PowerUpOverlay, TopBar } from './components/visuals';
import Tutorial from './components/tutorial';
import Unit1 from './components/unit1';
import Unit2 from './components/unit2';
import Unit3 from './components/unit3';
import Unit4 from './components/unit4';
import MasterMode, { MasterLock } from './components/master';
import Certificate, { Manual } from './components/certificate';
import { sfx, startMusic, stopMusic, setMuted } from './lib/audio';

type Phase = 'start' | 'gate' | 'dark' | 'boot' | 'welcome' | 'tutorial' | 'lab' | 'masterLock' | 'master' | 'printing' | 'certificate';

const CODE = [6, 2, 8, 4];
const UNIT_CHIP = [6, 2, 8, 4];
const UNIT_POWER = [25, 50, 75, 100];
const UNIT_NAMES = ['PRONOUN TURBINE', 'QUESTION ASSEMBLER', 'FREQUENCY SCANNER', 'SENTENCE ENGINE'];
const UNIT_ICONS = ['⚙️🌀', '🔧🧩', '🔍📡', '🏗️🔥'];
const UNIT_AR = ['توربين الضمائر', 'مركّب الأسئلة', 'ماسح التكرار', 'محرك الجمل'];

export default function App() {
  const [phase, setPhase] = useState<Phase>(() => {
    const p = (localStorage.getItem('hm_phase') as Phase) || 'start';
    if (p === 'boot') return 'dark';
    if (p === 'printing') return 'master';
    if (p === 'gate') return 'start';
    return p;
  });
  const [name, setName] = useState(() => localStorage.getItem('hm_name') || bridgeStudentName());
  const [power, setPower] = useState(() => Number(localStorage.getItem('hm_power') || 0));
  const [chips, setChips] = useState<(number | null)[]>(() => {
    try { return JSON.parse(localStorage.getItem('hm_chips') || '[null,null,null,null]'); } catch { return [null, null, null, null]; }
  });
  const [doneUnits, setDoneUnits] = useState<boolean[]>(() => {
    try { return JSON.parse(localStorage.getItem('hm_done') || '[false,false,false,false]'); } catch { return [false, false, false, false]; }
  });
  const [activeUnit, setActiveUnit] = useState(() => {
    try {
      const d: boolean[] = JSON.parse(localStorage.getItem('hm_done') || '[false,false,false,false]');
      const idx = d.findIndex(x => !x);
      return idx === -1 ? 4 : idx + 1;
    } catch { return 1; }
  });
  const [muted, setM] = useState(false);
  const [manual, setManual] = useState(false);
  const [overlay, setOverlay] = useState<{ text: string; sub?: string } | null>(null);
  const [gateOpen, setGateOpen] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [rumbling, setRumbling] = useState(false);
  const [girlAction, setGirlAction] = useState<'idle' | 'walk' | 'press' | 'pull' | 'happy' | 'wow' | 'place'>('idle');
  const [printStep, setPrintStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    localStorage.setItem('hm_phase', phase);
    localStorage.setItem('hm_name', name);
    localStorage.setItem('hm_power', String(power));
    localStorage.setItem('hm_chips', JSON.stringify(chips));
    localStorage.setItem('hm_done', JSON.stringify(doneUnits));
  }, [phase, name, power, chips, doneUnits]);

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const toggleMute = () => {
    const m = !muted;
    setM(m); setMuted(m);
    if (!m && (phase === 'lab' || phase === 'master')) startMusic(phase === 'master');
  };

  const startGame = () => {
    if (!name.trim()) { sfx.error(); return; }
    sfx.unlock(); sfx.click(); sfx.steam();
    setPhase('gate'); setGirlAction('walk');
    startMusic(false);
  };

  const openGate = () => {
    sfx.clank(); sfx.gear();
    setGateOpen(true); setGirlAction('walk');
    later(() => { sfx.steam(); setPhase('dark'); setGirlAction('idle'); }, 2000);
  };

  const activate = () => {
    sfx.click(); setGirlAction('press');
    setPhase('boot'); setBootStep(0); setRumbling(true);
    later(() => { sfx.clank(); setBootStep(1); }, 600);
    later(() => { sfx.clank(); setBootStep(2); }, 1400);
    later(() => { sfx.whirr(); setBootStep(3); }, 2100);
    later(() => { sfx.zap(); sfx.steam(); setBootStep(4); setRumbling(false); setGirlAction('wow'); }, 3200);
    later(() => { setPhase('welcome'); sfx.beep(); setGirlAction('happy'); }, 4400);
  };

  const completeUnit = (idx: number) => {
    const chip = UNIT_CHIP[idx];
    const pw = UNIT_POWER[idx];
    sfx.powerup();
    setOverlay({ text: 'POWER UP!', sub: idx === 0 ? 'TURBINE ACTIVATED! 🌀' : idx === 1 ? 'QUESTIONS ONLINE! 🧩' : idx === 2 ? 'SCANNER ONLINE! 📡' : 'ENGINE ONLINE! 🔥' });
    setRumbling(true);
    later(() => {
      setOverlay(null); setRumbling(false);
      setChips(c => { const n = [...c]; n[idx] = chip; return n; });
      setPower(pw);
      setDoneUnits(d => { const n = [...d]; n[idx] = true; return n; });
      setGirlAction('happy'); sfx.cheer();
      if (idx < 3) {
        setOverlay({ text: `CORE ${pw}% ⚡`, sub: `Power Chip [${chip}] earned! 💎` });
        later(() => { setOverlay(null); setActiveUnit(idx + 2); }, 2200);
      } else {
        // go to master lock drama
        setOverlay({ text: 'CORE 100% ⚡', sub: 'FULL CORE… wait — something is happening?! 🚨' });
        later(() => {
          setOverlay(null);
          sfx.alarm();
          setPhase('masterLock');
        }, 2600);
      }
    }, 2100);
  };

  const unlockMaster = () => {
    sfx.lock();
    setOverlay({ text: 'ACCESS GRANTED', sub: 'MASTER MODE UNLOCKED 🔓⚡' });
    startMusic(true);
    later(() => { setOverlay(null); setPhase('master'); }, 2200);
  };

  const winMaster = () => {
    sfx.core(); sfx.cheer();
    setOverlay({ text: 'FULL POWER!', sub: 'كل الآلة تعمل معًا!!! ⚙️⚡💎' });
    setRumbling(true);
    setGirlAction('happy');
    later(() => { setOverlay(null); setRumbling(false); setPhase('printing'); setPrintStep(0); runPrint(); }, 2400);
  };

  const runPrint = () => {
    sfx.whirr();
    later(() => { setPrintStep(1); sfx.gear(); }, 1200);
    later(() => { setPrintStep(2); sfx.clank(); }, 2600);
    later(() => { setPrintStep(3); sfx.cheer(); sfx.powerup(); }, 3800);
    later(() => { reportCertificate(5, 5, 'آلة العادات العجيبة'); setPhase('certificate'); stopMusic(); startMusic(false); }, 4800);
  };

  const restart = () => {
    ['hm_phase','hm_name','hm_power','hm_chips','hm_done'].forEach(key => localStorage.removeItem(key));
    setName(''); setPower(0); setChips([null, null, null, null]); setDoneUnits([false, false, false, false]);
    setActiveUnit(1); setPhase('start'); setGateOpen(false); setBootStep(0); stopMusic();
  };

  const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div dir="rtl" className="min-h-screen bg-[#050b1e] text-white">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#16245c_0%,#050b1e_60%)]" />
        <div className="absolute inset-0 opacity-[.12]" style={{ backgroundImage: 'linear-gradient(rgba(46,123,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(46,123,255,.5) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
        <div className="animate-grad absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-blue-500 via-cyan-300 via-fuchsia-400 to-amber-300" />
      </div>

      {(phase === 'lab' || phase === 'masterLock' || phase === 'master' || phase === 'printing' || phase === 'certificate') && (
        <TopBar name={name} power={phase === 'certificate' ? 100 : power} chips={chips} muted={muted} onMute={toggleMute} onManual={() => setManual(true)} />
      )}

      <div className="relative z-10 mx-auto max-w-6xl px-3 pb-16 pt-4 sm:px-5">
        {/* ================= START ================= */}
        {phase === 'start' && (
          <div className="mx-auto max-w-2xl text-center">
            <InitiativeBadge />
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-cyan-100/85">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</p>

            <div className="relative mt-4 overflow-hidden rounded-[28px] border border-cyan-300/30 bg-gradient-to-b from-[#0d1a45] to-[#070d26] p-6 shadow-[0_0_70px_rgba(46,123,255,.35)] sm:p-10">
              <div className="absolute -left-6 top-6 opacity-60"><Gear size={90} color="#2e7bff" slow /></div>
              <div className="absolute -right-6 bottom-10 opacity-60"><Gear size={70} color="#8b5cf6" reverse /></div>
              <div className="absolute left-1/2 top-2 flex gap-2" dir="ltr">
                {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="h-2 w-2 rounded-full bg-emerald-400 animate-blink" style={{ animationDelay: `${i * 0.25}s` }} />)}
              </div>
              <div className="relative">
                <div className="animate-floaty text-7xl">⚙️⚡</div>
                <h1 className="font-display mt-2 text-4xl font-black leading-tight sm:text-5xl">
                  <span className="bg-gradient-to-l from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent">آلة العادات العجيبة</span>
                </h1>
                <div className="font-en mt-1 text-xl font-bold tracking-[.25em] text-cyan-200" dir="ltr">THE HABIT MACHINE</div>
                <p className="mt-3 text-lg font-bold text-white">«اضبطي التكرار… ركّبي الجملة… وشغّلي الآلة! ⚡»</p>

                <div className="mx-auto mt-5 flex max-w-sm items-center justify-center gap-4">
                  <div className="animate-floaty2 text-6xl">👧</div>
                  <div className="animate-floaty text-5xl">🤖</div>
                </div>

                <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-white/15 bg-black/40 p-4">
                  <label className="text-sm font-bold text-cyan-100">«اكتبي اسمكِ» ✏️</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="مثال: لينا"
                    className="mt-2 w-full rounded-xl border-2 border-cyan-300/50 bg-[#0a1430] px-4 py-3 text-center text-xl font-black text-white outline-none placeholder:text-white/25 focus:border-amber-300"
                    maxLength={20}
                  />
                  <button onClick={startGame} className="mt-3 w-full rounded-2xl bg-gradient-to-l from-amber-300 via-orange-300 to-amber-300 px-6 py-4 text-xl font-black text-[#2a1500] shadow-[0_0_35px_rgba(245,197,66,.55)] transition hover:scale-[1.02] active:scale-95">
                    <span dir="ltr" className="font-en">⚡ START THE MACHINE</span>
                    <span className="block text-sm">«تشغيل الآلة»</span>
                  </button>
                  <button onClick={() => setM(!muted)} className="mt-2 text-xs text-white/50">{muted ? '🔇 كتم الصوت' : '🔊 الصوت يعمل — اضغطي للكتم'}</button>
                </div>

                <div className="font-en mx-auto mt-4 flex w-fit flex-wrap justify-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-[10px] font-bold text-white/50" dir="ltr">
                  {['DO', 'DOES', 'HOW OFTEN', 'ALWAYS', 'USUALLY', 'SOMETIMES', 'RARELY', 'NEVER'].map(w => <span key={w} className="rounded bg-white/10 px-2 py-0.5">{w}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= GATE ================= */}
        {phase === 'gate' && (
          <div className="mx-auto max-w-3xl text-center">
            <InitiativeBadge compact />
            <h2 className="font-display mt-2 text-2xl font-black">بوابة المختبر المعدنية الضخمة 🚪⚙️</h2>
            <div className="relative mt-4 h-[340px] overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#101c44] to-[#05081c]">
              <div className={`absolute inset-y-0 left-0 w-1/2 border-r-4 border-amber-300/60 bg-gradient-to-r from-[#2a3358] via-[#3a4670] to-[#232c52] ${gateOpen ? 'gate-left-open' : ''}`}>
                <div className="flex h-full flex-col items-center justify-center gap-2 text-white/30" dir="ltr">
                  <span className="text-5xl">⚙️</span><span className="font-en font-black tracking-widest">HABIT</span>
                  <div className="flex gap-1">{[0, 1, 2].map(i => <div key={i} className="h-3 w-3 rounded-full bg-amber-300/60" />)}</div>
                </div>
              </div>
              <div className={`absolute inset-y-0 right-0 w-1/2 border-l-4 border-amber-300/60 bg-gradient-to-l from-[#2a3358] via-[#3a4670] to-[#232c52] ${gateOpen ? 'gate-right-open' : ''}`}>
                <div className="flex h-full flex-col items-center justify-center gap-2 text-white/30" dir="ltr">
                  <span className="text-5xl">⚙️</span><span className="font-en font-black tracking-widest">LAB</span>
                  <div className="flex gap-1">{[0, 1, 2].map(i => <div key={i} className="h-3 w-3 rounded-full bg-cyan-300/60" />)}</div>
                </div>
              </div>
              {!gateOpen && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Girl action="walk" label={`${name} تقترب…`} />
                  <button onClick={openGate} className="animate-marquee mt-4 rounded-2xl bg-gradient-to-l from-amber-300 to-orange-400 px-8 py-3 font-black text-black">🚪 افتحي البوابة!</button>
                </div>
              )}
              {gateOpen && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl">💨✨</div>
                  <div className="font-bold text-cyan-200">البوابة تُفتح… المختبر ينتظر!</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= DARK ================= */}
        {phase === 'dark' && (
          <div className="mx-auto max-w-3xl">
            <MachineShell power={0} active={false} coreLit={false}>
              <div className="py-8 text-center">
                <div className="font-en mx-auto w-fit rounded-2xl border-2 border-red-400/60 bg-black px-8 py-4" dir="ltr">
                  <div className="font-en text-2xl font-black tracking-widest text-red-300 animate-flicker">HABIT MACHINE</div>
                  <div className="font-en mt-1 text-sm font-bold text-white/60">POWER: 0% 💤</div>
                </div>
                <div className="mt-4 flex justify-center opacity-40"><Girl action="idle" label="الآلة مظلمة ومتوقفة…" /></div>
                <div className="mx-auto mt-3 flex max-w-xs justify-center gap-2 opacity-30" dir="ltr">
                  {[0, 1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-lg bg-white/10" />)}
                </div>
                <button onClick={activate} className="animate-marquee mx-auto mt-6 flex items-center gap-2 rounded-2xl bg-gradient-to-l from-amber-300 to-orange-400 px-10 py-4 text-2xl font-black text-black transition hover:scale-105 active:scale-95">
                  ⚡ ACTIVATE
                </button>
                <div className="mt-2 text-sm text-white/50">اضغطي الزر لتشغيل الآلة!</div>
              </div>
            </MachineShell>
          </div>
        )}

        {/* ================= BOOT ================= */}
        {phase === 'boot' && (
          <div className="mx-auto max-w-3xl">
            <MachineShell power={bootStep >= 4 ? 5 : 0} active={bootStep >= 3} rumbling={rumbling} coreLit={false}>
              <div className="py-6 text-center">
                <div className="font-en mx-auto w-fit rounded-2xl border-2 border-cyan-300 bg-black px-8 py-4" dir="ltr">
                  <div className="font-en text-2xl font-black tracking-widest text-cyan-200">HABIT MACHINE</div>
                  <div className="font-en mt-1 text-sm font-bold text-amber-300">
                    {bootStep === 0 && 'CLICK… 🔘'}
                    {bootStep === 1 && 'CLANK… 🔩'}
                    {bootStep === 2 && 'CLANK… WHIRRR… ⚙️'}
                    {bootStep === 3 && 'WHIRRR… ZAP! ⚡'}
                    {bootStep >= 4 && 'SYSTEMS ONLINE… CORE DARK 💎🌑'}
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-center gap-6">
                  <Girl action={bootStep >= 4 ? 'wow' : 'press'} label={bootStep >= 4 ? 'واو! 😲' : 'تضغط الزر…'} />
                  <div className="flex gap-2" dir="ltr">
                    <span className={`text-4xl ${bootStep >= 1 ? 'animate-spin-med inline-block' : 'opacity-20'}`}>⚙️</span>
                    <span className={`text-4xl ${bootStep >= 2 ? 'animate-spin-turbine inline-block' : 'opacity-20'}`}>⚙️</span>
                    <span className={`text-4xl ${bootStep >= 3 ? 'animate-glow' : 'opacity-20'}`}>💡</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-2" dir="ltr">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-4 w-10 rounded-full border ${bootStep >= 2 + (i > 2 ? 1 : 0) && i < bootStep + 1 ? 'border-emerald-300 bg-emerald-400/40 animate-glow' : 'border-white/15 bg-white/5'}`} />
                  ))}
                </div>
                {bootStep >= 4 && <div className="mt-3 text-sm font-bold text-white/60">الأجزاء تضيء… لكن الـCORE الرئيسي ما زال مظلمًا 🌑</div>}
              </div>
            </MachineShell>
          </div>
        )}

        {/* ================= WELCOME ================= */}
        {phase === 'welcome' && (
          <div className="mx-auto max-w-2xl">
            <MachineShell power={5} active rumbling={false} coreLit={false}>
              <div className="flex flex-col items-center gap-4 py-4 sm:flex-row sm:items-start">
                <Girl action="happy" label={name} />
                <div className="flex-1">
                  <FreqBot mood="cheer" message={<><span dir="ltr" className="font-en font-black text-amber-200">🤖 “Welcome, {name || 'superstar'}!”</span><br />«قبل أن نُشغّل الآلة… يجب أن تتعلّمي لغتها!» ⚙️✨</>} />
                  <button onClick={() => { sfx.click(); setPhase('tutorial'); }} className="mt-4 w-full rounded-2xl bg-gradient-to-l from-cyan-300 to-blue-400 px-6 py-3.5 font-black text-[#04122e] shadow-xl transition hover:scale-[1.02] active:scale-95">📚 افتحي لوحة التعليم!</button>
                </div>
              </div>
            </MachineShell>
          </div>
        )}

        {/* ================= TUTORIAL ================= */}
        {phase === 'tutorial' && (
          <div>
            <div className="mb-3 flex items-center justify-center gap-3">
              <Girl action="place" label="تتعلّم…" />
              <FreqBot small message={<>سأشرح لكِ بسرعة ثم نلعب! 📚</>} mood="happy" />
            </div>
            <Tutorial name={name} onDone={() => { sfx.powerup(); setPhase('lab'); }} />
          </div>
        )}

        {/* ================= LAB ================= */}
        {phase === 'lab' && (
          <div className="space-y-4">
            {/* hero machine strip */}
            <MachineShell power={power} active rumbling={rumbling}>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <div className="flex items-center gap-3">
                  <Girl action={girlAction} label={name} />
                  <div className="relative">
                    <div className={`flex h-28 w-28 items-center justify-center rounded-full border-4 text-5xl ${power >= 100 ? 'animate-core border-amber-300 bg-[radial-gradient(circle,#f5c542_0%,#ff7a1a_35%,#2e7bff_70%)]' : power > 0 ? 'animate-core border-cyan-300 bg-[radial-gradient(circle,#22e6d6_0%,#2e7bff_45%,#0a1430_75%)]' : 'border-white/15 bg-white/5'}`}>
                      {power >= 100 ? '💎' : power > 0 ? '⚡' : '🌑'}
                    </div>
                    <div className="font-en mt-1 text-center text-xs font-black text-cyan-200" dir="ltr">HABIT CORE {power}%</div>
                    {/* orbiting energy balls */}
                    {power > 0 && <div className="animate-spin-slow2 absolute -inset-3"><div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,197,66,1)]" /></div>}
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4" dir="ltr">
                  {UNIT_NAMES.map((u, i) => {
                    const unlocked = i === 0 || doneUnits[i - 1];
                    const done = doneUnits[i];
                    const isActive = activeUnit === i + 1;
                    return (
                      <button key={u} disabled={!unlocked} onClick={() => { sfx.click(); setActiveUnit(i + 1); }}
                        className={`rounded-2xl border-2 p-2.5 text-center transition ${done ? 'border-emerald-300 bg-emerald-400/15' : isActive ? 'animate-marquee border-amber-300 bg-amber-300/10' : unlocked ? 'border-cyan-300/50 bg-white/5 hover:bg-white/10' : 'border-white/10 bg-black/30 opacity-40'}`}>
                        <div className="text-2xl">{done ? '✅' : unlocked ? UNIT_ICONS[i] : '🔐'}</div>
                        <div className="font-en text-[10px] font-black text-white">{u}</div>
                        <div className="text-[11px] font-bold text-cyan-200">{UNIT_AR[i]}</div>
                        <div className="font-en mt-0.5 text-[10px] font-bold text-amber-200" dir="ltr">{done ? `CHIP ${UNIT_CHIP[i]} ✓` : unlocked ? '+25% • CHIP ?' : 'LOCKED'}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </MachineShell>

            {/* active unit panel */}
            <div className="overflow-hidden rounded-3xl border border-cyan-300/30 bg-gradient-to-b from-[#0c173c] to-[#070d24] p-3 shadow-2xl sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{UNIT_ICONS[activeUnit - 1]}</span>
                  <div>
                    <div className="font-en text-sm font-black tracking-widest text-cyan-200" dir="ltr">UNIT {activeUnit} • {UNIT_NAMES[activeUnit - 1]}</div>
                    <div className="text-sm font-bold text-white">{UNIT_AR[activeUnit - 1]}</div>
                  </div>
                </div>
                {doneUnits[activeUnit - 1]
                  ? <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-200">مكتملة ✅ Chip {UNIT_CHIP[activeUnit - 1]} 💎</span>
                  : <span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-black text-amber-200">CORE → {UNIT_POWER[activeUnit - 1]}% ⚡</span>}
              </div>

              {doneUnits[activeUnit - 1] ? (
                <div className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-6 text-center">
                  <div className="text-4xl">✅⚙️</div>
                  <div className="mt-2 font-black text-emerald-200">هذه الوحدة مكتملة! انتقلي للوحدة التالية 👇</div>
                  {activeUnit < 4 && !doneUnits[activeUnit] && (
                    <button onClick={() => { sfx.click(); setActiveUnit(activeUnit + 1); }} className="mt-3 rounded-2xl bg-gradient-to-l from-emerald-300 to-cyan-300 px-8 py-3 font-black text-black">التالي: {UNIT_AR[activeUnit]} ⬅</button>
                  )}
                </div>
              ) : (
                <>
                  {activeUnit === 1 && <Unit1 onComplete={() => completeUnit(0)} />}
                  {activeUnit === 2 && <Unit2 onComplete={() => completeUnit(1)} />}
                  {activeUnit === 3 && <Unit3 onComplete={() => completeUnit(2)} />}
                  {activeUnit === 4 && <Unit4 onComplete={() => completeUnit(3)} />}
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= MASTER LOCK ================= */}
        {phase === 'masterLock' && (
          <div className="animate-alarm rounded-3xl p-1">
            <div className="mx-auto max-w-2xl rounded-3xl border border-red-400/40 bg-[#0a0f2a] p-4">
              <div className="flex items-center justify-center gap-2 font-black text-red-300"><span className="animate-blink">🚨</span> BEEP! BEEP! — التروس توقفت فجأة! <span className="animate-blink">🚨</span></div>
              <div className="font-en mx-auto mt-2 w-fit rounded-xl bg-black px-6 py-2 text-center" dir="ltr">
                <div className="font-en text-xl font-black text-cyan-200">CORE 100%</div>
                <div className="font-en text-xs font-black tracking-widest text-amber-300">MASTER MODE 🔐 LOCKED</div>
              </div>
              <div className="mt-2 text-center text-sm text-white/70">تحرّك جزء من الجدار… ظهرت غرفة تحكم سرية! ليست إنقاذًا — بل <b className="text-amber-300">BONUS FINAL MODE 🎁</b></div>
              <div className="mt-3"><MasterLock code={CODE} onUnlock={unlockMaster} /></div>
            </div>
          </div>
        )}

        {/* ================= MASTER ================= */}
        {phase === 'master' && (
          <div className="space-y-3">
            <MachineShell power={100} active rumbling={rumbling}>
              <div className="flex items-center justify-between">
                <div className="font-en text-sm font-black tracking-widest text-amber-300" dir="ltr">🔓 SECRET CONTROL ROOM • MASTER MODE</div>
                <Girl action="happy" label="وضع الماستر!" />
              </div>
            </MachineShell>
            <div className="rounded-3xl border border-amber-300/40 bg-gradient-to-b from-[#141032] to-[#070d24] p-3 sm:p-5">
              <MasterMode onWin={winMaster} />
            </div>
          </div>
        )}

        {/* ================= PRINTING ================= */}
        {phase === 'printing' && (
          <div className="mx-auto max-w-2xl text-center">
            <MachineShell power={100} active rumbling>
              <div className="py-6">
                <div className="font-en text-sm font-black tracking-widest text-amber-300" dir="ltr">🏆 CERTIFICATE PRODUCTION… WHIRRR…</div>
                {/* rollers */}
                <div className="mx-auto mt-4 max-w-md rounded-2xl bg-black/50 p-4" dir="ltr">
                  <div className="flex items-center justify-between text-3xl">
                    <span className="animate-spin-turbine inline-block">🛞</span>
                    <div className="relative h-20 flex-1 overflow-hidden rounded-lg border border-amber-300/50 bg-[#0d1430]">
                      <div className={`absolute top-2 bottom-2 w-40 rounded border-2 border-[#f5c542] bg-gradient-to-b from-[#1a2350] to-[#0d1430] transition-all duration-1000 ${printStep >= 1 ? 'left-1/2 -translate-x-1/2' : 'left-[-160px]'}`}>
                        <div className="pt-2 text-xl">🏆</div>
                        <div className="font-en text-[9px] font-black text-amber-200">FREQUENCY MASTER</div>
                        {printStep >= 2 && <div className="animate-bounce-in mx-auto mt-1 w-fit rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-black text-white">CLANK! ✓ ختم!</div>}
                      </div>
                    </div>
                    <span className="animate-spin-turbine inline-block">🛞</span>
                  </div>
                  <div className="font-en mt-2 text-xs text-white/50">{printStep === 0 ? 'WHIRRR… paper entering rollers…' : printStep === 1 ? 'PRINTING… ✨' : printStep === 2 ? 'STAMPING… CLANK!' : 'DONE! 🎉'}</div>
                </div>
                <FreqBot small mood="cheer" message={<>الآلة تطبع شهادتكِ الفاخرة… لحظة واحدة! ✨</>} />
              </div>
            </MachineShell>
          </div>
        )}

        {/* ================= CERTIFICATE ================= */}
        {phase === 'certificate' && (
          <div>
            <div className="mb-4 text-center">
              <InitiativeBadge />
              <p className="mx-auto mt-1 max-w-xl text-xs text-cyan-100/70">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</p>
              <h2 className="font-display mt-2 text-3xl font-black text-amber-300">🎉 FULL POWER! أحسنتِ يا {name}! 🎉</h2>
            </div>
            <Certificate name={name} date={today} onRestart={restart} />
          </div>
        )}
      </div>

      {manual && <Manual onClose={() => { sfx.click(); setManual(false); }} />}
      {overlay && <PowerUpOverlay text={overlay.text} sub={overlay.sub} />}

      {/* footer */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 py-3 text-center text-[11px] text-white/40">
        🌉 مبادرة جسر المدارس • ⚙️⚡ آلة العادات العجيبة — THE HABIT MACHINE • صُنعت بحب للبطلات الصغيرات 💖
      </div>
    </div>
  );
}
