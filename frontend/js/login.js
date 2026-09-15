// =========================
// PASSWORD VISIBILITY
// =========================

const passwordToggle =
    document.getElementById("passwordToggle");

const password =
    document.getElementById("password");


passwordToggle.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        passwordToggle.textContent = "🙈";

        passwordToggle.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        password.type = "password";

        passwordToggle.textContent = "👁";

        passwordToggle.setAttribute(
            "aria-label",
            "Show password"
        );
    }

});


// =========================
// LOGIN FORM
// =========================

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener("submit", function (event) {

    // Prevent the page from refreshing
    event.preventDefault();


    // Get the values entered by the user
    const email =
        document.getElementById("email").value.trim();

    const passwordValue =
        document.getElementById("password").value;


    // =========================
    // VALIDATION
    // =========================

    if (!email) {

        alert("Please enter your email address.");

        return;
    }


    if (!passwordValue) {

        alert("Please enter your password.");

        return;
    }


    // =========================
    // TEMPORARY LOGIN
    // =========================

    /*
        This is temporary.

        Later, we will send the email
        and password to the Java backend
        to verify the user's account.
    */

    alert("Login successful!");


    // Temporary navigation
    window.location.href = "home.html";

});


// =========================
// GOOGLE LOGIN
// =========================

const googleButton =
    document.getElementById("googleButton");


googleButton.addEventListener("click", function () {

    alert(
        "Google login will be connected later."
    );

});


// =========================
// APPLE LOGIN
// =========================

const appleButton =
    document.getElementById("appleButton");


appleButton.addEventListener("click", function () {

    alert(
        "Apple login will be connected later."
    );

});