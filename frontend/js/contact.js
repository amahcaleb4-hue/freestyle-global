const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    try {

        const response = await fetch("/api/messages", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                phone,
                email,
                message
            })

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        alert(result.message);

        contactForm.reset();

    } catch (error) {

        alert(error.message);

        console.error(error);

    }

});