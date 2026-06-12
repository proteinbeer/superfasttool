function initAgeCalculator() {
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('ageAsOfDate').value = today;
    ['birthDate', 'ageAsOfDate'].forEach(id => document.getElementById(id).addEventListener('input', updateAgeResults));
}

function updateAgeResults() {
    const birthValue = document.getElementById('birthDate').value;
    const asOfValue = document.getElementById('ageAsOfDate').value;

    if (!birthValue || !asOfValue) {
        ['valAgeYears', 'valAgeDays'].forEach(id => document.getElementById(id).innerText = '--');
        return;
    }

    const birth = new Date(`${birthValue}T00:00:00`);
    const asOf = new Date(`${asOfValue}T00:00:00`);
    if (birth > asOf) {
        ['valAgeYears', 'valAgeDays'].forEach(id => document.getElementById(id).innerText = '--');
        return;
    }

    let years = asOf.getFullYear() - birth.getFullYear();
    let months = asOf.getMonth() - birth.getMonth();
    let days = asOf.getDate() - birth.getDate();

    if (days < 0) {
        months -= 1;
        days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    const totalDays = Math.floor((asOf - birth) / 86400000);
    document.getElementById('valAgeYears').innerText = `${years}y ${months}m ${days}d`;
    document.getElementById('valAgeDays').innerText = totalDays.toLocaleString();
}
