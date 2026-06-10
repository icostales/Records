const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");
const forgotPasswordButton = document.getElementById("forgotPassword");
const loginMessage = document.getElementById("loginMessage");
const submitButton = loginForm ? loginForm.querySelector('button[type="submit"]') : null;

function setPasswordToggleState(isHidden) {
    if (!togglePasswordButton) {
        return;
    }

    togglePasswordButton.innerHTML = isHidden
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3.2"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18"/><path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2"/><path d="M6.2 6.2C4 7.8 2.5 10 2 12c1.5 4.5 6 7 10 7 1.1 0 2.1-.2 3.1-.5"/><path d="M9.5 4.7A11.2 11.2 0 0 1 12 4c4 0 8.5 2.5 10 8-.5 1.4-1.2 2.7-2.2 3.9"/></svg>';

    togglePasswordButton.setAttribute(
        "aria-label",
        isHidden ? "Show password" : "Hide password"
    );
}

function setLoginMessage(message, type = "") {
    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;
    loginMessage.dataset.type = type;
}

function setLoading(isLoading) {
    if (!submitButton) {
        return;
    }

    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Logging in..." : "Login";
}

if (togglePasswordButton && passwordInput) {
    setPasswordToggleState(true);

    togglePasswordButton.addEventListener("click", () => {
        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";
        setPasswordToggleState(!isHidden);
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        setLoginMessage("");
        setLoading(true);

        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        const { error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setLoginMessage(error.message, "error");
            setLoading(false);
            return;
        }

        setLoginMessage("Login successful.", "success");
        window.location = "records.html";
    });
}

if (forgotPasswordButton) {
    forgotPasswordButton.addEventListener("click", async () => {
        const email = emailInput ? emailInput.value.trim() : "";

        if (!email) {
            setLoginMessage("Enter your email first, then tap Forgot password.", "error");
            return;
        }

        setLoading(true);
        setLoginMessage("");

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + window.location.pathname
        });

        setLoading(false);

        if (error) {
            setLoginMessage(error.message, "error");
            return;
        }

        setLoginMessage("Password reset link sent to your email.", "success");
    });
}
