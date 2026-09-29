document.addEventListener("DOMContentLoaded", async () => {

    /* =========================
       SUPABASE
    ========================= */

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
    ========================= */

    const profileButton =
        document.getElementById("profileButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const sellButton =
        document.getElementById("sellButton");

    const notificationButton =
        document.getElementById("notificationButton");

    const dashboardSearch =
        document.getElementById("dashboardSearch");

    const featuredProducts =
        document.getElementById("featuredProducts");

    const recentProducts =
        document.getElementById("recentProducts");

    const createPostModal =
        document.getElementById("createPostModal");

    const closePostModal =
        document.getElementById("closePostModal");

    const cancelPostButton =
        document.getElementById("cancelPostButton");

    const createPostForm =
        document.getElementById("createPostForm");

    const publishPostButton =
        document.getElementById("publishPostButton");

    const postImage =
        document.getElementById("postImage");

    const imagePreview =
        document.getElementById("imagePreview");

    const imagePreviewImage =
        document.getElementById("imagePreviewImage");

    const removeImageButton =
        document.getElementById("removeImageButton");

    const eventDateGroup =
        document.getElementById("eventDateGroup");

    const eventDate =
        document.getElementById("eventDate");

    const userName =
        document.getElementById("userName");

    const userType =
        document.getElementById("userType");

    const welcomeMessage =
        document.getElementById("welcomeMessage");


    /* =========================
       BOOKING MODAL ELEMENTS
    ========================= */

    const bookingModal =
        document.getElementById("bookingModal");

    const closeBookingModal =
        document.getElementById("closeBookingModal");

    const cancelBookingButton =
        document.getElementById("cancelBookingButton");

    const confirmBookingButton =
        document.getElementById("confirmBookingButton");

    const bookingContent =
        document.getElementById("bookingContent");

    const bookingSuccess =
        document.getElementById("bookingSuccess");

    const bookingImageContainer =
        document.getElementById("bookingImageContainer");

    const bookingTitle =
        document.getElementById("bookingTitle");

    const bookingDescription =
        document.getElementById("bookingDescription");

    const bookingCategory =
        document.getElementById("bookingCategory");

    const bookingLocation =
        document.getElementById("bookingLocation");

    const bookingDate =
        document.getElementById("bookingDate");

    const bookingPrice =
        document.getElementById("bookingPrice");

    const bookingCategoryRow =
        document.getElementById("bookingCategoryRow");

    const bookingLocationRow =
        document.getElementById("bookingLocationRow");

    const bookingDateRow =
        document.getElementById("bookingDateRow");


    let selectedPostType = "product";

    let selectedBookingPost = null;


    /* =========================
       CURRENT USER
    ========================= */

    let currentUser = null;


    /* =========================
       SAVED POSTS
    ========================= */

    let savedPostIds = new Set();


    /* =========================
       PROFILE
    ========================= */

    async function loadCurrentUserProfile() {

        try {

            const {
                data: {
                    user
                },
                error: userError
            } = await supabase.auth.getUser();


            if (userError || !user) {
                return;
            }


            currentUser = user;


            const {
                data: profile,
                error: profileError
            } = await supabase
                .from("profiles")
                .select("full_name, user_type")
                .eq("id", user.id)
                .maybeSingle();


            if (profileError) {

                console.error(
                    "Profile loading error:",
                    profileError
                );

                return;
            }


            if (profile) {

                if (userName) {

                    userName.textContent =
                        profile.full_name ||
                        "My Profile";

                }


                if (userType) {

                    userType.textContent =
                        profile.user_type ||
                        "Account";

                }


                if (welcomeMessage) {

                    const firstName =
                        (profile.full_name || "")
                            .trim()
                            .split(" ")[0];


                    if (firstName) {

                        welcomeMessage.textContent =
                            `Welcome back ${firstName} 👋`;

                    }

                }

            }

        } catch (error) {

            console.error(
                "Unable to load user profile:",
                error
            );

        }

    }


    /* =========================
       LOAD SAVED POSTS
    ========================= */

    async function loadSavedPostIds() {

        savedPostIds = new Set();


        if (!currentUser) {
            return;
        }


        try {

            const {
                data,
                error
            } =
                await supabase
                    .from("saved_posts")
                    .select("post_id")
                    .eq(
                        "user_id",
                        currentUser.id
                    );


            if (error) {
                throw error;
            }


            savedPostIds =
                new Set(
                    (data || []).map(
                        row =>
                            String(
                                row.post_id
                            )
                    )
                );

        } catch (error) {

            console.error(
                "Saved posts loading error:",
                error
            );

        }

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
       LOGOUT
    ========================= */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();


                await supabase.auth.signOut();


                window.location.href =
                    "login.html";

            }
        );

    }


    /* =========================
       CREATE POST MODAL
    ========================= */

    function openCreatePostModal() {

        if (!createPostModal) {
            return;
        }


        createPostModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeCreatePostModal() {

        if (!createPostModal) {
            return;
        }


        createPostModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";

    }


    if (sellButton) {

        sellButton.addEventListener(
            "click",
            openCreatePostModal
        );

    }


    if (closePostModal) {

        closePostModal.addEventListener(
            "click",
            closeCreatePostModal
        );

    }


    if (cancelPostButton) {

        cancelPostButton.addEventListener(
            "click",
            closeCreatePostModal
        );

    }


    if (createPostModal) {

        createPostModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    createPostModal
                ) {

                    closeCreatePostModal();

                }

            }
        );

    }


    /* =========================
       POST TYPE
    ========================= */

    const postTypeButtons =
        document.querySelectorAll(
            ".post-type-button"
        );


    postTypeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    postTypeButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedPostType =
                        button.dataset.postType ||
                        "product";


                    if (eventDateGroup) {

                        if (
                            selectedPostType ===
                            "event"
                        ) {

                            eventDateGroup.style.display =
                                "block";

                        } else {

                            eventDateGroup.style.display =
                                "none";


                            if (eventDate) {

                                eventDate.value =
                                    "";

                            }

                        }

                    }

                }
            );

        }
    );


    /* =========================
       IMAGE PREVIEW
    ========================= */

    if (postImage) {

        postImage.addEventListener(
            "change",
            () => {

                const file =
                    postImage.files[0];


                if (!file) {
                    return;
                }


                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    alert(
                        "Please upload a JPG, PNG or WEBP image."
                    );


                    postImage.value =
                        "";


                    return;

                }


                if (
                    file.size >
                    5 * 1024 * 1024
                ) {

                    alert(
                        "Image must be smaller than 5 MB."
                    );


                    postImage.value =
                        "";


                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    (event) => {

                        if (
                            imagePreviewImage
                        ) {

                            imagePreviewImage.src =
                                event.target.result;

                        }


                        if (imagePreview) {

                            imagePreview.classList.add(
                                "active"
                            );

                        }

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =========================
       REMOVE IMAGE
    ========================= */

    if (removeImageButton) {

        removeImageButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                if (postImage) {

                    postImage.value =
                        "";

                }


                if (imagePreviewImage) {

                    imagePreviewImage.src =
                        "";

                }


                if (imagePreview) {

                    imagePreview.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =========================
       CREATE POST
    ========================= */

    if (createPostForm) {

        createPostForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const title =
                    document
                        .getElementById(
                            "postTitle"
                        )
                        ?.value
                        .trim();


                const description =
                    document
                        .getElementById(
                            "postDescription"
                        )
                        ?.value
                        .trim();


                const category =
                    document
                        .getElementById(
                            "postCategory"
                        )
                        ?.value;


                const price =
                    document
                        .getElementById(
                            "postPrice"
                        )
                        ?.value
                        .trim();


                const location =
                    document
                        .getElementById(
                            "postLocation"
                        )
                        ?.value
                        .trim();


                const eventDateValue =
                    eventDate?.value ||
                    null;


                /* =========================
                   VALIDATION
                ========================= */

                if (!title) {

                    alert(
                        "Please enter a title."
                    );


                    return;

                }


                if (!description) {

                    alert(
                        "Please enter a description."
                    );


                    return;

                }


                if (!category) {

                    alert(
                        "Please select a category."
                    );


                    return;

                }


                if (
                    selectedPostType ===
                    "event" &&
                    !eventDateValue
                ) {

                    alert(
                        "Please select an event date."
                    );


                    return;

                }


                if (publishPostButton) {

                    publishPostButton.disabled =
                        true;


                    publishPostButton.textContent =
                        "Publishing...";

                }


                try {

                    const {
                        data: {
                            user
                        },
                        error: userError
                    } =
                        await supabase.auth.getUser();


                    if (
                        userError ||
                        !user
                    ) {

                        throw new Error(
                            "You must be logged in to create a post."
                        );

                    }


                    let imageUrl =
                        null;


                    const file =
                        postImage
                            ?.files?.[0];


                    if (file) {

                        const fileExtension =
                            file.name
                                .split(".")
                                .pop()
                                .toLowerCase();


                        const fileName =
                            `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;


                        const {
                            error:
                                uploadError
                        } =
                            await supabase
                                .storage
                                .from(
                                    "post-images"
                                )
                                .upload(
                                    fileName,
                                    file,
                                    {
                                        contentType:
                                            file.type,

                                        upsert:
                                            false
                                    }
                                );


                        if (uploadError) {
                            throw uploadError;
                        }


                        const {
                            data:
                                publicUrlData
                        } =
                            supabase
                                .storage
                                .from(
                                    "post-images"
                                )
                                .getPublicUrl(
                                    fileName
                                );


                        imageUrl =
                            publicUrlData
                                .publicUrl;

                    }


                    const {
                        error: postError
                    } =
                        await supabase
                            .from("posts")
                            .insert([
                                {
                                    user_id:
                                        user.id,

                                    title:
                                        title,

                                    description:
                                        description,

                                    post_type:
                                        selectedPostType,

                                    category:
                                        category,

                                    price:
                                        price
                                            ? Number(
                                                price
                                            )
                                            : null,

                                    location:
                                        location
                                            ? location
                                            : null,

                                    image_url:
                                        imageUrl,

                                    event_date:
                                        selectedPostType ===
                                        "event"
                                            ? eventDateValue
                                            : null
                                }
                            ]);


                    if (postError) {
                        throw postError;
                    }


                    alert(
                        selectedPostType === "event"
                            ? "Your event has been published successfully!"
                            : "Your post has been published successfully!"
                    );


                    createPostForm.reset();


                    selectedPostType =
                        "product";


                    postTypeButtons.forEach(
                        (
                            button,
                            index
                        ) => {

                            button.classList.toggle(
                                "active",
                                index === 0
                            );

                        }
                    );


                    if (eventDateGroup) {

                        eventDateGroup.style.display =
                            "none";

                    }


                    if (imagePreview) {

                        imagePreview.classList.remove(
                            "active"
                        );

                    }


                    if (imagePreviewImage) {

                        imagePreviewImage.src =
                            "";

                    }


                    closeCreatePostModal();


                    await loadPosts();

                } catch (error) {

                    console.error(
                        "Create post error:",
                        error
                    );


                    alert(
                        error.message ||
                        "Something went wrong while publishing your post."
                    );

                } finally {

                    if (publishPostButton) {

                        publishPostButton.disabled =
                            false;


                        publishPostButton.textContent =
                            "Publish Post";

                    }

                }

            }
        );

    }


    /* =========================
       LOAD POSTS
    ========================= */

    async function loadPosts() {

        if (
            !featuredProducts &&
            !recentProducts
        ) {
            return;
        }


        try {

            await loadSavedPostIds();


            const {
                data: posts,
                error
            } =
                await supabase
                    .from("posts")
                    .select("*")
                    .neq(
                        "post_type",
                        "event"
                    )
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {
                throw error;
            }


            if (
                !posts ||
                posts.length === 0
            ) {

                showEmptyState(
                    featuredProducts,
                    "No featured items yet",
                    "Check back soon for something new."
                );


                showEmptyState(
                    recentProducts,
                    "No recent items yet",
                    "Be the first to create a post."
                );


                return;

            }


            /* =========================
               LOAD POSTER PROFILES
            ========================= */

            const userIds = [
                ...new Set(
                    posts
                        .map(
                            post =>
                                post.user_id
                        )
                        .filter(Boolean)
                )
            ];


            let profiles = [];


            if (userIds.length) {

                const {
                    data:
                        profileData,
                    error:
                        profileError
                } =
                    await supabase
                        .from("profiles")
                        .select(
                            "id, full_name, phone_number"
                        )
                        .in(
                            "id",
                            userIds
                        );


                if (profileError) {

                    console.error(
                        "Poster profile loading error:",
                        profileError
                    );

                } else {

                    profiles =
                        profileData ||
                        [];

                }

            }


            const profileMap =
                new Map(
                    profiles.map(
                        profile => [
                            profile.id,
                            profile
                        ]
                    )
                );


            posts.forEach(
                (post) => {

                    post.profile =
                        profileMap.get(
                            post.user_id
                        ) || null;

                }
            );


            const featured =
                posts.slice(0, 4);


            const recent =
                posts.slice(0, 8);


            renderPosts(
                featuredProducts,
                featured
            );


            renderPosts(
                recentProducts,
                recent
            );

        } catch (error) {

            console.error(
                "Error loading posts:",
                error
            );

        }

    }


    /* =========================
       EMPTY STATE
    ========================= */

    function showEmptyState(
        container,
        title,
        description
    ) {

        if (!container) {
            return;
        }


        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">♡</div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(description)}</p>
            </div>
        `;

    }


    /* =========================
       RENDER POSTS
    ========================= */

    function renderPosts(
        container,
        posts
    ) {

        if (!container) {
            return;
        }


        if (!posts.length) {

            showEmptyState(
                container,
                "No posts yet",
                "Be the first to create a post."
            );


            return;

        }


        container.innerHTML =
            posts
                .map(
                    (post) => {

                        const price =
                            post.price !== null &&
                            post.price !== undefined
                                ? `R ${Number(
                                    post.price
                                ).toFixed(2)}`
                                : "No price";


                        const profile =
                            post.profile;


                        const posterName =
                            profile?.full_name ||
                            "Community member";


                        const posterPhone =
                            profile?.phone_number ||
                            "Phone number not available";


                        const isSaved =
                            savedPostIds.has(
                                String(
                                    post.id
                                )
                            );


                        const image =
                            post.image_url
                                ? `
                                    <img
                                        src="${escapeHtml(
                                            post.image_url
                                        )}"
                                        alt="${escapeHtml(
                                            post.title
                                        )}"
                                    >
                                `
                                : `
                                    <div class="post-placeholder">
                                        ${getPostIcon(
                                            post.post_type
                                        )}
                                    </div>
                                `;


                        /*
                         * PRODUCTS AND SERVICES:
                         * MESSAGE
                         *
                         * TUTORING:
                         * BOOK
                         *
                         * EVENTS:
                         * EXCLUDED FROM HOME.
                         * THEY BELONG ON THE
                         * COMMUNITY BOARD.
                         */

                        const actionButton =
                            post.post_type === "tutoring"
                                ? `
                                    <button
                                        type="button"
                                        class="post-action-button book-button"
                                        data-action="book"
                                        data-post-id="${escapeHtml(
                                            post.id
                                        )}"
                                    >
                                        Book
                                    </button>
                                `
                                : `
                                    <button
                                        type="button"
                                        class="post-action-button message-button"
                                        data-action="message"
                                        data-user-id="${escapeHtml(
                                            post.user_id
                                        )}"
                                        data-user-name="${escapeHtml(
                                            posterName
                                        )}"
                                    >
                                        Message
                                    </button>
                                `;


                        return `
                            <article
                                class="product-card"
                                data-post-id="${escapeHtml(
                                    post.id
                                )}"
                            >

                                <div class="product-image">

                                    ${image}


                                    <button
                                        type="button"
                                        class="save-post-button ${
                                            isSaved
                                                ? "saved"
                                                : ""
                                        }"
                                        data-action="save"
                                        data-post-id="${escapeHtml(
                                            post.id
                                        )}"
                                        aria-label="${
                                            isSaved
                                                ? "Remove from saved"
                                                : "Save post"
                                        }"
                                        aria-pressed="${
                                            isSaved
                                                ? "true"
                                                : "false"
                                        }"
                                    >
                                        ${
                                            isSaved
                                                ? "♥"
                                                : "♡"
                                        }
                                    </button>

                                </div>


                                <div class="product-details">

                                    <h3>
                                        ${escapeHtml(
                                            post.title
                                        )}
                                    </h3>


                                    <p>
                                        ${escapeHtml(
                                            formatCategory(
                                                post.category
                                            )
                                        )}

                                        ${
                                            post.location
                                                ? ` · ${escapeHtml(
                                                    post.location
                                                )}`
                                                : ""
                                        }
                                    </p>


                                    <strong class="post-price">
                                        ${price}
                                    </strong>


                                    <div class="post-author">

                                        <span class="post-author-icon">
                                            👤
                                        </span>

                                        <span>
                                            ${escapeHtml(
                                                posterName
                                            )}
                                        </span>

                                    </div>


                                    <div class="post-phone">

                                        <span>
                                            📞
                                        </span>

                                        <span>
                                            ${escapeHtml(
                                                posterPhone
                                            )}
                                        </span>

                                    </div>


                                    <div class="post-actions">

                                        ${actionButton}

                                    </div>


                                    <div
                                        class="post-expanded-details"
                                        id="post-details-${escapeHtml(
                                            post.id
                                        )}"
                                    >

                                        <p class="post-description">
                                            ${escapeHtml(
                                                post.description
                                            )}
                                        </p>


                                        <div class="post-detail-row">

                                            <strong>
                                                Posted by:
                                            </strong>

                                            <span>
                                                ${escapeHtml(
                                                    posterName
                                                )}
                                            </span>

                                        </div>


                                        <div class="post-detail-row">

                                            <strong>
                                                Contact:
                                            </strong>

                                            <span>
                                                ${escapeHtml(
                                                    posterPhone
                                                )}
                                            </span>

                                        </div>


                                        ${
                                            post.location
                                                ? `
                                                    <div class="post-detail-row">

                                                        <strong>
                                                            Location:
                                                        </strong>

                                                        <span>
                                                            ${escapeHtml(
                                                                post.location
                                                            )}
                                                        </span>

                                                    </div>
                                                `
                                                : ""
                                        }

                                    </div>

                                </div>

                            </article>
                        `;

                    }
                )
                .join("");


        attachPostActions();

    }


    /* =========================
       POST ACTIONS
    ========================= */

    function attachPostActions() {

        /* =========================
           BOOK BUTTONS
        ========================= */

        const bookButtons =
            document.querySelectorAll(
                '[data-action="book"]'
            );


        bookButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const postId =
                            button.dataset.postId;


                        if (!postId) {
                            return;
                        }


                        await openBookingModal(
                            postId
                        );

                    }
                );

            }
        );


        /* =========================
           MESSAGE BUTTONS
        ========================= */

        const messageButtons =
            document.querySelectorAll(
                '[data-action="message"]'
            );


        messageButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const sellerId =
                            button.dataset.userId;


                        const sellerName =
                            button.dataset.userName;


                        if (
                            !sellerId ||
                            sellerId ===
                            currentUser?.id
                        ) {

                            if (
                                sellerId ===
                                currentUser?.id
                            ) {

                                alert(
                                    "You cannot message yourself."
                                );

                            } else {

                                alert(
                                    "This user could not be identified."
                                );

                            }


                            return;

                        }


                        const params =
                            new URLSearchParams();


                        params.set(
                            "sellerId",
                            sellerId
                        );


                        params.set(
                            "sellerName",
                            sellerName ||
                            "Community member"
                        );


                        window.location.href =
                            `chat.html?${params.toString()}`;

                    }
                );

            }
        );


        /* =========================
           SAVE BUTTONS
        ========================= */

        const saveButtons =
            document.querySelectorAll(
                '[data-action="save"]'
            );


        saveButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    async (event) => {

                        event.preventDefault();

                        event.stopPropagation();


                        const postId =
                            button.dataset.postId;


                        if (!postId) {
                            return;
                        }


                        await toggleSavedPost(
                            postId,
                            button
                        );

                    }
                );

            }
        );

    }


    /* =========================
       OPEN BOOKING MODAL
    ========================= */

    async function openBookingModal(
        postId
    ) {

        if (!currentUser) {

            alert(
                "Please log in to make a booking."
            );


            return;

        }


        try {

            const {
                data: post,
                error: postError
            } =
                await supabase
                    .from("posts")
                    .select(
                        "id, title, description, post_type, category, price, location, image_url, event_date"
                    )
                    .eq(
                        "id",
                        Number(postId)
                    )
                    .single();


            if (postError) {
                throw postError;
            }


            /*
             * Only tutoring can be booked
             * from Home.
             *
             * Events are handled by
             * Community Board.
             */

            if (
                post.post_type !==
                "tutoring"
            ) {

                throw new Error(
                    "This post cannot be booked from Home."
                );

            }


            selectedBookingPost =
                post;


            await prepareBookingModal(
                post
            );


            if (bookingModal) {

                bookingModal.classList.add(
                    "active"
                );

                document.body.style.overflow =
                    "hidden";

            }

        } catch (error) {

            console.error(
                "Open booking modal error:",
                error
            );


            alert(
                error.message ||
                "Unable to open the booking."
            );

        }

    }


    /* =========================
       PREPARE BOOKING MODAL
    ========================= */

    async function prepareBookingModal(
        post
    ) {

        if (bookingContent) {

            bookingContent.style.display =
                "grid";

        }


        if (bookingSuccess) {

            bookingSuccess.style.display =
                "none";

        }


        if (confirmBookingButton) {

            confirmBookingButton.style.display =
                "inline-flex";

            confirmBookingButton.disabled =
                false;

            confirmBookingButton.textContent =
                "Confirm Booking";

        }


        if (cancelBookingButton) {

            cancelBookingButton.style.display =
                "inline-flex";

        }


        if (bookingTitle) {

            bookingTitle.textContent =
                post.title ||
                "Tutoring";

        }


        if (bookingDescription) {

            bookingDescription.textContent =
                post.description ||
                "No description provided.";

        }


        if (bookingCategory) {

            bookingCategory.textContent =
                formatCategory(
                    post.category
                );

        }


        if (bookingLocation) {

            bookingLocation.textContent =
                post.location ||
                "Not specified";

        }


        if (bookingPrice) {

            bookingPrice.textContent =
                post.price !== null &&
                post.price !== undefined
                    ? `R ${Number(
                        post.price
                    ).toFixed(2)}`
                    : "Free";

        }


        if (bookingCategoryRow) {

            bookingCategoryRow.style.display =
                post.category
                    ? "flex"
                    : "none";

        }


        if (bookingLocationRow) {

            bookingLocationRow.style.display =
                post.location
                    ? "flex"
                    : "none";

        }


        if (bookingDateRow) {

            bookingDateRow.style.display =
                "none";

        }


        if (bookingDate) {

            bookingDate.textContent =
                "";

        }


        if (bookingImageContainer) {

            if (post.image_url) {

                bookingImageContainer.innerHTML = `
                    <img
                        src="${escapeHtml(
                            post.image_url
                        )}"
                        alt="${escapeHtml(
                            post.title
                        )}"
                    >
                `;

            } else {

                bookingImageContainer.innerHTML = `
                    <div class="booking-placeholder">
                        ${getPostIcon(
                            post.post_type
                        )}
                    </div>
                `;

            }

        }

    }


    /* =========================
       CLOSE BOOKING MODAL
    ========================= */

    function closeBookingModalFunction() {

        if (bookingModal) {

            bookingModal.classList.remove(
                "active"
            );

        }


        document.body.style.overflow =
            "";


        selectedBookingPost =
            null;

    }


    if (closeBookingModal) {

        closeBookingModal.addEventListener(
            "click",
            closeBookingModalFunction
        );

    }


    if (cancelBookingButton) {

        cancelBookingButton.addEventListener(
            "click",
            closeBookingModalFunction
        );

    }


    if (bookingModal) {

        bookingModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    bookingModal
                ) {

                    closeBookingModalFunction();

                }

            }
        );

    }


    /* =========================
       CONFIRM BOOKING
    ========================= */

    if (confirmBookingButton) {

        confirmBookingButton.addEventListener(
            "click",
            async () => {

                await confirmBooking();

            }
        );

    }


    async function confirmBooking() {

        if (!currentUser) {

            alert(
                "Please log in to make a booking."
            );


            return;

        }


        if (!selectedBookingPost) {

            alert(
                "No booking was selected."
            );


            return;

        }


        if (confirmBookingButton) {

            confirmBookingButton.disabled =
                true;

            confirmBookingButton.textContent =
                "Confirming...";

        }


        try {

            /*
             * Check whether the user already
             * has a confirmed booking.
             */

            const {
                data: existingBooking,
                error: existingError
            } =
                await supabase
                    .from("bookings")
                    .select("id, status")
                    .eq(
                        "user_id",
                        currentUser.id
                    )
                    .eq(
                        "post_id",
                        Number(
                            selectedBookingPost.id
                        )
                    )
                    .eq(
                        "status",
                        "confirmed"
                    )
                    .maybeSingle();


            if (existingError) {
                throw existingError;
            }


            if (existingBooking) {

                throw new Error(
                    "You have already booked this tutoring session."
                );

            }


            const quantity =
                1;


            const totalAmount =
                Number(
                    selectedBookingPost.price ||
                    0
                ) *
                quantity;


            const {
                error: bookingError
            } =
                await supabase
                    .from("bookings")
                    .insert([
                        {
                            user_id:
                                currentUser.id,

                            post_id:
                                Number(
                                    selectedBookingPost.id
                                ),

                            quantity:
                                quantity,

                            total_amount:
                                totalAmount,

                            status:
                                "confirmed"
                        }
                    ]);


            if (bookingError) {
                throw bookingError;
            }


            if (bookingContent) {

                bookingContent.style.display =
                    "none";

            }


            if (bookingSuccess) {

                bookingSuccess.style.display =
                    "block";

            }


            if (confirmBookingButton) {

                confirmBookingButton.style.display =
                    "none";

            }


            if (cancelBookingButton) {

                cancelBookingButton.textContent =
                    "Close";

            }


        } catch (error) {

            console.error(
                "Confirm booking error:",
                error
            );


            alert(
                error.message ||
                "Unable to confirm booking."
            );


            if (confirmBookingButton) {

                confirmBookingButton.disabled =
                    false;

                confirmBookingButton.textContent =
                    "Confirm Booking";

            }

        }

    }


    /* =========================
       TOGGLE SAVED POST
    ========================= */

    async function toggleSavedPost(
        postId,
        button
    ) {

        if (!currentUser) {

            alert(
                "Please log in to save posts."
            );


            return;

        }


        const isSaved =
            savedPostIds.has(
                String(postId)
            );


        button.disabled =
            true;


        try {

            if (isSaved) {

                const {
                    error
                } =
                    await supabase
                        .from("saved_posts")
                        .delete()
                        .eq(
                            "user_id",
                            currentUser.id
                        )
                        .eq(
                            "post_id",
                            Number(postId)
                        );


                if (error) {
                    throw error;
                }


                savedPostIds.delete(
                    String(postId)
                );


                updateSaveButtons(
                    postId,
                    false
                );

            } else {

                const {
                    error
                } =
                    await supabase
                        .from("saved_posts")
                        .insert([
                            {
                                user_id:
                                    currentUser.id,

                                post_id:
                                    Number(postId)
                            }
                        ]);


                if (
                    error &&
                    error.code !== "23505"
                ) {

                    throw error;

                }


                savedPostIds.add(
                    String(postId)
                );


                updateSaveButtons(
                    postId,
                    true
                );

            }

        } catch (error) {

            console.error(
                "Save post error:",
                error
            );


            alert(
                error.message ||
                "Unable to update saved post."
            );

        } finally {

            button.disabled =
                false;

        }

    }


    /* =========================
       UPDATE SAVE BUTTONS
    ========================= */

    function updateSaveButtons(
        postId,
        saved
    ) {

        const buttons =
            document.querySelectorAll(
                `[data-action="save"][data-post-id="${postId}"]`
            );


        buttons.forEach(
            (button) => {

                button.classList.toggle(
                    "saved",
                    saved
                );


                button.textContent =
                    saved
                        ? "♥"
                        : "♡";


                button.setAttribute(
                    "aria-label",
                    saved
                        ? "Remove from saved"
                        : "Save post"
                );


                button.setAttribute(
                    "aria-pressed",
                    saved
                        ? "true"
                        : "false"
                );

            }
        );

    }


    /* =========================
       POST ICON
    ========================= */

    function getPostIcon(type) {

        switch (type) {

            case "service":
                return "🛠️";

            case "tutoring":
                return "📚";

            case "event":
                return "📅";

            default:
                return "🛍️";

        }

    }


    /* =========================
       CATEGORY NAME
    ========================= */

    function formatCategory(category) {

        if (!category) {
            return "";
        }


        return category
            .split("-")
            .map(
                word =>
                    word.charAt(0).toUpperCase() +
                    word.slice(1)
            )
            .join(" ");

    }


    /* =========================
       EVENT DATE
    ========================= */

    function formatDate(dateValue) {

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
       NOTIFICATIONS
    ========================= */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                alert(
                    "You have no new notifications."
                );

            }
        );

    }


    /* =========================
       SEARCH
    ========================= */

    if (dashboardSearch) {

        dashboardSearch.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    const searchTerm =
                        dashboardSearch
                            .value
                            .trim();


                    if (!searchTerm) {
                        return;
                    }


                    window.location.href =
                        `search.html?q=${encodeURIComponent(
                            searchTerm
                        )}`;

                }

            }
        );

    }


    /* =========================
       CATEGORY BUTTONS
    ========================= */

    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    categoryCards.forEach(
        (category) => {

            category.addEventListener(
                "click",
                () => {

                    const categoryName =
                        category
                            .querySelector(
                                "span:last-child"
                            )
                            ?.textContent
                            .trim();


                    const categoryValue =
                        category.dataset.category;


                    if (
                        categoryValue
                    ) {

                        window.location.href =
                            `search.html?category=${encodeURIComponent(
                                categoryValue
                            )}`;

                    } else if (
                        categoryName
                    ) {

                        window.location.href =
                            `search.html?q=${encodeURIComponent(
                                categoryName
                            )}`;

                    }

                }
            );

        }
    );


    /* =========================
       VIEW ALL / SEE MORE
    ========================= */

    const viewAllButtons =
        document.querySelectorAll(
            ".text-button"
        );


    viewAllButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "search.html";

                }
            );

        }
    );


    /* =========================
       INITIAL LOAD
    ========================= */

    await loadCurrentUserProfile();

    await loadPosts();

});