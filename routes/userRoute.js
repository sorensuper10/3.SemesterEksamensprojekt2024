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
router.get("/create-user", (req, res) => res.render("create-user"));
router.post("/register", userController.postCreateUser);

// Log ud
router.get("/logout", userController.logout);

// Admin-dashboard (kun for admins)
router.get("/dashboardadmin", checkRole("admin"), (req, res) => {
    res.render("dashboardadmin", { username: req.session.username });
});



module.exports = router;
