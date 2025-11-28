console.log("Quiz attivo");

function saveAnswer(question, value) {
    localStorage.setItem("q" + question, value);
    if (question < 15) {
        window.location.href = "q" + (question + 1) + ".html";
    } else {
        window.location.href = "result.html";
    }
}

function calculateResult() {
    let score = 0;

    for (let i = 1; i <= 15; i++) {
        score += parseInt(localStorage.getItem("q" + i) || 0);
    }

    let role = "";

    if (score <= 20) {
        role = "Unità Dipendente – Profilo emotivamente fragile. Adatto a compiti controllati.";
    } else if (score <= 33) {
        role = "Unità Collaborativa – Equilibrato, utile in squadre operative.";
    } else {
        role = "Unità Strategica – Forte autonomia, capacità decisionali elevate.";
    }

    document.getElementById("scoreText").innerText = "Punteggio totale: " + score;
    document.getElementById("roleText").innerText = "Assegnazione: " + role;

    localStorage.clear();
}
