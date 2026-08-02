const productsGrid = document.getElementById("productsGrid");
const productCount = document.getElementById("productCount");
const paginationText = document.getElementById("paginationText");
const paginationButtons = document.getElementById("paginationButtons");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

let allProducts = [];
let filteredProducts = [];

const productsPerPage = 8;
let currentPage = 1;

// ==============================
// LOAD PRODUCTS
// ==============================

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        allProducts = await response.json();

        filteredProducts = [...allProducts];

        displayProducts();

    } catch (error) {

        console.error("Error loading products:", error);

    }

}

// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayProducts() {

    productsGrid.innerHTML = "";

    const start = (currentPage - 1) * productsPerPage;

    const end = start + productsPerPage;

    const pageProducts =
        filteredProducts.slice(start, end);

    productCount.textContent =
        `${filteredProducts.length} Products`;

    if (filteredProducts.length === 0) {

        paginationText.textContent =
            "Showing 0 products";

    } else {

        paginationText.textContent =
            `Showing ${start + 1}-${Math.min(end, filteredProducts.length)} of ${filteredProducts.length} products`;

    }

    pageProducts.forEach((product) => {

        const productCard =
            document.createElement("div");

        productCard.className = "product-card";

        productCard.innerHTML = `

            <div class="product-card-image">

                <img
                    src="/admin/img/${product.image}"
                    alt="${product.name}"
                >

            </div>

            <div class="product-card-content">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-bottom">

                    <strong>
                        ₦${Number(product.price).toLocaleString()}
                    </strong>

                    <div class="product-actions">

                        <button class="edit-btn">

                            <i class="fa-solid fa-pen"></i>

                        </button>

                        <button class="delete-btn">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>

            </div>

        `;

        productsGrid.appendChild(productCard);

        // EDIT

        productCard
            .querySelector(".edit-btn")
            .addEventListener("click", () => {

                window.location.href =
                    `/admin/add?id=${product.id}`;

            });

        // DELETE

        productCard
            .querySelector(".delete-btn")
            .addEventListener("click", async () => {

                if (!confirm(`Delete "${product.name}" ?`))
                    return;

                try {

                    const response =
                        await fetch(`/api/products/${product.id}`, {

                            method: "DELETE"

                        });

                    const result =
                        await response.json();

                    alert(result.message);

                    loadProducts();

                } catch (error) {

                    console.error(error);

                    alert("Failed to delete product.");

                }

            });

    });

    renderPagination();

}

// ==============================
// PAGINATION
// ==============================

function renderPagination() {

    paginationButtons.innerHTML = "";

    const totalPages =
        Math.ceil(filteredProducts.length / productsPerPage);

    const prev =
        document.createElement("button");

    prev.innerHTML = "&lsaquo;";

    prev.disabled = currentPage === 1;

    prev.onclick = () => {

        currentPage--;

        displayProducts();

    };

    paginationButtons.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {

        const btn =
            document.createElement("button");

        btn.textContent = i;

        if (i === currentPage) {

            btn.classList.add("active");

        }

        btn.onclick = () => {

            currentPage = i;

            displayProducts();

        };

        paginationButtons.appendChild(btn);

    }

    const next =
        document.createElement("button");

    next.innerHTML = "&rsaquo;";

    next.disabled =
        currentPage === totalPages || totalPages === 0;

    next.onclick = () => {

        currentPage++;

        displayProducts();

    };

    paginationButtons.appendChild(next);

}

// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", () => {

    const keyword =
        searchInput.value.trim().toLowerCase();

    filteredProducts = allProducts.filter(product =>

        product.name.toLowerCase().includes(keyword) ||

        product.category.toLowerCase().includes(keyword) ||

        product.description.toLowerCase().includes(keyword)

    );

    currentPage = 1;

    displayProducts();

});


// ==============================
// CATEGORY FILTER
// ==============================

categoryFilter.addEventListener("change", () => {

    const category =
        categoryFilter.value.toLowerCase();

    if (category === "") {

        filteredProducts = [...allProducts];

    } else {

        filteredProducts = allProducts.filter(product =>

            product.category.toLowerCase() === category

        );

    }

    currentPage = 1;

    displayProducts();

});


// ==============================
// START
// ==============================

loadProducts();