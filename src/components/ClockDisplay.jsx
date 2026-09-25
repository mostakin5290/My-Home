import React, { useState, useEffect, useMemo } from 'react';
import { ACCENTS, ACCENT_COLORS } from '../utils/constants';

// --- Helper Functions ---

const getTimeData = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const period = hours >= 12 ? 'PM' : 'AM';

    const raw12Hours = hours % 12 || 12;

    const pad = (num) => num.toString().padStart(2, '0');

    // Smooth sweep calculations for analog clocks
    const degS = (seconds * 6) + (milliseconds * 0.006);
    const degM = (minutes * 6) + (seconds * 0.1);
    const degH = (raw12Hours * 30) + (minutes * 0.5);

    // Binary Helper for the Binary Clock
    const toBinary = (num) => {
        return num.toString(2).padStart(4, '0').split('');
    };

    return {
        h: pad(raw12Hours),
        m: pad(minutes),
        s: pad(seconds),
        p: period,
        rawH: raw12Hours,
        raw24H: hours,
        rawM: minutes,
        rawS: seconds,
        degH,
        degM,
        degS,
        binH: [toBinary(Math.floor(raw12Hours / 10)), toBinary(raw12Hours % 10)],
        binM: [toBinary(Math.floor(minutes / 10)), toBinary(minutes % 10)],
        binS: [toBinary(Math.floor(seconds / 10)), toBinary(seconds % 10)],
        dateObj: date
    };
};

const numberToWords = (num) => {
    const units = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY'];
    if (num < 20) return units[num];
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
};

const ClockDisplay = ({ time: propTime, theme = 'modern', accent = 'blue' }) => {
    // Internal ticking if parent doesn't provide high frequency ticks
    const [internalTime, setInternalTime] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setInternalTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const time = propTime || internalTime;
    const timeData = useMemo(() => getTimeData(time), [time]);
    const { h, m, s, p, rawH, raw24H, rawM, rawS, binH, binM, binS, dateObj, degH, degM, degS } = timeData;

    const dateString = useMemo(() => {
        return dateObj.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase();
    }, [dateObj]);

    const accentGradient = ACCENTS[accent] || ACCENTS.blue;
    const accentHex = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;

    // --- 1. Swiss Analog (Luxury Chronograph) ---
    if (theme === 'analog') {
        return (
            <div className="relative w-80 h-80 rounded-full flex items-center justify-center shadow-[0_25px_60px_rgba(0,0,0,0.85)] select-none">
                {/* 1. Metal Case / Bezel */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-400 via-neutral-200 to-neutral-500 border border-neutral-600 shadow-2xl"></div>
                <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-neutral-900 via-black to-neutral-950 border-[3px] border-neutral-400/40"></div>

                {/* 2. Dial & Sunburst */}
                <div className="absolute inset-4 rounded-full bg-[#0a0a0a] overflow-hidden">
                    <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,#1f1f1f_0deg,#0a0a0a_90deg,#1f1f1f_180deg,#0a0a0a_270deg,#1f1f1f_360deg)] opacity-60"></div>

                    {/* Minute Ticks */}
                    {[...Array(60)].map((_, i) => (
                        <div key={i}
                            className={`absolute top-0 left-1/2 -translate-x-1/2 origin-bottom w-[1px] h-[50%] ${i % 5 === 0 ? 'opacity-70' : 'opacity-25 bg-white'}`}
                            style={{ transform: `rotate(${i * 6}deg)` }}
                        >
                            <div className={`w-full ${i % 5 === 0 ? 'h-3 bg-white' : 'h-1.5 bg-white/60'}`}></div>
                        </div>
                    ))}
                </div>

                {/* 3. Hour Markers (Lume Glow) */}
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute inset-4 pointer-events-none">
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-5 bg-white rounded-sm shadow-[0_0_6px_rgba(255,255,255,0.6)] z-10"
                            style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: '50% 140px' }}>
                            <div className="absolute inset-[1.5px] bg-[#bbf7d0] opacity-90 rounded-[1px]"></div>
                        </div>
                    </div>
                ))}

                {/* Branding */}
                <div className="absolute top-[24%] z-10 text-center pointer-events-none">
                    <div className="text-[10px] font-black tracking-[0.25em] text-neutral-300">CHRONOGRAPH</div>
                    <div className="text-[8px] font-serif text-neutral-400 mt-0.5 italic">Automatic · 100m</div>
                </div>

                {/* Date Window */}
                <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-8 h-6 bg-white rounded-[3px] flex items-center justify-center border border-neutral-400 shadow-inner z-10">
                    <span className="text-black font-bold text-xs font-mono">{time.getDate()}</span>
                </div>

                {/* 4. Hands */}
                {/* Hour Hand */}
                <div className="absolute w-3.5 h-20 bg-gradient-to-t from-neutral-300 to-white rounded-t-md origin-bottom shadow-[-2px_4px_8px_rgba(0,0,0,0.8)] z-20"
                    style={{ transform: `rotate(${degH}deg)`, bottom: '50%', left: 'calc(50% - 7px)' }}>
                    <div className="absolute top-2 left-1 right-1 h-12 bg-[#bbf7d0] opacity-90 rounded-sm"></div>
                </div>

                {/* Minute Hand */}
                <div className="absolute w-2.5 h-28 bg-gradient-to-t from-neutral-300 to-white rounded-t-md origin-bottom shadow-[-2px_4px_8px_rgba(0,0,0,0.8)] z-30"
                    style={{ transform: `rotate(${degM}deg)`, bottom: '50%', left: 'calc(50% - 5px)' }}>
                    <div className="absolute top-2 left-[2px] right-[2px] h-20 bg-[#bbf7d0] opacity-90 rounded-sm"></div>
                </div>

                {/* Second Hand */}
                <div className={`absolute w-[1.5px] h-32 bg-gradient-to-t ${accentGradient} origin-bottom z-40`}
                    style={{ transform: `rotate(${degS}deg)`, bottom: '50%', left: 'calc(50% - 0.75px)' }}>
                    <div className="absolute -bottom-4 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border border-neutral-700"></div>
                </div>

                {/* Center Cap */}
                <div className="absolute w-4 h-4 bg-neutral-200 rounded-full z-50 border border-neutral-500 shadow-md"></div>
                <div className="absolute w-1.5 h-1.5 bg-black rounded-full z-50"></div>
            </div>
        );
    }

    // --- 2. Nixie Tube (Vintage Glowing Vacuum Filament) ---
    if (theme === 'nixie') {
        const renderTube = (digit, index) => (
            <div key={index} className="relative w-16 h-28 md:w-20 md:h-36 bg-gradient-to-b from-neutral-900/90 via-black/80 to-neutral-950 rounded-2xl border border-amber-500/30 p-2 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.25),inset_0_0_15px_rgba(245,158,11,0.15)] overflow-hidden backdrop-blur-md">
                {/* Top metal terminal */}
                <div className="absolute top-1 w-6 h-1 bg-amber-200/40 rounded-full"></div>
                {/* Internal wire mesh background */}
                <div className="absolute inset-2 rounded-xl opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:4px_4px] pointer-events-none"></div>
                {/* Glow reflection */}
                <div className="absolute -inset-2 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent pointer-events-none"></div>
                
                {/* Active Glowing Digit */}
                <span className="relative z-10 text-5xl md:text-6xl font-mono font-bold text-amber-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.9)] animate-pulse"
                    style={{
                        textShadow: '0 0 10px #f97316, 0 0 20px #ea580c, 0 0 35px #c2410c'
                    }}>
                    {digit}
                </span>

                {/* Base filament cathode */}
                <div className="absolute bottom-2 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_#f59e0b]"></div>
                    <div className="w-4 h-0.5 bg-neutral-700"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_#f59e0b]"></div>
                </div>
            </div>
        );

        return (
            <div className="flex flex-col items-center gap-4 select-none">
                <div className="flex items-center gap-2 md:gap-3 p-4 bg-neutral-950/90 rounded-3xl border border-amber-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
                    {renderTube(h[0], 'h0')}
                    {renderTube(h[1], 'h1')}
                    
                    {/* Colon tubes */}
                    <div className="flex flex-col gap-4 mx-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-ping"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]"></div>
                    </div>

                    {renderTube(m[0], 'm0')}
                    {renderTube(m[1], 'm1')}

                    <div className="flex flex-col gap-4 mx-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-ping"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]"></div>
                    </div>

                    {renderTube(s[0], 's0')}
                    {renderTube(s[1], 's1')}
                </div>
                <div className="text-xs font-mono tracking-[0.4em] text-amber-500/70 uppercase">
                    IN-18 NIXIE CHRONOMETER · {dateString}
                </div>
            </div>
        );
    }

    // --- 3. Automotive / Speedometer (Sports Gauge) ---
    if (theme === 'automotive') {
        // Map 0-60 seconds to speedometer angle (-120deg to 120deg = 240deg sweep)
        const speedAngle = -120 + (rawS / 60) * 240;
        const rpmAngle = -120 + (rawM / 60) * 240;

        return (
            <div className="relative w-80 h-80 rounded-full bg-gradient-to-b from-neutral-900 to-black border-4 border-neutral-700 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,0,0,0.8)] flex items-center justify-center select-none overflow-hidden">
                {/* Carbon fiber texture overlay */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]"></div>

                {/* Dial Ticks (Gauge Marks) */}
                {[...Array(25)].map((_, i) => {
                    const angle = -120 + (i / 24) * 240;
                    const isRedline = i >= 20;
                    return (
                        <div key={i} className="absolute inset-5 pointer-events-none">
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[2px] h-3.5 origin-bottom"
                                style={{
                                    transform: `rotate(${angle}deg)`,
                                    transformOrigin: '50% 135px',
                                    backgroundColor: isRedline ? '#ef4444' : '#ffffff88'
                                }}
                            ></div>
                        </div>
                    );
                })}

                {/* Gauge Numbers */}
                <div className="absolute top-12 left-10 text-[10px] font-mono font-bold text-neutral-400">0</div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-neutral-300">30</div>
                <div className="absolute top-12 right-10 text-[10px] font-mono font-bold text-red-500">60</div>

                {/* Tachometer / RPM Needle (Minutes) */}
                <div className="absolute w-[2px] h-24 bg-neutral-400 origin-bottom transition-transform duration-300 z-10"
                    style={{ transform: `rotate(${rpmAngle}deg)`, bottom: '50%', left: 'calc(50% - 1px)' }}>
                </div>

                {/* Main Speedometer Needle (Seconds) */}
                <div className="absolute w-1 h-30 bg-gradient-to-t from-red-500 to-rose-400 origin-bottom shadow-[0_0_10px_rgba(244,63,94,0.8)] transition-transform duration-100 z-20"
                    style={{ transform: `rotate(${speedAngle}deg)`, bottom: '50%', left: 'calc(50% - 2px)' }}>
                </div>

                {/* Center Hub */}
                <div className="absolute w-10 h-10 rounded-full bg-gradient-to-b from-neutral-700 to-neutral-900 border-2 border-neutral-500 shadow-xl z-30 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                </div>

                {/* Digital Speed / Gear HUD */}
                <div className="absolute bottom-10 flex flex-col items-center z-30">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black font-mono tracking-tight text-white">{h}:{m}</span>
                        <span className="text-xs font-bold text-neutral-400">{p}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 bg-red-600/30 border border-red-500/50 rounded text-[9px] font-mono font-bold text-red-400">SPORT+</span>
                        <span className="text-[10px] font-mono text-neutral-400 tracking-wider">{rawS} SEC</span>
                    </div>
                </div>
            </div>
        );
    }

    // --- 4. Galaxy Orbit (Planetary Cosmic Clock) ---
    if (theme === 'galaxy') {
        const secAngle = (rawS / 60) * 360;
        const minAngle = (rawM / 60) * 360;
        const hourAngle = ((rawH % 12) / 12) * 360;

        return (
            <div className="relative w-80 h-80 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(147,51,234,0.25)] select-none">
                {/* Star dust */}
                <div className="absolute inset-0 rounded-full opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]"></div>

                {/* Outer Orbit Ring: Seconds */}
                <div className="absolute w-72 h-72 rounded-full border border-dashed border-indigo-500/30 animate-spin-slow">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-indigo-400 shadow-[0_0_12px_#818cf8]"
                        style={{ transform: `rotate(${secAngle}deg)`, transformOrigin: '50% 144px' }}></div>
                </div>

                {/* Middle Orbit Ring: Minutes */}
                <div className="absolute w-52 h-52 rounded-full border border-purple-500/40">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_14px_#c084fc]"
                        style={{ transform: `rotate(${minAngle}deg)`, transformOrigin: '50% 104px' }}></div>
                </div>

                {/* Inner Orbit Ring: Hours */}
                <div className="absolute w-36 h-36 rounded-full border border-pink-500/40">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-pink-400 shadow-[0_0_16px_#f472b6]"
                        style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '50% 72px' }}></div>
                </div>

                {/* Central Sun / Star Node with Digital Core */}
                <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-[0_0_35px_rgba(251,191,36,0.7)] flex flex-col items-center justify-center">
                    <div className="w-full h-full rounded-full bg-black/80 flex flex-col items-center justify-center backdrop-blur-md">
                        <span className="text-xl font-bold font-mono text-white tracking-tighter">{h}:{m}</span>
                        <span className="text-[9px] font-mono text-amber-300/80 uppercase">{p}</span>
                    </div>
                </div>
            </div>
        );
    }

    // --- 5. Word Matrix (Cyber Glyph Stream / Text Matrix) ---
    if (theme === 'matrix') {
        const matrixWords = [
            ['IT', 'IS', 'HALF', 'TEN', 'QUARTER'],
            ['TWENTY', 'FIVE', 'MINUTES', 'PAST'],
            ['TO', 'ONE', 'TWO', 'THREE', 'FOUR'],
            ['FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'],
            ['TEN', 'ELEVEN', 'TWELVE', "O'CLOCK"]
        ];

        return (
            <div className="p-6 bg-black/90 border border-emerald-500/30 rounded-2xl backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.2)] font-mono max-w-sm select-none">
                <div className="flex justify-between items-center pb-3 mb-3 border-b border-emerald-500/20 text-xs text-emerald-400/80">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> MATRIX.SYS</span>
                    <span className="tracking-widest">{h}:{m}:{s} {p}</span>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-sm font-bold tracking-wider">
                    {matrixWords.flat().map((word, idx) => {
                        const isHighlighted = (word === 'IT' || word === 'IS' || word === numberToWords(rawH) || word === numberToWords(rawM) || (rawM === 0 && word === "O'CLOCK"));
                        return (
                            <span key={idx} className={`py-1 rounded transition-colors duration-500 ${isHighlighted ? 'text-emerald-300 drop-shadow-[0_0_8px_#34d399] bg-emerald-950/60 font-black' : 'text-neutral-700'}`}>
                                {word}
                            </span>
                        );
                    })}
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 text-center text-[10px] text-emerald-500/60 tracking-widest uppercase">
                    {dateString}
                </div>
            </div>
        );
    }

    // --- 6. Retro Flip Clock ---
    if (theme === 'retro') {
        return (
            <div className="flex flex-col items-center gap-4 select-none">
                <div className="flex items-center gap-2 md:gap-4 p-6 bg-[#181818] rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.7)] border-b-4 border-black/50">
                    <FlipGroup digits={h} />
                    <div className="flex flex-col gap-3 mx-1">
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                    </div>
                    <FlipGroup digits={m} />

                    <div className="ml-3 pl-3 border-l border-neutral-700/60 flex flex-col justify-between h-24">
                        <span className="text-xs font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">{p}</span>
                        <span className="text-xl font-mono font-bold text-neutral-400">{s}</span>
                    </div>
                </div>
                <div className="text-xs font-mono tracking-[0.3em] text-neutral-400 uppercase">
                    FLIP-MATIC · {dateString}
                </div>
            </div>
        );
    }

    // --- 7. Digital LCD (Casio Style) ---
    if (theme === 'digital') {
        return (
            <div className="relative p-6 bg-neutral-300 rounded-2xl shadow-2xl border-[6px] border-neutral-400 w-84 select-none">
                <div className="bg-[#9ea792] p-4 rounded-lg shadow-[inset_0_4px_10px_rgba(0,0,0,0.25)] border-2 border-[#8b937f] relative overflow-hidden">
                    <div className="flex justify-between items-end mb-1 opacity-80">
                        <span className="text-[10px] font-mono font-bold text-[#2d3326] tracking-widest">CHRONO DUAL TIME</span>
                        <span className="text-[10px] font-mono font-bold text-[#2d3326] border border-[#2d3326] px-1">{p}</span>
                    </div>

                    <div className="flex items-end justify-center gap-2 relative z-10 py-1">
                        <h1 className="text-6xl font-mono font-black text-[#1a1f16] tracking-tighter leading-none" style={{ fontFamily: 'monospace' }}>
                            {h}:{m}
                        </h1>
                        <span className="text-2xl font-mono font-bold text-[#1a1f16] mb-1">{s}</span>
                    </div>

                    <div className="mt-2 flex justify-between text-xs font-mono text-[#2d3326] opacity-80">
                        <span>{dateString}</span>
                        <span>WR 50M</span>
                    </div>
                </div>
                <div className="absolute -left-1 top-10 w-1.5 h-6 bg-neutral-600 rounded-l"></div>
                <div className="absolute -right-1 top-10 w-1.5 h-6 bg-neutral-600 rounded-r"></div>
            </div>
        );
    }

    // --- 8. Smart Radial ---
    if (theme === 'radial') {
        const r = 50;
        const circ = 2 * Math.PI * r;
        const hOffset = circ - ((rawH % 12) / 12) * circ;
        const mOffset = circ - (rawM / 60) * circ;
        const sOffset = circ - (rawS / 60) * circ;

        return (
            <div className="relative w-76 h-76 flex items-center justify-center bg-black/80 rounded-full shadow-2xl border border-neutral-800 select-none">
                <svg className="absolute w-full h-full -rotate-90 p-4">
                    {/* Seconds Ring */}
                    <circle cx="50%" cy="50%" r="46%" stroke="#262626" strokeWidth="6" fill="transparent" />
                    <circle cx="50%" cy="50%" r="46%" stroke={accentHex} strokeWidth="6" fill="transparent"
                        className="transition-all duration-1000 ease-linear"
                        strokeDasharray={circ * 2.8} strokeDashoffset={sOffset * 2.8} strokeLinecap="round" />

                    {/* Minutes Ring */}
                    <circle cx="50%" cy="50%" r="36%" stroke="#1c1c1c" strokeWidth="8" fill="transparent" />
                    <circle cx="50%" cy="50%" r="36%" stroke="#e5e5e5" strokeWidth="8" fill="transparent"
                        className="opacity-90 transition-all duration-500"
                        strokeDasharray={circ * 2.2} strokeDashoffset={mOffset * 2.2} strokeLinecap="round" />

                    {/* Hours Ring */}
                    <circle cx="50%" cy="50%" r="26%" stroke="#141414" strokeWidth="10" fill="transparent" />
                    <circle cx="50%" cy="50%" r="26%" stroke="url(#accentGrad)" strokeWidth="10" fill="transparent"
                        className="transition-all duration-500"
                        strokeDasharray={circ * 1.6} strokeDashoffset={hOffset * 1.6} strokeLinecap="round" />

                    <defs>
                        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="z-10 text-center">
                    <div className="text-4xl font-black text-white tracking-tighter">{h}:{m}</div>
                    <div className="text-xs font-semibold text-neutral-400 tracking-wider">{dateString}</div>
                </div>
            </div>
        );
    }

    // --- 9. Glassmorphism ---
    if (theme === 'glass') {
        return (
            <div className="relative group select-none">
                <div className={`absolute -inset-4 bg-gradient-to-r ${accentGradient} rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-700`}></div>
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl overflow-hidden">
                    <h1 className="text-8xl md:text-9xl font-extralight text-white tracking-tight relative z-10 font-sans">
                        {h}<span className="mx-2 font-normal animate-pulse text-white/70">:</span>{m}
                    </h1>
                    <div className="flex justify-between items-end mt-4 relative z-10">
                        <span className={`text-2xl font-semibold bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>{p}</span>
                        <span className="text-xs font-bold tracking-[0.3em] text-white/70 uppercase">{dateString}</span>
                    </div>
                </div>
            </div>
        );
    }

    // --- 10. Tactical HUD ---
    if (theme === 'tactical') {
        return (
            <div className="relative w-76 h-76 rounded-full border border-dashed border-red-500/40 bg-black/70 backdrop-blur-md flex items-center justify-center select-none shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <div className="absolute inset-4 border border-red-500/20 rounded-full border-l-transparent border-r-transparent animate-spin-slow"></div>
                <div className="z-10 text-center">
                    <div className="text-5xl font-black font-mono text-white tracking-tighter tabular-nums">{h}:{m}:{s}</div>
                    <div className="text-[10px] font-mono text-red-400 mt-2 tracking-[0.3em] bg-red-500/10 px-2.5 py-1 rounded inline-block border border-red-500/30">
                        SYS.ACTIVE · {p}
                    </div>
                </div>
                <div className="absolute w-full h-full border-t-2 border-red-500 rounded-full opacity-80" style={{ transform: `rotate(${rawS * 6}deg)` }}></div>
            </div>
        );
    }

    // --- 11. Cyber Neon ---
    if (theme === 'neon') {
        return (
            <div className="text-center relative select-none">
                <div className={`absolute inset-0 bg-gradient-to-r ${accentGradient} blur-[90px] opacity-40`}></div>
                <div className="relative border-2 border-white/20 px-12 py-8 rounded-3xl bg-black/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)]">
                    <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
                        {h}:{m}
                    </h1>
                    <div className={`h-1.5 w-full mt-4 bg-gradient-to-r ${accentGradient} rounded-full shadow-[0_0_20px_currentColor]`}></div>
                    <div className="mt-3 text-xs font-mono tracking-[0.3em] text-white/70 uppercase">{dateString}</div>
                </div>
            </div>
        );
    }

    // --- 12. Typographic ---
    if (theme === 'typo') {
        const hWord = numberToWords(rawH || 12);
        const mWord = numberToWords(rawM);
        const isExact = rawM === 0;
        return (
            <div className="text-left select-none max-w-2xl mx-auto px-8 py-8 border-l-4 border-white/60 bg-black/30 backdrop-blur-md rounded-r-2xl">
                <div className="text-xs text-white/50 font-bold mb-2 tracking-[0.3em] uppercase">CURRENT TIME</div>
                <h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-tight text-white break-words">
                    {hWord}<br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-br ${accentGradient}`}>
                        {isExact ? "O'CLOCK" : mWord}
                    </span>
                </h1>
                <div className="text-xs font-mono text-white/40 mt-3 tracking-widest">{dateString} · {p}</div>
            </div>
        );
    }

    // --- 13. Binary Dev ---
    if (theme === 'binary') {
        const renderColumn = (bits) => (
            <div className="flex flex-col gap-2.5">
                {bits.map((bit, i) => (
                    <div key={i} className={`w-3.5 h-3.5 rounded-full transition-colors duration-300 ${bit === '1' ? `bg-gradient-to-r ${accentGradient} shadow-[0_0_10px_rgba(255,255,255,0.8)]` : 'bg-white/10'}`}></div>
                ))}
            </div>
        );
        return (
            <div className="p-7 bg-black/85 border border-white/15 rounded-2xl backdrop-blur-xl shadow-2xl select-none">
                <div className="flex gap-4 items-end">
                    <div className="flex gap-1.5">{renderColumn(binH[0])}{renderColumn(binH[1])}</div>
                    <div className="h-24 w-px bg-white/15"></div>
                    <div className="flex gap-1.5">{renderColumn(binM[0])}{renderColumn(binM[1])}</div>
                    <div className="h-24 w-px bg-white/15"></div>
                    <div className="flex gap-1.5">{renderColumn(binS[0])}{renderColumn(binS[1])}</div>
                </div>
                <div className="mt-4 flex justify-between text-xs text-emerald-400 font-mono tracking-widest opacity-70">
                    <span>H</span><span>M</span><span>S</span>
                </div>
                <div className="mt-2 text-center font-mono text-white/40 text-sm">{h}:{m}:{s} {p}</div>
            </div>
        );
    }

    // --- 14. Terminal Shell ---
    if (theme === 'terminal') {
        return (
            <div className="font-mono text-left bg-[#0c0c0c]/90 p-6 rounded-xl border border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.15)] min-w-[340px] select-none backdrop-blur-xl">
                <div className="text-emerald-500/60 text-xs mb-3 border-b border-emerald-500/20 pb-2 flex justify-between">
                    <span>user@dashboard:~</span>
                    <span>bash (zsh)</span>
                </div>
                <div className="text-emerald-400 text-sm">
                    <span className="opacity-50">$</span> date +"%r %Z"
                    <div className="text-5xl font-bold tracking-tight my-2 text-white">
                        {h}:{m}:{s} <span className="text-emerald-400 text-2xl">{p}</span>
                    </div>
                </div>
                <div className="text-emerald-500/60 text-xs mt-3">{dateString} <span className="animate-pulse font-black">_</span></div>
            </div>
        );
    }

    // --- 15. Minimal Ultralight ---
    if (theme === 'minimal') {
        return (
            <div className="flex flex-col items-center select-none">
                <div className="text-[9rem] md:text-[11rem] font-thin leading-none text-white/95 tracking-tighter">{h}</div>
                <div className={`h-1.5 w-20 my-1 bg-gradient-to-r ${accentGradient} rounded-full`}></div>
                <div className="text-[9rem] md:text-[11rem] font-thin leading-none text-white/60 tracking-tighter">{m}</div>
            </div>
        );
    }

    // --- 16. Vertical Bold Stack ---
    if (theme === 'vertical') {
        return (
            <div className="flex flex-col items-center justify-center select-none -space-y-6">
                <span className="text-[6.5rem] md:text-[7.5rem] font-black tracking-tighter text-white/20 leading-none">{h}</span>
                <span className={`text-[6.5rem] md:text-[7.5rem] font-black tracking-tighter bg-gradient-to-b ${accentGradient} bg-clip-text text-transparent leading-none z-10 drop-shadow-xl`}>{m}</span>
                <span className="text-[6.5rem] md:text-[7.5rem] font-black tracking-tighter text-white/20 leading-none">{s}</span>
            </div>
        );
    }

    // --- 17. Default: Modern Sans ---
    return (
        <div className="text-center select-none px-4 group cursor-default">
            <div className="flex items-baseline justify-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
                <h1 className="text-8xl md:text-9xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl font-variant-numeric tabular-nums">
                    {h}:{m}
                </h1>
                <div className="flex flex-col items-start">
                    <span className={`text-3xl font-black bg-gradient-to-br ${accentGradient} bg-clip-text text-transparent`}>{p}</span>
                    <span className="text-sm font-semibold text-white/40 mt-1 font-mono">{s}</span>
                </div>
            </div>
            <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto my-3"></div>
            <p className="text-sm md:text-base font-semibold text-white/70 tracking-[0.35em] uppercase">
                {dateString}
            </p>
        </div>
    );
};

// --- Sub-components for Flip Clock ---

const FlipGroup = ({ digits }) => (
    <div className="flex gap-1">
        <FlipCard digit={digits[0]} />
        <FlipCard digit={digits[1]} />
    </div>
);

const FlipCard = ({ digit }) => (
    <div className="relative w-14 h-20 md:w-18 md:h-28 bg-[#1f1f1f] rounded-lg overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute inset-0 grid grid-rows-2">
            <div className="bg-[#282828] border-b border-black/60 flex items-end justify-center overflow-hidden">
                <span className="text-5xl md:text-6xl font-black text-neutral-100 translate-y-[50%] font-mono">{digit}</span>
            </div>
            <div className="bg-[#222222] flex items-start justify-center overflow-hidden">
                <span className="text-5xl md:text-6xl font-black text-neutral-100 -translate-y-[50%] font-mono">{digit}</span>
            </div>
        </div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black shadow-[0_1px_2px_rgba(255,255,255,0.1)]"></div>
    </div>
);

export default React.memo(ClockDisplay);