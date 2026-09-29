/* =========================
   SEARCH PAGE
========================= */

document.addEventListener("DOMContentLoaded", async function () {

    /* =========================
       SUPABASE
    ========================== */

    const SUPABASE_URL =
        "https://olnqufovakusfjlaablt.supabase.co";

    const SUPABASE_ANON_KEY =
        "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );


    /* =========================
       ELEMENTS
    ========================== */

    const searchInput =
        document.getElementById("searchInput");

    const productSearchInput =
        document.getElementById("productSearchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const clearSearchButton =
        document.getElementById("clearSearchButton");

    const resetSearchButton =
        document.getElementById("resetSearchButton");

    const productGrid =
        document.getElementById("productGrid");

    const loadingState =
        document.getElementById("loadingState");

    const emptyState =
        document.getElementById("emptyState");

    const resultsCount =
        document.getElementById("resultsCount");

    const profileButton =
        document.getElementById("profileButton");

    const notificationButton =
        document.getElementById("notificationButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const userName =
        document.getElementById("userName");

    const userType =
        document.getElementById("userType");

    const profileAvatar =
        document.querySelector(".profile-avatar");


    /* =========================
       CURRENT USER
    ========================== */

    let currentUser = null;

    let currentProfile = null;


    /* =========================
       PRODUCTS
    ========================== */

    let products = [];


    /* =========================
       FILTER STATE
    ========================== */

    let currentSearch = "";

    let currentCategory = "all";

    let currentSort = "newest";


    /* =========================
       URL PARAMETERS
    ========================== */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const urlSearch =
        urlParams.get("q");

    const urlCategory =
        urlParams.get("category");


    /* =========================
       LOAD CURRENT USER
    ========================== */

    async function loadCurrentUser() {

        try {

            const {
                data: { user },
                error: authError
            } = await supabaseClient.auth.getUser();


            if (authError) {

                console.error(
                    "Unable to get current user:",
                    authError
                );

                return;

            }


            if (!user) {

                console.warn(
                    "No logged-in user found."
                );

                return;

            }


            currentUser = user;


            const {
                data: profile,
                error: profileError
            } = await supabaseClient

                .from("profiles")

                .select(
                    "id, full_name, user_type"
                )

                .eq(
                    "id",
                    user.id
                )

                .maybeSingle();


            if (profileError) {

                console.error(
                    "Unable to load user profile:",
                    profileError
                );

                updateCurrentUser();

                return;

            }


            currentProfile = profile;

            updateCurrentUser();


        } catch (error) {

            console.error(
                "Unexpected user loading error:",
                error
            );

        }

    }


    /* =========================
       UPDATE CURRENT USER UI
    ========================== */

    function updateCurrentUser() {

        const fullName =

            currentProfile
                ?.full_name
                ?.trim()

            ||

            currentUser
                ?.user_metadata
                ?.full_name
                ?.trim()

            ||

            currentUser
                ?.user_metadata
                ?.name
                ?.trim()

            ||

            currentUser
                ?.email
                ?.split("@")[0]

            ||

            "User";


        const type =

            currentProfile
                ?.user_type
                ?.trim()

            ||

            currentUser
                ?.user_metadata
                ?.user_type
                ?.trim()

            ||

            "Member";


        if (userName) {

            userName.textContent =
                fullName;

        }


        if (userType) {

            userType.textContent =
                type;

        }


        if (profileAvatar) {

            profileAvatar.textContent =
                getInitials(fullName);

        }

    }


    /* =========================
       GET INITIALS
    ========================== */

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

            words[
                words.length - 1
            ].charAt(0)

        ).toUpperCase();

    }


    /* =========================
       LOAD POSTS
    ========================== */

    async function loadProducts() {

        showLoading();


        try {

            const {
                data: posts,
                error: postsError
            } = await supabaseClient

                .from("posts")

                .select("*")

                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            if (postsError) {

                throw postsError;

            }


            if (!posts || posts.length === 0) {

                products = [];

                renderProducts();

                return;

            }


            /* =========================
               GET USER IDS
            ========================== */

            const userIds = [

                ...new Set(

                    posts

                        .map(
                            post => post.user_id
                        )

                        .filter(Boolean)

                )

            ];


            let profileMap = {};


            if (userIds.length > 0) {

                const {
                    data: profiles,
                    error: profilesError
                } = await supabaseClient

                    .from("profiles")

                    .select(
                        "id, full_name, user_type, phone_number"
                    )

                    .in(
                        "id",
                        userIds
                    );


                if (profilesError) {

                    console.error(
                        "Unable to load seller profiles:",
                        profilesError
                    );

                } else {

                    profileMap =
                        Object.fromEntries(

                            (profiles || [])
                                .map(profile => [
                                    String(profile.id),
                                    profile
                                ])

                        );

                }

            }


            /* =========================
               CONVERT POSTS
            ========================== */

            products =
                posts.map(function (post) {

                    const profile =
                        profileMap[
                            String(post.user_id)
                        ] || null;


                    const sellerName =

                        profile
                            ?.full_name
                            ?.trim()

                        ||

                        "Community member";


                    return {

                        id: post.id,

                        name:
                            post.title ||
                            "Untitled listing",

                        description:
                            post.description ||
                            "",

                        category:
                            normaliseCategory(
                                post.category
                            ),

                        categoryName:
                            formatCategory(
                                post.category
                            ),

                        price:
                            post.price !== null &&
                            post.price !== undefined

                                ? Number(post.price)

                                : 0,

                        seller:
                            sellerName,

                        sellerId:
                            post.user_id,

                        sellerPhone:
                            profile
                                ?.phone_number ||
                            "",

                        location:
                            post.location ||
                            "Location not specified",

                        image:
                            post.image_url ||
                            null,

                        postType:
                            post.post_type ||
                            "product",

                        createdAt:
                            post.created_at ||
                            null

                    };

                });


            renderProducts();


        } catch (error) {

            console.error(
                "Unable to load products:",
                error
            );


            products = [];


            productGrid.innerHTML = "";


            if (loadingState) {
                loadingState.hidden = true;
            }


            if (emptyState) {

                emptyState.hidden = false;

                const message =
                    emptyState.querySelector("p");

                if (message) {

                    message.textContent =
                        "Unable to load listings right now.";

                }

            }

        }

    }


    /* =========================
       FILTER PRODUCTS
    ========================== */

    function getFilteredProducts() {

        let filteredProducts =
            [...products];


        /* =========================
           SEARCH
        ========================== */

        if (currentSearch) {

            const searchTerm =
                currentSearch
                    .toLowerCase()
                    .trim();


            filteredProducts =
                filteredProducts.filter(
                    function (product) {

                        const searchableText = [

                            product.name,

                            product.description,

                            product.categoryName,

                            product.category,

                            product.seller,

                            product.location,

                            product.postType

                        ]

                            .filter(Boolean)

                            .join(" ")

                            .toLowerCase();


                        return searchableText
                            .includes(searchTerm);

                    }
                );

        }


        /* =========================
           CATEGORY
        ========================== */

        if (
            currentCategory &&
            currentCategory !== "all"
        ) {

            const selectedCategory =
                normaliseCategory(
                    currentCategory
                );


            filteredProducts =
                filteredProducts.filter(
                    function (product) {

                        return (

                            product.category ===
                            selectedCategory

                            ||

                            normaliseCategory(
                                product.categoryName
                            ) ===
                            selectedCategory

                        );

                    }
                );

        }


        /* =========================
           SORT
        ========================== */

        filteredProducts.sort(
            function (a, b) {

                switch (currentSort) {

                    case "oldest":

                        return (
                            new Date(
                                a.createdAt || 0
                            ) -

                            new Date(
                                b.createdAt || 0
                            )
                        );


                    case "price-low":

                        return (
                            Number(a.price || 0) -
                            Number(b.price || 0)
                        );


                    case "price-high":

                        return (
                            Number(b.price || 0) -
                            Number(a.price || 0)
                        );


                    case "newest":

                    default:

                        return (
                            new Date(
                                b.createdAt || 0
                            ) -

                            new Date(
                                a.createdAt || 0
                            )
                        );

                }

            }
        );


        return filteredProducts;

    }


    /* =========================
       RENDER PRODUCTS
    ========================== */

    function renderProducts() {

        if (!productGrid) {
            return;
        }


        const filteredProducts =
            getFilteredProducts();


        productGrid.innerHTML = "";


        updateResultsCount(
            filteredProducts.length
        );


        if (
            filteredProducts.length === 0
        ) {

            productGrid.hidden = true;


            if (emptyState) {

                emptyState.hidden = false;

            }


            if (loadingState) {

                loadingState.hidden = true;

            }


            return;

        }


        productGrid.hidden = false;


        if (emptyState) {

            emptyState.hidden = true;

        }


        if (loadingState) {

            loadingState.hidden = true;

        }


        filteredProducts.forEach(
            function (product) {

                const card =
                    createProductCard(
                        product
                    );


                productGrid.appendChild(
                    card
                );

            }
        );


        restoreSavedState();

    }


    /* =========================
       CREATE PRODUCT CARD
    ========================== */

    function createProductCard(product) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "product-card";


        card.dataset.productId =
            product.id;


        let imageContent = "";


        if (product.image) {

            imageContent = `

                <img
                    src="${escapeHtml(
                        product.image
                    )}"
                    alt="${escapeHtml(
                        product.name
                    )}"
                >

            `;

        } else {

            imageContent = `

                <div class="product-image-placeholder">
                    ◈
                </div>

            `;

        }


        const price =
            Number(product.price || 0);


        card.innerHTML = `

            <div class="product-image">

                ${imageContent}

                <button
                    type="button"
                    class="save-product"
                    data-product-id="${escapeHtml(
                        String(product.id)
                    )}"
                    aria-label="Save ${escapeHtml(
                        product.name
                    )}"
                >
                    ♡
                </button>

            </div>


            <div class="product-details">

                <span class="product-category">
                    ${escapeHtml(
                        product.categoryName
                    )}
                </span>


                <h3 class="product-name">
                    ${escapeHtml(
                        product.name
                    )}
                </h3>


                <div class="product-price">

                    R${price.toLocaleString(
                        "en-ZA"
                    )}

                </div>


                <div class="product-meta">

                    <span class="product-seller">

                        ${escapeHtml(
                            product.seller
                        )}

                    </span>


                    <span class="product-location">

                        ${escapeHtml(
                            product.location
                        )}

                    </span>

                </div>

            </div>

        `;


        card.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.closest(
                        ".save-product"
                    )
                ) {

                    return;

                }


                openProduct(
                    product.id
                );

            }
        );


        const saveButton =
            card.querySelector(
                ".save-product"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    toggleSavedProduct(
                        product.id,
                        saveButton
                    );

                }
            );

        }


        return card;

    }


    /* =========================
       OPEN PRODUCT
    ========================== */

    function openProduct(productId) {

        window.location.href =
            `product-details.html?id=${encodeURIComponent(
                productId
            )}`;

    }


    /* =========================
       SAVE PRODUCT
    ========================== */

    function toggleSavedProduct(
        productId,
        button
    ) {

        const savedProducts =
            JSON.parse(
                localStorage.getItem(
                    "communityStoreSavedProducts"
                )
            ) || [];


        const id =
            String(productId);


        const index =
            savedProducts.findIndex(
                savedId =>
                    String(savedId) === id
            );


        if (index === -1) {

            savedProducts.push(
                productId
            );


            button.classList.add(
                "saved"
            );


            button.textContent =
                "♥";

        } else {

            savedProducts.splice(
                index,
                1
            );


            button.classList.remove(
                "saved"
            );


            button.textContent =
                "♡";

        }


        localStorage.setItem(
            "communityStoreSavedProducts",
            JSON.stringify(
                savedProducts
            )
        );

    }


    /* =========================
       RESTORE SAVED STATE
    ========================== */

    function restoreSavedState() {

        const savedProducts =
            JSON.parse(
                localStorage.getItem(
                    "communityStoreSavedProducts"
                )
            ) || [];


        document
            .querySelectorAll(
                ".save-product"
            )
            .forEach(
                function (button) {

                    const productId =
                        String(
                            button.dataset.productId
                        );


                    const isSaved =
                        savedProducts.some(
                            savedId =>
                                String(
                                    savedId
                                ) === productId
                        );


                    if (isSaved) {

                        button.classList.add(
                            "saved"
                        );


                        button.textContent =
                            "♥";

                    }

                }
            );

    }


    /* =========================
       SEARCH
    ========================== */

    function performSearch(value) {

        currentSearch =
            value.trim();


        if (productSearchInput) {

            productSearchInput.value =
                currentSearch;

        }


        if (searchInput) {

            searchInput.value =
                currentSearch;

        }


        updateClearButton();

        renderProducts();

    }


    /* =========================
       PRODUCT SEARCH INPUT
    ========================== */

    if (productSearchInput) {

        productSearchInput.addEventListener(
            "input",
            function () {

                currentSearch =
                    this.value.trim();


                if (searchInput) {

                    searchInput.value =
                        this.value;

                }


                updateClearButton();

                renderProducts();

            }
        );

    }


    /* =========================
       TOP SEARCH
    ========================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                if (productSearchInput) {

                    productSearchInput.value =
                        this.value;

                }


                currentSearch =
                    this.value.trim();


                updateClearButton();

                renderProducts();

            }
        );


        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    performSearch(
                        this.value
                    );

                }

            }
        );

    }


    /* =========================
       CATEGORY FILTER
    ========================== */

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            function () {

                currentCategory =
                    this.value;


                renderProducts();

            }
        );

    }


    /* =========================
       SORT FILTER
    ========================== */

    if (sortFilter) {

        sortFilter.addEventListener(
            "change",
            function () {

                currentSort =
                    this.value;


                renderProducts();

            }
        );

    }


    /* =========================
       CLEAR SEARCH
    ========================== */

    if (clearSearchButton) {

        clearSearchButton.addEventListener(
            "click",
            function () {

                clearSearch();

            }
        );

    }


    /* =========================
       RESET FILTERS
    ========================== */

    if (resetSearchButton) {

        resetSearchButton.addEventListener(
            "click",
            function () {

                clearSearch();


                currentCategory =
                    "all";


                currentSort =
                    "newest";


                if (categoryFilter) {

                    categoryFilter.value =
                        "all";

                }


                if (sortFilter) {

                    sortFilter.value =
                        "newest";

                }


                renderProducts();

            }
        );

    }


    /* =========================
       CLEAR SEARCH FUNCTION
    ========================== */

    function clearSearch() {

        currentSearch = "";


        if (searchInput) {

            searchInput.value =
                "";

        }


        if (productSearchInput) {

            productSearchInput.value =
                "";

        }


        updateClearButton();

        renderProducts();

    }


    /* =========================
       CLEAR BUTTON VISIBILITY
    ========================== */

    function updateClearButton() {

        if (!clearSearchButton) {
            return;
        }


        if (currentSearch) {

            clearSearchButton.classList.add(
                "visible"
            );

        } else {

            clearSearchButton.classList.remove(
                "visible"
            );

        }

    }


    /* =========================
       RESULTS COUNT
    ========================== */

    function updateResultsCount(count) {

        if (!resultsCount) {
            return;
        }


        resultsCount.textContent =
            `${count} ${
                count === 1
                    ? "item"
                    : "items"
            }`;

    }


    /* =========================
       LOADING STATE
    ========================== */

    function showLoading() {

        if (productGrid) {

            productGrid.hidden =
                true;

        }


        if (emptyState) {

            emptyState.hidden =
                true;

        }


        if (loadingState) {

            loadingState.hidden =
                false;

        }

    }


    /* =========================
       NOTIFICATIONS
    ========================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                alert(
                    "Your notifications will be connected soon."
                );

            }
        );

    }


    /* =========================
       PROFILE
    ========================== */

    if (profileButton) {

        profileButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "profile.html";

            }
        );

    }


    /* =========================
       LOGOUT
    ========================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();


                try {

                    const {
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signOut();


                    if (error) {

                        console.error(
                            "Logout failed:",
                            error
                        );

                        return;

                    }


                    sessionStorage.removeItem(
                        "communityStoreCurrentUser"
                    );


                    window.location.href =
                        "login.html";


                } catch (error) {

                    console.error(
                        "Unexpected logout error:",
                        error
                    );

                }

            }
        );

    }


    /* =========================
       CATEGORY NORMALISATION
    ========================== */

    function normaliseCategory(
        category
    ) {

        if (!category) {
            return "";
        }


        return String(category)

            .toLowerCase()

            .trim()

            .replace(
                /&/g,
                "and"
            )

            .replace(
                /[_-]+/g,
                " "
            )

            .replace(
                /\s+/g,
                " "
            );

    }


    /* =========================
       FORMAT CATEGORY
    ========================== */

    function formatCategory(
        category
    ) {

        if (!category) {

            return "Other";

        }


        const value =
            String(category)
                .trim();


        const categoryMap = {

            "books":
                "Books",

            "book":
                "Books",

            "electronics":
                "Electronics",

            "electronic":
                "Electronics",

            "fashion":
                "Fashion",

            "clothing":
                "Fashion",

            "sports":
                "Sports",

            "sport":
                "Sports",

            "home-living":
                "Home & Living",

            "home living":
                "Home & Living",

            "home_and_living":
                "Home & Living",

            "accessories":
                "Accessories",

            "services":
                "Services",

            "service":
                "Services"

        };


        const normalised =
            normaliseCategory(
                value
            );


        return (
            categoryMap[
                normalised
            ]

            ||

            value
                .split(" ")
                .map(
                    word =>
                        word.charAt(0)
                            .toUpperCase() +
                        word.slice(1)
                )
                .join(" ")
        );

    }


    /* =========================
       ESCAPE HTML
    ========================== */

    function escapeHtml(value) {

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
       APPLY URL SEARCH
    ========================== */

    function applyUrlFilters() {

        if (urlSearch) {

            currentSearch =
                urlSearch.trim();


            if (searchInput) {

                searchInput.value =
                    currentSearch;

            }


            if (productSearchInput) {

                productSearchInput.value =
                    currentSearch;

            }

        }


        if (urlCategory) {

            const normalisedUrlCategory =
                normaliseCategory(
                    urlCategory
                );


            const matchingOption =
                categoryFilter
                    ? Array.from(
                        categoryFilter.options
                    ).find(
                        option => {

                            return (
                                option.value ===
                                urlCategory

                                ||

                                normaliseCategory(
                                    option.value
                                ) ===
                                normalisedUrlCategory

                                ||

                                normaliseCategory(
                                    option.textContent
                                ) ===
                                normalisedUrlCategory
                            );

                        }
                    )
                    : null;


            if (matchingOption) {

                currentCategory =
                    matchingOption.value;


                categoryFilter.value =
                    matchingOption.value;

            } else {

                currentCategory =
                    urlCategory;

            }

        }


        updateClearButton();

    }


    /* =========================
       INITIALISE PAGE
    ========================== */

    await loadCurrentUser();

    applyUrlFilters();

    await loadProducts();

});