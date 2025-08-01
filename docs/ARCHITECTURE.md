# Particle Dance Template System - Architecture

## Overview

The Particle Dance Template System is a sophisticated Next.js application that enables users to create, customize, and export particle-based video templates inspired by dance choreography.

## Core Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main editor page
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── ui/               # Reusable UI primitives
│   ├── editor/           # Editor-specific components
│   └── canvas/           # Three.js/Canvas components
│
├── lib/                  # Core business logic
│   ├── types/           # TypeScript definitions
│   ├── engine/          # Core engines (Template, Particle, Animation)
│   ├── templates/       # Template definitions
│   └── utils/           # Utility functions
│
└── hooks/               # Custom React hooks
```

## Key Components

### 1. Template Engine (`src/lib/engine/TemplateEngine.ts`)
- Manages template lifecycle
- Handles parameter validation
- Coordinates with other engines

### 2. Particle Engine (`src/lib/engine/ParticleEngine.ts`)
- Manages particle systems
- Handles physics simulation
- Optimizes performance

### 3. Animation Engine (`src/lib/engine/AnimationEngine.ts`)
- Manages keyframe animations
- Handles easing functions
- Synchronizes with music/rhythm

### 4. Template Editor (`src/components/editor/TemplateEditor.tsx`)
- Main editor interface
- Coordinates parameter panel, canvas, and timeline
- Manages editor state

## Data Flow

1. **Template Loading**: Templates are loaded from JSON definitions
2. **Parameter Updates**: UI changes trigger parameter updates
3. **Engine Processing**: Engines process parameter changes
4. **Rendering**: Three.js renders the updated particle system
5. **Export**: Final animations are exported as video files

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Next.js with Turbopack

## Performance Considerations

- **Particle Culling**: Off-screen particles are not rendered
- **LOD System**: Level-of-detail for distant particles
- **Spatial Hashing**: Efficient collision detection
- **Memory Management**: Particle pooling and recycling
- **Frame Budget**: Limited processing time per frame