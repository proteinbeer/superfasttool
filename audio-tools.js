function initAudioTools() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioContext = null;
    const trimState = {
        file: null,
        buffer: null,
        start: 0,
        end: 0,
        anchor: 0,
        dragging: false,
        dragMode: 'new',
        dragOffset: 0
    };

    function getAudioContext() {
        if (!AudioContextClass) throw new Error('Web Audio API is not supported in this browser.');
        if (!audioContext) audioContext = new AudioContextClass();
        return audioContext;
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    function setText(id, text) {
        const element = getElement(id);
        if (element) element.textContent = text;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function sanitizeName(name, fallback) {
        return (name || fallback).replace(/\.[^/.]+$/, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || fallback;
    }

    function isMp3File(file) {
        return !!file && (/\.mp3$/i.test(file.name) || file.type === 'audio/mpeg' || file.type === 'audio/mp3');
    }

    function isWavFile(file) {
        return !!file && (/\.wav$/i.test(file.name) || file.type === 'audio/wav' || file.type === 'audio/x-wav');
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    async function decodeAudioFile(file) {
        if (!file) throw new Error('Choose an audio file first.');
        const context = getAudioContext();
        const bytes = await file.arrayBuffer();
        return context.decodeAudioData(bytes.slice(0));
    }

    function createBuffer(channelCount, length, sampleRate) {
        return getAudioContext().createBuffer(channelCount, Math.max(1, length), sampleRate);
    }

    function audioBufferToWav(buffer) {
        const channelCount = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const samples = buffer.length;
        const bytesPerSample = 2;
        const blockAlign = channelCount * bytesPerSample;
        const dataSize = samples * blockAlign;
        const output = new ArrayBuffer(44 + dataSize);
        const view = new DataView(output);

        function writeString(offset, value) {
            for (let index = 0; index < value.length; index += 1) {
                view.setUint8(offset + index, value.charCodeAt(index));
            }
        }

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, channelCount, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);

        let offset = 44;
        for (let index = 0; index < samples; index += 1) {
            for (let channel = 0; channel < channelCount; channel += 1) {
                const sample = clamp(buffer.getChannelData(channel)[index], -1, 1);
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
                offset += 2;
            }
        }

        return new Blob([output], { type: 'audio/wav' });
    }

    function convertBufferToMp3(buffer) {
        if (!window.lamejs) throw new Error('MP3 encoder is still loading. Please try again.');
        const channels = Math.min(2, buffer.numberOfChannels);
        const sampleRate = buffer.sampleRate;
        const encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        const blockSize = 1152;
        const chunks = [];

        function floatToInt16(floatSamples, start, end) {
            const output = new Int16Array(end - start);
            for (let index = start; index < end; index += 1) {
                const sample = clamp(floatSamples[index], -1, 1);
                output[index - start] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
            }
            return output;
        }

        const leftSource = buffer.getChannelData(0);
        const rightSource = channels > 1 ? buffer.getChannelData(1) : leftSource;
        for (let start = 0; start < buffer.length; start += blockSize) {
            const end = Math.min(start + blockSize, buffer.length);
            const left = floatToInt16(leftSource, start, end);
            const right = channels > 1 ? floatToInt16(rightSource, start, end) : null;
            const mp3Buffer = channels > 1 ? encoder.encodeBuffer(left, right) : encoder.encodeBuffer(left);
            if (mp3Buffer.length) chunks.push(mp3Buffer);
        }

        const finalBuffer = encoder.flush();
        if (finalBuffer.length) chunks.push(finalBuffer);
        return new Blob(chunks, { type: 'audio/mpeg' });
    }

    function downloadBufferAsFormat(buffer, format, filenameBase) {
        if (format === 'mp3') {
            downloadBlob(convertBufferToMp3(buffer), `${filenameBase}.mp3`);
            return;
        }
        downloadBlob(audioBufferToWav(buffer), `${filenameBase}.wav`);
    }

    function downloadBufferLikeInput(buffer, file, filenameBase) {
        downloadBufferAsFormat(buffer, isMp3File(file) ? 'mp3' : 'wav', filenameBase);
    }

    function sliceAudioBuffer(buffer, startSeconds, endSeconds) {
        const start = Math.floor(clamp(startSeconds, 0, buffer.duration) * buffer.sampleRate);
        const end = Math.floor(clamp(endSeconds, startSeconds, buffer.duration) * buffer.sampleRate);
        const length = Math.max(1, end - start);
        const output = createBuffer(buffer.numberOfChannels, length, buffer.sampleRate);
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            output.copyToChannel(buffer.getChannelData(channel).slice(start, end), channel);
        }
        return output;
    }

    function gainAudioBuffer(buffer, gain) {
        const output = createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            const source = buffer.getChannelData(channel);
            const target = output.getChannelData(channel);
            for (let index = 0; index < source.length; index += 1) {
                target[index] = clamp(source[index] * gain, -1, 1);
            }
        }
        return output;
    }

    function reverseAudioBuffer(buffer) {
        const output = createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            const source = buffer.getChannelData(channel);
            const target = output.getChannelData(channel);
            for (let index = 0; index < source.length; index += 1) {
                target[index] = source[source.length - 1 - index];
            }
        }
        return output;
    }

    function speedAudioBuffer(buffer, rate) {
        const outputLength = Math.max(1, Math.floor(buffer.length / rate));
        const output = createBuffer(buffer.numberOfChannels, outputLength, buffer.sampleRate);
        for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
            const source = buffer.getChannelData(channel);
            const target = output.getChannelData(channel);
            for (let index = 0; index < outputLength; index += 1) {
                const sourcePosition = index * rate;
                const left = Math.floor(sourcePosition);
                const right = Math.min(left + 1, source.length - 1);
                const mix = sourcePosition - left;
                target[index] = source[left] * (1 - mix) + source[right] * mix;
            }
        }
        return output;
    }

    function silentAudioBuffer(seconds) {
        const sampleRate = 44100;
        return createBuffer(1, Math.floor(seconds * sampleRate), sampleRate);
    }

    function bindRangeLabel(inputId, labelId, formatter) {
        const input = getElement(inputId);
        if (!input) return;
        const update = () => setText(labelId, formatter(input.value));
        input.addEventListener('input', update);
        update();
    }

    function withBusy(button, action) {
        if (!button) return;
        button.addEventListener('click', async () => {
            const originalText = button.textContent;
            const card = button.closest('.expandable-card');
            card?.classList.add('is-processing');
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.textContent = 'Processing...';
            try {
                await action();
            } catch (error) {
                console.error(error);
            } finally {
                button.disabled = false;
                button.classList.remove('opacity-50', 'cursor-not-allowed');
                button.textContent = originalText;
                card?.classList.remove('is-processing');
            }
        });
    }

    function resizeCanvas(canvas, cssHeight) {
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(rect.width * ratio));
        canvas.height = Math.floor(cssHeight * ratio);
        const context = canvas.getContext('2d');
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        return { context, width: rect.width, height: cssHeight };
    }

    function drawTrimWaveform() {
        const canvas = getElement('audioTrimCanvas');
        const selection = getElement('audioTrimSelection');
        if (!canvas || !trimState.buffer) return;
        const { context, width, height } = resizeCanvas(canvas, 150);
        const data = trimState.buffer.getChannelData(0);
        const step = Math.max(1, Math.floor(data.length / width));
        const mid = height / 2;

        context.clearRect(0, 0, width, height);
        context.fillStyle = '#f8fafc';
        context.fillRect(0, 0, width, height);
        context.strokeStyle = '#d4d4d8';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, mid);
        context.lineTo(width, mid);
        context.stroke();
        context.strokeStyle = '#18181b';
        context.lineWidth = 1.5;
        context.beginPath();

        for (let x = 0; x < width; x += 1) {
            let min = 1;
            let max = -1;
            const start = x * step;
            const end = Math.min(start + step, data.length);
            for (let index = start; index < end; index += 1) {
                min = Math.min(min, data[index]);
                max = Math.max(max, data[index]);
            }
            context.moveTo(x, mid + min * mid * 0.88);
            context.lineTo(x, mid + max * mid * 0.88);
        }
        context.stroke();
        updateTrimSelection();
    }

    function updateTrimSelection() {
        const waveform = getElement('audioTrimWaveform');
        const selection = getElement('audioTrimSelection');
        if (!waveform || !selection || !trimState.buffer) return;
        const duration = trimState.buffer.duration || 1;
        const startPct = (trimState.start / duration) * 100;
        const endPct = (trimState.end / duration) * 100;
        selection.style.left = `${startPct}%`;
        selection.style.width = `${Math.max(0.5, endPct - startPct)}%`;
        selection.classList.remove('hidden');
        setText('audioTrimStartLabel', `${trimState.start.toFixed(2)}s`);
        setText('audioTrimEndLabel', `${trimState.end.toFixed(2)}s`);
    }

    function resetTrimUi() {
        const waveform = getElement('audioTrimWaveform');
        const selection = getElement('audioTrimSelection');
        const player = getElement('audioTrimmerPlayer');
        if (waveform) waveform.classList.add('hidden');
        if (selection) {
            selection.classList.add('hidden');
            selection.style.left = '';
            selection.style.width = '';
        }
        if (player) {
            player.classList.add('hidden');
            player.removeAttribute('src');
        }
        setText('audioTrimStartLabel', '0.00s');
        setText('audioTrimEndLabel', '0.00s');
    }

    function waveformSecondsFromEvent(event) {
        const waveform = getElement('audioTrimWaveform');
        if (!waveform || !trimState.buffer) return 0;
        const rect = waveform.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        return clamp(((clientX - rect.left) / rect.width) * trimState.buffer.duration, 0, trimState.buffer.duration);
    }

    function getTrimDragMode(seconds, target, event) {
        const handle = target && target.closest ? target.closest('.crop-handle') : null;
        if (handle && handle.dataset.handle === 'w') return 'start';
        if (handle && handle.dataset.handle === 'e') return 'end';
        const moveZone = target && target.closest ? target.closest('.audio-selection-move-zone') : null;
        if (moveZone) return 'move';
        return 'blocked';
    }

    function bindTrimWaveform() {
        const input = getElement('audioTrimmerInput');
        const player = getElement('audioTrimmerPlayer');
        const waveform = getElement('audioTrimWaveform');
        const selection = getElement('audioTrimSelection');
        if (!input || !player || !waveform || !selection) return;

        resetTrimUi();

        input.addEventListener('change', async () => {
            const file = input.files && input.files[0];
            resetTrimUi();
            trimState.file = null;
            trimState.buffer = null;
            trimState.start = 0;
            trimState.end = 0;
            if (!file) return;
            trimState.file = file;
            trimState.buffer = await decodeAudioFile(file);
            trimState.start = 0;
            trimState.end = trimState.buffer.duration;
            player.src = URL.createObjectURL(file);
            player.classList.remove('hidden');
            waveform.classList.remove('hidden');
            requestAnimationFrame(drawTrimWaveform);
        });

        const startDrag = event => {
            if (!trimState.buffer) return;
            event.preventDefault();
            const seconds = waveformSecondsFromEvent(event);
            trimState.dragMode = getTrimDragMode(seconds, event.target, event);
            if (trimState.dragMode === 'blocked') {
                trimState.dragging = false;
                return;
            }
            trimState.dragging = true;
            trimState.dragOffset = seconds - trimState.start;
            updateTrimSelection();
        };
        const moveDrag = event => {
            if (!trimState.dragging || !trimState.buffer) return;
            event.preventDefault();
            const seconds = waveformSecondsFromEvent(event);
            const duration = trimState.buffer.duration;
            const minLength = Math.min(0.1, duration);
            if (trimState.dragMode === 'start') {
                trimState.start = clamp(seconds, 0, trimState.end - minLength);
            } else if (trimState.dragMode === 'end') {
                trimState.end = clamp(seconds, trimState.start + minLength, duration);
            } else if (trimState.dragMode === 'move') {
                const length = trimState.end - trimState.start;
                const nextStart = clamp(seconds - trimState.dragOffset, 0, duration - length);
                trimState.start = nextStart;
                trimState.end = nextStart + length;
            } else {
                const nextStart = clamp(Math.min(trimState.anchor, seconds), 0, duration - minLength);
                const nextEnd = clamp(Math.max(trimState.anchor, seconds), nextStart + minLength, duration);
                trimState.start = nextStart;
                trimState.end = nextEnd;
            }
            updateTrimSelection();
        };
        const endDrag = () => {
            trimState.dragging = false;
        };

        waveform.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', endDrag);
        waveform.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('touchmove', moveDrag, { passive: false });
        window.addEventListener('touchend', endDrag);
        window.addEventListener('resize', drawTrimWaveform);
    }

    bindTrimWaveform();
    bindRangeLabel('audioVolumeGain', 'audioVolumeGainValue', value => `${value}%`);
    bindRangeLabel('audioSpeedRate', 'audioSpeedRateValue', value => `${Number(value).toFixed(2)}x`);

    withBusy(getElement('downloadTrimmedAudio'), async () => {
        if (!trimState.file || !trimState.buffer) throw new Error('Choose an audio file first.');
        const trimmed = sliceAudioBuffer(trimState.buffer, trimState.start, trimState.end);
        downloadBufferLikeInput(trimmed, trimState.file, `${sanitizeName(trimState.file.name, 'trimmed-audio')}-trimmed`);
    });

    withBusy(getElement('downloadMp3ToWav'), async () => {
        const input = getElement('mp3ToWavInput');
        const file = input.files && input.files[0];
        const buffer = await decodeAudioFile(file);
        downloadBufferAsFormat(buffer, 'wav', `${sanitizeName(file.name, 'mp3-to-wav')}-converted`);
    });

    withBusy(getElement('downloadWavToMp3'), async () => {
        const input = getElement('wavToMp3Input');
        const file = input.files && input.files[0];
        const buffer = await decodeAudioFile(file);
        downloadBufferAsFormat(buffer, 'mp3', `${sanitizeName(file.name, 'wav-to-mp3')}-converted`);
    });

    withBusy(getElement('downloadVolumeAudio'), async () => {
        const input = getElement('audioVolumeInput');
        const file = input.files && input.files[0];
        const buffer = await decodeAudioFile(file);
        const gain = Number(getElement('audioVolumeGain').value || 100) / 100;
        downloadBufferLikeInput(gainAudioBuffer(buffer, gain), file, `${sanitizeName(file.name, 'volume-audio')}-volume`);
    });

    withBusy(getElement('downloadSpeedAudio'), async () => {
        const input = getElement('audioSpeedInput');
        const file = input.files && input.files[0];
        const buffer = await decodeAudioFile(file);
        const rate = Number(getElement('audioSpeedRate').value || 1);
        downloadBlob(audioBufferToWav(speedAudioBuffer(buffer, rate)), `${sanitizeName(file.name, 'speed-audio')}-speed.wav`);
    });

    withBusy(getElement('downloadReverseAudio'), async () => {
        const input = getElement('audioReverseInput');
        const file = input.files && input.files[0];
        const buffer = await decodeAudioFile(file);
        downloadBufferLikeInput(reverseAudioBuffer(buffer), file, `${sanitizeName(file.name, 'reversed-audio')}-reversed`);
    });

    withBusy(getElement('downloadAudioMetadata'), async () => {
        const input = getElement('audioMetadataInput');
        const file = input.files && input.files[0];
        const buffer = await decodeAudioFile(file);
        const lines = [
            `File name: ${file.name}`,
            `File type: ${file.type || 'Unknown'}`,
            `Detected format: ${isMp3File(file) ? 'MP3' : isWavFile(file) ? 'WAV' : 'Other audio'}`,
            `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
            `Duration: ${buffer.duration.toFixed(2)} seconds`,
            `Sample rate: ${buffer.sampleRate} Hz`,
            `Channels: ${buffer.numberOfChannels}`,
            `Samples: ${buffer.length}`
        ];
        downloadBlob(new Blob([lines.join('\n')], { type: 'text/plain' }), `${sanitizeName(file.name, 'audio-metadata')}-metadata.txt`);
    });

    withBusy(getElement('downloadSilentAudio'), async () => {
        const seconds = clamp(Number(getElement('silentAudioSeconds').value || 5), 0.1, 600);
        const format = getElement('silentAudioFormat').value;
        downloadBufferAsFormat(silentAudioBuffer(seconds), format, `silent-audio-${seconds}s`);
    });
}
