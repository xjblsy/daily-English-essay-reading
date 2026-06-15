import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHistoryStore } from '../../src/stores/useHistoryStore';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useHistoryStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    useHistoryStore.setState({ history: [] });
  });

  describe('addToHistory', () => {
    it('应该能添加浏览记录', () => {
      const { addToHistory } = useHistoryStore.getState();
      addToHistory('paper', 'paper-001');

      const { history } = useHistoryStore.getState();
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        itemType: 'paper',
        itemId: 'paper-001',
      });
    });

    it('重复访问同一资源应更新其位置到最前', () => {
      const { addToHistory } = useHistoryStore.getState();
      addToHistory('paper', 'paper-001');
      addToHistory('video', 'video-001');
      addToHistory('paper', 'paper-001'); // 再次访问 paper-001

      const { history } = useHistoryStore.getState();
      expect(history).toHaveLength(2);
      expect(history[0].itemId).toBe('paper-001'); // 应该在最前面
    });

    it('每条记录应有唯一 ID 和时间戳', () => {
      const { addToHistory } = useHistoryStore.getState();
      addToHistory('reading', 'r-001');

      const { history } = useHistoryStore.getState();
      expect(history[0].id).toBeTruthy();
      expect(history[0].viewedAt).toBeTruthy();
      expect(new Date(history[0].viewedAt).getTime()).not.toBeNaN();
    });
  });

  describe('clearHistory', () => {
    it('应该清除所有历史记录', () => {
      const { addToHistory, clearHistory } = useHistoryStore.getState();
      addToHistory('paper', 'p1');
      addToHistory('video', 'v1');
      clearHistory();

      const { history } = useHistoryStore.getState();
      expect(history).toHaveLength(0);
    });
  });

  describe('getRecentHistory', () => {
    it('应该返回最近 N 条记录', () => {
      const { addToHistory, getRecentHistory } = useHistoryStore.getState();
      for (let i = 1; i <= 25; i++) {
        addToHistory('paper', `paper-${i}`);
      }

      const recent = getRecentHistory(10);
      expect(recent).toHaveLength(10);
      expect(recent[0].itemId).toBe('paper-25'); // 最新的在前
    });

    it('默认返回20条记录', () => {
      const { addToHistory, getRecentHistory } = useHistoryStore.getState();
      for (let i = 1; i <= 30; i++) {
        addToHistory('paper', `paper-${i}`);
      }

      const recent = getRecentHistory();
      expect(recent).toHaveLength(20);
    });
  });

  describe('持久化', () => {
    it('应将历史记录写入 localStorage', () => {
      const { addToHistory } = useHistoryStore.getState();
      addToHistory('paper', 'paper-001');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'englearn_history',
        expect.any(String)
      );
    });
  });
});
