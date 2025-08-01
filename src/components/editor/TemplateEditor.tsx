/**
 * Main Template Editor Component
 * 
 * This is the core editor interface that combines the parameter panel,
 * preview canvas, and timeline into a cohesive editing experience.
 */

'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function TemplateEditor() {
  const [isInitializing, setIsInitializing] = useState(true);

  // Simulate initialization time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoadingSpinner 
          size="lg" 
          text="Initializing Particle System..." 
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-slate-900">
      {/* Parameter Panel */}
      <div className="w-80 bg-slate-800 border-r border-slate-700 p-4">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">Parameters</h2>
            <div className="space-y-3">
              {/* Placeholder controls */}
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Particle Count</label>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  defaultValue="500"
                  className="w-full" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Animation Speed</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  defaultValue="1"
                  step="0.1"
                  className="w-full" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Pattern Type</label>
                <select className="w-full bg-slate-700 text-white p-2 rounded">
                  <option value="wave">Wave</option>
                  <option value="spiral">Spiral</option>
                  <option value="bounce">Bounce</option>
                  <option value="flow">Flow</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-700">
            <h3 className="text-md font-medium text-white mb-2">Dance Template</h3>
            <p className="text-sm text-gray-400 mb-3">
              Based on original dance video analysis
            </p>
            <div className="bg-slate-700 p-3 rounded">
              <div className="text-xs text-gray-300">Status: Ready</div>
              <div className="text-xs text-gray-300">Particles: 500</div>
              <div className="text-xs text-gray-300">FPS: 60</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Canvas */}
        <div className="flex-1 bg-gradient-to-br from-purple-900/20 to-pink-900/20 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 animate-pulse-glow" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Particle Canvas
              </h3>
              <p className="text-gray-400 text-sm">
                Three.js particle system will render here
              </p>
              <div className="mt-4 text-xs text-gray-500">
                COMMIT 1: Basic UI Structure ✅<br/>
                Next: Three.js Integration (COMMIT 2)
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="h-24 bg-slate-800 border-t border-slate-700 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Timeline</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                Play
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                Pause
              </button>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full">
            <div className="w-1/3 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}