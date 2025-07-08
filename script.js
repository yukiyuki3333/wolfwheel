const wheelImg = document.getElementById("wheelImage");
const spinBtn = document.getElementById("spinBtn");

let currentRotation = 0;

spinBtn.addEventListener("click", () => {
  const randomRotation = 360 * 5 + Math.floor(Math.random() * 360); // 5 tours + angle aléatoire
  currentRotation += randomRotation;

  wheelImg.style.transform = `rotate(${currentRotation}deg)`;

  // Bonus : dire le résultat après le spin (exemple simple)
  setTimeout(() => {
    alert("🎁 Résultat : à personnaliser !");
  }, 4000);
});
// ——— Admin config
const ADMIN_WALLET = "UQCYDJ0nDSXZSIZj9kopm9pwm2Q3sFwtiSJu-EpNppSfWHeV";

function isAdmin(wallet) {
  return wallet === ADMIN_WALLET;
}
import { isAdmin } from "./wallet-admin.js";
export async function payToSpin() {
  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 60,
    messages: [
      {
        address: "UQCYDJ0nDSXZSIZj9kopm9pwm2Q3sFwtiSJu-EpNppSfWHeV",
        amount: "1000000000",
        payload: ""
      }
    ]
  };

  try {
    const result = await connector.sendTransaction(tx);
    console.log("💸 1 TON reçu", result);
    return true;
  } catch (e) {
    console.error("❌ Paiement échoué :", e);
    return false;
  }
}
import { payToSpin } from "./tonconnect.js";
import { isAdmin } from "./wallet-admin.js";

let walletAddress = null; // récupère-la après connexion TonConnect

spinBtn.addEventListener("click", async () => {
  if (!walletAddress) {
    alert("🦊 Connecte d’abord ton wallet");
    return;
  }

  if (isAdmin(walletAddress)) {
    // 👑 Spin gratuit et illimité pour toi
    spinWheel();
    return;
  }

  // Sinon, les autres : un spin gratuit par jour
  if (canSpinToday()) {
    spinWheel();
    markSpinToday();
  } else {
    const confirmPay = confirm("Tu veux repayer 1 TON pour rejouer ?");
    if (confirmPay) {
      const paid = await payToSpin();
      if (paid) {
        spinWheel();
      } else {
        alert("❌ Paiement échoué. Réessaie.");
      }
    }
  }
});
const walletDisplay = document.getElementById("walletDisplay");
walletDisplay.innerText = isAdmin(walletAddress)
  ? `${walletAddress} 👑 Admin`
  : walletAddress;


