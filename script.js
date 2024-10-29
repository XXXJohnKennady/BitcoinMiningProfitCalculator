// Firebase and authentication setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sections and Form Elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const welcomeSection = document.getElementById('welcome-section');
const logoutButton = document.getElementById('logout-button');

// XP Elements
const experienceFill = document.getElementById('experience-fill');
const experiencePointsSpan = document.getElementById('experience-points');
let currentXP = 0;
const XP_PER_LEVEL = 100;

// Shop Elements
const shopForm = document.getElementById('shop-form');
const wantsList = document.getElementById('wants-list');

// Event Handlers for Auth Forms
document.getElementById('show-register').addEventListener('click', () => toggleSection(registerSection));
document.getElementById('show-login').addEventListener('click', () => toggleSection(loginSection));

document.getElementById('register-form').addEventListener('submit', registerUser);
document.getElementById('login-form').addEventListener('submit', loginUser);
logoutButton.addEventListener('click', () => signOut(auth).then(() => toggleSection(loginSection)));

// Experience Form Handler
document.getElementById('xp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const pages = parseInt(document.getElementById('pages-completed').value);
    if (!isNaN(pages) && pages > 0) {
        currentXP += pages;
        updateXPBar(currentXP);
    }
});

// Shop Form Handler
shopForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('want-description').value;
    const cost = parseInt(document.getElementById('want-cost').value);
    if (description && !isNaN(cost) && cost > 0) {
        const item = document.createElement('li');
        item.className = "want-item";
        item.innerHTML = `<span>${description} - ${cost} XP</span> <button onclick="buyWant(${cost})">Buy</button>`;
        wantsList.appendChild(item);
    }
});

// Buy Want Item
window.buyWant = (cost) => {
    if (currentXP >= cost) {
        currentXP -= cost;
        updateXPBar(currentXP);
    } else {
        alert("Not enough XP.");
    }
};

// Update XP Bar
function updateXPBar(totalXP) {
    const level = Math.floor(totalXP / XP_PER_LEVEL);
    const progress = (totalXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
    experienceFill.style.width = `${progress}%`;
    experiencePointsSpan.textContent = `Level ${level} (${totalXP} XP)`;
}

// Authentication Functions
function registerUser(e) { /* ... */ }
function loginUser(e) { /* ... */ }
function toggleSection(section) { /* ... */ }
