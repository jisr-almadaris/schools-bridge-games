import { reportCompleted, reportCertificate, bridgeStudentName } from "./bridge";
import { MAX_SCORE } from "./data";
import { useCallback, useEffect, useState } from 'react';
import { audio } from './audio';
import { Badge, StampInfo } from './components/ui';
import { StartScene } from './scenes/Start';
import { PackingScene } from './scenes/Packing';
import { AirportScene } from './scenes/Airport';
import { CabinScene } from './scenes/Cabin';
import { ArrivalScene } from './scenes/Arrival';
import { TransitScene } from './scenes/Transit';

type Stage = 'start' | 'packing' | 'airport' | 'cabin' | 'transit' | 'arrival';
const KEY = 'ps-travel-adventure';

interface Saved { name: string; stage: Stage; score: number; stamps: StampInfo[]; completed?: boolean }

function load(): Saved | null {
  try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}

export default function App() {
  const saved = load();
  const [name, setName] = useState(saved?.name ?? bridgeStudentName());
  const [stage, setStage] = useState<Stage>('start');
  const [score, setScore] = useState(saved?.score ?? 0);
  const [stamps, setStamps] = useState<StampInfo[]>(saved?.stamps ?? []);
  const [muted, setMuted] = useState(false);
  const [resumeAvailable] = useState(!!saved && saved.stage !== 'start' && !saved.completed);

  useEffect(() => {
    if (stage === 'start') return;
    try { localStorage.setItem(KEY, JSON.stringify({ name, stage, score, stamps } as Saved)); } catch {}
  }, [name, stage, score, stamps]);

  const addScore = useCallback((n: number) => setScore(s => s + n), []);
  const addStamp = useCallback((s: StampInfo) => setStamps(st => [...st, s]), []);
  const toggleMute = () => { const m = !muted; setMuted(m); audio.setMuted(m); };

  const start = (n: string) => {
    const resume = resumeAvailable && saved && saved.name === n;
    setName(n);
    if (resume) { setStage(saved!.stage); }
    else { setScore(0); setStamps([]); setStage('packing'); }
  };
  const restart = () => {
    audio.stopAmbience();
    setScore(0); setStamps([]); setStage('start');
    try { localStorage.removeItem(KEY); } catch {}
  };
  const markCompleted = useCallback(() => {
    reportCompleted(score, MAX_SCORE);
    try { localStorage.setItem(KEY, JSON.stringify({ ...(load() ?? { name, stage: 'arrival', score, stamps }), completed: true })); } catch {}
  }, [name, score, stamps]);

  const toAirport = useCallback(() => setStage('airport'), []);
  const toCabin = useCallback(() => setStage('cabin'), []);
  const toTransit = useCallback(() => setStage('transit'), []);
  const toArrival = useCallback(() => setStage('arrival'), []);

  return (
    <div dir="rtl" className="font-sans">
      {stage !== 'start' && <Badge muted={muted} onToggle={toggleMute} />}
      {stage === 'start' && <StartScene initialName={name} onStart={start} />}
      {stage === 'packing' && <PackingScene addScore={addScore} onDone={toAirport} />}
      {stage === 'airport' && <AirportScene name={name} stamps={stamps} addStamp={addStamp} addScore={addScore} onDone={toCabin} />}
      {stage === 'cabin' && <CabinScene addScore={addScore} onDone={toTransit} />}
      {stage === 'transit' && <TransitScene addScore={addScore} onDone={toArrival} />}
      {stage === 'arrival' && <ArrivalScene name={name} stamps={stamps} addStamp={addStamp} addScore={addScore} score={score} onRestart={restart} onFinished={markCompleted} onCertificate={() => reportCertificate(score, MAX_SCORE, "رحلتي – Present Simple")} />}
    </div>
  );
}
