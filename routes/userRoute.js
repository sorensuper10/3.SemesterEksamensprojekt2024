const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();
const { checkRole } = userController;

// Login-side og handling
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", userController.login);

// Registreringsside og handling
router.get("/register", (req, res) => res.render("register"));
router.post("/register", userController.postCreateUser);

// Log ud
router.get("/logout", userController.logout);

// Admin-dashboard (kun for admins)
router.get("/dashboardadmin", checkRole("admin"), (req, res) => {
    res.render("dashboardadmin", { username: req.session.username });
});

// Bruger-dashboard (alle brugere)
router.get("/dashboard", (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    res.render("dashboard", { username: req.session.username });
});

module.exports = router;
