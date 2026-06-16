// ===== 论文相关类型 =====
export interface Paper {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  source: 'arxiv' | 'nature';
  category: 'ai' | 'nlp' | 'bigdata' | 'physics' | 'chemistry' | 'mathematics' | 'humanities' | 'art';
  url: string;
  publishedDate: string;
  isTodayNew: boolean;
}

export interface PaperFilter {
  sources: ('arxiv' | 'nature')[];
  categories: ('ai' | 'nlp' | 'bigdata' | 'physics' | 'chemistry' | 'mathematics' | 'humanities' | 'art')[];
  searchQuery: string;
}

// ===== 听力视频相关类型 =====
export interface Video {
  id: string;
  title: string;
  source: 'bbc' | 'ted' | 'ielts';
  videoUrl: string;
  originalUrl: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  thumbnailUrl: string;
}

// ===== 阅读材料相关类型 =====
export interface ReadingMaterial {
  id: string;
  title: string;
  source: 'cambridge-ielts' | 'tech-blog' | 'documentation';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  wordCount: number;
  category: 'ai' | 'nlp' | 'bigdata' | 'general';
  description: string;
}

// ===== 用户数据相关类型 =====
export interface FavoriteItem {
  id: string;
  itemType: 'paper' | 'video' | 'reading';
  itemId: string;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  itemType: 'paper' | 'video' | 'reading';
  itemId: string;
  viewedAt: string;
}

export interface UserSettings {
  researchInterests: ('ai' | 'nlp' | 'bigdata' | 'physics' | 'chemistry' | 'mathematics' | 'humanities' | 'art')[];
  crossDomainEnabled: boolean;
  crossDomainRatio: number;
  dailyPaperCount: number;
  dailyVideoCount: number;
  theme: 'dark';
}

// ===== 仪表盘数据类型 =====
export interface DailyRecommendations {
  papers: Paper[];
  videos: Video[];
  readings: ReadingMaterial[];
  lastUpdated: string;
}

export interface LearningStats {
  weeklyCompleted: number;
  totalFavorites: number;
  streakDays: number;
  historyByType: Record<string, number>;
}
