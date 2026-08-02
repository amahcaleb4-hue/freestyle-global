const logoutButtons = document.querySelectorAll(".logoutBtn");

logoutButtons.forEach(button => {

    button.addEventListener("click", async (e) => {

        e.preventDefault();

        if (!confirm("Are you sure you want to logout?")) return;

        try {

            const response = await fetch("/api/admin/logout", {
                method: "POST"
            });

            const result = await response.json();

            if (result.success) {

                window.location.href = "/admin/login";

            } else {

                alert(result.message);

            }

        } catch (error) {

            console.error(error);
            alert("Logout failed.");

        }

    });

});