import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';
@Directive({
  selector: '[appMagnetic]',
})
export class MagneticDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const element = this.host.nativeElement;
      element.style.transition = 'transform 120ms ease-out';

      element.addEventListener(
        'pointermove',
        (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
          const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
          element.style.transform = `translate(${(dx * 6).toFixed(1)}px, ${(dy * 6).toFixed(1)}px)`;
        },
        { passive: true },
      );

      element.addEventListener('pointerleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }
}
