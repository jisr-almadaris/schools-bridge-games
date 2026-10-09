import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { Station } from '../data/content';
import { shuffle, useTimers } from '../lib/progress';
import { sound } from '../lib/sound';
import { cn } from '../utils/cn';
import { BlankActivity, ChoiceActivity, DragActivity } from './activities';
import { Astronaut, type Pose } from './art/Astronaut';
import { Robot, type RobotMood } from './art/Robot';
import { Rocket } from './art/Rocket';
import { ScenePicture } from './ScenePicture';
import { Ground, SpaceBackground } from './SpaceBackground';
import { Bubble, Confetti, GlowStar, InfoPopup, RichText } from './ui';

type Phase = 'arrive' | 'learn' | 'activity' | 'done';

/**
 * ONE reusable template for all six planets:
 * arrive (land + step out) → short explanation + example → one activity → feedback + star.
 */
export function StationScreen({
  topBar,
  station: s,
  index,
  name,
  onEarn,
  onNext,
}: {
  topBar: ReactNode;
  station: Station;
  index: number;
  name: string;
  onEarn: () => void;
  onNext: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('arrive');
  const [step, setStep] = useState(0); // 0 rocket descending, 1 stepping out, 2 waving
  const [robotMsg, setRobotMsg] = useState<string | null>(null);
  const [mood, setMood] = useState<RobotMood>('normal');
  const [pointing, setPointing] = useState(false);
  const [cheer, setCheer] = useState(false);
  const [secret, setSecret] = useState(false);
  const later = useTimers();
  const choices = useMemo(() => shuffle(s.activity.choices), [s]);

  useEffect(() => {
    sound.play('whoosh');
    const ids = [
      window.setTimeout(() => {
        setStep(1);
        sound.play('land');
      }, 1100),
      window.setTimeout(() => setStep(2), 2200),
      window.setTimeout(() => {
        setPhase('learn');
        setMood('talk');
        setRobotMsg('✨ في النجمة المضيئة سرّ! اضغطيها');
      }, 3000),
    ];
    return () => ids.forEach((id) => clearTimeout(id));
  }, [s]);

  const pose: Pose =
    phase === 'arrive'
      ? step === 1
        ? 'walk'
        : step === 2
          ? 'wave'
          : 'idle'
      : phase === 'learn'
        ? 'point'
        : phase === 'done' || cheer
          ? 'celebrate'
          : pointing
            ? 'point'
            : 'idle';

  const startActivity = () => {
    sound.play('click');
    setPhase('activity');
    setRobotMsg(null);
    setMood('normal');
  };

  const onCorrect = () => {
    setCheer(true);
    setMood('happy');
    setRobotMsg(`🎉 أحسنتِ يا ${name}!`);
    sound.play('success');
    onEarn();
    later(() => {
      setPhase('done');
      sound.play('star');
    }, 1150);
  };

  const onWrong = () => {
    sound.play('error');
    setMood('talk');
    setRobotMsg(`🤖💡 ${s.wrongHint}`);
  };

  const onHelp = () => {
    sound.play('pop');
    setMood('talk');
    setRobotMsg(`💡 ${s.hint}`);
    setPointing(true);
    later(() => setPointing(false), 1800);
  };

  const openSecret = () => {
    sound.play('pop');
    setSecret(true);
  };

  const vars = { '--c': s.color, '--cd': s.deep } as CSSProperties;

  return (
    <div className="screen-root">
      <SpaceBackground earth={s.key === 'where' ? 'sky' : undefined} satellite={s.key === 'how'} />
      <Ground kind={s.key} />
      <div className="screen-col">
        {topBar}
        <div className="station-body">
          <section className="stage" aria-label="المشهد">
            <div className="stage-sky">
              <Robot mood={mood} className="stage-robot" />
              <Bubble text={robotMsg} />
              <GlowStar label="سر الكوكب 💡🪐" onClick={openSecret} />
            </div>
            <div className="stage-floor">
              <div className={cn('stage-rocket', phase === 'arrive' && step === 0 && 'rk-descend')}>
                <Rocket flame={phase === 'arrive' && step === 0} />
              </div>
              <div
                className={cn(
                  'stage-astro',
                  phase === 'arrive' && step === 0 && 'is-hidden',
                  phase === 'arrive' && step === 1 && 'step-out',
                )}
              >
                <Astronaut pose={pose} lowGravity={s.key === 'where'} />
              </div>
            </div>
          </section>

          <section className="panel-wrap" style={vars}>
            {phase === 'arrive' && (
              <div className="arrive-banner pop-in">
                {s.dot} مرحبًا بكِ في كوكب{' '}
                <span dir="ltr" className="font-en" style={{ color: s.color }}>
                  {s.upper}
                </span>
                {s.key === 'where' && <div>🌙 سطح القمر</div>}
              </div>
            )}

            {phase === 'learn' && (
              <div className="panel glass pop-in">
                <div className="wh-head">
                  <span className="wh-word font-en" dir="ltr">
                    {s.upper}
                  </span>
                  <span className="wh-ar">{s.ar}</span>
                </div>
                <p className="usage">
                  <span className="usage-icon" aria-hidden="true">
                    {s.usageIcon}
                  </span>{' '}
                  <RichText text={s.usage} color={s.color} />
                </p>
                {s.key === 'why' && (
                  <div className="why-visual">
                    <div className="why-stack">
                      <span className="why-chip w font-en" dir="ltr">
                        WHY
                      </span>
                      <span className="why-arrow" aria-hidden="true">
                        ↓
                      </span>
                      <span className="why-chip r">سبب 💡</span>
                    </div>
                    <div className="why-because font-en" dir="ltr">
                      Why → <b>Because</b>
                    </div>
                  </div>
                )}
                <div className="example">
                  <ScenePicture name={s.example.scene} className="scene-example" />
                  <div className="example-text">
                    <span className="example-tag">مثال ✨</span>
                    <p className="ex-q font-en" dir="ltr">
                      <RichText text={s.example.q} color={s.color} />
                    </p>
                    <p className="ex-a font-en" dir="ltr">
                      <RichText text={s.example.a} color={s.color} />
                    </p>
                    <p className="ex-note">
                      <RichText text={s.example.note} color={s.color} />
                    </p>
                  </div>
                </div>
                <button type="button" className="btn-main btn-lg" onClick={startActivity}>
                  هيا نلعب! 🎮
                </button>
              </div>
            )}

            {phase === 'activity' && (
              <div className="panel glass pop-in">
                <div className="act-head">
                  <span className="act-instruction">{s.activity.instruction}</span>
                  <button type="button" className="btn-help" onClick={onHelp}>
                    مساعدة 💡
                  </button>
                </div>
                <ScenePicture name={s.activity.scene} className="scene-activity" />
                <p className="act-q font-en" dir="ltr">
                  <RichText text={s.activity.q} color={s.color} />
                </p>
                {s.activity.kind === 'cards' || s.activity.kind === 'planets' || s.activity.kind === 'comets' ? (
                  <ChoiceActivity look={s.activity.kind} choices={choices} onCorrect={onCorrect} onWrong={onWrong} />
                ) : s.activity.kind === 'blank' ? (
                  <BlankActivity choices={choices} onCorrect={onCorrect} onWrong={onWrong} />
                ) : (
                  <DragActivity
                    token={s.activity.kind === 'dragStar' ? 'star' : 'rocket'}
                    choices={choices}
                    onCorrect={onCorrect}
                    onWrong={onWrong}
                  />
                )}
              </div>
            )}

            {phase === 'done' && (
              <div className="panel glass pop-in">
                <div className="earned-star" aria-hidden="true">
                  ⭐
                </div>
                <h3 className="done-title">{s.success.title}</h3>
                <p className="done-line">
                  <span dir="ltr" className="font-en" style={{ color: s.color }}>
                    {s.word}
                  </span>{' '}
                  = {s.arShort}
                </p>
                <p className="done-sub">{s.success.sub}</p>
                <p className="done-recap font-en" dir="ltr">
                  <RichText text={s.activity.recap} color={s.color} />
                </p>
                <p className="done-progress">
                  حصلتِ على نجمة! ⭐{' '}
                  <span dir="ltr" className="font-en">
                    {index + 1}/6
                  </span>
                </p>
                <button type="button" className="btn-main btn-lg" onClick={onNext}>
                  {index === 5 ? 'إلى التحدي الأخير 🌌' : 'إلى الكوكب التالي 🚀'}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {secret && (
        <InfoPopup icon="💡🪐" title="سر الكوكب" subtitle="معلومة فضائية 💫" lines={s.secret} onClose={() => setSecret(false)} />
      )}
      <Confetti run={phase === 'done'} />
    </div>
  );
}
