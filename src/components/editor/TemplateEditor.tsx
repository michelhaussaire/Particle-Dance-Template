/**
 * Main Template Editor Component
 *
 * This is the core editor interface that combines the parameter panel,
 * preview canvas, and timeline into a cohesive editing experience.
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Slider, Toggle, Select, Button } from "@/components/ui/Controls";
import { PresetManager } from "@/components/ui/PresetManager";
import { Timeline } from "@/components/ui/Timeline";
import {
  PerformanceMonitor,
  usePerformanceMonitor,
} from "@/components/ui/PerformanceMonitor";
import {
  KeyboardShortcuts,
  useKeyboardShortcuts,
} from "@/components/ui/KeyboardShortcuts";
import { ExportImport } from "@/components/ui/ExportImport";
import {
  ParticleCanvas,
  CanvasLoader,
} from "@/components/canvas/ParticleCanvas";
import { useTemplateStore } from "@/lib/store/templateStore";

export default function TemplateEditor() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 2 minutes default
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Performance monitoring
  const { stats, updateStats } = usePerformanceMonitor();

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

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update performance stats
  useEffect(() => {
    const interval = setInterval(() => {
      updateStats(particleCount, 16.67, 8.33); // Mock render/update times
    }, 100);

    return () => clearInterval(interval);
  }, [particleCount, updateStats]);

  // Timeline handlers
  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  // Preset handlers
  const handleLoadPreset = (preset: any) => {
    setParticleCount?.(preset.particleCount);
    setAnimationSpeed?.(preset.animationSpeed);
    setPatternType?.(preset.patternType);
  };

  // Export/Import handlers
  const handleImportSettings = (settings: any) => {
    if (settings.particleCount !== undefined)
      setParticleCount?.(settings.particleCount);
    if (settings.animationSpeed !== undefined)
      setAnimationSpeed?.(settings.animationSpeed);
    if (settings.patternType !== undefined)
      setPatternType?.(settings.patternType);
  };

  const patternOptions = [
    { value: "wave", label: "Contemporary Flow", icon: "🌊" },
    { value: "spiral", label: "Spiral Formation", icon: "🌀" },
    { value: "bounce", label: "Rhythmic Beat", icon: "⚡" },
    { value: "flow", label: "Morphing Shapes", icon: "💫" },
  ];

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlay: isPlaying ? pause : play,
    onPause: pause,
    onStop: stop,
    onReset: () => setCurrentTime(0),
    onToggleAdvanced: () => setShowAdvanced(!showAdvanced),
    onExport: () => {
      // Trigger export modal - this would be handled by the ExportImport component
      console.log("Export shortcut triggered");
    },
    onImport: () => {
      // Trigger import modal - this would be handled by the ExportImport component
      console.log("Import shortcut triggered");
    },
  });

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
    <div className="w-full h-full flex flex-col md:flex-row bg-slate-900 relative">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 p-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Particle Dance</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            icon={sidebarCollapsed ? "☰" : "×"}
          >
            {sidebarCollapsed ? "Controls" : "Close"}
          </Button>
        </div>
      )}

      {/* Parameter Panel */}
      <div
        className={`
        ${
          isMobile
            ? `absolute top-14 left-0 right-0 bottom-0 z-20 transform transition-transform duration-300 ${
                sidebarCollapsed ? "translate-y-full" : "translate-y-0"
              }`
            : "relative"
        }
        ${isMobile ? "w-full" : sidebarCollapsed ? "w-16" : "w-96"}
        bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300
        ${isMobile ? "p-4" : "p-6"} overflow-y-auto custom-scrollbar
      `}
      >
        {/* Collapsed Sidebar Content */}
        {sidebarCollapsed && !isMobile ? (
          <div className="space-y-4 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              icon="▶️"
              className="w-full justify-center"
            />
            <div className="space-y-2 text-center">
              <div className="text-xs text-gray-400">
                {(particleCount || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {(animationSpeed || 1.0).toFixed(1)}x
              </div>
              <div className="text-2xl">
                {patternOptions.find((p) => p.value === patternType)?.icon ||
                  "✨"}
              </div>
              <div
                className={`w-2 h-2 rounded-full mx-auto ${
                  isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-500"
                }`}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Parameters</h2>
              <div className="flex space-x-2">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(true)}
                    icon="◀️"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  icon={showAdvanced ? "🔽" : "🔼"}
                >
                  {showAdvanced ? "Simple" : "Advanced"}
                </Button>
              </div>
            </div>

            {/* Core Parameters */}
            <div className="space-y-4">
              <Slider
                label="Particle Count"
                value={particleCount || 500}
                min={10}
                max={2000}
                step={10}
                onChange={(value) => setParticleCount?.(value)}
                description="Number of particles in the system"
              />

              <Slider
                label="Animation Speed"
                value={animationSpeed || 1.0}
                min={0.1}
                max={5.0}
                step={0.1}
                onChange={(value) => setAnimationSpeed?.(value)}
                unit="x"
                description="Speed multiplier for all animations"
              />

              <Select
                label="Dance Pattern"
                value={patternType || "wave"}
                onChange={(value) => setPatternType?.(value)}
                options={patternOptions}
              />
            </div>

            {/* Advanced Controls */}
            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-md font-medium text-white">
                  Advanced Settings
                </h3>

                <Toggle
                  label="Auto-Loop Animation"
                  checked={true}
                  onChange={() => {}}
                  description="Automatically restart animation when it ends"
                />

                <Toggle
                  label="Performance Mode"
                  checked={particleCount > 1000}
                  onChange={() => {}}
                  description="Optimize rendering for high particle counts"
                />

                <Slider
                  label="Trail Length"
                  value={0.08}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  onChange={() => {}}
                  description="Length of particle trails"
                />

                <Slider
                  label="Blur Intensity"
                  value={1.0}
                  min={0.0}
                  max={3.0}
                  step={0.1}
                  onChange={() => {}}
                  description="Motion blur effect intensity"
                />
              </div>
            )}

            {/* Preset Management */}
            <div className="pt-4 border-t border-slate-700">
              <PresetManager
                currentSettings={{
                  particleCount: particleCount || 500,
                  animationSpeed: animationSpeed || 1.0,
                  patternType: patternType || "wave",
                }}
                onLoadPreset={handleLoadPreset}
              />
            </div>

            {/* Export/Import */}
            <div className="pt-4 border-t border-slate-700">
              <ExportImport
                currentSettings={{
                  particleCount: particleCount || 500,
                  animationSpeed: animationSpeed || 1.0,
                  patternType: patternType || "wave",
                }}
                onImportSettings={handleImportSettings}
              />
            </div>

            {/* Performance Monitor */}
            <div className="pt-4 border-t border-slate-700">
              <PerformanceMonitor stats={stats} compact />
            </div>

            {/* Dance Videos Reference */}
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-md font-medium text-white mb-2">
                Inspiration
              </h3>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <span>🎬</span>
                  <span>Video 1: Contemporary Flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎬</span>
                  <span>Video 2: Rhythmic Beats</span>
                </div>
                <div className="text-purple-400 mt-2">
                  Patterns inspired by @onno_quist
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Canvas Area */}
      <div
        className={`flex-1 flex flex-col ${
          isMobile && !sidebarCollapsed ? "opacity-20 pointer-events-none" : ""
        } transition-opacity duration-300`}
      >
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

        {/* Enhanced Timeline Controls */}
        <Timeline
          isPlaying={isPlaying}
          isPaused={isPaused}
          currentTime={currentTime}
          duration={duration}
          onPlay={play}
          onPause={pause}
          onStop={stop}
          onSeek={handleSeek}
          keyframes={[
            { time: 10, label: "Pattern Change", type: "pattern" },
            { time: 30, label: "Speed Boost", type: "speed" },
            { time: 60, label: "Particle Burst", type: "count" },
            { time: 90, label: "Flow Transition", type: "custom" },
          ]}
          className={`${isMobile ? "h-24" : "h-32"}`}
        />
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onPlay={isPlaying ? pause : play}
        onPause={pause}
        onStop={stop}
        onReset={() => setCurrentTime(0)}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        onExport={() => console.log("Export triggered")}
        onImport={() => console.log("Import triggered")}
      />
    </div>
  );
}
