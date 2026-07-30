import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appReveal]',
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly delayMs = input(0, {
    alias: 'appReveal',
    transform: (value: unknown) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    },
  });

  private observer?: IntersectionObserver;
  private failsafe?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    if (!this.isBrowser || !('IntersectionObserver' in window)) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const element = this.host.nativeElement;
    element.style.setProperty('--reveal-delay', `${this.delayMs()}ms`);
    element.classList.add('reveal');

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.show();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(element);
    this.failsafe = setTimeout(() => this.show(), 2600);
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private show(): void {
    this.host.nativeElement.classList.add('is-visible');
    this.cleanup();
  }

  private cleanup(): void {
    this.observer?.disconnect();
    this.observer = undefined;
    clearTimeout(this.failsafe);
  }
}
