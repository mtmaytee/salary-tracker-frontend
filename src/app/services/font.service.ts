import { Injectable, signal, effect } from '@angular/core';

export type FontSize = 'small' | 'medium' | 'large';

@Injectable({
  providedIn: 'root'
})
export class FontService {
  currentSize = signal<FontSize>('medium');

  constructor() {
    // Apply font size class to body when it changes
    effect(() => {
      const size = this.currentSize();
      document.body.classList.remove('text-sm', 'text-base', 'text-lg');
      
      switch(size) {
        case 'small':
          document.body.classList.add('text-sm');
          document.documentElement.style.fontSize = '14px';
          break;
        case 'medium':
          document.body.classList.add('text-base');
          document.documentElement.style.fontSize = '16px';
          break;
        case 'large':
          document.body.classList.add('text-lg');
          document.documentElement.style.fontSize = '18px';
          break;
      }
    });
  }

  setFontSize(size: FontSize) {
    this.currentSize.set(size);
  }
}
