const firebaseConfig = { /* Firebase config */ };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const financeCollection = db.collection("finances");

// Neues Finanzdatensatz hinzufügen
document.getElementById("addFinanceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = document.getElementById("financeDate").value;
    const category = document.getElementById("financeCategory").value;
    const note = document.getElementById("financeNote").value;
    const amount = parseFloat(document.getElementById("financeAmount").value);
    const yearlyFee = parseFloat(document.getElementById("financeYearlyFee").value);
    const type = document.getElementById("financeType").value;
    const account = document.getElementById("financeAccount").value;

    try {
        await financeCollection.add({ date, category, note, amount, yearlyFee, type, account });
        document.getElementById("addFinanceForm").reset();
        document.getElementById("addFinanceModal").style.display = "none";
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Finanzdatensatzes: ", error);
    }
});

// Finanzliste anzeigen
financeCollection.onSnapshot((snapshot) => {
    const financesTable = document.getElementById("finances");
    if (snapshot.empty) {
        document.getElementById("loadingFinanceMessage").textContent = "Keine Finanztransaktionen gefunden.";
        return;
    }

    financesTable.innerHTML = "";
    document.getElementById("loadingFinanceMessage").style.display = "none";

    snapshot.forEach((doc) => {
        const finance = doc.data();
        const tr = document.createElement("tr");
        tr.setAttribute("data-id", doc.id);

        const dateTd = document.createElement("td");
        dateTd.textContent = finance.date;
        tr.appendChild(dateTd);

        const categoryTd = document.createElement("td");
        categoryTd.textContent = finance.category;
        tr.appendChild(categoryTd);

        const noteTd = document.createElement("td");
        noteTd.textContent = finance.note;
        tr.appendChild(noteTd);

        const amountTd = document.createElement("td");
        amountTd.textContent = finance.amount;
        tr.appendChild(amountTd);

        const yearlyFeeTd = document.createElement("td");
        yearlyFeeTd.textContent = finance.yearlyFee;
        tr.appendChild(yearlyFeeTd);

        const typeTd = document.createElement("td");
        typeTd.textContent = finance.type;
        tr.appendChild(typeTd);

        const accountTd = document.createElement("td");
        accountTd.textContent = finance.account;
        tr.appendChild(accountTd);

        const actionsTd = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Bearbeiten";
        editButton.addEventListener("click", () => openEditFinanceModal(doc.id, finance));
        actionsTd.appendChild(editButton);
        tr.appendChild(actionsTd);

        financesTable.appendChild(tr);
    });
}, (error) => {
    console.error("Fehler beim Abrufen der Finanztransaktionen: ", error);
    document.getElementById("loadingFinanceMessage").textContent = "Fehler beim Laden der Finanztransaktionen.";
});

// Bearbeiten-Modul öffnen
function openEditFinanceModal(id, finance) {
    currentEditFinanceId = id;
    document.getElementById("editFinanceDate").value = finance.date;
    document.getElementById("editFinanceCategory").value = finance.category;
    document.getElementById("editFinanceNote").value = finance.note;
    document.getElementById("editFinanceAmount").value = finance.amount;
    document.getElementById("editFinanceYearlyFee").value = finance.yearlyFee;
    document.getElementById("editFinanceType").value = finance.type;
    document.getElementById("editFinanceAccount").value = finance.account;
    document.getElementById("editFinanceModal").style.display = "block";
}

// Finanzdatensatz bearbeiten
document.getElementById("editFinanceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const date = document.getElementById("editFinanceDate").value;
    const category = document.getElementById("editFinanceCategory").value;
    const note = document.getElementById("editFinanceNote").value;
    const amount = parseFloat(document.getElementById("editFinanceAmount").value);
    const yearlyFee = parseFloat(document.getElementById("editFinanceYearlyFee").value);
    const type = document.getElementById("editFinanceType").value;
    const account = document.getElementById("editFinanceAccount").value;

    try {
        await financeCollection.doc(currentEditFinanceId).update({ date, category, note, amount, yearlyFee, type, account });
        document.getElementById("editFinanceModal").style.display = "none";
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Finanzdatensatzes: ", error);
    }
});

// Finanzdatensatz löschen
document.getElementById("deleteFinanceButton").addEventListener("click", async () => {
    if (currentEditFinanceId) {
        try {
            await financeCollection.doc(currentEditFinanceId).delete();
            document.getElementById("editFinanceModal").style.display = "none";
        } catch (error) {
            console.error("Fehler beim Löschen des Finanzdatensatzes: ", error);
        }
    }
});

// Exportieren der Finanzdaten
document.getElementById("exportFinanceButton").addEventListener("click", async () => {
    try {
        const snapshot = await financeCollection.get();
        if (snapshot.empty) {
            alert("Keine Finanzdaten zum Exportieren vorhanden.");
            return;
        }

        const financeData = [];
        snapshot.forEach((doc) => {
            financeData.push(doc.data());
        });

        const worksheet = XLSX.utils.json_to_sheet(financeData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Finanzen");
        XLSX.writeFile(workbook, "Finanzen.xlsx");
    } catch (error) {
        console.error("Fehler beim Exportieren der Finanzdaten: ", error);
    }
});

// Importieren der Finanzdaten
document.getElementById("importFinanceFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const financeData = XLSX.utils.sheet_to_json(worksheet);

        try {
            for (const finance of financeData) {
                await financeCollection.add(finance);
            }
            alert("Finanzdaten erfolgreich importiert.");
        } catch (error) {
            console.error("Fehler beim Importieren der Finanzdaten: ", error);
        }
    };
    reader.readAsArrayBuffer(file);
});
