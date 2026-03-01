const API_BASE = "https://YOURAPP.azurewebsites.net";

const diceRow = document.getElementById("diceRow");
const rollBtn = document.getElementById("rollBtn");
const corsStatus = document.getElementById("corsStatus");

function renderDice(values) {
  diceRow.innerHTML = "";
  values.forEach(v => {
    const d = document.createElement("div");
    d.className = "die";
    d.textContent = v;
    diceRow.appendChild(d);
  });
}

async function wakeServer() {
  await fetch(`${API_BASE}/api/health`);
}

async function remoteRandom(min, max) {
  const r = await fetch(`${API_BASE}/api/random?min=${min}&max=${max}`);
  const j = await r.json();
  return j.value;
}

async function roll() {
  const rolls = [];
  for (let i = 0; i < 5; i++) {
    rolls.push(await remoteRandom(1, 6));
  }
  renderDice(rolls);
}

async function demoCorsFailure() {
  // This should FAIL in the browser (CORS), by design
  await fetch(`${API_BASE}/api/random-nocors?min=1&max=6`);
}

window.onload = async () => {
  await wakeServer(); // “wake up” Node server
  await roll();       // auto roll on load

  try {
    await demoCorsFailure();
  } catch (e) {
    console.error("Expected CORS failure:", e);
    corsStatus.textContent = "CORS demo: blocked (expected). Check console.";
  }
};

rollBtn.onclick = roll;