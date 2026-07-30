import { SkillCategory } from '../core/models/cv.model';

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { label: 'Angular 16+/21', tech: 'angular' },
      { label: 'TypeScript', tech: null },
      { label: 'RxJS', tech: null },
      { label: 'NgRx', tech: 'ngrx' },
      { label: 'Signals', tech: null },
      { label: 'React', tech: null },
      { label: 'Tailwind CSS', tech: 'tailwind' },
      { label: 'HTML5 / CSS3', tech: null },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { label: '.NET Core 8', tech: null },
      { label: 'ASP.NET Web API', tech: null },
      { label: 'EF Core', tech: null },
      { label: 'C#', tech: null },
      { label: 'Python 3.12', tech: 'python' },
      { label: 'FastAPI', tech: 'fastapi' },
      { label: 'SQLAlchemy', tech: 'sqlalchemy' },
      { label: 'Pydantic v2', tech: 'pydantic' },
    ],
  },
  {
    id: 'ai-llm',
    label: 'AI / LLM',
    skills: [
      { label: 'RAG pipelines', tech: null },
      { label: 'Ollama', tech: 'ollama' },
      { label: 'pgvector / HNSW', tech: 'pgvector' },
      { label: 'Semantic search', tech: null },
      { label: 'Streaming completions', tech: null },
      { label: 'Qwen2.5-Coder', tech: 'qwen' },
      { label: 'nomic-embed-text', tech: 'nomic' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    skills: [
      { label: 'PostgreSQL 16', tech: 'postgres' },
      { label: 'SQL Server', tech: null },
      { label: 'LINQ', tech: null },
      { label: 'Alembic', tech: null },
      { label: 'Query optimization', tech: null },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { label: 'Git', tech: null },
      { label: 'Docker / compose', tech: null },
      { label: 'Linux CLI', tech: null },
      { label: 'GitHub Actions', tech: null },
      { label: 'pytest', tech: null },
      { label: 'Monaco Editor', tech: 'monaco' },
      { label: 'xterm.js', tech: 'xterm' },
    ],
  },
  {
    id: 'practices',
    label: 'Practices',
    skills: [
      { label: 'Agile / Scrum', tech: null },
      { label: 'Clean Architecture', tech: null },
      { label: 'Modular architecture', tech: null },
      { label: 'Code review', tech: null },
    ],
  },
];
