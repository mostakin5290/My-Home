import React from 'react';
import {
    Sliders, ChevronRight, Clock, ImageIcon,
    Link as LinkIcon, Palette, Hash
} from 'lucide-react';
import { CLOCK_THEMES, WALLPAPERS, SOLID_COLORS, ACCENTS } from '../utils/constants';
import ClockDisplay from './ClockDisplay';

const SettingsModal = ({ settingsOpen, setSettingsOpen, config, setConfig }) => {
    const [activeTab, setActiveTab] = React.useState('visuals');

    if (!settingsOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSettingsOpen(false)}
        >
            <div
                className="glass-panel bg-[#111] border border-white/10 w-full max-w-6xl min-w-[1000px] h-[85vh] rounded-3xl flex overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Sidebar */}
                <div className="w-72 border-r border-white/10 p-6 bg-white/5 flex flex-col gap-1">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 px-2 text-white">
                        <Sliders size={20} /> Settings
                    </h2>
                    {['visuals', 'widgets', 'preferences', 'general'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-left px-4 py-3 rounded-xl capitalize font-medium transition-all flex justify-between items-center ${activeTab === tab
                                ? 'bg-white/10 text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab} <ChevronRight size={14} className={activeTab === tab ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#080808]">
                    {activeTab === 'visuals' && (
                        <div className="space-y-8 animate-fade-in">

                            {/* Clock Style Selector */}
                            <section>
                                <h3 className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/70 uppercase tracking-wider">
                                    <Clock size={14} /> Clock Face
                                </h3>
                                <div className="grid grid-cols-5 gap-3">
                                    {Object.values(CLOCK_THEMES).map(theme => {
                                        const Icon = theme.icon;
                                        return (
                                            <button
                                                key={theme.id}
                                                onClick={() => setConfig({ ...config, clockTheme: theme.id })}
                                                className={`group relative py-4 px-3 rounded-xl border text-sm transition-all duration-200 ${config.clockTheme === theme.id
                                                    ? `bg-gradient-to-br ${ACCENTS[config.accent]} text-white border-white/40 shadow-lg transform scale-[1.02]`
                                                    : 'border-white/10 text-white/50 hover:border-white/30 hover:bg-white/5'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Icon size={24} className={config.clockTheme === theme.id ? 'text-white' : 'text-white/40'} />
                                                    <span className="font-medium text-[11px] leading-tight text-center">{theme.name}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Background Selector */}
                            <section>
                                <h3 className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/70 uppercase tracking-wider">
                                    <ImageIcon size={14} /> Background
                                </h3>

                                <div className="flex gap-4 mb-4 text-sm border-b border-white/10 pb-2">
                                    <button
                                        onClick={() => setConfig({ ...config, wallpaperType: 'image' })}
                                        className={`pb-1 px-2 ${config.wallpaperType === 'image' ? 'text-white font-bold border-b-2 border-white' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        Image
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, wallpaperType: 'color' })}
                                        className={`pb-1 px-2 ${config.wallpaperType === 'color' ? 'text-white font-bold border-b-2 border-white' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        Solid Color
                                    </button>
                                </div>

                                {config.wallpaperType === 'image' ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-6 gap-2">
                                            {Object.values(WALLPAPERS).map((url, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setConfig({ ...config, wallpaper: url, wallpaperType: 'image' })}
                                                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${config.wallpaper === url
                                                        ? `border-white shadow-xl scale-105`
                                                        : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                                                        }`}
                                                >
                                                    <img src={url} className="w-full h-full object-cover" alt="bg" />
                                                </button>
                                            ))}
                                        </div>
                                        {/* Custom URL Input */}
                                        <div className="flex gap-2">
                                            <div className="bg-white/5 border border-white/10 rounded-lg flex items-center px-3 flex-1 focus-within:border-white/30 transition-colors">
                                                <LinkIcon size={14} className="text-white/30 mr-2" />
                                                <input
                                                    type="text"
                                                    placeholder="Paste Image URL..."
                                                    className="bg-transparent py-2.5 w-full text-xs focus:outline-none text-white placeholder:text-white/20"
                                                    value={config.customImage || ''}
                                                    onChange={(e) => setConfig({ ...config, customImage: e.target.value })}
                                                    onBlur={() => { if (config.customImage) setConfig({ ...config, wallpaper: config.customImage, wallpaperType: 'image' }) }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => config.customImage && setConfig({ ...config, wallpaper: config.customImage, wallpaperType: 'image' })}
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
                                            >
                                                Set URL
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-12 gap-3">
                                            {SOLID_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setConfig({ ...config, wallpaper: color, wallpaperType: 'color' })}
                                                    className={`w-8 h-8 rounded-full shadow-lg transition-transform ${config.wallpaper === color
                                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                                                        : 'hover:scale-110'
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                ></button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Accent Color */}
                            <section>
                                <h3 className="flex items-center gap-2 mb-4 text-sm font-semibold text-white/70 uppercase tracking-wider">
                                    <Palette size={14} /> UI Accent
                                </h3>
                                <div className="flex gap-4">
                                    {Object.keys(ACCENTS).map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, accent: color })}
                                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${ACCENTS[color]} transition-all shadow-lg ${config.accent === color
                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110'
                                                : 'opacity-70 hover:opacity-100 hover:scale-110'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* Sliders */}
                            <section className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs mb-2 text-white/50 font-medium">
                                        <span>Background Dim</span>
                                        <span>{Math.round(config.brightness * 100)}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="0.9" step="0.05"
                                        value={config.brightness}
                                        onChange={(e) => setConfig({ ...config, brightness: parseFloat(e.target.value) })}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-gray-200"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2 text-white/50 font-medium">
                                        <span>Blur Amount</span>
                                        <span>{config.blur}px</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="20" step="1"
                                        value={config.blur}
                                        onChange={(e) => setConfig({ ...config, blur: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-gray-200"
                                    />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'widgets' && (
                        <div className="grid grid-cols-3 gap-4 animate-fade-in text-white">
                            {Object.keys(config.widgets).map(w => (
                                <div
                                    key={w}
                                    onClick={() => setConfig({ ...config, widgets: { ...config.widgets, [w]: !config.widgets[w] } })}
                                    className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${config.widgets[w]
                                        ? 'bg-white/10 border-white/40 shadow-lg'
                                        : 'bg-transparent border-white/10 opacity-50 hover:bg-white/5'
                                        }`}
                                >
                                    <span className="capitalize font-medium">{w}</span>
                                    <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${config.widgets[w] ? 'bg-green-500' : 'bg-white/20'
                                        }`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${config.widgets[w] ? 'left-6' : 'left-1'
                                            }`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6 animate-fade-in">
                            <section>
                                <h3 className="text-white/70 text-sm font-bold uppercase mb-4">Permissions</h3>
                                <div className="space-y-3">
                                    <div
                                        onClick={() => setConfig({
                                            ...config,
                                            permissions: {
                                                ...(config.permissions || {}),
                                                location: !(config.permissions?.location)
                                            }
                                        })}
                                        className="p-4 rounded-xl border border-white/10 cursor-pointer flex justify-between items-center transition-all hover:bg-white/5"
                                    >
                                        <div>
                                            <div className="text-white font-medium">Location Access</div>
                                            <div className="text-white/50 text-xs mt-1">Allow location for weather widget</div>
                                        </div>
                                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${config.permissions?.location ? 'bg-green-500' : 'bg-white/20'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${config.permissions?.location ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-white/70 text-sm font-bold uppercase mb-4">Search Behavior</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-white/60 text-xs mb-2 block">Search Engine</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['google', 'bing', 'duckduckgo', 'yahoo'].map(engine => (
                                                <button
                                                    key={engine}
                                                    onClick={() => setConfig({ ...config, searchEngine: engine })}
                                                    className={`py-2 px-3 rounded-lg border capitalize text-sm transition-all ${(config.searchEngine || 'google') === engine
                                                        ? 'bg-white/20 border-white/40 text-white'
                                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {engine === 'duckduckgo' ? 'DuckDuckGo' : engine}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div
                                        onClick={() => setConfig({ ...config, searchInNewTab: !config.searchInNewTab })}
                                        className="p-4 rounded-xl border border-white/10 cursor-pointer flex justify-between items-center transition-all hover:bg-white/5"
                                    >
                                        <div>
                                            <div className="text-white font-medium">Open in New Tab</div>
                                            <div className="text-white/50 text-xs mt-1">Search results open in new tab</div>
                                        </div>
                                        <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${config.searchInNewTab ? 'bg-green-500' : 'bg-white/20'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${config.searchInNewTab ? 'left-6' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="animate-fade-in">
                            <h3 className="text-white/70 text-sm font-bold uppercase mb-4">User Profile</h3>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={config.name}
                                onChange={e => setConfig({ ...config, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 text-white transition-colors"
                            />
                            <div className="mt-8 border-t border-white/10 pt-6">
                                <button
                                    className="text-red-400 text-xs font-medium hover:text-red-300 transition-colors"
                                    onClick={() => { if (window.confirm('Reset all settings?')) { localStorage.clear(); window.location.reload(); } }}
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

export default SettingsModal;