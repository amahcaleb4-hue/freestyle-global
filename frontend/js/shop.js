const productsGrid = document.getElementById("productsGrid");
const sortFilter = document.getElementById("sortProducts");
const categoryButtons = document.querySelectorAll(".category-btn");

let allProducts = [];
let currentCategory = "all";

// Load Products
async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        
        if (!response.ok) {
            throw new Error("Failed to load products.");
        }

        allProducts = await response.json();

        filterProducts();

    } catch (error) {
        console.error("Error loading products:", error);

        productsGrid.innerHTML = `
            <p style="text-align:center; color:red;">
                Unable to load products.
            </p>
        `;
    }
}

// Display Products
function displayProducts(products) {

    productsGrid.innerHTML = "";

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <p style="text-align:center;">
                No products found.
            </p>
        `;
        return;
    }

    products.forEach(product => {

        productsGrid.innerHTML += `
            <article class="product-card">

                <div class="product-image">
                     <img src="/img/${product.image}" alt="${product.name}">
                </div>

                <div class="product-details">

                    <p class="product-category">
                        ${product.category.toUpperCase()}
                    </p>

                    <h3>${product.name}</h3>

                    <div class="product-bottom">

                        <strong>
                            ₦${Number(product.price).toLocaleString()}
                        </strong>

                        <a href="https://wa.me/2347067253363?text=${encodeURIComponent(`Hello, I want to order ${product.name}`)}">

                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round">

                                <circle cx="8" cy="21" r="1"/>
                                <circle cx="19" cy="21" r="1"/>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>

                            </svg>

                        </a>

                    </div>

                </div>

            </article>
        `;
    });

}

// Filter + Sort
function filterProducts() {

    let products = [...allProducts];

    // Category Filter
    if (currentCategory !== "all") {
        products = products.filter(product =>
            product.category === currentCategory
        );
    }

    // Sort
    if (sortFilter.value === "low") {
        products.sort((a, b) => a.price - b.price);
    }

    if (sortFilter.value === "high") {
        products.sort((a, b) => b.price - a.price);
    }

    displayProducts(products);
}

// Category Buttons
categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentCategory = button.dataset.category;

        filterProducts();

    });

});

// Sort Dropdown
sortFilter.addEventListener("change", filterProducts);

// Load Products
loadProducts();