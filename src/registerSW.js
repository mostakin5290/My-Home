export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        if (import.meta.env.PROD) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/service-worker.js')
                    .catch((err) => {
                        console.warn('Service worker registration failed:', err);
                    });
            });
        } else {
            // Unregister any active service worker during local development to avoid HMR / React caching conflicts
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (const registration of registrations) {
                    registration.unregister();
                }
            });
        }
    }
}
