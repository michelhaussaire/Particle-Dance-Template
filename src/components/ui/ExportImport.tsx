/**
 * Export/Import Functionality Component
 *
 * Handles exporting particle dance configurations, animations,
 * and importing settings with validation and error handling.
 */

"use client";

import { useState } from "react";
import { Button } from "./Controls";

interface ExportImportProps {
  currentSettings: {
    particleCount: number;
    animationSpeed: number;
    patternType: string;
    [key: string]: any;
  };
  onImportSettings: (settings: any) => void;
  className?: string;
}

interface ExportFormat {
  version: string;
  timestamp: string;
  settings: any;
  metadata: {
    name: string;
    description: string;
    author: string;
    tags: string[];
  };
}

export function ExportImport({
  currentSettings,
  onImportSettings,
  className = "",
}: ExportImportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<"json" | "url" | "code">(
    "json"
  );
  const [exportName, setExportName] = useState("");
  const [exportDescription, setExportDescription] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState("");

  const generateExportData = (): ExportFormat => {
    return {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      settings: currentSettings,
      metadata: {
        name: exportName || "Particle Dance Configuration",
        description: exportDescription || "Exported particle dance settings",
        author: "Particle Dance Template System",
        tags: ["particle", "dance", "animation", currentSettings.patternType],
      },
    };
  };

  const exportAsJSON = () => {
    setIsExporting(true);
    try {
      const data = generateExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportName || "particle-dance"}.json`;
      link.click();

      URL.revokeObjectURL(url);
      setShowExportModal(false);
      setExportName("");
      setExportDescription("");
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsURL = () => {
    setIsExporting(true);
    try {
      const data = generateExportData();
      const encoded = btoa(JSON.stringify(data.settings));
      const url = `${window.location.origin}${window.location.pathname}?config=${encoded}`;

      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Shareable URL copied to clipboard!");
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert("Shareable URL copied to clipboard!");
        });

      setShowExportModal(false);
    } catch (error) {
      console.error("URL export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsCode = () => {
    setIsExporting(true);
    try {
      const data = generateExportData();
      const codeTemplate = `// Particle Dance Configuration
// Generated on ${new Date().toLocaleDateString()}

const particleDanceConfig = ${JSON.stringify(data.settings, null, 2)};

// Usage:
// Import this configuration into your Particle Dance Template System
// or use the individual settings to recreate the animation

export default particleDanceConfig;`;

      const blob = new Blob([codeTemplate], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportName || "particle-dance"}.js`;
      link.click();

      URL.revokeObjectURL(url);
      setShowExportModal(false);
    } catch (error) {
      console.error("Code export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    switch (exportFormat) {
      case "json":
        exportAsJSON();
        break;
      case "url":
        exportAsURL();
        break;
      case "code":
        exportAsCode();
        break;
    }
  };

  const handleFileImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.js";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      setImportError("");

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let settings;

          if (file.name.endsWith(".json")) {
            const data = JSON.parse(content);
            settings = data.settings || data;
          } else if (file.name.endsWith(".js")) {
            // Extract JSON from JavaScript file
            const jsonMatch = content.match(/const\s+\w+\s*=\s*({[\s\S]*?});/);
            if (jsonMatch) {
              settings = JSON.parse(jsonMatch[1]);
            } else {
              throw new Error("Invalid JavaScript file format");
            }
          }

          if (validateSettings(settings)) {
            onImportSettings(settings);
            setShowImportModal(false);
            alert("Settings imported successfully!");
          } else {
            throw new Error("Invalid settings format");
          }
        } catch (error) {
          setImportError(
            `Import failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleURLImport = () => {
    const url = prompt("Enter the shareable URL:");
    if (!url) return;

    setIsImporting(true);
    setImportError("");

    try {
      const urlObj = new URL(url);
      const config = urlObj.searchParams.get("config");

      if (!config) {
        throw new Error("No configuration found in URL");
      }

      const settings = JSON.parse(atob(config));

      if (validateSettings(settings)) {
        onImportSettings(settings);
        setShowImportModal(false);
        alert("Settings imported from URL successfully!");
      } else {
        throw new Error("Invalid settings format");
      }
    } catch (error) {
      setImportError(
        `URL import failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsImporting(false);
    }
  };

  const validateSettings = (settings: any): boolean => {
    if (!settings || typeof settings !== "object") return false;

    const requiredFields = ["particleCount", "animationSpeed", "patternType"];
    return requiredFields.every((field) => field in settings);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Export & Import</h3>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExportModal(true)}
            icon="📤"
            className="flex-1"
          >
            Export
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowImportModal(true)}
            icon="📥"
            className="px-3"
          >
            Import
          </Button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full animate-bounce-in">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Export Configuration
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Configuration name..."
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value)}
                  className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:border-purple-500 focus:outline-none"
                />

                <textarea
                  placeholder="Description (optional)..."
                  value={exportDescription}
                  onChange={(e) => setExportDescription(e.target.value)}
                  className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 focus:border-purple-500 focus:outline-none h-20 resize-none"
                />

                <div className="space-y-2">
                  <label className="text-sm text-gray-300 font-medium">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setExportFormat("json")}
                      className={`p-2 rounded text-sm transition-colors ${
                        exportFormat === "json"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      📄 JSON
                    </button>
                    <button
                      onClick={() => setExportFormat("url")}
                      className={`p-2 rounded text-sm transition-colors ${
                        exportFormat === "url"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      🔗 URL
                    </button>
                    <button
                      onClick={() => setExportFormat("code")}
                      className={`p-2 rounded text-sm transition-colors ${
                        exportFormat === "code"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      💻 Code
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleExport}
                  loading={isExporting}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full animate-bounce-in">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Import Configuration
              </h3>

              {importError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
                  {importError}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  onClick={handleFileImport}
                  loading={isImporting}
                  icon="📁"
                  className="w-full justify-center"
                >
                  Import from File
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleURLImport}
                  loading={isImporting}
                  icon="🔗"
                  className="w-full justify-center"
                >
                  Import from URL
                </Button>
              </div>

              <div className="mt-4 p-3 bg-slate-700/30 rounded text-xs text-gray-400">
                <p className="mb-2">Supported formats:</p>
                <ul className="space-y-1">
                  <li>• JSON files (.json)</li>
                  <li>• JavaScript files (.js)</li>
                  <li>• Shareable URLs with config parameter</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowImportModal(false);
                    setImportError("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
