import { useEffect, useRef, useState, type ReactNode } from 'react';
import { SPACE_FACTS, STATIONS } from '../data/content';
import { useLandscape } from '../lib/progress';
import { sound } from '../lib/sound';
import { cn } from '../utils/cn';
import { Robot } from './art/Robot';
import { Rocket } from './art/Rocket';
import { Earth, PlanetArt } from './art/SpaceArt';
import { SpaceBackground } from './SpaceBackground';
import { Bubble, InfoPopup } from './ui';

type Pt = { x: number; y: number };
interface Layout {
  start: Pt;
  pts: Pt[];
}

// RTL journey: starts from the right (Earth) and flows to the left / downward.
const LAND: Layout = {
  start: { x: 93, y: 84 },
  pts: [
    { x: 84, y: 64 },
    { x: 71, y: 35 },
    { x: 58, y: 64 },
    { x: 45, y: 35 },
    { x: 32, y: 64 },
    { x: 19, y: 35 },
    { x: 8, y: 62 },
  ],
};
const PORT: Layout = {
  start: { x: 84, y: 9 },
  pts: [
    { x: 28, y: 18 },
    { x: 72, y: 29.5 },
    { x: 28, y: 41 },
    { x: 72, y: 52.5 },
    { x: 28, y: 64 },
    { x: 72, y: 75.5 },
    { x: 40, y: 86 },
  ],
};

function pathD(pts: Pt[]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function MapScreen({
  topBar,
  from,
  to,
  done,
  factIndex,
  onFactSeen,
  onLand,
}: {
  topBar: ReactNode;
  from: number;
  to: number;
  done: number;
  factIndex: number;
  onFactSeen: () => void;
  onLand: () => void;
}) {
  const landscape = useLandscape();
  const L = landscape ? LAND : PORT;
  const areaRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(from);
  const [arrived, setArrived] = useState(from === to);
  const [tilt, setTilt] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [fact, setFact] = useState<string | null>(null);

  useEffect(() => {
    if (from === to) return;
    const box = areaRef.current?.getBoundingClientRect();
    const A = from < 0 ? L.start : L.pts[from];
    const B = L.pts[to];
    const w = box?.width ?? window.innerWidth;
    const h = box?.height ?? window.innerHeight;
    let ang = (Math.atan2(((B.y - A.y) * h) / 100, ((B.x - A.x) * w) / 100) * 180) / Math.PI + 90;
    if (ang > 180) ang -= 360;
    const t1 = window.setTimeout(() => {
      setTilt(ang);
      setPos(to);
      sound.play('whoosh');
    }, 650);
    const t2 = window.setTimeout(() => {
      setArrived(true);
      setTilt(0);
      setNote(null);
      sound.play('pop');
    }, 650 + 1850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const target = to < 6 ? STATIONS[to] : null;
  const msg =
    note ??
    (arrived
      ? target
        ? `🪐 وصلنا إلى كوكب {${target.upper}}!${to === 1 || to === 3 ? ' جربي التلسكوب 🔭' : ''}`
        : '🌟 وصلنا إلى محطة التحدي الأخير!'
      : target
        ? `🚀 في الطريق إلى كوكب {${target.upper}}...`
        : '🚀 في الطريق إلى التحدي الأخير...');
  const reached = arrived ? to : from;
  const p = pos < 0 ? L.start : L.pts[pos];

  const clickNode = (i: number) => {
    if (i === to && arrived) {
      onLand();
      return;
    }
    sound.play('click');
    if (i < done && i < 6) {
      const s = STATIONS[i];
      setNote(`⭐ أكملتِ كوكب {${s.upper}}: {${s.word}} ← ${s.category} ${s.icon}`);
    } else if (i === to) {
      setNote('🚀 انتظري قليلًا... نحن في الطريق!');
    } else {
      setNote('🔜 سنزوره بعد قليل!');
    }
  };

  const openFact = () => {
    sound.play('pop');
    setFact(SPACE_FACTS[factIndex % SPACE_FACTS.length]);
    onFactSeen();
  };

  return (
    <div className="screen-root">
      <SpaceBackground satellite />
      <div className="screen-col">
        {topBar}
        <div className="map-area" ref={areaRef}>
          <div className={cn('map-earth', landscape ? 'is-land' : 'is-port')} aria-hidden="true">
            <Earth />
          </div>
          <svg className="map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={pathD([L.start, ...L.pts])} className="path-all" vectorEffect="non-scaling-stroke" />
            {reached >= 0 && (
              <path
                d={pathD([L.start, ...L.pts.slice(0, reached + 1)])}
                className="path-done"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          {STATIONS.map((s, i) => {
            const isDone = i < done;
            const isTarget = i === to;
            return (
              <button
                key={s.key}
                type="button"
                className={cn(
                  'map-node',
                  isDone && 'is-done',
                  isTarget && 'is-target',
                  isTarget && arrived && 'is-ready',
                  !isDone && !isTarget && 'is-later',
                )}
                style={{ left: `${L.pts[i].x}%`, top: `${L.pts[i].y}%` }}
                onClick={() => clickNode(i)}
                aria-label={`${s.word} ${s.ar}`}
              >
                <span className="map-planet">
                  <PlanetArt kind={s.key} />
                  {isDone && <span className="map-star">⭐</span>}
                </span>
                <span className="map-label">
                  <span dir="ltr" className="font-en" style={{ color: s.color }}>
                    {s.upper}
                  </span>
                  <span className="map-label-ar">{s.ar}</span>
                </span>
              </button>
            );
          })}

          <button
            type="button"
            className={cn('map-node', to === 6 && 'is-target', to === 6 && arrived && 'is-ready', to < 6 && 'is-later')}
            style={{ left: `${L.pts[6].x}%`, top: `${L.pts[6].y}%` }}
            onClick={() => clickNode(6)}
            aria-label="التحدي الأخير"
          >
            <span className="map-planet">
              <PlanetArt kind="final" />
            </span>
            <span className="map-label">
              <span>التحدي الأخير</span>
              <span className="map-label-ar">🌌</span>
            </span>
          </button>

          <div className={cn('map-rocket', pos < 0 && 'at-start')} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <div className="map-rocket-body" style={{ transform: `rotate(${tilt}deg)` }}>
              <Rocket pilot flame={!arrived} />
            </div>
          </div>
        </div>

        <div className="map-hud">
          <div className="hud-talk">
            <Robot mood={arrived ? 'talk' : 'normal'} className="hud-robot" />
            <Bubble text={msg} />
          </div>
          {arrived && (
            <button type="button" className="btn-main btn-lg pop-in land-btn" onClick={onLand}>
              {target ? (
                <>
                  هبوط على كوكب{' '}
                  <span dir="ltr" className="font-en">
                    {target.upper}
                  </span>{' '}
                  🪐
                </>
              ) : (
                'ابدئي التحدي الأخير 🌌'
              )}
            </button>
          )}
          <button type="button" className="telescope-btn" onClick={openFact} aria-label="معلومة فضائية">
            <span className="telescope-emoji">🔭</span>
            <span>هل تعلمين؟</span>
          </button>
        </div>
      </div>
      {fact && (
        <InfoPopup icon="🔭" title="هل تعلمين؟" subtitle="معلومة فضائية 💫" lines={[fact]} onClose={() => setFact(null)} />
      )}
    </div>
  );
}
