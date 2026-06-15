import { useSettingsStore } from '../stores/useSettingsStore';
import { DEFAULT_SETTINGS } from '../data/constants';

export function useSettings() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const toggleInterest = (interest: 'ai' | 'nlp' | 'bigdata') => {
    const current = settings.researchInterests;
    if (current.includes(interest)) {
      updateSettings({
        researchInterests: current.filter((i) => i !== interest),
      });
    } else {
      updateSettings({ researchInterests: [...current, interest] });
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    toggleInterest,
    isDefault:
      JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS),
  };
}
