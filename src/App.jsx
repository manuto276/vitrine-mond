import React from 'react';
import { IconBattery, IconBattery1, IconBattery2, IconBattery3, IconBattery4, IconBatteryCharging, IconCpu, IconBlocks } from '@tabler/icons-react';
import { useSystemInfo } from './useSystemInfo';
import { useSettings } from './useSettings';

/* ── helpers ─────────────────────────────────────────────────────── */

function formatBytes(b) {
    if (b >= 1073741824) return (b / 1073741824).toFixed(1) + ' GiB';
    if (b >= 1048576) return (b / 1048576).toFixed(0) + ' MiB';
    return (b / 1024).toFixed(0) + ' KiB';
}

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return [d && `${d}d`, h && `${h}h`, `${m}m`].filter(Boolean).join(' ');
}

function pct(used, total) {
    return total > 0 ? Math.round((used / total) * 100) : 0;
}

/* ── arc progress ────────────────────────────────────────────────── */

const RADIUS = 32;
const STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_DEGREES = 240;
const ARC_LENGTH = (ARC_DEGREES / 360) * CIRCUMFERENCE;
// Rotate so the arc starts bottom-left and ends bottom-right (gap centered at bottom)
const ARC_START_ANGLE = 90 + (360 - ARC_DEGREES) / 2; // 150°

function CircularProgress({ value, color = '#8be9fd', icon: Icon, label }) {
    const progress = (Math.min(value, 100) / 100) * ARC_LENGTH;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 88, height: 88 }}>
                <svg width="88" height="88" viewBox="0 0 88 88" style={{ display: 'block' }}>
                    {/* background arc */}
                    <circle
                        cx="44" cy="44" r={RADIUS}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={STROKE}
                        opacity="0.25"
                        strokeLinecap="round"
                        strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE - ARC_LENGTH}`}
                        transform={`rotate(${ARC_START_ANGLE} 44 44)`}
                    />
                    {/* progress arc */}
                    <circle
                        cx="44" cy="44" r={RADIUS}
                        fill="none"
                        stroke={color}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={`${progress} ${CIRCUMFERENCE - progress}`}
                        transform={`rotate(${ARC_START_ANGLE} 44 44)`}
                        style={{ transition: 'stroke-dasharray 0.4s ease' }}
                    />
                </svg>
                {/* icon overlaid in the center */}
                <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {Icon && <Icon size={32} strokeWidth={1.5} />}
                </div>
            </div>
            {label && <p className="vitrine-info-label">{label}</p>}
        </div >
    );
}

/* ── main ────────────────────────────────────────────────────────── */

export default function App() {
    const info = useSystemInfo();

    if (!info) {
        return (<></>);
    }

    const settings = useSettings();
    const { cpu, memory, battery } = info;
    const memPct = pct(memory.used, memory.total);
    const accentColor = settings.accentColor;
    const isRight = settings.alignment === 'right';
    const textAlign = isRight ? 'end' : 'start';
    const textColor = settings.theme === 'light' ? '#212121' : '#f8f8f2';

    const now = new Date();
    const year = now.getFullYear();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const hours = now.getHours();
    const minutes = now.getMinutes();

    return (
        <div className="vitrine-container" style={{ textAlign, color: textColor }}>
            <p className="vitrine-title">
                {year}<br />
                {weekday}<br />
                {day}<br />
                {month}<br />
                {hours.toString().padStart(2, '0')}:<span style={{ color: accentColor }}>{minutes.toString().padStart(2, '0')}</span><br />
            </p>
            <div className="vitrine-info" style={{ justifyContent: isRight ? 'flex-end' : 'flex-start' }}>
                <CircularProgress value={cpu.usage} color={accentColor} icon={IconCpu} label="CPU" />
                <CircularProgress value={memPct} color={accentColor} icon={IconBlocks} label="RAM" />
                {battery.hasBattery && settings.showBattery && (
                    <CircularProgress
                        value={battery.level}
                        color={accentColor}
                        icon={battery.charging ? IconBatteryCharging :
                            battery.level > 80 ? IconBattery4 :
                                battery.level > 60 ? IconBattery3 :
                                    battery.level > 40 ? IconBattery2 :
                                        battery.level > 20 ? IconBattery1 :
                                            IconBattery
                        }
                        label={battery.charging ? 'Charging' : 'Battery'}
                    />
                )}
            </div>
        </div>
    );
}
