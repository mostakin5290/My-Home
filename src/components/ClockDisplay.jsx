import React from 'react';
import { ACCENTS } from '../utils/constants'; // Make sure ACCENTS has colors like 'from-blue-500 to-cyan-500'

// --- Helper Functions ---

const getTimeData = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const period = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const pad = (num) => num.toString().padStart(2, '0');

    // Smooth sweep calculations for analog clocks
    const degS = (seconds * 6) + (milliseconds * 0.006);
    const degM = (minutes * 6) + (seconds * 0.1);
    const degH = (hours * 30) + (minutes * 0.5);

    // Binary Helper for the Binary Clock
    const toBinary = (num) => {
        return num.toString(2).padStart(4, '0').split('');
    };

    return {
        h: pad(hours),
        m: pad(minutes),
        s: pad(seconds),
        p: period,
        rawH: hours,
        rawM: minutes,
        rawS: seconds,
        degH,
        degM,
        degS,
        binH: [toBinary(Math.floor(hours / 10)), toBinary(hours % 10)],
        binM: [toBinary(Math.floor(minutes / 10)), toBinary(minutes % 10)],
        binS: [toBinary(Math.floor(seconds / 10)), toBinary(seconds % 10)],
        dateObj: date // Passing full date for detailed displays
    };
};

const numberToWords = (num) => {
    const units = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
    const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY'];
    if (num < 20) return units[num];
    return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
};

const ClockDisplay = ({ time, theme, accent }) => {
    const { h, m, s, p, rawH, rawM, rawS, binH, binM, binS, dateObj, degH, degM, degS } = getTimeData(time);

    // Day/Date String helper
    const dateString = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase();

    // --- 1. Swiss Analog (IMPROVED: Luxury Watch Style) ---
    if (theme === 'analog') {
        return (
            <div className="relative w-80 h-80 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                {/* 1. Metal Case / Bezel */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 border-[1px] border-gray-500 shadow-xl"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 via-black to-gray-900 border-[4px] border-gray-400/50"></div>

                {/* 2. The Dial (Sunburst Effect) */}
                <div className="absolute inset-4 rounded-full bg-[#0a0a0a] overflow-hidden">
                    {/* Subtle Sunburst Gradient */}
                    <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,#1a1a1a_0deg,#000_100deg,#1a1a1a_180deg,#000_280deg,#1a1a1a_360deg)] opacity-50"></div>

                    {/* Minute Ticks (Subtle) */}
                    {[...Array(60)].map((_, i) => (
                        <div key={i}
                            className={`absolute top-0 left-1/2 -translate-x-1/2 origin-bottom w-[1px] h-[50%] opacity-30 ${i % 5 === 0 ? 'hidden' : 'bg-white'}`}
                            style={{ transform: `rotate(${i * 6}deg)` }}
                        >
                            <div className="w-full h-2 bg-white/40"></div>
                        </div>
                    ))}
                </div>

                {/* 3. Hour Markers (Lume / Glow) */}
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute inset-4">
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-6 bg-white rounded-sm shadow-[0_0_5px_rgba(255,255,255,0.5)] z-10"
                            style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: '50% 142px' }}>
                            {/* Lume Strip inside */}
                            <div className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] bg-[#ccffcc] opacity-80 rounded-sm"></div>
                        </div>
                    </div>
                ))}

                {/* Branding */}
                <div className="absolute top-[22%] z-10 text-center">
                    <div className="text-[10px] font-black tracking-[0.2em] text-gray-400">CHRONOGRAPH</div>
                    <div className="text-[8px] font-serif text-gray-500 mt-1 italic">Automatic</div>
                </div>

                {/* Date Window */}
                <div className="absolute right-[22%] top-1/2 -translate-y-1/2 w-8 h-6 bg-white rounded-[2px] flex items-center justify-center border-2 border-gray-400 shadow-inner z-10">
                    <span className="text-black font-bold text-xs font-mono">{time.getDate()}</span>
                </div>

                {/* 4. Hands (With Shadows for Depth) */}
                {/* Hour Hand */}
                <div className="absolute w-3 h-20 bg-gradient-to-t from-gray-200 to-white rounded-full origin-bottom shadow-[-2px_2px_4px_rgba(0,0,0,0.8)] z-20"
                    style={{ transform: `rotate(${degH}deg)`, bottom: '50%', left: 'calc(50% - 6px)', borderRadius: '4px 4px 0 0' }}>
                    <div className="absolute top-2 left-1 right-1 h-12 bg-[#ccffcc] opacity-90 rounded-full"></div>
                </div>

                {/* Minute Hand */}
                <div className="absolute w-2 h-28 bg-gradient-to-t from-gray-200 to-white rounded-full origin-bottom shadow-[-2px_2px_4px_rgba(0,0,0,0.8)] z-30"
                    style={{ transform: `rotate(${degM}deg)`, bottom: '50%', left: 'calc(50% - 4px)', borderRadius: '4px 4px 0 0' }}>
                    <div className="absolute top-2 left-[2px] right-[2px] h-20 bg-[#ccffcc] opacity-90 rounded-full"></div>
                </div>

                {/* Second Hand (The "Needle" with Accent) */}
                <div className={`absolute w-[1px] h-32 bg-gradient-to-t ${ACCENTS[accent]} origin-bottom z-40`}
                    style={{ transform: `rotate(${degS}deg)`, bottom: '50%', left: '50%' }}>
                    {/* Counter weight circle */}
                    <div className={`absolute bottom-[-15px] left-[-3px] w-1.5 h-8 bg-${ACCENTS[accent]?.split('-')[1] || 'red'}-500 rounded-full`}></div>
                    <div className="absolute top-4 left-[-3px] w-2 h-2 bg-white rounded-full shadow-sm"></div>
                </div>

                {/* Center Cap */}
                <div className="absolute w-4 h-4 bg-gray-200 rounded-full z-50 border border-gray-400 shadow-md"></div>
                <div className="absolute w-1 h-1 bg-black rounded-full z-50"></div>
            </div>
        );
    }

    // --- 2. Retro Flip (Refined) ---
    if (theme === 'retro') {
        return (
            <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 md:gap-4 p-6 bg-[#2a2a2a] rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)] border-b-4 border-black/40">
                    <FlipGroup digits={h} />
                    <div className="flex flex-col gap-4 mx-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    </div>
                    <FlipGroup digits={m} />

                    {/* Retro AM/PM Label */}
                    <div className="absolute bottom-2 right-4 text-[10px] text-white/40 font-bold tracking-widest border border-white/20 px-1 rounded">
                        {p}
                    </div>
                </div>
            </div>
        );
    }

    // --- 3. Digital LCD (NEW - Casio Style) ---
    if (theme === 'digital') {
        return (
            <div className="relative p-6 bg-gray-200 rounded-xl shadow-inner border-[6px] border-gray-400 w-80">
                {/* Screen */}
                <div className="bg-[#9ea792] p-4 rounded-md shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)] border-2 border-[#8b937f] relative overflow-hidden">
                    {/* Shadow overlay for depth */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/5 to-transparent pointer-events-none"></div>

                    <div className="flex justify-between items-end mb-1 opacity-80">
                        <span className="text-xs font-mono font-bold text-[#2d3326] tracking-widest">ALARM CHRONO</span>
                        <span className="text-[10px] font-mono text-[#2d3326] border border-[#2d3326] px-1">{p}</span>
                    </div>

                    <div className="flex items-end justify-center gap-2 relative z-10">
                        <h1 className="text-6xl font-mono text-[#1a1f16] tracking-tighter leading-none" style={{ fontFamily: '"Courier Prime", monospace' }}>
                            {h}:{m}
                        </h1>
                        <span className="text-2xl font-mono text-[#1a1f16] mb-1">{s}</span>
                    </div>

                    <div className="mt-2 flex justify-between text-xs font-mono text-[#2d3326] opacity-70">
                        <span>{dateString}</span>
                        <span>WATER RESIST</span>
                    </div>
                </div>
                {/* Buttons hints */}
                <div className="absolute -left-1 top-10 w-1 h-6 bg-gray-500 rounded-l"></div>
                <div className="absolute -right-1 top-10 w-1 h-6 bg-gray-500 rounded-r"></div>
            </div>
        );
    }

    // --- 4. Radial (NEW - Smartwatch Style) ---
    if (theme === 'radial') {
        const r = 50;
        const circ = 2 * Math.PI * r;
        const hOffset = circ - ((rawH % 12) / 12) * circ;
        const mOffset = circ - (rawM / 60) * circ;
        const sOffset = circ - (rawS / 60) * circ;

        return (
            <div className="relative w-72 h-72 flex items-center justify-center bg-black rounded-full shadow-2xl border border-gray-800">
                {/* SVG Rings */}
                <svg className="absolute w-full h-full -rotate-90 p-4">
                    {/* Seconds Ring (Outer) */}
                    <circle cx="50%" cy="50%" r="48%" stroke="#333" strokeWidth="6" fill="transparent" />
                    <circle cx="50%" cy="50%" r="48%" stroke="currentColor" strokeWidth="6" fill="transparent"
                        className={`text-red-500 transition-all duration-1000 ease-linear`}
                        strokeDasharray={circ * 3} strokeDashoffset={sOffset * 3} strokeLinecap="round" />

                    {/* Minutes Ring */}
                    <circle cx="50%" cy="50%" r="38%" stroke="#222" strokeWidth="10" fill="transparent" />
                    <circle cx="50%" cy="50%" r="38%" stroke="white" strokeWidth="10" fill="transparent"
                        className="opacity-80 transition-all duration-500"
                        strokeDasharray={circ * 2.5} strokeDashoffset={mOffset * 2.5} strokeLinecap="round" />

                    {/* Hours Ring (Inner) */}
                    <circle cx="50%" cy="50%" r="28%" stroke="#111" strokeWidth="14" fill="transparent" />
                    <circle cx="50%" cy="50%" r="28%" stroke="url(#gradient)" strokeWidth="14" fill="transparent"
                        className="transition-all duration-500"
                        strokeDasharray={circ * 1.8} strokeDashoffset={hOffset * 1.8} strokeLinecap="round" />

                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Digital Time Center */}
                <div className="z-10 text-center">
                    <div className="text-4xl font-bold text-white tracking-tighter">{h}:{m}</div>
                    <div className="text-sm font-medium text-gray-400">{dateString}</div>
                </div>
            </div>
        );
    }

    // --- 5. Binary (NEW - Hacker/Dev Style) ---
    if (theme === 'binary') {
        const renderColumn = (bits) => (
            <div className="flex flex-col gap-2">
                {bits.map((bit, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-colors duration-300 ${bit === '1' ? `bg-gradient-to-r ${ACCENTS[accent]} shadow-[0_0_8px_rgba(255,255,255,0.6)]` : 'bg-white/10'}`}></div>
                ))}
            </div>
        );
        return (
            <div className="p-8 bg-black/80 border border-green-500/20 rounded-xl backdrop-blur-md shadow-2xl">
                <div className="flex gap-4 items-end">
                    {/* Hours */}
                    <div className="flex gap-1">{renderColumn(binH[0])}{renderColumn(binH[1])}</div>
                    <div className="h-20 w-px bg-white/10"></div>
                    {/* Minutes */}
                    <div className="flex gap-1">{renderColumn(binM[0])}{renderColumn(binM[1])}</div>
                    <div className="h-20 w-px bg-white/10"></div>
                    {/* Seconds */}
                    <div className="flex gap-1">{renderColumn(binS[0])}{renderColumn(binS[1])}</div>
                </div>
                <div className="mt-4 flex justify-between text-xs text-green-500 font-mono tracking-widest opacity-60">
                    <span>H</span><span>M</span><span>S</span>
                </div>
                <div className="mt-1 text-center font-mono text-white/20 text-sm">{h}:{m}:{s}</div>
            </div>
        );
    }

    // --- 6. Glassmorphism (NEW - Modern UI) ---
    if (theme === 'glass') {
        return (
            <div className="relative group">
                <div className={`absolute -inset-4 bg-gradient-to-r ${ACCENTS[accent]} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000`}></div>
                <div className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <h1 className="text-8xl font-thin text-white tracking-tight relative z-10">{h}<span className="mx-2 font-normal animate-pulse">:</span>{m}</h1>
                    <div className="flex justify-between items-end mt-4 relative z-10">
                        <span className="text-2xl font-light text-white/80">{p}</span>
                        <span className="text-sm font-bold tracking-[0.3em] text-white/60 uppercase">{dateString}</span>
                    </div>
                </div>
            </div>
        );
    }

    // --- Other Themes (Kept from original but condensed where needed) ---

    // Tactical
    if (theme === 'tactical') {
        return (
            <div className="relative w-72 h-72 rounded-full border-2 border-dashed border-white/20 bg-black/60 backdrop-blur-md flex items-center justify-center">
                {/* Decorative Grid */}
                <div className="absolute inset-4 border border-white/5 rounded-full border-l-transparent border-r-transparent animate-spin-slow"></div>
                <div className="z-10 text-center">
                    <div className="text-6xl font-black text-white tracking-tighter tabular-nums">{h}:{m}</div>
                    <div className="text-xs font-mono text-red-500 mt-2 tracking-[0.3em] bg-red-500/10 px-2 py-1 rounded">SYS.ACTIVE</div>
                </div>
                {/* Rotating ring */}
                <div className="absolute w-full h-full border-t-4 border-red-600 rounded-full opacity-60" style={{ transform: `rotate(${rawS * 6}deg)` }}></div>
            </div>
        )
    }

    // Neon
    if (theme === 'neon') {
        return (
            <div className="text-center relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${ACCENTS[accent]} blur-[80px] opacity-30`}></div>
                <div className="relative border-2 border-white/10 px-12 py-8 rounded-3xl bg-black/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <h1 className="text-[6rem] font-bold tracking-tighter leading-none text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ textShadow: '0 0 20px currentColor' }}>
                        {h}:{m}
                    </h1>
                    <div className={`h-1 w-full mt-4 bg-gradient-to-r ${ACCENTS[accent]} shadow-[0_0_15px_currentColor]`}></div>
                </div>
            </div>
        );
    }

    // Minimal
    if (theme === 'minimal') {
        return (
            <div className="flex flex-col items-center">
                <div className="text-[12rem] font-thin leading-none text-white/90 tracking-tighter -ml-4">{h}</div>
                <div className={`h-2 w-24 my-2 bg-gradient-to-r ${ACCENTS[accent]}`}></div>
                <div className="text-[12rem] font-thin leading-none text-white/50 tracking-tighter -mr-4">{m}</div>
            </div>
        );
    }

    // Typographic
    if (theme === 'typo') {
        const hWord = numberToWords(rawH || 12);
        const mWord = numberToWords(rawM);
        const isExact = rawM === 0;
        return (
            <div className="text-left select-none max-w-2xl mx-auto px-6 py-12 border-l-8 border-white">
                <div className="text-2xl text-white/40 font-bold mb-4 tracking-widest">CURRENTLY</div>
                <h1 className="text-[4rem] md:text-[6rem] font-black leading-[0.9] tracking-tight text-white break-words">
                    {hWord}<br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-br ${ACCENTS[accent]}`}>
                        {isExact ? "O'CLOCK" : mWord}
                    </span>
                </h1>
            </div>
        );
    }

    // Vertical
    if (theme === 'vertical') {
        return (
            <div className="flex flex-col items-center justify-center select-none -space-y-4">
                <span className="text-[8rem] font-black tracking-tighter text-white/10 leading-none">{h}</span>
                <span className={`text-[8rem] font-black tracking-tighter bg-gradient-to-b ${ACCENTS[accent]} bg-clip-text text-transparent leading-none z-10`}>{m}</span>
                <span className="text-[8rem] font-black tracking-tighter text-white/10 leading-none">{s}</span>
            </div>
        );
    }

    // Terminal
    if (theme === 'terminal') {
        return (
            <div className="font-mono text-left bg-[#0c0c0c] p-6 rounded-lg border border-green-500/40 shadow-[0_0_30px_rgba(0,255,0,0.1)] min-w-[320px]">
                <div className="text-green-500/60 text-[10px] mb-4 border-b border-green-500/20 pb-2 flex justify-between">
                    <span>usr@clock:~</span>
                    <span>bash</span>
                </div>
                <div className="text-green-500">
                    <span className="opacity-50">$</span> date +%T
                    <div className="text-6xl font-bold tracking-tighter my-2 text-white">
                        {h}:{m}:{s}
                    </div>
                </div>
                <div className="text-green-500/50 text-xs mt-4 animate-pulse">_</div>
            </div>
        );
    }

    // Default: Modern Sans
    return (
        <div className="text-center select-none px-4 group cursor-default">
            <div className="flex items-baseline justify-center gap-2 transition-transform duration-500 hover:scale-105">
                <h1 className="text-[12rem] font-bold tracking-tighter leading-none bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-2xl font-variant-numeric tabular-nums">
                    {h}:{m}
                </h1>
                <div className="flex flex-col items-start">
                    <span className={`text-4xl font-bold bg-gradient-to-br ${ACCENTS[accent]} bg-clip-text text-transparent`}>{p}</span>
                    <span className="text-lg font-medium text-white/40 mt-1">{s}</span>
                </div>
            </div>
            <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto my-4"></div>
            <p className="text-xl font-medium text-white/60 tracking-[0.4em] uppercase">
                {dateString}
            </p>
        </div>
    );
};

// --- Sub-components ---

const FlipGroup = ({ digits }) => (
    <div className="flex gap-1">
        <FlipCard digit={digits[0]} />
        <FlipCard digit={digits[1]} />
    </div>
);

const FlipCard = ({ digit }) => (
    <div className="relative w-16 h-24 md:w-20 md:h-32 bg-[#1a1a1a] rounded-md overflow-hidden shadow-xl border border-white/5">
        <div className="absolute inset-0 grid grid-rows-2">
            <div className="bg-[#252525] border-b border-black/50 flex items-end justify-center overflow-hidden">
                <span className="text-6xl md:text-7xl font-bold text-[#ddd] translate-y-[50%] font-mono">{digit}</span>
            </div>
            <div className="bg-[#202020] flex items-start justify-center overflow-hidden">
                <span className="text-6xl md:text-7xl font-bold text-[#ddd] -translate-y-[50%] font-mono">{digit}</span>
            </div>
        </div>
        {/* Hinge Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black shadow-[0_1px_2px_rgba(255,255,255,0.1)]"></div>
    </div>
);

export default ClockDisplay;