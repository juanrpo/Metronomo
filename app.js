// ==================================================
// METRÓNOMO
// ==================================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const metronomo = document.createElement("div");
metronomo.classList.add("metronomo")

const inputBPM = document.createElement("input");
inputBPM.classList.add("input")
inputBPM.placeholder = "BPM";
inputBPM.value = 60;


const playBtn = document.createElement("button");
playBtn.classList.add("button")
playBtn.textContent = "►";

const stopBtn = document.createElement("button");
stopBtn.classList.add("button")
stopBtn.textContent = "◼︎";

metronomo.append(inputBPM, playBtn, stopBtn);
document.body.appendChild(metronomo);

let bpm = 60;
let segundosPorBeat = 60 / bpm;
let nextNoteTime = 0;
let schedulerID = null;

const lookahead = 25;
const scheduleAhead = 0.1;

playBtn.onclick = startMetronome;
stopBtn.onclick = stopMetronome;

function playClick(time) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.7, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

  osc.start(time);
  osc.stop(time + 0.1);
}

function scheduler() {
  while (nextNoteTime < audioCtx.currentTime + scheduleAhead) {
    playClick(nextNoteTime);
    nextNoteTime += segundosPorBeat;
  }
}

function startMetronome() {
  if (schedulerID) return;
  bpm = Number(inputBPM.value) || 120;
  segundosPorBeat = 60 / bpm;
  nextNoteTime = audioCtx.currentTime + 0.05;
  schedulerID = setInterval(scheduler, lookahead);
}

function stopMetronome() {
  clearInterval(schedulerID);
  schedulerID = null;
}