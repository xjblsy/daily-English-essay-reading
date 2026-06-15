import { STORAGE_KEYS } from '../data/constants';

/**
 * 从 localStorage 读取数据
 */
export function getFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/**
 * 写入 localStorage
 */
export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

/**
 * 从 localStorage 删除数据
 */
export function removeFromStorage(key: string): void {
  localStorage.removeItem(key);
}

/**
 * 获取收藏列表
 */
export function getFavorites() {
  return getFromStorage<string[]>(STORAGE_KEYS.FAVORITES) || [];
}

/**
 * 获取历史记录
 */
export function getHistory() {
  return getFromStorage<string[]>(STORAGE_KEYS.HISTORY) || [];
}

/**
 * 获取用户设置
 */
export function getLastUpdated(): string | null {
  return getFromStorage<string>(STORAGE_KEYS.LAST_UPDATED);
}

/**
 * 设置最后更新时间
 */
export function setLastUpdated(date: string): void {
  setToStorage(STORAGE_KEYS.LAST_UPDATED, date);
}

/**
 * 检查是否需要更新（超过24小时）
 */
export function shouldUpdate(lastUpdated: string | null): boolean {
  if (!lastUpdated) return true;
  const now = new Date();
  const last = new Date(lastUpdated);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 1;
}

/**
 * 获取今天的日期字符串
 */
export function getTodayString(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}
