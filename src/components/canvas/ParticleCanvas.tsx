/**
 * Particle Canvas Component (Simplified)
 *
 * Canvas-based particle system using HTML5 Canvas API
 * while we wait for React Three Fiber React 19 compatibility
 */

"use client";

import { useRef, useEffect, useCallback } from "react";

interface ParticleCanvasProps {
  particleCount?: number;
  animationSpeed?: number;
  patternType?: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  age: number;
  maxAge: number;
}

export function ParticleCanvas({
  particleCount = 500,
  animationSpeed = 1.0,
  patternType = "wave",
  className = "",
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      // Create particles in a more organic initial distribution
      const angle = (i / particleCount) * Math.PI * 2 * 3; // Multiple spirals
      const radius = (i / particleCount) * 100;
      const spiralX = Math.cos(angle) * radius;
      const spiralY = Math.sin(angle) * radius;

      particles.push({
        x: centerX + spiralX + (Math.random() - 0.5) * 20,
        y: centerY + spiralY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        color: `hsl(${270 + (i / particleCount) * 60}, ${
          70 + Math.random() * 20
        }%, ${50 + Math.random() * 30}%)`,
        alpha: 0.7 + Math.random() * 0.3,
        age: 0,
        maxAge: 1000 + Math.random() * 2000,
      });
    }

    particlesRef.current = particles;
  }, [particleCount]);

  // Update particles based on dance pattern
  const updateParticles = useCallback(
    (deltaTime: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const time = timeRef.current * animationSpeed;

      particlesRef.current.forEach((particle, index) => {
        // Apply advanced dance patterns
        let newPos = { x: particle.x, y: particle.y };

        switch (patternType) {
          case "wave":
            // Contemporary flow pattern
            const flowX =
              Math.sin(time * 0.008 + index * 0.1) * 80 +
              Math.sin(time * 0.012 + index * 0.07) * 40;
            const flowY =
              Math.sin(time * 0.006 + index * 0.13) * 60 +
              Math.cos(time * 0.004 + index * 0.15) * 15;
            newPos.x =
              centerX + flowX + Math.sin(time * 0.003 + index * 2) * 20;
            newPos.y =
              centerY + flowY + Math.cos(time * 0.004 + index * 1.5) * 15;
            break;

          case "spiral":
            // Multi-layer spiral formation
            const layer = Math.floor(index / 20) % 3;
            const layerRadius =
              60 * (0.4 + layer * 0.3) +
              Math.sin(time * 0.005 + index * 0.1) * 20;
            const layerSpeed = (1 + layer * 0.2) * 0.02;
            const spiralAngle = time * layerSpeed + (index % 20) * 0.314;
            const verticalWave = Math.sin(time * 0.008 + spiralAngle) * 40;

            newPos.x = centerX + Math.cos(spiralAngle) * layerRadius;
            newPos.y = centerY + verticalWave + layer * 30;
            break;

          case "bounce":
            // Rhythmic beat pattern
            const beatPhase = (time * 0.002) % 1;
            const beatPulse =
              beatPhase < 0.1
                ? 1 - beatPhase / 0.1
                : Math.max(0, (1 - beatPhase) * 0.3);
            const gridX = ((index % 10) - 5) * 25;
            const gridY = (Math.floor(index / 10) - 5) * 25;
            const snapX =
              Math.sin(((time * 0.004 + index * 0.1) % 1) * Math.PI * 2) * 30;
            const snapY =
              Math.cos(((time * 0.004 + index * 0.1) % 1) * Math.PI * 2) * 25;

            newPos.x = centerX + gridX + snapX * beatPulse;
            newPos.y = centerY + gridY + snapY * beatPulse;
            break;

          case "flow":
          default:
            // Flowing formation with morphing
            const morphCycle = 8000; // 8 seconds
            const morphTime = (time % morphCycle) / morphCycle;

            // Circle formation
            const circleAngle = (index * 137.5) % 360;
            const circleRadius = 80;
            const circleX =
              Math.cos((circleAngle * Math.PI) / 180) * circleRadius;
            const circleY =
              Math.sin((circleAngle * Math.PI) / 180) * circleRadius;

            // Heart formation
            const heartT = (index / 100) * Math.PI * 2;
            const heartScale = 60;
            const heartX =
              (16 * Math.pow(Math.sin(heartT), 3) * heartScale) / 16;
            const heartY =
              ((13 * Math.cos(heartT) -
                5 * Math.cos(2 * heartT) -
                2 * Math.cos(3 * heartT) -
                Math.cos(4 * heartT)) *
                heartScale) /
              16;

            // Blend between formations
            let blendX, blendY;
            if (morphTime < 0.5) {
              const blend = morphTime / 0.5;
              const smoothBlend = blend * blend * (3 - 2 * blend); // smooth step
              blendX = circleX + (heartX - circleX) * smoothBlend;
              blendY = circleY + (heartY - circleY) * smoothBlend;
            } else {
              const blend = (morphTime - 0.5) / 0.5;
              const smoothBlend = blend * blend * (3 - 2 * blend);
              blendX = heartX + (circleX - heartX) * smoothBlend;
              blendY = heartY + (circleY - heartY) * smoothBlend;
            }

            // Add flowing motion
            const flowMotionX = Math.sin(time * 0.004 + index * 0.1) * 15;
            const flowMotionY = Math.cos(time * 0.003 + index * 0.15) * 10;

            newPos.x = centerX + blendX + flowMotionX;
            newPos.y = centerY + blendY + flowMotionY;
            break;
        }

        // Smooth transition to new position
        const smoothFactor = 0.1;
        particle.x += (newPos.x - particle.x) * smoothFactor;
        particle.y += (newPos.y - particle.y) * smoothFactor;

        // Update visual properties with more variation
        particle.alpha = 0.6 + Math.sin(time * 0.02 + index * 0.1) * 0.3;
        particle.size = 2.5 + Math.sin(time * 0.015 + index * 0.2) * 1.8;

        // Update color based on movement and pattern
        const hue =
          270 +
          (index / particleCount) * 60 +
          Math.sin(time * 0.01 + index * 0.05) * 30;
        particle.color = `hsl(${hue}, 80%, ${
          60 + Math.sin(time * 0.01 + index * 0.1) * 20
        }%)`;

        // Age particles
        particle.age += deltaTime;
        if (particle.age > particle.maxAge) {
          particle.age = 0;
        }
      });
    },
    [patternType, animationSpeed, particleCount]
  );

  // Render particles
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas with fade effect for trails
    ctx.fillStyle = "rgba(15, 15, 35, 0.08)";
    ctx.fillRect(
      0,
      0,
      canvas.width / (window.devicePixelRatio || 1),
      canvas.height / (window.devicePixelRatio || 1)
    );

    // Draw particles with culling for better performance
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);

    particlesRef.current.forEach((particle) => {
      // Cull particles outside the visible area (with margin)
      const margin = 50;
      if (
        particle.x < -margin ||
        particle.x > canvasWidth + margin ||
        particle.y < -margin ||
        particle.y > canvasHeight + margin
      ) {
        return;
      }

      ctx.save();
      ctx.globalAlpha = particle.alpha;

      // Create gradient for particle with better visibility
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 2
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(
        0.7,
        particle.color.replace(")", ", 0.3)").replace("hsl", "hsla")
      );
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add a bright core for better visibility
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, []);

  // Animation loop with better timing
  const animate = useCallback(() => {
    const now = performance.now();
    const deltaTime = timeRef.current ? now - timeRef.current : 16.67; // Default to ~60fps
    timeRef.current = now;

    // Limit delta time to prevent large jumps
    const clampedDelta = Math.min(deltaTime, 33.33); // Max 30fps minimum

    updateParticles(clampedDelta);
    render();

    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, render]);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Set actual canvas size in memory (scaled to account for extra pixel density)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Scale the drawing context back down to match the CSS pixels
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        // Set canvas CSS size to maintain proper display size
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize and start animation
    initializeParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles, animate]);

  // Update particles when props change
  useEffect(() => {
    initializeParticles();
  }, [particleCount, initializeParticles]);

  return (
    <div className={`w-full h-full relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f23 50%, #000 100%)",
          imageRendering: "auto",
        }}
      />

      {/* Overlay Info */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
        <div className="text-xs text-white space-y-1">
          <div>Particles: {particleCount.toLocaleString()}</div>
          <div>Pattern: {patternType}</div>
          <div>Speed: {animationSpeed.toFixed(1)}x</div>
          <div className="text-green-400">Canvas Renderer</div>
        </div>
      </div>

      {/* Performance Warning */}
      {particleCount > 1000 && (
        <div className="absolute bottom-4 left-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2">
          <div className="text-xs text-yellow-200 flex items-center space-x-2">
            <span>⚠️</span>
            <span>High particle count may affect performance</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Canvas loading fallback
export function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-400">Initializing Canvas...</p>
      </div>
    </div>
  );
}
