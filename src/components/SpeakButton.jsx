import React from 'react';
import { canSpeak, speak } from '../lib/speech';

export default function SpeakButton({ text, label = 'Listen', small = false }) {
  if (!canSpeak) return null;
  return (
    <button
      type="button"
      className={`btn btn-speak ${small ? 'btn-small' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      aria-label={`${label}: ${text}`}
      title="Listen"
    >
      🔊{!small && <span> {label}</span>}
    </button>
  );
}
