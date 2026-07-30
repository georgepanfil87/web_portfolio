export interface ExperienceProject {
  name: string;
  points: string[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  projects: ExperienceProject[];
  tech: string[];
  current?: boolean;
}

export interface EducationEntry {
  id: string;
  degree: string;
  field: string;
  institution: string;
  period: string;
  thesis?: {
    label: string;
    shortName: string;
    description: string;
    titleUnknown?: boolean;
  };
}

export interface Skill {
  label: string;
  tech: string | null;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}
