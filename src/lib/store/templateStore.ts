/**
 * Template Store - Global State Management
 * 
 * Zustand store for managing template state, particle parameters,
 * and animation controls across the application.
 */

import { create } from 'zustand';
import { ParticleTemplate, TemplateConfig } from '@/lib/types/template';
import { PARTICLES, ANIMATION, TEMPLATES } from '@/lib/utils/constants';

interface TemplateState {
  // Current template
  currentTemplate: ParticleTemplate | null;
  
  // Particle system parameters
  particleCount: number;
  animationSpeed: number;
  patternType: string;
  
  // Animation state
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  
  // UI state
  isLoading: boolean;
  selectedPanel: 'parameters' | 'timeline' | 'export';
  
  // Performance
  fps: number;
  performanceMode: 'auto' | 'high' | 'medium' | 'low';
}

interface TemplateActions {
  // Template management
  loadTemplate: (template: ParticleTemplate) => void;
  updateTemplate: (updates: Partial<TemplateConfig>) => void;
  resetTemplate: () => void;
  
  // Parameter controls
  setParticleCount: (count: number) => void;
  setAnimationSpeed: (speed: number) => void;
  setPatternType: (pattern: string) => void;
  
  // Animation controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  
  // UI controls
  setLoading: (loading: boolean) => void;
  setSelectedPanel: (panel: 'parameters' | 'timeline' | 'export') => void;
  
  // Performance
  updateFPS: (fps: number) => void;
  setPerformanceMode: (mode: 'auto' | 'high' | 'medium' | 'low') => void;
}

type TemplateStore = TemplateState & TemplateActions;

// Default template configuration
const createDefaultTemplate = (): ParticleTemplate => ({
  id: TEMPLATES.DEFAULT_TEMPLATE_ID,
  name: 'Basic Dance Template',
  description: 'A simple wave-based dance pattern',
  version: TEMPLATES.TEMPLATE_VERSION,
  createdAt: new Date(),
  updatedAt: new Date(),
  
  config: {
    particles: {
      count: PARTICLES.DEFAULT_PARTICLES,
      size: PARTICLES.DEFAULT_SIZE,
      sizeVariation: 0.2,
      color: '#8b5cf6',
      colorVariation: 0.1,
      opacity: PARTICLES.DEFAULT_OPACITY,
      opacityVariation: 0.1,
    },
    physics: {
      gravity: PARTICLES.DEFAULT_GRAVITY,
      damping: PARTICLES.DEFAULT_DAMPING,
      turbulence: 0.1,
      attractors: [],
    },
    rendering: {
      blendMode: 'additive',
      material: 'basic',
      shadows: false,
      lighting: {
        ambient: {
          color: '#404040',
          intensity: 0.4,
        },
        directional: [{
          color: '#ffffff',
          intensity: 0.8,
          position: { x: 10, y: 10, z: 10 },
        }],
        point: [],
      },
    },
    performance: {
      maxParticles: PARTICLES.DEFAULT_PARTICLES,
      cullingDistance: 100,
      updateFrequency: 60,
      renderQuality: 'high',
    },
  },
  
  timeline: {
    duration: ANIMATION.DEFAULT_DURATION,
    keyframes: [],
    easing: ANIMATION.DEFAULT_EASING,
    loop: true,
    autoplay: true,
  },
  
  parameters: [],
  
  metadata: {
    author: 'Particle Dance System',
    tags: ['basic', 'wave', 'dance'],
    difficulty: 'beginner',
    estimatedRenderTime: 30,
    requiredFeatures: ['webgl'],
    compatibility: {
      minWebGLVersion: 1,
      requiredExtensions: [],
    },
  },
});

export const useTemplateStore = create<TemplateStore>((set, get) => ({
      // Initial state
      currentTemplate: createDefaultTemplate(),
      particleCount: PARTICLES.DEFAULT_PARTICLES,
      animationSpeed: 1.0,
      patternType: 'wave',
      
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      duration: ANIMATION.DEFAULT_DURATION,
      
      isLoading: false,
      selectedPanel: 'parameters',
      
      fps: 60,
      performanceMode: 'auto',
      
      // Template management
      loadTemplate: (template) => {
        set({
          currentTemplate: template,
          particleCount: template.config.particles.count,
          duration: template.timeline.duration,
          isLoading: false,
        });
      },
      
      updateTemplate: (updates) => {
        const current = get().currentTemplate;
        if (!current) return;
        
        set({
          currentTemplate: {
            ...current,
            config: {
              ...current.config,
              ...updates,
            },
            updatedAt: new Date(),
          },
        });
      },
      
      resetTemplate: () => {
        const defaultTemplate = createDefaultTemplate();
        set({
          currentTemplate: defaultTemplate,
          particleCount: defaultTemplate.config.particles.count,
          animationSpeed: 1.0,
          patternType: 'wave',
          currentTime: 0,
          isPlaying: false,
          isPaused: false,
        });
      },
      
      // Parameter controls
      setParticleCount: (count) => {
        const clampedCount = Math.max(
          PARTICLES.MIN_PARTICLES,
          Math.min(PARTICLES.MAX_PARTICLES, count)
        );
        
        set({ particleCount: clampedCount });
        
        // Update template config
        const current = get().currentTemplate;
        if (current) {
          get().updateTemplate({
            particles: {
              ...current.config.particles,
              count: clampedCount,
            },
          });
        }
      },
      
      setAnimationSpeed: (speed) => {
        const clampedSpeed = Math.max(0.1, Math.min(5.0, speed));
        set({ animationSpeed: clampedSpeed });
      },
      
      setPatternType: (pattern) => {
        set({ patternType: pattern });
      },
      
      // Animation controls
      play: () => {
        set({ isPlaying: true, isPaused: false });
      },
      
      pause: () => {
        set({ isPaused: true, isPlaying: false });
      },
      
      stop: () => {
        set({ 
          isPlaying: false, 
          isPaused: false, 
          currentTime: 0 
        });
      },
      
      seek: (time) => {
        const duration = get().duration;
        const clampedTime = Math.max(0, Math.min(duration, time));
        set({ currentTime: clampedTime });
      },
      
      // UI controls
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      setSelectedPanel: (panel) => {
        set({ selectedPanel: panel });
      },
      
      // Performance
      updateFPS: (fps) => {
        set({ fps });
        
        // Auto-adjust performance mode based on FPS
        const performanceMode = get().performanceMode;
        if (performanceMode === 'auto') {
          if (fps < 30) {
            get().setPerformanceMode('low');
          } else if (fps < 45) {
            get().setPerformanceMode('medium');
          } else {
            get().setPerformanceMode('high');
          }
        }
      },
      
      setPerformanceMode: (mode) => {
        set({ performanceMode: mode });
        
        // Adjust particle count based on performance mode
        if (mode !== 'auto') {
          const counts = {
            low: 200,
            medium: 500,
            high: 1000,
          };
          
          get().setParticleCount(counts[mode]);
        }
      },
    }));