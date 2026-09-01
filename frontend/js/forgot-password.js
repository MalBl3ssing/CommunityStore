// =========================
// FORGOT PASSWORD FORM
// =========================

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");


forgotPasswordForm.addEventListener(
    "submit",
    function (event) {

        // Prevent page refresh
        event.preventDefault();


        // Get email
        const email =
            document.getElementById("email")
                .value
                .trim();


        // =========================
        // VALIDATION
        // =========================

        if (!email) {

            alert(
                "Please enter your email address."
            );

            return;
        }


        // =========================
        // TEMPORARY MESSAGE
        // =========================

        /*
            This is temporary.

            Later, the email will be sent
            to the Java backend, which will
            check the database and handle
            the password reset process.
        */

        alert(
            "If an account exists for this email, " +
            "a password reset link will be sent."
        );


        // Return to login
        window.location.href = "login.html";

    }
);