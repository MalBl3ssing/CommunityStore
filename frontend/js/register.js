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


    // Check user type
    if (!userType) {

        alert("Please select your user type.");

        return;
    }


    // Check passwords
    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }


    // Check terms
    if (!terms) {

        alert("Please agree to the Terms & Conditions.");

        return;
    }


    // Temporary success message
    alert(
        "Welcome to Community Store, " +
        fullName +
        "!"
    );


    // For now, send the user to login
    window.location.href = "login.html";
});