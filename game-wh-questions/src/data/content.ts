export type WhKey = 'what' | 'where' | 'when' | 'who' | 'why' | 'how';

export type SceneName =
  | 'star'
  | 'rocket'
  | 'school'
  | 'home'
  | 'morning'
  | 'night'
  | 'teacher'
  | 'doctor'
  | 'happy'
  | 'rain'
  | 'bike'
  | 'car'
  | 'gift'
  | 'bus';

export type ActivityKind = 'cards' | 'dragStar' | 'planets' | 'dragRocket' | 'comets' | 'blank';

export interface Choice {
  id: string;
  en: string;
  icon: string;
  correct?: boolean;
}

/*
  Text mini-syntax used by <RichText/>:
  {English}  -> LTR English word inside Arabic text
  **text**   -> highlighted with the planet colour
*/
export interface Station {
  key: WhKey;
  word: string;
  upper: string;
  ar: string;
  arShort: string;
  category: string;
  icon: string;
  dot: string;
  color: string;
  deep: string;
  usageIcon: string;
  usage: string;
  example: { scene: SceneName; q: string; a: string; note: string };
  activity: {
    kind: ActivityKind;
    scene: SceneName;
    q: string;
    instruction: string;
    choices: Choice[];
    recap: string;
  };
  hint: string;
  wrongHint: string;
  success: { title: string; sub: string };
  secret: string[];
}

export const STATIONS: Station[] = [
  {
    key: 'what',
    word: 'What',
    upper: 'WHAT',
    ar: 'ماذا؟',
    arShort: 'ماذا؟',
    category: 'شيء',
    icon: '🎁',
    dot: '🟡',
    color: '#fcd34d',
    deep: '#b45309',
    usageIcon: '🎁',
    usage: 'نستخدم {What} للسؤال عن **الشيء**.',
    example: { scene: 'star', q: '**What** is this?', a: 'It is **a star**.', note: '⭐ {a star} = شيء' },
    activity: {
      kind: 'cards',
      scene: 'rocket',
      q: '**What** is this?',
      instruction: '🛰️ اختاري الصورة المطابقة',
      choices: [
        { id: 'rocket', en: 'A rocket.', icon: '🚀', correct: true },
        { id: 'moon', en: 'A moon.', icon: '🌙' },
        { id: 'star', en: 'A star.', icon: '⭐' },
      ],
      recap: '**What** is this? It is **a rocket**. 🚀',
    },
    hint: 'ما هذا الشيء؟ 👀',
    wrongHint: 'انظري إلى الصورة جيدًا: ما هذا الشيء؟ 👀',
    success: { title: '✨ رائع!', sub: 'للسؤال عن الشيء 🎁' },
    secret: ['💫 {What} ← شيء 🎁', 'مثل: قلم ✏️ – كتاب 📘 – تفاحة 🍎'],
  },
  {
    key: 'where',
    word: 'Where',
    upper: 'WHERE',
    ar: 'أين؟',
    arShort: 'أين',
    category: 'مكان',
    icon: '📍',
    dot: '🌙',
    color: '#5eead4',
    deep: '#0f766e',
    usageIcon: '📍',
    usage: 'نستخدم {Where} للسؤال عن **المكان**.',
    example: { scene: 'school', q: '**Where** is Sara?', a: 'She is **at school**.', note: '📍 {at school} = مكان' },
    activity: {
      kind: 'dragStar',
      scene: 'home',
      q: '**Where** is he?',
      instruction: '⭐ اسحبي النجمة إلى الإجابة الصحيحة',
      choices: [
        { id: 'home', en: 'At home.', icon: '🏠', correct: true },
        { id: 'school', en: 'At school.', icon: '🏫' },
        { id: 'park', en: 'At the park.', icon: '🌳' },
      ],
      recap: '**Where** is he? He is **at home**. 🏠',
    },
    hint: 'ابحثي عن مكان 📍',
    wrongHint: 'فكري: هل السؤال عن شخص أم مكان؟ 📍',
    success: { title: '✨ ممتاز!', sub: 'للسؤال عن المكان 📍' },
    secret: ['💫 {Where} ← مكان 📍', '🔭 هل تعلمين؟ القمر يدور حول الأرض 🌙🌍'],
  },
  {
    key: 'when',
    word: 'When',
    upper: 'WHEN',
    ar: 'متى؟',
    arShort: 'متى',
    category: 'وقت',
    icon: '⏰',
    dot: '🟠',
    color: '#fdba74',
    deep: '#c2410c',
    usageIcon: '⏰',
    usage: 'نستخدم {When} للسؤال عن **الوقت**.',
    example: {
      scene: 'morning',
      q: '**When** do you go to school?',
      a: '**In the morning**.',
      note: '⏰ {in the morning} = وقت',
    },
    activity: {
      kind: 'planets',
      scene: 'night',
      q: '**When** do you sleep?',
      instruction: '🪐 اضغطي على الكوكب الصحيح',
      choices: [
        { id: 'night', en: 'At night.', icon: '🌙', correct: true },
        { id: 'school', en: 'At school.', icon: '🏫' },
        { id: 'sara', en: 'With Sara.', icon: '👧' },
      ],
      recap: '**When** do you sleep? **At night**. 🌙',
    },
    hint: 'فكري في الوقت ⏰',
    wrongHint: 'فكري: متى ننام؟ ابحثي عن وقت ⏰',
    success: { title: '🌟 أحسنتِ!', sub: 'للسؤال عن الوقت ⏰' },
    secret: ['💫 {When} ← وقت ⏰', 'الصباح 🌅 – المساء 🌇 – الساعة ⏰ … كلها أوقات!'],
  },
  {
    key: 'who',
    word: 'Who',
    upper: 'WHO',
    ar: 'مَن؟',
    arShort: 'مَن',
    category: 'شخص',
    icon: '👩',
    dot: '🔴',
    color: '#fca5a5',
    deep: '#b91c1c',
    usageIcon: '👩',
    usage: 'نستخدم {Who} للسؤال عن **الشخص**.',
    example: { scene: 'teacher', q: '**Who** is she?', a: 'She is **my teacher**.', note: '👩‍🏫 {my teacher} = شخص' },
    activity: {
      kind: 'dragRocket',
      scene: 'doctor',
      q: '**Who** is he?',
      instruction: '🚀 اسحبي الصاروخ إلى الإجابة الصحيحة',
      choices: [
        { id: 'doctor', en: 'He is a doctor.', icon: '👨‍⚕️', correct: true },
        { id: 'school', en: 'At school.', icon: '🏫' },
        { id: 'morning', en: 'In the morning.', icon: '🌅' },
      ],
      recap: '**Who** is he? He is **a doctor**. 👨‍⚕️',
    },
    hint: 'ابحثي عن شخص 👩',
    wrongHint: 'فكري: هل السؤال عن شخص أم مكان؟ 👩',
    success: { title: '💫 رائع جدًا!', sub: 'للسؤال عن الشخص 👩' },
    secret: ['💫 {Who} ← شخص 👩', 'مثل: {my mother} 👩 – {my friend} 👭'],
  },
  {
    key: 'why',
    word: 'Why',
    upper: 'WHY',
    ar: 'لماذا؟',
    arShort: 'لماذا',
    category: 'سبب',
    icon: '💡',
    dot: '🟣',
    color: '#d8b4fe',
    deep: '#7e22ce',
    usageIcon: '💡',
    usage: 'نستخدم {Why} للسؤال عن **السبب**.',
    example: { scene: 'happy', q: '**Why** are you happy?', a: '**Because** I won. 🎉', note: '💡 {Why → Because}' },
    activity: {
      kind: 'comets',
      scene: 'rain',
      q: '**Why** does she have an umbrella?',
      instruction: '☄️ اضغطي على الشهاب الصحيح',
      choices: [
        { id: 'rain', en: 'Because it is raining.', icon: '🌧️', correct: true },
        { id: 'school', en: 'At school.', icon: '🏫' },
        { id: 'morning', en: 'In the morning.', icon: '🌅' },
      ],
      recap: '**Why** does she have an umbrella? **Because** it is raining. ☔',
    },
    hint: 'ابحثي عن السبب 💡',
    wrongHint: 'فكري: لماذا تحمل المظلة؟ ابحثي عن السبب 💡',
    success: { title: '✨ مبدعة!', sub: 'للسؤال عن السبب 💡' },
    secret: ['💫 {Why} ← سبب 💡', '{Why} غالبًا نجد في إجابته: {Because} 💡'],
  },
  {
    key: 'how',
    word: 'How',
    upper: 'HOW',
    ar: 'كيف؟',
    arShort: 'كيف؟',
    category: 'طريقة',
    icon: '⚙️',
    dot: '🔵',
    color: '#93c5fd',
    deep: '#1d4ed8',
    usageIcon: '⚙️',
    usage: 'نستخدم {How} للسؤال عن **الطريقة أو الكيفية**.',
    example: { scene: 'bike', q: '**How** do you go to school?', a: '**By bike**.', note: '🚲 {by bike} = طريقة' },
    activity: {
      kind: 'blank',
      scene: 'car',
      q: '**How** do you go there?',
      instruction: '🧩 اسحبي الإجابة إلى الفراغ',
      choices: [
        { id: 'car', en: 'By car.', icon: '🚗', correct: true },
        { id: 'night', en: 'At night.', icon: '🌙' },
        { id: 'friend', en: 'My friend.', icon: '👭' },
      ],
      recap: '**How** do you go there? **By car**. 🚗',
    },
    hint: 'كيف حدث الشيء؟ بأي طريقة؟ ⚙️',
    wrongHint: 'فكري: كيف نذهب؟ ابحثي عن طريقة ⚙️',
    success: { title: '🚀 ممتاز!', sub: 'للسؤال عن الطريقة / الكيفية ⚙️' },
    secret: ['💫 {How} ← طريقة / كيف ⚙️', 'مثل: {by bus} 🚌 – {on foot} 🚶'],
  },
];

export const byKey = (k: WhKey) => STATIONS.find((s) => s.key === k) as Station;

export interface ChallengeItem {
  key: WhKey;
  scene: SceneName;
  badge: string;
  label: string;
  q: string;
  a: string;
  options: WhKey[];
}

export const CHALLENGE: ChallengeItem[] = [
  { key: 'where', scene: 'school', badge: '📍', label: 'سؤال عن مكان', q: '___ is Sara?', a: 'At school.', options: ['where', 'who', 'what'] },
  { key: 'who', scene: 'teacher', badge: '👩', label: 'سؤال عن شخص', q: '___ is she?', a: 'My teacher.', options: ['who', 'when', 'where'] },
  { key: 'when', scene: 'night', badge: '⏰', label: 'سؤال عن وقت', q: '___ do you sleep?', a: 'At night.', options: ['when', 'why', 'who'] },
  { key: 'why', scene: 'happy', badge: '💡', label: 'سؤال عن سبب', q: '___ are you happy?', a: 'Because I won.', options: ['why', 'how', 'where'] },
  { key: 'what', scene: 'gift', badge: '🎁', label: 'سؤال عن شيء', q: '___ is this?', a: 'It is a gift.', options: ['what', 'where', 'when'] },
  { key: 'how', scene: 'bus', badge: '⚙️', label: 'سؤال عن طريقة', q: '___ do you go to school?', a: 'By bus.', options: ['how', 'who', 'when'] },
];

export const SPACE_FACTS = ['الشمس نجم ⭐☀️', 'الأرض كوكب نعيش عليه 🌍'];
