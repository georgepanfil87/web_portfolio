import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/directives/reveal-on-scroll.directive';
import { SpotlightDirective } from '../../core/directives/spotlight.directive';
import { CAREER_SUMMARY } from '../../data/cv-data';

const METRICS = [
  { value: '25%', label: 'faster MES API responses' },
  { value: '30%', label: 'quicker task transitions' },
  { value: '65%', label: 'faster drawing retrieval' },
  { value: '100+', label: 'technicians served' },
] as const;

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective, SpotlightDirective],
  template: `
    <section id="about" class="section-container section-padding scroll-mt-20">
      <div
        appReveal
        class="grid items-start gap-10 md:gap-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]"
      >
        <div>
          <p
            class="mb-4 font-mono text-[12.5px] tracking-[.15em] text-accent-text uppercase"
            aria-hidden="true"
          >
            01 — About
          </p>
          <h2 class="text-[length:var(--text-section)] leading-[1.05]">
            Two years shipping systems that had to be fast, and stay fast.
          </h2>
        </div>
        <div>
          <p class="mb-5 text-lg leading-relaxed text-ink">{{ summary[0] }}</p>
          <p class="text-[17px] leading-relaxed text-muted">{{ summary[1] }}</p>
        </div>
      </div>

      <ul
        appReveal="120"
        class="mt-14 grid grid-cols-2 gap-4 md:gap-4.5 lg:grid-cols-4"
      >
        @for (metric of metrics; track metric.label) {
          <li
            appSpotlight
            class="rounded-xl border border-line bg-panel px-5 py-6"
            style="--spot-r: 180px"
          >
            <p class="text-[length:var(--text-metric)] font-semibold tracking-[-.02em] text-ink">
              {{ metric.value }}
            </p>
            <p class="mt-1.5 text-[13.5px] leading-snug text-muted">{{ metric.label }}</p>
          </li>
        }
      </ul>
    </section>
  `,
})
export class About {
  protected readonly summary = CAREER_SUMMARY;
  protected readonly metrics = METRICS;
}
