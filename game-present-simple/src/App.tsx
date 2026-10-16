import { reportCompleted, reportCertificate, bridgeStudentName } from "./bridge";
import { MAX_SCORE } from "./data";
import { useCallback, useState } from 'react';
import { audio } from './audio';
import { Badge, StampInfo } from './components/ui';
import { StartScene } from './scenes/Start';
import { PackingScene } from './scenes/Packing';
import { AirportScene } from './scenes/Airport';
import { CabinScene } from './scenes/Cabin';
import { ArrivalScene } from './scenes/Arrival';
import { TransitScene } from './scenes/Transit';

type Stage = 'start' | 'packing' | 'airport' | 'cabin' | 'transit' | 'arrival';
const LEGACY_SAVE_KEY = 'ps-travel-adventure';

export default function App() {
  // Always greet the student identified by the bridge, never a previous local save.
  const [name, setName] = useState(bridgeStudentName());
  const [stage, setStage] = useState<Stage>('start');
  const [score, setScore] = useState(0);
  const [stamps, setStamps] = useState<StampInfo[]>([]);
  const [muted, setMuted] = useState(false);

  const addScore = useCallback((n: number) => setScore(s => s + n), []);
  const addStamp = useCallback((s: StampInfo) => setStamps(st => [...st, s]), []);
  const toggleMute = () => { const m = !muted; setMuted(m); audio.setMuted(m); };

  const start = (n: string) => {
    // Begin every new journey at the first stage, even with the same name.
    setName(n);
    setScore(0);
    setStamps([]);
    try { localStorage.removeItem(LEGACY_SAVE_KEY); } catch {}
    setStage('packing');
  };
  const restart = () => {
    audio.stopAmbience();
    setScore(0); setStamps([]); setStage('start');
    try { localStorage.removeItem(LEGACY_SAVE_KEY); } catch {}
  };
  const markCompleted = useCallback(() => {
    reportCompleted(score, MAX_SCORE);
  }, [score]);

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
