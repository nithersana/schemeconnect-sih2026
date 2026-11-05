/**
 * Web Speech Synthesis (Text-to-Speech) Utility for SchemeConnect
 * Reads scheme details and counselor answers aloud in Tamil, Hindi, or English.
 */

let currentUtterance = null;

export function speakText(text, lang = 'ta', onEndCallback = null) {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech Synthesis API not supported in this browser.");
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from markdown asterisks and URLs for natural speech
  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/http[s]?:\/\/\S+/g, '')
    .replace(/[•➔✔❌⚠★]/g, ' ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  if (lang === 'ta') {
    utterance.lang = 'ta-IN';
  } else if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95; // slightly slower for maximum clarity
  utterance.pitch = 1.0;

  utterance.onend = () => {
    currentUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  utterance.onerror = (e) => {
    console.error("Speech synthesis error:", e);
    currentUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking() {
  return window.speechSynthesis ? window.speechSynthesis.speaking : false;
}
