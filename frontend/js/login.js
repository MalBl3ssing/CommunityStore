
document.addEventListener("DOMContentLoaded", () => {

    const passwordToggle =
        document.getElementById("passwordToggle");
    const password =
        document.getElementById("password");

    if (passwordToggle && password) {
        passwordToggle.addEventListener("click", () => {
            password.type = password.type === "password"
                ? "text" : "password";

            passwordToggle.textContent =
                password.type === "password" ? "👁" : "🙈";
        });
    }

    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();
        const passwordValue =
            document.getElementById("password").value;

        if (!email || !passwordValue) {
            alert("Enter your email and password.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password: passwordValue
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Login failed"
                );
            }

            alert("Login successful!");
            window.location.href = "home.html";

        } catch (error) {
            console.error("Login error:", error);
            alert(error.message);
        }
    });

    // Social login requires separate backend integration.
    ["googleButton", "appleButton"].forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener("click", event => {
                event.preventDefault();
                alert("Social login is not configured yet.");
            });
        }
    });
});
