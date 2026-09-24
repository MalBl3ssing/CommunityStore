/* =========================
   COMMUNITY STORE CHAT
========================= */


/* =========================
   CONFIGURATION
========================= */

const API_BASE_URL = "/api";

const USE_MOCK_DATA = true;


/* =========================
   STATE
========================= */

let currentUser = null;
let conversations = [];
let currentConversationId = null;


/* =========================
   MOCK USER
   Temporary until backend
   authentication is connected.
========================= */

const mockCurrentUser = {
    userId: 1,
    firstName: "Solomon",
    lastName: "Machaule",
    accountType: "Student"
};


/* =========================
   MOCK CONVERSATIONS
   Temporary frontend data.
========================= */

const mockConversations = [
    {
        conversationId: 1,

        participant: {
            userId: 2,
            firstName: "Thando",
            lastName: "Mokoena",
            online: true
        },

        lastMessage: {
            messageId: 101,
            senderId: 2,
            content: "Hi, is the laptop still available?",
            sentAt: "2026-09-24T18:20:00"
        },

        unreadCount: 2
    },

    {
        conversationId: 2,

        participant: {
            userId: 3,
            firstName: "Lerato",
            lastName: "Ndlovu",
            online: false
        },

        lastMessage: {
            messageId: 102,
            senderId: 1,
            content: "Thank you, I'll let you know.",
            sentAt: "2026-09-23T15:40:00"
        },

        unreadCount: 0
    },

    {
        conversationId: 3,

        participant: {
            userId: 4,
            firstName: "Michael",
            lastName: "Dlamini",
            online: true
        },

        lastMessage: {
            messageId: 103,
            senderId: 4,
            content: "Can we meet tomorrow?",
            sentAt: "2026-09-22T12:10:00"
        },

        unreadCount: 1
    }
];


/* =========================
   MOCK MESSAGES
========================= */

const mockMessages = {

    1: [
        {
            messageId: 1,
            conversationId: 1,
            senderId: 2,
            receiverId: 1,
            content: "Hi! Is the laptop still available?",
            sentAt: "2026-09-24T18:15:00",
            read: false
        },

        {
            messageId: 2,
            conversationId: 1,
            senderId: 1,
            receiverId: 2,
            content: "Yes, it is still available.",
            sentAt: "2026-09-24T18:17:00",
            read: true
        },

        {
            messageId: 3,
            conversationId: 1,
            senderId: 2,
            receiverId: 1,
            content: "Great. Is the price negotiable?",
            sentAt: "2026-09-24T18:20:00",
            read: false
        }
    ],

    2: [
        {
            messageId: 4,
            conversationId: 2,
            senderId: 3,
            receiverId: 1,
            content: "Thanks for the information.",
            sentAt: "2026-09-23T15:35:00",
            read: true
        },

        {
            messageId: 5,
            conversationId: 2,
            senderId: 1,
            receiverId: 3,
            content: "Thank you, I'll let you know.",
            sentAt: "2026-09-23T15:40:00",
            read: true
        }
    ],

    3: [
        {
            messageId: 6,
            conversationId: 3,
            senderId: 4,
            receiverId: 1,
            content: "Can we meet tomorrow?",
            sentAt: "2026-09-22T12:10:00",
            read: false
        }
    ]
};


/* =========================
   DOM ELEMENTS
========================= */

const conversationList =
    document.getElementById("conversationList");

const conversationSearch =
    document.getElementById("conversationSearch");

const chatEmptyState =
    document.getElementById("chatEmptyState");

const activeChat =
    document.getElementById("activeChat");

const chatUserName =
    document.getElementById("chatUserName");

const chatUserStatus =
    document.getElementById("chatUserStatus");

const chatUserInitials =
    document.getElementById("chatUserInitials");

const messagesContainer =
    document.getElementById("messagesContainer");

const messageForm =
    document.getElementById("messageForm");

const messageInput =
    document.getElementById("messageInput");

const sendMessageButton =
    document.getElementById("sendMessageButton");

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


/* =========================
   INITIALISE CHAT
========================= */

document.addEventListener("DOMContentLoaded", initialiseChat);


async function initialiseChat() {

    setupEventListeners();

    try {

        if (USE_MOCK_DATA) {

            currentUser = mockCurrentUser;

            conversations = [...mockConversations];

        } else {

            currentUser = await getCurrentUser();

            conversations = await getConversations();

        }

        updateCurrentUser();

        renderConversations();

    } catch (error) {

        console.error(
            "Unable to initialise chat:",
            error
        );

        showConversationError();
    }
}


/* =========================
   CURRENT USER
========================= */

function updateCurrentUser() {

    if (!currentUser) {
        return;
    }

    const initials = getInitials(
        currentUser.firstName,
        currentUser.lastName
    );

    userInitials.textContent = initials;

    userName.textContent =
        `${currentUser.firstName} ${currentUser.lastName}`;

    userType.textContent =
        currentUser.accountType || "Account";
}


/* =========================
   RENDER CONVERSATIONS
========================= */

function renderConversations(
    filteredConversations = conversations
) {

    if (!conversationList) {
        return;
    }

    conversationList.innerHTML = "";

    if (!filteredConversations.length) {

        conversationList.innerHTML = `
            <div class="conversation-empty">

                <div class="empty-icon">
                    ◌
                </div>

                <h3>
                    No conversations found
                </h3>

                <p>
                    Conversations with buyers and sellers will appear here.
                </p>

            </div>
        `;

        return;
    }

    filteredConversations.forEach(
        conversation => {

            const element =
                createConversationElement(
                    conversation
                );

            conversationList.appendChild(element);
        }
    );
}


/* =========================
   CREATE CONVERSATION ITEM
========================= */

function createConversationElement(
    conversation
) {

    const participant =
        conversation.participant;

    const element =
        document.createElement("button");

    element.type = "button";

    element.className =
        "conversation-item";

    if (
        conversation.conversationId ===
        currentConversationId
    ) {
        element.classList.add("active");
    }

    const initials =
        getInitials(
            participant.firstName,
            participant.lastName
        );

    const lastMessage =
        conversation.lastMessage;

    const preview =
        lastMessage
            ? lastMessage.content
            : "No messages yet.";

    const time =
        lastMessage
            ? formatMessageTime(
                lastMessage.sentAt
            )
            : "";

    element.innerHTML = `

        <div class="conversation-avatar">

            ${initials}

            ${
                participant.online
                    ? '<span class="online-dot"></span>'
                    : ""
            }

        </div>


        <div class="conversation-details">

            <div class="conversation-top">

                <span class="conversation-name">
                    ${escapeHTML(
                        participant.firstName
                    )}
                    ${escapeHTML(
                        participant.lastName
                    )}
                </span>

                <span class="conversation-time">
                    ${time}
                </span>

            </div>


            <span class="conversation-preview">
                ${escapeHTML(preview)}
            </span>

        </div>


        ${
            conversation.unreadCount > 0
                ? `
                    <span class="unread-count">
                        ${conversation.unreadCount}
                    </span>
                `
                : ""
        }

    `;

    element.addEventListener(
        "click",
        () => openConversation(
            conversation.conversationId
        )
    );

    return element;
}


/* =========================
   OPEN CONVERSATION
========================= */

async function openConversation(
    conversationId
) {

    currentConversationId =
        conversationId;

    const conversation =
        conversations.find(
            item =>
                item.conversationId ===
                conversationId
        );

    if (!conversation) {
        return;
    }

    try {

        let messages;

        if (USE_MOCK_DATA) {

            messages =
                mockMessages[conversationId] || [];

        } else {

            messages =
                await getMessages(
                    conversationId
                );
        }

        showActiveConversation(
            conversation,
            messages
        );

        await markConversationAsRead(
            conversationId
        );

        renderConversations();

    } catch (error) {

        console.error(
            "Unable to open conversation:",
            error
        );
    }
}


/* =========================
   SHOW ACTIVE CONVERSATION
========================= */

function showActiveConversation(
    conversation,
    messages
) {

    const participant =
        conversation.participant;

    chatEmptyState.hidden = true;

    activeChat.hidden = false;

    chatUserName.textContent =
        `${participant.firstName} ${participant.lastName}`;

    chatUserStatus.textContent =
        participant.online
            ? "Online"
            : "Offline";

    chatUserInitials.textContent =
        getInitials(
            participant.firstName,
            participant.lastName
        );

    renderMessages(messages);

    messageInput.focus();
}


/* =========================
   RENDER MESSAGES
========================= */

function renderMessages(messages) {

    messagesContainer.innerHTML = "";

    if (!messages.length) {

        messagesContainer.innerHTML = `
            <div class="conversation-empty">

                <div class="empty-icon">
                    ◌
                </div>

                <h3>
                    No messages yet
                </h3>

                <p>
                    Start the conversation below.
                </p>

            </div>
        `;

        return;
    }

    messages.forEach(
        message => {

            const element =
                createMessageElement(
                    message
                );

            messagesContainer.appendChild(
                element
            );
        }
    );

    scrollToLatestMessage();
}


/* =========================
   CREATE MESSAGE
========================= */

function createMessageElement(
    message
) {

    const element =
        document.createElement("div");

    const isSent =
        message.senderId ===
        currentUser.userId;

    element.className =
        `message ${
            isSent
                ? "sent"
                : "received"
        }`;

    element.innerHTML = `

        <div class="message-bubble">

            ${escapeHTML(
                message.content
            )}

            <span class="message-time">
                ${formatMessageTime(
                    message.sentAt
                )}
            </span>

        </div>

    `;

    return element;
}


/* =========================
   SEND MESSAGE
========================= */

async function handleSendMessage(
    event
) {

    event.preventDefault();

    const content =
        messageInput.value.trim();

    if (
        !content ||
        !currentConversationId
    ) {
        return;
    }

    sendMessageButton.disabled = true;

    try {

        let message;

        if (USE_MOCK_DATA) {

            message = {

                messageId:
                    Date.now(),

                conversationId:
                    currentConversationId,

                senderId:
                    currentUser.userId,

                receiverId:
                    getConversationParticipantId(
                        currentConversationId
                    ),

                content,

                sentAt:
                    new Date().toISOString(),

                read: true
            };

            if (
                !mockMessages[
                    currentConversationId
                ]
            ) {

                mockMessages[
                    currentConversationId
                ] = [];

            }

            mockMessages[
                currentConversationId
            ].push(message);

        } else {

            message =
                await sendMessage(
                    currentConversationId,
                    content
                );
        }

        messageInput.value = "";

        resizeMessageInput();

        const conversation =
            conversations.find(
                item =>
                    item.conversationId ===
                    currentConversationId
            );

        if (conversation) {

            conversation.lastMessage = {

                messageId:
                    message.messageId,

                senderId:
                    currentUser.userId,

                content:
                    message.content,

                sentAt:
                    message.sentAt
            };
        }

        if (USE_MOCK_DATA) {

            renderMessages(
                mockMessages[
                    currentConversationId
                ]
            );

        } else {

            const messages =
                await getMessages(
                    currentConversationId
                );

            renderMessages(messages);
        }

        renderConversations();

    } catch (error) {

        console.error(
            "Unable to send message:",
            error
        );

        alert(
            "Unable to send your message. Please try again."
        );

    } finally {

        sendMessageButton.disabled = false;

        messageInput.focus();
    }
}


/* =========================
   MARK AS READ
========================= */

async function markConversationAsRead(
    conversationId
) {

    const conversation =
        conversations.find(
            item =>
                item.conversationId ===
                conversationId
        );

    if (conversation) {
        conversation.unreadCount = 0;
    }

    if (!USE_MOCK_DATA) {

        try {

            await fetch(
                `${API_BASE_URL}/conversations/${conversationId}/read`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

        } catch (error) {

            console.error(
                "Unable to mark messages as read:",
                error
            );
        }
    }
}


/* =========================
   SEARCH CONVERSATIONS
========================= */

function searchConversations() {

    const query =
        conversationSearch.value
            .trim()
            .toLowerCase();

    if (!query) {

        renderConversations();

        return;
    }

    const filtered =
        conversations.filter(
            conversation => {

                const participant =
                    conversation.participant;

                const name =
                    `${participant.firstName}
                    ${participant.lastName}`
                    .toLowerCase();

                const message =
                    conversation.lastMessage
                        ?.content
                        ?.toLowerCase() || "";

                return (
                    name.includes(query) ||
                    message.includes(query)
                );
            }
        );

    renderConversations(filtered);
}


/* =========================
   PROFILE
========================= */

function openProfile() {

    window.location.href =
        "profile.html";
}


/* =========================
   GLOBAL SEARCH
========================= */

function handleDashboardSearch(
    event
) {

    const query =
        event.target.value.trim();

    if (
        event.key === "Enter" &&
        query
    ) {

        window.location.href =
            `search.html?q=${encodeURIComponent(query)}`;
    }
}


/* =========================
   LOGOUT
========================= */

function handleLogout(event) {

    /*
     * Backend authentication/logout
     * can be connected here later.
     */

    const confirmed =
        confirm(
            "Are you sure you want to log out?"
        );

    if (!confirmed) {
        event.preventDefault();
    }
}


/* =========================
   EVENT LISTENERS
========================= */

function setupEventListeners() {

    if (messageForm) {

        messageForm.addEventListener(
            "submit",
            handleSendMessage
        );
    }


    if (messageInput) {

        messageInput.addEventListener(
            "input",
            resizeMessageInput
        );

        messageInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    messageForm.requestSubmit();
                }
            }
        );
    }


    if (conversationSearch) {

        conversationSearch.addEventListener(
            "input",
            searchConversations
        );
    }


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

                /*
                 * Notifications can be connected
                 * to the backend later.
                 */

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


    const dashboardSearch =
        document.getElementById(
            "dashboardSearch"
        );

    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "keydown",
            handleDashboardSearch
        );
    }
}


/* =========================
   TEXTAREA RESIZE
========================= */

function resizeMessageInput() {

    if (!messageInput) {
        return;
    }

    messageInput.style.height =
        "auto";

    messageInput.style.height =
        `${Math.min(
            messageInput.scrollHeight,
            110
        )}px`;
}


/* =========================
   GET PARTICIPANT ID
========================= */

function getConversationParticipantId(
    conversationId
) {

    const conversation =
        conversations.find(
            item =>
                item.conversationId ===
                conversationId
        );

    return conversation
        ?.participant
        ?.userId || null;
}


/* =========================
   INITIALS
========================= */

function getInitials(
    firstName = "",
    lastName = ""
) {

    const first =
        firstName
            .trim()
            .charAt(0)
            .toUpperCase();

    const last =
        lastName
            .trim()
            .charAt(0)
            .toUpperCase();

    return `${first}${last}` || "U";
}


/* =========================
   FORMAT MESSAGE TIME
========================= */

function formatMessageTime(
    dateValue
) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const now =
        new Date();

    const sameDay =
        date.toDateString() ===
        now.toDateString();

    if (sameDay) {

        return date.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    return date.toLocaleDateString(
        [],
        {
            day: "2-digit",
            month: "short"
        }
    );
}


/* =========================
   SCROLL TO LATEST
========================= */

function scrollToLatestMessage() {

    if (!messagesContainer) {
        return;
    }

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================
   ERROR STATE
========================= */

function showConversationError() {

    if (!conversationList) {
        return;
    }

    conversationList.innerHTML = `

        <div class="conversation-empty">

            <div class="empty-icon">
                !
            </div>

            <h3>
                Something went wrong
            </h3>

            <p>
                We couldn't load your conversations.
                Please try again later.
            </p>

        </div>

    `;
}


/* =========================
   BACKEND API
   These functions are ready
   for Spring Boot.
========================= */


/*
 * GET /api/users/me
 */
async function getCurrentUser() {

    const response =
        await fetch(
            `${API_BASE_URL}/users/me`,
            {
                method: "GET",
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to load current user."
        );
    }

    return response.json();
}


/*
 * GET /api/conversations
 */
async function getConversations() {

    const response =
        await fetch(
            `${API_BASE_URL}/conversations`,
            {
                method: "GET",
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to load conversations."
        );
    }

    return response.json();
}


/*
 * GET /api/conversations/{id}/messages
 */
async function getMessages(
    conversationId
) {

    const response =
        await fetch(
            `${API_BASE_URL}/conversations/${conversationId}/messages`,
            {
                method: "GET",
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to load messages."
        );
    }

    return response.json();
}


/*
 * POST /api/conversations/{id}/messages
 */
async function sendMessage(
    conversationId,
    content
) {

    const response =
        await fetch(
            `${API_BASE_URL}/conversations/${conversationId}/messages`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    content: content
                })
            }
        );

    if (!response.ok) {

        throw new Error(
            "Failed to send message."
        );
    }

    return response.json();
}