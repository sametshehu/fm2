// Firebase-Konfiguration
firebase.initializeApp(firebaseConfig);
const financeCollection = db.collection("finances");

document.getElementById("openAddFinanceModalButton").addEventListener("click", () => {
    document.getElementById("addFinanceModal").style.display = "block";
});

document.getElementById("closeAddFinanceModal").addEventListener("click", () => {
    document.getElementById("addFinanceModal").style.display = "none";
});

// Handle finance form submission
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