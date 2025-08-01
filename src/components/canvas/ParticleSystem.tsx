/**
 * Particle System Component (Canvas-based)
 * 
 * Simplified particle system using HTML5 Canvas API
 * with dance-inspired movement patterns.
 */

'use client';

import { useEffect, useRef } from 'react';

interface ParticleSystemProps {
  count: number;
  animationSpeed: number;
  pattern: string;
  canvas: HTMLCanvasElement;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  age: number;
  phase: number;
}

export class ParticleSystemEngine {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private startTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;
  }

  initialize(count: number) {
    this.particles = [];
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    for (let i = 0; i < count; i++) {
      // Create particles in formation
      const angle = (i / count) * Math.PI * 2;
      const radius = 50 + (i % 3) * 30;
      
      this.particles.push({
        id: i,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        baseX: centerX + Math.cos(angle) * radius,
        baseY: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        size: 2 + Math.random() * 2,
        color: `hsl(${270 + (i / count) * 60}, 80%, ${60 + Math.random() * 20}%)`,
        alpha: 0.8,
        age: 0,
        phase: i * 0.1,
      });
    }
  }

  updateParticles(time: number, speed: number, pattern: string) {
    const t = time * speed * 0.001; // Convert to seconds
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.particles.forEach((particle, index) => {
      const phase = particle.phase;
      
      switch (pattern) {
        case 'wave':
          particle.x = particle.baseX + Math.sin(t + phase) * 60;
          particle.y = particle.baseY + Math.sin(t * 1.5 + phase) * 40;
          break;

        case 'spiral':
          const spiralRadius = 80 + Math.sin(t + phase) * 30;
          const spiralAngle = t + phase;
          particle.x = centerX + Math.cos(spiralAngle) * spiralRadius;
          particle.y = centerY + Math.sin(spiralAngle) * spiralRadius + Math.sin(t * 2 + phase) * 20;
          break;

        case 'bounce':
          particle.x = particle.baseX + Math.sin(t * 2 + phase) * 40;
          particle.y = centerY + Math.abs(Math.sin(t * 3 + phase)) * 80 - 40;
          break;

        case 'flow':
        default:
          particle.x = particle.baseX + Math.sin(t * 0.8 + phase) * 80;
          particle.y = particle.baseY + Math.sin(t + phase) * 60;
          break;
      }

      // Update visual properties
      particle.alpha = 0.6 + Math.sin(t * 2 + phase) * 0.3;
      particle.size = 2 + Math.sin(t * 1.5 + phase) * 1.5;
      particle.age += 1;
    });
  }

  render() {
    // Clear with fade effect
    this.ctx.fillStyle = 'rgba(15, 15, 35, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw particles
    this.particles.forEach((particle) => {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, particle.alpha);
      
      // Particle glow effect
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(0.5, particle.color.replace('80%', '60%'));
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Inner bright core
      this.ctx.fillStyle = particle.color.replace('60%', '90%');
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });

    // Draw connections between nearby particles
    this.drawConnections();
  }

  private drawConnections() {
    const maxDistance = 80;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.3;
          
          this.ctx.save();
          this.ctx.globalAlpha = alpha;
          this.ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  start() {
    this.startTime = performance.now();
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    const currentTime = performance.now() - this.startTime;
    // These will be set by the component
    this.updateParticles(currentTime, 1, 'wave');
    this.render();
    this.animationId = requestAnimationFrame(this.animate);
  };

  setParameters(speed: number, pattern: string) {
    // This method can be called to update parameters
    const currentTime = performance.now() - this.startTime;
    this.updateParticles(currentTime, speed, pattern);
  }

  destroy() {
    this.stop();
  }
}

// React component wrapper (not used directly, but kept for compatibility)
export function ParticleSystem({ count, animationSpeed, pattern }: {
  count: number;
  animationSpeed: number;
  pattern: string;
}) {
  // This component is not used in the canvas implementation
  // but kept for API compatibility
  return null;
}