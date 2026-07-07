let participants = [];

function addName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();
  if (name) {
    participants.push(name);
    updateList();
    input.value = "";
  }
}

function updateList() {
  const list = document.getElementById("nameList");
  list.innerHTML = "";
  participants.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = p;
    list.appendChild(li);
  });
}

function pickWinner() {
  if (participants.length === 0) {
    alert("참가자를 먼저 추가하세요!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * participants.length);
  const winner = participants[randomIndex];
  document.getElementById("result").textContent = `오늘 점심값은 ${winner}님이 계산! 🍜`;
}
