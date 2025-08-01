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
        <h3 className="text-lg font-semibold text-white">Presets</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreating(true)}
            icon="+"
            className="flex-1 min-w-0"
          >
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={importPresets}
            icon="📁"
            className="px-2"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={exportPresets}
            disabled={presets.length === 0}
            icon="💾"
            className="px-2"
          />
        </div>
      </div>

      {/* Create New Preset Modal */}
      {isCreating && (
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-white">
            Save Current Settings
          </h4>
          <input
            type="text"
            placeholder="Preset name..."
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none text-sm"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optional)..."
            value={newPresetDescription}
            onChange={(e) => setNewPresetDescription(e.target.value)}
            className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none text-sm"
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCreating(false);
                setNewPresetName("");
                setNewPresetDescription("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={savePreset}
              disabled={!newPresetName.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Presets List */}
      <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
        {presets.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <div className="text-2xl mb-2">🎭</div>
            <p className="text-sm">No presets saved yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Save your current settings to create your first preset
            </p>
          </div>
        ) : (
          presets.map((preset) => (
            <div
              key={preset.id}
              className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-lg p-2 transition-colors group"
            >
              {/* Header with icon, name and actions */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-sm">
                    {getPatternIcon(preset.patternType)}
                  </span>
                  <h4 className="text-sm font-medium text-white truncate">
                    {preset.name}
                  </h4>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onLoadPreset(preset)}
                    className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deletePreset(preset.id)}
                    className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Description */}
              {preset.description && (
                <p className="text-xs text-gray-400 mb-2 line-clamp-1">
                  {preset.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  <span>{preset.particleCount.toLocaleString()}</span>
                  <span>{preset.animationSpeed}x</span>
                </div>
                <span>{formatDate(preset.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
