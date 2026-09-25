import { 
    Type, Clock, Disc, Zap, AlignVerticalJustifyCenter, Circle, 
    Monitor, Layers, Grid, Code, Watch, Droplet, Globe, Gauge,
    Sparkles, Waves, Flame, CloudRain, Radio
} from 'lucide-react';

export const CLOCK_THEMES = {
    modern: { id: 'modern', name: 'Modern Sans', icon: Type, description: 'Clean minimal typography with date banner' },
    nixie: { id: 'nixie', name: 'Nixie Tube', icon: Zap, description: 'Vintage glowing vacuum tube filaments' },
    automotive: { id: 'automotive', name: 'Speedometer', icon: Gauge, description: 'Sports gauge with sweeping tachometer needle' },
    galaxy: { id: 'galaxy', name: 'Galaxy Orbit', icon: Globe, description: 'Concentric planetary orbit cosmic clock' },
    matrix: { id: 'matrix', name: 'Word Matrix', icon: Grid, description: 'Cyberpunk digital cipher matrix glow' },
    analog: { id: 'analog', name: 'Luxury Watch', icon: Clock, description: 'Swiss chronograph with sunburst dial & lume' },
    glass: { id: 'glass', name: 'Glassmorphism', icon: Droplet, description: 'Frosted crystal aesthetic with backdrop blur' },
    radial: { id: 'radial', name: 'Smart Radial', icon: Watch, description: 'Multi-ring fitness & activity smartwatch style' },
    digital: { id: 'digital', name: 'Retro LCD', icon: Layers, description: 'Classic digital wristwatch alarm display' },
    retro: { id: 'retro', name: 'Flip Clock', icon: Grid, description: 'Mechanical airport split-flap numbers' },
    tactical: { id: 'tactical', name: 'Tactical HUD', icon: Disc, description: 'Sci-fi military targeting HUD ring' },
    neon: { id: 'neon', name: 'Cyber Neon', icon: Zap, description: 'Vibrant neon tube glow with edge reflection' },
    typo: { id: 'typo', name: 'Typographic', icon: Type, description: 'Spelled-out textual human clock' },
    binary: { id: 'binary', name: 'Binary Dev', icon: Code, description: '6-column binary coded decimal columns' },
    terminal: { id: 'terminal', name: 'Terminal', icon: Monitor, description: 'Hacker unix shell command prompt' },
    minimal: { id: 'minimal', name: 'Ultralight', icon: Circle, description: 'Ultra-thin stacked architectural time' },
    vertical: { id: 'vertical', name: 'Bold Stack', icon: AlignVerticalJustifyCenter, description: 'Heavy vertical tri-color numerals' },
};

export const SOLID_COLORS = [
    '#000000', '#0a0a0a', '#0f172a', '#1e1b4b', '#312e81',
    '#14532d', '#450a0a', '#431407', '#18181b', '#701a75',
    '#0c4a6e', '#134e4a', '#365314', '#713f12', '#262626'
];

export const WALLPAPER_CATEGORIES = {
    nature: 'Nature & Landscapes',
    space: 'Deep Space',
    cyberpunk: 'Cyberpunk & Night',
    minimal: 'Minimal & Architecture',
    anime: 'Aesthetic & Lo-Fi'
};

export const WALLPAPERS = {
    sequoiaDark: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2600&auto=format&fit=crop",
    sonomaDark: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2600&auto=format&fit=crop",
    venturaDark: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2600&auto=format&fit=crop",
    montereyDark: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2600&auto=format&fit=crop",
    space: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2600&auto=format&fit=crop",
    aurora: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2600&auto=format&fit=crop",
    minimalDark: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2717&auto=format&fit=crop",
    loft: "https://images.unsplash.com/photo-1617195920950-1145bf9a9c72?q=80&w=2574&auto=format&fit=crop",
    forest: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=3870&auto=format&fit=crop",
    cyberpunk: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2600&auto=format&fit=crop",
    tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2600&auto=format&fit=crop",
    ocean: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2600&auto=format&fit=crop"
};

export const LIVE_WALLPAPERS = {
    auroraLive: {
        id: 'auroraLive',
        name: 'Northern Aurora',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-aurora-borealis-over-a-snowy-mountain-42861-large.mp4',
        poster: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=600&auto=format&fit=crop'
    },
    cyberpunkRain: {
        id: 'cyberpunkRain',
        name: 'Neon Rain Drops',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-seen-up-18312-large.mp4',
        poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
    },
    nebulaSpace: {
        id: 'nebulaSpace',
        name: 'Cosmic Starfield',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-star-field-in-space-41541-large.mp4',
        poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop'
    },
    oceanWavesLive: {
        id: 'oceanWavesLive',
        name: 'Ocean Waves',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
        poster: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=600&auto=format&fit=crop'
    },
    fireplaceLive: {
        id: 'fireplaceLive',
        name: 'Cozy Hearth',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-flames-burning-in-a-fireplace-42841-large.mp4',
        poster: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=600&auto=format&fit=crop'
    },
    mistyForestLive: {
        id: 'mistyForestLive',
        name: 'Misty Alpine Forest',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-fog-over-a-coniferous-forest-42871-large.mp4',
        poster: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=600&auto=format&fit=crop'
    }
};

export const ACCENTS = {
    blue: "from-blue-500 to-cyan-400",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-amber-400",
    green: "from-emerald-500 to-teal-400",
    red: "from-red-600 to-rose-500",
    gold: "from-yellow-400 to-amber-600",
    white: "from-white to-gray-400"
};

export const ACCENT_COLORS = {
    blue: '#38bdf8',
    purple: '#c084fc',
    orange: '#fb923c',
    green: '#34d399',
    red: '#f43f5e',
    gold: '#facc15',
    white: '#f3f4f6'
};

export const SOUNDS = [
    { id: 'rain', name: 'Rainfall', icon: CloudRain, desc: 'Gentle ambient rain' },
    { id: 'ocean', name: 'Ocean Waves', icon: Waves, desc: 'Tidal ocean swells' },
    { id: 'fireplace', name: 'Fireplace', icon: Flame, desc: 'Warm glowing hearth' },
    { id: 'binaural', name: 'Alpha Waves', icon: Sparkles, desc: '432Hz focus stimulation' },
    { id: 'pinknoise', name: 'Pink Noise', icon: Radio, desc: 'Deep focus acoustic masking' },
];

export const SEARCH_ENGINES = {
    google: { name: 'Google', url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    duckduckgo: { name: 'DuckDuckGo', url: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },
    bing: { name: 'Bing', url: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
    brave: { name: 'Brave', url: (q) => `https://search.brave.com/search?q=${encodeURIComponent(q)}` },
    perplexity: { name: 'Perplexity', url: (q) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}` },
    youtube: { name: 'YouTube', url: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}` },
    github: { name: 'GitHub', url: (q) => `https://github.com/search?q=${encodeURIComponent(q)}` }
};
