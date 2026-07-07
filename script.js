let participants = [];
let options = [];
let spinning = false;
let angle = 0;
let spinVelocity = 0;

function addParticipant() {
  const input = document.getElementById("participantInput");
  if (input.value.trim() !== "") {
    participants.push(input.value.trim());
    renderParticipants();
    input.value = "";
  }
}

function renderParticipants() {
  const list = document.getElementById("participantList");
  list.innerHTML = "";
  participants.forEach((name, i) => {
    list.innerHTML += `
      <div>
        ${name}
        <button onclick="editParticipant(${i})">수정</button>
        <button onclick="deleteParticipant(${i})">삭제</button>
      </div>`;
  });
}

function editParticipant(index) {
  const newName = prompt("새 이름 입력:", participants[index]);
  if (newName) {
    participants[index] = newName;
    renderParticipants();
  }
}

function deleteParticipant(index) {
  participants.splice(index, 1);
  renderParticipants();
}

function setupRoulette() {
  const lunchCount = parseInt(document.getElementById("lunchCount").value);
  const coffeeCount = parseInt(document.getElementById("coffeeCount").value);
  const total = participants.length;

  options = [];
  for (let i = 0; i < lunchCount; i++) options.push("점심값");
  for (let i = 0; i < coffeeCount; i++) options.push("커피값");
  while (options.length < total) options.push("면제권");

  drawRoulette();
}

function resetRoulette() {
  participants = [];
  options = [];
  document.getElementById("participantList").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("history").innerHTML = "";
  drawRoulette();
}

function drawRoulette() {
  const canvas = document.getElementById("roulette");
  const ctx = canvas.getContext("2d");
  const numOptions = options.length;
  if (numOptions === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  const arc = 2 * Math.PI / numOptions;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((opt, i) => {
    const angleStart = i * arc;
    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? "red" : "black";
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angleStart, angleStart + arc);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angleStart + arc / 2);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(opt, 80, 10);
    ctx.restore();
  });
}

function spinRoulette() {
  if (spinning || options.length === 0) return;
  spinning = true;
  spinVelocity = Math.random() * 0.3 + 0.25;
  animateSpin();
}

function animateSpin() {
  const canvas = document.getElementById("roulette");
  const ctx = canvas.getContext("2d");

  angle += spinVelocity;
  spinVelocity *= 0.98;

  ctx.save();
  ctx.translate(200, 200);
  ctx.rotate(angle);
  ctx.translate(-200, -200);
  drawRoulette();
  ctx.restore();

  if (spinVelocity > 0.002) {
    requestAnimationFrame(animateSpin);
  } else {
    spinning = false;
    showResult();
  }
}

function showResult() {
  const numOptions = options.length;
  const arc = 2 * Math.PI / numOptions;
  const selectedIndex = Math.floor(((2 * Math.PI - (angle % (2 * Math.PI))) / arc)) % numOptions;
  const outcome = options[selectedIndex];
  const currentPlayer = participants[selectedIndex] || "참가자 없음";

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<h2>${currentPlayer} → ${outcome} 당첨!</h2>`;

  const history = document.getElementById("history");
  history.innerHTML += `<li>${currentPlayer} → ${outcome}</li>`;
}
