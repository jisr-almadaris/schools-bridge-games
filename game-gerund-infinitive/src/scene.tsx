import { createContext, useContext } from "react";
import type { Save } from "./store";

/** Visual state of the park that screens can drive (lighting, blackout, fireworks). */
export interface Fx {
  boost?: number;
  blackout?: boolean;
  fireworks?: boolean;
  stage?: string;
}
export type TravelKind = "enter" | "toGame" | "toHub" | "toFinalGate" | "toFinal";

export interface SceneApi {
  setFx: (p: Partial<Fx>) => void;
  travel: (kind: TravelKind, patch: Partial<Save>, target?: string) => void;
}
export const SceneCtx = createContext<SceneApi>({ setFx: () => {}, travel: () => {} });
export const useScene = () => useContext(SceneCtx);
