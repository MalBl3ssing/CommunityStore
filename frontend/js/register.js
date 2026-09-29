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

    window.togglePassword = function (fieldId, button) {

        const field =
            document.getElementById(fieldId);

        if (field.type === "password") {

            field.type = "text";

            button.textContent = "🙈";

        } else {

            field.type = "password";

            button.textContent = "👁";
        }
    };


    // =========================
    // REGISTRATION FORM
    // =========================

    const registerForm =
        document.getElementById("registerForm");


    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        async function (event) {

            // Stop normal form refresh
            event.preventDefault();


            // =========================
            // GET FORM VALUES
            // =========================

            const fullName =
                document
                    .getElementById("fullName")
                    .value
                    .trim();

            const userType =
                document
                    .getElementById("userType")
                    .value;

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;

            const terms =
                document
                    .getElementById("terms")
                    .checked;


            // =========================
            // VALIDATION
            // =========================

            if (!fullName) {

                alert(
                    "Please enter your full name."
                );

                return;
            }


            if (!userType) {

                alert(
                    "Please select your user type."
                );

                return;
            }


            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            if (!password) {

                alert(
                    "Please create a password."
                );

                return;
            }


            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            if (!terms) {

                alert(
                    "Please agree to the Terms & Conditions."
                );

                return;
            }


            // =========================
            // CREATE USER
            // =========================

            const {
                data,
                error
            } = await supabase.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {

                        full_name:
                            fullName,

                        user_type:
                            userType
                    }
                }
            });


            // =========================
            // DEBUG INFORMATION
            // =========================

            console.log(
                "SIGN UP DATA:",
                data
            );

            console.log(
                "SIGN UP ERROR:",
                error
            );


            // =========================
            // HANDLE SIGN UP ERROR
            // =========================

            if (error) {

                const errorMessage =
                    error.message.toLowerCase();


                if (
                    errorMessage.includes("already registered") ||
                    errorMessage.includes("already exists") ||
                    errorMessage.includes("user already registered")
                ) {

                    alert(
                        "This email address is already in use. Please use a different email address."
                    );

                } else {

                    alert(
                        "Registration failed: " +
                        error.message
                    );
                }

                return;
            }


            // =========================
            // CHECK USER
            // =========================

            if (!data.user) {

                alert(
                    "Account was created, but the user profile could not be created."
                );

                return;
            }


            // =========================
            // CREATE PROFILE
            // =========================

            const {
                error: profileError
            } = await supabase
                .from("profiles")
                .insert({

                    id:
                        data.user.id,

                    full_name:
                        fullName,

                    email:
                        email,

                    user_type:
                        userType
                });


            // =========================
            // HANDLE PROFILE ERROR
            // =========================

            if (profileError) {

                console.error(
                    "PROFILE ERROR:",
                    profileError
                );

                alert(
                    "Account created, but there was a problem creating your profile: " +
                    profileError.message
                );

                return;
            }


            // =========================
            // SUCCESS
            // =========================

            alert(
                "Account created successfully!"
            );


            // =========================
            // GO TO LOGIN
            // =========================

            window.location.href =
                "login.html";

        }
    );

});