/**
 * Application constants and configuration values
 *
 * Centralized location for all magic numbers, default values,
 * and configuration constants used throughout the application.
 */

// Performance constants
export const PERFORMANCE = {
  MAX_PARTICLES: 10000,
  DEFAULT_PARTICLES: 1000,
  MIN_PARTICLES: 10,

  TARGET_FPS: 60,
  MIN_FPS: 30,
  PERFORMANCE_CHECK_INTERVAL: 1000, // ms

  SPATIAL_HASH_CELL_SIZE: 10,
  CULLING_DISTANCE: 100,
  LOD_DISTANCES: [50, 100, 200],

  UPDATE_BUDGET_MS: 16, // max time per frame for updates
  RENDER_BUDGET_MS: 8, // max time per frame for rendering
} as const;

// Animation constants
export const ANIMATION = {
  DEFAULT_DURATION: 10, // seconds
  MIN_DURATION: 1,
  MAX_DURATION: 60,

  KEYFRAME_INTERPOLATION_STEPS: 60,
  SMOOTH_FACTOR: 0.1,

  DEFAULT_EASING: "easeInOut" as const,

  // Dance pattern defaults
  DANCE_BPM: 120,
  BEAT_SNAP_THRESHOLD: 0.1,
  RHYTHM_SMOOTHING: 0.2,
} as const;

// Particle system defaults
export const PARTICLES = {
  // Particle count limits
  DEFAULT_PARTICLES: 500,
  MIN_PARTICLES: 10,
  MAX_PARTICLES: 2000,

  DEFAULT_SIZE: 2.0,
  SIZE_RANGE: [0.1, 10.0],

  DEFAULT_LIFETIME: 5.0,
  LIFETIME_RANGE: [0.1, 30.0],

  DEFAULT_SPEED: 10.0,
  SPEED_RANGE: [0.0, 100.0],

  DEFAULT_OPACITY: 0.8,
  OPACITY_RANGE: [0.0, 1.0],

  // Color defaults (HSV)
  DEFAULT_HUE: 270, // Purple
  DEFAULT_SATURATION: 80,
  DEFAULT_VALUE: 90,

  // Physics defaults
  DEFAULT_GRAVITY: { x: 0, y: -9.81, z: 0 },
  DEFAULT_DAMPING: 0.99,
  DEFAULT_MASS: 1.0,
} as const;

// UI constants
export const UI = {
  PANEL_MIN_WIDTH: 280,
  PANEL_MAX_WIDTH: 400,
  PANEL_DEFAULT_WIDTH: 320,

  SLIDER_PRECISION: 2,
  COLOR_PICKER_SIZE: 200,

  TIMELINE_HEIGHT: 100,
  TIMELINE_ZOOM_LEVELS: [0.5, 1, 2, 4, 8],

  CANVAS_MIN_SIZE: { width: 400, height: 400 },
  PREVIEW_QUALITY_LEVELS: ["low", "medium", "high", "ultra"] as const,
} as const;

// Rendering constants
export const RENDERING = {
  DEFAULT_BACKGROUND_COLOR: "#0f0f23",
  DEFAULT_PARTICLE_COLOR: "#8b5cf6",

  CAMERA_DEFAULTS: {
    fov: 75,
    near: 0.1,
    far: 1000,
    position: { x: 0, y: 0, z: 50 },
  },

  LIGHTING_DEFAULTS: {
    ambient: {
      color: "#404040",
      intensity: 0.4,
    },
    directional: {
      color: "#ffffff",
      intensity: 0.8,
      position: { x: 10, y: 10, z: 10 },
    },
  },

  MATERIAL_TYPES: ["basic", "standard", "physical", "shader"] as const,
  BLEND_MODES: ["normal", "additive", "subtractive", "multiply"] as const,
} as const;

// Template system constants
export const TEMPLATES = {
  DEFAULT_TEMPLATE_ID: "basic-dance",
  TEMPLATE_VERSION: "1.0.0",

  PARAMETER_CATEGORIES: [
    "particles",
    "physics",
    "rendering",
    "animation",
    "performance",
  ] as const,

  DANCE_PATTERNS: [
    "wave",
    "spiral",
    "bounce",
    "flow",
    "orbit",
    "scatter",
    "formation",
    "follow",
  ] as const,

  EASING_FUNCTIONS: [
    "linear",
    "easeIn",
    "easeOut",
    "easeInOut",
    "bounce",
    "elastic",
  ] as const,
} as const;
