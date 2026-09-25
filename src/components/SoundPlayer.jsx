import React, { useState, useEffect } from 'react';
import { Headphones, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { SOUNDS, ACCENTS } from '../utils/constants';
import { soundEngine } from '../utils/audioSynthesizer';

const SoundPlayer = ({ accent = 'blue' }) => {
    const [playing, setPlaying] = useState(null);
    const [volume, setVolume] = useState(0.4);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        return () => {
            soundEngine.stop();
        };
    }, []);

    const toggleSound = (soundId) => {
        if (playing === soundId) {
            soundEngine.stop();
            setPlaying(null);
        } else {
            soundEngine.play(soundId);
            soundEngine.setVolume(muted ? 0 : volume);
            setPlaying(soundId);
        }
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (muted) setMuted(false);
        soundEngine.setVolume(val);
    };

    const toggleMute = () => {
        if (muted) {
            setMuted(false);
            soundEngine.setVolume(volume);
        } else {
            setMuted(true);
            soundEngine.setVolume(0);
        }
    };

    const accentGradient = ACCENTS[accent] || ACCENTS.blue;

    return (
        <div className="glass-panel p-5 rounded-3xl w-full select-none transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                    <Headphones size={14} className="text-white/60" /> Ambient Soundscape
                </h3>
                {playing && (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>Playing</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                {SOUNDS.map(s => {
                    const Icon = s.icon || Sparkles;
                    const isActive = playing === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => toggleSound(s.id)}
                            className={`text-xs py-2.5 px-3 rounded-xl border transition-all flex items-center gap-2.5 font-medium ${isActive
                                ? `bg-white text-black border-white shadow-lg scale-[1.02]`
                                : 'border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon size={14} className={isActive ? 'text-black' : 'text-white/50'} />
                            <span className="truncate">{s.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2.5 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <button
                    onClick={toggleMute}
                    className="text-white/50 hover:text-white transition-colors"
                >
                    {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-neutral-300"
                />
                <span className="text-[10px] font-mono text-white/40 min-w-7 text-right">
                    {muted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
            </div>
        </div>
    );
};

export default React.memo(SoundPlayer);
