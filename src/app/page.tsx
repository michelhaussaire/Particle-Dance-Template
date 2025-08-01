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
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PD</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Particle Dance</h1>
              <p className="text-xs text-gray-400">Template System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Interview Project</p>
              <p className="text-sm text-white font-medium">
                ⏱️ 2 Hours Challenge
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="pt-20 h-full">
        <Suspense fallback={<LoadingSpinner />}>
          <TemplateEditor />
        </Suspense>
      </div>
    </main>
  );
}
