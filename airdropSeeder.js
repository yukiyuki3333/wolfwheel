import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, setDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedAirdropDates() {
  const start = new Date("2025-08-01T00:00:00Z"); // prochaine date
  const airdropRef = collection(db, "airdrops");

  for (let i = 0; i < 40; i++) { // 10 ans = 40 trimestres
    const date = new Date(start);
    date.setMonth(start.getMonth() + i * 3);
    const id = date.toISOString().split("T")[0]; // ex: "2025-08-01"

    await setDoc(doc(airdropRef, id), {
      date: date.toISOString(),
      status: "pending" // ou "done" quand distribué
    });

    console.log("✅ Airdrop ajouté :", id);
  }
}

seedAirdropDates();
{
  date: "2025-08-01T00:00:00Z",
  status: "pending",
  flexible: true,
  minPlayers: 100,
  minTON: 50
}

async function checkIfAirdropCanRun(airdrop) {
  const now = new Date();
  const airdropDate = new Date(airdrop.date);

  if (airdrop.status !== "pending") return false;
  if (now < airdropDate) return false;

  const players = await getEligiblePlayers(); // ex: joueurs actifs
  const tonPool = await getAvailableTON();    // ex: TON dispo

  if (players.length >= airdrop.minPlayers && tonPool >= airdrop.minTON) {
    return true; // ✅ On peut lancer l’airdrop
  }

  if (airdrop.flexible) {
    // ⏳ Reporter l’airdrop de 1 mois
    const newDate = new Date(airdropDate);
    newDate.setMonth(newDate.getMonth() + 1);
    await updateDoc(doc(db, "airdrops", airdrop.id), {
      date: newDate.toISOString()
    });
    console.log("🔁 Airdrop reporté à :", newDate.toISOString());
  }

  return false;
} 
