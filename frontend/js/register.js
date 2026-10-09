
document.addEventListener("DOMContentLoaded", () => {

    window.togglePassword = function(fieldId, button) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.type = field.type === "password"
            ? "text" : "password";

        button.textContent =
            field.type === "password" ? "👁" : "🙈";
    };

    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const fullName =
            document.getElementById("fullName").value.trim();
        const userType =
            document.getElementById("userType").value;
        const email =
            document.getElementById("email").value.trim();
        const password =
            document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const terms =
            document.getElementById("terms").checked;

        if (!fullName || !email || !userType) {
            alert("Please complete all required fields.");
            return;
        }

        if (!["student", "vendor"].includes(userType)) {
            alert("Please select Student or Vendor.");
            return;
        }

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!terms) {
            alert("Please accept the terms and conditions.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName,
                        userType,
                        email,
                        password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Registration failed"
                );
            }

            alert("Account created successfully!");
            window.location.href = "login.html";

        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message);
        }
    });
});
