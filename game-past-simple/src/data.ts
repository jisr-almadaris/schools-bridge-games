export const INITIATIVE = "مبادرة جسر المدارس 🌉";
export const INITIATIVE_TAGLINE = "«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»";
export const GAME_TITLE_AR = "متحف الذكريات ⏳✨";
export const GAME_TITLE_EN = "Past Simple Memory Museum";

export type Memory = {
  id: string;
  emoji: string;
  label: string; // e.g. "Played football"
  image: string;
  sentence: string;
  timeWord: string;
  verb: string;
  explain: string;
};

export const MEMORIES: Memory[] = [
  {
    id: "football",
    emoji: "⚽",
    label: "Played football",
    image: "/schools-bridge-games/game-past-simple/images/memory-football.jpg",
    sentence: "Yesterday, she played football.",
    timeWord: "Yesterday",
    verb: "played",
    explain: "played = حدث في الماضي ⭐",
  },
  {
    id: "tv",
    emoji: "📺",
    label: "Watched TV",
    image: "/schools-bridge-games/game-past-simple/images/memory-tv.jpg",
    sentence: "Last night, they watched a movie.",
    timeWord: "Last night",
    verb: "watched",
    explain: "watched = حدث في الماضي ⭐",
  },
  {
    id: "school",
    emoji: "🏫",
    label: "Went to school",
    image: "/schools-bridge-games/game-past-simple/images/memory-school.jpg",
    sentence: "Yesterday, he went to school.",
    timeWord: "Yesterday",
    verb: "went",
    explain: "went = الماضي من go ⭐",
  },
  {
    id: "grandma",
    emoji: "👵",
    label: "Visited Grandma",
    image: "/schools-bridge-games/game-past-simple/images/memory-grandma.jpg",
    sentence: "Yesterday, we visited Grandma.",
    timeWord: "Yesterday",
    verb: "visited",
    explain: "visited = حدث في الماضي ⭐",
  },
];

export type ChoiceQ = {
  kind: "choice";
  id: string;
  before: string;
  after: string;
  options: [string, string];
  answer: string;
  timeWord: string;
  hint: string;
  why: string;
  image?: string;
  emoji: string;
};
export type OrderQ = {
  kind: "order";
  id: string;
  words: string[];
  answer: string[];
  hint: string;
  why: string;
  emoji: string;
};
export type MatchQ = {
  kind: "match";
  id: string;
  pairs: { base: string; past: string; emoji: string }[];
  hint: string;
  why: string;
  emoji: string;
};
export type Question = ChoiceQ | OrderQ | MatchQ;

// نشاط: افتحي الذكرى ✨ (3 إطارات)
export const OPEN_MEMORY: ChoiceQ[] = [
  {
    kind: "choice",
    id: "om1",
    before: "Yesterday, Sara",
    after: "football.",
    options: ["play", "played"],
    answer: "played",
    timeWord: "Yesterday",
    hint: "انظري إلى Yesterday 👀 هل نتحدث عن الآن أم الماضي؟",
    why: "Yesterday → played",
    image: "/schools-bridge-games/game-past-simple/images/memory-football.jpg",
    emoji: "⚽",
  },
  {
    kind: "choice",
    id: "om2",
    before: "Last night, they",
    after: "a movie.",
    options: ["watched", "watch"],
    answer: "watched",
    timeWord: "Last night",
    hint: "انظري إلى Last night 👀 هل نتحدث عن الآن أم الماضي؟",
    why: "Last night → watched",
    image: "/schools-bridge-games/game-past-simple/images/memory-tv.jpg",
    emoji: "📺",
  },
  {
    kind: "choice",
    id: "om3",
    before: "Yesterday, he",
    after: "to school.",
    options: ["go", "went"],
    answer: "went",
    timeWord: "Yesterday",
    hint: "نحتاج شكل go في الماضي ⏳",
    why: "go → went ⭐",
    image: "/schools-bridge-games/game-past-simple/images/memory-school.jpg",
    emoji: "🏫",
  },
];

// نشاط ترتيب الجملة 🧩
export const ORDER_SENTENCES: OrderQ[] = [
  {
    kind: "order",
    id: "o1",
    words: ["yesterday", "played", "I", "football"],
    answer: ["I", "played", "football", "yesterday"],
    hint: "ابدئي بمن فعل الشيء 👀 ثم الفعل، ثم كلمة الزمن في النهاية.",
    why: "played هو الماضي من play.",
    emoji: "⚽",
  },
  {
    kind: "order",
    id: "o2",
    words: ["TV", "watched", "She", "last night"],
    answer: ["She", "watched", "TV", "last night"],
    hint: "الجملة تبدأ بـ She 👀 ثم ماذا فعلت؟",
    why: "watched هو الماضي من watch.",
    emoji: "📺",
  },
  {
    kind: "order",
    id: "o3",
    words: ["went", "He", "to school", "yesterday"],
    answer: ["He", "went", "to school", "yesterday"],
    hint: "الجملة تبدأ بـ He 👀 ثم الفعل في الماضي.",
    why: "went هو الماضي من go.",
    emoji: "🏫",
  },
];

// التحدي النهائي 🏆 (5 أسئلة فقط)
export const FINAL_QUESTIONS: Question[] = [
  {
    kind: "choice",
    id: "f1",
    before: "Yesterday, I",
    after: "football.",
    options: ["play", "played"],
    answer: "played",
    timeWord: "Yesterday",
    hint: "انظري إلى Yesterday 👀 هل نتحدث عن الآن أم الماضي؟",
    why: "Yesterday → played",
    emoji: "⚽",
  },
  {
    kind: "choice",
    id: "f2",
    before: "She",
    after: "TV last night.",
    options: ["watched", "watch"],
    answer: "watched",
    timeWord: "last night",
    hint: "انظري إلى last night 👀 نحن نتحدث عن الماضي.",
    why: "last night → watched",
    emoji: "📺",
  },
  {
    kind: "choice",
    id: "f3",
    before: "Yesterday, he",
    after: "to school.",
    options: ["go", "went"],
    answer: "went",
    timeWord: "Yesterday",
    hint: "نحتاج شكل go في الماضي ⏳",
    why: "go → went ⭐",
    emoji: "🏫",
  },
  {
    kind: "order",
    id: "f4",
    words: ["yesterday", "played", "We"],
    answer: ["We", "played", "yesterday"],
    hint: "ابدئي بـ We 👀 ثم الفعل في الماضي.",
    why: "We played yesterday. نفس الفعل مع الجميع ⭐",
    emoji: "🎉",
  },
  {
    kind: "match",
    id: "f5",
    pairs: [
      { base: "go", past: "went", emoji: "🏫" },
      { base: "play", past: "played", emoji: "⚽" },
      { base: "eat", past: "ate", emoji: "🍎" },
    ],
    hint: "go فعل مميز يتغير شكله ⏳ و play يأخذ ed.",
    why: "go → went ⭐ play → played ⭐ eat → ate ⭐",
    emoji: "🔗",
  },
];

export const SECRETS = [
  "Yesterday = أمس، وهي علامة قوية أننا نتحدث عن الماضي.",
  "كثير من الأفعال تأخذ ed في الماضي.",
  "go فعل مميز: go → went ⭐",
  "في Past Simple نقول: I played – She played – They played. نفس الشكل!",
];

export const IRREGULARS = [
  { base: "go", past: "went", emoji: "🏫", today: "I go to school.", yesterday: "I went to school." },
  { base: "eat", past: "ate", emoji: "🍎", today: "I eat an apple.", yesterday: "I ate an apple." },
  { base: "see", past: "saw", emoji: "🦋", today: "I see a butterfly.", yesterday: "I saw a butterfly." },
  { base: "have", past: "had", emoji: "🎂", today: "I have a cake.", yesterday: "I had a cake." },
];
