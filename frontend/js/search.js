/* =========================
   SEARCH PAGE
========================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       ELEMENTS
    ========================== */

    const searchInput = document.getElementById("searchInput");
    const productSearchInput = document.getElementById("productSearchInput");

    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    const clearSearchButton = document.getElementById("clearSearchButton");
    const resetSearchButton = document.getElementById("resetSearchButton");

    const productGrid = document.getElementById("productGrid");

    const loadingState = document.getElementById("loadingState");
    const emptyState = document.getElementById("emptyState");

    const resultsCount = document.getElementById("resultsCount");

    const profileButton = document.getElementById("profileButton");
    const notificationButton = document.getElementById("notificationButton");
    const logoutButton = document.getElementById("logoutButton");


    /* =========================
       TEMPORARY PRODUCT DATA
       
       This structure is designed
       to be replaced by backend/API
       data later.
    ========================== */

    let products = [

        {
            id: 1,
            name: "Introduction to Java Programming",
            category: "books",
            categoryName: "Books",
            price: 250,
            seller: "Student Seller",
            location: "Cape Town",
            image: null,
            createdAt: "2026-09-24"
        },

        {
            id: 2,
            name: "Wireless Bluetooth Headphones",
            category: "accessories",
            categoryName: "Accessories",
            price: 450,
            seller: "Community Seller",
            location: "Cape Town",
            image: null,
            createdAt: "2026-09-23"
        },

        {
            id: 3,
            name: "Laptop Stand",
            category: "electronics",
            categoryName: "Electronics",
            price: 300,
            seller: "Campus Seller",
            location: "Cape Town",
            image: null,
            createdAt: "2026-09-22"
        },

        {
            id: 4,
            name: "Nike Sports Jacket",
            category: "fashion",
            categoryName: "Fashion",
            price: 550,
            seller: "Student Seller",
            location: "Cape Town",
            image: null,
            createdAt: "2026-09-21"
        },

        {
            id: 5,
            name: "Football Boots",
            category: "sports",
            categoryName: "Sports",
            price: 700,
            seller: "Community Seller",
            location: "Cape Town",
            image: null,
            createdAt: "2026-09-20"
        },

        {
            id: 6,
            name: "Desk Lamp",
            category: "home-living",
            categoryName: "Home & Living",
            price: 180,
            seller: "Campus Seller",
            location: "Cape Town",
            image: null,
            createdAt: "2026-09-19"
        }

    ];


    /* =========================
       CURRENT FILTER STATE
    ========================== */

    let currentSearch = "";

    let currentCategory = "all";

    let currentSort = "newest";


    /* =========================
       LOAD PRODUCTS
       
       BACKEND CONNECTION POINT
       
       Later this function can
       fetch products from your API.
    ========================== */

    async function loadProducts() {

        showLoading();

        try {

            /*
             * Example future backend:
             *
             * const response = await fetch(
             *     `/api/products?search=${encodeURIComponent(currentSearch)}`
             * );
             *
             * products = await response.json();
             */

            await new Promise(function (resolve) {
                setTimeout(resolve, 400);
            });

            renderProducts();

        } catch (error) {

            console.error("Unable to load products:", error);

            products = [];

            renderProducts();

        }

    }


    /* =========================
       FILTER PRODUCTS
    ========================== */

    function getFilteredProducts() {

        let filteredProducts = [...products];


        /* Search */

        if (currentSearch) {

            const searchTerm = currentSearch.toLowerCase();

            filteredProducts = filteredProducts.filter(function (product) {

                return (

                    product.name.toLowerCase().includes(searchTerm)

                    ||

                    product.categoryName
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    product.seller
                        .toLowerCase()
                        .includes(searchTerm)

                );

            });

        }


        /* Category */

        if (currentCategory !== "all") {

            filteredProducts = filteredProducts.filter(function (product) {

                return product.category === currentCategory;

            });

        }


        /* Sort */

        filteredProducts.sort(function (a, b) {

            switch (currentSort) {

                case "oldest":

                    return new Date(a.createdAt) - new Date(b.createdAt);


                case "price-low":

                    return a.price - b.price;


                case "price-high":

                    return b.price - a.price;


                case "newest":

                default:

                    return new Date(b.createdAt) - new Date(a.createdAt);

            }

        });


        return filteredProducts;

    }


    /* =========================
       RENDER PRODUCTS
    ========================== */

    function renderProducts() {

        const filteredProducts = getFilteredProducts();


        productGrid.innerHTML = "";


        updateResultsCount(filteredProducts.length);


        if (filteredProducts.length === 0) {

            productGrid.hidden = true;

            emptyState.hidden = false;

            loadingState.hidden = true;

            return;

        }


        productGrid.hidden = false;

        emptyState.hidden = true;

        loadingState.hidden = true;


        filteredProducts.forEach(function (product) {

            const card = createProductCard(product);

            productGrid.appendChild(card);

        });

    }


    /* =========================
       CREATE PRODUCT CARD
    ========================== */

    function createProductCard(product) {

        const card = document.createElement("article");

        card.className = "product-card";

        /*
         * Product ID is stored on the card
         * so it can later be used to open
         * product details or connect to
         * backend records.
         */

        card.dataset.productId = product.id;


        /* Product image */

        let imageContent = "";

        if (product.image) {

            imageContent = `
                <img
                    src="${escapeHtml(product.image)}"
                    alt="${escapeHtml(product.name)}"
                >
            `;

        } else {

            imageContent = `
                <div class="product-image-placeholder">
                    ◈
                </div>
            `;

        }


        card.innerHTML = `

            <div class="product-image">

                ${imageContent}

                <button
                    type="button"
                    class="save-product"
                    data-product-id="${product.id}"
                    aria-label="Save ${escapeHtml(product.name)}"
                >
                    ♡
                </button>

            </div>


            <div class="product-details">

                <span class="product-category">
                    ${escapeHtml(product.categoryName)}
                </span>


                <h3 class="product-name">
                    ${escapeHtml(product.name)}
                </h3>


                <div class="product-price">
                    R${Number(product.price).toLocaleString("en-ZA")}
                </div>


                <div class="product-meta">

                    <span class="product-seller">
                        ${escapeHtml(product.seller)}
                    </span>

                    <span class="product-location">
                        ${escapeHtml(product.location)}
                    </span>

                </div>

            </div>

        `;


        /* Open product */

        card.addEventListener("click", function (event) {

            if (
                event.target.closest(".save-product")
            ) {
                return;
            }

            openProduct(product.id);

        });


        /* Save product */

        const saveButton = card.querySelector(".save-product");

        saveButton.addEventListener("click", function (event) {

            event.stopPropagation();

            toggleSavedProduct(product.id, saveButton);

        });


        return card;

    }


    /* =========================
       OPEN PRODUCT
       
       Future connection:
       product-details.html?id=123
    ========================== */

    function openProduct(productId) {

        window.location.href =
            `product-details.html?id=${encodeURIComponent(productId)}`;

    }


    /* =========================
       SAVE PRODUCT
       
       Temporary frontend behaviour.
       Later this can call:
       POST /api/saved-products
    ========================== */

    function toggleSavedProduct(productId, button) {

        const savedProducts =
            JSON.parse(
                localStorage.getItem("communityStoreSavedProducts")
            ) || [];


        const index = savedProducts.indexOf(productId);


        if (index === -1) {

            savedProducts.push(productId);

            button.classList.add("saved");

            button.textContent = "♥";

        } else {

            savedProducts.splice(index, 1);

            button.classList.remove("saved");

            button.textContent = "♡";

        }


        localStorage.setItem(
            "communityStoreSavedProducts",
            JSON.stringify(savedProducts)
        );

    }


    /* =========================
       RESTORE SAVED STATE
    ========================== */

    function restoreSavedState() {

        const savedProducts =
            JSON.parse(
                localStorage.getItem("communityStoreSavedProducts")
            ) || [];


        document
            .querySelectorAll(".save-product")
            .forEach(function (button) {

                const productId =
                    Number(button.dataset.productId);


                if (savedProducts.includes(productId)) {

                    button.classList.add("saved");

                    button.textContent = "♥";

                }

            });

    }


    /* =========================
       SEARCH
    ========================== */

    function performSearch(value) {

        currentSearch = value.trim();

        productSearchInput.value = currentSearch;

        searchInput.value = currentSearch;


        updateClearButton();

        renderProducts();

    }


    /* =========================
       SEARCH INPUT
    ========================== */

    if (productSearchInput) {

        productSearchInput.addEventListener(
            "input",
            function () {

                currentSearch = this.value.trim();

                searchInput.value = this.value;

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

                productSearchInput.value = this.value;

                currentSearch = this.value.trim();

                updateClearButton();

                renderProducts();

            }
        );


        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    performSearch(this.value);

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

                currentCategory = this.value;

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

                currentSort = this.value;

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

                categoryFilter.value = "all";

                sortFilter.value = "newest";

                currentCategory = "all";

                currentSort = "newest";

                renderProducts();

            }
        );

    }


    /* =========================
       CLEAR SEARCH FUNCTION
    ========================== */

    function clearSearch() {

        currentSearch = "";

        searchInput.value = "";

        productSearchInput.value = "";

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

            clearSearchButton.classList.add("visible");

        } else {

            clearSearchButton.classList.remove("visible");

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
            `${count} ${count === 1 ? "item" : "items"}`;

    }


    /* =========================
       LOADING STATE
    ========================== */

    function showLoading() {

        productGrid.hidden = true;

        emptyState.hidden = true;

        loadingState.hidden = false;

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

                window.location.href = "profile.html";

            }
        );

    }


    /* =========================
       LOGOUT
    ========================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                sessionStorage.removeItem(
                    "communityStoreCurrentUser"
                );

                window.location.href = "login.html";

            }
        );

    }


    /* =========================
       ESCAPE HTML
       
       Protects dynamically rendered
       content when backend data
       is eventually used.
    ========================== */

    function escapeHtml(value) {

        return String(value)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    /* =========================
       INITIALISE PAGE
    ========================== */

    loadProducts();

});