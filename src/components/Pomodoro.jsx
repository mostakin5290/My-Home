import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Flame, CheckCircle2 } from 'lucide-react';
import { ACCENTS } from '../utils/constants';
import { useStickyState } from '../hooks/useStickyState';
import { soundEngine } from '../utils/audioSynthesizer';

const Pomodoro = ({ accent = 'blue' }) => {
    const [settings, setSettings] = useStickyState({
        workTime: 25,
        breakTime: 5
    }, 'pomodoro-settings');

    const [streak, setStreak] = useStickyState(0, 'pomodoro-streak');
    const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' | 'break'
    const [showSettings, setShowSettings] = useState(false);
    const [tempWorkTime, setTempWorkTime] = useState(settings.workTime);
    const [tempBreakTime, setTempBreakTime] = useState(settings.breakTime);

    // Audio chime & notification on finish
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            soundEngine.playChime('success');

            if (mode === 'work') {
                setStreak(s => s + 1);
                setMode('break');
                setTimeLeft(settings.breakTime * 60);
            } else {
                setMode('work');
                setTimeLeft(settings.workTime * 60);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, settings, setStreak]);

    const totalSeconds = (mode === 'work' ? settings.workTime : settings.breakTime) * 60;
    const progress = Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100));

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
            workTime: Number(tempWorkTime) || 25,
            breakTime: Number(tempBreakTime) || 5
        });
        setTimeLeft((mode === 'work' ? Number(tempWorkTime) : Number(tempBreakTime)) * 60);
        setIsActive(false);
        setShowSettings(false);
    };

    return (
        <div className="glass-panel p-5 rounded-3xl w-full flex flex-col items-center relative select-none transition-all duration-300">
            {/* Header / Mode Switcher */}
            <div className="flex items-center justify-between w-full mb-3">
                <div className="flex bg-white/5 rounded-full p-1 flex-1 max-w-[180px]">
                    {['work', 'break'].map(m => (
                        <button
                            key={m}
                            onClick={() => handleModeChange(m)}
                            className={`flex-1 py-1 text-[10px] uppercase font-bold rounded-full transition-all ${mode === m ? 'bg-white text-black shadow-sm' : 'text-white/40 hover:text-white'
                                }`}
                        >
                            {m === 'work' ? 'Focus' : 'Break'}
                        </button>
                    ))}
                </div>

                {/* Completed sessions badge */}
                <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20" title="Completed Focus Sessions">
                    <Flame size={12} className="text-amber-400 fill-amber-400" />
                    <span>{streak}</span>
                </div>
            </div>

            {/* Time Display with Circular / Progress Bar */}
            <div className="relative my-2 flex flex-col items-center">
                <div className="text-5xl font-mono font-black tracking-tighter text-white drop-shadow-md">
                    {formatTime(timeLeft)}
                </div>
                {/* Progress pill */}
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                    <div
                        className={`h-full bg-gradient-to-r ${accentGradient} transition-all duration-1000`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-3">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg ${isActive ? 'bg-rose-500 text-white' : `bg-gradient-to-br ${accentGradient} text-white`
                        }`}
                >
                    {isActive ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                </button>
                <button
                    onClick={handleReset}
                    title="Reset Timer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                    <RotateCcw size={15} />
                </button>
                <button
                    onClick={() => {
                        setTempWorkTime(settings.workTime);
                        setTempBreakTime(settings.breakTime);
                        setShowSettings(!showSettings);
                    }}
                    title="Timer Settings"
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${showSettings ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                    <Settings size={15} />
                </button>
            </div>

            {/* Quick Presets & Settings */}
            {showSettings && (
                <div className="w-full pt-4 mt-3 border-t border-white/10 animate-fade-in text-xs space-y-3">
                    <div className="flex gap-1.5">
                        <button onClick={() => { setTempWorkTime(25); setTempBreakTime(5); }} className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 text-[10px]">25/5 min</button>
                        <button onClick={() => { setTempWorkTime(50); setTempBreakTime(10); }} className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 text-[10px]">50/10 min</button>
                        <button onClick={() => { setTempWorkTime(15); setTempBreakTime(3); }} className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 text-[10px]">15/3 min</button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-white/50 block mb-1 text-[10px]">Focus (min)</label>
                            <input
                                type="number" min="1" max="120"
                                value={tempWorkTime}
                                onChange={(e) => setTempWorkTime(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-center text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-white/50 block mb-1 text-[10px]">Break (min)</label>
                            <input
                                type="number" min="1" max="60"
                                value={tempBreakTime}
                                onChange={(e) => setTempBreakTime(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-center text-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSaveSettings}
                        className={`w-full py-1.5 rounded-lg font-bold text-white bg-gradient-to-r ${accentGradient} shadow-md`}
                    >
                        Save Preset
                    </button>
                </div>
            )}
        </div>
    );
};

export default React.memo(Pomodoro);
