/**
 * Main Template Editor Component
 *
 * This is the core editor interface that combines the parameter panel,
 * preview canvas, and timeline into a cohesive editing experience.
 */

"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
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
import { DemoShowcase, DemoBanner } from "@/components/demo/DemoShowcase";
import { AdvancedExport } from "@/components/export/AdvancedExport";
import { HelpSystem } from "@/components/help/HelpSystem";
import {
  initializeSamplePresets,
  type DemoPreset,
} from "@/lib/demo/samplePresets";
import {
  ParticleCanvas,
  CanvasLoader,
  type CanvasExportRef,
} from "@/components/canvas/ParticleCanvas";
import { useTemplateStore } from "@/lib/store/templateStore";

export default function TemplateEditor() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(120); // 2 minutes default
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasExportRef = useRef<CanvasExportRef | null>(null);

  // Performance monitoring
  const { stats, updateStats } = usePerformanceMonitor();

  // Global state with defaults
  const {
    particleCount = 500,
    animationSpeed = 1.0,
    patternType = "wave",
    isPlaying = false,
    isPaused = false,
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

    // Initialize sample presets
    initializeSamplePresets();

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
  const handleLoadPreset = (preset: {
    particleCount: number;
    animationSpeed: number;
    patternType: string;
  }) => {
    setParticleCount?.(preset.particleCount);
    setAnimationSpeed?.(preset.animationSpeed);
    setPatternType?.(preset.patternType);
  };

  // Export/Import handlers
  const handleImportSettings = (settings: {
    particleCount?: number;
    animationSpeed?: number;
    patternType?: string;
  }) => {
    if (settings.particleCount !== undefined)
      setParticleCount?.(settings.particleCount);
    if (settings.animationSpeed !== undefined)
      setAnimationSpeed?.(settings.animationSpeed);
    if (settings.patternType !== undefined)
      setPatternType?.(settings.patternType);
  };

  // Demo handlers
  const handleLoadDemoPreset = (preset: DemoPreset) => {
    setParticleCount?.(preset.particleCount);
    setAnimationSpeed?.(preset.animationSpeed);
    setPatternType?.(preset.patternType);
    // Auto-play when loading demo preset
    if (!isPlaying) {
      play?.();
    }
  };

  // Modal handlers
  const handleShowDemo = () => {
    setShowDemo(true);
    setSidebarCollapsed(true); // Collapse sidebar for better demo view
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
    setSidebarCollapsed(false);
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
    onExport: () => setShowAdvancedExport(true),
    onImport: () => console.log("Import shortcut triggered"),
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
          <h2 className="text-base sm:text-lg font-semibold text-white truncate">
            Particle Dance
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            icon={sidebarCollapsed ? "☰" : "×"}
            className="flex-shrink-0"
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
        ${
          isMobile
            ? "w-full"
            : sidebarCollapsed
            ? "w-12 sm:w-16"
            : "w-80 sm:w-96"
        }
        bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300
        ${
          isMobile
            ? "p-3 sm:p-4"
            : sidebarCollapsed
            ? "p-2 sm:p-3"
            : "p-4 sm:p-6"
        } overflow-y-auto custom-scrollbar
      `}
      >
        {/* Collapsed Sidebar Content */}
        {sidebarCollapsed && !isMobile ? (
          <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              icon="▶️"
              className="w-full justify-center p-1 sm:p-2"
            />
            <div className="space-y-1 sm:space-y-2 text-center">
              <div className="text-xs text-gray-400 truncate">
                {(particleCount || 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">
                {(animationSpeed || 1.0).toFixed(1)}x
              </div>
              <div className="text-xl sm:text-2xl">
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
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                Parameters
              </h2>
              <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(true)}
                    icon="◀️"
                    className="hidden sm:flex"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  icon={showAdvanced ? "🔽" : "🔼"}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">
                    {showAdvanced ? "Simple" : "Advanced"}
                  </span>
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
                <h3 className="text-sm sm:text-md font-medium text-white">
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

            {/* Demo Banner */}
            <div className="pt-4 border-t border-slate-700">
              <DemoBanner onShowDemo={handleShowDemo} />
            </div>

            {/* Performance Monitor */}
            <div className="pt-4 border-t border-slate-700">
              <PerformanceMonitor stats={stats} compact />
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm sm:text-md font-medium text-white mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAdvancedExport(true)}
                  icon="📤"
                  className="w-full justify-center sm:justify-start"
                >
                  <span className="hidden sm:inline">Advanced </span>Export
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  icon="❓"
                  className="w-full justify-center sm:justify-start"
                >
                  <span className="hidden sm:inline">Help & </span>Documentation
                </Button>
              </div>
            </div>

            {/* Dance Videos Reference */}
            <div className="pt-4 border-t border-slate-700">
              <h3 className="text-sm sm:text-md font-medium text-white mb-2">
                Inspiration
              </h3>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center space-x-2">
                  <span>🎬</span>
                  <span className="truncate">Video 1: Contemporary Flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎬</span>
                  <span className="truncate">Video 2: Rhythmic Beats</span>
                </div>
                <div className="text-purple-400 mt-2 text-center sm:text-left">
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
              ref={canvasExportRef}
              particleCount={particleCount || 500}
              animationSpeed={animationSpeed || 1.0}
              patternType={patternType || "wave"}
              onCanvasReady={(canvas) => {
                canvasRef.current = canvas;
              }}
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
          className={`${isMobile ? "h-20 sm:h-24" : "h-28 sm:h-32"}`}
        />
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onPlay={isPlaying ? pause : play}
        onPause={pause}
        onStop={stop}
        onReset={() => setCurrentTime(0)}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        onExport={() => setShowAdvancedExport(true)}
        onImport={() => console.log("Import triggered")}
      />

      {/* Demo Showcase Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-3 sm:p-6">
              <DemoShowcase
                onLoadPreset={handleLoadDemoPreset}
                onStartTour={() => {
                  setShowDemo(false);
                  setShowHelp(true);
                }}
              />
              <div className="flex justify-end mt-4 sm:mt-6">
                <Button variant="secondary" onClick={handleCloseDemo}>
                  Close Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Export Modal */}
      {showAdvancedExport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <AdvancedExport
              canvasRef={canvasRef}
              canvasExportRef={canvasExportRef}
              onClose={() => setShowAdvancedExport(false)}
            />
          </div>
        </div>
      )}

      {/* Help System Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <HelpSystem
              onClose={() => setShowHelp(false)}
              initialSection="overview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
