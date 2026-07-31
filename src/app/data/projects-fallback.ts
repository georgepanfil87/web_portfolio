import { Project } from '../core/models/project.model';

export const PROJECTS_FALLBACK: Project[] = [
  {
    id: 'syntx',
    title: 'Syntx',
    description:
      'A self-hosted web IDE whose AI assistant runs entirely on your own machine. Monaco editor, integrated terminal, streaming chat, inline completions, and semantic file search over pgvector — with the model served by Ollama from a container beside the app, so source code never leaves the host.',
    tags: ['Angular', 'FastAPI', 'PostgreSQL', 'pgvector', 'Ollama', 'Tailwind', 'Docker'],
    details: [
      'JWT auth · HS256 · bcrypt 12',
      'GDPR consent versioning',
      'Rate limiting (slowapi, IP-aware)',
      'Structured logging · request IDs',
      'p50 / p95 metrics dashboard',
      'pytest · 55% coverage gate',
      'GitHub Actions CI',
      'EN / RO i18n',
      'Command palette',
    ],
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    repoUrl: 'https://github.com/georgepanfil87/syntx',
    liveUrl: null,
    imageCandidates: [],
    lastPush: null,
    featured: true,
    source: 'fallback',
  },
  {
    id: 'web_portfolio',
    title: 'web_portfolio',
    description:
      'This site — a zoneless Angular 21 build, prerendered to static files and styled with Tailwind v4. Signals for all state; no animation libraries.',
    tags: ['Angular', 'Tailwind', 'Static'],
    details: [],
    language: 'TypeScript',
    stars: 0,
    forks: 0,
    repoUrl: 'https://github.com/georgepanfil87/web_portfolio',
    liveUrl: null,
    imageCandidates: [],
    lastPush: null,
    featured: false,
    source: 'fallback',
  },
];
