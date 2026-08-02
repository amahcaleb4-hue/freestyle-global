const express = require("express");
const router = express.Router();

const db = require("../database/database");

console.log("Messages route loaded");

// ======================================
// SEND CONTACT MESSAGE
// ======================================

router.post("/", (req, res) => {

    const { name, phone, email, message } = req.body;

    // Check required fields
    if (!name || !phone || !email || !message) {

        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });

    }

    const sql = `
        INSERT INTO messages
        (name, phone, email, message)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [name, phone, email, message],
        function (err) {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save message."
                });

            }

            res.status(201).json({
                success: true,
                message: "Message sent successfully!"
            });

        }
    );

});



router.get("/", (req, res) => {

    const sql = `
        SELECT *
        FROM messages
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch messages."
            });
        }

        res.json({
            success: true,
            messages: rows
        });

    });

});




// ======================================
// DELETE MESSAGE
// ======================================

router.delete("/:id", (req, res) => {

    const { id } = req.params;

    db.run(
        "DELETE FROM messages WHERE id = ?",
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete message."
                });
            }

            res.json({
                success: true,
                message: "Message deleted successfully."
            });

        }
    );

});

// ======================================
// GET MESSAGE COUNT
// ======================================

router.get("/count", (req, res) => {

    const sql = `
        SELECT COUNT(*) AS total
        FROM messages
    `;

    db.get(sql, [], (err, row) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to count messages."
            });

        }

        res.json({
            success: true,
            total: row.total
        });

    });

});


module.exports = router;