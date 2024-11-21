const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// Vis opret bruger formular
exports.getCreateUser = (req, res) => {
    res.render("create-user");
};

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
};exports.postCreateUser = async (req, res) => {
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
            if (['user', 'admin'].includes(user.role)) {
                req.session.userId = user._id;
                req.session.username = user.username;
                req.session.role = user.role;

                if (user.role === 'user') {
                    res.redirect("/dashboard");
                } else if (user.role === 'admin') {
                    res.redirect("/dashboardadmin");
                }
            } else {
                res.status(403).send("Ugyldig brugerrolle.");
            }
        } else {
            res.status(401).send("Forkert brugernavn eller adgangskode.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Noget gik galt. Prøv igen senere.");
    }
};


// Registrering funktion
exports.register = (req, res) => {
    res.render("register");
};

// Log ud funktion
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};