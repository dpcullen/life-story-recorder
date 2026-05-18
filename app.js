let currentPerson = null;
let currentTheme = null;
let saveTimeout = null;
let mediaRecorder = null;
let audioChunks = [];
let recordingQuestionId = null;
let recognition = null;

function getSettings() {
    const raw = localStorage.getItem('story_settings');
    return raw ? JSON.parse(raw) : { personNames: { Mom: 'Mom', Dad: 'Dad' } };
}

function saveSettings(settings) {
    localStorage.setItem('story_settings', JSON.stringify(settings));
}

function getPersonDisplayName(person) {
    const settings = getSettings();
    return settings.personNames[person] || person;
}

function initWelcome() {
    const settings = getSettings();
    document.getElementById('mom-btn-label').textContent = settings.personNames.Mom;
    document.getElementById('dad-btn-label').textContent = settings.personNames.Dad;
}

function showNameSetup() {
    const settings = getSettings();
    document.getElementById('mom-name-input').value = settings.personNames.Mom;
    document.getElementById('dad-name-input').value = settings.personNames.Dad;
    document.getElementById('name-setup-modal').classList.add('visible');
}

function closeNameSetup() {
    document.getElementById('name-setup-modal').classList.remove('visible');
}

function saveNames() {
    const momName = document.getElementById('mom-name-input').value.trim() || 'Mom';
    const dadName = document.getElementById('dad-name-input').value.trim() || 'Dad';
    const settings = getSettings();
    settings.personNames.Mom = momName;
    settings.personNames.Dad = dadName;
    saveSettings(settings);
    initWelcome();
    closeNameSetup();
    showSaveIndicator();
}

function selectPerson(person) {
    currentPerson = person;
    const displayName = getPersonDisplayName(person);
    document.getElementById('current-person-name').textContent = displayName + "'s Stories";
    showScreen('questions-screen');
    renderThemes();
    updateProgress();
}

function goHome() {
    currentPerson = null;
    currentTheme = null;
    stopRecording();
    showScreen('welcome-screen');
    initWelcome();
}

function goToThemes() {
    currentTheme = null;
    stopRecording();
    showScreen('questions-screen');
    updateProgress();
    renderThemes();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

function showBookExport() {
    const settings = getSettings();
    document.getElementById('include-mom-label').textContent = settings.personNames.Mom + "'s Stories";
    document.getElementById('include-dad-label').textContent = settings.personNames.Dad + "'s Stories";
    showScreen('book-screen');
}

function getStorageKey(person, themeId, questionId) {
    return `story_${person}_${themeId}_${questionId}`;
}

function getPhotoKey(person, themeId, questionId) {
    return `photo_${person}_${themeId}_${questionId}`;
}

function getCaptionKey(person, themeId, questionId) {
    return `caption_${person}_${themeId}_${questionId}`;
}

function getAudioKey(person, themeId, questionId) {
    return `audio_${person}_${themeId}_${questionId}`;
}

function getAnswer(person, themeId, questionId) {
    return localStorage.getItem(getStorageKey(person, themeId, questionId)) || '';
}

function getPhoto(person, themeId, questionId) {
    return localStorage.getItem(getPhotoKey(person, themeId, questionId)) || '';
}

function getCaption(person, themeId, questionId) {
    return localStorage.getItem(getCaptionKey(person, themeId, questionId)) || '';
}

function getAudio(person, themeId, questionId) {
    return localStorage.getItem(getAudioKey(person, themeId, questionId)) || '';
}

function saveAnswer(person, themeId, questionId, value) {
    localStorage.setItem(getStorageKey(person, themeId, questionId), value);
    showSaveIndicator();
}

function savePhoto(person, themeId, questionId, dataUrl) {
    try {
        localStorage.setItem(getPhotoKey(person, themeId, questionId), dataUrl);
        showSaveIndicator();
    } catch (e) {
        alert("This photo is too large to save. Please try a smaller image.");
    }
}

function saveCaption(person, themeId, questionId, value) {
    localStorage.setItem(getCaptionKey(person, themeId, questionId), value);
    showSaveIndicator();
}

function saveAudioData(person, themeId, questionId, dataUrl) {
    try {
        localStorage.setItem(getAudioKey(person, themeId, questionId), dataUrl);
        showSaveIndicator();
    } catch (e) {
        alert("This audio recording is too large to save. Please try a shorter recording.");
    }
}

function showSaveIndicator() {
    const indicator = document.getElementById('save-indicator');
    indicator.classList.remove('hidden');
    indicator.classList.add('visible');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        indicator.classList.remove('visible');
        indicator.classList.add('hidden');
    }, 2000);
}

function countAnswered(person) {
    let total = 0;
    let answered = 0;
    THEMES.forEach(theme => {
        theme.questions.forEach(q => {
            total++;
            if (getAnswer(person, theme.id, q.id).trim()) answered++;
        });
    });
    return { total, answered };
}

function countThemeAnswered(person, themeId) {
    const theme = THEMES.find(t => t.id === themeId);
    let answered = 0;
    theme.questions.forEach(q => {
        if (getAnswer(person, theme.id, q.id).trim()) answered++;
    });
    return { total: theme.questions.length, answered };
}

function updateProgress() {
    const { total, answered } = countAnswered(currentPerson);
    const pct = total > 0 ? (answered / total) * 100 : 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${answered} of ${total} questions answered`;
}

function renderThemes() {
    const container = document.getElementById('themes-container');
    container.innerHTML = '';

    THEMES.forEach(theme => {
        const { total, answered } = countThemeAnswered(currentPerson, theme.id);
        const card = document.createElement('div');
        card.className = 'theme-card';
        if (answered === total) card.classList.add('complete');
        card.onclick = () => openTheme(theme.id);

        card.innerHTML = `
            <div class="theme-icon">${theme.icon}</div>
            <div class="theme-info">
                <h3>${theme.title}</h3>
                <p>${theme.description}</p>
                <div class="theme-progress">
                    <div class="theme-progress-bar">
                        <div class="theme-progress-fill" style="width: ${(answered/total)*100}%"></div>
                    </div>
                    <span>${answered}/${total}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openTheme(themeId) {
    currentTheme = THEMES.find(t => t.id === themeId);
    document.getElementById('theme-title').textContent = currentTheme.title;
    document.getElementById('theme-description').textContent = currentTheme.description;
    showScreen('theme-screen');
    renderQuestions();
}

function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    currentTheme.questions.forEach((q, index) => {
        const answer = getAnswer(currentPerson, currentTheme.id, q.id);
        const photo = getPhoto(currentPerson, currentTheme.id, q.id);
        const caption = getCaption(currentPerson, currentTheme.id, q.id);
        const audio = getAudio(currentPerson, currentTheme.id, q.id);

        const card = document.createElement('div');
        card.className = 'question-card';
        if (answer.trim()) card.classList.add('answered');

        const photoHTML = photo
            ? `<div class="photo-preview">
                 <img src="${photo}" alt="Photo">
                 <button class="remove-photo" onclick="removePhoto('${currentTheme.id}', '${q.id}')">✕</button>
               </div>
               <input type="text" class="caption-input" placeholder="Add a caption — who's in this photo? When was it taken?"
                      value="${escapeAttr(caption)}"
                      oninput="handleCaption('${currentTheme.id}', '${q.id}', this.value)">`
            : '';

        const audioHTML = audio
            ? `<div class="audio-preview">
                 <audio controls src="${audio}"></audio>
                 <button class="remove-audio" onclick="removeAudio('${currentTheme.id}', '${q.id}')">✕ Remove recording</button>
               </div>`
            : '';

        const voiceBadge = q.voicePrompt
            ? `<div class="voice-prompt">🎙️ This one's extra special — try recording your voice so your family can hear you tell it.</div>`
            : '';

        const isRecording = recordingQuestionId === q.id;
        const recordBtnClass = isRecording ? 'record-btn recording' : 'record-btn';
        const recordBtnText = isRecording ? '⏹ Stop Recording' : '🎙️ Record Your Voice';

        card.innerHTML = `
            <div class="question-number">Question ${index + 1}</div>
            <label class="question-text" for="q-${q.id}">${q.text}</label>
            ${voiceBadge}
            <textarea
                id="q-${q.id}"
                placeholder="Take your time... write as much or as little as you'd like."
                oninput="handleInput('${currentTheme.id}', '${q.id}', this.value)"
            >${answer}</textarea>
            <div class="question-actions">
                <div class="photo-upload">
                    <label class="photo-btn">
                        📷 Add a Photo
                        <input type="file" accept="image/*" onchange="handlePhoto('${currentTheme.id}', '${q.id}', this)" hidden>
                    </label>
                </div>
                <button class="${recordBtnClass}" onclick="toggleRecording('${currentTheme.id}', '${q.id}')">
                    ${recordBtnText}
                </button>
            </div>
            ${photoHTML}
            ${audioHTML}
        `;
        container.appendChild(card);
    });
}

function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function handleInput(themeId, questionId, value) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveAnswer(currentPerson, themeId, questionId, value);
        updateProgress();
        const card = document.getElementById('q-' + questionId).closest('.question-card');
        if (value.trim()) {
            card.classList.add('answered');
        } else {
            card.classList.remove('answered');
        }
        renderThemes();
        renderQuestions();
    }, 800);
}

function handleCaption(themeId, questionId, value) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveCaption(currentPerson, themeId, questionId, value);
    }, 500);
}

function handlePhoto(themeId, questionId, input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxSize = 800;
            let width = img.width;
            let height = img.height;

            if (width > height && width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            } else if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            savePhoto(currentPerson, themeId, questionId, dataUrl);
            renderQuestions();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removePhoto(themeId, questionId) {
    localStorage.removeItem(getPhotoKey(currentPerson, themeId, questionId));
    localStorage.removeItem(getCaptionKey(currentPerson, themeId, questionId));
    renderQuestions();
    showSaveIndicator();
}

function removeAudio(themeId, questionId) {
    localStorage.removeItem(getAudioKey(currentPerson, themeId, questionId));
    renderQuestions();
    showSaveIndicator();
}

async function toggleRecording(themeId, questionId) {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopRecording();
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunks = [];
        recordingQuestionId = questionId;

        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            stream.getTracks().forEach(t => t.stop());
            const blob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onload = () => {
                saveAudioData(currentPerson, themeId, questionId, reader.result);
                recordingQuestionId = null;
                renderQuestions();
            };
            reader.readAsDataURL(blob);
        };

        mediaRecorder.start(1000);

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            let finalTranscript = getAnswer(currentPerson, themeId, questionId);
            if (finalTranscript.trim()) finalTranscript += '\n\n';

            recognition.onresult = (event) => {
                let interim = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                const textarea = document.getElementById('q-' + questionId);
                if (textarea) {
                    textarea.value = finalTranscript + interim;
                    saveAnswer(currentPerson, themeId, questionId, finalTranscript + interim);
                }
            };

            recognition.onerror = () => {};
            recognition.onend = () => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    try { recognition.start(); } catch(e) {}
                }
            };

            recognition.start();
        }

        renderQuestions();

    } catch (err) {
        alert("Could not access your microphone. Please allow microphone access and try again.");
        recordingQuestionId = null;
    }
}

function stopRecording() {
    if (recognition) {
        try { recognition.stop(); } catch(e) {}
        recognition = null;
    }
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    } else {
        recordingQuestionId = null;
    }
}

function exportData() {
    const data = { version: 2, exportDate: new Date().toISOString(), settings: getSettings(), entries: {} };

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('story_') || key.startsWith('photo_') || key.startsWith('caption_') || key.startsWith('audio_')) {
            data.entries[key] = localStorage.getItem(key);
        }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-story-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('import-file-input').click();
}

function handleImport(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.entries) {
                alert("This doesn't look like a valid backup file.");
                return;
            }

            if (!confirm(`This will restore a backup from ${new Date(data.exportDate).toLocaleDateString()}. Any existing answers will be overwritten. Continue?`)) {
                return;
            }

            if (data.settings) saveSettings(data.settings);

            for (const [key, value] of Object.entries(data.entries)) {
                localStorage.setItem(key, value);
            }

            alert("Backup restored successfully!");
            initWelcome();
            if (currentPerson) {
                renderThemes();
                updateProgress();
            }
        } catch (err) {
            alert("Could not read backup file. Please make sure it's the correct file.");
        }
    };
    reader.readAsText(file);
    input.value = '';
}

document.addEventListener('DOMContentLoaded', initWelcome);
