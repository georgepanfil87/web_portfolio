export const SITE_CONFIG = {
  github: {
    username: 'georgepanfil87',
    apiBase: 'https://api.github.com',
    cacheTtlHours: 6,
    cacheKey: 'gp-github-repos-v1',
    exclude: [] as string[],

    controlTopics: {
      featured: 'featured',
      hidden: 'portfolio-hide',
    },

    /*
     * Commit an image at this path inside any repo and the card uses it. It is
     * read from the default branch, so it is versioned with the project and
     * fully under your control. Repos without one fall back to GitHub's
     * generated social preview card.
     */
    previewImagePath: '.github/preview.png',
  },

  theme: {
    storageKey: 'gp-theme',
  },

  owner: {
    name: 'George Panfil',
    role: 'Full-Stack Developer',
    tagline:
      'Angular and .NET Core in industrial environments — lately building local-first LLM and RAG systems.',
    email: 'georgepanfil87@gmail.com',
    location: 'Romania',
    githubUrl: 'https://github.com/georgepanfil87',
    linkedinUrl: 'https://www.linkedin.com/in/george-panfil-218125242/',
    cvPath: 'George_Panfil_CV.pdf',
    cvFileName: 'George_Panfil_CV.pdf',
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
