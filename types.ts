export interface UserProfile {
  name: string;
  email: string;
  businessIdea: string;
  capital: number;
  experience: string; // e.g., Beginner, Intermediate, Expert
  location: string; // For legal checks
  teamSize: number;
}

export enum Section {
  DASHBOARD = 'DASHBOARD',
  IDEA_VALIDATION = 'IDEA_VALIDATION',
  MARKET_ANALYSIS = 'MARKET_ANALYSIS',
  BUSINESS_PLAN = 'BUSINESS_PLAN',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  LEGAL = 'LEGAL',
  RISKS = 'RISKS',
  MENTOR = 'MENTOR'
}

export interface FinancialDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface RoadmapTask {
  id: number;
  week: number;
  title: string;
  detail: string;
  isCompleted: boolean;
}

export interface RisksAndRoadmapData {
  risks: { title: string; mitigation: string }[];
  roadmap: RoadmapTask[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}