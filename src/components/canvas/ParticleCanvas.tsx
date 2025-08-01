/**
 * Particle Canvas Component (Simplified)
 * 
 * Canvas-based particle system using HTML5 Canvas API
 * while we wait for React Three Fiber React 19 compatibility
 */

'use client';

import { useRef, useEffect, useCallback } from 'react';

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
  patternType = 'wave',
  className = ''
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
      // Create particles in a grid formation initially
      const gridSize = Math.ceil(Math.sqrt(particleCount));
      const gridX = (i % gridSize) - gridSize / 2;
      const gridY = Math.floor(i / gridSize) - gridSize / 2;

      particles.push({
        x: centerX + gridX * 20,
        y: centerY + gridY * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        color: `hsl(${270 + (i / particleCount) * 60}, 80%, 60%)`, // Purple to pink
        alpha: 0.8,
        age: 0,
        maxAge: 1000 + Math.random() * 2000,
      });
    }

    particlesRef.current = particles;
  }, [particleCount]);

  // Update particles based on dance pattern
  const updateParticles = useCallback((deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = timeRef.current * animationSpeed;

    particlesRef.current.forEach((particle, index) => {
      // Apply dance pattern movement
      switch (patternType) {
        case 'wave':
          particle.x = centerX + Math.sin(time * 0.01 + index * 0.1) * 100;
          particle.y = centerY + Math.sin(time * 0.02 + index * 0.2) * 80 + (index % 10 - 5) * 15;
          break;

        case 'spiral':
          const radius = 50 + Math.sin(time * 0.01 + index * 0.1) * 30;
          const angle = time * 0.02 + index * 0.3;
          particle.x = centerX + Math.cos(angle) * radius;
          particle.y = centerY + Math.sin(angle) * radius + Math.sin(time * 0.03 + index * 0.1) * 20;
          break;

        case 'bounce':
          particle.x = centerX + Math.sin(time * 0.04 + index * 0.3) * 60;
          particle.y = centerY + Math.abs(Math.sin(time * 0.06 + index * 0.4)) * 100 - 50;
          break;

        case 'flow':
        default:
          particle.x = centerX + Math.sin(time * 0.01 + index * 0.05) * 120;
          particle.y = centerY + Math.sin(time * 0.015 + index * 0.1) * 80;
          break;
      }

      // Update alpha based on movement
      particle.alpha = 0.6 + Math.sin(time * 0.02 + index * 0.1) * 0.3;
      
      // Age particles
      particle.age += deltaTime;
      if (particle.age > particle.maxAge) {
        particle.age = 0;
      }
    });
  }, [patternType, animationSpeed]);

  // Render particles
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particlesRef.current.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      
      // Create gradient for particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const now = performance.now();
    const deltaTime = now - (timeRef.current || now);
    timeRef.current = now;

    updateParticles(deltaTime);
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
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize and start animation
    initializeParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
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
        style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}
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