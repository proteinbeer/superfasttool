function initTipCalculator() {
    ['billAmount', 'tipRate', 'splitCount'].forEach(id => document.getElementById(id).addEventListener('input', updateTipResults));
}

function updateTipResults() {
    const bill = parseFloat(document.getElementById('billAmount').value) || 0;
    const rate = parseFloat(document.getElementById('tipRate').value) || 0;
    const people = Math.max(1, parseFloat(document.getElementById('splitCount').value) || 1);

    if (bill <= 0) {
        ['valTipAmount', 'valTipTotal', 'valTipEach'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    const tip = bill * rate / 100;
    const total = bill + tip;
    document.getElementById('valTipAmount').innerText = formatTipNumber(tip);
    document.getElementById('valTipTotal').innerText = formatTipNumber(total);
    document.getElementById('valTipEach').innerText = formatTipNumber(total / people);
}

function formatTipNumber(value) {
    return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}
