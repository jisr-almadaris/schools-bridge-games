import { useEffect, useState, type FormEvent } from 'react';
import type { Progress } from '../lib/progress';
import { sound } from '../lib/sound';
import { Astronaut } from './art/Astronaut';
import { Rocket } from './art/Rocket';
import { Ground, SpaceBackground } from './SpaceBackground';

export function StartScreen({
  progress,
  muted,
  onToggleMute,
  onStart,
  onContinue,
}: {
  progress: Progress;
  muted: boolean;
  onToggleMute: () => void;
  onStart: (name: string) => void;
  onContinue: () => void;
}) {
  const [name, setName] = useState(progress.name);
  const [err, setErr] = useState(false);
  const [wave, setWave] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => setWave((w) => !w), 2600);
    return () => clearInterval(id);
  }, []);

  const canContinue = progress.name.trim() !== '' && (progress.current > 0 || progress.challengeDone);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) {
      setErr(true);
      sound.play('error');
      window.setTimeout(() => setErr(false), 1800);
      return;
    }
    onStart(n);
  };

  return (
    <div className="screen-root">
      <SpaceBackground moon satellite planets />
      <Ground kind="earth" />

      <button type="button" className="icon-btn start-sound" onClick={onToggleMute} aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}>
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="start-crew" aria-hidden="true">
        <Astronaut pose={wave ? 'wave' : 'idle'} />
        <div>
          <Rocket />
          <div className="pad" />
        </div>
      </div>

      <div className="start-scroll">
        <form className={`start-card glass ${err ? 'is-wrong' : ''}`} onSubmit={submit} noValidate>
          <h1 className="initiative-title">
            <span className="gold-text">مبادرة جسر المدارس</span>
            <span aria-hidden="true">🌉</span>
          </h1>
          <p className="initiative-tagline">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</p>
          <div className="start-divider" aria-hidden="true">
            ✦
          </div>
          <h2 className="game-title">
            <span>🚀 «رحلة الأسئلة الفضائية»</span>
            <span dir="ltr" className="font-en game-title-en">
              WH Questions
            </span>
          </h2>
          <label htmlFor="student-name" className="name-label">
            اكتبي اسمكِ
          </label>
          <input
            id="student-name"
            className="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={28}
            placeholder="✍️ اسمكِ هنا"
            autoComplete="off"
          />
          {err && <p className="name-error pop-in">✍️ اكتبي اسمكِ أولًا يا بطلة!</p>}
          <button type="submit" className="btn-main btn-xl">
            انطلقي إلى الفضاء! 🚀
          </button>
          {canContinue && (
            <button type="button" className="btn-soft" onClick={onContinue}>
              {progress.challengeDone
                ? `🏆 شهادة ${progress.name}`
                : `⏩ أكملي رحلتكِ يا ${progress.name} (⭐ ${progress.stars}/6)`}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
