import { useCallback, useEffect, useState, type ReactNode } from "react";
import { HUD, SecretsBook, VoiceSubtitle } from "./components/UI";
import { ROOMS, TOTAL_QUESTIONS } from "./data";
import { reportCertificate } from "./bridge";
import { clearProgress, freshProgress, loadProgress, resumeScene, saveProgress, type Progress, type Scene } from "./store";
import { Opening, Title } from "./scenes/Intro";
import { ElevatorCode, Reception } from "./scenes/Lobby";
import { ElevatorRide, SecretElevator } from "./scenes/Elevator";
import Corridor from "./scenes/Corridor";
import Room from "./scenes/Room";
import Suite from "./scenes/Suite";
import Certificate from "./scenes/Certificate";

export default function App() {
  const [saved] = useState(() => loadProgress());
  const [p, setP] = useState<Progress>(() => freshProgress());
  const [book, setBook] = useState(false);

  useEffect(() => { if (p.name) saveProgress(p); }, [p]);

  const up = useCallback((fn: (q: Progress) => Partial<Progress>) => setP((q) => ({ ...q, ...fn(q) })), []);
  const go = (scene: Scene) => up(() => ({ scene }));

  const solvedQ = (id: string, first: boolean) => up((q) => ({
    solved: q.solved.includes(id) ? q.solved : [...q.solved, id],
    firstTry: first && !q.firstTry.includes(id) && !q.solved.includes(id) ? [...q.firstTry, id] : q.firstTry,
  }));

  let view: ReactNode = null;
  switch (p.scene) {
    case "title":
      view = <Title savedName={saved && saved.scene !== "title" ? saved.name : undefined}
        onStart={(name) => setP({ ...freshProgress(name), scene: "opening" })}
        onResume={() => saved && setP({ ...saved, scene: resumeScene(saved.scene) })} />;
      break;
    case "opening": view = <Opening name={p.name} onDone={() => go("reception")} />; break;
    case "reception": view = <Reception name={p.name} onGotCard={() => up(() => ({ gotCard: true }))} onDone={() => go("elevatorCode")} />; break;
    case "elevatorCode": view = <ElevatorCode onEnter={() => go("elevatorRide")} />; break;
    case "elevatorRide": view = <ElevatorRide onArrive={() => go("corridor")} />; break;
    case "corridor":
      view = <Corridor key={`c${p.done.filter(Boolean).length}`} p={p} onEnter={(i) => up(() => ({ scene: "room", room: i, roomStep: 0 }))} onSecret={() => go("secretElevator")} />;
      break;
    case "room":
      view = <Room key={`r${p.room}`} p={p} index={p.room}
        onStep={(s) => up(() => ({ roomStep: s }))}
        onSolved={solvedQ}
        onReward={() => up((q) => ({ keys: q.keys.map((k, i) => (i === q.room ? true : k)), digits: q.digits.map((d, i) => (i === q.room ? ROOMS[i].digit : d)) }))}
        onExit={() => up((q) => ({ done: q.done.map((d, i) => (i === q.room ? true : d)), keys: q.keys.map((k, i) => (i === q.room ? true : k)), digits: q.digits.map((d, i) => (i === q.room ? ROOMS[i].digit : d)), scene: "corridor", roomStep: 0 }))} />;
      break;
    case "secretElevator": view = <SecretElevator p={p} onArrive={() => go("suite")} />; break;
    case "suite":
    case "finale":
      view = <Suite p={p} onStep={(s) => up(() => ({ suiteStep: s }))} onSolved={solvedQ} onFinish={() => { reportCertificate(p.solved.length, TOTAL_QUESTIONS, "الفندق السحري"); up(() => ({ scene: "certificate", finishedAt: new Date().toISOString() })); }} />;
      break;
    case "certificate":
      view = <Certificate p={p} onRestart={() => { clearProgress(); setP(freshProgress()); window.location.reload(); }} />;
      break;
  }

  const showHud = p.scene !== "title";
  const showCode = ["corridor", "room", "secretElevator", "suite", "finale"].includes(p.scene);

  return (
    <div className="fixed inset-0 overflow-hidden select-none" style={{ background: "#0b0620" }}>
      <div key={p.scene} className="absolute inset-0 anim-fadeIn">{view}</div>
      {showHud && <HUD p={p} onBook={() => setBook(true)} showCode={showCode} />}
      {book && <SecretsBook onClose={() => setBook(false)} />}
      <VoiceSubtitle />
    </div>
  );
}
