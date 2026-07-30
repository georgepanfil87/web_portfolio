import { Injectable, computed, signal } from '@angular/core';
import { TECH_USAGE } from '../../data/tech-usage';

@Injectable({ providedIn: 'root' })
export class TechFocusService {
  private readonly focused = signal<string | null>(null);
  private readonly pinned = signal(false);

  readonly focus = this.focused.asReadonly();
  readonly isPinned = this.pinned.asReadonly();

  private readonly litEntities = computed(() => {
    const tech = this.focused();
    return tech ? new Set(TECH_USAGE[tech] ?? []) : new Set<string>();
  });

  enter(tech: string | null): void {
    if (tech && !this.pinned()) {
      this.focused.set(tech);
    }
  }

  leave(): void {
    if (!this.pinned()) {
      this.focused.set(null);
    }
  }

  toggle(tech: string): void {
    if (this.pinned() && this.focused() === tech) {
      this.pinned.set(false);
      this.focused.set(null);
      return;
    }
    this.pinned.set(true);
    this.focused.set(tech);
  }

  clear(): void {
    this.pinned.set(false);
    this.focused.set(null);
  }

  isLit(entityId: string): boolean {
    return this.litEntities().has(entityId);
  }

  isFocused(tech: string | null): boolean {
    return tech !== null && this.focused() === tech;
  }
}
