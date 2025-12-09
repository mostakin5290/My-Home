import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { ACCENTS } from '../utils/constants';
import { useStickyState } from '../hooks/useStickyState';

const Pomodoro = ({ accent }) => {
    const [settings, setSettings] = useStickyState({
        workTime: 25,
        breakTime: 5
    }, 'pomodoro-settings');

    const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work');
    const [showSettings, setShowSettings] = useState(false);
    const [tempWorkTime, setTempWorkTime] = useState(settings.workTime);
    const [tempBreakTime, setTempBreakTime] = useState(settings.breakTime);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const accentGradient = ACCENTS[accent] || ACCENTS.blue;

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setTimeLeft(newMode === 'work' ? settings.workTime * 60 : settings.breakTime * 60);
        setIsActive(false);
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(mode === 'work' ? settings.workTime * 60 : settings.breakTime * 60);
    };

    const handleSaveSettings = () => {
        setSettings({
            workTime: tempWorkTime,
            breakTime: tempBreakTime
        });
        setTimeLeft(mode === 'work' ? tempWorkTime * 60 : tempBreakTime * 60);
        setIsActive(false);
        setShowSettings(false);
    };

    return (
        <div className="glass-panel p-5 rounded-3xl w-full flex flex-col items-center relative">
            <div className="flex bg-white/5 rounded-full p-1 mb-4 w-full">
                {['work', 'break'].map(m => (
                    <button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        className={`flex-1 py-1 text-[10px] uppercase font-bold rounded-full transition-all ${mode === m ? 'bg-white text-black' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
            <div className="text-5xl font-mono font-bold tracking-tighter mb-4">{formatTime(timeLeft)}</div>
            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg bg-gradient-to-br ${isActive ? 'from-red-500 to-orange-500' : accentGradient
                        }`}
                >
                    {isActive ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
                </button>
                <button
                    onClick={handleReset}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                    <RotateCcw size={18} />
                </button>
                <button
                    onClick={() => {
                        setTempWorkTime(settings.workTime);
                        setTempBreakTime(settings.breakTime);
                        setShowSettings(!showSettings);
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${showSettings ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* Settings Section */}
            {showSettings && (
                <div className="w-full pt-4 border-t border-white/10 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold text-white/80">{mode === 'work' ? 'Work' : 'Break'} Time</h3>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="text-white/40 hover:text-white text-xs"
                        >
                            Close
                        </button>
                    </div>

                    <div className="mb-3">
                        <input
                            type="number"
                            min="1"
                            max={mode === 'work' ? 60 : 30}
                            value={mode === 'work' ? tempWorkTime : tempBreakTime}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                mode === 'work' ? setTempWorkTime(val) : setTempBreakTime(val);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-center focus:outline-none focus:border-white/30"
                            placeholder="Minutes"
                        />
                    </div>

                    <button
                        onClick={handleSaveSettings}
                        className={`w-full py-2 rounded-lg font-medium text-sm bg-gradient-to-br ${accentGradient} text-white`}
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pomodoro;
