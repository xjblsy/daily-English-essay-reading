import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  performDailyUpdate,
  getUpdateStatus,
  getCachedRecommendations,
  clearUpdateLogs,
} from '../../src/services/updateService';
import type { UpdateStatus } from '../../src/services/updateService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get store() { return store; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('updateService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('getUpdateStatus - 默认状态', () => {
    it('没有历史记录时应返回默认状态', () => {
      const status = getUpdateStatus();
      expect(status.updateCount).toBe(0);
      expect(status.successCount).toBe(0);
      expect(status.failureCount).toBe(0);
      expect(status.consecutiveFailures).toBe(0);
      expect(status.source).toBe('fallback');
      expect(status.lastError).toBeNull();
    });
  });

  describe('getCachedRecommendations - 缓存查询', () => {
    it('没有缓存时应返回 null', () => {
      const cached = getCachedRecommendations();
      expect(cached).toBeNull();
    });
  });

  describe('clearUpdateLogs - 日志清除', () => {
    it('清除不存在的日志不应报错', () => {
      expect(() => clearUpdateLogs()).not.toThrow();
    });
  });

  describe('performDailyUpdate - 基本行为（降级模式）', () => {
    // 注意：此测试使用真实的 fallback 数据，不触发 API 调用
    // 因为 fetch 会被拒绝，服务会自动降级到内置数据

    it(
      '应该返回包含论文、视频和阅读材料的推荐数据',
      { timeout: 60000 },
      async () => {
        const result = await performDailyUpdate();

        // 验证返回结构完整
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('recommendations');
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('usedFallback');

        // 验证推荐数据非空
        expect(result.recommendations.papers.length).toBeGreaterThan(0);
        expect(result.recommendations.videos.length).toBeGreaterThan(0);
        expect(result.recommendations.readings.length).toBeGreaterThan(0);

        // 验证每篇论文有必要的字段
        const paper = result.recommendations.papers[0];
        expect(paper).toHaveProperty('id');
        expect(paper).toHaveProperty('title');
        expect(paper).toHaveProperty('source');
        expect(paper).toHaveProperty('category');
      }
    );

    it(
      '自定义数量应正确截断数据',
      { timeout: 60000 },
      async () => {
        const result1 = await performDailyUpdate({ paperCount: 1, videoCount: 1 });
        expect(result1.recommendations.papers.length).toBeLessThanOrEqual(1);
        expect(result1.recommendations.videos.length).toBeLessThanOrEqual(1);
      }
    );
  });

  describe('performDailyUpdate - 持久化验证', () => {
    it(
      '更新后应写入 localStorage',
      { timeout: 60000 },
      async () => {
        await performDailyUpdate();

        // 应该写入了更新状态
        const setStatusCalls = localStorageMock.setItem.mock.calls.filter(
          (c: string[]) => c[0] === 'englearn_update_status'
        );
        expect(setStatusCalls.length).toBeGreaterThan(0);

        // 应该写入了缓存数据
        const setCacheCalls = localStorageMock.setItem.mock.calls.filter(
          (c: string[]) => c[0] === 'englearn_cached_recommendations'
        );
        expect(setCacheCalls.length).toBeGreaterThan(0);

        // 应该写入了更新时间
        const setTimeCalls = localStorageMock.setItem.mock.calls.filter(
          (c: string[]) => c[0] === 'englearn_last_updated'
        );
        expect(setTimeCalls.length).toBeGreaterThan(0);
      }
    );
  });
});
