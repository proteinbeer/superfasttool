function initMortgageCalculator() {
    ['homePrice', 'downPayment', 'mortgageRate', 'mortgageYears'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateMortgageResults);
    });
}

function updateMortgageResults() {
    const homePrice = parseFloat(document.getElementById('homePrice').value) || 0;
    const downPayment = parseFloat(document.getElementById('downPayment').value) || 0;
    const annualRate = parseFloat(document.getElementById('mortgageRate').value) || 0;
    const years = parseFloat(document.getElementById('mortgageYears').value) || 0;
    const loanAmount = Math.max(0, homePrice - downPayment);
    const months = Math.max(0, Math.round(years * 12));
    const monthlyRate = annualRate / 100 / 12;

    if (loanAmount <= 0 || months <= 0) {
        ['valMortgageMonthly', 'valMortgageLoan', 'valMortgageInterest'].forEach(id => document.getElementById(id).innerText = '--');
        return;
    }

    const monthlyPayment = monthlyRate === 0
        ? loanAmount / months
        : loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalInterest = monthlyPayment * months - loanAmount;

    document.getElementById('valMortgageMonthly').innerText = formatMortgageNumber(monthlyPayment);
    document.getElementById('valMortgageLoan').innerText = formatMortgageNumber(loanAmount);
    document.getElementById('valMortgageInterest').innerText = formatMortgageNumber(totalInterest);
}

function formatMortgageNumber(value) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
