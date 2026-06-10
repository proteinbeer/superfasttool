const unitGroups = {
    length: {
        units: [
            { label: 'Meters', value: 'm', factor: 1 },
            { label: 'Kilometers', value: 'km', factor: 1000 },
            { label: 'Centimeters', value: 'cm', factor: 0.01 },
            { label: 'Feet', value: 'ft', factor: 0.3048 },
            { label: 'Miles', value: 'mi', factor: 1609.344 }
        ]
    },
    weight: {
        units: [
            { label: 'Kilograms', value: 'kg', factor: 1 },
            { label: 'Grams', value: 'g', factor: 0.001 },
            { label: 'Pounds', value: 'lb', factor: 0.45359237 },
            { label: 'Ounces', value: 'oz', factor: 0.028349523125 }
        ]
    },
    temperature: {
        units: [
            { label: 'Celsius', value: 'c' },
            { label: 'Fahrenheit', value: 'f' },
            { label: 'Kelvin', value: 'k' }
        ]
    }
};

function initUnitConverter() {
    const unitType = document.getElementById('unitType');
    const unitValue = document.getElementById('unitValue');
    const unitFrom = document.getElementById('unitFrom');
    const unitTo = document.getElementById('unitTo');

    unitType.addEventListener('change', () => {
        populateUnitOptions();
        updateUnitConversion();
    });
    [unitValue, unitFrom, unitTo].forEach(input => input.addEventListener('input', updateUnitConversion));

    populateUnitOptions();
}

function populateUnitOptions() {
    const unitType = document.getElementById('unitType').value;
    const unitFrom = document.getElementById('unitFrom');
    const unitTo = document.getElementById('unitTo');
    const units = unitGroups[unitType].units;

    unitFrom.innerHTML = units.map(unit => `<option value="${unit.value}">${unit.label}</option>`).join('');
    unitTo.innerHTML = units.map(unit => `<option value="${unit.value}">${unit.label}</option>`).join('');
    if (units[1]) unitTo.value = units[1].value;
}

function updateUnitConversion() {
    const unitType = document.getElementById('unitType').value;
    const value = parseFloat(document.getElementById('unitValue').value);
    const from = document.getElementById('unitFrom').value;
    const to = document.getElementById('unitTo').value;

    if (Number.isNaN(value)) {
        document.getElementById('valConvertedValue').innerText = '—';
        return;
    }

    const result = unitType === 'temperature'
        ? convertTemperature(value, from, to)
        : convertByFactor(value, unitType, from, to);

    document.getElementById('valConvertedValue').innerText = formatUnitNumber(result);
}

function convertByFactor(value, unitType, from, to) {
    const units = unitGroups[unitType].units;
    const fromUnit = units.find(unit => unit.value === from);
    const toUnit = units.find(unit => unit.value === to);
    return value * fromUnit.factor / toUnit.factor;
}

function convertTemperature(value, from, to) {
    let celsius = value;
    if (from === 'f') celsius = (value - 32) * 5 / 9;
    if (from === 'k') celsius = value - 273.15;
    if (to === 'f') return celsius * 9 / 5 + 32;
    if (to === 'k') return celsius + 273.15;
    return celsius;
}

function formatUnitNumber(value) {
    return Math.abs(value) >= 1000 || Number.isInteger(value) ? value.toLocaleString() : value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}
