const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const db = require("../database/database");

// ==================================
// CREATE FIRST ADMIN
// ==================================

router.post("/signup", async (req, res) => {

    const {
        fullName,
        email,
        username,
        password
    } = req.body;

    if (!fullName || !email || !username || !password) {

        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });

    }

    // Check if an admin already exists
    db.get("SELECT id FROM admins LIMIT 1", async (err, admin) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        if (admin) {

            return res.status(403).json({
                success: false,
                message: "An admin account already exists."
            });

        }

        try {

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run(
                `INSERT INTO admins (fullname, email, username, password)
                 VALUES (?, ?, ?, ?)`,
                [fullName, email, username, hashedPassword],
                function (err) {

                    if (err) {

                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });

                    }

                    res.status(201).json({
                        success: true,
                        message: "Admin account created successfully."
                    });

                }
            );

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message
            });

        }

    });

});


// ==================================
// LOGIN ADMIN
// ==================================

router.post("/login", (req, res) => {

    const { login, password } = req.body;

    if (!login || !password) {

        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });

    }

    const sql = `
        SELECT * FROM admins
        WHERE email = ? OR username = ?
    `;

    db.get(sql, [login, login], async (err, admin) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid email/username or password."
            });

        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {

            return res.status(401).json({
                success: false,
                message: "Invalid email/username or password."
            });

        }

        req.session.admin = {
            id: admin.id,
            fullname: admin.fullname,
            username: admin.username
        };

        res.json({
            success: true,
            message: "Login successful."
        });

    });

});

router.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Logout failed."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logged out successfully."
        });

    });

});

// ==================================
// GET ADMIN PROFILE
// ==================================

router.get("/profile", (req, res) => {

    if (!req.session.admin) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });

    }

    db.get(

        `
        SELECT
            fullname,
            username,
            email
        FROM admins
        WHERE id = ?
        `,

        [req.session.admin.id],

        (err, admin) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,

                admin

            });

        }

    );

});

// ==================================
// UPDATE ADMIN PROFILE
// ==================================

router.put("/profile", (req, res) => {

    if (!req.session.admin) {

        return res.status(401).json({
            success: false,
            message: "Please login first"
        });

    }

    const { fullname, username, email } = req.body;

    if (!fullname || !username || !email) {

        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });

    }

    db.run(

        `
        UPDATE admins
        SET
            fullname = ?,
            username = ?,
            email = ?
        WHERE id = ?
        `,

        [
            fullname,
            username,
            email,
            req.session.admin.id
        ],

        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,

                message: "Profile updated successfully."

            });

        }

    );

});

// ======================================
// CHANGE PASSWORD
// ======================================


router.put("/change-password", async (req, res) => {

    if (!req.session.admin) {

        return res.status(401).json({

            success: false,

            message: "Unauthorized"

        });

    }

    const {

        currentPassword,
        newPassword,
        confirmPassword

    } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {

        return res.json({

            success: false,

            message: "Please fill in all fields."

        });

    }

    if (newPassword !== confirmPassword) {

        return res.json({

            success: false,

            message: "Passwords do not match."

        });

    }

    db.get(

        "SELECT * FROM admins WHERE id = ?",

        [req.session.admin.id],

        async (err, admin) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }

            const match = await bcrypt.compare(

                currentPassword,

                admin.password

            );

            if (!match) {

                return res.json({

                    success: false,

                    message: "Current password is incorrect."

                });

            }

            const hashedPassword = await bcrypt.hash(

                newPassword,

                10

            );

            db.run(

                "UPDATE admins SET password = ? WHERE id = ?",

                [

                    hashedPassword,

                    req.session.admin.id

                ],

                function (err) {

                    if (err) {

                        return res.status(500).json({

                            success: false,

                            message: err.message

                        });

                    }

                    res.json({

                        success: true,

                        message: "Password changed successfully."

                    });

                }

            );

        }

    );

});
module.exports = router;