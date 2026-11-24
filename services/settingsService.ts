import { DashboardSettings } from '../types.ts';

const SETTINGS_KEY = 'escalate-user-settings';

interface AppSettings {
    dashboard: DashboardSettings;
}

const defaultSettings: AppSettings = {
    dashboard: {
        visibleWidgets: ['briefing', 'charts', 'actions', 'themes', 'mediaHubSnapshot'],
    },
};

const getSettings = (): AppSettings => {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Deep merge to ensure new settings keys are added
            return {
                dashboard: { ...defaultSettings.dashboard, ...parsed.dashboard },
            };
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
    }
    return defaultSettings;
};

const saveSettings = (settings: AppSettings) => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Failed to save settings to localStorage", e);
    }
};

export const getDashboardSettings = (): DashboardSettings => {
    return getSettings().dashboard;
};

export const saveDashboardSettings = (dashboardSettings: DashboardSettings) => {
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, dashboard: dashboardSettings });
};
