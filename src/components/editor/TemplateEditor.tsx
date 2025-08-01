/**
 * Main Template Editor Component
 *
 * This is the core editor interface that combines the parameter panel,
 * preview canvas, and timeline into a cohesive editing experience.
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ParticleCanvas,
  CanvasLoader,
} from "@/components/canvas/ParticleCanvas";
import { useTemplateStore } from "@/lib/store/templateStore";

export default function TemplateEditor() {
  const [isInitializing, setIsInitializing] = useState(true);

  // Global state with defaults
  const {
    particleCount = 500,
    animationSpeed = 1.0,
    patternType = "wave",
    isPlaying = false,
    isPaused = false,
    fps = 60,
    setParticleCount,
    setAnimationSpeed,
    setPatternType,
    play,
    pause,
    stop,
  } = useTemplateStore();

  // Initialize the template system
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner
          size="lg"
          text="Initializing Particle Dance System..."
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-slate-900">
      {/* Parameter Panel */}
      <div className="w-80 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Parameters
            </h2>
            <div className="space-y-4">
              {/* Particle Count */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-300">
                    Particle Count
                  </label>
                  <span className="text-xs text-purple-400">
                    {(particleCount || 0).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  value={particleCount || 500}
                  onChange={(e) => setParticleCount?.(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Animation Speed */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-300">
                    Animation Speed
                  </label>
                  <span className="text-xs text-purple-400">
                    {(animationSpeed || 1.0).toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  value={animationSpeed || 1.0}
                  onChange={(e) => setAnimationSpeed?.(Number(e.target.value))}
                  step="0.1"
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Pattern Type */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Dance Pattern</label>
                <select
                  value={patternType || "wave"}
                  onChange={(e) => setPatternType?.(e.target.value)}
                  className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="wave">🌊 Contemporary Flow</option>
                  <option value="spiral">🌀 Spiral Formation</option>
                  <option value="bounce">⚡ Rhythmic Beat</option>
                  <option value="flow">💫 Morphing Shapes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-md font-medium text-white mb-2">
              System Status
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Real-time particle dance system
            </p>
            <div className="bg-slate-700 p-3 rounded space-y-1">
              <div className="text-xs text-gray-300">
                Status: {isPlaying ? "▶️ Playing" : "⏸️ Ready"}
              </div>
              <div className="text-xs text-gray-300">
                Particles: {(particleCount || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-300">
                FPS: {(fps || 60).toFixed(0)}
              </div>
              <div className="text-xs text-gray-300">
                Pattern: {patternType}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-md font-medium text-white mb-2">
              Dance Videos
            </h3>
            <div className="space-y-2 text-xs text-gray-400">
              <div>🎬 Video 1: Contemporary Flow</div>
              <div>🎬 Video 2: Rhythmic Beats</div>
              <div className="text-purple-400">
                Patterns inspired by @onno_quist
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas */}
        <div className="flex-1 relative">
          <Suspense fallback={<CanvasLoader />}>
            <ParticleCanvas
              particleCount={particleCount || 500}
              animationSpeed={animationSpeed || 1.0}
              patternType={patternType || "wave"}
            />
          </Suspense>
        </div>

        {/* Timeline Controls */}
        <div className="h-20 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Animation Controls</span>
            <div className="flex space-x-2">
              <button
                onClick={isPlaying ? pause : play}
                className={`px-4 py-1 text-white text-sm rounded transition-colors ${
                  isPlaying
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isPlaying ? "⏸️ Pause" : "▶️ Play"}
              </button>
              <button
                onClick={stop}
                className="px-4 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                ⏹️ Stop
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                style={{ width: isPlaying ? "100%" : "0%" }}
              />
            </div>
            <span className="text-xs text-gray-400 min-w-[60px]">
              {isPlaying ? "Live" : "Ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
