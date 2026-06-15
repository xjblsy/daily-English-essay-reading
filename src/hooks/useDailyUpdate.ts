import { useState, useEffect, useCallback } from 'react';
import type { DailyRecommendations } from '../types';
import { performDailyUpdate, getCachedRecommendations, getUpdateStatus, type UpdateStatus } from '../services/updateService';
import { useSettingsStore } from '../stores/useSettingsStore';

/**
 * 每日更新 Hook v2 - 使用健壮的更新服务
 *
 * 特性：
 * - 自动检测是否需要更新（24小时间隔）
 * - 支持强制刷新
 * - 离线优先加载缓存
 * - 完整的更新状态暴露
 */
export function useDailyUpdate() {
  const [recommendations, setRecommendations] = useState<DailyRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { settings } = useSettingsStore();

  const loadRecommendations = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      // 1. 先快速加载缓存（提升首屏体验）
      const cached = getCachedRecommendations();
      if (cached && !forceRefresh) {
        setRecommendations(cached);
        setLoading(false);
      }

      // 2. 执行后台更新
      const result = await performDailyUpdate({
        force: forceRefresh,
        paperCount: settings.dailyPaperCount,
        videoCount: settings.dailyVideoCount,
      });

      setRecommendations(result.recommendations);
      setUpdateStatus(result.status);
    } catch (error) {
      console.error('Critical: Even fallback data failed to load:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [settings.dailyPaperCount, settings.dailyVideoCount]);

  useEffect(() => {
    // 初始化时也加载状态信息
    setUpdateStatus(getUpdateStatus());
    loadRecommendations();
  }, [loadRecommendations]);

  const refresh = useCallback(() => {
    loadRecommendations(true);
  }, [loadRecommendations]);

  return {
    recommendations,
    loading,
    isRefreshing,
    refresh,
    updateStatus,
  };
}
