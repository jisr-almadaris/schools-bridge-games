import { reportCompleted, reportCertificate, bridgeStudentName } from "./bridge";
import { useCallback, useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import IntroScene from "./components/IntroScene";
import HallScene from "./components/HallScene";
import MachineScene from "./components/MachineScene";
import AlbumScene from "./components/AlbumScene";
import FinalScene from "./components/FinalScene";
import DoneScene from "./components/DoneScene";
import { AlbumModal, MemoryToast, TimeGuide } from "./components/Overlays";
import { InitiativeBadge, Sparkles } from "./components/ui";
import { isMuted, setMuted, sfx } from "./audio";

type Phase = "start" | "intro" | "hall" | "machine" | "album" | "final" | "done";

type Save = {
  name: string;
  phase: Phase;
  lastPhase?: Phase;
  finalIndex: number;
  score: number;
  collected: string[];
  muted: boolean;
};

const KEY = "memory-museum-past-simple-v1";
const TOTAL_ITEMS = 11; // 3 افتحي الذكرى + 3 ترتيب + 5 التحدي النهائي

const DEFAULT: Save = { name: "", phase: "start", finalIndex: 0, score: 0, collected: [], muted: false };

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT, name: bridgeStudentName() };
    const s: Save = { ...DEFAULT, ...JSON.parse(raw) };
    // عند إعادة الفتح نعرض شاشة البداية مع خيار المتابعة
    if (s.phase !== "start") return { ...s, phase: "start", lastPhase: s.phase };
    return s;
  } catch {
    return DEFAULT;
  }
}

const PHASES: { id: Phase; label: string }[] = [
  { id: "hall", label: "قاعة الأمس ⏳" },
  { id: "machine", label: "آلة الزمن ✨" },
  { id: "album", label: "ألبوم الذكريات 📖" },
  { id: "final", label: "التحدي 🏆" },
];

export default function App() {
  const [save, setSave] = useState<Save>(load);
  const [showGuide, setShowGuide] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [muted, setMutedState] = useState(save.muted);

  // حفظ تلقائي
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(save));
    } catch {
      /* ignore */
    }
  }, [save]);

  useEffect(() => {
    setMuted(muted);
    setSave((s) => ({ ...s, muted }));
  }, [muted]);

  const update = useCallback((patch: Partial<Save>) => setSave((s) => ({ ...s, ...patch })), []);

  const addScore = useCallback((firstTry: boolean) => {
    if (firstTry) setSave((s) => ({ ...s, score: s.score + 1 }));
  }, []);

  const collect = useCallback((id: string) => {
    setSave((s) => (s.collected.includes(id) ? s : { ...s, collected: [...s.collected, id] }));
    sfx.album();
    setToast(id);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const goTo = (phase: Phase) => {
    sfx.timeTravel();
    update({ phase });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startNew = (name: string) => {
    setSave({ ...DEFAULT, name, phase: "intro", muted });
  };

  const restart = () => {
    setSave({ ...DEFAULT, name: save.name, muted });
  };

  /* ---------- شاشة البداية ---------- */
  if (save.phase === "start") {
    return (
      <StartScreen
        savedName={save.name}
        hasProgress={!!save.name && !!save.lastPhase && save.lastPhase !== "start"}
        onStart={startNew}
        onContinue={() => update({ phase: save.lastPhase && save.lastPhase !== "start" ? save.lastPhase : "intro", lastPhase: undefined })}
      />
    );
  }

  return (
    <div className="museum-bg relative min-h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[#171644]/55 via-[#2a2760]/35 to-[#171644]/75" />
      <Sparkles count={16} />

      {/* ---------- الشريط العلوي ---------- */}
      <header className="no-print sticky top-0 z-40 border-b-2 border-[#f7c948]/50 bg-[#171644]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2">
          <div className="flex items-center gap-2">
            <InitiativeBadge />
            <span className="hidden text-sm font-black text-white sm:inline">متحف الذكريات ⏳✨</span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {PHASES.map((p) => {
              const order = ["intro", "hall", "machine", "album", "final", "done"];
              const cur = order.indexOf(save.phase);
              const me = order.indexOf(p.id);
              const state = me < cur ? "done" : me === cur ? "now" : "todo";
              return (
                <span
                  key={p.id}
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    state === "done" ? "bg-[#2fbfb0] text-white" : state === "now" ? "bg-[#f7c948] text-[#4b2f8f]" : "bg-white/20 text-white/70"
                  }`}
                >
                  {state === "done" ? "✓ " : ""}
                  {p.label}
                </span>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sfx.album();
                setShowAlbum(true);
              }}
              className="cursor-pointer rounded-full border-2 border-[#f7c948] bg-white px-3 py-1.5 text-sm font-black text-[#4b2f8f] shadow hover:bg-[#fff3cc]"
            >
              📖 الألبوم <span className="en">{save.collected.length}/4</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setShowGuide(true);
              }}
              className="cursor-pointer rounded-full border-2 border-[#7fe3d8] bg-[#2fbfb0] px-3 py-1.5 text-sm font-black text-white shadow hover:brightness-110"
            >
              دليل الزمن 📘
            </button>
            <button
              type="button"
              onClick={() => setMutedState((m) => !m)}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-2 border-white/50 bg-white/15 text-lg text-white"
              aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
              title={muted ? "تشغيل الصوت" : "كتم الصوت"}
            >
              {muted || isMuted() ? "🔇" : "🔊"}
            </button>
          </div>
        </div>
      </header>

      {/* ---------- المحتوى ---------- */}
      <main className="relative mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
        {save.phase === "intro" && <IntroScene name={save.name} onDone={() => goTo("hall")} />}

        {save.phase === "hall" && (
          <HallScene
            onSolved={addScore}
            onDone={() => {
              collect("football");
              goTo("machine");
            }}
          />
        )}

        {save.phase === "machine" && (
          <MachineScene
            onDone={() => {
              collect("tv");
              goTo("album");
            }}
          />
        )}

        {save.phase === "album" && (
          <AlbumScene
            onSolved={addScore}
            onDone={() => {
              collect("school");
              goTo("final");
            }}
          />
        )}

        {save.phase === "final" && (
          <FinalScene
            startIndex={save.finalIndex}
            onIndexChange={(i) => update({ finalIndex: i })}
            onSolved={addScore}
            onDone={() => {
              collect("grandma");
              reportCompleted(save.score, TOTAL_ITEMS);
              update({ phase: "done" });
              window.scrollTo({ top: 0 });
            }}
          />
        )}

        {save.phase === "done" && (
          <DoneScene
            name={save.name}
            score={save.score}
            total={TOTAL_ITEMS}
            collected={[...save.collected, "grandma"].filter((v, i, a) => a.indexOf(v) === i)}
            onRestart={restart}
            onCertificate={() => reportCertificate(save.score, TOTAL_ITEMS, "متحف الذكريات")}
          />
        )}
      </main>

      <footer className="no-print relative pb-6 text-center text-xs font-bold text-white/70">
        <button type="button" onClick={() => update({ phase: "start", lastPhase: save.phase })} className="cursor-pointer underline hover:text-white">
          العودة إلى الشاشة الأولى
        </button>
      </footer>

      {showGuide && <TimeGuide onClose={() => setShowGuide(false)} />}
      {showAlbum && <AlbumModal collected={save.collected} onClose={() => setShowAlbum(false)} />}
      {toast && <MemoryToast id={toast} />}
    </div>
  );
}
