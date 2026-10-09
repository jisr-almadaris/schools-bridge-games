import type { Question } from './components/activities';

// Station 1 – packing (2 easy questions about habits / repetition)
export const packingQuestions: Question[] = [
  { kind: 'mcq', sentence: 'I go to school ___.', options: ['every day', 'yesterday'], answer: 'every day', hint: 'Present Simple = شيء يتكرر 🔁 أي كلمة تعني التكرار؟', success: 'أحسنتِ! ⭐ every day = كل يوم، شيء يتكرر 🔁' },
  { kind: 'mcq', sentence: 'I travel ___.', options: ['every summer', 'last week'], answer: 'every summer', hint: 'نبحث عن كلمة تدل على العادة والتكرار 🔁', success: 'رائع! ⭐ every summer = كل صيف، عادة تتكرر ✈️' },
];

// Station 2 – airport (3 activities)
export const airportQuestions: Question[] = [
  { kind: 'mcq', sentence: 'She ___ every day.', options: ['play', 'plays'], answer: 'plays', hint: 'انظري إلى She 👀 ماذا نضيف غالبًا للفعل؟', success: 'أحسنتِ! ⭐ She → plays' },
  { kind: 'mcq', sentence: 'They ___ every day.', options: ['reads', 'read'], answer: 'read', hint: 'انظري إلى They 👀 هل نضيف s؟', success: 'رائع! ⭐ مع They نستخدم الفعل كما هو: read' },
  { kind: 'order', words: ['every day', 'plays', 'She'], answer: 'She plays every day', verb: 'plays', hint: 'ابدئي بمن يقوم بالفعل: She 👧🏻', success: 'رائع! ⭐ She → plays' },
];

// Station 3 – on the plane (3 activities)
export const planeQuestions: Question[] = [
  { kind: 'mcq', sentence: 'He ___ every day.', options: ['play', 'plays'], answer: 'plays', hint: 'انظري إلى He 👀 ماذا نضيف غالبًا للفعل؟', success: 'أحسنتِ! ⭐ He → plays' },
  { kind: 'order', words: ['every day', 'reads', 'She'], answer: 'She reads every day', verb: 'reads', hint: 'ابدئي بمن يقوم بالفعل: She 👧🏻', success: 'رائع! ⭐ She → reads' },
  { kind: 'order', words: ['school', 'go to', 'They', 'every day'], answer: 'They go to school every day', verb: 'go', hint: 'ابدئي بـ They 👥 ثم الفعل go to', success: 'ممتاز! ⭐ They → go (بدون s)' },
];

// Station – Transit lounge: varied question types (match, ✓/✗, mcq, order)
export const transitQuestions: Question[] = [
  { kind: 'match', pairs: [{ left: 'I', right: 'play' }, { left: 'She', right: 'plays' }, { left: 'They', right: 'read' }, { left: 'He', right: 'reads' }], hint: 'He / She → نضيف s ⭐ · I / They → الفعل كما هو', success: 'ممتاز! ⭐ He / She → +s · I / They → كما هو' },
  { kind: 'tf', sentence: 'She plays every day.', correct: true, fixed: 'She plays every day.', hint: 'انظري إلى She 👀 هل الفعل معه s؟', success: 'أحسنتِ! ⭐ She → plays ✓' },
  { kind: 'tf', sentence: 'They reads books.', correct: false, fixed: 'They read books.', hint: 'انظري إلى They 👀 هل نضيف s؟', success: 'رائع! ⭐ مع They نستخدم الفعل كما هو: read' },
  { kind: 'mcq', sentence: 'We ___ to school every day.', options: ['go', 'goes'], answer: 'go', hint: 'انظري إلى We 👀 هل نضيف s؟', success: 'أحسنتِ! ⭐ We → go (بدون s)' },
  { kind: 'mcq', sentence: 'It ___ every day.', options: ['rain', 'rains'], answer: 'rains', hint: 'انظري إلى It 👀 ماذا نضيف غالبًا؟', success: 'رائع! ⭐ It → rains' },
  { kind: 'order', words: ['every summer', 'travels', 'She'], answer: 'She travels every summer', verb: 'travels', hint: 'ابدئي بمن يقوم بالفعل: She 👧🏻', success: 'ممتاز! ⭐ She → travels ✈️' },
];

// Final challenge – 5 easy questions
export const finalQuestions: Question[] = [
  { kind: 'mcq', sentence: 'She ___ every day.', options: ['play', 'plays'], answer: 'plays', hint: 'انظري إلى She 👀', success: 'أحسنتِ! ⭐ She → plays' },
  { kind: 'mcq', sentence: 'They ___ books.', options: ['read', 'reads'], answer: 'read', hint: 'انظري إلى They 👀 لا نضيف s', success: 'رائع! ⭐ مع They نستخدم الفعل كما هو.' },
  { kind: 'order', words: ['football', 'plays', 'He'], answer: 'He plays football', verb: 'plays', hint: 'ابدئي بمن يقوم بالفعل: He 👦🏻', success: 'رائع! ⭐ He → plays' },
  { kind: 'order', words: ['every day', 'They', 'read'], answer: 'They read every day', verb: 'read', hint: 'ابدئي بـ They 👥', success: 'ممتاز! ⭐ They → read' },
  { kind: 'mcq', sentence: 'I ___ every summer.', options: ['travel', 'travels'], answer: 'travel', hint: 'انظري إلى I 👀 هل نضيف s؟', success: 'أحسنتِ! ⭐ I → travel (بدون s) ✈️' },
];

export const MAX_SCORE = (packingQuestions.length + airportQuestions.length + planeQuestions.length + transitQuestions.length + finalQuestions.length) * 2;
