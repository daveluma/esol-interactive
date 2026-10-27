// Short procedural task cues (English + Farsi/Persian).
// Use these to clarify WHAT TO DO, not to translate the lesson.
// Reference a cue from an activity with `cues: ['look', 'pointAnswer']`.

export const CUES = {
  listen: { en: 'Listen.', fa: 'گوش کنید.' },
  look: { en: 'Look.', fa: 'نگاه کنید.' },
  repeat: { en: 'Repeat.', fa: 'تکرار کنید.' },
  read: { en: 'Read.', fa: 'بخوانید.' },
  write: { en: 'Write.', fa: 'بنویسید.' },
  sayAnswer: { en: 'Say the answer.', fa: 'جواب را بگویید.' },
  pointAnswer: { en: 'Point to the answer.', fa: 'به جواب اشاره کنید.' },
  partner: { en: 'Work with a partner.', fa: 'با یک همکلاسی کار کنید.' },
  askPartner: { en: 'Ask your partner.', fa: 'از همکلاسی‌تان بپرسید.' },
  answerPartner: { en: 'Answer your partner.', fa: 'به همکلاسی‌تان جواب بدهید.' },
  takeTurns: { en: 'Take turns.', fa: 'نوبتی انجام دهید.' },
  switchRoles: { en: 'Switch roles.', fa: 'نقش‌ها را عوض کنید.' },
  askHelp: { en: 'If you need help, ask us.', fa: 'اگر کمک لازم دارید، از ما بپرسید.' },
  answerEnglish: { en: 'Answer in English.', fa: 'به انگلیسی جواب بدهید.' },
  askThree: { en: 'Ask your partner three questions.', fa: 'از همکلاسی‌تان سه سؤال بپرسید.' },
  sayWhere: { en: 'Look at the object and say where it is.', fa: 'به وسیله نگاه کنید و بگویید کجاست.' },
  listenAnswer: { en: 'Listen to the question and answer.', fa: 'به سؤال گوش کنید و جواب بدهید.' },
  partnerAInstruct: { en: 'Partner A gives an instruction.', fa: 'نفر اول دستور می‌دهد.' },
  partnerBMoves: { en: 'Partner B moves the object.', fa: 'نفر دوم وسیله را جابه‌جا می‌کند.' },
  nearFar: {
    en: 'Look at the object. Is it near or far? Is it one or more than one?',
    fa: 'به وسیله نگاه کنید. نزدیک است یا دور؟ یکی است یا بیشتر از یکی؟',
  },
};

// Small Farsi glossaries that activities can show next to the cues.
export const GLOSSARY = {
  location: [
    { en: 'in', fa: 'داخل' },
    { en: 'on', fa: 'روی' },
    { en: 'under', fa: 'زیر' },
    { en: 'Where?', fa: 'کجا؟' },
  ],
  demonstratives: [
    { en: 'this', fa: 'این', note: 'one · near' },
    { en: 'that', fa: 'آن', note: 'one · far' },
    { en: 'these', fa: 'این‌ها', note: 'more than one · near' },
    { en: 'those', fa: 'آن‌ها', note: 'more than one · far' },
  ],
};
