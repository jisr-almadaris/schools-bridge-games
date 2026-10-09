import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { SCORED_IDS } from "./data";

export type Stage = "intro" | "name" | "gate" | "lesson" | "hub" | "game" | "finalIntro" | "final" | "ending" | "review" | "certificate";

export interface Save {
  name: string;
  stage: Stage;
  lessonStep: number;
  gamesDone: number;
  activeGame: number;
  gameQ: number;
  gameFinished: boolean;
  finalIndex: number;
  scored: Record<string, boolean>;
  tickets: number;
  secrets: number[];
  finishedAt?: string;
  resume?: Stage;
}

const KEY = "gi-adventure-park-v1";
export const DEFAULT: Save = {
  name: "",
  stage: "intro",
  lessonStep: 0,
  gamesDone: 0,
  activeGame: 0,
  gameQ: 0,
  gameFinished: false,
  finalIndex: 0,
  scored: {},
  tickets: 0,
  secrets: [],
};

function load(): Save {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const saved: Save = { ...DEFAULT, ...JSON.parse(raw) };
    // Always open on the initiative screen, remembering where she stopped.
    const resume = saved.stage === "intro" ? saved.resume : saved.stage;
    // migrate: only secret tickets 1–3 exist now; keep cinema step index valid
    const secrets = (saved.secrets || []).filter((n) => n >= 1 && n <= 3);
    if ((saved.gamesDone || 0) >= 4) [1, 2, 3].forEach((n) => !secrets.includes(n) && secrets.push(n));
    return { ...saved, secrets, stage: "intro", resume };
  } catch {
    return DEFAULT;
  }
}

interface Ctx {
  s: Save;
  set: (patch: Partial<Save>) => void;
  record: (qid: string, correct: boolean) => void;
  reset: () => void;
  score: number;
}
const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Save>(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s]);
  const set = useCallback((patch: Partial<Save>) => setS((p) => ({ ...p, ...patch })), []);
  const record = useCallback(
    (qid: string, correct: boolean) =>
      setS((p) => (qid in p.scored ? p : { ...p, scored: { ...p.scored, [qid]: correct } })),
    []
  );
  const reset = useCallback(() => setS({ ...DEFAULT, stage: "name" }), []);
  const score = Object.entries(s.scored).filter(([id, ok]) => ok && SCORED_IDS.has(id)).length;
  return <GameCtx.Provider value={{ s, set, record, reset, score }}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("no ctx");
  return c;
}
