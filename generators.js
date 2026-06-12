function initGenerators() {
    const fantasyFirst = ['Aelar', 'Nyra', 'Thorne', 'Eldrin', 'Kaela', 'Mira', 'Darian', 'Sylas', 'Liora', 'Rowan', 'Seren', 'Vael'];
    const fantasyLast = ['Moonvale', 'Stormroot', 'Ashborne', 'Silverleaf', 'Duskwind', 'Emberfall', 'Dawnwhisper', 'Ironbloom'];
    const fantasyPlacePrefix = ['Elder', 'Moon', 'Storm', 'Amber', 'Raven', 'Silver', 'Thorn', 'Frost', 'Sun', 'Mist'];
    const fantasyPlaceSuffix = ['Hollow', 'Keep', 'Vale', 'Grove', 'Reach', 'Harbor', 'Spire', 'Fen', 'Crossing', 'Sanctum'];
    const sciFiFirst = ['Nova', 'Orion', 'Vex', 'Lyra', 'Zane', 'Astra', 'Kairo', 'Nyx', 'Riven', 'Juno', 'Cade', 'Sera'];
    const sciFiLast = ['Prime', 'Vector', 'Flux', 'Cipher', 'Nexus', 'Pulse', 'Ion', 'Quasar'];
    const sciFiPlacePrefix = ['Kepler', 'Helios', 'Vega', 'Axiom', 'Zenith', 'Eclipse', 'Titan', 'Cygnus', 'Nova', 'Arc'];
    const sciFiPlaceSuffix = ['Station', 'Sector', 'Colony', 'Outpost', 'Array', 'Gate', 'Prime', 'Nebula', 'Dock', 'Relay'];
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
        createName: () => `${pick(fantasyPlacePrefix)}${pick(fantasyPlaceSuffix)}`
    }, generatedLists);

    setupNameGenerator({
        key: 'sciFiPerson',
        countId: 'sciFiPersonCount',
        generateId: 'generateSciFiPersonName',
        downloadId: 'downloadSciFiPersonName',
        outputId: 'valSciFiPersonName',
        fileName: 'sci-fi-person-names.txt',
        createName: () => `${pick(sciFiFirst)}-${pick(sciFiLast)} ${randomInt(10, 99)}`
    }, generatedLists);

    setupNameGenerator({
        key: 'sciFiPlace',
        countId: 'sciFiPlaceCount',
        generateId: 'generateSciFiPlaceName',
        downloadId: 'downloadSciFiPlaceName',
        outputId: 'valSciFiPlaceName',
        fileName: 'sci-fi-place-names.txt',
        createName: () => `${pick(sciFiPlacePrefix)} ${pick(sciFiPlaceSuffix)}-${randomInt(100, 999)}`
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

    document.getElementById('generatePassword').addEventListener('click', () => {
        document.getElementById('valPassword').innerText = createPassword();
    });
    document.getElementById('downloadPassword').addEventListener('click', () => {
        const count = clampCount(document.getElementById('passwordCount').value);
        document.getElementById('passwordCount').value = count;
        downloadTextFile('passwords.txt', Array.from({ length: count }, createPassword).join('\n'));
    });
    document.getElementById('generateRandomNumber').addEventListener('click', () => {
        document.getElementById('valRandomNumber').innerText = createRandomNumber().toLocaleString();
    });
    document.getElementById('downloadRandomNumber').addEventListener('click', () => {
        const count = clampCount(document.getElementById('randomNumberCount').value);
        document.getElementById('randomNumberCount').value = count;
        downloadTextFile('random-numbers.txt', Array.from({ length: count }, () => createRandomNumber()).join('\n'));
    });
    document.getElementById('generateUuid').addEventListener('click', () => {
        document.getElementById('valUuid').innerText = createUuid();
    });
    document.getElementById('downloadUuid').addEventListener('click', () => {
        const count = clampCount(document.getElementById('uuidCount').value);
        document.getElementById('uuidCount').value = count;
        downloadTextFile('uuids.txt', Array.from({ length: count }, createUuid).join('\n'));
    });
    document.getElementById('downloadLoremIpsum').addEventListener('click', () => {
        const length = clampLoremLength(document.getElementById('loremLength').value);
        const count = clampCount(document.getElementById('loremCount').value);
        document.getElementById('loremLength').value = length;
        document.getElementById('loremCount').value = count;
        document.getElementById('loremCountValue').innerText = count;
        downloadTextFile('lorem-ipsum.txt', Array.from({ length: count }, () => createLoremIpsum(length)).join('\n\n'));
    });
}

function setupNameGenerator(config, generatedLists) {
    const countInput = document.getElementById(config.countId);
    const output = document.getElementById(config.outputId);
    setupCountSlider(config.countId);

    document.getElementById(config.generateId).addEventListener('click', () => {
        generatedLists[config.key] = [config.createName()];
        output.innerText = generatedLists[config.key].join('\n');
    });

    document.getElementById(config.downloadId).addEventListener('click', () => {
        const count = clampCount(countInput.value);
        countInput.value = count;
        const downloadNames = Array.from({ length: count }, config.createName);
        downloadTextFile(config.fileName, downloadNames.join('\n'));
    });
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
    const length = Math.min(64, Math.max(6, parseInt(document.getElementById('passwordLength').value, 10) || 25));
    document.getElementById('passwordLength').value = length;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
    return Array.from({ length }, () => chars[randomInt(0, chars.length - 1)]).join('');
}

function createRandomNumber() {
    const min = parseInt(document.getElementById('randomMin').value, 10) || 0;
    const max = parseInt(document.getElementById('randomMax').value, 10) || 0;
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
