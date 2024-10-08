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
const membersCollection = db.collection("members");

// Modal öffnen/schließen
document.getElementById("openAddModalButton").addEventListener("click", () => {
    document.getElementById("addMemberModal").style.display = "block";
});
document.getElementById("closeAddModal").addEventListener("click", () => {
    document.getElementById("addMemberModal").style.display = "none";
});

// Neues Mitglied hinzufügen
document.getElementById("addMemberForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const member = {
        memberNumber: document.getElementById("addMemberNumber").value,
        name: document.getElementById("addName").value,
        email: document.getElementById("addEmail").value,
        phone: document.getElementById("addPhone").value,
        address: document.getElementById("addAddress").value,
        zip: document.getElementById("addZip").value,
        city: document.getElementById("addCity").value
    };
    try {
        await membersCollection.add(member);
        document.getElementById("addMemberForm").reset();
        document.getElementById("addMemberModal").style.display = "none";
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Mitglieds: ", error);
    }
});
