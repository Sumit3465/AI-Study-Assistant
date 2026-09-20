const API_URL = "http://127.0.0.1:8000";

let conversationId = null;


async function askQuestion() {
    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer");

    if (!question) {
        answer.textContent = "Please enter a question.";
        return;
    }

    answer.textContent = "Thinking...";

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
            throw new Error(data.detail || "Unable to process the question.");
        }

        conversationId = data.conversation_id;
        answer.textContent = data.answer;

    } catch (error) {
        answer.textContent = error.message;
    }
}


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
            throw new Error(data.detail || "Unable to generate summary.");
        }

        summary.textContent = data.summary;

    } catch (error) {
        summary.textContent = error.message;
    }
}


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
            throw new Error(data.detail || "Unable to generate quiz.");
        }

        quiz.textContent = data.quiz;

    } catch (error) {
        quiz.textContent = error.message;
    }
}


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

        revision.textContent = data.notes;

    } catch (error) {
        revision.textContent = error.message;
    }
}