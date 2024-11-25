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
router.post("/create-user", userController.postCreateUser);

// Log ud
router.get("/logout", userController.logout);

// Admin-dashboard (kun for admins)
router.get("/dashboardadmin", checkRole("admin"), (req, res) => {
    res.render("dashboardadmin", { username: req.session.username });
});

//Route to edit an existing user
router.get('/user/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.render('edit', {user});
    } catch (err){
        console.error(err);
        res.status(500).send("Error while editing user");
    }
})

router.get("/deleteuser", userController.deleteUser);

router.post('/user/:id/update', userController.updateUser);
router.post('/user/:id/delete', userController.deleteUser);

module.exports = router;