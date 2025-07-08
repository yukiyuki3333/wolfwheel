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
