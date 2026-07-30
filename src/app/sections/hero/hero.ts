import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { SITE_CONFIG } from '../../core/config/site.config';
import { MagneticDirective } from '../../core/directives/magnetic.directive';
import { ArchitectureGraph } from './architecture-graph/architecture-graph';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArchitectureGraph, MagneticDirective],
  template: `
    <section id="home" class="relative overflow-hidden border-b border-line">

      <div class="dot-grid"></div>
      <div
        class="pointer-events-none absolute -top-40 -right-30 size-[520px] blur-[6px]"
        style="background: radial-gradient(circle, var(--color-accent-soft), transparent 68%)"
        aria-hidden="true"
      ></div>

      <div
        class="section-container relative grid items-center gap-10 pt-20 pb-16 md:gap-14
               md:pt-22 md:pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
      >
        <div>
          <p
            class="mb-5 flex items-center gap-2.5 font-mono text-[13px] tracking-[.16em]
                   text-accent-text uppercase"
          >
            <span class="h-px w-6 bg-accent" aria-hidden="true"></span>
            {{ owner.role }}
          </p>

          <h1
            id="hero-heading"
            class="mb-5 text-[length:var(--text-hero)] leading-[.98] tracking-[-.03em]"
          >
            George<br />Panfil
          </h1>

          <p class="mb-8 max-w-[44ch] text-[clamp(16px,2.2vw,19px)] leading-relaxed text-muted">
            I build high-performance web systems for complex industrial environments — Angular
            frontends, .NET&nbsp;Core &amp; FastAPI backends. The graph is my dissertation
            project's real architecture.
            <span class="text-ink">Drag it. Hover a technology to see where I've shipped it.</span>
          </p>

          <div class="flex flex-wrap gap-3.5">
            <a
              appMagnetic
              [href]="owner.cvPath"
              [attr.download]="owner.cvFileName"
              class="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3.5
                     text-[15px] font-semibold text-on-accent"
              style="box-shadow: 0 12px 30px -12px var(--color-accent)"
            >
              Download CV →
            </a>
            <a
              appMagnetic
              href="#work"
              class="focus-ring inline-flex items-center gap-2 rounded-lg border border-line
                     px-5 py-3.5 text-[15px] font-semibold text-ink transition-colors
                     hover:border-accent"
            >
              Explore Syntx
            </a>
          </div>
        </div>

        <figure class="relative m-0">
          <app-architecture-graph />
        </figure>
      </div>
    </section>
  `,
})
export class Hero {
  protected readonly owner = SITE_CONFIG.owner;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      const section = this.host.nativeElement.querySelector('section');
      if (!section) {
        return;
      }

      section.addEventListener(
        'pointermove',
        (event: PointerEvent) => {
          const rect = section.getBoundingClientRect();
          section.style.setProperty('--gx', `${event.clientX - rect.left}px`);
          section.style.setProperty('--gy', `${event.clientY - rect.top}px`);
        },
        { passive: true },
      );
    });
  }
}
