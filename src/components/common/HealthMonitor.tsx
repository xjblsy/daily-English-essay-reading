/**
 * 健康检查与监控模块
 *
 * 功能：
 * - 应用健康状态检测
 * - 性能指标收集
 * - 错误边界捕获
 * - 更新状态监控面板
 */

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { Activity, AlertTriangle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { getUpdateStatus, getUpdateLogs, type UpdateStatus } from '../../services/updateService';

// ===== 健康状态类型 =====

export interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'unknown';
  value: string;
  lastChecked: string;
}

interface HealthContextType {
  metrics: HealthMetric[];
  isChecking: boolean;
  runHealthCheck: () => void;
  updateStatus: UpdateStatus | null;
  recentLogs: Array<{ timestamp: string; level: string; message: string }>;
}

const HealthContext = createContext<HealthContextType | null>(null);

export function useHealthMonitor() {
  const context = useContext(HealthContext);
  if (!context) throw new Error('useHealthMonitor must be used within HealthProvider');
  return context;
}

// ===== 健康检查函数 =====

async function checkApiConnectivity(): Promise<{ reachable: boolean; latencyMs: number }> {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    // 使用 HEAD 请求检测 arXiv API 可达性
    const response = await fetch('https://export.arxiv.org/api/query?search_query=test&max_results=1', {
      method: 'GET',
      signal: controller.signal,
      mode: 'no-cors',
    });
    clearTimeout(timeout);

    return { reachable: true, latencyMs: Math.round(performance.now() - start) };
  } catch {
    return { reachable: false, latencyMs: -1 };
  }
}

function getLocalStorageHealth(): { available: boolean; usageKB: number } {
  try {
    const testKey = '__health_test__';
    localStorage.setItem(testKey, '1'.repeat(1024)); // 写入 1KB
    localStorage.removeItem(testKey);

    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('englearn_')) {
        totalSize += (localStorage.getItem(key)?.length || 0) * 2; // UTF-16 = 2 bytes/char
      }
    }

    return { available: true, usageKB: Math.round(totalSize / 1024) };
  } catch {
    return { available: false, usageKB: -1 };
  }
}

// ===== Provider 组件 =====

interface HealthProviderProps {
  children: ReactNode;
}

export function HealthProvider({ children }: HealthProviderProps) {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null);
  const [recentLogs, setRecentLogs] = useState<Array<{ timestamp: string; level: string; message: string }>>([]);

  const runHealthCheck = useCallback(async () => {
    setIsChecking(true);
    const now = new Date().toISOString();

    try {
      // 并行执行所有健康检查
      const [apiResult, storageResult] = await Promise.all([
        checkApiConnectivity(),
        Promise.resolve(getLocalStorageHealth()),
      ]);

      // 获取更新状态
      const status = getUpdateStatus();
      setUpdateStatus(status);

      // 获取最近日志（最多10条）
      const logs = getUpdateLogs();
      setRecentLogs(logs.slice(0, 10).map(l => ({
        timestamp: l.timestamp,
        level: l.level,
        message: l.message,
      })));

      // 构建健康指标
      const newMetrics: HealthMetric[] = [
        {
          name: 'arXiv API',
          status: apiResult.reachable ? 'healthy' : 'warning',
          value: apiResult.reachable ? `${apiResult.latencyMs}ms` : 'Unreachable',
          lastChecked: now,
        },
        {
          name: 'Local Storage',
          status: storageResult.available ? 'healthy' : 'error',
          value: storageResult.available ? `${storageResult.usageKB} KB` : 'Unavailable',
          lastChecked: now,
        },
        {
          name: 'Content Update',
          status: status.consecutiveFailures === 0
            ? 'healthy'
            : status.consecutiveFailures < 3
              ? 'warning'
              : 'error',
          value: status.source === 'arxiv-api' ? 'Live API' : 'Fallback Data',
          lastChecked: status.lastUpdateAttempt || now,
        },
        {
          name: 'Data Cache',
          status: 'healthy',
          value: `${status.updateCount} updates`,
          lastChecked: now,
        },
      ];

      setMetrics(newMetrics);
    } catch (error) {
      console.error('Health check failed:', error);
      setMetrics([{
        name: 'System',
        status: 'error',
        value: 'Check failed',
        lastChecked: now,
      }]);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // 组件挂载时自动运行一次健康检查
  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  return (
    <HealthContext.Provider value={{ metrics, isChecking, runHealthCheck, updateStatus, recentLogs }}>
      {children}
    </HealthContext.Provider>
  );
}

// ===== 监控面板 UI 组件 =====

const statusIcons = {
  healthy: <CheckCircle2 size={14} className="text-emerald-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  error: <XCircle size={14} className="text-red-400" />,
  unknown: <Activity size={14} className="text-slate-400" />,
};

const statusColors = {
  healthy: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-amber-500/20 bg-amber-500/5',
  error: 'border-red-500/20 bg-red-500/5',
  unknown: 'border-slate-500/20 bg-slate-500/5',
};

export function HealthMonitorPanel() {
  const { metrics, isChecking, runHealthCheck, updateStatus, recentLogs } = useHealthMonitor();

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            System Monitor
          </h2>
          <p className="text-sm text-slate-400">Application health and content update status</p>
        </div>
        <button
          onClick={runHealthCheck}
          disabled={isChecking}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isChecking
              ? 'bg-white/5 text-slate-500 cursor-wait'
              : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
          }`}
        >
          <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''} />
          {isChecking ? 'Checking...' : 'Run Check'}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {metrics.map(metric => (
          <div
            key={metric.name}
            className={`p-4 rounded-xl border ${statusColors[metric.status]} transition-colors`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{metric.name}</span>
              {statusIcons[metric.status]}
            </div>
            <p className="text-lg font-semibold text-white">{metric.value}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {new Date(metric.lastChecked).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Update Status */}
      {updateStatus && (
        <section className="mb-6 p-5 rounded-xl bg-white/[0.03] border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">Content Update Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-white">{updateStatus.successCount}</p>
              <p className="text-[11px] text-emerald-400">Successes</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{updateStatus.failureCount}</p>
              <p className="text-[11px] text-red-400">Failures</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{updateStatus.consecutiveFailures}</p>
              <p className="text-[11px] text-amber-400">Consecutive Fails</p>
            </div>
            <div>
              <p className="text-sm font-semibold capitalize text-white">{updateStatus.source.replace('-', ' ')}</p>
              <p className="text-[11px] text-slate-400">Data Source</p>
            </div>
          </div>

          {updateStatus.lastError && (
            <div className="mt-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-xs text-red-300 font-mono break-all">{updateStatus.lastError}</p>
            </div>
          )}
        </section>
      )}

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
        <section className="p-5 rounded-xl bg-white/[0.03] border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">Recent Activity Log</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 text-xs py-1.5 border-b border-white/5 last:border-0">
                <span className={`font-mono shrink-0 ${
                  log.level === 'error' ? 'text-red-400' :
                  log.level === 'warn' ? 'text-amber-400' :
                  'text-slate-500'
                }`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-slate-400 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-slate-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
