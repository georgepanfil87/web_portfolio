import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/directives/reveal-on-scroll.directive';
import { SpotlightDirective } from '../../core/directives/spotlight.directive';
import { TechFocusService } from '../../core/services/tech-focus.service';
import { SKILL_CATEGORIES } from '../../data/skills-data';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective, SpotlightDirective],
  template: `
    <section id="skills" class="scroll-mt-20 border-y border-line bg-panel">
      <div class="section-container section-padding">
        <div appReveal class="mb-10">
          <p
            class="mb-3.5 font-mono text-[12.5px] tracking-[.15em] text-accent-text uppercase"
            aria-hidden="true"
          >
            02 — Skills
          </p>
          <h2 class="text-[length:var(--text-section)]">The stack, end to end.</h2>
          <p class="mt-3 text-[15px] text-muted">
            Chips marked <span class="text-accent-text" aria-hidden="true">●</span> appear in the
            architecture graph — hover one to trace it there.
          </p>
        </div>

        <ul class="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          @for (category of categories; track category.id; let i = $index) {
            <li
              appSpotlight
              [appReveal]="i * 60"
              class="rounded-xl border border-line bg-bg p-6"
            >
              <p class="mb-4 font-mono text-xs tracking-[.12em] text-muted uppercase">
                {{ category.label }}
              </p>
              <ul class="flex flex-wrap gap-2">
                @for (skill of category.skills; track skill.label) {
                  <li>
                    @if (skill.tech) {
                      <button
                        type="button"
                        class="focus-ring inline-flex items-center gap-1.5 rounded-lg border px-2.5
                               py-1.5 font-mono text-xs transition-colors"
                        [class.border-accent]="techFocus.isFocused(skill.tech)"
                        [class.bg-accent-soft]="techFocus.isFocused(skill.tech)"
                        [class.text-accent-ink]="techFocus.isFocused(skill.tech)"
                        [class.border-line]="!techFocus.isFocused(skill.tech)"
                        [class.text-ink]="!techFocus.isFocused(skill.tech)"
                        [attr.aria-pressed]="techFocus.isFocused(skill.tech)"
                        (pointerenter)="techFocus.enter(skill.tech)"
                        (pointerleave)="techFocus.leave()"
                        (focus)="techFocus.enter(skill.tech)"
                        (blur)="techFocus.leave()"
                        (click)="techFocus.toggle(skill.tech)"
                      >
                        <span aria-hidden="true">●</span>{{ skill.label }}
                      </button>
                    } @else {
                      <span
                        class="inline-flex items-center rounded-lg border border-line px-2.5 py-1.5
                               font-mono text-xs text-ink"
                      >
                        {{ skill.label }}
                      </span>
                    }
                  </li>
                }
              </ul>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class Skills {
  protected readonly techFocus = inject(TechFocusService);
  protected readonly categories = SKILL_CATEGORIES;
}
