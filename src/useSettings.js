const defaults = {
    theme: 'dark',
    accentColor: '#40C4FF',
    showBattery: true,
    alignment: 'left',
};

export function useSettings() {
    const loaded = (window.vitrine && window.vitrine.settings) || {};
    return { ...defaults, ...loaded };
}
