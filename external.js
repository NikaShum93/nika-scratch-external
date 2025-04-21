const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const label = document.getElementById("label");
const sound = document.getElementById("sound");

let targetImage = null;
let isErasing = false;
const brushSize = 40;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function findGroupedImage() {
  try {
    const parent = window.frameElement?.parentElement;
    if (!parent) return;
    const imgs = parent.querySelectorAll("img");
    if (imgs.length > 0) {
      targetImage = imgs[0];
      targetImage.style.webkitMaskImage = "none";
      targetImage.style.maskImage = "none";
      targetImage.style.webkitMaskRepeat = "no-repeat";
      targetImage.style.maskRepeat = "no-repeat";
      targetImage.style.webkitMaskComposite = "destination-out";
    }
  } catch (e) {
    console.warn("Unable to access parent:", e);
  }
}

function applyMask(x, y) {
  if (!targetImage) return;
  const newMask = `radial-gradient(circle ${brushSize}px at ${x}px ${y}px, transparent 0%, black 100%)`;
  const current = targetImage.style.webkitMaskImage;
  targetImage.style.webkitMaskImage = current
    ? `${current}, ${newMask}`
    : newMask;
  targetImage.style.maskImage = targetImage.style.webkitMaskImage;
}

function sparkle(x, y) {
  for (let i = 0; i < 4; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    const color = ["#fff", "#ccf6ff", "#ffddee", "#ffccff"][Math.floor(Math.random() * 4)];
    s.style.background = color;
    s.style.left = (x + (Math.random() * 10 - 5)) + "px";
    s.style.top = (y + (Math.random() * 10 - 5)) + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
}

canvas.addEventListener("mousedown", () => {
  isErasing = true;
  sound.currentTime = 0;
  sound.play();
});

canvas.addEventListener("mouseup", () => {
  isErasing = false;
  sound.pause();
});

canvas.addEventListener("mouseleave", () => {
  isErasing = false;
  sound.pause();
});

canvas.addEventListener("mousemove", (e) => {
  if (!isErasing || !targetImage) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  applyMask(x, y);
  sparkle(x, y);
});

setTimeout(() => {
  if (window.top !== window.self) label.style.opacity = 0;
}, 3000);

findGroupedImage();