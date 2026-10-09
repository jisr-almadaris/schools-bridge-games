import { reportCompleted, reportCertificate, bridgeStudentName } from "./bridge";
import { useEffect, useMemo, useRef, useState } from "react";
import { audio } from "./audio";
import { ObjectArt, Seal } from "./objects";
import { cn } from "./utils/cn";
import {
  BE_TABLE,
  COMPLETE_Q,
  DISCOVER_Q,
  DRAG_ITEMS,
  FINAL_Q,
  HESHE_ONLY,
  HESHE_PAGES,
  HESHE_Q,
  IMAGES,
  INITIATIVE_NAME,
  INITIATIVE_QUOTE,
  IT_PAGES,
  IT_Q,
  ITTHEY_ONLY,
  IYOU_ONLY,
  IYOU_PAGES,
  IYOU_Q,
  MATCH_ITEMS,
  PICTURE_Q,
  POINTS_PER_CORRECT,
  PRONOUNS,
  STATIONS,
  STORAGE_KEY,
  WETHEY_ONLY,
  WETHEY_PAGES,
  WETHEY_Q,
  shuffle,
  type MatchItem,
  type Mcq,
  type PronounId,
  type StationId,
  type TeachPage,
  type Visual,
} from "./data";

const BRIDGE_MAX_POINTS = (
  DISCOVER_Q.length + IYOU_Q.length + HESHE_Q.length + IT_Q.length + WETHEY_Q.length +
  FINAL_Q.length + COMPLETE_Q.length + PICTURE_Q.length + MATCH_ITEMS.length + DRAG_ITEMS.length
) * POINTS_PER_CORRECT;

type Screen = "start" | "map" | "station" | "achieve" | "certificate";
type GameId = "match" | "complete" | "picture" | "drag";
type ContrastId = "he-she" | "we-they" | "i-you" | "it-they";

type SaveData = {
  name: string;
  score: number;
  stars: number;
  completed: StationId[];
  gamesDone: GameId[];
  contrastDone: ContrastId[];
  soundOn: boolean;
};

const THEMES: Record<string, string> = {
  start: "from-[#5b21b6] via-[#7c3aed] to-[#22d3ee]",
  map: "from-[#4c1d95] via-[#6d28d9] to-[#2dd4bf]",
  discover: "from-[#6d28d9] via-[#8b5cf6] to-[#38bdf8]",
  iyou: "from-[#fb7185] via-[#fb923c] to-[#fde68a]",
  heshe: "from-[#38bdf8] via-[#818cf8] to-[#e879f9]",
  it: "from-[#2dd4bf] via-[#34d399] to-[#67e8f9]",
  wethey: "from-[#fbbf24] via-[#c4b5fd] to-[#86efac]",
  games: "from-[#e879f9] via-[#a78bfa] to-[#22d3ee]",
  contrast: "from-[#34d399] via-[#22d3ee] to-[#818cf8]",
  final: "from-[#5b21b6] via-[#db2777] to-[#f59e0b]",
  achieve: "from-[#fbbf24] via-[#fb7185] to-[#8b5cf6]",
};

const GAMES: { id: GameId; title: string; desc: string; emoji: string }[] = [
  { id: "match", title: "طابقي الصورة", desc: "اربطي كل صورة بالضمير", emoji: "🧩" },
  { id: "complete", title: "أكملي الجملة", desc: "ضعي الضمير داخل ___", emoji: "✏️" },
  { id: "picture", title: "اختاري من الصورة", desc: "انظري ثم قرّري", emoji: "🖼️" },
  { id: "drag", title: "اسحبي وأفلتي", desc: "أو اضغطي ثم ضعي", emoji: "🎯" },
];

const CONTRASTS: { id: ContrastId; title: string; desc: string; emoji: string }[] = [
  { id: "he-she", title: "He أم She؟", desc: "الولد والبنت", emoji: "👫" },
  { id: "we-they", title: "We أم They؟", desc: "نحن أم هم", emoji: "🤝" },
  { id: "i-you", title: "I أم You؟", desc: "أنا أم أنتِ", emoji: "🪞" },
  { id: "it-they", title: "It أم They؟", desc: "واحد أم جمع", emoji: "🐱" },
];

function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

function persist(data: SaveData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function En({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span dir="ltr" lang="en" className={cn("en inline-block", className)}>
      {children}
    </span>
  );
}

function VisualBox({ visual, className }: { visual: Visual; className?: string }) {
  if (visual.type === "img") {
    return (
      <img
        src={visual.src}
        alt={visual.alt}
        className={cn("mx-auto max-h-52 w-auto object-contain drop-shadow-xl anim-bob", className)}
      />
    );
  }
  return <ObjectArt kind={visual.kind} className={cn("h-44 w-full", className)} />;
}

function EnglishLine({ text, fill }: { text: string; fill?: string | null }) {
  const parts = text.split("___");
  return (
    <p dir="ltr" lang="en" className="en text-center text-2xl font-semibold text-indigo-950 sm:text-3xl md:text-4xl">
      {parts[0]}
      <span className="blank-slot mx-1 min-w-[4rem]">{fill || "___"}</span>
      {parts.slice(1).join("___")}
    </p>
  );
}

function SkyDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-amber-200 anim-twinkle"
          style={{
            left: `${(i * 17 + 4) % 100}%`,
            top: `${(i * 23 + 6) % 88}%`,
            animationDelay: `${i * 0.18}s`,
            fontSize: `${10 + (i % 16)}px`,
          }}
        >
          ✦
        </span>
      ))}
      <div className="blob absolute -top-24 -left-16 h-72 w-72 rounded-full bg-fuchsia-400/35 anim-float" />
      <div
        className="blob absolute -bottom-16 -right-10 h-80 w-80 rounded-full bg-cyan-300/30 anim-float"
        style={{ animationDelay: "1.1s" }}
      />
      <div
        className="blob absolute top-1/3 left-[40%] h-56 w-56 rounded-full bg-amber-300/25 anim-float"
        style={{ animationDelay: "0.5s" }}
      />
    </div>
  );
}

function Confetti() {
  const colors = ["#FBBF24", "#FB7185", "#2DD4BF", "#38BDF8", "#A78BFA", "#34D399", "#F472B6"];
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden no-print">
      {Array.from({ length: 42 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${(i * 19) % 100}%`,
            width: 8 + (i % 10),
            height: 12 + (i % 12),
            background: colors[i % colors.length],
            borderRadius: i % 2 ? "50%" : 2,
            animation: `confetti-fall ${3.6 + (i % 5)}s ${i * 0.1}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Btn({
  children,
  onClick,
  className,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "gold" | "soft";
}) {
  const styles = {
    primary:
      "bg-gradient-to-l from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-400/40 hover:brightness-110",
    ghost: "bg-white/20 text-white hover:bg-white/30 border border-white/40",
    gold: "bg-gradient-to-l from-amber-400 to-yellow-300 text-violet-900 shadow-lg shadow-amber-300/50 hover:brightness-105",
    soft: "bg-white text-violet-700 shadow-md hover:bg-violet-50",
  }[variant];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        audio.play("click");
        onClick?.();
      }}
      className={cn(
        "min-h-14 rounded-2xl px-6 text-lg font-extrabold transition touch-manipulation disabled:opacity-50",
        styles,
        className,
      )}
    >
      {children}
    </button>
  );
}

function PronounChip({ id, className }: { id: string; className?: string }) {
  const map: Record<string, string> = {
    I: "from-rose-400 to-orange-400",
    You: "from-amber-300 to-yellow-400",
    He: "from-sky-400 to-blue-500",
    She: "from-fuchsia-400 to-pink-500",
    It: "from-teal-400 to-emerald-500",
    We: "from-lime-400 to-green-500",
    They: "from-violet-500 to-purple-600",
  };
  return (
    <span
      dir="ltr"
      lang="en"
      className={cn(
        "en inline-flex min-w-[3.4rem] items-center justify-center rounded-xl bg-gradient-to-br px-3 py-1 text-xl font-bold text-white shadow",
        map[id] || "from-violet-400 to-purple-500",
        className,
      )}
    >
      {id}
    </span>
  );
}

function HeaderBar({
  name,
  score,
  stars,
  soundOn,
  onSound,
  onHome,
}: {
  name: string;
  score: number;
  stars: number;
  soundOn: boolean;
  onSound: () => void;
  onHome?: () => void;
}) {
  return (
    <header className="no-print sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 bg-violet-950/35 px-3 py-2 backdrop-blur-md sm:px-5">
      <div className="flex items-center gap-2">
        {onHome && (
          <button
            type="button"
            onClick={() => {
              audio.play("click");
              onHome();
            }}
            className="min-h-12 rounded-2xl bg-white/20 px-4 font-bold text-white touch-manipulation"
          >
            🗺️ الخريطة
          </button>
        )}
        <p className="hidden text-sm font-bold text-white sm:block md:text-base">{INITIATIVE_NAME}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {name && (
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold text-white">🌸 {name}</span>
        )}
        <span className="rounded-full bg-amber-300 px-3 py-1 text-sm font-black text-violet-900">⭐ {stars}</span>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-violet-700">النقاط {score}</span>
        <button
          type="button"
          onClick={onSound}
          className="anim-glow min-h-12 min-w-12 rounded-2xl bg-white text-2xl touch-manipulation"
          aria-label={soundOn ? "كتم الصوت" : "تشغيل الصوت"}
          title={soundOn ? "كتم الصوت" : "تشغيل الصوت"}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>
      </div>
    </header>
  );
}

function SaraTalk({ text }: { text: string }) {
  return (
    <div className="anim-pop flex items-end gap-3">
      <img src={IMAGES.sara} alt="سارة الدليل الذكي" className="h-24 w-24 anim-wiggle object-contain sm:h-28 sm:w-28" />
      <div className="relative max-w-xl rounded-3xl bg-white/95 p-4 text-right shadow-xl card-3d">
        <span className="mb-1 block text-xs font-black text-fuchsia-500">سارة — دليلكِ الذكي</span>
        <p className="text-base font-bold leading-relaxed text-violet-900 sm:text-lg">{text}</p>
      </div>
    </div>
  );
}

function FeedbackBox({
  ok,
  text,
  onNext,
  nextLabel,
}: {
  ok: boolean;
  text: string;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div
      className={cn(
        "anim-pop mt-4 rounded-3xl p-4 text-right shadow-lg",
        ok ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900",
      )}
    >
      <p className="text-lg font-extrabold">{ok ? "أحسنتِ يا بطلتي! 🌟" : "ليست الإجابة بعد… 💡"}</p>
      <p className="mt-1 text-base font-semibold leading-relaxed">{text}</p>
      <Btn onClick={onNext} variant={ok ? "gold" : "primary"} className="mt-4 w-full sm:w-auto">
        {nextLabel}
      </Btn>
    </div>
  );
}

function McqFlow({
  questions,
  onDone,
  onAward,
}: {
  questions: Mcq[];
  onDone: () => void;
  onAward: (points: number, star: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "wrong" | "correct" | "revealed">("idle");
  const [tries, setTries] = useState(0);
  const [opts, setOpts] = useState<string[]>(() => shuffle(questions[0].options));
  const [dead, setDead] = useState<string[]>([]);

  const q = questions[index];

  useEffect(() => {
    setOpts(shuffle(questions[index].options));
    setPicked(null);
    setStatus("idle");
    setTries(0);
    setDead([]);
  }, [index, questions]);

  const locked = status === "correct" || status === "revealed";

  function choose(opt: string) {
    if (locked || dead.includes(opt)) return;
    audio.play("click");
    setPicked(opt);
    if (opt === q.answer) {
      audio.play("correct");
      audio.play("star");
      setStatus("correct");
      onAward(tries === 0 ? POINTS_PER_CORRECT : 5, true);
    } else if (tries + 1 >= 2) {
      audio.play("wrong");
      setStatus("revealed");
      setDead((d) => [...d, opt]);
    } else {
      audio.play("wrong");
      setStatus("wrong");
      setTries((t) => t + 1);
      setDead((d) => [...d, opt]);
    }
  }

  function goNext() {
    if (index + 1 >= questions.length) onDone();
    else setIndex((i) => i + 1);
  }

  return (
    <div className="anim-pop mx-auto max-w-4xl">
      <div className="mb-3 flex items-center justify-between text-white">
        <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">
          سؤال {index + 1} / {questions.length}
        </span>
        <div className="h-2 flex-1 mx-4 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-amber-300 transition-all"
            style={{ width: `${((index + (locked ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="rounded-[2rem] bg-white/95 p-4 shadow-2xl card-3d sm:p-6">
        <h3 className="text-xl font-black text-violet-800 sm:text-2xl">{q.promptAr}</h3>
        {q.visual && (
          <div className="my-4 rounded-3xl bg-gradient-to-br from-violet-50 to-cyan-50 p-3">
            <VisualBox visual={q.visual} />
            {q.caption && <p className="mt-2 text-center text-sm font-bold text-violet-500">{q.caption}</p>}
          </div>
        )}
        {q.sentence && (
          <div className="mb-4 rounded-2xl bg-violet-50 py-4">
            <EnglishLine text={q.sentence} fill={locked ? q.answer : status === "wrong" ? picked : picked} />
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {opts.map((opt) => {
            const isAnswer = opt === q.answer;
            const showGood = locked && isAnswer;
            const showBad = dead.includes(opt);
            const isArabic = /[\u0600-\u06FF]/.test(opt);
            return (
              <button
                key={opt}
                type="button"
                disabled={locked || showBad}
                onClick={() => choose(opt)}
                className={cn(
                  "min-h-16 rounded-2xl border-4 px-4 py-3 text-xl font-black touch-manipulation transition",
                  showGood && "border-emerald-400 bg-emerald-100 text-emerald-800",
                  showBad && "border-rose-300 bg-rose-50 text-rose-400 line-through",
                  !showGood && !showBad && picked === opt && "border-amber-300 bg-amber-50",
                  !showGood && !showBad && picked !== opt && "border-violet-100 bg-violet-50 text-violet-800 hover:border-violet-300",
                  status === "wrong" && picked === opt && "anim-shake",
                )}
              >
                <span dir={isArabic ? "rtl" : "ltr"} lang={isArabic ? "ar" : "en"} className={isArabic ? "" : "en"}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
        {status === "wrong" && (
          <FeedbackBox
            ok={false}
            text="حاولي مرة أخرى بعد قراءة الجملة والصورة بهدوء."
            onNext={() => setStatus("idle")}
            nextLabel="أحاول مرة أخرى"
          />
        )}
        {status === "correct" && (
          <FeedbackBox ok text={q.ok} onNext={goNext} nextLabel={index + 1 >= questions.length ? "إنهاء المحطة 🎉" : "السؤال التالي"} />
        )}
        {status === "revealed" && (
          <FeedbackBox
            ok={false}
            text={`${q.bad} الإجابة الصحيحة: ${q.answer}`}
            onNext={goNext}
            nextLabel={index + 1 >= questions.length ? "إنهاء المحطة" : "السؤال التالي"}
          />
        )}
      </div>
    </div>
  );
}

function PairPlay({
  items,
  mode,
  onDone,
  onAward,
}: {
  items: MatchItem[];
  mode: "match" | "drag";
  onDone: () => void;
  onAward: (points: number, star: boolean) => void;
}) {
  const [pics] = useState(() => shuffle(items));
  const [chips] = useState<PronounId[]>(() => shuffle(items.map((i) => i.pronoun)));
  const [holding, setHolding] = useState<PronounId | null>(null);
  const [pickedPic, setPickedPic] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, PronounId>>({});
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [doneAll, setDoneAll] = useState(false);

  const remaining = chips.filter((c) => !Object.values(placed).includes(c));

  function attempt(picId: string, pronoun: PronounId) {
    if (feedback || placed[picId]) return;
    const item = items.find((i) => i.id === picId)!;
    if (item.pronoun === pronoun) {
      audio.play("correct");
      audio.play("star");
      const next = { ...placed, [picId]: pronoun };
      setPlaced(next);
      onAward(POINTS_PER_CORRECT, true);
      setFeedback({ ok: true, text: `أحسنتِ! هذه الصورة تطابق الضمير ${pronoun}.` });
      if (Object.keys(next).length === items.length) setDoneAll(true);
    } else {
      audio.play("wrong");
      setFeedback({
        ok: false,
        text: `ليست مطابقة. هذه الصورة للضمير ${item.pronoun} وليست ${pronoun}. انظري للصورة والوصف ثم حاولي.`,
      });
    }
    setHolding(null);
    setPickedPic(null);
  }

  function onPic(id: string) {
    if (feedback || placed[id]) return;
    audio.play("click");
    if (mode === "drag" && holding) {
      attempt(id, holding);
      return;
    }
    if (mode === "match") {
      if (holding) {
        attempt(id, holding);
        return;
      }
      setPickedPic(id);
    }
  }

  function onChip(p: PronounId) {
    if (feedback) return;
    audio.play("click");
    if (mode === "match" && pickedPic) {
      attempt(pickedPic, p);
      return;
    }
    setHolding(p);
  }

  return (
    <div className="anim-pop mx-auto max-w-6xl">
      <p className="mb-3 rounded-2xl bg-white/20 px-4 py-2 text-center font-bold text-white">
        {mode === "drag"
          ? "اضغطي الضمير ثم اضغطي الصورة، أو اسحبي الضمير وأفلتيه فوق الصورة."
          : "اضغطي صورة ثم اضغطي الضمير المناسب لها. انتظري التغذية الراجعة قبل الزوج التالي."}
      </p>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {pics.map((item) => {
            const filled = placed[item.id];
            return (
              <button
                key={item.id}
                type="button"
                disabled={!!filled || !!feedback}
                onClick={() => onPic(item.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const p = e.dataTransfer.getData("text/plain") as PronounId;
                  if (p) attempt(item.id, p);
                }}
                className={cn(
                  "rounded-3xl border-4 bg-white p-2 text-center shadow-lg touch-manipulation",
                  filled ? "border-emerald-400" : pickedPic === item.id ? "border-amber-400" : "border-transparent",
                  holding && !filled ? "drag-over" : "",
                )}
              >
                <VisualBox visual={item.visual} className="max-h-32" />
                <p className="mt-1 text-sm font-bold text-violet-700">{item.label}</p>
                {filled && (
                  <div className="mt-1">
                    <PronounChip id={filled} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap content-start justify-center gap-3 rounded-3xl bg-white/20 p-3 lg:w-44 lg:flex-col">
          {remaining.map((p) => (
            <button
              key={p}
              type="button"
              draggable
              disabled={!!feedback}
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", p);
                setHolding(p);
              }}
              onClick={() => onChip(p)}
              className={cn(
                "min-h-14 rounded-2xl px-2 py-2 touch-manipulation",
                holding === p ? "ring-4 ring-amber-300 scale-105" : "",
              )}
            >
              <PronounChip id={p} className="min-w-[4.5rem] py-2 text-2xl" />
            </button>
          ))}
        </div>
      </div>
      {feedback && (
        <div className="mx-auto max-w-2xl">
          <FeedbackBox
            ok={feedback.ok}
            text={feedback.text}
            onNext={() => {
              setFeedback(null);
              if (doneAll) onDone();
            }}
            nextLabel={doneAll ? "أنهيتُ اللعبة 🎉" : "متابعة"}
          />
        </div>
      )}
    </div>
  );
}

function TeachPager({
  pages,
  onStartQuiz,
}: {
  pages: TeachPage[];
  onStartQuiz: () => void;
}) {
  const [i, setI] = useState(0);
  const p = pages[i];
  return (
    <div className="anim-pop mx-auto max-w-5xl">
      <div className={cn("overflow-hidden rounded-[2rem] bg-gradient-to-br p-1 shadow-2xl", p.accent)}>
        <div className="rounded-[1.85rem] bg-white/95 p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <PronounChip id={p.badge} className="text-3xl py-2 min-w-[4.8rem]" />
            <h2 className="text-2xl font-black text-violet-800 sm:text-3xl">{p.title}</h2>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-violet-50 p-4">
              <VisualBox visual={p.visual} />
            </div>
            <div>
              <p className="text-lg font-bold leading-relaxed text-violet-900">{p.body}</p>
              <ul className="mt-4 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="rounded-2xl bg-amber-50 px-4 py-2 font-bold text-violet-800">
                    ⭐ {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {p.examples.map((ex) => (
              <div key={ex.en} className="rounded-2xl bg-gradient-to-br from-cyan-50 to-violet-50 p-3 text-center">
                <p dir="ltr" lang="en" className="en text-xl font-bold text-indigo-800">
                  {ex.en}
                </p>
                <p className="mt-1 text-sm font-bold text-violet-500">{ex.ar}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <Btn variant="soft" disabled={i === 0} onClick={() => setI((x) => Math.max(0, x - 1))}>
              السابق
            </Btn>
            {i < pages.length - 1 ? (
              <Btn
                onClick={() => {
                  audio.play("whoosh");
                  setI((x) => x + 1);
                }}
              >
                التالي
              </Btn>
            ) : (
              <Btn
                variant="gold"
                onClick={() => {
                  audio.play("whoosh");
                  onStartQuiz();
                }}
              >
                هيا نتمرّن ✨
              </Btn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverLesson({ onStartQuiz }: { onStartQuiz: () => void }) {
  const [open, setOpen] = useState<PronounId | null>(null);
  const [seen, setSeen] = useState<PronounId[]>([]);
  const current = PRONOUNS.find((p) => p.id === open);
  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PRONOUNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              audio.play("whoosh");
              setOpen(p.id);
              setSeen((s) => (s.includes(p.id) ? s : [...s, p.id]));
            }}
            className={cn(
              "anim-pop rounded-3xl bg-white/95 p-3 text-center shadow-xl card-3d touch-manipulation",
              seen.includes(p.id) && "ring-4 ring-amber-300",
            )}
          >
            <VisualBox visual={p.visual} className="max-h-28" />
            <div className="mt-2">
              <PronounChip id={p.id} />
            </div>
            <p className="mt-2 text-sm font-extrabold text-violet-800">{p.ar}</p>
          </button>
        ))}
        <div className="rounded-3xl bg-white/20 p-4 text-white sm:col-span-3 lg:col-span-1">
          <p className="font-bold">جدول am / is / are</p>
          <div className="mt-2 space-y-1 text-sm">
            {BE_TABLE.map((r) => (
              <p key={r.p} dir="ltr" lang="en" className="en rounded-xl bg-white/15 px-2 py-1">
                {r.p} → {r.v}
              </p>
            ))}
          </div>
        </div>
      </div>
      {current && (
        <div className="anim-pop mt-4 rounded-[2rem] bg-white p-5 shadow-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <PronounChip id={current.id} className="text-3xl py-2" />
            <div>
              <h3 className="text-2xl font-black text-violet-800">
                <En>{current.id}</En> = {current.ar}
              </h3>
              <p className="font-bold text-violet-500">{current.arDetail}</p>
            </div>
          </div>
          <p className="mt-3 text-lg font-bold text-violet-900">{current.usage}</p>
          <p className="mt-2 rounded-2xl bg-amber-50 px-4 py-2 font-bold text-amber-800">💡 {current.tip}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {current.examples.map((ex) => (
              <div key={ex.en} className="rounded-2xl bg-violet-50 p-3 text-center">
                <p dir="ltr" lang="en" className="en text-xl font-bold text-indigo-800">
                  {ex.en}
                </p>
                <p className="text-sm font-bold text-violet-500">{ex.ar}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 flex justify-center">
        <Btn variant="gold" disabled={seen.length < 7} onClick={onStartQuiz} className="min-w-64">
          {seen.length < 7 ? `افتحي البطاقات (${seen.length}/7)` : "فهمتُ الضمائر، لنتمرّن ✨"}
        </Btn>
      </div>
    </div>
  );
}

function StationView({
  id,
  onExit,
  onComplete,
  onAward,
  gamesDone,
  contrastDone,
  markGame,
  markContrast,
}: {
  id: StationId;
  onExit: () => void;
  onComplete: (id: StationId) => void;
  onAward: (points: number, star: boolean) => void;
  gamesDone: GameId[];
  contrastDone: ContrastId[];
  markGame: (g: GameId) => void;
  markContrast: (c: ContrastId) => void;
}) {
  const meta = STATIONS.find((s) => s.id === id)!;
  const [phase, setPhase] = useState<"hub" | "teach" | "quiz" | "play">("hub");
  const [play, setPlay] = useState<GameId | ContrastId | null>(null);

  useEffect(() => {
    if (id === "games" || id === "contrast") setPhase("hub");
    else if (id === "final") setPhase("quiz");
    else setPhase(id === "discover" ? "teach" : "teach");
  }, [id]);

  const quizFor = useMemo(() => {
    switch (id) {
      case "discover":
        return DISCOVER_Q;
      case "iyou":
        return IYOU_Q;
      case "heshe":
        return HESHE_Q;
      case "it":
        return IT_Q;
      case "wethey":
        return WETHEY_Q;
      case "final":
        return FINAL_Q;
      default:
        return [];
    }
  }, [id]);

  const pages =
    id === "iyou" ? IYOU_PAGES : id === "heshe" ? HESHE_PAGES : id === "it" ? IT_PAGES : id === "wethey" ? WETHEY_PAGES : [];

  function finishStation() {
    audio.play("celebrate");
    onComplete(id);
    if (id !== "final") onExit();
  }

  return (
    <div className="relative min-h-screen">
      <SkyDecor />
      <div className="relative z-10 mx-auto max-w-6xl px-3 pb-16 pt-4 sm:px-6">
        <SaraTalk text={meta.sara} />
        <div className="my-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-white drop-shadow sm:text-3xl">
            {meta.emoji} {meta.title}
          </h2>
        </div>

        {id === "discover" && phase === "teach" && <DiscoverLesson onStartQuiz={() => setPhase("quiz")} />}
        {pages.length > 0 && phase === "teach" && <TeachPager pages={pages} onStartQuiz={() => setPhase("quiz")} />}

        {phase === "quiz" && quizFor.length > 0 && (
          <McqFlow questions={quizFor} onAward={onAward} onDone={finishStation} />
        )}

        {id === "games" && phase === "hub" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {GAMES.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  audio.play("whoosh");
                  setPlay(g.id);
                  setPhase("play");
                }}
                className="rounded-[2rem] bg-white/95 p-6 text-right shadow-xl card-3d touch-manipulation"
              >
                <div className="text-4xl">{g.emoji}</div>
                <h3 className="mt-2 text-2xl font-black text-violet-800">{g.title}</h3>
                <p className="font-bold text-violet-500">{g.desc}</p>
                {gamesDone.includes(g.id) && <p className="mt-2 font-black text-emerald-600">مكتملة ✅</p>}
              </button>
            ))}
          </div>
        )}

        {id === "contrast" && phase === "hub" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {CONTRASTS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  audio.play("whoosh");
                  setPlay(g.id);
                  setPhase("play");
                }}
                className="rounded-[2rem] bg-white/95 p-6 text-right shadow-xl card-3d touch-manipulation"
              >
                <div className="text-4xl">{g.emoji}</div>
                <h3 className="mt-2 text-2xl font-black text-violet-800">{g.title}</h3>
                <p className="font-bold text-violet-500">{g.desc}</p>
                {contrastDone.includes(g.id) && <p className="mt-2 font-black text-emerald-600">مكتملة ✅</p>}
              </button>
            ))}
          </div>
        )}

        {phase === "play" && play === "match" && (
          <PairPlay
            items={MATCH_ITEMS}
            mode="match"
            onAward={onAward}
            onDone={() => {
              markGame("match");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}
        {phase === "play" && play === "drag" && (
          <PairPlay
            items={DRAG_ITEMS}
            mode="drag"
            onAward={onAward}
            onDone={() => {
              markGame("drag");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}
        {phase === "play" && play === "complete" && (
          <McqFlow
            questions={COMPLETE_Q}
            onAward={onAward}
            onDone={() => {
              markGame("complete");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}
        {phase === "play" && play === "picture" && (
          <McqFlow
            questions={PICTURE_Q}
            onAward={onAward}
            onDone={() => {
              markGame("picture");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}
        {phase === "play" && play === "he-she" && (
          <McqFlow
            questions={HESHE_ONLY}
            onAward={onAward}
            onDone={() => {
              markContrast("he-she");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}
        {phase === "play" && play === "we-they" && (
          <McqFlow
            questions={WETHEY_ONLY}
            onAward={onAward}
            onDone={() => {
              markContrast("we-they");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}
        {phase === "play" && play === "i-you" && (
          <McqFlow
            questions={IYOU_ONLY}
            onAward={onAward}
            onDone={() => {
              markContrast("i-you");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}
        {phase === "play" && play === "it-they" && (
          <McqFlow
            questions={ITTHEY_ONLY}
            onAward={onAward}
            onDone={() => {
              markContrast("it-they");
              setPhase("hub");
              setPlay(null);
            }}
          />
        )}

        {id === "games" && phase === "hub" && gamesDone.length >= 4 && (
          <div className="mt-6 flex justify-center">
            <Btn variant="gold" onClick={finishStation}>
              أتممتُ الملعب، عودة للخريطة 🌈
            </Btn>
          </div>
        )}
        {id === "contrast" && phase === "hub" && contrastDone.length >= 4 && (
          <div className="mt-6 flex justify-center">
            <Btn variant="gold" onClick={finishStation}>
              أتممتُ التمييز، عودة للخريطة 🌈
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function MapView({
  completed,
  gamesDone,
  contrastDone,
  onOpen,
  onCertificate,
}: {
  completed: StationId[];
  gamesDone: GameId[];
  contrastDone: ContrastId[];
  onOpen: (id: StationId) => void;
  onCertificate?: () => void;
}) {
  return (
    <div className="relative min-h-[calc(100vh-72px)]">
      <SkyDecor />
      <div className="relative z-10 mx-auto max-w-6xl px-3 py-6 sm:px-6">
        <SaraTalk text="اختاري محطة مفتوحة. أكملي المحطات بالترتيب، ويمكنكِ إعادة أي محطة أنهيتِها." />
        {completed.includes("final") && onCertificate && (
          <div className="mt-4 flex justify-center">
            <Btn variant="gold" onClick={onCertificate}>
              عرض الشهادة 🏅
            </Btn>
          </div>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATIONS.map((s, idx) => {
            const prev = idx === 0 ? true : completed.includes(STATIONS[idx - 1].id);
            const done = completed.includes(s.id);
            const extra =
              s.id === "games" ? `${gamesDone.length}/4 ألعاب` : s.id === "contrast" ? `${contrastDone.length}/4 تحديات` : "";
            const locked = !prev && !done;
            return (
              <button
                key={s.id}
                type="button"
                disabled={locked}
                onClick={() => {
                  if (locked) return;
                  audio.play("whoosh");
                  onOpen(s.id);
                }}
                className={cn(
                  "relative overflow-hidden rounded-[1.8rem] p-5 text-right shadow-xl touch-manipulation",
                  locked ? "station-locked bg-white/40" : "bg-white/95 card-3d hover:-translate-y-1 transition",
                )}
              >
                <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-black text-white">
                  {s.num}
                </span>
                <div className="text-4xl">{s.emoji}</div>
                <h3 className="mt-2 text-xl font-black text-violet-800">{s.title}</h3>
                <p className="text-sm font-bold text-violet-500">{s.subtitle}</p>
                {extra && <p className="mt-1 text-xs font-bold text-fuchsia-500">{extra}</p>}
                <p className="mt-3 font-black">
                  {locked ? "🔒 مغلقة" : done ? "✅ مكتملة — مراجعة" : "▶️ ادخلِي"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StartView({
  name,
  setName,
  hasSave,
  onStart,
  onContinue,
  onReset,
}: {
  name: string;
  setName: (v: string) => void;
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <img src={IMAGES.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/75 via-fuchsia-700/55 to-cyan-700/70" />
      <SkyDecor />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-10 text-center">
        <p className="anim-pop rounded-full bg-white/20 px-4 py-1 text-sm font-bold text-amber-100 backdrop-blur">
          رحلة تعليمية في الضمائر الإنجليزية
        </p>
        <h1 className="anim-pop mt-4 text-4xl font-black leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
          {INITIATIVE_NAME}
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-bold text-amber-50 sm:text-xl">{INITIATIVE_QUOTE}</p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
          <img src={IMAGES.sara} alt="سارة" className="h-40 w-40 anim-float object-contain drop-shadow-2xl" />
          <div className="rounded-3xl bg-white/95 p-5 text-right shadow-2xl card-3d">
            <p className="text-lg font-extrabold text-violet-800">مرحباً يا بطلتي! أنا سارة 💜</p>
            <p className="mt-1 font-bold text-violet-600">
              اليوم نتعلم <En className="text-fuchsia-600">Subject Pronouns</En>:{" "}
              <En>I You He She It We They</En>
            </p>
          </div>
        </div>
        <label className="mt-8 block w-full max-w-md text-right font-bold text-white">
          اكتبي اسمكِ لنجعله على الشهادة
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسمكِ الجميل"
            className="mt-2 min-h-14 w-full rounded-2xl border-4 border-amber-200 bg-white px-4 text-xl font-black text-violet-800 outline-none"
          />
        </label>
        <div className="mt-6 flex w-full max-w-md flex-col gap-3">
          <Btn variant="gold" className="w-full text-xl" onClick={onStart} disabled={name.trim().length < 2}>
            ابدئي الرحلة 🚀
          </Btn>
          {hasSave && (
            <>
              <Btn variant="soft" className="w-full" onClick={onContinue}>
                متابعة التعلّم
              </Btn>
              <Btn variant="ghost" className="w-full" onClick={onReset}>
                بدء من جديد
              </Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AchieveView({
  name,
  score,
  stars,
  onCert,
}: {
  name: string;
  score: number;
  stars: number;
  onCert: () => void;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <Confetti />
      <SkyDecor />
      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] bg-white/95 p-8 text-center shadow-2xl card-3d">
        <img src={IMAGES.sara} alt="سارة" className="mx-auto h-32 w-32 anim-bob object-contain" />
        <h2 className="text-3xl font-black text-violet-800 sm:text-4xl">أحسنتِ يا {name}! 🎉</h2>
        <p className="mt-2 text-lg font-bold text-violet-600">أتممتِ رحلة Subject Pronouns بنجاح.</p>
        <p className="mt-4 text-xl font-black text-amber-600">⭐ {stars} نجمة &nbsp;•&nbsp; {score} نقطة</p>
        <p className="mt-4 font-bold text-violet-700">{INITIATIVE_NAME}</p>
        <p className="mt-1 text-sm font-semibold text-violet-500">{INITIATIVE_QUOTE}</p>
        <Btn variant="gold" className="mt-6 w-full" onClick={onCert}>
          اعرضِي شهادتكِ 🏅
        </Btn>
      </div>
    </div>
  );
}

function CertificateView({
  name,
  score,
  stars,
  onBack,
}: {
  name: string;
  score: number;
  stars: number;
  onBack: () => void;
}) {
  const date = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="print-only-cert min-h-screen bg-gradient-to-br from-violet-700 via-fuchsia-600 to-cyan-500 px-3 py-6 sm:px-6">
      <div className="no-print mx-auto mb-4 flex max-w-5xl flex-wrap justify-between gap-3">
        <Btn variant="soft" onClick={onBack}>
          العودة
        </Btn>
        <Btn
          variant="gold"
          onClick={() => {
            window.print();
          }}
        >
          طباعة الشهادة أو حفظها PDF
        </Btn>
      </div>
      <p className="no-print mx-auto mb-4 max-w-5xl text-center font-bold text-white">
        من نافذة الطباعة اختاري «حفظ كـ PDF» أو أرسليها للطابعة.
      </p>
      <article className="certificate-sheet relative mx-auto max-w-5xl overflow-hidden rounded-[1.6rem] border-[10px] border-amber-300 bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-6 shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute inset-3 rounded-[1.1rem] border-4 border-violet-300" />
        <div className="relative text-center">
          <p className="text-sm font-black tracking-wide text-violet-500 sm:text-base">{INITIATIVE_NAME}</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-bold text-fuchsia-700 sm:text-base">{INITIATIVE_QUOTE}</p>
          <div className="my-4 flex justify-center gap-3">
            <span className="anim-twinkle text-3xl">🌟</span>
            <span className="text-3xl">🌉</span>
            <span className="anim-twinkle text-3xl">🌟</span>
          </div>
          <h2 className="text-3xl font-black text-violet-800 sm:text-5xl">شهادة إتمام</h2>
          <p className="mt-2 text-lg font-bold text-violet-500">تُمنح هذه الشهادة إلى المتعلمة</p>
          <p className="my-4 inline-block rounded-2xl bg-gradient-to-l from-amber-200 to-yellow-100 px-8 py-2 text-3xl font-black text-violet-900 sm:text-4xl">
            {name}
          </p>
          <p className="mx-auto max-w-2xl text-base font-bold leading-relaxed text-violet-800 sm:text-xl">
            لإتمامها رحلة تعلم ضمائر الفاعل
            <br />
            <En className="mt-1 text-2xl text-fuchsia-700">Subject Pronouns: I, You, He, She, It, We, They</En>
          </p>
          <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-3">
            <div className="rounded-2xl bg-violet-100 py-3 font-black text-violet-800">⭐ {stars} نجمة</div>
            <div className="rounded-2xl bg-cyan-100 py-3 font-black text-cyan-800">{score} نقطة</div>
          </div>
          <p className="mt-5 font-bold text-violet-600">التاريخ: {date}</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Seal className="h-20 w-20" />
            <p className="font-black text-amber-600">متعلمة متميزة</p>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["I", "You", "He", "She", "It", "We", "They"].map((p) => (
              <PronounChip key={p} id={p} />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function App() {
  const saved = useMemo(() => loadSave(), []);
  const [hasSave, setHasSave] = useState(!!saved?.name);
  const [screen, setScreen] = useState<Screen>("start");
  const [station, setStation] = useState<StationId | null>(null);
  const [name, setName] = useState(saved?.name || bridgeStudentName());
  const [score, setScore] = useState(saved?.score || 0);
  const earnedThisVisit = useRef(false);
  useEffect(() => {
    if (screen === "achieve" && earnedThisVisit.current) reportCompleted(score, BRIDGE_MAX_POINTS);
  }, [screen, score]);
  const [stars, setStars] = useState(saved?.stars || 0);
  const [completed, setCompleted] = useState<StationId[]>(saved?.completed || []);
  const [gamesDone, setGamesDone] = useState<GameId[]>(saved?.gamesDone || []);
  const [contrastDone, setContrastDone] = useState<ContrastId[]>(saved?.contrastDone || []);
  const [soundOn, setSoundOn] = useState(saved?.soundOn ?? true);

  useEffect(() => {
    if (!name.trim()) return;
    persist({ name, score, stars, completed, gamesDone, contrastDone, soundOn });
  }, [name, score, stars, completed, gamesDone, contrastDone, soundOn]);

  useEffect(() => {
    audio.setEnabled(soundOn);
    if (soundOn && screen !== "start") audio.startMusic();
    else if (!soundOn) audio.stopMusic();
  }, [soundOn, screen]);

  const themeKey = screen === "station" && station ? STATIONS.find((s) => s.id === station)?.theme || "map" : screen;
  const bg = THEMES[themeKey] || THEMES.map;

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    audio.setEnabled(next);
    if (next) {
      audio.unlock();
      audio.startMusic();
      audio.play("click");
    } else {
      audio.stopMusic();
    }
  }

  function award(points: number, star: boolean) {
    setScore((s) => s + points);
    if (star) setStars((s) => s + 1);
  }

  function completeStation(id: StationId) {
    setCompleted((c) => (c.includes(id) ? c : [...c, id]));
    if (id === "final") {
      audio.play("celebrate");
      earnedThisVisit.current = true;
      setScreen("achieve");
      setStation(null);
    }
  }

  function markGame(g: GameId) {
    setGamesDone((d) => {
      const next = d.includes(g) ? d : [...d, g];
      if (next.length >= 4) {
        setCompleted((c) => (c.includes("games") ? c : [...c, "games"]));
      }
      return next;
    });
  }
  function markContrast(c: ContrastId) {
    setContrastDone((d) => {
      const next = d.includes(c) ? d : [...d, c];
      if (next.length >= 4) {
        setCompleted((x) => (x.includes("contrast") ? x : [...x, "contrast"]));
      }
      return next;
    });
  }

  function begin(fresh: boolean) {
    audio.unlock();
    if (soundOn) audio.startMusic();
    audio.play("whoosh");
    if (fresh) {
      setScore(0);
      setStars(0);
      setCompleted([]);
      setGamesDone([]);
      setContrastDone([]);
    }
    setScreen("map");
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br print:bg-white", bg)}>
      {screen !== "start" && (
        <HeaderBar
          name={name}
          score={score}
          stars={stars}
          soundOn={soundOn}
          onSound={toggleSound}
          onHome={screen !== "certificate" ? () => { setScreen("map"); setStation(null); } : undefined}
        />
      )}
      {screen === "start" && (
        <div className="no-print">
          <button
            type="button"
            onClick={toggleSound}
            className="anim-glow no-print fixed left-4 top-4 z-40 min-h-14 min-w-14 rounded-2xl bg-white text-2xl shadow-xl"
            aria-label={soundOn ? "كتم الصوت" : "تشغيل الصوت"}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <StartView
            name={name}
            setName={setName}
            hasSave={hasSave}
            onStart={() => begin(true)}
            onContinue={() => begin(false)}
            onReset={() => {
              localStorage.removeItem(STORAGE_KEY);
              setHasSave(false);
              setName("");
              setScore(0);
              setStars(0);
              setCompleted([]);
              setGamesDone([]);
              setContrastDone([]);
            }}
          />
        </div>
      )}
      {screen === "map" && (
        <MapView
          completed={completed}
          gamesDone={gamesDone}
          contrastDone={contrastDone}
          onCertificate={() => { reportCertificate(score, BRIDGE_MAX_POINTS, "رحلة تعليمية – Subject Pronouns"); setScreen("certificate"); }}
          onOpen={(id) => {
            setStation(id);
            setScreen("station");
          }}
        />
      )}
      {screen === "station" && station && (
        <StationView
          id={station}
          gamesDone={gamesDone}
          contrastDone={contrastDone}
          markGame={markGame}
          markContrast={markContrast}
          onAward={award}
          onComplete={completeStation}
          onExit={() => {
            if (station === "final" && completed.includes("final")) return;
            setScreen("map");
            setStation(null);
          }}
        />
      )}
      {screen === "achieve" && (
        <AchieveView
          name={name.trim() || "المتعلمة المجتهدة"}
          score={score}
          stars={stars}
          onCert={() => { reportCertificate(score, BRIDGE_MAX_POINTS, "رحلة تعليمية – Subject Pronouns"); setScreen("certificate"); }}
        />
      )}
      {screen === "certificate" && (
        <CertificateView
          name={name.trim() || "المتعلمة المجتهدة"}
          score={score}
          stars={stars}
          onBack={() => setScreen("achieve")}
        />
      )}
    </div>
  );
}
