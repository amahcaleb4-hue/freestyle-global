async function loadMessageCount() {

    try {

        const response = await fetch("/api/messages/count");
        const data = await response.json();

        if (!data.success) return;

        const counters = document.querySelectorAll(".messageCount");

        counters.forEach(counter => {
            counter.textContent = data.total;
        });

    } catch (error) {

        console.error(error);

    }

}

loadMessageCount();