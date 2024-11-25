const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/userModel");

const router = express.Router();
const { checkRole } = userController;

// Login-side og handling
router.get("/login", (req, res) => {
    res.render("login");
});

// Login handling
router.post("/login", userController.login);

// Registreringsside og handling
router.get("/create-user", (req, res) => {
    res.render("create-user");
});
router.post("/create-user", userController.postCreateUser);

// Log ud
router.get("/logout", userController.logout);

// Admin-dashboard (kun for admins)
router.get("/dashboardadmin", checkRole("admin"), (req, res) => {
    res.render("dashboardadmin", { username: req.session.username });
});

// Rute til at vise formular for at redigere en bruger
router.get('/user/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find brugeren ved ID
        if (!user) {
            return res.status(404).send('Brugeren blev ikke fundet');
        }
        // Sender brugerdata til EJS
        res.render('edit-user', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl ved hentning af bruger til opdatering");
    }
});

// Rute for at opdatere brugerinfo (POST)
router.post('/user/:id/edit', userController.updateUser);

// Rute for at slette bruger (POST)
router.post('/user/:id/delete', userController.deleteUser);

// Route for at hente alle brugere (kun for admins)
router.get("/all-users", checkRole("admin"), async (req, res) => {
    try {
        const users = await User.find();
        res.render("all-users", { users });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl under hentning af alle brugere");
    }
});

// Rute for at vise en enkel bruger (til admins eller selvvisning)
router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Brugeren blev ikke fundet");
        }
        res.render("user-detail", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl ved hentning af bruger");
    }
});

module.exports = router;
