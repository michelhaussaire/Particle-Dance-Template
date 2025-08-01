/**
 * Template Engine - Core Template Management System
 * 
 * Handles template loading, validation, parameter processing,
 * and coordination with other engine systems.
 */

import { ParticleTemplate, TemplateConfig, ParameterDefinition } from '@/lib/types/template';
import { TEMPLATES, PARTICLES } from '@/lib/utils/constants';

export class TemplateEngine {
  private templates: Map<string, ParticleTemplate> = new Map();
  private currentTemplate: ParticleTemplate | null = null;
  
  constructor() {
    this.loadDefaultTemplates();
  }
  
  /**
   * Load default templates into the engine
   */
  private async loadDefaultTemplates(): Promise<void> {
    try {
      // Load the default dance preset
      const response = await fetch('/presets/dance-preset-1.json');
      if (response.ok) {
        const template = await response.json() as ParticleTemplate;
        this.registerTemplate(template);
      }
    } catch (error) {
      console.warn('Failed to load default templates:', error);
    }
    
    // Always ensure we have a basic template
    if (!this.templates.has(TEMPLATES.DEFAULT_TEMPLATE_ID)) {
      this.registerTemplate(this.createBasicTemplate());
    }
  }
  
  /**
   * Create a basic template as fallback
   */
  private createBasicTemplate(): ParticleTemplate {
    return {
      id: TEMPLATES.DEFAULT_TEMPLATE_ID,
      name: 'Basic Wave Dance',
      description: 'A simple wave-based particle dance pattern',
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
            ambient: { color: '#404040', intensity: 0.4 },
            directional: [{ 
              color: '#ffffff', 
              intensity: 0.8, 
              position: { x: 10, y: 10, z: 10 } 
            }],
            point: [],
          },
        },
        performance: {
          maxParticles: PARTICLES.MAX_PARTICLES,
          cullingDistance: 100,
          updateFrequency: 60,
          renderQuality: 'high',
        },
      },
      
      timeline: {
        duration: 10,
        keyframes: [],
        easing: 'easeInOut',
        loop: true,
        autoplay: true,
      },
      
      parameters: this.createDefaultParameters(),
      
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
    };
  }
  
  /**
   * Create default parameter definitions
   */
  private createDefaultParameters(): ParameterDefinition[] {
    return [
      {
        id: 'particle-count',
        name: 'Particle Count',
        description: 'Number of particles in the system',
        type: 'range',
        category: 'particles',
        defaultValue: PARTICLES.DEFAULT_PARTICLES,
        minValue: PARTICLES.MIN_PARTICLES,
        maxValue: PARTICLES.MAX_PARTICLES,
        step: 10,
        ui: {
          component: 'slider',
          label: 'Particles',
          unit: 'particles',
        },
        animatable: false,
        realtime: true,
      },
      {
        id: 'animation-speed',
        name: 'Animation Speed',
        description: 'Speed of the animation playback',
        type: 'range',
        category: 'animation',
        defaultValue: 1.0,
        minValue: 0.1,
        maxValue: 5.0,
        step: 0.1,
        ui: {
          component: 'slider',
          label: 'Speed',
          unit: 'x',
          precision: 1,
        },
        animatable: true,
        realtime: true,
      },
      {
        id: 'pattern-type',
        name: 'Dance Pattern',
        description: 'Type of dance movement pattern',
        type: 'select',
        category: 'animation',
        defaultValue: 'wave',
        options: ['wave', 'spiral', 'bounce', 'flow', 'orbit'],
        ui: {
          component: 'select',
          label: 'Pattern',
        },
        animatable: false,
        realtime: true,
      },
      {
        id: 'particle-size',
        name: 'Particle Size',
        description: 'Base size of individual particles',
        type: 'range',
        category: 'particles',
        defaultValue: PARTICLES.DEFAULT_SIZE,
        minValue: 0.5,
        maxValue: 10.0,
        step: 0.1,
        ui: {
          component: 'slider',
          label: 'Size',
          unit: 'px',
          precision: 1,
        },
        animatable: true,
        realtime: true,
      },
    ];
  }
  
  /**
   * Register a new template
   */
  registerTemplate(template: ParticleTemplate): void {
    // Validate template
    if (!this.validateTemplate(template)) {
      throw new Error(`Invalid template: ${template.id}`);
    }
    
    this.templates.set(template.id, template);
  }
  
  /**
   * Load a template by ID
   */
  loadTemplate(id: string): ParticleTemplate | null {
    const template = this.templates.get(id);
    if (template) {
      this.currentTemplate = { ...template }; // Clone to avoid mutations
      return this.currentTemplate;
    }
    return null;
  }
  
  /**
   * Get current template
   */
  getCurrentTemplate(): ParticleTemplate | null {
    return this.currentTemplate;
  }
  
  /**
   * Update template configuration
   */
  updateTemplate(updates: Partial<TemplateConfig>): void {
    if (!this.currentTemplate) return;
    
    this.currentTemplate.config = {
      ...this.currentTemplate.config,
      ...updates,
    };
    this.currentTemplate.updatedAt = new Date();
  }
  
  /**
   * Get parameter value by ID
   */
  getParameterValue(parameterId: string): any {
    if (!this.currentTemplate) return null;
    
    const parameter = this.currentTemplate.parameters.find(p => p.id === parameterId);
    return parameter?.defaultValue || null;
  }
  
  /**
   * Set parameter value
   */
  setParameterValue(parameterId: string, value: any): void {
    if (!this.currentTemplate) return;
    
    const parameter = this.currentTemplate.parameters.find(p => p.id === parameterId);
    if (!parameter) return;
    
    // Validate value
    if (!this.validateParameterValue(parameter, value)) {
      console.warn(`Invalid parameter value for ${parameterId}:`, value);
      return;
    }
    
    // Update parameter default value
    parameter.defaultValue = value;
    
    // Apply to template configuration
    this.applyParameterToConfig(parameter, value);
  }
  
  /**
   * Apply parameter value to template configuration
   */
  private applyParameterToConfig(parameter: ParameterDefinition, value: any): void {
    if (!this.currentTemplate) return;
    
    const config = this.currentTemplate.config;
    
    switch (parameter.id) {
      case 'particle-count':
        config.particles.count = value;
        break;
      case 'particle-size':
        config.particles.size = value;
        break;
      // Add more parameter mappings as needed
    }
    
    this.currentTemplate.updatedAt = new Date();
  }
  
  /**
   * Validate template structure
   */
  private validateTemplate(template: ParticleTemplate): boolean {
    return !!(
      template.id &&
      template.name &&
      template.config &&
      template.timeline &&
      template.parameters &&
      template.metadata
    );
  }
  
  /**
   * Validate parameter value
   */
  private validateParameterValue(parameter: ParameterDefinition, value: any): boolean {
    switch (parameter.type) {
      case 'range':
      case 'number':
        return typeof value === 'number' &&
               (parameter.minValue === undefined || value >= parameter.minValue) &&
               (parameter.maxValue === undefined || value <= parameter.maxValue);
      
      case 'select':
        return parameter.options?.includes(value) || false;
      
      case 'boolean':
        return typeof value === 'boolean';
      
      case 'color':
        return typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value);
      
      default:
        return true;
    }
  }
  
  /**
   * Get all available templates
   */
  getAvailableTemplates(): ParticleTemplate[] {
    return Array.from(this.templates.values());
  }
  
  /**
   * Export current template as JSON
   */
  exportTemplate(): string | null {
    if (!this.currentTemplate) return null;
    
    return JSON.stringify(this.currentTemplate, null, 2);
  }
  
  /**
   * Import template from JSON
   */
  importTemplate(json: string): ParticleTemplate | null {
    try {
      const template = JSON.parse(json) as ParticleTemplate;
      
      if (this.validateTemplate(template)) {
        this.registerTemplate(template);
        return template;
      }
    } catch (error) {
      console.error('Failed to import template:', error);
    }
    
    return null;
  }
}