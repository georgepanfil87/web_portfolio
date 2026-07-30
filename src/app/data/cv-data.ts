import { EducationEntry, ExperienceEntry } from '../core/models/cv.model';

export const CAREER_SUMMARY = [
  'Dynamic developer with 2 years of experience designing and optimizing high-performance web systems for complex industrial environments. Expertise in Angular frontends and .NET Core backends, with a demonstrated ability to streamline workflows and significantly improve system latency.',
  'Most recently I built Syntx, my dissertation project: a self-hosted development environment whose AI assistant — chat, inline completions, and semantic search over pgvector — runs entirely on the host through Ollama, so source code never leaves the machine.',
] as const;

export const EXPERIENCE: ExperienceEntry[] = [
  {
    id: 'trident-sm',
    role: 'Full Stack Developer',
    company: 'Trident SM',
    location: 'Bucharest',
    period: 'October 2025 – December 2025',
    summary: 'Laid down the front-end architecture for the next version of the product.',
    projects: [
      {
        name: 'Front-end architecture & requirements',
        points: [
          'Architected and began implementation of the front-end structure, prioritizing code stability, scalability, and a solid foundation for future features.',
          'Engaged with stakeholders in project kick-off meetings to analyze the current application flow and define requirements for the next version, focusing on user experience and process optimization.',
        ],
      },
    ],
    tech: [],
  },
  {
    id: 'liberty-full-stack',
    role: 'Full Stack Developer',
    company: 'Liberty Galați',
    period: 'December 2023 – September 2025',
    summary:
      'Three internal systems for a steel plant: scheduling, manufacturing execution, and task management.',
    projects: [
      {
        name: 'Technical Assistance Scheduler App',
        points: [
          'Led development of an internal IT team availability tracker used during holiday periods.',
          'Guided junior devs on reactive forms and Angular best practices.',
          'Implemented dynamic forms for admins to create date ranges, and a calendar UI for users to submit daily availability.',
          'Designed API endpoints with role-based access.',
        ],
      },
      {
        name: 'Manufacturing Execution System (MES) Optimization',
        points: [
          'Reduced API response times by 25% through efficient EF Core queries with .AsNoTracking() and proper indexing.',
          'Improved Angular code quality by introducing standalone components and a modular architecture for better maintainability.',
        ],
      },
      {
        name: 'Internal Task Management Platform',
        points: [
          'Replaced a legacy service-based architecture with NgRx state management, improving task transition speed by 30%.',
          'Optimized performance with selectors that minimize store computations.',
          'Reduced re-renders by 40% via OnPush change detection.',
        ],
      },
    ],
    tech: ['Angular', 'NgRx', 'RxJS', '.NET Core 8', 'EF Core', 'SQL Server'],
  },
  {
    id: 'liberty-trainee',
    role: 'Web Developer Trainee',
    company: 'Liberty Galați',
    period: 'July 2022 – September 2022',
    summary: 'Secure document management for the plant warehouse.',
    projects: [
      {
        name: 'Technical Drawings Management System',
        points: [
          'Built a secure document management application for 100+ steel plant warehouse technicians.',
          'Reduced drawing retrieval time by 65% through .NET Core API caching of frequently accessed drawings and optimized SQL Server queries with proper indexing.',
        ],
      },
    ],
    tech: ['.NET Core', 'SQL Server'],
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    id: 'master',
    degree: 'Master of Advanced Computer Science',
    field: 'Software Engineering',
    institution: '“Dunărea de Jos” University of Galați',
    period: 'October 2024 – July 2026',
    thesis: {
      label: 'Dissertation project',
      shortName: 'Syntx',
      description:
        'Editor, chat, semantic search, and inline completions in one workspace, with the language model served by Ollama from a container beside the application, so source code never leaves the host.',
      titleUnknown: true,
    },
  },
  {
    id: 'bachelor',
    degree: 'Bachelor of Computer Science',
    field: 'Software Engineering',
    institution: '“Dunărea de Jos” University of Galați',
    period: 'October 2019 – July 2023',
    thesis: {
      label: 'Degree project',
      shortName: 'Team Management System',
      description:
        'drag-and-drop task boards (React Beautiful DND), a JWT-auth REST API, and queries optimized through indexed fields (teamId, deadline) for 50% faster searches.',
    },
  },
];

export const CORE_COMPETENCIES = [
  'Analytical Problem-Solving',
  'Data-Driven Development',
  'Technical Mentorship',
] as const;
