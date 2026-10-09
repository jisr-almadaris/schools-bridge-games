import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { starPath } from './art/SpaceArt';

/** {English} -> LTR English word, **text** -> highlight */
export function RichText({ text, color }: { text: string; color?: string }) {
  const parts = text.split(/(\{[^}]+\}|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('{') && p.endsWith('}')) {
          return (
            <span key={i} dir="ltr" className="font-en en-word" style={color ? { color } : undefined}>
              {p.slice(1, -1)}
            </span>
          );
        }
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <mark key={i} className="hl" style={color ? ({ color, '--hl': color } as unknown as CSSProperties) : undefined}>
              {p.slice(2, -2)}
            </mark>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

export function TopBar({
  stars,
  muted,
  onToggleMute,
  onGuide,
}: {
  stars: number;
  muted: boolean;
  onToggleMute: () => void;
  onGuide: () => void;
}) {
  return (
    <header className="topbar">
      <div className="initiative-badge">
        <span>مبادرة جسر المدارس</span>
        <span aria-hidden="true">🌉</span>
      </div>
      <div className="topbar-tools">
        <span key={stars} className="stars-pill pop-in" aria-label={`النجوم ${stars} من 6`}>
          ⭐{' '}
          <span dir="ltr" className="font-en">
            {stars}/6
          </span>
        </span>
        <button type="button" className="icon-btn" onClick={onGuide} aria-label="دليل رائدة الفضاء">
          <span className="guide-text">دليل رائدة الفضاء</span>
          <span aria-hidden="true">📘🚀</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleMute}
          aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </header>
  );
}

export function Modal({ children, onClose, className = '' }: { children: ReactNode; onClose: () => void; className?: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="modal-back" onClick={onClose} role="dialog" aria-modal="true">
      <div className={cn('modal-card glass pop-in', className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function InfoPopup({
  icon,
  title,
  subtitle,
  lines,
  onClose,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  lines: string[];
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} className="info-card">
      <div className="info-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="info-title">{title}</h3>
      {subtitle && <p className="info-sub">{subtitle}</p>}
      <div className="info-lines">
        {lines.map((l, i) => (
          <p key={i} className="info-line">
            <RichText text={l} color="#fde68a" />
          </p>
        ))}
      </div>
      <button type="button" className="btn-main btn-lg" onClick={onClose}>
        رائع! ✨
      </button>
    </Modal>
  );
}

export function Bubble({ text, className = '' }: { text: string | null; className?: string }) {
  if (!text) return null;
  return (
    <div key={text} className={cn('bubble pop-in', className)} role="status" aria-live="polite">
      <RichText text={text} color="#7c3aed" />
    </div>
  );
}

const COLORS = ['#fbbf24', '#f472b6', '#a78bfa', '#5eead4', '#93c5fd', '#fb923c'];
const PIECES = Array.from({ length: 34 }, (_, i) => ({
  x: Math.random() * 100,
  d: Math.random() * 0.9,
  t: 2.2 + Math.random() * 1.6,
  c: COLORS[i % COLORS.length],
  w: 7 + Math.random() * 7,
  round: i % 3 === 0,
}));

export function Confetti({ run }: { run: boolean }) {
  if (!run) return null;
  return (
    <div className="confetti" aria-hidden="true">
      {PIECES.map((p, i) => (
        <i
          key={i}
          style={{
            left: `${p.x}%`,
            width: p.w,
            height: p.round ? p.w : p.w * 1.5,
            background: p.c,
            borderRadius: p.round ? '50%' : 3,
            animationDelay: `${p.d}s`,
            animationDuration: `${p.t}s`,
          }}
        />
      ))}
    </div>
  );
}

export function GlowStar({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="glow-star" onClick={onClick} aria-label={label}>
      <svg viewBox="0 0 100 100" className="glow-star-svg" aria-hidden="true">
        <path d={starPath(50, 53, 46, 21)} fill="#fde047" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="38" cy="44" r="5" fill="#fff" opacity=".85" />
      </svg>
      <span className="glow-star-label">{label}</span>
    </button>
  );
}
