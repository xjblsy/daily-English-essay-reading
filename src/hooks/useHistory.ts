import { useCallback } from 'react';
import { useHistoryStore } from '../stores/useHistoryStore';

export function useHistory() {
  const { addToHistory, getHistoryByType, clearHistory, getRecentHistory } =
    useHistoryStore();

  const recordView = useCallback(
    (itemType: 'paper' | 'video' | 'reading', itemId: string) => {
      addToHistory(itemType, itemId);
    },
    [addToHistory]
  );

  return {
    recordView,
    getHistoryByType,
    clearHistory,
    getRecentHistory,
  };
}
