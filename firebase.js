// === firebase.js ===

// 🔥 1. Configuration Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs, onSnapshot
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

// 🔐 2. Enregistrer un spin
export async function saveSpin(wallet, reward) {
  const ref = doc(db, "players", wallet);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, {
      spins: snap.data().spins + 1,
      lastSpin: new Date().toISOString(),
      rewards: [...(snap.data().rewards || []), reward]
    });
  } else {
    await setDoc(ref, {
      spins: 1,
      lastSpin: new Date().toISOString(),
      rewards: [reward],
      referrals: 0,
      airdropEligible: true
    });
  }
}

// 🪙 3. Bonus de bienvenue (0.5 TON)
export async function checkWelcomeBonus(wallet) {
  const ref = doc(db, "players", wallet);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      spins: 0,
      lastSpin: "",
      rewards: [],
      referrals: 0,
      airdropEligible: true
    });
    // Ici tu peux déclencher l’envoi de 0.5 TON vers le wallet
    console.log("🎁 Bonus de bienvenue accordé !");
  }
}

// 👯‍♀️ 4. Parrainage
export async function addReferral(refWallet) {
  const ref = doc(db, "players", refWallet);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const current = snap.data().referrals || 0;
    await updateDoc(ref, { referrals: current + 1 });
  }
}

// 🪂 5. Airdrop trimestriel
export async function markAirdrop(wallet) {
  const ref = doc(db, "players", wallet);
  await updateDoc(ref, { airdropEligible: false });
}

// 🏆 6. Classement en temps réel
export function listenToLeaderboard(callback) {
  const playersRef = collection(db, "players");
  onSnapshot(playersRef, (snapshot) => {
    const leaderboard = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        wallet: doc.id,
        spins: data.spins || 0
      });
    });
    leaderboard.sort((a, b) => b.spins - a.spins);
    callback(leaderboard.slice(0, 10));
  });
}
