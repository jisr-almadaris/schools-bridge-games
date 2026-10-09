import { useEffect, useRef, useState, type ReactNode } from 'react';
import { sound } from '../lib/sound';
import { Astronaut } from './art/Astronaut';
import { Rocket } from './art/Rocket';
import { Earth } from './art/SpaceArt';
import { Ground, SpaceBackground } from './SpaceBackground';

type Phase = 'walk' | 'wave' | 'enter' | 'c3' | 'c2' | 'c1' | 'lift';

/** ~7s scripted scene: walk → wave → enter rocket → 3,2,1 → lift-off → Earth from afar */
export function LaunchScene({ topBar, onDone }: { topBar: ReactNode; onDone: () => void }) {
  const [ph, setPh] = useState<Phase>('walk');
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    const seq: [number, () => void][] = [
      [1700, () => setPh('wave')],
      [2500, () => setPh('enter')],
      [3100, () => { setPh('c3'); sound.play('beep'); }],
      [3700, () => { setPh('c2'); sound.play('beep'); }],
      [4300, () => { setPh('c1'); sound.play('beep'); }],
      [4900, () => { setPh('lift'); sound.play('go'); sound.play('launch'); }],
      [7000, () => doneRef.current()],
    ];
    const ids = seq.map(([t, f]) => window.setTimeout(f, t));
    return () => ids.forEach((id) => clearTimeout(id));
  }, []);

  const inRocket = ph === 'c3' || ph === 'c2' || ph === 'c1' || ph === 'lift';
  const lift = ph === 'lift';
  const count = ph === 'c3' ? '3' : ph === 'c2' ? '2' : ph === 'c1' ? '1' : null;

  return (
    <div className="screen-root launch">
      <SpaceBackground className={lift ? 'is-bright' : ''} />
      <div className={`launch-earth ${lift ? 'is-show' : ''}`}>
        <Earth />
      </div>

      <div className={`launch-world ${lift ? 'is-lift' : ''}`}>
        <Ground kind="earth" />
        <div
          className={`launch-astro ${ph === 'walk' ? 'walking' : ''} ${ph === 'enter' ? 'entering' : ''} ${inRocket ? 'gone' : ''}`}
        >
          <Astronaut pose={ph === 'walk' ? 'walk' : ph === 'wave' ? 'wave' : 'idle'} />
        </div>
      </div>

      <div className={`launch-rocket ${lift ? 'is-lift' : ''} ${ph === 'c1' || lift ? 'is-shake' : ''}`}>
        <Rocket pilot={inRocket} flame={ph === 'c1' || lift} />
        <div className="pad" />
      </div>

      <div className="screen-col">{topBar}</div>

      {count && (
        <div key={count} className="countdown" aria-live="assertive">
          {count}
        </div>
      )}
      {lift && <div className="countdown liftoff">🚀 إطلاق!</div>}

      <button type="button" className="btn-soft skip-btn" onClick={() => doneRef.current()}>
        تخطي ⏭
      </button>
    </div>
  );
}
