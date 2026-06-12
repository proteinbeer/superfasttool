function initImageTools() {
    setupImagePreview('pngToJpgInput', 'pngToJpgPreview');
    setupImagePreview('jpgToPngInput', 'jpgToPngPreview');
    setupImagePreview('imageResizerInput', 'imageResizerPreview');
    setupImagePreview('imageCompressorInput', 'imageCompressorPreview');
    setupImagePreview('webpConverterInput', 'webpConverterPreview');
    setupImagePreview('webpToPngInput', 'webpToPngPreview');
    setupQualitySlider('compressQuality', 'compressQualityValue');

    document.getElementById('downloadPngToJpg').addEventListener('click', async () => {
        const file = getSelectedFile('pngToJpgInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const canvas = drawImageToCanvas(image, image.naturalWidth, image.naturalHeight, '#ffffff');
        downloadCanvas(canvas, 'converted.jpg', 'image/jpeg', 0.92);
    });

    document.getElementById('downloadJpgToPng').addEventListener('click', async () => {
        const file = getSelectedFile('jpgToPngInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const canvas = drawImageToCanvas(image, image.naturalWidth, image.naturalHeight);
        downloadCanvas(canvas, 'converted.png', 'image/png');
    });

    document.getElementById('downloadResizedImage').addEventListener('click', async () => {
        const file = getSelectedFile('imageResizerInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const width = clampNumber(document.getElementById('resizeWidth').value, 1, 5000, 800);
        document.getElementById('resizeWidth').value = width;
        const height = Math.max(1, Math.round(width * (image.naturalHeight / image.naturalWidth)));
        const canvas = drawImageToCanvas(image, width, height, '#ffffff');
        downloadCanvas(canvas, buildFileName(file.name, 'resized', 'jpg'), 'image/jpeg', 0.92);
    });

    document.getElementById('downloadCompressedImage').addEventListener('click', async () => {
        const file = getSelectedFile('imageCompressorInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const quality = clampNumber(document.getElementById('compressQuality').value, 10, 100, 80) / 100;
        const canvas = drawImageToCanvas(image, image.naturalWidth, image.naturalHeight, '#ffffff');
        downloadCanvas(canvas, buildFileName(file.name, 'compressed', 'jpg'), 'image/jpeg', quality);
    });

    document.getElementById('downloadWebpImage').addEventListener('click', async () => {
        const file = getSelectedFile('webpConverterInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const canvas = drawImageToCanvas(image, image.naturalWidth, image.naturalHeight);
        downloadCanvas(canvas, buildFileName(file.name, 'converted', 'webp'), 'image/webp', 0.9);
    });

    document.getElementById('downloadWebpToPng').addEventListener('click', async () => {
        const file = getSelectedFile('webpToPngInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const canvas = drawImageToCanvas(image, image.naturalWidth, image.naturalHeight);
        downloadCanvas(canvas, buildFileName(file.name, 'converted', 'png'), 'image/png');
    });
}

function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    input.addEventListener('change', () => {
        const file = getSelectedFile(inputId);
        if (!file) {
            preview.classList.add('hidden');
            preview.removeAttribute('src');
            return;
        }
        preview.src = URL.createObjectURL(file);
        preview.classList.remove('hidden');
        preview.onload = () => {
            URL.revokeObjectURL(preview.src);
            const card = input.closest('.expandable-card');
            if (card && window.resizeExpandedCardToContent) {
                window.resizeExpandedCardToContent(card);
            }
        };
    });
}

function setupQualitySlider(inputId, valueId) {
    const input = document.getElementById(inputId);
    const value = document.getElementById(valueId);
    const update = () => {
        value.innerText = `${clampNumber(input.value, 10, 100, 80)}%`;
    };
    update();
    input.addEventListener('input', update);
}

function getSelectedFile(inputId) {
    return document.getElementById(inputId).files[0] || null;
}

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = URL.createObjectURL(file);
    });
}

function drawImageToCanvas(image, width, height, backgroundColor) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (backgroundColor) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, 0, 0, width, height);
    return canvas;
}

function downloadCanvas(canvas, fileName, mimeType, quality) {
    canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }, mimeType, quality);
}

function buildFileName(originalName, suffix, extension) {
    const baseName = originalName.replace(/\.[^.]+$/, '') || 'image';
    return `${baseName}-${suffix}.${extension}`;
}

function clampNumber(value, min, max, fallback) {
    return Math.min(max, Math.max(min, parseInt(value, 10) || fallback));
}
