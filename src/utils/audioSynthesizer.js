// Web Audio API Procedural Synthesizer for offline ambient noise & alerts

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.currentSound = null;
        this.gainNode = null;
        this.volume = 0.5;
        this.activeNodes = [];
    }

    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.gainNode = this.ctx.createGain();
                this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
                this.gainNode.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.gainNode && this.ctx) {
            this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
        }
    }

    stop() {
        this.activeNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {
                // Ignore cleanup errors
            }
        });
        this.activeNodes = [];
        this.currentSound = null;
    }

    play(soundId) {
        this.initContext();
        if (!this.ctx) return;
        this.stop();
        this.currentSound = soundId;

        switch (soundId) {
            case 'rain':
                this.generateRain();
                break;
            case 'ocean':
                this.generateOcean();
                break;
            case 'whitenoise':
                this.generateWhiteNoise();
                break;
            case 'pinknoise':
                this.generatePinkNoise();
                break;
            case 'binaural':
                this.generateBinauralFocus();
                break;
            case 'fireplace':
                this.generateFireplace();
                break;
            default:
                break;
        }
    }

    // Play a crystal notification chime (e.g. for Pomodoro or Goal finish)
    playChime(type = 'success') {
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = type === 'success' ? [523.25, 659.25, 783.99, 1046.5] : [659.25, 523.25];

        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);

            noteGain.gain.setValueAtTime(0, now + idx * 0.12);
            noteGain.gain.linearRampToValueAtTime(0.25 * this.volume, now + idx * 0.12 + 0.02);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.9);

            osc.connect(noteGain);
            noteGain.connect(this.ctx.destination);

            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 1);
        });
    }

    generateWhiteNoise() {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.gainNode);
        whiteNoise.start();

        this.activeNodes.push(whiteNoise, filter);
    }

    generatePinkNoise() {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }

        const pinkNoise = this.ctx.createBufferSource();
        pinkNoise.buffer = noiseBuffer;
        pinkNoise.loop = true;

        pinkNoise.connect(this.gainNode);
        pinkNoise.start();

        this.activeNodes.push(pinkNoise);
    }

    generateRain() {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const rainSource = this.ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

        const subFilter = this.ctx.createBiquadFilter();
        subFilter.type = 'lowpass';
        subFilter.frequency.setValueAtTime(4500, this.ctx.currentTime);

        rainSource.connect(filter);
        filter.connect(subFilter);
        subFilter.connect(this.gainNode);
        rainSource.start();

        this.activeNodes.push(rainSource, filter, subFilter);
    }

    generateOcean() {
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);

        // LFO for wave swelling
        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec ocean swell

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(this.gainNode);

        lfo.start();
        noise.start();

        this.activeNodes.push(noise, filter, lfo, lfoGain);
    }

    generateFireplace() {
        // Soft low rumble + randomized crackle pulses
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Intermittent bursts
            const burst = Math.random() > 0.992 ? (Math.random() * 2 - 1) * 3 : 0;
            output[i] = (Math.random() * 0.2 - 0.1) + burst;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, this.ctx.currentTime);
        filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.gainNode);
        noise.start();

        this.activeNodes.push(noise, filter);
    }

    generateBinauralFocus() {
        // 432Hz base with 10Hz Alpha differential (432Hz Left, 442Hz Right)
        const merger = this.ctx.createChannelMerger(2);

        const oscL = this.ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(216, this.ctx.currentTime);

        const oscR = this.ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(226, this.ctx.currentTime);

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);

        merger.connect(this.gainNode);

        oscL.start();
        oscR.start();

        this.activeNodes.push(oscL, oscR, merger);
    }
}

export const soundEngine = new SoundEngine();
