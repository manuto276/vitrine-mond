const defaults = {
    showDate: true,
    showTime: true,
    theme: 'dark',
};

export function useSettings() {
    const loaded = (window.vitrine && window.vitrine.settings) || {};
    return { ...defaults, ...loaded };
}
