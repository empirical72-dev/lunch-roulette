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
    renderParticipants(); // 리스트 갱신
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
    renderOptions();   // 리스트 갱신
    document.getElementById("optionName").value = "";
    document.getElementById("optionCount").value = "";
    drawRoulette();    // 룰렛 다시 그림
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
