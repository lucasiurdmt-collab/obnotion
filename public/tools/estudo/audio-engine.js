/**
 * Audio Engine - Motor de Voz do Google Cloud TTS
 * Configuração DIRETA no código (como no seu projeto Obnotion).
 */

// ==========================================================================
// CONFIGURAÇÃO DA API DO GOOGLE (Configurada diretamente no código via Base64)
// ==========================================================================
const DEFAULT_GOOGLE_KEY = atob('QVEuQWI4Uk42SW1OaTAtODN0SGhNNWlLYVUxMHhTLWF1ZFJ4SUtrejI1VU1yTTJsS21Qd0E=');

const GOOGLE_CLOUD_TTS_CONFIG = {
  API_KEY: DEFAULT_GOOGLE_KEY,
  
  // Vozes Neurais de Alta Fidelidade do Google
  RU_VOICE: "ru-RU-Wavenet-C",   // Voz natural russa de estúdio (Google)
  EN_VOICE: "en-US-Journey-F",   // Voz natural inglesa de estúdio (Google)
  DEFAULT_SPEED: 0.85            // Velocidade ideal para estudo
};

class AudioEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.speed = parseFloat(localStorage.getItem('scriptura_audio_speed') || GOOGLE_CLOUD_TTS_CONFIG.DEFAULT_SPEED);
    this.apiKey = GOOGLE_CLOUD_TTS_CONFIG.API_KEY || localStorage.getItem('scriptura_google_tts_key') || '';
    this.currentAudio = null;
  }

  setSpeed(speed) {
    this.speed = speed;
    localStorage.setItem('scriptura_audio_speed', speed.toString());
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    localStorage.setItem('scriptura_google_tts_key', this.apiKey);
  }

  /**
   * Limpa acentos tônicos e caracteres que o leitor de voz não precisa
   */
  cleanText(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos gráficos móveis do russo
      .replace(/[«»„“”]/g, '"')
      .replace(/—/g, ', ')
      .trim();
  }

  /**
   * Toca o áudio usando o Google Cloud TTS
   * @param {string} text 
   * @param {string} lang ('ru' ou 'en')
   * @param {Function} onStart 
   * @param {Function} onEnd 
   */
  async speak(text, lang = 'ru', onStart = null, onEnd = null) {
    const textClean = this.cleanText(text);

    // Para áudio anterior se houver
    this.stop();

    // 1. Se houver chave do Google Cloud configurada, chama a API oficial do Google Cloud
    if (this.apiKey && this.apiKey !== "SUA_CHAVE_DO_GOOGLE_CLOUD_AQUI") {
      try {
        const ok = await this.playGoogleCloudTTS(textClean, lang, onStart, onEnd);
        if (ok) return;
      } catch (err) {
        console.warn('Erro na chamada Google Cloud TTS REST:', err);
      }
    }

    // 2. Fallback: Google Web TTS direto
    const webOk = await this.playGoogleWebAudio(textClean, lang, onStart, onEnd);
    if (webOk) return;

    // 3. Fallback: Síntese local do navegador
    this.playBrowserSpeech(textClean, lang, onStart, onEnd);
  }

  /**
   * Chamada REST oficial da API do Google Cloud Text-to-Speech
   */
  async playGoogleCloudTTS(text, lang, onStart, onEnd) {
    const voiceName = lang === 'ru' ? GOOGLE_CLOUD_TTS_CONFIG.RU_VOICE : GOOGLE_CLOUD_TTS_CONFIG.EN_VOICE;
    const langCode = lang === 'ru' ? 'ru-RU' : 'en-US';

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`;
    const payload = {
      input: { text },
      voice: {
        languageCode: langCode,
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: this.speed,
        pitch: 0
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Google Cloud TTS HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data.audioContent) {
      this.currentAudio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      if (onStart) onStart();
      this.currentAudio.onended = () => { if (onEnd) onEnd(); };
      this.currentAudio.onerror = () => { if (onEnd) onEnd(); };
      await this.currentAudio.play();
      return true;
    }
    return false;
  }

  /**
   * Toca via Google Web Audio Stream (Áudio oficial do Google)
   */
  playGoogleWebAudio(text, lang, onStart, onEnd) {
    return new Promise((resolve) => {
      // URL de áudio do Google com fallback
      const encoded = encodeURIComponent(text.slice(0, 200));
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encoded}`;
      
      const audio = new Audio(url);
      audio.playbackRate = this.speed;
      this.currentAudio = audio;

      audio.onplay = () => {
        if (onStart) onStart();
        resolve(true);
      };

      audio.onended = () => {
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        resolve(false);
      };

      audio.play().catch(() => resolve(false));
    });
  }

  /**
   * Síntese local do navegador
   */
  playBrowserSpeech(text, lang, onStart, onEnd) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ru' ? 'ru-RU' : 'en-US';
    utterance.rate = this.speed;

    const voices = this.synth.getVoices();
    const best = voices.find(v => v.lang.startsWith(lang) && (v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Natural'))) ||
                 voices.find(v => v.lang.startsWith(lang));
    if (best) utterance.voice = best;

    if (onStart) utterance.onstart = onStart;
    utterance.onend = () => { if (onEnd) onEnd(); };
    utterance.onerror = () => { if (onEnd) onEnd(); };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

window.AudioEngine = AudioEngine;
window.GOOGLE_CLOUD_TTS_CONFIG = GOOGLE_CLOUD_TTS_CONFIG;
