(function initGamePixSdk() {
    const local = window.localStorage;
    const sdk = window.GamePix;
    let loadedPromise = null;
    let lastLevel = 0;
    let lastScore = -1;

    function dispatch(name, detail = {}) {
        window.dispatchEvent(new CustomEvent(name, { detail }));
    }

    function getStorage() {
        return sdk?.localStorage || local;
    }

    function safeCall(label, callback) {
        try {
            return callback();
        } catch (error) {
            console.warn(`GamePix.${label} failed.`, error);
            return undefined;
        }
    }

    if (sdk) {
        sdk.pause = function pauseFromGamePix() {
            dispatch('doxx-platform-pause');
            dispatch('doxx-platform-audio', { muted: true });
        };
        sdk.resume = function resumeFromGamePix() {
            dispatch('doxx-platform-resume');
            dispatch('doxx-platform-audio', { muted: false });
        };
    }

    const bridge = {
        name: 'gamepix',
        ready: Promise.resolve(Boolean(sdk)),
        storage: {
            getItem(key) {
                try {
                    return getStorage().getItem(String(key));
                } catch (error) {
                    return local.getItem(String(key));
                }
            },
            setItem(key, value) {
                const stringKey = String(key);
                const stringValue = String(value);
                try {
                    getStorage().setItem(stringKey, stringValue);
                } catch (error) {
                    local.setItem(stringKey, stringValue);
                }
            },
            removeItem(key) {
                const stringKey = String(key);
                try {
                    getStorage().removeItem(stringKey);
                } catch (error) {
                    local.removeItem(stringKey);
                }
            }
        },
        loaded() {
            if (loadedPromise) return loadedPromise;
            const result = typeof sdk?.loaded === 'function'
                ? safeCall('loaded', () => sdk.loaded())
                : undefined;
            loadedPromise = Promise.resolve(result)
                .catch(error => {
                    console.warn('GamePix.loaded failed. Continuing locally.', error);
                    return false;
                });
            return loadedPromise;
        },
        gameplayStart() {},
        gameplayStop() {},
        setLevel(level) {
            const nextLevel = Math.max(1, Math.floor(Number(level) || 1));
            if (nextLevel === lastLevel) return;
            lastLevel = nextLevel;
            if (typeof sdk?.updateLevel === 'function') {
                safeCall('updateLevel', () => sdk.updateLevel(nextLevel));
            }
        },
        setScore(score) {
            const nextScore = Math.max(0, Math.floor(Number(score) || 0));
            if (nextScore === lastScore) return;
            lastScore = nextScore;
            if (typeof sdk?.updateScore === 'function') {
                safeCall('updateScore', () => sdk.updateScore(nextScore));
            }
        },
        happyTime() {
            if (typeof sdk?.happyMoment === 'function') {
                safeCall('happyMoment', () => sdk.happyMoment());
            }
        },
        async showInterstitial() {
            if (typeof sdk?.interstitialAd !== 'function') return false;
            try {
                const result = await sdk.interstitialAd();
                return Boolean(result?.success);
            } catch (error) {
                console.warn('GamePix interstitial ad failed.', error);
                return false;
            }
        },
        async showReward() {
            if (typeof sdk?.rewardAd !== 'function') return false;
            try {
                const result = await sdk.rewardAd();
                return Boolean(result?.success);
            } catch (error) {
                console.warn('GamePix reward ad failed.', error);
                return false;
            }
        }
    };

    window.DoxxPlatform = bridge;
    dispatch('doxx-platform-ready', { platform: 'gamepix', sdk: Boolean(sdk) });
})();
