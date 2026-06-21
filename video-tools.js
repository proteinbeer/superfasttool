let videoFfmpeg = null;
let videoFfmpegLoading = null;
let videoTaskRunning = false;
let videoLastLog = '';
const videoTrimState = {
    duration: 0,
    start: 0,
    end: 0,
    samples: null,
    dragging: false,
    dragMode: '',
    dragOffset: 0
};
const videoGifState = {
    duration: 0,
    start: 0,
    end: 0,
    samples: null,
    dragging: false,
    dragMode: '',
    dragOffset: 0
};

function initVideoTools() {
    setupVideoPreview('videoCompressorInput', 'videoCompressorPreview');
    setupVideoPreview('videoFormatInput', 'videoFormatPreview');
    setupVideoPreview('videoTrimmerInput', 'videoTrimmerPreview', (duration, file) => setupVideoTrimWaveform(file, duration));
    setupVideoPreview('videoGifInput', 'videoGifPreview', (duration, file) => setupVideoGifWaveform(file, duration));
    setupVideoPreview('videoAudioInput', 'videoAudioPreview');

    const compression = document.getElementById('videoCompressionPercent');
    const compressionValue = document.getElementById('videoCompressionPercentValue');
    compression?.addEventListener('input', () => {
        if (compressionValue) compressionValue.textContent = `${compression.value}%`;
    });
    [
        ['videoGifWidth', 'videoGifWidthValue', value => `${value}px`],
        ['videoGifFps', 'videoGifFpsValue', value => `${value} FPS`],
        ['videoGifColors', 'videoGifColorsValue', value => value]
    ].forEach(([inputId, outputId, format]) => {
        const input = document.getElementById(inputId);
        const output = document.getElementById(outputId);
        input?.addEventListener('input', () => {
            if (output) output.textContent = format(input.value);
            updateVideoGifEstimate();
        });
    });

    bindVideoTrimWaveform();
    bindVideoGifWaveform();

    bindVideoAction('compressVideo', compressVideoFile);
    bindVideoAction('convertVideoFormat', convertVideoFormat, () => {
        const file = getVideoFile('videoFormatInput');
        return Boolean(file && (/webm$/i.test(file.name) || file.type === 'video/webm'));
    });
    bindVideoAction('trimVideo', trimVideoFile);
    bindVideoAction('createVideoGif', createGifFromVideo);
    bindVideoAction('extractVideoAudio', extractAudioFromVideo);
    document.getElementById('convertSubtitleFile')?.addEventListener('click', convertSubtitleFile);
}

function setupVideoPreview(inputId, previewId, onMetadata) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (!input || !preview) return;
    input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (!file) {
            preview.classList.add('hidden');
            preview.removeAttribute('src');
            return;
        }
        const url = URL.createObjectURL(file);
        preview.src = url;
        preview.classList.remove('hidden');
        preview.onloadedmetadata = () => {
            if (onMetadata) onMetadata(preview.duration || 0, file);
            if (typeof resizeCardFromElement === 'function') resizeCardFromElement(input);
        };
    });
}

async function setupVideoTrimWaveform(file, duration) {
    const waveform = document.getElementById('videoTrimWaveform');
    const selection = document.getElementById('videoTrimSelection');
    videoTrimState.duration = Math.max(0, duration || 0);
    videoTrimState.start = 0;
    videoTrimState.end = videoTrimState.duration;
    videoTrimState.samples = null;
    if (!file || !waveform || !selection || !videoTrimState.duration) return resetVideoTrimWaveform();

    waveform.classList.remove('hidden');
    selection.classList.remove('hidden');
    requestAnimationFrame(drawVideoTrimWaveform);

    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            const context = new AudioContextClass();
            const buffer = await context.decodeAudioData(await file.arrayBuffer());
            videoTrimState.samples = buffer.getChannelData(0);
            await context.close();
        }
    } catch {
        videoTrimState.samples = null;
    }
    requestAnimationFrame(drawVideoTrimWaveform);
}

function resetVideoTrimWaveform() {
    const waveform = document.getElementById('videoTrimWaveform');
    const selection = document.getElementById('videoTrimSelection');
    waveform?.classList.add('hidden');
    selection?.classList.add('hidden');
    if (selection) {
        selection.style.left = '';
        selection.style.width = '';
    }
    setVideoTrimLabels(0, 0);
}

function drawVideoTrimWaveform() {
    const canvas = document.getElementById('videoTrimCanvas');
    if (!canvas || !videoTrimState.duration || canvas.closest('.hidden')) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, rect.width);
    const height = 150;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = '#f8fafc';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = '#d4d4d8';
    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();
    context.strokeStyle = '#18181b';
    context.lineWidth = 1.5;
    context.beginPath();

    const samples = videoTrimState.samples;
    const step = samples ? Math.max(1, Math.floor(samples.length / width)) : 1;
    for (let x = 0; x < width; x += 1) {
        let min = 1;
        let max = -1;
        if (samples) {
            const start = x * step;
            const end = Math.min(samples.length, start + step);
            for (let index = start; index < end; index += 1) {
                min = Math.min(min, samples[index]);
                max = Math.max(max, samples[index]);
            }
        } else {
            const amplitude = 0.2 + Math.abs(Math.sin(x * 0.13) * Math.cos(x * 0.037)) * 0.62;
            min = -amplitude;
            max = amplitude;
        }
        context.moveTo(x, height / 2 + min * height * 0.44);
        context.lineTo(x, height / 2 + max * height * 0.44);
    }
    context.stroke();
    updateVideoTrimSelection();
}

function updateVideoTrimSelection() {
    const selection = document.getElementById('videoTrimSelection');
    if (!selection || !videoTrimState.duration) return;
    selection.style.left = `${(videoTrimState.start / videoTrimState.duration) * 100}%`;
    selection.style.width = `${Math.max(0.5, ((videoTrimState.end - videoTrimState.start) / videoTrimState.duration) * 100)}%`;
    selection.classList.remove('hidden');
    setVideoTrimLabels(videoTrimState.start, videoTrimState.end);
}

function setVideoTrimLabels(start, end) {
    const startLabel = document.getElementById('videoTrimStartLabel');
    const endLabel = document.getElementById('videoTrimEndLabel');
    if (startLabel) startLabel.textContent = `${start.toFixed(2)}s`;
    if (endLabel) endLabel.textContent = `${end.toFixed(2)}s`;
}

function bindVideoTrimWaveform() {
    const waveform = document.getElementById('videoTrimWaveform');
    const input = document.getElementById('videoTrimmerInput');
    if (!waveform) return;
    resetVideoTrimWaveform();
    input?.addEventListener('change', () => {
        if (!input.files?.length) {
            videoTrimState.duration = 0;
            videoTrimState.samples = null;
            resetVideoTrimWaveform();
        }
    });

    const secondsFromEvent = event => {
        const rect = waveform.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        return Math.max(0, Math.min(videoTrimState.duration, ((clientX - rect.left) / rect.width) * videoTrimState.duration));
    };
    const startDrag = event => {
        if (!videoTrimState.duration) return;
        const handle = event.target.closest?.('.crop-handle');
        const moveZone = event.target.closest?.('.audio-selection-move-zone');
        videoTrimState.dragMode = handle?.dataset.handle === 'w' ? 'start' : handle?.dataset.handle === 'e' ? 'end' : moveZone ? 'move' : '';
        if (!videoTrimState.dragMode) return;
        event.preventDefault();
        videoTrimState.dragging = true;
        videoTrimState.dragOffset = secondsFromEvent(event) - videoTrimState.start;
    };
    const moveDrag = event => {
        if (!videoTrimState.dragging || !videoTrimState.duration) return;
        event.preventDefault();
        const seconds = secondsFromEvent(event);
        const duration = videoTrimState.duration;
        const minLength = Math.min(0.1, duration);
        if (videoTrimState.dragMode === 'start') {
            videoTrimState.start = Math.max(0, Math.min(seconds, videoTrimState.end - minLength));
        } else if (videoTrimState.dragMode === 'end') {
            videoTrimState.end = Math.max(videoTrimState.start + minLength, Math.min(seconds, duration));
        } else {
            const length = videoTrimState.end - videoTrimState.start;
            const start = Math.max(0, Math.min(seconds - videoTrimState.dragOffset, duration - length));
            videoTrimState.start = start;
            videoTrimState.end = start + length;
        }
        updateVideoTrimSelection();
    };
    const endDrag = () => { videoTrimState.dragging = false; };

    waveform.addEventListener('mousedown', startDrag);
    waveform.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('resize', drawVideoTrimWaveform);
}

async function setupVideoGifWaveform(file, duration) {
    const waveform = document.getElementById('videoGifWaveform');
    const selection = document.getElementById('videoGifSelection');
    videoGifState.duration = Math.max(0, duration || 0);
    videoGifState.start = 0;
    videoGifState.end = Math.min(15, videoGifState.duration);
    videoGifState.samples = null;
    if (!file || !waveform || !selection || !videoGifState.duration) return resetVideoGifWaveform();

    waveform.classList.remove('hidden');
    selection.classList.remove('hidden');
    requestAnimationFrame(drawVideoGifWaveform);
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            const context = new AudioContextClass();
            const buffer = await context.decodeAudioData(await file.arrayBuffer());
            videoGifState.samples = buffer.getChannelData(0);
            await context.close();
        }
    } catch {
        videoGifState.samples = null;
    }
    requestAnimationFrame(drawVideoGifWaveform);
}

function resetVideoGifWaveform() {
    const waveform = document.getElementById('videoGifWaveform');
    const selection = document.getElementById('videoGifSelection');
    waveform?.classList.add('hidden');
    selection?.classList.add('hidden');
    if (selection) {
        selection.style.left = '';
        selection.style.width = '';
    }
    setVideoGifLabels(0, 0);
}

function drawVideoGifWaveform() {
    const canvas = document.getElementById('videoGifCanvas');
    if (!canvas || !videoGifState.duration || canvas.closest('.hidden')) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, rect.width);
    const height = 150;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    const context = canvas.getContext('2d');
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = '#f8fafc';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = '#d4d4d8';
    context.beginPath();
    context.moveTo(0, height / 2);
    context.lineTo(width, height / 2);
    context.stroke();
    context.strokeStyle = '#18181b';
    context.lineWidth = 1.5;
    context.beginPath();

    const samples = videoGifState.samples;
    const step = samples ? Math.max(1, Math.floor(samples.length / width)) : 1;
    for (let x = 0; x < width; x += 1) {
        let min = 1;
        let max = -1;
        if (samples) {
            const start = x * step;
            const end = Math.min(samples.length, start + step);
            for (let index = start; index < end; index += 1) {
                min = Math.min(min, samples[index]);
                max = Math.max(max, samples[index]);
            }
        } else {
            const amplitude = 0.2 + Math.abs(Math.sin(x * 0.13) * Math.cos(x * 0.037)) * 0.62;
            min = -amplitude;
            max = amplitude;
        }
        context.moveTo(x, height / 2 + min * height * 0.44);
        context.lineTo(x, height / 2 + max * height * 0.44);
    }
    context.stroke();
    updateVideoGifSelection();
}

function updateVideoGifSelection() {
    const selection = document.getElementById('videoGifSelection');
    if (!selection || !videoGifState.duration) return;
    selection.style.left = `${(videoGifState.start / videoGifState.duration) * 100}%`;
    selection.style.width = `${Math.max(0.5, ((videoGifState.end - videoGifState.start) / videoGifState.duration) * 100)}%`;
    selection.classList.remove('hidden');
    setVideoGifLabels(videoGifState.start, videoGifState.end);
    updateVideoGifEstimate();
}

function setVideoGifLabels(start, end) {
    const startLabel = document.getElementById('videoGifStartLabel');
    const endLabel = document.getElementById('videoGifEndLabel');
    if (startLabel) startLabel.textContent = `${start.toFixed(2)}s`;
    if (endLabel) endLabel.textContent = `${end.toFixed(2)}s`;
}

function updateVideoGifEstimate() {
    const output = document.getElementById('videoGifEstimate');
    if (!output || !videoGifState.duration) return;
    const preview = document.getElementById('videoGifPreview');
    const width = Number(document.getElementById('videoGifWidth')?.value) || 480;
    const fps = Number(document.getElementById('videoGifFps')?.value) || 12;
    const colors = Number(document.getElementById('videoGifColors')?.value) || 128;
    const duration = Math.max(0.1, videoGifState.end - videoGifState.start);
    const aspect = preview?.videoWidth && preview?.videoHeight ? preview.videoHeight / preview.videoWidth : 9 / 16;
    const height = width * aspect;
    const colorFactor = 0.45 + (colors / 256) * 0.55;
    const estimatedBytes = width * height * fps * duration * 0.11 * colorFactor + 50000;
    const megabytes = estimatedBytes / 1024 / 1024;
    output.textContent = `Estimated file size: ~${megabytes < 1 ? megabytes.toFixed(2) : megabytes.toFixed(1)} MB`;
    output.classList.remove('text-red-500');
    output.classList.add('text-zinc-500');
}

function bindVideoGifWaveform() {
    const waveform = document.getElementById('videoGifWaveform');
    const input = document.getElementById('videoGifInput');
    if (!waveform) return;
    resetVideoGifWaveform();
    input?.addEventListener('change', () => {
        if (!input.files?.length) {
            videoGifState.duration = 0;
            videoGifState.samples = null;
            resetVideoGifWaveform();
        }
    });

    const secondsFromEvent = event => {
        const rect = waveform.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        return Math.max(0, Math.min(videoGifState.duration, ((clientX - rect.left) / rect.width) * videoGifState.duration));
    };
    const startDrag = event => {
        if (!videoGifState.duration) return;
        const handle = event.target.closest?.('.crop-handle');
        const moveZone = event.target.closest?.('.audio-selection-move-zone');
        videoGifState.dragMode = handle?.dataset.handle === 'w' ? 'start' : handle?.dataset.handle === 'e' ? 'end' : moveZone ? 'move' : '';
        if (!videoGifState.dragMode) return;
        event.preventDefault();
        videoGifState.dragging = true;
        videoGifState.dragOffset = secondsFromEvent(event) - videoGifState.start;
    };
    const moveDrag = event => {
        if (!videoGifState.dragging || !videoGifState.duration) return;
        event.preventDefault();
        const seconds = secondsFromEvent(event);
        const duration = videoGifState.duration;
        const minLength = Math.min(0.1, duration);
        if (videoGifState.dragMode === 'start') {
            videoGifState.start = Math.max(0, videoGifState.end - 15, Math.min(seconds, videoGifState.end - minLength));
        } else if (videoGifState.dragMode === 'end') {
            videoGifState.end = Math.max(videoGifState.start + minLength, Math.min(seconds, duration, videoGifState.start + 15));
        } else {
            const length = videoGifState.end - videoGifState.start;
            const start = Math.max(0, Math.min(seconds - videoGifState.dragOffset, duration - length));
            videoGifState.start = start;
            videoGifState.end = start + length;
        }
        updateVideoGifSelection();
    };
    const endDrag = () => { videoGifState.dragging = false; };

    waveform.addEventListener('mousedown', startDrag);
    waveform.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('resize', drawVideoGifWaveform);
}

function bindVideoAction(buttonId, task, needsEngine = () => true) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    button.addEventListener('click', async () => {
        if (videoTaskRunning) return;
        videoTaskRunning = true;
        const originalText = button.innerText;
        const card = button.closest('.expandable-card');
        card?.classList.add('is-processing');
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
        try {
            const content = button.closest('.calculator-content');
            let ffmpeg = null;
            if (needsEngine(content)) {
                button.innerText = 'Loading engine...';
                ffmpeg = await getVideoFfmpeg(content);
            }
            button.innerText = 'Processing...';
            await task(ffmpeg, content);
        } catch (error) {
            console.error('Video task failed:', error);
            const detail = String(error?.message || error || 'Unknown processing error').replace(/\s+/g, ' ').trim();
            setVideoStatus(button.closest('.calculator-content'), `Processing failed: ${detail.slice(0, 180)}`, true);
            if (/memory access out of bounds|runtimeerror/i.test(detail)) {
                try { videoFfmpeg?.terminate(); } catch { /* The failed worker may already be stopped. */ }
                videoFfmpeg = null;
                videoFfmpegLoading = null;
            }
        } finally {
            button.innerText = originalText;
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            card?.classList.remove('is-processing');
            videoTaskRunning = false;
        }
    });
}

async function getVideoFfmpeg(content) {
    if (videoFfmpeg) return videoFfmpeg;
    if (videoFfmpegLoading) return videoFfmpegLoading;
    videoFfmpegLoading = (async () => {
        await loadVideoScript('https://unpkg.com/@ffmpeg/ffmpeg@0.12.15/dist/umd/ffmpeg.js');
        const ffmpeg = new FFmpegWASM.FFmpeg();
        ffmpeg.on('progress', ({ progress }) => {
            setVideoStatus(content, `Processing ${Math.max(0, Math.min(100, Math.round(progress * 100)))}%`);
        });
        ffmpeg.on('log', ({ message }) => {
            if (message) videoLastLog = message;
        });
        const base = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm';
        await ffmpeg.load({
            classWorkerURL: `${window.location.origin}/ffmpeg-class-worker.js`,
            coreURL: await videoToBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await videoToBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm')
        });
        videoFfmpeg = ffmpeg;
        return ffmpeg;
    })();
    try {
        return await videoFfmpegLoading;
    } finally {
        videoFfmpegLoading = null;
    }
}

function loadVideoScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function videoToBlobURL(url, mimeType) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to load the video engine (${response.status}).`);
    return URL.createObjectURL(new Blob([await response.arrayBuffer()], { type: mimeType }));
}

async function compressVideoFile(ffmpeg, content) {
    const file = getVideoFile('videoCompressorInput');
    if (!file) return setVideoStatus(content, 'Please add a video.', true);
    const compression = Math.max(0, Math.min(100, Number(document.getElementById('videoCompressionPercent').value) || 0));
    const crf = String(Math.round(18 + compression * 0.22));
    const input = videoInputName(file);
    const output = 'compressed.mp4';
    await runVideoCommand(ffmpeg, file, input, output, ['-i', input, '-c:v', 'libx264', '-crf', crf, '-preset', 'veryfast', '-c:a', 'aac', '-movflags', '+faststart', output]);
    await downloadVideoOutput(ffmpeg, output, buildVideoName(file.name, 'compressed', 'mp4'), 'video/mp4');
    setVideoStatus(content, 'Compressed video downloaded.');
}

async function convertVideoFormat(ffmpeg, content) {
    const file = getVideoFile('videoFormatInput');
    if (!file) return setVideoStatus(content, 'Please add an MP4 or WebM video.', true);
    const isWebm = /webm$/i.test(file.name) || file.type === 'video/webm';
    if (!isWebm) return convertMp4ToWebmInBrowser(file, content);

    const input = videoInputName(file);
    const extension = isWebm ? 'mp4' : 'webm';
    const output = `converted.${extension}`;
    const args = ['-i', input, '-threads', '1', '-c:v', 'libx264', '-crf', '25', '-preset', 'veryfast', '-c:a', 'aac', '-movflags', '+faststart', output];
    await runVideoCommand(ffmpeg, file, input, output, args);
    await downloadVideoOutput(ffmpeg, output, buildVideoName(file.name, 'converted', extension), `video/${extension}`);
    setVideoStatus(content, `${extension.toUpperCase()} video downloaded.`);
}

async function convertMp4ToWebmInBrowser(file, content) {
    const mimeType = ['video/webm;codecs=vp8,opus', 'video/webm;codecs=vp8', 'video/webm']
        .find(type => window.MediaRecorder?.isTypeSupported(type));
    const captureMethod = HTMLMediaElement.prototype.captureStream || HTMLMediaElement.prototype.mozCaptureStream;
    if (!mimeType || !captureMethod) throw new Error('This browser does not support direct MP4 to WebM conversion.');

    const sourceUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = sourceUrl;
    video.preload = 'auto';
    video.playsInline = true;
    video.volume = 0;
    video.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-10px;top:-10px';
    document.body.appendChild(video);

    try {
        await new Promise((resolve, reject) => {
            video.onloadedmetadata = resolve;
            video.onerror = () => reject(new Error('Unable to read this MP4 file.'));
        });
        const stream = captureMethod.call(video);
        const chunks = [];
        const recorder = new MediaRecorder(stream, {
            mimeType,
            videoBitsPerSecond: 1500000,
            audioBitsPerSecond: 128000
        });
        recorder.ondataavailable = event => {
            if (event.data?.size) chunks.push(event.data);
        };
        const stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = event => reject(event.error || new Error('WebM recording failed.'));
        });
        const finished = new Promise((resolve, reject) => {
            video.onended = resolve;
            video.onerror = () => reject(new Error('MP4 playback failed during conversion.'));
        });
        const progressTimer = setInterval(() => {
            const progress = video.duration ? Math.round((video.currentTime / video.duration) * 100) : 0;
            setVideoStatus(content, `Converting ${Math.max(0, Math.min(100, progress))}%`);
        }, 500);

        try {
            recorder.start(1000);
            await video.play();
            await finished;
            recorder.stop();
            await stopped;
        } finally {
            clearInterval(progressTimer);
            if (recorder.state !== 'inactive') recorder.stop();
            stream.getTracks().forEach(track => track.stop());
        }

        const blob = new Blob(chunks, { type: mimeType });
        if (!blob.size) throw new Error('The browser produced an empty WebM file.');
        const outputUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = outputUrl;
        link.download = buildVideoName(file.name, 'converted', 'webm');
        link.click();
        setTimeout(() => URL.revokeObjectURL(outputUrl), 1000);
        setVideoStatus(content, 'WEBM video downloaded.');
    } finally {
        video.remove();
        URL.revokeObjectURL(sourceUrl);
    }
}

async function trimVideoFile(ffmpeg, content) {
    const file = getVideoFile('videoTrimmerInput');
    if (!file) return setVideoStatus(content, 'Please add a video.', true);
    const start = videoTrimState.start;
    const end = videoTrimState.end;
    if (end <= start) return setVideoStatus(content, 'End time must be greater than start time.', true);
    const input = videoInputName(file);
    const extension = /webm$/i.test(file.name) ? 'webm' : 'mp4';
    const output = `trimmed.${extension}`;
    const duration = end - start;
    await runVideoCommand(ffmpeg, file, input, output, [
        '-i', input,
        '-ss', String(start),
        '-t', String(duration),
        '-map', '0',
        '-c', 'copy',
        '-avoid_negative_ts', 'make_zero',
        output
    ]);
    await downloadVideoOutput(ffmpeg, output, buildVideoName(file.name, 'trimmed', extension), `video/${extension}`);
    setVideoStatus(content, 'Trimmed video downloaded.');
}

async function createGifFromVideo(ffmpeg, content) {
    const file = getVideoFile('videoGifInput');
    if (!file) return setVideoStatus(content, 'Please add a video.', true);
    const start = videoGifState.start;
    const duration = Math.max(0.1, Math.min(15, videoGifState.end - videoGifState.start));
    const width = Math.max(160, Math.min(720, Number(document.getElementById('videoGifWidth').value) || 480));
    const fps = Math.max(5, Math.min(30, Number(document.getElementById('videoGifFps').value) || 12));
    const colors = Math.max(32, Math.min(256, Number(document.getElementById('videoGifColors').value) || 128));
    const input = videoInputName(file);
    const output = 'animated.gif';
    const filter = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${colors}[p];[s1][p]paletteuse=dither=sierra2_4a`;
    await runVideoCommand(ffmpeg, file, input, output, ['-ss', String(start), '-t', String(duration), '-i', input, '-vf', filter, '-gifflags', '+transdiff', '-loop', '0', output]);
    const outputSize = (await ffmpeg.readFile(output)).byteLength;
    await downloadVideoOutput(ffmpeg, output, buildVideoName(file.name, 'animated', 'gif'), 'image/gif');
    setVideoStatus(content, `GIF downloaded (${(outputSize / 1024 / 1024).toFixed(2)} MB).`);
}

async function extractAudioFromVideo(ffmpeg, content) {
    const file = getVideoFile('videoAudioInput');
    if (!file) return setVideoStatus(content, 'Please add a video.', true);
    const format = document.getElementById('videoAudioFormat').value;
    const input = videoInputName(file);
    const output = `audio.${format}`;
    const args = format === 'wav'
        ? ['-i', input, '-vn', '-c:a', 'pcm_s16le', output]
        : ['-i', input, '-vn', '-c:a', 'libmp3lame', '-q:a', '2', output];
    await runVideoCommand(ffmpeg, file, input, output, args);
    await downloadVideoOutput(ffmpeg, output, buildVideoName(file.name, 'audio', format), format === 'wav' ? 'audio/wav' : 'audio/mpeg');
    setVideoStatus(content, `${format.toUpperCase()} audio downloaded.`);
}

async function runVideoCommand(ffmpeg, file, input, output, args) {
    await ffmpeg.writeFile(input, new Uint8Array(await file.arrayBuffer()));
    videoLastLog = '';
    try {
        const exitCode = await ffmpeg.exec(args);
        if (exitCode !== 0) {
            throw new Error(videoLastLog || `FFmpeg exited with code ${exitCode}`);
        }
    } finally {
        await safeDeleteVideoFile(ffmpeg, input);
    }
}

async function downloadVideoOutput(ffmpeg, output, fileName, mimeType) {
    const data = await ffmpeg.readFile(output);
    const blob = new Blob([data.buffer], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    await safeDeleteVideoFile(ffmpeg, output);
}

async function safeDeleteVideoFile(ffmpeg, name) {
    try { await ffmpeg.deleteFile(name); } catch { /* File may already be gone. */ }
}

function convertSubtitleFile() {
    const input = document.getElementById('subtitleConverterInput');
    const file = input?.files?.[0];
    const status = document.getElementById('subtitleConverterStatus');
    if (!file) {
        status.innerText = 'Please add an SRT or VTT file.';
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const source = String(reader.result || '');
        const isVtt = /\.vtt$/i.test(file.name) || source.trimStart().startsWith('WEBVTT');
        const extension = isVtt ? 'srt' : 'vtt';
        const converted = isVtt ? vttToSrt(source) : srtToVtt(source);
        const blob = new Blob([converted], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = buildVideoName(file.name, 'converted', extension);
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.innerText = `${extension.toUpperCase()} subtitle downloaded.`;
    };
    reader.readAsText(file);
}

function srtToVtt(value) {
    return `WEBVTT\n\n${value.replace(/\r/g, '').replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')}`;
}

function vttToSrt(value) {
    const body = value.replace(/^WEBVTT[^\n]*\n+/i, '').replace(/\r/g, '').trim();
    const blocks = body.split(/\n{2,}/).filter(Boolean);
    return `${blocks.map((block, index) => {
        const lines = block.split('\n').filter(line => !/^NOTE/.test(line));
        const timeIndex = lines.findIndex(line => line.includes('-->'));
        if (timeIndex < 0) return '';
        const time = lines[timeIndex].replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, '$1,$2');
        return `${index + 1}\n${time}\n${lines.slice(timeIndex + 1).join('\n')}`;
    }).filter(Boolean).join('\n\n')}\n`;
}

function getVideoFile(inputId) {
    return document.getElementById(inputId)?.files?.[0] || null;
}

function videoInputName(file) {
    const extension = (file.name.split('.').pop() || 'mp4').replace(/[^a-z0-9]/gi, '').toLowerCase();
    return `input.${extension || 'mp4'}`;
}

function buildVideoName(name, suffix, extension) {
    return `${name.replace(/\.[^.]+$/, '') || 'video'}-${suffix}.${extension}`;
}

function setVideoStatus(content, message, isError = false) {
    const status = content?.querySelector('.video-status');
    if (!status) return;
    status.innerText = message;
    status.classList.toggle('text-red-500', isError);
    status.classList.toggle('text-zinc-500', !isError);
}
