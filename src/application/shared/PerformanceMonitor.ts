import { Logger } from './Logger';

export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
  success?: boolean;
  error?: string;
}

export interface PerformanceThreshold {
  warning: number; // ms
  critical: number; // ms
}

export interface PerformanceAlert {
  metric: PerformanceMetric;
  threshold: PerformanceThreshold;
  level: 'warning' | 'critical';
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private alerts: PerformanceAlert[] = [];
  private maxAlerts: number = 100;

  constructor(private readonly logger: Logger) {
    this.setupDefaultThresholds();
  }

  private setupDefaultThresholds(): void {
    // Default thresholds for common operations
    this.setThreshold('api.request', { warning: 1000, critical: 3000 });
    this.setThreshold('database.query', { warning: 500, critical: 1500 });
    this.setThreshold('file.operation', { warning: 2000, critical: 5000 });
    this.setThreshold('auth.operation', { warning: 800, critical: 2000 });
    this.setThreshold('render.component', { warning: 100, critical: 300 });
  }

  /**
   * Set performance threshold for a specific operation
   */
  setThreshold(operation: string, threshold: PerformanceThreshold): void {
    this.thresholds.set(operation, threshold);
  }

  /**
   * Start measuring a performance metric
   */
  startTimer(name: string, metadata?: Record<string, unknown>): string {
    const id = `${name}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.metrics.set(id, metric);

    this.logger.debug(`Performance timer started: ${name}`, {
      metricId: id,
      ...metadata,
    });

    return id;
  }

  /**
   * End measuring a performance metric
   */
  endTimer(
    id: string,
    success: boolean = true,
    error?: string,
    additionalMetadata?: Record<string, unknown>
  ): PerformanceMetric | null {
    const metric = this.metrics.get(id);
    if (!metric) {
      this.logger.warn(`Performance timer not found: ${id}`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = success;
    metric.error = error;

    // Merge additional metadata
    if (additionalMetadata) {
      metric.metadata = { ...metric.metadata, ...additionalMetadata };
    }

    // Log the metric
    this.logMetric(metric);

    // Check thresholds and create alerts if necessary
    this.checkThresholds(metric);

    // Clean up
    this.metrics.delete(id);

    return metric;
  }

  /**
   * Measure an async operation automatically
   */
  async measure<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    const id = this.startTimer(name, metadata);

    try {
      const result = await operation();
      this.endTimer(id, true, undefined, { success: true });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.endTimer(id, false, errorMessage, { success: false });
      throw error;
    }
  }

  /**
   * Measure a synchronous operation
   */
  measureSync<T>(
    name: string,
    operation: () => T,
    metadata?: Record<string, unknown>
  ): T {
    const id = this.startTimer(name, metadata);

    try {
      const result = operation();
      this.endTimer(id, true, undefined, { success: true });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.endTimer(id, false, errorMessage, { success: false });
      throw error;
    }
  }

  /**
   * Log performance metric
   */
  private logMetric(metric: PerformanceMetric): void {
    const logData: Record<string, unknown> = {
      operation: metric.name,
      duration: Math.round(metric.duration!),
      success: metric.success,
      metadata: metric.metadata,
    };

    if (metric.error) {
      logData.error = metric.error;
    }

    if (metric.success) {
      this.logger.info(
        `Performance: ${metric.name} completed in ${Math.round(metric.duration!)}ms`,
        logData
      );
    } else {
      this.logger.error(
        `Performance: ${metric.name} failed after ${Math.round(metric.duration!)}ms`,
        logData
      );
    }
  }

  /**
   * Check if metric exceeds thresholds and create alerts
   */
  private checkThresholds(metric: PerformanceMetric): void {
    if (!metric.duration) return;

    const threshold = this.thresholds.get(metric.name);
    if (!threshold) return;

    let alertLevel: 'warning' | 'critical' | null = null;

    if (metric.duration >= threshold.critical) {
      alertLevel = 'critical';
    } else if (metric.duration >= threshold.warning) {
      alertLevel = 'warning';
    }

    if (alertLevel) {
      const alert: PerformanceAlert = {
        metric,
        threshold,
        level: alertLevel,
      };

      this.addAlert(alert);
      this.logAlert(alert);
    }
  }

  /**
   * Add alert to the alerts list
   */
  private addAlert(alert: PerformanceAlert): void {
    this.alerts.push(alert);

    // Keep only the most recent alerts
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }
  }

  /**
   * Log performance alert
   */
  private logAlert(alert: PerformanceAlert): void {
    const logData: Record<string, unknown> = {
      operation: alert.metric.name,
      duration: Math.round(alert.metric.duration!),
      threshold: alert.threshold,
      success: alert.metric.success,
      metadata: alert.metric.metadata,
    };

    if (alert.metric.error) {
      logData.error = alert.metric.error;
    }

    if (alert.level === 'critical') {
      this.logger.error(
        `Performance Alert: ${alert.metric.name} exceeded critical threshold (${Math.round(alert.metric.duration!)}ms > ${alert.threshold.critical}ms)`,
        logData
      );
    } else {
      this.logger.warn(
        `Performance Warning: ${alert.metric.name} exceeded warning threshold (${Math.round(alert.metric.duration!)}ms > ${alert.threshold.warning}ms)`,
        logData
      );
    }
  }

  /**
   * Get performance statistics
   */
  getStatistics(): {
    totalMetrics: number;
    activeMetrics: number;
    totalAlerts: number;
    criticalAlerts: number;
    warningAlerts: number;
    recentAlerts: PerformanceAlert[];
  } {
    const criticalAlerts = this.alerts.filter(
      (alert) => alert.level === 'critical'
    ).length;
    const warningAlerts = this.alerts.filter(
      (alert) => alert.level === 'warning'
    ).length;
    const recentAlerts = this.alerts.slice(-10); // Last 10 alerts

    return {
      totalMetrics: this.metrics.size + this.alerts.length,
      activeMetrics: this.metrics.size,
      totalAlerts: this.alerts.length,
      criticalAlerts,
      warningAlerts,
      recentAlerts,
    };
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(limit: number = 50): PerformanceAlert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts = [];
    this.logger.info('Performance alerts cleared');
  }

  /**
   * Get active metrics (in-progress timers)
   */
  getActiveMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Force cleanup of old metrics (those running longer than 5 minutes)
   */
  cleanup(): void {
    const now = performance.now();
    const timeout = 5 * 60 * 1000; // 5 minutes

    for (const [id, metric] of this.metrics.entries()) {
      if (now - metric.startTime > timeout) {
        this.metrics.delete(id);
        this.logger.warn(
          `Performance timer timeout and cleaned up: ${metric.name}`,
          {
            metricId: id,
            duration: now - metric.startTime,
          }
        );
      }
    }
  }
}
