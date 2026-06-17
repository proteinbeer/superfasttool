function initBmiCalculator() {
    ['bmiHeight', 'bmiWeight'].forEach(id => document.getElementById(id).addEventListener('input', updateBmiResults));
}

function updateBmiResults() {
    const heightCm = parseFloat(document.getElementById('bmiHeight').value) || 0;
    const weightKg = parseFloat(document.getElementById('bmiWeight').value) || 0;

    if (heightCm <= 0 || weightKg <= 0) {
        ['valBmi', 'valBmiCategory'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    document.getElementById('valBmi').innerText = bmi.toFixed(1);
    document.getElementById('valBmiCategory').innerText = getBmiCategory(bmi);
}

function getBmiCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}
