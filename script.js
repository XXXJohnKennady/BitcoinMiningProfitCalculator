// Import Firebase modules using ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

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
            // Additional code can go here for redirecting to dashboard or main content
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
    } else {
        console.log("No user logged in, displaying login section");
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
    }
});
