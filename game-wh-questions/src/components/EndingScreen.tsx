import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { STATIONS } from '../data/content';
import { sound } from '../lib/sound';
import { cn } from '../utils/cn';
import { Astronaut, type Pose } from './art/Astronaut';
import { Robot } from './art/Robot';
import { Rocket } from './art/Rocket';
import { Earth } from './art/SpaceArt';
import { Ground, SpaceBackground } from './SpaceBackground';
import { Bubble, Confetti } from './ui';

type Phase = 'fly' | 'land' | 'exit' | 'wave' | 'party';

export function EndingScreen({
  topBar,
  name,
  skipIntro,
  onCertificate,
}: {
  topBar: ReactNode;
  name: string;
  skipIntro: boolean;
  onCertificate: () => void;
}) {
  const [ph, setPh] = useState<Phase>(skipIntro ? 'party' : 'fly');
  const [shown, setShown] = useState(skipIntro ? 6 : 0);

  useEffect(() => {
    if (skipIntro) return;
    sound.play('whoosh');
    const seq: [number, () => void][] = [
      [2100, () => setPh('land')],
      [3250, () => sound.play('land')],
      [3500, () => setPh('exit')],
      [4550, () => setPh('wave')],
      [5500, () => { setPh('party'); sound.play('celebrate'); }],
    ];
    const ids = seq.map(([t, f]) => window.setTimeout(f, t));
    return () => ids.forEach((id) => clearTimeout(id));
  }, [skipIntro]);

  useEffect(() => {
    if (ph !== 'party' || skipIntro) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setShown(n);
      sound.play('pop');
      if (n >= 6) {
        clearInterval(id);
        sound.play('star');
      }
    }, 320);
    return () => clearInterval(id);
  }, [ph, skipIntro]);

  const pose: Pose = ph === 'exit' ? 'walk' : ph === 'wave' ? 'wave' : ph === 'party' ? 'celebrate' : 'idle';

  return (
    <div className="screen-root">
      <SpaceBackground />
      {ph === 'fly' ? (
        <div className="return-earth" aria-hidden="true">
          <Earth />
        </div>
      ) : (
        <Ground kind="earth" />
      )}
      <div className="screen-col">
        {topBar}
        <div className="station-body">
          <section className="stage" aria-label="المشهد">
            <div className="stage-sky">
              <Robot mood={ph === 'party' ? 'happy' : 'normal'} className="stage-robot" />
              <Bubble text={ph === 'party' ? `🎉 رحلة رائعة يا ${name}!` : ph === 'fly' ? '🌍 نعود إلى الأرض...' : null} />
            </div>
            {ph === 'fly' ? (
              <div className="float-zone">
                <div className="stage-rocket rk-descend-slow">
                  <Rocket pilot flame />
                </div>
              </div>
            ) : (
              <div className="stage-floor">
                <div className={cn('stage-rocket', ph === 'land' && 'rk-descend-slow')}>
                  <Rocket flame={ph === 'land'} pilot={ph === 'land'} />
                </div>
                <div className={cn('stage-astro', ph === 'land' && 'is-hidden', ph === 'exit' && 'step-out')}>
                  <Astronaut pose={pose} />
                </div>
              </div>
            )}
          </section>

          <section className="panel-wrap">
            {ph !== 'party' ? (
              <div className="arrive-banner pop-in">🚀🌍 العودة إلى الأرض...</div>
            ) : (
              <div className="panel glass pop-in">
                <div className="finish-stars" aria-label="ست نجوم">
                  {Array.from({ length: 6 }, (_, k) => (
                    <span key={k} className={cn('finish-star', k < shown && 'on')}>
                      ⭐
                    </span>
                  ))}
                </div>
                <h2 className="finish-title">أحسنتِ يا {name}! 🚀✨</h2>
                <p className="finish-sub">أكملتِ رحلة الأسئلة الفضائية!</p>
                <div className="review-grid">
                  {STATIONS.map((s, k) => (
                    <div
                      key={s.key}
                      className="review-tile"
                      style={{ '--c': s.color, animationDelay: `${0.3 + k * 0.12}s` } as CSSProperties}
                    >
                      <span aria-hidden="true">{s.icon}</span>
                      <span className="review-word font-en" dir="ltr">
                        {s.upper}
                      </span>
                      <span aria-hidden="true">←</span>
                      <span>{s.category}</span>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-main btn-lg" onClick={onCertificate}>
                  استلمي شهادتكِ 🏆
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      <Confetti run={ph === 'party' && !skipIntro} />
    </div>
  );
}
