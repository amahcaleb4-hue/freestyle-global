// ==========================
// LOAD ADMIN PROFILE
// ==========================

async function loadProfile() {

    try {

        const response = await fetch("/api/admin/profile");
        const data = await response.json();

        if (!data.success) {

            alert(data.message);
            return;

        }

        // Settings Page Information

        document.getElementById("displayFullname").textContent =
            data.admin.fullname;

        document.getElementById("displayUsername").textContent =
            data.admin.username;

        document.getElementById("displayEmail").textContent =
            data.admin.email;

        // Update Modal

        document.getElementById("editFullname").value =
            data.admin.fullname;

        document.getElementById("editUsername").value =
            data.admin.username;

        document.getElementById("editEmail").value =
            data.admin.email;

    }

    catch (err) {

        console.error(err);

    }

}

// ==========================
// UPDATE PROFILE MODAL
// ==========================

const modal = document.getElementById("profileModal");
const updateBtn = document.getElementById("updateProfileBtn");
const closeModal = document.getElementById("closeModal");

updateBtn.addEventListener("click", () => {

    modal.classList.add("show");

});

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.remove("show");

    }

});

// ==========================
// UPDATE PROFILE
// ==========================

const updateForm = document.getElementById("updateProfileForm");

updateForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fullname = document.getElementById("editFullname").value.trim();
    const username = document.getElementById("editUsername").value.trim();
    const email = document.getElementById("editEmail").value.trim();

    try {

        const response = await fetch("/api/admin/profile", {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                fullname,
                username,
                email

            })

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert(data.message);

        modal.classList.remove("show");

        await loadProfile();

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

});



// ==========================
// PASSWORD MODAL
// ==========================

const passwordModal =
    document.getElementById("passwordModal");

const changePasswordBtn =
    document.getElementById("changePasswordBtn");

const closePasswordModal =
    document.getElementById("closePasswordModal");

changePasswordBtn.addEventListener("click", () => {

    passwordModal.classList.add("show");

});

closePasswordModal.addEventListener("click", () => {

    passwordModal.classList.remove("show");

});

window.addEventListener("click", (e) => {

    if (e.target === passwordModal) {

        passwordModal.classList.remove("show");

    }

});



// ==========================
// CHANGE PASSWORD
// ==========================

const passwordForm = document.getElementById("changePasswordForm");

passwordForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    try {

        const response = await fetch(

            "/api/admin/change-password",

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    currentPassword,
                    newPassword,
                    confirmPassword

                })

            }

        );

        const data = await response.json();

        alert(data.message);

        if (data.success) {

            passwordModal.classList.remove("show");

            passwordForm.reset();

        }

    }

    catch (err) {

        console.error(err);

    }

});


// ==========================
// START
// ==========================

loadProfile();