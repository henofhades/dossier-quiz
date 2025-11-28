// --- QUIZ ENGINE ---

// Salva una risposta
function selectOption(question, value) {
    localStorage.setItem(question, value);

    // Evidenzia l’opzione selezionata
    const opts = document.querySelectorAll(".opt");
    opts.forEach(o => o.classList.remove("selected"));
    event.target.classList.add("selected");
}

// Vai a una pagina
function goTo(page) {
    window.location.href = page + ".html";
}

// Alla apertura della pagina evidenzia l’opzione eventualmente già scelta
window.onload = function() {
    const question = document.body.dataset.question;
    if (!question) return;

    const saved = localStorage.getItem(question);
    if (!saved) return;

    document.querySelectorAll(".opt").forEach(o => {
        if (o.dataset.value === saved) o.classList.add("selected");
    });
};

// Calcolo risultato
function generateResult() {

    const responses = [];
    for (let i = 1; i <= 15; i++) {
        responses.push(localStorage.getItem("q" + i));
    }

    // Punteggio semplice: A=4 B=3 C=2 D=1
    const scoreMap = { "A":4, "B":3, "C":2, "D":1 };

    let total = 0;
    responses.forEach(r => {
        if (r) total += scoreMap[r];
    });

    // Interpretazione finale
    let outcome = "";
    if (total >= 50) {
        outcome = "Profilo: **Operatore Alfa** – Disciplina, efficienza e controllo totale.";
    } else if (total >= 40) {
        outcome = "Profilo: **Funzionario Gamma** – Affidabile, tattico, collaborativo.";
    } else if (total >= 30) {
        outcome = "Profilo: **Analista Delta** – Valutatore prudente, orientato alla logica.";
    } else {
        outcome = "Profilo: **Soggetto Beta** – Tendenza all’individualismo e alla deviazione.";
    }

    document.getElementById("score").innerHTML = total;
    document.getElementById("outcome").innerHTML = outcome;

    // Pulisce i dati dopo la visualizzazione
    localStorage.clear();
}
