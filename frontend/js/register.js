// =========================
// PASSWORD VISIBILITY
// =========================

function togglePassword(fieldId, button) {
    const field = document.getElementById(fieldId);

    if (field.type === "password") {
        field.type = "text";
        button.textContent = "🙈";
    } else {
        field.type = "password";
        button.textContent = "👁";
    }
}


// =========================
// REGISTRATION FORM
// =========================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (event) {
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


    // =========================
    // VALIDATION
    // =========================

    if (!fullName) {
        alert("Please enter your full name.");
        return;
    }

    if (!userType) {
        alert("Please select your user type.");
        return;
    }

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    if (!password) {
        alert("Please create a password.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (!terms) {
        alert("Please agree to the Terms & Conditions.");
        return;
    }


    // =========================
    // CREATE USER
    // =========================

    const user = {
        fullName: fullName,
        userType: userType,
        email: email,
        password: password
    };


    // =========================
    // SAVE USER
    // =========================

    localStorage.setItem(
        "communityStoreUser",
        JSON.stringify(user)
    );


    // =========================
    // SUCCESS
    // =========================

    alert(
        "Welcome to Community Store, " +
        fullName +
        "!"
    );


    // =========================
    // GO TO LOGIN
    // =========================

    window.location.href = "login.html";
});