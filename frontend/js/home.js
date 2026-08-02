const featuredProducts = document.getElementById("featuredProducts");
const productGrid = document.querySelector(".product-grid");

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const products = await response.json();

        displayFeatured(products.slice(0, 3));

        displayProducts(products.slice().reverse().slice(0, 6));

    } catch (error) {

        console.error(error);

    }

}

// ================================
// Featured Section (4 Products)
// ================================

function displayFeatured(products) {

    featuredProducts.innerHTML = "";

    products.forEach(product => {

        featuredProducts.innerHTML += `

            <article class="product-card">

                <div class="product-image">

                    <img src="/img/${product.image}" alt="${product.name}">

                </div>

                <div class="product-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h3>${product.name}</h3>

                    <strong class="new-price">
                        ₦${Number(product.price).toLocaleString()}
                    </strong>

                    <a href="https://wa.me/2347067253363?text=${encodeURIComponent(`Hello, I want to order ${product.name}`)}">

                        <button class="view-btn">
                            Order Now
                        </button>

                    </a>

                </div>

            </article>

        `;

    });

}

// ================================
// Home Products (6 Products)
// ================================

function displayProducts(products) {

    productGrid.innerHTML = "";

    products.forEach(product => {

        productGrid.innerHTML += `

            <div class="product-card">

                <span class="badge">NEW</span>

                <img src="/img/${product.image}" alt="${product.name}">

                <div class="product-info">

                    <small class="product-category">${product.category}</small>

                    <h3>${product.name}</h3>

                    <div class="stars">
                        ★★★★★
                    </div>

                    <div class="price">

                        <span class="new-price">
                            ₦${Number(product.price).toLocaleString()}
                        </span>

                    </div>

                    <a href="https://wa.me/2347067253363?text=${encodeURIComponent(`Hello, I want to order ${product.name}`)}">

                        <button>
                            Order
                        </button>

                    </a>

                </div>

            </div>

        `;

    });

}

loadProducts();