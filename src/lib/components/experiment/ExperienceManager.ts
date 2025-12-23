import gsap from 'gsap';
import { experienceState, type ExperienceMode } from './state.svelte';
import { AudioManager } from './AudioManager';

export class ExperienceManager {
    private static instance: ExperienceManager;

    constructor() {
        if (ExperienceManager.instance) {
            return ExperienceManager.instance;
        }
        ExperienceManager.instance = this;

        // Initialize Tweakpane
        if (typeof window !== 'undefined') {
            import('tweakpane').then(({ Pane }) => {
                const pane = new Pane({ title: 'Creative Controls' });
                const f1 = pane.addFolder({ title: 'Params' });
                f1.addBinding(experienceState.params, 'chaosLevel', { min: 0, max: 2 });
                f1.addBinding(experienceState.params, 'flowSpeed', { min: 0, max: 5 });
                f1.addBinding(experienceState.params, 'distortion', { min: 0, max: 3 });
                f1.addBinding(experienceState.params, 'morph', { min: 0, max: 1 });
                f1.addBinding(experienceState.params, 'roughness', { min: 0, max: 1 });

                const f2 = pane.addFolder({ title: 'Colors' });
                f2.addBinding(experienceState.params, 'colorA', { color: { type: 'float' } });
                f2.addBinding(experienceState.params, 'colorB', { color: { type: 'float' } });
                f2.addBinding(experienceState.params, 'colorC', { color: { type: 'float' } });
            });
        }
    }

    public static getInstance(): ExperienceManager {
        if (!ExperienceManager.instance) {
            ExperienceManager.instance = new ExperienceManager();
        }
        return ExperienceManager.instance;
    }

    public onScroll(progress: number) {
        experienceState.scrollProgress = progress;

        // Determine section based on scroll (0.0 - 1.0)
        // 20 Narrative Chapters (5 per Visual Era)
        const totalSections = 20;
        let section = Math.floor(progress * totalSections);
        if (section >= totalSections) section = totalSections - 1;

        let mode: ExperienceMode = 'GENESIS';

        if (section < 5) {
            mode = 'GENESIS';
        } else if (section < 10) {
            mode = 'ENERGY';
        } else if (section < 15) {
            mode = 'CHAOS';
        } else {
            mode = 'HARMONY';
        }

        const prevSection = experienceState.section;

        // Only update if changed to avoid thrashing
        if (prevSection !== section) {
            experienceState.section = section;
            if (experienceState.mode !== mode) experienceState.mode = mode;

            // Trigger Transition ONCE
            AudioManager.getInstance().updateAmbience();

            switch (section) {
                case 0:
                    AudioManager.getInstance().updateAmbience();
                    this.transitionToGenesis();
                    break;
                case 5:
                    AudioManager.getInstance().updateAmbience();
                    this.transitionToEnergy();
                    break;
                case 10:
                    AudioManager.getInstance().updateAmbience();
                    this.transitionToChaos();
                    break;
                case 15:
                    AudioManager.getInstance().updateAmbience();
                    this.transitionToHarmony();
                    break;
            }
        }
    }

    // TRANSITIONS (Using GSAP for smooth interpolation)

    private transitionToGenesis() {
        // Keheningan: Void, Mist, Subtle Light
        gsap.to(experienceState.params, {
            chaosLevel: 0,
            flowSpeed: 0.2, // Very slow
            distortion: 0.05, // Almost Sphere
            morph: 0,
            roughness: 0.6,
            duration: 2.0
        });
        gsap.to(experienceState.params.colorA, { r: 0.05, g: 0.05, b: 0.1, duration: 2 }); // Deep Void
        gsap.to(experienceState.params.colorB, { r: 0.1, g: 0.1, b: 0.15, duration: 2 });
    }

    private transitionToEnergy() {
        // Aliran: Golden, Flowing, Purposeful
        gsap.to(experienceState.params, {
            chaosLevel: 0.3,
            flowSpeed: 1.5,
            distortion: 0.8, // More movement
            morph: 0.4,
            roughness: 0.2,
            duration: 2.0
        });
        gsap.to(experienceState.params.colorA, { r: 1.0, g: 0.8, b: 0.2, duration: 2 }); // Bright Gold
        gsap.to(experienceState.params.colorB, { r: 0.6, g: 0.3, b: 0.1, duration: 2 });
    }

    private transitionToChaos() {
        // Gejolak: Crimson, Dark, Fractured
        gsap.to(experienceState.params, {
            chaosLevel: 1.0, // High but controlled
            flowSpeed: 3.0, // Fast
            distortion: 1.0, // Reduced from 2.5 to prevent clipping
            morph: 1.0,
            roughness: 0.5, // Reduced from 1.0 so Glow/Fresnel still works!
            duration: 1.5
        });
        gsap.to(experienceState.params.colorA, { r: 0.8, g: 0.0, b: 0.0, duration: 1.5 }); // Bright Red
        gsap.to(experienceState.params.colorB, { r: 0.05, g: 0.0, b: 0.0, duration: 1.5 }); // Near Black
    }

    private transitionToHarmony() {
        // Harmoni: Pearl, Iridescent, Calm
        gsap.to(experienceState.params, {
            chaosLevel: 0,
            flowSpeed: 0.3,
            distortion: 0.15, // Gentle waves
            morph: 0.1,
            roughness: 0.05, // Mirror-like
            duration: 3.0
        });
        gsap.to(experienceState.params.colorA, { r: 0.9, g: 0.95, b: 1.0, duration: 3 }); // Pure Pearl
        gsap.to(experienceState.params.colorB, { r: 0.7, g: 0.7, b: 0.8, duration: 3 }); // Silver
    }
}
