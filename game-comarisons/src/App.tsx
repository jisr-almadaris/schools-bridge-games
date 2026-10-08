import { useEffect, useState } from "react";
import Welcome from "./components/Welcome";
import MapScreen from "./components/MapScreen";
import IslandScreen from "./components/IslandScreen";
import Achievement from "./components/Achievement";
import Certificate from "./components/Certificate";
import { ISLANDS } from "./data";
import { StarIcon } from "./graphics";
import { sound } from "./sound";
import { reportCompleted, reportCertificate } from "./bridge";

type Screen = "welcome" | "map" | "island" | "achieve" | "certificate";

interface SaveData {
  name: string;
  completed: number;
  totalCorrect: number;
  totalQuestions: number;
  finalScore: number;
  done: boolean;
  date: string;
}

const STORAGE_KEY = "comparison-islands-v1";

function load(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...emptySave(), ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return emptySave();
}

function emptySave(): SaveData {
  return { name: "", completed: 0, totalCorrect: 0, totalQuestions: 0, finalScore: 0, done: false, date: "" };
}

function arabicDate() {
  return new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
}

export default function App() {
  const [save, setSave] = useState<SaveData>(load);
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentIsland, setCurrentIsland] = useState(0);
  const [shipIdx, setShipIdx] = useState(0);
  const [muted, setMuted] = useState(false);

  /* persist progress */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch {
      /* ignore */
    }
  }, [save]);

  const startJourney = (name: string) => {
    setSave((s) => ({ ...s, name }));
    setShipIdx(Math.min(save.completed, 5));
    setScreen(save.done ? "achieve" : "map");
  };

  const enterIsland = (i: number) => {
    setCurrentIsland(i);
    setScreen("island");
  };

  const completeIsland = (correct: number, total: number) => {
    const firstTime = currentIsland === save.completed;
    const isFinal = currentIsland === 4;
    setSave((s) => {
      const next = { ...s };
      if (firstTime) {
        next.completed = s.completed + 1;
        next.totalCorrect = s.totalCorrect + correct;
        next.totalQuestions = s.totalQuestions + total;
      }
      if (isFinal) {
        next.finalScore = firstTime ? correct : Math.max(s.finalScore, correct);
        next.done = true;
        if (!next.date) next.date = arabicDate();
      }
      return next;
    });
    if (isFinal) {
      /* The student genuinely finished the final challenge (all `total`
         questions answered): report her ACTUAL score to the Teacher
         Control Center. Attribution to the original student happens on the
         receiver side (attempt captured at launch). Reporting is automatic
         and invisible — diagnostics go to the console only. */
      reportCompleted(correct, total);
      /* The certificate is earned at this exact moment (the achievement
         screen awards it upon finishing the journey). */
      reportCertificate(correct, total, "شهادة إنجاز — رحلة إلى جزر المقارنات");
    }
    setScreen(isFinal ? "achieve" : "map");
  };

  const restart = () => {
    const fresh = { ...emptySave(), name: save.name };
    setSave(fresh);
    setShipIdx(0);
    setScreen("map");
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    sound.setMuted(m);
    if (!m) sound.click();
  };

  const stars = Math.min(save.completed, 5);

  if (screen === "welcome") {
    return <Welcome savedName={save.name} onStart={startJourney} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-700 via-purple-600 to-cyan-600">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-purple-900/70 px-3 py-2.5 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚢</span>
            <h1 className="font-display text-base font-extrabold text-white sm:text-xl">
              رحلة إلى جزر المقارنات
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1.5 text-sm font-extrabold text-white sm:text-base">
              👧 {save.name}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-5 w-5" filled={i < stars} />
              ))}
            </span>
            <button
              onClick={toggleMute}
              aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
              className="rounded-full bg-white/20 px-3 py-1.5 text-lg transition hover:bg-white/35"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-3">
        {screen === "map" && (
          <MapScreen
            completed={save.completed}
            shipIdx={shipIdx}
            onShipArrive={setShipIdx}
            onEnter={enterIsland}
            name={save.name}
          />
        )}
        {screen === "island" && (
          <IslandScreen
            key={currentIsland}
            island={ISLANDS[currentIsland]}
            islandIdx={currentIsland}
            onComplete={completeIsland}
          />
        )}
        {screen === "achieve" && (
          <Achievement
            name={save.name}
            finalScore={save.finalScore}
            totalCorrect={save.totalCorrect}
            totalQuestions={save.totalQuestions || 22}
            stars={stars}
            onCertificate={() => setScreen("certificate")}
            onRestart={restart}
          />
        )}
        {screen === "certificate" && (
          <Certificate
            name={save.name}
            finalScore={save.finalScore}
            stars={stars}
            date={save.date || arabicDate()}
            onBack={() => setScreen("achieve")}
          />
        )}
      </main>
    </div>
  );
}
