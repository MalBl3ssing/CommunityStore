const API_BASE_URL = "/api";
const USE_MOCK_DATA = true;


/* =========================
   MOCK DATA
========================= */

const MOCK_USER = {
    userId: 1,
    firstName: "Solomon",
    lastName: "Machaule",
    email: "solomonmachaule26@gmail.com",
    accountType: "Student"
};


const MOCK_FAQS = [
    {
        id: 1,
        question: "How do I search for a product?",
        answer: "Use the search bar at the top of the page to search for products, categories, or sellers. You can also use the Search page to browse available marketplace items."
    },
    {
        id: 2,
        question: "How do I contact a seller?",
        answer: "Open a product you are interested in and use the available chat option to communicate with the seller before completing your purchase."
    },
    {
        id: 3,
        question: "How can I track my order?",
        answer: "Open the Orders page from the sidebar to view your recent orders and check their current status."
    },
    {
        id: 4,
        question: "Can I save products for later?",
        answer: "Yes. Products can be saved so that you can easily find them again from your Saved page."
    },
    {
        id: 5,
        question: "What should I do if I have a problem with an order?",
        answer: "You can contact support and provide your order details and a description of the problem. The support team can then review the issue."
    }
];


/* =========================
   ELEMENTS
========================= */

const profileName = document.getElementById("profileName");
const profileType = document.getElementById("profileType");
const userInitials = document.getElementById("userInitials");

const searchInput = document.getElementById("searchInput");
const profileArea = document.getElementById("profileArea");
const notificationBtn = document.getElementById("notificationBtn");

const faqList = document.getElementById("faqList");

const contactSupportBtn =
    document.getElementById("contactSupportBtn");

const reportProblemBtn =
    document.getElementById("reportProblemBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================
   INITIALISE
========================= */

document.addEventListener("DOMContentLoaded", () => {

    loadUser();
    loadFAQs();
    setupEvents();

});


/* =========================
   LOAD USER
========================= */

async function loadUser() {

    let user;

    if (USE_MOCK_DATA) {

        user = MOCK_USER;

    } else {

        user = await fetchCurrentUser();

    }


    if (!user) {
        return;
    }


    const name =
        `${user.firstName} ${user.lastName}`;


    profileName.textContent =
        name;

    profileType.textContent =
        user.accountType || "User";


    userInitials.textContent =
        getInitials(
            user.firstName,
            user.lastName
        );
}


/* =========================
   LOAD FAQS
========================= */

async function loadFAQs() {

    let faqs;


    if (USE_MOCK_DATA) {

        faqs = MOCK_FAQS;

    } else {

        faqs = await fetchFAQs();

    }


    if (!faqs || faqs.length === 0) {

        faqList.innerHTML = `
            <div class="help-box">
                <div class="help-row">
                    <div class="help-info">
                        <span class="help-title">
                            No FAQs available
                        </span>

                        <span class="help-description">
                            There are currently no frequently asked questions available.
                        </span>
                    </div>
                </div>
            </div>
        `;

        return;
    }


    renderFAQs(faqs);
}


/* =========================
   RENDER FAQS
========================= */

function renderFAQs(faqs) {

    faqList.innerHTML = "";


    faqs.forEach((faq) => {

        const faqItem =
            document.createElement("div");

        faqItem.className =
            "faq-item";


        faqItem.innerHTML = `

            <button
                type="button"
                class="faq-question"
            >

                <span>
                    ${escapeHTML(faq.question)}
                </span>

                <span class="faq-icon">
                    +
                </span>

            </button>


            <div class="faq-answer">

                ${escapeHTML(faq.answer)}

            </div>

        `;


        const questionButton =
            faqItem.querySelector(
                ".faq-question"
            );


        questionButton.addEventListener(
            "click",
            () => {

                faqItem.classList.toggle(
                    "open"
                );

            }
        );


        faqList.appendChild(
            faqItem
        );

    });
}


/* =========================
   EVENTS
========================= */

function setupEvents() {

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Enter") {
                return;
            }


            const query =
                searchInput.value.trim();


            if (!query) {
                return;
            }


            window.location.href =
                `search.html?q=${encodeURIComponent(query)}`;

        }
    );


    profileArea.addEventListener(
        "click",
        () => {

            window.location.href =
                "profile.html";

        }
    );


    notificationBtn.addEventListener(
        "click",
        () => {

            console.log(
                "Notifications clicked."
            );

        }
    );


    contactSupportBtn.addEventListener(
        "click",
        () => {

            openSupportForm(
                "Support Request"
            );

        }
    );


    reportProblemBtn.addEventListener(
        "click",
        () => {

            openSupportForm(
                "Report a Problem"
            );

        }
    );


    logoutBtn.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            handleLogout();

        }
    );
}


/* =========================
   SUPPORT FORM
========================= */

function openSupportForm(type) {

    /*
     * Backend integration placeholder.
     *
     * Future endpoint:
     * POST /api/support/tickets
     *
     * Example request structure:
     *
     * {
     *     subject: type,
     *     message: "...",
     *     category: "GENERAL"
     * }
     */

    alert(
        `${type}\n\nThe support request form will be connected to the backend.`
    );
}


/* =========================
   LOGOUT
========================= */

function handleLogout() {

    const confirmed =
        confirm(
            "Are you sure you want to log out?"
        );


    if (!confirmed) {
        return;
    }


    /*
     * Backend integration placeholder.
     *
     * Future endpoint:
     * POST /api/auth/logout
     */

    console.log(
        "Logout requested."
    );


    window.location.href =
        "login.html";
}


/* =========================
   BACKEND: CURRENT USER
========================= */

async function fetchCurrentUser() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/users/me`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load user information."
            );

        }


        return await response.json();

    } catch (error) {

        console.error(
            "Error loading user:",
            error
        );


        return null;
    }
}


/* =========================
   BACKEND: FAQS
========================= */

async function fetchFAQs() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/help/faqs`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load FAQs."
            );

        }


        return await response.json();

    } catch (error) {

        console.error(
            "Error loading FAQs:",
            error
        );


        return [];
    }
}


/* =========================
   HELPERS
========================= */

function getInitials(firstName, lastName) {

    const first =
        firstName
            ? firstName.charAt(0).toUpperCase()
            : "";


    const last =
        lastName
            ? lastName.charAt(0).toUpperCase()
            : "";


    return `${first}${last}`;
}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}