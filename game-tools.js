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

    function renderGachaResults(results) {
        set('gachaPity', `${gachaPity} / 90`);
        set('gachaResults', results.map(item => rarityCard(item.rarity, item.name, 'Hero summon')).join(''));
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
        return rarityCard(rarity, pick(lootByRarity[rarity]), 'Loot box reward');
    }
    bind('lootOpenOne', 'click', () => set('lootBoxResults', lootDrop()));
    bind('lootOpenTen', 'click', () => set('lootBoxResults', Array.from({ length: 10 }, lootDrop).join('')));

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
    let memoryMoves = 0;
    let memoryMatched = 0;
    const maxMemoryStage = 50;

    function memoryLabel(index) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return index < alphabet.length ? alphabet[index] : `P${index + 1}`;
    }

    function startMemoryGame(resetStage = false) {
        const grid = $('memoryGrid');
        if (!grid) return;
        if (resetStage) memoryStage = 1;
        memoryFirst = null;
        memoryLock = false;
        memoryMoves = 0;
        memoryMatched = 0;
        const pairCount = memoryStage + 1;
        const symbols = Array.from({ length: pairCount }, (_, index) => memoryLabel(index));
        const deck = shuffle([...symbols, ...symbols]);
        const columnCount = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(deck.length))));
        grid.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;
        grid.innerHTML = deck.map(symbol => `<button type="button" data-symbol="${symbol}" class="memory-card rounded-xl border border-gray-200 bg-zinc-100 px-2 py-3 text-sm font-black text-zinc-100 cursor-pointer">?</button>`).join('');
        set('memoryStage', `${memoryStage} / ${maxMemoryStage}`);
        set('memoryResult', `Moves: 0 - Pairs: 0 / ${pairCount}`);
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
            memoryMoves += 1;
            const pairCount = memoryStage + 1;
            if (memoryFirst.dataset.symbol === button.dataset.symbol) {
                memoryMatched += 1;
                memoryFirst.dataset.done = 'true';
                button.dataset.done = 'true';
                memoryFirst.classList.add('is-matched', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
                button.classList.add('is-matched', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-800');
                memoryFirst = null;
                if (memoryMatched === pairCount) {
                    if (memoryStage >= maxMemoryStage) {
                        set('memoryResult', `Complete! 50 stages cleared in ${memoryMoves} moves.`);
                    } else {
                        set('memoryResult', `Stage clear! Next stage starts now.`);
                        memoryLock = true;
                        setTimeout(() => {
                            memoryStage += 1;
                            startMemoryGame(false);
                        }, 700);
                    }
                    return;
                }
            } else {
                memoryLock = true;
                memoryFirst.classList.add('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                button.classList.add('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                setTimeout(() => {
                    memoryFirst.textContent = '?';
                    button.textContent = '?';
                    memoryFirst.classList.remove('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                    button.classList.remove('is-missed', 'border-red-200', 'bg-red-50', 'text-red-800');
                    memoryFirst.classList.add('text-zinc-100');
                    button.classList.add('text-zinc-100');
                    memoryFirst = null;
                    memoryLock = false;
                }, 650);
            }
            set('memoryResult', `Moves: ${memoryMoves} - Pairs: ${memoryMatched} / ${pairCount}`);
        });
        startMemoryGame(true);
    }
}
