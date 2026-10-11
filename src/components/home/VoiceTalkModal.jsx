import { useEffect, useRef, useState } from 'react';
import CompanionAvatarView from '../common/CompanionAvatarView.jsx';
import { readChatHistory, writeChatHistory } from '../../utils/storage.js';
import { usePresence } from '../../context/PresenceContext.jsx';
import { BASE_URL } from '../../config/index.jsx';

const CHAT_ENDPOINT = `${BASE_URL}/api/chat`;
const TTS_ENDPOINT = `${BASE_URL}/api/tts`;
const SILENCE_DELAY = 2000;

function cleanSpeechText(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[-*+] |\d+\. )/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/[*_~`#]/g, '')
    .replace(/\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function selectPreferredEnglishVoice(voices = []) {
  const englishVoices = voices.filter((voice) => /^en([_-]|$)/i.test(voice.lang || ''));
  const feminineVoiceName = /female|woman|aria|jenny|samantha|ava|allison|serena|zira|susan|karen|victoria|tessa|moira|fiona|natasha|sara/i;
  const naturalVoiceName = /natural|neural|premium|enhanced|conversational|online/i;

  return englishVoices
    .map((voice, index) => ({
      voice,
      index,
      score: (feminineVoiceName.test(voice.name) ? 4 : 0) +
        (naturalVoiceName.test(voice.name) ? 2 : 0) +
        (voice.lang.toLowerCase() === 'en-us' ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.voice || null;
}

function selectAlternateEnglishVoice(voices = [], preferredVoice = null) {
  const feminineVoiceName = /female|woman|aria|jenny|samantha|ava|allison|serena|zira|susan|karen|victoria|tessa|moira|fiona|natasha|sara/i;
  const naturalVoiceName = /natural|neural|premium|enhanced|conversational|online/i;

  return voices
    .filter((voice) =>
      /^en([_-]|$)/i.test(voice.lang || '') &&
      voice.voiceURI !== preferredVoice?.voiceURI &&
      voice.name !== preferredVoice?.name
    )
    .map((voice, index) => ({
      voice,
      index,
      score: (feminineVoiceName.test(voice.name) ? 4 : 0) +
        (naturalVoiceName.test(voice.name) ? 2 : 0) +
        (voice.lang.toLowerCase() === 'en-us' ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.voice || null;
}

export default function VoiceTalkModal({ isOpen, onClose, companion, userName }) {
  const { settings, updateSettings } = usePresence();
  const [phase, setPhase] = useState('Ready');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const recognitionRef = useRef(null);
  const activeRef = useRef(false);
  const phaseRef = useRef('Ready');
  const restartTimerRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const speechTimerRef = useRef(null);
  const recognitionRunningRef = useRef(false);
  const startRetryCountRef = useRef(0);
  const sessionTranscriptRef = useRef('');
  const completedTranscriptRef = useRef('');
  const pendingTranscriptRef = useRef('');
  const requestControllerRef = useRef(null);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const sendTranscriptRef = useRef(null);
  const voiceIsUnlocked = Array.isArray(settings.unlockedPresenceItems) &&
    settings.unlockedPresenceItems.includes('new-companion-voice');
  const preferredEnglishVoice = selectPreferredEnglishVoice(availableVoices);
  const companionEnglishVoice = selectAlternateEnglishVoice(
    availableVoices,
    preferredEnglishVoice
  );
  const selectedCompanionVoice = settings.selectedCompanionVoice === 'companion'
    ? 'companion'
    : 'default';

    const audioUnlockedRef = useRef(false);
const playerRef = useRef(null);

const unlockAudio = async () => {
  // Call this directly from a user click/tap handler.
  const player = new Audio(
    'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
  );

  playerRef.current = player;

  try {
    await player.play();
    player.pause();
    player.currentTime = 0;
    audioUnlockedRef.current = true;
  } catch (error) {
    console.error('iPhone audio unlock failed:', error);
    audioUnlockedRef.current = false;
  }
};

  useEffect(() => {
    const synthesis = window.speechSynthesis;
    if (!synthesis) return undefined;

    const updateAvailableVoices = () => setAvailableVoices(synthesis.getVoices());
    updateAvailableVoices();
    synthesis.addEventListener?.('voiceschanged', updateAvailableVoices);

    return () => {
      synthesis.removeEventListener?.('voiceschanged', updateAvailableVoices);
    };
  }, []);

  const changePhase = (nextPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };

  const startListening = () => {
    unlockAudio()
    const recognition = recognitionRef.current;
    if (!activeRef.current || !recognition || recognitionRunningRef.current || phaseRef.current === 'Thinking...' || phaseRef.current === 'Speaking...' || phaseRef.current === 'Paused') return;

    setErrorMessage('');
    try {
      recognitionRunningRef.current = true;
      recognition.start();
    } catch {
      recognitionRunningRef.current = false;
      // Some browsers briefly reject start() while the previous recognition session is closing.
      if (activeRef.current && !['Thinking...', 'Speaking...', 'Paused', 'Error'].includes(phaseRef.current)) {
        if (startRetryCountRef.current < 5) {
          startRetryCountRef.current += 1;
          restartTimerRef.current = window.setTimeout(startListening, 300);
        } else {
          setErrorMessage('I couldn’t restart listening. Please tap the microphone to try again.');
          changePhase('Error');
        }
      }
    }
  };

  const resumeListening = () => {
    window.clearTimeout(restartTimerRef.current);
    restartTimerRef.current = window.setTimeout(startListening, 250);
  };

  const speakWithDeviceVoice = (text, voiceChoice = 'default') => {
    const synth = window.speechSynthesis;
    const spokenText = cleanSpeechText(text);
    if (!activeRef.current) return;

    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function' || !spokenText) {
      changePhase('Ready');
      setErrorMessage('Using your device voice for now isn’t available, but you can read the reply here.');
      resumeListening();
      return;
    }

    synth.cancel();
    setErrorMessage(voiceChoice === 'companion' && companionEnglishVoice
      ? 'Using your New Companion voice.'
      : 'Using your device voice for now.');

    const utterance = new window.SpeechSynthesisUtterance(spokenText);
    utterance.voice = voiceChoice === 'companion'
      ? companionEnglishVoice || preferredEnglishVoice
      : preferredEnglishVoice;
    utterance.rate = 0.98;
    utterance.pitch = 1.02;
    utterance.volume = 1;

    let finished = false;
    const finish = (failed = false) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(speechTimerRef.current);
      if (!activeRef.current) return;
      changePhase('Ready');
      if (failed) setErrorMessage('I couldn’t play that aloud, but the reply is here for you to read.');
      resumeListening();
    };

    utterance.onend = () => finish();
    utterance.onerror = () => finish(true);
    changePhase('Speaking...');
    synth.speak(utterance);

    speechTimerRef.current = window.setTimeout(() => {
      if (activeRef.current && phaseRef.current === 'Speaking...') {
        synth.cancel();
        finish(true);
      }
    }, Math.max(30000, Math.min(spokenText.length * 180, 90000)));
  };

  const finalizeTranscript = () => {
    window.clearTimeout(silenceTimerRef.current);
    const finalText = pendingTranscriptRef.current.trim();
    if (!finalText || !activeRef.current || phaseRef.current !== 'Listening...') return;
    pendingTranscriptRef.current = '';
    completedTranscriptRef.current = '';
    sessionTranscriptRef.current = '';
    changePhase('Thinking...');
    try { recognitionRef.current?.stop(); } catch { /* already stopped */ }
    sendTranscriptRef.current?.(finalText);
  };

  sendTranscriptRef.current = async (spokenText) => {
    const text = spokenText.trim();
    if (!text || !activeRef.current) return;

    setTranscript(text);
    setReply('');
    setErrorMessage('');
    changePhase('Thinking...');

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const existingHistory = readChatHistory(companion.displayName, userName);
    const userMessage = { id: `${Date.now()}`, sender: 'user', text, timestamp };
    const updatedHistory = [...existingHistory, userMessage];
    writeChatHistory(updatedHistory);

    const controller = new AbortController();
    requestControllerRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: existingHistory.slice(-12).map(({ sender, text: historyText }) => ({ sender, text: historyText })),
          userName,
          companionName: companion.displayName,
          personality: companion.personality,
          responseMode: 'voice',
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('chat-request-failed');
      const data = await response.json();
      if (!activeRef.current) return;

      const answer = data.reply?.trim();
      if (!answer) throw new Error('empty-reply');

      setReply(answer);
      writeChatHistory([
        ...updatedHistory,
        {
          id: `${Date.now() + 1}`,
          sender: 'companion',
          text: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      const spokenAnswer = cleanSpeechText(answer);
      if (!spokenAnswer) {
        changePhase('Ready');
        resumeListening();
        return;
      }

      if (
        voiceIsUnlocked &&
        selectedCompanionVoice === 'companion' &&
        companionEnglishVoice
      ) {
        speakWithDeviceVoice(answer, 'companion');
        return;
      }

      let ttsResponse;
      try {
        ttsResponse = await fetch(TTS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: spokenAnswer }),
          signal: controller.signal,
        });
        if (!ttsResponse.ok) throw new Error('tts-request-failed');
      } catch (error) {
        if (!activeRef.current) return;
        if (error.name === 'AbortError') throw error;
        speakWithDeviceVoice(answer);
        return;
      }

      const audioBlob = await ttsResponse.blob();
      if (!activeRef.current) return;

      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      const finishAudio = (failed = false) => {
        if (audioRef.current !== audio) return;
        window.clearTimeout(speechTimerRef.current);
        audio.onloadedmetadata = null;
        audio.onended = null;
        audio.onerror = null;
        audioRef.current = null;
        audio.pause();
        audio.src = '';
        URL.revokeObjectURL(audioUrl);
        audioUrlRef.current = null;
        if (!activeRef.current) return;
        if (failed) {
          speakWithDeviceVoice(answer);
        } else {
          changePhase('Ready');
          resumeListening();
        }
      };

      audio.onloadedmetadata = () => {
        const duration = Number.isFinite(audio.duration) ? audio.duration * 1000 + 5000 : 60000;
        speechTimerRef.current = window.setTimeout(() => finishAudio(true), Math.min(Math.max(duration, 15000), 90000));
      };
      audio.onended = () => finishAudio();
      audio.onerror = () => finishAudio(true);
      changePhase('Speaking...');

      try {
  await audio.play();
} catch (error) {
  console.error("Audio playback failed:", {
    name: error.name,
    message: error.message,
    browser: navigator.userAgent,
    audioReadyState: audio.readyState,
    audioSource: audio.currentSrc,
  });
  setErrorMessage(error.message)

  finishAudio(true);
}
    } catch (error) {
      if (!activeRef.current) return;
      changePhase('Error');
      setErrorMessage(error.name === 'AbortError'
        ? 'That took too long to respond. You can try speaking again.'
        : 'I couldn’t get a response just now. Please try again.');
    } finally {
      window.clearTimeout(timeoutId);
      if (requestControllerRef.current === controller) requestControllerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    activeRef.current = true;
    pendingTranscriptRef.current = '';
    completedTranscriptRef.current = '';
    sessionTranscriptRef.current = '';
    recognitionRunningRef.current = false;
    setTranscript('');
    setReply('');
    setErrorMessage('');
    changePhase('Ready');

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechSupported(false);
      changePhase('Error');
      setErrorMessage('Voice input isn’t supported in this browser. You can use text chat instead.');
      return () => { activeRef.current = false; };
    }

    setSpeechSupported(true);
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      recognitionRunningRef.current = true;
      startRetryCountRef.current = 0;
      sessionTranscriptRef.current = '';
      if (activeRef.current) {
        setErrorMessage('');
        changePhase('Listening...');
      }
    };
    recognition.onresult = (event) => {
      const sessionText = Array.from(event.results || [])
        .map((result) => result?.[0]?.transcript || '')
        .join(' ')
        .trim();
      if (!sessionText || !activeRef.current) return;

      sessionTranscriptRef.current = sessionText;
      pendingTranscriptRef.current = [completedTranscriptRef.current, sessionText]
        .filter(Boolean)
        .join(' ')
        .trim();
      setTranscript(pendingTranscriptRef.current);
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = window.setTimeout(finalizeTranscript, SILENCE_DELAY);
    };
    recognition.onend = () => {
      recognitionRunningRef.current = false;
      if (!activeRef.current || phaseRef.current !== 'Listening...') return;

      if (sessionTranscriptRef.current) {
        completedTranscriptRef.current = [completedTranscriptRef.current, sessionTranscriptRef.current]
          .filter(Boolean)
          .join(' ')
          .trim();
      }
      if (pendingTranscriptRef.current.trim()) {
        resumeListening();
      } else {
        changePhase('Ready');
      }
    };
    recognition.onerror = (event) => {
      recognitionRunningRef.current = false;
      if (!activeRef.current || event.error === 'aborted') return;
      if (event.error === 'no-speech') {
        setErrorMessage('I didn’t catch anything yet. Take your time; I’m still listening.');
        return;
      }
      changePhase('Error');
      setErrorMessage(event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'I can’t hear you yet. Please allow microphone access and try again.'
        : 'I had trouble hearing that. Please try the microphone again.');
    };
    recognitionRef.current = recognition;
    // startListening();

    return () => {
      activeRef.current = false;
      window.clearTimeout(restartTimerRef.current);
      window.clearTimeout(silenceTimerRef.current);
      window.clearTimeout(speechTimerRef.current);
      recognitionRunningRef.current = false;
      requestControllerRef.current?.abort();
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try { recognition.stop(); } catch { /* already stopped */ }
      recognitionRef.current = null;
      if (audioRef.current) {
        audioRef.current.onloadedmetadata = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (phase === 'Listening...') {
      window.clearTimeout(silenceTimerRef.current);
      changePhase('Paused');
      try { recognitionRef.current?.stop(); } catch { /* already stopped */ }
    } else if (phase === 'Paused' || phase === 'Ready' || phase === 'Error') {
      if (phase === 'Paused') changePhase('Ready');
      startListening();
    }
  };

  const statusText = speechSupported ? phase : 'Voice unavailable';
  const isListening = phase === 'Listening...';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="voice-talk-title">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-sm" aria-label="Close voice conversation" />
      <section className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-[#fbf5ed] dark:bg-[#1a2a26] text-[#263632] dark:text-[#f4eee5] border border-[#705142]/15 dark:border-white/10 shadow-2xl p-6 sm:p-8">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-xl" aria-label="End conversation">×</button>

        <div className="flex flex-col items-center text-center">
          <div className={`relative rounded-full transition-all duration-500 ${isListening ? 'ring-8 ring-[#a8b698]/30 scale-105' : ''}`}>
            <CompanionAvatarView avatar={companion.avatar} customPhoto={companion.customPhoto} size="sm" animate={false} />
          </div>
          <h2 id="voice-talk-title" className="mt-3 font-serif text-2xl font-semibold text-[#173a34] dark:text-[#f4eee5]">{companion.displayName}</h2>
          <p className="mt-1 text-sm text-[#5d6761] dark:text-[#a3b2ab]">A voice conversation with you</p>

          <div className="mt-6 flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/5 border border-[#705142]/10 dark:border-white/10 px-4 py-2 text-sm" aria-live="polite">
            <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : phase === 'Thinking...' ? 'bg-amber-500 animate-pulse' : phase === 'Speaking...' ? 'bg-[#b96851] animate-pulse' : phase === 'Error' ? 'bg-red-500' : 'bg-[#a8b698]'}`} />
            {statusText}
          </div>

          {voiceIsUnlocked && (
            <fieldset className="mt-4 w-full rounded-2xl border border-[#705142]/10 bg-white/60 p-4 text-left dark:border-white/10 dark:bg-white/5">
              <legend className="px-1 text-xs font-semibold text-[#173a34] dark:text-white">
                Voice
              </legend>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="presence-companion-voice"
                    value="default"
                    checked={selectedCompanionVoice === 'default'}
                    onChange={() => updateSettings({ selectedCompanionVoice: 'default' })}
                    className="accent-[#315b4d]"
                  />
                  Default
                </label>
                {companionEnglishVoice && (
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="presence-companion-voice"
                      value="companion"
                      checked={selectedCompanionVoice === 'companion'}
                      onChange={() => updateSettings({ selectedCompanionVoice: 'companion' })}
                      className="accent-[#315b4d]"
                    />
                    New Companion ✨
                  </label>
                )}
              </div>
              {!companionEnglishVoice && (
                <p className="mt-2 text-xs leading-relaxed text-[#5d6761] dark:text-[#a3b2ab]">
                  Your device currently offers one English voice, so Presence will use it for now.
                  {selectedCompanionVoice === 'companion' && ' Your New Companion choice is saved for devices with another voice.'}
                </p>
              )}
            </fieldset>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {transcript && <div className="rounded-2xl rounded-br-sm bg-[#173a34] text-[#fffaf2] p-4 text-sm leading-relaxed"><span className="block mb-1 text-[10px] uppercase tracking-wider text-white/60">You said</span>{transcript}</div>}
          {reply && <div className="rounded-2xl rounded-bl-sm bg-white dark:bg-[#253b36] border border-[#705142]/10 dark:border-white/10 p-4 text-sm leading-relaxed"><span className="block mb-1 text-[10px] uppercase tracking-wider text-[#705142] dark:text-[#d8b784]">{companion.displayName}</span>{reply}</div>}
          {errorMessage && <p className="rounded-xl bg-[#b96851]/10 text-[#754c41] dark:text-[#f4c8b0] p-3 text-sm" role="status">{errorMessage}</p>}
          {!transcript && !reply && !errorMessage && <p className="py-5 text-sm text-[#5d6761] dark:text-[#a3b2ab]">Whenever you’re ready, start talking. I’m listening.</p>}
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <button type="button" onClick={toggleListening} disabled={!speechSupported || phase === 'Thinking...' || phase === 'Speaking...'} className={`min-w-40 px-6 py-3 rounded-full font-medium text-sm shadow-md transition-all disabled:opacity-50 ${isListening ? 'bg-white dark:bg-white/10 border border-[#705142]/20 dark:border-white/15 text-[#173a34] dark:text-white' : 'bg-[#173a34] text-white hover:bg-[#245248]'}`}>
            {isListening ? 'Pause listening' : '🎙️ Start listening'}
          </button>
          <button type="button" onClick={onClose} className="px-5 py-3 rounded-full border border-[#705142]/20 dark:border-white/15 text-sm hover:bg-black/5 dark:hover:bg-white/5">End</button>
        </div>
      </section>
    </div>
  );
}
