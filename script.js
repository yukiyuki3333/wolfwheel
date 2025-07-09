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
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");

const segments = ["1 TON", "💸 Perdu", "2 TON", "💀", "3 TON", "🎁 Bonus"];
const colors = ["#FFD700", "#DC3545", "#28A745", "#6C757D", "#17A2B8", "#FF851B"];

let angle = 0;
let spinning = false;

function drawWheel(rotation = 0) {
  const center = canvas.width / 2;
  const radius = center;
  const arc = (2 * Math.PI) / segments.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < segments.length; i++) {
    const start = rotation + i * arc;
    const end = start + arc;

    // Segment
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Texte
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(segments[i], radius - 10, 10);
    ctx.restore();
  }

  // Flèche
  ctx.beginPath();
  ctx.moveTo(center - 10, 10);
  ctx.lineTo(center + 10, 10);
  ctx.lineTo(center, 40);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

function spinWheel() {
  if (spinning) return;
  spinning = true;

  const targetAngle = angle + Math.PI * 4 + Math.random() * Math.PI * 2;
  const duration = 4000;
  const start = performance.now();

  function animate(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    angle = targetAngle * eased;
    drawWheel(angle);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const winningIndex = segments.length - Math.floor(((angle % (2 * Math.PI)) / (2 * Math.PI)) * segments.length) - 1;
      alert(`🎉 Tu as gagné : ${segments[winningIndex]}`);
    }
  }

  requestAnimationFrame(animate);
}

drawWheel();
spinBtn.addEventListener("click", spinWheel);

