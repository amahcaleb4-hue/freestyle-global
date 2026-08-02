const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const login = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {

        const response = await fetch("/api/admin/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                login,
                password
            })

        });

        const result = await response.json();

        alert(result.message);

        if (result.success) {

            window.location.href = "/admin";

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});