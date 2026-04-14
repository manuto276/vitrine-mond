import React, { useState, useEffect } from 'react';

import {
    IconBattery, IconBattery1, IconBattery2, IconBattery3, IconBattery4, IconBatteryCharging,
    IconCpu, IconBlocks,
    IconSun, IconSunHigh, IconCloud, IconMist,
    IconCloudRain, IconCloudSnow, IconCloudStorm, IconCloudBolt, IconSnowflake,
    IconCloudOff, IconLoader2, IconRefresh, IconWifiOff,
} from '@tabler/icons-react';

import { useSettings } from './useSettings';
import { useWeather } from './useWeather';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const WEATHER_ICON_MAP = {
    0: IconSun,
    1: IconSunHigh,
    2: IconCloud,
    3: IconCloud,
    45: IconMist,
    48: IconMist,
    51: IconCloudRain,
    53: IconCloudRain,
    55: IconCloudRain,
    56: IconCloudRain,
    57: IconCloudRain,
    61: IconCloudRain,
    63: IconCloudRain,
    65: IconCloudRain,
    66: IconCloudRain,
    67: IconCloudRain,
    71: IconCloudSnow,
    73: IconCloudSnow,
    75: IconCloudSnow,
    77: IconSnowflake,
    80: IconCloudRain,
    81: IconCloudRain,
    82: IconCloudRain,
    85: IconCloudSnow,
    86: IconCloudSnow,
    95: IconCloudStorm,
    96: IconCloudBolt,
    99: IconCloudBolt,
};

function pad(n) {
    return String(n).padStart(2, '0');
}

function WeatherBlock({ city, weather, error, lastUpdated, unit }) {
    const symbol = unit === 'fahrenheit' ? '°F' : '°C';

    const updatedAt = lastUpdated
        ? lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : null;

    const iconStyle = { verticalAlign: 'middle', marginRight: '0.3em' };
    const footer = error
        ? <><IconWifiOff size={10} strokeWidth={2} style={iconStyle} />{updatedAt ? `Network unavailable · Updated at ${updatedAt}` : 'Network unavailable'}</>
        : updatedAt ? <><IconRefresh size={10} strokeWidth={2} style={iconStyle} />Updated at {updatedAt}</> : null;

    // No cached data and error → full error state
    if (!weather && error) return (
        <div className="mond-weather-container" style={{ textAlign: "center" }}>
            <p>Weather unavailable</p>
        </div>
    );

    // No data yet → loading state
    if (!weather) return (
        <div className="mond-weather-container" style={{ textAlign: "center" }}>
            <p>Loading weather…</p>
        </div>
    );

    const WeatherIcon = WEATHER_ICON_MAP[weather.code] ?? IconCloud;

    return (
        <div className="mond-weather-container">
            <WeatherIcon size={32} strokeWidth={1.5} />
            <div>
                <p>
                    Today weather in {city} is {weather.description}.<br />
                    Temperature is {weather.temperature}{symbol}, min is {weather.min}{symbol}, max is {weather.max}{symbol}.<br />
                    It feels like {weather.feelsLike}{symbol}, and humidity is {weather.humidity}%
                </p>
                {footer && <p className="mond-weather-last-updated">{footer}</p>}
            </div>
        </div>
    );
}

export default function App() {
    const settings = useSettings();
    const { weather, error: weatherError, lastUpdated } = useWeather({
        enabled: settings.showWeather,
        city: settings.weatherCity,
        unit: settings.temperatureUnit,
    });
    const textColor = settings.theme === 'light' ? '#212121' : '#f8f8f2';
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const day = DAYS[now.getDay()].toUpperCase();
    const dd = pad(now.getDate());
    const month = MONTHS[now.getMonth()];
    const yyyy = now.getFullYear();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());

    return (
        <div className="mond-container" style={{ color: textColor }}>
            <div className="mond-date-container">
                <p className="mond-day">{day}</p>
                {settings.showDate && (
                    <p className="mond-date">{dd} {month}, {yyyy}</p>
                )}
                {settings.showTime && (
                    <p className="mond-time">- {hh}:{mm} -</p>
                )}
            </div>
            {settings.showWeather && (
                <WeatherBlock
                    city={settings.weatherCity}
                    weather={weather}
                    error={weatherError}
                    lastUpdated={lastUpdated}
                    unit={settings.temperatureUnit}
                />
            )}
        </div>
    );
}
