const spinButton = document.getElementById("spinButton");
const freeButton = document.getElementById("freeSpinButton");
const status = document.getElementById("status");
const result = document.getElementById("result");
const inviteBtn = document.getElementById("inviteBtn");
const referralLink = document.getElementById("referralLink");

function spinWheel(isFree) {
  const outcomes = ["Rien du tout 😢", "Encore un tir 🎁", "🔥 Tu as gagné !"];
  const random = Math.floor(Math.random() * outcomes.length);
  result.textContent = outcomes[random];
  if (isFree) {
    localStorage.setItem("playedToday", new Date().toDateString());
  }
}

function hasFreeSpin() {
  return localStorage.getItem("playedToday") !== new Date().toDateString();
}

window.onload = () => {
  if (hasFreeSpin()) {
    status.textContent = "🎁 Tu as un tir gratuit aujourd’hui !";
    freeButton.style.display = "inline-block";
  } else {
    status.textContent = "1 TON = 1 tir";
    spinButton.style.display = "inline-block";
  }
};

freeButton.onclick = () => spinWheel(true);

spinButton.onclick = () => {
  alert("Paiement 1 TON requis via Tonkeeper (intégration réelle à venir)");
  spinWheel(false);
};

inviteBtn.onclick = () => {
  const link = window.location.href + "?ref=tonusername";
  referralLink.value = link;
};
