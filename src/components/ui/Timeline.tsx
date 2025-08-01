/**
 * Enhanced Timeline Component
 *
 * Provides timeline controls with scrubbing, keyframe visualization,
 * and advanced playback controls for the particle dance system.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "./Controls";

interface TimelineProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  keyframes?: Keyframe[];
  className?: string;
}

interface Keyframe {
  time: number;
  label: string;
  type: "pattern" | "speed" | "count" | "custom";
  value?: any;
}

export function Timeline({
  isPlaying,
  isPaused,
  currentTime,
  duration,
  onPlay,
  onPause,
  onStop,
  onSeek,
  keyframes = [],
  className = "",
}: TimelineProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showKeyframes, setShowKeyframes] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        handleSeek(e);
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSeek = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * duration;

      onSeek(newTime);
    },
    [duration, onSeek]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getKeyframeIcon = (type: string) => {
    const icons = {
      pattern: "🎭",
      speed: "⚡",
      count: "🔢",
      custom: "⭐",
    };
    return icons[type as keyof typeof icons] || "📍";
  };

  const getKeyframeColor = (type: string) => {
    const colors = {
      pattern: "bg-purple-500",
      speed: "bg-yellow-500",
      count: "bg-blue-500",
      custom: "bg-green-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div
      className={`bg-slate-800/95 backdrop-blur-sm border-t border-slate-700/50 ${className}`}
    >
      <div className="p-4 space-y-4">
        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={isPlaying ? onPause : onPlay}
              icon={isPlaying ? "⏸️" : "▶️"}
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="secondary" size="sm" onClick={onStop} icon="⏹️">
              Stop
            </Button>
            <div className="w-px h-6 bg-slate-600 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeyframes(!showKeyframes)}
              icon="📍"
              className={showKeyframes ? "text-purple-400" : ""}
            >
              Keyframes
            </Button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Status:</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlaying
                    ? "bg-green-500 animate-pulse"
                    : isPaused
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              />
              <span className="text-xs">
                {isPlaying ? "Playing" : isPaused ? "Paused" : "Stopped"}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {/* Keyframes Track */}
          {showKeyframes && keyframes.length > 0 && (
            <div className="relative h-6">
              <div className="absolute inset-0 bg-slate-700/30 rounded" />
              {keyframes.map((keyframe, index) => {
                const position =
                  duration > 0 ? (keyframe.time / duration) * 100 : 0;
                return (
                  <div
                    key={index}
                    className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${getKeyframeColor(
                      keyframe.type
                    )} border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform`}
                    style={{ left: `${position}%` }}
                    title={`${keyframe.label} (${formatTime(keyframe.time)})`}
                    onClick={() => onSeek(keyframe.time)}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/80 text-white px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {getKeyframeIcon(keyframe.type)} {keyframe.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Main Timeline Track */}
          <div
            ref={timelineRef}
            className="relative h-3 bg-slate-700 rounded-full cursor-pointer group"
            onMouseDown={handleMouseDown}
          >
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />

            {/* Playhead */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-purple-500 cursor-grab active:cursor-grabbing group-hover:scale-110 transition-transform"
              style={{ left: `${progress}%` }}
            >
              <div className="absolute inset-1 bg-purple-500 rounded-full" />
            </div>

            {/* Time Markers */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
              <span>0:00</span>
              <span>{formatTime(duration / 2)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Loop:</span>
              <input
                type="checkbox"
                className="rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-800"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span>Speed:</span>
              <select
                className="bg-slate-700 border-slate-600 rounded text-white text-xs px-2 py-1"
                defaultValue="1"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span>Quality:</span>
            <div
              className={`w-2 h-2 rounded-full ${
                progress > 0 ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            <span>60 FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mini Timeline Component for compact spaces
 */
interface MiniTimelineProps {
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
  className?: string;
}

export function MiniTimeline({
  isPlaying,
  progress,
  onTogglePlay,
  className = "",
}: MiniTimelineProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        onClick={onTogglePlay}
        className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-colors"
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 min-w-[60px]">
        {isPlaying ? "Live" : "Ready"}
      </span>
    </div>
  );
}
