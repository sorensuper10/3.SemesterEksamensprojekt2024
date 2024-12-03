require("dotenv").config();  // Indlæs .env-filen

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const userRoute = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const User = require("./models/userModel");  // Antager du har en User-model
const Animal = require("./models/petModel");  // Antager du har en Animal-model
const path = require("path");

const port = process.env.PORT || 3000;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // For at håndtere JSON-anmodninger
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(session({
    secret: "hemmeligNøgle",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }
}));

// Mongoose connection
mongoose.connect(dbConnectionString)
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);  // Stop appen, hvis der er fejl
    });

// API Ruter for User
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Fejl ved hentning af brugere" });
    }
});

app.post("/api/users", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Alle felter skal udfyldes." });
    }

    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "Fejl ved oprettelse af bruger" });
    }
});

// API Ruter for Animal
app.get("/api/animals", async (req, res) => {
    try {
        const animals = await Animal.find();
        res.status(200).json(animals);
    } catch (err) {
        res.status(500).json({ error: "Fejl ved hentning af dyr" });
    }
});

app.post("/api/animals", async (req, res) => {
    const { name, species, age, favoriteFood } = req.body;
    if (!name || !species || !age || !favoriteFood) {
        return res.status(400).json({ error: "Alle felter skal udfyldes." });
    }

    try {
        const newAnimal = new Animal({ name, species, age, favoriteFood });
        await newAnimal.save();
        res.status(201).json(newAnimal);
    } catch (err) {
        res.status(500).json({ error: "Fejl ved oprettelse af dyr" });
    }
});

// Routes for user-related pages
app.use(userRoute);
app.use(petRoutes);

// Route for the home page
app.get("/", (req, res) => {
    res.render("index");
});

// Dashboard Route
app.get("/dashboard", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    try {
        const users = await User.find();  // Hent alle brugere
        const animals = await Animal.find({ userId: { $exists: false } });  // Hent alle dyr
        const activities = [
            "Ny hund oprettet: Bella (2 år)",
            "Ny bruger oprettet: John Doe",
            "Adoption: Simba er blevet adopteret!"
        ];  // Aktiviteter

        // Hvis brugerens rolle er admin, vis admin-dashboard, ellers vis bruger-dashboard
        if (req.session.role === 'admin') {
            res.render("dashboardadmin", {
                username: req.session.username,
                userCount: users.length,  // Antal brugere
                animalCount: animals.length,  // Antal dyr
                animals: animals,
                activities: activities
            });
        } else {
            res.render("dashboard", {
                username: req.session.username,
                userCount: users.length,  // Antal brugere
                animalCount: animals.length,  // Antal dyr
                animals: animals,
                activities: activities
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl under hentning af data til dashboard");
    }
});

// Route for displaying the edit-user form (for the logged-in user)
app.get("/edit-user", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/login");  // Redirect to login if no user is logged in
    }

    try {
        const user = await User.findById(req.session.userId);  // Find the current logged-in user
        if (!user) {
            return res.status(404).send("Brugeren blev ikke fundet.");
        }
        res.render("edit-user", { user });  // Render the edit-user form with current user data
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl ved hentning af bruger til opdatering.");
    }
});

app.get('/myadoptions', async (req, res) => {
    try {
        const userId = req.session.userId; // Antag at sessionen gemmer userId
        if (!userId) {
            return res.redirect('/login');
        }

        // Hent adoptioner fra databasen baseret på userId
        const userAdoptions = await Animal.find({ userId }); // Brug Pet her

        res.render('myadoptions', { username: req.session.username, userAdoptions });
    } catch (err) {
        console.error(err);
        res.status(500).send("Noget gik galt!");
    }
});



// Route for serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
    console.log(`Serveren kører på http://localhost:${port}`);
});