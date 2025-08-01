/**
 * Welcome Overlay Component
 *
 * First-time user onboarding experience with interactive
 * tour and feature highlights.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Controls";

interface WelcomeOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
  className?: string;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function WelcomeOverlay({
  onComplete,
  onSkip,
  className = "",
}: WelcomeOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to Particle Dance! 🎭",
      description:
        "Create beautiful, animated particle effects inspired by dance movements. Let's take a quick tour to get you started.",
      position: "center",
    },
    {
      id: "patterns",
      title: "Choose Your Dance Pattern",
      description:
        "Select from four unique patterns: Wave, Spiral, Bounce, or Flow. Each creates different types of movement.",
      target: ".dance-pattern-selector",
      position: "right",
    },
    {
      id: "controls",
      title: "Adjust Parameters",
      description:
        "Use these sliders to control particle count and animation speed. Watch the preview update in real-time!",
      target: ".parameter-controls",
      position: "right",
    },
    {
      id: "playback",
      title: "Control Playback",
      description:
        "Use the timeline controls to play, pause, or stop your animation. You can also use the spacebar to play/pause.",
      target: ".timeline-controls",
      position: "top",
    },
    {
      id: "presets",
      title: "Save & Load Presets",
      description:
        "Save your favorite configurations as presets, or try our sample presets to see what's possible.",
      target: ".preset-manager",
      position: "right",
    },
    {
      id: "export",
      title: "Export Your Creations",
      description:
        "Export your animations as images, GIFs, or videos to share with others or use in your projects.",
      target: ".export-section",
      position: "right",
    },
    {
      id: "demo",
      title: "Try the Demo Showcase",
      description:
        "Explore our curated collection of demo presets to see the full potential of the system.",
      target: ".demo-banner",
      position: "right",
    },
    {
      id: "complete",
      title: "You're Ready to Dance! 🚀",
      description:
        "That's it! You now know the basics. Start creating beautiful particle animations. Need help? Press H or click the help button.",
      position: "center",
    },
  ];

  const currentTourStep = tourSteps[currentStep];

  const handleComplete = useCallback(() => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  }, [onSkip]);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  }, [currentStep, tourSteps.length, handleComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Don't show if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(
      "particle-dance-onboarding-complete"
    );
    if (hasCompletedOnboarding) {
      onComplete();
    }
  }, [onComplete]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ": // Spacebar
          event.preventDefault();
          handleNext();
          break;
        case "Escape":
          event.preventDefault();
          handleSkip();
          break;
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when overlay is visible
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, handleNext, handlePrevious, handleSkip]);

  const saveOnboardingComplete = () => {
    localStorage.setItem("particle-dance-onboarding-complete", "true");
  };

  // Touch gesture handling for mobile swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentStep < tourSteps.length - 1) {
      handleNext();
    }
    if (isRightSwipe && currentStep > 0) {
      handlePrevious();
    }
  }, [
    touchStart,
    touchEnd,
    currentStep,
    tourSteps.length,
    handleNext,
    handlePrevious,
  ]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Spotlight effect for targeted elements */}
      {currentTourStep.target && (
        <div className="absolute inset-0 pointer-events-none">
          {/* This would highlight the target element */}
        </div>
      )}

      {/* Tour Content */}
      <div
        className={`
        absolute bg-slate-800 border border-slate-700 rounded-lg shadow-2xl
        transition-all duration-300 transform
        ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        
        /* Mobile-first responsive sizing and positioning */
        mx-4 p-4 max-w-[calc(100vw-2rem)] w-full
        sm:mx-6 sm:p-6 sm:max-w-md
        lg:max-w-lg
        
        /* Responsive positioning - center on mobile, follow position prop on larger screens */
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        
        /* Desktop positioning overrides */
        ${
          currentTourStep.position === "center"
            ? "md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            : ""
        }
        ${
          currentTourStep.position === "top"
            ? "md:top-20 md:left-1/2 md:-translate-x-1/2 md:translate-y-0"
            : ""
        }
        ${
          currentTourStep.position === "bottom"
            ? "md:bottom-20 md:top-auto md:left-1/2 md:-translate-x-1/2 md:translate-y-0"
            : ""
        }
        ${
          currentTourStep.position === "left"
            ? "md:left-20 md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
            : ""
        }
        ${
          currentTourStep.position === "right"
            ? "md:right-20 md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
            : ""
        }
        
        /* Ensure content doesn't overflow on small screens */
        max-h-[80vh] overflow-y-auto
      `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="text-xs sm:text-sm text-gray-400">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <button
            onClick={handleSkip}
            className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors touch-manipulation"
          >
            Skip Tour
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-700 rounded-full mb-4 sm:mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
            {currentTourStep.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {currentTourStep.description}
          </p>

          {/* Custom Action */}
          {currentTourStep.action && (
            <Button
              variant="secondary"
              onClick={currentTourStep.action.onClick}
              className="w-full touch-manipulation"
            >
              {currentTourStep.action.label}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700 gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1 sm:mr-2 touch-manipulation min-h-[44px]"
          >
            Previous
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              if (currentStep === tourSteps.length - 1) {
                saveOnboardingComplete();
              }
              handleNext();
            }}
            className="flex-1 sm:ml-2 touch-manipulation min-h-[44px]"
          >
            {currentStep === tourSteps.length - 1 ? "Get Started!" : "Next"}
          </Button>
        </div>

        {/* Navigation Hints */}
        <div className="text-center text-xs text-gray-500 mt-2 sm:mt-3">
          <div className="sm:hidden">
            Swipe left/right to navigate • Tap buttons below
          </div>
          <div className="hidden sm:block">
            Use arrow keys to navigate • Press Esc to skip
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if user needs onboarding
 */
export function useOnboarding() {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(
      "particle-dance-onboarding-complete"
    );
    setNeedsOnboarding(!hasCompletedOnboarding);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("particle-dance-onboarding-complete", "true");
    setNeedsOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem("particle-dance-onboarding-complete");
    setNeedsOnboarding(true);
  };

  return {
    needsOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}
