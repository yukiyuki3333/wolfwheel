// === CONFIGURATION ===
const spinBtn = document.getElementById("spinBtn");
const paySpinBtn = document.getElementById("paySpinBtn");
const result = document.getElementById("result");
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const segments = ["Mini 💫", "Double 🎁", "0.5 TON 🔥", "Rien 😢", "Mega 🐺", "Bonus 👑"];
const colors = ["#f39c12", "#e74c3c", "#9b59b6", "#3498db", "#2ecc71", "#e67e22"];
let isSpinning = false;
let angle = 0;
let walletAddress = null;

// === WALLET CONNECTION ===
async function connectWallet() {
  const address = await connectTonWallet(); // depuis tonconnect.js
  walletAddress = address;
  document.getElementById("walletAddress").innerText = `Wallet : ${walletAddress}`;
  await checkWelcomeBonus(walletAddress);
}

// === DESSIN DE LA ROUE ===
function drawWheel() {
  const radius = canvas.width / 2;
  const arc = (2 * Math.PI) / segments.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  segments.forEach((label, i) => {
    const start = i * arc;
    const end = start + arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start, end);
    ctx.fill();
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#fff";
    ctx.font = "16px sans-serif";
    ctx.fillText(label, radius / 2, 0);
    ctx.restore();
  });
}

// === SPIN GRATUIT PAR JOUR ===
function canSpinToday() {
  const last = localStorage.getItem("lastSpinDate");
  const today = new Date().toISOString().split("T")[0];
  return last !== today;
}

function markSpinToday() {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("lastSpinDate", today);
}

// === LANCEMENT DE LA ROUE ===
function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  const spins = 10 + Math.floor(Math.random() * 10);
  const finalAngle = Math.random() * 360;
  const totalRotation = 360 * spins + finalAngle;
  const duration = 4000;
  const start = performance.now();

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    angle = totalRotation * easeOutCubic(progress);
    drawWheel();
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.restore();
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const index = Math.floor(((360 - (angle % 360)) / 360) * segments.length) % segments.length;
      const reward = segments[index];
      result.innerText = `🎉 Tu as gagné : ${reward}`;
      saveSpin(walletAddress, reward); // firebase.js
      isSpinning = false;
    }
  }

  requestAnimationFrame(animate);
}

// === SPIN PAYANT ===
async function payAndSpin() {
  if (!walletAddress) {
    alert("Connecte ton wallet d'abord !");
    return;
  }
  const success = await payTon(walletAddress, 1); // depuis tonconnect.js
  if (success) spinWheel();
}

// === BOUTONS ===
spinBtn.addEventListener("click", () => {
  if (!walletAddress) {
    alert("Connecte ton wallet d'abord !");
    return;
  }
  if (canSpinToday()) {
    spinWheel();
    markSpinToday();
  } else {
    alert("🕒 Tu as déjà utilisé ton spin gratuit aujourd’hui !");
  }
});

paySpinBtn.addEventListener("click", payAndSpin);

// === ANIMATION ===
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// === INIT ===
drawWheel();
document.getElementById("connectBtn").addEventListener("click", connectWallet);
listenToLeaderboard((topPlayers) => {
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  topPlayers.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerText = `#${i + 1} ${p.wallet.slice(0, 6)}... : ${p.spins} spins`;
    list.appendChild(li);
  });
});
function canSpinToday() {
  const last = localStorage.getItem("lastSpinDate");
  const today = new Date().toISOString().split("T")[0];
  return last !== today;
}

function markSpinToday() {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("lastSpinDate", today);
}
const address = await connectTonWallet();
walletAddress = address;
await checkWelcomeBonus(walletAddress);
// Lors du chargement de la page
const urlParams = new URLSearchParams(window.location.search);
const refWallet = urlParams.get("ref");

if (refWallet && walletAddress && refWallet !== walletAddress) {
  addReferral(refWallet); // firebase.js
}
