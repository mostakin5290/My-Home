import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Settings, X, Check, Maximize2, Minimize2, Mic, Sparkles, Flame } from 'lucide-react';

import ClockDisplay from './components/ClockDisplay';
import WeatherWidget from './components/WeatherWidget';
import TodoList from './components/TodoList';
import Pomodoro from './components/Pomodoro';
import SoundPlayer from './components/SoundPlayer';
import NotesWidget from './components/NotesWidget';
import SettingsModal from './components/SettingsModal';
import QuickLinks from './components/QuickLinks';
import ParticleBackground from './components/ParticleBackground';

// Hooks & Utils
import { useStickyState } from './hooks/useStickyState';
import { WALLPAPERS, ACCENTS, SEARCH_ENGINES } from './utils/constants';
import { soundEngine } from './utils/audioSynthesizer';

// --- MAIN APP ---
const App = () => {
  const [headerDate, setHeaderDate] = useState(() => new Date());
  const [isZenMode, setIsZenMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // CONFIG STATE
  const [config, setConfig] = useStickyState({
    name: 'User',
    wallpaper: WALLPAPERS.sequoiaDark,
    wallpaperType: 'image', // 'image' | 'color'
    customImage: '',
    clockTheme: 'modern',
    blur: 0,
    brightness: 0.3, // overlay opacity
    vignette: 0.15, // corner darkness
    accent: 'blue',
    widgets: { weather: true, todo: true, pomodoro: true, notes: true, sounds: true },
    permissions: { location: false },
    searchInNewTab: false,
    searchEngine: 'google'
  }, 'config_v7');

  // DATA STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [goal, setGoal] = useStickyState(null, 'daily_goal');
  const [newGoalInput, setNewGoalInput] = useState('');
  const [todos, setTodos] = useStickyState([
    { id: 1, text: 'Plan today’s top 3 priorities', completed: false },
    { id: 2, text: 'Take a 5-minute stretch break', completed: true }
  ], 'todos_v2');

  const [links, setLinks] = useStickyState([
    { id: 1, title: 'Google', url: 'https://google.com' },
    { id: 2, title: 'GitHub', url: 'https://github.com' },
    { id: 3, title: 'ChatGPT', url: 'https://chatgpt.com' },
    { id: 4, title: 'YouTube', url: 'https://youtube.com' }
  ], 'links_v2');

  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Update header date periodically (every 30s) instead of every 1s to prevent full-tree re-renders
  useEffect(() => {
    const t = setInterval(() => setHeaderDate(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Focus search on '/' key
      if (e.key === '/' && !isInput && !settingsOpen) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }

      // Escape to clear search or close settings
      if (e.key === 'Escape') {
        if (settingsOpen) {
          setSettingsOpen(false);
        } else if (searchInputRef.current === document.activeElement) {
          e.preventDefault();
          setSearchQuery('');
          searchInputRef.current.blur();
        }
      }

      // Toggle Zen mode on 'z' key when not typing
      if ((e.key === 'z' || e.key === 'Z') && !isInput && !settingsOpen && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsZenMode(prev => !prev);
      }

      // Toggle Settings on 's' key when not typing
      if ((e.key === 's' || e.key === 'S') && !isInput && !settingsOpen && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSettingsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settingsOpen]);

  // Search URL Generator
  const getSearchUrl = useCallback((query) => {
    const engineConfig = SEARCH_ENGINES[config.searchEngine] || SEARCH_ENGINES.google;
    return engineConfig.url(query);
  }, [config.searchEngine]);

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);

        setTimeout(() => {
          const searchUrl = getSearchUrl(transcript);
          if (config.searchInNewTab) {
            window.open(searchUrl, '_blank');
          } else {
            window.location.href = searchUrl;
          }
        }, 500);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [config.searchInNewTab, getSearchUrl]);

  const handleVoiceSearch = useCallback(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  }, [isListening]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = getSearchUrl(searchQuery.trim());
      if (config.searchInNewTab) {
        window.open(searchUrl, '_blank');
      } else {
        window.location.href = searchUrl;
      }
    }
  }, [searchQuery, config.searchInNewTab, getSearchUrl]);

  const toggleGoalCompletion = () => {
    if (!goal) return;
    const newCompleted = !goal.completed;
    if (newCompleted) {
      soundEngine.playChime('success');
    }
    setGoal({ ...goal, completed: newCompleted });
  };

  const handleCreateGoal = (e) => {
    if (e.key === 'Enter' && newGoalInput.trim()) {
      setGoal({ text: newGoalInput.trim(), completed: false });
      setNewGoalInput('');
    }
  };

  // Background styles for static image or color
  const backgroundStyles = useMemo(() => {
    const base = {
      transition: 'background-image 0.4s ease-in-out, background-color 0.4s ease-in-out',
    };
    if (config.wallpaperType === 'color') {
      return { ...base, backgroundColor: config.wallpaper || '#0a0a0a' };
    }
    if (config.wallpaperType === 'image') {
      const bgUrl = config.wallpaper || WALLPAPERS.sequoiaDark;
      return {
        ...base,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    return { ...base, backgroundColor: '#0a0a0c' };
  }, [config.wallpaper, config.wallpaperType]);

  const accentGradient = useMemo(() => ACCENTS[config.accent] || ACCENTS.blue, [config.accent]);

  return (
    <React.Suspense fallback={
      <div className="fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin mb-3"></div>
        <span className="text-xs font-mono text-white/50">Loading Home...</span>
      </div>
    }>
      <div className="relative h-screen w-screen overflow-hidden text-white font-sans selection:bg-white/30 select-none">

        {/* 1. BACKGROUND LAYERS */}
        {config.wallpaperType === 'image' || config.wallpaperType === 'color' ? (
          <div className="absolute inset-0 z-0" style={backgroundStyles}></div>
        ) : null}

        {/* Live Video Wallpaper */}
        {config.wallpaperType === 'video' || config.wallpaperType === 'live' ? (
          <video
            key={config.wallpaper}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700"
            src={config.wallpaper}
          />
        ) : null}

        {/* Live Interactive Particle Constellation */}
        {config.wallpaperType === 'particles' || config.wallpaperType === 'interactive' ? (
          <ParticleBackground accent={config.accent} />
        ) : null}

        {/* Overlay Dimming */}
        <div
          className="absolute inset-0 z-0 bg-black pointer-events-none transition-opacity duration-300"
          style={{ opacity: config.brightness }}
        ></div>

        {/* Vignette Gradient */}
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
          style={{ background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${config.vignette || 0.15}) 100%)` }}
        ></div>

        {/* Blur Filter */}
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
          style={{ backdropFilter: `blur(${config.blur}px)`, WebkitBackdropFilter: `blur(${config.blur}px)` }}
        ></div>

        {/* 2. HEADER */}
        <header className={`relative z-20 px-8 py-5 flex justify-between items-center transition-all duration-500 ${isZenMode ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">
              {headerDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="font-semibold text-lg tracking-tight">Hello, {config.name || 'Friend'}</span>
              {config.widgets?.weather && <WeatherWidget locationEnabled={config.permissions?.location} />}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsZenMode(!isZenMode)}
              className="btn-icon"
              title={isZenMode ? "Exit Zen Mode (Z)" : "Enter Zen Mode (Z)"}
            >
              {isZenMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-icon"
              title="Open Settings (S)"
            >
              <Settings size={17} />
            </button>
          </div>
        </header>

        {/* 3. MAIN DASHBOARD GRID */}
        <main className="relative z-10 h-[calc(100vh-90px)] grid grid-cols-12 gap-6 px-8 pb-6 items-center">

          {/* LEFT WIDGETS COLUMN */}
          {!isZenMode && (
            <div className="col-span-3 flex flex-col gap-4 animate-slide-right h-full justify-center overflow-y-auto custom-scrollbar pr-1 max-h-[85vh]">
              {config.widgets?.todo && <TodoList todos={todos} setTodos={setTodos} />}
              {config.widgets?.pomodoro && <Pomodoro accent={config.accent} />}
            </div>
          )}

          {/* CENTER FOCUS & CLOCK COLUMN */}
          <div className={`${isZenMode ? 'col-span-12' : 'col-span-6'} flex flex-col items-center justify-center transition-all duration-500`}>

            {/* Clock Face Display */}
            <div className="mb-8 scale-100 transition-transform duration-500 cursor-default">
              <ClockDisplay theme={config.clockTheme} accent={config.accent} />
            </div>

            {/* Omni Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-xl relative group z-30 mb-8">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${accentGradient} rounded-full blur-md opacity-20 group-hover:opacity-50 transition-opacity duration-500`}></div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search with ${SEARCH_ENGINES[config.searchEngine]?.name || 'Google'}... (Press /)`}
                className="relative w-full bg-white/10 border border-white/20 backdrop-blur-2xl rounded-full py-3.5 px-14 text-center text-lg focus:outline-none focus:bg-white/15 focus:border-white/35 transition-all placeholder-white/40 shadow-2xl text-white select-text font-medium"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-rose-500 animate-pulse' : 'text-white/40 hover:text-white'}`}
                title="Voice Search"
              >
                <Mic size={19} />
              </button>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 text-xs font-mono pointer-events-none bg-white/10 px-2 py-0.5 rounded-full">
                /
              </div>
            </form>

            {/* Daily Focus Goal */}
            <div className="w-full max-w-md">
              {!goal ? (
                <input
                  type="text"
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  onKeyDown={handleCreateGoal}
                  placeholder="What is your main focus today?"
                  className="bg-transparent border-b border-white/20 text-center text-lg py-2 w-full focus:outline-none focus:border-white/60 transition-all placeholder-white/30 animate-fade-in font-medium select-text"
                />
              ) : (
                <div className={`glass-panel p-1 rounded-2xl animate-pop-in ${goal.completed ? 'opacity-70 grayscale-[30%]' : ''}`}>
                  <div className="bg-white/10 rounded-xl px-5 py-3 flex items-center gap-3.5">
                    <button
                      onClick={toggleGoalCompletion}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${goal.completed ? 'bg-emerald-500 border-emerald-500 text-black shadow-sm' : 'border-white/40 hover:border-white'
                        }`}
                      title={goal.completed ? "Mark as in-progress" : "Mark as completed"}
                    >
                      {goal.completed && <Check size={14} strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-base font-semibold ${goal.completed ? 'line-through text-white/50' : 'text-white'}`}>
                      {goal.text}
                    </span>
                    <button
                      onClick={() => setGoal(null)}
                      className="text-white/30 hover:text-white transition-colors"
                      title="Clear focus"
                    >
                      <X size={17} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links Dock */}
            <QuickLinks links={links} setLinks={setLinks} isZenMode={isZenMode} />
          </div>

          {/* RIGHT WIDGETS COLUMN */}
          {!isZenMode && (
            <div className="col-span-3 flex flex-col gap-4 animate-slide-left h-full justify-center overflow-y-auto custom-scrollbar pl-1 max-h-[85vh]">
              {config.widgets?.sounds && <SoundPlayer accent={config.accent} />}
              {config.widgets?.notes && <NotesWidget />}
            </div>
          )}
        </main>

        {/* --- SETTINGS MODAL --- */}
        <SettingsModal
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          config={config}
          setConfig={setConfig}
        />

        {/* --- GLOBAL COMPONENT STYLES --- */}
        <style>{`
        .glass-panel {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(15, 15, 20, 0.45) 100%);
          backdrop-filter: blur(36px) saturate(190%);
          -webkit-backdrop-filter: blur(36px) saturate(190%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.95);
        }
        .btn-icon {
          padding: 0.65rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .btn-icon:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          transform: scale(1.05);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .animate-slide-right { animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-left { animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
      </div>
    </React.Suspense>
  );
};

export default App;