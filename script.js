// --- State ---
let hunger = 80;
let pets = parseInt(localStorage.getItem('oren_pets') || '0', 10);
let dark = localStorage.getItem('oren_dark') === '1';

// --- Elements ---
const catWrap = document.getElementById('catWrap');
const catImg = document.getElementById('catImg');
const hearts = document.getElementById('hearts');
const meowAudio = document.getElementById('meowAudio');
const hungerFill = document.getElementById('hungerFill');
const hungerText = document.getElementById('hungerText');
const feedBtn = document.getElementById('feedBtn');
const petCount = document.getElementById('petCount');
const petLevel = document.getElementById('petLevel');
const petBtn = document.getElementById('petBtn');
const darkToggle = document.getElementById('darkToggle');

// --- Dark mode ---
function applyDark() {
  document.body.classList.toggle('dark', dark);
  darkToggle.textContent = dark ? '☀️' : '🌙';
  localStorage.setItem('oren_dark', dark ? '1' : '0');
}
darkToggle.addEventListener('click', () => { dark = !dark; applyDark(); });
applyDark();

// --- Klik kucing: meong + mantul + hati ---
catWrap.addEventListener('click', () => {
  meowAudio.currentTime = 0;
  meowAudio.play().catch(() => {});
  catWrap.classList.remove('bounce');
  void catWrap.offsetWidth; // restart animasi
  catWrap.classList.add('bounce');
  spawnHearts();
  addPet();
});

function spawnHearts() {
  const emojis = ['❤️', '🧡', '💛'];
  for (let i = 0; i < 5; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px');
    h.style.left = (35 + Math.random() * 30) + '%';
    hearts.appendChild(h);
    setTimeout(() => h.remove(), 1300);
  }
}

// --- Kenyang meter ---
function renderHunger() {
  hungerFill.style.width = hunger + '%';
  if (hunger > 60) {
    hungerText.textContent = 'Kenyang 😊';
    catWrap.classList.remove('hungry');
  } else if (hunger > 30) {
    hungerText.textContent = 'Biasa aja 😐';
    catWrap.classList.remove('hungry');
  } else {
    hungerText.textContent = 'Laper nih 🥺 kasih makan dong!';
    catWrap.classList.add('hungry');
  }
}
feedBtn.addEventListener('click', () => {
  hunger = Math.min(100, hunger + 25);
  renderHunger();
  spawnHearts();
});
setInterval(() => {
  hunger = Math.max(0, hunger - 1);
  renderHunger();
}, 4000);
renderHunger();

// --- Elus meter + level ---
function petLevelName(n) {
  if (n >= 100) return 'Raja Kucing 👑';
  if (n >= 50) return 'Pawang Kucing 🧙';
  if (n >= 10) return 'Sahabat Oren 🤝';
  return 'Pemula 🌱';
}
function renderPets() {
  petCount.textContent = pets;
  petLevel.textContent = 'Level: ' + petLevelName(pets);
  localStorage.setItem('oren_pets', String(pets));
}
function addPet() {
  pets++;
  renderPets();
}
petBtn.addEventListener('click', addPet);
renderPets();

// --- Kucing miring ngikutin kursor ---
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 14;
  const y = (e.clientY / window.innerHeight - 0.5) * 14;
  catWrap.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
});
