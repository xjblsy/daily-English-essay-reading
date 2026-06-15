// arXiv API 搜索关键词（AI/NLP/大数据领域）
export const ARXIV_KEYWORDS = [
  'artificial intelligence',
  'natural language processing',
  'machine learning',
  'large language model',
  'deep learning',
  'data mining',
  'big data',
  'neural network',
  'transformer',
  'NLP',
];

// arXiv API 配置
export const ARXIV_API_BASE = 'http://export.arxiv.org/api/query';
export const ARXIV_MAX_RESULTS = 10;

// Nature Briefing RSS
export const NATURE_RSS_URL = 'https://www.nature.com/briefing/daily/rss';

// 来源显示名称映射
export const SOURCE_LABELS: Record<string, string> = {
  arxiv: 'arXiv',
  nature: 'Nature',
  bbc: 'BBC Learning English',
  ted: 'TED',
  ielts: 'Cambridge IELTS',
  'cambridge-ielts': 'Cambridge IELTS',
  'tech-blog': 'Tech Blog',
  documentation: 'Documentation',
};

// 分类显示名称映射
export const CATEGORY_LABELS: Record<string, string> = {
  ai: 'Artificial Intelligence',
  nlp: 'Natural Language Processing',
  bigdata: 'Big Data',
  general: 'General English',
};

// 难度显示名称映射
export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

// 来源颜色映射（用于左侧竖线标识）
export const SOURCE_COLORS: Record<string, string> = {
  arxiv: '#b91c1c',
  nature: '#0369a1',
};

// 导航菜单配置
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/papers', label: 'Papers', icon: 'FileText' },
  { path: '/listening', label: 'Listening', icon: 'Headphones' },
  { path: '/reading', label: 'Reading', icon: 'BookOpen' },
  { path: '/favorites', label: 'Favorites', icon: 'Heart' },
  { path: '/history', label: 'History', icon: 'Clock' },
  { path: '/settings', label: 'Settings', icon: 'Settings' },
  { path: '/monitor', label: 'Monitor', icon: 'Activity' },
] as const;

// 默认用户设置
export const DEFAULT_SETTINGS: UserSettings = {
  researchInterests: ['ai', 'nlp', 'bigdata'],
  dailyPaperCount: 3,
  dailyVideoCount: 2,
  theme: 'dark',
};

import type { UserSettings } from '../types';

// localStorage 键名
export const STORAGE_KEYS = {
  FAVORITES: 'englearn_favorites',
  HISTORY: 'englearn_history',
  SETTINGS: 'englearn_settings',
  LAST_UPDATED: 'englearn_last_updated',
} as const;
