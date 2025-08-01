/**
 * Particle system types and interfaces
 * 
 * Defines the structure for individual particles, particle systems,
 * and movement patterns used in the dance template system.
 */

export interface Particle {
  // Unique identifier
  id: string;
  
  // Spatial properties
  position: Vector3D;
  velocity: Vector3D;
  acceleration: Vector3D;
  
  // Visual properties
  size: number;
  color: ColorRGBA;
  opacity: number;
  rotation: number;
  
  // Physics properties
  mass: number;
  lifetime: number;
  age: number;
  
  // Animation state
  animationState: ParticleAnimationState;
  
  // Metadata
  birthTime: number;
  lastUpdate: number;
  isAlive: boolean;
}

export interface ParticleSystem {
  // System identification
  id: string;
  name: string;
  
  // Particle collection
  particles: Particle[];
  maxParticles: number;
  
  // Emitter configuration
  emitter: ParticleEmitter;
  
  // Global forces and modifiers
  forces: Force[];
  modifiers: ParticleModifier[];
  
  // Performance settings
  performance: {
    spatialHashing: boolean;
    frustumCulling: boolean;
    lodLevels: number;
    updateBudget: number; // milliseconds per frame
  };
  
  // System state
  isActive: boolean;
  isPaused: boolean;
  time: number;
  deltaTime: number;
}

export interface ParticleEmitter {
  // Emission properties
  rate: number; // particles per second
  burst: {
    count: number;
    interval: number;
    cycles: number;
  };
  
  // Spatial distribution
  shape: EmitterShape;
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
  
  // Initial particle properties
  initialVelocity: {
    direction: Vector3D;
    speed: number;
    speedVariation: number;
    spread: number; // cone angle in degrees
  };
  
  // Particle spawning rules
  spawnRules: {
    lifetime: number;
    lifetimeVariation: number;
    size: number;
    sizeVariation: number;
    color: ColorRGBA;
    colorVariation: number;
  };
}

export interface ParticleAnimationState {
  // Current animation phase
  phase: AnimationPhase;
  
  // Dance-specific properties
  dancePattern: DancePattern;
  rhythmSync: RhythmSync;
  
  // Movement state
  targetPosition?: Vector3D;
  pathProgress: number;
  movementSmoothing: number;
  
  // Behavioral state
  behavior: ParticleBehavior;
  neighbors: string[]; // IDs of nearby particles
  flockingInfluence: number;
}

export interface DancePattern {
  type: DancePatternType;
  amplitude: Vector3D;
  frequency: Vector3D;
  phase: Vector3D;
  direction: Vector3D;
  
  // Pattern-specific parameters
  parameters: {
    [key: string]: number;
  };
}

export interface RhythmSync {
  bpm: number;
  beat: number; // current beat (0-1)
  measure: number; // current measure
  intensity: number; // 0-1, based on audio analysis
  
  // Sync behavior
  snapToBeat: boolean;
  beatMultiplier: number;
  phaseOffset: number;
}

export interface Force {
  id: string;
  type: ForceType;
  strength: number;
  position: Vector3D;
  direction: Vector3D;
  radius: number;
  falloff: FalloffType;
  
  // Time-based properties
  duration?: number;
  startTime?: number;
  easing?: EasingFunction;
}

export interface ParticleModifier {
  id: string;
  type: ModifierType;
  target: ModifierTarget;
  operation: ModifierOperation;
  value: any;
  
  // Conditional application
  condition?: (particle: Particle) => boolean;
  probability?: number;
  
  // Time constraints
  startTime?: number;
  duration?: number;
}

// Supporting types
export interface ColorRGBA {
  r: number; // 0-1
  g: number; // 0-1
  b: number; // 0-1
  a: number; // 0-1
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// Enums and union types
export type EmitterShape = 'point' | 'box' | 'sphere' | 'circle' | 'line' | 'mesh';

export type AnimationPhase = 'spawning' | 'alive' | 'dying' | 'dead';

export type DancePatternType = 
  | 'wave' 
  | 'spiral' 
  | 'bounce' 
  | 'flow' 
  | 'orbit' 
  | 'scatter' 
  | 'formation' 
  | 'follow';

export type ParticleBehavior = 
  | 'independent' 
  | 'flocking' 
  | 'following' 
  | 'avoiding' 
  | 'seeking' 
  | 'wandering';

export type ForceType = 
  | 'gravity' 
  | 'wind' 
  | 'attraction' 
  | 'repulsion' 
  | 'vortex' 
  | 'turbulence' 
  | 'drag';

export type FalloffType = 'linear' | 'quadratic' | 'exponential' | 'constant';

export type ModifierType = 
  | 'colorOverTime' 
  | 'sizeOverTime' 
  | 'velocityOverTime' 
  | 'opacityOverTime' 
  | 'rotationOverTime';

export type ModifierTarget = 'position' | 'velocity' | 'color' | 'size' | 'opacity' | 'rotation';

export type ModifierOperation = 'set' | 'add' | 'multiply' | 'lerp' | 'curve';

export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';