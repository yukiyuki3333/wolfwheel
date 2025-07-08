// === tonconnect.js ===

// Initialisation du connecteur
const connector = new TonConnectSDK.TonConnect({
  manifestUrl: "https://yukiyuki3333.github.io/wolfwheel/tonconnect-manifest.json"
});

// Connexion au wallet
async function connectTonWallet() {
  await connector.restoreConnection();
  if (!connector.connected) {
    await connector.connect();
  }
  const wallet = connector.wallet;
  console.log("Wallet connecté :", wallet.account.address);
  return wallet.account.address;
}

// Paiement de 1 TON vers ton wallet
async function payTon(fromWallet, amountTon = 1) {
  if (!connector.connected) {
    alert("Connecte ton wallet d'abord !");
    return false;
  }

  const nanotons = (amountTon * 1e9).toString(); // 1 TON = 1e9 nanotons

  const tx = {
    validUntil: Math.floor(Date.now() / 1000) + 60,
    messages: [
      {
        address: "UQCYDJ0nDSXZSIZj9kopm9pwm2Q3sFwtiSJu-EpNppSfWHeV", // Ton wallet à toi
        amount: nanotons,
        payload: ""
      }
    ]
  };

  try {
    const result = await connector.sendTransaction(tx);
    console.log("Transaction envoyée :", result);
    return true;
  } catch (e) {
    alert("❌ Paiement annulé ou erreur.");
    console.error(e);
    return false;
  }
}
