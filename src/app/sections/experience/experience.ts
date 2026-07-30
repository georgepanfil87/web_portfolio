import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/directives/reveal-on-scroll.directive';
import { TechFocusService } from '../../core/services/tech-focus.service';
import { EXPERIENCE } from '../../data/cv-data';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective],
  template: `
    <section id="experience" class="scroll-mt-20 border-t border-line bg-panel">
      <div class="section-container section-padding">
        <div appReveal class="mb-10">
          <p
            class="mb-3.5 font-mono text-[12.5px] tracking-[.15em] text-accent-text uppercase"
            aria-hidden="true"
          >
            04 — Experience
          </p>
          <h2 class="text-[length:var(--text-section)]">Where I've worked</h2>
          <p class="mt-3 text-[15px] text-muted">
            Click a role to expand. Hovering a graph technology lights the roles that used it.
          </p>
        </div>

        <div class="flex flex-col gap-3.5">
          @for (role of roles; track role.id; let i = $index) {
            <article
              [appReveal]="i * 80"
              class="relative overflow-hidden rounded-xl border border-line bg-bg"
            >
              <div class="lit-ring" [attr.data-lit]="techFocus.isLit(role.id)"></div>

              <h3>
                <button
                  type="button"
                  class="focus-ring relative flex w-full items-start gap-5 p-6 text-left"
                  [attr.aria-expanded]="isOpen(role.id)"
                  [attr.aria-controls]="role.id + '-panel'"
                  (click)="toggle(role.id)"
                >
                  <span class="min-w-0 flex-1">
                    <span class="flex flex-wrap items-baseline gap-3">
                      <span class="font-display text-xl font-semibold text-ink">{{ role.role }}</span>
                      <span class="text-[15px] text-accent-ink">
                        {{ role.company }}@if (role.location) { · {{ role.location }} }
                      </span>
                    </span>
                    <span class="mt-1.5 block font-mono text-[12.5px] text-muted">
                      {{ role.period }}
                    </span>
                    @if (role.tech.length) {
                      <span class="mt-3 flex flex-wrap gap-1.5">
                        @for (tech of role.tech; track tech) {
                          <span
                            class="rounded-md border border-line px-2 py-0.5 font-mono text-[11px]
                                   text-muted"
                          >
                            {{ tech }}
                          </span>
                        }
                      </span>
                    }
                  </span>

                  <span
                    class="shrink-0 text-xl text-muted transition-transform duration-250"
                    [class.rotate-45]="isOpen(role.id)"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </h3>

              <div
                [id]="role.id + '-panel'"
                class="relative grid transition-[grid-template-rows] duration-350 ease-out"
                [style.grid-template-rows]="isOpen(role.id) ? '1fr' : '0fr'"
                [attr.inert]="isOpen(role.id) ? null : ''"
              >
                <div class="overflow-hidden">
                  <ul class="m-0 flex flex-col gap-3 px-6 pt-0 pb-6 sm:pl-11">
                    @for (project of role.projects; track project.name) {
                      <li class="text-[14.5px] leading-relaxed text-muted">
                        <span class="text-ink">{{ project.name }}</span> —
                        {{ project.points.join(' ') }}
                      </li>
                    }
                  </ul>
                </div>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class Experience {
  protected readonly techFocus = inject(TechFocusService);
  protected readonly roles = EXPERIENCE;
  private readonly openIds = signal<ReadonlySet<string>>(new Set());

  protected isOpen(id: string): boolean {
    return this.openIds().has(id);
  }

  protected toggle(id: string): void {
    this.openIds.update((current) => {
      const next = new Set(current);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  }
}
