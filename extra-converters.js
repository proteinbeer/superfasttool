function initExtraConverters() {
    bindConverter(['currencyAmount', 'exchangeRate'], updateCurrencyConverter);
    bindConverter(['dataValue', 'dataFrom', 'dataTo'], updateDataStorageConverter);
    bindConverter(['speedValue', 'speedFrom', 'speedTo'], updateSpeedConverter);
    bindConverter(['areaValue', 'areaFrom', 'areaTo'], updateAreaConverter);
    bindConverter(['volumeValue', 'volumeFrom', 'volumeTo'], updateVolumeConverter);
    bindConverter(['timeZoneValue', 'timeZoneFrom', 'timeZoneTo'], updateTimeZoneConverter);
    initTimestampConverter();
    initColorConverter();
    bindConverter(['baseValue', 'baseFrom', 'baseTo'], updateNumberBaseConverter);
    bindConverter(['angleValue', 'angleFrom', 'angleTo'], updateAngleConverter);
    bindConverter(['powerValue', 'powerFrom', 'powerTo'], updatePowerConverter);
    bindConverter(['pressureValue', 'pressureFrom', 'pressureTo'], updatePressureConverter);
    bindConverter(['energyValue', 'energyFrom', 'energyTo'], updateEnergyConverter);
    bindConverter(['frequencyValue', 'frequencyFrom', 'frequencyTo'], updateFrequencyConverter);
    bindConverter(['paceValue', 'paceFrom', 'paceTo'], updatePaceConverter);
}

function bindConverter(ids, update) {
    const elements = ids.map(id => document.getElementById(id));
    if (elements.some(element => !element)) return;
    elements.forEach(element => {
        element.addEventListener('input', update);
        element.addEventListener('change', update);
    });
}

function updateCurrencyConverter() {
    const amount = parseFloat(document.getElementById('currencyAmount').value) || 0;
    const rate = parseFloat(document.getElementById('exchangeRate').value) || 0;
    document.getElementById('valCurrencyConverted').innerText = rate > 0 ? formatConverterNumber(amount * rate) : '--';
}

function updateDataStorageConverter() {
    const factors = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 };
    convertByFactor('dataValue', 'dataFrom', 'dataTo', 'valDataConverted', factors);
}

function updateSpeedConverter() {
    const factors = { mph: 0.44704, kmh: 0.2777777778, ms: 1, kn: 0.5144444444 };
    convertByFactor('speedValue', 'speedFrom', 'speedTo', 'valSpeedConverted', factors);
}

function updateAreaConverter() {
    const factors = { sqm: 1, sqft: 0.09290304, acre: 4046.8564224, hectare: 10000 };
    convertByFactor('areaValue', 'areaFrom', 'areaTo', 'valAreaConverted', factors);
}

function updateVolumeConverter() {
    const factors = { l: 1, ml: 0.001, gal: 3.785411784, cup: 0.2365882365, floz: 0.0295735296 };
    convertByFactor('volumeValue', 'volumeFrom', 'volumeTo', 'valVolumeConverted', factors);
}

function updateTimeZoneConverter() {
    const time = document.getElementById('timeZoneValue').value || '00:00';
    const [hours, minutes] = time.split(':').map(Number);
    const from = parseFloat(document.getElementById('timeZoneFrom').value) || 0;
    const to = parseFloat(document.getElementById('timeZoneTo').value) || 0;
    const total = (hours * 60 + minutes + Math.round((to - from) * 60) + 1440) % 1440;
    document.getElementById('valTimeZoneConverted').innerText = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function initTimestampConverter() {
    const dateInput = document.getElementById('timestampDateInput');
    const timestampInput = document.getElementById('timestampNumberInput');
    if (!dateInput || !timestampInput) return;

    dateInput.addEventListener('input', () => updateTimestampFromDate());
    timestampInput.addEventListener('input', () => updateTimestampFromNumber());

    const now = new Date();
    dateInput.value = formatTimestampDateTime(now);
    timestampInput.value = String(now.getTime());
    renderTimestampResults(now);
}

function updateTimestampFromDate() {
    const parsed = parseTimestampDate(document.getElementById('timestampDateInput').value);
    if (!parsed) {
        clearTimestampResults();
        return;
    }
    document.getElementById('timestampNumberInput').value = String(parsed.getTime());
    renderTimestampResults(parsed);
}

function updateTimestampFromNumber() {
    const raw = document.getElementById('timestampNumberInput').value.trim();
    const value = Number(raw);
    if (!Number.isFinite(value)) {
        clearTimestampResults();
        return;
    }
    const milliseconds = Math.abs(value) < 100000000000 ? value * 1000 : value;
    const parsed = new Date(milliseconds);
    if (Number.isNaN(parsed.getTime())) {
        clearTimestampResults();
        return;
    }
    document.getElementById('timestampDateInput').value = formatTimestampDateTime(parsed);
    renderTimestampResults(parsed);
}

function parseTimestampDate(value) {
    const cleaned = value.trim();
    if (!cleaned) return null;
    const normalized = cleaned.includes('T') ? cleaned : cleaned.replace(' ', 'T');
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function renderTimestampResults(date) {
    const milliseconds = date.getTime();
    document.getElementById('valUnixSeconds').innerText = Math.floor(milliseconds / 1000).toLocaleString('en-US', { useGrouping: false });
    document.getElementById('valUnixMilliseconds').innerText = milliseconds.toLocaleString('en-US', { useGrouping: false });
    document.getElementById('valIsoUtc').innerText = date.toISOString();
    document.getElementById('valLocalDateTime').innerText = formatTimestampDateTime(date);
}

function clearTimestampResults() {
    ['valUnixSeconds', 'valUnixMilliseconds', 'valIsoUtc', 'valLocalDateTime'].forEach(id => {
        document.getElementById(id).innerText = '--';
    });
}

function formatTimestampDateTime(date) {
    const pad = value => String(value).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${ms}`;
}

function initColorConverter() {
    const colorPicker = document.getElementById('colorConverterPicker');
    const hexInput = document.getElementById('colorHexInput');
    const rgbaInput = document.getElementById('colorRgbaInput');
    const alphaInput = document.getElementById('colorAlphaInput');
    if (!colorPicker || !hexInput || !rgbaInput || !alphaInput) return;

    colorPicker.addEventListener('input', () => {
        const rgb = parseHexColor(colorPicker.value);
        renderColorConverter({ ...rgb, a: Number(alphaInput.value) / 100 });
    });
    hexInput.addEventListener('input', () => {
        const rgb = parseHexColor(hexInput.value);
        if (rgb) renderColorConverter({ ...rgb, a: Number(alphaInput.value) / 100 });
    });
    rgbaInput.addEventListener('input', () => {
        const rgba = parseRgbaColor(rgbaInput.value);
        if (rgba) renderColorConverter(rgba);
    });
    alphaInput.addEventListener('input', () => {
        const rgb = parseHexColor(hexInput.value) || { r: 63, g: 63, b: 70 };
        renderColorConverter({ ...rgb, a: Number(alphaInput.value) / 100 });
    });

    renderColorConverter({ r: 63, g: 63, b: 70, a: 1 });
}

function parseHexColor(value) {
    const raw = value.trim().replace(/^#/, '');
    const expanded = raw.length === 3 ? raw.split('').map(char => char + char).join('') : raw;
    if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
    return {
        r: parseInt(expanded.slice(0, 2), 16),
        g: parseInt(expanded.slice(2, 4), 16),
        b: parseInt(expanded.slice(4, 6), 16)
    };
}

function parseRgbaColor(value) {
    const match = value.trim().match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/i);
    if (!match) return null;
    const rgba = {
        r: clampColorChannel(Number(match[1])),
        g: clampColorChannel(Number(match[2])),
        b: clampColorChannel(Number(match[3])),
        a: match[4] === undefined ? 1 : Math.max(0, Math.min(1, Number(match[4])))
    };
    return rgba;
}

function renderColorConverter(color) {
    const hex = rgbToHex(color.r, color.g, color.b);
    const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${trimColorNumber(color.a)})`;
    const hsl = rgbToHsl(color.r, color.g, color.b);
    const preview = document.getElementById('colorConverterPreview');
    const alphaInput = document.getElementById('colorAlphaInput');

    document.getElementById('colorConverterPicker').value = hex;
    document.getElementById('colorHexInput').value = hex;
    document.getElementById('colorRgbaInput').value = rgba;
    alphaInput.value = Math.round(color.a * 100);
    document.getElementById('colorAlphaValue').innerText = `${Math.round(color.a * 100)}%`;
    document.getElementById('valColorHex').innerText = hex;
    document.getElementById('valColorRgb').innerText = `rgb(${color.r}, ${color.g}, ${color.b})`;
    document.getElementById('valColorRgba').innerText = rgba;
    document.getElementById('valColorHsl').innerText = hsl;
    document.getElementById('valColorTailwind').innerText = `bg-[${hex}] text-[${hex}]`;
    preview.style.backgroundColor = rgba;
}

function clampColorChannel(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(value => clampColorChannel(value).toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl(r, g, b) {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const delta = max - min;
        s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        if (max === red) h = (green - blue) / delta + (green < blue ? 6 : 0);
        if (max === green) h = (blue - red) / delta + 2;
        if (max === blue) h = (red - green) / delta + 4;
        h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function trimColorNumber(value) {
    return Number(value.toFixed(2)).toString();
}

function updateNumberBaseConverter() {
    const value = document.getElementById('baseValue').value.trim();
    const from = parseInt(document.getElementById('baseFrom').value, 10);
    const to = parseInt(document.getElementById('baseTo').value, 10);
    const parsed = parseInt(value, from);
    document.getElementById('valBaseConverted').innerText = Number.isFinite(parsed) ? parsed.toString(to).toUpperCase() : '--';
}

function updateAngleConverter() {
    const factors = { deg: Math.PI / 180, rad: 1, grad: Math.PI / 200 };
    convertByFactor('angleValue', 'angleFrom', 'angleTo', 'valAngleConverted', factors);
}

function updatePowerConverter() {
    const factors = { w: 1, kw: 1000, hp: 745.699872 };
    convertByFactor('powerValue', 'powerFrom', 'powerTo', 'valPowerConverted', factors);
}

function updatePressureConverter() {
    const factors = { pa: 1, bar: 100000, psi: 6894.757293, atm: 101325 };
    convertByFactor('pressureValue', 'pressureFrom', 'pressureTo', 'valPressureConverted', factors);
}

function updateEnergyConverter() {
    const factors = { j: 1, cal: 4.184, kwh: 3600000, btu: 1055.05585262 };
    convertByFactor('energyValue', 'energyFrom', 'energyTo', 'valEnergyConverted', factors);
}

function updateFrequencyConverter() {
    const factors = { hz: 1, khz: 1000, mhz: 1000000, ghz: 1000000000 };
    convertByFactor('frequencyValue', 'frequencyFrom', 'frequencyTo', 'valFrequencyConverted', factors);
}

function updatePaceConverter() {
    const value = parseFloat(document.getElementById('paceValue').value) || 0;
    const from = document.getElementById('paceFrom').value;
    const to = document.getElementById('paceTo').value;
    if (value <= 0) {
        document.getElementById('valPaceConverted').innerText = '--';
        return;
    }
    const kmh = paceToKmh(value, from);
    document.getElementById('valPaceConverted').innerText = formatPaceFromKmh(kmh, to);
}

function convertByFactor(valueId, fromId, toId, outputId, factors) {
    const value = parseFloat(document.getElementById(valueId).value) || 0;
    const from = document.getElementById(fromId).value;
    const to = document.getElementById(toId).value;
    document.getElementById(outputId).innerText = value > 0 ? formatConverterNumber(value * factors[from] / factors[to]) : '--';
}

function formatConverterNumber(value) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function paceToKmh(value, unit) {
    if (unit === 'kmh') return value;
    if (unit === 'mph') return value * 1.609344;
    if (unit === 'minkm') return 60 / value;
    if (unit === 'minmi') return 96.56064 / value;
    return value;
}

function formatPaceFromKmh(kmh, unit) {
    if (unit === 'kmh') return `${formatConverterNumber(kmh)} km/h`;
    if (unit === 'mph') return `${formatConverterNumber(kmh / 1.609344)} mph`;
    if (unit === 'minkm') return `${formatConverterNumber(60 / kmh)} min/km`;
    if (unit === 'minmi') return `${formatConverterNumber(96.56064 / kmh)} min/mile`;
    return formatConverterNumber(kmh);
}
