// =========================
// PROFILE PAGE
// =========================

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // GET REGISTERED USER
    // =========================

    const savedUser = localStorage.getItem("communityStoreUser");

    if (!savedUser) {
        // No registered user found
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(savedUser);


    // =========================
    // FORMAT USER TYPE
    // =========================

    function formatUserType(type) {
        if (!type) {
            return "Account";
        }

        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    const displayUserType = formatUserType(user.userType);


    // =========================
    // TOP PROFILE
    // =========================

    const userName = document.getElementById("userName");
    const userType = document.getElementById("userType");

    if (userName) {
        userName.textContent = user.fullName;
    }

    if (userType) {
        userType.textContent = displayUserType;
    }


    // =========================
    // PROFILE DETAILS
    // =========================

    const profileName = document.getElementById("profileName");
    const profileUserType = document.getElementById("profileUserType");
    const profileEmail = document.getElementById("profileEmail");

    if (profileName) {
        profileName.textContent = user.fullName;
    }

    if (profileUserType) {
        profileUserType.textContent = displayUserType;
    }

    if (profileEmail) {
        profileEmail.textContent = user.email;
    }


    // =========================
    // ACCOUNT INFORMATION
    // =========================

    const accountName = document.getElementById("accountName");
    const accountEmail = document.getElementById("accountEmail");
    const accountUserType = document.getElementById("accountUserType");

    if (accountName) {
        accountName.textContent = user.fullName;
    }

    if (accountEmail) {
        accountEmail.textContent = user.email;
    }

    if (accountUserType) {
        accountUserType.textContent = displayUserType;
    }


    // =========================
    // PROFILE BUTTON
    // =========================

    const profileButton = document.getElementById("profileButton");

    if (profileButton) {
        profileButton.addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }


    // =========================
    // LOGOUT
    // =========================

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {

            event.preventDefault();

            // Remove current login session
            sessionStorage.removeItem("communityStoreCurrentUser");

            // Send user back to login
            window.location.href = "login.html";
        });
    }


    // =========================
    // BROWSE MARKETPLACE
    // =========================

    const browseButton = document.getElementById("browseButton");

    if (browseButton) {
        browseButton.addEventListener("click", function () {
            window.location.href = "home.html";
        });
    }


    // =========================
    // SELL AN ITEM
    // =========================

    const createListingButton =
        document.getElementById("createListingButton");

    if (createListingButton) {
        createListingButton.addEventListener("click", function () {
            alert("The Sell an Item page will be connected soon.");
        });
    }


    // =========================
    // VIEW LISTINGS
    // =========================

    const viewListingsButton =
        document.getElementById("viewListingsButton");

    if (viewListingsButton) {
        viewListingsButton.addEventListener("click", function () {
            alert("Your listings page will be connected soon.");
        });
    }


    // =========================
    // VIEW SAVED ITEMS
    // =========================

    const viewSavedButton =
        document.getElementById("viewSavedButton");

    if (viewSavedButton) {
        viewSavedButton.addEventListener("click", function () {
            alert("Your saved items page will be connected soon.");
        });
    }


    // =========================
    // SETTINGS
    // =========================

    const settingsButton =
        document.getElementById("settingsButton");

    if (settingsButton) {
        settingsButton.addEventListener("click", function () {
            alert("Settings page will be connected soon.");
        });
    }


    // =========================
    // CHAT
    // =========================

    const chatButton =
        document.getElementById("chatButton");

    if (chatButton) {
        chatButton.addEventListener("click", function () {
            alert("Messages page will be connected soon.");
        });
    }


    // =========================
    // HELP
    // =========================

    const helpButton =
        document.getElementById("helpButton");

    if (helpButton) {
        helpButton.addEventListener("click", function () {
            alert("Help & Support page will be connected soon.");
        });
    }


    // =========================
    // EDIT PROFILE
    // =========================

    const editProfileButton =
        document.getElementById("editProfileButton");

    const accountEditButton =
        document.getElementById("accountEditButton");

    function editProfile() {
        alert("Profile editing will be connected soon.");
    }

    if (editProfileButton) {
        editProfileButton.addEventListener("click", editProfile);
    }

    if (accountEditButton) {
        accountEditButton.addEventListener("click", editProfile);
    }

});