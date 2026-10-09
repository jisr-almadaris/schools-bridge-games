import { reportCompleted } from "./bridge";
import { TOTAL_SCORED } from "./data";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { GameProvider, useGame, type Save } from "./store";
import { Fireworks, ParkBackground } from "./components/ParkBackground";
import { GuideModal, HUD, KioskModal, codeDigits } from "./components/HUD";
import { Caption } from "./components/ui";
import TravelOverlay, { TRAVEL_MS } from "./components/Travel";
import { Gate, Intro, NameScreen } from "./screens/Start";
import Lesson from "./screens/Lesson";
import { Final, FinalIntro, GameRunner, Hub } from "./screens/Park";
import { Certificate, Ending, Review } from "./screens/End";
import { initAudio, onCaption, setAmbience } from "./audio";
import { SceneCtx, type Fx, type TravelKind } from "./scene";
import { GAMES } from "./data";

interface Trip {
  kind: TravelKind;
  target?: string;
  patch: Partial<Save>;
  id: number;
}

function Game() {
  const { s, set, score } = useGame();
  const [guide, setGuide] = useState(false);
  const firstFinish = useRef(s.finishedAt);
  useEffect(() => {
    if (s.stage === "ending" && s.finishedAt && s.finishedAt !== firstFinish.current) {
      reportCompleted(score, TOTAL_SCORED);
      firstFinish.current = s.finishedAt;
    }
  }, [s.stage, s.finishedAt, score]);
  const [kiosk, setKiosk] = useState(false);
  const [gateLit, setGateLit] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [caption, setCaptionState] = useState<string[] | null>(null);
  const [announced, setAnnounced] = useState<string[] | null>(null);
  const setCaption = useCallback((l: string[] | null) => setCaptionState(l), []);

  // park FX are scoped to the stage that set them
  const stageRef = useRef(s.stage);
  stageRef.current = s.stage;
  const [fx, setFxState] = useState<Fx>({});
  const setFx = useCallback((p: Partial<Fx>) => setFxState((prev) => ({ ...(prev.stage === stageRef.current ? prev : {}), ...p, stage: stageRef.current })), []);
  const cur: Fx = fx.stage === s.stage ? fx : {};

  // short cartoon transitions between places
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripPhase, setTripPhase] = useState(0);
  const travel = useCallback((kind: TravelKind, patch: Partial<Save>, target?: string) => {
    setTripPhase(0);
    setTrip({ kind, patch, target, id: Date.now() });
  }, []);
  useEffect(() => {
    if (!trip) return;
    const t = window.setTimeout(() => {
      set(trip.patch);
      setTrip(null);
      setTripPhase(0);
    }, TRAVEL_MS[trip.kind]);
    return () => window.clearTimeout(t);
  }, [trip, set]);

  const sceneApi = useMemo(() => ({ setFx, travel }), [setFx, travel]);

  useEffect(() => onCaption(setAnnounced), []);

  // audio unlock on first interaction
  useEffect(() => {
    const unlock = () => initAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  useEffect(() => {
    if (s.stage !== "ending") setCelebrate(false);
    if (s.stage === "intro" || s.stage === "name") setGateLit(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [s.stage]);

  const cinemaDim = s.stage === "game" && GAMES[s.activeGame]?.id === "cinema" && !s.gameFinished && !trip;
  useEffect(() => setAmbience(cinemaDim ? 0.3 : 1), [cinemaDim]);

  const preGate = s.stage === "intro" || s.stage === "name" || s.stage === "gate";
  const lit = (!preGate || gateLit) && !cur.blackout && !cinemaDim;

  let boost = 0;
  if (s.stage === "final") boost = cur.boost ?? s.finalIndex;
  else if (s.stage === "finalIntro") boost = cur.boost ?? 0;
  else if (s.stage === "ending" || s.stage === "review" || s.stage === "certificate") boost = 6;
  if (trip?.kind === "enter" && tripPhase >= 2) boost = Math.max(boost, 1);
  if (trip?.kind === "toFinal") boost = Math.max(boost, 5);

  const fast = celebrate || !!cur.fireworks || trip?.kind === "toFinal";
  const fireworks = celebrate || !!cur.fireworks || (s.stage === "final" && boost >= 6) || trip?.kind === "toFinal";

  let screen: ReactNode = null;
  switch (s.stage) {
    case "intro":
      screen = <Intro />;
      break;
    case "name":
      screen = <NameScreen />;
      break;
    case "gate":
      screen = <Gate onLights={setGateLit} setCaption={setCaption} />;
      break;
    case "lesson":
      screen = <Lesson />;
      break;
    case "hub":
      screen = <Hub onKiosk={() => setKiosk(true)} />;
      break;
    case "game":
      screen = <GameRunner />;
      break;
    case "finalIntro":
      screen = <FinalIntro />;
      break;
    case "final":
      screen = <Final />;
      break;
    case "ending":
      screen = <Ending onCelebrate={setCelebrate} setCaption={setCaption} />;
      break;
    case "review":
      screen = <Review />;
      break;
    case "certificate":
      screen = <Certificate />;
      break;
  }

  const showGuide = !["intro", "name", "gate"].includes(s.stage);
  const showCode = ["hub", "game", "finalIntro"].includes(s.stage);

  return (
    <SceneCtx.Provider value={sceneApi}>
      <div className="relative min-h-full">
        <ParkBackground lit={lit} fast={fast} boost={boost} cam={trip?.kind === "enter" && tripPhase >= 1} />
        {fireworks && <Fireworks />}
        {s.stage !== "intro" && <HUD tickets={s.tickets} showGuide={showGuide} onGuide={() => setGuide(true)} code={showCode ? codeDigits(s.secrets, s.gamesDone) : null} />}
        <main
          className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-3 sm:px-6 transition-opacity duration-300 ${s.stage === "intro" ? "py-8" : "pt-20 sm:pt-24 pb-8"} ${trip ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {screen}
        </main>
        {trip && <TravelOverlay key={trip.id} kind={trip.kind} target={trip.target} onPhase={setTripPhase} />}
        <div className={`blackout fixed inset-0 z-30 bg-black flex items-center justify-center pointer-events-none ${cur.blackout ? "opacity-95" : "opacity-0"}`}>
          {cur.blackout && <p className="en text-5xl text-white/60 tracking-[0.5em] twinkle">...</p>}
        </div>
        <Caption lines={caption ?? announced} />
        <GuideModal open={guide} onClose={() => setGuide(false)} />
        <KioskModal open={kiosk} onClose={() => setKiosk(false)} />
      </div>
    </SceneCtx.Provider>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
