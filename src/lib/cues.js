// Short procedural task cues (English + the class's home languages).
// Use these to clarify WHAT TO DO, not to translate the lesson.
// Reference a cue from an activity with `cues: ['look', 'pointAnswer']`.

// Languages offered in the "What do I do?" panel. `help` is the short label for the button.
export const HELP_LANGS = [
  { code: 'es', label: 'Español', help: '¿Qué hago?' },
  { code: 'pt', label: 'Português', help: 'O que eu faço?' },
  { code: 'fr', label: 'Français', help: 'Que faire ?' },
  { code: 'fa', label: 'فارسی', help: 'راهنما', rtl: true },
];

export const CUES = {
  listen: { en: 'Listen.', es: 'Escuchen.', pt: 'Ouçam.', fr: 'Écoutez.', fa: 'گوش کنید.' },
  look: { en: 'Look.', es: 'Miren.', pt: 'Olhem.', fr: 'Regardez.', fa: 'نگاه کنید.' },
  repeat: { en: 'Repeat.', es: 'Repitan.', pt: 'Repitam.', fr: 'Répétez.', fa: 'تکرار کنید.' },
  read: { en: 'Read.', es: 'Lean.', pt: 'Leiam.', fr: 'Lisez.', fa: 'بخوانید.' },
  write: { en: 'Write.', es: 'Escriban.', pt: 'Escrevam.', fr: 'Écrivez.', fa: 'بنویسید.' },
  sayAnswer: { en: 'Say the answer.', es: 'Digan la respuesta.', pt: 'Digam a resposta.', fr: 'Dites la réponse.', fa: 'جواب را بگویید.' },
  pointAnswer: {
    en: 'Point to the answer.',
    es: 'Señalen la respuesta.',
    pt: 'Apontem para a resposta.',
    fr: 'Montrez la réponse du doigt.',
    fa: 'به جواب اشاره کنید.',
  },
  partner: {
    en: 'Work with a partner.',
    es: 'Trabajen con un compañero.',
    pt: 'Trabalhem com um colega.',
    fr: 'Travaillez avec un partenaire.',
    fa: 'با یک همکلاسی کار کنید.',
  },
  askPartner: {
    en: 'Ask your partner.',
    es: 'Pregúntenle a su compañero.',
    pt: 'Perguntem ao seu colega.',
    fr: 'Posez la question à votre partenaire.',
    fa: 'از همکلاسی‌تان بپرسید.',
  },
  answerPartner: {
    en: 'Answer your partner.',
    es: 'Respóndanle a su compañero.',
    pt: 'Respondam ao seu colega.',
    fr: 'Répondez à votre partenaire.',
    fa: 'به همکلاسی‌تان جواب بدهید.',
  },
  takeTurns: { en: 'Take turns.', es: 'Túrnense.', pt: 'Revezem-se.', fr: 'Chacun à son tour.', fa: 'نوبتی انجام دهید.' },
  switchRoles: { en: 'Switch roles.', es: 'Cambien de papel.', pt: 'Troquem de papel.', fr: 'Changez de rôle.', fa: 'نقش‌ها را عوض کنید.' },
  askHelp: {
    en: 'If you need help, ask us.',
    es: 'Si necesitan ayuda, pregúntennos.',
    pt: 'Se precisarem de ajuda, perguntem para nós.',
    fr: 'Si vous avez besoin d’aide, demandez-nous.',
    fa: 'اگر کمک لازم دارید، از ما بپرسید.',
  },
  answerEnglish: {
    en: 'Answer in English.',
    es: 'Respondan en inglés.',
    pt: 'Respondam em inglês.',
    fr: 'Répondez en anglais.',
    fa: 'به انگلیسی جواب بدهید.',
  },
  askThree: {
    en: 'Ask your partner three questions.',
    es: 'Háganle tres preguntas a su compañero.',
    pt: 'Façam três perguntas ao seu colega.',
    fr: 'Posez trois questions à votre partenaire.',
    fa: 'از همکلاسی‌تان سه سؤال بپرسید.',
  },
  sayWhere: {
    en: 'Look at the object and say where it is.',
    es: 'Miren el objeto y digan dónde está.',
    pt: 'Olhem o objeto e digam onde ele está.',
    fr: 'Regardez l’objet et dites où il est.',
    fa: 'به وسیله نگاه کنید و بگویید کجاست.',
  },
  listenAnswer: {
    en: 'Listen to the question and answer.',
    es: 'Escuchen la pregunta y respondan.',
    pt: 'Ouçam a pergunta e respondam.',
    fr: 'Écoutez la question et répondez.',
    fa: 'به سؤال گوش کنید و جواب بدهید.',
  },
  partnerAInstruct: {
    en: 'Partner A gives an instruction.',
    es: 'El compañero A da una instrucción.',
    pt: 'O colega A dá uma instrução.',
    fr: 'Le partenaire A donne une consigne.',
    fa: 'نفر اول دستور می‌دهد.',
  },
  partnerBMoves: {
    en: 'Partner B moves the object.',
    es: 'El compañero B mueve el objeto.',
    pt: 'O colega B move o objeto.',
    fr: 'Le partenaire B déplace l’objet.',
    fa: 'نفر دوم وسیله را جابه‌جا می‌کند.',
  },
  nearFar: {
    en: 'Look at the object. Is it near or far? Is it one or more than one?',
    es: 'Miren el objeto. ¿Está cerca o lejos? ¿Es uno o más de uno?',
    pt: 'Olhem o objeto. Está perto ou longe? É um ou mais de um?',
    fr: 'Regardez l’objet. Il est près ou loin ? Il y en a un ou plusieurs ?',
    fa: 'به وسیله نگاه کنید. نزدیک است یا دور؟ یکی است یا بیشتر از یکی؟',
  },
};

// Small glossaries that activities can show next to the cues.
export const GLOSSARY = {
  location: [
    { en: 'in', es: 'en / dentro de', pt: 'em / dentro de', fr: 'dans', fa: 'داخل' },
    { en: 'on', es: 'sobre / encima de', pt: 'em cima de / sobre', fr: 'sur', fa: 'روی' },
    { en: 'under', es: 'debajo de', pt: 'embaixo de', fr: 'sous', fa: 'زیر' },
    { en: 'Where?', es: '¿Dónde?', pt: 'Onde?', fr: 'Où ?', fa: 'کجا؟' },
  ],
  demonstratives: [
    { en: 'this', es: 'este / esta', pt: 'este / esta', fr: 'ce / cette (ici)', fa: 'این', note: 'one · near' },
    { en: 'that', es: 'ese / esa', pt: 'esse / essa', fr: 'ce / cette (là-bas)', fa: 'آن', note: 'one · far' },
    { en: 'these', es: 'estos / estas', pt: 'estes / estas', fr: 'ces (ici)', fa: 'این‌ها', note: 'more than one · near' },
    { en: 'those', es: 'esos / esas', pt: 'esses / essas', fr: 'ces (là-bas)', fa: 'آن‌ها', note: 'more than one · far' },
  ],
};
