/**
 * Preset Manager Component
 *
 * Handles saving, loading, and managing dance pattern presets
 * with local storage and import/export functionality.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "./Controls";

interface Preset {
  id: string;
  name: string;
  description?: string;
  particleCount: number;
  animationSpeed: number;
  patternType: string;
  createdAt: string;
  thumbnail?: string;
}

interface PresetManagerProps {
  currentSettings: {
    particleCount: number;
    animationSpeed: number;
    patternType: string;
  };
  onLoadPreset: (preset: Preset) => void;
  className?: string;
}

export function PresetManager({
  currentSettings,
  onLoadPreset,
  className = "",
}: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDescription, setNewPresetDescription] = useState("");

  // Load presets from localStorage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem("particle-dance-presets");
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (error) {
        console.error("Failed to load presets:", error);
      }
    }
  }, []);

  // Save presets to localStorage whenever presets change
  useEffect(() => {
    localStorage.setItem("particle-dance-presets", JSON.stringify(presets));
  }, [presets]);

  const savePreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: newPresetName.trim(),
      description: newPresetDescription.trim() || undefined,
      ...currentSettings,
      createdAt: new Date().toISOString(),
    };

    setPresets((prev) => [newPreset, ...prev]);
    setNewPresetName("");
    setNewPresetDescription("");
    setIsCreating(false);
  };

  const deletePreset = (id: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== id));
  };

  const exportPresets = () => {
    const dataStr = JSON.stringify(presets, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "particle-dance-presets.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const importPresets = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPresets = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedPresets)) {
            setPresets((prev) => [...importedPresets, ...prev]);
          }
        } catch (error) {
          console.error("Failed to import presets:", error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPatternIcon = (patternType: string) => {
    const icons = {
      wave: "🌊",
      spiral: "🌀",
      bounce: "⚡",
      flow: "💫",
    };
    return icons[patternType as keyof typeof icons] || "✨";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-semibold text-white">
          Presets
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreating(true)}
            icon="+"
            className="flex-1 min-w-0 justify-center sm:justify-start"
          >
            Save Preset
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={importPresets}
              icon="📁"
              className="flex-1 sm:flex-none px-3 sm:px-2 justify-center"
            >
              <span className="sm:hidden">Import</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportPresets}
              disabled={presets.length === 0}
              icon="💾"
              className="flex-1 sm:flex-none px-3 sm:px-2 justify-center"
            >
              <span className="sm:hidden">Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Create New Preset Modal */}
      {isCreating && (
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 sm:p-4 space-y-3">
          <h4 className="text-sm font-medium text-white">
            Save Current Settings
          </h4>
          <input
            type="text"
            placeholder="Preset name..."
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:border-purple-500 focus:outline-none text-sm touch-manipulation min-h-[44px]"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optional)..."
            value={newPresetDescription}
            onChange={(e) => setNewPresetDescription(e.target.value)}
            className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:border-purple-500 focus:outline-none text-sm touch-manipulation min-h-[44px]"
          />
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false);
                setNewPresetName("");
                setNewPresetDescription("");
              }}
              className="order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={savePreset}
              disabled={!newPresetName.trim()}
              className="order-1 sm:order-2"
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Presets List */}
      <div className="space-y-2 max-h-60 sm:max-h-60 overflow-y-auto custom-scrollbar">
        {presets.length === 0 ? (
          <div className="text-center py-4 sm:py-6 text-gray-400">
            <div className="text-xl sm:text-2xl mb-2">🎭</div>
            <p className="text-sm">No presets saved yet</p>
            <p className="text-xs text-gray-500 mt-1 px-2">
              Save your current settings to create your first preset
            </p>
          </div>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg p-2 sm:p-2 transition-colors group"
            >
              {/* Header with icon, name and actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-sm flex-shrink-0">
                    {getPatternIcon(preset.patternType)}
                  </span>
                  <h4 className="text-sm font-medium text-white truncate">
                    {preset.name}
                  </h4>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <button
                    onClick={() => onLoadPreset(preset)}
                    className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors touch-manipulation min-h-[32px] flex-1 sm:flex-none"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors touch-manipulation min-h-[32px] min-w-[32px]"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Description */}
              {preset.description && (
                <p className="text-xs text-gray-400 mb-2 line-clamp-2 sm:line-clamp-1">
                  {preset.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span>{preset.particleCount.toLocaleString()} particles</span>
                  <span>{preset.animationSpeed}x speed</span>
                </div>
                <span className="text-right">
                  {formatDate(preset.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
