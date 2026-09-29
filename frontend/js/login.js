// =========================
// WAIT FOR PAGE TO LOAD
// =========================

document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // SUPABASE
    // =========================

    const supabaseUrl =
        "https://olnqufovakusfjlaablt.supabase.co";

    const supabaseKey =
        "sb_publishable_B-iTGT_tnwSpMSEQR1h-2Q_lAqhLkXA";

    const supabase =
        window.supabase.createClient(
            supabaseUrl,
            supabaseKey
        );


    // =========================
    // PASSWORD VISIBILITY
    // =========================

    const passwordToggle =
        document.getElementById("passwordToggle");

    const password =
        document.getElementById("password");


    if (passwordToggle && password) {

        passwordToggle.addEventListener(
            "click",
            function () {

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

            }
        );

    }


    // =========================
    // LOGIN FORM
    // =========================

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async function (event) {

            // Prevent the page from refreshing
            event.preventDefault();


            // =========================
            // GET FORM VALUES
            // =========================

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const passwordValue =
                document
                    .getElementById("password")
                    .value;


            // =========================
            // VALIDATION
            // =========================

            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            if (!passwordValue) {

                alert(
                    "Please enter your password."
                );

                return;
            }


            // =========================
            // SUPABASE LOGIN
            // =========================

            const {
                data,
                error
            } = await supabase.auth.signInWithPassword({

                email: email,

                password: passwordValue
            });


            // =========================
            // LOGIN ERROR
            // =========================

            if (error) {

                alert(
                    "User not registered or incorrect password. " +
                    "Please check your email and password and try again."
                );

                return;
            }


            // =========================
            // LOGIN SUCCESS
            // =========================

            alert(
                "Login successful!"
            );


            // =========================
            // GO TO HOME
            // =========================

            window.location.href =
                "home.html";

        }
    );


    // =========================
    // GOOGLE LOGIN
    // =========================

    const googleButton =
        document.getElementById("googleButton");


    if (googleButton) {

        googleButton.addEventListener(
            "click",
            async function () {

                const {
                    error
                } = await supabase.auth.signInWithOAuth({

                    provider: "google",

                    options: {
                        redirectTo:
                            window.location.origin +
                            "/home.html"
                    }

                });


                if (error) {

                    alert(
                        "Google login failed: " +
                        error.message
                    );

                }

            }
        );

    }


    // =========================
    // APPLE LOGIN
    // =========================

    const appleButton =
        document.getElementById("appleButton");


    if (appleButton) {

        appleButton.addEventListener(
            "click",
            async function () {

                const {
                    error
                } = await supabase.auth.signInWithOAuth({

                    provider: "apple",

                    options: {
                        redirectTo:
                            window.location.origin +
                            "/home.html"
                    }

                });


                if (error) {

                    alert(
                        "Apple login failed: " +
                        error.message
                    );

                }

            }
        );

    }

});