import React, { useState } from 'react';
import {
    Sliders, ChevronRight, Clock, ImageIcon, Palette,
    X, Download, Upload, Keyboard, Shield, Search, Sparkles
} from 'lucide-react';
import { CLOCK_THEMES, WALLPAPERS, SOLID_COLORS, ACCENTS, SEARCH_ENGINES } from '../utils/constants';

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
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in select-none"
            onClick={() => setSettingsOpen(false)}
        >
            <div
                className="w-full max-w-5xl h-[85vh] rounded-[30px] flex flex-col md:flex-row overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.6)] relative border border-white/20"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(20, 20, 25, 0.6) 100%)',
                    backdropFilter: 'blur(40px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(190%)',
                    boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button Top-Right */}
                <button
                    onClick={() => setSettingsOpen(false)}
                    className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                    title="Close settings (Esc)"
                >
                    <X size={18} />
                </button>

                {/* Sidebar */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-6 bg-white/[0.02] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2.5 mb-6 px-2">
                            <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-white">
                                <Sliders size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white leading-tight">Preferences</h2>
                                <span className="text-[10px] font-mono text-white/40">Custom Home v3.0</span>
                            </div>
                        </div>

                        <nav className="flex md:flex-col gap-1.5 overflow-x-auto">
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
                                        className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between gap-3 shrink-0 ${isActive
                                            ? 'bg-white/15 text-white border border-white/10 shadow-sm'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon size={15} className={isActive ? 'text-white' : 'text-white/40'} />
                                            <span>{tab.label}</span>
                                        </div>
                                        <ChevronRight size={13} className={`hidden md:block transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
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
                <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-neutral-950/40">
                    {/* 1. VISUALS: Clock Themes & Accents */}
                    {activeTab === 'visuals' && (
                        <div className="space-y-8 animate-fade-in">
                            {/* Accent Palette */}
                            <section>
                                <h3 className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-white/70">
                                    <Palette size={14} /> UI Accent Color
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.keys(ACCENTS).map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, accent: color })}
                                            className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${config.accent === color
                                                ? 'bg-white/15 border-white/40 text-white shadow-md'
                                                : 'bg-white/5 border-white/5 text-white/50 hover:border-white/20 hover:text-white'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${ACCENTS[color]} shadow-sm`}></div>
                                            <span className="capitalize text-xs font-medium">{color}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Clock Face Selection */}
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
                                        <Clock size={14} /> Clock Faces (17 Unique Styles)
                                    </h3>
                                    <span className="text-[10px] font-mono text-white/40">Active: {CLOCK_THEMES[config.clockTheme]?.name || 'Modern Sans'}</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {Object.values(CLOCK_THEMES).map(theme => {
                                        const Icon = theme.icon;
                                        const isSelected = config.clockTheme === theme.id;
                                        return (
                                            <button
                                                key={theme.id}
                                                onClick={() => setConfig({ ...config, clockTheme: theme.id })}
                                                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[90px] ${isSelected
                                                    ? 'bg-gradient-to-br from-white/20 to-white/5 border-white/40 text-white shadow-lg scale-[1.02]'
                                                    : 'border-white/5 bg-white/[0.02] text-white/50 hover:border-white/20 hover:bg-white/5 hover:text-white'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between w-full mb-2">
                                                    <Icon size={20} className={isSelected ? 'text-white' : 'text-white/40'} />
                                                    {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-xs block text-white">{theme.name}</span>
                                                    <span className="text-[10px] text-white/40 line-clamp-1 leading-tight">{theme.description}</span>
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
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex gap-4 border-b border-white/10 pb-2">
                                <button
                                    onClick={() => setConfig({ ...config, wallpaperType: 'image' })}
                                    className={`text-xs font-bold pb-1 transition-colors ${config.wallpaperType === 'image' ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
                                >
                                    HD Wallpapers
                                </button>
                                <button
                                    onClick={() => setConfig({ ...config, wallpaperType: 'color' })}
                                    className={`text-xs font-bold pb-1 transition-colors ${config.wallpaperType === 'color' ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white'}`}
                                >
                                    Solid Tones
                                </button>
                            </div>

                            {config.wallpaperType === 'image' ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {Object.entries(WALLPAPERS).map(([key, url]) => (
                                            <button
                                                key={key}
                                                onClick={() => setConfig({ ...config, wallpaper: url, wallpaperType: 'image' })}
                                                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${config.wallpaper === url
                                                    ? 'border-white ring-2 ring-white/30 scale-[1.03] shadow-xl'
                                                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'
                                                    }`}
                                            >
                                                <img src={url} className="w-full h-full object-cover" alt={key} loading="lazy" />
                                                <span className="absolute bottom-1.5 left-2 text-[10px] font-mono capitalize text-white drop-shadow-md bg-black/50 px-1.5 py-0.5 rounded">
                                                    {key}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom URL Input */}
                                    <div className="pt-2">
                                        <label className="text-xs font-semibold text-white/60 mb-1.5 block">Custom Image URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="https://images.unsplash.com/..."
                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                                                value={config.customImage || ''}
                                                onChange={(e) => setConfig({ ...config, customImage: e.target.value })}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (config.customImage) {
                                                        setConfig({ ...config, wallpaper: config.customImage, wallpaperType: 'image' });
                                                    }
                                                }}
                                                className="px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-xl text-xs font-bold transition-all"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
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