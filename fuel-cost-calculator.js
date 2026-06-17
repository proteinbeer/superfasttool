function initFuelCostCalculator() {
    ['fuelDistance', 'fuelEfficiency', 'fuelPrice'].forEach(id => document.getElementById(id).addEventListener('input', updateFuelCostResults));
}

function updateFuelCostResults() {
    const distance = parseFloat(document.getElementById('fuelDistance').value) || 0;
    const efficiency = parseFloat(document.getElementById('fuelEfficiency').value) || 0;
    const price = parseFloat(document.getElementById('fuelPrice').value) || 0;

    if (distance <= 0 || efficiency <= 0) {
        ['valFuelUsed', 'valFuelCost'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    const fuelUsed = distance / efficiency;
    document.getElementById('valFuelUsed').innerText = formatFuelNumber(fuelUsed);
    document.getElementById('valFuelCost').innerText = formatFuelNumber(fuelUsed * price);
}

function formatFuelNumber(value) {
    return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}
