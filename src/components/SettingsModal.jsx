import React, { useState } from 'react';
import {
    Sliders, ChevronRight, Clock, ImageIcon, Palette,
    X, Download, Upload, Keyboard, Shield, Search, Sparkles,
    Move, Maximize, Pipette, Eye
} from 'lucide-react';
import ClockDisplay from './ClockDisplay';
import { CLOCK_THEMES, WALLPAPERS, LIVE_WALLPAPERS, SOLID_COLORS, ACCENTS, SEARCH_ENGINES } from '../utils/constants';

const SettingsModal = ({ settingsOpen, setSettingsOpen, config, setConfig }) => {
    const [activeTab, setActiveTab] = useState('visuals');
    const [wallpaperCategory, setWallpaperCategory] = useState('all');
    const [exportSuccess, setExportSuccess] = useState(false);

    if (!settingsOpen) return null;

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `my-home-theme-backup-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 2000);
    };

    const handleImport = (e) => {
        const fileReader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    setConfig(prev => ({ ...prev, ...parsed }));
                    alert('Settings imported successfully!');
                } catch (err) {
                    alert('Invalid JSON configuration file.');
                }
            };
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-none"
            onClick={() => setSettingsOpen(false)}
        >
            <div
                className="w-full max-w-3xl h-[550px] md:h-[570px] rounded-[24px] flex flex-col md:flex-row overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative border border-white/20 animate-pop-in"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(20, 20, 25, 0.65) 100%)',
                    backdropFilter: 'blur(36px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(36px) saturate(190%)',
                    boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button Top-Right */}
                <button
                    onClick={() => setSettingsOpen(false)}
                    className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                    title="Close (Esc)"
                >
                    <X size={15} />
                </button>

                {/* Sidebar */}
                <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/10 p-4 bg-white/[0.02] flex flex-col justify-between shrink-0">
                    <div>
                        {/* macOS Window Controls */}
                        <div className="flex items-center gap-1.5 mb-4 px-1">
                            <button
                                onClick={() => setSettingsOpen(false)}
                                className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-90 transition-all flex items-center justify-center group"
                            >
                                <X size={7} className="text-[#4c0000] opacity-0 group-hover:opacity-100" />
                            </button>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                        </div>

                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="p-1.5 rounded-lg bg-white/10 text-white">
                                <Sliders size={15} />
                            </div>
                            <h2 className="text-sm font-bold text-white tracking-tight">Preferences</h2>
                        </div>

                        <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'visuals', label: 'Clock & Themes', icon: Clock },
                                { id: 'background', label: 'Wallpapers', icon: ImageIcon },
                                { id: 'widgets', label: 'Widgets', icon: Sparkles },
                                { id: 'preferences', label: 'Search & Inputs', icon: Search },
                                { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
                                { id: 'backup', label: 'Backup & Reset', icon: Shield },
                            ].map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 shrink-0 ${isActive
                                            ? 'bg-white/20 text-white shadow-xs border border-white/10'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon size={14} className={isActive ? 'text-white' : 'text-white/40'} />
                                            <span>{tab.label}</span>
                                        </div>
                                        <ChevronRight size={12} className={`hidden md:block transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="hidden md:block text-[11px] text-white/30 px-2 font-mono">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">Esc</kbd> to exit
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 md:p-6 overflow-y-auto custom-scrollbar bg-neutral-950/25">
                    {/* 1. VISUALS: Clock Themes, Position, Color & Live Preview */}
                    {activeTab === 'visuals' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* LIVE CLOCK PREVIEW STAGE */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/15 p-4 flex flex-col items-center justify-center min-h-[160px] shadow-2xl bg-black/45 backdrop-blur-2xl">
                                <div className="absolute top-2.5 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[9.5px] font-mono uppercase text-white/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>Live Preview</span>
                                </div>
                                <div className="absolute top-2.5 right-3 text-[10px] font-mono text-white/40">
                                    {CLOCK_THEMES[config.clockTheme]?.name || 'Modern Sans'}
                                </div>

                                <div className="my-2 transition-all duration-300">
                                    <ClockDisplay
                                        theme={config.clockTheme}
                                        accent={config.accent}
                                        scale={0.65}
                                        customColor={config.clockColor}
                                    />
                                </div>
                            </div>

                            {/* CLOCK SCREEN POSITION SELECTOR */}
                            <section>
                                <div className="flex items-center justify-between mb-1.5">
                                    <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70">
                                        <Move size={13} /> Clock Position on Screen
                                    </h3>
                                    <span className="text-[10px] font-mono text-white/40 capitalize">
                                        Active: {config.clockPosition || 'Center'}
                                    </span>
                                </div>
                                <p className="text-[10.5px] text-white/40 mb-2.5">
                                    Position the clock according to your video wallpaper subject (e.g. Move away from faces or nature points).
                                </p>

                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'top-left', label: '↖ Top Left' },
                                        { id: 'top-center', label: '↑ Top Center' },
                                        { id: 'top-right', label: '↗ Top Right' },
                                        { id: 'bottom-left', label: '↙ Bottom Left' },
                                        { id: 'center', label: '⦿ Center (Default)' },
                                        { id: 'bottom-right', label: '↘ Bottom Right' },
                                    ].map(pos => {
                                        const isSelected = (config.clockPosition || 'center') === pos.id;
                                        return (
                                            <button
                                                key={pos.id}
                                                onClick={() => setConfig({ ...config, clockPosition: pos.id })}
                                                className={`py-2 px-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                                                    isSelected
                                                        ? 'bg-white/25 border-white/40 text-white shadow-md scale-[1.01]'
                                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {pos.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* CLOCK SIZE SCALE & COLOR CONTROLS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Scale */}
                                <section className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70">
                                            <Maximize size={13} /> Clock Size Scale
                                        </h3>
                                        <span className="text-[10px] font-mono text-white/50">{config.clockScale || 1.0}x</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[
                                            { scale: 0.75, label: '0.75x' },
                                            { scale: 1.0, label: '1.0x' },
                                            { scale: 1.2, label: '1.2x' },
                                            { scale: 1.4, label: '1.4x' },
                                        ].map(item => (
                                            <button
                                                key={item.scale}
                                                onClick={() => setConfig({ ...config, clockScale: item.scale })}
                                                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${(config.clockScale || 1.0) === item.scale
                                                    ? 'bg-white text-black border-white shadow-xs'
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Color Tint */}
                                <section className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/70">
                                            <Palette size={13} /> Clock Color
                                        </h3>
                                        {config.clockColor && (
                                            <button
                                                onClick={() => setConfig({ ...config, clockColor: null })}
                                                className="text-[10px] text-white/40 hover:text-white underline transition-colors"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        {[
                                            { hex: null, label: 'Default' },
                                            { hex: '#ffffff', label: 'White' },
                                            { hex: '#38bdf8', label: 'Sky' },
                                            { hex: '#34d399', label: 'Emerald' },
                                            { hex: '#fbbf24', label: 'Amber' },
                                            { hex: '#f43f5e', label: 'Rose' },
                                            { hex: '#c084fc', label: 'Purple' },
                                            { hex: '#fb923c', label: 'Coral' },
                                        ].map((colorItem, i) => {
                                            const isSelected = (!colorItem.hex && !config.clockColor) || (config.clockColor === colorItem.hex);
                                            return (
                                                <button
                                                    key={i}
                                                    title={colorItem.label}
                                                    onClick={() => setConfig({ ...config, clockColor: colorItem.hex })}
                                                    className={`w-6 h-6 rounded-full transition-all flex items-center justify-center border border-white/20 ${
                                                        isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
                                                    }`}
                                                    style={{ backgroundColor: colorItem.hex || 'rgba(255,255,255,0.2)' }}
                                                >
                                                </button>
                                            );
                                        })}
                                        {/* Custom Color Input */}
                                        <label className="relative w-6 h-6 rounded-full overflow-hidden border border-white/30 cursor-pointer flex items-center justify-center bg-gradient-to-tr from-rose-500 via-emerald-500 to-sky-500 hover:scale-105 transition-transform" title="Custom Hex Color">
                                            <input
                                                type="color"
                                                className="opacity-0 absolute inset-0 cursor-pointer"
                                                value={config.clockColor || '#ffffff'}
                                                onChange={(e) => setConfig({ ...config, clockColor: e.target.value })}
                                            />
                                        </label>
                                    </div>
                                </section>
                            </div>

                            {/* UI Accent Palette */}
                            <section>
                                <h3 className="flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-white/70">
                                    <Sparkles size={13} /> UI Glow & Accent Palette
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(ACCENTS).map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, accent: color })}
                                            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs ${config.accent === color
                                                ? 'bg-white/20 border-white/40 text-white shadow-xs'
                                                : 'bg-white/5 border-white/5 text-white/50 hover:border-white/20 hover:text-white'
                                                }`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${ACCENTS[color]} shadow-xs`}></div>
                                            <span className="capitalize font-medium text-[11px]">{color}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Clock Face Selection */}
                            <section>
                                <div className="flex items-center justify-between mb-2.5">
                                    <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/70">
                                        <Clock size={13} /> Clock Faces (17 Unique Styles)
                                    </h3>
                                    <span className="text-[10px] font-mono text-white/40">Active: {CLOCK_THEMES[config.clockTheme]?.name || 'Modern Sans'}</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {Object.values(CLOCK_THEMES).map(theme => {
                                        const Icon = theme.icon;
                                        const isSelected = config.clockTheme === theme.id;
                                        return (
                                            <button
                                                key={theme.id}
                                                onClick={() => setConfig({ ...config, clockTheme: theme.id })}
                                                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[72px] ${isSelected
                                                    ? 'bg-gradient-to-br from-white/25 to-white/10 border-white/40 text-white shadow-md scale-[1.02]'
                                                    : 'border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between w-full mb-1">
                                                    <Icon size={16} className={isSelected ? 'text-white' : 'text-white/40'} />
                                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-xs"></span>}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-[11px] block text-white">{theme.name}</span>
                                                    <span className="text-[9.5px] text-white/40 line-clamp-1 leading-tight">{theme.description}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* 2. BACKGROUND: Wallpapers & Filters */}
                    {activeTab === 'background' && (
                        <div className="space-y-5 animate-fade-in">
                            {/* Segmented Category Bar */}
                            <div className="flex p-1 bg-black/40 border border-white/10 rounded-2xl gap-1">
                                {[
                                    { type: 'live', label: '🎥 Live Motion' },
                                    { type: 'particles', label: '✨ Particles' },
                                    { type: 'image', label: '🖼️ Wallpapers' },
                                    { type: 'color', label: '🎨 Solid Tones' }
                                ].map(tab => {
                                    const isSelected = config.wallpaperType === tab.type || (tab.type === 'live' && (config.wallpaperType === 'live' || config.wallpaperType === 'video'));
                                    return (
                                        <button
                                            key={tab.type}
                                            onClick={() => {
                                                if (tab.type === 'live' && config.wallpaperType !== 'live' && config.wallpaperType !== 'video') {
                                                    setConfig({ ...config, wallpaperType: 'live', wallpaper: LIVE_WALLPAPERS.auroraLive.url });
                                                } else if (tab.type === 'particles') {
                                                    setConfig({ ...config, wallpaperType: 'particles' });
                                                } else if (tab.type === 'image' && config.wallpaperType !== 'image') {
                                                    setConfig({ ...config, wallpaperType: 'image', wallpaper: WALLPAPERS.sequoiaDark });
                                                } else {
                                                    setConfig({ ...config, wallpaperType: tab.type });
                                                }
                                            }}
                                            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all text-center ${
                                                isSelected
                                                    ? 'bg-white/20 text-white shadow-xs border border-white/15'
                                                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Live Video Wallpapers */}
                            {(config.wallpaperType === 'live' || config.wallpaperType === 'video') && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                        {Object.values(LIVE_WALLPAPERS).map((live) => (
                                            <button
                                                key={live.id}
                                                onClick={() => setConfig({ ...config, wallpaper: live.url, wallpaperType: 'live' })}
                                                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${config.wallpaper === live.url
                                                    ? 'border-white ring-2 ring-white/30 scale-[1.02] shadow-lg'
                                                    : 'border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]'
                                                    }`}
                                            >
                                                <img src={live.poster} className="w-full h-full object-cover" alt={live.name} loading="lazy" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xs">
                                                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                                                    </div>
                                                </div>
                                                <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-white drop-shadow-md bg-black/60 px-1.5 py-0.5 rounded">
                                                    {live.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Upload Video File from PC / Mac (Recommended for Pixabay / Pexels downloads) */}
                                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                                    <span>📁</span> Upload Downloaded Video File
                                                </h4>
                                                <p className="text-[10px] text-white/50">
                                                    Downloaded a video from Pixabay or Pexels? Upload the .mp4 file directly!
                                                </p>
                                            </div>

                                            <label className="px-3.5 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm">
                                                Choose File
                                                <input
                                                    type="file"
                                                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                                    className="hidden"
                                                    onChange={async (e) => {
                                                        const file = e.target.files && e.target.files[0];
                                                        if (file) {
                                                            const { saveMedia } = await import('../utils/db');
                                                            await saveMedia('custom_live_video', file);
                                                            const objUrl = URL.createObjectURL(file);
                                                            setConfig({ ...config, wallpaper: objUrl, wallpaperType: 'live' });
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Custom Video URL Input */}
                                    <div className="pt-1">
                                        <label className="text-[11px] font-semibold text-white/60 mb-1.5 block">Or Paste Direct Video URL (.mp4 / .webm)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="https://example.com/video.mp4"
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
                                                value={config.customVideo || ''}
                                                onChange={(e) => setConfig({ ...config, customVideo: e.target.value })}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (config.customVideo) {
                                                        setConfig({ ...config, wallpaper: config.customVideo, wallpaperType: 'live' });
                                                    }
                                                }}
                                                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-bold transition-all shrink-0"
                                            >
                                                Set URL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Interactive Particles */}
                            {config.wallpaperType === 'particles' && (
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
                                    <span className="text-3xl block">✨</span>
                                    <h4 className="text-sm font-bold text-white">Interactive Constellation Shader</h4>
                                    <p className="text-xs text-white/50 max-w-md mx-auto">
                                        Active 60fps dynamic constellation particles moving smoothly in real-time with responsive physics. Colors adapt automatically to your UI Accent color.
                                    </p>
                                </div>
                            )}

                            {/* Static HD Wallpapers */}
                            {config.wallpaperType === 'image' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                        {Object.entries(WALLPAPERS).map(([key, url]) => (
                                            <button
                                                key={key}
                                                onClick={() => setConfig({ ...config, wallpaper: url, wallpaperType: 'image' })}
                                                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${config.wallpaper === url
                                                    ? 'border-white ring-2 ring-white/30 scale-[1.02] shadow-lg'
                                                    : 'border-transparent opacity-65 hover:opacity-100 hover:scale-[1.02]'
                                                    }`}
                                            >
                                                <img src={url} className="w-full h-full object-cover" alt={key} loading="lazy" />
                                                <span className="absolute bottom-1.5 left-2 text-[10px] font-mono capitalize text-white drop-shadow-md bg-black/60 px-1.5 py-0.5 rounded">
                                                    {key}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom URL Input */}
                                    <div className="pt-1">
                                        <label className="text-[11px] font-semibold text-white/60 mb-1.5 block">Custom Image URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="https://images.unsplash.com/..."
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
                                                value={config.customImage || ''}
                                                onChange={(e) => setConfig({ ...config, customImage: e.target.value })}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (config.customImage) {
                                                        setConfig({ ...config, wallpaper: config.customImage, wallpaperType: 'image' });
                                                    }
                                                }}
                                                className="px-3.5 py-1.5 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-bold transition-all shrink-0"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Solid Colors */}
                            {config.wallpaperType === 'color' && (
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5">
                                    {SOLID_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, wallpaper: color, wallpaperType: 'color' })}
                                            className={`aspect-square rounded-2xl transition-all shadow-md ${config.wallpaper === color
                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                                                : 'hover:scale-105 opacity-80 hover:opacity-100'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        ></button>
                                    ))}
                                </div>
                            )}

                            {/* Sliders: Dimming, Blur, Vignette */}
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 text-white/60 font-medium">
                                        <span>Background Dimming</span>
                                        <span className="font-mono">{Math.round(config.brightness * 100)}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="0.9" step="0.05"
                                        value={config.brightness}
                                        onChange={(e) => setConfig({ ...config, brightness: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 text-white/60 font-medium">
                                        <span>Backdrop Blur</span>
                                        <span className="font-mono">{config.blur}px</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="25" step="1"
                                        value={config.blur}
                                        onChange={(e) => setConfig({ ...config, blur: parseInt(e.target.value) })}
                                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 text-white/60 font-medium">
                                        <span>Vignette Darkness</span>
                                        <span className="font-mono">{Math.round((config.vignette || 0) * 100)}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="1" step="0.05"
                                        value={config.vignette || 0}
                                        onChange={(e) => setConfig({ ...config, vignette: parseFloat(e.target.value) })}
                                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. WIDGETS TOGGLE */}
                    {activeTab === 'widgets' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">Visible Dashboard Widgets</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { key: 'todo', label: 'Todo Task List', desc: 'Manage your daily tasks with filters' },
                                    { key: 'pomodoro', label: 'Pomodoro Focus Timer', desc: 'Interval study/work sessions with chime' },
                                    { key: 'sounds', label: 'Ambient Soundscapes', desc: 'Procedural Web Audio noise generator' },
                                    { key: 'notes', label: 'Quick Scratchpad Notes', desc: 'Auto-saved persistent scratchpad' },
                                    { key: 'weather', label: 'Live Weather Badge', desc: 'Local temperature and forecasts' },
                                ].map(w => {
                                    const isEnabled = config.widgets[w.key] !== false;
                                    return (
                                        <div
                                            key={w.key}
                                            onClick={() => setConfig({
                                                ...config,
                                                widgets: { ...config.widgets, [w.key]: !isEnabled }
                                            })}
                                            className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${isEnabled
                                                ? 'bg-white/10 border-white/30 shadow-md'
                                                : 'bg-white/[0.02] border-white/5 opacity-50 hover:opacity-80'
                                                }`}
                                        >
                                            <div>
                                                <div className="text-xs font-bold text-white">{w.label}</div>
                                                <div className="text-[10px] text-white/50 mt-0.5">{w.desc}</div>
                                            </div>
                                            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-white/20'}`}>
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${isEnabled ? 'left-5.5' : 'left-0.5'}`}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* 4. PREFERENCES & SEARCH */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-3">Search Engine</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {Object.entries(SEARCH_ENGINES).map(([key, engine]) => (
                                        <button
                                            key={key}
                                            onClick={() => setConfig({ ...config, searchEngine: key })}
                                            className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${(config.searchEngine || 'google') === key
                                                ? 'bg-white/20 border-white/40 text-white shadow-md'
                                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {engine.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div
                                    onClick={() => setConfig({ ...config, searchInNewTab: !config.searchInNewTab })}
                                    className="p-4 rounded-2xl border border-white/10 bg-white/5 cursor-pointer flex justify-between items-center transition-all hover:bg-white/10"
                                >
                                    <div>
                                        <div className="text-xs font-bold text-white">Open Search in New Tab</div>
                                        <div className="text-[10px] text-white/50 mt-0.5">Search queries launch in a new browser tab</div>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${config.searchInNewTab ? 'bg-emerald-500' : 'bg-white/20'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${config.searchInNewTab ? 'left-5.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setConfig({
                                        ...config,
                                        permissions: {
                                            ...(config.permissions || {}),
                                            location: !(config.permissions?.location)
                                        }
                                    })}
                                    className="p-4 rounded-2xl border border-white/10 bg-white/5 cursor-pointer flex justify-between items-center transition-all hover:bg-white/10"
                                >
                                    <div>
                                        <div className="text-xs font-bold text-white">Weather Geolocation Access</div>
                                        <div className="text-[10px] text-white/50 mt-0.5">Allow browser location to fetch local weather automatically</div>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${config.permissions?.location ? 'bg-emerald-500' : 'bg-white/20'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${config.permissions?.location ? 'left-5.5' : 'left-0.5'}`}></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={config.name}
                                    onChange={e => setConfig({ ...config, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>
                    )}

                    {/* 5. SHORTCUTS */}
                    {activeTab === 'shortcuts' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3">Keyboard Shortcuts</h3>
                            <div className="space-y-2 font-mono text-xs">
                                {[
                                    { key: '/', desc: 'Quick focus search bar' },
                                    { key: 'Esc', desc: 'Clear search / Close modal' },
                                    { key: 'Z', desc: 'Toggle Zen focus mode' },
                                    { key: 'S', desc: 'Open settings' },
                                    { key: 'P', desc: 'Play / Pause Pomodoro timer' },
                                    { key: 'Enter', desc: 'Submit new task / goal / shortcut' }
                                ].map((sc, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                                        <span className="text-white/80">{sc.desc}</span>
                                        <kbd className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-white font-bold">{sc.key}</kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 6. BACKUP & FACTORY RESET */}
                    {activeTab === 'backup' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 mb-2">Export & Import Config</h3>
                                <p className="text-[11px] text-white/50 mb-4">Export your theme settings, shortcuts, and preferences as JSON to easily sync between devices.</p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleExport}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-colors"
                                    >
                                        <Download size={14} /> {exportSuccess ? 'Downloaded!' : 'Export Backup JSON'}
                                    </button>

                                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white cursor-pointer transition-colors">
                                        <Upload size={14} /> Import Backup JSON
                                        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">Danger Zone</h3>
                                <p className="text-[11px] text-white/40 mb-3">Reset all local storage data, themes, tasks, and configurations back to pristine factory state.</p>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to reset all dashboard settings? This cannot be undone.')) {
                                            localStorage.clear();
                                            window.location.reload();
                                        }
                                    }}
                                    className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Reset to Factory Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(SettingsModal);