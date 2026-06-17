function initDateDifferenceCalculator() {
    ['startDate', 'endDate'].forEach(id => document.getElementById(id).addEventListener('input', updateDateDifferenceResults));
}

function updateDateDifferenceResults() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start || !end) {
        ['valDateDays', 'valDateWeeks'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    const startTime = new Date(`${start}T00:00:00`).getTime();
    const endTime = new Date(`${end}T00:00:00`).getTime();
    const days = Math.round((endTime - startTime) / 86400000);

    document.getElementById('valDateDays').innerText = days.toLocaleString();
    document.getElementById('valDateWeeks').innerText = (days / 7).toFixed(2);
}
