const form = document.getElementById("createAccountForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    try {

        const response = await fetch("/api/admin/signup", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                fullName,
                email,
                username,
                password
            })

        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {

            form.reset();

            window.location.href = "/admin/login";

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});