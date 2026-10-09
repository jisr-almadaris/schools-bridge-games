import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { sound } from '../lib/sound';
import { Astronaut } from './art/Astronaut';
import { Rocket } from './art/Rocket';
import { Moon, PlanetArt } from './art/SpaceArt';
import { SpaceBackground } from './SpaceBackground';

function toAr(n: number) {
  try {
    return n.toLocaleString('ar-EG');
  } catch {
    return String(n);
  }
}

function formatDates(d: Date) {
  let g = '';
  let h = '';
  try {
    g = new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch {
    g = d.toLocaleDateString();
  }
  try {
    h = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch {
    h = '';
  }
  return { g, h };
}

export function CertificateCard({ name, score, date }: { name: string; score: number; date: Date }) {
  const { g, h } = formatDates(date);
  return (
    <div className="cert">
      <div className="cert-deco rk" aria-hidden="true">
        <Rocket />
      </div>
      <div className="cert-deco pl" aria-hidden="true">
        <PlanetArt kind="what" />
      </div>
      <div className="cert-deco as" aria-hidden="true">
        <Astronaut pose="wave" />
      </div>
      <div className="cert-deco mo" aria-hidden="true">
        <Moon />
      </div>
      <span className="cert-deco st" style={{ left: '15cqw', top: '5cqw' }} aria-hidden="true">
        ⭐
      </span>
      <span className="cert-deco st" style={{ right: '15cqw', bottom: '6cqw' }} aria-hidden="true">
        ✨
      </span>
      <span className="cert-deco st" style={{ right: '16cqw', top: '14cqw' }} aria-hidden="true">
        ⭐
      </span>
      <div className="cert-inner">
        <div className="cert-initiative">مبادرة جسر المدارس 🌉</div>
        <div className="cert-tagline">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</div>
        <h1 className="cert-title">شهادة رائدة الأسئلة الفضائية 🚀✨</h1>
        <p className="cert-given">تُمنح للطالبة:</p>
        <p className="cert-name">{name || 'رائدة الفضاء'}</p>
        <p className="cert-for">لإتمامها بنجاح:</p>
        <p className="cert-game">
          «رحلة الأسئلة الفضائية –{' '}
          <span dir="ltr" className="font-en">
            WH Questions
          </span>
          »
        </p>
        <div className="cert-meta">
          <div className="cert-box">
            <span>الدرجة</span>
            <b>
              {toAr(score)} / {toAr(100)}
            </b>
            <small>⭐⭐⭐⭐⭐⭐</small>
          </div>
          <div className="cert-seal" aria-hidden="true">
            🏅
          </div>
          <div className="cert-box">
            <span>التاريخ</span>
            <b>{g}</b>
            {h && <small>{h}</small>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateScreen({
  topBar,
  name,
  score,
  date,
  onBack,
  onRestart,
}: {
  topBar: ReactNode;
  name: string;
  score: number;
  date: Date;
  onBack: () => void;
  onRestart: () => void;
}) {
  useEffect(() => {
    sound.play('celebrate');
  }, []);

  const print = () => {
    sound.play('click');
    try {
      window.print();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="screen-root">
      <SpaceBackground planets moon />
      <div className="screen-col">
        {topBar}
        <div className="cert-screen">
          <div className="cert-wrap pop-in">
            <CertificateCard name={name} score={score} date={date} />
          </div>
          <div className="cert-actions">
            <button type="button" className="btn-main btn-lg" onClick={print}>
              🖨️ طباعة الشهادة / حفظ PDF
            </button>
            <button type="button" className="btn-soft" onClick={onBack}>
              📋 المراجعة
            </button>
            <button type="button" className="btn-soft" onClick={onRestart}>
              🔄 رحلة جديدة
            </button>
          </div>
        </div>
      </div>
      {createPortal(
        <div id="print-cert">
          <CertificateCard name={name} score={score} date={date} />
        </div>,
        document.body,
      )}
    </div>
  );
}
