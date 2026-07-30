export interface GithubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  forks: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
}

export interface ProjectOverride {
  title?: string;
  description?: string;
  tags?: string[];
  details?: string[];
  featured?: boolean;
  hidden?: boolean;
  order?: number;
  liveUrl?: string;
}

export type ProjectSource = 'github' | 'fallback';

/** The shape the projects grid renders, after merging every input. */
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  details: string[];
  language: string | null;
  stars: number;
  forks: number;
  repoUrl: string;
  liveUrl: string | null;
  lastPush: string | null;
  featured: boolean;
  source: ProjectSource;
}

export type ProjectsStatus = 'idle' | 'loading' | 'ready' | 'fallback';
