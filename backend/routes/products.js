const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../database/database");


// ==================================
// IMAGE UPLOAD CONFIGURATION
// ==================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            path.join(__dirname, "../../admin/img")
        );

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);

    }

});

const upload = multer({ storage });


// ==================================
// DASHBOARD STATISTICS
// ==================================

router.get("/stats/dashboard", (req, res) => {

    db.all(
        "SELECT * FROM products ORDER BY id DESC",
        [],
        (err, products) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            const totalProducts = products.length;

            const totalCategories = new Set(
                products.map(product => product.category)
            ).size;

            const latestProduct =
                products.length > 0
                    ? products[0].name
                    : "No Products";

            res.json({
                totalProducts,
                activeProducts: totalProducts,
                totalCategories,
                latestProduct
            });

        }
    );

});


// ==================================
// RECENT PRODUCTS
// ==================================

router.get("/recent/list", (req, res) => {

    db.all(
        "SELECT * FROM products ORDER BY id DESC LIMIT 3",
        [],
        (err, products) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(products);

        }
    );

});


// ==================================
// GET ALL PRODUCTS
// ==================================

router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM products ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);

        }
    );

});


// ==================================
// ADD PRODUCT
// ==================================

router.post("/", upload.single("image"), (req, res) => {

    const {
        name,
        category,
        price,
        description
    } = req.body;

    if (!name || !category || !price || !description) {
        return res.status(400).json({
            error: "All fields are required."
        });
    }

    if (!req.file) {
        return res.status(400).json({
            error: "Product image is required."
        });
    }

    const image = req.file.filename;

    const sql = `
        INSERT INTO products
        (name, category, price, description, image)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [name, category, price, description, image],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Product added successfully",
                productId: this.lastID
            });

        }
    );

});


// ==================================
// GET SINGLE PRODUCT
// ==================================

router.get("/:id", (req, res) => {

    const id = req.params.id;

    db.get(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, product) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!product) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            res.json(product);

        }
    );

});


// ==================================
// UPDATE PRODUCT
// ==================================

router.put("/:id", upload.single("image"), (req, res) => {

    const id = req.params.id;

    const {
        name,
        category,
        price,
        description
    } = req.body;

    db.get(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, product) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!product) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            let image = product.image;

            // New image uploaded
            if (req.file) {

                const oldImage = path.join(
                    __dirname,
                    "../../admin/img",
                    product.image
                );

                if (fs.existsSync(oldImage)) {
                    fs.unlinkSync(oldImage);
                }

                image = req.file.filename;

            }

            const sql = `
                UPDATE products
                SET
                    name = ?,
                    category = ?,
                    price = ?,
                    description = ?,
                    image = ?
                WHERE id = ?
            `;

            db.run(
                sql,
                [name, category, price, description, image, id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Product updated successfully"
                    });

                }
            );

        }
    );

});


// ==================================
// DELETE PRODUCT
// ==================================

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    db.get(
        "SELECT * FROM products WHERE id = ?",
        [id],
        (err, product) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!product) {
                return res.status(404).json({
                    error: "Product not found"
                });
            }

            const imagePath = path.join(
                __dirname,
                "../../admin/img",
                product.image
            );

            db.run(
                "DELETE FROM products WHERE id = ?",
                [id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }

                    res.json({
                        message: "Product deleted successfully"
                    });

                }
            );

        }
    );

});

module.exports = router;