const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Vis opret bruger formular
exports.getCreateUser = (req, res) => {
    res.render("create-user");
};

// Håndter oprettelse af bruger
exports.postCreateUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tjek om brugeren allerede findes
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("Brugernavn er allerede i brug.");
        }

        // Hash adgangskoden
        const passwordHash = await bcrypt.hash(password, 10);

        // Opret og gem brugeren i databasen
        const user = new User({
            username,
            passwordHash,
        });

        await user.save();
        res.send("Brugeren er oprettet succesfuldt!");
    } catch (error) {
        console.error("Fejl under oprettelse af bruger:", error);
        res.status(500).send("Der opstod en fejl. Prøv igen senere.");
    }
};

// Login funktion
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.role = user.role;

            if (user.role === "admin") {
                return res.redirect("/dashboardadmin");
            }
            return res.redirect("/dashboard");
        }

        res.status(401).send("Forkert brugernavn eller adgangskode.");
    } catch (error) {
        console.error("Fejl under login:", error);
        res.status(500).send("Noget gik galt. Prøv igen senere.");
    }
};

// Log ud funktion
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

// Middleware til rolle-check
exports.checkRole = (role) => {
    return (req, res, next) => {
        if (req.session.role && req.session.role === role) {
            return next();
        }
        res.status(403).send("Adgang nægtet: Du har ikke tilladelse.");
    };
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('dashboard', {users, userCount: users.length});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while getting all the users");
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, {
            username: req.body.username,
            password: req.body.password,
        });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while updating the user");
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while deleting user");
    }
};