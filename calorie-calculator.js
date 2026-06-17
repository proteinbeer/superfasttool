function initCalorieCalculator() {
    ['calorieAge', 'calorieSex', 'calorieHeight', 'calorieWeight', 'activityLevel'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateCalorieResults);
        document.getElementById(id).addEventListener('change', updateCalorieResults);
    });
}

function updateCalorieResults() {
    const age = parseFloat(document.getElementById('calorieAge').value) || 0;
    const height = parseFloat(document.getElementById('calorieHeight').value) || 0;
    const weight = parseFloat(document.getElementById('calorieWeight').value) || 0;
    const sex = document.getElementById('calorieSex').value;
    const activity = parseFloat(document.getElementById('activityLevel').value) || 1.2;

    if (age <= 0 || height <= 0 || weight <= 0) {
        ['valMaintenanceCalories', 'valWeightLossCalories'].forEach(id => document.getElementById(id).innerText = '--');
        return;
    }

    const base = 10 * weight + 6.25 * height - 5 * age;
    const bmr = sex === 'male' ? base + 5 : base - 161;
    const maintenance = bmr * activity;

    document.getElementById('valMaintenanceCalories').innerText = `${Math.round(maintenance).toLocaleString()} kcal`;
    document.getElementById('valWeightLossCalories').innerText = `${Math.max(0, Math.round(maintenance - 500)).toLocaleString()} kcal`;
}
