import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly copied = signal<string | null>(null);
  private resetTimer?: ReturnType<typeof setTimeout>;

  readonly lastCopied = this.copied.asReadonly();

  async copy(text: string): Promise<boolean> {
    if (!this.isBrowser) {
      return false;
    }

    const ok = (await this.viaClipboardApi(text)) || this.viaHiddenTextarea(text);
    if (ok) {
      this.copied.set(text);
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => this.copied.set(null), 2200);
    }
    return ok;
  }

  private async viaClipboardApi(text: string): Promise<boolean> {
    if (!navigator.clipboard?.writeText) {
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  private viaHiddenTextarea(text: string): boolean {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}
