function initExtraConverters() {
    bindConverter(['currencyAmount', 'exchangeRate'], updateCurrencyConverter);
    bindConverter(['dataValue', 'dataFrom', 'dataTo'], updateDataStorageConverter);
    bindConverter(['speedValue', 'speedFrom', 'speedTo'], updateSpeedConverter);
    bindConverter(['areaValue', 'areaFrom', 'areaTo'], updateAreaConverter);
    bindConverter(['volumeValue', 'volumeFrom', 'volumeTo'], updateVolumeConverter);
    bindConverter(['timeZoneValue', 'timeZoneFrom', 'timeZoneTo'], updateTimeZoneConverter);
    bindConverter(['baseValue', 'baseFrom', 'baseTo'], updateNumberBaseConverter);
    bindConverter(['angleValue', 'angleFrom', 'angleTo'], updateAngleConverter);
    bindConverter(['powerValue', 'powerFrom', 'powerTo'], updatePowerConverter);
    bindConverter(['pressureValue', 'pressureFrom', 'pressureTo'], updatePressureConverter);
    bindConverter(['energyValue', 'energyFrom', 'energyTo'], updateEnergyConverter);
    bindConverter(['frequencyValue', 'frequencyFrom', 'frequencyTo'], updateFrequencyConverter);
    bindConverter(['paceValue', 'paceFrom', 'paceTo'], updatePaceConverter);
}

function bindConverter(ids, update) {
    ids.forEach(id => {
        const element = document.getElementById(id);
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
