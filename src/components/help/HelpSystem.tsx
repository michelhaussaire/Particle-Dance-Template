/**
 * Comprehensive Help System
 *
 * Interactive documentation, tutorials, and help for the
 * Particle Dance Template System with guided tours.
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Controls";

interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  category: "getting-started" | "controls" | "presets" | "export" | "advanced";
}

interface HelpSystemProps {
  onClose?: () => void;
  initialSection?: string;
  className?: string;
}

export function HelpSystem({
  onClose,
  initialSection = "overview",
  className = "",
}: HelpSystemProps) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState("");

  const helpSections: HelpSection[] = [
    // Getting Started
    {
      id: "overview",
      title: "Overview",
      icon: "🎭",
      category: "getting-started",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Welcome to Particle Dance
          </h3>
          <p className="text-gray-300">
            Particle Dance is a powerful system for creating beautiful, animated
            particle effects inspired by dance movements. Create flowing waves,
            spiraling formations, rhythmic beats, and morphing shapes with
            real-time controls.
          </p>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Key Features:</h4>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Real-time particle animation with 4 dance patterns</li>
              <li>• Advanced parameter controls with live preview</li>
              <li>• Preset management system for saving configurations</li>
              <li>• Export to images, GIFs, and videos</li>
              <li>• Responsive design for desktop and mobile</li>
              <li>• Keyboard shortcuts for efficient workflow</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "quick-start",
      title: "Quick Start Guide",
      icon: "🚀",
      category: "getting-started",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Get Started in 3 Steps
          </h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-white">Choose a Pattern</h4>
                <p className="text-gray-300 text-sm">
                  Select from Wave, Spiral, Bounce, or Flow patterns using the
                  dropdown in the left panel.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-white">Adjust Parameters</h4>
                <p className="text-gray-300 text-sm">
                  Use the sliders to control particle count (10-2000) and
                  animation speed (0.1x-5.0x).
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-white">Play & Enjoy</h4>
                <p className="text-gray-300 text-sm">
                  Press Space or click the Play button to start the animation.
                  Save your favorite settings as presets!
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Controls
    {
      id: "basic-controls",
      title: "Basic Controls",
      icon: "🎮",
      category: "controls",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Parameter Controls</h3>
          <div className="space-y-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                🔴 Particle Count
              </h4>
              <p className="text-gray-300 text-sm">
                Controls how many particles are displayed (10-2000). More
                particles create denser, more complex patterns but may affect
                performance.
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                ⚡ Animation Speed
              </h4>
              <p className="text-gray-300 text-sm">
                Controls animation playback speed (0.1x-5.0x). Higher speeds
                create more energetic movements.
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                🎭 Dance Pattern
              </h4>
              <p className="text-gray-300 text-sm">
                Choose from four unique patterns:
              </p>
              <ul className="mt-2 space-y-1 text-gray-400 text-xs ml-4">
                <li>• 🌊 Wave: Flowing, ocean-like movements</li>
                <li>• 🌀 Spiral: Rotating, galaxy-inspired formations</li>
                <li>• ⚡ Bounce: Rhythmic, beat-driven patterns</li>
                <li>• 💫 Flow: Morphing shapes with smooth transitions</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "keyboard-shortcuts",
      title: "Keyboard Shortcuts",
      icon: "⌨️",
      category: "controls",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Keyboard Navigation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Playback</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Play/Pause</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    Space
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Stop</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    Esc
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Reset</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    R
                  </kbd>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Patterns</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Wave Pattern</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    1
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Spiral Pattern</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    2
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Bounce Pattern</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    3
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Flow Pattern</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    4
                  </kbd>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Interface</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Toggle Advanced</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    A
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Show Help</span>
                  <kbd className="px-2 py-1 bg-slate-600 rounded text-white">
                    H
                  </kbd>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">File Operations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Export</span>
                  <kbd className="px-1 py-1 bg-slate-600 rounded text-white text-xs">
                    Ctrl+E
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Import</span>
                  <kbd className="px-1 py-1 bg-slate-600 rounded text-white text-xs">
                    Ctrl+I
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Presets
    {
      id: "presets-guide",
      title: "Working with Presets",
      icon: "💾",
      category: "presets",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Preset Management</h3>
          <p className="text-gray-300">
            Presets allow you to save and share your favorite particle
            configurations. The system includes sample presets and supports
            importing/exporting custom ones.
          </p>
          <div className="space-y-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                💾 Saving Presets
              </h4>
              <p className="text-gray-300 text-sm mb-2">
                Click "Save" in the Presets section to save your current
                settings:
              </p>
              <ul className="text-gray-400 text-xs space-y-1 ml-4">
                <li>• Enter a descriptive name for your preset</li>
                <li>• Add an optional description</li>
                <li>
                  • Your current particle count, speed, and pattern will be
                  saved
                </li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                📁 Loading Presets
              </h4>
              <p className="text-gray-300 text-sm">
                Click "Load" on any preset card to apply those settings
                instantly.
              </p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                📤 Sharing Presets
              </h4>
              <p className="text-gray-300 text-sm">
                Use the Import/Export buttons to share presets with others or
                backup your collection.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Export
    {
      id: "export-guide",
      title: "Export Guide",
      icon: "📤",
      category: "export",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Exporting Your Animations
          </h3>
          <p className="text-gray-300">
            Export your particle animations as images, GIFs, or videos to share
            or use in other projects.
          </p>
          <div className="space-y-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                🖼️ Static Images
              </h4>
              <p className="text-gray-300 text-sm">
                Export single frames as PNG or JPG:
              </p>
              <ul className="text-gray-400 text-xs space-y-1 ml-4 mt-1">
                <li>• PNG: Best for transparency and highest quality</li>
                <li>• JPG: Smaller file size, good for backgrounds</li>
                <li>• Supports up to 4K resolution (3840×2160)</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                🎞️ Animated GIFs
              </h4>
              <p className="text-gray-300 text-sm">
                Perfect for social media and web:
              </p>
              <ul className="text-gray-400 text-xs space-y-1 ml-4 mt-1">
                <li>• Customizable duration (1-30 seconds)</li>
                <li>• Frame rate control (15-60 fps)</li>
                <li>• Automatic compression for web sharing</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">🎬 Video Files</h4>
              <p className="text-gray-300 text-sm">
                High-quality video export:
              </p>
              <ul className="text-gray-400 text-xs space-y-1 ml-4 mt-1">
                <li>• WebM: Best quality, modern browsers</li>
                <li>• MP4: Universal compatibility</li>
                <li>• Up to 1080p HD resolution</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    // Advanced
    {
      id: "performance-tips",
      title: "Performance Tips",
      icon: "⚡",
      category: "advanced",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Optimizing Performance
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                🔴 Particle Count
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>
                  • <span className="text-green-400">Good:</span> 100-500
                  particles for smooth performance
                </li>
                <li>
                  • <span className="text-yellow-400">Moderate:</span> 500-1000
                  particles for detailed effects
                </li>
                <li>
                  • <span className="text-red-400">Heavy:</span> 1000+ particles
                  may cause slowdown
                </li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                📊 Monitoring Performance
              </h4>
              <p className="text-gray-300 text-sm">
                Use the Performance Monitor to track:
              </p>
              <ul className="text-gray-400 text-xs space-y-1 ml-4 mt-1">
                <li>• FPS (Frames Per Second) - aim for 60 FPS</li>
                <li>• Frame time - should be under 16.67ms</li>
                <li>• Memory usage - watch for memory leaks</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                🚀 Optimization Tips
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Close other browser tabs for better performance</li>
                <li>• Use lower particle counts on mobile devices</li>
                <li>• Reduce animation speed if experiencing lag</li>
                <li>• Enable Performance Mode in Advanced settings</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: "🔧",
      category: "advanced",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">
            Common Issues & Solutions
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                ⚠️ Animation Not Playing
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>
                  • Check if the animation is paused (press Space to play)
                </li>
                <li>• Verify particle count is above 0</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                🐌 Slow Performance
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Reduce particle count to 500 or less</li>
                <li>• Lower animation speed</li>
                <li>• Close other applications</li>
                <li>• Enable Performance Mode</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                📱 Mobile Issues
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Use lower particle counts (100-300)</li>
                <li>• Tap the menu button to access controls</li>
                <li>• Rotate device to landscape for better experience</li>
              </ul>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <h4 className="font-semibold text-white mb-2">
                💾 Export Problems
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Check browser permissions for downloads</li>
                <li>• Try smaller resolution or shorter duration</li>
                <li>• Ensure sufficient storage space</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const categories = [
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "controls", name: "Controls", icon: "🎮" },
    { id: "presets", name: "Presets", icon: "💾" },
    { id: "export", name: "Export", icon: "📤" },
    { id: "advanced", name: "Advanced", icon: "⚡" },
  ];

  const filteredSections = helpSections.filter(
    (section) =>
      searchQuery === "" ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const activeHelpSection = helpSections.find(
    (section) => section.id === activeSection
  );

  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-lg overflow-hidden ${className}`}
    >
      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">
                Help & Documentation
              </h2>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose} icon="×" />
              )}
            </div>
            <input
              type="text"
              placeholder="Search help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 text-white p-2 rounded border border-slate-600 focus:border-purple-500 focus:outline-none text-sm"
            />
          </div>

          {/* Categories & Sections */}
          <div className="flex-1 overflow-y-auto">
            {categories.map((category) => {
              const categorySections = filteredSections.filter(
                (s) => s.category === category.id
              );
              if (categorySections.length === 0) return null;

              return (
                <div key={category.id} className="p-2">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2 flex items-center">
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {categorySections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-purple-600 text-white"
                            : "text-gray-300 hover:bg-slate-700"
                        }`}
                      >
                        <span className="mr-2">{section.icon}</span>
                        {section.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeHelpSection ? (
            <div>{activeHelpSection.content}</div>
          ) : (
            <div className="text-center text-gray-400 mt-20">
              <div className="text-4xl mb-4">📚</div>
              <p>Select a help topic from the sidebar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
