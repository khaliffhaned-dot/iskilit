// A service to handle Google Analytics event tracking.

declare global {
  interface Window {
    // This extends the global Window interface to include the gtag function
    // which is loaded from an external Google Analytics script.
    gtag?: (type: 'event', eventName: string, eventParams: Record<string, any>) => void;
  }
}

/**
 * Tracks a custom event with Google Analytics.
 * This function pushes event data to the dataLayer, which is then
 * processed by the Google Tag Manager script in index.html.
 *
 * @param eventName The name of the event to track (e.g., 'generate_report').
 * @param eventParams An object of parameters to send with the event (e.g., { report_type: 'competitor_analysis' }).
 */
export const trackEvent = (eventName: string, eventParams: Record<string, any>): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn(`Google Analytics not available. Event "${eventName}" not tracked.`);
  }
};
