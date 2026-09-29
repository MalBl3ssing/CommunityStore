document.addEventListener("DOMContentLoaded", async function () {

    // =========================
    // SUPABASE
    // =========================

    const supabaseUrl =
        "https://olnqufovakusfjlaablt.supabase.co";

    const supabaseKey =
        "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

    const supabaseClient =
        window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );


    // =========================
    // GET LOGGED-IN USER
    // =========================

    async function loadUser() {

        try {

            const {
                data: { user },
                error
            } = await supabaseClient.auth.getUser();


            if (error) {
                throw error;
            }


            if (!user) {

                window.location.href =
                    "login.html";

                return null;
            }


            // =========================
            // GET PROFILE
            // =========================

            let profile = null;


            const {
                data: profileData,
                error: profileError
            } = await supabaseClient
                .from("profiles")
                .select("full_name, user_type")
                .eq("id", user.id)
                .maybeSingle();


            if (profileError) {

                console.error(
                    "Profile loading error:",
                    profileError
                );

            } else {

                profile = profileData;

            }


            // =========================
            // USER NAME
            // =========================

            const fullName =
                profile?.full_name ||
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                getNameFromEmail(user.email) ||
                "User";


            // =========================
            // USER TYPE
            // =========================

            const userType =
                profile?.user_type ||
                user.user_metadata?.user_type ||
                "Account";


            // =========================
            // USER EMAIL
            // =========================

            const email =
                user.email || "Not provided";


            return {
                id: user.id,
                fullName: fullName,
                userType: userType,
                email: email
            };


        } catch (error) {

            console.error(
                "Error loading logged-in user:",
                error
            );


            window.location.href =
                "login.html";


            return null;
        }
    }


    const user = await loadUser();


    if (!user) {
        return;
    }


    console.log(
        "Profile page user:",
        user
    );


    // =========================
    // FORMAT USER TYPE
    // =========================

    function formatUserType(type) {

        if (!type) {
            return "Account";
        }


        return String(type)
            .charAt(0)
            .toUpperCase() +
            String(type).slice(1);
    }


    const displayUserType =
        formatUserType(user.userType);


    // =========================
    // TOP PROFILE
    // =========================

    const userName =
        document.getElementById("userName");

    const userType =
        document.getElementById("userType");


    if (userName) {

        userName.textContent =
            user.fullName;
    }


    if (userType) {

        userType.textContent =
            displayUserType;
    }


    // =========================
    // TOP PROFILE AVATAR
    // =========================

    const topAvatar =
        document.querySelector(
            "#profileButton .profile-avatar span"
        );


    if (topAvatar) {

        topAvatar.textContent =
            getInitials(user.fullName);
    }


    // =========================
    // PROFILE DETAILS
    // =========================

    const profileName =
        document.getElementById("profileName");

    const profileUserType =
        document.getElementById("profileUserType");

    const profileEmail =
        document.getElementById("profileEmail");


    if (profileName) {

        profileName.textContent =
            user.fullName;
    }


    if (profileUserType) {

        profileUserType.textContent =
            displayUserType;
    }


    if (profileEmail) {

        profileEmail.textContent =
            user.email;
    }


    // =========================
    // LARGE PROFILE AVATAR
    // =========================

    const largeAvatar =
        document.querySelector(
            ".large-profile-avatar span"
        );


    if (largeAvatar) {

        largeAvatar.textContent =
            getInitials(user.fullName);
    }


    // =========================
    // ACCOUNT INFORMATION
    // =========================

    const accountName =
        document.getElementById("accountName");

    const accountEmail =
        document.getElementById("accountEmail");

    const accountUserType =
        document.getElementById("accountUserType");


    if (accountName) {

        accountName.textContent =
            user.fullName;
    }


    if (accountEmail) {

        accountEmail.textContent =
            user.email;
    }


    if (accountUserType) {

        accountUserType.textContent =
            displayUserType;
    }


    // =========================
    // PROFILE BUTTON
    // =========================

    const profileButton =
        document.getElementById("profileButton");


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "profile.html";

            }
        );
    }


    // =========================
    // LOGOUT
    // =========================

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();


                try {

                    const {
                        error
                    } = await supabaseClient.auth.signOut();


                    if (error) {
                        throw error;
                    }


                    window.location.href =
                        "login.html";


                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );


                    alert(
                        "Unable to log out. Please try again."
                    );
                }

            }
        );
    }


    // =========================
    // SEARCH
    // =========================

    const profileSearch =
        document.getElementById("profileSearch");


    if (profileSearch) {

        profileSearch.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Enter") {
                    return;
                }


                const query =
                    profileSearch.value.trim();


                if (!query) {
                    return;
                }


                window.location.href =
                    `search.html?q=${encodeURIComponent(query)}`;

            }
        );
    }


    // =========================
    // NOTIFICATIONS
    // =========================

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Notifications clicked."
                );

            }
        );
    }


    // =========================
    // BROWSE MARKETPLACE
    // =========================

    const browseButton =
        document.getElementById(
            "browseButton"
        );


    if (browseButton) {

        browseButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "home.html";

            }
        );
    }


    // =========================
    // SELL AN ITEM
    // =========================

    const createListingButton =
        document.getElementById(
            "createListingButton"
        );


    if (createListingButton) {

        createListingButton.addEventListener(
            "click",
            function () {

                alert(
                    "The Sell an Item page will be connected soon."
                );

            }
        );
    }


    // =========================
    // VIEW LISTINGS
    // =========================

    const viewListingsButton =
        document.getElementById(
            "viewListingsButton"
        );


    if (viewListingsButton) {

        viewListingsButton.addEventListener(
            "click",
            function () {

                alert(
                    "Your listings page will be connected soon."
                );

            }
        );
    }


    // =========================
    // VIEW SAVED ITEMS
    // =========================

    const viewSavedButton =
        document.getElementById(
            "viewSavedButton"
        );


    if (viewSavedButton) {

        viewSavedButton.addEventListener(
            "click",
            function () {

                alert(
                    "Your saved items page will be connected soon."
                );

            }
        );
    }


    // =========================
    // SETTINGS
    // =========================

    const settingsButton =
        document.getElementById(
            "settingsButton"
        );


    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "settings.html";

            }
        );
    }


    // =========================
    // CHAT
    // =========================

    const chatButton =
        document.getElementById(
            "chatButton"
        );


    if (chatButton) {

        chatButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "chat.html";

            }
        );
    }


    // =========================
    // HELP
    // =========================

    const helpButton =
        document.getElementById(
            "helpButton"
        );


    if (helpButton) {

        helpButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "help.html";

            }
        );
    }


    // =========================
    // EDIT PROFILE
    // =========================

    const editProfileButton =
        document.getElementById(
            "editProfileButton"
        );

    const accountEditButton =
        document.getElementById(
            "accountEditButton"
        );


    function editProfile() {

        alert(
            "Profile editing will be connected soon."
        );

    }


    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            editProfile
        );
    }


    if (accountEditButton) {

        accountEditButton.addEventListener(
            "click",
            editProfile
        );
    }


    // =========================
    // HELPERS
    // =========================

    function getInitials(name) {

        const parts =
            String(name)
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (parts.length === 0) {
            return "--";
        }


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }


    function getNameFromEmail(email) {

        if (!email) {
            return "";
        }


        const username =
            email.split("@")[0];


        return username
            .replace(/[._-]+/g, " ")
            .replace(/\b\w/g, function (char) {
                return char.toUpperCase();
            });
    }

});