function initGpaCalculator() {
    for (let i = 1; i <= 4; i += 1) {
        document.getElementById(`gpaGrade${i}`).addEventListener('input', updateGpaResults);
        document.getElementById(`gpaCredits${i}`).addEventListener('input', updateGpaResults);
    }
}

function updateGpaResults() {
    let totalPoints = 0;
    let totalCredits = 0;

    for (let i = 1; i <= 4; i += 1) {
        const grade = parseFloat(document.getElementById(`gpaGrade${i}`).value);
        const credits = parseFloat(document.getElementById(`gpaCredits${i}`).value);
        if (!Number.isNaN(grade) && !Number.isNaN(credits) && credits > 0) {
            totalPoints += grade * credits;
            totalCredits += credits;
        }
    }

    if (totalCredits <= 0) {
        ['valGpa', 'valGpaCredits'].forEach(id => document.getElementById(id).innerText = '--');
        return;
    }

    document.getElementById('valGpa').innerText = (totalPoints / totalCredits).toFixed(2);
    document.getElementById('valGpaCredits').innerText = totalCredits.toLocaleString();
}
