async function loadMessages() {

    try {

        const response = await fetch("/api/messages");
        const data = await response.json();

        if (!data.success) {
            console.error("Failed to load messages");
            return;
        }

        const messageList = document.getElementById("messageList");
        const messageDetails = document.getElementById("messageDetails");

        messageList.innerHTML = "";

        data.messages.forEach(message => {

            const card = document.createElement("div");
            card.className = "message-card";

            card.innerHTML = `
                <div class="message-avatar">
                    ${message.name.charAt(0).toUpperCase()}
                </div>

                <div class="message-info">

                    <div class="message-top">
                        <h3>${message.name}</h3>
                        <span>${new Date(message.created_at).toLocaleString()}</span>
                    </div>

                    <strong>${message.email}</strong>

                    <p>${message.message.substring(0, 60)}...</p>

                </div>
            `;

            card.addEventListener("click", () => {

                // Only switch views on mobile/tablet
                if (window.innerWidth <= 900) {
                    messageList.classList.add("hide");
                    messageDetails.classList.add("active");
                }

                messageDetails.innerHTML = `
                    <div class="message-view">

                        <button class="back-btn" id="backButton">
                            ← Back
                        </button>

                        <h2>${message.name}</h2>

                        <p><strong>Email:</strong> ${message.email}</p>

                        <p><strong>Phone:</strong> ${message.phone}</p>

                        <p><strong>Date:</strong> ${new Date(message.created_at).toLocaleString()}</p>

                        <hr>

                        <p class="message-text">
                            ${message.message}
                        </p>

                        <button id="deleteMessage" class="delete-btn">
                            Delete Message
                        </button>

                    </div>
                `;

                // Back button
                const backButton = document.getElementById("backButton");

                backButton.addEventListener("click", () => {

                    if (window.innerWidth <= 900) {

                        messageDetails.classList.remove("active");
                        messageList.classList.remove("hide");

                    }

                });

                // Delete button
                const deleteButton = document.getElementById("deleteMessage");

                deleteButton.addEventListener("click", async () => {

                    const confirmed = confirm("Are you sure you want to delete this message?");

                    if (!confirmed) return;

                    try {

                        const response = await fetch(`/api/messages/${message.id}`, {
                            method: "DELETE"
                        });

                        const result = await response.json();

                        if (result.success) {

                            // Restore mobile layout only on small screens
                            if (window.innerWidth <= 900) {

                                messageDetails.classList.remove("active");
                                messageList.classList.remove("hide");

                            }

                            messageDetails.innerHTML = `
                                <div class="empty-message">

                                    <i class="fa-regular fa-envelope-open"></i>

                                    <h3>Message Deleted</h3>

                                    <p>Select another message.</p>

                                </div>
                            `;

                            loadMessages();

                        } else {

                            alert(result.message);

                        }

                    } catch (error) {

                        console.error("Delete Error:", error);

                    }

                });

            });

            messageList.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading messages:", error);

    }

}




loadMessages();
