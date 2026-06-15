import { Injectable, signal } from '@angular/core';
import { Language } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  isMuted = signal<boolean>(false);
  isPlaying = signal<boolean>(false);

  speak(text: string, lang: Language) {
    if (this.isMuted()) return;

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getLangCode(lang);
    
    // Adjust rate and pitch for better quality
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isPlaying.set(true);
    };

    utterance.onend = () => {
      this.isPlaying.set(false);
    };

    utterance.onerror = () => {
      this.isPlaying.set(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    window.speechSynthesis.cancel();
    this.isPlaying.set(false);
  }

  toggleMute() {
    this.isMuted.update(v => !v);
    if (this.isMuted()) {
      this.stop();
    }
  }

  private getLangCode(lang: Language): string {
    switch(lang) {
      case 'th': return 'th-TH';
      case 'en': return 'en-US';
      case 'zh': return 'zh-CN';
      case 'ja': return 'ja-JP';
      default: return 'en-US';
    }
  }
}
