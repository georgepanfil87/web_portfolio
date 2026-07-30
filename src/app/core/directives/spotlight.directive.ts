import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

@Directive({
  selector: '[appSpotlight]',
  host: { class: 'spotlight' },
})
export class SpotlightDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const element = this.host.nativeElement;
      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        element.style.setProperty('--my', `${event.clientY - rect.top}px`);
      };
      element.addEventListener('pointermove', onMove, { passive: true });
    });
  }
}
