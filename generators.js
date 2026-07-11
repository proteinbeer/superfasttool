function initGenerators() {
    const fantasyFirst = ['Aelar', 'Nyra', 'Thorne', 'Eldrin', 'Kaela', 'Mira', 'Darian', 'Sylas', 'Liora', 'Rowan', 'Seren', 'Vael', 'Arlen', 'Bryn', 'Cael', 'Doria', 'Eira', 'Faelan', 'Galen', 'Halwyn', 'Ilyra', 'Jareth', 'Korin', 'Maelis', 'Nerith', 'Oryn', 'Phaedra', 'Quillan', 'Rysa', 'Sable', 'Tavian', 'Ulric', 'Vanya', 'Wren', 'Xyra', 'Ysolde', 'Zorin', 'Althea', 'Bastian', 'Corvin', 'Delara', 'Elowen', 'Fenric', 'Gwyndor', 'Hester', 'Isolde', 'Jorren', 'Keir', 'Lysandra', 'Merric', 'Nimue', 'Orla', 'Perrin', 'Quorra', 'Rook', 'Selene', 'Torin', 'Una', 'Vesper', 'Willow', 'Yara', 'Zephyr'];
    const fantasyLast = ['Moonvale', 'Stormroot', 'Ashborne', 'Silverleaf', 'Duskwind', 'Emberfall', 'Dawnwhisper', 'Ironbloom', 'Nightbriar', 'Starling', 'Oakenhart', 'Ravenshade', 'Frostmere', 'Goldbrook', 'Highthorn', 'Mistwalker', 'Brightforge', 'Valeguard', 'Shadowmere', 'Windhollow', 'Stonebrook', 'Elderbranch', 'Rimeward', 'Flintwatch', 'Duskweaver', 'Rosemantle', 'Blackwater', 'Greenbough', 'Trueflame', 'Hawkwind', 'Oakenshield', 'Runebinder', 'Wolfsong', 'Briarfall', 'Suncrest', 'Mournvale', 'Cloudharp', 'Ironquill', 'Redwillow', 'Grimward', 'Larkspur', 'Evenwood', 'Glassriver', 'Thistlemoon', 'Dewmantle', 'Stormveil', 'Mossglen', 'Feywarden', 'Ashgrove', 'Starbrook'];
    const fantasyPlacePrefix = ['Elder', 'Moon', 'Storm', 'Amber', 'Raven', 'Silver', 'Thorn', 'Frost', 'Sun', 'Mist', 'Ash', 'Briar', 'Cinder', 'Dawn', 'Dusk', 'Ember', 'Fey', 'Glass', 'Gold', 'Grim', 'High', 'Hollow', 'Iron', 'Jade', 'Kings', 'Lion', 'Moss', 'Night', 'Oak', 'Pale', 'Quiet', 'Red', 'Rune', 'Sable', 'Shadow', 'Star', 'Stone', 'Thistle', 'Violet', 'White', 'Wild', 'Wolf', 'Wyrm', 'Yew', 'Zephyr', 'Crown', 'Deep', 'Ever', 'Fern', 'Grey', 'Lost', 'Marble', 'Old', 'Rose', 'Swan', 'Twin', 'Verdant'];
    const fantasyPlaceSuffix = ['Hollow', 'Keep', 'Vale', 'Grove', 'Reach', 'Harbor', 'Spire', 'Fen', 'Crossing', 'Sanctum', 'Abbey', 'Barrow', 'Bastion', 'Bridge', 'Brook', 'Burrow', 'Castle', 'Chapel', 'Citadel', 'Cliff', 'Cove', 'Dale', 'Dell', 'Falls', 'Field', 'Ford', 'Gate', 'Glen', 'Hearth', 'Hold', 'Isle', 'Landing', 'March', 'Market', 'Meadow', 'Mire', 'Pass', 'Peak', 'Port', 'Ridge', 'River', 'Road', 'Shrine', 'Spring', 'Tower', 'Watch', 'Wood', 'Woods', 'Wreath', 'Warren', 'Cradle', 'Crown', 'Labyrinth', 'Court', 'Haven', 'Monastery', 'Vault', 'Fountain'];
    const fantasyPlaceMiddle = ['of Ash', 'of Bells', 'of Crowns', 'of Embers', 'of Lanterns', 'of Ravens', 'of Roses', 'of Saints', 'of Thorns', 'of Wolves', 'under Moonlight', 'above the Mire', 'beyond the Gate', 'near the Old Road', 'at Worldroot', 'by the Glass Sea', 'under Starfall', 'of the Last King', 'of the First Flame', 'of Silent Rain'];
    const sciFiFirst = ['Nova', 'Orion', 'Vex', 'Lyra', 'Zane', 'Astra', 'Kairo', 'Nyx', 'Riven', 'Juno', 'Cade', 'Sera', 'Axiom', 'Bex', 'Cyra', 'Dax', 'Echo', 'Fenix', 'Galen', 'Halo', 'Ion', 'Jax', 'Kira', 'Lex', 'Mako', 'Nia', 'Onyx', 'Pax', 'Quin', 'Raze', 'Sable', 'Talon', 'Uma', 'Vega', 'Wynn', 'Xara', 'Yuri', 'Zen', 'Argo', 'Blake', 'Cira', 'Dray', 'Elix', 'Flux', 'Grix', 'Helio', 'Iris', 'Juno', 'Kade', 'Lux', 'Mira', 'Nero', 'Oberon', 'Pulse', 'Quasar', 'Rhea', 'Syn', 'Tera', 'Voss', 'Zero'];
    const sciFiLast = ['Prime', 'Vector', 'Flux', 'Cipher', 'Nexus', 'Pulse', 'Ion', 'Quasar', 'Apex', 'Binary', 'Core', 'Delta', 'Echo', 'Forge', 'Grid', 'Helix', 'Index', 'Javelin', 'Kinetic', 'Lattice', 'Matrix', 'Neon', 'Orbit', 'Photon', 'Quantum', 'Relay', 'Signal', 'Titan', 'Umbra', 'Vertex', 'Warp', 'Zenith', 'Array', 'Beacon', 'Circuit', 'Drift', 'Engine', 'Frame', 'Glyph', 'Halo', 'Impulse', 'Junction', 'Kernel', 'Loop', 'Module', 'Node', 'Omega', 'Protocol', 'Rift', 'Socket', 'Trace', 'Unit'];
    const sciFiPlacePrefix = ['Kepler', 'Helios', 'Vega', 'Axiom', 'Zenith', 'Eclipse', 'Titan', 'Cygnus', 'Nova', 'Arc', 'Andromeda', 'Borealis', 'Ceres', 'Draco', 'Europa', 'Fomalhaut', 'Galatea', 'Horizon', 'Io', 'Juno', 'Kestrel', 'Lumen', 'Mirage', 'Nadir', 'Oberon', 'Pioneer', 'Quanta', 'Rigel', 'Sagan', 'Triton', 'Umbriel', 'Vortex', 'Warden', 'Xenon', 'Ymir', 'Zeta', 'Aurora', 'Bastion', 'Calypso', 'Daedalus', 'Eos', 'Frontier', 'Gemini', 'Hyperion', 'Icarus', 'Janus', 'Kronos', 'Lazarus', 'Meridian', 'Neptune', 'Odyssey', 'Polaris', 'Radiant', 'Sirius', 'Talos', 'Unity', 'Vanguard', 'Waypoint'];
    const sciFiPlaceSuffix = ['Station', 'Sector', 'Colony', 'Outpost', 'Array', 'Gate', 'Prime', 'Nebula', 'Dock', 'Relay', 'Arcology', 'Belt', 'Citadel', 'Cluster', 'Core', 'Cradle', 'Depot', 'Drift', 'Envelope', 'Field', 'Grid', 'Halo', 'Hub', 'Junction', 'Lab', 'Lattice', 'Loop', 'Moon', 'Node', 'Port', 'Quadrant', 'Ring', 'Sanctuary', 'Shipyard', 'Spire', 'Terminal', 'Vault', 'World', 'Yard', 'Zone', 'Platform', 'Beacon', 'Exchange', 'Foundry', 'Observatory', 'Refuge', 'Shard', 'Slipway', 'Terrace', 'Vector'];
    const sciFiPlaceMiddle = ['Deep Orbit', 'Outer Rim', 'Low Halo', 'Darkside', 'Redline', 'Blue Shift', 'Eventide', 'Far Vector', 'Null Drift', 'Cold Sleep', 'Zero Point', 'Long Range', 'Solar Wake', 'Ghost Band', 'Ion Trail', 'Black Arc', 'Grey Signal', 'Night Relay', 'Twin Star', 'Silent Core'];
    const businessWords = ['Bright', 'Nimble', 'Core', 'Peak', 'Clear', 'Swift', 'North', 'Launch'];
    const businessTypes = ['Labs', 'Works', 'Studio', 'Systems', 'Forge', 'Group'];
    const usernameWords = ['pixel', 'rapid', 'quiet', 'neon', 'lucky', 'nova', 'bold', 'spark'];

    const generatedLists = {
        fantasyPerson: [],
        fantasyPlace: [],
        sciFiPerson: [],
        sciFiPlace: [],
        businessName: [],
        username: []
    };

    setupNameGenerator({
        key: 'fantasyPerson',
        countId: 'fantasyPersonCount',
        generateId: 'generateFantasyPersonName',
        downloadId: 'downloadFantasyPersonName',
        outputId: 'valFantasyPersonName',
        fileName: 'fantasy-person-names.txt',
        createName: () => `${pick(fantasyFirst)} ${pick(fantasyLast)}`
    }, generatedLists);

    setupNameGenerator({
        key: 'fantasyPlace',
        countId: 'fantasyPlaceCount',
        generateId: 'generateFantasyPlaceName',
        downloadId: 'downloadFantasyPlaceName',
        outputId: 'valFantasyPlaceName',
        fileName: 'fantasy-place-names.txt',
        createName: () => createFantasyPlaceName(fantasyPlacePrefix, fantasyPlaceSuffix, fantasyPlaceMiddle)
    }, generatedLists);

    setupNameGenerator({
        key: 'sciFiPerson',
        countId: 'sciFiPersonCount',
        generateId: 'generateSciFiPersonName',
        downloadId: 'downloadSciFiPersonName',
        outputId: 'valSciFiPersonName',
        fileName: 'sci-fi-person-names.txt',
        createName: () => `${pick(sciFiFirst)} ${pick(sciFiLast)}`
    }, generatedLists);

    setupNameGenerator({
        key: 'sciFiPlace',
        countId: 'sciFiPlaceCount',
        generateId: 'generateSciFiPlaceName',
        downloadId: 'downloadSciFiPlaceName',
        outputId: 'valSciFiPlaceName',
        fileName: 'sci-fi-place-names.txt',
        createName: () => createSciFiPlaceName(sciFiPlacePrefix, sciFiPlaceSuffix, sciFiPlaceMiddle)
    }, generatedLists);

    setupNameGenerator({
        key: 'businessName',
        countId: 'businessNameCount',
        generateId: 'generateBusinessName',
        downloadId: 'downloadBusinessName',
        outputId: 'valBusinessName',
        fileName: 'business-names.txt',
        createName: () => `${pick(businessWords)} ${pick(businessTypes)}`
    }, generatedLists);

    setupNameGenerator({
        key: 'username',
        countId: 'usernameCount',
        generateId: 'generateUsername',
        downloadId: 'downloadUsername',
        outputId: 'valUsername',
        fileName: 'usernames.txt',
        createName: () => `${pick(usernameWords)}_${pick(usernameWords)}_${randomInt(10, 999)}`
    }, generatedLists);

    setupCountSlider('passwordCount');
    setupCountSlider('randomNumberCount');
    setupCountSlider('uuidCount');
    setupCountSlider('loremCount');
    setupClampedNumberInput('loremLength', clampLoremLength);
    initLunchPicker();
    initWhoPaysRoulette();
    setupPasswordGenerator();
    setupRandomNumberGenerator();
    setupUuidGenerator();
    setupLoremIpsumGenerator();
}

function setupPasswordGenerator() {
    const generateButton = document.getElementById('generatePassword');
    const downloadButton = document.getElementById('downloadPassword');
    const output = document.getElementById('valPassword');
    const countInput = document.getElementById('passwordCount');
    const lengthInput = document.getElementById('passwordLength');
    if (!generateButton || !downloadButton || !output || !countInput || !lengthInput) return;

    generateButton.addEventListener('click', () => {
        output.innerText = createPassword();
    });
    downloadButton.addEventListener('click', () => {
        const count = clampCount(countInput.value);
        countInput.value = count;
        downloadTextFile('passwords.txt', Array.from({ length: count }, createPassword).join('\n'));
    });
}

function setupRandomNumberGenerator() {
    const generateButton = document.getElementById('generateRandomNumber');
    const downloadButton = document.getElementById('downloadRandomNumber');
    const output = document.getElementById('valRandomNumber');
    const countInput = document.getElementById('randomNumberCount');
    const minInput = document.getElementById('randomMin');
    const maxInput = document.getElementById('randomMax');
    if (!generateButton || !downloadButton || !output || !countInput || !minInput || !maxInput) return;

    generateButton.addEventListener('click', () => {
        output.innerText = createRandomNumber().toLocaleString();
    });
    downloadButton.addEventListener('click', () => {
        const count = clampCount(countInput.value);
        countInput.value = count;
        downloadTextFile('random-numbers.txt', Array.from({ length: count }, () => createRandomNumber()).join('\n'));
    });
}

function setupUuidGenerator() {
    const generateButton = document.getElementById('generateUuid');
    const downloadButton = document.getElementById('downloadUuid');
    const output = document.getElementById('valUuid');
    const countInput = document.getElementById('uuidCount');
    if (!generateButton || !downloadButton || !output || !countInput) return;

    generateButton.addEventListener('click', () => {
        output.innerText = createUuid();
    });
    downloadButton.addEventListener('click', () => {
        const count = clampCount(countInput.value);
        countInput.value = count;
        downloadTextFile('uuids.txt', Array.from({ length: count }, createUuid).join('\n'));
    });
}

function setupLoremIpsumGenerator() {
    const downloadButton = document.getElementById('downloadLoremIpsum');
    const lengthInput = document.getElementById('loremLength');
    const countInput = document.getElementById('loremCount');
    const countValue = document.getElementById('loremCountValue');
    if (!downloadButton || !lengthInput || !countInput || !countValue) return;

    downloadButton.addEventListener('click', () => {
        const length = clampLoremLength(lengthInput.value);
        const count = clampCount(countInput.value);
        lengthInput.value = length;
        countInput.value = count;
        countValue.innerText = count;
        downloadTextFile('lorem-ipsum.txt', Array.from({ length: count }, () => createLoremIpsum(length)).join('\n\n'));
    });
}

function initLunchPicker() {
    const presetSelect = document.getElementById('lunchPreset');
    const optionsInput = document.getElementById('lunchOptions');
    const excludedInput = document.getElementById('lunchExcluded');
    const avoidRecentInput = document.getElementById('lunchAvoidRecent');
    const spinButton = document.getElementById('spinLunch');
    const slotMachine = document.getElementById('lunchSlotMachine');
    const previousRow = document.getElementById('lunchSlotPrevious');
    const currentRow = document.getElementById('lunchSlotCurrent');
    const nextRow = document.getElementById('lunchSlotNext');
    const message = document.getElementById('lunchPickerMessage');
    const recentOutput = document.getElementById('lunchRecentResults');
    const creditsLink = document.getElementById('lunchPhotoCredits');
    const fireworks = document.getElementById('lunchFireworks');
    if (!presetSelect || !optionsInput || !excludedInput || !avoidRecentInput || !spinButton || !slotMachine) return;

    const requestedLocale = document.documentElement.lang || window.SFT_LOCALE || 'en';
    const locale = window.SFT_LUNCH_PRESETS?.[requestedLocale] ? requestedLocale : 'en';
    const presets = window.SFT_LUNCH_PRESETS?.[locale] || {};
    const photoLookup = window.SFT_LUNCH_PHOTOS?.[locale] || {};
    if (!Object.keys(presets).length) return;
    if (creditsLink) creditsLink.textContent = window.SFT_LUNCH_CREDITS_LABELS?.[locale] || 'Photo credits';
    const storageKey = 'sft-lunch-picker';
    const customStorageKey = 'sft-lunch-picker-custom-options';
    const defaultCustomOptions = (window.SFT_LUNCH_CUSTOM_DEFAULTS?.[locale] || ['Menu 1', 'Menu 2', 'Menu 3']).join('\n');
    let recent = [];
    let audioContext;
    let customOptions = defaultCustomOptions;
    let hasSavedCustom = false;
    try {
        hasSavedCustom = localStorage.getItem(customStorageKey) !== null;
        customOptions = hasSavedCustom ? localStorage.getItem(customStorageKey) || '' : defaultCustomOptions;
    } catch {}
    const text = (id, fallback) => document.getElementById(id)?.textContent.trim() || fallback;
    const labels = {
        ready: previousRow.textContent.trim(),
        choose: currentRow.textContent.trim(),
        spinWhenReady: nextRow.textContent.trim(),
        spin: spinButton.textContent.trim(),
        spinning: text('lunchLabelSpinning', 'Spinning...'),
        spinAgain: text('lunchLabelSpinAgain', 'Spin Again'),
        recent: text('lunchLabelRecent', 'Recent'),
        empty: message.textContent.trim() || 'Add at least one available lunch option.'
    };

    const normalizeLines = value => [...new Set(value.split(/\r?\n/).map(item => item.trim()).filter(Boolean))];
    const randomItem = items => {
        if (!items.length) return '';
        if (window.crypto?.getRandomValues) {
            const value = new Uint32Array(1);
            window.crypto.getRandomValues(value);
            return items[value[0] % items.length];
        }
        return items[Math.floor(Math.random() * items.length)];
    };
    const imageSource = item => photoLookup[item] ? `/assets/lunch-photos/${photoLookup[item]}.webp` : '';
    const preloadItems = items => {
        const sources = [...new Set(items.map(imageSource).filter(Boolean))];
        sources.forEach(source => {
            const image = new Image();
            image.src = source;
        });
    };
    const saveState = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ locale, preset: presetSelect.value, options: optionsInput.value, customOptions, excluded: excludedInput.value, avoidRecent: avoidRecentInput.checked, recent }));
        } catch {}
    };
    const saveCustomOptions = () => {
        try {
            localStorage.setItem(customStorageKey, customOptions);
            hasSavedCustom = true;
        } catch {}
    };
    const renderRecent = () => {
        recentOutput.textContent = recent.length ? `${labels.recent}: ${recent.join(' · ')}` : '';
        recentOutput.classList.toggle('hidden', !recent.length);
    };
    const renderSlotRow = (row, item, fallback) => {
        const label = item || fallback;
        const source = imageSource(item);
        const name = document.createElement('span');
        name.className = 'lunch-slot-name';
        name.textContent = label;
        if (!source) {
            row.replaceChildren(name);
            return;
        }
        const image = document.createElement('img');
        image.className = 'lunch-slot-image';
        image.src = source;
        image.alt = '';
        image.width = row === currentRow ? 48 : 34;
        image.height = row === currentRow ? 48 : 34;
        image.decoding = 'async';
        image.setAttribute('aria-hidden', 'true');
        image.addEventListener('error', () => image.remove(), { once: true });
        row.replaceChildren(image, name);
    };
    const setRows = (winner, pool) => {
        const alternatives = pool.filter(item => item !== winner);
        const previous = randomItem(alternatives);
        const next = randomItem(alternatives);
        renderSlotRow(previousRow, previous, labels.ready);
        renderSlotRow(currentRow, winner, labels.choose);
        renderSlotRow(nextRow, next, labels.spinWhenReady);
    };
    const setPreset = key => {
        if (key === 'custom') {
            optionsInput.value = customOptions;
            saveState();
            return;
        }
        optionsInput.value = (presets[key] || presets.mixed).join('\n');
        preloadItems(presets[key] || presets.mixed);
        saveState();
    };
    const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    const getAudioContext = () => {
        if (audioContext) return audioContext;
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return null;
        audioContext = new Context();
        return audioContext;
    };
    const playTone = (frequency, duration, volume = 0.035, delay = 0) => {
        const context = getAudioContext();
        if (!context) return;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + delay;
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
    };
    const playWinSound = () => {
        playTone(523.25, 0.16, 0.05);
        playTone(659.25, 0.18, 0.055, 0.11);
        playTone(783.99, 0.24, 0.06, 0.23);
    };
    const burstCelebration = reducedMotion => {
        if (!fireworks) return;
        if (fireworks.parentElement !== document.body) document.body.appendChild(fireworks);
        fireworks.replaceChildren();
        const colors = ['#f97316', '#facc15', '#ef4444', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'];
        const origins = [18, 50, 82];
        const count = reducedMotion ? 18 : 72;
        const fragment = document.createDocumentFragment();
        for (let index = 0; index < count; index += 1) {
            const particle = document.createElement('span');
            const origin = origins[index % origins.length] + ((Math.random() * 10) - 5);
            const horizontal = (Math.random() - 0.5) * Math.min(window.innerWidth * 0.42, 420);
            const vertical = -(window.innerHeight * (0.55 + Math.random() * 0.48));
            const width = 8 + Math.round(Math.random() * 7);
            const height = 12 + Math.round(Math.random() * 12);
            const rotation = Math.round((Math.random() * 900) - 450);
            particle.className = 'lunch-confetti';
            particle.style.setProperty('--confetti-color', colors[index % colors.length]);
            particle.style.setProperty('--confetti-origin', `${origin}%`);
            particle.style.setProperty('--confetti-x', `${horizontal}px`);
            particle.style.setProperty('--confetti-y', `${vertical}px`);
            particle.style.setProperty('--confetti-fall-x', `${horizontal + ((Math.random() - 0.5) * 28)}px`);
            particle.style.setProperty('--confetti-fall-y', `${vertical + 12 + (Math.random() * 30)}px`);
            particle.style.setProperty('--confetti-rotate', `${rotation}deg`);
            particle.style.setProperty('--confetti-end-rotate', `${rotation + 240 + Math.round(Math.random() * 400)}deg`);
            particle.style.setProperty('--confetti-width', `${width}px`);
            particle.style.setProperty('--confetti-height', `${height}px`);
            particle.style.setProperty('--confetti-radius', index % 3 === 0 ? '999px' : '2px');
            particle.style.setProperty('--confetti-delay', `${Math.round(Math.random() * 130)}ms`);
            fragment.appendChild(particle);
        }
        fireworks.appendChild(fragment);
        window.setTimeout(() => fireworks.replaceChildren(), 1700);
    };

    presetSelect.addEventListener('change', () => setPreset(presetSelect.value));
    optionsInput.addEventListener('input', () => {
        presetSelect.value = 'custom';
        customOptions = optionsInput.value;
        saveCustomOptions();
        saveState();
    });
    excludedInput.addEventListener('input', saveState);
    avoidRecentInput.addEventListener('change', saveState);
    spinButton.addEventListener('click', async () => {
        const options = normalizeLines(optionsInput.value);
        const excluded = new Set(normalizeLines(excludedInput.value).map(item => item.toLocaleLowerCase()));
        const available = options.filter(item => !excluded.has(item.toLocaleLowerCase()));
        let candidates = available;
        if (avoidRecentInput.checked) {
            const unused = candidates.filter(item => !recent.includes(item));
            if (unused.length) candidates = unused;
        }
        if (!candidates.length) {
            message.textContent = labels.empty;
            message.classList.remove('hidden');
            return;
        }

        message.classList.add('hidden');
        spinButton.disabled = true;
        spinButton.textContent = labels.spinning;
        slotMachine.classList.remove('is-complete');
        slotMachine.classList.add('is-spinning');
        getAudioContext()?.resume?.();
        const winner = randomItem(candidates);
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const steps = reducedMotion ? 3 : 24;
        for (let step = 0; step < steps; step += 1) {
            setRows(randomItem(candidates), candidates);
            if (!reducedMotion && step % 2 === 0) playTone(220 + (step * 8), 0.045, 0.02);
            const progress = step / Math.max(steps - 1, 1);
            await wait(reducedMotion ? 35 : 45 + Math.round(progress * progress * 145));
        }
        setRows(winner, available);
        slotMachine.classList.remove('is-spinning');
        slotMachine.classList.add('is-complete');
        playWinSound();
        burstCelebration(reducedMotion);
        recent = [winner, ...recent.filter(item => item !== winner)].slice(0, 5);
        renderRecent();
        saveState();
        spinButton.textContent = labels.spinAgain;
        spinButton.disabled = false;
    });

    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const sameLocale = saved.locale === locale;
        recent = sameLocale && Array.isArray(saved.recent) ? saved.recent.slice(0, 5) : [];
        const savedPreset = sameLocale && (presets[saved.preset] || saved.preset === 'custom') ? saved.preset : 'mixed';
        if (!hasSavedCustom && saved.preset === 'custom' && typeof saved.options === 'string') {
            customOptions = saved.options;
            saveCustomOptions();
        } else if (!hasSavedCustom && typeof saved.customOptions === 'string') {
            customOptions = saved.customOptions;
            saveCustomOptions();
        }
        presetSelect.value = savedPreset;
        optionsInput.value = savedPreset === 'custom'
            ? customOptions
            : sameLocale && typeof saved.options === 'string' && saved.options.trim()
            ? saved.options
            : (presets[savedPreset] || presets.mixed).join('\n');
        excludedInput.value = sameLocale && typeof saved.excluded === 'string' ? saved.excluded : '';
        avoidRecentInput.checked = sameLocale ? saved.avoidRecent !== false : true;
    } catch {
        presetSelect.value = 'mixed';
        optionsInput.value = presets.mixed.join('\n');
    }
    renderRecent();
    preloadItems(normalizeLines(optionsInput.value));
    if (recent.length) {
        setRows(recent[0], normalizeLines(optionsInput.value));
    } else {
        renderSlotRow(previousRow, '', labels.ready);
        renderSlotRow(currentRow, '', labels.choose);
        renderSlotRow(nextRow, '', labels.spinWhenReady);
    }
}

function initWhoPaysRoulette() {
    const namesInput = document.getElementById('payerNames');
    const spinButton = document.getElementById('spinPayer');
    const slotMachine = document.getElementById('payerSlotMachine');
    const previousRow = document.getElementById('payerSlotPrevious');
    const currentRow = document.getElementById('payerSlotCurrent');
    const nextRow = document.getElementById('payerSlotNext');
    const message = document.getElementById('payerMessage');
    const fireworks = document.getElementById('payerFireworks');
    if (!namesInput || !spinButton || !slotMachine) return;

    const storageKey = 'sft-who-pays-roulette';
    const text = (id, fallback) => document.getElementById(id)?.textContent.trim() || fallback;
    const labels = {
        ready: previousRow.textContent.trim(),
        choose: currentRow.textContent.trim(),
        spinWhenReady: nextRow.textContent.trim(),
        spin: spinButton.textContent.trim(),
        spinning: text('payerLabelSpinning', 'Spinning...'),
        spinAgain: text('payerLabelSpinAgain', 'Spin Again'),
        pays: text('payerLabelPays', 'pays!'),
        empty: message.textContent.trim() || 'Add at least two names.'
    };
    let audioContext;

    const normalizeNames = value => [...new Set(value.split(/\r?\n/).map(name => name.trim()).filter(Boolean))];
    const randomIndex = length => {
        if (length <= 1) return 0;
        if (!window.crypto?.getRandomValues) return Math.floor(Math.random() * length);
        const limit = Math.floor(0x100000000 / length) * length;
        const values = new Uint32Array(1);
        do window.crypto.getRandomValues(values); while (values[0] >= limit);
        return values[0] % length;
    };
    const randomName = names => names[randomIndex(names.length)] || '';
    const getAudioContext = () => {
        if (audioContext) return audioContext;
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return null;
        audioContext = new Context();
        return audioContext;
    };
    const playTone = (frequency, duration, volume = 0.035, delay = 0) => {
        const context = getAudioContext();
        if (!context) return;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + delay;
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
    };
    const playWinSound = () => {
        playTone(523.25, 0.16, 0.05);
        playTone(659.25, 0.18, 0.055, 0.11);
        playTone(783.99, 0.24, 0.06, 0.23);
    };
    const saveState = () => {
        try {
            localStorage.setItem(storageKey, JSON.stringify({ names: namesInput.value }));
        } catch {}
    };
    const renderRow = (row, name, fallback, winner = false) => {
        const avatar = document.createElement('span');
        avatar.className = 'payer-slot-avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.textContent = winner ? '💸' : '🧾';
        const label = document.createElement('span');
        label.className = 'lunch-slot-name';
        label.textContent = name ? `${name}${winner ? ` ${labels.pays}` : ''}` : fallback;
        row.replaceChildren(avatar, label);
    };
    const setRows = (selected, names, winner = false) => {
        const alternatives = names.filter(name => name !== selected);
        renderRow(previousRow, randomName(alternatives), labels.ready);
        renderRow(currentRow, selected, labels.choose, winner);
        renderRow(nextRow, randomName(alternatives), labels.spinWhenReady);
    };
    const burstCelebration = reducedMotion => {
        if (!fireworks) return;
        if (fireworks.parentElement !== document.body) document.body.appendChild(fireworks);
        fireworks.replaceChildren();
        const colors = ['#f97316', '#facc15', '#ef4444', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'];
        const origins = [14, 35, 65, 86];
        const count = reducedMotion ? 20 : 88;
        const fragment = document.createDocumentFragment();
        for (let index = 0; index < count; index += 1) {
            const particle = document.createElement('span');
            const origin = origins[index % origins.length] + ((Math.random() * 8) - 4);
            const horizontal = (Math.random() - 0.5) * Math.min(window.innerWidth * 0.46, 460);
            const vertical = -(window.innerHeight * (0.58 + Math.random() * 0.5));
            const rotation = Math.round((Math.random() * 900) - 450);
            particle.className = 'lunch-confetti';
            particle.style.setProperty('--confetti-color', colors[index % colors.length]);
            particle.style.setProperty('--confetti-origin', `${origin}%`);
            particle.style.setProperty('--confetti-x', `${horizontal}px`);
            particle.style.setProperty('--confetti-y', `${vertical}px`);
            particle.style.setProperty('--confetti-fall-x', `${horizontal + ((Math.random() - 0.5) * 32)}px`);
            particle.style.setProperty('--confetti-fall-y', `${vertical + 18 + (Math.random() * 36)}px`);
            particle.style.setProperty('--confetti-rotate', `${rotation}deg`);
            particle.style.setProperty('--confetti-end-rotate', `${rotation + 260 + Math.round(Math.random() * 420)}deg`);
            particle.style.setProperty('--confetti-width', `${8 + Math.round(Math.random() * 8)}px`);
            particle.style.setProperty('--confetti-height', `${12 + Math.round(Math.random() * 13)}px`);
            particle.style.setProperty('--confetti-radius', index % 3 === 0 ? '999px' : '2px');
            particle.style.setProperty('--confetti-delay', `${Math.round(Math.random() * 150)}ms`);
            fragment.appendChild(particle);
        }
        fireworks.appendChild(fragment);
        window.setTimeout(() => fireworks.replaceChildren(), 1750);
    };
    const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

    spinButton.addEventListener('click', async () => {
        const names = normalizeNames(namesInput.value);
        if (names.length < 2) {
            message.textContent = labels.empty;
            message.classList.remove('hidden');
            return;
        }
        saveState();
        message.classList.add('hidden');
        spinButton.disabled = true;
        spinButton.textContent = labels.spinning;
        slotMachine.classList.remove('is-complete');
        slotMachine.classList.add('is-spinning');
        getAudioContext()?.resume?.();
        const winner = randomName(names);
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const steps = reducedMotion ? 3 : 25;
        for (let step = 0; step < steps; step += 1) {
            setRows(randomName(names), names);
            if (!reducedMotion && step % 2 === 0) playTone(220 + (step * 8), 0.045, 0.02);
            const progress = step / Math.max(steps - 1, 1);
            await wait(reducedMotion ? 35 : 42 + Math.round(progress * progress * 150));
        }
        setRows(winner, names, true);
        slotMachine.classList.remove('is-spinning');
        slotMachine.classList.add('is-complete');
        playWinSound();
        burstCelebration(reducedMotion);
        spinButton.textContent = labels.spinAgain;
        spinButton.disabled = false;
    });

    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (typeof saved.names === 'string' && saved.names.trim()) namesInput.value = saved.names;
    } catch {}
    renderRow(previousRow, '', labels.ready);
    renderRow(currentRow, '', labels.choose);
    renderRow(nextRow, '', labels.spinWhenReady);
}

function setupNameGenerator(config, generatedLists) {
    const countInput = document.getElementById(config.countId);
    const output = document.getElementById(config.outputId);
    const generateButton = document.getElementById(config.generateId);
    const downloadButton = document.getElementById(config.downloadId);
    if (!countInput || !output || !generateButton || !downloadButton) return;
    setupCountSlider(config.countId);
    const recent = [];
    const createFreshName = () => {
        let name = config.createName();
        for (let attempt = 0; attempt < 20 && recent.includes(name); attempt += 1) {
            name = config.createName();
        }
        recent.push(name);
        if (recent.length > 80) recent.shift();
        return name;
    };

    generateButton.addEventListener('click', () => {
        generatedLists[config.key] = [createFreshName()];
        output.innerText = generatedLists[config.key].join('\n');
    });

    downloadButton.addEventListener('click', () => {
        const count = clampCount(countInput.value);
        countInput.value = count;
        const downloadNames = Array.from({ length: count }, createFreshName);
        downloadTextFile(config.fileName, downloadNames.join('\n'));
    });
}

function createFantasyPlaceName(prefixes, suffixes, middles) {
    const prefix = pick(prefixes);
    const suffix = pick(suffixes);
    const middle = pick(middles);
    const number = randomInt(2, 99);
    const variants = [
        () => `${prefix}${suffix}`,
        () => `${prefix} ${suffix}`,
        () => `${prefix}-${suffix}`,
        () => `${prefix}${suffix} ${middle}`,
        () => `${prefix} ${suffix} ${middle}`,
        () => `${prefix}-${suffix} ${middle}`,
        () => `${prefix} ${middle} ${suffix}`,
        () => `${prefix}${suffix}-${number}`,
        () => `${prefix} ${suffix} ${number}`,
        () => `${prefix}-${suffix}-${number}`
    ];
    return pick(variants)();
}

function createSciFiPlaceName(prefixes, suffixes, middles) {
    const prefix = pick(prefixes);
    const suffix = pick(suffixes);
    const middle = pick(middles);
    const smallNumber = randomInt(2, 99);
    const largeNumber = randomInt(100, 9999);
    const greek = pick(['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Omega', 'Sigma', 'Tau']);
    const variants = [
        () => `${prefix}${suffix}`,
        () => `${prefix} ${suffix}`,
        () => `${prefix}-${suffix}`,
        () => `${prefix} ${suffix}-${largeNumber}`,
        () => `${prefix}-${suffix}-${smallNumber}`,
        () => `${prefix} ${greek}`,
        () => `${prefix}-${greek} ${suffix}`,
        () => `${prefix} ${middle}`,
        () => `${middle} ${suffix}`,
        () => `${prefix}${smallNumber} ${suffix}`,
        () => `${prefix}-${largeNumber}`,
        () => `${prefix} ${suffix} ${middle}`
    ];
    return pick(variants)();
}

function setupCountSlider(countId) {
    const countInput = document.getElementById(countId);
    const countValue = document.getElementById(`${countId}Value`);
    if (!countInput || !countValue) return;
    countValue.innerText = clampCount(countInput.value);
    countInput.addEventListener('input', () => {
        countValue.innerText = clampCount(countInput.value);
    });
}

function setupClampedNumberInput(inputId, clampValue) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const applyClamp = () => {
        input.value = clampValue(input.value);
    };
    input.addEventListener('change', applyClamp);
    input.addEventListener('blur', applyClamp);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') applyClamp();
    });
}

function clampCount(value) {
    return Math.min(100, Math.max(1, parseInt(value, 10) || 1));
}

function clampLoremLength(value) {
    return Math.min(1000, Math.max(10, parseInt(value, 10) || 120));
}

function createPassword() {
    const lengthInput = document.getElementById('passwordLength');
    const length = Math.min(64, Math.max(6, parseInt(lengthInput?.value, 10) || 25));
    if (lengthInput) lengthInput.value = length;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
    return Array.from({ length }, () => chars[randomInt(0, chars.length - 1)]).join('');
}

function createRandomNumber() {
    const min = parseInt(document.getElementById('randomMin')?.value, 10) || 0;
    const max = parseInt(document.getElementById('randomMax')?.value, 10) || 0;
    return randomInt(Math.min(min, max), Math.max(min, max));
}

function createUuid() {
    return crypto.randomUUID ? crypto.randomUUID() : fallbackUuid();
}

function createLoremIpsum(wordCount) {
    const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit integer vitae justo arcu facilisis posuere donec sapien neque luctus pulvinar maecenas tempor magna pretium ultricies sed cursus libero fermentum curabitur blandit mauris'.split(' ');
    return Array.from({ length: wordCount }, (_, index) => {
        const word = words[index % words.length];
        return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    }).join(' ') + '.';
}

function downloadTextFile(fileName, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function pick(items) {
    return items[randomInt(0, items.length - 1)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fallbackUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
        const value = Math.floor(Math.random() * 16);
        return (char === 'x' ? value : (value & 0x3) | 0x8).toString(16);
    });
}
