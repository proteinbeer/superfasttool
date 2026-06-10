function initProfitLossCalculator() {
    const inputs = ['entryPrice', 'exitPrice', 'tradeQty', 'tradeFees'].map(id => document.getElementById(id));

    inputs.forEach(input => input.addEventListener('input', () => {
        const entryPrice = parseFloat(document.getElementById('entryPrice').value) || 0;
        const exitPrice = parseFloat(document.getElementById('exitPrice').value) || 0;
        const quantity = parseFloat(document.getElementById('tradeQty').value) || 0;
        const fees = parseFloat(document.getElementById('tradeFees').value) || 0;

        const cost = entryPrice * quantity;
        const finalValue = exitPrice * quantity;
        const profitLoss = finalValue - cost - fees;
        const returnRate = cost > 0 ? (profitLoss / cost) * 100 : 0;

        if (cost > 0 || finalValue > 0) {
            const profitLossEl = document.getElementById('valProfitLoss');
            profitLossEl.innerText = formatNumber(profitLoss);
            profitLossEl.classList.toggle('text-emerald-600', profitLoss > 0);
            profitLossEl.classList.toggle('text-red-600', profitLoss < 0);
            profitLossEl.classList.toggle('text-zinc-900', profitLoss === 0);

            document.getElementById('valReturnPct').innerText = `${returnRate.toFixed(2)}%`;
            document.getElementById('valFinalValue').innerText = formatNumber(finalValue);
        } else {
            ['valProfitLoss', 'valReturnPct', 'valFinalValue'].forEach(id => document.getElementById(id).innerText = '—');
            document.getElementById('valProfitLoss').classList.remove('text-emerald-600', 'text-red-600');
            document.getElementById('valProfitLoss').classList.add('text-zinc-900');
        }
    }));
}

function formatNumber(value) {
    return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}
