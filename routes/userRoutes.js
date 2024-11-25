const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/userModel");

const router = express.Router();
const { checkRole } = userController;

// Login-side og handling
router.get("/login", (req, res) => {
    res.render("login");
});
router.post("/login", userController.login);

// Registreringsside og handling
router.get("/create-user", (req, res) => res.render("create-user"));
router.post("/create-user", userController.postCreateUser);

// Log ud
router.get("/logout", userController.logout);

// Admin-dashboard (kun for admins)
router.get("/dashboardadmin", checkRole("admin"), (req, res) => {
    res.render("dashboardadmin", { username: req.session.username });
});

// Route for at vise siden til at redigere brugerinfo (GET)
router.get('/user/:id/edit', async (req, res) => {
    try {
        // Find bruger baseret på ID og send data til formularen
        const user = await User.findById(req.params.id);
        res.render('edit-user', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl under hentning af brugerdata til redigering");
    }
});

// Route for at opdatere brugerinfo (POST)
router.post('/user/:id/edit', userController.updateUser);

// Rute for at slette bruger (POST)
router.post('/user/:id/delete', userController.deleteUser);

// Route for at hente alle brugere (kan bruges til admins)
router.get("/all-users", checkRole("admin"), async (req, res) => {
    try {
        const users = await User.find();
        res.render("all-users", { users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl under hentning af alle brugere");
    }
});

module.exports = router;