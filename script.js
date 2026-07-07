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

function drawRoulette() {
  const canvas = document.getElementById("roulette");
  const ctx = canvas.getContext("2d");
  const numOptions = options.length;
  const arc = 2 * Math.PI / numOptions;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((opt, i) => {
    const angleStart = i * arc;
    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? "red" : "black";
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, angleStart, angleStart + arc);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angleStart + arc / 2);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(opt + " (" + (participants[i] || "") + ")", 100, 10);
    ctx.restore();
  });
}

function spinRoulette() {
  if (spinning) return;
  spinning = true;
  spinVelocity = Math.random() * 0.3 + 0.25; // 초기 속도
  animateSpin();
}

function animateSpin() {
  const canvas = document.getElementById("roulette");
  const ctx = canvas.getContext("2d");

  angle += spinVelocity;
  spinVelocity *= 0.98; // 감속

  ctx.save();
  ctx.translate(250, 250);
  ctx.rotate(angle);
  ctx.translate(-250, -250);
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
  const winner = participants[selectedIndex] || "참가자 없음";

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<h2>${winner} → ${outcome} 당첨!</h2>`;

  const history = document.getElementById("history");
  history.innerHTML += `<li>${winner} → ${outcome}</li>`;
}
