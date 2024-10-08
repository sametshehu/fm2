// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const financeCollection = db.collection("finances");

// Finanztransaktionen anzeigen
const financesTable = document.getElementById("finances");
const loadingFinanceMessage = document.getElementById("loadingFinanceMessage");

// Lade Finanztransaktionen aus Firebase
financeCollection.onSnapshot((snapshot) => {
    if (snapshot.empty) {
        console.log("Keine Finanztransaktionen in der Datenbank vorhanden.");
        loadingFinanceMessage.textContent = "Keine Finanztransaktionen gefunden.";
        return;
    }

    // Verstecke die Ladeanzeige
    loadingFinanceMessage.style.display = "none";

    // Lösche vorhandene Einträge in der Tabelle
    financesTable.innerHTML = "";

    // Durchlaufe die Datenbankeinträge
    snapshot.forEach((doc) => {
        const finance = doc.data();
        console.log("Finanzdaten erhalten:", finance);

        // Erstelle eine neue Tabellenzeile
        const tr = document.createElement("tr");

        // Erstelle die einzelnen Zellen der Tabellenzeile
        tr.innerHTML = `
            <td>${finance.date}</td>
            <td>${finance.category}</td>
            <td>${finance.note}</td>
            <td>${finance.amount}</td>
            <td>${finance.yearlyFee}</td>
            <td>${finance.type}</td>
            <td>${finance.account}</td>
        `;

        financesTable.appendChild(tr);
    });
}, (error) => {
    console.error("Fehler beim Abrufen der Finanztransaktionen: ", error);
    loadingFinanceMessage.textContent = "Fehler beim Laden der Finanztransaktionen.";
});
