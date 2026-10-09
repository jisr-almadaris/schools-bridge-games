import { useState } from "react";
import { createPortal } from "react-dom";
import { Dust } from "../components/Scenery";
import { sfx } from "../audio";
import { TOTAL_QUESTIONS, WORD_INFO, type Word } from "../data";
import type { Progress } from "../store";

const WORDS: Word[] = ["AND", "BUT", "BECAUSE", "WHEN"];

/* Unit helpers: screen uses container-width units (responsive preview),
   print uses fixed millimetres (A4 landscape safe area 277mm × 190mm).
   1 unit = 2.6mm keeps the full content inside 190mm height with room to spare. */
type Unit = (n: number) => string;
const SCREEN_UNIT: Unit = (n) => `${n}cqw`;
const PRINT_UNIT: Unit = (n) => `${(n * 2.6).toFixed(2)}mm`;

interface CardData { name: string; solved: number; stars: number; date: string }

/** The certificate card itself — shared by the screen preview and the print layout. */
function CertificateCard({ d, cq }: { d: CardData; cq: Unit }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 40%, #fffdf5 0%, #f7ecd4 65%, #ead6ac 100%)", padding: cq(1.6) }}>
      {/* ornate borders */}
      <div className="absolute" style={{ inset: cq(1.2), border: `${cq(0.5)} solid #c8952e`, borderRadius: cq(1.2) }} />
      <div className="absolute" style={{ inset: cq(2.2), border: `${cq(0.18)} solid #6e1a3d`, borderRadius: cq(0.8) }} />
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} flex items-center justify-center`} style={{ width: cq(9), height: cq(9), fontSize: cq(3.4) }}>
          <div className="rounded-full flex items-center justify-center" style={{ width: cq(6), height: cq(6), background: "radial-gradient(circle,#fff3c4,#c8952e)", border: `${cq(0.25)} solid #6e1a3d` }}>{["🗝️", "🔮", "🔮", "🗝️"][i]}</div>
        </div>
      ))}
      {/* watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ fontSize: cq(34), opacity: 0.05 }}>🏨</div>

      <div className="relative h-full flex flex-col items-center justify-between text-center" style={{ padding: `${cq(2.4)} ${cq(7)}`, color: "#3b1f6e" }}>
        <div>
          <div className="font-black" style={{ fontSize: cq(3.1), color: "#6e1a3d" }}>مبادرة جسر المدارس 🌉</div>
          <div className="font-bold" style={{ fontSize: cq(1.45), color: "#7a5217" }}>«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</div>
        </div>
        <div className="font-black" style={{ fontSize: cq(3.6), color: "#3b1f6e" }}>🏆✨ شهادة مكتشفة أسرار الفندق السحري</div>
        <div>
          <div className="font-bold" style={{ fontSize: cq(1.8) }}>تُمنح للطالبة:</div>
          <div className="ruqaa" style={{ fontSize: cq(5.4), color: "#6e1a3d", lineHeight: 1.25, borderBottom: `${cq(0.2)} solid #c8952e`, padding: `0 ${cq(4)}` }}>{d.name}</div>
        </div>
        <div style={{ fontSize: cq(1.75) }} className="font-bold">
          لإتمامها بنجاح: «الفندق السحري – <span className="en">Linking Words</span>»
          <div style={{ marginTop: cq(0.4) }}>وفهمها استخدام:</div>
          <div className="flex justify-center flex-wrap" style={{ gap: cq(1), marginTop: cq(0.6) }} dir="ltr">
            {WORDS.map((w) => (
              <span key={w} className="en font-bold rounded-full" style={{ fontSize: cq(1.9), padding: `${cq(0.2)} ${cq(1.4)}`, background: "#1b0f33", color: WORD_INFO[w].color, border: `${cq(0.15)} solid #c8952e` }}>{WORD_INFO[w].icon} {w}</span>
            ))}
          </div>
        </div>
        <div className="w-full flex items-end justify-between" style={{ fontSize: cq(1.5) }}>
          <div className="text-right font-bold">
            <div>الدرجة: <span style={{ color: "#6e1a3d" }}>{d.solved} / {TOTAL_QUESTIONS}</span> ✨</div>
            <div>نجوم المحاولة الأولى: {d.stars} ⭐</div>
          </div>
          <div className="rounded-full flex flex-col items-center justify-center font-black" style={{ width: cq(10), height: cq(10), background: "radial-gradient(circle,#fff3c4,#f2c95c 55%,#c8952e)", border: `${cq(0.35)} solid #6e1a3d`, boxShadow: `0 0 ${cq(2)} rgba(242,201,92,.7)` }}>
            <span style={{ fontSize: cq(2.6) }}>🗝️</span>
            <span className="cinzel" style={{ fontSize: cq(1.1), color: "#3b1f6e" }}>7 • 3 • 5 • 1</span>
          </div>
          <div className="text-left font-bold">
            <div>التاريخ:</div>
            <div style={{ color: "#6e1a3d" }}>{d.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Opens the print-only certificate in a standalone page (used when the browser/frame ignores window.print). */
function openStandalonePrintPage(): boolean {
  try {
    const cert = document.querySelector(".print-only-certificate");
    if (!cert) return false;
    const w = window.open("", "_blank");
    if (!w) return false;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"], link[rel="preconnect"]')).map((n) => n.outerHTML).join("\n");
    w.document.open();
    w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>شهادة مكتشفة أسرار الفندق السحري</title>${styles}
<style>
  html,body{height:auto!important;overflow:auto!important;user-select:auto;-webkit-user-select:auto}
  @media screen{
    body{background:#160f3a;margin:0;padding:12px 0 90px}
    .print-only-certificate{display:block!important;zoom:var(--z,1)}
    .standalone-bar{position:fixed;left:0;right:0;bottom:0;padding:12px;display:flex;justify-content:center;background:rgba(11,6,32,.92)}
  }
  @media print{ .print-only-certificate{zoom:1!important} .standalone-bar{display:none!important} }
</style></head><body>
${cert.outerHTML}
<div class="standalone-bar"><button type="button" class="btn-gold" style="border-radius:16px;padding:12px 24px;font-size:18px;font-family:Cairo,sans-serif" onclick="window.print()">طباعة الشهادة / حفظ PDF 🖨️</button></div>
<script>
  function fit(){document.documentElement.style.setProperty('--z',Math.min(1,(window.innerWidth-8)/1123));}
  fit();window.addEventListener('resize',fit);
  window.addEventListener('load',function(){setTimeout(function(){try{window.print();}catch(e){}},700);});
</script></body></html>`);
    w.document.close();
    return true;
  } catch { return false; }
}

export default function Certificate({ p, onRestart }: { p: Progress; onRestart: () => void }) {
  const [printHelp, setPrintHelp] = useState(false);
  const date = (() => {
    try { return new Date(p.finishedAt || Date.now()).toLocaleDateString("ar-SA-u-ca-gregory", { year: "numeric", month: "long", day: "numeric" }); }
    catch { return new Date().toLocaleDateString(); }
  })();
  const data: CardData = { name: p.name, solved: Math.min(p.solved.length, TOTAL_QUESTIONS), stars: p.firstTry.length, date };

  // Direct, synchronous print from the user's tap/click — no timers or promises before window.print().
  const handlePrint = () => {
    setPrintHelp(false);
    let inFrame = false;
    try { inFrame = window.self !== window.top; } catch { inFrame = true; }
    const touch = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
    // Mobile browsers ignore window.print() inside embedded frames → open the certificate as its own page.
    if (inFrame && touch && openStandalonePrintPage()) return;

    let started = false;
    const onBefore = () => { started = true; };
    window.addEventListener("beforeprint", onBefore);
    try { window.print(); } catch { /* handled below */ }
    // If the browser silently ignored print (e.g. in-app browsers), show honest guidance instead of pretending.
    window.setTimeout(() => {
      window.removeEventListener("beforeprint", onBefore);
      if (!started) setPrintHelp(true);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 overflow-y-auto scroll-thin" style={{ background: "radial-gradient(ellipse at 50% 30%, #5a2f9e, #160f3a 60%, #0b0620)" }}>
      <Dust count={24} />
      <div className="relative z-10 min-h-full flex flex-col items-center justify-center gap-4 px-3 pt-20 pb-8">
        {/* SCREEN CERTIFICATE — responsive preview (unchanged design) */}
        <div id="certificate" className="w-[min(96vw,1040px)] aspect-[297/210] relative" style={{ containerType: "inline-size", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
          <CertificateCard d={data} cq={SCREEN_UNIT} />
        </div>
        <div className="relative flex flex-wrap gap-3 justify-center no-print" style={{ zIndex: 50, pointerEvents: "auto" }}>
          <button type="button" onClick={handlePrint} className="btn-gold rounded-2xl px-6 py-3 text-lg" style={{ pointerEvents: "auto", touchAction: "manipulation" }}>طباعة الشهادة / حفظ PDF 🖨️</button>
          <button type="button" onClick={() => { sfx("ding"); onRestart(); }} className="btn-ghost rounded-2xl px-6 py-3 text-lg">العبي مرة أخرى 🏨✨</button>
        </div>
        {printHelp && (
          <div className="relative no-print glass rounded-2xl px-4 py-3 text-center w-[min(94vw,560px)] anim-fadeUp" style={{ zIndex: 50 }}>
            <div className="font-bold text-amber-100 mb-2">لم تُفتح نافذة الطباعة في هذا المتصفح.</div>
            <button type="button" onClick={() => { if (!openStandalonePrintPage()) setPrintHelp(true); }} className="btn-gold rounded-xl px-4 py-2 text-base mb-2">افتحي الشهادة في صفحة مستقلة للطباعة 📄</button>
            <div className="text-sm text-violet-100 leading-relaxed">
              إذا كنتِ داخل تطبيق (مثل واتساب)، افتحي الرابط في Safari أو Chrome ثم اضغطي زر الطباعة.
              <br />على iPhone: زر المشاركة ⬆️ ← طباعة ← ثم «حفظ في الملفات» كـ PDF.
            </div>
          </div>
        )}
      </div>

      {/* PRINT CERTIFICATE — independent A4 landscape layout, rendered outside the game root */}
      {createPortal(
        <div className="print-only-certificate" aria-hidden="true">
          <div className="certificate-print-area relative">
            <CertificateCard d={data} cq={PRINT_UNIT} />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
