import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudSun, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { useStickyState } from '../hooks/useStickyState';

const getWeatherIcon = (code, isDay) => {
    // Open-Meteo WMO Weather interpretation codes
    if (code === 0) return isDay ? <Sun size={15} className="text-amber-300" /> : <Sun size={15} className="text-amber-100" />;
    if (code === 1 || code === 2) return isDay ? <CloudSun size={15} className="text-amber-200" /> : <Cloud size={15} className="text-slate-300" />;
    if (code === 3) return <Cloud size={15} className="text-slate-300" />;
    if (code >= 45 && code <= 48) return <CloudFog size={15} className="text-slate-400" />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={15} className="text-sky-300" />;
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return <CloudSnow size={15} className="text-indigo-200" />;
    if (code >= 95) return <CloudLightning size={15} className="text-amber-400" />;
    return <Cloud size={15} className="text-slate-300" />;
};

const getWeatherDesc = (code) => {
    if (code === 0) return 'Clear sky';
    if (code === 1 || code === 2) return 'Partly cloudy';
    if (code === 3) return 'Overcast';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
};

const WeatherWidget = ({ locationEnabled }) => {
    const [cachedWeather, setCachedWeather] = useStickyState(null, 'weather_cache_v2');
    const [unit, setUnit] = useStickyState('C', 'weather_unit');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchWeather = useCallback((force = false) => {
        if (!locationEnabled || !navigator.geolocation) return;

        // Use cache if within 15 minutes
        if (!force && cachedWeather && cachedWeather.timestamp && Date.now() - cachedWeather.timestamp < 15 * 60 * 1000) {
            return;
        }

        setLoading(true);
        setError(false);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,is_day&timezone=auto`);
                    if (!res.ok) throw new Error('Weather API error');
                    const data = await res.json();

                    setCachedWeather({
                        temp: Math.round(data.current.temperature_2m),
                        humidity: data.current.relative_humidity_2m,
                        weatherCode: data.current.weather_code,
                        isDay: data.current.is_day,
                        timestamp: Date.now()
                    });
                    setLoading(false);
                    setError(false);
                } catch (e) {
                    setError(true);
                    setErrorMessage('Failed to fetch');
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                setError(true);
                setErrorMessage(err.code === 1 ? 'Permission denied' : 'Location error');
            },
            { timeout: 10000, maximumAge: 300000 }
        );
    }, [locationEnabled, cachedWeather, setCachedWeather]);

    useEffect(() => {
        if (locationEnabled) {
            fetchWeather();
        }
    }, [locationEnabled, fetchWeather]);

    if (!locationEnabled) {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full backdrop-blur-md border border-white/5 text-white/40 text-xs">
                <MapPin size={13} />
                <span>Weather off</span>
            </div>
        );
    }

    if (error && !cachedWeather) {
        return (
            <button
                onClick={() => fetchWeather(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 rounded-full backdrop-blur-md border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 transition-all text-xs"
                title={errorMessage}
            >
                <AlertCircle size={13} />
                <span>Retry</span>
            </button>
        );
    }

    if (loading && !cachedWeather) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full backdrop-blur-md border border-white/5 animate-pulse text-xs text-white/40">
                <MapPin size={13} />
                <span>Loading...</span>
            </div>
        );
    }

    if (!cachedWeather) return null;

    const displayTemp = unit === 'C' ? cachedWeather.temp : Math.round((cachedWeather.temp * 9) / 5 + 32);

    return (
        <div
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 hover:bg-white/15 rounded-full backdrop-blur-md border border-white/10 transition-all cursor-pointer group select-none shadow-sm"
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            title={`${getWeatherDesc(cachedWeather.weatherCode)} · Click to switch °C/°F`}
        >
            {getWeatherIcon(cachedWeather.weatherCode, cachedWeather.isDay)}
            <span className="text-xs font-semibold text-white/90">
                {displayTemp}°{unit}
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    fetchWeather(true);
                }}
                title="Refresh weather"
                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-opacity ml-0.5"
            >
                <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>
    );
};

export default React.memo(WeatherWidget);
