export type Scene =
  | "title" | "opening" | "reception" | "elevatorCode" | "elevatorRide" | "corridor" | "room"
  | "secretElevator" | "suite" | "finale" | "certificate";

export interface Progress {
  name: string;
  scene: Scene;
  room: number;          // current room index
  roomStep: number;      // step inside the room
  done: boolean[];       // completed rooms
  keys: boolean[];       // collected keys (per room)
  digits: (number | null)[];
  solved: string[];      // solved question ids
  firstTry: string[];    // solved on first try (sparkles)
  gotCard: boolean;
  suiteStep: number;
  finishedAt?: string;
}

const KEY = "enchanted_hotel_v1";

export const freshProgress = (name = ""): Progress => ({
  name, scene: "title", room: 0, roomStep: 0,
  done: [false, false, false, false], keys: [false, false, false, false],
  digits: [null, null, null, null], solved: [], firstTry: [], gotCard: false, suiteStep: 0,
});

export function loadProgress(): Progress | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = { ...freshProgress(), ...JSON.parse(raw) } as Progress;
    return p.name ? p : null;
  } catch { return null; }
}

export function saveProgress(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

export function clearProgress() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// scenes that are cinematic resume on a safe scene
export function resumeScene(s: Scene): Scene {
  if (s === "opening") return "reception";
  if (s === "elevatorRide") return "corridor";
  if (s === "title") return "reception";
  return s;
}
