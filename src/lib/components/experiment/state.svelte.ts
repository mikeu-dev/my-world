import * as THREE from 'three';

export type ExperienceMode = 'GENESIS' | 'ENERGY' | 'CHAOS' | 'HARMONY';

class ExperienceState {
    // Interaction State
    section = $state(0);
    mode = $state<ExperienceMode>('GENESIS');
    scrollProgress = $state(0);
    isAutoScrolling = $state(false);

    // Parameter State (for shaders/animation)
    params = $state({
        chaosLevel: 0,
        flowSpeed: 0.5,
        distortion: 0.1,
        morph: 0,
        roughness: 0.4,
        metalness: 0.1,
        colorA: new THREE.Color('#0f172a'), // Deep Blue/Slate
        colorB: new THREE.Color('#334155'), // Muted Blue/Grey
        colorC: new THREE.Color('#e2e8f0'), // Light Mist
    });
}

// Global Singleton
export const experienceState = new ExperienceState();
