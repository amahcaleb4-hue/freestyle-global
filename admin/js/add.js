const productForm = document.getElementById("productForm");

const productId =
    new URLSearchParams(window.location.search).get("id");

const submitButton =
    productForm.querySelector("button[type='submit']");


// =========================
// LOAD PRODUCT IF EDITING
// =========================

if (productId) {

    submitButton.innerHTML =
        `<i class="fa-solid fa-check"></i> Update Product`;

    loadProduct();

}


async function loadProduct() {

    const response =
        await fetch(`/api/products/${productId}`);

    const product =
        await response.json();

    document.getElementById("productName").value =
        product.name;

    document.getElementById("category").value =
        product.category;

    document.getElementById("price").value =
        product.price;

    document.getElementById("description").value =
        product.description;

}


// =========================
// SUBMIT FORM
// =========================

productForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData();

    formData.append(
        "name",
        document.getElementById("productName").value
    );

    formData.append(
        "category",
        document.getElementById("category").value
    );

    formData.append(
        "price",
        document.getElementById("price").value
    );

    formData.append(
        "description",
        document.getElementById("description").value
    );

    const image =
        document.getElementById("productImage").files[0];

    if (image) {

        formData.append("image", image);

    }


    let url = "/api/products";
    let method = "POST";

    if (productId) {

        url = `/api/products/${productId}`;

        method = "PUT";

    }


    const response = await fetch(url, {

        method,

        body: formData

    });

    const result = await response.json();

    alert(result.message);

    window.location.href =
        "/admin/products";

});