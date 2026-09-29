document.addEventListener("DOMContentLoaded", async () => {

    /* =========================
       SUPABASE
    ========================== */

    const supabaseUrl =
        "https://olnqufovakusfjlaablt.supabase.co";

    const supabaseKey =
        "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

    const supabase =
        window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );


    /* =========================
       ELEMENTS
    ========================== */

    const profileButton =
        document.getElementById("profileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const dashboardSearch =
        document.getElementById("dashboardSearch");

    const eventSearch =
        document.getElementById("eventSearch");

    const eventsList =
        document.getElementById("eventsList");

    const userName =
        document.getElementById("userName");

    const userType =
        document.getElementById("userType");

    const userInitials =
        document.getElementById("userInitials");


    /* =========================
       STATE
    ========================== */

    let currentUser = null;

    let currentProfile = null;

    let allEvents = [];


    /* =========================
       INITIALISE
    ========================== */

    await loadCurrentUser();

    if (!currentUser) {
        return;
    }

    await loadEvents();


    /* =========================
       CURRENT USER
    ========================== */

    async function loadCurrentUser() {

        try {

            const {
                data: {
                    user
                },
                error
            } =
                await supabase.auth.getUser();


            if (error) {

                console.error(
                    "Error getting logged-in user:",
                    error
                );

                return;

            }


            if (!user) {

                window.location.href =
                    "login.html";

                return;

            }


            currentUser =
                user;


            /* =========================
               PROFILE
            ========================== */

            const {
                data: profile,
                error: profileError
            } =
                await supabase
                    .from("profiles")
                    .select(
                        "full_name, user_type"
                    )
                    .eq(
                        "id",
                        user.id
                    )
                    .maybeSingle();


            if (profileError) {

                console.error(
                    "Profile loading error:",
                    profileError
                );

                currentProfile = null;

            } else {

                currentProfile =
                    profile;

            }


            /* =========================
               USER NAME
            ========================== */

            let fullName = "";


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

            if (!fullName) {

                fullName =
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    "";

            }


            /* Email fallback */

            if (
                !fullName &&
                user.email
            ) {

                fullName =
                    user.email.split("@")[0];

            }


            if (!fullName) {

                fullName =
                    "User";

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


            /* Auth metadata fallback */

            if (!type) {

                type =
                    user.user_metadata?.user_type ||
                    "";

            }


            if (!type) {

                type =
                    "Member";

            }


            /* =========================
               UPDATE TOP BAR
            ========================== */

            if (userName) {

                userName.textContent =
                    fullName;

            }


            if (userType) {

                userType.textContent =
                    type;

            }


            if (userInitials) {

                userInitials.textContent =
                    getInitials(
                        fullName
                    );

            }


            console.log(
                "Community Board user:",
                fullName
            );

            console.log(
                "Community Board user type:",
                type
            );

            console.log(
                "Community Board profile:",
                currentProfile
            );


        } catch (error) {

            console.error(
                "Current user error:",
                error
            );


            window.location.href =
                "login.html";

        }

    }


    /* =========================
       LOAD EVENTS
    ========================== */

    async function loadEvents() {

        try {

            const {
                data: events,
                error
            } =
                await supabase
                    .from("posts")
                    .select(`
                        id,
                        user_id,
                        title,
                        description,
                        post_type,
                        category,
                        price,
                        location,
                        image_url,
                        event_date,
                        created_at
                    `)
                    .eq(
                        "post_type",
                        "event"
                    )
                    .order(
                        "event_date",
                        {
                            ascending: true,
                            nullsFirst: false
                        }
                    );


            if (error) {
                throw error;
            }


            allEvents =
                events || [];


            renderEvents();

        } catch (error) {

            console.error(
                "Events loading error:",
                error
            );


            showError(
                "Unable to load community events. Please try again."
            );

        }

    }


    /* =========================
       RENDER EVENTS
    ========================== */

    function renderEvents() {

        if (!eventsList) {
            return;
        }


        const searchTerm =
            eventSearch
                ?.value
                ?.trim()
                .toLowerCase() ||
            "";


        let filteredEvents =
            [...allEvents];


        if (searchTerm) {

            filteredEvents =
                filteredEvents.filter(
                    event => {

                        return (

                            String(
                                event.title ||
                                ""
                            )
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                ) ||

                            String(
                                event.description ||
                                ""
                            )
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                ) ||

                            String(
                                event.category ||
                                ""
                            )
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                ) ||

                            String(
                                event.location ||
                                ""
                            )
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                )

                        );

                    }
                );

        }


        if (
            filteredEvents.length === 0
        ) {

            eventsList.innerHTML =
                `
                    <div class="empty-state">

                        <div class="empty-icon">
                            📅
                        </div>

                        <h3>
                            ${
                                searchTerm
                                    ? "No events found"
                                    : "No events yet"
                            }
                        </h3>

                        <p>
                            ${
                                searchTerm
                                    ? "Try searching for another event, category or location."
                                    : "Community events will appear here when people create them."
                            }
                        </p>

                    </div>
                `;

            return;

        }


        eventsList.innerHTML =
            filteredEvents
                .map(
                    event =>
                        createEventCard(
                            event
                        )
                )
                .join("");

    }


    /* =========================
       EVENT CARD
    ========================== */

    function createEventCard(
        event
    ) {

        const image =
            event.image_url
                ? `
                    <img
                        src="${escapeHtml(
                            event.image_url
                        )}"
                        alt="${escapeHtml(
                            event.title ||
                            "Community event"
                        )}"
                    >
                `
                : `
                    <span>
                        📅
                    </span>
                `;


        const category =
            formatCategory(
                event.category ||
                "Events"
            );


        const eventDate =
            event.event_date
                ? formatDate(
                    event.event_date
                )
                : "";


        const price =
            Number(
                event.price || 0
            );


        return `
            <article
                class="event-card"
                data-event-id="${escapeHtml(
                    event.id
                )}"
            >

                <div class="event-image">

                    ${image}

                </div>


                <div class="event-info">

                    <span class="event-type">
                        ${escapeHtml(
                            category
                        )}
                    </span>


                    <h3>
                        ${escapeHtml(
                            event.title ||
                            "Untitled event"
                        )}
                    </h3>


                    ${
                        event.description
                            ? `
                                <p class="event-description">
                                    ${escapeHtml(
                                        event.description
                                    )}
                                </p>
                            `
                            : ""
                    }


                    <div class="event-details">

                        ${
                            event.location
                                ? `
                                    <div class="event-detail">

                                        <span>
                                            📍
                                        </span>

                                        <strong>
                                            ${escapeHtml(
                                                event.location
                                            )}
                                        </strong>

                                    </div>
                                `
                                : ""
                        }


                        ${
                            eventDate
                                ? `
                                    <div class="event-detail">

                                        <span>
                                            📅
                                        </span>

                                        <strong>
                                            ${escapeHtml(
                                                eventDate
                                            )}
                                        </strong>

                                    </div>
                                `
                                : ""
                        }

                    </div>


                    <div class="event-price">

                        ${
                            price > 0
                                ? `
                                    Entry / booking amount:
                                    <strong>
                                        R ${price.toFixed(2)}
                                    </strong>
                                `
                                : `
                                    Free event
                                `
                        }

                    </div>

                </div>

            </article>
        `;

    }


    /* =========================
       EVENT SEARCH
    ========================== */

    if (eventSearch) {

        eventSearch.addEventListener(
            "input",
            renderEvents
        );

    }


    /* =========================
       PROFILE
    ========================== */

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
    ========================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                await supabase.auth.signOut();


                window.location.href =
                    "login.html";

            }
        );

    }


    /* =========================
       DASHBOARD SEARCH
    ========================== */

    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    const value =
                        dashboardSearch
                            .value
                            .trim();


                    if (!value) {
                        return;
                    }


                    window.location.href =
                        `search.html?q=${encodeURIComponent(
                            value
                        )}`;

                }

            }
        );

    }


    /* =========================
       DATE
    ========================== */

    function formatDate(
        dateValue
    ) {

        if (!dateValue) {
            return "";
        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        return date.toLocaleString(
            "en-ZA",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    /* =========================
       CATEGORY
    ========================== */

    function formatCategory(
        category
    ) {

        return String(category)
            .split("-")
            .map(
                word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");

    }


    /* =========================
       INITIALS
    ========================== */

    function getInitials(
        name
    ) {

        if (!name) {

            return "U";

        }


        const parts =
            String(name)
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (!parts.length) {

            return "U";

        }


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    }


    /* =========================
       ERROR
    ========================== */

    function showError(
        message
    ) {

        if (!eventsList) {
            return;
        }


        eventsList.innerHTML =
            `
                <div class="empty-state">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        ${escapeHtml(
                            message
                        )}
                    </p>

                </div>
            `;

    }


    /* =========================
       ESCAPE HTML
    ========================== */

    function escapeHtml(
        value
    ) {

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

});