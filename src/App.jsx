import React, { useState, useEffect } from 'react';
import { useSettings } from './useSettings';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function pad(n) {
    return String(n).padStart(2, '0');
}

export default function App() {
    const { showDate, showTime, theme } = useSettings();
    const textColor = theme === 'light' ? '#212121' : '#f8f8f2';
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
            <p className="mond-day">{day}</p>
            {showDate && (
                <p className="mond-date">{dd} {month}, {yyyy}</p>
            )}
            {showTime && (
                <p className="mond-time">- {hh}:{mm} -</p>
            )}
        </div>
    );
}
