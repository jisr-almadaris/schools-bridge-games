import { useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Diver from "../components/Diver";
import { BranchCoral, FanCoral, Scallop, Seaweed } from "../components/sea/Corals";
import { Pearl, Starfish, Turtle } from "../components/sea/Creatures";
import { sfx } from "../game/sfx";

const W = 1122;
const H = 793;

function formatDate() {
  const d = new Date();
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", { year: "numeric", month: "long", day: "numeric" }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function Certificate({ name, score, date }: { name: string; score: number; date: string }) {
  const s = Math.max(0, Math.min(5, score));
  const label = s >= 4 ? "ممتاز" : s === 3 ? "جيد جدًا" : s === 2 ? "جيد" : "مجتهدة";
  return (
    <div className="cert" dir="rtl">
      <div className="cert-frame" />
      <div className="cert-paper">
        <svg className="cert-waves" viewBox="0 0 1122 180" preserveAspectRatio="none" aria-hidden>
          <path d="M0 70 Q140 30 280 70 T560 70 T840 70 T1122 70 V180 H0 Z" fill="#ccfbf1" opacity="0.7" />
          <path d="M0 105 Q140 70 280 105 T560 105 T840 105 T1122 105 V180 H0 Z" fill="#a5f3fc" opacity="0.55" />
          <path d="M0 140 Q140 112 280 140 T560 140 T840 140 T1122 140 V180 H0 Z" fill="#c4b5fd" opacity="0.45" />
        </svg>
        {[
          [70, 100, 22],
          [130, 170, 12],
          [960, 110, 18],
          [1010, 190, 10],
          [920, 70, 9],
          [50, 280, 10],
          [1040, 310, 14],
        ].map(([x, y, r], i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: x,
              top: y,
              width: r * 2,
              height: r * 2,
              border: "2px solid rgba(14,116,144,.35)",
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.95) 0 18%, rgba(165,243,252,.25) 60%)",
            }}
          />
        ))}
      </div>
      <div className="cert-inner" />

      <div className="absolute" style={{ left: 34, bottom: 30, width: 146 }}>
        <BranchCoral c1="#ff7aa8" c2="#ffd1e1" className="block w-full" />
      </div>
      <div className="absolute" style={{ left: 156, bottom: 32, height: 118, aspectRatio: "70/260" }}>
        <Seaweed className="block h-full w-full" />
      </div>
      <div className="absolute" style={{ right: 36, bottom: 32, width: 136 }}>
        <FanCoral c1="#a78bfa" c2="#ede9fe" className="block w-full" />
      </div>
      <div className="absolute" style={{ right: 170, bottom: 36, width: 54 }}>
        <Starfish c="#fbbf24" face className="block w-full" />
      </div>
      <div className="absolute" style={{ left: 40, top: 36, width: 62, transform: "rotate(-20deg)" }}>
        <Scallop className="block w-full" />
      </div>
      <div className="absolute" style={{ right: 40, top: 36, width: 62, transform: "rotate(20deg)" }}>
        <Scallop c1="#ddd6fe" c2="#8b5cf6" className="block w-full" />
      </div>
      <div className="absolute" style={{ left: 64, top: 260, width: 132 }}>
        <Diver pose="cheer" mood="joy" className="w-full" />
      </div>
      <div className="absolute" style={{ right: 52, top: 300, width: 160 }}>
        <Turtle flip className="block w-full" />
      </div>

      <div className="cert-content">
        <div className="cert-initiative">مبادرة جسر المدارس 🌉</div>
        <div className="cert-tagline">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</div>
        <div className="cert-title">
          <span className="cert-title-grad">شهادة غواصة اللغة المتميزة</span> 🐚🪸
        </div>
        <div className="cert-text">تُمنح هذه الشهادة للغوّاصة المتميزة</div>
        <div className="cert-name">{name}</div>
        <div className="cert-text">
          لإتمامها «مغامرة أعماق البحر» بنجاح، وتعلّمها <span className="font-en" dir="ltr">Present Progressive</span> ✨
        </div>
        <div className="cert-row">
          <div className="cert-badge">
            <div className="cert-k">الدرجة</div>
            <div className="cert-v font-en" dir="ltr">
              {s} / 5
            </div>
            <div className="cert-stars" dir="ltr">
              {"★".repeat(s)}
              <span style={{ color: "#d6d3e8" }}>{"★".repeat(5 - s)}</span>
            </div>
            <div className="cert-l">{label}</div>
          </div>
          <div className="cert-medal">
            <Pearl golden className="block w-full" />
            <div className="cert-medal-t">💎 5/5</div>
          </div>
          <div className="cert-badge">
            <div className="cert-k">التاريخ</div>
            <div className="cert-v" style={{ fontSize: 26 }}>
              {date}
            </div>
            <div className="cert-l">🐚 🪸 🫧</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CertificateScreen({ name, score, onRestart }: { name: string; score: number; onRestart: () => void }) {
  const date = useMemo(formatDate, []);
  const [scale, setScale] = useState(0.5);
  const printRoot = typeof document !== "undefined" ? document.getElementById("print-root") : null;

  useLayoutEffect(() => {
    const fit = () => {
      const hud = window.innerWidth <= 760 ? 104 : 78;
      const availW = window.innerWidth * 0.94;
      const availH = window.innerHeight - hud - 96;
      setScale(Math.max(0.2, Math.min(availW / W, availH / H, 1)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const print = () => {
    sfx.sparkle();
    try {
      window.print();
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-2" style={{ paddingTop: "calc(var(--hud-h) + 4px)", paddingBottom: 10 }}>
      <div className="anim-pop-in relative" dir="ltr" style={{ width: W * scale, height: H * scale, borderRadius: 18 * scale, boxShadow: "0 20px 60px rgba(0,0,0,.45), 0 0 50px rgba(253,230,138,.35)" }}>
        <div className="absolute left-0 top-0" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <Certificate name={name} score={score} date={date} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" className="btn-primary" style={{ fontSize: "clamp(18px, 3.2vmin, 28px)" }} onClick={print}>
          طباعة الشهادة / حفظ PDF
        </button>
        <button
          type="button"
          className="btn-glass px-5 py-2"
          style={{ fontSize: "clamp(15px, 2.6vmin, 22px)" }}
          onClick={() => {
            sfx.bubble(0.15);
            onRestart();
          }}
        >
          مغامرة جديدة 🔄
        </button>
      </div>
      {printRoot &&
        createPortal(
          <div className="cert-print">
            <Certificate name={name} score={score} date={date} />
          </div>,
          printRoot
        )}
    </div>
  );
}
