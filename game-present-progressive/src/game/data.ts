export type Be = "am" | "is" | "are";

export type SceneKind =
  | "she-read"
  | "she-swim"
  | "she-play"
  | "i-read"
  | "i-swim"
  | "we-play"
  | "they-play"
  | "they-eat"
  | "he-eat"
  | "he-swim"
  | "it-eat";

export interface FillQ {
  subject: string;
  be: Be;
  verb: string;
  scene: SceneKind;
}

export interface ArrangeItem {
  words: [string, string, string]; // correct order
  scrambled: [string, string, string];
  scene: SceneKind;
}

export type Zone = "garden" | "bay" | "depths";

export const ZONE_LABEL: Record<Zone, string> = {
  garden: "🪸 حديقة المرجان",
  bay: "🐚 خليج اللؤلؤ",
  depths: "✨ الأعماق المضيئة",
};

/* ---------- Pearl Bay ---------- */
export const BAY_BUBBLES: FillQ = { subject: "She", be: "is", verb: "reading", scene: "she-read" };
export const BAY_SHELLS: FillQ = { subject: "They", be: "are", verb: "playing", scene: "they-play" };
export const BAY_ARRANGE: ArrangeItem[] = [
  { words: ["She", "is", "swimming"], scrambled: ["swimming", "is", "She"], scene: "she-swim" },
  { words: ["They", "are", "playing"], scrambled: ["playing", "They", "are"], scene: "they-play" },
  { words: ["I", "am", "reading"], scrambled: ["am", "reading", "I"], scene: "i-read" },
];
export const BAY_OCTOPUS: FillQ = { subject: "He", be: "is", verb: "eating", scene: "he-eat" };

/* ---------- Glowing Depths: 5 final, varied challenges ---------- */
export const FINAL_BUBBLES: FillQ = { subject: "I", be: "am", verb: "swimming", scene: "i-swim" };
export const FINAL_SHELLS: FillQ = { subject: "We", be: "are", verb: "playing", scene: "we-play" };
export const FINAL_ARRANGE: ArrangeItem[] = [
  { words: ["He", "is", "swimming"], scrambled: ["is", "swimming", "He"], scene: "he-swim" },
];
export const FINAL_OCTOPUS: FillQ = { subject: "They", be: "are", verb: "eating", scene: "they-eat" };
export const FINAL_SCENE = {
  scene: "it-eat" as SceneKind,
  options: ["They are eating.", "It is eating.", "It is reading."],
  answer: 1,
};

/* ---------- Coral secrets (enrichment) ---------- */
export const SECRETS: { id: string; zone: Zone; text: string }[] = [
  { id: "s1", zone: "garden", text: "NOW تعني «الآن»، وهي تساعدكِ على تذكّر Present Progressive." },
  { id: "s2", zone: "garden", text: "I → AM ✨" },
  { id: "s3", zone: "bay", text: "He / She / It → IS ✨" },
  { id: "s4", zone: "bay", text: "You / We / They → ARE ✨" },
  { id: "s5", zone: "depths", text: "بعد am / is / are نستخدم الفعل + ing." },
];

/* Host (main diver) behaviour for each scene */
export type HostPose = "read" | "swim" | "play" | "float";
export function hostFor(scene: SceneKind): { pose: HostPose; say?: string; friend?: boolean; window: boolean } {
  switch (scene) {
    case "she-read":
      return { pose: "read", window: false };
    case "she-swim":
      return { pose: "swim", window: false };
    case "she-play":
      return { pose: "play", window: false };
    case "i-read":
      return { pose: "read", say: "I 🙋‍♀️", window: false };
    case "i-swim":
      return { pose: "swim", say: "I 🙋‍♀️", window: false };
    case "we-play":
      return { pose: "play", say: "We 🙋‍♀️🐢", friend: true, window: false };
    default:
      return { pose: "float", window: true };
  }
}

export const SUBJECT_AR: Record<string, string> = {
  She: "She",
  He: "He",
  They: "They",
  I: "I",
  We: "We",
  It: "It",
  You: "You",
};
