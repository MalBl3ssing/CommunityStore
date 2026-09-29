const API_BASE_URL = "/api";


/* =========================
   SUPABASE
========================= */

const supabaseUrl = "https://olnqufovakusfjlaablt.supabase.co";
const supabaseKey = "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

const supabaseClient =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );


/* =========================
   FAQ DATA
========================= */

const FAQS = [
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

const profileName =
    document.getElementById("profileName");

const profileType =
    document.getElementById("profileType");

const userInitials =
    document.getElementById("userInitials");

const searchInput =
    document.getElementById("searchInput");

const profileArea =
    document.getElementById("profileArea");

const notificationBtn =
    document.getElementById("notificationBtn");

const faqList =
    document.getElementById("faqList");

const contactSupportBtn =
    document.getElementById("contactSupportBtn");

const reportProblemBtn =
    document.getElementById("reportProblemBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================
   INITIALISE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadUser();

        loadFAQs();

        setupEvents();

    }
);


/* =========================
   LOAD CURRENT USER
========================= */

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

            return;
        }


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
                "Help profile loading error:",
                profileError
            );

        } else {

            profile = profileData;

        }


        /*
         * Use the profile first.
         * If no profile exists, use the
         * information stored in Supabase Auth.
         */

        const fullName =
            profile?.full_name ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            getNameFromEmail(user.email) ||
            "User";


        const accountType =
            profile?.user_type ||
            user.user_metadata?.user_type ||
            "Member";


        profileName.textContent =
            fullName;


        profileType.textContent =
            accountType;


        userInitials.textContent =
            getInitials(fullName);


        console.log(
            "Help page user:",
            fullName
        );

        console.log(
            "Help page user type:",
            accountType
        );

        console.log(
            "Help page profile:",
            profile
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
   LOAD FAQS
========================= */

function loadFAQs() {

    if (!FAQS || FAQS.length === 0) {

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


    renderFAQs(FAQS);
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

    if (searchInput) {

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
    }


    if (profileArea) {

        profileArea.addEventListener(
            "click",
            () => {

                window.location.href =
                    "profile.html";

            }
        );
    }


    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            () => {

                console.log(
                    "Notifications clicked."
                );

            }
        );
    }


    if (contactSupportBtn) {

        contactSupportBtn.addEventListener(
            "click",
            () => {

                openSupportForm(
                    "Support Request"
                );

            }
        );
    }


    if (reportProblemBtn) {

        reportProblemBtn.addEventListener(
            "click",
            () => {

                openSupportForm(
                    "Report a Problem"
                );

            }
        );
    }


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                await handleLogout();

            }
        );
    }
}


/* =========================
   SUPPORT FORM
========================= */

function openSupportForm(type) {

    alert(
        `${type}\n\nThe support request form will be connected to the backend.`
    );
}


/* =========================
   LOGOUT
========================= */

async function handleLogout() {

    const confirmed =
        confirm(
            "Are you sure you want to log out?"
        );


    if (!confirmed) {
        return;
    }


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


/* =========================
   HELPERS
========================= */

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
        .replace(/\b\w/g, char =>
            char.toUpperCase()
        );
}


function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value ?? "";


    return div.innerHTML;
}