


document.addEventListener("DOMContentLoaded", () => {

    const API = "http://localhost:8080/api";

    const featured = document.getElementById("featuredProducts");
    const recent = document.getElementById("recentProducts");

    const escapeHTML = value =>
        String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char]));

    const money = value =>
        "R " + Number(value || 0).toFixed(2);

    function createCard(product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const seller = [
            product.seller?.firstName,
            product.seller?.lastName
        ].filter(Boolean).join(" ") || "Community member";

        card.innerHTML = `
            <div class="product-image">
                <div style="
                    min-height:140px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#f3f4f6;
                    font-size:44px;
                ">📦</div>
            </div>

            <div class="product-info" style="padding:14px">
                <span class="product-category">
                    ${escapeHTML(product.category?.categoryName || "Other")}
                </span>

                <h3 class="product-title">
                    ${escapeHTML(product.productName)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description || "")}
                </p>

                <p class="product-price" style="
                    font-size:20px;
                    font-weight:bold;
                    margin:10px 0;
                ">
                    ${money(product.price)}
                </p>

                <p class="product-seller">
                    Seller: ${escapeHTML(seller)}
                </p>

                <p class="product-condition">
                    Condition: ${escapeHTML(product.condition || "Not specified")}
                </p>

                <button type="button"
                    class="view-product-button"
                    style="margin-top:12px;padding:10px">
                    View product
                </button>
            </div>
        `;

        card.querySelector("button").addEventListener("click", () => {
            alert(
                product.productName + "\n" +
                money(product.price) + "\n\n" +
                (product.description || "") + "\n\n" +
                "Seller: " + seller
            );
        });

        return card;
    }

    function render(container, products) {
        if (!container) return;

        container.innerHTML = "";

        if (!products.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">◈</div>
                    <h3>No products available</h3>
                    <p>Check back soon.</p>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            container.appendChild(createCard(product));
        });
    }

    async function loadProducts() {
        try {
            const response = await fetch(
                API + "/products/getAll"
            );

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            const data = await response.json();

            const products = data.filter(product =>
                product.status?.toLowerCase() === "available"
            );

            products.sort((a, b) =>
                new Date(b.datePosted) -
                new Date(a.datePosted)
            );

            render(featured, products.slice(0, 4));
            render(recent, products.slice(0, 8));

            console.log(
                "MySQL products loaded:",
                products.length
            );

        } catch (error) {
            console.error("Failed to load products:", error);

            [featured, recent].forEach(container => {
                if (container) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <h3>Unable to load products</h3>
                            <p>Check that Spring Boot is running.</p>
                        </div>
                    `;
                }
            });
        }
    }

    // Search from the home page.
    const searchInputs = document.querySelectorAll(
        'input[type="search"], input[placeholder*="Search"]'
    );

    searchInputs.forEach(input => {
        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                const query = encodeURIComponent(input.value.trim());
                window.location.href =
                    "search.html?q=" + query;
            }
        });
    });

    // See more buttons.
    ["featuredSeeMore", "recentSeeAll"].forEach(id => {
        const button = document.getElementById(id);

        if (button) {
            button.addEventListener("click", () => {
                window.location.href = "search.html";
            });
        }
    });

    loadProducts();
});
