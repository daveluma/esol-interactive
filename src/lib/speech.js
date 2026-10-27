// Text-to-speech using the browser's built-in voices (no API key needed).

let cachedVoice = null;

function pickVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  cachedVoice =
    voices.find((v) => v.lang === 'en-US' && /samantha|google us|aria|jenny/i.test(v.name)) ||
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang?.startsWith('en')) ||
    null;
  return cachedVoice;
}

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

if (canSpeak) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

function utterance(text, rate) {
  const u = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) u.voice = voice;
  u.lang = 'en-US';
  u.rate = rate;
  return u;
}

export function speak(text, { rate = 0.85 } = {}) {
  if (!canSpeak) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance(text, rate));
}

// Reads several lines one after another (the browser queues them).
export function speakAll(texts, { rate = 0.85 } = {}) {
  if (!canSpeak) return;
  window.speechSynthesis.cancel();
  texts.forEach((t) => window.speechSynthesis.speak(utterance(t, rate)));
}

export function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel();
}
