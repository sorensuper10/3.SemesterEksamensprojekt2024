require("dotenv").config();  // Indlæs .env-filen

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const userRoute = require("./routes/userRoute");
const petRoutes = require("./routes/petRoutes");
const User = require("./models/userModel");  // Antager du har en User-model
const Animal = require("./models/petModel");  // Antager du har en Animal-model
const path = require("path");

const port = process.env.PORT || 3000;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "hemmeligNøgle",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Mongoose connection
mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);  // Stop appen, hvis der er fejl
    });

app.use(userRoute);
app.use(petRoutes);

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
        const animals = await Animal.find();  // Hent alle dyr
        const activities = [
            "Ny hund oprettet: Bella (2 år)",
            "Ny bruger oprettet: John Doe",
            "Adoption: Simba er blevet adopteret!"
        ];  // Aktiviteter, som du kan hente dynamisk senere

        res.render("dashboard", {
            username: req.session.username,
            userCount: users.length,  // Antal brugere
            animalCount: animals.length,  // Antal dyr
            animals: animals,
            activities: activities
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error while getting data for the dashboard");
    }
});

app.listen(port, () => {
    console.log("Serveren kører på http://localhost:3000");
});
