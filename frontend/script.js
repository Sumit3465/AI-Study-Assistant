const API_URL = "http://127.0.0.1:8000";

let conversationId = null;


/* =========================
   NAVIGATION
========================= */

function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    const navItems = document.querySelectorAll(".nav-item");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    navItems.forEach(item => {
        const onclickValue = item.getAttribute("onclick");

        if (onclickValue && onclickValue.includes(`'${sectionId}'`)) {
            item.classList.add("active");
        }
    });

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        if (sectionId === "dashboard") {
            pageTitle.textContent = "Good to see you.";
        } else if (sectionId === "ask") {
            pageTitle.textContent = "Ask your AI assistant.";
        } else if (sectionId === "tools") {
            pageTitle.textContent = "Study smarter.";
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   ASK AI
========================= */

async function askQuestion() {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if (!question) {
        answer.innerHTML = `
            <div class="empty-state">
                <span>!</span>
                <h3>Please enter a question</h3>
                <p>Ask something about your study material.</p>
            </div>
        `;
        return;
    }

    answer.innerHTML = `
        <div class="empty-state">
            <span>✦</span>
            <h3>Thinking...</h3>
            <p>Searching your study material and generating an answer.</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/api/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question,
                conversation_id: conversationId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to process the question."
            );
        }

        conversationId = data.conversation_id;

        answer.innerHTML = `
            <div class="ai-answer">
                ${formatResponse(data.answer)}
            </div>
        `;

    } catch (error) {
        answer.innerHTML = `
            <div class="empty-state">
                <span>!</span>
                <h3>Something went wrong</h3>
                <p>${escapeHtml(error.message)}</p>
            </div>
        `;
    }
}


/* =========================
   SUMMARIZE
========================= */

async function summarizeTopic() {
    const topic = document.getElementById("summaryTopic").value.trim();
    const summary = document.getElementById("summary");

    if (!topic) {
        summary.textContent = "Please enter a topic.";
        return;
    }

    summary.textContent = "Generating summary...";

    try {
        const response = await fetch(`${API_URL}/api/summarize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic: topic
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to generate summary."
            );
        }

        summary.innerHTML = formatResponse(data.summary);

    } catch (error) {
        summary.textContent = error.message;
    }
}


/* =========================
   QUIZ
========================= */

async function generateQuiz() {
    const topic = document.getElementById("quizTopic").value.trim();
    const quiz = document.getElementById("quiz");

    if (!topic) {
        quiz.textContent = "Please enter a topic.";
        return;
    }

    quiz.textContent = "Generating quiz...";

    try {
        const response = await fetch(`${API_URL}/api/quiz`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic: topic
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to generate quiz."
            );
        }

        quiz.innerHTML = formatResponse(data.quiz);

    } catch (error) {
        quiz.textContent = error.message;
    }
}


/* =========================
   REVISION NOTES
========================= */

async function generateRevisionNotes() {
    const topic = document.getElementById("revisionTopic").value.trim();
    const revision = document.getElementById("revision");

    if (!topic) {
        revision.textContent = "Please enter a topic.";
        return;
    }

    revision.textContent = "Generating revision notes...";

    try {
        const response = await fetch(`${API_URL}/api/revision-notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic: topic
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Unable to generate revision notes."
            );
        }

        revision.innerHTML = formatResponse(data.notes);

    } catch (error) {
        revision.textContent = error.message;
    }
}


/* =========================
   RESPONSE FORMATTING
========================= */

function formatResponse(text) {
    if (!text) {
        return "";
    }

    return escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/^### (.*)$/gm, "<h4>$1</h4>")
        .replace(/^## (.*)$/gm, "<h3>$1</h3>")
        .replace(/^# (.*)$/gm, "<h3>$1</h3>")
        .replace(/\n/g, "<br>");
}


function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


/* =========================
   ENTER KEY SUPPORT
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const questionInput = document.getElementById("question");

    if (questionInput) {
        questionInput.addEventListener("keydown", event => {

            if (event.key === "Enter" && event.ctrlKey) {
                event.preventDefault();
                askQuestion();
            }

        });
    }

    showSection("dashboard");
});