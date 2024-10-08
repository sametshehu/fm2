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
        await financeCollection.add(finance);
        document.getElementById("addFinanceForm").reset();
        document.getElementById("addFinanceModal").style.display = "none";
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Finanzdatensatzes: ", error);
    }
});
v
