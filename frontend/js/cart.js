

document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "communityStoreCart";

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const subtotal = document.getElementById("subtotal");
    const total = document.getElementById("cartTotal");
    const itemCount = document.getElementById("itemCount");
    const cartBadge = document.getElementById("cartBadge");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const clearCartBtn = document.getElementById("clearCartBtn");

    const money = value =>
        "R " + Number(value || 0).toFixed(2);

    function getCart() {
        try {
            const data = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cart)
        );
        renderCart();
    }

    function changeQuantity(productID, change) {
        const cart = getCart();

        const item = cart.find(
            p => String(p.productID) === String(productID)
        );

        if (!item) return;

        item.quantity = Math.max(
            1,
            Number(item.quantity) + change
        );

        saveCart(cart);
    }

    function removeItem(productID) {
        const cart = getCart().filter(
            p => String(p.productID) !== String(productID)
        );

        saveCart(cart);
    }

    function renderCart() {
        const cart = getCart();

        cartItems.innerHTML = "";

        const quantity = cart.reduce(
            (sum, item) => sum + Number(item.quantity || 0),
            0
        );

        const amount = cart.reduce(
            (sum, item) =>
                sum +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );

        itemCount.textContent =
            quantity + (quantity === 1 ? " item" : " items");

        cartBadge.textContent = quantity;

        subtotal.textContent = money(amount);
        total.textContent = money(amount);

        emptyCart.hidden = cart.length !== 0;

        checkoutBtn.disabled = cart.length === 0;

        if (!cart.length) return;

        cart.forEach(item => {

            const row = document.createElement("div");
            row.className = "cart-item";

            const image = document.createElement("div");
            image.className = "item-image";
            image.textContent = "📦";

            const details = document.createElement("div");
            details.className = "item-details";

            const name = document.createElement("h3");
            name.textContent = item.productName;

            const price = document.createElement("p");
            price.className = "item-price";
            price.textContent = money(item.price);

            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const minus = document.createElement("button");
            minus.type = "button";
            minus.textContent = "−";
            minus.addEventListener("click", () =>
                changeQuantity(item.productID, -1)
            );

            const count = document.createElement("span");
            count.textContent = item.quantity;

            const plus = document.createElement("button");
            plus.type = "button";
            plus.textContent = "+";
            plus.addEventListener("click", () =>
                changeQuantity(item.productID, 1)
            );

            controls.append(minus, count, plus);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-btn";
            remove.textContent = "Remove item";
            remove.addEventListener("click", () =>
                removeItem(item.productID)
            );

            details.append(name, price, controls, remove);

            const itemTotal = document.createElement("div");
            itemTotal.className = "item-total";
            itemTotal.textContent = money(
                Number(item.price) * Number(item.quantity)
            );

            row.append(image, details, itemTotal);
            cartItems.appendChild(row);
        });
    }

    clearCartBtn.addEventListener("click", () => {
        if (confirm("Remove all items from your cart?")) {
            saveCart([]);
        }
    });

    checkoutBtn.addEventListener("click", () => {
        alert(
            "Your cart is ready! " +
            "Checkout and payment integration are " +
            "not available yet."
        );
    });

    renderCart();
});
