/* =========================
   TEMPORARY SAVED ITEMS

   This data will later come
   from the backend API.
========================= */

let savedItems = [
    {
        id: 1,
        title: "Java Programming Book",
        category: "Books",
        price: 180,
        seller: "Thabo M.",
        image: null
    },

    {
        id: 2,
        title: "Wireless Headphones",
        category: "Electronics",
        price: 450,
        seller: "Lerato K.",
        image: null
    },

    {
        id: 3,
        title: "Denim Jacket",
        category: "Fashion",
        price: 280,
        seller: "Mpho S.",
        image: null
    }
];


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


/* =========================
   LOAD
========================= */

function loadSavedItems() {

    showLoading();

    setTimeout(function () {

        renderSavedItems(savedItems);

    }, 300);
}


/* =========================
   LOADING
========================= */

function showLoading() {

    if (loadingState) {
        loadingState.style.display = "flex";
    }

    if (emptyState) {
        emptyState.style.display = "none";
    }
}


/* =========================
   RENDER
========================= */

function renderSavedItems(items) {

    if (!savedGrid) {
        return;
    }

    savedGrid.innerHTML = "";

    if (loadingState) {
        loadingState.style.display = "none";
    }


    if (savedCount) {

        savedCount.textContent =
            `${items.length} ${
                items.length === 1
                    ? "item"
                    : "items"
            }`;

    }


    if (items.length === 0) {

        if (emptyState) {
            emptyState.style.display = "flex";
        }

        return;
    }


    if (emptyState) {
        emptyState.style.display = "none";
    }


    items.forEach(function (item) {

        const card =
            document.createElement("div");

        card.className = "saved-card";

        card.dataset.productId = item.id;


        /* =========================
           IMAGE
        ========================== */

        const imageHTML = item.image

            ? `
                <div class="saved-card-image">

                    <img
                        src="${escapeHtml(item.image)}"
                        alt="${escapeHtml(item.title)}"
                    >

                </div>
            `

            : `
                <div class="saved-card-image">

                    <span class="saved-card-placeholder">
                        ◈
                    </span>

                </div>
            `;


        /* =========================
           CARD
        ========================== */

        card.innerHTML = `

            ${imageHTML}

            <div class="saved-card-content">

                <span class="saved-card-category">
                    ${escapeHtml(item.category)}
                </span>

                <h3 class="saved-card-title">
                    ${escapeHtml(item.title)}
                </h3>

                <div class="saved-card-price">
                    R${Number(item.price).toFixed(2)}
                </div>

                <div class="saved-card-seller">
                    ${escapeHtml(item.seller)}
                </div>

            </div>


            <button
                type="button"
                class="remove-saved"
                aria-label="Remove saved item"
            >
                ♡
            </button>

        `;


        /* =========================
           CARD CLICK
        ========================== */

        card.addEventListener(
            "click",
            function () {

                window.location.href =
                    "product-details.html?id=" +
                    encodeURIComponent(item.id);

            }
        );


        /* =========================
           REMOVE BUTTON
        ========================== */

        const removeButton =
            card.querySelector(".remove-saved");


        removeButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                removeSavedItem(item.id);

            }
        );


        savedGrid.appendChild(card);

    });

}


/* =========================
   REMOVE SAVED ITEM
========================= */

function removeSavedItem(itemId) {

    savedItems =
        savedItems.filter(function (item) {

            return item.id !== itemId;

        });


    saveSavedItems();

    renderSavedItems(savedItems);
}


/* =========================
   TEMPORARY STORAGE

   Backend will replace this.
========================= */

function saveSavedItems() {

    const savedIds =
        savedItems.map(function (item) {

            return item.id;

        });


    localStorage.setItem(
        "communityStoreSavedProducts",
        JSON.stringify(savedIds)
    );
}


/* =========================
   SEARCH
========================= */

function filterSavedItems() {

    if (!savedSearch) {
        return;
    }


    const query =
        savedSearch.value
            .trim()
            .toLowerCase();


    if (!query) {

        renderSavedItems(savedItems);

        return;
    }


    const filteredItems =
        savedItems.filter(function (item) {

            return (

                item.title
                    .toLowerCase()
                    .includes(query)

                ||

                item.category
                    .toLowerCase()
                    .includes(query)

                ||

                item.seller
                    .toLowerCase()
                    .includes(query)

            );

        });


    renderSavedItems(filteredItems);
}


if (savedSearch) {

    savedSearch.addEventListener(
        "input",
        filterSavedItems
    );

}


/* =========================
   PROFILE
========================= */

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
========================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "communityStoreCurrentUser"
            );

        }
    );

}


/* =========================
   NOTIFICATIONS
========================= */

if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        function () {

            alert(
                "Notifications will be connected soon."
            );

        }
    );

}


/* =========================
   HTML SECURITY
========================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================
   START
========================= */

loadSavedItems();