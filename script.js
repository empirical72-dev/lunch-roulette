let participants = [];
let options = [];

function addParticipant() {
  const input = document.getElementById("participantInput");
  if (input.value.trim() !== "") {
    participants.push(input.value.trim());
    alert(`${input.value.trim()} 참가자 추가됨`);
    input.value = "";
  }
}

function setupRoulette() {
  const lunchCount = parseInt(document.getElementById("lunchCount").value);
  const coffeeCount = parseInt(document.getElementById("coffeeCount").value);
  const total = participants.length;

  options = [];
  for (let i = 0; i < lunchCount; i++) options.push("점심값");
  for (let i = 0; i < coffeeCount; i++) options.push("커피값");
  while (options.length < total) options.push("면제권");

  alert("룰렛이 구성되었습니다!");
}

function spinRoulette() {
  const roulette = document.getElementById("roulette");
  const resultDiv = document.getElementById("result");

  const randomDeg = Math.floor(Math.random() * 360) + 720; // 최소 두 바퀴 회전
  roulette.style.transform = `rotate(${randomDeg}deg)`;

  setTimeout(() => {
    const index = Math.floor(Math.random() * options.length);
    const outcome = options[index];
    const winner = participants[index] || "참가자 없음";
    resultDiv.innerHTML = `<h2>${winner} → ${outcome} 당첨!</h2>`;
  }, 4000);
}
