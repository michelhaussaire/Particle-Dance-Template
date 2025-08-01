/**
 * Keyboard Shortcuts Component
 * 
 * Provides keyboard shortcuts for common actions and displays
 * a help modal with all available shortcuts.
 */

"use client";

import { useEffect, useState } from "react";
import { Button } from "./Controls";

interface KeyboardShortcutsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  onToggleAdvanced?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  className?: string;
}

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

export function KeyboardShortcuts({
  onPlay,
  onPause,
  onStop,
  onReset,
  onToggleAdvanced,
  onExport,
  onImport,
  className = "",
}: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const shortcuts: Shortcut[] = [
    // Playback controls
    { key: 'Space', description: 'Play/Pause animation', action: () => onPlay?.(), category: 'Playback' },
    { key: 'Escape', description: 'Stop animation', action: () => onStop?.(), category: 'Playback' },
    { key: 'r', description: 'Reset to beginning', action: () => onReset?.(), category: 'Playback' },
    
    // UI controls
    { key: 'a', description: 'Toggle advanced controls', action: () => onToggleAdvanced?.(), category: 'Interface' },
    { key: '?', description: 'Show keyboard shortcuts', action: () => setShowHelp(true), category: 'Interface' },
    { key: 'h', description: 'Show/hide help', action: () => setShowHelp(!showHelp), category: 'Interface' },
    
    // File operations
    { key: 'Ctrl+e', description: 'Export current preset', action: () => onExport?.(), category: 'File' },
    { key: 'Ctrl+i', description: 'Import preset', action: () => onImport?.(), category: 'File' },
    { key: 'Ctrl+s', description: 'Save current settings', action: () => {}, category: 'File' },
    
    // Pattern controls
    { key: '1', description: 'Switch to Wave pattern', action: () => {}, category: 'Patterns' },
    { key: '2', description: 'Switch to Spiral pattern', action: () => {}, category: 'Patterns' },
    { key: '3', description: 'Switch to Bounce pattern', action: () => {}, category: 'Patterns' },
    { key: '4', description: 'Switch to Flow pattern', action: () => {}, category: 'Patterns' },
    
    // Quick adjustments
    { key: '=', description: 'Increase particle count', action: () => {}, category: 'Quick Adjust' },
    { key: '-', description: 'Decrease particle count', action: () => {}, category: 'Quick Adjust' },
    { key: ']', description: 'Increase animation speed', action: () => {}, category: 'Quick Adjust' },
    { key: '[', description: 'Decrease animation speed', action: () => {}, category: 'Quick Adjust' },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      const isShiftPressed = event.shiftKey;
      
      // Update pressed keys for visual feedback
      setPressedKeys(prev => new Set([...prev, key]));
      
      // Build key combination string
      let keyCombo = '';
      if (isCtrlPressed) keyCombo += 'Ctrl+';
      if (isShiftPressed) keyCombo += 'Shift+';
      keyCombo += key;
      
      // Find and execute matching shortcut
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === keyCombo.toLowerCase() ||
        s.key.toLowerCase() === key.toLowerCase()
      );
      
      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
      
      // Special handling for space bar (play/pause)
      if (key === ' ' && !event.target?.tagName.match(/INPUT|TEXTAREA|SELECT/i)) {
        event.preventDefault();
        onPlay?.();
      }
      
      // Close help with Escape
      if (key === 'Escape' && showHelp) {
        event.preventDefault();
        setShowHelp(false);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shortcuts, onPlay, showHelp]);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const formatKey = (key: string) => {
    return key.split('+').map(k => (
      <kbd key={k} className="px-2 py-1 bg-slate-600 text-white rounded text-xs font-mono">
        {k === ' ' ? 'Space' : k}
      </kbd>
    ));
  };

  return (
    <>
      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-bounce-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>⌨️</span>
                  <span>Keyboard Shortcuts</span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(false)}
                  icon="×"
                >
                  Close
                </Button>
              </div>
              
              <div className="grid gap-6">
                {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-lg font-semibold text-purple-400 border-b border-slate-700 pb-2">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between py-2 hover:bg-slate-700/30 rounded px-2">
                          <span className="text-gray-300">{shortcut.description}</span>
                          <div className="flex space-x-1">
                            {formatKey(shortcut.key)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
                <h4 className="text-sm font-medium text-white mb-2">Tips</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Press <kbd className="px-1 bg-slate-600 rounded">?</kbd> or <kbd className="px-1 bg-slate-600 rounded">h</kbd> to toggle this help</li>
                  <li>• Most shortcuts work globally, even when inputs are not focused</li>
                  <li>• Use <kbd className="px-1 bg-slate-600 rounded">Escape</kbd> to close modals and stop animations</li>
                  <li>• Number keys (1-4) quickly switch between dance patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcut Indicator */}
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHelp(true)}
          icon="⌨️"
          className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/80"
        >
          Shortcuts
        </Button>
        
        {/* Visual feedback for pressed keys */}
        {pressedKeys.size > 0 && (
          <div className="absolute bottom-full right-0 mb-2 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-2">
            <div className="flex space-x-1">
              {Array.from(pressedKeys).map(key => (
                <kbd key={key} className="px-2 py-1 bg-purple-600 text-white rounded text-xs font-mono">
                  {key === ' ' ? 'Space' : key}
                </kbd>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Hook for managing keyboard shortcuts
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target?.tagName.match(/INPUT|TEXTAREA|SELECT/i)) {
        return;
      }

      const key = event.key.toLowerCase();
      const isCtrl = event.ctrlKey || event.metaKey;

      switch (key) {
        case ' ':
          event.preventDefault();
          handlers.onPlay?.();
          break;
        case 'escape':
          event.preventDefault();
          handlers.onStop?.();
          break;
        case 'r':
          if (!isCtrl) {
            event.preventDefault();
            handlers.onReset?.();
          }
          break;
        case 'a':
          if (!isCtrl) {
            event.preventDefault();
            handlers.onToggleAdvanced?.();
          }
          break;
        case 'e':
          if (isCtrl) {
            event.preventDefault();
            handlers.onExport?.();
          }
          break;
        case 'i':
          if (isCtrl) {
            event.preventDefault();
            handlers.onImport?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}