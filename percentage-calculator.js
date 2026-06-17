function initPercentageCalculator() {
    const inputs = ['percentValue', 'percentTotal', 'percentFrom', 'percentTo'].map(id => document.getElementById(id));

    inputs.forEach(input => input.addEventListener('input', updatePercentageResults));
}

function updatePercentageResults() {
    const value = parseFloat(document.getElementById('percentValue').value) || 0;
    const total = parseFloat(document.getElementById('percentTotal').value) || 0;
    const from = parseFloat(document.getElementById('percentFrom').value) || 0;
    const to = parseFloat(document.getElementById('percentTo').value) || 0;

    document.getElementById('valPercentOfTotal').innerText = total !== 0 ? `${((value / total) * 100).toFixed(2)}%` : '—';
    document.getElementById('valPercentChange').innerText = from !== 0 ? `${(((to - from) / from) * 100).toFixed(2)}%` : '—';
}
