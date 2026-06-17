function initDiscountCalculator() {
    ['discountPrice', 'discountRate'].forEach(id => document.getElementById(id).addEventListener('input', updateDiscountResults));
}

function updateDiscountResults() {
    const price = parseFloat(document.getElementById('discountPrice').value) || 0;
    const rate = parseFloat(document.getElementById('discountRate').value) || 0;

    if (price <= 0) {
        ['valDiscountFinal', 'valDiscountSaved'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    const saved = price * rate / 100;
    document.getElementById('valDiscountFinal').innerText = formatDiscountNumber(price - saved);
    document.getElementById('valDiscountSaved').innerText = formatDiscountNumber(saved);
}

function formatDiscountNumber(value) {
    return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}
