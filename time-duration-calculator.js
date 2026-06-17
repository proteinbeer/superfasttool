function initTimeDurationCalculator() {
    ['startTime', 'endTime'].forEach(id => document.getElementById(id).addEventListener('input', updateTimeDurationResults));
}

function updateTimeDurationResults() {
    const start = parseTimeToMinutes(document.getElementById('startTime').value);
    const end = parseTimeToMinutes(document.getElementById('endTime').value);

    if (start === null || end === null) {
        ['valDuration', 'valDurationDecimal'].forEach(id => document.getElementById(id).innerText = '—');
        return;
    }

    let minutes = end - start;
    if (minutes < 0) minutes += 24 * 60;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    document.getElementById('valDuration').innerText = `${hours}h ${remainingMinutes}m`;
    document.getElementById('valDurationDecimal').innerText = (minutes / 60).toFixed(2);
}

function parseTimeToMinutes(value) {
    if (!value) return null;
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
}
