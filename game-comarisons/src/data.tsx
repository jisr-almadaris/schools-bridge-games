import type { SceneItem } from "./graphics";

export interface Question {
  scene: SceneItem[];
  prompt: string; // Arabic instruction
  sentence: string; // English sentence with ____
  options: string[];
  correct: number;
  hint: string; // smart hint (Arabic)
  explain: string; // feedback explanation (Arabic)
}

export interface LessonPoint {
  ar: string;
  en?: string;
}

export interface IslandData {
  name: string;
  subtitle: string;
  emoji: string;
  gradient: string; // tailwind gradient classes for header
  tint: string; // island graphic tint
  lesson: {
    title: string;
    points: LessonPoint[];
    scene: SceneItem[];
    example: { en: string; ar: string };
    table?: string[][];
  };
  questions: Question[];
}

export const ISLANDS: IslandData[] = [
  /* ================= 1. جزيرة المقارنة ================= */
  {
    name: "جزيرة المقارنة",
    subtitle: "Comparative Island",
    emoji: "⚖️",
    gradient: "from-sky-500 to-blue-600",
    tint: "#38bdf8",
    lesson: {
      title: "متى نستخدم Comparative؟",
      points: [
        { ar: "نستخدم صيغة المقارنة Comparative عندما نقارن بين شيئين اثنين فقط." },
        { ar: "نضيف er- إلى نهاية الصفة، ثم نكتب كلمة than بعدها.", en: "big ➜ bigger than" },
        { ar: "انظري إلى الصورة: البيت الأزرق أكبر من البيت الأصفر!" },
      ],
      scene: [
        { type: "house", color: "blue", h: 165, label: "blue" },
        { type: "house", color: "yellow", h: 95, label: "yellow" },
      ],
      example: {
        en: "The blue house is bigger than the yellow house.",
        ar: "البيت الأزرق أكبر من البيت الأصفر.",
      },
    },
    questions: [
      {
        scene: [
          { type: "house", color: "blue", h: 165, label: "blue" },
          { type: "house", color: "yellow", h: 95, label: "yellow" },
        ],
        prompt: "انظري إلى البيتين ثم أكملي الجملة:",
        sentence: "The blue house is ____ the yellow house.",
        options: ["bigger than", "the biggest", "big"],
        correct: 0,
        hint: "نحن نقارن بين بيتين اثنين فقط… ماذا نضيف إلى الصفة؟ ولا تنسي الكلمة السحرية التي تأتي بعدها! 🔍",
        explain: "لأننا نقارن بين شيئين (بيتين) نستخدم صيغة المقارنة: bigger + than. الجملة: The blue house is bigger than the yellow house.",
      },
      {
        scene: [
          { type: "tree", color: "green", h: 170, label: "green" },
          { type: "tree", color: "orange", h: 100, label: "orange" },
        ],
        prompt: "أي كلمة تكمل الجملة بشكل صحيح؟",
        sentence: "The green tree is ____ than the orange tree.",
        options: ["tall", "taller", "the tallest"],
        correct: 1,
        hint: "لدينا شجرتان فقط، والكلمة than موجودة في الجملة… فما الصيغة التي تأتي قبل than؟ 🌳",
        explain: "عند المقارنة بين شجرتين نضيف er- للصفة: tall ➜ taller. الجملة: The green tree is taller than the orange tree.",
      },
      {
        scene: [
          { type: "pencil", color: "red", h: 170, label: "red" },
          { type: "pencil", color: "blue", h: 100, label: "blue" },
        ],
        prompt: "انظري إلى القلمين ثم اختاري الإجابة الصحيحة:",
        sentence: "The red pencil is ____ than the blue pencil.",
        options: ["the longest", "long", "longer"],
        correct: 2,
        hint: "القلم الأحمر طويل والقلم الأزرق قصير… قارني بينهما بإضافة er- إلى long ✏️",
        explain: "نقارن بين قلمين اثنين، لذلك: long ➜ longer. الجملة: The red pencil is longer than the blue pencil.",
      },
    ],
  },

  /* ================= 2. جزيرة الكلمات ================= */
  {
    name: "جزيرة الكلمات",
    subtitle: "Words Island",
    emoji: "🔤",
    gradient: "from-violet-500 to-purple-600",
    tint: "#c084fc",
    lesson: {
      title: "كنز الكلمات! 💎",
      points: [
        { ar: "لكل صفة ثلاث صور: الصفة الأصلية، وصيغة المقارنة (er-)، وصيغة التفضيل (the + est-)." },
        { ar: "انتبهي لكلمة big: نضاعف الحرف الأخير قبل الإضافة!", en: "big ➜ bigger ➜ the biggest" },
        { ar: "احفظي هذا الجدول الذهبي جيدًا، فهو مفتاح كل الجزر! 🗝️" },
      ],
      scene: [
        { type: "book", color: "purple", h: 150, label: "words" },
        { type: "book", color: "teal", h: 120, label: "book" },
        { type: "book", color: "pink", h: 95, label: "fun" },
      ],
      example: {
        en: "small ➜ smaller ➜ the smallest",
        ar: "صغير ➜ أصغر من ➜ الأصغر على الإطلاق",
      },
      table: [
        ["الصفة", "المقارنة Comparative", "التفضيل Superlative"],
        ["big", "bigger", "the biggest"],
        ["small", "smaller", "the smallest"],
        ["tall", "taller", "the tallest"],
        ["short", "shorter", "the shortest"],
        ["long", "longer", "the longest"],
      ],
    },
    questions: [
      {
        scene: [
          { type: "bag", color: "purple", h: 150, label: "big" },
          { type: "bag", color: "teal", h: 95, label: "small" },
        ],
        prompt: "ما صيغة المقارنة الصحيحة لكلمة big؟",
        sentence: "big ➜ ____",
        options: ["biger", "bigger", "the biggest"],
        correct: 1,
        hint: "كلمة big مميزة… نضاعف حرف g قبل أن نضيف er! 🎒",
        explain: "الصحيح: bigger — نضاعف حرف g ثم نضيف er. أما the biggest فهي صيغة التفضيل وليست المقارنة.",
      },
      {
        scene: [
          { type: "flower", color: "pink", h: 100, label: "small" },
          { type: "flower", color: "purple", h: 150, label: "big" },
        ],
        prompt: "ما صيغة المقارنة الصحيحة لكلمة small؟",
        sentence: "small ➜ ____",
        options: ["smaller", "smallest", "more small"],
        correct: 0,
        hint: "الصفات القصيرة تحب إضافة er- في صيغة المقارنة، ولا تحتاج كلمة more 🌸",
        explain: "الصحيح: smaller — نضيف er- مباشرة إلى small. لا نستخدم more مع الصفات القصيرة.",
      },
      {
        scene: [
          { type: "tree", color: "green", h: 170, label: "tall" },
          { type: "tree", color: "teal", h: 125, label: "" },
          { type: "tree", color: "orange", h: 85, label: "short" },
        ],
        prompt: "ما صيغة التفضيل الصحيحة لكلمة tall؟",
        sentence: "tall ➜ ____",
        options: ["taller", "the tallest", "tallest than"],
        correct: 1,
        hint: "صيغة التفضيل تحتاج شيئين معًا: كلمة the في البداية و est- في النهاية 🌟",
        explain: "الصحيح: the tallest — صيغة التفضيل = the + الصفة + est. كلمة than تُستخدم مع المقارنة فقط.",
      },
      {
        scene: [
          { type: "pencil", color: "green", h: 85, label: "short" },
          { type: "pencil", color: "orange", h: 160, label: "long" },
        ],
        prompt: "ما صيغة المقارنة الصحيحة لكلمة short؟",
        sentence: "short ➜ ____",
        options: ["the shortest", "shortter", "shorter"],
        correct: 2,
        hint: "أضيفي er- فقط دون مضاعفة أي حرف… وانتبهي من الأخطاء الإملائية! ✏️",
        explain: "الصحيح: shorter — نضيف er- إلى short دون مضاعفة الحرف الأخير.",
      },
    ],
  },

  /* ================= 3. جزيرة التفضيل ================= */
  {
    name: "جزيرة التفضيل",
    subtitle: "Superlative Island",
    emoji: "🏆",
    gradient: "from-amber-400 to-orange-500",
    tint: "#fbbf24",
    lesson: {
      title: "متى نستخدم Superlative؟",
      points: [
        { ar: "نستخدم صيغة التفضيل Superlative لاختيار شيء واحد مميز من مجموعة (ثلاثة أشياء أو أكثر)." },
        { ar: "نكتب the قبل الصفة ونضيف est- في نهايتها.", en: "tall ➜ the tallest" },
        { ar: "انظري إلى الورود الثلاث: الوردة البنفسجية هي الأطول بينها جميعًا!" },
      ],
      scene: [
        { type: "flower", color: "purple", h: 170, label: "purple" },
        { type: "flower", color: "pink", h: 125, label: "pink" },
        { type: "flower", color: "yellow", h: 90, label: "yellow" },
      ],
      example: {
        en: "The purple flower is the tallest.",
        ar: "الوردة البنفسجية هي الأطول.",
      },
    },
    questions: [
      {
        scene: [
          { type: "flower", color: "purple", h: 170, label: "purple" },
          { type: "flower", color: "pink", h: 125, label: "pink" },
          { type: "flower", color: "yellow", h: 90, label: "yellow" },
        ],
        prompt: "انظري إلى الورود الثلاث ثم أكملي:",
        sentence: "The purple flower is ____.",
        options: ["taller", "the tallest", "tall than"],
        correct: 1,
        hint: "لدينا ثلاث ورود وليس وردتين… نختار المميزة منها بـ the + est 🌷",
        explain: "لأننا نختار وردة واحدة مميزة من ثلاث ورود نستخدم التفضيل: the tallest. الجملة: The purple flower is the tallest.",
      },
      {
        scene: [
          { type: "bag", color: "red", h: 155, label: "red" },
          { type: "bag", color: "blue", h: 115, label: "blue" },
          { type: "bag", color: "green", h: 80, label: "green" },
        ],
        prompt: "أي شنطة هي الأصغر؟ أكملي الجملة:",
        sentence: "The green bag is ____.",
        options: ["the smallest", "smaller than", "small"],
        correct: 0,
        hint: "الشنطة الخضراء واحدة مميزة بين ثلاث شنط… فهي الأصغر على الإطلاق! 🎒",
        explain: "الشنطة الخضراء هي الأصغر بين ثلاث شنط، لذلك نستخدم: the smallest. الجملة: The green bag is the smallest.",
      },
      {
        scene: [
          { type: "car", color: "red", h: 95, label: "red" },
          { type: "car", color: "teal", h: 70, label: "teal" },
          { type: "car", color: "yellow", h: 52, label: "yellow" },
        ],
        prompt: "انظري إلى السيارات الثلاث ثم أكملي:",
        sentence: "The red car is ____.",
        options: ["big", "bigger than", "the biggest"],
        correct: 2,
        hint: "ثلاث سيارات في السباق… والسيارة الحمراء هي الأكبر بينها جميعًا! 🚗 تذكري: the + est",
        explain: "نختار السيارة الأكبر من بين ثلاث سيارات، فنستخدم التفضيل: the biggest. الجملة: The red car is the biggest.",
      },
    ],
  },

  /* ================= 4. جزيرة التفكير ================= */
  {
    name: "جزيرة التفكير",
    subtitle: "Thinking Island",
    emoji: "🧠",
    gradient: "from-teal-500 to-emerald-600",
    tint: "#2dd4bf",
    lesson: {
      title: "فكّري جيدًا: اثنان أم مجموعة؟ 🤔",
      points: [
        { ar: "هنا سرّ اللعبة كله: عدّي الأشياء في الصورة أولًا!" },
        { ar: "شيئان اثنان ➜ نستخدم المقارنة Comparative مع er + than.", en: "smaller than" },
        { ar: "ثلاثة أشياء أو أكثر ➜ نستخدم التفضيل Superlative مع the + est.", en: "the smallest" },
      ],
      scene: [
        { type: "book", color: "purple", h: 150, label: "2 ➜ er + than" },
        { type: "book", color: "teal", h: 100, label: "" },
        { type: "flower", color: "pink", h: 145, label: "3 ➜ the + est" },
        { type: "flower", color: "purple", h: 110, label: "" },
        { type: "flower", color: "yellow", h: 80, label: "" },
      ],
      example: {
        en: "Two ➜ er + than  |  Three or more ➜ the + est",
        ar: "شيئان ➜ مقارنة | ثلاثة فأكثر ➜ تفضيل",
      },
    },
    questions: [
      {
        scene: [
          { type: "book", color: "purple", h: 155, label: "purple" },
          { type: "book", color: "orange", h: 100, label: "orange" },
        ],
        prompt: "عدّي الكتب أولًا ثم اختاري:",
        sentence: "The purple book is ____ than the orange book.",
        options: ["the biggest", "bigger", "biggest"],
        correct: 1,
        hint: "كم كتابًا ترين في الصورة؟ كتابان فقط! وكلمة than موجودة في الجملة… 📚",
        explain: "كتابان اثنان فقط + وجود than = صيغة المقارنة bigger. الجملة: The purple book is bigger than the orange book.",
      },
      {
        scene: [
          { type: "tree", color: "teal", h: 110, label: "" },
          { type: "tree", color: "green", h: 175, label: "middle" },
          { type: "tree", color: "orange", h: 95, label: "" },
        ],
        prompt: "كم شجرة في الصورة؟ فكّري ثم أكملي:",
        sentence: "The middle tree is ____.",
        options: ["the tallest", "taller than", "tall"],
        correct: 0,
        hint: "عدّي الأشجار: واحدة، اثنتان، ثلاث! ولا توجد كلمة than في الجملة… 🌳",
        explain: "ثلاث أشجار = مجموعة، فنختار المميزة بالتفضيل: the tallest. الجملة: The middle tree is the tallest.",
      },
      {
        scene: [
          { type: "bag", color: "pink", h: 90, label: "pink" },
          { type: "bag", color: "blue", h: 150, label: "blue" },
        ],
        prompt: "انظري إلى الشنطتين ثم اختاري:",
        sentence: "The pink bag is ____ than the blue bag.",
        options: ["the smallest", "small", "smaller"],
        correct: 2,
        hint: "شنطتان فقط، والجملة فيها than… إذن نحتاج صيغة الـ er 🎒",
        explain: "شنطتان اثنتان = مقارنة: smaller than. الجملة: The pink bag is smaller than the blue bag.",
      },
      {
        scene: [
          { type: "pencil", color: "red", h: 160, label: "red" },
          { type: "pencil", color: "blue", h: 125, label: "blue" },
          { type: "pencil", color: "green", h: 75, label: "green" },
        ],
        prompt: "ثلاثة أقلام أمامك… أكملي الجملة:",
        sentence: "The green pencil is ____.",
        options: ["shorter than", "the shortest", "short"],
        correct: 1,
        hint: "ثلاثة أقلام وليس قلمين! القلم الأخضر هو الأقصر بينها جميعًا ✏️",
        explain: "من بين ثلاثة أقلام، الأخضر هو الأقصر على الإطلاق: the shortest. الجملة: The green pencil is the shortest.",
      },
    ],
  },

  /* ================= 5. جزيرة التحدي النهائي ================= */
  {
    name: "جزيرة التحدي النهائي",
    subtitle: "Final Challenge Island",
    emoji: "🔥",
    gradient: "from-fuchsia-500 to-purple-700",
    tint: "#e879f9",
    lesson: {
      title: "التحدي النهائي! 🔥",
      points: [
        { ar: "وصلتِ إلى الجزيرة الأخيرة… هنا يجتمع كل ما تعلمتِه!" },
        { ar: "8 أسئلة متنوعة بين المقارنة والتفضيل. عدّي الأشياء في كل صورة قبل الإجابة." },
        { ar: "أجيبي بتركيز واحصلي على أعلى درجة وشهادة الإنجاز الذهبية! 🏅" },
      ],
      scene: [
        { type: "house", color: "purple", h: 140, label: "" },
        { type: "car", color: "teal", h: 75, label: "" },
        { type: "flower", color: "pink", h: 130, label: "" },
      ],
      example: {
        en: "Good luck, champion! 🌟",
        ar: "حظًا موفقًا يا بطلة!",
      },
    },
    questions: [
      {
        scene: [
          { type: "house", color: "green", h: 100, label: "green" },
          { type: "house", color: "purple", h: 165, label: "purple" },
        ],
        prompt: "السؤال الأول: انظري إلى البيتين.",
        sentence: "The purple house is ____ than the green house.",
        options: ["bigger", "the biggest", "big"],
        correct: 0,
        hint: "بيتان اثنان فقط، وكلمة than تنتظر صديقتها المنتهية بـ er 🏠",
        explain: "بيتان = مقارنة: bigger than. الجملة: The purple house is bigger than the green house.",
      },
      {
        scene: [
          { type: "flower", color: "red", h: 95, label: "red" },
          { type: "flower", color: "teal", h: 130, label: "teal" },
          { type: "flower", color: "purple", h: 170, label: "purple" },
        ],
        prompt: "السؤال الثاني: ثلاث ورود جميلة!",
        sentence: "The purple flower is ____.",
        options: ["taller than", "tall", "the tallest"],
        correct: 2,
        hint: "عدّي الورود… ثلاث! ولا توجد than في الجملة 🌷",
        explain: "ثلاث ورود = تفضيل: the tallest. الجملة: The purple flower is the tallest.",
      },
      {
        scene: [
          { type: "car", color: "blue", h: 90, label: "blue" },
          { type: "car", color: "yellow", h: 58, label: "yellow" },
        ],
        prompt: "السؤال الثالث: سيارتان في الشارع.",
        sentence: "The yellow car is ____ than the blue car.",
        options: ["smaller", "the smallest", "smallest"],
        correct: 0,
        hint: "سيارتان فقط… وthan موجودة، فنحتاج صيغة er 🚗",
        explain: "سيارتان = مقارنة: smaller than. الجملة: The yellow car is smaller than the blue car.",
      },
      {
        scene: [
          { type: "pencil", color: "purple", h: 170, label: "purple" },
          { type: "pencil", color: "orange", h: 120, label: "orange" },
          { type: "pencil", color: "teal", h: 80, label: "teal" },
        ],
        prompt: "السؤال الرابع: ثلاثة أقلام ملوّنة.",
        sentence: "The purple pencil is ____.",
        options: ["longer than", "the longest", "long"],
        correct: 1,
        hint: "ثلاثة أقلام = مجموعة… اختاري المميز بـ the + est ✏️",
        explain: "من بين ثلاثة أقلام، البنفسجي هو الأطول: the longest. الجملة: The purple pencil is the longest.",
      },
      {
        scene: [
          { type: "tree", color: "green", h: 120, label: "green" },
          { type: "tree", color: "teal", h: 170, label: "teal" },
        ],
        prompt: "السؤال الخامس: شجرتان في الحديقة.",
        sentence: "The green tree is ____ than the teal tree.",
        options: ["the shortest", "shorter", "short"],
        correct: 1,
        hint: "شجرتان فقط… والشجرة الخضراء أقصر. أضيفي er إلى short 🌳",
        explain: "شجرتان = مقارنة: shorter than. الجملة: The green tree is shorter than the teal tree.",
      },
      {
        scene: [
          { type: "book", color: "red", h: 150, label: "red" },
          { type: "book", color: "blue", h: 115, label: "blue" },
          { type: "book", color: "green", h: 80, label: "green" },
        ],
        prompt: "السؤال السادس: ثلاثة كتب على الرف.",
        sentence: "The red book is ____.",
        options: ["the biggest", "bigger than", "big"],
        correct: 0,
        hint: "ثلاثة كتب! الكتاب الأحمر مميز بينها جميعًا… the + est 📚",
        explain: "ثلاثة كتب = تفضيل: the biggest. الجملة: The red book is the biggest.",
      },
      {
        scene: [
          { type: "bag", color: "teal", h: 150, label: "teal" },
          { type: "bag", color: "pink", h: 95, label: "pink" },
        ],
        prompt: "السؤال السابع: شنطتان للمدرسة.",
        sentence: "The teal bag is ____ than the pink bag.",
        options: ["big", "the biggest", "bigger"],
        correct: 2,
        hint: "شنطتان اثنتان وكلمة than في الجملة… فما الصيغة المناسبة؟ 🎒",
        explain: "شنطتان = مقارنة: bigger than. الجملة: The teal bag is bigger than the pink bag.",
      },
      {
        scene: [
          { type: "house", color: "orange", h: 90, label: "orange" },
          { type: "house", color: "teal", h: 130, label: "teal" },
          { type: "house", color: "purple", h: 170, label: "purple" },
        ],
        prompt: "السؤال الأخير: ثلاثة بيوت في الحي!",
        sentence: "The orange house is ____.",
        options: ["smaller than", "the smallest", "small"],
        correct: 1,
        hint: "آخر سؤال يا بطلة! ثلاثة بيوت… والبيت البرتقالي هو الأصغر بينها جميعًا 🏠",
        explain: "ثلاثة بيوت = تفضيل: the smallest. الجملة: The orange house is the smallest.",
      },
    ],
  },
];

export const INITIATIVE = {
  title: "مبادرة جسر المدارس 🌉",
  motto: "«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»",
};
