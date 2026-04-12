const defaults = {
    theme: 'dark',
    accentColor: '#40C4FF',
    alignment: 'left',
    showWeather: false,
    weatherCity: '',
    temperatureUnit: 'celsius',
    showBattery: true,
};

export function useSettings() {
    const loaded = (window.vitrine && window.vitrine.settings) || {};
    return { ...defaults, ...loaded };
}
