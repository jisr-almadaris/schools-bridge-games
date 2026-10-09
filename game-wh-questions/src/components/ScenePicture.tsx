import type { CSSProperties, ReactNode } from 'react';
import type { SceneName } from '../data/content';
import { BigStar } from './art/SpaceArt';
import { Rocket } from './art/Rocket';

const LABELS: Record<SceneName, string> = {
  star: 'نجمة',
  rocket: 'صاروخ',
  school: 'سارة في المدرسة',
  home: 'ولد في المنزل',
  morning: 'الذهاب إلى المدرسة في الصباح',
  night: 'فتاة نائمة في الليل والقمر',
  teacher: 'معلمة',
  doctor: 'طبيب',
  happy: 'فتاة سعيدة لأنها فازت',
  rain: 'فتاة تحمل مظلة والمطر ينزل',
  bike: 'الذهاب إلى المدرسة بالدراجة',
  car: 'سيارة',
  gift: 'هدية',
  bus: 'حافلة المدرسة',
};

function E({
  children,
  s,
  l,
  r,
  t,
  b,
  cls = '',
  z,
}: {
  children: ReactNode;
  s: number;
  l?: number;
  r?: number;
  t?: number;
  b?: number;
  cls?: string;
  z?: number;
}) {
  const style: CSSProperties = { fontSize: `${s}cqw` };
  if (l !== undefined) style.left = `${l}%`;
  if (r !== undefined) style.right = `${r}%`;
  if (t !== undefined) style.top = `${t}%`;
  if (b !== undefined) style.bottom = `${b}%`;
  if (z !== undefined) style.zIndex = z;
  return (
    <span className={`emo ${cls}`} style={style} aria-hidden="true">
      {children}
    </span>
  );
}

const TWINKS = [
  { x: 10, y: 16 },
  { x: 84, y: 12 },
  { x: 18, y: 80 },
  { x: 88, y: 72 },
  { x: 50, y: 8 },
  { x: 70, y: 88 },
];
const DROPS = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 6.4 + Math.random() * 4) % 100,
  d: Math.random() * 1.2,
  t: 0.7 + Math.random() * 0.5,
}));
const BITS = Array.from({ length: 14 }, (_, i) => ({
  x: Math.random() * 100,
  d: Math.random() * 3,
  c: ['#fbbf24', '#f472b6', '#7c3aed', '#14b8a6', '#3b82f6'][i % 5],
}));

function Twinkles() {
  return (
    <>
      {TWINKS.map((t, i) => (
        <i key={i} className="sc-tw" style={{ left: `${t.x}%`, top: `${t.y}%`, animationDelay: `${i * 0.45}s` }} />
      ))}
    </>
  );
}

function renderScene(name: SceneName): ReactNode {
  switch (name) {
    case 'star':
      return (
        <>
          <div className="sc-bg sc-night" />
          <Twinkles />
          <div className="sc-center">
            <BigStar className="sc-bigstar" />
          </div>
        </>
      );
    case 'rocket':
      return (
        <>
          <div className="sc-bg sc-space" />
          <Twinkles />
          <div className="sc-center">
            <div className="sc-hover">
              <Rocket flame className="sc-rocket" />
            </div>
          </div>
        </>
      );
    case 'school':
      return (
        <>
          <div className="sc-bg sc-day" />
          <div className="sc-hillbg" />
          <E s={12} l={5} t={5} cls="sc-spin">☀️</E>
          <E s={12} r={8} t={8} cls="sc-drift">☁️</E>
          <E s={40} l={8} b={10}>🏫</E>
          <E s={10} l={24} t={12} cls="sc-bounce" z={3}>📍</E>
          <E s={26} r={13} b={8} cls="sc-bob">👧</E>
          <E s={11} r={5} b={9}>🎒</E>
        </>
      );
    case 'home':
      return (
        <>
          <div className="sc-bg sc-room" />
          <div className="sc-window" style={{ left: '7%', top: '9%', width: '28%', height: '34%' }}>
            <E s={8} l={8} t={18} cls="sc-drift">☁️</E>
          </div>
          <div className="sc-badge" style={{ right: '5%', top: '6%' }}>
            🏠
          </div>
          <E s={9} r={30} t={10}>🖼️</E>
          <div className="sc-floor" />
          <E s={46} l={24} b={4}>🛋️</E>
          <E s={21} l={37} b={24} z={2}>👦</E>
          <E s={15} r={4} b={6}>🪴</E>
          <E s={11} l={5} b={5}>🧸</E>
        </>
      );
    case 'morning':
      return (
        <>
          <div className="sc-bg sc-dawn" />
          <E s={30} l={35} b={16} cls="sc-rise">☀️</E>
          <div className="sc-hill h1" />
          <div className="sc-hill h2" />
          <E s={8} l={14} t={12} cls="sc-fly">🐦</E>
          <E s={6} r={24} t={20} cls="sc-fly d2">🐦</E>
          <E s={17} l={6} b={10} z={3}>🏫</E>
          <E s={22} r={20} b={6} z={3} cls="sc-bob">🧒</E>
          <E s={11} r={12} b={8} z={3}>🎒</E>
          <div className="sc-badge" style={{ right: '4%', top: '5%' }}>
            ⏰
          </div>
        </>
      );
    case 'night':
      return (
        <>
          <div className="sc-bg sc-nightroom" />
          <div className="sc-window night" style={{ left: '28%', top: '7%', width: '44%', height: '40%' }}>
            <E s={15} l={58} t={10}>🌙</E>
            <E s={5} l={12} t={20} cls="sc-twinkle">✨</E>
            <E s={4} l={28} t={62} cls="sc-twinkle d2">⭐</E>
            <E s={4} l={80} t={70} cls="sc-twinkle d3">✨</E>
          </div>
          <div className="sc-floor night" />
          <E s={46} l={27} b={3}>🛌</E>
          <E s={11} r={16} b={40} cls="sc-zzz">💤</E>
        </>
      );
    case 'teacher':
      return (
        <>
          <div className="sc-bg sc-class" />
          <div className="sc-board">
            <span className="font-en" dir="ltr">
              A B C
            </span>
            <span className="font-en" dir="ltr">
              1 2 3
            </span>
          </div>
          <div className="sc-floor wood" />
          <E s={44} r={6} b={2}>👩‍🏫</E>
          <E s={15} l={6} b={4}>📚</E>
          <E s={9} l={24} b={6}>✏️</E>
        </>
      );
    case 'doctor':
      return (
        <>
          <div className="sc-bg sc-clinic" />
          <div className="sc-cross" />
          <div className="sc-floor clinic" />
          <E s={46} l={28} b={2}>👨‍⚕️</E>
          <E s={15} r={6} b={8}>🩺</E>
          <E s={10} l={6} b={8}>💊</E>
        </>
      );
    case 'happy':
      return (
        <>
          <div className="sc-bg sc-party" />
          {BITS.map((b, i) => (
            <i key={i} className="sc-bit" style={{ left: `${b.x}%`, background: b.c, animationDelay: `${b.d}s` }} />
          ))}
          <E s={28} l={10} b={16} cls="sc-bob">🏆</E>
          <E s={36} r={12} b={12} cls="sc-bounce">😄</E>
          <E s={12} l={5} t={5}>🎉</E>
          <E s={12} r={5} t={5} cls="sc-flip">🎉</E>
        </>
      );
    case 'rain':
      return (
        <>
          <div className="sc-bg sc-rainy" />
          {DROPS.map((d, i) => (
            <i
              key={i}
              className="sc-drop"
              style={{ left: `${d.x}%`, animationDelay: `${d.d}s`, animationDuration: `${d.t}s` }}
            />
          ))}
          <E s={24} l={5} t={2} z={2}>🌧️</E>
          <E s={20} r={6} t={4} z={2}>☁️</E>
          <div className="sc-puddle" />
          <E s={40} l={30} b={30} z={3}>☂️</E>
          <E s={27} l={37} b={5} z={2}>👧</E>
        </>
      );
    case 'bike':
      return (
        <>
          <div className="sc-bg sc-day" />
          <E s={11} r={6} t={5} cls="sc-spin">☀️</E>
          <E s={10} l={30} t={8} cls="sc-drift">☁️</E>
          <E s={15} l={3} b={24}>🌳</E>
          <E s={22} l={14} b={24}>🏫</E>
          <E s={12} r={4} b={25}>🌳</E>
          <div className="sc-road" />
          <E s={30} r={14} b={5} z={3} cls="sc-ride">🚴</E>
        </>
      );
    case 'car':
    case 'bus':
      return (
        <>
          <div className="sc-bg sc-day" />
          <E s={11} l={6} t={5} cls="sc-spin">☀️</E>
          <E s={11} r={18} t={9} cls="sc-drift">☁️</E>
          <E s={15} l={4} b={24}>🌳</E>
          {name === 'bus' ? <E s={20} r={8} b={24}>🏫</E> : <E s={13} r={6} b={25}>🌳</E>}
          <div className="sc-road" />
          <E s={36} l={30} b={4} z={3} cls="sc-drive">
            {name === 'bus' ? '🚌' : '🚗'}
          </E>
        </>
      );
    case 'gift':
      return (
        <>
          <div className="sc-bg sc-lav" />
          <div className="sc-table" />
          <E s={40} l={30} b={17} cls="sc-bounce">🎁</E>
          <E s={9} l={14} t={16} cls="sc-twinkle">✨</E>
          <E s={8} r={14} t={22} cls="sc-twinkle d2">✨</E>
          <E s={7} r={24} b={62} cls="sc-twinkle d3">⭐</E>
        </>
      );
    default:
      return null;
  }
}

export function ScenePicture({ name, className = '' }: { name: SceneName; className?: string }) {
  return (
    <div className={`scene ${className}`} role="img" aria-label={LABELS[name]}>
      {renderScene(name)}
    </div>
  );
}
