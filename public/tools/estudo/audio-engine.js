/**
 * Audio Engine - Motor de Voz Híbrido (Google TTS + Web Speech API)
 * 1. Prioriza a voz oficial do Google (Google TTS) para Russo e Inglês naturais e fluidos.
 * 2. Fallback instantâneo para Web Speech API (síntese nativa do sistema/navegador).
 * 3. Totalmente síncrono no disparo do clique, garantindo permissão em todos os navegadores.
 */

class AudioEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.speed = parseFloat(localStorage.getItem('scriptura_audio_speed') || '0.9');
    this.currentAudio = null;
    this.isSpeaking = false;
    this.watchdogTimer = null;
    this.voices = [];

    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const update = () => {
      try {
        this.voices = this.synth.getVoices() || [];
      } catch (e) {
        this.voices = [];
      }
    };
    update();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = update;
    }
  }

  setSpeed(speed) {
    this.speed = speed;
    localStorage.setItem('scriptura_audio_speed', speed.toString());
  }

  cleanText(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos gráficos russos de tonicidade
      .replace(/[«»„“”]/g, '"')
      .replace(/—/g, ', ')
      .trim();
  }

  getBestVoice(lang) {
    if (!this.synth) return null;
    if (!this.voices || this.voices.length === 0) {
      try {
        this.voices = this.synth.getVoices() || [];
      } catch (e) {
        this.voices = [];
      }
    }
    const prefix = lang === 'ru' ? 'ru' : 'en';

    // Prioriza vozes neurais / Google / Natural / Premium
    let voice = this.voices.find(v => 
      v.lang.toLowerCase().replace('_', '-').startsWith(prefix) &&
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Milena') || v.name.includes('Yuri'))
    );

    if (!voice) {
      voice = this.voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
    }

    return voice;
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {}
      this.currentAudio = null;
    }

    if (this.synth && (this.synth.speaking || this.synth.pending)) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }

    this.isSpeaking = false;
    this.stopWatchdog();
  }

  /**
   * Toca o áudio de forma segura, natural e imediata
   */
  speak(text, lang = 'ru', onStart = null, onEnd = null) {
    const clean = this.cleanText(text);
    if (!clean) {
      if (onEnd) onEnd();
      return;
    }

    // Se já estiver tocando, interrompe
    this.stop();

    const finish = () => {
      this.isSpeaking = false;
      this.stopWatchdog();
      if (onEnd) onEnd();
    };

    const start = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    // 1. TENTA PRIMEIRO O GOOGLE TTS (Voz oficial, clara e natural)
    const langCode = lang === 'ru' ? 'ru' : 'en';
    const encoded = encodeURIComponent(clean.slice(0, 200));
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encoded}`;

    try {
      const audio = new Audio(googleUrl);
      audio.playbackRate = this.speed;
      this.currentAudio = audio;

      let hasStarted = false;

      audio.onplay = () => {
        hasStarted = true;
        start();
      };

      audio.onended = () => {
        this.currentAudio = null;
        finish();
      };

      audio.onerror = (e) => {
        console.warn('Google TTS falhou, acionando fallback SpeechSynthesis:', e);
        this.currentAudio = null;
        if (!hasStarted) {
          this.speakLocal(clean, lang, onStart, onEnd);
        } else {
          finish();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Bloqueio no play de áudio, acionando fallback SpeechSynthesis:', err);
          this.currentAudio = null;
          this.speakLocal(clean, lang, onStart, onEnd);
        });
      }
    } catch (err) {
      console.warn('Exceção ao criar Audio, acionando fallback local:', err);
      this.speakLocal(clean, lang, onStart, onEnd);
    }
  }

  /**
   * Fallback via Web Speech API (Síntese local do dispositivo/navegador)
   */
  speakLocal(clean, lang, onStart, onEnd) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    if (this.synth.speaking || this.synth.pending) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    if (this.synth.paused) {
      try {
        this.synth.resume();
      } catch (e) {}
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang === 'ru' ? 'ru-RU' : 'en-US';
    utterance.rate = this.speed;
    utterance.pitch = 1.0;

    const voice = this.getBestVoice(lang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
      this.startWatchdog();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopWatchdog();
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis erro:', e);
      this.isSpeaking = false;
      this.stopWatchdog();
      if (onEnd) onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.error('Falha ao executar speak():', e);
      if (onEnd) onEnd();
    }
  }

  startWatchdog() {
    this.stopWatchdog();
    this.watchdogTimer = setInterval(() => {
      if (this.synth && this.synth.speaking) {
        this.synth.resume();
      } else {
        this.stopWatchdog();
      }
    }, 3000);
  }

  stopWatchdog() {
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }
  }
}

window.AudioEngine = AudioEngine;
