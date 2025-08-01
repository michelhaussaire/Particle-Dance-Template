/**
 * Core template system types for the Particle Dance Template System
 * 
 * These interfaces define the structure for particle templates,
 * animation configurations, and parameter controls.
 */

export interface ParticleTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Core configuration
  config: TemplateConfig;
  
  // Animation timeline
  timeline: AnimationTimeline;
  
  // Parameter definitions
  parameters: ParameterDefinition[];
  
  // Metadata
  metadata: TemplateMetadata;
}

export interface TemplateConfig {
  // Particle system settings
  particles: {
    count: number;
    size: number;
    sizeVariation: number;
    color: string;
    colorVariation: number;
    opacity: number;
    opacityVariation: number;
  };
  
  // Physics settings
  physics: {
    gravity: Vector3D;
    damping: number;
    turbulence: number;
    attractors: Attractor[];
  };
  
  // Rendering settings
  rendering: {
    blendMode: BlendMode;
    material: MaterialType;
    shadows: boolean;
    lighting: LightingConfig;
  };
  
  // Performance settings
  performance: {
    maxParticles: number;
    cullingDistance: number;
    updateFrequency: number;
    renderQuality: RenderQuality;
  };
}

export interface AnimationTimeline {
  duration: number; // in seconds
  keyframes: Keyframe[];
  easing: EasingFunction;
  loop: boolean;
  autoplay: boolean;
}

export interface Keyframe {
  time: number; // 0-1 normalized time
  properties: {
    position?: Vector3D;
    rotation?: Vector3D;
    scale?: Vector3D;
    color?: string;
    opacity?: number;
    [key: string]: any;
  };
  easing?: EasingFunction;
}

export interface ParameterDefinition {
  id: string;
  name: string;
  description: string;
  type: ParameterType;
  category: ParameterCategory;
  
  // Value constraints
  defaultValue: any;
  minValue?: number;
  maxValue?: number;
  step?: number;
  options?: string[]; // for select/enum types
  
  // UI configuration
  ui: {
    component: UIComponentType;
    label: string;
    tooltip?: string;
    unit?: string;
    precision?: number;
  };
  
  // Animation support
  animatable: boolean;
  realtime: boolean; // updates in real-time vs on release
}

export interface TemplateMetadata {
  author: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedRenderTime: number; // in seconds
  requiredFeatures: string[];
  compatibility: {
    minWebGLVersion: number;
    requiredExtensions: string[];
  };
}

// Supporting types
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Attractor {
  position: Vector3D;
  strength: number;
  radius: number;
  type: 'point' | 'line' | 'plane';
}

export interface LightingConfig {
  ambient: {
    color: string;
    intensity: number;
  };
  directional: {
    color: string;
    intensity: number;
    position: Vector3D;
  }[];
  point: {
    color: string;
    intensity: number;
    position: Vector3D;
    distance: number;
  }[];
}

// Enums
export type BlendMode = 'normal' | 'additive' | 'subtractive' | 'multiply';
export type MaterialType = 'basic' | 'standard' | 'physical' | 'shader';
export type RenderQuality = 'low' | 'medium' | 'high' | 'ultra';
export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';
export type ParameterType = 'number' | 'range' | 'color' | 'boolean' | 'select' | 'vector3' | 'text';
export type ParameterCategory = 'particles' | 'physics' | 'rendering' | 'animation' | 'performance';
export type UIComponentType = 'slider' | 'input' | 'colorPicker' | 'toggle' | 'select' | 'vector3Input';