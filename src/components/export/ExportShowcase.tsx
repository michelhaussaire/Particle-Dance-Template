/**
 * Export Showcase Component
 *
 * Demonstrates the enhanced export functionality with examples,
 * tutorials, and best practices for different export scenarios.
 */

"use client";

import { useState } from "react";
import { Button, Slider, Toggle, Select } from "@/components/ui/Controls";
import {
  EXPORT_PRESETS,
  getFileSizeEstimate,
} from "@/lib/export/mediaExporter";

interface ExportShowcaseProps {
  onClose?: () => void;
  className?: string;
}

export function ExportShowcase({
  onClose,
  className = "",
}: ExportShowcaseProps) {
  const [selectedExample, setSelectedExample] = useState("social-media");
  const [showTutorial, setShowTutorial] = useState(false);

  const examples = [
    {
      id: "social-media",
      name: "Social Media",
      description: "Perfect for Instagram, Twitter, and TikTok",
      icon: "📱",
      presets: ["social-media", "gif-social"],
      tips: [
        "Use 1080x1080 for Instagram posts",
        "Keep GIFs under 10MB for Twitter",
        "Use transparent backgrounds for flexibility",
      ],
    },
    {
      id: "wallpaper",
      name: "Wallpaper",
      description: "High-quality desktop and mobile wallpapers",
      icon: "🖼️",
      presets: ["wallpaper-hd", "wallpaper-4k"],
      tips: [
        "16:9 ratio for desktop wallpapers",
        "9:16 ratio for mobile wallpapers",
        "Use PNG for best quality",
      ],
    },
    {
      id: "video",
      name: "Video Content",
      description: "For YouTube, presentations, and demos",
      icon: "🎬",
      presets: ["video-hd", "video-4k"],
      tips: [
        "Use WebM for web compatibility",
        "60fps for smooth motion",
        "Consider file size for sharing",
      ],
    },
    {
      id: "thumbnail",
      name: "Thumbnails",
      description: "Small preview images and icons",
      icon: "🎯",
      presets: ["thumbnail"],
      tips: [
        "Keep file size small",
        "Use transparent backgrounds",
        "Test at different sizes",
      ],
    },
  ];

  const currentExample = examples.find((ex) => ex.id === selectedExample);

  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Export Showcase</h2>
          <p className="text-gray-400 text-sm">
            Learn about different export scenarios and best practices
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} icon="×">
            Close
          </Button>
        )}
      </div>

      {/* Example Categories */}
      <div className="grid grid-cols-2 gap-3">
        {examples.map((example) => (
          <button
            key={example.id}
            onClick={() => setSelectedExample(example.id)}
            className={`p-4 rounded-lg border transition-all ${
              selectedExample === example.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-slate-600 hover:border-slate-500"
            }`}
          >
            <div className="text-2xl mb-2">{example.icon}</div>
            <div className="text-sm font-medium text-white">{example.name}</div>
            <div className="text-xs text-gray-400 mt-1">
              {example.description}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Example Details */}
      {currentExample && (
        <div className="bg-slate-700/30 rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentExample.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {currentExample.name}
              </h3>
              <p className="text-sm text-gray-400">
                {currentExample.description}
              </p>
            </div>
          </div>

          {/* Recommended Presets */}
          <div>
            <h4 className="text-sm font-medium text-white mb-2">
              Recommended Presets
            </h4>
            <div className="space-y-2">
              {currentExample.presets.map((presetKey) => {
                const preset =
                  EXPORT_PRESETS[presetKey as keyof typeof EXPORT_PRESETS];
                const fileSize = getFileSizeEstimate(preset);

                return (
                  <div
                    key={presetKey}
                    className="flex items-center justify-between p-3 bg-slate-600/30 rounded border border-slate-600"
                  >
                    <div>
                      <div className="text-sm font-medium text-white">
                        {presetKey
                          .replace("-", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                      <div className="text-xs text-gray-400">
                        {preset.width}×{preset.height} •{" "}
                        {preset.format.toUpperCase()}
                        {preset.duration > 0 && ` • ${preset.duration}s`}
                      </div>
                    </div>
                    <div className="text-xs text-purple-400">{fileSize}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h4 className="text-sm font-medium text-white mb-2">
              Best Practices
            </h4>
            <div className="space-y-1">
              {currentExample.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 text-xs text-gray-300"
                >
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Section */}
      <div className="bg-slate-700/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Export Tutorial</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTutorial(!showTutorial)}
            icon={showTutorial ? "🔽" : "🔼"}
          >
            {showTutorial ? "Hide" : "Show"}
          </Button>
        </div>

        {showTutorial && (
          <div className="space-y-3 text-sm text-gray-300">
            <div className="space-y-2">
              <h4 className="text-white font-medium">
                Step 1: Choose Your Format
              </h4>
              <p>Select the right format for your needs:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>PNG:</strong> Best quality, supports transparency
                </li>
                <li>
                  <strong>JPG:</strong> Smaller file size, good for photos
                </li>
                <li>
                  <strong>GIF:</strong> Animated, great for sharing
                </li>
                <li>
                  <strong>WebM/MP4:</strong> Video format, highest quality
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium">Step 2: Set Resolution</h4>
              <p>Choose the right resolution for your platform:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Social Media:</strong> 1080×1080 or 1920×1080
                </li>
                <li>
                  <strong>Desktop Wallpaper:</strong> 1920×1080 or 3840×2160
                </li>
                <li>
                  <strong>Mobile Wallpaper:</strong> 1080×1920
                </li>
                <li>
                  <strong>Thumbnails:</strong> 400×300 or smaller
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium">
                Step 3: Configure Quality
              </h4>
              <p>Balance quality vs file size:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>High Quality (90-100%):</strong> For printing or
                  professional use
                </li>
                <li>
                  <strong>Medium Quality (70-90%):</strong> For web and social
                  media
                </li>
                <li>
                  <strong>Low Quality (50-70%):</strong> For thumbnails or
                  previews
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-medium">
                Step 4: Export Settings
              </h4>
              <p>For animated content:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Duration:</strong> 3-10 seconds for GIFs, 10-30
                  seconds for videos
                </li>
                <li>
                  <strong>Frame Rate:</strong> 24-30 fps for smooth motion
                </li>
                <li>
                  <strong>Background:</strong> Transparent for flexibility,
                  solid for consistency
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowTutorial(!showTutorial)}
          icon="📚"
        >
          {showTutorial ? "Hide Tutorial" : "Show Tutorial"}
        </Button>

        <div className="text-xs text-gray-500">
          💡 Use presets for consistent results
        </div>
      </div>
    </div>
  );
}
