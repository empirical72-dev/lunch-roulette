let participants = [];
let options = [];
let canvas = document.getElementById("roulette");
let ctx = canvas.getContext("2d");
let currentAngle = 0;
let currentIndex = 0;

// 참가자 추가
function addParticipant() {
  const input = document.getElementById("participantInput");
  const name = input.value.trim();
  if (name) {
    participants.push(name);
    renderParticipants();
    input.value = "";
  }
}

function renderParticipants() {
  const list = document.getElementById("participantList");
  list.innerHTML = "";
  participants.forEach((p, i) => {
    const li = document.createElement("li");
    li.textContent = p;
    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.onclick = () => {
      participants.splice(i, 1);
      renderParticipants();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// 항목 추가
function addOption() {
  const name = document.getElementById("optionName").value.trim();
  const count = parseInt(document.getElementById("optionCount").value);
  if (name && count > 0) {
    for (let i = 0; i < count; i++) {
      options.push(name);
    }
    renderOptions();
    document.getElementById("optionName").value = "";
    document.getElementById("optionCount").value = "";
    drawRoulette();
  }
}

function renderOptions() {
  const list = document.getElementById("optionList");
  list.innerHTML = "";
  options.forEach((o, i) => {
    const li = document.createElement("li");
    li.textContent = o;
    const delBtn = document.createElement("button");
    delBtn.textContent = "삭제";
    delBtn.onclick = () => {
      options.splice(i, 1);
      renderOptions();
      drawRoulette();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// 룰렛 그리기
function drawRoulette() {
  const total = options.length;
  if (total === 0) return;
  const anglePerSlice = 2 * Math.PI / total;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const colors = ["#ffcc00", "#ff9900", "#66ccff", "#ff6699", "#99cc33", "#cc66ff"];

  options.forEach((opt, i) => {
    const startAngle = i * anglePerSlice + currentAngle;
    const endAngle = startAngle + anglePerSlice;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(startAngle + anglePerSlice/2);
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(opt, canvas.width/4, 0);
    ctx.restore();
  });

  // 외곽선
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, 2*Math.PI);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.stroke();
}

// 리셋
function resetRoulette() {
  participants = [];
  options = [];
  currentIndex = 0;
  document.getElementById("participantList").innerHTML = "";
  document.getElementById("optionList").innerHTML = "";
  document.getElementById("result").innerText = "";
  document.getElementById("history").innerHTML = "";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 룰렛 돌리기
function spinRoulette() {
  if (participants.length === 0 || options.length === 0) {
    alert("참가자와 항목을 먼저 입력하세요!");
    return;
  }
  if (currentIndex >= participants.length) {
    alert("모든 참가자에게 결과가 배정되었습니다.");
    return;
  }

  const spinAngle = Math.random() * 360 + 720;
  const duration = 3000;
  const start = performance.now();

  function animate(time) {
    const progress = (time - start) / duration;
    if (progress < 1) {
      currentAngle = spinAngle * progress * Math.PI / 180;
      drawRoulette();
      requestAnimationFrame(animate);
    } else {
      currentAngle = spinAngle * Math.PI