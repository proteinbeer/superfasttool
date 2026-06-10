function initAverageCostCalculator() {
    const inputs = ['curPrice', 'curShares', 'buyPrice', 'buyShares'].map(id => document.getElementById(id));

    inputs.forEach(input => input.addEventListener('input', () => {
        const cp = parseFloat(document.getElementById('curPrice').value) || 0;
        const cs = parseFloat(document.getElementById('curShares').value) || 0;
        const bp = parseFloat(document.getElementById('buyPrice').value) || 0;
        const bs = parseFloat(document.getElementById('buyShares').value) || 0;

        const currentTotal = cp * cs;
        const buyTotal = bp * bs;
        const totalShares = cs + bs;
        const totalAmount = currentTotal + buyTotal;

        if (totalShares > 0) {
            const finalAvg = totalAmount / totalShares;
            document.getElementById('valAvgPrice').innerText = finalAvg % 1 === 0 ? finalAvg.toLocaleString() : finalAvg.toFixed(2);
            document.getElementById('valTotalShares').innerText = totalShares.toLocaleString();
            document.getElementById('valTotalAmount').innerText = totalAmount.toLocaleString();
        } else {
            ['valAvgPrice', 'valTotalShares', 'valTotalAmount'].forEach(id => document.getElementById(id).innerText = '—');
        }
    }));
}
