/**
 * Performance Monitor Component
 * 
 * Real-time monitoring of particle system performance including
 * FPS, memory usage, particle count, and render statistics.
 */

"use client";

import { useState, useEffect, useRef } from "react";

interface PerformanceStats {
  fps: number;
  frameTime: number;
  particleCount: number;
  memoryUsage?: number;
  gpuMemory?: number;
  renderTime: number;
  updateTime: number;
}

interface PerformanceMonitorProps {
  stats: PerformanceStats;
  className?: string;
  compact?: boolean;
}

export function PerformanceMonitor({
  stats,
  className = "",
  compact = false,
}: PerformanceMonitorProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [history, setHistory] = useState<PerformanceStats[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update performance history
  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, stats].slice(-60); // Keep last 60 frames
      return newHistory;
    });
  }, [stats]);

  // Draw performance graph
  useEffect(() => {
    if (!showGraph || !canvasRef.current || history.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // Draw FPS graph
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    history.forEach((stat, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - (stat.fps / 120) * height; // Scale to 120 FPS max
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw frame time graph
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 1;
    ctx.beginPath();

    history.forEach((stat, index) => {
      const x = (index / (history.length - 1)) * width;
      const y = height - (stat.frameTime / 33.33) * height; // Scale to 33.33ms max (30fps)
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw grid lines
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Horizontal lines (FPS markers)
    [30, 60, 90, 120].forEach(fps => {
      const y = height - (fps / 120) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    });

  }, [history, showGraph]);

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  const getPerformanceStatus = (fps: number) => {
    if (fps >= 55) return { status: "Excellent", color: "bg-green-500" };
    if (fps >= 30) return { status: "Good", color: "bg-yellow-500" };
    return { status: "Poor", color: "bg-red-500" };
  };

  if (compact && !isExpanded) {
    const { status, color } = getPerformanceStatus(stats.fps);
    
    return (
      <div 
        className={`bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 cursor-pointer hover:bg-slate-800 transition-colors ${className}`}
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-xs text-gray-300">
            {stats.fps.toFixed(0)} FPS
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-400">{status}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg ${className}`}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white flex items-center space-x-2">
            <span>📊</span>
            <span>Performance</span>
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setShowGraph(!showGraph)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                showGraph 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Graph
            </button>
            {compact && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs px-2 py-1 bg-slate-700 text-gray-300 hover:bg-slate-600 rounded transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Performance Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-slate-700/30 rounded p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">FPS</span>
              <div className={`w-2 h-2 rounded-full ${getPerformanceStatus(stats.fps).color}`} />
            </div>
            <div className={`text-lg font-mono font-bold ${getPerformanceColor(stats.fps)}`}>
              {stats.fps.toFixed(0)}
            </div>
          </div>

          <div className="bg-slate-700/30 rounded p-2">
            <span className="text-xs text-gray-400">Frame Time</span>
            <div className="text-lg font-mono font-bold text-blue-400">
              {stats.frameTime.toFixed(1)}
              <span className="text-xs text-gray-500 ml-1">ms</span>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded p-2">
            <span className="text-xs text-gray-400">Particles</span>
            <div className="text-lg font-mono font-bold text-purple-400">
              {stats.particleCount.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-700/30 rounded p-2">
            <span className="text-xs text-gray-400">Render Time</span>
            <div className="text-lg font-mono font-bold text-pink-400">
              {stats.renderTime.toFixed(1)}
              <span className="text-xs text-gray-500 ml-1">ms</span>
            </div>
          </div>
        </div>

        {/* Performance Graph */}
        {showGraph && (
          <div className="bg-slate-700/30 rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Performance History</span>
              <div className="flex space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-0.5 bg-purple-500" />
                  <span className="text-gray-400">FPS</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-0.5 bg-pink-500" />
                  <span className="text-gray-400">Frame Time</span>
                </div>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={240}
              height={80}
              className="w-full h-20 rounded"
            />
          </div>
        )}

        {/* Memory Usage (if available) */}
        {stats.memoryUsage && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Memory Usage</span>
              <span className="text-gray-300">
                {(stats.memoryUsage / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                style={{ width: `${Math.min(100, (stats.memoryUsage / (100 * 1024 * 1024)) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Performance Tips */}
        {stats.fps < 30 && (
          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs">
            <div className="flex items-center space-x-1 text-yellow-400 mb-1">
              <span>⚠️</span>
              <span className="font-medium">Performance Warning</span>
            </div>
            <p className="text-gray-300">
              Consider reducing particle count or animation complexity for better performance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hook for collecting performance statistics
 */
export function usePerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 60,
    frameTime: 16.67,
    particleCount: 0,
    renderTime: 0,
    updateTime: 0,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);

  const updateStats = (particleCount: number, renderTime: number, updateTime: number) => {
    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    
    frameCountRef.current++;
    
    // Calculate FPS every 10 frames
    if (frameCountRef.current % 10 === 0) {
      const fps = 1000 / deltaTime;
      fpsHistoryRef.current.push(fps);
      
      // Keep only last 60 FPS readings
      if (fpsHistoryRef.current.length > 60) {
        fpsHistoryRef.current.shift();
      }
      
      const averageFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
      
      setStats({
        fps: averageFps,
        frameTime: deltaTime,
        particleCount,
        renderTime,
        updateTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize,
      });
    }
    
    lastTimeRef.current = now;
  };

  return { stats, updateStats };
}