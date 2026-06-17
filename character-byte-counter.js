function initCharacterByteCounter() {
    const input = document.getElementById('characterByteInput');
    if (!input) return;

    input.addEventListener('input', updateCharacterByteCounts);
    updateCharacterByteCounts();
}

function getGraphemeCount(text) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)).length;
    }
    return Array.from(text).length;
}

function getUtf8ByteCount(text) {
    return new TextEncoder().encode(text).length;
}

function updateCharacterByteCounts() {
    const text = document.getElementById('characterByteInput').value;
    const withoutSpaces = text.replace(/\s/g, '');
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

    document.getElementById('valCharCount').innerText = getGraphemeCount(text).toLocaleString();
    document.getElementById('valCharNoSpace').innerText = getGraphemeCount(withoutSpaces).toLocaleString();
    document.getElementById('valByteCount').innerText = getUtf8ByteCount(text).toLocaleString();
    document.getElementById('valWordCount').innerText = words.toLocaleString();
    document.getElementById('valLineCount').innerText = lines.toLocaleString();
}
