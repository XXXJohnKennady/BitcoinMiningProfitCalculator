// Import Firebase modules using ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
const firebaseConfig = { apiKey: "YOUR_API_KEY_HERE", authDomain: "life-is-a-game-c63e8.firebaseapp.com" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
onAuthStateChanged(auth, (user) => {
    if (user) { loginSection.classList.add('hidden'); dashboardSection.classList.remove('hidden'); }
    else { loginSection.classList.remove('hidden'); dashboardSection.classList.add('hidden'); }
});
