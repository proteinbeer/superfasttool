function initDoxxClickGame() {
    const canvas = document.getElementById('doxxClickCanvas');
    const startButton = document.getElementById('doxxClickStart');
    const muteButton = document.getElementById('doxxClickMute');
    const restartButton = document.getElementById('doxxClickRestart');
    const intro = document.getElementById('doxxClickIntro');
    const stageMenu = document.getElementById('doxxClickMenu');
    const stageGrid = document.getElementById('doxxClickStageGrid');
    const gameWrap = document.getElementById('doxxClickGameWrap');
    const status = document.getElementById('doxxClickStatus');
    const timerBar = document.getElementById('doxxClickTimerBar');
    const timerBox = document.getElementById('doxxClickTimerBox');
    const titleBlink = document.querySelector('.doxx-click-title-eye-blink');
    const titleName = document.querySelector('.title-name');
    const titleSideActions = document.querySelector('.title-side-actions');
    const titleMenuButton = document.getElementById('doxxClickTitleMenuButton');
    const infoButton = document.getElementById('doxxClickInfoButton');
    const infoOverlay = document.getElementById('doxxClickInfoOverlay');
    const infoPanel = infoOverlay?.querySelector('.title-info-panel');
    const platform = window.DoxxPlatform;
    const androidPlatform = platform?.name === 'android';
    document.documentElement.classList.toggle('doxx-platform-android', androidPlatform);
    const progressStorage = platform?.storage || window.localStorage;
    if (!canvas || !startButton || !intro || !gameWrap) return;

    const language = platform?.language === 'ru' ? 'ru' : 'en';
    const labels = language === 'ru' ? {
        play: 'Играть',
        openTitleMenu: 'Открыть меню',
        closeTitleMenu: 'Закрыть меню',
        stageSelection: 'Выбор уровня',
        mute: 'Выключить звук',
        unmute: 'Включить звук',
        information: 'Информация об игре',
        developerLogo: 'Логотип разработчика Proteinbeer',
        gameCanvas: "Игра Dox'x Click",
        moveLeft: 'Двигаться влево',
        moveRight: 'Двигаться вправо',
        jump: 'Прыжок',
        pause: 'Приостановить игру',
        returnToTitle: 'Вернуться на главный экран',
        stage: number => `Уровень ${number}`,
        stageLocked: number => `Уровень ${number} заблокирован`
    } : {
        play: 'Play',
        openTitleMenu: 'Open title menu',
        closeTitleMenu: 'Close title menu',
        stageSelection: 'Stage selection',
        mute: 'Mute audio',
        unmute: 'Unmute audio',
        information: 'Game information',
        developerLogo: 'Proteinbeer developer logo',
        gameCanvas: "Dox'x Click game",
        moveLeft: 'Move left',
        moveRight: 'Move right',
        jump: 'Jump',
        pause: 'Pause game',
        returnToTitle: 'Return to title',
        stage: number => `Stage ${number}`,
        stageLocked: number => `Stage ${number} locked`
    };
    document.documentElement.lang = language;
    startButton.setAttribute('aria-label', labels.play);
    titleMenuButton?.setAttribute('aria-label', labels.openTitleMenu);
    document.getElementById('doxxClickStageButton')?.setAttribute('aria-label', labels.stageSelection);
    infoButton?.setAttribute('aria-label', labels.information);
    infoPanel?.querySelector('[role="img"]')?.setAttribute('aria-label', labels.developerLogo);
    canvas.setAttribute('aria-label', labels.gameCanvas);
    document.querySelector('[data-doxx-click-control="left"]')?.setAttribute('aria-label', labels.moveLeft);
    document.querySelector('[data-doxx-click-control="right"]')?.setAttribute('aria-label', labels.moveRight);
    document.querySelector('[data-doxx-click-control="jump"]')?.setAttribute('aria-label', labels.jump);

    const pressedButtons = new Map();
    document.addEventListener('pointerdown', event => {
        const button = event.target.closest('button:not(:disabled)');
        if (!button) return;
        pressedButtons.set(event.pointerId, button);
        button.classList.add('is-pressed');
    }, true);
    const releasePressedButton = event => {
        const button = pressedButtons.get(event.pointerId);
        if (!button) return;
        button.classList.remove('is-pressed');
        pressedButtons.delete(event.pointerId);
    };
    document.addEventListener('pointerup', releasePressedButton, true);
    document.addEventListener('pointercancel', releasePressedButton, true);
    document.addEventListener('contextmenu', event => {
        if (event.target.closest('button')) event.preventDefault();
    }, true);

    let infoTransitioning = false;
    let infoTransientAnimations = [];
    const clearInfoTransientAnimations = () => {
        infoTransientAnimations.forEach(animation => animation?.cancel());
        infoTransientAnimations = [];
    };
    const getInfoTransform = () => {
        const buttonRect = infoButton?.getBoundingClientRect();
        const panelRect = infoPanel?.getBoundingClientRect();
        if (!buttonRect || !panelRect) return null;
        return {
            transform: `translate(${buttonRect.left - panelRect.left}px, ${buttonRect.top - panelRect.top}px) scale(${buttonRect.width / panelRect.width}, ${buttonRect.height / panelRect.height})`,
            transformOrigin: 'top left'
        };
    };
    const closeInfo = async () => {
        if (!infoOverlay || !infoPanel || infoOverlay.classList.contains('hidden') || infoTransitioning) return;
        infoTransitioning = true;
        clearInfoTransientAnimations();
        const collapsed = getInfoTransform();
        const content = [...infoPanel.children];
        const contentAnimations = content.map(element => element.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 125, easing: 'ease-in', fill: 'forwards' }
        ));
        const panelAnimation = collapsed ? infoPanel.animate([
            { transform: 'none', transformOrigin: 'top left', borderRadius: '9px' },
            { ...collapsed, borderRadius: '8px' }
        ], { duration: 230, easing: 'cubic-bezier(.55,0,.8,.2)', fill: 'forwards' }) : null;
        infoTransientAnimations = [...contentAnimations, panelAnimation].filter(Boolean);
        await Promise.allSettled(infoTransientAnimations.map(animation => animation.finished));
        infoOverlay.classList.add('hidden');
        infoOverlay.setAttribute('aria-hidden', 'true');
        if (infoButton) {
            infoButton.style.visibility = '';
            infoButton.style.pointerEvents = '';
        }
        clearInfoTransientAnimations();
        infoTransitioning = false;
        infoButton?.focus({ preventScroll: true });
    };
    infoButton?.addEventListener('click', async () => {
        if (!infoOverlay || !infoPanel || infoTransitioning) return;
        infoTransitioning = true;
        clearInfoTransientAnimations();
        infoOverlay?.classList.remove('hidden');
        infoOverlay?.setAttribute('aria-hidden', 'false');
        const expanded = getInfoTransform();
        infoButton.style.visibility = 'hidden';
        infoButton.style.pointerEvents = 'none';
        const content = [...infoPanel.children];
        const contentAnimations = content.map(element => element.animate([
            { opacity: 0 },
            { opacity: 0, offset: 0.35 },
            { opacity: 1 }
        ], { duration: 280, easing: 'ease-out', fill: 'both' }));
        const panelAnimation = expanded ? infoPanel.animate([
            { ...expanded, borderRadius: '8px' },
            { transform: 'none', transformOrigin: 'top left', borderRadius: '9px' }
        ], { duration: 280, easing: 'cubic-bezier(.2,.85,.25,1)' }) : null;
        infoTransientAnimations = [...contentAnimations, panelAnimation].filter(Boolean);
        await Promise.allSettled(infoTransientAnimations.map(animation => animation.finished));
        clearInfoTransientAnimations();
        infoTransitioning = false;
    });
    infoOverlay?.addEventListener('click', event => {
        if (event.target === infoOverlay) closeInfo();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !infoOverlay?.classList.contains('hidden')) closeInfo();
    });

    function scheduleTitleBlink(delay = 1400 + Math.random() * 2200) {
        if (!titleBlink) return;
        window.setTimeout(() => {
            if (intro.classList.contains('hidden')) {
                scheduleTitleBlink(1200);
                return;
            }
            const blinkCount = Math.random() < 0.5 ? 1 : 2;
            let completedBlinks = 0;
            const blink = () => {
                titleBlink.classList.remove('is-blinking');
                void titleBlink.offsetWidth;
                titleBlink.classList.add('is-blinking');
                window.setTimeout(() => {
                    titleBlink.classList.remove('is-blinking');
                    completedBlinks += 1;
                    if (completedBlinks < blinkCount) window.setTimeout(blink, 55);
                    else scheduleTitleBlink();
                }, 180);
            };
            blink();
        }, delay);
    }

    scheduleTitleBlink();

    function scheduleTitleGlitch(delay = 1200 + Math.random() * 2600) {
        if (!titleName) return;
        window.setTimeout(() => {
            if (intro.classList.contains('hidden')) {
                scheduleTitleGlitch(1000);
                return;
            }
            titleName.classList.remove('is-glitching');
            void titleName.offsetWidth;
            titleName.classList.add('is-glitching');
            window.setTimeout(() => {
                titleName.classList.remove('is-glitching');
                scheduleTitleGlitch();
            }, 280);
        }, delay);
    }

    scheduleTitleGlitch();

    const ctx = canvas.getContext('2d');
    const maxStage = 100;
    const mobileControls = document.querySelector('#doxxClickGameWrap [data-doxx-click-control]')?.parentElement;
    const setMobileControlsDisabled = disabled => {
        mobileControls?.querySelectorAll('[data-doxx-click-control]').forEach(button => {
            button.disabled = disabled;
            button.classList.remove('is-pressed');
        });
    };
    const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)');
    let orientationView = window;
    try {
        if (window.parent !== window && window.parent.location.origin === window.location.origin) {
            orientationView = window.parent;
        }
    } catch (_) {
        orientationView = window;
    }
    const mobileLandscape = orientationView.matchMedia('(orientation: landscape) and (hover: none) and (pointer: coarse)');
    const isMobileLandscape = () => {
        if (!coarsePointer.matches) return false;
        const orientationType = window.screen.orientation?.type;
        return orientationType ? orientationType.startsWith('landscape') : mobileLandscape.matches;
    };
    const statusRow = timerBox?.parentElement;
    let canvasShell = null;
    let pauseButton = null;
    let gameMenuButton = null;
    canvas.style.touchAction = 'pan-y';
    if (mobileControls && canvas.parentElement?.id === 'doxxClickGameWrap') {
        canvasShell = document.createElement('div');
        canvasShell.className = 'doxx-click-canvas-shell relative';
        mobileControls.classList.add('doxx-click-mobile-controls');
        canvas.parentElement.insertBefore(canvasShell, canvas);
        canvasShell.append(canvas);

        const pauseControls = document.createElement('div');
        pauseControls.className = 'absolute right-3 top-3 z-20 flex flex-col items-end gap-2';
        pauseControls.setAttribute('data-doxx-click-readable', '');
        pauseButton = document.createElement('button');
        pauseButton.id = 'doxxClickPauseButton';
        pauseButton.type = 'button';
        pauseButton.className = 'flex h-9 w-9 items-center justify-center rounded-full border border-fuchsia-700 bg-zinc-950/90 font-mono text-sm font-black text-fuchsia-200 shadow-lg hover:bg-fuchsia-950';
        pauseButton.textContent = '||';
        pauseButton.setAttribute('aria-label', labels.pause);
        gameMenuButton = document.createElement('button');
        gameMenuButton.id = 'doxxClickGameMenuButton';
        gameMenuButton.hidden = true;
        gameMenuButton.type = 'button';
        gameMenuButton.className = 'hidden items-center justify-center rounded-md border border-fuchsia-800 bg-zinc-950/95 px-3 py-2 font-mono text-sm font-black leading-none text-fuchsia-200 shadow-lg hover:bg-fuchsia-950';
        gameMenuButton.innerHTML = '<span class="doxx-click-arrow-icon" aria-hidden="true">&#9664;</span>';
        gameMenuButton.setAttribute('aria-label', labels.returnToTitle);
        pauseControls.append(pauseButton, gameMenuButton);
        canvasShell.append(pauseControls);

        const placeMobileControls = () => {
            const overlayControls = isMobileLandscape();
            document.documentElement.classList.toggle('doxx-controls-overlay', overlayControls);
            if (overlayControls) canvasShell.append(mobileControls);
            else if (statusRow) statusRow.insertAdjacentElement('afterend', mobileControls);
        };

        placeMobileControls();
        if (mobileLandscape.addEventListener) mobileLandscape.addEventListener('change', placeMobileControls);
        else mobileLandscape.addListener(placeMobileControls);
        window.screen.orientation?.addEventListener?.('change', placeMobileControls);
    }
    statusRow?.classList.add('hidden');
    const baseWorldWidth = 2600;
    const stageOnePortalDistance = 2366;
    const stageDistanceStep = Math.round(stageOnePortalDistance / 3);
    let worldWidth = baseWorldWidth;
    const floorY = 438;
    const spawnSafeRadius = 360;
    const exitSafeRadius = 120;
    const keys = { left: false, right: false, jump: false };
    let jumpKeyHeld = false;
    const player = { x: 90, y: 272, w: 24, h: 24, vx: 0, vy: 0, grounded: false, jumpsLeft: 2 };
    let facingDirection = 1;
    const checkpoint = { x: 90, y: 272 };
    const basePlatforms = [
        { x: 0, y: floorY, w: 520, h: 120 },
        { x: 610, y: floorY, w: 470, h: 120 },
        { x: 1180, y: floorY, w: 390, h: 120 },
        { x: 1665, y: floorY, w: 420, h: 120 },
        { x: 2180, y: floorY, w: 420, h: 120 },
        { x: 420, y: 344, w: 130, h: 18 },
        { x: 760, y: 326, w: 150, h: 18 },
        { x: 1020, y: 280, w: 120, h: 18 },
        { x: 1370, y: 334, w: 130, h: 18 },
        { x: 1840, y: 300, w: 140, h: 18 },
        { x: 2100, y: 350, w: 110, h: 18 }
    ];
    const baseSpikes = [
        { x: 330, y: floorY - 20, w: 80 }, { x: 870, y: floorY - 20, w: 70 },
        { x: 1270, y: floorY - 20, w: 75 }, { x: 1910, y: floorY - 20, w: 75 },
        { x: 2310, y: floorY - 20, w: 90 }
    ];
    let platforms = [];
    let spikes = [];
    let walkingMonsters = [];
    let flyingMonsters = [];
    let exitPortal = { x: 2456, y: floorY - 72, w: 72, h: 72, direction: 'right' };
    let currentStage = 1;
    let running = false;
    let completed = false;
    let paused = false;
    let control = 'waiting';
    let controlUntil = 0;
    let possessionFill = 0;
    let cameraX = 0;
    let stageCameraAnchor = 0.34;
    let lastTime = 0;
    let animationId = 0;
    let deaths = 0;
    let shake = 0;
    let jumpGlow = 0;
    let spawnGlow = 0;
    let spawnOrigin = null;
    let spinAngle = 0;
    let spinTime = 0;
    let stageTransitionStarted = 0;
    let stageTransitionLoaded = false;
    let pauseStartedAt = 0;
    let visualPausedDuration = 0;
    let pauseToggleLockedUntil = 0;
    let screenTransitioning = false;
    let interstitialPending = false;
    let deathInterstitialDue = false;
    let deathRespawnPending = false;
    let platformPauseWasRunning = false;
    let pausedPlayerAnchor = null;
    let resumeSupportPlatform = null;

    async function requestInterstitial() {
        if (interstitialPending || typeof platform?.showInterstitial !== 'function') return false;
        interstitialPending = true;
        const previousPlatformMuted = platformMuted;
        platformMuted = true;
        updateMuteState();
        try {
            return await platform.showInterstitial();
        } finally {
            platformMuted = previousPlatformMuted;
            updateMuteState();
            interstitialPending = false;
        }
    }

    function hideGameMenuButton() {
        if (!gameMenuButton) return;
        gameMenuButton.hidden = true;
        gameMenuButton.classList.add('hidden');
    }

    function showGameMenuButton() {
        if (!gameMenuButton) return;
        gameMenuButton.hidden = false;
        gameMenuButton.classList.remove('hidden');
    }

    let deathAnimation = null;
    const jumpSparks = [];
    const noteFrequencies = [130.81, 146.83, 164.81, 174.61, 196, 220, 246.94, 261.63];
    const backgroundPattern = [0, 2, 4, 7, 6, 4, 2, 1, 3, 5, 7, 4, 2, 5, 1, 0];
    const stageProgressKey = 'doxx-click-stage';
    const deathCountKey = 'doxx-click-deaths';
    const mutePreferenceKey = 'doxx-click-muted';
    let unlockedStage = 1;
    let audioContext = null;
    let audioMaster = null;
    let backgroundStep = 0;
    let backgroundTimer = 0;
    let backgroundStarting = false;
    let musicScene = 'silent';
    let platformMuted = document.documentElement.dataset.platformMuted === 'true';
    let userMuted = false;
    try {
        userMuted = progressStorage.getItem(mutePreferenceKey) === 'true';
    } catch (error) {
        userMuted = false;
    }

    function updateMuteState() {
        const muted = platformMuted || userMuted;
        if (audioMaster) audioMaster.gain.value = muted ? 0 : 0.864;
        if (muteButton) {
            muteButton.textContent = muted ? '\u2593\u0338\u2592' : '\u266A';
            muteButton.setAttribute('aria-pressed', String(muted));
            muteButton.setAttribute('aria-label', muted ? labels.unmute : labels.mute);
        }
    }

    window.addEventListener('doxx-platform-audio', event => {
        platformMuted = Boolean(event.detail?.muted);
        updateMuteState();
    });
    window.addEventListener('doxx-platform-pause', () => {
        platformPauseWasRunning = running && !paused;
        if (platformPauseWasRunning) pauseButton?.click();
    });
    window.addEventListener('doxx-platform-resume', () => {
        if (platformPauseWasRunning && paused) pauseButton?.click();
        platformPauseWasRunning = false;
    });
    updateMuteState();
    const brokenText = {
        waiting: '\u2591\u2592 // \u29D6\u29D7 // \u2592\u2591',
        player: '\u2593\u0338\u2592 \u2371\u0338\u2371 :: \u2573\u2572',
        entity: '\u2573\u0338\u2572 \u2593\u2593 // \u2371\u0338\u2591',
        escaped: '\u2591\u2573\u2592 :: \u29D6\u29D6 :: \u2593\u2572\u2591'
    };
    const corruptGlyphs = ['\u2591', '\u2592', '\u2593', '\u2573', '\u2572', '\u29D6', '\u29D7', '\u2371', '\u25CA', '\u25C7'];
    try {
        unlockedStage = Math.max(1, Number.parseInt(progressStorage.getItem(stageProgressKey) || '1', 10) || 1);
        deaths = Math.max(0, Number.parseInt(progressStorage.getItem(deathCountKey) || '0', 10) || 0);
    } catch (error) {
        unlockedStage = 1;
        deaths = 0;
    }

    window.addEventListener('doxx-platform-ready', () => {
        try {
            unlockedStage = Math.max(unlockedStage, Number.parseInt(progressStorage.getItem(stageProgressKey) || '1', 10) || 1);
            deaths = Math.max(deaths, Number.parseInt(progressStorage.getItem(deathCountKey) || '0', 10) || 0);
            userMuted = progressStorage.getItem(mutePreferenceKey) === 'true';
            updateMuteState();
            if (stageMenu && !stageMenu.classList.contains('hidden')) renderStageMenu();
        } catch (error) {
            // Local progress remains active when platform data is unavailable.
        }
    });

    function saveStageProgress(stage) {
        unlockedStage = Math.max(unlockedStage, stage);
        try {
            progressStorage.setItem(stageProgressKey, String(unlockedStage));
        } catch (error) {
            // Progress remains available for this session when storage is unavailable.
        }
        platform?.setLevel?.(Math.min(maxStage, unlockedStage));
    }

    function recordDeath() {
        deaths += 1;
        try {
            progressStorage.setItem(deathCountKey, String(deaths));
        } catch (error) {
            // The total remains available for this session when storage is unavailable.
        }
        platform?.setScore?.(deaths);
    }

    function cloneRect(rect) {
        return { ...rect };
    }

    function reverseRects(rects) {
        return rects.map(rect => ({ ...rect, x: worldWidth - rect.x - rect.w }));
    }

    function tileStageRects(rects) {
        const tiled = [];
        for (let offset = 0; offset < worldWidth; offset += baseWorldWidth) {
            for (const rect of rects) {
                const x = rect.x + offset;
                if (x >= worldWidth) continue;
                const width = Math.min(rect.w, worldWidth - x);
                if (width > 0) tiled.push({ ...rect, x, w: width });
            }
        }
        return tiled;
    }

    function getStageDefinition(stage) {
        worldWidth = baseWorldWidth + (stage - 1) * stageDistanceStep;
        const templateIndex = (stage - 1) % 10;
        const reverse = [2, 5, 7, 9].includes(templateIndex);
        const tiledPlatforms = tileStageRects(basePlatforms);
        const tiledSpikes = tileStageRects(baseSpikes);
        const stagePlatforms = reverse ? reverseRects(tiledPlatforms) : tiledPlatforms.map(cloneRect);
        const stageSpikes = reverse ? reverseRects(tiledSpikes) : tiledSpikes.map(cloneRect);
        const definitions = [
            { spawn: [90, 272], exit: [2474, floorY - 92, 'right'] },
            { spawn: [90, 272], exit: [2390, 252, 'upper-right'], extra: [2320, 344, 220, 18] },
            { spawn: [2440, 272], exit: [72, floorY - 92, 'left'] },
            { spawn: [2360, 272], exit: [1323, 188, 'up'], extra: [1260, 280, 190, 18] },
            { spawn: [90, 272], exit: [1990, 208, 'upper-right'], extra: [1960, 300, 170, 18] },
            { spawn: [2440, 272], exit: [2050, 252, 'upper-left'] },
            { spawn: [90, 272], exit: [2115, 258, 'upper-right'] },
            { spawn: [2440, 272], exit: [1690, 234, 'upper-left'] },
            { spawn: [90, 272], exit: [1030, 188, 'up'], extra: [980, 280, 180, 18] },
            { spawn: [2440, 272], exit: [80, 238, 'upper-left'], extra: [60, 330, 190, 18] }
        ];
        const selected = definitions[templateIndex];
        const startsOnRight = selected.spawn[0] > baseWorldWidth * 0.5;
        const spawn = { x: startsOnRight ? worldWidth - 162 : 90, y: selected.spawn[1] };
        const exit = spawn.x < worldWidth * 0.5
            ? { x: worldWidth - 144, y: floorY - 72, w: 72, h: 72, direction: 'right' }
            : { x: 72, y: floorY - 72, w: 72, h: 72, direction: 'left' };
        stagePlatforms.push(
            { x: 0, y: floorY, w: 520, h: 120 },
            { x: worldWidth - 520, y: floorY, w: 520, h: 120 }
        );
        if (selected.extra) {
            const [x, y, w, h] = selected.extra;
            stagePlatforms.push({ x, y, w, h });
        }
        return {
            platforms: stagePlatforms,
            spikes: stageSpikes.filter(spike => {
                const outsideSpawn = spike.x + spike.w < spawn.x - spawnSafeRadius
                    || spike.x > spawn.x + player.w + spawnSafeRadius;
                const outsideExit = spike.x + spike.w < exit.x - exitSafeRadius
                    || spike.x > exit.x + exit.w + exitSafeRadius;
                return outsideSpawn && outsideExit;
            }),
            spawn,
            exit
        };
    }

    function createStageMonsters(stage, spawn, exit) {
        const distanceMonsters = stage <= 1 ? 0 : Math.ceil((worldWidth - baseWorldWidth) / 650);
        const difficultyMonsters = Math.ceil(Math.max(0, stage - 1) * 15 / (maxStage - 1));
        const required = stage <= 1 ? 0 : Math.min(140, distanceMonsters + difficultyMonsters);
        const difficultyStage = stage * 0.5;
        const floorPlatforms = platforms.filter(platform => platform.y === floorY && platform.w >= 120);
        walkingMonsters = [];
        flyingMonsters = [];
        let candidate = 0;
        while (walkingMonsters.length + flyingMonsters.length < required && candidate < required * 12 + 40) {
            const hash = ((candidate + 1) * 2654435761 + stage * 1013904223) >>> 0;
            const flying = candidate % 2 === 1;
            if (flying) {
                const x = 150 + (hash % (worldWidth - 300));
                const rangeX = 38 + (hash % 48);
                const flightNearExit = x + rangeX + 24 > exit.x - exitSafeRadius
                    && x - rangeX < exit.x + exit.w + exitSafeRadius;
                if (Math.abs(x - spawn.x) > spawnSafeRadius + rangeX && !flightNearExit) {
                    flyingMonsters.push({
                        x, baseX: x, y: 170 + (hash % 145), baseY: 170 + (hash % 145), w: 24, h: 24,
                        rangeX, speed: 0.9 + difficultyStage * 0.026 + (candidate % 5) * 0.07,
                        phase: stage * 0.7 + candidate * 1.17
                    });
                }
            } else {
                const platform = floorPlatforms[hash % floorPlatforms.length];
                const travel = Math.max(20, platform.w - 100);
                const x = platform.x + 45 + (hash % travel);
                const minX = Math.max(platform.x + 12, x - 38);
                const maxX = Math.min(platform.x + platform.w - 40, x + 38);
                const patrolHitsSpike = spikes.some(spike =>
                    maxX + 24 > spike.x && minX < spike.x + spike.w
                );
                const patrolNearExit = maxX + 24 > exit.x - exitSafeRadius
                    && minX < exit.x + exit.w + exitSafeRadius;
                if (!patrolHitsSpike && !patrolNearExit && Math.abs(x - spawn.x) > spawnSafeRadius + 38) {
                    walkingMonsters.push({
                        x, startX: x, minX, maxX, y: floorY - 24,
                        w: 24, h: 24, speed: 56 + difficultyStage * 1.8 + (candidate % 6) * 3.5, direction: 1
                    });
                }
            }
            candidate += 1;
        }
    }

    function loadStage(stage) {
        currentStage = Math.max(1, Math.min(maxStage, stage));
        const definition = getStageDefinition(currentStage);
        platforms = definition.platforms;
        spikes = definition.spikes;
        exitPortal = definition.exit;
        checkpoint.x = definition.spawn.x;
        checkpoint.y = definition.spawn.y;
        stageCameraAnchor = definition.exit.x < definition.spawn.x ? 0.66 : 0.34;
        platform?.setLevel?.(currentStage);
        createStageMonsters(currentStage, definition.spawn, definition.exit);
        completed = false;
        running = true;
        stageTransitionStarted = 0;
        resetMonsters();
        resetPlayer();
        cameraX = Math.max(0, Math.min(worldWidth - canvas.width, checkpoint.x - canvas.width * stageCameraAnchor));
    }

    function runGlitchTransition(swapScreen) {
        if (screenTransitioning) return;
        screenTransitioning = true;
        const getVisibleScreen = () => [intro, stageMenu, gameWrap].find(screen => screen && !screen.classList.contains('hidden'));
        const outgoingScreen = getVisibleScreen();
        if (!outgoingScreen?.animate) {
            swapScreen();
            screenTransitioning = false;
            return;
        }
        outgoingScreen.animate([
            { opacity: 1, transform: 'translateX(0)', filter: 'none', clipPath: 'inset(0 0 0 0)' },
            { opacity: 0.68, transform: 'translateX(-4px) scale(0.998)', filter: 'contrast(1.35) hue-rotate(18deg)', clipPath: 'inset(3% 0 5% 0)', offset: 0.55 },
            { opacity: 0, transform: 'translateX(5px) scale(0.995)', filter: 'blur(2px) contrast(1.55)', clipPath: 'inset(10% 0 12% 0)' }
        ], { duration: 150, easing: 'cubic-bezier(.4,0,.7,1)' });
        window.setTimeout(() => {
            swapScreen();
            const incomingScreen = getVisibleScreen();
            incomingScreen?.animate([
                { opacity: 0, transform: 'translateX(-5px) scale(0.995)', filter: 'blur(2px) contrast(1.55)', clipPath: 'inset(10% 0 12% 0)' },
                { opacity: 0.72, transform: 'translateX(3px) scale(0.998)', filter: 'contrast(1.25) hue-rotate(-14deg)', clipPath: 'inset(2% 0 4% 0)', offset: 0.48 },
                { opacity: 1, transform: 'translateX(0)', filter: 'none', clipPath: 'inset(0 0 0 0)' }
            ], { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
            window.setTimeout(() => { screenTransitioning = false; }, 225);
        }, 145);
    }

    function renderStageMenu() {
        if (!stageGrid) return;
        stageGrid.replaceChildren();
        const highestPlayable = Math.min(maxStage, unlockedStage);
        for (let stage = 1; stage <= maxStage; stage += 1) {
            const button = document.createElement('button');
            const unlocked = stage <= highestPlayable;
            button.type = 'button';
            button.textContent = stage === maxStage ? '\uFFFD' : String(stage).padStart(2, '0');
            button.disabled = !unlocked;
            button.className = unlocked
                ? 'rounded-md border border-fuchsia-950 bg-zinc-900 px-1 py-2 text-[11px] font-black text-fuchsia-300 hover:border-fuchsia-500 hover:bg-fuchsia-950'
                : 'cursor-not-allowed rounded-md border border-zinc-900 bg-zinc-950 px-1 py-2 text-[11px] font-black text-zinc-800';
            button.setAttribute('aria-label', unlocked ? labels.stage(stage) : labels.stageLocked(stage));
            if (unlocked) button.addEventListener('click', () => runGlitchTransition(() => startGame(stage)));
            stageGrid.append(button);
        }
    }

    function showStageMenu(withGlitch = false) {
        platform?.gameplayStop();
        musicScene = 'silent';
        stopBackgroundMusic();
        running = false;
        paused = false;
        hideGameMenuButton();
        completed = false;
        stageTransitionStarted = 0;
        intro.classList.add('hidden');
        gameWrap.classList.add('hidden');
        stageMenu?.classList.remove('hidden');
        restartButton?.classList.add('hidden');
        renderStageMenu();
        if (withGlitch && stageMenu?.animate) {
            stageMenu.animate([
                { opacity: 0, transform: 'translateX(-16px)', filter: 'contrast(2) hue-rotate(70deg)' },
                { opacity: 0.45, transform: 'translateX(10px)', filter: 'contrast(1.8) hue-rotate(-35deg)', offset: 0.28 },
                { opacity: 0.72, transform: 'translateX(-5px)', filter: 'contrast(1.35)', offset: 0.58 },
                { opacity: 1, transform: 'translateX(0)', filter: 'none' }
            ], { duration: 420, easing: 'steps(5, end)' });
        }
    }

    function showTitleScreen(withGlitch = false) {
        platform?.gameplayStop();
        musicScene = 'silent';
        stopBackgroundMusic();
        running = false;
        paused = false;
        completed = false;
        stageTransitionStarted = 0;
        hideGameMenuButton();
        gameWrap.classList.add('hidden');
        stageMenu?.classList.add('hidden');
        intro.classList.remove('hidden');
        startButton.classList.remove('hidden');
        if (withGlitch && intro.animate) {
            intro.animate([
                { opacity: 0, transform: 'translateX(-7px)', filter: 'blur(2px) contrast(1.6)' },
                { opacity: 0.7, transform: 'translateX(4px)', filter: 'contrast(1.3) hue-rotate(-18deg)', offset: 0.5 },
                { opacity: 1, transform: 'translateX(0)', filter: 'none' }
            ], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
        }
    }

    function showEnding() {
        platform?.gameplayStop();
        platform?.happyTime();
        musicScene = 'ending';
        ensureAudio();
        startBackgroundMusic();
        intro.classList.add('hidden');
        stageMenu?.classList.add('hidden');
        gameWrap.classList.remove('hidden');
        restartButton?.classList.add('hidden');
        pauseButton?.classList.add('hidden');
        hideGameMenuButton();
        currentStage = maxStage;
        running = false;
        completed = true;
        stageTransitionStarted = performance.now() - 900;
        status.textContent = brokenText.escaped;
        lastTime = performance.now();
        if (!animationId) animationId = requestAnimationFrame(frame);
    }

    function ensureAudio() {
        if (!audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return false;
            audioContext = new AudioContextClass();
            audioMaster = audioContext.createGain();
            audioMaster.gain.value = platformMuted || userMuted ? 0 : 0.864;
            audioMaster.connect(audioContext.destination);
        }
        if (audioContext.state === 'suspended') audioContext.resume();
        return true;
    }

    function playTone(noteIndex, delay = 0, duration = 0.12, volume = 0.1, wave = 'square') {
        if (!audioContext || !audioMaster) return;
        const start = audioContext.currentTime + delay;
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = wave;
        oscillator.frequency.value = noteFrequencies[Math.max(0, Math.min(7, noteIndex))];
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(audioMaster);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
    }

    function playSequence(notes, spacing, duration, volume, wave = 'square') {
        notes.forEach((note, index) => playTone(note, index * spacing, duration, volume, wave));
    }

    function stopBackgroundMusic() {
        if (backgroundTimer) window.clearTimeout(backgroundTimer);
        backgroundTimer = 0;
        backgroundStarting = false;
        backgroundStep = 0;
    }

    function pauseBackgroundMusic() {
        if (backgroundTimer) window.clearTimeout(backgroundTimer);
        backgroundTimer = 0;
        backgroundStarting = false;
        if (audioContext?.state === 'running') {
            audioContext.suspend().catch(() => {});
        }
    }

    function resumeBackgroundMusic() {
        if (musicScene === 'silent' || !ensureAudio()) return;
        audioContext.resume()
            .then(() => startBackgroundMusic())
            .catch(() => {});
    }

    function playUiBeat() {
        if (!ensureAudio()) return;
        const play = () => {
            const audibleNotes = [4, 5, 6, 7];
            const note = audibleNotes[Math.floor(Math.random() * audibleNotes.length)];
            playTone(note, 0, 0.09, 0.14, 'square');
            if (Math.random() > 0.35) {
                const accent = audibleNotes[(audibleNotes.indexOf(note) + 1 + Math.floor(Math.random() * 2)) % audibleNotes.length];
                playTone(accent, 0.05, 0.075, 0.09, 'square');
            }
        };
        if (audioContext.state === 'running') play();
        else audioContext.resume().then(play).catch(() => {});
    }

    function startBackgroundMusic() {
        if (musicScene === 'silent' || backgroundTimer || backgroundStarting || !ensureAudio()) return;
        if (audioContext.state !== 'running') {
            backgroundStarting = true;
            audioContext.resume().then(() => {
                backgroundStarting = false;
                startBackgroundMusic();
            }).catch(() => {
                backgroundStarting = false;
            });
            return;
        }
        const playNextBeat = () => {
            if (!document.hidden) {
                const endingSequence = completed && currentStage >= maxStage && stageTransitionStarted;
                const entityPossession = control === 'entity';
                const patternIndex = endingSequence
                    ? (backgroundStep * 5 + (backgroundStep % 2)) % backgroundPattern.length
                    : entityPossession
                    ? (backgroundPattern.length - 1 - ((backgroundStep * 3) % backgroundPattern.length))
                    : backgroundStep % backgroundPattern.length;
                const melodyNote = backgroundPattern[patternIndex];
                if (endingSequence) {
                    playTone(melodyNote % 3, 0, 0.42, 0.13, 'sawtooth');
                    playTone((melodyNote + 1) % 4, 0.035, 0.38, 0.1, 'square');
                    if (backgroundStep % 3 === 0) playTone(7, 0.08, 0.18, 0.075, 'sawtooth');
                } else {
                    playTone(melodyNote, 0, entityPossession ? 0.22 : 0.34, 0.1, entityPossession ? 'sawtooth' : 'triangle');
                }
                if (!endingSequence && entityPossession) {
                    playTone((melodyNote + 1) % noteFrequencies.length, 0.045, 0.26, 0.072, 'square');
                } else if (!endingSequence && backgroundStep % 2 === 0) {
                    const echoNote = backgroundPattern[(backgroundStep + 5) % backgroundPattern.length];
                    playTone(echoNote, 0.12, 0.24, 0.05, 'sine');
                }
                backgroundStep += 1;
            }
            const endingSequence = completed && currentStage >= maxStage && stageTransitionStarted;
            const nextDelay = endingSequence
                ? 145 + (backgroundStep % 3) * 18
                : control === 'entity' ? 170 + (backgroundStep % 3) * 25 : 280 + (backgroundStep % 4) * 45;
            backgroundTimer = window.setTimeout(playNextBeat, nextDelay);
        };
        playNextBeat();
    }

    function corruptText(text, blockIndex = 0) {
        return Array.from(text).map((character, index) => {
            if (/\s/.test(character)) return character;
            return corruptGlyphs[(character.codePointAt(0) + index + blockIndex * 3) % corruptGlyphs.length];
        }).join('');
    }

    function resetPlayer() {
        player.x = checkpoint.x;
        player.y = checkpoint.y;
        player.vx = 0;
        player.vy = 0;
        facingDirection = 1;
        player.jumpsLeft = 2;
        spinAngle = 0;
        spinTime = 0;
        keys.left = false;
        keys.right = false;
        keys.jump = false;
        spawnGlow = 0.46;
        spawnOrigin = {
            x: player.x + player.w * 0.5,
            y: player.y + player.h * 0.5
        };
        emitSpawnSparks();
        control = 'waiting';
        controlUntil = 0;
        possessionFill = 0;
        status.textContent = brokenText.waiting;
        timerBox?.classList.remove('is-low-time');
        if (timerBar) {
            timerBar.style.width = '0%';
            timerBar.setAttribute('aria-valuenow', '0');
        }
        shake = 12;
    }

    function beginPlayerControl(now) {
        if (!running || completed || control === 'player' || control === 'entity') return;
        control = 'player';
        possessionFill = 0;
        controlUntil = now + 5000;
        status.textContent = brokenText.player;
        timerBox?.classList.remove('is-low-time');
        playSequence([0, 2], 0.06, 0.11, 0.07, 'triangle');
    }

    function beginEntityControl(now) {
        control = 'entity';
        possessionFill = 1;
        controlUntil = now + 3000;
        status.textContent = brokenText.entity;
        playSequence([7, 4, 1], 0.07, 0.18, 0.11, 'sawtooth');
    }

    function updateControl(now) {
        if (control === 'player' && now >= controlUntil) beginEntityControl(now);
        if (control === 'entity' && now >= controlUntil) {
            control = 'waiting';
            controlUntil = 0;
            possessionFill = 0;
            status.textContent = brokenText.waiting;
            timerBox?.classList.remove('is-low-time');
        }
        const duration = control === 'player' ? 5000 : control === 'entity' ? 3000 : 1;
        const ratio = controlUntil ? Math.max(0, Math.min(1, (controlUntil - now) / duration)) : 0;
        possessionFill = control === 'entity' ? 1 : control === 'player' ? 1 - ratio : 0;
        if (timerBar) {
            timerBar.style.width = `${ratio * 100}%`;
            timerBar.style.backgroundColor = '#f0abfc';
            timerBar.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
        }
        timerBox?.classList.toggle('is-low-time', control !== 'waiting' && ratio <= 1 / 3 && ratio > 0);
    }

    function entityInput() {
        return {
            left: false,
            right: true,
            jump: false
        };
    }

    function emitJumpSparks() {
        for (let index = 0; index < 7; index += 1) {
            const life = 0.28 + Math.random() * 0.24;
            jumpSparks.push({
                x: player.x + player.w * 0.5,
                y: player.y + player.h * 0.72,
                vx: (Math.random() - 0.5) * 260,
                vy: 45 + Math.random() * 190,
                life,
                maxLife: life,
                length: 3 + Math.random() * 6,
                color: '#fff7a3'
            });
        }
    }

    function resetMonsters() {
        walkingMonsters.forEach(monster => {
            monster.x = monster.startX;
            monster.direction = 1;
        });
        flyingMonsters.forEach(monster => {
            monster.x = monster.baseX;
            monster.y = monster.baseY;
            monster.direction = 1;
        });
    }

    function updateMonsters(dt, now) {
        walkingMonsters.forEach(monster => {
            monster.x += monster.speed * monster.direction * dt;
            if (monster.x <= monster.minX || monster.x >= monster.maxX) {
                monster.x = Math.max(monster.minX, Math.min(monster.maxX, monster.x));
                monster.direction *= -1;
            }
        });
        flyingMonsters.forEach(monster => {
            const time = now * 0.001 * monster.speed + monster.phase;
            const previousX = monster.x;
            monster.x = monster.baseX + Math.sin(time) * monster.rangeX;
            monster.y = monster.baseY + Math.cos(time * 1.7) * 24;
            if (monster.x < previousX) monster.direction = -1;
            else if (monster.x > previousX) monster.direction = 1;
        });
    }

    function overlapsPlayer(monster) {
        return player.x + player.w > monster.x
            && player.x < monster.x + monster.w
            && player.y + player.h > monster.y
            && player.y < monster.y + monster.h;
    }

    function emitDeathSparks() {
        for (let index = 0; index < 12; index += 1) {
            const life = 0.38 + Math.random() * 0.32;
            jumpSparks.push({
                x: player.x + player.w * 0.5,
                y: player.y + player.h * 0.5,
                vx: (Math.random() - 0.5) * 360,
                vy: -180 + Math.random() * 340,
                life,
                maxLife: life,
                length: 4 + Math.random() * 8,
                color: index % 2 ? '#fde047' : '#fff7a3'
            });
        }
    }

    function emitSpawnSparks() {
        for (let index = 0; index < 10; index += 1) {
            const angle = (Math.PI * 2 * index) / 10 + Math.random() * 0.18;
            const speed = 130 + Math.random() * 170;
            const life = 0.3 + Math.random() * 0.2;
            jumpSparks.push({
                x: player.x + player.w * 0.5,
                y: player.y + player.h * 0.5,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life,
                maxLife: life,
                length: 4 + Math.random() * 7,
                color: index % 2 ? '#fde047' : '#fef9c3'
            });
        }
    }

    function beginDeathAnimation() {
        if (deathAnimation) return;
        platform?.gameplayStop();
        recordDeath();
        deathInterstitialDue = deaths % 4 === 0;
        deathRespawnPending = false;
        deathAnimation = {
            time: 0.82,
            struck: false,
            explosionTime: 0,
            impactX: player.x + player.w * 0.5,
            impactY: player.y + player.h * 0.5
        };
        keys.left = false;
        keys.right = false;
        keys.jump = false;
        control = 'waiting';
        controlUntil = 0;
        shake = 4;
    }

    function updateDeathAnimation(dt) {
        deathAnimation.time -= dt;
        if (!deathAnimation.struck && deathAnimation.time <= 0.77) {
            deathAnimation.struck = true;
            deathAnimation.explosionTime = 0.34;
            playSequence([7, 5, 3, 1, 0], 0.035, 0.12, 0.13, 'sawtooth');
            emitDeathSparks();
            shake = 22;
        }
        if (deathAnimation.explosionTime > 0) {
            deathAnimation.explosionTime = Math.max(0, deathAnimation.explosionTime - dt);
        }
        jumpGlow = Math.max(jumpGlow, Math.min(1, deathAnimation.time) * 0.22);
        for (let index = jumpSparks.length - 1; index >= 0; index -= 1) {
            const spark = jumpSparks[index];
            spark.life -= dt;
            if (spark.life <= 0) {
                jumpSparks.splice(index, 1);
                continue;
            }
            spark.x += spark.vx * dt;
            spark.y += spark.vy * dt;
            spark.vy += 240 * dt;
        }
        shake *= Math.pow(0.02, dt);
        if (deathAnimation.time <= 0) {
            if (deathInterstitialDue) {
                if (deathRespawnPending) return;
                deathRespawnPending = true;
                requestInterstitial().finally(() => {
                    deathInterstitialDue = false;
                    deathRespawnPending = false;
                    deathAnimation = null;
                    resetPlayer();
                    platform?.gameplayStart();
                });
                return;
            }
            deathAnimation = null;
            resetPlayer();
            platform?.gameplayStart();
        }
    }

    function drawDeathLightning() {
        if (!deathAnimation || deathAnimation.time < 0.42) return;
        const descent = deathAnimation.struck ? 1 : Math.min(1, (0.82 - deathAnimation.time) / 0.05);
        const targetX = player.x + player.w * 0.5;
        const targetY = player.y + player.h * 0.5;
        const endY = -20 + (targetY + 20) * descent;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(targetX + (Math.random() - 0.5) * 34, -20);
        const segments = 10;
        for (let index = 1; index <= segments; index += 1) {
            const ratio = index / segments;
            const y = -20 + (endY + 20) * ratio;
            const x = index === segments
                ? targetX
                : targetX + (Math.random() - 0.5) * (42 * (1 - ratio * 0.45));
            ctx.lineTo(x, y);
        }
        const fade = deathAnimation.struck ? Math.max(0, (deathAnimation.time - 0.42) / 0.22) : 1;
        ctx.globalAlpha = fade;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 22;
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#fef9c3';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
        if (deathAnimation.explosionTime > 0) {
            const remaining = deathAnimation.explosionTime / 0.34;
            const progress = 1 - remaining;
            const radius = 7 + progress * 42;
            ctx.save();
            const glow = ctx.createRadialGradient(
                deathAnimation.impactX,
                deathAnimation.impactY,
                0,
                deathAnimation.impactX,
                deathAnimation.impactY,
                radius
            );
            glow.addColorStop(0, `rgba(254, 249, 195, ${remaining * 0.76})`);
            glow.addColorStop(0.45, `rgba(250, 204, 21, ${remaining * 0.42})`);
            glow.addColorStop(1, 'rgba(234, 179, 8, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(deathAnimation.impactX, deathAnimation.impactY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = remaining;
            ctx.strokeStyle = '#fef9c3';
            ctx.lineWidth = 3;
            ctx.shadowColor = '#fde047';
            ctx.shadowBlur = 24;
            ctx.beginPath();
            ctx.arc(deathAnimation.impactX, deathAnimation.impactY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function update(dt, now) {
        if (deathAnimation) {
            updateDeathAnimation(dt);
            return;
        }
        updateControl(now);
        updateMonsters(dt, now);
        if (control === 'waiting' && (keys.left || keys.right || keys.jump)) beginPlayerControl(now);
        const input = control === 'player' ? keys : control === 'entity' ? entityInput() : { left: false, right: false, jump: false };
        if (control === 'entity') input.jump = keys.jump;
        const acceleration = control === 'entity' ? 1485 : 760;
        const maxSpeed = control === 'entity' ? 368 : 220;
        if (input.left) player.vx -= acceleration * dt;
        if (input.right) player.vx += acceleration * dt;
        if (control === 'entity' && keys.left) player.vx -= 2280 * dt;
        if (!input.left && !input.right) player.vx *= Math.pow(0.001, dt);
        player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
        if (player.vx < -12) facingDirection = -1;
        else if (player.vx > 12) facingDirection = 1;
        const startedGrounded = player.grounded;
        if (input.jump && player.jumpsLeft > 0) {
            const isDoubleJump = player.jumpsLeft === 1;
            player.vy = -430;
            player.grounded = false;
            player.jumpsLeft -= 1;
            jumpGlow = 0.22;
            if (isDoubleJump) {
                spinAngle = 0;
                spinTime = 0.42;
            }
            playSequence(isDoubleJump ? [2, 5, 7] : [1, 4], 0.035, 0.09, 0.09, 'square');
            emitJumpSparks();
        }
        keys.jump = false;
        player.vy += 1040 * dt;
        player.x += player.vx * dt;
        player.x = Math.max(0, Math.min(worldWidth - player.w, player.x));
        const previousBottom = player.y + player.h;
        player.y += player.vy * dt;
        player.grounded = false;
        for (const platform of platforms) {
            const horizontal = player.x + player.w > platform.x && player.x < platform.x + platform.w;
            const preservedSupport = platform === resumeSupportPlatform
                && startedGrounded
                && Math.abs(previousBottom - platform.y) <= 8;
            const crossedTop = (previousBottom <= platform.y + 1 && player.y + player.h >= platform.y)
                || preservedSupport;
            if (horizontal && crossedTop && player.vy >= 0) {
                player.y = platform.y - player.h;
                player.vy = 0;
                player.grounded = true;
                player.jumpsLeft = 2;
            }
        }
        resumeSupportPlatform = null;
        if (startedGrounded && !player.grounded) player.jumpsLeft = Math.min(player.jumpsLeft, 1);
        const hitSpike = spikes.some(spike => player.x + player.w > spike.x && player.x < spike.x + spike.w && player.y + player.h > spike.y);
        const hitMonster = walkingMonsters.some(overlapsPlayer) || flyingMonsters.some(overlapsPlayer);
        if (player.y > canvas.height - player.h || hitSpike || hitMonster) {
            beginDeathAnimation();
            return;
        }
        const enteredExit = player.x + player.w > exitPortal.x
            && player.x < exitPortal.x + exitPortal.w
            && player.y + player.h > exitPortal.y
            && player.y < exitPortal.y + exitPortal.h;
        if (enteredExit) {
            platform?.gameplayStop();
            const clearedStage = currentStage;
            completed = true;
            running = false;
            control = 'waiting';
            stageTransitionLoaded = false;
            stageTransitionStarted = currentStage >= maxStage ? now - 900 : now;
            if (currentStage >= maxStage) {
                pauseButton?.classList.add('hidden');
                hideGameMenuButton();
            }
            saveStageProgress(currentStage + 1);
            if (clearedStage % 5 === 0) {
                requestInterstitial();
            } else if (clearedStage % 3 === 0) {
                requestInterstitial();
            }
            status.textContent = brokenText.escaped;
            timerBox?.classList.remove('is-low-time');
            playSequence([7, 6, 5, 4, 3, 2, 1, 0], 0.055, 0.16, 0.1, 'square');
        }
        cameraX += ((player.x - canvas.width * stageCameraAnchor) - cameraX) * Math.min(1, dt * 5);
        cameraX = Math.max(0, Math.min(worldWidth - canvas.width, cameraX));
        shake *= Math.pow(0.02, dt);
        jumpGlow = Math.max(0, jumpGlow - dt);
        spawnGlow = Math.max(0, spawnGlow - dt);
        if (spawnGlow === 0) spawnOrigin = null;
        if (spinTime > 0) {
            spinAngle += (Math.PI * 2 * dt) / 0.42;
            spinTime = Math.max(0, spinTime - dt);
            if (spinTime === 0) spinAngle = 0;
        }
        for (let index = jumpSparks.length - 1; index >= 0; index -= 1) {
            const spark = jumpSparks[index];
            spark.life -= dt;
            if (spark.life <= 0) {
                jumpSparks.splice(index, 1);
                continue;
            }
            spark.x += spark.vx * dt;
            spark.y += spark.vy * dt;
            spark.vy += 240 * dt;
        }
    }

    function drawBackground(now) {
        const possessed = control === 'entity';
        const horizon = Math.round(canvas.height * 0.58);
        const centerX = Math.round(canvas.width * 0.5);
        const sky = ctx.createLinearGradient(0, 0, 0, horizon + 30);
        sky.addColorStop(0, possessed ? '#070004' : '#0b0209');
        sky.addColorStop(0.5, possessed ? '#21040a' : '#2b0617');
        sky.addColorStop(1, possessed ? '#4f0b08' : '#651311');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // The eye sits behind the mountains and follows the player's screen position.
        const eyeX = centerX;
        const eyeY = Math.round(canvas.height * 0.18);
        const eyeW = Math.round(canvas.width * 0.15);
        const eyeH = Math.round(canvas.height * 0.085);
        ctx.save();
        ctx.fillStyle = possessed ? '#330410' : '#4a071c';
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeW - 16, eyeY);
        ctx.lineTo(eyeX - eyeW * 0.58, eyeY - eyeH - 13);
        ctx.lineTo(eyeX + eyeW * 0.58, eyeY - eyeH - 13);
        ctx.lineTo(eyeX + eyeW + 16, eyeY);
        ctx.lineTo(eyeX + eyeW * 0.58, eyeY + eyeH + 13);
        ctx.lineTo(eyeX - eyeW * 0.58, eyeY + eyeH + 13);
        ctx.closePath();
        ctx.fill();
        ctx.shadowColor = possessed ? '#7f1d1d' : '#881337';
        ctx.shadowBlur = 14;
        ctx.fillStyle = possessed ? 'rgba(218,188,194,.82)' : 'rgba(226,216,220,.84)';
        ctx.beginPath();
        ctx.moveTo(eyeX - eyeW, eyeY);
        ctx.lineTo(eyeX - eyeW * 0.55, eyeY - eyeH);
        ctx.lineTo(eyeX + eyeW * 0.55, eyeY - eyeH);
        ctx.lineTo(eyeX + eyeW, eyeY);
        ctx.lineTo(eyeX + eyeW * 0.55, eyeY + eyeH);
        ctx.lineTo(eyeX - eyeW * 0.55, eyeY + eyeH);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        const playerScreenX = player.x - cameraX;
        const pupilX = eyeX + Math.max(-28, Math.min(28, (playerScreenX - centerX) * 0.075));
        const pupilY = eyeY + Math.max(-7, Math.min(9, (player.y - floorY * 0.5) * 0.025));
        ctx.fillStyle = '#09050d';
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, Math.round(eyeH * 0.72), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const pulse = 0.1 + Math.sin(now * 0.0015) * 0.02;
        ctx.fillStyle = `rgba(109,40,217,${pulse})`;
        ctx.fillRect(0, horizon - 18, canvas.width, 60);

        const groundStart = Math.round(canvas.height * 0.5);
        const lowerGlow = ctx.createLinearGradient(0, groundStart, 0, canvas.height);
        lowerGlow.addColorStop(0, possessed ? 'rgba(112,18,10,.9)' : 'rgba(158,39,13,.9)');
        lowerGlow.addColorStop(0.35, possessed ? 'rgba(54,5,8,.96)' : 'rgba(75,10,10,.96)');
        lowerGlow.addColorStop(1, possessed ? '#100103' : '#160204');
        ctx.fillStyle = lowerGlow;
        ctx.fillRect(0, groundStart, canvas.width, canvas.height - groundStart);

        const drawBlockMountain = (anchorX, baseY, scale, seed, depth) => {
            const columns = 7;
            const block = Math.round(17 * scale);
            const frontColors = ['#07010b', '#0c0313', '#12041a'];
            const topColors = ['#100317', '#1b0722', '#290b35'];
            const sideColors = ['#030105', '#060209', '#09030f'];
            const lavaColors = ['#270904', '#3b0d05', '#5a1907'];
            const lavaHighlightColors = ['#4a1608', '#6b2009', '#87300d'];
            for (let i = 0; i < columns; i += 1) {
                const distance = Math.abs(i - 3);
                const levels = Math.max(1, 8 - distance * 2 + ((seed + i * 3) % 3));
                const x = Math.round(anchorX + (i - 3) * block * 0.82);
                for (let level = 0; level < levels; level += 1) {
                    const size = block + ((seed + level + i) % 2) * Math.max(2, Math.round(scale * 3));
                    const y = Math.round(baseY - (level + 1) * block * 0.72);
                    ctx.fillStyle = possessed ? sideColors[Math.max(0, depth - 1)] : frontColors[depth];
                    ctx.fillRect(x, y, size, block);
                    ctx.fillStyle = sideColors[depth];
                    ctx.fillRect(x + size - Math.max(3, Math.round(scale * 5)), y + 2, Math.max(3, Math.round(scale * 5)), block - 2);
                    ctx.fillStyle = possessed ? frontColors[depth] : topColors[depth];
                    ctx.fillRect(x + 2, y, size - 4, Math.max(2, Math.round(scale * 3)));
                    if ((seed + i) % 4 === 0) {
                        const lavaX = x + Math.round(size * (0.38 + (level % 2) * 0.12));
                        const lavaWidth = Math.max(2, Math.round(scale * 2));
                        ctx.fillStyle = lavaColors[depth];
                        ctx.fillRect(lavaX, y + 3, lavaWidth, block - 4);
                        const flowRange = Math.max(5, block - 8);
                        const flowOffset = (now * (0.018 + depth * 0.004) + seed * 13 + i * 19) % flowRange;
                        const flowY = Math.round(y + 3 + flowOffset);
                        ctx.fillStyle = lavaHighlightColors[depth];
                        ctx.fillRect(lavaX, flowY, lavaWidth, Math.max(2, Math.round(scale * 3)));
                        if (level % 3 === 1) ctx.fillRect(lavaX - Math.round(scale * 4), y + Math.round(block * 0.55), Math.round(scale * 5), 2);
                    }
                }
            }
        };

        const drawMountainRange = (spacing, parallax, baseY, baseScale, scaleStep, seedOffset, depth) => {
            const scroll = cameraX * parallax;
            const firstMountain = Math.floor(scroll / spacing) - 1;
            const lastMountain = Math.ceil((scroll + canvas.width) / spacing) + 1;
            for (let mountain = firstMountain; mountain <= lastMountain; mountain += 1) {
                const pattern = ((mountain % 97) + 97) % 97;
                const x = Math.round(mountain * spacing - scroll);
                drawBlockMountain(x, baseY, baseScale + (pattern % 3) * scaleStep, pattern + seedOffset, depth);
            }
        };

        const sceneryLayerStep = 16;
        const sceneryBaseY = horizon - 32;

        const drawJaggedPlain = (row, spacing, parallax, baseOffset, minHeight, heightRange) => {
            const scroll = cameraX * parallax;
            const firstTile = Math.floor(scroll / spacing) - 1;
            const lastTile = Math.ceil((scroll + canvas.width) / spacing) + 1;
            const frontColors = ['#050107', '#09020f', '#0e0315', '#170521', '#20082e'];
            const baseY = floorY + baseOffset;
            ctx.fillStyle = possessed ? '#0b0208' : frontColors[row];
            ctx.beginPath();
            ctx.moveTo(-spacing, canvas.height);
            for (let tile = firstTile; tile <= lastTile; tile += 1) {
                const pattern = ((tile % 97) + 97) % 97;
                const x = Math.round(tile * spacing - scroll);
                const height = minHeight + ((pattern * 29 + currentStage * 7 + row * 17) % heightRange);
                ctx.lineTo(x, baseY - height * 0.22);
                ctx.lineTo(x + spacing * 0.16, baseY - height * 0.55);
                ctx.lineTo(x + spacing * 0.3, baseY - height * 0.55);
                ctx.lineTo(x + spacing * 0.38, baseY - height);
                ctx.lineTo(x + spacing * 0.62, baseY - height);
                ctx.lineTo(x + spacing * 0.7, baseY - height * (0.54 + (pattern % 2) * 0.08));
                ctx.lineTo(x + spacing * 0.86, baseY - height * (0.54 + (pattern % 2) * 0.08));
                ctx.lineTo(x + spacing, baseY - height * 0.22);
            }
            ctx.lineTo(canvas.width + spacing, canvas.height);
            ctx.closePath();
            ctx.fill();
        };
        const layerOffset = layer => sceneryBaseY + sceneryLayerStep * layer - floorY;
        drawJaggedPlain(0, 52, 0.02, layerOffset(0), 12, 26);
        drawMountainRange(190, 0.035, sceneryBaseY + sceneryLayerStep, 1.3, 0.08, 31, 0);
        drawJaggedPlain(1, 58, 0.06, layerOffset(2), 15, 32);
        drawMountainRange(148, 0.09, sceneryBaseY + sceneryLayerStep * 3, 0.66, 0.09, 9, 1);
        drawJaggedPlain(2, 64, 0.12, layerOffset(4), 18, 38);
        drawMountainRange(176, 0.18, sceneryBaseY + sceneryLayerStep * 5, 0.88, 0.08, 21, 2);
        drawJaggedPlain(3, 72, 0.23, layerOffset(6), 23, 46);
        drawJaggedPlain(4, 82, 0.3, layerOffset(7), 28, 54);
    }

    function drawMonsters(now) {
        ctx.save();
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 8;
        walkingMonsters.forEach(monster => {
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(monster.x, monster.y, monster.w, monster.h);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#09090b';
            const blinking = Math.sin(now * 0.0045 + monster.startX * 0.03) > 0.94;
            const lookingLeft = monster.direction < 0;
            ctx.fillRect(monster.x + 6, monster.y + 8, lookingLeft ? 5 : 3, blinking ? 1 : lookingLeft ? 6 : 5);
            ctx.fillRect(monster.x + (lookingLeft ? 15 : 13), monster.y + 8, lookingLeft ? 3 : 5, blinking ? 1 : lookingLeft ? 5 : 6);
            ctx.shadowBlur = 8;
        });
        flyingMonsters.forEach(monster => {
            const flap = 4 + Math.abs(Math.sin(now * 0.015 + monster.phase)) * 7;
            const centerX = monster.x + monster.w * 0.5;
            const centerY = monster.y + monster.h * 0.5;
            ctx.fillStyle = '#a855f7';
            ctx.beginPath();
            ctx.moveTo(centerX - 7, centerY);
            ctx.lineTo(monster.x - 8, centerY - flap);
            ctx.lineTo(monster.x + 3, centerY + 5);
            ctx.lineTo(centerX, centerY + 2);
            ctx.lineTo(monster.x + monster.w - 3, centerY + 5);
            ctx.lineTo(monster.x + monster.w + 8, centerY - flap);
            ctx.lineTo(centerX + 7, centerY);
            ctx.closePath();
            ctx.fill();
            ctx.fillRect(monster.x, monster.y, monster.w, monster.h);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#09090b';
            const blinking = Math.sin(now * 0.005 + monster.phase * 3) > 0.94;
            const lookingLeft = monster.direction < 0;
            ctx.fillRect(monster.x + 6, monster.y + 8, lookingLeft ? 5 : 3, blinking ? 1 : lookingLeft ? 6 : 5);
            ctx.fillRect(monster.x + (lookingLeft ? 15 : 13), monster.y + 8, lookingLeft ? 3 : 5, blinking ? 1 : lookingLeft ? 5 : 6);
            ctx.shadowBlur = 8;
        });
        ctx.restore();
    }

    function drawWorld(now) {
        ctx.save();
        const jitterX = shake ? (Math.random() - 0.5) * shake : 0;
        const jitterY = shake ? (Math.random() - 0.5) * shake : 0;
        ctx.translate(-Math.floor(cameraX) + jitterX, jitterY);
        for (const platform of platforms) {
            ctx.fillStyle = control === 'entity' ? '#3b0a35' : '#3b0764';
            ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
            ctx.fillStyle = control === 'entity' ? '#a21caf' : '#7e22ce';
            ctx.fillRect(platform.x, platform.y, platform.w, 5);
        }
        ctx.fillStyle = '#a855f7';
        for (const spike of spikes) {
            for (let x = spike.x; x < spike.x + spike.w; x += 16) {
                ctx.beginPath();
                ctx.moveTo(x, floorY); ctx.lineTo(x + 8, spike.y); ctx.lineTo(x + 16, floorY); ctx.fill();
            }
        }
        drawMonsters(now);
        const portalPulse = 0.72 + Math.sin(now * 0.006) * 0.18;
        ctx.save();
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 12 + portalPulse * 8;
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(exitPortal.x, exitPortal.y, exitPortal.w, exitPortal.h);
        ctx.fillStyle = `rgba(217,70,239,${portalPulse})`;
        ctx.fillRect(exitPortal.x + 6, exitPortal.y + 6, exitPortal.w - 12, exitPortal.h - 12);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#09050d';
        ctx.fillRect(exitPortal.x + 14, exitPortal.y + 14, exitPortal.w - 28, exitPortal.h - 28);
        ctx.fillStyle = '#f0abfc';
        const portalPixel = Math.floor(now * 0.012) % 3;
        ctx.fillRect(exitPortal.x + 19 + portalPixel * 8, exitPortal.y + 21, 5, 5);
        ctx.fillRect(exitPortal.x + 44 - portalPixel * 6, exitPortal.y + 44, 4, 4);
        ctx.restore();
        drawDeathLightning();
        ctx.save();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#fff7a3';
        ctx.shadowBlur = 12;
        for (const spark of jumpSparks) {
            const alpha = spark.life / spark.maxLife;
            const speed = Math.hypot(spark.vx, spark.vy) || 1;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = spark.color || '#fff7a3';
            ctx.beginPath();
            ctx.moveTo(spark.x, spark.y);
            ctx.lineTo(
                spark.x - (spark.vx / speed) * spark.length,
                spark.y - (spark.vy / speed) * spark.length
            );
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
        if (spawnGlow > 0 && spawnOrigin) {
            const remaining = spawnGlow / 0.46;
            const progress = 1 - remaining;
            const centerX = spawnOrigin.x;
            const centerY = spawnOrigin.y;
            ctx.save();
            ctx.globalAlpha = remaining;
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8 + progress * 32, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = remaining * 0.55;
            ctx.strokeStyle = '#fef9c3';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 3 + progress * 22, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        const flicker = control === 'entity' ? Math.sin(now * 0.035) * 2 : 0;
        const boltX = Math.round(player.x + flicker);
        const boltY = Math.round(player.y);
        const jumpGlowStrength = jumpGlow / 0.22;
        ctx.save();
        if (spinTime > 0 && !deathAnimation) {
            ctx.translate(boltX + player.w * 0.5, boltY + player.h * 0.5);
            ctx.rotate(spinAngle);
            ctx.translate(-(boltX + player.w * 0.5), -(boltY + player.h * 0.5));
        }
        ctx.save();
        ctx.shadowColor = deathAnimation ? '#fde047' : jumpGlow > 0 ? '#fff7a3' : '#facc15';
        ctx.shadowBlur = deathAnimation ? 24 : 8 + jumpGlowStrength * 18;
        if (deathAnimation) ctx.globalAlpha = deathAnimation.struck ? 0 : 0.62 + Math.random() * 0.38;
        ctx.fillStyle = '#facc15';
        ctx.fillRect(boltX, boltY, player.w, player.h);
        if (possessionFill > 0) {
            const corruptionHeight = Math.max(1, Math.round(player.h * possessionFill));
            ctx.fillStyle = '#a855f7';
            ctx.fillRect(boltX, boltY + player.h - corruptionHeight, player.w, corruptionHeight);
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = control === 'entity' ? '#f0abfc' : 'transparent';
        ctx.shadowBlur = control === 'entity' ? 10 : 0;
        ctx.fillStyle = control === 'entity' ? '#f0abfc' : '#09090b';
        const playerBlinking = Math.sin(now * 0.0052 + currentStage) > 0.95;
        const leftEyeWidth = facingDirection < 0 ? 5 : 3;
        const rightEyeWidth = facingDirection > 0 ? 5 : 3;
        const leftEyeHeight = playerBlinking ? 1 : facingDirection < 0 ? 6 : 5;
        const rightEyeHeight = playerBlinking ? 1 : facingDirection > 0 ? 6 : 5;
        ctx.fillRect(boltX + 6, boltY + 8, leftEyeWidth, leftEyeHeight);
        ctx.fillRect(boltX + (facingDirection > 0 ? 13 : 15), boltY + 8, rightEyeWidth, rightEyeHeight);
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.restore();
        if (control === 'entity') {
            ctx.strokeStyle = 'rgba(239,68,68,.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(player.x + 12, player.y);
            ctx.lineTo(player.x + 12 + Math.sin(now * 0.02) * 30, player.y - 90);
            ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = '#e879f9';
        ctx.font = 'bold 18px monospace';
        ctx.fillText(`\u2371\u0338 ${currentStage} // \u29D6 ${deaths}`, 16, 30);
    }

    function drawStageTransition(now) {
        if (!stageTransitionStarted) return;
        const elapsed = (now - stageTransitionStarted) / 1000;
        if ((completed && currentStage < maxStage) || stageTransitionLoaded) {
            ctx.save();
            if (!stageTransitionLoaded) {
                const opacity = Math.min(1, elapsed / 0.42);
                ctx.fillStyle = `rgba(5, 1, 8, ${opacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                if (elapsed >= 0.42) {
                    loadStage(currentStage + 1);
                    stageTransitionLoaded = true;
                    stageTransitionStarted = now;
                    running = false;
                }
            } else {
                const opacity = Math.max(0, 1 - elapsed / 0.55);
                ctx.fillStyle = `rgba(5, 1, 8, ${opacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                if (elapsed >= 0.55) {
                    stageTransitionStarted = 0;
                    stageTransitionLoaded = false;
                    running = true;
                    lastTime = now;
                    platform?.gameplayStart();
                }
            }
            ctx.restore();
            return;
        }
        ctx.save();
        if (elapsed < 0.9) {
            ctx.fillStyle = `rgba(9, 9, 11, ${Math.min(0.92, elapsed * 1.4)})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let index = 0; index < 34; index += 1) {
                const y = Math.random() * canvas.height;
                const height = 1 + Math.random() * 8;
                const brightness = Math.floor(80 + Math.random() * 175);
                ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${0.08 + Math.random() * 0.32})`;
                ctx.fillRect(Math.random() * -80, y, canvas.width + 160, height);
            }
            ctx.fillStyle = `rgba(232, 121, 249, ${0.08 + Math.random() * 0.22})`;
            ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 6 + Math.random() * 30);
        } else if (currentStage < maxStage) {
            ctx.fillStyle = '#09090b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const jitterX = (Math.random() - 0.5) * 3;
            ctx.textAlign = 'center';
            ctx.shadowColor = '#e879f9';
            ctx.shadowBlur = 16;
            ctx.fillStyle = '#f0abfc';
            ctx.font = '900 34px monospace';
            const nextLabel = String(currentStage + 1).padStart(2, '0');
            ctx.fillText(`\u2593\u2573\u2592\u0338\u29D6 ${nextLabel}`, canvas.width / 2 + jitterX, canvas.height / 2 - 8);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#701a75';
            ctx.font = '700 14px monospace';
            ctx.fillText('\u2593\u2592\u2591  \u29D6\u0338\u29D7  \u2591\u2592\u2593', canvas.width / 2 - jitterX, canvas.height / 2 + 28);
            ctx.textAlign = 'left';
        } else {
            ctx.fillStyle = '#050506';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width * 0.5;
            const centerY = canvas.height * 0.5;
            ctx.save();
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 34;
            ctx.fillStyle = '#fafafa';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 92, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#09090b';
            const pupilJolt = Math.random() < 0.32 ? 9 : 3;
            const pupilX = centerX + (Math.random() - 0.5) * pupilJolt;
            const pupilY = centerY + (Math.random() - 0.5) * pupilJolt;
            ctx.beginPath();
            ctx.arc(pupilX, pupilY, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (elapsed >= 10.9) {
                const progress = Math.min(1, (elapsed - 10.9) / 0.65);
                ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.78})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                for (let index = 0; index < 26; index += 1) {
                    const y = Math.random() * canvas.height;
                    const height = 2 + Math.random() * 16;
                    const offset = (Math.random() - 0.5) * 150 * progress;
                    ctx.fillStyle = index % 3 === 0
                        ? `rgba(232, 121, 249, ${0.12 + progress * 0.32})`
                        : `rgba(255, 255, 255, ${0.04 + progress * 0.16})`;
                    ctx.fillRect(offset, y, canvas.width, height);
                }
            }
        }
        ctx.restore();
    }

    function drawPauseOverlay(now) {
        ctx.fillStyle = 'rgba(3, 0, 5, 0.72)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const glow = ctx.createRadialGradient(
            canvas.width * 0.5, canvas.height * 0.5, canvas.height * 0.12,
            canvas.width * 0.5, canvas.height * 0.5, canvas.width * 0.62
        );
        glow.addColorStop(0, 'rgba(217, 70, 239, 0.02)');
        glow.addColorStop(0.72, 'rgba(88, 28, 135, 0.12)');
        glow.addColorStop(1, 'rgba(112, 26, 117, 0.38)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.strokeStyle = 'rgba(232, 121, 249, 0.45)';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#d946ef';
        ctx.shadowBlur = 18;
        ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        ctx.restore();
        if (Math.floor(now / 180) % 5 === 0) {
            for (let index = 0; index < 3; index += 1) {
                const y = 90 + ((index * 137 + Math.floor(now / 180) * 53) % (canvas.height - 180));
                ctx.fillStyle = index === 1 ? 'rgba(255,255,255,0.08)' : 'rgba(232,121,249,0.16)';
                ctx.fillRect(index % 2 ? -12 : 14, y, canvas.width, 3 + index * 2);
            }
        }
    }

    function frame(now) {
        if (!lastTime) lastTime = now;
        const dt = Math.min(0.034, (now - lastTime) / 1000);
        lastTime = now;
        if (running) update(dt, now);
        else if (paused) maintainPausedPlatformCollision();
        const visualNow = (paused ? pauseStartedAt : now) - visualPausedDuration;
        drawBackground(visualNow);
        drawWorld(visualNow);
        if (paused) drawPauseOverlay(now);
        drawStageTransition(now);
        if (completed && currentStage >= maxStage && stageTransitionStarted
            && (now - stageTransitionStarted) / 1000 >= 11.55) {
            showTitleScreen(true);
        }
        animationId = requestAnimationFrame(frame);
    }

    function startGame(stage = Math.min(maxStage, unlockedStage)) {
        setMobileControlsDisabled(false);
        musicScene = 'game';
        ensureAudio();
        startBackgroundMusic();
        intro.classList.add('hidden');
        stageMenu?.classList.add('hidden');
        gameWrap.classList.remove('hidden');
        startButton.classList.add('hidden');
        restartButton?.classList.add('hidden');
        pauseButton?.classList.remove('hidden');
        paused = false;
        visualPausedDuration = 0;
        hideGameMenuButton();
        loadStage(Math.max(1, Math.min(maxStage, Number(stage) || 1)));
        platform?.gameplayStart();
        status.textContent = brokenText.waiting;
        lastTime = performance.now();
        if (!animationId) animationId = requestAnimationFrame(frame);
    }

    function setKey(event, pressed) {
        const key = event.key.toLowerCase();
        const isJumpKey = key === 'arrowup' || key === 'w' || key === ' ';
        if (!running) {
            if (isJumpKey && !pressed) jumpKeyHeld = false;
            return;
        }
        if (key === 'arrowleft' || key === 'a') keys.left = pressed;
        if (key === 'arrowright' || key === 'd') keys.right = pressed;
        if (isJumpKey) {
            if (pressed && !jumpKeyHeld) keys.jump = true;
            jumpKeyHeld = pressed;
        }
        if (pressed && control === 'waiting' && ['arrowleft', 'arrowright', 'arrowup', 'a', 'd', 'w', ' '].includes(key)) beginPlayerControl(performance.now());
        if (['arrowleft', 'arrowright', 'arrowup', 'a', 'd', 'w', ' '].includes(key)) event.preventDefault();
    }

    window.addEventListener('keydown', event => setKey(event, true));
    window.addEventListener('keyup', event => setKey(event, false));

    function findStandingPlatform() {
        if (!player.grounded) return null;
        const bottom = player.y + player.h;
        return platforms.find(platform =>
            player.x + player.w > platform.x
            && player.x < platform.x + platform.w
            && Math.abs(bottom - platform.y) <= 8
        ) || null;
    }

    function maintainPausedPlatformCollision() {
        if (pausedPlayerAnchor) {
            player.x = pausedPlayerAnchor.x;
            player.y = pausedPlayerAnchor.y;
            player.vx = pausedPlayerAnchor.vx;
            player.vy = pausedPlayerAnchor.vy;
            player.grounded = pausedPlayerAnchor.grounded;
            player.jumpsLeft = pausedPlayerAnchor.jumpsLeft;
        }
    }

    function showSavedStage() {
        if (!unlockedStage || unlockedStage < 1) return;
        runGlitchTransition(() => startGame(unlockedStage));
    }

    startButton.addEventListener('click', () => {
        showSavedStage();
    });
    const stageButton = document.getElementById('doxxClickStageButton');
    stageButton?.addEventListener('click', () => runGlitchTransition(() => showStageMenu()));
    muteButton?.addEventListener('click', () => {
        userMuted = !userMuted;
        try {
            progressStorage.setItem(mutePreferenceKey, String(userMuted));
        } catch (error) {
            // The preference remains active for this session when storage is unavailable.
        }
        updateMuteState();
    });
    titleMenuButton?.addEventListener('click', () => {
        const isOpen = titleSideActions?.classList.toggle('is-open') || false;
        titleMenuButton.setAttribute('aria-expanded', String(isOpen));
        titleMenuButton.setAttribute('aria-label', isOpen ? labels.closeTitleMenu : labels.openTitleMenu);
    });
    document.addEventListener('click', event => {
        const button = event.target.closest('button');
        if (!button) return;
        playUiBeat();
    });
    restartButton?.addEventListener('click', () => runGlitchTransition(() => startGame(currentStage)));
    pauseButton?.addEventListener('click', () => {
        if (completed || (!running && !paused)) return;
        const toggleTime = performance.now();
        if (toggleTime < pauseToggleLockedUntil) return;
        pauseToggleLockedUntil = toggleTime + 220;
        if (!paused) {
            platform?.gameplayStop();
            paused = true;
            pauseBackgroundMusic();
            pausedPlayerAnchor = {
                x: player.x,
                y: player.y,
                vx: player.vx,
                vy: player.vy,
                grounded: player.grounded,
                jumpsLeft: player.jumpsLeft,
                supportPlatform: findStandingPlatform()
            };
            maintainPausedPlatformCollision();
            running = false;
            pauseStartedAt = toggleTime;
            lastTime = toggleTime;
            keys.left = false;
            keys.right = false;
            keys.jump = false;
            setMobileControlsDisabled(true);
            showGameMenuButton();
            gameMenuButton?.animate([
                { opacity: 0, transform: 'translateX(125%)' },
                { opacity: 1, transform: 'translateX(0)' }
            ], { duration: 190, easing: 'cubic-bezier(.2,.85,.25,1)', fill: 'both' });
            return;
        }
        const now = toggleTime;
        const pausedFor = now - pauseStartedAt;
        if (controlUntil) controlUntil += pausedFor;
        visualPausedDuration += pausedFor;
        maintainPausedPlatformCollision();
        if (pausedPlayerAnchor) {
            player.x = pausedPlayerAnchor.x;
            player.y = pausedPlayerAnchor.y;
            player.vx = pausedPlayerAnchor.vx;
            player.vy = pausedPlayerAnchor.vy;
            player.grounded = pausedPlayerAnchor.grounded;
            player.jumpsLeft = pausedPlayerAnchor.jumpsLeft;
            resumeSupportPlatform = pausedPlayerAnchor.supportPlatform;
        }
        paused = false;
        running = true;
        pausedPlayerAnchor = null;
        setMobileControlsDisabled(false);
        platform?.gameplayStart();
        resumeBackgroundMusic();
        lastTime = now;
        if (gameMenuButton) {
            const hideMenuAnimation = gameMenuButton.animate([
                { opacity: 1, transform: 'translateX(0)' },
                { opacity: 0, transform: 'translateX(125%)' }
            ], { duration: 170, easing: 'cubic-bezier(.55,0,.8,.2)', fill: 'both' });
            hideMenuAnimation.addEventListener('finish', hideGameMenuButton, { once: true });
        }
    });
    gameMenuButton?.addEventListener('click', async () => {
        gameMenuButton.disabled = true;
        await requestInterstitial();
        gameMenuButton.disabled = false;
        runGlitchTransition(() => showTitleScreen());
    });
    document.querySelectorAll('[data-doxx-click-control]').forEach(button => {
        const controlName = button.dataset.doxxClickControl;
        const press = event => {
            event.preventDefault();
            if (paused || button.disabled) return;
            if (controlName === 'jump') keys.jump = true;
            else keys[controlName] = true;
            if (control === 'waiting') beginPlayerControl(performance.now());
        };
        const release = event => {
            event.preventDefault();
            if (controlName === 'left' || controlName === 'right') keys[controlName] = false;
        };
        button.addEventListener('pointerdown', press);
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('pointerleave', release);
    });
}

window.addEventListener('doxx-platform-audio', event => {
    document.documentElement.dataset.platformMuted = event.detail?.muted ? 'true' : 'false';
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDoxxClickGame, { once: true });
else initDoxxClickGame();
