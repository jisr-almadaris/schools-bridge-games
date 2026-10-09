export type Word = "AND" | "BUT" | "BECAUSE" | "WHEN";
export type Relation = "add" | "contrast" | "reason" | "time";

export const REL: Record<Relation, { icon: string; ar: string; en: string; word: Word; hint: string }> = {
  add: { icon: "➕", ar: "إضافة / فكرتان متشابهتان", en: "Addition", word: "AND", hint: "هل الفكرتان متشابهتان؟ هل الثانية تضيف شيئًا؟ 👀" },
  contrast: { icon: "⚡", ar: "اختلاف", en: "Contrast", word: "BUT", hint: "هل الفكرتان متشابهتان أم مختلفتان؟ 👀" },
  reason: { icon: "💡", ar: "سبب", en: "Reason", word: "BECAUSE", hint: "فكري… هل الفكرة الثانية تجيب عن سؤال: لماذا؟ 🤔" },
  time: { icon: "⏰", ar: "وقت", en: "Time", word: "WHEN", hint: "فكري… هل الفكرة الثانية سبب أم وقت؟ 👀" },
};

export const WORD_INFO: Record<Word, { icon: string; ar: string; rel: Relation; color: string; rule: string }> = {
  AND: { icon: "➕", ar: "إضافة", rel: "add", color: "#3ee8d8", rule: "AND = إضافة فكرة مشابهة ➕" },
  BUT: { icon: "⚡", ar: "اختلاف", rel: "contrast", color: "#ffd35c", rule: "BUT = اختلاف بين فكرتين ⚡" },
  BECAUSE: { icon: "💡", ar: "سبب", rel: "reason", color: "#ff9fd0", rule: "BECAUSE = السبب 💡" },
  WHEN: { icon: "⏰", ar: "وقت", rel: "time", color: "#9fb8ff", rule: "WHEN = الوقت ⏰" },
};

export const wordHint = (w: Word) => REL[WORD_INFO[w].rel].hint;

export interface Idea { emoji: string; text: string; label?: string }

export type Question =
  | { id: string; type: "relation"; prompt: string; ideas: [Idea, Idea]; sentence: [string, string]; answer: Relation; options?: Relation[]; thenWord?: Word[]; reveal: Word }
  | { id: string; type: "choice"; prompt: string; context?: Idea[]; ask?: string; options: string[]; answer: number; hint: string; rule: string }
  | { id: string; type: "drag"; prompt: string; ideas: [Idea, Idea]; sentence: [string, string]; bank: Word[]; answer: Word; target?: "gap" | "clock" }
  | { id: string; type: "pairs"; prompt: string; pairs: [Idea, Idea][]; answer: number; hint: string; rule: string }
  | { id: string; type: "drawers"; prompt: string; base: string; ask: string; drawers: Idea[]; answer: number; hint: string; full: [string, string]; thenWord?: Word[] }
  | { id: string; type: "fix"; prompt: string; tokens: [string, Word, string]; options: Word[]; answer: Word }
  | { id: string; type: "classify"; prompt: string; items: { text: string; rel: "time" | "reason" }[] }
  | { id: string; type: "order"; prompt: string; ideas: [Idea, Idea]; tokens: string[]; answer: string[]; hint: string; rule: string; clock?: boolean }
  | { id: string; type: "match4"; prompt: string; items: { before: string; after: string; word: Word }[] };

export type RoomStep =
  | { kind: "discover"; q: Question }
  | { kind: "explain" }
  | { kind: "q"; q: Question }
  | { kind: "reward" };

export interface RoomDef {
  id: "mirror" | "storm" | "secret" | "time";
  word: Word;
  icon: string;
  nameAr: string;
  nameEn: string;
  key: string;
  keyAr: string;
  digit: number;
  door: { color: string; frame: string; shape: "arch" | "round" | "tall" | "gear" };
  explain: { ar: string; en: string; example: [string, string, string]; exampleEmoji: string; visual?: string[] };
  runeTip: string;
  rewardAr: string;
  steps: RoomStep[];
}

export const ROOMS: RoomDef[] = [
  {
    id: "mirror", word: "AND", icon: "🪞", nameAr: "غرفة المرآة", nameEn: "Mirror Room", key: "MIRROR KEY", keyAr: "مفتاح المرآة", digit: 7,
    door: { color: "#2f7f86", frame: "#b9e8ff", shape: "arch" },
    explain: { ar: "نستخدم AND لإضافة فكرة مشابهة أو ربط شيئين معًا.", en: "AND connects similar ideas.", example: ["She likes apples ", "AND", " bananas."], exampleEmoji: "🍎 ➕ 🍌" },
    runeTip: "إذا كانت الفكرة الثانية تضيف شيئًا مشابهًا، فكري في AND.",
    rewardAr: "تشققت مرآة… وخلفها صندوق صغير!",
    steps: [
      { kind: "discover", q: { id: "m1", type: "relation", prompt: "ما العلاقة بين الفكرتين؟ 👀", ideas: [{ emoji: "🏊‍♀️", text: "Girl swimming" }, { emoji: "🎾", text: "Girl playing tennis" }], sentence: ["I go swimming", "play tennis on Saturdays."], answer: "add", reveal: "AND" } },
      { kind: "explain" },
      { kind: "q", q: { id: "m2", type: "drag", prompt: "اسحبي الكلمة السحرية بين المرآتين ✨", ideas: [{ emoji: "📖", text: "reading" }, { emoji: "✏️", text: "writing" }], sentence: ["She likes reading", "writing."], bank: ["BUT", "AND", "WHEN"], answer: "AND" } },
      { kind: "q", q: { id: "m3", type: "order", prompt: "رتّبي قطع الجملة السحرية بالضغط عليها بالترتيب 🧩", ideas: [{ emoji: "🎤", text: "sings" }, { emoji: "💃", text: "dances" }], tokens: ["dances.", "My sister sings", "and"], answer: ["My sister sings", "and", "dances."], hint: "ابدئي بالفكرة الأولى… ثم الرابط ➕ ثم الفكرة الثانية.", rule: "AND = إضافة فكرة مشابهة ➕" } },
      { kind: "reward" },
    ],
  },
  {
    id: "storm", word: "BUT", icon: "⚡", nameAr: "غرفة المفاجآت", nameEn: "Storm Room", key: "STORM KEY", keyAr: "مفتاح العاصفة", digit: 3,
    door: { color: "#6e1a3d", frame: "#ffd35c", shape: "tall" },
    explain: { ar: "نستخدم BUT عندما تكون الفكرة الثانية مختلفة أو عكس المتوقع.", en: "BUT shows contrast.", example: ["I can run, ", "BUT", " I can't swim."], exampleEmoji: "🏃‍♀️ ✅  ⚡  🏊‍♀️ ❌" },
    runeTip: "إذا كانت الفكرة الثانية مختلفة أو تعاكس الأولى، فكري في BUT.",
    rewardAr: "برق! انفتحت لوحة مخفية في الجدار!",
    steps: [
      { kind: "discover", q: { id: "s1", type: "relation", prompt: "هل الفكرتان متشابهتان أم بينهما اختلاف؟ 🤔", ideas: [{ emoji: "🚲", text: "I want to ride my bike", label: "😊" }, { emoji: "🥵", text: "It's very hot", label: "☀️" }], sentence: ["I want to ride my bike,", "it's very hot."], answer: "contrast", options: ["add", "contrast"], reveal: "BUT" } },
      { kind: "explain" },
      { kind: "q", q: { id: "s2", type: "pairs", prompt: "أي زوج يناسب BUT؟ ⚡", pairs: [
        [{ emoji: "🍎", text: "I like apples." }, { emoji: "🍌", text: "I like bananas." }],
        [{ emoji: "🙂", text: "I like swimming." }, { emoji: "😕", text: "I don't like running." }],
        [{ emoji: "🐱", text: "I have a cat." }, { emoji: "🐶", text: "I have a dog." }],
      ], answer: 1, hint: "ابحثي عن فكرتين مختلفتين… واحدة تحب وواحدة لا تحب 👀", rule: "BUT = اختلاف بين فكرتين ⚡" } },
      { kind: "q", q: { id: "s3", type: "choice", prompt: "اختاري الجملة الأنسب ✨", context: [{ emoji: "🏃‍♀️", text: "can run ✅" }, { emoji: "🏊‍♀️", text: "can't swim ❌" }], options: ["She can run, and she can't swim.", "She can run, but she can't swim."], answer: 1, hint: "هل الفكرتان متشابهتان أم مختلفتان؟ ✅ و ❌", rule: "BUT = اختلاف ⚡" } },
      { kind: "reward" },
    ],
  },
  {
    id: "secret", word: "BECAUSE", icon: "💡", nameAr: "غرفة السر الخفي", nameEn: "Hidden Secret Room", key: "REASON KEY", keyAr: "مفتاح السبب", digit: 5,
    door: { color: "#3b1f6e", frame: "#ff9fd0", shape: "round" },
    explain: { ar: "BECAUSE = السبب. نستخدمها لنجيب عن سؤال: لماذا؟", en: "BECAUSE gives a reason.", example: ["I stayed home ", "BECAUSE", " I was tired."], exampleEmoji: "🏠 💡 😴", visual: ["WHY? 🤔", "BECAUSE 💡", "REASON"] },
    runeTip: "إذا سألتِ WHY؟ وكانت الفكرة الثانية تشرح السبب، فكري في BECAUSE.",
    rewardAr: "كتاب قديم فتح نفسه…!",
    steps: [
      { kind: "discover", q: { id: "b1", type: "drawers", prompt: "هناك سبب مخفي في أحد الأدراج… 🗄️", base: "I went to the shopping mall.", ask: "WHY? 🤔", drawers: [{ emoji: "🌙", text: "At night." }, { emoji: "👕", text: "I had to buy clothes." }, { emoji: "📅", text: "On Monday." }], answer: 1, hint: "هذا يخبرنا متى… لكننا نبحث عن: لماذا؟ 🤔", full: ["I went to the shopping mall", "I had to buy clothes."] } },
      { kind: "explain" },
      { kind: "q", q: { id: "b2", type: "choice", prompt: "اختاري السبب المناسب 💡", context: [{ emoji: "🏠", text: "stayed home" }, { emoji: "😴", text: "tired" }], ask: "Why did she stay home?", options: ["At school.", "Because she was tired.", "When it was night."], answer: 1, hint: "السؤال WHY؟ يبحث عن سبب… لا مكان ولا وقت 🤔", rule: "WHY? → BECAUSE 💡" } },
      { kind: "q", q: { id: "b3", type: "drag", prompt: "اسحبي BECAUSE بين النتيجة والسبب 💡", ideas: [{ emoji: "💧", text: "I drank water", label: "النتيجة" }, { emoji: "🥵", text: "I was thirsty", label: "السبب" }], sentence: ["I drank water", "I was thirsty."], bank: ["WHEN", "BECAUSE", "BUT"], answer: "BECAUSE" } },
      { kind: "reward" },
    ],
  },
  {
    id: "time", word: "WHEN", icon: "⏰", nameAr: "غرفة الزمن", nameEn: "Time Room", key: "TIME KEY", keyAr: "مفتاح الزمن", digit: 1,
    door: { color: "#7a5217", frame: "#9fb8ff", shape: "gear" },
    explain: { ar: "نستخدم WHEN عندما نتحدث عن وقت حدوث شيء.", en: "WHEN tells us when something happens.", example: ["", "WHEN", " I need help, I can ask you."], exampleEmoji: "🙋‍♀️ ⏰ 🤝", visual: ["WHEN", "TIME ⏰"] },
    runeTip: "إذا كانت الجملة تخبركِ متى حدث شيء، فكري في WHEN.",
    rewardAr: "توقفت الساعة… ثم عادت عقاربها للخلف!",
    steps: [
      { kind: "discover", q: { id: "w1", type: "relation", prompt: "متى أطلب المساعدة؟ ما العلاقة؟ ⏰", ideas: [{ emoji: "🙋‍♀️", text: "I need help" }, { emoji: "🤝", text: "I can ask you" }], sentence: ["", "I need help, I can ask you."], answer: "time", options: ["reason", "time"], reveal: "WHEN" } },
      { kind: "explain" },
      { kind: "q", q: { id: "w2", type: "drag", prompt: "اسحبي الكلمة إلى الساعة السحرية ⏰", ideas: [{ emoji: "🚌", text: "The bus stopped." }, { emoji: "👦", text: "He got off the bus." }], sentence: ["He got off the bus", "it stopped."], bank: ["AND", "WHEN", "BUT"], answer: "WHEN", target: "clock" } },
      { kind: "q", q: { id: "w3", type: "classify", prompt: "هل الجملة تتحدث عن ⏰ وقت أم 💡 سبب؟", items: [
        { text: "I wear a coat when it is cold.", rel: "time" },
        { text: "I am happy because it is my birthday.", rel: "reason" },
        { text: "I brush my teeth when I wake up.", rel: "time" },
      ] } },
      { kind: "reward" },
    ],
  },
];

export const FINAL: Question[] = [
  { id: "f1", type: "relation", prompt: "العلاقة أولًا: ما العلاقة بين الفكرتين؟", ideas: [{ emoji: "🌙", text: "It is night." }, { emoji: "😴", text: "I go to bed." }], sentence: ["I go to bed", "it is night."], answer: "time", thenWord: ["AND", "BUT", "BECAUSE", "WHEN"], reveal: "WHEN" },
  { id: "f2", type: "fix", prompt: "أصلحي الجملة! كلمة واحدة تلمع… فيها خطأ ⚠️", tokens: ["She can run,", "AND", "she can't swim."], options: ["BUT", "BECAUSE", "WHEN"], answer: "BUT" },
  { id: "f3", type: "drawers", prompt: "افتحي درج السبب 🗄️", base: "Ali went home.", ask: "Why did Ali go home?", drawers: [{ emoji: "🌳", text: "At the park." }, { emoji: "📅", text: "On Sunday." }, { emoji: "🤒", text: "He was sick." }], answer: 2, hint: "نبحث عن سبب… لماذا ذهب علي إلى البيت؟ 🤔", full: ["Ali went home", "he was sick."], thenWord: ["BUT", "BECAUSE", "AND"] },
  { id: "f4", type: "order", prompt: "ساعة WHEN: رتّبي الحدثين حول الساعة وضعي WHEN بينهما ⏰", ideas: [{ emoji: "🌅", text: "I wake up" }, { emoji: "🥞", text: "I eat breakfast" }], tokens: ["I wake up.", "WHEN", "I eat breakfast"], answer: ["I eat breakfast", "WHEN", "I wake up."], hint: "ابدئي بما أفعله (I eat breakfast) ثم WHEN ثم الوقت ⏰", rule: "WHEN = الوقت ⏰", clock: true },
  { id: "f5", type: "drag", prompt: "اربطي المشهدين المتشابهين 🎨🎤", ideas: [{ emoji: "🎨", text: "She can draw." }, { emoji: "🎤", text: "She can sing." }], sentence: ["She can draw", "sing."], bank: ["BECAUSE", "WHEN", "AND", "BUT"], answer: "AND" },
  { id: "f6", type: "match4", prompt: "تحدي الأسرار الأربعة: اسحبي كل كلمة إلى جملتها 🔮", items: [
    { before: "I like tea", after: "milk.", word: "AND" },
    { before: "I am small,", after: "I am strong.", word: "BUT" },
    { before: "I am happy", after: "it is my birthday.", word: "BECAUSE" },
    { before: "I smile", after: "I see my mom.", word: "WHEN" },
  ] },
];

export const TOTAL_QUESTIONS = ROOMS.reduce((a, r) => a + r.steps.filter((s) => s.kind === "discover" || s.kind === "q").length, 0) + FINAL.length;
export const FIRST_CODE = "2468";
export const FINAL_CODE = ROOMS.map((r) => r.digit).join("");
