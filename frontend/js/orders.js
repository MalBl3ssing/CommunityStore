const API_BASE_URL = "/api";
const USE_MOCK_DATA = true;


/* =========================
   STATE
========================= */

let currentUser = null;
let orders = [];
let currentFilter = "all";


/* =========================
   MOCK DATA
========================= */

const mockCurrentUser = {
    userId: 1,
    firstName: "Solomon",
    lastName: "Machaule",
    accountType: "Student"
};

const mockOrders = [
    {
        orderId: 1001,
        orderNumber: "ORD-1001",
        productName: "Wireless Headphones",
        productImage: "",
        category: "Accessories",
        sellerName: "Thando M.",
        price: 450,
        status: "processing",
        orderDate: "2026-09-22"
    },
    {
        orderId: 1002,
        orderNumber: "ORD-1002",
        productName: "Java Programming Book",
        productImage: "",
        category: "Books",
        sellerName: "Lebo K.",
        price: 180,
        status: "completed",
        orderDate: "2026-09-15"
    },
    {
        orderId: 1003,
        orderNumber: "ORD-1003",
        productName: "Nike Sports Hoodie",
        productImage: "",
        category: "Fashion",
        sellerName: "Mpho S.",
        price: 350,
        status: "pending",
        orderDate: "2026-09-23"
    }
];


/* =========================
   DOM ELEMENTS
========================= */

const ordersList =
    document.getElementById("ordersList");

const filterButtons =
    document.querySelectorAll(".filter-button");

const userInitials =
    document.getElementById("userInitials");

const userName =
    document.getElementById("userName");

const userType =
    document.getElementById("userType");

const profileButton =
    document.getElementById("profileButton");

const notificationButton =
    document.getElementById("notificationButton");

const logoutButton =
    document.getElementById("logoutButton");

const dashboardSearch =
    document.getElementById("dashboardSearch");


/* =========================
   INITIALISE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    initialiseOrders
);

async function initialiseOrders() {

    try {

        if (USE_MOCK_DATA) {

            currentUser = mockCurrentUser;
            orders = mockOrders;

        } else {

            currentUser = await getCurrentUser();
            orders = await getOrders();

        }

        updateCurrentUser();
        renderOrders();
        setupEventListeners();

    } catch (error) {

        console.error(
            "Failed to initialise orders:",
            error
        );

        showOrdersError();
    }
}


/* =========================
   CURRENT USER
========================= */

function updateCurrentUser() {

    if (!currentUser) {
        return;
    }

    const firstName =
        currentUser.firstName || "";

    const lastName =
        currentUser.lastName || "";

    userName.textContent =
        `${firstName} ${lastName}`.trim()
        || "My Profile";

    userType.textContent =
        currentUser.accountType
        || "Account";

    userInitials.textContent =
        getInitials(
            firstName,
            lastName
        );
}


/* =========================
   RENDER ORDERS
========================= */

function renderOrders() {

    const filteredOrders =
        getFilteredOrders();

    if (filteredOrders.length === 0) {

        renderEmptyState();
        return;
    }

    ordersList.innerHTML = "";

    filteredOrders.forEach(order => {

        ordersList.appendChild(
            createOrderElement(order)
        );

    });
}


/* =========================
   FILTER ORDERS
========================= */

function getFilteredOrders() {

    if (currentFilter === "all") {
        return orders;
    }

    return orders.filter(order =>
        order.status.toLowerCase()
        === currentFilter
    );
}


/* =========================
   CREATE ORDER CARD
========================= */

function createOrderElement(order) {

    const article =
        document.createElement("article");

    article.className = "order-card";

    article.innerHTML = `
        <div class="order-image">

            ${
                order.productImage
                    ? `
                        <img
                            src="${escapeHTML(order.productImage)}"
                            alt="${escapeHTML(order.productName)}"
                        >
                    `
                    : "◈"
            }

        </div>


        <div class="order-details">

            <div class="order-number">
                ${escapeHTML(order.orderNumber)}
            </div>

            <h3 class="order-title">
                ${escapeHTML(order.productName)}
            </h3>

            <div class="order-meta">

                <span>
                    ${escapeHTML(order.category)}
                </span>

                <span class="order-meta-separator">
                    •
                </span>

                <span>
                    Seller: ${escapeHTML(order.sellerName)}
                </span>

                <span class="order-meta-separator">
                    •
                </span>

                <span>
                    ${formatOrderDate(order.orderDate)}
                </span>

            </div>

        </div>


        <div class="order-side">

            <strong class="order-price">
                R${formatPrice(order.price)}
            </strong>

            <span
                class="order-status ${escapeHTML(order.status)}"
            >
                ${formatStatus(order.status)}
            </span>

            <button
                type="button"
                class="view-order-button"
                data-order-id="${escapeHTML(order.orderId)}"
            >
                View order
                <span>→</span>
            </button>

        </div>
    `;

    return article;
}


/* =========================
   EMPTY STATE
========================= */

function renderEmptyState() {

    const message =
        getEmptyMessage();

    ordersList.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                ◈
            </div>

            <h3>
                ${message.title}
            </h3>

            <p>
                ${message.description}
            </p>

        </div>
    `;
}


/* =========================
   EMPTY STATE MESSAGES
========================= */

function getEmptyMessage() {

    switch (currentFilter) {

        case "pending":

            return {
                title: "No pending orders",
                description:
                    "Orders waiting for confirmation will appear here."
            };

        case "processing":

            return {
                title: "No processing orders",
                description:
                    "Orders currently being prepared will appear here."
            };

        case "completed":

            return {
                title: "No completed orders",
                description:
                    "Your completed purchases will appear here."
            };

        case "cancelled":

            return {
                title: "No cancelled orders",
                description:
                    "Cancelled orders will appear here."
            };

        default:

            return {
                title: "No orders yet",
                description:
                    "Your purchases will appear here once you place an order."
            };
    }
}


/* =========================
   FILTER EVENTS
========================= */

function setupFilterEvents() {

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(item => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                currentFilter =
                    button.dataset.status
                    || "all";

                renderOrders();
            }
        );
    });
}


/* =========================
   ORDER ACTIONS
========================= */

function setupOrderActions() {

    ordersList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".view-order-button"
                );

            if (!button) {
                return;
            }

            const orderId =
                button.dataset.orderId;

            openOrder(orderId);
        }
    );
}


function openOrder(orderId) {

    const order =
        orders.find(
            item =>
                String(item.orderId)
                === String(orderId)
        );

    if (!order) {
        return;
    }

    console.log(
        "Selected order:",
        order
    );

    /*
        This will later connect to the
        actual order details/backend flow.
    */

    window.location.href =
        `order-details.html?id=${encodeURIComponent(orderId)}`;
}


/* =========================
   PROFILE
========================= */

function openProfile() {

    window.location.href =
        "profile.html";
}


/* =========================
   DASHBOARD SEARCH
========================= */

function handleDashboardSearch(event) {

    const searchTerm =
        event.target.value.trim();

    if (!searchTerm) {
        return;
    }

    window.location.href =
        `search.html?q=${encodeURIComponent(searchTerm)}`;
}


/* =========================
   LOGOUT
========================= */

function handleLogout(event) {

    if (USE_MOCK_DATA) {
        return;
    }

    localStorage.removeItem("token");
    sessionStorage.clear();
}


/* =========================
   EVENT LISTENERS
========================= */

function setupEventListeners() {

    setupFilterEvents();
    setupOrderActions();


    if (profileButton) {

        profileButton.addEventListener(
            "click",
            openProfile
        );
    }


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {
                console.log(
                    "Notifications clicked."
                );
            }
        );
    }


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            handleLogout
        );
    }


    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {
                    handleDashboardSearch(event);
                }

            }
        );
    }
}


/* =========================
   BACKEND FUNCTIONS
========================= */

async function getCurrentUser() {

    const response =
        await fetch(
            `${API_BASE_URL}/users/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to retrieve current user."
        );
    }

    return response.json();
}


async function getOrders() {

    const response =
        await fetch(
            `${API_BASE_URL}/orders`,
            {
                method: "GET",
                credentials: "include"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to retrieve orders."
        );
    }

    return response.json();
}


async function getOrderById(orderId) {

    const response =
        await fetch(
            `${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to retrieve order."
        );
    }

    return response.json();
}


/* =========================
   HELPERS
========================= */

function getInitials(
    firstName,
    lastName
) {

    const first =
        firstName?.trim()?.charAt(0)
        || "";

    const last =
        lastName?.trim()?.charAt(0)
        || "";

    return (
        `${first}${last}` || "--"
    ).toUpperCase();
}


function formatPrice(price) {

    return Number(price || 0)
        .toFixed(2);
}


function formatOrderDate(dateString) {

    if (!dateString) {
        return "Date unavailable";
    }

    const date =
        new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-ZA",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


function formatStatus(status) {

    if (!status) {
        return "Unknown";
    }

    return (
        status.charAt(0).toUpperCase()
        + status.slice(1)
    );
}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   ERROR STATE
========================= */

function showOrdersError() {

    ordersList.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                !
            </div>

            <h3>
                Unable to load orders
            </h3>

            <p>
                Something went wrong while loading your orders.
                Please try again later.
            </p>

        </div>
    `;
}