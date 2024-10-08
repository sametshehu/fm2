// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyD5asuJN_0f_wcP3KidUqAYyEsCvtPaIeI",
    authDomain: "mitgliederverwaltung-3458b.firebaseapp.com",
    projectId: "mitgliederverwaltung-3458b",
    storageBucket: "mitgliederverwaltung-3458b.appspot.com",
    messagingSenderId: "916656812587",
    appId: "1:916656812587:web:23b510f805c800f62af06e"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const financeCollection = db.collection("finances");

// Debugging: Firebase initialisiert
console.log("Firebase wurde erfolgreich initialisiert.");

// Modal öffnen/schließen
document.getElementById("openAddFinanceModalButton").addEventListener("click", () => {
    document.getElementById("addFinanceModal").style.display = "block";
});
document.getElementById("closeAddFinanceModal").addEventListener("click", () => {
    document.getElementById("addFinanceModal").style.display = "none";
});

// Neues Finanzdatensatz hinzufügen
document.getElementById("addFinanceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const finance = {
        date: document.getElementById("financeDate").value,
        category: document.getElementById("financeCategory").value,
        note: document.getElementById("financeNote").value,
        amount: parseFloat(document.getElementById("financeAmount").value),
        yearlyFee: parseFloat(document.getElementById("financeYearlyFee").value),
        type: document.getElementById("financeType").value,
        account: document.getElementById("financeAccount").value
    };
    try {
        console.log("Neuer Finanzdatensatz wird hinzugefügt:", finance);
        await financeCollection.add(finance);
        document.getElementById("addFinanceForm").reset();
        document.getElementById("addFinanceModal").style.display = "none";
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Finanzdatensatzes: ", error);
    }
});

// Exportieren der Finanzdaten
document.getElementById("exportFinanceButton").addEventListener("click", async () => {
    try {
        const snapshot = await financeCollection.get();
        const financeData = [];
        snapshot.forEach((doc) => {
            financeData.push(doc.data());
        });

        console.log("Exportierte Daten:", financeData);
        const worksheet = XLSX.utils.json_to_sheet(financeData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Finanzen");
        XLSX.writeFile(workbook, "Finanzen.xlsx");
    } catch (error) {
        console.error("Fehler beim Exportieren der Finanzdaten: ", error);
    }
});

// Importieren der Finanzdaten mit Debugging
document.getElementById("importFinanceFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) {
        console.log("Keine Datei ausgewählt.");
        return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            console.log("Datei erfolgreich gelesen.");
            const data = new Uint8Array(event.target.result);
            console.log("Daten aus der Datei:", data);

            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const financeData = XLSX.utils.sheet_to_json(worksheet);

            console.log("Importierte Finanzdaten:", financeData);

            for (const finance of financeData) {
                await financeCollection.add(finance);
            }
            alert("Finanzdaten erfolgreich importiert.");
        } catch (error) {
            console.error("Fehler beim Importieren der Finanzdaten: ", error);
        }
    };
    reader.readAsArrayBuffer(file);
    console.log("Datei wird gelesen...");
});
