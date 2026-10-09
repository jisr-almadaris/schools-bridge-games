export type Scene = "read" | "soccer" | "swim" | "draw" | "wantplay";

interface Base {
  id: string;
  praise: string; // Arabic praise + pattern
  rule: string; // e.g. "enjoy → -ing"
  hint: string;
  full: string; // final correct sentence
  wrongTip?: string; // specific nudge shown after a wrong try
}
/** Fill-the-blank / choose-sentence / missing-ticket, rendered inside different rides. */
export interface ChoiceQ extends Base {
  type: "choice" | "coaster" | "wheel" | "balloon";
  mode?: "blank" | "sentence" | "missing";
  ask?: string; // short Arabic instruction above the prompt
  prompt: string; // contains ___ (blank mode) or the key word (missing mode)
  options: string[];
  icons?: string[]; // optional icon per option
  answer: string;
  keyWord?: string;
  scene?: Scene;
  stamp?: string;
}
export interface OrderQ extends Base {
  type: "order";
  words: string[];
  answer: string[];
  scene: Scene;
  sceneCaption: string;
}
export interface PictureQ extends Base {
  type: "picture";
  scene: Scene;
  options: string[];
  answer: string;
}
export interface SortQ extends Base {
  type: "sort";
  cards: { word: string; zone: "ger" | "inf" }[];
}
export interface ErrorQ extends Base {
  type: "error";
  tokens: string[];
  end: string;
  wrong: number;
  fixes: string[];
  fix: string;
  scene?: Scene;
}
export interface MatchQ extends Base {
  type: "match";
  pairs: [string, string][];
}
export interface MovieQ {
  id: string;
  type: "movie";
}
export type Question = ChoiceQ | OrderQ | PictureQ | SortQ | ErrorQ | MatchQ | MovieQ;

const H_ENJOY = "تذكري تذكرة ENJOY 🎟️ ماذا يأتي بعدها؟";
const H_WANT = "تذكري: WANT يتحدث عن شيء نرغب في فعله ⭐";
const H_HOPE = "HOPE مثل WANT… نتمنّى شيئًا نريد فعله ⭐ ماذا يأتي بعدها؟";
const H_NEED = "NEED = شيء نحتاج أن نفعله ⭐ تذكري تذكرة السر رقم 3 🔐";
const T_ENJOY = "💡 تذكري: ماذا يأتي بعد enjoy؟";
const T_WANT = "💡 تذكري: ماذا يأتي بعد want؟";

export interface Game {
  id: string;
  icon: string;
  title: string;
  en: string;
  color: string;
  questions: Question[];
  secret: number; // 0 = no secret ticket (a park tip instead)
}

export const GAMES: Game[] = [
  {
    id: "coaster",
    icon: "🎢",
    title: "أفعوانية GERUND",
    en: "Gerund Roller Coaster",
    color: "from-pink-500 to-fuchsia-600",
    secret: 1,
    questions: [
      {
        id: "c1",
        type: "coaster",
        prompt: "I enjoy ___ books.",
        options: ["reading", "to read"],
        answer: "reading",
        full: "I enjoy reading books. ✨",
        praise: "رائع! 🎢✨ enjoy + reading",
        rule: "enjoy → -ing",
        stamp: "GERUND ✓",
        hint: H_ENJOY,
        wrongTip: T_ENJOY,
      },
      {
        id: "c2",
        type: "coaster",
        scene: "draw",
        ask: "انظري إلى الصورة 🖼️ ثم ضعي الكلمة الصحيحة في العربة",
        prompt: "She enjoys ___ pictures.",
        options: ["to draw", "drawing"],
        answer: "drawing",
        full: "She enjoys drawing pictures. 🎨",
        praise: "رائع! 🎢✨ enjoys + drawing",
        rule: "enjoy → -ing",
        stamp: "GERUND ✓",
        hint: H_ENJOY,
        wrongTip: T_ENJOY,
      },
    ],
  },
  {
    id: "wheel",
    icon: "🎡",
    title: "عجلة INFINITIVE",
    en: "Infinitive Ferris Wheel",
    color: "from-cyan-400 to-teal-600",
    secret: 2,
    questions: [
      {
        id: "w1",
        type: "wheel",
        keyWord: "WANT",
        ask: "اضغطي على الكبسولة الصحيحة وهي تدور 🎡",
        prompt: "I want ___ a game.",
        options: ["playing", "to play"],
        answer: "to play",
        full: "I want to play a game. 🎮",
        praise: "ممتاز! 🎡 want + to play",
        rule: "WANT → TO + VERB ⭐",
        hint: H_WANT,
        wrongTip: T_WANT,
      },
      {
        id: "w2",
        type: "wheel",
        keyWord: "HOPE",
        ask: "أي تذكرة تدخل اللعبة؟ 🎟️",
        prompt: "We hope ___ the game.",
        options: ["winning", "to win"],
        icons: ["🎢", "🎡"],
        answer: "to win",
        full: "We hope to win the game. 🏆",
        praise: "ممتاز! 🎡 hope + to win",
        rule: "HOPE → TO + VERB ⭐",
        hint: H_HOPE,
        wrongTip: "💡 تذكري: HOPE مثل WANT ⭐",
      },
    ],
  },
  {
    id: "balloon",
    icon: "🎈",
    title: "Balloon Pop",
    en: "Balloon Pop",
    color: "from-amber-400 to-orange-500",
    secret: 0,
    questions: [
      {
        id: "b1",
        type: "balloon",
        prompt: "They enjoy ___.",
        options: ["to play", "play", "playing"],
        answer: "playing",
        full: "They enjoy playing.",
        praise: "POP! 🎈 enjoy + playing",
        rule: "enjoy → -ing",
        hint: H_ENJOY,
        wrongTip: T_ENJOY,
      },
      {
        id: "b2",
        type: "balloon",
        mode: "sentence",
        ask: "فرقعي بالون الجملة الصحيحة ✅",
        prompt: "",
        options: ["She wants reading.", "She wants to read."],
        answer: "She wants to read.",
        full: "She wants to read. 📖",
        praise: "POP! 🎈 wants + to read",
        rule: "want → to + verb",
        hint: H_WANT,
        wrongTip: T_WANT,
      },
      {
        id: "b3",
        type: "balloon",
        mode: "missing",
        ask: "🎟️ تذكرة ناقصة! فرقعي البالون الذي يكملها",
        prompt: "NEED",
        keyWord: "NEED",
        options: ["-ING", "TO + VERB"],
        answer: "TO + VERB",
        full: "He needs to study. 📚",
        praise: "POP! 🎈 NEED → TO + VERB",
        rule: "need → to + verb",
        hint: H_NEED,
        wrongTip: "💡 NEED = شيء نحتاج أن نفعله ⭐",
      },
    ],
  },
  {
    id: "cinema",
    icon: "🍿",
    title: "سينما الجمل",
    en: "Mini Cinema",
    color: "from-violet-500 to-indigo-600",
    secret: 3,
    questions: [
      { id: "movie", type: "movie" },
      {
        id: "s1",
        type: "order",
        scene: "soccer",
        sceneCaption: "ولد يريد لعب كرة القدم ⚽",
        words: ["to play", "want", "I"],
        answer: ["I", "want", "to play"],
        full: "I want to play.",
        praise: "🎬 PERFECT SENTENCE! want + to play",
        rule: "want → to + verb",
        hint: "ابدئي بـ I… ثم ماذا يريد؟ ⭐ WANT تحب to + verb",
      },
      {
        id: "s2",
        type: "error",
        scene: "read",
        tokens: ["I", "enjoy", "to read", "books"],
        end: ".",
        wrong: 2,
        fixes: ["reading", "read"],
        fix: "reading",
        full: "I enjoy reading books.",
        praise: "🎬 PERFECT SENTENCE! enjoy + reading",
        rule: "enjoy → -ing",
        hint: "ابحثي عن الكلمة التي تأتي بعد ENJOY 🎟️ هل شكلها صحيح؟",
        wrongTip: T_ENJOY,
      },
    ],
  },
];

export const FINAL: Question[] = [
  {
    id: "f1",
    type: "choice",
    prompt: "We plan ___ the park.",
    options: ["visiting", "to visit"],
    answer: "to visit",
    full: "We plan to visit the park. 🎡",
    praise: "ممتاز! ⭐ plan + to visit",
    rule: "plan → to + verb",
    hint: "PLAN = خطة لشيء سنفعله ⭐ تذكري: الخطة تحب to + verb",
    wrongTip: "💡 تذكري: ماذا يأتي بعد plan؟",
  },
  {
    id: "f2",
    type: "choice",
    mode: "sentence",
    ask: "اختاري الجملة الصحيحة ✅",
    prompt: "",
    options: ["She wants playing.", "She wants to play."],
    answer: "She wants to play.",
    full: "She wants to play.",
    praise: "ممتاز! 🎡 wants + to play",
    rule: "want → to + verb",
    hint: H_WANT,
    wrongTip: T_WANT,
  },
  {
    id: "f3",
    type: "error",
    scene: "swim",
    tokens: ["He", "enjoys", "to swim"],
    end: ".",
    wrong: 2,
    fixes: ["swim", "swimming"],
    fix: "swimming",
    full: "He enjoys swimming.",
    praise: "رائع! 🕵️‍♀️ enjoys + swimming",
    rule: "enjoy → -ing",
    hint: "انظري إلى ما بعد ENJOY 🎟️",
    wrongTip: T_ENJOY,
  },
  {
    id: "f4",
    type: "order",
    scene: "swim",
    sceneCaption: "هم يستمتعون بالسباحة 🏊‍♀️",
    words: ["swimming", "enjoy", "They"],
    answer: ["They", "enjoy", "swimming"],
    full: "They enjoy swimming.",
    praise: "🎬 PERFECT SENTENCE! enjoy + swimming",
    rule: "enjoy → -ing",
    hint: "ابدئي بـ They… ثم ENJOY 🎟️ وبعدها؟",
  },
  {
    id: "f5",
    type: "sort",
    cards: [
      { word: "enjoy", zone: "ger" },
      { word: "want", zone: "inf" },
      { word: "hope", zone: "inf" },
    ],
    full: "enjoy → -ing  |  want / hope → to + verb",
    praise: "ممتاز! 🎢 enjoy → -ing  ·  🎡 want / hope → to + verb",
    rule: "enjoy → -ing · want / hope → to + verb",
    hint: "ENJOY 🎟️ تذكرة الـ -ING… و WANT و HOPE ⭐ تريدان to + verb",
  },
  {
    id: "f6",
    type: "match",
    pairs: [
      ["enjoy", "reading"],
      ["want", "to read"],
    ],
    full: "enjoy reading  ·  want to read",
    praise: "رائع! 🔗 enjoy ↔ reading · want ↔ to read",
    rule: "enjoy → -ing · want → to + verb",
    hint: "أي كلمة تنتهي بـ -ing؟ ومن يحبها: ENJOY أم WANT؟",
  },
];

export const SECRETS: Record<number, { code: string; word: string; form: string; ex: string; em: string }> = {
  1: { code: "7", word: "ENJOY", form: "verb + ing", ex: "I enjoy swimming.", em: "🏊‍♀️" },
  2: { code: "3", word: "WANT", form: "to + verb", ex: "I want to swim.", em: "🏊‍♀️" },
  3: { code: "5", word: "NEED / HOPE / PLAN", form: "to + verb", ex: "I hope to win.", em: "🏆" },
};
export const FINAL_CODE = "735";

export const PARK_TIPS: { rule: string; ex: string }[] = [
  { rule: "FINISH → -ING", ex: "I finish reading. 📖" },
  { rule: "KEEP → -ING", ex: "I keep trying. 💪" },
  { rule: "PLAN → TO + VERB", ex: "I plan to visit. 🗺️" },
  { rule: "NEED → TO + VERB", ex: "I need to study. 📚" },
  { rule: "ENJOY → -ING", ex: "I enjoy playing. 🎮" },
  { rule: "HOPE → TO + VERB", ex: "I hope to win. 🏆" },
  { rule: "WANT → TO + VERB", ex: "I want to play. 🎮" },
];

const ALL: Question[] = [...GAMES.flatMap((g) => g.questions), ...FINAL];
export const SCORED_IDS = new Set(ALL.filter((q) => q.type !== "movie").map((q) => q.id));
export const TOTAL_SCORED = SCORED_IDS.size;
