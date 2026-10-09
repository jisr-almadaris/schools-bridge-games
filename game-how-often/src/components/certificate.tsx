import { sfx } from '../lib/audio';

export default function Certificate({ name, date, onRestart }: { name: string; date: string; onRestart: () => void }) {
  const printIt = () => { sfx.click(); setTimeout(() => window.print(), 200); };
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
        <button onClick={printIt} className="rounded-2xl bg-gradient-to-l from-amber-300 to-orange-400 px-6 py-3 font-black text-[#231303] shadow-xl transition hover:scale-105 active:scale-95">🖨️ طباعة / حفظ PDF</button>
        <button onClick={() => { sfx.click(); onRestart(); }} className="rounded-2xl border border-white/20 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10">🔄 لعب من جديد</button>
      </div>

      <div id="certificate-print" className="relative overflow-hidden rounded-[28px] border-4 border-[#f5c542] bg-[#0a1230] p-6 text-center shadow-[0_0_80px_rgba(245,197,66,.35)] sm:p-10">
        {/* glowing energy lines */}
        <div className="pointer-events-none absolute inset-2 rounded-[22px] border border-cyan-300/30" />
        <div className="pointer-events-none absolute inset-4 rounded-[18px] border border-[#f5c542]/25" />
        {/* corner gears */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map(p => (
          <div key={p} className={`absolute ${p} animate-spin-slower text-2xl opacity-70`}>⚙️</div>
        ))}
        {/* bolts */}
        {['top-6 left-1/2', 'bottom-6 left-1/2'].map((p, i) => <div key={i} className={`absolute ${p} h-2 w-2 -translate-x-1/2 rounded-full bg-[#f5c542]`} />)}

        {/* background glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,123,255,.18)_0%,transparent_65%)]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c542]/50 bg-[#f5c542]/10 px-4 py-1 text-sm font-extrabold text-[#f5c542]">🌉 مبادرة جسر المدارس</div>
          <p className="mx-auto mt-1 max-w-xl text-[11px] leading-5 text-cyan-100/70 sm:text-xs">«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»</p>

          <div className="mt-3 text-4xl">🏆</div>
          <h1 className="font-display mt-1 text-3xl font-black text-[#f5c542] sm:text-4xl">شهادة خبيرة التكرار</h1>
          <div className="font-en text-lg font-bold tracking-[.3em] text-cyan-200" dir="ltr">FREQUENCY MASTER</div>

          <p className="mt-3 text-sm text-white/70">«تُمنح هذه الشهادة إلى»</p>
          <div className="mx-auto mt-1 w-fit max-w-full rounded-2xl border border-[#f5c542]/60 bg-gradient-to-b from-white/10 to-transparent px-10 py-2">
            <span className="font-display block max-w-full truncate text-2xl font-black text-white sm:text-3xl" style={{ fontSize: name.length > 14 ? '1.3rem' : undefined }}>{name || 'بطلتنا الرائعة'}</span>
          </div>

          <p className="mt-3 text-sm font-bold text-white">لإتمامها بنجاح</p>
          <div className="mt-1 font-black text-cyan-200">⚙️ آلة العادات العجيبة</div>
          <div className="font-en text-xs tracking-widest text-white/60" dir="ltr">THE HABIT MACHINE</div>
          <p className="mx-auto mt-1 max-w-lg text-xs leading-6 text-cyan-100/80">«وإتقان السؤال عن التكرار وبناء الأسئلة والجمل باستخدام HOW OFTEN.»</p>

          <div className="font-en mx-auto mt-3 flex w-fit flex-wrap justify-center gap-1.5 rounded-xl bg-black/40 px-4 py-2 text-[11px] font-bold text-amber-100" dir="ltr">
            {['DO', '•', 'DOES', '|', 'ALWAYS', '•', 'USUALLY', '•', 'SOMETIMES', '•', 'RARELY', '•', 'NEVER'].map((w, i) => <span key={i}>{w}</span>)}
          </div>

          <div className="mx-auto mt-3 flex max-w-md items-center justify-between gap-3 text-sm">
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2"><div className="text-[10px] text-white/50">النتيجة</div><div className="font-black text-emerald-300" dir="ltr">100% ⚡⚡⚡⚡</div></div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#f5c542] bg-gradient-to-b from-[#2a2358] to-[#0d1030] text-2xl shadow-[0_0_25px_rgba(245,197,66,.6)]">⚙️</div>
            <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2"><div className="text-[10px] text-white/50">التاريخ</div><div className="font-black text-cyan-200">{date}</div></div>
          </div>

          <div className="mx-auto mt-3 w-fit rounded-full border border-emerald-300/60 bg-emerald-400/15 px-5 py-1.5 text-sm font-black text-emerald-200">⚙️ FREQUENCY MASTER ✓</div>
          <div className="font-en mt-2 text-[10px] tracking-widest text-white/30" dir="ltr">⚙️ ⚡ HABIT MACHINE • MASTER CODE 6 • 2 • 8 • 4 ⚡ ⚙️</div>
        </div>
      </div>
    </div>
  );
}

export function Manual({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm" onClick={onClose}>
      <div className="animate-bounce-in max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-cyan-300/40 bg-gradient-to-b from-[#0e1a42] to-[#080f28] p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-black text-cyan-200">📘 MACHINE MANUAL — دليل الآلة</div>
          <button onClick={onClose} className="rounded-full bg-white/10 px-3 py-1 font-black text-white">✕</button>
        </div>
        <div className="mt-3 space-y-3 text-sm leading-7">
          <div className="rounded-2xl border border-white/15 bg-black/30 p-3"><b className="text-amber-300">1. HOW OFTEN؟</b><br />تسأل عن التكرار — كم مرة؟<div className="font-en mt-1 rounded bg-white/5 p-1.5 text-cyan-100" dir="ltr">How often do you walk?</div></div>
          <div className="rounded-2xl border border-white/15 bg-black/30 p-3"><b className="text-amber-300">2. DO / DOES</b><br /><span className="font-en" dir="ltr">I / YOU / WE / THEY → DO</span><br /><span className="font-en" dir="ltr">HE / SHE / IT → DOES</span></div>
          <div className="rounded-2xl border border-white/15 bg-black/30 p-3"><b className="text-amber-300">3. تركيب السؤال</b><br /><span className="font-en" dir="ltr">HOW OFTEN + DO/DOES + SUBJECT + BASE VERB + ?</span><div className="mt-1 text-red-200">⚠️ بعد DOES فعل أساسي بدون s</div></div>
          <div className="rounded-2xl border border-white/15 bg-black/30 p-3"><b className="text-amber-300">4. تركيب الإجابة</b><br /><span className="font-en" dir="ltr">SUBJECT + FREQUENCY + VERB</span><div className="font-en mt-1 rounded bg-white/5 p-1.5 text-cyan-100" dir="ltr">She sometimes plays tennis.</div></div>
          <div className="rounded-2xl border border-white/15 bg-black/30 p-3" dir="ltr"><div className="font-en flex flex-wrap gap-1.5 text-xs font-bold"><span className="rounded bg-white/10 px-2 py-1">always = دائمًا</span><span className="rounded bg-white/10 px-2 py-1">usually = عادةً</span><span className="rounded bg-white/10 px-2 py-1">sometimes = أحيانًا</span><span className="rounded bg-white/10 px-2 py-1">rarely = نادرًا</span><span className="rounded bg-white/10 px-2 py-1">never = أبدًا</span></div></div>
        </div>
        <button onClick={onClose} className="mt-4 w-full rounded-2xl bg-gradient-to-l from-cyan-400 to-blue-500 py-3 font-black text-black">عودة للآلة ⚙️</button>
      </div>
    </div>
  );
}
