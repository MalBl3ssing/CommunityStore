
/*
 * COMMUNITYSTORE - SEARCH PAGE
 * Spring Boot + MySQL integration
 */

document.addEventListener("DOMContentLoaded", () => {

    const API = "http://localhost:8080/api";

    const grid = document.getElementById("productGrid");
    const search = document.getElementById("productSearchInput");
    const headerSearch = document.getElementById("searchInput");
    const category = document.getElementById("categoryFilter");
    const sort = document.getElementById("sortFilter");
    const count = document.getElementById("resultsCount");
    const loading = document.getElementById("loadingState");
    const empty = document.getElementById("emptyState");
    const clear = document.getElementById("clearSearchButton");
    const reset = document.getElementById("resetSearchButton");

    let products = [];

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
                    background:#f3f4f6;
                    min-height:140px;
                    display:flex;
                    justify-content:center;
                    align-items:center;
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

    function renderProducts() {
        if (!grid) return;

        const query = (search?.value || "")
            .trim()
            .toLowerCase();

        const selectedCategory =
            (category?.value || "all").toLowerCase();

        const selectedSort = sort?.value || "newest";

        let filtered = products.filter(product => {
            const name =
                (product.productName || "").toLowerCase();

            const description =
                (product.description || "").toLowerCase();

            const productCategory =
                (product.category?.categoryName || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");

            const matchesSearch =
                name.includes(query) ||
                description.includes(query) ||
                productCategory.includes(query);

            const matchesCategory =
                selectedCategory === "all" ||
                selectedCategory === productCategory;

            return matchesSearch && matchesCategory;
        });

        filtered.sort((a, b) => {
            if (selectedSort === "price-low") {
                return Number(a.price) - Number(b.price);
            }

            if (selectedSort === "price-high") {
                return Number(b.price) - Number(a.price);
            }

            if (selectedSort === "oldest") {
                return new Date(a.datePosted) -
                    new Date(b.datePosted);
            }

            return new Date(b.datePosted) -
                new Date(a.datePosted);
        });

        grid.innerHTML = "";

        filtered.forEach(product => {
            grid.appendChild(createCard(product));
        });

        if (count) {
            count.textContent =
                filtered.length +
                (filtered.length === 1 ? " item" : " items");
        }

        if (empty) {
            empty.hidden = filtered.length > 0;
        }
    }

    async function loadProducts() {
        if (loading) loading.hidden = false;
        if (empty) empty.hidden = true;

        try {
            const response = await fetch(
                API + "/products/getAll"
            );

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            const data = await response.json();

            products = data.filter(product =>
                product.status?.toLowerCase() === "available"
            );

            renderProducts();

            console.log(
                "Loaded products from MySQL:",
                products.length
            );

        } catch (error) {
            console.error("Product loading error:", error);

            products = [];
            if (grid) grid.innerHTML = "";

            if (count) count.textContent = "0 items";

            if (empty) {
                empty.hidden = false;
                const message = empty.querySelector("p");

                if (message) {
                    message.textContent =
                        "Unable to load listings. Check Spring Boot.";
                }
            }
        } finally {
            if (loading) loading.hidden = true;
        }
    }

    // Search controls.
    if (search) {
        search.addEventListener("input", renderProducts);
    }

    if (headerSearch) {
        headerSearch.addEventListener("keydown", event => {
            if (event.key === "Enter" && search) {
                search.value = headerSearch.value;
                renderProducts();
            }
        });
    }

    if (category) {
        category.addEventListener("change", renderProducts);
    }

    if (sort) {
        sort.addEventListener("change", renderProducts);
    }

    if (clear) {
        clear.addEventListener("click", () => {
            if (search) search.value = "";
            renderProducts();
        });
    }

    if (reset) {
        reset.addEventListener("click", () => {
            if (search) search.value = "";
            if (category) category.value = "all";
            if (sort) sort.value = "newest";

            renderProducts();
        });
    }

    // Support search queries from home.html.
    const params = new URLSearchParams(
        window.location.search
    );

    const query = params.get("q");

    if (query && search) {
        search.value = query;
    }

    loadProducts();
});
