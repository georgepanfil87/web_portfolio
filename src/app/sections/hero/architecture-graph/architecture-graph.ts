import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ARCH_DESCRIPTION,
  ARCH_EDGES,
  ARCH_FAINT_EDGES,
  ARCH_LAYERS,
  ARCH_NODES,
  VIEWBOX,
} from '../../../data/architecture';
import { TechFocusService } from '../../../core/services/tech-focus.service';

interface GraphNode {
  id: string;
  label: string;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  w: number;
}

const SPRING_K = 0.14;
const DAMPING = 0.8;
const SETTLE_EPSILON = 0.35;
const NODE_HEIGHT = 32;
const KEY_STEP = 10;

function nodeWidth(label: string): number {
  return Math.max(80, label.length * 8.1 + 26);
}

@Component({
  selector: 'app-architecture-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-panel to-bg"
      style="box-shadow: var(--shadow-panel)"
    >
      <div
        class="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5 font-mono
               text-[12.5px]"
      >
        <span class="flex items-center gap-2 text-muted">
          <span class="size-2 rounded-full bg-accent" aria-hidden="true"></span>
          syntx · system architecture
        </span>
        <span class="rounded-full border border-line px-2.5 py-0.5 text-muted">docker-compose</span>
      </div>

      <div class="hidden px-2.5 pt-2.5 pb-1 md:block">
        <svg
          #svg
          [attr.viewBox]="'0 0 ' + viewBox.width + ' ' + viewBox.height"
          width="100%"
          role="img"
          [attr.aria-label]="'Interactive architecture diagram of Syntx'"
          class="block max-h-[440px] touch-none"
        >
          <rect
            x="12"
            y="18"
            [attr.width]="viewBox.width - 24"
            [attr.height]="viewBox.height - 36"
            rx="18"
            fill="transparent"
            stroke="var(--color-line)"
            stroke-dasharray="2 7"
          />
          <text
            x="26"
            y="38"
            fill="var(--color-muted)"
            class="font-mono"
            style="font-size:10.5px;letter-spacing:.08em"
          >
            docker-compose network
          </text>

          @for (layer of layers; track layer.label) {
            <text
              x="26"
              [attr.y]="layer.y"
              fill="var(--color-muted)"
              class="font-mono"
              style="font-size:9.5px;letter-spacing:.14em"
              opacity="0.6"
            >
              {{ layer.label }}
            </text>
          }

          @for (edge of faintEdges(); track $index) {
            <path
              [attr.d]="edge.d"
              fill="none"
              stroke="var(--color-line)"
              stroke-width="1"
              stroke-dasharray="2 6"
              [attr.opacity]="focus() ? 0.2 : 0.45"
            />
          }

          @for (edge of edges(); track edge.from + edge.to) {
            <path
              [attr.d]="edge.d"
              fill="none"
              [attr.stroke]="edge.lit ? 'var(--color-accent)' : 'var(--color-line)'"
              [attr.stroke-width]="edge.lit ? 2 : 1.4"
              [attr.opacity]="focus() && !edge.lit ? 0.18 : 0.85"
              class="transition-[stroke,opacity] duration-200"
            />
          }

          @let active = activeEdge();
          @if (active) {
            <text
              [attr.x]="active.midX"
              [attr.y]="active.midY"
              text-anchor="middle"
              fill="var(--color-accent-ink)"
              class="font-mono"
              style="font-size:10px;paint-order:stroke;stroke:var(--color-bg);stroke-width:4px;stroke-linejoin:round"
            >
              {{ active.label }}
            </text>
          }

          @for (node of nodes(); track node.id) {
            <g
              [attr.transform]="'translate(' + node.x + ',' + node.y + ')'"
              tabindex="0"
              role="button"
              [attr.aria-label]="
                node.label + ' node — drag to move, Enter to pin the highlight'
              "
              [attr.aria-pressed]="techFocus.isPinned() && focus() === node.id"
              [attr.opacity]="focus() && focus() !== node.id ? 0.35 : 1"
              class="cursor-grab outline-none transition-opacity duration-200"
              (pointerdown)="onPointerDown($event, node)"
              (pointermove)="onPointerMove($event)"
              (pointerup)="onPointerUp()"
              (pointercancel)="onPointerUp()"
              (pointerenter)="techFocus.enter(node.id)"
              (pointerleave)="techFocus.leave()"
              (click)="techFocus.toggle(node.id)"
              (keydown)="onKeydown($event, node)"
              (focus)="onNodeFocus(node)"
              (blur)="onNodeBlur()"
            >
              @if (keyboardFocus() === node.id) {
                <rect
                  [attr.x]="-node.w / 2 - 4"
                  [attr.y]="-nodeHeight / 2 - 4"
                  [attr.width]="node.w + 8"
                  [attr.height]="nodeHeight + 8"
                  rx="12"
                  fill="none"
                  stroke="var(--color-ring)"
                  stroke-width="2"
                />
              }
              <rect
                [attr.x]="-node.w / 2"
                [attr.y]="-nodeHeight / 2"
                [attr.width]="node.w"
                [attr.height]="nodeHeight"
                rx="9"
                [attr.fill]="focus() === node.id ? 'var(--color-accent)' : 'var(--color-panel2)'"
                [attr.stroke]="focus() === node.id ? 'var(--color-accent)' : 'var(--color-line)'"
                stroke-width="1.2"
                class="transition-[fill,stroke] duration-200"
              />
              <text
                x="0"
                y="1"
                text-anchor="middle"
                dominant-baseline="middle"
                [attr.fill]="focus() === node.id ? 'var(--color-on-accent)' : 'var(--color-ink)'"
                class="pointer-events-none font-mono font-semibold transition-[fill] duration-200"
                style="font-size:12.5px"
              >
                {{ node.label }}
              </text>
            </g>
          }
        </svg>
      </div>

      <div class="px-4 py-4 md:hidden" aria-hidden="true">
        @for (layer of compactLayers; track layer.label) {
          <div class="mb-3 last:mb-0">
            <p class="mb-1.5 font-mono text-[9.5px] tracking-[.14em] text-muted opacity-60">
              {{ layer.label }}
            </p>
            <div class="flex flex-wrap gap-1.5">
              @for (node of layer.nodes; track node.id) {
                <button
                  type="button"
                  class="focus-ring rounded-md border px-2 py-1 font-mono text-[11.5px] transition-colors"
                  [class.border-accent]="focus() === node.id"
                  [class.bg-accent]="focus() === node.id"
                  [class.text-on-accent]="focus() === node.id"
                  [class.border-line]="focus() !== node.id"
                  [class.text-ink]="focus() !== node.id"
                  (click)="techFocus.toggle(node.id)"
                >
                  {{ node.label }}
                </button>
              }
            </div>
          </div>
        }
      </div>

      <div
        class="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3.5 text-[12.5px]
               text-muted"
      >
        <span class="font-mono text-accent" aria-hidden="true">↹</span>
        <span class="hidden md:inline">Drag nodes · hover to trace a technology · click to pin</span>
        <span class="md:hidden">Tap a technology to trace where it shipped</span>
      </div>
    </div>

    <p class="sr-only">{{ description }}</p>
  `,
})
export class ArchitectureGraph implements OnDestroy {
  protected readonly techFocus = inject(TechFocusService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly svgRef = viewChild<ElementRef<SVGSVGElement>>('svg');

  protected readonly viewBox = VIEWBOX;
  protected readonly layers = ARCH_LAYERS;
  protected readonly nodeHeight = NODE_HEIGHT;
  protected readonly description = ARCH_DESCRIPTION;

  protected readonly focus = this.techFocus.focus;
  protected readonly keyboardFocus = signal<string | null>(null);

  private readonly sim: GraphNode[] = ARCH_NODES.map((spec) => ({
    id: spec.id,
    label: spec.label,
    homeX: spec.x,
    homeY: spec.y,
    x: spec.x,
    y: spec.y,
    w: nodeWidth(spec.label),
  }));

  private readonly velocities = new Map<string, { vx: number; vy: number }>(
    ARCH_NODES.map((spec) => [spec.id, { vx: 0, vy: 0 }]),
  );

  protected readonly nodes = signal<GraphNode[]>(this.sim.map((node) => ({ ...node })));

  private readonly nodeById = computed(() => {
    const index: Record<string, GraphNode> = {};
    for (const node of this.nodes()) {
      index[node.id] = node;
    }
    return index;
  });

  protected readonly edges = computed(() => {
    const index = this.nodeById();
    const focused = this.focus();
    return ARCH_EDGES.map((edge) => ({
      from: edge.from,
      to: edge.to,
      label: edge.label,
      d: curve(index[edge.from], index[edge.to]),
      lit: focused !== null && (edge.from === focused || edge.to === focused),
    }));
  });

  protected readonly faintEdges = computed(() => {
    const index = this.nodeById();
    return ARCH_FAINT_EDGES.map((edge) => ({
      d: curve(index[edge.from], index[edge.to]),
    }));
  });

  protected readonly activeEdge = computed(() => {
    const focused = this.focus();
    if (!focused) {
      return null;
    }
    const index = this.nodeById();
    const edge = ARCH_EDGES.find((e) => e.from === focused || e.to === focused);
    if (!edge) {
      return null;
    }
    const a = index[edge.from];
    const b = index[edge.to];
    return { label: edge.label, midX: (a.x + b.x) / 2, midY: (a.y + b.y) / 2 };
  });

  protected readonly compactLayers = ARCH_LAYERS.map((layer, i) => {
    const next = ARCH_LAYERS[i + 1];
    const upper = next ? next.y : Number.MAX_SAFE_INTEGER;
    return {
      label: layer.label,
      nodes: ARCH_NODES.filter((node) => node.y > layer.y && node.y < upper),
    };
  });

  private dragging: GraphNode | null = null;
  private dragOffset = { x: 0, y: 0 };
  private frame: number | null = null;

  ngOnDestroy(): void {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame);
    }
  }

  private get reducedMotion(): boolean {
    return this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  protected onPointerDown(event: PointerEvent, node: GraphNode): void {
    if (this.reducedMotion) {
      return;
    }
    const target = event.currentTarget as SVGGElement;
    try {
      target.setPointerCapture(event.pointerId);
    } catch {
    }
    const simNode = this.sim.find((n) => n.id === node.id);
    if (!simNode) {
      return;
    }
    this.dragging = simNode;
    this.velocities.set(node.id, { vx: 0, vy: 0 });
    const point = this.toSvgSpace(event.clientX, event.clientY);
    this.dragOffset = { x: simNode.x - point.x, y: simNode.y - point.y };
    this.techFocus.enter(node.id);
    event.stopPropagation();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.dragging) {
      return;
    }
    const point = this.toSvgSpace(event.clientX, event.clientY);
    this.dragging.x = point.x + this.dragOffset.x;
    this.dragging.y = point.y + this.dragOffset.y;
    this.publish();
  }

  protected onPointerUp(): void {
    if (!this.dragging) {
      return;
    }
    this.dragging = null;
    this.startLoop();
  }

  protected onKeydown(event: KeyboardEvent, node: GraphNode): void {
    const simNode = this.sim.find((n) => n.id === node.id);
    if (!simNode) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        simNode.x -= KEY_STEP;
        break;
      case 'ArrowRight':
        simNode.x += KEY_STEP;
        break;
      case 'ArrowUp':
        simNode.y -= KEY_STEP;
        break;
      case 'ArrowDown':
        simNode.y += KEY_STEP;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.techFocus.toggle(node.id);
        return;
      case 'Escape':
        this.techFocus.clear();
        return;
      default:
        return;
    }

    event.preventDefault();
    this.publish();
    this.startLoop();
  }

  protected onNodeFocus(node: GraphNode): void {
    this.keyboardFocus.set(node.id);
    this.techFocus.enter(node.id);
  }

  protected onNodeBlur(): void {
    this.keyboardFocus.set(null);
    this.techFocus.leave();
  }

  /** Client coordinates → SVG user space, so drags track the pointer exactly. */
  private toSvgSpace(clientX: number, clientY: number): { x: number; y: number } {
    const svg = this.svgRef()?.nativeElement;
    if (!svg) {
      return { x: 0, y: 0 };
    }
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * VIEWBOX.width,
      y: ((clientY - rect.top) / rect.height) * VIEWBOX.height,
    };
  }

  private publish(): void {
    this.nodes.set(this.sim.map((node) => ({ ...node })));
  }

  private startLoop(): void {
    if (this.frame !== null || !this.isBrowser) {
      return;
    }
    if (this.reducedMotion) {
      this.snapHome();
      return;
    }
    this.frame = requestAnimationFrame(this.step);
  }

  private readonly step = (): void => {
    let moving = false;

    for (const node of this.sim) {
      if (node === this.dragging) {
        continue;
      }
      const velocity = this.velocities.get(node.id);
      if (!velocity) {
        continue;
      }
      const dx = node.homeX - node.x;
      const dy = node.homeY - node.y;
      velocity.vx = (velocity.vx + dx * SPRING_K) * DAMPING;
      velocity.vy = (velocity.vy + dy * SPRING_K) * DAMPING;
      node.x += velocity.vx;
      node.y += velocity.vy;

      if (
        Math.abs(velocity.vx) + Math.abs(velocity.vy) + Math.abs(dx) + Math.abs(dy) >
        SETTLE_EPSILON
      ) {
        moving = true;
      }
    }

    this.publish();

    if (moving || this.dragging) {
      this.frame = requestAnimationFrame(this.step);
    } else {
      this.frame = null;
      this.snapHome();
    }
  };

  private snapHome(): void {
    for (const node of this.sim) {
      node.x = node.homeX;
      node.y = node.homeY;
      this.velocities.set(node.id, { vx: 0, vy: 0 });
    }
    this.publish();
  }
}

function curve(a: GraphNode, b: GraphNode): string {
  const midY = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
}
