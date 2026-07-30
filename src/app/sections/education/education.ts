import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/directives/reveal-on-scroll.directive';
import { SpotlightDirective } from '../../core/directives/spotlight.directive';
import { EDUCATION } from '../../data/cv-data';

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective, SpotlightDirective],
  template: `
    <section id="education" class="section-container section-padding scroll-mt-20">
      <div appReveal class="mb-10">
        <p
          class="mb-3.5 font-mono text-[12.5px] tracking-[.15em] text-accent-text uppercase"
          aria-hidden="true"
        >
          05 — Education
        </p>
        <h2 class="text-[length:var(--text-section)]">Dunărea de Jos University of Galați</h2>
      </div>

      <ul class="grid gap-5 md:grid-cols-2">
        @for (entry of entries; track entry.id; let i = $index) {
          <li
            appSpotlight
            [appReveal]="i * 100"
            class="rounded-xl border border-line bg-panel p-7"
            style="--spot-r: 220px"
          >
            <p class="mb-3 font-mono text-xs tracking-[.1em] text-accent-text">{{ entry.period }}</p>
            <h3 class="mb-2.5 text-[21px] leading-snug">{{ entry.degree }} — {{ entry.field }}</h3>

            @if (entry.thesis) {
              <p class="text-[14.5px] leading-relaxed text-muted">
                {{ entry.thesis.label }}:
                <span class="text-ink">{{ entry.thesis.shortName }}</span>
                @if (entry.thesis.titleUnknown) {
                  <span
                    class="ml-1 inline-block rounded-md border border-dashed border-line px-1.75
                           py-0.5 font-mono text-xs text-accent-ink"
                  >
                    registered title — TODO
                  </span>
                } @else {
                  — {{ entry.thesis.description }}
                }
              </p>
            }
          </li>
        }
      </ul>
    </section>
  `,
})
export class Education {
  protected readonly entries = EDUCATION;
}
