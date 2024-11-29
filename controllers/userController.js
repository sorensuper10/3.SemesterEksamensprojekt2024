const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Opret brugerformular (vis)
exports.getCreateUser = (req, res) => {
    res.render("create-user");
};

exports.getEditUser = (req, res) => {
    res.render("edit-user");
}

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
        const user = new User({ username, passwordHash });
        await user.save();

        res.render("login");
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

// Hent alle brugere (for dashboard)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render("dashboard", { users, userCount: users.length });
    } catch (error) {
        console.error("Fejl under hentning af brugere:", error);
        res.status(500).send("Noget gik galt. Prøv igen senere.");
    }
};

// Vis opret brugerformular
exports.getEditUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("Brugeren blev ikke fundet");
        }
        res.render("edit-user", { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl ved hentning af bruger til opdatering");
    }
};

// Opdater bruger
exports.updateUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const updates = { username };  // Vi opdaterer brugernavnet.

        // Hvis adgangskoden er angivet, hash den og opdater den
        if (password) {
            updates.passwordHash = await bcrypt.hash(password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

        if (!user) {
            return res.status(404).send("Brugeren blev ikke fundet");
        }

        res.redirect("/dashboard"); // Eller en anden passende rute
    } catch (error) {
        console.error("Fejl ved opdatering af bruger:", error);
        res.status(500).send("Noget gik galt. Prøv igen senere.");
    }
};


// Slet bruger (egen konto eller admin-sletning)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id || req.session.userId;

        if (!userId) {
            return res.status(400).send("Ingen bruger at slette.");
        }

        await User.findByIdAndDelete(userId);

        if (req.session.userId === userId) {
            // Sletning af egen konto
            req.session.destroy((err) => {
                if (err) {
                    console.error("Fejl ved sletning af session:", err);
                    return res.status(500).send("Noget gik galt. Prøv igen senere.");
                }
                res.redirect("/login"); // Efter login-sletning
            });
        } else {
            // Admin sletter en anden bruger
            res.redirect("/dashboardadmin");
        }
    } catch (error) {
        console.error("Fejl under sletning af bruger:", error);
        res.status(500).send("Noget gik galt. Prøv igen senere.");
    }
};

exports.viewAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render("allUsers", { users, userCount: users.length });
    } catch (error) {
        console.error("Fejl under hentning af brugere:", error);
        res.status(500).send("Noget gik galt. Prøv igen senere.");
    }
}