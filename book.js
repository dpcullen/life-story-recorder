function generateBook() {
    const includeMom = document.getElementById('include-mom').checked;
    const includeDad = document.getElementById('include-dad').checked;
    const includeGrandma = document.getElementById('include-grandma').checked;

    if (!includeMom && !includeDad && !includeGrandma) {
        alert("Please select at least one person to include.");
        return;
    }

    const people = [];
    if (includeMom) people.push('Mom');
    if (includeDad) people.push('Dad');
    if (includeGrandma) people.push('Grandma');

    const settings = getSettings();

    let bookHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Our Family Story</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Open+Sans:wght@400;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Merriweather', serif;
            color: #2c2c2c;
            line-height: 1.8;
            background: white;
        }

        @media print {
            body { font-size: 11pt; }
            .page-break { page-break-before: always; }
            .no-print { display: none !important; }
            @page { margin: 1in; }
            audio { display: none; }
        }

        @media screen {
            body { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        }

        .cover {
            text-align: center;
            padding: 100px 40px;
            min-height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .cover h1 {
            font-size: 3em;
            font-weight: 700;
            margin-bottom: 20px;
            color: #1a1a1a;
        }

        .cover .subtitle {
            font-size: 1.3em;
            font-weight: 300;
            color: #555;
            font-style: italic;
        }

        .cover .featuring {
            margin-top: 40px;
            font-size: 1.1em;
            color: #666;
        }

        .cover .date {
            margin-top: 60px;
            font-size: 0.9em;
            color: #888;
        }

        .person-section {
            margin-top: 60px;
        }

        .person-title {
            text-align: center;
            font-size: 2.2em;
            margin-bottom: 40px;
            padding: 40px 0;
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
        }

        .theme-section {
            margin: 50px 0;
        }

        .theme-heading {
            font-size: 1.6em;
            color: #2c2c2c;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
        }

        .question-block {
            margin: 30px 0;
        }

        .question-prompt {
            font-weight: 700;
            font-size: 1em;
            color: #444;
            margin-bottom: 8px;
        }

        .question-answer {
            font-weight: 300;
            font-size: 1em;
            white-space: pre-wrap;
            line-height: 2;
        }

        .question-photo {
            margin: 15px 0;
            text-align: center;
        }

        .question-photo img {
            max-width: 100%;
            max-height: 500px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .photo-caption {
            font-size: 0.85em;
            color: #666;
            font-style: italic;
            margin-top: 8px;
            text-align: center;
        }

        .audio-note {
            font-size: 0.85em;
            color: #888;
            font-style: italic;
            margin-top: 5px;
        }

        .audio-note audio {
            display: block;
            margin-top: 8px;
        }

        .separator {
            text-align: center;
            margin: 40px 0;
            color: #ccc;
            font-size: 1.5em;
        }

        .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
        }

        .print-btn {
            background: #2c5f2d;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.1em;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Open Sans', sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .print-btn:hover { background: #1e4620; }

        .audio-btn {
            background: #8b6914;
        }

        .audio-btn:hover { background: #6d5310; }
    </style>
</head>
<body>
    <div class="print-controls no-print">
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>

    <div class="cover">
        <h1>Our Family Story</h1>
        <p class="subtitle">A collection of memories, stories, and wisdom</p>
        <p class="featuring">Featuring the stories of ${people.map(p => settings.personNames[p]).join(' & ')}</p>
        <p class="date">Created with love, ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
    </div>
`;

    let hasAnyAudio = false;

    people.forEach(person => {
        const displayName = settings.personNames[person];
        bookHTML += `<div class="page-break person-section">`;
        bookHTML += `<h2 class="person-title">${displayName}'s Story</h2>`;

        THEMES.forEach(theme => {
            const answeredQuestions = theme.questions.filter(q =>
                getAnswer(person, theme.id, q.id).trim()
            );

            if (answeredQuestions.length === 0) return;

            bookHTML += `<div class="theme-section page-break">`;
            bookHTML += `<h3 class="theme-heading">${theme.icon} ${theme.title}</h3>`;

            answeredQuestions.forEach((q, i) => {
                const answer = getAnswer(person, theme.id, q.id);
                const photo = getPhoto(person, theme.id, q.id);
                const caption = getCaption(person, theme.id, q.id);
                const audio = getAudio(person, theme.id, q.id);

                bookHTML += `<div class="question-block">`;
                bookHTML += `<p class="question-prompt">${q.text}</p>`;
                bookHTML += `<p class="question-answer">${escapeHtml(answer)}</p>`;

                if (photo) {
                    bookHTML += `<div class="question-photo"><img src="${photo}" alt="Photo">`;
                    if (caption) {
                        bookHTML += `<p class="photo-caption">${escapeHtml(caption)}</p>`;
                    }
                    bookHTML += `</div>`;
                }

                if (audio) {
                    hasAnyAudio = true;
                    bookHTML += `<p class="audio-note no-print">🎙️ Voice recording available: <audio controls src="${audio}"></audio></p>`;
                }

                bookHTML += `</div>`;

                if (i < answeredQuestions.length - 1) {
                    bookHTML += `<div class="separator">· · ·</div>`;
                }
            });

            bookHTML += `</div>`;
        });

        bookHTML += `</div>`;
    });

    bookHTML += `</body></html>`;

    const bookWindow = window.open('', '_blank');
    bookWindow.document.write(bookHTML);
    bookWindow.document.close();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
