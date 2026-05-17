function generateBook() {
    const includeMom = document.getElementById('include-mom').checked;
    const includeDad = document.getElementById('include-dad').checked;

    if (!includeMom && !includeDad) {
        alert("Please select at least one person to include.");
        return;
    }

    const people = [];
    if (includeMom) people.push('Mom');
    if (includeDad) people.push('Dad');

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
            .no-print { display: none; }
            @page { margin: 1in; }
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

        .cover .date {
            margin-top: 60px;
            font-size: 0.9em;
            color: #888;
        }

        .toc {
            padding: 40px 0;
        }

        .toc h2 {
            font-size: 1.8em;
            margin-bottom: 30px;
            text-align: center;
        }

        .toc ul {
            list-style: none;
            padding: 0;
        }

        .toc li {
            padding: 8px 0;
            border-bottom: 1px dotted #ccc;
            font-size: 1.1em;
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
            padding-left: 0;
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

        .separator {
            text-align: center;
            margin: 40px 0;
            color: #ccc;
            font-size: 1.5em;
        }

        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
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
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>

    <div class="cover">
        <h1>Our Family Story</h1>
        <p class="subtitle">A collection of memories, stories, and wisdom</p>
        <p class="date">Created with love, ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
    </div>
`;

    people.forEach(person => {
        bookHTML += `<div class="page-break person-section">`;
        bookHTML += `<h2 class="person-title">${person}'s Story</h2>`;

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

                bookHTML += `<div class="question-block">`;
                bookHTML += `<p class="question-prompt">${q.text}</p>`;
                bookHTML += `<p class="question-answer">${escapeHtml(answer)}</p>`;

                if (photo) {
                    bookHTML += `<div class="question-photo"><img src="${photo}" alt="Photo"></div>`;
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
