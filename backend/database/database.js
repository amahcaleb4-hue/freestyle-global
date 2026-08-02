const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "custmatic.db");

const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {

        console.error(
            "Database connection failed:",
            err.message
        );

    } else {

        console.log(
            "Connected to SQLite database"
        );

    }

});


// ==================================
// CREATE PRODUCTS TABLE
// ==================================

db.run(`

    CREATE TABLE IF NOT EXISTS products (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        category TEXT NOT NULL,

        price REAL NOT NULL,

        description TEXT,

        image TEXT,

        created_at DATETIME
            DEFAULT CURRENT_TIMESTAMP

    )

`, (err) => {

    if (err) {

        console.error(
            "Error creating products table:",
            err.message
        );

    } else {

        console.log(
            "Products table is ready"
        );

    }

});

// ==================================
// MESSAGES TABLE
// ==================================

db.run(`
CREATE TABLE IF NOT EXISTS messages (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,

    phone TEXT NOT NULL,

    email TEXT NOT NULL,

    message TEXT NOT NULL,

    status TEXT DEFAULT 'Unread',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`, (err) => {

    if (err) {
        console.error("Error creating messages table:", err.message);
    } else {
        console.log("Messages table is ready");
    }

});


db.run(`
CREATE TABLE IF NOT EXISTS admins (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    fullname TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    username TEXT NOT NULL UNIQUE,

    password TEXT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`, (err) => {

    if (err) {

        console.error("Error creating admins table:", err.message);

    } else {

        console.log("Admins table is ready");

    }

});

module.exports = db;