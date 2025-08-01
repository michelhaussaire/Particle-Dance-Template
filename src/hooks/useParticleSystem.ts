/**
 * Particle System Hook
 *
 * Custom hook that integrates the particle system with dance patterns,
 * physics simulation, and performance optimization.
 */

import { useRef, useEffect, useCallback } from "react";
import { DancePatternEngine } from "@/lib/engine/DancePatternEngine";
import { PhysicsEngine, PhysicsParticle } from "@/lib/engine/PhysicsEngine";
import { useTemplateStore } from "@/lib/store/templateStore";

interface UseParticleSystemProps {
  canvas: HTMLCanvasElement | null;
  particleCount: number;
  animationSpeed: number;
  patternType: string;
}

export function useParticleSystem({
  canvas,
  particleCount,
  animationSpeed,
  patternType,
}: UseParticleSystemProps) {
  const danceEngineRef = useRef<DancePatternEngine | null>(null);
  const physicsEngineRef = useRef<PhysicsEngine | null>(null);
  const particlesRef = useRef<PhysicsParticle[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const { updateFPS, isPlaying } = useTemplateStore();

  // Initialize engines
  useEffect(() => {
    if (!canvas) return;

    danceEngineRef.current = new DancePatternEngine(120); // 120 BPM
    physicsEngineRef.current = new PhysicsEngine({
      gravity: { x: 0, y: 0, z: 0 }, // Disable gravity for dance patterns
      airResistance: 0.05,
      boundaries: {
        min: { x: -canvas.width / 2, y: -canvas.height / 2, z: -100 },
        max: { x: canvas.width / 2, y: canvas.height / 2, z: 100 },
        bounce: 0.8,
      },
      collisions: {
        enabled: false, // Disable for performance
        damping: 0.8,
        minDistance: 10,
      },
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvas]);

  // Initialize particles when count changes
  const initializeParticles = useCallback(() => {
    if (!canvas || !physicsEngineRef.current) return;

    // Clear existing particles
    particlesRef.current = [];
    physicsEngineRef.current
      .getParticles()
      .forEach((p) => physicsEngineRef.current?.removeParticle(p.id));

    // Create new particles
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      // Formation-based initial positioning
      const angle = (i * 137.5) % 360; // Golden angle distribution
      const radius = 30 + (i % 5) * 15;

      const particle: PhysicsParticle = {
        id: i,
        position: {
          x: centerX + Math.cos((angle * Math.PI) / 180) * radius,
          y: centerY + Math.sin((angle * Math.PI) / 180) * radius,
          z: 0,
        },
        velocity: { x: 0, y: 0, z: 0 },
        acceleration: { x: 0, y: 0, z: 0 },
        mass: 1.0,
        size: 2 + Math.random() * 2,
        damping: 0.98,
        isFixed: false,
      };

      particlesRef.current.push(particle);
      physicsEngineRef.current.addParticle(particle);
    }
  }, [canvas, particleCount]);

  // Animation loop
  const animate = useCallback(
    (currentTime: number) => {
      if (!canvas || !danceEngineRef.current || !physicsEngineRef.current)
        return;

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update FPS
      if (deltaTime > 0) {
        const fps = 1000 / deltaTime;
        updateFPS(fps);
      }

      // Update dance pattern engine
      danceEngineRef.current.updateTime(deltaTime);

      // Apply dance patterns to particles
      const danceEngine = danceEngineRef.current;
      let currentMove;

      switch (patternType) {
        case "wave":
          currentMove = danceEngine.createContemporaryFlow();
          break;
        case "spiral":
          currentMove = danceEngine.createSpiralFormation();
          break;
        case "bounce":
          currentMove = danceEngine.createRhythmicBeat();
          break;
        case "flow":
          currentMove = danceEngine.createFlowingFormation();
          break;
        default:
          currentMove = danceEngine.createContemporaryFlow();
      }

      // Apply dance movement to particles
      particlesRef.current.forEach((particle, index) => {
        const dancePosition = currentMove.execute(
          particle,
          currentTime,
          index,
          {
            flowIntensity: animationSpeed,
            beatIntensity: animationSpeed,
            spiralSpeed: animationSpeed,
            burstIntensity: animationSpeed,
            flowSpeed: animationSpeed,
            formationSize: Math.min(canvas.width, canvas.height) * 0.3,
          }
        );

        // Apply dance position as a force rather than direct positioning
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const targetX = centerX + dancePosition.x;
        const targetY = centerY + dancePosition.y;

        // Smooth attraction to dance position
        const attractionStrength = 0.02 * animationSpeed;
        const dx = targetX - particle.position.x;
        const dy = targetY - particle.position.y;

        particle.acceleration.x += dx * attractionStrength;
        particle.acceleration.y += dy * attractionStrength;
      });

      // Update physics
      physicsEngineRef.current.update(deltaTime);

      // Continue animation if playing
      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    },
    [canvas, patternType, animationSpeed, updateFPS, isPlaying]
  );

  // Start/stop animation
  useEffect(() => {
    if (isPlaying && canvas) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, animate, canvas]);

  // Initialize particles when parameters change
  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  // Render function
  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!canvas) return;

      // Clear with fade effect
      ctx.fillStyle = "rgba(15, 15, 35, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particlesRef.current.forEach((particle, index) => {
        ctx.save();

        // Calculate dynamic properties
        const time = performance.now() * 0.001;
        const alpha = 0.6 + Math.sin(time * 2 + index * 0.1) * 0.3;
        const size =
          particle.size * (1 + Math.sin(time * 1.5 + index * 0.2) * 0.3);

        // Dynamic color based on pattern and movement
        const hue =
          270 +
          (index / particleCount) * 60 +
          Math.sin(time + index * 0.05) * 30;
        const saturation = 80 + Math.sin(time * 0.5 + index * 0.1) * 20;
        const lightness = 60 + Math.sin(time * 0.3 + index * 0.15) * 20;

        ctx.globalAlpha = Math.max(0, alpha);

        // Particle glow effect
        const gradient = ctx.createRadialGradient(
          particle.position.x,
          particle.position.y,
          0,
          particle.position.x,
          particle.position.y,
          size * 2
        );
        gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
        gradient.addColorStop(
          0.5,
          `hsl(${hue}, ${saturation}%, ${lightness * 0.7}%)`
        );
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.position.x, particle.position.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${Math.min(
          90,
          lightness + 30
        )}%)`;
        ctx.beginPath();
        ctx.arc(
          particle.position.x,
          particle.position.y,
          size * 0.3,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
      });

      // Draw connections between nearby particles
      drawConnections(ctx);
    },
    [canvas, particleCount]
  );

  // Draw connections between particles
  const drawConnections = useCallback((ctx: CanvasRenderingContext2D) => {
    const maxDistance = 80;
    const maxConnections = 3; // Limit connections per particle for performance

    for (let i = 0; i < particlesRef.current.length; i++) {
      const particle = particlesRef.current[i];
      let connectionCount = 0;

      for (
        let j = i + 1;
        j < particlesRef.current.length && connectionCount < maxConnections;
        j++
      ) {
        const other = particlesRef.current[j];

        const dx = particle.position.x - other.position.x;
        const dy = particle.position.y - other.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.2;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = "rgba(139, 92, 246, 0.6)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.position.x, particle.position.y);
          ctx.lineTo(other.position.x, other.position.y);
          ctx.stroke();
          ctx.restore();

          connectionCount++;
        }
      }
    }
  }, []);

  return {
    particles: particlesRef.current,
    render,
    danceEngine: danceEngineRef.current,
    physicsEngine: physicsEngineRef.current,
  };
}
