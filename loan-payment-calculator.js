function initLoanPaymentCalculator() {
    const inputs = ['loanAmount', 'loanRate', 'loanYears'].map(id => document.getElementById(id));

    inputs.forEach(input => input.addEventListener('input', updateLoanPaymentResults));
}

function updateLoanPaymentResults() {
    const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const annualRate = parseFloat(document.getElementById('loanRate').value) || 0;
    const years = parseFloat(document.getElementById('loanYears').value) || 0;
    const months = Math.max(0, Math.round(years * 12));
    const monthlyRate = annualRate / 100 / 12;

    if (amount <= 0 || months <= 0) {
        ['valMonthlyPayment', 'valTotalRepayment', 'valLoanInterest'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    const monthlyPayment = monthlyRate === 0
        ? amount / months
        : amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalRepayment = monthlyPayment * months;
    const totalInterest = totalRepayment - amount;

    document.getElementById('valMonthlyPayment').innerText = formatLoanNumber(monthlyPayment);
    document.getElementById('valTotalRepayment').innerText = formatLoanNumber(totalRepayment);
    document.getElementById('valLoanInterest').innerText = formatLoanNumber(totalInterest);
}

function formatLoanNumber(value) {
    return value % 1 === 0 ? value.toLocaleString() : value.toFixed(2);
}
