"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Dynamically import the editor to avoid SSR issues with Three.js
const TemplateEditor = dynamic(
  () => import("@/components/editor/TemplateEditor"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function HomePage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">
                PD
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-white truncate">
                Particle Dance
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Template System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-400 hidden sm:block">
                Interview Project
              </p>
              <p className="text-xs sm:text-sm text-white font-medium">
                <span className="hidden sm:inline">⏱️ </span>2h Challenge
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="pt-16 sm:pt-20 h-full">
        <Suspense fallback={<LoadingSpinner />}>
          <TemplateEditor />
        </Suspense>
      </div>
    </main>
  );
}
