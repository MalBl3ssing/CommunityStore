// =========================
// DASHBOARD INITIALISATION
// =========================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Community Store dashboard loaded.");

});


// =========================
// SEARCH
// =========================

const searchInput =
    document.getElementById("dashboardSearch");


searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        const searchTerm =
            searchInput.value.trim();

        if (searchTerm !== "") {

            console.log(
                "Searching for:",
                searchTerm
            );

            /*
                Later:

                The search term will be sent
                to the backend and real products
                will be returned.
            */
        }

    }

});


// =========================
// SELL ITEM
// =========================

const sellButton =
    document.getElementById("sellButton");


sellButton.addEventListener("click", function () {

    /*
        This page will be created later.
    */

    alert(
        "The Sell Item page will be available here."
    );

});


// =========================
// NOTIFICATIONS
// =========================

const notificationButton =
    document.getElementById(
        "notificationButton"
    );


notificationButton.addEventListener(
    "click",
    function () {

        alert(
            "Your notifications will appear here."
        );

    }
);


// =========================
// PROFILE
// =========================

const profileButton =
    document.getElementById("profileButton");


profileButton.addEventListener(
    "click",
    function () {

        /*
            Later this will open
            the user's profile page.
        */

        window.location.href =
            "profile.html";

    }
);


// =========================
// CATEGORY BUTTONS
// =========================

const categoryCards =
    document.querySelectorAll(
        ".category-card"
    );


categoryCards.forEach(function (card) {

    card.addEventListener(
        "click",
        function () {

            const category =
                card
                    .querySelector("span")
                    .textContent;

            console.log(
                "Selected category:",
                category
            );

            /*
                Later this will send the
                selected category to the
                product/search page.
            */

        }
    );

});