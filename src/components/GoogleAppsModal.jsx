import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MoreHorizontal, Sparkles, ExternalLink } from 'lucide-react';

// Crisp SVG Icons for Google Workspace & macOS Launchpad apps
const AppIcon = ({ type, name }) => {
    switch (type) {
        case 'search':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                </div>
            );
        case 'gemini':
            return (
                <div className="w-full h-full rounded-[22%] bg-gradient-to-br from-[#1b1a55] via-[#535c91] to-[#070f2b] p-2 flex items-center justify-center shadow-md border border-indigo-400/30">
                    <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#geminiGrad)" />
                        <defs>
                            <linearGradient id="geminiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#91d7ff" />
                                <stop offset="0.5" stopColor="#c084fc" />
                                <stop offset="1" stopColor="#ff7b92" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            );
        case 'gmail':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M1.5 19.5h4v-11l-4 3v8z" />
                        <path fill="#34A853" d="M18.5 19.5h4v-8l-4-3v11z" />
                        <path fill="#EA4335" d="M18.5 4.5l-6.5 4.9-6.5-4.9c-1.8-1.3-4 0-4 2.2v1.8l10.5 7.9 10.5-7.9V6.7c0-2.2-2.2-3.5-4-2.2z" />
                        <path fill="#FBBC04" d="M1.5 6.7v1.9l4-3-1.6-1.2c-1.4-1.1-2.4-.1-2.4 2.3z" />
                        <path fill="#C5221F" d="M22.5 6.7v1.9l-4-3 1.6-1.2c1.4-1.1 2.4-.1 2.4 2.3z" />
                    </svg>
                </div>
            );
        case 'youtube':
            return (
                <div className="w-full h-full rounded-[22%] bg-[#FF0000] flex items-center justify-center shadow-md">
                    <svg className="w-9 h-9" viewBox="0 0 24 24" fill="white">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                </div>
            );
        case 'drive':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#FFC107" d="M8.2 2.5L1.5 14h5.2l6.7-11.5z" />
                        <path fill="#4CAF50" d="M15.8 2.5H8.2L14.9 14h7.6z" />
                        <path fill="#2196F3" d="M14.9 14H1.5l3.8 6.5h15.2z" />
                    </svg>
                </div>
            );
        case 'calendar':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex flex-col items-center justify-center shadow-md overflow-hidden border border-neutral-200">
                    <div className="w-full bg-[#1a73e8] text-[9px] font-bold text-white uppercase text-center py-0.5">
                        {new Date().toLocaleString('en-US', { month: 'short' })}
                    </div>
                    <div className="flex-1 flex items-center justify-center text-neutral-800 font-bold text-lg font-mono">
                        {new Date().getDate()}
                    </div>
                </div>
            );
        case 'maps':
            return (
                <div className="w-full h-full rounded-[22%] bg-[#4285F4] flex items-center justify-center shadow-md overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#34A853] via-[#FBBC04] to-[#4285F4] opacity-80"></div>
                    <svg className="w-7 h-7 relative z-10 drop-shadow-md" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                </div>
            );
        case 'photos':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 6.5a5.5 5.5 0 0 1 5.5 5.5h-5.5V6.5z" />
                        <path fill="#4285F4" d="M6.5 12a5.5 5.5 0 0 1 5.5-5.5V12H6.5z" />
                        <path fill="#34A853" d="M12 17.5A5.5 5.5 0 0 1 6.5 12H12v5.5z" />
                        <path fill="#FBBC04" d="M17.5 12a5.5 5.5 0 0 1-5.5 5.5V12h5.5z" />
                    </svg>
                </div>
            );
        case 'meet':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#00832d" d="M15 12l4.5 3.5V8.5L15 12z" />
                        <path fill="#0066da" d="M3.5 6.5h8v11h-8z" />
                        <path fill="#e53935" d="M11.5 6.5h3.5v5h-3.5z" />
                        <path fill="#ffb700" d="M11.5 12.5h3.5v5h-3.5z" />
                    </svg>
                </div>
            );
        case 'docs':
            return (
                <div className="w-full h-full rounded-[22%] bg-[#4285F4] p-2 flex flex-col justify-between shadow-md">
                    <div className="w-full h-1.5 bg-white/90 rounded-full"></div>
                    <div className="w-3/4 h-1.5 bg-white/70 rounded-full"></div>
                    <div className="w-full h-1.5 bg-white/70 rounded-full"></div>
                    <div className="w-1/2 h-1.5 bg-white/70 rounded-full"></div>
                </div>
            );
        case 'sheets':
            return (
                <div className="w-full h-full rounded-[22%] bg-[#0F9D58] p-2 flex flex-col justify-center shadow-md">
                    <div className="grid grid-cols-2 gap-1 h-full w-full">
                        <div className="bg-white/90 rounded-xs"></div>
                        <div className="bg-white/70 rounded-xs"></div>
                        <div className="bg-white/70 rounded-xs"></div>
                        <div className="bg-white/90 rounded-xs"></div>
                    </div>
                </div>
            );
        case 'slides':
            return (
                <div className="w-full h-full rounded-[22%] bg-[#F4B400] p-2.5 flex items-center justify-center shadow-md">
                    <div className="w-full h-full border-2 border-white/90 rounded-sm flex items-center justify-center bg-white/15">
                        <div className="w-3 h-2 bg-white rounded-xs"></div>
                    </div>
                </div>
            );
        case 'keep':
            return (
                <div className="w-full h-full rounded-[22%] bg-[#FBBC04] flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
                    </svg>
                </div>
            );
        case 'translate':
            return (
                <div className="w-full h-full rounded-[22%] bg-gradient-to-br from-[#4285F4] to-[#1a73e8] flex items-center justify-center shadow-md">
                    <span className="text-white font-serif font-bold text-xl">文A</span>
                </div>
            );
        case 'news':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex flex-col items-center justify-center shadow-md p-2">
                    <div className="w-full h-2.5 bg-[#4285F4] rounded-xs mb-1"></div>
                    <div className="w-full h-1 bg-neutral-400 rounded-full mb-0.5"></div>
                    <div className="w-full h-1 bg-neutral-300 rounded-full"></div>
                </div>
            );
        case 'contacts':
            return (
                <div className="w-full h-full rounded-[22%] bg-gradient-to-br from-[#1a73e8] to-[#4285F4] flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
            );
        case 'play':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M3.6 1.8L14.2 12.4 3.6 23z" />
                        <path fill="#00E676" d="M14.2 12.4L17.8 8.8l-14.2-7z" />
                        <path fill="#FF1744" d="M17.8 16l-3.6-3.6L3.6 23z" />
                        <path fill="#FFEA00" d="M21.4 12.4l-3.6 3.6-3.6-3.6 3.6-3.6z" />
                    </svg>
                </div>
            );
        case 'chrome':
            return (
                <div className="w-full h-full rounded-[22%] bg-white flex items-center justify-center shadow-md overflow-hidden">
                    <svg className="w-9 h-9" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="#4285F4" />
                        <path fill="#EA4335" d="M12 2a10 10 0 0 0-8.66 5l4.33 7.5L12 6.5h8.66A10 10 0 0 0 12 2z" />
                        <path fill="#FBBC04" d="M20.66 6.5H12l-4.33 7.5L3.34 7A10 10 0 0 0 12 22l4.33-7.5h4.33z" />
                        <path fill="#34A853" d="M12 22a10 10 0 0 0 8.66-5.5L16.33 9h-4.33L7.67 16.5 12 22z" />
                        <circle cx="12" cy="12" r="4.5" fill="white" />
                        <circle cx="12" cy="12" r="3.5" fill="#4285F4" />
                    </svg>
                </div>
            );
        case 'cloud':
            return (
                <div className="w-full h-full rounded-[22%] bg-[#1a73e8] flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
                    </svg>
                </div>
            );
        case 'colab':
            return (
                <div className="w-full h-full rounded-[22%] bg-neutral-900 border border-amber-500/40 flex items-center justify-center shadow-md">
                    <span className="text-amber-400 font-black text-lg font-mono">co</span>
                </div>
            );
        default:
            return (
                <div className="w-full h-full rounded-[22%] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md text-white font-bold text-lg">
                    {name?.charAt(0) || 'G'}
                </div>
            );
    }
};

const GOOGLE_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'communication', label: 'Communication' },
    { id: 'media', label: 'Entertainment' },
    { id: 'ai_dev', label: 'AI & Developer' },
    { id: 'utilities', label: 'Utilities' },
];

const GOOGLE_APPS = [
    // Top Core
    { id: 'search', name: 'Google Search', category: 'utilities', type: 'search', url: 'https://www.google.com' },
    { id: 'gemini', name: 'Gemini AI', category: 'ai_dev', type: 'gemini', url: 'https://gemini.google.com' },
    { id: 'chrome', name: 'Chrome', category: 'utilities', type: 'chrome', url: 'https://www.google.com/chrome' },
    { id: 'gmail', name: 'Gmail', category: 'communication', type: 'gmail', url: 'https://mail.google.com' },
    { id: 'youtube', name: 'YouTube', category: 'media', type: 'youtube', url: 'https://www.youtube.com' },
    { id: 'drive', name: 'Drive', category: 'productivity', type: 'drive', url: 'https://drive.google.com' },

    // Productivity & Work
    { id: 'calendar', name: 'Calendar', category: 'productivity', type: 'calendar', url: 'https://calendar.google.com' },
    { id: 'docs', name: 'Docs', category: 'productivity', type: 'docs', url: 'https://docs.google.com' },
    { id: 'sheets', name: 'Sheets', category: 'productivity', type: 'sheets', url: 'https://sheets.google.com' },
    { id: 'slides', name: 'Slides', category: 'productivity', type: 'slides', url: 'https://slides.google.com' },
    { id: 'keep', name: 'Keep Notes', category: 'productivity', type: 'keep', url: 'https://keep.google.com' },

    // Communication & Media
    { id: 'meet', name: 'Meet', category: 'communication', type: 'meet', url: 'https://meet.google.com' },
    { id: 'contacts', name: 'Contacts', category: 'communication', type: 'contacts', url: 'https://contacts.google.com' },
    { id: 'photos', name: 'Photos', category: 'media', type: 'photos', url: 'https://photos.google.com' },
    { id: 'maps', name: 'Maps', category: 'utilities', type: 'maps', url: 'https://maps.google.com' },

    // AI, Developer & Utilities
    { id: 'translate', name: 'Translate', category: 'utilities', type: 'translate', url: 'https://translate.google.com' },
    { id: 'news', name: 'News', category: 'utilities', type: 'news', url: 'https://news.google.com' },
    { id: 'play', name: 'Play Store', category: 'media', type: 'play', url: 'https://play.google.com' },
    { id: 'colab', name: 'Colab', category: 'ai_dev', type: 'colab', url: 'https://colab.research.google.com' },
    { id: 'cloud', name: 'Cloud Console', category: 'ai_dev', type: 'cloud', url: 'https://console.cloud.google.com' },
];

const GoogleAppsModal = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState('');
    const [activeCat, setActiveCat] = useState('all');
    const modalRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filteredApps = GOOGLE_APPS.filter(app => {
        const matchesCategory = activeCat === 'all' || app.category === activeCat;
        const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in select-none"
            onClick={onClose}
        >
            {/* macOS Translucent Glass Dark Launchpad Container Window */}
            <div
                ref={modalRef}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-4xl bg-black/40 backdrop-blur-3xl saturate-150 border border-white/20 rounded-[30px] p-6 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.6)] flex flex-col max-h-[88vh] animate-pop-in relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(20, 20, 25, 0.55) 100%)',
                    backdropFilter: 'blur(40px) saturate(190%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(190%)',
                    boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)'
                }}
            >
                {/* Subtle Glass Surface Glow */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/15 to-transparent pointer-events-none"></div>
                {/* 1. macOS Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        {/* macOS Window Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onClose}
                                className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-90 transition-all flex items-center justify-center group"
                            >
                                <X size={7} className="text-[#4c0000] opacity-0 group-hover:opacity-100" />
                            </button>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                        </div>

                        {/* Title */}
                        <div className="flex items-center gap-2 ml-2">
                            {/* App Store / Applications Glyph */}
                            <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" opacity="0.2"/>
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.45c.66-.82 1.11-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.61.71-1.15 1.87-1.01 2.98 1.08.08 2.18-.51 2.84-1.33z"/>
                            </svg>
                            <h2 className="text-lg font-semibold text-white tracking-tight">Applications</h2>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search apps..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                autoFocus
                                className="w-48 bg-white/10 border border-white/10 rounded-full pl-8 pr-3 py-1 text-xs text-white placeholder-white/40 focus:outline-none focus:w-64 focus:bg-white/15 focus:border-white/30 transition-all font-sans"
                            />
                        </div>
                        <a
                            href="https://about.google/products/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            title="More Google Products"
                        >
                            <MoreHorizontal size={17} />
                        </a>
                    </div>
                </div>

                {/* 2. macOS Category Filter Pills */}
                <div className="flex items-center gap-1.5 py-3.5 overflow-x-auto custom-scrollbar shrink-0">
                    {GOOGLE_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCat(cat.id)}
                            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${activeCat === cat.id
                                ? 'bg-white/20 text-white shadow-sm border border-white/20'
                                : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* 3. macOS App Squircle Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-y-6 gap-x-3 py-4 overflow-y-auto custom-scrollbar flex-1 items-start">
                    {filteredApps.map(app => (
                        <a
                            key={app.id}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="group flex flex-col items-center justify-start text-center cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
                        >
                            {/* macOS Continuous Corner Squircle Icon */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[22%] transition-all group-hover:scale-105 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)] p-0.5">
                                <AppIcon type={app.type} name={app.name} />
                            </div>

                            {/* Label */}
                            <span className="text-[11px] font-medium text-white/90 group-hover:text-white text-center tracking-tight leading-tight mt-1.5 max-w-[80px] truncate drop-shadow-sm">
                                {app.name}
                            </span>
                        </a>
                    ))}

                    {filteredApps.length === 0 && (
                        <div className="col-span-full py-16 text-center text-xs text-white/40 font-sans">
                            No application found matching "{search}"
                        </div>
                    )}
                </div>

                {/* 4. Bottom Launchpad Status */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-sans">
                    <span>macOS Sequoia · Google Apps Launchpad</span>
                    <span>{filteredApps.length} Apps</span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(GoogleAppsModal);
