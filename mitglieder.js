// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const membersCollection = db.collection("members");
const financeCollection = db.collection("finances");

// Neues Mitglied hinzufügen
document.getElementById("addMemberForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const memberNumber = document.getElementById("addMemberNumber").value;
    const name = document.getElementById("addName").value;
    const email = document.getElementById("addEmail").value;
    const phone = document.getElementById("addPhone").value;
    const address = document.getElementById("addAddress").value;
    const zip = document.getElementById("addZip").value;
    const city = document.getElementById("addCity").value;
    
    try {
        await membersCollection.add({ memberNumber, name, email, phone, address, zip, city });
        document.getElementById("addMemberForm").reset();
        document.getElementById("addMemberModal").style.display = "none";
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Mitglieds: ", error);
    }
});

// Mitgliederliste anzeigen und Berechnungen für 2022-2026 durchführen
membersCollection.onSnapshot((snapshot) => {
    const membersTable = document.getElementById("members");
    if (snapshot.empty) {
        document.getElementById("loadingMessage").textContent = "Keine Mitglieder gefunden.";
        return;
    }

    membersTable.innerHTML = "";
    document.getElementById("loadingMessage").style.display = "none";

    snapshot.forEach(async (doc) => {
        const member = doc.data();
        const tr = document.createElement("tr");
        tr.setAttribute("data-id", doc.id);

        const memberNumberTd = document.createElement("td");
        memberNumberTd.textContent = member.memberNumber;
        tr.appendChild(memberNumberTd);

        const nameTd = document.createElement("td");
        nameTd.textContent = member.name;
        tr.appendChild(nameTd);

        const emailTd = document.createElement("td");
        emailTd.textContent = member.email;
        tr.appendChild(emailTd);

        const phoneTd = document.createElement("td");
        phoneTd.textContent = member.phone;
        tr.appendChild(phoneTd);

        const addressTd = document.createElement("td");
        addressTd.textContent = member.address;
        tr.appendChild(addressTd);

        const zipTd = document.createElement("td");
        zipTd.textContent = member.zip;
        tr.appendChild(zipTd);

        const cityTd = document.createElement("td");
        cityTd.textContent = member.city;
        tr.appendChild(cityTd);

        // Berechnungen für die Spalten 2022-2026
        const years = [2022, 2023, 2024, 2025, 2026];
        for (const year of years) {
            const paymentTd = document.createElement("td");
            let totalPayment = 0;
            const financeQuery = await financeCollection.get();
            financeQuery.forEach((financeDoc) => {
                const financeData = financeDoc.data();
                if (
                    financeData.note.includes(member.name.split(' ')[0]) && // Überprüfung des Vornamens
                    financeData.note.includes(member.name.split(' ')[1]) && // Überprüfung des Nachnamens
                    financeData.yearlyFee === year && // Überprüfung des Jahres
                    financeData.category === "Mitgliederbeitrag" // Nur Mitgliederbeiträge berücksichtigen
                ) {
                    totalPayment += parseFloat(financeData.amount);
                }
            });

            paymentTd.textContent = totalPayment;
            tr.appendChild(paymentTd);
        }

        const actionsTd = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.textContent = "Bearbeiten";
        editButton.addEventListener("click", () => openEditModal(doc.id, member));
        actionsTd.appendChild(editButton);
        tr.appendChild(actionsTd);

        membersTable.appendChild(tr);
    });
}, (error) => {
    console.error("Fehler beim Abrufen der Mitgliederliste: ", error);
    document.getElementById("loadingMessage").textContent = "Fehler beim Laden der Mitglieder.";
});

// Funktion zum Öffnen des Bearbeitungsformulars
function openEditModal(id, member) {
    currentEditMemberId = id;
    document.getElementById("editMemberNumber").value = member.memberNumber;
    document.getElementById("editName").value = member.name;
    document.getElementById("editEmail").value = member.email;
    document.getElementById("editPhone").value = member.phone;
    document.getElementById("editAddress").value = member.address;
    document.getElementById("editZip").value = member.zip;
    document.getElementById("editCity").value = member.city;
    document.getElementById("editMemberModal").style.display = "block";
}
