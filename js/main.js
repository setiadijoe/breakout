import { BreakoutGame } from "./game.js";
import { BreakoutRenderer } from "./renderer.js";
import { attachControls } from "./controls.js";

function requireElement(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Elemen game tidak ditemukan: #${id}`);
  return element;
}

const canvas = requireElement("game-canvas");
const scoreOutput = requireElement("score");
const livesOutput = requireElement("lives");
const levelOutput = requireElement("level");
const loopCount = requireElement("loop-count");
const overlay = requireElement("screen-overlay");
const overlayTitle = requireElement("overlay-title");
const overlayMessage = requireElement("overlay-message");
const upgradeStatus = requireElement("upgrade-status");
const statusMessage = requireElement("game-status");
const startButton = requireElement("start-button");

const game = new BreakoutGame();
const renderer = new BreakoutRenderer(canvas);
const pressedKeys = new Set();
let previousFrame = 0;
let lastInterfaceState = "";

const actions = {
  toggle: toggleGame,
  start: startGame,
  pause: pauseGame,
  setShooting(shooting) {
    game.setShooting(shooting);
  },
  isPressed(code) {
    return pressedKeys.has(code);
  }
};

window.addEventListener("keydown", (event) => pressedKeys.add(event.code));
window.addEventListener("keyup", (event) => pressedKeys.delete(event.code));
attachControls(canvas, game, actions);

function startGame() {
  if (game.state === "gameover") game.newGame();
  game.start();
  updateInterface();
}

function toggleGame() {
  if (game.state === "playing") pauseGame();
  else startGame();
}

function pauseGame() {
  if (game.state === "playing") game.pause();
  updateInterface();
}

function updateInterface() {
  const interfaceState = `${game.state}:${game.score}:${game.lives}:${game.level}:${game.loop}:${game.activeUpgrade}:${Math.ceil(game.upgradeTimer)}`;
  if (interfaceState === lastInterfaceState) return;
  lastInterfaceState = interfaceState;
  scoreOutput.value = String(game.score).padStart(4, "0");
  scoreOutput.textContent = String(game.score).padStart(4, "0");
  livesOutput.value = String(game.lives);
  livesOutput.textContent = String(game.lives);
  levelOutput.value = String(game.level).padStart(2, "0");
  levelOutput.textContent = String(game.level).padStart(2, "0");
  loopCount.textContent = `PUTARAN ${game.loop}`;
  upgradeStatus.hidden = !game.activeUpgrade;
  upgradeStatus.textContent = game.activeUpgrade === "wide" ? "PADDLE 2X"
    : game.activeUpgrade === "shooter" ? "TEKAN A UNTUK TEMBAK"
      : game.activeUpgrade === "shield" ? `DINDING ${Math.ceil(game.upgradeTimer)} DETIK` : "";
  startButton.textContent = game.state === "playing" ? "JEDA"
    : game.state === "paused" ? "LANJUT"
      : game.state === "gameover" ? "MAIN LAGI" : "MULAI";

  if (game.state === "playing") {
    overlay.hidden = true;
    statusMessage.textContent = `Permainan berlangsung. Level ${game.level}, putaran ${game.loop}. Skor ${game.score}. Sisa nyawa ${game.lives}.`;
  } else {
    overlay.hidden = false;
    if (game.state === "gameover") {
      overlayTitle.textContent = "GAME OVER";
      overlayMessage.textContent = `Skor akhir ${game.score}. Klik MAIN LAGI untuk bermain kembali.`;
      statusMessage.textContent = `Game over. Skor akhir ${game.score}.`;
    } else if (game.state === "paused") {
      overlayTitle.textContent = "DIJEDA";
      overlayMessage.textContent = "Tekan spasi atau LANJUT untuk kembali bermain";
      statusMessage.textContent = "Permainan dijeda.";
    } else {
      overlayTitle.textContent = "SIAP?";
      overlayMessage.textContent = "Klik MULAI atau tekan spasi";
      statusMessage.textContent = "Siap bermain.";
    }
  }
}

function frame(timestamp) {
  const deltaSeconds = previousFrame ? (timestamp - previousFrame) / 1000 : 0;
  previousFrame = timestamp;
  game.update(deltaSeconds);
  renderer.draw(game);
  updateInterface();
  window.requestAnimationFrame(frame);
}

startButton.addEventListener("click", () => {
  if (game.state === "playing") pauseGame();
  else startGame();
});
window.addEventListener("resize", () => {
  renderer.resize();
  renderer.draw(game);
});

updateInterface();
window.requestAnimationFrame(frame);
