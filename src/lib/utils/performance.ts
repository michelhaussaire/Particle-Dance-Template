/**
 * Performance Optimization Utilities
 *
 * Tools for monitoring and optimizing particle system performance,
 * including adaptive quality settings and frame rate management.
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  particleCount: number;
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
}

export interface PerformanceConfig {
  targetFPS: number;
  minFPS: number;
  maxParticles: number;
  adaptiveQuality: boolean;
  qualityLevels: QualityLevel[];
}

export interface QualityLevel {
  name: string;
  maxParticles: number;
  connectionDistance: number;
  trailLength: number;
  glowIntensity: number;
  updateFrequency: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private frameHistory: number[] = [];
  private lastFrameTime: number = 0;
  private config: PerformanceConfig;
  private currentQualityIndex: number = 2; // Start with medium quality

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = {
      targetFPS: 60,
      minFPS: 30,
      maxParticles: 2000,
      adaptiveQuality: true,
      qualityLevels: [
        {
          name: "low",
          maxParticles: 200,
          connectionDistance: 40,
          trailLength: 5,
          glowIntensity: 0.3,
          updateFrequency: 30,
        },
        {
          name: "medium",
          maxParticles: 500,
          connectionDistance: 60,
          trailLength: 10,
          glowIntensity: 0.6,
          updateFrequency: 60,
        },
        {
          name: "high",
          maxParticles: 1000,
          connectionDistance: 80,
          trailLength: 15,
          glowIntensity: 0.8,
          updateFrequency: 60,
        },
        {
          name: "ultra",
          maxParticles: 2000,
          connectionDistance: 100,
          trailLength: 20,
          glowIntensity: 1.0,
          updateFrequency: 60,
        },
      ],
      ...config,
    };

    this.metrics = {
      fps: 60,
      frameTime: 16.67,
      particleCount: 0,
      renderTime: 0,
      updateTime: 0,
      memoryUsage: 0,
    };
  }

  /**
   * Update performance metrics
   */
  updateMetrics(
    frameTime: number,
    particleCount: number,
    renderTime?: number,
    updateTime?: number
  ): void {
    this.metrics.frameTime = frameTime;
    this.metrics.fps = frameTime > 0 ? 1000 / frameTime : 0;
    this.metrics.particleCount = particleCount;

    if (renderTime !== undefined) this.metrics.renderTime = renderTime;
    if (updateTime !== undefined) this.metrics.updateTime = updateTime;

    // Update frame history for smoothing
    this.frameHistory.push(this.metrics.fps);
    if (this.frameHistory.length > 60) {
      // Keep last 60 frames
      this.frameHistory.shift();
    }

    // Update memory usage if available
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    // Auto-adjust quality if enabled
    if (this.config.adaptiveQuality) {
      this.adjustQuality();
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get smoothed FPS over recent frames
   */
  getSmoothedFPS(): number {
    if (this.frameHistory.length === 0) return this.metrics.fps;

    const sum = this.frameHistory.reduce((a, b) => a + b, 0);
    return sum / this.frameHistory.length;
  }

  /**
   * Check if performance is acceptable
   */
  isPerformanceGood(): boolean {
    const smoothedFPS = this.getSmoothedFPS();
    return smoothedFPS >= this.config.minFPS;
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): QualityLevel {
    return this.config.qualityLevels[this.currentQualityIndex];
  }

  /**
   * Manually set quality level
   */
  setQuality(qualityName: string): void {
    const index = this.config.qualityLevels.findIndex(
      (q) => q.name === qualityName
    );
    if (index !== -1) {
      this.currentQualityIndex = index;
    }
  }

  /**
   * Auto-adjust quality based on performance
   */
  private adjustQuality(): void {
    const smoothedFPS = this.getSmoothedFPS();
    const currentQuality = this.getCurrentQuality();

    // If FPS is too low, reduce quality
    if (smoothedFPS < this.config.minFPS && this.currentQualityIndex > 0) {
      this.currentQualityIndex--;
      console.log(
        `Performance: Reduced quality to ${
          this.getCurrentQuality().name
        } (FPS: ${smoothedFPS.toFixed(1)})`
      );
    }
    // If FPS is good and we're not at max quality, try to increase
    else if (
      smoothedFPS > this.config.targetFPS * 0.9 &&
      this.currentQualityIndex < this.config.qualityLevels.length - 1
    ) {
      // Only increase quality after sustained good performance
      if (
        this.frameHistory.length >= 30 &&
        this.frameHistory
          .slice(-30)
          .every((fps) => fps > this.config.targetFPS * 0.8)
      ) {
        this.currentQualityIndex++;
        console.log(
          `Performance: Increased quality to ${
            this.getCurrentQuality().name
          } (FPS: ${smoothedFPS.toFixed(1)})`
        );
      }
    }
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const smoothedFPS = this.getSmoothedFPS();

    if (smoothedFPS < this.config.minFPS) {
      recommendations.push("Reduce particle count for better performance");
      recommendations.push("Disable particle connections");
      recommendations.push("Reduce animation complexity");
    }

    if (this.metrics.memoryUsage > 100) {
      // 100MB
      recommendations.push("High memory usage detected");
      recommendations.push("Consider reducing particle lifetime");
    }

    if (this.metrics.particleCount > this.getCurrentQuality().maxParticles) {
      recommendations.push(
        "Particle count exceeds recommended limit for current quality"
      );
    }

    return recommendations;
  }

  /**
   * Create performance report
   */
  generateReport(): string {
    const quality = this.getCurrentQuality();
    const smoothedFPS = this.getSmoothedFPS();

    return `
Performance Report:
- FPS: ${smoothedFPS.toFixed(1)} (target: ${this.config.targetFPS})
- Frame Time: ${this.metrics.frameTime.toFixed(2)}ms
- Particles: ${this.metrics.particleCount}
- Quality: ${quality.name}
- Memory: ${this.metrics.memoryUsage.toFixed(1)}MB
- Render Time: ${this.metrics.renderTime.toFixed(2)}ms
- Update Time: ${this.metrics.updateTime.toFixed(2)}ms
    `.trim();
  }
}

/**
 * Utility functions for performance optimization
 */

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function requestIdleCallback(callback: () => void): void {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 16); // Fallback for browsers without requestIdleCallback
  }
}

export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`${name}: ${(end - start).toFixed(2)}ms`);
  return result;
}

export function createObjectPool<T>(
  createFn: () => T,
  resetFn: (obj: T) => void,
  initialSize: number = 10
): {
  get: () => T;
  release: (obj: T) => void;
  size: () => number;
} {
  const pool: T[] = [];

  // Pre-populate pool
  for (let i = 0; i < initialSize; i++) {
    pool.push(createFn());
  }

  return {
    get: () => {
      if (pool.length > 0) {
        return pool.pop()!;
      }
      return createFn();
    },

    release: (obj: T) => {
      resetFn(obj);
      pool.push(obj);
    },

    size: () => pool.length,
  };
}

/**
 * Canvas optimization utilities
 */
export function optimizeCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Enable hardware acceleration hints
  ctx.imageSmoothingEnabled = false;

  // Set optimal composite operation
  ctx.globalCompositeOperation = "source-over";

  // Disable text metrics for better performance
  if ("textRenderingOptimization" in ctx) {
    (ctx as any).textRenderingOptimization = "speed";
  }
}

export function clearCanvasOptimized(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  // Use clearRect instead of fillRect for better performance
  ctx.clearRect(0, 0, width, height);

  // Or use fillRect with composite operation for fade effects
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.globalAlpha = 0.1;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
