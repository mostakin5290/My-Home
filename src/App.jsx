import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Settings, X, Check, Maximize2, Minimize2, Mic } from 'lucide-react';

// Components - Lazy load for better performance
const ClockDisplay = React.lazy(() => import('./components/ClockDisplay'));
const WeatherWidget = React.lazy(() => import('./components/WeatherWidget'));
const TodoList = React.lazy(() => import('./components/TodoList'));
const Pomodoro = React.lazy(() => import('./components/Pomodoro'));
const SoundPlayer = React.lazy(() => import('./components/SoundPlayer'));
const NotesWidget = React.lazy(() => import('./components/NotesWidget'));
const SettingsModal = React.lazy(() => import('./components/SettingsModal'));
const QuickLinks = React.lazy(() => import('./components/QuickLinks'));

// Hooks & Utils
import { useStickyState } from './hooks/useStickyState';
import { WALLPAPERS, ACCENTS } from './utils/constants';

// --- MAIN APP ---
const App = () => {
  const [time, setTime] = useState(new Date());
  const [isZenMode, setIsZenMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // CONFIG STATE
  const [config, setConfig] = useStickyState({
    name: 'User',
    wallpaper: WALLPAPERS.mountains,
    wallpaperType: 'image', // 'image' | 'color'
    customImage: '',
    clockTheme: 'modern',
    blur: 0,
    brightness: 0.4, // overlay opacity
    vignette: 0, // corner darkness
    accent: 'blue',
    widgets: { weather: true, todo: true, pomodoro: true, notes: true, sounds: true, quote: true },
    permissions: { location: false }, // Location permission for weather
    searchInNewTab: false, // Open search results in new tab
    searchEngine: 'google' // google, bing, duckduckgo, yahoo
  }, 'config_v5');

  // DATA STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [goal, setGoal] = useStickyState(null, 'goal');
  const [newGoalInput, setNewGoalInput] = useState('');
  const [todos, setTodos] = useStickyState([], 'todos');
  const [links, setLinks] = useStickyState([{ id: 1, title: 'Google', url: 'https://google.com' }], 'links');
  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Clock Tick - Optimized to update only when needed
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search on '/' key
      if (e.key === '/') {
        const target = e.target;
        // Only trigger if not already in an input/textarea
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !settingsOpen) {
          e.preventDefault();
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.select();
          }
        }
      }
      // Escape to clear search
      if (e.key === 'Escape') {
        if (searchInputRef.current === document.activeElement) {
          e.preventDefault();
          setSearchQuery('');
          searchInputRef.current.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settingsOpen]);

  // Get search URL based on engine - Define before voice recognition setup
  const getSearchUrl = useCallback((query) => {
    const encodedQuery = encodeURIComponent(query);
    const engines = {
      google: `https://www.google.com/search?q=${encodedQuery}`,
      bing: `https://www.bing.com/search?q=${encodedQuery}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodedQuery}`,
      yahoo: `https://search.yahoo.com/search?p=${encodedQuery}`
    };
    return engines[config.searchEngine] || engines.google;
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

        // Automatically search after voice input
        setTimeout(() => {
          const searchUrl = getSearchUrl(transcript);
          if (config.searchInNewTab) {
            window.open(searchUrl, '_blank');
          } else {
            window.location.href = searchUrl;
          }
        }, 500); // Small delay to show the query
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [config.searchInNewTab, getSearchUrl]);

  // Start voice recognition
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

  // Memoized handlers for better performance
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery) {
      const searchUrl = getSearchUrl(searchQuery);
      if (config.searchInNewTab) {
        window.open(searchUrl, '_blank');
      } else {
        window.location.href = searchUrl;
      }
    }
  }, [searchQuery, config.searchInNewTab, getSearchUrl]);

  // Memoize background styles
  const backgroundStyles = useMemo(() => {
    const base = {
      transition: 'all 0.5s ease-in-out',
    };
    if (config.wallpaperType === 'color') {
      return { ...base, backgroundColor: config.wallpaper };
    }
    return {
      ...base,
      backgroundImage: `url(${config.wallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }, [config.wallpaper, config.wallpaperType]);

  const accentGradient = useMemo(() => ACCENTS[config.accent] || ACCENTS.blue, [config.accent]);

  return (
    <React.Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center text-white">Loading...</div>}>
      <div className={`relative h-screen w-screen overflow-hidden text-white font-sans selection:bg-white/30`}>

        {/* 1. BACKGROUND LAYERS */}
        <div className="absolute inset-0 z-0" style={backgroundStyles}></div>
        {/* Flat Overlay (Brightness) */}
        <div className="absolute inset-0 z-0 bg-black pointer-events-none transition-opacity duration-300" style={{ opacity: config.brightness }}></div>
        {/* Vignette (Corner Darkness) */}
        <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-300"
          style={{ background: `radial-gradient(circle, transparent 50%, rgba(0,0,0,${config.vignette}) 100%)` }}></div>
        {/* Blur */}
        <div className="absolute inset-0 z-0 backdrop-blur-sm pointer-events-none transition-all duration-300"
          style={{ backdropFilter: `blur(${config.blur}px)`, WebkitBackdropFilter: `blur(${config.blur}px)` }}></div>

        {/* 2. HEADER */}
        <header className={`relative z-20 p-6 flex justify-between items-center transition-all duration-500 ${isZenMode ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">{time.toLocaleDateString(undefined, { weekday: 'long' })}</span>
            <div className="flex items-center gap-3">
              <span className="font-medium text-lg">Hello, {config.name}</span>
              {config.widgets.weather && <WeatherWidget locationEnabled={config.permissions?.location} />}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsZenMode(!isZenMode)} className="btn-icon">{isZenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
            <button onClick={() => setSettingsOpen(true)} className="btn-icon"><Settings size={18} /></button>
          </div>
        </header>

        {/* 3. MAIN GRID */}
        <main className="relative z-10 h-full grid grid-cols-12 gap-8 p-8 pt-2 min-w-[1200px]">

          {/* LEFT COLUMN */}
          {!isZenMode && (
            <div className="col-span-3 flex flex-col gap-5 animate-slide-right h-[85vh] overflow-y-auto custom-scrollbar pb-10">
              {config.widgets.todo && <TodoList todos={todos} setTodos={setTodos} />}
              {config.widgets.pomodoro && <Pomodoro accent={config.accent} />}
            </div>
          )}

          {/* CENTER COLUMN (Clock & Focus) */}
          <div className={`${isZenMode ? 'col-span-12' : 'col-span-6'} flex flex-col items-center justify-center -mt-70`}>

            <div className="mb-16 scale-100 transition-transform duration-500 cursor-default">
              <ClockDisplay time={time} theme={config.clockTheme} accent={config.accent} />
            </div>

            <form onSubmit={handleSearch} className="w-full max-w-lg relative group z-30 mb-12">
              <div className={`absolute inset-0 bg-gradient-to-r ${accentGradient} rounded-full blur opacity-10 group-hover:opacity-30 transition-opacity duration-500`}></div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search... (Press / to focus)"
                className="relative w-full bg-white/10 border border-white/15 backdrop-blur-xl rounded-full py-4 px-16 text-center text-xl focus:outline-none focus:bg-white/15 focus:border-white/25 transition-all placeholder-white/30 shadow-2xl text-white"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-white/40 hover:text-white'}`}
                title="Voice search"
              >
                <Mic size={20} />
              </button>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 text-sm font-mono pointer-events-none">
                /
              </div>
            </form>

            <div className="w-full max-w-md">
              {!goal ? (
                <input type="text" value={newGoalInput} onChange={(e) => setNewGoalInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setNewGoalInput(e.target.value) && setGoal({ text: newGoalInput, completed: false })}
                  placeholder="What is your main focus?" className="bg-transparent border-b border-white/10 text-center text-xl py-2 w-full focus:outline-none focus:border-white/50 transition-all placeholder-white/20 animate-fade-in" />
              ) : (
                <div className={`glass-panel p-1 rounded-2xl animate-pop-in ${goal.completed ? 'opacity-50 grayscale' : ''}`}>
                  <div className="bg-white/10 rounded-xl px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setGoal({ ...goal, completed: !goal.completed })} className={` w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${goal.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-white'}`}>{goal.completed && <Check size={14} />}</button>
                    <span className={`flex-1 text-lg font-medium ${goal.completed ? 'line-through text-white/40' : ''}`}>{goal.text}</span>
                    <button onClick={() => setGoal(null)} className="text-white/20 hover:text-white"><X size={18} /></button>
                  </div>
                </div>
              )}
            </div>

            <QuickLinks links={links} setLinks={setLinks} isZenMode={isZenMode} />
          </div>

          {/* RIGHT COLUMN */}
          {!isZenMode && (
            <div className="col-span-3 flex flex-col gap-5 animate-slide-left h-[85vh]">
              {config.widgets.sounds && <SoundPlayer accent={config.accent} />}
              {config.widgets.notes && <NotesWidget />}
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

        {/* --- STYLES --- */}
        <style>{`
        .glass-panel {
          background: rgba(10, 10, 10, 0.5);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          color: rgba(255, 255, 255, 0.95);
        }
        .btn-icon { @apply p-3 rounded-full bg-white/10 hover:bg-white/15 text-white/60 hover:text-white transition-all border border-white/10 hover:scale-105; }
        .settings-header { @apply text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-slide-right { animation: slideRight 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-slide-left { animation: slideLeft 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
      </div>
    </React.Suspense>
  );
};

export default App;