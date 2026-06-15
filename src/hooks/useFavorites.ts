import { useCallback } from 'react';
import { useFavoriteStore } from '../stores/useFavoriteStore';
import type { FavoriteItem } from '../types';

export function useFavorites() {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorited,
    getFavoritesByType,
    clearAll,
  } = useFavoriteStore();

  const toggleFavorite = useCallback(
    (itemType: FavoriteItem['itemType'], itemId: string) => {
      if (isFavorited(itemId)) {
        removeFavorite(itemId);
      } else {
        addFavorite(itemType, itemId);
      }
    },
    [addFavorite, removeFavorite, isFavorited]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorited,
    getFavoritesByType,
    clearAll,
  };
}
