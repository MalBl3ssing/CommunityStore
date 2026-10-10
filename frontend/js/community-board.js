

document.addEventListener("DOMContentLoaded", () => {

    const API =
        "http://localhost:8080/api/community-posts/getAll";

    const container =
        document.getElementById("eventsList");

    const search =
        document.getElementById("eventSearch");

    let posts = [];

    function render() {
        if (!container) return;

        const query = (search?.value || "")
            .toLowerCase()
            .trim();

        const filtered = posts.filter(post =>
            (post.title || "").toLowerCase().includes(query) ||
            (post.content || "").toLowerCase().includes(query)
        );

        container.innerHTML = "";

        if (!filtered.length) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px">
                    <h3>No community posts found</h3>
                    <p>Try another search.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(post => {
            const card = document.createElement("article");

            card.style.cssText = `
                background:white;
                border:1px solid #e2e6e0;
                border-radius:14px;
                padding:22px;
                margin-bottom:16px;
            `;

            const title = document.createElement("h3");
            title.textContent = post.title || "Community post";
            title.style.color = "#24485b";

            const content = document.createElement("p");
            content.textContent = post.content || "";
            content.style.lineHeight = "1.6";

            const author = document.createElement("small");
            author.textContent =
                "Posted by " + (post.author || "Community member") +
                " · " +
                (post.postDate
                    ? new Date(post.postDate).toLocaleDateString()
                    : "");

            author.style.color = "#64776b";

            card.append(title, content, author);
            container.appendChild(card);
        });
    }

    async function loadPosts() {
        if (!container) {
            console.error("eventsList element not found");
            return;
        }

        container.textContent = "Loading community posts...";

        try {
            const response = await fetch(API);

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            posts = await response.json();

            posts.sort((a, b) =>
                new Date(b.postDate) -
                new Date(a.postDate)
            );

            console.log("Community posts loaded:", posts.length);

            render();

        } catch (error) {
            console.error("Community API error:", error);

            container.textContent =
                "Unable to load community posts. " +
                "Check Spring Boot and API permissions.";
        }
    }

    if (search) {
        search.addEventListener("input", render);
    }

    loadPosts();
});
