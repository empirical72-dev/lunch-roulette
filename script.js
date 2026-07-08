let participants = [];
let options = [];
let canvas = document.getElementById("roulette");
let ctx = canvas.getContext("2d");
let currentAngle = 0;
let assignedResults = [];
let currentIndex = 0;

// 참가자 추가
function addParticipant() {
  const input = document.getElementById("participantInput");
  const name = input.value.trim();
  if (name) {
    participants.push(name);
    document.getElementById("participantList").innerText = participants.join(", ");
    input.value = "";
  }
}

// 항목 추가 (개수만큼 슬롯 생성)
function addOption() {
  const name = document.getElementById("optionName").value.trim();
  const count = parseInt(document.getElementById("optionCount").value);
  if (name && count > 0) {
    for (let i = 0; i < count; i++) {
      options.push(name);
    }
    document.getElementById("optionList").innerText = options.join(", ");
    document.getElementById("optionName").value = "";
    document.getElementById("optionCount").value = "";
    drawRoulette();
  }
}

// 룰렛 그리기
function drawRoulette() {
  const total = options.length;
  if (total === 0) return;
  const anglePerSlice = 2 * Math.PI / total;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((opt, i) => {
    const startAngle = i * anglePerSlice + currentAngle;
    const endAngle = startAngle + anglePerSlice;

    ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff9900";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2);
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(startAngle + anglePerSlice/2);
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(opt, canvas.width/4, 0);
    ctx.restore();
  });
}

// 리셋
function resetRoulette() {
  participants = [];
  options = [];
  assignedResults = [];
  currentIndex = 0;
  document.getElementById("participantList").innerText = "";
  document.getElementById("optionList").innerText = "";
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

  // 결과 매핑을 한 번만 생성
  if (assignedResults.length === 0) {
    let shuffledOptions = [...options];
    while (shuffledOptions.length < participants.length) {
      shuffledOptions.push("꽝");
    }
    shuffledOptions = shuffledOptions.sort(() => Math.random() - 0.5);
    assignedResults = shuffledOptions;
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
      currentAngle = spinAngle * Math.PI / 180;
      drawRoulette();

      const resultOption = assignedResults[currentIndex];
      const winner = participants[currentIndex];
      currentIndex++;

      document.getElementById("result").innerHTML = `<h2>${winner} → ${resultOption}</h2>`;
      const historyRow = `<tr><td>${winner}</td><td>${resultOption}</td></tr>`;
      document.getElementById("history").innerHTML += historyRow;
    }
  }
  requestAnimationFrame(animate);
}
