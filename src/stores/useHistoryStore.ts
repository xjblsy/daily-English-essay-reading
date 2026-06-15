import { create } from 'zustand';
import type { HistoryRecord } from '../types';
import { getFromStorage, setToStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../data/constants';

interface HistoryState {
  history: HistoryRecord[];
  addToHistory: (itemType: HistoryRecord['itemType'], itemId: string) => void;
  getHistoryByType: (type: HistoryRecord['itemType']) => HistoryRecord[];
  clearHistory: () => void;
  getRecentHistory: (limit?: number) => HistoryRecord[];
}

const initialHistory = getFromStorage<HistoryRecord[]>(STORAGE_KEYS.HISTORY) || [];

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: initialHistory,

  addToHistory: (itemType, itemId) => {
    const { history } = get();
    // 移除已存在的相同记录（避免重复）
    const filtered = history.filter(h => !(h.itemType === itemType && h.itemId === itemId));

    const newRecord: HistoryRecord = {
      id: `hist-${Date.now()}`,
      itemType,
      itemId,
      viewedAt: new Date().toISOString(),
    };

    // 限制最多保存200条记录
    const updated = [newRecord, ...filtered].slice(0, 200);
    set({ history: updated });
    setToStorage(STORAGE_KEYS.HISTORY, updated);
  },

  getHistoryByType: (type) => {
    return get().history.filter(h => h.itemType === type);
  },

  clearHistory: () => {
    set({ history: [] });
    setToStorage(STORAGE_KEYS.HISTORY, []);
  },

  getRecentHistory: (limit = 20) => {
    return get().history.slice(0, limit);
  },
}));
