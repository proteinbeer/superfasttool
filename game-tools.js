function initGameTools() {
    const $ = id => document.getElementById(id);
    const pick = list => list[Math.floor(Math.random() * list.length)];
    const clamp = (value, min, max) => Math.min(Math.max(Number(value) || min, min), max);
    const shuffle = list => [...list].sort(() => Math.random() - 0.5);
    const set = (id, html) => {
        const element = $(id);
        if (element) element.innerHTML = html;
    };
    const bind = (id, event, handler) => {
        const element = $(id);
        if (element) element.addEventListener(event, handler);
    };
    const cardLine = text => `<div class="rounded-xl border border-gray-200 bg-zinc-50 px-3 py-2">${text}</div>`;
    let rewardAudioContext = null;
    const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    function playRewardSound(strong = false) {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            rewardAudioContext ||= new AudioContextClass();
            const now = rewardAudioContext.currentTime;
            [392, 523.25, strong ? 783.99 : 659.25].forEach((frequency, index) => {
                const oscillator = rewardAudioContext.createOscillator();
                const gain = rewardAudioContext.createGain();
                oscillator.type = index === 2 ? 'triangle' : 'square';
                oscillator.frequency.setValueAtTime(frequency, now + index * 0.055);
                gain.gain.setValueAtTime(0.0001, now + index * 0.055);
                gain.gain.exponentialRampToValueAtTime(strong ? 0.14 : 0.08, now + index * 0.055 + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.055 + 0.16);
                oscillator.connect(gain).connect(rewardAudioContext.destination);
                oscillator.start(now + index * 0.055);
                oscillator.stop(now + index * 0.055 + 0.18);
            });
        } catch {}
    }
    function ensureRewardFxStyles() {
        if (document.getElementById('rewardFxStyles')) return;
        const style = document.createElement('style');
        style.id = 'rewardFxStyles';
        style.textContent = `
            .lunch-fireworks { position: fixed; inset: 0; z-index: 250; pointer-events: none; overflow: hidden; }
            .lunch-confetti { position: absolute; left: var(--confetti-origin); bottom: -28px; width: var(--confetti-width); height: var(--confetti-height); border-radius: var(--confetti-radius); background: var(--confetti-color); opacity: 0; transform: translate(-50%, 0) scale(0.45) rotate(0deg); will-change: transform, opacity; animation: lunchConfettiBurst 1.35s cubic-bezier(.12,.72,.16,1) var(--confetti-delay) forwards; }
            .reward-roll-card { grid-column: 1 / -1; min-height: 4.4rem; display: flex; align-items: center; justify-content: center; text-align: center; perspective: 420px; }
            .reward-roll-dice { position: relative; width: 2.9rem; height: 2.9rem; transform-style: preserve-3d; animation: rewardDiceRoll3d 0.72s cubic-bezier(.3,.72,.18,1) infinite; }
            .reward-roll-face { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; border-radius: 0.62rem; border: 1px solid rgba(24,24,27,0.22); background: linear-gradient(145deg, #ffffff, #f4f4f5); box-shadow: inset -8px -8px 14px rgba(24,24,27,0.1), inset 5px 5px 10px rgba(255,255,255,0.92), 0 10px 18px rgba(24,24,27,0.12); color: #18181b; font-size: 1.25rem; font-weight: 900; line-height: 1; backface-visibility: hidden; }
            .reward-roll-face:nth-child(1) { transform: translateZ(1.45rem); }
            .reward-roll-face:nth-child(2) { transform: rotateY(90deg) translateZ(1.45rem); }
            .reward-roll-face:nth-child(3) { transform: rotateY(180deg) translateZ(1.45rem); }
            .reward-roll-face:nth-child(4) { transform: rotateY(-90deg) translateZ(1.45rem); }
            .reward-roll-face:nth-child(5) { transform: rotateX(90deg) translateZ(1.45rem); }
            .reward-roll-face:nth-child(6) { transform: rotateX(-90deg) translateZ(1.45rem); }
            @keyframes rewardDiceRoll3d { 0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateY(0); } 35% { transform: rotateX(120deg) rotateY(170deg) rotateZ(24deg) translateY(-4px); } 70% { transform: rotateX(245deg) rotateY(300deg) rotateZ(-18deg) translateY(1px); } 100% { transform: rotateX(360deg) rotateY(540deg) rotateZ(0deg) translateY(0); } }
            @keyframes lunchConfettiBurst { 0% { opacity: 0; transform: translate(-50%, 0) scale(0.45) rotate(0deg); } 8% { opacity: 1; } 72% { opacity: 1; transform: translate(calc(-50% + var(--confetti-x)), var(--confetti-y)) scale(1) rotate(var(--confetti-rotate)); } 100% { opacity: 0; transform: translate(calc(-50% + var(--confetti-fall-x)), var(--confetti-fall-y)) scale(0.92) rotate(var(--confetti-end-rotate)); } }
        `;
        document.head.appendChild(style);
    }
    function burstRewardConfetti(strong = false) {
        if (!strong) return;
        ensureRewardFxStyles();
        const layer = document.createElement('div');
        layer.className = 'lunch-fireworks';
        document.body.appendChild(layer);
        const colors = ['#f97316', '#facc15', '#ef4444', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'];
        const count = 72;
        const fragment = document.createDocumentFragment();
        for (let index = 0; index < count; index += 1) {
            const particle = document.createElement('span');
            const origin = 15 + Math.random() * 70;
            const horizontal = (Math.random() - 0.5) * window.innerWidth * 0.9;
            const vertical = -(window.innerHeight * (0.35 + Math.random() * 0.55));
            const rotation = Math.round((Math.random() * 900) - 450);
            particle.className = 'lunch-confetti';
            particle.style.setProperty('--confetti-color', colors[index % colors.length]);
            particle.style.setProperty('--confetti-origin', `${origin}%`);
            particle.style.setProperty('--confetti-x', `${horizontal}px`);
            particle.style.setProperty('--confetti-y', `${vertical}px`);
            particle.style.setProperty('--confetti-fall-x', `${horizontal + ((Math.random() - 0.5) * 28)}px`);
            particle.style.setProperty('--confetti-fall-y', `${vertical + 16 + (Math.random() * 34)}px`);
            particle.style.setProperty('--confetti-rotate', `${rotation}deg`);
            particle.style.setProperty('--confetti-end-rotate', `${rotation + 260 + Math.round(Math.random() * 420)}deg`);
            particle.style.setProperty('--confetti-width', `${8 + Math.round(Math.random() * 8)}px`);
            particle.style.setProperty('--confetti-height', `${12 + Math.round(Math.random() * 13)}px`);
            particle.style.setProperty('--confetti-radius', index % 3 === 0 ? '999px' : '2px');
            particle.style.setProperty('--confetti-delay', `${Math.round(Math.random() * 130)}ms`);
            fragment.appendChild(particle);
        }
        layer.appendChild(fragment);
        window.setTimeout(() => layer.remove(), 1750);
    }
    function rewardRollCard() {
        ensureRewardFxStyles();
        return '<div class="reward-roll-card rounded-xl border border-orange-200 bg-orange-50 px-3 py-3 shadow-sm"><span class="reward-roll-dice" aria-hidden="true"><span class="reward-roll-face">1</span><span class="reward-roll-face">2</span><span class="reward-roll-face">3</span><span class="reward-roll-face">4</span><span class="reward-roll-face">5</span><span class="reward-roll-face">6</span></span></div>';
    }
    async function animateReward(outputId, finalHtml, rollingLabels, strong = false) {
        const output = $(outputId);
        if (!output) return;
        for (let index = 0; index < 12; index += 1) {
            output.innerHTML = rewardRollCard();
            await wait(45 + index * 6);
        }
        output.innerHTML = finalHtml;
        playRewardSound(strong);
        burstRewardConfetti(strong);
    }

    const rarityTheme = {
        normal: {
            label: 'Normal',
            style: 'background:#ffffff;border-color:#d4d4d8;color:#52525b;',
            classes: '',
            chance: 0.7
        },
        rare: {
            label: 'Rare',
            style: 'background:#dbeafe;border-color:#60a5fa;color:#1d4ed8;',
            classes: '',
            chance: 0.84
        },
        epic: {
            label: 'Epic',
            style: 'background:#f3e8ff;border-color:#a855f7;color:#7e22ce;',
            classes: '',
            chance: 0.13
        },
        legendary: {
            label: 'Legendary',
            style: 'background:#fef3c7;border-color:#f59e0b;color:#92400e;',
            classes: 'rarity-legendary',
            chance: 0.025
        },
        mythic: {
            label: 'Mythic',
            style: 'background:#fee2e2;border-color:#ef4444;color:#b91c1c;',
            classes: 'rarity-mythic',
            chance: 0.005
        }
    };

    function rarityCard(rarity, title, detail = '') {
        const theme = rarityTheme[rarity] || rarityTheme.rare;
        return `<div class="rounded-xl border px-3 py-2 ${theme.classes}" style="${theme.style}">
            <div class="text-[10px] uppercase tracking-wide">${theme.label}</div>
            <div class="text-sm font-black">${title}</div>
            ${detail ? `<div class="mt-1 text-[11px] font-bold opacity-80">${detail}</div>` : ''}
        </div>`;
    }

    function getWeight(id, fallback) {
        const element = $(id);
        const value = element ? Number(element.value) : fallback;
        return Number.isFinite(value) && value > 0 ? value : 0;
    }

    function weightedRarity(weights, forceMythic = false) {
        if (forceMythic) return 'mythic';
        const entries = ['normal', 'rare', 'epic', 'legendary', 'mythic'].map(rarity => [rarity, Math.max(Number(weights[rarity]) || 0, 0)]);
        const total = entries.reduce((sum, item) => sum + item[1], 0) || 1;
        let roll = Math.random() * total;
        for (const [rarity, weight] of entries) {
            roll -= weight;
            if (roll <= 0) return rarity;
        }
        return 'normal';
    }

    function probabilityWeights(prefix, defaults) {
        return {
            normal: getWeight(`${prefix}ProbNormal`, defaults.normal),
            rare: getWeight(`${prefix}ProbRare`, defaults.rare),
            epic: getWeight(`${prefix}ProbEpic`, defaults.epic),
            legendary: getWeight(`${prefix}ProbLegendary`, defaults.legendary),
            mythic: getWeight(`${prefix}ProbMythic`, defaults.mythic)
        };
    }

    let gachaPity = 0;
    const heroes = {
        normal: ['No summon', 'Dust Shard', 'Blank Sigil', 'Training Token', 'Common Spark'],
        mythic: ['Aurelia Starheart', 'Noctis the Red Moon', 'Seraphine Zero', 'Kael Nova Prime'],
        legendary: ['Sol Knight', 'Luna Vey', 'Orion Vale', 'Nyx Aurora', 'Astra Nova'],
        epic: ['Mira Flux', 'Rune Atlas', 'Kade Ember', 'Iris Gale', 'Vega Frost'],
        rare: ['Rook', 'Pip', 'Nia', 'Taro', 'Lio', 'Moss']
    };
    const defaultGachaWeights = { normal: 70, rare: 20, epic: 8, legendary: 1.5, mythic: 0.5 };
    const defaultLootWeights = { normal: 55, rare: 30, epic: 11, legendary: 3, mythic: 1 };
    const fixedGameLootWeights = { normal: 48, rare: 32, epic: 14, legendary: 5, mythic: 1 };

    function gachaPull() {
        gachaPity += 1;
        const rarity = weightedRarity(probabilityWeights('gacha', defaultGachaWeights), gachaPity >= 90);
        if (rarity === 'mythic') gachaPity = 0;
        return { rarity, name: pick(heroes[rarity]) };
    }

    async function renderGachaResults(results) {
        set('gachaPity', `${gachaPity} / 90`);
        const finalHtml = results.map(item => rarityCard(item.rarity, item.name, 'Hero summon')).join('');
        const strong = results.some(item => item.rarity === 'legendary' || item.rarity === 'mythic');
        await animateReward('gachaResults', finalHtml, Object.values(heroes).flat(), strong);
    }

    bind('gachaPullOne', 'click', () => renderGachaResults([gachaPull(false)]));
    bind('gachaPullTen', 'click', () => {
        const results = Array.from({ length: 10 }, () => gachaPull());
        renderGachaResults(results);
    });

    const lootByRarity = {
        normal: ['Empty Pouch', 'Bent Nail', 'Plain Cloth', 'Cracked Pebble', 'Wooden Token'],
        mythic: ['Eclipse Crown', 'Dragonheart Relic', 'Red Star Contract'],
        legendary: ['Phoenix Crown', 'Starforged Blade', 'Celestial Mount'],
        epic: ['Void Compass', 'Dragon Scale Armor', 'Storm Wand'],
        rare: ['Silver Key', 'Moon Charm', 'Frost Dagger']
    };

    function lootDrop() {
        const rarity = weightedRarity(probabilityWeights('loot', defaultLootWeights), false);
        const name = pick(lootByRarity[rarity]);
        return { rarity, name, html: rarityCard(rarity, name, 'Loot box reward') };
    }
    bind('lootOpenOne', 'click', () => {
        const reward = lootDrop();
        animateReward('lootBoxResults', reward.html, Object.values(lootByRarity).flat(), reward.rarity === 'legendary' || reward.rarity === 'mythic');
    });
    bind('lootOpenTen', 'click', () => {
        const rewards = Array.from({ length: 10 }, lootDrop);
        animateReward('lootBoxResults', rewards.map(item => item.html).join(''), Object.values(lootByRarity).flat(), rewards.some(item => item.rarity === 'legendary' || item.rarity === 'mythic'));
    });

    bind('rollDice', 'click', () => {
        const sides = clamp($('diceSides').value, 2, 100);
        const count = clamp($('diceCount').value, 1, 20);
        const mod = Number($('diceModifier').value) || 0;
        const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
        const total = rolls.reduce((sum, value) => sum + value, 0) + mod;
        set('diceResult', `Rolls: ${rolls.join(', ')}<br>Total: ${total}`);
    });

    const characterNames = ['Mira Ashvale', 'Korin Thorne', 'Sel Veyra', 'Alden Frost', 'Nyra Sol', 'Taro Vale'];
    const classes = ['Warden', 'Spellblade', 'Ranger', 'Oracle', 'Brawler', 'Artificer'];
    const origins = ['sky island', 'lost archive', 'desert city', 'frozen port', 'moon temple'];
    const weapons = ['crystal spear', 'clockwork bow', 'ember blade', 'rune staff', 'gravity hammer'];
    const traits = ['reckless but loyal', 'quietly brilliant', 'haunted by a promise', 'always smiling', 'never backs down'];
    const flaws = ['trusts the wrong people', 'hides every injury', 'cannot resist forbidden magic', 'runs from old debts'];
    const goals = ['restore a ruined home', 'find a vanished mentor', 'break a family curse', 'prove a false legend true'];
    const backstories = [
        'They survived a disaster that everyone else remembers differently.',
        'They once guarded a secret door and still hear it calling at night.',
        'They carry a map that changes whenever someone lies nearby.',
        'They were raised by rivals and learned to solve problems from both sides.'
    ];
    bind('generateRpgCharacter', 'click', () => set('rpgCharacterResult', `
        <strong>${pick(characterNames)}</strong><br>
        Class: ${pick(classes)} from a ${pick(origins)}<br>
        Weapon: ${pick(weapons)}<br>
        Trait: ${pick(traits)}<br>
        Flaw: ${pick(flaws)}<br>
        Goal: ${pick(goals)}<br>
        Backstory: ${pick(backstories)}
    `));

    bind('generateQuest', 'click', () => {
        const objectives = ['Recover', 'Escort', 'Investigate', 'Protect', 'Steal back', 'Seal away'];
        const objects = ['a broken relic', 'a missing heir', 'a cursed map', 'the last lantern', 'a silent oracle'];
        const places = ['under the glass ruins', 'inside a moving tower', 'beneath the old arena', 'near the mirror lake'];
        const enemies = ['a masked guild', 'restless spirits', 'a jealous knight', 'wild clockwork beasts'];
        const complications = ['the employer is hiding the real reason', 'the target wants to be found', 'the reward is cursed', 'time resets at sunset'];
        const allies = ['a nervous cartographer', 'a retired monster hunter', 'a talking lock', 'a runaway noble'];
        const rewards = ['ancient favor', 'rare ore', 'a forbidden spell', 'a royal pardon'];
        set('questResult', `
            <strong>${pick(objectives)} ${pick(objects)}</strong><br>
            Location: ${pick(places)}<br>
            Threat: ${pick(enemies)}<br>
            Ally: ${pick(allies)}<br>
            Twist: ${pick(complications)}<br>
            Reward: ${pick(rewards)}
        `);
    });

    bind('generateGameLoot', 'click', () => {
        const prefixes = ['Ancient', 'Radiant', 'Cursed', 'Swift', 'Frozen', 'Wild', 'Hollow', 'Royal'];
        const bases = ['Blade', 'Amulet', 'Bow', 'Cloak', 'Ring', 'Lantern', 'Gauntlet', 'Grimoire'];
        const stats = ['+12 Power', '+8 Speed', '+20 Health', '+15 Focus', '+10 Luck', '+18 Guard'];
        const effects = ['burns nearby foes', 'reveals hidden paths', 'heals after victory', 'echoes the last spell', 'turns fear into shield power'];
        const drawbacks = ['whispers during rests', 'grows heavier after each battle', 'attracts rival treasure hunters', 'refuses to work under moonlight'];
        const lore = [
            'Found in a chest sealed beneath an abandoned champion hall.',
            'Forged for a hero who disappeared before the final battle.',
            'Said to remember every owner who failed its trial.',
            'Recovered from a vault that only opens during storms.'
        ];
        const rarity = weightedRarity(fixedGameLootWeights, false);
        set('gameLootResult', rarityCard(
            rarity,
            `${pick(prefixes)} ${pick(bases)}`,
            `${pick(stats)} - ${pick(effects)}<br>Drawback: ${pick(drawbacks)}<br>Lore: ${pick(lore)}`
        ));
    });

    function namesFrom(id) {
        const element = $(id);
        return ((element && element.value) || '').split(/\r?\n/).map(name => name.trim()).filter(Boolean);
    }

    bind('pickTeams', 'click', () => {
        const names = shuffle(namesFrom('teamNames'));
        const count = clamp($('teamCount').value, 2, 12);
        const teams = Array.from({ length: count }, () => []);
        names.forEach((name, index) => teams[index % count].push(name));
        set('teamResult', teams.map((team, index) => cardLine(`Team ${index + 1}: ${team.join(', ') || '-'}`)).join(''));
    });

    bind('generateBracket', 'click', () => {
        const players = shuffle(namesFrom('bracketNames'));
        if (players.length < 2) {
            set('bracketResult', cardLine('Add at least two players.'));
            return;
        }
        if (players.length % 2) players.push('BYE');
        const matches = [];
        for (let index = 0; index < players.length; index += 2) {
            matches.push(cardLine(`${players[index]} vs ${players[index + 1]}`));
        }
        set('bracketResult', matches.join(''));
    });

    bind('flipCoin', 'click', () => set('decisionResult', pick(['Heads', 'Tails'])));
    bind('rollDecisionDie', 'click', () => set('decisionResult', `d6: ${Math.floor(Math.random() * 6) + 1}`));
    bind('pickDecision', 'click', () => {
        const options = namesFrom('decisionOptions');
        set('decisionResult', options.length ? pick(options) : 'Add one item per line.');
    });

    let reactionTimer = null;
    let reactionReadyAt = 0;
    function setReactionPad(pad, text, stateClass = '') {
        pad.className = `reaction-pad min-h-32 rounded-2xl border bg-zinc-100 px-4 py-8 text-sm font-black text-zinc-700 cursor-pointer ${stateClass}`.trim();
        pad.innerHTML = `<span>${text}</span>`;
    }
    bind('reactionPad', 'click', () => {
        const pad = $('reactionPad');
        if (reactionReadyAt) {
            const ms = Date.now() - reactionReadyAt;
            reactionReadyAt = 0;
            setReactionPad(pad, 'Start', 'border-gray-200');
            set('reactionResult', `${ms} ms`);
            return;
        }
        if (reactionTimer) {
            clearTimeout(reactionTimer);
            reactionTimer = null;
            set('reactionResult', 'Too soon. Try again.');
            setReactionPad(pad, 'Start', 'border-gray-200');
            return;
        }
        setReactionPad(pad, 'Wait...', 'is-waiting border-emerald-300');
        set('reactionResult', '--');
        reactionTimer = setTimeout(() => {
            reactionTimer = null;
            reactionReadyAt = Date.now();
            setReactionPad(pad, 'Click!', 'is-ready border-emerald-300 bg-emerald-100 text-emerald-800');
        }, 900 + Math.random() * 2200);
    });

    let memoryStage = 1;
    let memoryFirst = null;
    let memoryLock = false;
    let memoryMatched = 0;
    let memoryTimer = null;
    let memoryRoundId = 0;
    let memoryTimeExpired = false;
    const maxMemoryPairs = 18;
    const memorySymbols = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
        '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦄', '🐝', '🦋', '🐞', '🐢', '🐙',
        '🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝', '🍅', '🥕',
        '🌽', '🥑', '🍄', '🥐', '🍞', '🧀', '🍔', '🍕', '🌮', '🍣', '🍙', '🍪',
        '🍩', '🧁', '🍰', '🍫', '🍿', '🥨', '🥞', '🧇', '🍦', '🍭', '🥤', '☕'
    ];

    function stopMemoryTimer() {
        if (memoryTimer) clearInterval(memoryTimer);
        memoryTimer = null;
        $('memoryTimerBox')?.classList.remove('is-low-time');
    }

    function startMemoryTimer(pairCount, roundId) {
        stopMemoryTimer();
        const totalSeconds = 3 * (memoryStage <= 25
            ? Math.round(pairCount * (7 - (memoryStage - 1) * 0.08))
            : Math.max(8, Math.round(91 * Math.pow(0.965, memoryStage - 25))));
        const deadline = Date.now() + totalSeconds * 1000;
        const update = () => {
            if (roundId !== memoryRoundId) return stopMemoryTimer();
            const remainingMs = Math.max(0, deadline - Date.now());
            const remainingRatio = Math.max(0, Math.min(1, remainingMs / (totalSeconds * 1000)));
            const timerBar = $('memoryTimerBar');
            const timerBox = $('memoryTimerBox');
            if (timerBar) {
                timerBar.style.width = `${remainingRatio * 100}%`;
                timerBar.style.backgroundColor = '#18181b';
                timerBar.setAttribute('aria-valuenow', String(Math.round(remainingRatio * 100)));
            }
            timerBox?.classList.toggle('is-low-time', remainingRatio <= 1 / 3 && remainingMs > 0);
            if (remainingMs > 0) return;
            stopMemoryTimer();
            memoryTimeExpired = true;
            memoryLock = true;
            set('memoryResult', `Time's up! Restarting stage ${memoryStage}...`);
            setTimeout(() => {
                if (roundId === memoryRoundId) startMemoryGame(false);
            }, 900);
        };
        update();
        memoryTimer = setInterval(update, 200);
    }

    function startMemoryGame(resetStage = false) {
        const grid = $('memoryGrid');
        if (!grid) return;
        if (resetStage) memoryStage = 1;
        stopMemoryTimer();
        memoryRoundId += 1;
        const roundId = memoryRoundId;
        memoryFirst = null;
        memoryLock = false;
        memoryTimeExpired = false;
        memoryMatched = 0;
        const pairCount = Math.min(maxMemoryPairs, memoryStage + 1);
        const symbols = shuffle([...memorySymbols]).slice(0, pairCount);
        const deck = shuffle([...symbols, ...symbols]);
        const columnCount = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(deck.length))));
        grid.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;
        grid.innerHTML = deck.map(symbol => `<button type="button" data-symbol="${symbol}" class="memory-card rounded-xl border border-gray-200 bg-zinc-100 px-2 py-3 text-2xl font-black text-zinc-100 cursor-pointer">?</button>`).join('');
        set('memoryStage', String(memoryStage));
        set('memoryResult', `0 / ${pairCount}`);
        startMemoryTimer(pairCount, roundId);
    }

    bind('newMemoryGame', 'click', () => startMemoryGame(true));
    const memoryGrid = $('memoryGrid');
    if (memoryGrid) {
        memoryGrid.addEventListener('click', event => {
            const button = event.target.closest('.memory-card');
            if (!button || memoryLock || button.dataset.done === 'true' || button === memoryFirst) return;
            button.textContent = button.dataset.symbol;
            button.classList.remove('text-zinc-100');
            if (!memoryFirst) {
                memoryFirst = button;
                return;
            }
            const pairCount = Math.min(maxMemoryPairs, memoryStage + 1);
            if (memoryFirst.dataset.symbol === button.dataset.symbol) {
                memoryMatched += 1;
                memoryFirst.dataset.done = 'true';
                button.dataset.done = 'true';
                memoryFirst.classList.add('is-matched', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
                button.classList.add('is-matched', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
                memoryFirst = null;
                if (memoryMatched === pairCount) {
                    stopMemoryTimer();
                    set('memoryResult', `Stage clear! Next stage starts now.`);
                    memoryLock = true;
                    const roundId = memoryRoundId;
                    setTimeout(() => {
                        if (roundId !== memoryRoundId) return;
                        memoryStage += 1;
                        startMemoryGame(false);
                    }, 700);
                    return;
                }
            } else {
                memoryLock = true;
                const firstCard = memoryFirst;
                const secondCard = button;
                const roundId = memoryRoundId;
                firstCard.classList.add('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                button.classList.add('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                setTimeout(() => {
                    if (roundId !== memoryRoundId) return;
                    firstCard.textContent = '?';
                    secondCard.textContent = '?';
                    firstCard.classList.remove('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                    secondCard.classList.remove('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                    firstCard.classList.add('text-zinc-100');
                    secondCard.classList.add('text-zinc-100');
                    memoryFirst = null;
                    memoryLock = memoryTimeExpired;
                }, 650);
            }
            set('memoryResult', `${memoryMatched} / ${pairCount}`);
        });
        if (window.SFT_TOOL_PAGE?.slug === 'memory-card-game') startMemoryGame(true);
    }

    const impossibleChoiceSeeds = [
        { q: 'Choose your permanent advantage.', a: ['Always know when someone lies', 2, 0, 1, 1], b: ['Always know exactly what to say', 0, 1, 2, 1] },
        { q: 'Which future would you accept?', a: ['A peaceful life with no surprises', -1, 2, 1, -1], b: ['A chaotic life full of discoveries', 2, -1, 0, 2] },
        { q: 'Choose one impossible power.', a: ['Pause time for everyone but you', 2, 0, -1, 2], b: ['Rewind one conversation each day', 0, 1, 2, -1] },
        { q: 'Only one memory can remain.', a: ['Your happiest day', 0, 2, 2, -1], b: ['Your most important lesson', 2, 0, 0, 1] },
        { q: 'Where must you live for ten years?', a: ['A beautiful city where nobody knows you', 2, 0, -1, 1], b: ['A dull town with everyone you love', -1, 2, 2, -1] },
        { q: 'Pick the price of success.', a: ['Never receive credit for your work', 0, 1, 2, 1], b: ['Be famous but constantly misunderstood', 1, -1, -1, 2] },
        { q: 'Which truth would you rather learn?', a: ['How your story ends', 2, -1, 0, 2], b: ['What everyone truly thinks of you', 1, 0, 2, 1] },
        { q: 'Choose your strange companion.', a: ['A robot that is always honest', 1, 2, 0, 0], b: ['A ghost that gives brilliant bad advice', 2, -1, 1, 2] },
        { q: 'One door must be opened.', a: ['A door to a random place on Earth', 2, 0, 0, 2], b: ['A door to one moment in your past', 0, 2, 2, -1] },
        { q: 'Which limitation would you take?', a: ['Never use a screen again', 1, 1, 0, 2], b: ['Never travel farther than 10 km from home', -1, 2, 1, -2] },
        { q: 'Choose one social superpower.', a: ['Make any stranger trust you', 0, 0, 2, 2], b: ['Never feel embarrassed again', 1, 1, -1, 2] },
        { q: 'Which world would you visit?', a: ['A perfect simulation of the past', 2, 1, 0, 0], b: ['An unpredictable city 500 years ahead', 2, -1, 0, 2] },
        { q: 'Choose what follows you forever.', a: ['Your own theme music', 1, 0, 1, 2], b: ['A narrator who says your thoughts aloud', 2, -1, -1, 1] },
        { q: 'You can save only one thing.', a: ['Every photo you have ever taken', 0, 2, 2, -1], b: ['Every message you have ever sent', 1, 1, 2, 0] },
        { q: 'Which bargain sounds better?', a: ['Double your free time but halve your income', 0, 2, 1, 1], b: ['Double your income but lose every weekend', -1, -1, 0, 2] },
        { q: 'Pick your flawless skill.', a: ['Understand every language', 2, 0, 2, 1], b: ['Master every musical instrument', 1, 1, 1, 2] },
        { q: 'Which mystery must remain?', a: ['Whether aliens exist', 1, 1, 0, 0], b: ['Whether your biggest decision was correct', 0, -1, 1, 2] },
        { q: 'Choose your unusual home.', a: ['A tiny cabin that can teleport', 2, 1, 0, 2], b: ['A huge mansion that cannot be left', -2, 2, 0, -1] },
        { q: 'What would you erase from humanity?', a: ['The ability to lie', 0, 1, 2, 1], b: ['The feeling of fear', 1, -1, 0, 2] },
        { q: 'Choose your second chance.', a: ['Redo one entire year of your life', 1, 2, 1, 0], b: ['Retry one decision every week', 0, 0, 1, 2] },
        { q: 'Which burden would you carry?', a: ['Feel everyone else\'s emotions', 0, -1, 3, -1], b: ['Nobody can understand your emotions', 1, 1, -2, 2] },
        { q: 'Pick one guaranteed outcome.', a: ['Your friends all achieve their dreams', 0, 1, 3, 0], b: ['You achieve your greatest dream', 1, 0, -1, 3] },
        { q: 'Choose your daily reset.', a: ['Wake up in a different country', 3, -2, 0, 2], b: ['Wake up with a different useful talent', 2, 0, 1, 1] },
        { q: 'Which rule should reality follow?', a: ['Good intentions always matter', 0, 1, 3, -1], b: ['Good results always matter', 1, 0, -1, 2] }
    ];
    const impossibleChoicePrompts = [
        'Which impossible future would you accept?', 'Choose the life you would rather live.',
        'Only one path remains. Which one?', 'Which strange bargain would you take?',
        'Choose before the moment disappears.', 'Which reality sounds less impossible?',
        'What would your instinct protect?', 'Which door would you open?',
        'Pick the risk you could live with.', 'Which tradeoff feels more like you?',
        'One choice becomes permanent. Pick it.', 'Which adventure would you accept?',
        'What matters more in this impossible world?', 'Which fate would you rather face?',
        'Choose the rule for your next life.', 'Which gift is worth its hidden cost?',
        'Which unknown would you step into?', 'What would you refuse to give up?',
        'Choose your impossible advantage.', 'Which story would you rather become?'
    ];
    const impossibleChoiceBanks = [
        {
            score: [3, -1, 0, 1],
            options: [
                'Explore a city that changes its streets every night', 'Read one book from a library outside time',
                'Wake up in a different country every Monday', 'Discover what lies beyond the edge of the universe',
                'Understand the language of every animal', 'Visit one unknown planet with no map',
                'See the forgotten history of any object you touch', 'Enter a dream shared by a thousand strangers',
                'Open a door to a random year in history', 'Spend a month inside a newly invented world',
                'Know the answer to one unsolved mystery', 'Follow a map that redraws itself each sunrise',
                'Meet an intelligent species nobody has documented', 'Learn a new skill every time you get lost',
                'Remember every place you have ever visited perfectly'
            ]
        },
        {
            score: [-1, 3, 1, -1],
            options: [
                'Live peacefully in the same perfect home forever', 'Keep your happiest day unchanged and repeatable',
                'Always have enough time for the people you love', 'Know that tomorrow will never bring a bad surprise',
                'Own one small place that nobody can take away', 'Keep every friendship you currently value for life',
                'Wake up feeling completely rested every day', 'Have a simple job that always feels meaningful',
                'Never lose another treasured possession', 'Know exactly where you belong in every situation',
                'Keep one comforting tradition alive forever', 'Have every difficult decision made one week early',
                'Return safely home from every journey', 'Live without deadlines, alarms, or unexpected calls',
                'Preserve one perfect season for the rest of your life'
            ]
        },
        {
            score: [0, 1, 3, -1],
            options: [
                'Make every lonely person feel understood for one day', 'Give your greatest opportunity to your closest friend',
                'Feel what another person feels before judging them', 'Repair one relationship that ended without closure',
                'Let your family remember only their happiest moments', 'Take away one stranger\'s deepest regret',
                'Help ten people succeed without knowing your name', 'Always find the right words when someone is hurting',
                'Share half your luck with everyone you meet', 'Know whenever a friend secretly needs help',
                'Turn one enemy into a lifelong ally', 'Make every promise you give impossible to break',
                'Carry a loved one\'s fear so they can act bravely', 'Give someone else the second chance meant for you',
                'Make one divided community trust each other again'
            ]
        },
        {
            score: [1, -1, -1, 3],
            options: [
                'Take a guaranteed chance to reinvent your entire life', 'Lead an expedition nobody expects to return from',
                'Say exactly what you think for one full year', 'Risk everything on one dream you truly believe in',
                'Challenge the world\'s greatest expert in public', 'Start over tomorrow with only what you can carry',
                'Accept a powerful job with no instructions', 'Choose freedom even if every plan becomes uncertain',
                'Make one decision that nobody else can reverse', 'Trade your reputation for a historic achievement',
                'Be first to test a technology nobody understands', 'Defend an unpopular truth in front of everyone',
                'Leave comfort behind for a once-in-a-lifetime mission', 'Act on your boldest idea before telling anyone',
                'Become responsible for a city during one impossible crisis'
            ]
        }
    ];
    const generatedImpossibleChoices = [];
    let generatedChoiceIndex = 0;
    for (let leftBank = 0; leftBank < impossibleChoiceBanks.length; leftBank += 1) {
        for (let rightBank = leftBank + 1; rightBank < impossibleChoiceBanks.length; rightBank += 1) {
            impossibleChoiceBanks[leftBank].options.forEach((leftText, leftIndex) => {
                impossibleChoiceBanks[rightBank].options.forEach((rightText, rightIndex) => {
                    const swapSides = (leftIndex + rightIndex + leftBank + rightBank) % 2 === 1;
                    const left = [leftText, ...impossibleChoiceBanks[leftBank].score];
                    const right = [rightText, ...impossibleChoiceBanks[rightBank].score];
                    generatedImpossibleChoices.push({
                        q: impossibleChoicePrompts[generatedChoiceIndex % impossibleChoicePrompts.length],
                        a: swapSides ? right : left,
                        b: swapSides ? left : right
                    });
                    generatedChoiceIndex += 1;
                });
            });
        }
    }
    const impossibleChoices = [
        ...impossibleChoiceSeeds,
        ...shuffle(generatedImpossibleChoices).slice(0, 500 - impossibleChoiceSeeds.length)
    ];

    if (!$('impossibleChoicePulseStyle')) {
        const pulseStyle = document.createElement('style');
        pulseStyle.id = 'impossibleChoicePulseStyle';
        pulseStyle.textContent = `
            @keyframes impossibleChoicePulseA {
                0%, 49.99% { border-color:#fed7aa; background:#fffaf5; box-shadow:0 0 0 2px rgba(251,146,60,.08); }
                50%, 100% { border-color:#e5e7eb; background:#fff; box-shadow:none; }
            }
            @keyframes impossibleChoicePulseB {
                0%, 49.99% { border-color:#e5e7eb; background:#fff; box-shadow:none; }
                50%, 100% { border-color:#fed7aa; background:#fffaf5; box-shadow:0 0 0 2px rgba(251,146,60,.08); }
            }
            @keyframes impossibleChoiceSelected {
                0% { border-color:#fb923c; background:#fff7ed; box-shadow:0 0 0 0 rgba(249,115,22,0); }
                45% { border-color:#f97316; background:#ffedd5; box-shadow:0 0 0 4px rgba(249,115,22,.28), 0 0 20px rgba(249,115,22,.42); }
                100% { border-color:#fb923c; background:#fff7ed; box-shadow:0 0 0 0 rgba(249,115,22,0); }
            }
            .choice-pulse-a { animation:impossibleChoicePulseA .5s steps(1,end) infinite; }
            .choice-pulse-b { animation:impossibleChoicePulseB .5s steps(1,end) infinite; }
            .choice-selected { animation:impossibleChoiceSelected .58s ease-out both; }
        `;
        document.head.appendChild(pulseStyle);
    }
    let choiceDeck = [];
    let choiceIndex = 0;
    let choiceDecided = 0;
    let choiceScores = [0, 0, 0, 0];
    let choiceTimer = null;
    let choiceDeadline = 0;
    const choiceRoundCount = 10;

    function stopChoiceTimer() {
        if (choiceTimer) clearInterval(choiceTimer);
        choiceTimer = null;
        $('choiceTimerBox')?.classList.remove('is-low-time');
    }

    function setChoicePulse(active) {
        $('choiceOptionA')?.classList.toggle('choice-pulse-a', active);
        $('choiceOptionB')?.classList.toggle('choice-pulse-b', active);
    }

    function finishImpossibleChoice() {
        stopChoiceTimer();
        setChoicePulse(false);
        const labels = ['Curiosity', 'Steadiness', 'Empathy', 'Boldness'];
        const top = choiceScores.indexOf(Math.max(...choiceScores));
        const archetypes = [
            ['Curious Pathfinder', 'You choose discovery over certainty and keep opening doors other people pass by.'],
            ['Grounded Guardian', 'You protect what matters, value stability, and rarely mistake noise for importance.'],
            ['Warm Idealist', 'You instinctively measure choices by how they affect the people around you.'],
            ['Bold Catalyst', 'You would rather make a difficult move than spend forever wondering what might happen.']
        ];
        const peak = Math.max(1, ...choiceScores.map(value => Math.abs(value)));
        const metrics = labels.map((label, index) => {
            const value = Math.round(Math.max(8, Math.min(100, 50 + (choiceScores[index] / peak) * 42)));
            return `<div class="text-left"><div class="mb-1 flex justify-between text-[11px] font-bold"><span>${label}</span><span>${value}%</span></div><div class="h-1.5 overflow-hidden rounded-full bg-orange-100"><span class="block h-full rounded-full bg-orange-500" style="width:${value}%"></span></div></div>`;
        }).join('');
        $('choiceOptions')?.classList.add('hidden');
        $('choiceQuestion')?.classList.add('hidden');
        $('choiceTimerBar').style.width = '0%';
        const result = $('choiceResult');
        if (result) {
            result.classList.remove('hidden');
            result.innerHTML = `<div class="text-lg font-black text-zinc-900">${archetypes[top][0]}</div><p class="mt-1 text-xs font-bold text-zinc-600">${archetypes[top][1]}</p><div class="mt-4 space-y-3">${metrics}</div><p class="mt-4 text-[11px] font-bold text-zinc-500">${choiceDecided} of ${choiceRoundCount} choices made in time</p>`;
        }
        set('choiceRound', 'Complete');
        set('choiceStreak', `Decided ${choiceDecided}`);
        set('newImpossibleChoice', 'Start');
        $('newImpossibleChoice')?.classList.remove('hidden');
    }

    function showImpossibleChoice() {
        stopChoiceTimer();
        if (choiceIndex >= choiceRoundCount) return finishImpossibleChoice();
        const item = choiceDeck[choiceIndex];
        const optionA = $('choiceOptionA');
        const optionB = $('choiceOptionB');
        set('choiceRound', `Choice ${choiceIndex + 1} / ${choiceRoundCount}`);
        set('choiceStreak', `Decided ${choiceDecided}`);
        set('choiceQuestion', item.q);
        set('choiceOptionA', item.a[0]);
        set('choiceOptionB', item.b[0]);
        [optionA, optionB].forEach(button => {
            button.disabled = false;
            button.classList.remove('border-orange-400', 'bg-orange-100', 'opacity-50', 'choice-selected');
        });
        setChoicePulse(true);
        $('choiceOptions')?.classList.remove('hidden');
        $('choiceQuestion')?.classList.remove('hidden');
        $('choiceResult')?.classList.add('hidden');
        const bar = $('choiceTimerBar');
        const timerBox = $('choiceTimerBox');
        choiceDeadline = performance.now() + 6000;
        const updateTimer = () => {
            const ratio = Math.max(0, (choiceDeadline - performance.now()) / 6000);
            if (bar) {
                bar.style.width = `${ratio * 100}%`;
                bar.style.backgroundColor = '#18181b';
                bar.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
            }
            timerBox?.classList.toggle('is-low-time', ratio <= 1 / 3 && ratio > 0);
            if (ratio > 0) return;
            stopChoiceTimer();
            setChoicePulse(false);
            [optionA, optionB].forEach(button => {
                button.disabled = true;
                button.classList.add('opacity-50');
            });
            set('choiceQuestion', 'Time slipped away...');
            choiceIndex += 1;
            setTimeout(showImpossibleChoice, 500);
        };
        updateTimer();
        choiceTimer = setInterval(updateTimer, 50);
    }

    function chooseImpossibleOption(side) {
        if (!choiceTimer || choiceIndex >= choiceRoundCount) return;
        stopChoiceTimer();
        setChoicePulse(false);
        const item = choiceDeck[choiceIndex];
        const selected = side === 'a' ? item.a : item.b;
        selected.slice(1).forEach((value, index) => { choiceScores[index] += value; });
        choiceDecided += 1;
        const selectedButton = $(side === 'a' ? 'choiceOptionA' : 'choiceOptionB');
        selectedButton?.classList.add('choice-selected');
        [$('choiceOptionA'), $('choiceOptionB')].forEach(button => { if (button) button.disabled = true; });
        choiceIndex += 1;
        let advanced = false;
        const advance = () => {
            if (advanced) return;
            advanced = true;
            showImpossibleChoice();
        };
        selectedButton?.addEventListener('animationend', advance, { once: true });
        setTimeout(advance, 750);
    }

    function startImpossibleChoice() {
        stopChoiceTimer();
        choiceDeck = shuffle(impossibleChoices).slice(0, choiceRoundCount);
        choiceIndex = 0;
        choiceDecided = 0;
        choiceScores = [0, 0, 0, 0];
        set('newImpossibleChoice', 'Start');
        $('newImpossibleChoice')?.classList.add('hidden');
        showImpossibleChoice();
    }

    bind('choiceOptionA', 'click', () => chooseImpossibleOption('a'));
    bind('choiceOptionB', 'click', () => chooseImpossibleOption('b'));
    bind('newImpossibleChoice', 'click', startImpossibleChoice);
    if (window.SFT_TOOL_PAGE?.slug === 'the-impossible-choice') startImpossibleChoice();
}
