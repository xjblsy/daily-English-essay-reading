/**
 * 内容更新服务 (Content Update Service)
 *
 * 负责每日自动获取和更新学术资源数据，包含：
 * - 带重试机制的 API 调用（指数退避）
 * - 多级降级策略
 * - 完整的日志记录系统
 * - 更新状态追踪
 */

import type { Paper, Video, ReadingMaterial, DailyRecommendations } from '../types';
import { fallbackPapers } from '../data/mockPapers';
import { mockVideos } from '../data/mockVideos';
import { mockReadings } from '../data/mockReadings';
import { ARXIV_KEYWORDS, ARXIV_API_BASE, ARXIV_MAX_RESULTS, CORS_PROXY } from '../data/constants';
import { getFromStorage, setToStorage } from '../utils/storage';
import type { UserSettings } from '../types';

// ===== 日志系统 =====

export type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: unknown;
}

const MAX_LOG_ENTRIES = 100;

function addLogEntry(level: LogLevel, message: string, details?: unknown): void {
  const logs = getFromStorage<LogEntry[]>('englearn_update_logs') || [];
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    details,
  };
  logs.unshift(entry);
  // 只保留最近100条日志
  if (logs.length > MAX_LOG_ENTRIES) logs.length = MAX_LOG_ENTRIES;
  setToStorage('englearn_update_logs', logs);

  // 同时输出到控制台
  const prefix = `[EngLearn Update ${entry.timestamp}]`;
  switch (level) {
    case 'info':
      console.log(prefix, message, details || '');
      break;
    case 'warn':
      console.warn(prefix, message, details || '');
      break;
    case 'error':
      console.error(prefix, message, details || '');
      break;
  }
}

// ===== 更新状态接口 =====

export interface UpdateStatus {
  lastUpdateAttempt: string | null;     // 上次尝试更新时间
  lastSuccessfulUpdate: string | null;  // 上次成功更新时间
  updateCount: number;                  // 总更新次数
  successCount: number;                 // 成功次数
  failureCount: number;                 // 失败次数
  consecutiveFailures: number;          // 连续失败次数
  lastError: string | null;             // 最后一次错误信息
  source: 'arxiv-api' | 'fallback';     // 当前使用的数据源
}

const DEFAULT_STATUS: UpdateStatus = {
  lastUpdateAttempt: null,
  lastSuccessfulUpdate: null,
  updateCount: 0,
  successCount: 0,
  failureCount: 0,
  consecutiveFailures: 0,
  lastError: null,
  source: 'fallback',
};

export function getUpdateStatus(): UpdateStatus {
  return getFromStorage<UpdateStatus>('englearn_update_status') || { ...DEFAULT_STATUS };
}

function saveUpdateStatus(status: UpdateStatus): void {
  setToStorage('englearn_update_status', status);
}

// ===== 重试机制配置 =====

interface RetryConfig {
  maxRetries: number;       // 最大重试次数
  baseDelayMs: number;      // 基础延迟（毫秒）
  maxDelayMs: number;       // 最大延迟（毫秒）
  backoffFactor: number;    // 退避因子
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
  backoffFactor: 2,
};

/**
 * 带指数退避的重试函数
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  operationName: string = 'operation'
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = Math.min(
          config.baseDelayMs * Math.pow(config.backoffFactor, attempt - 1),
          config.maxDelayMs
        );
        addLogEntry('info', `${operationName} retry attempt ${attempt}/${config.maxRetries} in ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      addLogEntry('warn', `${operationName} attempt ${attempt + 1} failed`, {
        error: lastError.message,
      });
    }
  }

  throw lastError || new Error(`${operationName} failed after ${config.maxRetries + 1} attempts`);
}

// ===== arXiv XML 解析 =====

function parseArxivXml(xmlText: string): Paper[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const entries = xmlDoc.getElementsByTagName('entry');

  const papers: Paper[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const title = entry.getElementsByTagName('title')[0]?.textContent?.trim() || '';
    const summary = entry.getElementsByTagName('summary')[0]?.textContent?.trim() || '';
    const published = entry.getElementsByTagName('published')[0]?.textContent?.split('T')[0] || '';
    const idLink = entry.getElementsByTagName('id')[0]?.textContent || '';

    const authorElems = entry.getElementsByTagName('author');
    const authors = Array.from(authorElems)
      .map(a => a.getElementsByTagName('name')[0]?.textContent)
      .filter(Boolean)
      .join(', ');

    const category = entry.getElementsByTagName('category')[0];
    const term = category?.getAttribute('term') || '';

    papers.push({
      id: `arxiv-${i}-${Date.now()}`,
      title,
      authors,
      abstract: summary.replace(/\s+/g, ' ').trim(),
      source: 'arxiv',
      category: categorizePaper(term),
      url: idLink,
      publishedDate: published,
      isTodayNew: true,
    });
  }

  return papers;
}

function categorizePaper(term: string): Paper['category'] {
  const lower = term.toLowerCase();
  if (lower.includes('nlp') || lower.includes('computation') || lower.includes('language')) return 'nlp';
  if (lower.includes('learning') || lower.includes('neural') || lower.includes('ai')) return 'ai';
  if (lower.includes('data') || lower.includes('mining') || lower.includes('distributed')) return 'bigdata';
  if (lower.includes('physics') || lower.includes('quantum') || lower.includes('particle')) return 'physics';
  if (lower.includes('chemistry') || lower.includes('molecule') || lower.includes('reaction')) return 'chemistry';
  if (lower.includes('math') || lower.includes('algebra') || lower.includes('geometry')) return 'mathematics';
  if (lower.includes('philosophy') || lower.includes('history') || lower.includes('humanities')) return 'humanities';
  if (lower.includes('art') || lower.includes('creativity') || lower.includes('music')) return 'art';
  return 'bigdata';
}

// ===== 核心数据获取函数 =====

async function fetchSingleKeyword(keyword: string): Promise<Paper[]> {
  const query = encodeURIComponent(`all:${keyword}`);
  const url = `${ARXIV_API_BASE}?search_query=${query}&start=0&max_results=${ARXIV_MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending`;
  const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;

  const response = await fetch(proxiedUrl, {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`arXiv API returned HTTP ${response.status}`);
  }

  const xmlText = await response.text();
  return parseArxivXml(xmlText);
}

/**
 * 从 arXiv API 获取论文（带重试和超时）
 */
async function fetchAllPapersWithRetry(): Promise<Paper[]> {
  const allPapers: Paper[] = [];
  const seenTitles = new Set<string>();

  const settings = getFromStorage<UserSettings>('englearn_settings') || {
    crossDomainEnabled: true,
    crossDomainRatio: 0.2,
  };

  const keywords: string[] = [...ARXIV_KEYWORDS.primary];

  if (settings.crossDomainEnabled) {
    const crossDomainCount = Math.ceil(ARXIV_KEYWORDS.crossDomain.length * settings.crossDomainRatio);
    const shuffled = [...ARXIV_KEYWORDS.crossDomain].sort(() => Math.random() - 0.5);
    keywords.push(...shuffled.slice(0, crossDomainCount));
  }

  addLogEntry('info', `Starting arXiv fetch for ${keywords.length} keywords`, {
    primaryCount: ARXIV_KEYWORDS.primary.length,
    crossDomainCount: keywords.length - ARXIV_KEYWORDS.primary.length,
  });

  for (const keyword of keywords) {
    try {
      const papers = await withRetry(
        () => fetchSingleKeyword(keyword),
        DEFAULT_RETRY_CONFIG,
        `arXiv-${keyword}`
      );
      for (const paper of papers) {
        if (!seenTitles.has(paper.title)) {
          seenTitles.add(paper.title);
          allPapers.push(paper);
        }
      }
      addLogEntry('info', `Fetched ${papers.length} papers for keyword "${keyword}"`);
    } catch (error) {
      addLogEntry('error', `Failed to fetch keyword "${keyword}" after retries`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return allPapers;
}

// ===== 主更新函数 =====

export interface UpdateResult {
  success: boolean;
  recommendations: DailyRecommendations;
  status: UpdateStatus;
  usedFallback: boolean;
  logEntries: LogEntry[];
}

/**
 * 执行完整的每日内容更新
 *
 * 流程：
 * 1. 检查是否需要更新（距上次成功更新 >= 24h）
 * 2. 尝试从 arXiv API 获取论文
 * 3. 若API失败，降级到 fallback 数据
 * 4. 合并视频/阅读材料
 * 5. 按用户设置筛选和截取
 * 6. 记录更新状态和日志
 */
export async function performDailyUpdate(options?: {
  force?: boolean;
  paperCount?: number;
  videoCount?: number;
}): Promise<UpdateResult> {
  const status = getUpdateStatus();
  const now = new Date().toISOString();
  const paperCount = options?.paperCount ?? 3;
  const videoCount = options?.videoCount ?? 2;

  status.lastUpdateAttempt = now;
  status.updateCount += 1;

  let apiPapers: Paper[] = [];
  let usedFallback = false;
  let updateSuccess = false;

  addLogEntry('info', '=== Starting daily content update ===', { forced: !!options?.force });

  try {
    // 步骤1：尝试从 arXiv API 获取
    addLogEntry('info', 'Attempting arXiv API data retrieval...');
    apiPapers = await fetchAllPapersWithRetry();

    if (apiPapers.length > 0) {
      addLogEntry('info', `Successfully fetched ${apiPapers.length} papers from arXiv API`);
      status.source = 'arxiv-api';
      status.successCount += 1;
      status.consecutiveFailures = 0;
      status.lastSuccessfulUpdate = now;
      status.lastError = null;
      updateSuccess = true;
    } else {
      throw new Error('arXiv API returned empty results');
    }
  } catch (error) {
    // 步骤2：API 失败，降级到 fallback
    const errorMsg = error instanceof Error ? error.message : String(error);
    addLogEntry('error', 'arXiv API retrieval failed, falling back to cached data', {
      error: errorMsg,
    });
    status.failureCount += 1;
    status.consecutiveFailures += 1;
    status.lastError = errorMsg;
    status.source = 'fallback';
    usedFallback = true;

    // 使用 fallback 数据并标记为今日新增
    apiPapers = fallbackPapers.map(p => ({ ...p, isTodayNew: true }));
    // 即使是 fallback 也算部分成功（数据可用）
    updateSuccess = true;
  }

  // 步骤3：构建推荐数据
  const dailyPapers = apiPapers.slice(0, paperCount);
  const dailyVideos = mockVideos.slice(0, videoCount);
  const dailyReadings = mockReadings.slice(0, 3);

  const recommendations: DailyRecommendations = {
    papers: dailyPapers,
    videos: dailyVideos,
    readings: dailyReadings,
    lastUpdated: now,
  };

  // 步骤4：保存更新时间戳
  setToStorage('englearn_last_updated', now);

  // 缓存最新推荐数据到 localStorage（供离线使用）
  setToStorage('englearn_cached_recommendations', recommendations);

  // 步骤5：保存更新状态
  saveUpdateStatus(status);

  addLogEntry('info', '=== Daily update completed ===', {
    success: updateSuccess,
    source: status.source,
    papersCount: dailyPapers.length,
    videosCount: dailyVideos.length,
    readingsCount: dailyReadings.length,
    usedFallback,
  });

  // 获取最终日志
  const logEntries = getFromStorage<LogEntry[]>('englearn_update_logs') || [];

  return {
    success: updateSuccess,
    recommendations,
    status,
    usedFallback,
    logEntries,
  };
}

/**
 * 获取缓存的推荐数据（用于离线/快速加载）
 */
export function getCachedRecommendations(): DailyRecommendations | null {
  return getFromStorage<DailyRecommendations>('englearn_cached_recommendations');
}

/**
 * 获取更新日志
 */
export function getUpdateLogs(): LogEntry[] {
  return getFromStorage<LogEntry[]>('englearn_update_logs') || [];
}

/**
 * 清除更新日志
 */
export function clearUpdateLogs(): void {
  setToStorage('englearn_update_logs', []);
}
