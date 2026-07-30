import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/directives/reveal-on-scroll.directive';
import { SpotlightDirective } from '../../core/directives/spotlight.directive';
import { ProjectsService } from '../../core/services/projects.service';
import { TechFocusService } from '../../core/services/tech-focus.service';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective, SpotlightDirective],
  template: `
    <section id="work" class="section-container section-padding scroll-mt-20">
      <div appReveal class="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p
            class="mb-3.5 font-mono text-[12.5px] tracking-[.15em] text-accent-text uppercase"
            aria-hidden="true"
          >
            03 — Selected work
          </p>
          <h2 class="text-[length:var(--text-section)]">Projects</h2>
        </div>

        <div class="flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">
          <button
            type="button"
            class="focus-ring rounded-[9px] border px-3.5 py-1.5 font-mono text-[12.5px] font-semibold
                   transition-colors"
            [class.border-accent]="!projects.activeTag()"
            [class.bg-accent]="!projects.activeTag()"
            [class.text-on-accent]="!projects.activeTag()"
            [class.border-line]="projects.activeTag()"
            [class.text-muted]="projects.activeTag()"
            [attr.aria-pressed]="!projects.activeTag()"
            (click)="projects.selectTag(null)"
          >
            All
          </button>
          @for (tag of projects.tags(); track tag) {
            <button
              type="button"
              class="focus-ring rounded-[9px] border px-3.5 py-1.5 font-mono text-[12.5px]
                     font-semibold transition-colors"
              [class.border-accent]="projects.activeTag() === tag"
              [class.bg-accent]="projects.activeTag() === tag"
              [class.text-on-accent]="projects.activeTag() === tag"
              [class.border-line]="projects.activeTag() !== tag"
              [class.text-muted]="projects.activeTag() !== tag"
              [attr.aria-pressed]="projects.activeTag() === tag"
              (click)="projects.selectTag(tag)"
            >
              {{ tag }}
            </button>
          }
        </div>
      </div>

      @if (projects.status() === 'fallback') {
        <p class="mb-5 flex items-center gap-2 font-mono text-[12.5px] text-muted" role="status">
          <span class="size-1.75 rounded-full bg-muted" aria-hidden="true"></span>
          GitHub unreachable — rate limit or no connection — showing the local list
        </p>
      } @else if (projects.usingStaleCache()) {
        <p class="mb-5 flex items-center gap-2 font-mono text-[12.5px] text-muted" role="status">
          <span class="size-1.75 rounded-full bg-muted" aria-hidden="true"></span>
          cached GitHub data · the live request did not go through
        </p>
      } @else {
        <p class="mb-5 flex items-center gap-2 font-mono text-[12.5px] text-muted">
          <span class="pulse-dot size-1.75 rounded-full bg-accent" aria-hidden="true"></span>
          live from the GitHub API · cached 6h
        </p>
      }

      @let featured = projects.featured();
      @let others = projects.others();

      @if (!featured.length && !others.length) {
        <p class="rounded-2xl border border-line bg-panel p-8 text-center text-muted">
          Nothing tagged <span class="text-ink">{{ projects.activeTag() }}</span> yet.
        </p>
      }

      <div class="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        @for (project of featured; track project.id) {
          <article
            appSpotlight
            appReveal
            class="flex min-h-[340px] flex-col rounded-2xl border border-line
                   bg-gradient-to-br from-panel to-bg p-7 sm:p-8"
            style="--spot-r: 340px"
          >
            <div class="lit-ring" [attr.data-lit]="techFocus.isLit(project.id)"></div>

            <p
              class="mb-4 w-fit rounded-full bg-accent px-2.5 py-1 font-mono text-[11.5px]
                     font-semibold tracking-[.1em] text-on-accent uppercase"
            >
              Dissertation · flagship
            </p>

            <h3 class="mb-3 text-[34px] leading-tight">
              <a
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="focus-ring rounded text-ink hover:text-accent"
              >
                {{ project.title }}
              </a>
            </h3>

            <p class="mb-5 max-w-[60ch] text-base leading-relaxed text-muted">
              {{ project.description }}
            </p>

            @if (project.details.length) {
              <ul class="mb-5 flex flex-wrap gap-1.75">
                @for (detail of project.details; track detail) {
                  <li
                    class="rounded-[7px] border border-line bg-panel px-2.25 py-1 font-mono
                           text-[11.5px] text-muted"
                  >
                    {{ detail }}
                  </li>
                }
              </ul>
            }

            <div class="mt-auto flex flex-wrap items-center gap-4">
              <ul class="flex flex-wrap gap-1.5">
                @for (tag of project.tags; track tag) {
                  <li class="text-xs text-accent-ink">#{{ tag }}</li>
                }
              </ul>
              <a
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="focus-ring ml-auto rounded text-sm font-semibold"
              >
                View repo ↗
              </a>
            </div>
          </article>
        }

        @for (project of others; track project.id; let i = $index) {
          <article
            appSpotlight
            [appReveal]="100 + i * 60"
            class="flex flex-col rounded-2xl border border-line bg-panel p-7"
            style="--spot-r: 240px"
          >
            <div class="lit-ring" [attr.data-lit]="techFocus.isLit(project.id)"></div>

            <p class="mb-3.5 font-mono text-[12.5px] text-muted">~/ repos</p>

            <h3 class="mb-3 text-2xl tracking-[-.01em]">
              <a
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="focus-ring rounded text-ink hover:text-accent"
              >
                {{ project.title }}
              </a>
            </h3>

            <p class="mb-5 text-[15px] leading-relaxed text-muted">{{ project.description }}</p>

            <div class="mt-auto flex flex-wrap items-center gap-3">
              <ul class="flex flex-wrap gap-1.5">
                @for (tag of project.tags; track tag) {
                  <li class="text-xs text-accent-ink">#{{ tag }}</li>
                }
              </ul>
              <a
                [href]="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="focus-ring ml-auto rounded text-sm font-semibold"
              >
                Repo ↗
              </a>
            </div>
          </article>
        }
      </div>

      <p class="mt-4.5 text-[13px] text-muted">
        More repositories publish here automatically as they go public.
      </p>
    </section>
  `,
})
export class Projects {
  protected readonly projects = inject(ProjectsService);
  protected readonly techFocus = inject(TechFocusService);
}
