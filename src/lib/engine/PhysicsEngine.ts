/**
 * Physics Engine
 *
 * Basic physics simulation for particle interactions,
 * forces, gravity, and collision detection.
 */

import { Vector3D } from "@/lib/types/particle";

export interface PhysicsParticle {
  id: number;
  position: Vector3D;
  velocity: Vector3D;
  acceleration: Vector3D;
  mass: number;
  size: number;
  damping: number;
  isFixed: boolean; // For anchor points
}

export interface Force {
  type: ForceType;
  position?: Vector3D;
  strength: number;
  radius: number;
  direction?: Vector3D;
  falloff: FalloffType;
}

export type ForceType =
  | "gravity"
  | "attraction"
  | "repulsion"
  | "wind"
  | "vortex"
  | "turbulence";
export type FalloffType = "linear" | "quadratic" | "exponential" | "constant";

export interface PhysicsConfig {
  gravity: Vector3D;
  airResistance: number;
  groundLevel: number;
  boundaries: {
    min: Vector3D;
    max: Vector3D;
    bounce: number; // 0-1, bounciness
  };
  collisions: {
    enabled: boolean;
    damping: number;
    minDistance: number;
  };
}

export class PhysicsEngine {
  private particles: PhysicsParticle[] = [];
  private forces: Force[] = [];
  private config: PhysicsConfig;
  private spatialGrid: Map<string, PhysicsParticle[]> = new Map();
  private gridSize: number = 50;

  constructor(config?: Partial<PhysicsConfig>) {
    this.config = {
      gravity: { x: 0, y: -9.81, z: 0 },
      airResistance: 0.02,
      groundLevel: -200,
      boundaries: {
        min: { x: -300, y: -300, z: -300 },
        max: { x: 300, y: 300, z: 300 },
        bounce: 0.7,
      },
      collisions: {
        enabled: true,
        damping: 0.8,
        minDistance: 5,
      },
      ...config,
    };
  }

  /**
   * Add particle to physics simulation
   */
  addParticle(particle: PhysicsParticle): void {
    this.particles.push(particle);
  }

  /**
   * Remove particle from simulation
   */
  removeParticle(id: number): void {
    this.particles = this.particles.filter((p) => p.id !== id);
  }

  /**
   * Add force to the system
   */
  addForce(force: Force): void {
    this.forces.push(force);
  }

  /**
   * Clear all forces
   */
  clearForces(): void {
    this.forces = [];
  }

  /**
   * Update physics simulation
   */
  update(deltaTime: number): void {
    const dt = Math.min(deltaTime / 1000, 0.016); // Cap at 60fps equivalent

    // Update spatial grid for collision detection
    this.updateSpatialGrid();

    // Apply forces and update particles
    for (const particle of this.particles) {
      if (particle.isFixed) continue;

      // Reset acceleration
      particle.acceleration = { x: 0, y: 0, z: 0 };

      // Apply gravity
      this.applyGravity(particle);

      // Apply forces
      this.applyForces(particle);

      // Apply air resistance
      this.applyAirResistance(particle);

      // Handle collisions
      if (this.config.collisions.enabled) {
        this.handleCollisions(particle);
      }

      // Integrate motion (Verlet integration)
      this.integrateMotion(particle, dt);

      // Handle boundaries
      this.handleBoundaries(particle);
    }
  }

  /**
   * Apply gravity to particle
   */
  private applyGravity(particle: PhysicsParticle): void {
    const gravityForce = this.multiplyVector(
      this.config.gravity,
      particle.mass
    );
    this.addToVector(particle.acceleration, gravityForce);
  }

  /**
   * Apply all forces to particle
   */
  private applyForces(particle: PhysicsParticle): void {
    for (const force of this.forces) {
      const forceVector = this.calculateForce(force, particle);
      this.addToVector(particle.acceleration, forceVector);
    }
  }

  /**
   * Calculate force vector for a particle
   */
  private calculateForce(force: Force, particle: PhysicsParticle): Vector3D {
    switch (force.type) {
      case "gravity":
        return this.multiplyVector(
          force.direction || { x: 0, y: -1, z: 0 },
          force.strength
        );

      case "attraction":
      case "repulsion":
        return this.calculateAttractiveForce(force, particle);

      case "wind":
        return this.calculateWindForce(force, particle);

      case "vortex":
        return this.calculateVortexForce(force, particle);

      case "turbulence":
        return this.calculateTurbulenceForce(force, particle);

      default:
        return { x: 0, y: 0, z: 0 };
    }
  }

  /**
   * Calculate attractive/repulsive force
   */
  private calculateAttractiveForce(
    force: Force,
    particle: PhysicsParticle
  ): Vector3D {
    if (!force.position) return { x: 0, y: 0, z: 0 };

    const direction = this.subtractVectors(force.position, particle.position);
    const distance = this.vectorMagnitude(direction);

    if (distance > force.radius) return { x: 0, y: 0, z: 0 };

    const normalizedDirection = this.normalizeVector(direction);
    const falloffFactor = this.calculateFalloff(
      distance,
      force.radius,
      force.falloff
    );
    const forceStrength = (force.strength * falloffFactor) / particle.mass;

    // Repulsion reverses the direction
    const multiplier = force.type === "repulsion" ? -1 : 1;

    return this.multiplyVector(normalizedDirection, forceStrength * multiplier);
  }

  /**
   * Calculate wind force
   */
  private calculateWindForce(
    force: Force,
    particle: PhysicsParticle
  ): Vector3D {
    const windDirection = force.direction || { x: 1, y: 0, z: 0 };
    const relativeVelocity = this.subtractVectors(
      windDirection,
      particle.velocity
    );
    const windStrength = force.strength / particle.mass;

    return this.multiplyVector(relativeVelocity, windStrength * 0.1);
  }

  /**
   * Calculate vortex force
   */
  private calculateVortexForce(
    force: Force,
    particle: PhysicsParticle
  ): Vector3D {
    if (!force.position) return { x: 0, y: 0, z: 0 };

    const toCenter = this.subtractVectors(force.position, particle.position);
    const distance = this.vectorMagnitude(toCenter);

    if (distance > force.radius) return { x: 0, y: 0, z: 0 };

    // Tangential force for rotation
    const tangent = { x: -toCenter.z, y: 0, z: toCenter.x };
    const normalizedTangent = this.normalizeVector(tangent);
    const falloffFactor = this.calculateFalloff(
      distance,
      force.radius,
      force.falloff
    );
    const vortexStrength = (force.strength * falloffFactor) / particle.mass;

    // Add inward spiral
    const inward = this.normalizeVector(toCenter);
    const spiralForce = this.addVectors(
      this.multiplyVector(normalizedTangent, vortexStrength),
      this.multiplyVector(inward, vortexStrength * 0.1)
    );

    return spiralForce;
  }

  /**
   * Calculate turbulence force
   */
  private calculateTurbulenceForce(
    force: Force,
    particle: PhysicsParticle
  ): Vector3D {
    const time = Date.now() * 0.001;
    const noiseX = Math.sin(time + particle.position.x * 0.01) * 0.5;
    const noiseY = Math.cos(time + particle.position.y * 0.01) * 0.5;
    const noiseZ = Math.sin(time + particle.position.z * 0.01) * 0.5;

    const turbulenceStrength = force.strength / particle.mass;

    return {
      x: noiseX * turbulenceStrength,
      y: noiseY * turbulenceStrength,
      z: noiseZ * turbulenceStrength,
    };
  }

  /**
   * Apply air resistance
   */
  private applyAirResistance(particle: PhysicsParticle): void {
    const resistance = this.multiplyVector(
      particle.velocity,
      -this.config.airResistance
    );
    this.addToVector(particle.acceleration, resistance);
  }

  /**
   * Handle particle collisions
   */
  private handleCollisions(particle: PhysicsParticle): void {
    const gridKey = this.getGridKey(particle.position);
    const nearbyParticles = this.getNearbyParticles(gridKey);

    for (const other of nearbyParticles) {
      if (other.id === particle.id) continue;

      const distance = this.vectorDistance(particle.position, other.position);
      const minDistance = this.config.collisions.minDistance;

      if (distance < minDistance && distance > 0) {
        this.resolveCollision(particle, other, distance, minDistance);
      }
    }
  }

  /**
   * Resolve collision between two particles
   */
  private resolveCollision(
    p1: PhysicsParticle,
    p2: PhysicsParticle,
    distance: number,
    minDistance: number
  ): void {
    const overlap = minDistance - distance;
    const direction = this.normalizeVector(
      this.subtractVectors(p1.position, p2.position)
    );

    // Separate particles
    const separation = this.multiplyVector(direction, overlap * 0.5);
    if (!p1.isFixed) this.addToVector(p1.position, separation);
    if (!p2.isFixed) this.subtractFromVector(p2.position, separation);

    // Apply collision response
    const relativeVelocity = this.subtractVectors(p1.velocity, p2.velocity);
    const velocityAlongNormal = this.dotProduct(relativeVelocity, direction);

    if (velocityAlongNormal > 0) return; // Particles separating

    const restitution = this.config.collisions.damping;
    const impulse =
      (-(1 + restitution) * velocityAlongNormal) / (1 / p1.mass + 1 / p2.mass);

    const impulseVector = this.multiplyVector(direction, impulse);
    if (!p1.isFixed)
      this.addToVector(
        p1.velocity,
        this.multiplyVector(impulseVector, 1 / p1.mass)
      );
    if (!p2.isFixed)
      this.subtractFromVector(
        p2.velocity,
        this.multiplyVector(impulseVector, 1 / p2.mass)
      );
  }

  /**
   * Integrate motion using Verlet integration
   */
  private integrateMotion(particle: PhysicsParticle, dt: number): void {
    // Update velocity
    const accelerationDelta = this.multiplyVector(particle.acceleration, dt);
    this.addToVector(particle.velocity, accelerationDelta);

    // Apply damping
    this.multiplyVectorInPlace(particle.velocity, particle.damping);

    // Update position
    const velocityDelta = this.multiplyVector(particle.velocity, dt);
    this.addToVector(particle.position, velocityDelta);
  }

  /**
   * Handle boundary collisions
   */
  private handleBoundaries(particle: PhysicsParticle): void {
    const bounds = this.config.boundaries;
    const bounce = bounds.bounce;

    // X boundaries
    if (particle.position.x < bounds.min.x) {
      particle.position.x = bounds.min.x;
      particle.velocity.x *= -bounce;
    } else if (particle.position.x > bounds.max.x) {
      particle.position.x = bounds.max.x;
      particle.velocity.x *= -bounce;
    }

    // Y boundaries
    if (particle.position.y < bounds.min.y) {
      particle.position.y = bounds.min.y;
      particle.velocity.y *= -bounce;
    } else if (particle.position.y > bounds.max.y) {
      particle.position.y = bounds.max.y;
      particle.velocity.y *= -bounce;
    }

    // Z boundaries
    if (particle.position.z < bounds.min.z) {
      particle.position.z = bounds.min.z;
      particle.velocity.z *= -bounce;
    } else if (particle.position.z > bounds.max.z) {
      particle.position.z = bounds.max.z;
      particle.velocity.z *= -bounce;
    }
  }

  // Spatial grid methods for collision optimization
  private updateSpatialGrid(): void {
    this.spatialGrid.clear();

    for (const particle of this.particles) {
      const key = this.getGridKey(particle.position);
      if (!this.spatialGrid.has(key)) {
        this.spatialGrid.set(key, []);
      }
      this.spatialGrid.get(key)!.push(particle);
    }
  }

  private getGridKey(position: Vector3D): string {
    const x = Math.floor(position.x / this.gridSize);
    const y = Math.floor(position.y / this.gridSize);
    const z = Math.floor(position.z / this.gridSize);
    return `${x},${y},${z}`;
  }

  private getNearbyParticles(gridKey: string): PhysicsParticle[] {
    const [x, y, z] = gridKey.split(",").map(Number);
    const nearby: PhysicsParticle[] = [];

    // Check 3x3x3 grid around current cell
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${x + dx},${y + dy},${z + dz}`;
          const particles = this.spatialGrid.get(key) || [];
          nearby.push(...particles);
        }
      }
    }

    return nearby;
  }

  // Vector math utilities
  private addVectors(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  }

  private subtractVectors(a: Vector3D, b: Vector3D): Vector3D {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  }

  private multiplyVector(v: Vector3D, scalar: number): Vector3D {
    return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar };
  }

  private addToVector(target: Vector3D, source: Vector3D): void {
    target.x += source.x;
    target.y += source.y;
    target.z += source.z;
  }

  private subtractFromVector(target: Vector3D, source: Vector3D): void {
    target.x -= source.x;
    target.y -= source.y;
    target.z -= source.z;
  }

  private multiplyVectorInPlace(v: Vector3D, scalar: number): void {
    v.x *= scalar;
    v.y *= scalar;
    v.z *= scalar;
  }

  private vectorMagnitude(v: Vector3D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  private vectorDistance(a: Vector3D, b: Vector3D): number {
    return this.vectorMagnitude(this.subtractVectors(a, b));
  }

  private normalizeVector(v: Vector3D): Vector3D {
    const magnitude = this.vectorMagnitude(v);
    if (magnitude === 0) return { x: 0, y: 0, z: 0 };
    return this.multiplyVector(v, 1 / magnitude);
  }

  private dotProduct(a: Vector3D, b: Vector3D): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  private calculateFalloff(
    distance: number,
    radius: number,
    type: FalloffType
  ): number {
    const normalizedDistance = distance / radius;

    switch (type) {
      case "linear":
        return Math.max(0, 1 - normalizedDistance);
      case "quadratic":
        return Math.max(0, 1 - normalizedDistance * normalizedDistance);
      case "exponential":
        return Math.exp(-normalizedDistance * 3);
      case "constant":
      default:
        return 1;
    }
  }

  // Public API
  getParticles(): PhysicsParticle[] {
    return this.particles;
  }

  setConfig(config: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): PhysicsConfig {
    return { ...this.config };
  }
}
