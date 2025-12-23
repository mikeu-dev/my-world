import * as Tone from 'tone';
import { experienceState } from './state.svelte';

export class AudioManager {
    private static instance: AudioManager;
    private drones: Map<string, Tone.Player | Tone.Oscillator | Tone.Synth> = new Map();
    private reverb: Tone.Reverb;
    private delay: Tone.FeedbackDelay;
    private filter: Tone.Filter;
    private isInitialized = false;

    // Generators for generative music
    private polySynth: Tone.PolySynth;
    private seq: Tone.Sequence | null = null;

    private constructor() {
        // Effects Chain
        this.reverb = new Tone.Reverb({ decay: 5, wet: 0.5 }).toDestination();
        this.delay = new Tone.FeedbackDelay("8n", 0.3).connect(this.reverb);
        this.filter = new Tone.Filter(200, "lowpass").connect(this.delay);

        this.polySynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "sine" },
            envelope: { attack: 1, decay: 0.5, sustain: 0.5, release: 2 }
        }).connect(this.filter);
        this.polySynth.volume.value = -12;
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public async initialize() {
        if (this.isInitialized) return;
        await Tone.start();
        this.isInitialized = true;
        console.log("Audio Context Started");
        this.updateAmbience();
    }

    public toggleMute(muted: boolean) {
        Tone.Destination.mute = muted;
    }

    public updateAmbience() {
        if (!this.isInitialized) return;

        const section = experienceState.section;

        // Stop previous sequences if any
        if (this.seq) {
            this.seq.dispose();
            this.seq = null;
        }

        // Base Filter automation based on chaos
        const targetFreq = 200 + (experienceState.params.chaosLevel * 2000);
        this.filter.frequency.rampTo(targetFreq, 2);

        switch (section) {
            case 0: // GENESIS (Deep, Hening)
                this.playGenesis();
                break;
            case 1: // ENERGY (Flowing, Arpeggios)
                this.playEnergy();
                break;
            case 2: // CHAOS (Dissonant, Random)
                this.playChaos();
                break;
            case 3: // HARMONY (Major, Calm)
                this.playHarmony();
                break;
        }
    }

    private playGenesis() {
        // Deep drone (Low C)
        this.polySynth.releaseAll();
        this.polySynth.triggerAttack(["C2", "G2"], Tone.now(), 0.1);

        // Very wet reverb
        this.reverb.wet.rampTo(0.8, 2);
        this.delay.wet.rampTo(0.1, 2);
    }

    private playEnergy() {
        this.polySynth.releaseAll();
        // Ascending arpeggio
        this.seq = new Tone.Sequence((time, note) => {
            this.polySynth.triggerAttackRelease(note, "8n", time);
        }, ["C3", "E3", "G3", "B3", "C4"], "4n").start(0);

        this.reverb.wet.rampTo(0.4, 2);
        Tone.Transport.start();
    }

    private playChaos() {
        this.polySynth.releaseAll();
        // Random dissonant notes
        this.seq = new Tone.Sequence((time, note) => {
            if (Math.random() > 0.3) {
                this.polySynth.triggerAttackRelease(note, "16n", time);
            }
        }, ["C#3", "D3", "F#3", "A#3", "C4"], "16n").start(0);

        // High feedback delay
        this.delay.feedback.value = 0.6;
        this.delay.wet.rampTo(0.5, 1);
        Tone.Transport.start();
    }

    private playHarmony() {
        this.polySynth.releaseAll();
        // Slow major chord swelling
        this.polySynth.triggerAttack(["C3", "E3", "G3", "C4"], Tone.now());

        // Pure reverb
        this.reverb.wet.rampTo(0.6, 2);
        this.delay.wet.rampTo(0.2, 2);
        Tone.Transport.stop(); // Stop sequencer, just drone
    }
}
