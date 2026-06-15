import { format, formatDistanceToNow, isToday, isYesterday, startOfDay, differenceInDays } from 'date-fns';

/**
 * 格式化日期为易读格式
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

/**
 * 格式化为相对时间（如 "3 hours ago"）
 */
export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

/**
 * 检查是否是今天的数据
 */
export function isTodayData(dateStr: string): boolean {
  return isToday(new Date(dateStr));
}

/**
 * 检查是否需要更新（超过24小时）
 */
export function shouldUpdate(lastUpdated: string | null): boolean {
  if (!lastUpdated) return true;
  const diff = differenceInDays(new Date(), new Date(lastUpdated));
  return diff >= 1;
}

/**
 * 获取今天的日期字符串
 */
export function getTodayString(): string {
  return startOfDay(new Date()).toISOString();
}

/**
 * 获取当前时间 ISO 字符串
 */
export function getNowString(): string {
  return new Date().toISOString();
}
