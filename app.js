let currentPerson = null;
let currentTheme = null;
let saveTimeout = null;

function selectPerson(person) {
    currentPerson = person;
    document.getElementById('current-person-name').textContent = person + "'s Stories";
    showScreen('questions-screen');
    renderThemes();
    updateProgress();
}

function goHome() {
    currentPerson = null;
    currentTheme = null;
    showScreen('welcome-screen');
}

function goToThemes() {
    currentTheme = null;
    showScreen('questions-screen');
    updateProgress();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

function showBookExport() {
    showScreen('book-screen');
}

function getStorageKey(person, themeId, questionId) {
    return `story_${person}_${themeId}_${questionId}`;
}

function getPhotoKey(person, themeId, questionId) {
    return `photo_${person}_${themeId}_${questionId}`;
}

function getAnswer(person, themeId, questionId) {
    return localStorage.getItem(getStorageKey(person, themeId, questionId)) || '';
}

function getPhoto(person, themeId, questionId) {
    return localStorage.getItem(getPhotoKey(person, themeId, questionId)) || '';
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

        const card = document.createElement('div');
        card.className = 'question-card';
        if (answer.trim()) card.classList.add('answered');

        const photoPreview = photo ? `<div class="photo-preview"><img src="${photo}" alt="Photo"><button class="remove-photo" onclick="removePhoto('${currentTheme.id}', '${q.id}', this)">✕</button></div>` : '';

        card.innerHTML = `
            <div class="question-number">Question ${index + 1}</div>
            <label class="question-text" for="q-${q.id}">${q.text}</label>
            <textarea
                id="q-${q.id}"
                placeholder="Take your time... write as much or as little as you'd like."
                oninput="handleInput('${currentTheme.id}', '${q.id}', this.value)"
            >${answer}</textarea>
            ${photoPreview}
            <div class="photo-upload">
                <label class="photo-btn">
                    📷 Add a Photo
                    <input type="file" accept="image/*" onchange="handlePhoto('${currentTheme.id}', '${q.id}', this)" hidden>
                </label>
            </div>
        `;
        container.appendChild(card);
    });
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

function removePhoto(themeId, questionId, btn) {
    localStorage.removeItem(getPhotoKey(currentPerson, themeId, questionId));
    renderQuestions();
    showSaveIndicator();
}
