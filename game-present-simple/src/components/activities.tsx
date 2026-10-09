import { useMemo, useRef, useState } from 'react';
import { audio } from '../audio';
import { BigButton, Guide } from './ui';

export type MCQ = { kind: 'mcq'; sentence: string; options: string[]; answer: string; hint: string; success: string };
export type Order = { kind: 'order'; words: string[]; answer: string; hint: string; success: string; verb: string };
export type Match = { kind: 'match'; pairs: { left: string; right: string }[]; hint: string; success: string };
export type TF = { kind: 'tf'; sentence: string; correct: boolean; fixed: string; hint: string; success: string };
export type Question = MCQ | Order | Match | TF;

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  if (arr.length > 1 && arr.join(' ') === a.join(' ')) return shuffle(a);
  return arr;
}

/* Highlight verb inside a sentence: renders words, verb with color */
function Sentence({ text, verb }: { text: string; verb: string }) {
  return (
    <span dir="ltr">
      {text.split(' ').map((w, i) => {
        const clean = w.replace(/[.!]/g, '');
        if (clean === verb) {
          const base = verb.endsWith('s') && verb !== 'goes' ? verb.slice(0, -1) : verb;
          const s = verb.endsWith('s') ? verb.slice(base.length) : '';
          return <span key={i} className="text-teal-600 font-black">{verb === 'goes' ? <>goe<span className="text-rose-500 underline">s</span></> : <>{base}<span className="text-rose-500 underline">{s}</span></>}{w.slice(clean.length)} </span>;
        }
        return <span key={i}>{w} </span>;
      })}
    </span>
  );
}

/* ---------- Toolbar: hint + guide ---------- */
function Tools({ hint, onHint, showHint, onGuide }: { hint: string; onHint: () => void; showHint: boolean; onGuide: () => void }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
      <button onClick={() => { audio.click(); onHint(); }} className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-black rounded-full px-4 py-2 border-2 border-amber-300">مساعدة 💡</button>
      <button onClick={() => { audio.click(); onGuide(); }} className="bg-sky-100 hover:bg-sky-200 text-sky-800 font-black rounded-full px-4 py-2 border-2 border-sky-300">دليل المسافرة 📘</button>
      {showHint && <div className="anim-pop w-full text-center text-amber-800 font-bold bg-amber-50 rounded-xl py-2 px-3 border border-amber-200">{hint}</div>}
    </div>
  );
}

/* ---------- Feedback box ---------- */
function Feedback({ ok, text, onNext }: { ok: boolean; text: string; onNext?: () => void }) {
  return (
    <div className={`anim-pop mt-4 rounded-2xl p-4 text-center font-black text-lg md:text-xl ${ok ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-800' : 'bg-orange-50 border-2 border-orange-300 text-orange-800'}`}>
      <div>{text}</div>
      {ok && onNext && <div className="mt-3"><BigButton color="teal" onClick={onNext}>التالي ➜</BigButton></div>}
    </div>
  );
}

/* ---------- Multiple choice ---------- */
export function MCQActivity({ q, onDone }: { q: MCQ; onDone: (firstTry: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [hint, setHint] = useState(false);
  const [guide, setGuide] = useState(false);
  const ok = picked === q.answer;
  const parts = q.sentence.split('___');
  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-indigo-200 w-full max-w-xl mx-auto">
      {guide && <Guide onClose={() => setGuide(false)} />}
      <div className="text-indigo-500 font-bold text-center mb-2">اختاري الإجابة 👇</div>
      <div dir="ltr" className="text-center text-3xl md:text-4xl font-black text-indigo-950 my-3">
        {parts[0]}
        <span className={`inline-block min-w-[110px] border-b-4 mx-1 px-2 rounded ${ok ? 'border-emerald-400 text-emerald-600' : 'border-indigo-300 text-violet-600'}`}>{ok ? q.answer : '___'}</span>
        {parts[1]}
      </div>
      <div className="flex justify-center gap-4 mt-4" dir="ltr">
        {q.options.map((o, optionIndex) => {
          const isPicked = picked === o;
          const cls = ok && isPicked ? 'bg-emerald-500 text-white border-emerald-700' : isPicked ? 'bg-orange-200 text-orange-900 border-orange-400' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-300';
          return (
            <button
              key={o}
              disabled={ok}
              onClick={() => {
                if (o === q.answer) {
                  audio.success();
                  setPicked(o);
                  setWrong(false);
                } else {
                  // Keep both options active after a wrong choice, especially on touch screens.
                  audio.wrong();
                  setPicked(null);
                  setWrong(true);
                  setTries(t => t + 1);
                }
              }}
              className={`${cls} text-2xl md:text-3xl font-black px-8 py-4 rounded-2xl border-b-4 shadow active:translate-y-1 transition min-w-[130px]`}
            >
              <span className="text-sm opacity-60 mr-2">{String.fromCharCode(65 + optionIndex)}.</span>{o}
            </button>
          );
        })}
      </div>
      {wrong && !ok && <Feedback ok={false} text="قريبة! 💡 انظري إلى الفاعل وحاولي مرة أخرى. ما زالت الإجابتان متاحتين." />}
      {ok && <Feedback ok text={q.success} onNext={() => onDone(tries === 0)} />}
      {!ok && <Tools hint={q.hint} onHint={() => setHint(true)} showHint={hint} onGuide={() => setGuide(true)} />}
    </div>
  );
}

/* ---------- Sentence ordering (tap or drag) ---------- */
export function OrderActivity({ q, onDone }: { q: Order; onDone: (firstTry: boolean) => void }) {
  const pool = useMemo(() => shuffle(q.words.map((w, i) => ({ id: i, w }))), [q]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState(false);
  const [guide, setGuide] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const remaining = pool.filter(p => !placed.includes(p.id));
  const sentence = placed.map(id => pool.find(p => p.id === id)!.w).join(' ');

  const check = () => {
    const norm = (s: string) => s.replace(/[.]/g, '').trim().toLowerCase();
    if (norm(sentence) === norm(q.answer)) { audio.success(); setStatus('ok'); }
    else { audio.wrong(); setStatus('bad'); setTries(t => t + 1); }
  };
  const add = (id: number) => { if (status === 'ok') return; audio.pop(); setStatus('idle'); setPlaced(p => [...p, id]); };
  const remove = (id: number) => { if (status === 'ok') return; audio.click(); setStatus('idle'); setPlaced(p => p.filter(x => x !== id)); };

  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-indigo-200 w-full max-w-xl mx-auto">
      {guide && <Guide onClose={() => setGuide(false)} />}
      <div className="text-indigo-500 font-bold text-center mb-2">رتبي الجملة 🧩 (اسحبي أو اضغطي على الكلمات)</div>

      {/* Drop zone */}
      <div
        dir="ltr"
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const id = Number(e.dataTransfer.getData('text/plain')); if (!Number.isNaN(id) && !placed.includes(id)) add(id); }}
        className={`min-h-[76px] rounded-2xl border-4 border-dashed flex flex-wrap items-center justify-center gap-2 p-3 transition ${status === 'ok' ? 'border-emerald-400 bg-emerald-50' : dragOver ? 'border-violet-400 bg-violet-50' : 'border-indigo-200 bg-indigo-50/60'}`}
      >
        {placed.length === 0 && <span className="text-indigo-300 font-bold">Drop words here ⬇</span>}
        {placed.map(id => {
          const w = pool.find(p => p.id === id)!.w;
          const isVerb = status === 'ok' && w === q.verb;
          return (
            <button key={id} onClick={() => remove(id)} className={`px-4 py-2 rounded-xl text-xl md:text-2xl font-black border-b-4 shadow transition ${status === 'ok' ? (isVerb ? 'bg-amber-300 border-amber-500 text-indigo-950 scale-110' : 'bg-emerald-500 border-emerald-700 text-white') : 'bg-violet-500 border-violet-700 text-white'}`}>
              {w}
            </button>
          );
        })}
        {status === 'ok' && <span className="text-emerald-600 text-2xl font-black">.</span>}
      </div>

      {/* Word pool */}
      <div dir="ltr" className="flex flex-wrap justify-center gap-3 mt-4 min-h-[56px]">
        {remaining.map(p => (
          <button
            key={p.id}
            draggable
            onDragStart={e => e.dataTransfer.setData('text/plain', String(p.id))}
            onClick={() => add(p.id)}
            className="cursor-grab active:cursor-grabbing px-4 py-2 rounded-xl text-xl md:text-2xl font-black bg-white text-indigo-900 border-2 border-indigo-300 border-b-4 shadow hover:-translate-y-1 transition"
          >
            {p.w}
          </button>
        ))}
      </div>

      {status !== 'ok' && (
        <div className="flex justify-center mt-4">
          <BigButton onClick={check} disabled={remaining.length > 0}>تحقّقي ✅</BigButton>
        </div>
      )}
      {status === 'bad' && <Feedback ok={false} text="حاولي مرة أخرى 💡 ابدئي بمن يقوم بالفعل." />}
      {status === 'ok' && (
        <Feedback ok text={q.success} onNext={() => onDone(tries === 0)} />
      )}
      {status === 'ok' && <div className="text-center mt-2 text-indigo-800 text-xl font-black"><Sentence text={q.answer} verb={q.verb} /></div>}
      {status !== 'ok' && <Tools hint={q.hint} onHint={() => setHint(true)} showHint={hint} onGuide={() => setGuide(true)} />}
    </div>
  );
}

/* ---------- Matching: tap a pronoun then the right verb form ---------- */
export function MatchActivity({ q, onDone }: { q: Match; onDone: (firstTry: boolean) => void }) {
  const rights = useMemo(() => shuffle(q.pairs.map(p => p.right)), [q]);
  const [sel, setSel] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [bad, setBad] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState(false);
  const [guide, setGuide] = useState(false);
  const done = Object.keys(matched).length === q.pairs.length;
  const usedRights = Object.values(matched);

  const pickRight = (r: string) => {
    if (!sel || usedRights.includes(r)) return;
    const pair = q.pairs.find(p => p.left === sel)!;
    if (pair.right === r) { audio.success(); setMatched(m => ({ ...m, [sel]: r })); setSel(null); setBad(null); }
    else { audio.wrong(); setBad(r); setTries(t => t + 1); setTimeout(() => setBad(null), 600); }
  };
  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-indigo-200 w-full max-w-xl mx-auto">
      {guide && <Guide onClose={() => setGuide(false)} />}
      <div className="text-indigo-500 font-bold text-center mb-3">صِلي كل ضمير بالفعل الصحيح 🔗 (اضغطي الضمير ثم الفعل)</div>
      <div dir="ltr" className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {q.pairs.map(p => {
            const ok = matched[p.left];
            return (
              <button key={p.left} disabled={!!ok} onClick={() => { audio.click(); setSel(p.left); }}
                className={`py-3 rounded-xl text-2xl font-black border-b-4 transition ${ok ? 'bg-emerald-500 border-emerald-700 text-white' : sel === p.left ? 'bg-amber-300 border-amber-500 text-indigo-950 scale-105' : 'bg-indigo-50 border-indigo-300 text-indigo-900'}`}>
                {p.left}{ok && <span className="text-base ml-2">→ {ok}</span>}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {rights.map(r => {
            const used = usedRights.includes(r);
            return (
              <button key={r} disabled={used || !sel} onClick={() => pickRight(r)}
                className={`py-3 rounded-xl text-2xl font-black border-b-4 transition ${used ? 'bg-emerald-100 border-emerald-200 text-emerald-400' : bad === r ? 'bg-orange-200 border-orange-400 anim-shake' : 'bg-violet-50 border-violet-300 text-violet-900 hover:bg-violet-100 disabled:opacity-60'}`}>
                {r.endsWith('s') ? <>{r.slice(0, -1)}<span className="text-rose-500">s</span></> : r}
              </button>
            );
          })}
        </div>
      </div>
      {bad && <Feedback ok={false} text="قريبة! 💡 انظري إلى الفاعل وحاولي مرة أخرى." />}
      {done && <Feedback ok text={q.success} onNext={() => onDone(tries === 0)} />}
      {!done && <Tools hint={q.hint} onHint={() => setHint(true)} showHint={hint} onGuide={() => setGuide(true)} />}
    </div>
  );
}

/* ---------- Correct or not? ✓ / ✗ ---------- */
export function TFActivity({ q, onDone }: { q: TF; onDone: (firstTry: boolean) => void }) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState(false);
  const [guide, setGuide] = useState(false);
  const ok = picked !== null && picked === q.correct;
  return (
    <div className="bg-white/95 backdrop-blur rounded-3xl p-5 md:p-6 shadow-2xl border-4 border-indigo-200 w-full max-w-xl mx-auto">
      {guide && <Guide onClose={() => setGuide(false)} />}
      <div className="text-indigo-500 font-bold text-center mb-2">هل الجملة صحيحة؟ 🤔</div>
      <div dir="ltr" className="text-center text-3xl md:text-4xl font-black text-indigo-950 my-4 bg-indigo-50 rounded-2xl py-4">{q.sentence}</div>
      <div className="flex justify-center gap-4" dir="ltr">
        {[true, false].map(v => (
          <button key={String(v)} disabled={ok} onClick={() => { if (v === q.correct) { audio.success(); } else { audio.wrong(); setTries(t => t + 1); } setPicked(v); }}
            className={`text-2xl font-black px-8 py-4 rounded-2xl border-b-4 shadow min-w-[130px] transition ${picked === v ? (ok ? 'bg-emerald-500 text-white border-emerald-700' : 'bg-orange-200 text-orange-900 border-orange-400') : v ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-rose-50 text-rose-800 border-rose-300'}`}>
            {v ? '✓ صحيحة' : '✗ خطأ'}
          </button>
        ))}
      </div>
      {picked !== null && !ok && <Feedback ok={false} text="قريبة! 💡 انظري إلى الفاعل والفعل وحاولي مرة أخرى." />}
      {ok && (
        <>
          <Feedback ok text={q.success} onNext={() => onDone(tries === 0)} />
          {!q.correct && <div dir="ltr" className="text-center mt-2 text-indigo-800 text-xl font-black">✅ {q.fixed}</div>}
        </>
      )}
      {!ok && <Tools hint={q.hint} onHint={() => setHint(true)} showHint={hint} onGuide={() => setGuide(true)} />}
    </div>
  );
}

/* ---------- Generic runner: runs a list of questions ---------- */
export function ActivityRunner({ questions, onFinish, onScore, title }: { questions: Question[]; onFinish: () => void; onScore: (pts: number) => void; title?: string }) {
  const [i, setI] = useState(0);
  const advancing = useRef(false);
  const q = questions[i];
  const done = (first: boolean) => {
    // Ignore accidental double taps while React moves to the next activity.
    if (advancing.current) return;
    advancing.current = true;
    onScore(first ? 2 : 1);
    if (i + 1 < questions.length) {
      setI(current => current + 1);
      requestAnimationFrame(() => { advancing.current = false; });
    } else {
      onFinish();
    }
  };
  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-3">
        {title && <span className="bg-white/90 rounded-full px-3 py-1 text-indigo-800 font-black text-sm shadow">{title}</span>}
        <div className="flex gap-1">
          {questions.map((_, k) => <span key={k} className={`w-3 h-3 rounded-full ${k < i ? 'bg-emerald-400' : k === i ? 'bg-amber-400' : 'bg-white/70'}`} />)}
        </div>
      </div>
      {q.kind === 'mcq' && <MCQActivity key={`mcq-${i}`} q={q} onDone={done} />}
      {q.kind === 'order' && <OrderActivity key={`order-${i}`} q={q} onDone={done} />}
      {q.kind === 'match' && <MatchActivity key={`match-${i}`} q={q} onDone={done} />}
      {q.kind === 'tf' && <TFActivity key={`tf-${i}`} q={q} onDone={done} />}
    </div>
  );
}
