const API_BASE_URL = "/api";
const USE_MOCK_DATA = true;


/* MOCK USER */

const MOCK_USER = {
    userId: 1,
    firstName: "Solomon",
    lastName: "Machaule",
    email: "solomonmachaule26@gmail.com",
    accountType: "Student"
};


/* ELEMENTS */

const profileName = document.getElementById("profileName");
const profileType = document.getElementById("profileType");
const userInitials = document.getElementById("userInitials");

const fullName = document.getElementById("fullName");
const emailAddress = document.getElementById("emailAddress");
const accountType = document.getElementById("accountType");

const searchInput = document.getElementById("searchInput");
const profileArea = document.getElementById("profileArea");
const notificationBtn = document.getElementById("notificationBtn");

const logoutBtn = document.getElementById("logoutBtn");
const logoutSettingsBtn = document.getElementById("logoutSettingsBtn");

const changePasswordBtn = document.getElementById("changePasswordBtn");
const securityBtn = document.getElementById("securityBtn");

const notificationToggle = document.getElementById("notificationToggle");
const sellerUpdatesToggle = document.getElementById("sellerUpdatesToggle");
const orderUpdatesToggle = document.getElementById("orderUpdatesToggle");


/* INITIALISE */

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    setupEvents();
});


/* LOAD USER */

async function loadSettings() {

    let user;

    if (USE_MOCK_DATA) {
        user = MOCK_USER;
    } else {
        user = await fetchCurrentUser();
    }

    if (!user) {
        return;
    }

    const name = `${user.firstName} ${user.lastName}`;

    profileName.textContent = name;
    profileType.textContent = user.accountType || "User";

    fullName.textContent = name;
    emailAddress.textContent = user.email || "Not available";
    accountType.textContent = user.accountType || "User";

    userInitials.textContent = getInitials(
        user.firstName,
        user.lastName
    );
}


/* INITIALS */

function getInitials(firstName, lastName) {

    const first = firstName
        ? firstName.charAt(0).toUpperCase()
        : "";

    const last = lastName
        ? lastName.charAt(0).toUpperCase()
        : "";

    return `${first}${last}`;
}


/* EVENTS */

function setupEvents() {

    searchInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            const query = searchInput.value.trim();

            if (query) {
                window.location.href =
                    `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });


    profileArea.addEventListener("click", () => {
        window.location.href = "profile.html";
    });


    notificationBtn.addEventListener("click", () => {
        console.log("Notifications clicked.");
    });


    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        handleLogout();
    });


    logoutSettingsBtn.addEventListener("click", () => {
        handleLogout();
    });


    changePasswordBtn.addEventListener("click", () => {
        alert("Password management will be connected to the backend.");
    });


    securityBtn.addEventListener("click", () => {
        alert("Security settings will be connected to the backend.");
    });


    notificationToggle.addEventListener("change", () => {
        console.log(
            "Notifications:",
            notificationToggle.checked
        );
    });


    sellerUpdatesToggle.addEventListener("change", () => {
        console.log(
            "Seller updates:",
            sellerUpdatesToggle.checked
        );
    });


    orderUpdatesToggle.addEventListener("change", () => {
        console.log(
            "Order updates:",
            orderUpdatesToggle.checked
        );
    });
}


/* LOGOUT */

function handleLogout() {

    const confirmed = confirm(
        "Are you sure you want to log out?"
    );

    if (!confirmed) {
        return;
    }

    /*
     * Backend integration placeholder.
     *
     * Future endpoint:
     * POST /api/auth/logout
     */

    console.log("Logout requested.");

    window.location.href = "login.html";
}


/* BACKEND PLACEHOLDER */

async function fetchCurrentUser() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/users/me`
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load user information."
            );
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Error loading user:",
            error
        );

        return null;
    }
}