/**
 * Dance Pattern Engine
 *
 * Advanced dance pattern system inspired by TikTok videos.
 * Implements sophisticated movement algorithms that mimic
 * human choreography and dance dynamics.
 */

import { Vector3D } from "@/lib/types/particle";

export interface DanceMove {
  name: string;
  duration: number; // in seconds
  intensity: number; // 0-1
  complexity: number; // 0-1
  execute: (
    particle: any,
    time: number,
    index: number,
    params: any
  ) => Vector3D;
}

export interface ChoreographySequence {
  moves: DanceMove[];
  transitions: TransitionType[];
  rhythm: RhythmPattern;
  formation: FormationType;
}

export type TransitionType = "smooth" | "sharp" | "bounce" | "elastic";
export type FormationType =
  | "grid"
  | "circle"
  | "line"
  | "random"
  | "heart"
  | "star";
export type RhythmPattern =
  | "steady"
  | "accelerating"
  | "syncopated"
  | "build-drop";

export class DancePatternEngine {
  private currentTime: number = 0;
  private beatTime: number = 0;
  private bpm: number = 120;

  constructor(bpm: number = 120) {
    this.bpm = bpm;
  }

  /**
   * Contemporary Flow Pattern (Video 1 inspired)
   * Fluid, continuous movements with organic transitions
   */
  createContemporaryFlow(): DanceMove {
    return {
      name: "Contemporary Flow",
      duration: 8,
      intensity: 0.7,
      complexity: 0.8,
      execute: (particle, time, index, params) => {
        const t = time * 0.001;
        const phase = index * 0.1;
        const flow = params.flowIntensity || 1.0;

        // Layered wave motions creating fluid movement
        const primaryWave = Math.sin(t * 0.8 + phase) * 80 * flow;
        const secondaryWave = Math.sin(t * 1.2 + phase * 0.7) * 40 * flow;
        const verticalFlow = Math.sin(t * 0.6 + phase * 1.3) * 60 * flow;

        // Add organic variation
        const organicX = Math.sin(t * 0.3 + phase * 2) * 20;
        const organicY = Math.cos(t * 0.4 + phase * 1.5) * 15;

        return {
          x: primaryWave + secondaryWave + organicX,
          y: verticalFlow + organicY,
          z: Math.sin(t * 0.5 + phase) * 30 * flow,
        };
      },
    };
  }

  /**
   * Rhythmic Beat Pattern (Video 2 inspired)
   * Sharp, rhythmic movements with beat synchronization
   */
  createRhythmicBeat(): DanceMove {
    return {
      name: "Rhythmic Beat",
      duration: 4,
      intensity: 0.9,
      complexity: 0.6,
      execute: (particle, time, index, params) => {
        const t = time * 0.001;
        const beatPhase = ((t * this.bpm) / 60) % 1;
        const beatIntensity = params.beatIntensity || 1.0;

        // Sharp movements on beat
        const beatPulse = this.createBeatPulse(beatPhase, beatIntensity);
        const snapMovement = this.createSnapMovement(t, index, beatIntensity);

        // Rhythmic positioning
        const gridX = ((index % 10) - 5) * 25;
        const gridY = (Math.floor(index / 10) - 5) * 25;

        return {
          x: gridX + snapMovement.x * beatPulse,
          y: gridY + snapMovement.y * beatPulse,
          z: snapMovement.z * beatPulse * 0.5,
        };
      },
    };
  }

  /**
   * Spiral Formation Dance
   * Particles move in spiral formations with group coordination
   */
  createSpiralFormation(): DanceMove {
    return {
      name: "Spiral Formation",
      duration: 12,
      intensity: 0.8,
      complexity: 0.9,
      execute: (particle, time, index, params) => {
        const t = time * 0.001;
        const spiralSpeed = params.spiralSpeed || 1.0;
        const formationSize = params.formationSize || 100;

        // Multi-layer spiral
        const layer = Math.floor(index / 20) % 3;
        const layerRadius = formationSize * (0.3 + layer * 0.35);
        const layerSpeed = spiralSpeed * (1 + layer * 0.2);

        const angle = t * layerSpeed + (index % 20) * 0.314;
        const radiusModulation = Math.sin(t * 0.5 + index * 0.1) * 20;
        const currentRadius = layerRadius + radiusModulation;

        // Vertical wave motion
        const verticalWave = Math.sin(t * 0.8 + angle) * 40;

        return {
          x: Math.cos(angle) * currentRadius,
          y: verticalWave + layer * 30,
          z: Math.sin(angle) * currentRadius,
        };
      },
    };
  }

  /**
   * Explosion Burst Pattern
   * Dramatic burst movements with particle scattering
   */
  createExplosionBurst(): DanceMove {
    return {
      name: "Explosion Burst",
      duration: 6,
      intensity: 1.0,
      complexity: 0.7,
      execute: (particle, time, index, params) => {
        const t = time * 0.001;
        const burstIntensity = params.burstIntensity || 1.0;
        const burstCycle = 3; // seconds per burst

        const cycleTime = (t % burstCycle) / burstCycle;
        const burstPhase = this.createBurstPhase(cycleTime);

        // Random direction for each particle
        const angle = (index * 137.5) % 360; // Golden angle distribution
        const elevation = ((index * 23.7) % 180) - 90;

        const distance = burstPhase * 150 * burstIntensity;
        const dampening = Math.max(0, 1 - cycleTime * 0.8);

        return {
          x: Math.cos((angle * Math.PI) / 180) * distance * dampening,
          y: Math.sin((elevation * Math.PI) / 180) * distance * dampening,
          z: Math.sin((angle * Math.PI) / 180) * distance * dampening * 0.5,
        };
      },
    };
  }

  /**
   * Flowing Formation Pattern
   * Organic group movements with formation changes
   */
  createFlowingFormation(): DanceMove {
    return {
      name: "Flowing Formation",
      duration: 10,
      intensity: 0.6,
      complexity: 0.85,
      execute: (particle, time, index, params) => {
        const t = time * 0.001;
        const flowSpeed = params.flowSpeed || 1.0;

        // Formation morphing between shapes
        const morphCycle = 8; // seconds per morph cycle
        const morphTime = (t % morphCycle) / morphCycle;

        const formation1 = this.getCircleFormation(index, 80);
        const formation2 = this.getHeartFormation(index, 60);
        const formation3 = this.getStarFormation(index, 70);

        // Smooth transitions between formations
        let currentPos: Vector3D;
        if (morphTime < 0.33) {
          const blend = morphTime / 0.33;
          currentPos = this.blendPositions(formation1, formation2, blend);
        } else if (morphTime < 0.66) {
          const blend = (morphTime - 0.33) / 0.33;
          currentPos = this.blendPositions(formation2, formation3, blend);
        } else {
          const blend = (morphTime - 0.66) / 0.34;
          currentPos = this.blendPositions(formation3, formation1, blend);
        }

        // Add flowing motion
        const flowX = Math.sin(t * 0.4 + index * 0.1) * 15;
        const flowY = Math.cos(t * 0.3 + index * 0.15) * 10;

        return {
          x: currentPos.x + flowX,
          y: currentPos.y + flowY,
          z: currentPos.z + Math.sin(t * 0.5 + index * 0.2) * 20,
        };
      },
    };
  }

  // Helper methods
  private createBeatPulse(beatPhase: number, intensity: number): number {
    // Sharp pulse on beat with decay
    if (beatPhase < 0.1) {
      return (1 - beatPhase / 0.1) * intensity;
    }
    return Math.max(0, (1 - beatPhase) * 0.3 * intensity);
  }

  private createSnapMovement(
    time: number,
    index: number,
    intensity: number
  ): Vector3D {
    const snapFreq = 2; // snaps per second
    const snapPhase = (time * snapFreq + index * 0.1) % 1;

    const snapX = Math.sin(snapPhase * Math.PI * 2) * 30 * intensity;
    const snapY = Math.cos(snapPhase * Math.PI * 2) * 25 * intensity;
    const snapZ = Math.sin(snapPhase * Math.PI * 4) * 15 * intensity;

    return { x: snapX, y: snapY, z: snapZ };
  }

  private createBurstPhase(cycleTime: number): number {
    // Exponential burst followed by settle
    if (cycleTime < 0.2) {
      return Math.pow(cycleTime / 0.2, 0.3);
    } else {
      return Math.max(0, 1 - Math.pow((cycleTime - 0.2) / 0.8, 2));
    }
  }

  private getCircleFormation(index: number, radius: number): Vector3D {
    const angle = (index * 137.5) % 360; // Golden angle
    return {
      x: Math.cos((angle * Math.PI) / 180) * radius,
      y: Math.sin((angle * Math.PI) / 180) * radius,
      z: 0,
    };
  }

  private getHeartFormation(index: number, scale: number): Vector3D {
    const t = (index / 100) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    return {
      x: (x * scale) / 16,
      y: (y * scale) / 16,
      z: Math.sin(t * 2) * scale * 0.2,
    };
  }

  private getStarFormation(index: number, scale: number): Vector3D {
    const points = 5;
    const angle = (index / 20) * Math.PI * 2;
    const starAngle =
      Math.floor(angle / ((Math.PI * 2) / points)) * ((Math.PI * 2) / points);
    const radius = scale * (0.5 + 0.5 * Math.cos(angle * points));

    return {
      x: Math.cos(starAngle) * radius,
      y: Math.sin(starAngle) * radius,
      z: Math.sin(angle * points) * scale * 0.3,
    };
  }

  private blendPositions(
    pos1: Vector3D,
    pos2: Vector3D,
    blend: number
  ): Vector3D {
    const smoothBlend = this.smoothStep(blend);
    return {
      x: pos1.x + (pos2.x - pos1.x) * smoothBlend,
      y: pos1.y + (pos2.y - pos1.y) * smoothBlend,
      z: pos1.z + (pos2.z - pos1.z) * smoothBlend,
    };
  }

  private smoothStep(t: number): number {
    return t * t * (3 - 2 * t);
  }

  // Public API
  updateTime(deltaTime: number): void {
    this.currentTime += deltaTime;
    this.beatTime = ((this.currentTime * this.bpm) / 60000) % 1;
  }

  setBPM(bpm: number): void {
    this.bpm = bpm;
  }

  getCurrentBeat(): number {
    return this.beatTime;
  }
}
