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

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect("/dashboard");
    } else {
        res.send("Forkert brugernavn eller adgangskode.");
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
