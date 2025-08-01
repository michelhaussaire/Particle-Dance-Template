/**
 * Animation system types and interfaces
 * 
 * Defines the structure for keyframe animations, easing functions,
 * and timeline management in the particle dance system.
 */

import { Vector3D, EasingFunction } from './particle';

export interface AnimationClip {
  id: string;
  name: string;
  duration: number; // in seconds
  tracks: AnimationTrack[];
  loop: boolean;
  blendMode: BlendMode;
}

export interface AnimationTrack {
  id: string;
  target: string; // property path (e.g., "position.x", "color.r")
  keyframes: Keyframe[];
  interpolation: InterpolationType;
  easing: EasingFunction;
}

export interface Keyframe {
  time: number; // 0-1 normalized time
  value: any; // can be number, Vector3D, color, etc.
  tangentIn?: Vector2D; // for bezier interpolation
  tangentOut?: Vector2D;
  easing?: EasingFunction; // override track easing
}

export interface AnimationState {
  currentTime: number;
  playbackSpeed: number;
  isPlaying: boolean;
  isPaused: boolean;
  loop: boolean;
  
  // Active clips
  activeClips: {
    [clipId: string]: {
      weight: number;
      timeOffset: number;
      playbackRate: number;
    };
  };
}

export interface Timeline {
  duration: number;
  currentTime: number;
  playbackSpeed: number;
  
  // Timeline controls
  isPlaying: boolean;
  isPaused: boolean;
  loop: boolean;
  
  // Markers and regions
  markers: TimelineMarker[];
  regions: TimelineRegion[];
  
  // Zoom and view
  viewStart: number; // 0-1
  viewEnd: number; // 0-1
  zoom: number;
}

export interface TimelineMarker {
  id: string;
  time: number;
  label: string;
  color: string;
  type: MarkerType;
}

export interface TimelineRegion {
  id: string;
  startTime: number;
  endTime: number;
  label: string;
  color: string;
  enabled: boolean;
}

export interface DanceMotion {
  id: string;
  name: string;
  type: DanceMotionType;
  
  // Motion parameters
  amplitude: Vector3D;
  frequency: number;
  phase: number;
  offset: Vector3D;
  
  // Rhythm sync
  syncToBeat: boolean;
  beatDivision: number; // 1, 2, 4, 8, 16
  
  // Modulation
  modulation: {
    amplitude: ModulationCurve;
    frequency: ModulationCurve;
    phase: ModulationCurve;
  };
}

export interface ModulationCurve {
  type: CurveType;
  points: CurvePoint[];
  smooth: boolean;
}

export interface CurvePoint {
  time: number; // 0-1
  value: number;
  tangentIn?: Vector2D;
  tangentOut?: Vector2D;
}

export interface BeatSync {
  bpm: number;
  timeSignature: [number, number]; // [beats per measure, note value]
  currentBeat: number;
  currentMeasure: number;
  
  // Sync settings
  quantization: number; // snap to 1/4, 1/8, 1/16 notes
  swing: number; // 0-1, adds rhythmic feel
  
  // Analysis data (from audio)
  onsetTimes: number[];
  beatTimes: number[];
  tempo: number;
  confidence: number;
}

// Supporting types
export interface Vector2D {
  x: number;
  y: number;
}

// Enums
export type BlendMode = 'replace' | 'add' | 'multiply' | 'overlay' | 'screen';

export type InterpolationType = 'linear' | 'cubic' | 'bezier' | 'step' | 'smooth';

export type MarkerType = 'cue' | 'beat' | 'section' | 'highlight';

export type DanceMotionType = 
  | 'wave' 
  | 'spiral' 
  | 'pendulum' 
  | 'bounce' 
  | 'flow' 
  | 'pulse' 
  | 'orbit' 
  | 'scatter'
  | 'formation'
  | 'follow';

export type CurveType = 'linear' | 'bezier' | 'cardinal' | 'bspline' | 'step';

// Animation utilities
export interface AnimationMixer {
  clips: AnimationClip[];
  state: AnimationState;
  
  // Control methods
  play(clipId: string, weight?: number): void;
  stop(clipId: string): void;
  pause(): void;
  resume(): void;
  
  // Blending
  crossFade(fromClip: string, toClip: string, duration: number): void;
  setWeight(clipId: string, weight: number): void;
  
  // Update
  update(deltaTime: number): void;
}