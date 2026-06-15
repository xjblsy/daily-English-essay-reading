import { create } from 'zustand';
import type { FavoriteItem } from '../types';
import { getFromStorage, setToStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../data/constants';

interface FavoriteState {
  favorites: FavoriteItem[];
  addFavorite: (itemType: FavoriteItem['itemType'], itemId: string) => void;
  removeFavorite: (itemId: string) => void;
  isFavorited: (itemId: string) => boolean;
  getFavoritesByType: (type: FavoriteItem['itemType']) => FavoriteItem[];
  clearAll: () => void;
}

const initialFavorites = getFromStorage<FavoriteItem[]>(STORAGE_KEYS.FAVORITES) || [];

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: initialFavorites,

  addFavorite: (itemType, itemId) => {
    const { favorites } = get();
    if (favorites.some(f => f.itemId === itemId)) return;

    const newItem: FavoriteItem = {
      id: `fav-${Date.now()}`,
      itemType,
      itemId,
      createdAt: new Date().toISOString(),
    };
    const updated = [...favorites, newItem];
    set({ favorites: updated });
    setToStorage(STORAGE_KEYS.FAVORITES, updated);
  },

  removeFavorite: (itemId) => {
    const updated = get().favorites.filter(f => f.itemId !== itemId);
    set({ favorites: updated });
    setToStorage(STORAGE_KEYS.FAVORITES, updated);
  },

  isFavorited: (itemId) => {
    return get().favorites.some(f => f.itemId === itemId);
  },

  getFavoritesByType: (type) => {
    return get().favorites.filter(f => f.itemType === type);
  },

  clearAll: () => {
    set({ favorites: [] });
    setToStorage(STORAGE_KEYS.FAVORITES, []);
  },
}));
