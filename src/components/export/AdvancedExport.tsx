/**
 * Enhanced Advanced Export Component
 *
 * Comprehensive export system for particle animations with
 * multiple formats, quality settings, progress tracking, and
 * integration with the enhanced canvas system.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Slider, Toggle, Select } from "@/components/ui/Controls";
import {
  MediaExporter,
  EXPORT_PRESETS,
  downloadBlob,
  getFileSizeEstimate,
  type ExportOptions,
  type ExportProgress,
  type CanvasExportRef,
} from "@/lib/export/mediaExporter";

interface AdvancedExportProps {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  canvasExportRef?: React.RefObject<CanvasExportRef | null>;
  onClose?: () => void;
  className?: string;
}

export function AdvancedExport({
  canvasRef,
  canvasExportRef,
  onClose,
  className = "",
}: AdvancedExportProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    width: 1920,
    height: 1080,
    duration: 5,
    fps: 30,
    quality: 0.9,
    format: "png",
    transparent: false,
    backgroundColor: "#0f0f23",
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(
    null
  );
  const [usePreset, setUsePreset] = useState(true);
  const [selectedPreset, setSelectedPreset] =
    useState<keyof typeof EXPORT_PRESETS>("wallpaper-hd");
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlob, setPreviewBlob] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<
    Array<{
      timestamp: string;
      filename: string;
      format: string;
      size: string;
    }>
  >([]);

  const formatOptions = [
    { value: "png", label: "PNG Image", icon: "🖼️" },
    { value: "jpg", label: "JPG Image", icon: "📷" },
    { value: "gif", label: "Animated GIF", icon: "🎞️" },
    { value: "webm", label: "WebM Video", icon: "🎬" },
    { value: "mp4", label: "MP4 Video", icon: "🎥" },
  ];

  const presetOptions = Object.entries(EXPORT_PRESETS).map(([key, preset]) => ({
    value: key,
    label: key.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    icon:
      preset.format === "png" || preset.format === "jpg"
        ? "🖼️"
        : preset.format === "gif"
        ? "🎞️"
        : "🎬",
  }));

  const handlePresetChange = (presetKey: string) => {
    const preset = EXPORT_PRESETS[presetKey as keyof typeof EXPORT_PRESETS];
    setSelectedPreset(presetKey as keyof typeof EXPORT_PRESETS);
    setExportOptions(preset);
    setShowPreview(false);
    setPreviewBlob(null);
  };

  const handleCustomOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions((prev) => ({ ...prev, [key]: value }));
    setUsePreset(false);
    setShowPreview(false);
    setPreviewBlob(null);
  };

  const handlePreview = async () => {
    if (!canvasRef?.current && !canvasExportRef?.current) {
      alert("No canvas available for preview");
      return;
    }

    try {
      setShowPreview(true);

      if (canvasExportRef?.current) {
        const blob = await canvasExportRef.current.captureFrame({
          width: Math.min(exportOptions.width, 800), // Limit preview size
          height: Math.min(exportOptions.height, 600),
          transparent: exportOptions.transparent,
        });
        setPreviewBlob(URL.createObjectURL(blob));
      } else if (canvasRef?.current) {
        // Fallback for direct canvas
        const canvas = canvasRef.current;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setPreviewBlob(URL.createObjectURL(blob));
            }
          },
          exportOptions.transparent ? "image/png" : "image/jpeg",
          exportOptions.quality
        );
      }
    } catch (error) {
      console.error("Preview failed:", error);
      alert("Failed to generate preview");
    }
  };

  const handleExport = async () => {
    if (!canvasRef?.current && !canvasExportRef?.current) {
      alert("No canvas available for export");
      return;
    }

    setIsExporting(true);
    setExportProgress(null);

    try {
      const canvas =
        canvasRef?.current || canvasExportRef?.current?.getCanvas();
      if (!canvas) {
        throw new Error("Canvas not available");
      }

      const exporter = new MediaExporter(
        canvas,
        canvasExportRef?.current || undefined
      );
      let blob: Blob;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      let filename: string;

      const onProgress = (progress: ExportProgress) => {
        setExportProgress(progress);
      };

      switch (exportOptions.format) {
        case "png":
        case "jpg":
          blob = await exporter.exportImage(exportOptions);
          filename = `particle-dance-${timestamp}.${exportOptions.format}`;
          break;

        case "gif":
          blob = await exporter.exportGIF(exportOptions, onProgress);
          filename = `particle-dance-${timestamp}.gif`;
          break;

        case "webm":
        case "mp4":
          blob = await exporter.exportVideo(exportOptions, onProgress);
          filename = `particle-dance-${timestamp}.${exportOptions.format}`;
          break;

        default:
          throw new Error(`Unsupported format: ${exportOptions.format}`);
      }

      downloadBlob(blob, filename);

      // Add to export history
      const fileSize = getFileSizeEstimate(exportOptions);
      setExportHistory((prev) => [
        {
          timestamp: new Date().toLocaleString(),
          filename,
          format: exportOptions.format.toUpperCase(),
          size: fileSize,
        },
        ...prev.slice(0, 9),
      ]); // Keep last 10 exports

      // Show success message
      setExportProgress({
        progress: 1,
        frame: 0,
        totalFrames: 0,
        status: "complete",
        message: `Export complete! Downloaded ${filename}`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      setExportProgress({
        progress: 0,
        frame: 0,
        totalFrames: 0,
        status: "error",
        message: `Export failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedFileSize = () => {
    return getFileSizeEstimate(exportOptions);
  };

  const isAnimated =
    exportOptions.format === "gif" ||
    exportOptions.format === "webm" ||
    exportOptions.format === "mp4";

  // Cleanup preview blob on unmount
  useEffect(() => {
    return () => {
      if (previewBlob) {
        URL.revokeObjectURL(previewBlob);
      }
    };
  }, [previewBlob]);

  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Advanced Export</h2>
          <p className="text-gray-400 text-sm">
            Export your particle animation in high quality
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} icon="×">
            Close
          </Button>
        )}
      </div>

      {/* Preset Toggle */}
      <div className="space-y-4">
        <Toggle
          label="Use Preset"
          checked={usePreset}
          onChange={setUsePreset}
          description="Use pre-configured export settings"
        />

        {usePreset ? (
          <Select
            label="Export Preset"
            value={selectedPreset}
            onChange={handlePresetChange}
            options={presetOptions}
          />
        ) : (
          <div className="space-y-4">
            {/* Format Selection */}
            <Select
              label="Export Format"
              value={exportOptions.format}
              onChange={(value) => handleCustomOptionChange("format", value)}
              options={formatOptions}
            />

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <Slider
                label="Width"
                value={exportOptions.width}
                min={320}
                max={4096}
                step={16}
                onChange={(value) => handleCustomOptionChange("width", value)}
                unit="px"
              />
              <Slider
                label="Height"
                value={exportOptions.height}
                min={240}
                max={2160}
                step={16}
                onChange={(value) => handleCustomOptionChange("height", value)}
                unit="px"
              />
            </div>

            {/* Animated Options */}
            {isAnimated && (
              <>
                <Slider
                  label="Duration"
                  value={exportOptions.duration}
                  min={1}
                  max={30}
                  step={1}
                  onChange={(value) =>
                    handleCustomOptionChange("duration", value)
                  }
                  unit="s"
                />
                <Slider
                  label="Frame Rate"
                  value={exportOptions.fps}
                  min={15}
                  max={60}
                  step={5}
                  onChange={(value) => handleCustomOptionChange("fps", value)}
                  unit="fps"
                />
              </>
            )}

            {/* Quality */}
            <Slider
              label="Quality"
              value={exportOptions.quality}
              min={0.1}
              max={1.0}
              step={0.1}
              onChange={(value) => handleCustomOptionChange("quality", value)}
              description="Higher quality = larger file size"
            />

            {/* Background Options */}
            <div className="space-y-2">
              <Toggle
                label="Transparent Background"
                checked={exportOptions.transparent || false}
                onChange={(value) =>
                  handleCustomOptionChange("transparent", value)
                }
                description="Export with transparent background (PNG only)"
              />

              {!exportOptions.transparent && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Background:</span>
                  <input
                    type="color"
                    value={exportOptions.backgroundColor || "#0f0f23"}
                    onChange={(e) =>
                      handleCustomOptionChange(
                        "backgroundColor",
                        e.target.value
                      )
                    }
                    className="w-8 h-8 rounded border border-slate-600"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Export Info */}
      <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
        <h3 className="text-white font-medium">Export Preview</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Resolution:</span>
            <span className="text-white ml-2">
              {exportOptions.width}×{exportOptions.height}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Format:</span>
            <span className="text-white ml-2 uppercase">
              {exportOptions.format}
            </span>
          </div>
          {isAnimated && (
            <>
              <div>
                <span className="text-gray-400">Duration:</span>
                <span className="text-white ml-2">
                  {exportOptions.duration}s
                </span>
              </div>
              <div>
                <span className="text-gray-400">Frame Rate:</span>
                <span className="text-white ml-2">{exportOptions.fps} fps</span>
              </div>
            </>
          )}
          <div>
            <span className="text-gray-400">Est. Size:</span>
            <span className="text-white ml-2">{getEstimatedFileSize()}</span>
          </div>
          <div>
            <span className="text-gray-400">Quality:</span>
            <span className="text-white ml-2">
              {Math.round(exportOptions.quality * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Preview */}
      {showPreview && previewBlob && (
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Preview</h3>
          <div className="flex justify-center">
            <img
              src={previewBlob}
              alt="Export preview"
              className="max-w-full max-h-48 rounded border border-slate-600"
            />
          </div>
        </div>
      )}

      {/* Progress */}
      {exportProgress && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">
              {exportProgress.message}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(exportProgress.progress * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                exportProgress.status === "error"
                  ? "bg-red-500"
                  : exportProgress.status === "complete"
                  ? "bg-green-500"
                  : "bg-purple-500"
              }`}
              style={{ width: `${exportProgress.progress * 100}%` }}
            />
          </div>
          {exportProgress.totalFrames > 0 && (
            <div className="text-xs text-gray-500 text-center">
              Frame {exportProgress.frame} of {exportProgress.totalFrames}
              {exportProgress.estimatedTime && (
                <span className="ml-2">
                  (~{Math.round(exportProgress.estimatedTime)}s remaining)
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreview}
            disabled={isExporting}
            icon="👁️"
          >
            Preview
          </Button>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting}
            loading={isExporting}
            icon="📤"
            className="min-w-[120px]"
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Recent Exports</h3>
          <div className="space-y-1 text-xs">
            {exportHistory.map((export_, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-gray-400"
              >
                <span className="truncate">{export_.filename}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">{export_.format}</span>
                  <span className="text-gray-500">{export_.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          💡 <strong>Tip:</strong> Higher resolutions and longer durations will
          take more time to export
        </p>
        <p>
          💡 <strong>Tip:</strong> Use PNG for static images with transparency,
          JPG for smaller file sizes
        </p>
        <p>
          💡 <strong>Tip:</strong> GIFs are great for sharing, but WebM/MP4
          offer better quality for videos
        </p>
        <p>
          💡 <strong>Tip:</strong> Use the preview feature to check your export
          settings before processing
        </p>
      </div>
    </div>
  );
}
