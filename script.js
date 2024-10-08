// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const membersCollection = db.collection("members");

// Mitgliederliste anzeigen
const membersTable = document.getElementById("members");
const loadingMessage = document.getElementById("loadingMessage");

// Lade Mitglieder aus Firebase
membersCollection.onSnapshot((snapshot) => {
    if (snapshot.empty) {
        console.log("Keine Mitglieder in der Datenbank vorhanden.");
        loadingMessage.textContent = "Keine Mitglieder gefunden.";
        return;
    }

    // Verstecke die Ladeanzeige
    loadingMessage.style.display = "none";

    // Lösche vorhandene Einträge in der Tabelle
    membersTable.innerHTML = "";

    // Durchlaufe die Datenbankeinträge
    snapshot.forEach((doc) => {
        const member = doc.data();
        console.log("Mitgliedsdaten erhalten:", member);

        // Erstelle eine neue Tabellenzeile
        const tr = document.createElement("tr");

        // Erstelle die einzelnen Zellen der Tabellenzeile
        tr.innerHTML = `
            <td>${member.memberNumber}</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.address}</td>
            <td>${member.zip}</td>
            <td>${member.city}</td>
        `;

        membersTable.appendChild(tr);
    });
}, (error) => {
    console.error("Fehler beim Abrufen der Mitgliederliste: ", error);
    loadingMessage.textContent = "Fehler beim Laden der Mitglieder.";
});
