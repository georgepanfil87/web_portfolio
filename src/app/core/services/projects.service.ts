import { Injectable, computed, inject, signal } from '@angular/core';
import { SITE_CONFIG } from '../config/site.config';
import { GithubRepo, Project, ProjectOverride, ProjectsStatus } from '../models/project.model';
import { PROJECTS_FALLBACK } from '../../data/projects-fallback';
import overridesJson from '../../data/projects-overrides.json';
import { GithubService, RepoFetchResult } from './github.service';

const TAG_LABELS: Record<string, string> = {
  angular: 'Angular',
  ngrx: 'NgRx',
  rxjs: 'RxJS',
  tailwindcss: 'Tailwind CSS',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  react: 'React',
  fastapi: 'FastAPI',
  python: 'Python',
  dotnet: '.NET',
  'dotnet-core': '.NET',
  aspnetcore: '.NET',
  csharp: 'C#',
  postgresql: 'PostgreSQL',
  postgres: 'PostgreSQL',
  pgvector: 'pgvector',
  ollama: 'AI/LLM',
  llm: 'AI/LLM',
  rag: 'RAG',
  docker: 'Docker',
  'monaco-editor': 'Monaco',
  sqlserver: 'SQL Server',
  jwt: 'JWT',
};

const LANGUAGE_EXTRA_TAGS: Record<string, string[]> = {
  'C#': ['.NET'],
};

function readOverrides(): Record<string, ProjectOverride> {
  const source = overridesJson as unknown as Record<string, unknown>;
  const result: Record<string, ProjectOverride> = {};
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith('_') || typeof value !== 'object' || value === null) {
      continue;
    }
    result[key] = value as ProjectOverride;
  }
  return result;
}

const OVERRIDES = readOverrides();

function prettifyTag(topic: string): string {
  return TAG_LABELS[topic] ?? topic.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const CONTROL_TOPICS = new Set<string>(Object.values(SITE_CONFIG.github.controlTopics));

/**
 * Card images, most-preferred first.
 *
 * 1. An image committed in the repo — yours, versioned, and served from a CDN
 *    that does not rate-limit the way the card renderer does.
 * 2. GitHub's generated social preview.
 *
 * The generated card uses a fixed `/1/` segment on purpose. Deriving it from
 * `pushed_at` changed the URL on every push, forcing GitHub to re-render the
 * card each time and making 429s likely — which is what made images vanish.
 */
function imageCandidates(repo: GithubRepo): string[] {
  const owner = SITE_CONFIG.github.username;
  const { previewImagePath } = SITE_CONFIG.github;
  return [
    `https://raw.githubusercontent.com/${owner}/${repo.name}/HEAD/${previewImagePath}`,
    `https://opengraph.githubassets.com/1/${owner}/${repo.name}`,
  ];
}

function deriveTags(repo: GithubRepo, override?: ProjectOverride): string[] {
  if (override?.tags?.length) {
    return override.tags;
  }
  // Control topics steer the layout; they are not technologies.
  const fromTopics = (repo.topics ?? [])
    .filter((topic) => !CONTROL_TOPICS.has(topic))
    .map(prettifyTag);
  const fromLanguage = repo.language
    ? [repo.language, ...(LANGUAGE_EXTRA_TAGS[repo.language] ?? [])]
    : [];
  const merged = [...fromTopics, ...fromLanguage];
  return [...new Set(merged)];
}

function toProject(repo: GithubRepo): Project | null {
  const override = OVERRIDES[repo.name];
  const topics = repo.topics ?? [];
  const { featured: featuredTopic, hidden: hiddenTopic } = SITE_CONFIG.github.controlTopics;

  if (
    override?.hidden ||
    topics.includes(hiddenTopic) ||
    SITE_CONFIG.github.exclude.includes(repo.name)
  ) {
    return null;
  }
  if (repo.fork) {
    return null;
  }

  return {
    id: repo.name,
    title: override?.title ?? repo.name,

    description: override?.description ?? repo.description ?? '',
    tags: deriveTags(repo, override),
    details: override?.details ?? [],
    language: repo.language,
    stars: repo.stargazers_count ?? 0,
    forks: repo.forks_count ?? repo.forks ?? 0,
    repoUrl: repo.html_url,
    liveUrl: override?.liveUrl ?? (repo.homepage?.trim() ? repo.homepage : null),
    imageCandidates: imageCandidates(repo),
    lastPush: repo.pushed_at ?? null,
    featured: override?.featured ?? topics.includes(featuredTopic),
    source: 'github',
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    const orderA = OVERRIDES[a.id]?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = OVERRIDES[b.id]?.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (b.lastPush ?? '').localeCompare(a.lastPush ?? '');
  });
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly github = inject(GithubService);

  private readonly all = signal<Project[]>(sortProjects(PROJECTS_FALLBACK));

  readonly status = signal<ProjectsStatus>('idle');
  readonly usingStaleCache = signal(false);
  readonly activeTag = signal<string | null>(null);

  readonly projects = this.all.asReadonly();

  readonly tags = computed(() => {
    const counts = new Map<string, number>();
    for (const project of this.all()) {
      for (const tag of project.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  });

  readonly filtered = computed(() => {
    const tag = this.activeTag();
    const projects = this.all();
    return tag ? projects.filter((project) => project.tags.includes(tag)) : projects;
  });

  readonly featured = computed(() => this.filtered().filter((project) => project.featured));
  readonly others = computed(() => this.filtered().filter((project) => !project.featured));

  readonly recent = computed(() =>
    [...this.all()]
      .sort((a, b) => (b.lastPush ?? '').localeCompare(a.lastPush ?? ''))
      .slice(0, 3),
  );

  selectTag(tag: string | null): void {
    this.activeTag.set(this.activeTag() === tag ? null : tag);
  }

  /** Guards against re-rendering the grid when revalidation changes nothing. */
  private lastSignature = '';

  /**
   * Stale-while-revalidate.
   *
   * Cached repos paint immediately, then GitHub is consulted on every load and
   * the grid updates if anything actually changed — so editing a topic or a
   * description shows up on the next page load instead of whenever a TTL lapses.
   *
   * During prerendering there is no cache, so this simply awaits the fetch,
   * which is what the server-side app initializer needs.
   */
  async load(): Promise<void> {
    const { immediate, revalidated } = this.github.getRepos();

    if (immediate) {
      this.apply(immediate);
    } else {
      this.status.set('loading');
    }

    const fresh = await revalidated;

    if (fresh) {
      this.apply(fresh);
    } else if (!immediate) {
      this.status.set('fallback');
      this.usingStaleCache.set(false);
    }
  }

  private apply(result: RepoFetchResult): void {
    const mapped = result.repos
      .map(toProject)
      .filter((project): project is Project => project !== null);

    if (!mapped.length) {
      this.status.set('fallback');
      return;
    }

    const sorted = sortProjects(mapped);
    const signature = sorted
      .map((p) => [p.id, p.featured, p.description, p.tags.join(','), p.liveUrl, p.lastPush].join('|'))
      .join('||');

    if (signature !== this.lastSignature) {
      this.lastSignature = signature;
      this.all.set(sorted);
    }

    this.usingStaleCache.set(result.stale);
    this.status.set('ready');

    const tag = this.activeTag();
    if (tag && !this.tags().includes(tag)) {
      this.activeTag.set(null);
    }
  }
}
