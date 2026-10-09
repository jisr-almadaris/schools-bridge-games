export type Reward =
  | { kind: "digit"; digit: string; pos: number; label: string }
  | { kind: "key"; label: string }
  | { kind: "piece"; label: string };

export type MatchPair = { owner: string; ownerAr: string; pronoun: string };

export interface Challenge {
  id: number;
  scene: string; // background image
  tint: string; // overlay gradient tint
  clue: string; // svg clue id
  room: string; // room name (arabic)
  badgeLabel: string; // type label shown to student
  title: string;
  story: string; // arabic narrative
  // for choice / sentence types:
  type: "choice" | "match";
  prompt?: string; // english sentence (may contain ___)
  hint?: string; // arabic hint about owner
  options?: string[];
  correct?: number;
  explain: string; // why correct (arabic + english)
  // for match type:
  pairs?: MatchPair[];
  reward: Reward;
  focus: string; // which pronoun section to open in the notebook ("mine".. or "all")
}

export interface PronounInfo {
  key: string;
  word: string; // the possessive pronoun (mine ...)
  owner: string; // object pronoun (me ...)
  ownerAr: string;
  meaningAr: string;
  example: string; // short english example
  exampleAr: string; // arabic translation
  ruleAr: string; // simple rule explanation
  grad: string; // tailwind gradient
  ring: string; // ring color
}

export const PRONOUNS: PronounInfo[] = [
  {
    key: "mine",
    word: "mine",
    owner: "me",
    ownerAr: "أنا",
    meaningAr: "مِلكي أنا",
    example: "This pen is mine.",
    exampleAr: "هذا القلم مِلكي أنا.",
    ruleAr: "نستخدم mine عندما يخصّ الشيء المتكلّم نفسه (me / أنا).",
    grad: "from-rose-500 to-pink-600",
    ring: "ring-rose-300",
  },
  {
    key: "yours",
    word: "yours",
    owner: "you",
    ownerAr: "أنتَ / أنتِ",
    meaningAr: "مِلككَ / مِلككِ",
    example: "Is this book yours?",
    exampleAr: "هل هذا الكتاب مِلككِ؟",
    ruleAr: "نستخدم yours عندما يخصّ الشيء الشخص المُخاطَب (you / أنتَ أو أنتِ).",
    grad: "from-teal-500 to-cyan-600",
    ring: "ring-teal-300",
  },
  {
    key: "his",
    word: "his",
    owner: "him",
    ownerAr: "هو",
    meaningAr: "مِلكه هو",
    example: "The ball is his.",
    exampleAr: "الكرة مِلكه هو.",
    ruleAr: "نستخدم his عندما يخصّ الشيء ولدًا أو رجلًا (him / هو).",
    grad: "from-blue-500 to-indigo-600",
    ring: "ring-blue-300",
  },
  {
    key: "hers",
    word: "hers",
    owner: "her",
    ownerAr: "هي",
    meaningAr: "مِلكها هي",
    example: "The doll is hers.",
    exampleAr: "الدمية مِلكها هي.",
    ruleAr: "نستخدم hers عندما يخصّ الشيء بنتًا أو امرأة (her / هي).",
    grad: "from-fuchsia-500 to-purple-600",
    ring: "ring-fuchsia-300",
  },
  {
    key: "ours",
    word: "ours",
    owner: "us",
    ownerAr: "نحن",
    meaningAr: "مِلكنا نحن",
    example: "This classroom is ours.",
    exampleAr: "هذا الفصل مِلكنا نحن.",
    ruleAr: "نستخدم ours عندما يخصّ الشيء مجموعتنا نحن (us / نحن).",
    grad: "from-emerald-500 to-green-600",
    ring: "ring-emerald-300",
  },
  {
    key: "theirs",
    word: "theirs",
    owner: "them",
    ownerAr: "هم",
    meaningAr: "مِلكهم هم",
    example: "The garden is theirs.",
    exampleAr: "الحديقة مِلكهم هم.",
    ruleAr: "نستخدم theirs عندما يخصّ الشيء مجموعة أخرى (them / هم).",
    grad: "from-amber-500 to-orange-600",
    ring: "ring-amber-300",
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    scene: "/schools-bridge-games/game-possessives/images/scene-room.jpg",
    tint: "from-indigo-900/60 to-purple-900/70",
    clue: "book",
    room: "غرفة المكتب",
    badgeLabel: "🔍 اختاري الضمير الصحيح",
    title: "الكتاب الغامض",
    story:
      "وجدتِ كتابًا مفتوحًا على المكتب. قال صاحبه: «هذا الكتاب يخصّني أنا». أي ضمير مِلكية نستخدم؟",
    type: "choice",
    prompt: "This book is ____.",
    hint: "الكتاب يخصّني أنا (belongs to me)",
    options: ["mine", "yours", "his"],
    correct: 0,
    explain:
      "«mine» تعني «مِلكي أنا». عندما يخصّ الشيء المتكلّم (me) نستخدم mine. مثال: This book is mine.",
    focus: "mine",
    reward: { kind: "digit", digit: "7", pos: 0, label: "الرقم الأول من الشفرة" },
  },
  {
    id: 2,
    scene: "/schools-bridge-games/game-possessives/images/scene-bedroom.jpg",
    tint: "from-fuchsia-900/55 to-teal-900/65",
    clue: "bag",
    room: "غرفة النوم",
    badgeLabel: "🎒 مَن صاحب الحقيبة؟",
    title: "الحقيبة الوردية",
    story:
      "حقيبة وردية على السرير. عرفتِ أنها تخصّ الفتاة «سارة». أي ضمير نستخدم للفتاة؟",
    type: "choice",
    prompt: "The pink bag is ____.",
    hint: "الحقيبة تخصّ سارة، وهي فتاة (belongs to her)",
    options: ["his", "hers", "theirs"],
    correct: 1,
    explain:
      "«hers» تعني «مِلكها هي». عندما يخصّ الشيء فتاة/امرأة (her) نستخدم hers. مثال: The bag is hers.",
    focus: "hers",
    reward: { kind: "key", label: "🔑 مفتاح الأدراج" },
  },
  {
    id: 3,
    scene: "/schools-bridge-games/game-possessives/images/scene-library.jpg",
    tint: "from-slate-900/60 to-indigo-900/70",
    clue: "hat",
    room: "المكتبة الكبرى",
    badgeLabel: "✍️ أعيدي الصياغة",
    title: "قبعة الرحّالة",
    story:
      "قبعة أنيقة معلّقة قرب الرفوف، وهي تخصّ رجلاً. حوّلي الجملة لتنتهي بضمير المِلكية الصحيح.",
    type: "choice",
    prompt: "It is his hat.  →  The hat is ____.",
    hint: "القبعة تخصّ رجلًا (belongs to him)",
    options: ["her", "his", "him"],
    correct: 1,
    explain:
      "«his» تبقى his كضمير مِلكية. تخصّ الرجل (him). نقول: The hat is his. (ننتبه: him ضمير مفعول وليس مِلكية).",
    focus: "his",
    reward: { kind: "digit", digit: "3", pos: 1, label: "الرقم الثاني من الشفرة" },
  },
  {
    id: 4,
    scene: "/schools-bridge-games/game-possessives/images/scene-garden.jpg",
    tint: "from-emerald-900/50 to-purple-900/65",
    clue: "ball",
    room: "الحديقة السرّية",
    badgeLabel: "⚽ ضمير الجماعة",
    title: "كرة الفريق",
    story:
      "كرة ملوّنة قرب النافورة. قالت الطالبات: «هذه الكرة تخصّنا نحن الفريق». أي ضمير نستخدم؟",
    type: "choice",
    prompt: "This ball is ____.",
    hint: "الكرة تخصّنا نحن (belongs to us)",
    options: ["ours", "yours", "theirs"],
    correct: 0,
    explain:
      "«ours» تعني «مِلكنا نحن». عندما يخصّ الشيء مجموعتنا (us) نستخدم ours. مثال: This ball is ours.",
    focus: "ours",
    reward: { kind: "piece", label: "🧩 قطعة اللغز الأولى" },
  },
  {
    id: 5,
    scene: "/schools-bridge-games/game-possessives/images/scene-room.jpg",
    tint: "from-amber-900/45 to-indigo-950/70",
    clue: "pencil",
    room: "غرفة المكتب",
    badgeLabel: "❓ أكملي السؤال",
    title: "القلم المفقود",
    story:
      "قلمٌ رصاص على الأرض. سألتِ زميلتكِ: «هل هذا القلم يخصّكِ أنتِ؟» أكملي السؤال بالضمير الصحيح.",
    type: "choice",
    prompt: "Is this pencil ____?",
    hint: "نسأل الشخص المخاطَب: هل يخصّكِ أنتِ؟ (belongs to you)",
    options: ["mine", "yours", "hers"],
    correct: 1,
    explain:
      "«yours» تعني «مِلككَ / مِلككِ أنتَ/أنتِ». عند مخاطبة الشخص (you) نستخدم yours. مثال: Is this pencil yours?",
    focus: "yours",
    reward: { kind: "digit", digit: "9", pos: 2, label: "الرقم الثالث من الشفرة" },
  },
  {
    id: 6,
    scene: "/schools-bridge-games/game-possessives/images/scene-bedroom.jpg",
    tint: "from-cyan-900/55 to-fuchsia-950/65",
    clue: "car",
    room: "غرفة النوم",
    badgeLabel: "🚗 مِلك الآخرين",
    title: "سيّارة الجيران",
    story:
      "سيّارة لعبة صغيرة. عرفتِ أنها تخصّ الجيران (الأطفال الآخرين). أي ضمير نستخدم؟",
    type: "choice",
    prompt: "The toy car is ____.",
    hint: "السيّارة تخصّ الجيران، مجموعة أخرى (belongs to them)",
    options: ["ours", "theirs", "his"],
    correct: 1,
    explain:
      "«theirs» تعني «مِلكهم هم». عندما يخصّ الشيء مجموعة أخرى (them) نستخدم theirs. مثال: The car is theirs.",
    focus: "theirs",
    reward: { kind: "key", label: "🔑 مفتاح الخزانة الكبرى" },
  },
  {
    id: 7,
    scene: "/schools-bridge-games/game-possessives/images/scene-library.jpg",
    tint: "from-rose-900/45 to-indigo-950/70",
    clue: "cup",
    room: "المكتبة الكبرى",
    badgeLabel: "🕵️ اكتشفي الجملة الصحيحة",
    title: "كوب الأدلّة",
    story:
      "كوب خزفي عليه اسم فتاة. إحدى الجمل صحيحة نحويًا. اختاري الجملة الصحيحة عن مِلكية الفتاة.",
    type: "choice",
    prompt: "Choose the correct sentence:",
    hint: "الكوب يخصّ فتاة (her) — بعد الفعل is نستخدم ضمير المِلكية",
    options: ["This cup is her.", "This cup is hers.", "This cup is she."],
    correct: 1,
    explain:
      "الصحيح: «This cup is hers». بعد الفعل is نستخدم ضمير المِلكية hers، وليس her (مفعول) ولا she (فاعل).",
    focus: "hers",
    reward: { kind: "digit", digit: "1", pos: 3, label: "الرقم الرابع من الشفرة" },
  },
  {
    id: 8,
    scene: "/schools-bridge-games/game-possessives/images/scene-garden.jpg",
    tint: "from-violet-900/55 to-teal-950/65",
    clue: "chest",
    room: "الحديقة السرّية",
    badgeLabel: "🧠 لعبة المطابقة",
    title: "صندوق المطابقة الأخير",
    story:
      "الصندوق الأخير مقفل بلغز المطابقة! طابقي كل مالك بضمير المِلكية الصحيح لتحصلي على القطعة الأخيرة.",
    type: "match",
    hint: "اضغطي على المالك ثم على الضمير المناسب له",
    pairs: [
      { owner: "me", ownerAr: "أنا", pronoun: "mine" },
      { owner: "you", ownerAr: "أنتَ/أنتِ", pronoun: "yours" },
      { owner: "him", ownerAr: "هو", pronoun: "his" },
      { owner: "her", ownerAr: "هي", pronoun: "hers" },
      { owner: "us", ownerAr: "نحن", pronoun: "ours" },
      { owner: "them", ownerAr: "هم", pronoun: "theirs" },
    ],
    explain:
      "ممتاز! me→mine ، you→yours ، him→his ، her→hers ، us→ours ، them→theirs. أنتِ الآن تعرفين كل ضمائر المِلكية!",
    focus: "all",
    reward: { kind: "piece", label: "🧩 قطعة اللغز الأخيرة" },
  },
];

export const VAULT_CODE = "7391";

export const BADGES = [
  { id: "starter", label: "بداية المحققة", icon: "🎖️", need: 1 },
  { id: "keeper", label: "جامعة الأدلّة", icon: "🗝️", need: 3 },
  { id: "sharp", label: "عين المحققة", icon: "🔎", need: 5 },
  { id: "master", label: "محققة الشفرة", icon: "🏆", need: 8 },
];

export const INITIATIVE = {
  name: "مبادرة جسر المدارس 🌉",
  slogan:
    "جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.",
};
