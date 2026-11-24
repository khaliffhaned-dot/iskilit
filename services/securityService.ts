// This service simulates fetching secrets from a secure,
// server-side source like Google Secret Manager or a configuration service.
// This prevents sensitive information like API keys from being exposed in the client-side code.

const getEnvVar = (name: string, fallback: string = ''): string => {
    try {
        // In a real build process (like Vite, Webpack), these would be replaced.
        // For the simulation, we try reading from a global object that mimics process.env.
        // This version safely checks for `process` to avoid ReferenceErrors in a browser environment.
        const env = (typeof window !== 'undefined' && (window as any)._ENV) || (typeof process !== 'undefined' && (process as any).env) || {};
        return env[name] || fallback;
    } catch (e) {
        // Fallback in case of any unexpected errors.
        return fallback;
    }
};


export const getGoogleApiKey = (): string => {
    const key = getEnvVar('API_KEY', 'YOUR_API_KEY_IS_NOT_SET');
    if (key === 'YOUR_API_KEY_IS_NOT_SET') {
        console.warn("Gemini API Key is not set. Please configure it in your environment variables.");
    }
    return key;
};

export const getGoogleMapsApiKey = (): string => {
    const key = getEnvVar('GOOGLE_MAPS_API_KEY', 'YOUR_GOOGLE_MAPS_API_KEY_IS_NOT_SET');
    if (key === 'YOUR_GOOGLE_MAPS_API_KEY_IS_NOT_SET') {
        console.warn("Google Maps API Key is not set. Please configure it in your environment variables.");
    }
    return key;
};
