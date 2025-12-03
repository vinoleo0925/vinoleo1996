export type Language = 'en' | 'zh';

export interface NewsItem {
  id: string;
  title: string;
  source: string; // e.g., "YouTube - Andrej Karpathy"
  category: 'Tech Giant' | 'Humanoid Robot' | 'Embodied AI' | 'Research';
  summary: string;
  keyPoints: string[];
  technicalTrend: string; // specific tech insight
  url: string;
  thumbnailUrl?: string;
  timestamp: string;
}

export interface DailySummary {
  headline: string;
  overview: string;
  topTrends: string[];
}

export interface NewsResponse {
  dailySummary: DailySummary;
  newsItems: NewsItem[];
}

export enum CategoryFilter {
  ALL = 'All',
  TECH_GIANT = 'Tech Giant',
  HUMANOID = 'Humanoid Robot',
  EMBODIED_AI = 'Embodied AI',
  RESEARCH = 'Research'
}