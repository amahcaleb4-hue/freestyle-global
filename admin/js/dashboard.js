
const totalProducts =
    document.getElementById("totalProducts");

const activeProducts =
    document.getElementById("activeProducts");

const recentProducts =
    document.getElementById("recentProducts");

async function loadDashboard() {

    try {

        const response =
            await fetch("/api/products/stats/dashboard");

        const stats =
            await response.json();

        // Total Products
        totalProducts.textContent =
            stats.totalProducts;

        // Active Products
        activeProducts.textContent =
            stats.totalProducts;

    } catch (error) {

        console.error("Dashboard Error:", error);

    }

}



async function loadRecentProducts() {

    try {

        const response =
            await fetch("/api/products/recent/list");

        const products =
            await response.json();

        recentProducts.innerHTML = "";

        products.forEach(product => {

            recentProducts.innerHTML += `

                <div class="product">

                    <div class="product-image">

                        <img
                            src="/admin/img/${product.image}"
                            alt="${product.name}"
                        >

                    </div>

                    <div class="product-details">

                        <h3>${product.name}</h3>

                        <span>${product.category}</span>

                    </div>

                    <strong>
                        ₦${Number(product.price).toLocaleString()}
                    </strong>

                    <button
                        class="edit"
                        onclick="window.location='/admin/add?id=${product.id}'">

                        <i class="fa-solid fa-pen">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </i>

                    </button>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}



loadDashboard();
loadRecentProducts();