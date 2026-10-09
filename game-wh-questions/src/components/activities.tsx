import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import type { Choice } from '../data/content';
import { sound } from '../lib/sound';
import { cn } from '../utils/cn';
import { Rocket } from './art/Rocket';
import { starPath } from './art/SpaceArt';

interface ActProps {
  choices: Choice[];
  onCorrect: () => void;
  onWrong: () => void;
}

/** Shared answer checking with a short "shake" on wrong answers (no score penalty). */
function useAnswer({ choices, onCorrect, onWrong }: ActProps) {
  const [solved, setSolved] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const check = (id: string) => {
    if (solved) return;
    const c = choices.find((x) => x.id === id);
    if (!c) return;
    if (c.correct) {
      setSolved(c.id);
      onCorrect();
    } else {
      setWrong(c.id);
      onWrong();
      window.setTimeout(() => setWrong((w) => (w === c.id ? null : w)), 650);
    }
  };
  return { solved, wrong, check };
}

/** Pointer-based drag (mouse, touch, pen, smartboard). Tap also counts as a pick. */
function useDrag(onEnd: (dragId: string, targetId: string | null, tap: boolean) => void, disabled: boolean) {
  const st = useRef<{ x: number; y: number; pid: number; id: string; moved: boolean } | null>(null);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const targetAt = (x: number, y: number) => {
    const els = document.elementsFromPoint(x, y);
    for (const el of els) {
      const id = (el as HTMLElement).dataset?.drop;
      if (id) return id;
    }
    return null;
  };

  const bind = (id: string) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      st.current = { x: e.clientX, y: e.clientY, pid: e.pointerId, id, moved: false };
      setDrag({ id, x: 0, y: 0 });
      sound.play('pop');
    },
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
      const s = st.current;
      if (!s || s.pid !== e.pointerId) return;
      const dx = e.clientX - s.x;
      const dy = e.clientY - s.y;
      if (Math.abs(dx) + Math.abs(dy) > 8) s.moved = true;
      setDrag({ id: s.id, x: dx, y: dy });
      setHover(targetAt(e.clientX, e.clientY));
    },
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => {
      const s = st.current;
      if (!s || s.pid !== e.pointerId) return;
      st.current = null;
      const target = s.moved ? targetAt(e.clientX, e.clientY) : null;
      setDrag(null);
      setHover(null);
      onEnd(s.id, target, !s.moved);
    },
    onPointerCancel: () => {
      st.current = null;
      setDrag(null);
      setHover(null);
    },
  });

  return { bind, drag, hover };
}

const ORBS = [
  'radial-gradient(circle at 35% 30%, #ccfbf1, #2dd4bf 60%, #0f766e)',
  'radial-gradient(circle at 35% 30%, #fce7f3, #f472b6 60%, #9d174d)',
  'radial-gradient(circle at 35% 30%, #fef3c7, #fbbf24 60%, #b45309)',
];

/* ---------- 1) tap: picture cards / planets / comets ---------- */
export function ChoiceActivity({ look, ...props }: ActProps & { look: 'cards' | 'planets' | 'comets' }) {
  const { solved, wrong, check } = useAnswer(props);
  return (
    <div className={cn('choices', `choices-${look}`)}>
      {props.choices.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => check(c.id)}
          className={cn(
            'choice',
            `choice-${look}`,
            wrong === c.id && 'is-wrong',
            solved === c.id && 'is-right',
            solved && solved !== c.id && 'is-dim',
          )}
          style={{ '--i': i } as CSSProperties}
        >
          {look === 'comets' && <span className="comet-tail" aria-hidden="true" />}
          {look === 'planets' ? (
            <span className="choice-orb" style={{ background: ORBS[i % ORBS.length] }}>
              <span className="choice-emoji">{c.icon}</span>
            </span>
          ) : (
            <span className="choice-emoji">{c.icon}</span>
          )}
          <span className="choice-label font-en" dir="ltr">
            {c.en}
          </span>
          {solved === c.id && <span className="choice-check">✓</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------- 2) drag the star / rocket to the answer ---------- */
export function DragActivity({ token, ...props }: ActProps & { token: 'star' | 'rocket' }) {
  const { solved, wrong, check } = useAnswer(props);
  const { bind, drag, hover } = useDrag((_id, target) => {
    if (target) check(target);
  }, !!solved);

  return (
    <div className="drag-act">
      <div className="token-dock">
        {!solved && (
          <div
            className={cn('drag-token', drag && 'is-dragging')}
            style={drag ? { transform: `translate(${drag.x}px, ${drag.y}px) scale(1.12)` } : undefined}
            {...bind('token')}
            role="button"
            aria-label="اسحبيني إلى الإجابة الصحيحة"
          >
            <span className="token-inner">
              {token === 'star' ? (
                <svg viewBox="0 0 100 100" className="token-star" aria-hidden="true">
                  <path d={starPath(50, 53, 46, 21)} fill="#fde047" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" />
                  <circle cx="38" cy="44" r="5" fill="#fff" opacity=".85" />
                </svg>
              ) : (
                <Rocket className="token-rocket" flame={!!drag} pilot />
              )}
            </span>
          </div>
        )}
        {!solved && <span className="token-hint">👆 اسحبيني</span>}
      </div>
      <div className="drop-targets">
        {props.choices.map((c) => (
          <button
            key={c.id}
            type="button"
            data-drop={c.id}
            onClick={() => check(c.id)}
            className={cn(
              'drop-target',
              token === 'rocket' && 'pad',
              hover === c.id && 'is-hover',
              wrong === c.id && 'is-wrong',
              solved === c.id && 'is-right',
              solved && solved !== c.id && 'is-dim',
            )}
          >
            <span className="choice-emoji" data-drop={c.id}>
              {c.icon}
            </span>
            <span className="choice-label font-en" dir="ltr" data-drop={c.id}>
              {c.en}
            </span>
            {solved === c.id && <span className="landed">{token === 'star' ? '⭐' : '🚀'}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3) drag the answer chip into the blank ---------- */
export function BlankActivity(props: ActProps) {
  const { solved, wrong, check } = useAnswer(props);
  const { bind, drag, hover } = useDrag((id, target, tap) => {
    if (tap || target === 'blank') check(id);
  }, !!solved);
  const solvedChoice = props.choices.find((c) => c.id === solved);

  return (
    <div className="blank-act">
      <div className="blank-line" dir="ltr">
        <span aria-hidden="true">👉</span>
        <span
          data-drop="blank"
          className={cn('blank-slot font-en', hover === 'blank' && 'is-hover', solvedChoice && 'is-filled')}
        >
          {solvedChoice ? (
            <>
              <span>{solvedChoice.icon}</span> {solvedChoice.en}
            </>
          ) : (
            '? ? ?'
          )}
        </span>
      </div>
      <div className="chips">
        {props.choices.map((c) => {
          const d = drag?.id === c.id ? drag : null;
          return (
            <button
              key={c.id}
              type="button"
              dir="ltr"
              className={cn('chip', wrong === c.id && 'is-wrong', solved === c.id && 'is-used', d && 'is-dragging')}
              style={d ? { transform: `translate(${d.x}px, ${d.y}px) scale(1.08)` } : undefined}
              {...bind(c.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  check(c.id);
                }
              }}
            >
              <span aria-hidden="true">{c.icon}</span> {c.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
