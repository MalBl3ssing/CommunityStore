/* =========================
   SUPABASE
========================= */

const SUPABASE_URL = "https://olnqufovakusfjlaablt.supabase.co";
const SUPABASE_KEY = "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================
   ELEMENTS
========================= */

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


/* =========================
   INITIALISE
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    await loadUser();
    setupEvents();
});


/* =========================
   LOAD LOGGED-IN USER
========================= */

async function loadUser() {

    try {

        const {
            data: { user },
            error: authError
        } = await supabaseClient.auth.getUser();

        if (authError) {
            console.error("Authentication error:", authError);
            return;
        }

        if (!user) {
            window.location.href = "login.html";
            return;
        }


        /* =========================
           LOAD PROFILE
        ========================= */

        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("full_name, user_type")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
            console.error("Profile error:", profileError);
        }


        /* =========================
           NAME
        ========================= */

        let name = "";

        if (profile?.full_name) {
            name = profile.full_name.trim();
        }

        if (!name) {
            name =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                "";
        }

        if (!name && user.email) {
            name = getNameFromEmail(user.email);
        }

        if (!name) {
            name = "User";
        }


        /* =========================
           USER TYPE
        ========================= */

        let type = "";

        if (profile?.user_type) {
            type = profile.user_type.trim();
        }

        if (!type) {
            type =
                user.user_metadata?.user_type ||
                user.user_metadata?.account_type ||
                user.user_metadata?.role ||
                "";
        }

        if (!type) {
            type = "User";
        }


        /* =========================
           EMAIL
        ========================= */

        const email = user.email || "Not available";


        /* =========================
           INITIALS
        ========================= */

        const initials = getInitials(name);


        /* =========================
           UPDATE TOP RIGHT
        ========================= */

        if (profileName) {
            profileName.textContent = name;
        }

        if (profileType) {
            profileType.textContent = type;
        }

        if (userInitials) {
            userInitials.textContent = initials;
        }


        /* =========================
           UPDATE ACCOUNT INFORMATION
        ========================= */

        if (fullName) {
            fullName.textContent = name;
        }

        if (emailAddress) {
            emailAddress.textContent = email;
        }

        if (accountType) {
            accountType.textContent = type;
        }


        console.log("Settings page user:", {
            id: user.id,
            fullName: name,
            userType: type,
            email: email
        });

    } catch (error) {

        console.error("Error loading user:", error);
    }
}


/* =========================
   INITIALS
========================= */

function getInitials(name) {

    if (!name) {
        return "U";
    }

    const parts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

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


/* =========================
   EMAIL → NAME FALLBACK
========================= */

function getNameFromEmail(email) {

    const username = email
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .trim();

    return username
        .split(/\s+/)
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ");
}


/* =========================
   EVENTS
========================= */

function setupEvents() {

    if (searchInput) {
        searchInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {

                const query = searchInput.value.trim();

                if (query) {
                    window.location.href =
                        `search.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }


    if (profileArea) {
        profileArea.addEventListener("click", () => {
            window.location.href = "profile.html";
        });
    }


    if (notificationBtn) {
        notificationBtn.addEventListener("click", () => {
            console.log("Notifications clicked.");
        });
    }


    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            handleLogout();
        });
    }


    if (logoutSettingsBtn) {
        logoutSettingsBtn.addEventListener("click", () => {
            handleLogout();
        });
    }


    if (changePasswordBtn) {
        changePasswordBtn.addEventListener("click", () => {
            alert("Password management will be connected to the backend.");
        });
    }


    if (securityBtn) {
        securityBtn.addEventListener("click", () => {
            alert("Security settings will be connected to the backend.");
        });
    }


    if (notificationToggle) {
        notificationToggle.addEventListener("change", () => {
            console.log("Notifications:", notificationToggle.checked);
        });
    }


    if (sellerUpdatesToggle) {
        sellerUpdatesToggle.addEventListener("change", () => {
            console.log("Seller updates:", sellerUpdatesToggle.checked);
        });
    }


    if (orderUpdatesToggle) {
        orderUpdatesToggle.addEventListener("change", () => {
            console.log("Order updates:", orderUpdatesToggle.checked);
        });
    }
}


/* =========================
   LOGOUT
========================= */

async function handleLogout() {

    const confirmed = confirm(
        "Are you sure you want to log out?"
    );

    if (!confirmed) {
        return;
    }

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error);
        return;
    }

    window.location.href = "login.html";
}