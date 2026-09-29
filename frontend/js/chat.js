document.addEventListener("DOMContentLoaded", async () => {

    /* =========================
       SUPABASE
    ========================= */

    const SUPABASE_URL = "https://olnqufovakusfjlaablt.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

    const supabase = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


    /* =========================
       STATE
    ========================= */

    let currentUser = null;
    let currentProfile = null;

    let conversations = [];
    let currentConversationId = null;
    let currentOtherUser = null;

    let realtimeChannel = null;


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
       NAME HELPERS
    ========================= */

    function getNameInitials(name) {

        if (!name) {
            return "--";
        }

        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

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


    /* =========================
       LOAD CURRENT USER
    ========================= */

    async function loadCurrentUser() {

        const {
            data,
            error
        } = await supabase.auth.getUser();

        if (error) {

            console.error(
                "AUTH USER ERROR:",
                error
            );

            throw error;
        }

        if (!data.user) {

            window.location.href = "login.html";
            return;
        }

        currentUser = data.user;


        console.log(
            "LOGGED IN USER:",
            currentUser
        );

        console.log(
            "AUTH USER ID:",
            currentUser.id
        );


        /* =========================
           LOAD PROFILE
        ========================= */

        const {
            data: profile,
            error: profileError
        } = await supabase
            .from("profiles")
            .select("id, full_name, user_type")
            .eq("id", currentUser.id)
            .maybeSingle();


        console.log(
            "PROFILE FROM DATABASE:",
            profile
        );

        console.log(
            "PROFILE ERROR:",
            profileError
        );


        if (profileError) {
            throw profileError;
        }

        currentProfile = profile;
    }


    /* =========================
       UPDATE CURRENT USER UI
    ========================= */

    function updateCurrentUser() {

        const fullName =
            currentProfile?.full_name?.trim() ||
            currentUser?.user_metadata?.full_name?.trim() ||
            currentUser?.user_metadata?.name?.trim() ||
            currentUser?.email ||
            "My Profile";


        const initials =
            getNameInitials(fullName);


        if (userInitials) {
            userInitials.textContent = initials;
        }


        if (userName) {
            userName.textContent = fullName;
        }


        if (userType) {

            userType.textContent =
                currentProfile?.user_type ||
                currentUser?.user_metadata?.user_type ||
                "Account";
        }


        console.log(
            "NAME DISPLAYED IN PROFILE:",
            fullName
        );
    }


    /* =========================
       GET PROFILE BY USER ID
    ========================= */

    async function getUserProfile(userId) {

        if (!userId) {
            return null;
        }


        const {
            data,
            error
        } = await supabase
            .from("profiles")
            .select("id, full_name, user_type")
            .eq("id", userId)
            .maybeSingle();


        if (error) {

            console.error(
                "GET USER PROFILE ERROR:",
                error
            );

            return null;
        }


        return data;
    }


    /* =========================
       GET CONVERSATION DETAILS
    ========================= */

    async function getConversationDetails(
        conversationId
    ) {

        const {
            data,
            error
        } = await supabase
            .from("conversations")
            .select("*")
            .eq("id", conversationId)
            .maybeSingle();


        if (error) {

            console.error(
                "CONVERSATION DETAILS ERROR:",
                error
            );

            return null;
        }


        return data;
    }


    /* =========================
       GET CONVERSATION PARTICIPANTS
    ========================= */

    async function getConversationParticipants(
        conversationId
    ) {

        const {
            data,
            error
        } = await supabase
            .from("conversation_participants")
            .select(
                "id, conversation_id, user_id, created_at"
            )
            .eq(
                "conversation_id",
                conversationId
            );


        if (error) {

            console.error(
                "GET PARTICIPANTS ERROR:",
                error
            );

            return [];
        }


        return data || [];
    }


    /* =========================
       GET OTHER USER FROM
       CONVERSATION
    ========================= */

    async function getOtherUserFromConversation(
        conversationId
    ) {

        const participants =
            await getConversationParticipants(
                conversationId
            );


        const otherParticipant =
            participants.find(
                participant =>
                    participant.user_id !==
                    currentUser.id
            );


        if (!otherParticipant) {
            return null;
        }


        const profile =
            await getUserProfile(
                otherParticipant.user_id
            );


        if (!profile) {
            return null;
        }


        return {
            ...profile,
            id: otherParticipant.user_id
        };
    }


    /* =========================
       GET OR CREATE CONVERSATION
    ========================= */

    async function getOrCreateConversation(
        otherUserId
    ) {

        if (!currentUser || !otherUserId) {

            console.error(
                "CONVERSATION ERROR: Missing user ID."
            );

            return null;
        }


        if (currentUser.id === otherUserId) {

            console.error(
                "CONVERSATION ERROR: Cannot message yourself."
            );

            return null;
        }


        console.log(
            "CHECKING CONVERSATION BETWEEN:",
            currentUser.id,
            "AND",
            otherUserId
        );


        /* =========================
           FIND CURRENT USER'S
           CONVERSATIONS
        ========================= */

        const {
            data: currentParticipants,
            error: currentParticipantsError
        } = await supabase
            .from("conversation_participants")
            .select("conversation_id")
            .eq(
                "user_id",
                currentUser.id
            );


        if (currentParticipantsError) {

            console.error(
                "FIND CURRENT PARTICIPANTS ERROR:",
                currentParticipantsError
            );

            return null;
        }


        const conversationIds =
            (currentParticipants || [])
                .map(
                    participant =>
                        participant.conversation_id
                )
                .filter(Boolean);


        /* =========================
           LOOK FOR EXISTING CHAT
        ========================= */

        for (
            const conversationId
            of conversationIds
        ) {

            const {
                data: otherParticipant,
                error: otherParticipantError
            } = await supabase
                .from("conversation_participants")
                .select("id, conversation_id, user_id")
                .eq(
                    "conversation_id",
                    conversationId
                )
                .eq(
                    "user_id",
                    otherUserId
                )
                .maybeSingle();


            if (otherParticipantError) {

                console.error(
                    "CHECK OTHER PARTICIPANT ERROR:",
                    otherParticipantError
                );

                continue;
            }


            if (otherParticipant) {

                console.log(
                    "EXISTING CONVERSATION FOUND:",
                    conversationId
                );


                const conversation =
                    await getConversationDetails(
                        conversationId
                    );


                if (conversation) {
                    return conversation;
                }
            }
        }


        /* =========================
           CREATE NEW CONVERSATION
        ========================= */

        console.log(
            "NO EXISTING CONVERSATION. CREATING ONE..."
        );


        const {
            data: created,
            error: createError
        } = await supabase
            .from("conversations")
            .insert({})
            .select("*")
            .single();


        if (createError) {

            console.error(
                "CREATE CONVERSATION ERROR:",
                createError
            );

            return null;
        }


        console.log(
            "CONVERSATION CREATED:",
            created
        );


        /* =========================
           ADD BOTH PARTICIPANTS
        ========================= */

        const {
            error: participantInsertError
        } = await supabase
            .from("conversation_participants")
            .insert([
                {
                    conversation_id:
                        created.id,

                    user_id:
                        currentUser.id
                },
                {
                    conversation_id:
                        created.id,

                    user_id:
                        otherUserId
                }
            ]);


        if (participantInsertError) {

            console.error(
                "ADD PARTICIPANTS ERROR:",
                participantInsertError
            );

            return null;
        }


        console.log(
            "BOTH PARTICIPANTS ADDED:",
            {
                conversationId:
                    created.id,

                currentUser:
                    currentUser.id,

                otherUser:
                    otherUserId
            }
        );


        return created;
    }


    /* =========================
       LOAD CONVERSATIONS
    ========================= */

    async function loadConversations() {

        if (!currentUser) {
            return;
        }


        const {
            data: participantRows,
            error: participantError
        } = await supabase
            .from("conversation_participants")
            .select("conversation_id")
            .eq(
                "user_id",
                currentUser.id
            );


        if (participantError) {

            console.error(
                "LOAD PARTICIPANTS ERROR:",
                participantError
            );

            return;
        }


        const conversationIds =
            (participantRows || [])
                .map(
                    participant =>
                        participant.conversation_id
                )
                .filter(Boolean);


        if (!conversationIds.length) {

            conversations = [];

            renderConversations();

            return;
        }


        const {
            data,
            error
        } = await supabase
            .from("conversations")
            .select("*")
            .in(
                "id",
                conversationIds
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "LOAD CONVERSATIONS ERROR:",
                error
            );

            return;
        }


        conversations = data || [];


        /* =========================
           GET OTHER USERS
        ========================= */

        for (
            const conversation
            of conversations
        ) {

            const otherUser =
                await getOtherUserFromConversation(
                    conversation.id
                );


            conversation.otherUser =
                otherUser;
        }


        renderConversations();
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
                        No conversations yet
                    </h3>

                    <p>
                        Your conversations with buyers and sellers will appear here.
                    </p>

                </div>
            `;

            return;
        }


        filteredConversations.forEach(
            conversation => {

                const otherUser =
                    conversation.otherUser;


                const name =
                    otherUser?.full_name ||
                    "Community member";


                const initials =
                    getNameInitials(name);


                const item =
                    document.createElement("button");


                item.type = "button";

                item.className =
                    "conversation-item";


                if (
                    conversation.id ===
                    currentConversationId
                ) {

                    item.classList.add("active");
                }


                item.innerHTML = `
                    <div class="conversation-avatar">
                        ${initials}
                    </div>

                    <div class="conversation-details">

                        <strong>
                            ${escapeHtml(name)}
                        </strong>

                        <span>
                            Tap to open conversation
                        </span>

                    </div>
                `;


                item.addEventListener(
                    "click",
                    () => {

                        openConversation(
                            conversation.id
                        );
                    }
                );


                conversationList.appendChild(
                    item
                );
            }
        );
    }


    /* =========================
       OPEN CONVERSATION
    ========================= */

    async function openConversation(
        conversationId,
        knownOtherUser = null
    ) {

        if (!conversationId) {
            return;
        }


        const conversation =
            conversations.find(
                item =>
                    item.id === conversationId
            );


        if (!conversation) {

            console.error(
                "Conversation not found:",
                conversationId
            );

            return;
        }


        currentConversationId =
            conversationId;


        /* =========================
           RESOLVE OTHER USER
        ========================= */

        let otherUser =
            knownOtherUser ||
            conversation.otherUser;


        if (!otherUser) {

            otherUser =
                await getOtherUserFromConversation(
                    conversationId
                );
        }


        currentOtherUser =
            otherUser;


        const name =
            otherUser?.full_name ||
            "Community member";


        const initials =
            getNameInitials(name);


        console.log(
            "OPENING CONVERSATION WITH:",
            {
                userId:
                    otherUser?.id,

                name
            }
        );


        if (chatUserName) {
            chatUserName.textContent =
                name;
        }


        if (chatUserInitials) {
            chatUserInitials.textContent =
                initials;
        }


        if (chatUserStatus) {
            chatUserStatus.textContent =
                "Community member";
        }


        if (chatEmptyState) {
            chatEmptyState.hidden = true;
        }


        if (activeChat) {
            activeChat.hidden = false;
        }


        await loadMessages(
            conversationId
        );


        renderConversations();


        subscribeToMessages(
            conversationId
        );


        if (messageInput) {
            messageInput.focus();
        }
    }


    /* =========================
       OPEN CONVERSATION FROM URL
    ========================= */

    async function openConversationFromOrder() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const sellerId =
            params.get("sellerId");


        const conversationId =
            params.get("conversationId");


        console.log(
            "CHAT URL PARAMETERS:",
            {
                sellerId,
                conversationId
            }
        );


        /* =========================
           DIRECT CONVERSATION ID
        ========================= */

        if (conversationId) {

            if (
                conversations.some(
                    item =>
                        item.id ===
                        conversationId
                )
            ) {

                await openConversation(
                    conversationId
                );

                return;
            }


            const details =
                await getConversationDetails(
                    conversationId
                );


            if (details) {

                await loadConversations();


                await openConversation(
                    conversationId
                );
            }


            return;
        }


        /* =========================
           SELLER ID
        ========================= */

        if (!sellerId) {

            console.log(
                "NO SELLER ID IN URL."
            );

            return;
        }


        if (
            !currentUser ||
            sellerId === currentUser.id
        ) {

            console.log(
                "SELLER ID IS MISSING OR IS THE CURRENT USER."
            );

            return;
        }


        console.log(
            "OPENING CHAT WITH SELLER:",
            sellerId
        );


        /* =========================
           LOAD SELLER PROFILE
        ========================= */

        const sellerProfile =
            await getUserProfile(
                sellerId
            );


        console.log(
            "SELLER PROFILE:",
            sellerProfile
        );


        /* =========================
           GET OR CREATE CHAT
        ========================= */

        const conversation =
            await getOrCreateConversation(
                sellerId
            );


        if (!conversation) {

            console.error(
                "Could not create/find conversation."
            );

            return;
        }


        await loadConversations();


        const matchingConversation =
            conversations.find(
                item =>
                    item.id ===
                    conversation.id
            );


        if (matchingConversation) {

            matchingConversation.otherUser =
                sellerProfile;


            await openConversation(
                matchingConversation.id,
                sellerProfile
            );

        } else {

            console.error(
                "Conversation was created/found but could not be loaded.",
                conversation
            );
        }
    }


    /* =========================
       LOAD MESSAGES
    ========================= */

    async function loadMessages(
        conversationId
    ) {

        if (!messagesContainer) {
            return;
        }


        const {
            data,
            error
        } = await supabase
            .from("messages")
            .select("*")
            .eq(
                "conversation_id",
                conversationId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


        if (error) {

            console.error(
                "LOAD MESSAGES ERROR:",
                error
            );

            messagesContainer.innerHTML = `
                <div class="conversation-empty">

                    <h3>
                        Unable to load messages
                    </h3>

                    <p>
                        Please try again.
                    </p>

                </div>
            `;

            return;
        }


        renderMessages(
            data || []
        );
    }


    /* =========================
       RENDER MESSAGES
    ========================= */

    function renderMessages(
        messages
    ) {

        if (!messagesContainer) {
            return;
        }


        messagesContainer.innerHTML = "";


        if (!messages.length) {

            messagesContainer.innerHTML = `
                <div class="conversation-empty">

                    <div class="empty-icon">
                        ◌
                    </div>

                    <h3>
                        Start the conversation
                    </h3>

                    <p>
                        Send a message to get started.
                    </p>

                </div>
            `;

            return;
        }


        messages.forEach(message => {

            const messageElement =
                document.createElement("div");


            messageElement.className =
                "message";


            /* =========================
               IMPORTANT:
               CURRENT USER = SENT
               OTHER USER = RECEIVED
            ========================= */

            if (
                message.sender_id ===
                currentUser.id
            ) {

                messageElement.classList.add(
                    "message-sent"
                );

            } else {

                messageElement.classList.add(
                    "message-received"
                );
            }


            const bubble =
                document.createElement("div");


            bubble.className =
                "message-bubble";


            bubble.textContent =
                message.content;


            messageElement.appendChild(
                bubble
            );


            messagesContainer.appendChild(
                messageElement
            );
        });


        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;
    }


    /* =========================
       SEND MESSAGE
    ========================= */

    async function sendMessage() {

        if (
            !currentUser ||
            !currentConversationId ||
            !messageInput
        ) {
            return;
        }


        const content =
            messageInput.value.trim();


        if (!content) {
            return;
        }


        if (sendMessageButton) {
            sendMessageButton.disabled = true;
        }


        console.log(
            "SENDING MESSAGE:",
            {
                conversationId:
                    currentConversationId,

                senderId:
                    currentUser.id,

                content
            }
        );


        const {
            data,
            error
        } = await supabase
            .from("messages")
            .insert({
                conversation_id:
                    currentConversationId,

                sender_id:
                    currentUser.id,

                content:
                    content
            })
            .select("*")
            .single();


        if (error) {

            console.error(
                "SEND MESSAGE ERROR:",
                error
            );

            if (sendMessageButton) {
                sendMessageButton.disabled = false;
            }

            return;
        }


        console.log(
            "MESSAGE SENT:",
            data
        );


        messageInput.value = "";


        if (sendMessageButton) {
            sendMessageButton.disabled = false;
        }


        await loadMessages(
            currentConversationId
        );
    }


    /* =========================
       REALTIME MESSAGES
    ========================= */

    function subscribeToMessages(
        conversationId
    ) {

        if (realtimeChannel) {

            supabase.removeChannel(
                realtimeChannel
            );
        }


        realtimeChannel =
            supabase
                .channel(
                    `messages-${conversationId}`
                )
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages",
                        filter:
                            `conversation_id=eq.${conversationId}`
                    },
                    () => {

                        loadMessages(
                            conversationId
                        );
                    }
                )
                .subscribe();
    }


    /* =========================
       SEARCH CONVERSATIONS
    ========================= */

    if (conversationSearch) {

        conversationSearch.addEventListener(
            "input",
            () => {

                const searchTerm =
                    conversationSearch.value
                        .trim()
                        .toLowerCase();


                if (!searchTerm) {

                    renderConversations();

                    return;
                }


                const filtered =
                    conversations.filter(
                        conversation => {

                            const name =
                                conversation
                                    .otherUser
                                    ?.full_name ||
                                "";

                            return name
                                .toLowerCase()
                                .includes(
                                    searchTerm
                                );
                        }
                    );


                renderConversations(
                    filtered
                );
            }
        );
    }


    /* =========================
       MESSAGE FORM
    ========================= */

    if (messageForm) {

        messageForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                await sendMessage();
            }
        );
    }


    /* =========================
       PROFILE BUTTON
    ========================= */

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
       NOTIFICATIONS
    ========================= */

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


    /* =========================
       LOGOUT
    ========================= */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();


                const {
                    error
                } = await supabase.auth.signOut();


                if (error) {

                    console.error(
                        "LOGOUT ERROR:",
                        error
                    );

                    return;
                }


                window.location.href =
                    "login.html";
            }
        );
    }


    /* =========================
       ESCAPE HTML
    ========================= */

    function escapeHtml(value) {

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


    /* =========================
       INITIALIZE
    ========================= */

    try {

        await loadCurrentUser();

        updateCurrentUser();


        try {

            await loadConversations();

        } catch (error) {

            console.error(
                "CONVERSATION LOAD FAILED:",
                error
            );
        }


        try {

            await openConversationFromOrder();

        } catch (error) {

            console.error(
                "OPEN CONVERSATION FAILED:",
                error
            );
        }

    } catch (error) {

        console.error(
            "CHAT INITIALIZATION ERROR:",
            error
        );
    }

});