export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

export interface VisionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rotation?: number; // Visual rotation for collage effect
  size?: 'small' | 'medium' | 'large';
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  imageUrl?: string;
  mood?: string;
}

export type ViewState = 'dashboard' | 'vision' | 'journal';

export interface AIInsight {
  title: string;
  content: string;
  type: 'encouragement' | 'warning' | 'tip';
}

export interface DailyStats {
  waterCount: number;
  lastWaterDate: string;
}