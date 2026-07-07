let participants = [];
const penalties = ["점심값", "커피값", "면제권"];
const canvas = document.getElementById("roulette");
const ctx = canvas.getContext("2d");
let spinning = false;
let angle = 0;

function addName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();
  if (name) {
    participants.push(name);
    updateList();
    input.value = "";
    drawRoulette();
  }
}

function updateList() {
  const list = document.getElementById("nameList");
  list.innerHTML = "";
  participants.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = p;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = () => {
      participants.splice(index, 1);
      updateList();
      drawRoulette();
    };

    list.appendChild(li);
    li.appendChild(deleteBtn);
  });
}

function drawRoulette() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const items = participants.flatMap(p => penalties.map(penalty => `${p} - ${penalty}`));
  if (items.length === 0) return;

  const arc = (2 * Math.PI) / items.length;
  items.forEach((item, i) => {
    const startAngle = i * arc;
    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#66ccff";
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, startAngle, startAngle + arc);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(startAngle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(item, 180, 5);
    ctx.restore();
  });
}

function spinRoulette() {
  if (participants.length === 0) {
    alert("참가자를 먼저 추가하세요!");
    return;
  }
  if (spinning) return;
  spinning = true;

  let spinTime = 0;
  const spinDuration = 3000; // 3초
  const spinAngle = Math.random() * 10 + 10; // 랜덤 회전 속도

  function rotate() {
    spinTime += 30;
    if (spinTime >= spinDuration) {
      spinning = false;
      const items = participants.flatMap(p => penalties.map(penalty => `${p} - ${penalty}`));
      const arc = (2 * Math.PI) / items.length;
      const selectedIndex = Math.floor(((2 * Math.PI - (angle % (2 * Math.PI))) / arc)) % items.length;
      document.getElementById("result").textContent = `🎉 최종 결과: ${items[selectedIndex]}에 당첨되었습니다!`;
      return;
    }
    angle += spinAngle * Math.PI / 180;
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle);
    ctx.translate(-200, -200);
    drawRoulette();
    ctx.restore();
    setTimeout(rotate, 30);
  }
  rotate();
}
