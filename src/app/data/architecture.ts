
export const VIEWBOX = { width: 660, height: 560 } as const;

export interface ArchNodeSpec {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface ArchEdgeSpec {
  from: string;
  to: string;
  label: string;
}

export const ARCH_LAYERS: { label: string; y: number }[] = [
  { label: 'FRONTEND', y: 64 },
  { label: 'BACKEND', y: 200 },
  { label: 'DATA', y: 330 },
  { label: 'AI RUNTIME', y: 454 },
];

export const ARCH_NODES: ArchNodeSpec[] = [
  { id: 'angular', label: 'Angular 21', x: 96, y: 86 },
  { id: 'ngrx', label: 'NgRx', x: 214, y: 86 },
  { id: 'monaco', label: 'Monaco', x: 312, y: 86 },
  { id: 'xterm', label: 'xterm.js', x: 420, y: 86 },
  { id: 'tailwind', label: 'Tailwind', x: 540, y: 86 },

  { id: 'fastapi', label: 'FastAPI', x: 146, y: 222 },
  { id: 'python', label: 'Python 3.12', x: 290, y: 222 },
  { id: 'sqlalchemy', label: 'SQLAlchemy', x: 438, y: 222 },
  { id: 'pydantic', label: 'Pydantic v2', x: 568, y: 222 },

  { id: 'postgres', label: 'PostgreSQL 16', x: 210, y: 352 },
  { id: 'pgvector', label: 'pgvector · HNSW', x: 440, y: 352 },

  { id: 'ollama', label: 'Ollama', x: 150, y: 476 },
  { id: 'qwen', label: 'Qwen2.5-Coder', x: 340, y: 476 },
  { id: 'nomic', label: 'nomic-embed-text', x: 522, y: 476 },
];

export const ARCH_EDGES: ArchEdgeSpec[] = [
  { from: 'angular', to: 'fastapi', label: 'HTTP · streaming' },
  { from: 'fastapi', to: 'postgres', label: 'asyncpg' },
  { from: 'postgres', to: 'pgvector', label: 'HNSW index' },
  { from: 'fastapi', to: 'ollama', label: 'same network' },
  { from: 'ollama', to: 'qwen', label: 'chat' },
  { from: 'ollama', to: 'nomic', label: 'embeddings' },
];

export const ARCH_FAINT_EDGES: { from: string; to: string }[] = [
  { from: 'angular', to: 'ngrx' },
  { from: 'angular', to: 'monaco' },
  { from: 'angular', to: 'xterm' },
  { from: 'angular', to: 'tailwind' },
  { from: 'fastapi', to: 'python' },
  { from: 'fastapi', to: 'sqlalchemy' },
  { from: 'fastapi', to: 'pydantic' },
];


export const ARCH_DESCRIPTION =
  'Architecture of Syntx, a self-hosted web IDE. Frontend layer: Angular 21, NgRx, ' +
  'Monaco Editor, xterm.js, Tailwind CSS. It calls the backend layer over streaming ' +
  'HTTP: FastAPI, Python 3.12, SQLAlchemy async, Pydantic v2. The backend connects to ' +
  'the data layer via asyncpg: PostgreSQL 16, containing the pgvector HNSW index for ' +
  'semantic search. The backend also calls the AI runtime layer over HTTP on the same ' +
  'Docker network: Ollama, which serves Qwen2.5-Coder for chat completions and ' +
  'nomic-embed-text for embeddings. Every service runs inside one docker-compose ' +
  'network, so source code never leaves the host.';
