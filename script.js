let participants = [];
let summary = {};
let options = [];
let spinning = false;
let angle = 0;
let spinVelocity = 0;
let currentTurn = 0;

// 참가자 관리
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
        ${i+1}. ${name}
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

// 룰렛 항목 관리
function addOption() {
  const nameInput = document.getElementById("optionName");
  const countInput = document.getElementById("optionCount");
  const name = nameInput.value.trim();
  const count = parseInt(countInput.value);

  if (name !== "" && count > 0) {
    summary[name] = (summary[name] || 0) + count;
    rebuildOptions();
    renderOptions();
    nameInput.value = "";
    countInput.value = "";
    drawRoulette();
  }
}

function rebuildOptions() {
  options = [];
  Object.keys(summary).forEach(opt => {
    for (let i = 0; i < summary[opt]; i++) {
      options.push(opt);
    }
  });
}

function renderOptions() {
  const list = document.getElementById("optionList");
  list.innerHTML = "";
  Object.keys(summary).forEach((opt, i) => {
    list.innerHTML += `
      <div>
        ${i+1}. ${opt} (${summary[opt]}명)
      </div>`;
  });
}

// 리셋
function resetRoulette() {
  participants = [];
  summary = {};
  options = [];
  currentTurn = 0;
  document.getElementById("participantList").innerHTML = "";
  document.getElementById("optionList").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("history").innerHTML = "";
  drawRoulette();
}

// 룰렛 그리기
function drawRoulette() {
  const canvas = document.getElementById("roulette");
  const ctx = canvas.getContext("2d");
  const numOptions = options.length;
  if (numOptions === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }
  const arc = 2 * Math.PI / numOptions;
  const colors = ["#e74c3c","#3498db","#2ecc71","#f1c40f","#9b59b6","#1abc9c","#e67e22","#34495e"];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((opt, i) => {
    const angleStart = i * arc;
    ctx.beginPath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angleStart, angleStart + arc);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angleStart + arc / 2);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(opt, 80, 10);
    ctx.restore();
  });
}

// 룰렛 돌리기
function spinRoulette() {
  if (spinning || participants.length === 0 || currentTurn >= participants.length) return;
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

// 결과 판정 (포인터 위쪽 기준)
function showResult() {
  const numOptions = options.length;
  const arc = 2 * Math.PI / numOptions;
  const adjustedAngle = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
  const selectedIndex = Math.floor(adjustedAngle / arc) % numOptions;
  const outcome = options[selectedIndex];

  const currentPlayer = participants[currentTurn] || "참가자 없음";
  document.getElementById("result").innerHTML = `<h2>${currentPlayer} → ${outcome} 당첨!</h2>`;
  document.getElementById("history").innerHTML += `<tr><td>${current