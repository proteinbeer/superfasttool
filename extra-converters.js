function initExtraConverters() {
    bindConverter(['currencyAmount', 'exchangeRate'], updateCurrencyConverter);
    bindConverter(['dataValue', 'dataFrom', 'dataTo'], updateDataStorageConverter);
    bindConverter(['speedValue', 'speedFrom', 'speedTo'], updateSpeedConverter);
    bindConverter(['areaValue', 'areaFrom', 'areaTo'], updateAreaConverter);
    bindConverter(['volumeValue', 'volumeFrom', 'volumeTo'], updateVolumeConverter);
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

function convertByFactor(valueId, fromId, toId, outputId, factors) {
    const value = parseFloat(document.getElementById(valueId).value) || 0;
    const from = document.getElementById(fromId).value;
    const to = document.getElementById(toId).value;
    document.getElementById(outputId).innerText = value > 0 ? formatConverterNumber(value * factors[from] / factors[to]) : '--';
}

function formatConverterNumber(value) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
}
