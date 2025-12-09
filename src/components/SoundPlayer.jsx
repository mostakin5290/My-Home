import React, { useState, useRef } from 'react';
import { Headphones } from 'lucide-react';
import { SOUNDS } from '../utils/constants';

const SoundPlayer = ({ accent }) => {
    const [playing, setPlaying] = useState(null);
    const audioRef = useRef(new Audio());

    const toggleSound = (sound) => {
        if (playing === sound.id) {
            audioRef.current.pause();
            setPlaying(null);
        } else {
            audioRef.current.src = sound.url;
            audioRef.current.loop = true;
            audioRef.current.play();
            setPlaying(sound.id);
        }
    };

    return (
        <div className="glass-panel p-4 rounded-3xl w-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-2">
                <Headphones size={14} /> Soundscape
            </h3>
            <div className="grid grid-cols-3 gap-2">
                {SOUNDS.map(s => (
                    <button
                        key={s.id}
                        onClick={() => toggleSound(s)}
                        className={`text-xs py-2 rounded-lg border transition-all ${playing === s.id
                                ? `bg-white text-black border-white`
                                : 'border-white/10 text-white/50 hover:bg-white/5'
                            }`}
                    >
                        {s.name}
                    </button>
                ))}
            </div>
        </div>
    );
};




export default SoundPlayer;
