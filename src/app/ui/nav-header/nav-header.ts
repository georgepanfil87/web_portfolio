import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SITE_CONFIG } from '../../core/config/site.config';
import { ThemeService } from '../../core/services/theme.service';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

@Component({
  selector: 'app-nav-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      data-progress-bar
      class="fixed inset-x-0 top-0 z-[120] h-0.5 origin-left bg-gradient-to-r
             from-accent to-accent-ink"
      style="transform: scaleX(0)"
      aria-hidden="true"
    ></div>

    <header
      class="sticky top-0 z-100 border-b border-line backdrop-blur-[14px]"
      style="background: color-mix(in oklab, var(--color-bg) 78%, transparent)"
    >
      <div class="section-container flex items-center justify-between gap-6 py-4">
        <a
          href="#home"
          class="focus-ring flex items-center gap-2.5 rounded font-mono text-[15px] font-semibold
                 text-ink"
        >
          <span
            class="pulse-dot size-2.5 rounded-full bg-accent"
            style="box-shadow: 0 0 12px var(--color-accent)"
            aria-hidden="true"
          ></span>
          george.panfil
        </a>

        <nav aria-label="Sections" class="hidden md:block">
          <ul class="flex items-center gap-6 text-sm font-medium">
            @for (item of navItems; track item.id) {
              <li>
                <a
                  [href]="'#' + item.id"
                  class="focus-ring rounded transition-colors hover:text-accent"
                  [class.text-ink]="active() === item.id"
                  [class.text-muted]="active() !== item.id"
                  [attr.aria-current]="active() === item.id ? 'true' : null"
                >
                  {{ item.label }}
                </a>
              </li>
            }
          </ul>
        </nav>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="focus-ring grid size-9.5 place-items-center rounded-[10px] border border-line
                   bg-panel text-[15px] text-ink transition-colors hover:border-accent"
            [attr.aria-label]="themeLabel()"
            [attr.aria-pressed]="theme.isDark()"
            (click)="theme.toggle()"
          >
            <span aria-hidden="true">{{ theme.isDark() ? '☾' : '☀' }}</span>
          </button>

          <a
            [href]="owner.cvPath"
            [attr.download]="owner.cvFileName"
            class="focus-ring hidden rounded-[10px] bg-accent px-4 py-2.5 text-sm font-semibold
                   text-on-accent sm:inline-flex"
            style="box-shadow: 0 8px 24px -10px var(--color-accent)"
          >
            Download CV
          </a>

          <button
            type="button"
            class="focus-ring grid size-9.5 place-items-center rounded-[10px] border border-line
                   bg-panel text-ink md:hidden"
            [attr.aria-expanded]="menuOpen()"
            aria-controls="mobile-nav"
            [attr.aria-label]="menuOpen() ? 'Close menu' : 'Open menu'"
            (click)="menuOpen.set(!menuOpen())"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              class="size-5"
            >
              @if (menuOpen()) {
                <path d="M6 6l12 12M18 6L6 18" />
              } @else {
                <path d="M4 7h16M4 12h16M4 17h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      @if (menuOpen()) {
        <nav id="mobile-nav" aria-label="Sections" class="border-t border-line bg-panel md:hidden">
          <ul class="section-container flex flex-col py-2">
            @for (item of navItems; track item.id) {
              <li>
                <a
                  [href]="'#' + item.id"
                  class="focus-ring block rounded px-1 py-3 text-sm"
                  [class.text-accent-text]="active() === item.id"
                  [class.text-muted]="active() !== item.id"
                  (click)="menuOpen.set(false)"
                >
                  {{ item.label }}
                </a>
              </li>
            }
            <li>
              <a
                [href]="owner.cvPath"
                [attr.download]="owner.cvFileName"
                class="focus-ring mt-2 mb-1 block rounded-[10px] bg-accent px-4 py-2.5 text-center
                       text-sm font-semibold text-on-accent sm:hidden"
                (click)="menuOpen.set(false)"
              >
                Download CV
              </a>
            </li>
          </ul>
        </nav>
      }
    </header>
  `,
})
export class NavHeader implements OnDestroy {
  protected readonly theme = inject(ThemeService);
  protected readonly owner = SITE_CONFIG.owner;
  protected readonly navItems = NAV_ITEMS;
  protected readonly menuOpen = signal(false);
  protected readonly active = signal<string>('');
  protected readonly themeLabel = computed(() =>
    this.theme.isDark() ? 'Switch to light theme' : 'Switch to dark theme',
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;
  private onScroll?: () => void;

  constructor() {
    afterNextRender(() => {
      this.trackScrollProgress();
      this.trackActiveSection();
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.onScroll) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  private trackScrollProgress(): void {
 
    const bar = this.host.nativeElement.querySelector<HTMLElement>('[data-progress-bar]');
    if (!bar) {
      return;
    }
    this.onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    };
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();
  }


  private trackActiveSection(): void {
    if (!this.isBrowser || !('IntersectionObserver' in window)) {
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.active.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const item of NAV_ITEMS) {
      const element = document.getElementById(item.id);
      if (element) {
        this.observer.observe(element);
      }
    }
  }
}
