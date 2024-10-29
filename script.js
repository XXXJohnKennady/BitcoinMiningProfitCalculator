// Import Firebase modules using ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration with user-provided details
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
