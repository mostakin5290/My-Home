import React, { useState, useEffect } from 'react';
import { Sun, Cloud, MapPin, AlertCircle } from 'lucide-react';

const WeatherWidget = ({ locationEnabled }) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!locationEnabled) {
            setWeather(null);
            setLoading(false);
            return;
        }

        const requestLocation = () => {
            if (!navigator.geolocation) {
                setError(true);
                setErrorMessage('Geolocation not supported');
                return;
            }

            setLoading(true);
            setError(false);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`);
                        const data = await res.json();
                        setWeather({
                            temp: Math.round(data.current.temperature_2m),
                            isDay: data.current.is_day
                        });
                        setError(false);
                        setLoading(false);
                    } catch (e) {
                        setError(true);
                        setErrorMessage('Failed to fetch weather');
                        setLoading(false);
                    }
                },
                (err) => {
                    setLoading(false);
                    setError(true);

                    // Better error messages
                    switch (err.code) {
                        case 1: // PERMISSION_DENIED
                            setErrorMessage('Permission denied');
                            break;
                        case 2: // POSITION_UNAVAILABLE
                            setErrorMessage('Location unavailable');
                            break;
                        case 3: // TIMEOUT
                            setErrorMessage('Request timeout');
                            break;
                        default:
                            setErrorMessage('Location error');
                    }
                },
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 600000 // Cache for 10 minutes
                }
            );
        };

        requestLocation();
    }, [locationEnabled]);

    if (!locationEnabled) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full backdrop-blur-md border border-white/5 text-white/30">
                <MapPin size={14} />
                <span className="text-xs">Enable in Settings</span>
            </div>
        );
    }

    const handleRetryPermission = () => {
        if (!navigator.geolocation) return;

        setError(false);
        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`);
                    const data = await res.json();
                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        isDay: data.current.is_day
                    });
                    setError(false);
                    setLoading(false);
                } catch (e) {
                    setError(true);
                    setErrorMessage('Failed to fetch weather');
                    setLoading(false);
                }
            },
            (err) => {
                setError(true);
                setLoading(false);
                switch (err.code) {
                    case 1:
                        setErrorMessage('Permission denied');
                        break;
                    case 2:
                        setErrorMessage('Location unavailable');
                        break;
                    case 3:
                        setErrorMessage('Request timeout');
                        break;
                    default:
                        setErrorMessage('Location error');
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 600000
            }
        );
    };

    if (error) {
        return (
            <button
                onClick={handleRetryPermission}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 rounded-full backdrop-blur-md border border-orange-500/20 text-orange-300 hover:bg-orange-500/20 transition-all cursor-pointer"
                title={errorMessage}
            >
                <AlertCircle size={14} />
                <span className="text-xs">Retry</span>
            </button>
        );
    }

    if (loading || !weather) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full backdrop-blur-md border border-white/5 animate-pulse">
                <MapPin size={14} className="text-white/30" />
                <span className="text-xs text-white/30">Loading...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/5 animate-fade-in">
            {weather.isDay ? <Sun size={14} className="text-amber-300" /> : <Cloud size={14} className="text-blue-300" />}
            <span className="text-sm font-medium">{weather.temp}°C</span>
        </div>
    );
};

export default WeatherWidget;
