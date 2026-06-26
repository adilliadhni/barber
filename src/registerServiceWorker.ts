export function register() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  } else if ('serviceWorker' in navigator && !import.meta.env.PROD) {
    // Optional: register in dev for testing if needed
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker (Dev Mode) registered: ', registration.scope);
        })
        .catch((error) => {
          console.warn('ServiceWorker (Dev Mode) failed to register: ', error);
        });
    });
  }
}
