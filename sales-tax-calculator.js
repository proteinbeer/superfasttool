function initSalesTaxCalculator() {
    ['taxPrice', 'taxRate'].forEach(id => document.getElementById(id).addEventListener('input', updateSalesTaxResults));
}

function updateSalesTaxResults() {
    const price = parseFloat(document.getElementById('taxPrice').value) || 0;
    const rate = parseFloat(document.getElementById('taxRate').value) || 0;

    if (price <= 0) {
        ['valTaxAmount', 'valTaxTotal'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    const tax = price * rate / 100;
    document.getElementById('valTaxAmount').innerText = formatSalesTaxNumber(tax);
    document.getElementById('valTaxTotal').innerText = formatSalesTaxNumber(price + tax);
}

function formatSalesTaxNumber(value) {
    return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}
