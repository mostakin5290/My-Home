import { 
    Type, Clock, Disc, Zap, AlignVerticalJustifyCenter, Circle, 
    Hash, Monitor, Layers, Grid, Code, Watch, Droplet, Globe, Gauge 
} from 'lucide-react';

export const CLOCK_THEMES = {
    modern: { id: 'modern', name: 'Modern Sans', icon: Type },
    glass: { id: 'glass', name: 'Glassmorphism', icon: Droplet },
    analog: { id: 'analog', name: 'Luxury Analog', icon: Clock },
    nixie: { id: 'nixie', name: 'Nixie Tube', icon: Zap }, // NEW
    automotive: { id: 'automotive', name: 'Speedometer', icon: Gauge }, // NEW
    galaxy: { id: 'galaxy', name: 'Galaxy Orbit', icon: Globe }, // NEW
    matrix: { id: 'matrix', name: 'Word Matrix', icon: Grid }, // NEW
    radial: { id: 'radial', name: 'Smart Radial', icon: Watch },
    digital: { id: 'digital', name: 'Retro LCD', icon: Layers },
    binary: { id: 'binary', name: 'Binary Dev', icon: Code },
    retro: { id: 'retro', name: 'Flip Clock', icon: Grid },
    tactical: { id: 'tactical', name: 'Tactical HUD', icon: Disc },
    neon: { id: 'neon', name: 'Cyber Neon', icon: Zap },
    typo: { id: 'typo', name: 'Typographic', icon: Type },
    terminal: { id: 'terminal', name: 'Terminal', icon: Monitor },
    minimal: { id: 'minimal', name: 'Ultralight', icon: Circle },
    vertical: { id: 'vertical', name: 'Bold Stack', icon: AlignVerticalJustifyCenter },
};

// ... keep your WALLPAPERS, SOUNDS, and ACCENTS as they were.

export const SOLID_COLORS = [
    '#000000', '#0a0a0a', '#0f172a', '#1e1b4b', '#312e81',
    '#14532d', '#450a0a', '#431407', '#27272a', '#701a75'
];

export const WALLPAPERS = {
    minimal: "https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2717&auto=format&fit=crop",

    loft: "https://images.unsplash.com/photo-1617195920950-1145bf9a9c72?q=80&w=2574&auto=format&fit=crop",


    forest: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=3870&auto=format&fit=crop",


};

export const ACCENTS = {
    blue: "from-blue-500 to-cyan-400",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-amber-400",
    green: "from-emerald-500 to-teal-400",
    red: "from-red-600 to-rose-500",
    white: "from-white to-gray-400"
};

export const SOUNDS = [
    {
        id: 'rain',
        name: 'Rain',
        url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg'
    },
    {
        id: 'ocean',
        name: 'Ocean',
        url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg'
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        // Warm crackling sound, best for winter study sessions
        url: 'https://actions.google.com/sounds/v1/ambiences/warm_fireplace.ogg'
    },

];

