const API_URL = "";

let conversationId = null;

/* =========================
   AUTH GUARD
========================= */

function getToken() {
    return localStorage.getItem("studyai_token");
}

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

function logout() {
    localStorage.removeItem("studyai_token");
    localStorage.removeItem("studyai_name");
    localStorage.removeItem("studyai_email");
    window.location.href = "/";
}

// Redirect to login if not authenticated
if (!getToken()) {
    window.location.href = "/";
}


/* =========================
   NAVIGATION
========================= */

function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    const navItems = document.querySelectorAll(".nav-item");

    sections.forEach(section => section.classList.remove("active-section"));

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) selectedSection.classList.add("active-section");

    navItems.forEach(item => item.classList.remove("active"));
    navItems.forEach(item => {
        const onclickValue = item.getAttribute("onclick");
        if (onclickValue && onclickValue.includes(`'${sectionId}'`)) {
            item.classList.add("active");
        }
    });

    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) {
        if (sectionId === "dashboard") pageTitle.textContent = `Good to see you, ${localStorage.getItem("studyai_name") || "there"}.`;
        else if (sectionId === "ask") pageTitle.textContent = "Ask your AI assistant.";
        else if (sectionId === "tools") pageTitle.textContent = "Study smarter.";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =========================
   ASK AI
========================= */

async function askQuestion() {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if (!question) {
        showError(answer, "No question entered", "Please enter a question about your study material.");
        return;
    }

    showLoading(answer);

    try {
        const response = await fetch(`${API_URL}/api/ask`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ question, conversation_id: conversationId })
        });

        if (response.status === 401) { logout(); return; }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Unable to process the question.");
        }

        conversationId = data.conversation_id;

        answer.innerHTML = `
            <div class="ai-response-wrapper">
                <div class="grounding-indicator">
                    <span class="grounding-icon">📚</span>
                    <div>
                        <strong>Grounded response</strong>
                        <span>Based on your connected study material</span>
                    </div>
                </div>
                <div class="ai-answer">${formatResponse(data.answer)}</div>
            </div>
        `;

    } catch (error) {
        showError(answer, "Unable to generate a response", error.message || "Something went wrong.");
    }
}


/* =========================
   SUMMARIZE
========================= */

async function summarizeTopic() {
    const topic = document.getElementById("summaryTopic").value.trim();
    const summary = document.getElementById("summary");

    if (!topic) { summary.textContent = "Please enter a topic."; return; }

    summary.innerHTML = `<div class="tool-loading"><span class="loader"></span><span>Generating summary...</span></div>`;

    try {
        const response = await fetch(`${API_URL}/api/summarize`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ topic })
        });

        if (response.status === 401) { logout(); return; }

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to generate summary.");

        summary.innerHTML = formatResponse(data.summary);

    } catch (error) {
        summary.innerHTML = `<div class="tool-error"><strong>Unable to generate summary</strong><span>${escapeHtml(error.message)}</span></div>`;
    }
}


/* =========================
   QUIZ
========================= */

async function generateQuiz() {
    const topic = document.getElementById("quizTopic").value.trim();
    const quiz = document.getElementById("quiz");

    if (!topic) { quiz.textContent = "Please enter a topic."; return; }

    quiz.innerHTML = `<div class="tool-loading"><span class="loader"></span><span>Generating quiz...</span></div>`;

    try {
        const response = await fetch(`${API_URL}/api/quiz`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ topic })
        });

        if (response.status === 401) { logout(); return; }

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to generate quiz.");

        quiz.innerHTML = formatResponse(data.quiz);

    } catch (error) {
        quiz.innerHTML = `<div class="tool-error"><strong>Unable to generate quiz</strong><span>${escapeHtml(error.message)}</span></div>`;
    }
}


/* =========================
   REVISION NOTES
========================= */

async function generateRevisionNotes() {
    const topic = document.getElementById("revisionTopic").value.trim();
    const revision = document.getElementById("revision");

    if (!topic) { revision.textContent = "Please enter a topic."; return; }

    revision.innerHTML = `<div class="tool-loading"><span class="loader"></span><span>Generating revision notes...</span></div>`;

    try {
        const response = await fetch(`${API_URL}/api/revision-notes`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ topic })
        });

        if (response.status === 401) { logout(); return; }

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Unable to generate revision notes.");

        revision.innerHTML = formatResponse(data.notes);

    } catch (error) {
        revision.innerHTML = `<div class="tool-error"><strong>Unable to generate revision notes</strong><span>${escapeHtml(error.message)}</span></div>`;
    }
}


/* =========================
   AI RESPONSE LOADING
========================= */

function showLoading(container) {
    container.innerHTML = `
        <div class="ai-loading">
            <div class="ai-loading-icon"><span>✦</span></div>
            <div class="loading-content">
                <strong>Thinking...</strong>
                <span>Searching your study material and generating a grounded response.</span>
                <div class="loading-dots"><span></span><span></span><span></span></div>
            </div>
        </div>
    `;
}


/* =========================
   ERROR STATE
========================= */

function showError(container, title, message) {
    container.innerHTML = `
        <div class="ai-error">
            <div class="error-icon">⚠</div>
            <div class="error-content">
                <strong>${escapeHtml(title)}</strong>
                <span>${escapeHtml(message)}</span>
                <button class="retry-button" onclick="askQuestion()">Try again</button>
            </div>
        </div>
    `;
}


/* =========================
   COPY RESPONSE
========================= */

function copyAnswer() {
    const answer = document.getElementById("answer");
    const copyButton = document.querySelector(".copy-button");
    if (!answer || !copyButton) return;

    const text = answer.innerText.trim();
    if (!text) return;

    navigator.clipboard.writeText(text)
        .then(() => {
            const orig = copyButton.textContent;
            copyButton.textContent = "Copied!";
            setTimeout(() => { copyButton.textContent = orig; }, 1500);
        })
        .catch(() => {
            copyButton.textContent = "Failed";
            setTimeout(() => { copyButton.textContent = "Copy"; }, 1500);
        });
}


/* =========================
   RESPONSE FORMATTING
========================= */

function formatResponse(text) {
    if (!text) return "";

    let formatted = escapeHtml(text);

    formatted = formatted
        .replace(/^### (.*)$/gm, "<h4>$1</h4>")
        .replace(/^## (.*)$/gm, "<h3>$1</h3>")
        .replace(/^# (.*)$/gm, "<h3>$1</h3>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/^\s*[-*]\s+(.*)$/gm, "<li>$1</li>")
        .replace(/^\s*(\d+)\.\s+(.*)$/gm, "<li><strong>$1.</strong> $2</li>");

    formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    formatted = formatted.replace(/<\/ul>\s*<ul>/g, "");
    formatted = formatted.replace(/\n{2,}/g, "</p><p>");
    formatted = formatted.replace(/\n/g, "<br>");

    return `<div class="formatted-response"><p>${formatted}</p></div>`;
}


/* =========================
   HTML ESCAPING
========================= */

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


/* =========================
   ENTER KEY SUPPORT
========================= */

document.addEventListener("DOMContentLoaded", () => {
    // Set user name in greeting
    const name = localStorage.getItem("studyai_name");
    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle && name) {
        pageTitle.textContent = `Good to see you, ${name}.`;
    }

    // Set user info in sidebar if element exists
    const userNameEl = document.getElementById("sidebarUserName");
    const userEmailEl = document.getElementById("sidebarUserEmail");
    if (userNameEl) userNameEl.textContent = name || "";
    if (userEmailEl) userEmailEl.textContent = localStorage.getItem("studyai_email") || "";

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
