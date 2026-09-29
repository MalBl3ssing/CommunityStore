/* =========================
   SUPABASE
========================= */

const supabaseUrl =
    "https://olnqufovakusfjlaablt.supabase.co";

const supabaseKey =
    "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );


/* =========================
   ELEMENTS
========================= */

const savedGrid =
    document.getElementById("savedGrid");

const emptyState =
    document.getElementById("emptyState");

const loadingState =
    document.getElementById("loadingState");

const savedCount =
    document.getElementById("savedCount");

const savedSearch =
    document.getElementById("savedSearch");

const profileButton =
    document.getElementById("profileButton");

const logoutButton =
    document.getElementById("logoutButton");

const notificationButton =
    document.getElementById("notificationButton");

const userName =
    document.getElementById("userName");

const userType =
    document.getElementById("userType");

const profileAvatar =
    document.querySelector(".profile-avatar");


/* =========================
   GLOBAL DATA
========================= */

let currentUser = null;
let currentProfile = null;
let savedItems = [];


/* =========================
   LOAD CURRENT USER
========================= */

async function loadCurrentUser() {

    try {

        const {
            data: {
                user
            },
            error: authError
        } = await supabaseClient.auth.getUser();


        if (authError) {

            console.error(
                "Error getting logged-in user:",
                authError
            );

            return false;
        }


        if (!user) {

            window.location.href =
                "login.html";

            return false;
        }


        currentUser = user;


        /* =========================
           LOAD PROFILE
        ========================== */

        const {
            data: profile,
            error: profileError
        } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();


        if (profileError) {

            console.error(
                "Error loading profile:",
                profileError
            );

            currentProfile = null;

        } else {

            currentProfile = profile;

        }


        updateUserProfile();

        return true;


    } catch (error) {

        console.error(
            "Unexpected user loading error:",
            error
        );

        return false;
    }
}


/* =========================
   UPDATE USER PROFILE
========================= */

function updateUserProfile() {

    let fullName = "";


    /* Profile table */

    if (
        currentProfile &&
        currentProfile.full_name
    ) {

        fullName =
            String(
                currentProfile.full_name
            ).trim();

    }


    /* Auth metadata fallback */

    if (!fullName && currentUser) {

        fullName =
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name ||
            "";

    }


    /* Email fallback */

    if (
        !fullName &&
        currentUser?.email
    ) {

        fullName =
            currentUser.email.split("@")[0];

    }


    if (!fullName) {

        fullName = "User";

    }


    /* =========================
       USER TYPE
    ========================== */

    let type = "";


    if (
        currentProfile &&
        currentProfile.user_type
    ) {

        type =
            String(
                currentProfile.user_type
            ).trim();

    }


    if (!type && currentUser) {

        type =
            currentUser.user_metadata?.user_type ||
            "";

    }


    if (!type) {

        type = "Member";

    }


    /* =========================
       UPDATE NAME
    ========================== */

    if (userName) {

        userName.textContent =
            fullName;

    }


    /* =========================
       UPDATE TYPE
    ========================== */

    if (userType) {

        userType.textContent =
            type;

    }


    /* =========================
       UPDATE AVATAR
    ========================== */

    if (profileAvatar) {

        profileAvatar.innerHTML = "";

        const avatar =
            document.createElement("span");

        avatar.textContent =
            getInitials(fullName);

        profileAvatar.appendChild(
            avatar
        );

    }


    console.log(
        "Saved page user:",
        fullName
    );

    console.log(
        "Saved page user type:",
        type
    );

    console.log(
        "Saved page profile:",
        currentProfile
    );
}


/* =========================
   GET INITIALS
========================= */

function getInitials(name) {

    if (!name) {

        return "U";

    }


    const words =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}


/* =========================
   LOAD SAVED ITEMS
========================= */

async function loadSavedItems() {

    if (!currentUser) {

        return;

    }


    loadingState.style.display =
        "block";

    emptyState.style.display =
        "none";


    const {
        data: savedPosts,
        error: savedError
    } = await supabaseClient
        .from("saved_posts")
        .select(
            "id, post_id, created_at"
        )
        .eq(
            "user_id",
            currentUser.id
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (savedError) {

        console.error(
            "Error loading saved posts:",
            savedError
        );

        loadingState.textContent =
            "Unable to load saved items.";

        return;

    }


    if (
        !savedPosts ||
        savedPosts.length === 0
    ) {

        savedItems = [];

        loadingState.style.display =
            "none";

        savedGrid.innerHTML = "";

        savedCount.textContent =
            "0 items";

        emptyState.style.display =
            "block";

        return;

    }


    const postIds =
        savedPosts.map(
            item => item.post_id
        );


    const {
        data: posts,
        error: postsError
    } = await supabaseClient
        .from("posts")
        .select("*")
        .in(
            "id",
            postIds
        );


    if (postsError) {

        console.error(
            "Error loading posts:",
            postsError
        );

        loadingState.textContent =
            "Unable to load saved items.";

        return;

    }


    if (!posts || posts.length === 0) {

        savedItems = [];

        loadingState.style.display =
            "none";

        savedGrid.innerHTML = "";

        savedCount.textContent =
            "0 items";

        emptyState.style.display =
            "block";

        return;

    }


    /* =========================
       LOAD SELLER PROFILES
    ========================== */

    const sellerIds = [
        ...new Set(
            posts
                .map(
                    post => post.user_id
                )
                .filter(Boolean)
        )
    ];


    let profiles = [];


    /*
       Load each seller profile separately
       instead of using .in()
    */

    for (const sellerId of sellerIds) {

        const {
            data: sellerProfile,
            error: sellerError
        } = await supabaseClient
            .from("profiles")
            .select(
                "id, full_name, phone_number"
            )
            .eq(
                "id",
                sellerId
            )
            .maybeSingle();


        if (sellerError) {

            console.error(
                "Error loading seller profile:",
                sellerError
            );

            continue;

        }


        if (sellerProfile) {

            profiles.push(
                sellerProfile
            );

        }

    }


    /* =========================
       BUILD SAVED ITEMS
    ========================== */

    savedItems =
        savedPosts
            .map(saved => {

                const post =
                    posts.find(
                        item =>
                            item.id ===
                            saved.post_id
                    );


                if (!post) {

                    return null;

                }


                const seller =
                    profiles.find(
                        profile =>
                            profile.id ===
                            post.user_id
                    );


                return {
                    ...post,
                    savedId: saved.id,
                    savedAt: saved.created_at,
                    seller:
                        seller || null
                };

            })
            .filter(Boolean);


    loadingState.style.display =
        "none";


    renderSavedItems(
        savedItems
    );
}


/* =========================
   RENDER SAVED ITEMS
========================= */

function renderSavedItems(items) {

    savedGrid.innerHTML = "";


    savedCount.textContent =
        `${items.length} ${
            items.length === 1
                ? "item"
                : "items"
        }`;


    if (items.length === 0) {

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    items.forEach(item => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "saved-card";


        const sellerName =
            item.seller?.full_name ||
            "Community Member";


        const phone =
            item.seller?.phone_number ||
            item.phone_number ||
            "Not available";


        const title =
            item.title ||
            "Untitled item";


        const category =
            item.category ||
            "General";


        const price =
            item.price !== null &&
            item.price !== undefined
                ? `R${item.price}`
                : "Price not listed";


        const location =
            item.location ||
            "Location not specified";


        card.innerHTML = `

            <div class="saved-card-content">

                <span class="saved-category">
                    ${escapeHtml(category)}
                </span>

                <h3>
                    ${escapeHtml(title)}
                </h3>

                <p class="saved-price">
                    ${escapeHtml(price)}
                </p>

                <p class="saved-seller">
                    Seller:
                    ${escapeHtml(sellerName)}
                </p>

                <p class="saved-location">
                    ${escapeHtml(location)}
                </p>

                <p class="saved-phone">
                    ${escapeHtml(phone)}
                </p>

                <div class="saved-card-actions">

                    <button
                        type="button"
                        class="message-button"
                        data-seller-id="${item.user_id || ""}"
                        data-seller-name="${escapeHtml(sellerName)}"
                    >
                        Message
                    </button>

                    <button
                        type="button"
                        class="remove-saved-button"
                        data-saved-id="${item.savedId}"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;


        savedGrid.appendChild(
            card
        );

    });


    addSavedCardListeners();
}


/* =========================
   SAVED CARD BUTTONS
========================= */

function addSavedCardListeners() {

    document
        .querySelectorAll(
            ".remove-saved-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const savedId =
                        button.dataset.savedId;


                    await removeSavedItem(
                        savedId
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".message-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const sellerId =
                        button.dataset.sellerId;

                    const sellerName =
                        button.dataset.sellerName;


                    if (!sellerId) {

                        return;

                    }


                    window.location.href =
                        `inbox.html?sellerId=${encodeURIComponent(
                            sellerId
                        )}&sellerName=${encodeURIComponent(
                            sellerName
                        )}`;

                }
            );

        });
}


/* =========================
   REMOVE SAVED ITEM
========================= */

async function removeSavedItem(
    savedId
) {

    if (!currentUser) {

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("saved_posts")
        .delete()
        .eq(
            "id",
            savedId
        )
        .eq(
            "user_id",
            currentUser.id
        );


    if (error) {

        console.error(
            "Error removing saved item:",
            error
        );

        return;

    }


    savedItems =
        savedItems.filter(
            item =>
                item.savedId !==
                savedId
        );


    applySavedSearch();
}


/* =========================
   SEARCH SAVED ITEMS
========================= */

function applySavedSearch() {

    const searchTerm =
        savedSearch?.value
            ?.trim()
            .toLowerCase() || "";


    if (!searchTerm) {

        renderSavedItems(
            savedItems
        );

        return;

    }


    const filteredItems =
        savedItems.filter(
            item => {

                const title =
                    item.title
                        ?.toLowerCase() ||
                    "";

                const category =
                    item.category
                        ?.toLowerCase() ||
                    "";

                const seller =
                    item.seller
                        ?.full_name
                        ?.toLowerCase() ||
                    "";

                const location =
                    item.location
                        ?.toLowerCase() ||
                    "";


                return (
                    title.includes(
                        searchTerm
                    ) ||
                    category.includes(
                        searchTerm
                    ) ||
                    seller.includes(
                        searchTerm
                    ) ||
                    location.includes(
                        searchTerm
                    )
                );

            }
        );


    renderSavedItems(
        filteredItems
    );
}


if (savedSearch) {

    savedSearch.addEventListener(
        "input",
        applySavedSearch
    );

}


/* =========================
   PROFILE BUTTON
========================= */

if (profileButton) {

    profileButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "profile.html";

        }
    );

}


/* =========================
   LOGOUT
========================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async event => {

            event.preventDefault();


            const {
                error
            } = await supabaseClient
                .auth
                .signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                return;

            }


            window.location.href =
                "login.html";

        }
    );

}


/* =========================
   NOTIFICATIONS
========================= */

if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        () => {

            console.log(
                "Notifications clicked"
            );

        }
    );

}


/* =========================
   HTML ESCAPE
========================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================
   START
========================= */

async function init() {

    const userLoaded =
        await loadCurrentUser();


    if (!userLoaded) {

        return;

    }


    await loadSavedItems();

}


init();