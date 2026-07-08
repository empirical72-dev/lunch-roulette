let participants = [];
let options = [];

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

// 항목 추가
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
  }
}

// 리셋
function resetRoulette() {
  participants = [];
  options = [];
  document.getElementById("participantList").innerText = "";
  document.getElementById("optionList").innerText = "";
  document.getElementById("result").innerText = "";
  document.getElementById("history").innerHTML = "";
}

// 룰렛 돌리기
function spinRoulette() {
  if (participants.length === 0 || options.length === 0) {
    alert("참가자와 항목을 먼저 입력하세요!");
    return;
  }
  const winner = participants[Math.floor(Math.random() * participants.length)];
  const option = options[Math.floor(Math.random() * options.length)];
  document.getElementById("result").innerHTML = `<h2>${winner} → ${option}</h2>`;
  const historyRow = `<tr><td>${winner}</td><td>${option}</td></tr>`;
  document.getElementById("history").innerHTML += historyRow;
}
