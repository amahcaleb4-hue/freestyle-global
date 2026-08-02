const express = require("express");
const session = require("express-session");
const path = require("path");

// Authentication Middleware
const isAuthenticated = require("./middleware/auth");

// Database
require("./database/database");

// Routes
const productsRoutes = require("./routes/products");
const messagesRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = 3000;

// ==================================
// MIDDLEWARE
// ==================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({

    secret: "freestyleglobalsecretkey",

    resave: false,

    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 Day
    }

}));

// ==================================
// API ROUTES
// ==================================

app.use("/api/products", productsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/admin", adminRoutes);

// ==================================
// FRONTEND
// ==================================

const frontendPath = path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "pages", "index.html"));
});

app.get("/shop", (req, res) => {
    res.sendFile(path.join(frontendPath, "pages", "shop.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(frontendPath, "pages", "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(frontendPath, "pages", "contact.html"));
});

// ==================================
// ADMIN PANEL
// ==================================

const adminPath = path.join(__dirname, "../admin");

app.use("/admin", express.static(adminPath));
app.use("/img", express.static(path.join(adminPath, "img")));

// Public Pages

app.get("/admin/login", (req, res) => {
    res.sendFile(path.join(adminPath, "pages", "login.html"));
});

app.get("/admin/signup", (req, res) => {
    res.sendFile(path.join(adminPath, "pages", "signup.html"));
});

// Protected Pages

app.get("/admin", isAuthenticated, (req, res) => {
    res.sendFile(path.join(adminPath, "pages", "dashbord.html"));
});

app.get("/admin/add", isAuthenticated, (req, res) => {
    res.sendFile(path.join(adminPath, "pages", "add.html"));
});

app.get("/admin/products", isAuthenticated, (req, res) => {
    res.sendFile(path.join(adminPath, "pages", "products.html"));
});

app.get("/admin/messages", isAuthenticated, (req, res) => {
    res.sendFile(path.join(adminPath, "pages", "message.html"));
});

app.get("/admin/settings", isAuthenticated, (req, res) => {
    res.sendFile(path.join(adminPath, "pages", "settings.html"));
});

// ==================================
// TEST ROUTE
// ==================================

app.get("/test", (req, res) => {
    res.send("Server is working!");
});

// ==================================
// 404 HANDLER
// ==================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route not found"

    });

});

// ==================================
// START SERVER
// ==================================

app.listen(PORT, () => {

    console.log(`🚀 Server running at http://localhost:${PORT}`);

});