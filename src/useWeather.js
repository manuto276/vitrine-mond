import { useState, useEffect, useRef } from 'react';

const WEATHER_CODES = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'foggy',
    48: 'rime fog',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    56: 'light freezing drizzle',
    57: 'heavy freezing drizzle',
    61: 'slight rain',
    63: 'moderate rain',
    65: 'heavy rain',
    66: 'light freezing rain',
    67: 'heavy freezing rain',
    71: 'slight snowfall',
    73: 'moderate snowfall',
    75: 'heavy snowfall',
    77: 'snow grains',
    80: 'slight rain showers',
    81: 'moderate rain showers',
    82: 'violent rain showers',
    85: 'slight snow showers',
    86: 'heavy snow showers',
    95: 'thunderstorm',
    96: 'thunderstorm with hail',
    99: 'thunderstorm with heavy hail',
};

async function geocode(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();
    if (!data.results?.length) throw new Error(`City "${city}" not found`);
    return { lat: data.results[0].latitude, lon: data.results[0].longitude };
}

async function fetchWeather(lat, lon, unit) {
    const url = [
        'https://api.open-meteo.com/v1/forecast',
        `?latitude=${lat}&longitude=${lon}`,
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code`,
        `&daily=temperature_2m_max,temperature_2m_min`,
        `&temperature_unit=${unit}`,
        `&timezone=auto&forecast_days=1`,
    ].join('');
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather request failed');
    return res.json();
}

const POLL_INTERVAL = 5 * 60 * 1000;

export function useWeather({ enabled, city, unit }) {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const coordsRef = useRef(null);
    const prevCityRef = useRef(null);

    useEffect(() => {
        if (!enabled || !city?.trim()) return;

        // Reset coords when city changes
        if (prevCityRef.current !== city) {
            coordsRef.current = null;
            prevCityRef.current = city;
        }

        let cancelled = false;
        let timer = null;

        async function poll() {
            if (cancelled) return;

            if (!navigator.onLine) {
                setError('No internet connection');
                timer = setTimeout(poll, POLL_INTERVAL);
                return;
            }

            try {
                if (!coordsRef.current) {
                    coordsRef.current = await geocode(city);
                }

                const apiUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
                const data = await fetchWeather(coordsRef.current.lat, coordsRef.current.lon, apiUnit);
                const c = data.current;

                if (!cancelled) {
                    setWeather({
                        code: c.weather_code,
                        description: WEATHER_CODES[c.weather_code] ?? 'unknown',
                        temperature: Math.round(c.temperature_2m),
                        feelsLike: Math.round(c.apparent_temperature),
                        humidity: c.relative_humidity_2m,
                        max: Math.round(data.daily.temperature_2m_max[0]),
                        min: Math.round(data.daily.temperature_2m_min[0]),
                    });
                    setLastUpdated(new Date());
                    setError(null);
                }
            } catch (e) {
                if (!cancelled) setError(e.message);
            }

            if (!cancelled) {
                timer = setTimeout(poll, POLL_INTERVAL);
            }
        }

        poll();

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [enabled, city, unit]);

    return { weather, error, lastUpdated };
}
