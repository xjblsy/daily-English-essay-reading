import { useSettings } from '../hooks/useSettings';
import { DEFAULT_SETTINGS } from '../data/constants';
import { CATEGORY_LABELS } from '../data/constants';

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings, toggleInterest } = useSettings();

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-xl font-bold text-white mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Settings
        </h2>
        <p className="text-sm text-slate-400">Customize your learning experience</p>
      </div>

      {/* Research Interests */}
      <section className="mb-8 p-6 rounded-xl bg-white/[0.03] border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3">Research Interests</h3>
        <p className="text-xs text-slate-400 mb-4">Select areas to personalize paper recommendations</p>
        <div className="flex flex-wrap gap-3">
          {(['ai', 'nlp', 'bigdata'] as const).map(interest => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                settings.researchInterests.includes(interest)
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:border-white/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                settings.researchInterests.includes(interest)
                  ? 'bg-amber-400'
                  : 'bg-slate-600'
              }`} />
              {CATEGORY_LABELS[interest]}
            </button>
          ))}
        </div>
      </section>

      {/* Daily Recommendations */}
      <section className="mb-8 p-6 rounded-xl bg-white/[0.03] border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3">Daily Recommendations</h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Papers per day</span>
              <span className="text-sm font-semibold text-amber-400">{settings.dailyPaperCount}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={settings.dailyPaperCount}
              onChange={e => updateSettings({ dailyPaperCount: Number(e.target.value) })}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Videos per day</span>
              <span className="text-sm font-semibold text-amber-400">{settings.dailyVideoCount}</span>
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={settings.dailyVideoCount}
              onChange={e => updateSettings({ dailyVideoCount: Number(e.target.value) })}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="p-6 rounded-xl bg-white/[0.03] border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3">Data Management</h3>
        <div className="space-y-3">
          <button
            onClick={resetSettings}
            className="w-full text-left px-4 py-3 rounded-lg bg-white/5 text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors"
          >
            Reset to Default Settings
          </button>
        </div>
      </section>
    </div>
  );
}
