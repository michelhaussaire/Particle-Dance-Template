/**
 * Sample Presets for Demo
 *
 * Pre-configured dance patterns to showcase the system capabilities
 * and provide users with immediate examples to explore.
 */

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  particleCount: number;
  animationSpeed: number;
  patternType: string;
  category: "beginner" | "intermediate" | "advanced" | "showcase";
  tags: string[];
  thumbnail?: string;
  createdAt: string;
}

export const SAMPLE_PRESETS: DemoPreset[] = [
  // Beginner Presets
  {
    id: "gentle-waves",
    name: "Gentle Waves",
    description:
      "Soft, flowing movements inspired by ocean waves. Perfect for relaxing backgrounds.",
    particleCount: 300,
    animationSpeed: 0.8,
    patternType: "wave",
    category: "beginner",
    tags: ["calm", "ocean", "relaxing", "blue"],
    createdAt: new Date("2024-01-15T10:00:00Z").toISOString(),
  },
  {
    id: "simple-spiral",
    name: "Simple Spiral",
    description:
      "Basic spiral formation with smooth transitions. Great for learning the system.",
    particleCount: 250,
    animationSpeed: 1.0,
    patternType: "spiral",
    category: "beginner",
    tags: ["simple", "spiral", "learning", "basic"],
    createdAt: new Date("2024-01-15T11:00:00Z").toISOString(),
  },

  // Intermediate Presets
  {
    id: "energetic-bounce",
    name: "Energetic Bounce",
    description:
      "Dynamic bouncing particles with rhythmic patterns. Perfect for music visualization.",
    particleCount: 500,
    animationSpeed: 1.5,
    patternType: "bounce",
    category: "intermediate",
    tags: ["energetic", "music", "rhythm", "dynamic"],
    createdAt: new Date("2024-01-15T12:00:00Z").toISOString(),
  },
  {
    id: "morphing-flow",
    name: "Morphing Flow",
    description: "Smooth transitions between different shapes and formations.",
    particleCount: 600,
    animationSpeed: 1.2,
    patternType: "flow",
    category: "intermediate",
    tags: ["morphing", "shapes", "transitions", "fluid"],
    createdAt: new Date("2024-01-15T13:00:00Z").toISOString(),
  },

  // Advanced Presets
  {
    id: "hypnotic-spiral",
    name: "Hypnotic Spiral",
    description:
      "Complex multi-layered spiral with mesmerizing depth and movement.",
    particleCount: 800,
    animationSpeed: 2.0,
    patternType: "spiral",
    category: "advanced",
    tags: ["hypnotic", "complex", "mesmerizing", "deep"],
    createdAt: new Date("2024-01-15T14:00:00Z").toISOString(),
  },
  {
    id: "storm-waves",
    name: "Storm Waves",
    description: "Intense wave patterns simulating a powerful storm at sea.",
    particleCount: 1000,
    animationSpeed: 2.5,
    patternType: "wave",
    category: "advanced",
    tags: ["intense", "storm", "powerful", "dramatic"],
    createdAt: new Date("2024-01-15T15:00:00Z").toISOString(),
  },

  // Showcase Presets
  {
    id: "aurora-dance",
    name: "Aurora Dance",
    description:
      "Ethereal movements inspired by the Northern Lights. A showcase of fluid beauty.",
    particleCount: 750,
    animationSpeed: 1.3,
    patternType: "flow",
    category: "showcase",
    tags: ["aurora", "ethereal", "beautiful", "showcase", "lights"],
    createdAt: new Date("2024-01-15T16:00:00Z").toISOString(),
  },
  {
    id: "cosmic-spiral",
    name: "Cosmic Spiral",
    description:
      "Galaxy-inspired spiral formation with cosmic depth and mystery.",
    particleCount: 900,
    animationSpeed: 1.8,
    patternType: "spiral",
    category: "showcase",
    tags: ["cosmic", "galaxy", "space", "mysterious", "showcase"],
    createdAt: new Date("2024-01-15T17:00:00Z").toISOString(),
  },
  {
    id: "rhythm-master",
    name: "Rhythm Master",
    description:
      "Ultimate rhythmic pattern combining all movement types in perfect harmony.",
    particleCount: 1200,
    animationSpeed: 2.2,
    patternType: "bounce",
    category: "showcase",
    tags: ["rhythm", "master", "ultimate", "harmony", "showcase"],
    createdAt: new Date("2024-01-15T18:00:00Z").toISOString(),
  },
];

export const PRESET_CATEGORIES = {
  beginner: {
    name: "Beginner",
    description:
      "Simple, easy-to-understand patterns perfect for getting started",
    icon: "🌱",
    color: "green",
  },
  intermediate: {
    name: "Intermediate",
    description: "More complex patterns with dynamic movements and effects",
    icon: "🎯",
    color: "blue",
  },
  advanced: {
    name: "Advanced",
    description: "Complex, high-performance patterns for experienced users",
    icon: "🚀",
    color: "purple",
  },
  showcase: {
    name: "Showcase",
    description: "Stunning demonstrations of the system's full capabilities",
    icon: "✨",
    color: "gold",
  },
} as const;

/**
 * Get presets by category
 */
export function getPresetsByCategory(
  category: keyof typeof PRESET_CATEGORIES
): DemoPreset[] {
  return SAMPLE_PRESETS.filter((preset) => preset.category === category);
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): DemoPreset | undefined {
  return SAMPLE_PRESETS.find((preset) => preset.id === id);
}

/**
 * Search presets by name or tags
 */
export function searchPresets(query: string): DemoPreset[] {
  const lowercaseQuery = query.toLowerCase();
  return SAMPLE_PRESETS.filter(
    (preset) =>
      preset.name.toLowerCase().includes(lowercaseQuery) ||
      preset.description.toLowerCase().includes(lowercaseQuery) ||
      preset.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get random preset for demo
 */
export function getRandomPreset(): DemoPreset {
  const randomIndex = Math.floor(Math.random() * SAMPLE_PRESETS.length);
  return SAMPLE_PRESETS[randomIndex];
}

/**
 * Load sample presets into localStorage if none exist
 */
export function initializeSamplePresets(): void {
  const existingPresets = localStorage.getItem("particle-dance-presets");

  if (!existingPresets || JSON.parse(existingPresets).length === 0) {
    localStorage.setItem(
      "particle-dance-presets",
      JSON.stringify(SAMPLE_PRESETS)
    );
  }
}
