import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SITE_CONFIG } from '../../core/config/site.config';
import { RevealOnScrollDirective } from '../../core/directives/reveal-on-scroll.directive';
import { ClipboardService } from '../../core/services/clipboard.service';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealOnScrollDirective],
  template: `
    <section
      id="contact"
      class="scroll-mt-20 border-t border-line bg-gradient-to-b from-panel to-bg"
    >
      <div class="section-container section-padding">
        <div appReveal class="mx-auto max-w-[640px] text-center">
          <p
            class="mb-4.5 font-mono text-[12.5px] tracking-[.15em] text-accent-text uppercase"
            aria-hidden="true"
          >
            06 — Contact
          </p>
          <h2 class="mb-4.5 text-[length:var(--text-contact)] leading-[1.02]">
            Let's build something fast.
          </h2>
          <p class="mb-9 text-[17px] text-muted">
            Open to full-stack roles. The quickest way to reach me is email.
          </p>

          <div class="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              class="focus-ring inline-flex items-center gap-2.5 rounded-lg bg-accent px-5 py-3.5
                     text-[15px] font-semibold break-all text-on-accent"
              style="box-shadow: 0 12px 30px -12px var(--color-accent)"
              (click)="copyEmail()"
            >
              @if (justCopied()) {
                <span aria-hidden="true">✓</span> Copied to clipboard
              } @else {
                {{ owner.email }}
              }
            </button>

            <a
              [href]="owner.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="focus-ring inline-flex items-center gap-2 rounded-lg border border-line px-5
                     py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-accent"
            >
              GitHub ↗
            </a>

            @if (owner.linkedinUrl) {
              <a
                [href]="owner.linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="focus-ring inline-flex items-center gap-2 rounded-lg border border-line px-5
                       py-3.5 text-[15px] font-semibold text-ink transition-colors
                       hover:border-accent"
              >
                LinkedIn ↗
              </a>
            }

            <a
              [href]="owner.cvPath"
              [attr.download]="owner.cvFileName"
              class="focus-ring inline-flex items-center gap-2 rounded-lg border border-line px-5
                     py-3.5 text-[15px] font-semibold text-ink transition-colors hover:border-accent"
            >
              Download CV
            </a>
          </div>

          <span aria-live="polite" class="sr-only">
            {{ justCopied() ? 'Email address copied to clipboard' : '' }}
          </span>
        </div>
      </div>
    </section>
  `,
})
export class Contact {
  private readonly clipboard = inject(ClipboardService);
  protected readonly owner = SITE_CONFIG.owner;
  protected readonly justCopied = computed(
    () => this.clipboard.lastCopied() === SITE_CONFIG.owner.email,
  );

  protected copyEmail(): void {
    void this.clipboard.copy(this.owner.email);
  }
}
