import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SITE_CONFIG } from '../config/site.config';
import { GithubRepo } from '../models/project.model';

interface CacheEnvelope {
  fetchedAt: number;
  repos: GithubRepo[];
}

export interface RepoFetchResult {
  repos: GithubRepo[];
  stale: boolean;
}

const { username, apiBase, cacheKey, cacheTtlHours } = SITE_CONFIG.github;
const TTL_MS = cacheTtlHours * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 10_000;

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private inFlight: Promise<RepoFetchResult | null> | null = null;

 
  async getRepos(force = false): Promise<RepoFetchResult | null> {
    if (!this.isBrowser) {
      return this.fetchFresh(null);
    }

    const cached = this.readCache();
    if (!force && cached && Date.now() - cached.fetchedAt < TTL_MS) {
      return { repos: cached.repos, stale: false };
    }

    this.inFlight ??= this.fetchFresh(cached);
    try {
      return await this.inFlight;
    } finally {
      this.inFlight = null;
    }
  }

  private async fetchFresh(cached: CacheEnvelope | null): Promise<RepoFetchResult | null> {
    const url = `${apiBase}/users/${username}/repos?per_page=100&sort=pushed`;
    // A hung request must not hang a production build.
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github+json' },
        signal: abort.signal,
      });
      if (!response.ok) {
        throw new Error(`GitHub responded ${response.status}`);
      }
      const repos = (await response.json()) as GithubRepo[];
      if (!Array.isArray(repos)) {
        throw new Error('Unexpected GitHub payload');
      }
      this.writeCache(repos);
      return { repos, stale: false };
    } catch {
      return cached ? { repos: cached.repos, stale: true } : null;
    } finally {
      clearTimeout(timeout);
    }
  }

  private readCache(): CacheEnvelope | null {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as CacheEnvelope;
      return Array.isArray(parsed?.repos) && typeof parsed.fetchedAt === 'number' ? parsed : null;
    } catch {
      return null;
    }
  }

  private writeCache(repos: GithubRepo[]): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      const trimmed: GithubRepo[] = repos.map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        forks: repo.forks,
        html_url: repo.html_url,
        homepage: repo.homepage,
        pushed_at: repo.pushed_at,
        topics: repo.topics ?? [],
        fork: repo.fork,
        archived: repo.archived,
      }));
      const envelope: CacheEnvelope = { fetchedAt: Date.now(), repos: trimmed };
      localStorage.setItem(cacheKey, JSON.stringify(envelope));
    } catch {
    }
  }
}
