// =========================
// HOME PAGE
// =========================

document.addEventListener("DOMContentLoaded", function () {

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
            function (event) {

                event.preventDefault();

                window.location.href =
                    "login.html";

            }
        );

    }


    // =========================
    // SELL AN ITEM
    // =========================

    const sellButton =
        document.getElementById("sellButton");

    if (sellButton) {

        sellButton.addEventListener(
            "click",
            function () {

                alert(
                    "The Sell an Item page will be connected soon."
                );

            }
        );

    }


    // =========================
    // NOTIFICATIONS
    // =========================

    const notificationButton =
        document.getElementById("notificationButton");

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


    // =========================
    // SEARCH
    // =========================

    const dashboardSearch =
        document.getElementById("dashboardSearch");

    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    const searchTerm =
                        dashboardSearch.value.trim();

                    if (searchTerm) {

                        alert(
                            `Searching for "${searchTerm}"...`
                        );

                    }

                }

            }
        );

    }


    // =========================
    // VIEW CATEGORIES
    // =========================

    const viewCategoriesButton =
        document.getElementById(
            "viewCategoriesButton"
        );

    if (viewCategoriesButton) {

        viewCategoriesButton.addEventListener(
            "click",
            function () {

                alert(
                    "The categories page will be connected soon."
                );

            }
        );

    }


    // =========================
    // FEATURED ITEMS
    // =========================

    const featuredSeeMore =
        document.getElementById(
            "featuredSeeMore"
        );

    if (featuredSeeMore) {

        featuredSeeMore.addEventListener(
            "click",
            function () {

                alert(
                    "Featured items will be connected soon."
                );

            }
        );

    }


    // =========================
    // RECENT ITEMS
    // =========================

    const recentSeeAll =
        document.getElementById(
            "recentSeeAll"
        );

    if (recentSeeAll) {

        recentSeeAll.addEventListener(
            "click",
            function () {

                alert(
                    "Recently added items will be connected soon."
                );

            }
        );

    }

});