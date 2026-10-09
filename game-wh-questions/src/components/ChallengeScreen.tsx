import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { byKey, CHALLENGE, type WhKey } from '../data/content';
import { shuffle } from '../lib/progress';
import { sound } from '../lib/sound';
import { cn } from '../utils/cn';
import { Astronaut } from './art/Astronaut';
import { Robot, type RobotMood } from './art/Robot';
import { ScenePicture } from './ScenePicture';
import { SpaceBackground } from './SpaceBackground';
import { Bubble, Confetti } from './ui';

const PRAISE = ['🎉 رائع!', '🌟 ممتاز!', '✨ أحسنتِ!', '💫 مبدعة!', '🚀 بطلة!'];

/** 5 quick visual review questions. How rotates in by random selection. */
export function ChallengeScreen({ topBar, onDone }: { topBar: ReactNode; onDone: () => void }) {
  const items = useMemo(
    () =>
      shuffle(CHALLENGE)
        .slice(0, 5)
        .map((it) => ({ ...it, options: shuffle(it.options) })),
    [],
  );
  const [i, setI] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<WhKey | null>(null);
  const [msg, setMsg] = useState<string | null>('🌌 خمسة أسئلة سريعة وسهلة!');
  const [mood, setMood] = useState<RobotMood>('talk');

  const it = items[i];
  const answer = byKey(it.key);
  const last = i === items.length - 1;

  const pick = (k: WhKey) => {
    if (solved) return;
    if (k === it.key) {
      setSolved(true);
      setMood('happy');
      setMsg(PRAISE[i % PRAISE.length]);
      sound.play('success');
    } else {
      const chosen = byKey(k);
      setWrong(k);
      setMood('talk');
      setMsg(`🤖💡 {${chosen.word}} = ${chosen.arShort} (${chosen.category}). جربي مرة أخرى!`);
      sound.play('error');
      window.setTimeout(() => setWrong((w) => (w === k ? null : w)), 650);
    }
  };

  const help = () => {
    sound.play('pop');
    setMood('talk');
    setMsg(`💡 فكري: أي كلمة تعني «${answer.ar}»؟`);
  };

  const next = () => {
    sound.play('click');
    if (!last) {
      setI(i + 1);
      setSolved(false);
      setMsg(null);
      setMood('normal');
    } else {
      sound.play('star');
      onDone();
    }
  };

  const [before, after] = it.q.split('___');

  return (
    <div className="screen-root">
      <SpaceBackground earth="far" satellite planets />
      <div className="screen-col">
        {topBar}
        <div className="station-body">
          <section className="stage" aria-label="المشهد">
            <div className="stage-sky">
              <Robot mood={mood} className="stage-robot" />
              <Bubble text={msg} />
            </div>
            <div className="float-zone">
              <Astronaut pose={solved ? 'celebrate' : 'float'} />
            </div>
          </section>

          <section className="panel-wrap">
            <div key={i} className="panel glass pop-in">
              <div className="ch-head">
                <h2 className="ch-title">التحدي الفضائي الأخير 🌌</h2>
                <div className="ch-dots">
                  {items.map((_, k) => (
                    <span key={k} className={cn('ch-dot', k < i && 'done', k === i && 'now')}>
                      {k < i || (k === i && solved) ? '⭐' : k + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ch-body">
                <ScenePicture name={it.scene} className="scene-challenge" />
                <div className="ch-text">
                  <span className="ch-badge">
                    {it.badge} {it.label}
                  </span>
                  <p className="ch-q font-en" dir="ltr">
                    {before}
                    <span
                      className={cn('ch-blank', solved && 'filled')}
                      style={solved ? { color: answer.color, borderColor: answer.color } : undefined}
                    >
                      {solved ? answer.word : '?'}
                    </span>
                    {after}
                  </p>
                  <p className="ch-a font-en" dir="ltr">
                    {it.a}
                  </p>
                </div>
              </div>
              {!solved && (
                <div className="act-head">
                  <span className="act-instruction">🪐 بأي كلمة نسأل؟</span>
                  <button type="button" className="btn-help" onClick={help}>
                    مساعدة 💡
                  </button>
                </div>
              )}
              <div className="ch-options">
                {it.options.map((k) => {
                  const st = byKey(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      className={cn(
                        'wh-orb',
                        wrong === k && 'is-wrong',
                        solved && k === it.key && 'is-right-orb',
                        solved && k !== it.key && 'is-dim',
                      )}
                      style={{ '--c': st.color, '--cd': st.deep } as CSSProperties}
                      onClick={() => pick(k)}
                    >
                      <span
                        className="wh-orb-ball font-en"
                        dir="ltr"
                        style={solved && k === it.key ? { boxShadow: '0 0 0 5px #22c55e, 0 0 34px rgba(34,197,94,.8)' } : undefined}
                      >
                        {st.word}
                      </span>
                    </button>
                  );
                })}
              </div>
              {solved && (
                <div className="ch-feedback pop-in">
                  <p className="ch-feedback-line">
                    <span dir="ltr" className="font-en" style={{ color: answer.color }}>
                      {answer.word}
                    </span>{' '}
                    = {answer.arShort} ← {answer.category} {answer.icon}
                  </p>
                  <button type="button" className="btn-main btn-lg" onClick={next}>
                    {last ? 'العودة إلى الأرض 🌍' : 'السؤال التالي ⏭'}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
      <Confetti run={solved && last} />
    </div>
  );
}
