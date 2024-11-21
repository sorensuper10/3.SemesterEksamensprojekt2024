require("dotenv").config(); // Indlæs .env-filen

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const userRoute = require("./routes/userRoute");

const app = express();

// Miljøkonfiguration
const port = process.env.PORT || 3000;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Session setup
app.use(session({
    secret: "hemmeligNøgle",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Sæt til true, når HTTPS er aktiveret
}));

// Forbindelse til MongoDB
mongoose.connect(dbConnectionString, {})
    .then(() => console.log("Forbundet til MongoDB Atlas!"))
    .catch((err) => {
        console.error("Kunne ikke forbinde til MongoDB:", err);
        process.exit(1);
    });

// Brug ruter
app.use(userRoute);

// Startside
app.get("/", (req, res) => {
    res.render("index");
});

// Server lytning
app.listen(port, () => {
    console.log(`Server kører på http://localhost:${port}`);
});