(function loadDoxxPlatform() {
    const version = '0.3.36';

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Unable to load ${src}`));
            document.head.append(script);
        });
    }

    async function initialize() {
        // Super Fast Tool uses the adapter's local-storage fallback without a portal SDK.
        await loadScript(`platform-gamepix.js?v=${version}`);

        try {
            await window.DoxxPlatform?.ready;
        } catch (error) {
            console.warn('Platform initialization failed. Starting with local storage.', error);
        }
        await loadScript(`game.js?v=${version}`);
        await window.DoxxPlatform?.loaded?.();
    }

    initialize().catch(error => {
        console.error('Doxx Click failed to initialize.', error);
    });
})();
