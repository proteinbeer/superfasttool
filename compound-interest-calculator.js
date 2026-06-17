function initCompoundInterestCalculator() {
    const inputs = ['principalAmount', 'monthlyContribution', 'annualReturn', 'investmentYears'].map(id => document.getElementById(id));

    inputs.forEach(input => input.addEventListener('input', updateCompoundInterestResults));
}

function updateCompoundInterestResults() {
    const principal = parseFloat(document.getElementById('principalAmount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const annualReturn = parseFloat(document.getElementById('annualReturn').value) || 0;
    const years = parseFloat(document.getElementById('investmentYears').value) || 0;
    const months = Math.max(0, Math.round(years * 12));
    const monthlyRate = annualReturn / 100 / 12;

    let futureValue = principal;
    for (let month = 0; month < months; month++) {
        futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
    }

    const totalContributed = principal + monthlyContribution * months;
    const interestEarned = futureValue - totalContributed;

    if (principal > 0 || monthlyContribution > 0) {
        document.getElementById('valFutureValue').innerText = formatCompoundNumber(futureValue);
        document.getElementById('valTotalContributed').innerText = formatCompoundNumber(totalContributed);
        document.getElementById('valInterestEarned').innerText = formatCompoundNumber(interestEarned);
    } else {
        ['valFutureValue', 'valTotalContributed', 'valInterestEarned'].forEach(id => document.getElementById(id).innerText = '—');
    }
}

function formatCompoundNumber(value) {
    return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}
