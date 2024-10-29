// script.js

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    // storageBucket: "YOUR_PROJECT_ID.appspot.com",
    // messagingSenderId: "YOUR_SENDER_ID",
    // appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const calculatorSection = document.getElementById('calculator-section');

const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const packetForm = document.getElementById('packet-form');
const shopForm = document.getElementById('shop-form');
const wantsList = document.getElementById('wants-list');

const experienceFill = document.getElementById('experience-fill');

// Event Listeners for Navigation
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// User Authentication

// Register User
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((cred) => {
            // Initialize user data
            return db.collection('users').doc(cred.user.uid).set({
                experience: 0,
                wants: []
            });
        })
        .then(() => {
            registerForm.reset();
            registerSection.classList.add('hidden');
            calculatorSection.classList.remove('hidden');
            updateExperienceBar(0);
            loadWants();
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Login User
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            loginForm.reset();
            loginSection.classList.add('hidden');
            calculatorSection.classList.remove('hidden');
            fetchExperience();
            loadWants();
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Logout User (Optional: You can add a logout button if needed)

// Auth State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        calculatorSection.classList.remove('hidden');
        fetchExperience();
        loadWants();
    } else {
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        calculatorSection.classList.add('hidden');
    }
});

// Experience Tracking

// Fetch Experience from Firestore
function fetchExperience() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    updateExperienceBar(data.experience);
                }
            });
    }
}

// Update Experience in Firestore
function updateExperience(newExp) {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({
            experience: newExp
        })
            .then(() => {
                updateExperienceBar(newExp);
            })
            .catch((error) => {
                console.error("Error updating experience: ", error);
            });
    }
}

// Update Experience Bar UI
function updateExperienceBar(exp) {
    const level = Math.floor(exp / 100);
    const progress = (exp % 100);
    experienceFill.style.width = `${progress}%`;
    experienceFill.innerText = `${level} / ${level + 1}`;
}

// Add Packet Pages
packetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pages = parseInt(document.getElementById('pages').value);
    if (isNaN(pages) || pages < 1) {
        alert("Please enter a valid number of pages.");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    let currentExp = doc.data().experience;
                    currentExp += pages; // 1 page = 1 experience point
                    return db.collection('users').doc(user.uid).update({
                        experience: currentExp
                    });
                }
            })
            .then(() => {
                packetForm.reset();
                fetchExperience();
            })
            .catch((error) => {
                console.error("Error adding experience: ", error);
            });
    }
});

// Shop Functionality

// Add Want
shopForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = document.getElementById('want-description').value.trim();
    const cost = parseInt(document.getElementById('want-cost').value);

    if (description === "" || isNaN(cost) || cost < 1) {
        alert("Please enter a valid description and cost.");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).update({
            wants: firebase.firestore.FieldValue.arrayUnion({
                id: Date.now(),
                description: description,
                cost: cost
            })
        })
            .then(() => {
                shopForm.reset();
                loadWants();
            })
            .catch((error) => {
                console.error("Error adding want: ", error);
            });
    }
});

// Load Wants from Firestore
function loadWants() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    const wants = data.wants;
                    wantsList.innerHTML = "";
                    wants.forEach((want) => {
                        const li = document.createElement('li');
                        li.classList.add('want-item');
                        li.innerHTML = `
                            <span>${want.description} (Cost: ${want.cost} Levels)</span>
                            <button data-id="${want.id}">Buy</button>
                        `;
                        wantsList.appendChild(li);
                    });
                }
            });
    }
}

// Handle Buy Want
wantsList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const wantId = e.target.getAttribute('data-id');
        const user = auth.currentUser;

        if (user) {
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        const wants = data.wants;
                        const want = wants.find(w => w.id == wantId);
                        if (want) {
                            const currentExp = data.experience;
                            if (currentExp >= want.cost * 100) { // Assuming 1 level = 100 exp
                                const newExp = currentExp - (want.cost * 100);
                                // Update experience
                                db.collection('users').doc(user.uid).update({
                                    experience: newExp,
                                    wants: firebase.firestore.FieldValue.arrayRemove(want)
                                })
                                    .then(() => {
                                        alert(`You have purchased: ${want.description}`);
                                        fetchExperience();
                                        loadWants();
                                    });
                            } else {
                                alert("Not enough experience points to purchase this item.");
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error purchasing want: ", error);
                });
        }
    }
});
