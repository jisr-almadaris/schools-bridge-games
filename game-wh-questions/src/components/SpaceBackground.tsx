import type { WhKey } from '../data/content';
import { Bulb, ClockTower, Crystal, Earth, GearArt, Moon, PlanetArt, Satellite } from './art/SpaceArt';

const STARS = Array.from({ length: 64 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  s: 1 + Math.random() * 2.4,
  d: Math.random() * 5,
  t: 2.2 + Math.random() * 3.5,
  gold: Math.random() < 0.18,
}));

const SPARKS = Array.from({ length: 9 }, () => ({
  x: 4 + Math.random() * 92,
  y: 4 + Math.random() * 66,
  s: 10 + Math.random() * 12,
  d: Math.random() * 4,
}));

export function SpaceBackground({
  earth,
  moon,
  satellite,
  planets,
  className = '',
}: {
  earth?: 'sky' | 'far';
  moon?: boolean;
  satellite?: boolean;
  planets?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-bg ${className}`} aria-hidden="true">
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="nebula nebula-c" />
      {STARS.map((s, i) => (
        <i
          key={i}
          className="star-dot"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            background: s.gold ? '#fde68a' : '#fff',
            animationDelay: `${s.d}s`,
            animationDuration: `${s.t}s`,
          }}
        />
      ))}
      {SPARKS.map((s, i) => (
        <svg
          key={`s${i}`}
          viewBox="0 0 20 20"
          className="spark"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, animationDelay: `${s.d}s` }}
        >
          <path d="M10 0 Q11 9 20 10 Q11 11 10 20 Q9 11 0 10 Q9 9 10 0Z" fill="#fff" />
        </svg>
      ))}
      <i className="meteor" />
      <i className="meteor meteor-2" />
      {moon && <Moon className="bg-moon" />}
      {planets && (
        <>
          <PlanetArt kind="decoA" className="bg-planet-a" />
          <PlanetArt kind="decoB" className="bg-planet-b" />
        </>
      )}
      {earth && <Earth className={`bg-earth bg-earth-${earth}`} />}
      {satellite && (
        <div className="bg-satellite">
          <Satellite />
        </div>
      )}
    </div>
  );
}

type GroundKind = WhKey | 'earth';

export function Ground({ kind }: { kind: GroundKind }) {
  return (
    <div className={`ground ground-${kind}`} aria-hidden="true">
      <div className="ground-dome" />
      {kind === 'what' && (
        <>
          <div className="deco" style={{ left: '3%', bottom: '58%', height: '58%' }}>
            <Crystal />
          </div>
          <div className="deco" style={{ left: '10%', bottom: '55%', height: '36%' }}>
            <Crystal />
          </div>
          <div className="deco" style={{ right: '3%', bottom: '55%', height: '46%' }}>
            <Crystal />
          </div>
          <span className="deco-emoji" style={{ left: '18%', bottom: '70%' }}>
            ✨
          </span>
        </>
      )}
      {kind === 'where' && (
        <>
          <i className="crater" style={{ left: '6%', top: '26%', width: '12vmin', height: '3.4vmin' }} />
          <i className="crater" style={{ left: '26%', top: '48%', width: '8vmin', height: '2.4vmin' }} />
          <i className="crater" style={{ left: '48%', top: '20%', width: '10vmin', height: '2.8vmin' }} />
          <i className="crater" style={{ right: '8%', top: '36%', width: '13vmin', height: '3.6vmin' }} />
          <i className="crater" style={{ right: '30%', top: '60%', width: '7vmin', height: '2vmin' }} />
        </>
      )}
      {kind === 'when' && (
        <>
          <div className="deco" style={{ left: '2.5%', bottom: '58%', height: '95%' }}>
            <ClockTower />
          </div>
          <div className="deco" style={{ right: '2.5%', bottom: '55%', height: '78%' }}>
            <ClockTower />
          </div>
          <span className="deco-emoji" style={{ left: '12%', bottom: '120%' }}>
            ⭐
          </span>
          <span className="deco-emoji" style={{ right: '11%', bottom: '115%', animationDelay: '-1.2s' }}>
            ✨
          </span>
        </>
      )}
      {kind === 'who' && (
        <>
          <span className="deco-emoji" style={{ left: '2%', bottom: '66%' }}>
            👩‍🏫
          </span>
          <span className="deco-emoji" style={{ left: '9%', bottom: '64%', animationDelay: '-.8s' }}>
            👨‍⚕️
          </span>
          <span className="deco-emoji" style={{ left: '16%', bottom: '66%', animationDelay: '-1.6s' }}>
            👧
          </span>
          <span className="deco-emoji" style={{ right: '3%', bottom: '64%', animationDelay: '-2.2s' }}>
            👦
          </span>
        </>
      )}
      {kind === 'why' && (
        <>
          <div className="deco" style={{ left: '3%', bottom: '58%', height: '62%' }}>
            <Bulb />
          </div>
          <div className="deco" style={{ left: '12%', bottom: '56%', height: '40%' }}>
            <Bulb />
          </div>
          <div className="deco" style={{ right: '4%', bottom: '55%', height: '52%' }}>
            <Bulb />
          </div>
        </>
      )}
      {kind === 'how' && (
        <>
          <div className="deco spin-slow" style={{ left: '1%', bottom: '40%', height: '95%' }}>
            <GearArt />
          </div>
          <div className="deco spin-rev" style={{ left: '9%', bottom: '66%', height: '52%' }}>
            <GearArt color="#a5f3fc" />
          </div>
          <div className="deco spin-slow" style={{ right: '2%', bottom: '45%', height: '75%' }}>
            <GearArt color="#ddd6fe" />
          </div>
        </>
      )}
      {kind === 'earth' && (
        <>
          <span className="deco-emoji" style={{ right: '3%', bottom: '62%' }}>
            🌳
          </span>
          <span className="deco-emoji" style={{ right: '11%', bottom: '66%', animationDelay: '-1s' }}>
            🌷
          </span>
          <span className="deco-emoji" style={{ right: '17%', bottom: '70%', animationDelay: '-2s' }}>
            🌼
          </span>
        </>
      )}
    </div>
  );
}
