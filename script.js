// script.js

// Import Firebase modules using ES Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    updateEmail,
    updatePassword,
    deleteUser
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove, 
    query, 
    orderBy, 
    limit, 
    getDocs,
    deleteDoc,
    collection
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", // Replace with your Firebase API key
  authDomain: "life-is-a-game-c63e8.firebaseapp.com",
  projectId: "life-is-a-game-c63e8",
  storageBucket: "life-is-a-game-c63e8.appspot.com",
  messagingSenderId: "811209861596",
  appId: "1:811209861596:web:797afa123b21f211264719"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* 
    ===========================
            DOM Elements
    ===========================
*/
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const dashboardSection = document.getElementById('dashboard-section');
const profileSection = document.getElementById('profile-section');

const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar');

const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const userEmailSpan = document.getElementById('user-email');

const packetForm = document.getElementById('packet-form');
const pagesInput = document.getElementById('pages');
const experienceFill = document.getElementById('experience-fill');
const experiencePointsSpan = document.getElementById('experience-points');

const shopForm = document.getElementById('shop-form');
const wantsList = document.getElementById('wants-list');

const badgesList = document.getElementById('badges-list');

const leaderboardList = document.getElementById('leaderboard-list');

const logoutButton = document.getElementById('logout-button');

const notificationModal = document.getElementById('notification-modal');
const notificationMessage = document.getElementById('notification-message');

const confirmationModal = document.getElementById('confirmation-modal');
const confirmationMessage = document.getElementById('confirmation-message');
const confirmActionBtn = document.getElementById('confirm-action');
const cancelActionBtn = document.getElementById('cancel-action');

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

const welcomeDescription = document.getElementById('welcome-description');

/* 
    ===========================
        Utility Functions
    ===========================
*/

// Function to display notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    // Automatically remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to open modals
function openModal(modal, message) {
    if (message) {
        if (modal === notificationModal) {
            notificationMessage.textContent = message;
        } else if (modal === confirmationModal) {
            confirmationMessage.textContent = message;
        }
    }
    modal.classList.remove('hidden');
}

// Function to close modals
function closeModal(modal) {
    modal.classList.add('hidden');
}

// Function to fetch top users for leaderboard
async function fetchLeaderboard() {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("experience", "desc"), limit(10));
    try {
        const querySnapshot = await getDocs(q);
        leaderboardList.innerHTML = "";
        let rank = 1;
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${rank}. <img src="assets/avatars/default-avatar.png" alt="Avatar" class="avatar"> ${data.email}</span>
                <span>${data.experience} XP</span>
            `;
            leaderboardList.appendChild(li);
            rank++;
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        showNotification("Failed to load leaderboard.");
    }
}

/* 
    ===========================
        Event Listeners
    ===========================
*/

// Open Sidebar
openSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('hidden');
});

// Close Sidebar
closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('hidden');
});

// Show Register Section
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

// Show Login Section
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Handle Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!email || !password) {
        showNotification("Please enter both email and password.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Initialize user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            experience: 0,
            wants: [],
            badges: [],
            createdAt: new Date()
        });

        // Reset form and navigate to dashboard
        registerForm.reset();
        registerSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        userEmailSpan.textContent = email;
        updateExperienceBar(0);
        loadWants();
        loadBadges();
        fetchLeaderboard();
        showNotification("Registration successful! Welcome to Life Is A Game.");
    } catch (error) {
        console.error("Registration Error:", error);
        showNotification(error.message);
    }
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        showNotification("Please enter both email and password.");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Reset form and navigate to dashboard
        loginForm.reset();
    } catch (error) {
        console.error("Login Error:", error);
        showNotification(error.message);
    }
});

// Handle Logout
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showNotification("Logged out successfully.");
    } catch (error) {
        console.error("Logout Error:", error);
        showNotification(error.message);
    }
});

// Handle Adding Experience
packetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pages = parseInt(pagesInput.value.trim());

    if (isNaN(pages) || pages < 1) {
        showNotification("Please enter a valid number of pages.");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        try {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                let currentExp = userDoc.data().experience;
                currentExp += pages; // 1 page = 1 XP
                if (currentExp > 1000) currentExp = 1000; // Max XP
                await updateDoc(userRef, {
                    experience: currentExp
                });
                packetForm.reset();
                updateExperienceBar(currentExp);
                checkForBadges(currentExp);
                showNotification(`Added ${pages} XP!`);
            }
        } catch (error) {
            console.error("Error Adding Experience:", error);
            showNotification("Failed to add experience.");
        }
    }
});

// Handle Adding Want to Shop
shopForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('want-description').value.trim();
    const cost = parseInt(document.getElementById('want-cost').value.trim());

    if (description === "" || isNaN(cost) || cost < 1) {
        showNotification("Please enter a valid description and cost.");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        try {
            const want = {
                id: Date.now(),
                description: description,
                cost: cost
            };
            await updateDoc(doc(db, "users", user.uid), {
                wants: arrayUnion(want)
            });
            shopForm.reset();
            loadWants();
            showNotification("Added new item to shop.");
        } catch (error) {
            console.error("Error Adding Want:", error);
            showNotification("Failed to add item to shop.");
        }
    }
});

// Handle Buying Want
wantsList.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
        const wantId = parseInt(e.target.getAttribute('data-id'));
        const user = auth.currentUser;

        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const want = data.wants.find(w => w.id === wantId);
                    if (want) {
                        const requiredXP = want.cost; // Assuming cost is in XP
                        if (data.experience >= requiredXP) {
                            const newExp = data.experience - requiredXP;
                            // Update experience and remove want
                            await updateDoc(userRef, {
                                experience: newExp,
                                wants: arrayRemove(want)
                            });
                            showNotification(`Purchased: ${want.description}`);
                            updateExperienceBar(newExp);
                            loadWants();
                            checkForBadges(newExp);
                        } else {
                            showNotification("Not enough XP to purchase this item.");
                        }
                    }
                }
            } catch (error) {
                console.error("Error Purchasing Want:", error);
                showNotification("Failed to purchase item.");
            }
        }
    }
});

// Handle Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeIcon.textContent = "☀️";
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.textContent = "🌙";
        localStorage.setItem('theme', 'dark');
    }
});

/* 
    ===========================
        Authentication State
    ===========================
*/
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginSection.classList.add('hidden');
        registerSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        profileSection.classList.add('hidden');
        userEmailSpan.textContent = user.email;
        updateExperienceBar(0);
        loadWants();
        loadBadges();
        fetchLeaderboard();
        displayWelcomeMessage();
    } else {
        // User is signed out
        loginSection.classList.remove('hidden');
        registerSection.classList.add('hidden');
        dashboardSection.classList.add('hidden');
        profileSection.classList.add('hidden');
        userEmailSpan.textContent = 'User';
        badgesList.innerHTML = '';
        leaderboardList.innerHTML = '';
        welcomeDescription.innerHTML = '';
    }
});

/* 
    ===========================
        Experience & Badges
    ===========================
*/

// Update Experience Bar
async function updateExperienceBar(exp) {
    // Calculate current level based on XP
    const level = Math.floor(exp / 100);
    const progress = exp % 100;
    experienceFill.style.width = `${progress}%`;
    experienceFill.textContent = `${level}`;
    experiencePointsSpan.textContent = `${exp} XP`;

    // Remove previous level classes
    experienceFill.classList.remove('level-1', 'level-2', 'level-3', 'level-4');

    // Add new level class based on current level
    if (level === 1) {
        experienceFill.classList.add('level-1');
    } else if (level === 2) {
        experienceFill.classList.add('level-2');
    } else if (level === 3) {
        experienceFill.classList.add('level-3');
    } else if (level >= 4) {
        experienceFill.classList.add('level-4');
    }
}

// Check and Award Badges
async function checkForBadges(exp) {
    const user = auth.currentUser;
    if (user) {
        try {
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const badges = userDoc.data().badges;
                const newBadges = [];

                // Define badge thresholds
                const badgeThresholds = [
                    { exp: 100, badge: 'Beginner' },
                    { exp: 300, badge: 'Intermediate' },
                    { exp: 600, badge: 'Advanced' },
                    { exp: 1000, badge: 'Expert' }
                ];

                badgeThresholds.forEach(threshold => {
                    if (exp >= threshold.exp && !badges.includes(threshold.badge)) {
                        newBadges.push(threshold.badge);
                        // Optionally, assign badge images here
                    }
                });

                if (newBadges.length > 0) {
                    await updateDoc(userRef, {
                        badges: arrayUnion(...newBadges)
                    });
                    loadBadges();
                    showNotification(`Congratulations! You've earned new badge(s): ${newBadges.join(', ')}`);
                }
            }
        } catch (error) {
            console.error("Error checking badges:", error);
            showNotification("Failed to check badges.");
        }
    }
}

// Load Badges
async function loadBadges() {
    const user = auth.currentUser;
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const badges = userDoc.data().badges;
                badgesList.innerHTML = "";

                if (badges.length === 0) {
                    badgesList.innerHTML = "<p>You have no badges yet. Start earning XP to unlock badges!</p>";
                    return;
                }

                badges.forEach(badge => {
                    const badgeDiv = document.createElement('div');
                    badgeDiv.classList.add('badge');
                    badgeDiv.setAttribute('data-badge', badge);
                    badgeDiv.innerHTML = `
                        <img src="assets/badges/${badge.toLowerCase()}.png" alt="${badge} Badge">
                    `;
                    badgesList.appendChild(badgeDiv);
                });
            }
        } catch (error) {
            console.error("Error loading badges:", error);
            showNotification("Failed to load badges.");
        }
    }
}

/* 
    ===========================
        Shop & Leaderboard
    ===========================
*/

/* These functions are already included above */

/* 
    ===========================
        Modals Handling
    ===========================
*/

// Close Modals on 'X' click
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(notificationModal);
        closeModal(confirmationModal);
    });
});

// Close Modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === notificationModal) {
        closeModal(notificationModal);
    }
    if (e.target === confirmationModal) {
        closeModal(confirmationModal);
    }
});

// Handle Confirmation Actions
confirmActionBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        try {
            // Delete user data from Firestore
            await deleteDoc(doc(db, "users", user.uid));
            // Delete user from Firebase Authentication
            await deleteUser(user);
            showNotification("Account deleted successfully.");
            closeModal(confirmationModal);
        } catch (error) {
            console.error("Account Deletion Error:", error);
            showNotification(error.message);
            closeModal(confirmationModal);
        }
    }
});

cancelActionBtn.addEventListener('click', () => {
    closeModal(confirmationModal);
});

/* 
    ===========================
        Welcome Description
    ===========================
*/

// Display Welcome Message with Description
function displayWelcomeMessage() {
    const user = auth.currentUser;
    if (user) {
        welcomeDescription.innerHTML = `
            <p>Welcome to <strong>Life Is A Game</strong>, <strong>${user.email}</strong>!</p>
            <p>Here's how you can get started:</p>
            <ul>
                <li><strong>Track Your Progress:</strong> Add the number of pages you've completed to earn experience points.</li>
                <li><strong>Upgrade Your Experience:</strong> Accumulate experience points to level up and unlock new features.</li>
                <li><strong>Earn Badges:</strong> Reach certain experience milestones to earn badges and showcase your achievements.</li>
                <li><strong>Shop for Rewards:</strong> Use your experience points to purchase items from the shop that can help you in your journey.</li>
                <li><strong>Check Leaderboard:</strong> See how you rank against other players and strive to reach the top!</li>
                <li><strong>Customize Settings:</strong> Adjust your preferences in the settings section to enhance your experience.</li>
            </ul>
            <p>Embark on this journey and make your life a rewarding adventure!</p>
        `;
    }
}

/* 
    ===========================
        Firebase Collection
    ===========================
*/
import { collection } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

/* 
    ===========================
        Initialization
    ===========================
*/

// Initial Load Functions
async function initializeDashboard() {
    const user = auth.currentUser;
    if (user) {
        userEmailSpan.textContent = user.email;
        await fetchExperience();
        await loadWants();
        await loadBadges();
        await fetchLeaderboard();
        displayWelcomeMessage();
    }
}

// Call initializeDashboard on auth state change
onAuthStateChanged(auth, (user) => {
    if (user) {
        initializeDashboard();
    }
});

/* 
    ===========================
        Additional Features
    ===========================
*/

// Handle Navigation to Profile
document.getElementById('nav-profile').addEventListener('click', (e) => {
    e.preventDefault();
    dashboardSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
});

// Handle Profile Form Submission
const profileForm = document.getElementById('profile-form');
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newEmail = document.getElementById('profile-email').value.trim();
    const newPassword = document.getElementById('profile-password').value.trim();

    const user = auth.currentUser;
    if (user) {
        try {
            if (newEmail) {
                await updateEmail(user, newEmail);
                await updateDoc(doc(db, "users", user.uid), {
                    email: newEmail
                });
            }
            if (newPassword) {
                await updatePassword(user, newPassword);
            }
            showNotification("Profile updated successfully.");
            profileForm.reset();
        } catch (error) {
            console.error("Profile Update Error:", error);
            showNotification(error.message);
        }
    }
});

// Handle Account Deletion
document.getElementById('delete-account').addEventListener('click', (e) => {
    e.preventDefault();
    openModal(confirmationModal, "Are you sure you want to delete your account? This action cannot be undone.");
});
