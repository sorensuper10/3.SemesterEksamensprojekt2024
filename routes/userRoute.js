// routes/userRoute.js
const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

// Login-side og handling
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", userController.login);

// Registreringsside og handling
router.get("/register", userController.register);
router.post("/register", userController.postCreateUser);

// Log ud
router.get("/logout", userController.logout);

// GET - Vis formularen til at oprette en bruger
router.get("/create-user", userController.getCreateUser);

// POST - Håndter oprettelse af bruger
router.post("/create-user", userController.postCreateUser);



module.exports = router;
