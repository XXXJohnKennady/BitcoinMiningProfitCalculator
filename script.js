// Import Firebase modules using ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1Ev9yosRf54ZYqKNk0nMlDPGB1wvfNok",
    authDomain: "life-is-a-game-c63e8.firebaseapp.com",
    projectId: "life-is-a-game-c63e8",
    storageBucket: "life-is-a-game-c63e8.appspot.com",
    messagingSenderId: "811209861596",
    appId: "1:811209861596:web:797afa123b21f211264719"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sections and Form Elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const welcomeSection = document.getElementById('welcome-section');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutButton = document.getElementById('logout-button');

// XP and Shop elements
const experienceFill = document.getElementById('experience-fill');
const experiencePointsSpan = document.getElementById('experience-points');
const xpForm = document.getElementById('xp-form');
const pagesCompletedInput = document.getElementById('pages-completed');
let currentXP = 0;

// Constants for leveling system
const XP_PER_LEVEL = 100;

// Shop form handling
const shopForm = document.getElementById('shop-form');
const wantsList = document.getElementById('wants-list');

// Event Listeners for toggling forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Register form handling
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User registered:", userCredential.user.email);
            alert("Registration successful! Please log in.");
            registerForm.reset();
            showLoginLink.click();
        })
        .catch((error) => {
            console.error("Registration failed:", error.message);
            alert("Registration failed: " + error.message);
        });
});

// Login form handling
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Sign in using Firebase authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("User signed in:", userCredential.user.email);
            loginForm.reset();
            alert("Login successful!");
        })
        .catch((error) => {
            console.error("Login failed:", error.message);
            alert("Login failed: " + error.message);
        });
});

// Authentication State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        welcomeSection.classList.remove('hidden'); // Show welcome section
    } else {
        console.log("No user logged in, displaying login section");
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        welcomeSection.classList.add('hidden'); // Hide welcome section
    }
});

// Handle adding experience points
xpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pages = parseInt(pagesCompletedInput.value.trim());

    if (isNaN(pages) || pages < 1) {
        alert("Please enter a valid number of pages.");
        return;
    }

    currentXP += pages;
    updateExperienceBar(currentXP);
    pagesCompletedInput.value = ""; // Clear input field
    alert(`Added ${pages} pages to your experience!`);
});

// Update the experience bar with Minecraft-style leveling
function updateExperienceBar(totalXP) {
    const level = Math.floor(totalXP / XP_PER_LEVEL);
    const progress = (totalXP % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
    experienceFill.style.width = `${progress}%`;
    experiencePointsSpan.textContent = `Level ${level} (${totalXP} XP)`;
}

// Logout functionality
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out successfully");
            alert("You have been logged out.");
        })
        .catch((error) => {
            console.error("Logout failed:", error.message);
            alert("Logout failed: " + error.message);
        });
});

// Handle adding wants to the shop
shopForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('want-description').value.trim();
    const cost = parseInt(document.getElementById('want-cost').value.trim());

    if (description === "" || isNaN(cost) || cost < 1) {
        alert("Please enter a valid description and cost.");
        return;
    }

    const wantItem = document.createElement('li');
    wantItem.classList.add('want-item');
    wantItem.innerHTML = `
        <span>${description} (Cost: ${cost} XP)</span>
        <button onclick="buyWant(${cost})">Buy</button>
    `;
    wantsList.appendChild(wantItem);
    shopForm.reset();
});

// Function to handle buying a want item
function buyWant(cost) {
    if (currentXP >= cost) {
        currentXP -= cost;
        updateExperienceBar(currentXP);
        alert("Item purchased successfully!");
    } else {
        alert("Not enough XP to purchase this item.");
    }
}
