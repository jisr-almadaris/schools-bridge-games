import { reportCompleted, reportCertificate, bridgeStudentName } from "./bridge";
import { useEffect, useMemo, useRef, useState } from "react";
import { audio } from "./audio";
import { CHALLENGES, VAULT_CODE, BADGES, INITIATIVE, PRONOUNS, type Challenge } from "./data";
import Detective from "./components/Detective";
import ClueSvg from "./components/ClueSvg";
import Stars from "./components/Stars";
import Certificate from "./components/Certificate";
import PronounGuide from "./components/PronounGuide";
import PronounIcon from "./components/PronounIcon";

type Screen =
  | "start"
  | "game"
  | "review"
  | "vault"
  | "achievement"
  | "certificate";
type Feedback = "idle" | "wrong" | "correct";

const LS = {
  name: "jm_name",
  solved: "jm_solved",
  score: "jm_score",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [nameDraft, setNameDraft] = useState(bridgeStudentName());
  const [name, setName] = useState(bridgeStudentName());
  const [solved, setSolved] = useState<boolean[]>(Array(CHALLENGES.length).fill(false));
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);

  // scene / interaction state
  const [entering, setEntering] = useState(true);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongOptions, setWrongOptions] = useState<number[]>([]);

  // overlays
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [grammarOpen, setGrammarOpen] = useState(false);
  const [grammarFocus, setGrammarFocus] = useState("mine");
  const [grammarFromCase, setGrammarFromCase] = useState(false);
  const [rewardPop, setRewardPop] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  // match state
  const [matched, setMatched] = useState<string[]>([]);
  const [selOwner, setSelOwner] = useState<string | null>(null);
  const [wrongOwner, setWrongOwner] = useState<string | null>(null);

  // vault state
  const [vaultStage, setVaultStage] = useState<"walk" | "keypad" | "opening" | "open">(
    "walk",
  );
  const [entered, setEntered] = useState("");
  const [vaultWrong, setVaultWrong] = useState(false);

  const timers = useRef<number[]>([]);
  const addTimer = (id: number) => timers.current.push(id);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // ---------- load persisted ----------
  useEffect(() => {
    try {
      const n = localStorage.getItem(LS.name);
      const s = localStorage.getItem(LS.solved);
      const sc = localStorage.getItem(LS.score);
      if (n) {
        setName(n);
        setNameDraft(n);
      }
      if (s) {
        const arr = JSON.parse(s) as boolean[];
        if (Array.isArray(arr) && arr.length === CHALLENGES.length) {
          setSolved(arr);
          const firstUnsolved = arr.findIndex((x) => !x);
          setCurrentIndex(firstUnsolved === -1 ? CHALLENGES.length - 1 : firstUnsolved);
        }
      }
      if (sc) setScore(parseInt(sc) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  // ---------- persist ----------
  useEffect(() => {
    try {
      localStorage.setItem(LS.solved, JSON.stringify(solved));
      localStorage.setItem(LS.score, String(score));
      if (name) localStorage.setItem(LS.name, name);
    } catch {
      /* ignore */
    }
  }, [solved, score, name]);

  const solvedCount = solved.filter(Boolean).length;
  const current: Challenge = CHALLENGES[currentIndex];
  const pronouns = useMemo(
    () => (current.type === "match" && current.pairs ? shuffle(current.pairs) : []),
    [current],
  );

  // ---------- open grammar notebook ----------
  const openGrammar = (focusKey: string, fromCase: boolean) => {
    audio.click();
    setGrammarFocus(focusKey);
    setGrammarFromCase(fromCase);
    setGuideOpen(false);
    setGrammarOpen(true);
  };

  // ---------- mute ----------
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    audio.setMuted(next);
    if (!next) audio.startMusic();
  };

  // ---------- scene entering (walk) ----------
  useEffect(() => {
    if (screen !== "game") return;
    setEntering(true);
    setChallengeOpen(false);
    resetChallengeUI();
    // footsteps
    [0, 220, 440, 660, 880].forEach((d) =>
      addTimer(window.setTimeout(() => audio.step(), d)),
    );
    const t = window.setTimeout(() => setEntering(false), 1050);
    addTimer(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, screen]);

  function resetChallengeUI() {
    setFeedback("idle");
    setSelected(null);
    setWrongOptions([]);
    setMatched([]);
    setSelOwner(null);
    setWrongOwner(null);
  }

  // ---------- start ----------
  const startGame = () => {
    const finalName = nameDraft.trim() || "المحققة";
    setName(finalName);
    audio.startMusic();
    audio.click();
    setScreen("game");
  };

  const resetAll = () => {
    setSolved(Array(CHALLENGES.length).fill(false));
    setScore(0);
    setCurrentIndex(0);
    resetChallengeUI();
    try {
      localStorage.removeItem(LS.solved);
      localStorage.removeItem(LS.score);
    } catch {
      /* ignore */
    }
    setScreen("game");
  };

  // ---------- examine clue ----------
  const examineClue = () => {
    audio.lens();
    if (current.clue === "chest") audio.box();
    setChallengeOpen(true);
  };

  // ---------- choice answer ----------
  const answerChoice = (i: number) => {
    if (feedback === "correct") return;
    if (i === current.correct) {
      audio.correct();
      setSelected(i);
      setFeedback("correct");
      if (!solved[currentIndex]) {
        setScore((s) => s + 100);
      }
      setRewardPop(current.reward.label);
      audio.key();
    } else {
      audio.wrong();
      setSelected(i);
      setFeedback("wrong");
      setWrongOptions((w) => (w.includes(i) ? w : [...w, i]));
      // note: we do NOT auto-reset — the student sees a gentle message
      // and chooses to review the notebook or try again herself.
    }
  };

  // ---------- match answer ----------
  const pickOwner = (owner: string) => {
    if (matched.includes(owner)) return;
    audio.click();
    setSelOwner(owner);
  };
  const pickPronoun = (pronoun: string) => {
    if (!selOwner) return;
    const pair = current.pairs?.find((p) => p.owner === selOwner);
    if (pair && pair.pronoun === pronoun) {
      audio.correct();
      const next = [...matched, selOwner];
      setMatched(next);
      setSelOwner(null);
      if (next.length === current.pairs?.length) {
        // fully solved
        if (!solved[currentIndex]) setScore((s) => s + 100);
        setFeedback("correct");
        setRewardPop(current.reward.label);
        audio.key();
      }
    } else {
      audio.wrong();
      setWrongOwner(selOwner);
      const t = window.setTimeout(() => {
        setWrongOwner(null);
        setSelOwner(null);
      }, 550);
      addTimer(t);
    }
  };

  // ---------- continue after solving ----------
  const continueNext = () => {
    audio.click();
    const newSolved = [...solved];
    newSolved[currentIndex] = true;
    setSolved(newSolved);
    setChallengeOpen(false);
    setRewardPop(null);
    resetChallengeUI();
    const allDone = newSolved.every(Boolean);
    if (allDone) {
      // optional review station before the big case
      setScreen("review");
    } else {
      // go to next unsolved
      let next = currentIndex + 1;
      while (next < CHALLENGES.length && newSolved[next]) next++;
      if (next >= CHALLENGES.length) next = newSolved.findIndex((x) => !x);
      setCurrentIndex(next);
    }
  };

  // ---------- vault ----------
  const goVault = () => {
    setScreen("vault");
    setVaultStage("walk");
    setEntered("");
    setVaultWrong(false);
    [0, 260, 520, 780, 1040].forEach((d) =>
      addTimer(window.setTimeout(() => audio.step(), d)),
    );
    const t = window.setTimeout(() => setVaultStage("keypad"), 1500);
    addTimer(t);
  };

  const pressKey = (d: string) => {
    if (vaultStage !== "keypad") return;
    if (entered.length >= 4) return;
    audio.click();
    const next = entered + d;
    setEntered(next);
    if (next.length === 4) {
      const t = window.setTimeout(() => {
        if (next === VAULT_CODE) {
          setVaultStage("opening");
          audio.unlock();
          const t2 = window.setTimeout(() => {
            setVaultStage("open");
            setCelebrate(true);
            audio.celebrate();
          }, 1700);
          addTimer(t2);
        } else {
          audio.wrong();
          setVaultWrong(true);
          const t3 = window.setTimeout(() => {
            setVaultWrong(false);
            setEntered("");
          }, 800);
          addTimer(t3);
        }
      }, 250);
      addTimer(t);
    }
  };

  const goAchievement = () => {
    reportCompleted(score, CHALLENGES.length * 100);
    audio.click();
    setCelebrate(false);
    setScreen("achievement");
  };

  const earnedBadges = BADGES.filter((b) => solvedCount >= b.need);

  // ============================================================= RENDER
  return (
    <div dir="rtl" className="min-h-screen w-full text-white">
      {/* fixed initiative badge (always visible except certificate/print) */}
      {screen !== "certificate" && screen !== "start" && (
        <div className="no-print fixed left-1/2 top-2 z-40 -translate-x-1/2">
          <div className="rounded-full bg-gradient-to-l from-teal-600/90 to-indigo-700/90 px-4 py-1.5 text-center shadow-lg ring-1 ring-white/30 backdrop-blur">
            <span className="text-xs font-black sm:text-sm">{INITIATIVE.name}</span>
          </div>
        </div>
      )}

      {celebrate && <Stars count={50} />}

      {screen === "start" && renderStart()}
      {screen === "game" && renderGame()}
      {screen === "review" && renderReview()}
      {screen === "vault" && renderVault()}
      {screen === "achievement" && renderAchievement()}
      {screen === "certificate" && (
        <Certificate
          name={name}
          score={score}
          clues={solvedCount}
          onPrint={() => window.print()}
          onBack={() => setScreen("achievement")}
        />
      )}

      {/* Notebook & Guide overlays available in game/vault */}
      {notebookOpen && renderNotebook()}
      {guideOpen && renderGuide()}
      <PronounGuide
        open={grammarOpen}
        focus={grammarFocus}
        fromCase={grammarFromCase}
        onClose={() => setGrammarOpen(false)}
      />
    </div>
  );

  // ============================================================ START
  function renderStart() {
    const hasProgress = solvedCount > 0 && solvedCount < CHALLENGES.length;
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(/schools-bridge-games/game-possessives/images/scene-room.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 w-full max-w-2xl anim-fadeup">
          {/* Initiative branding - big and clear from first screen */}
          <div className="mx-auto mb-5 max-w-xl rounded-3xl bg-gradient-to-l from-teal-600 to-indigo-700 p-[3px] shadow-2xl">
            <div className="rounded-3xl bg-slate-950/80 px-6 py-4 text-center backdrop-blur">
              <div className="text-2xl font-black text-white sm:text-3xl">
                {INITIATIVE.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-teal-100 sm:text-base">
                {INITIATIVE.slogan}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6 text-center shadow-2xl ring-1 ring-white/15 backdrop-blur-md sm:p-8">
            <div className="mx-auto mb-3 flex items-center justify-center gap-3">
              <Detective size={110} />
            </div>
            <h1 className="text-3xl font-black text-amber-300 drop-shadow sm:text-4xl">
              🔎 لغز الممتلكات المفقودة
            </h1>
            <p className="font-en mt-1 text-lg font-semibold text-teal-200">
              Possessive Pronouns Mystery
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-indigo-100 sm:text-base">
              مرحبًا أيتها المحققة! عليكِ حلّ ٨ قضايا، وجمع الأدلّة والمفاتيح
              والأرقام، ثم فتح الخزانة الكبرى. هل أنتِ مستعدّة؟
            </p>

            <div className="mx-auto mt-5 max-w-sm text-right">
              <label className="mb-1 block text-sm font-bold text-amber-200">
                اكتبي اسمكِ أيتها المحققة:
              </label>
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startGame()}
                placeholder="اسم المحققة…"
                className="w-full rounded-xl border-2 border-amber-300/50 bg-white/10 px-4 py-3 text-center text-lg font-bold text-white placeholder-white/40 outline-none focus:border-amber-300"
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                onClick={startGame}
                className="rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-8 py-3 text-lg font-black text-slate-900 shadow-lg transition hover:scale-105 active:scale-95 anim-glow"
              >
                🚀 ابدئي المغامرة
              </button>
              {hasProgress && (
                <button
                  onClick={() => {
                    setName(nameDraft.trim() || name || "المحققة");
                    audio.startMusic();
                    setScreen("game");
                  }}
                  className="rounded-full bg-teal-500 px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
                >
                  ▶︎ متابعة ({solvedCount}/٨)
                </button>
              )}
              <button
                onClick={toggleMute}
                className="rounded-full bg-white/10 px-5 py-3 text-lg font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                {muted ? "🔇 الصوت مكتوم" : "🔊 الصوت يعمل"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================ GAME
  function renderGame() {
    const isMatch = current.type === "match";
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* scene background */}
        <div
          key={current.scene + currentIndex}
          className="absolute inset-0 anim-scene"
          style={{
            backgroundImage: `url(${current.scene})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${current.tint}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_35%,rgba(10,6,25,0.75)_100%)]" />

        {/* HUD */}
        {renderHUD()}

        {/* case title card */}
        <div className="absolute right-3 top-14 z-20 max-w-[62%] anim-fadeup sm:top-16">
          <div className="rounded-2xl bg-slate-950/70 p-3 shadow-xl ring-1 ring-amber-300/30 backdrop-blur">
            <div className="text-xs font-bold text-teal-300">
              📍 {current.room} · القضية {currentIndex + 1} من ٨
            </div>
            <div className="text-lg font-black text-amber-300">{current.title}</div>
            <div className="mt-0.5 inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-200">
              {current.badgeLabel}
            </div>
          </div>
        </div>

        {/* detective + clue on the floor */}
        {!challengeOpen && (
          <div className="absolute bottom-6 left-0 right-0 z-10 flex items-end justify-between px-4 sm:px-10">
            <div key={"det" + currentIndex} className={entering ? "anim-slidein" : ""}>
              <Detective walking={entering} size={130} />
            </div>

            {!entering && (
              <button
                onClick={examineClue}
                className="group flex flex-col items-center anim-pop"
                aria-label="افحصي الدليل"
              >
                <div className="relative rounded-3xl bg-white/10 p-3 ring-2 ring-amber-300/70 shadow-[0_0_35px_rgba(251,191,36,0.5)] anim-float backdrop-blur transition group-hover:scale-110 group-active:scale-95">
                  <ClueSvg name={current.clue} className="h-24 w-24 sm:h-28 sm:w-28" />
                  <span className="absolute -right-2 -top-2 text-2xl anim-wiggle">🔍</span>
                </div>
                <span className="mt-2 rounded-full bg-amber-400 px-4 py-1.5 text-sm font-black text-slate-900 shadow-lg">
                  🔍 افحصي الدليل
                </span>
              </button>
            )}
          </div>
        )}

        {/* challenge panel */}
        {challengeOpen && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-6">
            <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto scrollbar-thin rounded-3xl bg-gradient-to-b from-slate-900/95 to-indigo-950/95 p-5 shadow-2xl ring-1 ring-amber-300/30 backdrop-blur-md anim-pop sm:p-7">
              <div className="mb-3 flex items-center gap-3">
                <ClueSvg name={current.clue} className="h-14 w-14 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-teal-300">{current.badgeLabel}</div>
                  <div className="text-lg font-black text-amber-300">{current.title}</div>
                </div>
              </div>
              <p className="mb-4 rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-indigo-100">
                {current.story}
              </p>

              {isMatch ? renderMatch() : renderChoice()}

              {feedback !== "correct" && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      audio.click();
                      setGuideOpen(true);
                    }}
                    className="rounded-xl bg-teal-600/80 px-3 py-2 text-sm font-bold text-white ring-1 ring-teal-300/40 transition hover:bg-teal-600"
                  >
                    💡 الدليل الذكي
                  </button>
                  <button
                    onClick={() => openGrammar(current.focus, true)}
                    className="rounded-xl bg-amber-500/80 px-3 py-2 text-sm font-bold text-white ring-1 ring-amber-300/40 transition hover:bg-amber-500"
                  >
                    📖 دفتر المحققة
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderChoice() {
    return (
      <div>
        <div className="mb-4 rounded-2xl bg-slate-950/60 p-4 text-center ring-1 ring-white/10">
          <p className="font-en text-xl font-bold text-white sm:text-2xl">{current.prompt}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {current.options!.map((opt, i) => {
            const isCorrect = feedback === "correct" && i === current.correct;
            const isWrongSel = feedback === "wrong" && i === selected;
            const wasWrong = wrongOptions.includes(i) && feedback !== "correct";
            return (
              <button
                key={i}
                disabled={feedback === "correct"}
                onClick={() => answerChoice(i)}
                className={`rounded-2xl px-4 py-4 text-lg font-black shadow-lg ring-2 transition active:scale-95 ${
                  isCorrect
                    ? "bg-emerald-500 text-white ring-emerald-300"
                    : isWrongSel
                      ? "bg-rose-500/80 text-white ring-rose-300 anim-shake"
                      : wasWrong
                        ? "bg-white/5 text-white/40 ring-white/10"
                        : "bg-white/10 text-white ring-amber-300/40 hover:bg-amber-400/20 hover:ring-amber-300"
                }`}
              >
                <span className="font-en">{opt}</span>
              </button>
            );
          })}
        </div>
        {feedback === "wrong" && (
          <div className="mt-4 rounded-2xl bg-amber-400/15 p-4 text-center ring-2 ring-amber-300/50 anim-fadeup">
            <p className="text-base font-black text-amber-200">
              قريبة جدًا يا {name}! 🔎
            </p>
            <p className="mt-1 text-sm font-bold text-amber-100/90">
              هل تريدين مراجعة دفتر المحققة قبل المحاولة مرة أخرى؟
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                onClick={() => openGrammar(current.focus, true)}
                className="rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-5 py-2.5 text-sm font-black text-slate-900 shadow-lg transition hover:scale-105 active:scale-95"
              >
                📖 افتحي دفتر المحققة
              </button>
              <button
                onClick={() => {
                  audio.click();
                  setFeedback("idle");
                  setSelected(null);
                }}
                className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-black text-white ring-1 ring-white/30 transition hover:bg-white/25"
              >
                💪 سأحاول مرة أخرى
              </button>
            </div>
          </div>
        )}
        {feedback === "correct" && renderSuccess()}
      </div>
    );
  }

  function renderMatch() {
    const owners = current.pairs!;
    return (
      <div>
        <p className="mb-3 text-center text-sm font-bold text-teal-200">
          اضغطي على المالك ثم على الضمير المناسب ✨ ({matched.length}/{owners.length})
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-center text-xs font-bold text-amber-200">المالك</div>
            {owners.map((p) => {
              const done = matched.includes(p.owner);
              const sel = selOwner === p.owner;
              const wrong = wrongOwner === p.owner;
              return (
                <button
                  key={p.owner}
                  disabled={done}
                  onClick={() => pickOwner(p.owner)}
                  className={`w-full rounded-xl px-3 py-2.5 text-center font-black shadow ring-2 transition active:scale-95 ${
                    done
                      ? "bg-emerald-600 text-white/80 ring-emerald-400"
                      : wrong
                        ? "bg-rose-500 text-white ring-rose-300 anim-shake"
                        : sel
                          ? "bg-amber-400 text-slate-900 ring-amber-200"
                          : "bg-white/10 text-white ring-white/20 hover:bg-white/20"
                  }`}
                >
                  <span className="font-en">{p.owner}</span>
                  <span className="mr-1 text-xs opacity-80">({p.ownerAr})</span>
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            <div className="text-center text-xs font-bold text-amber-200">ضمير المِلكية</div>
            {pronouns.map((p) => {
              const done = matched.includes(p.owner);
              return (
                <button
                  key={p.pronoun}
                  disabled={done}
                  onClick={() => pickPronoun(p.pronoun)}
                  className={`w-full rounded-xl px-3 py-2.5 text-center font-black shadow ring-2 transition active:scale-95 ${
                    done
                      ? "bg-emerald-600/60 text-white/50 ring-emerald-400/40"
                      : "bg-white/10 text-white ring-teal-300/40 hover:bg-teal-400/20 hover:ring-teal-300"
                  }`}
                >
                  <span className="font-en">{p.pronoun}</span>
                </button>
              );
            })}
          </div>
        </div>
        {feedback === "correct" && renderSuccess()}
      </div>
    );
  }

  function renderSuccess() {
    return (
      <div className="mt-5 rounded-2xl bg-emerald-500/15 p-4 ring-2 ring-emerald-400/50 anim-fadeup">
        <div className="flex items-center gap-2 text-lg font-black text-emerald-300">
          ✅ إجابة صحيحة! +100 نقطة
        </div>
        <p className="mt-2 text-sm leading-relaxed text-emerald-50">{current.explain}</p>
        {rewardPop && (
          <div className="mt-3 rounded-xl bg-amber-400/20 p-3 text-center anim-pop ring-1 ring-amber-300/50">
            <div className="text-xs text-amber-200">حصلتِ على:</div>
            <div className="text-lg font-black text-amber-300">{rewardPop}</div>
          </div>
        )}
        <button
          onClick={continueNext}
          className="mt-4 w-full rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-6 py-3 text-lg font-black text-slate-900 shadow-lg transition hover:scale-[1.02] active:scale-95"
        >
          {solvedCount + 1 >= CHALLENGES.length && !solved[currentIndex]
            ? "🔐 التوجّه إلى الخزانة الكبرى"
            : "متابعة ← القضية التالية"}
        </button>
      </div>
    );
  }

  // ============================================================ HUD
  function renderHUD() {
    return (
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-2 p-2 sm:p-3">
        {/* left cluster: buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              audio.click();
              setGuideOpen(true);
            }}
            className="rounded-full bg-teal-600/80 px-3 py-2 text-xs font-bold text-white ring-1 ring-teal-300/40 backdrop-blur transition hover:bg-teal-600 sm:text-sm"
          >
            💡 الدليل الذكي
          </button>
          <button
            onClick={() =>
              openGrammar(screen === "vault" ? "all" : current.focus, false)
            }
            className="rounded-full bg-amber-500/80 px-3 py-2 text-xs font-bold text-white ring-1 ring-amber-300/40 backdrop-blur transition hover:bg-amber-500 sm:text-sm"
          >
            📖 دفتر المحققة
          </button>
          <button
            onClick={() => {
              audio.click();
              setNotebookOpen(true);
            }}
            className="rounded-full bg-slate-950/70 px-3 py-2 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-slate-800 sm:text-sm"
          >
            🗂️ الأدلة
          </button>
          <button
            onClick={toggleMute}
            className="rounded-full bg-slate-950/70 px-2.5 py-2 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-slate-800"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
        {/* right cluster: score + progress */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-amber-400 px-3 py-1.5 text-sm font-black text-slate-900 shadow">
            ⭐ {score}
          </div>
          <div className="hidden items-center gap-1 rounded-full bg-slate-950/70 px-3 py-2 ring-1 ring-white/20 backdrop-blur sm:flex">
            {CHALLENGES.map((c, i) => (
              <span
                key={c.id}
                className={`h-2.5 w-2.5 rounded-full ${
                  solved[i]
                    ? "bg-emerald-400"
                    : i === currentIndex
                      ? "bg-amber-300"
                      : "bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================ NOTEBOOK
  function renderNotebook() {
    const digits = CHALLENGES.filter((c, i) => solved[i] && c.reward.kind === "digit")
      .map((c) => (c.reward.kind === "digit" ? c.reward : null))
      .filter(Boolean)
      .sort((a, b) => (a!.pos - b!.pos));
    const keys = CHALLENGES.filter((c, i) => solved[i] && c.reward.kind === "key");
    const pieces = CHALLENGES.filter((c, i) => solved[i] && c.reward.kind === "piece");
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="max-h-[86vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-3xl bg-gradient-to-b from-amber-50 to-amber-100 p-5 text-slate-800 shadow-2xl anim-pop">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-indigo-900">🗂️ حقيبة الأدلة</h2>
            <button
              onClick={() => {
                audio.click();
                setNotebookOpen(false);
              }}
              className="rounded-full bg-indigo-900 px-3 py-1 text-sm font-bold text-white"
            >
              ✕ إغلاق
            </button>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            المحققة: <span className="font-black text-purple-800">{name}</span> · النقاط:{" "}
            <span className="font-black text-amber-700">{score}</span>
          </p>

          {/* code */}
          <div className="mt-4 rounded-2xl bg-indigo-900 p-3 text-center text-white">
            <div className="text-xs text-teal-200">شفرة الخزانة الكبرى</div>
            <div dir="ltr" className="mt-1 flex justify-center gap-2">
              {[0, 1, 2, 3].map((pos) => {
                const d = digits.find((x) => x!.pos === pos);
                return (
                  <span
                    key={pos}
                    className={`flex h-11 w-9 items-center justify-center rounded-lg text-2xl font-black ${
                      d ? "bg-amber-400 text-slate-900" : "bg-white/10 text-white/30"
                    }`}
                  >
                    {d ? d!.digit : "؟"}
                  </span>
                );
              })}
            </div>
          </div>

          {/* keys & pieces */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-amber-300">
              <div className="text-xs font-bold text-amber-700">المفاتيح</div>
              {keys.length ? (
                keys.map((c) => (
                  <div key={c.id} className="text-sm font-bold text-slate-700">
                    {c.reward.label}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">لا شيء بعد</div>
              )}
            </div>
            <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-teal-300">
              <div className="text-xs font-bold text-teal-700">قطع اللغز</div>
              {pieces.length ? (
                pieces.map((c) => (
                  <div key={c.id} className="text-sm font-bold text-slate-700">
                    {c.reward.label}
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">لا شيء بعد</div>
              )}
            </div>
          </div>

          {/* solved notes */}
          <div className="mt-4">
            <div className="mb-1 text-sm font-black text-indigo-900">📝 ملاحظات القضايا</div>
            <div className="space-y-2">
              {CHALLENGES.map((c, i) => (
                <div
                  key={c.id}
                  className={`rounded-xl p-2 text-xs ${
                    solved[i] ? "bg-emerald-100 ring-1 ring-emerald-300" : "bg-slate-100"
                  }`}
                >
                  <span className="font-bold">
                    {solved[i] ? "✅" : "🔒"} القضية {i + 1}: {c.title}
                  </span>
                  {solved[i] && (
                    <span className="mr-1 text-slate-600"> — {c.reward.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================ GUIDE
  function renderGuide() {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
        <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-teal-600 to-indigo-700 p-5 shadow-2xl anim-pop">
          <div className="flex items-center gap-3">
            <div className="text-4xl anim-float">💡</div>
            <div>
              <h3 className="text-lg font-black text-white">الدليل الذكي</h3>
              <p className="text-xs font-bold text-teal-100">تلميح صغير عن هذا السؤال فقط</p>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-white/15 p-3 text-sm leading-relaxed text-white">
            {screen === "vault"
              ? "أدخلي شفرة الخزانة المكوّنة من ٤ أرقام التي جمعتِها من القضايا. ستجدينها في حقيبة الأدلة 🗂️."
              : current.hint
                ? `💡 ${current.hint}`
                : "فكّري في مالك الشيء: مَن يملكه؟"}
          </p>
          <div className="mt-3 rounded-xl bg-white/10 p-3 text-xs leading-relaxed text-teal-50">
            هل تريدين شرح القاعدة كاملةً بالصور والأمثلة؟
          </div>
          {screen !== "vault" && (
            <button
              onClick={() => openGrammar(current.focus, challengeOpen)}
              className="mt-3 w-full rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-6 py-2.5 font-black text-slate-900 shadow-lg transition hover:scale-[1.02] active:scale-95"
            >
              📖 افتحي دفتر المحققة
            </button>
          )}
          <button
            onClick={() => {
              audio.click();
              setGuideOpen(false);
            }}
            className="mt-2 w-full rounded-full bg-white/15 px-6 py-2.5 font-black text-white ring-1 ring-white/30"
          >
            فهمت، شكرًا! 👍
          </button>
        </div>
      </div>
    );
  }

  // ============================================================ REVIEW
  function renderReview() {
    return (
      <div className="relative min-h-screen w-full overflow-hidden px-4 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-teal-950" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(/schools-bridge-games/game-possessives/images/scene-library.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.2),transparent_55%)]" />

        {renderHUD()}

        <div className="relative z-10 mx-auto max-w-3xl pt-14">
          <div className="rounded-3xl bg-white/5 p-5 text-center shadow-2xl ring-1 ring-amber-300/30 backdrop-blur anim-fadeup sm:p-7">
            <div className="mx-auto mb-1 flex justify-center">
              <Detective size={100} />
            </div>
            <h1 className="text-2xl font-black text-amber-300 sm:text-3xl">
              🔎 مراجعة أدلة المحققة
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-indigo-100">
              أحسنتِ يا {name}! قبل فتح الخزانة الكبرى، لنراجع معًا كل ضمائر المِلكية
              بسرعة. اقرئي كل بطاقة ثم انطلقي! 💪
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PRONOUNS.map((p, i) => (
                <div
                  key={p.key}
                  className={`rounded-2xl bg-gradient-to-br ${p.grad} p-[2px] shadow-lg anim-pop`}
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div className="flex h-full flex-col items-center rounded-[15px] bg-white/95 p-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 ring-2 ring-white anim-float">
                      <PronounIcon type={p.key} className="h-14 w-14" />
                    </div>
                    <div className="font-en mt-1 text-xl font-black text-slate-800">
                      {p.word}
                    </div>
                    <div className="text-xs font-black text-purple-700">{p.meaningAr}</div>
                    <div
                      dir="ltr"
                      className="font-en mt-1 text-[11px] font-bold text-slate-500"
                    >
                      {p.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  audio.click();
                  goVault();
                }}
                className="rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-7 py-3 text-lg font-black text-slate-900 shadow-lg transition hover:scale-105 active:scale-95 anim-glow"
              >
                أنا جاهزة لحل القضية الكبرى! 🔐
              </button>
              <button
                onClick={() => openGrammar("all", false)}
                className="rounded-full bg-white/10 px-6 py-3 text-lg font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                📖 دفتر المحققة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================ VAULT
  function renderVault() {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/schools-bridge-games/game-possessives/images/vault.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 to-slate-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_30%,rgba(8,4,20,0.8)_100%)]" />

        {renderHUD()}

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16">
          <h2 className="text-center text-2xl font-black text-amber-300 drop-shadow sm:text-3xl">
            🔐 الخزانة الكبرى
          </h2>
          <p className="mt-1 text-center text-sm text-teal-100">
            {vaultStage === "walk"
              ? "المحققة تتّجه نحو الخزانة…"
              : vaultStage === "keypad"
                ? "أدخلي شفرة الخزانة (٤ أرقام) من حقيبة الأدلة"
                : vaultStage === "opening"
                  ? "جارٍ فتح القفل…"
                  : "تهانينا! لقد فُتحت الخزانة!"}
          </p>

          {/* vault visual */}
          <div className="relative mt-6" style={{ perspective: 900 }}>
            <div className="relative h-52 w-52 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 shadow-2xl ring-4 ring-amber-300/60 sm:h-60 sm:w-60">
              {/* interior treasure */}
              <div className="absolute inset-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 text-5xl">
                {vaultStage === "open" ? "🏆✨" : ""}
              </div>
              {/* door */}
              {vaultStage !== "open" && (
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 ring-4 ring-amber-300/60 ${
                    vaultStage === "opening" ? "anim-vault-open" : ""
                  }`}
                >
                  <div className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border-4 border-amber-900/60 bg-amber-300 anim-spin-slow" />
                  <div className="absolute inset-6 rounded-xl border-2 border-amber-900/40" />
                </div>
              )}
            </div>

            {vaultStage === "walk" && (
              <div className="absolute -bottom-4 -left-28 anim-slide-vault">
                <Detective walking size={120} />
              </div>
            )}
            {(vaultStage === "opening" || vaultStage === "open") && (
              <div className="absolute -bottom-4 -left-28">
                <Detective walking={vaultStage === "open"} size={120} />
              </div>
            )}
          </div>

          {/* keypad */}
          {vaultStage === "keypad" && (
            <div className="mt-8 w-full max-w-xs anim-fadeup">
              <div
                dir="ltr"
                className={`mb-3 flex justify-center gap-2 ${vaultWrong ? "anim-shake" : ""}`}
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`flex h-12 w-10 items-center justify-center rounded-lg text-2xl font-black ${
                      vaultWrong
                        ? "bg-rose-500 text-white"
                        : entered[i]
                          ? "bg-amber-400 text-slate-900"
                          : "bg-white/10 text-white/40 ring-1 ring-white/20"
                    }`}
                  >
                    {entered[i] || "•"}
                  </span>
                ))}
              </div>
              {vaultWrong && (
                <p className="mb-2 text-center text-sm font-bold text-rose-300">
                  شفرة غير صحيحة، حاولي مجددًا 💪
                </p>
              )}
              <div dir="ltr" className="grid grid-cols-3 gap-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                  <button
                    key={d}
                    onClick={() => pressKey(d)}
                    className="rounded-xl bg-white/10 py-3 text-2xl font-black text-white ring-1 ring-amber-300/30 transition hover:bg-amber-400/20 active:scale-95"
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => {
                    audio.click();
                    setEntered("");
                  }}
                  className="rounded-xl bg-rose-500/30 py-3 text-lg font-black text-white ring-1 ring-rose-300/40 active:scale-95"
                >
                  مسح
                </button>
                <button
                  onClick={() => pressKey("0")}
                  className="rounded-xl bg-white/10 py-3 text-2xl font-black text-white ring-1 ring-amber-300/30 transition hover:bg-amber-400/20 active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    audio.click();
                    setNotebookOpen(true);
                  }}
                  className="rounded-xl bg-teal-500/30 py-3 text-sm font-black text-white ring-1 ring-teal-300/40 active:scale-95"
                >
                  📓
                </button>
              </div>
            </div>
          )}

          {vaultStage === "open" && (
            <div className="mt-6 text-center anim-pop">
              <div className="rounded-2xl bg-gradient-to-l from-amber-400 to-amber-600 px-6 py-3 text-2xl font-black text-slate-900 shadow-xl">
                🎉🔎 تم حلّ القضية!
              </div>
              <button
                onClick={goAchievement}
                className="mt-5 rounded-full bg-gradient-to-l from-emerald-400 to-teal-600 px-8 py-3 text-lg font-black text-white shadow-lg transition hover:scale-105 active:scale-95 anim-glow"
              >
                🏅 عرض شاشة الإنجاز
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================ ACHIEVEMENT
  function renderAchievement() {
    return (
      <div className="relative min-h-screen w-full overflow-hidden px-4 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-teal-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.25),transparent_55%)]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* Initiative - prominent */}
          <div className="mx-auto mb-5 rounded-3xl bg-gradient-to-l from-teal-600 to-indigo-700 p-[3px] shadow-2xl">
            <div className="rounded-3xl bg-slate-950/80 px-6 py-4 text-center">
              <div className="text-2xl font-black text-white sm:text-3xl">
                {INITIATIVE.name}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-teal-100 sm:text-base">
                {INITIATIVE.slogan}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 p-6 text-center shadow-2xl ring-1 ring-amber-300/30 backdrop-blur anim-fadeup sm:p-8">
            <div className="mx-auto mb-2 flex justify-center">
              <Detective size={120} />
            </div>
            <div className="text-5xl">🎉🏆🎊</div>
            <h1 className="mt-2 text-2xl font-black text-amber-300 sm:text-3xl">
              أحسنتِ يا {name}!
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-indigo-100 sm:text-base">
              لقد نجحتِ في حل لغز الممتلكات المفقودة وأصبحتِ محقّقة متميّزة في{" "}
              <span className="font-en font-bold text-teal-200">Possessive Pronouns</span>! 🔎⭐
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-amber-400/15 p-3 ring-1 ring-amber-300/40">
                <div className="text-xs text-amber-200">الدرجة النهائية</div>
                <div className="text-2xl font-black text-amber-300">{score}</div>
              </div>
              <div className="rounded-2xl bg-teal-400/15 p-3 ring-1 ring-teal-300/40">
                <div className="text-xs text-teal-200">الأدلّة المكتشفة</div>
                <div className="text-2xl font-black text-teal-300">{solvedCount}/8</div>
              </div>
              <div className="rounded-2xl bg-fuchsia-400/15 p-3 ring-1 ring-fuchsia-300/40">
                <div className="text-xs text-fuchsia-200">الشارات</div>
                <div className="text-2xl font-black text-fuchsia-300">
                  {earnedBadges.length}
                </div>
              </div>
            </div>

            {/* badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {BADGES.map((b) => {
                const got = solvedCount >= b.need;
                return (
                  <div
                    key={b.id}
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold ring-1 ${
                      got
                        ? "bg-amber-400/20 text-amber-200 ring-amber-300/50"
                        : "bg-white/5 text-white/30 ring-white/10"
                    }`}
                  >
                    <span className="text-lg">{b.icon}</span> {b.label}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  audio.click();
                  reportCertificate(score, CHALLENGES.length * 100, "لغز الممتلكات المفقودة");
                  setScreen("certificate");
                }}
                className="rounded-full bg-gradient-to-l from-amber-400 to-amber-600 px-7 py-3 text-lg font-black text-slate-900 shadow-lg transition hover:scale-105 active:scale-95 anim-glow"
              >
                📜 افتحي شهادة الإنجاز
              </button>
              <button
                onClick={resetAll}
                className="rounded-full bg-white/10 px-6 py-3 text-lg font-bold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                🔁 العب من جديد
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
