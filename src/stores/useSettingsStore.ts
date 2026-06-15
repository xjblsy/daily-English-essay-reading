import { create } from 'zustand';
import type { UserSettings } from '../types';
import { getFromStorage, setToStorage } from '../utils/storage';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../data/constants';

interface SettingsState {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const savedSettings = getFromStorage<UserSettings>(STORAGE_KEYS.SETTINGS);

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: savedSettings || DEFAULT_SETTINGS,

  updateSettings: (partial) => {
    const updated = { ...savedSettings || DEFAULT_SETTINGS, ...partial };
    set({ settings: updated });
    setToStorage(STORAGE_KEYS.SETTINGS, updated);
  },

  resetSettings: () => {
    set({ settings: DEFAULT_SETTINGS });
    setToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },
}));
