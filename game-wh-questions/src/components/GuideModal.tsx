import type { CSSProperties } from 'react';
import { STATIONS } from '../data/content';
import { Modal } from './ui';

export function GuideModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="guide-head">
        <div className="guide-emoji" aria-hidden="true">
          📘🚀
        </div>
        <h2 className="guide-title">دليل رائدة الفضاء</h2>
        <p className="guide-sub">كل كلمة تسأل عن شيء مختلف ✨</p>
      </div>
      <div className="guide-rows">
        {STATIONS.map((s) => (
          <div key={s.key} className="guide-row" style={{ '--c': s.color } as CSSProperties}>
            <span className="guide-icon" aria-hidden="true">
              {s.icon}
            </span>
            <span className="guide-word font-en" dir="ltr">
              {s.word}
            </span>
            <span className="guide-arrow" aria-hidden="true">
              ←
            </span>
            <span>{s.ar}</span>
            <span className="guide-arrow" aria-hidden="true">
              ←
            </span>
            <span className="guide-cat">{s.category}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" className="btn-main btn-lg" onClick={onClose}>
          أعود إلى الرحلة 🚀
        </button>
      </div>
    </Modal>
  );
}
