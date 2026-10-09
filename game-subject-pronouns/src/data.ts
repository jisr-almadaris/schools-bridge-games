import { IMAGES } from "./media";

export { IMAGES };

export const INITIATIVE_NAME = "مبادرة جسر المدارس 🌉";
export const INITIATIVE_QUOTE =
  "«جسرٌ يربط المعرفة بين المدارس، ويحوّل التعلّم المشترك إلى تجربة ممتعة.»";

export const STORAGE_KEY = "jesr-bridge-subject-pronouns-v1";

export type PronounId = "I" | "You" | "He" | "She" | "It" | "We" | "They";
export type ObjectKind = "book" | "ball" | "apple" | "bird" | "car" | "books" | "cats";
export type StationId =
  | "discover"
  | "iyou"
  | "heshe"
  | "it"
  | "wethey"
  | "games"
  | "contrast"
  | "final";

export type Visual =
  | { type: "img"; src: string; alt: string }
  | { type: "obj"; kind: ObjectKind; alt: string };

export interface PronounInfo {
  id: PronounId;
  ar: string;
  arDetail: string;
  be: "am" | "is" | "are";
  color: string;
  chip: string;
  usage: string;
  tip: string;
  examples: { en: string; ar: string }[];
  visual: Visual;
}

export interface Mcq {
  id: string;
  promptAr: string;
  sentence?: string;
  caption?: string;
  visual?: Visual;
  options: string[];
  answer: string;
  ok: string;
  bad: string;
}

export interface MatchItem {
  id: string;
  pronoun: PronounId;
  label: string;
  visual: Visual;
}

export interface TeachPage {
  id: string;
  badge: string;
  title: string;
  body: string;
  points: string[];
  examples: { en: string; ar: string }[];
  visual: Visual;
  accent: string;
}



export const PRONOUNS: PronounInfo[] = [
  {
    id: "I",
    ar: "أنا",
    arDetail: "أنا (المتكلمة عن نفسها)",
    be: "am",
    color: "from-rose-400 to-coral-400",
    chip: "bg-rose-400",
    usage: "نستخدم I عندما تتحدثين عن نفسكِ فقط.",
    tip: "دائمًا نكتب I حرفًا كبيرًا، حتى في وسط الجملة.",
    examples: [
      { en: "I am a girl.", ar: "أنا بنت." },
      { en: "I am a student.", ar: "أنا طالبة." },
      { en: "I am happy.", ar: "أنا سعيدة." },
    ],
    visual: { type: "img", src: IMAGES.i, alt: "فتاة تشير إلى نفسها" },
  },
  {
    id: "You",
    ar: "أنتَ / أنتِ / أنتم / أنتن",
    arDetail: "للمخاطب مفردًا أو جمعًا",
    be: "are",
    color: "from-amber-300 to-yellow-400",
    chip: "bg-amber-400",
    usage: "نستخدم You عندما نتحدث مع شخص واحد أو مع مجموعة. الكلمة واحدة!",
    tip: "You للمذكر والمؤنث سواء، وللمفرد والجمع سواء. نفهم المعنى من الصورة والجملة.",
    examples: [
      { en: "You are a student.", ar: "أنتِ طالبة. (شخص واحد)" },
      { en: "You are smart.", ar: "أنتِ ذكية." },
      { en: "You are students.", ar: "أنتم / أنتن طلاب. (مجموعة)" },
    ],
    visual: { type: "img", src: IMAGES.you, alt: "طالبة نحدثها" },
  },
  {
    id: "He",
    ar: "هو",
    arDetail: "للولد أو الرجل",
    be: "is",
    color: "from-sky-400 to-blue-500",
    chip: "bg-sky-400",
    usage: "نستخدم He عندما نتحدث عن ولد أو رجل.",
    tip: "He للناس المذكرين فقط، وليس للأشياء.",
    examples: [
      { en: "He is a boy.", ar: "هو ولد." },
      { en: "He is happy.", ar: "هو سعيد." },
      { en: "He is a student.", ar: "هو طالب." },
    ],
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
  },
  {
    id: "She",
    ar: "هي",
    arDetail: "للبنت أو المرأة",
    be: "is",
    color: "from-fuchsia-400 to-pink-400",
    chip: "bg-fuchsia-400",
    usage: "نستخدم She عندما نتحدث عن بنت أو امرأة.",
    tip: "She للناس المؤنثين فقط، وليس للأشياء.",
    examples: [
      { en: "She is a girl.", ar: "هي بنت." },
      { en: "She is kind.", ar: "هي لطيفة." },
      { en: "She is a student.", ar: "هي طالبة." },
    ],
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
  },
  {
    id: "It",
    ar: "للجماد والحيوان والشيء",
    arDetail: "شيء واحد أو حيوان واحد",
    be: "is",
    color: "from-teal-400 to-emerald-400",
    chip: "bg-teal-400",
    usage: "نستخدم It للحيوان أو الجماد أو الشيء الواحد.",
    tip: "حتى لو قلنا بالعربية «هو قط»، بالإنجليزية نقول It is a cat.",
    examples: [
      { en: "It is a cat.", ar: "إنها قطة." },
      { en: "It is a book.", ar: "إنه كتاب." },
      { en: "It is a ball.", ar: "إنها كرة." },
    ],
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
  },
  {
    id: "We",
    ar: "نحن",
    arDetail: "أنا ومعي غيري",
    be: "are",
    color: "from-lime-400 to-green-400",
    chip: "bg-green-400",
    usage: "نستخدم We عندما تتحدثين عن نفسكِ مع شخص آخر أو مجموعة.",
    tip: "We تشملكِ أنتِ. إذا لم تكوني ضمن المجموعة فاستخدمي They.",
    examples: [
      { en: "We are friends.", ar: "نحن أصدقاء." },
      { en: "We are students.", ar: "نحن طلاب." },
      { en: "We are happy.", ar: "نحن سعداء." },
    ],
    visual: { type: "img", src: IMAGES.we, alt: "أنا وصديقي" },
  },
  {
    id: "They",
    ar: "هم / هن",
    arDetail: "مجموعة لا تشملني",
    be: "are",
    color: "from-violet-500 to-purple-500",
    chip: "bg-violet-500",
    usage: "نستخدم They لمجموعة من الناس أو الأشياء، ونحن نتحدث عنهم لا معهم.",
    tip: "They لا تشمل المتكلمة. وإذا خاطبتِ المجموعة وجهًا لوجه فاستخدمي You.",
    examples: [
      { en: "They are students.", ar: "هم طلاب." },
      { en: "They are friends.", ar: "هم أصدقاء." },
      { en: "They are happy.", ar: "هم سعداء." },
    ],
    visual: { type: "img", src: IMAGES.they, alt: "مجموعة أطفال" },
  },
];

export const BE_TABLE = [
  { p: "I", v: "am", e: "I am happy." },
  { p: "You", v: "are", e: "You are kind." },
  { p: "He", v: "is", e: "He is a boy." },
  { p: "She", v: "is", e: "She is a girl." },
  { p: "It", v: "is", e: "It is a cat." },
  { p: "We", v: "are", e: "We are friends." },
  { p: "They", v: "are", e: "They are students." },
];

export const STATIONS: {
  id: StationId;
  num: number;
  title: string;
  subtitle: string;
  emoji: string;
  theme: string;
  sara: string;
}[] = [
  {
    id: "discover",
    num: 1,
    title: "اكتشفِ الضمائر",
    subtitle: "تعرّفي على الضمائر السبعة",
    emoji: "🔎",
    theme: "discover",
    sara: "هيا نفتح الصندوق السحري! كل ضمير بطاقة لامعة. اضغطي عليها لتعرفي سرّها.",
  },
  {
    id: "iyou",
    num: 2,
    title: "I و You",
    subtitle: "أنا وأنتِ… وأنتم أيضًا!",
    emoji: "🪞",
    theme: "iyou",
    sara: "I للحديث عن نفسكِ، و You لمن تحدثينه. تذكّري: You للمفرد والجمع كلمة واحدة.",
  },
  {
    id: "heshe",
    num: 3,
    title: "He و She",
    subtitle: "هو وهي",
    emoji: "👫",
    theme: "heshe",
    sara: "الولد He والبنت She. انظرِ إلى الصورة جيدًا قبل الاختيار.",
  },
  {
    id: "it",
    num: 4,
    title: "محطة It",
    subtitle: "الحيوان والجماد والشيء",
    emoji: "🐱",
    theme: "it",
    sara: "القطة والكتاب والكرة والسيارة: كلها It لأنها ليست شخصًا.",
  },
  {
    id: "wethey",
    num: 5,
    title: "We و They",
    subtitle: "نحن وهم",
    emoji: "🤝",
    theme: "wethey",
    sara: "إذا كنتِ داخل المجموعة قولي We. إذا كنتِ تتحدثين عن آخرين قولي They.",
  },
  {
    id: "games",
    num: 6,
    title: "ملعب الضمائر",
    subtitle: "مطابقة، إكمال، اختيار، سحب",
    emoji: "🎮",
    theme: "games",
    sara: "أربع ألعاب ممتعة. أكمليها كلها لتجمعي أكبر عدد من النجوم!",
  },
  {
    id: "contrast",
    num: 7,
    title: "حديقة التمييز",
    subtitle: "فروقات دقيقة بين الضمائر",
    emoji: "🧠",
    theme: "contrast",
    sara: "هنا نميّز He عن She، و We عن They، و I عن You، و It عن They.",
  },
  {
    id: "final",
    num: 8,
    title: "التحدي النهائي",
    subtitle: "نجمة النجوم ثم الشهادة",
    emoji: "🏆",
    theme: "final",
    sara: "أنتِ جاهزة يا بطلتي! ركّزي، اقرئي الجملة، وانظري إلى الصورة قبل الإجابة.",
  },
];

export const IYOU_PAGES: TeachPage[] = [
  {
    id: "i",
    badge: "I",
    title: "ضمير I = أنا",
    body: "عندما تتحدثين عن نفسكِ تبدأ الجملة بـ I. لا أحد غيركِ يقول I عنكِ.",
    points: [
      "I تعني أنا فقط.",
      "بعد I يأتي الفعل am.",
      "دائمًا نكتب I حرفًا كبيرًا.",
    ],
    examples: [
      { en: "I am a girl.", ar: "أنا بنت." },
      { en: "I am a student.", ar: "أنا طالبة." },
      { en: "I am happy.", ar: "أنا سعيدة." },
    ],
    visual: { type: "img", src: IMAGES.i, alt: "فتاة تشير إلى نفسها" },
    accent: "from-rose-400 to-orange-300",
  },
  {
    id: "you-s",
    badge: "You",
    title: "You للمفرد = أنتَ / أنتِ",
    body: "عندما تحدثين شخصًا واحدًا أمامكِ استخدمي You. الكلمة نفسها للولد والبنت.",
    points: [
      "You للمخاطب: من نكلمه.",
      "بعد You يأتي الفعل are.",
      "لا فرق بين أنتَ وأنتِ في الإنجليزية.",
    ],
    examples: [
      { en: "You are a student.", ar: "أنتِ طالبة." },
      { en: "You are smart.", ar: "أنتِ ذكية." },
      { en: "You are my friend.", ar: "أنتِ صديقتي." },
    ],
    visual: { type: "img", src: IMAGES.you, alt: "طالبة نحدثها" },
    accent: "from-amber-300 to-yellow-400",
  },
  {
    id: "you-p",
    badge: "You",
    title: "You للجمع = أنتم / أنتن",
    body: "العربية تفرّق بين أنتِ وأنتن، أما الإنجليزية فكلمة You واحدة. إذا حدثتِ مجموعة فهي You أيضًا.",
    points: [
      "You للجمع نفس You للمفرد.",
      "نفهم المفرد أو الجمع من الصورة وباقي الجملة.",
      "You are students. = أنتم طلاب.",
    ],
    examples: [
      { en: "You are students.", ar: "أنتم / أنتن طلاب." },
      { en: "You are friends.", ar: "أنتم أصدقاء." },
      { en: "You are kind.", ar: "أنتم لطيفون." },
    ],
    visual: { type: "img", src: IMAGES.yous, alt: "مجموعة نحدثها" },
    accent: "from-yellow-300 to-lime-300",
  },
];

export const HESHE_PAGES: TeachPage[] = [
  {
    id: "he",
    badge: "He",
    title: "ضمير He = هو",
    body: "نتحدث عن ولد أو رجل غيرنا. لا نستخدم He للأشياء أو الحيوانات في هذا الدرس.",
    points: ["He للناس المذكرين.", "بعد He يأتي is.", "He is a boy."],
    examples: [
      { en: "He is a boy.", ar: "هو ولد." },
      { en: "He is happy.", ar: "هو سعيد." },
      { en: "He is a student.", ar: "هو طالب." },
    ],
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    accent: "from-sky-400 to-indigo-400",
  },
  {
    id: "she",
    badge: "She",
    title: "ضمير She = هي",
    body: "نتحدث عن بنت أو امرأة. She لا تُستخدم للكتاب أو القطة.",
    points: ["She للناس المؤنثين.", "بعد She يأتي is.", "She is a girl."],
    examples: [
      { en: "She is a girl.", ar: "هي بنت." },
      { en: "She is kind.", ar: "هي لطيفة." },
      { en: "She is a student.", ar: "هي طالبة." },
    ],
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    accent: "from-fuchsia-400 to-rose-400",
  },
];

export const IT_PAGES: TeachPage[] = [
  {
    id: "it-animal",
    badge: "It",
    title: "It للحيوان",
    body: "القطة والطائر وأي حيوان واحد = It. لا نقول He is a cat في هذا المستوى.",
    points: [
      "حيوان واحد → It",
      "It is a cat.",
      "It is a bird.",
    ],
    examples: [
      { en: "It is a cat.", ar: "إنها قطة." },
      { en: "It is a bird.", ar: "إنه طائر." },
    ],
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
    accent: "from-teal-400 to-cyan-400",
  },
  {
    id: "it-thing",
    badge: "It",
    title: "It للجماد والأشياء",
    body: "الكتاب، الكرة، التفاحة، السيارة: كلها أشياء، فنقول It.",
    points: [
      "شيء واحد → It",
      "It is a book. / It is a ball.",
      "بعد It يأتي is.",
    ],
    examples: [
      { en: "It is a book.", ar: "إنه كتاب." },
      { en: "It is a ball.", ar: "إنها كرة." },
      { en: "It is an apple.", ar: "إنها تفاحة." },
    ],
    visual: { type: "obj", kind: "book", alt: "كتاب" },
    accent: "from-emerald-400 to-lime-400",
  },
];

export const WETHEY_PAGES: TeachPage[] = [
  {
    id: "we",
    badge: "We",
    title: "ضمير We = نحن",
    body: "We تعني أنكِ جزء من المجموعة: أنتِ وصديقتك، أو أنتِ والصف.",
    points: ["We = أنا + غيري.", "بعد We يأتي are.", "We are friends."],
    examples: [
      { en: "We are friends.", ar: "نحن أصدقاء." },
      { en: "We are students.", ar: "نحن طلاب." },
    ],
    visual: { type: "img", src: IMAGES.we, alt: "أنا وصديقي" },
    accent: "from-lime-400 to-green-400",
  },
  {
    id: "they",
    badge: "They",
    title: "ضمير They = هم / هن",
    body: "They لمجموعة نتحدث عنها. لسنا داخلها، ولسنا نكلمها مباشرة.",
    points: [
      "They لا تشملني.",
      "إذا كلّمنا المجموعة وجهًا لوجه نستخدم You.",
      "They are students.",
    ],
    examples: [
      { en: "They are students.", ar: "هم طلاب." },
      { en: "They are happy.", ar: "هم سعداء." },
    ],
    visual: { type: "img", src: IMAGES.they, alt: "مجموعة أطفال" },
    accent: "from-violet-500 to-purple-400",
  },
];

export const DISCOVER_Q: Mcq[] = [
  {
    id: "d1",
    promptAr: "أي ضمير نستخدمه عندما تتحدثين عن نفسكِ؟",
    visual: { type: "img", src: IMAGES.i, alt: "فتاة تشير لنفسها" },
    caption: "أتحدث عن نفسي",
    options: ["I", "You", "He", "They"],
    answer: "I",
    ok: "أحسنتِ! I تعني أنا، ونستخدمها للحديث عن أنفسنا. I am a girl.",
    bad: "فكّري: من يتحدث عن نفسه يقول I. You لمن نكلمه، و He للولد.",
  },
  {
    id: "d2",
    promptAr: "انظري إلى الولد. ما الضمير الصحيح؟",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    sentence: "___ is a boy.",
    options: ["She", "He", "It", "We"],
    answer: "He",
    ok: "رائع! الولد = He. الجملة: He is a boy.",
    bad: "هذه صورة ولد، لذلك الضمير He وليس She.",
  },
  {
    id: "d3",
    promptAr: "انظري إلى البنت. ما الضمير الصحيح؟",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    sentence: "___ is a girl.",
    options: ["He", "It", "She", "I"],
    answer: "She",
    ok: "ممتاز! البنت = She. الجملة: She is a girl.",
    bad: "هذه صورة بنت، لذلك الضمير She.",
  },
  {
    id: "d4",
    promptAr: "ما الضمير المناسب للقطة؟",
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
    sentence: "___ is a cat.",
    options: ["He", "She", "It", "They"],
    answer: "It",
    ok: "ذكيّة! الحيوان الواحد = It. It is a cat. لا نستخدم He أو She هنا.",
    bad: "القطة حيوان وليست شخصًا، لذلك نقول It is a cat.",
  },
  {
    id: "d5",
    promptAr: "هؤلاء الأطفال مجموعة لا تشملنا. ما الضمير؟",
    visual: { type: "img", src: IMAGES.they, alt: "مجموعة أطفال" },
    caption: "نتحدث عنهم",
    sentence: "___ are students.",
    options: ["We", "You", "They", "I"],
    answer: "They",
    ok: "أحسنتِ! نتحدث عن مجموعة أخرى فنقول They are students.",
    bad: "We تشملنا نحن. هنا نتحدث عن آخرين، فالجواب They.",
  },
];

export const IYOU_Q: Mcq[] = [
  {
    id: "iy1",
    promptAr: "الفتاة تشير إلى نفسها. أكملي الجملة:",
    visual: { type: "img", src: IMAGES.i, alt: "فتاة تشير لنفسها" },
    caption: "أتحدث عن نفسي",
    sentence: "___ am a girl.",
    options: ["You", "I", "She", "We"],
    answer: "I",
    ok: "ممتاز! I am a girl. بعد I يأتي am.",
    bad: "هي تتحدث عن نفسها، والجواب I am a girl.",
  },
  {
    id: "iy2",
    promptAr: "نكلّم طالبة واحدة أمامنا. أكملي:",
    visual: { type: "img", src: IMAGES.you, alt: "طالبة نحدثها" },
    caption: "أحدثّكِ أنتِ",
    sentence: "___ are a student.",
    options: ["I", "She", "You", "They"],
    answer: "You",
    ok: "رائع! You are a student. لأننا نحدثها هي.",
    bad: "نحن نكلمها لا نتحدث عنها، لذلك You وليس She.",
  },
  {
    id: "iy3",
    promptAr: "نكلّم مجموعة طلاب. أكملي:",
    visual: { type: "img", src: IMAGES.yous, alt: "مجموعة نحدثها" },
    caption: "أحدثّكم أنتم",
    sentence: "___ are students.",
    options: ["They", "We", "He", "You"],
    answer: "You",
    ok: "أحسنتِ! عندما نكلم المجموعة نقول You are students.",
    bad: "They للحديث عنهم. هنا نكلمهم مباشرة، فالجواب You.",
  },
  {
    id: "iy4",
    promptAr: "You في هذه الصورة تعني:",
    visual: { type: "img", src: IMAGES.you, alt: "شخص واحد" },
    caption: "شخص واحد",
    options: ["أنتِ (مفرد)", "أنتم / أنتن (جمع)", "أنا", "هي"],
    answer: "أنتِ (مفرد)",
    ok: "صحيح! صورة شخص واحد، فـ You هنا تعني أنتِ.",
    bad: "انظري: طالبة واحدة فقط، إذن You للمفرد = أنتِ.",
  },
  {
    id: "iy5",
    promptAr: "You في هذه الصورة تعني:",
    visual: { type: "img", src: IMAGES.yous, alt: "مجموعة" },
    caption: "مجموعة نحدثها",
    options: ["أنتِ (مفرد)", "أنتم / أنتن (جمع)", "هم", "نحن"],
    answer: "أنتم / أنتن (جمع)",
    ok: "رائع! مجموعة نكلمها، فـ You هنا للجمع = أنتم / أنتن.",
    bad: "الصورة لمجموعة نحدثها، لذلك You للجمع.",
  },
  {
    id: "iy6",
    promptAr: "هل كلمة You تختلف بين المفرد والجمع؟",
    options: ["لا، هي كلمة واحدة", "نعم، كلمتان مختلفتان", "فقط للمؤنث", "فقط للجمع"],
    answer: "لا، هي كلمة واحدة",
    ok: "ممتاز! You كلمة واحدة للمفرد والجمع، وللمذكر والمؤنث.",
    bad: "في الإنجليزية You لا تتغيّر. المفرد والجمع نفس الكلمة.",
  },
];

export const HESHE_Q: Mcq[] = [
  {
    id: "hs1",
    promptAr: "أكملي الجملة عن الولد:",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    sentence: "___ is a boy.",
    options: ["She", "He", "It", "I"],
    answer: "He",
    ok: "أحسنتِ! He is a boy.",
    bad: "الولد = He. She للبنت.",
  },
  {
    id: "hs2",
    promptAr: "أكملي الجملة عن البنت:",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    sentence: "___ is a girl.",
    options: ["He", "They", "She", "You"],
    answer: "She",
    ok: "رائع! She is a girl.",
    bad: "البنت = She.",
  },
  {
    id: "hs3",
    promptAr: "الولد سعيد. اختاري الضمير:",
    visual: { type: "img", src: IMAGES.he, alt: "ولد سعيد" },
    sentence: "___ is happy.",
    options: ["She", "We", "It", "He"],
    answer: "He",
    ok: "ممتاز! He is happy.",
    bad: "نتحدث عن ولد، فالجواب He is happy.",
  },
  {
    id: "hs4",
    promptAr: "البنت لطيفة. اختاري الضمير:",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    sentence: "___ is kind.",
    options: ["He", "She", "It", "They"],
    answer: "She",
    ok: "ذكيّة! She is kind.",
    bad: "نتحدث عن بنت، فالجواب She is kind.",
  },
  {
    id: "hs5",
    promptAr: "انظري إلى الصورة واختاري:",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    caption: "ولد / boy",
    options: ["He", "She"],
    answer: "He",
    ok: "صحيح، الولد He.",
    bad: "هذه صورة ولد، الجواب He.",
  },
  {
    id: "hs6",
    promptAr: "انظري إلى الصورة واختاري:",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    caption: "بنت / girl",
    options: ["He", "She"],
    answer: "She",
    ok: "صحيح، البنت She.",
    bad: "هذه صورة بنت، الجواب She.",
  },
];

export const IT_Q: Mcq[] = [
  {
    id: "it1",
    promptAr: "أكملي الجملة:",
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
    sentence: "___ is a cat.",
    options: ["He", "She", "It", "They"],
    answer: "It",
    ok: "أحسنتِ! It is a cat. الحيوان الواحد = It.",
    bad: "لا نقول He is a cat هنا. الجواب: It is a cat.",
  },
  {
    id: "it2",
    promptAr: "أكملي الجملة:",
    visual: { type: "obj", kind: "book", alt: "كتاب" },
    sentence: "___ is a book.",
    options: ["He", "It", "They", "We"],
    answer: "It",
    ok: "رائع! It is a book. الكتاب جماد.",
    bad: "الكتاب شيء واحد، فنقول It is a book.",
  },
  {
    id: "it3",
    promptAr: "أكملي الجملة:",
    visual: { type: "obj", kind: "ball", alt: "كرة" },
    sentence: "___ is a ball.",
    options: ["She", "You", "It", "They"],
    answer: "It",
    ok: "ممتاز! It is a ball.",
    bad: "الكرة شيء، الجواب It is a ball.",
  },
  {
    id: "it4",
    promptAr: "أكملي الجملة:",
    visual: { type: "obj", kind: "apple", alt: "تفاحة" },
    sentence: "___ is an apple.",
    options: ["It", "He", "I", "We"],
    answer: "It",
    ok: "ذكيّة! It is an apple. لاحظِ an قبل apple.",
    bad: "التفاحة شيء واحد: It is an apple.",
  },
  {
    id: "it5",
    promptAr: "أكملي الجملة:",
    visual: { type: "obj", kind: "bird", alt: "طائر" },
    sentence: "___ is a bird.",
    options: ["He", "She", "They", "It"],
    answer: "It",
    ok: "صحيح! It is a bird.",
    bad: "طائر واحد = It is a bird.",
  },
  {
    id: "it6",
    promptAr: "أكملي الجملة:",
    visual: { type: "obj", kind: "car", alt: "سيارة" },
    sentence: "___ is a car.",
    options: ["They", "It", "She", "We"],
    answer: "It",
    ok: "أحسنتِ! It is a car.",
    bad: "سيارة واحدة = It is a car.",
  },
];

export const WETHEY_Q: Mcq[] = [
  {
    id: "wt1",
    promptAr: "أنا وصديقي معًا. أكملي:",
    visual: { type: "img", src: IMAGES.we, alt: "أنا وصديقي" },
    caption: "أنا وصديقي = نحن",
    sentence: "___ are friends.",
    options: ["They", "We", "He", "It"],
    answer: "We",
    ok: "رائع! We are friends. لأنكِ جزء من الصورة.",
    bad: "أنتِ داخل المجموعة، فالجواب We are friends.",
  },
  {
    id: "wt2",
    promptAr: "أطفال هناك، ولسنا معهم. أكملي:",
    visual: { type: "img", src: IMAGES.they, alt: "مجموعة أطفال" },
    caption: "نتحدث عنهم",
    sentence: "___ are students.",
    options: ["We", "I", "They", "She"],
    answer: "They",
    ok: "أحسنتِ! They are students.",
    bad: "نحن لسنا داخل المجموعة، الجواب They.",
  },
  {
    id: "wt3",
    promptAr: "نكلّم الصف أمامنا. ما الضمير؟",
    visual: { type: "img", src: IMAGES.yous, alt: "طلاب نحدثهم" },
    caption: "أحدثّكم",
    sentence: "___ are kind.",
    options: ["They", "We", "You", "He"],
    answer: "You",
    ok: "ممتاز! نكلمهم مباشرة: You are kind.",
    bad: "الفرق: They للحديث عنهم، You للكلام معهم. الجواب You.",
  },
  {
    id: "wt4",
    promptAr: "اختاري الوصف الصحيح للصورة:",
    visual: { type: "img", src: IMAGES.we, alt: "صديقان" },
    caption: "أنا داخل المجموعة",
    options: ["They are friends.", "We are friends.", "He is a friend.", "It is a friend."],
    answer: "We are friends.",
    ok: "صحيح! We are friends.",
    bad: "لأنكِ ضمن الاثنين، نقول We are friends.",
  },
  {
    id: "wt5",
    promptAr: "اختاري الجملة الصحيحة:",
    visual: { type: "img", src: IMAGES.they, alt: "مجموعة" },
    caption: "مجموعة أخرى",
    options: ["We are students.", "I am students.", "They are students.", "She is students."],
    answer: "They are students.",
    ok: "رائع! They are students.",
    bad: "مجموعة لا تشملنا → They are students.",
  },
];

export const COMPLETE_Q: Mcq[] = [
  {
    id: "c1",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "img", src: IMAGES.i, alt: "فتاة" },
    caption: "عن نفسي",
    sentence: "___ am a student.",
    options: ["You", "I", "She", "We"],
    answer: "I",
    ok: "I am a student. بعد I نستخدم am.",
    bad: "الحديث عن النفس = I am a student.",
  },
  {
    id: "c2",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "img", src: IMAGES.you, alt: "طالبة" },
    caption: "أحدثّكِ",
    sentence: "___ are smart.",
    options: ["I", "He", "You", "It"],
    answer: "You",
    ok: "You are smart.",
    bad: "نكلم شخصًا واحدًا: You are smart.",
  },
  {
    id: "c3",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    sentence: "___ is a boy.",
    options: ["She", "He", "They", "We"],
    answer: "He",
    ok: "He is a boy.",
    bad: "ولد → He is a boy.",
  },
  {
    id: "c4",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    sentence: "___ is a girl.",
    options: ["He", "It", "She", "I"],
    answer: "She",
    ok: "She is a girl.",
    bad: "بنت → She is a girl.",
  },
  {
    id: "c5",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
    sentence: "___ is a cat.",
    options: ["He", "She", "It", "They"],
    answer: "It",
    ok: "It is a cat.",
    bad: "حيوان واحد → It is a cat.",
  },
  {
    id: "c6",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "obj", kind: "ball", alt: "كرة" },
    sentence: "___ is a ball.",
    options: ["It", "They", "He", "We"],
    answer: "It",
    ok: "It is a ball.",
    bad: "كرة واحدة → It is a ball.",
  },
  {
    id: "c7",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "img", src: IMAGES.we, alt: "نحن" },
    caption: "أنا وصديقي",
    sentence: "___ are happy.",
    options: ["They", "We", "You", "She"],
    answer: "We",
    ok: "We are happy.",
    bad: "نحن معًا → We are happy.",
  },
  {
    id: "c8",
    promptAr: "أكملي بالضمير المناسب:",
    visual: { type: "img", src: IMAGES.they, alt: "هم" },
    caption: "مجموعة أخرى",
    sentence: "___ are friends.",
    options: ["We", "I", "They", "It"],
    answer: "They",
    ok: "They are friends.",
    bad: "مجموعة لا تشملنا → They are friends.",
  },
];

export const PICTURE_Q: Mcq[] = [
  {
    id: "p1",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.i, alt: "فتاة تشير لنفسها" },
    caption: "أتحدث عن نفسي",
    options: ["I", "You", "He", "They"],
    answer: "I",
    ok: "I لأن الفتاة تتحدث عن نفسها.",
    bad: "الإشارة إلى النفس = I.",
  },
  {
    id: "p2",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.you, alt: "نحدثها" },
    caption: "أحدثّكِ",
    options: ["I", "You", "She", "It"],
    answer: "You",
    ok: "You لأننا نكلمها.",
    bad: "نكلم شخصًا واحدًا = You.",
  },
  {
    id: "p3",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    options: ["She", "He", "It", "We"],
    answer: "He",
    ok: "He للولد.",
    bad: "ولد = He.",
  },
  {
    id: "p4",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    options: ["He", "She", "They", "It"],
    answer: "She",
    ok: "She للبنت.",
    bad: "بنت = She.",
  },
  {
    id: "p5",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
    options: ["He", "She", "It", "I"],
    answer: "It",
    ok: "It للقطة.",
    bad: "حيوان = It.",
  },
  {
    id: "p6",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "obj", kind: "book", alt: "كتاب" },
    options: ["It", "They", "He", "We"],
    answer: "It",
    ok: "It للكتاب.",
    bad: "كتاب واحد = It.",
  },
  {
    id: "p7",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.we, alt: "نحن" },
    caption: "أنا وصديقي",
    options: ["They", "We", "You", "He"],
    answer: "We",
    ok: "We لأننا داخل المجموعة.",
    bad: "أنا ومعي غيري = We.",
  },
  {
    id: "p8",
    promptAr: "ما الضمير المناسب لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.they, alt: "هم" },
    caption: "مجموعة أخرى",
    options: ["We", "You", "They", "She"],
    answer: "They",
    ok: "They للمجموعة التي نتحدث عنها.",
    bad: "مجموعة لا تشملنا = They.",
  },
];

export const MATCH_ITEMS: MatchItem[] = [
  { id: "m-i", pronoun: "I", label: "أتحدث عن نفسي", visual: { type: "img", src: IMAGES.i, alt: "أنا" } },
  { id: "m-you", pronoun: "You", label: "أحدثّكِ أنتِ", visual: { type: "img", src: IMAGES.you, alt: "أنتِ" } },
  { id: "m-he", pronoun: "He", label: "ولد", visual: { type: "img", src: IMAGES.he, alt: "هو" } },
  { id: "m-she", pronoun: "She", label: "بنت", visual: { type: "img", src: IMAGES.she, alt: "هي" } },
  { id: "m-it", pronoun: "It", label: "قطة", visual: { type: "img", src: IMAGES.cat, alt: "It" } },
  { id: "m-we", pronoun: "We", label: "أنا وصديقي", visual: { type: "img", src: IMAGES.we, alt: "نحن" } },
  { id: "m-they", pronoun: "They", label: "مجموعة أخرى", visual: { type: "img", src: IMAGES.they, alt: "هم" } },
];

export const DRAG_ITEMS: MatchItem[] = [
  { id: "d-i", pronoun: "I", label: "فتاة عن نفسها", visual: { type: "img", src: IMAGES.i, alt: "I" } },
  { id: "d-he", pronoun: "He", label: "ولد", visual: { type: "img", src: IMAGES.he, alt: "He" } },
  { id: "d-she", pronoun: "She", label: "بنت", visual: { type: "img", src: IMAGES.she, alt: "She" } },
  { id: "d-it", pronoun: "It", label: "كتاب", visual: { type: "obj", kind: "book", alt: "It" } },
  { id: "d-we", pronoun: "We", label: "نحن", visual: { type: "img", src: IMAGES.we, alt: "We" } },
  { id: "d-they", pronoun: "They", label: "هم", visual: { type: "img", src: IMAGES.they, alt: "They" } },
  { id: "d-you", pronoun: "You", label: "أحدثّكِ", visual: { type: "img", src: IMAGES.you, alt: "You" } },
];

export const HESHE_ONLY: Mcq[] = [
  {
    id: "hsx1",
    promptAr: "ولد أم بنت؟ اختاري الضمير:",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    options: ["He", "She"],
    answer: "He",
    ok: "He is a boy.",
    bad: "الولد = He.",
  },
  {
    id: "hsx2",
    promptAr: "ولد أم بنت؟ اختاري الضمير:",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    options: ["He", "She"],
    answer: "She",
    ok: "She is a girl.",
    bad: "البنت = She.",
  },
  {
    id: "hsx3",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    sentence: "___ is a student.",
    options: ["He", "She"],
    answer: "He",
    ok: "He is a student.",
    bad: "صورة ولد → He.",
  },
  {
    id: "hsx4",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    sentence: "___ is a student.",
    options: ["He", "She"],
    answer: "She",
    ok: "She is a student.",
    bad: "صورة بنت → She.",
  },
  {
    id: "hsx5",
    promptAr: "من يقول عنه He؟",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    options: ["ولد / boy", "بنت / girl"],
    answer: "ولد / boy",
    ok: "He للولد.",
    bad: "He للولد فقط.",
  },
  {
    id: "hsx6",
    promptAr: "من نقول عنها She؟",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    options: ["ولد / boy", "بنت / girl"],
    answer: "بنت / girl",
    ok: "She للبنت.",
    bad: "She للبنت فقط.",
  },
];

export const WETHEY_ONLY: Mcq[] = [
  {
    id: "wtx1",
    promptAr: "أنا داخل المجموعة. ما الضمير؟",
    visual: { type: "img", src: IMAGES.we, alt: "نحن" },
    caption: "أنا وصديقي",
    options: ["We", "They"],
    answer: "We",
    ok: "We are friends.",
    bad: "إذا كنتِ داخلها فالجواب We.",
  },
  {
    id: "wtx2",
    promptAr: "مجموعة أخرى لا تشملنا. ما الضمير؟",
    visual: { type: "img", src: IMAGES.they, alt: "هم" },
    caption: "نتحدث عنهم",
    options: ["We", "They"],
    answer: "They",
    ok: "They are students.",
    bad: "لسنا معهم → They.",
  },
  {
    id: "wtx3",
    promptAr: "اختاري الجملة الصحيحة:",
    visual: { type: "img", src: IMAGES.we, alt: "نحن" },
    caption: "نحن معًا",
    options: ["We are happy.", "They are happy."],
    answer: "We are happy.",
    ok: "We are happy.",
    bad: "نحن في الصورة → We are happy.",
  },
  {
    id: "wtx4",
    promptAr: "اختاري الجملة الصحيحة:",
    visual: { type: "img", src: IMAGES.they, alt: "هم" },
    caption: "هم هناك",
    options: ["We are students.", "They are students."],
    answer: "They are students.",
    ok: "They are students.",
    bad: "نتحدث عنهم → They.",
  },
  {
    id: "wtx5",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.we, alt: "نحن" },
    sentence: "___ are friends.",
    options: ["We", "They"],
    answer: "We",
    ok: "We are friends.",
    bad: "We لأنكِ جزء من الصداقة.",
  },
  {
    id: "wtx6",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.they, alt: "هم" },
    sentence: "___ are friends.",
    options: ["We", "They"],
    answer: "They",
    ok: "They are friends.",
    bad: "They لأننا نتحدث عن غيرنا.",
  },
];

export const IYOU_ONLY: Mcq[] = [
  {
    id: "iyx1",
    promptAr: "تشير إلى نفسها. ما الضمير؟",
    visual: { type: "img", src: IMAGES.i, alt: "أنا" },
    caption: "عن نفسي",
    options: ["I", "You"],
    answer: "I",
    ok: "I am a girl.",
    bad: "الحديث عن النفس = I.",
  },
  {
    id: "iyx2",
    promptAr: "نكلمها هي. ما الضمير؟",
    visual: { type: "img", src: IMAGES.you, alt: "أنتِ" },
    caption: "أحدثّكِ",
    options: ["I", "You"],
    answer: "You",
    ok: "You are a student.",
    bad: "الكلام مع الشخص = You.",
  },
  {
    id: "iyx3",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.i, alt: "أنا" },
    sentence: "___ am happy.",
    options: ["I", "You"],
    answer: "I",
    ok: "I am happy. (am مع I فقط)",
    bad: "am تأتي مع I: I am happy.",
  },
  {
    id: "iyx4",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.you, alt: "أنتِ" },
    sentence: "___ are kind.",
    options: ["I", "You"],
    answer: "You",
    ok: "You are kind.",
    bad: "You are kind. لأننا نحدثها.",
  },
  {
    id: "iyx5",
    promptAr: "You هنا تعني:",
    visual: { type: "img", src: IMAGES.yous, alt: "مجموعة" },
    caption: "نكلم مجموعة",
    options: ["أنتِ (مفرد)", "أنتم / أنتن (جمع)"],
    answer: "أنتم / أنتن (جمع)",
    ok: "You للجمع أيضًا، والكلمة نفسها.",
    bad: "الصورة مجموعة نحدثها = You للجمع.",
  },
  {
    id: "iyx6",
    promptAr: "You هنا تعني:",
    visual: { type: "img", src: IMAGES.you, alt: "مفرد" },
    caption: "شخص واحد",
    options: ["أنتِ (مفرد)", "أنتم / أنتن (جمع)"],
    answer: "أنتِ (مفرد)",
    ok: "شخص واحد = You للمفرد.",
    bad: "طالبة واحدة = أنتِ.",
  },
];

export const ITTHEY_ONLY: Mcq[] = [
  {
    id: "itx1",
    promptAr: "قطة واحدة. ما الضمير؟",
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
    options: ["It", "They"],
    answer: "It",
    ok: "It is a cat.",
    bad: "واحد → It.",
  },
  {
    id: "itx2",
    promptAr: "مجموعة أطفال. ما الضمير؟",
    visual: { type: "img", src: IMAGES.they, alt: "أطفال" },
    options: ["It", "They"],
    answer: "They",
    ok: "They are students.",
    bad: "مجموعة ناس → They.",
  },
  {
    id: "itx3",
    promptAr: "كتاب واحد. أكملي:",
    visual: { type: "obj", kind: "book", alt: "كتاب" },
    sentence: "___ is a book.",
    options: ["It", "They"],
    answer: "It",
    ok: "It is a book.",
    bad: "شيء واحد → It.",
  },
  {
    id: "itx4",
    promptAr: "ثلاثة كتب. أكملي:",
    visual: { type: "obj", kind: "books", alt: "كتب" },
    sentence: "___ are books.",
    options: ["It", "They"],
    answer: "They",
    ok: "They are books. الجمع = They.",
    bad: "أكثر من كتاب → They are books.",
  },
  {
    id: "itx5",
    promptAr: "قطتان. أكملي:",
    visual: { type: "obj", kind: "cats", alt: "قطتان" },
    sentence: "___ are cats.",
    options: ["It", "They"],
    answer: "They",
    ok: "They are cats.",
    bad: "أكثر من حيوان → They are cats.",
  },
  {
    id: "itx6",
    promptAr: "سيارة واحدة. أكملي:",
    visual: { type: "obj", kind: "car", alt: "سيارة" },
    sentence: "___ is a car.",
    options: ["It", "They"],
    answer: "It",
    ok: "It is a car.",
    bad: "سيارة واحدة → It is a car.",
  },
];

export const FINAL_Q: Mcq[] = [
  {
    id: "f1",
    promptAr: "أكملي بحذر:",
    visual: { type: "img", src: IMAGES.i, alt: "أنا" },
    caption: "عن نفسي",
    sentence: "___ am a girl.",
    options: ["You", "I", "She", "We"],
    answer: "I",
    ok: "I am a girl.",
    bad: "I am a girl. لأن الحديث عن النفس.",
  },
  {
    id: "f2",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    sentence: "___ is a boy.",
    options: ["She", "It", "He", "They"],
    answer: "He",
    ok: "He is a boy.",
    bad: "ولد → He.",
  },
  {
    id: "f3",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.she, alt: "بنت" },
    sentence: "___ is kind.",
    options: ["He", "She", "It", "You"],
    answer: "She",
    ok: "She is kind.",
    bad: "بنت → She.",
  },
  {
    id: "f4",
    promptAr: "أكملي:",
    visual: { type: "img", src: IMAGES.cat, alt: "قطة" },
    sentence: "___ is a cat.",
    options: ["He", "She", "It", "They"],
    answer: "It",
    ok: "It is a cat.",
    bad: "حيوان واحد → It.",
  },
  {
    id: "f5",
    promptAr: "نكلم طالبة واحدة:",
    visual: { type: "img", src: IMAGES.you, alt: "أنتِ" },
    caption: "أحدثّكِ",
    sentence: "___ are a student.",
    options: ["I", "She", "You", "They"],
    answer: "You",
    ok: "You are a student.",
    bad: "نكلمها → You لا She.",
  },
  {
    id: "f6",
    promptAr: "أنا وصديقي:",
    visual: { type: "img", src: IMAGES.we, alt: "نحن" },
    caption: "نحن معًا",
    sentence: "___ are friends.",
    options: ["They", "We", "He", "It"],
    answer: "We",
    ok: "We are friends.",
    bad: "نحن داخل الصورة → We.",
  },
  {
    id: "f7",
    promptAr: "مجموعة أخرى:",
    visual: { type: "img", src: IMAGES.they, alt: "هم" },
    caption: "نتحدث عنهم",
    sentence: "___ are students.",
    options: ["We", "You", "They", "I"],
    answer: "They",
    ok: "They are students.",
    bad: "عنهم لا معهم ولا معنا → They.",
  },
  {
    id: "f8",
    promptAr: "نكلم مجموعة أمامنا:",
    visual: { type: "img", src: IMAGES.yous, alt: "أنتم" },
    caption: "أحدثّكم",
    sentence: "___ are smart.",
    options: ["They", "We", "You", "He"],
    answer: "You",
    ok: "You are smart. حتى للجمع!",
    bad: "نكلمهم وجهًا لوجه → You.",
  },
  {
    id: "f9",
    promptAr: "أكملي:",
    visual: { type: "obj", kind: "apple", alt: "تفاحة" },
    sentence: "___ is an apple.",
    options: ["It", "They", "She", "He"],
    answer: "It",
    ok: "It is an apple.",
    bad: "شيء واحد → It is an apple.",
  },
  {
    id: "f10",
    promptAr: "كتب كثيرة:",
    visual: { type: "obj", kind: "books", alt: "كتب" },
    sentence: "___ are books.",
    options: ["It", "They", "We", "She"],
    answer: "They",
    ok: "They are books.",
    bad: "جمع الأشياء → They.",
  },
  {
    id: "f11",
    promptAr: "You في صورة المجموعة تعني:",
    visual: { type: "img", src: IMAGES.yous, alt: "مجموعة" },
    options: ["أنتِ (مفرد)", "أنتم / أنتن (جمع)", "هم", "نحن"],
    answer: "أنتم / أنتن (جمع)",
    ok: "You كلمة واحدة، وهنا للجمع.",
    bad: "مجموعة نحدثها = You للجمع.",
  },
  {
    id: "f12",
    promptAr: "أي جملة صحيحة لهذه الصورة؟",
    visual: { type: "img", src: IMAGES.he, alt: "ولد" },
    options: ["She is a boy.", "He is a boy.", "It is a boy.", "They is a boy."],
    answer: "He is a boy.",
    ok: "الجملة الصحيحة: He is a boy.",
    bad: "الولد He، والفعل is: He is a boy.",
  },
];

export function shuffle<T>(list: T[]): T[] {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const POINTS_PER_CORRECT = 10;
