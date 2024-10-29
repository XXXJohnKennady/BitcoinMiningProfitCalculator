// Import Firebase modules using ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = { apiKey: "YOUR_API_KEY_HERE", authDomain: "life-is-a-game-c63e8.firebaseapp.com" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sections and Form Elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

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

// Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        // Add functionality to redirect to a dashboard or similar
    } else {
        loginSection.classList.remove('hidden');
    }
});
