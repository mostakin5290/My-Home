export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((registration) => {
                    // Service worker registered successfully
                })
                .catch((registrationError) => {
                    // Service worker registration failed
                });
        });
    }
}
