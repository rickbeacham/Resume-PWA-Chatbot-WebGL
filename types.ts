export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string; // Used for summary/context
  details: string[]; // Bullet points
  technologies?: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  year: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export enum SectionId {
  HERO = 'hero',
  ABOUT = 'about',
  EXPERIENCE = 'experience',
  SKILLS = 'skills',
  EDUCATION = 'education',
  CONTACT = 'contact'
}