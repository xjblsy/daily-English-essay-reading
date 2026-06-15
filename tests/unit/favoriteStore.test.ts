import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFavoriteStore } from '../../src/stores/useFavoriteStore';

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

describe('useFavoriteStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    // 重置 store 状态
    useFavoriteStore.setState({ favorites: [] });
  });

  describe('addFavorite', () => {
    it('应该能添加新的收藏项', () => {
      const { addFavorite } = useFavoriteStore.getState();
      addFavorite('paper', 'paper-001');

      const { favorites } = useFavoriteStore.getState();
      expect(favorites).toHaveLength(1);
      expect(favorites[0]).toMatchObject({
        itemType: 'paper',
        itemId: 'paper-001',
      });
    });

    it('不应该添加重复的收藏项', () => {
      const { addFavorite } = useFavoriteStore.getState();
      addFavorite('paper', 'paper-001');
      addFavorite('paper', 'paper-001');

      const { favorites } = useFavoriteStore.getState();
      expect(favorites).toHaveLength(1);
    });

    it('应该为不同类型的资源分别收藏', () => {
      const { addFavorite } = useFavoriteStore.getState();
      addFavorite('paper', 'paper-001');
      addFavorite('video', 'video-001');
      addFavorite('reading', 'reading-001');

      const { favorites } = useFavoriteStore.getState();
      expect(favorites).toHaveLength(3);
    });
  });

  describe('removeFavorite', () => {
    it('应该能移除已收藏的项', () => {
      const { addFavorite, removeFavorite } = useFavoriteStore.getState();
      addFavorite('paper', 'paper-001');
      removeFavorite('paper-001');

      const { favorites } = useFavoriteStore.getState();
      expect(favorites).toHaveLength(0);
    });

    it('移除不存在的项不应该报错', () => {
      const { removeFavorite } = useFavoriteStore.getState();
      removeFavorite('non-existent');

      const { favorites } = useFavoriteStore.getState();
      expect(favorites).toHaveLength(0);
    });
  });

  describe('isFavorited', () => {
    it('已收藏的项应返回 true', () => {
      const { addFavorite, isFavorited } = useFavoriteStore.getState();
      addFavorite('paper', 'paper-001');

      expect(isFavorited('paper-001')).toBe(true);
    });

    it('未收藏的项应返回 false', () => {
      const { isFavorited } = useFavoriteStore.getState();
      expect(isFavorited('non-existent')).toBe(false);
    });
  });

  describe('getFavoritesByType', () => {
    it('应该按类型过滤收藏', () => {
      const { addFavorite, getFavoritesByType } = useFavoriteStore.getState();
      addFavorite('paper', 'p1');
      addFavorite('paper', 'p2');
      addFavorite('video', 'v1');
      addFavorite('reading', 'r1');

      expect(getFavoritesByType('paper')).toHaveLength(2);
      expect(getFavoritesByType('video')).toHaveLength(1);
      expect(getFavoritesByType('reading')).toHaveLength(1);
    });
  });

  describe('clearAll', () => {
    it('应该清除所有收藏', () => {
      const { addFavorite, clearAll } = useFavoriteStore.getState();
      addFavorite('paper', 'p1');
      addFavorite('video', 'v1');
      clearAll();

      const { favorites } = useFavoriteStore.getState();
      expect(favorites).toHaveLength(0);
    });
  });

  describe('持久化', () => {
    it('添加收藏时应写入 localStorage', () => {
      const { addFavorite } = useFavoriteStore.getState();
      addFavorite('paper', 'paper-001');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'englearn_favorites',
        expect.any(String)
      );
    });
  });
});
