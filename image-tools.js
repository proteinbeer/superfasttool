function initImageTools() {
    setupImagePreview('pngToJpgInput', 'pngToJpgPreview');
    setupImagePreview('jpgToPngInput', 'jpgToPngPreview');
    setupImagePreview('imageResizerInput', 'imageResizerPreview');
    setupImagePreview('imageCompressorInput', 'imageCompressorPreview');
    setupImagePreview('webpConverterInput', 'webpConverterPreview');
    setupImagePreview('webpToPngInput', 'webpToPngPreview');
    setupQualitySlider('compressQuality', 'compressQualityValue');
    setupImageCropper();
    setupRotateFlipTool();
    setupFilterPreview();
    setupImageToBase64();
    setupBase64ToImage();
    setupImageMetadataViewer();
    setupImageColorPicker();

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

    document.getElementById('downloadCroppedImage').addEventListener('click', async () => {
        const file = getSelectedFile('imageCropperInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const selection = getCropSelection();
        if (!selection) return;
        const x = clampNumber(selection.x, 0, image.naturalWidth - 1, 0);
        const y = clampNumber(selection.y, 0, image.naturalHeight - 1, 0);
        const width = clampNumber(selection.width, 1, image.naturalWidth - x, image.naturalWidth - x);
        const height = clampNumber(selection.height, 1, image.naturalHeight - y, image.naturalHeight - y);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(image, x, y, width, height, 0, 0, width, height);
        downloadCanvas(canvas, buildFileName(file.name, 'cropped', 'png'), 'image/png');
    });

    document.getElementById('downloadRotatedFlippedImage').addEventListener('click', async () => {
        const file = getSelectedFile('imageRotateFlipInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const canvas = transformImageToCanvas(image, getActiveTransformMode());
        downloadCanvas(canvas, buildFileName(file.name, 'transformed', 'png'), 'image/png');
    });

    document.getElementById('downloadFilteredImage').addEventListener('click', async () => {
        const file = getSelectedFile('imageFilterInput');
        if (!file) return;
        const image = await loadImageFromFile(file);
        const canvas = renderFilteredCanvas(image, document.getElementById('imageFilterMode').value);
        downloadCanvas(canvas, buildFileName(file.name, 'filtered', 'jpg'), 'image/jpeg', 0.92);
    });
}

function setupImagePreview(inputId, previewId, onLoad) {
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
            if (onLoad) onLoad(input, preview);
            const card = input.closest('.expandable-card');
            if (card && window.resizeExpandedCardToContent) {
                window.resizeExpandedCardToContent(card);
            }
        };
    });
}

function setupImageCropper() {
    const input = document.getElementById('imageCropperInput');
    const workspace = document.getElementById('imageCropperWorkspace');
    const canvas = document.getElementById('imageCropperCanvas');
    const selection = document.getElementById('cropSelection');
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    let dragState = null;

    if (!selection.dataset.handlesReady) {
        selection.innerHTML = `<span class="crop-move-zone"></span>${handles.map(handle => `<span class="crop-handle" data-handle="${handle}"></span>`).join('')}`;
        selection.dataset.handlesReady = 'true';
    }

    input.addEventListener('change', async () => {
        const file = getSelectedFile('imageCropperInput');
        selection.classList.add('hidden');
        canvas.dataset.crop = '';
        canvas.dataset.cropCanvas = '';
        canvas.dataset.cropReady = '';
        if (!file) {
            workspace.classList.add('hidden');
            return;
        }
        const image = await loadImageFromFile(file);
        drawImageContained(canvas, image);
        canvas.dataset.cropReady = 'true';
        workspace.classList.remove('hidden');
        resizeCardFromElement(input);
    });

    canvas.addEventListener('pointerdown', event => {
        if (canvas.dataset.cropReady !== 'true') return;
        if (canvas.dataset.crop) return;
        const point = getCanvasPoint(canvas, event);
        dragState = { mode: 'new', start: point, initial: null, handle: null };
        updateCropSelection(canvas, selection, point.x, point.y, 1, 1);
        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener('pointermove', event => {
        if (!dragState) return;
        const point = getCanvasPoint(canvas, event);
        updateCropFromDrag(canvas, selection, dragState, point);
    });

    canvas.addEventListener('pointerup', event => {
        if (dragState) canvas.releasePointerCapture(event.pointerId);
        dragState = null;
    });

    selection.addEventListener('pointerdown', event => {
        if (canvas.dataset.cropReady !== 'true') return;
        const handle = event.target.closest('.crop-handle');
        const moveZone = event.target.closest('.crop-move-zone');
        if (!handle && !moveZone) return;
        event.stopPropagation();
        const point = getCanvasPoint(canvas, event);
        dragState = {
            mode: handle ? 'resize' : 'move',
            start: point,
            initial: getCropCanvasSelection(canvas),
            handle: handle ? handle.dataset.handle : null
        };
        selection.setPointerCapture(event.pointerId);
    });

    selection.addEventListener('pointermove', event => {
        if (!dragState) return;
        const point = getCanvasPoint(canvas, event);
        updateCropFromDrag(canvas, selection, dragState, point);
    });

    selection.addEventListener('pointerup', event => {
        if (dragState) selection.releasePointerCapture(event.pointerId);
        dragState = null;
    });
}

function setupRotateFlipTool() {
    const input = document.getElementById('imageRotateFlipInput');
    const workspace = document.getElementById('imageRotateFlipWorkspace');
    const canvas = document.getElementById('imageRotateFlipCanvas');
    const buttons = Array.from(document.querySelectorAll('#imageTransformButtons .transform-btn'));

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            buttons.forEach(item => item.classList.toggle('is-active', item === button));
            await renderRotateFlipPreview();
        });
    });

    input.addEventListener('change', renderRotateFlipPreview);

    async function renderRotateFlipPreview() {
        const file = getSelectedFile('imageRotateFlipInput');
        if (!file) {
            workspace.classList.add('hidden');
            return;
        }
        const image = await loadImageFromFile(file);
        const transformed = transformImageToCanvas(image, getActiveTransformMode());
        drawCanvasContained(canvas, transformed);
        workspace.classList.remove('hidden');
        resizeCardFromElement(input);
    }
}

function setupFilterPreview() {
    const input = document.getElementById('imageFilterInput');
    const workspace = document.getElementById('imageFilterWorkspace');
    const canvas = document.getElementById('imageFilterCanvas');
    const mode = document.getElementById('imageFilterMode');
    const update = async () => {
        const file = getSelectedFile('imageFilterInput');
        if (!file) {
            workspace.classList.add('hidden');
            return;
        }
        const image = await loadImageFromFile(file);
        const filteredCanvas = renderFilteredCanvas(image, mode.value);
        drawCanvasContained(canvas, filteredCanvas);
        workspace.classList.remove('hidden');
        resizeCardFromElement(input);
    };
    mode.addEventListener('change', update);
    input.addEventListener('change', update);
}

function setupImageToBase64() {
    const input = document.getElementById('imageToBase64Input');
    const output = document.getElementById('imageBase64Output');
    input.addEventListener('change', () => {
        const file = getSelectedFile('imageToBase64Input');
        output.value = '';
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            output.value = reader.result;
            resizeCardFromElement(input);
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('downloadImageBase64').addEventListener('click', () => {
        if (!output.value.trim()) return;
        downloadText(output.value.trim(), 'image-base64.txt');
    });
}

function setupBase64ToImage() {
    const input = document.getElementById('base64ImageInput');
    const preview = document.getElementById('base64ImagePreview');
    input.addEventListener('input', () => {
        const value = normalizeBase64Image(input.value);
        if (!value) {
            preview.classList.add('hidden');
            preview.removeAttribute('src');
            return;
        }
        preview.src = value;
        preview.classList.remove('hidden');
        resizeCardFromElement(input);
    });
    document.getElementById('downloadBase64Image').addEventListener('click', () => {
        const value = normalizeBase64Image(input.value);
        if (!value) return;
        const extension = getBase64ImageExtension(value);
        const link = document.createElement('a');
        link.href = value;
        link.download = `base64-image.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
}

function setupImageMetadataViewer() {
    const input = document.getElementById('imageMetadataInput');
    let metadataText = '';

    input.addEventListener('change', async () => {
        const file = getSelectedFile('imageMetadataInput');
        if (!file) {
            metadataText = '';
            return;
        }
        const image = await loadImageFromFile(file);
        const ratio = reduceRatio(image.naturalWidth, image.naturalHeight);
        metadataText = [
            `Name: ${file.name}`,
            `Type: ${file.type || 'Unknown'}`,
            `Size: ${formatBytes(file.size)}`,
            `Dimensions: ${image.naturalWidth} x ${image.naturalHeight}px`,
            `Ratio: ${ratio}`
        ].join('\n');
        resizeCardFromElement(input);
    });

    document.getElementById('downloadImageMetadata').addEventListener('click', () => {
        if (!metadataText) return;
        downloadText(metadataText, 'image-metadata.txt');
    });
}

function setupImageColorPicker() {
    const input = document.getElementById('imageColorPickerInput');
    const workspace = document.getElementById('imageColorWorkspace');
    const canvas = document.getElementById('imageColorCanvas');
    const swatch = document.getElementById('pickedColorSwatch');
    const value = document.getElementById('pickedColorValue');

    input.addEventListener('change', async () => {
        const file = getSelectedFile('imageColorPickerInput');
        canvas.dataset.colorReady = '';
        if (!file) {
            workspace.classList.add('hidden');
            swatch.style.backgroundColor = '#ffffff';
            value.innerText = 'Please add an image';
            return;
        }
        const image = await loadImageFromFile(file);
        drawImageContained(canvas, image);
        canvas.dataset.colorReady = 'true';
        workspace.classList.remove('hidden');
        resizeCardFromElement(input);
    });

    let isPicking = false;
    const pickColor = event => {
        if (canvas.dataset.colorReady !== 'true') return;
        const point = getCanvasPoint(canvas, event);
        const x = Math.floor(point.x);
        const y = Math.floor(point.y);
        const [r, g, b] = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        const hex = rgbToHex(r, g, b);
        swatch.style.backgroundColor = hex;
        value.innerText = `${hex} / rgb(${r}, ${g}, ${b})`;
    };

    canvas.addEventListener('pointerdown', event => {
        if (canvas.dataset.colorReady !== 'true') return;
        isPicking = true;
        canvas.setPointerCapture(event.pointerId);
        pickColor(event);
    });
    canvas.addEventListener('pointermove', event => {
        if (isPicking) pickColor(event);
    });
    canvas.addEventListener('pointerup', event => {
        isPicking = false;
        canvas.releasePointerCapture(event.pointerId);
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

function transformImageToCanvas(image, mode) {
    const rotateSideways = mode === 'rotate90' || mode === 'rotate270';
    const canvas = document.createElement('canvas');
    canvas.width = rotateSideways ? image.naturalHeight : image.naturalWidth;
    canvas.height = rotateSideways ? image.naturalWidth : image.naturalHeight;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (mode === 'rotate90') {
        context.translate(canvas.width, 0);
        context.rotate(Math.PI / 2);
    } else if (mode === 'rotate180') {
        context.translate(canvas.width, canvas.height);
        context.rotate(Math.PI);
    } else if (mode === 'rotate270') {
        context.translate(0, canvas.height);
        context.rotate(-Math.PI / 2);
    } else if (mode === 'flipX') {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
    } else if (mode === 'flipY') {
        context.translate(0, canvas.height);
        context.scale(1, -1);
    }

    context.drawImage(image, 0, 0);
    return canvas;
}

function renderFilteredCanvas(image, filterValue) {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.filter = filterValue;
    context.drawImage(image, 0, 0);
    context.filter = 'none';
    return canvas;
}

function drawImageContained(canvas, image) {
    const content = canvas.closest('.calculator-content');
    const maxWidth = Math.max(280, Math.min(900, content ? content.clientWidth : 700));
    const maxHeight = Math.min(window.innerHeight * 0.42, 360);
    const ratio = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * ratio));
    const height = Math.max(1, Math.round(image.naturalHeight * ratio));
    canvas.width = width;
    canvas.height = height;
    canvas.dataset.scaleX = image.naturalWidth / width;
    canvas.dataset.scaleY = image.naturalHeight / height;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
}

function drawCanvasContained(targetCanvas, sourceCanvas) {
    const content = targetCanvas.closest('.calculator-content');
    const maxWidth = Math.max(280, Math.min(900, content ? content.clientWidth : 700));
    const maxHeight = Math.min(window.innerHeight * 0.42, 360);
    const ratio = Math.min(maxWidth / sourceCanvas.width, maxHeight / sourceCanvas.height);
    const width = Math.max(1, Math.round(sourceCanvas.width * ratio));
    const height = Math.max(1, Math.round(sourceCanvas.height * ratio));
    targetCanvas.width = width;
    targetCanvas.height = height;
    const context = targetCanvas.getContext('2d');
    context.clearRect(0, 0, width, height);
    context.drawImage(sourceCanvas, 0, 0, width, height);
}

function getCanvasPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: Math.min(canvas.width, Math.max(0, (event.clientX - rect.left) * scaleX)),
        y: Math.min(canvas.height, Math.max(0, (event.clientY - rect.top) * scaleY))
    };
}

function updateCropSelection(canvas, selection, x, y, width, height) {
    const box = clampCropBox({ x, y, width, height }, canvas);
    const canvasRect = canvas.getBoundingClientRect();
    const workspaceRect = canvas.closest('.image-workspace').getBoundingClientRect();
    const displayScaleX = canvasRect.width / canvas.width;
    const displayScaleY = canvasRect.height / canvas.height;
    const left = canvasRect.left - workspaceRect.left + box.x * displayScaleX;
    const top = canvasRect.top - workspaceRect.top + box.y * displayScaleY;
    selection.style.left = `${left}px`;
    selection.style.top = `${top}px`;
    selection.style.width = `${Math.max(1, box.width * displayScaleX)}px`;
    selection.style.height = `${Math.max(1, box.height * displayScaleY)}px`;
    selection.classList.remove('hidden');
    canvas.dataset.cropCanvas = JSON.stringify(box);
    canvas.dataset.crop = JSON.stringify({
        x: Math.round(box.x * Number(canvas.dataset.scaleX || 1)),
        y: Math.round(box.y * Number(canvas.dataset.scaleY || 1)),
        width: Math.round(box.width * Number(canvas.dataset.scaleX || 1)),
        height: Math.round(box.height * Number(canvas.dataset.scaleY || 1))
    });
}

function updateCropFromDrag(canvas, selection, dragState, point) {
    const start = dragState.start;
    const initial = dragState.initial;
    if (dragState.mode === 'new') {
        updateCropSelection(canvas, selection, Math.min(start.x, point.x), Math.min(start.y, point.y), Math.abs(point.x - start.x), Math.abs(point.y - start.y));
        return;
    }
    const dx = point.x - start.x;
    const dy = point.y - start.y;
    if (dragState.mode === 'move') {
        updateCropSelection(canvas, selection, initial.x + dx, initial.y + dy, initial.width, initial.height);
        return;
    }

    let x = initial.x;
    let y = initial.y;
    let right = initial.x + initial.width;
    let bottom = initial.y + initial.height;
    if (dragState.handle.includes('w')) x += dx;
    if (dragState.handle.includes('e')) right += dx;
    if (dragState.handle.includes('n')) y += dy;
    if (dragState.handle.includes('s')) bottom += dy;
    updateCropSelection(canvas, selection, Math.min(x, right), Math.min(y, bottom), Math.abs(right - x), Math.abs(bottom - y));
}

function getCropCanvasSelection(canvas) {
    try {
        return JSON.parse(canvas.dataset.cropCanvas || '');
    } catch {
        return { x: 0, y: 0, width: 1, height: 1 };
    }
}

function clampCropBox(box, canvas) {
    const width = Math.max(1, Math.min(box.width, canvas.width));
    const height = Math.max(1, Math.min(box.height, canvas.height));
    const x = Math.min(canvas.width - width, Math.max(0, box.x));
    const y = Math.min(canvas.height - height, Math.max(0, box.y));
    return { x, y, width, height };
}

function getCropSelection() {
    const canvas = document.getElementById('imageCropperCanvas');
    if (!canvas.dataset.crop) return null;
    try {
        const crop = JSON.parse(canvas.dataset.crop);
        if (crop.width < 1 || crop.height < 1) return null;
        return crop;
    } catch {
        return null;
    }
}

function getActiveTransformMode() {
    const activeButton = document.querySelector('#imageTransformButtons .transform-btn.is-active');
    return activeButton ? activeButton.dataset.transformMode : 'default';
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

function downloadText(text, fileName) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

function normalizeBase64Image(value) {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('data:image/')) return trimmed;
    return `data:image/png;base64,${trimmed.replace(/\s/g, '')}`;
}

function getBase64ImageExtension(value) {
    const match = value.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/);
    if (!match) return 'png';
    return match[1].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
}

function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function reduceRatio(width, height) {
    const divisor = greatestCommonDivisor(width, height);
    return `${width / divisor}:${height / divisor}`;
}

function greatestCommonDivisor(a, b) {
    return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function resizeCardFromElement(element) {
    const card = element.closest('.expandable-card');
    if (card && window.resizeExpandedCardToContent) {
        window.resizeExpandedCardToContent(card);
    }
}
