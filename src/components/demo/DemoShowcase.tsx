/**
 * Demo Showcase Component
 *
 * Interactive demonstration of the particle dance system with
 * sample presets, guided tour, and feature highlights.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Controls";
import {
  SAMPLE_PRESETS,
  PRESET_CATEGORIES,
  getPresetsByCategory,
  getRandomPreset,
  initializeSamplePresets,
  type DemoPreset,
} from "@/lib/demo/samplePresets";

interface DemoShowcaseProps {
  onLoadPreset: (preset: DemoPreset) => void;
  onStartTour?: () => void;
  className?: string;
}

export function DemoShowcase({
  onLoadPreset,
  onStartTour,
  className = "",
}: DemoShowcaseProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof PRESET_CATEGORIES>("showcase");
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [currentPresetIndex, setCurrentPresetIndex] = useState(0);

  // Initialize sample presets on mount
  useEffect(() => {
    initializeSamplePresets();
  }, []);

  // Auto demo functionality
  useEffect(() => {
    if (!isAutoDemo) return;

    const interval = setInterval(() => {
      const categoryPresets = getPresetsByCategory(selectedCategory);
      const nextIndex = (currentPresetIndex + 1) % categoryPresets.length;
      setCurrentPresetIndex(nextIndex);
      onLoadPreset(categoryPresets[nextIndex]);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoDemo, selectedCategory, currentPresetIndex, onLoadPreset]);

  const handlePresetClick = (preset: DemoPreset) => {
    onLoadPreset(preset);
    const categoryPresets = getPresetsByCategory(selectedCategory);
    const index = categoryPresets.findIndex((p) => p.id === preset.id);
    setCurrentPresetIndex(index);
  };

  const handleRandomPreset = () => {
    const randomPreset = getRandomPreset();
    onLoadPreset(randomPreset);
    // Update category and index
    setSelectedCategory(randomPreset.category);
    const categoryPresets = getPresetsByCategory(randomPreset.category);
    const index = categoryPresets.findIndex((p) => p.id === randomPreset.id);
    setCurrentPresetIndex(index);
  };

  const getCategoryColor = (category: keyof typeof PRESET_CATEGORIES) => {
    const colors = {
      beginner: "bg-green-500",
      intermediate: "bg-blue-500",
      advanced: "bg-purple-500",
      showcase: "bg-yellow-500",
    };
    return colors[category];
  };

  const getCategoryBorder = (category: keyof typeof PRESET_CATEGORIES) => {
    const colors = {
      beginner: "border-green-500",
      intermediate: "border-blue-500",
      advanced: "border-purple-500",
      showcase: "border-yellow-500",
    };
    return colors[category];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Demo Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">🎭</span>
          <h2 className="text-2xl font-bold text-white">Demo Showcase</h2>
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our curated collection of particle dance patterns. From gentle
          waves to cosmic spirals, discover the full potential of the system.
        </p>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="primary"
            onClick={handleRandomPreset}
            icon="🎲"
            className="animate-pulse-glow"
          >
            Random Preset
          </Button>
          <Button
            variant={isAutoDemo ? "danger" : "secondary"}
            onClick={() => setIsAutoDemo(!isAutoDemo)}
            icon={isAutoDemo ? "⏸️" : "▶️"}
          >
            {isAutoDemo ? "Stop Demo" : "Auto Demo"}
          </Button>
          {onStartTour && (
            <Button variant="ghost" onClick={onStartTour} icon="🎯">
              Guided Tour
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {Object.entries(PRESET_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedCategory(key as keyof typeof PRESET_CATEGORIES);
              setCurrentPresetIndex(0);
              setIsAutoDemo(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === key
                ? `${getCategoryColor(
                    key as keyof typeof PRESET_CATEGORIES
                  )} text-white shadow-lg`
                : "bg-slate-700 text-gray-300 hover:bg-slate-600"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Category Description */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          {PRESET_CATEGORIES[selectedCategory].description}
        </p>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getPresetsByCategory(selectedCategory).map((preset, index) => (
          <div
            key={preset.id}
            className={`bg-slate-800/50 border rounded-lg p-4 transition-all cursor-pointer hover:bg-slate-800/70 hover:scale-105 ${
              isAutoDemo && index === currentPresetIndex
                ? `${getCategoryBorder(
                    selectedCategory
                  )} border-2 shadow-lg animate-glow-pulse`
                : "border-slate-700"
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            {/* Preset Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {preset.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {preset.description}
                </p>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${getCategoryColor(
                  preset.category
                )} ml-2 mt-1`}
              />
            </div>

            {/* Preset Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center space-x-3">
                <span>🔴 {preset.particleCount}</span>
                <span>⚡ {preset.animationSpeed}x</span>
              </div>
              <span className="capitalize">{preset.patternType}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {preset.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {preset.tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-700 text-gray-400 rounded text-xs">
                  +{preset.tags.length - 3}
                </span>
              )}
            </div>

            {/* Load Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePresetClick(preset);
              }}
              className="w-full"
              icon="▶️"
            >
              Load Preset
            </Button>
          </div>
        ))}
      </div>

      {/* Demo Stats */}
      <div className="text-center text-sm text-gray-500 border-t border-slate-700 pt-4">
        <p>
          Showing {getPresetsByCategory(selectedCategory).length} presets in{" "}
          {PRESET_CATEGORIES[selectedCategory].name} category
        </p>
        <p className="mt-1">
          Total: {SAMPLE_PRESETS.length} demo presets available
        </p>
      </div>
    </div>
  );
}

/**
 * Demo Banner Component
 */
interface DemoBannerProps {
  onShowDemo: () => void;
  className?: string;
}

export function DemoBanner({ onShowDemo, className = "" }: DemoBannerProps) {
  return (
    <div
      className={`bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">
            🎭 Try the Demo Showcase
          </h3>
          <p className="text-gray-300 text-sm">
            Explore pre-configured patterns and see what's possible with the
            Particle Dance system.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={onShowDemo}
          icon="✨"
          className="ml-4"
        >
          View Demo
        </Button>
      </div>
    </div>
  );
}
